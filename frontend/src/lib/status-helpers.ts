import { t } from './i18n'
import type { RunState, SimFlags, EngineStateInfo } from './types'

export function resolveEngineState(
  runState: RunState | null,
  flags: SimFlags,
  locale?: string
): EngineStateInfo {
  if (flags.simCritical) {
    return {
      label: t(locale, 'status_card.critical_alarm'),
      color: '#d32f2f',
      class: 'fast-blink-glow',
      sub: t(locale, 'status_card.sim_smoke_panic')
    }
  }

  if (flags.simError) {
    return {
      label: t(locale, 'status_card.system_error'),
      color: 'var(--error-color, #f44336)',
      class: 'blink-glow',
      sub: t(locale, 'status_card.sim_device_offline')
    }
  }

  if (flags.simSensorOffline) {
    return {
      label: t(locale, 'status_card.sensor_offline'),
      color: '#ff5722',
      class: 'fast-pulse-glow',
      sub: t(locale, 'status_card.sim_ambient_failure')
    }
  }

  if (flags.simWarning) {
    return {
      label: t(locale, 'status_card.system_warning'),
      color: 'var(--warning-color, #ff9800)',
      class: 'pulse-glow',
      sub: t(locale, 'status_card.sim_low_illuminance')
    }
  }

  // Backend-first: this function only runs for an area with no runState
  // at all (the caller uses _runStateEngineInfo() once one exists) — i.e. a
  // draft preview with no engine actually running. "Running / Auto" here
  // would be a phantom status; show a neutral "not started yet" state
  // instead of implying a live engine.
  return {
    label: t(locale, 'status_card.not_running'),
    color: '#888888',
    class: 'entity-indicator',
    sub: t(locale, 'status_card.no_engine_started')
  }
}
