"""target/actual deviation computation for Twilight scene lights.

Backend-first: the frontend does NOT compute anything. This module builds a per-entity, per-attribute map with
ready-to-render display values (labels + swatch CSS) and the deviation flag.
The card only maps fields to cells/badges — no hass.states access, no value
formatting, no comparison, no competing data sources.

Per entity:
  {
    "name": <friendly name>,
    "actual_on": <bool — is the light physically on (for the row dot)>,
    "on":         <attr-entry | None>,
    "brightness": <attr-entry | None>,
    "color":      <attr-entry | None>,
  }

An attr-entry is None (→ card shows "—") or:
  {"actual": <label str>, "target": <label str>,
   "actual_swatch": <css str | None>, "target_swatch": <css str | None>,
   "deviates": <bool>}

Comparison (exact by default; tolerances in const.py, 0 = exact):
  - state (on/off): string equality
  - brightness: integer equality on HA 0–255 scale; label rendered as % via
    _pct() — a nonzero raw value never rounds down to a "0%" label, which
    would misleadingly read as off for a light that is on but very dim.
  - color: compare in xy whenever both sides have xy, else color_temp (mireds),
    else hs. RGB is display-only, never the comparison basis.
"""

from __future__ import annotations

import math
from typing import Any

from homeassistant.const import STATE_OFF, STATE_ON, STATE_UNAVAILABLE
from homeassistant.util.color import (
    color_temperature_kelvin_to_mired,
    color_temperature_mired_to_kelvin,
)

from .const import (
    DEVIATION_BRIGHTNESS_TOLERANCE as BRIGHTNESS_TOLERANCE,
)
from .const import (
    DEVIATION_HS_TOLERANCE_H as HS_TOLERANCE_H,
)
from .const import (
    DEVIATION_HS_TOLERANCE_S as HS_TOLERANCE_S,
)
from .const import (
    DEVIATION_TEMP_TOLERANCE as TEMP_TOLERANCE,
)
from .const import (
    DEVIATION_XY_TOLERANCE as XY_TOLERANCE,
)

# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def build_light_states(
    hass_states: Any,
    expected_states: dict[str, dict[str, Any]],
    check_deviations: bool = True,
) -> dict[str, dict[str, Any]]:
    """Build the light_states push-map (ready-to-render) for all entities."""
    result: dict[str, dict[str, Any]] = {}
    for entity_id, expected in expected_states.items():
        ha_state = hass_states.get(entity_id)
        entry = _compare_entity(entity_id, ha_state, expected)
        if not check_deviations:
            for key in ("on", "brightness", "color"):
                if entry.get(key):
                    entry[key]["deviates"] = False
        result[entity_id] = entry
    return dict(
        sorted(
            result.items(),
            key=lambda item: (item[1].get("name") or item[0]).lower(),
        )
    )


def check_entity_deviation(ha_state: Any | None, expected: dict[str, Any]) -> bool:
    """Check if an entity actually deviates from expected state (tolerance-aware)."""
    return bool(deviating_attrs(ha_state, expected))


def deviating_attrs(ha_state: Any | None, expected: dict[str, Any]) -> dict[str, Any]:
    """Return only the attributes that actually deviate, as {attr: {actual, target}}.

    Empty dict means no deviation — same truthiness as check_entity_deviation's False.
    """
    comparison = _compare_entity("", ha_state, expected)
    return {
        key: {"actual": entry["actual"], "target": entry["target"]}
        for key in ("on", "brightness", "color")
        if (entry := comparison.get(key)) is not None and entry.get("deviates")
    }


def deviated_entities_from_map(light_states: dict[str, dict[str, Any]]) -> list[str]:
    """Derive the list of entity_ids that deviate in the light_states map."""
    out: list[str] = []
    for entity_id, attrs in light_states.items():
        for key in ("on", "brightness", "color"):
            entry = attrs.get(key)
            if entry is not None and entry.get("deviates"):
                out.append(entity_id)
                break
    return out


# ---------------------------------------------------------------------------
# Per-entity comparison
# ---------------------------------------------------------------------------


def _compare_entity(
    entity_id: str, ha_state: Any | None, expected: dict[str, Any]
) -> dict[str, Any]:
    """Build the ready-to-render per-attribute map for one entity."""
    actual_state: str = ha_state.state if ha_state else STATE_UNAVAILABLE
    target_state: str | None = expected.get("state")
    name: str = (
        ha_state.attributes.get("friendly_name") if ha_state else None
    ) or entity_id

    on_entry: dict[str, Any] | None = None
    if target_state is not None:
        on_entry = {
            "actual": actual_state.upper(),
            "target": target_state.upper(),
            "actual_swatch": None,
            "target_swatch": None,
            "deviates": actual_state != target_state,
        }

    return {
        "name": name,
        "actual_on": actual_state == STATE_ON,
        "on": on_entry,
        "brightness": _compare_brightness(
            ha_state, expected, actual_state, target_state
        ),
        "color": _compare_color(ha_state, expected, actual_state, target_state),
    }


def _compare_brightness(
    ha_state: Any | None,
    expected: dict[str, Any],
    actual_state: str,
    target_state: str | None,
) -> dict[str, Any] | None:
    """Compare brightness — only when target has brightness and scene is on.

    Labels are rendered as percent (HA 0–255 → %), ready for display.
    """
    target_brightness = expected.get("brightness")
    if target_brightness is None or target_state == STATE_OFF:
        return None

    attrs = ha_state.attributes if ha_state else {}
    actual_brightness = attrs.get("brightness")

    if actual_brightness is None:
        if actual_state == STATE_ON:
            return {
                "actual": "—",
                "target": _pct(target_brightness),
                "actual_swatch": None,
                "target_swatch": None,
                "deviates": True,
            }
        return None

    try:
        diff = abs(int(actual_brightness) - int(target_brightness))
    except (TypeError, ValueError):
        return {
            "actual": "—",
            "target": _pct(target_brightness),
            "actual_swatch": None,
            "target_swatch": None,
            "deviates": True,
        }
    return {
        "actual": _pct(actual_brightness),
        "target": _pct(target_brightness),
        "actual_swatch": None,
        "target_swatch": None,
        "deviates": diff > BRIGHTNESS_TOLERANCE,
    }


def _clamp_target_mireds(target_mireds: int, attrs: dict[str, Any]) -> int:
    """Clamp a target color_temp (mireds) to this light's own supported range.

    A light can only report what it is physically able to reach, so a target
    outside min/max_color_temp_kelvin would always show as a deviation even
    though the light is doing exactly what it can (HA/the integration clamps
    the outgoing call the same way — see hue/v2/helpers.py normalize_hue_colortemp).
    """
    min_kelvin = attrs.get("min_color_temp_kelvin")
    max_kelvin = attrs.get("max_color_temp_kelvin")
    if target_mireds <= 0 or (min_kelvin is None and max_kelvin is None):
        return target_mireds

    try:
        target_kelvin = color_temperature_mired_to_kelvin(target_mireds)
    except (TypeError, ValueError, ZeroDivisionError):
        return target_mireds
    if min_kelvin is not None:
        target_kelvin = max(target_kelvin, min_kelvin)
    if max_kelvin is not None:
        target_kelvin = min(target_kelvin, max_kelvin)
    return color_temperature_kelvin_to_mired(target_kelvin)


def _compare_color(
    ha_state: Any | None,
    expected: dict[str, Any],
    actual_state: str,
    target_state: str | None,
) -> dict[str, Any] | None:
    """Compare color — only when target has a color attribute and scene is on.

    Returns ready-to-render labels + swatch CSS. Comparison hierarchy:
    xy → color_temp → hs. RGB is display-only.
    """
    if target_state == STATE_OFF:
        return None

    target_xy = _as_xy(expected.get("xy_color"))
    target_rgb = _as_rgb(expected.get("rgb_color"))
    target_temp: int | None = expected.get("color_temp")
    target_hs = _as_hs(expected.get("hs_color"))

    if not (target_xy or target_temp is not None or target_hs):
        return None

    if actual_state != STATE_ON or ha_state is None:
        return None

    attrs = ha_state.attributes

    # --- xy path (display via rgb) ---
    if target_xy:
        actual_xy = _as_xy(attrs.get("xy_color"))
        actual_rgb = _as_rgb(attrs.get("rgb_color"))
        if actual_xy is not None:
            dist = math.hypot(actual_xy[0] - target_xy[0], actual_xy[1] - target_xy[1])
            return {
                "actual": _rgb_label(actual_rgb),
                "target": _rgb_label(target_rgb),
                "actual_swatch": _rgb_css(actual_rgb),
                "target_swatch": _rgb_css(target_rgb),
                "deviates": dist > XY_TOLERANCE,
            }
        elif target_temp is None and target_hs is None:
            return {
                "actual": _rgb_label(actual_rgb) if actual_rgb else "Unknown",
                "target": _rgb_label(target_rgb),
                "actual_swatch": _rgb_css(actual_rgb) if actual_rgb else None,
                "target_swatch": _rgb_css(target_rgb),
                "deviates": True,
            }

    # --- color_temp path ---
    if target_temp is not None:
        actual_temp = attrs.get("color_temp")
        if actual_temp is None:
            actual_kelvin = attrs.get("color_temp_kelvin")
            if actual_kelvin is not None and actual_kelvin > 0:
                actual_temp = color_temperature_kelvin_to_mired(actual_kelvin)

        compare_temp = _clamp_target_mireds(target_temp, attrs)

        try:
            temp_deviates = (
                actual_temp is None
                or abs(int(actual_temp) - compare_temp) > TEMP_TOLERANCE
            )
        except (TypeError, ValueError):
            temp_deviates = True

        return {
            "actual": _kelvin_label(actual_temp),
            "target": _kelvin_label(target_temp),
            "actual_swatch": _temp_css(actual_temp),
            "target_swatch": _temp_css(target_temp),
            "deviates": temp_deviates,
        }

    # --- hs path ---
    if target_hs:
        actual_hs = _as_hs(attrs.get("hs_color"))
        if actual_hs is not None:
            h_diff = abs(actual_hs[0] - target_hs[0])
            if h_diff > 180:
                h_diff = 360 - h_diff
            s_diff = abs(actual_hs[1] - target_hs[1])
            deviates = h_diff > HS_TOLERANCE_H or s_diff > HS_TOLERANCE_S
        else:
            deviates = True
        return {
            "actual": _hs_label(actual_hs),
            "target": _hs_label(target_hs),
            "actual_swatch": None,
            "target_swatch": None,
            "deviates": deviates,
        }

    return None


# ---------------------------------------------------------------------------
# Display formatting (single source — labels & swatches built here, not in the card)
# ---------------------------------------------------------------------------


def _pct(brightness_255: Any) -> str:
    """Format a 0-255 brightness as a percent label.

    A nonzero raw value never rounds down to 0% — that would read as "off"
    for a light that is actually on, just very dim (e.g. raw=1 -> 0.4%,
    rounds to 0 but the light is lit).
    """
    raw = int(brightness_255)
    if raw <= 0:
        return "0%"
    return f"{max(1, round(raw / 2.55))}%"


def _rgb_label(rgb: tuple[int, int, int] | None) -> str:
    return f"RGB({rgb[0]},{rgb[1]},{rgb[2]})" if rgb else "—"


def _rgb_css(rgb: tuple[int, int, int] | None) -> str | None:
    return f"rgb({rgb[0]},{rgb[1]},{rgb[2]})" if rgb else None


def _kelvin_label(mireds: Any) -> str:
    try:
        val = int(mireds) if mireds is not None else 0
        return f"{color_temperature_mired_to_kelvin(val)}K" if val > 0 else "—"
    except (TypeError, ValueError, ZeroDivisionError):
        return "—"


def _temp_css(mireds: Any) -> str | None:
    try:
        val = int(mireds) if mireds is not None else 0
        if val <= 0:
            return None
        k = color_temperature_mired_to_kelvin(val)
        t = max(0.0, min(1.0, (k - 2000) / 4500))
        return f"rgb(255,{round(180 + t * 70)},{round(80 + t * 170)})"
    except (TypeError, ValueError, ZeroDivisionError):
        return None


def _hs_label(hs: tuple[float, float] | None) -> str:
    return f"HS({round(hs[0])},{round(hs[1])})" if hs else "—"


# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------


def _as_tuple(v: Any, *converters: Any) -> tuple[Any, ...] | None:
    if v is None:
        return None
    try:
        return tuple(c(v[i]) for i, c in enumerate(converters))
    except (TypeError, IndexError, ValueError):
        return None


def _as_xy(v: Any) -> tuple[float, float] | None:
    return _as_tuple(v, float, float)


def _as_rgb(v: Any) -> tuple[int, int, int] | None:
    return _as_tuple(v, int, int, int)


def _as_hs(v: Any) -> tuple[float, float] | None:
    return _as_tuple(v, float, float)
