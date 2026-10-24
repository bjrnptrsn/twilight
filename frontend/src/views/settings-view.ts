import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { HomeAssistant, GlobalConfig, PlaceholderDefaults } from '../lib/types'
import * as api from '../lib/api'
import '../components/inputs-card'
import '../components/activities-card'
import '../components/sensors-card'
import '../components/rules-card'
import '../components/timetable-card'
import '../components/slot-editor'
import '../components/backup-restore-dialog'
import { type Slot, type SlotConfig, type ChannelConfig, type SensorConfig, type ActivityConfig, type RuleConfig, type CalculatedSlotTime, PRIMARY_CHANNEL_ID, STANDARD_ZONE_IDS, STANDARD_NAMES } from '../lib/types'
import { slotToZone, convertCalculatedTimesToSlots, zoneColor } from '../lib/utils'
import { slugifyChannelId } from '../lib/channel-helpers'
import { DraftController } from '../lib/draft-controller'
import { DialogController } from '../lib/dialog-controller'
import { hostResetStyles, viewHeaderStyles, detailFooterStyles } from '../lib/shared-styles'
import { TwilightLocalizeMixin } from '../lib/i18n'
import '../components/dialogs'
import '../components/inputs-dialog'
import '../components/activities-dialog'
import '../components/sensors-dialog'
import '../components/rules-dialog'

@customElement('twilight-settings-view')
export class SettingsView extends TwilightLocalizeMixin(LitElement) {
  @property({ attribute: false }) hass: HomeAssistant | null = null

  @state() private _hasLoaded = false
  @state() private _selectedChannelId = ''
  @state() private _slotEditOpen = false
  @state() private _editingSlotId: string | null = null
  @state() private _templateInputsEditOpen = false
  @state() private _templateActivitiesEditOpen = false
  @state() private _templateSensorsEditOpen = false
  @state() private _templateRulesEditOpen = false
  @state() private _backupDialogOpen = false
  @state() private _placeholderDefaults: PlaceholderDefaults | null = null
  @state() private _calculatedSlotTimes: CalculatedSlotTime[] = []
  private _slotTimesRequestId = 0

  private _dialog = new DialogController(this)

  private _draftController = new DraftController<GlobalConfig>(this, {
    onSave: async (value) => {
      if (!this.hass) return
      await api.globalSave(this.hass, value)
      this.dispatchEvent(new CustomEvent('global-changed', {
        detail: value,
        bubbles: true,
        composed: true
      }))
    }
  })

  static styles = [
    hostResetStyles,
    viewHeaderStyles,
    detailFooterStyles,
    css`
      .save-status.error {
        color: var(--error-color, #db4437);
      }

      *, *:before, *:after {
        box-sizing: border-box;
      }



    .settings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 12px;
      box-sizing: border-box;
    }

    .settings-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      line-height: 24px;
    }

    .settings-header .header-left {
      display: flex;
      align-items: center;
      min-width: 0;
    }

    .settings-header .header-right {
      font-size: 13px;
      color: var(--secondary-text-color);
      white-space: nowrap;
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

    .span-6  { grid-column: span 6; min-width: 0; }
    .span-12 { grid-column: span 12; min-width: 0; }

    @media (max-width: 768px) {
      .view-content-grid .span-6 { grid-column: span 12; }
      .view-content-container { padding: 16px; }
    }

    /* ── Settings Cards ── */
    .settings-group {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .group-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.9px;
      color: var(--secondary-text-color);
      border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      padding-bottom: 8px;
      margin-bottom: 4px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .form-desc {
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-top: -2px;
      line-height: 1.3;
    }

    .sensor-input {
      width: 100%;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent));
      border-radius: 6px;
      color: var(--primary-text-color);
      padding: 10px 14px;
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .sensor-input:focus {
      border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--tp-accent, var(--accent-color, #e91e8c)) 20%, transparent);
    }

    .option-select {
      width: 100%;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent));
      border-radius: 6px;
      color: var(--primary-text-color);
      padding: 10px 14px;
      font-size: 14px;
      outline: none;
      cursor: pointer;
      box-sizing: border-box;
      transition: border-color 0.15s, box-shadow 0.15s;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 14px center;
      background-size: 16px;
      padding-right: 40px;
    }

    .option-select:focus {
      border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--tp-accent, var(--accent-color, #e91e8c)) 20%, transparent);
    }

    .setting-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 8px 0;
    }

    .setting-row-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }

    .setting-row-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .setting-row-description {
      font-size: 11px;
      color: var(--secondary-text-color);
      line-height: 1.3;
    }


    /* ── Loader spinner ── */
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      border-top-color: var(--tp-accent, var(--accent-color, #e91e8c));
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `
  ]

  private _loadingData = false

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('hass') && this.hass && !this._hasLoaded && !this._loadingData) {
      this._loadData()
    }
  }

  private async _loadData() {
    if (!this.hass || this._loadingData || this._hasLoaded) return
    this._loadingData = true
    this._draftController.loading = true
    this.requestUpdate()
    try {
      const [config, placeholderDefaults] = await Promise.all([
        api.globalGet(this.hass),
        api.placeholderDefaults(this.hass).catch(() => null)
      ])
      this._draftController.init(config || {})
      this._placeholderDefaults = placeholderDefaults
      this._selectFirstChannel()
      await this._loadCalculatedSlotTimes()
    } catch (err) {
      console.error('Failed to load global config:', err)
    } finally {
      // Set on both success and failure — a persistent backend error must not
      // re-fire the request on every hass tick. A page reload is the retry path.
      this._hasLoaded = true
      this._loadingData = false
      this._draftController.loading = false
      this.requestUpdate()
    }
  }

  private async _loadCalculatedSlotTimes() {
    if (!this.hass) return
    const customChannels = this._draftController.draft?.area_template?.custom_channels || {}
    const activeChannel = customChannels[this._selectedChannelId]
    const slots = activeChannel?.slots || []
    const requestId = ++this._slotTimesRequestId
    if (slots.length === 0) {
      this._calculatedSlotTimes = []
      return
    }
    try {
      const result = await api.slotTimesPreview(this.hass, { slots })
      if (requestId !== this._slotTimesRequestId) return // stale response, a newer request is in flight
      this._calculatedSlotTimes = result.slots
    } catch (err) {
      console.warn('Failed to load slot time preview:', err)
      if (requestId === this._slotTimesRequestId) this._calculatedSlotTimes = []
    }
  }

  private _selectFirstChannel() {
    if (this._selectedChannelId === PRIMARY_CHANNEL_ID) return
    const customChannels = this._draftController.draft?.area_template?.custom_channels || {}
    if (!this._selectedChannelId || !customChannels[this._selectedChannelId]) {
      this._selectedChannelId = PRIMARY_CHANNEL_ID
    }
  }

  /** Exposed so panel-base.ts can warn before a tab switch unmounts this
   *  view (and its DraftController-backed global config draft). */
  get hasUnsavedChanges(): boolean {
    return this._draftController.isDirty
  }

  private async _saveSettings() {
    await this._draftController.save()
  }

  private _cancelChanges() {
    this._draftController.cancel()
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

  private async _onTemplateInputsChanged(e: CustomEvent) {
    this._draftController.update(draft => {
      if (!draft.area_template) draft.area_template = {}
      draft.area_template.inputs = e.detail.inputs
    })
    await this._draftController.save()
  }

  private async _onTemplateActivitiesChanged(e: CustomEvent) {
    this._draftController.update(draft => {
      if (!draft.area_template) draft.area_template = {}
      draft.area_template.activities = e.detail.activities
    })
    await this._draftController.save()
  }

  private async _onTemplateSensorsChanged(e: CustomEvent<SensorConfig[]>) {
    this._draftController.update(draft => {
      if (!draft.area_template) draft.area_template = {}
      draft.area_template.sensors = e.detail
    })
    await this._draftController.save()
  }

  private async _onTemplateRulesChanged(e: CustomEvent<RuleConfig[]>) {
    this._draftController.update(draft => {
      if (!draft.area_template) draft.area_template = {}
      draft.area_template.rules = e.detail
    })
    await this._draftController.save()
  }

  private _onTemplateChannelSelected(e: CustomEvent<{ channelId: string }>) {
    this._selectedChannelId = e.detail.channelId
    this._loadCalculatedSlotTimes()
  }

  private async _onTemplateChannelAdded(e: CustomEvent<{ name: string }>) {
    const draft = this._draftController.draft
    if (!draft) return
    const name = e.detail.name.trim()
    if (!name) return
    const id = slugifyChannelId(name)
    if (!id) return

    const customChannels = { ...(draft.area_template?.custom_channels || {}) }
    if (customChannels[id]) {
      await this._dialog.showAlert(this.t('area_detail.channel_exists'), this.t('area_detail.channel_exists_desc', { name }))
      return
    }
    customChannels[id] = { name, enabled: true, slots: [] }

    this._draftController.update(d => {
      if (!d.area_template) d.area_template = {}
      d.area_template.custom_channels = customChannels
    })
    await this._draftController.save()
    this._selectedChannelId = id
    this._loadCalculatedSlotTimes()
  }

  private async _onTemplateChannelRenamed(e: CustomEvent<{ channelId: string; name: string }>) {
    const draft = this._draftController.draft
    if (!draft) return
    const { channelId, name } = e.detail
    const customChannels = { ...(draft.area_template?.custom_channels || {}) }
    const ch = customChannels[channelId]
    if (!ch) return
    customChannels[channelId] = { ...ch, name }

    this._draftController.update(d => {
      if (!d.area_template) d.area_template = {}
      d.area_template.custom_channels = customChannels
    })
    await this._draftController.save()
  }

  private async _onTemplateChannelDeleted(e: CustomEvent<{ channelId: string }>) {
    const draft = this._draftController.draft
    if (!draft) return
    const { channelId } = e.detail
    const customChannels = { ...(draft.area_template?.custom_channels || {}) }
    delete customChannels[channelId]

    this._draftController.update(d => {
      if (!d.area_template) d.area_template = {}
      d.area_template.custom_channels = customChannels
    })
    await this._draftController.save()
    this._selectFirstChannel()
    this._loadCalculatedSlotTimes()
  }

  private async _onTemplateChannelToggled(e: CustomEvent<{ channelId: string; enabled: boolean }>) {
    const draft = this._draftController.draft
    if (!draft) return
    const { channelId, enabled } = e.detail
    const customChannels = { ...(draft.area_template?.custom_channels || {}) }
    const ch = customChannels[channelId]
    if (!ch) return
    customChannels[channelId] = { ...ch, enabled }

    this._draftController.update(d => {
      if (!d.area_template) d.area_template = {}
      d.area_template.custom_channels = customChannels
    })
    await this._draftController.save()
  }

  private async _onTemplateSlotsChanged(e: CustomEvent<{ slots: Slot[]; transitionOnSeconds?: number | null }>) {
    const draft = this._draftController.draft
    if (!draft) return
    let channelId = this._selectedChannelId
    const customChannels = { ...(draft.area_template?.custom_channels || {}) } as Record<string, ChannelConfig>
    if (!channelId || !customChannels[channelId]) {
      const keys = Object.keys(customChannels)
      if (keys.length > 0) {
        channelId = keys[0]
        this._selectedChannelId = channelId
      }
    }
    const existing = customChannels[channelId]
    if (!existing) return

    const existingSlots = existing.slots || []
    const newSlots: SlotConfig[] = e.detail.slots.map(s => {
      const orig = existingSlots.find(ds => ds.id === s.id)
      const isFixed = s.startType === 'fixed'
      return {
        id: s.id,
        name: s.label,
        start_type: isFixed ? 'fixed' : 'astral',
        zone: isFixed ? null : slotToZone(s),
        fixed_time: isFixed ? (s.fixedStartTime || '00:00') : null,
        offset_minutes: s.startOffset || 0,
        scene_entity_id: s.scene,
        configured_entities: orig?.configured_entities || [],
        hue_activate_dynamic: s.hue_activate_dynamic || false,
        hue_dynamic_speed: s.hue_dynamic_speed ?? null,
      }
    })

    customChannels[channelId] = {
      ...existing,
      slots: newSlots,
      ...(e.detail.transitionOnSeconds !== undefined ? { transition_on_seconds: e.detail.transitionOnSeconds } : {})
    }
    this._draftController.update(d => {
      if (!d.area_template) d.area_template = {}
      d.area_template.custom_channels = customChannels
    })
    await this._draftController.save()
    this._loadCalculatedSlotTimes()
  }

  private async _onTemplatePrimarySlotsChanged(e: CustomEvent<{ slots: Slot[] }>) {
    const primarySlots: Record<string, Partial<SlotConfig>> = {}
    for (const slot of e.detail.slots) {
      const zoneId = slot.id
      const override: Partial<SlotConfig> = {}
      if (slot.startOffset) override.offset_minutes = slot.startOffset
      if (slot.scene) override.scene_entity_id = slot.scene
      if (slot.hue_activate_dynamic) override.hue_activate_dynamic = slot.hue_activate_dynamic
      if (slot.hue_dynamic_speed != null) override.hue_dynamic_speed = slot.hue_dynamic_speed
      if (slot.configured_entities && slot.configured_entities.length > 0) override.configured_entities = slot.configured_entities
      if (Object.keys(override).length > 0) {
        primarySlots[zoneId] = override
      }
    }
    this._draftController.update(d => {
      if (!d.area_template) d.area_template = {}
      d.area_template.primary_slots = primarySlots
    })
    await this._draftController.save()
  }

  /** Materializes the sparse primary_slots overrides into a full Primary ChannelConfig
   *  so the Rules/Activities slot-action-tree can offer the 10 standard Twilight slots,
   *  same as it already does for custom channels. */
  private _primaryChannelForTemplate(): ChannelConfig {
    const primaryOverrides = this._draftController.draft?.area_template?.primary_slots || {}
    const slots: SlotConfig[] = STANDARD_ZONE_IDS.map(zoneId => {
      const override = primaryOverrides[zoneId] || {}
      return {
        id: zoneId,
        name: STANDARD_NAMES[zoneId] || zoneId,
        start_type: 'astral',
        zone: zoneId,
        offset_minutes: override.offset_minutes ?? 0,
        scene_entity_id: override.scene_entity_id ?? null,
        configured_entities: override.configured_entities ?? [],
      }
    })
    return { name: 'Primary', enabled: true, slots }
  }

  private _primaryDisplaySlots(): Slot[] {
    const primaryOverrides = this._draftController.draft?.area_template?.primary_slots || {}
    return STANDARD_ZONE_IDS.map(zoneId => {
      const override = primaryOverrides[zoneId] || {}
      return {
        id: zoneId,
        label: STANDARD_NAMES[zoneId] || zoneId,
        color: zoneColor(zoneId),
        from: 0,
        to: 0,
        scene: override.scene_entity_id || null,
        isCustom: false,
        startType: 'astral' as const,
        startEvent: zoneId,
        startOffset: override.offset_minutes || 0,
        // Reconstructed from the sparse overrides like the fields above —
        // _onTemplatePrimarySlotsChanged rebuilds primary_slots wholesale on
        // save, so any override field missing here would silently drop out of
        // the template on the next save (configured_entities, dynamic-Hue).
        configured_entities: override.configured_entities ?? [],
        hue_activate_dynamic: override.hue_activate_dynamic ?? false,
        hue_dynamic_speed: override.hue_dynamic_speed ?? null,
      }
    })
  }

  render() {
    const customChannels = this._draftController.draft?.area_template?.custom_channels || {}
    let channelId = this._selectedChannelId || PRIMARY_CHANNEL_ID
    if (channelId !== PRIMARY_CHANNEL_ID && !customChannels[channelId] && Object.keys(customChannels).length > 0) {
      channelId = Object.keys(customChannels)[0]
    }
    const isPrimarySelected = channelId === PRIMARY_CHANNEL_ID
    const activeChannel = customChannels[channelId]
    const rawSlots = activeChannel?.slots || []
    const slots: Slot[] = isPrimarySelected
      ? this._primaryDisplaySlots()
      : (this._calculatedSlotTimes.length > 0
        ? convertCalculatedTimesToSlots(this._calculatedSlotTimes, rawSlots).map(s => ({ ...s, color: '#8e44ad', isCustom: true }))
        : rawSlots.map((s: SlotConfig) => {
          const isFixed = s.start_type === 'fixed'
          return {
            id: s.id,
            label: s.name || s.id,
            color: '#8e44ad',
            from: 0,
            to: 0,
            scene: s.scene_entity_id || null,
            isCustom: true,
            startType: isFixed ? ('fixed' as const) : ('astral' as const),
            startEvent: isFixed ? undefined : (s.zone || 'civil_dawn'),
            fixedStartTime: isFixed ? (s.fixed_time || '12:00') : undefined,
            startOffset: s.offset_minutes || 0
          }
        }))

    return html`
      <div class="view-header-container">
        <div class="settings-header">
          <div class="header-left">
            <h2>${this.t('nav.settings')}</h2>
          </div>
          <div class="header-right">
            Version ${__TWILIGHT_VERSION__}
          </div>
        </div>
      </div>

      <div class="view-content-container">
        ${this._draftController.loading ? html`
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px 0; gap: 16px; color: var(--secondary-text-color);">
            <div class="spinner"></div>
            <div>${this.t('settings_view.loading')}</div>
          </div>
        ` : html`
          <div class="view-content-grid">
            <!-- Card 2: General Settings -->
            <div class="span-12">
              <div class="settings-group">
                <div class="group-title">${this.t('settings_view.general')}</div>
                <div class="form-desc" style="line-height:1.5; opacity:0.85;">
                  ${this.t('settings_view.general_desc')}
                </div>
              </div>
            </div>

            <!-- Area Template Header -->
            <div class="span-12">
              <div style="font-size: 13px; font-weight: 600; color: var(--primary-text-color); padding-top: 8px;">
                ${this.t('settings_view.area_template')}
              </div>
              <div style="font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;">
                ${this.t('settings_view.area_template_desc')}
              </div>
            </div>

            <!-- Template: Inputs -->
            <div class="span-6">
              <twilight-inputs-card
                .hass=${this.hass}
                .config=${this._draftController.draft?.area_template?.inputs ?? []}
                .activities=${(this._draftController.draft?.area_template?.activities ?? []).map((a: ActivityConfig) => a.id)}
                .activitiesConfig=${this._draftController.draft?.area_template?.activities ?? []}
                .rulesConfig=${this._draftController.draft?.area_template?.rules ?? []}
                .placeholderDefaults=${this._placeholderDefaults}
                .templateMode=${true}
                .editOpen=${this._templateInputsEditOpen}
                @inputs-changed=${this._onTemplateInputsChanged}
                @open-edit=${() => { this._templateInputsEditOpen = true }}
              ></twilight-inputs-card>
            </div>

            <!-- Template: Activities -->
            <div class="span-6">
              <twilight-activities-card
                .hass=${this.hass}
                .config=${this._draftController.draft?.area_template?.activities ?? []}
                .inputs=${this._draftController.draft?.area_template?.inputs ?? []}
                .placeholderDefaults=${this._placeholderDefaults}
                .channels=${{ [PRIMARY_CHANNEL_ID]: this._primaryChannelForTemplate(), ...customChannels }}
                .templateMode=${true}
                @activities-changed=${this._onTemplateActivitiesChanged}
                @open-edit=${() => { this._templateActivitiesEditOpen = true }}
              ></twilight-activities-card>
            </div>

            <!-- Left Column: Sensors & Rules stacked -->
            <div class="span-6" style="display: flex; flex-direction: column; gap: 16px;">
              <twilight-sensors-card
                .hass=${this.hass}
                .config=${this._draftController.draft?.area_template?.sensors ?? []}
                .templateMode=${true}
                @sensors-changed=${this._onTemplateSensorsChanged}
                @open-edit=${() => { this._templateSensorsEditOpen = true }}
              ></twilight-sensors-card>

              <twilight-rules-card
                .hass=${this.hass}
                .rules=${this._draftController.draft?.area_template?.rules ?? []}
                .inputsConfig=${this._draftController.draft?.area_template?.inputs ?? []}
                .activitiesConfig=${this._draftController.draft?.area_template?.activities ?? []}
                .channels=${{ [PRIMARY_CHANNEL_ID]: this._primaryChannelForTemplate(), ...customChannels }}
                .placeholderDefaults=${this._placeholderDefaults}
                .templateMode=${true}
                @rules-changed=${this._onTemplateRulesChanged}
                @open-edit=${() => { this._templateRulesEditOpen = true }}
              ></twilight-rules-card>
            </div>

            <!-- Right Column: Timetable spanning full height -->
            <div class="span-6">
              <twilight-timetable-card
                .hass=${this.hass}
                .slots=${slots}
                .entities=${[]}
                .loading=${false}
                .noHeader=${false}
                .channels=${customChannels}
                .selectedChannelId=${channelId}
                .templateMode=${true}
                @slots-changed=${this._onTemplateSlotsChanged}
                @edit-requested=${() => { this._slotEditOpen = true }}
                @channel-selected=${this._onTemplateChannelSelected}
                @channel-added=${this._onTemplateChannelAdded}
                @channel-renamed=${this._onTemplateChannelRenamed}
                @channel-deleted=${this._onTemplateChannelDeleted}
                @channel-enabled-toggled=${this._onTemplateChannelToggled}
              ></twilight-timetable-card>
            </div>
          </div>
        `}
      </div>

      <div class="detail-footer">
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn-cancel" @click=${() => { this._backupDialogOpen = true }}>${this.t('settings_view.backup_restore')}</button>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="save-status ${this._draftController.saveError ? 'error' : ''}">${this._saveStatusText()}</span>
          ${this._draftController.isDirty && !this._draftController.saving ? html`
            <button class="btn-cancel" ?disabled=${this._draftController.saving} @click=${this._cancelChanges}>${this.t('common.cancel')}</button>
            <button
              class="btn-save"
              ?disabled=${this._draftController.saving}
              @click=${this._saveSettings}
            >
              ${this.t('common.save')}
            </button>
          ` : ''}
        </div>
      </div>

      <twilight-slot-editor
        .hass=${this.hass}
        .slots=${slots}
        .entities=${[]}
        .placeholderDefaults=${this._placeholderDefaults}
        .open=${this._slotEditOpen}
        .highlightSlotId=${this._editingSlotId}
        .areaId=${''}
        .areaName=${''}
        .isPrimaryChannel=${isPrimarySelected}
        .templateMode=${true}
        .channelName=${isPrimarySelected ? this.t('common.primary_channel') : (activeChannel?.name || '')}
        .transitionOnSeconds=${isPrimarySelected ? null : (activeChannel?.transition_on_seconds ?? null)}
        @slots-changed=${isPrimarySelected ? this._onTemplatePrimarySlotsChanged : this._onTemplateSlotsChanged}
        @close=${() => { this._slotEditOpen = false; this._editingSlotId = null; }}
      ></twilight-slot-editor>

      <twilight-backup-restore-dialog
        .hass=${this.hass || undefined}
        .open=${this._backupDialogOpen}
        .isDraftDirty=${this._draftController.isDirty}
        @close=${() => { this._backupDialogOpen = false }}
      ></twilight-backup-restore-dialog>

      <twilight-inputs-dialog
        .open=${this._templateInputsEditOpen}
        .hass=${this.hass}
        .config=${this._draftController.draft?.area_template?.inputs ?? []}
        .activities=${(this._draftController.draft?.area_template?.activities ?? []).map((a: ActivityConfig) => a.id)}
        .activitiesConfig=${this._draftController.draft?.area_template?.activities ?? []}
        .rulesConfig=${this._draftController.draft?.area_template?.rules ?? []}
        .placeholderDefaults=${this._placeholderDefaults}
        .templateMode=${true}
        @inputs-changed=${this._onTemplateInputsChanged}
        @close=${() => { this._templateInputsEditOpen = false }}
      ></twilight-inputs-dialog>

      <twilight-activities-dialog
        .open=${this._templateActivitiesEditOpen}
        .hass=${this.hass}
        .config=${this._draftController.draft?.area_template?.activities ?? []}
        .inputs=${this._draftController.draft?.area_template?.inputs ?? []}
        .placeholderDefaults=${this._placeholderDefaults}
        .channels=${{ [PRIMARY_CHANNEL_ID]: this._primaryChannelForTemplate(), ...customChannels }}
        .templateMode=${true}
        @activities-changed=${this._onTemplateActivitiesChanged}
        @close=${() => { this._templateActivitiesEditOpen = false }}
      ></twilight-activities-dialog>

      <twilight-sensors-dialog
        .open=${this._templateSensorsEditOpen}
        .hass=${this.hass}
        .config=${this._draftController.draft?.area_template?.sensors ?? []}
        .templateMode=${true}
        @sensors-changed=${this._onTemplateSensorsChanged}
        @close=${() => { this._templateSensorsEditOpen = false }}
      ></twilight-sensors-dialog>

      <twilight-rules-dialog
        .open=${this._templateRulesEditOpen}
        .hass=${this.hass}
        .config=${this._draftController.draft?.area_template?.rules ?? []}
        .inputsConfig=${this._draftController.draft?.area_template?.inputs ?? []}
        .activitiesConfig=${this._draftController.draft?.area_template?.activities ?? []}
        .channels=${{ [PRIMARY_CHANNEL_ID]: this._primaryChannelForTemplate(), ...customChannels }}
        .placeholderDefaults=${this._placeholderDefaults}
        .templateMode=${true}
        @rules-changed=${this._onTemplateRulesChanged}
        @close=${() => { this._templateRulesEditOpen = false }}
      ></twilight-rules-dialog>

      <twilight-alert-dialog
        .hass=${this.hass}
        .open=${this._dialog.alertOpen}
        .dialogTitle=${this._dialog.alertTitle}
        .message=${this._dialog.alertMessage}
        @close=${this._dialog._onCloseAlert}
      ></twilight-alert-dialog>
    `
  }
}
