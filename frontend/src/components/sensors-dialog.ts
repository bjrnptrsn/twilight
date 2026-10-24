import { html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { HomeAssistant, SensorConfig } from '../lib/types'
import { SensorsChangedEvent } from '../lib/types'
import { dialogChromeStyles } from '../lib/shared-styles'
import { DialogDraftController } from '../lib/dialog-draft-controller'
import { getLuxAggregationLabel, getSensorDisplayName } from '../lib/sensor-helpers'
import { PortalDialog } from './dialogs'

@customElement('twilight-sensors-dialog')
export class TwilightSensorsDialog extends PortalDialog {
  @property({ type: Boolean }) open = false
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ attribute: false }) config: SensorConfig[] = []
  @property({ type: Boolean }) templateMode = false

  @state() private _subEditOpen = false
  @state() private _subEditingIndex: number | null = null // null = Add, number = Edit index
  @state() private _editDraft: SensorConfig | null = null

  private _draftController = new DialogDraftController<SensorConfig[]>(this, {
    onOpen: () => { this._subEditOpen = false },
  })

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
        padding: 16px 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .sensor-table {
        border-collapse: collapse;
      }
      .sensor-table th {
        text-align: left;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        padding: 6px 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .sensor-table td {
        padding: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        vertical-align: middle;
        font-size: 13px;
      }
      .sensor-row:hover {
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

      .entity-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 8px;
      }
      .entity-row:hover {
        background: rgba(255, 255, 255, 0.015);
      }
      .entity-remove-btn {
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
      .entity-remove-btn:hover {
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

      .type-badge {
        font-size: 13px;
        color: var(--primary-text-color);
        font-weight: normal;
        text-transform: lowercase;
      }

      .btn-add {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: var(--primary-text-color);
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        transition: background 0.15s, border-color 0.15s;
        width: fit-content;
      }
      .btn-add:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
      }
      .btn-add:disabled {
        opacity: 0.5;
        cursor: not-allowed;
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
    `
  ]

  private _closeAndSave() {
    const draft = this._draftController.draft ?? this.config
    this._draftController.closeAndSave(new SensorsChangedEvent([...draft]))
  }

  protected override _onEscape() {
    if (this._subEditOpen) {
      this._subEditOpen = false
      this._editDraft = null
    } else {
      this._draftController.closeDiscard()
    }
  }

  private _openAddSensor() {
    this._subEditingIndex = null
    this._editDraft = {
      id: '',
      name: undefined,
      type: 'illuminance',
      entity_ids: [],
      aggregation: undefined,
    }
    this._subEditOpen = true
  }

  private _openEditSensor(index: number) {
    const draft = this._draftController.draft
    if (!draft) return
    const sensor = draft[index]
    this._subEditingIndex = index
    this._editDraft = {
      id: sensor.id ?? '',
      name: sensor.name ?? undefined,
      type: sensor.type,
      entity_ids: sensor.entity_ids ?? [],
      aggregation: sensor.aggregation ?? undefined,
    }
    this._subEditOpen = true
  }

  private _removeSensor(index: number) {
    if (!this._draftController.draft) return
    const updated = [...this._draftController.draft]
    updated.splice(index, 1)
    this._draftController.draft = updated
    this.requestUpdate()
  }

  private _saveSubEdit() {
    if (!this._editDraft || !this._draftController.draft) return
    const updated = [...this._draftController.draft]

    const idx = this._subEditingIndex

    if (idx === null) {
      updated.push(this._editDraft)
    } else {
      updated[idx] = this._editDraft
    }

    this._draftController.draft = updated
    this._subEditOpen = false
    this._editDraft = null
    this.requestUpdate()
  }

  render() {
    if (!this.open || !this._draftController.draft) return html``
    const draft = this._draftController.draft

    // Only allow one illuminance sensor for now
    const hasIlluminance = draft.some(s => s.type === 'illuminance')

    return html`
      <div class="overlay" @click=${(e: Event) => { if (e.target === e.currentTarget && !this._subEditOpen) this._draftController.closeDiscard() }}>
        <div
          class="edit-panel list-panel"
          style="${this._subEditOpen ? 'display: none;' : ''}"
          role="dialog"
          aria-modal="true"
          aria-labelledby=${this._titleId}
          @keydown=${this._onDialogKeydown}
        >
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #3b82f6;"></span>
            <span class="panel-header-title" id=${this._titleId} role="heading" aria-level="2">${this.t('sensors_dialog.header_title')}</span>
            <button class="panel-close" aria-label=${this.t('common.close_panel')} @click=${() => this._draftController.closeDiscard()}>✕</button>
          </div>

          <div class="panel-body">
            <div class="list-section-label">${this.t('sensors_dialog.configured_sensors')}</div>
            <table class="config-table sensor-table">
              <thead>
                <tr>
                  <th style="min-width: 30px;"></th>
                  <th style="min-width: 150px;">${this.t('common.name')}</th>
                  <th style="min-width: 80px;">${this.t('common.type')}</th>
                  <th style="min-width: 220px;">${this.t('sensors_dialog.entities_aggregation')}</th>
                  <th style="min-width: 100px; text-align: center;">${this.t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                ${draft.map((s, index) => {
                  const entitiesList = (s.entity_ids || [])
                  const aggLabel = getLuxAggregationLabel(s.aggregation, this.hass)
                  return html`
                    <tr
                      class="sensor-row ${this._draftController.draggedIndex === index ? 'dragging' : ''}"
                      draggable="true"
                      @dragstart=${(e: DragEvent) => this._draftController.onDragStart(e, index)}
                      @dragover=${(e: DragEvent) => this._draftController.onDragOver(e, index)}
                      @dragend=${() => this._draftController.onDragEnd()}
                    >
                      <td style="text-align: center; padding: 0 4px; vertical-align: middle;">
                        <div class="drag-handle" title=${this.t('sensors_dialog.drag_to_reorder')} aria-label=${this.t('sensors_dialog.drag_to_reorder')}>⋮⋮</div>
                      </td>
                      <td>
                        <div style="font-weight: 600;">${getSensorDisplayName(s, this.hass)}</div>
                        ${s.name && s.id ? html`<div style="font-size: 10px; font-family: monospace; opacity: 0.5;">${s.id}</div>` : ''}
                      </td>
                      <td>
                        <span class="type-badge ${s.type}">${this.t('sensors_dialog.type_illuminance')}</span>
                      </td>
                      <td>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
                          ${entitiesList.length > 0
                            ? entitiesList.map(id => {
                                const name = this.templateMode ? id : (this.hass?.states[id]?.attributes?.friendly_name ?? id)
                                return html`<span class="pill">${name}</span>`
                              })
                            : html`<span style="opacity: 0.4;">—</span>`}
                          <span class="pill" style="opacity: 0.8;" title=${this.t('sensors_dialog.aggregation_label')}>Agg: ${aggLabel}</span>
                        </div>
                      </td>
                      <td style="text-align: center;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                          <button class="row-action-btn edit" title=${this.t('sensors_dialog.edit_sensor_title')} @click=${() => this._openEditSensor(index)}>✏️</button>
                          <button class="row-action-btn remove" title=${this.t('sensors_dialog.remove_sensor_title')} aria-label=${this.t('sensors_dialog.remove_sensor_title')} @click=${() => this._removeSensor(index)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  `
                })}
                ${draft.length === 0 ? html`
                  <tr>
                    <td colspan="5" style="text-align: center; color: var(--secondary-text-color); font-style: italic; padding: 16px;">
                      ${this.t('sensors_card.empty_state')}
                    </td>
                  </tr>
                ` : ''}
              </tbody>
            </table>

            <div style="display: flex; flex-direction: column; align-items: flex-start; margin-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px; gap: 8px;">
              <button class="btn-add" ?disabled=${hasIlluminance} @click=${this._openAddSensor}>
                ${this.t('sensors_dialog.add_sensor')}
              </button>
              ${hasIlluminance ? html`
                <div style="font-size: 11px; color: var(--secondary-text-color);">
                  ${this.t('sensors_dialog.limit_notice')}
                </div>
              ` : ''}
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-save-dialog" @click=${this._closeAndSave}>${this.t('area_lights_dialog.done')}</button>
          </div>
        </div>

        <!-- Sub-dialog: Add/Edit Sensor -->
        ${this._subEditOpen && this._editDraft ? html`
          <div
            class="edit-panel"
            role="dialog"
            aria-modal="true"
            @click=${(e: Event) => e.stopPropagation()}
            @keydown=${this._onDialogKeydown}
          >
            <div class="panel-header">
              <span class="card-dot" style="--dot-color: #3b82f6;"></span>
              <span class="panel-header-title" role="heading" aria-level="2">${this._subEditingIndex === null ? this.t('sensors_dialog.add_sensor') : this.t('sensors_dialog.edit_sensor')}</span>
              <button class="panel-close" aria-label=${this.t('common.close_panel')} @click=${() => { this._subEditOpen = false; this._editDraft = null }}>✕</button>
            </div>

            <div class="panel-body">
              <div class="form-field">
                <label class="form-label">${this.t('sensors_dialog.name_optional')}</label>
                <input
                  type="text"
                  class="activity-input"
                  placeholder=${this.t('sensors_dialog.name_placeholder')}
                  .value=${this._editDraft.name || ''}
                  @input=${(e: Event) => {
                    const val = (e.target as HTMLInputElement).value
                    this._editDraft = { ...this._editDraft!, name: val || undefined }
                  }}
                />
              </div>

              <div class="form-field">
                <label class="form-label">${this.t('sensors_dialog.sensor_type')}</label>
                <select class="option-select" disabled>
                  <option value="illuminance">${this.t('sensors_dialog.type_illuminance')}</option>
                </select>
              </div>

              ${this.templateMode ? '' : html`
                <div class="form-field">
                  <label class="form-label">${this.t('sensors_dialog.entities')}</label>
                  <table class="entity-table">
                    <tbody>
                      ${(this._editDraft.entity_ids || []).map((entityId, idx) => {
                        const friendlyName = this.templateMode
                          ? entityId
                          : (this.hass?.states[entityId]?.attributes?.friendly_name ?? entityId)
                        return html`
                          <tr class="entity-row">
                            <td style="padding: 6px 0;">
                              <div style="font-weight: 500;">${friendlyName}</div>
                              <div style="font-size: 11px; color: var(--secondary-text-color); font-family: monospace;">${entityId}</div>
                            </td>
                            <td style="text-align: right; width: 40px;">
                              <button class="entity-remove-btn" aria-label=${this.t('sensors_dialog.remove_entity')} @click=${() => {
                                this._editDraft = { ...this._editDraft!, entity_ids: (this._editDraft!.entity_ids || []).filter((_, i) => i !== idx) }
                              }}>✕</button>
                            </td>
                          </tr>
                        `
                      })}
                      ${(this._editDraft.entity_ids || []).length === 0 ? html`
                        <tr>
                          <td style="text-align: center; color: var(--secondary-text-color); font-style: italic; padding: 12px 0;">
                            ${this.t('sensors_dialog.no_entities_selected')}
                          </td>
                        </tr>
                      ` : ''}
                    </tbody>
                  </table>

                  <ha-entity-picker
                    .hass=${this.hass}
                    .includeDomains=${['sensor']}
                    allow-custom-entity
                    label=${this.t('sensors_dialog.add_entity')}
                    @value-changed=${(e: CustomEvent) => {
                      const val = e.detail.value
                      if (val) {
                        const current = this._editDraft!.entity_ids || []
                        if (!current.includes(val)) {
                          this._editDraft = { ...this._editDraft!, entity_ids: [...current, val] }
                        }
                        ;(e.target as any).value = ''
                      }
                    }}
                  ></ha-entity-picker>
                </div>
              `}

              <div class="form-field">
                <label class="form-label">${this.t('sensors_dialog.aggregation_label')}</label>
                <div style="font-size: 11px; color: var(--secondary-text-color); margin-bottom: 4px;">
                  ${this.t('sensors_dialog.aggregation_hint')}
                </div>
                <select class="option-select" .value=${this._editDraft.aggregation || 'min'} @change=${(e: Event) => {
                  const val = (e.target as HTMLSelectElement).value
                  this._editDraft = { ...this._editDraft!, aggregation: val as any }
                }}>
                  <option value="min">${this.t('sensors_dialog.agg_min')}</option>
                  <option value="max">${this.t('sensors_dialog.agg_max')}</option>
                  <option value="mean">${this.t('sensors_dialog.agg_mean')}</option>
                  <option value="median">${this.t('sensors_dialog.agg_median')}</option>
                </select>
              </div>
            </div>

            <div class="panel-footer" style="gap: 12px;">
              <button class="btn-cancel-dialog" @click=${() => { this._subEditOpen = false; this._editDraft = null }}>${this.t('sensors_dialog.cancel')}</button>
              <button class="btn-save-dialog" ?disabled=${!this.templateMode && !(this._editDraft.entity_ids || []).length} @click=${this._saveSubEdit}>
                ${this._subEditingIndex === null ? this.t('common.add') : this.t('common.save')}
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `
  }
}
