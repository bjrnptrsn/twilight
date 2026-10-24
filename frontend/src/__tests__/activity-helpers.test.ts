import { describe, it, expect } from 'vitest'
import {
  getActivitySupportsExcludedSlots,
  getActivitySupportsAutoExpire,
  getActivitySupportsInputSuppression,
  getActivityHasRuleSupport,
  hasRuleCapabilityMismatch,
} from '../lib/activity-helpers'
import { type ActivityConfig, type RuleConfig } from '../lib/types'

describe('activity-helpers rule capabilities', () => {
  it('identifies slot activity capabilities correctly', () => {
    const slotAct: ActivityConfig = {
      id: 'slot_act',
      suppress_inputs: [],
      auto_expire: '00:05:00',
      action: { type: 'slot' },
    }

    expect(getActivitySupportsExcludedSlots(slotAct)).toBe(true)
    expect(getActivitySupportsAutoExpire(slotAct)).toBe(true)
    expect(getActivitySupportsInputSuppression(slotAct)).toBe(true)
    expect(getActivityHasRuleSupport(slotAct)).toBe(true)
  })

  it('identifies default (missing action) activity capabilities — auto_expire still supported, a null duration falls back to DEFAULT_AUTO_EXPIRE backend-side, it is not "disabled"', () => {
    const defaultAct: ActivityConfig = {
      id: 'default_act',
      suppress_inputs: [],
      auto_expire: null,
    }

    expect(getActivitySupportsExcludedSlots(defaultAct)).toBe(false)
    expect(getActivitySupportsAutoExpire(defaultAct)).toBe(true)
    expect(getActivitySupportsInputSuppression(defaultAct)).toBe(true)
    expect(getActivityHasRuleSupport(defaultAct)).toBe(true)
  })

  it('identifies light activity capabilities correctly', () => {
    const lightActWithTimer: ActivityConfig = {
      id: 'light_act',
      suppress_inputs: [],
      auto_expire: '00:10:00',
      action: { type: 'light', targets: ['light.room'] },
    }

    expect(getActivitySupportsExcludedSlots(lightActWithTimer)).toBe(false)
    expect(getActivitySupportsAutoExpire(lightActWithTimer)).toBe(true)
    expect(getActivitySupportsInputSuppression(lightActWithTimer)).toBe(true)
    expect(getActivityHasRuleSupport(lightActWithTimer)).toBe(true)

    // A null duration with auto_expire_enabled left unset (not explicitly
    // false) still gets a timer backend-side (DEFAULT_AUTO_EXPIRE fallback) —
    // rule auto-expire support follows the enabled flag, not the duration.
    const lightActDefaultDuration: ActivityConfig = {
      id: 'light_act_default_duration',
      suppress_inputs: [],
      auto_expire: null,
      action: { type: 'light', targets: ['light.room'] },
    }

    expect(getActivitySupportsExcludedSlots(lightActDefaultDuration)).toBe(false)
    expect(getActivitySupportsAutoExpire(lightActDefaultDuration)).toBe(true)
    expect(getActivitySupportsInputSuppression(lightActDefaultDuration)).toBe(true)
    expect(getActivityHasRuleSupport(lightActDefaultDuration)).toBe(true)
  })

  it('identifies auto_expire_enabled: false as not supporting rule auto-expire, even with a configured duration', () => {
    const disabledAct: ActivityConfig = {
      id: 'disabled_act',
      suppress_inputs: [],
      auto_expire: '00:05:00',
      auto_expire_enabled: false,
      action: { type: 'slot' },
    }

    expect(getActivitySupportsExcludedSlots(disabledAct)).toBe(true)
    expect(getActivitySupportsAutoExpire(disabledAct)).toBe(false)
    expect(getActivitySupportsInputSuppression(disabledAct)).toBe(true)
    expect(getActivityHasRuleSupport(disabledAct)).toBe(true)
  })

  it('identifies reset activity capabilities as false for all', () => {
    const resetAct: ActivityConfig = {
      id: 'reset_act',
      suppress_inputs: [],
      auto_expire: '00:05:00',
      action: { type: 'reset' },
    }

    expect(getActivitySupportsExcludedSlots(resetAct)).toBe(false)
    expect(getActivitySupportsAutoExpire(resetAct)).toBe(false)
    expect(getActivitySupportsInputSuppression(resetAct)).toBe(false)
    expect(getActivityHasRuleSupport(resetAct)).toBe(false)
  })

  it('returns false for null or undefined activity', () => {
    expect(getActivitySupportsExcludedSlots(null)).toBe(false)
    expect(getActivitySupportsAutoExpire(undefined)).toBe(false)
    expect(getActivitySupportsInputSuppression(null)).toBe(false)
    expect(getActivityHasRuleSupport(undefined)).toBe(false)
  })
})

describe('hasRuleCapabilityMismatch', () => {
  // hasRuleCapabilityMismatch reads the backend-set auto_disabled_reason flag
  // directly rather than re-deriving a mismatch from the rule's current fields
  // — this is what distinguishes an
  // auto-disabled rule from one the user disabled themselves, even when the
  // latter happens to have fields that would otherwise "look" mismatched.
  const anyActivities: ActivityConfig[] = []

  it('returns false for an enabled rule, even with auto_disabled_reason set', () => {
    const rule: RuleConfig = {
      id: 'rule_1',
      name: 'Test',
      enabled: true,
      applied_activities: ['act_reset'],
      excluded_slots_override: {},
      auto_disabled_reason: 'mismatch',
    }
    expect(hasRuleCapabilityMismatch(rule, anyActivities)).toBe(false)
  })

  it('returns false for a rule the user disabled themselves (no auto_disabled_reason), even if its fields would look mismatched', () => {
    const rule: RuleConfig = {
      id: 'rule_1',
      name: 'Test',
      enabled: false,
      applied_activities: ['act_reset'],
      excluded_slots_override: {},
      suppressed_inputs_override: ['some_input'],
    }
    expect(hasRuleCapabilityMismatch(rule, anyActivities)).toBe(false)
  })

  it('returns true for a disabled rule flagged auto_disabled_reason: "mismatch"', () => {
    const rule: RuleConfig = {
      id: 'rule_1',
      name: 'Test',
      enabled: false,
      applied_activities: ['act_reset'],
      excluded_slots_override: {},
      auto_disabled_reason: 'mismatch',
    }
    expect(hasRuleCapabilityMismatch(rule, anyActivities)).toBe(true)
  })

  it('returns false once auto_disabled_reason is cleared, even while still disabled', () => {
    const rule: RuleConfig = {
      id: 'rule_1',
      name: 'Test',
      enabled: false,
      applied_activities: ['act_reset'],
      excluded_slots_override: {},
      auto_disabled_reason: null,
    }
    expect(hasRuleCapabilityMismatch(rule, anyActivities)).toBe(false)
  })
})
