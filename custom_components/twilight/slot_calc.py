"""Slot time resolution and dynamic min distance calculation for Twilight."""

from __future__ import annotations

import datetime as _dt
import functools
import logging
import re
from typing import Any

from .const import MIN_SLOT_DISTANCE_MINUTES, STANDARD_ZONES, StartType
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
                val = sun_data.get(f"slot_{z}")
                if val is None:
                    val = sun_data.get(z)
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


def resolve_slot_times(
    slots_config: list[dict[str, Any]],
    sun_data: dict[str, Any],
) -> list[dict[str, Any]]:
    """Resolve slot start times for a given day and channel slot configuration.

    - Astral slots: start = raw_zone_time + offset_minutes.
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
    1-minute zones around solar noon (see docs/agents/timeline.md §11e3).
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
                # Discard invalid/missing fixed_time slots per spec §5
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
                }
            )

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
