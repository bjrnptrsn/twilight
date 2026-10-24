import {
  type ActivityConfig,
  type PlaceholderDefaults,
  type ActivityAction,
  type ReleaseAction,
  type RuleConfig,
} from './types'
import { t } from './i18n'

export interface FallbackActivityInfo {
  auto_expire: string
  transition_off_seconds: number
}

// Effective default for an activity's fields. auto_expire comes from the backend
// PlaceholderDefaults (const.py); the rest are fixed const defaults. Never sourced
// from area_template.
export function getFallbackActivityInfo(
  placeholderDefaults: PlaceholderDefaults | null
): FallbackActivityInfo {
  return {
    auto_expire: placeholderDefaults?.auto_expire ?? '03:00:00',
    transition_off_seconds: placeholderDefaults?.transition_off_seconds ?? 0,
  }
}

/**
 * Parse a lenient duration input into total seconds. The backend only accepts
 * strict HH:MM:SS (helpers.parse_hms), so a bare "12" or "5:30" would silently
 * fall back to 0 (= no timer). This normalizes the common shorthands:
 *   "12"       → 12s
 *   "90"       → 90s  (1m 30s)
 *   "5:30"     → 5m 30s
 *   "1:02:03"  → 1h 2m 3s
 * Minutes/seconds may exceed 59 in shorthand and carry over. Returns null for
 * empty input and for anything that isn't a valid number / colon-separated form.
 */
export function parseDurationInput(raw: string): number | null {
  const s = raw.trim()
  if (s === '') return null

  const parts = s.split(':')
  if (parts.length > 3) return null
  if (!parts.every(p => /^\d+$/.test(p))) return null

  const nums = parts.map(p => parseInt(p, 10))
  if (nums.length === 1) return nums[0]                          // seconds
  if (nums.length === 2) return nums[0] * 60 + nums[1]           // M:SS
  return nums[0] * 3600 + nums[1] * 60 + nums[2]                 // H:MM:SS
}

/** Format total seconds as strict HH:MM:SS for backend storage. */
export function secondsToHms(total: number): string {
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const sec = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(sec)}`
}

/**
 * Normalize a lenient duration string to strict HH:MM:SS, or null if empty.
 * Returns null for invalid input (callers should block save on invalid first).
 */
export function normalizeDuration(raw: string): string | null {
  const secs = parseDurationInput(raw)
  return secs === null ? null : secondsToHms(secs)
}

/** True if the input is empty (→ use default) or a parseable duration. */
export function isValidDurationInput(raw: string): boolean {
  return raw.trim() === '' || parseDurationInput(raw) !== null
}

export function formatDuration(val: string | number | null | undefined, fallback?: string | number, locale?: string): string {
  const resolved = (val === null || val === undefined) ? fallback : val
  if (resolved === null || resolved === undefined) {
    return '—'
  }
  // 0 is a real duration ("expire immediately"), not "never" — the off switch
  // is auto_expire_enabled, which the callers check before calling here.
  if (resolved === '00:00:00' || resolved === 0 || resolved === '0') return t(locale, 'common.seconds_short', { count: 0 })

  if (typeof resolved === 'number') {
    if (resolved < 0) return t(locale, 'common.seconds_short', { count: 0 })
    const h = Math.floor(resolved / 3600)
    const m = Math.floor((resolved % 3600) / 60)
    const s = Math.floor(resolved % 60)
    let label = ''
    if (h > 0) label += `${t(locale, 'common.hours', { count: h })} `
    if (m > 0) label += `${t(locale, 'common.minutes_short', { count: m })} `
    if (s > 0) label += t(locale, 'common.seconds_short', { count: s })
    return label.trim() || t(locale, 'common.seconds_short', { count: 0 })
  }

  const parts = resolved.split(':')
  if (parts.length === 3) {
    const h = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10)
    const s = parseInt(parts[2], 10)
    let label = ''
    if (h > 0) label += `${t(locale, 'common.hours', { count: h })} `
    if (m > 0) label += `${t(locale, 'common.minutes_short', { count: m })} `
    if (s > 0) label += t(locale, 'common.seconds_short', { count: s })
    return label.trim() || t(locale, 'common.seconds_short', { count: 0 })
  }
  return resolved
}

export function formatActionCell(action?: ActivityAction, locale?: string): string {
  const type = action?.type
  if (!type) return '—'
  if (type === 'slot') return t(locale, 'activity_row_editor.cell_action_slot')
  if (type === 'block') return t(locale, 'activity_row_editor.cell_action_block')
  if (type === 'reset') return t(locale, 'activity_row_editor.cell_action_reset')
  if (type === 'simulation') return t(locale, 'activity_row_editor.cell_action_simulation')
  if (type === 'entity') {
    const parts = (action?.entity_id || '').split('.')
    return t(locale, 'activity_row_editor.cell_action_entity', { name: parts[1] || action?.entity_id || '—' })
  }
  if (type === 'light') {
    const count = action?.targets?.length ?? 0
    return t(locale, 'activity_row_editor.cell_action_light', { count })
  }
  return type
}

export function formatReleaseCell(release?: ReleaseAction, locale?: string): string {
  const type = release?.type
  if (!type) return '—'
  if (type === 'turn_off') return t(locale, 'activity_row_editor.cell_release_turn_off')
  if (type === 'slot') return t(locale, 'activity_row_editor.cell_release_restore_slot')
  if (type === 'none') return t(locale, 'activity_row_editor.cell_release_nothing')
  return type
}

export function getActivityActionType(
  activityId: string,
  config: ActivityConfig[] | undefined
): string | null {
  const act = config?.find(a => a.id === activityId)
  return act?.action?.type ?? null
}

export function ensureDefaultActivities(activities?: ActivityConfig[]): ActivityConfig[] {
  if (!activities || activities.length === 0) {
    return [{ id: 'sleep', suppress_inputs: [], auto_expire: null }]
  }
  return activities
}

export function getActivitySupportsExcludedSlots(activity: ActivityConfig | null | undefined): boolean {
  if (!activity) return false
  return activity.action?.type === 'slot'
}

export function getActivitySupportsAutoExpire(activity: ActivityConfig | null | undefined): boolean {
  if (!activity) return false
  if (activity.action?.type === 'reset') return false
  // A missing/null auto_expire is not "no timer" — the backend falls back to
  // DEFAULT_AUTO_EXPIRE whenever auto_expire_enabled isn't explicitly false
  // (_get_activity_auto_expire_seconds() in coordinator.py). The enabled flag
  // is the only source of truth since the auto_expire_enabled switch replaced
  // the old "empty string = disabled" convention.
  return activity.auto_expire_enabled !== false
}


export function getActivitySupportsBorrowedAutoExpire(activity: ActivityConfig | null | undefined): boolean {
  if (!activity) return false
  if (activity.action?.type === 'reset') return false
  return activity.auto_expire_enabled === false
}

export function getActivitySupportsInputSuppression(activity: ActivityConfig | null | undefined): boolean {
  if (!activity) return false
  return activity.action?.type !== 'reset'
}

export function getActivityHasRuleSupport(activity: ActivityConfig | null | undefined): boolean {
  if (!activity) return false
  return (
    getActivitySupportsExcludedSlots(activity) ||
    getActivitySupportsAutoExpire(activity) ||
    getActivitySupportsBorrowedAutoExpire(activity) ||
    getActivitySupportsInputSuppression(activity)
  )
}

// A disabled rule flagged `auto_disabled_reason: 'mismatch'` was auto-disabled by
// the backend (_disable_mismatched_rules() in
// websocket/areas.py) rather than disabled by the user — surfaced in
// rules-card.ts / rules-dialog.ts so the reason is visible, not just an
// unexplained "Disabled" status. Reads the backend-set flag directly instead of
// re-deriving a mismatch from the current field/capability combination: a rule
// the user disabled themselves can happen to have fields that would also "look"
// mismatched, which would otherwise misattribute a manual action to the
// automatic mechanism.
export function hasRuleCapabilityMismatch(rule: RuleConfig, _activities: ActivityConfig[]): boolean {
  return !rule.enabled && rule.auto_disabled_reason === 'mismatch'
}

