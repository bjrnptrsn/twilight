"""Rule manager for evaluating and enforcing Twilight rules."""

from __future__ import annotations

import logging
from collections.abc import Iterable
from typing import TYPE_CHECKING

from .config_model import RuleConfig, SlotActionConfig
from .const import RuleAutoExpireMode

if TYPE_CHECKING:
    from .config_model import AreaConfig
    from .coordinator import Coordinator
    from .state import RunState

_LOGGER = logging.getLogger(__name__)


def _matching_active_rules(
    rules: Iterable[RuleConfig], active_rules: dict[str, bool], activity_id: str
) -> list[RuleConfig]:
    return [
        rule
        for rule in rules
        if rule.id
        and active_rules.get(rule.id, False)
        and activity_id in rule.applied_activities
    ]


def effective_excluded_slots(
    rules: Iterable[RuleConfig],
    active_rules: dict[str, bool],
    activity_id: str,
    default_excluded: dict[str, tuple[str, ...]],
) -> dict[str, tuple[str, ...]]:
    """Excluded slot ids per channel once the active rules for an activity apply.

    Without a matching active rule the activity's own exclusions hold. Matching
    active rules REPLACE them with the union of their overrides (exclude wins),
    so a matching rule with an empty override lifts every exclusion.
    """
    matching = _matching_active_rules(rules, active_rules, activity_id)
    if not matching:
        return default_excluded

    merged_excluded: dict[str, set[str]] = {}
    for rule in matching:
        act_overrides = rule.excluded_slots_override.get(activity_id, {})
        for ch_id, excluded_slots in act_overrides.items():
            merged_excluded.setdefault(ch_id, set()).update(excluded_slots)

    return {ch_id: tuple(sorted(slots)) for ch_id, slots in merged_excluded.items()}


def _rule_timer_map(
    rules: Iterable[RuleConfig], active_rules: dict[str, bool], activity_id: str
) -> dict[str, tuple[RuleAutoExpireMode, bool | None, str | None]]:
    """Timer settings of the enabled active rules that act on an activity."""
    return {
        rule.id: (rule.auto_expire_mode, rule.auto_expire_enabled, rule.auto_expire)
        for rule in _matching_active_rules(rules, active_rules, activity_id)
        if rule.enabled
    }


class RuleManager:
    """Synchronous sub-manager for Twilight parallel rules.

    Evaluates rule activation state from inputs and provides effective
    slot overrides for active activities.
    """

    def __init__(self, coordinator: Coordinator) -> None:
        """Initialize the rule manager with a coordinator backreference."""
        self._c = coordinator

    def evaluate_active_rules(self) -> dict[str, bool]:
        """Rule activation from the current input states, without writing state."""
        engine = self._c.engine
        state = self._c.run_state
        new_active_rules: dict[str, bool] = {}

        for rule in engine.config.rules:
            if not rule.enabled or not rule.id or not rule.applied_activities:
                if rule.id:
                    new_active_rules[rule.id] = False
                continue

            # A rule is active if ANY input pointing at it (InputConfig.rule) is active
            # in state.inputs_active.
            trigger_input_ids = {
                inp.id for inp in engine.config.inputs if inp.rule == rule.id and inp.id
            }
            new_active_rules[rule.id] = any(
                state.inputs_active.get(input_id, False)
                and not self.is_input_disabled(input_id)
                for input_id in trigger_input_ids
            )
        return new_active_rules

    def reevaluate(self, apply: bool = True) -> None:
        """Re-evaluate active rules based on current input states.

        Updates state.active_rules. With ``apply`` a change also updates the
        auto-expire timer and re-applies the running activity; without it only
        the state is written (engine setup, where no handler can act yet).
        """
        engine = self._c.engine
        current_active_rules = self._c.run_state.active_rules
        new_active_rules = self.evaluate_active_rules()

        if new_active_rules == current_active_rules:
            return

        _LOGGER.debug(
            "[%s] Rule states updated: %s",
            engine.area_id,
            new_active_rules,
        )
        self._c.update_state(active_rules=new_active_rules)
        if not apply:
            return
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
                for rule in engine.config.rules
            )
            if affects_active_activity:
                self._c.reapply_active_activity_rules()

    def reconcile_active_rules(
        self,
        old_config: AreaConfig,
        old_run_state: RunState,
        *,
        action_changed: bool,
        skip_channels: set[str],
    ) -> None:
        """Apply what a rebuild changed about the rules acting on the running activity.

        Compares the replaced engine's rules and rule states with the new ones.
        Only the timer and the channels whose running slot changed its exclusion
        status are touched; every other lamp keeps its state.
        """
        c = self._c
        name = c.run_state.active_activity
        if not name:
            return
        new_config = c.engine.config

        if _rule_timer_map(
            old_config.rules, old_run_state.active_rules, name
        ) != _rule_timer_map(new_config.rules, c.run_state.active_rules, name):
            c.update_rule_auto_expire_timer()
            # The timer update can expire the activity on the spot.
            if c.run_state.active_activity != name:
                return

        if action_changed:
            # The re-dispatched start already reads the new exclusions.
            return

        old_activity = old_config.activity_by_id(name)
        new_activity = new_config.activity_by_id(name)
        old_action = old_activity.action if old_activity else None
        new_action = new_activity.action if new_activity else None
        if not isinstance(old_action, SlotActionConfig) or not isinstance(
            new_action, SlotActionConfig
        ):
            return

        old_effective = effective_excluded_slots(
            old_config.rules,
            old_run_state.active_rules,
            name,
            old_action.excluded_slots or {},
        )
        new_effective = effective_excluded_slots(
            new_config.rules,
            c.run_state.active_rules,
            name,
            new_action.excluded_slots or {},
        )
        # A channel that moved to another slot was applied by the slot change
        # under the new config already.
        changed_channels = {
            ch: slot_id
            for ch, slot_id in c.run_state.active_slots.items()
            if old_run_state.active_slots.get(ch) == slot_id
            and (slot_id in old_effective.get(ch, ()))
            != (slot_id in new_effective.get(ch, ()))
        }
        if changed_channels:
            c.apply_exclusion_delta(
                changed_channels,
                new_effective,
                c.get_activity_transition_off_seconds(name),
                skip_channels,
            )

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
        return effective_excluded_slots(
            self._c.engine.config.rules,
            self._c.run_state.active_rules,
            activity_id,
            default_excluded or {},
        )

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

        matching_active_rules = _matching_active_rules(
            self._c.engine.config.rules, state.active_rules, active_activity_id
        )

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
