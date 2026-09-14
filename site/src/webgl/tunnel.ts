import * as THREE from 'three';
import { gsap, ScrollTrigger, reducedMotion } from '../scroll';

/**
 * The rabbit hole. A long earthen cylinder the camera travels down as the page scrolls,
 * with teacups, pocket watches, keys, playing cards and coffee beans drifting past.
 * Renders only while a transparent ".fall" window (or the hero dive) is on screen.
 */

const LENGTH = 360;          // tunnel length in world units
const RADIUS = 6;

const wallVert = /* glsl */`
  varying vec2 vUv; varying vec3 vPos;
  void main(){ vUv = uv; vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;
const wallFrag = /* glsl */`
  precision highp float;
  varying vec2 vUv; varying vec3 vPos;
  uniform float uTime; uniform float uCamZ; uniform vec3 uFog;
  // hash / noise / fbm
  float hash(vec3 p){ p = fract(p*0.3183099+.1); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
  float noise(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }
  float fbm(vec3 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.5; } return v; }
  void main(){
    // wall coordinates: around (vUv.x) and along (vPos.y is the cylinder axis before rotation)
    vec3 p = vec3(vUv.x*14.0, vPos.y*0.35, 0.0);
    float n = fbm(p);
    float strata = smoothstep(0.35,0.65, fract(vPos.y*0.18 + n*0.9));      // earth layers
    float roots = smoothstep(0.62,0.70, fbm(p*2.7+vec3(3.1,0.0,1.7)));        // thin root lines
    vec3 earth = mix(vec3(0.26,0.16,0.09), vec3(0.42,0.27,0.15), n);
    earth = mix(earth, vec3(0.18,0.11,0.06), strata*0.55);
    earth = mix(earth, vec3(0.55,0.40,0.22), roots*0.6);
    // warm lantern glow near the camera, darkness ahead
    float d = abs(vPos.y - uCamZ);
    float lamp = exp(-d*0.09);
    float flicker = 0.92 + 0.08*sin(uTime*7.0 + vPos.y*0.7);
    vec3 col = earth * (0.35 + 1.4*lamp*flicker);
    float fog = 1.0 - exp(-d*0.045);
    col = mix(col, uFog, fog);
    gl_FragColor = vec4(col, 1.0);
  }
`;

type Drift = { mesh: THREE.Object3D; rot: THREE.Vector3; bob: number; phase: number; z: number; r: number; a: number };

export function initTunnel() {
  const canvas = document.getElementById('tunnel') as HTMLCanvasElement;
  const falls = Array.from(document.querySelectorAll<HTMLElement>('.fall'));
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', alpha: false });
  } catch { document.body.classList.add('no-webgl'); return; }
  const lowEnd = (navigator.hardwareConcurrency || 8) < 4 || ((navigator as { deviceMemory?: number }).deviceMemory || 8) < 4;
  if (reducedMotion || lowEnd) { document.body.classList.add('no-webgl'); renderer.dispose(); return; }

  const narrow = innerWidth < 768;
  renderer.setPixelRatio(Math.min(devicePixelRatio, narrow ? 1 : 1.5));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const fogColor = new THREE.Color('#150E09');
  const scene = new THREE.Scene();
  scene.background = fogColor;
  scene.fog = new THREE.FogExp2(fogColor.getHex(), 0.05);
  const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 120);

  // walls
  const wallGeo = new THREE.CylinderGeometry(RADIUS, RADIUS, LENGTH + 40, 56, 1, true);
  const wallMat = new THREE.ShaderMaterial({ vertexShader: wallVert, fragmentShader: wallFrag, side: THREE.BackSide,
    uniforms: { uTime: { value: 0 }, uCamZ: { value: 0 }, uFog: { value: fogColor } } });
  const walls = new THREE.Mesh(wallGeo, wallMat);
  walls.rotation.x = Math.PI / 2;      // axis along z; local y becomes world -z
  walls.position.z = -LENGTH / 2;
  scene.add(walls);

  // lights
  scene.add(new THREE.AmbientLight('#5a3d22', 0.9));
  const lamp = new THREE.PointLight('#f3c77a', 26, 30, 1.6);
  camera.add(lamp); lamp.position.set(0, 0.6, 0.8);
  scene.add(camera);

  // materials
  const porcelain = new THREE.MeshStandardMaterial({ color: '#f5ead6', roughness: 0.35, metalness: 0.05 });
  const gold = new THREE.MeshStandardMaterial({ color: '#d4a44a', roughness: 0.3, metalness: 0.85 });
  const bean = new THREE.MeshStandardMaterial({ color: '#4a2a12', roughness: 0.6 });
  const cardMats = ['♥', '♠', '♦', '♣'].map((s) => {
    const c = document.createElement('canvas'); c.width = 128; c.height = 180;
    const x = c.getContext('2d')!;
    x.fillStyle = '#fbf3e3'; x.fillRect(0, 0, 128, 180);
    x.strokeStyle = '#c9a96a'; x.lineWidth = 4; x.strokeRect(6, 6, 116, 168);
    x.fillStyle = s === '♥' || s === '♦' ? '#b3302a' : '#3e2a1c';
    x.font = '84px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(s, 64, 92);
    x.font = '22px serif'; x.fillText(s, 20, 24); x.fillText(s, 108, 156);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, side: THREE.DoubleSide });
  });

  // prop builders
  const teacup = () => {
    const g = new THREE.Group();
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(new THREE.Vector2(0.28 + t * 0.28 + Math.sin(t * 2.6) * 0.06, t * 0.55)); }
    const cup = new THREE.Mesh(new THREE.LatheGeometry(pts, 28), porcelain);
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.6, 0.05, 32), porcelain); saucer.position.y = -0.02;
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.04, 10, 24, Math.PI * 1.3), porcelain);
    handle.position.set(0.56, 0.3, 0); handle.rotation.z = -Math.PI * 0.35;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.015, 8, 40), gold); rim.rotation.x = Math.PI / 2; rim.position.y = 0.55;
    g.add(cup, saucer, handle, rim); return g;
  };
  const watch = () => {
    const g = new THREE.Group();
    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.12, 36), gold);
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.13, 36), porcelain);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 8, 18), gold); ring.position.y = 0.62;
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.32), bean); hand.position.set(0, 0.07, 0.12);
    const hand2 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.22), bean); hand2.position.set(0.08, 0.07, 0); hand2.rotation.y = Math.PI / 2.6;
    g.add(face, dial, ring, hand, hand2); g.rotation.x = Math.PI / 2; return g;
  };
  const key = () => {
    const g = new THREE.Group();
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.05, 10, 24), gold);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 12), gold); shaft.position.y = -0.62;
    const bit = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.06), gold); bit.position.set(0.12, -0.98, 0);
    const bit2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.06), gold); bit2.position.set(0.1, -0.82, 0);
    g.add(bow, shaft, bit, bit2); return g;
  };
  const card = (i: number) => new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.9), cardMats[i % 4]);
  const coffeeBean = () => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), bean); m.scale.set(1, 0.65, 1.5); return m; };

  // scatter props along the hole
  const drifts: Drift[] = [];
  const rng = (a: number, b: number) => a + Math.random() * (b - a);
  const kinds = [teacup, watch, key, () => card(Math.floor(Math.random() * 4)), coffeeBean, coffeeBean, teacup];
  for (let i = 0; i < (narrow ? 60 : 110); i++) {
    const mesh = kinds[i % kinds.length]();
    const z = -rng(6, LENGTH - 10);
    const a = rng(0, Math.PI * 2);
    const r = rng(1.4, RADIUS - 1.6);
    const s = rng(0.7, 1.5);
    mesh.scale.multiplyScalar(s);
    mesh.position.set(Math.cos(a) * r, Math.sin(a) * r, z);
    mesh.rotation.set(rng(0, 6), rng(0, 6), rng(0, 6));
    scene.add(mesh);
    drifts.push({ mesh, rot: new THREE.Vector3(rng(-0.4, 0.4), rng(-0.4, 0.4), rng(-0.3, 0.3)), bob: rng(0.1, 0.4), phase: rng(0, 6), z, r, a });
  }

  // the signature coffees: studio cut-outs on camera-facing cards, lit by the lamp, each on its wooden board.
  // Every fall window gets the full set once, laid out along the stretch of tunnel that window scrolls through,
  // plus the "Coffee Lovers" badge turning past as a coin.
  const cutouts = [
    { file: 'oporto-latte', w: 610, h: 1024, size: 2.5 },
    { file: 'cappuccino-alice', w: 1024, h: 949, size: 2.2 },
    { file: 'alice-latte', w: 895, h: 1024, size: 2.4 },
    { file: 'iced-alice-caramelo', w: 896, h: 1024, size: 2.4 },
    { file: 'iced-matcha-strawberry', w: 751, h: 1024, size: 2.4 },
    { file: 'iced-matcha-mango', w: 658, h: 1024, size: 2.4 },
  ];
  type Board = { mesh: THREE.Mesh; phase: number; sway: number; tilt: number; fall: number; slot: number; a: number; r: number; coin: boolean };
  const billboards: Board[] = [];
  const loader = new THREE.TextureLoader();
  const cutMat = (file: string) => {
    const tex = loader.load(`${import.meta.env.BASE_URL}img/${file}.webp`);
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    return new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.08, roughness: 0.8, metalness: 0, side: THREE.DoubleSide, depthWrite: false });
  };
  const cutMats = cutouts.map((c) => cutMat('cut/' + c.file));
  const coinMat = cutMat('badge');
  falls.forEach((_, fi) => {
    // a different order and side for each fall so the second descent doesn't replay the first
    const orders = [[0, 3, 1, 4, 2, 5], [4, 1, 5, 0, 3, 2]];
    const order = orders[fi % orders.length];
    order.forEach((ci, slot) => {
      const c = cutouts[ci];
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(c.size * (c.w / c.h), c.size), cutMats[ci]);
      mesh.renderOrder = 2;
      scene.add(mesh);
      billboards.push({ mesh, phase: rng(0, 6), sway: rng(0.04, 0.1), tilt: rng(0.18, 0.3) * (slot % 2 ? 1 : -1), fall: fi, slot,
        a: (slot / (cutouts.length + 1)) * Math.PI * 2 + fi * 1.1 + rng(-0.25, 0.25), r: rng(1.6, 2.7), coin: false });
    });
    const coin = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.7 * (428 / 512)), coinMat);
    coin.renderOrder = 2; scene.add(coin);
    billboards.push({ mesh: coin, phase: rng(0, 6), sway: 0, tilt: 0, fall: fi, slot: cutouts.length,
      a: (cutouts.length / (cutouts.length + 1)) * Math.PI * 2 + fi * 1.1, r: rng(1.4, 2.2), coin: true });
  });
  // where along the hole each fall window looks: camera z at a given scroll position
  const zAtScroll = (y: number) => -(y / Math.max(ScrollTrigger.maxScroll(window), 1)) * (LENGTH - 20);
  const layoutBillboards = () => {
    falls.forEach((f, fi) => {
      const top = f.offsetTop, bottom = top + f.offsetHeight;
      const zFrom = zAtScroll(top - innerHeight * 0.2) - 7;      // just ahead of the camera as the window opens
      const zTo = zAtScroll(bottom - innerHeight * 0.7) - 5;     // still ahead of it as the window closes
      const mine = billboards.filter((b) => b.fall === fi);
      mine.forEach((b) => {
        const t = (b.slot + 0.5) / mine.length;
        b.mesh.position.set(Math.cos(b.a) * b.r, Math.sin(b.a) * b.r, zFrom + (zTo - zFrom) * t);
      });
    });
  };
  ScrollTrigger.addEventListener('refresh', layoutBillboards);
  layoutBillboards();

  // gold motes
  const moteGeo = new THREE.BufferGeometry();
  const N = narrow ? 400 : 900; const arr = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { const a = rng(0, 6.3), r = rng(0.5, RADIUS - 0.3); arr.set([Math.cos(a) * r, Math.sin(a) * r, -rng(0, LENGTH)], i * 3); }
  moteGeo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  const motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({ color: '#f0c56a', size: 0.06, transparent: true, opacity: 0.8, sizeAttenuation: true }));
  scene.add(motes);

  // scroll → camera z across the whole document
  const cam = { z: 0, roll: 0 };
  ScrollTrigger.create({
    trigger: document.documentElement, start: 0, end: () => ScrollTrigger.maxScroll(window),
    onUpdate: (self) => { cam.z = -self.progress * (LENGTH - 20); },
  });

  // render only while a fall window or the hero dive is on screen
  const visible = new Set<Element>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
  }, { threshold: 0 });
  falls.forEach((f) => io.observe(f));
  io.observe(document.getElementById('hero')!);
  io.observe(document.getElementById('bottom')!);

  let t0 = performance.now();
  const clock = { t: 0 };
  gsap.ticker.add(() => {
    if (!visible.size) return;
    const now = performance.now(); const dt = Math.min((now - t0) / 1000, 0.05); t0 = now; clock.t += dt;
    // camera glides after the scroll with a little lag and a slow roll
    camera.position.z += (cam.z - camera.position.z) * 0.08;
    camera.position.x = Math.sin(clock.t * 0.4) * 0.25;
    camera.position.y = Math.cos(clock.t * 0.33) * 0.2;
    camera.rotation.z = Math.sin(camera.position.z * 0.03) * 0.12;
    wallMat.uniforms.uTime.value = clock.t;
    wallMat.uniforms.uCamZ.value = camera.position.z + LENGTH / 2;   // walls' local y = world z + LENGTH/2
    for (const d of drifts) {
      const m = d.mesh;
      m.rotation.x += d.rot.x * dt; m.rotation.y += d.rot.y * dt; m.rotation.z += d.rot.z * dt;
      m.position.x = Math.cos(d.a + clock.t * 0.05) * d.r;
      m.position.y = Math.sin(d.a + clock.t * 0.05) * d.r + Math.sin(clock.t * 0.8 + d.phase) * d.bob;
    }
    for (const b of billboards) {
      b.mesh.quaternion.copy(camera.quaternion);                   // face the camera...
      if (b.coin) {
        b.mesh.rotateY(clock.t * 1.1 + b.phase);                    // ...except the coin, which keeps turning
      } else {
        b.mesh.rotateY(b.tilt + Math.sin(clock.t * 0.5 + b.phase) * 0.08); // ...at a slight angle so the board reads as solid
        b.mesh.rotateZ(Math.sin(clock.t * 0.7 + b.phase) * b.sway);       // and hangs and sways a little
      }
      b.mesh.position.y += Math.sin(clock.t * 0.9 + b.phase) * 0.0025;
    }
    motes.rotation.z = clock.t * 0.02;
    renderer.render(scene, camera);
  });

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
  });

  // whispers inside the fall
  falls.forEach((f) => {
    const w = f.querySelector('.fall__whisper');
    if (!w) return;
    gsap.fromTo(w, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'none',
      scrollTrigger: { trigger: f, start: 'top 20%', end: 'center center', scrub: true } });
    gsap.to(w, { opacity: 0, y: -30, ease: 'none', scrollTrigger: { trigger: f, start: 'center center', end: 'bottom 70%', scrub: true } });
  });
}
