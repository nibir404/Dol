"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import { CONTACT } from "@/lib/content";
import { PrimaryButton } from "./Button";

const FLOWS: Record<string, { symptom: string; checks: string[] }[]> = {
  Internet: [
    { symptom: "No connectivity", checks: ["Check the ONU's PON light is steady and LOS is off.", "Restart the router (not the ONU) and wait two minutes.", "Try a wired device to rule out Wi-Fi."] },
    { symptom: "Slow or intermittent", checks: ["Test on a wired device close to the router.", "Note the time it happens and how often.", "Pause large downloads on other devices and test again."] },
  ],
  "Domain & Hosting": [
    { symptom: "Website down", checks: ["Open the site from a mobile network to rule out your Wi-Fi.", "Check whether the domain has expired.", "Note any exact error message."] },
    { symptom: "Email not working", checks: ["Confirm the mailbox password in your client hasn't changed.", "Check the mailbox isn't full.", "Note bounce messages you received."] },
  ],
  VPS: [{ symptom: "Server unreachable", checks: ["Check whether you can reach it from another network.", "Note recent changes — firewall, updates, reboots.", "Never send root passwords or private keys."] }],
  "Data Center": [{ symptom: "Access or facility need", checks: ["Prepare names and IDs of visitors.", "Have your rack or service reference ready.", "Describe the work planned and timing."] }],
  Billing: [{ symptom: "Invoice or payment question", checks: ["Find your customer ID and invoice reference.", "Keep the transaction reference from your payment.", "Keep full card details out of the request."] }],
};

/** Three-step guided check: service → symptom → checklist with progress, then a copyable summary. */
export default function SupportGuide() {
  const services = Object.keys(FLOWS);
  const [svc, setSvc] = useState(services[0]);
  const [sym, setSym] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const flow = FLOWS[svc][Math.min(sym, FLOWS[svc].length - 1)];
  const progress = done.length / flow.checks.length;
  const summary = `Service: ${svc}\nSymptom: ${flow.symptom}\nChecks done: ${done.map((d) => flow.checks[d]).join(" / ") || "none yet"}`;
  const pick = (s: string) => { setSvc(s); setSym(0); setDone([]); };

  return (
    <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1fr_1fr_1.3fr]">
      <div className="flex flex-col gap-4 bg-white p-7 md:p-9">
        <span className="label text-mute">01 · Service</span>
        <div className="flex flex-wrap gap-2">
          {services.map((s) => (
            <button key={s} onClick={() => pick(s)} aria-pressed={svc === s} className={clsx("rounded-[6px] border px-4 py-2.5 text-[15px] transition-colors duration-200", svc === s ? "border-red bg-red keep-white text-white" : "border-[#CFCCC4] hover:border-ink")}>{s}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 bg-white p-7 md:p-9">
        <span className="label text-mute">02 · What&apos;s happening</span>
        <div className="flex flex-col gap-2">
          {FLOWS[svc].map((f, k) => (
            <button key={f.symptom} onClick={() => { setSym(k); setDone([]); }} aria-pressed={sym === k} className={clsx("flex items-center justify-between rounded-[6px] border px-5 py-4 text-left text-[16px] transition-colors duration-200", sym === k ? "border-red bg-red/5" : "border-[#E4E2DC] hover:border-ink")}>
              {f.symptom}<span className={clsx("h-2 w-2 rounded-full", sym === k ? "bg-red" : "bg-[#E4E2DC]")} />
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5 bg-paper p-7 md:p-9">
        <div className="flex items-center justify-between">
          <span className="label text-mute">03 · Safe first checks</span>
          <span className="font-mono text-[12px]">{done.length}/{flow.checks.length}</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[#E4E2DC]"><motion.div className="h-full bg-red" animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} /></div>
        <AnimatePresence mode="wait">
          <motion.ul key={svc + sym} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="flex flex-col gap-2">
            {flow.checks.map((c, k) => {
              const on = done.includes(k);
              return (
                <li key={c}>
                  <button onClick={() => setDone((d) => (on ? d.filter((x) => x !== k) : [...d, k]))} aria-pressed={on} className="flex w-full items-start gap-3 rounded-[6px] bg-white px-4 py-3.5 text-left text-[15px] leading-6 transition-colors hover:bg-[#FBFAF7]">
                    <span className={clsx("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors", on ? "border-green bg-green text-white" : "border-[#CFCCC4]")}>
                      {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5 9-10" /></svg>}
                    </span>
                    <span className={clsx(on && "text-mute line-through")}>{c}</span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        </AnimatePresence>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          <PrimaryButton size="sm" href={`mailto:${svc === "Billing" ? CONTACT.info : CONTACT.noc}?subject=${encodeURIComponent(`${svc}: ${flow.symptom}`)}&body=${encodeURIComponent(summary + "\n\nCustomer ID: \nArea: \n")}`}>Send to DOL</PrimaryButton>
          <a href={`tel:${CONTACT.officeTel}`} className="text-[15px] font-medium underline underline-offset-[5px]">Or call {CONTACT.office}</a>
        </div>
      </div>
    </div>
  );
}
