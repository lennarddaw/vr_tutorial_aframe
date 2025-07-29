# VR CodeLab - Interaktives Programmieren Lernen

Ein innovatives VR-Bildungsspiel, das Schülern spielerisch die Grundlagen des Programmierens beibringt. Durch das Kombinieren von visuellen Code-Blöcken in einer immersiven 3D-Umgebung lernen Schüler echte Programmierkonzepte kennen.

## Projektziel

VR CodeLab wurde entwickelt, um:
- **Programmierkonzepte visuell zu vermitteln** durch interaktive 3D-Code-Blöcke
- **Schüler auf echtes Programmieren vorzubereiten** mit realitätsnahen JavaScript-Syntax
- **Multiple Lernwege zu unterstützen** - VR, Desktop und Mobile
- **Progressive Herausforderungen anzubieten** mit steigender Komplexität

## Features

### Multi-Platform Unterstützung
- **VR-Headsets**: Vollständige VR-Erfahrung mit Hand-Controllern
- **Desktop**: Maus-basierte Interaktion mit Keyboard-Shortcuts
- **Mobile**: Touch-Gesten für Tablet und Smartphone

### Programmier-Konzepte
- **🟦 Variablen**: Datenspeicherung und -verwaltung
- **🟨 Funktionen**: Code-Ausführung und Ausgabe
- **🟩 Schleifen**: Wiederholungsstrukturen
- **🟥 Bedingungen**: Logische Entscheidungen

### Pädagogische Features
- **Progressive Level**: 5 aufeinander aufbauende Schwierigkeitsstufen
- **CodeBot-Lehrer**: Interaktiver Roboter-Tutor mit Hilfestellungen
- **Echtzeit-Feedback**: Sofortige Rückmeldung zu erstellten Programmen
- **Gamification**: Punkte, Achievements und Erfolgs-Animationen

### Technische Highlights
- **A-Frame VR Framework**: Moderne WebVR-Technologie
- **Modularer Code**: Aufgeteilte Logik für bessere Wartbarkeit
- **Responsive Design**: Optimiert für alle Bildschirmgrößen
- **Accessibility**: Barrierefreie Bedienelemente

## Projektstruktur

```
VR-CodeLab/
├── index.html          # Haupt-HTML mit VR-Szene
├── styles.css          # Modernes CSS-Styling
├── game-logic.js       # Kern-Spiellogik und Level-System
├── drag-drop.js        # Interaktionssystem für Code-Blöcke
├── ui-controller.js    # Benutzeroberflächen-Management
└── README.md           # Projektdokumentation
```

## Installation & Setup

### Voraussetzungen
- Moderner Webbrowser mit WebVR-Unterstützung
- Lokaler Webserver (für optimale Performance)

### Schnellstart
1. **Repository klonen oder herunterladen**
2. **Lokalen Server starten** (empfohlen):
   ```bash
   # Mit Python 3
   python -m http.server 8000
   
   # Mit Node.js (live-server)
   npx live-server
   
   # Mit PHP
   php -S localhost:8000
   ```
3. **Browser öffnen**: `http://localhost:8000`
4. **VR-Headset verbinden** (optional)

### VR-Setup
- **Oculus Quest/Rift**: WebXR über Oculus Browser
- **HTC Vive**: WebVR über SteamVR
- **Windows Mixed Reality**: Edge Browser mit WebVR
- **Mobile VR**: Google Cardboard oder Samsung Gear VR

## Spielanleitung

### Level-Übersicht

#### Level 1: Erste Schritte
- **Konzept**: Variablen und Ausgabe
- **Aufgabe**: Erstelle eine Variable und gib sie aus
- **Blöcke**: `let name = 'Schüler'`, `console.log(name)`

#### Level 2: Entscheidungen treffen
- **Konzept**: If-Bedingungen
- **Aufgabe**: Alterscheck-Programm erstellen
- **Blöcke**: Variablen + If-Bedingungen + Ausgabe

#### Level 3: Wiederholungen
- **Konzept**: For-Schleifen
- **Aufgabe**: Zähl-Programm von 1 bis 3
- **Blöcke**: For-Schleife + Ausgabe

#### Level 4: Alles kombinieren
- **Konzept**: Komplexe Programme
- **Aufgabe**: Alle Konzepte in einem Programm
- **Blöcke**: Alle verfügbaren Typen

#### Level 5: Freies Programmieren
- **Konzept**: Kreativität
- **Aufgabe**: Eigenes Programm erstellen
- **Blöcke**: Freie Auswahl

### Steuerung

| Plattform | Aktion | Bedienung |
|-----------|--------|-----------|
| **VR** | Block greifen | Trigger-Taste |
| **VR** | Block loslassen | Trigger loslassen |
| **Desktop** | Block ziehen | Maus klicken & ziehen |
| **Mobile** | Block verschieben | Touch & Drag |

### Tastenkürzel (Desktop)
- **H**: Hilfe ein/ausblenden
- **Ctrl + R**: Arbeitsbereich zurücksetzen
- **Ctrl + Enter**: Code ausführen
- **ESC**: Vollbild verlassen

## Technische Details

### Architektur

#### Core Module
- **game-logic.js**: Level-Management, Challenge-System, Robot-AI
- **drag-drop.js**: VR/Desktop/Mobile Interaktionen
- **ui-controller.js**: UI-Management, Notifications, Themes

#### A-Frame Komponenten
- **grab-system**: VR-Controller Interaktionen
- **workspace**: Drop-Zone für Code-Blöcke
- **code-block**: Visuelle Programmier-Blöcke

#### Responsive Features
- **CSS Grid**: Flexible Layout-Systeme
- **Media Queries**: Mobile-optimierte Ansichten
- **Viewport Detection**: Automatische Anpassung

### Performance-Optimierungen
- **Lazy Loading**: Blöcke werden nur bei Bedarf geladen
- **Object Pooling**: Wiederverwendung von Partikeln
- **LOD-System**: Level-of-Detail für VR
- **Texture Compression**: Optimierte Materialien

## Anpassungen

### Theme-System
```javascript
// Dark Theme (Standard)
UIController.applyTheme('dark');

// Light Theme
UIController.applyTheme('light');
```

### Neue Level hinzufügen
```javascript
// In game-logic.js
const LEVELS = {
    6: {
        title: "Mein neues Level",
        description: "Beschreibung...",
        requiredBlocks: ["variable", "function"],
        challenges: [/* ... */]
    }
};
```

### Custom Code-Blöcke
```html
<!-- Neuer Block in index.html -->
<a-entity id="custom-block"
          mixin="code-block-base"
          material="color: #purple"
          data-block-type="custom"
          data-block-code="// Mein Code">
    <a-text value="Mein Block" /* ... */></a-text>
</a-entity>
```

## Pädagogischer Einsatz

### Klassenzimmer-Integration
- **Einzel-Stationen**: Ein VR-Headset pro Arbeitsplatz
- **Gruppen-Aktivität**: Gemeinsames Problemlösen
- **Demo-Modus**: Lehrer zeigt Konzepte auf Bildschirm

### Lernziele
- **Computational Thinking**: Problemzerlegung und Abstraktion
- **Syntax-Verständnis**: Echte JavaScript-Strukturen
- **Debugging-Skills**: Fehler erkennen und korrigieren
- **Kreativität**: Eigene Programme entwickeln

### Bewertungsmöglichkeiten
- **Level-Fortschritt**: Automatisches Tracking
- **Code-Qualität**: Effizienz der Lösungen
- **Kreativität**: Innovation in freien Aufgaben
- **Kollaboration**: Teamwork bei Gruppenprojekten

## Zukunftspläne

### Geplante Features
- [ ] **Multiplayer-Modus**: Gemeinsames Programmieren
- [ ] **Code-Export**: Programme als echte .js Dateien
- [ ] **Erweiterte Blöcke**: Objekte, Arrays, Funktionen
- [ ] **Sound-Integration**: Audio-Feedback für Aktionen
- [ ] **Teacher-Dashboard**: Fortschritts-Monitoring

### Technische Verbesserungen
- [ ] **WebAssembly**: Performance-Optimierung
- [ ] **Service Worker**: Offline-Funktionalität
- [ ] **WebRTC**: Peer-to-Peer Kollaboration
- [ ] **Machine Learning**: Adaptive Schwierigkeit

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz - siehe [LICENSE](LICENSE) für Details.


## Kontakt & Support

- **Email**: lennardgross07@gmail.com

---

