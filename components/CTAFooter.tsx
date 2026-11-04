"use client";
import StackCore from "./StackCore";

import Image from "next/image";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { PrimaryButton, SecondaryButton } from "./Button";
import { Reveal } from "./Reveal";
import Link from "next/link";
import { CONTACT, FOOTER_COLS } from "@/lib/content";

/** Rotating dot sphere + orbit ring. Canvas 2D, pauses off-screen. */
function DotSphere() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(devicePixelRatio, 2);
    let size = 0, raf = 0, visible = true;
    const pts: [number, number, number][] = [];
    for (let lat = -80; lat <= 80; lat += 8)
      for (let lon = 0; lon < 360; lon += 6) {
        const la = (lat * Math.PI) / 180, lo = (lon * Math.PI) / 180;
        pts.push([Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]);
      }
    const resize = () => { size = c.clientWidth; c.width = size * dpr; c.height = size * dpr; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(c);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) draw(performance.now()); });
    io.observe(c);
    // Pointer steers the sphere: horizontal spins it, vertical tilts it
    const aim = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => { const r = c.getBoundingClientRect(); aim.x = ((e.clientX - r.left) / r.width - 0.5) * 2; aim.y = ((e.clientY - r.top) / r.height - 0.5) * 2; };
    addEventListener("pointermove", onMove, { passive: true });
    const draw = (t: number) => {
      cancelAnimationFrame(raf);
      if (!visible) return;
      cur.x += (aim.x - cur.x) * 0.06; cur.y += (aim.y - cur.y) * 0.06;
      const rot = reduce ? 0.4 : t * 0.00012 + cur.x * 0.9;
      const tilt = 0.31 + cur.y * 0.35, ct = Math.cos(tilt), st = Math.sin(tilt);
      const R = size * 0.41, cx = size / 2, cy = size / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const light = document.documentElement.dataset.theme === "light";
      const ink = light ? "#111111" : "#FFFFFF";
      ctx.fillStyle = ink;
      const cr = Math.cos(rot), sr = Math.sin(rot);
      for (const [x0, y0, z0] of pts) {
        const x = x0 * cr + z0 * sr, z = -x0 * sr + z0 * cr;
        const y = y0 * ct - z * st, z2 = y0 * st + z * ct;
        if (z2 < 0) continue;
        ctx.globalAlpha = 0.2 + 0.8 * z2;
        ctx.beginPath(); ctx.arc(cx + x * R, cy - y * R, 0.8 + 1.8 * z2 * (size / 560), 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.31);
      ctx.strokeStyle = light ? "rgba(17,17,17,0.85)" : "rgba(255,255,255,0.9)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(0, 0, R * 1.17, R * 0.3, 0, 0, Math.PI * 2); ctx.stroke();
      const a = reduce ? 0.6 : t * 0.0006;
      const nx = Math.cos(a) * R * 1.17, ny = Math.sin(a) * R * 0.3;
      ctx.fillStyle = "#E31E24"; ctx.beginPath(); ctx.arc(nx, ny, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = light ? "#fff" : "#fff"; ctx.beginPath(); ctx.arc(nx, ny, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); removeEventListener("pointermove", onMove); };
  }, []);
  return <canvas ref={ref} aria-hidden className="aspect-square w-full max-w-[560px]" />;
}

/** Pulls toward the cursor a few px — desktop only. */
function Magnetic({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 }), sy = useSpring(y, { stiffness: 220, damping: 16 });
  return (
    <motion.div
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width - 0.5) * 16);
        y.set(((e.clientY - r.top) / r.height - 0.5) * 16);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

export function CTA() {
  return (
    <section className="flex bg-[#121212] text-white">
      <div className="rail border-line-dark text-mute">10</div>
      <div className="flex flex-1 flex-col items-center overflow-hidden bg-[radial-gradient(circle_at_78%_50%,#2A2A2A_0%,#1A1A1A_45%,#121212_100%)] lg:flex-row">
        <div className="flex flex-col gap-12 px-5 py-20 md:px-10 lg:w-[760px] lg:shrink-0 lg:px-14 lg:py-[104px]">
          <div className="flex flex-col gap-6">
            <Reveal><span className="label text-soft">Talk to us · Sat–Thu 9am–5pm</span></Reveal>
            <Reveal delay={0.05}><h2 className="h-display text-[36px] leading-[0.98] tracking-[-0.055em] sm:text-[48px] lg:text-[48px]">Let&apos;s connect<br />your next<br />chapter.</h2></Reveal>
          </div>
          <Reveal delay={0.1} className="flex flex-wrap items-center gap-4">
            <Magnetic><PrimaryButton size="lg">Check coverage</PrimaryButton></Magnetic>
            <SecondaryButton tone="dark" size="lg">WhatsApp sales</SecondaryButton>
            <a href="tel:+8801847334837" className="label text-soft transition-colors hover:text-white">+880 1847-334837</a>
          </Reveal>
        </div>
        <div className="flex w-full flex-1 justify-center px-8 pb-16 lg:pb-0"><StackCore /></div>
      </div>
    </section>
  );
}


export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["18%", "0%"]);
  const clip = useTransform(scrollYProgress, [0.2, 1], ["inset(0 60% 0 0)", "inset(0 0% 0 0)"]);
  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink text-white">
      <div className="relative z-10 flex flex-col gap-12 px-5 pt-16 md:px-10 lg:px-[120px] lg:pt-[72px]">
        <div className="label flex flex-wrap items-center justify-between gap-4 border-y border-line-dark py-[18px]">
          <Link href="/status" className="flex items-center gap-2.5 text-[var(--theme-fg)] hover:text-soft"><i className="h-1.5 w-1.5 rounded-full bg-green" />Service status</Link>
          <span className="flex gap-5 text-mute"><a href="https://www.facebook.com/DaffodilOnlineLtd" className="hover:text-white">Facebook</a><a href="https://www.linkedin.com/company/daffodil-online-limited-dol/" className="hover:text-white">LinkedIn</a></span>
        </div>
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="flex flex-col gap-5">
            <Image src="/img/logo-dark.png" alt="Daffodil Online" width={130} height={80} className="logo-dark h-auto w-[130px]" /><Image src="/img/logo-light.png" alt="" aria-hidden width={130} height={80} className="logo-light h-auto w-[130px]" />
            <span className="flex flex-col gap-1 text-[15px] text-soft"><a href={`mailto:${CONTACT.info}`} className="hover:text-white">{CONTACT.info}</a><a href={`tel:${CONTACT.officeTel}`} className="hover:text-white">{CONTACT.office}</a><span className="max-w-[260px] text-[13px] text-mute">{CONTACT.address}</span></span>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {FOOTER_COLS.map((c) => (
              <div key={c.h} className="flex flex-col">
                <span className="label pb-3 text-mute">{c.h}</span>
                {c.l.map(([l, h]) => <Link key={l} href={h} className="py-1 text-[15px] text-[#D6D4CD] transition-colors duration-200 hover:text-white">{l}</Link>)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engraving → pixels → dots → ASCII panorama; wipes in on scroll */}
      <motion.div style={{ y }} className="relative mt-8 aspect-[3/1] min-h-[260px] w-full">
        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          <Image src="/img/footer-blend.webp" alt="Engraved panorama of Dhaka: Parliament, skyline, river and boats" fill sizes="100vw" className="theme-invert object-cover object-[60%_50%]" />
        </motion.div>
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-ink to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink/90 to-transparent" />
        <div className="label absolute left-[66%] top-[30%] hidden items-center gap-2 md:flex">
          <span className="h-px w-[78px] bg-red" /><span className="bg-red px-1.5 py-0.5 text-[10px]">Dhaka core · live</span>
        </div>
      </motion.div>
      <div className="label relative z-10 -mt-12 flex flex-wrap justify-between gap-3 border-t border-white/15 px-5 py-6 text-[#D6D4CD] md:px-10 lg:mx-[120px] lg:px-0">
        <span>© 2026 Daffodil Online Ltd.</span>
        <span className="flex gap-4"><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/accessibility" className="hover:text-white">Accessibility</Link></span>
      </div>
    </footer>
  );
}
