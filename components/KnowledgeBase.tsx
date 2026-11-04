"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { KB, KB_CATEGORIES } from "@/lib/content";

/** Search + category filter; articles expand inline. Category can be deep-linked with ?c=. */
export default function KnowledgeBase() {
  const params = useSearchParams();
  const initial = params.get("c");
  const [cat, setCat] = useState<string>(initial && (KB_CATEGORIES as readonly string[]).includes(initial) ? initial : "All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return KB.filter((a) => (cat === "All" || a.cat === cat) && (!s || `${a.t} ${a.b} ${a.steps.join(" ")}`.toLowerCase().includes(s)));
  }, [cat, q]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6 border-b border-line px-5 py-8 md:px-10 lg:px-14">
        <div className="flex items-center gap-3 rounded-full border border-[#CFCCC4] bg-paper px-5 focus-within:border-ink">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.6" aria-hidden><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search — e.g. ONU lights, DNS, invoice" aria-label="Search articles" className="h-14 min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-mute" />
          <span className="label shrink-0 text-mute">{list.length} found</span>
        </div>
        <LayoutGroup id="kb">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["All", ...KB_CATEGORIES].map((c) => (
              <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={clsx("relative shrink-0 rounded-[6px] border px-4 py-2.5 text-[14px] transition-colors", cat === c ? "border-red keep-white text-white" : "border-[#CFCCC4] text-body hover:border-ink")}>
                {cat === c && <motion.span layoutId="kb-cat" transition={{ type: "spring", duration: 0.4, bounce: 0.15 }} className="absolute inset-0 rounded-full bg-red" />}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>
      <motion.ul layout className="flex flex-col">
        <AnimatePresence mode="popLayout">
          {list.map((a) => {
            const on = open === a.t;
            return (
              <motion.li layout key={a.t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-line bg-white last:border-b-0">
                <button onClick={() => setOpen(on ? null : a.t)} aria-expanded={on} className="flex w-full items-center gap-5 px-5 py-6 text-left transition-colors hover:bg-paper md:px-10 lg:px-14">
                  <span className="label hidden w-[160px] shrink-0 text-red md:block">{a.cat}</span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="label text-red md:hidden">{a.cat}</span>
                    <span className="text-[18px] font-medium md:text-[20px]">{a.t}</span>
                    <span className="text-[15px] text-body">{a.b}</span>
                  </span>
                  <span aria-hidden className={clsx("text-[20px] transition-transform duration-300", on && "rotate-90")}>→</span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
                      <ol className="flex flex-col gap-3 px-5 pb-8 md:px-10 md:pl-[220px] lg:px-14 lg:pl-[236px]">
                        {a.steps.map((s, i) => <li key={s} className="flex gap-4 text-[16px] leading-7"><span className="font-mono text-[13px] text-red">{i + 1}</span>{s}</li>)}
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
      {list.length === 0 && <p className="px-5 py-10 text-[16px] text-body md:px-10 lg:px-14">Nothing matches “{q}”. Try fewer words, or use guided support.</p>}
    </div>
  );
}
