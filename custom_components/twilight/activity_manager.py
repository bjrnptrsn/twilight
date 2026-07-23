"""Activity and Heatmap managers for Twilight."""

from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.const import STATE_ON
from homeassistant.core import callback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.util import dt as dt_util

from .const import ACTIVE_STATES, InputType
from .state import ActivityProfile

if TYPE_CHECKING:
    from .engine import TwilightEngine

BUCKET_MINUTES = 15
BUCKETS_PER_DAY = 1440 // BUCKET_MINUTES  # 96

_LOGGER = logging.getLogger(__name__)


class HeatmapManager:
    """Tracks sensors and lights to build an occupancy activity profile."""

    def __init__(self, engine: TwilightEngine) -> None:
        """Initialize the heatmap manager."""
        self.engine = engine
        self.hass = engine.hass
        self.profile = ActivityProfile()
        self.unsub_listeners: list[Any] = []
        self.active_states: dict[str, datetime] = {}

        # Initialize empty buckets
        for w in range(7):
            w_key = str(w)
            self.profile.motion_buckets[w_key] = [0.0] * BUCKETS_PER_DAY
            self.profile.light_buckets[w_key] = [0.0] * BUCKETS_PER_DAY

    async def async_setup(self) -> None:
        """Subscribe to sensor and light states."""
        self.unsub_listeners.clear()

        # Motion sensors from motion inputs configuration
        motion_sensors = [
            ent
            for inp in self.engine.config.inputs_of_type(InputType.MOTION)
            for ent in inp.entity_ids
            if ent
        ]

        # Lights from scene map
        lights: set[str] = set()
        for slot_info in self.engine.scene_map.values():
            lights.update(slot_info.extracted_entities)

        monitored_entities = list(set(motion_sensors) | lights)
        if not monitored_entities:
            _LOGGER.debug(
                "[%s] HeatmapManager: No entities to monitor", self.engine.area_id
            )
            return

        @callback
        def async_state_listener(event: Any) -> None:
            entity_id = event.data.get("entity_id")
            new_state = event.data.get("new_state")
            if not new_state:
                return

            is_motion = entity_id in motion_sensors

            # Normalize active states
            is_active = False
            if is_motion:
                is_active = new_state.state in ACTIVE_STATES
            else:
                # Light/Switch
                is_active = new_state.state == STATE_ON

            now = dt_util.now()

            # If it became active, record start time
            if is_active:
                if entity_id not in self.active_states:
                    self.active_states[entity_id] = now
            # If it became inactive, calculate duration and distribute to buckets
            else:
                start_time = self.active_states.pop(entity_id, None)
                if start_time:
                    self._distribute_activity(entity_id, start_time, now, is_motion)

        unsub = async_track_state_change_event(
            self.hass, monitored_entities, async_state_listener
        )
        self.unsub_listeners.append(unsub)
        _LOGGER.debug(
            "[%s] HeatmapManager monitoring %d entities",
            self.engine.area_id,
            len(monitored_entities),
        )

    async def async_teardown(self) -> None:
        """Unsubscribe and clean up."""
        for unsub in self.unsub_listeners:
            unsub()
        self.unsub_listeners.clear()
        self.active_states.clear()

    def _distribute_activity(
        self, entity_id: str, start: datetime, end: datetime, is_motion: bool
    ) -> None:
        """Distribute the active duration across 15-minute weekday buckets."""
        if end <= start:
            return

        current = start
        while current < end:
            # Current day parameters
            weekday = current.weekday()
            weekday_key = str(weekday)

            # Start of next 15-minute slot
            current_minute_of_day = current.hour * 60 + current.minute
            bucket_idx = current_minute_of_day // BUCKET_MINUTES

            # Compute boundary for the current bucket
            bucket_start_mins = bucket_idx * BUCKET_MINUTES
            dt_bucket_start = current.replace(
                hour=bucket_start_mins // 60,
                minute=bucket_start_mins % 60,
                second=0,
                microsecond=0,
            )
            dt_bucket_end = dt_bucket_start + timedelta(minutes=BUCKET_MINUTES)

            # Overlap interval
            overlap_start = max(current, dt_bucket_start)
            overlap_end = min(end, dt_bucket_end)

            duration_secs = (overlap_end - overlap_start).total_seconds()
            if duration_secs > 0:
                fraction = duration_secs / (BUCKET_MINUTES * 60)
                buckets = (
                    self.profile.motion_buckets
                    if is_motion
                    else self.profile.light_buckets
                )
                if bucket_idx < BUCKETS_PER_DAY:
                    buckets[weekday_key][bucket_idx] = min(
                        1.0, buckets[weekday_key][bucket_idx] + fraction
                    )

            current = dt_bucket_end

        self.profile.last_updated = dt_util.utcnow().timestamp()
