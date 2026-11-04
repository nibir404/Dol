"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import { CONTACT, VPS_PLANS } from "@/lib/content";
import { PrimaryButton } from "./Button";

/** Slider + tabs to pick a VPS plan; the spec sheet morphs between plans. Arrow keys work on the slider. */
export default function VpsSizer() {
  const [i, setI] = useState(2);
  const p = VPS_PLANS[i];
  const specs = [["vCPU", p.cpu], ["RAM", p.ram], ["NVMe", p.disk], ["Bandwidth", p.bw]];
  return (
    <div className="flex flex-col">
      <LayoutGroup id="vps">
        <div role="tablist" aria-label="VPS plans" className="grid grid-cols-3 gap-px border-b border-line bg-line md:grid-cols-6">
          {VPS_PLANS.map((x, k) => (
            <button key={x.name} role="tab" aria-selected={k === i} onClick={() => setI(k)} className="relative flex flex-col gap-1 bg-white px-5 py-5 text-left">
              {k === i && <motion.span layoutId="vps-tab" transition={{ type: "spring", duration: 0.4, bounce: 0.15 }} className="absolute inset-0 bg-ink" />}
              <span className={clsx("label relative transition-colors", k === i ? "text-soft" : "text-mute")}>{x.name}</span>
              <span className={clsx("relative font-mono text-[18px] font-medium transition-colors", k === i ? "text-white" : "text-ink")}>Tk {x.price.toLocaleString("en-US")}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>
      <div className="flex flex-col gap-10 px-5 py-10 md:px-10 lg:flex-row lg:items-center lg:px-14 lg:py-14">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <label className="flex flex-col gap-4">
            <span className="label text-mute">Drag to size · {p.fit}</span>
            <input type="range" min={0} max={VPS_PLANS.length - 1} step={1} value={i} onChange={(e) => setI(+e.target.value)} aria-valuetext={`${p.name}, ${p.ram} RAM`}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#E4E2DC] accent-[#E31E24] [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-red [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
              style={{ background: `linear-gradient(90deg,#E31E24 ${(i / (VPS_PLANS.length - 1)) * 100}%,#E4E2DC 0)` }} />
          </label>
          <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
            {specs.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-2 bg-paper px-5 py-5">
                <span className="label text-mute">{k}</span>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={v} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }} className="font-mono text-[26px] font-medium tracking-[-0.02em]">{v}</motion.span>
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:w-[320px] lg:shrink-0">
          <span className="label text-mute">{p.name} plan</span>
          <div className="flex items-baseline gap-2">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={p.price} initial={{ y: "40%", opacity: 0, filter: "blur(4px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: "-40%", opacity: 0 }} transition={{ duration: 0.22 }} className="text-[64px] font-medium leading-none tracking-[-0.05em]">
                Tk {p.price.toLocaleString("en-US")}
              </motion.span>
            </AnimatePresence>
            <span className="text-[17px] text-body">/ month</span>
          </div>
          <PrimaryButton href={`${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi DOL, I'd like the ${p.name} VPS (Tk ${p.price}/month).`)}`}>Order {p.name}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
