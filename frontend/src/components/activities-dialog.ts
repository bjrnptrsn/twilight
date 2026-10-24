import { html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { type ActivityConfig, type InputConfig, ActivitiesChangedEvent, type HomeAssistant, type PlaceholderDefaults, type ChannelConfig } from '../lib/types'
import { activityBadgeStyles, dialogChromeStyles } from '../lib/shared-styles'
import { DialogDraftController } from '../lib/dialog-draft-controller'
import { DialogController } from '../lib/dialog-controller'
import {
  getFallbackActivityInfo,
  formatDuration,
  formatActionCell,
  formatReleaseCell,
} from '../lib/activity-helpers'
import { PortalDialog } from './dialogs'
import { getInputDisplayName } from '../lib/input-helpers'
import './dialogs'
import './activity-row-editor'

@customElement('twilight-activities-dialog')
export class TwilightActivitiesDialog extends PortalDialog {
  @property({ type: Boolean }) open = false
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ attribute: false }) config: ActivityConfig[] = []
  @property({ attribute: false }) inputs: InputConfig[] = []
  @property({ attribute: false }) placeholderDefaults: PlaceholderDefaults | null = null
  @property({ type: Boolean }) templateMode = false
  @property({ attribute: false }) channels: Record<string, ChannelConfig> = {}
  @property({ attribute: false }) heatmapProfiles: { id: string; name: string }[] = []

  @state() private _subEditOpen = false
  @state() private _subEditingIndex: number | null = null // null = Add, number = Edit index
  // Start value handed to the sub-editor component (property-in/event-out).
  @state() private _subEditActivity: ActivityConfig | null = null

  private _dialog = new DialogController(this)
  private _draftController = new DialogDraftController<ActivityConfig[]>(this, {
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

      .activity-table {
        border-collapse: collapse;
      }
      .activity-table th {
        text-align: left;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        padding: 6px 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .activity-table td {
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

      .divider {
        height: 1px;
        background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
        margin: 16px 0 8px 0;
      }

      .pill {
        display: inline-block;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.08);
        color: var(--secondary-text-color);
        font-weight: 500;
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

  private _closeAndSave() {
    this._draftController.closeAndSave(new ActivitiesChangedEvent({
      activities: this._draftController.draft || []
    }))
  }

  private _getFallbackActivityInfo() {
    return getFallbackActivityInfo(this.placeholderDefaults)
  }

  private _openAddActivity() {
    this._subEditingIndex = null
    this._subEditActivity = { id: '' } as ActivityConfig
    this._subEditOpen = true
  }

  private _openEditActivity(index: number) {
    const draft = this._draftController.draft
    if (!draft) return
    this._subEditingIndex = index
    this._subEditActivity = draft[index]
    this._subEditOpen = true
  }

  private async _onSubEditSave(e: CustomEvent<ActivityConfig>) {
    const draft = this._draftController.draft
    if (!draft) return
    const newActivity = e.detail

    if (newActivity.id && !/^[a-z0-9_-]+$/i.test(newActivity.id)) {
      await this._dialog.showAlert(this.t('activities_dialog.invalid_id'), this.t('activities_dialog.invalid_id_desc'))
      return
    }

    const nameToCheck = (newActivity.name || newActivity.id || '').trim().toLowerCase()

    if (this._subEditingIndex === null) {
      if (draft.some(a => (a.name || a.id || '').trim().toLowerCase() === nameToCheck)) {
        await this._dialog.showAlert(this.t('activities_dialog.duplicate_name'), this.t('activities_dialog.duplicate_name_desc'))
        return
      }
      this._draftController.draft = [...draft, newActivity]
    } else {
      const idx = this._subEditingIndex
      if (draft.some((a, i) => i !== idx && (a.name || a.id || '').trim().toLowerCase() === nameToCheck)) {
        await this._dialog.showAlert(this.t('activities_dialog.duplicate_name'), this.t('activities_dialog.duplicate_name_desc'))
        return
      }
      const updated = [...draft]
      updated[idx] = newActivity
      this._draftController.draft = updated
    }
    this._subEditOpen = false
    this.requestUpdate()
  }

  private _onSubEditCancel() {
    this._subEditOpen = false
  }

  private _onRemoveActivity(index: number) {
    const draft = this._draftController.draft
    if (draft) {
      this._draftController.draft = draft.filter((_, i) => i !== index)
      this.requestUpdate()
    }
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
            <span class="card-dot" style="--dot-color: #a855f7;"></span>
            <span class="panel-header-title" id=${this._titleId} role="heading" aria-level="2">${this.t('activities_dialog.header_title')}</span>
            <button class="panel-close" aria-label=${this.t('common.close_panel')} @click=${this._closeDiscard}>✕</button>
          </div>

          <div class="panel-body">
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div class="list-section-label">${this.t('activities_dialog.configured_activities')}</div>
              <table class="config-table activity-table">
                <thead>
                  <tr>
                    <th style="min-width: 30px;"></th>
                    <th style="min-width: 140px;">${this.t('common.name')}</th>
                    <th style="min-width: 120px;">${this.t('activities_card.triggers')}</th>
                    <th style="min-width: 100px;">${this.t('activities_card.action')}</th>
                    <th style="min-width: 100px;">${this.t('activities_card.release')}</th>
                    <th style="min-width: 100px;">${this.t('activities_card.suppresses')}</th>
                    <th style="min-width: 100px;">${this.t('activities_card.auto_expire')}</th>
                    <th style="min-width: 100px; text-align: center;">${this.t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  ${draft.map((act, index) => {
                    const fallbacks = this._getFallbackActivityInfo()
                    const isReset = act.action?.type === 'reset'
                    const triggeringInputs = (this.inputs || []).filter(i => i.activity === act.id)
                    const triggerNames = triggeringInputs.map(i => getInputDisplayName(i, this.hass))
                    return html`
                      <tr
                        class="input-row ${this._draftController.draggedIndex === index ? 'dragging' : ''}"
                        draggable="true"
                        @dragstart=${(e: DragEvent) => this._draftController.onDragStart(e, index)}
                        @dragover=${(e: DragEvent) => this._draftController.onDragOver(e, index)}
                        @dragend=${() => this._draftController.onDragEnd()}
                      >
                        <td style="text-align: center; padding: 0 4px; vertical-align: middle;">
                          <div class="drag-handle" title=${this.t('common.drag_to_reorder')} aria-label=${this.t('common.drag_to_reorder')}>⋮⋮</div>
                        </td>
                        <td>
                          <div style="font-weight: 600;">${act.name || act.id}</div>
                          ${act.name && act.id ? html`<div style="font-size: 10px; font-family: monospace; opacity: 0.5;">${act.id}</div>` : ''}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${triggerNames.length > 0
                            ? triggerNames.map(name => html`<span class="pill" style="margin-right: 4px;">${name}</span>`)
                            : html`<span style="opacity:0.4">—</span>`}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${formatActionCell(act.action, this.hass?.locale?.language)}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${isReset ? '—' : formatReleaseCell(act.release_action, this.hass?.locale?.language)}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${act.suppress_inputs?.length
                            ? act.suppress_inputs.map(id => {
                                const found = this.inputs.find(i => i.id === id)
                                return html`<span class="pill" style="margin-right: 4px;">${found ? getInputDisplayName(found, this.hass) : id}</span>`
                              })
                            : html`<span style="opacity:0.4">—</span>`}
                        </td>
                        <td style="color: var(--primary-text-color);">${isReset ? '—' : act.auto_expire_enabled === false ? this.t('common.none') : formatDuration(act.auto_expire, fallbacks.auto_expire, this.hass?.locale?.language)}</td>
                        <td style="text-align: center;">
                          <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <button class="row-action-btn edit" title=${this.t('activities_dialog.edit_activity')} @click=${() => this._openEditActivity(index)}>✏️</button>
                            <button class="row-action-btn remove" title=${this.t('activities_dialog.remove_activity')} aria-label=${this.t('activities_dialog.remove_activity')} @click=${() => this._onRemoveActivity(index)}>✕</button>
                          </div>
                        </td>
                      </tr>
                    `
                  })}
                  ${draft.length === 0 ? html`
                    <tr>
                      <td colspan="9" style="text-align: center; color: var(--secondary-text-color); font-style: italic; padding: 16px;">
                        ${this.t('activities_card.no_activities')}
                      </td>
                    </tr>
                  ` : ''}
                </tbody>
              </table>

              <div style="display: flex; justify-content: flex-start; margin-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px;">
                <button class="btn-add" @click=${this._openAddActivity}>
                  ${this.t('activities_dialog.add_activity')}
                </button>
              </div>

            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-save-dialog" @click=${this._closeAndSave}>${this.t('area_lights_dialog.done')}</button>
          </div>
        </div>
      </div>

      <twilight-activity-row-editor
        .open=${this._subEditOpen}
        .hass=${this.hass}
        .activity=${this._subEditActivity}
        .editIndex=${this._subEditingIndex}
        .inputs=${this.inputs}
        .placeholderDefaults=${this.placeholderDefaults}
        .channels=${this.channels}
        .existingIds=${(this._draftController.draft ?? []).map(a => a.id)}
        .allActivities=${this._draftController.draft ?? []}
        .heatmapProfiles=${this.heatmapProfiles}
        @save=${this._onSubEditSave}
        @cancel=${this._onSubEditCancel}
      ></twilight-activity-row-editor>

      <twilight-alert-dialog
        .open=${this._dialog.alertOpen}
        .dialogTitle=${this._dialog.alertTitle}
        .message=${this._dialog.alertMessage}
        @close=${this._dialog._onCloseAlert}
      ></twilight-alert-dialog>
    `
  }
}
