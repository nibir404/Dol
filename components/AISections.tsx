"use client";

import Image from "next/image";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { PrimaryButton, SecondaryButton, TextLink } from "./Button";
import TiltImage from "./TiltImage";
import { ImageReveal, Reveal } from "./Reveal";

function Rail({ n, light }: { n: string; light?: boolean }) {
  return <div className={`rail ${light ? "border-line text-mute" : "border-line-dark text-mute"}`}>{n}</div>;
}
function Tag({ children, light, dot = "red" }: { children: React.ReactNode; light?: boolean; dot?: "red" | "green" }) {
  return (
    <span className={`tag label ${light ? "border-[#D6D4CD] bg-white text-ink" : "border-line-strong text-white"}`}>
      <i className={`block h-1.5 w-1.5 ${dot === "green" ? "rounded-full bg-green" : "bg-red"}`} />{children}
    </span>
  );
}

/* 07 · AI hero with parallax hall */
export function AIHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 }), sy = useSpring(my, { stiffness: 60, damping: 18 });
  const ax = useTransform(sx, (v) => v * -24), ay = useTransform(sy, (v) => v * -16);
  const trust = [
    { t: "Tier III data center" },
    { t: "BDIX connected" },
    { t: "First GPUs live", live: true },
    { t: "Local support" },
  ];
  return (
    <section ref={ref} onPointerMove={(e) => { if (e.pointerType !== "mouse") return; const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5); }} className="relative overflow-hidden border-b border-line-dark bg-ink text-white">
      <motion.div style={{ y }} className="absolute inset-y-[-8%] right-0 w-full md:w-[80%]">
        <motion.div style={{ x: ax, y: ay, scale: 1.06 }} className="absolute inset-0">
        <Image src="/img/ai-hall.webp" alt="Wireframe AI data hall: four live GPU racks in red, more capacity outlined" fill sizes="80vw" className="theme-invert object-cover object-left" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30 md:bg-gradient-to-r md:from-ink md:via-ink/90 md:to-transparent" />
      <div className="relative flex min-h-[640px] md:min-h-[820px]">
        <Rail n="07" />
        <div className="flex flex-col justify-end gap-7 px-5 pb-14 pt-48 md:w-[720px] md:justify-center md:px-10 md:py-24 lg:px-14">
          <Reveal><span className="label text-[12px] text-soft">Building the foundation for Bangladesh&apos;s AI future</span></Reveal>
          <Reveal delay={0.05}>
            <h2 className="h-display text-[36px] leading-[0.95] tracking-[-0.055em] sm:text-[48px] lg:text-[48px]">
              AI-ready<br />infrastructure.<br /><span className="text-red">Ready today.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}><p className="max-w-[520px] text-[17px] leading-[27px] text-soft md:text-[19px] md:leading-[29px]">A Tier III data center in Bangladesh, on BDIX, with local engineers and GPU systems you can order now.</p></Reveal>
          <Reveal delay={0.15} className="flex flex-wrap gap-3 pt-3">
            <PrimaryButton href="/data-center/ai-infrastructure#enquiry">Reserve your GPU system</PrimaryButton>
            <SecondaryButton tone="dark" href="/data-center/ai-infrastructure">Explore AI infrastructure</SecondaryButton>
          </Reveal>
        </div>
      </div>
      <div className="relative grid grid-cols-2 border-t border-line-dark bg-ink/80 backdrop-blur-md md:grid-cols-4 lg:pl-[120px]">
        {trust.map((x, i) => (
          <div key={x.t} className={`label flex items-center gap-2.5 border-line-dark px-5 py-5 md:px-10 md:py-6 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b md:border-b-0" : ""} md:border-r md:last:border-r-0`}>
            <i className={`block h-1.5 w-1.5 ${x.live ? "rounded-full bg-green" : "bg-red"}`} />{x.t}
          </div>
        ))}
      </div>
    </section>
  );
}

/* 07.1 · Readiness */
export function AIToday() {
  const cards = [
    { k: "Live now", tone: "green", t: "Built and running.", b: "Tier III facility, BDIX and our first 4 GPUs.", bg: "bg-panel" },
    { k: "Ready to order", tone: "red", t: "Dedicated GPU systems.", b: "Sized, installed and supported in our facility." },
    { k: "Coming next", tone: "mute", t: "Shared GPUs by the hour.", b: "More capacity is being added." },
  ];
  return (
    <section className="flex border-b border-line-dark bg-ink text-white">
      <Rail n="07.1" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col justify-between gap-10 px-5 pb-12 pt-20 md:px-10 lg:flex-row lg:items-end lg:px-14 lg:pb-14 lg:pt-[104px]">
          <div className="flex flex-col gap-5">
            <Reveal><Tag dot="green">Where we are today</Tag></Reveal>
            <Reveal delay={0.05}><h2 className="h-display text-[36px] leading-[1.03] md:text-[48px]">Ready now.<br /><span className="text-mute">Growing every month.</span></h2></Reveal>
          </div>
          <Reveal delay={0.1} className="flex self-start border border-line-strong lg:self-auto">
            <div className="flex flex-col gap-2 border-r border-line-strong px-7 py-5"><span className="label text-mute">GPUs live</span><span className="font-mono text-[48px] font-medium leading-none">04</span></div>
            <div className="flex flex-col gap-2 px-7 py-5">
              <span className="label text-mute">In deployment</span>
              <span className="flex items-center gap-1.5 font-mono text-[48px] font-medium leading-none text-red">
                +<span className="flex gap-1">{[0, 1, 2].map((i) => <motion.i key={i} className="block h-2.5 w-2.5 bg-red" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }} />)}</span>
              </span>
            </div>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 border-t border-line-dark md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.k} delay={i * 0.06} className={`flex flex-col gap-12 border-b border-line-dark px-8 pb-11 pt-9 md:border-b-0 md:border-r md:last:border-r-0 ${c.bg ?? ""}`}>
              <span className={`label flex items-center gap-2.5 text-[12px] ${c.tone === "green" ? "text-green" : c.tone === "red" ? "text-red" : "text-soft"}`}>
                <i className={`block h-2 w-2 ${c.tone === "green" ? "rounded-full bg-green" : c.tone === "red" ? "bg-red" : "border border-soft"}`} />{c.k}
              </span>
              <div className="flex flex-col gap-2.5">
                <span className={`text-[28px] font-medium tracking-[-0.02em] ${c.tone === "mute" ? "text-soft" : ""}`}>{c.t}</span>
                <span className={`text-[16px] leading-6 ${c.tone === "mute" ? "text-mute" : "text-soft"}`}>{c.b}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 07.2 · Why */
const WHY = [
  { k: "01 · Tier III reliability", t: "Redundant power and cooling, maintained without shutting down." },
  { k: "02 · BDIX speed", t: "Traffic stays on Bangladeshi networks, for low latency nationwide." },
  { k: "03 · Your data stays here", t: "Models, data and backups stay inside Bangladesh." },
  { k: "04 · Local experts", t: "Engineers who plan, install and run with you, in Bangla and English." },
];
function WhyItem({ k, t }: { k: string; t: string }) {
  return (
    <Reveal className="flex flex-1 flex-col gap-3 border-b border-line-dark px-5 py-10 md:px-12 last:border-b-0">
      <span className="label text-[12px] text-red">{k}</span>
      <span className="text-[22px] font-medium leading-[30px] tracking-[-0.015em] md:text-[24px] md:leading-8">{t}</span>
    </Reveal>
  );
}
export function AIWhy() {
  return (
    <section className="flex border-b border-line-dark bg-ink text-white">
      <Rail n="07.2" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col gap-5 px-5 pb-12 pt-20 md:px-10 lg:px-14 lg:pb-14 lg:pt-[104px]">
          <Reveal><Tag>Why run AI with Daffodil</Tag></Reveal>
          <Reveal delay={0.05}><h2 className="h-display text-[36px] leading-[1.03] md:text-[48px]">Built for AI.<br /><span className="text-mute">Based in Bangladesh.</span></h2></Reveal>
        </div>
        <div className="flex flex-col border-t border-line-dark lg:flex-row">
          <ImageReveal className="relative aspect-[4/3] border-line-dark lg:w-[620px] lg:shrink-0 lg:border-r"><TiltImage src="/img/ai-power.webp" alt="Redundant UPS, generators and cooling with two power paths" sizes="(min-width:1024px) 620px, 100vw" imgClassName="object-cover" dark /></ImageReveal>
          <div className="flex min-w-0 flex-1 flex-col">{WHY.slice(0, 2).map((w) => <WhyItem key={w.k} {...w} />)}</div>
        </div>
        <div className="flex flex-col-reverse border-t border-line-dark lg:flex-row">
          <div className="flex flex-1 flex-col lg:border-r lg:border-line-dark">{WHY.slice(2).map((w) => <WhyItem key={w.k} {...w} />)}</div>
          <ImageReveal className="relative aspect-[4/3] lg:w-[620px] lg:shrink-0"><TiltImage src="/img/ai-sovereign.webp" alt="Bangladesh outline with a locked data center: data stays in-country" sizes="(min-width:1024px) 620px, 100vw" imgClassName="object-cover" dark /></ImageReveal>
        </div>
      </div>
    </section>
  );
}

/* 07.3 · Research */
export function AIResearch() {
  const uses = ["Training", "Fine-tuning", "Inference", "Research experiments"];
  return (
    <section className="flex border-b border-line bg-paper">
      <Rail n="07.3" light />
      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex flex-col justify-between gap-14 border-line px-5 py-20 md:px-10 lg:w-[600px] lg:shrink-0 lg:border-r lg:px-14 lg:py-[104px]">
          <div className="flex flex-col gap-6">
            <Reveal><Tag light>Research-driven</Tag></Reveal>
            <Reveal delay={0.05}><h2 className="h-display text-[36px] leading-[1.03] md:text-[48px]">From campus<br />to compute.</h2></Reveal>
            <Reveal delay={0.1}><p className="max-w-[440px] text-[18px] leading-7 text-body md:text-[19px] md:leading-[29px]">Train and test models on local GPUs, without sending research data abroad.</p></Reveal>
          </div>
          <ul className="flex flex-col border-t border-line">
            {uses.map((u, i) => (
              <Reveal as="li" key={u} delay={i * 0.05} className="group flex items-center justify-between border-b border-line py-[18px]">
                <span className="text-[18px] font-medium transition-transform duration-300 ease-out group-hover:translate-x-1">{u}</span>
                <span className="font-mono text-[12px] text-mute">0{i + 1}</span>
              </Reveal>
            ))}
          </ul>
        </div>
        <ImageReveal className="relative min-h-[420px] flex-1"><TiltImage src="/img/ai-campus.webp" alt="University campus wired to a local data center" sizes="(min-width:1024px) 60vw, 100vw" imgClassName="object-cover" dark /></ImageReveal>
      </div>
    </section>
  );
}

/* 07.4 · Three ways */
export function AIWays() {
  const ways = [
    { k: "Recommended · Open now", red: true, t: "Order a dedicated GPU system", b: "We size, source, install and support it.", img: "/img/ai-server.webp", cta: <PrimaryButton href="/data-center/ai-infrastructure#enquiry">Reserve your system</PrimaryButton>, bg: "bg-panel" },
    { k: "AI colocation", t: "Host your own AI servers", b: "AI-ready racks with power, cooling and BDIX.", img: "/img/ai-colo.webp", cta: <SecondaryButton tone="dark" href="/data-center/ai-infrastructure#enquiry">Ask about colocation</SecondaryButton> },
    { k: "Coming soon", t: "Join the GPU waitlist", b: "Priority capacity when shared GPUs open.", img: "/img/ai-waitlist.webp", cta: <TextLink tone="dark" href="/data-center/ai-infrastructure#enquiry">Join the waitlist</TextLink>, dim: true },
  ];
  return (
    <section className="flex border-b border-line-dark bg-ink text-white">
      <Rail n="07.4" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col gap-5 px-5 pb-12 pt-20 md:px-10 lg:px-14 lg:pb-14 lg:pt-[104px]">
          <Reveal><Tag>What you can do</Tag></Reveal>
          <Reveal delay={0.05}><h2 className="h-display text-[36px] leading-[1.03] md:text-[48px]">Three ways to start.</h2></Reveal>
        </div>
        <div className="grid grid-cols-1 border-t border-line-dark md:grid-cols-3">
          {ways.map((w, i) => (
            <motion.div key={w.t} whileHover="hover" className={`flex flex-col justify-between gap-10 border-b border-line-dark md:border-b-0 md:border-r md:last:border-r-0 ${w.bg ?? ""}`}>
              <ImageReveal delay={i * 0.06} className="relative aspect-[4/3] overflow-hidden border-b border-line-dark">
                <div className={`absolute inset-0 ${w.dim ? "opacity-55" : ""}`}>
                  <TiltImage src={w.img} alt="" sizes="(min-width:768px) 33vw, 100vw" imgClassName="object-cover" dark />
                </div>
              </ImageReveal>
              <div className="flex flex-col gap-3 px-8 md:px-10">
                <span className={`label text-[12px] ${w.red ? "text-red" : "text-soft"}`}>{w.k}</span>
                <span className="text-[28px] font-medium leading-tight tracking-[-0.02em] md:text-[30px]">{w.t}</span>
                <span className="text-[16px] leading-6 text-soft">{w.b}</span>
              </div>
              <div className="px-8 pb-10 md:px-10">{w.cta}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
