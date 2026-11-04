"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { PrimaryButton, SecondaryButton } from "./Button";
import { CONTACT, NAV } from "@/lib/content";
import ThemeToggle from "./ThemeToggle";
import TiltImage from "./TiltImage";

const MENU_IMG: Record<string, string> = { Internet: "/img/illo-home.webp", "Cloud & Hosting": "/img/illo-hosting.webp", "Data Center": "/img/illo-datacenter.webp", Solutions: "/img/pg-solutions.webp", Support: "/img/pg-support.webp" };

const ease = [0.23, 1, 0.32, 1] as const;

export default function Nav() {
  const path = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [acc, setAcc] = useState<string | null>(null);
  const closeT = useRef<number>();
  const [hov, setHov] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 160 && y > prev && !open);
    setSolid(y > 40);
  });
  useEffect(() => { setOpen(false); setMenu(null); }, [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(null); setOpen(false); } };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { document.documentElement.style.overflow = open ? "hidden" : ""; }, [open]);

  const isActive = (g: (typeof NAV)[number]) => path === g.href || g.items?.some((i) => path === i.href || path.startsWith(i.href + "/"));
  const enter = (l: string) => { clearTimeout(closeT.current); setMenu(l); };
  const leave = () => { closeT.current = window.setTimeout(() => setMenu(null), 140); };

  return (
    <>
      <motion.header animate={{ y: hidden ? "-110%" : "0%" }} transition={{ duration: 0.4, ease }} className="fixed inset-x-0 top-0 z-50" onMouseLeave={leave}>
        <nav aria-label="Primary" className={clsx("nav-bar relative grid h-[68px] grid-cols-[1fr_auto] items-center gap-4 px-5 lg:grid-cols-[1fr_auto_1fr] transition-[background,border-color] duration-300 md:h-[76px] md:px-6 lg:px-10", solid || menu || open ? "nav-solid" : "")}>
          <Link href="/" aria-label="Daffodil Online home" className="shrink-0">
            <Image src="/img/logo-dark.png" alt="Daffodil Online" width={88} height={54} priority className="logo-dark h-[38px] w-auto md:h-[44px]" />
            <Image src="/img/logo-light.png" alt="" aria-hidden width={88} height={54} priority className="logo-light h-[38px] w-auto md:h-[44px]" />
          </Link>

          {/* centre group */}
          <div className="hidden justify-center lg:flex"><ul onMouseLeave={() => setHov(null)} className="nav-group flex items-center gap-1 rounded-[6px] p-1">
            {NAV.map((g) => {
              const pick = menu ?? hov;
              const on = pick ? pick === g.label : !!isActive(g);
              return (
                <li key={g.label} className="relative" onMouseEnter={() => { setHov(g.label); if (g.items) enter(g.label); else setMenu(null); }}>
                  {on && <motion.span layoutId="nav-tile" transition={{ type: "spring", stiffness: 500, damping: 38 }} className="nav-tile absolute inset-0 rounded-[6px]" />}
                  <Link href={g.href} aria-expanded={g.items ? menu === g.label : undefined} onFocus={() => g.items && enter(g.label)}
                    className={clsx("relative flex h-10 items-center gap-1.5 whitespace-nowrap rounded-[6px] px-4 text-[15px] font-medium transition-colors duration-200", on ? "nav-tile-fg" : "nav-fg")}>
                    {g.label}
                    {g.items && <svg width="9" height="9" viewBox="0 0 10 10" className={clsx("opacity-60 transition-transform duration-200", menu === g.label && "rotate-180")} aria-hidden><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>}
                  </Link>
                </li>
              );
            })}
          </ul></div>

          {/* right group */}
          <div className="flex items-center justify-self-end gap-2">
            <div className="hidden items-center gap-1 md:flex" onMouseEnter={() => setMenu(null)}>
              <Link href="/career" className="nav-fg hidden h-10 items-center rounded-[6px] px-4 text-[15px] font-medium 2xl:flex">Career</Link>
              <Link href="/about" className="nav-fg hidden h-10 items-center rounded-[6px] px-4 text-[15px] font-medium 2xl:flex">Company</Link>
              <PrimaryButton size="sm" href="/coverage">Check coverage</PrimaryButton>
            </div>
            <ThemeToggle className="nav-fg hidden lg:inline-flex" />
            <button aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)} className="nav-group nav-fg relative flex h-11 w-11 items-center justify-center rounded-[6px] lg:hidden">
              <span className={clsx("absolute h-px w-4 bg-current transition-transform duration-300", open ? "rotate-45" : "-translate-y-[3px]")} />
              <span className={clsx("absolute h-px w-4 bg-current transition-transform duration-300", open ? "-rotate-45" : "translate-y-[3px]")} />
            </button>
          </div>
        </nav>

        {/* mega menu */}
        <AnimatePresence>
          {menu && (() => {
            const g = NAV.find((n) => n.label === menu)!;
            return (
              <motion.div key="mega" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease }}
                onMouseEnter={() => enter(menu)} className="absolute inset-x-0 top-full hidden justify-center px-10 lg:flex">
                <div className="nav-mega mt-2 flex w-full max-w-[920px] overflow-hidden rounded-[6px]">
                  <AnimatePresence mode="wait">
                    <motion.div key={menu} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }} className="flex w-full">
                      <ul className="grid flex-1 grid-cols-2 content-start gap-1 p-3">
                        {g.items!.map((it) => (
                          <li key={it.href + it.label}>
                            <Link href={it.href} className={clsx("nav-mega-item group flex h-full flex-col gap-1 rounded-[6px] p-4", path === it.href && "is-on")}>
                              <span className="flex items-center justify-between text-[15px] font-medium">{it.label}<span className="text-red opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">→</span></span>
                              <span className="text-[13px] leading-5 text-soft">{it.b}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link href={g.href} className="tilt-host group relative hidden w-[300px] shrink-0 flex-col justify-end border-l border-[var(--nav-line)] p-5 md:flex">
                        <div className="absolute inset-0"><TiltImage src={MENU_IMG[g.label] ?? "/img/pg-solutions.webp"} alt="" sizes="300px" max={4} /></div>
                        <span className="label relative flex items-center gap-2">All of {g.label}<span className="text-red">→</span></span>
                      </Link>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }}
            className="util-bar fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink lg:hidden px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[96px] md:px-6 md:pt-[120px] lg:px-[120px]"
            data-lenis-prevent
          >
            {/* desktop: mega grid */}
            <div className="hidden gap-8 lg:grid lg:grid-cols-5">
              {NAV.map((g, i) => (
                <motion.div key={g.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease }} className="group flex flex-col gap-5">
                  <Link href={g.href} className="block overflow-hidden rounded-[6px] border border-line-dark">
                    <div className="relative aspect-[4/3]"><TiltImage src={MENU_IMG[g.label] ?? "/img/pg-solutions.webp"} alt="" sizes="260px" max={4} /></div>
                  </Link>
                  <Link href={g.href} className="flex items-center justify-between text-[22px] font-medium tracking-[-0.02em] text-white">{g.label}<span className="text-red transition-transform duration-300 group-hover:translate-x-1">→</span></Link>
                  <ul className="flex flex-col gap-3">
                    {(g.items ?? [{ label: "All solutions", href: g.href, b: "Packages by industry and team size." }]).map((it) => (
                      <li key={it.href + it.label}><Link href={it.href} className="group/it flex flex-col gap-0.5"><span className={clsx("text-[15px] transition-colors group-hover/it:text-white", path === it.href ? "text-white" : "text-soft")}>{it.label}</span><span className="text-[13px] text-soft/70">{it.b}</span></Link></li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            {/* mobile: accordion */}
            <ul className="flex flex-col lg:hidden">
              {NAV.map((g, i) => (
                <motion.li key={g.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease }} className="border-b border-line-dark">
                  <div className="flex items-center justify-between">
                    <Link href={g.href} className={clsx("py-5 text-[30px] font-medium tracking-[-0.03em]", isActive(g) ? "text-white" : "text-white/80")}>{g.label}</Link>
                    {g.items && (
                      <button aria-label={`Show ${g.label} pages`} aria-expanded={acc === g.label} onClick={() => setAcc(acc === g.label ? null : g.label)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white">
                        <svg width="12" height="12" viewBox="0 0 10 10" className={clsx("transition-transform duration-300", acc === g.label && "rotate-180")} aria-hidden><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
                      </button>
                    )}
                  </div>
                  <AnimatePresence initial={false}>
                    {acc === g.label && g.items && (
                      <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                        {g.items.map((it) => (
                          <li key={it.href + it.label}><Link href={it.href} className="flex flex-col gap-0.5 py-3 pl-1"><span className="text-[17px] text-white">{it.label}</span><span className="text-[14px] text-soft">{it.b}</span></Link></li>
                        ))}
                        <li className="h-3" />
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-auto flex flex-col gap-6 border-t border-line-dark pt-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="label flex flex-wrap items-center gap-x-7 gap-y-3 text-soft">
                <ThemeToggle className="text-white" />
                <Link href="/about" className="hover:text-white">About DOL</Link><Link href="/academy" className="hover:text-white">Academy</Link><Link href="/career" className="hover:text-white">Career</Link><Link href="/status" className="hover:text-white">Status</Link>
                <a href={`tel:${CONTACT.salesTel}`} className="hover:text-white">Sales {CONTACT.sales}</a>
              </div>
              <div className="flex flex-wrap gap-3">
                <SecondaryButton tone="dark" href="/my-dol">My DOL</SecondaryButton>
                <PrimaryButton href="/coverage">Check coverage</PrimaryButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

