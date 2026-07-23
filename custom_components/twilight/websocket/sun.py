"""Sun (day/year) WebSocket commands for Twilight."""

from __future__ import annotations

import datetime as dt
import zoneinfo as zi
from collections import OrderedDict
from typing import Any

import voluptuous as vol
from astral import Depression, LocationInfo
from astral.sun import azimuth, elevation
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..sun_calc import _is_leap, _sun_safe, compute_sun_day_data

# Coordinates/timezone practically never change while HA is running, so the
# 365/366-day computation (~seconds of CPU via the executor) is cached per
# (lat, lon, year, tz). Trimmed to the most recently used entries — demo
# locations/years in the Timeline view can otherwise grow this key space
# without bound over a long-running instance.
_YEAR_CACHE_MAX_SIZE = 16
_YEAR_CACHE: OrderedDict[tuple[float, float, int, str], dict[str, Any]] = OrderedDict()

# Same idea for sun/day, but every request without an explicit `date` resolves
# to "today" first (see _resolve_target_date), and a new day rolls in daily —
# unlike the year cache this key space grows without bound over uptime, so it
# is trimmed to the most recently used entries instead of left unbounded.
_DAY_CACHE_MAX_SIZE = 64
_DAY_CACHE: OrderedDict[tuple[float, float, str, str], dict[str, Any]] = OrderedDict()


def _resolve_target_date(date_str: str | None, tz_str: str) -> dt.date:
    """Resolve the requested date, needed before the executor job to build the cache key.

    Runs on the event loop, but zoneinfo.ZoneInfo caches parsed tz files per
    process, so repeated calls for the same tz_str after the first are a dict
    lookup, not a filesystem read.
    """
    if date_str:
        return dt.date.fromisoformat(date_str)
    return dt.datetime.now(zi.ZoneInfo(tz_str)).date()


def _ws_sun_day() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/sun/day",
            vol.Optional("date"): str,
            vol.Optional("lat"): vol.Coerce(float),
            vol.Optional("lon"): vol.Coerce(float),
            vol.Optional("tz"): str,
        }
    )
    @websocket_api.async_response
    async def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        date_str = msg.get("date")
        if date_str:
            try:
                dt.date.fromisoformat(date_str)
            except ValueError:
                connection.send_error(
                    msg["id"], "invalid_date", f"Invalid date format: {date_str}"
                )
                return

        tz_str = msg.get("tz") or hass.config.time_zone
        lat = msg.get("lat")
        lon = msg.get("lon")
        if lat is None or lon is None:
            lat = hass.config.latitude
            lon = hass.config.longitude

        target_date = _resolve_target_date(date_str, tz_str)
        cache_key = (lat, lon, target_date.isoformat(), tz_str)
        cached = _DAY_CACHE.get(cache_key)
        if cached is not None:
            _DAY_CACHE.move_to_end(cache_key)
            connection.send_result(msg["id"], cached)
            return

        # astral/pytz read tz files synchronously — run off the event loop.
        def _compute() -> dict[str, Any]:
            local_tz = zi.ZoneInfo(tz_str)
            location = LocationInfo(latitude=lat, longitude=lon, timezone=tz_str)

            points = []
            for minute in range(0, 1440 + 1, 15):
                hour = minute // 60
                m = minute % 60
                if minute == 1440:
                    dt_local = dt.datetime.combine(
                        target_date + dt.timedelta(days=1),
                        dt.time(0, 0),
                        tzinfo=local_tz,
                    )
                else:
                    dt_local = dt.datetime.combine(
                        target_date, dt.time(hour, m), tzinfo=local_tz
                    )
                try:
                    el = elevation(location.observer, dt_local)
                    az_val = azimuth(location.observer, dt_local)
                    points.append(
                        {
                            "time": minute,
                            "elevation": round(el, 2),
                            "azimuth": round(az_val, 2),
                        }
                    )
                except Exception:
                    pass

            civil = _sun_safe(location, target_date, Depression.CIVIL)
            events = {}

            def _get_cardinal(az_val: float) -> str:
                directions = [
                    "N",
                    "NNE",
                    "NE",
                    "ENE",
                    "E",
                    "ESE",
                    "SE",
                    "SSE",
                    "S",
                    "SSW",
                    "SW",
                    "WSW",
                    "W",
                    "WNW",
                    "NW",
                    "NNW",
                ]
                return directions[int((az_val + 11.25) / 22.5) % 16]

            def _format_event(event_dt: dt.datetime | None) -> dict[str, Any] | None:
                if event_dt is None:
                    return None
                local_dt = event_dt.astimezone(local_tz)
                local_midnight = dt.datetime.combine(
                    target_date, dt.time(0, 0), tzinfo=local_tz
                )
                time_mins = int((local_dt - local_midnight).total_seconds() / 60)
                try:
                    az_val = azimuth(location.observer, local_dt)
                    az_rounded = round(az_val, 2)
                    cardinal = _get_cardinal(az_rounded)
                except Exception:
                    az_rounded = 0.0
                    cardinal = "N"
                return {
                    "time": time_mins,
                    "formatted": local_dt.strftime("%H:%M"),
                    "azimuth": az_rounded,
                    "cardinal": cardinal,
                }

            if civil:
                events["sunrise"] = _format_event(civil.get("sunrise"))
                events["noon"] = _format_event(civil.get("noon"))
                events["sunset"] = _format_event(civil.get("sunset"))

            target_date_data = compute_sun_day_data(lat, lon, tz_str, target_date)
            prev_date = target_date - dt.timedelta(days=1)
            prev_date_data = compute_sun_day_data(lat, lon, tz_str, prev_date)

            return {
                "date": target_date.isoformat(),
                "lat": lat,
                "lon": lon,
                "points": points,
                "events": events,
                "day_data": target_date_data,
                "prev_day_data": prev_date_data,
            }

        result = await hass.async_add_executor_job(_compute)
        _DAY_CACHE[cache_key] = result
        _DAY_CACHE.move_to_end(cache_key)
        if len(_DAY_CACHE) > _DAY_CACHE_MAX_SIZE:
            _DAY_CACHE.popitem(last=False)
        connection.send_result(msg["id"], result)

    return handle


def _ws_sun_year() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/sun/year",
            vol.Optional("year"): int,
            vol.Optional("lat"): vol.Coerce(float),
            vol.Optional("lon"): vol.Coerce(float),
            vol.Optional("tz"): str,
        }
    )
    @websocket_api.async_response
    async def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        year = msg.get("year") or dt.date.today().year
        lat = msg.get("lat")
        lon = msg.get("lon")
        if lat is None or lon is None:
            lat = hass.config.latitude
            lon = hass.config.longitude
        tz_str = msg.get("tz") or hass.config.time_zone

        cache_key = (lat, lon, year, tz_str)
        cached = _YEAR_CACHE.get(cache_key)
        if cached is not None:
            _YEAR_CACHE.move_to_end(cache_key)
            connection.send_result(msg["id"], cached)
            return

        # astral/pytz read tz files synchronously — run the 365-day loop off the event loop.
        def _compute() -> dict[str, Any]:
            days = []
            start = dt.date(year, 1, 1)
            for i in range(366 if _is_leap(year) else 365):
                d = start + dt.timedelta(days=i)
                day_data = compute_sun_day_data(lat, lon, tz_str, d)
                days.append(day_data)

            return {"year": year, "days": days}

        result = await hass.async_add_executor_job(_compute)
        _YEAR_CACHE[cache_key] = result
        _YEAR_CACHE.move_to_end(cache_key)
        if len(_YEAR_CACHE) > _YEAR_CACHE_MAX_SIZE:
            _YEAR_CACHE.popitem(last=False)
        connection.send_result(msg["id"], result)

    return handle


_TIMELINE_SLOT_CACHE_MAX_SIZE = 16
_TIMELINE_SLOT_CACHE: OrderedDict[tuple[float, float, int, str], dict[str, Any]] = (
    OrderedDict()
)


def _ws_timeline_slot_times() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/timeline/slot_times",
            vol.Optional("year"): int,
            vol.Optional("lat"): vol.Coerce(float),
            vol.Optional("lon"): vol.Coerce(float),
            vol.Optional("tz"): str,
        }
    )
    @websocket_api.async_response
    async def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        from ..const import default_primary_slots
        from ..slot_calc import resolve_slot_times

        year = msg.get("year") or dt.date.today().year
        lat = msg.get("lat")
        lon = msg.get("lon")
        if lat is None or lon is None:
            lat = hass.config.latitude
            lon = hass.config.longitude
        tz_str = msg.get("tz") or hass.config.time_zone

        cache_key = (lat, lon, year, tz_str)
        cached = _TIMELINE_SLOT_CACHE.get(cache_key)
        if cached is not None:
            _TIMELINE_SLOT_CACHE.move_to_end(cache_key)
            connection.send_result(msg["id"], cached)
            return

        def _compute() -> dict[str, Any]:
            primary_slots = default_primary_slots()
            curves: dict[str, list[int]] = {s["id"]: [] for s in primary_slots}

            start = dt.date(year, 1, 1)
            days_cnt = 366 if _is_leap(year) else 365
            for i in range(days_cnt):
                d = start + dt.timedelta(days=i)
                sun_data = compute_sun_day_data(lat, lon, tz_str, d)
                resolved = resolve_slot_times(primary_slots, sun_data)
                for slot in resolved:
                    if slot["id"] in curves:
                        curves[slot["id"]].append(slot["start"])

            return {"year": year, "curves": curves}

        result = await hass.async_add_executor_job(_compute)
        _TIMELINE_SLOT_CACHE[cache_key] = result
        _TIMELINE_SLOT_CACHE.move_to_end(cache_key)
        if len(_TIMELINE_SLOT_CACHE) > _TIMELINE_SLOT_CACHE_MAX_SIZE:
            _TIMELINE_SLOT_CACHE.popitem(last=False)
        connection.send_result(msg["id"], result)

    return handle
