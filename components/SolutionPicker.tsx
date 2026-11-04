"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";

const OPTIONS = [
  { k: "Operations", t: "Bring network, service desk and field work into one operating model.", problem: "Teams, tools and incidents move separately, so ownership becomes unclear under pressure.", builds: "ISP operations, NOC and service-desk workflows, field coordination, evidence and escalation boundaries.", outcome: "A governed operating model with named owners and a traceable service journey.", ask: ["Current workflow and tools", "Authority and escalation", "Integration and evidence gaps"] },
  { k: "Multi-site", t: "Connect offices, campuses or branches as one resilient network.", problem: "Each site is connected differently, so faults and changes are hard to see end to end.", builds: "Primary and backup links, addressing, routing policy, office networking and monitoring per site.", outcome: "One designed network with documented paths and a single escalation route.", ask: ["Site list and users", "Today's links and providers", "Downtime tolerance"] },
  { k: "Hosting & DR", t: "Move critical systems closer, with a recovery plan you can test.", problem: "Systems live abroad or in a single room, so latency and recovery are guesswork.", builds: "Colocation, VPS or hosting in Bangladesh, BDIX connectivity and a recovery runbook.", outcome: "Local infrastructure with a tested recovery path and clear ownership.", ask: ["Systems and data size", "Recovery time needed", "Compliance constraints"] },
];

/** Segmented picker; the detail panel morphs between operating problems. */
export default function SolutionPicker() {
  const [i, setI] = useState(0);
  const o = OPTIONS[i];
  return (
    <div className="flex flex-col lg:flex-row">
      <LayoutGroup id="sol">
        <div role="tablist" aria-label="Operating problems" className="flex flex-col gap-px border-b border-line bg-line lg:w-[420px] lg:shrink-0 lg:border-b-0 lg:border-r">
          {OPTIONS.map((x, k) => (
            <button key={x.k} role="tab" aria-selected={k === i} onClick={() => setI(k)} className="relative flex flex-col gap-2 bg-white px-7 py-7 text-left">
              {k === i && <motion.span layoutId="sol-tab" transition={{ type: "spring", duration: 0.45, bounce: 0.15 }} className="absolute inset-0 bg-ink" />}
              <span className={clsx("label relative transition-colors", k === i ? "text-red" : "text-mute")}>0{k + 1} · {x.k}</span>
              <span className={clsx("relative text-[19px] font-medium leading-7 transition-colors", k === i ? "text-white" : "text-ink")}>{x.t}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>
      <div className="min-w-0 flex-1 bg-paper">
        <AnimatePresence mode="wait">
          <motion.div key={o.k} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} className="grid grid-cols-1 gap-px bg-line md:grid-cols-3">
            {[["The operating problem", o.problem], ["What DOL structures", o.builds], ["Intended outcome", o.outcome]].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-4 bg-white p-8"><span className="label text-mute">{k}</span><span className="text-[17px] leading-7">{v}</span></div>
            ))}
            <div className="flex flex-col gap-4 bg-paper p-8 md:col-span-3">
              <span className="label text-mute">Bring to the first conversation</span>
              <div className="flex flex-wrap gap-2">{o.ask.map((a) => <span key={a} className="rounded-full border border-ink px-4 py-2 text-[15px]">{a}</span>)}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
