import { LitElement, html, css, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { type ActivityConfig, type LabEntity, type InputConfig, type ActivityActionType, type ActivityAction, type ReleaseActionType, type ReleaseAction, type EntityTarget, type ResetScope, type SimLuxMode, type SimFrequencyMode, type HomeAssistant, type PlaceholderDefaults, type ChannelConfig } from '../lib/types'
import { activityBadgeStyles, dialogChromeStyles } from '../lib/shared-styles'
import { getFallbackActivityInfo, isValidDurationInput, normalizeDuration } from '../lib/activity-helpers'
import { getInputDisplayName } from '../lib/input-helpers'
import { TwilightLocalizeMixin, type TranslationKey } from '../lib/i18n'
import { FocusRestoreController } from '../lib/focus-restore-controller'
import './slot-action-tree'
import './entity-list-dialog'
import { areaSceneIds } from '../lib/area-scenes'

/**
 * Flat editing draft for one activity, decoupled from the persisted
 * `ActivityConfig` shape (nested action/release_action). Held internally by
 * the sub-editor; converted back to `ActivityConfig` on save.
 */
export interface ActivityEditorDraft {
  id: string
  name: string
  suppress_inputs: string[]
  auto_expire_enabled: boolean
  auto_expire: string | null
  action_type: ActivityActionType | ''
  action_entity_id: string
  action_configured_entities: string[]
  action_respect_manual_off: boolean
  action_reset_scope: ResetScope
  action_entity_targets: EntityTarget[]
  action_excluded_slots: Record<string, string[]>
  action_sim_template_activity: string
  action_sim_lux_mode: SimLuxMode
  action_sim_frequency_mode: SimFrequencyMode
  action_sim_heatmap_profile_id: string
  release_action_type: ReleaseActionType
  release_activity: string
  transition_off_seconds: number | null
}

// Opaque equality check, deliberately not a bare `===`: TS's control-flow
// narrowing treats every `x === 'literal'` against the same `const` binding as
// cumulative, so a chain of unrelated checks (entity/reset/simulation)
// against `effectiveActionType` in render() progressively narrows away
// 'block'/'reset' and produces false "no overlap" errors on later comparisons.
// Routing through a function call opts out of that narrowing.
function isActionType(value: string, type: string): boolean {
  return value === type
}

const ENTITY_TARGET_ACTIONS: Record<string, { value: EntityTarget['action']; labelKey: TranslationKey }[]> = {
  input_boolean: [
    { value: 'on', labelKey: 'activity_row_editor.state_on' },
    { value: 'off', labelKey: 'activity_row_editor.state_off' },
    { value: 'toggle', labelKey: 'activity_row_editor.state_toggle' },
  ],
  switch: [
    { value: 'on', labelKey: 'activity_row_editor.state_on' },
    { value: 'off', labelKey: 'activity_row_editor.state_off' },
    { value: 'toggle', labelKey: 'activity_row_editor.state_toggle' },
  ],
  script: [
    { value: 'activate', labelKey: 'activity_row_editor.state_activate' },
  ],
}

/** Build the flat editing draft for the Add flow. */
export function makeNewActivityDraft(): ActivityEditorDraft {
  return {
    id: '',
    name: '',
    suppress_inputs: [],
    auto_expire_enabled: true,
    auto_expire: null,
    action_type: 'slot',
    action_entity_id: '',
    action_configured_entities: [],
    action_respect_manual_off: false,
    action_reset_scope: 'area',
    action_entity_targets: [],
    action_excluded_slots: {},
    action_sim_template_activity: '',
    action_sim_lux_mode: 'dusk_dawn',
    action_sim_frequency_mode: 'normal',
    action_sim_heatmap_profile_id: '',
    release_action_type: 'none',
    release_activity: '',
    transition_off_seconds: null,
  }
}

/** Convert a persisted `ActivityConfig` into the flat editing draft. */
export function activityToDraft(act: ActivityConfig): ActivityEditorDraft {
  const action = act.action
  const release = act.release_action
  return {
    id: act.id,
    name: act.name ?? '',
    suppress_inputs: [...(act.suppress_inputs ?? [])],
    auto_expire_enabled: act.auto_expire_enabled !== false,
    auto_expire: act.auto_expire ?? null,
    action_type: (action?.type ?? '') as ActivityActionType | '',
    action_entity_id: action?.entity_id ?? '',
    action_configured_entities: [...(action?.configured_entities ?? [])],
    action_respect_manual_off: action?.respect_manual_off ?? false,
    action_reset_scope: action?.scope ?? 'area',
    action_entity_targets: [...(action?.entity_targets ?? [])],
    action_excluded_slots: { ...(action?.excluded_slots ?? {}) },
    action_sim_template_activity: action?.template_activity ?? '',
    action_sim_lux_mode: action?.lux_mode ?? 'dusk_dawn',
    action_sim_frequency_mode: action?.frequency_mode ?? 'normal',
    action_sim_heatmap_profile_id: action?.heatmap_profile_id ?? '',
    release_action_type: release?.type ?? 'none',
    release_activity: release?.activity ?? '',
    transition_off_seconds: act.transition_off_seconds ?? null,
  }
}

/**
 * Sub-editor for a single activity (Add/Edit), extracted from
 * activities-dialog.ts. Follows the slot-editor.ts pattern: start value comes
 * in via @property, the component holds its own immutable `_editDraft`, and it
 * emits the finished `ActivityConfig` on save via a CustomEvent.
 *
 * Name-format and duplicate validation stay in the parent (it owns the
 * DialogController and the full list); this component only guards the button
 * against an empty/duplicate id via `existingIds`.
 */
@customElement('twilight-activity-row-editor')
export class TwilightActivityRowEditor extends TwilightLocalizeMixin(LitElement) {
  private _focusRestore = new FocusRestoreController(this)
  @property({ type: Boolean }) open = false
  @property({ attribute: false }) hass: HomeAssistant | null = null
  /** Start value for the editor; cloned into `_editDraft` on open. */
  @property({ attribute: false }) activity: ActivityConfig | null = null
  /** null = Add, number = Edit. Controls header/button labels + name lock. */
  @property({ type: Number }) editIndex: number | null = null
  @property({ attribute: false }) inputs: InputConfig[] = []
  @property({ attribute: false }) placeholderDefaults: PlaceholderDefaults | null = null
  @property({ attribute: false }) channels: Record<string, ChannelConfig> = {}
  /** Existing activity ids (for the duplicate button-guard in Add mode). */
  @property({ type: Array }) existingIds: string[] = []
  /** All activities of the area (for the simulation template dropdown filter). */
  @property({ attribute: false }) allActivities: ActivityConfig[] = []
  /** Saved heatmap profiles of the area (for the simulation profile dropdown). */
  @property({ attribute: false }) heatmapProfiles: { id: string; name: string }[] = []
  @property({ attribute: false }) entities: LabEntity[] = []
  @property({ type: String }) areaId = ''
  @property({ type: String }) areaName = ''

  @state() private _editDraft: ActivityEditorDraft | null = null
  @state() private _turnOffListOpen = false

  static styles = [
    activityBadgeStyles,
    dialogChromeStyles,
    css`
      :host {
        display: contents;
      }

      .panel-body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 16px 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .list-section-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.9px;
        color: var(--secondary-text-color);
        padding: 0 0 6px;
      }

      .row-action-btn {
        background: transparent;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 14px;
        padding: 6px 10px;
        border-radius: 6px;
        transition: color 0.15s, background-color 0.15s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .row-action-btn.remove:hover {
        color: var(--error-color, #db4437);
        background: rgba(219, 68, 55, 0.1);
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .form-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--secondary-text-color);
      }

      .activity-input {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 4px;
        color: var(--primary-text-color);
        padding: 8px 12px;
        font-size: 13px;
        outline: none;
        box-sizing: border-box;
        height: 38px;
        transition: border-color 0.15s;
      }
      .activity-input:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }
      .activity-input:disabled {
        background: rgba(255, 255, 255, 0.01);
        color: var(--secondary-text-color);
        cursor: not-allowed;
        border-color: rgba(255, 255, 255, 0.04);
      }
      .activity-input.invalid {
        border-color: var(--error-color, #db4437);
      }

      .form-field .turn-off-list-btn {
        margin-top: 6px;
      }

      .form-hint {
        font-size: 11px;
        line-height: 1.35;
        color: var(--secondary-text-color);
        opacity: 0.85;
      }
      .form-hint code {
        font-family: monospace;
        background: rgba(255, 255, 255, 0.06);
        padding: 0 4px;
        border-radius: 3px;
      }
      .form-error {
        font-size: 11px;
        color: var(--error-color, #db4437);
      }

      .option-select {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 4px;
        color: var(--primary-text-color);
        padding: 8px 12px;
        font-size: 13px;
        outline: none;
        cursor: pointer;
        box-sizing: border-box;
        height: 38px;
      }
      .option-select:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }

      .btn-add-primary {
        background: var(--tp-accent, var(--accent-color, #e91e8c));
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.15s;
      }
      .btn-add-primary:hover { opacity: 0.9; }
      .btn-add-primary:disabled {
        background: rgba(255, 255, 255, 0.05);
        color: var(--secondary-text-color);
        cursor: not-allowed;
      }

      .checkbox-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        padding: 12px;
        max-height: 150px;
        overflow-y: auto;
      }

      .checkbox-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        color: var(--primary-text-color);
        cursor: pointer;
      }
      .checkbox-item input {
        cursor: pointer;
      }

      .sensor-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 8px;
      }
      .sensor-row:hover {
        background: rgba(255, 255, 255, 0.015);
      }
      .sensor-remove-btn {
        background: transparent;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 15px;
        padding: 4px;
        border-radius: 4px;
        transition: color 0.15s, background-color 0.15s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .sensor-remove-btn:hover {
        color: var(--error-color, #db4437);
        background: rgba(219, 68, 55, 0.1);
      }
    `
  ]

  willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has('open') || changedProperties.has('activity')) {
      if (this.open && this.activity) {
        this._editDraft = this.editIndex === null && this.activity.id === ''
          ? makeNewActivityDraft()
          : activityToDraft(this.activity)
      } else if (!this.open) {
        this._editDraft = null
      }
    }
  }

  private _getFallbackActivityInfo() {
    return getFallbackActivityInfo(this.placeholderDefaults)
  }

  /**
   * Activities eligible as a presence-simulation template: those whose start
   * action switches a light on (slot/entity) and whose release does not switch
   * to another activity. Mirrors the backend guard
   * (helpers.simulation_template_eligible); the activity being edited is
   * excluded (no self).
   */
  private _eligibleTemplateActivities(): ActivityConfig[] {
    const editingId = this._editDraft?.id.trim().toLowerCase()
    return this.allActivities.filter(a => {
      if (a.id === editingId || a.release_action?.type === 'activity') return false
      const t = a.action?.type
      return t === 'slot' || t === 'entity'
    })
  }

  /**
   * Activities the release action may switch to. Mirrors the backend guard
   * (helpers.release_handover_target): one hop only, so a target that switches
   * on itself is left out.
   */
  private _eligibleReleaseTargets(): ActivityConfig[] {
    const editingId = this._editDraft?.id.trim().toLowerCase()
    return this.allActivities.filter(a => {
      if (a.id === editingId || a.release_action?.type === 'activity') return false
      const t = a.action?.type
      return t === 'slot' || t === 'entity' || t === 'block' || t === 'simulation'
    })
  }

  /** True if another activity switches to this one, which rules out a second hop. */
  private _isReleaseTarget(): boolean {
    const editingId = this._editDraft?.id.trim().toLowerCase()
    return this.allActivities.some(a =>
      a.id !== editingId && a.release_action?.type === 'activity' && a.release_action.activity === editingId
    )
  }

  private _hasValidReleaseTarget(draft: ActivityEditorDraft): boolean {
    return this._eligibleReleaseTargets().some(a => a.id === draft.release_activity)
  }

  private _cancel() {
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }))
  }

  /** Filter for the scene/script picker. A scene of another area stays reachable
   *  through the picker's custom entity input. */
  private _sceneFilter(draft: ActivityEditorDraft) {
    if (!this.areaId || this.entities.length === 0) return () => true
    const areaScenes = areaSceneIds(this.entities, this.areaId, this.areaName, new Set([draft.action_entity_id]))
    const known = new Set(this.entities.map(e => e.entity_id))
    return (e: { entity_id: string }) =>
      known.has(e.entity_id) ? areaScenes.has(e.entity_id) : e.entity_id.startsWith('script.')
  }

  private _releaseHelpKey(draft: ActivityEditorDraft): TranslationKey {
    if (draft.release_action_type === 'turn_off') return 'activity_row_editor.release_help_turn_off'
    if (draft.release_action_type === 'activity') return 'activity_row_editor.release_help_activity'
    return 'activity_row_editor.release_help_none'
  }

  private _isSaveDisabled(draft: ActivityEditorDraft): boolean {
    const hasNameOrId = !!(draft.name.trim() || draft.id.trim())
    const expireInvalid = draft.auto_expire_enabled
      && draft.auto_expire !== null
      && !isValidDurationInput(draft.auto_expire)
    const releaseInvalid = draft.action_type !== 'reset'
      && draft.release_action_type === 'activity'
      && !this._hasValidReleaseTarget(draft)
    return !hasNameOrId || expireInvalid || releaseInvalid
  }

  private _save() {
    if (!this._editDraft) return
    let rawId = (this.editIndex !== null && this.activity?.id)
      ? this.activity.id
      : this._editDraft.id.trim().toLowerCase()
    const activityName = this._editDraft.name.trim() || undefined

    if (!rawId) {
      const hex = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      rawId = `activity_${hex}`
    }

    const effectiveActionType = this._editDraft.action_type === ''
      ? null
      : this._editDraft.action_type

    const action = { type: effectiveActionType } as ActivityAction
    if (effectiveActionType === 'entity') {
      action.entity_id = this._editDraft.action_entity_id
      action.configured_entities = this._editDraft.action_configured_entities
    } else if (effectiveActionType === 'reset') {
      action.scope = this._editDraft.action_reset_scope
      if (this._editDraft.action_reset_scope === 'entities') {
        action.configured_entities = this._editDraft.action_configured_entities
      }
      if (this._editDraft.action_entity_targets.length > 0) {
        action.entity_targets = this._editDraft.action_entity_targets
      }
    } else if (effectiveActionType === 'simulation') {
      action.mode = 'presence_heatmap'
      action.template_activity = this._editDraft.action_sim_template_activity
      action.lux_mode = this._editDraft.action_sim_lux_mode
      action.frequency_mode = this._editDraft.action_sim_frequency_mode || 'normal'
      if (this._editDraft.action_sim_heatmap_profile_id) {
        action.heatmap_profile_id = this._editDraft.action_sim_heatmap_profile_id
      }
    } else if (effectiveActionType === 'slot') {
      if (Object.values(this._editDraft.action_excluded_slots).some(ids => ids.length > 0)) {
        action.excluded_slots = this._editDraft.action_excluded_slots
      }
      if (this._editDraft.action_respect_manual_off) {
        action.respect_manual_off = true
      }
    }

    const releaseType = effectiveActionType === 'reset' ? 'none' : this._editDraft.release_action_type
    const release_action = { type: releaseType } as ReleaseAction
    if (releaseType === 'activity') {
      release_action.activity = this._editDraft.release_activity
    }

    // Normalize the lenient duration input to strict HH:MM:SS — the backend
    // only parses that form (helpers.parse_hms); a bare "12" would silently
    // fall back to 0 (= no timer). The save-button guard already blocks
    // unparseable input, so this only shortens/pads valid entries.
    const autoExpire = this._editDraft.auto_expire === null
      ? null
      : normalizeDuration(this._editDraft.auto_expire)

    const newActivity: ActivityConfig = {
      id: rawId,
      name: activityName,
      suppress_inputs: effectiveActionType === 'reset' ? [] : this._editDraft.suppress_inputs,
      auto_expire_enabled: effectiveActionType === 'reset' ? false : this._editDraft.auto_expire_enabled,
      auto_expire: effectiveActionType === 'reset' ? null : autoExpire,
      transition_off_seconds: (effectiveActionType === 'block' || effectiveActionType === 'reset') ? null : this._editDraft.transition_off_seconds,
      action,
      release_action
    }

    this.dispatchEvent(new CustomEvent<ActivityConfig>('save', { detail: newActivity, bubbles: true, composed: true }))
  }

  render() {
    if (!this.open || !this._editDraft) return html``
    const draft = this._editDraft
    const isEditMode = this.editIndex !== null
    const isSaveDisabled = this._isSaveDisabled(draft)
    const fallbacks = this._getFallbackActivityInfo()
    // Routed through String() to defeat TS control-flow narrowing-by-alias:
    // a bare `draft.action_type` reference would let later
    // `draft.action_type === X` checks narrow this binding too, since both
    // would point at the same value.
    const effectiveActionType = String(draft.action_type) as ActivityActionType | ''

    return html`
      <div class="overlay" style="z-index: 1100;" @click=${(e: Event) => { if (e.target === e.currentTarget) this._cancel() }}>
        <div class="edit-panel" style="max-width: 640px; max-height: calc(100vh - 120px);">
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #a855f7;"></span>
            <span class="panel-header-title" role="heading" aria-level="2">${isEditMode ? this.t('activity_row_editor.edit_title', { name: draft.name || draft.id }) : this.t('activity_row_editor.add_title')}</span>
            <button class="panel-close" aria-label=${this.t('common.close_panel')} @click=${this._cancel}>✕</button>
          </div>

          <div class="panel-body" style="padding: 16px 20px;">
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div class="list-section-label">${this.t('activity_row_editor.general')}</div>
                <div class="form-field">
                  <span class="form-label">${this.t('activity_row_editor.activity_name')}</span>
                  <input
                    type="text"
                    class="activity-input"
                    .value=${draft.name || draft.id}
                    placeholder=${this.t('activity_row_editor.name_placeholder')}
                    @input=${(e: Event) => {
                      this._editDraft = { ...this._editDraft!, name: (e.target as HTMLInputElement).value }
                    }}
                  />
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div class="list-section-label">${this.t('activity_row_editor.light_control')}</div>
                <div class="form-field">
                  <span class="form-label">${this.t('activity_row_editor.action_type')}</span>
                  <select
                    class="option-select"
                    .value=${draft.action_type}
                    @change=${(e: Event) => {
                      // A turn-off list belongs to its action: a scene's list would end up in a reset.
                      this._editDraft = {
                        ...this._editDraft!,
                        action_type: (e.target as HTMLSelectElement).value as ActivityActionType | '',
                        action_configured_entities: [],
                      }
                    }}
                  >
                    <option value="">${this.t('activity_row_editor.action_none')}</option>
                    <option value="slot">${this.t('activity_row_editor.action_slot')}</option>
                    <option value="entity">${this.t('activity_row_editor.action_entity')}</option>
                    <option value="block">${this.t('activity_row_editor.action_block')}</option>
                    <option value="simulation">${this.t('activity_row_editor.action_simulation')}</option>
                    <option value="reset">${this.t('activity_row_editor.action_reset')}</option>
                  </select>
                </div>

                ${isActionType(effectiveActionType, 'slot') ? html`
                  <div class="form-field">
                    <span class="form-label">${this.t('activity_row_editor.channels_slots')}</span>
                    <twilight-slot-action-tree
                      .hass=${this.hass}
                      .channels=${this.channels}
                      .excludedSlotIds=${draft.action_excluded_slots}
                      @excluded-changed=${(e: CustomEvent) => {
                        this._editDraft = { ...this._editDraft!, action_excluded_slots: e.detail.value }
                      }}
                    ></twilight-slot-action-tree>
                  </div>
                  <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: var(--secondary-text-color); font-size: 13px; margin-top: 8px;">
                    <input
                      type="checkbox"
                      style="width: 16px; height: 16px; cursor: pointer;"
                      .checked=${draft.action_respect_manual_off}
                      @change=${(e: Event) => {
                        this._editDraft = { ...this._editDraft!, action_respect_manual_off: (e.target as HTMLInputElement).checked }
                      }}
                    />
                    ${this.t('activity_row_editor.respect_manual_off')}
                  </label>
                  <div class="form-hint" style="margin-left: 22px; margin-top: 2px;">
                    ${this.t('activity_row_editor.respect_manual_off_help')}
                  </div>
                ` : ''}

                ${isActionType(effectiveActionType, 'entity') ? html`
                  <div class="form-field">
                    <span class="form-label">${this.t('activity_row_editor.scene_script_entity')}</span>
                    <ha-entity-picker
                      .hass=${this.hass}
                      .value=${draft.action_entity_id}
                      .includeDomains=${['scene', 'script']}
                      .entityFilter=${this._sceneFilter(draft)}
                      allow-custom-entity
                      @value-changed=${(e: CustomEvent) => {
                        const entityId = e.detail.value ?? ''
                        if (entityId === this._editDraft!.action_entity_id) return
                        // A turn-off list belongs to its scene or script: nothing is
                        // extracted here, so an old list would apply to the new one.
                        this._editDraft = { ...this._editDraft!, action_entity_id: entityId, action_configured_entities: [] }
                      }}
                    ></ha-entity-picker>
                    <button class="turn-off-list-btn" @click=${() => { this._turnOffListOpen = true }}>
                      ${this.t('activity_row_editor.turn_off_entities', { count: draft.action_configured_entities.length })}
                    </button>
                    <div class="form-hint">${this.t('activity_row_editor.turn_off_entities_help')}</div>
                  </div>
                ` : ''}

                ${isActionType(effectiveActionType, 'reset') ? html`
                  <div class="form-field">
                    <span class="form-label">${this.t('activity_row_editor.reset_scope')}</span>
                    <select
                      class="option-select"
                      .value=${draft.action_reset_scope}
                      @change=${(e: Event) => {
                        this._editDraft = { ...this._editDraft!, action_reset_scope: (e.target as HTMLSelectElement).value as ResetScope }
                      }}
                    >
                      <option value="area">${this.t('activity_row_editor.reset_scope_area')}</option>
                      <option value="entities">${this.t('activity_row_editor.reset_scope_entities')}</option>
                    </select>
                    <div class="form-hint">
                      ${this.t(draft.action_reset_scope === 'entities' ? 'activity_row_editor.reset_scope_entities_help' : 'activity_row_editor.reset_scope_area_help')}
                    </div>
                    ${draft.action_reset_scope === 'entities' ? html`
                      <button class="turn-off-list-btn" @click=${() => { this._turnOffListOpen = true }}>
                        ${this.t('activity_row_editor.turn_off_entities', { count: draft.action_configured_entities.length })}
                      </button>
                    ` : ''}
                  </div>

                  <div class="form-field">
                    <span class="form-label">${this.t('activity_row_editor.additional_entities')}</span>
                    <table class="sensor-table">
                      <tbody>
                        ${draft.action_entity_targets.map((tgt, idx) => {
                          const domain = tgt.entity_id.split('.')[0]
                          const options = ENTITY_TARGET_ACTIONS[domain] ?? []
                          const friendlyName = this.hass?.states[tgt.entity_id]?.attributes?.friendly_name ?? tgt.entity_id
                          return html`
                            <tr class="sensor-row">
                              <td style="padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                                <div style="font-weight: 500; font-size: 13px;">${friendlyName}</div>
                                <div style="font-size: 11px; color: var(--secondary-text-color); font-family: monospace;">${tgt.entity_id}</div>
                              </td>
                              <td style="text-align: right; width: 170px; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                                <select
                                  class="option-select"
                                  style="width: 100%; min-width: 0;"
                                  @change=${(e: Event) => {
                                    const updated = [...this._editDraft!.action_entity_targets]
                                    updated[idx] = { ...tgt, action: (e.target as HTMLSelectElement).value as EntityTarget['action'] }
                                    this._editDraft = { ...this._editDraft!, action_entity_targets: updated }
                                  }}
                                >
                                  ${options.map(opt => html`<option value=${opt.value} ?selected=${opt.value === tgt.action}>${this.t(opt.labelKey)}</option>`)}
                                </select>
                              </td>
                              <td style="text-align: center; width: 40px; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                                <button class="sensor-remove-btn" title=${this.t('activity_row_editor.remove_entity')} aria-label=${this.t('activity_row_editor.remove_entity')} @click=${() => {
                                  this._editDraft = { ...this._editDraft!, action_entity_targets: this._editDraft!.action_entity_targets.filter((_, i) => i !== idx) }
                                }}>✕</button>
                              </td>
                            </tr>
                          `
                        })}
                        ${draft.action_entity_targets.length === 0 ? html`
                          <tr>
                            <td colspan="3" style="text-align: center; color: var(--secondary-text-color); font-style: italic; padding: 12px; font-size: 12px; border-bottom: 1px solid rgba(255,255,255,0.04);">
                              ${this.t('activity_row_editor.no_additional_entities')}
                            </td>
                          </tr>
                        ` : ''}
                      </tbody>
                    </table>

                    <ha-entity-picker
                      .hass=${this.hass}
                      .includeDomains=${['input_boolean', 'switch', 'script']}
                      allow-custom-entity
                      label=${this.t('activity_row_editor.add_entity_label')}
                      @value-changed=${(e: CustomEvent) => {
                        const val = e.detail.value
                        if (val) {
                          const targets = this._editDraft!.action_entity_targets
                          if (!targets.some(t => t.entity_id === val)) {
                            const domain = val.split('.')[0]
                            const defaultAction = ENTITY_TARGET_ACTIONS[domain]?.[0]?.value ?? 'off'
                            this._editDraft = {
                              ...this._editDraft!,
                              action_entity_targets: [...targets, { entity_id: val, action: defaultAction }],
                            }
                          }
                          const target = e.target as any
                          if (target) {
                            target.value = ''
                          }
                        }
                      }}
                    ></ha-entity-picker>
                  </div>
                ` : ''}

                ${isActionType(effectiveActionType, 'simulation') ? html`
                  <div class="form-field">
                    <span class="form-label">${this.t('activity_row_editor.template_activity')}</span>
                    <select
                      class="option-select"
                      .value=${draft.action_sim_template_activity}
                      @change=${(e: Event) => {
                        this._editDraft = { ...this._editDraft!, action_sim_template_activity: (e.target as HTMLSelectElement).value }
                      }}
                    >
                      <option value="">${this.t('activity_row_editor.select_activity_placeholder')}</option>
                      ${this._eligibleTemplateActivities().map(a => html`
                        <option value=${a.id} ?selected=${a.id === draft.action_sim_template_activity}>${a.id}</option>
                      `)}
                    </select>
                    <span class="form-hint">${this.t('activity_row_editor.template_hint')}</span>
                  </div>

                  <div class="form-field">
                    <span class="form-label">${this.t('activity_row_editor.heatmap_profile')}</span>
                    <select
                      class="option-select"
                      .value=${draft.action_sim_heatmap_profile_id}
                      @change=${(e: Event) => {
                        this._editDraft = { ...this._editDraft!, action_sim_heatmap_profile_id: (e.target as HTMLSelectElement).value }
                      }}
                    >
                      <option value="">${this.t('activity_row_editor.dynamic_last_30_days')}</option>
                      ${this.heatmapProfiles.map(p => html`
                        <option value=${p.id} ?selected=${p.id === draft.action_sim_heatmap_profile_id}>${p.name}</option>
                      `)}
                    </select>
                  </div>

                  <div class="form-field">
                    <span class="form-label">${this.t('activity_row_editor.simulation_intensity')}</span>
                    <select
                      class="option-select"
                      .value=${draft.action_sim_frequency_mode || 'normal'}
                      @change=${(e: Event) => {
                        this._editDraft = { ...this._editDraft!, action_sim_frequency_mode: (e.target as HTMLSelectElement).value as SimFrequencyMode }
                      }}
                    >
                      <option value="very_low">${this.t('activity_row_editor.intensity_very_subtle')}</option>
                      <option value="low">${this.t('activity_row_editor.intensity_subtle')}</option>
                      <option value="normal">${this.t('activity_row_editor.intensity_normal')}</option>
                      <option value="high">${this.t('activity_row_editor.intensity_active')}</option>
                      <option value="very_high">${this.t('activity_row_editor.intensity_very_active')}</option>
                    </select>
                    <span class="form-hint">${this.t('activity_row_editor.intensity_hint')}</span>
                  </div>

                  <div class="form-field">
                    <span class="form-label">${this.t('activity_row_editor.lux_mode')}</span>
                    <select
                      class="option-select"
                      .value=${draft.action_sim_lux_mode}
                      @change=${(e: Event) => {
                        this._editDraft = { ...this._editDraft!, action_sim_lux_mode: (e.target as HTMLSelectElement).value as SimLuxMode }
                      }}
                    >
                      <option value="threshold">${this.t('activity_row_editor.lux_mode_threshold')}</option>
                      <option value="dusk_dawn">${this.t('activity_row_editor.lux_mode_dusk_dawn')}</option>
                      <option value="always">${this.t('activity_row_editor.lux_mode_always')}</option>
                    </select>
                  </div>
                ` : ''}

                ${!isActionType(effectiveActionType, 'reset') ? html`
                  <div class="form-field">
                    <span class="form-label">${this.t('activity_row_editor.release_action')}</span>
                    <select
                      class="option-select"
                      .value=${draft.release_action_type}
                      @change=${(e: Event) => {
                        this._editDraft = { ...this._editDraft!, release_action_type: (e.target as HTMLSelectElement).value as ReleaseActionType }
                      }}
                    >
                      <option value="turn_off">${this.t('activity_row_editor.release_turn_off')}</option>
                      <option value="activity" ?disabled=${this._isReleaseTarget()}>${this.t('activity_row_editor.release_activity')}</option>
                      <option value="none">${this.t('activity_row_editor.release_none')}</option>
                    </select>
                    <div class="form-hint">${this.t(this._releaseHelpKey(draft))}</div>
                    ${this._isReleaseTarget() ? html`
                      <div class="form-hint">${this.t('activity_row_editor.release_target_in_use')}</div>
                    ` : ''}
                  </div>
                  ${draft.release_action_type === 'activity' ? html`
                    <div class="form-field">
                      <span class="form-label">${this.t('activity_row_editor.release_target')}</span>
                      <select
                        class="option-select"
                        .value=${draft.release_activity}
                        @change=${(e: Event) => {
                          this._editDraft = { ...this._editDraft!, release_activity: (e.target as HTMLSelectElement).value }
                        }}
                      >
                        <option value="">—</option>
                        ${this._eligibleReleaseTargets().map(a => html`
                          <option value=${a.id} ?selected=${a.id === draft.release_activity}>${a.name || a.id}</option>
                        `)}
                      </select>
                      ${draft.release_activity && !this._hasValidReleaseTarget(draft) ? html`
                        <div class="form-hint">${this.t('activity_row_editor.release_target_missing')}</div>
                      ` : ''}
                    </div>
                  ` : ''}
                ` : ''}
              </div>

              ${!isActionType(effectiveActionType, 'reset') ? html`
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div class="list-section-label">${this.t('activity_row_editor.timing')}</div>

                  <div class="form-field">
                    <label class="checkbox-item">
                      <input
                        type="checkbox"
                        ?checked=${draft.auto_expire_enabled}
                        @change=${(e: Event) => {
                          const enabled = (e.target as HTMLInputElement).checked
                          // Clear the duration when switching the timer off, so a
                          // half-typed/invalid value can't slip past the save guard
                          // (which only validates while enabled) and reappear later.
                          this._editDraft = {
                            ...this._editDraft!,
                            auto_expire_enabled: enabled,
                            ...(enabled ? {} : { auto_expire: null }),
                          }
                        }}
                      />
                      <span>${this.t('activity_row_editor.enable_auto_expire')}</span>
                    </label>
                  </div>

                  <div class="form-field">
                    <span class="form-label">${this.t('activity_row_editor.auto_expire_duration')}</span>
                    <input
                      type="text"
                      class="activity-input ${draft.auto_expire !== null && !isValidDurationInput(draft.auto_expire) ? 'invalid' : ''}"
                      ?disabled=${!draft.auto_expire_enabled}
                      .value=${draft.auto_expire ?? ''}
                      .placeholder=${fallbacks.auto_expire}
                      @input=${(e: Event) => {
                        this._editDraft = { ...this._editDraft!, auto_expire: (e.target as HTMLInputElement).value.trim() || null }
                      }}
                    />
                    <span class="form-hint">${this.t('activity_row_editor.duration_hint', { sec: '90', ms: '5:30' })}</span>
                    ${draft.auto_expire !== null && !isValidDurationInput(draft.auto_expire) ? html`
                      <span class="form-error">${this.t('activity_row_editor.duration_error')}</span>
                    ` : ''}
                  </div>

                  ${!isActionType(effectiveActionType, 'block') && !isActionType(effectiveActionType, 'reset') ? html`
                    <div class="form-field">
                      <span class="form-label">${this.t('activity_row_editor.transition_off_duration')}</span>
                      <input
                        type="number"
                        class="activity-input"
                        min="0"
                        max="300"
                        .placeholder=${String(fallbacks.transition_off_seconds)}
                        .value=${draft.transition_off_seconds != null ? String(draft.transition_off_seconds) : ''}
                        @input=${(e: Event) => {
                          const raw = (e.target as HTMLInputElement).value.trim()
                          this._editDraft = { ...this._editDraft!, transition_off_seconds: raw === '' ? null : (parseInt(raw, 10) || 0) }
                        }}
                      />
                    </div>
                  ` : ''}
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div class="list-section-label">${this.t('activity_row_editor.input_suppression')}</div>
                  <div class="form-field">
                    <span class="form-label">${this.t('activity_row_editor.suppression_hint')}</span>
                    <div class="checkbox-list">
                      ${this.inputs.map(input => {
                        const isChecked = draft.suppress_inputs.includes(input.id)
                        return html`
                          <label class="checkbox-item">
                            <input
                              type="checkbox"
                              ?checked=${isChecked}
                              @change=${(e: Event) => {
                                const checked = (e.target as HTMLInputElement).checked
                                const current = this._editDraft!.suppress_inputs
                                const next = checked ? [...current, input.id] : current.filter(id => id !== input.id)
                                this._editDraft = { ...this._editDraft!, suppress_inputs: next }
                              }}
                            />
                            <span>${getInputDisplayName(input, this.hass)} (${input.type})</span>
                          </label>
                        `
                      })}
                      ${this.inputs.length === 0 ? html`<div style="font-style: italic; opacity: 0.4; font-size: 11px;">${this.t('activity_row_editor.no_inputs_configured')}</div>` : ''}
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>

          <div class="panel-footer" style="gap: 12px;">
            <button class="btn-cancel-dialog" @click=${this._cancel}>${this.t('dialog.cancel')}</button>
            <button class="btn-add-primary" ?disabled=${isSaveDisabled} @click=${this._save}>${isEditMode ? this.t('dialog.save') : this.t('common.add')}</button>
          </div>
        </div>
      </div>

      <twilight-entity-list-dialog
        .open=${this._turnOffListOpen}
        .hass=${this.hass}
        .value=${draft.action_configured_entities}
        .entities=${this.entities}
        .areaId=${this.areaId}
        .areaName=${this.areaName}
        .help=${isActionType(effectiveActionType, 'reset') ? this.t('entity_list_dialog.help_reset') : ''}
        @save=${(e: CustomEvent<string[]>) => {
          this._editDraft = { ...this._editDraft!, action_configured_entities: e.detail }
          this._turnOffListOpen = false
        }}
        @close=${() => { this._turnOffListOpen = false }}
      ></twilight-entity-list-dialog>
    `
  }
}
