"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { BdMap, LAB_PATH, LabsFlat } from "./AIFlatDiagrams";

/**
 * Interactive 3D twin of the planned AI architecture: five floating floors (compute → people) plus a
 * governance tower that spans them. Orbit, hover, click a part to focus it, lift or collapse the floors,
 * expand the GPU chassis and trace a request through the stack. Every part is also an HTML button, so the
 * model works by keyboard and the same list remains if WebGL is unavailable.
 */
type Node = { id: string; label: string; layer: string; level: number; desc: string; spec: string[]; minor?: boolean };
const SERVER = ["96+ physical CPU cores", "1TB ECC memory", "15–20TB local NVMe", "Mirrored boot SSDs"];
const person = (id: string, label: string, desc: string): Node => ({ id, label, layer: "People and institutions", level: 4, desc, spec: ["Role-based access", "Own quota"], minor: true });
const NODES: Node[] = [
  { id: "gpuA", label: "GPU server A", layer: "Compute and data", level: 0, desc: "Independent GPU server built around an 8-GPU-capable chassis, starting with 4 NVIDIA RTX PRO 6000 Blackwell Server Edition 96GB GPUs.", spec: SERVER },
  { id: "gpuB", label: "GPU server B", layer: "Compute and data", level: 0, desc: "A matching second server, so the planned first stage has 8 GPUs in total. Memory is per GPU: this is not one pooled accelerator.", spec: SERVER },
  { id: "storage", label: "Shared storage", layer: "Compute and data", level: 0, desc: "One logical high-availability storage system shared by the platform.", spec: ["100TB+ protected usable", "Expandable to 300TB+", "HA design"] },
  { id: "mgmt", label: "Management", layer: "Compute and data", level: 0, desc: "One logical HA management platform, implemented using 3 small nodes or a validated HA equivalent.", spec: ["3 small nodes", "Separate management access"] },
  { id: "fabric", label: "100GbE fabric", layer: "Compute and data", level: 0, desc: "Redundant 100GbE AI and storage networking. Each server connects to both paths.", spec: ["Redundant paths", "Dual-connected servers"] },
  { id: "backup", label: "Backup", layer: "Compute and data", level: 0, desc: "A separate dedicated backup system with protected copies and tested restoration. A planned recovery copy sits off-site at Dhanmondi. It supports restoration and is not a second live GPU site.", spec: ["Separate system", "Tested restoration", "Off-site copy planned"] },
  { id: "os", label: "Infrastructure OS", layer: "Infrastructure OS", level: 1, desc: "The shared management and orchestration layer. It allocates resources, schedules workloads, monitors health and usage, and supports accountable recovery.", spec: ["Scheduling", "Monitoring", "Usage", "Recovery"] },
  { id: "knowledge", label: "Permitted knowledge", layer: "AI and knowledge services", level: 2, desc: "Permission-aware retrieval that selects only the institutional material a user is allowed to access.", spec: ["Permission-aware", "Grounded answers"] },
  { id: "routing", label: "Model routing", layer: "AI and knowledge services", level: 2, desc: "Sends each approved task to an approved model and processing location, with resource controls.", spec: ["Approved routes", "Local first"] },
  { id: "models", label: "Approved models", layer: "AI and knowledge services", level: 2, desc: "Selected, registered models served for approved tasks.", spec: ["Registered", "Controlled resources"] },
  { id: "assistants", label: "Department assistants", layer: "Applications and integrations", level: 3, desc: "Assistants that bring AI capability into each department's existing work.", spec: ["Policy search", "Document drafting"] },
  { id: "research", label: "Research environments", layer: "Applications and integrations", level: 3, desc: "Isolated environments for reproducible experiments on permitted datasets.", spec: ["Isolated", "Compute reservations"] },
  { id: "apis", label: "Approved APIs", layer: "Applications and integrations", level: 3, desc: "Approved APIs connect AI capability to existing applications and workflows, which keep their owners.", spec: ["Approved integrations", "Owners retained"] },
  person("students", "Students", "Supervised exercises, coding help and projects in the planned AI Labs."),
  person("faculty", "Faculty", "Teaching, supervision and reviewed paths for promising projects."),
  person("researchers", "Researchers", "Reproducible experiments, permitted datasets and compute reservations."),
  person("hr", "HR", "Policy search and document drafting, limited to the user's responsibilities."),
  person("accounts", "Accounts", "Document help and summaries. Financial approvals stay with authorized people."),
  person("dol", "DOL", "Knowledge support, service-desk drafting and operational analysis."),
  person("concerns", "Concerns", "Business-specific assistants and approved integrations for Daffodil concerns."),
  person("security", "Security", "Supervised research on approved evidence, with human-reviewed findings."),
  { id: "future", label: "Future enterprise", layer: "Future enterprise services", level: 4, desc: "Selected external tenants can be considered only after internal acceptance, isolation, support and commercial readiness are demonstrated.", spec: ["After internal acceptance", "Tenant isolation", "Support readiness"] },
  { id: "identity", label: "Identity", layer: "Across every layer", level: 4, desc: "Every user is authenticated, with access suited to their role and purpose.", spec: ["Least privilege"], minor: true },
  { id: "permissions", label: "Permissions", layer: "Across every layer", level: 3, desc: "Checked when knowledge is retrieved, when an answer is delivered and when an action runs. The model cannot grant itself access.", spec: ["Checked independently"], minor: true },
  { id: "approval", label: "Approval", layer: "Across every layer", level: 2, desc: "Sensitive data onboarding, production model releases and high-impact actions remain subject to responsible human approval.", spec: ["Human approval"], minor: true },
  { id: "audit", label: "Audit", layer: "Across every layer", level: 1, desc: "Access, model, routing and usage metadata support accountability.", spec: ["Usage metadata", "Defined retention"], minor: true },
  { id: "recovery", label: "Recovery", layer: "Across every layer", level: 0, desc: "Protected backups and recovery exercises, with recovery decisions subject to human approval.", spec: ["Recovery exercises"], minor: true },
  { id: "labA", label: "AI Lab A", layer: "Isolated academic zone", level: 0, desc: "A planned lab with 25 students and 1 instructor. Lab PCs stay standard: GPU time comes through accounts and quotas.", spec: ["26 seats", "Resettable environments"] },
  { id: "labB", label: "AI Lab B", layer: "Isolated academic zone", level: 0, desc: "A second planned lab with 25 students and 1 instructor, sharing the same academic GPU pool.", spec: ["26 seats", "Resettable environments"] },
  { id: "pool", label: "Shared academic GPU pool", layer: "Isolated academic zone", level: 0, desc: "Two H200 NVL-class GPUs, or a validated equivalent, kept separate from the eight production GPUs.", spec: ["2 × H200 NVL-class", "Separate from production"] },
  ...LAB_PATH.map((label, i): Node => ({ id: `step${i}`, label, layer: "From lab to real use", level: 0, desc: "Every promotion is owned, mentored, isolated and auditable. No student project receives unrestricted production access.", spec: [`Step ${i + 1} of 6`], minor: true })),
  { id: "bangladesh", label: "Bangladesh", layer: "Future pathway", level: 0, desc: "Prove value inside Daffodil first. Then explore selected enterprise services for Bangladesh, as capacity and readiness allow. Illustrative, not current service coverage.", spec: ["Subject to readiness"] },
];
const LAB_IDS = ["labA", "labB", "pool", ...LAB_PATH.map((_, i) => `step${i}`)];
const PEOPLE_IDS = ["students", "faculty", "researchers", "hr", "accounts", "dol", "concerns", "security"];
const GOV_IDS = ["identity", "permissions", "approval", "audit", "recovery"];
const TOUR = [
  { n: "Foundation", t: "Existing foundation. Planned compute.", b: "Daffodil's data-center and connectivity experience is the base. Two planned GPU servers start with eight GPUs, with a pathway to sixteen.", ids: ["gpuA", "gpuB", "storage", "mgmt", "fabric", "backup"] },
  { n: "Operating layer", t: "Infrastructure OS, models and permitted knowledge.", b: "A shared operating layer is designed to schedule work and watch health and usage. Approved models and permission-aware knowledge sit above it.", ids: ["os", "knowledge", "routing", "models"] },
  { n: "People", t: "People, institutions and useful applications.", b: "Students, researchers, departments and Daffodil businesses are intended to reach AI through approved applications, each with access suited to their role.", ids: [...PEOPLE_IDS, "assistants", "research", "apis"] },
  { n: "AI Labs", t: "Learn, research, build. Adopt what proves useful.", b: "Two planned AI Labs share an isolated pool of two H200 NVL-class GPUs. Promising student projects reach real use only through review, approval and an isolated pilot.", ids: null },
  { n: "Governance", t: "Designed to check every request.", b: "In the planned design, identity and permissions come first. Actions need their own authorization, important ones need a person's approval, and protected copies support recovery.", ids: [...GOV_IDS, "backup"] },
  { n: "Pathway", t: "First for Daffodil. Next, for Bangladesh.", b: "Prove value inside Daffodil first. Then explore selected enterprise services for Bangladesh, as capacity and readiness allow.", ids: null },
];
const BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));
const LAYERS = ["Compute", "Infrastructure OS", "AI services", "Applications", "People"];
const TRACE: [string, string][] = [["hr", "A staff member asks a question"], ["identity", "Identity is verified"], ["assistants", "The department assistant takes it"], ["permissions", "Purpose and permissions are checked"], ["knowledge", "Only permitted documents are selected"], ["routing", "An approved route is chosen"], ["models", "A registered model answers"], ["os", "The OS schedules the work"], ["gpuA", "It runs locally on the GPUs"], ["audit", "Access and usage are recorded"]];

const LEVEL_Y = [0, 4.6, 8.2, 11.6, 15];
const GOV_LEVEL = ["recovery", "audit", "approval", "permissions", "identity"];
const CAM = new THREE.Vector3(27, 26, 40);
const HOME = new THREE.Vector3(1.5, 8, 0);
const ease = (a: number, b: number, k: number) => a + (b - a) * k;
const theme = () => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
const PAL = {
  dark: { body: 0x25252a, top: 0x34343a, deep: 0x0e0e10, edge: 0x63636a, slab: 0x18181b, ghost: 0x77777d, grid: 0x303035, amb: 1.1, sun: 2.2 },
  light: { body: 0xf7f6f2, top: 0xffffff, deep: 0x1c1c20, edge: 0xa9a69d, slab: 0xffffff, ghost: 0x8a877f, grid: 0xd6d4cc, amb: 1.9, sun: 1.8 },
};
type Kind = "body" | "top" | "deep" | "red" | "ghost" | "slab";
type Mat = { m: THREE.Material; base: number };
type Part = { id: string; level: number; g: THREE.Group; mats: Mat[]; meshes: THREE.Mesh[]; anchor: THREE.Vector3; hot: number; dim: number };

export default function AIInfra3D() {
  const [sel, setSel] = useState<string | null>(null);
  const [lifted, setLifted] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [layer, setLayer] = useState<number | null>(null);
  const [trace, setTrace] = useState(-1);
  const [failed, setFailed] = useState(false);
  const [view, setView] = useState<"3d" | "2d">("3d");
  const [scene, setScene] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef<Record<string, HTMLButtonElement | null>>({});
  const live = useRef({ sel: null as string | null, hover: null as string | null, lifted: true, expanded: false, layer: null as number | null, tracing: false, scene: null as number | null, zoom: 1, resetAt: 0 });

  const active = trace >= 0 ? TRACE[trace][0] : sel;
  useEffect(() => { Object.assign(live.current, { sel: active, hover, lifted, expanded, layer, tracing: trace >= 0, scene }); }, [active, hover, lifted, expanded, layer, trace, scene]);
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => { if (scene === null || scene >= TOUR.length - 1) setPlaying(false); else setScene(scene + 1); }, 7000);
    return () => clearTimeout(t);
  }, [playing, scene]);
  const openScene = (i: number | null) => { setSel(null); setLayer(null); setTrace(-1); setScene(i); if (i === null) setPlaying(false); };

  useEffect(() => {
    if (trace < 0) return;
    const t = setTimeout(() => setTrace(trace + 1 < TRACE.length ? trace + 1 : -1), 1500);
    return () => clearTimeout(t);
  }, [trace]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { setFailed(true); setView("2d"); return; }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.className = "absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing";
    el.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, 1, 1, 300);
    camera.position.copy(CAM);
    const ambient = new THREE.HemisphereLight(0xffffff, 0x777777, 1);
    const sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.position.set(-14, 34, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, far: 90 });
    sun.shadow.bias = -0.0006;
    scene.add(ambient, sun);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(HOME);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.enableZoom = false; controls.enablePan = false;
    controls.minPolarAngle = 0.5; controls.maxPolarAngle = 1.5;
    controls.autoRotate = !reduce; controls.autoRotateSpeed = 0.35;
    renderer.domElement.style.touchAction = "pan-y"; // a vertical swipe still scrolls the page

    /* ---------- materials and builders ---------- */
    const allMats: { m: THREE.Material; kind: Kind | "edge" | "grid" }[] = [];
    const paint = () => {
      const p = PAL[theme()];
      ambient.intensity = p.amb; sun.intensity = p.sun;
      for (const { m, kind } of allMats) {
        const c = (m as THREE.MeshStandardMaterial).color;
        if (kind === "body") c.setHex(p.body); else if (kind === "top") c.setHex(p.top); else if (kind === "deep") c.setHex(p.deep);
        else if (kind === "edge") c.setHex(p.edge); else if (kind === "ghost") c.setHex(p.ghost); else if (kind === "slab") c.setHex(p.slab); else if (kind === "grid") c.setHex(p.grid);
      }
    };
    const parts: Record<string, Part> = {};
    const levels = LEVEL_Y.map(() => { const g = new THREE.Group(); scene.add(g); return g; });
    const part = (id: string, x: number, y: number, z: number, anchorY: number) => {
      const g = new THREE.Group(); g.position.set(x, y, z);
      const level = BY_ID[id].level;
      if (!GOV_LEVEL.includes(id)) levels[level].add(g);
      const p: Part = { id, level, g, mats: [], meshes: [], anchor: new THREE.Vector3(0, anchorY, 0), hot: 0, dim: 0 };
      parts[id] = p; return p;
    };
    const track = <T extends THREE.Material>(p: Part | null, m: T, kind: Kind | "edge" | "grid", base = 1) => { allMats.push({ m, kind }); if (p) p.mats.push({ m, base }); return m; };
    const material = (p: Part, kind: Kind) => {
      if (kind === "red") return track(p, new THREE.MeshStandardMaterial({ color: 0xe31e24, emissive: 0xe31e24, emissiveIntensity: 0.9, roughness: 0.4 }), kind);
      if (kind === "ghost") return track(p, new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.07, depthWrite: false }), kind, 0.07);
      if (kind === "slab") return track(p, new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.72, roughness: 0.35, metalness: 0.1, emissive: 0xe31e24, emissiveIntensity: 0 }), kind, 0.72);
      return track(p, new THREE.MeshStandardMaterial({ roughness: kind === "deep" ? 0.35 : 0.62, metalness: kind === "deep" ? 0.5 : 0.08, emissive: 0xe31e24, emissiveIntensity: 0 }), kind);
    };
    const mesh = (p: Part, geo: THREE.BufferGeometry, kind: Kind, x: number, y: number, z: number, edges = true, parent: THREE.Object3D = p.g) => {
      const m = new THREE.Mesh(geo, material(p, kind));
      m.position.set(x, y, z);
      m.castShadow = kind !== "ghost" && kind !== "slab";
      m.receiveShadow = true;
      m.userData.id = p.id;
      parent.add(m); p.meshes.push(m);
      if (edges) {
        const dashed = kind === "ghost";
        const lm = dashed ? new THREE.LineDashedMaterial({ dashSize: 0.12, gapSize: 0.09, transparent: true }) : new THREE.LineBasicMaterial({ transparent: true });
        const l = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), track(p, lm, "edge"));
        if (dashed) l.computeLineDistances();
        m.add(l);
      }
      return m;
    };
    const box = (p: Part, w: number, h: number, d: number, kind: Kind, x: number, y: number, z: number, parent?: THREE.Object3D) => mesh(p, new THREE.BoxGeometry(w, h, d), kind, x, y + h / 2, z, true, parent);
    const dash = (a: THREE.Vector3, b: THREE.Vector3, parent: THREE.Object3D, p: Part | null = null) => {
      const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), track(p, new THREE.LineDashedMaterial({ dashSize: 0.28, gapSize: 0.2, transparent: true }), "edge"));
      l.computeLineDistances(); parent.add(l);
    };

    /* ---------- floor 0: compute ---------- */
    const floor = new THREE.Mesh(new THREE.BoxGeometry(27, 0.3, 11.5), track(null, new THREE.MeshStandardMaterial({ roughness: 0.8 }), "slab"));
    floor.position.set(0.5, -0.15, 0); floor.receiveShadow = true; levels[0].add(floor);
    const grid = new THREE.GridHelper(27, 27, 0, 0);
    grid.scale.z = 11.5 / 27; grid.position.set(0.5, 0.01, 0);
    (grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = 0.7;
    allMats.push({ m: grid.material as THREE.Material, kind: "grid" });
    levels[0].add(grid);
    const fans: THREE.Object3D[] = [];
    const expansions: { ghost: THREE.Object3D; real: THREE.Group; k: number }[] = [];
    const gpuServer = (id: string, x: number) => {
      const p = part(id, x, 0, -0.4, 2.3);
      box(p, 6.2, 0.35, 4.3, "body", 0, 0, 0);
      box(p, 6.2, 0.9, 0.18, "body", 0, 0.35, -2.05);
      box(p, 0.14, 0.9, 4.3, "body", -3.03, 0.35, 0); box(p, 0.14, 0.9, 4.3, "body", 3.03, 0.35, 0);
      const card = (parent: THREE.Object3D, cx: number) => {
        box(p, 0.52, 1.35, 3.3, "deep", cx, 0.35, 0, parent);
        box(p, 0.54, 0.08, 3.3, "red", cx, 1.7, 0, parent);
        const fan = mesh(p, new THREE.TorusGeometry(0.17, 0.035, 8, 24), "red", cx, 1.05, 1.67, false, parent);
        fans.push(fan);
        const blade = mesh(p, new THREE.BoxGeometry(0.28, 0.05, 0.02), "body", 0, 0, 0, false, fan);
        blade.castShadow = false;
      };
      for (let i = 0; i < 8; i++) {
        const cx = -2.52 + i * 0.72;
        if (i < 4) { card(p.g, cx); continue; }
        const ghost = box(p, 0.52, 1.35, 3.3, "ghost", cx, 0.35, 0);
        const real = new THREE.Group(); real.position.y = 0.35; real.scale.y = 0.001; real.visible = false; p.g.add(real);
        real.position.y = 0; card(real, cx);
        expansions.push({ ghost, real, k: 0 });
      }
      return p;
    };
    gpuServer("gpuA", -9.2); gpuServer("gpuB", -2.4);
    const st = part("storage", 3.4, 0, -0.4, 3.1);
    for (let i = 0; i < 4; i++) {
      box(st, 3.6, 0.58, 3.5, "body", 0, 0.04 + i * 0.66, 0);
      box(st, 3.3, 0.3, 0.03, "deep", 0, 0.18 + i * 0.66, 1.76);
      for (let k = 0; k < 6; k++) mesh(st, new THREE.BoxGeometry(0.1, 0.05, 0.03), k % 2 ? "body" : "red", -1.35 + k * 0.54, 0.33 + i * 0.66, 1.79, false);
    }
    const mg = part("mgmt", 8.3, 0, -0.4, 2.5);
    for (let i = 0; i < 3; i++) {
      box(mg, 1.12, 1.9, 3, "body", -1.28 + i * 1.28, 0, 0);
      box(mg, 0.8, 0.09, 0.03, "red", -1.28 + i * 1.28, 1.45, 1.52);
      box(mg, 0.8, 0.5, 0.03, "deep", -1.28 + i * 1.28, 0.5, 1.52);
    }
    const fb = part("fabric", 0, 0, 3.75, 0.9);
    [-0.3, 0.42].forEach((dz, i) => { box(fb, 22.4, 0.14, 0.2, "red", -1.2, 0.08 + i * 0.1, dz); });
    [-9.2, -2.4, 3.4, 8.3].forEach((x) => { [-0.3, 0.42].forEach((dz, i) => { if (i === 0 || x < 0) box(fb, 0.08, 0.1, 1.65 + dz, "red", x + (dz > 0 ? 0.4 : -0.4), 0.14, -(1.65 + dz) / 2 + dz); }); });
    const bk = part("backup", 12.2, 0, 2.6, 2.1);
    box(bk, 2.2, 1.7, 2.5, "ghost", 0, 0, 0);
    box(bk, 1.4, 0.65, 1.7, "body", 0, 0, 0);
    dash(new THREE.Vector3(10, 0.2, 3.5), new THREE.Vector3(11.1, 0.2, 3.3), levels[0], bk);
    dash(new THREE.Vector3(12.2, 0.2, 3.9), new THREE.Vector3(12.2, 0.2, 9), levels[0], bk);

    /* ---------- floors 1–3 ---------- */
    const osP = part("os", 0.5, 0, 0, 1.1);
    box(osP, 25, 0.42, 8, "slab", 0, 0, 0);
    box(osP, 23.8, 0.05, 0.1, "red", 0, 0.42, 3.4);
    [-8.7, -2.9, 2.9, 8.7].forEach((x) => { box(osP, 5, 0.22, 4.2, "body", x, 0.42, -0.6); for (let i = 0; i < 4; i++) box(osP, 3.8 - i * 0.7, 0.03, 0.17, i ? "deep" : "red", x - i * 0.35, 0.64, -1.8 + i * 0.75); });
    const plate = (lv: number) => { const m = new THREE.Mesh(new THREE.BoxGeometry(25, 0.14, 7.5), track(null, new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.28, depthWrite: false }), "slab")); m.position.set(0.5, -0.07, 0); levels[lv].add(m); const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), track(null, new THREE.LineBasicMaterial(), "edge")); m.add(e); };
    [2, 3, 4].forEach(plate);
    const xs = [-7.4, 0.5, 8.4];
    const kn = part("knowledge", xs[0], 0, 0, 2.6);
    box(kn, 6, 0.25, 4.6, "body", 0, 0, 0);
    [0, 1, 2, 3, 4, 5, 6].forEach((i) => box(kn, 0.5, 1.15 + (i % 3) * 0.22, 3, i === 3 ? "red" : i % 2 ? "deep" : "top", -2.2 + i * 0.73, 0.25, 0));
    const rt = part("routing", xs[1], 0, 0, 2.6);
    box(rt, 6, 0.25, 4.6, "body", 0, 0, 0);
    mesh(rt, new THREE.CylinderGeometry(0.75, 0.9, 1.2, 8), "deep", 0, 0.85, 0);
    mesh(rt, new THREE.CylinderGeometry(0.42, 0.42, 0.1, 24), "red", 0, 1.5, 0, false);
    [[-2.2, -1.5], [2.2, -1.5], [-2.2, 1.5], [2.2, 1.5]].forEach(([x, z]) => {
      box(rt, 1, 0.6, 1, "top", x, 0.25, z);
      const len = Math.hypot(x, z); const arm = box(rt, len, 0.06, 0.08, "red", x / 2, 0.55, z / 2); arm.rotation.y = -Math.atan2(z, x);
    });
    const md = part("models", xs[2], 0, 0, 2.5);
    box(md, 6, 0.25, 4.6, "body", 0, 0, 0);
    box(md, 3.2, 0.7, 3.2, "deep", 0, 0.25, 0); box(md, 1.6, 0.14, 1.6, "red", 0, 0.95, 0);
    for (let i = 0; i < 6; i++) { box(md, 0.12, 0.08, 0.5, "top", -1.25 + i * 0.5, 0.45, 1.85); box(md, 0.12, 0.08, 0.5, "top", -1.25 + i * 0.5, 0.45, -1.85); box(md, 0.5, 0.08, 0.12, "top", 1.85, 0.45, -1.25 + i * 0.5); box(md, 0.5, 0.08, 0.12, "top", -1.85, 0.45, -1.25 + i * 0.5); }
    const as = part("assistants", xs[0], 0, 0, 2.5);
    box(as, 6, 0.25, 4.6, "body", 0, 0, 0);
    [[-1.4, -0.9], [1.4, -0.9], [-1.4, 1.1], [1.4, 1.1]].forEach(([x, z], i) => { box(as, 2.3, 0.7, 1.6, i === 1 ? "deep" : "top", x, 0.25, z); box(as, 1.5, 0.05, 0.16, "red", x, 0.95, z - 0.3); box(as, 1, 0.05, 0.12, "body", x, 0.95, z + 0.2); });
    const re = part("research", xs[1], 0, 0, 3);
    box(re, 6, 0.25, 4.6, "body", 0, 0, 0);
    mesh(re, new THREE.ConeGeometry(0.95, 1.5, 24), "deep", -1.2, 1, 0);
    mesh(re, new THREE.CylinderGeometry(0.32, 0.32, 0.8, 16), "deep", -1.2, 2, 0);
    mesh(re, new THREE.CylinderGeometry(0.6, 0.86, 0.25, 24), "red", -1.2, 0.5, 0, false);
    [0, 1, 2].forEach((i) => { box(re, 1.8, 0.5, 0.8, i === 1 ? "deep" : "top", 1.4, 0.25 + i * 0.55, 0); });
    const ap = part("apis", xs[2], 0, 0, 2.4);
    box(ap, 6, 0.25, 4.6, "body", 0, 0, 0);
    box(ap, 4, 0.75, 2.4, "top", 0, 0.25, 0);
    for (let i = 0; i < 6; i++) { box(ap, 0.42, 0.34, 0.03, "deep", -1.45 + i * 0.58, 0.45, 1.21); box(ap, 0.1, 0.08, 1.3, "red", -1.45 + i * 0.58, 0.5, 1.9); }

    /* ---------- floor 4: people, future tenants ---------- */
    const pods = ["students", "faculty", "researchers", "hr", "accounts", "dol", "concerns", "security"];
    pods.forEach((id, i) => {
      const p = part(id, -9.8 + i * 2.95, 0, 0, 2.5);
      mesh(p, new THREE.CylinderGeometry(1.1, 1.25, 0.25, 32), "body", 0, 0.13, 0);
      mesh(p, new THREE.CylinderGeometry(0.42, 0.62, 0.95, 24), "deep", 0, 0.75, 0, false);
      mesh(p, new THREE.SphereGeometry(0.34, 24, 16), "top", 0, 1.56, 0, false);
      mesh(p, new THREE.TorusGeometry(1.0, 0.03, 8, 48), "red", 0, 0.27, 0, false).rotation.x = Math.PI / 2;
    });
    const fu = part("future", -13.4, 0, 0, 2.5);
    box(fu, 3, 1.6, 4, "ghost", 0, 0, 0);
    box(fu, 1.8, 0.4, 2.8, "ghost", 0, 1.6, 0);

    /* ---------- governance tower ---------- */
    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1, 0.18), track(null, new THREE.MeshStandardMaterial({ roughness: 0.5 }), "body"));
    spine.position.set(16.2, 0, 0); scene.add(spine);
    const govParts = GOV_LEVEL.map((id, i) => {
      const p = part(id, 16.2, 0, 0, 1.3);
      box(p, 2.6, 0.95, 2.6, "body", 0, 0, 0);
      box(p, 2.1, 0.06, 2.1, "red", 0, 0.95, 0);
      scene.add(p.g);
      dash(new THREE.Vector3(13.2, 0.2, 0), new THREE.Vector3(14.9, 0.2, 0), levels[i]);
      return p;
    });

    /* ---------- AI Labs: shown in the tour's lab scene ---------- */
    const labGroups: THREE.Group[] = [];
    const room = (id: string, x: number) => {
      const p = part(id, x, 0, -3, 1.4); labGroups.push(p.g);
      box(p, 8.6, 0.2, 8, "body", 0, 0, 0);
      box(p, 3, 0.5, 0.8, "red", 0, 0.2, -3.2);
      for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { box(p, 1.15, 0.28, 0.72, "top", -3.2 + i * 1.6, 0.2, -1.9 + j * 1.2); box(p, 0.8, 0.34, 0.04, "deep", -3.2 + i * 1.6, 0.48, -2.1 + j * 1.2); }
    };
    room("labA", -37); room("labB", -27);
    const pl = part("pool", -32, 0, 5.2, 3); labGroups.push(pl.g);
    box(pl, 21, 0.06, 19, "ghost", 0, 0, -5.6);
    box(pl, 7, 0.3, 3.2, "body", 0, 0, 0);
    [-1, 1].forEach((d) => { box(pl, 1.5, 2, 2.4, "deep", d, 0.3, 0); box(pl, 1.52, 0.1, 2.4, "red", d, 2.3, 0); });
    [-37, -27].forEach((x) => { const dir = x < -32 ? 1 : -1; box(pl, 0.1, 0.06, 2.6, "red", x + 32, 0.1, -2.6); box(pl, 5 - 2.4, 0.06, 0.1, "red", (x + 32) + dir * 1.3, 0.1, -1.3); });
    LAB_PATH.forEach((_, i) => {
      const p = part(`step${i}`, -36 + i * 8.6, 0, 12.5, 1.5); labGroups.push(p.g);
      box(p, 7, 0.75, 2.6, i === 0 ? "red" : "body", 0, 0, 0);
      if (i < 5) box(p, 1.6, 0.06, 0.1, "red", 4.3, 0.3, 0);
      if (i === 0) box(p, 0.1, 0.06, 5, "red", 0, 0.3, -3.8);
      if (i === 5) { box(p, 0.16, 0.08, 5.6, "red", 0, 0.3, -4.1); const c = mesh(p, new THREE.ConeGeometry(0.42, 0.9, 16), "red", 0, 0.34, -7.2, false); c.rotation.x = -Math.PI / 2; }
    });
    /* ---------- Bangladesh: shown in the tour's pathway scene ---------- */
    const bdP = part("bangladesh", 37, 0, 0, 3); bdP.g.visible = false; labGroups.forEach((g) => { g.visible = false; });
    const Z3 = 3.1, PL = 90.3, PA = 23.7;
    const toBd = (lon: number, lat: number) => [(lon - PL) * Z3, (lat - PA) * Z3];
    let disposed = false;
    fetch("/bd.json").then((r) => r.json()).then((polys: number[][][][]) => {
      if (disposed) return;
      polys.forEach((poly) => {
        const shape = new THREE.Shape(poly[0].map(([x, y]) => { const [a, b] = toBd(x, y); return new THREE.Vector2(a, b); }));
        const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: false }); geo.rotateX(-Math.PI / 2);
        mesh(bdP, geo, "body", 0, 0, 0, false);
      });
    }).catch(() => {});
    const [pinX, pinY] = toBd(90.32, 23.89);
    mesh(bdP, new THREE.CylinderGeometry(0.28, 0.1, 1.6, 16), "red", pinX, 1.3, -pinY, false);
    mesh(bdP, new THREE.TorusGeometry(1.1, 0.04, 8, 48), "red", pinX, 0.55, -pinY, false).rotation.x = Math.PI / 2;
    const bdLink = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(17.5, 8, 0), new THREE.Vector3(27, 12, 0), new THREE.Vector3(37 + pinX, 2, -pinY)), 40, 0.06, 8), new THREE.MeshBasicMaterial({ color: 0xe31e24 }));
    bdLink.visible = false; scene.add(bdLink);

    /* ---------- connectors with travelling pulses ---------- */
    const links: [number, number, number][] = [[-9.2, 0, 1], [-2.4, 0, 1], [3.4, 0, 1], [8.3, 0, 1], ...xs.map((x) => [x, 1, 2] as [number, number, number]), ...xs.map((x) => [x, 2, 3] as [number, number, number]), ...xs.map((x) => [x, 3, 4] as [number, number, number])];
    const tubeMat = track(null, new THREE.MeshStandardMaterial({ roughness: 0.6 }), "edge");
    const tubes = links.map(() => { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 8), tubeMat); scene.add(t); return t; });
    const pulseGeo = new THREE.SphereGeometry(0.11, 12, 8);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xff3b40 });
    const pulses = links.flatMap((_, i) => [0, 1].map((k) => { const m = new THREE.Mesh(pulseGeo, pulseMat); scene.add(m); return { m, link: i, t: (k * 0.5 + i * 0.13) % 1 }; }));
    paint();
    const onTheme = () => paint();
    const themeObs = new MutationObserver(onTheme);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    /* ---------- pointer ---------- */
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    const pickables = () => Object.values(parts).filter((p) => p.g.visible).flatMap((p) => p.meshes);
    const pick = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      return (ray.intersectObjects(pickables(), false)[0]?.object.userData.id as string) ?? null;
    };
    let down: [number, number] | null = null;
    const onMove = (e: PointerEvent) => { if (e.pointerType !== "mouse" || e.buttons) return; const id = pick(e); setHover(id); renderer.domElement.style.cursor = id ? "pointer" : ""; };
    const onDown = (e: PointerEvent) => { down = [e.clientX, e.clientY]; controls.autoRotate = false; };
    const onUp = (e: PointerEvent) => { if (down && Math.hypot(e.clientX - down[0], e.clientY - down[1]) < 6) { const id = pick(e); setTrace(-1); setSel(id); if (id) { setScene(null); setPlaying(false); } } down = null; };
    const dom = renderer.domElement;
    dom.addEventListener("pointermove", onMove); dom.addEventListener("pointerdown", onDown); dom.addEventListener("pointerup", onUp);

    /* ---------- loop ---------- */
    let w = 0, h = 0, visible = true, raf = 0, lift = 1, baseDist = CAM.distanceTo(HOME), lastReset = 0;
    const resize = () => {
      w = el.clientWidth; h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      baseDist = CAM.distanceTo(HOME) * 1.2 * Math.max(1, 1.45 / camera.aspect);
    };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "120px" }); io.observe(el);
    const clock = new THREE.Clock();
    const focus = new THREE.Vector3(), wp = new THREE.Vector3(), dir = new THREE.Vector3();
    camera.position.copy(HOME).add(dir.copy(CAM).sub(HOME).normalize().multiplyScalar(baseDist));
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) { clock.getDelta(); return; }
      const dt = Math.min(clock.getDelta(), 0.05);
      const s = live.current;
      const k = reduce ? 1 : 1 - Math.exp(-dt * 6);
      lift = ease(lift, s.lifted ? 1 : 0.56, k);
      const y = (i: number) => LEVEL_Y[i] * lift;
      levels.forEach((g, i) => { g.position.y = y(i); });
      govParts.forEach((p, i) => { p.g.position.y = y(i) - 0.3; });
      spine.scale.y = y(4) + 1; spine.position.y = (y(4) + 1) / 2 - 0.3;
      links.forEach(([x, a, b], i) => { const len = y(b) - y(a); tubes[i].position.set(x, y(a) + len / 2, 2.8); tubes[i].scale.y = len; });
      pulses.forEach((q) => { q.t = reduce ? q.t : (q.t + dt * 0.28) % 1; const [x, a, b] = links[q.link]; q.m.position.set(x, ease(y(b), y(a), q.t), 2.8); });
      if (!reduce) fans.forEach((f) => { f.rotation.z += dt * 7; });
      expansions.forEach((x) => { x.k = ease(x.k, s.expanded ? 1 : 0, k); x.real.visible = x.k > 0.01; x.real.scale.y = Math.max(x.k, 0.001); x.ghost.visible = x.k < 0.6; });

      const main = s.sel;
      const labsOn = s.scene === 3, bdOn = s.scene === 5, focusIds = s.scene !== null ? TOUR[s.scene].ids : null;
      labGroups.forEach((g) => { g.visible = labsOn; });
      bdP.g.visible = bdOn; bdLink.visible = bdOn;
      for (const p of Object.values(parts)) {
        const isHot = p.id === main || p.id === s.hover;
        const out = main ? p.id !== main : focusIds ? !focusIds.includes(p.id) : s.layer !== null ? p.level !== s.layer || GOV_LEVEL.includes(p.id) : false;
        p.hot = ease(p.hot, isHot ? 1 : 0, k);
        p.dim = ease(p.dim, out && !isHot ? 1 : 0, k);
        for (const { m, base } of p.mats) {
          m.opacity = base * (1 - p.dim * 0.8);
          m.transparent = base < 1 || p.dim > 0.01;
          const std = m as THREE.MeshStandardMaterial;
          if (std.emissiveIntensity !== undefined && std.emissive && std.emissive.getHex() === 0xe31e24 && std.color.getHex() !== 0xe31e24) std.emissiveIntensity = p.hot * 0.28;
        }
      }
      // camera: glide to the selected part
      const target = main ? parts[main].g.getWorldPosition(wp) : labsOn ? wp.set(-14, 5, 4) : bdOn ? wp.set(14, 7, 0) : HOME;
      focus.copy(target);
      if (main) focus.y += 0.8;
      controls.target.lerp(focus, reduce ? 1 : 1 - Math.exp(-dt * 3.2));
      const want = (main ? baseDist * 0.56 : labsOn ? baseDist * 1.75 : bdOn ? baseDist * 1.6 : baseDist) * s.zoom;
      dir.copy(camera.position).sub(controls.target);
      if (s.resetAt !== lastReset) { lastReset = s.resetAt; dir.copy(CAM).sub(HOME); camera.position.copy(controls.target).add(dir.normalize().multiplyScalar(want)); dir.copy(camera.position).sub(controls.target); }
      const d = ease(dir.length(), want, reduce ? 1 : 1 - Math.exp(-dt * 3));
      camera.position.copy(controls.target).add(dir.normalize().multiplyScalar(d));
      controls.autoRotate = controls.autoRotate && !main && !s.tracing;
      controls.update();

      // HTML labels follow their part
      for (const p of Object.values(parts)) {
        const el2 = labels.current[p.id];
        if (!el2) continue;
        wp.copy(p.anchor); p.g.localToWorld(wp); wp.project(camera);
        const behind = wp.z > 1;
        el2.style.visibility = p.g.visible && (!(labsOn || bdOn) || LAB_IDS.includes(p.id) || p.id === "bangladesh") ? "visible" : "hidden";
        el2.style.transform = `translate3d(${((wp.x + 1) / 2) * w}px, ${((1 - wp.y) / 2) * h}px, 0) translate(-50%, -100%)`;
        el2.style.opacity = behind ? "0" : String(Math.max(0.12, 1 - p.dim));
      }
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); themeObs.disconnect(); controls.dispose();
      dom.removeEventListener("pointermove", onMove); dom.removeEventListener("pointerdown", onDown); dom.removeEventListener("pointerup", onUp);
      scene.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose?.(); });
      allMats.forEach(({ m }) => m.dispose());
      renderer.dispose(); dom.remove();
    };
  }, []);

  const shown = active ? BY_ID[active] : null;
  const zoom = (f: number) => { live.current.zoom = Math.min(1.5, Math.max(0.55, live.current.zoom * f)); };
  const reset = () => { openScene(null); setSel(null); setLayer(null); setTrace(-1); live.current.zoom = 1; live.current.resetAt = Date.now(); };
  const tool = "twin-btn";

  return (
    <div className="twin border-t border-line-dark">
      <div className="flex items-center justify-between gap-3 border-b border-line-dark px-5 py-3 md:px-10 lg:px-14">
        <span className="label text-soft">View</span>
        <div className="twin-glass flex gap-1 p-1" role="group" aria-label="Choose a view">
          {!failed && <button className={`twin-btn ${view === "3d" ? "is-on" : ""}`} aria-pressed={view === "3d"} onClick={() => setView("3d")}>3D interactive</button>}
          <button className={`twin-btn ${view === "2d" ? "is-on" : ""}`} aria-pressed={view === "2d"} onClick={() => { setTrace(-1); setView("2d"); }}>2D flat</button>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-b border-line-dark px-5 py-4 md:px-10 lg:px-14">
        <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Guided tour">
          <button className={`twin-btn border border-red ${playing ? "is-on" : ""}`} onClick={() => { if (playing) { setPlaying(false); return; } openScene(scene ?? 0); setPlaying(true); }}>{playing ? "Pause tour" : "Play tour"}</button>
          {TOUR.map((x, i) => <button key={x.n} className={`twin-btn ${scene === i ? "is-on" : ""}`} aria-pressed={scene === i} onClick={() => { setPlaying(false); openScene(scene === i ? null : i); }}><span className="mr-1 font-mono text-[11px] opacity-60">0{i + 1}</span>{x.n}</button>)}
        </div>
        {scene !== null && <div aria-live="polite" className="max-w-[760px]"><p className="text-[22px] font-medium leading-7 tracking-[-0.015em]">{TOUR[scene].t}</p><p className="mt-1 text-[15px] leading-[23px] text-soft">{TOUR[scene].b}</p></div>}
      </div>
      {view === "2d" && <FlatView scene={scene} sel={sel} expanded={expanded} onExpand={() => setExpanded(!expanded)} onPick={(id) => setSel(sel === id ? null : id)} />}
      <div className={`relative h-[620px] overflow-hidden md:h-[820px] ${view === "2d" ? "hidden" : ""}`}>
        <div ref={host} className="absolute inset-0" />
        {failed && <p className="absolute inset-0 flex items-center justify-center p-8 text-center text-soft">3D view isn&apos;t available in this browser. Choose a part from the list below.</p>}
        {!failed && <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {NODES.map((n) => (
            <button key={n.id} ref={(b) => { labels.current[n.id] = b; }} onClick={() => { setTrace(-1); setScene(null); setPlaying(false); setSel(sel === n.id ? null : n.id); }} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}
              aria-pressed={active === n.id} className={`twin-chip pointer-events-auto absolute left-0 top-0 ${active === n.id ? "is-on" : ""} ${active === n.id ? "inline-flex" : n.minor ? "hidden lg:inline-flex" : "hidden md:inline-flex"}`}>
              {n.label}
            </button>
          ))}
        </div>}

        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-3 md:left-6 md:top-6">
          <span className="twin-glass label inline-flex items-center gap-2 self-start px-3 py-2"><i className="h-1.5 w-1.5 bg-red" />Concept · Planned architecture</span>
          <div className="twin-glass pointer-events-auto hidden w-[190px] flex-col p-1.5 md:flex" role="group" aria-label="Show one floor">
            {[...LAYERS].reverse().map((l, ri) => { const i = LAYERS.length - 1 - ri; return (
              <button key={l} aria-pressed={layer === i} onClick={() => { setSel(null); setTrace(-1); setLayer(layer === i ? null : i); }} className={`twin-row ${layer === i ? "is-on" : ""}`}><span className="font-mono text-[11px] opacity-60">L{i + 1}</span>{l}</button>
            ); })}
          </div>
        </div>

        {shown && (
          <aside aria-live="polite" className="twin-glass absolute right-6 top-6 hidden w-[320px] flex-col gap-3 p-5 md:flex">
            <Detail n={shown} onClose={trace >= 0 ? undefined : () => setSel(null)} />
          </aside>
        )}

        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-between gap-3 md:inset-x-6 md:bottom-6">
          <div className="twin-glass pointer-events-auto flex flex-wrap gap-1 p-1">
            <button className={`${tool} ${trace >= 0 ? "is-on" : ""}`} onClick={() => { openScene(null); setSel(null); setTrace(trace >= 0 ? -1 : 0); }}>{trace >= 0 ? "Stop trace" : "Trace a request"}</button>
            <button className={`${tool} ${expanded ? "is-on" : ""}`} aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? "16 GPUs · proposed" : "8 GPUs · initial"}</button>
            <button className={tool} aria-pressed={!lifted} onClick={() => setLifted(!lifted)}>{lifted ? "Collapse floors" : "Lift floors"}</button>
          </div>
          <div className="twin-glass pointer-events-auto flex gap-1 p-1">
            <button className={`${tool} hidden md:block`} aria-label="Zoom in" onClick={() => zoom(0.85)}>+</button>
            <button className={`${tool} hidden md:block`} aria-label="Zoom out" onClick={() => zoom(1.18)}>−</button>
            <button className={tool} onClick={reset}>Reset</button>
          </div>
        </div>
        {trace >= 0 && <p aria-live="polite" className="twin-glass absolute left-1/2 top-16 w-max max-w-[86%] -translate-x-1/2 px-4 py-2.5 text-[14px] md:top-6"><span className="mr-2 font-mono text-red">{trace + 1}/{TRACE.length}</span>{TRACE[trace][1]}</p>}
      </div>

      {/* Below the model: details on small screens, and the full parts list for everyone */}
      {shown && view === "3d" && <div className="flex flex-col gap-3 border-t border-line-dark p-5 md:hidden"><Detail n={shown} onClose={trace >= 0 ? undefined : () => setSel(null)} /></div>}
      {!shown && view === "3d" && <p className="border-t border-line-dark px-5 py-4 text-[14px] text-soft md:px-10 lg:px-14">Drag to rotate. Select any part to see what it does.</p>}
    </div>
  );
}

/** The same architecture as a flat, readable diagram. Shares selection and GPU state with the 3D view. */
function FlatView({ scene, sel, expanded, onExpand, onPick }: { scene: number | null; sel: string | null; expanded: boolean; onExpand: () => void; onPick: (id: string) => void }) {
  const ids = scene !== null ? TOUR[scene].ids : null;
  const cell = (id: string, extra = "") => `twin-flat ${sel === id ? "is-on" : ""} ${ids && !ids.includes(id) ? "opacity-25" : ""} ${ids?.includes(id) ? "!border-red" : ""} ${extra}`;
  const Stem = ({ cols = 3 }: { cols?: number }) => <div aria-hidden className={`hidden h-6 md:grid ${cols === 4 ? "grid-cols-4" : "grid-cols-3"}`}>{Array.from({ length: cols }, (_, i) => <span key={i} className="mx-auto w-px bg-mute/50" />)}</div>;
  const Gap = () => <span aria-hidden className="mx-auto block h-4 w-px bg-mute/50 md:hidden" />;
  const Trio = ({ ids }: { ids: string[] }) => <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">{ids.map((id) => <button key={id} aria-pressed={sel === id} onClick={() => onPick(id)} className={cell(id, "py-5 text-[16px] font-medium")}>{BY_ID[id].label}</button>)}</div>;
  const Server = ({ id }: { id: string }) => (
    <button aria-pressed={sel === id} onClick={() => onPick(id)} className={cell(id, "flex flex-col gap-3 p-4 text-left")}>
      <span className="text-[17px] font-medium">{BY_ID[id].label}</span>
      <span className="grid grid-cols-8 gap-1">{Array.from({ length: 8 }, (_, i) => { const live = i < 4 || expanded; return <span key={i} className={`flex h-12 flex-col items-center justify-center gap-1.5 rounded-[3px] ${live ? "keep-white bg-red" : "border border-dashed border-mute"}`}><i className={`h-2 w-2 rounded-full border ${live ? "border-white" : "border-mute"}`} /><i className={`h-px w-2 ${live ? "bg-white" : "bg-mute"}`} /></span>; })}</span>
      <span className="text-[13px] opacity-70">{expanded ? "8 × 96GB GPUs · proposed" : "4 × 96GB GPUs · +4 expansion"}</span>
    </button>
  );
  const shown = sel ? BY_ID[sel] : null;
  return (
    <div className="flex flex-col gap-6 p-5 md:p-10 lg:px-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="twin-glass label inline-flex items-center gap-2 px-3 py-2"><i className="h-1.5 w-1.5 bg-red" />Concept · Planned architecture</span>
        <button className={`twin-btn twin-glass ${expanded ? "is-on" : ""}`} aria-pressed={expanded} onClick={onExpand}>{expanded ? "16 GPUs · proposed" : "8 GPUs · initial"}</button>
      </div>
      {scene === 3 && <LabsFlat />}
      {scene === 5 && <div className="mx-auto aspect-[3/4] w-full max-w-[360px]"><BdMap /></div>}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_170px]">
        <div className="flex min-w-0 flex-col">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">{["students", "faculty", "researchers", "hr", "accounts", "dol", "concerns", "security"].map((id) => <button key={id} aria-pressed={sel === id} onClick={() => onPick(id)} className={cell(id, "!rounded-full py-3 text-[14px] font-medium")}>{BY_ID[id].label}</button>)}</div>
          <Gap /><Stem /><Trio ids={["assistants", "research", "apis"]} />
          <Gap /><Stem /><Trio ids={["knowledge", "routing", "models"]} />
          <Gap /><Stem />
          <button aria-pressed={sel === "os"} onClick={() => onPick("os")} className={cell("os", "flex flex-wrap items-center justify-between gap-2 !border-red p-5 text-left")}><span className="text-[18px] font-medium">Infrastructure OS</span><span className="text-[14px] opacity-70">Scheduling · Monitoring · Usage · Recovery</span></button>
          <Gap /><Stem cols={4} />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 xl:grid-cols-[1.6fr_1.6fr_1fr_1fr]">
            <Server id="gpuA" /><Server id="gpuB" />
            <button aria-pressed={sel === "storage"} onClick={() => onPick("storage")} className={cell("storage", "flex flex-col gap-2 p-4 text-left")}><span className="text-[17px] font-medium">Shared storage</span><span className="text-[13px] opacity-70">100TB+ · HA</span><span className="flex flex-col gap-1">{[0, 1, 2, 3].map((i) => <i key={i} className="h-2 rounded-sm bg-mute/40" />)}</span></button>
            <button aria-pressed={sel === "mgmt"} onClick={() => onPick("mgmt")} className={cell("mgmt", "flex flex-col gap-2 p-4 text-left")}><span className="text-[17px] font-medium">Management</span><span className="text-[13px] opacity-70">HA platform</span><span className="flex gap-1.5">{[0, 1, 2].map((i) => <i key={i} className="h-9 flex-1 rounded-sm border border-mute/60" />)}</span></button>
          </div>
          <div className="h-4" />
          <button aria-pressed={sel === "fabric"} onClick={() => onPick("fabric")} className={cell("fabric", "flex flex-col gap-2 !border-0 !bg-transparent p-1 text-center")}><span className="h-1 rounded-full bg-red" /><span className="text-[13px] font-medium">Redundant 100GbE fabric</span></button>
          <button aria-pressed={sel === "future"} onClick={() => onPick("future")} className={cell("future", "mt-3 !border-dashed py-3 text-[14px]")}>Future enterprise services · after internal acceptance</button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-col">
          <span className="label col-span-full py-2 text-center text-red">Governance</span>
          {["identity", "permissions", "approval", "audit", "recovery"].map((id) => <button key={id} aria-pressed={sel === id} onClick={() => onPick(id)} className={cell(id, "py-4 text-[14px] font-medium lg:flex-1")}>{BY_ID[id].label}</button>)}
          <button aria-pressed={sel === "backup"} onClick={() => onPick("backup")} className={cell("backup", "!border-dashed p-3 text-[14px] font-medium lg:mt-3")}>Backup<span className="block text-[12px] font-normal opacity-70">Planned copy</span></button>
        </div>
      </div>
      <div aria-live="polite" className="twin-glass flex min-h-[92px] flex-col gap-3 p-5">
        {shown ? <Detail n={shown} /> : <p className="text-[15px] opacity-70">Select any part to see what it does.</p>}
      </div>
    </div>
  );
}

function Detail({ n, onClose }: { n: Node; onClose?: () => void }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="label text-red">{n.layer}</span>
        {onClose && <button onClick={onClose} aria-label="Close details" className="-mr-1 -mt-1 flex h-7 w-7 items-center justify-center text-[18px] leading-none opacity-70 hover:opacity-100">×</button>}
      </div>
      <span className="text-[24px] font-medium leading-tight tracking-[-0.02em]">{n.label}</span>
      <p className="text-[15px] leading-[23px] opacity-80">{n.desc}</p>
      <ul className="flex flex-wrap gap-1.5 pt-1">{n.spec.map((s) => <li key={s} className="twin-tag">{s}</li>)}</ul>
    </>
  );
}
