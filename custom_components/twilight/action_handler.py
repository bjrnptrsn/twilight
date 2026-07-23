"""Action handlers for Twilight control logic."""

from __future__ import annotations

import asyncio
import logging
import random
from abc import ABC, abstractmethod
from collections.abc import Callable, Coroutine
from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any, cast

from homeassistant.const import STATE_OFF
from homeassistant.helpers.event import async_call_later

from .call_handler import (
    BaseCallHandler,
    LightDirectCallHandler,
    SlotDirectCallHandler,
    TurnOffCallHandler,
)
from .config_model import (
    ActionConfig,
    EntityActionConfig,
    LightActionConfig,
    SlotActionConfig,
)
from .const import PRIMARY_CHANNEL_ID, ActionType
from .deviation import check_entity_deviation
from .helpers import channel_entities, create_tracked_task, get_slot_info

if TYPE_CHECKING:
    from .coordinator import Coordinator

_LOGGER = logging.getLogger(__name__)


def _channel_matches_slot(
    coordinator: Coordinator, channel_id: str, slot_id: str
) -> bool:
    """True if every entity of the channel already matches the slot's expected state."""
    scene_info = get_slot_info(coordinator.engine.scene_map, channel_id, slot_id)
    if not scene_info or not scene_info.expected_states:
        return False
    hass = coordinator.engine.hass
    for entity_id, expected in scene_info.expected_states.items():
        ha_state = hass.states.get(entity_id)
        if check_entity_deviation(ha_state, expected):
            return False
    return True


def _channel_already_off(coordinator: Coordinator, channel_id: str) -> bool:
    """True if every entity controlled by the channel is already off.

    Used to skip redundant turn_off_channel() calls for excluded slots — every
    activity_requested (e.g. repeated motion while the activity is already
    active) re-runs SlotActionHandler.start(), and _apply_action() clears all
    channel handlers beforehand, so a call-handler-type check can't detect
    "already turned off"; checking live entity state can.
    """
    entities = channel_entities(
        coordinator.engine.scene_map,
        channel_id,
        coordinator.engine.config.manual_only,
    )
    if not entities:
        return True
    hass = coordinator.engine.hass
    for entity_id in entities:
        ha_state = hass.states.get(entity_id)
        if check_entity_deviation(ha_state, {"state": STATE_OFF}):
            return False
    return True


class BaseActionHandler(ABC):
    """Abstract base class for all Twilight action handlers, providing execution infrastructure."""

    def __init__(self, coordinator: Coordinator) -> None:
        """Initialize the action handler."""
        self._coordinator = coordinator
        self.hass = coordinator.engine.hass
        self._timers: list[Callable[[], None]] = []
        self._tasks: set[asyncio.Task[Any]] = set()

    @property
    def pauses_slots(self) -> bool:
        """Return True if this handler overrides/pauses default slot scheduling."""
        return True

    def _start_timer(self, delay: float, callback: Callable[[], Any]) -> None:
        """Start a timer in the event loop that schedules a coroutine callback."""

        def _fire(_now: datetime) -> None:
            self._start_task(callback())

        unsub = async_call_later(self.hass, delay, _fire)
        self._timers.append(unsub)

    def _start_task(self, coro: Coroutine[Any, Any, Any]) -> asyncio.Task[Any] | None:
        """Start an asynchronous task and track it for cancellation."""
        return create_tracked_task(self.hass, coro, self._tasks)

    def cancel(self) -> None:
        """Cancel all running timers and tasks."""
        for unsub in self._timers:
            unsub()
        for t in list(self._tasks):
            t.cancel()
        self._timers.clear()
        self._tasks.clear()

    def _before_start(self) -> bool:
        """Lifecycle hook run before action starts."""
        return True

    def _after_stop(self) -> None:  # noqa: B027 -- optional hook, no-op by default
        """Lifecycle hook run after action stops."""

    @abstractmethod
    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Start execution of the action."""

    async def stop(self, release: ActionConfig, transition_off: int | None = None) -> None:
        """Standard release behavior for action handlers."""
        self.cancel()
        c = self._coordinator

        c.cancel_all_handlers()

        t = release.type or ActionType.TURN_OFF
        if t == ActionType.SLOT:
            c.update_state(scene_activated_at=datetime.now(UTC))
            c.lux_manager.update_lux_state()
            c.apply_all_channels_slots()
        else:
            c.update_state(scene_activated_at=None)
            c.lux_manager.update_lux_state()
            if t == ActionType.TURN_OFF:
                c.turn_off_all_channels(transition_off=transition_off)
        self._after_stop()


class SlotActionHandler(BaseActionHandler):
    """Handler that applies standard slot-based configuration across all channels."""

    @property
    def pauses_slots(self) -> bool:
        """SlotActionHandler does not pause standard slot scheduling."""
        return False

    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Apply slot-based scene configuration."""
        c = self._coordinator
        if not active_slots:
            return

        was_activated = c.run_state.scene_activated_at is not None

        c.update_state(
            scene_activated_at=c.run_state.scene_activated_at or datetime.now(UTC)
        )
        c.lux_manager.update_lux_state()

        excluded_slot_ids = cast(SlotActionConfig, action).excluded_slot_ids or {}

        for channel_id in c.channel_ids:
            slot_id = active_slots.get(channel_id)
            if not slot_id:
                continue
            if slot_id in excluded_slot_ids.get(channel_id, ()):
                if not _channel_already_off(c, channel_id):
                    c.turn_off_channel(channel_id, transition_off=transition_off)
            elif not was_activated:
                c.apply_channel_slot(channel_id, slot_id, direct=True)
            elif not _channel_matches_slot(c, channel_id, slot_id):
                c.reapply_deviating_slot(channel_id, slot_id)


class EntityActionHandler(BaseActionHandler):
    """Handler that applies a specific scene or script on the primary channel."""

    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Apply a scene or script."""
        c = self._coordinator
        entity_action = cast(EntityActionConfig, action)
        entity_id = entity_action.entity_id
        if entity_id:
            c.update_state(scene_activated_at=datetime.now(UTC))
            c.lux_manager.update_lux_state()
            handler = SlotDirectCallHandler(c.engine, PRIMARY_CHANNEL_ID, entity_id)
            c.swap_channel_handler(PRIMARY_CHANNEL_ID, handler, [])


class LightActionHandler(BaseActionHandler):
    """Handler that sets direct light parameters on the primary channel."""

    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Apply direct light settings."""
        c = self._coordinator
        c.update_state(scene_activated_at=datetime.now(UTC))
        c.lux_manager.update_lux_state()
        light_action = cast(LightActionConfig, action)
        targets = list(light_action.targets)
        if light_action.state == STATE_OFF:
            handler: BaseCallHandler = TurnOffCallHandler(
                c.engine, PRIMARY_CHANNEL_ID, transition_off=transition_off
            )
            c.swap_channel_handler(PRIMARY_CHANNEL_ID, handler, targets)
            return
        handler = LightDirectCallHandler(c.engine, PRIMARY_CHANNEL_ID)
        c.swap_channel_handler(PRIMARY_CHANNEL_ID, handler, targets, action)


class NoneActionHandler(BaseActionHandler):
    """Handler that does not affect light states on start, keeping standard release."""

    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Do nothing on start."""
        pass


class TurnOffActionHandler(BaseActionHandler):
    """Handler that turns off all channels on start."""

    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Turn off all channels."""
        c = self._coordinator
        c.update_state(scene_activated_at=None)
        c.lux_manager.update_lux_state()
        c.turn_off_all_channels(transition_off=transition_off)


class SimulationActionHandler(BaseActionHandler):
    """Handler representing presence simulation (future)."""

    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Start presence simulation."""
        if not self._before_start():
            return
        await self._next_step(action)

    async def _next_step(self, action: ActionConfig) -> None:
        """Trigger the next simulation step."""
        scene = self._pick_next_scene(action)
        c = self._coordinator
        handler = SlotDirectCallHandler(c.engine, PRIMARY_CHANNEL_ID, scene)
        c.swap_channel_handler(PRIMARY_CHANNEL_ID, handler, [])
        interval = self._random_interval(action)
        self._start_timer(interval, lambda: self._next_step(action))

    def _pick_next_scene(self, action: ActionConfig) -> str:
        """Pick next simulation scene."""
        c = self._coordinator
        scenes = [
            info.scene_entity_id
            for info in c.engine.scene_map.values()
            if info.scene_entity_id
        ]
        if not scenes:
            _LOGGER.warning(
                "[%s] SimulationActionHandler: No scenes configured or discovered in scene_map. Falling back to scene.dummy",
                c.engine.area_id,
            )
            return "scene.dummy"

        chosen = random.choice(scenes)
        _LOGGER.info(
            "[%s] SimulationActionHandler: Picked scene '%s' for next simulation step",
            c.engine.area_id,
            chosen,
        )
        return chosen

    def _random_interval(self, action: ActionConfig) -> float:
        """Generate random interval for simulation steps."""
        # Fallback to a randomized interval between 200 and 400 seconds to simulate real usage
        return random.uniform(200.0, 400.0)
