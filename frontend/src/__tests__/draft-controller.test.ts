import { describe, it, expect, vi } from 'vitest'
import { DraftController } from '../lib/draft-controller'
import { DialogDraftController } from '../lib/dialog-draft-controller'
import { ReactiveControllerHost } from 'lit'

describe('DraftController', () => {
  // Create a mock ReactiveControllerHost
  const createMockHost = () => {
    return {
      addController: vi.fn(),
      removeController: vi.fn(),
      requestUpdate: vi.fn(),
      updateComplete: Promise.resolve(true),
    } as unknown as ReactiveControllerHost
  }

  interface TestConfig {
    name: string;
    config?: { active: boolean };
    count?: number;
  }

  it('registers itself with the host during construction', () => {
    const host = createMockHost()
    const controller = new DraftController<TestConfig>(host)
    expect(host.addController).toHaveBeenCalledWith(controller)
  })

  it('initializes with original and draft deep copied', () => {
    const host = createMockHost()
    const controller = new DraftController<TestConfig>(host)
    const initialValue: TestConfig = { name: 'Living Room', config: { active: true } }

    controller.init(initialValue)

    expect(controller.original).toEqual(initialValue)
    expect(controller.draft).toEqual(initialValue)
    // Verify it is a deep copy
    expect(controller.original).not.toBe(initialValue)
    expect(controller.original?.config).not.toBe(initialValue.config)
    expect(host.requestUpdate).toHaveBeenCalled()
  })

  it('reports isDirty correctly', () => {
    const host = createMockHost()
    const controller = new DraftController<TestConfig>(host)
    const initialValue = { name: 'Living Room' }

    expect(controller.isDirty).toBe(false)

    controller.init(initialValue)
    expect(controller.isDirty).toBe(false)

    controller.update({ name: 'Kitchen' })
    expect(controller.isDirty).toBe(true)

    controller.cancel()
    expect(controller.isDirty).toBe(false)
  })

  it('updates draft correctly using partial object or function mapper', () => {
    const host = createMockHost()
    const controller = new DraftController<TestConfig>(host)
    controller.init({ name: 'Living', count: 5 })

    // Update with partial object
    controller.update({ count: 10 })
    expect(controller.draft).toEqual({ name: 'Living', count: 10 })

    // Update with callback function
    controller.update((d) => {
      d.name = 'Kitchen'
    })
    expect(controller.draft).toEqual({ name: 'Kitchen', count: 10 })
  })

  it('function-form update keeps an edit made during an in-flight save', async () => {
    // The function form must produce a NEW draft reference, otherwise save()'s
    // `sent === this.draft` stale guard can never detect the concurrent edit and
    // the server result silently overwrites it.
    const host = createMockHost()
    let release!: (v: TestConfig) => void
    const controller = new DraftController<TestConfig>(host, {
      onSave: () => new Promise<TestConfig>((res) => { release = res }),
    })
    controller.init({ name: 'original', count: 0 })

    const savePromise = controller.save()
    controller.update((d) => {
      d.name = 'edited-while-saving'
    })

    release({ name: 'server-normalized', count: 0 })
    await savePromise

    expect(controller.draft?.name).toBe('edited-while-saving')
    expect(controller.isDirty).toBe(true)
  })

  it('function-form update stays dirty when onSave returns no result', async () => {
    const host = createMockHost()
    let release!: () => void
    const controller = new DraftController<TestConfig>(host, {
      onSave: () => new Promise<void>((res) => { release = () => res() }),
    })
    controller.init({ name: 'original', count: 0 })

    const savePromise = controller.save()
    controller.update((d) => {
      d.name = 'edited-while-saving'
    })

    release()
    await savePromise

    expect(controller.draft?.name).toBe('edited-while-saving')
    expect(controller.isDirty).toBe(true)
  })

  it('cancels changes and reverts to original', () => {
    const host = createMockHost()
    const controller = new DraftController<TestConfig>(host)
    controller.init({ name: 'Living Room' })

    controller.update({ name: 'Kitchen' })
    expect(controller.draft?.name).toBe('Kitchen')

    controller.cancel()
    expect(controller.draft?.name).toBe('Living Room')
    expect(controller.isDirty).toBe(false)
  })

  it('resets all states to null/default', () => {
    const host = createMockHost()
    const controller = new DraftController<TestConfig>(host)
    controller.init({ name: 'Living Room' })

    controller.reset()
    expect(controller.original).toBeNull()
    expect(controller.draft).toBeNull()
    expect(controller.saving).toBe(false)
    expect(controller.loading).toBe(false)
  })

  it('calls onSave and updates original on successful save', async () => {
    const host = createMockHost()
    const onSaveMock = vi.fn().mockResolvedValue(undefined)
    const controller = new DraftController<TestConfig>(host, { onSave: onSaveMock })
    
    controller.init({ name: 'Living Room' })
    controller.update({ name: 'Kitchen' })

    await controller.save()

    expect(controller.saving).toBe(false)
    expect(onSaveMock).toHaveBeenCalledWith({ name: 'Kitchen' })
    expect(controller.original?.name).toBe('Kitchen')
    expect(controller.isDirty).toBe(false)
  })

  it('updates draft and clears isDirty when onSave returns a new normalized object', async () => {
    const host = createMockHost()
    const savedResult: TestConfig = { name: 'Kitchen (Normalized)' }
    const onSaveMock = vi.fn().mockResolvedValue(savedResult)
    const controller = new DraftController<TestConfig>(host, { onSave: onSaveMock })

    controller.init({ name: 'Living Room' })
    controller.update({ name: 'Kitchen' })

    await controller.save()

    expect(controller.saving).toBe(false)
    expect(onSaveMock).toHaveBeenCalledWith({ name: 'Kitchen' })
    expect(controller.draft).toEqual(savedResult)
    expect(controller.original).toEqual(savedResult)
    expect(controller.isDirty).toBe(false)
  })

  it('keeps original unchanged and remains dirty if onSave fails', async () => {
    const host = createMockHost()
    const saveErr = new Error('Save failed')
    const onSaveMock = vi.fn().mockRejectedValue(saveErr)
    const controller = new DraftController<TestConfig>(host, { onSave: onSaveMock })

    controller.init({ name: 'Living Room' })
    controller.update({ name: 'Kitchen' })

    await controller.save()

    expect(controller.saving).toBe(false)
    expect(controller.original?.name).toBe('Living Room')
    expect(controller.draft?.name).toBe('Kitchen')
    expect(controller.isDirty).toBe(true)
    expect(controller.saveError).toBe(saveErr)
  })

  it('clears a previous saveError once a later save succeeds', async () => {
    const host = createMockHost()
    const onSaveMock = vi.fn()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(undefined)
    const controller = new DraftController<TestConfig>(host, { onSave: onSaveMock })

    controller.init({ name: 'Living Room' })
    await controller.save()
    expect(controller.saveError).not.toBeNull()

    await controller.save()
    expect(controller.saveError).toBeNull()
  })

  it('ignores a second save() call while one is already in flight', async () => {
    const host = createMockHost()
    let resolveSave: (() => void) | undefined
    const onSaveMock = vi.fn().mockImplementation(
      () => new Promise<void>((resolve) => { resolveSave = resolve })
    )
    const controller = new DraftController<TestConfig>(host, { onSave: onSaveMock })

    controller.init({ name: 'Living Room' })
    controller.update({ name: 'Kitchen' })

    const firstSave = controller.save()
    const secondSave = controller.save()

    expect(onSaveMock).toHaveBeenCalledTimes(1)

    resolveSave?.()
    await firstSave
    await secondSave

    expect(controller.saving).toBe(false)
  })

  it('reset() clears saveError', () => {
    const host = createMockHost()
    const controller = new DraftController<TestConfig>(host)
    controller.init({ name: 'Living Room' })
    controller.saveError = new Error('boom')

    controller.reset()

    expect(controller.saveError).toBeNull()
  })
})

describe('DialogDraftController', () => {
  it('closeAndSave skips saveEvent dispatch if isDirty is false', () => {
    const events: string[] = []
    const mockHost = {
      open: true,
      config: [{ id: 'motion_1' }],
      addController: vi.fn(),
      requestUpdate: vi.fn(),
      dispatchEvent: (e: Event) => {
        events.push(e.type)
        return true
      },
    }
    const dialogController = new DialogDraftController(mockHost as any)
    dialogController.hostUpdate()

    expect(dialogController.isDirty).toBe(false)
    dialogController.closeAndSave(new CustomEvent('save-event'))

    expect(events).toEqual(['close'])
  })

  it('closeAndSave dispatches saveEvent if isDirty is true', () => {
    const events: string[] = []
    const mockHost = {
      open: true,
      config: [{ id: 'motion_1' }],
      addController: vi.fn(),
      requestUpdate: vi.fn(),
      dispatchEvent: (e: Event) => {
        events.push(e.type)
        return true
      },
    }
    const dialogController = new DialogDraftController(mockHost as any)
    dialogController.hostUpdate()

    dialogController.draft = [{ id: 'motion_1' }, { id: 'motion_2' }]
    expect(dialogController.isDirty).toBe(true)
    dialogController.closeAndSave(new CustomEvent('save-event'))

    expect(events).toEqual(['save-event', 'close'])
  })
})
