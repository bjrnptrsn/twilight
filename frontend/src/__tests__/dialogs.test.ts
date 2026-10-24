import { describe, it, expect, vi } from 'vitest'
import '../components/dialogs'

async function makeEl(tag: string) {
  const el = document.createElement(tag) as any
  document.body.appendChild(el)
  await el.updateComplete
  return el
}

describe('twilight-alert-dialog', () => {
  it('renders nothing while closed', async () => {
    const el = await makeEl('twilight-alert-dialog')
    expect(el.shadowRoot!.querySelector('.overlay')).toBeNull()
    el.remove()
  })

  it('renders title and message while open', async () => {
    const el = await makeEl('twilight-alert-dialog')
    el.open = true
    el.dialogTitle = 'Heads up'
    el.message = 'Something happened'
    await el.updateComplete

    expect(el.shadowRoot!.querySelector('.modal-title')!.textContent).toBe('Heads up')
    expect(el.shadowRoot!.querySelector('.modal-body')!.textContent).toContain('Something happened')
    el.remove()
  })

  it('dispatches close on overlay click and on OK click', async () => {
    const el = await makeEl('twilight-alert-dialog')
    el.open = true
    await el.updateComplete

    const onClose = vi.fn()
    el.addEventListener('close', onClose)
    el.shadowRoot!.querySelector('.btn-save-dialog')!.dispatchEvent(new Event('click', { bubbles: true }))
    expect(onClose).toHaveBeenCalledTimes(1)

    el.shadowRoot!.querySelector('.overlay')!.dispatchEvent(new Event('click', { bubbles: true }))
    expect(onClose).toHaveBeenCalledTimes(2)
    el.remove()
  })

  it('clicking the modal card itself does not close (stopPropagation)', async () => {
    const el = await makeEl('twilight-alert-dialog')
    el.open = true
    await el.updateComplete

    const onClose = vi.fn()
    el.addEventListener('close', onClose)
    el.shadowRoot!.querySelector('.modal-card')!.dispatchEvent(new Event('click', { bubbles: true }))
    expect(onClose).not.toHaveBeenCalled()
    el.remove()
  })
})

describe('twilight-confirm-dialog', () => {
  it('dispatches confirm and cancel independently', async () => {
    const el = await makeEl('twilight-confirm-dialog')
    el.open = true
    await el.updateComplete

    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    el.addEventListener('confirm', onConfirm)
    el.addEventListener('cancel', onCancel)

    el.shadowRoot!.querySelector('.btn-save-dialog')!.dispatchEvent(new Event('click', { bubbles: true }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()

    el.shadowRoot!.querySelector('.btn-cancel-dialog')!.dispatchEvent(new Event('click', { bubbles: true }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    el.remove()
  })

  it('overlay click cancels, not confirms', async () => {
    const el = await makeEl('twilight-confirm-dialog')
    el.open = true
    await el.updateComplete

    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    el.addEventListener('confirm', onConfirm)
    el.addEventListener('cancel', onCancel)

    el.shadowRoot!.querySelector('.overlay')!.dispatchEvent(new Event('click', { bubbles: true }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
    el.remove()
  })
})

describe('twilight-prompt-dialog', () => {
  it('seeds the input from `value` each time it opens', async () => {
    const el = await makeEl('twilight-prompt-dialog')
    el.value = 'Living Room'
    el.open = true
    await el.updateComplete

    const input = el.shadowRoot!.querySelector('.prompt-input') as HTMLInputElement
    expect(input.value).toBe('Living Room')
    el.remove()
  })

  it('typing updates the local draft without touching `value`', async () => {
    const el = await makeEl('twilight-prompt-dialog')
    el.value = 'Living Room'
    el.open = true
    await el.updateComplete

    const input = el.shadowRoot!.querySelector('.prompt-input') as HTMLInputElement
    input.value = 'Kitchen'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await el.updateComplete

    expect(el.value).toBe('Living Room')
    expect(el._currentValue).toBe('Kitchen')
    el.remove()
  })

  it('submits the edited draft value on confirm, not the original prop', async () => {
    const el = await makeEl('twilight-prompt-dialog')
    el.value = 'Living Room'
    el.open = true
    await el.updateComplete

    const input = el.shadowRoot!.querySelector('.prompt-input') as HTMLInputElement
    input.value = 'Kitchen'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await el.updateComplete

    const onSubmit = vi.fn()
    el.addEventListener('submit', onSubmit)
    el.shadowRoot!.querySelector('.btn-save-dialog')!.dispatchEvent(new Event('click', { bubbles: true }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].detail).toEqual({ value: 'Kitchen' })
    el.remove()
  })

  it('Enter confirms, Escape cancels', async () => {
    const el = await makeEl('twilight-prompt-dialog')
    el.open = true
    await el.updateComplete

    const onSubmit = vi.fn()
    const onCancel = vi.fn()
    el.addEventListener('submit', onSubmit)
    el.addEventListener('cancel', onCancel)

    const input = el.shadowRoot!.querySelector('.prompt-input') as HTMLInputElement
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(onSubmit).toHaveBeenCalledTimes(1)

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    el.remove()
  })

  it('re-opening after value changed re-seeds the draft (willUpdate)', async () => {
    const el = await makeEl('twilight-prompt-dialog')
    el.value = 'Living Room'
    el.open = true
    await el.updateComplete
    el.open = false
    await el.updateComplete

    el.value = 'Bathroom'
    el.open = true
    await el.updateComplete

    const input = el.shadowRoot!.querySelector('.prompt-input') as HTMLInputElement
    expect(input.value).toBe('Bathroom')
    el.remove()
  })
})
