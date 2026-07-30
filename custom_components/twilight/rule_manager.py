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
            self._c.reapply_active_activity_rules()

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
