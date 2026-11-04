"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type Tone = "light" | "dark";
type Size = "sm" | "md" | "lg";

export function PixelArrow({ size = 22, mid = "#111111" }: { size?: number; mid?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden>
      <rect x="5" y="2" width="3.5" height="3.5" fill="#E31E24" />
      <rect x="9.5" y="6.25" width="3.5" height="3.5" fill="#E31E24" />
      <rect x="14" y="9.25" width="3.5" height="3.5" fill={mid} />
      <rect x="9.5" y="12.25" width="3.5" height="3.5" fill="#E31E24" />
      <rect x="5" y="16.5" width="3.5" height="3.5" fill="#E31E24" />
    </svg>
  );
}

const sizes: Record<Size, { h: string; knob: string; text: string; pr: string }> = {
  sm: { h: "h-10", knob: "w-[52px]", text: "text-[14px]", pr: "pr-4" },
  md: { h: "h-10", knob: "w-[52px]", text: "text-[15px]", pr: "pr-4" },
  lg: { h: "h-10", knob: "w-[52px]", text: "text-[15px]", pr: "pr-5" },
};

/**
 * Primary: one red pill, label + arrow. Hover floods it from the exact entry point
 * (ink in light mode, white in dark mode) while the arrow slides out and back in.
 */
export function PrimaryButton({ children, size = "md", href = "#", className, submit, disabled }: { children: React.ReactNode; size?: Size; href?: string; className?: string; submit?: boolean; flush?: boolean; disabled?: boolean }) {
  const d = { sm: { h: "h-10", text: "text-[14px]", px: "pl-4 pr-3.5" }, md: { h: "h-10", text: "text-[15px]", px: "pl-5 pr-4" }, lg: { h: "h-10", text: "text-[15px]", px: "pl-5 pr-4" } }[size];
  const Comp = submit ? motion.button : motion.a;
  const ez = [0.23, 1, 0.32, 1] as const;
  const origin = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <Comp
      {...(submit ? { type: "submit" as const, disabled } : { href, "aria-disabled": disabled || undefined })}
      initial="rest"
      whileHover={disabled ? undefined : "hover"}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onPointerEnter={origin}
      onPointerLeave={origin}
      className={clsx(
        "btn-primary group relative isolate inline-flex shrink-0 select-none items-center justify-center gap-3 whitespace-nowrap rounded-[6px] font-medium tracking-[-0.01em] outline-none",
        "focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
        d.h, d.text, d.px,
        disabled ? "pointer-events-none bg-[#E4E2DC] text-mute" : "btn-glow text-white",
        className
      )}
    >
      {/* Light travelling around the edge (see .btn-glow) */}
      <span aria-hidden className="btn-ring" />
      <span className="btn-label relative transition-colors duration-300">{children}</span>
      <span aria-hidden className="relative flex h-5 w-5 items-center justify-center overflow-hidden">
        <motion.svg variants={{ rest: { x: 0 }, hover: { x: 22 } }} transition={{ duration: 0.3, ease: ez }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" className="btn-label absolute">
          <path d="M4 12h15M13 6l6 6-6 6" />
        </motion.svg>
        <motion.svg variants={{ rest: { x: -22 }, hover: { x: 0 } }} transition={{ duration: 0.3, ease: ez, delay: 0.06 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" className="btn-label absolute">
          <path d="M4 12h15M13 6l6 6-6 6" />
        </motion.svg>
      </span>
    </Comp>
  );
}

/** Secondary: outline pill; hover fills it, the arrow turns red and rotates to →. */
export function SecondaryButton({ children, size = "md", tone = "light", href = "#", className }: { children: React.ReactNode; size?: Size; tone?: Tone; href?: string; className?: string }) {
  const s = sizes[size];
  return (
    <motion.a
      href={href}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "group inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-[6px] border-[1.5px] px-[22px] font-medium tracking-[-0.01em] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2",
        s.h, s.text,
        tone === "light"
          ? "border-ink text-ink [@media(hover:hover)]:hover:bg-ink [@media(hover:hover)]:hover:text-white"
          : "border-white/40 text-white [@media(hover:hover)]:hover:border-white [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:text-ink",
        className
      )}
    >
      {children}
      <motion.svg variants={{ rest: { rotate: 0 }, hover: { rotate: 45 } }} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" className="transition-colors duration-200 group-hover:text-red" aria-hidden>
        <path d="M7 17L17 7M9 7h8v8" />
      </motion.svg>
    </motion.a>
  );
}

/** Tertiary: underlined text link. */
export function TextLink({ children, tone = "light", href, className }: { children: React.ReactNode; tone?: Tone; href?: string; className?: string }) {
  // Without an href it renders as a span, so it can sit inside a card that is already a link
  const Tag = (href ? "a" : "span") as "a";
  return (
    <Tag
      href={href}
      className={clsx(
        "group relative inline-flex items-center gap-1.5 pb-1 text-[15px] font-medium transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-current after:opacity-40 before:absolute before:bottom-0 before:left-0 before:z-[1] before:h-[2px] before:w-0 before:bg-red before:transition-[width] before:duration-300 before:ease-out hover:before:w-full",
        tone === "light" ? "text-ink" : "text-white",
        className
      )}
    >
      {children}
      <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">→</span>
    </Tag>
  );
}
