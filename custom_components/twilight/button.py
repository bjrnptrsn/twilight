"""Optional HA button entities for click-mode Twilight button inputs.

Twilight has no user-facing Config Flow — entities are managed manually via a
single, integration-owned EntityComponent instead of the usual
async_setup_entry/platform-forwarding path. A single, silently self-created
config entry (config_flow.py) is attached to the platform below purely so the
device registry has a config_entry_id to anchor per-area devices to.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.button import ButtonEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_component import EntityComponent

from .config_model import AreaConfig, ButtonInputConfig
from .const import DOMAIN
from .helpers import dispatch_button_input
from .twilight_entity import TwilightEntity, attach_config_entry

_LOGGER = logging.getLogger(__name__)

PLATFORM = "button"


class TwilightButtonEntity(TwilightEntity, ButtonEntity):
    """A manually triggerable HA button backing a click-mode Twilight button input."""

    @property
    def name(self) -> str | None:
        inp = self._get_input_config()
        if isinstance(inp, ButtonInputConfig):
            return inp.label or inp.name or self._input_id
        return self._input_id

    async def async_press(self) -> None:
        dispatch_button_input(self.hass, self._area_id, self._input_id, active=True)


def async_setup(hass: HomeAssistant) -> None:
    """Create the shared button EntityComponent for Twilight (idempotent)."""
    hass.data.setdefault(DOMAIN, {})
    if "button_component" in hass.data[DOMAIN]:
        return
    component = EntityComponent[TwilightButtonEntity](_LOGGER, PLATFORM, hass)
    attach_config_entry(hass, component)
    hass.data[DOMAIN]["button_component"] = component


async def async_sync_button_entities(
    hass: HomeAssistant, area_id: str, area_config: AreaConfig | dict[str, Any]
) -> None:
    """Reconcile HA button entities for one area against its current button inputs."""
    async_setup(hass)
    component: EntityComponent[TwilightButtonEntity] = hass.data[DOMAIN][
        "button_component"
    ]
    attach_config_entry(hass, component)
    config = (
        area_config
        if isinstance(area_config, AreaConfig)
        else AreaConfig.from_dict(area_config)
    )

    wanted_ids = {
        inp.id
        for inp in config.inputs
        if inp.id
        and isinstance(inp, ButtonInputConfig)
        and (inp.button_mode or "click") != "toggle"
        and inp.create_entity is True
    }

    existing_entities = {
        entity._input_id: entity
        for entity in component.entities
        if isinstance(entity, TwilightButtonEntity) and entity._area_id == area_id
    }

    to_add = [
        TwilightButtonEntity(hass, area_id, input_id)
        for input_id in wanted_ids
        if input_id not in existing_entities
    ]
    if to_add:
        await component.async_add_entities(to_add)

    for input_id, entity in existing_entities.items():
        if input_id not in wanted_ids:
            entity_id = entity.entity_id
            await component.async_remove_entity(entity_id)
            # async_remove_entity() alone leaves a disabled-looking "zombie"
            # behind in the entity registry (Entity.async_remove() without
            # force_remove only marks it unavailable) — drop the registry
            # entry too so a deleted button input actually disappears.
            registry = er.async_get(hass)
            if registry.async_get(entity_id):
                registry.async_remove(entity_id)
        else:
            # Reflect a possible name change (area/input save) immediately
            # instead of waiting for the entity's next unrelated state write.
            entity.async_write_ha_state()
