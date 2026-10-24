import { describe, it, expect } from 'vitest'
import { StaleGuard } from '../lib/stale-guard'

describe('StaleGuard', () => {
  it('treats a single request as current', () => {
    const guard = new StaleGuard()
    const token = guard.begin()
    expect(token.isCurrent()).toBe(true)
  })

  it('invalidates an earlier request when a newer one starts', () => {
    const guard = new StaleGuard()
    const first = guard.begin()
    const second = guard.begin()

    expect(first.isCurrent()).toBe(false)
    expect(second.isCurrent()).toBe(true)
  })

  it('keeps only the newest of many concurrent requests', () => {
    const guard = new StaleGuard()
    const tokens = [guard.begin(), guard.begin(), guard.begin()]

    expect(tokens.map(t => t.isCurrent())).toEqual([false, false, true])
  })

  it('cancel() invalidates in-flight requests without starting a new one', () => {
    const guard = new StaleGuard()
    const token = guard.begin()
    guard.cancel()
    expect(token.isCurrent()).toBe(false)
  })

  it('applies only the newest result when responses resolve out of order', async () => {
    // The actual scenario: request A (slow) resolves AFTER request B (fast).
    const guard = new StaleGuard()
    let applied: string | null = null

    const load = async (value: string, delayMs: number) => {
      const token = guard.begin()
      await new Promise(r => setTimeout(r, delayMs))
      if (!token.isCurrent()) return
      applied = value
    }

    const slow = load('area-A', 20)
    // Give the slow request a head start, then supersede it.
    await new Promise(r => setTimeout(r, 5))
    const fast = load('area-B', 1)

    await Promise.all([slow, fast])

    expect(applied).toBe('area-B')
  })

  it('guards are independent of each other', () => {
    const a = new StaleGuard()
    const b = new StaleGuard()
    const tokenA = a.begin()
    b.begin()
    expect(tokenA.isCurrent()).toBe(true)
  })
})
