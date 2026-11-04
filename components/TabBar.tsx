"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";

/** App-style bottom tab bar for phones. "Menu" opens the bottom-sheet menu owned by Nav (via `dol:menu`). */
const TABS = [
  { label: "Home", href: "/", icon: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z", match: (p: string) => p === "/" },
  { label: "Internet", href: "/internet", icon: "M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01", match: (p: string) => p.startsWith("/internet") || p === "/coverage" },
  { label: "Cloud", href: "/cloud-hosting", icon: "M4 6h16v5H4zM4 13h16v5H4zM7 8.5h.01M7 15.5h.01", match: (p: string) => ["/cloud-hosting", "/domain", "/web-hosting", "/vps", "/data-center"].some((r) => p.startsWith(r)) },
  { label: "Support", href: "/support", icon: "M12 3a9 9 0 1 0 9 9M12 8v5l3 2M21 3v5h-5", match: (p: string) => p.startsWith("/support") || p === "/status" || p === "/complaints" },
];

export default function TabBar() {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const on = (e: Event) => setMenu((e as CustomEvent<boolean>).detail);
    addEventListener("dol:menu-state", on);
    return () => removeEventListener("dol:menu-state", on);
  }, []);
  const active = TABS.findIndex((t) => t.match(path));

  return (
    <nav aria-label="Quick navigation" className="tabbar fixed inset-x-0 bottom-0 z-[55] lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <ul className="mx-auto grid h-16 max-w-[560px] grid-cols-5 px-2">
        {TABS.map((t, i) => {
          const on = i === active && !menu;
          return (
            <li key={t.label}>
              <Link href={t.href} aria-current={on ? "page" : undefined} className="tab-btn relative flex h-full flex-col items-center justify-center gap-1">
                {on && <motion.span layoutId="tab-pill" transition={{ type: "spring", stiffness: 520, damping: 36 }} className="absolute top-1.5 h-8 w-14 rounded-[6px] bg-red/10" />}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={clsx("relative transition-colors", on ? "text-red" : "tab-fg")} aria-hidden><path d={t.icon} /></svg>
                <span className={clsx("relative text-[11px] font-medium leading-none", on ? "text-red" : "tab-fg")}>{t.label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button type="button" aria-expanded={menu} aria-label={menu ? "Close menu" : "Open menu"} onClick={() => dispatchEvent(new CustomEvent("dol:menu", { detail: !menu }))} className="tab-btn relative flex h-full w-full flex-col items-center justify-center gap-1">
            {menu && <motion.span layoutId="tab-pill" transition={{ type: "spring", stiffness: 520, damping: 36 }} className="absolute top-1.5 h-8 w-14 rounded-[6px] bg-red/10" />}
            <span className={clsx("relative flex h-[22px] w-[22px] flex-col items-center justify-center gap-[5px]", menu ? "text-red" : "tab-fg")}>
              <i className={clsx("block h-[1.8px] w-[18px] rounded bg-current transition-transform duration-300", menu && "translate-y-[3.4px] rotate-45")} />
              <i className={clsx("block h-[1.8px] w-[18px] rounded bg-current transition-transform duration-300", menu && "-translate-y-[3.4px] -rotate-45")} />
            </span>
            <span className={clsx("relative text-[11px] font-medium leading-none", menu ? "text-red" : "tab-fg")}>Menu</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
