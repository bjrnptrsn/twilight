import { html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { type RuleConfig, type InputConfig, type ActivityConfig, type ChannelConfig, type HomeAssistant, RulesChangedEvent } from '../lib/types'
import { activityBadgeStyles, dialogChromeStyles } from '../lib/shared-styles'
import { DialogDraftController } from '../lib/dialog-draft-controller'
import { getInputDisplayName } from '../lib/input-helpers'
import { hasRuleCapabilityMismatch } from '../lib/activity-helpers'
import { makeNewRule } from './rule-row-editor'
import { PortalDialog } from './dialogs'
import './dialogs'
import './rule-row-editor'

@customElement('twilight-rules-dialog')
export class TwilightRulesDialog extends PortalDialog {
  @property({ type: Boolean }) open = false
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ attribute: false }) config: RuleConfig[] = []
  @property({ attribute: false }) inputsConfig: InputConfig[] = []
  @property({ attribute: false }) activitiesConfig: ActivityConfig[] = []
  @property({ attribute: false }) channels: Record<string, ChannelConfig> = {}

  @state() private _subEditOpen = false
  @state() private _subEditingIndex: number | null = null
  @state() private _subEditRule: RuleConfig | null = null

  private _draftController = new DialogDraftController<RuleConfig[]>(this, {
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

      .rule-table {
        width: 100%;
        border-collapse: collapse;
      }
      .rule-table th {
        text-align: left;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        padding: 6px 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .rule-table td {
        padding: 10px 8px;
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

      .drag-handle {
        cursor: grab;
        color: var(--secondary-text-color);
        opacity: 0.4;
        user-select: none;
      }
      .drag-handle:hover {
        opacity: 1;
      }

      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.05);
        color: var(--secondary-text-color);
      }
      .status-badge.enabled {
        background: rgba(76, 175, 80, 0.15);
        color: #81c784;
      }

      .input-row.row-disabled {
        opacity: 0.45;
      }

      .mismatch-hint {
        font-size: 11px;
        color: var(--warning-color, #f59e0b);
        margin-top: 2px;
        opacity: 1;
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
    `
  ]

  private _closeDiscard() {
    this._draftController.closeDiscard()
  }

  protected override _onEscape() {
    if (this._subEditOpen) {
      this._closeSubEdit()
    } else {
      this._closeDiscard()
    }
  }

  private _closeAndSave() {
    this._draftController.closeAndSave(new RulesChangedEvent(this._draftController.draft || []))
  }

  private _openAddRule() {
    this._subEditingIndex = null
    this._subEditRule = makeNewRule()
    this._subEditOpen = true
  }

  private _openEditRule(index: number) {
    const draft = this._draftController.draft
    if (!draft) return
    this._subEditingIndex = index
    this._subEditRule = structuredClone(draft[index])
    this._subEditOpen = true
  }

  private _closeSubEdit() {
    this._subEditOpen = false
    this._subEditingIndex = null
    this._subEditRule = null
  }

  private _handleSubEditSave(e: CustomEvent<RuleConfig>) {
    const draft = this._draftController.draft
    if (!draft) return
    const savedItem = e.detail
    const triggerInputIds = new Set((this.inputsConfig || []).filter(i => i.rule === savedItem.id).map(i => i.id))
    const cleanedSuppressed = (savedItem.suppressed_inputs_override || []).filter(id => !triggerInputIds.has(id))
    const cleanSavedItem = { ...savedItem, suppressed_inputs_override: cleanedSuppressed }

    const current = [...draft]
    if (this._subEditingIndex === null) {
      current.push(cleanSavedItem)
    } else {
      current[this._subEditingIndex] = cleanSavedItem
    }
    this._draftController.draft = current
    this.requestUpdate()
    this._closeSubEdit()
  }

  private _removeRule(index: number) {
    const draft = this._draftController.draft
    if (!draft) return
    const current = [...draft]
    current.splice(index, 1)
    this._draftController.draft = current
    this.requestUpdate()
  }

  render() {
    if (!this.open) return html``

    const draft = this._draftController.draft || []

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
            <span class="card-dot" style="--dot-color: #ef4444;"></span>
            <span class="panel-header-title" id=${this._titleId} role="heading" aria-level="2">${this.t('rules_dialog.header_title')}</span>
            <button class="panel-close" aria-label=${this.t('common.close_panel')} @click=${this._closeDiscard}>✕</button>
          </div>

          <div class="panel-body">
            <div class="list-section-label">${this.t('rules_dialog.configured_rules')}</div>
            <table class="config-table rule-table">
              <thead>
                <tr>
                  <th style="min-width: 30px;"></th>
                  <th style="min-width: 140px;">${this.t('common.name')}</th>
                  <th style="min-width: 140px;">${this.t('rules_card.triggers')}</th>
                  <th style="min-width: 140px;">${this.t('rules_card.target')}</th>
                  <th style="min-width: 90px;">${this.t('rules_card.status')}</th>
                  <th style="min-width: 100px; text-align: center;">${this.t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                ${draft.map((rule, idx) => {
                  const triggeringInputs = (this.inputsConfig || []).filter(i => i.rule === rule.id)
                  const inputNames = triggeringInputs.map(i => getInputDisplayName(i, this.hass))
                  const isMismatched = hasRuleCapabilityMismatch(rule, this.activitiesConfig || [])
                  return html`
                    <tr
                      class="input-row ${this._draftController.draggedIndex === idx ? 'dragging' : ''} ${!rule.enabled ? 'row-disabled' : ''}"
                      draggable="true"
                      @dragstart=${(e: DragEvent) => this._draftController.onDragStart(e, idx)}
                      @dragover=${(e: DragEvent) => this._draftController.onDragOver(e, idx)}
                      @dragend=${() => this._draftController.onDragEnd()}
                    >
                      <td style="text-align: center; padding: 0 4px; vertical-align: middle;">
                        <div class="drag-handle" title=${this.t('common.drag_to_reorder')} aria-label=${this.t('common.drag_to_reorder')}>⋮⋮</div>
                      </td>
                      <td>
                        <div style="font-weight: 600;">${rule.name || rule.id}</div>
                        ${rule.name && rule.id ? html`<div style="font-size: 10px; font-family: monospace; opacity: 0.5;">${rule.id}</div>` : ''}
                        ${isMismatched ? html`
                          <div class="mismatch-hint">
                            ${this.t('rules_card.mismatch_hint')}
                          </div>
                        ` : ''}
                      </td>
                      <td>
                        ${inputNames.length > 0
                          ? inputNames.map(name => html`<span class="pill">${name}</span>`)
                          : html`<span style="opacity: 0.4;">—</span>`}
                      </td>
                      <td>
                        ${(rule.applied_activities || []).length > 0
                          ? (rule.applied_activities || []).map(actId => {
                              const found = (this.activitiesConfig || []).find(a => a.id === actId)
                              return found?.name || found?.id || actId
                            }).map(name => html`<span class="pill">${name}</span>`)
                          : html`<span class="pill" style="opacity: 0.8;">${this.t('rules_card.all')}</span>`}
                      </td>
                      <td>
                        <span class="status-badge ${rule.enabled ? 'enabled' : ''}">
                          ${rule.enabled ? this.t('common.enabled') : this.t('common.disabled')}
                        </span>
                      </td>
                      <td style="text-align: center;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                          <button class="row-action-btn edit" title=${this.t('rules_dialog.edit_rule')} @click=${() => this._openEditRule(idx)}>✏️</button>
                          <button class="row-action-btn remove" title=${this.t('rules_dialog.remove_rule')} aria-label=${this.t('rules_dialog.remove_rule')} @click=${() => this._removeRule(idx)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  `
                })}
                ${draft.length === 0 ? html`
                  <tr>
                    <td colspan="6" style="text-align: center; color: var(--secondary-text-color); font-style: italic; padding: 16px;">
                      ${this.t('rules_card.empty_state')}
                    </td>
                  </tr>
                ` : ''}
              </tbody>
            </table>

            <div style="display: flex; justify-content: flex-start; margin-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px;">
              <button class="btn-add" @click=${this._openAddRule}>
                ${this.t('rules_dialog.add_rule')}
              </button>
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-save-dialog" @click=${this._closeAndSave}>${this.t('area_lights_dialog.done')}</button>
          </div>
        </div>
      </div>

      <twilight-rule-row-editor
        .hass=${this.hass}
        .open=${this._subEditOpen}
        .rule=${this._subEditRule}
        .editIndex=${this._subEditingIndex}
        .inputsConfig=${this.inputsConfig}
        .activitiesConfig=${this.activitiesConfig}
        .channels=${this.channels}
        .siblings=${draft}
        @save=${this._handleSubEditSave}
        @cancel=${this._closeSubEdit}
      ></twilight-rule-row-editor>
    `
  }
}
