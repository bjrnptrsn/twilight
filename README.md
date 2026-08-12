# Twilight for Home Assistant

<p align="center">
  <a href="https://hacs.xyz/docs/faq/custom_repositories/"><img src="https://img.shields.io/badge/HACS-Custom-orange.svg" alt="HACS - Home Assistant Community Store"/></a>
  <a href="https://github.com/bjrnptrsn/twilight/releases"><img src="https://img.shields.io/github/v/release/bjrnptrsn/twilight" alt="Release"/></a>
</p>

<p align="center">
  <img src="custom_components/twilight/brand/icon.png" alt="Twilight Logo" width="128">
</p>

<p align="center">
  <strong>Intelligent, solar-aware lighting automation for your home.</strong><br>
  Let the sun set the schedule — not your watch.
</p>

<p align="center">
  <img src="assets/Timeline.png" alt="Twilight Timeline Showcase" width="100%">
</p>

<p align="center">
  🌅 10 astral zones per area — dawn to dusk, golden hour to night.<br>
  🔄 Multiple channels per area — separate light groups, independent schedules.<br>
  🧠 Input-driven activities — motion, binary sensors, timers, buttons, events.<br>
  🎯 Scene-based execution — plain scenes, Hue scenes, scripts.<br>
  ⚡ Dynamic rules & priority overrides — N-active layers & temporary slot exclusions.<br>
  🔍 Live deviation tracking — real-time monitoring of manual overrides & scene states.<br>
  🌡️ Heatmaps & presence simulation — realistic occupancy replay based on usage history.<br>
  📊 Built-in analytics — weekday activity heatmap with real Recorder data.<br>
  🕸️ Full Web UI — no YAML config needed after setup.
</p>

> [!NOTE]
> **Beta / Active Development** — functional, tested, and proven in daily live use.
> The configuration model may still evolve; expect occasional breaking changes between
> versions. Feedback welcome via [GitHub Issues](https://github.com/bjrnptrsn/twilight/issues).

---

## Table of Contents

- [Why this exists](#why-this-exists)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Core Concept](#core-concept)
  - [Areas](#areas)
  - [Channels & Slots](#channels--slots)
  - [Scenes](#scenes)
- [Inputs & Activities](#inputs--activities)
  - [Sensors](#sensors)
  - [Inputs](#inputs)
  - [Activities](#activities)
    - [Actions & Release Actions](#actions--release-actions)
  - [Manual Triggers (Button Inputs)](#manual-triggers-button-inputs)
  - [Rules](#rules)
- [Frontend Tabs](#frontend-tabs)
  - [Areas](#areas-tab)
  - [Timeline](#timeline-tab)
  - [Analytics](#analytics-tab)
  - [Settings & Area Template](#settings--area-template)
    - [Backup, Restore & Factory Reset](#backup-restore--factory-reset)
- [Services](#services)
- [Diagnostics](#diagnostics)
- [Troubleshooting](#troubleshooting)
  - [Debug Logging](#debug-logging)
- [Known Limitations](#known-limitations)
- [Contributing](#contributing)
- [License](#license)

---

## Why this exists

Home Assistant can turn lights on and off, but matching light scenes to the
sun's position — astronomical dawn, civil dusk, golden hour — still requires
complex automations, templates, and manual scheduling.

**Twilight replaces all of that** with a single integration. You define areas,
each with solar-aligned time slots and optional motion/input overrides, and
Twilight handles the transitions. No template sensors. No scene-to-time
matching. No spaghetti automations.

## Prerequisites

- Home Assistant 2025.5 or newer

The panel follows your Home Assistant language automatically — it's available in Czech, Danish, Dutch, English, Finnish, French, German, Italian, Norwegian, Polish, Portuguese, Simplified Chinese, Slovak, Spanish, Swedish, Turkish, and Ukrainian.

## Installation

### Via HACS (Custom Repository)

Twilight is not yet in the HACS default store — add it as a custom repository:

1. Open **HACS**, click the **⋮** menu (top right), and choose **Custom repositories**.
2. Add `https://github.com/bjrnptrsn/twilight` with category **Integration**.
3. Search for **Twilight** in HACS and click **Download**.
4. **Restart Home Assistant.**
5. Go to **Settings → Devices & Services → Add Integration**, search for **Twilight**, and add it.
6. Open the sidebar and click **Twilight** to launch the panel.

### Manual Installation

1. Copy the `custom_components/twilight` directory to your HA `config/custom_components/` folder:

   ```bash
   cp -r custom_components/twilight /path/to/homeassistant/config/custom_components/
   ```

2. **Restart Home Assistant.**
3. Go to **Settings → Devices & Services → Add Integration**, search for **Twilight**, and add it.
4. Open the sidebar and click **Twilight** to launch the panel.

> [!WARNING]
> Twilight must be added as an integration (**Settings → Devices & Services →
> Add Integration**) before the sidebar panel appears. All configuration then
> happens in the panel — the integration itself has no options to set.

### First Area Setup

1. Open the **Twilight** panel in the sidebar
2. Click **"Add Area"** and select one of your Home Assistant areas — the area is saved immediately and the engine starts right away, using the [area template](#settings--area-template) defaults (10 astral time slots aligned to your location's sun position, plus a default set of inputs/activities)
3. In the **Channels** section, assign your light entities to the Primary channel
4. For each time slot, select a scene or script that should play during that period

---

## Core Concept

Every enabled **Area** runs the same pipeline: sensors feed inputs, inputs
request activities, and exactly one activity at a time controls the lights on
each channel.

```
Sensors  →  Inputs  →  Activity Selection (one active activity)  →  Action  →  Channels/Slots  →  Lights
```

**No activity active → lights are off.** A time slot only decides *which
scene would play* — the schedule alone never turns anything on. Something has
to request an activity first (motion, a button, a timer, …). This is the most
common point of confusion when setting up a new area: if nothing reacts, check
whether an input is actually configured to trigger the Motion or Manual
activity, not whether the slot has a scene assigned.

### Areas

Each **Area** maps to a Home Assistant area. You configure its light groups
(channels), sensors, inputs, and activities independently. An engine runs per
enabled area, so different rooms can have completely different logic.

### Channels & Slots

Every area has a **Primary channel** with 10 fixed astral slots:

`Night → Astronomical dawn → Nautical dawn → Civil dawn → Golden dawn → Day → Golden dusk → Civil dusk → Nautical dusk → Astronomical dusk`

Their order and solar zone are fixed — you can edit each slot's assigned
scene/script, an offset in minutes, and (for Hue scenes that support it)
dynamic color rotation.

You can add up to **3 custom channels** per area, each with a free-form slot
list, to control a separate light group on its own schedule while sharing the
same sensors and inputs (e.g. outdoor lights that don't follow the same curve
as your indoor lighting). Each custom slot starts either at a **sun event**
(any astral zone, with an offset) or a **fixed clock time** (`HH:MM`), and has
its own scene/script assignment.

| Channel Type | Slots | Use Case |
|--------------|-------|----------|
| **Primary** | 10 fixed astral zones | Main indoor lighting — follows the sun |
| **Custom** (up to 3) | Free-form — sun event or fixed time + offset | Outdoor lights, accent lighting, separate schedules |

Each channel also has its own **slot transition duration** (default 60s) —
the crossfade time when moving from one slot to the next.

### Scenes

Twilight supports different scene sources, assigned per slot:

- **Plain Scenes** — standard Home Assistant scenes created via the HA UI or `configuration.yaml`
- **Hue Scenes** — Hue scenes from your Hue Bridge (requires [Hue Integration](https://www.home-assistant.io/integrations/hue/)). Scenes with multi-color or temperature palettes can optionally enable dynamic playback with configurable rotation speed.
- **Scripts** — any Home Assistant script that can control lights

---

## Inputs & Activities

### Sensors

Sensors are passive readings without a guaranteed event on every change — they
support inputs rather than triggering activities themselves. Today, Twilight
supports one sensor type:

- **Illuminance (Lux)** — one per area. Add one or more `sensor.*` entities;
  if you add more than one, their values are combined with an **aggregation**
  method: Minimum (default), Maximum, Average, or Median. The aggregated
  value is what motion inputs compare against their illuminance threshold.

### Inputs

**Inputs** are the event sources that request an activity. Every input has a name
and can be configured in the UI.

| Input Type | Triggers on | Notes |
|------------|-------------|-------|
| **Motion** | Any of its entities (`binary_sensor`, `device_tracker`, `sensor`, `input_boolean`, `switch`) turning `on`/`home` | No release when the sensor goes quiet — a motion sensor drops within seconds, so the activity ends on its timer instead. Optional illuminance threshold, with an option to ignore it during Twilight's own dawn/dusk/night slots or all slots; re-trigger mode (every flip / first flip); optional lux watch window to retry after being blocked by light |
| **Binary** | Any/all/count of its entities (`input_boolean`, `binary_sensor`, `switch`, `sensor`) (configurable aggregation) | Sends a release when turned off |
| **Event** | A `event.*` entity's state change, optionally filtered to an event type | Fires once per matching event, no release |
| **Timer** | A daily fixed clock time (`HH:MM:SS`) | No entity needed — useful for a nightly reset |
| **Button** | Manually via the Areas panel or the `twilight.trigger_input` service | Click mode fires once; Toggle mode sends a release on the second call — see [Manual Triggers](#manual-triggers-button-inputs) |

Each input targets either an **Activity** or a **Rule** (via "Target Type").
Binary and toggle-mode button inputs can target either; motion, event, timer,
and click-mode button inputs always target an Activity.

### Activities

An activity owns the lights while it is active — the coordinator only ever
lets **one activity run at a time**; a new request immediately displaces
whatever was active before.

| Option | Description |
|---|---|
| **Suppressed Inputs** | List of inputs to ignore while this activity is active (e.g. a sleep activity suppressing the motion input) |
| **Enable Auto-Expire** | Whether the activity runs a timer at all. Unchecked, it ends only when a binary input turns off, a toggle button is switched off, or another activity takes over. |
| **Auto-Expire Duration** | How long the timer runs, once enabled. Empty uses the default of 3 hours. |
| **Turn-Off Transition** | How long this activity's turn-off fades out, in seconds — empty turns lights off immediately with no fade. |
| **Respect Off** | If a light was switched off manually while this activity is active, leave it off at the next slot change instead of turning it back on. A new trigger (motion, a switch, a button) turns it back on as usual. |

#### Actions & Release Actions

What actually happens to the lights on start (action) and on end (release action):

| Action type | Effect | Applies to |
|---|---|---|
| **Schedule** | Plays the current channel/slot's scene; allows selecting active channels and slots | Action |
| **Entity/Script** | Activates one chosen scene or script directly, ignoring the schedule | Action |
| **Light Control** | Sets specific light entities directly — on/off, brightness, color temperature, or RGB | Action |
| **Block** | Does nothing to the lights ("Block Only / No Action") | Action |
| **Turn Off** | Turns off all of this activity's slot entities | Release |
| **Reset Command** | Sends a fixed command (`on`/`off`/`toggle`/`activate`) to `input_boolean`, `switch`, or `script` entities you choose — for driving something other than lights | Action (no release phase) |
| **Presence Simulation** | Simulates presence by playing back an activity's light behavior timed by historical or profile heatmap probabilities | Action |

New activities in the editor start pre-filled with **Schedule**/**Turn Off** as a
convenient starting point, but this is not a backend fallback: if you explicitly
clear an activity's action or release action, it does nothing on that phase —
there is no implicit default.

#### Channel & Slot Selection

For **Schedule** actions you can choose per channel and slot in the UI which
sections are active. If a slot is unchecked for a channel, that channel stays
off during that period.

#### Presence Simulation

Activities using presence simulation make an empty home look occupied
by re-creating realistic lighting patterns. You select an existing activity
(such as your standard motion activity) to copy its light behavior and duration,
and Twilight triggers it based on motion density probabilities throughout the day:

- **Data source**: evaluate live recorder history (a rolling 30-day window) or pick one of up to **5 saved heatmap profiles** per area (saved from the Heatmap card, where you choose the range `1w`–`6m` and resolution).
- **Lux gating**: choose when simulated motion may turn lights on (Dusk/Dawn [default], illuminance threshold, or Always).
- **Eligible activities**: any activity that controls lights (Schedule, Entity, or Light).
- **Frequency**: scale how often simulated triggers fire, from very low to very high, relative to the measured motion density.

Trigger probabilities are based on how many days actually saw activity at a
given time, so a room used every evening is simulated more often than one used
once. A running simulation resumes automatically after a Home Assistant restart.

#### Default Activities

Four activities are preconfigured on every new area (from the default
[area template](#settings--area-template)):

- **Motion** — triggered by the motion input, runs for 5 minutes by default (auto-prolonged while motion is still detected)
- **Manual** — triggered by the manual trigger input, suppresses motion while active, no timer
- **Sleep** — triggered by the binary sleep input, suppresses motion while active, no timer (ends when the switch goes off)
- **Reset** — triggered by the reset button, sends a reset command (no light control, never expires)

Edit or replace them via the area template, and add your own for anything
else — a guest mode, extra motion inputs with different lux thresholds, and
so on.

#### Auto-Expire & Input Prolongation

Auto-Expire determines how long an activity remains active after being triggered:

- **Explicit Timer Switch**: Use **Enable Auto-Expire** to turn the timer on or off explicitly. Unchecked, an activity runs indefinitely until explicitly released (e.g. a binary input turning off, a toggle button switching off, or another activity taking over). A manual override or sleep activity typically has Auto-Expire disabled.
- **Automatic Prolongation**: When the auto-expire timer runs out, Twilight automatically checks whether any of its triggering inputs are still active (e.g., a motion sensor holding `on`, a binary contact, or an active toggle button). If active, the timer restarts for the full duration instead of ending the activity. The configured duration is a **minimum lifetime**, not a hard deadline — as long as you remain active in the room, the activity stays on.
- **Lux-Aware Prolongation**: For motion inputs, prolongation re-evaluates daylight levels using the exact same illuminance threshold as initial activation. If natural daylight has filled the room above the threshold, the timer will not extend and the light turns off naturally.

### Manual Triggers (Button Inputs)

Button inputs need no HA entity — they're triggered directly from the Areas
panel, or from an automation via the `twilight.trigger_input` service (see
[Services](#services)). Two modes:

- **Click** — fires once, fire-and-forget (e.g. a dashboard "Reset" button)
- **Toggle** — tracks on/off state, sent to the frontend live

Optionally, enable **Create Entity** on a button input to also expose it as a
real Home Assistant entity: `click` mode creates a `button.*`, `toggle` mode
creates a `switch.*`. Useful if you want to trigger it from a physical
dashboard tile, voice assistant, or another automation without going through
the service call.

### Rules

**Rules** are a temporary, parallel override layer: while a trigger input (a
switch or toggle button) is active, active Rules modify the behavior of the
currently running activity or configuration — they do not control lights on
their own. Unlike Activities (only one active at a time), any number of Rules
can be active in parallel.

Today there is one Rule type:

| Rule Type | Overrides | Trigger & Condition |
|---|---|---|
| **Activity Rule** | Channel/slot selection, auto-expire behavior, and input suppression of a target Activity | Triggered by binary or toggle button input; active only when target Activity is running |

An **Activity Rule** affects exactly one Activity. While active, its settings
override the Activity's own settings: **what is checked in the Rule applies.**
If multiple Rules target the same Activity, "exclude wins" — a slot is active for a
channel only if it is checked in all active Rules.

When configuring an Activity Rule in the editor, options for Auto-Expire behavior, channel slots, or input suppression are dynamically displayed only if applicable to the selected target activity.

An Activity Rule can also optionally control what happens to the target
Activity's **auto-expire** countdown while the Rule is active ("Auto-Expire
Behavior"):

| Mode | Effect |
|---|---|
| **None** (default) | No effect — the timer runs unaffected. |
| **Pause** | Freezes the timer at its current remaining time; resumes with that same remaining time once the Rule ends. |
| **Suspend** | Freezes the timer at zero; the Activity expires immediately once the Rule ends (unless another condition, like active motion, still holds it open). |
| **Restart** | Freezes the timer at the full configured duration; the Activity gets a fresh full timer once the Rule ends. |

If the target Activity has auto-expire disabled, there is no timer to freeze and
all four modes do nothing.

**Rule-Granted Auto-Expire**: for a target Activity that has no timer of its own
(Auto-Expire disabled), a Rule can instead *lend* it one — enable **Auto-Expire**
and set a duration directly on the Rule. The timer starts once the Rule
activates and keeps running on its own after the Rule ends, so the Activity
still turns off cleanly instead of running forever. Re-triggering the Activity
while the Rule is still active resets the loan to its full duration; a
re-trigger after the Rule has ended no longer has a duration to draw from and
runs unbounded, like any other Activity without Auto-Expire. This is mutually
exclusive with the Auto-Expire Behavior modes above — a Rule only ever uses
one or the other, depending on whether its target Activity already has a
timer.

If a Rule's target Activity is edited afterwards and no longer supports one of
the Rule's configured options (e.g. Auto-Expire Behavior on an Activity that
gained its own timer), the Rule is automatically disabled and flagged with a
warning in the Rules list until reconfigured.

A Rule can also suppress other inputs while it is active — e.g. an "Ambient" Rule
that ignores the motion sensor input for its duration. While a matching Rule is active,
its suppressed inputs replace the target Activity's own input suppression.
Suppressed inputs stop reacting to triggers until the Rule ends; this uses the same
disabler mechanism as an Activity's own [input suppression](#activities), just
keyed to the Rule instead. A Rule cannot suppress the input that triggers it.

A Rule can also override the target Activity's **Respect Off** setting while
active — force it to Respect (leave manually switched-off lights alone) or
Ignore (turn them back on as usual) regardless of what the Activity itself is
set to, or leave it at the Activity's own setting (default).

Configure Rules via the **Rules** card in an area's detail view or in the
[Area Template](#settings--area-template).

---

## Frontend Tabs

Twilight ships with a full Lit-based sidebar panel — no YAML editing needed
after initial setup.

### Areas Tab

Overview cards (with a sparkline day chart and live stats per area) plus a
detail view per area for all configuration described above: channels, sensors,
inputs, activities, an activity heatmap card (visualizing weekday sensor patterns
from live recorder data or up to **5 saved heatmap profiles**), and a live status card
showing the currently active activity and what triggered it.

<p align="center">
  <img src="assets/Areas.png" alt="Twilight Areas Tab" width="100%">
</p>

### Timeline Tab

- **Day view** — the sun's path through today's astral zones, with live time indicator
- **Year view** — the same zones plotted across the whole year, so you can see how slot durations shift with the seasons
- **Area selector** — preview area-specific primary-channel slot offsets on both charts
- Includes a demo mode with example locations, independent of any configured area

<p align="center">
  <img src="assets/Timeline.png" alt="Twilight Timeline Tab" width="100%">
</p>

### Analytics Tab

A weekday-aggregated activity heatmap backed by real Home Assistant Recorder
data — switch between motion and light activity, pick a time range and
resolution, and save up to 5 snapshots per area to compare usage patterns
over time.

### Settings & Area Template

The **Area template** setting is the blueprint used to seed every *new* area:
its default inputs (motion, a manual trigger, a reset trigger, a binary sleep
trigger, a reset button, and an ambient rule trigger), default activities
(**Motion**, **Manual**, **Sleep**, **Reset**), a default [Ambient rule](#rules),
an Ambient example custom channel, and the default Primary-channel slots
(per-zone offsets and scenes). Edit it once
in **Settings** and every area you create afterwards starts pre-wired instead
of empty — existing areas are unaffected. A granular **Reset to System
Defaults** dialog lets you restore individual inputs/activities/rules/channels
without resetting the whole template.

<p align="center">
  <img src="assets/Settings.png" alt="Twilight Settings Tab" width="100%">
</p>

### Backup, Restore & Factory Reset

The **Backup & Restore** button in the Settings footer downloads a full
snapshot of the store — global settings, area template, and every area's
configuration (no runtime state) — as a single JSON file, and can restore
from one.

Restoring **completely replaces** the current configuration: areas not
present in the backup file are deleted, and all running engines are torn
down and rebuilt from the imported config immediately — no Home Assistant
restart required. A confirmation dialog is shown before any destructive
restore. Lights already on keep their last state until the next regular
slot/activity change; nothing is force-switched during the restore itself.

Inside the Backup & Restore dialog, a **Factory Reset** action is also
available to reset Twilight back to its initial system defaults — deleting
all custom areas and resetting global settings and templates after explicit
confirmation.

---

## Services

### `twilight.trigger_input`

Fires or releases a button-type input from an automation or script, without
needing a real HA entity for it.

| Field | Required | Description |
|-------|----------|--------------|
| `area_id` | Yes | The Home Assistant area containing the input |
| `input_id` | Yes | The button input's `id` or name (visible in the inputs list) |
| `active` | No | For `toggle`-mode buttons: `true`/`false` to set the state explicitly |

```yaml
service: twilight.trigger_input
data:
  area_id: living_room
  input_id: reset_btn
```

## Diagnostics

Download a full diagnostics snapshot via **Settings → Devices & Services →
Twilight → ⋮ → Download diagnostics** in Home Assistant. It contains the
current store (all areas + global settings) and, per area, the live run
state, the resolved scene map (which entity plays in which slot), and the
last known state of every controlled light — useful when reporting a bug.

> [!NOTE]
> The file contains your real entity IDs, scene names, and area names —
> nothing secret (no tokens or credentials), but potentially revealing about
> your home. Review it before attaching it to a public GitHub issue.

---

## Troubleshooting

| Problem | Solution |
|---------|--------|
| Lights never turn on | No activity is active — check that an input is actually wired to an activity; a slot having a scene assigned is not enough, see [Core Concept](#core-concept) |
| Scene shows no lights | Check if the scene still exists and is reachable; if it involves a Hue Smart Scene, ensure the Hue Integration is loaded |
| Motion sensors not responding | Verify the lux threshold in the motion input — it may be suppressed by high ambient light; check the aggregated lux value on the area's status card |
| Lights flash on restart | This shouldn't happen — Twilight uses boot-catch-up to avoid unwanted activation. Please [open an issue](https://github.com/bjrnptrsn/twilight/issues) |

### Debug Logging

Go to **Settings → Devices & Services → Integrations → Twilight**, open the
three-dot menu, and select **Enable debug logging**. No restart required —
this only lasts until the next restart.

When reporting a bug, ideally share the full log. If you'd rather not share
unrelated data, filter it down to just Twilight's entries:

```bash
grep 'twilight' home-assistant.log > twilight.log
```

The [diagnostics download](#diagnostics) is usually more useful for
configuration/state questions — reach for debug logging when you need to see
the actual event-by-event decisions (why an activity didn't trigger, why a
retry fired, etc.).

## Known Limitations

- Only one illuminance sensor per area (multiple entities can feed into it)

## Contributing

Found a bug or have an idea? [Open an issue](https://github.com/bjrnptrsn/twilight/issues) on GitHub.

## License

MIT License
