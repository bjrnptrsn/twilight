import { LitElement, html, css, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { type HomeAssistant, type InputConfig, type RuleConfig, type ActivityConfig } from '../lib/types'
import { dialogChromeStyles } from '../lib/shared-styles'
import { isValidTimeOfDay, normalizeTimeOfDay, DEFAULT_LUX_IGNORE_ACTIVE, DEFAULT_LUX_IGNORE_SCOPE } from '../lib/input-helpers'

/**
 * Sub-editor for a single input row (Add/Edit), extracted from inputs-dialog.ts.
 * Follows the slot-editor.ts pattern: the start value comes in via @property,
 * the component holds its own immutable `_editDraft`, and it emits the finished
 * `InputConfig` on save via a CustomEvent (`save` / `cancel`).
 */
import { TwilightLocalizeMixin } from '../lib/i18n'
import { FocusRestoreController } from '../lib/focus-restore-controller'

@customElement('twilight-input-row-editor')
export class TwilightInputRowEditor extends TwilightLocalizeMixin(LitElement) {
  private _focusRestore = new FocusRestoreController(this)
  @property({ type: Boolean }) open = false
  @property({ attribute: false }) hass: HomeAssistant | null = null
  /** Start value for the editor; cloned into `_editDraft` on open. */
  @property({ attribute: false }) input: InputConfig | null = null
  /** null = Add, number = Edit. Controls header/button labels only. */
  @property({ type: Number }) editIndex: number | null = null
  @property({ type: Array }) activities: string[] = []
  @property({ attribute: false }) activitiesConfig: ActivityConfig[] = []
  @property({ attribute: false }) rules: RuleConfig[] = []
  @property({ attribute: false }) placeholderDefaults: { lux_threshold?: number; lux_watch_window?: number } | null = null
  @property({ type: Boolean }) templateMode = false

  @state() private _editDraft: InputConfig | null = null

  static styles = [
    dialogChromeStyles,
    css`
      :host {
        display: contents;
      }

      .panel-body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
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

      .form-hint {
        display: block;
        margin-top: 4px;
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
        display: block;
        margin-top: 4px;
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
      .activity-input.invalid {
        border-color: var(--error-color, #db4437);
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
    `
  ]

  willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has('open') || changedProperties.has('input')) {
      if (this.open && this.input) {
        // Clone the incoming value into the internal immutable draft.
        this._editDraft = { ...this.input }
      } else if (!this.open) {
        this._editDraft = null
      }
    }
  }

  private _cancel() {
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }))
  }

  // Rules need a stateful input to evaluate as active/inactive (RunState.inputs_active).
  // Only binary and toggle-mode button inputs maintain that state reliably today —
  // motion/event/timer/click-button never (or only incidentally) update it, so a
  // rule-targeting input of those types would silently never trigger its rule.
  private _canTargetRule(draft: InputConfig): boolean {
    return draft.type === 'binary' || (draft.type === 'button' && draft.button_mode === 'toggle')
  }

  private _isSaveDisabled(draft: InputConfig): boolean {
    const entityMissing = !this.templateMode && draft.type !== 'timer' && draft.type !== 'button' && (!draft.entity_ids || draft.entity_ids.length === 0)
    const timerInvalid = draft.type === 'timer' && !isValidTimeOfDay(draft.trigger_time ?? '')
    const targetMissing = !draft.activity && !draft.rule
    // Guards a pre-existing input that already carries a rule target of a type
    // that can no longer set one (e.g. edited before this restriction existed).
    const invalidRuleTarget = !!draft.rule && !this._canTargetRule(draft)
    return entityMissing || timerInvalid || targetMissing || invalidRuleTarget
  }

  private _save() {
    if (!this._editDraft) return
    if (this._isSaveDisabled(this._editDraft)) return

    const newInput: InputConfig = {
      ...this._editDraft,
      enabled: this.templateMode ? true : this._editDraft.enabled,
    }

    // Clean up fields based on type
    if (newInput.type === 'timer') {
      // Normalize the lenient time input to strict HH:MM:SS — the backend only
      // parses that form (helpers.parse_hms_parts); "22" or "22:30" would be
      // rejected and the timer silently never fires. The save-button guard
      // already blocks invalid input, so this only pads valid entries.
      newInput.trigger_time = normalizeTimeOfDay(newInput.trigger_time ?? '') ?? '00:00:00'
      delete newInput.entity_ids
      delete newInput.aggregation
      delete newInput.aggregation_count
      delete newInput.retrigger
      delete newInput.event_type
      delete newInput.lux_threshold
      delete newInput.lux_watch_window
      delete newInput.lux_ignore_active
      delete newInput.lux_ignore_scope
      delete newInput.label
      delete newInput.button_mode
      delete newInput.create_entity
    } else if (newInput.type === 'button') {
      delete newInput.entity_ids
      delete newInput.aggregation
      delete newInput.aggregation_count
      delete newInput.retrigger
      delete newInput.event_type
      delete newInput.lux_threshold
      delete newInput.lux_watch_window
      delete newInput.lux_ignore_active
      delete newInput.lux_ignore_scope
    } else {
      delete newInput.trigger_time
      delete newInput.label
      delete newInput.button_mode
      delete newInput.create_entity
      if (newInput.type !== 'event') {
        delete newInput.event_type
      }
      if (newInput.type !== 'motion') {
        delete newInput.lux_threshold
        delete newInput.lux_watch_window
        delete newInput.lux_ignore_active
        delete newInput.lux_ignore_scope
      }
      // retrigger is motion-only; aggregation/count are binary-only.
      if (newInput.type !== 'motion') {
        delete newInput.retrigger
      }
      if (newInput.type !== 'binary') {
        delete newInput.aggregation
        delete newInput.aggregation_count
      }
    }

    // An empty name stays unset — display-time fallback is getInputDisplayName().
    if (!newInput.name || !newInput.name.trim()) {
      delete newInput.name
    } else {
      newInput.name = newInput.name.trim()
    }

    this.dispatchEvent(new CustomEvent<InputConfig>('save', { detail: newInput, bubbles: true, composed: true }))
  }

  private _getIncludeDomains(type: 'binary' | 'event' | 'motion' | 'timer' | 'button'): string[] {
    if (type === 'binary') return ['input_boolean', 'binary_sensor', 'switch', 'sensor']
    if (type === 'event') return ['event']
    if (type === 'motion') return ['binary_sensor', 'device_tracker', 'sensor', 'input_boolean', 'switch']
    return []
  }

  render() {
    if (!this.open || !this._editDraft) return html``
    const draft = this._editDraft
    const isEditMode = this.editIndex !== null
    const isSaveDisabled = this._isSaveDisabled(draft)
    const includeDomains = this._getIncludeDomains(draft.type)
    const firstEntityId = draft.entity_ids?.[0] || ''
    const eventTypes = (draft.type === 'event' && firstEntityId && this.hass?.states[firstEntityId]?.attributes?.event_types) || []

    return html`
      <div class="overlay" style="z-index: 1100;" @click=${(e: Event) => { if (e.target === e.currentTarget) this._cancel() }}>
        <div class="edit-panel" style="max-width: 560px; max-height: calc(100vh - 120px);">
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #10b981;"></span>
            <span class="panel-header-title" role="heading" aria-level="2">${isEditMode ? this.t('input_row_editor.edit_title') : this.t('input_row_editor.add_title')}</span>
            <button class="panel-close" aria-label=${this.t('common.close_panel')} @click=${this._cancel}>✕</button>
          </div>

          <div class="panel-body" style="padding: 16px 20px;">
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div class="form-field">
                <span class="form-label">${this.t('input_row_editor.name_optional')}</span>
                <input
                  type="text"
                  class="activity-input"
                  placeholder=${this.t('input_row_editor.name_placeholder')}
                  .value=${draft.name ?? ''}
                  @input=${(e: Event) => {
                    const val = (e.target as HTMLInputElement).value
                    this._editDraft = { ...this._editDraft!, name: val || undefined }
                  }}
                />
              </div>

              ${this.templateMode ? '' : html`
                <div class="form-field">
                  <span class="form-label">${this.t('input_row_editor.status')}</span>
                  <select class="option-select" .value=${draft.enabled !== false ? 'true' : 'false'} @change=${(e: Event) => {
                    this._editDraft = { ...this._editDraft!, enabled: (e.target as HTMLSelectElement).value === 'true' }
                  }}>
                    <option value="true">${this.t('input_row_editor.enabled')}</option>
                    <option value="false">${this.t('input_row_editor.disabled')}</option>
                  </select>
                </div>
              `}

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="form-field">
                  <span class="form-label">${this.t('input_row_editor.type')}</span>
                  <select class="option-select" .value=${draft.type} @change=${(e: Event) => {
                    const newType = (e.target as HTMLSelectElement).value as 'binary' | 'event' | 'motion' | 'timer' | 'button'
                    // Type changed to one that can't target a rule (click-mode button is the
                    // default for 'button') — fall back to activity so the input doesn't save
                    // with a rule target it can never trigger.
                    const stillCanTargetRule = newType === 'binary'
                    this._editDraft = {
                      ...this._editDraft!,
                      type: newType,
                      entity_ids: [],
                      aggregation: undefined,
                      aggregation_count: undefined,
                      retrigger: undefined,
                      event_type: undefined,
                      lux_threshold: null,
                      lux_watch_window: null,
                      lux_ignore_active: null,
                      lux_ignore_scope: null,
                      trigger_time: '00:00:00',
                      label: '',
                      button_mode: 'click',
                      ...(this._editDraft?.rule && !stillCanTargetRule
                        ? { rule: null, activity: this.activities[0] ?? null }
                        : {}),
                    }
                  }}>
                    <option value="binary">${this.t('input_row_editor.type_binary')}</option>
                    <option value="button">${this.t('input_row_editor.type_button')}</option>
                    <option value="event">${this.t('input_row_editor.type_event')}</option>
                    <option value="motion">${this.t('input_row_editor.type_motion')}</option>
                    <option value="timer">${this.t('input_row_editor.type_timer')}</option>
                  </select>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="form-field">
                    <span class="form-label">${this.t('input_row_editor.target_type')}</span>
                    <select class="option-select" .value=${draft.rule ? 'rule' : 'activity'} @change=${(e: Event) => {
                      const type = (e.target as HTMLSelectElement).value
                      if (type === 'rule') {
                        const defaultRule = this.rules[0]?.id ?? ''
                        this._editDraft = { ...this._editDraft!, rule: defaultRule, activity: null }
                      } else {
                        const defaultAct = this.activities[0] ?? ''
                        this._editDraft = { ...this._editDraft!, activity: defaultAct, rule: null }
                      }
                    }}>
                      <option value="activity">${this.t('input_row_editor.target_activity')}</option>
                      ${this._canTargetRule(draft) ? html`
                        <option value="rule" ?disabled=${(this.rules || []).length === 0}>${this.t('input_row_editor.target_rule')}${(this.rules || []).length === 0 ? this.t('input_row_editor.no_rules') : ''}</option>
                      ` : ''}
                    </select>
                  </div>

                  ${draft.rule ? html`
                    <div class="form-field">
                      <span class="form-label">${this.t('input_row_editor.target_rule_field')}</span>
                      <select class="option-select" .value=${draft.rule ?? ''} @change=${(e: Event) => {
                        this._editDraft = { ...this._editDraft!, rule: (e.target as HTMLSelectElement).value, activity: null }
                      }}>
                        ${(this.rules || []).map(r => html`
                          <option value="${r.id}" ?selected=${r.id === draft.rule}>${r.name || r.id}</option>
                        `)}
                      </select>
                    </div>
                  ` : html`
                    <div class="form-field">
                      <span class="form-label">${this.t('input_row_editor.target_activity_field')}</span>
                      <select class="option-select" @change=${(e: Event) => {
                        this._editDraft = { ...this._editDraft!, activity: (e.target as HTMLSelectElement).value, rule: null }
                      }}>
                        ${this.activities.map(actId => {
                          const found = (this.activitiesConfig || []).find(a => a.id === actId)
                          return html`<option value="${actId}" ?selected=${actId === draft.activity}>${found?.name || found?.id || actId}</option>`
                        })}
                      </select>
                    </div>
                  `}
                </div>
              </div>

              ${draft.type === 'timer' ? html`
                <div class="form-field">
                  <span class="form-label">${this.t('input_row_editor.trigger_time')}</span>
                  <input
                    type="text"
                    class="activity-input ${!isValidTimeOfDay(draft.trigger_time ?? '') ? 'invalid' : ''}"
                    .value=${draft.trigger_time ?? '00:00:00'}
                    placeholder=${this.t('input_row_editor.trigger_time_placeholder')}
                    @input=${(e: Event) => {
                      this._editDraft = { ...this._editDraft!, trigger_time: (e.target as HTMLInputElement).value.trim() }
                    }}
                  />
                  <span class="form-hint">${this.t('input_row_editor.trigger_time_hint', { a: '22', b: '22:30', c: '22:30:15' })}</span>
                  ${!isValidTimeOfDay(draft.trigger_time ?? '') ? html`
                    <span class="form-error">${this.t('input_row_editor.trigger_time_error')}</span>
                  ` : ''}
                </div>
              ` : draft.type === 'button' ? html`
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="form-field">
                    <span class="form-label">${this.t('input_row_editor.label_optional')}</span>
                    <input
                      type="text"
                      class="activity-input"
                      placeholder=${this.t('input_row_editor.label_placeholder')}
                      .value=${draft.label ?? ''}
                      @input=${(e: Event) => {
                        this._editDraft = { ...this._editDraft!, label: (e.target as HTMLInputElement).value }
                      }}
                    />
                  </div>
                  <div class="form-field">
                    <span class="form-label">${this.t('input_row_editor.mode')}</span>
                    <select class="option-select" .value=${draft.button_mode ?? 'click'} @change=${(e: Event) => {
                      const newMode = (e.target as HTMLSelectElement).value as 'click' | 'toggle'
                      this._editDraft = {
                        ...this._editDraft!,
                        button_mode: newMode,
                        // Click-mode buttons can't reliably drive a rule (see _canTargetRule) —
                        // fall back to activity so we don't save an unreachable rule target.
                        ...(this._editDraft?.rule && newMode === 'click'
                          ? { rule: null, activity: this.activities[0] ?? null }
                          : {}),
                      }
                    }}>
                      <option value="click">${this.t('input_row_editor.mode_click')}</option>
                      <option value="toggle">${this.t('input_row_editor.mode_toggle')}</option>
                    </select>
                  </div>
                  <div class="form-field" style="grid-column: 1 / -1;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                      <input
                        type="checkbox"
                        ?checked=${draft.create_entity ?? false}
                        @change=${(e: Event) => {
                          this._editDraft = { ...this._editDraft!, create_entity: (e.target as HTMLInputElement).checked }
                        }}
                      />
                      <span class="form-label" style="margin: 0;">${this.t('input_row_editor.create_entity')}</span>
                    </label>
                    <div style="font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;">
                      ${this.t('input_row_editor.create_entity_desc', { entity: draft.button_mode === 'toggle' ? this.t('input_row_editor.entity_switch') : this.t('input_row_editor.entity_button') })}
                    </div>
                  </div>
                </div>
              ` : (this.templateMode ? '' : html`
                <div class="form-field">
                  <span class="form-label">${this.t('input_row_editor.entities')}</span>
                  <table class="sensor-table">
                    <tbody>
                      ${(draft.entity_ids || []).map((entityId, index) => {
                        const friendlyName = this.hass?.states[entityId]?.attributes?.friendly_name ?? entityId
                        return html`
                          <tr class="sensor-row">
                            <td style="padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                              <div style="font-weight: 500; font-size: 13px;">${friendlyName}</div>
                              <div style="font-size: 11px; color: var(--secondary-text-color); font-family: monospace;">${entityId}</div>
                            </td>
                            <td style="text-align: center; width: 40px; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                              <button class="sensor-remove-btn" title=${this.t('input_row_editor.remove_entity')} aria-label=${this.t('input_row_editor.remove_entity')} @click=${() => {
                                this._editDraft = { ...this._editDraft!, entity_ids: (this._editDraft!.entity_ids || []).filter((_, i) => i !== index) }
                              }}>✕</button>
                            </td>
                          </tr>
                        `
                      })}
                      ${(!draft.entity_ids || draft.entity_ids.length === 0) ? html`
                        <tr>
                          <td colspan="2" style="text-align: center; color: var(--secondary-text-color); font-style: italic; padding: 12px; font-size: 12px; border-bottom: 1px solid rgba(255,255,255,0.04);">
                            ${this.t('input_row_editor.no_entities_configured')}
                          </td>
                        </tr>
                      ` : ''}
                    </tbody>
                  </table>

                  <ha-entity-picker
                    .hass=${this.hass}
                    .includeDomains=${includeDomains}
                    allow-custom-entity
                    label=${this.t('input_row_editor.add_input_entity')}
                    @value-changed=${(e: CustomEvent) => {
                      const val = e.detail.value
                      if (val) {
                        const ids = this._editDraft!.entity_ids || []
                        if (!ids.includes(val)) {
                          this._editDraft = { ...this._editDraft!, entity_ids: [...ids, val] }
                        }
                        const target = e.target as any
                        if (target) {
                          target.value = ''
                        }
                      }
                    }}
                  ></ha-entity-picker>
                </div>
              `)}

              ${draft.type === 'motion' ? html`
                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">${this.t('input_row_editor.retrigger')}</span>
                  <select class="option-select" .value=${draft.retrigger ?? 'every'} @change=${(e: Event) => {
                    this._editDraft = { ...this._editDraft!, retrigger: ((e.target as HTMLSelectElement).value || undefined) as 'every' | 'first' | undefined }
                  }}>
                    <option value="every">${this.t('input_row_editor.retrigger_every')}</option>
                    <option value="first">${this.t('input_row_editor.retrigger_first')}</option>
                  </select>
                  <span class="form-hint">${this.t('input_row_editor.retrigger_hint')}</span>
                </div>
              ` : ''}

              ${draft.type === 'binary' ? html`
                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">${this.t('input_row_editor.combine_sensors')}</span>
                  <select class="option-select" .value=${draft.aggregation ?? 'any'} @change=${(e: Event) => {
                    const agg = ((e.target as HTMLSelectElement).value || undefined) as 'any' | 'all' | 'count' | undefined
                    this._editDraft = {
                      ...this._editDraft!,
                      aggregation: agg,
                      aggregation_count: agg !== 'count' ? undefined : this._editDraft!.aggregation_count,
                    }
                  }}>
                    <option value="any">${this.t('input_row_editor.aggregation_any')}</option>
                    <option value="all">${this.t('input_row_editor.aggregation_all')}</option>
                    <option value="count">${this.t('input_row_editor.aggregation_count')}</option>
                  </select>
                  <span class="form-hint">${this.t('input_row_editor.aggregation_hint')}</span>
                </div>

                ${draft.aggregation === 'count' ? html`
                  <div class="form-field" style="margin-top: 4px;">
                    <span class="form-label">${this.t('input_row_editor.required_active_entities')}</span>
                    <input
                      type="number"
                      class="activity-input"
                      min="1"
                      .max=${String(Math.max(1, (draft.entity_ids || []).length))}
                      .value=${draft.aggregation_count != null ? String(draft.aggregation_count) : '1'}
                      @input=${(e: Event) => {
                        const val = (e.target as HTMLInputElement).value
                        this._editDraft = { ...this._editDraft!, aggregation_count: val !== '' ? Number(val) : 1 }
                      }}
                    />
                  </div>
                ` : ''}
              ` : ''}

              ${draft.type === 'event' && (draft.entity_ids || []).length > 0 ? html`
                <div class="form-field">
                  <span class="form-label">${this.t('input_row_editor.event_type_optional')}</span>
                  ${eventTypes.length > 0 ? html`
                    <select class="option-select" @change=${(e: Event) => {
                      this._editDraft = { ...this._editDraft!, event_type: (e.target as HTMLSelectElement).value || undefined }
                    }}>
                      <option value="" ?selected=${!draft.event_type}>${this.t('input_row_editor.all_events')}</option>
                      ${eventTypes.map((et: string) => html`
                        <option value="${et}" ?selected=${et === draft.event_type}>${et}</option>
                      `)}
                    </select>
                  ` : html`
                    <input
                      type="text"
                      class="activity-input"
                      placeholder=${this.t('input_row_editor.all_events')}
                      .value=${draft.event_type ?? ''}
                      @input=${(e: Event) => {
                        this._editDraft = { ...this._editDraft!, event_type: (e.target as HTMLInputElement).value.trim() || undefined }
                      }}
                    />
                  `}
                </div>
              ` : ''}

              ${draft.type === 'motion' ? html`
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="form-field">
                    <span class="form-label">${this.t('input_row_editor.lux_threshold')}</span>
                    <input
                      type="number"
                      class="activity-input"
                      .placeholder=${String(this.placeholderDefaults?.lux_threshold ?? 30)}
                      .value=${draft.lux_threshold !== null ? String(draft.lux_threshold) : ''}
                      @input=${(e: Event) => {
                        const val = (e.target as HTMLInputElement).value
                        this._editDraft = { ...this._editDraft!, lux_threshold: val !== '' ? Number(val) : null }
                      }}
                      min="0"
                    />
                  </div>

                  <div class="form-field">
                    <span class="form-label">${this.t('input_row_editor.lux_watch')}</span>
                    <input
                      type="number"
                      class="activity-input"
                      .placeholder=${String(this.placeholderDefaults?.lux_watch_window ?? 10)}
                      .value=${draft.lux_watch_window !== null ? String(draft.lux_watch_window) : ''}
                      @input=${(e: Event) => {
                        const val = (e.target as HTMLInputElement).value
                        this._editDraft = { ...this._editDraft!, lux_watch_window: val !== '' ? Number(val) : null }
                      }}
                      min="0"
                    />
                  </div>
                </div>

                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">${this.t('input_row_editor.ignore_lux_scene_active')}</span>
                  <select class="option-select" .value=${String(draft.lux_ignore_active)} @change=${(e: Event) => {
                    const val = (e.target as HTMLSelectElement).value
                    this._editDraft = { ...this._editDraft!, lux_ignore_active: val === 'true' }
                  }}>
                    <option value="true">${this.t('input_row_editor.yes')}</option>
                    <option value="false">${this.t('input_row_editor.no')}</option>
                  </select>
                </div>

                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">${this.t('input_row_editor.ignore_lux_during')}</span>
                  <select class="option-select" .value=${draft.lux_ignore_scope ?? 'none'} @change=${(e: Event) => {
                    const val = (e.target as HTMLSelectElement).value
                    this._editDraft = { ...this._editDraft!, lux_ignore_scope: val as 'none' | 'twilight_slots' | 'all_slots' }
                  }}>
                    <option value="none">${this.t('input_row_editor.ignore_scope_none')}</option>
                    <option value="twilight_slots">${this.t('input_row_editor.ignore_scope_twilight')}</option>
                    <option value="all_slots">${this.t('input_row_editor.ignore_scope_all')}</option>
                  </select>
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
    `
  }
}

/** Default `InputConfig` for the Add flow. */
export function makeNewInput(defaultActivity: string): InputConfig {
  return {
    id: '',
    name: undefined,
    type: 'binary',
    activity: defaultActivity,
    enabled: true,
    entity_ids: [],
    aggregation: undefined,
    aggregation_count: undefined,
    retrigger: undefined,
    trigger_time: '00:00:00',
    event_type: undefined,
    lux_threshold: null,
    lux_watch_window: null,
    lux_ignore_active: DEFAULT_LUX_IGNORE_ACTIVE,
    lux_ignore_scope: DEFAULT_LUX_IGNORE_SCOPE,
    label: '',
    button_mode: 'click',
    create_entity: false,
  }
}
