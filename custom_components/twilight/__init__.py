"""The Twilight integration.

This integration provides smart, dynamic lighting and automation based on solar conditions,
timeslot-based schedules, motion, lux, and overrides.
"""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any

import voluptuous as vol
from homeassistant.components.frontend import async_register_built_in_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import SOURCE_IMPORT, ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED, EVENT_HOMEASSISTANT_STOP
from homeassistant.core import CoreState, HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.dispatcher import async_dispatcher_send

from . import button as twilight_button
from . import switch as twilight_switch
from .const import DOMAIN, SIGNAL_ENGINES_CHANGED
from .engine import TwilightEngine
from .helpers import dispatch_button_input
from .store import TwilightStore
from .websocket import async_register_commands

_LOGGER = logging.getLogger(__name__)

# Twilight is enabled by a bare `twilight:` line in configuration.yaml and takes
# no YAML options (all configuration lives in the sidebar panel / store). Declare
# an empty schema so hassfest is satisfied and any keys under `twilight:` are
# rejected rather than silently ignored.
CONFIG_SCHEMA = cv.empty_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, _config: dict[str, Any]) -> bool:
    """Set up the Twilight integration component.

    This function performs the following setup steps:
      1. Initializes the integration's shared data dictionary.
      2. Initializes and loads the Twilight config store (persistence layer).
      3. Registers WebSocket API commands.
      4. Registers the frontend panels and static asset paths.
      5. Defers instantiating TwilightEngine coordinators for all configured and
         enabled areas until Home Assistant has fully started, so engine setup
         (scene extraction, Hue) does not block/race the HA boot sequence.
    """
    hass.data.setdefault(DOMAIN, {})

    # Initialize and load the HA Storage-backed persistence store
    store = TwilightStore(hass)
    await store.async_load()
    hass.data[DOMAIN]["store"] = store
    hass.data[DOMAIN]["engines"] = {}

    # Set up the shared button/switch EntityComponents. Entities are reconciled
    # per area on boot and on every area/save|delete WS command.
    twilight_button.async_setup(hass)
    twilight_switch.async_setup(hass)

    # Self-create the single, silent config entry that anchors per-area devices
    # for those entities in the HA device registry — actual configuration still
    # only happens via this async_setup()/the sidebar panel, never via the config
    # entry itself. Must be fire-and-forget: finishing the flow re-enters
    # async_setup_component("twilight"), which awaits this very setup's future —
    # awaiting the flow here deadlocks the boot. _async_boot below awaits the task
    # instead, after async_setup has returned.
    if not hass.config_entries.async_entries(DOMAIN):
        hass.data[DOMAIN]["entry_flow_task"] = hass.async_create_task(
            hass.config_entries.flow.async_init(
                DOMAIN, context={"source": SOURCE_IMPORT}, data={}
            )
        )

    # Register WebSocket API commands for frontend-backend communication
    async_register_commands(hass)

    # Register frontend panel and static assets (Vite build outputs)
    await _async_register_panel(hass)

    async def _async_setup_engines(_event: Any = None) -> None:
        """Spin up TwilightEngine coordinators for all configured and enabled areas.

        Skips areas that already have an engine — a WS area/save can run before
        EVENT_HOMEASSISTANT_STARTED fires and create an engine ahead of this loop.
        """
        areas = store.get_areas()
        engines_created = False
        for area_id, config in areas.items():
            if area_id in hass.data[DOMAIN]["engines"]:
                continue
            has_slots = any(
                ch.get("slots")
                for ch in config.get("channels", {}).values()
                if isinstance(ch, dict)
            )
            if config.get("enabled") and has_slots:
                _LOGGER.info("Setting up TwilightEngine for area: %s", area_id)
                engine = TwilightEngine(hass, area_id, config)
                await engine.async_setup()
                hass.data[DOMAIN]["engines"][area_id] = engine
                await twilight_button.async_sync_button_entities(
                    hass, area_id, engine.config
                )
                await twilight_switch.async_sync_switch_entities(
                    hass, area_id, engine.config
                )
                engines_created = True

        # Subscriptions opened before the deferred boot setup finished (e.g. a
        # panel that reconnected right after HA restart) have an empty entity
        # watch list and push cache — tell them to rebuild from the new engines.
        if engines_created:
            async_dispatcher_send(hass, SIGNAL_ENGINES_CHANGED)

    async def _async_boot(_event: Any = None) -> None:
        """Await the self-created config entry, then set up all engines.

        Runs after async_setup has returned (EVENT_HOMEASSISTANT_STARTED), so
        awaiting the entry flow task is safe here — it guarantees the device-
        registry anchor exists before the first button/switch entity sync.
        """
        task = hass.data[DOMAIN].pop("entry_flow_task", None)
        if task is not None:
            await task
        await _async_setup_engines()

    # Defer engine setup until HA has fully started (scene platform, Hue, etc. are
    # not reliably ready during async_setup). If HA is already running — e.g. on a
    # config reload — EVENT_HOMEASSISTANT_STARTED has already fired, so set up now.
    # The direct path must not await the entry flow task (same deadlock as above);
    # attach_config_entry() tolerates a not-yet-existing entry defensively.
    if hass.state is CoreState.running:
        await _async_setup_engines()
    else:
        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _async_boot)

    # Register Home Assistant shutdown listener to cleanly teardown all active engines
    async def _async_shutdown_cleanup(event: Any) -> None:
        _LOGGER.info("Home Assistant shutting down, tearing down Twilight engines")
        engines = list(hass.data[DOMAIN].get("engines", {}).values())
        for engine in engines:
            try:
                await engine.async_teardown()
            except Exception:
                _LOGGER.exception(
                    "Error tearing down TwilightEngine for area: %s", engine.area_id
                )

    hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, _async_shutdown_cleanup)

    async def async_trigger_input(service_call: ServiceCall) -> None:
        """Handle twilight.trigger_input service call."""
        area_id = service_call.data["area_id"]
        input_id = service_call.data["input_id"]
        active = service_call.data.get("active", False)

        error = dispatch_button_input(hass, area_id, input_id, active)
        if error == "not_found":
            _LOGGER.warning(
                "No twilight engine or input found for area: %s / %s", area_id, input_id
            )
        elif error == "invalid_format":
            _LOGGER.warning("Input '%s' is not a button input", input_id)
        elif error == "ambiguous":
            _LOGGER.warning("Multiple inputs named '%s' in area: %s", input_id, area_id)

    hass.services.async_register(
        DOMAIN,
        "trigger_input",
        async_trigger_input,
        schema=vol.Schema(
            {
                vol.Required("area_id"): str,
                vol.Required("input_id"): str,
                vol.Optional("active"): bool,
            }
        ),
    )

    return True


async def async_setup_entry(hass: HomeAssistant, _entry: ConfigEntry) -> bool:
    """No-op: the entry only anchors devices in the registry, see async_setup()."""
    return True


async def async_unload_entry(hass: HomeAssistant, _entry: ConfigEntry) -> bool:
    """No-op: nothing was set up per-entry, see async_setup_entry()."""
    return True


async def _async_register_panel(hass: HomeAssistant) -> None:
    """Register Twilight static paths and sidebar panels in Home Assistant.

    This registers the static HTTP endpoints for the Twilight frontend resources:
      - Main bundle: /twilight/twilight-panel.js
      - Optional dev bundle: /twilight/twilight-dev-panel.js
      - Logo image: /twilight/logo.png

    It also registers the corresponding sidebar panel(s) using Home Assistant's
    built-in panel registration, including cache-busting version queries based on
    file modification times.
    """
    if hass.data[DOMAIN].get("panel_registered"):
        return

    # Check for the compiled Vite production bundle
    panel_js = Path(__file__).parent / "frontend" / "twilight-panel.js"
    if not panel_js.exists():
        _LOGGER.warning("Twilight panel JS not found at %s", panel_js)
        return

    # Optional development build files and assets
    dev_panel_js = Path(__file__).parent / "frontend" / "twilight-dev-panel.js"
    logo_png = Path(__file__).parent / "frontend" / "logo.png"

    # Register static paths with HA's HTTP server
    try:
        paths = [StaticPathConfig("/twilight/twilight-panel.js", str(panel_js), False)]
        if dev_panel_js.exists():
            paths.append(
                StaticPathConfig(
                    "/twilight/twilight-dev-panel.js", str(dev_panel_js), False
                )
            )
        if logo_png.exists():
            paths.append(StaticPathConfig("/twilight/logo.png", str(logo_png), True))
        await hass.http.async_register_static_paths(paths)
    except RuntimeError:
        _LOGGER.debug("Twilight static path already registered")

    # Generate version query parameter for cache busting based on modification time
    mtime = int(os.path.getmtime(panel_js))

    # Register the main Twilight Panel in the sidebar
    try:
        async_register_built_in_panel(
            hass,
            component_name="custom",
            sidebar_title="Twilight",
            sidebar_icon="mdi:weather-sunset",
            frontend_url_path="twilight",
            config={
                "_panel_custom": {
                    "name": "twilight-panel",
                    "embed_iframe": False,
                    "trust_external": False,
                    "js_url": f"/twilight/twilight-panel.js?v={mtime}",
                }
            },
        )
    except ValueError:
        _LOGGER.debug("Twilight panel already registered")

    # Register the Dev Panel in the sidebar if the dev file exists
    if dev_panel_js.exists():
        dev_mtime = int(os.path.getmtime(dev_panel_js))
        try:
            async_register_built_in_panel(
                hass,
                component_name="custom",
                sidebar_title="Twilight Dev",
                sidebar_icon="mdi:flask-outline",
                frontend_url_path="twilight_dev",
                config={
                    "_panel_custom": {
                        "name": "twilight-dev-panel",
                        "embed_iframe": False,
                        "trust_external": False,
                        "js_url": f"/twilight/twilight-dev-panel.js?v={dev_mtime}",
                    }
                },
            )
            _LOGGER.info("Twilight Dev panel registered in sidebar")
        except ValueError:
            _LOGGER.debug("Twilight Dev panel already registered")

    hass.data[DOMAIN]["panel_registered"] = True
    _LOGGER.info("Twilight panel registered in sidebar")
