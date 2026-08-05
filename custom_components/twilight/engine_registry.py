"""Engine lifecycle helpers shared by every place that (re)builds engines.

`async_setup`, the `area/save` WS command and the backup-restore reload all
build engines the same way: decide whether an area is engine-worthy, create and
set up the engine, register it, and reconcile its HA button/switch entities.
That sequence lived in three copies with subtly different error handling.

Lives in its own module rather than `helpers.py` because it imports
`engine.py`, which itself imports `helpers.py` — putting it there would create
an import cycle.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant

from . import button as twilight_button
from . import switch as twilight_switch
from .config_model import AreaConfig
from .const import DOMAIN
from .engine import TwilightEngine
from .state import RunState

_LOGGER = logging.getLogger(__name__)


def area_has_slots(config: dict[str, Any]) -> bool:
    """Whether any channel of a raw area config carries slots.

    An area without a single slot has nothing to schedule, so no engine is
    created for it.
    """
    channels = config.get("channels", {})
    if not isinstance(channels, dict):
        return False
    return any(
        ch.get("slots") for ch in channels.values() if isinstance(ch, dict)
    )


def area_wants_engine(config: dict[str, Any] | None) -> bool:
    """Whether an area is enabled *and* has something to schedule."""
    if not config:
        return False
    return bool(config.get("enabled")) and area_has_slots(config)


async def async_sync_area_entities(
    hass: HomeAssistant, area_id: str, config: AreaConfig
) -> None:
    """Reconcile the button/switch entities Twilight owns for one area."""
    await twilight_button.async_sync_button_entities(hass, area_id, config)
    await twilight_switch.async_sync_switch_entities(hass, area_id, config)


async def async_clear_area_entities(hass: HomeAssistant, area_id: str) -> None:
    """Remove all Twilight-owned entities of an area (no engine / area gone)."""
    await async_sync_area_entities(
        hass, area_id, AreaConfig.from_dict({"area_id": area_id})
    )


async def async_start_engine(
    hass: HomeAssistant,
    area_id: str,
    config: dict[str, Any],
    *,
    initial_state: RunState | None = None,
) -> TwilightEngine | None:
    """Create, set up and register an engine; sync its entities.

    Returns the engine, or None if setup failed. A failure is logged and the
    engine is *not* registered — one bad area must never keep the others from
    getting theirs (that is why every caller tolerates None rather than raising).
    """
    engine = TwilightEngine(hass, area_id, config, initial_state=initial_state)
    try:
        await engine.async_setup()
    except Exception:
        _LOGGER.exception(
            "[%s] Engine setup failed — area config is persisted but no engine "
            "is registered",
            area_id,
        )
        return None

    engines = hass.data[DOMAIN].setdefault("engines", {})
    engines[area_id] = engine
    await async_sync_area_entities(hass, area_id, engine.config)
    return engine
