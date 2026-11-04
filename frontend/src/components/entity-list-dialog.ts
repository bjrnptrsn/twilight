import { html, css, nothing, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { LabEntity } from '../lib/types'
import { preloadHaComponents } from '../lib/utils'
import { namesArea } from '../lib/area-scenes'
import { dialogChromeStyles } from '../lib/shared-styles'
import { PortalDialog } from './dialogs'

/** Domains with a meaningful turn-off. Anything else stays reachable through
 *  the picker's custom entity input. */
const TURN_OFF_DOMAINS = ['light', 'switch', 'input_boolean', 'fan', 'climate', 'humidifier', 'water_heater']

/**
 * Edits a turn-off list: the entities Twilight switches off together with a
 * scene or script, or on a reset. The area's lights are a checkbox list so integration and
 * configuration switches stay out of the way; everything else comes from the
 * picker and shows up as its own row below.
 */
@customElement('twilight-entity-list-dialog')
export class TwilightEntityListDialog extends PortalDialog {
  @property({ type: Boolean }) open = false
  @property({ type: Array }) value: string[] = []
  // Absent in the template editor, which has no area to list lights from.
  @property({ type: Array }) entities: LabEntity[] = []
  @property({ type: String }) areaId = ''
  @property({ type: String }) areaName = ''
  // Empty keeps the hint about a scene or script.
  @property({ type: String }) help = ''

  @state() private _draft: string[] = []

  static styles = [
    dialogChromeStyles,
    css`
      :host {
        display: contents;
      }

      .hint {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-bottom: 12px;
      }

      .list-section-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.9px;
        color: var(--secondary-text-color);
        padding: 0 0 6px;
      }

      .row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 5px 0;
        min-width: 0;
      }

      .row.toggle {
        cursor: pointer;
      }

      .row input {
        margin: 0;
        flex-shrink: 0;
      }

      .row-label {
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .row-id {
        flex: 1;
        min-width: 0;
        font-size: 11px;
        font-family: monospace;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .domain-badge {
        flex-shrink: 0;
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 1px 4px;
        border-radius: 3px;
        color: var(--secondary-text-color);
        border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent));
      }

      .remove-btn {
        flex-shrink: 0;
        background: none;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        padding: 2px 6px;
      }

      .divider {
        height: 1px;
        background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
        margin: 8px 0;
      }
    `
  ]

  protected willUpdate(changedProperties: PropertyValues): void {
    if (changedProperties.has('open') && this.open) {
      this._draft = [...this.value]
    }
  }

  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties)
    if (changedProperties.has('open') && this.open) {
      preloadHaComponents()
    }
  }

  private get _areaLights(): LabEntity[] {
    return this.entities.filter(e =>
      e.domain === 'light' && (e.in_area || e.in_channel || namesArea(e, this.areaId, this.areaName))
    )
  }

  private _toggle(entityId: string) {
    this._draft = this._draft.includes(entityId)
      ? this._draft.filter(id => id !== entityId)
      : [...this._draft, entityId]
  }

  private _add(entityId: string) {
    if (!this._draft.includes(entityId)) this._draft = [...this._draft, entityId]
  }

  private _name(entityId: string): string {
    return this.hass?.states[entityId]?.attributes?.friendly_name ?? entityId
  }

  // Neither event bubbles: this dialog sits inside editors that listen for their
  // own `save` and `close`, and those carry a different payload and meaning.
  private _close() {
    this.dispatchEvent(new CustomEvent('close'))
  }

  private _save() {
    this.dispatchEvent(new CustomEvent<string[]>('save', { detail: this._draft }))
  }

  protected _onEscape() {
    this._close()
  }

  render() {
    if (!this.open) return nothing

    const areaLights = this._areaLights
    const areaLightIds = new Set(areaLights.map(e => e.entity_id))
    const otherEntities = this._draft.filter(id => !areaLightIds.has(id))

    return html`
      <div class="overlay" style="z-index: 1200;" @click=${(e: Event) => { if (e.target === e.currentTarget) this._close() }}>
        <div
          class="edit-panel"
          style="max-width: 560px;"
          role="dialog"
          aria-modal="true"
          aria-labelledby=${this._titleId}
          @keydown=${this._onDialogKeydown}
        >
          <div class="panel-header">
            <span class="panel-header-title" id=${this._titleId} role="heading" aria-level="2">${this.t('entity_list_dialog.title')}</span>
            <button class="panel-close" aria-label=${this.t('common.close_panel')} @click=${this._close}>✕</button>
          </div>

          <div class="panel-body">
            <div class="hint">${this.help || this.t('entity_list_dialog.help')}</div>

            ${areaLights.length > 0 ? html`
              <div class="list-section-label">${this.t('entity_list_dialog.lights_in_area')}</div>
              ${areaLights.map(e => html`
                <label class="row toggle">
                  <input
                    type="checkbox"
                    .checked=${this._draft.includes(e.entity_id)}
                    @change=${() => this._toggle(e.entity_id)}
                  />
                  <span class="row-label">${e.name}</span>
                  <span class="row-id">${e.entity_id}</span>
                </label>
              `)}
              <div class="divider"></div>
            ` : ''}

            ${otherEntities.length > 0 ? html`
              <div class="list-section-label">${this.t('entity_list_dialog.other_entities')}</div>
              ${otherEntities.map(id => html`
                <div class="row">
                  <span class="row-label">${this._name(id)}</span>
                  <span class="domain-badge">${id.split('.')[0]}</span>
                  <span class="row-id">${id}</span>
                  <button class="remove-btn" aria-label=${this.t('entity_list_dialog.remove')} @click=${() => this._toggle(id)}>✕</button>
                </div>
              `)}
              <div class="divider"></div>
            ` : ''}

            <div class="list-section-label">${this.t('entity_list_dialog.add_entity')}</div>
            <ha-entity-picker
              .hass=${this.hass}
              .includeDomains=${TURN_OFF_DOMAINS}
              allow-custom-entity
              @value-changed=${(e: CustomEvent) => {
                const val = e.detail.value
                if (val) {
                  this._add(val)
                  const target = e.target as any
                  if (target) target.value = ''
                }
              }}
            ></ha-entity-picker>
          </div>

          <div class="panel-footer" style="gap: 12px;">
            <button class="btn-cancel-dialog" @click=${this._close}>${this.t('dialog.cancel')}</button>
            <button class="btn-save-dialog" @click=${this._save}>${this.t('dialog.save')}</button>
          </div>
        </div>
      </div>
    `
  }
}
