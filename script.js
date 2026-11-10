/**
 * ============================================================================
 * COZY PASTEL NOORDPOOL (90° N) — THREE.JS SCENE
 * ============================================================================
 * Stijl: Cute & Cozy Pastel met knipperende Regenboog Lampjes
 *
 * Dit bestand is opgedeeld in 11 duidelijke hoofdstukken zodat je elk onderdeel
 * makkelijk aan een klasgenoot of docent kan uitleggen:
 *
 *  Hoofdstuk 1 : Scene, Camera & Renderer (de basis van Three.js)
 *  Hoofdstuk 2 : OrbitControls (rondkijken en zoomen met de muis)
 *  Hoofdstuk 3 : Pastel Kleurenpalet & Sfeervolle Belichting
 *  Hoofdstuk 4 : Besneeuwde Ondergrond & Nachtelijke Hemel met Sterren + Maan
 *  Hoofdstuk 5 : De Echte Noordpool: Rood-Wit Gestreepte Paal op 90° N
 *  Hoofdstuk 6 : De Werkplaats van de Kerstman (opgebouwd uit primitieve vormen)
 *  Hoofdstuk 7 : 7 Kerstbomen & Het Elfendorp met Knipperende Regenboog Lampjes
 *  Hoofdstuk 8 : Zelfbewegende Objecten (Vliegende Slee + Rendieren, Noorderlicht, Rook)
 *  Hoofdstuk 9 : Vallende Sneeuw als Particle System (THREE.Points)
 *  Hoofdstuk 10: Raycasting & Klikbare Objecten (Cadeaus die openspringen, Bomen, 90° N)
 *  Hoofdstuk 11: De Animatie-Loop (vloeiend 60 FPS) & Scherm-Resize
 * ============================================================================
 */

// ============================================================================
// HOOFDSTUK 1: SCENE, CAMERA & RENDERER
// ============================================================================

// 1. De Scene is het 3D-toneel waarin we alle objecten, lichten en sneeuw plaatsen
const scene = new THREE.Scene();

// Zachte pastel-nachtelijke mist zorgt voor diepte en een dromerige 'cozy' sfeer
scene.fog = new THREE.FogExp2(0x221b42, 0.011);

// 2. De Camera bepaalt vanuit welk standpunt we kijken (50° blikveld)
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  250
);
camera.position.set(0, 13, 27);

// 3. De Renderer tekent de 3D-scene op een HTML <canvas>
const renderer = new THREE.WebGLRenderer({
  antialias: true, // Gladde randjes (geen kartels)
  alpha: true,     // Laat de zachte pastel-achtergrond van CSS doorschijnen
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
// Beperk pixelRatio tot maximaal 2 zodat ook schermen met hoge resolutie 60 FPS halen
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Zachte schaduwen
// Tone mapping voorkomt dat felle witte sneeuw 'uitbrandt' naar fel wit (#ffffff)
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.92;

const container = document.getElementById('scene-container');
container.appendChild(renderer.domElement);


// ============================================================================
// HOOFDSTUK 2: ORBITCONTROLS (RONDKIJKEN MET DE MUIS)
// ============================================================================

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 2.8, 0);     // Kijk naar het midden van het Noordpool-eiland
controls.enableDamping = true;      // Zorgt voor een zachte, vloeiende uitloop bij draaien
controls.dampingFactor = 0.06;
controls.minDistance = 7;           // Niet té ver inzoomen
controls.maxDistance = 58;          // Niet té ver uitzoomen
// Zorg dat de gebruiker niet onder de besneeuwde grond kan kijken:
controls.maxPolarAngle = Math.PI / 2 - 0.03;


// ============================================================================
// HOOFDSTUK 3: PASTEL KLEURENPALET & BELICHTING
// ============================================================================

// Ons centrale 'Cute & Cozy Pastel' kleurenpalet
const PASTEL = {
  snowWhite: 0xfff7fc,
  snowGround: 0xc8bfe6,     // Zachte pastel lavendel-sneeuwgrond zodat alles goed afsteekt
  snowHill: 0xd8d0f2,       // Iets lichtere sneeuwheuvels voor subtiel diepteverschil
  snowLilac: 0x9b8ec4,      // Duidelijke pastel-lila rand onder het eiland
  poleRed: 0xff7597,      // Zacht aardbei-rood/roze voor de Noordpool-paal
  poleWhite: 0xfffbfd,
  wallPink: 0xffb3c6,     // Pastel roze muren voor de werkplaats
  wallLavender: 0xdec9ff, // Pastel lavendel voor het zij-atelier
  wallBlue: 0xbde0fe,     // Pastel babyblauw voor de inpakvleugel
  stoneSoft: 0xb9add8,    // Zachte lavendel-steen voor de plint
  roofCream: 0xffe5ec,
  doorMint: 0x9ef0c8,     // Pastel mintgroene deur
  windowGlow: 0xfff1a8,   // Warm botergeel licht achter de ramen
  woodCozy: 0xc99383,     // Warm pastel-bruin hout
  goldSoft: 0xffdf85,     // Zacht pastel-goud
  treeMint1: 0x80d4ab,    // Pastel dennenboom-kleuren
  treeMint2: 0x95e3bc,
  treeMint3: 0x6ec298,
  rainbowHex: [
    0xff9ebb, // Pastel roze
    0xffcba4, // Pastel perzik
    0xfff3a1, // Pastel citroengeel
    0xa8f0c6, // Pastel mintgroen
    0xa3d8ff, // Pastel babyblauw
    0xd8bfff  // Pastel lila/lavendel
  ]
};

// 1. HemisphereLight: zacht hemellicht (pastelroze van boven, dieper lavendel van onder voor contrast)
const hemiLight = new THREE.HemisphereLight(0xf3d1ff, 0x4b3f72, 0.58);
hemiLight.position.set(0, 40, 0);
scene.add(hemiLight);

// 2. DirectionalLight: maanlicht dat duidelijke, zachte schaduwen werpt op de sneeuw
const moonLight = new THREE.DirectionalLight(0xf5e9ff, 0.68);
moonLight.position.set(18, 28, 16);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 1024;  // 1024x1024 houdt 60 FPS supersnel op elke laptop
moonLight.shadow.mapSize.height = 1024;
moonLight.shadow.camera.near = 5;
moonLight.shadow.camera.far = 70;
const d = 23;
moonLight.shadow.camera.left = -d;
moonLight.shadow.camera.right = d;
moonLight.shadow.camera.top = d;
moonLight.shadow.camera.bottom = -d;
moonLight.shadow.bias = -0.0006;
scene.add(moonLight);

// 3. PointLight bij de werkplaats: geeft een warme, gezellige gloed zonder de sneeuw te verblinden
const workshopLight = new THREE.PointLight(0xffd28a, 0.82, 20);
workshopLight.position.set(1.5, 4.5, 1.5);
scene.add(workshopLight);

// 4. Regenboog PointLight bij de Noordpool: kleurt zachtjes mee met de regenboog
const rainbowPlazaLight = new THREE.PointLight(0xff9ebb, 0.58, 16);
rainbowPlazaLight.position.set(-4.5, 4.0, 6.0);
scene.add(rainbowPlazaLight);


// ============================================================================
// HULPFUNCTIES VOOR TEXTUREN (Zonder externe plaatjes nodig te hebben!)
// ============================================================================

/**
 * Maakt een schattig naambordje als CanvasTexture zodat tekst altijd werkt
 * zonder externe afbeeldingsbestanden. Past de tekstgrootte automatisch aan
 * zodat lange teksten altijd netjes binnen het kader blijven.
 */
function createSignTexture(mainText, subText, bgColor, borderColor, textColor, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = options.width || 512;
  canvas.height = options.height || 192;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);

  function drawFittedLine(text, y, maxFontSize, minFontSize, fontTemplate, maxWidth) {
    let fontSize = maxFontSize;
    while (fontSize > minFontSize) {
      ctx.font = fontTemplate.replace('{size}', fontSize);
      if (ctx.measureText(text).width <= maxWidth) {
        break;
      }
      fontSize -= 2;
    }
    ctx.font = fontTemplate.replace('{size}', fontSize);
    ctx.fillText(text, canvas.width / 2, y, maxWidth);
  }

  function drawSign() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Achtergrond met afgeronde kaderstijl
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sierlijst
    const inset = 10;
    const lineWidth = 14;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(inset, inset, canvas.width - inset * 2, canvas.height - inset * 2);

    // Ruime binnenmarge zodat tekst nooit de rand raakt
    const maxTextWidth = canvas.width - (inset + lineWidth + 20) * 2;

    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Hoofdtekst (schaalt automatisch mee bij langere woorden)
    drawFittedLine(
      mainText,
      subText ? canvas.height * 0.40 : canvas.height * 0.50,
      54,
      24,
      'bold {size}px "Fredoka", "Quicksand", sans-serif',
      maxTextWidth
    );

    // Subtekst (optioneel)
    if (subText) {
      drawFittedLine(
        subText,
        canvas.height * 0.70,
        34,
        18,
        '600 {size}px "Quicksand", sans-serif',
        maxTextWidth
      );
    }
  }

  drawSign();

  // Teken opnieuw zodra Google Fonts geladen zijn, zodat de echte breedte klopt
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      drawSign();
      texture.needsUpdate = true;
    });
  }

  return texture;
}

/**
 * Maakt een schattige ronde Kerstklok-wijzerplaat (bijna middernacht: 23:55!)
 * als CanvasTexture voor het klokkentorentje op de Werkplaats.
 */
function createClockTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const cx = 128;
  const cy = 128;

  // Warme pastel-creme wijzerplaat met zachte gouden rand
  ctx.fillStyle = '#fff8e7';
  ctx.beginPath();
  ctx.arc(cx, cy, 120, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffdf85';
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.strokeStyle = '#ff9ebb';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 102, 0, Math.PI * 2);
  ctx.stroke();

  // 12 pastel uur-stippen
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const rx = cx + Math.cos(a) * 84;
    const ry = cy + Math.sin(a) * 84;
    ctx.fillStyle = i % 3 === 0 ? '#ff7597' : '#9b8ec4';
    ctx.beginPath();
    ctx.arc(rx, ry, i % 3 === 0 ? 7 : 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Wijzers op 23:55 (bijna Kerst!)
  ctx.strokeStyle = '#522b47';
  ctx.lineCap = 'round';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - 10, cy - 48);
  ctx.stroke();

  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - 34, cy - 66);
  ctx.stroke();

  ctx.fillStyle = '#ff7597';
  ctx.beginPath();
  ctx.arc(cx, cy, 9, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

/**
 * Maakt een zacht rond sneeuwvlok-icoontje op een 2D canvas voor ons Particle System.
 */
function createSnowflakeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.5, 'rgba(255, 235, 250, 0.8)');
  grad.addColorStop(1, 'rgba(255, 235, 250, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

/**
 * Maakt een sprankelend 4-puntig glitter-sterretje op een 2D canvas
 * voor het pastel roze glitter-particle-effect bij de elfjes.
 */
function createGlitterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Zachte gloed eromheen
  const grad = ctx.createRadialGradient(32, 32, 1, 32, 32, 28);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.3, 'rgba(255, 225, 242, 0.75)');
  grad.addColorStop(1, 'rgba(255, 200, 230, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(32, 32, 28, 0, Math.PI * 2);
  ctx.fill();

  // Heldere 4-puntige twinkle-ster in het midden
  ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
  ctx.beginPath();
  ctx.moveTo(32, 4);
  ctx.quadraticCurveTo(34, 30, 60, 32);
  ctx.quadraticCurveTo(34, 34, 32, 60);
  ctx.quadraticCurveTo(30, 34, 4, 32);
  ctx.quadraticCurveTo(30, 30, 32, 4);
  ctx.closePath();
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

/**
 * Maakt een zachte pastel-sneeuwtextuur met subtiele kleurvariatie en sneeuwgolven,
 * zodat de grond niet één oogverblindend wit vlak is en alles erboven goed leesbaar blijft.
 */
function createSnowGroundTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Subtiel radiaal verloop: midden iets koeler pastel-lavendel, rand zacht ijsblauw
  const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
  grad.addColorStop(0, '#dcd5f5');
  grad.addColorStop(0.65, '#cec5ec');
  grad.addColorStop(1, '#b8addb');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Zachte sneeuwduintjes / cirkelgolven voor dieptegevoel
  for (let i = 0; i < 45; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 24 + Math.random() * 55;
    const drift = ctx.createRadialGradient(x, y, 2, x, y, r);
    drift.addColorStop(0, i % 2 === 0 ? 'rgba(255, 248, 255, 0.22)' : 'rgba(155, 140, 205, 0.16)');
    drift.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = drift;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Kleine subtiele sneeuwkristal-spikkels
  for (let s = 0; s < 220; s++) {
    ctx.fillStyle = s % 3 === 0 ? 'rgba(255, 255, 255, 0.35)' : 'rgba(180, 170, 225, 0.25)';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

let cachedGiftBowGeometries = null;

/**
 * Maakt eenmalig de herbruikbare 3D-geometrieën voor een echte strik:
 * - geknepen, breed uitwaaierende lintlussen met opening
 * - een bolle middenknoop
 * - twee sierlijke lint-staartjes met zwaluwstaart-inkeping
 */
function getGiftBowGeometries() {
  if (cachedGiftBowGeometries) return cachedGiftBowGeometries;

  // 1. Lintlussen (XY-profiel met opening in het midden, daarna bij de knoop samengeknepen)
  const loopShape = new THREE.Shape();
  loopShape.moveTo(0.01, 0.012);
  loopShape.bezierCurveTo(0.14, -0.002, 0.31, 0.005, 0.345, 0.088);
  loopShape.bezierCurveTo(0.37, 0.16, 0.30, 0.24, 0.19, 0.24);
  loopShape.bezierCurveTo(0.095, 0.24, 0.042, 0.125, 0.01, 0.048);
  loopShape.closePath();

  const loopHole = new THREE.Path();
  loopHole.moveTo(0.068, 0.042);
  loopHole.bezierCurveTo(0.105, 0.125, 0.145, 0.195, 0.205, 0.195);
  loopHole.bezierCurveTo(0.275, 0.195, 0.312, 0.145, 0.302, 0.092);
  loopHole.bezierCurveTo(0.292, 0.042, 0.165, 0.034, 0.068, 0.042);
  loopHole.closePath();
  loopShape.holes.push(loopHole);

  const loopGeo = new THREE.ExtrudeGeometry(loopShape, {
    depth: 0.20,
    bevelEnabled: true,
    bevelThickness: 0.007,
    bevelSize: 0.005,
    bevelSegments: 2,
    curveSegments: 16
  });
  loopGeo.translate(0, 0, -0.10);

  const loopPos = loopGeo.attributes.position;
  for (let i = 0; i < loopPos.count; i++) {
    const vx = loopPos.getX(i);
    const t = Math.min(1, Math.max(0, vx / 0.25));
    const smoothT = t * t * (3 - 2 * t);
    const zScale = 0.24 + 0.86 * smoothT;
    loopPos.setZ(i, loopPos.getZ(i) * zScale);
  }
  loopGeo.computeVertexNormals();

  // 2. Lint-staartjes met V-inkeping (zwaluwstaart)
  const tailShape = new THREE.Shape();
  tailShape.moveTo(0.0, -0.026);
  tailShape.quadraticCurveTo(0.15, -0.052, 0.34, -0.078);
  tailShape.lineTo(0.265, 0.0);
  tailShape.lineTo(0.34, 0.078);
  tailShape.quadraticCurveTo(0.15, 0.052, 0.0, 0.026);
  tailShape.closePath();

  const tailGeo = new THREE.ExtrudeGeometry(tailShape, {
    depth: 0.018,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.003,
    bevelSegments: 1,
    curveSegments: 10
  });
  tailGeo.rotateX(-Math.PI / 2);

  const tailPos = tailGeo.attributes.position;
  for (let i = 0; i < tailPos.count; i++) {
    const vx = tailPos.getX(i);
    const t = Math.min(1, Math.max(0, vx / 0.34));
    const archY = 0.005 + 0.030 * (1 - t) + 0.016 * Math.sin(t * Math.PI);
    tailPos.setY(i, tailPos.getY(i) + archY);
  }
  tailGeo.computeVertexNormals();

  // 3. Middenknoopje
  const knotGeo = new THREE.SphereGeometry(0.068, 14, 12);

  cachedGiftBowGeometries = { loopGeo, tailGeo, knotGeo };
  return cachedGiftBowGeometries;
}

/**
 * Bouwt een schattige 3D cadeau-strik (knoop, 2 uitwaaierende lussen & 2 lint-staartjes).
 */
function createGiftBow(ribbonMat, scale = 1) {
  const { loopGeo, tailGeo, knotGeo } = getGiftBowGeometries();
  const bowGroup = new THREE.Group();
  bowGroup.scale.setScalar(scale);

  const knot = new THREE.Mesh(knotGeo, ribbonMat);
  knot.scale.set(0.95, 0.78, 1.32);
  knot.position.set(0, 0.048, 0);
  knot.castShadow = true;
  bowGroup.add(knot);

  [0, Math.PI].forEach((rotY) => {
    const loop = new THREE.Mesh(loopGeo, ribbonMat);
    loop.rotation.y = rotY;
    loop.castShadow = true;
    bowGroup.add(loop);
  });

  [-0.46, 0.46].forEach((spread) => {
    const tail = new THREE.Mesh(tailGeo, ribbonMat);
    tail.rotation.y = -Math.PI / 2 + spread;
    tail.castShadow = true;
    bowGroup.add(tail);
  });

  return bowGroup;
}


// ============================================================================
// HOOFDSTUK 4: BESNEEUWDE ONDERGROND & NACHTELIJKE HEMEL MET STERREN
// ============================================================================

const environmentGroup = new THREE.Group();
scene.add(environmentGroup);

// Helderder sneeuwmateriaal voor o.a. de sneeuwpop zodat hij goed afsteekt tegen de grond
const snowMaterial = new THREE.MeshStandardMaterial({
  color: PASTEL.snowWhite,
  roughness: 0.85,
  metalness: 0.02
});

// 1. Het grote besneeuwde Noordpool-eiland (zacht pastel met sneeuwtextuur tegen verblinding)
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0xe6e0fa,
  map: createSnowGroundTexture(),
  roughness: 0.94,
  metalness: 0.0
});

const hillMaterial = new THREE.MeshStandardMaterial({
  color: PASTEL.snowHill,
  roughness: 0.92,
  metalness: 0.0
});

const mainIsland = new THREE.Mesh(
  new THREE.CylinderGeometry(22, 20, 2.4, 48),
  groundMaterial
);
mainIsland.position.y = -1.2;
mainIsland.receiveShadow = true;
environmentGroup.add(mainIsland);

// Zachte pastel-lila onderrand van het zwevende sneeuweiland
const islandBase = new THREE.Mesh(
  new THREE.CylinderGeometry(20, 14, 2.2, 36),
  new THREE.MeshStandardMaterial({ color: PASTEL.snowLilac, roughness: 0.9 })
);
islandBase.position.y = -3.2;
environmentGroup.add(islandBase);

// Gezellige ronde sneeuwheuvels binnen de buitenrand zodat het spoor rond het eiland vrij blijft
const hillConfigs = [
  { x: -10.8, z: -9.8,  rx: 4.0, ry: 1.75, rz: 3.3 },
  { x:  11.0, z: -9.5,  rx: 4.0, ry: 1.70, rz: 3.2 },
  { x:   0.0, z: -14.2, rx: 7.0, ry: 2.10, rz: 3.2 },
  { x: -13.0, z:  4.5,  rx: 3.5, ry: 1.30, rz: 3.5 },
  { x:  13.2, z:  4.8,  rx: 3.5, ry: 1.40, rz: 3.3 }
];

const hillGeo = new THREE.SphereGeometry(1, 20, 14);
hillConfigs.forEach((h) => {
  const hill = new THREE.Mesh(hillGeo, hillMaterial);
  hill.scale.set(h.rx, h.ry, h.rz);
  hill.position.set(h.x, -0.35, h.z);
  hill.receiveShadow = true;
  hill.castShadow = true;
  environmentGroup.add(hill);
});

// Schattig pastel stapstenen-pad van de Noordpool naar de Werkplaats
const pathPositions = [
  { x: -3.2, z: 5.2 },
  { x: -2.0, z: 3.9 },
  { x: -0.7, z: 2.7 },
  { x: 0.4,  z: 1.4 },
  { x: 1.2,  z: 0.0 },
  { x: 1.4,  z: -0.35 }
];

pathPositions.forEach((pos, idx) => {
  const stoneColor = PASTEL.rainbowHex[idx % PASTEL.rainbowHex.length];
  const stone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.66, 0.75, 0.18, 16),
    new THREE.MeshStandardMaterial({ color: stoneColor, roughness: 0.55 })
  );
  stone.position.set(pos.x, 0.07, pos.z);
  stone.castShadow = true;
  stone.receiveShadow = true;
  environmentGroup.add(stone);
});

// 2. Nachtelijke hemel met 900 pastel-gekleurde sterren
const starCount = 900;
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);
const starColors = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  // Verdeel de sterren in een grote koepel rond de hele Noordpool
  const radius = 55 + Math.random() * 55;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * (Math.PI * 0.48); // Alleen boven de horizon

  starPositions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
  starPositions[i * 3 + 1] = radius * Math.cos(phi) + 4;
  starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

  // Geef elke ster een zachte pastel-tint
  const hex = PASTEL.rainbowHex[i % PASTEL.rainbowHex.length];
  const c = new THREE.Color(hex).lerp(new THREE.Color(0xffffff), 0.45);
  starColors[i * 3]     = c.r;
  starColors[i * 3 + 1] = c.g;
  starColors[i * 3 + 2] = c.b;
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

const starMaterial = new THREE.PointsMaterial({
  size: 1.35,
  map: createSnowflakeTexture(),
  vertexColors: true,
  transparent: true,
  opacity: 0.92,
  depthWrite: false
});

const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

// Grote dromerige pastel-maan in de lucht
const moonGroup = new THREE.Group();
moonGroup.position.set(22, 26, -32);
scene.add(moonGroup);

const moonMesh = new THREE.Mesh(
  new THREE.SphereGeometry(3.6, 24, 24),
  new THREE.MeshBasicMaterial({ color: 0xfff5c0 })
);
moonGroup.add(moonMesh);

const moonHalo = new THREE.Mesh(
  new THREE.SphereGeometry(4.8, 24, 24),
  new THREE.MeshBasicMaterial({
    color: 0xffd6ff,
    transparent: true,
    opacity: 0.22
  })
);
moonGroup.add(moonHalo);


// ============================================================================
// HOOFDSTUK 5: DE ECHTE NOORDPOOL (ROOD-WIT GESTREEPTE PAAL OP 90° N)
// ============================================================================

// Lijst waarin we alle klikbare 3D-objecten bewaren voor Raycasting (Hoofdstuk 10)
const clickableObjects = [];

const northPoleGroup = new THREE.Group();
northPoleGroup.position.set(-4.8, 0, 6.2);
scene.add(northPoleGroup);

// Sneeuw-voetstuk met pastel-gouden sierband
const poleBase = new THREE.Mesh(
  new THREE.CylinderGeometry(1.15, 1.35, 0.35, 24),
  new THREE.MeshStandardMaterial({ color: PASTEL.snowLilac, roughness: 0.7 })
);
poleBase.position.y = 0.17;
poleBase.receiveShadow = true;
northPoleGroup.add(poleBase);

const poleBaseRing = new THREE.Mesh(
  new THREE.TorusGeometry(1.15, 0.09, 12, 32),
  new THREE.MeshStandardMaterial({
    color: PASTEL.goldSoft,
    emissive: 0xffb703,
    emissiveIntensity: 0.25,
    roughness: 0.3
  })
);
poleBaseRing.rotation.x = Math.PI / 2;
poleBaseRing.position.y = 0.34;
northPoleGroup.add(poleBaseRing);

// De rood-wit gestreepte paal zelf: opgebouwd uit 8 gestapelde cilinders!
const stripeRedMat = new THREE.MeshStandardMaterial({ color: PASTEL.poleRed, roughness: 0.4 });
const stripeWhiteMat = new THREE.MeshStandardMaterial({ color: PASTEL.poleWhite, roughness: 0.4 });
const poleStripesGroup = new THREE.Group();
northPoleGroup.add(poleStripesGroup);

const stripeCount = 8;
const stripeHeight = 0.42;
for (let i = 0; i < stripeCount; i++) {
  const mat = i % 2 === 0 ? stripeRedMat : stripeWhiteMat;
  const segment = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, stripeHeight, 20),
    mat
  );
  segment.position.y = 0.35 + stripeHeight / 2 + i * stripeHeight;
  segment.castShadow = true;
  poleStripesGroup.add(segment);
}

// Glanzende bol bovenop de Noordpool-paal + schattig zwevend sterretje
const poleTopY = 0.35 + stripeCount * stripeHeight;
const poleTopBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.42, 20, 20),
  new THREE.MeshStandardMaterial({
    color: PASTEL.goldSoft,
    emissive: 0xffd166,
    emissiveIntensity: 0.35,
    roughness: 0.2,
    metalness: 0.3
  })
);
poleTopBall.position.y = poleTopY + 0.22;
poleStripesGroup.add(poleTopBall);

// Bordje "90° N — NOORDPOOL" aan de paal
const signTex90N = createSignTexture(
  '90° N',
  '✨ De Noordpool ✨',
  '#fff0f6',
  '#ff7597',
  '#4a2545'
);
const signBoard = new THREE.Mesh(
  new THREE.BoxGeometry(2.1, 0.82, 0.14),
  new THREE.MeshStandardMaterial({ map: signTex90N, roughness: 0.5 })
);
signBoard.position.set(0, poleTopY - 0.55, 0.28);
signBoard.castShadow = true;
poleStripesGroup.add(signBoard);

// Gloeiring op de grond die uitdijt als je op de Noordpool klikt
const pulseRingGeo = new THREE.RingGeometry(0.8, 1.15, 36);
const pulseRingMat = new THREE.MeshBasicMaterial({
  color: 0xff9ebb,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.0
});
const northPolePulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
northPolePulseRing.rotation.x = -Math.PI / 2;
northPolePulseRing.position.y = 0.06;
northPoleGroup.add(northPolePulseRing);

// Maak de Noordpool-paal klikbaar via Raycasting
northPoleGroup.userData = {
  interactive: true,
  type: 'noordpool',
  spinVelocity: 0,
  pulseProgress: 0
};
clickableObjects.push(northPoleGroup);


// ============================================================================
// HOOFDSTUK 6: DE WERKPLAATS VAN DE KERSTMAN (UITGEBREID & PRIMITIEVE VORMEN)
// ============================================================================
// Volledig opgebouwd uit BoxGeometry, CylinderGeometry, ConeGeometry,
// SphereGeometry en TorusGeometry — met twee vleugels, veranda, klokkentorentje,
// dakkapel, brievenbus, draaiend speelgoedrad en een buiten-inpaktafel!

const workshopGroup = new THREE.Group();
workshopGroup.position.set(1.8, 0, -4.5);
scene.add(workshopGroup);

// Gedeelde materialen & geometrieën voor 60 FPS prestaties
const woodMat = new THREE.MeshStandardMaterial({ color: PASTEL.woodCozy, roughness: 0.8 });
const roofSnowMat = new THREE.MeshStandardMaterial({ color: PASTEL.snowWhite, roughness: 0.75 });
const stonePlinthMat = new THREE.MeshStandardMaterial({ color: PASTEL.stoneSoft, roughness: 0.85 });
const shutterMat = new THREE.MeshStandardMaterial({ color: PASTEL.doorMint, roughness: 0.55 });
const candyRedMat = new THREE.MeshStandardMaterial({ color: PASTEL.poleRed, roughness: 0.35 });
const candyWhiteMat = new THREE.MeshStandardMaterial({ color: PASTEL.poleWhite, roughness: 0.35 });
const goldTrimMat = new THREE.MeshStandardMaterial({
  color: PASTEL.goldSoft,
  emissive: 0xffd166,
  emissiveIntensity: 0.22,
  metalness: 0.45,
  roughness: 0.25
});
const icicleMat = new THREE.MeshStandardMaterial({
  color: 0xdaf4ff,
  emissive: 0x9fe6ff,
  emissiveIntensity: 0.15,
  roughness: 0.15,
  transparent: true,
  opacity: 0.85
});
const windowMat = new THREE.MeshStandardMaterial({
  color: PASTEL.windowGlow,
  emissive: 0xffd166,
  emissiveIntensity: 0.85,
  roughness: 0.2
});

// Bewaar geanimeerde onderdelen en posities voor de regenbooglampjes
const workshopBulbAnchors = [];
const workshopLanternPivots = [];

/**
 * Hulpfunctie: bouwt een raam met kozijn-kruis, besneeuwde vensterbank,
 * optionele pastel-mint luikjes en een bloembakje met dennentakjes & besjes.
 */
function addWorkshopWindow(x, y, z, w, h, rotY = 0, withShutters = true, withPlanter = true) {
  const winGroup = new THREE.Group();
  winGroup.position.set(x, y, z);
  winGroup.rotation.y = rotY;

  const winGlass = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.12), windowMat);
  winGroup.add(winGlass);

  // Houten buitenomlijsting + kozijn-kruis
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(w + 0.18, 0.1, 0.16), woodMat);
  frameTop.position.set(0, h / 2 + 0.04, 0.02);
  winGroup.add(frameTop);

  const barV = new THREE.Mesh(new THREE.BoxGeometry(0.1, h + 0.06, 0.16), woodMat);
  barV.position.z = 0.02;
  winGroup.add(barV);

  const barH = new THREE.Mesh(new THREE.BoxGeometry(w + 0.06, 0.1, 0.16), woodMat);
  barH.position.z = 0.02;
  winGroup.add(barH);

  // Besneeuwde vensterbank
  const sill = new THREE.Mesh(new THREE.BoxGeometry(w + 0.34, 0.18, 0.34), roofSnowMat);
  sill.position.set(0, -h / 2 - 0.08, 0.11);
  winGroup.add(sill);

  // Pastel-mint houten luikjes naast het raam
  if (withShutters) {
    const shutterW = 0.32;
    [-1, 1].forEach((side) => {
      const shutter = new THREE.Mesh(new THREE.BoxGeometry(shutterW, h, 0.08), shutterMat);
      shutter.position.set(side * (w / 2 + shutterW / 2 + 0.08), 0, 0.03);
      shutter.castShadow = true;
      winGroup.add(shutter);
    });
  }

  // Gezellig bloembakje met dennengroen en pastel besjes onder het raam
  if (withPlanter) {
    const planter = new THREE.Mesh(new THREE.BoxGeometry(w + 0.14, 0.22, 0.28), woodMat);
    planter.position.set(0, -h / 2 - 0.24, 0.14);
    winGroup.add(planter);

    const greens = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.06, 0.12, 0.22),
      new THREE.MeshStandardMaterial({ color: PASTEL.treeMint1, roughness: 0.7 })
    );
    greens.position.set(0, -h / 2 - 0.12, 0.15);
    winGroup.add(greens);

    for (let b = -1; b <= 1; b++) {
      const berry = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 8, 8),
        new THREE.MeshBasicMaterial({ color: PASTEL.rainbowHex[(b + 2) % PASTEL.rainbowHex.length] })
      );
      berry.position.set(b * (w * 0.28), -h / 2 - 0.08, 0.25);
      winGroup.add(berry);
    }
  }

  workshopGroup.add(winGroup);
}

/**
 * Hulpfunctie: bouwt een rood-wit gestreepte zuurstok-paal (Candy Cane pilaar).
 */
function createCandyCaneColumn(radius, totalHeight, segments) {
  const col = new THREE.Group();
  const segH = totalHeight / segments;
  const segGeo = new THREE.CylinderGeometry(radius, radius, segH, 12);
  for (let i = 0; i < segments; i++) {
    const seg = new THREE.Mesh(segGeo, i % 2 === 0 ? candyRedMat : candyWhiteMat);
    seg.position.y = segH / 2 + i * segH;
    seg.castShadow = true;
    col.add(seg);
  }
  return col;
}

// ----------------------------------------------------------------------------
// 1. HOOFDGEBOUW (Pastel aardbei-roze blokhut met plint, sierbalken & dakkapel)
// ----------------------------------------------------------------------------
const mainPlinth = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.26, 5.5), stonePlinthMat);
mainPlinth.position.set(0, 0.13, 0);
mainPlinth.receiveShadow = true;
workshopGroup.add(mainPlinth);

const mainWalls = new THREE.Mesh(
  new THREE.BoxGeometry(7.2, 4.2, 5.2),
  new THREE.MeshStandardMaterial({ color: PASTEL.wallPink, roughness: 0.7 })
);
mainWalls.position.y = 2.1;
mainWalls.castShadow = true;
mainWalls.receiveShadow = true;
workshopGroup.add(mainWalls);

// Houten hoekbalken (CylinderGeometry) + dakrand-sierbalken
const cornerOffsets = [
  [-3.6, -2.6], [3.6, -2.6],
  [-3.6,  2.6], [3.6,  2.6]
];
const mainPillarGeo = new THREE.CylinderGeometry(0.24, 0.24, 4.3, 12);
cornerOffsets.forEach(([cx, cz]) => {
  const pillar = new THREE.Mesh(mainPillarGeo, woodMat);
  pillar.position.set(cx, 2.15, cz);
  pillar.castShadow = true;
  workshopGroup.add(pillar);
});

[-2.62, 2.62].forEach((bz) => {
  const eaveBeam = new THREE.Mesh(new THREE.BoxGeometry(7.35, 0.18, 0.16), woodMat);
  eaveBeam.position.set(0, 4.08, bz);
  workshopGroup.add(eaveBeam);
});

// ----------------------------------------------------------------------------
// 2. RECHTER ZIJ-ATELIER (Pastel lavendel speelgoedmakerij + houtstapel)
// ----------------------------------------------------------------------------
const annexPlinth = new THREE.Mesh(new THREE.BoxGeometry(3.65, 0.24, 4.05), stonePlinthMat);
annexPlinth.position.set(4.8, 0.12, -0.3);
annexPlinth.receiveShadow = true;
workshopGroup.add(annexPlinth);

const sideAnnex = new THREE.Mesh(
  new THREE.BoxGeometry(3.4, 3.1, 3.8),
  new THREE.MeshStandardMaterial({ color: PASTEL.wallLavender, roughness: 0.7 })
);
sideAnnex.position.set(4.8, 1.55, -0.3);
sideAnnex.castShadow = true;
sideAnnex.receiveShadow = true;
workshopGroup.add(sideAnnex);

const annexPillarGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.18, 10);
[[6.5, -2.2], [6.5, 1.6]].forEach(([px, pz]) => {
  const ap = new THREE.Mesh(annexPillarGeo, woodMat);
  ap.position.set(px, 1.59, pz);
  ap.castShadow = true;
  workshopGroup.add(ap);
});

// Besneeuwd kegeldakje op het zij-atelier + gouden dakknop
const annexRoof = new THREE.Mesh(new THREE.ConeGeometry(3.1, 2.3, 4), roofSnowMat);
annexRoof.position.set(4.8, 4.2, -0.3);
annexRoof.rotation.y = Math.PI / 4;
annexRoof.castShadow = true;
workshopGroup.add(annexRoof);

const annexFinial = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), goldTrimMat);
annexFinial.position.set(4.8, 5.42, -0.3);
workshopGroup.add(annexFinial);

// Sneeuwdruppels + regenbooglampjes aan het zij-atelier
for (let ax = 3.6; ax <= 6.2; ax += 0.65) {
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.19, 8, 8), roofSnowMat);
  drop.position.set(ax, 3.06, 1.82);
  workshopGroup.add(drop);
  workshopBulbAnchors.push({ x: ax, y: 2.98, z: 1.94 });
}

// Uithangbordje op het zij-atelier ("Atelier")
const annexSignTex = createSignTexture(
  'Speelgoed',
  '✨ Atelier ✨',
  '#f8edff',
  '#b892ff',
  '#4a2545',
  { width: 384, height: 160 }
);
const annexSign = new THREE.Mesh(
  new THREE.BoxGeometry(1.55, 0.65, 0.12),
  new THREE.MeshStandardMaterial({ map: annexSignTex, roughness: 0.45 })
);
annexSign.position.set(4.8, 2.75, 1.68);
workshopGroup.add(annexSign);

// Stapeltje gezellig haardhout onder een afdakje naast het zij-atelier
const woodPileGroup = new THREE.Group();
woodPileGroup.position.set(6.15, 0, 2.02);
workshopGroup.add(woodPileGroup);

const logGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.62, 8);
for (let row = 0; row < 3; row++) {
  const count = 4 - row;
  for (let col = 0; col < count; col++) {
    const log = new THREE.Mesh(logGeo, woodMat);
    log.rotation.x = Math.PI / 2;
    log.position.set((col - (count - 1) / 2) * 0.23, 0.12 + row * 0.19, 0);
    log.castShadow = true;
    woodPileGroup.add(log);
  }
}
const woodSnowCap = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 0.68), roofSnowMat);
woodSnowCap.position.set(0, 0.68, 0);
woodPileGroup.add(woodSnowCap);

// ----------------------------------------------------------------------------
// 3. NIEUWE LINKER VLEUGEL (Pastel babyblauwe Inpak- & Pakjesvleugel + Rad!)
// ----------------------------------------------------------------------------
const leftPlinth = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.24, 3.25), stonePlinthMat);
leftPlinth.position.set(-4.8, 0.12, 0.05);
leftPlinth.receiveShadow = true;
workshopGroup.add(leftPlinth);

const leftWingMat = new THREE.MeshStandardMaterial({ color: PASTEL.wallBlue, roughness: 0.7 });
const leftWing = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.0, 3.0), leftWingMat);
leftWing.position.set(-4.8, 1.5, 0.05);
leftWing.castShadow = true;
leftWing.receiveShadow = true;
workshopGroup.add(leftWing);

const leftPillarGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.08, 10);
[[-6.0, -1.45], [-6.0, 1.55]].forEach(([px, pz]) => {
  const lp = new THREE.Mesh(leftPillarGeo, woodMat);
  lp.position.set(px, 1.54, pz);
  lp.castShadow = true;
  workshopGroup.add(lp);
});

// Puntgevel & dubbel schuin besneeuwd dak op de linker vleugel
const leftGableFill = new THREE.Mesh(
  new THREE.CylinderGeometry(1.386, 1.386, 2.98, 3),
  leftWingMat
);
leftGableFill.rotation.x = -Math.PI / 2;
leftGableFill.scale.set(1, 1, 0.45);
leftGableFill.position.set(-4.8, 3.31, 0.05);
workshopGroup.add(leftGableFill);

const leftRoofGeo = new THREE.BoxGeometry(1.82, 0.28, 3.48);
const leftWingRoofL = new THREE.Mesh(leftRoofGeo, roofSnowMat);
leftWingRoofL.position.set(-5.48, 3.56, 0.05);
leftWingRoofL.rotation.z = 0.65;
leftWingRoofL.castShadow = true;
workshopGroup.add(leftWingRoofL);

const leftWingRoofR = new THREE.Mesh(leftRoofGeo, roofSnowMat);
leftWingRoofR.position.set(-4.12, 3.56, 0.05);
leftWingRoofR.rotation.z = -0.65;
leftWingRoofR.castShadow = true;
workshopGroup.add(leftWingRoofR);

// Rood-wit gestreept etalage-luifeltje boven het raam van de linker vleugel
for (let s = 0; s < 6; s++) {
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.14, 0.56),
    s % 2 === 0 ? candyRedMat : candyWhiteMat
  );
  stripe.position.set(-5.5 + s * 0.28, 2.58, 1.76);
  stripe.rotation.x = 0.32;
  stripe.castShadow = true;
  workshopGroup.add(stripe);
}

// Magisch draaiend Speelgoedrad aan de linkergevel
const workshopGearGroup = new THREE.Group();
workshopGearGroup.position.set(-6.08, 1.9, 0.05);
workshopGearGroup.rotation.y = -Math.PI / 2;
workshopGroup.add(workshopGearGroup);

const gearRing = new THREE.Mesh(
  new THREE.TorusGeometry(0.68, 0.09, 10, 24),
  candyRedMat
);
workshopGearGroup.add(gearRing);

const gearHub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.18, 12), goldTrimMat);
gearHub.rotation.x = Math.PI / 2;
workshopGearGroup.add(gearHub);

const spokeGeo = new THREE.BoxGeometry(1.32, 0.1, 0.08);
for (let sp = 0; sp < 3; sp++) {
  const spoke = new THREE.Mesh(spokeGeo, goldTrimMat);
  spoke.rotation.z = (sp / 3) * Math.PI;
  workshopGearGroup.add(spoke);
}

const cogGeo = new THREE.BoxGeometry(0.16, 0.16, 0.12);
for (let c = 0; c < 8; c++) {
  const a = (c / 8) * Math.PI * 2;
  const cog = new THREE.Mesh(
    cogGeo,
    new THREE.MeshStandardMaterial({ color: PASTEL.rainbowHex[c % PASTEL.rainbowHex.length], roughness: 0.4 })
  );
  cog.position.set(Math.cos(a) * 0.78, Math.sin(a) * 0.78, 0);
  cog.rotation.z = a;
  workshopGearGroup.add(cog);
}

// Buiten-inpaktafel met mini-cadeautjes, speelgoedbeertje & zuurstokken voor de linker vleugel
const packingTableGroup = new THREE.Group();
packingTableGroup.position.set(-4.85, 0, 2.25);
workshopGroup.add(packingTableGroup);

const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.1, 0.85), woodMat);
tableTop.position.y = 0.74;
tableTop.castShadow = true;
tableTop.receiveShadow = true;
packingTableGroup.add(tableTop);

const legGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.72, 8);
[[-0.64, -0.32], [0.64, -0.32], [-0.64, 0.32], [0.64, 0.32]].forEach(([lx, lz]) => {
  const leg = new THREE.Mesh(legGeo, woodMat);
  leg.position.set(lx, 0.36, lz);
  leg.castShadow = true;
  packingTableGroup.add(leg);
});

// Mini-cadeautjes op & onder de inpaktafel
const miniGifts = [
  { x: -0.45, y: 0.91, z: 0.08, s: 0.24, c: 0xff9ebb, r: 0xfff3a1 },
  { x: -0.18, y: 0.88, z: -0.1, s: 0.19, c: 0xa8f0c6, r: 0xff7597 },
  { x: 0.38,  y: 0.18, z: 0.05, s: 0.36, c: 0xa3d8ff, r: 0xffdf85 },
  { x: -0.32, y: 0.16, z: 0.1,  s: 0.32, c: 0xd8bfff, r: 0xa8f0c6 }
];
miniGifts.forEach((mg) => {
  const miniGift = new THREE.Group();
  miniGift.position.set(mg.x, mg.y, mg.z);
  packingTableGroup.add(miniGift);

  const gBox = new THREE.Mesh(
    new THREE.BoxGeometry(mg.s, mg.s, mg.s),
    new THREE.MeshStandardMaterial({ color: mg.c, roughness: 0.45 })
  );
  gBox.castShadow = true;
  miniGift.add(gBox);

  const gRibMat = new THREE.MeshStandardMaterial({ color: mg.r, roughness: 0.35 });
  miniGift.add(new THREE.Mesh(new THREE.BoxGeometry(mg.s + 0.02, mg.s + 0.02, mg.s * 0.24), gRibMat));
  miniGift.add(new THREE.Mesh(new THREE.BoxGeometry(mg.s * 0.24, mg.s + 0.02, mg.s + 0.02), gRibMat));

  const gBow = createGiftBow(gRibMat, mg.s * 1.05);
  gBow.position.set(0, mg.s / 2 + 0.01, 0);
  miniGift.add(gBow);
});

// Schattig klein teddybeertje op de werkbank
const bearGroup = new THREE.Group();
bearGroup.position.set(0.32, 0.79, 0.05);
bearGroup.rotation.y = -0.3;
packingTableGroup.add(bearGroup);

const bearMat = new THREE.MeshStandardMaterial({ color: 0xe6b89c, roughness: 0.7 });
const bearBody = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 10), bearMat);
bearBody.position.y = 0.14;
bearGroup.add(bearBody);

const bearHead = new THREE.Mesh(new THREE.SphereGeometry(0.115, 10, 10), bearMat);
bearHead.position.y = 0.34;
bearGroup.add(bearHead);

[-0.08, 0.08].forEach((ex) => {
  const ear = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), bearMat);
  ear.position.set(ex, 0.43, 0);
  bearGroup.add(ear);
});

// Zuurstok-tonnetje naast de inpaktafel
const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 0.48, 12), woodMat);
barrel.position.set(-5.95, 0.24, 2.18);
barrel.castShadow = true;
workshopGroup.add(barrel);

[-0.07, 0.07].forEach((cx, idx) => {
  const cane = createCandyCaneColumn(0.038, 0.48, 6);
  cane.position.set(-5.95 + cx, 0.42, 2.18);
  cane.rotation.z = idx === 0 ? 0.18 : -0.14;
  workshopGroup.add(cane);
});

// ----------------------------------------------------------------------------
// 4. DIK BESNEEUWD HOOFDDAK, NOKBALK, DAKKAPEL & KLOKKENTORENTJE
// ----------------------------------------------------------------------------
const roofLeft = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.45, 3.9), roofSnowMat);
roofLeft.position.set(0, 5.15, -1.4);
roofLeft.rotation.x = -Math.PI * 0.21;
roofLeft.castShadow = true;
workshopGroup.add(roofLeft);

const roofRight = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.45, 3.9), roofSnowMat);
roofRight.position.set(0, 5.15, 1.4);
roofRight.rotation.x = Math.PI * 0.21;
roofRight.castShadow = true;
workshopGroup.add(roofRight);

// Geveltop onder de nok (CylinderGeometry met 3 zijden = driehoekig prisma)
const gableRoofFill = new THREE.Mesh(
  new THREE.CylinderGeometry(2.98, 2.98, 7.18, 3),
  new THREE.MeshStandardMaterial({ color: PASTEL.roofCream, roughness: 0.7 })
);
gableRoofFill.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
gableRoofFill.scale.set(1, 1, 0.45);
gableRoofFill.position.set(0, 4.86, 0);
workshopGroup.add(gableRoofFill);

// Gouden nokbalk met eindbollen langs de top van het dak
const ridgeBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 8.3, 10), goldTrimMat);
ridgeBeam.rotation.z = Math.PI / 2;
ridgeBeam.position.set(0, 6.24, 0);
workshopGroup.add(ridgeBeam);

[-4.2, 4.2].forEach((fx) => {
  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), goldTrimMat);
  finial.position.set(fx, 6.26, 0);
  workshopGroup.add(finial);
});

// Dakkapel (zolderraampje) midden op het voordak
const dormerGroup = new THREE.Group();
dormerGroup.position.set(0, 5.05, 1.55);
workshopGroup.add(dormerGroup);

const dormerBox = new THREE.Mesh(
  new THREE.BoxGeometry(1.55, 1.25, 1.45),
  new THREE.MeshStandardMaterial({ color: PASTEL.roofCream, roughness: 0.7 })
);
dormerBox.castShadow = true;
dormerGroup.add(dormerBox);

const dormerGable = new THREE.Mesh(
  new THREE.CylinderGeometry(0.92, 0.92, 1.43, 3),
  new THREE.MeshStandardMaterial({ color: PASTEL.wallPink, roughness: 0.7 })
);
dormerGable.rotation.x = -Math.PI / 2;
dormerGable.scale.set(1, 1, 0.48);
dormerGable.position.y = 0.84;
dormerGroup.add(dormerGable);

const dormerRoofSlopeGeo = new THREE.BoxGeometry(1.18, 0.2, 1.75);
const dormerRoofL = new THREE.Mesh(dormerRoofSlopeGeo, roofSnowMat);
dormerRoofL.position.set(-0.46, 0.98, 0.04);
dormerRoofL.rotation.z = 0.62;
dormerGroup.add(dormerRoofL);

const dormerRoofR = new THREE.Mesh(dormerRoofSlopeGeo, roofSnowMat);
dormerRoofR.position.set(0.46, 0.98, 0.04);
dormerRoofR.rotation.z = -0.62;
dormerGroup.add(dormerRoofR);

const dormerWin = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.14, 16), windowMat);
dormerWin.rotation.x = Math.PI / 2;
dormerWin.position.set(0, 0.04, 0.72);
dormerGroup.add(dormerWin);

const dormerBarV = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.76, 0.16), woodMat);
dormerBarV.position.set(0, 0.04, 0.73);
dormerGroup.add(dormerBarV);

const dormerBarH = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.07, 0.16), woodMat);
dormerBarH.position.set(0, 0.04, 0.73);
dormerGroup.add(dormerBarH);

// Klokkentorentje (Cupola) rechts op de nok van het dak
const cupolaGroup = new THREE.Group();
cupolaGroup.position.set(1.75, 6.2, 0);
workshopGroup.add(cupolaGroup);

const cupolaBase = new THREE.Mesh(
  new THREE.BoxGeometry(1.36, 0.8, 1.36),
  new THREE.MeshStandardMaterial({ color: PASTEL.wallLavender, roughness: 0.65 })
);
cupolaBase.position.y = 0.25;
cupolaBase.castShadow = true;
cupolaGroup.add(cupolaBase);

const cupolaBody = new THREE.Mesh(
  new THREE.BoxGeometry(1.06, 0.9, 1.06),
  new THREE.MeshStandardMaterial({ color: PASTEL.roofCream, roughness: 0.65 })
);
cupolaBody.position.y = 1.05;
cupolaBody.castShadow = true;
cupolaGroup.add(cupolaBody);

const cupolaPillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.96, 8);
[[-0.54, -0.54], [0.54, -0.54], [-0.54, 0.54], [0.54, 0.54]].forEach(([cx, cz]) => {
  const cp = new THREE.Mesh(cupolaPillarGeo, woodMat);
  cp.position.set(cx, 1.08, cz);
  cupolaGroup.add(cp);
});

const clockTex = createClockTexture();
const clockFaceGeo = new THREE.CircleGeometry(0.41, 20);
const clockFaceMat = new THREE.MeshStandardMaterial({
  map: clockTex,
  emissive: 0xffe8b0,
  emissiveIntensity: 0.22,
  roughness: 0.35
});
const clockFront = new THREE.Mesh(clockFaceGeo, clockFaceMat);
clockFront.position.set(0, 1.06, 0.54);
cupolaGroup.add(clockFront);

const clockBack = new THREE.Mesh(clockFaceGeo, clockFaceMat);
clockBack.rotation.y = Math.PI;
clockBack.position.set(0, 1.06, -0.54);
cupolaGroup.add(clockBack);

const cupolaSpire = new THREE.Mesh(new THREE.ConeGeometry(1.06, 1.15, 4), roofSnowMat);
cupolaSpire.rotation.y = Math.PI / 4;
cupolaSpire.position.y = 2.08;
cupolaSpire.castShadow = true;
cupolaGroup.add(cupolaSpire);

const cupolaStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), goldTrimMat);
cupolaStar.position.y = 2.82;
cupolaGroup.add(cupolaStar);

// Schattige sneeuwdruppels & glinsterende ijspegels langs voor- en achterdakrand
const icicleGeo = new THREE.ConeGeometry(0.075, 0.36, 6);
const snowDropGeo = new THREE.SphereGeometry(0.24, 10, 10);
for (let i = -3.6; i <= 3.6; i += 0.72) {
  const snowDropFront = new THREE.Mesh(snowDropGeo, roofSnowMat);
  snowDropFront.position.set(i, 4.02, 2.95);
  workshopGroup.add(snowDropFront);

  const snowDropBack = new THREE.Mesh(snowDropGeo, roofSnowMat);
  snowDropBack.position.set(i, 4.02, -2.95);
  workshopGroup.add(snowDropBack);

  if (i < 3.4) {
    const icicle = new THREE.Mesh(icicleGeo, icicleMat);
    icicle.rotation.x = Math.PI;
    icicle.position.set(i + 0.36, 3.78, 2.92);
    workshopGroup.add(icicle);
  }
}

// ----------------------------------------------------------------------------
// 5. SCHOORSTEEN MET SIERKRAAG & DUBBELE ROOKPIJPJES
// ----------------------------------------------------------------------------
const chimney = new THREE.Mesh(
  new THREE.BoxGeometry(0.95, 2.4, 0.95),
  new THREE.MeshStandardMaterial({ color: PASTEL.poleRed, roughness: 0.6 })
);
chimney.position.set(-2.1, 5.8, -1.1);
chimney.castShadow = true;
workshopGroup.add(chimney);

const chimneyCollar = new THREE.Mesh(
  new THREE.BoxGeometry(1.08, 0.22, 1.08),
  new THREE.MeshStandardMaterial({ color: PASTEL.roofCream, roughness: 0.65 })
);
chimneyCollar.position.set(-2.1, 6.45, -1.1);
workshopGroup.add(chimneyCollar);

const chimneyCap = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.28, 1.18), roofSnowMat);
chimneyCap.position.set(-2.1, 7.0, -1.1);
workshopGroup.add(chimneyCap);

const flueGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.34, 10);
[-0.22, 0.22].forEach((ox) => {
  const flue = new THREE.Mesh(flueGeo, woodMat);
  flue.position.set(-2.1 + ox, 7.18, -1.1);
  workshopGroup.add(flue);
});

// ----------------------------------------------------------------------------
// 6. GEZELLIGE VERANDA, ZUURSTOK-PILAREN, VOORDEUR & BRIEVENBUS
// ----------------------------------------------------------------------------
// Veranda-vlonder + trapje (sluit aan op het stapstenen-pad!)
const porchDeck = new THREE.Mesh(new THREE.BoxGeometry(3.35, 0.2, 1.1), woodMat);
porchDeck.position.set(0, 0.1, 3.05);
porchDeck.castShadow = true;
porchDeck.receiveShadow = true;
workshopGroup.add(porchDeck);

const porchStep = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.11, 0.44), woodMat);
porchStep.position.set(0, 0.055, 3.78);
porchStep.receiveShadow = true;
workshopGroup.add(porchStep);

const welcomeMat = new THREE.Mesh(
  new THREE.BoxGeometry(1.15, 0.03, 0.6),
  new THREE.MeshStandardMaterial({ color: PASTEL.poleRed, roughness: 0.9 })
);
welcomeMat.position.set(0, 0.215, 3.08);
workshopGroup.add(welcomeMat);

// Twee zuurstok-pilaren voor het entree-afdak
[-1.4, 1.4].forEach((px) => {
  const col = createCandyCaneColumn(0.11, 2.55, 8);
  col.position.set(px, 0.2, 3.42);
  workshopGroup.add(col);

  const colBase = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.12, 12), goldTrimMat);
  colBase.position.set(px, 0.26, 3.42);
  workshopGroup.add(colBase);
});

// Entree-afdak (veranda-dakje)
const porchCanopy = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.22, 1.38), roofSnowMat);
porchCanopy.position.set(0, 2.95, 3.22);
porchCanopy.rotation.x = 0.2;
porchCanopy.castShadow = true;
workshopGroup.add(porchCanopy);

const porchFascia = new THREE.Mesh(new THREE.BoxGeometry(3.45, 0.24, 0.16), woodMat);
porchFascia.position.set(0, 2.75, 3.74);
workshopGroup.add(porchFascia);

// Naambord ("Kerstman's Werkplaats") prominent op het veranda-afdak!
const workshopSignTex = createSignTexture(
  "Kerstman's Werkplaats",
  '🎁 Speelgoed & Knuffels 🎁',
  '#fff8dc',
  '#ff9ebb',
  '#522b47',
  { width: 768, height: 196 }
);
const workshopSign = new THREE.Mesh(
  new THREE.BoxGeometry(3.35, 0.84, 0.14),
  new THREE.MeshStandardMaterial({ map: workshopSignTex, roughness: 0.4 })
);
workshopSign.position.set(0, 3.16, 3.86);
workshopGroup.add(workshopSign);

// Twee zacht wiebelende hanglantaarns onder het afdak
[-1.02, 1.02].forEach((lx) => {
  const lanternPivot = new THREE.Group();
  lanternPivot.position.set(lx, 2.78, 3.48);

  const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.22, 6), goldTrimMat);
  chain.position.y = -0.11;
  lanternPivot.add(chain);

  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.12, 8), woodMat);
  cap.position.y = -0.24;
  lanternPivot.add(cap);

  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), windowMat);
  bulb.position.y = -0.36;
  lanternPivot.add(bulb);

  workshopGroup.add(lanternPivot);
  workshopLanternPivots.push(lanternPivot);
});

// Zuurstok-paaltjes naast het veranda-trapje
[-1.26, 1.26].forEach((px) => {
  const miniPost = createCandyCaneColumn(0.075, 0.72, 6);
  miniPost.position.set(px, 0, 3.92);
  workshopGroup.add(miniPost);

  const topper = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), goldTrimMat);
  topper.position.set(px, 0.78, 3.92);
  workshopGroup.add(topper);
});

// Voordeur + ronde boog + gouden knop + kerstkrans
const doorMesh = new THREE.Mesh(
  new THREE.BoxGeometry(1.45, 2.25, 0.2),
  shutterMat
);
doorMesh.position.set(0, 1.32, 2.62);
workshopGroup.add(doorMesh);

const doorArch = new THREE.Mesh(
  new THREE.CylinderGeometry(0.725, 0.725, 0.2, 20),
  shutterMat
);
doorArch.rotation.x = Math.PI / 2;
doorArch.position.set(0, 2.42, 2.62);
workshopGroup.add(doorArch);

const doorKnob = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), goldTrimMat);
doorKnob.position.set(0.45, 1.28, 2.76);
workshopGroup.add(doorKnob);

const wreath = new THREE.Mesh(
  new THREE.TorusGeometry(0.34, 0.1, 12, 24),
  new THREE.MeshStandardMaterial({ color: PASTEL.treeMint1, roughness: 0.6 })
);
wreath.position.set(0, 2.18, 2.75);
workshopGroup.add(wreath);

for (let b = 0; b < 6; b++) {
  const angle = (b / 6) * Math.PI * 2;
  const berry = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 8, 8),
    new THREE.MeshBasicMaterial({ color: PASTEL.rainbowHex[b] })
  );
  berry.position.set(Math.cos(angle) * 0.34, 2.18 + Math.sin(angle) * 0.34, 2.84);
  workshopGroup.add(berry);
}

// Kerstman's Brievenbus voor Verlanglijstjes naast de veranda
const mailboxGroup = new THREE.Group();
mailboxGroup.position.set(-2.05, 0, 3.55);
mailboxGroup.rotation.y = 0.25;
workshopGroup.add(mailboxGroup);

const mailPost = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.95, 10), woodMat);
mailPost.position.y = 0.475;
mailPost.castShadow = true;
mailboxGroup.add(mailPost);

const mailBoxBody = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, 0.62), candyRedMat);
mailBoxBody.position.y = 1.08;
mailBoxBody.castShadow = true;
mailboxGroup.add(mailBoxBody);

const mailBoxTop = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.62, 24), candyRedMat);
mailBoxTop.rotation.x = Math.PI / 2;
mailBoxTop.position.y = 1.25;
mailboxGroup.add(mailBoxTop);

// Zachte, bolle sneeuwdeken die de ronding van de brievenbus volgt (geen rechthoekig blok)
const mailSnowShape = new THREE.Shape();
const snowStartAngle = Math.PI * 0.16;
const snowEndAngle = Math.PI * 0.84;
const snowSteps = 22;
for (let i = 0; i <= snowSteps; i++) {
  const t = i / snowSteps;
  const a = snowStartAngle + t * (snowEndAngle - snowStartAngle);
  const bell = Math.sin(t * Math.PI);
  const rOuter = 0.228 + 0.008 + 0.052 * Math.pow(bell, 0.72);
  const px = Math.cos(a) * rOuter;
  const py = Math.sin(a) * rOuter;
  if (i === 0) mailSnowShape.moveTo(px, py);
  else mailSnowShape.lineTo(px, py);
}
for (let i = snowSteps; i >= 0; i--) {
  const t = i / snowSteps;
  const a = snowStartAngle + t * (snowEndAngle - snowStartAngle);
  const rInner = 0.215;
  mailSnowShape.lineTo(Math.cos(a) * rInner, Math.sin(a) * rInner);
}
mailSnowShape.closePath();

const mailSnowGeo = new THREE.ExtrudeGeometry(mailSnowShape, {
  depth: 0.56,
  steps: 10,
  curveSegments: 16,
  bevelEnabled: true,
  bevelThickness: 0.032,
  bevelSize: 0.018,
  bevelSegments: 4
});
mailSnowGeo.translate(0, 0, -0.28);

// Subtiele natuurlijke sneeuwgolving op de bovenkant voor een zacht, opgewaaid effect
const snowPosAttr = mailSnowGeo.attributes.position;
for (let i = 0; i < snowPosAttr.count; i++) {
  const vx = snowPosAttr.getX(i);
  const vy = snowPosAttr.getY(i);
  const vz = snowPosAttr.getZ(i);
  const r = Math.hypot(vx, vy);
  if (r > 0.242 && vy > 0.08) {
    const weight = Math.min(1, (r - 0.242) / 0.055);
    const wave =
      Math.sin(vz * 11.5 + vx * 7.0) * 0.009 +
      Math.cos(vz * 6.5 - vx * 5.0) * 0.006;
    const scale = 1 + (wave * weight) / r;
    snowPosAttr.setX(i, vx * scale);
    snowPosAttr.setY(i, vy * scale);
  }
}
mailSnowGeo.computeVertexNormals();

const mailSnow = new THREE.Mesh(mailSnowGeo, roofSnowMat);
mailSnow.position.y = 1.25;
mailSnow.castShadow = true;
mailboxGroup.add(mailSnow);

// Zachte sneeuwhoopjes & overhangende sneeuwrandjes langs de kap van de brievenbus
const mailSnowPuffs = [
  { x: -0.04, y: 1.525, z: -0.10, sx: 1.5, sy: 0.55, sz: 1.8, r: 0.068 },
  { x:  0.03, y: 1.520, z:  0.14, sx: 1.4, sy: 0.52, sz: 1.6, r: 0.064 },
  { x: -0.215, y: 1.355, z: -0.18, sx: 0.85, sy: 0.72, sz: 1.25, r: 0.042 },
  { x: -0.222, y: 1.348, z:  0.03, sx: 0.88, sy: 0.75, sz: 1.35, r: 0.045 },
  { x: -0.212, y: 1.358, z:  0.22, sx: 0.82, sy: 0.70, sz: 1.15, r: 0.040 },
  { x:  0.210, y: 1.368, z: -0.17, sx: 0.80, sy: 0.68, sz: 1.20, r: 0.038 },
  { x:  0.208, y: 1.368, z:  0.22, sx: 0.78, sy: 0.65, sz: 1.10, r: 0.036 },
  { x: -0.10, y: 1.478, z:  0.305, sx: 1.15, sy: 0.68, sz: 0.85, r: 0.042 },
  { x:  0.08, y: 1.482, z:  0.305, sx: 1.10, sy: 0.65, sz: 0.85, r: 0.040 },
  { x: -0.08, y: 1.480, z: -0.305, sx: 1.12, sy: 0.65, sz: 0.85, r: 0.040 },
  { x:  0.09, y: 1.476, z: -0.305, sx: 1.10, sy: 0.65, sz: 0.85, r: 0.038 }
];
mailSnowPuffs.forEach((p) => {
  const puff = new THREE.Mesh(new THREE.SphereGeometry(p.r, 12, 10), roofSnowMat);
  puff.position.set(p.x, p.y, p.z);
  puff.scale.set(p.sx, p.sy, p.sz);
  mailboxGroup.add(puff);
});

const mailFlag = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.26, 0.14), goldTrimMat);
mailFlag.position.set(0.26, 1.22, 0.06);
mailboxGroup.add(mailFlag);

const letterMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.22), candyWhiteMat);
letterMesh.position.set(0, 1.08, 0.34);
letterMesh.rotation.x = 0.18;
mailboxGroup.add(letterMesh);

// ----------------------------------------------------------------------------
// 7. RAMEN MET LUIKJES & BLOEMBAKKEN (VOOR, ACHTER EN BEIDE VLEUGELS)
// ----------------------------------------------------------------------------
// Voorgevel hoofdgebouw
addWorkshopWindow(-2.34, 2.15, 2.61, 1.15, 1.22, 0, true, true);
addWorkshopWindow( 2.34, 2.15, 2.61, 1.15, 1.22, 0, true, true);

// Achtergevel hoofdgebouw (zodat ronddraaien om het gebouw ook mooi is!)
addWorkshopWindow(-2.0, 2.15, -2.61, 1.2, 1.2, Math.PI, true, true);
addWorkshopWindow( 2.0, 2.15, -2.61, 1.2, 1.2, Math.PI, true, true);

// Rechter zij-atelier ramen (voor, zijkant, achter)
addWorkshopWindow(4.8,  1.72,  1.61, 1.12, 1.12, 0, true, true);
addWorkshopWindow(6.51, 1.72, -0.3,  1.12, 1.12, Math.PI / 2, true, false);
addWorkshopWindow(4.8,  1.72, -2.21, 1.12, 1.12, Math.PI, true, false);

// Linker inpakvleugel ramen (groot etalage-raam vooraan + achterraam)
addWorkshopWindow(-4.8, 1.72,  1.56, 1.42, 1.25, 0, false, true);
addWorkshopWindow(-4.8, 1.72, -1.46, 1.05, 1.05, Math.PI, true, false);

// Voeg regenboog-lampjes ankers toe voor hoofdgebouw, veranda en linker vleugel
for (let i = 0; i < 13; i++) {
  workshopBulbAnchors.push({ x: -3.4 + i * (6.8 / 12), y: 3.92, z: 3.08 });
}
for (let i = 0; i < 7; i++) {
  workshopBulbAnchors.push({ x: -1.55 + i * (3.1 / 6), y: 2.86, z: 3.92 });
}
for (let i = 0; i < 5; i++) {
  workshopBulbAnchors.push({ x: -5.85 + i * (2.1 / 4), y: 2.94, z: 1.78 });
}

// Maak de werkplaats klikbaar (schakelt gezellige feestverlichting & sneller speelgoedrad!)
workshopGroup.userData = {
  interactive: true,
  type: 'werkplaats',
  cozyParty: false,
  windowMaterial: windowMat,
  gearGroup: workshopGearGroup,
  cupolaStar: cupolaStar,
  lanternPivots: workshopLanternPivots
};
clickableObjects.push(workshopGroup);


// ============================================================================
// BONUS KARAKTER BIJ DE WERKPLAATS: SCHATTIGE PASTEL SNEEUWPOP (Klikbaar!)
// ============================================================================
const snowmanGroup = new THREE.Group();
snowmanGroup.position.set(5.4, 0, 3.8);
snowmanGroup.rotation.y = -0.4;
scene.add(snowmanGroup);

// 3 gestapelde sneeuwballen (SphereGeometry)
const smBottom = new THREE.Mesh(new THREE.SphereGeometry(0.85, 20, 20), snowMaterial);
smBottom.position.y = 0.75;
smBottom.castShadow = true;
snowmanGroup.add(smBottom);

const smMiddle = new THREE.Mesh(new THREE.SphereGeometry(0.62, 20, 20), snowMaterial);
smMiddle.position.y = 1.85;
smMiddle.castShadow = true;
snowmanGroup.add(smMiddle);

const smHead = new THREE.Mesh(new THREE.SphereGeometry(0.46, 20, 20), snowMaterial);
smHead.position.y = 2.72;
smHead.castShadow = true;
snowmanGroup.add(smHead);

// Wortelneus (ConeGeometry in pastel perzik/oranje)
const smNose = new THREE.Mesh(
  new THREE.ConeGeometry(0.09, 0.42, 12),
  new THREE.MeshStandardMaterial({ color: 0xff9f68 })
);
smNose.rotation.x = Math.PI / 2;
smNose.position.set(0, 2.72, 0.55);
snowmanGroup.add(smNose);

// Oogjes & roze blosjes op de wangen
const eyeMat = new THREE.MeshBasicMaterial({ color: 0x2b193d });
[-0.16, 0.16].forEach((ex) => {
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), eyeMat);
  eye.position.set(ex, 2.82, 0.41);
  snowmanGroup.add(eye);

  const blush = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xff85a2 })
  );
  blush.scale.set(1.2, 0.7, 0.5);
  blush.position.set(ex * 1.65, 2.68, 0.39);
  snowmanGroup.add(blush);
});

// Pastelroze sjaal (TorusGeometry) + schattig hoedje (CylinderGeometry)
const scarf = new THREE.Mesh(
  new THREE.TorusGeometry(0.38, 0.11, 12, 24),
  new THREE.MeshStandardMaterial({ color: PASTEL.poleRed, roughness: 0.6 })
);
scarf.rotation.x = Math.PI / 2;
scarf.position.y = 2.34;
snowmanGroup.add(scarf);

const hatBrim = new THREE.Mesh(
  new THREE.CylinderGeometry(0.52, 0.52, 0.08, 20),
  new THREE.MeshStandardMaterial({ color: 0xcdb4db })
);
hatBrim.position.y = 3.12;
snowmanGroup.add(hatBrim);

const hatTop = new THREE.Mesh(
  new THREE.CylinderGeometry(0.34, 0.32, 0.48, 20),
  new THREE.MeshStandardMaterial({ color: 0xcdb4db })
);
hatTop.position.y = 3.38;
snowmanGroup.add(hatTop);

snowmanGroup.userData = {
  interactive: true,
  type: 'sneeuwpop',
  jumpTime: 0
};
clickableObjects.push(snowmanGroup);


// ============================================================================
// BONUS KARAKTER BIJ DE WERKPLAATS: REALISTISCHE WITTE KERSTKAT (Klikbaar!)
// ============================================================================
function createChristmasCat(x, z, rotY = -0.45) {
  const catGroup = new THREE.Group();
  catGroup.position.set(x, 0, z);
  catGroup.rotation.y = rotY;
  catGroup.scale.setScalar(0.92);
  scene.add(catGroup);

  // Realistische vacht-, oog-, snuit- en kerststrik-materialen
  const catFurMat = new THREE.MeshStandardMaterial({
    color: 0xfcf8fc,
    roughness: 0.78,
    metalness: 0.01
  });
  const chestFurMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.85,
    metalness: 0.0
  });
  const earInnerMat = new THREE.MeshStandardMaterial({
    color: 0xf7a8be,
    roughness: 0.62
  });
  const noseMat = new THREE.MeshStandardMaterial({
    color: 0xf284a8,
    roughness: 0.35,
    metalness: 0.02
  });
  const mouthMat = new THREE.MeshStandardMaterial({
    color: 0x5c3c52,
    roughness: 0.5
  });
  const irisMat = new THREE.MeshStandardMaterial({
    color: 0x5ad2c8,
    emissive: 0x2a9d8f,
    emissiveIntensity: 0.26,
    roughness: 0.14,
    metalness: 0.06
  });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x120b1e });
  const eyelashMat = new THREE.MeshStandardMaterial({ color: 0x2c1e38, roughness: 0.45 });
  const blushMat = new THREE.MeshBasicMaterial({
    color: 0xff9ebb,
    transparent: true,
    opacity: 0.42
  });
  const whiskerMat = new THREE.MeshStandardMaterial({ color: 0x7c7088, roughness: 0.45 });
  const highlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const outfitRedMat = new THREE.MeshStandardMaterial({
    color: 0xe64d6d,
    roughness: 0.56
  });
  const plushTrimMat = new THREE.MeshStandardMaterial({
    color: 0xfff9fc,
    roughness: 0.88
  });
  const bellGoldMat = new THREE.MeshStandardMaterial({
    color: PASTEL.goldSoft,
    roughness: 0.22,
    metalness: 0.55
  });

  // 1. Slank zittend kattenlichaam (ronde achterhand, gebogen rug, slanke borst & nek)
  const bodyGroup = new THREE.Group();
  catGroup.add(bodyGroup);

  const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.195, 24, 20), catFurMat);
  pelvis.scale.set(0.94, 0.92, 1.14);
  pelvis.position.set(0, 0.18, -0.075);
  pelvis.castShadow = true;
  pelvis.receiveShadow = true;
  bodyGroup.add(pelvis);

  const lowerBack = new THREE.Mesh(new THREE.SphereGeometry(0.172, 22, 18), catFurMat);
  lowerBack.scale.set(0.84, 1.15, 0.92);
  lowerBack.position.set(0, 0.285, -0.05);
  lowerBack.rotation.x = 0.34;
  lowerBack.castShadow = true;
  lowerBack.receiveShadow = true;
  bodyGroup.add(lowerBack);

  const ribcage = new THREE.Mesh(new THREE.SphereGeometry(0.162, 22, 18), catFurMat);
  ribcage.scale.set(0.82, 1.06, 0.92);
  ribcage.position.set(0, 0.41, 0.025);
  ribcage.rotation.x = 0.22;
  ribcage.castShadow = true;
  bodyGroup.add(ribcage);

  // Zachte pluizige witte borstvacht
  const chestRuff = new THREE.Mesh(new THREE.SphereGeometry(0.118, 18, 14), chestFurMat);
  chestRuff.scale.set(0.82, 1.16, 0.56);
  chestRuff.position.set(0, 0.41, 0.125);
  chestRuff.rotation.x = -0.08;
  chestRuff.castShadow = true;
  bodyGroup.add(chestRuff);

  // Sierlijke, slanke kattennek
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.116, 0.175, 18), catFurMat);
  neck.position.set(0, 0.535, 0.058);
  neck.rotation.x = 0.18;
  neck.castShadow = true;
  bodyGroup.add(neck);

  // 2. Feestelijke fluwelen kersthalsband met strikje, lintjes & gouden belletje
  // (houdt het slanke kattensilhouet en de rugcurve volledig herkenbaar!)
  const neckRibbon = new THREE.Mesh(
    new THREE.TorusGeometry(0.098, 0.015, 10, 24),
    outfitRedMat
  );
  neckRibbon.rotation.x = Math.PI / 2 + 0.18;
  neckRibbon.position.set(0, 0.525, 0.06);
  bodyGroup.add(neckRibbon);

  const bowGroup = new THREE.Group();
  bowGroup.position.set(0, 0.495, 0.162);
  bodyGroup.add(bowGroup);

  const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 10), outfitRedMat);
  bowGroup.add(bowKnot);

  [-1, 1].forEach((side) => {
    const bowLoop = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.058, 10), outfitRedMat);
    bowLoop.scale.set(0.9, 1.0, 0.45);
    bowLoop.position.set(side * 0.032, 0.005, -0.004);
    bowLoop.rotation.z = side * (Math.PI / 2 - 0.16);
    bowGroup.add(bowLoop);

    const ribbonTail = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.055, 0.008), outfitRedMat);
    ribbonTail.position.set(side * 0.016, -0.034, -0.004);
    ribbonTail.rotation.z = side * 0.28;
    ribbonTail.rotation.x = -0.18;
    bowGroup.add(ribbonTail);

    const tailTipTrim = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.012, 0.01), plushTrimMat);
    tailTipTrim.position.set(side * 0.023, -0.058, -0.008);
    tailTipTrim.rotation.z = side * 0.28;
    bowGroup.add(tailTipTrim);
  });

  const collarBell = new THREE.Mesh(new THREE.SphereGeometry(0.027, 12, 12), bellGoldMat);
  collarBell.position.set(0, 0.466, 0.172);
  collarBell.castShadow = true;
  bodyGroup.add(collarBell);

  // 3. Realistische zittende achterpoten (opgetrokken dijen & vooruitstekende achterpootjes)
  [-1, 1].forEach((side) => {
    const thigh = new THREE.Mesh(new THREE.SphereGeometry(0.132, 18, 16), catFurMat);
    thigh.scale.set(0.62, 1.12, 1.28);
    thigh.position.set(side * 0.145, 0.17, -0.055);
    thigh.rotation.x = -0.40;
    thigh.rotation.y = side * 0.16;
    thigh.castShadow = true;
    thigh.receiveShadow = true;
    bodyGroup.add(thigh);

    const hock = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.044, 0.20, 12), catFurMat);
    hock.position.set(side * 0.155, 0.042, 0.042);
    hock.rotation.x = Math.PI / 2 - 0.10;
    hock.rotation.z = -side * 0.06;
    hock.castShadow = true;
    bodyGroup.add(hock);

    const hindPaw = new THREE.Mesh(new THREE.SphereGeometry(0.048, 14, 12), chestFurMat);
    hindPaw.scale.set(0.92, 0.62, 1.24);
    hindPaw.position.set(side * 0.15, 0.028, 0.142);
    hindPaw.castShadow = true;
    bodyGroup.add(hindPaw);

    [-1, 0, 1].forEach((t) => {
      const hindToe = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), chestFurMat);
      hindToe.scale.set(0.92, 0.8, 1.15);
      hindToe.position.set(side * 0.15 + t * 0.017, 0.019, 0.19 - Math.abs(t) * 0.006);
      bodyGroup.add(hindToe);
    });
  });

  // 4. Slanke rechte voorpoten, netjes dicht bij elkaar met ronde kattenpootjes
  [-1, 1].forEach((side) => {
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 12), catFurMat);
    shoulder.scale.set(0.84, 1.14, 0.96);
    shoulder.position.set(side * 0.098, 0.385, 0.085);
    shoulder.castShadow = true;
    bodyGroup.add(shoulder);

    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.039, 0.21, 14), catFurMat);
    upperArm.position.set(side * 0.078, 0.262, 0.128);
    upperArm.rotation.x = -0.14;
    upperArm.rotation.z = side * 0.09;
    upperArm.castShadow = true;
    bodyGroup.add(upperArm);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.039, 0.033, 0.17, 14), catFurMat);
    forearm.position.set(side * 0.064, 0.105, 0.158);
    forearm.rotation.x = -0.04;
    forearm.rotation.z = side * 0.04;
    forearm.castShadow = true;
    bodyGroup.add(forearm);

    const frontPaw = new THREE.Mesh(new THREE.SphereGeometry(0.044, 14, 12), chestFurMat);
    frontPaw.scale.set(0.92, 0.65, 1.18);
    frontPaw.position.set(side * 0.062, 0.028, 0.185);
    frontPaw.castShadow = true;
    bodyGroup.add(frontPaw);

    [-1, 0, 1].forEach((t) => {
      const toe = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 8), chestFurMat);
      toe.scale.set(0.92, 0.82, 1.15);
      toe.position.set(side * 0.062 + t * 0.017, 0.019, 0.226 - Math.abs(t) * 0.005);
      toe.castShadow = true;
      bodyGroup.add(toe);
    });
  });

  // 5. Lange, taps toelopende S-gekrulde kattenstaart
  const tailPivot = new THREE.Group();
  tailPivot.position.set(0, 0.11, -0.20);
  catGroup.add(tailPivot);

  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.0,  0.0,   0.0),
    new THREE.Vector3(0.05, 0.02, -0.15),
    new THREE.Vector3(0.15, 0.08, -0.27),
    new THREE.Vector3(0.21, 0.22, -0.28),
    new THREE.Vector3(0.18, 0.37, -0.20),
    new THREE.Vector3(0.11, 0.47, -0.14)
  ]);
  const tailTube = new THREE.Mesh(
    createTaperedTubeGeometry(tailCurve, 28, 12, 0.042, 0.022),
    catFurMat
  );
  tailTube.castShadow = true;
  tailPivot.add(tailTube);

  const tailBase = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 10), catFurMat);
  tailPivot.add(tailBase);

  const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), chestFurMat);
  tailTip.position.set(0.11, 0.47, -0.14);
  tailTip.castShadow = true;
  tailPivot.add(tailTip);

  // 6. Typisch kattengezicht (brede wangetjes, kort neusje, ':3' mondje, amandelogen & puntige oren)
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 0.635, 0.082);
  catGroup.add(headPivot);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.164, 24, 20), catFurMat);
  cranium.scale.set(1.12, 0.88, 0.98);
  cranium.castShadow = true;
  headPivot.add(cranium);

  // Zachte wangetjes voor de kenmerkende brede kattenkop
  [-1, 1].forEach((side) => {
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.088, 16, 14), catFurMat);
    cheek.scale.set(1.10, 0.80, 0.88);
    cheek.position.set(side * 0.098, -0.032, 0.05);
    cheek.castShadow = true;
    headPivot.add(cheek);
  });

  // Kort, verfijnd neusbrugje
  const noseBridge = new THREE.Mesh(new THREE.SphereGeometry(0.044, 14, 12), catFurMat);
  noseBridge.scale.set(0.76, 0.72, 1.05);
  noseBridge.position.set(0, -0.010, 0.132);
  noseBridge.rotation.x = 0.32;
  headPivot.add(noseBridge);

  // Plumpige snuitkussentjes + klein kinnetje
  [-1, 1].forEach((side) => {
    const muzzlePad = new THREE.Mesh(new THREE.SphereGeometry(0.042, 14, 12), chestFurMat);
    muzzlePad.scale.set(1.06, 0.84, 0.95);
    muzzlePad.position.set(side * 0.033, -0.048, 0.155);
    headPivot.add(muzzlePad);
  });

  const chin = new THREE.Mesh(new THREE.SphereGeometry(0.030, 12, 10), chestFurMat);
  chin.scale.set(1.05, 0.65, 0.88);
  chin.position.set(0, -0.082, 0.144);
  headPivot.add(chin);

  // Duidelijk roze driehoekig kattenneusje op de voorkant van het snuitje
  const catNose = new THREE.Mesh(new THREE.CylinderGeometry(0.020, 0.014, 0.014, 3), noseMat);
  catNose.rotation.x = Math.PI / 2;
  catNose.scale.set(1.18, 0.85, 1.0);
  catNose.position.set(0, -0.024, 0.196);
  headPivot.add(catNose);

  // Schattig ':3' kattenmondje onder het neusje
  const philtrum = new THREE.Mesh(new THREE.CylinderGeometry(0.0024, 0.0024, 0.018, 6), mouthMat);
  philtrum.position.set(0, -0.042, 0.194);
  headPivot.add(philtrum);

  [-1, 1].forEach((side) => {
    const smileArc = new THREE.Mesh(
      new THREE.TorusGeometry(0.018, 0.0036, 6, 12, Math.PI * 0.92),
      mouthMat
    );
    smileArc.rotation.z = Math.PI;
    smileArc.rotation.y = side * 0.18;
    smileArc.position.set(side * 0.018, -0.052, 0.191);
    headPivot.add(smileArc);
  });

  // Expressieve zeegroene/ijsblauwe amandelogen met verticale kattenpupil & glanspuntjes
  [-1, 1].forEach((side) => {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(side * 0.070, 0.020, 0.153);
    eyeGroup.rotation.y = side * 0.24;
    eyeGroup.rotation.z = side * 0.18;
    headPivot.add(eyeGroup);

    const eyeRim = new THREE.Mesh(new THREE.SphereGeometry(0.036, 14, 12), eyelashMat);
    eyeRim.scale.set(1.18, 0.88, 0.50);
    eyeRim.position.set(0, 0.001, -0.003);
    eyeGroup.add(eyeRim);

    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 14), irisMat);
    iris.scale.set(1.10, 0.88, 0.56);
    iris.position.z = 0.003;
    eyeGroup.add(iris);

    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), pupilMat);
    pupil.scale.set(0.28, 0.94, 0.42);
    pupil.position.z = 0.014;
    eyeGroup.add(pupil);

    const sparkleMain = new THREE.Mesh(new THREE.SphereGeometry(0.0078, 8, 8), highlightMat);
    sparkleMain.position.set(0.009, 0.011, 0.021);
    eyeGroup.add(sparkleMain);

    const sparkleSub = new THREE.Mesh(new THREE.SphereGeometry(0.0038, 6, 6), highlightMat);
    sparkleSub.position.set(-0.008, -0.007, 0.021);
    eyeGroup.add(sparkleSub);

    // Subtiele pastel-roze wangblos
    const blush = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), blushMat);
    blush.scale.set(1.25, 0.65, 0.4);
    blush.position.set(side * 0.108, -0.036, 0.125);
    headPivot.add(blush);
  });

  // Grote, vrijstaande driehoekige kattenoortjes met roze binnenoor (vrij naast het kerstmutsje)
  const earPivots = [];
  [-1, 1].forEach((side) => {
    const earGroup = new THREE.Group();
    earGroup.position.set(side * 0.116, 0.125, -0.008);
    earGroup.rotation.z = -side * 0.36;
    earGroup.rotation.x = 0.12;
    earGroup.rotation.y = side * 0.18;
    headPivot.add(earGroup);
    earPivots.push(earGroup);

    const outerEar = new THREE.Mesh(new THREE.ConeGeometry(0.084, 0.175, 16), catFurMat);
    outerEar.scale.set(1.10, 1.0, 0.42);
    outerEar.position.y = 0.032;
    outerEar.castShadow = true;
    earGroup.add(outerEar);

    const innerEar = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.125, 12), earInnerMat);
    innerEar.scale.set(1.02, 1.0, 0.25);
    innerEar.position.set(0, 0.022, 0.022);
    earGroup.add(innerEar);

    // Kleine witte oorpluimpjes onderin het oor
    const earTuft = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.044, 6), chestFurMat);
    earTuft.position.set(-side * 0.015, -0.016, 0.030);
    earTuft.rotation.z = side * 0.55;
    earGroup.add(earTuft);
  });

  // Schattig mini-kerstmutsje tussen de kattenoortjes (met pluche rand & pompon)
  const santaHatGroup = new THREE.Group();
  santaHatGroup.position.set(0, 0.138, 0.006);
  santaHatGroup.rotation.x = -0.10;
  santaHatGroup.rotation.z = -0.06;
  headPivot.add(santaHatGroup);

  const catHatRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.050, 0.014, 12, 24),
    plushTrimMat
  );
  catHatRim.rotation.x = Math.PI / 2;
  catHatRim.castShadow = true;
  santaHatGroup.add(catHatRim);

  const catHatCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.0,   0.000,  0.0),
    new THREE.Vector3(0.012, 0.070, -0.012),
    new THREE.Vector3(0.048, 0.128, -0.036),
    new THREE.Vector3(0.095, 0.112, -0.058)
  ]);
  const catHatMesh = new THREE.Mesh(
    createTaperedTubeGeometry(catHatCurve, 18, 16, 0.050, 0.010),
    outfitRedMat
  );
  catHatMesh.castShadow = true;
  santaHatGroup.add(catHatMesh);

  const catHatTipPos = catHatCurve.getPointAt(1);
  const catHatPom = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 12), plushTrimMat);
  catHatPom.position.copy(catHatTipPos);
  catHatPom.castShadow = true;
  santaHatGroup.add(catHatPom);

  // Duidelijk zichtbare, fijne taps toelopende snorharen + wenkbrauwharen
  [-1, 1].forEach((side) => {
    [-0.15, 0.0, 0.15].forEach((angle, idx) => {
      const whisker = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0010, 0.0034, 0.185, 6),
        whiskerMat
      );
      whisker.position.set(side * 0.102, -0.048 + (idx - 1) * 0.012, 0.162);
      whisker.rotation.z = side * (Math.PI / 2 + angle);
      whisker.rotation.y = -side * 0.22;
      headPivot.add(whisker);
    });

    [-0.12, 0.12].forEach((bAngle, bIdx) => {
      const browWhisker = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0009, 0.0022, 0.062, 6),
        whiskerMat
      );
      browWhisker.position.set(side * (0.064 + bIdx * 0.013), 0.074, 0.145);
      browWhisker.rotation.z = side * (0.35 + bAngle);
      browWhisker.rotation.x = 0.25;
      headPivot.add(browWhisker);
    });
  });

  catGroup.userData = {
    interactive: true,
    type: 'kerstkat',
    baseY: 0,
    baseRotY: rotY,
    jumpTimer: 0,
    bodyGroup: bodyGroup,
    headPivot: headPivot,
    tailPivot: tailPivot,
    earPivots: earPivots,
    hatGroup: santaHatGroup
  };
  clickableObjects.push(catGroup);
  return catGroup;
}

const christmasCatGroup = createChristmasCat(4.15, -0.50, -0.45);


// ============================================================================
// HOOFDSTUK 7: MINSTENS VIJF KERSTBOMEN MET KNIPPERENDE REGENBOOG LAMPJES
// ============================================================================
// We bouwen 7 pastel-kerstbomen (meer dan de verplichte 5!) met elk een slinger
// van regenbooglampjes die knipperen en van kleur veranderen.

const allRainbowLights = []; // Hierin bewaren we alle lampjes voor de animatie-loop
const christmasTrees = [];

// Voeg ook regenboog-lampjes toe langs alle dakranden & het veranda-afdak van de werkplaats!
const workshopBulbGeo = new THREE.SphereGeometry(0.115, 10, 10);
workshopBulbAnchors.forEach((pos, i) => {
  const bulbMat = new THREE.MeshStandardMaterial({
    color: PASTEL.rainbowHex[i % PASTEL.rainbowHex.length],
    emissive: PASTEL.rainbowHex[i % PASTEL.rainbowHex.length],
    emissiveIntensity: 0.9,
    roughness: 0.2
  });
  const bulb = new THREE.Mesh(workshopBulbGeo, bulbMat);
  bulb.position.set(pos.x, pos.y, pos.z);
  workshopGroup.add(bulb);

  allRainbowLights.push({
    mesh: bulb,
    material: bulbMat,
    phase: i * 0.45,
    treeIndex: -1,
    isWorkshopBulb: true
  });
});

// ============================================================================
// BONUS GEBOUW NAAST DE WERKPLAATS: KNUS PASTEL KATTENHUISJE (Klikbaar!)
// ============================================================================
/**
 * Bouwt een schattig pastel kattenhuisje naast de Werkplaats (en naast de witte
 * kerstkat), compleet met katten-oortjes op het dak, een pootafdruk, een
 * krabpaaltje met bungelend bolletje wol, voer- & melkbakjes en daklampjes!
 */
function createCatHouse(x, z, rotY = -0.35) {
  const houseGroup = new THREE.Group();
  houseGroup.position.set(x, 0, z);
  houseGroup.rotation.y = rotY;
  scene.add(houseGroup);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0xffd8be, roughness: 0.72 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xff8fab, roughness: 0.58 });
  const earInnerMat = new THREE.MeshStandardMaterial({ color: 0xffe5ec, roughness: 0.65 });
  const interiorMat = new THREE.MeshStandardMaterial({
    color: 0xffd166,
    emissive: 0xffb703,
    emissiveIntensity: 0.62,
    roughness: 0.35
  });
  const cushionMat = new THREE.MeshStandardMaterial({ color: 0xff9ebb, roughness: 0.8 });
  const sisalMat = new THREE.MeshStandardMaterial({ color: 0xe6ccb2, roughness: 0.9 });
  const yarnMat = new THREE.MeshStandardMaterial({ color: 0xa8f0c6, roughness: 0.75 });
  const bowlBlueMat = new THREE.MeshStandardMaterial({ color: 0xa3d8ff, roughness: 0.4 });
  const bowlPinkMat = new THREE.MeshStandardMaterial({ color: 0xffb3c6, roughness: 0.4 });

  // 1. Stenen onderplint + houten veranda-vlondertje & opstapje
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.14, 1.38), stonePlinthMat);
  plinth.position.set(0, 0.07, 0);
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  houseGroup.add(plinth);

  const porchDeck = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.08, 0.42), woodMat);
  porchDeck.position.set(0, 0.14, 0.72);
  porchDeck.castShadow = true;
  porchDeck.receiveShadow = true;
  houseGroup.add(porchDeck);

  const porchStep = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.07, 0.22), woodMat);
  porchStep.position.set(0, 0.035, 0.98);
  porchStep.receiveShadow = true;
  houseGroup.add(porchStep);

  // 2. Knusse muren + houten hoekpaaltjes
  const walls = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.92, 1.12), wallMat);
  walls.position.set(0, 0.60, 0);
  walls.castShadow = true;
  walls.receiveShadow = true;
  houseGroup.add(walls);

  const cornerGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.95, 10);
  [[-0.68, -0.56], [0.68, -0.56], [-0.68, 0.56], [0.68, 0.56]].forEach(([cx, cz]) => {
    const post = new THREE.Mesh(cornerGeo, woodMat);
    post.position.set(cx, 0.61, cz);
    post.castShadow = true;
    houseGroup.add(post);
  });

  // 3. Puntgevel + schuin dak met dikke laag sneeuw
  const gableFill = new THREE.Mesh(
    new THREE.CylinderGeometry(0.785, 0.785, 1.10, 3),
    wallMat
  );
  gableFill.rotation.x = -Math.PI / 2;
  gableFill.scale.set(1, 1, 0.54);
  gableFill.position.set(0, 1.27, 0);
  gableFill.castShadow = true;
  houseGroup.add(gableFill);

  const roofPanelGeo = new THREE.BoxGeometry(1.06, 0.11, 1.38);
  const roofSnowGeo = new THREE.BoxGeometry(1.10, 0.09, 1.42);
  [-1, 1].forEach((side) => {
    const panel = new THREE.Mesh(roofPanelGeo, roofMat);
    panel.position.set(side * 0.40, 1.37, 0);
    panel.rotation.z = -side * 0.72;
    panel.castShadow = true;
    houseGroup.add(panel);

    const snowLayer = new THREE.Mesh(roofSnowGeo, roofSnowMat);
    snowLayer.position.set(side * 0.41, 1.45, 0);
    snowLayer.rotation.z = -side * 0.72;
    snowLayer.castShadow = true;
    houseGroup.add(snowLayer);
  });

  const ridgeSnow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.085, 1.44, 10),
    roofSnowMat
  );
  ridgeSnow.rotation.x = Math.PI / 2;
  ridgeSnow.position.set(0, 1.74, 0);
  houseGroup.add(ridgeSnow);

  // Schattige katten-oortjes bovenop het dak!
  [-1, 1].forEach((side) => {
    const earGroup = new THREE.Group();
    earGroup.position.set(side * 0.44, 1.72, 0.24);
    earGroup.rotation.z = -side * 0.22;
    earGroup.rotation.x = 0.08;
    houseGroup.add(earGroup);

    const outerEar = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.36, 12), roofMat);
    outerEar.scale.set(1, 1, 0.52);
    outerEar.castShadow = true;
    earGroup.add(outerEar);

    const innerEar = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.21, 10), earInnerMat);
    innerEar.scale.set(1, 1, 0.45);
    innerEar.position.set(0, -0.02, 0.048);
    earGroup.add(innerEar);
  });

  // Klein schoorsteentje met sneeuwhoedje
  const miniChimney = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.40, 0.22), candyRedMat);
  miniChimney.position.set(-0.34, 1.66, -0.28);
  miniChimney.castShadow = true;
  houseGroup.add(miniChimney);

  const miniChimneySnow = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.28), roofSnowMat);
  miniChimneySnow.position.set(-0.34, 1.88, -0.28);
  houseGroup.add(miniChimneySnow);

  // 4. Ronde poort-ingang met warm licht van binnen, mint omlijsting & kussentje
  const doorGlowRect = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.36, 0.06), interiorMat);
  doorGlowRect.position.set(0, 0.36, 0.545);
  houseGroup.add(doorGlowRect);

  const doorGlowArch = new THREE.Mesh(
    new THREE.CylinderGeometry(0.23, 0.23, 0.06, 18),
    interiorMat
  );
  doorGlowArch.rotation.x = Math.PI / 2;
  doorGlowArch.position.set(0, 0.54, 0.545);
  houseGroup.add(doorGlowArch);

  const archFrame = new THREE.Mesh(
    new THREE.TorusGeometry(0.25, 0.045, 8, 18, Math.PI),
    shutterMat
  );
  archFrame.position.set(0, 0.54, 0.575);
  houseGroup.add(archFrame);

  [-0.25, 0.25].forEach((jx) => {
    const jamb = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.38, 0.08), shutterMat);
    jamb.position.set(jx, 0.35, 0.575);
    houseGroup.add(jamb);
  });

  // Zacht pastel kussentje bij de ingang
  const cushion = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.075, 16), cushionMat);
  cushion.scale.set(1.05, 1, 0.85);
  cushion.position.set(0, 0.21, 0.66);
  cushion.castShadow = true;
  houseGroup.add(cushion);

  // Gouden belletje dat zachtjes wiebelt boven de poort
  const bellPivot = new THREE.Group();
  bellPivot.position.set(0, 0.77, 0.60);
  houseGroup.add(bellPivot);

  const bellCord = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.09, 6), woodMat);
  bellCord.position.y = -0.045;
  bellPivot.add(bellCord);

  const bellOrb = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), goldTrimMat);
  bellOrb.position.y = -0.10;
  bellPivot.add(bellOrb);

  // Gouden kattenpoot-embleem in de puntgevel
  const pawGroup = new THREE.Group();
  pawGroup.position.set(0, 1.06, 0.585);
  houseGroup.add(pawGroup);

  const mainPad = new THREE.Mesh(new THREE.SphereGeometry(0.068, 10, 10), goldTrimMat);
  mainPad.scale.set(1.15, 0.9, 0.45);
  pawGroup.add(mainPad);

  [[-0.085, 0.075], [0, 0.105], [0.085, 0.075]].forEach(([tx, ty]) => {
    const toe = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), goldTrimMat);
    toe.scale.set(1, 1.15, 0.45);
    toe.position.set(tx, ty, 0);
    pawGroup.add(toe);
  });

  // 5. Ronde raampjes aan de zijkanten
  [-1, 1].forEach((side) => {
    const winGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.06, 16),
      windowMat
    );
    winGlass.rotation.z = Math.PI / 2;
    winGlass.position.set(side * 0.68, 0.62, 0);
    houseGroup.add(winGlass);

    const winFrame = new THREE.Mesh(
      new THREE.TorusGeometry(0.19, 0.032, 8, 18),
      woodMat
    );
    winFrame.rotation.y = Math.PI / 2;
    winFrame.position.set(side * 0.695, 0.62, 0);
    houseGroup.add(winFrame);

    const winSill = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.36), roofSnowMat);
    winSill.position.set(side * 0.72, 0.41, 0);
    houseGroup.add(winSill);
  });

  // 6. Regenboog-daklampjes langs de voorrand van het dak
  const bulbGeo = new THREE.SphereGeometry(0.06, 8, 8);
  [-0.58, -0.30, 0, 0.30, 0.58].forEach((bx, idx) => {
    const bMat = new THREE.MeshStandardMaterial({
      color: PASTEL.rainbowHex[idx % PASTEL.rainbowHex.length],
      emissive: PASTEL.rainbowHex[idx % PASTEL.rainbowHex.length],
      emissiveIntensity: 0.9,
      roughness: 0.2
    });
    const bulb = new THREE.Mesh(bulbGeo, bMat);
    const roofY = 1.66 - Math.abs(bx) * 0.78;
    bulb.position.set(bx, roofY, 0.71);
    houseGroup.add(bulb);

    allRainbowLights.push({
      mesh: bulb,
      material: bMat,
      phase: idx * 0.6 + 1.2,
      treeIndex: -1,
      isCatHouseBulb: true
    });
  });

  // 7. Schattig krabpaaltje met bungelend bolletje wol rechts naast de veranda
  const postBase = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.22, 0.06, 14), woodMat);
  postBase.position.set(0.95, 0.03, 0.46);
  postBase.castShadow = true;
  postBase.receiveShadow = true;
  houseGroup.add(postBase);

  const sisalPost = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.48, 12), sisalMat);
  sisalPost.position.set(0.95, 0.29, 0.46);
  sisalPost.castShadow = true;
  houseGroup.add(sisalPost);

  const postTop = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.055, 14), cushionMat);
  postTop.position.set(0.95, 0.54, 0.46);
  postTop.castShadow = true;
  houseGroup.add(postTop);

  const yarnPivot = new THREE.Group();
  yarnPivot.position.set(1.06, 0.52, 0.46);
  houseGroup.add(yarnPivot);

  const yarnString = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.15, 6), woodMat);
  yarnString.position.y = -0.075;
  yarnPivot.add(yarnString);

  const yarnBall = new THREE.Mesh(new THREE.SphereGeometry(0.062, 10, 10), yarnMat);
  yarnBall.position.y = -0.17;
  yarnBall.castShadow = true;
  yarnPivot.add(yarnBall);

  // 8. Twee kleine voer- en melkbakjes links voor het kattenhuisje
  [
    { x: -0.76, z: 0.72, mat: bowlBlueMat, fillColor: 0xfffdfd },
    { x: -0.46, z: 0.86, mat: bowlPinkMat, fillColor: 0xffb703 }
  ].forEach((b) => {
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.125, 0.06, 14), b.mat);
    bowl.position.set(b.x, 0.03, b.z);
    bowl.castShadow = true;
    houseGroup.add(bowl);

    const fill = new THREE.Mesh(
      new THREE.CylinderGeometry(0.082, 0.082, 0.02, 12),
      new THREE.MeshStandardMaterial({ color: b.fillColor, roughness: 0.35 })
    );
    fill.position.set(b.x, 0.055, b.z);
    houseGroup.add(fill);
  });

  // 9. Naambordje ("Kattenhuisje") op een paaltje naast het huisje
  const signPost = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.58, 8), woodMat);
  signPost.position.set(-1.24, 0.29, 0.32);
  signPost.castShadow = true;
  houseGroup.add(signPost);

  const catSignTex = createSignTexture(
    'Kattenhuisje',
    '🐾 Spinnend Knus 🐾',
    '#fff8fb',
    '#ff9ebb',
    '#522b47',
    { width: 384, height: 160 }
  );
  const catSign = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.29, 0.05),
    new THREE.MeshStandardMaterial({ map: catSignTex, roughness: 0.45 })
  );
  catSign.position.set(-1.24, 0.56, 0.35);
  catSign.rotation.y = 0.22;
  catSign.castShadow = true;
  houseGroup.add(catSign);

  houseGroup.userData = {
    interactive: true,
    type: 'kattenhuisje',
    baseY: 0,
    boostTimer: 0,
    bellPivot: bellPivot,
    yarnPivot: yarnPivot
  };
  clickableObjects.push(houseGroup);
  return houseGroup;
}

const catHouseGroup = createCatHouse(6.15, -0.75, -0.35);

// ============================================================================
// HET ELFENDORP (Recht voor de Werkplaats, ruim vrij van alle andere objecten)
// ============================================================================
// De Werkplaats staat op (1.8, 0, -4.5). Het Elfendorp plaatsen we op (1.8, 0, 12.8),
// zodat er ruim plaats blijft voor het stapstenen-pad, cadeautjes, Noordpool-paal,
// sneeuwpop en kerstbomen zonder dat iets elkaar in de weg staat.

const elfVillageGroup = new THREE.Group();
elfVillageGroup.position.set(1.8, 0, 12.8);
scene.add(elfVillageGroup);

// Zacht warm dorpslicht boven het pleintje van het Elfendorp
const elfVillageLight = new THREE.PointLight(0xffd6a5, 0.58, 13);
elfVillageLight.position.set(0, 3.4, 0.4);
elfVillageGroup.add(elfVillageLight);

const elfHouses = [];
const elfCharacters = [];

/**
 * Bouwt één schattig pastel elfenhuisje uit primitieve vormen, inclusief
 * puntdak met dikke sneeuwrand en knipperende regenbooglampjes rondom het dak!
 */
function createElfCottage(x, z, rotY, wallHex, roofHex, doorHex, houseIndex) {
  const houseGroup = new THREE.Group();
  houseGroup.position.set(x, 0, z);
  houseGroup.rotation.y = rotY;
  elfVillageGroup.add(houseGroup);

  // 1. Gezellig stenen/sneeuw onderplintje
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 0.16, 1.55),
    roofSnowMat
  );
  plinth.position.y = 0.08;
  plinth.receiveShadow = true;
  houseGroup.add(plinth);

  // 2. Huisje-muren (BoxGeometry in zachte pastelkleur)
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.15, 1.3),
    new THREE.MeshStandardMaterial({ color: wallHex, roughness: 0.72 })
  );
  walls.position.y = 0.72;
  walls.castShadow = true;
  walls.receiveShadow = true;
  houseGroup.add(walls);

  // Houten hoekpaaltjes
  [
    [-0.74, -0.64], [0.74, -0.64],
    [-0.74,  0.64], [0.74,  0.64]
  ].forEach(([px, pz]) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 1.18, 10), woodMat);
    post.position.set(px, 0.72, pz);
    post.castShadow = true;
    houseGroup.add(post);
  });

  // 3. Puntig elfen-kegeldak (ConeGeometry met 4 zijden) + sneeuwbolletje op de nok
  const roofMat = new THREE.MeshStandardMaterial({ color: roofHex, roughness: 0.6 });
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.36, 1.32, 4), roofMat);
  roof.position.y = 1.94;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  houseGroup.add(roof);

  // Dikke besneeuwde dakrand rondom (4 sneeuwbalkjes langs de dakrand)
  const snowEaveFrontBack = [
    { x: 0, z: 0.96, rx: 0, rz: 0, w: 1.95 },
    { x: 0, z: -0.96, rx: 0, rz: 0, w: 1.95 }
  ];
  snowEaveFrontBack.forEach((e) => {
    const eave = new THREE.Mesh(new THREE.BoxGeometry(e.w, 0.14, 0.18), roofSnowMat);
    eave.position.set(e.x, 1.31, e.z);
    houseGroup.add(eave);
  });
  [-0.96, 0.96].forEach((sx) => {
    const eaveSide = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 1.95), roofSnowMat);
    eaveSide.position.set(sx, 1.31, 0);
    houseGroup.add(eaveSide);
  });

  // Fluffy sneeuwbolletje bovenop de punt van het elfendak
  const roofPom = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), roofSnowMat);
  roofPom.position.y = 2.62;
  houseGroup.add(roofPom);

  // Mini schoorsteentje met sneeuwrand
  const miniChimney = new THREE.Mesh(
    new THREE.BoxGeometry(0.26, 0.52, 0.26),
    new THREE.MeshStandardMaterial({ color: PASTEL.poleRed, roughness: 0.65 })
  );
  miniChimney.position.set(-0.42, 2.02, -0.25);
  miniChimney.castShadow = true;
  houseGroup.add(miniChimney);

  const miniChimneySnow = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.09, 0.32), roofSnowMat);
  miniChimneySnow.position.set(-0.42, 2.30, -0.25);
  houseGroup.add(miniChimneySnow);

  // 4. Schattige ronde elfendeur + gouden knopje
  const doorMat = new THREE.MeshStandardMaterial({ color: doorHex, roughness: 0.5 });
  const elfDoor = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.64, 0.08), doorMat);
  elfDoor.position.set(0, 0.44, 0.66);
  houseGroup.add(elfDoor);

  const elfDoorArch = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.08, 16), doorMat);
  elfDoorArch.rotation.x = Math.PI / 2;
  elfDoorArch.position.set(0, 0.76, 0.66);
  houseGroup.add(elfDoorArch);

  const elfKnob = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 8),
    new THREE.MeshStandardMaterial({ color: PASTEL.goldSoft, metalness: 0.5, roughness: 0.2 })
  );
  elfKnob.position.set(0.14, 0.44, 0.72);
  houseGroup.add(elfKnob);

  // 5. Warme gloeiende raampjes (voor, zijkanten én achterkant voor rondom-kijkers)
  const elfWinMat = new THREE.MeshStandardMaterial({
    color: PASTEL.windowGlow,
    emissive: 0xffd166,
    emissiveIntensity: 0.9,
    roughness: 0.2
  });

  const elfWindows = [
    { x: -0.46, y: 0.72, z: 0.66, w: 0.28, h: 0.30, ry: 0 },
    { x:  0.46, y: 0.72, z: 0.66, w: 0.28, h: 0.30, ry: 0 },
    { x:  0.00, y: 0.72, z: -0.66, w: 0.36, h: 0.32, ry: 0 },
    { x: -0.76, y: 0.72, z: 0.0, w: 0.34, h: 0.32, ry: Math.PI / 2 },
    { x:  0.76, y: 0.72, z: 0.0, w: 0.34, h: 0.32, ry: Math.PI / 2 }
  ];

  elfWindows.forEach((ew) => {
    const winMesh = new THREE.Mesh(new THREE.BoxGeometry(ew.w, ew.h, 0.06), elfWinMat);
    winMesh.position.set(ew.x, ew.y, ew.z);
    winMesh.rotation.y = ew.ry;
    houseGroup.add(winMesh);
  });

  // 6. Knipperende regenbooglampjes rondom de dakrand én halverwege het dak!
  const roofBulbGeo = new THREE.SphereGeometry(0.075, 10, 10);

  // Onderste ring lampjes langs alle 4 kanten van de dakrand (12 lampjes)
  const eavePoints = [
    [-0.90, 0.98], [-0.30, 0.98], [0.30, 0.98], [0.90, 0.98],
    [ 0.98, 0.35], [ 0.98,-0.35],
    [ 0.90,-0.98], [ 0.30,-0.98], [-0.30,-0.98], [-0.90,-0.98],
    [-0.98,-0.35], [-0.98, 0.35]
  ];
  eavePoints.forEach(([bx, bz], idx) => {
    const colorHex = PASTEL.rainbowHex[(idx + houseIndex) % PASTEL.rainbowHex.length];
    const bulbMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.95,
      roughness: 0.2
    });
    const bulb = new THREE.Mesh(roofBulbGeo, bulbMat);
    bulb.position.set(bx, 1.24, bz);
    houseGroup.add(bulb);

    allRainbowLights.push({
      mesh: bulb,
      material: bulbMat,
      phase: idx * 0.45 + houseIndex * 0.8,
      treeIndex: -1,
      elfHouseIndex: houseIndex
    });
  });

  // Tweede slinger van 6 lampjes hoger op het puntdak
  for (let r = 0; r < 6; r++) {
    const angle = (r / 6) * Math.PI * 2;
    const radius = 0.56;
    const colorHex = PASTEL.rainbowHex[(r + houseIndex + 2) % PASTEL.rainbowHex.length];
    const bulbMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.95,
      roughness: 0.2
    });
    const bulb = new THREE.Mesh(roofBulbGeo, bulbMat);
    bulb.position.set(Math.cos(angle) * radius, 1.92, Math.sin(angle) * radius);
    houseGroup.add(bulb);

    allRainbowLights.push({
      mesh: bulb,
      material: bulbMat,
      phase: r * 0.65 + houseIndex * 1.1,
      treeIndex: -1,
      elfHouseIndex: houseIndex
    });
  }

  houseGroup.userData = {
    interactive: true,
    type: 'elfenhuis',
    houseIndex: houseIndex,
    boostTimer: 0
  };
  clickableObjects.push(houseGroup);
  elfHouses.push(houseGroup);
}

// Plaats 5 pastel elfenhuisjes rondom het knusse dorpspleintje
const elfCottageConfigs = [
  { x: -2.9, z: -2.4, rotY:  0.55, wall: PASTEL.doorMint,     roof: PASTEL.poleRed,      door: PASTEL.wallPink },
  { x:  2.9, z: -2.4, rotY: -0.55, wall: PASTEL.wallLavender, roof: 0xffb5a7,            door: PASTEL.doorMint },
  { x: -3.8, z:  0.8, rotY:  0.95, wall: 0xfff3b0,            roof: 0xa3d8ff,            door: PASTEL.poleRed },
  { x:  3.7, z:  1.0, rotY: -0.95, wall: 0xa3d8ff,            roof: PASTEL.wallPink,     door: 0xfff3b0 },
  { x: -2.3, z:  3.5, rotY:  1.35, wall: PASTEL.wallPink,     roof: PASTEL.wallLavender, door: PASTEL.doorMint }
];

elfCottageConfigs.forEach((cfg, idx) => {
  createElfCottage(cfg.x, cfg.z, cfg.rotY, cfg.wall, cfg.roof, cfg.door, idx);
});

// Gezellig stapstenen-paadje door het midden van het Elfendorp
[
  { x:  0.0, z: -2.2 },
  { x: -0.3, z: -0.8 },
  { x:  0.2, z:  0.6 },
  { x: -0.1, z:  2.0 }
].forEach((sp, idx) => {
  const miniStone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.48, 0.12, 14),
    new THREE.MeshStandardMaterial({
      color: PASTEL.rainbowHex[(idx + 2) % PASTEL.rainbowHex.length],
      roughness: 0.55
    })
  );
  miniStone.position.set(sp.x, 0.05, sp.z);
  miniStone.receiveShadow = true;
  elfVillageGroup.add(miniStone);
});

// Schattig welkomstbordje "Elfendorp" aan de rand van het dorpspleintje
const elfSignPost = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 1.35, 10), woodMat);
elfSignPost.position.set(2.3, 0.68, 3.2);
elfSignPost.castShadow = true;
elfVillageGroup.add(elfSignPost);

const elfSignTex = createSignTexture(
  'Elfendorp',
  '🧝 Knusse Huisjes ✨',
  '#fff0f6',
  '#80d4ab',
  '#4a2545'
);
const elfSignBoard = new THREE.Mesh(
  new THREE.BoxGeometry(1.55, 0.62, 0.1),
  new THREE.MeshStandardMaterial({ map: elfSignTex, roughness: 0.45 })
);
elfSignBoard.position.set(2.3, 1.25, 3.24);
elfSignBoard.rotation.y = -0.3;
elfVillageGroup.add(elfSignBoard);

/**
 * Maakt een vloeiende, taps toelopende buis langs een 3D-curve (o.a. voor realistische
 * vallende elfenmutsen en gekrulde laarspuntjes).
 */
function createTaperedTubeGeometry(curve, tubularSegments, radialSegments, radiusStart, radiusEnd) {
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const radius = radiusStart * (1 - t) + radiusEnd * t;
    const P = curve.getPointAt(t);
    const N = frames.normals[i];
    const B = frames.binormals[i];

    for (let j = 0; j <= radialSegments; j++) {
      const theta = (j / radialSegments) * Math.PI * 2;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);

      positions.push(
        P.x + radius * (cos * N.x + sin * B.x),
        P.y + radius * (cos * N.y + sin * B.y),
        P.z + radius * (cos * N.z + sin * B.z)
      );
      uvs.push(j / radialSegments, t);
    }
  }

  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = (i + 1) * (radialSegments + 1) + j;
      const c = (i + 1) * (radialSegments + 1) + (j + 1);
      const d = i * (radialSegments + 1) + (j + 1);
      indices.push(a, d, b);
      indices.push(d, c, b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Gedeelde materialen voor realistische, maar zachte pastel-kerstelfjes
const elfSkinMat = new THREE.MeshStandardMaterial({ color: 0xffddc8, roughness: 0.68 });
const elfInnerEarMat = new THREE.MeshStandardMaterial({ color: 0xf6b7ad, roughness: 0.74 });
const elfNoseMat = new THREE.MeshStandardMaterial({ color: 0xffb3a7, roughness: 0.62 });
const elfBlushMat = new THREE.MeshBasicMaterial({ color: 0xff85a2 });
const elfMouthMat = new THREE.MeshBasicMaterial({ color: 0xc96576 });
const elfHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const elfFurMat = new THREE.MeshStandardMaterial({ color: 0xfff8fc, roughness: 0.88 });
const elfLeatherMat = new THREE.MeshStandardMaterial({ color: 0x7b5248, roughness: 0.55 });
const elfSoleMat = new THREE.MeshStandardMaterial({ color: 0x543832, roughness: 0.72 });
const elfGoldMat = new THREE.MeshStandardMaterial({
  color: PASTEL.goldSoft,
  roughness: 0.25,
  metalness: 0.48
});
const elfHairMats = [
  new THREE.MeshStandardMaterial({ color: 0x6b4437, roughness: 0.78 }), // Warm kastanjebruin
  new THREE.MeshStandardMaterial({ color: 0xdca963, roughness: 0.76 }), // Honingblond
  new THREE.MeshStandardMaterial({ color: 0xc26a4a, roughness: 0.76 })  // Koper-rood/auburn
];

/**
 * Bouwt één gedetailleerd, realistisch pastel-kerstelfje met laarsjes, gestreepte kousjes,
 * riem met gouden gesp, spitse oortjes, haarlokken, beweegbare armpjes en vallende puntmuts.
 */
function createElfCharacter(x, z, rotY, tunicHex, hatHex, phase) {
  const elfIndex = elfCharacters.length;
  const elfGroup = new THREE.Group();
  elfGroup.position.set(x, 0, z);
  elfGroup.rotation.y = rotY;
  elfVillageGroup.add(elfGroup);

  const tunicMat = new THREE.MeshStandardMaterial({ color: tunicHex, roughness: 0.64 });
  const hatMat = new THREE.MeshStandardMaterial({
    color: hatHex,
    roughness: 0.62,
    side: THREE.DoubleSide
  });
  const hairMat = elfHairMats[elfIndex % elfHairMats.length];

  // --------------------------------------------------------------------------
  // 1. LAARSJES MET GEKRULDE NEUS & GESTREEPTE ELF-KOUSJES
  // --------------------------------------------------------------------------
  [-0.088, 0.088].forEach((lx) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(lx, 0, 0);
    elfGroup.add(legGroup);

    // Zooltje + voetgedeelte van het laarsje
    const sole = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.06, 0.022, 12), elfSoleMat);
    sole.scale.set(0.95, 1, 1.45);
    sole.position.set(0, 0.011, 0.025);
    legGroup.add(sole);

    const bootFoot = new THREE.Mesh(new THREE.SphereGeometry(0.058, 12, 10), elfLeatherMat);
    bootFoot.scale.set(0.92, 0.76, 1.42);
    bootFoot.position.set(0, 0.05, 0.028);
    bootFoot.castShadow = true;
    legGroup.add(bootFoot);

    const bootShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.054, 0.1, 12), elfLeatherMat);
    bootShaft.position.set(0, 0.095, -0.006);
    bootShaft.castShadow = true;
    legGroup.add(bootShaft);

    // Gekrulde elfen-laarspunt met klein gouden belletje
    const toeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.044, 0.082),
      new THREE.Vector3(0, 0.058, 0.145),
      new THREE.Vector3(0, 0.105, 0.168),
      new THREE.Vector3(0, 0.128, 0.142)
    ]);
    const curledToe = new THREE.Mesh(
      createTaperedTubeGeometry(toeCurve, 10, 8, 0.032, 0.011),
      elfLeatherMat
    );
    curledToe.castShadow = true;
    legGroup.add(curledToe);

    const toeBell = new THREE.Mesh(new THREE.SphereGeometry(0.019, 8, 8), elfGoldMat);
    toeBell.position.set(0, 0.126, 0.14);
    legGroup.add(toeBell);

    // Pluche randje bovenaan het laarsje
    const bootCuff = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.019, 8, 14), elfFurMat);
    bootCuff.rotation.x = Math.PI / 2;
    bootCuff.position.set(0, 0.145, -0.006);
    legGroup.add(bootCuff);

    // Gestreepte beentjes (4 afwisselende bandjes tussen laars en tuniek)
    for (let s = 0; s < 4; s++) {
      const stripeMat = s % 2 === 0 ? elfFurMat : hatMat;
      const stripe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.043, 0.044, 0.05, 10),
        stripeMat
      );
      stripe.position.set(0, 0.17 + s * 0.048, -0.006);
      stripe.castShadow = true;
      legGroup.add(stripe);
    }
  });

  // --------------------------------------------------------------------------
  // 2. LIJFJE, TUNIEK, PLUCHE ZOOM, RIEM MET GESP & PUNTKRAAGJE
  // --------------------------------------------------------------------------
  // Uitlopend tuniek-rokje met pluche onderzoom
  const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.23, 0.19, 20), tunicMat);
  skirt.position.y = 0.39;
  skirt.castShadow = true;
  skirt.receiveShadow = true;
  elfGroup.add(skirt);

  const skirtFurHem = new THREE.Mesh(new THREE.TorusGeometry(0.226, 0.032, 10, 22), elfFurMat);
  skirtFurHem.rotation.x = Math.PI / 2;
  skirtFurHem.position.y = 0.298;
  skirtFurHem.castShadow = true;
  elfGroup.add(skirtFurHem);

  // Bovenlijfje & natuurlijk afgeronde schouders
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.132, 0.156, 0.23, 18), tunicMat);
  torso.position.y = 0.565;
  torso.castShadow = true;
  elfGroup.add(torso);

  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.142, 16, 12), tunicMat);
  shoulders.scale.set(1.06, 0.62, 0.86);
  shoulders.position.y = 0.642;
  shoulders.castShadow = true;
  elfGroup.add(shoulders);

  // Witte verticale bies & 3 gouden knoopjes aan de voorkant
  const placket = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.30, 0.032), elfFurMat);
  placket.position.set(0, 0.495, 0.146);
  placket.rotation.x = -0.17;
  elfGroup.add(placket);

  [0.57, 0.505, 0.40].forEach((by, idx) => {
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.019, 8, 8), elfGoldMat);
    btn.position.set(0, by, 0.15 + idx * 0.02);
    elfGroup.add(btn);
  });

  // Bruine leren riem + gouden gesp
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.172, 0.052, 20), elfLeatherMat);
  belt.position.y = 0.465;
  belt.castShadow = true;
  elfGroup.add(belt);

  const buckleFrame = new THREE.Mesh(new THREE.BoxGeometry(0.076, 0.068, 0.022), elfGoldMat);
  buckleFrame.position.set(0, 0.465, 0.17);
  elfGroup.add(buckleFrame);

  const buckleCenter = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.036, 0.026), elfLeatherMat);
  buckleCenter.position.set(0, 0.465, 0.172);
  elfGroup.add(buckleCenter);

  // Spitse elfenkraag (6 bladvormige puntjes rond de hals) + knus sjaaltje
  for (let c = 0; c < 6; c++) {
    const angle = (c / 6) * Math.PI * 2 + 0.25;
    const collarTip = new THREE.Mesh(new THREE.ConeGeometry(0.048, 0.11, 6), hatMat);
    collarTip.position.set(Math.sin(angle) * 0.115, 0.675, Math.cos(angle) * 0.105);
    collarTip.rotation.x = Math.cos(angle) * 1.1;
    collarTip.rotation.z = -Math.sin(angle) * 1.1;
    elfGroup.add(collarTip);
  }

  const neckScarf = new THREE.Mesh(new THREE.TorusGeometry(0.102, 0.028, 8, 18), elfFurMat);
  neckScarf.rotation.x = Math.PI / 2;
  neckScarf.position.y = 0.692;
  elfGroup.add(neckScarf);

  // --------------------------------------------------------------------------
  // 3. BEWEEGBARE ARMPJES, PLUCHE MANCHETTEN, HANDJES & KERST-ACCESSOIRES
  // --------------------------------------------------------------------------
  const armPivots = {};
  [-1, 1].forEach((side) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(side * 0.145, 0.642, 0);
    elfGroup.add(armPivot);

    const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 10), tunicMat);
    armPivot.add(shoulderCap);

    // Gebogen armpje vanaf de schouder naar de hand
    const isHoldingProp = side === 1 && elfIndex < 2;
    const isWaving = elfIndex === 2 && side === 1;

    let armCurve;
    let handPos;
    if (isWaving) {
      armCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(side * 0.085, 0.03, 0.04),
        new THREE.Vector3(side * 0.125, 0.14, 0.07)
      ]);
      handPos = new THREE.Vector3(side * 0.128, 0.165, 0.075);
    } else if (isHoldingProp) {
      armCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(side * 0.068, -0.095, 0.045),
        new THREE.Vector3(side * 0.055, -0.155, 0.145)
      ]);
      handPos = new THREE.Vector3(side * 0.052, -0.158, 0.175);
    } else {
      armCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(side * 0.072, -0.105, 0.025),
        new THREE.Vector3(side * 0.085, -0.195, 0.08)
      ]);
      handPos = new THREE.Vector3(side * 0.088, -0.215, 0.095);
    }

    const sleeve = new THREE.Mesh(new THREE.TubeGeometry(armCurve, 10, 0.038, 10, false), tunicMat);
    sleeve.castShadow = true;
    armPivot.add(sleeve);

    // Pluche mouwmanchet aan de pols
    const wristPoint = armCurve.getPointAt(0.95);
    const tangent = armCurve.getTangentAt(0.95);
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.017, 8, 14), elfFurMat);
    cuff.position.copy(wristPoint);
    cuff.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    armPivot.add(cuff);

    // Gevormd handje met duimpje
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), elfSkinMat);
    hand.scale.set(0.88, 1.02, 1.12);
    hand.position.copy(handPos);
    hand.castShadow = true;
    armPivot.add(hand);

    const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.017, 8, 8), elfSkinMat);
    thumb.position.set(handPos.x - side * 0.026, handPos.y + 0.018, handPos.z + 0.016);
    armPivot.add(thumb);

    // Klein attribuut voor Elfje #1 (zuurstok) en Elfje #2 (mini-cadeautje)
    if (side === 1 && elfIndex === 0) {
      const caneGroup = new THREE.Group();
      caneGroup.position.copy(handPos);
      caneGroup.rotation.set(0.18, 0, -0.15);
      armPivot.add(caneGroup);

      const caneCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.05, 0.01),
        new THREE.Vector3(0, 0.16, 0.01),
        new THREE.Vector3(0.025, 0.22, 0.01),
        new THREE.Vector3(0.065, 0.21, 0.01),
        new THREE.Vector3(0.075, 0.165, 0.01)
      ]);
      const caneStick = new THREE.Mesh(
        new THREE.TubeGeometry(caneCurve, 16, 0.015, 8, false),
        elfFurMat
      );
      caneGroup.add(caneStick);

      [0.02, 0.09, 0.16].forEach((cy) => {
        const stripe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.016, 0.016, 0.026, 8),
          hatMat
        );
        stripe.position.set(0, cy, 0.01);
        caneGroup.add(stripe);
      });
    } else if (side === 1 && elfIndex === 1) {
      const miniGift = new THREE.Group();
      miniGift.position.set(handPos.x - 0.04, handPos.y + 0.055, handPos.z + 0.02);
      miniGift.rotation.y = 0.35;
      armPivot.add(miniGift);

      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.105, 0.12),
        new THREE.MeshStandardMaterial({ color: PASTEL.wallPink, roughness: 0.48 })
      );
      box.castShadow = true;
      miniGift.add(box);

      const ribbon1 = new THREE.Mesh(new THREE.BoxGeometry(0.126, 0.11, 0.024), elfGoldMat);
      miniGift.add(ribbon1);
      const ribbon2 = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.11, 0.126), elfGoldMat);
      miniGift.add(ribbon2);

      const bow = createGiftBow(elfGoldMat, 0.125);
      bow.position.set(0, 0.055, 0);
      miniGift.add(bow);
    }

    if (side === -1) armPivots.left = armPivot;
    else armPivots.right = armPivot;
  });

  // --------------------------------------------------------------------------
  // 4. NEK, HOOFD-PIVOT, SPITSE ELFENOORTJES, HAAR & EXPRESSIEF GEZICHTJE
  // --------------------------------------------------------------------------
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.08, 12), elfSkinMat);
  neck.position.y = 0.725;
  elfGroup.add(neck);

  const headPivot = new THREE.Group();
  headPivot.position.set(0, 0.75, 0);
  elfGroup.add(headPivot);

  // Hoofdvorm: subtiel ovaal schedel + zachte wangen/kinnetje
  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.164, 20, 18), elfSkinMat);
  cranium.scale.set(0.95, 1.03, 0.98);
  cranium.position.y = 0.128;
  cranium.castShadow = true;
  headPivot.add(cranium);

  const lowerFace = new THREE.Mesh(new THREE.SphereGeometry(0.128, 16, 14), elfSkinMat);
  lowerFace.scale.set(1.06, 0.76, 0.95);
  lowerFace.position.set(0, 0.075, 0.02);
  headPivot.add(lowerFace);

  // Spitse elfen-oortjes aan beide zijkanten
  [-1, 1].forEach((side) => {
    const earGroup = new THREE.Group();
    earGroup.position.set(side * 0.155, 0.118, -0.008);
    earGroup.rotation.z = -side * 0.92;
    earGroup.rotation.y = -side * 0.28;
    earGroup.rotation.x = -0.14;
    headPivot.add(earGroup);

    const earBase = new THREE.Mesh(new THREE.SphereGeometry(0.052, 12, 10), elfSkinMat);
    earBase.scale.set(0.46, 1.35, 0.34);
    earBase.position.y = 0.04;
    earBase.castShadow = true;
    earGroup.add(earBase);

    const earTip = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.082, 10), elfSkinMat);
    earTip.scale.set(0.75, 1.0, 0.45);
    earTip.position.y = 0.095;
    earGroup.add(earTip);

    const earInner = new THREE.Mesh(new THREE.SphereGeometry(0.034, 10, 8), elfInnerEarMat);
    earInner.scale.set(0.36, 1.08, 0.24);
    earInner.position.set(0, 0.042, 0.012);
    earGroup.add(earInner);
  });

  // Haarlokken (achterhaar, pony onder de muts en zijlokjes langs de oortjes)
  const backHair = new THREE.Mesh(new THREE.SphereGeometry(0.158, 16, 14), hairMat);
  backHair.scale.set(1.0, 0.95, 0.92);
  backHair.position.set(0, 0.135, -0.028);
  headPivot.add(backHair);

  const napeHair = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), hairMat);
  napeHair.scale.set(1.12, 0.65, 0.72);
  napeHair.position.set(0, 0.045, -0.085);
  headPivot.add(napeHair);

  [-0.085, -0.03, 0.03, 0.085].forEach((bx, idx) => {
    const bang = new THREE.Mesh(new THREE.SphereGeometry(0.046, 10, 8), hairMat);
    bang.scale.set(1.1, 0.78, 0.75);
    bang.position.set(bx, 0.215 - Math.abs(idx - 1.5) * 0.008, 0.118);
    headPivot.add(bang);
  });

  [-1, 1].forEach((side) => {
    const sideLock = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), hairMat);
    sideLock.scale.set(0.55, 1.35, 0.75);
    sideLock.position.set(side * 0.132, 0.115, 0.045);
    sideLock.rotation.z = side * 0.15;
    headPivot.add(sideLock);
  });

  // Oogjes met witte lichtpuntjes, wenkbrauwen, neusje, blosjes & glimlach
  [-0.056, 0.056].forEach((ex, idx) => {
    const side = idx === 0 ? -1 : 1;

    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 10), eyeMat);
    eye.position.set(ex, 0.125, 0.145);
    headPivot.add(eye);

    const sparkle = new THREE.Mesh(new THREE.SphereGeometry(0.0085, 6, 6), elfHighlightMat);
    sparkle.position.set(ex + 0.008, 0.134, 0.165);
    headPivot.add(sparkle);

    const browCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(ex - 0.022, 0.16, 0.142),
      new THREE.Vector3(ex, 0.168, 0.148),
      new THREE.Vector3(ex + 0.022, 0.162, 0.142)
    ]);
    const brow = new THREE.Mesh(new THREE.TubeGeometry(browCurve, 6, 0.0055, 6, false), hairMat);
    headPivot.add(brow);

    const blush = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), elfBlushMat);
    blush.scale.set(1.22, 0.68, 0.42);
    blush.position.set(side * 0.095, 0.078, 0.132);
    headPivot.add(blush);
  });

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.023, 10, 10), elfNoseMat);
  nose.scale.set(0.92, 0.88, 1.16);
  nose.position.set(0, 0.096, 0.17);
  headPivot.add(nose);

  const smileCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.032, 0.06, 0.148),
    new THREE.Vector3(0, 0.048, 0.158),
    new THREE.Vector3(0.032, 0.06, 0.148)
  ]);
  const smile = new THREE.Mesh(new THREE.TubeGeometry(smileCurve, 8, 0.0055, 6, false), elfMouthMat);
  headPivot.add(smile);

  // --------------------------------------------------------------------------
  // 5. VALLENDE ELF-PUNTMUTS MET PLUCHE RAND & GOUDEN BELLETJE
  // --------------------------------------------------------------------------
  const hatRim = new THREE.Mesh(new THREE.TorusGeometry(0.162, 0.038, 10, 22), elfFurMat);
  hatRim.rotation.x = Math.PI / 2 - 0.22;
  hatRim.position.set(0, 0.228, -0.015);
  hatRim.castShadow = true;
  headPivot.add(hatRim);

  const droopDir = elfIndex % 2 === 0 ? 1 : -1;
  const hatCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.215, -0.015),
    new THREE.Vector3(droopDir * 0.025, 0.36, -0.035),
    new THREE.Vector3(droopDir * 0.105, 0.48, -0.085),
    new THREE.Vector3(droopDir * 0.185, 0.445, -0.135)
  ]);
  const hatMesh = new THREE.Mesh(
    createTaperedTubeGeometry(hatCurve, 18, 16, 0.162, 0.016),
    hatMat
  );
  hatMesh.castShadow = true;
  headPivot.add(hatMesh);

  const tipPos = hatCurve.getPointAt(1);
  const pom = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 10), elfFurMat);
  pom.position.copy(tipPos);
  pom.castShadow = true;
  headPivot.add(pom);

  const hatBell = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), elfGoldMat);
  hatBell.position.set(tipPos.x, tipPos.y - 0.044, tipPos.z);
  headPivot.add(hatBell);

  elfGroup.userData = {
    interactive: true,
    type: 'elfje',
    elfIndex: elfIndex,
    baseY: 0,
    baseRotY: rotY,
    phase: phase,
    throwTimer: 0,
    headPivot: headPivot,
    leftArmPivot: armPivots.left,
    rightArmPivot: armPivots.right
  };
  clickableObjects.push(elfGroup);
  elfCharacters.push(elfGroup);
}

createElfCharacter(-1.4, -1.2,  0.4, PASTEL.doorMint, PASTEL.poleRed, 0.0);
createElfCharacter( 1.5, -0.6, -0.5, PASTEL.wallLavender, PASTEL.doorMint, 1.7);
createElfCharacter( 1.1,  1.8, -0.8, 0xa3d8ff, PASTEL.wallPink, 3.2);

// ============================================================================
// PAD TUSSEN HET ELFENDORP EN DE WERKPLAATS VAN DE KERSTMAN
// ============================================================================
// Verbindt het dorpspleintje (z = 10.2) met de voordeur van de Werkplaats (z = -1.4)
// via een slingerend sneeuwvrij pad met pastel stapstenen en knusse lantaarntjes.

function createVillageToWorkshopPath() {
  const pathGroup = new THREE.Group();
  scene.add(pathGroup);

  const pathCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.8, 0, 10.2),
    new THREE.Vector3(2.1, 0,  7.8),
    new THREE.Vector3(2.5, 0,  5.2),
    new THREE.Vector3(2.4, 0,  2.6),
    new THREE.Vector3(2.1, 0, -0.1),
    new THREE.Vector3(1.8, 0, -0.45)
  ]);

  // 1. Vloeiend slingerend pad-bed (ExtrudeGeometry langs de curve)
  const segments = 36;
  const halfWidth = 0.56;
  const leftEdge = [];
  const rightEdge = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const pt = pathCurve.getPointAt(t);
    const tan = pathCurve.getTangentAt(t).normalize();
    // Loodrechte vector in het XZ-vlak
    const perpX = -tan.z;
    const perpZ = tan.x;

    leftEdge.push(new THREE.Vector2(pt.x + perpX * halfWidth, -(pt.z + perpZ * halfWidth)));
    rightEdge.push(new THREE.Vector2(pt.x - perpX * halfWidth, -(pt.z - perpZ * halfWidth)));
  }

  const pathShape = new THREE.Shape();
  pathShape.moveTo(leftEdge[0].x, leftEdge[0].y);
  for (let i = 1; i < leftEdge.length; i++) {
    pathShape.lineTo(leftEdge[i].x, leftEdge[i].y);
  }
  for (let i = rightEdge.length - 1; i >= 0; i--) {
    pathShape.lineTo(rightEdge[i].x, rightEdge[i].y);
  }
  pathShape.closePath();

  const pathBedGeo = new THREE.ExtrudeGeometry(pathShape, {
    depth: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.08,
    bevelSegments: 2
  });
  const pathBedMat = new THREE.MeshStandardMaterial({
    color: 0xf0dfed,
    roughness: 0.85,
    metalness: 0.02
  });
  const pathBed = new THREE.Mesh(pathBedGeo, pathBedMat);
  pathBed.rotation.x = -Math.PI / 2;
  pathBed.position.y = 0.015;
  pathBed.receiveShadow = true;
  pathGroup.add(pathBed);

  // 2. Pastel stapstenen langs het pad (sluiten aan op de stenen voor de Werkplaats)
  const stoneGeo = new THREE.CylinderGeometry(0.46, 0.54, 0.13, 16);
  const stoneCount = 8;
  for (let i = 0; i < stoneCount; i++) {
    const t = 0.08 + (i / (stoneCount - 1)) * 0.72;
    const pt = pathCurve.getPointAt(t);
    const tan = pathCurve.getTangentAt(t).normalize();
    const sway = (i % 2 === 0 ? 1 : -1) * 0.11;

    const stoneColor = PASTEL.rainbowHex[(i + 1) % PASTEL.rainbowHex.length];
    const stone = new THREE.Mesh(
      stoneGeo,
      new THREE.MeshStandardMaterial({ color: stoneColor, roughness: 0.55 })
    );
    stone.position.set(
      pt.x + -tan.z * sway,
      0.06,
      pt.z + tan.x * sway
    );
    stone.scale.setScalar(0.94 + (i % 3) * 0.05);
    stone.castShadow = true;
    stone.receiveShadow = true;
    pathGroup.add(stone);
  }

  // 3. Schattige warme pad-lantaarntjes aan beide kanten van het pad
  const lanternBaseGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.10, 10);
  const lanternPostGeo = new THREE.CylinderGeometry(0.05, 0.065, 0.82, 8);
  const lanternBulbGeo = new THREE.SphereGeometry(0.115, 10, 10);
  const lanternCapGeo = new THREE.ConeGeometry(0.18, 0.16, 6);
  const lanternTipGeo = new THREE.SphereGeometry(0.045, 8, 8);

  const lanternBulbMat = new THREE.MeshStandardMaterial({
    color: PASTEL.windowGlow,
    emissive: 0xffd166,
    emissiveIntensity: 1.05,
    roughness: 0.2
  });

  [0.16, 0.41, 0.66].forEach((t) => {
    const pt = pathCurve.getPointAt(t);
    const tan = pathCurve.getTangentAt(t).normalize();
    const perpX = -tan.z;
    const perpZ = tan.x;

    [-1, 1].forEach((side) => {
      const lantern = new THREE.Group();
      lantern.position.set(pt.x + perpX * side * 0.86, 0, pt.z + perpZ * side * 0.86);

      const base = new THREE.Mesh(lanternBaseGeo, roofSnowMat);
      base.position.y = 0.05;
      base.receiveShadow = true;
      lantern.add(base);

      const post = new THREE.Mesh(lanternPostGeo, woodMat);
      post.position.y = 0.46;
      post.castShadow = true;
      lantern.add(post);

      const bulb = new THREE.Mesh(lanternBulbGeo, lanternBulbMat);
      bulb.position.y = 0.94;
      lantern.add(bulb);

      const cap = new THREE.Mesh(lanternCapGeo, roofSnowMat);
      cap.position.y = 1.08;
      cap.castShadow = true;
      lantern.add(cap);

      const tip = new THREE.Mesh(lanternTipGeo, roofSnowMat);
      tip.position.y = 1.18;
      lantern.add(tip);

      pathGroup.add(lantern);
    });
  });
}

createVillageToWorkshopPath();

// ============================================================================
// VIJVER MET KLEINE VISJES (Links van het Elfendorp, ruim binnen het spoor)
// ============================================================================
// Het Elfendorp staat op (1.8, 0, 12.8). Links daarvan op (-8.0, 0, 10.6)
// leggen we een knusse pastel-vijver aan met besneeuwde oevers, kiezelsteentjes,
// drijvende waterlelies en een paar vrolijk zwemmende kleine visjes, ruim vrij
// van het treinspoor, het station, de Noordpool-paal en de sneeuwheuvel!

const pondFishList = [];
const pondRipples = [];
const pondLilies = [];

function createElfPond() {
  const pondGroup = new THREE.Group();
  pondGroup.position.set(-8.0, 0, 10.6);
  pondGroup.rotation.y = -0.65;
  scene.add(pondGroup);

  // Organische vorm van de vijver (afgerond ovaal met zachte bochten)
  const pondOutlinePoints = [];
  const sampleCount = 32;
  const rx = 2.75;
  const rz = 2.05;
  for (let i = 0; i < sampleCount; i++) {
    const a = (i / sampleCount) * Math.PI * 2;
    const organic = 1 + 0.1 * Math.sin(a * 2 + 0.5) + 0.06 * Math.cos(a * 3 - 0.4);
    pondOutlinePoints.push(
      new THREE.Vector2(Math.cos(a) * rx * organic, Math.sin(a) * rz * organic)
    );
  }

  const pondShape = new THREE.Shape(pondOutlinePoints);

  // 1. Donkerdere pastel aqua vijverbodem voor dieptegevoel
  const pondBedGeo = new THREE.ShapeGeometry(pondShape, 24);
  const pondBedMat = new THREE.MeshStandardMaterial({
    color: 0x4b93c9,
    roughness: 0.85,
    metalness: 0.05
  });
  const pondBed = new THREE.Mesh(pondBedGeo, pondBedMat);
  pondBed.rotation.x = -Math.PI / 2;
  pondBed.position.y = 0.025;
  pondBed.receiveShadow = true;
  pondGroup.add(pondBed);

  // 2. Zachte besneeuwde oeverrand rondom de vijver
  const rimCurvePoints = pondOutlinePoints.map(
    (p) => new THREE.Vector3(p.x * 1.03, 0, -p.y * 1.03)
  );
  const rimCurve = new THREE.CatmullRomCurve3(rimCurvePoints, true);
  const snowRimGeo = new THREE.TubeGeometry(rimCurve, 56, 0.24, 10, true);
  const snowRim = new THREE.Mesh(snowRimGeo, roofSnowMat);
  snowRim.scale.set(1, 0.48, 1);
  snowRim.position.y = 0.07;
  snowRim.receiveShadow = true;
  snowRim.castShadow = true;
  pondGroup.add(snowRim);

  // 3. Schattige pastel kiezelsteentjes rondom de vijverrand
  const pebbleColors = [
    0xd8d0f2, // Pastel lavendel
    0xb8e8d8, // Pastel mint
    0xffcfd8, // Pastel roze
    0xffe3c2, // Pastel perzik
    0xc7c0e6  // Zacht lila-grijs
  ];
  const pebbleGeo = new THREE.DodecahedronGeometry(1, 1);
  const pebbleCount = 22;
  for (let i = 0; i < pebbleCount; i++) {
    const t = i / pebbleCount;
    const pt = rimCurve.getPointAt(t);
    const outScale = 1.06 + (i % 3) * 0.04;
    const pebbleMat = new THREE.MeshStandardMaterial({
      color: pebbleColors[i % pebbleColors.length],
      roughness: 0.72
    });
    const pebble = new THREE.Mesh(pebbleGeo, pebbleMat);
    const rSize = 0.16 + ((i * 7) % 5) * 0.035;
    pebble.scale.set(rSize * 1.25, rSize * 0.62, rSize * 0.95);
    pebble.position.set(pt.x * outScale, rSize * 0.35 + 0.02, pt.z * outScale);
    pebble.rotation.y = i * 0.85;
    pebble.castShadow = true;
    pebble.receiveShadow = true;
    pondGroup.add(pebble);
  }

  // 4. Kleine winterse rietpolletjes aan de rand van de vijver
  const reedStemMat = new THREE.MeshStandardMaterial({ color: PASTEL.treeMint3, roughness: 0.7 });
  const reedTipMat = new THREE.MeshStandardMaterial({ color: PASTEL.woodCozy, roughness: 0.75 });
  const reedClusters = [
    { x: 2.35, z: -1.35 },
    { x: -2.25, z: 1.45 }
  ];
  reedClusters.forEach((rc, cIdx) => {
    for (let s = 0; s < 3; s++) {
      const h = 0.55 + s * 0.14;
      const ox = (s - 1) * 0.14;
      const oz = (s % 2 === 0 ? 0.08 : -0.08);
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.035, h, 8),
        reedStemMat
      );
      stem.position.set(rc.x + ox, h / 2, rc.z + oz);
      stem.rotation.z = (s - 1) * 0.12 * (cIdx === 0 ? 1 : -1);
      stem.castShadow = true;
      pondGroup.add(stem);

      if (s !== 1) {
        const tip = new THREE.Mesh(
          new THREE.CylinderGeometry(0.048, 0.048, 0.16, 8),
          reedTipMat
        );
        tip.position.set(
          rc.x + ox - Math.sin(stem.rotation.z) * (h * 0.42),
          h * 0.92,
          rc.z + oz
        );
        tip.rotation.z = stem.rotation.z;
        pondGroup.add(tip);
      }
    }
  });

  // 5. Twee schattige drijvende pastel waterlelies op het water
  const lilyConfigs = [
    { x: -1.45, z: -0.75, flowerColor: 0xffa6c9, scale: 0.95 },
    { x:  1.55, z:  0.85, flowerColor: 0xfff1a8, scale: 0.82 }
  ];
  const lilyPadMat = new THREE.MeshStandardMaterial({ color: PASTEL.treeMint1, roughness: 0.55 });
  lilyConfigs.forEach((lc, idx) => {
    const lilyGroup = new THREE.Group();
    lilyGroup.position.set(lc.x, 0.145, lc.z);
    lilyGroup.scale.setScalar(lc.scale);
    pondGroup.add(lilyGroup);

    const pad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.03, 18, 1, false, 0, Math.PI * 1.82),
      lilyPadMat
    );
    pad.rotation.y = idx * 1.4;
    lilyGroup.add(pad);

    const flowerMat = new THREE.MeshStandardMaterial({
      color: lc.flowerColor,
      emissive: lc.flowerColor,
      emissiveIntensity: 0.18,
      roughness: 0.4
    });
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), flowerMat);
      petal.scale.set(1.2, 0.7, 0.85);
      petal.position.set(Math.cos(a) * 0.07, 0.04, Math.sin(a) * 0.07);
      lilyGroup.add(petal);
    }
    const center = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 8, 8),
      new THREE.MeshStandardMaterial({ color: PASTEL.goldSoft, roughness: 0.3 })
    );
    center.position.y = 0.055;
    lilyGroup.add(center);

    pondLilies.push({ group: lilyGroup, baseY: 0.145, phase: idx * 2.1 });
  });

  // 6. Doorschijnend glinsterend wateroppervlak (zodat de visjes duidelijk zichtbaar blijven!)
  const waterGeo = new THREE.ShapeGeometry(pondShape, 24);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x8be2ff,
    emissive: 0x4cc9f0,
    emissiveIntensity: 0.14,
    roughness: 0.1,
    metalness: 0.18,
    transparent: true,
    opacity: 0.5,
    depthWrite: false
  });
  const waterSurface = new THREE.Mesh(waterGeo, waterMat);
  waterSurface.rotation.x = -Math.PI / 2;
  waterSurface.position.y = 0.14;
  waterSurface.scale.setScalar(0.985);
  waterSurface.renderOrder = 2;
  pondGroup.add(waterSurface);

  // Zacht aqua sfeerllichtje boven de vijver
  const pondLight = new THREE.PointLight(0x8be2ff, 0.34, 7.5);
  pondLight.position.set(0, 1.5, 0);
  pondGroup.add(pondLight);

  // 7. Subtiele golvende waterkringen op het oppervlak
  for (let r = 0; r < 3; r++) {
    const rippleMat = new THREE.MeshBasicMaterial({
      color: 0xe6fbff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });
    const ripple = new THREE.Mesh(new THREE.RingGeometry(0.18, 0.23, 28), rippleMat);
    ripple.rotation.x = -Math.PI / 2;
    ripple.position.set((r - 1) * 0.75, 0.148, (r % 2 === 0 ? 0.3 : -0.35));
    ripple.renderOrder = 3;
    pondGroup.add(ripple);

    pondRipples.push({
      mesh: ripple,
      material: rippleMat,
      progress: r / 3
    });
  }

  // 8. Een paar schattige kleine pastel-visjes die vrolijk rondzwemmen!
  function createLittleFish(fishConfig) {
    const fishGroup = new THREE.Group();
    fishGroup.scale.setScalar(fishConfig.scale);
    pondGroup.add(fishGroup);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: fishConfig.bodyColor,
      emissive: fishConfig.bodyColor,
      emissiveIntensity: 0.16,
      roughness: 0.35
    });
    const finMat = new THREE.MeshStandardMaterial({
      color: fishConfig.finColor,
      roughness: 0.4
    });

    // Lijfje (afgeronde ovaal, kop wijst naar +Z)
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 12), bodyMat);
    body.scale.set(0.72, 0.85, 1.45);
    fishGroup.add(body);

    // Rugvinnetje
    const dorsalFin = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 6), finMat);
    dorsalFin.scale.set(0.35, 1, 1.3);
    dorsalFin.rotation.x = -0.45;
    dorsalFin.position.set(0, 0.15, -0.04);
    fishGroup.add(dorsalFin);

    // Zijvinnetjes
    [-1, 1].forEach((side) => {
      const sideFin = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), finMat);
      sideFin.scale.set(1.2, 0.25, 0.8);
      sideFin.position.set(side * 0.13, -0.02, 0.04);
      sideFin.rotation.y = side * 0.4;
      fishGroup.add(sideFin);
    });

    // Oogjes aan beide kanten van het kopje
    [-1, 1].forEach((side) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), eyeMat);
      eye.position.set(side * 0.095, 0.045, 0.155);
      fishGroup.add(eye);
    });

    // Scharnierend staartvinnetje dat heen en weer kwispelt
    const tailPivot = new THREE.Group();
    tailPivot.position.set(0, 0, -0.22);
    fishGroup.add(tailPivot);

    const tailFin = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 6), finMat);
    tailFin.scale.set(0.32, 1, 1.05);
    tailFin.rotation.x = Math.PI / 2;
    tailFin.position.set(0, 0, -0.09);
    tailPivot.add(tailFin);

    pondFishList.push({
      group: fishGroup,
      tailPivot: tailPivot,
      centerX: fishConfig.centerX,
      centerZ: fishConfig.centerZ,
      orbitRx: fishConfig.orbitRx,
      orbitRz: fishConfig.orbitRz,
      speed: fishConfig.speed,
      phase: fishConfig.phase,
      baseY: fishConfig.baseY,
      jumpDelay: fishConfig.jumpDelay
    });
  }

  const fishConfigs = [
    {
      bodyColor: 0xff8fab, finColor: 0xffd1dc, scale: 0.85,
      centerX: 0.15, centerZ: 0.05, orbitRx: 1.55, orbitRz: 0.95,
      speed: 0.72, phase: 0.0, baseY: 0.09, jumpDelay: 0.0
    },
    {
      bodyColor: 0xffd166, finColor: 0xfff3b0, scale: 0.74,
      centerX: -0.25, centerZ: -0.1, orbitRx: 1.25, orbitRz: 0.82,
      speed: -0.88, phase: 1.8, baseY: 0.085, jumpDelay: 0.18
    },
    {
      bodyColor: 0xffb5a7, finColor: 0xffe5d9, scale: 0.68,
      centerX: 0.35, centerZ: 0.18, orbitRx: 0.95, orbitRz: 0.65,
      speed: 1.02, phase: 3.4, baseY: 0.08, jumpDelay: 0.34
    },
    {
      bodyColor: 0x9ef0c8, finColor: 0xd8f8e8, scale: 0.72,
      centerX: -0.35, centerZ: 0.2, orbitRx: 1.35, orbitRz: 0.72,
      speed: 0.64, phase: 4.9, baseY: 0.09, jumpDelay: 0.5
    },
    {
      bodyColor: 0xd8bfff, finColor: 0xf0e6ff, scale: 0.64,
      centerX: 0.0, centerZ: -0.2, orbitRx: 0.78, orbitRz: 0.52,
      speed: -1.1, phase: 2.5, baseY: 0.082, jumpDelay: 0.65
    }
  ];

  fishConfigs.forEach((fc) => createLittleFish(fc));

  pondGroup.userData = {
    interactive: true,
    type: 'vijver',
    splashTimer: 0
  };
  clickableObjects.push(pondGroup);
  return pondGroup;
}

const elfPondGroup = createElfPond();

// ============================================================================
// KLEIN REUZERAD BIJ HET ELFENDORP (Rechts van het Elfendorp, binnen het spoor)
// ============================================================================
// Het Elfendorp staat op (1.8, 0, 12.8). Rechts daarvan op (9.3, 0, 12.4)
// plaatsen we een gezellig klein pastel-reuzerad met 8 schommelende gondels,
// mini-elfjes die meerijden en fonkelende regenbooglampjes langs de rand!

const ferrisGondolas = [];

function createVillageFerrisWheel() {
  const ferrisGroup = new THREE.Group();
  ferrisGroup.position.set(9.3, 0, 12.4);
  ferrisGroup.rotation.y = -0.52;
  scene.add(ferrisGroup);

  const axleY = 2.82;
  const wheelRadius = 1.72;
  const rimHalfZ = 0.36;
  const frameHalfZ = 0.60;

  // 1. Besneeuwde onderplint en knus houten instapdek
  const basePlinth = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 0.16, 2.1),
    roofSnowMat
  );
  basePlinth.position.y = 0.08;
  basePlinth.receiveShadow = true;
  basePlinth.castShadow = true;
  ferrisGroup.add(basePlinth);

  const woodDeck = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.08, 1.55),
    woodMat
  );
  woodDeck.position.y = 0.20;
  woodDeck.receiveShadow = true;
  ferrisGroup.add(woodDeck);

  // Klein opstapje aan de voorkant richting het Elfendorp
  const frontStep = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.09, 0.32),
    new THREE.MeshStandardMaterial({ color: PASTEL.wallLavender, roughness: 0.65 })
  );
  frontStep.position.set(0, 0.12, 1.12);
  frontStep.receiveShadow = true;
  ferrisGroup.add(frontStep);

  // 2. Stevige pastel A-frame steunpoten (voor & achter)
  const frameMat = new THREE.MeshStandardMaterial({ color: PASTEL.poleWhite, roughness: 0.45 });
  const accentMat = new THREE.MeshStandardMaterial({ color: PASTEL.goldSoft, roughness: 0.28, metalness: 0.35 });
  const footMat = new THREE.MeshStandardMaterial({ color: PASTEL.wallPink, roughness: 0.6 });

  const baseHalfX = 1.12;
  const legDeltaY = axleY - 0.22;
  const legLen = Math.hypot(baseHalfX, legDeltaY);
  const legAngle = Math.atan2(baseHalfX, legDeltaY);
  const legMidY = 0.22 + legDeltaY / 2;

  [-frameHalfZ, frameHalfZ].forEach((fz) => {
    // Linker en rechter schuine poot
    [-1, 1].forEach((side) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.09, legLen, 10),
        frameMat
      );
      leg.position.set(side * (baseHalfX / 2), legMidY, fz);
      leg.rotation.z = side * legAngle;
      leg.castShadow = true;
      ferrisGroup.add(leg);

      // Pastel voetkussentje onderaan elke poot
      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.16, 0.12, 12),
        footMat
      );
      foot.position.set(side * baseHalfX, 0.26, fz);
      ferrisGroup.add(foot);
    });

    // Horizontale dwarsbalk halverwege voor extra stevigheid
    const crossBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 1.32, 10),
      frameMat
    );
    crossBar.rotation.z = Math.PI / 2;
    crossBar.position.set(0, 1.35, fz);
    crossBar.castShadow = true;
    ferrisGroup.add(crossBar);

    // Gouden eindkap + ster-ornament bovenop het A-frame
    const hubCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.10, 16),
      accentMat
    );
    hubCap.rotation.x = Math.PI / 2;
    hubCap.position.set(0, axleY, fz);
    ferrisGroup.add(hubCap);

    const topKnob = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.13, 0),
      accentMat
    );
    topKnob.position.set(0, axleY + 0.18, fz);
    ferrisGroup.add(topKnob);
  });

  // Centrale draai-as
  const mainAxle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.075, frameHalfZ * 2 + 0.24, 14),
    accentMat
  );
  mainAxle.rotation.x = Math.PI / 2;
  mainAxle.position.y = axleY;
  ferrisGroup.add(mainAxle);

  // 3. Het draaiende reuzerad (velgen, spaken, lampjes & 8 gondels)
  const wheelPivot = new THREE.Group();
  wheelPivot.position.set(0, axleY, 0);
  ferrisGroup.add(wheelPivot);

  const outerRimMat = new THREE.MeshStandardMaterial({ color: PASTEL.poleRed, roughness: 0.38 });
  const innerRimMat = new THREE.MeshStandardMaterial({ color: PASTEL.doorMint, roughness: 0.45 });
  const spokeMat = new THREE.MeshStandardMaterial({ color: PASTEL.poleWhite, roughness: 0.45 });

  [-rimHalfZ, rimHalfZ].forEach((rz) => {
    const outerRim = new THREE.Mesh(
      new THREE.TorusGeometry(wheelRadius, 0.05, 10, 44),
      outerRimMat
    );
    outerRim.position.z = rz;
    outerRim.castShadow = true;
    wheelPivot.add(outerRim);

    const innerRim = new THREE.Mesh(
      new THREE.TorusGeometry(wheelRadius * 0.56, 0.032, 8, 32),
      innerRimMat
    );
    innerRim.position.z = rz;
    wheelPivot.add(innerRim);
  });

  // 8 Spaken, dwarsstangen en vrolijke pastel-gondels
  const gondolaCount = 8;
  const gondolaRoofMat = new THREE.MeshStandardMaterial({ color: PASTEL.snowWhite, roughness: 0.5 });
  const gondolaPoleMat = new THREE.MeshStandardMaterial({ color: PASTEL.goldSoft, roughness: 0.3, metalness: 0.35 });

  for (let i = 0; i < gondolaCount; i++) {
    const angle = (i / gondolaCount) * Math.PI * 2;
    const gx = Math.cos(angle) * wheelRadius;
    const gy = Math.sin(angle) * wheelRadius;

    // Voor- en achterspaak vanaf de as naar de velg
    [-rimHalfZ, rimHalfZ].forEach((rz) => {
      const spoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, wheelRadius, 8),
        spokeMat
      );
      spoke.position.set(gx * 0.5, gy * 0.5, rz);
      spoke.rotation.z = angle - Math.PI / 2;
      wheelPivot.add(spoke);
    });

    // Horizontaal draaipunt-stangetje tussen voor- en achtervelg
    const crossPin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, rimHalfZ * 2, 8),
      gondolaPoleMat
    );
    crossPin.rotation.x = Math.PI / 2;
    crossPin.position.set(gx, gy, 0);
    wheelPivot.add(crossPin);

    // Scharnierende gondel die altijd rechtop blijft hangen
    const gondolaPivot = new THREE.Group();
    gondolaPivot.position.set(gx, gy, 0);
    wheelPivot.add(gondolaPivot);

    const cabColor = PASTEL.rainbowHex[i % PASTEL.rainbowHex.length];
    const cabMat = new THREE.MeshStandardMaterial({ color: cabColor, roughness: 0.48 });

    // Ophangstang
    const hanger = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.22, 8),
      gondolaPoleMat
    );
    hanger.position.y = -0.11;
    gondolaPivot.add(hanger);

    // Dakje van het gondeltje + gouden knopje
    const canopy = new THREE.Mesh(
      new THREE.ConeGeometry(0.25, 0.14, 12),
      cabMat
    );
    canopy.position.y = -0.24;
    canopy.castShadow = true;
    gondolaPivot.add(canopy);

    const canopyRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.23, 0.025, 6, 16),
      gondolaRoofMat
    );
    canopyRim.rotation.x = Math.PI / 2;
    canopyRim.position.y = -0.30;
    gondolaPivot.add(canopyRim);

    // Twee dunne zijstijltjes tussen dakje en bakje
    [-0.16, 0.16].forEach((sx) => {
      const strut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.22, 6),
        gondolaPoleMat
      );
      strut.position.set(sx, -0.39, 0);
      gondolaPivot.add(strut);
    });

    // Schattig pastel gondel-bakje
    const basket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.16, 0.22, 12),
      cabMat
    );
    basket.position.y = -0.54;
    basket.castShadow = true;
    gondolaPivot.add(basket);

    const basketRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.205, 0.026, 8, 16),
      gondolaRoofMat
    );
    basketRim.rotation.x = Math.PI / 2;
    basketRim.position.y = -0.43;
    gondolaPivot.add(basketRim);

    // In de helft van de bakjes zit een klein gedetailleerd elfje te genieten van het uitzicht!
    if (i % 2 === 0) {
      const miniElf = new THREE.Group();
      miniElf.position.set(0, -0.47, 0.025);
      gondolaPivot.add(miniElf);

      const hatColor = PASTEL.rainbowHex[(i + 3) % PASTEL.rainbowHex.length];
      const jacketColor = PASTEL.rainbowHex[(i + 1) % PASTEL.rainbowHex.length];
      const miniJacketMat = new THREE.MeshStandardMaterial({ color: jacketColor, roughness: 0.62 });
      const miniHatMat = new THREE.MeshStandardMaterial({
        color: hatColor,
        roughness: 0.6,
        side: THREE.DoubleSide
      });

      const miniTorso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.072, 0.1, 10),
        miniJacketMat
      );
      miniElf.add(miniTorso);

      const miniCollar = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.015, 6, 12), elfFurMat);
      miniCollar.rotation.x = Math.PI / 2;
      miniCollar.position.y = 0.048;
      miniElf.add(miniCollar);

      const miniHead = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 12), elfSkinMat);
      miniHead.scale.set(0.96, 1.02, 0.96);
      miniHead.position.y = 0.095;
      miniElf.add(miniHead);

      // Kleine spitse oortjes
      [-1, 1].forEach((side) => {
        const mEar = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.048, 6), elfSkinMat);
        mEar.position.set(side * 0.075, 0.098, 0);
        mEar.rotation.z = -side * 1.1;
        miniElf.add(mEar);
      });

      // Oogjes, lichtpuntjes, blosjes & neusje
      [-0.024, 0.024].forEach((ex) => {
        const mEye = new THREE.Mesh(new THREE.SphereGeometry(0.011, 6, 6), eyeMat);
        mEye.position.set(ex, 0.098, 0.058);
        miniElf.add(mEye);

        const mShine = new THREE.Mesh(new THREE.SphereGeometry(0.004, 4, 4), elfHighlightMat);
        mShine.position.set(ex + 0.003, 0.102, 0.067);
        miniElf.add(mShine);

        const mBlush = new THREE.Mesh(new THREE.SphereGeometry(0.013, 6, 6), elfBlushMat);
        mBlush.scale.set(1.15, 0.65, 0.45);
        mBlush.position.set(ex * 1.65, 0.078, 0.052);
        miniElf.add(mBlush);
      });

      const mNose = new THREE.Mesh(new THREE.SphereGeometry(0.011, 6, 6), elfNoseMat);
      mNose.position.set(0, 0.086, 0.068);
      miniElf.add(mNose);

      // Mutsje met witte rand en pomponnetje
      const miniRim = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.016, 6, 14), elfFurMat);
      miniRim.rotation.x = Math.PI / 2 - 0.16;
      miniRim.position.set(0, 0.135, -0.004);
      miniElf.add(miniRim);

      const miniHatCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.132, -0.005),
        new THREE.Vector3(0.015, 0.19, -0.015),
        new THREE.Vector3(0.05, 0.23, -0.04)
      ]);
      const miniHat = new THREE.Mesh(
        createTaperedTubeGeometry(miniHatCurve, 10, 10, 0.064, 0.01),
        miniHatMat
      );
      miniElf.add(miniHat);

      const miniPom = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), elfFurMat);
      miniPom.position.set(0.05, 0.23, -0.04);
      miniElf.add(miniPom);
    }

    ferrisGondolas.push({
      pivot: gondolaPivot,
      phase: i * 0.85
    });
  }

  // 4. Fonkelende regenbooglampjes rond beide velgen van het reuzerad
  const ferrisBulbGeo = new THREE.SphereGeometry(0.062, 8, 8);
  const ferrisBulbCount = 16;
  for (let b = 0; b < ferrisBulbCount; b++) {
    const ba = (b / ferrisBulbCount) * Math.PI * 2;
    const bx = Math.cos(ba) * wheelRadius;
    const by = Math.sin(ba) * wheelRadius;
    const colorHex = PASTEL.rainbowHex[b % PASTEL.rainbowHex.length];

    [-rimHalfZ - 0.04, rimHalfZ + 0.04].forEach((bz, sideIdx) => {
      const bulbMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.95,
        roughness: 0.2
      });
      const bulb = new THREE.Mesh(ferrisBulbGeo, bulbMat);
      bulb.position.set(bx, by, bz);
      wheelPivot.add(bulb);

      allRainbowLights.push({
        mesh: bulb,
        material: bulbMat,
        phase: b * 0.4 + sideIdx * 0.5,
        treeIndex: -1,
        isFerrisBulb: true
      });
    });
  }

  // 5. Schattig naambordje bij de ingang van het reuzerad
  const signPost = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.065, 1.05, 8),
    woodMat
  );
  signPost.position.set(-1.18, 0.54, 0.92);
  signPost.castShadow = true;
  ferrisGroup.add(signPost);

  const ferrisSignTex = createSignTexture(
    'Reuzerad',
    '🎡 Elfjes Kermis ✨',
    '#fff0f6',
    '#a3d8ff',
    '#4a2545'
  );
  const ferrisSign = new THREE.Mesh(
    new THREE.BoxGeometry(1.18, 0.48, 0.08),
    new THREE.MeshStandardMaterial({ map: ferrisSignTex, roughness: 0.45 })
  );
  ferrisSign.position.set(-1.18, 1.02, 0.95);
  ferrisSign.rotation.y = 0.25;
  ferrisGroup.add(ferrisSign);

  // Zacht warm pastel-roze lichtje bij het reuzerad
  const ferrisLight = new THREE.PointLight(0xffd6e8, 0.45, 9);
  ferrisLight.position.set(0, axleY, 0.9);
  ferrisGroup.add(ferrisLight);

  // Paar gezellige mini-stapstenen vanaf de rand van het Elfendorp naar het reuzerad
  [
    { x: 6.9, z: 13.4 },
    { x: 7.9, z: 13.1 }
  ].forEach((sp, idx) => {
    const stepStone = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.42, 0.11, 14),
      new THREE.MeshStandardMaterial({
        color: PASTEL.rainbowHex[(idx + 4) % PASTEL.rainbowHex.length],
        roughness: 0.55
      })
    );
    stepStone.position.set(sp.x, 0.05, sp.z);
    stepStone.receiveShadow = true;
    scene.add(stepStone);
  });

  ferrisGroup.userData = {
    interactive: true,
    type: 'reuzerad',
    wheelPivot: wheelPivot,
    wheelAngle: 0,
    speedBoostTimer: 0
  };
  clickableObjects.push(ferrisGroup);
  return ferrisGroup;
}

const villageFerrisWheel = createVillageFerrisWheel();

/**
 * Bouwt één complete pastel-kerstboom met stam, 4 dennenlagen, piekster en
 * 16 regenbooglampjes.
 */
function createChristmasTree(x, z, scale, treeIndex) {
  const treeGroup = new THREE.Group();
  treeGroup.position.set(x, 0, z);
  treeGroup.scale.setScalar(scale);
  scene.add(treeGroup);

  // Boomstam (CylinderGeometry)
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.36, 0.9, 12),
    woodMat
  );
  trunk.position.y = 0.45;
  trunk.castShadow = true;
  treeGroup.add(trunk);

  // 4 Gestapelde kegels (ConeGeometry) in zachte pastel-mintgroene tinten
  const layers = [
    { radius: 1.65, height: 1.6, y: 1.4, color: PASTEL.treeMint3 },
    { radius: 1.35, height: 1.45, y: 2.35, color: PASTEL.treeMint1 },
    { radius: 1.05, height: 1.3, y: 3.2, color: PASTEL.treeMint2 },
    { radius: 0.72, height: 1.1, y: 3.95, color: PASTEL.treeMint1 }
  ];

  layers.forEach((l) => {
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(l.radius, l.height, 16),
      new THREE.MeshStandardMaterial({ color: l.color, roughness: 0.65 })
    );
    cone.position.y = l.y;
    cone.castShadow = true;
    cone.receiveShadow = true;
    treeGroup.add(cone);

    // Zacht sneeuwrandje onderaan elke takkenlaag (TorusGeometry)
    const snowRim = new THREE.Mesh(
      new THREE.TorusGeometry(l.radius * 0.92, 0.09, 8, 20),
      roofSnowMat
    );
    snowRim.rotation.x = Math.PI / 2;
    snowRim.position.y = l.y - l.height / 2 + 0.06;
    treeGroup.add(snowRim);
  });

  // Gloeiende pastel-ster bovenop de boom (OctahedronGeometry)
  const starMat = new THREE.MeshStandardMaterial({
    color: PASTEL.goldSoft,
    emissive: 0xffe066,
    emissiveIntensity: 0.8,
    roughness: 0.2
  });
  const topStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 0), starMat);
  topStar.position.y = 4.68;
  topStar.rotation.y = Math.PI / 4;
  treeGroup.add(topStar);

  // 16 Regenboog-lampjes die in een spiraal rond de boom draaien
  const bulbGeo = new THREE.SphereGeometry(0.11, 10, 10);
  const bulbCount = 16;

  for (let i = 0; i < bulbCount; i++) {
    const t = i / (bulbCount - 1); // Loopt van 0 (onderaan) naar 1 (bovenaan)
    const angle = i * 1.15;
    const height = 0.85 + t * 3.3;
    const radiusAtHeight = (1 - t * 0.72) * 1.48;

    const initialColor = PASTEL.rainbowHex[i % PASTEL.rainbowHex.length];
    const bulbMat = new THREE.MeshStandardMaterial({
      color: initialColor,
      emissive: initialColor,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });

    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(
      Math.cos(angle) * radiusAtHeight,
      height,
      Math.sin(angle) * radiusAtHeight
    );
    treeGroup.add(bulb);

    allRainbowLights.push({
      mesh: bulb,
      material: bulbMat,
      phase: i * 0.42 + treeIndex * 0.9,
      treeIndex: treeIndex
    });
  }

  // Maak elke kerstboom ook klikbaar (Raycasting!)
  treeGroup.userData = {
    interactive: true,
    type: 'boom',
    treeIndex: treeIndex,
    baseScale: scale,
    boostTimer: 0,
    topStar: topStar,
    starMat: starMat
  };

  clickableObjects.push(treeGroup);
  christmasTrees.push(treeGroup);
}

// Plaats 7 kerstbomen verspreid over de Noordpool (eis: minstens 5!)
const treeLocations = [
  { x: -9.5, z: -3.2, scale: 1.15 },
  { x: -7.2, z:  2.4, scale: 0.95 },
  { x: -5.5, z: -7.8, scale: 1.25 },
  { x: 11.8, z: -3.2, scale: 1.10 },
  { x:  9.6, z:  1.2, scale: 1.00 },
  { x: -1.8, z: -9.2, scale: 0.90 },
  { x:  5.8, z: -9.4, scale: 1.18 }
];

treeLocations.forEach((loc, index) => {
  createChristmasTree(loc.x, loc.z, loc.scale, index);
});


// ============================================================================
// HOOFDSTUK 8: IETS DAT BEWEEGT ZONDER DAT JIJ IETS DOET
// (1. Vliegende Slee + Rendieren, 2. Pastel Noorderlicht, 3. Schoorsteenrook)
// ============================================================================

// --- 8A. Vliegende Pastel-Slee met Rendieren in de lucht ---
const sleighPivot = new THREE.Group();
sleighPivot.position.set(0, 11.5, -2);
scene.add(sleighPivot);

const sleighAndTeam = new THREE.Group();
// De slee vliegt op een straal van 12.5 eenheden rond het middelpunt
sleighAndTeam.position.set(12.5, 0, 0);
sleighPivot.add(sleighAndTeam);

const sleighGroup = new THREE.Group();
sleighAndTeam.add(sleighGroup);

// Materialen voor de slee
const sleighRedMat = new THREE.MeshStandardMaterial({
  color: PASTEL.poleRed,
  roughness: 0.35,
  metalness: 0.05
});
const sleighCushionMat = new THREE.MeshStandardMaterial({
  color: PASTEL.wallLavender,
  roughness: 0.75
});
const sleighGoldMat = new THREE.MeshStandardMaterial({
  color: PASTEL.goldSoft,
  roughness: 0.28,
  metalness: 0.55
});
const sleighCreamMat = new THREE.MeshStandardMaterial({
  color: PASTEL.snowWhite,
  roughness: 0.8
});

// 1. Gebogen slee-kuip (ExtrudeGeometry met zachte afgeschuinde randen)
const tubShape = new THREE.Shape();
tubShape.moveTo(-1.12, 0.35);
tubShape.bezierCurveTo(-0.3, 0.31, 0.55, 0.31, 1.02, 0.49);
tubShape.bezierCurveTo(1.22, 0.59, 1.24, 0.83, 1.04, 0.93);
tubShape.bezierCurveTo(0.92, 0.86, 0.82, 0.54, 0.45, 0.50);
tubShape.lineTo(-0.45, 0.50);
tubShape.bezierCurveTo(-0.75, 0.56, -0.95, 0.95, -1.16, 1.18);
tubShape.lineTo(-1.24, 1.16);
tubShape.bezierCurveTo(-1.36, 0.95, -1.30, 0.52, -1.12, 0.35);

const tubGeo = new THREE.ExtrudeGeometry(tubShape, {
  depth: 1.08,
  bevelEnabled: true,
  bevelThickness: 0.035,
  bevelSize: 0.025,
  bevelSegments: 4,
  curveSegments: 24
});
tubGeo.translate(0, 0, -0.54);
const sleighTub = new THREE.Mesh(tubGeo, sleighRedMat);
sleighTub.rotation.y = -Math.PI / 2;
sleighGroup.add(sleighTub);

// 2. Sierlijke gebogen zijwanden met krullende rugleuning en neus
const sideShape = new THREE.Shape();
sideShape.moveTo(-1.15, 0.34);
sideShape.bezierCurveTo(-0.3, 0.30, 0.55, 0.30, 1.05, 0.48);
sideShape.bezierCurveTo(1.28, 0.58, 1.32, 0.85, 1.08, 0.98);
sideShape.bezierCurveTo(0.95, 1.03, 0.86, 0.92, 0.78, 0.84);
sideShape.bezierCurveTo(0.55, 0.70, 0.05, 0.68, -0.30, 0.82);
sideShape.bezierCurveTo(-0.68, 0.98, -0.95, 1.28, -1.25, 1.24);
sideShape.bezierCurveTo(-1.42, 1.20, -1.35, 0.55, -1.15, 0.34);

const sideGeo = new THREE.ExtrudeGeometry(sideShape, {
  depth: 0.09,
  bevelEnabled: true,
  bevelThickness: 0.03,
  bevelSize: 0.025,
  bevelSegments: 4,
  curveSegments: 24
});
sideGeo.translate(0, 0, -0.045);

[-0.57, 0.57].forEach((sx) => {
  const sideWall = new THREE.Mesh(sideGeo, sleighRedMat);
  sideWall.rotation.y = -Math.PI / 2;
  sideWall.position.x = sx;
  sleighGroup.add(sideWall);

  // Gouden bies langs de sierlijke bovenrand van elke zijwand
  const rimCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(sx, 1.24, -1.24),
    new THREE.Vector3(sx, 1.12, -0.82),
    new THREE.Vector3(sx, 0.82, -0.28),
    new THREE.Vector3(sx, 0.72, 0.32),
    new THREE.Vector3(sx, 0.88, 0.82),
    new THREE.Vector3(sx, 0.98, 1.08)
  ]);
  const rimTube = new THREE.Mesh(
    new THREE.TubeGeometry(rimCurve, 28, 0.032, 8, false),
    sleighGoldMat
  );
  sleighGroup.add(rimTube);
});

// 3. Zachte kussens en cadeautjes-zak in de slee
const seatCushion = new THREE.Mesh(
  new THREE.SphereGeometry(0.45, 16, 12),
  sleighCushionMat
);
seatCushion.scale.set(1.12, 0.36, 0.88);
seatCushion.position.set(0, 0.60, -0.22);
sleighGroup.add(seatCushion);

const backCushion = new THREE.Mesh(
  new THREE.SphereGeometry(0.46, 16, 12),
  sleighCushionMat
);
backCushion.scale.set(1.08, 0.62, 0.38);
backCushion.position.set(0, 0.88, -0.84);
backCushion.rotation.x = -0.35;
sleighGroup.add(backCushion);

// Pluizige cadeautjes-zak achterin de slee
const toySackMat = new THREE.MeshStandardMaterial({
  color: PASTEL.treeMint2,
  roughness: 0.75
});
const toySack = new THREE.Mesh(
  new THREE.SphereGeometry(0.32, 14, 12),
  toySackMat
);
toySack.scale.set(1.05, 1.18, 0.9);
toySack.position.set(-0.22, 0.86, -0.62);
sleighGroup.add(toySack);

const sackTie = new THREE.Mesh(
  new THREE.TorusGeometry(0.11, 0.028, 8, 14),
  sleighGoldMat
);
sackTie.rotation.x = Math.PI / 2;
sackTie.position.set(-0.22, 1.15, -0.62);
sleighGroup.add(sackTie);

const sackTop = new THREE.Mesh(
  new THREE.ConeGeometry(0.16, 0.2, 12),
  toySackMat
);
sackTop.rotation.x = Math.PI;
sackTop.position.set(-0.22, 1.24, -0.62);
sleighGroup.add(sackTop);

// 4. Sierlijk krullende gouden glij-ijzers & steunbeugels
[-0.56, 0.56].forEach((rx) => {
  const runnerCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(rx, 0.14, -1.32),
    new THREE.Vector3(rx, 0.05, -0.95),
    new THREE.Vector3(rx, 0.05, 0.82),
    new THREE.Vector3(rx, 0.18, 1.25),
    new THREE.Vector3(rx, 0.45, 1.52),
    new THREE.Vector3(rx, 0.72, 1.46),
    new THREE.Vector3(rx, 0.78, 1.24),
    new THREE.Vector3(rx, 0.64, 1.16)
  ]);
  const runner = new THREE.Mesh(
    new THREE.TubeGeometry(runnerCurve, 36, 0.048, 10, false),
    sleighGoldMat
  );
  sleighGroup.add(runner);

  // Afgerond gouden knopje op het uiteinde van de krul
  const runnerTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.062, 10, 10),
    sleighGoldMat
  );
  runnerTip.position.set(rx, 0.64, 1.16);
  sleighGroup.add(runnerTip);

  // Twee gebogen steunen tussen glij-ijzer en slee-bak
  [-0.72, 0.62].forEach((sz) => {
    const strutCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(rx, 0.06, sz),
      new THREE.Vector3(rx * 0.92, 0.22, sz + 0.04),
      new THREE.Vector3(rx * 0.85, 0.38, sz)
    ]);
    const strut = new THREE.Mesh(
      new THREE.TubeGeometry(strutCurve, 10, 0.036, 8, false),
      sleighGoldMat
    );
    sleighGroup.add(strut);
  });
});

// Gouden lantaarntje voorop de slee
const sleighLantern = new THREE.Mesh(
  new THREE.SphereGeometry(0.09, 12, 12),
  new THREE.MeshStandardMaterial({
    color: PASTEL.windowGlow,
    emissive: PASTEL.windowGlow,
    emissiveIntensity: 1.2
  })
);
sleighLantern.position.set(0, 0.95, 1.12);
sleighGroup.add(sleighLantern);

// 5. Schattige, afgeronde Mini-Kerstman in de slee
const miniSanta = new THREE.Group();
miniSanta.position.set(0.05, 0.74, -0.14);
sleighGroup.add(miniSanta);

const santaBody = new THREE.Mesh(
  new THREE.SphereGeometry(0.31, 16, 14),
  sleighRedMat
);
santaBody.scale.set(1.06, 1.14, 0.94);
santaBody.position.y = 0.28;
miniSanta.add(santaBody);

const santaBelt = new THREE.Mesh(
  new THREE.TorusGeometry(0.305, 0.038, 8, 20),
  sleighGoldMat
);
santaBelt.rotation.x = Math.PI / 2;
santaBelt.position.y = 0.23;
miniSanta.add(santaBelt);

const santaCollar = new THREE.Mesh(
  new THREE.TorusGeometry(0.21, 0.058, 10, 18),
  sleighCreamMat
);
santaCollar.rotation.x = Math.PI / 2;
santaCollar.position.y = 0.56;
miniSanta.add(santaCollar);

const miniSantaHead = new THREE.Mesh(
  new THREE.SphereGeometry(0.22, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xffd6c0, roughness: 0.65 })
);
miniSantaHead.position.set(0, 0.72, 0.02);
miniSanta.add(miniSantaHead);

// Zachte witte wolkenbaard + snor
const beardOffsets = [
  [0, 0.59, 0.16, 0.12],
  [-0.09, 0.63, 0.14, 0.09],
  [0.09, 0.63, 0.14, 0.09],
  [-0.05, 0.54, 0.14, 0.095],
  [0.05, 0.54, 0.14, 0.095]
];
beardOffsets.forEach(([bx, by, bz, br]) => {
  const puff = new THREE.Mesh(new THREE.SphereGeometry(br, 10, 10), sleighCreamMat);
  puff.position.set(bx, by, bz);
  miniSanta.add(puff);
});

// Oogjes, rode wangetjes en neusje van de Kerstman
const santaEyeMat = new THREE.MeshBasicMaterial({ color: 0x2b193d });
[-0.075, 0.075].forEach((ex) => {
  const sEye = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), santaEyeMat);
  sEye.position.set(ex, 0.76, 0.21);
  miniSanta.add(sEye);

  const sBlush = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xff85a2 })
  );
  sBlush.scale.set(1.1, 0.7, 0.5);
  sBlush.position.set(ex * 1.65, 0.70, 0.19);
  miniSanta.add(sBlush);
});

const santaNose = new THREE.Mesh(
  new THREE.SphereGeometry(0.04, 10, 10),
  new THREE.MeshStandardMaterial({ color: 0xff9ebb })
);
santaNose.position.set(0, 0.71, 0.24);
miniSanta.add(santaNose);

// Kerstmuts met witte bontrand en pompon
const hatRim = new THREE.Mesh(
  new THREE.TorusGeometry(0.20, 0.055, 10, 20),
  sleighCreamMat
);
hatRim.rotation.x = Math.PI / 2 - 0.15;
hatRim.position.set(0, 0.87, -0.01);
miniSanta.add(hatRim);

const miniSantaHat = new THREE.Mesh(
  new THREE.ConeGeometry(0.21, 0.46, 16),
  sleighRedMat
);
miniSantaHat.position.set(0, 1.07, -0.08);
miniSantaHat.rotation.x = -0.26;
miniSanta.add(miniSantaHat);

const hatPom = new THREE.Mesh(
  new THREE.SphereGeometry(0.075, 10, 10),
  sleighCreamMat
);
hatPom.position.set(0, 1.29, -0.14);
miniSanta.add(hatPom);

// Armpjes met wantjes die de teugels vasthouden
[-0.26, 0.26].forEach((ax) => {
  const armCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(ax * 0.85, 0.46, 0.0),
    new THREE.Vector3(ax, 0.38, 0.20),
    new THREE.Vector3(ax * 0.75, 0.36, 0.36)
  ]);
  const arm = new THREE.Mesh(
    new THREE.TubeGeometry(armCurve, 10, 0.068, 8, false),
    sleighRedMat
  );
  miniSanta.add(arm);

  const mitten = new THREE.Mesh(
    new THREE.SphereGeometry(0.078, 10, 10),
    sleighCreamMat
  );
  mitten.position.set(ax * 0.75, 0.36, 0.38);
  miniSanta.add(mitten);
});

// 6. Schattige, organisch gevormde Rendieren in een V-formatie (geen blokken!)
const reindeerList = [];
const furMat = new THREE.MeshStandardMaterial({ color: 0xc8967c, roughness: 0.68 });
const muzzleMat = new THREE.MeshStandardMaterial({ color: 0xe8c4ae, roughness: 0.7 });
const hoofMat = new THREE.MeshStandardMaterial({ color: 0x5c3d38, roughness: 0.6 });
const antlerMat = new THREE.MeshStandardMaterial({ color: 0xfff0e5, roughness: 0.5 });
const innerEarMat = new THREE.MeshStandardMaterial({ color: 0xffb3c6, roughness: 0.7 });

function createReindeer(offsetX, offsetZ, hasGlowingNose, scaleFactor, options = {}) {
  const parentGroup = options.parentGroup || sleighAndTeam;
  const addToFlyingTeam = options.addToFlyingTeam !== false;
  const baseY = options.baseY !== undefined ? options.baseY : 0.22;
  const baseRotY = options.rotY || 0;
  const collarMat = options.collarColor
    ? new THREE.MeshStandardMaterial({ color: options.collarColor, roughness: 0.35 })
    : sleighRedMat;

  const deer = new THREE.Group();
  deer.position.set(offsetX, baseY, offsetZ);
  deer.rotation.y = baseRotY;
  deer.scale.setScalar(scaleFactor);
  parentGroup.add(deer);

  // Afgerond ovaal lichaam + pluizige borst + staartje
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.30, 18, 14), furMat);
  body.scale.set(0.88, 0.84, 1.56);
  body.position.set(0, 0.56, 0);
  deer.add(body);

  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.21, 14, 12), muzzleMat);
  chest.scale.set(0.92, 1.05, 0.85);
  chest.position.set(0, 0.54, 0.32);
  deer.add(chest);

  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 10), muzzleMat);
  tail.scale.set(0.75, 1.15, 1.35);
  tail.position.set(0, 0.68, -0.46);
  tail.rotation.x = 0.5;
  deer.add(tail);

  // Zachte hals + pastel halsband met gouden belletje
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.20, 0.42, 14),
    furMat
  );
  neck.position.set(0, 0.76, 0.36);
  neck.rotation.x = 0.44;
  deer.add(neck);

  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.036, 10, 18),
    collarMat
  );
  collar.position.set(0, 0.66, 0.31);
  collar.rotation.x = Math.PI / 2 + 0.42;
  deer.add(collar);

  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 10), sleighGoldMat);
  bell.position.set(0, 0.56, 0.47);
  deer.add(bell);

  // Hoofdgroep (afgerond hoofd, zachte snuit, oogjes, wangetjes, oortjes & vertakt gewei)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.96, 0.48);
  deer.add(headGroup);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.21, 16, 14), furMat);
  cranium.scale.set(0.94, 0.95, 1.08);
  headGroup.add(cranium);

  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.145, 14, 12), muzzleMat);
  snout.scale.set(1.02, 0.84, 1.24);
  snout.position.set(0, -0.05, 0.20);
  headGroup.add(snout);

  // Oogjes & roze wangetjes
  [-0.115, 0.115].forEach((ex) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 10), santaEyeMat);
    eye.position.set(ex, 0.05, 0.165);
    headGroup.add(eye);

    const shine = new THREE.Mesh(
      new THREE.SphereGeometry(0.013, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    shine.position.set(ex + (ex > 0 ? 0.01 : -0.01), 0.065, 0.195);
    headGroup.add(shine);

    const blush = new THREE.Mesh(
      new THREE.SphereGeometry(0.044, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xff85a2 })
    );
    blush.scale.set(1.1, 0.7, 0.5);
    blush.position.set(ex * 1.25, -0.035, 0.14);
    headGroup.add(blush);
  });

  // Zachte bladvormige oortjes
  [-1, 1].forEach((side) => {
    const earGroup = new THREE.Group();
    earGroup.position.set(side * 0.16, 0.11, -0.03);
    earGroup.rotation.z = -side * 0.78;
    earGroup.rotation.x = -0.25;
    headGroup.add(earGroup);

    const earOuter = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 10), furMat);
    earOuter.scale.set(0.52, 1.25, 0.42);
    earOuter.position.y = 0.07;
    earGroup.add(earOuter);

    const earInner = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 8), innerEarMat);
    earInner.scale.set(0.45, 1.1, 0.35);
    earInner.position.set(0, 0.07, 0.02);
    earGroup.add(earInner);

    // Sierlijk vertakt gewei (TubeGeometry langs vloeiende curves)
    const mainAntlerCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.07, 0.16, -0.02),
      new THREE.Vector3(side * 0.14, 0.30, -0.04),
      new THREE.Vector3(side * 0.22, 0.44, -0.02),
      new THREE.Vector3(side * 0.25, 0.56, 0.06)
    ]);
    headGroup.add(
      new THREE.Mesh(new THREE.TubeGeometry(mainAntlerCurve, 14, 0.024, 8, false), antlerMat)
    );

    const frontTine = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.14, 0.30, -0.04),
      new THREE.Vector3(side * 0.16, 0.38, 0.09),
      new THREE.Vector3(side * 0.14, 0.46, 0.16)
    ]);
    headGroup.add(
      new THREE.Mesh(new THREE.TubeGeometry(frontTine, 8, 0.017, 6, false), antlerMat)
    );

    const backTine = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.20, 0.40, -0.03),
      new THREE.Vector3(side * 0.29, 0.47, -0.08),
      new THREE.Vector3(side * 0.32, 0.54, -0.05)
    ]);
    headGroup.add(
      new THREE.Mesh(new THREE.TubeGeometry(backTine, 8, 0.016, 6, false), antlerMat)
    );

    // Afgeronde puntjes op de geweien
    [
      [side * 0.25, 0.56, 0.06, 0.024],
      [side * 0.14, 0.46, 0.16, 0.017],
      [side * 0.32, 0.54, -0.05, 0.016]
    ].forEach(([tx, ty, tz, tr]) => {
      const tip = new THREE.Mesh(new THREE.SphereGeometry(tr, 8, 8), antlerMat);
      tip.position.set(tx, ty, tz);
      headGroup.add(tip);
    });
  });

  // Gloeiende pastel-roze/rode neus voor het voorste rendier (Rudolph!)
  const noseMat = new THREE.MeshStandardMaterial({
    color: hasGlowingNose ? 0xff5c8a : 0x4a2c2a,
    emissive: hasGlowingNose ? 0xff5c8a : 0x000000,
    emissiveIntensity: hasGlowingNose ? 1.5 : 0,
    roughness: 0.25
  });
  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(hasGlowingNose ? 0.088 : 0.065, 12, 12),
    noseMat
  );
  nose.position.set(0, -0.015, 0.37);
  headGroup.add(nose);

  // 4 scharnierende pootjes met knietjes en hoefjes voor galop-animatie
  const legs = [];
  const legSpecs = [
    { x: -0.15, z: 0.27, isFront: true },
    { x: 0.15, z: 0.27, isFront: true },
    { x: -0.15, z: -0.26, isFront: false },
    { x: 0.15, z: -0.26, isFront: false }
  ];
  legSpecs.forEach((ls) => {
    const legPivot = new THREE.Group();
    legPivot.position.set(ls.x, 0.42, ls.z);
    deer.add(legPivot);

    const upperLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.066, 0.05, 0.22, 10),
      furMat
    );
    upperLeg.position.y = -0.11;
    legPivot.add(upperLeg);

    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 8), furMat);
    knee.position.y = -0.22;
    legPivot.add(knee);

    const lowerLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.046, 0.038, 0.21, 10),
      furMat
    );
    lowerLeg.position.y = -0.32;
    legPivot.add(lowerLeg);

    const hoof = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.052, 0.07, 10),
      hoofMat
    );
    hoof.position.y = -0.44;
    legPivot.add(hoof);

    legs.push({ pivot: legPivot, isFront: ls.isFront, side: ls.x < 0 ? 0 : 0.5 });
  });

  deer.userData = {
    baseY,
    baseRotY,
    phase: offsetZ * 0.9 + Math.abs(offsetX),
    legs,
    headGroup,
    noseMat: hasGlowingNose ? noseMat : null
  };
  if (addToFlyingTeam) {
    reindeerList.push(deer);
  }
  return deer;
}

createReindeer(-0.62, 2.55, false, 0.96); // Achterste rendier links
createReindeer(0.62, 2.55, false, 0.96);  // Achterste rendier rechts
createReindeer(0, 4.35, true, 1.06);      // Voorste rendier (Rudolph!) met gloeiende neus

// Vloeiende gouden teugels (TubeGeometry) van Kerstman's handen naar alle rendieren
const reinTargets = [
  [-0.15, 1.10, 0.24, -0.62, 0.88, 2.84],
  [0.15, 1.10, 0.24, 0.62, 0.88, 2.84],
  [-0.62, 0.88, 2.84, -0.14, 0.92, 4.65],
  [0.62, 0.88, 2.84, 0.14, 0.92, 4.65]
];
reinTargets.forEach(([sx, sy, sz, ex, ey, ez]) => {
  const midX = (sx + ex) * 0.5;
  const midY = Math.min(sy, ey) - 0.12;
  const midZ = (sz + ez) * 0.5;
  const reinCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(sx, sy, sz),
    new THREE.Vector3(midX, midY, midZ),
    new THREE.Vector3(ex, ey, ez)
  ]);
  const reinMesh = new THREE.Mesh(
    new THREE.TubeGeometry(reinCurve, 14, 0.016, 6, false),
    sleighGoldMat
  );
  sleighAndTeam.add(reinMesh);
});

// --- 8A-bis. Knusse Rendierenstalling (op een vrij plekje links van het bos) ---
// Geplaatst op (-14.9, 0, -2.8) tussen de twee westelijke sneeuwheuvels en ruim
// vrij van de kerstbomen, paden, gebouwen en de Noordpool Express spoorbaan.
const stableReindeerList = [];

function createReindeerStable() {
  const stableGroup = new THREE.Group();
  stableGroup.position.set(-14.9, 0, -2.8);
  stableGroup.rotation.y = 0.60;
  scene.add(stableGroup);

  const stableWallMat = new THREE.MeshStandardMaterial({ color: 0xffe5d9, roughness: 0.72 });
  const stableTrimMat = new THREE.MeshStandardMaterial({ color: PASTEL.doorMint, roughness: 0.58 });
  const stableRoofMat = new THREE.MeshStandardMaterial({ color: 0xffb5a7, roughness: 0.62 });
  const stableFloorMat = new THREE.MeshStandardMaterial({ color: 0xd9a88f, roughness: 0.82 });
  const hayMat = new THREE.MeshStandardMaterial({ color: 0xf7d788, roughness: 0.9 });
  const hayBandMat = new THREE.MeshStandardMaterial({ color: PASTEL.poleRed, roughness: 0.5 });
  const carrotMat = new THREE.MeshStandardMaterial({ color: 0xff9f68, roughness: 0.55 });
  const carrotLeafMat = new THREE.MeshStandardMaterial({ color: PASTEL.treeMint1, roughness: 0.6 });
  const bucketMat = new THREE.MeshStandardMaterial({ color: PASTEL.wallBlue, roughness: 0.45 });
  const waterBucketMat = new THREE.MeshStandardMaterial({
    color: 0xb8ecff,
    roughness: 0.15,
    metalness: 0.1
  });
  const stableWinMat = new THREE.MeshStandardMaterial({
    color: PASTEL.windowGlow,
    emissive: 0xffd166,
    emissiveIntensity: 0.9,
    roughness: 0.2
  });

  // 1. Besneeuwde stenen onderplint & warme houten stalvloer
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.16, 2.65), stonePlinthMat);
  plinth.position.set(0, 0.08, -0.08);
  plinth.receiveShadow = true;
  plinth.castShadow = true;
  stableGroup.add(plinth);

  const floor = new THREE.Mesh(new THREE.BoxGeometry(3.65, 0.04, 2.38), stableFloorMat);
  floor.position.set(0, 0.18, -0.08);
  floor.receiveShadow = true;
  stableGroup.add(floor);

  // 2. Achtermuur, zijmuren met raampjes & midden-tussenschot voor 2 boxen
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.65, 0.14), stableWallMat);
  backWall.position.set(0, 1.025, -1.20);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  stableGroup.add(backWall);

  [-1.75, 1.75].forEach((wx) => {
    const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.65, 2.32), stableWallMat);
    sideWall.position.set(wx, 1.025, -0.08);
    sideWall.castShadow = true;
    sideWall.receiveShadow = true;
    stableGroup.add(sideWall);

    // Gezellig gloeiend zijraampje met houten kruisje
    const sideSign = wx < 0 ? -1 : 1;
    const winPane = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.46, 0.56), stableWinMat);
    winPane.position.set(wx + sideSign * 0.06, 1.12, -0.10);
    stableGroup.add(winPane);

    const winBarH = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.58), woodMat);
    winBarH.position.set(wx + sideSign * 0.065, 1.12, -0.10);
    stableGroup.add(winBarH);

    const winBarV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.48, 0.05), woodMat);
    winBarV.position.set(wx + sideSign * 0.065, 1.12, -0.10);
    stableGroup.add(winBarV);
  });

  // Stevige houten hoek- en middenpalen
  [
    [-1.76, -1.20], [0, -1.20], [1.76, -1.20],
    [-1.76,  1.04], [0,  1.04], [1.76,  1.04]
  ].forEach(([px, pz]) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 1.70, 10), woodMat);
    post.position.set(px, 1.05, pz);
    post.castShadow = true;
    stableGroup.add(post);
  });

  // Bovenbalken langs de voor- en achterkant
  [-1.20, 1.04].forEach((bz) => {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(3.68, 0.14, 0.14), woodMat);
    beam.position.set(0, 1.84, bz);
    beam.castShadow = true;
    stableGroup.add(beam);
  });

  // Houten tussenschot tussen de linker en rechter rendierbox
  const divider = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.96, 1.85), woodMat);
  divider.position.set(0, 0.68, -0.16);
  divider.castShadow = true;
  divider.receiveShadow = true;
  stableGroup.add(divider);

  // Halfhoge staldeurtjes (gezellig op een kier zodat de rendieren vrij staan)
  [
    { x: -1.68, rotY: -0.45, dir: 1 },
    { x:  1.68, rotY:  0.55, dir: -1 }
  ].forEach((g) => {
    const gatePivot = new THREE.Group();
    gatePivot.position.set(g.x, 0.20, 1.04);
    gatePivot.rotation.y = g.rotY;
    stableGroup.add(gatePivot);

    const gatePanel = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.68, 0.07), stableTrimMat);
    gatePanel.position.set(g.dir * 0.38, 0.38, 0);
    gatePanel.castShadow = true;
    gatePivot.add(gatePanel);

    const gateRail = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.08, 0.09), woodMat);
    gateRail.position.set(g.dir * 0.38, 0.72, 0);
    gatePivot.add(gateRail);
  });

  // 3. Driehoekige gevels & besneeuwd zadeldak
  const gableShape = new THREE.Shape();
  gableShape.moveTo(-1.82, 0);
  gableShape.lineTo(1.82, 0);
  gableShape.lineTo(0, 0.98);
  gableShape.closePath();

  const gableGeo = new THREE.ExtrudeGeometry(gableShape, {
    depth: 0.12,
    bevelEnabled: false
  });
  [-1.26, 0.98].forEach((gz) => {
    const gable = new THREE.Mesh(gableGeo, stableWallMat);
    gable.position.set(0, 1.85, gz);
    gable.castShadow = true;
    stableGroup.add(gable);
  });

  // Rond hooizolder-raampje in de voorgevel met gouden rand
  const loftFrame = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.04, 10, 20),
    goldTrimMat
  );
  loftFrame.position.set(0, 2.26, 1.11);
  stableGroup.add(loftFrame);

  const loftWindow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.06, 18),
    stableWinMat
  );
  loftWindow.rotation.x = Math.PI / 2;
  loftWindow.position.set(0, 2.26, 1.08);
  stableGroup.add(loftWindow);

  // Zadeldak (twee schuine dakpanelen + dikke sneeuwlaag erbovenop)
  const roofAngle = Math.atan2(0.98, 1.82);
  const slopeWidth = Math.hypot(1.82, 0.98) + 0.34;
  [-1, 1].forEach((side) => {
    const slopePivot = new THREE.Group();
    slopePivot.position.set(0, 2.86, -0.08);
    slopePivot.rotation.z = -side * roofAngle;
    stableGroup.add(slopePivot);

    const roofBoard = new THREE.Mesh(
      new THREE.BoxGeometry(slopeWidth, 0.10, 2.74),
      stableRoofMat
    );
    roofBoard.position.set(side * (slopeWidth / 2 - 0.04), -0.03, 0);
    roofBoard.castShadow = true;
    roofBoard.receiveShadow = true;
    slopePivot.add(roofBoard);

    const snowCap = new THREE.Mesh(
      new THREE.BoxGeometry(slopeWidth + 0.06, 0.11, 2.82),
      roofSnowMat
    );
    snowCap.position.set(side * (slopeWidth / 2 - 0.04), 0.065, 0);
    snowCap.castShadow = true;
    snowCap.receiveShadow = true;
    slopePivot.add(snowCap);
  });

  // Nokbalk + gouden ster-ornament op de voorkant van de nok
  const ridgeCap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.86, 10), roofSnowMat);
  ridgeCap.rotation.x = Math.PI / 2;
  ridgeCap.position.set(0, 2.94, -0.08);
  stableGroup.add(ridgeCap);

  const ridgeStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.15, 0), goldTrimMat);
  ridgeStar.position.set(0, 2.98, 1.32);
  ridgeStar.rotation.y = Math.PI / 4;
  stableGroup.add(ridgeStar);

  // Naambordje "Rendieren Stal" onder het hooizolder-raampje
  const stableSignTex = createSignTexture(
    'Rendieren Stal',
    '🥕 Knus & Warm ✨',
    '#fff8f2',
    '#9ef0c8',
    '#4a2545',
    { width: 420, height: 160 }
  );
  const stableSign = new THREE.Mesh(
    new THREE.BoxGeometry(1.42, 0.52, 0.09),
    new THREE.MeshStandardMaterial({ map: stableSignTex, roughness: 0.45 })
  );
  stableSign.position.set(0, 1.82, 1.15);
  stableSign.castShadow = true;
  stableGroup.add(stableSign);

  // Sneeuwdruppels + knipperende regenbooglampjes langs de voorste dakrand
  const bulbGeo = new THREE.SphereGeometry(0.07, 10, 10);
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const bx = -1.92 + t * 3.84;
    const by = 2.80 - Math.abs(bx) * (0.98 / 1.82);

    const snowDrop = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), roofSnowMat);
    snowDrop.position.set(bx, by, 1.30);
    stableGroup.add(snowDrop);

    const colorHex = PASTEL.rainbowHex[i % PASTEL.rainbowHex.length];
    const bulbMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.95,
      roughness: 0.2
    });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(bx, by - 0.08, 1.32);
    stableGroup.add(bulb);

    allRainbowLights.push({
      mesh: bulb,
      material: bulbMat,
      phase: i * 0.48 + 1.4,
      treeIndex: -1,
      elfHouseIndex: -1,
      isStableBulb: true
    });
  }

  // Warm stal-lichtje binnenin voor een knusse nachtelijke gloed
  const stableLight = new THREE.PointLight(0xffd6a5, 0.52, 8);
  stableLight.position.set(0, 1.48, 0.35);
  stableGroup.add(stableLight);

  // 4. Strobedjes, hooibalen, wortel-voerbak & wateremmer
  [-0.92, 0.92].forEach((sx) => {
    const strawBed = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.68, 0.07, 14), hayMat);
    strawBed.scale.set(1.0, 1.0, 1.15);
    strawBed.position.set(sx, 0.22, -0.25);
    strawBed.receiveShadow = true;
    stableGroup.add(strawBed);
  });

  // Gestapelde hooibalen linksachterin in de stal
  [
    { x: -1.32, y: 0.36, z: -0.82, ry: 0.12 },
    { x: -0.92, y: 0.36, z: -0.88, ry: -0.08 },
    { x: -1.12, y: 0.66, z: -0.85, ry: 0.04 }
  ].forEach((b) => {
    const bale = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.48), hayMat);
    bale.position.set(b.x, b.y, b.z);
    bale.rotation.y = b.ry;
    bale.castShadow = true;
    bale.receiveShadow = true;
    stableGroup.add(bale);

    const band = new THREE.Mesh(new THREE.BoxGeometry(0.39, 0.29, 0.05), hayBandMat);
    band.position.set(b.x, b.y, b.z);
    band.rotation.y = b.ry;
    stableGroup.add(band);
  });

  // Houten voerbak gevuld met knapperige worteltjes in de linker box
  const troughGroup = new THREE.Group();
  troughGroup.position.set(-0.92, 0.20, 0.54);
  troughGroup.rotation.y = 0.18;
  stableGroup.add(troughGroup);

  const troughBody = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.24, 0.34), woodMat);
  troughBody.position.y = 0.14;
  troughBody.castShadow = true;
  troughGroup.add(troughBody);

  const troughHay = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.10, 0.26), hayMat);
  troughHay.position.y = 0.25;
  troughGroup.add(troughHay);

  for (let c = 0; c < 4; c++) {
    const carrot = new THREE.Group();
    carrot.position.set(-0.21 + c * 0.14, 0.31, (c % 2 === 0 ? 0.04 : -0.04));
    carrot.rotation.z = 1.25 + (c % 2) * 0.35;
    carrot.rotation.y = c * 0.6;
    troughGroup.add(carrot);

    const cRoot = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.20, 8), carrotMat);
    carrot.add(cRoot);

    const cTop = new THREE.Mesh(new THREE.SphereGeometry(0.036, 6, 6), carrotLeafMat);
    cTop.position.y = -0.10;
    carrot.add(cTop);
  }

  // Pastelblauwe wateremmer bij de rechter box
  const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.26, 14), bucketMat);
  bucket.position.set(1.36, 0.33, -0.78);
  bucket.castShadow = true;
  stableGroup.add(bucket);

  const bucketWater = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.02, 12), waterBucketMat);
  bucketWater.position.set(1.36, 0.44, -0.78);
  stableGroup.add(bucketWater);

  // 5. Gezellig voorerf-hekje met sneeuwkapjes en twee minilantaarntjes
  const fencePostGeo = new THREE.CylinderGeometry(0.055, 0.065, 0.56, 8);
  const fenceCapGeo = new THREE.SphereGeometry(0.07, 8, 8);
  const fencePosts = [
    [-1.82, 1.45], [-1.82, 1.92], [-1.25, 1.92], [-0.68, 1.92],
    [ 0.68, 1.92], [ 1.25, 1.92], [ 1.82, 1.92], [ 1.82, 1.45]
  ];
  fencePosts.forEach(([fx, fz]) => {
    const fPost = new THREE.Mesh(fencePostGeo, woodMat);
    fPost.position.set(fx, 0.28, fz);
    fPost.castShadow = true;
    stableGroup.add(fPost);

    const fCap = new THREE.Mesh(fenceCapGeo, roofSnowMat);
    fCap.position.set(fx, 0.58, fz);
    stableGroup.add(fCap);
  });

  // Horizontale heklatten (links, rechts & voorkant met open doorgang in het midden)
  [0.24, 0.44].forEach((ry) => {
    [-1.82, 1.82].forEach((sideX) => {
      const sideRail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.07, 0.92), stableWallMat);
      sideRail.position.set(sideX, ry, 1.50);
      sideRail.castShadow = true;
      stableGroup.add(sideRail);
    });
    [-1.25, 1.25].forEach((frontX) => {
      const frontRail = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.07, 0.06), stableWallMat);
      frontRail.position.set(frontX, ry, 1.92);
      frontRail.castShadow = true;
      stableGroup.add(frontRail);
    });
  });

  // Twee kleine toegangslantaarntjes op de binnenste hekpalen
  [-0.68, 0.68].forEach((lx) => {
    const postLantern = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), stableWinMat);
    postLantern.position.set(lx, 0.68, 1.92);
    stableGroup.add(postLantern);
  });

  // 6. Twee schattige rendieren die uitrusten & worteltjes eten in de stalling!
  const stableDeer1 = createReindeer(-0.90, -0.18, false, 0.88, {
    parentGroup: stableGroup,
    addToFlyingTeam: false,
    baseY: 0.20 + 0.055 * 0.88,
    rotY: 0.15,
    collarColor: PASTEL.doorMint
  });
  stableDeer1.userData.mode = 'snack';
  stableDeer1.userData.phase = 0.0;
  stableReindeerList.push(stableDeer1);

  const stableDeer2 = createReindeer(0.84, 0.38, false, 0.80, {
    parentGroup: stableGroup,
    addToFlyingTeam: false,
    baseY: 0.20 + 0.055 * 0.80,
    rotY: -0.32,
    collarColor: PASTEL.wallLavender
  });
  stableDeer2.userData.mode = 'look';
  stableDeer2.userData.phase = 2.1;
  stableReindeerList.push(stableDeer2);

  stableGroup.userData = {
    interactive: true,
    type: 'rendierenstal',
    boostTimer: 0
  };
  clickableObjects.push(stableGroup);
  return stableGroup;
}

const reindeerStableGroup = createReindeerStable();


// --- 8B. Pastel Noorderlicht (Aurora Borealis) in de hemel ---
// Drie gebogen lichtgordijnen hoog in de noordelijke hemelboog zodat het
// Noorderlicht direct boven het Noordpool-dorp straalt én mooi meebuigt
// als je met de muis rondkijkt.
const auroraRibbons = [];

const auroraVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const auroraFragmentShader = `
  uniform float uTime;
  uniform float uSeed;
  uniform float uOpacity;
  uniform vec3 uColorBottom;
  uniform vec3 uColorMid;
  uniform vec3 uColorTop;
  varying vec2 vUv;

  void main() {
    // Zachte fade aan linker- en rechteruiteinden (geen harde rechthoekige randen)
    float edgeFadeX = smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.84, vUv.x);

    // Verticaal gordijnprofiel: heldere onderboog die zachtjes naar boven uitwaaiert
    float bottomFade = smoothstep(0.0, 0.18, vUv.y);
    float topFade = pow(1.0 - vUv.y, 1.45);
    float verticalProfile = bottomFade * topFade;

    // Dansende verticale lichtstralen (gordijnplooien) over het noorderlicht
    float x = vUv.x * 16.0;
    float ray1 = sin(x * 1.3 + uTime * 0.65 + uSeed) * 0.5 + 0.5;
    float ray2 = sin(x * 2.9 - uTime * 0.95 + uSeed * 2.1 + sin(x * 0.7 + uTime * 0.3)) * 0.5 + 0.5;
    float ray3 = sin(x * 5.4 + uTime * 1.35 + uSeed * 3.7) * 0.5 + 0.5;
    float rays = 0.38 + 0.62 * (ray1 * 0.45 + ray2 * 0.35 + ray3 * 0.20);

    // Subtiele verticale schittering langs de lichtstralen
    float shimmer = 0.85 + 0.15 * sin(vUv.y * 8.0 - uTime * 1.8 + x * 0.8 + uSeed);

    // Pastel kleurverloop van onder naar boven (mint/cyaan -> lavendel -> roze)
    vec3 col = mix(uColorBottom, uColorMid, smoothstep(0.08, 0.52, vUv.y));
    col = mix(col, uColorTop, smoothstep(0.45, 0.92, vUv.y));

    // Extra zachte gloed langs de onderste lichtboog
    float lowerGlow = smoothstep(0.28, 0.08, vUv.y) * smoothstep(0.0, 0.12, vUv.y);
    col += uColorBottom * lowerGlow * 0.35;

    float alpha = edgeFadeX * verticalProfile * rays * shimmer * uOpacity;
    gl_FragColor = vec4(col, alpha);
  }
`;

const auroraConfigs = [
  {
    radius: 33,
    baseY: 12.2,
    height: 11.0,
    arcSpan: 2.25,
    centerAngle: -Math.PI / 2,
    waveSeed: 0.4,
    speed: 0.95,
    opacity: 0.62,
    colorBottom: new THREE.Color(0x72f7d4), // Pastel aurora-mint
    colorMid: new THREE.Color(0x9bf6ff),    // Pastel cyaan
    colorTop: new THREE.Color(0xffafcc)     // Pastel roze
  },
  {
    radius: 38,
    baseY: 13.4,
    height: 12.0,
    arcSpan: 2.55,
    centerAngle: -Math.PI / 2 + 0.12,
    waveSeed: 2.1,
    speed: 1.15,
    opacity: 0.52,
    colorBottom: new THREE.Color(0x9bf6ff), // Pastel cyaan
    colorMid: new THREE.Color(0xcdb4db),    // Pastel lavendel
    colorTop: new THREE.Color(0xffafcc)     // Pastel roze
  },
  {
    radius: 43,
    baseY: 14.5,
    height: 13.0,
    arcSpan: 2.9,
    centerAngle: -Math.PI / 2 - 0.1,
    waveSeed: 4.3,
    speed: 0.8,
    opacity: 0.42,
    colorBottom: new THREE.Color(0xa8f0c6), // Pastel mintgroen
    colorMid: new THREE.Color(0xa3d8ff),    // Pastel hemelsblauw
    colorTop: new THREE.Color(0xd8bfff)     // Pastel lila
  }
];

auroraConfigs.forEach((cfg, idx) => {
  const geo = new THREE.PlaneGeometry(2, cfg.height, 80, 8);
  const posAttr = geo.attributes.position;
  const radialNormals = new Float32Array(posAttr.count * 2);
  const vertexPhases = new Float32Array(posAttr.count);

  // Buig het vlak tot een sierlijke S-boog hoog in de lucht
  for (let i = 0; i < posAttr.count; i++) {
    const t = posAttr.getX(i); // Van -1 tot +1
    const localY = posAttr.getY(i);
    const angle = cfg.centerAngle + t * (cfg.arcSpan * 0.5);
    const r = cfg.radius + Math.sin(t * Math.PI * 1.4 + cfg.waveSeed) * 3.2;

    const vx = Math.cos(angle) * r;
    const vz = Math.sin(angle) * r;
    const vy = cfg.baseY + localY + Math.sin(t * Math.PI * 1.1 + cfg.waveSeed * 0.7) * 1.25;

    posAttr.setXYZ(i, vx, vy, vz);
    radialNormals[i * 2] = Math.cos(angle);
    radialNormals[i * 2 + 1] = Math.sin(angle);
    vertexPhases[i] = t;
  }
  geo.computeBoundingSphere();

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSeed: { value: idx * 2.35 },
      uOpacity: { value: cfg.opacity },
      uColorBottom: { value: cfg.colorBottom },
      uColorMid: { value: cfg.colorMid },
      uColorTop: { value: cfg.colorTop }
    },
    vertexShader: auroraVertexShader,
    fragmentShader: auroraFragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false
  });

  const ribbon = new THREE.Mesh(geo, mat);
  ribbon.renderOrder = 2;
  scene.add(ribbon);

  auroraRibbons.push({
    mesh: ribbon,
    geometry: geo,
    material: mat,
    basePositions: posAttr.array.slice(),
    radialNormals,
    vertexPhases,
    speed: cfg.speed,
    offset: idx * 2.0
  });
});


// --- 8C. Zachte Rookpluimpjes uit de Schoorsteen ---
const smokePuffs = [];
const smokeGeo = new THREE.SphereGeometry(0.32, 12, 12);

for (let i = 0; i < 7; i++) {
  const smokeMat = new THREE.MeshBasicMaterial({
    color: 0xffeef8,
    transparent: true,
    opacity: 0.7
  });
  const puff = new THREE.Mesh(smokeGeo, smokeMat);
  scene.add(puff);
  smokePuffs.push({
    mesh: puff,
    material: smokeMat,
    progress: i / 7 // Verdeeld tussen 0 en 1 zodat ze continu achter elkaar opstijgen
  });
}


// --- 8D. Het Noordpool Express Treintje dat rond het eiland rijdt ---
const trainSystemGroup = new THREE.Group();
scene.add(trainSystemGroup);

// 1. Gesloten spoor-curve rondom de buitenring van het eiland (r = 19.55)
const TRACK_CONTROL_COUNT = 48;
const trackControlPoints = [];
for (let i = 0; i < TRACK_CONTROL_COUNT; i++) {
  const angle = (i / TRACK_CONTROL_COUNT) * Math.PI * 2;
  const r = 19.55;
  trackControlPoints.push(new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r));
}
const trainTrackCurve = new THREE.CatmullRomCurve3(trackControlPoints, true, 'catmullrom', 0.5);
trainTrackCurve.arcLengthDivisions = 1000;
const TRAIN_TRACK_LENGTH = trainTrackCurve.getLength();

// 2. Pastel grindbed / spoorbedding langs de gesloten curve (BufferGeometry lint)
(function buildTrackBallastBed() {
  const segs = 200;
  const halfInner = 0.62;
  const halfOuter = 0.82;
  const topY = 0.045;
  const baseY = 0.005;

  const positions = [];
  const indices = [];

  for (let i = 0; i <= segs; i++) {
    const u = (i % segs) / segs;
    const pt = trainTrackCurve.getPointAt(u);
    const tan = trainTrackCurve.getTangentAt(u).normalize();
    const perpX = -tan.z;
    const perpZ = tan.x;

    // 4 profielpunten per dwarsdoorsnede: links-onder, links-boven, rechts-boven, rechts-onder
    positions.push(
      pt.x + perpX * halfOuter, baseY, pt.z + perpZ * halfOuter,
      pt.x + perpX * halfInner, topY,  pt.z + perpZ * halfInner,
      pt.x - perpX * halfInner, topY,  pt.z - perpZ * halfInner,
      pt.x - perpX * halfOuter, baseY, pt.z - perpZ * halfOuter
    );
  }

  for (let i = 0; i < segs; i++) {
    const row = i * 4;
    const next = (i + 1) * 4;
    for (let k = 0; k < 3; k++) {
      const a = row + k;
      const b = row + k + 1;
      const c = next + k;
      const d = next + k + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const bedGeo = new THREE.BufferGeometry();
  bedGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  bedGeo.setIndex(indices);
  bedGeo.computeVertexNormals();

  const bedMat = new THREE.MeshStandardMaterial({
    color: 0xc2b6dc,
    roughness: 0.9,
    metalness: 0.02
  });
  const bedMesh = new THREE.Mesh(bedGeo, bedMat);
  bedMesh.receiveShadow = true;
  trainSystemGroup.add(bedMesh);
})();

// 3. Houten dwarsliggers langs het hele spoor (gedeelde geometry voor 60 FPS)
const SLEEPER_COUNT = 136;
const sleeperGeo = new THREE.BoxGeometry(1.18, 0.055, 0.16);
for (let i = 0; i < SLEEPER_COUNT; i++) {
  const u = i / SLEEPER_COUNT;
  const pt = trainTrackCurve.getPointAt(u);
  const tan = trainTrackCurve.getTangentAt(u).normalize();

  const sleeper = new THREE.Mesh(sleeperGeo, woodMat);
  sleeper.position.set(pt.x, 0.068, pt.z);
  sleeper.rotation.y = Math.atan2(tan.x, tan.z);
  sleeper.castShadow = true;
  sleeper.receiveShadow = true;
  trainSystemGroup.add(sleeper);
}

// 4. Twee doorlopende zilver-pastel rails (linker & rechter spoorstaaf)
const railMat = new THREE.MeshStandardMaterial({
  color: 0xeae4f7,
  roughness: 0.28,
  metalness: 0.62
});
const RAIL_HALF_GAUGE = 0.40;
[-1, 1].forEach((side) => {
  const railPoints = [];
  const railSampleCount = 220;
  for (let i = 0; i < railSampleCount; i++) {
    const u = i / railSampleCount;
    const pt = trainTrackCurve.getPointAt(u);
    const tan = trainTrackCurve.getTangentAt(u).normalize();
    const perpX = -tan.z;
    const perpZ = tan.x;
    railPoints.push(
      new THREE.Vector3(
        pt.x + perpX * side * RAIL_HALF_GAUGE,
        0.118,
        pt.z + perpZ * side * RAIL_HALF_GAUGE
      )
    );
  }
  const railCurve = new THREE.CatmullRomCurve3(railPoints, true, 'catmullrom', 0.5);
  const railGeo = new THREE.TubeGeometry(railCurve, 240, 0.042, 8, true);
  const railMesh = new THREE.Mesh(railGeo, railMat);
  railMesh.castShadow = true;
  railMesh.receiveShadow = true;
  trainSystemGroup.add(railMesh);
});

// 5. Schattig mini "Halte Noordpool" stationnetje links-vooraan naast het spoor
const trainStationGroup = new THREE.Group();
trainStationGroup.position.set(-7.1, 0, 15.8);
trainStationGroup.rotation.y = -0.42;
trainSystemGroup.add(trainStationGroup);

const stationPlatform = new THREE.Mesh(
  new THREE.BoxGeometry(2.7, 0.22, 1.35),
  stonePlinthMat
);
stationPlatform.position.y = 0.11;
stationPlatform.castShadow = true;
stationPlatform.receiveShadow = true;
trainStationGroup.add(stationPlatform);

const stationDeck = new THREE.Mesh(
  new THREE.BoxGeometry(2.52, 0.06, 1.18),
  woodMat
);
stationDeck.position.y = 0.24;
stationDeck.receiveShadow = true;
trainStationGroup.add(stationDeck);

// Zuurstok-paaltjes voor het afdakje van het perron
[-0.95, 0.95].forEach((px) => {
  for (let s = 0; s < 5; s++) {
    const seg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.28, 12),
      s % 2 === 0 ? candyRedMat : candyWhiteMat
    );
    seg.position.set(px, 0.41 + s * 0.28, -0.25);
    seg.castShadow = true;
    trainStationGroup.add(seg);
  }
});

const stationRoof = new THREE.Mesh(
  new THREE.BoxGeometry(2.55, 0.14, 1.25),
  new THREE.MeshStandardMaterial({ color: PASTEL.wallBlue, roughness: 0.55 })
);
stationRoof.position.set(0, 1.72, -0.08);
stationRoof.rotation.x = 0.14;
stationRoof.castShadow = true;
trainStationGroup.add(stationRoof);

const stationRoofSnow = new THREE.Mesh(
  new THREE.BoxGeometry(2.65, 0.12, 1.35),
  roofSnowMat
);
stationRoofSnow.position.set(0, 1.82, -0.09);
stationRoofSnow.rotation.x = 0.14;
trainStationGroup.add(stationRoofSnow);

const stationSignTex = createSignTexture(
  'Noordpool Express',
  '🚂 Halte Centrum ✨',
  '#fff0f6',
  '#ffb3c6',
  '#4a2545'
);
const stationSign = new THREE.Mesh(
  new THREE.BoxGeometry(1.75, 0.55, 0.08),
  new THREE.MeshStandardMaterial({ map: stationSignTex, roughness: 0.45 })
);
stationSign.position.set(0, 1.48, 0.52);
trainStationGroup.add(stationSign);

// Klein perronlantaarntje & wachtbankje
const stBench = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.18, 0.36), woodMat);
stBench.position.set(-0.2, 0.42, -0.05);
trainStationGroup.add(stBench);

const stLanternPost = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 1.05, 8), woodMat);
stLanternPost.position.set(1.12, 0.76, 0.38);
trainStationGroup.add(stLanternPost);

const stLanternBulb = new THREE.Mesh(
  new THREE.SphereGeometry(0.11, 10, 10),
  new THREE.MeshStandardMaterial({
    color: PASTEL.windowGlow,
    emissive: 0xffd166,
    emissiveIntensity: 1.15,
    roughness: 0.2
  })
);
stLanternBulb.position.set(1.12, 1.32, 0.38);
trainStationGroup.add(stLanternBulb);

trainStationGroup.userData = {
  interactive: true,
  type: 'station'
};
clickableObjects.push(trainStationGroup);

// 6. Het Treintje zelf: 1 Locomotief + 2 schattige Wagonnetjes!
const trainWheelRadius = 0.15;
const trainWheelGeo = new THREE.CylinderGeometry(trainWheelRadius, trainWheelRadius, 0.075, 18);
const trainFlangeGeo = new THREE.CylinderGeometry(trainWheelRadius + 0.028, trainWheelRadius + 0.028, 0.022, 18);
const trainHubGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.095, 12);
const trainAxleGeo = new THREE.CylinderGeometry(0.032, 0.032, RAIL_HALF_GAUGE * 2 + 0.06, 10);
const trainAxleBoxGeo = new THREE.BoxGeometry(0.075, 0.10, 0.11);
const trainBufferGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.08, 10);
const trainChassisMat = new THREE.MeshStandardMaterial({ color: 0x5c4b7d, roughness: 0.65 });
const trainWheelMat = new THREE.MeshStandardMaterial({ color: PASTEL.goldSoft, roughness: 0.32, metalness: 0.28 });
const trainHubMat = new THREE.MeshStandardMaterial({ color: PASTEL.poleRed, roughness: 0.4 });
const trainWindowMat = new THREE.MeshStandardMaterial({
  color: PASTEL.windowGlow,
  emissive: 0xffd166,
  emissiveIntensity: 1.05,
  roughness: 0.2
});

const trainWheels = [];
const trainSideRods = [];

/**
 * Voegt stevige assen en volledig zichtbare wieltjes met flens toe op x = ±RAIL_HALF_GAUGE,
 * zodat ze stevig om de rails grijpen in plaats van onder het chassis te verdwijnen.
 */
function addCarriageWheels(parentGroup, zOffsets, addCrankPin = false) {
  zOffsets.forEach((wz) => {
    const axle = new THREE.Mesh(trainAxleGeo, trainChassisMat);
    axle.rotation.z = Math.PI / 2;
    axle.position.set(0, trainWheelRadius, wz);
    parentGroup.add(axle);

    [-1, 1].forEach((side) => {
      const wx = side * RAIL_HALF_GAUGE;
      const wheelPivot = new THREE.Group();
      wheelPivot.position.set(wx, trainWheelRadius, wz);

      const tire = new THREE.Mesh(trainWheelGeo, trainWheelMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelPivot.add(tire);

      // Binnenflens die zichtbaar langs de binnenkant van de spoorstaaf loopt
      const flange = new THREE.Mesh(trainFlangeGeo, trainChassisMat);
      flange.rotation.z = Math.PI / 2;
      flange.position.x = -side * 0.036;
      wheelPivot.add(flange);

      const hub = new THREE.Mesh(trainHubGeo, trainHubMat);
      hub.rotation.z = Math.PI / 2;
      wheelPivot.add(hub);

      // Duidelijke spaakjes zodat het draaien mooi zichtbaar is
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.088, 0.22, 0.03), candyWhiteMat);
      wheelPivot.add(spoke);

      if (addCrankPin) {
        const pin = new THREE.Mesh(
          new THREE.CylinderGeometry(0.022, 0.022, 0.05, 8),
          goldTrimMat
        );
        pin.rotation.z = Math.PI / 2;
        pin.position.set(side * 0.042, 0.075, 0);
        wheelPivot.add(pin);
      }

      parentGroup.add(wheelPivot);
      trainWheels.push(wheelPivot);

      // Stevig lagerblokje boven de as
      const axleBox = new THREE.Mesh(trainAxleBoxGeo, trainChassisMat);
      axleBox.position.set(side * (RAIL_HALF_GAUGE - 0.075), trainWheelRadius + 0.10, wz);
      parentGroup.add(axleBox);
    });
  });
}

/**
 * Voegt een voor- en achterbufferbalk met gouden buffers toe voor een stevige uitstraling.
 */
function addBufferBeam(parentGroup, zPos, width) {
  const beam = new THREE.Mesh(new THREE.BoxGeometry(width, 0.13, 0.09), trainChassisMat);
  beam.position.set(0, 0.34, zPos);
  beam.castShadow = true;
  parentGroup.add(beam);

  const dir = zPos >= 0 ? 1 : -1;
  [-0.25, 0.25].forEach((bx) => {
    const buffer = new THREE.Mesh(trainBufferGeo, goldTrimMat);
    buffer.rotation.x = Math.PI / 2;
    buffer.position.set(bx, 0.34, zPos + dir * 0.06);
    parentGroup.add(buffer);
  });
}

// --- 6A. De Locomotief ("De Suikerstok Express") ---
const trainLocoGroup = new THREE.Group();
trainSystemGroup.add(trainLocoGroup);

addCarriageWheels(trainLocoGroup, [-0.64, 0.0, 0.64], true);

// Horizontale drijfstangen aan beide zijden die meedraaien met de wieltjes
const sideRodGeo = new THREE.BoxGeometry(0.032, 0.042, 1.36);
[-1, 1].forEach((side) => {
  const rod = new THREE.Mesh(sideRodGeo, goldTrimMat);
  rod.position.set(side * (RAIL_HALF_GAUGE + 0.055), trainWheelRadius + 0.075, 0);
  rod.castShadow = true;
  trainLocoGroup.add(rod);
  trainSideRods.push({ mesh: rod, side });
});

// Smal binnenframe tussen de wielen + verhoogde loopplaat boven de wielen (geen wiel-clipping!)
const locoUnderframe = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.16, 1.98), trainChassisMat);
locoUnderframe.position.set(0, 0.25, 0);
locoUnderframe.castShadow = true;
locoUnderframe.receiveShadow = true;
trainLocoGroup.add(locoUnderframe);

const locoDeck = new THREE.Mesh(new THREE.BoxGeometry(0.90, 0.09, 2.06), trainChassisMat);
locoDeck.position.set(0, 0.385, 0);
locoDeck.castShadow = true;
locoDeck.receiveShadow = true;
trainLocoGroup.add(locoDeck);

addBufferBeam(trainLocoGroup, 1.04, 0.90);
addBufferBeam(trainLocoGroup, -1.04, 0.90);

// Achterkoppeling van de locomotief
const locoRearCoupler = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.22), trainChassisMat);
locoRearCoupler.position.set(0, 0.32, -1.14);
trainLocoGroup.add(locoRearCoupler);

// Compacte gouden sneeuwruimer voorop (+Z), recht onder de bufferbalk en ruim boven de rails (y >= 0.065)
const cowcatcherGeo = (function buildCowcatcherGeometry() {
  const yBot = 0.065;
  const yTop = 0.275;
  const zBack = 0.99;
  const zTipBot = 1.24;
  const halfWBot = 0.39;
  const topScale = 0.70;
  const halfWTop = halfWBot * topScale;
  const zTipTop = zBack + (zTipBot - zBack) * topScale;

  const lb = [-halfWBot, yBot, zBack];
  const rb = [ halfWBot, yBot, zBack];
  const fb = [0, yBot, zTipBot];
  const lt = [-halfWTop, yTop, zBack];
  const rt = [ halfWTop, yTop, zBack];
  const ft = [0, yTop, zTipTop];

  const positions = [
    ...lb, ...fb, ...ft, ...lb, ...ft, ...lt, // Linker V-vlak
    ...fb, ...rb, ...rt, ...fb, ...rt, ...ft, // Rechter V-vlak
    ...lt, ...ft, ...rt,                      // Bovenkant (sluit aan op bufferbalk)
    ...lb, ...rb, ...fb,                      // Onderkant
    ...lb, ...lt, ...rt, ...lb, ...rt, ...rb  // Achterkant (sluit aan op onderstel)
  ];

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
})();
const cowcatcher = new THREE.Mesh(cowcatcherGeo, goldTrimMat);
cowcatcher.castShadow = true;
cowcatcher.receiveShadow = true;
trainLocoGroup.add(cowcatcher);

// Ketelzadel dat de ronde ketel stevig op het onderstel draagt
const boilerSaddle = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.24, 1.06), trainChassisMat);
boilerSaddle.position.set(0, 0.49, 0.34);
trainLocoGroup.add(boilerSaddle);

// Aardbei-roze ketel
const boilerMat = new THREE.MeshStandardMaterial({ color: PASTEL.poleRed, roughness: 0.38 });
const boiler = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 1.16, 20), boilerMat);
boiler.rotation.x = Math.PI / 2;
boiler.position.set(0, 0.72, 0.34);
boiler.castShadow = true;
trainLocoGroup.add(boiler);

// Gouden sierbanden om de ketel
[0.02, 0.46, 0.88].forEach((bz) => {
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.026, 8, 22), goldTrimMat);
  band.position.set(0, 0.72, bz);
  trainLocoGroup.add(band);
});

// Voorkant rookkast & warm stralende koplamp
const smokeboxFront = new THREE.Mesh(
  new THREE.CylinderGeometry(0.355, 0.355, 0.12, 18),
  trainChassisMat
);
smokeboxFront.rotation.x = Math.PI / 2;
smokeboxFront.position.set(0, 0.72, 0.93);
trainLocoGroup.add(smokeboxFront);

const headlightRing = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.1, 14), goldTrimMat);
headlightRing.rotation.x = Math.PI / 2;
headlightRing.position.set(0, 0.76, 1.01);
trainLocoGroup.add(headlightRing);

const headlightBulb = new THREE.Mesh(
  new THREE.SphereGeometry(0.105, 12, 12),
  new THREE.MeshStandardMaterial({
    color: 0xfff8c9,
    emissive: 0xffe074,
    emissiveIntensity: 1.5,
    roughness: 0.15
  })
);
headlightBulb.position.set(0, 0.76, 1.06);
trainLocoGroup.add(headlightBulb);

// Zacht warm koplamp-lichtje dat over de sneeuw schijnt
const trainHeadLight = new THREE.PointLight(0xffe28a, 0.55, 6);
trainHeadLight.position.set(0, 0.78, 1.45);
trainLocoGroup.add(trainHeadLight);

// Schoorsteen met uitlopende kroon
const locoChimney = new THREE.Mesh(
  new THREE.CylinderGeometry(0.14, 0.095, 0.44, 14),
  trainChassisMat
);
locoChimney.position.set(0, 1.20, 0.68);
locoChimney.castShadow = true;
trainLocoGroup.add(locoChimney);

const locoChimneyRim = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.028, 8, 16), goldTrimMat);
locoChimneyRim.rotation.x = Math.PI / 2;
locoChimneyRim.position.set(0, 1.42, 0.68);
trainLocoGroup.add(locoChimneyRim);

// Onzichtbaar ankerpunt bovenop de schoorsteen voor de rijdende stoomwolkjes!
const trainChimneyTip = new THREE.Object3D();
trainChimneyTip.position.set(0, 1.48, 0.68);
trainLocoGroup.add(trainChimneyTip);

// Stoomkoepel en stevig bevestigd belletje op de ketel
const steamDome = new THREE.Mesh(new THREE.SphereGeometry(0.135, 14, 12), goldTrimMat);
steamDome.scale.set(1, 0.85, 1);
steamDome.position.set(0, 1.07, 0.36);
trainLocoGroup.add(steamDome);

const bellMount = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.048, 0.10, 10), trainChassisMat);
bellMount.position.set(0, 1.10, 0.12);
trainLocoGroup.add(bellMount);

const trainBell = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.13, 12), goldTrimMat);
trainBell.position.set(0, 1.18, 0.12);
trainLocoGroup.add(trainBell);

// Mintgroen machinistenhuisje achterop (stabiele verhoudingen)
const cabMat = new THREE.MeshStandardMaterial({ color: PASTEL.doorMint, roughness: 0.5 });
const locoCab = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.82, 0.82), cabMat);
locoCab.position.set(0, 0.83, -0.58);
locoCab.castShadow = true;
locoCab.receiveShadow = true;
trainLocoGroup.add(locoCab);

// Warme verlichte raampjes aan zij- en achterkant van het machinistenhuisje
[-0.475, 0.475].forEach((wx) => {
  const sideWin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.32, 0.42), trainWindowMat);
  sideWin.position.set(wx, 0.90, -0.58);
  trainLocoGroup.add(sideWin);
});
const rearWin = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.30, 0.03), trainWindowMat);
rearWin.position.set(0, 0.90, -0.995);
trainLocoGroup.add(rearWin);

// Besneeuwd dakje bovenop het machinistenhuisje
const locoCabRoof = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.11, 0.94), roofSnowMat);
locoCabRoof.position.set(0, 1.29, -0.58);
locoCabRoof.castShadow = true;
trainLocoGroup.add(locoCabRoof);

trainLocoGroup.userData = {
  interactive: true,
  type: 'trein'
};
clickableObjects.push(trainLocoGroup);

// --- 6B. Wagon 1: Pastel Cadeautjes-Wagon ---
const trainCargoWagon = new THREE.Group();
trainSystemGroup.add(trainCargoWagon);

addCarriageWheels(trainCargoWagon, [-0.48, 0.48]);

const cargoUnderframe = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.15, 1.48), trainChassisMat);
cargoUnderframe.position.set(0, 0.245, 0);
cargoUnderframe.castShadow = true;
trainCargoWagon.add(cargoUnderframe);

const cargoBedMat = new THREE.MeshStandardMaterial({ color: PASTEL.wallBlue, roughness: 0.55 });
const cargoFloor = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.10, 1.54), cargoBedMat);
cargoFloor.position.set(0, 0.39, 0);
cargoFloor.castShadow = true;
trainCargoWagon.add(cargoFloor);

addBufferBeam(trainCargoWagon, 0.78, 0.88);
addBufferBeam(trainCargoWagon, -0.78, 0.88);

// Lage zijkanten van de open goederenwagon
[
  [0, 0.56,  0.71, 0.88, 0.24, 0.07],
  [0, 0.56, -0.71, 0.88, 0.24, 0.07],
  [-0.41, 0.56, 0, 0.07, 0.24, 1.48],
  [ 0.41, 0.56, 0, 0.07, 0.24, 1.48]
].forEach(([x, y, z, w, h, d]) => {
  const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), cargoBedMat);
  wall.position.set(x, y, z);
  wall.castShadow = true;
  trainCargoWagon.add(wall);
});

// 3 schattige miniatuur cadeautjes in de wagon
[
  { x: -0.14, y: 0.62, z:  0.34, s: 0.36, box: 0xff9ebb, rib: 0xfff3a1, rot:  0.18 },
  { x:  0.16, y: 0.60, z: -0.06, s: 0.32, box: 0xfff3a1, rib: 0xff85a2, rot: -0.25 },
  { x: -0.06, y: 0.63, z: -0.40, s: 0.38, box: 0xa8f0c6, rib: 0xd8bfff, rot:  0.35 }
].forEach((mg) => {
  const miniGift = new THREE.Group();
  miniGift.position.set(mg.x, mg.y, mg.z);
  miniGift.rotation.y = mg.rot;

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(mg.s, mg.s, mg.s),
    new THREE.MeshStandardMaterial({ color: mg.box, roughness: 0.45 })
  );
  box.castShadow = true;
  miniGift.add(box);

  const ribMat = new THREE.MeshStandardMaterial({ color: mg.rib, roughness: 0.35 });
  miniGift.add(new THREE.Mesh(new THREE.BoxGeometry(mg.s + 0.03, mg.s + 0.02, 0.07), ribMat));
  miniGift.add(new THREE.Mesh(new THREE.BoxGeometry(0.07, mg.s + 0.02, mg.s + 0.03), ribMat));

  const bow = createGiftBow(ribMat, mg.s * 1.05);
  bow.position.set(0, mg.s / 2 + 0.01, 0);
  miniGift.add(bow);
  trainCargoWagon.add(miniGift);
});

// Koppelingen voor- en achteraan wagon 1
const coupler1Front = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.24), trainChassisMat);
coupler1Front.position.set(0, 0.32, 0.89);
trainCargoWagon.add(coupler1Front);

const coupler1Rear = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.22), trainChassisMat);
coupler1Rear.position.set(0, 0.32, -0.88);
trainCargoWagon.add(coupler1Rear);

trainCargoWagon.userData = {
  interactive: true,
  type: 'trein'
};
clickableObjects.push(trainCargoWagon);

// --- 6C. Wagon 2: Knusse Passagierswagon met Regenboog-daklampjes ---
const trainPassengerWagon = new THREE.Group();
trainSystemGroup.add(trainPassengerWagon);

addCarriageWheels(trainPassengerWagon, [-0.50, 0.50]);

const passUnderframe = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.15, 1.54), trainChassisMat);
passUnderframe.position.set(0, 0.245, 0);
passUnderframe.castShadow = true;
trainPassengerWagon.add(passUnderframe);

const passDeck = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.10, 1.60), trainChassisMat);
passDeck.position.set(0, 0.39, 0);
passDeck.castShadow = true;
trainPassengerWagon.add(passDeck);

addBufferBeam(trainPassengerWagon, 0.81, 0.88);
addBufferBeam(trainPassengerWagon, -0.81, 0.88);

const passBodyMat = new THREE.MeshStandardMaterial({ color: PASTEL.wallLavender, roughness: 0.52 });
const passBody = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.68, 1.48), passBodyMat);
passBody.position.set(0, 0.78, 0);
passBody.castShadow = true;
passBody.receiveShadow = true;
trainPassengerWagon.add(passBody);

// 3 knusse verlichte raampjes aan beide zijden
[-0.44, 0, 0.44].forEach((wz) => {
  [-0.445, 0.445].forEach((wx) => {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.28, 0.26), trainWindowMat);
    win.position.set(wx, 0.82, wz);
    trainPassengerWagon.add(win);
  });
});

// Besneeuwd dak + regenboog-lampjes langs de dakrand!
const passRoofBase = new THREE.Mesh(
  new THREE.BoxGeometry(0.96, 0.10, 1.58),
  new THREE.MeshStandardMaterial({ color: PASTEL.wallPink, roughness: 0.5 })
);
passRoofBase.position.set(0, 1.15, 0);
trainPassengerWagon.add(passRoofBase);

const passRoofSnow = new THREE.Mesh(new THREE.BoxGeometry(1.00, 0.09, 1.62), roofSnowMat);
passRoofSnow.position.set(0, 1.23, 0);
passRoofSnow.castShadow = true;
trainPassengerWagon.add(passRoofSnow);

const trainBulbGeo = new THREE.SphereGeometry(0.055, 8, 8);
[-0.54, 0, 0.54].forEach((bz, idx) => {
  [-0.49, 0.49].forEach((bx, sideIdx) => {
    const cHex = PASTEL.rainbowHex[(idx + sideIdx * 3) % PASTEL.rainbowHex.length];
    const bMat = new THREE.MeshStandardMaterial({
      color: cHex,
      emissive: cHex,
      emissiveIntensity: 0.95,
      roughness: 0.2
    });
    const bulb = new THREE.Mesh(trainBulbGeo, bMat);
    bulb.position.set(bx, 1.12, bz);
    trainPassengerWagon.add(bulb);
    allRainbowLights.push({
      mesh: bulb,
      material: bMat,
      phase: idx * 0.6 + sideIdx * 1.3,
      treeIndex: -1
    });
  });
});

// Koppeling vooraan + gouden achterlichtje achterop
const coupler2 = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.24), trainChassisMat);
coupler2.position.set(0, 0.32, 0.92);
trainPassengerWagon.add(coupler2);

const tailLantern = new THREE.Mesh(
  new THREE.SphereGeometry(0.085, 10, 10),
  new THREE.MeshStandardMaterial({
    color: PASTEL.poleRed,
    emissive: 0xff6b8b,
    emissiveIntensity: 1.2
  })
);
tailLantern.position.set(0, 0.78, -0.76);
trainPassengerWagon.add(tailLantern);

trainPassengerWagon.userData = {
  interactive: true,
  type: 'trein'
};
clickableObjects.push(trainPassengerWagon);

// 7. Pastel stoompluimpjes uit de rijdende locomotief-schoorsteen
const trainSteamPuffs = [];
const trainSteamGeo = new THREE.SphereGeometry(0.14, 10, 10);
for (let i = 0; i < 10; i++) {
  const sMat = new THREE.MeshBasicMaterial({
    color: 0xfff0fa,
    transparent: true,
    opacity: 0.7
  });
  const puff = new THREE.Mesh(trainSteamGeo, sMat);
  scene.add(puff);
  const startPos = new THREE.Vector3();
  trainLocoGroup.updateMatrixWorld(true);
  trainChimneyTip.getWorldPosition(startPos);
  trainSteamPuffs.push({
    mesh: puff,
    material: sMat,
    progress: i / 10,
    origin: startPos,
    driftX: (Math.random() - 0.5) * 0.45,
    driftZ: (Math.random() - 0.5) * 0.45
  });
}

// Status van het treintje voor de animatie-loop & interactiviteit
const trainState = {
  progress: 0.16, // Begint mooi zichtbaar links-vooraan
  baseSpeed: 4.2, // Eenheden per seconde langs het spoor
  turboTimer: 0,
  isPaused: false,
  wheelAngle: 0
};

const RAIL_TOP_Y = 0.16;
const CARRIAGE_OFFSETS = [
  { group: trainLocoGroup, dist: 0, halfWheelbase: 0.64 },
  { group: trainCargoWagon, dist: 2.12, halfWheelbase: 0.48 },
  { group: trainPassengerWagon, dist: 4.02, halfWheelbase: 0.50 }
];

function wrapTrackU(u) {
  return ((u % 1) + 1) % 1;
}

/**
 * Plaatst elke wagon met zowel voor- als achteras exact op de spoorcurve (geen gewiebel!).
 */
function placeTrainCarriages(baseProgress) {
  CARRIAGE_OFFSETS.forEach((car) => {
    const uCenter = wrapTrackU(baseProgress - car.dist / TRAIN_TRACK_LENGTH);
    const halfU = car.halfWheelbase / TRAIN_TRACK_LENGTH;
    const frontPt = trainTrackCurve.getPointAt(wrapTrackU(uCenter + halfU));
    const rearPt = trainTrackCurve.getPointAt(wrapTrackU(uCenter - halfU));

    car.group.position.set(
      (frontPt.x + rearPt.x) * 0.5,
      RAIL_TOP_Y,
      (frontPt.z + rearPt.z) * 0.5
    );
    car.group.rotation.y = Math.atan2(frontPt.x - rearPt.x, frontPt.z - rearPt.z);
  });
}

// Zet het treintje direct op het spoor nog voor het eerste frame
placeTrainCarriages(trainState.progress);
trainLocoGroup.updateMatrixWorld(true);
trainSteamPuffs.forEach((sp) => {
  trainChimneyTip.getWorldPosition(sp.origin);
});


// ============================================================================
// HOOFDSTUK 9: VALLENDE SNEEUW ALS PARTICLE SYSTEM (THREE.Points)
// ============================================================================

const SNOW_COUNT = 1200;
const snowGeo = new THREE.BufferGeometry();
const snowPositions = new Float32Array(SNOW_COUNT * 3);
const snowSpeeds = new Float32Array(SNOW_COUNT);
const snowPhases = new Float32Array(SNOW_COUNT);

for (let i = 0; i < SNOW_COUNT; i++) {
  snowPositions[i * 3]     = (Math.random() - 0.5) * 48; // X: breedte
  snowPositions[i * 3 + 1] = Math.random() * 28;         // Y: hoogte
  snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 48; // Z: diepte

  snowSpeeds[i] = 1.4 + Math.random() * 1.8; // Elke vlok valt op eigen snelheid
  snowPhases[i] = Math.random() * Math.PI * 2;
}

snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));

const snowMat = new THREE.PointsMaterial({
  size: 0.48,
  map: createSnowflakeTexture(),
  transparent: true,
  opacity: 0.88,
  depthWrite: false
});

const snowParticles = new THREE.Points(snowGeo, snowMat);
scene.add(snowParticles);


// --- 9B. Pastel Roze Glitter-Fontein (wordt gegooid als je op een elfje klikt) ---
const glitterTexture = createGlitterTexture();
const PASTEL_PINK_GLITTER_COLORS = [
  new THREE.Color(0xffb3d9), // Zacht pastel roze
  new THREE.Color(0xff9ebb), // Kersenbloesem roze
  new THREE.Color(0xffcce6), // Suikerspin lichtroze
  new THREE.Color(0xff85b8), // Sprankelend pastel-magenta
  new THREE.Color(0xffe0f0), // Parelmoer roze
  new THREE.Color(0xf9a8d4)  // Roze glitter
];
const glitterBursts = [];

/**
 * Laat vanaf een wereldpositie een wolk van pastel roze glitter omhoog vliegen.
 */
function spawnPastelPinkGlitter(origin) {
  const count = 85;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const baseColors = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const phases = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // Start dicht bij het elfje met een kleine variatie
    positions[i3]     = origin.x + (Math.random() - 0.5) * 0.28;
    positions[i3 + 1] = origin.y + (Math.random() - 0.5) * 0.16;
    positions[i3 + 2] = origin.z + (Math.random() - 0.5) * 0.28;

    // Krachtige worp omhoog in een vrolijke kegelvorm
    const angle = Math.random() * Math.PI * 2;
    const spread = 0.4 + Math.random() * 1.9;
    velocities[i3]     = Math.cos(angle) * spread;
    velocities[i3 + 1] = 3.8 + Math.random() * 3.4;
    velocities[i3 + 2] = Math.sin(angle) * spread;

    const chosen = PASTEL_PINK_GLITTER_COLORS[
      Math.floor(Math.random() * PASTEL_PINK_GLITTER_COLORS.length)
    ];
    baseColors[i3]     = chosen.r;
    baseColors[i3 + 1] = chosen.g;
    baseColors[i3 + 2] = chosen.b;
    colors[i3]         = chosen.r;
    colors[i3 + 1]     = chosen.g;
    colors[i3 + 2]     = chosen.b;

    phases[i] = Math.random() * Math.PI * 2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.42,
    map: glitterTexture,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    depthWrite: false
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  glitterBursts.push({
    points,
    geometry,
    material,
    baseColors,
    velocities,
    phases,
    count,
    age: 0,
    maxAge: 2.4
  });
}


// ============================================================================
// HOOFDSTUK 10: KLIKBARE OBJECTEN & RAYCASTING (CADEAUS DIE OPENSPRINGEN!)
// ============================================================================

const giftBoxes = [];

/**
 * Kiest een contrasterend pastel binnenkant-palet dat duidelijk verschilt
 * van de buitenkant (boxHex) én van het lint.
 */
function getGiftInteriorPalette(boxHex) {
  const palettes = {
    0xff9ebb: { base: '#dffbe9', stripe: '#b8f0d0', accent: '#c7a4ff', tissue: 0xf4fff9, emissive: 0x9cf0c5 }, // Roze doos -> mint binnenkant
    0xa8f0c6: { base: '#f2e6ff', stripe: '#dec7ff', accent: '#ff9ebb', tissue: 0xfaf5ff, emissive: 0xd6b8ff }, // Mint doos -> lavendel binnenkant
    0xa3d8ff: { base: '#ffe7f0', stripe: '#ffc7de', accent: '#ffd97d', tissue: 0xfff7fa, emissive: 0xffb8d4 }, // Blauw doos -> aardbei-roze binnenkant
    0xd8bfff: { base: '#fff1dc', stripe: '#ffdcb3', accent: '#8ee6bd', tissue: 0xfffaf0, emissive: 0xffd5a6 }, // Lila doos -> perzik-vanille binnenkant
    0xfff3a1: { base: '#e4eeff', stripe: '#bfd8ff', accent: '#ff9ebb', tissue: 0xf5f9ff, emissive: 0xa8c8ff }  // Geel doos -> hemelsblauw binnenkant
  };
  return palettes[boxHex] || {
    base: '#f2e6ff',
    stripe: '#dec7ff',
    accent: '#ff9ebb',
    tissue: 0xfaf5ff,
    emissive: 0xd6b8ff
  };
}

/**
 * Tekent een gezellige, gestreepte en met sterretjes versierde voeringtextuur
 * voor de binnenkant van een cadeautje.
 */
function createGiftInteriorTexture(palette) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Basis achtergrondkleur
  ctx.fillStyle = palette.base;
  ctx.fillRect(0, 0, 256, 256);

  // Zachte diagonale voering-strepen
  ctx.strokeStyle = palette.stripe;
  ctx.lineWidth = 14;
  for (let i = -256; i < 512; i += 36) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 256, 256);
    ctx.stroke();
  }

  // Schattige stipjes en 4-puntige sterretjes op de binnenvoering
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cx = 32 + col * 64 + ((row % 2) * 16 - 8);
      const cy = 32 + row * 64;

      if ((row + col) % 2 === 0) {
        ctx.fillStyle = palette.accent;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 9);
        ctx.quadraticCurveTo(cx + 2, cy - 2, cx + 9, cy);
        ctx.quadraticCurveTo(cx + 2, cy + 2, cx, cy + 9);
        ctx.quadraticCurveTo(cx - 2, cy + 2, cx - 9, cy);
        ctx.quadraticCurveTo(cx - 2, cy - 2, cx, cy - 9);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Subtiele schaduwrand zodat de hoeken binnenin extra diepte hebben
  const shade = ctx.createRadialGradient(128, 128, 60, 128, 128, 180);
  shade.addColorStop(0, 'rgba(255, 255, 255, 0)');
  shade.addColorStop(1, 'rgba(65, 45, 95, 0.14)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/**
 * Hulpfunctie: voegt een paneel toe aan een groep en schakelt schaduwen in.
 */
function addGiftPanel(parent, w, h, d, mat, x, y, z, castShadow = true, receiveShadow = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  parent.add(mesh);
  return mesh;
}

/**
 * Bouwt een hol pastel cadeautje met een contrasterende binnenvoering,
 * vloeipapier binnenin, een scharnierend hol deksel (lidPivot)
 * en een verborgen verrassing die omhoog springt als je erop klikt!
 */
function createClickableGift(x, z, boxHex, ribbonHex, surpriseName, rotationY = 0) {
  const giftGroup = new THREE.Group();
  giftGroup.position.set(x, 0, z);
  giftGroup.rotation.y = rotationY;
  scene.add(giftGroup);

  const size = 1.05;
  const half = size / 2;
  const outerT = 0.04;
  const innerT = 0.03;
  const wallT = outerT + innerT;
  const innerSpan = size - wallT * 2;
  const midSpan = size - outerT * 2;

  const interiorPalette = getGiftInteriorPalette(boxHex);
  const interiorTex = createGiftInteriorTexture(interiorPalette);

  const boxMat = new THREE.MeshStandardMaterial({ color: boxHex, roughness: 0.45 });
  const ribbonMat = new THREE.MeshStandardMaterial({ color: ribbonHex, roughness: 0.35 });
  const innerMat = new THREE.MeshStandardMaterial({
    map: interiorTex,
    roughness: 0.78,
    metalness: 0.02,
    emissive: interiorPalette.emissive,
    emissiveIntensity: 0.14
  });
  const tissueMat = new THREE.MeshStandardMaterial({
    color: interiorPalette.tissue,
    roughness: 0.9,
    emissive: interiorPalette.emissive,
    emissiveIntensity: 0.12
  });

  // 1. De holle onderdoos: buitenwanden in pakpapier (boxMat) + aparte binnenvoering (innerMat)
  // Buitenbodem
  addGiftPanel(giftGroup, size, outerT, size, boxMat, 0, outerT / 2, 0);

  // 4 buitenwanden (starten boven de buitenbodem, zonder onderlinge overlap)
  const outerWallH = size - outerT;
  const outerWallY = outerT + outerWallH / 2;
  addGiftPanel(giftGroup, size, outerWallH, outerT, boxMat, 0, outerWallY, half - outerT / 2);
  addGiftPanel(giftGroup, size, outerWallH, outerT, boxMat, 0, outerWallY, -(half - outerT / 2));
  addGiftPanel(giftGroup, outerT, outerWallH, midSpan, boxMat, -(half - outerT / 2), outerWallY, 0);
  addGiftPanel(giftGroup, outerT, outerWallH, midSpan, boxMat, half - outerT / 2, outerWallY, 0);

  // Binnenvloer & 4 binnenwanden in contrasterende voering
  addGiftPanel(giftGroup, midSpan, innerT, midSpan, innerMat, 0, outerT + innerT / 2, 0, false, true);
  const innerWallH = size - wallT;
  const innerWallY = wallT + innerWallH / 2;
  const innerOffset = half - outerT - innerT / 2;
  addGiftPanel(giftGroup, midSpan, innerWallH, innerT, innerMat, 0, innerWallY, innerOffset, false, true);
  addGiftPanel(giftGroup, midSpan, innerWallH, innerT, innerMat, 0, innerWallY, -innerOffset, false, true);
  addGiftPanel(giftGroup, innerT, innerWallH, innerSpan, innerMat, -innerOffset, innerWallY, 0, false, true);
  addGiftPanel(giftGroup, innerT, innerWallH, innerSpan, innerMat, innerOffset, innerWallY, 0, false, true);

  // Zacht vloeipapier / kussentje op de bodem binnenin de doos
  addGiftPanel(giftGroup, innerSpan - 0.08, 0.07, innerSpan - 0.08, tissueMat, 0, wallT + 0.035, 0, false, true);
  const tissueFlaps = [
    { x: 0, z: 0.28, rx: 0.26, rz: 0, w: 0.62, d: 0.016 },
    { x: 0, z: -0.28, rx: -0.26, rz: 0, w: 0.62, d: 0.016 },
    { x: 0.28, z: 0, rx: 0, rz: -0.26, w: 0.016, d: 0.62 },
    { x: -0.28, z: 0, rx: 0, rz: 0.26, w: 0.016, d: 0.62 }
  ];
  tissueFlaps.forEach((tf) => {
    const flap = new THREE.Mesh(new THREE.BoxGeometry(tf.w, 0.34, tf.d), tissueMat);
    flap.position.set(tf.x, wallT + 0.19, tf.z);
    flap.rotation.set(tf.rx, 0, tf.rz);
    flap.receiveShadow = true;
    giftGroup.add(flap);
  });

  // Lint kruislings alleen langs de 4 buitenwanden (zodat de bovenkant open blijft!)
  addGiftPanel(giftGroup, 0.2, size + 0.004, 0.02, ribbonMat, 0, size / 2, half + 0.01, false, false);
  addGiftPanel(giftGroup, 0.2, size + 0.004, 0.02, ribbonMat, 0, size / 2, -(half + 0.01), false, false);
  addGiftPanel(giftGroup, 0.02, size + 0.004, 0.2, ribbonMat, half + 0.01, size / 2, 0, false, false);
  addGiftPanel(giftGroup, 0.02, size + 0.004, 0.2, ribbonMat, -(half + 0.01), size / 2, 0, false, false);

  // 2. Het holle deksel met scharnierpunt (pivot) aan de achterkant zodat je ook de binnenkant van het deksel ziet!
  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, size, -half); // Scharnier zit bovenaan aan de achterrand
  giftGroup.add(lidPivot);

  const lidSize = size + 0.12;
  const lidHalf = lidSize / 2;
  const lidH = 0.22;
  const lidTopT = 0.04;
  const lidOuterT = 0.04;
  const lidInnerT = 0.025;
  const lidMidSpan = lidSize - lidOuterT * 2;
  const lidInnerSpan = lidSize - (lidOuterT + lidInnerT) * 2;
  const lidCenterZ = half;

  // Buitenkant deksel (bovenplaat + 4 randwanden)
  addGiftPanel(lidPivot, lidSize, lidTopT, lidSize, boxMat, 0, lidH - lidTopT / 2, lidCenterZ, true, true);
  const lidOuterRimH = lidH - lidTopT;
  const lidOuterRimY = lidOuterRimH / 2;
  addGiftPanel(lidPivot, lidSize, lidOuterRimH, lidOuterT, boxMat, 0, lidOuterRimY, lidCenterZ + lidHalf - lidOuterT / 2);
  addGiftPanel(lidPivot, lidSize, lidOuterRimH, lidOuterT, boxMat, 0, lidOuterRimY, lidCenterZ - lidHalf + lidOuterT / 2);
  addGiftPanel(lidPivot, lidOuterT, lidOuterRimH, lidMidSpan, boxMat, -(lidHalf - lidOuterT / 2), lidOuterRimY, lidCenterZ);
  addGiftPanel(lidPivot, lidOuterT, lidOuterRimH, lidMidSpan, boxMat, lidHalf - lidOuterT / 2, lidOuterRimY, lidCenterZ);

  // Binnenkant deksel (contrasterende binnenvoering op plafond & 4 binnenranden)
  addGiftPanel(
    lidPivot,
    lidMidSpan,
    lidInnerT,
    lidMidSpan,
    innerMat,
    0,
    lidH - lidTopT - lidInnerT / 2,
    lidCenterZ,
    false,
    true
  );
  const lidInnerRimH = lidH - lidTopT - lidInnerT;
  const lidInnerRimY = lidInnerRimH / 2;
  const lidInnerOffset = lidHalf - lidOuterT - lidInnerT / 2;
  addGiftPanel(lidPivot, lidMidSpan, lidInnerRimH, lidInnerT, innerMat, 0, lidInnerRimY, lidCenterZ + lidInnerOffset, false, true);
  addGiftPanel(lidPivot, lidMidSpan, lidInnerRimH, lidInnerT, innerMat, 0, lidInnerRimY, lidCenterZ - lidInnerOffset, false, true);
  addGiftPanel(lidPivot, lidInnerT, lidInnerRimH, lidInnerSpan, innerMat, -lidInnerOffset, lidInnerRimY, lidCenterZ, false, true);
  addGiftPanel(lidPivot, lidInnerT, lidInnerRimH, lidInnerSpan, innerMat, lidInnerOffset, lidInnerRimY, lidCenterZ, false, true);

  // Lint alleen over de buiten-bovenkant en de 4 buitenranden van het deksel (nooit door de binnenkant!)
  addGiftPanel(lidPivot, lidSize + 0.02, 0.016, 0.2, ribbonMat, 0, lidH + 0.008, lidCenterZ, false, false);
  addGiftPanel(lidPivot, 0.2, 0.016, lidSize + 0.02, ribbonMat, 0, lidH + 0.008, lidCenterZ, false, false);
  addGiftPanel(lidPivot, 0.2, lidH + 0.004, 0.018, ribbonMat, 0, lidH / 2, lidCenterZ + lidHalf + 0.009, false, false);
  addGiftPanel(lidPivot, 0.2, lidH + 0.004, 0.018, ribbonMat, 0, lidH / 2, lidCenterZ - lidHalf - 0.009, false, false);
  addGiftPanel(lidPivot, 0.018, lidH + 0.004, 0.2, ribbonMat, lidHalf + 0.009, lidH / 2, lidCenterZ, false, false);
  addGiftPanel(lidPivot, 0.018, lidH + 0.004, 0.2, ribbonMat, -(lidHalf + 0.009), lidH / 2, lidCenterZ, false, false);

  // Sierlijke 3D strik bovenop het deksel (knoop, geknepen lintlussen & staartjes)
  const bow = createGiftBow(ribbonMat, 1.15);
  bow.position.set(0, lidH + 0.015, lidCenterZ);
  lidPivot.add(bow);

  // 3. De Verrassing binnenin die omhoog springt wanneer het cadeau opengaat!
  const surpriseGroup = new THREE.Group();
  surpriseGroup.position.set(0, 0.45, 0);
  surpriseGroup.scale.setScalar(0.01); // Begint klein/verborgen in de doos
  giftGroup.add(surpriseGroup);

  const surpriseMesh = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.36, 0),
    new THREE.MeshStandardMaterial({
      color: PASTEL.goldSoft,
      emissive: ribbonHex,
      emissiveIntensity: 0.75,
      roughness: 0.2
    })
  );
  surpriseGroup.add(surpriseMesh);

  // Vrolijke zwevende pastel-confetti bolletjes rond de verrassing
  for (let c = 0; c < 6; c++) {
    const a = (c / 6) * Math.PI * 2;
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshBasicMaterial({ color: PASTEL.rainbowHex[c] })
    );
    dot.position.set(Math.cos(a) * 0.48, 0.2 + (c % 2) * 0.2, Math.sin(a) * 0.48);
    surpriseGroup.add(dot);
  }

  // Bewaar de status in userData zodat we dit cadeau in de animatie-loop kunnen openen/sluiten
  giftGroup.userData = {
    interactive: true,
    type: 'cadeau',
    isOpen: false,
    openProgress: 0, // Animeert soepel van 0 (dicht) naar 1 (open)
    lidPivot: lidPivot,
    surpriseGroup: surpriseGroup,
    innerMat: innerMat,
    surpriseName: surpriseName
  };

  clickableObjects.push(giftGroup);
  giftBoxes.push(giftGroup);
}

// Plaats 5 klikbare pastel-cadeautjes op de Noordpool
createClickableGift(-2.8,  6.8, 0xff9ebb, 0xfff3a1, 'Gouden Wensster ⭐', 0.3);
createClickableGift(-6.4,  4.8, 0xa8f0c6, 0xff85a2, 'Magisch Kristal 💎', -0.4);
createClickableGift( 0.2,  3.8, 0xa3d8ff, 0xffd1b3, 'Regenboog Juweel 🌈', 0.2);
createClickableGift( 7.2,  5.5, 0xd8bfff, 0xa8f0c6, 'Noordpool Ster ✨', -0.5);
createClickableGift(-2.2, -0.5, 0xfff3a1, 0xff9ebb, 'Cozy Kerstwens 💖', 0.6);


// --- RAYCASTING LOGICA (Muisklik omzetten naar 3D-object) ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let pointerDownPos = { x: 0, y: 0 };

const toastEl = document.getElementById('interaction-toast');
function showToast(htmlMessage) {
  toastEl.innerHTML = htmlMessage;
  toastEl.classList.add('pop');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toastEl.classList.remove('pop'), 350);
}

/**
 * Zoekt vanaf een geraakt onderdeel (bijv. het lint of een tak) omhoog in de
 * ouder-hiërarchie tot we het klikbare hoofdobject (userData.interactive) vinden.
 */
function findInteractiveRoot(object) {
  let curr = object;
  while (curr) {
    if (curr.userData && curr.userData.interactive) return curr;
    curr = curr.parent;
  }
  return null;
}

// Onthoud waar de muis ingedrukt werd (zodat rondkijken niet per ongeluk klikt)
window.addEventListener('pointerdown', (event) => {
  pointerDownPos.x = event.clientX;
  pointerDownPos.y = event.clientY;
});

// Verander de muisaanwijzer in een handje ('pointer') als je boven een klikbaar object zweeft
window.addEventListener('pointermove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(clickableObjects, true);
  renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
});

// Controleer bij loslaten van de muis of de gebruiker echt geklikt heeft
window.addEventListener('pointerup', (event) => {
  // Negeer kliks op de HTML-knoppen bovenaan
  if (event.target.closest('header, .modal, .legend-card')) return;

  const moveDist = Math.hypot(
    event.clientX - pointerDownPos.x,
    event.clientY - pointerDownPos.y
  );
  if (moveDist > 6) return; // Gebruiker was de camera aan het draaien met OrbitControls

  // Stap 1: Bereken muiscoördinaten tussen -1 en +1
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Stap 2: Schiet de Raycaster-laserstraal vanaf de camera door de muispositie
  raycaster.setFromCamera(mouse, camera);

  // Stap 3: Kijk welke klikbare objecten geraakt worden
  const intersects = raycaster.intersectObjects(clickableObjects, true);
  if (intersects.length === 0) return;

  const targetObj = findInteractiveRoot(intersects[0].object);
  if (!targetObj) return;

  const data = targetObj.userData;

  // Actie A: Klik op een Cadeautje -> Laat het deksel openspringen (of sluiten)!
  if (data.type === 'cadeau') {
    data.isOpen = !data.isOpen;
    if (data.isOpen) {
      showToast(`🎁 Hoera! Cadeautje sprong open: <strong>${data.surpriseName}</strong>!`);
    } else {
      showToast(`🎀 Cadeautje is weer netjes ingepakt!`);
    }
  }
  // Actie B: Klik op een Kerstboom -> Laat de boom vrolijk springen en extra fel fonkelen!
  else if (data.type === 'boom') {
    data.boostTimer = 2.5; // 2.5 seconden turbo-regenboogglans en sprongetje
    showToast(`🎄 Kerstboom #${data.treeIndex + 1} danst en straalt met regenbooglampjes!`);
  }
  // Actie C: Klik op de 90° N Noordpool-paal -> Regenbooggolf over het eiland!
  else if (data.type === 'noordpool') {
    data.spinVelocity = 10;
    data.pulseProgress = 0.01;
    cycleLightMode();
    showToast(`📍 90° N Noordpool geactiveerd! Regenbooggolf over de sneeuw!`);
  }
  // Actie D: Klik op de Sneeuwpop -> Vrolijk sprongetje!
  else if (data.type === 'sneeuwpop') {
    data.jumpTime = 1.6;
    showToast(`⛄ De pastel-sneeuwpop maakt een blij sprongetje!`);
  }
  // Actie E: Klik op de Werkplaats -> Gezellige feestmodus in de ramen!
  else if (data.type === 'werkplaats') {
    data.cozyParty = !data.cozyParty;
    showToast(
      data.cozyParty
        ? `🏠 De elfjes vieren een regenboogfeestje in de Werkplaats!`
        : `🏠 De Werkplaats gloeit weer met rustig kaarslicht!`
    );
  }
  // Actie F: Klik op een Elfjes-huisje -> Daklampjes fonkelen extra fel en het huisje huppelt!
  else if (data.type === 'elfenhuis') {
    data.boostTimer = 2.0;
    showToast(`🧝 Elfjes-huisje #${data.houseIndex + 1} fonkelt met vrolijke daklampjes! ✨`);
  }
  // Actie G: Klik op een Elfje -> Gooit pastel roze glitter omhoog!
  else if (data.type === 'elfje') {
    data.throwTimer = 0.85;
    const elfWorldPos = new THREE.Vector3();
    targetObj.getWorldPosition(elfWorldPos);
    elfWorldPos.y += 0.72;
    spawnPastelPinkGlitter(elfWorldPos);
    showToast(`🧚 Elfje #${data.elfIndex + 1} gooit pastel roze glitter omhoog! ✨`);
  }
  // Actie H: Klik op de Vijver -> De kleine visjes springen vrolijk op!
  else if (data.type === 'vijver') {
    data.splashTimer = 1.8;
    showToast(`🐟 Plons! De kleine visjes springen vrolijk in de vijver! ✨`);
  }
  // Actie I: Klik op het Noordpool Express Treintje -> Tjoek-tjoek turbo rit!
  else if (data.type === 'trein') {
    trainState.isPaused = false;
    trainState.turboTimer = 3.2;
    showToast(`🚂 Tjoek tjoek! De Noordpool Express geeft extra stoom rond het eiland!`);
  }
  // Actie J: Klik op Station Noordpool -> Laat het treintje stoppen of weer vertrekken!
  else if (data.type === 'station') {
    trainState.isPaused = !trainState.isPaused;
    showToast(
      trainState.isPaused
        ? `🚉 Halte Noordpool: het treintje wacht even op instappende elfjes!`
        : `🚂 De conducteur fluit: het treintje rijdt weer verder rond het eiland!`
    );
  }
  // Actie K: Klik op het Reuzerad -> Feestrondje met extra felle regenbooglampjes!
  else if (data.type === 'reuzerad') {
    data.speedBoostTimer = 3.5;
    showToast(`🎡 Het mini-reuzerad bij het Elfendorp draait een vrolijk feestrondje! ✨`);
  }
  // Actie L: Klik op de witte kerstkat -> Vrolijk sprongetje & glitter!
  else if (data.type === 'kerstkat') {
    data.jumpTimer = 1.4;
    const catWorldPos = new THREE.Vector3();
    targetObj.getWorldPosition(catWorldPos);
    catWorldPos.y += 0.68;
    spawnPastelPinkGlitter(catWorldPos);
    showToast(`🐱 Miauw! De witte kerstkat spint vrolijk in haar kerstoutfit! ✨`);
  }
  // Actie M: Klik op het Kattenhuisje -> Daklampjes fonkelen, belletje & bolletje wol wiebelen!
  else if (data.type === 'kattenhuisje') {
    data.boostTimer = 2.2;
    christmasCatGroup.userData.jumpTimer = Math.max(christmasCatGroup.userData.jumpTimer, 1.1);
    const houseWorldPos = new THREE.Vector3();
    targetObj.getWorldPosition(houseWorldPos);
    houseWorldPos.y += 1.25;
    spawnPastelPinkGlitter(houseWorldPos);
    showToast(`🏠🐱 Miauw! Het knusse kattenhuisje naast de werkplaats fonkelt! ✨`);
  }
  // Actie N: Klik op de Rendierenstalling -> Lampjes fonkelen en rendieren springen blij!
  else if (data.type === 'rendierenstal') {
    data.boostTimer = 2.4;
    const stableWorldPos = new THREE.Vector3();
    targetObj.getWorldPosition(stableWorldPos);
    stableWorldPos.y += 1.9;
    spawnPastelPinkGlitter(stableWorldPos);
    showToast(`🦌 De rendieren knabbelen tevreden op worteltjes in hun warme stalling! ✨`);
  }
});


// ============================================================================
// UI KNOPPEN BOVENAAN (Wissel lampjes-modus, Open alle cadeaus, Uitleg-venster)
// ============================================================================

const LIGHT_MODES = ['Regenboog Golf', 'Twinkel Pastel', 'Cozy Disco', 'Zachte Gloed'];
let currentLightMode = 0;

function cycleLightMode() {
  currentLightMode = (currentLightMode + 1) % LIGHT_MODES.length;
  document.getElementById('light-mode-label').textContent = LIGHT_MODES[currentLightMode];
}

document.getElementById('btn-rainbow-mode').addEventListener('click', () => {
  cycleLightMode();
  showToast(`🌈 Lampjes-patroon gewijzigd naar: <strong>${LIGHT_MODES[currentLightMode]}</strong>`);
});

document.getElementById('btn-open-all').addEventListener('click', () => {
  const anyClosed = giftBoxes.some((g) => !g.userData.isOpen);
  giftBoxes.forEach((g) => {
    g.userData.isOpen = anyClosed;
  });
  document.getElementById('btn-open-all').textContent = anyClosed
    ? '🎀 Sluit Alle Cadeaus'
    : '🎁 Open Alle Cadeaus';
  showToast(
    anyClosed
      ? '🎁 Alle 5 cadeautjes springen tegelijk open!'
      : '🎀 Alle cadeautjes zijn weer dicht!'
  );
});

const infoModal = document.getElementById('info-modal');
document.getElementById('btn-info').addEventListener('click', () => {
  infoModal.classList.remove('hidden');
});
document.getElementById('btn-close-info').addEventListener('click', () => {
  infoModal.classList.add('hidden');
});
infoModal.addEventListener('click', (e) => {
  if (e.target === infoModal) infoModal.classList.add('hidden');
});


// ============================================================================
// HOOFDSTUK 11: DE ANIMATIE-LOOP (VLOEIEND 60 FPS) & WINDOW RESIZE
// ============================================================================

const clock = new THREE.Clock();
const tempColor = new THREE.Color();

// Variabelen om de FPS (Frames Per Seconde) netjes te meten
let frameCount = 0;
let fpsAccumulator = 0;
const fpsCounterEl = document.getElementById('fps-counter');

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.1);
  const elapsed = clock.getElapsedTime();

  // 1. FPS-teller bijwerken (mikpunt: 60 fps)
  frameCount++;
  fpsAccumulator += delta;
  if (fpsAccumulator >= 0.5) {
    const currentFps = Math.min(60, Math.round(frameCount / fpsAccumulator));
    fpsCounterEl.textContent = currentFps;
    frameCount = 0;
    fpsAccumulator = 0;
  }

  // 2. OrbitControls updaten (nodig voor vloeiende damping)
  controls.update();

  // 3. Knipperende Regenboog Lampjes op alle 7 kerstbomen & de werkplaats
  allRainbowLights.forEach((bulb) => {
    let hue = 0;
    let blink = 1;

    if (currentLightMode === 0) {
      // Regenboog Golf: kleuren glijden als een regenboog langs de takken
      hue = (elapsed * 0.22 + bulb.phase * 0.12) % 1;
      blink = 0.65 + 0.45 * Math.sin(elapsed * 4.2 + bulb.phase);
    } else if (currentLightMode === 1) {
      // Twinkel Pastel: zacht fonkelende pastelkleuren
      hue = (bulb.phase * 0.19) % 1;
      blink = 0.35 + 0.75 * Math.abs(Math.sin(elapsed * 5.5 + bulb.phase * 1.7));
    } else if (currentLightMode === 2) {
      // Cozy Disco: snellere vrolijke kleurwisseling
      hue = (elapsed * 0.65 + bulb.phase * 0.25) % 1;
      blink = 0.8 + 0.4 * Math.sin(elapsed * 10 + bulb.phase);
    } else {
      // Zachte Gloed: rustige ademende regenboog
      hue = (elapsed * 0.08 + bulb.phase * 0.1) % 1;
      blink = 0.75 + 0.25 * Math.sin(elapsed * 2.0 + bulb.phase);
    }

    // Als er net op deze kerstboom of dit elfenhuisje is geklikt, geef extra felle glans!
    if (bulb.treeIndex >= 0 && christmasTrees[bulb.treeIndex].userData.boostTimer > 0) {
      blink += 0.8;
    }
    if (bulb.elfHouseIndex >= 0 && elfHouses[bulb.elfHouseIndex].userData.boostTimer > 0) {
      blink += 0.9;
    }
    if (bulb.isWorkshopBulb && workshopGroup.userData.cozyParty) {
      blink += 0.65;
    }
    if (bulb.isCatHouseBulb && catHouseGroup.userData.boostTimer > 0) {
      blink += 0.9;
    }
    if (bulb.isFerrisBulb && villageFerrisWheel.userData.speedBoostTimer > 0) {
      blink += 0.85;
    }
    if (bulb.isStableBulb && reindeerStableGroup.userData.boostTimer > 0) {
      blink += 0.9;
    }

    tempColor.setHSL(hue, 0.88, 0.74);
    bulb.material.color.copy(tempColor);
    bulb.material.emissive.copy(tempColor);
    bulb.material.emissiveIntensity = blink;
  });

  // Laat het centrale Noordpool-licht zachtjes meekleuren met de regenboog
  rainbowPlazaLight.color.setHSL((elapsed * 0.15) % 1, 0.85, 0.75);

  // 4. Kerstbomen die aangeklikt zijn: vrolijke veer- en draai-animatie
  christmasTrees.forEach((tree) => {
    const td = tree.userData;
    td.topStar.rotation.y = elapsed * 1.8;

    if (td.boostTimer > 0) {
      td.boostTimer = Math.max(0, td.boostTimer - delta);
      const bounce = Math.sin(td.boostTimer * 12) * 0.12 * (td.boostTimer / 2.5);
      tree.scale.set(
        td.baseScale * (1 - bounce * 0.4),
        td.baseScale * (1 + bounce),
        td.baseScale * (1 - bounce * 0.4)
      );
      tree.rotation.y += delta * 2.8;
      td.starMat.emissiveIntensity = 1.8;
    } else {
      tree.scale.setScalar(td.baseScale);
      td.starMat.emissiveIntensity = 0.8;
    }
  });

  // 5. Vallende Sneeuw (Particle System) bijwerken
  const posAttr = snowGeo.attributes.position;
  for (let i = 0; i < SNOW_COUNT; i++) {
    let x = posAttr.getX(i);
    let y = posAttr.getY(i);
    let z = posAttr.getZ(i);

    // Vlokje zakt naar beneden en wiebelt zachtjes opzij in de wind
    y -= snowSpeeds[i] * delta;
    x += Math.sin(elapsed * 1.2 + snowPhases[i]) * 0.015;

    // Zodra een sneeuwvlok de grond raakt, begint hij weer bovenaan de lucht
    if (y < -1) {
      y = 27;
      x = (Math.random() - 0.5) * 48;
      z = (Math.random() - 0.5) * 48;
    }

    posAttr.setXYZ(i, x, y, z);
  }
  posAttr.needsUpdate = true;

  // 6. Zelfbewegende Slee + Rendieren in de lucht
  sleighPivot.rotation.y = -elapsed * 0.42; // Vliegt in een grote cirkel
  sleighAndTeam.position.y = Math.sin(elapsed * 2.4) * 0.65; // Deint zachtjes op en neer
  sleighAndTeam.rotation.z = 0.08 + Math.sin(elapsed * 2.4) * 0.06; // Lichte bocht-helling

  reindeerList.forEach((deer) => {
    const phase = deer.userData.phase;
    const stride = elapsed * 6.5 + phase;
    deer.position.y = deer.userData.baseY + Math.sin(stride) * 0.14;
    deer.rotation.x = Math.sin(stride) * 0.11;

    // Vloeiende galop-beweging voor de 4 pootjes
    deer.userData.legs.forEach((leg) => {
      const legPhase = leg.isFront ? stride + leg.side : stride + Math.PI + leg.side;
      leg.pivot.rotation.x = Math.sin(legPhase) * 0.48;
    });

    // Rudolph's neusje gloeit zachtjes op en neer
    if (deer.userData.noseMat) {
      deer.userData.noseMat.emissiveIntensity = 1.35 + Math.sin(elapsed * 4.5) * 0.35;
    }
  });

  // 6B. Rendieren in de knusse stalling (rustig knabbelen / rondkijken + blij sprongetje bij klik)
  const stableData = reindeerStableGroup.userData;
  if (stableData.boostTimer > 0) {
    stableData.boostTimer = Math.max(0, stableData.boostTimer - delta);
  }
  stableReindeerList.forEach((deer) => {
    const dData = deer.userData;
    const t = elapsed + dData.phase;
    if (stableData.boostTimer > 0) {
      const hop = Math.abs(Math.sin(stableData.boostTimer * 8.5 + dData.phase)) * 0.18;
      deer.position.y = dData.baseY + hop;
      deer.rotation.y = dData.baseRotY + Math.sin(stableData.boostTimer * 7.5 + dData.phase) * 0.16;
      dData.headGroup.rotation.x = -0.15 + Math.sin(stableData.boostTimer * 10) * 0.18;
      dData.headGroup.rotation.y = Math.sin(stableData.boostTimer * 8 + dData.phase) * 0.22;
    } else {
      deer.position.y = dData.baseY;
      deer.rotation.y = dData.baseRotY;
      if (dData.mode === 'snack') {
        // Bukt af en toe naar de worteltjes in de voerbak en kauwt zachtjes
        const dip = Math.max(0, Math.sin(t * 1.1));
        dData.headGroup.rotation.x = dip * 0.48 + Math.sin(t * 6.5) * 0.05 * dip;
        dData.headGroup.rotation.y = Math.sin(t * 0.9) * 0.08;
      } else {
        // Kijkt nieuwsgierig en gemoedelijk over het eiland rond
        dData.headGroup.rotation.x = Math.sin(t * 1.6) * 0.07;
        dData.headGroup.rotation.y = Math.sin(t * 0.85) * 0.28;
      }
    }
  });

  // 7. Zelfbewegend Pastel Noorderlicht (Aurora Borealis) laten golven
  auroraRibbons.forEach((ar) => {
    ar.material.uniforms.uTime.value = elapsed;
    const positions = ar.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const bx = ar.basePositions[i * 3];
      const by = ar.basePositions[i * 3 + 1];
      const bz = ar.basePositions[i * 3 + 2];
      const rx = ar.radialNormals[i * 2];
      const rz = ar.radialNormals[i * 2 + 1];
      const phase = ar.vertexPhases[i];
      const wave =
        Math.sin(phase * 5.0 + elapsed * ar.speed + ar.offset) * 1.6 +
        Math.cos(by * 0.25 + elapsed * 0.75) * 0.45;
      positions.setXYZ(i, bx + rx * wave, by, bz + rz * wave);
    }
    positions.needsUpdate = true;
  });

  // 8. Rookpluimpjes uit de schoorsteen van de Werkplaats
  smokePuffs.forEach((sp) => {
    sp.progress = (sp.progress + delta * 0.28) % 1;
    const p = sp.progress;
    // Start positie is bovenop de schoorsteen van de werkplaats
    sp.mesh.position.set(
      1.8 - 2.1 + Math.sin(p * 6 + elapsed) * 0.35,
      7.2 + p * 4.5,
      -4.5 - 1.1 + Math.cos(p * 5 + elapsed) * 0.25
    );
    const scale = 0.5 + p * 1.65;
    sp.mesh.scale.setScalar(scale);
    sp.material.opacity = (1 - p) * 0.65;
  });

  // 9. Klikbare Cadeautjes: animeer het openspringen van de deksels & verrassing
  giftBoxes.forEach((gift) => {
    const gd = gift.userData;
    const target = gd.isOpen ? 1 : 0;
    gd.openProgress += (target - gd.openProgress) * Math.min(1, delta * 9);

    // Klap het deksel tot 115 graden open
    gd.lidPivot.rotation.x = -gd.openProgress * (Math.PI * 0.64);

    // Laat de verrassing uit de doos omhoog poppen en vrolijk ronddraaien
    gd.surpriseGroup.position.y = 0.45 + gd.openProgress * 0.95 + Math.sin(elapsed * 4) * 0.06 * gd.openProgress;
    const sScale = Math.max(0.001, gd.openProgress);
    gd.surpriseGroup.scale.setScalar(sScale);
    gd.surpriseGroup.rotation.y = elapsed * 2.2;

    // Laat de contrasterende binnenvoering zachtjes oplichten zodra het cadeau opengaat
    if (gd.innerMat) {
      gd.innerMat.emissiveIntensity = 0.14 + gd.openProgress * 0.24;
    }
  });

  // 10. Noordpool (90° N) spin & regenboog-schokgolf bij klik
  const npData = northPoleGroup.userData;
  if (npData.spinVelocity > 0.01) {
    poleStripesGroup.rotation.y += npData.spinVelocity * delta;
    npData.spinVelocity *= 0.93;
  }
  if (npData.pulseProgress > 0) {
    npData.pulseProgress += delta * 1.4;
    const s = 1 + npData.pulseProgress * 12;
    northPolePulseRing.scale.setScalar(s);
    northPolePulseRing.material.opacity = Math.max(0, 0.85 * (1 - npData.pulseProgress / 1.5));
    northPolePulseRing.material.color.setHSL((elapsed * 0.5) % 1, 0.9, 0.72);
    if (npData.pulseProgress >= 1.5) {
      npData.pulseProgress = 0;
      northPolePulseRing.material.opacity = 0;
    }
  }

  // 11. Sneeuwpop wiebelt gezellig (en springt als je erop klikt)
  const smData = snowmanGroup.userData;
  if (smData.jumpTime > 0) {
    smData.jumpTime = Math.max(0, smData.jumpTime - delta);
    snowmanGroup.position.y = Math.abs(Math.sin(smData.jumpTime * 7)) * 1.1;
    snowmanGroup.rotation.y = -0.4 + Math.sin(smData.jumpTime * 7) * 0.5;
  } else {
    snowmanGroup.position.y = 0;
    snowmanGroup.rotation.z = Math.sin(elapsed * 2.2) * 0.04;
  }

  // 11B. Realistische witte kerstkat ademt zacht, beweegt haar staart & spitst haar oortjes
  const catData = christmasCatGroup.userData;
  const breath = Math.sin(elapsed * 2.3);
  catData.bodyGroup.scale.set(1 - breath * 0.008, 1 + breath * 0.015, 1 + breath * 0.01);
  if (catData.earPivots && catData.earPivots.length === 2) {
    const twitchL = Math.pow(Math.max(0, Math.sin(elapsed * 2.1)), 28) * 0.18;
    const twitchR = Math.pow(Math.max(0, Math.sin(elapsed * 1.7 + 1.9)), 30) * 0.18;
    catData.earPivots[0].rotation.z = 0.36 + twitchL;
    catData.earPivots[1].rotation.z = -0.36 - twitchR;
  }
  if (catData.jumpTimer > 0) {
    catData.jumpTimer = Math.max(0, catData.jumpTimer - delta);
    const bounce = Math.abs(Math.sin(catData.jumpTimer * 8));
    christmasCatGroup.position.y = catData.baseY + bounce * 0.44;
    christmasCatGroup.rotation.y = catData.baseRotY + Math.sin(catData.jumpTimer * 9) * 0.32;
    catData.tailPivot.rotation.y = Math.sin(elapsed * 16) * 0.45;
    catData.tailPivot.rotation.x = Math.sin(elapsed * 12) * 0.14;
    catData.headPivot.rotation.z = Math.sin(elapsed * 10) * 0.14;
    if (catData.hatGroup) {
      catData.hatGroup.rotation.z = -0.06 + Math.sin(elapsed * 14) * 0.08;
    }
  } else {
    christmasCatGroup.position.y = catData.baseY;
    christmasCatGroup.rotation.y = catData.baseRotY;
    catData.tailPivot.rotation.y = Math.sin(elapsed * 2.8) * 0.24;
    catData.tailPivot.rotation.x = Math.sin(elapsed * 1.9) * 0.07;
    catData.headPivot.rotation.z = Math.sin(elapsed * 1.5) * 0.09;
    catData.headPivot.rotation.y = Math.sin(elapsed * 1.05) * 0.16;
    if (catData.hatGroup) {
      catData.hatGroup.rotation.z = -0.06;
    }
  }

  // 11C. Kattenhuisje naast de werkplaats: belletje & bolletje wol wiebelen en huisje huppelt bij klik
  const chData = catHouseGroup.userData;
  if (chData.boostTimer > 0) {
    chData.boostTimer = Math.max(0, chData.boostTimer - delta);
    const hop = Math.abs(Math.sin(chData.boostTimer * 10)) * 0.22 * (chData.boostTimer / 2.2);
    catHouseGroup.position.y = chData.baseY + hop;
    chData.bellPivot.rotation.z = Math.sin(elapsed * 18) * 0.35;
    chData.yarnPivot.rotation.z = Math.sin(elapsed * 14) * 0.42;
  } else {
    catHouseGroup.position.y = chData.baseY;
    chData.bellPivot.rotation.z = Math.sin(elapsed * 2.2) * 0.08;
    chData.yarnPivot.rotation.z = Math.sin(elapsed * 2.8) * 0.12;
  }

  // 12. Werkplaats: draaiend speelgoedrad, klokkentoren-ster, wiebelende lantaarns & feestmodus
  const wsData = workshopGroup.userData;
  const gearSpeed = wsData.cozyParty ? 2.4 : 0.7;
  wsData.gearGroup.rotation.z -= delta * gearSpeed;
  wsData.cupolaStar.rotation.y = elapsed * (wsData.cozyParty ? 2.6 : 1.0);
  wsData.lanternPivots.forEach((lp, idx) => {
    lp.rotation.z = Math.sin(elapsed * 2.1 + idx * 1.4) * 0.08;
    lp.rotation.x = Math.cos(elapsed * 1.6 + idx) * 0.05;
  });

  if (wsData.cozyParty) {
    wsData.windowMaterial.emissive.setHSL((elapsed * 0.4) % 1, 0.9, 0.65);
    workshopLight.color.setHSL((elapsed * 0.4) % 1, 0.75, 0.72);
    workshopLight.intensity = 1.05;
  } else {
    wsData.windowMaterial.emissive.setHex(0xffd166);
    workshopLight.color.setHex(0xffd28a);
    workshopLight.intensity = 0.82;
  }

  // 13. Elfendorp: huisjes huppelen bij klik en de elfjes wiebelen vrolijk op het pleintje
  elfHouses.forEach((house) => {
    const hd = house.userData;
    if (hd.boostTimer > 0) {
      hd.boostTimer = Math.max(0, hd.boostTimer - delta);
      const hop = Math.abs(Math.sin(hd.boostTimer * 10)) * 0.25 * (hd.boostTimer / 2.0);
      house.position.y = hop;
    } else {
      house.position.y = 0;
    }
  });

  elfCharacters.forEach((elf) => {
    const ed = elf.userData;
    if (ed.throwTimer > 0) {
      ed.throwTimer = Math.max(0, ed.throwTimer - delta);
      const progress = 1 - ed.throwTimer / 0.85;
      const armLift = Math.sin(progress * Math.PI);
      elf.position.y = ed.baseY + armLift * 0.42;
      elf.rotation.y = ed.baseRotY + Math.sin(progress * Math.PI * 2) * 0.35;
      elf.rotation.z = Math.sin(progress * Math.PI * 4) * 0.10;
      if (ed.headPivot) {
        ed.headPivot.rotation.x = -0.2 * armLift;
        ed.headPivot.rotation.y = 0;
        ed.headPivot.rotation.z = 0;
      }
      if (ed.leftArmPivot && ed.rightArmPivot) {
        ed.leftArmPivot.rotation.x = -1.65 * armLift;
        ed.leftArmPivot.rotation.z = -0.35 * armLift;
        ed.rightArmPivot.rotation.x = -1.65 * armLift;
        ed.rightArmPivot.rotation.z = 0.35 * armLift;
      }
    } else {
      elf.position.y = ed.baseY + Math.abs(Math.sin(elapsed * 2.6 + ed.phase)) * 0.032;
      elf.rotation.y = ed.baseRotY;
      elf.rotation.z = Math.sin(elapsed * 2.1 + ed.phase) * 0.035;
      if (ed.headPivot) {
        ed.headPivot.rotation.y = Math.sin(elapsed * 1.15 + ed.phase) * 0.22;
        ed.headPivot.rotation.z = Math.sin(elapsed * 1.8 + ed.phase) * 0.07;
        ed.headPivot.rotation.x = Math.sin(elapsed * 2.2 + ed.phase) * 0.05;
      }
      if (ed.leftArmPivot && ed.rightArmPivot) {
        ed.leftArmPivot.rotation.x = Math.sin(elapsed * 2.4 + ed.phase) * 0.14;
        ed.leftArmPivot.rotation.z = 0;
        if (ed.elfIndex === 2) {
          ed.rightArmPivot.rotation.x = 0;
          ed.rightArmPivot.rotation.z = -0.1 + Math.sin(elapsed * 4.5 + ed.phase) * 0.22;
        } else {
          ed.rightArmPivot.rotation.x = -Math.sin(elapsed * 2.4 + ed.phase) * 0.12;
          ed.rightArmPivot.rotation.z = 0;
        }
      }
    }
  });

  // 14. Pastel roze glitter-fonteinen van aangeklikte elfjes bijwerken
  const glitterDrag = Math.pow(0.45, delta);
  for (let b = glitterBursts.length - 1; b >= 0; b--) {
    const burst = glitterBursts[b];
    burst.age += delta;

    if (burst.age >= burst.maxAge) {
      scene.remove(burst.points);
      burst.geometry.dispose();
      burst.material.dispose();
      glitterBursts.splice(b, 1);
      continue;
    }

    const posAttr = burst.geometry.attributes.position;
    const colAttr = burst.geometry.attributes.color;
    const vel = burst.velocities;
    const baseCols = burst.baseColors;

    for (let i = 0; i < burst.count; i++) {
      const i3 = i * 3;
      const phase = burst.phases[i];

      vel[i3] *= glitterDrag;
      vel[i3 + 2] *= glitterDrag;
      vel[i3 + 1] -= 5.2 * delta;
      if (vel[i3 + 1] < -1.6) vel[i3 + 1] = -1.6;

      let x = posAttr.getX(i) + (vel[i3] + Math.sin(elapsed * 6.5 + phase) * 0.35) * delta;
      let y = posAttr.getY(i) + vel[i3 + 1] * delta;
      let z = posAttr.getZ(i) + (vel[i3 + 2] + Math.cos(elapsed * 5.8 + phase) * 0.35) * delta;

      if (y < 0.06) {
        y = 0.06;
        vel[i3 + 1] = 0;
        vel[i3] *= 0.8;
        vel[i3 + 2] *= 0.8;
      }

      posAttr.setXYZ(i, x, y, z);

      // Laat elk glittertje los van elkaar twinkelen
      const twinkle = 0.72 + 0.38 * Math.sin(elapsed * 18 + phase);
      colAttr.setXYZ(
        i,
        Math.min(1, baseCols[i3] * twinkle),
        Math.min(1, baseCols[i3 + 1] * twinkle),
        Math.min(1, baseCols[i3 + 2] * twinkle)
      );
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    const lifeRatio = burst.age / burst.maxAge;
    burst.material.opacity = lifeRatio > 0.65 ? 1 - (lifeRatio - 0.65) / 0.35 : 1;
  }

  // 15. Vijver naast het Elfendorp: kleine visjes zwemmen rond, waterlelies & rimpels bewegen
  const pondData = elfPondGroup.userData;
  if (pondData.splashTimer > 0) {
    pondData.splashTimer = Math.max(0, pondData.splashTimer - delta);
  }

  pondFishList.forEach((fish) => {
    const angle = elapsed * fish.speed + fish.phase;
    const nextAngle = (elapsed + 0.02) * fish.speed + fish.phase;

    const px = fish.centerX + Math.cos(angle) * fish.orbitRx;
    const pz = fish.centerZ + Math.sin(angle) * fish.orbitRz;
    const nx = fish.centerX + Math.cos(nextAngle) * fish.orbitRx;
    const nz = fish.centerZ + Math.sin(nextAngle) * fish.orbitRz;

    let jumpY = 0;
    let pitch = 0;
    if (pondData.splashTimer > 0) {
      const localT = 1.8 - pondData.splashTimer - fish.jumpDelay;
      if (localT > 0 && localT < 0.75) {
        const p = localT / 0.75;
        jumpY = Math.sin(p * Math.PI) * 0.62;
        pitch = -Math.cos(p * Math.PI) * 0.55;
      }
    }

    fish.group.position.set(
      px,
      fish.baseY + Math.sin(elapsed * 2.5 + fish.phase) * 0.012 + jumpY,
      pz
    );
    fish.group.rotation.y = Math.atan2(nx - px, nz - pz);
    fish.group.rotation.x = pitch;

    // Staartje kwispelt vrolijk heen en weer tijdens het zwemmen
    const wagSpeed = pondData.splashTimer > 0 ? 18 : 10;
    fish.tailPivot.rotation.y = Math.sin(elapsed * wagSpeed + fish.phase) * 0.42;
  });

  pondRipples.forEach((rip) => {
    const rippleSpeed = pondData.splashTimer > 0 ? 0.85 : 0.32;
    rip.progress = (rip.progress + delta * rippleSpeed) % 1;
    const s = 0.7 + rip.progress * 3.0;
    rip.mesh.scale.setScalar(s);
    rip.material.opacity = (1 - rip.progress) * (pondData.splashTimer > 0 ? 0.65 : 0.32);
  });

  pondLilies.forEach((lily) => {
    lily.group.position.y = lily.baseY + Math.sin(elapsed * 1.8 + lily.phase) * 0.012;
    lily.group.rotation.z = Math.sin(elapsed * 1.4 + lily.phase) * 0.04;
  });

  // 15B. Klein Reuzerad naast het Elfendorp: draait rustig rond met rechtopstaande gondels
  const fwData = villageFerrisWheel.userData;
  if (fwData.speedBoostTimer > 0) {
    fwData.speedBoostTimer = Math.max(0, fwData.speedBoostTimer - delta);
  }
  const ferrisSpeed = fwData.speedBoostTimer > 0 ? 1.45 : 0.38;
  fwData.wheelAngle = (fwData.wheelAngle + delta * ferrisSpeed) % (Math.PI * 2);
  fwData.wheelPivot.rotation.z = fwData.wheelAngle;

  ferrisGondolas.forEach((g) => {
    const sway = Math.sin(elapsed * 2.2 + g.phase) * (fwData.speedBoostTimer > 0 ? 0.09 : 0.035);
    g.pivot.rotation.z = -fwData.wheelAngle + sway;
  });

  // 16. Noordpool Express Treintje rond het eiland + stoomwolkjes + draaiende wieltjes
  if (trainState.turboTimer > 0) {
    trainState.turboTimer = Math.max(0, trainState.turboTimer - delta);
  }
  const activeTrainSpeed = trainState.isPaused
    ? 0
    : trainState.baseSpeed * (trainState.turboTimer > 0 ? 2.15 : 1);

  const distMoved = activeTrainSpeed * delta;
  trainState.progress = (trainState.progress + distMoved / TRAIN_TRACK_LENGTH) % 1;

  placeTrainCarriages(trainState.progress);

  // Draai alle wieltjes en drijfstangen exact mee met de afgelegde afstand (zonder te slippen)
  if (distMoved > 0) {
    const wheelDelta = distMoved / trainWheelRadius;
    trainState.wheelAngle = (trainState.wheelAngle + wheelDelta) % (Math.PI * 2);
    trainWheels.forEach((w) => {
      w.rotation.x = trainState.wheelAngle;
    });
    const rodY = trainWheelRadius + Math.cos(trainState.wheelAngle) * 0.075;
    const rodZ = Math.sin(trainState.wheelAngle) * 0.075;
    trainSideRods.forEach((sr) => {
      sr.mesh.position.y = rodY;
      sr.mesh.position.z = rodZ;
    });
  }

  // Laat zachte pastel stoomwolkjes opstijgen vanaf de rijdende locomotief-schoorsteen
  trainLocoGroup.updateMatrixWorld(true);
  const steamRate = trainState.isPaused ? 0.35 : (trainState.turboTimer > 0 ? 1.45 : 0.85);
  trainSteamPuffs.forEach((sp) => {
    const prevP = sp.progress;
    sp.progress = (sp.progress + delta * steamRate) % 1;
    if (sp.progress < prevP) {
      trainChimneyTip.getWorldPosition(sp.origin);
    }
    const p = sp.progress;
    sp.mesh.position.set(
      sp.origin.x + sp.driftX * p + Math.sin(elapsed * 3.5 + p * 4) * 0.08,
      sp.origin.y + p * 1.65,
      sp.origin.z + sp.driftZ * p + Math.cos(elapsed * 3.0 + p * 4) * 0.08
    );
    sp.mesh.scale.setScalar(0.65 + p * 1.9);
    sp.material.opacity = (1 - p) * (trainState.isPaused ? 0.38 : 0.68);
  });

  // Teken het nieuwe frame op het scherm!
  renderer.render(scene, camera);
}

// Start de animatie-loop
animate();

// Pas de camera en renderer automatisch aan als het browservenster groter/kleiner wordt
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
