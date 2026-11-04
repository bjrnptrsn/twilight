"""Slot time resolution and dynamic min distance calculation for Twilight."""

from __future__ import annotations

import datetime as _dt
import functools
import logging
import re
from typing import Any

from .const import (
    MIN_SLOT_DISTANCE_MINUTES,
    MORNING_ZONES,
    NOT_BEFORE_AFTER_MIDNIGHT_UNTIL_MINUTES,
    NOT_BEFORE_EVENING_FROM_MINUTES,
    NOT_BEFORE_ZONES,
    STANDARD_ZONES,
    StartType,
)
from .sun_calc import compute_sun_day_data

_LOGGER = logging.getLogger(__name__)

_TIME_RE = re.compile(r"^(\d{1,2}):(\d{2})$")


def parse_fixed_time(fixed_time: str | None) -> int | None:
    """Parse a fixed time HH:MM into minutes from midnight.

    Returns None if missing or invalid.
    """
    if not fixed_time or not isinstance(fixed_time, str):
        return None
    m = _TIME_RE.match(fixed_time.strip())
    if not m:
        return None
    h, mi = int(m.group(1)), int(m.group(2))
    if 0 <= h <= 23 and 0 <= mi <= 59:
        return h * 60 + mi
    return None


def parse_not_before(value: Any) -> int | None:
    """Parse a "not before" floor HH:MM into minutes from the evening's midnight.

    The floor only exists on evening slots, so the range is unambiguous without
    any reference to the sun: 12:00–23:59 is the same evening, 00:00–03:59 is
    after midnight (returned as minutes > 1440, the day-overflow convention of
    compute_sun_day_data). Returns None if missing, invalid or 04:00–11:59.
    """
    if not isinstance(value, str):
        return None
    mins = parse_fixed_time(value)
    if mins is None:
        return None
    if mins >= NOT_BEFORE_EVENING_FROM_MINUTES:
        return mins
    if mins < NOT_BEFORE_AFTER_MIDNIGHT_UNTIL_MINUTES:
        return mins + 1440
    return None


def normalize_not_before_str(value: Any) -> str | None:
    """Return a valid "not before" floor as canonical "HH:MM", else None."""
    mins = parse_not_before(value)
    if mins is None:
        return None
    mins %= 1440
    return f"{mins // 60:02d}:{mins % 60:02d}"


def slot_not_before(slot: dict[str, Any]) -> str | None:
    """A slot dict's valid "not before" floor, or None if the slot cannot carry one.

    Only astral slots of a NOT_BEFORE_ZONES zone can; on any other slot a stored
    value would never take effect, so it is dropped rather than kept.
    """
    start_type = slot.get("start_type") or StartType.ASTRAL.value
    if start_type != StartType.ASTRAL.value or slot.get("zone") not in NOT_BEFORE_ZONES:
        return None
    return normalize_not_before_str(slot.get("not_before"))


@functools.lru_cache(maxsize=32)
def compute_dynamic_min_slot_distance(
    lat: float, lon: float, tz_str: str, year: int
) -> float:
    """Calculate the location-based minimum adjacent sun zone distance in minutes across a year.

    Falls back to MIN_SLOT_DISTANCE_MINUTES if unable to calculate or if less than fallback.
    """
    try:
        min_gap = 9999.0
        start_date = _dt.date(year, 1, 1)
        days_count = (
            366 if (year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)) else 365
        )
        for day_idx in range(days_count):
            d = start_date + _dt.timedelta(days=day_idx)
            sun_data = compute_sun_day_data(lat, lon, tz_str, d)

            zone_times: list[float] = []
            for z in STANDARD_ZONES:
                # slot_* only, never the bare event as a fallback: the slot_
                # series is shifted by one against the raw events (slot_astro_
                # dusk carries raw nautical_dusk), so a bare value would be the
                # neighbouring zone's time — the same forbidden fallback
                # resolve_slot_times() rejects below. Zones absent on that day
                # (dusk_dropped, polar) are skipped; the gaps between the
                # zones that do exist are the real adjacent-zone distances.
                val = sun_data.get(f"slot_{z}")
                if val is not None:
                    zone_times.append(float(val))

            for i in range(len(zone_times) - 1):
                gap = zone_times[i + 1] - zone_times[i]
                if gap > 0 and gap < min_gap:
                    min_gap = gap

        if min_gap < 9999.0:
            return round(min_gap, 1)
    except Exception:
        _LOGGER.debug(
            "compute_dynamic_min_slot_distance failed for lat=%s lon=%s tz=%s year=%s; "
            "falling back to MIN_SLOT_DISTANCE_MINUTES",
            lat,
            lon,
            tz_str,
            year,
            exc_info=True,
        )
    return float(MIN_SLOT_DISTANCE_MINUTES)


def _next_morning_start(
    slots_config: list[dict[str, Any]],
    next_sun_data: dict[str, Any],
    morning_ids: set[str],
) -> float | None:
    """Start of the following day's first real morning slot, in this day's minutes."""
    starts = [
        s["start"]
        for s in resolve_slot_times(slots_config, next_sun_data)
        if s["id"] in morning_ids and not s["synthetic"]
    ]
    return min(starts) + 1440 if starts else None


def resolve_slot_times(
    slots_config: list[dict[str, Any]],
    sun_data: dict[str, Any],
    next_sun_data: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    """Resolve slot start times for a given day and channel slot configuration.

    - Astral slots: start = raw_zone_time + offset_minutes.
    - Evening slots (NOT_BEFORE_ZONES) with a "not_before" floor start no
      earlier than it; pushing one later shifts every later evening slot by the
      same delta, so the phase before the floor lengthens and the ones after it
      keep their natural length. With `next_sun_data` (the following day), a
      pushed evening slot is capped to start before that day's first morning
      slot, so a floor after midnight never runs the night into the dawn.
    - Fixed slots: start = parsed fixed_time (invalid/missing fixed_time slots are discarded).
    - Resolves fixed-slot collisions with astral slots (+1 min transitive while loop).
    - Returns list of {"id": slot_id, "start": start_minutes} sorted by start.

    Each returned entry also carries a "synthetic" bool. It is True when the
    slot's astral zone does not physically occur on that day (polar day/night:
    `sun_data` has no value for the zone) and the start time is therefore the
    solar-noon placeholder rather than a real sun event. The scheduling path
    (`twilight_manager`) ignores the flag and keeps using the placeholder, so
    light control stays gapless under polar conditions. Renderers that draw
    zone *areas* must skip synthetic slots — drawing them produces a fan of ten
    1-minute zones around solar noon.
    """
    astral_slots: list[dict[str, Any]] = []
    fixed_slots: list[dict[str, Any]] = []

    solar_noon = sun_data.get("solar_noon")
    if solar_noon is None:
        solar_noon = 720.0

    for slot in slots_config:
        slot_id = slot.get("id")
        if not slot_id:
            continue

        start_type = slot.get("start_type") or slot.get("startType")
        if start_type == StartType.FIXED or start_type == "fixed":
            fixed_time_raw = slot.get("fixed_time") or slot.get("fixedStartTime")
            fixed_mins = parse_fixed_time(fixed_time_raw)
            if fixed_mins is None:
                # Discard invalid/missing fixed_time slots
                continue
            fixed_slots.append(
                {"id": slot_id, "start": float(fixed_mins), "synthetic": False}
            )
        else:
            # Astral / Sun event slot
            zone = slot.get("zone") or slot.get("startEvent") or slot_id

            raw_val = sun_data.get(f"slot_{zone}")
            if raw_val is None and f"slot_{zone}" not in sun_data:
                # Only for zones that have no slot_* representation at all
                # (custom channels may reference a bare event name). Never as a
                # fallback for a slot_* key that exists but is None: the slot_*
                # series is shifted by one position against the raw events
                # (slot_astro_dusk carries raw nautical_dusk), so the bare value
                # of the same name is the *neighbouring* zone's time. Using it
                # duplicated a minute another zone already owned — 155 collisions
                # per year across the polar test locations, every single one of
                # them wrong.
                raw_val = sun_data.get(zone)
            synthetic = raw_val is None
            if raw_val is None:
                raw_val = solar_noon

            offset = slot.get("offset_minutes")
            if offset is None:
                offset = slot.get("startOffset", 0)
            try:
                offset_mins = float(offset)
            except (ValueError, TypeError):
                offset_mins = 0.0

            astral_slots.append(
                {
                    "id": slot_id,
                    "zone": zone,
                    "start": float(raw_val) + offset_mins,
                    "synthetic": synthetic,
                    "not_before": parse_not_before(slot.get("not_before")),
                }
            )

    # "Not before" floors along the evening chain. Synthetic slots take part
    # neither with their own floor nor in the delta: their solar-noon
    # placeholder is no evening time to defer. Sorted by zone first so the delta
    # propagates in phase order even when an offset swapped two base times.
    chain_slots = sorted(
        (
            s
            for s in astral_slots
            if not s["synthetic"] and s["zone"] in NOT_BEFORE_ZONES
        ),
        key=lambda s: (NOT_BEFORE_ZONES.index(s["zone"]), s["start"]),
    )
    chain_shift = 0.0
    for c_slot in chain_slots:
        c_slot["base"] = c_slot["start"]
        shifted = c_slot["start"] + chain_shift
        floor_mins = c_slot["not_before"]
        if floor_mins is not None and floor_mins > shifted:
            chain_shift += floor_mins - shifted
            shifted = float(floor_mins)
        c_slot["start"] = shifted

    # Cap pushed slots before the next morning, walking backwards so the chain
    # keeps its order one minute apart. Only a pushed slot is capped, and never
    # below its own sun time: the cap undoes a floor, it does not move a slot.
    if chain_shift > 0 and next_sun_data is not None:
        morning_ids = {s["id"] for s in astral_slots if s["zone"] in MORNING_ZONES}
        next_morning = _next_morning_start(slots_config, next_sun_data, morning_ids)
        if next_morning is not None:
            latest = next_morning - 1
            for c_slot in reversed(chain_slots):
                if c_slot["start"] > max(latest, c_slot["base"]):
                    c_slot["start"] = max(latest, c_slot["base"])
                latest = min(latest, c_slot["start"]) - 1

    # Collision handling: two fixed slots configured for the same fixed_time are
    # not immovable relative to each other — the earlier one claims the minute,
    # later ones bump forward by 1 min. Astral slots (processed in chronological
    # order) then bump forward past any already-occupied minute — fixed or
    # astral alike — so a bump can never land on a minute freed or claimed by an
    # earlier slot.
    #
    # Both lists are sorted by time first so the result depends only on the
    # configured times, never on the order the slots happen to sit in the store
    # (a drag&drop reorder in the UI must not shift resolved start times).
    # sort() is stable, so equal times keep config order as a deterministic
    # tiebreak.
    occupied: set[int] = set()
    fixed_slots.sort(key=lambda s: s["start"])
    for f_slot in fixed_slots:
        start = round(f_slot["start"])
        while start in occupied:
            start += 1
        f_slot["start"] = float(start)
        occupied.add(start)

    astral_slots.sort(key=lambda s: s["start"])
    for a_slot in astral_slots:
        start = round(a_slot["start"])
        while start in occupied:
            start += 1
        a_slot["start"] = float(start)
        occupied.add(start)

    # Combine all resolved slots
    all_slots: list[dict[str, Any]] = []
    for s in astral_slots:
        all_slots.append(
            {"id": s["id"], "start": round(s["start"]), "synthetic": s["synthetic"]}
        )
    for s in fixed_slots:
        all_slots.append(
            {"id": s["id"], "start": round(s["start"]), "synthetic": False}
        )

    # Sort all slots by start minute
    all_slots.sort(key=lambda s: s["start"])
    return all_slots
