"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";

export type Theme = "light" | "dark";

/** Reads/writes the theme on <html data-theme>. Broadcasts "dol:theme" so canvases can recolour. */
export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>("dark");
  useEffect(() => {
    const read = () => setThemeState((document.documentElement.dataset.theme as Theme) || "dark");
    read();
    addEventListener("dol:theme", read);
    return () => removeEventListener("dol:theme", read);
  }, []);
  const setTheme = (t: Theme) => {
    const root = document.documentElement;
    // Smooth colour crossfade only for the switch itself
    root.classList.add("theme-anim");
    root.dataset.theme = t;
    root.style.colorScheme = t;
    try { localStorage.setItem("dol-theme", t); } catch {}
    dispatchEvent(new Event("dol:theme"));
    window.setTimeout(() => root.classList.remove("theme-anim"), 450);
  };
  return [theme, setTheme];
}

/** Theme switch drawn as a signal meter: light = full signal (bright), dark = night mode (signal dimmed). */
export default function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={clsx("theme-switch group relative inline-flex h-8 w-[60px] shrink-0 items-center rounded-[6px] p-[3px]", className)}
    >
      <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 34 }} className={clsx("theme-knob flex h-[26px] w-[26px] items-center justify-center rounded-[4px]", dark ? "ml-auto" : "")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <path d="M2.5 9a14 14 0 0 1 19 0" opacity={dark ? 0.3 : 1} />
          <path d="M5.5 12.5a9.5 9.5 0 0 1 13 0" opacity={dark ? 0.3 : 1} />
          <path d="M8.5 16a5 5 0 0 1 7 0" opacity={dark ? 0.55 : 1} />
          <circle cx="12" cy="19.5" r="1.4" fill="#E31E24" stroke="none" />
        </svg>
      </motion.span>
      <span aria-hidden className={clsx("label absolute text-[9px]", dark ? "left-2" : "right-2")}>{dark ? "DK" : "LT"}</span>
    </button>
  );
}
