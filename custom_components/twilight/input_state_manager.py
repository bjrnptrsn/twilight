"""InputStateManager for Twilight coordinator."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN

from .const import ACTIVE_STATES, MOTION_ACTIVE_STATES, InputType
from .helpers import aggregate_active, resolve_aggregation

if TYPE_CHECKING:
    from .coordinator import Coordinator

_LOGGER = logging.getLogger(__name__)


class InputStateManager:
    """Manages activation, state, and disabler calculation for physical inputs."""

    def __init__(self, coordinator: Coordinator) -> None:
        """Initialize the InputStateManager."""
        self._c = coordinator

    def initialize_inputs(self) -> None:
        """Initialize inputs disablers and active states before handlers setup."""
        inputs_disabled_by = {}
        inputs_active = {}

        for inp in self._c.engine.config.inputs:
            if not inp.id:
                continue

            disablers = []
            if (
                inp.type not in (InputType.TIMER, InputType.BUTTON)
                and not inp.entity_ids
            ):
                disablers.append("no_entity")
            if inp.enabled is False:
                disablers.append("user")

            inputs_disabled_by[inp.id] = disablers

            active = False
            if (
                inp.entity_ids
                and self._c.engine.hass
                and inp.type
                in (
                    InputType.MOTION,
                    InputType.BINARY,
                )
            ):
                active_states = (
                    MOTION_ACTIVE_STATES
                    if inp.type == InputType.MOTION
                    else ACTIVE_STATES
                )
                flags = []
                for ent in inp.entity_ids:
                    state_obj = self._c.engine.hass.states.get(ent)
                    flags.append(
                        bool(
                            state_obj
                            and state_obj.state
                            not in (STATE_UNAVAILABLE, STATE_UNKNOWN)
                            and state_obj.state in active_states
                        )
                    )
                if inp.type == InputType.BINARY:
                    mode, count = resolve_aggregation(
                        self._c.engine.hass,
                        inp,
                        self._c.engine.config,
                        InputType.BINARY,
                    )
                    active = aggregate_active(flags, mode, count)
                else:
                    # Motion is always active if any entity is active — retrigger
                    # only affects re-triggering, not the aggregate active flag.
                    active = any(flags)
            inputs_active[inp.id] = active

        self._c.update_state(
            inputs_disabled_by=inputs_disabled_by,
            inputs_active=inputs_active,
        )
        self._c.rule_manager.reevaluate()

    def compute_disablers(self, active_activity: str | None) -> dict[str, list[str]]:
        """Compute activity-based disablers for all inputs, without writing state."""
        new_disabled_by = dict(self._c.run_state.inputs_disabled_by)
        for input_id in list(new_disabled_by.keys()):
            new_disabled_by[input_id] = [
                d for d in new_disabled_by[input_id] if not d.startswith("activity:")
            ]

        if active_activity:
            cfg = self._c.get_activity_config(active_activity)
            suppressed = cfg.suppress_inputs if cfg else ()
            for input_id in suppressed:
                disablers = list(new_disabled_by.get(input_id, []))
                disabler_str = f"activity:{active_activity}"
                if disabler_str not in disablers:
                    disablers.append(disabler_str)
                new_disabled_by[input_id] = disablers

        return new_disabled_by

    def recalculate_disablers(self, active_activity: str | None) -> None:
        """Recalculate and persist activity-based disablers for all inputs."""
        self._c.update_state(inputs_disabled_by=self.compute_disablers(active_activity))

    def update_input_active(self, input_id: str | None, active: bool) -> None:
        """Update the physical active state of an input in RunState."""
        inputs_active = dict(self._c.run_state.inputs_active)
        changed = False
        if input_id and inputs_active.get(input_id) != active:
            inputs_active[input_id] = active
            changed = True

        motion_active = bool(self._c.engine.motion_handler.active_entities)

        if changed or self._c.run_state.motion_active != motion_active:
            self._c.update_state(
                inputs_active=inputs_active,
                motion_active=motion_active,
            )
            self._c.rule_manager.reevaluate()
