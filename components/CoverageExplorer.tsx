"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { CONTACT, POPS } from "@/lib/content";
import { PrimaryButton } from "./Button";

/** Searchable district → POP explorer. Filtering is instant; results animate with layout. */
export default function CoverageExplorer() {
  const districts = Object.keys(POPS);
  const [active, setActive] = useState(districts[0]);
  const [q, setQ] = useState("");
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return null;
    return Object.entries(POPS).flatMap(([d, list]) => list.filter((p) => `${p.name} ${p.area} ${d}`.toLowerCase().includes(s)).map((p) => ({ ...p, d })));
  }, [q]);
  const list = hits ?? POPS[active].map((p) => ({ ...p, d: active }));

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="border-b border-line p-5 md:p-10 lg:w-[420px] lg:shrink-0 lg:border-b-0 lg:border-r lg:p-12">
        <label className="flex flex-col gap-3">
          <span className="label text-mute">Search an area</span>
          <div className="flex items-center gap-3 rounded-full border border-[#CFCCC4] bg-paper px-5 focus-within:border-ink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.6" aria-hidden><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Ashulia, Sarail, Boalia" className="h-14 min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-mute" />
            {q && <button onClick={() => setQ("")} className="label text-mute hover:text-ink">Clear</button>}
          </div>
        </label>
        <div className="mt-8">
          <span className="label text-mute">Districts</span>
          <LayoutGroup id="districts">
            <ul className="mt-3 flex flex-wrap gap-2">
              {districts.map((d) => {
                const on = !hits && active === d;
                return (
                  <li key={d}>
                    <button onClick={() => { setActive(d); setQ(""); }} aria-pressed={on} className={clsx("relative flex items-center gap-2 rounded-full border px-3.5 py-2 text-[14px] transition-colors duration-200", on ? "border-ink text-white" : "border-[#CFCCC4] text-body hover:border-ink hover:text-ink")}>
                      {on && <motion.span layoutId="district" transition={{ type: "spring", duration: 0.4, bounce: 0.15 }} className="absolute inset-0 rounded-full bg-ink" />}
                      <span className="relative">{d}</span>
                      <span className={clsx("relative font-mono text-[11px]", on ? "text-red" : "text-mute")}>{POPS[d].length}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </div>
      </div>
      <div className="min-w-0 flex-1 bg-paper">
        <div className="flex items-center justify-between border-b border-line px-5 py-5 md:px-10">
          <span className="text-[22px] font-medium tracking-[-0.02em]">{hits ? `${hits.length} result${hits.length === 1 ? "" : "s"} for “${q}”` : `${active}`}</span>
          <span className="label text-mute">{active === "Dhaka" && !hits ? "Plus anywhere in core Dhaka" : "Network points"}</span>
        </div>
        <motion.ul layout className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.li
                layout
                key={`${p.d}-${p.name}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.025 } }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="group flex items-center justify-between gap-4 bg-white px-6 py-5 transition-colors duration-200 hover:bg-paper"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
                    <span className="absolute h-3 w-3 animate-ping rounded-full bg-red/40 motion-reduce:animate-none" />
                    <span className="h-2 w-2 rounded-full bg-red" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-[17px] font-medium">{p.name}</span>
                    <span className="truncate text-[14px] text-body">{p.area}</span>
                  </span>
                </span>
                <a href={`${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi DOL, I'd like to check internet near ${p.name}, ${p.area}.`)}`} className="label shrink-0 text-ink opacity-60 transition-opacity group-hover:opacity-100">Check →</a>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        {hits && hits.length === 0 && (
          <div className="flex flex-col items-start gap-4 bg-white px-6 py-10 md:px-10">
            <span className="text-[18px] font-medium">No listed point matches yet.</span>
            <span className="text-[15px] text-body">That isn&apos;t a no — ask DOL Sales to check your exact address.</span>
            <PrimaryButton size="sm" href={`${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi DOL, can you check internet at ${q}?`)}`}>Ask about {q}</PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
