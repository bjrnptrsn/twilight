import type { ExtractedSlotInfo } from './api'
import { getChannelIds, getChannels } from './channel-helpers'
import type { AreaConfig, LabEntity, Slot } from './types'
import { channelDisplayName, minsToHHMM } from './utils'

export interface ExtractedLightRow {
  entity_id: string
  name: string
  domain: string
  dynamic: boolean
}

export interface ExtractedLightGroup {
  channelId: string
  slotId: string
  channelName: string
  slotLabel: string
  sceneName: string
  sceneEntityId: string
  sceneType: string
  supportsDynamic: boolean
  rows: ExtractedLightRow[]
}

/** Group what the engine extracted per slot for display, in channel and slot order. */
export function buildExtractedLightGroups(
  extracted: Record<string, ExtractedSlotInfo>,
  registry: LabEntity[],
  area: AreaConfig,
  channelSlots: Record<string, Slot[]>,
  lang?: string
): ExtractedLightGroup[] {
  const names = new Map(registry.map(e => [e.entity_id, e.name]))
  const groups: ExtractedLightGroup[] = []

  const channels = getChannels(area)

  for (const channelId of getChannelIds(area)) {
    const infos = Object.values(extracted).filter(info => info.channel_id === channelId)
    const slots = channelSlots[channelId] ?? []
    const position = (slotId: string) => {
      const index = slots.findIndex(s => s.id === slotId)
      return index === -1 ? slots.length : index
    }

    for (const info of [...infos].sort((a, b) => position(a.slot_id) - position(b.slot_id))) {
      const slot = slots.find(s => s.id === info.slot_id)
      groups.push({
        channelId,
        slotId: info.slot_id,
        channelName: channelDisplayName(channelId, channels[channelId]?.name, lang),
        slotLabel: slot ? `${slot.label} (${minsToHHMM(slot.from)})` : info.slot_id,
        sceneName: names.get(info.scene_entity_id) ?? info.scene_entity_id,
        sceneEntityId: info.scene_entity_id,
        sceneType: info.scene_type,
        supportsDynamic: info.supports_dynamic,
        rows: info.extracted.map(entityId => ({
          entity_id: entityId,
          name: names.get(entityId) ?? entityId,
          domain: entityId.split('.')[0],
          dynamic: info.dynamic_entities.includes(entityId),
        })),
      })
    }
  }
  return groups
}
