"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { PrimaryButton } from "./Button";
import { CountUp } from "./Reveal";

const HeroMap = dynamic(() => import("./HeroMap"), { ssr: false });
const ease = [0.23, 1, 0.32, 1] as const;

const STATS = [
  { label: "Serving since", to: 2002, plain: true },
  { label: "Homes connected", to: 30000, suffix: "+" },
  { label: "Points of presence", to: 28 },
  { label: "Districts licensed", to: 64, red: true },
];

export default function Hero() {
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [seg, setSeg] = useState<"Home" | "Business">("Home");
  const [q, setQ] = useState("");
  const onReady = useCallback((ok: boolean) => { setWebgl(ok); setReady(true); }, []);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mapScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const mapOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.25]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  // cursor spotlight over the map
  const mx = useMotionValue(70), my = useMotionValue(45);
  const sx = useSpring(mx, { stiffness: 90, damping: 20 }), sy = useSpring(my, { stiffness: 90, damping: 20 });
  const spot = useMotionTemplate`radial-gradient(520px circle at ${sx}% ${sy}%, rgba(227,30,36,0.14), transparent 60%)`;
  const fly = () => q.trim() && dispatchEvent(new CustomEvent("dol:fly", { detail: q.trim() }));

  return (
    <section ref={ref} onPointerMove={(e) => { if (e.pointerType !== "mouse") return; const r = e.currentTarget.getBoundingClientRect(); mx.set(((e.clientX - r.left) / r.width) * 100); my.set(((e.clientY - r.top) / r.height) * 100); }} className="relative overflow-hidden bg-ink text-white">
      <div className="relative min-h-[100svh]">
        {/* Static still: shows instantly, fades once WebGL is drawing */}
        <Image
          src="/img/hero-map.webp"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className={`theme-invert object-cover object-[70%_50%] transition-opacity duration-1000 md:object-[85%_50%] ${ready && webgl ? "opacity-0" : webgl ? "opacity-60" : "opacity-90"}`}
        />
        <motion.div style={{ scale: mapScale, opacity: mapOpacity }} className="absolute inset-0 md:left-[8%] md:right-[-4%]">
          <HeroMap onReady={onReady} />
        </motion.div>
        <motion.div aria-hidden style={{ background: spot }} className="pointer-events-none absolute inset-0 mix-blend-screen" />

        {/* Readability fades */}
        <div className="hero-fade pointer-events-none absolute inset-0" style={{ background: "radial-gradient(120% 90% at 72% 48%, transparent 35%, var(--theme-bg) 92%), linear-gradient(0deg, var(--theme-bg) 0%, transparent 30%), linear-gradient(90deg, var(--theme-bg) 0%, color-mix(in srgb, var(--theme-bg) 70%, transparent) 30%, transparent 60%)" }} />

        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="pointer-events-none relative z-10 flex min-h-[100svh]">
          <div className="pointer-events-none flex w-full flex-col justify-end px-5 pb-[104px] pt-[18vh] md:w-[720px] md:px-10 md:pb-40 lg:pl-[176px]">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="tag label border-line-strong bg-panel/80">
              <i className="tag-dot" />Nationwide ISP · Since 2002
            </motion.span>
            <h1 className="h-display mt-6 text-[44px] leading-[0.92] tracking-[-0.055em] sm:text-[64px] lg:text-[64px] xl:text-[64px]">
              {["Connect", "your world"].map((w, i) => (
                <motion.span key={w} className="block" initial={{ opacity: 0, y: 24, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.08 }}>
                  {w}{i === 1 && <span className="text-red">.</span>}
                </motion.span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.3 }} className="mt-5 max-w-[440px] text-[17px] text-soft md:text-[19px]">
              Fibre internet, hosting and data centers across Bangladesh.
            </motion.p>

            <motion.form
              onSubmit={(e) => { e.preventDefault(); fly(); }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.42 }}
              className="pointer-events-auto mt-8 md:mt-12"
            >
              <span className="hero-search-label label mb-3.5 block text-mute">Check coverage at your address</span>
              <div className="hero-search flex flex-col gap-1.5 rounded-[6px] border border-line-strong bg-panel/90 p-1.5 shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-colors focus-within:border-white/40 sm:h-[52px] sm:flex-row sm:items-center sm:gap-0 sm:rounded-[6px]">
                <div role="radiogroup" aria-label="Connection type" className="label relative flex h-12 shrink-0 rounded-[6px] bg-ink/60 p-1 sm:h-full sm:bg-transparent">
                  {(["Home", "Business"] as const).map((s) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={seg === s}
                      key={s}
                      onClick={() => setSeg(s)}
                      className={`relative flex flex-1 items-center justify-center rounded-[4px] px-5 transition-colors duration-200 sm:flex-none ${seg === s ? "text-ink" : "text-soft hover:text-white"}`}
                    >
                      {seg === s && <motion.span layoutId="seg" transition={{ type: "spring", duration: 0.4, bounce: 0.15 }} className="absolute inset-0 rounded-[4px] bg-white" />}
                      <span className="relative">{s}</span>
                    </button>
                  ))}
                </div>
                <span aria-hidden className="mx-1 hidden h-7 w-px bg-line-dark sm:block" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Area or postcode"
                  aria-label="Area or postcode"
                  enterKeyHint="search"
                  autoComplete="address-level2"
                  className="h-12 min-w-0 flex-1 truncate bg-transparent px-4 text-[16px] text-white outline-none placeholder:text-mute sm:h-full sm:px-4"
                />
                <PrimaryButton size="sm" submit flush className="w-full sm:w-auto">Check</PrimaryButton>
              </div>
            </motion.form>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute right-5 top-[92px] z-10 hidden flex-col items-end gap-1.5 text-right md:right-6 md:top-[120px] md:flex lg:right-[120px]">
          <span className="label text-mute">Network footprint · live</span>
          <span className="label text-white">Dhaka core · 28 POPs · 15 districts</span>
          <span className="label mt-1 hidden text-mute lg:block">Drag to orbit · click to zoom</span>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 md:absolute md:inset-x-0 md:bottom-0 border-t border-line-dark md:grid-cols-4 lg:px-[120px]" style={{ background: "color-mix(in srgb, var(--theme-bg) 55%, transparent)", backdropFilter: "blur(10px)" }}>
        {STATS.map((s, i) => (
          <div key={s.label} className={`flex flex-col gap-2 border-line-dark px-5 py-5 md:px-8 lg:px-10 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b md:border-b-0" : ""} md:border-r md:last:border-r-0`}>
            <span className="label text-mute">{s.label}</span>
            <CountUp to={s.to} plain={s.plain} suffix={s.suffix} className={`font-mono text-[28px] font-medium tabular-nums tracking-[-0.02em] md:text-[36px] ${s.red ? "text-red" : ""}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
