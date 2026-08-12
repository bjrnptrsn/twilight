"""Rule manager for evaluating and enforcing Twilight rules."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .coordinator import Coordinator

_LOGGER = logging.getLogger(__name__)


class RuleManager:
    """Synchronous sub-manager for Twilight parallel rules.

    Evaluates rule activation state from inputs and provides effective
    slot overrides for active activities.
    """

    def __init__(self, coordinator: Coordinator) -> None:
        """Initialize the rule manager with a coordinator backreference."""
        self._c = coordinator

    def reevaluate(self) -> None:
        """Re-evaluate active rules based on current input states.

        Updates state.active_rules and triggers re-application if active rules changed.
        """
        engine = self._c.engine
        state = self._c.run_state
        rules = engine.config.rules

        current_active_rules = state.active_rules
        new_active_rules: dict[str, bool] = {}

        for rule in rules:
            if not rule.enabled or not rule.id:
                if rule.id:
                    new_active_rules[rule.id] = False
                continue

            # A rule is active if ANY input pointing at it (InputConfig.rule) is active
            # in state.inputs_active.
            trigger_input_ids = {
                inp.id for inp in engine.config.inputs if inp.rule == rule.id and inp.id
            }

            if not trigger_input_ids:
                is_active = False
            else:
                is_active = any(
                    state.inputs_active.get(input_id, False)
                    and not self.is_input_disabled(input_id)
                    for input_id in trigger_input_ids
                )
            new_active_rules[rule.id] = is_active

        if new_active_rules != current_active_rules:
            _LOGGER.debug(
                "[%s] Rule states updated: %s",
                engine.area_id,
                new_active_rules,
            )
            self._c.update_state(active_rules=new_active_rules)
            self._c.update_rule_auto_expire_timer()

            # Only re-apply if a rule that actually targets the running activity
            # flipped (activated or deactivated) — an unrelated rule's state change
            # must not cancel this activity's in-flight retry cycle for no reason
            # (see reapply_deviating_slot). This must check the DELTA, not the
            # resulting active state: a targeting rule's deactivation needs the
            # activity's excluded_slots re-applied too (to un-exclude the channel
            # again), so checking post-update active state alone would miss exactly
            # that case.
            active_activity_id = self._c.run_state.active_activity
            if active_activity_id:
                changed_rule_ids = {
                    rule_id
                    for rule_id, active in new_active_rules.items()
                    if active != current_active_rules.get(rule_id, False)
                }
                affects_active_activity = any(
                    rule.id in changed_rule_ids and active_activity_id in rule.applied_activities
                    for rule in rules
                )
                if affects_active_activity:
                    self._c.reapply_active_activity_rules()

    def is_input_disabled(self, input_id: str) -> bool:
        return self._c.is_input_disabled(input_id)

    def get_effective_excluded_slots(
        self,
        activity_id: str,
        default_excluded: dict[str, tuple[str, ...]] | None = None,
    ) -> dict[str, tuple[str, ...]]:
        """Calculate effective excluded slot IDs for a given activity.

        If any active rules target this activity, their excluded_slots_override are merged
        using 'exclude wins' (union of all excluded slot IDs for each channel).
        If no active rules target this activity, default_excluded is returned.
        """
        default_excluded = default_excluded or {}
        engine = self._c.engine
        state = self._c.run_state
        active_rules = state.active_rules

        matching_active_rules = [
            rule
            for rule in engine.config.rules
            if rule.id
            and active_rules.get(rule.id, False)
            and activity_id in rule.applied_activities
        ]

        if not matching_active_rules:
            return default_excluded

        # Merge excluded_slots_override across active matching rules using exclude-wins (union)
        merged_excluded: dict[str, set[str]] = {}

        for rule in matching_active_rules:
            act_overrides = rule.excluded_slots_override.get(activity_id, {})
            for ch_id, excluded_slots in act_overrides.items():
                if ch_id not in merged_excluded:
                    merged_excluded[ch_id] = set()
                merged_excluded[ch_id].update(excluded_slots)

        return {ch_id: tuple(sorted(slots)) for ch_id, slots in merged_excluded.items()}

    def get_effective_respect_manual_off(self, default: bool) -> bool:
        """Calculate effective respect_manual_off option for the currently active activity.

        Merge rule: 'respect wins' — True beats False.
        If any matching active rule has override is True -> True.
        Else if any matching active rule has override is False -> False.
        Else (all None or no active matching rules) -> default.
        """
        state = self._c.run_state
        active_activity_id = state.active_activity
        if not active_activity_id:
            return default

        active_rules = state.active_rules
        matching_active_rules = [
            rule
            for rule in self._c.engine.config.rules
            if rule.id
            and active_rules.get(rule.id, False)
            and active_activity_id in rule.applied_activities
        ]

        if not matching_active_rules:
            return default

        has_false = False
        for rule in matching_active_rules:
            if rule.respect_manual_off_override is True:
                return True
            if rule.respect_manual_off_override is False:
                has_false = True

        if has_false:
            return False

        return default

