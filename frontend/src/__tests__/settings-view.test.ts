import { describe, it, expect, vi } from 'vitest'
import '../views/settings-view'
import { STANDARD_ZONE_IDS, type GlobalConfig, type PlaceholderDefaults } from '../lib/types'

function makeHass(overrides: { globalConfig?: GlobalConfig } = {}) {
  const globalConfig: GlobalConfig = overrides.globalConfig ?? { area_template: {} }
  const placeholderDefaults: PlaceholderDefaults = {
    auto_expire: '00:05:00',
    transition_on_seconds: 60,
    transition_off_seconds: 5,
    lux_threshold: 50,
    lux_watch_window: 300,
    min_slot_distance_minutes: 10,
    max_offset_minutes: 180,
  }
  const callWS = vi.fn((msg: { type: string }) => {
    switch (msg.type) {
      case 'twilight/global/get':
        return Promise.resolve(structuredClone(globalConfig))
      case 'twilight/placeholder_defaults':
        return Promise.resolve(placeholderDefaults)
      case 'twilight/global/save':
        return Promise.resolve(undefined)
      case 'twilight/slot_times/preview':
        return Promise.resolve({ slots: [] })
      default:
        return Promise.resolve(undefined)
    }
  })
  return { callWS, states: {} } as any
}

async function makeView(hass: any) {
  const el = document.createElement('twilight-settings-view') as any
  document.body.appendChild(el)
  el.hass = hass
  await el.updateComplete
  // _loadData() is async (two awaited callWS round-trips) — flush the
  // microtask queue until the draft controller has finished loading.
  for (let i = 0; i < 10 && el._draftController.loading; i++) {
    await Promise.resolve()
    await el.updateComplete
  }
  await el.updateComplete
  return el
}

/** All 10 standard zones as editor-style slots, with per-zone overrides applied. */
function templateSlots(
  overrides: Record<string, { scene?: string | null; startOffset?: number }> = {},
) {
  return STANDARD_ZONE_IDS.map(id => ({
    id,
    label: id,
    color: '#fff',
    from: 0,
    to: 0,
    scene: overrides[id]?.scene ?? null,
    isCustom: false,
    startType: 'astral' as const,
    startEvent: id,
    startOffset: overrides[id]?.startOffset ?? 0,
  }))
}

describe('twilight-settings-view', () => {
  it('loads the global config on first hass assignment', async () => {
    const hass = makeHass()
    const el = await makeView(hass)

    expect(hass.callWS).toHaveBeenCalledWith(expect.objectContaining({ type: 'twilight/global/get' }))
    expect(el._draftController.draft).toEqual({ area_template: {} })
    el.remove()
  })

  it('does not reload on a second hass assignment (loads once)', async () => {
    const hass = makeHass()
    const el = await makeView(hass)
    const callsAfterFirstLoad = hass.callWS.mock.calls.length

    el.hass = { ...hass }
    await el.updateComplete

    expect(hass.callWS.mock.calls.length).toBe(callsAfterFirstLoad)
    el.remove()
  })

  it('hasUnsavedChanges reflects the draft controller dirty state', async () => {
    const hass = makeHass()
    const el = await makeView(hass)
    expect(el.hasUnsavedChanges).toBe(false)

    el._draftController.update({ area_template: { inputs: [] } })
    expect(el.hasUnsavedChanges).toBe(true)
    el.remove()
  })

  it('_cancelChanges reverts an edited draft back to the loaded original', async () => {
    const hass = makeHass()
    const el = await makeView(hass)

    el._draftController.update({ area_template: { inputs: [] } })
    expect(el._draftController.draft.area_template).toEqual({ inputs: [] })

    el._cancelChanges()
    expect(el._draftController.draft).toEqual({ area_template: {} })
    expect(el.hasUnsavedChanges).toBe(false)
    el.remove()
  })

  it('_saveSettings persists the draft via global/save and clears dirty', async () => {
    const hass = makeHass()
    const el = await makeView(hass)

    el._draftController.update({ area_template: { inputs: [] } })
    await el._saveSettings()

    expect(hass.callWS).toHaveBeenCalledWith(expect.objectContaining({
      type: 'twilight/global/save',
      config: expect.objectContaining({ area_template: { inputs: [] } }),
    }))
    expect(el.hasUnsavedChanges).toBe(false)
    el.remove()
  })

  it('adding a template channel slugifies the name and selects it', async () => {
    const hass = makeHass()
    const el = await makeView(hass)

    await el._onTemplateChannelAdded(new CustomEvent('channel-added', { detail: { name: 'Kids Room!' } }))

    const channels = el._draftController.draft.area_template.custom_channels
    expect(Object.keys(channels)).toEqual(['kids_room'])
    expect(channels.kids_room).toEqual({ name: 'Kids Room!', enabled: true, slots: [] })
    expect(el._selectedChannelId).toBe('kids_room')
    el.remove()
  })

  it('adding a template channel with a name that already exists shows an alert and does not add it', async () => {
    const hass = makeHass({
      globalConfig: {
        area_template: { custom_channels: { kitchen: { name: 'Kitchen', enabled: true, slots: [] } } },
      },
    })
    const el = await makeView(hass)

    // showAlert() only resolves once the alert dialog is dismissed by the
    // user — don't await the handler itself, just let the alert open.
    void el._onTemplateChannelAdded(new CustomEvent('channel-added', { detail: { name: 'Kitchen' } }))
    await Promise.resolve()
    await el.updateComplete

    expect(el._dialog.alertOpen).toBe(true)
    expect(el._dialog.alertMessage).toContain('Kitchen')
    expect(Object.keys(el._draftController.draft.area_template.custom_channels)).toEqual(['kitchen'])
    el.remove()
  })

  it('deleting a template channel removes it and falls back to the Primary channel', async () => {
    const hass = makeHass({
      globalConfig: {
        area_template: { custom_channels: { kitchen: { name: 'Kitchen', enabled: true, slots: [] } } },
      },
    })
    const el = await makeView(hass)
    el._selectedChannelId = 'kitchen'

    await el._onTemplateChannelDeleted(new CustomEvent('channel-deleted', { detail: { channelId: 'kitchen' } }))

    expect(el._draftController.draft.area_template.custom_channels).toEqual({})
    expect(el._selectedChannelId).toBe('primary')
    el.remove()
  })

  it('_saveStatusText reflects saving/error/dirty/clean states', async () => {
    const hass = makeHass()
    const el = await makeView(hass)

    expect(el._saveStatusText()).toBe('All changes saved')

    el._draftController.update({ area_template: { inputs: [] } })
    expect(el._saveStatusText()).toBe('Unsaved changes')

    el._draftController.saving = true
    expect(el._saveStatusText()).toBe('Saving…')

    el._draftController.saving = false
    el._draftController.saveError = new Error('network down')
    expect(el._saveStatusText()).toBe('Save failed: network down')
    el.remove()
  })

  it('clearing a primary template slot override removes it from the draft (rebuild, not merge)', async () => {
    const hass = makeHass({
      globalConfig: {
        area_template: {
          primary_slots: {
            gold_dusk: { offset_minutes: 30, scene_entity_id: 'scene.foo' },
          },
        },
      },
    })
    const el = await makeView(hass)
    expect(el._draftController.draft.area_template.primary_slots).toEqual({
      gold_dusk: { offset_minutes: 30, scene_entity_id: 'scene.foo' },
    })

    // All 10 zones with gold_dusk back at defaults (offset 0, no scene) —
    // exactly what the slot editor sends after the user empties that zone.
    await el._onTemplatePrimarySlotsChanged(new CustomEvent('slots-changed', { detail: { slots: templateSlots() } }))

    expect(el._draftController.draft.area_template.primary_slots).toEqual({})
    el.remove()
  })

  it('keeps non-default overrides of untouched zones when saving the template', async () => {
    const hass = makeHass({
      globalConfig: {
        area_template: {
          primary_slots: {
            gold_dusk: { offset_minutes: 30, scene_entity_id: 'scene.foo' },
          },
        },
      },
    })
    const el = await makeView(hass)

    await el._onTemplatePrimarySlotsChanged(new CustomEvent('slots-changed', {
      detail: { slots: templateSlots({ gold_dusk: { scene: 'scene.foo', startOffset: 30 } }) },
    }))

    expect(el._draftController.draft.area_template.primary_slots).toEqual({
      gold_dusk: { offset_minutes: 30, scene_entity_id: 'scene.foo' },
    })
    el.remove()
  })

  it('round-trips configured_entities and dynamic-Hue override fields through display and writer', async () => {
    const hass = makeHass({
      globalConfig: {
        area_template: {
          primary_slots: {
            gold_dusk: {
              offset_minutes: 30,
              scene_entity_id: 'scene.foo',
              configured_entities: ['light.a', 'light.b'],
              hue_activate_dynamic: true,
              hue_dynamic_speed: 3,
            },
          },
        },
      },
    })
    const el = await makeView(hass)

    // The editor display must carry the fields back from the sparse overrides…
    const goldDuskDisplay = el._primaryDisplaySlots().find((s: any) => s.id === 'gold_dusk')
    expect(goldDuskDisplay.configured_entities).toEqual(['light.a', 'light.b'])
    expect(goldDuskDisplay.hue_activate_dynamic).toBe(true)
    expect(goldDuskDisplay.hue_dynamic_speed).toBe(3)

    // …so a save through the writer keeps them instead of dropping them.
    await el._onTemplatePrimarySlotsChanged(new CustomEvent('slots-changed', {
      detail: { slots: el._primaryDisplaySlots() },
    }))
    expect(el._draftController.draft.area_template.primary_slots.gold_dusk).toEqual({
      offset_minutes: 30,
      scene_entity_id: 'scene.foo',
      configured_entities: ['light.a', 'light.b'],
      hue_activate_dynamic: true,
      hue_dynamic_speed: 3,
    })
    el.remove()
  })
})
