import { LitElement, html, css, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { type DayData, type SunDayResult } from '../lib/sun-zones'
import { type RunState, type HomeAssistant, type Area, type AreaConfig, type GlobalConfig, type PlaceholderDefaults, type AreaSlotTimesResult, PRIMARY_CHANNEL_ID } from '../lib/types'
import * as api from '../lib/api'
import './area-detail-view'
import { convertCalculatedTimesToSlots, generateGradient, haLocalDateString, isSlotActiveAt } from '../lib/utils'
import { hostResetStyles, viewHeaderStyles } from '../lib/shared-styles'
import { getChannels, getChannelIds, getChannelSlots } from '../lib/channel-helpers'
import { LiveClockController } from '../lib/live-clock-controller'
import { ensureDefaultActivities } from '../lib/activity-helpers'
import { TwilightLocalizeMixin } from '../lib/i18n'
import { StaleGuard } from '../lib/stale-guard'

type OverviewSlot = ReturnType<typeof convertCalculatedTimesToSlots>[number]

/**
 * Pick the slot the overview badge should show for the Primary channel.
 *
 * Backend-first: a running engine's own `active_slots` wins. Deriving the
 * badge from the local clock + config slot times drifts against the engine
 * wherever the two disagree (offsets, day carry-over, excluded slots) — exactly
 * the phantom-badge problem, and it contradicted the engine dot
 * rendered right next to it.
 *
 * The local computation survives only as a draft preview for an area that has
 * no engine yet (no runState at all). Once a runState exists but carries no
 * Primary slot, the badge shows nothing rather than a locally invented value.
 */
export function resolveOverviewActiveSlot(
  primarySlots: OverviewSlot[],
  runState: RunState | undefined,
  liveMins: number
): OverviewSlot | undefined {
  const engineSlotId = runState?.active_slots?.[PRIMARY_CHANNEL_ID]
  if (engineSlotId) {
    return primarySlots.find(s => s.id === engineSlotId)
  }
  if (runState) return undefined
  return primarySlots.find(s => isSlotActiveAt(s, liveMins))
}

@customElement('twilight-areas-view')
export class AreasView extends TwilightLocalizeMixin(LitElement) {
  static styles = [
    hostResetStyles,
    viewHeaderStyles,
    css`
    twilight-area-detail-view {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }

    *, *:before, *:after {
      box-sizing: border-box;
    }


    /* ── Overview: Header ── */
    .overview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 12px;
      box-sizing: border-box;
    }
    .overview-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      line-height: 24px;
    }
    .overview-header .header-left {
      display: flex;
      align-items: center;
      min-width: 0;
    }
    .overview-header .header-right {
      font-size: 13px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    /* ── Overview: Content ── */
    .rv-content {
      padding: 24px;
      box-sizing: border-box;
      flex: 1;
      overflow-y: auto;
    }

    .area-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .area-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-left: 3px solid transparent;
      border-radius: 16px;
      padding: 16px;
      cursor: pointer;
      transition: border-color 0.2s ease, outline-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 10px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      outline: 1px solid transparent;
      outline-offset: -1px;
    }
    .area-card.enabled { border-left-color: var(--success-color, #4caf50); }
    .area-card:hover,
    .area-card:focus-visible {
      transform: scale(1.01);
      outline-color: var(--shadow-color, var(--tp-accent, var(--accent-color)));
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35),
                  0 0 20px color-mix(in srgb, var(--shadow-color, var(--tp-accent, var(--accent-color))) 30%, transparent);
    }

    .card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .title-group { display: flex; flex-direction: column; gap: 2px; }
    .area-name { font-size: 18px; font-weight: 600; color: var(--primary-text-color); }
    .area-id-sub { display: none; font-size: 11px; color: var(--secondary-text-color); font-family: monospace; opacity: 0.7; }

    .slot-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
      border: 1px solid var(--badge-border, rgba(255,255,255,0.1));
      background: var(--badge-bg, rgba(255,255,255,0.05));
      color: var(--badge-text, var(--primary-text-color));
    }

    .sparkline-container {
      margin: 2px 0 2px 0;
      position: relative;
      height: 64px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .sparkline-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--row-gap, 4px);
      width: 100%;
    }

    .sparkline-row {
      display: flex;
      align-items: center;
      height: var(--row-height, 14px);
    }

    .sparkline-label {
      width: 78px;
      font-size: var(--label-font-size, 9px);
      font-weight: 700;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.8;
    }

    .sparkline-row.disabled .sparkline-label {
      text-decoration: none;
      opacity: 0.4;
    }

    .sparkline-bar-wrapper {
      flex: 1;
      height: var(--bar-height, 10px);
      position: relative;
    }

    .sparkline-bar {
      width: 100%;
      height: 100%;
      border-radius: var(--bar-radius, 5px);
      background: var(--bar-gradient, rgba(255, 255, 255, 0.05));
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-sizing: border-box;
    }

    .sparkline-row.disabled .sparkline-bar {
      opacity: 0.3;
      filter: grayscale(100%);
    }

    .sparkline-bar.empty {
      background: rgba(255, 255, 255, 0.01);
      border: 1px dashed rgba(255, 255, 255, 0.08);
    }

    .sparkline-indicator-line {
      position: absolute;
      top: 0px;
      bottom: 0px;
      width: 2px;
      background: #ffffff;
      box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
      pointer-events: none;
      z-index: 5;
    }

    .card-details {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 10px;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .details-column {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 8px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 8px;
      min-height: 64px;
      box-sizing: border-box;
      min-width: 0;
    }

    .details-column.scenes-col {
      justify-content: flex-start;
      gap: 5px;
    }

    .detail-row {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .detail-icon {
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .engine-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
      flex: 1;
    }

    .detail-label {
      font-size: 8.5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--secondary-text-color);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .detail-value {
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-text-color);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .scenes-title {
      font-size: 8.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--secondary-text-color);
      letter-spacing: 0.5px;
    }

    .scenes-list {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }

    .scene-item {
      display: flex;
      gap: 4px;
      font-size: 10.5px;
      line-height: 1.2;
      min-width: 0;
    }

    .scene-channel {
      color: var(--secondary-text-color);
      font-weight: 500;
      flex-shrink: 0;
    }

    .scene-name {
      color: var(--success-color, #4caf50);
      font-weight: 600;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .no-scenes {
      font-size: 10.5px;
      color: var(--secondary-text-color);
      font-style: italic;
    }

    /* ── Add Area tile ── */
    .add-area-card {
      background: transparent;
      border: 2px dashed rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      min-height: 180px;
      cursor: pointer;
      transition: border-color 0.2s ease, background 0.2s ease;
      color: var(--secondary-text-color);
    }
    .add-area-card:hover,
    .add-area-card:focus-visible {
      border-color: var(--tp-accent, var(--accent-color));
      color: var(--primary-text-color);
      background: rgba(255, 255, 255, 0.015);
    }
    .add-icon { font-size: 32px; font-weight: 300; }
    .add-label { font-size: 14px; font-weight: 600; letter-spacing: 0.5px; }

    /* ── Unconfigured list ── */
    .add-area-list {
      background: rgba(255, 255, 255, 0.02);
      border: 1px dashed rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      animation: rv-slide-down 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes rv-slide-down {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .add-area-list-header { display: flex; justify-content: space-between; align-items: center; font-weight: 600; color: var(--primary-text-color); }
    .close-add-btn { background: transparent; border: none; color: var(--secondary-text-color); font-size: 20px; cursor: pointer; padding: 4px 8px; }
    .close-add-btn:hover { color: var(--primary-text-color); }
    .unconfigured-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
    .unconfigured-row {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
      padding: 14px 18px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease;
    }
    .unconfigured-row:hover,
    .unconfigured-row:focus-visible { background: rgba(255,255,255,0.08); border-color: var(--tp-accent, var(--accent-color)); }
    .unconfigured-name { font-weight: 600; color: var(--primary-text-color); font-size: 13px; }
    .setup-badge { font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; background: var(--tp-accent, var(--accent-color)); color: #fff; border-radius: 4px; }
    .no-unconfigured { grid-column: 1/-1; text-align: center; font-style: italic; color: var(--secondary-text-color); padding: 20px; }
    `
  ]

  @property({ type: Object }) hass: HomeAssistant | null = null
  @property({ type: Object }) globalConfigOverride: GlobalConfig | null = null
  // True while the view's tab is active. panel-base keeps the view mounted
  // across tab switches (keep-alive) and toggles this instead of unmounting,
  // so the subscription stays up and the live state stays fresh; only the
  // clock pauses and slot times refresh on reactivation.
  @property({ type: Boolean }) active = true

  @state() private _areaConfigs: AreaConfig[] = []
  @state() private _areas: Area[] = []
  @state() private _todayData: DayData | null = null
  @state() private _activeAreaId: string | null = null
  @state() private _view: 'overview' | 'config' = 'overview'
  @state() private _loading = false
  @state() private _showAddAreaList = false
  @state() private _areasState: Record<string, RunState> = {}
  private _unsubAll: (() => void) | null = null
  // Incremented on every subscribe/unsubscribe so an in-flight subscribeMessage
  // can tell whether it is still the current one when it resolves.
  private _subscribeGeneration = 0
  @state() private _globalConfig: GlobalConfig = {}
  @state() private _placeholderDefaults: PlaceholderDefaults | null = null
  @state() private _areaSlotTimesMap: Record<string, AreaSlotTimesResult> = {}
  // Tracks which connection _unsubAll actually belongs to, so a reconnect
  // (new hass.connection) triggers a resubscribe while the routine per-tick
  // replacement of the `hass` object reference (same connection) does not.
  private _subscribedConnection: HomeAssistant['connection'] | null = null
  // Set once _loadData() has run with a real hass object. Guards the
  // "hass arrived late" retry in updated() below — without it, the retry
  // condition relied on `_areaConfigs.length`, which stays 0 forever with
  // zero configured areas and re-fetched/re-rendered on every hass tick.
  private _hasLoadedOnce = false
  // Counts load attempts so a persistent backend error gets exactly one retry
  // (the "hass arrived late" case) instead of re-firing _loadData() (5
  // parallel WS calls) on every subsequent hass tick forever.
  private _loadAttempts = 0

  private _clock = new LiveClockController(this)
  private _slotTimesGuard = new StaleGuard()
  @state() private _loadError: string | null = null

  protected firstUpdated(_ch: PropertyValues): void {
    super.firstUpdated(_ch)
    this._loadData()
    if (this.hass) {
      this._subscribeAll()
    }
  }

  protected willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties)
    if (changedProperties.has('globalConfigOverride') && this.globalConfigOverride) {
      this._globalConfig = this.globalConfigOverride
    }
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties)
    if (changedProperties.has('active')) {
      if (this.active) {
        this._clock.resume()
        // The view may have been hidden across midnight — slot times are
        // date-bound, so recompute them for the current day.
        this._refreshSlotTimes()
      } else {
        this._clock.pause()
      }
    }
    // `hass` can arrive after firstUpdated (panel boot, reconnect). _loadData()
    // bails out without it, so without this retry the overview stayed empty
    // forever — analytics-view/timeline-view use the same "still empty? load
    // again" guard.
    if (
      changedProperties.has('hass') && this.hass && !this._hasLoadedOnce && !this._loading &&
      this._loadAttempts < 2
    ) {
      this._loadData()
    }
    if (changedProperties.has('hass') && this.hass && this.hass.connection !== this._subscribedConnection) {
      this._subscribeAll()
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this._unsubscribeAll()
    this._areasState = {}
  }

  private async _loadData() {
    if (!this.hass) return
    this._loadAttempts++
    this._loading = true
    this._loadError = null
    try {
      if (this.hass) {
        // areasList/areaRegistryList are load-bearing — if either genuinely fails
        // (not just "no areas configured yet"), the error must propagate to the
        // outer catch so _hasLoadedOnce stays false and the retry guard in
        // updated() gets another chance on the next hass tick. The other three
        // endpoints already have meaningful empty fallbacks and must not block
        // the view on a transient failure of a non-essential endpoint.
        const [areaConfigs, areas, todaySun, globalConfig, placeholderDefaults] = await Promise.all([
          api.areasList(this.hass),
          api.areaRegistryList(this.hass),
          api.sunDay(this.hass).catch(() => ({ day_data: [] } as unknown as SunDayResult)),
          api.globalGet(this.hass).catch(() => ({})),
          api.placeholderDefaults(this.hass).catch(() => null)
        ]) as [AreaConfig[], Area[], SunDayResult, Record<string, any>, PlaceholderDefaults | null]

        this._areaConfigs = areaConfigs.map(cfg => ({
          ...cfg,
          activities: ensureDefaultActivities(cfg.activities)
        }))
        this._areas = areas
        this._todayData = todaySun.day_data || null
        this._globalConfig = globalConfig || {}
        this._placeholderDefaults = placeholderDefaults

        // Shares _refreshSlotTimes()'s StaleGuard — without it, a slow boot
        // load finishing after a faster _refreshSlotTimes() (e.g. an
        // areas-changed event firing while this request is still in flight)
        // would overwrite that newer result with this stale one.
        const slotTimesToken = this._slotTimesGuard.begin()
        const todayStr = haLocalDateString(this.hass)
        const slotTimesMap: Record<string, AreaSlotTimesResult> = {}
        await Promise.all(this._areaConfigs.map(async (cfg) => {
          try {
            const st = await api.areaSlotTimes(this.hass!, { area_id: cfg.area_id, date: todayStr })
            slotTimesMap[cfg.area_id] = st
          } catch (err) {
            // Non-fatal: this area's sparkline stays empty, the rest of the
            // view still loads — but a persistently failing endpoint (as
            // opposed to a genuinely still-unconfigured area) should be
            // visible somewhere instead of vanishing silently.
            console.warn(`Failed to load slot times for area ${cfg.area_id}:`, err)
          }
        }))
        if (slotTimesToken.isCurrent()) this._areaSlotTimesMap = slotTimesMap
        this._hasLoadedOnce = true
      }
    } catch (err) {
      console.error('Failed to load areas view data:', err)
      this._loadError = (err as Error).message || String(err)
    } finally {
      this._loading = false
    }
  }

  private _selectArea(areaId: string) {
    this._activeAreaId = areaId
    this._showAddAreaList = false
    this._view = 'config'
  }

  /** Enter/Space activation for a click-only div acting as role="button". */
  private _onActivateKeydown(action: () => void) {
    return (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        action()
      }
    }
  }

  private _subscribeAll() {
    this._unsubscribeAll()
    if (!this.hass) return
    this._subscribedConnection = this.hass.connection
    // Tag this attempt. subscribeMessage resolves asynchronously, so a
    // disconnect (or a resubscribe on a new connection) can happen before we
    // ever hold the unsub function. Without this check the unsub would be
    // stored on an already-torn-down view and never called — the backend kept
    // pushing every area's full state until the connection closed.
    const generation = ++this._subscribeGeneration
    this.hass.connection.subscribeMessage<{ areas: Record<string, RunState>; full?: boolean }>(
      (msg) => {
        if (generation !== this._subscribeGeneration) return
        // Full pushes (initial snapshot, engine set changed) replace the state so
        // removed areas disappear; delta pushes (single area changed) merge in.
        this._areasState = msg.full
          ? msg.areas || {}
          : { ...this._areasState, ...(msg.areas || {}) }
      },
      { type: 'twilight/subscribe_all' }
    ).then(
      (unsub) => {
        if (generation !== this._subscribeGeneration) {
          // Superseded while in flight — drop this subscription immediately
          // instead of leaking it.
          unsub()
          return
        }
        this._unsubAll = unsub
      },
      (err) => {
        console.warn('Error subscribing to all areas', err)
        if (generation === this._subscribeGeneration) {
          this._subscribedConnection = null
        }
      }
    )
  }

  private async _refreshSlotTimes() {
    if (!this.hass) return
    // Overlapping calls (e.g. a live-clock tick firing before the previous
    // refresh's requests all resolved) must not let an older response land
    // last and overwrite a newer one with stale slot times.
    const token = this._slotTimesGuard.begin()
    const todayStr = haLocalDateString(this.hass)
    const slotTimesMap: Record<string, AreaSlotTimesResult> = {}
    await Promise.all(this._areaConfigs.map(async (cfg) => {
      try {
        const st = await api.areaSlotTimes(this.hass!, { area_id: cfg.area_id, date: todayStr })
        slotTimesMap[cfg.area_id] = st
      } catch (err) {
        console.warn(`Failed to refresh slot times for area ${cfg.area_id}:`, err)
      }
    }))
    if (!token.isCurrent()) return
    this._areaSlotTimesMap = slotTimesMap
  }

  private _unsubscribeAll() {
    // Bumping the generation invalidates any in-flight subscribe attempt, which
    // then unsubscribes itself as soon as it resolves.
    this._subscribeGeneration++
    this._subscribedConnection = null
    if (this._unsubAll) {
      this._unsubAll()
      this._unsubAll = null
    }
  }

  private _backToOverview() {
    this._view = 'overview'
    this._activeAreaId = null
  }

  private _overviewEngineInfo(runState: RunState | undefined, cfg: AreaConfig): { label: string; color: string; sub: string } {
    if (!cfg.enabled) {
      return { label: this.t('areas_view.engine_disabled'), color: '#888', sub: this.t('areas_view.engine_disabled_sub') }
    }
    if (runState?.engine_setup_failed) {
      return {
        label: this.t('status_card.engine_setup_failed'),
        color: 'var(--error-color, #f44336)',
        sub: this.t('status_card.engine_setup_failed_sub'),
      }
    }
    if (!runState) {
      return { label: this.t('areas_view.engine_standby'), color: 'var(--secondary-text-color)', sub: this.t('areas_view.engine_idle') }
    }

    const activeAct = runState.active_activity
    if (activeAct) {
      const label = activeAct.charAt(0).toUpperCase() + activeAct.slice(1)
      return {
        label,
        color: '#9c27b0',
        sub: this.t('areas_view.engine_activity_sub', { activity: activeAct })
      }
    }

    const sceneOn = runState.scene_activated_at !== null
    return {
      label: sceneOn ? this.t('areas_view.engine_scene_active') : this.t('areas_view.engine_idle'),
      color: sceneOn ? '#4caf50' : '#2196f3',
      sub: sceneOn ? this.t('areas_view.engine_scene_sub') : this.t('areas_view.engine_input_sub')
    }
  }

  private _emitAreasChanged() {
    this.dispatchEvent(new CustomEvent('areas-changed', { detail: this._areaConfigs, bubbles: true, composed: true }))
  }

  render() {
    if (this._loading) return html`<div style="padding:24px;color:var(--secondary-text-color)">${this.t('common.loading')}</div>`
    if (this._loadError && !this._hasLoadedOnce) {
      return html`
        <div style="padding:24px;color:var(--error-color,#db4437)">
          <div>${this.t('areas_view.load_error', { error: this._loadError })}</div>
          <button style="margin-top:12px" @click=${() => this._loadData()}>${this.t('areas_view.retry')}</button>
        </div>
      `
    }
    if (this._view === 'config' && this._activeAreaId) {
      return html`
        <twilight-area-detail-view
          .hass=${this.hass}
          .areaId=${this._activeAreaId}
          .areaConfigs=${this._areaConfigs}
          .areas=${this._areas}
          .todayData=${this._todayData}
          .globalConfig=${this._globalConfig}
          .placeholderDefaults=${this._placeholderDefaults}
          .areasState=${this._areasState}
          @back=${this._backToOverview}
          @select-area=${(e: CustomEvent<{ areaId: string }>) => this._selectArea(e.detail.areaId)}
          @areas-changed=${(e: CustomEvent<AreaConfig[]>) => { this._areaConfigs = e.detail; this._emitAreasChanged(); this._refreshSlotTimes() }}
          @engines-changed=${() => { this._subscribeAll(); this._refreshSlotTimes() }}
        ></twilight-area-detail-view>
      `
    }
    return this._renderOverview()
  }

  private _buildAreaCardData(cfg: AreaConfig) {
    const area = this._areas.find(a => a.area_id === cfg.area_id)
    const runState = this._areasState?.[cfg.area_id]
    const todayData = this._todayData
    this._clock.setHass(this.hass)
    const liveMins = this._clock.liveMins

    const todayStr = haLocalDateString(this.hass)
    const slotTimes = this._areaSlotTimesMap[cfg.area_id]
    const channelIds = getChannelIds(cfg)
    const rows = []
    for (const chId of channelIds) {
      const ch = getChannels(cfg)[chId]
      const datesObj = slotTimes?.channels?.[chId]
      const calcList = datesObj?.[todayStr] || (datesObj ? Object.values(datesObj)[0] : []) || []
      const chSlots = convertCalculatedTimesToSlots(calcList, getChannelSlots(cfg, chId))
      const gradient = generateGradient(chSlots)
      const isChannelEnabled = cfg.enabled && (ch?.enabled !== false)
      rows.push({
        id: chId,
        name: ch?.name || (chId === PRIMARY_CHANNEL_ID ? this.t('common.primary_channel') : chId),
        slots: chSlots,
        gradient,
        enabled: isChannelEnabled
      })
    }

    const primaryCalcList = slotTimes?.channels?.[PRIMARY_CHANNEL_ID]?.[todayStr] || []
    const primarySlots = convertCalculatedTimesToSlots(primaryCalcList, getChannelSlots(cfg, PRIMARY_CHANNEL_ID))
    const activeSlot = resolveOverviewActiveSlot(primarySlots, runState, liveMins)

    const slotLabel = cfg.enabled ? (activeSlot?.label ?? this.t('common.none')) : this.t('areas_view.engine_disabled')
    const slotColor = cfg.enabled ? (activeSlot?.color ?? 'rgba(255,255,255,0.15)') : '#888'
    const isDay = activeSlot?.id === 'day'
    const badgeTextColor = cfg.enabled
      ? (isDay ? '#141926' : `color-mix(in srgb, ${slotColor} 25%, #ffffff)`)
      : 'var(--secondary-text-color)'
    const badgeBgColor = cfg.enabled ? slotColor : 'rgba(255,255,255,0.05)'
    const badgeBorderColor = cfg.enabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.08)'
    const badgeStyle = `--badge-border:${badgeBorderColor};--badge-bg:${badgeBgColor};--badge-text:${badgeTextColor}`

    const engineInfo = this._overviewEngineInfo(runState, cfg)
    const lightsOn = runState?.lights_on ?? 0
    const lightsTotal = runState?.lights_total ?? 0

    const liveLeft = (liveMins / 1440 * 100).toFixed(2)

    const activeSceneNames = runState?.active_scene_names
    const activeSceneItems = []
    if (runState && runState.scene_activated_at !== null && activeSceneNames) {
      for (const chId of channelIds) {
        const sceneName = activeSceneNames[chId]
        if (sceneName) {
          const ch = getChannels(cfg)[chId]
          const chLabel = ch?.name || (chId === PRIMARY_CHANNEL_ID ? this.t('common.primary_channel') : chId)
          activeSceneItems.push({
            channelName: chLabel,
            sceneName: sceneName
          })
        }
      }
    }

    let barHeight = 9
    let labelFontSize = 9

    if (rows.length === 1) {
      barHeight = 12
      labelFontSize = 10
    } else if (rows.length === 2) {
      barHeight = 11
      labelFontSize = 10
    } else if (rows.length === 3) {
      barHeight = 10
      labelFontSize = 9
    }

    const barRadius = barHeight / 2
    const rowHeight = barHeight + (barHeight >= 16 ? 8 : (barHeight >= 12 ? 6 : 5))
    const rowGap = rows.length === 1 ? 0 : barHeight / 2

    const sparklineStyle = `--row-height:${rowHeight}px;--bar-height:${barHeight}px;--bar-radius:${barRadius}px;--label-font-size:${labelFontSize}px;--row-gap:${rowGap}px;`

    return {
      areaName: cfg.name || area?.name || cfg.area_id,
      slotLabel,
      slotColor,
      badgeStyle,
      sparklineStyle,
      rows,
      liveLeft,
      engineInfo,
      lightsOn,
      lightsTotal,
      activeSceneItems,
      todayData
    }
  }

  private _renderOverview() {
    const configuredCount = this._areaConfigs.length
    const totalCount = this._areas.length
    const unconfiguredAreas = this._areas.filter(a => !this._areaConfigs.some(r => r.area_id === a.area_id))

    return html`
      <div class="view-header-container">
        <div class="overview-header">
          <div class="header-left">
            <h2>${this.t('areas_view.twilight_areas')}</h2>
          </div>
          <div class="header-right">
            ${this.t('areas_view.configured_count', { configured: configuredCount })} · <span style="color:var(--tp-accent,var(--accent-color)); margin-left: 4px;">${this.t('areas_view.pending_count', { pending: totalCount - configuredCount })}</span>
          </div>
        </div>
      </div>

      <div class="rv-content">
        <div class="area-grid">
          ${this._areaConfigs.map(cfg => {
            const card = this._buildAreaCardData(cfg)

            return html`
              <div class="area-card ${cfg.enabled ? 'enabled' : ''}"
                   style="--shadow-color:${card.slotColor}"
                   role="button"
                   tabindex="0"
                   aria-label=${card.areaName}
                   @click=${() => this._selectArea(cfg.area_id)}
                   @keydown=${this._onActivateKeydown(() => this._selectArea(cfg.area_id))}>
                <div class="card-header">
                  <div class="title-group">
                    <div class="area-name">${card.areaName}</div>
                    <div class="area-id-sub">${cfg.area_id}</div>
                  </div>
                  <div class="slot-badge" style=${card.badgeStyle}>
                    ${card.slotLabel}
                  </div>
                </div>

                <div class="sparkline-container" style=${card.sparklineStyle}>
                  ${card.rows.length > 0 ? html`
                    <div class="sparkline-wrapper">
                      ${card.rows.map(row => html`
                        <div class="sparkline-row ${!row.enabled ? 'disabled' : ''}">
                          <span class="sparkline-label" title="${row.name}">${row.name}</span>
                          <div class="sparkline-bar-wrapper">
                            <div class="sparkline-bar" style="--bar-gradient:${row.gradient}"></div>
                          </div>
                        </div>
                      `)}
                      ${cfg.enabled && card.todayData ? html`
                        <div class="sparkline-indicator-line" style="left: calc(86px + (100% - 86px) * ${card.liveLeft} / 100)"></div>
                      ` : ''}
                    </div>
                  ` : html`
                    <div class="no-scenes" style="text-align: center;">
                      ${this.t('timetable_card.no_slots_configured')}
                    </div>
                  `}
                </div>

                <div class="card-details">
                  <div class="details-column">
                    <div class="detail-row">
                      <span class="detail-icon" style="background: color-mix(in srgb, ${card.engineInfo.color} 10%, transparent)">
                        <div class="engine-dot" style="background: ${card.engineInfo.color}; box-shadow: 0 0 6px ${card.engineInfo.color}"></div>
                      </span>
                      <div class="detail-content">
                        <span class="detail-label">
                          ${this.t('areas_view.engine_label')}
                        </span>
                        <span class="detail-value" style="color: ${card.engineInfo.color}">
                          ${card.engineInfo.label}
                        </span>
                      </div>
                    </div>

                    ${(() => {
                      const hasLightsOn = card.lightsOn > 0
                      const lightIconColor = hasLightsOn ? '#fdd835' : 'var(--secondary-text-color)'
                      const lightBg = hasLightsOn ? 'rgba(253, 216, 53, 0.1)' : 'rgba(255, 255, 255, 0.04)'
                      return html`
                        <div class="detail-row">
                          <span class="detail-icon" style="color: ${lightIconColor}; background: ${lightBg}; font-size: 10px;">
                            💡
                          </span>
                          <div class="detail-content">
                            <span class="detail-label">
                              ${this.t('areas_view.lights_label')}
                            </span>
                            <span class="detail-value" style="color: ${hasLightsOn ? '#fdd835' : 'var(--primary-text-color)'}">
                              ${card.lightsTotal > 0 ? this.t('areas_view.lights_on_count', { on: card.lightsOn, total: card.lightsTotal }) : this.t('areas_view.no_lights')}
                            </span>
                          </div>
                        </div>
                      `
                    })()}
                  </div>

                  <div class="details-column scenes-col">
                    <div class="scenes-title" style="margin-bottom: 2px;">
                      ${this.t('areas_view.active_scenes_label')}
                    </div>
                    ${card.activeSceneItems.length > 0 ? html`
                      <div class="scenes-list">
                        ${card.activeSceneItems.map(item => html`
                          <div class="scene-item" style="flex-direction: column;">
                            <span class="scene-channel">
                              ${item.channelName}
                            </span>
                            <span class="scene-name" style="color: var(--tp-accent, var(--accent-color));" title="${item.sceneName}">
                              ${item.sceneName}
                            </span>
                          </div>
                        `)}
                      </div>
                    ` : html`
                      <div class="no-scenes" style="display: flex; align-items: center; height: 100%;">
                        ${this.t('common.none')}
                      </div>
                    `}
                  </div>
                </div>
              </div>
            `
          })}

          <div class="add-area-card"
               role="button"
               tabindex="0"
               aria-label=${this.t('areas_view.add_area')}
               @click=${() => { this._showAddAreaList = !this._showAddAreaList }}
               @keydown=${this._onActivateKeydown(() => { this._showAddAreaList = !this._showAddAreaList })}>
            <span class="add-icon">+</span>
            <span class="add-label">${this.t('areas_view.add_area')}</span>
          </div>
        </div>

        ${this._showAddAreaList ? html`
          <div class="add-area-list" style="margin-top:20px">
            <div class="add-area-list-header">
              <span>${this.t('areas_view.select_area_prompt')}</span>
              <button class="close-add-btn" @click=${(e: Event) => { e.stopPropagation(); this._showAddAreaList = false }}>×</button>
            </div>
            <div class="unconfigured-grid">
              ${unconfiguredAreas.map(a => html`
                <div class="unconfigured-row"
                     role="button"
                     tabindex="0"
                     aria-label=${a.name}
                     @click=${() => this._selectArea(a.area_id)}
                     @keydown=${this._onActivateKeydown(() => this._selectArea(a.area_id))}>
                  <span class="unconfigured-name">${a.name}</span>
                  <span class="setup-badge">${this.t('areas_view.setup_badge')}</span>
                </div>
              `)}
              ${unconfiguredAreas.length === 0 ? html`<div class="no-unconfigured">${this.t('areas_view.all_areas_configured')}</div>` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `
  }
}
