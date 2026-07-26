"""WebSocket API for Twilight.

Modularized by concern: each submodule owns its WS-command factories and any
module-local helpers (no shared helpers across modules). This package only wires
them up via async_register_commands().
"""

from __future__ import annotations

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from .analytics import _ws_analytics_get
from .areas import (
    _ws_area_delete,
    _ws_area_extracted,
    _ws_area_new_draft,
    _ws_area_save,
    _ws_area_slot_times,
    _ws_area_validate,
    _ws_areas_list,
    _ws_slot_times_preview,
)
from .config import (
    _ws_global_defaults,
    _ws_global_export,
    _ws_global_get,
    _ws_global_import,
    _ws_global_save,
    _ws_placeholder_defaults,
)
from .diagnostics import _ws_diagnostics
from .heatmap import (
    _ws_heatmap_compute,
    _ws_heatmap_profile_delete,
    _ws_heatmap_profile_save,
)
from .inputs import _ws_trigger_input
from .registry import _ws_area_registry_list, _ws_lab_area_entities
from .subscribe import _ws_subscribe_all
from .sun import _ws_sun_day, _ws_sun_year, _ws_timeline_slot_times


def async_register_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, _ws_analytics_get())
    websocket_api.async_register_command(hass, _ws_area_registry_list())
    websocket_api.async_register_command(hass, _ws_sun_year())
    websocket_api.async_register_command(hass, _ws_sun_day())
    websocket_api.async_register_command(hass, _ws_timeline_slot_times())
    websocket_api.async_register_command(hass, _ws_lab_area_entities())
    websocket_api.async_register_command(hass, _ws_areas_list())
    websocket_api.async_register_command(hass, _ws_area_extracted())
    websocket_api.async_register_command(hass, _ws_area_validate())
    websocket_api.async_register_command(hass, _ws_area_save())
    websocket_api.async_register_command(hass, _ws_area_delete())
    websocket_api.async_register_command(hass, _ws_area_new_draft())
    websocket_api.async_register_command(hass, _ws_area_slot_times())
    websocket_api.async_register_command(hass, _ws_slot_times_preview())
    websocket_api.async_register_command(hass, _ws_global_get())
    websocket_api.async_register_command(hass, _ws_global_save())
    websocket_api.async_register_command(hass, _ws_global_export())
    websocket_api.async_register_command(hass, _ws_global_import())
    websocket_api.async_register_command(hass, _ws_global_defaults())
    websocket_api.async_register_command(hass, _ws_placeholder_defaults())
    websocket_api.async_register_command(hass, _ws_subscribe_all())
    websocket_api.async_register_command(hass, _ws_diagnostics())
    websocket_api.async_register_command(hass, _ws_trigger_input())
    websocket_api.async_register_command(hass, _ws_heatmap_compute())
    websocket_api.async_register_command(hass, _ws_heatmap_profile_save())
    websocket_api.async_register_command(hass, _ws_heatmap_profile_delete())
