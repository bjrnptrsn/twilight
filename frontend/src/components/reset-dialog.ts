import { html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { HomeAssistant } from '../lib/types'
import { PortalDialog } from './dialogs'
import './dialogs'

export interface ResetTreeNode {
  id: string
  label: string
  children?: { id: string; label: string }[]
}

@customElement('twilight-reset-dialog')
export class TwilightResetDialog extends PortalDialog {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ type: Boolean }) open = false
  @property({ type: String }) title = 'Reset Settings'
  @property({ type: String }) description = ''
  @property({ type: Array }) nodes: ResetTreeNode[] = []

  @state() private _selectedNodes: Record<string, boolean> = {}
  @state() private _expandedNodes: Record<string, boolean> = {}

  willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    // If open transitions to true, or nodes change, initialize all nodes as selected
    if (
      (changedProperties.has('open') && this.open) ||
      changedProperties.has('nodes')
    ) {
      const selected: Record<string, boolean> = {}
      const expanded: Record<string, boolean> = {}
      this.nodes.forEach(n => {
        selected[n.id] = true
        expanded[n.id] = true // keep expanded by default
        if (n.children) {
          n.children.forEach(c => {
            selected[c.id] = true
          })
        }
      })
      this._selectedNodes = selected
      this._expandedNodes = expanded
    }
  }

  private _isNodeSelected(nodeId: string): boolean {
    return !!this._selectedNodes[nodeId]
  }

  private _isNodeIndeterminate(node: ResetTreeNode): boolean {
    if (!node.children || node.children.length === 0) return false
    const checkedCount = node.children.filter(c => this._selectedNodes[c.id]).length
    return checkedCount > 0 && checkedCount < node.children.length
  }

  private _onCheckboxChange(node: { id: string; children?: { id: string; label: string }[] }, checked: boolean) {
    const nextSelected = { ...this._selectedNodes }
    nextSelected[node.id] = checked

    if (node.children) {
      node.children.forEach(c => {
        nextSelected[c.id] = checked
      })
    } else {
      // Find parent of this leaf
      const parent = this.nodes.find(n => n.children?.some(c => c.id === node.id))
      if (parent && parent.children) {
        const allChecked = parent.children.every(c => {
          const key = c.id
          return key === node.id ? checked : !!nextSelected[key]
        })
        nextSelected[parent.id] = allChecked
      }
    }

    this._selectedNodes = nextSelected
    this.requestUpdate()
  }

  private _toggleExpanded(nodeId: string) {
    this._expandedNodes = {
      ...this._expandedNodes,
      [nodeId]: !this._expandedNodes[nodeId]
    }
    this.requestUpdate()
  }

  private _onConfirm() {
    const selectedIds = Object.keys(this._selectedNodes).filter(k => this._selectedNodes[k])
    this.dispatchEvent(new CustomEvent('confirm', {
      detail: { selectedIds },
      bubbles: true,
      composed: true
    }))
  }

  protected override _onEscape() {
    this._onCancel()
  }

  private _onCancel() {
    this.dispatchEvent(new CustomEvent('cancel', {
      bubbles: true,
      composed: true
    }))
  }

  static styles = css`
    *, *:before, *:after {
      box-sizing: border-box;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(8px);
      box-sizing: border-box;
    }

    .modal-card {
      background: color-mix(in srgb, var(--primary-background-color, #1e1e28) 85%, transparent);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
      gap: 16px;
      color: var(--primary-text-color);
      box-sizing: border-box;
    }

    .modal-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      color: var(--primary-text-color);
    }

    .modal-desc {
      font-size: 13px;
      color: var(--secondary-text-color);
      margin: 0;
      line-height: 1.4;
    }

    .modal-tree {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 8px 0;
      box-sizing: border-box;
    }

    .tree-node {
      display: flex;
      flex-direction: column;
      gap: 4px;
      box-sizing: border-box;
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
      transition: background 0.15s;
      user-select: none;
      box-sizing: border-box;
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
      cursor: pointer;
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
      box-sizing: border-box;
    }

    .tree-leaf {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      padding: 4px 8px;
      color: var(--secondary-text-color);
      box-sizing: border-box;
    }

    .modal-card input[type="checkbox"] {
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
    }

    .modal-card input[type="checkbox"]:checked {
      background: var(--tp-accent, var(--accent-color, #e91e8c));
      border-color: var(--tp-accent, var(--accent-color, #e91e8c));
    }

    .modal-card input[type="checkbox"]:checked::after {
      content: '';
      width: 8px;
      height: 4px;
      border-left: 2px solid white;
      border-bottom: 2px solid white;
      transform: rotate(-45deg) translate(1px, -1px);
      position: absolute;
    }

    .modal-card input[type="checkbox"]:indeterminate {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.4);
    }

    .modal-card input[type="checkbox"]:indeterminate::after {
      content: '';
      width: 8px;
      height: 2px;
      background: white;
      position: absolute;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 8px;
      box-sizing: border-box;
    }

    .btn-cancel {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      color: var(--secondary-text-color);
      cursor: pointer;
      padding: 8px 20px;
      font-size: 14px;
      transition: background 0.15s, color 0.15s;
    }

    .btn-cancel:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--primary-text-color);
    }

    .btn-save {
      background: var(--tp-accent, var(--accent-color, #e91e8c));
      color: white;
      border: none;
      padding: 8px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
    }

    .btn-save:hover {
      opacity: 0.85;
    }
  `

  render() {
    if (!this.open) return html``

    return html`
      <div class="modal-overlay" @click=${this._onCancel}>
        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby=${this._titleId}
          @click=${(e: Event) => e.stopPropagation()}
          @keydown=${this._onDialogKeydown}
        >
          <h3 class="modal-title" id=${this._titleId}>${this.title}</h3>
          ${this.description ? html`<p class="modal-desc">${this.description}</p>` : ''}

          <div class="modal-tree">
            ${this.nodes.map(node => {
              const hasChildren = node.children && node.children.length > 0
              const isExpanded = !!this._expandedNodes[node.id]

              return html`
                <div class="tree-node">
                  <div
                    class="tree-node-header"
                    @click=${(e: Event) => {
                      if ((e.target as HTMLElement).tagName !== 'INPUT' && hasChildren) {
                        this._toggleExpanded(node.id)
                      }
                    }}
                  >
                    ${hasChildren
                      ? html`<span class="tree-node-chevron ${isExpanded ? 'expanded' : ''}">&#9656;</span>`
                      : html`<span class="tree-node-chevron" style="visibility: hidden;">&#9656;</span>`}
                    <input
                      type="checkbox"
                      .checked=${this._isNodeSelected(node.id)}
                      .indeterminate=${this._isNodeIndeterminate(node)}
                      @change=${(e: Event) => this._onCheckboxChange(node, (e.target as HTMLInputElement).checked)}
                    />
                    <span>${node.label}</span>
                  </div>

                  ${hasChildren && isExpanded
                    ? html`
                        <div class="tree-node-children">
                          ${node.children!.map(child => html`
                            <div class="tree-leaf">
                              <input
                                type="checkbox"
                                .checked=${this._isNodeSelected(child.id)}
                                @change=${(e: Event) => {
                                  const leafNode = { id: child.id }
                                  this._onCheckboxChange(leafNode, (e.target as HTMLInputElement).checked)
                                }}
                              />
                              <span>${child.label}</span>
                            </div>
                          `)}
                        </div>
                      `
                    : ''}
                </div>
              `
            })}
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click=${this._onCancel}>${this.t('dialog.cancel')}</button>
            <button class="btn-save" @click=${this._onConfirm}>${this.t('reset_dialog.reset_selected')}</button>
          </div>
        </div>
      </div>
    `
  }
}
