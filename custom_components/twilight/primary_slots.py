"""The Primary channel's slots: built from STANDARD_ZONES, stored as sparse overrides.

The 10 Primary slots are structurally fixed; the store keeps only per-zone
overrides and materialize_primary_slots() rebuilds the full slot list from them.
"""

from __future__ import annotations

import logging
from typing import Any

from .const import (
    NOT_BEFORE_ZONES,
    PRIMARY_CHANNEL_ID,
    STANDARD_NAMES,
    STANDARD_ZONES,
    HueDynamicMode,
    StartType,
)
from .slot_calc import normalize_not_before_str

_LOGGER = logging.getLogger(__name__)

# The per-zone fields a Primary slot may override; everything else is fixed.
_OVERRIDE_FIELDS = (
    "offset_minutes",
    "scene_entity_id",
    "configured_entities",
    "hue_activate_dynamic",
    "hue_dynamic_speed",
    "not_before",
)


def default_primary_slots() -> list[dict[str, Any]]:
    """Build a fresh list of the 10 fixed Primary-Channel slots."""
    return materialize_primary_slots({})


def materialize_primary_slots(
    raw_slots: dict[str, Any] | list[dict[str, Any]] | None,
) -> list[dict[str, Any]]:
    """Materialize Primary-Channel slots into 10 complete slot dicts.

    Accepts two input shapes:
      - the sparse overrides dict (the store's persistence format): keyed by
        standard zone ID, each value a dict of that zone's override fields
        (offset_minutes/scene_entity_id/configured_entities, the two Hue
        dynamics fields and not_before).
      - a full slot list (the frontend's `area/save` payload / call-site
        format used throughout config_model.py and tests): one dict per zone
        with all SlotConfig fields; only the override fields are actually
        read, the rest is recomputed from STANDARD_ZONES/STANDARD_NAMES.

    Unknown zone keys/ids or fields, and fields with an implausible type, are
    pruned and replaced by their default — logged as a warning so a
    corrupted/hand-edited entry is visible, not silently accepted.

    The list path projects each item onto the override fields before that
    validation runs — otherwise the structurally fixed fields of a full slot dict
    (id/name/start_type/zone/fixed_time) would each be reported as an unknown field.
    """
    override_by_zone: dict[str, dict[str, Any]] = {}

    if isinstance(raw_slots, dict):
        for zone_id, override in raw_slots.items():
            if not isinstance(zone_id, str) or zone_id not in STANDARD_ZONES:
                _LOGGER.warning(
                    "Discarding Primary-Channel slot override for unknown zone %r "
                    "(not one of the 10 standard zones)",
                    zone_id,
                )
                continue
            if not isinstance(override, dict):
                _LOGGER.warning(
                    "Discarding Primary-Channel slot override for zone %r: "
                    "expected a dict, got %s",
                    zone_id,
                    type(override).__name__,
                )
                continue
            override_by_zone[zone_id] = override
    elif isinstance(raw_slots, list):
        for item in raw_slots:
            if not isinstance(item, dict):
                continue
            item_zone = item.get("zone") or item.get("id")
            if isinstance(item_zone, str) and item_zone in STANDARD_ZONES:
                override_by_zone[item_zone] = {
                    key: item[key] for key in _OVERRIDE_FIELDS if key in item
                }
    elif raw_slots is not None:
        _LOGGER.warning(
            "Discarding Primary-Channel slots: expected a dict or list, got %s",
            type(raw_slots).__name__,
        )

    result: list[dict[str, Any]] = []
    for zone in STANDARD_ZONES:
        override = override_by_zone.get(zone) or {}

        offset_mins = override.get("offset_minutes")
        if offset_mins is not None and not isinstance(offset_mins, (int, float)):
            _LOGGER.warning(
                "Discarding invalid offset_minutes %r for Primary-Channel zone %r "
                "(expected a number)",
                offset_mins,
                zone,
            )
            offset_mins = None

        scene_id = override.get("scene_entity_id")
        if scene_id is not None and not isinstance(scene_id, str):
            _LOGGER.warning(
                "Discarding invalid scene_entity_id %r for Primary-Channel zone %r "
                "(expected a string)",
                scene_id,
                zone,
            )
            scene_id = None

        entities = override.get("configured_entities")
        if entities is not None and not isinstance(entities, (list, tuple)):
            _LOGGER.warning(
                "Discarding invalid configured_entities %r for Primary-Channel zone %r "
                "(expected a list)",
                entities,
                zone,
            )
            entities = None

        raw_not_before = override.get("not_before")
        not_before = normalize_not_before_str(raw_not_before)
        if raw_not_before is not None and (
            not_before is None or zone not in NOT_BEFORE_ZONES
        ):
            _LOGGER.warning(
                "Discarding invalid not_before %r for Primary-Channel zone %r "
                "(expected HH:MM within 12:00–03:59 on an evening zone)",
                raw_not_before,
                zone,
            )
            not_before = None

        unknown_keys = set(override) - set(_OVERRIDE_FIELDS)
        if unknown_keys:
            _LOGGER.warning(
                "Discarding unknown field(s) %s in Primary-Channel override for zone %r",
                sorted(unknown_keys),
                zone,
            )

        speed_val = override.get("hue_dynamic_speed")
        result.append(
            {
                "id": zone,
                "name": STANDARD_NAMES[zone],
                "start_type": StartType.ASTRAL.value,
                "zone": zone,
                "offset_minutes": int(offset_mins) if offset_mins is not None else 0,
                "scene_entity_id": scene_id,
                "configured_entities": list(entities) if entities is not None else [],
                "hue_activate_dynamic": HueDynamicMode(
                    override.get("hue_activate_dynamic", HueDynamicMode.HUE)
                ).value,
                "hue_dynamic_speed": int(speed_val) if isinstance(speed_val, (int, float)) else None,
                "not_before": not_before,
            }
        )
    return result


def default_channels() -> dict[str, Any]:
    """Build the default channels dict for a new area (Primary only)."""
    return {
        PRIMARY_CHANNEL_ID: {
            "name": "Primary",
            "enabled": True,
            "slots": {},
        }
    }
