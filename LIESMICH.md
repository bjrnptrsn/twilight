# Twilight für Home Assistant

<p align="center">
  <img src="custom_components/twilight/brand/icon.png" alt="Twilight Logo" width="128">
</p>

<p align="center">
  <strong>Intelligente, sonnenbewusste Lichtsteuerung für dein Zuhause.</strong><br>
  Lass die Sonne den Zeitplan bestimmen — nicht deine Uhr.
</p>

<p align="center">
  🌅 10 astronomische Zonen pro Area — von der Dämmerung bis zur Nacht.<br>
  🔄 Mehrere Kanäle pro Area — getrennte Lichtgruppen, unabhängige Zeitpläne.<br>
  🧠 Input-gesteuerte Activities — Bewegung, Binärsensoren, Timer, Buttons, Events.<br>
  🎯 Szenenbasierte Ausführung — normale Scenes, Hue-Scenes, Scripts.<br>
  📊 Eingebaute Analyse — uPlot-Charts mit echten Recorder-Daten.<br>
  🕸️ Vollständige Web-UI — nach der Einrichtung keine YAML-Konfiguration mehr nötig.
</p>

> [!CAUTION]
> **Experimentell** — funktionsfähig, aber nicht feature-complete und noch nicht für den
> langfristigen produktiven Einsatz validiert. Das Konfigurationsmodell ändert sich noch;
> rechne mit Breaking Changes zwischen Versionen ohne Migrationspfad. Am besten geeignet für
> Bastler und frühe Anwender.
> Feedback willkommen über [GitHub Issues](https://github.com/bjrnptrsn/twilight/issues).

---

## Inhaltsverzeichnis

- [Warum es das gibt](#warum-es-das-gibt)
- [Voraussetzungen](#voraussetzungen)
- [Schnellstart](#schnellstart)
- [Installation](#installation)
- [Grundkonzept](#grundkonzept)
  - [Areas](#areas)
  - [Kanäle & Slots](#kanäle--slots)
  - [Scenes](#scenes)
- [Inputs & Activities](#inputs--activities)
  - [Sensoren](#sensoren)
  - [Inputs](#inputs)
  - [Activities](#activities)
    - [Actions & Release Actions](#actions--release-actions)
  - [Manuelle Auslöser (Button-Inputs)](#manuelle-auslöser-button-inputs)
- [Frontend-Tabs](#frontend-tabs)
  - [Areas](#areas-tab)
  - [Timeline](#timeline-tab)
  - [Analytics](#analytics-tab)
  - [Settings & Area-Template](#settings--area-template)
    - [Backup & Restore](#backup--restore)
- [Services](#services)
- [Diagnostics](#diagnostics)
- [Fehlerbehebung](#fehlerbehebung)
- [Bekannte Einschränkungen](#bekannte-einschränkungen)

---

## Warum es das gibt

Home Assistant kann Lichter ein- und ausschalten, aber Lichtszenen an den
Sonnenstand anzupassen — astronomische Dämmerung, bürgerliche Dämmerung,
goldene Stunde — erfordert immer noch komplexe Automationen, Templates und
manuelle Zeitpläne.

**Twilight ersetzt das alles** durch eine einzige Integration. Du definierst
Areas, jede mit sonnenausgerichteten Zeit-Slots und optionalen
Bewegungs-/Input-Overrides, und Twilight übernimmt die Übergänge. Keine
Template-Sensoren. Kein Scene-zu-Zeit-Abgleich. Keine Automations-Spaghetti.

## Voraussetzungen

- Home Assistant 2025.5 oder neuer

## Schnellstart

1. **Installieren** — Integration kopieren (siehe [Installation](#installation))
2. **Home Assistant neu starten**
3. **Konfigurieren** — `twilight:` in `configuration.yaml` eintragen und erneut neu starten
4. **Öffnen** — das Twilight-Panel in der Seitenleiste öffnen
5. **Area anlegen** — eine HA-Area auswählen, Lichter den Kanälen zuweisen
6. **Scenes zuweisen** — deine Scenes den astronomischen Zeit-Slots zuordnen
7. **Inputs hinzufügen** — Bewegungsmelder, Buttons oder Timer anbinden, um Activities auszulösen

## Installation

### Manuelle Installation

1. Kopiere das Verzeichnis `custom_components/twilight` in den `config/custom_components/`-Ordner deiner HA-Installation:

   ```bash
   cp -r custom_components/twilight /path/to/homeassistant/config/custom_components/
   ```

2. **Home Assistant neu starten.**
3. Folgendes in `configuration.yaml` eintragen:

   ```yaml
   twilight:
   ```

4. **Home Assistant** erneut **neu starten**.
5. Seitenleiste öffnen und auf **Twilight** klicken, um das Panel zu starten.

> [!WARNING]
> Die Zeile `twilight:` in `configuration.yaml` ist erforderlich — sie aktiviert
> die Integration. Die gesamte Konfiguration erfolgt danach im Sidebar-Panel.

### Erste Area einrichten

1. Das **Twilight**-Panel in der Seitenleiste öffnen
2. Auf **„Add Area"** klicken und eine deiner Home-Assistant-Areas auswählen
3. Twilight legt automatisch 10 astronomische Zeit-Slots an, ausgerichtet auf den Sonnenstand deines Standorts, plus einen Standardsatz an Inputs/Activities aus dem [Area-Template](#settings--area-template)
4. Im Bereich **Channels** deine Licht-Entities dem Primary-Channel zuweisen
5. Für jeden Zeit-Slot eine Scene oder ein Script auswählen, das in diesem Zeitraum laufen soll
6. Auf **Save** klicken — die Engine startet sofort

![Areas Overview](docs/screenshots/areas-overview.png)

---

## Grundkonzept

Jede aktivierte **Area** durchläuft dieselbe Pipeline: Sensoren speisen
Inputs, Inputs fordern Activities an, und immer genau eine Activity steuert
zur gleichen Zeit die Lichter auf jedem Kanal.

```
Sensoren  →  Inputs  →  Coordinator (eine active_activity)  →  Action  →  Kanäle/Slots  →  Lichter
```

**Keine aktive Activity → Lichter sind aus.** Ein Zeit-Slot entscheidet nur,
*welche Scene laufen würde* — der Zeitplan allein schaltet nie etwas ein.
Etwas muss zuerst eine Activity anfordern (Bewegung, ein Button, ein Timer,
…). Das ist der häufigste Stolperstein beim Einrichten einer neuen Area: Wenn
nichts reagiert, prüfe, ob wirklich ein Input konfiguriert ist, der die
`motion`-/`manual`-Activity auslöst — nicht ob dem Slot eine Scene zugewiesen
ist.

### Areas

Jede **Area** entspricht einer Home-Assistant-Area. Du konfigurierst ihre
Lichtgruppen (Channels), Sensoren, Inputs und Activities unabhängig
voneinander. Pro aktivierter Area läuft eine eigene Engine, sodass
unterschiedliche Räume völlig unterschiedliche Logik haben können.

### Kanäle & Slots

Jede Area hat einen **Primary Channel** mit 10 fixen astronomischen Slots:

`Nacht → Astronomische Dämmerung → Nautische Dämmerung → Bürgerliche Dämmerung → Goldene Dämmerung → Tag → Goldene Abenddämmerung → Bürgerliche Abenddämmerung → Nautische Abenddämmerung → Astronomische Abenddämmerung`

Ihre Reihenfolge und astronomische Zone sind fest — bearbeiten kannst du nur
die zugewiesene Scene/das Script pro Slot sowie einen Offset in Minuten.

Du kannst bis zu **3 Custom Channels** pro Area hinzufügen, jeder mit einer
frei definierbaren Slot-Liste, um eine separate Lichtgruppe nach eigenem
Zeitplan zu steuern — bei gemeinsam genutzten Sensoren und Inputs (z. B.
Außenlicht, das nicht demselben Verlauf folgt wie deine Innenbeleuchtung).
Jeder Custom-Slot startet entweder zu einem **Sonnenereignis** (beliebige
astronomische Zone, mit Offset) oder zu einer **festen Uhrzeit** (`HH:MM`) und
hat eine eigene Scene-/Script-Zuweisung.

| Channel-Typ | Slots | Anwendungsfall |
|--------------|-------|----------|
| **Primary** | 10 fixe astronomische Zonen | Haupt-Innenbeleuchtung — folgt der Sonne |
| **Custom** (bis zu 3) | Frei definierbar — Sonnenereignis oder feste Zeit + Offset | Außenlicht, Akzentbeleuchtung, separate Zeitpläne |

### Scenes

Twilight unterstützt verschiedene Scene-Quellen, zugewiesen pro Slot:

- **Normale Scenes** — Standard-Home-Assistant-Scenes, erstellt über die HA-UI oder `configuration.yaml`
- **Hue-Scenes** — Hue Smart Scenes von deiner Hue Bridge (benötigt die [Hue-Integration](https://www.home-assistant.io/integrations/hue/))
- **Scripts** — jedes Home-Assistant-Script, das Lichter steuern kann

---

## Inputs & Activities

### Sensoren

Sensoren sind passive Messwerte ohne garantiertes Event bei jeder Änderung —
sie unterstützen Inputs, statt selbst Activities auszulösen. Aktuell
unterstützt Twilight einen Sensor-Typ:

- **Beleuchtungsstärke (Lux)** — einer pro Area. Füge eine oder mehrere
  `sensor.*`-Entities hinzu; bei mehreren werden ihre Werte über eine
  **Aggregations**-Methode kombiniert: Minimum (Standard), Maximum,
  Durchschnitt oder Median. Der aggregierte Wert ist das, womit Motion-Inputs
  ihren `lux_threshold` vergleichen.

### Inputs

**Inputs** sind die Event-Quellen, die eine Activity anfordern. Jeder Input
hat eine stabile `id`, über die er von `suppress_inputs` einer Activity
referenziert werden kann.

| Input-Typ | Löst aus bei | Hinweise |
|------------|-------------|-------|
| **Motion** | Eine seiner `binary_sensor.*`/`device_tracker.*`-Entities wechselt zu `on`/`home` | Optionales `lux_threshold`-Gate; `retrigger`-Modus (`every` = jeder Entity-Wechsel triggert erneut, `first` = nur die erste aktiv werdende Entity); optionales `lux_watch_window` für erneute Versuche nach Blockade durch zu viel Licht |
| **Binary** | Any/all/majority/count seiner `binary_sensor.*`/`input_boolean.*`-Entities (konfigurierbare `aggregation`) | Sendet `activity_released` beim umgekehrten Übergang |
| **Event** | Statusänderung einer `event.*`-Entity, optional gefiltert auf einen `event_type` | Feuert einmal pro passendem Event, kein Release |
| **Timer** | Eine tägliche feste Uhrzeit (`HH:MM:SS`) | Keine Entity nötig — nützlich für einen nächtlichen Reset |
| **Button** | Manuell über das Areas-Panel oder den Service `twilight.trigger_input` | `click`-Modus feuert einmal; `toggle`-Modus sendet beim zweiten Aufruf zusätzlich ein Release — siehe [Manuelle Auslöser](#manuelle-auslöser-button-inputs) |

Jeder Input ist genau einer **Activity** zugeordnet. Mehrere Inputs desselben
Typs sind pro Area erlaubt (z. B. zwei unabhängige Motion-Inputs mit
unterschiedlichen Lux-Schwellwerten für unterschiedliche Activities).

### Activities

Eine Activity besitzt die Lichter, solange sie aktiv ist — der Coordinator
lässt immer nur **eine Activity gleichzeitig** laufen; eine neue Anfrage
verdrängt sofort, was zuvor aktiv war.

| Option | Beschreibung |
|---|---|
| `suppress_inputs` | Liste von Input-`id`s, die ignoriert werden, solange diese Activity aktiv ist (z. B. eine `sleep`-Activity, die den `motion`-Input unterdrückt) |
| `auto_expire` | `HH:MM:SS`, nach der die Activity automatisch endet; `00:00:00`/leer = endet nur durch ein explizites Release |
| `expire_check_mode` | Was genau beim Ablauf des Timers passiert: `disabled` (endet immer), `respect_lux` (verlängert den Timer, wenn ein Motion-Input noch aktiv ist *und* sein Lux-Check besteht), `ignore_lux` (verlängert unabhängig vom Lux-Wert) |

#### Actions & Release Actions

Was beim Start (`action`) und beim Ende (`release_action`) tatsächlich mit den Lichtern passiert:

| Action-Typ | Effekt | Gilt für |
|---|---|---|
| `slot` (Standard) | Spielt die Scene des aktuellen Channel-/Slot ab; unterstützt `excluded_slot_ids`, um bestimmte Channels in bestimmten Slots erzwungen auszuschalten | Action |
| `entity` | Aktiviert direkt eine ausgewählte Scene oder ein Script, unabhängig vom Zeitplan | Action |
| `light` | Steuert bestimmte Licht-Entities direkt — an/aus, Helligkeit, Farbtemperatur oder RGB — ganz ohne Scenes | Action |
| `none` | Tut nichts mit den Lichtern | Action / Release |
| `turn_off` | Schaltet alle Slot-Entities dieser Activity aus | Release (Standard) |
| `reset` | Sendet einen festen Befehl (`on`/`off`/`toggle`/`activate`) an von dir gewählte `input_boolean`-, `switch`- oder `script`-Entities — zum Ansteuern von etwas anderem als Lichtern, z. B. das Zurücksetzen eines Helpers | Action (keine Release-Phase) |
| `simulation` | Führt eine Anwesenheitssimulation aus | Action |

Ist keine `action` konfiguriert, spielt eine Activity standardmäßig beim
Start die aktuelle Slot-Scene ab und schaltet beim Release alle ihre Lichter
aus.

Zwei Activities sind bei jeder neuen Area vorkonfiguriert:

- **`presence`** — ausgelöst durch einen `motion`-Input, `auto_expire: 00:01:45`, `expire_check_mode: respect_lux`
- **`sleep`** *(oder ähnlich, abhängig vom Binary-Input in deinem Template)* — ausgelöst durch einen `binary`-Input, unterdrückt `motion` solange sie aktiv ist

Füge eigene für alles andere hinzu — eine `manual`-Activity von einem
Lichtschalter, die Motion unterdrückt, einen `guest`-Modus, einen nächtlichen
`reset` und so weiter.

### Manuelle Auslöser (Button-Inputs)

Button-Inputs benötigen keine HA-Entity — sie werden direkt über das
Areas-Panel ausgelöst, oder aus einer Automation über den Service
`twilight.trigger_input` (siehe [Services](#services)). Zwei Modi:

- **Click** — feuert einmal, Fire-and-Forget (z. B. ein „Reset"-Button im Dashboard)
- **Toggle** — verfolgt einen An/Aus-Zustand, live ans Frontend übermittelt

Optional lässt sich **Create Entity** an einem Button-Input aktivieren, um
ihn zusätzlich als echte Home-Assistant-Entity bereitzustellen: Der
`click`-Modus erzeugt eine `button.*`, der `toggle`-Modus eine `switch.*`.
Nützlich, wenn du ihn von einer physischen Dashboard-Kachel, einem
Sprachassistenten oder einer anderen Automation aus auslösen willst, ohne den
Service-Call zu nutzen.

---

## Frontend-Tabs

Twilight liefert ein vollständiges, Lit-basiertes Sidebar-Panel — nach der
Ersteinrichtung ist kein YAML-Editing mehr nötig.

### Areas-Tab

Übersichtskarten (mit Sparkline-Tagesverlauf und Live-Statistiken pro Area)
plus eine Detailansicht pro Area für die gesamte oben beschriebene
Konfiguration: Channels, Sensoren, Inputs, Activities sowie eine
Live-Status-Karte, die die aktuell aktive Activity und ihren Auslöser zeigt.
Neue Areas bleiben ein lokaler, ungespeicherter Entwurf, bis du auf **Save**
klickst.

### Timeline-Tab

- **Tagesansicht** — der Sonnenverlauf durch die heutigen astronomischen Zonen, mit Live-Zeitanzeige
- **Jahresansicht** — dieselben Zonen über das ganze Jahr geplottet, damit du siehst, wie sich die Slot-Dauern mit den Jahreszeiten verschieben
- Enthält einen Demo-Modus mit Beispielstandorten, unabhängig von einer konfigurierten Area

![Timeline View](docs/screenshots/timeline-view.png)

### Analytics-Tab

uPlot-Charts auf Basis echter Home-Assistant-Recorder-Daten — zwei Y-Achsen,
ein Zeitraum-Selektor und pro Area Bewegung als Hintergrundbänder dargestellt,
damit du Lichtänderungen mit tatsächlicher Sensoraktivität abgleichen kannst.

### Settings & Area-Template

Zwei Arten von Einstellungen:

- **Globale Einstellungen** — aktuell nur die **Slot-Übergangsdauer**
  (Standard 60 s, die Überblendzeit beim Wechsel von einem astronomischen
  Slot zum nächsten). Gilt für jede Area, sofern nicht pro Input/Activity
  über deren eigenen `const.py`-Default überschrieben.
- **Area-Template** — die Vorlage, mit der jede *neue* Area vorbefüllt wird:
  ihre Standard-Inputs (Motion, manueller Override, Reset, ein
  Binary-Sleep-Trigger, ein manueller Auslöse-Button), Standard-Activities
  (`presence`, eine unterdrückende Override-Activity, `reset`) sowie
  Standard-Custom-Channels. Einmal in den **Settings** bearbeitet, startet
  jede danach angelegte Area vorverkabelt statt leer — bestehende Areas
  bleiben unberührt. Ein granularer **Reset to System Defaults**-Dialog
  erlaubt es, einzelne Inputs/Activities/Channels wiederherzustellen, ohne
  das ganze Template zurückzusetzen.

### Backup & Restore

Der Button **Backup & Restore** in der Settings-Fußleiste lädt einen
vollständigen Snapshot des Stores herunter — globale Einstellungen,
Area-Template und die Konfiguration jeder Area (kein Laufzeitzustand) — als
einzelne JSON-Datei, und kann auch daraus wiederherstellen.

Ein Restore **ersetzt die aktuelle Konfiguration vollständig**: Areas, die
nicht in der Backup-Datei enthalten sind, werden gelöscht, und alle
laufenden Engines werden sofort abgebaut und aus der importierten
Konfiguration neu aufgesetzt — kein Neustart von Home Assistant nötig. Vor
jedem destruktiven Restore erscheint ein Bestätigungsdialog. Bereits
eingeschaltete Lichter behalten ihren letzten Zustand bis zum nächsten
regulären Slot-/Activity-Wechsel — beim Restore selbst wird nichts
zwangsweise umgeschaltet.

---

## Services

### `twilight.trigger_input`

Löst einen `button`-Input aus einer Automation oder einem Script aus oder
gibt ihn frei — ganz ohne echte HA-Entity dafür.

| Feld | Erforderlich | Beschreibung |
|-------|----------|--------------|
| `area_id` | Ja | Die Home-Assistant-Area, die den Input enthält |
| `input_id` | Ja | Die `id` des Button-Inputs (sichtbar in der Inputs-Liste) |
| `active` | Nein | Für Buttons im `toggle`-Modus: `true`/`false`, um den Zustand explizit zu setzen |

```yaml
service: twilight.trigger_input
data:
  area_id: living_room
  input_id: reset_btn
```

## Diagnostics

Lade einen vollständigen Diagnose-Snapshot über **Settings → Devices &
Services → Twilight → ⋮ → Download diagnostics** in Home Assistant herunter.
Er enthält den aktuellen Store (alle Areas + globale Einstellungen) sowie pro
Area den Live-Run-State, die aufgelöste Scene-Map (welche Entity in welchem
Slot läuft) und den letzten bekannten Zustand jedes gesteuerten Lichts —
nützlich beim Melden eines Bugs.

---

## Fehlerbehebung

| Problem | Lösung |
|---------|--------|
| Panel zeigt „Engine not running" | Sicherstellen, dass `twilight:` in `configuration.yaml` steht und HA neu gestartet wurde |
| Lichter gehen nie an | Keine Activity ist aktiv — prüfen, ob wirklich ein Input mit einer Activity verknüpft ist; dass ein Slot eine Scene zugewiesen hat, reicht nicht, siehe [Grundkonzept](#grundkonzept) |
| Scene zeigt keine Lichter | Prüfen, ob die Scene noch existiert und erreichbar ist; falls es eine Hue Smart Scene ist, sicherstellen, dass die Hue-Integration geladen ist |
| Bewegungsmelder reagieren nicht | Den Lux-Schwellwert im Motion-Input prüfen — er kann durch zu viel Umgebungslicht unterdrückt sein; den aggregierten Lux-Wert auf der Status-Karte der Area prüfen |
| Lichter blinken beim Neustart | Das sollte nicht passieren — Twilight nutzt Boot-Catch-up, um ungewolltes Einschalten zu vermeiden. Bitte [ein Issue öffnen](https://github.com/bjrnptrsn/twilight/issues) |
| Area erscheint nicht im Panel | Sicherstellen, dass die HA-Area existiert und mindestens eine Licht-Entity zugewiesen ist |

## Bekannte Einschränkungen

- Nur ein Beleuchtungsstärke-Sensor pro Area (mehrere Entities können jedoch in ihn einfließen)
- Noch keine Mehrsprachigkeit (nur Englisch)
