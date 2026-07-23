"""State models and state management for Twilight."""

from __future__ import annotations

import logging
from collections.abc import Callable
from dataclasses import dataclass, field, replace
from datetime import datetime
from typing import Any

from .const import SceneType

_LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True)
class ActivityTrigger:
    """Tracks who triggered the currently active activity and when."""

    input_id: str | None
    input_type: str | None
    entity_id: str | None
    triggered_at: datetime


@dataclass(frozen=True)
class RunState:
    """Immutable runtime state of a Twilight area engine."""

    active_slots: dict[str, str] = field(
        default_factory=dict
    )  # channel_id -> active slot id
    active_slot_start: datetime | None = (
        None  # when the latest slot transition happened
    )
    scene_activated_at: datetime | None = (
        None  # physical scene activation time (area-global)
    )
    active_activity: str | None = None  # currently active activity
    activity_trigger: ActivityTrigger | None = None  # who/when triggered the activity
    activity_expires_at: datetime | None = None  # when the presence timeout expires
    startup_time: float | None = None  # timestamp of engine startup
    motion_active: bool = False  # True if any motion sensor is active
    lux_value: float | None = None  # current minimum lux value across sensors
    inputs_active: dict[str, bool] = field(
        default_factory=dict
    )  # physical active state per input ID
    inputs_disabled_by: dict[str, list[str]] = field(
        default_factory=dict
    )  # list of disablers per input ID


@dataclass(frozen=True)
class SlotSceneInfo:
    """Scene information for a specific (channel, slot), resolved during setup."""

    channel_id: str  # owning channel id (Primary or a custom channel)
    scene_entity_id: str  # e.g., "scene.living_room_cozy"
    scene_type: SceneType  # PLAIN_SCENE, HUE_SCENE, HUE_SMART_SCENE, SCRIPT
    extracted_entities: frozenset[
        str
    ]  # entities controlled by the scene (states known)
    configured_entities: frozenset[str]  # manually configured entities (turn-off only)
    expected_states: dict[
        str, dict[str, Any]
    ]  # entity_id -> expected state attributes dict


@dataclass
class ActivityProfile:
    """Aggregated activity profile data for the simulated occupancy heatmap."""

    motion_buckets: dict[str, list[float]] = field(default_factory=dict)
    light_buckets: dict[str, list[float]] = field(default_factory=dict)
    last_updated: float | None = None


class StateManager:
    """Manages the RunState of a Twilight Engine."""

    def __init__(
        self,
        initial_state: RunState | None = None,
        on_state_changed: Callable[[RunState, RunState], None] | None = None,
    ) -> None:
        """Initialize the StateManager."""
        self._state = initial_state or RunState()
        self.listeners: list[Callable[[RunState, RunState], None]] = []
        if on_state_changed:
            self.add_listener(on_state_changed)

    def add_listener(
        self, listener: Callable[[RunState, RunState], None]
    ) -> Callable[[], None]:
        """Add a listener and return a remove callback."""
        self.listeners.append(listener)

        def remove_listener() -> None:
            if listener in self.listeners:
                self.listeners.remove(listener)

        return remove_listener

    @property
    def state(self) -> RunState:
        """Return the current immutable state."""
        return self._state

    def update(self, **kwargs: Any) -> RunState:
        """Atomically replace fields in the RunState and trigger callbacks if changed."""
        old_state = self._state
        new_state = replace(old_state, **kwargs)
        if old_state != new_state:
            self._state = new_state
            for listener in list(self.listeners):
                try:
                    listener(old_state, new_state)
                except Exception:
                    _LOGGER.exception("Error in state change listener")
        return new_state
