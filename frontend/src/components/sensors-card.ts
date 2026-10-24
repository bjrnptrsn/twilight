import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { HomeAssistant, SensorConfig } from '../lib/types'
import { getLuxAggregationLabel } from '../lib/sensor-helpers'
import { cardDotStyles } from '../lib/shared-styles'
import { TwilightLocalizeMixin } from '../lib/i18n'
import './sensors-dialog'

@customElement('twilight-sensors-card')
export class TwilightSensorsCard extends TwilightLocalizeMixin(LitElement) {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ attribute: false }) config: SensorConfig[] = []
  @property({ type: Boolean }) noHeader = false
  @property({ type: Boolean }) templateMode = false

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
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: clip;
    }

    .devices-card {
      box-sizing: border-box;
      background: transparent;
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

    .entity-list {
      padding: 0 0 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .entity-row {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 20px;
    }

    .entity-row:hover {
      background: rgba(255, 255, 255, 0.015);
    }

    .entity-name-wrap {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .entity-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .entity-id {
      font-size: 11px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .type-badge {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      color: #fff;
      min-width: 48px;
      text-align: center;
      letter-spacing: 0.3px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      height: 18px;
    }

    .type-badge.illuminance {
      background: rgba(230, 160, 0, 0.9);
      border: 1px solid rgba(230, 160, 0, 0.95);
    }

    .agg-badge {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 2px 8px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      color: var(--secondary-text-color);
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 18%, transparent);
      margin-left: auto;
      white-space: nowrap;
    }

    .divider {
      height: 1px;
      background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
      margin: 8px 20px;
    }

    .empty-state {
      padding: 20px;
      text-align: center;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-style: italic;
    }
  `]

  private _openEdit() {
    this.dispatchEvent(new CustomEvent('open-edit', { bubbles: true, composed: true }))
  }

  render() {
    return html`
      <div class="devices-card">
        ${!this.noHeader ? html`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #3b82f6;"></span>
            <span class="devices-card-title" role="heading" aria-level="2">${this.t('sensors_card.title')}</span>
            <button class="edit-btn" aria-label=${this.t('common.configure_x', { name: this.t('sensors_card.title') })} @click=${this._openEdit}>⋮</button>
          </div>
        ` : ''}
        <div class="entity-list">
          ${(this.config || []).map((sensor, index) => {
            const luxSensors = sensor.entity_ids || []
            const friendlyNames = this.templateMode
              ? (luxSensors.length > 0 ? luxSensors.join(', ') : this.t('sensors_card.template_sensor_no_entities'))
              : (luxSensors.map(id => this.hass?.states[id]?.attributes?.friendly_name ?? id).join(', ') || '—')
            const luxAggLabel = getLuxAggregationLabel(sensor.aggregation || 'min', this.hass)

            return html`
              <div class="entity-row">
                <span class="type-badge ${sensor.type}">${this.t('sensors_dialog.type_illuminance')}</span>
                <div class="entity-name-wrap">
                  <span class="entity-name">${sensor.name || this.t('sensors_card.illuminance_sensors')}</span>
                  <span class="entity-id">${friendlyNames}</span>
                </div>
                <span class="agg-badge" title=${this.t('sensors_card.aggregation_method')}>
                  ${luxAggLabel}
                </span>
              </div>
              ${index < this.config.length - 1 ? html`<div class="divider"></div>` : ''}
            `
          })}
          ${(!this.config || this.config.length === 0) ? html`
            <div class="empty-state">${this.t('sensors_card.empty_state')}</div>
          ` : ''}
        </div>
      </div>
    `
  }
}
