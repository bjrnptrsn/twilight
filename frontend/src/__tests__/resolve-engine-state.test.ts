import { describe, it, expect } from 'vitest'
import { resolveEngineState } from '../lib/status-helpers'

/**
 * Backend-first regression test for the status-card engine-state widget.
 *
 * resolveEngineState() is only called by status-card.ts when there is no
 * runState at all (a draft preview area with no engine started). It used to
 * default to "Running / Auto" in that case — a phantom status implying a
 * live engine that doesn't exist.
 */

const noFlags = {
  simCritical: false,
  simError: false,
  simSensorOffline: false,
  simWarning: false,
}

describe('resolveEngineState', () => {
  it('shows a neutral "not running" state for a draft with no engine', () => {
    const info = resolveEngineState(null, noFlags)
    expect(info.label).toBe('Not Running')
    expect(info.label).not.toBe('Running / Auto')
  })

  it('simulation flags still take priority over the draft fallback', () => {
    const info = resolveEngineState(null, { ...noFlags, simCritical: true })
    expect(info.label).toBe('Critical Alarm')
  })
})
