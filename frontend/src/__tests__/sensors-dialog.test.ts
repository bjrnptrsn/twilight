import { describe, it, expect, vi } from 'vitest'
import '../components/sensors-dialog'
import type { SensorConfig } from '../lib/types'

async function makeEl() {
  const el = document.createElement('twilight-sensors-dialog') as any
  document.body.appendChild(el)
  await el.updateComplete
  return el
}

async function openWith(el: any, config: SensorConfig[]) {
  el.config = config
  el.open = true
  await el.updateComplete
}

function makeSensor(overrides: Partial<SensorConfig> = {}): SensorConfig {
  return {
    id: 's1', name: 'Outdoor', type: 'illuminance', entity_ids: ['sensor.lux1'],
    aggregation: 'min', ...overrides,
  }
}

describe('twilight-sensors-dialog', () => {
  it('renders nothing while closed', async () => {
    const el = await makeEl()
    expect(el.shadowRoot!.querySelector('.overlay')).toBeNull()
    el.remove()
  })

  it('clones `config` into a draft on open (does not mutate the prop array)', async () => {
    const el = await makeEl()
    const config = [makeSensor()]
    await openWith(el, config)

    expect(el._draftController.draft).toEqual(config)
    expect(el._draftController.draft).not.toBe(config)
    el.remove()
  })

  it('lists configured sensors by display name', async () => {
    const el = await makeEl()
    await openWith(el, [makeSensor({ name: 'Garden Lux' })])

    const rows = el.shadowRoot!.querySelectorAll('.sensor-row')
    expect(rows.length).toBe(1)
    expect(rows[0].textContent).toContain('Garden Lux')
    el.remove()
  })

  it('"Add Sensor" is disabled once an illuminance sensor already exists', async () => {
    const el = await makeEl()
    await openWith(el, [makeSensor()])

    const addBtn = el.shadowRoot!.querySelector('.btn-add') as HTMLButtonElement
    expect(addBtn.disabled).toBe(true)
    el.remove()
  })

  it('removing a sensor updates the draft, not the original config', async () => {
    const el = await makeEl()
    const config = [makeSensor()]
    await openWith(el, config)

    el._removeSensor(0)
    await el.updateComplete

    expect(el._draftController.draft).toHaveLength(0)
    expect(config).toHaveLength(1)
    el.remove()
  })

  it('opening the Add-sensor sub-dialog seeds an empty illuminance draft', async () => {
    const el = await makeEl()
    await openWith(el, [])

    el._openAddSensor()
    await el.updateComplete

    expect(el._subEditOpen).toBe(true)
    expect(el._editDraft).toEqual({ id: '', name: undefined, type: 'illuminance', entity_ids: [], aggregation: undefined })
    const titles = [...el.shadowRoot!.querySelectorAll('.panel-header-title')].map(n => n.textContent)
    expect(titles).toContain('+ Add Sensor')
    el.remove()
  })

  it('Add is disabled until at least one entity is selected', async () => {
    const el = await makeEl()
    await openWith(el, [])
    el._openAddSensor()
    await el.updateComplete

    const saveBtns = el.shadowRoot!.querySelectorAll('.btn-save-dialog') as NodeListOf<HTMLButtonElement>
    const subSaveBtn = saveBtns[saveBtns.length - 1]
    expect(subSaveBtn.disabled).toBe(true)

    el._editDraft = { ...el._editDraft, entity_ids: ['sensor.lux1'] }
    await el.updateComplete
    expect(subSaveBtn.disabled).toBe(false)
    el.remove()
  })

  it('saving the sub-edit appends a new sensor to the draft', async () => {
    const el = await makeEl()
    await openWith(el, [])
    el._openAddSensor()
    el._editDraft = { ...el._editDraft, entity_ids: ['sensor.lux1'] }
    await el.updateComplete

    el._saveSubEdit()
    await el.updateComplete

    expect(el._draftController.draft).toHaveLength(1)
    expect(el._subEditOpen).toBe(false)
    el.remove()
  })

  it('editing an existing sensor replaces it in place (not appended)', async () => {
    const el = await makeEl()
    await openWith(el, [makeSensor({ id: 's1', name: 'A' })])

    el._openEditSensor(0)
    el._editDraft = { ...el._editDraft, name: 'Renamed' }
    el._saveSubEdit()
    await el.updateComplete

    expect(el._draftController.draft).toHaveLength(1)
    expect(el._draftController.draft[0].name).toBe('Renamed')
    el.remove()
  })

  it('closing with Done dispatches sensors-changed with the draft, then close', async () => {
    const el = await makeEl()
    await openWith(el, [makeSensor()])
    el._removeSensor(0)
    await el.updateComplete

    const events: string[] = []
    el.addEventListener('sensors-changed', (e: CustomEvent) => { events.push('changed'); expect(e.detail).toEqual([]) })
    el.addEventListener('close', () => events.push('close'))

    el.shadowRoot!.querySelector('.panel-footer .btn-save-dialog')!.dispatchEvent(new Event('click', { bubbles: true }))

    expect(events).toEqual(['changed', 'close'])
    el.remove()
  })

  it('discarding (✕) does not dispatch sensors-changed', async () => {
    const el = await makeEl()
    await openWith(el, [makeSensor()])
    el._removeSensor(0)
    await el.updateComplete

    const onChanged = vi.fn()
    const onClose = vi.fn()
    el.addEventListener('sensors-changed', onChanged)
    el.addEventListener('close', onClose)

    el.shadowRoot!.querySelector('.panel-header .panel-close')!.dispatchEvent(new Event('click', { bubbles: true }))

    expect(onChanged).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledTimes(1)
    el.remove()
  })

  it('re-opening after close re-clones the (possibly changed) config', async () => {
    const el = await makeEl()
    await openWith(el, [makeSensor({ id: 's1' })])
    el.open = false
    await el.updateComplete
    expect(el._draftController.draft).toBeNull()

    await openWith(el, [makeSensor({ id: 's2' })])
    expect(el._draftController.draft[0].id).toBe('s2')
    el.remove()
  })
})
