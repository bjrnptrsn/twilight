import { LitElement, html, css, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { type DayData } from '../lib/sun-zones'
import { type Slot, type LabEntity, type SensorConfig, type RunState, type InputConfig, type ActivityConfig, type RuleConfig, type HomeAssistant, type Area, type AreaConfig, type GlobalConfig, type PlaceholderDefaults, type AreaSlotTimesResult, PRIMARY_CHANNEL_ID, type SlotConfig, type ChannelConfig } from '../lib/types'
import * as api from '../lib/api'
import { DraftController } from '../lib/draft-controller'
import { StaleGuard, type StaleToken } from '../lib/stale-guard'
import '../components/status-card'
import '../components/timetable-card'
import '../components/area-lights-card'
import '../components/sensors-card'
import '../components/inputs-card'
import '../components/activities-card'
import '../components/rules-card'
import '../components/reset-dialog'
import { type ResetTreeNode } from '../components/reset-dialog'
import '../components/sun-path-card'
import '../components/slot-editor'
import '../components/slot-tooltip'
import { convertCalculatedTimesToSlots, haLocalDateString, isSlotActiveAt } from '../lib/utils'
import { getInputDisplayName } from '../lib/input-helpers'
import { hostResetStyles, viewHeaderStyles, detailFooterStyles } from '../lib/shared-styles'
import { getChannels, getChannelIds, getChannelSlots, slugifyChannelId } from '../lib/channel-helpers'
import { LiveClockController } from '../lib/live-clock-controller'
import { DialogController } from '../lib/dialog-controller'
import { ensureDefaultActivities } from '../lib/activity-helpers'
import { TwilightLocalizeMixin } from '../lib/i18n'
import '../components/dialogs'
import '../components/inputs-dialog'
import '../components/activities-dialog'
import '../components/sensors-dialog'
import '../components/area-lights-dialog'
import '../components/rules-dialog'

@customElement('twilight-area-detail-view')
export class AreaDetailView extends TwilightLocalizeMixin(LitElement) {
  static styles = [
    hostResetStyles,
    viewHeaderStyles,
    detailFooterStyles,
    css`
      .view-header-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 16px;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
      }

      .span-6 { grid-column: span 6; min-width: 0; }
      .span-12 { grid-column: span 12; min-width: 0; }
      @media (max-width: 768px) {
        .view-content-grid .span-6 { grid-column: span 12; }
      }

      .detail-header {
        display: flex !important;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        width: 100%;
      }

      .detail-header .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .detail-header .header-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
      }

      .back-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: none;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        width: 36px;
        height: 36px;
        padding: 0;
        margin: 0;
        line-height: 1;
        transition: background 0.15s, color 0.15s;
        flex-shrink: 0;
      }

      .back-btn:hover {
        background: rgba(255,255,255,0.08);
        color: var(--primary-text-color);
      }

      .header-left h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .area-select {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent));
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 12px;
        cursor: pointer;
      }

      .enabled-label {
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .view-content-container {
        padding: 24px;
        width: 100%;
        box-sizing: border-box;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
      }

      .view-content-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 16px;
        align-items: stretch;
        align-content: start;
        box-sizing: border-box;
      }


      .save-status {
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .save-status.error {
        color: var(--error-color, #db4437);
      }

      .btn-cancel {
        background: transparent;
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 8px;
        color: var(--secondary-text-color);
        cursor: pointer;
        padding: 8px 20px;
        font-size: 14px;
        transition: background 0.15s, color 0.15s;
      }

      .btn-cancel:hover {
        background: rgba(255,255,255,0.05);
        color: var(--primary-text-color);
      }

      .btn-save {
        background: var(--tp-accent, var(--accent-color, #e91e8c));
        color: white;
        border: none;
        padding: 8px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.15s;
      }

      .btn-save:hover {
        opacity: 0.85;
      }

      .btn-save:disabled {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.3);
        cursor: not-allowed;
      }

    `
  ]

  @property({ type: Object }) hass: HomeAssistant | null = null
  @property({ type: String }) areaId: string = ''
  @property({ type: Array }) areaConfigs: AreaConfig[] = []
  @property({ type: Array }) areas: Area[] = []
  @property({ type: Object }) todayData: DayData | null = null
  @property({ type: Object }) globalConfig: GlobalConfig = {}
  @property({ type: Object }) placeholderDefaults: PlaceholderDefaults | null = null
  @property({ type: Object }) areasState: Record<string, RunState> = {}

  // Area-specific placeholder defaults (min_slot_distance_minutes depends on the
  // area's location). Loaded with area_id; falls back to the parent-provided
  // global placeholderDefaults if not yet loaded.
  @state() private _areaPlaceholderDefaults: PlaceholderDefaults | null = null

  private get _effectivePlaceholderDefaults(): PlaceholderDefaults | null {
    return this._areaPlaceholderDefaults ?? this.placeholderDefaults
  }

  @state() private _selectedChannelId: string = PRIMARY_CHANNEL_ID
  @state() private _areaEntities: LabEntity[] = []
  @state() private _extractedEntities: Record<string, api.ExtractedSlotInfo> = {}
  @state() private _slotEditOpen = false
  @state() private _inputsEditOpen = false
  @state() private _activitiesEditOpen = false
  @state() private _sensorsEditOpen = false
  @state() private _areaLightsEditOpen = false
  @state() private _rulesEditOpen = false
  @state() private _editingSlotId: string | null = null
  @state() private _resetDialogOpen = false
  @state() private _areaTemplateSnapshot: AreaConfig | null = null
  @state() private _resetNodes: ResetTreeNode[] = []
  @state() private _slotTimes: AreaSlotTimesResult | null = null

  private _dialog = new DialogController(this)
  private _clock = new LiveClockController(this)
  private _lastLoadedKey = ''
  // Serializes async loads so a slower response for a previously selected area
  // cannot overwrite the currently selected one's draft.
  private _loadGuard = new StaleGuard()

  private _draftController = new DraftController<AreaConfig>(this, {
    onSave: async (value) => {
      if (!this.hass) return
      // The backend normalizes the config on save (e.g. generates stable
      // input/sensor ids) — use its response as the new source of truth
      // instead of the stale client-side draft, or auto-generated ids stay
      // blank in the UI until the next full reload.
      const { disabled_rule_ids, ...saved } = await api.areaSave(this.hass, value)

      if (disabled_rule_ids && disabled_rule_ids.length > 0) {
        const disabledNames = (saved.rules || [])
          .filter(r => disabled_rule_ids.includes(r.id))
          .map(r => r.name || r.id)
          .join(', ')
        const msg = disabledNames
          ? this.t('area_detail.rules_disabled_list', { names: disabledNames })
          : this.t('area_detail.rules_disabled_generic')
        await this._dialog.showAlert(this.t('area_detail.rules_disabled_title'), msg)
      }

      const idx = this.areaConfigs.findIndex(r => r.area_id === saved.area_id)
      let updated: AreaConfig[]
      if (idx >= 0) {
        updated = this.areaConfigs.map((r, i) => i === idx ? saved : r)
      } else {
        updated = [...this.areaConfigs, saved]
      }

      this.dispatchEvent(new CustomEvent('areas-changed', { detail: updated, bubbles: true, composed: true }))
      // Saving recreates the engine in the backend — the parent re-subscribes
      // subscribe_all on this event.
      this.dispatchEvent(new CustomEvent('engines-changed', { bubbles: true, composed: true }))

      // Refetch slot times via area/slot_times now that the area config is updated.
      await this._fetchSlotTimes()

      if (this.hass) {
        const extractedResult = await (api.areaExtracted(this.hass, saved.area_id).catch(() => ({})) as Promise<Record<string, api.ExtractedSlotInfo>>)
        if (saved.area_id === this.areaId) {
          this._extractedEntities = extractedResult || {}
          if (this._draftController.draft) {
            this._updateAreaEntities(this._draftController.draft, this._areaEntities)
          }
        }
      }

      return saved
    }
  })

  private async _saveOrUpdateDraft() {
    if (this._draftController.saving) return
    await this._draftController.save()
  }

  connectedCallback() {
    super.connectedCallback()
    if (this.hass && this.areaId) {
      this._loadAreaDetails()
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._loadGuard.cancel()
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties)
    if ((changedProperties.has('areaId') || changedProperties.has('hass')) && this.areaId && this.hass) {
      const prevAreaId = changedProperties.get('areaId')
      const prevHass = changedProperties.get('hass')
      if (this.areaId !== prevAreaId || this.hass !== prevHass) {
        this._loadAreaDetails()
      }
    }
  }

  private async _loadAreaDetails() {
    const key = `${this.areaId}_${this.hass?.states ? 'has_hass' : 'no_hass'}`
    if (key === this._lastLoadedKey) return
    this._lastLoadedKey = key

    if (!this.hass || !this.areaId) return

    // Switching areas faster than a response arrives must not let the older
    // area's data land in the newer area's draft — begin() immediately after
    // the key guard above (before any state mutation) so every code path
    // below, including this method's own synchronous setup, is covered by
    // token.isCurrent() checks against a load that supersedes this one.
    const token = this._loadGuard.begin()

    this._draftController.loading = true
    this.requestUpdate()

    this._selectedChannelId = PRIMARY_CHANNEL_ID

    const cfg = this.areaConfigs.find(r => r.area_id === this.areaId)
    const area = this.areas.find(a => a.area_id === this.areaId)

    let newAreaSaveFailed = false

    try {
      let draftVal: AreaConfig
      if (cfg) {
        draftVal = structuredClone(cfg)
      } else {
        const rawDraft = await api.areaNewDraft(this.hass, this.areaId)
        if (!token.isCurrent()) return
        if (area) {
          rawDraft.name = area.name
        }
        rawDraft.activities = ensureDefaultActivities(rawDraft.activities)

        try {
          const { disabled_rule_ids: _, ...saved } = await api.areaSave(this.hass, rawDraft)
          if (!token.isCurrent()) return

          const idx = this.areaConfigs.findIndex(r => r.area_id === saved.area_id)
          const updated = idx >= 0
            ? this.areaConfigs.map((r, i) => i === idx ? saved : r)
            : [...this.areaConfigs, saved]

          this.dispatchEvent(new CustomEvent('areas-changed', { detail: updated, bubbles: true, composed: true }))
          this.dispatchEvent(new CustomEvent('engines-changed', { bubbles: true, composed: true }))
          draftVal = saved
        } catch (err) {
          console.error('Error auto-saving new area draft', err)
          if (!token.isCurrent()) return
          // Keep the entered config as an unsaved draft instead of discarding it —
          // a transient WS error would otherwise force the user to re-enter every
          // setting. The footer Save button (same api.areaSave call via
          // DraftController.onSave) lets them retry without navigating away.
          newAreaSaveFailed = true
          draftVal = rawDraft
          await this._dialog.showAlert(
            this.t('area_detail.creation_failed'),
            this.t('area_detail.creation_failed_desc', { error: (err as Error).message || String(err) })
          )
          if (!token.isCurrent()) return
        }
      }

      if (cfg) {
        draftVal.activities = ensureDefaultActivities(draftVal.activities)
      }

      this._draftController.init(draftVal)
      if (newAreaSaveFailed) {
        // init() always marks the draft clean — force it dirty so the footer
        // Save button (and its unsaved-changes affordance) appears.
        this._draftController.update(() => {})
      }
      // Clear the previous area's entities/slot times before the awaits below —
      // if labAreaEntities fails, stale data from the old area must not stay
      // visible (or writable, e.g. via the lights-card toggle path) under the
      // new area's draft.
      this._areaEntities = []
      this._extractedEntities = {}
      this._slotTimes = null

      const [rawEntities, extractedResult] = await Promise.all([
        api.labAreaEntities(this.hass, this.areaId),
        api.areaExtracted(this.hass, this.areaId).catch(err => {
          console.warn('Backend extraction not available yet, using empty fallback', err)
          return {} as Record<string, api.ExtractedSlotInfo>
        })
      ]) as [LabEntity[], Record<string, api.ExtractedSlotInfo>]
      if (!token.isCurrent()) return
      this._extractedEntities = extractedResult || {}
      this._updateAreaEntities(this._draftController.draft!, rawEntities)
      await this._fetchSlotTimes(token)
    } catch (err) {
      console.error('Error fetching area entities', err)
      // _lastLoadedKey is deliberately NOT reset here — a persistent backend
      // error must not re-fire the request on every hass tick (hass is a new
      // object reference on nearly every tick, so updated() would otherwise
      // call this again immediately). Switching areas (a new key) or the
      // footer Save button remain the retry paths.
    } finally {
      // A superseded load must not clear the loading flag of the newer one.
      if (token.isCurrent()) {
        this._draftController.loading = false
        this.requestUpdate()
      }
    }
  }

  private async _fetchSlotTimes(token?: StaleToken) {
    if (!this.hass || !this.areaId) return
    const targetAreaId = this.areaId
    // Called both from _loadAreaDetails (with the caller's token) and directly
    // on config edits (without one, where there is nothing to supersede).
    const isCurrent = () => this.areaId === targetAreaId && (!token || token.isCurrent())
    try {
      const result = await api.areaSlotTimes(this.hass, { area_id: this.areaId })
      if (!isCurrent()) return
      this._slotTimes = result
    } catch (err) {
      console.warn('Failed to fetch area slot times:', err)
    }
    try {
      const defaults = await api.placeholderDefaults(this.hass, this.areaId)
      if (!isCurrent()) return
      this._areaPlaceholderDefaults = defaults
    } catch (err) {
      console.warn('Failed to fetch area placeholder defaults:', err)
    }
  }

  /** The currently selected channel id, falling back to Primary if it vanished. */
  private _activeChannelId(cfg: AreaConfig): string {
    const ids = getChannelIds(cfg)
    return ids.includes(this._selectedChannelId) ? this._selectedChannelId : PRIMARY_CHANNEL_ID
  }

  private _updateAreaEntities(draft: AreaConfig, rawEntities: LabEntity[]) {
    const extractedIds = new Set<string>()
    if (this._extractedEntities) {
      Object.values(this._extractedEntities).forEach(info => {
        const ids = info.extracted ?? []
        ids.forEach(id => extractedIds.add(id))
      })
    }

    const configuredLightIds = new Set<string>()
    const channelId = this._activeChannelId(draft)
    getChannelSlots(draft, channelId).forEach(s => {
      s.configured_entities?.forEach(id => configuredLightIds.add(id))
    })

    const hasConfigured = configuredLightIds.size > 0

    this._areaEntities = rawEntities
      .map(e => {
        const isExtracted = extractedIds.has(e.entity_id)
        const isManual = hasConfigured && configuredLightIds.has(e.entity_id)
        return {
          entity_id: e.entity_id,
          name: e.name,
          domain: e.domain,
          in_area: e.in_area,
          scene_type: e.scene_type,
          supports_dynamic: e.supports_dynamic,
          scene_speed: e.scene_speed,
          checked: isManual || isExtracted,
          isExtracted,
          isManual
        }
      })
      .sort((a, b) => (a.name || a.entity_id).localeCompare(b.name || b.entity_id))
  }

  private _refreshExtractedEntities() {
    if (!this._draftController.draft) return
    this._updateAreaEntities(this._draftController.draft, this._areaEntities)
  }

  /** Exposed so an ancestor (panel-base.ts) can warn before navigating away
   *  entirely (a tab switch unmounts this view without going through the
   *  back button's own _confirmDiscardIfDirty() guard). */
  get hasUnsavedChanges(): boolean {
    return this._draftController.isDirty
  }

  /** True if leaving is fine — either nothing to lose or the user confirmed the discard. */
  private async _confirmDiscardIfDirty(): Promise<boolean> {
    if (!this.hasUnsavedChanges) return true
    return this._dialog.showConfirm(
      this.t('area_detail.discard_changes'),
      this.t('area_detail.discard_changes_desc')
    )
  }

  private async _backToOverview() {
    if (!(await this._confirmDiscardIfDirty())) return
    this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }))
  }

  private _saveStatusText(): string {
    if (this._draftController.saving) return this.t('settings_view.saving')
    const err = this._draftController.saveError
    if (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : String(err)
      return this.t('settings_view.save_failed', { error: message })
    }
    if (this._draftController.isDirty) return this.t('settings_view.unsaved_changes')
    return this.t('settings_view.all_saved')
  }

  private async _onSensorsChanged(e: CustomEvent<SensorConfig[]>) {
    this._draftController.update({
      sensors: e.detail,
    })
    await this._saveOrUpdateDraft()
  }

  private _availableActivities(draft: AreaConfig): string[] {
    const list = (draft.activities ?? []).map(a => a.id)
    return list.length > 0 ? list : ['sleep']
  }

  private async _onInputsChanged(e: CustomEvent<{ inputs: InputConfig[] }>) {
    this._draftController.update({
      inputs: e.detail.inputs
    })
    await this._saveOrUpdateDraft()
  }

  private async _onActivitiesChanged(e: CustomEvent<{ activities: ActivityConfig[] }>) {
    this._draftController.update({
      activities: e.detail.activities
    })
    await this._saveOrUpdateDraft()
  }

  private async _onRulesChanged(e: CustomEvent<RuleConfig[]>) {
    this._draftController.update({
      rules: e.detail,
    })
    await this._saveOrUpdateDraft()
  }

  private _onSlotSelected(e: CustomEvent<{ slotId: string; channelId?: string }>) {
    // A click on a foreign channel stripe must switch the Timetable tab to that
    // channel before the slot editor opens with the right channel context.
    if (e.detail.channelId) this._selectedChannelId = e.detail.channelId
    this._editingSlotId = e.detail.slotId
    this._slotEditOpen = true
  }

  private _onChannelSelected(e: CustomEvent<{ channelId: string }>) {
    this._selectedChannelId = e.detail.channelId
    this._refreshExtractedEntities()
  }

  private async _onChannelAdded(e: CustomEvent<{ name: string }>) {
    const draft = this._draftController.draft
    if (!draft) return
    const name = e.detail.name.trim()
    if (!name) return
    const id = slugifyChannelId(name)
    if (!id) return

    const channels = { ...getChannels(draft) }
    if (channels[id]) {
      await this._dialog.showAlert(this.t('area_detail.channel_exists'), this.t('area_detail.channel_exists_desc', { name }))
      return
    }
    channels[id] = { name, enabled: true, slots: [] }
    
    this._draftController.update({ channels })
    this._selectedChannelId = id
    await this._saveOrUpdateDraft()
  }

  private async _onChannelRenamed(e: CustomEvent<{ channelId: string; name: string }>) {
    const draft = this._draftController.draft
    if (!draft) return
    const { channelId, name } = e.detail
    const channels = { ...getChannels(draft) }
    const ch = channels[channelId]
    if (!ch) return
    channels[channelId] = { ...ch, name }
    
    this._draftController.update({ channels })
    await this._saveOrUpdateDraft()
  }

  private async _onChannelDeleted(e: CustomEvent<{ channelId: string }>) {
    const draft = this._draftController.draft
    if (!draft || e.detail.channelId === PRIMARY_CHANNEL_ID) return
    const channels = { ...getChannels(draft) }
    delete channels[e.detail.channelId]
    
    this._draftController.update({ channels })
    if (this._selectedChannelId === e.detail.channelId) {
      this._selectedChannelId = PRIMARY_CHANNEL_ID
    }
    await this._saveOrUpdateDraft()
  }

  private async _onChannelToggled(e: CustomEvent<{ channelId: string; enabled: boolean }>) {
    const draft = this._draftController.draft
    if (!draft || e.detail.channelId === PRIMARY_CHANNEL_ID) return
    const channels = { ...getChannels(draft) }
    const ch = channels[e.detail.channelId]
    if (!ch) return
    channels[e.detail.channelId] = { ...ch, enabled: e.detail.enabled }
    
    this._draftController.update({ channels })
    await this._saveOrUpdateDraft()
  }

  /** Channels map with the slots of a single channel replaced, keeping other channels. */
  private _withChannelSlots(draft: AreaConfig, channelId: string, slots: SlotConfig[], transitionOnSeconds?: number | null): Record<string, ChannelConfig> {
    const channels = { ...getChannels(draft) }
    const existing = channels[channelId]
    if (existing) {
      channels[channelId] = {
        ...existing,
        slots,
        ...(transitionOnSeconds !== undefined ? { transition_on_seconds: transitionOnSeconds } : {})
      }
    }
    return channels
  }

  private async _onSlotsChanged(e: CustomEvent<{ slots: Slot[]; transitionOnSeconds?: number | null }>) {
    const draft = this._draftController.draft
    if (!draft) return
    const channelId = this._activeChannelId(draft)
    const existingSlots = getChannelSlots(draft, channelId)
    const newSlots: SlotConfig[] = e.detail.slots.map(s => {
      const existing = existingSlots.find(ds => ds.id === s.id)
      const isFixed = s.startType === 'fixed'
      return {
        id: s.id,
        name: s.label,
        start_type: isFixed ? 'fixed' : 'astral',
        zone: isFixed ? null : (s.startEvent || existing?.zone || 'civil_dawn'),
        fixed_time: isFixed ? (s.fixedStartTime || '00:00') : null,
        offset_minutes: s.startOffset || 0,
        scene_entity_id: s.scene,
        configured_entities: existing?.configured_entities || [],
        hue_activate_dynamic: s.hue_activate_dynamic || false,
        hue_dynamic_speed: s.hue_dynamic_speed ?? null,
      }
    })
    
    this._draftController.update({ channels: this._withChannelSlots(draft, channelId, newSlots, e.detail.transitionOnSeconds) })
    this._refreshExtractedEntities()
    await this._saveOrUpdateDraft()
    await this._fetchSlotTimes()
  }

  private async _onLightsChanged(e: CustomEvent<{ entities: (LabEntity & { isExtracted: boolean; isManual: boolean })[] }>) {
    const draft = this._draftController.draft
    if (!draft) return
    this._areaEntities = e.detail.entities
    const checkedManualIds = e.detail.entities.filter(ent => ent.isManual).map(ent => ent.entity_id)

    const channelId = this._activeChannelId(draft)
    const newSlots = getChannelSlots(draft, channelId).map(s => ({
      ...s,
      configured_entities: checkedManualIds
    }))
    
    this._draftController.update({ channels: this._withChannelSlots(draft, channelId, newSlots) })
    this._refreshExtractedEntities()
    await this._saveOrUpdateDraft()
  }

  private async _onLightsModeChanged(e: CustomEvent<{ manualOnly: boolean }>) {
    this._draftController.update({
      manual_only: e.detail.manualOnly
    })
    await this._saveOrUpdateDraft()
  }

  private async _onSelectAreaChanged(e: Event) {
    const select = e.target as HTMLSelectElement
    const areaId = select.value
    const currentAreaId = this._draftController.draft?.area_id
    if (areaId === currentAreaId) return
    if (!(await this._confirmDiscardIfDirty())) {
      select.value = currentAreaId ?? ''
      return
    }
    this.dispatchEvent(new CustomEvent('select-area', { detail: { areaId }, bubbles: true, composed: true }))
  }

  private async _onAreaEnabledToggled(e: Event) {
    const checked = (e.target as HTMLInputElement).checked
    this._draftController.update({ enabled: checked })
    await this._saveOrUpdateDraft()
  }

  private async _deleteArea() {
    if (!this.areaId || !this.hass) return
    const confirmDelete = await this._dialog.showConfirm(this.t('area_detail.delete_config_title'), this.t('area_detail.delete_config_desc'))
    if (!confirmDelete) return
    
    try {
      await api.areaDelete(this.hass, this.areaId)
      const updated = this.areaConfigs.filter(r => r.area_id !== this.areaId)
      this.dispatchEvent(new CustomEvent('areas-changed', { detail: updated, bubbles: true, composed: true }))
      this.dispatchEvent(new CustomEvent('engines-changed', { bubbles: true, composed: true }))
      this._backToOverview()
    } catch (err) {
      console.error('Error deleting area config', err)
      await this._dialog.showAlert(
        this.t('area_detail.delete_failed'),
        this.t('area_detail.delete_failed_desc', { error: (err as Error).message || String(err) })
      )
    }
  }

  private async _resetAreaToTemplate() {
    const draft = this._draftController.draft
    if (!draft || !this.hass) return
    try {
      const template = await api.areaNewDraft(this.hass, draft.area_id)
      this._areaTemplateSnapshot = template

      const nodes: ResetTreeNode[] = [
        { id: 'inherited', label: this.t('area_detail.reset_node_inherited') },
        {
          id: 'area_inputs',
          label: this.t('area_detail.reset_node_inputs'),
          children: (template.inputs || []).map((inp: InputConfig) => {
            const act = (template.activities || []).find((a: ActivityConfig) => a.id === inp.activity)
            return {
              id: `area_inputs:${inp.id}`,
              label: `${getInputDisplayName(inp, this.hass)} — ${act?.name || act?.id || inp.activity}`
            }
          })
        },
        {
          id: 'area_activities',
          label: this.t('area_detail.reset_node_activities'),
          children: (template.activities || []).map((act: ActivityConfig) => ({
            id: `area_activities:${act.id}`,
            label: act.name || act.id
          }))
        },
        {
          id: 'area_channels',
          label: this.t('area_detail.reset_node_channels'),
          children: Object.entries(template.channels || {}).filter(([id]) => id !== PRIMARY_CHANNEL_ID).map(([id, chan]: [string, ChannelConfig]) => ({
            id: `area_channels:${id}`,
            label: chan.name || id
          }))
        }
      ]

      this._resetNodes = nodes
      this._resetDialogOpen = true
      this.requestUpdate()
    } catch (err) {
      console.error('Failed to load area global defaults template:', err)
    }
  }

  private async _executeReset(e: CustomEvent<{ selectedIds: string[] }>) {
    if (!this._areaTemplateSnapshot || !this._draftController.draft) return

    const selected = new Set(e.detail.selectedIds)
    const template = this._areaTemplateSnapshot
    
    this._draftController.update(draft => {
      if (selected.has('inherited')) {
        draft.lux_threshold = null
        draft.lux_watch_window = null
      }

      const inputsNodeSelected = selected.has('area_inputs')
      const templateInputs = template.inputs || []
      if (inputsNodeSelected) {
        draft.inputs = structuredClone(templateInputs)
      } else {
        const draftInputs = [...(draft.inputs || [])]
        templateInputs.forEach((defInp: InputConfig) => {
          if (selected.has(`area_inputs:${defInp.id}`)) {
            const idx = draftInputs.findIndex(di => di.id === defInp.id)
            if (idx >= 0) {
              draftInputs[idx] = structuredClone(defInp)
            } else {
              draftInputs.push(structuredClone(defInp))
            }
          }
        })
        draft.inputs = draftInputs
      }

      const activitiesNodeSelected = selected.has('area_activities')
      const templateActivities = template.activities || []
      if (activitiesNodeSelected) {
        draft.activities = structuredClone(templateActivities)
      } else {
        const draftActs = [...(draft.activities || [])]
        templateActivities.forEach((defAct: ActivityConfig) => {
          if (selected.has(`area_activities:${defAct.id}`)) {
            const idx = draftActs.findIndex(da => da.id === defAct.id)
            if (idx >= 0) {
              draftActs[idx] = structuredClone(defAct)
            } else {
              draftActs.push(structuredClone(defAct))
            }
          }
        })
        draft.activities = draftActs
      }

      const channelsNodeSelected = selected.has('area_channels')
      const templateChannels = template.channels || {}
      if (channelsNodeSelected) {
        const draftChannels = { ...(draft.channels || {}) }
        Object.keys(draftChannels).forEach(id => {
          if (id !== PRIMARY_CHANNEL_ID) delete draftChannels[id]
        })
        Object.entries(templateChannels).forEach(([id, chan]: [string, ChannelConfig]) => {
          if (id !== PRIMARY_CHANNEL_ID) {
            draftChannels[id] = structuredClone(chan)
          }
        })
        draft.channels = draftChannels
      } else {
        const draftChannels = { ...(draft.channels || {}) }
        Object.keys(templateChannels).forEach(id => {
          if (id !== PRIMARY_CHANNEL_ID && selected.has(`area_channels:${id}`)) {
            draftChannels[id] = structuredClone(templateChannels[id])
          }
        })
        draft.channels = draftChannels
      }
    })

    this._resetDialogOpen = false
    this.requestUpdate()
    await this._saveOrUpdateDraft()
  }

  private _areaToSlots(channelId: string, rawSlots: SlotConfig[]): Slot[] {
    // The backend resolves the anchor date in hass.config.time_zone — look it
    // up with the HA timezone, not the browser's (they can differ near midnight).
    const todayStr = haLocalDateString(this.hass)
    const datesObj = this._slotTimes?.channels?.[channelId]
    const calcList = datesObj?.[todayStr] || (datesObj ? Object.values(datesObj)[0] : []) || []
    return convertCalculatedTimesToSlots(calcList, rawSlots)
  }

  private _activeSceneName(slots: Slot[]): string {
    // Backend-first: when an engine is running the backend pushes the
    // scene name directly. light_states (target/actual/deviates) is also in runState.
    const runState = this.areasState[this.areaId] || null
    if (runState) {
      return runState.active_scene_name ?? this.t('area_detail.no_scene_active')
    }

    // No engine (draft preview): derive from current HA scene attributes.
    this._clock.setHass(this.hass)
    const liveMins = this._clock.liveMins
    const activeSlot = slots.find(s => isSlotActiveAt(s, liveMins))
    const activeScene = activeSlot?.scene ?? null
    return activeScene
      ? (this.hass?.states[activeScene]?.attributes?.friendly_name ?? activeScene)
      : this.t('area_detail.no_scene_active')
  }

  render() {
    if (this._draftController.loading) {
      return html`<div style="padding:24px;color:var(--secondary-text-color)">Loading Area Details…</div>`
    }
    const draft = this._draftController.draft
    if (!draft) return html``

    const area = this.areas.find(a => a.area_id === draft.area_id)
    const areaName = draft.name || area?.name || draft.area_id
    const todayStr = haLocalDateString(this.hass)
    const channelId = this._activeChannelId(draft)
    const slots = this._areaToSlots(channelId, getChannelSlots(draft, channelId))
    // status-card always shows the active slot from the Primary Channel — the
    // engine's active_slot refers to a Primary-Channel slot ID regardless of
    // which channel tab is selected in the Timetable.
    const primarySlots = this._areaToSlots(PRIMARY_CHANNEL_ID, getChannelSlots(draft, PRIMARY_CHANNEL_ID))
    const sensorsConfig = draft.sensors || []
    const activeSceneName = this._activeSceneName(slots)
    const runState = this.areasState[draft.area_id] || null

    const channelSlotsMap: Record<string, Slot[]> = {}
    for (const [chId, chCfg] of Object.entries(getChannels(draft))) {
      channelSlotsMap[chId] = this._areaToSlots(chId, chCfg.slots || [])
    }

    return html`
      <div class="view-header-container">
        <div class="view-header-grid detail-header">
          <div class="header-left">
            <button class="back-btn" @click=${() => this._backToOverview()} title=${this.t('area_detail.back_to_areas')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            </button>
            <h2>${areaName}</h2>
          </div>
          <div class="header-right">
            <select class="area-select"
              @change=${this._onSelectAreaChanged}>
              ${this.areaConfigs.map(r => html`
                <option value="${r.area_id}" ?selected=${r.area_id === draft.area_id}>${r.name || r.area_id}</option>
              `)}
            </select>
            <span class="enabled-label" style="margin-left: 8px;">${draft.enabled ? this.t('common.enabled') : this.t('common.disabled')}</span>
            <ha-switch
              .checked=${draft.enabled}
              @change=${this._onAreaEnabledToggled}
            ></ha-switch>
          </div>
        </div>
      </div>
 
      <div class="view-content-container">
        <div class="view-content-grid">
          <div class="span-12">
            <twilight-status-card
              .hass=${this.hass}
              .slots=${primarySlots}
              .channels=${getChannels(draft)}
              .channelSlotsMap=${channelSlotsMap}
              .sensorConfig=${sensorsConfig}
              .inputs=${draft.inputs || []}
              .activitiesConfig=${draft.activities || []}
              .runState=${runState}
              .areaEnabled=${draft.enabled}
            ></twilight-status-card>
          </div>
          <div class="span-6">
            <twilight-timetable-card
              .hass=${this.hass}
              .date=${todayStr}
              .slots=${slots}
              .entities=${this._areaEntities}
              .loading=${false}
              .noHeader=${false}
              .channels=${getChannels(draft)}
              .selectedChannelId=${channelId}
              .channelSlotsMap=${channelSlotsMap}
              .activeSlotId=${runState ? (runState.active_slots?.[channelId] ?? null) : undefined}
              @slots-changed=${this._onSlotsChanged}
              @edit-requested=${() => { this._slotEditOpen = true }}
              @channel-selected=${this._onChannelSelected}
              @channel-added=${this._onChannelAdded}
              @channel-renamed=${this._onChannelRenamed}
              @channel-deleted=${this._onChannelDeleted}
              @channel-enabled-toggled=${this._onChannelToggled}
              @slot-selected=${this._onSlotSelected}
            ></twilight-timetable-card>
          </div>
          <div class="span-6">
            <twilight-area-lights-card
              .hass=${this.hass}
              .entities=${this._areaEntities}
              .activeSceneName=${activeSceneName}
              .runState=${runState}
              .manualOnly=${draft.manual_only ?? false}
              @lights-changed=${this._onLightsChanged}
              @mode-changed=${this._onLightsModeChanged}
              @open-edit=${() => { this._areaLightsEditOpen = true }}
            ></twilight-area-lights-card>
          </div>
          <div class="span-6">
            <twilight-inputs-card
              .hass=${this.hass}
              .config=${draft.inputs ?? []}
              .activities=${this._availableActivities(draft)}
              .activitiesConfig=${draft.activities ?? []}
              .rulesConfig=${draft.rules ?? []}
              .placeholderDefaults=${this.placeholderDefaults}
              .runState=${runState}
              .areaId=${draft.area_id}
              .editOpen=${this._inputsEditOpen}
              @inputs-changed=${this._onInputsChanged}
              @open-edit=${() => { this._inputsEditOpen = true }}
            ></twilight-inputs-card>
          </div>
          <div class="span-6">
            <twilight-activities-card
              .hass=${this.hass}
              .config=${draft.activities ?? []}
              .inputs=${draft.inputs ?? []}
              .placeholderDefaults=${this.placeholderDefaults}
              .channels=${getChannels(draft)}
              .heatmapProfiles=${draft.heatmap_profiles ?? []}
              @activities-changed=${this._onActivitiesChanged}
              @open-edit=${() => { this._activitiesEditOpen = true }}
            ></twilight-activities-card>
          </div>
          <div class="span-6">
            <twilight-sensors-card
              .hass=${this.hass}
              .config=${sensorsConfig}
              .noHeader=${false}
              @sensors-changed=${this._onSensorsChanged}
              @open-edit=${() => { this._sensorsEditOpen = true }}
            ></twilight-sensors-card>
          </div>
          <div class="span-6">
            <twilight-rules-card
              .hass=${this.hass}
              .rules=${draft.rules ?? []}
              .inputsConfig=${draft.inputs ?? []}
              .activitiesConfig=${draft.activities ?? []}
              .channels=${getChannels(draft)}
              .runState=${runState}
              @rules-changed=${this._onRulesChanged}
              @open-edit=${() => { this._rulesEditOpen = true }}
            ></twilight-rules-card>
          </div>
        </div>
      </div>
 
      <div class="detail-footer">
        <div>
          <button class="btn-cancel" @click=${this._resetAreaToTemplate}>${this.t('area_detail.reset_to_template')}</button>
          ${this.areaConfigs.some(r => r.area_id === draft.area_id) ? html`
            <button class="btn-cancel" style="border-color: var(--error-color, #db4437); color: var(--error-color, #db4437); margin-left: 12px;" @click=${() => this._deleteArea()}>
              ${this.t('area_detail.remove_area')}
            </button>
          ` : ''}
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="save-status ${this._draftController.saveError ? 'error' : ''}">${this._saveStatusText()}</span>
          ${this._draftController.isDirty && !this._draftController.saving ? html`
            <button class="btn-cancel" ?disabled=${this._draftController.saving} @click=${() => this._draftController.cancel()}>${this.t('common.cancel')}</button>
            <button
              class="btn-save"
              ?disabled=${this._draftController.saving}
              @click=${() => this._draftController.save()}
            >
              ${this.t('common.save')}
            </button>
          ` : ''}
        </div>
      </div>

      <twilight-slot-editor
        .hass=${this.hass}
        .slots=${slots}
        .entities=${this._areaEntities}
        .placeholderDefaults=${this._effectivePlaceholderDefaults}
        .open=${this._slotEditOpen}
        .highlightSlotId=${this._editingSlotId}
        .areaId=${draft.area_id}
        .areaName=${draft.name || ''}
        .isPrimaryChannel=${channelId === PRIMARY_CHANNEL_ID}
        .channelName=${getChannels(draft)[channelId]?.name || ''}
        .transitionOnSeconds=${getChannels(draft)[channelId]?.transition_on_seconds ?? null}
        @slots-changed=${this._onSlotsChanged}
        @close=${() => { this._slotEditOpen = false; this._editingSlotId = null; }}
      ></twilight-slot-editor>

      <twilight-slot-tooltip
        .hass=${this.hass}
        .slots=${slots}
        .channelSlotsMap=${channelSlotsMap}
      ></twilight-slot-tooltip>

      <twilight-reset-dialog
        .open=${this._resetDialogOpen}
        .title=${this.t('area_detail.reset_area_title')}
        .description=${this.t('area_detail.reset_area_desc')}
        .nodes=${this._resetNodes}
        @confirm=${this._executeReset}
        @cancel=${() => { this._resetDialogOpen = false }}
      ></twilight-reset-dialog>

      <twilight-alert-dialog
        .open=${this._dialog.alertOpen}
        .dialogTitle=${this._dialog.alertTitle}
        .message=${this._dialog.alertMessage}
        @close=${this._dialog._onCloseAlert}
      ></twilight-alert-dialog>

      <twilight-area-lights-dialog
        .open=${this._areaLightsEditOpen}
        .hass=${this.hass}
        .entities=${this._areaEntities}
        .activeSceneName=${activeSceneName}
        .runState=${runState}
        .manualOnly=${draft.manual_only ?? false}
        @lights-changed=${this._onLightsChanged}
        @mode-changed=${this._onLightsModeChanged}
        @close=${() => { this._areaLightsEditOpen = false }}
      ></twilight-area-lights-dialog>

      <twilight-inputs-dialog
        .open=${this._inputsEditOpen}
        .hass=${this.hass}
        .config=${draft.inputs ?? []}
        .activities=${this._availableActivities(draft)}
        .activitiesConfig=${draft.activities ?? []}
        .rulesConfig=${draft.rules ?? []}
        .placeholderDefaults=${this.placeholderDefaults}
        .runState=${runState}
        .areaId=${draft.area_id}
        @inputs-changed=${this._onInputsChanged}
        @close=${() => { this._inputsEditOpen = false }}
      ></twilight-inputs-dialog>

      <twilight-activities-dialog
        .open=${this._activitiesEditOpen}
        .hass=${this.hass}
        .config=${draft.activities ?? []}
        .inputs=${draft.inputs ?? []}
        .placeholderDefaults=${this.placeholderDefaults}
        .channels=${getChannels(draft)}
        .heatmapProfiles=${draft.heatmap_profiles ?? []}
        @activities-changed=${this._onActivitiesChanged}
        @close=${() => { this._activitiesEditOpen = false }}
      ></twilight-activities-dialog>

      <twilight-sensors-dialog
        .open=${this._sensorsEditOpen}
        .hass=${this.hass}
        .config=${sensorsConfig}
        @sensors-changed=${this._onSensorsChanged}
        @close=${() => { this._sensorsEditOpen = false }}
      ></twilight-sensors-dialog>

      <twilight-rules-dialog
        .open=${this._rulesEditOpen}
        .hass=${this.hass}
        .config=${draft.rules ?? []}
        .inputsConfig=${draft.inputs ?? []}
        .activitiesConfig=${draft.activities ?? []}
        .channels=${getChannels(draft)}
        .runState=${runState}
        @rules-changed=${this._onRulesChanged}
        @close=${() => { this._rulesEditOpen = false }}
      ></twilight-rules-dialog>

      <twilight-confirm-dialog
        .open=${this._dialog.confirmOpen}
        .dialogTitle=${this._dialog.confirmTitle}
        .message=${this._dialog.confirmMessage}
        @confirm=${this._dialog._onConfirm}
        @cancel=${this._dialog._onCancelConfirm}
      ></twilight-confirm-dialog>
    `
  }
}
