"use client";

import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ease = [0.23, 1, 0.32, 1] as const;

/** Fade/rise once on enter. Stagger children by passing `delay`. */
export function Reveal({ children, delay = 0, y = 24, className, as = "div" }: { children: React.ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "span" | "li" }) {
  const M = motion[as];
  return (
    <M
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease, delay }}
      className={className}
    >
      {children}
    </M>
  );
}

/** Clip-path reveal for illustrations: draws in from the bottom. */
export function ImageReveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Counts up once when visible. */
export function CountUp({ to, plain, suffix = "", className }: { to: number; plain?: boolean; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.2, ease: [0.23, 1, 0.32, 1], onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className={className}>
      {plain ? v : v.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
