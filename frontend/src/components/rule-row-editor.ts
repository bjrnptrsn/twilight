import { LitElement, html, css, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { type RuleConfig, type InputConfig, type ActivityConfig, type ChannelConfig, type RuleAutoExpireMode, type HomeAssistant } from '../lib/types'
import { activityBadgeStyles, dialogChromeStyles } from '../lib/shared-styles'
import { getInputDisplayName } from '../lib/input-helpers'
import {
  getActivitySupportsExcludedSlots,
  getActivitySupportsAutoExpire,
  getActivitySupportsBorrowedAutoExpire,
  getActivitySupportsInputSuppression,
  getActivityHasRuleSupport,
} from '../lib/activity-helpers'
import './slot-action-tree'

/**
 * Sub-editor for a single rule row (Add/Edit), matching activity-row-editor.ts pattern.
 * Each rule targets 1 activity and configures its slot overrides.
 * Emits 'save' with the updated RuleConfig, or 'cancel'.
 */
import { TwilightLocalizeMixin } from '../lib/i18n'
import { FocusRestoreController } from '../lib/focus-restore-controller'

@customElement('twilight-rule-row-editor')
export class TwilightRuleRowEditor extends TwilightLocalizeMixin(LitElement) {
  private _focusRestore = new FocusRestoreController(this)
  @property({ type: Boolean }) open = false
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ attribute: false }) rule: RuleConfig | null = null
  @property({ type: Number }) editIndex: number | null = null
  @property({ attribute: false }) inputsConfig: InputConfig[] = []
  @property({ attribute: false }) activitiesConfig: ActivityConfig[] = []
  @property({ attribute: false }) channels: Record<string, ChannelConfig> = {}
  @property({ attribute: false }) siblings: RuleConfig[] = []

  @state() private _editDraft: RuleConfig | null = null

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
        gap: 8px;
        font-size: 13px;
        cursor: pointer;
      }
    `
  ]

  protected updated(changedProperties: PropertyValues) {
    if (changedProperties.has('open') || changedProperties.has('rule')) {
      if (this.open && this.rule) {
        this._editDraft = structuredClone(this.rule)
        const eligibleActivities = (this.activitiesConfig || []).filter(getActivityHasRuleSupport)
        const fallbackActivities = (this.activitiesConfig || []).map(a => a.id)
        const defaultAct = eligibleActivities[0]?.id || fallbackActivities[0] || 'motion'
        if (!this._editDraft.applied_activities || this._editDraft.applied_activities.length === 0) {
          this._editDraft.applied_activities = [defaultAct]
        }
        if (!this._editDraft.suppressed_inputs_override) {
          this._editDraft.suppressed_inputs_override = []
        }
      } else if (!this.open) {
        this._editDraft = null
      }
    }
  }

  private _onSlotOverridesChanged(actId: string, overrides: Record<string, string[]>) {
    if (!this._editDraft) return
    this._editDraft = {
      ...this._editDraft,
      applied_activities: [actId],
      excluded_slots_override: {
        ...(this._editDraft.excluded_slots_override || {}),
        [actId]: overrides,
      },
    }
    this.requestUpdate()
  }

  private _cancel() {
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }))
  }

  private _save() {
    if (!this._editDraft) return

    const eligibleActivities = (this.activitiesConfig || []).filter(getActivityHasRuleSupport)
    const fallbackActivities = (this.activitiesConfig || []).map(a => a.id)
    const selectedActivity = (this._editDraft.applied_activities && this._editDraft.applied_activities.length > 0)
      ? this._editDraft.applied_activities[0]
      : (eligibleActivities[0]?.id || fallbackActivities[0] || 'motion')

    const selectedActivityObj = (this.activitiesConfig || []).find(a => a.id === selectedActivity)
    const supportsAutoExpire = getActivitySupportsAutoExpire(selectedActivityObj)
    const supportsBorrowedAutoExpire = getActivitySupportsBorrowedAutoExpire(selectedActivityObj)
    const supportsExcludedSlots = getActivitySupportsExcludedSlots(selectedActivityObj)

    let ruleToSave: RuleConfig = {
      ...this._editDraft,
      applied_activities: [selectedActivity],
      suppressed_inputs_override: this._editDraft.suppressed_inputs_override || [],
      // An explicit save through this editor is a deliberate user action —
      // whatever the previous auto-disable reason was, it no longer applies.
      auto_disabled_reason: null,
    }

    if (!supportsExcludedSlots) {
      ruleToSave.respect_manual_off_override = null
    }

    if (supportsAutoExpire) {
      ruleToSave.auto_expire_enabled = null
      ruleToSave.auto_expire = null
    } else if (supportsBorrowedAutoExpire) {
      ruleToSave.auto_expire_mode = 'none'
    } else {
      ruleToSave.auto_expire_mode = 'none'
      ruleToSave.auto_expire_enabled = null
      ruleToSave.auto_expire = null
    }

    if (!ruleToSave.id) {
      const existing = new Set((this.siblings || []).map(r => r.id))
      let candidate = `rule_${Array.from({length: 8}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
      while (existing.has(candidate)) {
        candidate = `rule_${Array.from({length: 8}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
      }
      ruleToSave.id = candidate
    }

    this.dispatchEvent(
      new CustomEvent('save', {
        detail: ruleToSave,
        bubbles: true,
        composed: true,
      })
    )
  }

  render() {
    if (!this.open || !this._editDraft) return html``

    const draft = this._editDraft
    const isEditMode = this.editIndex !== null
    const isSaveDisabled = !draft.name?.trim()
    
    const eligibleActivities = (this.activitiesConfig || []).filter(getActivityHasRuleSupport)
    const fallbackActivities = (this.activitiesConfig || []).map(a => a.id)
    const selectedActivity = (draft.applied_activities && draft.applied_activities.length > 0)
      ? draft.applied_activities[0]
      : (eligibleActivities[0]?.id || fallbackActivities[0] || 'motion')

    const selectedActivityObj = (this.activitiesConfig || []).find(a => a.id === selectedActivity)
    const supportsAutoExpire = getActivitySupportsAutoExpire(selectedActivityObj)
    const supportsBorrowedAutoExpire = getActivitySupportsBorrowedAutoExpire(selectedActivityObj)
    const supportsInputSuppression = getActivitySupportsInputSuppression(selectedActivityObj)
    // Same capability as excluded slots — part of the SlotAction (also gates
    // the "Manual Off" section below).
    const supportsExcludedSlots = getActivitySupportsExcludedSlots(selectedActivityObj)

    const dropdownOptions = [...eligibleActivities]
    if (selectedActivityObj && !dropdownOptions.some(a => a.id === selectedActivity)) {
      dropdownOptions.push(selectedActivityObj)
    }

    const suppressedInputs = draft.suppressed_inputs_override || []
    const selectableInputs = (this.inputsConfig || []).filter(inp => !draft.id || inp.rule !== draft.id)

    return html`
      <div class="overlay" @click=${(e: Event) => { if (e.target === e.currentTarget) this._cancel() }}>
        <div class="edit-panel" style="max-width: 650px;" @click=${(e: Event) => e.stopPropagation()}>
          <div class="panel-header">
            <span class="panel-header-title" role="heading" aria-level="2">${isEditMode ? this.t('rule_row_editor.edit_title', { name: draft.name || draft.id }) : this.t('rule_row_editor.add_title')}</span>
            <button class="panel-close" aria-label=${this.t('common.close_panel')} @click=${this._cancel}>✕</button>
          </div>

          <div class="panel-body">
            <div class="form-field">
              <div class="list-section-label">${this.t('rule_row_editor.general')}</div>
              <span class="form-label">${this.t('rule_row_editor.rule_name')}</span>
              <input
                type="text"
                class="activity-input"
                placeholder=${this.t('rule_row_editor.name_placeholder')}
                .value=${draft.name || ''}
                @input=${(e: Event) => {
                  this._editDraft = { ...this._editDraft!, name: (e.target as HTMLInputElement).value }
                }}
              />
            </div>

            <div class="form-field">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input
                  type="checkbox"
                  ?checked=${draft.enabled ?? true}
                  @change=${(e: Event) => {
                    this._editDraft = { ...this._editDraft!, enabled: (e.target as HTMLInputElement).checked }
                  }}
                />
                <span class="form-label" style="margin: 0;">${this.t('rule_row_editor.enable_rule')}</span>
              </label>
            </div>

            <div class="form-field">
              <div class="list-section-label">${this.t('rule_row_editor.target_activity_excluded_slots')}</div>
              <span class="form-label">${this.t('rule_row_editor.target_activity')}</span>
              <select class="option-select" .value=${selectedActivity} @change=${(e: Event) => {
                const actId = (e.target as HTMLSelectElement).value
                this._editDraft = {
                  ...this._editDraft!,
                  applied_activities: [actId],
                }
              }}>
                ${dropdownOptions.map(act => {
                  return html`<option value="${act.id}" ?selected=${act.id === selectedActivity}>${act.name || act.id}</option>`
                })}
              </select>
              <span class="form-hint">${this.t('rule_row_editor.target_activity_hint')}</span>
            </div>

            ${supportsExcludedSlots ? html`
              <div class="form-field">
                <span class="form-label">${this.t('rule_row_editor.respect_manual_off')}</span>
                <select class="option-select" .value=${draft.respect_manual_off_override === true ? 'true' : (draft.respect_manual_off_override === false ? 'false' : 'null')} @change=${(e: Event) => {
                  const val = (e.target as HTMLSelectElement).value
                  const override = val === 'true' ? true : (val === 'false' ? false : null)
                  this._editDraft = {
                    ...this._editDraft!,
                    respect_manual_off_override: override,
                  }
                }}>
                  <option value="null" ?selected=${draft.respect_manual_off_override === undefined || draft.respect_manual_off_override === null}>${this.t('rule_row_editor.manual_off_default')}</option>
                  <option value="true" ?selected=${draft.respect_manual_off_override === true}>${this.t('rule_row_editor.manual_off_respect')}</option>
                  <option value="false" ?selected=${draft.respect_manual_off_override === false}>${this.t('rule_row_editor.manual_off_ignore')}</option>
                </select>
                <span class="form-hint">${this.t('rule_row_editor.respect_manual_off_hint')}</span>
              </div>
            ` : ''}

            ${supportsAutoExpire ? html`
              <div class="form-field">
                <span class="form-label">${this.t('rule_row_editor.auto_expire_behavior')}</span>
                <select class="option-select" .value=${draft.auto_expire_mode || 'none'} @change=${(e: Event) => {
                  const mode = (e.target as HTMLSelectElement).value as RuleAutoExpireMode
                  this._editDraft = {
                    ...this._editDraft!,
                    auto_expire_mode: mode,
                  }
                }}>
                  <option value="none" ?selected=${(draft.auto_expire_mode || 'none') === 'none'}>${this.t('rule_row_editor.mode_none')}</option>
                  <option value="pause" ?selected=${draft.auto_expire_mode === 'pause'}>${this.t('rule_row_editor.mode_pause')}</option>
                  <option value="suspend" ?selected=${draft.auto_expire_mode === 'suspend'}>${this.t('rule_row_editor.mode_suspend')}</option>
                  <option value="restart" ?selected=${draft.auto_expire_mode === 'restart'}>${this.t('rule_row_editor.mode_restart')}</option>
                </select>
                <span class="form-hint">${this.t('rule_row_editor.auto_expire_behavior_hint')}</span>
              </div>
            ` : ''}

            ${supportsBorrowedAutoExpire ? html`
              <div class="form-field">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input
                    type="checkbox"
                    ?checked=${draft.auto_expire_enabled === true}
                    @change=${(e: Event) => {
                      const checked = (e.target as HTMLInputElement).checked
                      this._editDraft = {
                        ...this._editDraft!,
                        auto_expire_enabled: checked,
                        auto_expire: checked ? (this._editDraft?.auto_expire || '') : null,
                      }
                    }}
                  />
                  <span class="form-label" style="margin: 0;">${this.t('rule_row_editor.enable_auto_expire')}</span>
                </label>
                <span class="form-hint">${this.t('rule_row_editor.borrowed_auto_expire_hint')}</span>
              </div>

              <div class="form-field">
                <span class="form-label">${this.t('rule_row_editor.auto_expire_duration')}</span>
                <input
                  type="text"
                  class="activity-input"
                  placeholder="00:05:00"
                  ?disabled=${draft.auto_expire_enabled !== true}
                  .value=${draft.auto_expire || ''}
                  @input=${(e: Event) => {
                    this._editDraft = {
                      ...this._editDraft!,
                      auto_expire: (e.target as HTMLInputElement).value,
                    }
                  }}
                />
              </div>
            ` : ''}

            ${supportsExcludedSlots ? html`
              <div class="form-field">
                <span class="form-label">${this.t('rule_row_editor.channels_slots')}</span>
                <twilight-slot-action-tree
                  .hass=${this.hass}
                  .channels=${this.channels}
                  .excludedSlotIds=${draft.excluded_slots_override?.[selectedActivity] || {}}
                  @excluded-changed=${(e: CustomEvent<{ value: Record<string, string[]> }>) => this._onSlotOverridesChanged(selectedActivity, e.detail.value)}
                ></twilight-slot-action-tree>
              </div>
            ` : ''}

            ${supportsInputSuppression ? html`
              <div class="form-field">
                <div class="list-section-label">${this.t('rule_row_editor.input_suppression')}</div>
                <span class="form-label">${this.t('rule_row_editor.suppressed_inputs')}</span>
                <div class="checkbox-list">
                  ${selectableInputs.map(input => {
                    const isChecked = suppressedInputs.includes(input.id)
                    return html`
                      <label class="checkbox-item">
                        <input
                          type="checkbox"
                          ?checked=${isChecked}
                          @change=${(e: Event) => {
                            const checked = (e.target as HTMLInputElement).checked
                            const current = this._editDraft!.suppressed_inputs_override || []
                            const next = checked ? [...current, input.id] : current.filter(id => id !== input.id)
                            this._editDraft = { ...this._editDraft!, suppressed_inputs_override: next }
                          }}
                        />
                        <span>${getInputDisplayName(input, null)} (${input.type})</span>
                      </label>
                    `
                  })}
                  ${selectableInputs.length === 0 ? html`<div style="font-style: italic; opacity: 0.4; font-size: 11px;">${this.t('rule_row_editor.no_eligible_inputs')}</div>` : ''}
                </div>
                <span class="form-hint">${this.t('rule_row_editor.suppression_hint')}</span>
              </div>
            ` : ''}

          </div>

          <div class="panel-footer">
            <button class="btn-cancel-dialog" @click=${this._cancel}>${this.t('dialog.cancel')}</button>
            <button class="btn-save-dialog" ?disabled=${isSaveDisabled} @click=${this._save}>${isEditMode ? this.t('dialog.save') : this.t('common.add')}</button>
          </div>
        </div>
      </div>
    `
  }

}

export function makeNewRule(): RuleConfig {
  return {
    id: '',
    name: '',
    enabled: true,
    applied_activities: [],
    excluded_slots_override: {},
    auto_expire_mode: 'none',
    auto_expire_enabled: null,
    auto_expire: null,
    suppressed_inputs_override: [],
  }
}
