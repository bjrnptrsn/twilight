# Example Configurations

Real-world scenarios, ordered by complexity. Each example describes the situation, then lists **only the settings that matter** — everything else stays at its default. All of them are set up in the Twilight panel, and new areas already come with the default inputs and activities used here.

How the parts fit together is explained in [How Twilight Works](HOW_IT_WORKS.md).

- [Basic](#basic) — one sensor, one room
  - [1. Motion Light](#1-motion-light)
  - [2. Only When It Is Dark](#2-only-when-it-is-dark)
  - [3. A Room Without Daylight](#3-a-room-without-daylight)
- [Everyday](#everyday) — switches, modes and resets
  - [4. Two Motion Sensors in One Room](#4-two-motion-sensors-in-one-room)
  - [5. Wall Switch for On and Off](#5-wall-switch-for-on-and-off)
  - [6. Sleep Mode](#6-sleep-mode)
  - [7. Movie Night](#7-movie-night)
  - [8. Nightly Reset](#8-nightly-reset)
  - [9. Your Own Lamps Reach the Lux Sensor](#9-your-own-lamps-reach-the-lux-sensor)
- [Schedules](#schedules) — making the slots work for you
  - [10. Motion Light Only at Night](#10-motion-light-only-at-night)
  - [11. Evening Scene That Waits in Winter](#11-evening-scene-that-waits-in-winter)
  - [12. Dynamic Hue Scene for the Evening](#12-dynamic-hue-scene-for-the-evening)
  - [13. Porch Light With Its Own Schedule](#13-porch-light-with-its-own-schedule)
- [Advanced](#advanced) — simulation, Rules and automations
  - [14. Presence Simulation While You Are Away](#14-presence-simulation-while-you-are-away)
  - [15. Add Ambient Lights With a Switch](#15-add-ambient-lights-with-a-switch)
  - [16. Keep the Light On During a Meeting](#16-keep-the-light-on-during-a-meeting)
  - [17. Trigger Twilight From an Automation](#17-trigger-twilight-from-an-automation)

---

## Basic

### 1. Motion Light

A hallway light that comes on when you walk through and follows the sun: bright during the day, dim at night.

**Entities:** `binary_sensor.hallway_motion`

| Where | Setting | Value |
|---|---|---|
| Slot Timetable → Edit Slots | Scene per slot | your scenes, e.g. bright for Day, dim for Night |
| Triggers & Inputs → motion input | Entities | `binary_sensor.hallway_motion` |
| Triggers & Inputs → motion input | Target Activity | Motion |

**Result:** Motion plays the current slot's scene right away. The default Motion activity runs for 5 minutes, and any new motion starts the timer over. Once the room stays quiet, the light turns off.

> **Tip:** the lights are read from your scenes, so there is nothing else to assign.

---

### 2. Only When It Is Dark

The same light, but it should stay off while there is enough daylight.

**Entities:** `sensor.hallway_illuminance`

| Where | Setting | Value |
|---|---|---|
| Sensors | Illuminance sensor | `sensor.hallway_illuminance` |
| Triggers & Inputs → motion input | Lux Threshold (lx) | 20 |

**Result:** Motion only fires at 20 lx or below. If the room is brighter, Twilight keeps checking for the **Lux Watch** time (10 seconds by default), so a cloud passing by can still bring the light on.

> **Tip:** the threshold is a question of taste. Look at your sensor's value in Home Assistant at the moment you'd want the light to come on.

---

### 3. A Room Without Daylight

A bathroom without a window. Whether it is day outside says nothing about the room.

| Where | Setting | Value |
|---|---|---|
| Sensors | Illuminance sensor | none |

**Result:** Without an illuminance sensor there is no brightness check, so motion always fires. The slots still decide the scene: bright by day, dim at night.

---

## Everyday

### 4. Two Motion Sensors in One Room

A long room with a sensor at each end.

**Entities:** `binary_sensor.kitchen_motion_door`, `binary_sensor.kitchen_motion_window`

| Where | Setting | Value |
|---|---|---|
| Triggers & Inputs → motion input | Entities | both sensors |

**Result:** Either sensor fires the input, and both keep the light on. The Live Monitor shows which sensor triggered it.

---

### 5. Wall Switch for On and Off

A wireless switch that fires events: one press for light on and no more automatic turn-off, a long press to go back to normal.

**Entities:** `event.living_room_switch` with the event types `single` and `long_press`

| Where | Setting | Value |
|---|---|---|
| First event input | Entities / Event Type | `event.living_room_switch` / `single` |
| First event input | Target Activity | Manual |
| Second event input | Entities / Event Type | `event.living_room_switch` / `long_press` |
| Second event input | Target Activity | Reset |

**Result:** A press plays the current slot's scene and keeps it running: the default Manual activity has no timer, and motion is ignored while it runs. A long press runs Reset, which turns the lights off and ends the activity, so motion works again.

---

### 6. Sleep Mode

At night, walking around should not turn on any lights.

**Entities:** `input_boolean.sleep_mode`

| Where | Setting | Value |
|---|---|---|
| Binary input | Entities | `input_boolean.sleep_mode` |
| Binary input | Target Activity | Sleep |
| Sleep activity | Action Type | Block Only (No Action) |
| Sleep activity | Input Suppression | the motion input |
| Sleep activity | Enable Auto-Expire | off |
| Sleep activity | Release Action | Turn Off |

**Result:** Turning the switch on changes no light, but motion is ignored from now on. Turning it off in the morning ends Sleep and switches off anything still on. These are the defaults of the Sleep activity, so you only need to assign the entity.

> **Tip:** without a timer, Sleep ends only through its switch. A timer would lift the suppression in the middle of the night.

---

### 7. Movie Night

One tap for a fixed cinema scene that ignores motion, and back to normal afterwards.

**Entities:** `scene.living_room_movie`

| Where | Setting | Value |
|---|---|---|
| New button input | Mode | Toggle (on/off) |
| New button input | Target Activity | Cinema (new activity) |
| New button input | Create HA entity | on, if you want a dashboard tile or voice control |
| Cinema activity | Action Type | Scene / Script |
| Cinema activity | Scene or Script Entity | `scene.living_room_movie` |
| Cinema activity | Input Suppression | the motion input |
| Cinema activity | Enable Auto-Expire | off |
| Cinema activity | Release Action | Switch to Activity |
| Cinema activity | Target Activity | Motion |

**Result:** The button starts the scene, and it stays through slot changes. Switching the button off hands over to Motion: the lights move to the current slot's scene, and its timer turns them off once the room stays quiet.

> **Tip:** a light the cinema scene switches on but no slot scene contains stays on after the switch, so use lights from your slot scenes. To go dark right away, use **Turn Off**.

---

### 8. Nightly Reset

Someone forgot a mode that has no timer. Every night, everything should go back to normal.

**Entities:** `input_boolean.sleep_mode`

| Where | Setting | Value |
|---|---|---|
| New timer input | Trigger Time | 03:00:00 |
| New timer input | Target Activity | Reset |
| Reset activity | Additional Entities | `input_boolean.sleep_mode`, State: Off |

**Result:** At 03:00 the lights turn off, the running activity ends, and the sleep switch is cleared too, so motion works again.

---

### 9. Your Own Lamps Reach the Lux Sensor

The lux sensor can see your lamps. Once they are on, it reads above the threshold, new motion is blocked, and the light goes off although you are in the room.

| Where | Setting | Value |
|---|---|---|
| Triggers & Inputs → motion input | Ignore lux when scene active | on |

**Result:** The brightness check only decides whether the light comes *on*. While a Twilight scene runs, motion always counts and keeps the timer going. Once the light is off, the check applies again.

---

## Schedules

### 10. Motion Light Only at Night

The stairs should only light up after dark, regardless of what a lux sensor says.

| Where | Setting | Value |
|---|---|---|
| Motion activity → Channels / Slots | Primary | check only the dusk and night slots |

**Result:** During an unchecked slot the channel stays off, even though the activity runs. The first motion in a checked slot turns the light on; if the activity is still running when a checked slot begins, the light comes on with it.

---

### 11. Evening Scene That Waits in Winter

In December it is dark by 16:30, but the evening scenes are too dim that early.

| Where | Setting | Value |
|---|---|---|
| Slot Timetable → Edit Slots → Nautical dusk | Earliest start | 22:00 |

**Result:** All winter, the Civil dusk scene stays until 22:00, and the following slots keep their usual spacing after it. Summer evenings, when the sun is later anyway, don't change.

---

### 12. Dynamic Hue Scene for the Evening

The Hue scene "Sunset" should slowly rotate its colors in the evening, but stay calm late at night.

| Where | Setting | Value |
|---|---|---|
| Edit Slots → Civil dusk | Scene / Script | Sunset |
| Edit Slots → Civil dusk | Dynamic | On |
| Edit Slots → Civil dusk | Speed | Level 1 |
| Edit Slots → Night | Dynamic | Off |

**Result:** The colors rotate during Civil dusk. In a mixed room, lights that cannot rotate keep their scene color. At Night the scene is static.

> **Tip:** with **Hue**, the slot follows what is set for the scene in the Hue app.

---

### 13. Porch Light With Its Own Schedule

Motion in the hallway should also light the porch, but only from dusk to 23:00. The porch gets its own channel, so it follows its own times while sharing the hallway's sensor.

**Entities:** `scene.porch_on`

| Where | Setting | Value |
|---|---|---|
| Slot Timetable → **⋮** → Add channel | Name | Porch |
| Porch channel → first slot | Sun Event / Scene | Civil dusk / `scene.porch_on` |
| Porch channel → second slot | Fixed Time / Scene | 23:00 / none |

**Result:** Motion plays both channels. The porch only joins in between dusk and 23:00, and if it is on at 23:00, the empty slot turns it off.

> **Tip:** Twilight only switches lights while an activity runs, so the porch won't come on at dusk by itself. For that, let a Home Assistant automation turn on a helper at sunset, and use it as a binary input for an activity.

---

## Advanced

### 14. Presence Simulation While You Are Away

The house should look lived in during a vacation, based on how you really use the room.

**Entities:** `input_boolean.vacation`

| Where | Setting | Value |
|---|---|---|
| New binary input | Entities | `input_boolean.vacation` |
| New binary input | Target Activity | Vacation (new activity) |
| Vacation activity | Action Type | Presence Simulation |
| Vacation activity | Template Activity | Motion |
| Vacation activity | Heatmap Profile | Dynamic (last 30 days) |
| Vacation activity | Lux Mode | Only dusk–dawn |
| Vacation activity | Simulation Intensity | Normal (100% of history) |
| Vacation activity | Input Suppression | the motion input |
| Vacation activity | Enable Auto-Expire | off |
| Vacation activity | Release Action | Turn Off |

**Result:** While the switch is on, Twilight plays back the Motion activity at the times your room was really used, but only from dusk to dawn. The simulation survives a restart of Home Assistant.

> **Tip:** to use a fixed pattern, save a profile in the Activity Heatmap card and select it as the **Heatmap Profile**.

---

### 15. Add Ambient Lights With a Switch

The Ambient channel should join the Motion light in the evening, but only while a switch is on. New areas come with this Rule prepared.

**Entities:** `input_boolean.ambient`

| Where | Setting | Value |
|---|---|---|
| Motion activity → Channels / Slots | Ambient | nothing checked |
| Ambient Rule | Target Activity | Motion |
| Ambient Rule → Channels / Slots | Ambient | check the slots you want |
| Binary input | Entities | `input_boolean.ambient` |
| Binary input | Target Type / Target Rule | Rule / Ambient |

**Result:** Normally only the Primary channel reacts to motion. With the switch on, the Ambient channel plays along, and it changes right away, not only at the next motion. With the switch off, it goes off again while the rest stays on.

---

### 16. Keep the Light On During a Meeting

You sit still in a video call, the motion sensor goes quiet, and the light turns off.

**Entities:** `binary_sensor.office_in_a_meeting`

| Where | Setting | Value |
|---|---|---|
| New Rule | Target Activity | Motion |
| New Rule | Auto-Expire Behavior | Pause |
| New binary input | Entities | `binary_sensor.office_in_a_meeting` |
| New binary input | Target Type / Target Rule | Rule / the new Rule |

**Result:** While the meeting runs, the timer is frozen at its remaining time. Afterwards it continues from there. With **Restart** instead, you get the full duration after the meeting.

---

### 17. Trigger Twilight From an Automation

Another automation should start a button input, for example when you arrive home.

| Where | Setting | Value |
|---|---|---|
| Button input | Name | `welcome` |
| Button input | Target Activity | Manual |

```yaml
automation:
  - alias: Welcome home
    triggers:
      - trigger: state
        entity_id: person.alex
        to: home
    actions:
      - action: twilight.trigger_input
        data:
          area_id: living_room
          input_id: welcome
```

**Result:** The automation fires the button like a click in the panel. For a toggle button, add `active: true` or `active: false` to set its state.

> **Tip:** to skip the service call, turn on **Create HA entity** for the button. It then shows up as a `button.*` or `switch.*` entity for dashboards and voice assistants.
