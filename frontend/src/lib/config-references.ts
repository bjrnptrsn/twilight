import type { ActivityConfig, InputConfig, RuleConfig } from './types'

// The parts of an area config (or of the area template) that reference
// activities and rules by id. A list the config does not carry is left out of
// the result, so the template keeps its distinction between missing and empty.
export interface ReferenceLists {
  activities?: ActivityConfig[]
  inputs?: InputConfig[]
  rules?: RuleConfig[]
}

function removedIds(before: { id: string }[] | undefined, after: { id: string }[]): Set<string> {
  return new Set((before ?? []).map(item => item.id).filter(id => !after.some(item => item.id === id)))
}

function clearedInputs(
  inputs: InputConfig[] | undefined,
  field: 'activity' | 'rule',
  removed: Set<string>,
): Pick<ReferenceLists, 'inputs'> {
  if (!inputs) return {}
  return {
    inputs: inputs.map(inp => {
      const target = inp[field]
      return target && removed.has(target) ? { ...inp, [field]: null } : inp
    }),
  }
}

/**
 * The new activity list plus inputs and rules with every reference to a removed
 * activity cleared: a release handover falls back to none, a simulation loses
 * its template, an input loses its target, a rule no longer applies to it.
 */
export function withActivitiesReplaced(
  config: ReferenceLists,
  activities: ActivityConfig[],
): ReferenceLists {
  const removed = removedIds(config.activities, activities)
  const cleanedActivities = activities.map(act => {
    let next = act
    const release = act.release_action
    if (release?.type === 'activity' && release.activity && removed.has(release.activity)) {
      next = { ...next, release_action: { type: 'none' as const } }
    }
    const action = act.action
    if (action?.type === 'simulation' && action.template_activity && removed.has(action.template_activity)) {
      next = { ...next, action: { ...action, template_activity: '' } }
    }
    return next
  })
  const result: ReferenceLists = {
    activities: cleanedActivities,
    ...clearedInputs(config.inputs, 'activity', removed),
  }
  if (config.rules) {
    result.rules = config.rules.map(rule => {
      const hadTargets = (rule.applied_activities ?? []).length > 0
      const applied = (rule.applied_activities ?? []).filter(id => !removed.has(id))
      const excluded = { ...(rule.excluded_slots_override ?? {}) }
      for (const id of removed) delete excluded[id]
      return {
        ...rule,
        applied_activities: applied,
        excluded_slots_override: excluded,
        ...(hadTargets && applied.length === 0 ? { enabled: false } : {}),
      }
    })
  }
  return result
}

/** The new rule list plus inputs with every reference to a removed rule cleared. */
export function withRulesReplaced(config: ReferenceLists, rules: RuleConfig[]): ReferenceLists {
  const removed = removedIds(config.rules, rules)
  return { rules, ...clearedInputs(config.inputs, 'rule', removed) }
}

/** The new input list plus activities and rules with every reference to a removed input cleared. */
export function withInputsReplaced(config: ReferenceLists, inputs: InputConfig[]): ReferenceLists {
  const removed = removedIds(config.inputs, inputs)
  const result: ReferenceLists = { inputs }
  if (config.activities) {
    result.activities = config.activities.map(act =>
      act.suppress_inputs?.some(id => removed.has(id))
        ? { ...act, suppress_inputs: act.suppress_inputs.filter(id => !removed.has(id)) }
        : act,
    )
  }
  if (config.rules) {
    result.rules = config.rules.map(rule =>
      rule.suppressed_inputs_override?.some(id => removed.has(id))
        ? { ...rule, suppressed_inputs_override: rule.suppressed_inputs_override.filter(id => !removed.has(id)) }
        : rule,
    )
  }
  return result
}
