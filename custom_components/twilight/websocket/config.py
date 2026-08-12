"""Global config WebSocket commands for Twilight."""

from __future__ import annotations

import copy
import logging
from contextlib import AsyncExitStack
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.util import dt as dt_util

from ..const import (
    DOMAIN,
    MIN_SLOT_DISTANCE_MINUTES,
    PLACEHOLDER_DEFAULTS,
    SIGNAL_ENGINES_CHANGED,
)
from ..engine_registry import (
    area_wants_engine,
    async_clear_area_entities,
    async_start_engine,
)
from ..helpers import get_area_lock, get_setup_lock, remove_area_lock
from ..slot_calc import compute_dynamic_min_slot_distance
from ..store import GLOBAL_DEFAULTS, TwilightStore
from .sun import clear_timeline_slot_cache

_LOGGER = logging.getLogger(__name__)

# Type-guard for the global config. Tolerant by design (ALLOW_EXTRA) so the
# frontend payload is never rejected for an unknown key, but known scalar keys
# are type-checked so a corrupt value cannot be persisted.
#
# Note: async_save_global() does NOT prune to GLOBAL_DEFAULTS (unlike
# async_load()/async_import_all()) — extra keys saved via this endpoint are
# kept verbatim (see test_global_save_preserves_unknown_keys), but only
# survive an in-memory round trip. A full reload/restart still prunes them on
# the next async_load(), since HA Store persists exactly what was passed to
# async_save() but async_load() re-applies GLOBAL_DEFAULTS pruning on read.
# This is a real save/load asymmetry, not (yet) considered a bug to fix.
_GLOBAL_CONFIG_SCHEMA = vol.Schema(
    {
        vol.Optional("area_template"): dict,
    },
    extra=vol.ALLOW_EXTRA,
)


async def _async_reload_all_engines(hass: HomeAssistant, store: TwilightStore) -> None:
    """Reload engines for all areas after a full store restore.

    Expects the caller (_ws_global_import) to hold every affected area's lock
    for the whole import and reload operation.
    """
    engines = hass.data[DOMAIN].setdefault("engines", {})
    previous_area_ids = set(engines.keys())
    new_areas = store.get_areas()

    for area_id, existing_engine in list(engines.items()):
        try:
            await existing_engine.async_teardown()
        except Exception:
            _LOGGER.exception(
                "Error tearing down TwilightEngine for area %s during "
                "global/import reload",
                area_id,
            )
        engines.pop(area_id, None)

    for area_id, config in new_areas.items():
        if area_wants_engine(config):
            await async_start_engine(hass, area_id, config)
        else:
            await async_clear_area_entities(hass, area_id)

    for area_id in previous_area_ids - new_areas.keys():
        await async_clear_area_entities(hass, area_id)

    clear_timeline_slot_cache()
    async_dispatcher_send(hass, SIGNAL_ENGINES_CHANGED)


def _ws_global_get() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command({vol.Required("type"): "twilight/global/get"})
    @callback
    def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        store = hass.data[DOMAIN].get("store")
        global_config = store.get_global() if store else {}
        connection.send_result(msg["id"], global_config)

    return handle


def _ws_global_save() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/global/save",
            vol.Required("config"): _GLOBAL_CONFIG_SCHEMA,
        }
    )
    @websocket_api.require_admin
    @websocket_api.async_response
    async def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        store = hass.data[DOMAIN].get("store")
        if not store:
            connection.send_error(
                msg["id"], "store_not_initialized", "Store not initialized"
            )
            return

        await store.async_save_global(msg["config"])
        connection.send_result(msg["id"], store.get_global())

    return handle


def _ws_global_export() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command({vol.Required("type"): "twilight/global/export"})
    @websocket_api.require_admin
    @callback
    def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        store = hass.data[DOMAIN].get("store")
        if not store:
            connection.send_error(
                msg["id"], "store_not_initialized", "Store not initialized"
            )
            return
        connection.send_result(msg["id"], store.export_all())

    return handle


def _ws_global_import() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/global/import",
            vol.Required("payload"): dict,
        }
    )
    @websocket_api.require_admin
    @websocket_api.async_response
    async def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        store = hass.data[DOMAIN].get("store")
        if not store:
            connection.send_error(
                msg["id"], "store_not_initialized", "Store not initialized"
            )
            return
        payload = msg["payload"]
        if not isinstance(payload, dict):
            connection.send_error(
                msg["id"], "invalid_payload", "Payload must be a dictionary"
            )
            return
        if "areas" in payload and not isinstance(payload["areas"], dict):
            connection.send_error(
                msg["id"], "invalid_payload", "'areas' must be a dictionary"
            )
            return
        if "global" in payload and not isinstance(payload["global"], dict):
            connection.send_error(
                msg["id"], "invalid_payload", "'global' must be a dictionary"
            )
            return

        backup_data = copy.deepcopy(store.data)
        existing_area_ids = set(store.get_areas().keys())
        payload_areas = payload.get("areas") if isinstance(payload, dict) else {}
        payload_area_ids = (
            set(payload_areas.keys()) if isinstance(payload_areas, dict) else set()
        )
        all_area_ids = existing_area_ids | payload_area_ids

        async with AsyncExitStack() as stack:
            # Also exclude a concurrent Twilight (re-)setup reload
            # (__init__.py's async_setup): the reload releases each area
            # lock as soon as its own teardown loop passes that area, so by
            # the time it's suspended in store.async_load() it may hold no
            # area lock at all — only the setup lock. Without also taking it
            # here, _async_reload_all_engines() below could register an
            # engine that the reload's subsequent engines.clear() then
            # discards (leaked — never torn down). See get_setup_lock()'s
            # docstring for the full mechanism.
            await stack.enter_async_context(get_setup_lock(hass))
            for area_id in all_area_ids:
                await stack.enter_async_context(get_area_lock(hass, area_id))
            try:
                await store.async_import_all(payload)
                await _async_reload_all_engines(hass, store)
            except Exception:
                _LOGGER.exception("Failed to import global config, rolling back")
                try:
                    await store.async_restore_data(backup_data)
                    await _async_reload_all_engines(hass, store)
                except Exception:
                    _LOGGER.exception("Error during rollback of global config import")
                connection.send_error(
                    msg["id"], "import_failed", "Failed to import configuration"
                )
                return

        # Areas dropped by the import no longer need a lock in memory.
        for area_id in existing_area_ids - payload_area_ids:
            remove_area_lock(hass, area_id)

        connection.send_result(msg["id"], store.export_all())

    return handle


def _ws_global_defaults() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command({vol.Required("type"): "twilight/global/defaults"})
    @callback
    def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        connection.send_result(msg["id"], dict(GLOBAL_DEFAULTS))

    return handle


def _ws_placeholder_defaults() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/placeholder_defaults",
            vol.Optional("area_id"): str,
        }
    )
    @websocket_api.async_response
    async def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        defaults = dict(PLACEHOLDER_DEFAULTS)
        # No per-area location override exists (see twilight_manager.py's
        # _get_location() docstring) — always resolve from hass.config.
        lat, lon, tz_str = (
            hass.config.latitude,
            hass.config.longitude,
            hass.config.time_zone,
        )

        if lat is not None and lon is not None and tz_str:
            now_year = dt_util.now().year
            dynamic_min = await hass.async_add_executor_job(
                compute_dynamic_min_slot_distance, lat, lon, tz_str, now_year
            )
            # 20 = known real-world yearly-minimum adjacent-zone gap (equator, see
            # scripts/zone_gap_survey.py), floors dynamic_min so the result never
            # drops below MIN_SLOT_DISTANCE_MINUTES.
            effective_min = max(20.0, dynamic_min) - MIN_SLOT_DISTANCE_MINUTES
            defaults["min_slot_distance_minutes"] = effective_min

        connection.send_result(msg["id"], defaults)

    return handle
