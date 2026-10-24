import { LitElement, html, css, svg } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { HomeAssistant } from '../lib/types'
import {
  COLOR_NIGHT, COLOR_ASTRO, COLOR_NAUT, COLOR_CIVIL, COLOR_DAY,
  elToZone,
  buildRawEvents, buildSlotEvents,
  startColorFromPrev, addCarryOvers, renderYearColumn, daySlotsFromCurves,
  getAxisFont, getDividerColor, interpolateElevation,
  drawSun, drawMoon, drawHalfHalf,
  type DayData, type SunDayResult,
} from '../lib/sun-zones'
import { setupCanvasCtx, localDateString, haLocalDateString, haLocalMinutesOfDay } from '../lib/utils'
import { cardDotStyles } from '../lib/shared-styles'
import { TwilightLocalizeMixin } from '../lib/i18n'

// ---------------------------------------------------------------------------
// Sun Year Card — year canvas (zone fills + reference curves)
// Mirrors the year-canvas logic from timeline-view.ts exactly.
// Emits 'date-selected' CustomEvent when user clicks a day.
// ---------------------------------------------------------------------------

const PAD_LEFT   = 50
const PAD_RIGHT  = 20
const PAD_TOP    = 0
const PAD_BOTTOM = 30
const YEAR_FB_H  = 300

const USE_CLAMPED_LINES = true // If true, reference lines represent clamped slot times. If false, natural solar times.

let clipIdCounter = 0

@customElement('twilight-sun-year-card')
export class SunYearCard extends TwilightLocalizeMixin(LitElement) {
  private readonly _clipId = `rect-clip-${++clipIdCounter}`

  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ type: Number }) year = new Date().getFullYear()
  @property({ type: String }) selectedDate = localDateString()
  @property({ type: Boolean }) clamped = false
  @property({ type: Boolean }) noHeader = false
  @property({ type: Boolean }) noAxisLabels = false
  @property({ type: Boolean }) showSlots = false
  @property({ type: Boolean }) noSolarNoonMidnight = false
  @property({ type: Boolean }) scatterMode = false

  @property({ attribute: false }) sunData: SunDayResult | null = null
  @property({ attribute: false }) hoverTime: number | null = null
  @property({ type: Number }) hoverIdx: number | null = null
  @property({ attribute: false }) days: DayData[] = []
  // null entries = zone absent that day (polar day/night) — rendered as a gap.
  @property({ attribute: false }) slotCurves: Record<string, (number | null)[]> | null = null
  @property({ type: Number }) liveTime: number | null = null

  @state() private _w = 0

  private _ro: ResizeObserver | null = null

  static styles = [
    cardDotStyles,
    css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: 0;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: clip;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px 12px;
    }
    .card-dot {
      margin-left: 3px;
    }
    .card-title {
      flex: 1;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin-left: 3px;
    }
    .wrap {
      position: relative;
      flex: 1;
      min-height: 0;
      min-width: 0;
    }
    canvas {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: crosshair;
    }
    svg.overlay {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      overflow: visible;
    }
    svg.overlay text.axis-label {
      fill: var(--secondary-text-color, rgba(255, 255, 255, 0.65));
    }
    svg.overlay line.grid-line {
      stroke: rgba(255, 255, 255, 0.15);
    }
    .hit-area {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      cursor: crosshair;
      z-index: 2;
    }
  `]

  // No own tick: the parent (timeline-view.ts) re-renders every second via
  // its own setInterval and passes a fresh `liveTime`, which triggers a
  // redraw via the updated() handler below (changed.has('liveTime')).
  connectedCallback() {
    super.connectedCallback()
  }

  disconnectedCallback() {
    // Clear the reference too: updated() only creates a new observer while
    // `_ro` is falsy, so keeping the disconnected instance meant the card was
    // never observed again after a reconnect (tab switch) — it kept whatever
    // width it had and stopped redrawing on resize.
    this._ro?.disconnect()
    this._ro = null
    super.disconnectedCallback()
  }

  updated(changed: Map<string, unknown>) {
    if (!this._ro) {
      const wrap = this.shadowRoot?.querySelector('.wrap')
      if (wrap) {
        this._ro = new ResizeObserver(entries => {
          const w = entries[0].contentRect.width
          if (w > 0 && w !== this._w) { this._w = w; this._draw() }
        })
        this._ro.observe(wrap)
      }
    }

    if (changed.has('days') || changed.has('selectedDate') ||
        changed.has('clamped') || changed.has('showSlots') || changed.has('noSolarNoonMidnight') || changed.has('scatterMode') ||
        changed.has('sunData') || changed.has('hoverIdx') ||
        changed.has('liveTime') || changed.has('slotCurves'))
      requestAnimationFrame(() => this._draw())
  }

  private _getLiveTime(): number {
    // Fallback for standalone use (no parent-supplied `liveTime`) — must use
    // HA's timezone, not the browser's, or the live marker drifts from the
    // chart data whenever they differ.
    return haLocalMinutesOfDay(this.hass)
  }

  private _todayIdx(): number {
    // Fallback for standalone use (no parent-supplied `liveTime`/`selectedDate`)
    // — mirrors _getLiveTime()'s HA-timezone anchor, not the browser's, or the
    // "today" column drifts from the chart data whenever they differ.
    return this.days.findIndex(d => d.date === haLocalDateString(this.hass))
  }

  private _interpolateEl(t: number): number {
    return interpolateElevation(this.sunData?.points ?? [], t)
  }

  private _draw() {
    const canvas = this.shadowRoot?.querySelector<HTMLCanvasElement>('canvas')
    if (!canvas) return
    const days = this.days, n = days.length
    if (!n || !this._w) return

    const cssW = this._w
    const H = canvas.getBoundingClientRect().height || YEAR_FB_H
    const ctx = setupCanvasCtx(canvas, cssW, H)

    const padLeft = this.noAxisLabels ? 10 : PAD_LEFT
    const padRight = this.noAxisLabels ? 10 : PAD_RIGHT
    const padTop = this.noAxisLabels ? 10 : PAD_TOP
    const padBottom = this.noAxisLabels ? 10 : PAD_BOTTOM
    const innerW = cssW - padLeft - padRight
    const innerH = H - padTop - padBottom
    const plotT = padTop, plotB = padTop + innerH
    const plotL = padLeft, plotR = padLeft + innerW
    const C = 1440
    const my = (m: number) => plotT + innerH - (Math.max(0, Math.min(C, m)) / C) * innerH

    // --- 1. Base Fill ---
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(plotL, plotT, innerW, innerH, 8)
    ctx.fillStyle = COLOR_NIGHT
    ctx.fill()
    ctx.restore()

    // --- Start clipping for the graph interior ---
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(plotL, plotT, innerW, innerH, 8)
    ctx.clip()

    // ── Zone fills ──────────────────────────────────────────────────────────
    if (!this.scatterMode) {
      const useSlot = this.clamped
      // With an area selected, the SLOTS/CLAMPED fill follows that area's
      // resolved slot offsets — same source the reference curves use — so fill
      // and lines can't disagree. Without one, slotCurves is null and the
      // generic per-day zones are drawn.
      const sc = this.slotCurves
      const dayFor = (idx: number): DayData =>
        useSlot && sc ? daySlotsFromCurves(days[idx], sc, idx) : days[idx]
      for (let i = 0; i < n; i++) {
        const d = dayFor(i), p = i > 0 ? dayFor(i - 1) : null
        const xS = i === 0     ? plotL : plotL + ((i - 0.5) / (n - 1)) * innerW
        const xE = i === n - 1 ? plotR : plotL + ((i + 0.5) / (n - 1)) * innerW
        const cW = xE - xS + 0.5
        const ownEvs = useSlot ? buildSlotEvents(d) : buildRawEvents(d)
        if (ownEvs.length === 0) {
          ctx.fillStyle = elToZone(d.midnight_el); ctx.fillRect(xS, plotT, cW, innerH); continue
        }
        const evs = [...ownEvs]
        if (p) addCarryOvers(evs, p, d, useSlot)
        evs.sort((a, b) => a.t - b.t)
        renderYearColumn(ctx, xS, cW, evs, startColorFromPrev(p, d, useSlot), my, C)
      }
    } else {
      // Scatter / wireframe mode
      const drawContour = (color: string, dk: Exclude<keyof DayData, 'date'>, uk: Exclude<keyof DayData, 'date'>) => {
        const dv = days.map(d => d[dk] as number | null)
        const uv = days.map(d => d[uk] as number | null)
        ctx.strokeStyle = color; ctx.lineWidth = 1
        let seg: number[] = []
        const renderSeg = (s: number[]) => {
          if (!s.length) return
          ctx.beginPath()
          let hL = false, lW = 0, lX = 0, lY = 0
          const movePlot = (x: number, y: number) => { ctx.moveTo(x, y); hL = true; lW = ((y - plotT) / innerH * C) | 0; lX = x; lY = y }
          const linePlot = (x: number, y: number, v: number, idx: number) => {
            const diff = Math.abs(v - lW)
            const hasTz = (k: number) => k > 0 && k < n && days[k].tz_offset !== days[k - 1].tz_offset
            const isDst = hasTz(idx) || hasTz(idx - 1) || hasTz(idx + 1)
            if (diff > 120) { movePlot(x, y) }
            else if (isDst && diff > 30) {
              const xh = (lX + x) / 2
              ctx.lineTo(xh, lY); ctx.moveTo(xh, y); ctx.lineTo(x, y)
              lW = v; lX = x; lY = y
            } else { ctx.lineTo(x, y); lW = v; lX = x; lY = y }
          }
          for (const i of s) {
            const v = dv[i]; if (v === null) continue
            const x = plotL + (i / (n - 1)) * innerW
            const w = ((v % 1440) + 1440) % 1440; const y = my(w)
            if (!hL) movePlot(x, y); else linePlot(x, y, w, i)
          }
          for (let idx = s.length - 1; idx >= 0; idx--) {
            const i = s[idx]; const v = uv[i]; if (v === null) continue
            const x = plotL + (i / (n - 1)) * innerW
            const w = ((v % 1440) + 1440) % 1440; const y = my(w)
            if (!hL) movePlot(x, y); else linePlot(x, y, w, i)
          }
          ctx.stroke()
        }
        for (let i = 0; i < n; i++) {
          if (dv[i] !== null && uv[i] !== null) seg.push(i)
          else { if (seg.length) { renderSeg(seg); seg = [] } }
        }
        if (seg.length) renderSeg(seg)
      }
      drawContour(COLOR_ASTRO, 'astro_dawn',    'astro_dusk')
      drawContour(COLOR_NAUT,  'nautical_dawn', 'nautical_dusk')
      drawContour(COLOR_CIVIL, 'dawn',          'dusk')
      drawContour(COLOR_DAY,   'sunrise',       'sunset')
    }

    // ── Reference curves ────────────────────────────────────────────────────
    const drawCurve = (color: string, vals: (number | null)[], width = 1.5, glow?: string) => {
      ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width
      if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = 8 }
      ctx.beginPath()
      const xS = (i: number) => i === 0     ? plotL : plotL + ((i - 0.5) / (n - 1)) * innerW
      const xE = (i: number) => i === n - 1 ? plotR : plotL + ((i + 0.5) / (n - 1)) * innerW
      for (let i = 0; i < n; i++) {
        const v = vals[i]; if (v === null) continue
        const y = my((v % C + C) % C)
        ctx.moveTo(xS(i), y); ctx.lineTo(xE(i), y)
      }
      ctx.stroke(); ctx.restore()
    }
    if (!this.noSolarNoonMidnight) {
      // Solar-noon line: soft yellow glow instead of a dark outline stroke.
      drawCurve('rgba(255,214,0,1)',  days.map(d => d.solar_noon), 1.5, 'rgba(255, 214, 0, 0.6)')
      drawCurve('rgba(60,100,200,1)', days.map(d => d.solar_midnight))
    }
    if (this.showSlots) {
      if (this.slotCurves) {
        const sc = this.slotCurves
        drawCurve('rgba(255,255,255,0.75)', sc['civil_dusk']    ?? [])
        drawCurve('rgba(255,255,255,0.60)', sc['nautical_dusk'] ?? [])
        drawCurve('rgba(255,255,255,0.45)', sc['astro_dusk']    ?? [])
        drawCurve('rgba(255,255,255,0.30)', sc['night']         ?? [])
        drawCurve('rgba(255,255,255,0.30)', sc['astro_dawn']    ?? [])
        drawCurve('rgba(255,255,255,0.45)', sc['nautical_dawn'] ?? [])
        drawCurve('rgba(255,255,255,0.60)', sc['civil_dawn']    ?? [])
        drawCurve('rgba(255,255,255,0.75)', sc['gold_dawn']     ?? [])
        drawCurve('rgba(255,255,255,0.75)', sc['day']           ?? [])
        drawCurve('rgba(255,255,255,0.75)', sc['gold_dusk']     ?? [])
      } else if (USE_CLAMPED_LINES) {
        drawCurve('rgba(255,255,255,0.75)', days.map(d => d.slot_sunset))
        drawCurve('rgba(255,255,255,0.60)', days.map(d => d.slot_nautical_dusk))
        drawCurve('rgba(255,255,255,0.45)', days.map(d => d.slot_astro_dusk))
        drawCurve('rgba(255,255,255,0.30)', days.map(d => d.slot_night))
        drawCurve('rgba(255,255,255,0.30)', days.map(d => d.slot_astro_dawn))
        drawCurve('rgba(255,255,255,0.45)', days.map(d => d.slot_nautical_dawn))
        drawCurve('rgba(255,255,255,0.60)', days.map(d => d.slot_civil_dawn))
        drawCurve('rgba(255,255,255,0.75)', days.map(d => d.slot_sunrise))
        drawCurve('rgba(255,255,255,0.75)', days.map(d => d.slot_gold_dawn))
        drawCurve('rgba(255,255,255,0.75)', days.map(d => d.slot_day))
        drawCurve('rgba(255,255,255,0.75)', days.map(d => d.slot_gold_dusk))
      } else {
        drawCurve('rgba(255,255,255,0.75)', days.map(d => d.sunset        ?? null))
        drawCurve('rgba(255,255,255,0.60)', days.map(d => d.dusk          ?? null))
        drawCurve('rgba(255,255,255,0.45)', days.map(d => d.nautical_dusk ?? null))
        drawCurve('rgba(255,255,255,0.30)', days.map(d => d.astro_dusk    ?? null))
        drawCurve('rgba(255,255,255,0.30)', days.map(d => d.astro_dawn    ?? null))
        drawCurve('rgba(255,255,255,0.45)', days.map(d => d.nautical_dawn ?? null))
        drawCurve('rgba(255,255,255,0.60)', days.map(d => d.dawn          ?? null))
        drawCurve('rgba(255,255,255,0.75)', days.map(d => d.sunrise       ?? null))
      }
    }

    // ── Today + selected markers ─────────────────────────────────────────────
    const ti = this._todayIdx()
    if (ti >= 0) {
      const x = plotL + (ti / (n - 1)) * innerW
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3])
      ctx.beginPath(); ctx.moveTo(x, plotT); ctx.lineTo(x, plotB); ctx.stroke(); ctx.restore()
    }
    const si = this.days.findIndex(d => d.date === this.selectedDate)
    if (si >= 0 && si !== ti) {
      const x = plotL + (si / (n - 1)) * innerW
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([2, 2])
      ctx.beginPath(); ctx.moveTo(x, plotT); ctx.lineTo(x, plotB); ctx.stroke(); ctx.restore()
    }

    // End clipping
    ctx.restore()

    // --- Outer Frame / Border ---
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(plotL, plotT, innerW, innerH, 8)
    ctx.strokeStyle = getDividerColor(this)
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.restore()

    // ── Sun/moon indicator ───────────────────────────────────────────────────
    const t = this.liveTime ?? this._getLiveTime()
    let idx = si; if (idx === -1) idx = ti
    if (idx >= 0 && idx < n) {
      const tx = plotL + (idx / (n - 1)) * innerW
      const ty = my(t)
      const el = this._interpolateEl(t)
      if (el >= 0) drawSun(ctx, tx, ty)
      else if (el >= -6) drawHalfHalf(ctx, tx, ty)
      else drawMoon(ctx, tx, ty)
    }

    ctx.restore()
  }

  // ── SVG axis overlay ───────────────────────────────────────────────────────

  private _renderAxis() {
    const cssW = this._w
    if (!cssW) return svg``
    const canvas = this.shadowRoot?.querySelector<HTMLCanvasElement>('canvas')
    const H = canvas ? (canvas.getBoundingClientRect().height || YEAR_FB_H) : YEAR_FB_H
    const padLeft = this.noAxisLabels ? 10 : PAD_LEFT
    const padRight = this.noAxisLabels ? 10 : PAD_RIGHT
    const padTop = this.noAxisLabels ? 10 : PAD_TOP
    const padBottom = this.noAxisLabels ? 10 : PAD_BOTTOM
    const innerW = cssW - padLeft - padRight
    const innerH = H - padTop - padBottom
    const plotT = padTop, plotB = padTop + innerH
    const my = (m: number) => plotT + innerH - (m / 1440) * innerH
    const n = this.days.length || 365

    const yLabels = Array.from({ length: 13 }, (_, i) => i * 2).map(hr => {
      const y = my(hr * 60)
      const showText = hr % 6 === 0 && hr !== 0 && hr !== 24
      const showLine = hr !== 0 && hr !== 24
      return svg`
        ${showText && !this.noAxisLabels ? svg`<text x=${padLeft - 6} y=${y} text-anchor="end" dominant-baseline="middle" class="axis-label" style="font: ${getAxisFont(this)}">${String(hr).padStart(1, '0')}:00</text>` : svg``}
        ${showLine ? svg`<line x1=${padLeft} y1=${y} x2=${padLeft + innerW} y2=${y} class="grid-line" stroke-width="0.5" clip-path="url(#${this._clipId})"/>` : svg``}
      `
    })

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const mDays  = [0,31,59,90,120,151,181,212,243,273,304,334]
    const mMids  = [15,45,74,105,135,166,196,227,258,288,319,349]
    const xLabels = months.map((m, mi) => {
      const xLine = padLeft + (Math.min(mDays[mi], n - 1) / (n - 1)) * innerW
      const xText = padLeft + (Math.min(mMids[mi], n - 1) / (n - 1)) * innerW
      return svg`
        ${mi > 0 ? svg`<line x1=${xLine} y1=${plotT} x2=${xLine} y2=${plotB} class="grid-line" stroke-width="0.5" clip-path="url(#${this._clipId})"/>` : svg``}
        ${!this.noAxisLabels ? svg`<text x=${xText} y=${plotB + 20} text-anchor="middle" class="axis-label" style="font: ${getAxisFont(this)}">${m}</text>` : svg``}`
    })

    const hov = this.hoverIdx !== null ? this.days[this.hoverIdx] : null
    const hovX = hov ? padLeft + (this.hoverIdx! / (n - 1)) * innerW : null

    return svg`
      <svg class="overlay" width="100%" height="100%">
        <defs>
          <clipPath id=${this._clipId}>
            <rect x=${padLeft} y=${plotT} width=${innerW} height=${innerH} rx="8" ry="8" />
          </clipPath>
        </defs>
        ${yLabels}
        ${xLabels}
        ${hovX !== null && hov ? svg`
          <line x1=${hovX} y1=${plotT} x2=${hovX} y2=${plotB} stroke="rgba(255,255,255,0.28)" stroke-width="1" stroke-dasharray="3 3" clip-path="url(#${this._clipId})"/>
        ` : ''}
      </svg>
    `
  }

  // ── Event handlers ─────────────────────────────────────────────────────────

  private _onMove(e: MouseEvent) {
    if (!this._w) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const padLeft = this.noAxisLabels ? 10 : PAD_LEFT
    const padRight = this.noAxisLabels ? 10 : PAD_RIGHT
    const innerW = this._w - padLeft - padRight
    const cx = e.clientX - rect.left
    this.hoverIdx = Math.round(Math.max(0, Math.min(1, (cx - padLeft) / innerW)) * (this.days.length - 1))
    const day = this.days[this.hoverIdx]
    this.dispatchEvent(new CustomEvent('year-hover-changed', {
      detail: { index: this.hoverIdx, date: day ? day.date : null },
      bubbles: true,
      composed: true
    }))
  }

  private _onLeave() {
    this.hoverIdx = null
    this.dispatchEvent(new CustomEvent('year-hover-changed', {
      detail: { index: null, date: null },
      bubbles: true,
      composed: true
    }))
  }

  private _onClick() {
    if (this.hoverIdx !== null && this.days[this.hoverIdx]) {
      const date = this.days[this.hoverIdx].date
      this.dispatchEvent(new CustomEvent('date-selected', { detail: date, bubbles: true, composed: true }))
    }
  }

  private _onTouchMove(e: TouchEvent) {
    if (!this._w) return
    const touch = e.touches[0]
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const padLeft = this.noAxisLabels ? 10 : PAD_LEFT
    const padRight = this.noAxisLabels ? 10 : PAD_RIGHT
    const innerW = this._w - padLeft - padRight
    const cx = touch.clientX - rect.left
    this.hoverIdx = Math.round(Math.max(0, Math.min(1, (cx - padLeft) / innerW)) * (this.days.length - 1))
    const day = this.days[this.hoverIdx]
    this.dispatchEvent(new CustomEvent('year-hover-changed', {
      detail: { index: this.hoverIdx, date: day ? day.date : null },
      bubbles: true,
      composed: true
    }))
  }

  private _onTouchEnd() {
    this.hoverIdx = null
    this.dispatchEvent(new CustomEvent('year-hover-changed', {
      detail: { index: null, date: null },
      bubbles: true,
      composed: true
    }))
  }

  render() {
    return html`
      ${!this.noHeader ? html`
        <div class="card-header">
          <span class="card-dot" style="--dot-color: #f59e0b;"></span>
          <span class="card-title" role="heading" aria-level="2">${this.t('sun_year_card.title')}</span>
        </div>
      ` : ''}
      <div class="wrap">
        <canvas tabindex="0" role="img" aria-label=${this.t('sun_year_card.title')}></canvas>
        ${this._renderAxis()}
        <div class="hit-area"
          @mousemove=${this._onMove}
          @mouseleave=${this._onLeave}
          @click=${this._onClick}
          @touchstart=${this._onTouchMove}
          @touchmove=${this._onTouchMove}
          @touchend=${this._onTouchEnd}
        ></div>
      </div>
    `
  }
}
