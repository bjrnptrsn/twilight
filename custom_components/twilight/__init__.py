"""The Twilight integration.

This integration provides smart, dynamic lighting and automation based on solar conditions,
timeslot-based schedules, motion, lux, and overrides.
"""

from __future__ import annotations

import asyncio
import logging
import os
from pathlib import Path
from typing import Any

import voluptuous as vol
from homeassistant.components.frontend import (
    async_register_built_in_panel,
    async_remove_panel,
)
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import SOURCE_IMPORT, ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED, EVENT_HOMEASSISTANT_STOP
from homeassistant.core import CoreState, HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.dispatcher import async_dispatcher_send

from . import button as twilight_button
from . import switch as twilight_switch
from .const import DOMAIN, SIGNAL_ENGINES_CHANGED
from .engine_registry import (
    area_wants_engine,
    async_clear_area_entities,
    async_start_engine,
)
from .helpers import dispatch_button_input, get_area_lock, get_setup_lock
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

    # A reload (homeassistant.reload_custom_component, or async_setup being
    # re-entered for any other reason) must tear down engines from the
    # previous setup before replacing the dict — otherwise their listeners
    # and timers are orphaned while a second set is set up on top, causing
    # duplicate light control and a growing STOP-listener chain.
    #
    # Each engine is torn down and popped under its own area lock — the same
    # lock area/save and the boot loop hold while registering a new engine —
    # so a save racing this reload can't have its freshly registered engine
    # silently discarded (or discard one this reload just tore down) by an
    # unsynchronized dict clear.
    #
    # Per-area locks alone don't cover a brand-new area's *first* save: this
    # loop only knows the area_ids that already had an engine (old_engine_ids
    # below), so it never touches that area's lock, and a save landing in the
    # unguarded window between the loop and engines.clear() would register an
    # engine that clear() then discards (leaked — never torn down). The
    # global setup lock (get_setup_lock) closes that gap: area/save and
    # area/delete acquire it too (see websocket/areas.py), so neither can run
    # while this whole reload — teardown loop through engines.clear() — is in
    # flight, regardless of whether the area is old or brand new.
    async with get_setup_lock(hass):
        engines = hass.data[DOMAIN].setdefault("engines", {})
        old_engine_ids = list(engines.keys())
        if old_engine_ids:
            _LOGGER.info(
                "Twilight is being re-set up — tearing down %d existing engine(s) first",
                len(old_engine_ids),
            )
            for area_id in old_engine_ids:
                async with get_area_lock(hass, area_id):
                    engine = engines.pop(area_id, None)
                    if engine is None:
                        continue
                    try:
                        await engine.async_teardown()
                    except Exception:
                        _LOGGER.exception(
                            "Error tearing down TwilightEngine for area: %s", area_id
                        )

        # Initialize and load the HA Storage-backed persistence store
        store = TwilightStore(hass)
        await store.async_load()
        hass.data[DOMAIN]["store"] = store
        # Clear in place rather than reassigning: subscribe.py's twilight/subscribe_all
        # closure binds "engines" once via setdefault() and keeps iterating that same
        # dict object for the life of the connection. A reassignment here would orphan
        # any already-open subscription on the old (now-empty) dict, silently killing
        # its live pushes for newly (re-)added engines until the panel reconnects.
        # Nothing can survive here anymore: the setup lock above rules out a
        # concurrent area/save or area/delete registering/removing an engine
        # during this whole block, old or brand new.
        engines.clear()

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
    if (
        not hass.config_entries.async_entries(DOMAIN)
        and "entry_flow_task" not in hass.data[DOMAIN]
    ):
        entry_flow_task = hass.async_create_task(
            hass.config_entries.flow.async_init(
                DOMAIN, context={"source": SOURCE_IMPORT}, data={}
            )
        )
        hass.data[DOMAIN]["entry_flow_task"] = entry_flow_task

        def _clear_entry_flow_task_on_failure(task: asyncio.Task[Any]) -> None:
            # A crashed flow must not permanently block future attempts: leaving
            # the dict entry in place would make the "not in hass.data[DOMAIN]"
            # guard above skip every later async_setup (e.g. an integration
            # reload) for the rest of this HA run. _async_boot pops the entry
            # itself on success, so this only fires for a failed/cancelled task.
            if task.cancelled():
                hass.data[DOMAIN].pop("entry_flow_task", None)
            elif task.exception() is not None:
                _LOGGER.error(
                    "Self-created config entry flow failed: %s", task.exception()
                )
                hass.data[DOMAIN].pop("entry_flow_task", None)

        entry_flow_task.add_done_callback(_clear_entry_flow_task_on_failure)

    # Register WebSocket API commands for frontend-backend communication
    async_register_commands(hass)

    # Register frontend panel and static assets (Vite build outputs)
    await _async_register_panel(hass)

    async def _async_setup_engines(_event: Any = None) -> None:
        """Spin up TwilightEngine coordinators for all configured and enabled areas.

        Skips areas that already have an engine — a WS area/save can run before
        EVENT_HOMEASSISTANT_STARTED fires and create an engine ahead of this loop.
        """
        # Held for the whole loop, same as the reload block above (get_setup_lock's
        # own docstring) — without it, a homeassistant.reload_custom_component
        # landing while this boot loop is still mid-flight could run its
        # engines.clear() in the gap before async_start_engine() below registers
        # an engine built from this now-stale `store` snapshot, leaking an
        # untorn-down engine that outlives the reload it should have lost to.
        async with get_setup_lock(hass):
            areas = store.get_areas()
            engines_created = False
            for area_id, config in areas.items():
                # Held for the same area_id as area/save and area/delete, so an
                # area/save racing this boot loop can't create a second engine
                # for the same area (both would otherwise pass the "no engine
                # yet" check before either registers its engine).
                async with get_area_lock(hass, area_id):
                    if area_id in hass.data[DOMAIN]["engines"]:
                        continue
                    if area_wants_engine(config):
                        _LOGGER.info("Setting up TwilightEngine for area: %s", area_id)
                        # async_start_engine() logs and returns None on failure: one
                        # area's bad config (or a transient failure, e.g. Hue bridge
                        # unreachable) must not leave every subsequent area without
                        # light control.
                        if await async_start_engine(hass, area_id, config):
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
            try:
                await task
            except Exception:
                _LOGGER.exception("Error awaiting entry flow task during Twilight boot")
        await _async_setup_engines()

    # Defer engine setup until HA has fully started (scene platform, Hue, etc. are
    # not reliably ready during async_setup). If HA is already running — e.g. on a
    # config reload — EVENT_HOMEASSISTANT_STARTED has already fired, so set up now.
    # The direct path must not await the entry flow task (same deadlock as above);
    # attach_config_entry() tolerates a not-yet-existing entry defensively.
    if hass.state is CoreState.running:
        await _async_setup_engines()
    else:
        old_unsub_boot = hass.data[DOMAIN].get("unsub_boot")
        if old_unsub_boot is not None:
            old_unsub_boot()
        hass.data[DOMAIN]["unsub_boot"] = hass.bus.async_listen_once(
            EVENT_HOMEASSISTANT_STARTED, _async_boot
        )

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

    # A reload re-enters this function, so unsubscribe any listener from a
    # previous setup first — otherwise every reload leaves one more STOP
    # listener registered, all of them tearing down the same current engines
    # dict again on actual shutdown.
    old_unsub_stop = hass.data[DOMAIN].get("unsub_stop")
    if old_unsub_stop is not None:
        old_unsub_stop()
    hass.data[DOMAIN]["unsub_stop"] = hass.bus.async_listen_once(
        EVENT_HOMEASSISTANT_STOP, _async_shutdown_cleanup
    )

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
    """Set up config entry: if DOMAIN was removed (e.g. re-add after deletion), re-initialize setup."""
    if DOMAIN not in hass.data:
        await async_setup(hass, {})
    return True


async def async_unload_entry(hass: HomeAssistant, _entry: ConfigEntry) -> bool:
    """No-op: nothing was set up per-entry, see async_setup_entry()."""
    return True


async def async_remove_entry(hass: HomeAssistant, _entry: ConfigEntry) -> None:
    """Tear down all engines, clear entities, and wipe the store when entry is deleted."""
    domain_data = hass.data.get(DOMAIN, {})
    old_unsub_stop = domain_data.get("unsub_stop")
    if old_unsub_stop is not None:
        old_unsub_stop()
    old_unsub_boot = domain_data.get("unsub_boot")
    if old_unsub_boot is not None:
        old_unsub_boot()

    store: TwilightStore | None = domain_data.get("store")
    area_ids = list(store.get_areas().keys()) if store else []

    engines = list(domain_data.get("engines", {}).values())
    for engine in engines:
        try:
            await engine.async_teardown()
        except Exception:
            _LOGGER.exception("Error tearing down engine during remove entry")

    for area_id in area_ids:
        await async_clear_area_entities(hass, area_id)

    if store is not None:
        await store.store.async_remove()

    async_remove_panel(hass, "twilight", warn_if_unknown=False)
    async_remove_panel(hass, "twilight_dev", warn_if_unknown=False)

    hass.data.pop(DOMAIN, None)


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
    # Check for the compiled Vite production bundle
    panel_js = Path(__file__).parent / "frontend" / "twilight-panel.js"
    if not panel_js.exists():
        _LOGGER.warning("Twilight panel JS not found at %s", panel_js)
        return

    # Optional development build files and assets
    dev_panel_js = Path(__file__).parent / "frontend" / "twilight-dev-panel.js"
    logo_png = Path(__file__).parent / "frontend" / "logo.png"

    # Generate version query parameter for cache busting based on modification time
    mtime = int(os.path.getmtime(panel_js))
    dev_mtime = int(os.path.getmtime(dev_panel_js)) if dev_panel_js.exists() else None

    # Registered once per mtime pair — a reload after a fresh frontend build
    # (mtime changed) removes and re-registers the panel(s) so the new
    # cache-busted js_url actually takes effect without a full HA restart.
    registered_mtimes = hass.data[DOMAIN].get("panel_registered_mtimes")
    if registered_mtimes == (mtime, dev_mtime):
        return
    if registered_mtimes is not None:
        async_remove_panel(hass, "twilight", warn_if_unknown=False)
        async_remove_panel(hass, "twilight_dev", warn_if_unknown=False)

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

    hass.data[DOMAIN]["panel_registered_mtimes"] = (mtime, dev_mtime)
    _LOGGER.info("Twilight panel registered in sidebar")
