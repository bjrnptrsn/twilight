import { t } from './i18n'
import type { EngineStateInfo } from './types'

// Backend-first: status-card.ts uses this only for an area with no runState
// at all — a draft preview with no engine running. "Running / Auto" here
// would be a phantom status; show a neutral "not started yet" state instead
// of implying a live engine.
export function notRunningEngineState(locale?: string): EngineStateInfo {
  return {
    label: t(locale, 'status_card.not_running'),
    color: '#888888',
    class: 'entity-indicator',
    sub: t(locale, 'status_card.no_engine_started')
  }
}
