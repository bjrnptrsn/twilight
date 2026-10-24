import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { HomeAssistant } from '../lib/types'
import { type Slot, type SensorConfig, type RunState, type EngineStateInfo, type InputConfig, type ActivityConfig, type ChannelConfig, PRIMARY_CHANNEL_ID } from '../lib/types'
import { resolveEngineState } from '../lib/status-helpers'
import { sortChannelIds } from '../lib/channel-helpers'
import { formatSlotTime, isSlotActiveAt, sceneDisplayName } from '../lib/utils'
import { LiveClockController } from '../lib/live-clock-controller'
import { getInputDisplayName } from '../lib/input-helpers'
import { cardDotStyles } from '../lib/shared-styles'
import { TwilightLocalizeMixin } from '../lib/i18n'

/**
 * Pick the slot the "Active Timeslots" widget should show for a channel.
 *
 * Backend-first: once a runState exists, its active_slots is
 * authoritative — a channel missing from it means "no active slot", not a
 * cue to fall back to a local isSlotActiveAt() guess (that guess drifts
 * against the engine on offsets, day carry-over, excluded slots). The local
 * computation survives only as a draft preview for an area with no runState
 * at all. Mirrors resolveOverviewActiveSlot in areas-view.ts.
 */
export function resolveChannelActiveSlot(
  slots: Slot[],
  runState: RunState | null,
  channelId: string,
  liveMins: number
): Slot | undefined {
  const activeSlotId = runState?.active_slots?.[channelId] || null
  if (activeSlotId) {
    return slots.find(s => s.id === activeSlotId)
  }
  if (runState) return undefined
  return slots.find(s => isSlotActiveAt(s, liveMins))
}

@customElement('twilight-status-card')
export class TwilightStatusCard extends TwilightLocalizeMixin(LitElement) {
  private _clock = new LiveClockController(this)

  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ type: Array }) slots: Slot[] = []
  @property({ attribute: false }) sensorConfig!: SensorConfig[]
  @property({ type: Array }) inputs: InputConfig[] = []
  @property({ attribute: false }) activitiesConfig: ActivityConfig[] = []
  @property({ type: Boolean }) noHeader = false

  // Live state from the backend engine (single source of truth in operation).
  // When present, it overrides the frontend-derived values. Null while editing
  // a draft or when the area has no running engine.
  @property({ attribute: false }) runState: RunState | null = null
  @property({ type: Boolean }) areaEnabled = true
  @property({ attribute: false }) channels: Record<string, ChannelConfig> = {}
  @property({ attribute: false }) channelSlotsMap: Record<string, Slot[]> = {}

  // Simulation states
  @property({ type: Boolean }) simCritical = false
  @property({ type: Boolean }) simError = false
  @property({ type: Boolean }) simSensorOffline = false
  @property({ type: Boolean }) simWarning = false

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

    .status-card {
      box-sizing: border-box;
      background: transparent;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .status-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }

    .status-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
      flex: 1;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }

    .status-widget {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 10px 14px 10px 18px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      position: relative;
      overflow: hidden;
      min-width: 0;
      box-sizing: border-box;
    }

    .status-widget::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--widget-accent, color-mix(in srgb, var(--primary-text-color) 10%, transparent));
    }

    .status-widget-label {
      font-size: 9px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--secondary-text-color);
      letter-spacing: 0.5px;
    }

    .status-widget-value {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-widget-sub {
      font-size: 11px;
      color: var(--secondary-text-color);
      line-height: 1.35;
      min-width: 0;
    }

    .entity-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--dot-color, var(--success-color, #4caf50));
      flex-shrink: 0;
      box-shadow: 0 0 5px var(--dot-glow, transparent);
    }

    .slot-color-dot {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      flex-shrink: 0;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 20%, transparent);
      box-sizing: border-box;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--dot-color, #4caf50);
      box-shadow: 0 0 0 0 var(--dot-glow, rgba(76, 175, 80, 0.4));
      animation: pulse 2s infinite;
      flex-shrink: 0;
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 var(--dot-glow, rgba(76, 175, 80, 0.4));
      }
      70% {
        box-shadow: 0 0 0 6px var(--dot-glow, rgba(76, 175, 80, 0));
      }
      100% {
        box-shadow: 0 0 0 0 var(--dot-glow, rgba(76, 175, 80, 0));
      }
    }

    /* Dynamic glow effects for indicators */
    .static-glow {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--dot-color, #4caf50);
      box-shadow: 0 0 6px var(--dot-color, #4caf50);
      transition: box-shadow 0.3s ease, background-color 0.3s ease;
    }

    .breathe-glow {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--dot-color, #4caf50);
      animation: glow-breathe-anim 4s infinite ease-in-out;
    }

    @keyframes glow-breathe-anim {
      0%, 100% {
        box-shadow: 0 0 3px var(--dot-color, #4caf50);
        opacity: 0.85;
      }
      50% {
        box-shadow: 0 0 12px var(--dot-color, #4caf50);
        opacity: 1;
      }
    }

    .pulse-glow {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--dot-color, #4caf50);
      animation: glow-pulse-anim 1.5s infinite ease-in-out;
    }

    @keyframes glow-pulse-anim {
      0%, 100% {
        box-shadow: 0 0 2px var(--dot-color, #4caf50);
        transform: scale(0.95);
      }
      50% {
        box-shadow: 0 0 12px var(--dot-color, #4caf50), 0 0 18px var(--dot-color, #4caf50);
        transform: scale(1.08);
      }
    }

    .blink-glow {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--dot-color, #4caf50);
      box-shadow: 0 0 6px var(--dot-color, #4caf50);
      animation: glow-blink-anim 1s infinite steps(2, start);
    }

    @keyframes glow-blink-anim {
      to {
        visibility: hidden;
      }
    }

    .fast-pulse-glow {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--dot-color, #ff5722);
      animation: glow-fast-pulse-anim 0.75s infinite ease-in-out;
    }

    @keyframes glow-fast-pulse-anim {
      0%, 100% {
        box-shadow: 0 0 2px var(--dot-color, #ff5722);
        transform: scale(0.92);
      }
      50% {
        box-shadow: 0 0 14px var(--dot-color, #ff5722), 0 0 20px var(--dot-color, #ff5722);
        transform: scale(1.15);
      }
    }

    .fast-blink-glow {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--dot-color, #d32f2f);
      box-shadow: 0 0 8px var(--dot-color, #d32f2f);
      animation: glow-fast-blink-anim 0.4s infinite steps(2, start);
    }

    @keyframes glow-fast-blink-anim {
      to {
        visibility: hidden;
      }
    }
  `]

  // Formats the remaining time until activity_expires_at (backend-pushed ISO
  // timestamp), or frozen duration when a rule paused auto-expire, or null.
  private _activityCountdown(rs: RunState): string | null {
    if (rs.activity_expire_frozen_seconds !== undefined && rs.activity_expire_frozen_seconds !== null) {
      const frozenSecs = Math.round(rs.activity_expire_frozen_seconds)
      const mins = Math.floor(frozenSecs / 60)
      const secs = frozenSecs % 60
      const formatted = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
      return this.t('status_card.paused', { time: formatted })
    }
    if (!rs.activity_expires_at) return null
    const remainingMs = new Date(rs.activity_expires_at).getTime() - Date.now()
    if (!Number.isFinite(remainingMs) || remainingMs <= 0) return null
    const totalSeconds = Math.ceil(remainingMs / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    const formatted = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
    return rs.activity_expire_source === 'rule' ? this.t('status_card.rule_auto_expire', { time: formatted }) : formatted
  }

  // Derive the Engine State widget directly from the backend RunState.
  private _runStateEngineInfo(rs: RunState): EngineStateInfo {
    if (rs.engine_setup_failed) {
      return {
        label: this.t('status_card.engine_setup_failed'),
        color: 'var(--error-color, #f44336)',
        class: 'blink-glow',
        sub: this.t('status_card.engine_setup_failed_sub'),
      }
    }

    const sceneOn = rs.scene_activated_at !== null
    const activeAct = rs.active_activity

    if (rs.scene_extraction_failed && rs.scene_extraction_failed.length > 0) {
      return {
        label: this.t('status_card.scene_extraction_failed'),
        color: 'var(--warning-color, #ff9800)',
        class: 'pulse-glow',
        sub: this.t('status_card.scene_extraction_failed_sub', {
          count: rs.scene_extraction_failed.length,
        }),
      }
    }

    if (activeAct) {
      const actObj = (this.activitiesConfig || []).find(a => a.id === activeAct)
      const label = actObj?.name || (activeAct.charAt(0).toUpperCase() + activeAct.slice(1))
      const t = rs.activity_trigger
      const triggerInput = t?.input_id ? this.inputs.find(i => i.id === t.input_id) : undefined
      const triggerDisplayName = triggerInput ? getInputDisplayName(triggerInput, this.hass) : t?.input_id
      const sub = t?.input_id
        ? this.t('status_card.via_input', { input: `${triggerDisplayName}${t.entity_id ? ` (${t.entity_id})` : ''}` })
        : ''
      return {
        label,
        color: '#9c27b0',
        class: 'pulse-glow',
        sub,
      }
    }

    return {
      label: sceneOn ? this.t('status_card.scene_active') : this.t('status_card.idle'),
      color: sceneOn ? '#4caf50' : '#2196f3',
      class: 'entity-indicator',
      sub: sceneOn ? this.t('status_card.scene_switched') : this.t('status_card.waiting_for_input'),
    }
  }

  render() {
    if (!this.sensorConfig) return html``

    this._clock.setHass(this.hass)
    const liveMins = this._clock.liveMins
    const rs = this.runState

    const orderedChannelIds = sortChannelIds(this.channels)
    const channelIds = orderedChannelIds.length > 0 ? orderedChannelIds : [PRIMARY_CHANNEL_ID]

    // Engine State Widget
    const simFlags = {
      simCritical: this.simCritical,
      simError: this.simError,
      simSensorOffline: this.simSensorOffline,
      simWarning: this.simWarning,
    };
    const engineState = !this.areaEnabled
      ? {
          label: this.t('status_card.disabled'),
          color: '#888888',
          class: 'entity-indicator',
          sub: this.t('status_card.engine_inactive'),
        }
      : (rs
          ? this._runStateEngineInfo(rs)
          : resolveEngineState(this.runState, simFlags, this.hass?.locale?.language))

    return html`
      <div class="status-card">
        ${!this.noHeader ? html`
          <div class="status-header">
            <span class="card-dot" style="--dot-color: #06b6d4;"></span>
            <span class="status-title" role="heading" aria-level="2">${this.t('status_card.live_monitor')}</span>
            <span style="font-size:11px; color:var(--secondary-text-color)">${this.t('status_card.live_updating')}</span>
          </div>
        ` : ''}
        <div class="status-grid">
          <!-- Widget 1: Active Timeslots -->
          <div class="status-widget" style="--widget-accent: var(--accent-color, #e91e8c)">
            <div class="status-widget-label">${this.t('status_card.active_timeslots')}</div>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px; flex: 1; justify-content: center;">
              ${channelIds.map(chId => {
                const ch = this.channels?.[chId]
                const enabled = ch ? ch.enabled !== false : true
                const name = ch?.name || (chId === PRIMARY_CHANNEL_ID ? 'Twilight' : chId)
                
                if (!enabled) {
                  return html`
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px; opacity: 0.5;">
                      <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                        <div class="slot-color-dot" style="background: #888; flex-shrink: 0;"></div>
                        <span style="font-weight: 600; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;">${name}:</span>
                        <span style="color: var(--secondary-text-color); text-decoration: line-through;">${this.t('status_card.disabled')}</span>
                      </div>
                      <span style="font-size: 11px; color: var(--secondary-text-color);">—</span>
                    </div>
                  `
                }

                const slots = this.channelSlotsMap?.[chId] || (chId === PRIMARY_CHANNEL_ID ? this.slots : []) || []
                const activeSlot = resolveChannelActiveSlot(slots, rs, chId, liveMins)

                if (!activeSlot) {
                  return html`
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px; opacity: 0.7;">
                      <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                        <div class="slot-color-dot" style="background: #888; flex-shrink: 0;"></div>
                        <span style="font-weight: 600; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;">${name}:</span>
                        <span style="color: var(--secondary-text-color); font-style: italic;">${this.t('status_card.no_active_slot')}</span>
                      </div>
                      <span style="font-size: 11px; color: var(--secondary-text-color);">—</span>
                    </div>
                  `
                }

                const slotColor = activeSlot.color || 'var(--secondary-text-color)'
                const slotLabel = activeSlot.label
                const slotRange = `${formatSlotTime(activeSlot.from, this.hass?.locale)} - ${formatSlotTime(activeSlot.to, this.hass?.locale)}`
                const activeScene = rs
                  ? (rs.active_scene_names?.[chId] || this.t('status_card.no_scene'))
                  : (activeSlot.scene ? sceneDisplayName(this.hass, activeSlot.scene) : this.t('status_card.no_scene'))

                return html`
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px;">
                    <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                      <div class="slot-color-dot" style="background:${slotColor}; box-shadow: 0 0 6px ${slotColor}; flex-shrink: 0;"></div>
                      <span style="font-weight: 600; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;">${name}:</span>
                      <span style="color: var(--primary-text-color); font-weight: 500; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${slotLabel}</span>
                      <span style="color: var(--secondary-text-color); font-size: 11px; font-style: italic; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">(${activeScene})</span>
                    </div>
                    <span style="font-family: monospace; font-size: 11px; color: var(--secondary-text-color); flex-shrink: 0;">${slotRange}</span>
                  </div>
                `
              })}
            </div>
          </div>

          <!-- Widget 2: Engine State -->
          <div class="status-widget" style="--widget-accent: ${engineState.color}">
            <div class="status-widget-label">${this.t('status_card.engine_state')}</div>
            <div class="status-widget-value">
              <div class="${engineState.class}" style="--dot-color: ${engineState.color}"></div>
              ${engineState.label}
            </div>
            <div class="status-widget-sub">
              <div style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap">${engineState.sub}</div>
              ${rs && this._activityCountdown(rs) ? html`
                <div style="font-family: monospace; font-size: 11px; color: var(--secondary-text-color);">
                  ${this.t('status_card.ends_in', { time: this._activityCountdown(rs)! })}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `
  }
}
