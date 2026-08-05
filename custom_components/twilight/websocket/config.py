"""Global config WebSocket commands for Twilight."""

from __future__ import annotations

import logging
from datetime import date as _date
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send

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
from ..slot_calc import compute_dynamic_min_slot_distance
from ..store import GLOBAL_DEFAULTS, TwilightStore

_LOGGER = logging.getLogger(__name__)

# Type-guard for the global config. Tolerant by design (ALLOW_EXTRA) so the
# frontend payload is never rejected for an unknown key, but known scalar keys
# are type-checked so a corrupt value cannot be persisted.
_GLOBAL_CONFIG_SCHEMA = vol.Schema(
    {
        vol.Optional("area_template"): dict,
    },
    extra=vol.ALLOW_EXTRA,
)


async def _async_reload_all_engines(hass: HomeAssistant, store: TwilightStore) -> None:
    """Reload engines for all areas after a full store restore."""
    engines = hass.data[DOMAIN].setdefault("engines", {})
    previous_area_ids = set(engines.keys())

    for area_id, existing_engine in list(engines.items()):
        await existing_engine.async_teardown()
        engines.pop(area_id, None)

    new_areas = store.get_areas()

    for area_id, config in new_areas.items():
        if area_wants_engine(config):
            await async_start_engine(hass, area_id, config)
        else:
            await async_clear_area_entities(hass, area_id)

    for area_id in previous_area_ids - new_areas.keys():
        await async_clear_area_entities(hass, area_id)

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
        connection.send_result(msg["id"], msg["config"])

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
        try:
            await store.async_import_all(msg["payload"])
            await _async_reload_all_engines(hass, store)
        except Exception as err:
            connection.send_error(msg["id"], "import_failed", str(err))
            return
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
    @callback
    def handle(
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
            now_year = _date.today().year
            dynamic_min = compute_dynamic_min_slot_distance(lat, lon, tz_str, now_year)
            # 20 = known real-world yearly-minimum adjacent-zone gap (equator, see
            # scripts/zone_gap_survey.py), floors dynamic_min so the result never
            # drops below MIN_SLOT_DISTANCE_MINUTES.
            effective_min = max(20.0, dynamic_min) - MIN_SLOT_DISTANCE_MINUTES
            defaults["min_slot_distance_minutes"] = effective_min

        connection.send_result(msg["id"], defaults)

    return handle
