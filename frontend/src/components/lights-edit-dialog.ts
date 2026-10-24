import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { HomeAssistant } from '../lib/types'
import { type LabEntity } from '../lib/types'
import { preloadHaComponents } from '../lib/utils'
import { dialogChromeStyles } from '../lib/shared-styles'
import { PortalDialog } from './dialogs'

@customElement('twilight-lights-edit-dialog')
export class TwilightLightsEditDialog extends PortalDialog {
  @property({ type: Boolean }) open = false
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ type: Array }) entities: (LabEntity & { isExtracted?: boolean; isManual?: boolean })[] = []
  @property({ type: String }) mode: 'manual' | 'auto' | 'combined' = 'auto'

  static styles = [
    dialogChromeStyles,
    css`
      :host {
        display: contents;
      }

      .list-section-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.9px;
        color: var(--secondary-text-color);
        padding: 0 0 6px;
      }

      .grid-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 8px 16px;
      }

      .picker-row {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 10px 12px;
        cursor: pointer;
        transition: background 0.12s;
        border-radius: 8px;
      }
      .picker-row:hover {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      }

      .picker-checkbox {
        width: 18px;
        height: 18px;
        border-radius: 4px;
        border: 2px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 25%, transparent));
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: border-color 0.12s, background 0.12s;
      }
      .picker-checkbox.checked {
        background: var(--tp-accent, var(--accent-color, #e91e8c));
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }
      .picker-checkbox.checked::after {
        content: '✓';
        color: white;
        font-size: 11px;
        font-weight: 700;
      }

      .picker-label {
        font-size: 14px;
        color: var(--primary-text-color);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .picker-sublabel {
        font-size: 11px;
        color: var(--secondary-text-color);
        font-family: monospace;
      }

      .mode-select {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: var(--primary-text-color);
        padding: 8px 12px;
        font-size: 13px;
        outline: none;
        cursor: pointer;
        width: 100%;
        box-sizing: border-box;
      }
      .mode-select:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }

      .divider {
        height: 1px;
        background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
        margin: 8px 0;
      }
    `
  ]

  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties)
    if (changedProperties.has('open') && this.open) {
      preloadHaComponents()
    }
  }

  private _closeDialog() {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
  }

  private _onModeChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value as 'manual' | 'auto' | 'combined'
    this.dispatchEvent(new CustomEvent('mode-changed', {
      detail: { mode: val },
      bubbles: true,
      composed: true
    }))
  }

  private _toggleEntity(id: string) {
    const updated = this.entities.map(e =>
      e.entity_id === id ? { ...e, isManual: !e.isManual } : e
    )
    this._fireChange(updated)
  }

  private _addEntity(entityId: string) {
    if (!entityId) return
    const existing = this.entities.find(e => e.entity_id === entityId)
    if (existing) {
      if (!existing.isManual) {
        const updated = this.entities.map(e =>
          e.entity_id === entityId ? { ...e, isManual: true } : e
        )
        this._fireChange(updated)
      }
    } else {
      const name = this.hass?.states[entityId]?.attributes?.friendly_name ?? entityId
      const domain = entityId.split('.')[0]
      const updated = [...this.entities, {
        entity_id: entityId,
        name,
        domain,
        in_area: false,
        isManual: true,
        isExtracted: false,
        checked: true
      }]
      this._fireChange(updated)
    }
  }

  private _fireChange(updatedList: (LabEntity & { isExtracted?: boolean; isManual?: boolean })[]) {
    this.dispatchEvent(new CustomEvent('lights-changed', {
      detail: { entities: updatedList },
      bubbles: true,
      composed: true
    }))
  }

  render() {
    if (!this.open) return html``

    const areaEntities = this.entities.filter(e => e.in_area && e.domain === 'light')
    const extraEntities = this.entities.filter(e => !e.in_area && e.isManual && e.domain === 'light')

    return html`
      <div class="overlay" @click=${(e: Event) => { if (e.target === e.currentTarget) this._closeDialog() }}>
        <div
          class="edit-panel"
          style="max-width: 1000px;"
          role="dialog"
          aria-modal="true"
          aria-labelledby=${this._titleId}
          @keydown=${this._onDialogKeydown}
        >
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #eab308;"></span>
            <span class="panel-header-title" id=${this._titleId} role="heading" aria-level="2">${this.t('lights_card.header_title')}</span>
            <button class="panel-close" aria-label=${this.t('common.close_panel')} @click=${this._closeDialog}>✕</button>
          </div>

          <div class="panel-body">
            <div>
              <div class="list-section-label">${this.t('lights_card.control_mode')}</div>
              <select class="mode-select" @change=${this._onModeChange}>
                <option value="auto" ?selected=${this.mode === 'auto'}>${this.t('lights_card.mode_auto')}</option>
                <option value="manual" ?selected=${this.mode === 'manual'}>${this.t('lights_card.mode_manual')}</option>
                <option value="combined" ?selected=${this.mode === 'combined'}>${this.t('lights_card.mode_combined')}</option>
              </select>
            </div>
            <div class="divider"></div>

            <div class="list-section-label">${this.t('lights_card.entities_in_area')}</div>
            <div class="grid-list">
              ${areaEntities.map(e => html`
                <div class="picker-row" @click=${() => this._toggleEntity(e.entity_id)}>
                  <div class="picker-checkbox ${e.isManual ? 'checked' : ''}"></div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span class="picker-label">${e.name}</span>
                      ${e.isExtracted ? html`
                        <span class="entity-badge" style="background: color-mix(in srgb, var(--info-color, #2196f3) 20%, transparent); color: var(--info-color, #2196f3); border: 1px solid color-mix(in srgb, var(--info-color, #2196f3) 40%, transparent); font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 1px 5px; border-radius: 4px;">
                          ${this.t('lights_card.in_scene_badge')}
                        </span>
                      ` : ''}
                    </div>
                    <div class="picker-sublabel">${e.entity_id}</div>
                  </div>
                </div>
              `)}
            </div>

            ${extraEntities.length > 0 ? html`
              <div class="divider"></div>
              <div class="list-section-label">${this.t('lights_card.additional_entities_manual')}</div>
              <div class="grid-list">
                ${extraEntities.map(e => html`
                  <div class="picker-row" @click=${() => this._toggleEntity(e.entity_id)}>
                    <div class="picker-checkbox checked"></div>
                    <div style="flex: 1; min-width: 0;">
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span class="picker-label">${e.name}</span>
                        ${e.isExtracted ? html`
                          <span class="entity-badge" style="background: color-mix(in srgb, var(--info-color, #2196f3) 20%, transparent); color: var(--info-color, #2196f3); border: 1px solid color-mix(in srgb, var(--info-color, #2196f3) 40%, transparent); font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 1px 5px; border-radius: 4px;">
                            ${this.t('lights_card.in_scene_badge')}
                          </span>
                        ` : ''}
                      </div>
                      <div class="picker-sublabel">${e.entity_id}</div>
                    </div>
                  </div>
                `)}
              </div>
            ` : ''}

            <div class="divider"></div>
            <div>
              <div class="list-section-label">${this.t('lights_card.add_entity')}</div>
              <ha-entity-picker
                .hass=${this.hass}
                .includeDomains=${['light']}
                allow-custom-entity
                @value-changed=${(e: CustomEvent) => {
                  const val = e.detail.value
                  if (val) {
                    this._addEntity(val)
                    const target = e.target as any
                    if (target) target.value = ''
                  }
                }}
              ></ha-entity-picker>
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-save-dialog" @click=${this._closeDialog}>${this.t('lights_card.done')}</button>
          </div>
        </div>
      </div>
    `
  }
}
