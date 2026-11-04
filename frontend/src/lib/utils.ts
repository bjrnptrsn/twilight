import { Slot, SlotConfig, CalculatedSlotTime, SLOT_COLORS, STANDARD_ZONE_IDS, STANDARD_NAMES, PRIMARY_CHANNEL_ID, type HomeAssistant } from './types'
import { formatTime, t, usesAmPm, type TranslationKey } from './i18n'
import { buildSlots, elToZone, type DayData } from './sun-zones'

/** Today's date as YYYY-MM-DD in the browser's local timezone (not UTC —
 * `toISOString()` would return the wrong calendar day near local midnight). */
export function localDateString(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Today's date as YYYY-MM-DD in Home Assistant's configured timezone (or an
 * explicit `tzOverride`, e.g. a Timeline demo location's own timezone).
 *
 * The twilight/* endpoints resolve their anchor date in
 * `hass.config.time_zone`; looking that date up with the browser-local
 * `localDateString()` returns the wrong calendar day near midnight whenever
 * the two timezones differ (e.g. HA in Europe, browser in America). */
export function haLocalDateString(hass: HomeAssistant | null, d: Date = new Date(), tzOverride?: string): string {
  const tz = tzOverride || hass?.config?.time_zone
  if (!tz) return localDateString(d)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d)
  const part = (type: string) => parts.find(p => p.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

/** Current time as minutes-since-midnight in Home Assistant's configured
 * timezone (with fractional seconds), falling back to browser-local time
 * when `hass` isn't available yet. Mirrors `haLocalDateString()` — the
 * backend/charts anchor "now" to `hass.config.time_zone`, so a browser in a
 * different timezone must not compute its own local hour/minute here, or the
 * live time marker visibly drifts from the data it's drawn against. */
export function haLocalMinutesOfDay(hass: HomeAssistant | null, d: Date = new Date()): number {
  const tz = hass?.config?.time_zone
  if (!tz) return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false,
  }).formatToParts(d)
  const part = (type: string) => Number(parts.find(p => p.type === type)?.value ?? 0)
  return part('hour') * 60 + part('minute') + part('second') / 60
}

export function minsToHHMM(m: number): string {
  const mm = ((Math.round(m) % 1440) + 1440) % 1440
  return `${String(Math.floor(mm / 60)).padStart(2, '0')}:${String(mm % 60).padStart(2, '0')}`
}

/** Format minutes-since-midnight as a user-facing time honoring HA's
 * time_format locale override (12h/24h/system/language) — unlike
 * `minsToHHMM()`, which is always strict 24h HH:MM (used for raw slot-time
 * inputs/config, not display). Minutes-since-midnight has no calendar date,
 * so it's anchored to a fixed UTC instant and formatted in UTC so the local
 * timezone never shifts it. */
export function formatSlotTime(m: number, locale?: HomeAssistant['locale']): string {
  const mm = ((Math.round(m) % 1440) + 1440) % 1440
  const h = Math.floor(mm / 60)
  const min = mm % 60
  const d = new Date(Date.UTC(2000, 0, 1, h, min))
  // 24h times are zero-padded ("05:29") so a column of them lines up; 12h keeps "5:29 AM".
  const hour = usesAmPm(locale) ? 'numeric' : '2-digit'
  return formatTime(d, locale, { hour, minute: '2-digit', timeZone: 'UTC' })
}

export function slotToZone(s: Slot): string {
  return s.startType === 'fixed' ? (s.fixedStartTime || '12:00') : (s.startEvent || 'civil_dawn')
}

/** True if `minuteOfDay` falls within [slot.from, slot.to), handling midnight wraparound. */
/** Minute span (0..1440] of a slot, handling midnight wrap (to<from) and
 * full-day single slots (to = from + 1440). */
export function slotSpanMinutes(slot: { from: number; to: number }): number {
  const raw = slot.to - slot.from
  if (raw >= 1440) return 1440 // full-day single slot
  if (raw === 0) return 0 // zero-length slot: never active
  if (raw < 0) return raw + 1440 // wraps past midnight
  return raw
}

export function isSlotActiveAt(slot: { from: number; to: number }, minuteOfDay: number): boolean {
  // Compare by span from the slot start, so full-day and midnight-wrapping
  // slots both match every applicable minute.
  const norm = (m: number) => ((m % 1440) + 1440) % 1440
  return norm(minuteOfDay - norm(slot.from)) < slotSpanMinutes(slot)
}

/** Resolve an entity's display name (friendly_name, falling back to the raw `name` attribute or the entity ID itself). */
export function sceneDisplayName(hass: HomeAssistant | null | undefined, entityId: string): string {
  const attrs = hass?.states[entityId]?.attributes
  return attrs?.friendly_name ?? attrs?.name ?? entityId
}

/** Resolve a slot start-event (sunrise/sunset/dawn/dusk stages) to minutes-since-midnight, with graceful fallback chains. */
export function getEventTime(d: DayData, event: string): number {
  switch (event) {
    case 'astro_dawn':    return d.slot_astro_dawn    ?? d.slot_nautical_dawn ?? d.slot_civil_dawn ?? d.slot_sunrise ?? 360
    case 'nautical_dawn': return d.slot_nautical_dawn ?? d.slot_civil_dawn    ?? d.slot_sunrise ?? 390
    case 'civil_dawn':    return d.slot_civil_dawn    ?? d.slot_sunrise ?? 420
    case 'gold_dawn':     return d.slot_gold_dawn     ?? d.slot_sunrise ?? 450
    case 'sunrise':       return d.slot_sunrise ?? 450
    case 'sunset':        return d.slot_sunset ?? 1080
    case 'gold_dusk':     return d.slot_gold_dusk     ?? d.slot_sunset ?? 1050
    case 'civil_dusk':    return d.slot_civil_dusk    ?? d.slot_sunset ?? 1110
    case 'nautical_dusk': return d.slot_nautical_dusk ?? d.slot_civil_dusk ?? d.slot_sunset ?? 1140
    case 'astro_dusk':    return d.slot_astro_dusk    ?? d.slot_nautical_dusk ?? d.slot_civil_dusk ?? d.slot_sunset ?? 1170
    default: return 720
  }
}

// Dawn/dusk zone pairs share one colour (a "civil" band looks the same morning
// and evening), so the ten standard zones map onto six colour keys.
const ZONE_COLOR_KEYS: Record<string, string> = {
  civil_dawn: 'civil',
  civil_dusk: 'civil',
  nautical_dawn: 'nautical',
  nautical_dusk: 'nautical',
  astro_dawn: 'astro',
  astro_dusk: 'astro',
  gold_dawn: 'gold',
  gold_dusk: 'gold',
}

/** Display colour for a sun zone / slot id, falling back to the day colour. */
export function zoneColor(zone: string): string {
  return SLOT_COLORS[ZONE_COLOR_KEYS[zone] ?? zone] || SLOT_COLORS.day
}

/** Colour of the sun zone `minuteOfDay` falls into on `day`. A minute no zone
 * covers (polar day or night) takes the colour of the sun at midnight. */
export function sunZoneColorAt(day: DayData, minuteOfDay: number): string {
  const zone = buildSlots(day).find(z => isSlotActiveAt(z, minuteOfDay))
  return zone ? zone.color : elToZone(day.midnight_el)
}

export const ZONE_LABEL_KEYS: Record<string, TranslationKey> = {
  astro_dawn:    'slot_editor.event_astro_dawn',
  nautical_dawn: 'slot_editor.event_nautical_dawn',
  civil_dawn:    'slot_editor.event_civil_dawn',
  gold_dawn:     'slot_editor.event_gold_dawn',
  day:           'slot_editor.event_day',
  gold_dusk:     'slot_editor.event_gold_dusk',
  civil_dusk:    'slot_editor.event_civil_dusk',
  nautical_dusk: 'slot_editor.event_nautical_dusk',
  astro_dusk:    'slot_editor.event_astro_dusk',
  night:         'slot_editor.event_night',
}

/** Localized name of a standard zone; undefined for anything else. */
export function zoneLabel(zone: string | null | undefined, lang?: string): string | undefined {
  const key = zone ? ZONE_LABEL_KEYS[zone] : undefined
  return key ? t(lang, key) : undefined
}

/** Display name of a slot. A standard slot only carries its English default
 *  name (the store does not persist one), which gives way to the localized
 *  label; any other name was chosen by the user and stays. */
export function slotDisplayName(slot: { id: string; name?: string | null }, lang?: string): string {
  const hasDefaultName = !slot.name || slot.name === STANDARD_NAMES[slot.id]
  return (hasDefaultName ? zoneLabel(slot.id, lang) : undefined) || slot.name || slot.id
}

/** Display name of a channel; the Primary channel's stored default name is localized. */
export function channelDisplayName(channelId: string, name: string | null | undefined, lang?: string): string {
  if (channelId === PRIMARY_CHANNEL_ID && (!name || name === 'Primary')) return t(lang, 'common.primary_channel')
  return name || channelId
}

/**
 * Convert backend calculated slot times ({id, start}) into rich Slot display objects.
 * - Does NOT sort (backend returns pre-sorted list by start minute).
 * - Only computes `to = start of next slot` (or start + 1440 for single slot).
 * - Preserves all raw config fields 1:1.
 * - A fixed-time slot has no zone of its own and takes the colour of the sun
 *   zone its start falls into on `dayData`'s day.
 */
export function convertCalculatedTimesToSlots(
  calculatedList: CalculatedSlotTime[],
  rawSlots: SlotConfig[],
  lang?: string,
  dayData?: DayData | null
): Slot[] {
  if (!calculatedList || calculatedList.length === 0) return []

  const result: Slot[] = []
  const len = calculatedList.length

  for (let i = 0; i < len; i++) {
    const cur = calculatedList[i]
    const nextStart = len === 1
      ? cur.start + 1440
      : (i < len - 1 ? calculatedList[i + 1].start : calculatedList[0].start + 1440)

    const raw = rawSlots?.find(s => s.id === cur.id)
    const isFixed = raw?.start_type === 'fixed'
    const zone = raw?.zone || cur.id

    const color = isFixed && dayData ? sunZoneColorAt(dayData, cur.start) : zoneColor(zone)

    result.push({
      id: cur.id,
      label: slotDisplayName({ id: cur.id, name: raw?.name }, lang),
      color,
      from: cur.start,
      to: nextStart,
      scene: raw?.scene_entity_id || null,
      configured_entities: raw?.configured_entities ?? [],
      isCustom: !(STANDARD_ZONE_IDS as readonly string[]).includes(cur.id),
      startType: isFixed ? 'fixed' : 'astral',
      startEvent: isFixed ? undefined : zone,
      startOffset: raw?.offset_minutes || 0,
      fixedStartTime: isFixed ? (raw?.fixed_time || undefined) : undefined,
      hue_activate_dynamic: raw?.hue_activate_dynamic ?? 'hue',
      hue_dynamic_speed: raw?.hue_dynamic_speed ?? null,
      not_before: isFixed ? null : (raw?.not_before || null),
    })
  }

  return result
}

export function generateGradient(slots: { from: number; to: number; color: string }[]): string {
  if (slots.length === 0) return 'var(--divider-color)'
  const norm = (m: number) => ((m % 1440) + 1440) % 1440
  const rawStops: { pos: number; color: string; isEnd: boolean }[] = []

  for (const slot of slots) {
    const s = (norm(slot.from) / 1440) * 100
    const e = (norm(slot.to) / 1440) * 100
    if (norm(slot.from) > norm(slot.to)) {
      rawStops.push({ pos: s, color: slot.color, isEnd: false })
      rawStops.push({ pos: 100, color: slot.color, isEnd: true })
      rawStops.push({ pos: 0, color: slot.color, isEnd: false })
      rawStops.push({ pos: e, color: slot.color, isEnd: true })
    } else {
      rawStops.push({ pos: s, color: slot.color, isEnd: false })
      rawStops.push({ pos: e, color: slot.color, isEnd: true })
    }
  }

  // At a shared position a slot's end must precede the next slot's start, or
  // the stops cross and the browser draws a fade instead of a hard edge. Push
  // order alone does not guarantee it: the slot wrapping past midnight comes
  // last in start order, yet its tail sits at the left edge of the bar.
  rawStops.sort((a, b) => a.pos - b.pos || Number(b.isEnd) - Number(a.isEnd))
  const stops = rawStops.map(st => `${st.color} ${st.pos.toFixed(1)}%`)
  return `linear-gradient(to right, ${stops.join(', ')})`
}

// Preload Home Assistant entity picker components by forcing Lovelace card helper creation
export async function preloadHaComponents(): Promise<void> {
  if (customElements.get('ha-entity-picker')) return
  
  try {
    if ((window as any).loadCardHelpers) {
      const helpers = await (window as any).loadCardHelpers()
      if (helpers) {
        if (helpers.createCardElement) {
          const card = await helpers.createCardElement({ type: 'entities', entities: [] })
          if (card && (card as any).getConfigElement) {
            await (card as any).getConfigElement()
          }
        }
        if (!customElements.get('ha-entity-picker') && helpers.createRowElement) {
          const row = await helpers.createRowElement({ type: 'attribute' })
          if (row && (row as any).getConfigElement) {
            await (row as any).getConfigElement()
          }
        }
      }
    }
    
    if (!customElements.get('ha-entity-picker')) {
      const glanceCard = customElements.get('hui-glance-card') as any
      if (glanceCard && glanceCard.getConfigElement) {
        await glanceCard.getConfigElement()
      }
    }
  } catch (err) {
    console.warn('[Twilight] Failed to preload HA entity picker:', err)
  }
}

export function setupCanvasCtx(canvas: HTMLCanvasElement, cssW: number, cssH: number): CanvasRenderingContext2D {
  const dpr = window.devicePixelRatio || 1
  const bw = Math.round(cssW * dpr), bh = Math.round(cssH * dpr)
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw
    canvas.height = bh
  }
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, bw, bh)
  ctx.save()
  ctx.scale(dpr, dpr)
  return ctx
}
