import { ReactiveController, ReactiveControllerHost } from 'lit'
import { haLocalMinutesOfDay } from './utils'
import type { HomeAssistant } from './types'

export class LiveClockController implements ReactiveController {
  private host: ReactiveControllerHost
  private _ticker: ReturnType<typeof setInterval> | null = null
  public liveMins = 0
  private _hass: HomeAssistant | null = null

  constructor(host: ReactiveControllerHost) {
    this.host = host
    host.addController(this)
    this._updateTime()
  }

  /** Call on every hass update (e.g. from the host's `updated()`) so ticks
   * use HA's configured timezone instead of the browser's — otherwise the
   * displayed time visibly drifts from the backend whenever they differ. */
  setHass(hass: HomeAssistant | null) {
    this._hass = hass
  }

  hostConnected() {
    this._start()
  }

  hostDisconnected() {
    this._stop()
  }

  /** Pause the ticker while the owning view is hidden but kept alive. */
  pause() {
    this._stop()
  }

  /** Resume the ticker when the view becomes visible again. */
  resume() {
    this._start()
  }

  private _start() {
    if (this._ticker) return
    this._updateTime()
    // Poll every 15s; always request an update so consumers doing their own
    // sub-minute formatting (e.g. a countdown) stay live too.
    this._ticker = setInterval(() => {
      this._updateTime()
      this.host.requestUpdate()
    }, 15000)
  }

  private _stop() {
    if (this._ticker) {
      clearInterval(this._ticker)
      this._ticker = null
    }
  }

  private _updateTime() {
    this.liveMins = haLocalMinutesOfDay(this._hass)
  }
}
