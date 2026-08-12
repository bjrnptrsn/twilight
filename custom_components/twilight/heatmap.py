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
from .helpers import recorder_state_ts
from .state import ActivityProfile

_LOGGER = logging.getLogger(__name__)

RESOLUTION_MINUTES: dict[str, int] = {
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
    return dt_util.utc_from_timestamp(recorder_state_ts(s)).astimezone(tz)


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
) -> ActivityProfile:
    """Compute an ActivityProfile from HA recorder history."""
    res_mins = RESOLUTION_MINUTES.get(resolution, 15)
    days_count = RANGE_DAYS.get(range_str, 14)
    buckets_per_day = 1440 // res_mins

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

    try:
        recorder_inst = get_instance(hass)
    except Exception:
        return profile

    # Query + aggregation (including the possible-seconds-per-bucket walk, see
    # _possible_seconds_per_bucket()) run together in the executor: the
    # recorder query alone can return many thousands of rows over a 6-month
    # range, and both the per-row aggregation and the bucket-by-bucket window
    # walk (up to ~52k iterations at 5m resolution / 6 months, 180 days *
    # 288 buckets/day) are real work — all of it stays in the worker thread
    # so neither blocks the event loop.
    await recorder_inst.async_add_executor_job(
        _query_and_aggregate_heatmap,
        hass,
        start_time,
        end_time,
        motion_sensors,
        tz,
        res_mins,
        buckets_per_day,
        profile,
    )

    return profile


def _possible_seconds_per_bucket(
    start_time: datetime, end_time: datetime, res_mins: int, buckets_per_day: int
) -> tuple[dict[str, list[float]], dict[str, list[set[Any]]]]:
    """Exact per-weekday/bucket denominators for the [start_time, end_time] window.

    Walks the window bucket-by-bucket (mirroring `_distribute_interval()`'s own
    walk) instead of approximating it as `whole_calendar_days * slot_duration`
    — the window's edges carry a time-of-day offset, so a whole-day count would
    over-count the first/last partial day for ranges not evenly divisible by 7.
    """
    possible_sec: dict[str, list[float]] = {str(w): [0.0] * buckets_per_day for w in range(7)}
    possible_dates: dict[str, list[set[Any]]] = {
        str(w): [set() for _ in range(buckets_per_day)] for w in range(7)
    }
    if end_time <= start_time:
        return possible_sec, possible_dates

    curr = start_time
    while curr < end_time:
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
        overlap_end = min(end_time, bucket_end)

        duration_sec = (overlap_end - overlap_start).total_seconds()
        if duration_sec > 0 and bucket_idx < buckets_per_day:
            possible_sec[weekday_key][bucket_idx] += duration_sec
            possible_dates[weekday_key][bucket_idx].add(curr.date())

        curr = bucket_end

    return possible_sec, possible_dates


def _query_and_aggregate_heatmap(
    hass: HomeAssistant,
    start_time: datetime,
    end_time: datetime,
    motion_sensors: list[str],
    tz: Any,
    res_mins: int,
    buckets_per_day: int,
    profile: ActivityProfile,
) -> None:
    """Query recorder history and aggregate it into weekday/bucket sums.

    Mutates `profile` in place. Runs entirely in the executor (see caller).
    no_attributes=True: only motion binary_sensor states are read below
    (on/off) — their attributes are never used, so skip loading them from the
    state_attributes join.
    """
    states_by_entity: dict[str, list[Any]] = history.get_significant_states(
        hass,
        start_time,
        end_time,
        entity_ids=motion_sensors,
        filters=None,
        include_start_time_state=True,
        significant_changes_only=False,
        minimal_response=False,
        no_attributes=True,
        compressed_state_format=True,
    )

    if not states_by_entity:
        return

    # Possible seconds per weekday+bucket within [start_time, end_time], and how
    # many distinct calendar dates of that weekday touched each bucket at all
    # (the presence-fraction denominator). The window's start/end carry a
    # time-of-day offset (not midnight-aligned), so a naive "count whole
    # calendar days per weekday" denominator over- or under-counts the two
    # partial days at the edges — for 1w/2w (7/14 days, evenly divisible by 7)
    # the two partial weekdays cancel out, but for 1m/3m/6m they don't,
    # systematically depressing two weekdays' normalized fractions by ~1/count.
    # _possible_seconds_per_bucket mirrors _distribute_interval()'s own bucket
    # walk (below) so both sides of the fraction cover exactly the same window.
    possible_sec, possible_dates = _possible_seconds_per_bucket(
        start_time, end_time, res_mins, buckets_per_day
    )

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
                    eff_start = max(active_start, start_time)
                    if eff_start < dt_s:
                        _distribute_interval(
                            eff_start,
                            dt_s,
                            res_mins,
                            buckets_per_day,
                            sums,
                            active_dates,
                        )
                    active_start = None

        if active_start is not None and active_start < end_time:
            eff_start = max(active_start, start_time)
            if eff_start < end_time:
                _distribute_interval(
                    eff_start, end_time, res_mins, buckets_per_day, sums, active_dates
                )

    # Normalize sums by the exact per-bucket possible seconds/dates (see
    # _possible_seconds_per_bucket()) instead of an approximated whole-day count.
    for w in range(7):
        w_key = str(w)
        for b_idx in range(buckets_per_day):
            total_possible_sec = possible_sec[w_key][b_idx]
            possible_count = len(possible_dates[w_key][b_idx])
            if total_possible_sec <= 0 or possible_count == 0:
                continue
            fraction = sums[w_key][b_idx] / total_possible_sec
            profile.motion_buckets[w_key][b_idx] = round(min(1.0, fraction), 4)
            presence = len(active_dates[w_key][b_idx]) / possible_count
            profile.motion_presence_buckets[w_key][b_idx] = round(
                min(1.0, presence), 4
            )


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
