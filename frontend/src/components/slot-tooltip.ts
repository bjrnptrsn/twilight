import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { HomeAssistant } from '../lib/types'
import { type Slot } from '../lib/types'
import { isSlotActiveAt, formatSlotTime, sceneDisplayName } from '../lib/utils'

// Owns pointer position AND hover state locally, kept out of
// area-detail-view.ts on purpose: that view previously held _tooltipX/
// _tooltipY/_hoveredTime/_hoveredChannelId as @state, so every pointer move
// over the sun-path chart (mousemove -> time-hover-changed, dispatched at up
// to ~60Hz) re-rendered its whole 1000+-line tree, including re-deriving
// every channel's slots. Listening for both events here means only this
// small component re-renders per move.
@customElement('twilight-slot-tooltip')
export class TwilightSlotTooltip extends LitElement {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ type: Array }) slots: Slot[] = []
  @property({ attribute: false }) channelSlotsMap: Record<string, Slot[]> = {}

  @state() private _x = 0
  @state() private _y = 0
  @state() private _hoveredTime: number | null = null
  @state() private _hoveredChannelId: string | null = null

  static styles = css`
    :host {
      position: fixed;
      z-index: 200;
      pointer-events: none;
      white-space: nowrap;
    }

    .slot-tooltip-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      font-family: inherit;
    }
  `

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('mousemove', this._onMouseMove)
    window.addEventListener('time-hover-changed', this._onTimeHoverChanged as EventListener)
  }

  disconnectedCallback() {
    window.removeEventListener('mousemove', this._onMouseMove)
    window.removeEventListener('time-hover-changed', this._onTimeHoverChanged as EventListener)
    super.disconnectedCallback()
  }

  private _onMouseMove = (e: MouseEvent) => {
    this._x = e.clientX
    this._y = e.clientY
  }

  private _onTimeHoverChanged = (e: CustomEvent<{ hoverTime: number | null; channelId?: string }>) => {
    this._hoveredTime = e.detail.hoverTime
    if (e.detail.channelId) this._hoveredChannelId = e.detail.channelId
  }

  updated() {
    this.style.left = `${this._x + 15}px`
    this.style.top = `${this._y + 15}px`
  }

  render() {
    if (this._hoveredTime === null) return html``
    const liveMins = this._hoveredTime
    const slots = (this._hoveredChannelId ? this.channelSlotsMap[this._hoveredChannelId] : null) ?? this.slots
    const activeSlot = slots.find(s => isSlotActiveAt(s, liveMins))
    if (!activeSlot) return html``
    const label = activeSlot.scene ? sceneDisplayName(this.hass, activeSlot.scene) : activeSlot.label

    return html`
      <span class="slot-tooltip-badge" style="background:${activeSlot.color}; color:#fff; box-shadow:0 0 10px ${activeSlot.color}40">
        ${label} (${formatSlotTime(liveMins, this.hass?.locale)})
      </span>
    `
  }
}
