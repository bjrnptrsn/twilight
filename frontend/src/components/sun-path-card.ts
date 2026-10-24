import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { type HomeAssistant, type Slot, type ChannelConfig, PRIMARY_CHANNEL_ID } from '../lib/types'
import * as api from '../lib/api'
import {
  COLOR_NIGHT,
  GRID_COLOR,
  buildRawEvents, buildSlotEvents,
  startColorFromPrev, addCarryOvers, renderDayFills,
  getAxisFont, getTextColor, getDividerColor, interpolateElevation,
  drawSun, drawMoon, drawHalfHalf,
  type DayData, type SunDayResult, type ColEv,
} from '../lib/sun-zones'
import { setupCanvasCtx, slotSpanMinutes, localDateString, haLocalMinutesOfDay } from '../lib/utils'
import { cardDotStyles } from '../lib/shared-styles'
import { StaleGuard } from '../lib/stale-guard'
import { TwilightLocalizeMixin } from '../lib/i18n'

const CHANNEL_HUES = [
  210, // Indigo/Blue
  145, // Emerald/Green
  35,  // Amber/Warm Orange
  280, // Violet/Purple
  190, // Cyan/Teal
  330, // Rose/Pink
  15,  // Coral/Red
]

// ---------------------------------------------------------------------------
// Sun Path Card — day canvas (elevation curve + zone fills)
// Mirrors the day-canvas logic from timeline-view.ts exactly.
// ---------------------------------------------------------------------------

const PAD_LEFT   = 50
const PAD_RIGHT  = 20
const PAD_TOP    = 0
const PAD_BOTTOM = 30

// Left gutter (px) reserved for per-stripe channel labels in the noYAxis (area)
// layout — replaces the in-stripe pill labels. The label is drawn horizontally,
// right-aligned, word/char-wrapped and clamped to the stripe height so long names
// stay inside their own stripe. CHANNEL_LABEL_GAP is the gap between the text and
// the plot; the wrap width is the gutter minus that gap and a small left margin.
const CHANNEL_LABEL_GUTTER = 72
const CHANNEL_LABEL_GAP = 12
const CHANNEL_LABEL_LEFT_MARGIN = 2

// Left/right content inset (px) in the noYAxis (area) layout, matching the 20px
// content padding of the sibling cards so their left edges align. In this layout
// padLeft = CARD_CONTENT_PAD + CHANNEL_LABEL_GUTTER (inset, then the label gutter,
// then the plot); padRight = CARD_CONTENT_PAD.
const CARD_CONTENT_PAD = 20

const USE_CLAMPED_LINES = true // If true, reference lines represent clamped slot times. If false, natural solar times.

@customElement('twilight-sun-path-card')
export class SunPathCard extends TwilightLocalizeMixin(LitElement) {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ type: String }) date = localDateString()
  @property({ type: Boolean }) clamped = false
  @property({ type: Boolean }) noHeader = false
  @property({ type: Boolean }) noAxisLabels = false
  @property({ type: Boolean, reflect: true }) noYAxis = false
  @property({ type: Boolean }) showSlots = false
  @property({ type: Boolean }) primaryOnly = false
  @property({ type: Boolean }) noSolarNoonMidnight = false
  @property({ type: Number }) hoverTime: number | null = null
  @property({ type: Number }) liveTime: number | null = null
  @property({ type: Boolean, reflect: true }) embedded = false
  @property({ type: Boolean, reflect: true }) sparkline = false
  @property({ type: Object }) channels: Record<string, ChannelConfig> = {}
  @property({ type: String }) selectedChannelId = 'primary'
  // Per-channel slot lists, keyed by channel id ('primary' + custom ids). Used
  // for Y-position-aware hover/click resolution across all channel stripes.
  @property({ attribute: false }) channelSlotsMap: Record<string, Slot[]> = {}

  // Optional: pass pre-loaded data from parent to avoid duplicate WS calls
  @property({ attribute: false }) days: DayData[] = []
  @property({ attribute: false }) sunData: SunDayResult | null = null
  @property({ type: Array }) slots: Slot[] = []

  @state() private _days: DayData[] = []
  @state() private _sunData: SunDayResult | null = null
  @state() private _loading = false
  // Guards the day load against out-of-order responses when `date` changes.
  private _loadGuard = new StaleGuard()
  // Tracks which `date` self-loaded data belongs to. Using this instead of
  // `this.days.length` avoids a request-storm when embedded without
  // parent-supplied `.days`: every `hass` tick (a fresh object reference on
  // every HA state change) would otherwise re-trigger `_load()` forever
  // because `this.days` stays permanently empty.
  private _loadedForDate: string | null = null
  @state() private _w = 0

  // Cached stripe geometry from the last _draw(), used to resolve the channel
  // under the pointer from its Y position (each stripe is totalPlotH / N tall).
  private _geom: { plotT: number; stripeH: number; numStripes: number } | null = null

  private _ro: ResizeObserver | null = null

  static styles = [
    cardDotStyles,
    css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: 280px; /* Enforces a minimum height so it never collapses on mobile! */
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
    :host([embedded]) {
      background: transparent !important;
      backdrop-filter: none !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
      min-height: 160px !important;
      height: 180px;
    }
    :host([sparkline]) {
      background: transparent !important;
      backdrop-filter: none !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
      min-height: 0 !important;
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
    .canvas-wrap {
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
      cursor: ew-resize;
    }
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 13px;
      color: rgba(255,255,255,0.4);
    }
    /* Sparkline styles */
    .sparkline-container {
      position: relative;
      width: 100%;
      height: 16px;
      display: flex;
      align-items: center;
      margin: 6px 0;
    }
    .sparkline-bar {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: var(--bar-gradient);
      position: relative;
    }
    .sparkline-pointer {
      position: absolute;
      top: -3px;
      width: 6px;
      height: 12px;
      background: #fff;
      border-radius: 3px;
      box-shadow: 0 0 8px #fff, 0 0 12px #fff;
      transition: left 0.5s ease;
    }
    .sparkline-labels {
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: 9px;
      color: var(--secondary-text-color);
      opacity: 0.5;
      margin-top: 4px;
    }
  `]

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

  // No own tick: the parent (timeline-view.ts) re-renders every second via
  // its own setInterval and passes a fresh `liveTime`, which the `updated()`
  // handler below picks up (changed.has('liveTime')) to redraw.
  updated(changed: Map<string, unknown>) {
    if (!this._ro) {
      const wrap = this.shadowRoot?.querySelector('.canvas-wrap')
      if (wrap) {
        this._ro = new ResizeObserver(entries => {
          const w = entries[0].contentRect.width
          if (w > 0 && w !== this._w) { this._w = w; this._draw() }
        })
        this._ro.observe(wrap)
      }
    }
    // Use parent-supplied data if provided, else load ourselves
    if (changed.has('days') && this.days.length) this._days = this.days
    if (changed.has('sunData') && this.sunData)  this._sunData = this.sunData

    const needsLoad = changed.has('hass') || changed.has('date')
    if (needsLoad && this.hass && !this.days.length && this._loadedForDate !== this.date) this._load()

    if (changed.has('_sunData') || changed.has('_days') || changed.has('clamped') || changed.has('showSlots') || changed.has('primaryOnly') || changed.has('noSolarNoonMidnight') || changed.has('noYAxis') || changed.has('hoverTime') || changed.has('liveTime') || changed.has('channels') || changed.has('selectedChannelId') || changed.has('channelSlotsMap'))
      requestAnimationFrame(() => this._draw())
  }

  private async _load() {
    if (!this.hass) return
    this._loading = true
    // `date` can change while the request is in flight — a stale day's curve
    // must not replace the newer one.
    const token = this._loadGuard.begin()
    const requestedDate = this.date
    try {
      const sun = await api.sunDay(this.hass, { date: requestedDate })
      if (!token.isCurrent()) return
      this._sunData = sun

      const daysList: DayData[] = []
      if (sun.prev_day_data) {
        daysList.push(sun.prev_day_data)
      }
      if (sun.day_data) {
        daysList.push(sun.day_data)
      }
      this._days = daysList
      this._loadedForDate = requestedDate
    } catch (err) {
      console.error('twilight-sun-path-card: failed to load day data', err)
      // Still mark this date as "attempted" even on failure — otherwise a
      // persistent backend error would re-fire _load() (and its WS request)
      // on every subsequent hass tick instead of just once per date.
      if (token.isCurrent()) this._loadedForDate = requestedDate
    } finally {
      if (token.isCurrent()) this._loading = false
    }
  }



  private _getLiveTime(): number {
    // Fallback for standalone use (no parent-supplied `liveTime`, e.g. the
    // Lab views) — must use HA's timezone, not the browser's, or the live
    // marker drifts from the chart data whenever they differ.
    return haLocalMinutesOfDay(this.hass)
  }

  private _interpolateEl(t: number): number {
    return interpolateElevation(this._sunData?.points ?? [], t)
  }

  private _draw() {
    const canvas = this.shadowRoot?.querySelector<HTMLCanvasElement>('canvas')
    const sunData = this._sunData ?? this.sunData
    if (!canvas || !sunData || !this._w) return
    const { points } = sunData
    if (!points.length) return

    const cssW = this._w
    const cssH = canvas.getBoundingClientRect().height
    if (!cssH) return

    const ctx = setupCanvasCtx(canvas, cssW, cssH)
    // noYAxis drops the degree labels and instead reserves a left inset (matching
    // the sibling cards' 20px content padding) plus a gutter for the per-stripe
    // channel-name labels. The time axis (padBottom) is unaffected. noAxisLabels
    // still collapses all padding.
    const padLeft = this.noAxisLabels ? 10 : (this.noYAxis ? CARD_CONTENT_PAD + CHANNEL_LABEL_GUTTER : PAD_LEFT)
    const padRight = this.noAxisLabels ? 10 : (this.noYAxis ? CARD_CONTENT_PAD : PAD_RIGHT)
    const padTop = this.noAxisLabels ? 10 : PAD_TOP
    const padBottom = this.noAxisLabels ? 10 : PAD_BOTTOM
    const innerW = cssW - padLeft - padRight
    const totalPlotH = cssH - padTop - padBottom

    // Two-layer model: the full plot height is split into N equal horizontal
    // stripes (N = primary + custom channels), each showing one channel's slots.
    // The curve layer (glow/horizon/sun) always spans the full height on top.
    const customChannelIds = this.primaryOnly
      ? []
      : Object.keys(this.channels || {}).filter(id => id !== 'primary')
    const numCustom = customChannelIds.length
    const numStripes = 1 + numCustom
    const stripeH = totalPlotH / numStripes

    const primaryH = totalPlotH
    const plotT = padTop, plotB = padTop + primaryH
    const plotL = padLeft, plotR = padLeft + innerW
    const yHorizon = plotT + totalPlotH / 2
    const C = 1440

    // Cache stripe geometry so pointer handlers can map a Y position → channel.
    this._geom = { plotT, stripeH, numStripes }

    const lat = sunData.lat ?? 50
    const absLat = Math.abs(lat)
    const yearlyMax = absLat <= 23.44 ? 90 : (113.44 - absLat)
    const maxAbsEl = Math.max(yearlyMax, ...points.map(p => Math.abs(p.elevation))) + 10

    const gx = (t: number) => plotL + (t / C) * innerW
    const gy = (el: number) => yHorizon - (el / maxAbsEl) * (primaryH / 2)

    // 1. Zone fills — identical to timeline-view day canvas
    // --- 1. Base Fill ---
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(plotL, plotT, innerW, totalPlotH, 8)
    ctx.fillStyle = COLOR_NIGHT
    ctx.fill()
    ctx.restore()

    // Global clip to enforce rounded corners for both main graph fills and custom bands
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(plotL, plotT, innerW, totalPlotH, 8)
    ctx.clip()

    // --- Fills layer: primary channel occupies the top stripe (1/N of the
    // total height); with no custom channels stripeH === totalPlotH (unchanged).
    const primaryFillH = stripeH
    ctx.save()
    ctx.beginPath()
    ctx.rect(plotL, plotT, innerW, primaryFillH)
    ctx.clip()

    // 1. Zone fills — identical to timeline-view day canvas
    const days = this._days.length ? this._days : this.days
    const selIdx = days.findIndex(d => d.date === this.date)
    const selDay = selIdx >= 0 ? days[selIdx] : null
    const prevDay = selIdx > 0 ? days[selIdx - 1] : null

    const primarySlots = this.channelSlotsMap?.[PRIMARY_CHANNEL_ID] ?? (this.slots?.length ? this.slots : null)
    if (primarySlots && primarySlots.length > 0) {
      const norm = (m: number) => ((m % 1440) + 1440) % 1440
      const sorted = [...primarySlots].sort((a, b) => norm(a.from) - norm(b.from))
      const evs: ColEv[] = sorted.map(s => ({ t: norm(s.from), c: s.color }))
      const startC = sorted.length > 0 ? sorted[sorted.length - 1].color : COLOR_NIGHT
      renderDayFills(ctx, plotL, plotT, primaryFillH, plotR, evs, startC, gx, C)
    } else if (selDay) {
      const useSlot = this.clamped
      const ownEvs = useSlot ? buildSlotEvents(selDay) : buildRawEvents(selDay)
      const evs = [...ownEvs]
      if (prevDay) addCarryOvers(evs, prevDay, selDay, useSlot)
      evs.sort((a, b) => a.t - b.t)
      const startC = startColorFromPrev(prevDay, selDay, useSlot)
      renderDayFills(ctx, plotL, plotT, primaryFillH, plotR, evs, startC, gx, C)
    } else {
      ctx.fillStyle = COLOR_NIGHT; ctx.fillRect(plotL, plotT, innerW, primaryFillH)
    }
    ctx.restore()

    // 9.5 Custom channel stripes — part of the fills layer, drawn BEFORE the
    // curve layer so the sun curve sits on top of all stripes.
    this._drawCustomStripes(ctx, customChannelIds, selDay, prevDay, sunData, plotL, plotT, plotR, innerW, stripeH, gx)

    // Curve layer starts here, spanning the full totalPlotH over all stripes.
    ctx.save()
    ctx.beginPath()
    ctx.rect(plotL, plotT, innerW, totalPlotH)
    ctx.clip()

    // 2. Glow fill above horizon
    ctx.save()
    ctx.beginPath(); ctx.moveTo(plotL, yHorizon)
    for (const p of points) ctx.lineTo(gx(p.time), gy(p.elevation))
    ctx.lineTo(plotR, yHorizon); ctx.closePath()
    const grd = ctx.createLinearGradient(0, plotT, 0, yHorizon)
    grd.addColorStop(0, 'rgba(249,217,118,0.11)'); grd.addColorStop(1, 'rgba(249,217,118,0.01)')
    ctx.fillStyle = grd; ctx.fill(); ctx.restore()

    // 4. Horizon line
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(plotL, yHorizon); ctx.lineTo(plotR, yHorizon); ctx.stroke(); ctx.restore()

    // 5. Sun curve. Draw the full path once (gradient: warm above the horizon,
    //    dark below), then re-stroke only the above-horizon segments with a soft
    //    yellow glow — so the glow tracks the daylight part and never haloes the
    //    dark night portion of the line.
    const sg = ctx.createLinearGradient(0, plotT, 0, plotB)
    sg.addColorStop(0, '#f9d976'); sg.addColorStop(0.47, '#e8a020')
    sg.addColorStop(0.53, '#34507a'); sg.addColorStop(1, '#1b233a')

    ctx.save()
    ctx.beginPath()
    let first = true
    for (const p of points) {
      const x = gx(p.time), y = gy(p.elevation)
      if (first) { ctx.moveTo(x, y); first = false } else ctx.lineTo(x, y)
    }
    ctx.strokeStyle = sg; ctx.lineWidth = 2; ctx.stroke()
    ctx.restore()

    // Glow overlay: only the daylight (elevation >= 0) portion.
    ctx.save()
    ctx.strokeStyle = sg; ctx.lineWidth = 2
    ctx.shadowColor = 'rgba(249, 217, 118, 0.55)'; ctx.shadowBlur = 8
    ctx.beginPath()
    let penDown = false
    for (const p of points) {
      const x = gx(p.time), y = gy(p.elevation)
      if (p.elevation >= 0) {
        if (!penDown) { ctx.moveTo(x, y); penDown = true } else ctx.lineTo(x, y)
      } else {
        penDown = false
      }
    }
    ctx.stroke()
    ctx.restore()

    // 9. Grid horizontal lines (hidden together with the Y-axis labels)
    if (!this.noYAxis) {
      for (const el of [-18, -12, -6, 0, 30, 60]) {
        const y = gy(el)
        if (y < plotT - 2 || y > plotB + 2) continue
        if ([-18, -12, -6, 0].includes(el)) {
          ctx.save(); ctx.strokeStyle = GRID_COLOR; ctx.lineWidth = 0.5; ctx.setLineDash([3, 4])
          ctx.beginPath(); ctx.moveTo(plotL, y); ctx.lineTo(plotR, y); ctx.stroke(); ctx.restore()
        }
      }
    }

    // End clipping (curve layer)
    ctx.restore()

    // 6. Live time position (drawn as vertical line below, after all layers)
    const liveT = this.liveTime ?? this._getLiveTime()
    const liveEl = this._interpolateEl(liveT)
    const sx = gx(liveT), sy = gy(liveEl)

    // 3b. Boundary reference lines. These are Primary-channel slot boundaries,
    // so with custom stripes present they must stay within the primary (top)
    // stripe and not bleed into other channels' stripes (each channel draws its
    // own boundaries in _drawCustomStripes). yEnd defaults to the primary stripe
    // bottom; solar noon/midnight span the full height as shared time markers.
    const primaryStripeB = plotT + stripeH
    const drawVRef = (mins: number | null, color: string, dash: number[] = [], yEnd: number = primaryStripeB) => {
      if (mins === null) return
      const x = gx(((mins % C) + C) % C)
      ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.setLineDash(dash)
      ctx.beginPath(); ctx.moveTo(x, plotT); ctx.lineTo(x, yEnd); ctx.stroke(); ctx.restore()
    }
    if (!this.noSolarNoonMidnight) {
      drawVRef(selDay?.solar_noon     ?? null, 'rgba(255,214,0,0.7)', [], plotT + totalPlotH)
      drawVRef(selDay?.solar_midnight ?? null, 'rgba(60,100,200,0.7)', [], plotT + totalPlotH)
    }
    if (this.showSlots) {
      const primarySlots = this.channelSlotsMap?.[PRIMARY_CHANNEL_ID] ?? (this.slots?.length ? this.slots : null)
      if (primarySlots && primarySlots.length > 0) {
        for (const s of primarySlots) {
          drawVRef(s.from, 'rgba(255,255,255,0.65)')
        }
      } else if (selDay) {
        if (USE_CLAMPED_LINES) {
          drawVRef(selDay.slot_sunset,        'rgba(255,255,255,0.75)')
          drawVRef(selDay.slot_nautical_dusk, 'rgba(255,255,255,0.60)')
          drawVRef(selDay.slot_astro_dusk,    'rgba(255,255,255,0.45)')
          drawVRef(selDay.slot_night,         'rgba(255,255,255,0.30)')
          drawVRef(selDay.slot_astro_dawn,    'rgba(255,255,255,0.30)')
          drawVRef(selDay.slot_nautical_dawn, 'rgba(255,255,255,0.45)')
          drawVRef(selDay.slot_civil_dawn,    'rgba(255,255,255,0.60)')
          drawVRef(selDay.slot_sunrise,       'rgba(255,255,255,0.75)')
          drawVRef(selDay.slot_day,           'rgba(255,255,255,0.65)')
          drawVRef(selDay.slot_gold_dusk,     'rgba(255,255,255,0.65)')
        } else {
          drawVRef(selDay.sunset,        'rgba(255,255,255,0.75)')
          drawVRef(selDay.dusk,          'rgba(255,255,255,0.60)')
          drawVRef(selDay.nautical_dusk, 'rgba(255,255,255,0.45)')
          drawVRef(selDay.astro_dusk,    'rgba(255,255,255,0.30)')
          drawVRef(selDay.astro_dawn,    'rgba(255,255,255,0.30)')
          drawVRef(selDay.nautical_dawn, 'rgba(255,255,255,0.45)')
          drawVRef(selDay.dawn,          'rgba(255,255,255,0.60)')
          drawVRef(selDay.sunrise,       'rgba(255,255,255,0.75)')
        }
      }
    }

    // 8b. Grid vertical lines — drawn after custom bands so they aren't overdrawn by them
    for (const t of [0, 360, 720, 1080, 1440]) {
      const x = gx(t)
      ctx.save(); ctx.strokeStyle = GRID_COLOR; ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(x, plotT); ctx.lineTo(x, plotT + totalPlotH); ctx.stroke(); ctx.restore()
    }

    // 6b. Live time vertical line — drawn after custom bands so it isn't overdrawn by them
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3])
    ctx.beginPath(); ctx.moveTo(sx, plotT); ctx.lineTo(sx, plotT + totalPlotH); ctx.stroke(); ctx.restore()

    // 7b. Hover scrub line — drawn after custom bands so it isn't overdrawn by them
    if (this.hoverTime !== null) {
      const hx = gx(this.hoverTime)
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3])
      ctx.beginPath(); ctx.moveTo(hx, plotT); ctx.lineTo(hx, plotT + totalPlotH); ctx.stroke(); ctx.restore()
    }

    // End global clip
    ctx.restore()

    // --- 10. Outer Frame / Border ---
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(plotL, plotT, innerW, totalPlotH, 8)
    ctx.strokeStyle = getDividerColor(this)
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.restore()

    // --- 11. Unclipped items (Suns, moons, text) ---
    // Sonne/Mond zeichnen
    if (liveEl >= 0) drawSun(ctx, sx, sy)
    else if (liveEl >= -6) drawHalfHalf(ctx, sx, sy)
    else drawMoon(ctx, sx, sy)

    // X-axis text
    if (!this.noAxisLabels) {
      ctx.fillStyle = getTextColor(this); ctx.font = getAxisFont(this)
      for (const t of [0, 360, 720, 1080, 1440]) {
        const x = gx(t)
        ctx.textAlign = t === 0 ? 'start' : t === 1440 ? 'end' : 'center'
        ctx.fillText(`${String(t / 60 | 0).padStart(2, '0')}:00`, x, plotT + totalPlotH + 20)
      }
    }

    // Y-axis text
    if (!this.noAxisLabels && !this.noYAxis) {
      ctx.font = getAxisFont(this); ctx.textAlign = 'end'
      for (const el of [-18, -12, -6, 0, 30, 60]) {
        const y = gy(el)
        if (y < plotT - 10 || y > plotB + 10) continue
        const ty = Math.min(Math.max(y, plotT + 10), plotB - 6)
        if ([0, 30, 60, -18].includes(el)) { ctx.fillStyle = getTextColor(this); ctx.fillText(`${el}°`, plotL - 6, ty + 4) }
      }
    }

    // Channel names as vertical Y-axis labels (replaces the in-stripe pills).
    if (this.noYAxis && !this.noAxisLabels) {
      this._drawChannelAxisLabels(ctx, ['primary', ...customChannelIds], plotL, plotT, stripeH)
    }

    ctx.restore()
  }

  // Maps sun elevation to a lightness ratio 0..1 (dark at night, bright by day).
  // Continuous analogue of elToZone(): anchored at the astronomical twilight
  // band (-18°) up to full daylight, so custom-channel slots track the actual
  // time of day the same way the primary channel's zone colors do.
  private _elevationToLightRatio(el: number): number {
    const MIN_EL = -18, MAX_EL = 30
    return Math.max(0, Math.min(1, (el - MIN_EL) / (MAX_EL - MIN_EL)))
  }

  // Fills layer: one equal-height horizontal stripe per custom channel, each
  // showing that channel's slots. Colored per-channel hue, lightness driven by
  // the sun elevation at each slot's midpoint. Drawn before the curve layer so
  // the sun curve overlays all stripes.
  private _drawCustomStripes(
    ctx: CanvasRenderingContext2D,
    customChannelIds: string[],
    selDay: DayData | null, prevDay: DayData | null, sunData: SunDayResult,
    plotL: number, plotT: number, plotR: number, innerW: number, stripeH: number,
    gx: (t: number) => number,
  ): void {
    const slotRefDay = selDay || prevDay || sunData.day_data
    if (customChannelIds.length === 0 || !slotRefDay) return
    const norm = (m: number) => ((m % 1440) + 1440) % 1440

    customChannelIds.forEach((channelId, idx) => {
      // Stripe idx 0 is the primary channel; custom channels start below it.
      const bandT = plotT + (idx + 1) * stripeH
      const bandB = bandT + stripeH
      const chanSlots = this.channelSlotsMap?.[channelId] ?? []

      const isEnabled = this.channels?.[channelId]?.enabled !== false
      const hue = CHANNEL_HUES[idx % CHANNEL_HUES.length]
      const saturation = isEnabled ? 35 : 0
      // Lightness band the elevation ratio is mapped into (dark night → bright day).
      const minLightness = isEnabled ? 12 : 6
      const maxLightness = isEnabled ? 42 : 14

      // Night background for empty slots
      ctx.fillStyle = COLOR_NIGHT
      ctx.fillRect(plotL, bandT, innerW, stripeH)

      // Draw slots — lightness from the sun elevation at the slot midpoint.
      // Fill by the actual minute span (0..1440) so a single full-day slot
      // (from==to+1440) covers the whole width instead of collapsing to zero.
      const pxPerMin = innerW / 1440
      chanSlots.forEach(slot => {
        const span = slotSpanMinutes(slot)
        if (span <= 0) return
        const startMin = norm(slot.from)
        const startX = plotL + startMin * pxPerMin

        const mid = norm(slot.from + span / 2)
        const el = this._interpolateEl(mid)
        const ratio = this._elevationToLightRatio(el)
        const lightness = minLightness + ratio * (maxLightness - minLightness)
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`

        const widthPx = span * pxPerMin
        const overflow = startX + widthPx - plotR
        if (overflow <= 0) {
          ctx.fillRect(startX, bandT, widthPx, stripeH)
        } else {
          // Wraps past midnight: draw the tail, then the wrapped remainder.
          ctx.fillRect(startX, bandT, plotR - startX, stripeH)
          ctx.fillRect(plotL, bandT, overflow, stripeH)
        }
      })

      // Separator lines at slot boundaries (only when showSlots is active)
      if (this.showSlots) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
        ctx.lineWidth = 1.5
        for (const slot of chanSlots) {
          const fromX = gx(norm(slot.from))
          ctx.beginPath()
          ctx.moveTo(fromX, bandT)
          ctx.lineTo(fromX, bandB)
          ctx.stroke()
        }
      }

      // Horizontal separator line between stripes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(plotL, bandT)
      ctx.lineTo(plotR, bandT)
      ctx.stroke()
    })
  }

  // Horizontal channel names in the left gutter, one per stripe — the Y-axis-label
  // replacement for the in-stripe pills. Each name is wrapped to the gutter width
  // and vertically clamped to its stripe, so long names stay inside their own
  // stripe. Drawn unclipped, after the frame, so nothing overpaints them.
  private _drawChannelAxisLabels(
    ctx: CanvasRenderingContext2D,
    stripeChannelIds: string[],
    plotL: number, plotT: number, stripeH: number,
  ): void {
    const fontSize = 11
    const lineH = fontSize + 2
    const maxTextW = CHANNEL_LABEL_GUTTER - CHANNEL_LABEL_GAP - CHANNEL_LABEL_LEFT_MARGIN
    // Right-aligned: text right edge sits CHANNEL_LABEL_GAP left of the plot, so
    // all lines flush against the plot like the timeline's degree labels.
    const tx = plotL - CHANNEL_LABEL_GAP

    ctx.save()
    ctx.font = `600 ${fontSize}px system-ui, sans-serif`
    ctx.textAlign = 'end'
    ctx.textBaseline = 'middle'

    stripeChannelIds.forEach((channelId, i) => {
      const isEnabled = this.channels?.[channelId]?.enabled !== false
      const name = (this.channels?.[channelId]?.name || channelId).toUpperCase()
      const stripeTop = plotT + i * stripeH

      const maxLines = Math.max(1, Math.floor((stripeH - 8) / lineH))
      const lines = this._wrapText(ctx, name, maxTextW, maxLines)

      ctx.fillStyle = isEnabled ? getTextColor(this) : 'rgba(255,255,255,0.35)'
      const blockH = lines.length * lineH
      let ly = stripeTop + (stripeH - blockH) / 2 + lineH / 2
      for (const line of lines) {
        ctx.fillText(line, tx, ly)
        ly += lineH
      }
    })
    ctx.restore()
  }

  // Greedy word-then-char wrap to maxWidth, capped at maxLines. The last line is
  // truncated with an ellipsis if the text doesn't fit.
  private _wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
    const fits = (s: string) => ctx.measureText(s).width <= maxWidth
    const tokens = text.split(/\s+/).filter(Boolean)
    const lines: string[] = []
    let cur = ''

    const pushChars = (word: string) => {
      // Break a single over-long word character by character.
      for (const ch of word) {
        if (cur && !fits(cur + ch)) { lines.push(cur); cur = '' }
        cur += ch
      }
    }

    for (const word of tokens) {
      const candidate = cur ? `${cur} ${word}` : word
      if (fits(candidate)) { cur = candidate; continue }
      if (cur) { lines.push(cur); cur = '' }
      if (fits(word)) cur = word
      else pushChars(word)
    }
    if (cur) lines.push(cur)

    if (lines.length <= maxLines) return lines
    const kept = lines.slice(0, maxLines)
    let last = kept[maxLines - 1]
    while (last.length > 0 && !fits(`${last}…`)) last = last.slice(0, -1)
    kept[maxLines - 1] = `${last}…`
    return kept
  }

  // Left/right padding, mirrored exactly from _draw() so pointer→time mapping
  // matches the rendered geometry.
  private get _padLeft(): number { return this.noAxisLabels ? 10 : (this.noYAxis ? CARD_CONTENT_PAD + CHANNEL_LABEL_GUTTER : PAD_LEFT) }
  private get _padRight(): number { return this.noAxisLabels ? 10 : (this.noYAxis ? CARD_CONTENT_PAD : PAD_RIGHT) }

  // Resolves the channel id under a Y pixel position: stripe 0 → 'primary',
  // stripe i≥1 → the i-th custom channel. Falls back to selectedChannelId when
  // geometry isn't cached yet (e.g. before the first draw).
  private _channelAtY(clientY: number, rectTop: number): string {
    const g = this._geom
    if (!g || g.numStripes <= 1) return this.selectedChannelId
    const y = clientY - rectTop
    const i = Math.max(0, Math.min(g.numStripes - 1, Math.floor((y - g.plotT) / g.stripeH)))
    if (i === 0) return 'primary'
    const customIds = Object.keys(this.channels || {}).filter(id => id !== 'primary')
    return customIds[i - 1] ?? 'primary'
  }

  // Time in minutes from a client X position, mirroring _draw()'s X mapping.
  private _timeAtX(clientX: number, rectLeft: number): number {
    const innerW = this._w - this._padLeft - this._padRight
    const cx = clientX - rectLeft
    return Math.round(Math.max(0, Math.min(1, (cx - this._padLeft) / innerW)) * 1440)
  }

  // Slot at a given time within a specific channel's slot list (Y-aware).
  // Uses normalized from + span so a full-day slot (to = from + 1440) matches
  // every minute, matching how the stripe is filled in _drawCustomStripes.
  private _getSlotAtTimeIn(slots: Slot[], mins: number): Slot | null {
    const norm = (m: number) => ((m % 1440) + 1440) % 1440
    const t = norm(mins)
    for (const slot of slots) {
      const span = slotSpanMinutes(slot)
      if (span <= 0) continue
      if (norm(t - norm(slot.from)) < span) return slot
    }
    return null
  }

  // Slots for a channel id, preferring the Y-aware channelSlotsMap and falling
  // back to the single .slots prop (the timetable-active channel).
  private _slotsForChannel(channelId: string): Slot[] {
    const mapped = this.channelSlotsMap?.[channelId]
    return mapped && mapped.length ? mapped : this.slots
  }

  private _onCanvasClick(e: MouseEvent) {
    if (!this._w) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const mins = this._timeAtX(e.clientX, rect.left)
    const channelId = this._channelAtY(e.clientY, rect.top)
    const slot = this._getSlotAtTimeIn(this._slotsForChannel(channelId), mins)
    if (slot) {
      this.dispatchEvent(new CustomEvent('slot-selected', {
        detail: { slotId: slot.id, channelId },
        bubbles: true,
        composed: true
      }))
    }
  }

  private _onMouseMove(e: MouseEvent) {
    if (!this._w) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    this.hoverTime = this._timeAtX(e.clientX, rect.left)
    const channelId = this._channelAtY(e.clientY, rect.top)
    this.dispatchEvent(new CustomEvent('time-hover-changed', {
      detail: { hoverTime: this.hoverTime, channelId, scrubbing: true },
      bubbles: true,
      composed: true
    }))
  }

  private _onMouseLeave() {
    this.hoverTime = null
    this.dispatchEvent(new CustomEvent('time-hover-changed', {
      detail: { hoverTime: null, scrubbing: false },
      bubbles: true,
      composed: true
    }))
    this._draw()
  }

  private _onTouchMove(e: TouchEvent) {
    if (!this._w) return
    // Keep the page from scrolling while scrubbing the chart on touch devices.
    e.preventDefault()
    const touch = e.touches[0]
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    this.hoverTime = this._timeAtX(touch.clientX, rect.left)
    const channelId = this._channelAtY(touch.clientY, rect.top)
    this.dispatchEvent(new CustomEvent('time-hover-changed', {
      detail: { hoverTime: this.hoverTime, channelId, scrubbing: true },
      bubbles: true,
      composed: true
    }))
    this._draw()
  }

  private _onTouchEnd() {
    this.hoverTime = null
    this.dispatchEvent(new CustomEvent('time-hover-changed', {
      detail: { hoverTime: null, scrubbing: false },
      bubbles: true,
      composed: true
    }))
    this._draw()
  }

  private _getSparklineGradient(): string {
    const days = this._days.length ? this._days : this.days
    const selIdx = days.findIndex(d => d.date === this.date)
    const selDay = selIdx >= 0 ? days[selIdx] : null
    const prevDay = selIdx > 0 ? days[selIdx - 1] : null

    if (!selDay) return 'var(--divider-color)'

    const useSlot = this.clamped
    const ownEvs = useSlot ? buildSlotEvents(selDay) : buildRawEvents(selDay)
    const evs = [...ownEvs]
    if (prevDay) addCarryOvers(evs, prevDay, selDay, useSlot)
    evs.sort((a, b) => a.t - b.t)
    
    const startC = startColorFromPrev(prevDay, selDay, useSlot)
    
    const stops: string[] = []
    const C = 1440
    let curColor = startC
    
    stops.push(`${curColor} 0%`)
    
    for (const ev of evs) {
      const t = Math.max(0, Math.min(C, ev.t))
      const pct = ((t / C) * 100).toFixed(1)
      stops.push(`${curColor} ${pct}%`)
      curColor = ev.c
      stops.push(`${curColor} ${pct}%`)
    }
    
    stops.push(`${curColor} 100%`)
    return `linear-gradient(to right, ${stops.join(', ')})`
  }

  render() {
    if (this.sparkline) {
      const gradient = this._getSparklineGradient()
      const liveMins = this.liveTime ?? this._getLiveTime()
      const livePercent = (liveMins / 1440) * 100

      return html`
        <div class="sparkline-container">
          <div class="sparkline-bar" style="--bar-gradient: ${gradient}">
            <div class="sparkline-pointer" style="left: calc(${livePercent}% - 3px)"></div>
          </div>
        </div>
        ${!this.noAxisLabels ? html`
          <div class="sparkline-labels">
            <span>00:00</span>
            <span>12:00</span>
            <span>24:00</span>
          </div>
        ` : ''}
      `
    }

    return html`
      ${!this.noHeader ? html`
        <div class="card-header">
          <span class="card-dot" style="--dot-color: #f59e0b;"></span>
          <span class="card-title" role="heading" aria-level="2">${this.t('sun_path_card.title')}</span>
        </div>
      ` : ''}
      <div class="canvas-wrap">
        ${this._loading && !this._sunData && !this.sunData
          ? html`<div class="loading"><ha-circular-progress active size="small"></ha-circular-progress></div>`
          : html`<canvas
              tabindex="0"
              role="img"
              aria-label=${this.t('sun_path_card.title')}
              @click=${this._onCanvasClick}
              @mousemove=${this._onMouseMove}
              @mouseleave=${this._onMouseLeave}
              @touchstart=${this._onTouchMove}
              @touchmove=${this._onTouchMove}
              @touchend=${this._onTouchEnd}
            ></canvas>`}
      </div>
    `
  }
}
