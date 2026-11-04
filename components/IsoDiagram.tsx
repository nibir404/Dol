"use client";

import { useId } from "react";

/**
 * Isometric objects drawn from boxes, in two materials:
 *  - rest: clean solids (white/grey faces, one dark "lit" part), theme-aware via CSS vars
 *  - glass (on hover of a `.group` / `.tilt` parent): frosted faces, the lit part glows DOL red,
 *    cables turn red and filaments radiate. The glass layer blurs/lifts in over the solid one.
 * Boxes can carry surface detail (rack units + LEDs, vents, ports, windows, screens, doors) and
 * scenes can carry cables, so each diagram reads as the real thing it stands for.
 */
type Det = "u" | "vent" | "ports" | "win" | "screen" | "door" | "leds" | "fan" | "bars";
type Box = { x: number; y: number; z: number; w: number; d: number; h: number; lit?: boolean; det?: Det; n?: number };
type V3 = [number, number, number];
type Scene = { boxes: Box[]; rays: number; lines?: V3[][] };

const B = (x: number, y: number, z: number, w: number, d: number, h: number, o: Partial<Box> = {}): Box => ({ x, y, z, w, d, h, ...o });
const plate = (w: number, d: number) => B(0, 0, 0, w, d, 0.18);

const rackTower = (x: number, y: number, units: number, litAt = -1): Box[] => [
  B(x, y, 0.18, 1.6, 1.6, 0.2),
  ...Array.from({ length: units }, (_, i) => B(x + 0.06, y + 0.06, 0.38 + i * 0.46, 1.48, 1.48, 0.42, { lit: i === litAt, det: i === litAt ? "leds" : "u", n: 3 })),
  B(x, y, 0.38 + units * 0.46, 1.6, 1.6, 0.16),
];

export const SCENES: Record<string, Scene> = {
  // Home internet: wall fibre outlet → ONT → Wi-Fi router with antennas, laptop on the desk
  network: {
    rays: 10,
    boxes: [
      plate(5.2, 3.8),
      B(0.3, 0.4, 0.18, 0.5, 0.5, 0.9, { det: "ports", n: 1 }),
      B(1.3, 0.5, 0.18, 1.1, 0.8, 0.32, { det: "leds", n: 4 }),
      B(2.6, 1.3, 0.18, 2.2, 1.5, 0.48, { det: "ports", n: 4 }),
      B(2.95, 1.55, 0.66, 0.16, 0.16, 1.4),
      B(4.35, 1.55, 0.66, 0.16, 0.16, 1.4),
      B(3.55, 1.45, 0.66, 0.9, 0.12, 0.14, { lit: true }),
      B(0.6, 2.4, 0.18, 1.5, 1.0, 0.08),
      B(0.6, 2.4, 0.26, 0.08, 1.0, 0.75, { det: "screen" }),
    ],
    lines: [[[0.8, 0.65, 0.45], [1.3, 0.85, 0.3]], [[2.4, 0.9, 0.3], [2.6, 1.9, 0.3]]],
  },
  // Corporate internet: office building on a dedicated fibre into a core switch + backup path
  gpu: {
    rays: 12,
    boxes: [
      plate(5.6, 4.2),
      B(0.3, 0.3, 0.18, 2.2, 2.0, 3.0, { det: "win", n: 5 }),
      B(0.3, 0.3, 3.18, 2.2, 2.0, 0.14),
      B(3.4, 0.6, 0.18, 1.8, 1.2, 0.22),
      B(3.45, 0.65, 0.4, 1.7, 1.1, 0.34, { lit: true, det: "ports", n: 6 }),
      B(3.45, 0.65, 0.74, 1.7, 1.1, 0.34, { det: "ports", n: 6 }),
      B(3.6, 2.6, 0.18, 1.2, 1.2, 0.6, { det: "vent" }),
    ],
    lines: [[[2.5, 1.3, 0.5], [3.4, 1.3, 0.5]], [[2.5, 1.8, 0.35], [3.0, 2.8, 0.35], [3.6, 3.2, 0.35]], [[4.2, 1.75, 0.3], [4.2, 2.6, 0.3]]],
  },
  // Domain, hosting & VPS: stacked 1U/2U servers with vents, drive bays and a VPS slice lit
  hosting: {
    rays: 10,
    boxes: [
      B(0, 0, 0, 3.8, 2.8, 0.16),
      B(0.1, 0.1, 0.16, 3.6, 2.6, 0.5, { det: "vent" }),
      B(0.1, 0.1, 0.78, 3.6, 2.6, 0.5, { lit: true, det: "leds", n: 6 }),
      B(0.1, 0.1, 1.4, 3.6, 2.6, 0.5, { det: "u", n: 2 }),
      B(0.1, 0.1, 2.02, 3.6, 2.6, 0.5, { det: "vent" }),
      B(0.1, 0.1, 2.64, 3.6, 2.6, 0.16),
    ],
  },
  // Colocation: one rack with your unit lit, PDU strip at the side
  rack: { rays: 12, boxes: [plate(2.8, 2.6), ...rackTower(0.4, 0.4, 8, 4), B(2.1, 0.6, 0.38, 0.14, 1.2, 3.4, { det: "leds", n: 8 })] },
  // Data hall: hot/cold aisle with three rack rows, overhead tray, CRAC unit
  hall: {
    rays: 12,
    boxes: [
      plate(7.4, 4.4),
      ...[0, 1, 2, 3].flatMap((k) => rackTower(0.4 + k * 1.7, 0.4, 5, k === 1 ? 2 : -1)),
      ...[0, 1, 2, 3].flatMap((k) => rackTower(0.4 + k * 1.7, 2.6, 4)),
      B(0.4, 1.0, 3.2, 6.6, 0.3, 0.08),
    ],
  },
  // Domain registration / solutions: a namespace of tiles wired to one resolver
  tiles: {
    rays: 10,
    boxes: [plate(4.6, 4.6), ...[0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => B(0.4 + i * 1.4, 0.4 + j * 1.4, 0.18, 1.05, 1.05, [0.5, 0.9, 0.7][(i + j) % 3], i === 1 && j === 1 ? { lit: true, det: "leds", n: 3 } : { det: "screen" })))],
    lines: [[[0.95, 0.95, 0.9], [2.35, 2.35, 1.2]], [[3.75, 0.95, 0.9], [2.35, 2.35, 1.2]], [[0.95, 3.75, 0.9], [2.35, 2.35, 1.2]], [[3.75, 3.75, 0.9], [2.35, 2.35, 1.2]]],
  },
  // Coverage / status: points of presence across districts, linked back to the core
  towers: {
    rays: 10,
    boxes: [plate(5.2, 4.2), B(0.5, 0.5, 0.18, 0.6, 0.6, 1.3, { det: "leds", n: 3 }), B(1.8, 1.6, 0.18, 0.6, 0.6, 2.0, { det: "leds", n: 4 }), B(2.4, 0.4, 0.18, 0.9, 0.9, 2.1, { det: "u", n: 4 }), B(2.4, 0.4, 2.28, 0.9, 0.9, 0.62, { lit: true, det: "leds", n: 3 }), B(3.9, 2.0, 0.18, 0.6, 0.6, 1.6, { det: "leds", n: 3 }), B(1.0, 2.9, 0.18, 0.6, 0.6, 1.0, { det: "leds", n: 2 }), B(3.6, 3.3, 0.18, 0.6, 0.6, 0.8, { det: "leds", n: 2 })],
    lines: [[[0.8, 0.8, 1.5], [2.85, 0.85, 3.0]], [[2.1, 1.9, 2.2], [2.85, 0.85, 3.0]], [[4.2, 2.3, 1.8], [2.85, 0.85, 3.0]], [[1.3, 3.2, 1.2], [2.1, 1.9, 2.2]], [[3.9, 3.6, 1.0], [4.2, 2.3, 1.8]]],
  },
  // About / academy / career: DOL campus — HQ tower, training block, NOC with a lit floor
  campus: {
    rays: 10,
    boxes: [plate(5.6, 4.4), B(0.4, 0.4, 0.18, 1.8, 1.4, 1.4, { det: "win", n: 4 }), B(2.8, 0.4, 0.18, 1.6, 1.6, 1.2, { det: "win", n: 2 }), B(2.8, 0.4, 1.38, 1.6, 1.6, 0.55, { lit: true, det: "win", n: 1 }), B(2.8, 0.4, 1.93, 1.6, 1.6, 0.9, { det: "win", n: 2 }), B(0.4, 2.3, 0.18, 1.4, 1.6, 0.9, { det: "win", n: 3 }), B(2.6, 2.6, 0.18, 2.6, 1.3, 0.6, { det: "win", n: 6 })],
  },
  // Privacy / legal: locked vault with a keypad
  vault: { rays: 12, boxes: [plate(4.2, 3.6), B(0.6, 0.6, 0.18, 2.8, 2.2, 2.0, { det: "door" }), B(3.4, 1.4, 0.8, 0.16, 0.6, 0.7, { lit: true, det: "leds", n: 3 })] },
  // My DOL / support / complaints: laptop with the account dashboard on screen
  device: { rays: 10, boxes: [plate(4.6, 3.6), B(0.8, 0.8, 0.18, 3.0, 2.1, 0.14, { det: "ports", n: 2 }), B(0.8, 0.8, 0.32, 0.12, 2.1, 1.7, { lit: true, det: "screen" }), B(3.0, 3.0, 0.18, 0.5, 0.35, 0.12)] },
  // Academy / career / waitlist: stepped levels, the top step lit
  steps: { rays: 10, boxes: [plate(5.4, 2.6), ...[0, 1, 2, 3].map((i) => B(0.4 + i * 1.2, 0.5, 0.18, 1.0, 1.5, 0.4 + i * 0.55, i === 3 ? { lit: true, det: "leds", n: 3 } : { det: "bars", n: i + 1 }))] },
  // Power: UPS cabinets with vents and a battery string
  power: { rays: 12, boxes: [plate(5.4, 3.2), B(0.4, 0.5, 0.18, 1.2, 2.0, 2.3, { det: "vent" }), B(1.8, 0.5, 0.18, 1.2, 2.0, 2.3, { det: "vent" }), B(3.4, 0.9, 0.18, 1.4, 1.3, 0.7, { det: "bars", n: 4 }), B(3.4, 0.9, 0.88, 1.4, 1.3, 0.4, { lit: true, det: "leds", n: 4 })], lines: [[[3.0, 1.5, 0.4], [3.4, 1.5, 0.4]]] },
  // AI Labs: two rooms of desks share one GPU pool, walled off from production
  labs: {
    rays: 12,
    boxes: [
      plate(11.4, 6.2),
      ...[0, 4.7].flatMap((ox) => [B(ox + 0.3, 0.3, 0.18, 3.9, 3.9, 0.06), ...[0, 1, 2, 3, 4].flatMap((i) => [0, 1, 2, 3, 4].map((j) => B(ox + 0.5 + i * 0.72, 0.5 + j * 0.72, 0.24, 0.48, 0.48, 0.3, { det: "screen" })))]),
      B(9.5, 0.5, 0.18, 1.5, 1.6, 1.6, { det: "u", n: 3 }),
      B(4.2, 4.7, 0.18, 1.5, 1.2, 0.5, { lit: true, det: "leds", n: 4 }),
      B(4.2, 4.7, 0.68, 1.5, 1.2, 0.5, { lit: true, det: "leds", n: 4 }),
    ],
    lines: [[[2.2, 4.2, 0.3], [2.2, 5.3, 0.3], [4.2, 5.3, 0.3]], [[6.9, 4.2, 0.3], [6.9, 5.3, 0.3], [5.7, 5.3, 0.3]]],
  },
};
SCENES.datacenter = SCENES.rack;

/** Which scene stands in for each illustration file. */
export const SCENE_FOR: Record<string, string> = {
  "illo-home": "network", "illo-corporate": "gpu", "illo-hosting": "hosting", "illo-datacenter": "rack", "dc-wireframe": "hall",
  "ai-hall": "hall", "ai-server": "hosting", "ai-power": "power", "ai-sovereign": "vault", "ai-campus": "campus", "ai-colo": "rack", "ai-waitlist": "steps", globe: "towers",
  "pg-about": "campus", "pg-academy": "steps", "pg-career": "campus", "pg-complaints": "device", "pg-coverage": "towers", "pg-domain": "tiles", "pg-kb": "device",
  "pg-legal": "vault", "pg-mydol": "device", "pg-solutions": "tiles", "pg-status": "towers", "pg-support": "device", "pg-vps": "hosting",
};

const S = 24;
const C = Math.cos(Math.PI / 6);
const P = (x: number, y: number, z: number) => [(x - y) * C * S, (x + y) * 0.5 * S - z * S] as const;
const pts = (q: V3[]) => q.map((v) => P(...v).map((n) => n.toFixed(1)).join(",")).join(" ");

function faces(b: Box) {
  const { x, y, z, w, d, h } = b;
  return {
    r: pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]),
    l: pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]),
    t: pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]),
  };
}

/** Surface detail drawn on the front (L) and side (R) faces. */
function detail(b: Box, glass: boolean, key: number) {
  const { x, y, z, w, d, h, det, n = 4, lit } = b;
  if (!det) return null;
  const L = (u: number, v: number) => P(x + u * w, y + d, z + v * h);
  const R = (u: number, v: number) => P(x + w, y + u * d, z + v * h);
  const ln = (a: readonly number[], c: readonly number[], k: string | number) => <line key={k} x1={a[0]} y1={a[1]} x2={c[0]} y2={c[1]} />;
  const quad = (f: typeof L, u0: number, v0: number, u1: number, v1: number, k: string | number, fill?: string) => (
    <polygon key={k} points={[f(u0, v0), f(u1, v0), f(u1, v1), f(u0, v1)].map((p) => p.join(",")).join(" ")} fill={fill ?? "none"} />
  );
  const ledOn = lit ? "#FFFFFF" : glass ? "#E31E24" : "#1E9A4B";
  const out: React.ReactNode[] = [];
  if (det === "u") for (let i = 1; i < n + 1; i++) out.push(ln(L(0.04, i / (n + 1)), L(0.96, i / (n + 1)), `u${i}`));
  if (det === "u" || det === "leds") for (let i = 0; i < n; i++) { const q = L(0.08 + (det === "leds" ? (i * 0.8) / n : 0), det === "leds" ? 0.5 : (i + 0.6) / (n + 1)); out.push(<circle key={`l${i}`} cx={q[0]} cy={q[1]} r={0.9} fill={i % 2 ? "var(--iso-line)" : ledOn} stroke="none" className={i % 2 ? undefined : "iso-led"} style={{ animationDelay: `${(key + i) * 0.31}s` }} />); }
  if (det === "vent") for (let i = 1; i < 6; i++) out.push(ln(R(0.15, i / 6), R(0.85, i / 6), `v${i}`));
  if (det === "ports") for (let i = 0; i < n; i++) out.push(quad(R, 0.12 + (i * 0.76) / n, 0.3, 0.12 + (i * 0.76) / n + 0.6 / n, 0.7, `p${i}`, "var(--iso-lit-r)"));
  if (det === "win") for (let r = 1; r <= n; r++) for (let c = 0; c < 3; c++) out.push(quad(L, 0.1 + c * 0.28, (r - 0.75) / (n + 0.4), 0.3 + c * 0.28, (r - 0.2) / (n + 0.4), `w${r}${c}`, lit && r === Math.ceil(n / 2) ? (glass ? "#E31E24" : "var(--iso-lit-l)") : undefined));
  if (det === "screen") { out.push(quad(R, 0.08, 0.12, 0.92, 0.9, "s0")); for (let i = 1; i < 4; i++) out.push(ln(R(0.18, 0.12 + i * 0.18), R(0.18 + 0.15 * i + 0.2, 0.12 + i * 0.18), `s${i}`)); }
  if (det === "door") { out.push(quad(L, 0.08, 0.06, 0.92, 0.94, "d0")); const c = L(0.7, 0.5); out.push(<circle key="d1" cx={c[0]} cy={c[1]} r={4} fill="none" />, <circle key="d2" cx={c[0]} cy={c[1]} r={1.2} fill="currentColor" stroke="none" />); }
  if (det === "bars") for (let i = 0; i < n; i++) out.push(quad(L, 0.12 + i * (0.76 / n), 0.2, 0.12 + i * (0.76 / n) + 0.5 / n, 0.8, `b${i}`, lit ? (glass ? "#E31E24" : "var(--iso-lit-r)") : undefined));
  return <g key={`det${key}`} strokeWidth={0.55} fill="none" opacity={0.85}>{out}</g>;
}

export default function IsoDiagram({ kind = "network", className = "" }: { kind?: string; className?: string }) {
  const { boxes, rays, lines = [] } = SCENES[kind] ?? SCENES.tiles;
  const id = useId().replace(/:/g, "");
  const sorted = [...boxes].sort((a, b) => (a.z < 0.2 ? -1 : 0) - (b.z < 0.2 ? -1 : 0) || a.x + a.y - (b.x + b.y) || a.z - b.z);

  const all = boxes.flatMap((b) => [P(b.x, b.y, b.z), P(b.x + b.w, b.y, b.z), P(b.x, b.y + b.d, b.z), P(b.x + b.w, b.y + b.d, b.z), P(b.x, b.y, b.z + b.h), P(b.x + b.w, b.y + b.d, b.z + b.h)]);
  const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
  const pad = 22;
  const vb = [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) - Math.min(...xs) + pad * 2, Math.max(...ys) - Math.min(...ys) + pad * 2];

  const core = boxes.find((b) => b.lit) ?? boxes[1];
  const [cx, cy] = P(core.x + core.w / 2, core.y + core.d / 2, core.z + core.h / 2);
  const filaments = Array.from({ length: rays }, (_, i) => {
    const a = (i / rays) * Math.PI * 2 + (i % 2 ? 0.12 : -0.06);
    const len = 70 + ((i * 37) % 5) * 12;
    const ex = cx + Math.cos(a) * len, ey = cy + Math.sin(a) * len * 0.8;
    const mx = cx + Math.cos(a + 0.35) * len * 0.5, my = cy + Math.sin(a + 0.35) * len * 0.45;
    return { d: `M${cx.toFixed(1)},${cy.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`, ex, ey, i };
  });
  const cable = (l: V3[]) => l.map((v) => P(...v).map((n) => n.toFixed(1)).join(",")).join(" ");

  const solid = (glass: boolean) =>
    sorted.map((b, i) => {
      const f = faces(b);
      const m = glass
        ? b.lit
          ? { t: `url(#${id}-et)`, l: `url(#${id}-es)`, r: `url(#${id}-es)`, s: "#F3A5A7" }
          : { t: `url(#${id}-gt)`, l: `url(#${id}-gl)`, r: `url(#${id}-gr)`, s: "var(--iso-glass-edge)" }
        : b.lit
          ? { t: "var(--iso-lit-t)", l: "var(--iso-lit-l)", r: "var(--iso-lit-r)", s: "var(--iso-lit-t)" }
          : { t: "var(--iso-t)", l: "var(--iso-l)", r: "var(--iso-r)", s: "var(--iso-line)" };
      const g = (
        <g key={i} strokeWidth={glass ? 1.1 : 1} strokeLinejoin="round" stroke={m.s} color={m.s}>
          <polygon points={f.r} fill={m.r} />
          <polygon points={f.l} fill={m.l} />
          <polygon points={f.t} fill={m.t} />
          {detail(b, glass, i)}
        </g>
      );
      return glass && b.lit ? <g key={i} filter={`url(#${id}-glow)`}>{g}</g> : g;
    });

  const cables = (glass: boolean) => lines.map((l, i) => (
    <polyline key={`c${i}`} points={cable(l)} fill="none" stroke={glass ? "#E31E24" : "var(--iso-line)"} strokeWidth={glass ? 1.6 : 1.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={glass ? "4 3" : undefined} className={glass ? "iso-cable" : undefined} />
  ));

  return (
    <div className={`iso-obj ${className || "relative"}`} aria-hidden>
      <svg viewBox={vb.join(" ")} className="absolute inset-0 h-full w-full overflow-visible">{solid(false)}{cables(false)}</svg>
      <svg viewBox={vb.join(" ")} className="iso-glass absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}-gt`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" /><stop offset="1" stopColor="#E6E6E6" stopOpacity="0.8" /></linearGradient>
          <linearGradient id={`${id}-gl`} x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#E2E2E2" stopOpacity="0.88" /><stop offset="1" stopColor="#B4B4B4" stopOpacity="0.75" /></linearGradient>
          <linearGradient id={`${id}-gr`} x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#CFCFCF" stopOpacity="0.88" /><stop offset="1" stopColor="#9A9A9A" stopOpacity="0.78" /></linearGradient>
          <radialGradient id={`${id}-et`} cx="0.5" cy="0.5" r="0.7"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.45" stopColor="#E31E24" /><stop offset="1" stopColor="#E31E24" /></radialGradient>
          <linearGradient id={`${id}-es`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E31E24" /><stop offset="1" stopColor="#B5161B" /></linearGradient>
          <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="0.5" /></filter>
        </defs>
        <g className="iso-rays" fill="none" stroke="#E31E24" strokeWidth="0.8" strokeLinecap="round" filter={`url(#${id}-soft)`}>
          {filaments.map((r) => (
            <g key={r.i} style={{ ["--i" as string]: r.i }}>
              <path d={r.d} pathLength={1} opacity={0.75} />
              <circle cx={r.ex} cy={r.ey} r="1.4" fill="#E31E24" stroke="none" />
            </g>
          ))}
        </g>
        {solid(true)}
        {cables(true)}
      </svg>
    </div>
  );
}
