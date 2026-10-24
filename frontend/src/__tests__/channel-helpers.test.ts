import { describe, it, expect } from 'vitest'
import { sortChannelIds } from '../lib/channel-helpers'

describe('sortChannelIds', () => {
  it('puts the Primary channel first', () => {
    const ids = sortChannelIds({ wall_lights: {}, primary: {}, accent: {} } as never)
    expect(ids[0]).toBe('primary')
  })

  it('keeps custom channels in insertion order', () => {
    const ids = sortChannelIds({ zeta: {}, primary: {}, alpha: {} } as never)
    expect(ids).toEqual(['primary', 'zeta', 'alpha'])
  })

  it('handles a missing channels map', () => {
    expect(sortChannelIds(null)).toEqual([])
    expect(sortChannelIds(undefined)).toEqual([])
  })
})
