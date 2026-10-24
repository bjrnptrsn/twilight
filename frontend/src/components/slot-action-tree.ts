import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { type ChannelConfig, type HomeAssistant } from '../lib/types'
import { sortChannelIds } from '../lib/channel-helpers'
import { TwilightLocalizeMixin } from '../lib/i18n'

interface TreeNode {
  id: string
  label: string
  children: { id: string; label: string }[]
}

/** Inline (non-modal) channel/slot tree-checkbox picker for the `slot` activity
 * action's excluded_slots. Deselected = excluded (inverted from reset-dialog,
 * where selected = will be reset). Structurally modeled on reset-dialog.ts's
 * checkbox cascading (parent/child, indeterminate), but embeddable inline
 * instead of rendering its own full-screen overlay. */
@customElement('twilight-slot-action-tree')
export class TwilightSlotActionTree extends TwilightLocalizeMixin(LitElement) {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ attribute: false }) channels: Record<string, ChannelConfig> = {}
  @property({ attribute: false }) excludedSlotIds: Record<string, string[]> = {}

  @state() private _expandedNodes: Record<string, boolean> = {}

  private get _nodes(): TreeNode[] {
    const channelIds = sortChannelIds(this.channels)
    return channelIds.map(channelId => ({
      id: channelId,
      label: this.channels[channelId]?.name || channelId,
      children: (this.channels[channelId]?.slots ?? []).map(slot => ({
        id: slot.id,
        label: slot.name || slot.id,
      })),
    }))
  }

  private _isExcluded(channelId: string, slotId: string): boolean {
    return (this.excludedSlotIds[channelId] ?? []).includes(slotId)
  }

  private _isChannelIndeterminate(node: TreeNode): boolean {
    if (node.children.length === 0) return false
    const excludedCount = node.children.filter(c => this._isExcluded(node.id, c.id)).length
    return excludedCount > 0 && excludedCount < node.children.length
  }

  private _isChannelFullyExcluded(node: TreeNode): boolean {
    return node.children.length > 0 && node.children.every(c => this._isExcluded(node.id, c.id))
  }

  private _setChannelExcluded(channelId: string, slotIds: string[], excluded: boolean) {
    const next = { ...this.excludedSlotIds }
    next[channelId] = excluded ? slotIds : []
    this._emit(next)
  }

  private _setSlotExcluded(channelId: string, slotId: string, excluded: boolean) {
    const current = new Set(this.excludedSlotIds[channelId] ?? [])
    if (excluded) {
      current.add(slotId)
    } else {
      current.delete(slotId)
    }
    const next = { ...this.excludedSlotIds, [channelId]: [...current] }
    this._emit(next)
  }

  private _emit(next: Record<string, string[]>) {
    this.excludedSlotIds = next
    this.dispatchEvent(new CustomEvent('excluded-changed', {
      detail: { value: next },
      bubbles: true,
      composed: true,
    }))
  }

  private _toggleExpanded(nodeId: string) {
    this._expandedNodes = { ...this._expandedNodes, [nodeId]: !this._expandedNodes[nodeId] }
  }

  static styles = css`
    *, *:before, *:after {
      box-sizing: border-box;
    }

    .tree {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .tree-node {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .tree-node-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      padding: 6px 8px;
      border-radius: 6px;
      cursor: pointer;
      user-select: none;
    }

    .tree-node-header:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .tree-node-chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      font-size: 18px;
      color: var(--secondary-text-color);
      transition: transform 0.2s;
    }

    .tree-node-chevron.expanded {
      transform: rotate(90deg);
    }

    .tree-node-children {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-left: 28px;
      border-left: 1px dashed rgba(255, 255, 255, 0.1);
      margin-left: 14px;
    }

    .tree-leaf {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      padding: 4px 8px;
      color: var(--secondary-text-color);
    }

    input[type="checkbox"] {
      appearance: none;
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.05);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: background 0.15s, border-color 0.15s;
      outline: none;
      margin: 0;
      flex-shrink: 0;
    }

    input[type="checkbox"]:checked {
      background: var(--tp-accent, var(--accent-color, #e91e8c));
      border-color: var(--tp-accent, var(--accent-color, #e91e8c));
    }

    input[type="checkbox"]:checked::after {
      content: '';
      width: 8px;
      height: 4px;
      border-left: 2px solid white;
      border-bottom: 2px solid white;
      transform: rotate(-45deg) translate(1px, -1px);
      position: absolute;
    }

    input[type="checkbox"]:indeterminate {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.4);
    }

    input[type="checkbox"]:indeterminate::after {
      content: '';
      width: 8px;
      height: 2px;
      background: white;
      position: absolute;
    }

    .hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 0 0 4px 0;
    }
  `

  render() {
    const nodes = this._nodes
    if (nodes.length === 0) return html``

    return html`
      <p class="hint">${this.t('slot_action_tree.hint')}</p>
      <div class="tree">
        ${nodes.map(node => {
          const isExpanded = !!this._expandedNodes[node.id]
          const fullyExcluded = this._isChannelFullyExcluded(node)

          return html`
            <div class="tree-node">
              <div
                class="tree-node-header"
                @click=${(e: Event) => {
                  if ((e.target as HTMLElement).tagName !== 'INPUT') {
                    this._toggleExpanded(node.id)
                  }
                }}
              >
                <span class="tree-node-chevron ${isExpanded ? 'expanded' : ''}">&#9656;</span>
                <input
                  type="checkbox"
                  .checked=${!fullyExcluded}
                  .indeterminate=${this._isChannelIndeterminate(node)}
                  @change=${(e: Event) => {
                    const checked = (e.target as HTMLInputElement).checked
                    this._setChannelExcluded(node.id, node.children.map(c => c.id), !checked)
                  }}
                />
                <span>${node.label}</span>
              </div>

              ${isExpanded ? html`
                <div class="tree-node-children">
                  ${node.children.map(child => html`
                    <div class="tree-leaf">
                      <input
                        type="checkbox"
                        .checked=${!this._isExcluded(node.id, child.id)}
                        @change=${(e: Event) => {
                          const checked = (e.target as HTMLInputElement).checked
                          this._setSlotExcluded(node.id, child.id, !checked)
                        }}
                      />
                      <span>${child.label}</span>
                    </div>
                  `)}
                </div>
              ` : ''}
            </div>
          `
        })}
      </div>
    `
  }
}
