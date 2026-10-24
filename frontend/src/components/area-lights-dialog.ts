import { html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { HomeAssistant } from '../lib/types'
import type { LabEntity } from '../lib/types'
import { preloadHaComponents } from '../lib/utils'
import { dialogChromeStyles } from '../lib/shared-styles'
import { PortalDialog } from './dialogs'

@customElement('twilight-area-lights-dialog')
export class TwilightAreaLightsDialog extends PortalDialog {
  @property({ type: Boolean }) open = false
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ type: Array }) entities: (LabEntity & { isExtracted?: boolean; isManual?: boolean })[] = []
  @property({ type: Boolean }) manualOnly = false

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
        display: flex;
        gap: 0 24px;
        flex-shrink: 0;
      }
      .grid-list-col {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .picker-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 5px 0;
        cursor: pointer;
        transition: background 0.12s;
        min-width: 0;
      }
      .picker-row:not(.static):hover {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      }
      .picker-row.static {
        cursor: default;
      }
      .picker-row.standalone {
        border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
        border-radius: 8px;
        padding: 5px 10px;
      }

      .picker-checkbox {
        width: 16px;
        height: 16px;
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
        font-size: 10px;
        font-weight: 700;
      }

      .picker-label {
        font-size: 13px;
        color: var(--primary-text-color);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        flex: 1;
        min-width: 40px;
      }
      .picker-sublabel {
        font-size: 10px;
        color: var(--secondary-text-color);
        font-family: monospace;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        flex-shrink: 1;
        min-width: 0;
        text-align: right;
        opacity: 0.6;
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

  private _toggleManualOnly() {
    const val = !this.manualOnly
    this.dispatchEvent(new CustomEvent('mode-changed', {
      detail: { manualOnly: val },
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
    let updated = [...this.entities]

    if (existing) {
      if (!existing.isManual) {
        updated = this.entities.map(e =>
          e.entity_id === entityId ? { ...e, isManual: true } : e
        )
      }
    } else {
      const name = this.hass?.states[entityId]?.attributes?.friendly_name ?? entityId
      const domain = entityId.split('.')[0]
      updated = [...this.entities, {
        entity_id: entityId,
        name,
        domain,
        in_area: false,
        isManual: true,
        isExtracted: false,
        checked: true
      }]
    }

    this._fireChange(updated)
  }

  private _fireChange(updatedList: (LabEntity & { isExtracted?: boolean; isManual?: boolean })[]) {
    this.dispatchEvent(new CustomEvent('lights-changed', {
      detail: { entities: updatedList },
      bubbles: true,
      composed: true
    }))
  }

  private _renderColumns<T>(items: T[], renderItem: (item: T) => ReturnType<typeof html>) {
    const mid = Math.ceil(items.length / 2)
    const left = items.slice(0, mid)
    const right = items.slice(mid)
    return html`
      <div class="grid-list">
        <div class="grid-list-col">${left.map(renderItem)}</div>
        <div class="grid-list-col">${right.map(renderItem)}</div>
      </div>
    `
  }

  render() {
    if (!this.open) return html``

    const sceneEntities = this.entities.filter(e => e.isExtracted && (e.domain === 'light' || e.domain === 'switch'))
    const areaEntities = this.entities.filter(e => e.in_area && !e.isExtracted && (e.domain === 'light' || e.domain === 'switch'))
    const extraEntities = this.entities.filter(e => !e.in_area && e.isManual && (e.domain === 'light' || e.domain === 'switch'))
    const hasManualEntities = this.entities.some(e => e.isManual)

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
            <span class="panel-header-title" id=${this._titleId} role="heading" aria-level="2">${this.t('area_lights_dialog.title')}</span>
            <button class="panel-close" aria-label=${this.t('common.close_panel')} @click=${this._closeDialog}>✕</button>
          </div>

          <div class="panel-body">
            ${sceneEntities.length > 0 ? html`
              <div class="list-section-label">${this.t('area_lights_card.scene_lights_extracted')}</div>
              ${this._renderColumns(sceneEntities, e => html`
                <div class="picker-row static">
                  <div class="picker-checkbox checked" style="opacity: 0.6;"></div>
                  <span class="picker-label">${e.name}</span>
                  <span class="entity-badge" style="background: color-mix(in srgb, var(--info-color, #2196f3) 20%, transparent); color: var(--info-color, #2196f3); border: 1px solid color-mix(in srgb, var(--info-color, #2196f3) 40%, transparent); font-size: 8px; padding: 1px 4px; border-radius: 3px; font-weight: bold; text-transform: uppercase; flex-shrink: 0; white-space: nowrap;">
                    in scene
                  </span>
                  <span class="picker-sublabel">${e.entity_id}</span>
                </div>
              `)}
              <div class="divider"></div>
            ` : ''}

            <div class="list-section-label">${this.t('area_lights_dialog.entities_in_area')}</div>
            ${this._renderColumns(areaEntities, e => html`
              <div class="picker-row" @click=${() => this._toggleEntity(e.entity_id)}>
                <div class="picker-checkbox ${e.isManual ? 'checked' : ''}"></div>
                <span class="picker-label">${e.name}</span>
                <span class="picker-sublabel">${e.entity_id}</span>
              </div>
            `)}

            ${extraEntities.length > 0 ? html`
              <div class="divider"></div>
              <div class="list-section-label">${this.t('area_lights_dialog.additional_entities')}</div>
              ${this._renderColumns(extraEntities, e => html`
                <div class="picker-row" @click=${() => this._toggleEntity(e.entity_id)}>
                  <div class="picker-checkbox checked"></div>
                  <span class="picker-label">${e.name}</span>
                  ${e.isExtracted ? html`
                    <span class="entity-badge" style="background: color-mix(in srgb, var(--info-color, #2196f3) 20%, transparent); color: var(--info-color, #2196f3); border: 1px solid color-mix(in srgb, var(--info-color, #2196f3) 40%, transparent); font-size: 8px; padding: 1px 4px; border-radius: 3px; font-weight: bold; text-transform: uppercase; flex-shrink: 0; white-space: nowrap;">
                      in scene
                    </span>
                  ` : ''}
                  <span class="picker-sublabel">${e.entity_id}</span>
                </div>
              `)}
            ` : ''}

            <div class="divider"></div>
            <div>
              <div class="list-section-label">${this.t('area_lights_dialog.add_entity')}</div>
              <ha-entity-picker
                .hass=${this.hass}
                .includeDomains=${['light', 'switch']}
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

            ${hasManualEntities ? html`
              <div class="divider"></div>
              <div>
                <div class="list-section-label">${this.t('area_lights_dialog.turn_off_options')}</div>
                <div class="picker-row standalone" @click=${this._toggleManualOnly}>
                  <div class="picker-checkbox ${this.manualOnly ? 'checked' : ''}"></div>
                  <div style="flex: 1; min-width: 0;">
                    <span class="picker-label">${this.t('area_lights_dialog.additional_entities_only')}</span>
                    <div class="picker-sublabel" style="font-family: inherit; font-size: 11px;">
                      ${this.t('area_lights_dialog.manual_only_desc')}
                    </div>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>

          <div class="panel-footer">
            <button class="btn-save-dialog" @click=${this._closeDialog}>${this.t('area_lights_dialog.done')}</button>
          </div>
        </div>
      </div>
    `
  }
}
