"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type City = { name: string; lon: number; lat: number; w: number; r: number; core?: boolean; pops: number; label?: boolean };
// Real DOL POP districts (new.daffodilnet.com/coverage) — 28 POPs across 15 districts, plus the Dhaka core.
const CITIES: City[] = [
  { name: "Dhaka", lon: 90.41, lat: 23.81, w: 1.0, r: 0.24, core: true, pops: 6, label: true },
  { name: "Brahmanbaria", lon: 91.11, lat: 23.96, w: 0.55, r: 0.13, pops: 4, label: true },
  { name: "Rajshahi", lon: 88.6, lat: 24.37, w: 0.5, r: 0.12, pops: 3, label: true },
  { name: "Bogura", lon: 89.37, lat: 24.85, w: 0.4, r: 0.1, pops: 2, label: true },
  { name: "Kushtia", lon: 89.12, lat: 23.9, w: 0.4, r: 0.1, pops: 2, label: true },
  { name: "Netrokona", lon: 90.73, lat: 24.88, w: 0.4, r: 0.1, pops: 2, label: true },
  { name: "Bhola", lon: 90.65, lat: 22.69, w: 0.28, r: 0.08, pops: 1 },
  { name: "Chandpur", lon: 90.67, lat: 23.23, w: 0.28, r: 0.08, pops: 1 },
  { name: "Chapainawabganj", lon: 88.27, lat: 24.6, w: 0.28, r: 0.08, pops: 1 },
  { name: "Cumilla", lon: 91.18, lat: 23.46, w: 0.28, r: 0.08, pops: 1 },
  { name: "Jashore", lon: 89.21, lat: 23.17, w: 0.28, r: 0.08, pops: 1 },
  { name: "Joypurhat", lon: 89.03, lat: 25.1, w: 0.28, r: 0.08, pops: 1 },
  { name: "Madaripur", lon: 90.19, lat: 23.17, w: 0.28, r: 0.08, pops: 1 },
  { name: "Natore", lon: 88.99, lat: 24.41, w: 0.28, r: 0.08, pops: 1 },
  { name: "Satkhira", lon: 89.07, lat: 22.72, w: 0.28, r: 0.08, pops: 1 },
];
const C_LON = 90.3, C_LAT = 23.7, SCALE = 10, COS = Math.cos((C_LAT * Math.PI) / 180);
const toXZ = (lon: number, lat: number): [number, number] => [(lon - C_LON) * SCALE * COS, -(lat - C_LAT) * SCALE];

function hash(x: number, y: number) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
type Ring = number[][]; type Poly = Ring[];
function inRing(x: number, y: number, ring: Ring) {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
const inside = (lon: number, lat: number, polys: Poly[]) =>
  polys.some((p) => inRing(lon, lat, p[0]) && !p.slice(1).some((h) => inRing(lon, lat, h)));

const PILLAR_VS = /* glsl */ `
  attribute float aH; attribute float aHeat; attribute float aDelay;
  uniform float uGrow; uniform float uTime; uniform vec3 uHover; uniform vec3 uRipple; uniform float uRippleT;
  varying float vY; varying float vHeat; varying float vHover; varying float vH;
  void main() {
    vec4 inst = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    float g = clamp((uGrow - aDelay) / 0.35, 0.0, 1.0); g = 1.0 - pow(1.0 - g, 3.0);
    float hov = smoothstep(2.4, 0.0, distance(inst.xz, uHover.xz));
    float breathe = 1.0 + 0.04 * sin(uTime * 1.4 + inst.x * 0.6 + inst.z * 0.4);
    float rd = distance(inst.xz, uRipple.xz);
    float ring = exp(-pow((rd - uRippleT * 16.0) / 1.4, 2.0)) * exp(-uRippleT * 1.6);
    hov = max(hov, ring);
    float h = aH * g * breathe * (1.0 + hov * 0.9);
    vec3 p = position; p.y = (p.y + 0.5) * h;
    vY = p.y; vH = max(h, 0.0001); vHeat = aHeat; vHover = hov;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(p, 1.0);
  }`;
const PILLAR_FS = /* glsl */ `
  varying float vY; varying float vHeat; varying float vHover; varying float vH;
  float bayer4(vec2 p) {
    vec2 q = floor(mod(p, 4.0)); float i = q.x + q.y * 4.0;
    if (i < 1.0) return 0.0; if (i < 2.0) return 0.5; if (i < 3.0) return 0.125; if (i < 4.0) return 0.625;
    if (i < 5.0) return 0.75; if (i < 6.0) return 0.25; if (i < 7.0) return 0.875; if (i < 8.0) return 0.375;
    if (i < 9.0) return 0.1875; if (i < 10.0) return 0.6875; if (i < 11.0) return 0.0625; if (i < 12.0) return 0.5625;
    if (i < 13.0) return 0.9375; if (i < 14.0) return 0.4375; if (i < 15.0) return 0.8125; return 0.3125;
  }
  void main() {
    float t = clamp(vY / vH, 0.0, 1.0);
    vec3 base = mix(vec3(0.26,0.27,0.27), vec3(0.92,0.93,0.92), t);
    vec3 hot = mix(vec3(0.30,0.04,0.06), vec3(0.89,0.12,0.14), smoothstep(0.0, 0.7, t));
    hot = mix(hot, vec3(1.0,0.82,0.82), smoothstep(0.88, 1.0, t) * 0.7);
    float heat = clamp(smoothstep(0.15, 0.6, vHeat) + smoothstep(2.5, 6.0, vH) * 0.8, 0.0, 1.0);
    vec3 col = mix(base, hot, max(heat, vHover * 0.85)) + vHover * vec3(0.25, 0.03, 0.04);
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    float q = floor(lum * 5.0 + bayer4(gl_FragCoord.xy)) / 5.0;
    col *= q / max(lum, 0.001);
    col *= 0.84 + 0.16 * step(0.5, fract(gl_FragCoord.y * 0.5));
    gl_FragColor = vec4(col, 1.0);
  }`;

export default function HeroMap({ onReady }: { onReady?: (ok: boolean) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const small = innerWidth < 768;

    // Probe first so a missing GPU never throws inside three.js
    const probe = document.createElement("canvas");
    const supported = !!(probe.getContext("webgl2") || probe.getContext("webgl"));
    let renderer: THREE.WebGLRenderer;
    try {
      if (!supported) throw new Error("no webgl");
      renderer = new THREE.WebGLRenderer({ antialias: !small, powerPreference: "high-performance", alpha: true });
    } catch {
      el.dataset.fallback = "1";
      onReady?.(false);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 1.75));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "pan-y";

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b0b0b, 80, 160);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 400);
    const controls = new OrbitControls(camera, renderer.domElement);
    Object.assign(controls, { enableDamping: true, dampingFactor: 0.06, enablePan: false, enableZoom: false, rotateSpeed: 0.55, minPolarAngle: 0.3, maxPolarAngle: 1.15 });
    controls.enabled = !coarse;
    // Stable by default: no auto-rotation; the camera only moves when the user drags (and stays where they leave it).
    controls.autoRotate = false;
    controls.enabled = true;
    Object.assign(controls, { enableZoom: true, minDistance: 55, maxDistance: 150, zoomSpeed: 0.6 });
    renderer.domElement.addEventListener("wheel", (e) => { if (!e.ctrlKey && !e.metaKey) e.stopImmediatePropagation(); }, { capture: true });

    const target = new THREE.Vector3();
    const home = new THREE.Vector3();
    const frame = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Wide screens: map sits right of the headline. Narrow: centred, pulled back.
      const wide = w / h > 1.25;
      target.set(wide ? -20 : -2, 0, wide ? 4 : -2);
      home.copy(target).add(wide ? new THREE.Vector3(46, 42, 78) : new THREE.Vector3(14, 66, 86));
      controls.target.copy(target);
      camera.position.copy(home);
      controls.update();
    };
    frame();
    const ro = new ResizeObserver(frame);
    ro.observe(el);

    const uniforms = { uTime: { value: 0 }, uGrow: { value: reduce ? 1.6 : 0 }, uHover: { value: new THREE.Vector3(9999, 0, 9999) }, uRipple: { value: new THREE.Vector3(9999, 0, 9999) }, uRippleT: { value: 99 } };
    const disposables: { dispose: () => void }[] = [];
    let pillars: THREE.InstancedMesh | null = null;
    type Cell = { x: number; z: number; lon: number; lat: number; near: City; nearD: number };
    let cells: Cell[] = [];
    const markers: { c: City; pos: THREE.Vector3; ring: THREE.Mesh; el: HTMLDivElement }[] = [];
    let hoverCity = "";

    (async () => {
      const polys: Poly[] = await fetch("/bd.json").then((r) => r.json());
      const STEP = small ? 0.045 : 0.03;
      const [dhx, dhz] = toXZ(CITIES[0].lon, CITIES[0].lat);
      const H: number[] = [], HEAT: number[] = [], DEL: number[] = [], POS: number[] = [];
      const dots: number[] = [], dotIn: number[] = [], dotDel: number[] = [];
      let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      for (let lon = 88; lon <= 92.7; lon += STEP) {
        for (let lat = 20.6; lat <= 26.7; lat += STEP) {
          const isIn = inside(lon, lat, polys);
          const [x, z] = toXZ(lon, lat);
          const dist = Math.hypot(x - dhx, z - dhz);
          const gi = Math.round((lon - 88) / STEP), gj = Math.round((lat - 20.6) / STEP);
          if (isIn || (gi % 3 === 0 && gj % 3 === 0)) { dots.push(x, 0.01, z); dotIn.push(isIn ? 1 : 0); dotDel.push(dist / 60); }
          if (!isIn) continue;
          let d = 0.03 + 0.14 * Math.pow(vnoise(lon * 9, lat * 9), 2.2) + 0.5 * Math.pow(vnoise(lon * 47, lat * 47), 6);
          let heat = 0, near = CITIES[0], nearD = 1e9;
          for (const c of CITIES) {
            const dd = Math.hypot((lon - c.lon) * COS, lat - c.lat);
            if (dd < nearD) { nearD = dd; near = c; }
            const k = Math.exp(-(dd * dd) / (2 * c.r * c.r));
            d += c.w * 9 * k;
            heat = Math.max(heat, k * (c.core ? 1 : 0.85));
          }
          if (rnd() > 0.992) d += 1.5 + rnd() * 3.5;
          POS.push(x, z); H.push(0.2 + d * 1.5); HEAT.push(heat); DEL.push(Math.min(dist / 55, 0.65));
          cells.push({ x, z, lon, lat, near, nearD });
        }
      }
      const n = H.length, s = STEP * SCALE * 0.55;
      const geo = new THREE.BoxGeometry(s, 1, s);
      geo.setAttribute("aH", new THREE.InstancedBufferAttribute(new Float32Array(H), 1));
      geo.setAttribute("aHeat", new THREE.InstancedBufferAttribute(new Float32Array(HEAT), 1));
      geo.setAttribute("aDelay", new THREE.InstancedBufferAttribute(new Float32Array(DEL), 1));
      const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: PILLAR_VS, fragmentShader: PILLAR_FS });
      pillars = new THREE.InstancedMesh(geo, mat, n);
      const m = new THREE.Matrix4();
      for (let i = 0; i < n; i++) { m.makeTranslation(POS[i * 2], 0, POS[i * 2 + 1]); pillars.setMatrixAt(i, m); }
      pillars.computeBoundingSphere();
      scene.add(pillars);
      disposables.push(geo, mat);

      // Raised landmass slab: gives the country real thickness under the pillars
      const lightTheme = document.documentElement.dataset.theme === "light";
      const slabMat = new THREE.MeshBasicMaterial({ color: lightTheme ? 0xe6e4de : 0x151515, transparent: true, opacity: 0.92 });
      const edgeMat = new THREE.LineBasicMaterial({ color: lightTheme ? 0x111111 : 0xffffff, transparent: true, opacity: lightTheme ? 0.18 : 0.22 });
      addEventListener("dol:theme", () => { const l = document.documentElement.dataset.theme === "light"; slabMat.color.set(l ? 0xe6e4de : 0x151515); edgeMat.color.set(l ? 0x111111 : 0xffffff); });
      disposables.push(slabMat, edgeMat);
      for (const poly of polys) {
        const ring = poly[0];
        if (!ring || ring.length < 24) continue;
        const shape = new THREE.Shape(ring.map(([lo, la]) => { const [x, z] = toXZ(lo, la); return new THREE.Vector2(x, -z); }));
        const eg = new THREE.ExtrudeGeometry(shape, { depth: 2.4, bevelEnabled: false, curveSegments: 1 });
        const slab = new THREE.Mesh(eg, slabMat);
        slab.rotation.x = -Math.PI / 2; slab.position.y = -2.45;
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(eg, 25), edgeMat);
        slab.add(edges);
        scene.add(slab);
        disposables.push(eg, edges.geometry);
      }

      // Dotted ground
      const dg = new THREE.BufferGeometry();
      dg.setAttribute("position", new THREE.Float32BufferAttribute(dots, 3));
      dg.setAttribute("aIn", new THREE.Float32BufferAttribute(dotIn, 1));
      dg.setAttribute("aDelay", new THREE.Float32BufferAttribute(dotDel, 1));
      const dm = new THREE.ShaderMaterial({
        uniforms, transparent: true, depthWrite: false,
        vertexShader: `attribute float aIn; attribute float aDelay; uniform float uTime; uniform float uGrow; varying float vIn; varying float vA;
          void main(){ vIn=aIn; float r=0.5+0.5*sin(uTime*2.0-aDelay*22.0);
          vA=clamp(uGrow*1.6-aDelay,0.0,1.0)*(aIn>0.5?(0.45+0.4*r):0.16);
          vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize=(aIn>0.5?3.0:1.6)*(60.0/-mv.z)*${renderer.getPixelRatio().toFixed(2)}; gl_Position=projectionMatrix*mv; }`,
        fragmentShader: `varying float vIn; varying float vA; void main(){ vec2 c=gl_PointCoord-0.5; if(dot(c,c)>0.25) discard; gl_FragColor=vec4(vIn>0.5?vec3(0.12,0.6,0.29):vec3(0.35),vA); }`,
      });
      scene.add(new THREE.Points(dg, dm));
      disposables.push(dg, dm);

      // Fibre arcs with a travelling pulse
      const arcMat = new THREE.ShaderMaterial({
        uniforms, transparent: true, depthWrite: false,
        vertexShader: `attribute float aT; varying float vT; void main(){ vT=aT; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `uniform float uTime; uniform float uGrow; varying float vT;
          void main(){ float shown=step(vT,clamp(uGrow*1.4-0.4,0.0,1.0));
          float pulse=smoothstep(0.08,0.0,abs(fract(vT-uTime*0.35)-0.5)-0.42);
          float dash=step(0.5,fract(vT*40.0-uTime*2.0));
          gl_FragColor=vec4(mix(vec3(1.0),vec3(0.89,0.12,0.14),pulse), shown*(0.16+0.3*dash+0.9*pulse)); }`,
      });
      disposables.push(arcMat);
      const core = new THREE.Vector3(dhx, 0.2, dhz);
      CITIES.forEach((c) => {
        const [x, z] = toXZ(c.lon, c.lat);
        const pos = new THREE.Vector3(x, 0, z);
        if (!c.core) {
          const mid = core.clone().lerp(pos, 0.5); mid.y = 6 + core.distanceTo(pos) * 0.35;
          const pts = new THREE.QuadraticBezierCurve3(core, mid, pos.clone().setY(0.2)).getPoints(64);
          const g = new THREE.BufferGeometry().setFromPoints(pts);
          g.setAttribute("aT", new THREE.Float32BufferAttribute(pts.map((_, i) => i / 64), 1));
          scene.add(new THREE.Line(g, arcMat));
          disposables.push(g);
        }
        const rg = new THREE.RingGeometry(c.core ? 0.9 : 0.45, c.core ? 1.15 : 0.6, 40);
        const rm = new THREE.MeshBasicMaterial({ color: c.core ? 0xe31e24 : 0xffffff, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false });
        const ring = new THREE.Mesh(rg, rm);
        ring.rotation.x = -Math.PI / 2; ring.position.set(x, 0.05, z);
        scene.add(ring); disposables.push(rg, rm);
        // coverage radius rings + a light beam rising from each POP
        [2.2, 3.6].forEach((rad, k) => {
          const cg = new THREE.RingGeometry(rad * (c.core ? 1.8 : 1) * 0.98, rad * (c.core ? 1.8 : 1), 64);
          const cm = new THREE.MeshBasicMaterial({ color: 0xe31e24, transparent: true, opacity: 0.22 - k * 0.08, side: THREE.DoubleSide, depthWrite: false });
          const cr = new THREE.Mesh(cg, cm); cr.rotation.x = -Math.PI / 2; cr.position.set(x, 0.04, z); scene.add(cr); disposables.push(cg, cm);
        });
        const bh = c.core ? 22 : 7 + c.pops * 2;
        const bg = new THREE.CylinderGeometry(0.06, 0.18, bh, 8, 1, true);
        const bm = new THREE.MeshBasicMaterial({ color: 0xe31e24, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
        const beam = new THREE.Mesh(bg, bm); beam.position.set(x, bh / 2, z); scene.add(beam); disposables.push(bg, bm);
        const lbl = document.createElement("div");
        lbl.className = "absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-white opacity-0 transition-opacity duration-500 will-change-transform";
        lbl.innerHTML = c.core
          ? `<span class="h-px w-6 bg-white/50"></span><b class="bg-red px-1.5 py-0.5 font-bold">${c.name} core · ${c.pops} POPs</b>`
          : `<span class="h-px w-6 bg-white/50"></span>${c.name}<span class="text-white/50">${c.pops}</span>`;
        lbl.style.transition = "opacity .2s";
        labelsRef.current?.appendChild(lbl);
        markers.push({ c, pos, ring, el: lbl });
      });
      onReady?.(true);
    })();

    // Hover picking (desktop only)
    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2(9, 9);
    let lastPick = -1, needsPick = false;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      needsPick = true;
      if (tipRef.current) tipRef.current.style.transform = `translate(${e.clientX - r.left + 16}px, ${e.clientY - r.top + 16}px)`;
    };
    const onLeave = () => { mouse.set(9, 9); needsPick = true; };
    if (!coarse) { el.addEventListener("pointermove", onMove); el.addEventListener("pointerleave", onLeave); }

    let fly: { t: number; fp: THREE.Vector3; ft: THREE.Vector3; tp: THREE.Vector3; tt: THREE.Vector3 } | null = null;
    const flyTo = (to: THREE.Vector3, dist: number) => {
      const dir = camera.position.clone().sub(controls.target).normalize();
      fly = { t: 0, fp: camera.position.clone(), ft: controls.target.clone(), tt: to.clone(), tp: to.clone().add(dir.multiplyScalar(dist)) };
    };
    const onClick = () => { if (lastPick >= 0) { const c = cells[lastPick]; uniforms.uRipple.value.set(c.x, 0, c.z); uniforms.uRippleT.value = 0; flyTo(new THREE.Vector3(c.x, 0, c.z), 36); } };
    const homeTarget = target.clone();
    const onDbl = () => flyTo(homeTarget, home.distanceTo(homeTarget));
    el.addEventListener("click", onClick);
    el.addEventListener("dblclick", onDbl);
    const onFly = (e: Event) => {
      const name = (e as CustomEvent<string>).detail.toLowerCase();
      const mk = markers.find((m) => m.c.name.toLowerCase().startsWith(name)) ?? (/(dhanmondi|gulshan|mirpur|uttara|banani)/.test(name) ? markers[0] : null);
      if (mk) flyTo(mk.pos, 32);
    };
    addEventListener("dol:fly", onFly);

    // Render only while visible
    let visible = true, raf = 0;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) loop(); }, { threshold: 0 });
    io.observe(el);
    const clock = new THREE.Clock();
    const v = new THREE.Vector3();
    const lean = new THREE.Vector2();
    const loop = () => {
      cancelAnimationFrame(raf);
      if (!visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
      if (!reduce) uniforms.uTime.value = t;
      if (pillars && uniforms.uGrow.value < 1.6) uniforms.uGrow.value = Math.min(1.6, uniforms.uGrow.value + dt * 1.1);
      if (fly) {
        fly.t = Math.min(1, fly.t + dt / 1.1);
        const k = fly.t < 0.5 ? 4 * fly.t ** 3 : 1 - Math.pow(-2 * fly.t + 2, 3) / 2;
        camera.position.lerpVectors(fly.fp, fly.tp, k);
        controls.target.lerpVectors(fly.ft, fly.tt, k);
        if (fly.t === 1) { target.copy(fly.tt); fly = null; }
      }
      if (uniforms.uRippleT.value < 99) uniforms.uRippleT.value += dt;
      if (!fly && !reduce && !coarse) {
        // Lean toward the cursor even without dragging
        const px = mouse.x > 5 ? 0 : mouse.x, py = mouse.y > 5 ? 0 : mouse.y;
        lean.x += (px * 3.5 - lean.x) * 0.05; lean.y += (py * 2.5 - lean.y) * 0.05;
        controls.target.set(target.x - lean.x, 0, target.z + lean.y);
      }
      controls.update();

      if (pillars && needsPick && !fly) {
        needsPick = false;
        ray.setFromCamera(mouse, camera);
        const hit = ray.intersectObject(pillars, false)[0];
        const tip = tipRef.current!;
        if (hit && hit.instanceId != null) {
          const c = cells[hit.instanceId];
          uniforms.uHover.value.set(c.x, 0, c.z);
          if (hit.instanceId !== lastPick) {
            lastPick = hit.instanceId;
            hoverCity = c.near.name;
            const km = Math.round(c.nearD * 111), ok = km < 35 || (c.near.core && km < 25);
            const coreKm = Math.round(Math.hypot((c.lon - CITIES[0].lon) * COS, c.lat - CITIES[0].lat) * 111);
            tip.innerHTML = `<div class="flex items-center justify-between gap-4"><b class="text-[12px] text-white">${c.near.name}</b><span class="text-red">${c.near.pops} POP${c.near.pops > 1 ? "s" : ""}</span></div>
              <div class="mt-1 text-soft">${c.lat.toFixed(2)}°N · ${c.lon.toFixed(2)}°E</div>
              <div class="mt-2 flex justify-between gap-4 border-t border-line-dark pt-2 text-soft"><span>Nearest POP</span><b class="font-medium text-white">~${km} km</b></div>
              <div class="mt-1 flex justify-between gap-4 text-soft"><span>To Dhaka core</span><b class="font-medium text-white">~${coreKm} km · ${Math.max(1, Math.round(coreKm / 60 + 1))} ms</b></div>
              <div class="mt-1 flex justify-between gap-4 text-soft"><span>Services</span><b class="font-medium text-white">${ok ? "Home · Business" : "Business on request"}</b></div>
              <div class="mt-1 flex justify-between gap-4 text-soft"><span>Status</span><b class="font-medium ${ok ? "text-green" : "text-white"}">${ok ? "POP nearby" : "Ask DOL"}</b></div>
              <div class="mt-1.5 flex justify-between border-t border-line-dark pt-1.5 text-soft"><span>Click to zoom</span><span class="text-red">→</span></div>`;
          }
          tip.dataset.on = "1";
          el.style.cursor = "pointer";
        } else {
          uniforms.uHover.value.set(9999, 0, 9999);
          tip.dataset.on = "0";
          lastPick = -1;
          hoverCity = "";
          el.style.cursor = coarse ? "auto" : "grab";
        }
      }
      markers.forEach((mk, i) => {
        if (!reduce) mk.ring.scale.setScalar(1 + 0.25 * Math.sin(t * 2.4 + i));
        v.copy(mk.pos).setY(mk.c.core ? 14 : 4).project(camera);
        const x = (v.x * 0.5 + 0.5) * el.clientWidth, y = (-v.y * 0.5 + 0.5) * el.clientHeight;
        mk.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translateY(-50%)`;
        mk.el.style.opacity = hoverCity === mk.c.name && v.z < 1 ? "1" : "0";
      });
      renderer.render(scene, camera);
    };
    const onVis = () => { if (!document.hidden) loop(); };
    document.addEventListener("visibilitychange", onVis);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      removeEventListener("dol:fly", onFly);
      el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("click", onClick); el.removeEventListener("dblclick", onDbl);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      pillars?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      markers.forEach((m) => m.el.remove());
    };
  }, [onReady]);

  return (
    <div ref={wrap} className="group/map absolute inset-0 [&>canvas]:h-full [&>canvas]:w-full">
      <div ref={labelsRef} className="pointer-events-none absolute inset-0 overflow-hidden" />
      <div
        ref={tipRef}
        data-on="0"
        className="pointer-events-none absolute left-0 top-0 z-10 min-w-[220px] border border-line-strong bg-ink/90 px-3.5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.06em] opacity-0 transition-opacity duration-150 data-[on='1']:opacity-100"
      />
    </div>
  );
}
