import { ReactiveController, ReactiveControllerHost } from 'lit'

export interface FocusRestoreHost extends ReactiveControllerHost {
  open: boolean
}

/** Restores keyboard focus to the element that opened a dialog/panel once it
 * closes — without this, focus is silently dropped to <body> and a keyboard
 * or screen reader user loses their place in the page. Captures
 * document.activeElement on the false->true transition of host.open, and
 * refocuses it on the true->false transition. */
export class FocusRestoreController implements ReactiveController {
  private _host: FocusRestoreHost
  private _prevOpen = false
  private _trigger: HTMLElement | null = null

  constructor(host: FocusRestoreHost) {
    this._host = host
    host.addController(this)
  }

  hostConnected() {}
  hostDisconnected() {}

  hostUpdate() {
    if (this._host.open !== this._prevOpen) {
      this._prevOpen = this._host.open
      if (this._host.open) {
        this._trigger = document.activeElement as HTMLElement | null
      } else if (this._trigger) {
        const trigger = this._trigger
        this._trigger = null
        // Deferred: the closing panel's DOM (incl. the trigger button, which
        // may live outside this host) must finish its own close-driven
        // re-render first, or .focus() can land on a not-yet-updated node.
        requestAnimationFrame(() => trigger.focus())
      }
    }
  }
}
