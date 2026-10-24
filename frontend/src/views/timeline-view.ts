import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { HomeAssistant, AreaConfig, Slot } from '../lib/types'
import { isDarkMode } from '../lib/theme-utils'
import * as api from '../lib/api'
import { getChannels } from '../lib/channel-helpers'
import { convertCalculatedTimesToSlots, localDateString, haLocalDateString, haLocalMinutesOfDay, formatSlotTime } from '../lib/utils'
import {
  COLOR_NIGHT, COLOR_ASTRO, COLOR_NAUT, COLOR_CIVIL, COLOR_GOLD, COLOR_DAY,
  type DayData,
  type SunDayResult,
} from '../lib/sun-zones'
import { viewHeaderStyles } from '../lib/shared-styles'
import { StaleGuard } from '../lib/stale-guard'
import { TwilightLocalizeMixin, formatTime } from '../lib/i18n'
import '../components/sun-path-card'
import '../components/sun-year-card'

// ---------------------------------------------------------------------------
// Demo locations (Phase 5h)
// ---------------------------------------------------------------------------

interface DemoLocation {
  name: string
  lat: number
  lon: number
  tz: string
}

const DEMO_LOCATIONS: DemoLocation[] = [
  // Northern hemisphere
  { name: 'North Pole',  lat:  90.0,  lon:   0.0,   tz: 'UTC' },
  { name: 'Qaanaaq',     lat:  77.47, lon: -69.23,  tz: 'America/Thule' },
  { name: 'Reykjavík',   lat:  64.13, lon: -21.90,  tz: 'Atlantic/Reykjavik' },
  { name: 'Helsinki',    lat:  60.17, lon:  24.94,  tz: 'Europe/Helsinki' },
  { name: 'Hamburg',     lat:  53.55, lon:   9.99,  tz: 'Europe/Berlin' },  // Development location
  { name: 'Paris',       lat:  48.85, lon:   2.35,  tz: 'Europe/Paris' },
  { name: 'New York',    lat:  40.71, lon: -74.01,  tz: 'America/New_York' },
  { name: 'Tokyo',       lat:  35.68, lon: 139.69,  tz: 'Asia/Tokyo' },
  { name: 'Cairo',       lat:  30.05, lon:  31.24,  tz: 'Africa/Cairo' },
  { name: 'Honolulu',    lat:  21.31, lon: -157.86, tz: 'Pacific/Honolulu' },
  // Equator
  { name: 'Equator',     lat:   0.0,  lon:   0.0,   tz: 'UTC' },
  // Southern hemisphere
  { name: 'Nairobi',         lat:  -1.29, lon:  36.82,  tz: 'Africa/Nairobi' },
  { name: 'Santiago',        lat: -33.45, lon: -70.67,  tz: 'America/Santiago' },
  { name: 'Cape Town',       lat: -33.93, lon:  18.42,  tz: 'Africa/Johannesburg' },
  { name: 'Auckland',        lat: -36.85, lon: 174.76,  tz: 'Pacific/Auckland' },
  { name: 'Ushuaia',         lat: -54.80, lon: -68.30,  tz: 'America/Argentina/Ushuaia' },
  { name: 'McMurdo Station', lat: -77.85, lon: 166.67,  tz: 'Pacific/Auckland' },
  { name: 'South Pole',      lat: -90.00, lon:   0.00,  tz: 'UTC' },
]

const DEMO_SPEEDS = [10, 25, 50, 100, 250]

// SunPoint, SunEvent, SunDayResult, DayData, SunYearResult all imported from sun-zones.ts

// Layout constants - visual dimensions are defined within cards and CSS templates.

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

@customElement('twilight-timeline-view')
export class TimelineView extends TwilightLocalizeMixin(LitElement) {
  @property({ attribute: false }) hass: HomeAssistant | null = null

  @state() private _days: DayData[] = []
  @state() private _year = new Date().getFullYear()
  @state() private _loading = false
  @state() private _error = ''
  @state() private _hoverIdx: number | null = null
  // Browser-TZ bootstrap value only — `hass` isn't available yet at field
  // init, so this can't call _getLiveDateStr() (HA/demo TZ) here. Corrected
  // to the right timezone as soon as `hass` arrives, via updated()'s
  // auto-follow branch and _loadYear()'s own _getLiveDateStr() call.
  @state() private _selectedDate = localDateString()
  // True once the user has explicitly picked a date (click/date-selected).
  // Until then, _selectedDate auto-follows "today" on the 1s tick so the day
  // chart rolls over at midnight instead of staying stuck on the old date.
  private _userSelectedDate = false
  @state() private _sunData: SunDayResult | null = null
  @state() private _hoverTime: number | null = null
  @state() private _scrubbing = false
  @state() private _isDark = false

  // Phase 5h — Demo mode
  @state() private _demoLocationIdx = -1   // -1 = HA home location
  @state() private _demoPlaying = false
  @state() private _demoDayIdx = 0         // day index for demo playback (0..364)
  @state() private _demoSpeed = DEMO_SPEEDS[2] || 50 // speed in ms

  // Phase 7 — Zone visualisation mode
  @state() private _clamped = false
  @state() private _showSlots = false
  @state() private _slotCurves: Record<string, (number | null)[]> | null = null

  // Area selection
  @state() private _areas: AreaConfig[] = []
  @state() private _selectedAreaId: string | null = null
  @state() private _channelSlotsMap: Record<string, Slot[]> | undefined = undefined

  private _updateInterval: number | null = null
  private _demoInterval: number | null = null
  private _dayCache = new Map<string, SunDayResult>()
  private _channelSlotsCache = new Map<string, Record<string, Slot[]>>()
  private _lastLoadDayTime = 0
  private _loadDayTimeout: number | null = null
  // Guards the year/slot-curve load against out-of-order responses when the
  // year, demo location, or selected area changes mid-request.
  private _yearGuard = new StaleGuard()

  /** Cap for the day/channel-slot caches: demo playback can iterate hundreds
   *  of dates across demo locations, so without a bound the two maps grow
   *  without limit over a long session. Oldest entry is dropped first. */
  private static readonly CACHE_MAX_ENTRIES = 256

  private _cacheSet<T>(map: Map<string, T>, key: string, value: T) {
    if (map.has(key)) map.delete(key)
    map.set(key, value)
    if (map.size > TimelineView.CACHE_MAX_ENTRIES) {
      const oldest = map.keys().next().value
      if (oldest !== undefined) map.delete(oldest)
    }
  }

  // ---------------------------------------------------------------------------
  // Styles
  // ---------------------------------------------------------------------------

  static styles = [
    viewHeaderStyles,
    css`
    :host {
      --dev-border: 0px dashed color-mix(in srgb, var(--primary-text-color, #fff) 25%, transparent);
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: transparent;
      padding: 0;
    }

    /* New two-tier 12-column grid layout */
    .view-header-grid {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-sizing: border-box;
      width: 100%;
      min-width: max-content;
    }
    .view-header-grid h2 {
      line-height: 24px;
      white-space: nowrap;
    }

    .view-content-container {
      padding: 24px;
      width: 100%;
      box-sizing: border-box;
      flex: 1;
      overflow-y: auto;
    }

    .view-content-grid {
      display: flex;
      flex-direction: row;
      gap: 16px;
      align-items: stretch;
      box-sizing: border-box;
      width: 100%;
    }

    .view-content-grid .span-9 {
      flex: 9;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
      min-height: 0;
    }

    .view-content-grid .span-3 {
      flex: 3;
      min-width: 300px;
    }

    .view-content-grid .day-wrap {
      height: 280px;
      flex-shrink: 0;
    }

    .view-content-grid .year-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .span-2  { grid-column: span 2; min-width: 0; }
    .span-3  { grid-column: span 3; min-width: 0; }
    .span-4  { grid-column: span 4; min-width: 0; }
    .span-5  { grid-column: span 5; min-width: 0; }
    .span-6  { grid-column: span 6; min-width: 0; }
    .span-7  { grid-column: span 7; min-width: 0; }
    .span-8  { grid-column: span 8; min-width: 0; }
    .span-9  { grid-column: span 9; min-width: 0; }
    .span-12 { grid-column: span 12; min-width: 0; }

    @media (max-width: 1024px) {
      .view-content-grid {
        flex-direction: column;
        align-items: stretch;
      }
      .view-content-grid .span-9,
      .view-content-grid .span-3 {
        flex: none;
        width: 100%;
      }
      .view-content-grid .year-wrap {
        flex: none;
        height: 380px;
      }
      .span-2, .span-3, .span-4, .span-5, .span-6, .span-7, .span-8, .span-9 {
        grid-column: span 12;
      }
      .view-header-grid {
        gap: 12px;
      }
      .view-header-grid .demo-controls {
        grid-column: span 12;
        margin-left: 0 !important;
        flex-wrap: wrap;
      }
    }


    /* ── Right: info panel ──────────────────────────────────── */
    .info-panel {
      display: flex;
      flex-direction: column;
      padding: 20px;
      gap: 0;
      overflow-y: auto;
      min-width: 0;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
    }

    .info-date {
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 600;
      font-variant: small-caps;
      text-align: center;
    }
    .info-date span {
      color: var(--secondary-text-color);
      display: block;
      font-size: 13px;
      font-weight: 400;
      margin-top: 2px;
    }

    .info-section {
      border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color, #fff) 15%, transparent);
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1.5px;
      margin: 14px 0 4px;
      padding-bottom: 4px;
      text-transform: uppercase;
    }
    .info-section:first-of-type { margin-top: 4px; }

    .info-row {
      align-items: center;
      display: flex;
      font-size: 13px;
      justify-content: space-between;
      padding: 2px 0px;
    }
    .info-label {
      color: var(--secondary-text-color);
      font-weight: 300;
    }
    .info-value {
      color: var(--primary-text-color);
      font-weight: 500;
    }

    /* Legend inside info panel */
    .legend-section { margin-top: 16px; }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      color: var(--secondary-text-color);
      padding: 3px 0;
    }
    .legend-swatch {
      width: 12px; height: 12px;
      border-radius: 2px;
      flex-shrink: 0;
      border: 1px solid color-mix(in srgb, var(--primary-text-color, #fff) 15%, transparent);
      box-sizing: border-box;
    }

    /* Phase badge */
    .phase-badge {
      display: inline-block;
      padding: 1px 7px;
      border-radius: 9px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      font-family: inherit;
    }
    .phase-day   { background: rgba(122, 184, 212, 0.15); color: #7ab8d4; border: 1px solid rgba(122, 184, 212, 0.3); }
    .phase-civil { background: rgba(70, 104, 144, 0.18);  color: #7ab8d4; border: 1px solid rgba(70, 104, 144, 0.35); }
    .phase-naut  { background: rgba(52, 80, 122, 0.25);   color: #8bb3e8; border: 1px solid rgba(52, 80, 122, 0.45); }
    .phase-astro { background: rgba(37, 58, 90, 0.35);    color: #a4c5f0; border: 1px solid rgba(37, 58, 90, 0.55); }
    .phase-night { background: rgba(13, 15, 24, 0.5);     color: #5b6f8a; border: 1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent); }

    /* Phase badge - Light Theme overrides */
    :host:not([dark]) .phase-day   { background: rgba(122, 184, 212, 0.12); color: #2b7396; border: 1px solid rgba(122, 184, 212, 0.4); }
    :host:not([dark]) .phase-civil { background: rgba(70, 104, 144, 0.12);  color: #284d7a; border: 1px solid rgba(70, 104, 144, 0.4); }
    :host:not([dark]) .phase-naut  { background: rgba(52, 80, 122, 0.12);   color: #1a3d6c; border: 1px solid rgba(52, 80, 122, 0.4); }
    :host:not([dark]) .phase-astro { background: rgba(37, 58, 90, 0.12);    color: #172b49; border: 1px solid rgba(37, 58, 90, 0.4); }
    :host:not([dark]) .phase-night { background: rgba(0, 0, 0, 0.05);       color: #2d3748; border: 1px solid rgba(0, 0, 0, 0.15); }

    /* Solar Noon & Midnight colors */
    .noon {
      color: #ffb300;
    }
    .midnight {
      color: #8bb3e8;
    }
    :host:not([dark]) .noon {
      color: #b25e00;
    }
    :host:not([dark]) .midnight {
      color: #1a5ea8;
    }

    /* ── Demo controls ──────────────────────────────────────── */
    .demo-select {
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent));
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 12px;
      cursor: pointer;
      max-width: 130px;
    }
    .demo-select:focus { outline: none; border-color: var(--accent-color, #e91e8c); }
    .demo-play {
      background: transparent;
      color: var(--secondary-text-color);
      border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 12%, transparent));
      border-radius: 4px;
      padding: 3px 10px;
      font-size: 13px;
      cursor: pointer;
      line-height: 1;
    }
    .demo-play:hover { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); color: var(--primary-text-color); }
    .demo-play.playing { border-color: var(--accent-color, #e91e8c); color: var(--accent-color, #e91e8c); }

    /* ── Zone-mode toggle (Phase 7) ───────────────────────────── */
    .zone-toggle {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 12%, transparent));
      border-radius: 4px;
      overflow: hidden;
    }
    .zone-toggle button {
      background: transparent;
      color: var(--secondary-text-color);
      border: 0;
      border-left: 1px solid color-mix(in srgb, var(--primary-text-color, #fff) 15%, transparent);
      padding: 3px 9px;
      font-size: 11px;
      letter-spacing: 0.3px;
      cursor: pointer;
      line-height: 1;
      text-transform: uppercase;
    }
    .zone-toggle button:first-child { border-left: 0; }
    .zone-toggle button:hover { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); color: var(--primary-text-color); }
    .zone-toggle button.active {
      background: color-mix(in srgb, var(--primary-text-color) 12%, transparent);
      color: var(--accent-color, #e91e8c);
    }

    .demo-location-badge {
      font-size: 11px;
      color: var(--accent-color, #e91e8c);
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .error { color: var(--error-color, #f44336); font-size: 13px; }
  `]

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  connectedCallback() {
    super.connectedCallback()
    this._updateInterval = window.setInterval(() => {
      if (!this._scrubbing) {
        this.requestUpdate()
      }
    }, 1000)
  }

  disconnectedCallback() {
    if (this._updateInterval) clearInterval(this._updateInterval)
    this._stopDemo()
    if (this._loadDayTimeout) {
      clearTimeout(this._loadDayTimeout)
      this._loadDayTimeout = null
    }
    this._yearGuard.cancel()
    super.disconnectedCallback()
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('hass') && this.hass) {
      const isDarkNow = isDarkMode(this.hass, this)
      if (isDarkNow !== this._isDark) {
        this._isDark = isDarkNow
        this.toggleAttribute('dark', isDarkNow)
      }
    }
    if (changed.has('hass') && this.hass && !this._areas.length && !this._hasLoadedAreasOnce && !this._loadingAreas)
      this._loadAreas()
    if (changed.has('hass') && this.hass && !this._days.length && !this._loading && !this._hasLoadedYearOnce)
      this._loadYear()
    // Follow the calendar day forward across midnight as long as the user
    // hasn't manually picked a different date.
    if (!this._userSelectedDate && this._hasLoadedYearOnce) {
      const today = this._getLiveDateStr()
      if (today !== this._selectedDate) this._selectedDate = today
    }
    if (changed.has('_selectedDate') && this.hass && this._selectedDate)
      this._loadDay()
  }

  // ---------------------------------------------------------------------------
  // Data
  // ---------------------------------------------------------------------------

  // Set once each loader has run with a real hass object. Guards the "hass
  // arrived late" retry above — without these, an empty result or a
  // persistent backend error kept the length check at 0 forever, re-firing
  // the loader (and its WS request) on every hass tick.
  private _hasLoadedAreasOnce = false
  private _hasLoadedYearOnce = false
  private _loadingAreas = false

  private async _loadAreas() {
    if (!this.hass || this._loadingAreas || this._hasLoadedAreasOnce) return
    this._loadingAreas = true
    try {
      this._areas = await api.areasList(this.hass)
    } catch (e) {
      console.error('Failed to load areas for timeline view', e)
    } finally {
      // Set on both success and failure — a persistent backend error must not
      // re-fire the request on every hass tick. A page reload is the retry path.
      this._hasLoadedAreasOnce = true
      this._loadingAreas = false
    }
  }

  // Returns extra lat/lon/tz params if a demo location is active
  private _locParams(): Record<string, unknown> {
    const loc = DEMO_LOCATIONS[this._demoLocationIdx]
    if (!loc) return {}
    return { lat: loc.lat, lon: loc.lon, tz: loc.tz }
  }

  private async _loadYear() {
    if (!this.hass) return
    this._loading = true; this._error = ''
    // Year/location/area can all change while a request is in flight (demo
    // location cycling switches them rapidly) — only the newest result may be
    // applied, otherwise the chart shows a previous location's curves.
    const token = this._yearGuard.begin()
    try {
      const [r, slotTimes] = await Promise.all([
        api.sunYear(this.hass, { year: this._year, ...this._locParams() }),
        api.timelineSlotTimes(this.hass, {
          year: this._year,
          ...this._locParams(),
          area_id: this._selectedAreaId ?? undefined,
        }).catch(() => null)
      ])
      if (!token.isCurrent()) return
      this._days = r.days; this._year = r.year
      this._slotCurves = slotTimes?.curves ?? null
      const today = this._getLiveDateStr()
      this._selectedDate = this._days.some(d => d.date === today) ? today : (this._days[0]?.date ?? today)
    } catch (e: unknown) {
      if (token.isCurrent()) {
        this._error = e instanceof Error ? e.message : String(e)
      }
    } finally {
      if (token.isCurrent()) {
        // Set on both success and failure — a persistent backend error must
        // not re-fire the request on every hass tick. A page reload is the
        // retry path; the error stays visible via _error.
        this._hasLoadedYearOnce = true
        this._loading = false
      }
    }
  }

  private _loadDay() {
    if (this._loadDayTimeout) {
      clearTimeout(this._loadDayTimeout)
      this._loadDayTimeout = null
    }

    const cacheKey = `${this._demoLocationIdx}_${this._selectedAreaId}_${this._selectedDate}`

    if (this._demoPlaying) {
      // If we have cached data, apply it immediately for 60fps local playback
      if (this._dayCache.has(cacheKey)) {
        this._sunData = this._dayCache.get(cacheKey)!
        this._channelSlotsMap = this._channelSlotsCache.get(cacheKey)
        return
      }
    }

    // Check cache for non-demo playback too
    if (this._dayCache.has(cacheKey)) {
      this._sunData = this._dayCache.get(cacheKey)!
      this._channelSlotsMap = this._channelSlotsCache.get(cacheKey)
      return
    }

    const now = Date.now()
    const elapsed = now - this._lastLoadDayTime
    const delay = 10 // Max 100 requests per second

    if (elapsed >= delay) {
      this._executeLoadDay()
    } else {
      this._loadDayTimeout = window.setTimeout(() => {
        this._executeLoadDay()
      }, delay - elapsed)
    }
  }

  private async _executeLoadDay() {
    if (!this.hass || !this._selectedDate) return
    this._lastLoadDayTime = Date.now()
    const targetDate = this._selectedDate
    const cacheKey = `${this._demoLocationIdx}_${this._selectedAreaId}_${targetDate}`
    const isCurrent = () =>
      `${this._demoLocationIdx}_${this._selectedAreaId}_${this._selectedDate}` === cacheKey
    try {
      const res = await api.sunDay(this.hass, { date: targetDate, ...this._locParams() })
      this._cacheSet(this._dayCache, cacheKey, res)
      if (isCurrent()) {
        this._sunData = res
      }
    } catch {
      if (isCurrent()) {
        this._sunData = null
      }
    }
    await this._loadChannelSlots(targetDate)
  }

  // Resolves each channel's slots for the selected area/day via the backend
  // resolver (twilight/slot_times/preview) — mirrors the draft-preview path
  // used by the area_template editor, keeping resolution backend-first.
  private async _loadChannelSlots(dateStr: string) {
    if (!this.hass || !this._selectedAreaId) {
      this._channelSlotsMap = undefined
      return
    }
    const area = this._areas.find(a => a.area_id === this._selectedAreaId)
    if (!area) {
      this._channelSlotsMap = undefined
      return
    }
    const cacheKey = `${this._demoLocationIdx}_${this._selectedAreaId}_${dateStr}`
    const isCurrent = () =>
      `${this._demoLocationIdx}_${this._selectedAreaId}_${this._selectedDate}` === cacheKey
    const entries = Object.entries(getChannels(area))
    try {
      const results = await Promise.all(
        entries.map(([, chCfg]) => api.slotTimesPreview(this.hass!, { slots: chCfg.slots || [], date: dateStr }))
      )
      const map: Record<string, Slot[]> = {}
      entries.forEach(([chId, chCfg], i) => {
        map[chId] = convertCalculatedTimesToSlots(results[i].slots, chCfg.slots || [])
      })
      this._cacheSet(this._channelSlotsCache, cacheKey, map)
      if (isCurrent()) {
        this._channelSlotsMap = map
      }
    } catch (e) {
      console.error('Failed to load channel slots for timeline area selection', e)
      if (isCurrent()) {
        this._channelSlotsMap = undefined
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Demo mode (Phase 5h)
  // ---------------------------------------------------------------------------

  private _stopDemo() {
    if (this._demoInterval) { clearInterval(this._demoInterval); this._demoInterval = null }
    this._demoPlaying = false
  }

  private _toggleDemo() {
    if (this._demoPlaying) { this._stopDemo(); return }
    this._demoPlaying = true
    this._demoDayIdx = 0
    this._advanceDemoDay()
    this._demoInterval = window.setInterval(() => this._advanceDemoDay(), this._demoSpeed)
  }

  private _changeDemoSpeed(speed: number) {
    this._demoSpeed = speed
    if (this._demoPlaying) {
      if (this._demoInterval) clearInterval(this._demoInterval)
      this._demoInterval = window.setInterval(() => this._advanceDemoDay(), this._demoSpeed)
    }
  }

  private _advanceDemoDay() {
    if (!this._days.length) return
    const idx = Math.min(this._demoDayIdx, this._days.length - 1)
    this._userSelectedDate = true
    this._selectedDate = this._days[idx].date
    this._demoDayIdx++
    if (this._demoDayIdx >= this._days.length) {
      this._stopDemo()
    }
  }

  private async _selectLocation(idx: number) {
    this._stopDemo()
    this._demoLocationIdx = idx
    if (idx !== -1) {
      this._selectedAreaId = null
    }
    this._days = []
    this._sunData = null
    await this._loadYear()
    await this._loadDay()
  }

  private async _selectArea(areaId: string | null) {
    this._stopDemo()
    this._selectedAreaId = areaId
    if (areaId !== null) {
      this._demoLocationIdx = -1
    }
    this._days = []
    this._sunData = null
    await this._loadYear()
    await this._loadDay()
  }

  private _toggleClamped() {
    this._clamped = !this._clamped
  }

  private _toggleSlots() {
    this._showSlots = !this._showSlots
  }

  // ---------------------------------------------------------------------------
  // Shared helpers
  // ---------------------------------------------------------------------------

  private _fmt(m: number | null): string {
    if (m === null) return '—'
    const c = Math.round(((m % 1440) + 1440) % 1440)
    const h = Math.floor(c / 60) % 24
    const min = c % 60
    // Minutes-since-midnight has no calendar date; anchor to a fixed UTC
    // instant and format in UTC so the local timezone never shifts it.
    const d = new Date(Date.UTC(2000, 0, 1, h, min))
    // 'numeric' (not '2-digit') so a 12h-format user sees "6:30 PM" instead
    // of a padded "06:30 PM" — h23 still pads on its own ("06:30").
    return formatTime(d, this.hass?.locale, { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })
  }

  private _fmtDur(mins: number | null): string {
    if (mins === null || mins < 0) return '—'
    const h = Math.floor(mins / 60)
    const min = Math.round(mins % 60)
    if (h > 0 && min > 0) return `${this.t('common.hours', { count: h })} ${this.t('common.minutes', { count: min })}`
    if (h > 0) return this.t('common.hours', { count: h })
    return this.t('common.minutes', { count: min })
  }

  private _getLiveTime(): number {
    const loc = DEMO_LOCATIONS[this._demoLocationIdx]
    const tz = loc?.tz
    const n = new Date()
    if (tz) {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: tz, hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false,
      }).formatToParts(n)
      const h = Number(parts.find(p => p.type === 'hour')?.value ?? 0)
      const m = Number(parts.find(p => p.type === 'minute')?.value ?? 0)
      const s = Number(parts.find(p => p.type === 'second')?.value ?? 0)
      return h * 60 + m + s / 60
    }
    // No demo location active: the chart is anchored to HA's timezone, not
    // the browser's — use hass.config.time_zone or the live marker drifts
    // from the data whenever they differ (see haLocalMinutesOfDay()).
    return haLocalMinutesOfDay(this.hass, n)
  }

  // Mirrors _getLiveTime()'s timezone selection (demo location's own tz, else
  // HA's) — "today" must use the same anchor as the live time marker, or the
  // date rolls over at the wrong moment relative to the chart it's driving.
  private _getLiveDateStr(): string {
    const tz = DEMO_LOCATIONS[this._demoLocationIdx]?.tz
    return haLocalDateString(this.hass, new Date(), tz)
  }

  private _interpolateSun(t: number): { elevation: number; azimuth: number } {
    if (!this._sunData?.points.length) return { elevation: 0, azimuth: 0 }
    const pts = this._sunData.points
    // Binary search for the surrounding points (pts may have gaps if backend skipped any)
    let lo = 0, hi = pts.length - 1
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1
      if (pts[mid].time <= t) lo = mid; else hi = mid
    }
    const p1 = pts[lo], p2 = pts[hi]
    if (!p1) return { elevation: 0, azimuth: 0 }
    if (p1 === p2 || p2.time === p1.time) return { elevation: p1.elevation, azimuth: p1.azimuth }
    const f = (t - p1.time) / (p2.time - p1.time)
    const elevation = p1.elevation + (p2.elevation - p1.elevation) * f
    let a1 = p1.azimuth, a2 = p2.azimuth
    if (Math.abs(a2 - a1) > 180) { if (a2 < a1) a2 += 360; else a1 += 360 }
    return { elevation, azimuth: (a1 + (a2 - a1) * f) % 360 }
  }

  // Canvas coordinate drawing logic and event handlers have been moved to twilight-sun-path-card and twilight-sun-year-card components.

  // ---------------------------------------------------------------------------
  // Phase helpers
  // ---------------------------------------------------------------------------

  private _phaseName(el: number) {
    if (el >= 0)   return this.t('timeline_view.day')
    if (el >= -6)  return this.t('timeline_view.civil_twilight')
    if (el >= -12) return this.t('timeline_view.nautical_twilight')
    if (el >= -18) return this.t('timeline_view.astronomical_twilight')
    return this.t('timeline_view.night')
  }
  private _phaseClass(el: number) {
    if (el >= 0)   return 'phase-day'
    if (el >= -6)  return 'phase-civil'
    if (el >= -12) return 'phase-naut'
    if (el >= -18) return 'phase-astro'
    return 'phase-night'
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  render() {
    const todayStr = this._getLiveDateStr()
    const hovDay = this._hoverIdx !== null ? this._days[this._hoverIdx] : null
    const si = this._days.findIndex(d => d.date === this._selectedDate)
    const selectedDay = si >= 0 ? this._days[si] : (this._days.length ? this._days[0] : null)
    const infoDay = hovDay ?? selectedDay
    const infoDate = hovDay ? hovDay.date : this._selectedDate

    const dispTime = this._hoverTime ?? this._getLiveTime()
    const { elevation: liveEl, azimuth: liveAz } = this._interpolateSun(dispTime)
    const rTime = Math.round(dispTime)
    const liveStr = formatSlotTime(rTime, this.hass?.locale)

    const selectedArea = this._selectedAreaId ? this._areas.find(a => a.area_id === this._selectedAreaId) : null
    const channelSlotsMap = selectedArea ? this._channelSlotsMap : undefined

    return html`
    <!-- Header Grid (1 Row, 12 columns, max 6 items) -->
    <div class="view-header-container">
      <div class="view-header-grid">
        <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 500;">${this.t('timeline_view.title')}</h2>
          <span class="year-label">${this._year}</span>
        </div>
        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-shrink: 0;">
          <select class="demo-select" style="width: auto;"
            ?disabled=${this._demoLocationIdx !== -1}
            @change=${(e: Event) => {
              const val = (e.target as HTMLSelectElement).value
              this._selectArea(val === '' ? null : val)
            }}>
            <option value="" ?selected=${this._selectedAreaId === null}>${this.t('timeline_view.area_default')}</option>
            ${this._areas.map(a => html`
              <option value=${a.area_id} ?selected=${this._selectedAreaId === a.area_id}>${a.name || a.area_id}</option>
            `)}
          </select>

          <div class="zone-toggle" style="margin-right: 8px;" role="group" aria-label=${this.t('timeline_view.zone_visualisation_mode')}>
            <button class=${this._showSlots ? 'active' : ''}
              title=${this.t('timeline_view.toggle_lines')}
              @click=${this._toggleSlots}>${this.t('timeline_view.lines')}</button>
            <button class=${this._clamped ? 'active' : ''}
              title=${this.t('timeline_view.toggle_fields')}
              @click=${this._toggleClamped}>${this.t('timeline_view.fields')}</button>
          </div>

          <select class="demo-select" style="width: auto;"
            ?disabled=${this._selectedAreaId !== null}
            @change=${(e: Event) => this._selectLocation(Number((e.target as HTMLSelectElement).value))}>
            <option value="-1" ?selected=${this._demoLocationIdx === -1}>${this.t('timeline_view.ha_home')}</option>
            ${DEMO_LOCATIONS.map((loc, i) => html`
              <option value=${i} ?selected=${this._demoLocationIdx === i}>${loc.name} (${loc.lat > 0 ? '+' : ''}${loc.lat}°)</option>
            `)}
          </select>

          <button class="demo-play ${this._demoPlaying ? 'playing' : ''}" style="width: 36px; min-width: 36px;"
            title=${this._demoPlaying ? this.t('timeline_view.stop') : this.t('timeline_view.play_year')}
            @click=${() => this._toggleDemo()}>
            ${this._demoPlaying ? '⏹' : '▶'}
          </button>

          <select class="demo-select" style="width: 80px;"
            @change=${(e: Event) => this._changeDemoSpeed(Number((e.target as HTMLSelectElement).value))}>
            ${DEMO_SPEEDS.map(speed => html`
              <option value=${String(speed)} ?selected=${this._demoSpeed === speed}>${speed} ms</option>
            `)}
          </select>
        </div>
        ${this._error ? html`<div class="span-12 error">${this._error}</div>` : ''}
      </div>
    </div>

    ${!this._loading && this._days.length ? html`
      <!-- Main Content Grid (12 columns) -->
      <div class="view-content-container">
        <div class="view-content-grid">
          <!-- Left: stacked canvases (span-9) -->
          <div class="span-9">
            <div class="day-wrap">
              <twilight-sun-path-card
                .hass=${this.hass}
                .date=${this._selectedDate}
                .clamped=${this._clamped}
                .showSlots=${this._showSlots}
                .primaryOnly=${true}
                .noSolarNoonMidnight=${false}
                .days=${this._days}
                .sunData=${this._sunData}
                .channelSlotsMap=${channelSlotsMap}
                .channels=${selectedArea ? getChannels(selectedArea) : {}}
                .hoverTime=${this._hoverTime}
                .liveTime=${this._getLiveTime()}
                .noHeader=${false}
                .noAxisLabels=${false}
                @time-hover-changed=${(e: CustomEvent<{ hoverTime: number | null, scrubbing: boolean }>) => {
                  this._hoverTime = e.detail.hoverTime
                  this._scrubbing = e.detail.scrubbing
                }}
              ></twilight-sun-path-card>
            </div>
            <div class="year-wrap">
              <twilight-sun-year-card
                .hass=${this.hass}
                .days=${this._days}
                .slotCurves=${this._slotCurves}
                .selectedDate=${this._selectedDate}
                .clamped=${this._clamped}
                .showSlots=${this._showSlots}
                .noSolarNoonMidnight=${false}
                .sunData=${this._sunData}
                .hoverTime=${this._hoverTime}
                .hoverIdx=${this._hoverIdx}
                .liveTime=${this._getLiveTime()}
                .noHeader=${false}
                .noAxisLabels=${false}
                @date-selected=${(e: CustomEvent<string>) => { this._userSelectedDate = true; this._selectedDate = e.detail }}
                @year-hover-changed=${(e: CustomEvent<{ index: number | null, date: string | null }>) => this._hoverIdx = e.detail.index}
              ></twilight-sun-year-card>
            </div>
          </div>

          <!-- Right: info panel (span-3) -->
          ${infoDay ? html`
            <div class="span-3">
              <div class="info-panel">
                <div class="info-date">
                  ${infoDate === todayStr ? this.t('timeline_view.today') : (hovDay ? this.t('timeline_view.browse') : this.t('timeline_view.selected'))}
                  <span>${infoDate}</span>
                </div>

                ${this._sunData ? html`
                  <div class="info-section">${this.t('timeline_view.live')}</div>
                  <div class="info-row">
                    <span class="info-label">${this.t('timeline_view.time')}</span>
                    <span class="info-value">${liveStr}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">${this.t('timeline_view.phase')}</span>
                    <span class="info-value"><span class="phase-badge ${this._phaseClass(liveEl)}">${this._phaseName(liveEl)}</span></span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">${this.t('timeline_view.elevation')}</span>
                    <span class="info-value">${liveEl.toFixed(1)}°</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">${this.t('timeline_view.azimuth')}</span>
                    <span class="info-value">${liveAz.toFixed(1)}°</span>
                  </div>
                ` : ''}

                <div class="info-section">${this.t('timeline_view.sun_times')}</div>
                <div class="info-row"><span class="info-label">${this.t('timeline_view.solar_noon')}</span>
                  <span class="info-value noon">${this._fmt(infoDay.solar_noon)}</span></div>
                <div class="info-row"><span class="info-label">${this.t('timeline_view.solar_midnight')}</span>
                  <span class="info-value midnight">${this._fmt(infoDay.solar_midnight)}</span></div>
                <div class="info-row"><span class="info-label">${this.t('timeline_view.sunrise_sunset')}</span>
                  <span class="info-value">${this._fmt(infoDay.sunrise)} / ${this._fmt(infoDay.sunset)}</span></div>
                ${(() => {
                  const clamp = (m: number | null) => m !== null ? ((m % 1440) + 1440) % 1440 : null
                  const diff = (a: number | null, b: number | null) => {
                    const ca = clamp(a), cb = clamp(b)
                    if (ca === null || cb === null) return null
                    let d = cb - ca
                    if (d < 0) d += 1440
                    return d
                  }
                  const dayLen = diff(infoDay.sunrise, infoDay.sunset)
                  const nightLen = dayLen !== null ? 1440 - dayLen : null
                  return html`
                  <div class="info-row"><span class="info-label">${this.t('timeline_view.day_length')}</span>
                    <span class="info-value">${this._fmtDur(dayLen)}</span></div>
                  <div class="info-row"><span class="info-label">${this.t('timeline_view.night_length')}</span>
                    <span class="info-value" style="color:var(--secondary-text-color)">${this._fmtDur(nightLen)}</span></div>`
                })()}

                <div class="info-section">${this.t('timeline_view.twilight')}</div>
                <div class="info-row"><span class="info-label">${this.t('timeline_view.day')}</span>
                  <span class="info-value">
                    ${(() => {
                      const dayStart = infoDay.slot_day ?? infoDay.sunrise
                      const dayEnd = infoDay.slot_gold_dusk ?? infoDay.sunset
                      return dayStart !== null && dayEnd !== null ? `${this._fmt(dayStart)}–${this._fmt(dayEnd)}` : '—'
                    })()}
                  </span></div>
                <div class="info-row"><span class="info-label">${this.t('timeline_view.civil')}</span>
                  <span class="info-value">${this._fmt(infoDay.sunrise)} / ${this._fmt(infoDay.sunset)}</span></div>
                <div class="info-row"><span class="info-label">${this.t('timeline_view.nautical')}</span>
                  <span class="info-value">${this._fmt(infoDay.dawn)} / ${this._fmt(infoDay.dusk)}</span></div>
                <div class="info-row"><span class="info-label">${this.t('timeline_view.astronomical')}</span>
                  <span class="info-value">${this._fmt(infoDay.nautical_dawn)} / ${this._fmt(infoDay.nautical_dusk)}</span></div>
                <div class="info-row"><span class="info-label">${this.t('timeline_view.night')}</span>
                  <span class="info-value">${this._fmt(infoDay.astro_dusk)} / ${this._fmt(infoDay.astro_dawn)}</span></div>
                <div class="info-row"><span class="info-label">${this.t('timeline_view.golden_hour')}</span>
                  <span class="info-value">${this._fmt(infoDay.slot_gold_dawn)} / ${this._fmt(infoDay.slot_gold_dusk)}</span></div>

                <div class="info-section legend-section">${this.t('timeline_view.legend')}</div>
                ${([
                  [COLOR_NIGHT, this.t('timeline_view.night')],
                  [COLOR_ASTRO, this.t('timeline_view.astronomical_twilight')],
                  [COLOR_NAUT,  this.t('timeline_view.nautical_twilight')],
                  [COLOR_CIVIL, this.t('timeline_view.civil_twilight')],
                  [COLOR_GOLD,  this.t('timeline_view.golden_hour')],
                  [COLOR_DAY,   this.t('timeline_view.daylight')],
                ] as [string,string][]).map(([c,l]) => html`
                  <div class="legend-item">
                    <div class="legend-swatch" style="background:${c}"></div>
                    ${l}
                  </div>`)}
                ${([
                  ['#d2dce8', this.t('timeline_view.civil_dusk_daylight')],
                  ['#aeb9c9', this.t('timeline_view.nautical_dusk_civil_dawn')],
                  ['#8792a2', this.t('timeline_view.astro_dusk_nautical_dawn')],
                  ['#5e6572', this.t('timeline_view.night_astro_dawn')],
                ] as [string,string][]).map(([c,l]) => html`
                  <div class="legend-item">
                    <div class="legend-swatch" style="background:${c}; height:5px; border-radius:1.5px; border:1px solid color-mix(in srgb, var(--primary-text-color, #fff) 15%, transparent); box-sizing:border-box;"></div>
                    ${l}
                  </div>`)}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    ` : ''}
    `
  }
}
