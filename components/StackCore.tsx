"use client";

import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Exploded view of the DOL network stack: fibre plant → BDIX edge → compute → storage, as four floating
 * isometric decks wired by light. It assembles when scrolled into view; moving the pointer pulls the decks
 * apart and tilts the stack. Same block language and theme tokens as IsoDiagram.
 */
const S = 26, C = Math.cos(Math.PI / 6);
const P = (x: number, y: number, z = 0) => [(x - y) * C * S, (x + y) * 0.5 * S - z * S] as const;
type Bx = { x: number; y: number; z: number; w: number; d: number; h: number; lit?: boolean };
const poly = (q: [number, number, number][]) => q.map((v) => P(...v).map((n) => n.toFixed(1)).join(",")).join(" ");

function Block({ b }: { b: Bx }) {
  const { x, y, z, w, d, h, lit } = b;
  const st = lit ? "#F3A5A7" : "var(--iso-line)";
  return (
    <g stroke={st} strokeWidth={0.8} strokeLinejoin="round">
      <polygon points={poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]])} fill={lit ? "#B5161B" : "var(--iso-r)"} />
      <polygon points={poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={lit ? "#E31E24" : "var(--iso-l)"} />
      <polygon points={poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={lit ? "#FF5257" : "var(--iso-t)"} />
    </g>
  );
}

const DECK = 5;
const LAYERS: { name: string; parts: Bx[] }[] = [
  // storage: drive shelves
  { name: "Storage", parts: Array.from({ length: 4 }, (_, i) => ({ x: 0.5 + i * 1.1, y: 0.8, z: 0.3, w: 0.9, d: 3.4, h: 0.5 })) },
  // compute: GPU / server sleds, two lit
  { name: "Compute", parts: [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => ({ x: 0.5 + c * 1.45, y: 0.5 + r * 1.45, z: 0.3, w: 1.2, d: 1.2, h: 0.45 + ((r + c) % 2) * 0.25, lit: r === 1 && c === 1 }))) },
  // BDIX edge: core routers in a row with ports
  { name: "BDIX edge", parts: [{ x: 0.6, y: 1.6, z: 0.3, w: 3.8, d: 0.9, h: 0.55, lit: true }, { x: 0.6, y: 0.4, z: 0.3, w: 1.6, d: 0.9, h: 0.4 }, { x: 2.8, y: 0.4, z: 0.3, w: 1.6, d: 0.9, h: 0.4 }, { x: 0.6, y: 3.0, z: 0.3, w: 3.8, d: 0.9, h: 0.35 }] },
  // fibre plant: splice trays + ducts
  { name: "Fibre", parts: [{ x: 0.5, y: 0.5, z: 0.3, w: 1.2, d: 4, h: 0.3 }, { x: 2.0, y: 0.5, z: 0.3, w: 0.5, d: 4, h: 0.2 }, { x: 2.8, y: 0.5, z: 0.3, w: 0.5, d: 4, h: 0.2 }, { x: 3.6, y: 0.5, z: 0.3, w: 0.9, d: 4, h: 0.3 }] },
];

export default function StackCore() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18 }), sy = useSpring(my, { stiffness: 70, damping: 18 });
  const spread = useTransform(sy, [-0.5, 0.5], [1.25, 0.8]);
  const rot = useTransform(sx, [-0.5, 0.5], [-5, 5]);

  const corners = [P(0, 0, 0), P(DECK, 0, 0), P(DECK, DECK, 0), P(0, DECK, 0), P(0, 0, 13)];
  const vx = Math.min(...corners.map((c) => c[0])) - 40, vy = Math.min(...corners.map((c) => c[1])) - 40;
  const vw = Math.max(...corners.map((c) => c[0])) + 40 - vx, vh = Math.max(...corners.map((c) => c[1])) + 60 - vy;
  const [cx, cy] = P(DECK / 2, DECK / 2, 0);

  return (
    <div
      ref={ref}
      onPointerMove={(e) => { if (reduce || e.pointerType !== "mouse") return; const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5); }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
      className="relative aspect-square w-full max-w-[520px]"
      aria-hidden
    >
      <motion.svg viewBox={`${vx} ${vy} ${vw} ${vh}`} className="h-full w-full overflow-visible" style={{ rotate: rot }}>
        {/* light streams through the stack */}
        {[[1.2, 1.2], [3.8, 1.2], [1.2, 3.8], [3.8, 3.8], [2.5, 2.5]].map(([x, y], i) => {
          const a = P(x, y, 0.3), b = P(x, y, 3 * 3.2 + 0.6);
          return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#E31E24" strokeWidth={i === 4 ? 1.6 : 0.8} strokeDasharray="3 5" opacity={i === 4 ? 0.9 : 0.45} className="iso-cable" />;
        })}
        {LAYERS.map((L, k) => (
          <motion.g
            key={L.name}
            initial={reduce ? false : { opacity: 0, y: -60 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.12 * (LAYERS.length - k), ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.g style={{ y: useTransform(spread, (s) => -k * 3.2 * S * s) }}>
              <g className={reduce ? undefined : "stack-bob"} style={{ animationDelay: `${k * 0.5}s` }}>
                <Block b={{ x: 0, y: 0, z: 0, w: DECK, d: DECK, h: 0.3 }} />
                {/* deck edge ticks */}
                {Array.from({ length: 9 }, (_, i) => { const a = P(0.5 * (i + 1), DECK, 0.08), c = P(0.5 * (i + 1), DECK, 0.22); return <line key={i} x1={a[0]} y1={a[1]} x2={c[0]} y2={c[1]} stroke="var(--iso-line)" strokeWidth={0.6} />; })}
                {[...L.parts].sort((a, b) => a.x + a.y - (b.x + b.y)).map((b, i) => <Block key={i} b={b} />)}
                <circle cx={P(DECK, 0.3, 0.15)[0]} cy={P(DECK, 0.3, 0.15)[1]} r={1.6} fill={k === 1 || k === 2 ? "#E31E24" : "#1E9A4B"} className="iso-led" />
              </g>
            </motion.g>
          </motion.g>
        ))}
        <ellipse cx={cx} cy={cy + 30} rx={vw * 0.32} ry={vw * 0.08} fill="#E31E24" opacity={0.08} />
      </motion.svg>
    </div>
  );
}
