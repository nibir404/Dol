"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { PrimaryButton, SecondaryButton } from "./Button";

/**
 * Walkthrough of the DOL campus inside the Hi-Tech Park, told like a game level.
 * One isometric SVG world (same block language as IsoDiagram, more detail): gate, substation, generator yard,
 * chiller plant, the data hall with cut-away walls, rack rows with U lines and status LEDs, a live GPU pod,
 * colocation cages and the meet-me room. Scroll walks an avatar along a floor path between checkpoints;
 * the camera follows it, a HUD tracks objectives and a minimap shows where you are.
 */
type Box = { x: number; y: number; z: number; w: number; d: number; h: number; kind?: "rack" | "gpu" | "cage" | "wall" | "plain" | "glass" | "ghost"; led?: boolean };
const S = 26, C = Math.cos(Math.PI / 6);
const P = (x: number, y: number, z = 0) => [(x - y) * C * S, (x + y) * 0.5 * S - z * S] as const;
const pts = (q: [number, number, number][]) => q.map((v) => P(...v).map((n) => n.toFixed(1)).join(",")).join(" ");
const W = 36, D = 26; // world size in grid units

const STOPS = [
  { at: [2, 24], k: "Gate", t: "Bangabandhu Hi-Tech Park, Kaliakair.", b: "Badge in at the campus gate. Security staff on site around the clock." },
  { at: [5, 16], k: "Substation", t: "Two utility feeds land here.", b: "Independent 33 kV feeds and transformers, so one grid fault never takes the hall down." },
  { at: [5, 8], k: "Generators", t: "Diesel backup, fuelled for days.", b: "N+1 generators start automatically and carry the full load through long cuts." },
  { at: [14, 22.5], k: "Chiller plant", t: "Cooling sized for GPU heat.", b: "Chillers and dry coolers feed in-row units inside the hall." },
  { at: [12, 9.6], k: "Cold aisle", t: "Step into the data hall.", b: "Contained hot and cold aisles keep inlet air steady for every rack." },
  { at: [20, 5.6], k: "GPU pod", t: "GPU systems are planned.", b: "Two planned servers start with eight GPUs, not yet installed, with a proposed path to sixteen." },
  { at: [24, 13.6], k: "Your rack", t: "1U to a full cabinet.", b: "Colocate your own hardware with remote hands from local engineers." },
  { at: [32.5, 9.5], k: "Meet-me room", t: "Out to BDIX and the world.", b: "Carrier-neutral cross-connects to BDIX and international upstreams." },
] as const;

function world() {
  const b: Box[] = [];
  // campus slab + data hall floor
  b.push({ x: 0, y: 0, z: 0, w: W, d: D, h: 0.2, kind: "plain" });
  b.push({ x: 8, y: 2, z: 0.2, w: 22, d: 16, h: 0.12, kind: "plain" });
  // substation: transformers inside a fence
  [[1, 13.5], [3.4, 13.5], [1, 16.5], [3.4, 16.5]].forEach(([x, y]) => b.push({ x, y, z: 0.2, w: 1.6, d: 1.8, h: 1.4, kind: "plain" }, { x: x + 0.3, y: y + 0.3, z: 1.6, w: 1, d: 1.2, h: 0.35, kind: "plain" }));
  // generator yard
  [6, 8.6, 11.2].forEach((y, i) => { b.push({ x: 1, y: y - 4, z: 0.2, w: 4.4, d: 1.8, h: 1.5, kind: "plain" }); b.push({ x: 4.6, y: y - 3.8, z: 1.7, w: 0.3, d: 0.3, h: 0.9 + (i % 2) * 0.2, kind: "plain" }); });
  // chiller plant
  for (let i = 0; i < 4; i++) b.push({ x: 10 + i * 3.2, y: 20.5, z: 0.2, w: 2.6, d: 3.4, h: 1.3, kind: "plain" });
  // data hall walls (cut away to knee height) + meet-me room
  b.push({ x: 8, y: 2, z: 0.32, w: 22, d: 0.25, h: 2.6, kind: "wall" }, { x: 8, y: 2, z: 0.32, w: 0.25, d: 16, h: 2.6, kind: "wall" });
  b.push({ x: 8, y: 17.75, z: 0.32, w: 22, d: 0.25, h: 0.5, kind: "wall" }, { x: 29.75, y: 2, z: 0.32, w: 0.25, d: 16, h: 0.5, kind: "wall" });
  b.push({ x: 31, y: 7.5, z: 0.2, w: 3.6, d: 4, h: 0.12, kind: "plain" }, { x: 31.2, y: 7.7, z: 0.32, w: 0.9, d: 1.2, h: 2.2, kind: "rack", led: true }, { x: 31.2, y: 9.3, z: 0.32, w: 0.9, d: 1.2, h: 2.2, kind: "rack", led: true });
  // rack rows: row 0 = GPU pod (first 5 lit), row 3 = cages with ghost capacity
  [3.2, 7, 10.8, 14.6].forEach((ry, r) => {
    for (let i = 0; i < 16; i++) {
      const x = 10 + i * 1.18;
      const kind = r === 0 && i >= 8 && i < 13 ? "gpu" : r === 2 && i >= 11 && i < 15 ? "cage" : r === 3 && i > 9 ? "ghost" : "rack";
      b.push({ x, y: ry, z: 0.32, w: 1.05, d: 1.4, h: 2.5, kind, led: kind !== "ghost" });
    }
    b.push({ x: 10, y: ry + 0.45, z: 3.3, w: 18.8, d: 0.5, h: 0.1, kind: "plain" }); // overhead cable tray
  });
  // cold-aisle containment glass between rows 1 and 2
  b.push({ x: 10, y: 8.45, z: 0.32, w: 18.8, d: 2.3, h: 0.04, kind: "glass" });
  return b.sort((a, c) => a.x + a.y + (a.z > 3 ? 40 : 0) - (c.x + c.y + (c.z > 3 ? 40 : 0)));
}

// floor path between checkpoints (world units, z on the ground)
const PATH: [number, number][] = [[2, 24], [5, 20], [5, 16], [6.5, 12], [5, 8], [7, 18.8], [14, 22.5], [9, 19], [9, 9.6], [12, 9.6], [20, 9.6], [20, 5.6], [20, 9.6], [24, 13.6], [29, 12.6], [32.5, 9.5]];
const STOP_ON_PATH = [0, 2, 4, 6, 9, 11, 13, 15];

export default function InfraTour() {
  const ref = useRef<HTMLElement>(null);
  const cam = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGPolylineElement>(null);
  const avatar = useRef<SVGGElement>(null);
  const miniDot = useRef<SVGCircleElement>(null);
  const reduce = useReducedMotion();
  const [stop, setStop] = useState(-1);
  const boxes = useMemo(world, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const scr = PATH.map(([x, y]) => P(x, y, 0.35));
  const seg = scr.slice(1).map((p, i) => Math.hypot(p[0] - scr[i][0], p[1] - scr[i][1]));
  const cum = seg.reduce<number[]>((a, v) => [...a, a[a.length - 1] + v], [0]);
  const total = cum[cum.length - 1];
  const stopD = STOP_ON_PATH.map((i) => cum[i]);
  const corners = [P(0, 0), P(W, 0), P(W, D), P(0, D), P(0, 0, 4)];
  const vb = { x: Math.min(...corners.map((c) => c[0])) - 30, y: Math.min(...corners.map((c) => c[1])) - 30, w: 0, h: 0 };
  vb.w = Math.max(...corners.map((c) => c[0])) + 30 - vb.x; vb.h = Math.max(...corners.map((c) => c[1])) + 30 - vb.y;

  const at = (d: number) => {
    const dd = Math.max(0, Math.min(total, d));
    let i = cum.findIndex((c) => c >= dd); i = Math.max(1, i);
    const t = (dd - cum[i - 1]) / (seg[i - 1] || 1);
    return [scr[i - 1][0] + (scr[i][0] - scr[i - 1][0]) * t, scr[i - 1][1] + (scr[i][1] - scr[i - 1][1]) * t] as const;
  };

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const intro = 0.08, outro = 0.94;
    const k = Math.min(1, Math.max(0, (p - intro) / (outro - intro)));
    // dwell at each checkpoint: map k onto stops with eased travel between them
    const n = STOPS.length - 1, f = k * n, i = Math.min(n - 1, Math.floor(f)), r = f - i;
    const travel = r < 0.3 ? 0 : r > 0.85 ? 1 : (r - 0.3) / 0.55;
    const e = travel < 0.5 ? 2 * travel * travel : 1 - Math.pow(-2 * travel + 2, 2) / 2;
    const d = stopD[i] + (stopD[i + 1] - stopD[i]) * e;
    const [ax, ay] = at(d);
    const zin = Math.min(1, Math.max(0, (p - 0.02) / 0.08)) * Math.min(1, Math.max(0, (1 - p) / 0.06));
    const z = 1 + 1.25 * zin;
    const cx = vb.x + vb.w / 2, cy = vb.y + vb.h / 2;
    const tx = cx + (ax - cx) * zin, ty = cy + (ay - cy) * zin;
    if (cam.current) cam.current.style.transform = `translate(${12 * zin}%, ${4 * zin}%) scale(${z}) translate(${((cx - tx) / vb.w) * 100}%, ${((cy - ty) / vb.h) * 100}%)`;
    trail.current?.style.setProperty("stroke-dashoffset", String(1 - (p < intro ? 0 : d / total)));
    avatar.current?.setAttribute("transform", `translate(${ax.toFixed(1)} ${ay.toFixed(1)})`);
    avatar.current?.setAttribute("opacity", p < intro * 0.6 ? "0" : "1");
    if (miniDot.current) { miniDot.current.setAttribute("cx", String(((ax - vb.x) / vb.w) * 160)); miniDot.current.setAttribute("cy", String(((ay - vb.y) / vb.h) * 110)); }
    const s = p < intro ? -1 : p > outro ? STOPS.length : r >= 0.85 ? i + 1 : i;
    if (s !== stop) setStop(s);
  });

  const face = ({ x, y, z, w, d, h }: Box) => ({
    r: pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]),
    l: pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]),
    t: pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]),
  });

  const draw = (b: Box, i: number, mini = false) => {
    const f = face(b);
    const lit = b.kind === "gpu";
    const ghost = b.kind === "ghost";
    const fill = (k: "t" | "l" | "r") => ghost || b.kind === "glass" ? (b.kind === "glass" ? "var(--tour-glass)" : "none") : lit ? (k === "t" ? "#FF4A50" : "url(#tour-lit)") : `var(--iso-${k})`;
    const g = (
      <g key={i} stroke={lit ? "#F3A5A7" : "var(--iso-line)"} strokeWidth={mini ? 0.4 : 0.7} strokeLinejoin="round" strokeDasharray={ghost ? "3 3" : undefined}>
        <polygon points={f.r} fill={fill("r")} />
        <polygon points={f.l} fill={fill("l")} />
        <polygon points={f.t} fill={fill("t")} />
        {!mini && (b.kind === "rack" || lit || b.kind === "cage") && (
          <g strokeWidth={0.45} opacity={lit ? 0.9 : 0.7}>
            {Array.from({ length: 7 }, (_, u) => { const zz = b.z + (b.h * (u + 1)) / 8; const a = P(b.x + 0.08, b.y + b.d, zz), c = P(b.x + b.w - 0.08, b.y + b.d, zz); return <line key={u} x1={a[0]} y1={a[1]} x2={c[0]} y2={c[1]} />; })}
            {b.led && Array.from({ length: 4 }, (_, u) => { const q = P(b.x + 0.2, b.y + b.d, b.z + (b.h * (u * 2 + 1.5)) / 8); return <circle key={u} cx={q[0]} cy={q[1]} r={0.9} fill={lit ? "#FFFFFF" : u === 1 ? "#1E9A4B" : "var(--iso-line)"} stroke="none" className={lit || u === 1 ? "tour-led" : undefined} style={{ animationDelay: `${(i * 0.37 + u) % 2}s` }} />; })}
            {b.kind === "cage" && Array.from({ length: 5 }, (_, u) => { const a = P(b.x + (b.w * (u + 0.5)) / 5, b.y + b.d, b.z), c = P(b.x + (b.w * (u + 0.5)) / 5, b.y + b.d, b.z + b.h); return <line key={`c${u}`} x1={a[0]} y1={a[1]} x2={c[0]} y2={c[1]} strokeDasharray="1 1.5" />; })}
          </g>
        )}
      </g>
    );
    return lit && !mini ? <g key={i} filter="url(#tour-glow)">{g}</g> : g;
  };

  // floor tiles inside the hall
  const tiles = useMemo(() => {
    const l: string[] = [];
    for (let x = 8; x <= 30; x += 1.18) { const a = P(x, 2, 0.33), c = P(x, 18, 0.33); l.push(`M${a[0].toFixed(1)},${a[1].toFixed(1)}L${c[0].toFixed(1)},${c[1].toFixed(1)}`); }
    for (let y = 2; y <= 18; y += 1.2) { const a = P(8, y, 0.33), c = P(30, y, 0.33); l.push(`M${a[0].toFixed(1)},${a[1].toFixed(1)}L${c[0].toFixed(1)},${c[1].toFixed(1)}`); }
    return l.join("");
  }, []);
  const fence = useMemo(() => { const q = [P(0.6, 13, 0.2), P(5.4, 13, 0.2), P(5.4, 19, 0.2), P(0.6, 19, 0.2)]; return q.map((p) => p.join(",")).join(" "); }, []);
  const fibre = useMemo(() => [P(34.6, 9.5, 0.21), P(36, 9.5, 0.21)].map((p) => p.join(",")).join(" "), []);
  const trees = useMemo(() => [[1.5, 21.5], [6.5, 23.5], [26, 23.8], [30, 22.6], [33.5, 18], [34.4, 3], [31.5, 1.5]].map(([x, y]) => ({ b: P(x, y, 0.2), t: P(x, y, 1.5) })), []);
  const all = scr.map((p) => p.join(",")).join(" ");

  return (
    <section ref={ref} className="relative border-b border-line" style={{ background: "var(--theme-bg)", height: reduce ? "auto" : "760vh" }} aria-label="Walk through the DOL campus in the Hi-Tech Park">
      <div className={clsx("top-0 h-[100svh] overflow-hidden", !reduce && "sticky")}>
        <div ref={cam} className="absolute inset-0 origin-center will-change-transform" style={{ transition: "transform 90ms linear" }}>
          <svg viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} className="absolute inset-[3%] h-[94%] w-[94%]" preserveAspectRatio="xMidYMid meet" aria-hidden>
            <defs>
              <linearGradient id="tour-lit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E31E24" stopOpacity=".95" /><stop offset="1" stopColor="#B5161B" stopOpacity=".8" /></linearGradient>
              <filter id="tour-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {boxes.slice(0, 2).map((b, i) => draw(b, i))}
            <path d={tiles} stroke="var(--iso-line)" strokeWidth="0.35" opacity="0.5" fill="none" />
            <polygon points={fence} fill="none" stroke="var(--iso-line)" strokeWidth="0.8" strokeDasharray="2 2" />
            <polyline points={fibre} fill="none" stroke="#E31E24" strokeWidth="1.4" strokeDasharray="4 3" className="tour-flow" />
            {trees.map((t, i) => <g key={i} stroke="var(--iso-line)" strokeWidth="0.7"><line x1={t.b[0]} y1={t.b[1]} x2={t.t[0]} y2={t.t[1]} /><circle cx={t.t[0]} cy={t.t[1] - 6} r="9" fill="var(--iso-t)" /></g>)}
            {/* walk path */}
            <polyline points={all} fill="none" stroke="var(--iso-line)" strokeWidth="1.1" strokeDasharray="2 4" strokeLinecap="round" />
            <polyline ref={trail} points={all} fill="none" stroke="#E31E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
            {boxes.slice(2).map((b, i) => draw(b, i + 2))}
            {/* checkpoints */}
            {STOP_ON_PATH.map((pi, i) => {
              const p = scr[pi]; const on = stop >= i;
              return (
                <g key={i} transform={`translate(${p[0]} ${p[1]})`}>
                  <ellipse rx="9" ry="5" fill={on ? "#E31E24" : "var(--iso-t)"} stroke={on ? "#E31E24" : "var(--iso-line)"} strokeWidth="1" opacity={on ? 0.9 : 1} />
                  <line y1="0" y2="-26" stroke={on ? "#E31E24" : "var(--iso-line)"} strokeWidth="1" />
                  <text y="-31" textAnchor="middle" fontFamily="var(--font-jetbrains)" fontSize="7.5" letterSpacing=".6" fill={on ? "#E31E24" : "currentColor"} opacity={stop === i ? 1 : 0.55}>{String(i + 1).padStart(2, "0")} {STOPS[i].k.toUpperCase()}</text>
                </g>
              );
            })}
            {/* avatar */}
            <g ref={avatar} opacity="0">
              <ellipse rx="7" ry="3.5" fill="#000" opacity=".18" />
              <ellipse rx="12" ry="6" fill="none" stroke="#E31E24" strokeWidth="1" className="tour-ping" />
              <rect x="-3.2" y="-15" width="6.4" height="11" rx="3.2" fill="#E31E24" />
              <circle cy="-19" r="3.4" fill="#E31E24" />
            </g>
          </svg>
        </div>
        <div className="pointer-events-none absolute inset-0 md:w-[55%]" style={{ background: "linear-gradient(90deg, var(--theme-bg) 0%, color-mix(in srgb, var(--theme-bg) 85%, transparent) 55%, transparent 100%)" }} />

        {/* copy */}
        <div className="relative flex h-full flex-col justify-end px-5 pb-16 md:justify-center md:px-10 lg:pl-[176px]">
          <motion.div animate={{ opacity: stop === -1 || stop === STOPS.length ? 1 : 0, y: stop === -1 || stop === STOPS.length ? 0 : -16 }} transition={{ duration: 0.45 }} className={clsx("flex max-w-[540px] flex-col gap-6", !(stop === -1 || stop === STOPS.length) && "pointer-events-none absolute")}>
            <span className="label text-soft">AI infrastructure · Walkthrough</span>
            <h2 className="h-display text-[36px] leading-[0.98] tracking-[-0.05em] md:text-[48px]">Planned AI infrastructure.<br /><span className="text-red">In development.</span></h2>
            <p className="max-w-[460px] text-[17px] leading-[27px] text-body">Walk through the power, cooling, racks and connectivity behind the planned GPU platform: eight GPUs to start, with a proposed path to sixteen.</p>
            <div className="pointer-events-auto flex flex-wrap gap-3 pt-1">
              <PrimaryButton href="/data-center/ai-infrastructure#enquiry">Discuss your use case</PrimaryButton>
              <SecondaryButton href="/data-center/ai-infrastructure">Explore AI infrastructure</SecondaryButton>
            </div>
            {stop === -1 && !reduce && <span className="label pt-3 text-soft">Scroll to walk the campus ↓</span>}
          </motion.div>
          {STOPS.map((s, i) => (
            <motion.div key={s.k} initial={false} animate={{ opacity: stop === i ? 1 : 0, y: stop === i ? 0 : 18 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }} className="pointer-events-none absolute bottom-16 left-5 right-5 flex max-w-[420px] flex-col gap-4 md:bottom-auto md:left-10 lg:left-[176px]" aria-hidden={stop !== i}>
              <span className="label flex items-center gap-3"><span className="text-red">Checkpoint {String(i + 1).padStart(2, "0")}/{String(STOPS.length).padStart(2, "0")}</span><span className="text-soft">{s.k}</span></span>
              <h3 className="h-display text-[30px] leading-[1.05] tracking-[-0.04em] md:text-[40px]">{s.t}</h3>
              <p className="text-[17px] leading-[27px] text-body">{s.b}</p>
            </motion.div>
          ))}
        </div>

        {/* HUD: minimap + objectives */}
        <div className="tour-hud pointer-events-none absolute right-5 top-24 hidden w-[200px] flex-col gap-3 rounded-[6px] p-3 md:flex lg:right-10">
          <div className="label flex justify-between text-soft"><span>Campus map</span><span className="text-red">{stop >= 0 && stop < STOPS.length ? `${stop + 1}/${STOPS.length}` : "—"}</span></div>
          <svg viewBox="0 0 160 110" className="h-auto w-full">
            <g transform={`scale(${160 / vb.w} ${110 / vb.h}) translate(${-vb.x} ${-vb.y})`}>{boxes.filter((b) => b.z < 3).map((b, i) => draw(b, i, true))}</g>
            <circle ref={miniDot} r="3.5" fill="#E31E24" className="tour-ping-dot" />
          </svg>
          <ol className="flex flex-col gap-1.5">
            {STOPS.map((s, i) => (
              <li key={s.k} className={clsx("label flex items-center gap-2 transition-colors", stop === i ? "text-[var(--theme-fg)]" : stop > i ? "text-soft line-through decoration-red/60" : "text-soft")}>
                <i className={clsx("block h-1.5 w-1.5 shrink-0 rounded-full border", stop >= i ? "border-red bg-red" : "border-current")} />{s.k}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
