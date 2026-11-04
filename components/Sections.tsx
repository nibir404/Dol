"use client";
import IsoDiagram from "./IsoDiagram";
import DotField from "./DotField";

import Image from "next/image";
import { LayoutGroup, motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PrimaryButton, SecondaryButton, TextLink, PixelArrow } from "./Button";
import TiltImage from "./TiltImage";
import { ImageReveal, Reveal } from "./Reveal";
import { HOME_PACKAGES } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

function Rail({ n, dark }: { n: string; dark?: boolean }) {
  return <div className={`rail ${dark ? "border-line-dark text-mute" : "border-line text-mute"}`}>{n}</div>;
}
function Tag({ children, dark, dot = "red" }: { children: React.ReactNode; dark?: boolean; dot?: "red" | "green" }) {
  return (
    <span className={`tag label ${dark ? "border-line-strong text-white" : "border-[#D6D4CD] bg-white"}`}>
      <i className={`block h-1.5 w-1.5 ${dot === "green" ? "rounded-full bg-green" : "bg-red"}`} />{children}
    </span>
  );
}

/* ---------------- 02 Services ---------------- */
const SERVICES = [
  { n: "01 · Home", price: "From ৳500/mo", title: "Home Internet", body: "15–60 Mbps, installed at your address.", link: "See packages", img: "/img/illo-home.webp" },
  { n: "02 · Business", price: "Custom quote", title: "Corporate Internet", body: "Dedicated links, public IP, named support.", link: "Request a quote", img: "/img/illo-corporate.webp" },
  { n: "03 · Online", price: "From ৳2,299/yr", title: "Domain, Hosting & VPS", body: ".bd domains, web hosting, BDIX VPS.", link: "Compare plans", img: "/img/illo-hosting.webp" },
  { n: "04 · Infra", price: "1U → cabinet", title: "Data Center", body: "Racks in Dhanmondi and Ashulia.", link: "Compare sites", img: "/img/illo-datacenter.webp" },
];

export function Services() {
  return (
    <section className="flex border-b border-line bg-paper">
      <Rail n="02" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col gap-5 border-b border-line px-5 pb-10 pt-20 md:px-10 md:pb-12 md:pt-[88px] lg:px-14">
          <Reveal><Tag>What do you need?</Tag></Reveal>
          <Reveal delay={0.05}><h2 className="h-display text-[36px] leading-[1.05] md:text-[48px]">Four ways DOL keeps<br className="hidden sm:block" /> you connected.</h2></Reveal>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial="rest"
              whileHover="hover"
              className="group relative flex flex-col border-b border-line bg-white sm:border-r sm:[&:nth-child(2n)]:border-r-0 xl:border-b-0 xl:[&:nth-child(2n)]:border-r xl:last:border-r-0"
            >
              <DotField />
              <div className="relative aspect-[4/3] overflow-hidden">
                <IsoDiagram kind={(["network", "gpu", "hosting", "datacenter"] as const)[i % 4]} className="absolute inset-[10%]" />
              </div>
              <div className="relative flex flex-1 flex-col gap-3.5 border-t border-line p-7">
                <div className="flex items-center justify-between">
                  <span className="label text-mute">{s.n}</span>
                  <span className="label text-red">{s.price}</span>
                </div>
                <h3 className="text-[26px] font-medium tracking-[-0.02em]">{s.title}</h3>
                <p className="text-[15px] leading-[23px] text-body">{s.body}</p>
                <span className="mt-auto pt-2"><TextLink>{s.link}</TextLink></span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 03 Packages ---------------- */
const SPEEDS = HOME_PACKAGES.map((p) => p.mbps);
const PRICES = Object.fromEntries(HOME_PACKAGES.map((p) => [p.mbps, p.price])) as Record<number, number>;
const FITS = Object.fromEntries(HOME_PACKAGES.map((p) => [p.mbps, p.fit])) as Record<number, string>;

export function Packages() {
  const [sel, setSel] = useState(15);
  const price = PRICES[sel];
  const onKey = (e: React.KeyboardEvent) => {
    const i = SPEEDS.indexOf(sel);
    if (e.key === "ArrowRight") setSel(SPEEDS[Math.min(i + 1, SPEEDS.length - 1)]);
    if (e.key === "ArrowLeft") setSel(SPEEDS[Math.max(i - 1, 0)]);
  };
  return (
    <section className="flex border-b border-line bg-paper">
      <Rail n="03" />
      <div className="flex min-w-0 flex-1 flex-col xl:flex-row">
        <div className="flex flex-col justify-center gap-7 border-b border-line px-5 py-16 md:px-10 lg:px-14 xl:w-[440px] xl:shrink-0 xl:border-b-0 xl:border-r xl:py-[120px]">
          <Reveal><Tag>Home packages</Tag></Reveal>
          <Reveal delay={0.05}><h2 className="h-display text-[36px] leading-[1.03] md:text-[48px]">Pick a speed.<br />We confirm it<br />at your door.</h2></Reveal>
        </div>
        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <LayoutGroup>
            <div role="radiogroup" aria-label="Speed" tabIndex={0} onKeyDown={onKey} className="grid grid-cols-3 border-b border-line outline-none sm:grid-cols-6">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  role="radio"
                  aria-checked={sel === s}
                  onClick={() => setSel(s)}
                  className="relative flex min-w-0 flex-col gap-2 border-b border-r border-line px-4 pb-6 pt-7 text-left last:border-r-0 sm:border-b-0 md:px-6 md:pt-9 2xl:px-8"
                >
                  {sel === s && <motion.span layoutId="speed" transition={{ type: "spring", duration: 0.45, bounce: 0.15 }} className="absolute inset-0 bg-red" />}
                  <span className={`relative font-mono text-[36px] font-medium leading-none tracking-[-0.02em] transition-colors duration-200 md:text-[44px] 2xl:text-[52px] ${sel === s ? "keep-white text-white" : "text-ink"}`}>{s}</span>
                  <span className={`label relative transition-colors duration-200 ${sel === s ? "keep-white text-white/85" : "text-mute"}`}>Mbps</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
          <div className="flex flex-1 flex-col md:flex-row">
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-10 px-5 py-12 md:px-14 md:py-[72px]">
              <div className="flex flex-col gap-5">
                <span className="label text-[12px] text-mute">Selected · {sel} Mbps home</span>
                <div className="flex items-baseline gap-3.5 overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={sel}
                      initial={{ y: "60%", opacity: 0, filter: "blur(4px)" }}
                      animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: "-60%", opacity: 0, filter: "blur(4px)" }}
                      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                      className="font-medium leading-[0.9] tracking-[-0.06em] text-[88px] md:text-[132px] 2xl:text-[144px]"
                    >
                      {`৳${price.toLocaleString("en-US")}`}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-[20px] text-body md:text-[22px]">/ month</span>
                </div>
                <p className="text-[17px] text-body md:text-[18px]">{FITS[sel]}. Taxes and installation confirmed for your address.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <PrimaryButton>Check my address</PrimaryButton>
                <SecondaryButton>All packages</SecondaryButton>
              </div>
            </div>
            <div className="relative hidden w-[260px] shrink-0 border-l border-line bg-paper 2xl:block">
              <TiltImage src="/img/illo-home.webp" alt="" sizes="300px" imgClassName="object-cover object-[30%_50%]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 04 Online + globe ---------------- */
function DragGlobe() {
  const rot = useMotionValue(0);
  const spring = useSpring(rot, { stiffness: 60, damping: 18 });
  const rotate = useTransform(spring, (v) => `${v}deg`);
  const drag = useRef<{ x: number; r: number; t: number; v: number } | null>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000; last = t;
      if (!drag.current) rot.set(rot.get() + dt * 6); // one turn per minute
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rot]);

  return (
    <motion.div
      style={{ rotate }}
      onPointerDown={(e) => { (e.target as Element).setPointerCapture(e.pointerId); drag.current = { x: e.clientX, r: rot.get(), t: performance.now(), v: 0 }; }}
      onPointerMove={(e) => {
        const d = drag.current; if (!d) return;
        const nr = d.r + (e.clientX - d.x) * 0.4;
        const now = performance.now(); d.v = (nr - rot.get()) / Math.max(1, now - d.t); d.t = now;
        rot.set(nr);
      }}
      onPointerUp={() => { const d = drag.current; if (d) rot.set(rot.get() + d.v * 400); drag.current = null; }}
      className="relative aspect-square w-full max-w-[620px] cursor-grab touch-pan-y select-none active:cursor-grabbing"
    >
      <Image src="/img/globe.webp" alt="Dot-matrix globe centred on Bangladesh" fill sizes="(min-width:1024px) 620px, 90vw" draggable={false} className="theme-invert pointer-events-none rounded-full object-cover" />
    </motion.div>
  );
}

const ONLINE = [
  { name: "Domains", meta: "Register · Transfer", icon: <path d="M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z" /> },
  { name: "Web Hosting", meta: "From ৳2,299/yr", icon: <path d="M3.5 4h17v7h-17zM3.5 13h17v7h-17zM12 7.5h5M12 16.5h5" /> },
  { name: "BDIX VPS", meta: "From ৳1,500/mo", icon: <path d="M6 6h12v12H6zM9 2.5v3.5M15 2.5v3.5M9 18v3.5M15 18v3.5M2.5 9h3.5M2.5 15h3.5M18 9h3.5M18 15h3.5" /> },
];

export function Online() {
  return (
    <section className="flex border-b border-line-dark bg-ink text-white">
      <Rail n="04" dark />
      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex flex-col justify-between border-line-dark px-5 pt-20 md:px-10 lg:w-[600px] lg:shrink-0 lg:border-r lg:px-14 lg:pt-[88px]">
          <div className="flex flex-col gap-5">
            <Reveal><Tag dark>Online services · Worldwide</Tag></Reveal>
            <Reveal delay={0.05}><h2 className="h-display text-[36px] leading-[1.05] md:text-[48px]">Go online from<br /><span className="text-mute">anywhere on earth.</span></h2></Reveal>
          </div>
          <ul className="mt-12 flex flex-col">
            {ONLINE.map((o, i) => (
              <Reveal as="li" key={o.name} delay={i * 0.05} className="group flex items-center gap-5 border-t border-line-dark py-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="square" className="shrink-0">{o.icon}</svg>
                <span className="flex-1 text-[20px] font-medium transition-transform duration-300 ease-out group-hover:translate-x-1">{o.name}</span>
                <span className="label w-[150px] text-right text-soft">{o.meta}</span>
              </Reveal>
            ))}
            <li className="flex items-center justify-between gap-4 border-t border-line-dark bg-[#1A1A1A] px-6 py-7">
              <div className="flex flex-col gap-1.5">
                <span className="label text-red">Need a website too?</span>
                <span className="text-[17px] font-medium md:text-[18px]">Build it with DUDOS, host it with DOL.</span>
              </div>
              <TextLink tone="dark" className="shrink-0">Open DUDOS</TextLink>
            </li>
          </ul>
        </div>
        <div className="flex flex-1 items-center justify-center overflow-hidden px-5 py-14 lg:py-10">
          <DragGlobe />
        </div>
      </div>
    </section>
  );
}

/* ---------------- 05 Solutions (pinned progress on desktop) ---------------- */
const STEPS = [
  { t: "Discover", b: "We map what's slowing you down." },
  { t: "Design", b: "Network and hosting, planned together." },
  { t: "Deliver", b: "Our engineers install and test." },
  { t: "Operate", b: "Monitored and supported after go-live." },
];

export function Solutions() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top 75%",
        end: "bottom 60%",
        scrub: 0.6,
        onUpdate: (s) => {
          gsap.set(bar.current, { scaleX: s.progress });
          setActive(Math.min(3, Math.floor(s.progress * 4 + 0.05)));
        },
      });
      return () => st.kill();
    });
    mm.add("(prefers-reduced-motion: reduce)", () => { gsap.set(bar.current, { scaleX: 1 }); setActive(3); });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative border-b border-line bg-paper">
     <div className="flex">
      <Rail n="05" />
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex flex-col justify-between gap-8 border-b border-line px-5 pb-10 pt-20 md:px-10 lg:flex-row lg:items-end lg:px-14 lg:pb-12 lg:pt-[88px]">
          <div className="flex flex-col gap-5">
            <Reveal><Tag>Solutions</Tag></Reveal>
            <Reveal delay={0.05}><h2 className="h-display text-[36px] leading-[1.05] md:text-[48px]">Tell us what must<br />work better.</h2></Reveal>
          </div>
          <div className="flex flex-wrap gap-3">
            <SecondaryButton>Explore solutions</SecondaryButton>
            <PrimaryButton>Discuss a requirement</PrimaryButton>
          </div>
        </div>
        <div className="relative h-[2px] bg-line"><div ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-red lg:scale-x-0" /></div>
        <div className="grid grid-cols-1 bg-white sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const on = i <= active;
            const last = i === 3;
            return (
              <div key={s.t} className={`flex flex-col gap-10 border-b border-line px-8 pb-10 pt-9 transition-colors duration-500 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:gap-14 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0 ${last && on ? "bg-ink text-white" : ""}`}>
                <span className={`label transition-colors duration-500 ${on ? (last ? "text-green" : "text-red") : "text-mute"}`}>Step 0{i + 1}{last ? " · ongoing" : ""}</span>
                <div className="flex flex-col gap-2">
                  <span className="text-[32px] font-medium tracking-[-0.03em]">{s.t}</span>
                  <span className={`text-[15px] ${last && on ? "text-soft" : "text-body"}`}>{s.b}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
     </div>
    </section>
  );
}

/* ---------------- 06 Data center ---------------- */
const SITES = [
  { n: "Site 01", name: "Ashulia", b: "Daffodil Smart City. Built to the Tier III standard, N+1.", open: true, status: "Taking new servers" },
  { n: "Site 02", name: "Dhanmondi", b: "Shukrabad, in the city. Fast hands-on access.", open: false, status: "Fully booked" },
];

export function DataCenter() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <section className="flex border-b border-line-dark bg-[#111111] text-white">
      <Rail n="06" dark />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col gap-5 px-5 pb-12 pt-20 md:px-10 lg:px-14 lg:pb-14 lg:pt-24">
          <Reveal><Tag dark>Data centers</Tag></Reveal>
          <Reveal delay={0.05}><h2 className="h-display text-[36px] leading-[1.05] md:text-[48px]">Your servers,<br />inside Bangladesh.</h2></Reveal>
        </div>
        <div className="flex flex-col border-t border-line-dark lg:flex-row">
          <ImageReveal className="relative aspect-[4/3] border-line-dark lg:w-[620px] lg:shrink-0 lg:border-r">
            <TiltImage src="/img/dc-wireframe.webp" alt="Wireframe of the two DOL data center sites" sizes="(min-width:1024px) 620px, 100vw" imgClassName="object-cover" dark />
            <motion.div
              animate={{ opacity: hover === null ? 0 : 1, x: hover === 0 ? "-12%" : "18%", y: hover === 0 ? "18%" : "-14%" }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="pointer-events-none absolute inset-0 m-auto h-[46%] w-[46%] rounded-full bg-red/20 blur-3xl"
            />
          </ImageReveal>
          <div className="flex min-w-0 flex-1 flex-col">
            {SITES.map((s, i) => (
              <div key={s.name} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="flex flex-1 flex-col gap-4 border-b border-line-dark px-5 py-10 transition-colors duration-300 hover:bg-white/[0.03] md:px-10">
                <div className="flex items-center justify-between">
                  <span className="label text-mute">{s.n}</span>
                  <span className="label flex items-center gap-2 text-soft"><i className={`h-1.5 w-1.5 rounded-full ${s.open ? "bg-green" : "bg-soft"}`} />{s.status}</span>
                </div>
                <span className="text-[32px] font-medium tracking-[-0.02em]">{s.name}</span>
                <span className="text-[15px] text-soft">{s.b}</span>
                <TextLink tone="dark" className="self-start">View details</TextLink>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 07 Clients + 08 Customers ---------------- */
const CLIENTS: [string, string][] = [
  ["amin-mohammad", "Amin Mohammad Group"], ["al-noor", "Al-Noor Eye Hospital"], ["sheltech", "Sheltech Ceramics"], ["kib", "Krishibid Institution Bangladesh"],
  ["dms", "DMS Metering Solutions"], ["union", "Union Development"], ["nandini", "Hotel Nandini"], ["karupannya", "Karupannya Rangpur"],
  ["shotoronji", "Shotoronji"], ["global-recruiting", "Global Recruiting Agency"], ["scube", "Scube Technologies"], ["newtec", "Newtec Pharmaceuticals"],
  ["diu", "Daffodil International University"], ["daffodil-computers", "Daffodil Computers"], ["dis", "Daffodil International School"], ["dic", "Daffodil International College"],
  ["diit", "Daffodil Institute of IT"], ["dipti", "Daffodil International Professional Training Institute"], ["dti", "Daffodil Technical Institute"], ["bsdi", "Bangladesh Skill Development Institute"],
  ["djit", "Daffodil Japan IT"], ["dsl", "Daffodil Software"], ["skilljobs", "Skill Jobs"],
];
const ROWS = [CLIENTS.slice(0, 12), CLIENTS.slice(12)];

function LogoRow({ items, reverse }: { items: [string, string][]; reverse?: boolean }) {
  return (
    <div className="group/row flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
      <ul
        className={`flex w-max shrink-0 gap-3 py-1.5 pr-3 motion-reduce:animate-none group-hover/row:[animation-play-state:paused] md:gap-4 md:pr-4 ${reverse ? "animate-[marquee_60s_linear_infinite_reverse]" : "animate-[marquee_55s_linear_infinite]"}`}
      >
        {[...items, ...items].map(([f, name], i) => (
          <li
            key={i}
            aria-hidden={i >= items.length}
            className="flex h-[84px] w-[180px] shrink-0 items-center justify-center rounded-[6px] border border-line bg-white px-5 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] md:h-[108px] md:w-[232px] md:px-6"
          >
            <Image src={`/img/clients/${f}.webp`} alt={name} width={200} height={72} loading="lazy" className="max-h-[52px] w-auto max-w-full object-contain md:max-h-[64px]" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Clients() {
  return (
    <section className="flex border-b border-line bg-paper">
      <Rail n="08" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col justify-between gap-3 border-b border-line px-5 py-8 sm:flex-row sm:items-center md:px-10 lg:px-14">
          <span className="label text-mute">Trusted by campuses, hospitals &amp; businesses</span>
          <span className="label text-ink">{CLIENTS.length}+ organisations</span>
        </div>
        <div className="flex flex-col gap-1.5 py-8 md:gap-2 md:py-10">
          {ROWS.map((r, i) => <LogoRow key={i} items={r} reverse={i === 1} />)}
        </div>
      </div>
    </section>
  );
}

const QUICK = [
  { t: "Pay bill", icon: <path d="M5 2.5h14v19l-3.5-2-3.5 2-3.5-2-3.5 2zM8.5 8h7M8.5 12h7M8.5 16h4" /> },
  { t: "Support", icon: <path d="M4 14v-2a8 8 0 0116 0v2M3 13h4v6H3zM17 13h4v6h-4z" /> },
  { t: "Service status", icon: <path d="M2.5 12h4l2.5-6 4 12 2.5-6h6" />, live: true },
];

export function Customers() {
  return (
    <section className="flex border-b border-line bg-white">
      <Rail n="09" />
      <div className="grid min-w-0 flex-1 grid-cols-2 lg:grid-cols-[minmax(220px,300px)_repeat(4,minmax(0,1fr))]">
        <div className="col-span-2 flex items-center border-b border-line px-5 py-8 md:px-10 lg:col-span-1 lg:border-b-0 lg:border-r lg:px-10">
          <span className="text-[24px] font-medium tracking-[-0.02em]">Already with DOL?</span>
        </div>
        {QUICK.map((q) => (
          <a key={q.t} href="#" className="group flex min-w-0 items-center gap-3.5 border-b border-r border-line px-5 py-7 transition-colors duration-200 hover:bg-paper even:border-r-0 lg:border-b-0 lg:even:border-r md:px-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="square" className="shrink-0">{q.icon}</svg>
            <span className="label">{q.t}</span>
            {q.live && <i className="h-1.5 w-1.5 rounded-full bg-green" />}
          </a>
        ))}
        <a href="#" className="group flex min-w-0 items-center justify-between gap-3 bg-ink px-5 py-7 text-white md:px-6">
          <span className="label">Log in to My DOL</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1"><PixelArrow size={18} mid="#fff" /></span>
        </a>
      </div>
    </section>
  );
}
