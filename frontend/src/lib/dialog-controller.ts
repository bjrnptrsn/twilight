import { ReactiveController, ReactiveControllerHost } from 'lit'

export class DialogController implements ReactiveController {
  confirmOpen = false
  confirmTitle = ''
  confirmMessage = ''
  private _confirmResolve: ((val: boolean) => void) | null = null

  alertOpen = false
  alertTitle = ''
  alertMessage = ''
  private _alertResolve: (() => void) | null = null

  promptOpen = false
  promptTitle = ''
  promptMessage = ''
  promptPlaceholder = ''
  promptValue = ''
  private _promptResolve: ((val: string | null) => void) | null = null

  constructor(private host: ReactiveControllerHost) {
    this.host.addController(this)
  }

  hostConnected() {}
  hostDisconnected() {
    if (this._confirmResolve) {
      this._confirmResolve(false)
      this._confirmResolve = null
    }
    if (this._alertResolve) {
      this._alertResolve()
      this._alertResolve = null
    }
    if (this._promptResolve) {
      this._promptResolve(null)
      this._promptResolve = null
    }
    this.confirmOpen = false
    this.alertOpen = false
    this.promptOpen = false
  }

  showConfirm(title: string, message: string): Promise<boolean> {
    if (this._confirmResolve) {
      this._confirmResolve(false)
      this._confirmResolve = null
    }
    return new Promise(resolve => {
      this.confirmTitle = title
      this.confirmMessage = message
      this.confirmOpen = true
      this._confirmResolve = resolve
      this.host.requestUpdate()
    })
  }

  showAlert(title: string, message: string): Promise<void> {
    if (this._alertResolve) {
      this._alertResolve()
      this._alertResolve = null
    }
    return new Promise(resolve => {
      this.alertTitle = title
      this.alertMessage = message
      this.alertOpen = true
      this._alertResolve = resolve
      this.host.requestUpdate()
    })
  }

  showPrompt(title: string, defaultValue = '', placeholder = '', message = ''): Promise<string | null> {
    if (this._promptResolve) {
      this._promptResolve(null)
      this._promptResolve = null
    }
    return new Promise(resolve => {
      this.promptTitle = title
      this.promptMessage = message
      this.promptPlaceholder = placeholder
      this.promptValue = defaultValue
      this.promptOpen = true
      this._promptResolve = resolve
      this.host.requestUpdate()
    })
  }

  _onConfirm = () => {
    this.confirmOpen = false
    if (this._confirmResolve) {
      this._confirmResolve(true)
      this._confirmResolve = null
    }
    this.host.requestUpdate()
  }

  _onCancelConfirm = () => {
    this.confirmOpen = false
    if (this._confirmResolve) {
      this._confirmResolve(false)
      this._confirmResolve = null
    }
    this.host.requestUpdate()
  }

  _onCloseAlert = () => {
    this.alertOpen = false
    if (this._alertResolve) {
      this._alertResolve()
      this._alertResolve = null
    }
    this.host.requestUpdate()
  }

  _onSubmitPrompt = (e: CustomEvent<{ value: string }>) => {
    this.promptOpen = false
    if (this._promptResolve) {
      this._promptResolve(e.detail.value)
      this._promptResolve = null
    }
    this.host.requestUpdate()
  }

  _onCancelPrompt = () => {
    this.promptOpen = false
    if (this._promptResolve) {
      this._promptResolve(null)
      this._promptResolve = null
    }
    this.host.requestUpdate()
  }
}
