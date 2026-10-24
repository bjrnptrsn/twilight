import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { dialogChromeStyles } from '../lib/shared-styles'
import type { HomeAssistant } from '../lib/types'
import { TwilightLocalizeMixin } from '../lib/i18n'
import { FocusRestoreController } from '../lib/focus-restore-controller'

let dialogIdCounter = 0

function nextDialogId(): string {
  dialogIdCounter += 1
  return `twilight-dialog-title-${dialogIdCounter}`
}

export abstract class PortalDialog extends TwilightLocalizeMixin(LitElement) {
  abstract open: boolean
  @property({ attribute: false }) hass: HomeAssistant | null = null

  /* Per-instance aria-labelledby id — several dialogs of the same kind can
     be mounted at once (panel-base + area-detail-view), so a static id would
     be duplicated in the DOM. */
  protected readonly _titleId = nextDialogId()

  // Registered via constructor, not a class field, so it isn't reported unused.
  protected constructor() {
    super()
    new FocusRestoreController(this)
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('open') && this.open) {
      this._focusFirst()
    }
  }

  protected _onDialogKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation()
      this._onEscape()
    } else if (e.key === 'Tab') {
      this._trapTabFocus(e)
    }
  }

  protected _onEscape() {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
  }

  protected _focusFirst() {
    this._getFocusables()[0]?.focus()
  }

  private _trapTabFocus(e: KeyboardEvent) {
    const focusables = this._getFocusables()
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = (this.renderRoot as ShadowRoot).activeElement as HTMLElement | null
    if (e.shiftKey && (active === first || !focusables.includes(active as HTMLElement))) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && (active === last || !focusables.includes(active as HTMLElement))) {
      e.preventDefault()
      first.focus()
    }
  }

  private _getFocusables(): HTMLElement[] {
    return Array.from(
      this.renderRoot.querySelectorAll<HTMLElement>(
        'button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled'))
  }
}

@customElement('twilight-alert-dialog')
export class TwilightAlertDialog extends PortalDialog {
  @property({ type: Boolean }) open = false
  @property({ type: String }) dialogTitle = 'Alert'
  @property({ type: String }) message = ''

  static styles = [
    dialogChromeStyles,
    css`
      /* Above the sub-edit overlays (z-index 1100) — validation alerts fire
         from inside the sub-modals and must stay visible on top. */
      .overlay { z-index: 1200; }
      .modal-card {
        max-width: 450px;
      }
    `
  ]

  render() {
    if (!this.open) return html``
    return html`
      <div class="overlay" @click=${this._onClose}>
        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby=${this._titleId}
          @click=${(e: Event) => e.stopPropagation()}
          @keydown=${this._onDialogKeydown}
        >
          <div class="modal-header">
            <h3 class="modal-title" id=${this._titleId}>${this.dialogTitle}</h3>
          </div>
          <div class="modal-body">
            <p style="margin: 0; line-height: 1.5; font-size: 14px; color: var(--primary-text-color);">${this.message}</p>
          </div>
          <div class="modal-footer">
            <button class="btn-save-dialog" @click=${this._onClose}>${this.t('dialog.ok')}</button>
          </div>
        </div>
      </div>
    `
  }

  private _onClose() {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
  }
}

@customElement('twilight-confirm-dialog')
export class TwilightConfirmDialog extends PortalDialog {
  @property({ type: Boolean }) open = false
  @property({ type: String }) dialogTitle = 'Confirm'
  @property({ type: String }) message = ''

  static styles = [
    dialogChromeStyles,
    css`
      .overlay { z-index: 1200; }
      .modal-card {
        max-width: 450px;
      }
    `
  ]

  render() {
    if (!this.open) return html``
    return html`
      <div class="overlay" @click=${this._onCancel}>
        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby=${this._titleId}
          @click=${(e: Event) => e.stopPropagation()}
          @keydown=${this._onDialogKeydown}
        >
          <div class="modal-header">
            <h3 class="modal-title" id=${this._titleId}>${this.dialogTitle}</h3>
          </div>
          <div class="modal-body">
            <p style="margin: 0; line-height: 1.5; font-size: 14px; color: var(--primary-text-color);">${this.message}</p>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel-dialog" @click=${this._onCancel}>${this.t('dialog.cancel')}</button>
            <button class="btn-save-dialog" @click=${this._onConfirm}>${this.t('dialog.confirm')}</button>
          </div>
        </div>
      </div>
    `
  }

  protected override _onEscape() {
    this._onCancel()
  }

  private _onConfirm() {
    this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true }))
  }

  private _onCancel() {
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }))
  }
}

@customElement('twilight-prompt-dialog')
export class TwilightPromptDialog extends PortalDialog {
  @property({ type: Boolean }) open = false
  @property({ type: String }) dialogTitle = 'Prompt'
  @property({ type: String }) message = ''
  @property({ type: String }) placeholder = ''
  @property({ type: String }) value = ''

  @state() private _currentValue = ''

  willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('open') && this.open) {
      this._currentValue = this.value || ''
    }
  }

  static styles = [
    dialogChromeStyles,
    css`
      .overlay { z-index: 1200; }
      .modal-card {
        max-width: 450px;
      }
      .prompt-input {
        width: 100%;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 6px;
        color: var(--primary-text-color);
        padding: 10px 12px;
        font-size: 14px;
        outline: none;
        box-sizing: border-box;
      }
      .prompt-input:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }
    `
  ]

  render() {
    if (!this.open) return html``
    return html`
      <div class="overlay" @click=${this._onCancel}>
        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby=${this._titleId}
          @click=${(e: Event) => e.stopPropagation()}
          @keydown=${this._onDialogKeydown}
        >
          <div class="modal-header">
            <h3 class="modal-title" id=${this._titleId}>${this.dialogTitle}</h3>
          </div>
          <div class="modal-body" style="gap: 12px;">
            ${this.message ? html`<p style="margin: 0; font-size: 13px; color: var(--secondary-text-color);">${this.message}</p>` : ''}
            <input
              type="text"
              class="prompt-input"
              .value=${this._currentValue}
              .placeholder=${this.placeholder}
              @input=${this._onInput}
              @keydown=${this._onKeyDown}
            />
          </div>
          <div class="modal-footer">
            <button class="btn-cancel-dialog" @click=${this._onCancel}>${this.t('dialog.cancel')}</button>
            <button class="btn-save-dialog" @click=${this._onConfirm}>${this.t('dialog.ok')}</button>
          </div>
        </div>
      </div>
    `
  }

  private _onInput(e: Event) {
    this._currentValue = (e.target as HTMLInputElement).value
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this._onConfirm()
    } else if (e.key === 'Escape') {
      e.stopPropagation()
      this._onCancel()
    }
  }

  protected override _onEscape() {
    this._onCancel()
  }

  private _onConfirm() {
    this.dispatchEvent(new CustomEvent('submit', {
      detail: { value: this._currentValue },
      bubbles: true,
      composed: true
    }))
  }

  private _onCancel() {
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }))
  }
}
