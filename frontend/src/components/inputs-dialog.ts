import { html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { type HomeAssistant, type InputConfig, InputsChangedEvent, type RunState, type ActivityConfig, type RuleConfig, type PlaceholderDefaults } from '../lib/types'
import { activityBadgeStyles, dialogChromeStyles } from '../lib/shared-styles'
import { DialogDraftController } from '../lib/dialog-draft-controller'
import { DialogController } from '../lib/dialog-controller'
import { getResolvedMotionInfo, getEntityDisplay, formatMotionInfo, getInputDisplayName, getInputTypeLabel } from '../lib/input-helpers'
import { makeNewInput } from './input-row-editor'
import { PortalDialog } from './dialogs'
import './input-row-editor'
import './dialogs'

@customElement('twilight-inputs-dialog')
export class TwilightInputsDialog extends PortalDialog {
  @property({ type: Boolean }) open = false
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ attribute: false }) config: InputConfig[] = []
  @property({ type: Array }) activities: string[] = []
  @property({ attribute: false }) activitiesConfig: ActivityConfig[] = []
  @property({ attribute: false }) rulesConfig: RuleConfig[] = []
  @property({ attribute: false }) placeholderDefaults: PlaceholderDefaults | null = null
  @property({ attribute: false }) runState: RunState | null = null
  @property({ type: Boolean }) templateMode = false
  @property({ type: String }) areaId: string | null = null

  @state() private _subEditOpen = false
  @state() private _subEditingIndex: number | null = null // null = Add, number = Edit index
  // Start value handed to the sub-editor component (property-in/event-out).
  @state() private _subEditInput: InputConfig | null = null

  private _dialog = new DialogController(this)
  private _draftController = new DialogDraftController<InputConfig[]>(this, {
    onOpen: () => { this._subEditOpen = false },
  })

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

      .input-table {
        border-collapse: collapse;
      }
      .input-table th {
        text-align: left;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        padding: 6px 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .input-table td {
        padding: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        vertical-align: middle;
        font-size: 13px;
      }
      .input-row:hover {
        background: rgba(255, 255, 255, 0.015);
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
      .row-action-btn.edit:hover {
        color: var(--primary-text-color);
        background: rgba(255, 255, 255, 0.08);
      }
      .row-action-btn.remove:hover {
        color: var(--error-color, #db4437);
        background: rgba(219, 68, 55, 0.1);
      }
      .row-action-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
        pointer-events: none;
      }

      .input-row.dragging {
        opacity: 0.4;
        background: rgba(255, 255, 255, 0.08);
      }

      .drag-handle {
        cursor: grab;
        user-select: none;
        color: var(--secondary-text-color);
        opacity: 0.4;
        font-size: 15px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        transition: opacity 0.15s, color 0.15s;
      }

      .drag-handle:active {
        cursor: grabbing;
      }

      .input-row:hover .drag-handle {
        opacity: 0.8;
        color: var(--primary-text-color);
      }

      .list-section-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.9px;
        color: var(--secondary-text-color);
        padding: 0 0 6px;
      }

      .pill {
        display: inline-block;
        font-size: 11px;
        padding: 1px 6px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.08);
        color: var(--secondary-text-color);
        margin-right: 4px;
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

      .btn-add {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: var(--primary-text-color);
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: background 0.15s, border-color 0.15s;
        width: fit-content;
      }
      .btn-add:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
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


      .entity-id {
        font-size: 11px;
        color: var(--secondary-text-color);
        font-family: monospace;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-top: 2px;
      }

      .status-badge {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 2px 6px;
        border-radius: 4px;
        min-width: 48px;
        max-width: 100%;
        text-align: center;
        letter-spacing: 0.3px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        white-space: normal;
        line-height: 1.3;
      }

      .status-badge.no_entity {
        background: rgba(244, 67, 54, 0.12);
        border: 1px solid rgba(244, 67, 54, 0.3);
        color: #ff5252;
      }

      .status-badge.user {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: var(--secondary-text-color);
      }

      .status-badge.activity {
        background: rgba(233, 30, 140, 0.12);
        border: 1px solid rgba(233, 30, 140, 0.3);
        color: var(--tp-accent, #e91e8c);
      }

      .input-row.disabled {
        opacity: 0.55;
      }

      .input-row.disabled .type-badge,
      .input-row.disabled .entity-id {
        opacity: 0.45;
      }
    `
  ]

  private _closeDiscard() {
    this._draftController.closeDiscard()
  }

  protected override _onEscape() {
    if (this._subEditOpen) {
      this._onSubEditCancel()
    } else {
      this._closeDiscard()
    }
  }

  private _getRuleName(ruleId: string | null | undefined): string {
    if (!ruleId) return this.t('common.none')
    const found = (this.rulesConfig || []).find(r => r.id === ruleId)
    return found?.name || found?.id || ruleId
  }

  private _getActivityName(activityId: string | null | undefined): string {
    if (!activityId) return this.t('common.none')
    const found = (this.activitiesConfig || []).find(a => a.id === activityId)
    return found?.name || found?.id || activityId
  }

  private _closeAndSave() {
    this._draftController.closeAndSave(new InputsChangedEvent(this._draftController.draft || []))
  }

  private _openAddInput() {
    this._subEditingIndex = null
    this._subEditInput = makeNewInput(this.activities[0] || '')
    this._subEditOpen = true
  }

  private _openEditInput(index: number) {
    const draft = this._draftController.draft
    if (!draft) return
    this._subEditingIndex = index
    this._subEditInput = { ...draft[index] }
    this._subEditOpen = true
  }

  private _onSubEditSave(e: CustomEvent<InputConfig>) {
    const draft = this._draftController.draft
    if (!draft) return
    const newInput = e.detail
    const idx = this._subEditingIndex
    const updated = idx === null ? [...draft, newInput] : draft.map((inp, i) => i === idx ? newInput : inp)
    this._draftController.draft = updated
    this._subEditOpen = false
    this.requestUpdate()
  }

  private _onSubEditCancel() {
    this._subEditOpen = false
  }

  private _onRemoveInput(index: number) {
    const draft = this._draftController.draft
    if (draft) {
      this._draftController.draft = draft.filter((_, i) => i !== index)
      this.requestUpdate()
    }
  }

  private _getResolvedMotionInfo(input: InputConfig) {
    return getResolvedMotionInfo(input, this.placeholderDefaults)
  }

  render() {
    if (!this.open || !this._draftController.draft) return html``
    const draft = this._draftController.draft

    return html`
      <div class="overlay" @click=${(e: Event) => { if (e.target === e.currentTarget && !this._subEditOpen) this._closeDiscard() }}>
        <div
          class="edit-panel list-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby=${this._titleId}
          @keydown=${this._onDialogKeydown}
        >
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #10b981;"></span>
            <span class="panel-header-title" id=${this._titleId} role="heading" aria-level="2">${this.t('inputs_dialog.header_title')}</span>
            <button class="panel-close" aria-label=${this.t('common.close_panel')} @click=${this._closeDiscard}>✕</button>
          </div>

          <div class="panel-body">
            <div class="list-section-label">${this.t('inputs_dialog.configured_inputs')}</div>
            <table class="config-table input-table">
              <thead>
                <tr>
                  <th style="min-width: 30px;"></th>
                  <th style="min-width: 150px;">${this.t('common.name')}</th>
                  <th style="min-width: 80px;">${this.t('common.type')}</th>
                  <th style="min-width: 200px;">${this.t('inputs_dialog.entity_info')}</th>
                  <th style="min-width: 140px;">${this.t('inputs_dialog.target_activity')}</th>
                  <th style="min-width: 100px; text-align: center;">${this.t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                ${draft.map((input, index) => {
                  let infoHtml = html`—`
                  let nameHtml = html`—`
                  if (this.templateMode) {
                    if (input.type === 'motion') {
                      const p = this._getResolvedMotionInfo(input)
                      const infoStr = formatMotionInfo(p, this.hass?.locale?.language)
                      infoHtml = html`<div style="opacity: 0.7; font-size: 11px;">${infoStr}</div>`
                    } else if (input.type === 'timer') {
                      infoHtml = html`<div class="entity-id">${this.t('inputs_card.trigger_time', { time: input.trigger_time ?? '00:00:00' })}</div>`
                    } else if (input.type === 'event' && input.event_type) {
                      infoHtml = html`<div style="opacity: 0.7; font-size: 11px;">${this.t('inputs_card.event_type', { type: input.event_type })}</div>`
                    } else if (input.type === 'button') {
                      infoHtml = html`<div style="opacity: 0.7; font-size: 11px;">${this.t('inputs_card.mode', { mode: input.button_mode ?? 'click' })}</div>`
                    }
                  } else {
                    if (input.type === 'motion') {
                      const { friendlyName, subText } = getEntityDisplay(input, this.hass ?? undefined)
                      nameHtml = html`<div style="font-weight: 500; word-break: break-word;">${input.name || friendlyName}</div>`
                      const p = this._getResolvedMotionInfo(input)
                      const infoStr = formatMotionInfo(p, this.hass?.locale?.language)
                      infoHtml = html`
                        <div class="entity-id">${input.name ? `${friendlyName} (${subText})` : subText}</div>
                        <div style="opacity: 0.7; font-size: 11px; margin-top: 2px;">${infoStr}</div>
                      `
                    } else if (input.type === 'timer') {
                      nameHtml = html`<div style="font-weight: 500; word-break: break-word;">${input.name || this.t('inputs_card.daily_timer')}</div>`
                      infoHtml = html`<div class="entity-id">${this.t('inputs_card.trigger_time', { time: input.trigger_time ?? '00:00:00' })}</div>`
                    } else if (input.type === 'button') {
                      nameHtml = html`<div style="font-weight: 500; word-break: break-word;">${input.label || input.name || input.id}</div>`
                      infoHtml = html`<div style="opacity: 0.7; font-size: 11px;">${this.t('inputs_card.mode', { mode: input.button_mode ?? 'click' })}${input.create_entity ? html` <ha-icon icon="mdi:home-assistant" style="--mdc-icon-size: 12px; vertical-align: middle;"></ha-icon>` : ''}</div>`
                    } else if (input.entity_ids && input.entity_ids.length > 0) {
                      const { friendlyName, subText: entitySubText } = getEntityDisplay(input, this.hass ?? undefined)
                      nameHtml = html`<div style="font-weight: 500; word-break: break-word;">${input.name || friendlyName}</div>`
                      let subText = entitySubText
                      if (input.type === 'event' && input.event_type) {
                        subText += ` [event: ${input.event_type}]`
                      }
                      infoHtml = html`<div class="entity-id">${input.name ? `${friendlyName} (${subText})` : subText}</div>`
                    }
                  }

                  const liveInput = this.runState?.inputs?.[input.id]
                  const liveDisablers = liveInput?.disabled_by || []
                  
                  const hasEntity = !!(input.entity_ids && input.entity_ids.length > 0)
                  const disablerSet = new Set<string>()
                  if (!this.templateMode && input.type !== 'timer' && input.type !== 'button' && !hasEntity) disablerSet.add("no_entity")
                  if (input.enabled === false) disablerSet.add("user")
                  for (const d of liveDisablers) {
                    disablerSet.add(d)
                  }
                  const disablersList = Array.from(disablerSet)

                  const isRowDisabled = input.enabled === false || (!this.templateMode && input.type !== 'timer' && input.type !== 'button' && !hasEntity) || disablersList.length > 0

                  return html`
                    <tr
                      class="input-row ${this._draftController.draggedIndex === index ? 'dragging' : ''} ${isRowDisabled ? 'disabled' : ''}"
                      draggable="true"
                      @dragstart=${(e: DragEvent) => this._draftController.onDragStart(e, index)}
                      @dragover=${(e: DragEvent) => this._draftController.onDragOver(e, index)}
                      @dragend=${() => this._draftController.onDragEnd()}
                    >
                      <td style="text-align: center; padding: 0 4px; vertical-align: middle;">
                        <div class="drag-handle" title=${this.t('common.drag_to_reorder')} aria-label=${this.t('common.drag_to_reorder')}>⋮⋮</div>
                      </td>
                      <td>
                        <div style="font-weight: 600;">${getInputDisplayName(input, this.hass)}</div>
                        ${(input.name || input.label) && input.id ? html`<div style="font-size: 10px; font-family: monospace; opacity: 0.5;">${input.id}</div>` : ''}
                      </td>
                      <td>
                        <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
                          <span class="type-badge ${input.type}">${getInputTypeLabel(input, this.hass)}</span>
                          ${disablersList.map(d => {
                            let badgeClass = 'user'
                            let text = this.t('inputs_dialog.disabled_badge')
                            if (d === 'no_entity') {
                              badgeClass = 'no_entity'
                              text = this.t('inputs_dialog.no_entity_badge')
                            } else if (d.startsWith('activity:')) {
                              badgeClass = 'activity'
                              text = this.t('inputs_dialog.suppressed_badge', { activity: d.substring(9) })
                            }
                            return html`
                              <span class="status-badge ${badgeClass}">${text}</span>
                            `
                          })}
                        </div>
                      </td>
                      <td>
                        ${nameHtml}
                        ${infoHtml}
                      </td>
                      <td>
                        ${input.rule ? html`
                          <span class="pill" title=${this.t('inputs_dialog.targets_rule')}>${this._getRuleName(input.rule)}</span>
                        ` : html`
                          <span class="pill">${this._getActivityName(input.activity)}</span>
                        `}
                      </td>
                      <td style="text-align: center;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                          <button class="row-action-btn edit" title=${this.t('inputs_dialog.edit_input')} @click=${() => this._openEditInput(index)}>✏️</button>
                          <button class="row-action-btn remove" title=${this.t('inputs_dialog.remove_input')} aria-label=${this.t('inputs_dialog.remove_input')} @click=${() => this._onRemoveInput(index)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  `
                })}
                ${draft.length === 0 ? html`
                  <tr>
                    <td colspan="6" style="text-align: center; color: var(--secondary-text-color); font-style: italic; padding: 16px;">
                      ${this.t('inputs_dialog.no_inputs')}
                    </td>
                  </tr>
                ` : ''}
              </tbody>
            </table>

            <div style="display: flex; justify-content: flex-start; margin-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px;">
              <button class="btn-add" @click=${this._openAddInput}>
                ${this.t('inputs_dialog.add_input')}
              </button>
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-save-dialog" @click=${this._closeAndSave}>${this.t('area_lights_dialog.done')}</button>
          </div>
        </div>
      </div>

      <twilight-input-row-editor
        .open=${this._subEditOpen}
        .hass=${this.hass}
        .input=${this._subEditInput}
        .editIndex=${this._subEditingIndex}
        .activities=${this.activities}
        .activitiesConfig=${this.activitiesConfig}
        .rules=${this.rulesConfig}
        .placeholderDefaults=${this.placeholderDefaults}
        .templateMode=${this.templateMode}
        @save=${this._onSubEditSave}
        @cancel=${this._onSubEditCancel}
      ></twilight-input-row-editor>

      <twilight-alert-dialog
        .open=${this._dialog.alertOpen}
        .dialogTitle=${this._dialog.alertTitle}
        .message=${this._dialog.alertMessage}
        @close=${this._dialog._onCloseAlert}
      ></twilight-alert-dialog>
    `
  }
}
