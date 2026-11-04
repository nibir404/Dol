"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Tag } from "./kit";
import { Reveal } from "./Reveal";

/**
 * A wall of add-in cards drawn as precise line-art (PCIe edge, bracket, shroud, fan) and wired on a bus.
 * Scrolling through the section brings GPU systems online in a wave from the centre: card outlines turn
 * DOL red, the shroud and fan are drawn in, the fan starts turning and the bus segment to its neighbour lights up.
 * The cursor wakes nearby cards briefly. Everything is one SVG with <symbol>s; state is attributes + CSS.
 */
const COLS = 9, ROWS = 6, CW = 330, CH = 144;

function Card() {
  return (
    <symbol id="gg-card" viewBox="0 0 320 132" overflow="visible">
      {/* board + PCIe edge + bracket */}
      <path className="gg-board" d="M4 4 H296 V110 H174 l-6 6 H150 l-6 -6 H22 l-6 6 H4 Z" />
      <path className="gg-fine" d="M150 116 v12 h70 v-12 M156 120 h58 M156 124 h58" />
      <path className="gg-fine" d="M296 4 h14 v4 h-10 v120 h-4" />
      <path className="gg-fine" d="M110 4 v4 h50 v-4 M170 4 v4 h50 v-4 M230 4 v4 h50 v-4" />
      <circle className="gg-fine" cx="12" cy="12" r="2.5" />
      {/* shroud (drawn in when online) */}
      <g className="gg-gpu">
        <rect x="8" y="8" width="284" height="98" rx="12" />
        <rect x="14" y="14" width="272" height="86" rx="9" className="gg-fine" />
        <path className="gg-fine" d="M30 18 H96 l38 38 l-38 38 H30 Q20 94 20 84 V28 Q20 18 30 18 Z" />
        <path className="gg-fine" d="M96 18 l52 39 M96 94 l52 -39 M148 57 h18" />
        <path className="gg-hatch" d="M232 18 h44 q6 0 6 6 v66 q0 6 -6 6 h-44 a44 44 0 0 0 0 -78 Z" />
        <g className="gg-fan" style={{ transformOrigin: "210px 57px" }}>
          <circle cx="210" cy="57" r="44" className="gg-fine" />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} className="gg-fine" d="M210 57 m0 -16 q22 -6 30 -26" transform={`rotate(${i * 40} 210 57)`} />
          ))}
          <circle cx="210" cy="57" r="15" />
        </g>
      </g>
    </symbol>
  );
}

export default function GpuGrid() {
  const ref = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const [online, setOnline] = useState(reduce ? 999 : 0);

  // order cards by distance from the centre, with a little jitter so the wave feels organic
  const order = useMemo(() => {
    const cx = (COLS - 1) / 2, cy = (ROWS - 1) / 2;
    const cells = Array.from({ length: COLS * ROWS }, (_, i) => ({ i, c: i % COLS, r: Math.floor(i / COLS) }));
    const rank = cells.map((k) => ({ ...k, d: Math.hypot((k.c - cx) * 0.7, k.r - cy) + ((k.i * 37) % 7) * 0.08 })).sort((a, b) => a.d - b.d);
    const pos: number[] = []; rank.forEach((k, n) => (pos[k.i] = n));
    return pos;
  }, []);
  const gpuCols = new Set([2, 4, 6]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduce) return;
    const k = Math.round(Math.min(1, Math.max(0, (p - 0.15) / 0.5)) * COLS * ROWS * 0.62);
    if (k !== online) setOnline(k);
  });

  // cursor wake: cards near the pointer get a temporary highlight
  useEffect(() => {
    const el = svg.current;
    if (!el || reduce) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * COLS * CW, y = ((e.clientY - r.top) / r.height) * ROWS * CH;
        el.querySelectorAll<SVGGElement>("[data-cell]").forEach((g) => {
          const c = +g.dataset.c!, rr = +g.dataset.r!;
          const d = Math.hypot(c * CW + CW / 2 - x, rr * CH + CH / 2 - y);
          g.dataset.near = d < 260 ? "1" : "0";
        });
      });
    };
    const leave = () => el.querySelectorAll<SVGGElement>("[data-cell]").forEach((g) => (g.dataset.near = "0"));
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); cancelAnimationFrame(raf); };
  }, [reduce]);

  const live = Math.min(online, COLS * ROWS);
  return (
    <section ref={ref} className="relative overflow-hidden border-b border-line" style={{ background: "var(--theme-bg)" }}>
      <div className="relative z-10 flex flex-col gap-5 px-5 pb-10 pt-20 md:flex-row md:items-end md:justify-between md:px-10 lg:px-[176px]">
        <div className="flex flex-col gap-5">
          <Reveal><Tag>GPU capacity · Ashulia</Tag></Reveal>
          <Reveal delay={0.05}><h2 className="h-display text-[36px] leading-[1.02] md:text-[48px]">Capacity planned,<br /> card by card.</h2></Reveal>
        </div>
        <Reveal delay={0.1} className="flex items-baseline gap-3 font-mono">
          <span className="text-[44px] font-medium tabular-nums tracking-[-0.03em] text-red">08</span>
          <span className="label text-soft">GPUs planned · Proposed path to 16</span>
        </Reveal>
      </div>
      <div className="relative">
        <svg ref={svg} viewBox={`0 0 ${COLS * CW} ${ROWS * CH}`} className="gg block h-auto w-[180%] max-w-none -translate-x-[22%] md:w-[130%] md:-translate-x-[12%]" aria-hidden>
          <defs><Card /></defs>
          {Array.from({ length: COLS * ROWS }, (_, i) => {
            const c = i % COLS, r = Math.floor(i / COLS);
            const on = order[i] < live;
            const gpu = on && (gpuCols.has(c) || order[i] < 4);
            const x = c * CW, y = r * CH;
            return (
              <g key={i} data-cell data-c={c} data-r={r} data-on={on ? "1" : "0"} data-gpu={gpu ? "1" : "0"} style={{ ["--d" as string]: `${(order[i] % 6) * 40}ms` }}>
                {/* bus: right neighbour and down */}
                <path className="gg-bus" d={`M${x + 300} ${y + 57} H${x + CW}`} />
                <path className="gg-bus" d={`M${x + 160} ${y + 132} V${y + CH}`} />
                <use href="#gg-card" x={x} y={y} width="320" height="132" />
              </g>
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, var(--theme-bg) 0%, transparent 14%, transparent 80%, var(--theme-bg) 100%), linear-gradient(90deg, var(--theme-bg) 0%, transparent 12%, transparent 88%, var(--theme-bg) 100%)" }} />
      </div>
    </section>
  );
}
