"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Refresh loader: a signal that "connects" — Wi-Fi arcs light up one by one, a red line fills and a counter runs
 * to 100 while the page loads, then the curtain lifts. Shows for at least ~0.9s, at most until load + 200ms.
 */
export default function Loader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0, loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    addEventListener("load", onLoad);
    const tick = (t: number) => {
      const el = t - start;
      // ease toward 90 until loaded, then finish
      const target = loaded && el > 900 ? 100 : Math.min(90, (el / 1200) * 90);
      setN((v) => { const nv = v + (target - v) * 0.12; return nv > 99.5 ? 100 : nv; });
      if (loaded && el > 900 && n >= 99.5) { setDone(true); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const hardStop = setTimeout(() => setDone(true), 4000);
    return () => { cancelAnimationFrame(raf); clearTimeout(hardStop); removeEventListener("load", onLoad); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (n >= 100) { const t = setTimeout(() => setDone(true), 200); return () => clearTimeout(t); } }, [n]);
  useEffect(() => { document.documentElement.style.overflow = done ? "" : "hidden"; }, [done]);

  const pct = Math.round(n);
  const arcs = [0.25, 0.5, 0.75];
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          role="status"
          aria-live="polite"
          aria-label={`Loading ${pct}%`}
          exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8"
          style={{ background: "var(--theme-bg)", color: "var(--theme-fg)", clipPath: "inset(0 0 0% 0)" }}
        >
          <svg width="88" height="88" viewBox="0 0 24 24" fill="none" strokeLinecap="round" aria-hidden>
            {[
              "M2.5 9a14 14 0 0 1 19 0",
              "M5.5 12.5a9.5 9.5 0 0 1 13 0",
              "M8.5 16a5 5 0 0 1 7 0",
            ].map((d, i) => (
              <g key={d}>
                <path d={d} stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.6" />
                <path d={d} stroke={n / 100 > arcs[2 - i] ? "#E31E24" : "currentColor"} strokeWidth="1.6" pathLength={1}
                  style={{ strokeDasharray: 1, strokeDashoffset: Math.max(0, 1 - Math.max(0, (n / 100 - (2 - i) * 0.25) / 0.25)), opacity: n / 100 > (2 - i) * 0.25 + 0.01 ? 1 : 0, transition: "stroke .3s" }} />
              </g>
            ))}
            <circle cx="12" cy="19.5" r="1.4" fill="#E31E24" className={reduce ? undefined : "loader-dot"} />
          </svg>
          <div className="flex w-[220px] flex-col gap-3">
            <div className="h-px w-full overflow-hidden" style={{ background: "color-mix(in srgb, var(--theme-fg) 15%, transparent)" }}>
              <div className="h-full" style={{ width: `${n}%`, background: "#E31E24" }} />
            </div>
            <div className="label flex justify-between" style={{ color: "color-mix(in srgb, var(--theme-fg) 70%, transparent)" }}>
              <span>{pct < 100 ? "Connecting" : "Connected"}</span>
              <span className="tabular-nums" style={{ color: "var(--theme-fg)" }}>{String(pct).padStart(3, "0")}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
