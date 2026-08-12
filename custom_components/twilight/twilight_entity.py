"""Shared mixin for Twilight-owned HA entities (button/switch/... per input or activity)."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo

from .const import DOMAIN

if TYPE_CHECKING:
    from homeassistant.helpers.entity_component import EntityComponent

    from .config_model import InputConfig
    from .engine import TwilightEngine

_LOGGER = logging.getLogger(__name__)


def attach_config_entry(hass: HomeAssistant, component: EntityComponent[Any]) -> None:
    """Attach Twilight's single, self-created config entry to a platform if unset.

    Entities are added via a bare EntityComponent (no async_setup_entry/platform-
    forwarding, see button.py/switch.py), so EntityPlatform.config_entry is never
    set through the normal path — without it, HA silently skips device_info
    entirely (homeassistant/helpers/entity_platform.py: `if self.config_entry:`).
    Assigning it directly is the same effect without needing a real platform
    module or the rest of async_setup_entry's machinery.

    Idempotent/safe to call repeatedly. The config entry self-creates via a
    fire-and-forget flow task (__init__.py — awaiting it inside async_setup
    would deadlock the boot); the boot path awaits that task before the first
    entity sync, so the entry normally exists by the time entities are added.
    The warning below is a defensive fallback for paths that cannot await the
    task (e.g. a direct _async_setup_engines call while HA is already running).

    Known fragility: `component._platforms` is private API with no public
    accessor for the platform instance; if HA ever renames/removes it, the
    entities silently lose their device grouping (the whole reason for the
    entry). Replacing it would require forwarding through a real platform
    module — deliberately not done; the trade-off is documented in the
    project's architecture notes.
    """
    platform = component._platforms[component.domain]
    if platform.config_entry is not None:
        return
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries:
        _LOGGER.warning(
            "No Twilight config entry found — %s entities will have no device",
            component.domain,
        )
        return
    platform.config_entry = entries[0]


class TwilightEntity:
    """Common attributes for all Twilight-owned HA entities.

    Not an HA entity type itself — combined with a domain-specific base class
    (ButtonEntity, SwitchEntity, ...) by concrete subclasses. Provides the
    unique_id/device_info/availability shared by every Twilight entity,
    regardless of which input/activity it represents.
    """

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, hass: HomeAssistant, area_id: str, input_id: str, platform: str) -> None:
        self.hass = hass
        self._area_id = area_id
        self._input_id = input_id
        # Platform-scoped unique_id: button and switch entities for the same
        # input used to share one id, which produced a temporary
        # registry-duplicate when an input switched toggle/click mode (the
        # button sync added before the switch sync removed).
        self._attr_unique_id: str | None = f"{DOMAIN}_{platform}_{area_id}_{input_id}"

    @property
    def _engine(self) -> TwilightEngine | None:
        engines: dict[str, TwilightEngine] = self.hass.data.get(DOMAIN, {}).get(
            "engines", {}
        )
        return engines.get(self._area_id)

    def _get_input_config(self) -> InputConfig | None:
        engine = self._engine
        if engine is None:
            return None
        return engine.config.input_by_id(self._input_id)

    @property
    def available(self) -> bool:
        return self._get_input_config() is not None

    @property
    def device_info(self) -> DeviceInfo:
        engine = self._engine
        area_name = engine.config.name if engine else None
        return DeviceInfo(
            identifiers={(DOMAIN, self._area_id)},
            name=area_name or self._area_id,
            manufacturer="Twilight",
        )
