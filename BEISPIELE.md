# Beispielkonfigurationen

Praxisnahe Szenarien, nach Komplexität sortiert. Jedes Beispiel beschreibt die Situation und nennt **nur die Einstellungen, auf die es ankommt** — alles andere bleibt beim Standard. Alles wird im Twilight-Panel eingerichtet, und neue Areas bringen die hier verwendeten Standard-Inputs und -Activities schon mit.

Wie alles zusammenspielt, steht in [So funktioniert Twilight](SO_FUNKTIONIERT_ES.md).

- [Grundlagen](#grundlagen) — ein Sensor, ein Raum
  - [1. Licht bei Bewegung](#1-licht-bei-bewegung)
  - [2. Nur wenn es dunkel ist](#2-nur-wenn-es-dunkel-ist)
  - [3. Ein Raum ohne Tageslicht](#3-ein-raum-ohne-tageslicht)
- [Alltag](#alltag) — Schalter, Modi und Resets
  - [4. Zwei Bewegungsmelder in einem Raum](#4-zwei-bewegungsmelder-in-einem-raum)
  - [5. Wandschalter für An und Aus](#5-wandschalter-für-an-und-aus)
  - [6. Schlafmodus](#6-schlafmodus)
  - [7. Filmabend](#7-filmabend)
  - [8. Nächtlicher Reset](#8-nächtlicher-reset)
  - [9. Deine eigenen Lampen erreichen den Lux-Sensor](#9-deine-eigenen-lampen-erreichen-den-lux-sensor)
- [Zeitpläne](#zeitpläne) — die Slots für dich arbeiten lassen
  - [10. Licht bei Bewegung nur nachts](#10-licht-bei-bewegung-nur-nachts)
  - [11. Abend-Scene, die im Winter wartet](#11-abend-scene-die-im-winter-wartet)
  - [12. Dynamische Hue-Scene für den Abend](#12-dynamische-hue-scene-für-den-abend)
  - [13. Verandalicht mit eigenem Zeitplan](#13-verandalicht-mit-eigenem-zeitplan)
- [Fortgeschritten](#fortgeschritten) — Simulation, Rules und Automationen
  - [14. Anwesenheitssimulation, während du weg bist](#14-anwesenheitssimulation-während-du-weg-bist)
  - [15. Ambient-Lichter per Schalter dazunehmen](#15-ambient-lichter-per-schalter-dazunehmen)
  - [16. Licht während eines Meetings anlassen](#16-licht-während-eines-meetings-anlassen)
  - [17. Twilight aus einer Automation auslösen](#17-twilight-aus-einer-automation-auslösen)

---

## Grundlagen

### 1. Licht bei Bewegung

Ein Flurlicht, das angeht, wenn du durchläufst, und der Sonne folgt: tagsüber hell, nachts gedimmt.

**Entities:** `binary_sensor.flur_bewegung`

| Wo | Einstellung | Wert |
|---|---|---|
| Slot-Zeitplan → Slots bearbeiten | Scene pro Slot | deine Scenes, z. B. hell für Tag, gedimmt für Nacht |
| Auslöser & Eingänge → Bewegungs-Input | Entitäten | `binary_sensor.flur_bewegung` |
| Auslöser & Eingänge → Bewegungs-Input | Ziel-Aktivität | Motion |

**Ergebnis:** Bewegung spielt sofort die Scene des aktuellen Slots. Die Standard-Activity Motion läuft 5 Minuten, und jede neue Bewegung startet den Timer neu. Bleibt der Raum ruhig, geht das Licht aus.

> **Tipp:** Die Lichter werden aus deinen Scenes gelesen, du musst also nichts weiter zuweisen.

---

### 2. Nur wenn es dunkel ist

Dasselbe Licht, aber es soll aus bleiben, solange genug Tageslicht da ist.

**Entities:** `sensor.flur_helligkeit`

| Wo | Einstellung | Wert |
|---|---|---|
| Sensoren | Helligkeitssensor | `sensor.flur_helligkeit` |
| Auslöser & Eingänge → Bewegungs-Input | Lux-Schwellenwert (lx) | 20 |

**Ergebnis:** Bewegung löst nur bei 20 lx oder weniger aus. Ist der Raum heller, prüft Twilight noch für die Dauer der **Lux-Beobachtung** weiter (Standard: 10 Sekunden), sodass eine vorbeiziehende Wolke das Licht trotzdem einschalten kann.

> **Tipp:** Der Schwellenwert ist Geschmackssache. Schau dir den Wert deines Sensors in Home Assistant in dem Moment an, in dem du das Licht gern hättest.

---

### 3. Ein Raum ohne Tageslicht

Ein Bad ohne Fenster. Ob draußen Tag ist, sagt hier nichts aus.

| Wo | Einstellung | Wert |
|---|---|---|
| Sensoren | Helligkeitssensor | keiner |

**Ergebnis:** Ohne Helligkeitssensor gibt es keine Helligkeitsprüfung, Bewegung löst also immer aus. Die Slots entscheiden weiter über die Scene: tagsüber hell, nachts gedimmt.

---

## Alltag

### 4. Zwei Bewegungsmelder in einem Raum

Ein langer Raum mit einem Melder an jedem Ende.

**Entities:** `binary_sensor.kueche_bewegung_tuer`, `binary_sensor.kueche_bewegung_fenster`

| Wo | Einstellung | Wert |
|---|---|---|
| Auslöser & Eingänge → Bewegungs-Input | Entitäten | beide Melder |

**Ergebnis:** Jeder der beiden löst den Input aus, und beide halten das Licht an. Der Live-Monitor zeigt, welcher Melder ausgelöst hat.

---

### 5. Wandschalter für An und Aus

Ein Funkschalter, der Ereignisse sendet: Ein Druck schaltet das Licht ein, ohne dass es automatisch wieder ausgeht; ein langer Druck stellt den Normalbetrieb wieder her.

**Entities:** `event.wohnzimmer_schalter` mit den Ereignistypen `single` und `long_press`

| Wo | Einstellung | Wert |
|---|---|---|
| Erster Ereignis-Input | Entitäten / Ereignistyp | `event.wohnzimmer_schalter` / `single` |
| Erster Ereignis-Input | Ziel-Aktivität | Manual |
| Zweiter Ereignis-Input | Entitäten / Ereignistyp | `event.wohnzimmer_schalter` / `long_press` |
| Zweiter Ereignis-Input | Ziel-Aktivität | Reset |

**Ergebnis:** Ein Druck spielt die Scene des aktuellen Slots und lässt sie laufen: Die Standard-Activity Manual hat keinen Timer, und Bewegung wird ignoriert, solange sie läuft. Ein langer Druck startet Reset, das die Lichter ausschaltet und die Activity beendet, sodass Bewegung wieder funktioniert.

---

### 6. Schlafmodus

Nachts soll Herumlaufen kein Licht einschalten.

**Entities:** `input_boolean.schlafmodus`

| Wo | Einstellung | Wert |
|---|---|---|
| Binär-Input | Entitäten | `input_boolean.schlafmodus` |
| Binär-Input | Ziel-Aktivität | Sleep |
| Sleep-Activity | Aktionstyp | Nur blockieren (keine Aktion) |
| Sleep-Activity | Eingangsunterdrückung | der Bewegungs-Input |
| Sleep-Activity | Auto-Ablauf aktivieren | aus |
| Sleep-Activity | Freigabeaktion | Ausschalten |

**Ergebnis:** Der Schalter ändert kein Licht, aber Bewegung wird ab jetzt ignoriert. Schaltest du ihn morgens aus, endet Sleep, und was noch an ist, geht aus. Das sind die Standardwerte der Sleep-Activity, du musst also nur die Entity zuweisen.

> **Tipp:** Ohne Timer endet Sleep nur über seinen Schalter. Ein Timer würde die Unterdrückung mitten in der Nacht aufheben.

---

### 7. Filmabend

Ein Tipp für eine feste Kino-Scene, die Bewegung ignoriert, und danach zurück zum Normalbetrieb.

**Entities:** `scene.wohnzimmer_film`

| Wo | Einstellung | Wert |
|---|---|---|
| Neuer Button-Input | Modus | Umschalten (An/Aus) |
| Neuer Button-Input | Ziel-Aktivität | Kino (neue Activity) |
| Neuer Button-Input | HA-Entität erstellen | an, wenn du eine Dashboard-Kachel oder Sprachsteuerung möchtest |
| Kino-Activity | Aktionstyp | Szene / Skript |
| Kino-Activity | Szenen- oder Skript-Entität | `scene.wohnzimmer_film` |
| Kino-Activity | Eingangsunterdrückung | der Bewegungs-Input |
| Kino-Activity | Auto-Ablauf aktivieren | aus |
| Kino-Activity | Freigabeaktion | Zu Aktivität wechseln |
| Kino-Activity | Ziel-Aktivität | Motion |

**Ergebnis:** Der Button startet die Scene, und sie bleibt auch bei Slot-Wechseln. Schaltest du den Button aus, übernimmt Motion: Die Lichter wechseln zur Scene des aktuellen Slots, und ihr Timer schaltet sie aus, sobald der Raum ruhig bleibt.

> **Tipp:** Ein Licht, das die Kino-Scene einschaltet und das in keiner Slot-Scene vorkommt, bleibt nach dem Wechsel an. Nutze also Lichter aus deinen Slot-Scenes. Soll es sofort dunkel werden, nimm **Ausschalten**.

---

### 8. Nächtlicher Reset

Jemand hat einen Modus ohne Timer vergessen. Jede Nacht soll alles in den Normalzustand zurückkehren.

**Entities:** `input_boolean.schlafmodus`

| Wo | Einstellung | Wert |
|---|---|---|
| Neuer Timer-Input | Auslösezeit | 03:00:00 |
| Neuer Timer-Input | Ziel-Aktivität | Reset |
| Reset-Activity | Zusätzliche Entitäten | `input_boolean.schlafmodus`, Zustand: Aus |

**Ergebnis:** Um 03:00 gehen die Lichter aus, die laufende Activity endet, und auch der Schlafmodus-Schalter wird zurückgesetzt, sodass Bewegung wieder funktioniert.

---

### 9. Deine eigenen Lampen erreichen den Lux-Sensor

Der Lux-Sensor sieht deine Lampen. Sobald sie an sind, misst er mehr als den Schwellenwert, neue Bewegung wird blockiert, und das Licht geht aus, obwohl du im Raum bist.

| Wo | Einstellung | Wert |
|---|---|---|
| Auslöser & Eingänge → Bewegungs-Input | Lux bei aktiver Szene ignorieren | an |

**Ergebnis:** Die Helligkeitsprüfung entscheidet nur noch darüber, ob das Licht *angeht*. Solange eine Twilight-Scene läuft, zählt jede Bewegung und hält den Timer am Laufen. Ist das Licht aus, gilt die Prüfung wieder.

---

## Zeitpläne

### 10. Licht bei Bewegung nur nachts

Die Treppe soll nur im Dunkeln leuchten, egal was ein Lux-Sensor sagt.

| Wo | Einstellung | Wert |
|---|---|---|
| Motion-Activity → Kanäle / Slots | Primär | nur die Abend- und Nacht-Slots anwählen |

**Ergebnis:** Während eines abgewählten Slots bleibt der Channel aus, obwohl die Activity läuft. Die erste Bewegung in einem angewählten Slot schaltet das Licht ein; läuft die Activity noch, wenn ein angewählter Slot beginnt, geht das Licht mit ihm an.

---

### 11. Abend-Scene, die im Winter wartet

Im Dezember ist es um 16:30 dunkel, aber so früh sind die Abend-Scenes zu schummrig.

| Wo | Einstellung | Wert |
|---|---|---|
| Slot-Zeitplan → Slots bearbeiten → Nautische Abenddämmerung | Frühester Start | 22:00 |

**Ergebnis:** Den ganzen Winter bleibt die Scene der Bürgerlichen Abenddämmerung bis 22:00, und die folgenden Slots behalten danach ihren üblichen Abstand. Sommerabende, an denen die Sonne ohnehin später dran ist, ändern sich nicht.

---

### 12. Dynamische Hue-Scene für den Abend

Die Hue-Scene „Sonnenuntergang“ soll abends langsam ihre Farben rotieren lassen, spät in der Nacht aber ruhig bleiben.

| Wo | Einstellung | Wert |
|---|---|---|
| Slots bearbeiten → Bürgerliche Abenddämmerung | Szene / Skript | Sonnenuntergang |
| Slots bearbeiten → Bürgerliche Abenddämmerung | Dynamisch | An |
| Slots bearbeiten → Bürgerliche Abenddämmerung | Tempo | Stufe 1 |
| Slots bearbeiten → Nacht | Dynamisch | Aus |

**Ergebnis:** Während der Bürgerlichen Abenddämmerung rotieren die Farben. In einem gemischten Raum behalten Lichter, die nicht rotieren können, ihre Scene-Farbe. Nachts ist die Scene statisch.

> **Tipp:** Mit **Hue** folgt der Slot dem, was in der Hue-App für die Scene eingestellt ist.

---

### 13. Verandalicht mit eigenem Zeitplan

Bewegung im Flur soll auch die Veranda beleuchten, aber nur von der Dämmerung bis 23:00. Die Veranda bekommt einen eigenen Channel, folgt so ihren eigenen Zeiten und nutzt trotzdem den Melder im Flur.

**Entities:** `scene.veranda_an`

| Wo | Einstellung | Wert |
|---|---|---|
| Slot-Zeitplan → **⋮** → Kanal hinzufügen | Name | Veranda |
| Veranda-Channel → erster Slot | Sonnenereignis / Scene | Bürgerliche Abenddämmerung / `scene.veranda_an` |
| Veranda-Channel → zweiter Slot | Feste Uhrzeit / Scene | 23:00 / keine |

**Ergebnis:** Bewegung spielt beide Channels. Die Veranda macht nur zwischen Dämmerung und 23:00 mit, und ist sie um 23:00 an, schaltet der leere Slot sie aus.

> **Tipp:** Twilight schaltet Lichter nur, solange eine Activity läuft, die Veranda geht in der Dämmerung also nicht von selbst an. Dafür kannst du eine Home-Assistant-Automation bei Sonnenuntergang einen Helfer einschalten lassen und ihn als Binär-Input für eine Activity nutzen.

---

## Fortgeschritten

### 14. Anwesenheitssimulation, während du weg bist

Das Haus soll im Urlaub bewohnt wirken, und zwar so, wie du den Raum wirklich nutzt.

**Entities:** `input_boolean.urlaub`

| Wo | Einstellung | Wert |
|---|---|---|
| Neuer Binär-Input | Entitäten | `input_boolean.urlaub` |
| Neuer Binär-Input | Ziel-Aktivität | Urlaub (neue Activity) |
| Urlaub-Activity | Aktionstyp | Anwesenheitssimulation |
| Urlaub-Activity | Vorlagen-Aktivität | Motion |
| Urlaub-Activity | Heatmap-Profil | Dynamisch (letzte 30 Tage) |
| Urlaub-Activity | Lux-Modus | Nur Dämmerung |
| Urlaub-Activity | Simulationsintensität | Normal (100% des Verlaufs) |
| Urlaub-Activity | Eingangsunterdrückung | der Bewegungs-Input |
| Urlaub-Activity | Auto-Ablauf aktivieren | aus |
| Urlaub-Activity | Freigabeaktion | Ausschalten |

**Ergebnis:** Solange der Schalter an ist, spielt Twilight die Motion-Activity zu den Zeiten ab, in denen dein Raum wirklich genutzt wurde, aber nur von der Abend- bis zur Morgendämmerung. Die Simulation übersteht einen Neustart von Home Assistant.

> **Tipp:** Für ein festes Muster speicherst du in der Karte Aktivitäts-Heatmap ein Profil und wählst es als **Heatmap-Profil** aus.

---

### 15. Ambient-Lichter per Schalter dazunehmen

Der Ambient-Channel soll abends mit dem Bewegungslicht mitlaufen, aber nur, solange ein Schalter an ist. Neue Areas bringen diese Rule schon vorbereitet mit.

**Entities:** `input_boolean.ambient`

| Wo | Einstellung | Wert |
|---|---|---|
| Motion-Activity → Kanäle / Slots | Ambient | nichts angewählt |
| Ambient-Rule | Ziel-Aktivität | Motion |
| Ambient-Rule → Kanäle / Slots | Ambient | die gewünschten Slots anwählen |
| Binär-Input | Entitäten | `input_boolean.ambient` |
| Binär-Input | Zieltyp / Ziel-Regel | Regel / Ambient |

**Ergebnis:** Normalerweise reagiert nur der Primary Channel auf Bewegung. Mit eingeschaltetem Schalter spielt der Ambient-Channel mit, und das sofort, nicht erst bei der nächsten Bewegung. Geht der Schalter aus, geht auch der Channel aus, der Rest bleibt an.

---

### 16. Licht während eines Meetings anlassen

Du sitzt still in einem Videocall, der Melder wird ruhig, und das Licht geht aus.

**Entities:** `binary_sensor.buero_im_meeting`

| Wo | Einstellung | Wert |
|---|---|---|
| Neue Rule | Ziel-Aktivität | Motion |
| Neue Rule | Auto-Ablauf-Verhalten | Pausieren |
| Neuer Binär-Input | Entitäten | `binary_sensor.buero_im_meeting` |
| Neuer Binär-Input | Zieltyp / Ziel-Regel | Regel / die neue Rule |

**Ergebnis:** Während des Meetings friert der Timer bei seiner Restzeit ein. Danach läuft er dort weiter. Mit **Neu starten** bekommst du nach dem Meeting stattdessen die volle Dauer.

---

### 17. Twilight aus einer Automation auslösen

Eine andere Automation soll einen Button-Input starten, zum Beispiel wenn du nach Hause kommst.

| Wo | Einstellung | Wert |
|---|---|---|
| Button-Input | Name | `welcome` |
| Button-Input | Ziel-Aktivität | Manual |

```yaml
automation:
  - alias: Willkommen zu Hause
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

**Ergebnis:** Die Automation löst den Button aus wie ein Klick im Panel. Bei einem Umschalt-Button ergänzt du `active: true` oder `active: false`, um den Zustand zu setzen.

> **Tipp:** Ohne Service-Call geht es, wenn du **HA-Entität erstellen** für den Button aktivierst. Er erscheint dann als `button.*`- oder `switch.*`-Entity für Dashboards und Sprachassistenten.
