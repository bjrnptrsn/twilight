"""Twilight configuration and state persistence store using Home Assistant Storage."""

from __future__ import annotations

import copy
import logging
import secrets
from enum import StrEnum
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    BACKUP_VERSION,
    DEFAULT_AREA_TEMPLATE,
    PRIMARY_CHANNEL_ID,
    STANDARD_NAMES,
    STANDARD_ZONES,
    AggregationMode,
    RetriggerMode,
    StartType,
    default_channels,
)

_LOGGER = logging.getLogger(__name__)

STORAGE_KEY = "twilight"
STORAGE_VERSION = 1

# Top-level area keys managed as plain values (vs. the structured "channels"/
# "inputs"/"activities"/"_state" handled separately by _normalize_area_config).
# Maps each key to its const.py default, used to both prune unknown/renamed
# keys and backfill missing ones on every load — the single source of truth
# for what a valid Area config's flat fields look like.
AREA_DEFAULTS: dict[str, Any] = {
    "area_id": None,
    "name": "",
    "enabled": True,
    "manual_only": False,
    "lux_threshold": None,
    "lux_watch_window": None,
    "transition_on_seconds": None,
    "lux_ignore_active": None,
    "lux_ignore_scope": None,
}
AREA_STRUCTURED_KEYS = frozenset(
    {"channels", "inputs", "activities", "sensors", "_state"}
)

# Global config keys, mapped to their const.py default. Single source of
# truth for pruning unknown/renamed keys and backfilling missing ones.
GLOBAL_DEFAULTS: dict[str, Any] = {
    "area_template": DEFAULT_AREA_TEMPLATE,
}


def _prune_and_default(
    config: dict[str, Any],
    defaults: dict[str, Any],
    *,
    keep: frozenset[str] = frozenset(),
) -> bool:
    """Whitelist-prune unknown/renamed keys, backfill missing ones with their default.

    `keep` lists additional keys to leave untouched (e.g. structured sub-trees
    normalized elsewhere, or identifying fields with no static default).
    """
    modified = False
    allowed = defaults.keys() | keep
    for key in list(config):
        if key not in allowed:
            del config[key]
            modified = True
    for key, default in defaults.items():
        if key not in config:
            config[key] = copy.deepcopy(default)
            modified = True
    return modified


def _normalize_channels(config: dict[str, Any]) -> bool:
    """Ensure the area has a well-formed channels dict, return True if modified.

    Guarantees:
      - a "channels" dict exists with a complete Primary channel
      - Primary has exactly the 10 fixed astral slots, in order; only
        scene_entity_id/offset_minutes/name carry over from existing slots
      - every Primary slot has start_type=astral and a configured_entities list
      - custom channels keep their free slot lists; slots get start_type
        defaulted to astral and configured_entities defaulted to []
    """
    modified = False

    channels = config.get("channels")
    if not isinstance(channels, dict):
        channels = {}
        config["channels"] = channels
        modified = True

    for _ch_id, channel in channels.items():
        if isinstance(channel, dict) and "transition_on_seconds" not in channel:
            channel["transition_on_seconds"] = None
            modified = True

    # --- Primary channel: rebuild the 10 fixed slots in order ---
    primary = channels.get(PRIMARY_CHANNEL_ID)
    if not isinstance(primary, dict):
        primary = {"name": "Primary", "enabled": True, "slots": []}
        channels[PRIMARY_CHANNEL_ID] = primary
        modified = True

    existing_primary_slots = primary.get("slots")
    if not isinstance(existing_primary_slots, list):
        existing_primary_slots = []

    slot_by_zone: dict[str, dict[str, Any]] = {}
    for slot in existing_primary_slots:
        if not isinstance(slot, dict):
            continue
        # Use id only when zone is genuinely absent (None), not when it is an
        # empty string — `or` would wrongly fall through on zone="".
        zone = slot.get("zone")
        if zone is None:
            zone = slot.get("id")
        if isinstance(zone, str) and zone in STANDARD_ZONES:
            slot_by_zone[zone] = slot

    new_primary_slots: list[dict[str, Any]] = []
    for zone in STANDARD_ZONES:
        src = slot_by_zone.get(zone)
        new_primary_slots.append(
            {
                "id": zone,
                "name": (src.get("name") if src else None) or STANDARD_NAMES[zone],
                "start_type": StartType.ASTRAL.value,
                "zone": zone,
                "offset_minutes": src.get("offset_minutes") if src else 0,
                "scene_entity_id": src.get("scene_entity_id") if src else None,
                "configured_entities": (src.get("configured_entities") if src else [])
                or [],
            }
        )

    if new_primary_slots != existing_primary_slots:
        primary["slots"] = new_primary_slots
        modified = True
    if primary.get("enabled") is not True:
        primary["enabled"] = True
        modified = True
    if not primary.get("name"):
        primary["name"] = "Primary"
        modified = True

    # --- Custom channels: default start_type / configured_entities / stable ID / canonical order ---
    return _normalize_custom_channels(channels) or modified


def _normalize_custom_channels(channels: dict[str, Any]) -> bool:
    """Default start_type / configured_entities / stable ID / canonical order for custom channels."""
    modified = False
    existing_slot_ids: set[str] = set(STANDARD_ZONES)
    for _ch_id, channel in channels.items():
        if not isinstance(channel, dict):
            continue
        for s in channel.get("slots", []):
            if isinstance(s, dict) and isinstance(s.get("id"), str) and s["id"]:
                existing_slot_ids.add(s["id"])

    for ch_id, channel in channels.items():
        if ch_id == PRIMARY_CHANNEL_ID or not isinstance(channel, dict):
            continue
        if "enabled" not in channel:
            channel["enabled"] = True
            modified = True
        slots = channel.get("slots")
        if not isinstance(slots, list):
            channel["slots"] = []
            modified = True
            continue

        astral_slots: list[dict[str, Any]] = []
        fixed_slots: list[dict[str, Any]] = []

        for slot in slots:
            if not isinstance(slot, dict):
                continue

            # Assign stable custom_ ID if missing or draft_ ID (§5.2)
            slot_id = slot.get("id")
            if not slot_id or not isinstance(slot_id, str) or slot_id.startswith("draft_"):
                candidate = f"custom_{secrets.token_hex(4)}"
                while candidate in existing_slot_ids:
                    candidate = f"custom_{secrets.token_hex(4)}"
                existing_slot_ids.add(candidate)
                slot["id"] = candidate
                modified = True

            if not slot.get("start_type"):
                slot["start_type"] = StartType.ASTRAL.value
                modified = True
            if "configured_entities" not in slot:
                slot["configured_entities"] = []
                modified = True

            start_type = slot.get("start_type")
            if start_type == StartType.FIXED.value or start_type == "fixed":
                fixed_slots.append(slot)
            else:
                astral_slots.append(slot)

        # Sun-Event-Slots first, sorted by STANDARD_ZONES index
        def _zone_key(s: dict[str, Any]) -> int:
            z = s.get("zone") or s.get("id")
            if isinstance(z, str) and z in STANDARD_ZONES:
                return STANDARD_ZONES.index(z)
            return 99

        astral_slots.sort(key=_zone_key)
        reordered_slots = astral_slots + fixed_slots

        if reordered_slots != slots:
            channel["slots"] = reordered_slots
            modified = True

    return modified


def _normalize_typed_choice(
    inp: dict[str, Any], key: str, enum_cls: type[StrEnum]
) -> bool:
    """Backfill a missing enum-valued key to None, and reset invalid values.

    A missing key becomes `None`; an unknown/typo'd value (e.g. hand-edited
    config) also resets to `None` so `get_config_value()` falls through to the
    global/const default. Returns whether the dict was modified.
    """
    if key not in inp:
        inp[key] = None
        return True
    if inp[key] is not None and inp[key] not in tuple(enum_cls):
        inp[key] = None
        return True
    return False


def _normalize_input(inp: dict[str, Any], existing_ids: set[str]) -> bool:
    """Normalize a single input dict (id, entity_ids, retrigger/aggregation, button fields).

    `existing_ids` is shared across all inputs in the area and mutated in place
    so auto-generated IDs stay unique within the batch.
    """
    modified = False

    # Ensure it has an id
    if "id" not in inp or not inp["id"]:
        inp_type = inp.get("type", "binary")
        candidate = f"{inp_type}_{secrets.token_hex(4)}"
        while candidate in existing_ids:
            candidate = f"{inp_type}_{secrets.token_hex(4)}"
        existing_ids.add(candidate)
        inp["id"] = candidate
        modified = True

    # Backfill entity_ids for non-button inputs (buttons have no entities; the
    # button block below strips the key).
    if inp.get("type") != "button" and "entity_ids" not in inp:
        inp["entity_ids"] = []
        modified = True

    # Normalization of re-trigger (motion) / aggregation (binary) options
    inp_type = inp.get("type")
    if inp_type == "motion":
        modified = _normalize_typed_choice(inp, "retrigger", RetriggerMode) or modified
    elif inp_type == "binary":
        # Migrate the removed "majority" mode to an equivalent "count": a strict
        # majority of N entities is floor(N/2) + 1. Frozen at migration time
        # against the current entity_ids (majority auto-tracked entity count; the
        # migrated count does not). Done before _normalize_typed_choice, which
        # would otherwise reset the unknown value to None (→ silent "any").
        if inp.get("aggregation") == "majority":
            n_entities = len(inp.get("entity_ids") or [])
            inp["aggregation"] = AggregationMode.COUNT.value
            inp["aggregation_count"] = n_entities // 2 + 1 if n_entities else 1
            modified = True
        modified = (
            _normalize_typed_choice(inp, "aggregation", AggregationMode) or modified
        )
        count = inp.get("aggregation_count")
        count_invalid = count is not None and (not isinstance(count, int) or count < 1)
        if "aggregation_count" not in inp or count_invalid:
            inp["aggregation_count"] = None
            modified = True

    # Button-specific normalization
    if inp_type == "button":
        if "button_mode" not in inp:
            inp["button_mode"] = "click"
            modified = True
        if "entity_ids" in inp:
            del inp["entity_ids"]
            modified = True
        if "create_entity" not in inp:
            inp["create_entity"] = False
            modified = True
    elif "create_entity" in inp:
        del inp["create_entity"]
        modified = True

    # Timer-specific normalization
    if inp_type == "timer":
        if "trigger_time" not in inp:
            inp["trigger_time"] = "00:00:00"
            modified = True
    elif "trigger_time" in inp:
        # trigger_time is only for timer inputs
        inp.pop("trigger_time")
        modified = True

    return modified


def _normalize_activity(act: dict[str, Any]) -> bool:
    """Normalize a single activity dict (auto_expire, suppress_inputs, action/release_action)."""
    modified = False

    if "auto_expire" not in act:
        act["auto_expire"] = None
        modified = True

    if "expire_check_mode" not in act:
        act["expire_check_mode"] = None
        modified = True

    if "suppress_inputs" not in act:
        act["suppress_inputs"] = []
        modified = True
    if "action" not in act:
        act["action"] = {"type": None}
        modified = True
    elif isinstance(act["action"], dict) and "type" not in act["action"]:
        act["action"]["type"] = None
        modified = True
    if "release_action" not in act:
        act["release_action"] = {"type": None}
        modified = True
    elif (
        isinstance(act["release_action"], dict) and "type" not in act["release_action"]
    ):
        act["release_action"]["type"] = None
        modified = True

    if "transition_off_seconds" not in act:
        # None → coordinator falls back to DEFAULT_TRANSITION_OFF_SECONDS.
        act["transition_off_seconds"] = None
        modified = True

    return modified


def _normalize_sensor(sensor: dict[str, Any], existing_ids: set[str]) -> bool:
    """Normalize a single sensor dict (id, entity_ids, aggregation)."""
    modified = False

    # Ensure it has an id
    if "id" not in sensor or not sensor["id"]:
        s_type = sensor.get("type", "illuminance")
        candidate = f"{s_type}_{secrets.token_hex(4)}"
        while candidate in existing_ids:
            candidate = f"{s_type}_{secrets.token_hex(4)}"
        existing_ids.add(candidate)
        sensor["id"] = candidate
        modified = True

    if "type" not in sensor:
        sensor["type"] = "illuminance"
        modified = True

    # Backfill entity_ids
    if "entity_ids" not in sensor:
        sensor["entity_ids"] = []
        modified = True

    s_type = sensor.get("type")
    if s_type == "illuminance":
        if "aggregation" not in sensor:
            sensor["aggregation"] = None
            modified = True
        elif sensor["aggregation"] is not None:
            valid_modes = ("min", "max", "mean", "median")
            if sensor["aggregation"] not in valid_modes:
                sensor["aggregation"] = None
                modified = True

    return modified


def _normalize_config_lists(config: dict[str, Any]) -> bool:
    """Normalize the inputs/activities/sensors lists of an area or area_template.

    Shared by _normalize_area_config and the area_template normalization so both
    backfill the same input/activity/sensor defaults (retrigger, trigger_time,
    expire_check_mode, stable ids, …).
    """
    modified = False

    # 1. Normalize inputs
    inputs = config.get("inputs", [])
    if not isinstance(inputs, list):
        inputs = []
        config["inputs"] = inputs
        modified = True

    existing_ids: set[str] = {
        inp["id"]
        for inp in inputs
        if isinstance(inp, dict) and isinstance(inp.get("id"), str) and inp["id"]
    }
    for inp in inputs:
        if not isinstance(inp, dict):
            continue
        modified = _normalize_input(inp, existing_ids) or modified

    # 2. Normalize activities
    activities = config.get("activities", [])
    if not isinstance(activities, list):
        activities = []
        config["activities"] = activities
        modified = True

    for act in activities:
        if not isinstance(act, dict):
            continue
        modified = _normalize_activity(act) or modified

    # 3. Normalize sensors
    sensors = config.get("sensors", [])
    if not isinstance(sensors, list):
        sensors = []
        config["sensors"] = sensors
        modified = True

    existing_sensor_ids: set[str] = {
        s["id"]
        for s in sensors
        if isinstance(s, dict) and isinstance(s.get("id"), str) and s["id"]
    }
    for s in sensors:
        if not isinstance(s, dict):
            continue
        modified = _normalize_sensor(s, existing_sensor_ids) or modified

    return modified


def _normalize_area_config(config: dict[str, Any]) -> bool:
    """Normalize channels, input and activity schema, return True if modified."""
    modified = _prune_and_default(config, AREA_DEFAULTS, keep=AREA_STRUCTURED_KEYS)
    modified = _normalize_channels(config) or modified
    modified = _normalize_config_lists(config) or modified
    return modified


class TwilightStore:
    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self.store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.data: dict[str, Any] = {}

    async def async_load(self) -> None:
        stored = await self.store.async_load()
        _LOGGER.debug("TwilightStore raw stored content loaded: %s", stored)

        updated = False
        if stored is None:
            self.data = {
                "areas": {},
                "global": {},
            }
            updated = True
        else:
            self.data = stored

        self.data.setdefault("areas", {})

        # Normalize each area: build/repair the channels dict (Primary always
        # complete) and the inputs/activities schema.
        updated_areas = False
        for _area_id, area_cfg in self.data.get("areas", {}).items():
            if not isinstance(area_cfg, dict):
                continue
            if _normalize_area_config(area_cfg):
                updated_areas = True

        if updated_areas:
            updated = True

        self.data.setdefault("global", {})

        # Whitelist-prune unknown/renamed keys, backfill missing ones from const.py.
        # Legacy global-only keys (extend_ignore_lux, lux_*, expire_check_mode,
        # default_action_type, …) are dropped here — those settings are per
        # input/activity/sensor now, not global.
        if _prune_and_default(self.data["global"], GLOBAL_DEFAULTS):
            updated = True

        # Ensure custom_channels exists and is non-empty in area_template for backward compatibility
        area_template = self.data["global"].get("area_template")
        if isinstance(area_template, dict):
            custom_ch = area_template.get("custom_channels")
            if not isinstance(custom_ch, dict) or not custom_ch:
                area_template["custom_channels"] = copy.deepcopy(
                    DEFAULT_AREA_TEMPLATE.get("custom_channels", {})
                )
                updated = True
                custom_ch = area_template["custom_channels"]
            if isinstance(custom_ch, dict) and _normalize_custom_channels(custom_ch):
                updated = True

        # Normalize the area_template's inputs/activities/sensors with the same
        # backfill as real areas, so new areas seeded from it are complete.
        if isinstance(area_template, dict) and _normalize_config_lists(area_template):
            updated = True

        if updated:
            await self.store.async_save(self.data)

        _LOGGER.debug(
            "TwilightStore loaded %d areas: %s",
            len(self.data.get("areas", {})),
            list(self.data.get("areas", {}).keys()),
        )

    # --- Areas ---

    def get_areas(self) -> dict[str, Any]:
        result = {}
        for area_id, config in self.data["areas"].items():
            area_config = dict(config)
            area_config.pop("_state", None)
            result[area_id] = area_config
        return result

    def get_area(self, area_id: str) -> dict[str, Any] | None:
        area = self.data["areas"].get(area_id)
        if area is None:
            return None
        area_config = dict(area)
        area_config.pop("_state", None)
        return area_config

    def get_area_state(self, area_id: str) -> dict[str, Any] | None:
        area = self.data["areas"].get(area_id)
        if area is None:
            return None
        state = area.get("_state")
        return dict(state) if state is not None else None

    async def async_save_area(self, area_id: str, config: dict[str, Any]) -> str:
        # Filter out incoming _state from config
        cleaned_config = dict(config)
        cleaned_config.pop("_state", None)

        # Populate with default template if new area is created
        if area_id not in self.data["areas"]:
            stored_tpl = self.data["global"].get("area_template", DEFAULT_AREA_TEMPLATE)
            inputs_tpl = stored_tpl.get("inputs")
            if not cleaned_config.get("inputs") and isinstance(inputs_tpl, list):
                cleaned_config["inputs"] = copy.deepcopy(inputs_tpl)
            activities_tpl = stored_tpl.get("activities")
            if not cleaned_config.get("activities") and isinstance(
                activities_tpl, list
            ):
                cleaned_config["activities"] = copy.deepcopy(activities_tpl)
            sensors_tpl = stored_tpl.get("sensors")
            if not cleaned_config.get("sensors") and isinstance(sensors_tpl, list):
                cleaned_config["sensors"] = copy.deepcopy(sensors_tpl)
            custom_ch = stored_tpl.get("custom_channels")
            if isinstance(custom_ch, dict) and custom_ch:
                if "channels" not in cleaned_config or not isinstance(
                    cleaned_config["channels"], dict
                ):
                    cleaned_config["channels"] = default_channels()
                for ch_id, ch_cfg in custom_ch.items():
                    if (
                        ch_id != PRIMARY_CHANNEL_ID
                        and ch_id not in cleaned_config["channels"]
                    ):
                        cleaned_config["channels"][ch_id] = copy.deepcopy(ch_cfg)

        # Normalize inputs/activities
        _normalize_area_config(cleaned_config)

        # Merge with existing _state if present
        existing = self.data["areas"].get(area_id)
        if existing and "_state" in existing:
            cleaned_config["_state"] = existing["_state"]

        self.data["areas"][area_id] = cleaned_config
        await self.store.async_save(self.data)
        return area_id

    async def async_delete_area(self, area_id: str) -> bool:
        if area_id not in self.data["areas"]:
            return False
        del self.data["areas"][area_id]
        await self.store.async_save(self.data)
        return True

    def save_area_state(self, area_id: str, state_config: dict[str, Any]) -> None:
        if area_id not in self.data["areas"]:
            return
        self.data["areas"][area_id]["_state"] = state_config
        self.store.async_delay_save(lambda: self.data, 0.5)

    def generate_new_area_draft(self, area_id: str) -> dict[str, Any]:
        stored_tpl = self.data["global"].get("area_template", DEFAULT_AREA_TEMPLATE)
        channels = default_channels()
        custom_ch = stored_tpl.get(
            "custom_channels", DEFAULT_AREA_TEMPLATE.get("custom_channels", {})
        )
        if isinstance(custom_ch, dict):
            for ch_id, ch_cfg in custom_ch.items():
                if ch_id != PRIMARY_CHANNEL_ID:
                    channels[ch_id] = copy.deepcopy(ch_cfg)

        return {
            "area_id": area_id,
            "name": "",
            "enabled": True,
            "manual_only": False,
            "lux_threshold": None,
            "lux_watch_window": None,
            "transition_on_seconds": None,
            "channels": channels,
            "inputs": copy.deepcopy(
                stored_tpl.get("inputs", DEFAULT_AREA_TEMPLATE["inputs"])
            ),
            "activities": copy.deepcopy(
                stored_tpl.get("activities", DEFAULT_AREA_TEMPLATE["activities"])
            ),
            "sensors": copy.deepcopy(
                stored_tpl.get("sensors", DEFAULT_AREA_TEMPLATE.get("sensors", []))
            ),
        }

    # --- Global Defaults ---

    def get_global(self) -> dict[str, Any]:
        return dict(self.data["global"])

    async def async_save_global(self, config: dict[str, Any]) -> None:
        area_template = config.get("area_template")
        if isinstance(area_template, dict) and isinstance(area_template.get("custom_channels"), dict):
            _normalize_custom_channels(area_template["custom_channels"])
        self.data["global"] = config
        await self.store.async_save(self.data)

    # --- Backup & Restore ---

    def export_all(self) -> dict[str, Any]:
        """Return a portable, versioned snapshot of the full store (no _state)."""
        return {
            "twilight_backup_version": BACKUP_VERSION,
            "global": self.get_global(),
            "areas": self.get_areas(),
        }

    async def async_import_all(self, payload: dict[str, Any]) -> None:
        """Replace global + areas from an exported snapshot. Preserves runtime _state for existing areas."""
        if not isinstance(payload, dict):
            raise ValueError("Invalid backup payload structure: expected JSON object")

        version = payload.get("twilight_backup_version")
        if version is not None and version > BACKUP_VERSION:
            raise ValueError(
                f"Unsupported backup version {version!r}: this Twilight release "
                f"can import at most version {BACKUP_VERSION}"
            )

        areas_in = payload.get("areas")
        if not isinstance(areas_in, dict):
            areas_in = {}

        new_areas: dict[str, Any] = {}
        for area_id, area_cfg in areas_in.items():
            if not isinstance(area_cfg, dict):
                continue
            cleaned = dict(area_cfg)
            cleaned.pop("_state", None)
            cleaned["area_id"] = area_id
            _normalize_area_config(cleaned)
            existing = self.data["areas"].get(area_id)
            if existing and "_state" in existing:
                cleaned["_state"] = existing["_state"]
            new_areas[area_id] = cleaned

        self.data["areas"] = new_areas

        global_in = payload.get("global")
        new_global = dict(global_in) if isinstance(global_in, dict) else {}
        _prune_and_default(new_global, GLOBAL_DEFAULTS)

        area_template = new_global.get("area_template")
        if isinstance(area_template, dict):
            custom_ch = area_template.get("custom_channels")
            if not isinstance(custom_ch, dict) or not custom_ch:
                area_template["custom_channels"] = copy.deepcopy(
                    DEFAULT_AREA_TEMPLATE.get("custom_channels", {})
                )
                custom_ch = area_template["custom_channels"]
            if isinstance(custom_ch, dict):
                _normalize_custom_channels(custom_ch)
            _normalize_config_lists(area_template)

        self.data["global"] = new_global
        await self.store.async_save(self.data)

