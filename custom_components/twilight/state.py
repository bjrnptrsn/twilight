"""State models and state management for Twilight."""

from __future__ import annotations

import logging
from collections.abc import Callable
from dataclasses import dataclass, field, replace
from datetime import datetime
from typing import Any, Literal

from homeassistant.util import dt as dt_util

from .const import SceneType

_LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True)
class ActivityTrigger:
    """Tracks who triggered the currently active activity and when."""

    input_id: str | None
    input_type: str | None
    entity_id: str | None
    triggered_at: datetime

    def to_dict(self) -> dict[str, Any]:
        """The trigger as stored in the area's `_state`."""
        return {
            "input_id": self.input_id,
            "input_type": self.input_type,
            "entity_id": self.entity_id,
            "triggered_at": self.triggered_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, raw: object) -> ActivityTrigger | None:
        """A stored trigger, or None if it is missing or unreadable."""
        if not isinstance(raw, dict):
            return None
        triggered_raw = raw.get("triggered_at")
        triggered_at = (
            dt_util.parse_datetime(triggered_raw)
            if isinstance(triggered_raw, str)
            else None
        )
        if triggered_at is None:
            return None

        def text(key: str) -> str | None:
            value = raw.get(key)
            return value if isinstance(value, str) else None

        return cls(text("input_id"), text("input_type"), text("entity_id"), triggered_at)


@dataclass(frozen=True)
class RestoredScene:
    """The scene state an activity had when HA stopped, read back at boot."""

    activity: str
    activated_at: datetime
    manual_off_entities: frozenset[str]
    manual_off_channels: frozenset[str]


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
    active_rules: dict[str, bool] = field(
        default_factory=dict
    )  # active status per rule ID
    activity_expire_frozen_seconds: float | None = None  # frozen auto_expire duration while rule active
    activity_expire_source: Literal["activity", "rule"] | None = None  # source of the active auto_expire timer
    manual_off_entities: frozenset[str] = field(
        default_factory=frozenset
    )  # entities manually turned off externally during active activity
    manual_off_channels: frozenset[str] = field(
        default_factory=frozenset
    )  # channels switched off entirely by hand during active activity


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
    # Extracted lamps that can play the scene's dynamic palette — empty unless the
    # palette is dynamic, so it alone decides whether the scene can run dynamic.
    dynamic_entities: frozenset[str] = frozenset()
    auto_dynamic: bool = False  # the Hue scene's own "start dynamic" setting (Hue app)

    @property
    def supports_dynamic(self) -> bool:
        """True if the scene can run dynamic: dynamic palette and at least one capable lamp."""
        return bool(self.dynamic_entities)


@dataclass
class ActivityProfile:
    """Aggregated activity profile data for the simulated occupancy heatmap."""

    motion_buckets: dict[str, list[float]] = field(default_factory=dict)
    motion_presence_buckets: dict[str, list[float]] = field(default_factory=dict)
    light_buckets: dict[str, list[float]] = field(default_factory=dict)
    last_updated: float | None = None

    def to_dict(self) -> dict[str, Any]:
        """Convert the profile to a dictionary representation."""
        return {
            "motion_buckets": self.motion_buckets,
            "motion_presence_buckets": self.motion_presence_buckets,
            "light_buckets": self.light_buckets,
            "last_updated": self.last_updated,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> ActivityProfile:
        """Instantiate an ActivityProfile from a dictionary."""
        return cls(
            motion_buckets=data.get("motion_buckets", {}),
            motion_presence_buckets=data.get("motion_presence_buckets", {}),
            light_buckets=data.get("light_buckets", {}),
            last_updated=data.get("last_updated"),
        )


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
