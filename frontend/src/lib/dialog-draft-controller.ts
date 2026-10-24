import { ReactiveController, ReactiveControllerHost } from 'lit'
import { preloadHaComponents } from './utils'

export interface DialogDraftHost<T> extends ReactiveControllerHost {
  open: boolean
  config: T
  dispatchEvent(event: Event): boolean
}

export interface DialogDraftOptions {
  /** Called each time the dialog transitions to open, after the draft was (re)cloned. */
  onOpen?: () => void
}

export class DialogDraftController<T> implements ReactiveController {
  private _host: DialogDraftHost<T>
  private _options: DialogDraftOptions
  private _prevOpen = false

  private _initialConfigJson = ''

  public draft: T | null = null
  public draggedIndex: number | null = null

  constructor(host: DialogDraftHost<T>, options: DialogDraftOptions = {}) {
    this._host = host
    this._options = options
    this._host.addController(this)
  }

  hostConnected() {}
  hostDisconnected() {}

  hostUpdate() {
    if (this._host.open !== this._prevOpen) {
      this._prevOpen = this._host.open
      if (this._host.open) {
        this.draft = this._host.config ? structuredClone(this._host.config) : null
        this._initialConfigJson = JSON.stringify(this._host.config ?? null)
        this._options.onOpen?.()
        preloadHaComponents()
      } else {
        this.draft = null
        this._initialConfigJson = ''
      }
    }
  }

  public get isDirty(): boolean {
    if (!this.draft) return false
    return JSON.stringify(this.draft) !== this._initialConfigJson
  }

  public closeDiscard() {
    this._host.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
  }

  public closeAndSave(saveEvent: Event) {
    if (this.isDirty) {
      this._host.dispatchEvent(saveEvent)
    }
    this._host.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
  }

  // Drag & Drop reordering
  public onDragStart(e: DragEvent, index: number) {
    this.draggedIndex = index
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', String(index))
    }
  }

  public onDragOver(e: DragEvent, index: number) {
    e.preventDefault()
    if (this.draggedIndex === null || this.draggedIndex === index || !Array.isArray(this.draft)) return

    const updated = [...this.draft]
    const item = updated[this.draggedIndex]
    updated.splice(this.draggedIndex, 1)
    updated.splice(index, 0, item)

    this.draft = updated as unknown as T
    this.draggedIndex = index
    this._host.requestUpdate()
  }

  public onDragEnd() {
    this.draggedIndex = null
  }
}
