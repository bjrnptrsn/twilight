import { describe, it, expect, vi } from 'vitest'
import '../views/areas-view'

/**
 * Regression tests for the twilight/subscribe_all lifecycle in areas-view.
 *
 * subscribeMessage resolves asynchronously, so the view can be torn down (or
 * resubscribed onto a new connection) before it ever holds the unsub function.
 * Storing it unconditionally leaked the subscription: the backend kept pushing
 * every area's full state to a dead view until the connection closed.
 */

type Unsub = () => void

function makeHass(subscribeImpl: () => Promise<Unsub>) {
  const connection = {
    subscribeMessage: vi.fn(subscribeImpl),
  }
  // Assigning `hass` also triggers the view's data load; stub it so these
  // tests exercise the subscription lifecycle only.
  return { connection, callWS: vi.fn().mockResolvedValue([]) } as any
}

async function makeView() {
  const el = document.createElement('twilight-areas-view') as any
  document.body.appendChild(el)
  await el.updateComplete
  return el
}

describe('areas-view subscription lifecycle', () => {
  it('unsubscribes an in-flight subscription when the view disconnects first', async () => {
    const unsub = vi.fn()
    let resolveSub!: (u: Unsub) => void
    const hass = makeHass(() => new Promise<Unsub>((res) => { resolveSub = res }))

    const el = await makeView()
    el.hass = hass
    el._subscribeAll()

    // Tear down while the subscribe promise is still pending.
    el.disconnectedCallback()

    // Backend only now confirms the subscription.
    resolveSub(unsub)
    await Promise.resolve()
    await Promise.resolve()

    expect(unsub).toHaveBeenCalledTimes(1)
    expect(el._unsubAll).toBeNull()

    el.remove()
  })

  it('drops a superseded subscription when a resubscribe overtakes it', async () => {
    const firstUnsub = vi.fn()
    const secondUnsub = vi.fn()
    const resolvers: ((u: Unsub) => void)[] = []
    const hass = makeHass(
      () => new Promise<Unsub>((res) => { resolvers.push(res) })
    )

    const el = await makeView()
    el.hass = hass

    el._subscribeAll()
    el._subscribeAll() // supersedes the first, still-pending attempt

    // First (stale) attempt resolves last — it must not become _unsubAll.
    resolvers[1](secondUnsub)
    resolvers[0](firstUnsub)
    await Promise.resolve()
    await Promise.resolve()

    expect(firstUnsub).toHaveBeenCalledTimes(1)
    expect(el._unsubAll).toBe(secondUnsub)

    el.remove()
  })

  it('ignores pushes from a superseded subscription', async () => {
    const handlers: ((msg: unknown) => void)[] = []
    const hass = makeHass(function (this: unknown, ...args: unknown[]) {
      handlers.push(args[0] as (msg: unknown) => void)
      return Promise.resolve(vi.fn())
    } as () => Promise<Unsub>)

    const el = await makeView()
    el.hass = hass

    el._subscribeAll()
    await Promise.resolve()
    el._subscribeAll()
    await Promise.resolve()

    // A late push from the first, superseded subscription must be ignored.
    handlers[0]({ areas: { stale: { active_slots: {} } }, full: true })
    expect(el._areasState.stale).toBeUndefined()

    // The current subscription still delivers.
    handlers[1]({ areas: { fresh: { active_slots: {} } }, full: true })
    expect(el._areasState.fresh).toBeDefined()

    el.remove()
  })
})

describe('areas-view keep-alive', () => {
  it('pauses the live clock while inactive and refreshes slot times on reactivation', async () => {
    const el = await makeView()
    const refreshSpy = vi.spyOn(el, '_refreshSlotTimes')

    el.active = false
    await el.updateComplete
    expect(el._clock._ticker).toBeNull()

    el.active = true
    await el.updateComplete
    expect(el._clock._ticker).not.toBeNull()
    expect(refreshSpy).toHaveBeenCalledTimes(1)

    el.remove()
  })
})
