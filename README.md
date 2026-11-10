# 🎄 Cozy Pastel North Pole (90° N)

An interactive 3D Christmas world at the North Pole, built with **Three.js** in a soft, *cute & cozy* pastel aesthetic featuring blinking rainbow fairy lights, falling snow, and clickable surprises.

---

## ✨ Features

* **Snowy Island & Night Sky**: Floating snow island with pastel snow hills, rainbow stepping stones, a moon, and 900 pastel stars (`THREE.Points`).
* **The True North Pole (90° N)**: Red-and-white candy-striped pole topped with a golden sphere and signpost — clickable to trigger a rainbow wave across the island.
* **Santa's Workshop**: Fully constructed from Three.js primitive shapes (main building, lavender side studio, baby-blue gift-wrapping wing, porch with candy-cane pillars, dormer window, bell tower, rotating toy wheel, and mailbox).
* **7 Pastel Christmas Trees & Elf Village**: 7 Christmas trees adorned with blinking rainbow lights, 5 elf houses with roofline lighting, elves, and a mini Ferris wheel.
* **Vibrant Additions**: The **North Pole Express** (train + depot circling the island), a **reindeer stable**, a **pond with fish**, a **pastel snowman**, a **white Christmas cat** with a **cat house**, and **5 gift boxes** holding surprises.
* **Automated Animations**: Flying sleigh pulled by reindeer, undulating pastel aurora borealis, rising chimney smoke, and a **falling snow** particle system (1,200 snowflakes).
* **Smooth Performance**: Engineered to run seamlessly at **60 FPS** utilizing reused geometries, `emissive` materials, and a capped `pixelRatio` (max 2).

---

## 🕹️ Controls & Interaction

| Action | Result |
| --- | --- |
| **Left-click + drag** | Rotate the camera around the island (`OrbitControls`) |
| **Scroll** | Zoom in and out |
| **Right-click + drag** | Pan the camera |
| **Click 3D objects** | Powered by `THREE.Raycaster`: interact with presents, trees, the 90° N pole, snowman, workshop, elves, cottages, pond, Ferris wheel, train, station, Christmas cat, cat house, and reindeer stable |

### Top UI Controls

* **🌈 Lights**: Toggle through 4 lighting patterns (`Rainbow Wave`, `Twinkle Pastel`, `Cozy Disco`, `Soft Glow`).
* **🎁 Open All Gifts**: Simultaneously open or close all 5 presents.
* **📖 Code Walkthrough**: Opens an integrated cheat sheet explaining key Three.js concepts.

---

## 🚀 Getting Started / Local Setup

This project requires no build tools or package installations; Three.js and `OrbitControls` are loaded directly via CDN (an active internet connection is required).

1. Clone or download this repository:
```bash
git clone <your-github-repo-url>
cd noordpool-cozy

```


2. Double-click `index.html` to open the scene directly in your browser (or use a local development server such as VS Code's *Live Server*).

---

## 📁 Project Structure

```text
noordpool-cozy/
├── index.html   # HTML structure, UI overlay, legend, explanation modal, and Three.js CDN scripts
├── style.css    # Pastel styling for the UI, buttons, toast notifications, and modal
├── script.js    # Complete Three.js scene, organized into 11 documented sections
├── UITLEG.md    # Assignment criteria overview and presentation cheat sheet
└── README.md    # GitHub documentation

```

---

## 🛠️ Built With

* **HTML5 & CSS3** (styled with Google Fonts `Fredoka` & `Quicksand`)
* **JavaScript (ES6)**
* **[Three.js (r128)](https://threejs.org/)** — `PerspectiveCamera`, `WebGLRenderer`, `OrbitControls`, `MeshStandardMaterial`, `Points` / `BufferGeometry`, `Raycaster`

---

## 📖 Code Organization (`script.js`)

The codebase in `script.js` is structured into **11 numbered sections** with detailed commentary:

1. Scene, Camera & Renderer
2. `OrbitControls` (mouse navigation)
3. Pastel Color Palette & Lighting
4. Snowy Terrain & Starry Night Sky with Moon
5. The True North Pole (Red-and-white striped pole at 90° N)
6. Santa's Workshop (primitive meshes)
7. 7 Christmas Trees & The Elf Village with blinking rainbow lights
8. Autonomous Objects (flying sleigh, aurora borealis, chimney smoke, train)
9. Falling Snow Particle System (`THREE.Points`)
10. Raycasting & Interactive Click Events
11. Animation Loop (60 FPS) & Window Resizing

See [UITLEG.md](https://www.google.com/search?q=UITLEG.md) for a concise topic-by-topic reference guide.
