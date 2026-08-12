"""Sun (day/year) WebSocket commands for Twilight."""

from __future__ import annotations

import asyncio
import datetime as dt
import zoneinfo as zi
from collections import OrderedDict
from collections.abc import Callable, Hashable
from typing import Any

import voluptuous as vol
from astral import Depression, LocationInfo
from astral.sun import azimuth, elevation
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import DOMAIN, PRIMARY_CHANNEL_ID, default_primary_slots
from ..slot_calc import resolve_slot_times
from ..sun_calc import _is_leap, _sun_safe, compute_sun_day_data

# In-flight executor jobs per cache, keyed the same way as the cache itself.
# Two concurrent requests for the same (still-uncached) key — e.g. two panel
# tabs opening the Timeline view at once — would otherwise both pay the full
# ~seconds-long computation; the second now awaits the first's future instead.
_day_in_flight: dict[Hashable, asyncio.Future[tuple[dict[str, Any], bool]]] = {}
_year_in_flight: dict[Hashable, asyncio.Future[tuple[dict[str, Any], bool]]] = {}
_timeline_in_flight: dict[Hashable, asyncio.Future[tuple[dict[str, Any], bool]]] = {}


async def _dedup_executor_job(
    hass: HomeAssistant,
    in_flight: dict[Hashable, asyncio.Future[tuple[dict[str, Any], bool]]],
    key: Hashable,
    compute: Callable[[], dict[str, Any]],
) -> tuple[dict[str, Any], bool]:
    """Run `compute` in the executor, coalescing concurrent callers for the same key.

    Returns `(result, stale)`. A cache invalidation (e.g.
    clear_timeline_slot_cache()) may drop this call's own `in_flight[key]`
    entry out from under it while `compute` is still running in the executor
    — the entry is popped instead of just cancelled because
    `hass.async_add_executor_job` cannot actually interrupt a synchronous
    worker-thread computation. `stale=True` tells the caller its result was
    computed from config that changed mid-flight and must not be cached. The
    stale flag is carried inside the future's result (not returned as a
    bare `False` for coalesced callers) so every caller waiting on the same
    in-flight computation — not just the one that started it — sees the
    correct staleness.
    """
    existing = in_flight.get(key)
    if existing is not None:
        return await existing

    future: asyncio.Future[tuple[dict[str, Any], bool]] = hass.loop.create_future()
    in_flight[key] = future
    try:
        result = await hass.async_add_executor_job(compute)
    except BaseException as err:
        if in_flight.get(key) is future:
            del in_flight[key]
        future.set_exception(err)
        # A concurrent caller awaiting the future still receives the
        # exception; marking it retrieved here prevents asyncio's "Future
        # exception was never retrieved" warning when no concurrent caller
        # exists (we re-raise to our own caller instead of awaiting it).
        future.exception()
        raise
    else:
        stale = in_flight.get(key) is not future
        if not stale:
            del in_flight[key]
        future.set_result((result, stale))
        return result, stale

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
            vol.Optional("lat"): vol.All(vol.Coerce(float), vol.Range(min=-90, max=90)),
            vol.Optional("lon"): vol.All(vol.Coerce(float), vol.Range(min=-180, max=180)),
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
        try:
            zi.ZoneInfo(tz_str)
        except Exception:
            connection.send_error(
                msg["id"], "invalid_tz", f"Invalid timezone: {tz_str}"
            )
            return

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
                except ValueError:
                    # astral raises ValueError for undefined sun positions (e.g.
                    # polar day/night); skip that minute. Narrowed from a bare
                    # `except Exception` so real errors (TypeError, …) surface.
                    pass

            civil = _sun_safe(location, target_date, Depression.CIVIL, tzinfo=local_tz)
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
                except ValueError:
                    # astral raises ValueError for undefined sun positions;
                    # fall back to due north. Narrowed from a bare
                    # `except Exception` so real errors surface.
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

        result, _stale = await _dedup_executor_job(hass, _day_in_flight, cache_key, _compute)
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
            vol.Optional("lat"): vol.All(vol.Coerce(float), vol.Range(min=-90, max=90)),
            vol.Optional("lon"): vol.All(vol.Coerce(float), vol.Range(min=-180, max=180)),
            vol.Optional("tz"): str,
        }
    )
    @websocket_api.async_response
    async def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        lat = msg.get("lat")
        lon = msg.get("lon")
        if lat is None or lon is None:
            lat = hass.config.latitude
            lon = hass.config.longitude
        tz_str = msg.get("tz") or hass.config.time_zone
        try:
            zi.ZoneInfo(tz_str)
        except Exception:
            connection.send_error(
                msg["id"], "invalid_tz", f"Invalid timezone: {tz_str}"
            )
            return

        raw_year = msg.get("year")
        if raw_year is not None:
            year = raw_year
            if year <= 0 or year > 9999:
                connection.send_error(
                    msg["id"], "invalid_year", f"Invalid year: {year}"
                )
                return
        else:
            year = dt.datetime.now(zi.ZoneInfo(tz_str)).year

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

        result, _stale = await _dedup_executor_job(hass, _year_in_flight, cache_key, _compute)
        _YEAR_CACHE[cache_key] = result
        _YEAR_CACHE.move_to_end(cache_key)
        if len(_YEAR_CACHE) > _YEAR_CACHE_MAX_SIZE:
            _YEAR_CACHE.popitem(last=False)
        connection.send_result(msg["id"], result)

    return handle


_TIMELINE_SLOT_CACHE_MAX_SIZE = 16
_TIMELINE_SLOT_CACHE: OrderedDict[
    tuple[float, float, int, str, str | None], dict[str, Any]
] = OrderedDict()

def clear_timeline_slot_cache() -> None:
    """Clear the timeline slot cache, called when area configs change.

    Also drops any in-flight computation's `_timeline_in_flight` entry — the
    cache key carries no fingerprint of the Primary-slot config it was
    computed from, so a computation still running from before this clear
    would otherwise finish and silently repopulate the cache with a result
    based on the now-stale config. Dropping the dict entry (rather than
    cancelling the future) makes `_dedup_executor_job` report that result as
    stale via its `(result, stale)` return, so its caller skips the cache
    write instead — the executor computation itself keeps running to
    completion either way, since a worker-thread callable can't be
    interrupted from here.
    """
    _TIMELINE_SLOT_CACHE.clear()
    _timeline_in_flight.clear()


def _ws_timeline_slot_times() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/timeline/slot_times",
            vol.Optional("year"): int,
            vol.Optional("lat"): vol.All(vol.Coerce(float), vol.Range(min=-90, max=90)),
            vol.Optional("lon"): vol.All(vol.Coerce(float), vol.Range(min=-180, max=180)),
            vol.Optional("tz"): str,
            vol.Optional("area_id"): vol.Any(None, str),
        }
    )
    @websocket_api.async_response
    async def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        area_id = msg.get("area_id")

        lat: float
        lon: float
        tz_str: str

        primary_slots = default_primary_slots()
        if area_id:
            store = hass.data[DOMAIN].get("store")
            # store.get_area() already materializes Primary slots into a full
            # 10-slot list (see store.materialize_area_primary_slots).
            area_config = store.get_area(area_id) if store else None
            if area_config:
                channels = area_config.get("channels", {})
                primary_ch = channels.get(PRIMARY_CHANNEL_ID, {})
                if isinstance(primary_ch, dict) and primary_ch.get("slots"):
                    primary_slots = primary_ch["slots"]

            lat = hass.config.latitude
            lon = hass.config.longitude
            tz_str = hass.config.time_zone
        else:
            msg_lat = msg.get("lat")
            msg_lon = msg.get("lon")
            lat = hass.config.latitude if msg_lat is None else float(msg_lat)
            lon = hass.config.longitude if msg_lon is None else float(msg_lon)
            tz_str = msg.get("tz") or hass.config.time_zone

        raw_year = msg.get("year")
        if raw_year is not None:
            year = raw_year
            if year <= 0 or year > 9999:
                connection.send_error(
                    msg["id"], "invalid_year", f"Invalid year: {year}"
                )
                return
        else:
            year = dt.datetime.now(zi.ZoneInfo(tz_str)).year

        cache_key = (lat, lon, year, tz_str, area_id)
        cached = _TIMELINE_SLOT_CACHE.get(cache_key)
        if cached is not None:
            _TIMELINE_SLOT_CACHE.move_to_end(cache_key)
            connection.send_result(msg["id"], cached)
            return

        def _compute() -> dict[str, Any]:
            curves: dict[str, list[int | None]] = {
                s["id"]: [] for s in primary_slots if isinstance(s, dict) and "id" in s
            }

            start = dt.date(year, 1, 1)
            days_cnt = 366 if _is_leap(year) else 365
            for i in range(days_cnt):
                d = start + dt.timedelta(days=i)
                sun_data = compute_sun_day_data(lat, lon, tz_str, d)
                resolved = resolve_slot_times(primary_slots, sun_data)
                # A synthetic slot has no real sun event on this day (polar
                # day/night) and only carries the solar-noon placeholder the
                # scheduler needs. Emit None so the chart renders a gap instead
                # of a fake zone boundary.
                for slot in resolved:
                    if slot["id"] in curves:
                        curves[slot["id"]].append(
                            None if slot.get("synthetic") else slot["start"]
                        )

            return {"year": year, "curves": curves}

        result, stale = await _dedup_executor_job(
            hass, _timeline_in_flight, cache_key, _compute
        )
        # If an area/save cleared the cache while this computation was in
        # flight, its result was read from a now-stale primary_slots
        # snapshot — discard it instead of repopulating the cache with
        # outdated curves.
        if not stale:
            _TIMELINE_SLOT_CACHE[cache_key] = result
            _TIMELINE_SLOT_CACHE.move_to_end(cache_key)
            if len(_TIMELINE_SLOT_CACHE) > _TIMELINE_SLOT_CACHE_MAX_SIZE:
                _TIMELINE_SLOT_CACHE.popitem(last=False)
        connection.send_result(msg["id"], result)

    return handle
