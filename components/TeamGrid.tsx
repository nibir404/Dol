"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import { LEADERSHIP, TEAMS, type Person } from "@/lib/content";

function Portrait({ p, big }: { p: Person; big?: boolean }) {
  return (
    <motion.figure layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="group flex flex-col bg-white">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper">
        <Image src={p.photo} alt={`${p.name}, ${p.role}`} fill sizes={big ? "(min-width:768px) 33vw, 100vw" : "(min-width:1024px) 20vw, 50vw"} className="object-cover grayscale transition duration-500 ease-out group-hover:scale-[1.04] group-hover:grayscale-0" />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-red transition-transform duration-500 group-hover:scale-x-100" />
      </div>
      <figcaption className="flex flex-col gap-1 px-5 py-4">
        <span className={clsx("font-medium tracking-[-0.01em]", big ? "text-[20px]" : "text-[16px]")}>{p.name}</span>
        <span className="text-[14px] text-body">{p.role}</span>
      </figcaption>
    </motion.figure>
  );
}

/** Leadership up top; operating teams behind a filter so the grid stays scannable. */
export default function TeamGrid() {
  const [team, setTeam] = useState(TEAMS[0].name);
  const t = TEAMS.find((x) => x.name === team)!;
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-3">{LEADERSHIP.map((p) => <Portrait key={p.name} p={p} big />)}</div>
      <div className="flex flex-col gap-4 border-y border-line px-5 py-6 md:px-10 lg:px-14">
        <LayoutGroup id="team">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {TEAMS.map((x) => (
              <button key={x.name} onClick={() => setTeam(x.name)} aria-pressed={team === x.name} className={clsx("relative shrink-0 rounded-[6px] border px-4 py-2.5 text-[14px] transition-colors", team === x.name ? "border-red keep-white text-white" : "border-[#CFCCC4] text-body hover:border-ink")}>
                {team === x.name && <motion.span layoutId="team-pill" transition={{ type: "spring", duration: 0.4, bounce: 0.15 }} className="absolute inset-0 rounded-full bg-red" />}
                <span className="relative">{x.name}</span><span className={clsx("relative ml-2 font-mono text-[11px]", team === x.name ? "text-red" : "text-mute")}>{x.people.length}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
        <p className="text-[15px] text-body">{t.scope}</p>
      </div>
      <motion.div layout className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-5">
        <AnimatePresence mode="popLayout">{t.people.map((p) => <Portrait key={p.name} p={p} />)}</AnimatePresence>
      </motion.div>
    </div>
  );
}
