"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Page-wide vertical guide lines (aligned to the content rails). As you scroll, a short bright
 * segment travels down each line at a slightly different pace, so the grid feels alive without noise.
 */
// Only lines that already exist in the layout: the section rail divider (120px, desktop).
const LINES = [
  { left: "119px", speed: 1, cls: "hidden lg:block" },
  { left: "119px", speed: 0.55, cls: "hidden lg:block" },
];

function Line({ left, speed, cls }: (typeof LINES)[number]) {
  const { scrollYProgress } = useScroll();
  const s = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });
  // each comet loops several times over the page; position in viewport heights
  const top = useTransform(s, (p) => `${((p * speed * 7 + speed * 0.37) % 1) * 110 - 15}vh`);
  return (
    <div className={`absolute inset-y-0 w-px ${cls}`} style={{ left }}>
      <motion.div style={{ top }} className="absolute -left-px h-[22vh] w-[3px] bg-gradient-to-b from-transparent via-red/70 to-transparent" />
    </div>
  );
}

export default function ScrollLines() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[45]">
      {LINES.map((l, i) => <Line key={i} {...l} />)}
    </div>
  );
}
