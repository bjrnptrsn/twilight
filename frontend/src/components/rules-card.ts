import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { type HomeAssistant, type RuleConfig, type InputConfig, type ActivityConfig, type RunState, type ChannelConfig } from '../lib/types'
import { activityBadgeStyles, cardDotStyles } from '../lib/shared-styles'
import { getInputDisplayName } from '../lib/input-helpers'
import { hasRuleCapabilityMismatch } from '../lib/activity-helpers'
import { TwilightLocalizeMixin } from '../lib/i18n'

@customElement('twilight-rules-card')
export class TwilightRulesCard extends TwilightLocalizeMixin(LitElement) {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ attribute: false }) rules: RuleConfig[] = []
  @property({ attribute: false }) inputsConfig: InputConfig[] = []
  @property({ attribute: false }) activitiesConfig: ActivityConfig[] = []
  @property({ attribute: false }) runState: RunState | null = null
  @property({ attribute: false }) channels: Record<string, ChannelConfig> = {}
  @property({ type: Boolean }) noHeader = false

  static styles = [
    activityBadgeStyles,
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
      }

      .activity-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 20px;
      }

      .activity-row.disabled {
        opacity: 0.45;
      }

      .status-indicator {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        flex-shrink: 0;
      }
      .status-indicator.active {
        background: var(--success-color, #4caf50);
        box-shadow: 0 0 8px var(--success-color, #4caf50);
      }

      .mismatch-hint {
        font-size: 11px;
        color: var(--warning-color, #f59e0b);
        margin-top: 2px;
        opacity: 1;
      }

      .activity-desc {
        font-size: 13px;
        color: var(--primary-text-color);
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .divider {
        height: 1px;
        background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
        margin: 4px 20px;
      }

      .empty-state {
        padding: 24px;
        text-align: center;
        color: var(--secondary-text-color);
        font-style: italic;
        font-size: 13px;
      }
    `
  ]

  private _openEdit() {
    this.dispatchEvent(new CustomEvent('open-edit', { bubbles: true, composed: true }))
  }

  render() {
    const activeRulesDict = this.runState?.active_rules || {}

    return html`
      <div class="devices-card">
        ${!this.noHeader ? html`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #ef4444;"></span>
            <span class="devices-card-title" role="heading" aria-level="2">${this.t('rules_card.title')}</span>
            <button class="edit-btn" aria-label=${this.t('common.configure_x', { name: this.t('rules_card.title') })} @click=${this._openEdit}>⋮</button>
          </div>
        ` : ''}

        <div class="entity-list">
          ${this.rules.map((rule, idx) => {
            const isActive = !!activeRulesDict[rule.id]
            const isDisabled = !rule.enabled
            const isMismatched = hasRuleCapabilityMismatch(rule, this.activitiesConfig || [])

            const triggeringInputs = (this.inputsConfig || []).filter(i => i.rule === rule.id)
            const triggerText = triggeringInputs.length > 0
              ? triggeringInputs.map(i => getInputDisplayName(i, this.hass)).join(', ')
              : this.t('common.none')

            const targetAct = (rule.applied_activities || []).length > 0
              ? rule.applied_activities.map(actId => {
                  const found = (this.activitiesConfig || []).find(a => a.id === actId)
                  return found?.name || found?.id || actId
                }).join(', ')
              : this.t('rules_card.all')

            const statusText = rule.enabled ? this.t('common.enabled') : this.t('common.disabled')
            const detailText = `${this.t('rules_card.target')}: ${targetAct} · ${this.t('rules_card.triggers')}: ${triggerText} · ${this.t('rules_card.status')}: ${statusText}`

            return html`
              <div class="activity-row ${isDisabled ? 'disabled' : ''}">
                <span class="status-indicator ${isActive ? 'active' : ''}" title="${isActive ? this.t('rules_card.status_active') : isDisabled ? this.t('rules_card.status_disabled') : this.t('rules_card.status_inactive')}"></span>
                <span class="activity-badge rule">${rule.name || rule.id}</span>
                <div class="activity-desc">
                  <div style="font-weight: 600;">${rule.name || rule.id}</div>
                  <div style="font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;">
                    ${detailText}
                  </div>
                  ${isMismatched ? html`
                    <div class="mismatch-hint">
                      ${this.t('rules_card.mismatch_hint')}
                    </div>
                  ` : ''}
                </div>
              </div>
              ${idx < this.rules.length - 1 ? html`<div class="divider"></div>` : ''}
            `
          })}

          ${this.rules.length === 0 ? html`
            <div class="empty-state">${this.t('rules_card.empty_state')}</div>
          ` : ''}
        </div>
      </div>
    `
  }
}
