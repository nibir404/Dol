"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "./Button";
import { Reveal } from "./Reveal";

const ease = [0.23, 1, 0.32, 1] as const;

function Rail({ n, light }: { n: string; light?: boolean }) {
  return <div className={`rail ${light ? "border-line text-mute" : "border-line-dark text-mute"}`}>{n}</div>;
}
function Head({ tag, title, sub, light }: { tag: string; title: React.ReactNode; sub?: string; light?: boolean }) {
  return (
    <div className="flex flex-col gap-5 px-5 pb-12 pt-20 md:px-10 lg:px-14 lg:pb-14 lg:pt-[104px]">
      <Reveal>
        <span className={`tag label ${light ? "border-[#D6D4CD] bg-white text-ink" : "border-line-strong text-white"}`}><i className="tag-dot" />{tag}</span>
      </Reveal>
      <Reveal delay={0.05}><h2 className="h-display text-[36px] leading-[1.03] md:text-[48px]">{title}</h2></Reveal>
      {sub && <Reveal delay={0.1}><p className={`max-w-[560px] text-[18px] leading-7 ${light ? "text-body" : "text-soft"}`}>{sub}</p></Reveal>}
    </div>
  );
}

/* How it works — five steps with a filling connector */
const STEPS = [
  { t: "Talk to us", b: "Training, fine-tuning, inference or research." },
  { t: "Size it together", b: "We recommend GPUs, storage and network." },
  { t: "Place your order", b: "A clear quote and timeline [in BDT]." },
  { t: "We deploy", b: "Installed, tested and connected in our Tier III facility." },
  { t: "Run with support", b: "Our local team monitors and supports you." },
];
export function AIHow() {
  return (
    <section className="flex border-b border-line bg-paper">
      <Rail n="08" light />
      <div className="flex min-w-0 flex-1 flex-col">
        <Head light tag="How it works" title={<>From first call to<br />running workload.</>} />
        <ol className="relative grid grid-cols-1 border-t border-line bg-white md:grid-cols-5">
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.4, ease: [0.77, 0, 0.175, 1] }}
            className="absolute left-0 right-0 top-0 hidden h-[2px] origin-left bg-red md:block"
          />
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.t} delay={0.1 + i * 0.08} className="flex flex-col gap-10 border-b border-line px-8 pb-10 pt-9 md:border-b-0 md:border-r md:last:border-r-0 md:gap-16">
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink font-mono text-[12px]">{i + 1}</span>
                {i === 4 && <span className="label text-green">Ongoing</span>}
              </span>
              <div className="flex flex-col gap-2">
                <span className="text-[24px] font-medium tracking-[-0.02em]">{s.t}</span>
                <span className="text-[15px] leading-[23px] text-body">{s.b}</span>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* Infrastructure specs — placeholders kept visible until Daffodil confirms */
const SPECS = [
  ["Facility", "Tier III [certified / designed, by whom] data center in [location]"],
  ["Power", "[kW] per rack for high-density GPU servers, redundant UPS and generators"],
  ["Cooling", "[Cooling type] built for GPU heat loads"],
  ["Network", "BDIX connectivity plus [Gbps] international bandwidth"],
  ["GPUs today", "4 × [GPU model], with more in process"],
  ["Security", "[24/7 access control, CCTV, fire suppression]"],
  ["Support", "[24/7] engineers in Dhaka"],
];
function Fill({ text }: { text: string }) {
  // Render [placeholders] as muted chips so they're obvious before launch
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((p, i) =>
        p.startsWith("[") ? <span key={i} className="mx-0.5 rounded-sm bg-white/10 px-1.5 py-0.5 font-mono text-[13px] text-soft">{p.slice(1, -1)}</span> : <span key={i}>{p}</span>
      )}
    </>
  );
}
export function AISpecs() {
  return (
    <section className="flex border-b border-line-dark bg-ink text-white">
      <Rail n="09" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Head tag="Infrastructure built for AI" title={<>The foundation<br /><span className="text-mute">AI hardware needs.</span></>} />
        <dl className="border-t border-line-dark">
          {SPECS.map(([k, v], i) => (
            <Reveal key={k} delay={i * 0.04} className="group grid grid-cols-1 gap-2 border-b border-line-dark px-5 py-6 transition-colors duration-300 hover:bg-white/[0.03] md:grid-cols-[260px_1fr] md:gap-10 md:px-10 lg:px-14">
              <dt className="label flex items-center gap-2.5 text-[12px] text-soft"><i className="h-1.5 w-1.5 bg-red transition-transform duration-300 group-hover:scale-150" />{k}</dt>
              <dd className="text-[18px] leading-7 md:text-[20px]"><Fill text={v} /></dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* Who it's for */
const WHO = [
  { t: "Universities & researchers", b: "Run experiments and train models without sending data abroad." },
  { t: "Startups", b: "Join the shared-GPU waitlist, or order a dedicated system to scale." },
  { t: "Banks & fintech", b: "Keep sensitive data in-country on reliable infrastructure." },
  { t: "Enterprises", b: "Host private AI for operations, documents and customer service." },
  { t: "Government & public sector", b: "Build national AI services on local infrastructure." },
];
export function AIWho() {
  return (
    <section className="flex border-b border-line bg-paper">
      <Rail n="10" light />
      <div className="flex min-w-0 flex-1 flex-col">
        <Head light tag="Who it's for" title={<>Built for teams building<br className="hidden md:block" /> AI in Bangladesh.</>} />
        <div className="grid grid-cols-1 border-t border-line bg-white sm:grid-cols-2 lg:grid-cols-5">
          {WHO.map((w, i) => (
            <Reveal key={w.t} delay={i * 0.05} className="group flex flex-col justify-between gap-12 border-b border-line px-7 pb-9 pt-8 transition-colors duration-300 hover:bg-ink hover:text-white sm:border-r lg:border-b-0 lg:last:border-r-0">
              <span className="font-mono text-[12px] text-mute transition-colors group-hover:text-red">0{i + 1}</span>
              <div className="flex flex-col gap-2.5">
                <span className="text-[22px] font-medium leading-7 tracking-[-0.015em]">{w.t}</span>
                <span className="text-[15px] leading-[23px] text-body transition-colors group-hover:text-soft">{w.b}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Early access strip */
export function AIEarly() {
  return (
    <section className="flex border-b border-line-dark bg-[#141414] text-white">
      <Rail n="11" />
      <div className="flex flex-1 flex-col justify-between gap-8 px-5 py-14 md:flex-row md:items-center md:px-10 lg:px-14">
        <Reveal className="flex flex-col gap-3">
          <span className="label text-red">Early access</span>
          <span className="text-[28px] font-medium leading-tight tracking-[-0.02em] md:text-[36px]">Be first in line for Daffodil GPUs.</span>
          <span className="max-w-[560px] text-[16px] text-soft">Priority capacity, and help from our engineers to plan your move.</span>
        </Reveal>
        <SecondaryButton tone="dark" href="#enquiry">Join the waitlist</SecondaryButton>
      </div>
    </section>
  );
}

/* FAQ — single-open accordion */
const FAQ = [
  ["Are GPUs available now?", "Yes. Our first GPUs are installed and running. Shared access is coming soon, and dedicated GPU systems are open for order now."],
  ["Can I order my own GPU system?", "Yes. We size it with you, source it, install it in our Tier III facility and support it."],
  ["How long does a dedicated system take?", "It depends on the GPU model and supply. We confirm the timeline in your quote."],
  ["Can I bring my own servers?", "Yes. Our AI-ready colocation gives your servers the power, cooling and connectivity they need."],
  ["Will my data stay in Bangladesh?", "Yes. Your data, models and backups stay in our facility in Bangladesh."],
  ["What is BDIX, and why does it matter?", "BDIX is Bangladesh's internet exchange. It keeps local traffic inside the country, which means lower latency for your users."],
  ["What does Tier III mean?", "Every power and cooling path has a backup, and maintenance can happen without shutting your systems down."],
];
export function AIFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="flex border-b border-line bg-paper">
      <Rail n="12" light />
      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="lg:w-[440px] lg:shrink-0 lg:border-r lg:border-line">
          <Head light tag="FAQ" title={<>Questions,<br />answered.</>} />
        </div>
        <ul className="flex-1 border-t border-line bg-white lg:border-t-0">
          {FAQ.map(([q, a], i) => {
            const on = open === i;
            return (
              <li key={q} className="border-b border-line last:border-b-0">
                <button
                  onClick={() => setOpen(on ? null : i)}
                  aria-expanded={on}
                  className="flex w-full items-center justify-between gap-6 px-5 py-6 text-left md:px-10"
                >
                  <span className="text-[18px] font-medium md:text-[20px]">{q}</span>
                  <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink">
                    <span className="absolute h-px w-3 bg-ink" />
                    <span className={`absolute h-3 w-px bg-ink transition-transform duration-300 ease-out ${on ? "scale-y-0" : ""}`} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[680px] px-5 pb-7 text-[16px] leading-[26px] text-body md:px-10">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* Final CTA + enquiry form (front-end only — wire to Daffodil's CRM/email before launch) */
const WORKLOADS = ["Training", "Fine-tuning", "Inference", "Research", "Hosting"];
export function AIEnquiry() {
  const [picked, setPicked] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const field = "w-full border-b border-line-strong bg-transparent py-3 text-[17px] text-white outline-none transition-colors placeholder:text-mute focus:border-white";
  return (
    <section id="enquiry" className="flex scroll-mt-24 bg-[#121212] text-white">
      <Rail n="13" />
      <div className="flex flex-1 flex-col bg-[radial-gradient(circle_at_80%_20%,#2A2A2A_0%,#161616_45%,#121212_100%)] lg:flex-row">
        <div className="flex flex-col gap-6 px-5 pb-10 pt-20 md:px-10 lg:w-[560px] lg:shrink-0 lg:px-14 lg:py-[104px]">
          <Reveal><span className="label text-soft">Reserve · Host · Join the waitlist</span></Reveal>
          <Reveal delay={0.05}><h2 className="h-display text-[36px] leading-[1] tracking-[-0.05em] md:text-[48px]">Your AI infrastructure is ready when you are.</h2></Reveal>
          <Reveal delay={0.1}><p className="text-[17px] text-soft">Our team gets back to you within [one working day].</p></Reveal>
        </div>
        <div className="flex-1 px-5 pb-20 md:px-10 lg:px-14 lg:py-[104px]">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="ok" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="flex h-full flex-col justify-center gap-4 border border-line-strong p-10">
                <span className="label flex items-center gap-2 text-green"><i className="h-1.5 w-1.5 rounded-full bg-green" />Request received</span>
                <span className="text-[28px] font-medium tracking-[-0.02em]">Thanks — an AI infrastructure engineer will contact you.</span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -8 }}
                onSubmit={(e) => { e.preventDefault(); if ((e.currentTarget as HTMLFormElement).reportValidity()) setSent(true); }}
                className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2"
              >
                <label className="flex flex-col"><span className="label text-mute">Name</span><input required name="name" autoComplete="name" className={field} placeholder="Your name" /></label>
                <label className="flex flex-col"><span className="label text-mute">Organisation</span><input name="org" autoComplete="organization" className={field} placeholder="University, company…" /></label>
                <label className="flex flex-col"><span className="label text-mute">Email</span><input required type="email" name="email" autoComplete="email" className={field} placeholder="you@org.com" /></label>
                <label className="flex flex-col"><span className="label text-mute">Phone</span><input type="tel" name="phone" autoComplete="tel" className={field} placeholder="+880" /></label>
                <fieldset className="md:col-span-2">
                  <legend className="label mb-3 text-mute">What you want to run</legend>
                  <div className="flex flex-wrap gap-2">
                    {WORKLOADS.map((w) => {
                      const on = picked.includes(w);
                      return (
                        <button type="button" key={w} aria-pressed={on} onClick={() => setPicked((p) => (on ? p.filter((x) => x !== w) : [...p, w]))}
                          className={`rounded-[6px] border px-4 py-2.5 text-[15px] transition-colors duration-200 ${on ? "border-red bg-red text-white" : "border-line-strong text-soft hover:border-white hover:text-white"}`}>
                          {w}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
                <label className="flex flex-col"><span className="label text-mute">GPUs needed</span><input inputMode="numeric" name="gpus" className={field} placeholder="e.g. 2" /></label>
                <label className="flex flex-col"><span className="label text-mute">Start date</span><input type="month" name="start" className={`${field} [color-scheme:dark]`} /></label>
                <div className="flex flex-wrap items-center gap-4 pt-4 md:col-span-2">
                  <PrimaryButton submit>Reserve your GPU system</PrimaryButton>
                  <SecondaryButton tone="dark" href="tel:+8801847334837">Talk to an expert</SecondaryButton>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
