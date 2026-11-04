"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle dot-grid texture. At rest: faint static dots (one paint).
 * On pointer hover over the parent: dots near the cursor brighten and bulge outward (lens),
 * a few twinkle red. rAF runs only while hovered or settling.
 */
export default function DotField({ gap = 18, className = "" }: { gap?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const host = cv.parentElement!;
    const ctx = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, raf = 0;
    let mx = -9999, my = -9999, amt = 0, target = 0;
    let seeds: number[] = [];

    const fg = () => (document.documentElement.dataset.theme === "light" ? "11,11,11" : "255,255,255");
    const size = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio, 2);
      w = r.width; h = r.height;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.ceil(w / gap + 1) * Math.ceil(h / gap + 1);
      seeds = Array.from({ length: n }, () => Math.random());
      draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const c = fg();
      const R = 110;
      let k = 0;
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap, k++) {
          const dx = x - mx, dy = y - my;
          const d = Math.hypot(dx, dy);
          const f = amt * Math.max(0, 1 - d / R);
          const push = f * f * 10;
          const px = d > 0 ? x + (dx / d) * push : x;
          const py = d > 0 ? y + (dy / d) * push : y;
          const s = seeds[k] ?? 0;
          const tw = amt > 0 && s > 0.965 ? 0.5 + 0.5 * Math.sin(t / 260 + s * 40) : 0;
          if (tw > 0.6 && f > 0.05) {
            ctx.fillStyle = `rgba(227,30,36,${0.4 + 0.6 * f})`;
          } else {
            ctx.fillStyle = `rgba(${c},${0.1 + f * 0.55})`;
          }
          const r = 0.7 + f * 0.9;
          ctx.fillRect(px - r, py - r, r * 2, r * 2);
        }
      }
    };

    const loop = (t: number) => {
      amt += (target - amt) * 0.12;
      draw(t);
      if (Math.abs(target - amt) > 0.005 || target > 0) raf = requestAnimationFrame(loop);
      else { amt = target; draw(t); raf = 0; }
    };
    const kick = () => { if (!raf && !reduce) raf = requestAnimationFrame(loop); };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      target = 1; kick();
    };
    const onLeave = () => { target = 0; kick(); };

    const ro = new ResizeObserver(size);
    ro.observe(host);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    const onTheme = () => draw(0);
    addEventListener("dol:theme", onTheme);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      removeEventListener("dol:theme", onTheme);
    };
  }, [gap]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
