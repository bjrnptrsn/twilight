// ---------------------------------------------------------------------------
// sun-zones.ts — shared zone logic for day and year canvas rendering
// Used by: sun-path-card.ts, sun-year-card.ts, timeline-view.ts
// ---------------------------------------------------------------------------

import type { Slot } from './types'
import { SLOT_COLORS } from './types'

// ── Design tokens ────────────────────────────────────────────────────────────

export const COLOR_NIGHT = '#141926'
export const COLOR_ASTRO = '#1e2e45'
export const COLOR_NAUT  = '#2c4268'
export const COLOR_CIVIL = '#3d5c8a'
export const COLOR_GOLD  = '#bfb39b'
export const COLOR_DAY   = '#8ab0cd'

export const AXIS_COLOR = 'rgba(255,255,255,0.65)'
export const GRID_COLOR = 'rgba(255,255,255,0.15)'

// Maps solar midnight elevation → zone color active at midnight.
export const elToZone = (el: number): string => {
  if (el >= -0.833) return COLOR_DAY
  if (el >= -6)     return COLOR_CIVIL
  if (el >= -12)    return COLOR_NAUT
  if (el >= -18)    return COLOR_ASTRO
  return COLOR_NIGHT
}

// ── Interfaces ───────────────────────────────────────────────────────────────

export interface DayData {
  date: string
  tz_offset: number
  solar_midnight: number | null
  midnight_el: number
  solar_noon: number | null
  astro_dawn: number | null
  nautical_dawn: number | null
  dawn: number | null
  sunrise: number | null
  sunset: number | null
  dusk: number | null
  nautical_dusk: number | null
  astro_dusk: number | null
  slot_astro_dawn: number | null
  slot_nautical_dawn: number | null
  slot_civil_dawn: number | null
  slot_sunrise: number | null
  slot_gold_dawn: number | null
  slot_day: number | null
  slot_gold_dusk: number | null
  slot_sunset: number | null
  slot_civil_dusk: number | null
  slot_nautical_dusk: number | null
  slot_astro_dusk: number | null
  slot_night: number | null
}

export function buildSlots(d: DayData): Slot[] {
  const zones = [
    { id: 'night',        label: 'Night',             color: SLOT_COLORS.night,    from: d.slot_night,         to: d.slot_astro_dawn,     startEvent: 'night' },
    { id: 'astro_dawn',   label: 'Astronomical dawn', color: SLOT_COLORS.astro,    from: d.slot_astro_dawn,    to: d.slot_nautical_dawn,  startEvent: 'astro_dawn' },
    { id: 'nautical_dawn',label: 'Nautical dawn',     color: SLOT_COLORS.nautical, from: d.slot_nautical_dawn, to: d.slot_civil_dawn,     startEvent: 'nautical_dawn' },
    { id: 'civil_dawn',   label: 'Civil dawn',        color: SLOT_COLORS.civil,    from: d.slot_civil_dawn,    to: d.slot_gold_dawn ?? d.slot_sunrise, startEvent: 'civil_dawn' },
    { id: 'gold_dawn',    label: 'Golden dawn',       color: SLOT_COLORS.gold,     from: d.slot_gold_dawn,     to: d.slot_day ?? (d.slot_gold_dawn !== null && d.slot_gold_dawn !== undefined ? d.slot_gold_dawn + 30 : null), startEvent: 'gold_dawn' },
    { id: 'day',          label: 'Day',               color: SLOT_COLORS.day,      from: d.slot_day ?? d.slot_sunrise, to: d.slot_gold_dusk ?? d.slot_civil_dusk, startEvent: 'sunrise' },
    { id: 'gold_dusk',    label: 'Golden dusk',       color: SLOT_COLORS.gold,     from: d.slot_gold_dusk,     to: d.slot_civil_dusk,     startEvent: 'gold_dusk' },
    { id: 'civil_dusk',   label: 'Civil dusk',        color: SLOT_COLORS.civil,    from: d.slot_civil_dusk,    to: d.slot_nautical_dusk,  startEvent: 'civil_dusk' },
    { id: 'nautical_dusk',label: 'Nautical dusk',     color: SLOT_COLORS.nautical, from: d.slot_nautical_dusk, to: d.slot_astro_dusk,     startEvent: 'nautical_dusk' },
    { id: 'astro_dusk',   label: 'Astronomical dusk', color: SLOT_COLORS.astro,    from: d.slot_astro_dusk,    to: d.slot_night,          startEvent: 'astro_dusk' },
  ]

  return zones
    .filter(z => z.from !== null && z.to !== null)
    .map(z => ({
      id: z.id,
      label: z.label,
      color: z.color,
      from: z.from!,
      to: z.to!,
      scene: null,
      isCustom: false,
      startType: 'astral',
      startEvent: z.startEvent,
      startOffset: 0
    }))
}

export interface SunPoint { time: number; elevation: number; azimuth: number }

export interface SunEvent { time: number; formatted: string; azimuth: number; cardinal: string }

export interface SunDayResult {
  date: string; lat: number; lon: number
  points: SunPoint[]
  events: { sunrise?: SunEvent; noon?: SunEvent; sunset?: SunEvent }
  day_data?: DayData
  prev_day_data?: DayData
}

export interface SunYearResult { year: number; days: DayData[] }

export interface ColEv { t: number; c: string }

// ── Shared canvas helpers (host = the card element, for CSS var lookup) ──────

export function getAxisFont(host: HTMLElement): string {
  const f =
    getComputedStyle(host).getPropertyValue('--font-family').trim() ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  return `400 12px ${f}`
}

export function getTextColor(host: HTMLElement): string {
  const cs = getComputedStyle(host)
  return cs.getPropertyValue('--secondary-text-color').trim() ||
    cs.getPropertyValue('--primary-text-color').trim() ||
    'rgba(255, 255, 255, 0.65)'
}

export function getDividerColor(host: HTMLElement): string {
  return getComputedStyle(host).getPropertyValue('--divider-color').trim() || 'rgba(255, 255, 255, 0.08)'
}

export function interpolateElevation(points: SunPoint[], t: number): number {
  for (let i = 0; i < points.length - 1; i++) {
    if (points[i].time <= t && points[i + 1].time > t) {
      const f = (t - points[i].time) / (points[i + 1].time - points[i].time)
      return points[i].elevation + (points[i + 1].elevation - points[i].elevation) * f
    }
  }
  return points[points.length - 1]?.elevation ?? 0
}

export function drawSun(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.save()
  ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(249,217,118,0.28)'; ctx.shadowColor = '#f9d976'; ctx.shadowBlur = 12
  ctx.fill()
  ctx.beginPath(); ctx.arc(x, y, 7.5, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(10, 15, 25, 0.65)'; ctx.lineWidth = 1.5; ctx.stroke()
  ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2)
  ctx.fillStyle = '#f9d976'; ctx.fill(); ctx.restore()
}

export function drawMoon(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.save(); ctx.shadowColor = '#a4c5f0'; ctx.shadowBlur = 10
  ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fillStyle = '#c8dff5'; ctx.fill()
  ctx.beginPath(); ctx.arc(x + 3.15, y - 0.7, 5.46, 0, Math.PI * 2)
  ctx.fillStyle = COLOR_NIGHT; ctx.fill(); ctx.restore()
}

export function drawHalfHalf(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.save(); ctx.shadowColor = '#c8c8f0'; ctx.shadowBlur = 10
  ctx.beginPath(); ctx.arc(x, y, 7, Math.PI / 2, -Math.PI / 2); ctx.lineTo(x, y - 7)
  ctx.fillStyle = '#f9d976'; ctx.fill()
  ctx.beginPath(); ctx.arc(x, y, 7, -Math.PI / 2, Math.PI / 2); ctx.lineTo(x, y + 7)
  ctx.fillStyle = '#c8dff5'; ctx.fill()
  ctx.beginPath(); ctx.moveTo(x, y - 7); ctx.lineTo(x, y + 7)
  ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 0.5; ctx.stroke(); ctx.restore()
}

// ── Zone event builders ───────────────────────────────────────────────────────

const round3 = (v: number) => Math.round(v * 1000) / 1000

export function buildRawEvents(d: DayData): ColEv[] {
  const C = 1440
  const evs: ColEv[] = []
  const sr = d.sunrise !== null ? round3(d.sunrise) : null
  const ss = d.sunset  !== null ? round3(d.sunset)  : null

  const astro_dawn    = (d.astro_dawn    !== null && (sr === null || round3(d.astro_dawn)    < sr)) ? round3(d.astro_dawn)    : null
  const nautical_dawn = (d.nautical_dawn !== null && (sr === null || round3(d.nautical_dawn) < sr)) ? round3(d.nautical_dawn) : null
  const dawn          = (d.dawn          !== null && (sr === null || round3(d.dawn)          < sr)) ? round3(d.dawn)          : null

  const dusk          = (d.dusk          !== null && d.dusk          <= C && (ss === null || round3(d.dusk)          > ss)) ? round3(d.dusk)          : null
  const nautical_dusk = (d.nautical_dusk !== null && d.nautical_dusk <= C && (ss === null || round3(d.nautical_dusk) > ss)) ? round3(d.nautical_dusk) : null
  const astro_dusk    = (d.astro_dusk    !== null && d.astro_dusk    <= C && (ss === null || round3(d.astro_dusk)    > ss)) ? round3(d.astro_dusk)    : null

  const hasGold = d.slot_gold_dawn !== null && d.slot_gold_dawn !== undefined

  if (astro_dawn    !== null) evs.push({ t: astro_dawn,    c: COLOR_ASTRO })
  if (nautical_dawn !== null) evs.push({ t: nautical_dawn, c: COLOR_NAUT  })
  if (dawn          !== null) evs.push({ t: dawn,          c: COLOR_CIVIL })
  
  if (sr            !== null) evs.push({ t: sr,            c: hasGold ? COLOR_GOLD : COLOR_DAY })
  if (hasGold && d.slot_day !== null && d.slot_day !== undefined) evs.push({ t: round3(d.slot_day), c: COLOR_DAY })
  if (hasGold && d.slot_gold_dusk !== null && d.slot_gold_dusk !== undefined && d.slot_gold_dusk <= C) evs.push({ t: round3(d.slot_gold_dusk), c: COLOR_GOLD })
  
  if (ss            !== null && ss <= C) evs.push({ t: ss, c: COLOR_CIVIL })
  if (dusk          !== null) evs.push({ t: dusk,          c: COLOR_NAUT  })
  if (nautical_dusk !== null) evs.push({ t: nautical_dusk, c: COLOR_ASTRO })
  if (astro_dusk    !== null) evs.push({ t: astro_dusk,    c: COLOR_NIGHT })
  return evs
}

export function buildSlotEvents(d: DayData): ColEv[] {
  const C = 1440
  const evs: ColEv[] = []
  const sr = d.slot_sunrise !== null ? round3(d.slot_sunrise) : null

  const astro_dawn    = (d.slot_astro_dawn    !== null && (sr === null || round3(d.slot_astro_dawn)    < sr)) ? round3(d.slot_astro_dawn)    : null
  const nautical_dawn = (d.slot_nautical_dawn !== null && (sr === null || round3(d.slot_nautical_dawn) < sr)) ? round3(d.slot_nautical_dawn) : null
  const dawn          = (d.slot_civil_dawn     !== null && (sr === null || round3(d.slot_civil_dawn)    < sr)) ? round3(d.slot_civil_dawn)    : null

  // slot_civil_dusk = sunset (start of civil_dusk zone)
  // slot_nautical_dusk = civil dusk (start of nautical_dusk zone)
  // slot_astro_dusk = nautical dusk (start of astro_dusk zone)
  // slot_night = astro dusk (start of night zone)
  const civil_dusk    = d.slot_civil_dusk    !== null && d.slot_civil_dusk    <= C ? round3(d.slot_civil_dusk)    : null
  const nautical_dusk = d.slot_nautical_dusk !== null && d.slot_nautical_dusk <= C ? round3(d.slot_nautical_dusk) : null
  const astro_dusk    = d.slot_astro_dusk    !== null && d.slot_astro_dusk    <= C ? round3(d.slot_astro_dusk)    : null
  const night         = d.slot_night         !== null && d.slot_night         <= C ? round3(d.slot_night)         : null

  const hasGold = d.slot_gold_dawn !== null && d.slot_gold_dawn !== undefined

  if (astro_dawn    !== null) evs.push({ t: astro_dawn,    c: COLOR_ASTRO })
  if (nautical_dawn !== null) evs.push({ t: nautical_dawn, c: COLOR_NAUT  })
  if (dawn          !== null) evs.push({ t: dawn,          c: COLOR_CIVIL })
  if (sr            !== null) evs.push({ t: sr,            c: hasGold ? COLOR_GOLD : COLOR_DAY })
  if (hasGold && d.slot_day !== null && d.slot_day !== undefined) evs.push({ t: round3(d.slot_day), c: COLOR_DAY })
  if (hasGold && d.slot_gold_dusk !== null && d.slot_gold_dusk !== undefined && d.slot_gold_dusk <= C) evs.push({ t: round3(d.slot_gold_dusk), c: COLOR_GOLD })
  if (civil_dusk    !== null) evs.push({ t: civil_dusk,    c: COLOR_CIVIL })
  if (nautical_dusk !== null) evs.push({ t: nautical_dusk, c: COLOR_NAUT  })
  if (astro_dusk    !== null) evs.push({ t: astro_dusk,    c: COLOR_ASTRO })
  if (night         !== null) evs.push({ t: night,         c: COLOR_NIGHT })
  return evs
}

// Build a DayData whose slot_* fields come from area-resolved slot curves
// (twilight/timeline/slot_times) instead of the generic per-day sun data.
//
// Everything that is NOT a Primary-zone start time (midnight_el, tz_offset, the
// raw astral fields) is carried over from `d` unchanged — those stay generic by
// definition, and `buildSlotEvents`/`addCarryOvers`/`startColorFromPrev` only
// read slot_* when useSlot is true.
//
// A curve entry of null means the zone does not occur that day. It must stay
// null: the backend's scheduling fallback puts a solar-noon placeholder there,
// and feeding that in draws ten 1-minute zones fanned around noon — the polar
// rendering bug.
//
// Day-overflow (values > 1440) is preserved as-is, exactly like compute_sun_day_data,
// so the existing carry-over logic keeps working across midnight.
export function daySlotsFromCurves(
  d: DayData,
  curves: Record<string, (number | null)[]>,
  i: number
): DayData {
  const at = (zone: string): number | null => {
    const c = curves[zone]
    if (!c || i < 0 || i >= c.length) return null
    const v = c[i]
    return v === null || v === undefined || !Number.isFinite(v) ? null : v
  }
  return {
    ...d,
    slot_astro_dawn:    at('astro_dawn'),
    slot_nautical_dawn: at('nautical_dawn'),
    slot_civil_dawn:    at('civil_dawn'),
    slot_gold_dawn:     at('gold_dawn'),
    slot_day:           at('day'),
    slot_gold_dusk:     at('gold_dusk'),
    slot_civil_dusk:    at('civil_dusk'),
    slot_nautical_dusk: at('nautical_dusk'),
    slot_astro_dusk:    at('astro_dusk'),
    slot_night:         at('night'),
    // slot_sunrise marks actual sunrise, which is where the golden-dawn zone
    // begins (verified against compute_sun_day_data: slot_sunrise == slot_gold_dawn).
    // buildSlotEvents uses it as the cutoff that dawn zones must precede, so it
    // must be gold_dawn — using `day` here would swallow the gold_dawn→day span.
    // Fall back to `day` only for configs where gold_dawn is absent.
    slot_sunrise:       at('gold_dawn') ?? at('day'),
  }
}

export function startColorFromPrev(p: DayData | null, d: DayData, useSlot: boolean): string {
  if (!p) return elToZone(d.midnight_el)
  const C = 1440
  if (useSlot) {
    if (p.slot_civil_dusk !== null) {
      if (p.slot_night         !== null && p.slot_night         <= C) return COLOR_NIGHT
      if (p.slot_astro_dusk    !== null && p.slot_astro_dusk    <= C) return COLOR_ASTRO
      if (p.slot_nautical_dusk !== null && p.slot_nautical_dusk <= C) return COLOR_NAUT
      if (p.slot_civil_dusk    !== null && p.slot_civil_dusk    <= C) return COLOR_CIVIL
      return COLOR_DAY
    }
  } else {
    if (p.sunset !== null) {
      if (p.astro_dusk    !== null && p.astro_dusk    <= C) return COLOR_NIGHT
      if (p.nautical_dusk !== null && p.nautical_dusk <= C) return COLOR_ASTRO
      if (p.dusk          !== null && p.dusk          <= C) return COLOR_NAUT
      if (p.sunset        !== null && p.sunset        <= C) return COLOR_CIVIL
      return COLOR_DAY
    }
  }
  return elToZone(p.midnight_el)
}

export function addCarryOvers(evs: ColEv[], p: DayData, d: DayData, useSlot: boolean): void {
  const C = 1440
  const addOne = (val: number | null, color: string, blockTime: number | null, requiredMorn: number | null) => {
    if (val === null || val <= C) return
    if (requiredMorn === null) return
    const tVal = round3(val - C)
    if (blockTime !== null && tVal >= blockTime) return
    evs.push({ t: tVal, c: color })
  }
  if (useSlot) {
    addOne(p.slot_civil_dusk,    COLOR_CIVIL, d.slot_sunrise,       d.slot_sunrise)
    addOne(p.slot_nautical_dusk, COLOR_NAUT,  d.slot_civil_dawn,    d.slot_civil_dawn)
    addOne(p.slot_astro_dusk,    COLOR_ASTRO, d.slot_nautical_dawn, d.slot_nautical_dawn)
    addOne(p.slot_night,         COLOR_NIGHT, d.slot_astro_dawn,    d.slot_astro_dawn)
  } else {
    addOne(p.sunset,        COLOR_CIVIL, d.sunrise,       d.sunrise)
    addOne(p.dusk,          COLOR_NAUT,  d.dawn,          d.dawn)
    addOne(p.nautical_dusk, COLOR_ASTRO, d.nautical_dawn, d.nautical_dawn)
    addOne(p.astro_dusk,    COLOR_NIGHT, d.astro_dawn,    d.astro_dawn)
  }
}

// ── Canvas renderers ─────────────────────────────────────────────────────────

export function renderDayFills(
  ctx: CanvasRenderingContext2D,
  plotL: number, plotT: number, innerH: number, plotR: number,
  evs: ColEv[], startC: string,
  gx: (t: number) => number, C: number
): void {
  let curColor = startC
  let xc = plotL
  for (const ev of evs) {
    const x = gx(Math.max(0, Math.min(C, ev.t)))
    if (x > xc) { ctx.fillStyle = curColor; ctx.fillRect(xc, plotT, x - xc, innerH) }
    curColor = ev.c
    xc = x
  }
  ctx.fillStyle = curColor
  ctx.fillRect(xc, plotT, plotR - xc, innerH)
}

export function renderYearColumn(
  ctx: CanvasRenderingContext2D,
  xS: number, cW: number,
  evs: ColEv[], startC: string,
  my: (m: number) => number, C: number
): void {
  let curC = startC
  let last = 0
  for (const e of evs) {
    if (e.t > last && e.t <= C) {
      ctx.fillStyle = curC
      ctx.fillRect(xS, my(e.t), cW, my(last) - my(e.t))
    }
    curC = e.c
    last = Math.max(last, e.t)
  }
  if (last < C) {
    ctx.fillStyle = curC
    ctx.fillRect(xS, my(C), cW, my(last) - my(C))
  }
}
