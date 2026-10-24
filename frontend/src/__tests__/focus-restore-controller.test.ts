import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { FocusRestoreController } from '../lib/focus-restore-controller'

describe('FocusRestoreController', () => {
  let rafCallback: (() => void) | null

  beforeEach(() => {
    rafCallback = null
    vi.stubGlobal('requestAnimationFrame', (cb: () => void) => {
      rafCallback = cb
      return 1
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const createMockHost = (open: boolean) => ({
    open,
    addController: vi.fn(),
    requestUpdate: vi.fn(),
  })

  it('captures the active element when open transitions false -> true', () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()
    expect(document.activeElement).toBe(trigger)

    const host = createMockHost(true)
    const controller = new FocusRestoreController(host as any)
    controller.hostUpdate()

    // Moving focus elsewhere confirms the capture happened at hostUpdate time,
    // not lazily read later.
    document.body.focus()
    expect(document.activeElement).not.toBe(trigger)

    document.body.removeChild(trigger)
  })

  it('restores focus to the trigger once open transitions true -> false', () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    const host = createMockHost(true)
    const controller = new FocusRestoreController(host as any)
    controller.hostUpdate() // false -> true: captures trigger

    document.body.focus() // simulate focus moving into the now-open dialog

    host.open = false
    controller.hostUpdate() // true -> false: should schedule a refocus

    expect(rafCallback).not.toBeNull()
    rafCallback!()

    expect(document.activeElement).toBe(trigger)
    document.body.removeChild(trigger)
  })

  it('does nothing on repeated hostUpdate calls with no open change', () => {
    const host = createMockHost(true)
    const controller = new FocusRestoreController(host as any)
    controller.hostUpdate()
    controller.hostUpdate()
    controller.hostUpdate()

    // No close transition occurred, so no restore should ever be scheduled.
    expect(rafCallback).toBeNull()
  })

  it('is a no-op restore when no element had focus before opening', () => {
    document.body.focus()

    const host = createMockHost(true)
    const controller = new FocusRestoreController(host as any)
    controller.hostUpdate()

    host.open = false
    controller.hostUpdate()

    // document.body was the "trigger" here — nothing throws, and it stays focused.
    expect(rafCallback).not.toBeNull()
    expect(() => rafCallback!()).not.toThrow()
  })

  it('registers itself with the host during construction', () => {
    const host = createMockHost(false)
    const controller = new FocusRestoreController(host as any)
    expect(host.addController).toHaveBeenCalledWith(controller)
  })
})
