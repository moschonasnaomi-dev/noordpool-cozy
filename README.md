# 🎄 Cozy Pastel Noordpool (90° N)

Een interactieve 3D-kerstwereld op de Noordpool, gebouwd met **Three.js** in een zachte *cute & cozy* pastelstijl met knipperende regenbooglampjes, vallende sneeuw en klikbare verrassingen.

---

## ✨ Kenmerken

- **Besneeuwd eiland & nachthemel**: Zwevend sneeuweiland met pastel sneeuwheuvels, regenboog-stapstenen, een maan en 900 pastelsterren (`THREE.Points`).
- **De echte Noordpool (90° N)**: Rood-wit gestreepte paal met gouden bol en bordje — klikbaar voor een regenbooggolf over het eiland.
- **Werkplaats van de Kerstman**: Volledig opgebouwd uit Three.js primitieve vormen (hoofdgebouw, lavendel zij-atelier, babyblauwe inpakvleugel, veranda met zuurstok-pilaren, dakkapel, klokkentorentje, draaiend speelgoedrad en brievenbus).
- **7 Pastel Kerstbomen & Elfendorp**: 7 kerstbomen met knipperende regenbooglampjes, 5 elfjes-huisjes met daklampjes, elfjes en een mini-reuzerad.
- **Levendige extra's**: De **Noordpool Express** (trein + station rond het eiland), een **rendierenstalling**, een **vijver met visjes**, een **pastel-sneeuwpop**, een **witte kerstkat** met **kattenhuisje** en **5 cadeautjes** met verrassingen.
- **Automatische animaties**: Vliegende slee met rendieren, golvend pastel noorderlicht, opstijgende rook uit de schoorsteen en een **vallende sneeuw** particle system (1200 sneeuwvlokjes).
- **Soepele prestaties**: Ontworpen om vloeiend op **60 FPS** te draaien met hergebruikte geometrieën, `emissive` materialen en begrensde `pixelRatio` (max. 2).

---

## 🕹️ Besturing & Interactie

| Actie | Wat gebeurt er? |
| :--- | :--- |
| **Slepen (linkermuisknop)** | Draai de camera rond het eiland (`OrbitControls`) |
| **Scrollen** | Zoom in en uit |
| **Rechtermuisknop slepen** | Verplaats (pan) het camerapunt |
| **Klikken op 3D-objecten** | Via `THREE.Raycaster` reageren o.a. cadeautjes, bomen, de 90° N paal, sneeuwpop, werkplaats, elfjes, huisjes, vijver, reuzerad, trein, station, kerstkat, kattenhuisje en rendierenstalling |

### UI-knoppen bovenaan
- **🌈 Lampjes**: Wissel tussen 4 lichtpatronen (`Regenboog Golf`, `Twinkel Pastel`, `Cozy Disco`, `Zachte Gloed`).
- **🎁 Open Alle Cadeaus**: Open of sluit alle 5 cadeautjes tegelijk.
- **📖 Code Uitleg**: Opent een ingebouwd spiekbriefje met uitleg over de Three.js-concepten.

---

## 🚀 Gebruik / Lokaal openen

Dit project gebruikt geen bundler of dependencies om te installeren; Three.js en `OrbitControls` worden geladen via CDN (let op: een internetverbinding is hiervoor nodig).

1. Clone of download deze repository:
   ```bash
   git clone <jouw-github-repo-url>
   cd noordpool-cozy
   ```
2. Dubbelklik op `index.html` om de scene direct in je browser te openen (of gebruik een lokale server zoals VS Code *Live Server*).

---

## 📁 Projectstructuur

```text
noordpool-cozy/
├── index.html   # HTML-structuur, UI-overlay, legenda, uitleg-modal en Three.js CDN-scripts
├── style.css    # Pastel-styling voor de UI, knoppen, toast-meldingen en modal
├── script.js    # Volledige Three.js-scene, netjes opgedeeld in 11 gedocumenteerde hoofdstukken
├── UITLEG.md    # Overzicht van de opdrachteisen en spiekbriefje voor presentaties
└── README.md    # Documentatie voor GitHub
```

---

## 🛠️ Gebruikte technieken

- **HTML5 & CSS3** (met Google Fonts `Fredoka` & `Quicksand`)
- **JavaScript (ES6)**
- **[Three.js (r128)](https://threejs.org/)** — `PerspectiveCamera`, `WebGLRenderer`, `OrbitControls`, `MeshStandardMaterial`, `Points` / `BufferGeometry`, `Raycaster`

---

## 📖 Code-indeling (`script.js`)

De broncode in `script.js` is opgedeeld in **11 genummerde hoofdstukken** met Nederlandstalige toelichting:

1. Scene, Camera & Renderer
2. `OrbitControls` (rondkijken met de muis)
3. Pastel Kleurenpalet & Belichting
4. Besneeuwde Ondergrond & Nachtelijke Hemel met Sterren + Maan
5. De Echte Noordpool (Rood-wit gestreepte paal op 90° N)
6. De Werkplaats van de Kerstman (primitieve vormen)
7. 7 Kerstbomen & Het Elfendorp met knipperende regenbooglampjes
8. Zelfbewegende objecten (vliegende slee, noorderlicht, rook, trein)
9. Vallende sneeuw als Particle System (`THREE.Points`)
10. Raycasting & klikbare objecten
11. De Animatie-loop (60 FPS) & Window Resize

Zie ook [UITLEG.md](UITLEG.md) voor een beknopt spiekbriefje per onderwerp.
