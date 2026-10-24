import { describe, it, expect } from 'vitest'
import { resolveOverviewActiveSlot } from '../views/areas-view'
import type { RunState } from '../lib/types'

/**
 * Backend-first regression tests for the overview slot badge.
 *
 * The badge used to be derived from the local clock, which drifts against the
 * engine's own active slot (offsets, day carry-over, excluded slots) and then
 * shows a phantom badge.
 */

// Minimal shape of what convertCalculatedTimesToSlots produces — isSlotActiveAt
// reads `from`/`to`, so the fixture has to use those field names.
const slots = [
  { id: 'day', label: 'Day', color: '#fff', from: 360, to: 1080 },
  { id: 'gold_dusk', label: 'Golden Dusk', color: '#f90', from: 1080, to: 1200 },
  { id: 'night', label: 'Night', color: '#003', from: 1200, to: 360 },
] as any[]

const NOON = 720 // local minutes -> inside "day"

describe('resolveOverviewActiveSlot', () => {
  it("uses the engine's active slot even when the local clock disagrees", () => {
    const runState = { active_slots: { primary: 'night' } } as unknown as RunState
    // Local clock says "day"; the engine says "night" — the engine wins.
    expect(resolveOverviewActiveSlot(slots, runState, NOON)?.id).toBe('night')
  })

  it('shows nothing when the engine reports no slot for Primary', () => {
    const runState = { active_slots: {} } as unknown as RunState
    // Must not fall back to the local clock: that is the phantom badge.
    expect(resolveOverviewActiveSlot(slots, runState, NOON)).toBeUndefined()
  })

  it('falls back to the local clock only when there is no engine at all', () => {
    // Draft preview for an area whose engine has not started yet.
    expect(resolveOverviewActiveSlot(slots, undefined, NOON)?.id).toBe('day')
  })

  it('shows nothing when the engine slot is unknown to the config', () => {
    const runState = { active_slots: { primary: 'ghost_slot' } } as unknown as RunState
    expect(resolveOverviewActiveSlot(slots, runState, NOON)).toBeUndefined()
  })
})
