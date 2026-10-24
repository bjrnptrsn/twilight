import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { HomeAssistant } from '../lib/types'
import { type LabEntity } from '../lib/types'
import { preloadHaComponents } from '../lib/utils'
import { cardDotStyles } from '../lib/shared-styles'
import { TwilightLocalizeMixin } from '../lib/i18n'
import './lights-edit-dialog'

@customElement('twilight-lights-card')
export class TwilightLightsCard extends TwilightLocalizeMixin(LitElement) {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ type: Array }) entities: (LabEntity & { isExtracted?: boolean; isManual?: boolean })[] = []
  @property({ type: String }) mode: 'manual' | 'auto' | 'combined' = 'auto'
  @property({ type: Boolean }) noHeader = false

  @state() private _editOpen = false

  static styles = [
    cardDotStyles,
    css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
    }

    .devices-card {
      border: var(--dev-border, none);
      border-radius: 2px;
      box-sizing: border-box;
      background: transparent;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .devices-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px 12px;
    }

    .devices-card-title {
      flex: 1;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .edit-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.6;
      transition: opacity 0.15s, background 0.15s;
      font-size: 16px;
      line-height: 1;
    }
    .edit-btn:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      opacity: 1;
    }

    .mode-selector {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 4px 20px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      margin-bottom: 8px;
    }
    .mode-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--secondary-text-color);
    }
    .mode-select {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      color: var(--primary-text-color);
      padding: 4px 8px;
      font-size: 12px;
      outline: none;
      cursor: pointer;
    }
    .mode-select:focus {
      border-color: var(--accent-color, #e91e8c);
    }

    .entity-list {
      padding: 0 0 12px;
    }

    .entity-section-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--secondary-text-color);
      padding: 12px 20px 6px;
      opacity: 0.8;
    }

    .entity-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 20px;
    }

    .entity-name {
      font-size: 13px;
      color: var(--primary-text-color);
      flex: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .entity-badge {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 1px 5px;
      border-radius: 4px;
      line-height: 1;
      margin-right: 8px;
      white-space: nowrap;
    }

    .entity-id {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-family: monospace;
      white-space: nowrap;
    }

    .entity-list-empty {
      padding: 12px 20px;
      font-size: 13px;
      color: var(--secondary-text-color);
      font-style: italic;
    }

    .entity-row.inactive {
      opacity: 0.5;
    }
  `]


  private _renderEntityRow(e: LabEntity & { isExtracted?: boolean; isManual?: boolean }, active: boolean) {
    // Config card: no live on/off dot (that was the only hass.states live read).
    // Live light state belongs to the scene-lights-card, not here.
    return html`
      <div class="entity-row ${active ? '' : 'inactive'}">
        <span class="entity-name">${e.name}</span>
        <span class="entity-id">${e.entity_id}</span>
      </div>
    `
  }

  render() {
    const manualEntities = this.entities.filter(e => e.isManual && e.domain === 'light')
    const extractedEntities = this.entities.filter(e => e.isExtracted && e.domain === 'light')

    const extractedActive = this.mode === 'auto' || this.mode === 'combined'
    const manualActive = this.mode === 'manual' || this.mode === 'combined' || (this.mode === 'auto' && extractedEntities.length === 0)

    return html`
      <div class="devices-card">
        ${!this.noHeader ? html`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #eab308;"></span>
            <span class="devices-card-title" role="heading" aria-level="2">${this.t('lights_card.light_entities')}</span>
            <button class="edit-btn" @click=${() => { preloadHaComponents(); this._editOpen = true }}>⋮</button>
          </div>
        ` : ''}

        <div class="mode-selector">
          <span class="mode-label">${this.t('lights_card.control_mode')}:</span>
          <span style="font-size: 12px; color: var(--primary-text-color); font-weight: 500;">
            ${this.mode === 'auto' ? this.t('lights_card.mode_auto') :
              this.mode === 'manual' ? this.t('lights_card.mode_manual') :
              this.mode === 'combined' ? this.t('lights_card.mode_combined') : this.mode}
          </span>
        </div>

        <div class="entity-list">
          <div class="entity-section-title">
            ${this.t('lights_card.lights_in_scenes')} ${extractedActive ? html`<span style="color: var(--success-color, #4caf50); font-weight: bold;">(${this.t('common.active')})</span>` : html`<span style="color: var(--secondary-text-color);">(${this.t('common.inactive')})</span>`}
          </div>
          ${extractedEntities.length === 0
            ? html`<div class="entity-list-empty">${this.t('lights_card.no_scene_lights')}</div>`
            : extractedEntities.map(e => this._renderEntityRow(e, extractedActive))
          }

          <div class="entity-section-title">
            ${this.t('lights_card.manually_configured')} ${manualActive ? html`<span style="color: var(--success-color, #4caf50); font-weight: bold;">(${this.t('common.active')})</span>` : html`<span style="color: var(--secondary-text-color);">(${this.t('common.inactive')})</span>`}
          </div>
          ${manualEntities.length === 0
            ? html`<div class="entity-list-empty">${this.t('lights_card.no_manual_lights')}</div>`
            : manualEntities.map(e => this._renderEntityRow(e, manualActive))
          }
        </div>
      </div>

      <twilight-lights-edit-dialog
        .open=${this._editOpen}
        .hass=${this.hass}
        .entities=${this.entities}
        .mode=${this.mode}
        @close=${() => { this._editOpen = false }}
        @mode-changed=${(e: CustomEvent) => { this.mode = e.detail.mode }}
        @lights-changed=${(e: CustomEvent) => { this.entities = e.detail.entities }}
      ></twilight-lights-edit-dialog>
    `
  }
}

