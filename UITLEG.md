# 🎄 Cozy Pastel Noordpool (90° N) — Overzicht & Code-Uitleg

Welkom in je **Cute & Cozy Pastel Noordpool** Three.js project! Je kunt het project direct openen door te dubbelklikken op `index.html` in je browser.

---

## ✅ Checklist: Alle opdrachteisen + jouw stijl

| Opdrachteis | Waar in `script.js`? | Hoe is het gemaakt? |
| :--- | :--- | :--- |
| **1. Besneeuwde ondergrond & nachtelijke hemel met sterren** | **Hoofdstuk 4** | Een zwevend sneeuweiland (`CylinderGeometry`) met ronde pastel sneeuwheuvels (`SphereGeometry`), een regenboog-stapstenenpad, een pastel maan én 900 sterren (`THREE.Points`) in zachte pasteltinten. |
| **2. De echte Noordpool: rood-wit gestreepte paal op 90° N** | **Hoofdstuk 5** | Een `for`-loop stapelt 8 cilinders (`CylinderGeometry`) om en om in pastel aardbei-rood/roze en sneeuwwit, met een gouden bol bovenop en een **"90° N — De Noordpool"** bordje. |
| **3. De werkplaats van de Kerstman uit primitieve vormen** | **Hoofdstuk 6** | Uitgebreid gebouw met hoofdgebouw, lavendel zij-atelier, babyblauwe inpakvleugel, veranda met zuurstok-pilaren & hanglantaarns, dakkapel, klokkentorentje, draaiend speelgoedrad, brievenbus en een buiten-inpaktafel — volledig uit primitieve vormen (`Box`, `Cylinder`, `Cone`, `Sphere`, `Torus`, `Octahedron`). |
| **4. Minstens vijf kerstbomen met knipperende lichtjes** | **Hoofdstuk 7** | **7 pastel-mintgroene kerstbomen** met elk 16 regenbooglampjes (plus regenbooglampjes aan het hoofdgebouw, de veranda en beide vleugels van de werkplaats) die in de animatie-loop met `Math.sin()` en `setHSL()` knipperen en van kleur veranderen. |
| **5. Vallende sneeuw als particle system** | **Hoofdstuk 9** | 1200 sneeuwvlokjes in één `THREE.Points` object met een `BufferGeometry`. Elke frame zakken de `y`-coördinaten en dwarrelen de vlokjes met een sinusbeweging opzij. |
| **6. Iets dat beweegt zonder dat jij iets doet** | **Hoofdstuk 8** | **Drie dingen tegelijk:** 1) Een vliegende slee met 2 rendieren (inclusief gloeiende neus!) die rondjes vliegt in de lucht, 2) golvend pastel Noorderlicht (`PlaneGeometry` vertices), en 3) opstijgende rookpluimpjes uit de schoorsteen. |
| **7. Rondkijken met de muis (`OrbitControls`)** | **Hoofdstuk 2** | `THREE.OrbitControls` met `enableDamping = true` voor een zachte beweging en een begrensde kijkhoek (`maxPolarAngle`) zodat je niet onder het sneeuweiland duikt. |
| **8. Klikbaar object via Raycasting** | **Hoofdstuk 10** | **5 klikbare cadeautjes** waarvan het deksel openspringt en een verrassing omhoog popt, **7 klikbare kerstbomen** die dansen en oplichten, een klikbare **90° N paal**, een klikbare **sneeuwpop** én een klikbare **werkplaats**! |
| **9. Vloeiend op een gewone laptop (60 FPS)** | **Hoofdstuk 1 & 11** | Lichtgewicht primitieve vormen, hergebruik van geometrieën, `emissive` materialen voor de 125+ regenbooglampjes en `pixelRatio` begrensd op maximaal 2. |
| **10. Leesbare code om uit te leggen aan een klasgenoot** | **Hele `script.js`** | Netjes opgedeeld in 11 genummerde hoofdstukken met Nederlandstalige uitleg bij elke stap. |

---

## 🗣️ Kort spiekbriefje voor je uitleg aan een klasgenoot

1. **Hoe werkt Three.js in de basis? (Hoofdstuk 1)**
   - Zie Three.js als een filmset:
     - `scene` = de studio waarin je alles neerzet.
     - `camera` = de filmcamera waarmee je kijkt.
     - `renderer` = de schilder die 60 keer per seconde het beeld op het scherm (`<canvas>`) tekent.
2. **Hoe bouw je iets uit primitieve vormen? (Hoofdstuk 5, 6 & 7)**
   - Elk 3D-object heet een `Mesh`. Een `Mesh` heeft altijd 2 dingen nodig:
     1. Een **Geometry** (de vorm: blok, cilinder, kegel, bol, donut/torus).
     2. Een **Material** (de kleur en glans, bijv. `MeshStandardMaterial` dat reageert op licht en schaduw).
   - Met `new THREE.Group()` groepeer je losse blokjes en cilinders tot één geheel (zoals de werkplaats, de slee of een cadeautje), zodat je ze samen kunt verplaatsen of draaien.
3. **Hoe werken de knipperende regenbooglampjes? (Hoofdstuk 7 & 11)**
   - Elk lampje heeft een `emissive` kleur (dat betekent dat het materiaal zelf licht lijkt te geven).
   - In de `animate()` functie berekenen we elke frame een nieuwe regenboogkleur met `setHSL(hue, saturation, lightness)` en laten we de felheid (`emissiveIntensity`) golven met `Math.sin(elapsed + phase)`.
4. **Hoe werkt het Sneeuw Particle System? (Hoofdstuk 9 & 11)**
   - Als je 1200 aparte `SphereGeometry` bolletjes zou maken, moet de grafische kaart 1200 losse objecten tekenen.
   - Met `THREE.Points` en `BufferGeometry` stoppen we alle 1200 `(x, y, z)` posities in één grote lijst (`Float32Array`). De grafische kaart tekent dan alle 1200 vlokjes in **één enkele stap** (daarom blijft het 60 FPS!).
5. **Hoe werkt Raycasting bij het klikken op een cadeau? (Hoofdstuk 10)**
   - Je muisklik op het scherm heeft alleen een `X` en `Y` (2D), maar geen diepte (`Z`).
   - `THREE.Raycaster` trekt een onzichtbare rechte lijn (laserstraal) vanaf de camera door je muisaanwijzer de 3D-wereld in.
   - `raycaster.intersectObjects(clickableObjects, true)` geeft een lijst terug van alle objecten die door die straal geraakt worden, gesorteerd van dichtbij naar veraf. We pakken het eerste geraakte object (`intersects[0]`) en zetten `isOpen = true` op het cadeau!
