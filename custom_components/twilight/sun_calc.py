"""Sun calculation utilities based on astral."""

from __future__ import annotations

import datetime as _dt
import zoneinfo as _zi
from collections.abc import Callable
from typing import Any, cast

from astral import Depression, LocationInfo
from astral.sun import dawn as _astral_dawn
from astral.sun import dusk as _astral_dusk
from astral.sun import elevation, sun
from astral.sun import midnight as sun_midnight
from astral.sun import noon as _astral_noon
from astral.sun import sunrise as _astral_sunrise
from astral.sun import sunset as _astral_sunset


def _is_leap(year: int) -> bool:
    """Check if the given year is a leap year."""
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)


def _sun_safe(
    location: LocationInfo,
    d: _dt.date,
    depression: Depression,
    tzinfo: _zi.ZoneInfo | None = None,
) -> dict[str, Any] | None:
    """Safely calculate sun events, returning None if calculations fail (polar conditions)."""
    try:
        return cast(
            "dict[str, Any]",
            sun(
                location.observer,
                date=d,
                tzinfo=tzinfo or location.timezone,
                dawn_dusk_depression=depression,
            ),
        )
    except ValueError:
        # astral raises ValueError for polar conditions (sun never rises/sets on
        # the given date). Narrowed from a bare except so genuine errors
        # (MemoryError, programming bugs) are not silently swallowed.
        return None


def _mins(
    dt: _dt.datetime | None, queried_date: _dt.date, local_tz: _zi.ZoneInfo
) -> float | None:
    """Convert a datetime to local timezone and get minutes since local midnight."""
    if dt is None:
        return None
    local = dt.astimezone(local_tz)
    local_midnight = _dt.datetime.combine(queried_date, _dt.time(0, 0), tzinfo=local_tz)
    return (local - local_midnight).total_seconds() / 60


def _sun_events_direct(
    location: LocationInfo, d: _dt.date, local_tz: _zi.ZoneInfo
) -> dict[str, Any]:
    """Fallback calculation for polar regions where standard sun() might fail."""
    local_midnight = _dt.datetime.combine(d, _dt.time(0, 0), tzinfo=local_tz)
    obs = location.observer

    def to_mins(dt: _dt.datetime) -> float:
        return (dt.astimezone(local_tz) - local_midnight).total_seconds() / 60

    def safe_dawn(dep: float) -> float | None:
        try:
            return to_mins(_astral_dawn(obs, date=d, depression=dep, tzinfo=local_tz))
        except ValueError:
            # astral raises ValueError for polar conditions (event doesn't occur).
            return None

    def safe_dusk(dep: float) -> float | None:
        try:
            return to_mins(_astral_dusk(obs, date=d, depression=dep, tzinfo=local_tz))
        except ValueError:
            return None

    def safe_fn(fn: Callable[..., _dt.datetime]) -> float | None:
        try:
            return to_mins(fn(obs, date=d, tzinfo=local_tz))
        except ValueError:
            return None

    noon_mins = safe_fn(_astral_noon)
    astro_dawn = safe_dawn(18)
    nautical_dawn = safe_dawn(12)
    civil_dawn = safe_dawn(6)
    civil_dusk = safe_dusk(6)
    nautical_dusk = safe_dusk(12)
    astro_dusk = safe_dusk(18)

    if noon_mins is not None:
        if astro_dawn is not None and astro_dawn >= noon_mins:
            astro_dawn = None
        if nautical_dawn is not None and nautical_dawn >= noon_mins:
            nautical_dawn = None
        if civil_dawn is not None and civil_dawn >= noon_mins:
            civil_dawn = None
        if civil_dusk is not None and civil_dusk <= noon_mins:
            civil_dusk = None
        if nautical_dusk is not None and nautical_dusk <= noon_mins:
            nautical_dusk = None
        if astro_dusk is not None and astro_dusk <= noon_mins:
            astro_dusk = None

    _sr = None
    try:
        _sr = to_mins(_astral_sunrise(obs, date=d, tzinfo=local_tz))
    except ValueError:
        try:
            vm_morning = sun_midnight(obs, date=d, tzinfo=local_tz)
            el_morning = elevation(obs, vm_morning)
            vm_evening = sun_midnight(obs, date=d + _dt.timedelta(days=1), tzinfo=local_tz)
            el_evening = elevation(obs, vm_evening)
            if min(el_morning, el_evening) >= -0.833:
                _sr = 0.0
        except ValueError:
            pass
    _ss = safe_fn(_astral_sunset)

    return {
        "noon": noon_mins,
        "sunrise": _sr,
        "sunset": _ss,
        "astro_dawn": astro_dawn,
        "nautical_dawn": nautical_dawn,
        "dawn": civil_dawn,
        "dusk": civil_dusk,
        "nautical_dusk": nautical_dusk,
        "astro_dusk": astro_dusk,
    }


def _clamp_twilight_slots(day: dict[str, Any], max_gap: float = 35.0) -> dict[str, Any]:
    """Ensure logical chronological order of twilight phases by clamping them."""
    d = dict(day)
    solar_midnight_evening = d.get("solar_midnight_evening")
    limit_dusk = 1440.0 if solar_midnight_evening is None else solar_midnight_evening
    limit_dawn = d.get("solar_midnight") or 0.0

    dusk_chain = ["sunset", "dusk", "nautical_dusk", "astro_dusk"]
    dusk_dropped = False
    for i in range(1, len(dusk_chain)):
        prev_key, cur_key = dusk_chain[i - 1], dusk_chain[i]
        prev_val = d.get(prev_key)
        cur_val = d.get(cur_key)
        if dusk_dropped:
            d[cur_key] = None
            continue
        if prev_val is not None:
            candidate = (
                (prev_val + max_gap)
                if cur_val is None
                else min(cur_val, prev_val + max_gap)
            )
            if candidate > limit_dusk:
                d[cur_key] = None
                dusk_dropped = True
            else:
                d[cur_key] = candidate

    dawn_chain = ["astro_dawn", "nautical_dawn", "dawn", "sunrise"]
    dawn_dropped = False
    for i in range(len(dawn_chain) - 2, -1, -1):
        cur_key, next_key = dawn_chain[i], dawn_chain[i + 1]
        cur_val = d.get(cur_key)
        next_val = d.get(next_key)
        if dawn_dropped:
            d[cur_key] = None
            continue
        if next_val is not None:
            candidate = (
                (next_val - max_gap)
                if cur_val is None
                else max(cur_val, next_val - max_gap)
            )
            if candidate < limit_dawn:
                d[cur_key] = None
                dawn_dropped = True
            else:
                d[cur_key] = candidate

    return d


def compute_sun_day_data(
    lat: float, lon: float, tz_str: str, d: _dt.date
) -> dict[str, Any]:
    """Calculate raw and clamped sun events for a single day."""
    location = LocationInfo(latitude=lat, longitude=lon, timezone=tz_str)
    local_tz = _zi.ZoneInfo(tz_str)

    dt_noon = _dt.datetime.combine(d, _dt.time(12, 0), tzinfo=local_tz)
    _utcoffset = dt_noon.utcoffset()
    tz_off = _utcoffset.total_seconds() / 60 if _utcoffset is not None else 0

    # One sun() call (CIVIL) gives us sunrise/sunset/noon; dawn/dusk at all
    # depression levels are fetched individually via _astral_dawn/_astral_dusk
    # in _raw_dawn/_raw_dusk (bundle=None path) to avoid 3× sun() calls.
    civil = _sun_safe(location, d, Depression.CIVIL, tzinfo=local_tz)

    local_midnight_dt = _dt.datetime.combine(d, _dt.time(0, 0), tzinfo=local_tz)
    sm_mins: float | None = None
    sm_evening_mins: float | None = None
    el_morning: float = elevation(location.observer, local_midnight_dt)
    el_evening = elevation(
        location.observer,
        _dt.datetime.combine(
            d + _dt.timedelta(days=1), _dt.time(0, 0), tzinfo=local_tz
        ),
    )
    try:
        vm_morning = sun_midnight(location.observer, date=d, tzinfo=local_tz)
        el_morning = elevation(location.observer, vm_morning)
        sm_mins = _mins(vm_morning, d, local_tz)
    except ValueError:
        pass
    try:
        vm_evening = sun_midnight(
            location.observer, date=d + _dt.timedelta(days=1), tzinfo=local_tz
        )
        el_evening = elevation(location.observer, vm_evening)
        sm_evening_mins = _mins(vm_evening, d, local_tz)
    except ValueError:
        pass

    def _pick(
        raw_dt: _dt.datetime | None,
        dep: float,
        sr_dt: _dt.datetime | None,
        ss_dt: _dt.datetime | None,
        morning: bool,
    ) -> float | None:
        if raw_dt is None:
            return None
        el_check = el_morning if morning else el_evening
        if el_check > -dep:
            return None
        m = _mins(raw_dt, d, local_tz)
        if m is None:
            return None
        if morning and sr_dt is not None:
            sr_mins = _mins(sr_dt, d, local_tz)
            if sr_mins is not None and m > sr_mins:
                m -= 24 * 60
        elif not morning and ss_dt is not None:
            ss_mins = _mins(ss_dt, d, local_tz)
            if ss_mins is not None and m < ss_mins:
                m += 24 * 60
        return m

    if civil is not None:
        sr = civil["sunrise"]
        ss = civil["sunset"]

        def _raw_dawn(dep: float) -> _dt.datetime | None:
            try:
                res = _astral_dawn(
                    location.observer,
                    date=d,
                    depression=dep,
                    tzinfo=local_tz,
                )
                return res if isinstance(res, _dt.datetime) else None
            except ValueError:
                return None

        def _raw_dusk(dep: float) -> _dt.datetime | None:
            try:
                res = _astral_dusk(
                    location.observer,
                    date=d,
                    depression=dep,
                    tzinfo=local_tz,
                )
                return res if isinstance(res, _dt.datetime) else None
            except ValueError:
                return None

        raw = {
            "date": d.isoformat(),
            "tz_offset": tz_off,
            "solar_midnight": sm_mins,
            "solar_midnight_evening": sm_evening_mins,
            "midnight_el": round(el_morning, 1),
            "solar_noon": _mins(civil["noon"], d, local_tz),
            "astro_dawn": _pick(_raw_dawn(18.0), 18.0, sr, ss, True),
            "nautical_dawn": _pick(_raw_dawn(12.0), 12.0, sr, ss, True),
            "dawn": _pick(_raw_dawn(6.0), 6.0, sr, ss, True),
            "sunrise": _mins(sr, d, local_tz),
            "sunset": _mins(ss, d, local_tz),
            "dusk": _pick(_raw_dusk(6.0), 6.0, sr, ss, False),
            "nautical_dusk": _pick(_raw_dusk(12.0), 12.0, sr, ss, False),
            "astro_dusk": _pick(_raw_dusk(18.0), 18.0, sr, ss, False),
        }
    else:
        ev = _sun_events_direct(location, d, local_tz)
        raw = {
            "date": d.isoformat(),
            "tz_offset": tz_off,
            "solar_midnight": sm_mins,
            "solar_midnight_evening": sm_evening_mins,
            "midnight_el": round(el_morning, 1),
            "solar_noon": ev["noon"],
            "astro_dawn": ev["astro_dawn"],
            "nautical_dawn": ev["nautical_dawn"],
            "dawn": ev["dawn"],
            "sunrise": ev["sunrise"],
            "sunset": ev["sunset"],
            "dusk": ev["dusk"],
            "nautical_dusk": ev["nautical_dusk"],
            "astro_dusk": ev["astro_dusk"],
        }

    clamped = _clamp_twilight_slots(raw)

    slot_sunrise = clamped["sunrise"]
    slot_sunset = clamped["sunset"]

    has_real_sunrise = raw.get("sunrise") not in (None, 0.0)
    has_real_sunset = raw.get("sunset") not in (None, 0.0)

    if has_real_sunrise and has_real_sunset and slot_sunrise is not None and slot_sunset is not None:
        if slot_sunrise + 30 >= slot_sunset - 30:
            # Day too short for a 30-min golden band on each side.
            slot_gold_dawn = None
            slot_gold_dusk = None
            slot_day = slot_sunrise
        else:
            slot_gold_dawn = slot_sunrise
            slot_day = slot_sunrise + 30
            slot_gold_dusk = slot_sunset - 30
    else:
        # Polar transition day: only one of sunrise/sunset occurs. The two sides
        # are independent — deriving the day zone from sunrise does not require a
        # sunset to exist. Coupling them left the last day before polar day with a
        # civil_dawn but no zone to ever end it, so the civil colour ran to
        # midnight and painted a single dark column into a bright polar-day block.
        #
        # On a true polar day the sunrise/sunset values degenerate to an exact
        # 0.0 placeholder rather than None — the sun is already up at midnight,
        # so the event search yields the day boundary. Deriving a golden hour
        # from that invents a 0–30 min gold band on days that have none
        # (190/365 at the North Pole, where the sun sits 23° high at "sunrise").
        #
        # An exact 0.0 is the discriminator, not midnight elevation: on the last
        # transition day before polar day the sun does still rise (McMurdo
        # 2026-10-23, sunrise = 137.0) while midnight elevation has already
        # crossed the horizon, so an elevation test would discard a real event.
        # A genuine sunrise at exactly 00:00.000 is not representable here anyway.
        slot_gold_dawn = slot_sunrise if has_real_sunrise else None
        slot_day = (
            slot_sunrise + 30
            if has_real_sunrise and slot_sunrise is not None
            else None
        )
        slot_gold_dusk = (
            slot_sunset - 30 if has_real_sunset and slot_sunset is not None else None
        )

    # Note on Dusk-Slot mapping (intentional asymmetry vs Dawn):
    # - slot_civil_dusk starts at sunset (slot_sunset) and covers the civil dusk period.
    # - slot_nautical_dusk starts at civil dusk (clamped["dusk"]) and covers nautical dusk.
    # - slot_astro_dusk starts at nautical dusk (clamped["nautical_dusk"]) and covers astronomical dusk.
    # - slot_night starts at astronomical dusk (clamped["astro_dusk"]) and covers night.
    return {
        **raw,
        "slot_astro_dawn": clamped["astro_dawn"],
        "slot_nautical_dawn": clamped["nautical_dawn"],
        "slot_civil_dawn": clamped["dawn"],
        "slot_sunrise": slot_sunrise,
        "slot_gold_dawn": slot_gold_dawn,
        "slot_day": slot_day,
        "slot_gold_dusk": slot_gold_dusk,
        "slot_sunset": slot_sunset,
        "slot_civil_dusk": slot_sunset,
        "slot_nautical_dusk": clamped["dusk"],
        "slot_astro_dusk": clamped["nautical_dusk"],
        "slot_night": clamped["astro_dusk"],
    }
