import type { HomeAssistant, Area, AreaConfig, AreaSaveResult, LabEntity, GlobalConfig, PlaceholderDefaults, BackupPayload } from './types'
import type { SunDayResult, SunYearResult } from './sun-zones'

// One typed function per WS command — single point of change for backend
// WS-schema updates. Callers no longer construct `{ type: '...' }` messages
// inline.

export function areasList(hass: HomeAssistant): Promise<AreaConfig[]> {
  return hass.callWS<AreaConfig[]>({ type: 'twilight/areas/list' })
}

export function areaRegistryList(hass: HomeAssistant): Promise<Area[]> {
  return hass.callWS<Area[]>({ type: 'twilight/area_registry/list' })
}

export function areaNewDraft(hass: HomeAssistant, areaId: string): Promise<AreaConfig> {
  return hass.callWS<AreaConfig>({ type: 'twilight/areas/new_draft', area_id: areaId })
}

export function areaSave(hass: HomeAssistant, draft: AreaConfig): Promise<AreaSaveResult> {
  return hass.callWS<AreaSaveResult>({ type: 'twilight/area/save', ...draft })
}

export function areaDelete(hass: HomeAssistant, areaId: string): Promise<unknown> {
  return hass.callWS({ type: 'twilight/area/delete', area_id: areaId })
}

export interface ExtractedSlotInfo {
  channel_id: string
  slot_id: string
  extracted: string[]
  configured: string[]
}

export function areaExtracted(
  hass: HomeAssistant,
  areaId?: string
): Promise<Record<string, ExtractedSlotInfo> | Record<string, Record<string, ExtractedSlotInfo>>> {
  const msg: Record<string, unknown> = { type: 'twilight/area/extracted' }
  if (areaId) msg.area_id = areaId
  return hass.callWS(msg)
}

export function labAreaEntities(hass: HomeAssistant, areaId: string): Promise<LabEntity[]> {
  return hass.callWS<LabEntity[]>({ type: 'twilight/lab/area_entities', area_id: areaId })
}

export function globalGet(hass: HomeAssistant): Promise<GlobalConfig> {
  return hass.callWS<GlobalConfig>({ type: 'twilight/global/get' })
}

export function globalSave(hass: HomeAssistant, config: GlobalConfig): Promise<unknown> {
  return hass.callWS({ type: 'twilight/global/save', config })
}

export function globalExport(hass: HomeAssistant): Promise<BackupPayload> {
  return hass.callWS<BackupPayload>({ type: 'twilight/global/export' })
}

export function globalImport(hass: HomeAssistant, payload: BackupPayload): Promise<BackupPayload> {
  return hass.callWS<BackupPayload>({ type: 'twilight/global/import', payload })
}

export function globalDefaults(hass: HomeAssistant): Promise<GlobalConfig> {
  return hass.callWS<GlobalConfig>({ type: 'twilight/global/defaults' })
}


// const.py placeholder values shown (greyed) in empty edit-dialog fields.
// Pass area_id so min_slot_distance_minutes reflects that area's location.
export function placeholderDefaults(hass: HomeAssistant, areaId?: string): Promise<PlaceholderDefaults> {
  return hass.callWS<PlaceholderDefaults>({
    type: 'twilight/placeholder_defaults',
    ...(areaId ? { area_id: areaId } : {})
  })
}

export function sunDay(
  hass: HomeAssistant,
  params?: { date?: string; lat?: number; lon?: number; tz?: string }
): Promise<SunDayResult> {
  return hass.callWS<SunDayResult>({ type: 'twilight/sun/day', ...params })
}

export function sunYear(
  hass: HomeAssistant,
  params?: { year?: number; lat?: number; lon?: number; tz?: string }
): Promise<SunYearResult> {
  return hass.callWS<SunYearResult>({ type: 'twilight/sun/year', ...params })
}

export function areaSlotTimes(
  hass: HomeAssistant,
  params: { area_id: string; date?: string }
): Promise<import('./types').AreaSlotTimesResult> {
  return hass.callWS<import('./types').AreaSlotTimesResult>({ type: 'twilight/area/slot_times', ...params })
}

export function slotTimesPreview(
  hass: HomeAssistant,
  params: { slots: unknown[]; date?: string }
): Promise<import('./types').SlotTimesPreviewResult> {
  return hass.callWS<import('./types').SlotTimesPreviewResult>({ type: 'twilight/slot_times/preview', ...params })
}

export function timelineSlotTimes(
  hass: HomeAssistant,
  params?: { year?: number; lat?: number; lon?: number; tz?: string; area_id?: string }
): Promise<import('./types').TimelineSlotTimesResult> {
  return hass.callWS<import('./types').TimelineSlotTimesResult>({ type: 'twilight/timeline/slot_times', ...params })
}

export interface AnalyticsBinaryResult {
  motion: [number, number][]
  light_on: [number, number][]
}

export function analyticsGet(
  hass: HomeAssistant,
  params: { area_id: string; days: number; binary_only: true }
): Promise<AnalyticsBinaryResult> {
  return hass.callWS<AnalyticsBinaryResult>({ type: 'twilight/analytics/get', ...params })
}

export function triggerInput(
  hass: HomeAssistant,
  params: { area_id: string; input_id: string; active?: boolean }
): Promise<unknown> {
  return hass.callWS({ type: 'twilight/trigger_input', ...params })
}

// NOTE: there is no wrapper for `twilight/heatmap/compute` here. The command
// exists and is tested backend-side (websocket/heatmap.py), but the card gets
// its live data from `analyticsGet` and its snapshots from the saved profiles
// below — an unused wrapper only suggested a data path that isn't taken.

export function heatmapProfileList(
  hass: HomeAssistant,
  areaId: string
): Promise<import('./types').HeatmapProfileConfig[]> {
  return hass.callWS<import('./types').HeatmapProfileConfig[]>({ type: 'twilight/heatmap/profile/list', area_id: areaId })
}

export function heatmapProfileSave(
  hass: HomeAssistant,
  params: { area_id: string; name: string; resolution: string; range: string; profile_id?: string }
): Promise<import('./types').HeatmapProfileConfig> {
  return hass.callWS<import('./types').HeatmapProfileConfig>({ type: 'twilight/heatmap/profile/save', ...params })
}

export function heatmapProfileDelete(
  hass: HomeAssistant,
  params: { area_id: string; profile_id: string }
): Promise<{ success: boolean }> {
  return hass.callWS<{ success: boolean }>({ type: 'twilight/heatmap/profile/delete', ...params })
}

