"""Coordinator facade for Twilight control logic."""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Callable, Coroutine
from datetime import UTC, datetime, timedelta
from typing import TYPE_CHECKING, Any, Literal

from homeassistant.util import dt as dt_util

from .call_handler import (
    BaseCallHandler,
    LightCallHandler,
    SceneCallHandler,
)
from .config_model import (
    ActionConfig,
    ActivityConfig,
)
from .coordinator_activity import ActivityCoordinator
from .coordinator_slot import SlotCoordinator
from .helpers import (
    create_tracked_task,
    get_store,
)
from .input_state_manager import InputStateManager
from .lux_manager import LuxManager
from .rule_manager import RuleManager
from .state import RunState

if TYPE_CHECKING:
    from .engine import TwilightEngine

_LOGGER = logging.getLogger(__name__)


class Coordinator:
    """Orchestrates control logic and actions for a Twilight area engine (Facade)."""

    def __init__(self, engine: TwilightEngine) -> None:
        """Initialize the coordinator facade."""
        self.engine = engine
        self._tasks: set[asyncio.Task[Any]] = set()

        # Shared cross-boundary state: conflict-guard for fades
        self._fade_target_slot: dict[str, tuple[str, datetime]] = {}

        # Sub-managers for specialized business logics
        self.lux_manager = LuxManager(self)
        self.input_manager = InputStateManager(self)
        self.rule_manager = RuleManager(self)

        # Sub-coordinators
        self.activity = ActivityCoordinator(self)
        self.slot = SlotCoordinator(self)

        self.unsub_state: Callable[[], None] | None = (
            self.engine.state_manager.add_listener(self._on_state_changed)
        )

    # ── Properties & Kern ──
    @property
    def channel_ids(self) -> list[str]:
        """All configured channel ids for this area."""
        return self.slot.channel_ids

    @property
    def pauses_slots(self) -> bool:
        """True if current active handler pauses slot fades/changes."""
        return self.activity.pauses_slots

    @property
    def has_busy_handler(self) -> bool:
        """True if any channel handler is currently busy executing or settling."""
        return self.slot.has_busy_handler

    @property
    def run_state(self) -> RunState:
        """Helper to get current run state."""
        return self.engine.state_manager.state

    def scene_handler(self, channel_id: str) -> SceneCallHandler | None:
        """The long-lived SceneCallHandler for a channel."""
        return self.slot.scene_handler(channel_id)

    def light_handler(self, channel_id: str) -> LightCallHandler | None:
        """The long-lived LightCallHandler for a channel."""
        return self.slot.light_handler(channel_id)

    def cancel_all_handlers(self) -> None:
        """Cancel all channel handlers."""
        self.slot.cancel_all_handlers()

    def _create_task(self, coro: Coroutine[Any, Any, Any]) -> asyncio.Task[Any] | None:
        """Create a tracked task to prevent fire-and-forget memory leak or unhandled exceptions."""
        return create_tracked_task(self.engine.hass, coro, self._tasks)

    def _on_state_changed(self, old_state: RunState, new_state: RunState) -> None:
        """Handle state changes and persist to store if relevant."""
        if (
            old_state.activity_expires_at != new_state.activity_expires_at
            or old_state.active_activity != new_state.active_activity
            or old_state.activity_expire_frozen_seconds != new_state.activity_expire_frozen_seconds
            or old_state.activity_expire_source != new_state.activity_expire_source
        ):
            store = get_store(self.engine.hass)
            if not store:
                _LOGGER.warning(
                    "[%s] Store not found, cannot persist state",
                    self.engine.area_id,
                )
                return

            state_dict = {
                "activity_expires_at": new_state.activity_expires_at.isoformat()
                if new_state.activity_expires_at
                else None,
                "active_activity": new_state.active_activity,
                "activity_expire_frozen_seconds": (
                    new_state.activity_expire_frozen_seconds
                ),
                "activity_expire_source": new_state.activity_expire_source,
                "last_seen": datetime.now(UTC).timestamp(),
            }
            store.save_area_state(self.engine.area_id, state_dict)

    def update_state(self, **kwargs: Any) -> RunState:
        """Helper to update run state."""
        if "active_activity" in kwargs and "inputs_disabled_by" not in kwargs:
            kwargs = dict(kwargs)
            kwargs["inputs_disabled_by"] = self.input_manager.compute_disablers(
                kwargs["active_activity"],
                kwargs.get("active_rules", self.run_state.active_rules),
            )
        elif "active_rules" in kwargs and "inputs_disabled_by" not in kwargs:
            kwargs = dict(kwargs)
            kwargs["inputs_disabled_by"] = self.input_manager.compute_disablers(
                kwargs.get("active_activity", self.run_state.active_activity),
                kwargs["active_rules"],
            )
        return self.engine.state_manager.update(**kwargs)

    # ── Delegation to Input/Lux Manager ──
    def initialize_inputs(self) -> None:
        """Delegated helper to initialize inputs disablers and active states."""
        self.input_manager.initialize_inputs()

    def update_input_active(self, input_id: str | None, active: bool) -> None:
        """Delegated helper to update the physical active state of an input."""
        self.input_manager.update_input_active(input_id, active)

    def lux_changed(self) -> None:
        """Signal that lux value has changed."""
        self.lux_manager.update_lux_state()

    # ── Delegation to ActivityCoordinator ──
    def is_respect_manual_off_active(self) -> bool:
        """Return True if the active activity uses a SlotAction with respect_manual_off enabled."""
        return self.activity.is_respect_manual_off_active()

    def is_input_disabled(self, input_id: str | None) -> bool:
        """Return True if the given input is currently disabled/suppressed."""
        return self.activity.is_input_disabled(input_id)

    def reapply_active_activity_rules(self) -> None:
        """Re-apply rules for the currently active activity if running."""
        self.activity.reapply_active_activity_rules()

    def activity_requested(
        self,
        name: str,
        input_id: str | None = None,
        input_type: str | None = None,
        entity_id: str | None = None,
    ) -> None:
        """Request/activate an activity in the area."""
        self.activity.activity_requested(name, input_id, input_type, entity_id)

    def activity_released(self, name: str) -> None:
        """Release/deactivate an activity in the area."""
        self.activity.activity_released(name)

    def get_activity_auto_expire_seconds(self, name: str) -> int | None:
        """Get the auto expire duration in seconds, or None if disabled."""
        return self.activity.get_activity_auto_expire_seconds(name)

    def get_activity_transition_off_seconds(self, name: str | None) -> int:
        """Get the transition off duration in seconds for an activity."""
        return self.activity.get_activity_transition_off_seconds(name)

    def update_rule_auto_expire_timer(self) -> None:
        """Update auto_expire timer state based on active rules for current activity."""
        self.activity.update_rule_auto_expire_timer()

    def get_activity_config(self, name: str) -> ActivityConfig | None:
        """Get the typed config for an activity, or None if not configured."""
        return self.activity.get_activity_config(name)

    def resolve_action(self, name: str) -> ActionConfig:
        """Resolve the start action for an activity."""
        return self.activity.resolve_action(name)

    def resolve_release_action(self, name: str) -> ActionConfig:
        """Resolve the release action for an activity."""
        return self.activity.resolve_release_action(name)

    # ── Delegation to SlotCoordinator ──
    def slots_changed(
        self, active_slots: dict[str, str], is_boot: bool = False
    ) -> None:
        """Signal that the active time slots (per channel) have changed."""
        self.slot.slots_changed(active_slots, is_boot)

    async def async_start_slot_fade(
        self, channel_id: str, target_slot_id: str, target_slot_start: datetime
    ) -> bool:
        """Start slot fade if slots are not paused for this channel and scene is active."""
        return await self.slot.async_start_slot_fade(
            channel_id, target_slot_id, target_slot_start
        )

    def swap_channel_handler(
        self,
        channel_id: str,
        handler: BaseCallHandler,
        run: Callable[[float], Coroutine[Any, Any, None]],
        *,
        fade_target_slot: str | None = None,
        fade_target_slot_start: datetime | None = None,
    ) -> None:
        """Cancel the channel's active call, hand it to `handler`, and run it."""
        self.slot.swap_channel_handler(
            channel_id,
            handler,
            run,
            fade_target_slot=fade_target_slot,
            fade_target_slot_start=fade_target_slot_start,
        )

    def reapply_deviating_slot(self, channel_id: str, slot_id: str) -> None:
        """Re-apply only the deviating entities of a slot scene, or fallback to full apply."""
        self.slot.reapply_deviating_slot(channel_id, slot_id)

    def turn_off_channel(
        self, channel_id: str, transition_off: int | None = None
    ) -> None:
        """Turn off a single channel's active-slot entities via TurnOffCallHandler."""
        self.slot.turn_off_channel(channel_id, transition_off=transition_off)

    def apply_channel_slot(
        self, channel_id: str, slot_id: str, direct: bool = False
    ) -> None:
        """Apply a single channel into its slot."""
        self.slot.apply_channel_slot(channel_id, slot_id, direct=direct)

    def apply_all_channels_slots(self, direct: bool = False) -> None:
        """Re-apply every channel into its current active slot (scene or off)."""
        self.slot.apply_all_channels_slots(direct=direct)

    def turn_off_all_channels(self, transition_off: int | None = None) -> None:
        """Turn off every channel's active-slot entities via TurnOffCallHandler."""
        self.slot.turn_off_all_channels(transition_off=transition_off)

    # ── Lifecycle (Orchestration) ──
    async def async_setup(self) -> None:
        """Set up the coordinator and restore timers."""
        self.lux_manager.update_lux_state()

        motion_active = bool(self.engine.motion_handler.active_entities)

        frozen_secs = self.run_state.activity_expire_frozen_seconds
        expires_at = self.run_state.activity_expires_at
        if frozen_secs is not None and self.run_state.active_activity:
            _LOGGER.info(
                "[%s] Restoring auto_expire frozen state of %.1fs for activity '%s'",
                self.engine.area_id,
                frozen_secs,
                self.run_state.active_activity,
            )
            self.input_manager.recalculate_disablers(
                self.run_state.active_activity, self.run_state.active_rules
            )
            self.activity.restore_active_handler(self.run_state.active_activity)
        elif expires_at:
            now = dt_util.utcnow()
            delay = (expires_at - now).total_seconds()
            if delay > 0:
                _LOGGER.info(
                    "[%s] Restoring auto_expire timer with remaining delay of %.1fs",
                    self.engine.area_id,
                    delay,
                )
                if self.run_state.active_activity:
                    self.activity.start_auto_expire_timer(
                        self.run_state.active_activity, int(delay)
                    )
                    self.input_manager.recalculate_disablers(
                        self.run_state.active_activity, self.run_state.active_rules
                    )
                    self.activity.restore_active_handler(
                        self.run_state.active_activity
                    )
            elif self.run_state.active_activity and self.activity.check_still_active(
                self.run_state.active_activity
            ):
                name = self.run_state.active_activity
                _LOGGER.info(
                    "[%s] Persisted activity '%s' expired during downtime, but an "
                    "input is still active — prolonging instead of turning off",
                    self.engine.area_id,
                    name,
                )
                self.input_manager.recalculate_disablers(
                    name, self.run_state.active_rules
                )
                self.activity.restore_active_handler(name)
                expire_secs = self.activity.get_effective_expire_seconds(name)
                if expire_secs:
                    native_secs = self.activity.get_activity_auto_expire_seconds(name)
                    source: Literal["activity", "rule"] = (
                        "activity" if native_secs is not None else "rule"
                    )
                    self.update_state(
                        activity_expires_at=dt_util.utcnow()
                        + timedelta(seconds=expire_secs),
                        activity_expire_source=source,
                    )
                    self.activity.start_auto_expire_timer(name, expire_secs)
                else:
                    self.update_state(
                        activity_expires_at=None, activity_expire_source=None
                    )
            else:
                _LOGGER.info(
                    "[%s] Persisted activity expired during downtime.",
                    self.engine.area_id,
                )
                self.update_state(
                    activity_expires_at=None,
                    activity_trigger=None,
                    active_activity=None,
                    scene_activated_at=None,
                )
                self.lux_manager.update_lux_state()
                self.slot.turn_off_all_channels()
        elif self.run_state.active_activity:
            self.input_manager.recalculate_disablers(
                self.run_state.active_activity, self.run_state.active_rules
            )
            self.activity.restore_active_handler(self.run_state.active_activity)

        self.update_state(
            motion_active=motion_active,
        )

    async def async_teardown(self) -> None:
        """Tear down the coordinator and clean up all sub-coordinators & tasks."""
        await self.activity.async_teardown()
        if self.unsub_state is not None:
            self.unsub_state()
            self.unsub_state = None

        pending = [task for task in self._tasks if not task.done()]
        for task in pending:
            task.cancel()
        if pending:
            await asyncio.gather(*pending, return_exceptions=True)
        self._tasks.clear()

        self.slot.cancel_all_handlers()
