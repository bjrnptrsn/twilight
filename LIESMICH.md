# Twilight für Home Assistant

<p align="center">
  <a href="https://github.com/bjrnptrsn/twilight/actions/workflows/validate.yaml">
    <img src="https://github.com/bjrnptrsn/twilight/actions/workflows/validate.yaml/badge.svg" alt="Validate (HACS + hassfest)">
  </a>
</p>

<p align="center">
  <img src="custom_components/twilight/brand/icon.png" alt="Twilight Logo" width="128">
</p>

<p align="center">
  <strong>Intelligente, sonnenbewusste Lichtsteuerung für dein Zuhause.</strong><br>
  Lass die Sonne den Zeitplan bestimmen — nicht deine Uhr.
</p>

<p align="center">
  <img src="assets/Timeline.png" alt="Twilight Timeline Showcase" width="100%">
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
  - [Rules](#rules)
- [Frontend-Tabs](#frontend-tabs)
  - [Areas](#areas-tab)
  - [Timeline](#timeline-tab)
  - [Analytics](#analytics-tab)
  - [Settings & Area-Template](#settings--area-template)
    - [Backup, Restore & Factory Reset](#backup-restore--factory-reset)
- [Services](#services)
- [Diagnostics](#diagnostics)
- [Fehlerbehebung](#fehlerbehebung)
  - [Debug-Logging](#debug-logging)
- [Bekannte Einschränkungen](#bekannte-einschränkungen)
- [Mitwirken](#mitwirken)
- [Lizenz](#lizenz)

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

Jeder Channel hat außerdem eine eigene **Slot-Übergangsdauer**
(Standard 60 s) — die Überblendzeit beim Wechsel von einem Slot zum
nächsten.

### Scenes

Twilight unterstützt verschiedene Scene-Quellen, zugewiesen pro Slot:

- **Normale Scenes** — Standard-Home-Assistant-Scenes, erstellt über die HA-UI oder `configuration.yaml`
- **Hue-Scenes** — Hue-Scenes von deiner Hue Bridge (benötigt die [Hue-Integration](https://www.home-assistant.io/integrations/hue/))
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
  ihren Lux-Schwellwert vergleichen.

### Inputs

**Inputs** sind die Event-Quellen, die eine Activity anfordern. Jeder Input
hat einen Namen und lässt sich in den Einstellungen verwalten.

| Input-Typ | Löst aus bei | Hinweise |
|------------|-------------|-------|
| **Motion** | Eine seiner `binary_sensor.*`/`device_tracker.*`-Entities wechselt zu `on`/`home` | Optionaler Lux-Schwellwert; Re-Trigger-Modus (Jeder Wechsel / Nur der erste Wechsel); optionales Lux-Beobachtungsfenster für erneute Versuche nach Blockade durch zu viel Licht |
| **Binary** | Eine/Alle/Anzahl seiner `binary_sensor.*`/`input_boolean.*`-Entities (konfigurierbare Aggregation) | Sendet beim Deaktivieren ein Release |
| **Event** | Statusänderung einer `event.*`-Entity, optional gefiltert auf einen Event-Typ | Feuert einmal pro passendem Event, kein Release |
| **Timer** | Eine tägliche feste Uhrzeit (`HH:MM:SS`) | Keine Entity nötig — nützlich für einen nächtlichen Reset |
| **Button** | Manuell über das Areas-Panel oder den Service `twilight.trigger_input` | Click-Modus feuert einmal; Toggle-Modus sendet beim zweiten Aufruf zusätzlich ein Release — siehe [Manuelle Auslöser](#manuelle-auslöser-button-inputs) |

Jeder Input zielt entweder auf eine **Activity** oder eine **Rule** (über
„Target Type”). Binary- und Toggle-Button-Inputs können frei wählen; Motion-,
Event-, Timer- und Click-Button-Inputs zielen immer auf eine Activity.

### Activities

Eine Activity besitzt die Lichter, solange sie aktiv ist — der Coordinator
lässt immer nur **eine Activity gleichzeitig** laufen; eine neue Anfrage
verdrängt sofort, was zuvor aktiv war.

| Option | Beschreibung |
|---|---|
| **Unterdrückte Inputs** | Liste von Inputs, die ignoriert werden, solange diese Activity aktiv ist (z. B. eine Schlaf-Activity, die den Bewegungsmelder-Input unterdrückt) |
| **Auto-Expire (Ablaufzeit)** | Zeitdauer (`HH:MM:SS`), nach der die Activity automatisch endet; leer = endet nur durch ein explizites Release |
| **Timer-Ablaufprüfung** | Was genau beim Ablauf des Timers passiert: Deaktiviert (endet immer), Lux-Schwellwert beachten (verlängert den Timer, wenn noch Bewegung vorhanden ist und der Lux-Check besteht), Lux-Schwellwert ignorieren (verlängert bei Bewegung unabhängig vom Lux-Wert). |

#### Actions & Release Actions

Was beim Start (Aktion) und beim Ende (Release-Aktion) tatsächlich mit den Lichtern passiert:

| Action-Typ | Effekt | Gilt für |
|---|---|---|
| **Zeitplan** (Standard) | Spielt die Szene des aktuellen Channels/Slots ab; erlaubt das gezielte Auswählen aktiver Channels und Slots | Aktion |
| **Entity/Script** | Aktiviert direkt eine ausgewählte Szene oder ein Script, unabhängig vom Zeitplan | Aktion |
| **Lichtsteuerung** | Steuert bestimmte Licht-Entities direkt — an/aus, Helligkeit, Farbtemperatur oder RGB — ganz ohne Szenen | Aktion |
| **Blockieren** | Tut nichts mit den Lichtern ("Block Only / No Action") | Aktion |
| **Ausschalten** | Schaltet alle Slot-Entities dieser Activity aus | Release (Standard) |
| **Reset-Befehl** | Sendet einen festen Befehl (`on`/`off`/`toggle`/`activate`) an von dir gewählte `input_boolean`-, `switch`- oder `script`-Entities — zum Ansteuern von etwas anderem als Lichtern | Aktion (keine Release-Phase) |
| **Anwesenheitssimulation** | Simuliert Anwesenheit, indem das Lichtverhalten einer ausgewählten Activity basierend auf historischen oder gespeicherten Bewegungsdichten abgespielt wird | Aktion |

Ist keine `action` konfiguriert, spielt eine Activity standardmäßig beim
Start die aktuelle Slot-Scene ab und schaltet beim Release alle ihre Lichter
aus.

#### Channel- und Slot-Auswahl

Bei der Zeitplan-Steuerung kannst du in der UI pro Channel und Slot auswählen, welche Abschnitte aktiv geschaltet werden. Ist ein Slot für einen Channel abgewählt, bleibt dieser Channel in dem entsprechenden Zeitraum aus.

#### Anwesenheitssimulation (Presence Simulation)

Activities mit Anwesenheitssimulation lassen ein leeres Zuhause bewohnt
wirken, indem sie realistische Lichtmuster nachbilden. Du wählst eine
vorhandene Activity aus (z. B. deine Standard-Bewegungs-Activity), deren
Lichtverhalten und Dauer übernommen werden, und Twilight löst sie anhand der
Bewegungsdichte-Wahrscheinlichkeit über den Tagesverlauf aus:

- **Datenquelle**: entweder ein rollierendes 30-Tage-Fenster der Live-Recorder-Historie
  auswerten oder eines von bis zu **5 gespeicherten Heatmap-Profilen** pro Area
  wählen (gespeichert über die Heatmap-Karte, dort wählst du Zeitraum
  `1w`–`6m` und Auflösung).
- **Lux-Gating**: legt fest, wann simuliertes Licht angehen darf —
  Dämmerung/Nacht (Standard), Beleuchtungsstärke-Schwellwert oder immer.
- **Geeignete Activities**: jede Activity, die Lichter steuert (Zeitplan, Entity, Licht).

#### Standard-Activities

Vier Activities sind bei jeder neuen Area vorkonfiguriert (aus dem
Standard-[Area-Template](#settings--area-template)):

- **`motion`** — ausgelöst durch den `motion`-Input, `auto_expire: 00:05:00`, `expire_check_mode: respect_lux`
- **`manual`** — ausgelöst durch einen manuellen Override-Input, unterdrückt `motion` solange sie aktiv ist, `auto_expire: 00:00:00` (nur explizites Release)
- **`sleep`** — ausgelöst durch den `binary`-Input, unterdrückt `motion` solange sie aktiv ist, `auto_expire: 03:00:00` (nächtliches Sicherheitsnetz)
- **`reset`** — ausgelöst durch einen Button-Input, führt eine `reset`-Action aus (keine Lichtsteuerung)

Bearbeite oder ersetze sie über das Area-Template, und füge eigene für alles
andere hinzu — einen `guest`-Modus, weitere Motion-Inputs mit
unterschiedlichen Lux-Schwellwerten und so weiter.

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

### Rules

**Rules** sind eine temporäre, parallele Override-Ebene: Solange ein
Auslöser-Input (ein Schalter oder Toggle-Button) aktiv ist, verändern aktive
Rules das Verhalten der aktuell laufenden Activity oder Konfiguration — sie
steuern aber nie von sich aus Lichter. Anders als Activities (immer nur eine
gleichzeitig aktiv) können beliebig viele Rules parallel aktiv sein.

Aktuell gibt es einen Rule-Typ:

| Rule-Typ | Überschreibt | Auslöser & Bedingung |
|---|---|---|
| **Activity Rule** | Die Channel- und Slot-Auswahl einer Ziel-Activity | Ausgelöst durch Binary- oder Toggle-Button-Input; wirkt nur, wenn die Ziel-Activity aktiv ist |

Eine **Activity Rule** wirkt auf genau eine Activity. Solange sie aktiv ist,
überschreibt ihre Einstellung die der Ziel-Activity: **Was in der Rule angehakt ist, gilt.**
Sind mehrere Rules für dieselbe Activity aktiv, gilt „Exclude gewinnt” — ein Slot
ist für einen Kanal nur dann aktiv, wenn er in allen aktiven Rules angehakt ist.

Eine Activity Rule kann zusätzlich optional steuern, was mit dem
**Auto-Expire**-Countdown der Ziel-Activity passiert, solange die Rule aktiv
ist ("Auto-Expire-Verhalten"):

| Modus | Effekt |
|---|---|
| **Keine** (Standard) | Kein Eingriff — der Timer läuft unbeeinflusst weiter. |
| **Pausieren** | Friert den Timer bei der aktuellen Restzeit ein; läuft nach Rule-Ende mit genau dieser Restzeit weiter. |
| **Aufheben** | Friert den Timer bei null ein; die Activity läuft sofort nach Rule-Ende ab (außer eine andere Bedingung, z. B. aktive Bewegung, hält sie weiterhin aktiv). |
| **Neustart** | Friert den Timer bei der vollen konfigurierten Dauer ein; die Activity bekommt nach Rule-Ende einen frischen vollen Timer. |

Eine Rule kann außerdem, solange sie aktiv ist, andere Inputs unterdrücken —
z. B. eine „Ambient"-Rule, die für ihre Dauer den Bewegungsmelder-Input
ignoriert. Solange eine passende Rule aktiv ist, ersetzen ihre unterdrückten Inputs
die Input-Unterdrückungen der Ziel-Activity. Unterdrückte Inputs reagieren bis zum
Ende der Rule nicht mehr auf Auslöser — dasselbe Deaktivierungs-Prinzip wie bei der
[Input-Unterdrückung einer Activity](#activities), nur an die Rule gebunden. Eine Rule
kann nicht den Input unterdrücken, der sie selbst auslöst.

Rules werden über die **Rules**-Karte in der Detailansicht einer Area oder im
[Area-Template](#settings--area-template) konfiguriert.

---

## Frontend-Tabs

Twilight liefert ein vollständiges, Lit-basiertes Sidebar-Panel — nach der
Ersteinrichtung ist kein YAML-Editing mehr nötig.

### Areas-Tab

Übersichtskarten (mit Sparkline-Tagesverlauf und Live-Statistiken pro Area)
plus eine Detailansicht pro Area für die gesamte oben beschriebene
Konfiguration: Channels, Sensoren, Inputs, Activities, eine Activity-Heatmap-Karte
(Visualisierung von Wochentagsmustern aus Live-Recorder-Daten oder bis zu **5 gespeicherten
Heatmap-Profilen**) sowie eine Live-Status-Karte, die die aktuell aktive Activity und ihren
Auslöser zeigt. Neue Areas bleiben ein lokaler, ungespeicherter Entwurf, bis du auf **Save**
klickst.

<p align="center">
  <img src="assets/Areas.png" alt="Twilight Areas Tab" width="100%">
</p>

### Timeline-Tab

- **Tagesansicht** — der Sonnenverlauf durch die heutigen astronomischen Zonen, mit Live-Zeitanzeige
- **Jahresansicht** — dieselben Zonen über das ganze Jahr geplottet, damit du siehst, wie sich die Slot-Dauern mit den Jahreszeiten verschieben
- **Area-Auswahl** — Vorschau flächenspezifischer Slot-Offsets des primären Channels auf beiden Diagrammen
- Enthält einen Demo-Modus mit Beispielstandorten, unabhängig von einer konfigurierten Area

<p align="center">
  <img src="assets/Timeline.png" alt="Twilight Timeline Tab" width="100%">
</p>

### Analytics-Tab

uPlot-Charts auf Basis echter Home-Assistant-Recorder-Daten — zwei Y-Achsen,
ein Zeitraum-Selektor und pro Area Bewegung als Hintergrundbänder dargestellt,
damit du Lichtänderungen mit tatsächlicher Sensoraktivität abgleichen kannst.

### Settings & Area-Template

Die **Area-Template**-Einstellung ist die Vorlage, mit der jede *neue* Area
vorbefüllt wird: ihre Standard-Inputs (Motion, manueller Override, Reset, ein
Binary-Sleep-Trigger, ein manueller Auslöse-Button), Standard-Activities
(`motion`, `manual`, `sleep`, `reset`), Standard-[Rules](#rules),
Standard-Custom-Channels sowie die Standard-Slots des Primary-Channels
(Offsets und Szenen pro Zone). Einmal in den **Settings** bearbeitet, startet jede danach
angelegte Area vorverkabelt statt leer — bestehende Areas bleiben unberührt. Ein
granularer **Reset to System Defaults**-Dialog erlaubt es, einzelne
Inputs/Activities/Rules/Channels wiederherzustellen, ohne das ganze Template
zurückzusetzen.

<p align="center">
  <img src="assets/Settings.png" alt="Twilight Settings Tab" width="100%">
</p>

### Backup, Restore & Factory Reset

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

Innerhalb des Backup & Restore-Dialogs steht außerdem die Funktion **Factory Reset**
zur Verfügung. Damit lässt sich Twilight nach einer expliziten Sicherheitsabfrage
vollständig auf den ursprünglichen Werkszustand zurücksetzen (alle Areas löschen
und Einstellungen/Templates zurücksetzen).

---

## Services

### `twilight.trigger_input`

Löst einen `button`-Input aus einer Automation oder einem Script aus oder
gibt ihn frei — ganz ohne echte HA-Entity dafür.

| Feld | Erforderlich | Beschreibung |
|-------|----------|--------------|
| `area_id` | Ja | Die Home-Assistant-Area, die den Input enthält |
| `input_id` | Ja | Die `id` oder der Name des Button-Inputs (sichtbar in der Inputs-Liste) |
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

> [!NOTE]
> Die Datei enthält deine echten Entity-IDs, Scene-Namen und Area-Namen —
> nichts Geheimes (keine Tokens oder Zugangsdaten), aber potenziell
> aufschlussreich über dein Zuhause. Vor dem Anhängen an ein öffentliches
> GitHub-Issue kurz durchsehen.

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

### Debug-Logging

**Einstellungen → Geräte & Dienste → Integrationen → Twilight** öffnen, im
Drei-Punkte-Menü **Debug-Protokollierung aktivieren** wählen. Kein Neustart
nötig — gilt nur bis zum nächsten Neustart.

Beim Melden eines Bugs idealerweise das vollständige Log teilen. Wer keine
unbeteiligten Daten weitergeben möchte, kann es auf Twilights Einträge
filtern:

```bash
grep 'twilight' home-assistant.log > twilight.log
```

Der [Diagnostics-Download](#diagnostics) ist bei Konfigurations-/Zustandsfragen
meist hilfreicher — Debug-Logging lohnt sich, wenn du die tatsächlichen
Entscheidungen Event für Event sehen willst (warum eine Activity nicht
ausgelöst hat, warum ein Retry gefeuert hat, etc.).

## Bekannte Einschränkungen

- Nur ein Beleuchtungsstärke-Sensor pro Area (mehrere Entities können jedoch in ihn einfließen)
- Noch keine Mehrsprachigkeit (nur Englisch)

## Mitwirken

Einen Bug gefunden oder eine Idee? [Ein Issue öffnen](https://github.com/bjrnptrsn/twilight/issues) auf GitHub.

## Lizenz

MIT License
