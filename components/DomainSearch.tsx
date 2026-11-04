"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CONTACT, DOMAINS } from "@/lib/content";
import { PrimaryButton } from "./Button";

const clean = (s: string) => s.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\..*$/, "").replace(/[^a-z0-9-]/g, "").slice(0, 63);

/** Name builder: previews every ending as you type. Availability is checked by DOL Sales (no live registry yet). */
export default function DomainSearch() {
  const [raw, setRaw] = useState("");
  const name = clean(raw);
  return (
    <div className="flex flex-col">
      <div className="border-b border-line px-5 py-10 md:px-10 lg:px-14">
        <div className="flex items-center gap-2 rounded-full border border-[#CFCCC4] bg-paper p-1.5 pl-6 focus-within:border-ink">
          <span className="hidden font-mono text-[15px] text-mute sm:inline">www.</span>
          <input value={raw} onChange={(e) => setRaw(e.target.value)} placeholder="yourbusiness" aria-label="Domain name" autoCapitalize="off" spellCheck={false} className="h-12 min-w-0 flex-1 bg-transparent font-mono text-[18px] outline-none placeholder:text-[#B5B2AA]" />
          <PrimaryButton size="sm" flush href={`${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi DOL, I'd like to register ${name || "a domain"}.`)}`}>Ask Sales</PrimaryButton>
        </div>
        {raw && raw !== name && <p className="mt-3 font-mono text-[13px] text-mute">Using “{name}” — spaces, dots and symbols are removed.</p>}
      </div>
      <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        {DOMAINS.map((tld, i) => (
          <div key={tld} className="group flex flex-col gap-4 bg-white p-7 transition-colors duration-200 hover:bg-paper">
            <span className="label text-mute">{tld === ".com.bd" ? "Bangladesh" : "Global"}</span>
            <span className="min-h-[36px] break-all font-mono text-[22px] font-medium tracking-[-0.02em]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }} exit={{ opacity: 0 }} className="inline-block">
                  {name || "yourname"}
                </motion.span>
              </AnimatePresence>
              <span className="text-red">{tld}</span>
            </span>
            <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-[14px] text-body">
              <span>Register · Renew · Transfer</span>
              <span className="label text-mute">Price soon</span>
            </div>
          </div>
        ))}
      </div>
      <p className="border-t border-line bg-paper px-5 py-5 text-[14px] text-body md:px-10 lg:px-14">Prices appear here when online ordering opens. Availability is confirmed by DOL Sales at registration.</p>
    </div>
  );
}
