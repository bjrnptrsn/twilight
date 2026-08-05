"""Heatmap aggregation helper using Home Assistant recorder history."""

from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import Any

from homeassistant.components.recorder import get_instance, history
from homeassistant.const import STATE_ON
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .config_model import AreaConfig
from .const import MOTION_ACTIVE_STATES, InputType
from .state import ActivityProfile

_LOGGER = logging.getLogger(__name__)

RESOLUTION_MINUTES: dict[str, int] = {
    "1m": 1,
    "5m": 5,
    "10m": 10,
    "15m": 15,
    "30m": 30,
    "60m": 60,
}

RANGE_DAYS: dict[str, int] = {
    "1w": 7,
    "2w": 14,
    "1m": 30,
    "3m": 90,
    "6m": 180,
}


def _cstate_ts(s: dict[str, Any], tz: Any) -> datetime:
    """Extract timestamp from recorder state dict in local timezone."""
    ts = s.get("lu")
    if ts is None:
        ts = s.get("lc")
    val = float(ts) if ts is not None else 0.0
    return dt_util.utc_from_timestamp(val).astimezone(tz)


def _get_motion_sensors(area_config: AreaConfig | dict[str, Any]) -> list[str]:
    """Extract motion sensor entity_ids from AreaConfig or raw dict."""
    if isinstance(area_config, AreaConfig):
        return [
            ent
            for inp in area_config.inputs_of_type(InputType.MOTION)
            for ent in inp.entity_ids
            if ent
        ]
    inputs = area_config.get("inputs", [])
    motion_sensors: list[str] = []
    if isinstance(inputs, list):
        for inp in inputs:
            if isinstance(inp, dict) and inp.get("type") == InputType.MOTION:
                for ent in inp.get("entity_ids", []):
                    if ent:
                        motion_sensors.append(str(ent))
    return motion_sensors


async def async_compute_heatmap(
    hass: HomeAssistant,
    area_config: AreaConfig | dict[str, Any],
    resolution: str = "15m",
    range_str: str = "2w",
    motion_only: bool = True,
) -> ActivityProfile:
    """Compute an ActivityProfile from HA recorder history."""
    res_mins = RESOLUTION_MINUTES.get(resolution, 15)
    days_count = RANGE_DAYS.get(range_str, 14)
    buckets_per_day = 1440 // res_mins
    slot_duration_sec = res_mins * 60

    tz = dt_util.get_default_time_zone()
    end_time = dt_util.now()
    start_time = end_time - timedelta(days=days_count)

    motion_sensors = _get_motion_sensors(area_config)

    profile = ActivityProfile(last_updated=dt_util.utcnow().timestamp())
    for w in range(7):
        w_key = str(w)
        profile.motion_buckets[w_key] = [0.0] * buckets_per_day
        profile.motion_presence_buckets[w_key] = [0.0] * buckets_per_day
        profile.light_buckets[w_key] = [0.0] * buckets_per_day

    if not motion_sensors:
        return profile

    # Count how many times each weekday occurs in the time window
    weekday_counts: dict[int, int] = {w: 0 for w in range(7)}
    for i in range(days_count):
        d = (start_time + timedelta(days=i)).date()
        weekday_counts[d.weekday()] += 1

    # Fetch states from recorder in executor. no_attributes=True: only motion
    # binary_sensor states are read below (on/off) — their attributes are
    # never used, so skip loading them from the state_attributes join.
    states_by_entity: dict[str, list[Any]] = await get_instance(
        hass
    ).async_add_executor_job(
        history.get_significant_states,
        hass,
        start_time,
        end_time,
        motion_sensors,
        None,
        True,
        False,
        False,
        True,
        True,
    )

    if not states_by_entity:
        return profile

    # Sum active seconds per weekday and bucket index
    sums: dict[str, list[float]] = {str(w): [0.0] * buckets_per_day for w in range(7)}
    # Distinct calendar dates (per weekday+bucket) that saw at least one active
    # interval — used for motion_presence_buckets, see _distribute_interval().
    active_dates: dict[str, list[set[Any]]] = {
        str(w): [set() for _ in range(buckets_per_day)] for w in range(7)
    }

    for entity_id in motion_sensors:
        states = states_by_entity.get(entity_id, [])
        if not states:
            continue

        active_start: datetime | None = None

        for s in states:
            dt_s = _cstate_ts(s, tz)
            st_val = s.get("s")
            is_active = st_val in MOTION_ACTIVE_STATES or st_val == STATE_ON

            if is_active:
                if active_start is None:
                    active_start = dt_s
            else:
                if active_start is not None:
                    _distribute_interval(
                        active_start,
                        dt_s,
                        res_mins,
                        buckets_per_day,
                        sums,
                        active_dates,
                    )
                    active_start = None

        if active_start is not None and active_start < end_time:
            _distribute_interval(
                active_start, end_time, res_mins, buckets_per_day, sums, active_dates
            )

    # Normalize sums by weekday occurrence count and slot duration
    for w in range(7):
        w_key = str(w)
        count = weekday_counts.get(w, 0)
        if count == 0:
            continue
        total_possible_sec = count * slot_duration_sec
        for b_idx in range(buckets_per_day):
            fraction = sums[w_key][b_idx] / total_possible_sec
            profile.motion_buckets[w_key][b_idx] = round(min(1.0, fraction), 4)
            presence = len(active_dates[w_key][b_idx]) / count
            profile.motion_presence_buckets[w_key][b_idx] = round(
                min(1.0, presence), 4
            )

    return profile


def _distribute_interval(
    start: datetime,
    end: datetime,
    res_mins: int,
    buckets_per_day: int,
    sums: dict[str, list[float]],
    active_dates: dict[str, list[set[Any]]],
) -> None:
    """Distribute an active interval across weekday bucket sums.

    Also records the calendar date in `active_dates[weekday][bucket]` for every
    bucket the interval touches, used to derive motion_presence_buckets (the
    fraction of days with *any* motion in the bucket, vs. `sums`' fraction of
    active seconds — PIR sensors are only on for a few seconds per trigger, so
    the seconds-fraction alone understates how often presence actually occurs).
    """
    if end <= start:
        return

    curr = start
    while curr < end:
        weekday_key = str(curr.weekday())
        minute_of_day = curr.hour * 60 + curr.minute
        bucket_idx = minute_of_day // res_mins

        bucket_start_mins = bucket_idx * res_mins
        bucket_start = curr.replace(
            hour=bucket_start_mins // 60,
            minute=bucket_start_mins % 60,
            second=0,
            microsecond=0,
        )
        bucket_end = bucket_start + timedelta(minutes=res_mins)

        overlap_start = max(curr, bucket_start)
        overlap_end = min(end, bucket_end)

        duration_sec = (overlap_end - overlap_start).total_seconds()
        if duration_sec > 0 and bucket_idx < buckets_per_day:
            sums[weekday_key][bucket_idx] += duration_sec
            active_dates[weekday_key][bucket_idx].add(curr.date())

        curr = bucket_end
