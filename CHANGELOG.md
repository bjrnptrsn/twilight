# Changelog

## 0.6.2 - 2026-10-24

### 🎨 Improvements

*   **Panel Source for HACS**: The source code of the Twilight panel is now part of the repository, as required for inclusion in the HACS default store.

## 0.6.1 - 2026-10-19

### 🎨 Improvements

*   **Uniform Chart Labels**: The Timeline and Analytics charts now use a consistent font size and Home Assistant's secondary text color for their axis labels.

*   **Cleaner Installation**: Removed an unnecessary dependency declaration that Home Assistant already provides.

### 🔧 Fixes

*   **Event Loop Responsiveness**: Fixed brief stalls of Home Assistant's event loop while loading sun and slot data.

## 0.6.0 - 2026-08-12

### ✨ Features

*   **17 Languages**: The Twilight panel — every card, dialog, and label — is now available in Czech, Danish, Dutch, English, Finnish, French, German, Italian, Norwegian, Polish, Portuguese, Simplified Chinese, Slovak, Spanish, Swedish, Turkish, and Ukrainian, matching Home Assistant's own language setting automatically.

*   **Respect Off**: Activities can now be set to leave a light alone if it was switched off manually while active, instead of turning it back on at the next slot change.

*   **Rule Control Over Manual Off**: Rules can now force an Activity to either respect or ignore manually switched-off lights while the rule is active, overriding the Activity's own setting.

### 🎨 Improvements

*   **Clean Reinstall**: Removing the Twilight integration now also clears its stored configuration, so adding it again starts fresh instead of restoring old areas.

*   **Translated Service & Setup Text**: The Trigger Input service and the one-time setup step now show properly translated text in Home Assistant's supported languages instead of always falling back to English.

*   **Localized Heatmap Week Start**: The Analytics heatmap now starts its week on the day Home Assistant's language settings expect, instead of always starting on Monday.

*   **Light Command Handling Refactor**: Reworked how Twilight sends and retries light commands internally, making transitions and retries more consistent across scenes and single lights.

*   **Faster Areas Tab Switching**: Switching away from and back to the Areas tab now keeps its live data and any area you have open, instead of reloading everything from scratch.

### 🔧 Fixes

*   **Startup Responsiveness**: Fixed a case where loading sun/slot data during setup could briefly stall Home Assistant's event loop.

*   **Areas Overview Flicker**: Fixed a rendering loop that could cause the Areas tab to flicker while no areas are configured yet.

*   **Stuck Scene Transitions**: When a light fails to reach its target during a slot change, the next motion trigger now reapplies the scene properly instead of being ignored.

*   **Daylight-Saving Accuracy**: Slot transitions around the summer/winter time change are now executed at the correct time instead of one hour off.

*   **Presence Simulation**: Fixed a double start after a Home Assistant restart when a sensor triggers the simulation at the same time.

*   **Disabling or Deleting an Area**: Lights now switch off when an area is disabled or deleted, matching the existing behavior for individual channels.

## 0.5.0 - 2026-08-05

### ⚠️ Breaking Changes

*   **Auto-Expire is now switched on or off explicitly**: A zero duration no longer means "no timer" — untick "Enable Auto-Expire" instead. Activities previously set to `00:00:00` need to be checked.

*   **Expiry Check Mode removed**: An activity is now always held open while one of its triggering inputs is still on, including Block activities. For motion inputs this follows the input's own brightness settings.

### ✨ Features

*   **Enable Auto-Expire**: Activities can run without any timer, ending only on release or when another activity takes over.

*   **Rule-Granted Auto-Expire**: Rules can now temporarily give an auto-expire timer to an activity that normally has none, keeping it running for the rest of that duration even after the rule ends.

*   **Dynamic Hue Scenes**: Slots using Philips Hue scenes can now opt into dynamic color rotation with configurable playback speed in the slot editor.

*   **Presence Simulation Frequency**: Added wider frequency options ranging from very low to very high for presence simulation.

### 🎨 Improvements

*   **Smart Rule Editor**: The Rule editor now only displays configuration fields (such as Auto-Expire, channel slots, or input suppression) that apply to the selected target activity.

*   **Rule Mismatch Warnings**: If a rule's settings no longer fit its target activity after an edit, the rule is automatically disabled and clearly flagged in the Rules list.

*   **Alphabetical UI Lists**: Lights, entities, and state lists across cards are now sorted alphabetically by name.

### 🔧 Fixes

*   **Presence Simulation**: Fixed simulation trigger timing and restored automatic resumption after Home Assistant restarts.

## 0.4.0 - 2026-07-30

### ✨ Features

*   **Area Template Slot Editing**: Primary-Channel slots and offsets can now be configured directly in the Area Template (Settings tab) to serve as default values for new areas.

*   **Rule Auto-Expire Controls**: Rules can now pause, suspend, or restart an Activity's auto-expire timer while active.

*   **Rule Input Suppression**: Rules can now temporarily suppress specific inputs (e.g. motion sensors) while active, overriding the target activity's default suppression settings.

### 🎨 Improvements

*   **Interface polish**: various refinements to layout, labels and chart rendering across the panel.

## 0.3.0 - 2026-07-27

### ✨ Features

*   **Timeline Area Offsets**: The Timeline tab now features an Area selector, displaying area-specific primary-channel slot offsets on both the day and year sun charts.

### 🔧 Fixes

*   **Input & Activity Editor**: Fixed an issue where entity pickers were hidden.

## 0.2.0 - 2026-07-26

### ✨ Features

*   **Rules system**: parallel, temporary override layer triggered by switches or buttons. Rules modify active behavior without controlling lights directly, allowing multiple overrides to run simultaneously.

*   **Activity Rules**: the first Rule type, allows overriding a target activity's channel/slot configuration, while the activity is running.

*   **Presence Simulation Action**: activities can now use the Presence Simulation action to make an empty home look occupied by playing back an activity's light behavior based on historical motion density.

*   **Saved Heatmap Profiles**: save up to 5 static snapshots of sensor motion heatmap data per area, manage profiles in the Heatmap card, and select profiles for presence simulation or visualization.

## 0.1.0 - 2026-07-23

First public (experimental) release. Twilight is functional but not
feature-complete; the configuration model is still evolving and breaking
changes between versions are expected.

### ✨ Features

*   **Solar-aware scheduling**: 10 astral zones per area (dawn to dusk, golden hour to night), with per-slot scene/script and offset configuration.

*   **Multi-channel areas**: a fixed Primary channel plus up to 3 custom channels per area, each with its own slot set and transition, sharing the area's sensors and inputs.

*   **Input-driven activities**: motion, binary sensor, event, timer, and button inputs mapped to freely named activities; per-activity start/release actions (slot/scene/script/light/turn-off/none).

*   **Multi-entity inputs**: several entities per input — motion with configurable re-trigger, binary with any/all/count aggregation.

*   **Lux gating**: illuminance sensors as a per-input threshold, with configurable ignore scopes.

*   **Anticipatory transitions**: two-stage slot fades with a per-light retry loop and deviation watching.

*   **Full Web UI**: a Lit-based sidebar panel (Areas, Analytics, Timeline, Settings) — all configuration happens in the UI, no YAML beyond `twilight:` in `configuration.yaml`.

*   **Analytics & timeline**: uPlot charts over real Recorder data, plus day/year sun-path visualizations.

*   **Config backup & restore**: versioned export/import of the full store.
