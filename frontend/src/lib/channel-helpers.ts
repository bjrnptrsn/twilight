import { type AreaConfig, type ChannelConfig, type SlotConfig, PRIMARY_CHANNEL_ID } from './types'

export function getChannels(cfg: AreaConfig): Record<string, ChannelConfig> {
  return cfg.channels || {}
}

/** Comparator putting the Primary channel first, leaving custom channels in order. */
export function byPrimaryFirst(a: string, b: string): number {
  return a === PRIMARY_CHANNEL_ID ? -1 : b === PRIMARY_CHANNEL_ID ? 1 : 0
}

/**
 * Ordered channel ids of a channels map: Primary first, then custom channels
 * in insertion order. Use this over a hand-rolled `.sort()` — cards that only
 * hold the channels map (not the whole AreaConfig) had their own copies.
 */
export function sortChannelIds(
  channels: Record<string, ChannelConfig> | null | undefined
): string[] {
  return Object.keys(channels || {}).sort(byPrimaryFirst)
}

/** Ordered channel ids: Primary first, then custom channels in insertion order. */
export function getChannelIds(cfg: AreaConfig): string[] {
  return sortChannelIds(getChannels(cfg))
}

/** Slots of a specific channel (empty if missing). */
export function getChannelSlots(cfg: AreaConfig, channelId: string): SlotConfig[] {
  return getChannels(cfg)[channelId]?.slots || []
}

/** Derive a channel id from its display name (lowercased, non-alphanumeric
 *  runs collapsed to a single underscore, leading/trailing underscores
 *  trimmed). Empty for a name with no alphanumeric characters at all. */
export function slugifyChannelId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}
