"""Twilight area engine — orchestrates all modules for a single area."""

from __future__ import annotations

import logging
import time
from collections.abc import Callable
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.util import dt as dt_util

from .config_model import AreaConfig
from .const import SIGNAL_STATE_CHANGED
from .coordinator import Coordinator
from .helpers import SceneMap, get_store
from .hue_manager import HueManager
from .input_handler import (
    BinaryInputHandler,
    ButtonInputHandler,
    EventInputHandler,
    LightStateInputHandler,
    LuxInputHandler,
    MotionInputHandler,
    TimerInputHandler,
)
from .scene_manager import SceneManager
from .state import RunState, StateManager
from .twilight_manager import TwilightManager

_LOGGER = logging.getLogger(__name__)


class TwilightEngine:
    """The central orchestrator for a single Twilight Area.

    The TwilightEngine acts as the central coordinator and state machine interface for a
    specific Home Assistant Area. It bridges sensory inputs (motion, lux, binary, events,
    light states), schedules (slots), and scene controls (scenes, hues) together.

    This class manages:
      - State persistence & StateManager (RunState)
      - Sub-managers (Hue, Scene, Twilight, Activity, Heatmap)
      - Event and sensor input handlers (Motion, Lux, Binary sensors, HA Events, Light states)
      - Execution loop coordination (via the Coordinator)
    """

    def __init__(
        self,
        hass: HomeAssistant,
        area_id: str,
        config: dict[str, Any] | AreaConfig,
        initial_state: RunState | None = None,
    ) -> None:
        """Initialize the twilight area engine.

        Args:
            hass: Home Assistant core instance.
            area_id: The unique identifier for this twilight area.
            config: The configuration for this area — the raw (store-normalized)
                dict, parsed once here into the immutable typed AreaConfig.
        """
        self.hass = hass
        self.area_id = area_id
        self.config: AreaConfig = (
            config if isinstance(config, AreaConfig) else AreaConfig.from_dict(config)
        )
        # Cached once per engine (config is immutable for its lifetime — a
        # config change rebuilds the engine, see AreaConfig's docstring) so
        # echo.identify_echo()'s per-event callers (LightStateInputHandler,
        # BaseCallHandler's deviation watcher) don't rebuild this set on
        # every light state-changed event. Named distinctly from
        # Coordinator.channel_ids (a list, computed fresh on each access) to
        # avoid confusing the two.
        self.channel_id_set: frozenset[str] = frozenset(self.config.channels.keys())

        if initial_state is None:
            # Retrieve and restore previously persisted state if available in the store
            store = get_store(hass)
            saved_state = store.get_area_state(area_id) if store else None

            if isinstance(saved_state, dict):
                expires_str = saved_state.get("activity_expires_at")
                expires_at = (
                    dt_util.parse_datetime(expires_str)
                    if isinstance(expires_str, str)
                    else None
                )
                # A rule-frozen timer has no activity_expires_at at all — the
                # pending duration lives solely in activity_expire_frozen_seconds
                # (see Coordinator.activity_requested). Restoring it is what lets
                # Coordinator.async_setup() take the frozen branch instead of
                # leaving the activity running with no timer at all.
                frozen_raw = saved_state.get("activity_expire_frozen_seconds")
                frozen_secs = (
                    float(frozen_raw) if isinstance(frozen_raw, (int, float)) else None
                )
                source_raw = saved_state.get("activity_expire_source")
                source = (
                    source_raw if source_raw in ("activity", "rule") else None
                )
                initial_state = RunState(
                    activity_expires_at=expires_at,
                    active_activity=saved_state.get("active_activity"),
                    activity_expire_frozen_seconds=frozen_secs,
                    activity_expire_source=source,
                )

        # Initialize StateManager and core Coordinator
        self.state_manager = StateManager(initial_state=initial_state)
        self._unsub_dispatch: Callable[[], None] | None = (
            self.state_manager.add_listener(self._dispatch_state_change)
        )
        self.coordinator = Coordinator(self)

        # Initialize business logic managers
        self.hue_manager = HueManager(self)
        self.scene_manager = SceneManager(self)
        self.twilight_manager = TwilightManager(self)
        # Keyed by (channel_id, slot_id) — slot ids can collide across channels.
        self.scene_map: SceneMap = {}

        # Initialize input event handlers
        self.lux_handler = LuxInputHandler(self)
        self.event_handler = EventInputHandler(self)
        self.binary_handler = BinaryInputHandler(self)
        self.button_handler = ButtonInputHandler(self)
        self.motion_handler = MotionInputHandler(self)
        self.timer_handler = TimerInputHandler(self)
        self.light_state_handler = LightStateInputHandler(self)

        # Components with an async_setup/async_teardown lifecycle, in setup
        # order (scene_manager first to populate scene_map). Teardown walks
        # this list in reverse — a single source of truth instead of two
        # independently maintained lists. The coordinator is handled
        # separately in async_setup/async_teardown: it must initialize last
        # (once every manager/handler is ready) but also tear down last
        # (it still owns active call handlers/timers while the others stop).
        self._components: list[Any] = [
            self.scene_manager,
            self.twilight_manager,
            self.lux_handler,
            self.event_handler,
            self.motion_handler,
            self.binary_handler,
            self.button_handler,
            self.timer_handler,
            self.light_state_handler,
        ]

    @property
    def run_state(self) -> RunState:
        """Return the current runtime state of the engine."""
        return self.state_manager.state

    @callback
    def _dispatch_state_change(self, old_state: RunState, new_state: RunState) -> None:
        """Dispatch the global state signal (area_id in the payload, not the signal name)."""
        async_dispatcher_send(
            self.hass,
            SIGNAL_STATE_CHANGED,
            self.area_id,
            old_state,
            new_state,
        )

    async def async_setup(self) -> None:
        """Set up and start all sub-components of the engine.

        The setup order is critical:
          1. Initialize inputs disablers and active states.
          2. SceneManager must run first to discover scenes and build scene_map.
          3. Other logical managers (Twilight, Activity, Heatmap) initialize.
          4. Sensory input handlers register listeners and start tracking.
          5. Coordinator initializes last, once every manager/handler is ready.
        """
        self.coordinator.initialize_inputs()
        try:
            for component in self._components:
                await component.async_setup()
            await self.coordinator.async_setup()
        except Exception as err:
            _LOGGER.error(
                "[%s] TwilightEngine: Setup failed, rolling back: %s",
                self.area_id,
                err,
            )
            await self.async_teardown()
            raise
        self.state_manager.update(startup_time=time.monotonic())
        _LOGGER.debug("Twilight engine setup complete for area %s", self.area_id)

    async def async_teardown(self) -> None:
        """Gracefully tear down and clean up all resources of the engine.

        This removes state listeners, stops tracking timers, and releases coordinator locks.
        """
        # Stop dispatching first: a replacement engine (area/save) may already be
        # registered for this area_id — late emissions from this instance must
        # not reach subscribers once teardown has begun.
        if self._unsub_dispatch is not None:
            self._unsub_dispatch()
            self._unsub_dispatch = None

        for component in reversed(self._components):
            await component.async_teardown()
        await self.coordinator.async_teardown()
        _LOGGER.debug("Twilight engine torn down for area %s", self.area_id)
