import type { LabEntity } from './types'

const normalizeForSearch = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/** Whether an entity's id or name contains the area's id or name. */
export function namesArea(e: LabEntity, areaId: string, areaName: string): boolean {
  const entityId = normalizeForSearch(e.entity_id)
  const name = normalizeForSearch(e.name || '')
  return [areaId, areaName]
    .filter(Boolean)
    .map(normalizeForSearch)
    .some(term => entityId.includes(term) || name.includes(term))
}

/** Scenes and scripts of an area: assigned to it, or naming it in their id or
 *  name. Entities whose id is in `keep` stay in regardless. */
export function areaSceneIds(
  entities: LabEntity[],
  areaId: string,
  areaName: string,
  keep: Set<string>
): Set<string> {
  return new Set(
    entities
      .filter(e => e.domain === 'scene' || e.domain === 'script')
      .filter(e => e.in_area || keep.has(e.entity_id) || namesArea(e, areaId, areaName))
      .map(e => e.entity_id)
  )
}
