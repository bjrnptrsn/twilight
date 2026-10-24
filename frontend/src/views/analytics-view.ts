import { LitElement, html, css, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { HomeAssistant, AreaConfig } from '../lib/types'
import * as api from '../lib/api'
import { viewHeaderStyles } from '../lib/shared-styles'
import { TwilightLocalizeMixin } from '../lib/i18n'
import '../components/heatmap-card'

@customElement('twilight-analytics-view')
export class AnalyticsView extends TwilightLocalizeMixin(LitElement) {
  @property({ attribute: false }) hass: HomeAssistant | null = null

  @state() private _areaConfigs: AreaConfig[] = []
  @state() private _activeAreaId: string | null = null
  @state() private _loading = true
  // Set once _loadAreas() has run with a real hass object. Guards the "hass
  // arrived late" retry below — without it, an empty area list or a
  // persistent backend error kept `_areaConfigs.length === 0` forever,
  // re-triggering _loadAreas() (and its WS request) on every hass tick.
  private _hasLoadedOnce = false
  // Counts load attempts so a persistent backend error gets exactly one retry
  // (the "hass arrived late" case) instead of re-firing _loadAreas() on every
  // subsequent hass tick forever.
  private _loadAttempts = 0

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties)
    this._loadAreas()
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties)
    if (
      changedProperties.has('hass') && this.hass && !this._hasLoadedOnce && !this._loading &&
      this._loadAttempts < 2
    ) {
      this._loadAreas()
    }
  }

  private async _loadAreas() {
    if (!this.hass) return
    this._loadAttempts++
    this._loading = true
    try {
      const areaConfigs = await api.areasList(this.hass)
      this._areaConfigs = areaConfigs
      const areaExists = areaConfigs.some(a => a.area_id === this._activeAreaId)
      if (areaConfigs.length > 0 && (!this._activeAreaId || !areaExists)) {
        this._activeAreaId = areaConfigs[0].area_id
      }
      this._hasLoadedOnce = true
    } catch (e) {
      console.error("Failed to load areaConfigs for analytics", e)
    } finally {
      this._loading = false
    }
  }

  static styles = [
    viewHeaderStyles,
    css`
    :host {
      --dev-border: 1px dashed color-mix(in srgb, var(--primary-text-color, #fff) 25%, transparent);
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      padding: 0;
    }

    /* New two-tier 12-column grid layout */
    .view-header-grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 16px;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
    }
    .view-header-grid h2 {
      line-height: 24px;
    }

    .analytics-header {
      display: flex !important;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .view-content-container {
      padding: 24px;
      width: 100%;
      box-sizing: border-box;
      flex: 1;
      overflow-y: auto;
    }

    .view-content-grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 16px;
      align-items: stretch;
      align-content: start;
      box-sizing: border-box;
    }

    .span-2  { grid-column: span 2; min-width: 0; }
    .span-3  { grid-column: span 3; min-width: 0; }
    .span-4  { grid-column: span 4; min-width: 0; }
    .span-5  { grid-column: span 5; min-width: 0; }
    .span-6  { grid-column: span 6; min-width: 0; }
    .span-7  { grid-column: span 7; min-width: 0; }
    .span-8  { grid-column: span 8; min-width: 0; }
    .span-9  { grid-column: span 9; min-width: 0; }
    .span-12 { grid-column: span 12; min-width: 0; }

    @media (max-width: 768px) {
      .view-content-grid .span-2,
      .view-content-grid .span-3,
      .view-content-grid .span-4,
      .view-content-grid .span-5,
      .view-content-grid .span-6,
      .view-content-grid .span-7,
      .view-content-grid .span-8,
      .view-content-grid .span-9 {
        grid-column: span 12;
      }
      .view-header-grid {
        gap: 8px;
        text-align: left;
      }
    }

    .area-select {
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent));
      border-radius: 4px;
      padding: 4px 10px;
      font-size: 12px;
      cursor: pointer;
    }

    .no-areaConfigs {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 0;
      color: var(--secondary-text-color);
      font-size: 14px;
    }
  `]

  render() {
    if (this._loading) {
      return html`<div class="loading-state" style="padding: 24px; color: var(--secondary-text-color);">${this.t('common.loading')}</div>`
    }

    return html`
      <!-- Header Grid (1 Row, 12 columns, max 6 items) -->
      <div class="view-header-container">
        <div class="view-header-grid analytics-header">
          <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
            <h2 style="margin:0; font-size:20px; font-weight:500; color:var(--primary-text-color);">${this.t('nav.analytics')}</h2>
          </div>
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 12px; flex-shrink: 0;">
            ${this._areaConfigs.length > 0 ? html`
              <select
                class="area-select"
                @change=${(e: Event) => this._activeAreaId = (e.target as HTMLSelectElement).value}
              >
                ${this._areaConfigs.map(r => html`
                  <option value="${r.area_id}" ?selected=${this._activeAreaId === r.area_id}>${r.name || r.area_id}</option>
                `)}
              </select>
            ` : html`<span style="color:var(--secondary-text-color);font-size:13px">${this.t('areas_view.no_areas')}</span>`}
          </div>
        </div>
      </div>

      <!-- Main Content Grid (12 columns) -->
      <div class="view-content-container">
        <div class="view-content-grid">
          ${this._areaConfigs.length === 0
            ? html`<div class="span-12 no-areaConfigs">${this.t('analytics_view.no_areas_configured')}</div>`
            : html`
              <div class="span-12">
                <twilight-heatmap-card
                  .hass=${this.hass}
                  .activeAreaId=${this._activeAreaId}
                ></twilight-heatmap-card>
              </div>
            `}
        </div>
      </div>
    `
  }
}
