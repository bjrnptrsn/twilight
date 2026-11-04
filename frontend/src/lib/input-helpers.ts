import { type HomeAssistant, type InputConfig, type PlaceholderDefaults } from './types'
import { t, type TranslationKey } from './i18n'
import { sceneDisplayName } from './utils'

export type LuxIgnoreScope = 'none' | 'twilight_slots' | 'all_slots'

// Fixed const.py defaults for select-backed lux options (mirror of
// DEFAULT_LUX_IGNORE_ACTIVE / DEFAULT_LUX_IGNORE_SCOPE).
export const DEFAULT_LUX_IGNORE_ACTIVE = false
export const DEFAULT_LUX_IGNORE_SCOPE: LuxIgnoreScope = 'none'

export interface ResolvedMotionInfo {
  threshold: number
  watch: number
  ignoreActive: boolean
  ignoreScope: LuxIgnoreScope
}

export function getResolvedMotionInfo(
  input: InputConfig,
  placeholderDefaults: PlaceholderDefaults | null
): ResolvedMotionInfo {
  const threshold = input.lux_threshold !== null && input.lux_threshold !== undefined
    ? input.lux_threshold
    : (placeholderDefaults?.lux_threshold ?? 30)

  const watch = input.lux_watch_window !== null && input.lux_watch_window !== undefined
    ? input.lux_watch_window
    : (placeholderDefaults?.lux_watch_window ?? 10)

  const ignoreActive = input.lux_ignore_active !== null && input.lux_ignore_active !== undefined
    ? input.lux_ignore_active
    : DEFAULT_LUX_IGNORE_ACTIVE

  const ignoreScope = input.lux_ignore_scope !== null && input.lux_ignore_scope !== undefined
    ? input.lux_ignore_scope
    : DEFAULT_LUX_IGNORE_SCOPE

  return { threshold, watch, ignoreActive, ignoreScope }
}

export function formatMotionInfo(p: ResolvedMotionInfo, locale?: string): string {
  const luxStr = p.watch
    ? t(locale, 'input_row_editor.motion_lux_watch', { threshold: p.threshold, watch: p.watch })
    : t(locale, 'input_row_editor.motion_lux_no_watch', { threshold: p.threshold })
  const ignoreFlags = [
    p.ignoreActive ? t(locale, 'input_row_editor.motion_ignore_when_active') : '',
    p.ignoreScope === 'twilight_slots' ? t(locale, 'input_row_editor.motion_ignore_twilight_night') : '',
    p.ignoreScope === 'all_slots' ? t(locale, 'input_row_editor.motion_ignore_lux_all_slots') : '',
  ].filter(Boolean).join(', ')
  return `${luxStr}${ignoreFlags ? ` · ${ignoreFlags}` : ''}`
}

export interface EntityDisplay {
  /** Friendly names, each falling back to its entity id when HA has none. */
  friendlyName: string
  /** All entity ids, untruncated — for a tooltip, not for the visible row. */
  entityIds: string
  /** Retrigger/combine suffix, e.g. "[retrigger: every]"; empty when not applicable. */
  modeText: string
}

export function getEntityDisplay(input: InputConfig, hass?: HomeAssistant): EntityDisplay {
  const lang = hass?.locale?.language
  const entityIds = input.entity_ids ?? []
  if (entityIds.length === 0) {
    return { friendlyName: t(lang, 'input_row_editor.no_entities_configured'), entityIds: '', modeText: '' }
  }

  const names = entityIds.map(ent => hass?.states[ent]?.attributes?.friendly_name ?? ent)

  let friendlyName = names.join(', ')
  if (friendlyName.length > 35 && names.length > 1) {
    friendlyName = t(lang, 'common.more_items', { first: names[0], count: names.length - 1 })
  }

  let modeText = ''
  if (input.type === 'motion') {
    const key = input.retrigger === 'first' ? 'inputs_card.retrigger_first' : 'inputs_card.retrigger_every'
    modeText = `[${t(lang, key)}]`
  } else if (entityIds.length >= 2 && input.type === 'binary') {
    const mode = input.aggregation ?? 'any'
    const hint = mode === 'count'
      ? t(lang, 'inputs_card.combine_count', { count: input.aggregation_count ?? 1 })
      : t(lang, mode === 'all' ? 'inputs_card.combine_all' : 'inputs_card.combine_any')
    modeText = `[${hint}]`
  }

  return { friendlyName, entityIds: entityIds.join(', '), modeText }
}

/**
 * Secondary line of an entity-backed input row. The friendly name already moved
 * into the title when the input has no own name, so it is repeated here only
 * when an own name took the title.
 */
export function getEntitySubline(input: InputConfig, display: EntityDisplay, extra = ''): string {
  return [input.name ? display.friendlyName : '', display.modeText, extra].filter(Boolean).join(' ')
}

/** Localized "Mode: …" hint of a button input. */
export function getButtonModeText(input: InputConfig, hass?: HomeAssistant | null): string {
  const lang = hass?.locale?.language
  const key = input.button_mode === 'toggle' ? 'input_row_editor.mode_toggle' : 'input_row_editor.mode_click'
  return t(lang, 'inputs_card.mode', { mode: t(lang, key) })
}

/** Localized hint naming the event type of an event input; empty for any other input. */
export function getEventTypeHint(input: InputConfig, hass?: HomeAssistant | null): string {
  if (input.type !== 'event' || !input.event_type) return ''
  return `[${t(hass?.locale?.language, 'input_row_editor.type_event')}: ${input.event_type}]`
}

/**
 * What triggered an activity: the input, plus the entity that fired it — on a
 * multi-entity input that is the only hint which one it was. An unnamed
 * single-entity input already displays that entity's name, so it is not repeated.
 */
export function getTriggerSource(inputName: string, entityId: string | null | undefined, hass?: HomeAssistant | null): string {
  if (!entityId) return inputName
  const entityName = sceneDisplayName(hass, entityId)
  return entityName === inputName ? inputName : `${inputName} (${entityName})`
}

/**
 * User-facing display name for an input:
 * Uses cosmetic name or label if set, otherwise friendlyName if entities present,
 * otherwise type label ("Motion Sensor", "Event Input", "Binary Input", "Button", "Daily Timer").
 */
export function getInputDisplayName(input: InputConfig, hass?: HomeAssistant | null): string {
  if (input.label && input.label.trim()) return input.label.trim()
  if (input.name && input.name.trim()) return input.name.trim()
  if (input.entity_ids && input.entity_ids.length > 0 && hass) {
    const { friendlyName } = getEntityDisplay(input, hass)
    if (friendlyName && friendlyName !== 'No entities configured') {
      return friendlyName
    }
  }
  if (input.type === 'motion') return t(hass?.locale?.language, 'inputs_card.motion_sensor')
  if (input.type === 'event') return t(hass?.locale?.language, 'inputs_card.event_input')
  if (input.type === 'binary') return t(hass?.locale?.language, 'inputs_card.binary_input')
  if (input.type === 'button') return t(hass?.locale?.language, 'inputs_card.button')
  if (input.type === 'timer') return t(hass?.locale?.language, 'inputs_card.daily_timer')
  return input.id
}

/** Localized short type label for an input (the type badge), e.g. "Bewegung". */
export function getInputTypeLabel(input: InputConfig, hass?: HomeAssistant | null): string {
  const keys: Record<InputConfig['type'], TranslationKey> = {
    motion: 'input_row_editor.type_motion',
    binary: 'input_row_editor.type_binary',
    event: 'input_row_editor.type_event',
    timer: 'input_row_editor.type_timer',
    button: 'input_row_editor.type_button',
  }
  return t(hass?.locale?.language, keys[input.type])
}

/**
 * Parse a lenient time-of-day input into (h, m, s) components. The backend only
 * accepts strict HH:MM:SS (helpers.parse_hms_parts), so a bare "22" or "22:30"
 * would be rejected and the timer silently never fires. This accepts the common
 * shorthands and validates as a real clock time:
 *   "22"       → 22:00:00
 *   "8:05"     → 08:05:00
 *   "22:30:15" → 22:30:15
 * Hours must be 0–23, minutes/seconds 0–59. Returns null for empty or invalid.
 */
export function parseTimeOfDay(raw: string): [number, number, number] | null {
  const s = raw.trim()
  if (s === '') return null

  const parts = s.split(':')
  if (parts.length < 1 || parts.length > 3) return null
  if (!parts.every(p => /^\d+$/.test(p))) return null

  const [h, m = 0, sec = 0] = parts.map(p => parseInt(p, 10))
  if (h > 23 || m > 59 || sec > 59) return null
  return [h, m, sec]
}

/** Format a lenient time-of-day string to strict HH:MM:SS, or null if invalid. */
export function normalizeTimeOfDay(raw: string): string | null {
  const parsed = parseTimeOfDay(raw)
  if (parsed === null) return null
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(parsed[0])}:${pad(parsed[1])}:${pad(parsed[2])}`
}

/** True if the input is empty or a valid time-of-day. */
export function isValidTimeOfDay(raw: string): boolean {
  return raw.trim() === '' || parseTimeOfDay(raw) !== null
}

export function getDisablerText(
  disabledBy: string[],
  rulesConfig?: { id: string; name?: string }[],
  activitiesConfig?: { id: string; name?: string | null }[],
  locale?: string
): string {
  const reasons = disabledBy.map(d => {
    if (d === 'no_entity') return t(locale, 'input_row_editor.no_entity_disabler')
    if (d === 'user') return t(locale, 'input_row_editor.disabled_by_user')
    if (d.startsWith('activity:')) {
      const actId = d.substring(9)
      const found = activitiesConfig?.find(a => a.id === actId)
      return t(locale, 'input_row_editor.disabled_by_activity', { name: found?.name || found?.id || actId })
    }
    if (d.startsWith('rule:')) {
      const ruleId = d.substring(5)
      const found = rulesConfig?.find(r => r.id === ruleId)
      return t(locale, 'input_row_editor.disabled_by_rule', { name: found?.name || found?.id || ruleId })
    }
    return d
  })
  return reasons.join(', ')
}
