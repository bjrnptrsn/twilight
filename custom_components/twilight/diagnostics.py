"""Diagnostics export for the Twilight integration."""

from __future__ import annotations

from dataclasses import fields, is_dataclass
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN


def _json_safe(val: Any) -> Any:
    """Recursively convert a RunState field value into a JSON-serializable form."""
    if isinstance(val, frozenset):
        return sorted(val)
    if hasattr(val, "isoformat"):
        return val.isoformat()
    if is_dataclass(val) and not isinstance(val, type):
        return {f.name: _json_safe(getattr(val, f.name)) for f in fields(val)}
    if isinstance(val, dict):
        return {k: _json_safe(v) for k, v in val.items()}
    return val


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, config_entry: ConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for the Twilight config entry."""
    return build_diagnostics(hass)


def build_diagnostics(hass: HomeAssistant) -> dict[str, Any]:
    """Build a full diagnostics snapshot of all Twilight engines and store config."""
    store = hass.data.get(DOMAIN, {}).get("store")
    engines: dict[str, Any] = hass.data.get(DOMAIN, {}).get("engines", {})

    diag: dict[str, Any] = {
        "integration": DOMAIN,
        "store": {
            "areas": store.get_areas() if store else None,
            "global": store.get_global() if store else None,
        },
        "engines": {},
    }

    for area_id, engine in engines.items():
        state = engine.run_state

        run_dict: dict[str, Any] = {
            f.name: _json_safe(getattr(state, f.name)) for f in fields(state)
        }

        scene_map: dict[str, Any] = {}
        for (channel_id, slot_id), info in engine.scene_map.items():
            # JSON keys can't be tuples → join the (channel, slot) key.
            scene_map[f"{channel_id}/{slot_id}"] = {
                "channel_id": channel_id,
                "scene_entity_id": info.scene_entity_id,
                "scene_type": str(info.scene_type),
                "extracted_entities": sorted(info.extracted_entities),
                "configured_entities": sorted(info.configured_entities),
            }

        light_states: dict[str, Any] = {}
        for entity_id in (
            set().union(
                *[
                    info.extracted_entities | info.configured_entities
                    for info in engine.scene_map.values()
                ]
            )
            if engine.scene_map
            else set()
        ):
            ha_state = hass.states.get(entity_id)
            if ha_state:
                light_states[entity_id] = {
                    "state": ha_state.state,
                    "brightness": ha_state.attributes.get("brightness"),
                    "color_temp_kelvin": ha_state.attributes.get("color_temp_kelvin"),
                }
            else:
                light_states[entity_id] = None

        diag["engines"][area_id] = {
            "run_state": run_dict,
            "scene_map": scene_map,
            "light_states": light_states,
        }

    return diag
