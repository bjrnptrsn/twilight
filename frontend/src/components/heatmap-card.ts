import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { type HomeAssistant, type HeatmapProfileConfig } from '../lib/types'
import * as api from '../lib/api'
import { setupCanvasCtx } from '../lib/utils'
import { DialogController } from '../lib/dialog-controller'
import { cardDotStyles } from '../lib/shared-styles'
import { StaleGuard, type StaleToken } from '../lib/stale-guard'
import { TwilightLocalizeMixin, type TranslationKey } from '../lib/i18n'
import './dialogs'

// ---------------------------------------------------------------------------
// Heatmap Card — weekday-aggregated activity (motion or light state)
// Self-contained: manages its own range, mode, and loading state.
// ---------------------------------------------------------------------------

const PAD_LEFT   = 60
const PAD_RIGHT  = 15
const PAD_TOP    = 15
const PAD_BOTTOM = 25

type HeatmapRange = '1w' | '2w' | '1m' | '3m' | '6m'
type HeatmapMode = 'motion' | 'light'

const RANGE_LABEL_KEYS: Record<HeatmapRange, TranslationKey> = {
  '1w': 'heatmap_card.range_1w',
  '2w': 'heatmap_card.range_2w',
  '1m': 'heatmap_card.range_1m',
  '3m': 'heatmap_card.range_3m',
  '6m': 'heatmap_card.range_6m',
}

type HeatmapResolution = '5m' | '10m' | '15m' | '30m' | '60m'

const RESOLUTION_LABEL_KEYS: Record<HeatmapResolution, TranslationKey> = {
  '5m': 'heatmap_card.res_5m',
  '10m': 'heatmap_card.res_10m',
  '15m': 'heatmap_card.res_15m',
  '30m': 'heatmap_card.res_30m',
  '60m': 'heatmap_card.res_60m',
}

const RESOLUTION_SLOTS: Record<HeatmapResolution, { count: number; duration: number }> = {
  '5m': { count: 288, duration: 300 },
  '10m': { count: 144, duration: 600 },
  '15m': { count: 96, duration: 900 },
  '30m': { count: 48, duration: 1800 },
  '60m': { count: 24, duration: 3600 },
}

const RANGE_DAYS: Record<HeatmapRange, number> = {
  '1w': 7,
  '2w': 14,
  '1m': 30,
  '3m': 90,
  '6m': 180,
}

const MAX_PROFILES = 5

const _tzPartsFormatter = new Map<string, Intl.DateTimeFormat>()
function _tzFormatter(tz: string): Intl.DateTimeFormat {
  let f = _tzPartsFormatter.get(tz)
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    _tzPartsFormatter.set(tz, f)
  }
  return f
}

/** The instant's UTC offset in seconds, for the given IANA timezone. */
function tzOffsetSec(instant: Date, tz: string): number {
  const parts = Object.fromEntries(
    _tzFormatter(tz).formatToParts(instant).map(p => [p.type, p.value])
  )
  // hour12:false renders midnight as "24"; treat both as 0.
  const hour = Number(parts.hour) % 24
  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    hour,
    Number(parts.minute),
    Number(parts.second)
  )
  return Math.round((asIfUtc - instant.getTime()) / 1000)
}

/**
 * Unix seconds (UTC) of local midnight, for the local calendar date the given
 * instant falls on in `tz`. Uses Intl.formatToParts (spec-defined) instead of
 * round-tripping through Date string parsing, which is locale/engine-dependent,
 * and re-derives the offset per day so DST-transition days (23h/25h) resolve
 * to the correct wall-clock midnight instead of a naive +24h assumption.
 */
export function localMidnightSec(instant: Date, tz: string): number {
  const offset = tzOffsetSec(instant, tz)
  const localInstantSec = Math.floor(instant.getTime() / 1000) + offset
  const localMidnightAsUtcSec = Math.floor(localInstantSec / 86400) * 86400
  // localMidnightAsUtcSec is midnight expressed as if it were UTC; convert
  // back to the real UTC instant using the offset at that midnight itself
  // (matters when the offset changes between `instant` and local midnight).
  const midnightOffset = tzOffsetSec(new Date(localMidnightAsUtcSec * 1000), tz)
  return localMidnightAsUtcSec - midnightOffset
}

/**
 * Resolve HA's locale.first_weekday setting into a Monday-relative day index (0..6):
 * 0 = Monday, 1 = Tuesday, 2 = Wednesday, 3 = Thursday, 4 = Friday, 5 = Saturday, 6 = Sunday.
 */
export function resolveFirstWeekdayIndex(localeData?: HomeAssistant['locale']): number {
  const fw = localeData?.first_weekday
  if (typeof fw === 'number') {
    if (fw === 0 || fw === 7) return 6
    if (fw >= 1 && fw <= 6) return fw - 1
  }
  if (typeof fw === 'string') {
    const s = String(fw).toLowerCase().trim()
    if (s === 'monday' || s === 'mon') return 0
    if (s === 'tuesday' || s === 'tue') return 1
    if (s === 'wednesday' || s === 'wed') return 2
    if (s === 'thursday' || s === 'thu') return 3
    if (s === 'friday' || s === 'fri') return 4
    if (s === 'saturday' || s === 'sat') return 5
    if (s === 'sunday' || s === 'sun') return 6
  }

  const lang = localeData?.language || (typeof navigator !== 'undefined' ? navigator.language : 'en-US')
  try {
    const loc = new Intl.Locale(lang)
    const firstDay = (loc as any).weekInfo?.firstDay ?? (loc as any).getWeekInfo?.()?.firstDay
    if (typeof firstDay === 'number') {
      if (firstDay === 7) return 6
      if (firstDay >= 1 && firstDay <= 6) return firstDay - 1
    }
  } catch {}

  const l = lang.toLowerCase()
  if (l.startsWith('en-us') || l.startsWith('en-ca') || l.startsWith('ja') || l.startsWith('he') || l.startsWith('ar')) {
    return 6
  }

  return 0
}

/**
 * Short weekday labels for the 7 days of the week starting from `firstDayIndex`
 * (0 = Monday, ..., 6 = Sunday), read back via Intl in `tz` itself rather than derived
 * from a UTC offset — a UTC-anchored calculation lands on the wrong calendar day for
 * zones beyond UTC+12 (e.g. Pacific/Kiritimati, UTC+14).
 */
export function localWeekdayLabels(instant: Date, tz: string, locale: string, firstDayIndex: number = 0): string[] {
  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const localWeekdayIdx = weekdayNames.indexOf(
    new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: tz }).format(instant)
  )
  const mondayBasedIdx = (localWeekdayIdx + 6) % 7
  const startOffset = (mondayBasedIdx - firstDayIndex + 7) % 7
  const startDate = new Date(instant.getTime() - startOffset * 24 * 60 * 60 * 1000)
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: tz })
  return Array.from({ length: 7 }, (_, i) =>
    formatter.format(new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000))
  )
}

/**
 * Aggregate recorder events into a [7][slotsCount] average-density matrix.
 * Caps open active intervals at `now` to prevent projecting current state into future hours.
 * Supports multi-entity streams in rawEvents by detecting timestamp resets (ts[k] < ts[k-1]).
 */
export function computeLiveDensities(
  rawEvents: [number, number][],
  tz: string,
  daysCount: number,
  resolution: HeatmapResolution,
  now: Date = new Date()
): number[][] {
  const nowSec = Math.floor(now.getTime() / 1000)
  const { duration: slotDuration, count: slotsCount } = RESOLUTION_SLOTS[resolution]

  const weekdaySums: number[][] = Array.from({ length: 7 }, () => new Array(slotsCount).fill(0))
  const weekdayCounts = new Array(7).fill(0)

  const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: tz })
  const weekdayIndex: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }

  // 1. Separate rawEvents into sub-streams per entity (by detecting timestamp resets ts[k] < ts[k-1])
  const entityStreams: [number, number][][] = []
  let currentStream: [number, number][] = []
  let prevTs = -1

  for (const point of rawEvents) {
    if (point[0] < prevTs) {
      if (currentStream.length > 0) entityStreams.push(currentStream)
      currentStream = []
    }
    currentStream.push(point)
    prevTs = point[0]
  }
  if (currentStream.length > 0) entityStreams.push(currentStream)

  if (entityStreams.length === 0) {
    return Array.from({ length: 7 }, () => new Array(slotsCount).fill(0))
  }

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i, 12, 0, 0)

    const startSec = localMidnightSec(d, tz)
    const endSec = localMidnightSec(new Date((startSec + 25 * 3600) * 1000), tz)

    // Critical fix: The maximum effective timestamp for history evaluation is capped at nowSec
    const dayEndSec = Math.min(endSec, nowSec)
    if (startSec >= dayEndSec) {
      // Day is in the future / hasn't started yet
      continue
    }

    const localDayOfWeek = weekdayIndex[weekdayFormatter.format(new Date(startSec * 1000))] ?? 0

    // Compute active intervals for each entity stream on this day
    const daySegments: { start: number; end: number; val: number }[] = []

    for (const stream of entityStreams) {
      let lastState = 0
      for (const [ts, val] of stream) {
        if (ts <= startSec) {
          lastState = val
        } else {
          break
        }
      }

      let currentStart = startSec
      let currentState = lastState

      for (const [ts, val] of stream) {
        if (ts <= startSec) continue
        if (ts >= dayEndSec) {
          daySegments.push({ start: currentStart, end: dayEndSec, val: currentState })
          currentStart = dayEndSec
          break
        }
        daySegments.push({ start: currentStart, end: ts, val: currentState })
        currentStart = ts
        currentState = val
      }

      if (currentStart < dayEndSec) {
        daySegments.push({ start: currentStart, end: dayEndSec, val: currentState })
      }
    }

    // Segments from different entity streams are each chronological within
    // their own stream but not merged across streams — sort once per day so
    // the slot loop below can use a sliding window instead of rescanning all
    // segments for every one of the up to 288 slots (O(days * segments) total
    // instead of O(days * slots * segments)).
    daySegments.sort((a, b) => a.start - b.start)
    let segWindowStart = 0

    // For each slot j on this day
    for (let j = 0; j < slotsCount; j++) {
      const slotStart = startSec + j * slotDuration
      const slotEnd = slotStart + slotDuration

      // If slotStart is beyond dayEndSec (in the future of today), density is 0
      if (slotStart >= dayEndSec) {
        continue
      }

      const effectiveSlotEnd = Math.min(slotEnd, dayEndSec)
      const effectiveDuration = effectiveSlotEnd - slotStart
      if (effectiveDuration <= 0) continue

      // Advance the window past segments that end at/before this slot starts —
      // sorted by start, but a long segment can still end after later ones
      // begin, so this only drops segments that can no longer overlap *any*
      // remaining slot (slots are visited in increasing start order).
      while (
        segWindowStart < daySegments.length &&
        daySegments[segWindowStart].end <= slotStart
      ) {
        segWindowStart++
      }

      // Sum overlap duration across active segments (val == 1)
      let activeSeconds = 0
      for (let s = segWindowStart; s < daySegments.length; s++) {
        const seg = daySegments[s]
        if (seg.start >= effectiveSlotEnd) break
        const overlapStart = Math.max(seg.start, slotStart)
        const overlapEnd = Math.min(seg.end, effectiveSlotEnd)
        if (overlapStart < overlapEnd && seg.val === 1) {
          activeSeconds += (overlapEnd - overlapStart)
        }
      }

      const density = Math.min(1.0, activeSeconds / effectiveDuration)
      weekdaySums[localDayOfWeek][j] += density
    }
    weekdayCounts[localDayOfWeek]++
  }

  const averageDensities: number[][] = Array.from({ length: 7 }, () => new Array(slotsCount).fill(0))
  for (let w = 0; w < 7; w++) {
    const count = weekdayCounts[w]
    for (let j = 0; j < slotsCount; j++) {
      averageDensities[w][j] = count > 0 ? (weekdaySums[w][j] / count) : 0
    }
  }
  return averageDensities
}

@customElement('twilight-heatmap-card')
export class HeatmapCard extends TwilightLocalizeMixin(LitElement) {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ type: String }) activeAreaId: string | null = null

  @state() private _activeMode: HeatmapMode = 'motion'
  @state() private _activeRange: HeatmapRange = '1w'
  @state() private _activeResolution: HeatmapResolution = '10m'
  @state() private _loading = false
  @state() private _motionData: [number, number][] = []
  @state() private _lightData: [number, number][] = []
  @state() private _profiles: HeatmapProfileConfig[] = []
  // Data source: 'live' = compute from the recorder, else a saved profile id
  // whose stored motion_buckets are rendered read-only.
  @state() private _activeSource: 'live' | string = 'live'
  // Range/resolution the user had selected in live mode, restored when
  // switching back from a profile (which pins these to its own snapshot values).
  private _liveRange: HeatmapRange = this._activeRange
  private _liveResolution: HeatmapResolution = this._activeResolution
  @state() private _w = 0

  private get _activeProfile(): HeatmapProfileConfig | null {
    if (this._activeSource === 'live') return null
    return this._profiles.find(p => p.id === this._activeSource) ?? null
  }

  private _dialogs = new DialogController(this)
  private _ro: ResizeObserver | null = null
  // Guards recorder loads against out-of-order responses when the selected
  // area or time range changes mid-request.
  private _loadGuard = new StaleGuard()
  // Tracks which connection the last load was made against. `hass` is a new
  // object reference on every state-change tick (not just on reconnect), so
  // comparing against the previous `hass` reference re-triggered a full
  // recorder query (up to 365 days) on every tick while this card was
  // mounted. `hass.connection` only changes on a genuine reconnect.
  private _loadedConnection: HomeAssistant['connection'] | null = null

  static styles = [
    cardDotStyles,
    css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: clip;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);

      --tw-chart-light-on: #ff9100;
      --tw-chart-motion: #00e5ff;
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 20px 12px;
      border-bottom: 1px solid var(--divider-color);
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .card-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .controls-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .toggle-group {
      display: flex;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      border-radius: 8px;
      padding: 2px;
      border: 1px solid var(--divider-color);
    }
    .toggle-btn {
      background: transparent;
      border: none;
      color: var(--secondary-text-color);
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s;
      outline: none;
    }
    .toggle-btn:hover {
      color: var(--primary-text-color);
    }
    .toggle-btn.active {
      background: var(--tp-accent, var(--accent-color));
      color: white;
    }
    .toggle-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }
    .toggle-btn:disabled:hover {
      color: var(--secondary-text-color);
    }
    .source-select {
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 5px 8px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      outline: none;
    }
    .canvas-wrap {
      position: relative;
      width: 100%;
      height: 180px;
      min-height: 180px;
      min-width: 0;
    }
    canvas {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .no-data {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 13px;
      color: var(--secondary-text-color);
      border-radius: 8px;
    }
    .loading-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--card-background-color) 60%, transparent);
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 500;
      backdrop-filter: blur(1px);
      z-index: 5;
    }
    .profiles-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 20px;
      background: color-mix(in srgb, var(--primary-text-color) 2%, transparent);
      border-bottom: 1px solid var(--divider-color);
      gap: 12px;
      flex-wrap: wrap;
    }
    .profiles-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .profiles-list {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .profile-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      border-radius: 6px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      border: 1px solid var(--divider-color);
      font-size: 12px;
      color: var(--primary-text-color);
    }
    .profile-chip.active {
      border-color: var(--tp-accent, var(--accent-color));
      background: color-mix(in srgb, var(--tp-accent, var(--accent-color)) 14%, transparent);
    }
    .profile-chip .badge {
      font-size: 10px;
      opacity: 0.75;
      background: color-mix(in srgb, var(--primary-text-color) 12%, transparent);
      padding: 1px 4px;
      border-radius: 4px;
    }
    .chip-action {
      background: transparent;
      border: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      padding: 2px;
      font-size: 12px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s, background 0.15s;
    }
    .chip-action:hover {
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .save-profile-btn {
      background: color-mix(in srgb, var(--tp-accent, var(--accent-color)) 15%, transparent);
      color: var(--tp-accent, var(--accent-color));
      border: 1px solid color-mix(in srgb, var(--tp-accent, var(--accent-color)) 30%, transparent);
      border-radius: 6px;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .save-profile-btn:hover {
      background: var(--tp-accent, var(--accent-color));
      color: white;
    }
  `]

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
      const wrap = this.shadowRoot?.querySelector('.canvas-wrap')
      if (wrap) {
        this._ro = new ResizeObserver(entries => {
          const w = entries[0].contentRect.width
          if (w > 0 && w !== this._w) {
            this._w = w
            this._draw()
          }
        })
        this._ro.observe(wrap)
      }
    }

    const hassChanged = Boolean(this.hass) && this.hass!.connection !== this._loadedConnection
    const areaChanged = changed.has('activeAreaId') && changed.get('activeAreaId') !== this.activeAreaId
    // A profile selection also assigns _activeRange (pinned to the profile's
    // snapshot values), but the profile's data is already local (motion_buckets)
    // — no recorder fetch needed. Only a live-mode range change should reload.
    const rangeChanged = changed.has('_activeRange') && this._activeSource === 'live'

    if (hassChanged || areaChanged || rangeChanged) {
      if (this.hass) this._loadedConnection = this.hass.connection
      this._load()
    }

    if (
      changed.has('_motionData') ||
      changed.has('_lightData') ||
      changed.has('_activeMode') ||
      changed.has('_activeResolution') ||
      changed.has('_activeSource') ||
      changed.has('_profiles') ||
      changed.has('_w')
    ) {
      requestAnimationFrame(() => this._draw())
    }
  }

  private async _loadProfiles(token?: StaleToken) {
    if (!this.hass || !this.activeAreaId) return
    try {
      const profiles = await api.heatmapProfileList(this.hass, this.activeAreaId)
      if (token && !token.isCurrent()) return
      this._profiles = profiles
    } catch (e) {
      console.error('Twilight heatmap profiles load error:', e)
    }
  }

  private async _load() {
    if (!this.hass || !this.activeAreaId) return
    this._loading = true
    // Area and range can both change mid-request (dropdown, range buttons) —
    // an older area's recorder data must not land in the newer area's chart.
    const token = this._loadGuard.begin()
    try {
      const [result] = await Promise.all([
        api.analyticsGet(this.hass, {
          area_id: this.activeAreaId,
          days: RANGE_DAYS[this._activeRange],
          binary_only: true,
        }),
        this._loadProfiles(token),
      ])
      if (!token.isCurrent()) return
      this._motionData = result.motion ?? []
      this._lightData = result.light_on ?? []
    } catch (e) {
      console.error('Twilight heatmap load error:', e)
    } finally {
      if (token.isCurrent()) this._loading = false
    }
  }

  private async _saveCurrentProfile() {
    if (!this.hass || !this.activeAreaId) return
    if (this._profiles.length >= MAX_PROFILES) {
      await this._dialogs.showAlert(this.t('heatmap_card.limit_reached_title'), this.t('heatmap_card.limit_reached_desc', { count: MAX_PROFILES }))
      return
    }
    const name = await this._dialogs.showPrompt(
      this.t('heatmap_card.save_profile_title'),
      this.t('heatmap_card.profile_default_name'),
      this.t('heatmap_card.profile_name_placeholder')
    )
    if (!name) return

    try {
      await api.heatmapProfileSave(this.hass, {
        area_id: this.activeAreaId,
        name,
        resolution: this._activeResolution,
        range: this._activeRange,
      })
      await this._loadProfiles()
    } catch (e) {
      await this._dialogs.showAlert(this.t('heatmap_card.error_title'), this.t('heatmap_card.profile_save_failed', { error: (e as Error).message }))
    }
  }

  private async _updateProfile(prof: HeatmapProfileConfig) {
    if (!this.hass || !this.activeAreaId) return
    try {
      await api.heatmapProfileSave(this.hass, {
        area_id: this.activeAreaId,
        name: prof.name,
        resolution: prof.resolution,
        range: prof.range,
        profile_id: prof.id,
      })
      await this._loadProfiles()
      await this._dialogs.showAlert(this.t('heatmap_card.profile_updated_title'), this.t('heatmap_card.profile_updated_desc', { name: prof.name }))
    } catch (e) {
      await this._dialogs.showAlert(this.t('heatmap_card.error_title'), this.t('heatmap_card.profile_update_failed', { error: (e as Error).message }))
    }
  }

  private async _deleteProfile(prof: HeatmapProfileConfig) {
    if (!this.hass || !this.activeAreaId) return
    const confirmed = await this._dialogs.showConfirm(this.t('heatmap_card.delete_profile_title'), this.t('heatmap_card.delete_profile_desc', { name: prof.name }))
    if (!confirmed) return
    try {
      await api.heatmapProfileDelete(this.hass, {
        area_id: this.activeAreaId,
        profile_id: prof.id,
      })
      // Fall back to the live view if the deleted profile was being shown.
      if (this._activeSource === prof.id) this._setSource('live')
      await this._loadProfiles()
    } catch (e) {
      await this._dialogs.showAlert(this.t('heatmap_card.error_title'), this.t('heatmap_card.profile_delete_failed', { error: (e as Error).message }))
    }
  }

  /**
   * Switch the rendered data source. Selecting a saved profile pins the
   * resolution/range toggles to the profile's snapshot values (read-only) and
   * forces Motion mode (profiles store only motion_buckets).
   */
  private _setSource(source: 'live' | string) {
    const wasLive = this._activeSource === 'live'
    this._activeSource = source
    const prof = source === 'live' ? null : this._profiles.find(p => p.id === source)
    if (prof) {
      if (wasLive) {
        this._liveRange = this._activeRange
        this._liveResolution = this._activeResolution
      }
      this._activeMode = 'motion'
      this._activeResolution = prof.resolution as HeatmapResolution
      this._activeRange = prof.range as HeatmapRange
    } else {
      this._activeResolution = this._liveResolution
      this._activeRange = this._liveRange
    }
  }

  private _setMode(mode: HeatmapMode) {
    // Profiles are motion-only; ignore mode switches while a profile is shown.
    if (this._activeProfile) return
    this._activeMode = mode
  }

  private _setRange(range: HeatmapRange) {
    if (this._activeProfile) return
    this._activeRange = range
  }

  private _setResolution(res: HeatmapResolution) {
    if (this._activeProfile) return
    this._activeResolution = res
  }

  private _getFillColorRGB(): string {
    const varName = this._activeMode === 'motion' ? '--tw-chart-motion' : '--tw-chart-light-on'
    const fallback = this._activeMode === 'motion' ? '#00e5ff' : '#ff9100'
    const raw = getComputedStyle(this).getPropertyValue(varName).trim() || fallback
    if (raw.startsWith('#')) {
      const r = parseInt(raw.slice(1, 3), 16)
      const g = parseInt(raw.slice(3, 5), 16)
      const b = parseInt(raw.slice(5, 7), 16)
      return `${r}, ${g}, ${b}`
    }
    const match = raw.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
    if (match) {
      return `${match[1]}, ${match[2]}, ${match[3]}`
    }
    return this._activeMode === 'motion' ? '0, 176, 255' : '255, 145, 0'
  }

  private _getTextColor(): string {
    const cs = getComputedStyle(this)
    return cs.getPropertyValue('--secondary-text-color').trim() ||
      cs.getPropertyValue('--primary-text-color').trim() ||
      'rgba(255, 255, 255, 0.65)'
  }

  private _getGridColor(): string {
    return getComputedStyle(this).getPropertyValue('--divider-color').trim() || 'rgba(128,128,128,0.2)'
  }

  private _getAxisFont(): string {
    const f =
      getComputedStyle(this).getPropertyValue('--font-family').trim() ||
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    return `400 12px ${f}`
  }

  /**
   * Read a saved profile's stored motion_buckets into the [7][slotsCount]
   * density matrix. The profile's buckets already match its own resolution
   * (slotsCount), so no resampling is needed; a missing weekday/short list is
   * padded with zeros.
   */
  private _profileDensities(prof: HeatmapProfileConfig, slotsCount: number): number[][] {
    return Array.from({ length: 7 }, (_, w) => {
      const src = prof.motion_buckets[String(w)] ?? []
      return Array.from({ length: slotsCount }, (_, j) => src[j] ?? 0)
    })
  }

  private _draw() {
    const canvas = this.shadowRoot?.querySelector<HTMLCanvasElement>('canvas')
    if (!canvas || !this._w || !this.hass) return

    const cssW = this._w
    const cssH = canvas.getBoundingClientRect().height
    if (!cssH) return

    const ctx = setupCanvasCtx(canvas, cssW, cssH)
    const innerW = cssW - PAD_LEFT - PAD_RIGHT
    const innerH = cssH - PAD_TOP - PAD_BOTTOM
    const rowHeight = innerH / 7 // Fixed 7 rows, first = hass.locale.first_weekday
    const tz = this.hass.config.time_zone || 'UTC'
    const locale = this.hass.locale?.language || navigator.language || 'en-US'

    const firstDayIndex = resolveFirstWeekdayIndex(this.hass.locale)

    // 1. Generate local weekday names, anchored to the first day of the week in `tz`.
    const weekdayLabels = localWeekdayLabels(new Date(), tz, locale, firstDayIndex)

    // 2. Build the per-weekday density matrix — from a saved profile's stored
    // motion_buckets when one is selected, otherwise computed live from the
    // recorder events.
    const prof = this._activeProfile
    const { count: slotsCount } = RESOLUTION_SLOTS[this._activeResolution]

    let averageDensities: number[][] | null
    if (prof) {
      averageDensities = this._profileDensities(prof, slotsCount)
    } else {
      const rawEvents = this._activeMode === 'motion' ? this._motionData : this._lightData
      if (!rawEvents || rawEvents.length === 0) {
        ctx.restore()
        return
      }
      averageDensities = computeLiveDensities(
        rawEvents,
        tz,
        RANGE_DAYS[this._activeRange],
        this._activeResolution
      )
    }

    if (!averageDensities) {
      ctx.restore()
      return
    }

    // 4. Render rows
    const fillColor = this._getFillColorRGB()
    const textColor = this._getTextColor()
    const gridColor = this._getGridColor()
    ctx.font = this._getAxisFont()

    for (let w = 0; w < 7; w++) {
      const y = PAD_TOP + w * rowHeight
      const dayIndex = (firstDayIndex + w) % 7

      ctx.fillStyle = textColor
      ctx.textAlign = 'right'
      ctx.fillText(weekdayLabels[w], PAD_LEFT - 10, y + rowHeight / 2 + 4)

      if (w > 0) {
        ctx.strokeStyle = gridColor
        ctx.beginPath()
        ctx.moveTo(PAD_LEFT, y)
        ctx.lineTo(cssW - PAD_RIGHT, y)
        ctx.stroke()
      }

      // Draw slots
      for (let j = 0; j < slotsCount; j++) {
        const density = averageDensities[dayIndex][j]
        if (density > 0) {
          const cellX = PAD_LEFT + (j / slotsCount) * innerW
          const cellW = innerW / slotsCount + 0.5
          const cellH = rowHeight - 2

          let opacity = 0
          if (this._activeMode === 'motion') {
            // Motion events are very short; we boost visibility using a square root scale
            opacity = Math.min(1, Math.sqrt(density) * 1.8)
          } else {
            // Light events are longer; standard linear scale works best
            opacity = Math.min(1, density * 1.2)
          }

          ctx.fillStyle = `rgba(${fillColor}, ${opacity})`
          ctx.fillRect(cellX, y + 1, cellW, cellH)
        }
      }
    }

    // 5. Vertical hour lines
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1
    for (let h = 0; h <= 24; h += 2) {
      const x = PAD_LEFT + (h / 24) * innerW
      ctx.beginPath()
      ctx.moveTo(x, PAD_TOP)
      ctx.lineTo(x, cssH - PAD_BOTTOM)
      ctx.stroke()
    }

    // 6. Hour labels
    ctx.fillStyle = textColor
    for (let h = 0; h <= 24; h += 4) {
      const x = PAD_LEFT + (h / 24) * innerW
      const label = `${h.toString().padStart(2, '0')}:00`
      ctx.textAlign = h === 0 ? 'start' : h === 24 ? 'end' : 'center'
      ctx.fillText(label, x, cssH - 8)
    }

    ctx.restore()
  }

  render() {
    const prof = this._activeProfile
    const readOnly = prof !== null
    const hasData = readOnly
      ? Object.keys(prof.motion_buckets).length > 0
      : (this._activeMode === 'motion' ? this._motionData : this._lightData)?.length > 0

    return html`
      <div class="card-header">
        <div class="header-left">
          <span class="card-dot" style="--dot-color: #8b5cf6;"></span>
          <span class="card-title" role="heading" aria-level="2">${this.t('heatmap_card.title')}</span>
        </div>
        <div class="controls-row">
          <select
            class="source-select"
            .value=${this._activeSource}
            @change=${(e: Event) => this._setSource((e.target as HTMLSelectElement).value)}
            title=${this.t('heatmap_card.data_source')}
          >
            <option value="live" ?selected=${this._activeSource === 'live'}>${this.t('heatmap_card.live_recorder')}</option>
            ${this._profiles.map(p => html`
              <option value=${p.id} ?selected=${p.id === this._activeSource}>${p.name}</option>
            `)}
          </select>
          <div class="toggle-group">
            <button
              class="toggle-btn ${this._activeMode === 'motion' ? 'active' : ''}"
              ?disabled=${readOnly}
              @click=${() => this._setMode('motion')}
            >
              ${this.t('heatmap_card.mode_motion')}
            </button>
            <button
              class="toggle-btn ${this._activeMode === 'light' ? 'active' : ''}"
              ?disabled=${readOnly}
              @click=${() => this._setMode('light')}
            >
              ${this.t('heatmap_card.mode_light')}
            </button>
          </div>
          <div class="toggle-group">
            ${(Object.keys(RESOLUTION_LABEL_KEYS) as HeatmapResolution[]).map(r => html`
              <button
                class="toggle-btn ${this._activeResolution === r ? 'active' : ''}"
                ?disabled=${readOnly}
                @click=${() => this._setResolution(r)}
              >
                ${this.t(RESOLUTION_LABEL_KEYS[r])}
              </button>
            `)}
          </div>
          <div class="toggle-group">
            ${(Object.keys(RANGE_LABEL_KEYS) as HeatmapRange[]).map(r => html`
              <button
                class="toggle-btn ${this._activeRange === r ? 'active' : ''}"
                ?disabled=${readOnly}
                @click=${() => this._setRange(r)}
              >
                ${this.t(RANGE_LABEL_KEYS[r])}
              </button>
            `)}
          </div>
        </div>
      </div>
      <div class="profiles-bar">
        <div class="profiles-label">
          <span>${this.t('heatmap_card.saved_profiles')}:</span>
        </div>
        <div class="profiles-list">
          ${this._profiles.map(
            p => html`
              <div class="profile-chip ${this._activeSource === p.id ? 'active' : ''}">
                <span style="cursor:pointer" @click=${() => this._setSource(p.id)} title=${this.t('heatmap_card.click_view_profile')}>
                  ${p.name}
                </span>
                <span class="badge">${p.resolution} / ${p.range}</span>
                <button
                  class="chip-action"
                  title=${this.t('heatmap_card.update_profile')}
                  aria-label=${this.t('heatmap_card.update_profile')}
                  @click=${() => this._updateProfile(p)}
                >
                  🔄
                </button>
                <button
                  class="chip-action"
                  title=${this.t('heatmap_card.delete_profile')}
                  aria-label=${this.t('heatmap_card.delete_profile')}
                  @click=${() => this._deleteProfile(p)}
                >
                  ✕
                </button>
              </div>
            `
          )}
          ${this._profiles.length < MAX_PROFILES
            ? html`
                <button class="save-profile-btn" @click=${this._saveCurrentProfile}>
                  ${this.t('heatmap_card.save_profile')}
                </button>
              `
            : ''}
        </div>
      </div>

      <div class="canvas-wrap">
        ${!hasData && !this._loading
          ? html`<div class="no-data">${this.t('heatmap_card.no_data')}</div>`
          : html`<canvas tabindex="0" role="img" aria-label=${this.t('heatmap_card.title')}></canvas>`}
        ${this._loading ? html`<div class="loading-overlay">${this.t('heatmap_card.loading')}</div>` : ''}
      </div>

      <twilight-alert-dialog
        .hass=${this.hass}
        .open=${this._dialogs.alertOpen}
        .dialogTitle=${this._dialogs.alertTitle}
        .message=${this._dialogs.alertMessage}
        @close=${this._dialogs._onCloseAlert}
      ></twilight-alert-dialog>

      <twilight-confirm-dialog
        .hass=${this.hass}
        .open=${this._dialogs.confirmOpen}
        .dialogTitle=${this._dialogs.confirmTitle}
        .message=${this._dialogs.confirmMessage}
        @confirm=${this._dialogs._onConfirm}
        @cancel=${this._dialogs._onCancelConfirm}
      ></twilight-confirm-dialog>

      <twilight-prompt-dialog
        .hass=${this.hass}
        .open=${this._dialogs.promptOpen}
        .dialogTitle=${this._dialogs.promptTitle}
        .message=${this._dialogs.promptMessage}
        .placeholder=${this._dialogs.promptPlaceholder}
        .value=${this._dialogs.promptValue}
        @submit=${this._dialogs._onSubmitPrompt}
        @cancel=${this._dialogs._onCancelPrompt}
      ></twilight-prompt-dialog>
    `
  }
}
