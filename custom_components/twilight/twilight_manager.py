"""Slot scheduler (TwilightManager) for Twilight."""

from __future__ import annotations

import logging
import zoneinfo
from collections.abc import Callable
from dataclasses import dataclass
from datetime import UTC, date, datetime, timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.core import callback
from homeassistant.helpers.event import async_call_later

from .const import DEFAULT_TRANSITION_ON_SECONDS
from .helpers import get_config_value
from .slot_calc import resolve_slot_times
from .sun_calc import compute_sun_day_data

if TYPE_CHECKING:
    from .engine import TwilightEngine

_LOGGER = logging.getLogger(__name__)


@dataclass
class ChannelSlotSchedule:
    """Schedule state for a single Twilight channel."""

    channel_id: str
    active_slot_id: str
    active_slot_start: datetime
    next_slot_id: str | None = None
    next_slot_start: datetime | None = None  # T_ziel
    fade_started: bool = False

    def transition_start(self, lead_seconds: int) -> datetime | None:
        """T_fade: start of the anticipatory fade (T_ziel with no lead).

        The lead is capped to the remaining slot duration — a fade never
        starts before the currently active slot began.
        Negative or zero values for lead_seconds default to next_slot_start (no lead).
        """
        if not self.next_slot_start or lead_seconds <= 0:
            return self.next_slot_start
        effective_lead = min(
            float(lead_seconds),
            (self.next_slot_start - self.active_slot_start).total_seconds(),
        )
        return self.next_slot_start - timedelta(seconds=effective_lead)


class TwilightManager:
    """Manages slot calculation, boot catch-up, and transition scheduling."""

    def __init__(self, engine: TwilightEngine) -> None:
        """Initialize the TwilightManager."""
        self.engine = engine
        self.timer_unsub: Callable[[], None] | None = None
        self._schedules: dict[str, ChannelSlotSchedule] = {}

    async def async_setup(self) -> None:
        """Set up the slot scheduler and calculate initial state."""
        _LOGGER.debug("[%s] Setting up TwilightManager", self.engine.area_id)
        # Boot catch-up: record the active slot only, never activate a scene.
        # Exception: a reconfigure (area/save engine replacement) carries over
        # a run_state with scene_activated_at already set, meaning lights are
        # already under Twilight's control — so any channel whose active slot
        # changed as a result of the save (e.g. a newly added channel) must
        # have its scene applied immediately instead of waiting for the next
        # natural slot transition.
        is_boot = self.engine.run_state.scene_activated_at is None
        await self._update_slots_and_schedule(is_boot=is_boot)

    async def async_teardown(self) -> None:
        """Tear down the scheduler and cancel active timers."""
        if self.timer_unsub:
            self.timer_unsub()
            self.timer_unsub = None
        _LOGGER.debug("[%s] TwilightManager torn down", self.engine.area_id)

    def _get_location_params(self) -> tuple[float, float, str]:
        """Get geographic coordinates and time zone of Home Assistant.

        There is no per-area location override: AreaConfig has no lat/lon/tz and
        the area/save schema does not accept them, so the engine (and the
        area/slot_times preview) both resolve to hass.config. If a per-area
        override is ever added, this method and the preview must change together.
        """
        config = self.engine.hass.config
        return (config.latitude, config.longitude, str(config.time_zone))

    def _now_local(self) -> datetime:
        """Current time in Home Assistant's configured time zone."""
        _, _, tz_str = self._get_location_params()
        return datetime.now(UTC).astimezone(zoneinfo.ZoneInfo(tz_str))

    def _calculate_slot_start_times(
        self, lat: float, lon: float, tz_str: str, target_date: date
    ) -> list[tuple[str, str, datetime]]:
        """Calculate start times for all slots of all channels for a target date.

        Returns (channel_id, slot_id, start_time) tuples. Uses resolve_slot_times
        to ensure identical calculation, self-sorting, and fixed-collision handling
        as WS Endpoints A and B.
        """
        channels = self.engine.config.channels
        if not channels:
            return []

        try:
            sun_data = compute_sun_day_data(lat, lon, tz_str, target_date)
        except Exception as err:
            _LOGGER.error(
                "[%s] Error computing sun data for %s: %s",
                self.engine.area_id,
                target_date,
                err,
            )
            return []

        local_tz = zoneinfo.ZoneInfo(tz_str)
        local_midnight = datetime.combine(
            target_date, datetime.min.time(), tzinfo=local_tz
        )
        start_times: list[tuple[str, str, datetime]] = []

        for channel_id, channel in channels.items():
            if not channel.enabled:
                continue

            slot_dicts = [
                {
                    "id": slot.id,
                    "start_type": slot.start_type,
                    "zone": slot.zone,
                    "fixed_time": slot.fixed_time,
                    "offset_minutes": slot.offset_minutes,
                }
                for slot in channel.slots
            ]

            resolved = resolve_slot_times(slot_dicts, sun_data)
            for item in resolved:
                start_dt = local_midnight + timedelta(minutes=item["start"])
                start_times.append((channel_id, item["id"], start_dt))

        return start_times

    def _compute_transitions_for_dates(
        self, lat: float, lon: float, tz_str: str, dates: list[date]
    ) -> list[tuple[str, str, datetime]]:
        """Compute transitions for multiple dates in the executor."""
        all_transitions: list[tuple[str, str, datetime]] = []
        for d in dates:
            all_transitions.extend(
                self._calculate_slot_start_times(lat, lon, tz_str, d)
            )
        return all_transitions

    async def _find_active_slots_and_next_transition(
        self, now: datetime
    ) -> tuple[dict[str, str], dict[str, datetime], dict[str, tuple[str, datetime]]]:
        """Find the active slot, its start time, and the next slot per channel.

        Returns (active_slots, active_slots_start, next_slots).
        """
        lat, lon, tz_str = self._get_location_params()
        local_tz = zoneinfo.ZoneInfo(tz_str)
        now_local = now.astimezone(local_tz)

        # We calculate slot times for yesterday, today, and tomorrow to ensure
        # transitions over midnight and DST changes are handled correctly.
        today_date = now_local.date()
        yesterday_date = today_date - timedelta(days=1)
        tomorrow_date = today_date + timedelta(days=1)

        dates = [yesterday_date, today_date, tomorrow_date]

        # Run calculations in the executor to avoid blocking the event loop (pytz file access)
        all_transitions = await self.engine.hass.async_add_executor_job(
            self._compute_transitions_for_dates, lat, lon, tz_str, dates
        )

        if not all_transitions:
            return {}, {}, {}

        # Sort chronologically by start time
        all_transitions.sort(key=lambda t: t[2])

        active_slots: dict[str, str] = {}
        active_slots_start: dict[str, datetime] = {}
        next_slots: dict[str, tuple[str, datetime]] = {}

        for channel_id, slot_id, start_time in all_transitions:
            if start_time <= now_local:
                # Last past transition per channel wins (overwrites earlier ones).
                active_slots[channel_id] = slot_id
                active_slots_start[channel_id] = start_time
            elif channel_id not in next_slots:
                # First future transition across each channel.
                next_slots[channel_id] = (slot_id, start_time)

        return active_slots, active_slots_start, next_slots

    async def _update_slots_and_schedule(self, is_boot: bool = False) -> None:
        """Determine active slot and schedule next transition.

        is_boot is forwarded to the coordinator so the boot catch-up never
        activates a scene (engine_relationships.md §8).
        """
        if self.timer_unsub:
            self.timer_unsub()
            self.timer_unsub = None

        now = datetime.now(UTC)
        (
            active_slots,
            active_slots_start,
            next_slots,
        ) = await self._find_active_slots_and_next_transition(now)

        if not active_slots:
            _LOGGER.warning(
                "[%s] No active slots could be determined", self.engine.area_id
            )
            return

        # 1. Update schedules (preserving fade_started state)
        new_schedules: dict[str, ChannelSlotSchedule] = {}
        for channel_id, active_slot_id in active_slots.items():
            active_start = active_slots_start.get(channel_id)
            if not active_start:
                continue

            next_info = next_slots.get(channel_id)
            next_slot_id = next_info[0] if next_info else None
            next_slot_start = next_info[1] if next_info else None

            # Retain fade_started if the target slot remains unchanged
            old_sched = self._schedules.get(channel_id)
            fade_started = False
            if (
                old_sched
                and old_sched.next_slot_id == next_slot_id
                and old_sched.next_slot_start == next_slot_start
            ):
                fade_started = old_sched.fade_started

            new_schedules[channel_id] = ChannelSlotSchedule(
                channel_id=channel_id,
                active_slot_id=active_slot_id,
                active_slot_start=active_start,
                next_slot_id=next_slot_id,
                next_slot_start=next_slot_start,
                fade_started=fade_started,
            )
        self._schedules = new_schedules

        # 2. Update the active slots (per channel) in coordinator
        self.engine.coordinator.slots_changed(active_slots, is_boot=is_boot)

        # 3. Schedule next transition
        next_event_time: datetime | None = None
        now_local = self._now_local()

        for schedule in self._schedules.values():
            lead_seconds = self._get_transition_seconds_for_channel(schedule.channel_id)
            t_fade = schedule.transition_start(lead_seconds)
            t_ziel = schedule.next_slot_start

            # Determine the next timestamp of interest for this channel
            channel_next: datetime | None
            if not schedule.fade_started and t_fade and t_fade > now_local:
                channel_next = t_fade
            else:
                channel_next = t_ziel

            if channel_next:
                # If next time is in the past (e.g. boot catchup), cap to now_local
                if channel_next < now_local:
                    channel_next = now_local

                if next_event_time is None or channel_next < next_event_time:
                    next_event_time = channel_next

        if next_event_time:
            delay = (next_event_time - now_local).total_seconds()
            if delay < 0:
                delay = 0

            _LOGGER.debug(
                "[%s] Next slot transition/fade scheduled for %s (in %ds)",
                self.engine.area_id,
                next_event_time,
                int(delay),
            )
            self.timer_unsub = async_call_later(
                self.engine.hass, delay, self._on_slot_transition
            )

    @callback
    def _on_slot_transition(self, _now: Any) -> None:
        """Callback triggered when the transition timer fires."""
        self.timer_unsub = None
        _LOGGER.debug("[%s] Slot transition timer fired", self.engine.area_id)
        self.engine.hass.async_create_task(self._async_on_slot_transition())

    async def _async_on_slot_transition(self) -> None:
        """Asynchronous runner to process stage 1 and stage 2 for all channels."""
        now_local = self._now_local()

        for channel_id, schedule in list(self._schedules.items()):
            lead_seconds = self._get_transition_seconds_for_channel(channel_id)
            t_fade = schedule.transition_start(lead_seconds)
            t_ziel = schedule.next_slot_start

            # Stage 1 due? (lead time reached, T_target not yet reached — otherwise stage-2 fallback)
            if (
                not schedule.fade_started
                and schedule.next_slot_id
                and t_fade
                and t_ziel
                and t_fade <= now_local < t_ziel
            ):
                success = await self.engine.coordinator.async_start_slot_fade(
                    channel_id=channel_id,
                    target_slot_id=schedule.next_slot_id,
                    target_slot_start=t_ziel,
                )
                if success:
                    schedule.fade_started = True

        # Running _update_slots_and_schedule will transition to Stage 2 if now_local >= t_ziel
        await self._update_slots_and_schedule()

    def _get_transition_seconds_for_channel(self, channel_id: str) -> int:
        """Get transition seconds for a channel (falling back to area/const.py)."""
        channel = self.engine.config.channel(channel_id)
        val = get_config_value(
            None,
            [channel, self.engine.config],
            "transition_on_seconds",
            DEFAULT_TRANSITION_ON_SECONDS,
        )
        return int(val) if val is not None else DEFAULT_TRANSITION_ON_SECONDS
