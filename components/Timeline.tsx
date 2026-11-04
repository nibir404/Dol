"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import { TIMELINE } from "@/lib/content";

/** Chapter rail: click or use arrow keys to move between chapters; the progress line follows. */
export default function Timeline() {
  const [i, setI] = useState(0);
  const c = TIMELINE[i];
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setI((x) => Math.min(x + 1, TIMELINE.length - 1));
    if (e.key === "ArrowLeft") setI((x) => Math.max(x - 1, 0));
  };
  return (
    <div className="flex flex-col">
      <div role="tablist" aria-label="Company chapters" onKeyDown={onKey} className="relative grid grid-cols-5 border-b border-line-dark">
        <motion.span aria-hidden className="absolute bottom-0 left-0 h-[2px] bg-red" animate={{ width: `${((i + 1) / TIMELINE.length) * 100}%` }} transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }} />
        {TIMELINE.map((t, k) => (
          <button key={t.n} role="tab" aria-selected={k === i} tabIndex={k === i ? 0 : -1} onClick={() => setI(k)} className="flex flex-col gap-1 px-3 py-6 text-left transition-colors md:px-8">
            <span className={clsx("font-mono text-[11px]", k <= i ? "text-red" : "text-mute")}>{t.n}</span>
            <span className={clsx("font-mono text-[18px] font-medium transition-colors md:text-[26px]", k === i ? "text-white" : "text-mute hover:text-soft")}>{t.year}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={c.n} initial={{ opacity: 0, y: 16, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }} className="grid min-h-[260px] grid-cols-1 gap-8 px-5 py-12 md:grid-cols-[1fr_1.4fr] md:px-10 lg:px-14">
          <span className="text-[44px] font-medium leading-[1] tracking-[-0.04em] md:text-[64px]">{c.t}</span>
          <p className="max-w-[560px] self-end text-[18px] leading-8 text-soft">{c.b}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
