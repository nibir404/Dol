"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { PrimaryButton, SecondaryButton, TextLink, PixelArrow } from "./Button";
import { Reveal } from "./Reveal";
import TiltImage from "./TiltImage";
import { CONTACT } from "@/lib/content";

const ease = [0.23, 1, 0.32, 1] as const;
export type Tone = "light" | "dark" | "white";
const toneCls: Record<Tone, string> = {
  light: "bg-paper text-ink border-line",
  white: "bg-white text-ink border-line",
  dark: "bg-ink text-white border-line-dark",
};
const isDark = (t: Tone) => t === "dark";

export function Rail({ n, tone = "light" }: { n?: string; tone?: Tone }) {
  return <div aria-hidden className={clsx("rail", isDark(tone) ? "border-line-dark text-mute" : "border-line text-mute")}>{n}</div>;
}

export function Tag({ children, tone = "light", dot = "red" }: { children: React.ReactNode; tone?: Tone; dot?: "red" | "green" }) {
  return (
    <span className={clsx("tag label", isDark(tone) ? "border-line-strong text-white" : "border-[#D6D4CD] bg-white text-ink")}>
      <i className={clsx("block h-1.5 w-1.5", dot === "green" ? "rounded-full bg-green" : "bg-red")} />{children}
    </span>
  );
}

/** Page header: copy left, interactive illustration right. */
export function PageHero({
  eyebrow, title, sub, img, imgAlt = "", actions, stats, tone = "light", code = "00",
}: {
  eyebrow: string; title: React.ReactNode; sub?: string; img?: string; imgAlt?: string; actions?: React.ReactNode;
  stats?: { k: string; v: string }[]; tone?: Tone; code?: string;
}) {
  const dark = isDark(tone);
  return (
    <section className={clsx("border-b pt-[72px] md:pt-[116px]", toneCls[tone])}>
      <div className="flex">
        <Rail n={code} tone={tone} />
        <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
          <div className="flex min-w-0 flex-col justify-center gap-6 px-5 py-14 md:px-10 md:py-20 lg:w-[56%] lg:px-14 lg:py-24">
            <Reveal><Tag tone={tone}>{eyebrow}</Tag></Reveal>
            <Reveal delay={0.05}>
              <h1 className="h-display text-[44px] leading-[1.02] tracking-[-0.05em] sm:text-[60px] xl:text-[64px]">{title}</h1>
            </Reveal>
            {sub && <Reveal delay={0.1}><p className={clsx("max-w-[560px] text-[17px] leading-7 md:text-[19px] md:leading-[30px]", dark ? "text-soft" : "text-body")}>{sub}</p></Reveal>}
            {actions && <Reveal delay={0.15} className="flex flex-wrap items-center gap-3 pt-2">{actions}</Reveal>}
          </div>
          {img && (
            <div className={clsx("relative min-h-[300px] flex-1 border-t sm:min-h-[380px] lg:border-l lg:border-t-0", dark ? "border-line-dark" : "border-line")}>
              <TiltImage src={img} alt={imgAlt} sizes="(min-width:1024px) 44vw, 100vw" priority dark={dark} />
            </div>
          )}
        </div>
      </div>
      {stats && (
        <div className={clsx("grid grid-cols-2 border-t md:grid-cols-4 lg:pl-[120px]", dark ? "border-line-dark" : "border-line")}>
          {stats.map((s, i) => (
            <div key={s.k} className={clsx("flex flex-col gap-1.5 px-5 py-5 md:px-8", dark ? "border-line-dark" : "border-line", i % 2 === 0 && "border-r", i < 2 && "border-b md:border-b-0", "md:border-r md:last:border-r-0")}>
              <span className={clsx("label", dark ? "text-mute" : "text-mute")}>{s.k}</span>
              <span className="font-mono text-[26px] font-medium tracking-[-0.02em] md:text-[30px]">{s.v}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** Standard numbered section with heading block. */
export function Section({
  n, tag, title, sub, tone = "light", children, aside, id, bleed,
}: {
  n?: string; tag?: string; title?: React.ReactNode; sub?: string; tone?: Tone; children?: React.ReactNode; aside?: React.ReactNode; id?: string; bleed?: boolean;
}) {
  const dark = isDark(tone);
  return (
    <section id={id} className={clsx("scroll-mt-28 border-b", toneCls[tone])}>
      <div className="flex">
        <Rail n={n} tone={tone} />
        <div className="flex min-w-0 flex-1 flex-col">
          {(tag || title) && (
            <div className="flex flex-col justify-between gap-6 px-5 pb-10 pt-16 md:px-10 lg:flex-row lg:items-end lg:px-14 lg:pb-12 lg:pt-24">
              <div className="flex flex-col gap-5">
                {tag && <Reveal><Tag tone={tone}>{tag}</Tag></Reveal>}
                {title && <Reveal delay={0.05}><h2 className="h-display text-[36px] leading-[1.04] md:text-[48px]">{title}</h2></Reveal>}
                {sub && <Reveal delay={0.1}><p className={clsx("max-w-[620px] text-[17px] leading-7", dark ? "text-soft" : "text-body")}>{sub}</p></Reveal>}
              </div>
              {aside && <Reveal delay={0.1} className="flex flex-wrap gap-3">{aside}</Reveal>}
            </div>
          )}
          <div className={clsx(!bleed && (tag || title) && "border-t", dark ? "border-line-dark" : "border-line")}>{children}</div>
        </div>
      </div>
    </section>
  );
}

/** Responsive card grid with hairline dividers and hover lift. */
export function Grid({ cols = 3, tone = "light", children }: { cols?: 2 | 3 | 4 | 5; tone?: Tone; children: React.ReactNode }) {
  const c = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 xl:grid-cols-3", 4: "sm:grid-cols-2 xl:grid-cols-4", 5: "sm:grid-cols-2 lg:grid-cols-5" }[cols];
  return <div className={clsx("snap-row grid grid-cols-1 gap-px", c, isDark(tone) ? "bg-line-dark" : "bg-line")}>{children}</div>;
}

export function Card({ children, tone = "light", className, highlight }: { children: React.ReactNode; tone?: Tone; className?: string; highlight?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease }}
      className={clsx(
        "group relative flex flex-col gap-4 p-7 md:p-9",
        highlight ? "bg-ink text-white" : isDark(tone) ? "bg-panel text-white" : "bg-white text-ink",
        className
      )}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-red transition-transform duration-500 ease-out group-hover:scale-x-100" />
      {children}
    </motion.div>
  );
}

/** Plan card used for hosting, VPS, colocation and home packages. */
export function PlanCard({
  name, fit, price, unit, features, popular, cta = "Talk to Sales", tone = "light", note,
}: { name: string; fit: string; price: string; unit: string; features: string[]; popular?: boolean; cta?: string; tone?: Tone; note?: string }) {
  const dark = popular || isDark(tone);
  return (
    <Card tone={tone} highlight={popular}>
      <div className="flex items-center justify-between">
        <span className="label text-[12px]">{name}</span>
        {popular && <span className="label rounded-[4px] bg-[#C4161C] keep-white px-2.5 py-1 text-[10px] text-white">Most chosen</span>}
      </div>
      <span className={clsx("text-[15px]", dark ? "text-soft" : "text-body")}>{fit}</span>
      <div className="flex items-baseline gap-2 pt-2">
        <span className="font-medium leading-none tracking-[-0.04em] text-[40px] md:text-[44px]">{price}</span>
        <span className={clsx("text-[15px]", dark ? "text-soft" : "text-body")}>{unit}</span>
      </div>
      <ul className={clsx("flex flex-col gap-2.5 border-t pt-5 text-[15px]", dark ? "border-line-dark" : "border-line")}>
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5"><span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-red" />{f}</li>
        ))}
      </ul>
      <div className="mt-auto pt-4">
        {popular ? <PrimaryButton size="sm" href={`tel:${CONTACT.salesTel}`}>{cta}</PrimaryButton> : <SecondaryButton size="sm" tone={dark ? "dark" : "light"} href={`tel:${CONTACT.salesTel}`}>{cta}</SecondaryButton>}
      </div>
      {note && <span className={clsx("text-[13px]", dark ? "text-mute" : "text-mute")}>{note}</span>}
    </Card>
  );
}

/** Horizontal numbered steps with a connector that draws in. */
export function Steps({ steps, tone = "light" }: { steps: { t: string; b: string }[]; tone?: Tone }) {
  const dark = isDark(tone);
  const cols = { 3: "md:grid-cols-3", 4: "md:grid-cols-2 xl:grid-cols-4", 5: "md:grid-cols-5", 6: "md:grid-cols-3 xl:grid-cols-6" }[steps.length as 3 | 4 | 5 | 6] ?? "md:grid-cols-3";
  return (
    <ol className={clsx("relative grid grid-cols-1 gap-px", cols, dark ? "bg-line-dark" : "bg-line")}>
      <motion.span aria-hidden initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }} className="absolute inset-x-0 top-0 z-10 hidden h-[2px] origin-left bg-red md:block" />
      {steps.map((s, i) => (
        <Reveal as="li" key={s.t} delay={0.06 * i} className={clsx("flex flex-col gap-10 px-7 pb-9 pt-8 md:gap-14", dark ? "bg-panel" : "bg-white")}>
          <span className={clsx("flex h-8 w-8 items-center justify-center rounded-full border font-mono text-[12px]", dark ? "border-white/40" : "border-ink")}>{i + 1}</span>
          <div className="flex flex-col gap-2">
            <span className="text-[22px] font-medium tracking-[-0.02em]">{s.t}</span>
            <span className={clsx("text-[15px] leading-[23px]", dark ? "text-soft" : "text-body")}>{s.b}</span>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

/** Accessible single-open accordion. */
export function Faq({ items, tone = "light" }: { items: [string, string][]; tone?: Tone }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  const dark = isDark(tone);
  // FAQPage structured data so answer engines can quote these directly
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <ul className={clsx(dark ? "bg-panel" : "bg-white")}>
      {items.map(([q, a], i) => {
        const on = open === i;
        return (
          <li key={q} className={clsx("border-b last:border-b-0", dark ? "border-line-dark" : "border-line")}>
            <h3>
              <button id={`${base}-q${i}`} aria-controls={`${base}-a${i}`} aria-expanded={on} onClick={() => setOpen(on ? null : i)} className="flex w-full items-center justify-between gap-6 px-5 py-6 text-left md:px-10">
                <span className="text-[18px] font-medium md:text-[20px]">{q}</span>
                <span aria-hidden className={clsx("relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-200", dark ? "border-white/40" : "border-ink", on && "border-red bg-red text-white")}>
                  <span className={clsx("absolute h-px w-3", on ? "bg-white" : dark ? "bg-white" : "bg-ink")} />
                  <span className={clsx("absolute h-3 w-px transition-transform duration-300 ease-out", on ? "scale-y-0 bg-white" : dark ? "bg-white" : "bg-ink")} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div id={`${base}-a${i}`} role="region" aria-labelledby={`${base}-q${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                  <p className={clsx("max-w-[720px] px-5 pb-7 text-[16px] leading-[26px] md:px-10", dark ? "text-soft" : "text-body")}>{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
    </>
  );
}

/** Contact channels; every card is a real link. */
export function ContactCards({ tone = "light", noc }: { tone?: Tone; noc?: boolean }) {
  const dark = isDark(tone);
  const items = [
    noc ? { k: "Service problem", v: CONTACT.noc, href: `mailto:${CONTACT.noc}` } : { k: "Sales", v: CONTACT.sales, href: `tel:${CONTACT.salesTel}` },
    { k: "Office", v: CONTACT.office, href: `tel:${CONTACT.officeTel}` },
    { k: "Email", v: CONTACT.info, href: `mailto:${CONTACT.info}` },
    { k: "WhatsApp", v: CONTACT.hours, href: CONTACT.whatsapp },
  ];
  return (
    <Grid cols={4} tone={tone}>
      {items.map((c) => (
        <a key={c.k} href={c.href} className={clsx("group flex items-center justify-between gap-4 px-7 py-7 transition-colors duration-200", dark ? "bg-panel hover:bg-[#1c1c1c]" : "bg-white hover:bg-paper")}>
          <span className="flex min-w-0 flex-col gap-1.5">
            <span className={clsx("label", dark ? "text-mute" : "text-mute")}>{c.k}</span>
            <span className="truncate text-[17px] font-medium">{c.v}</span>
          </span>
          <span className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1"><PixelArrow size={18} mid={dark ? "#fff" : "#111"} /></span>
        </a>
      ))}
    </Grid>
  );
}

/** Generic "prepare a request" form. Front-end only: shows a summary the visitor can send by email. */
export function InterestForm({
  fields, choices, consent, submit, subject, tone = "dark", note,
}: {
  fields: { name: string; label: string; type?: string; required?: boolean; placeholder?: string; wide?: boolean; options?: string[] }[];
  choices?: { label: string; options: string[] };
  consent: string; submit: string; subject: string; tone?: Tone; note?: string;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const dark = isDark(tone);
  const field = clsx("w-full border-b bg-transparent py-3 text-[17px] outline-none transition-colors placeholder:text-mute", dark ? "border-line-strong text-white focus:border-white" : "border-[#CFCCC4] text-ink focus:border-ink");
  return (
    <AnimatePresence mode="wait">
      {summary ? (
        <motion.div key="ok" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease }} className={clsx("flex flex-col gap-5 border p-8 md:p-10", dark ? "border-line-strong" : "border-line bg-white")}>
          <span className="label flex items-center gap-2 text-green"><i className="h-1.5 w-1.5 rounded-full bg-green" />Ready to send</span>
          <span className="text-[24px] font-medium tracking-[-0.02em]">Your request is prepared.</span>
          <pre className={clsx("whitespace-pre-wrap font-mono text-[13px] leading-6", dark ? "text-soft" : "text-body")}>{summary}</pre>
          <div className="flex flex-wrap gap-3">
            <PrimaryButton href={`mailto:${CONTACT.info}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`}>Send by email</PrimaryButton>
            <button onClick={() => setSummary(null)} className={clsx("text-[15px] font-medium underline underline-offset-[5px]", dark ? "text-white" : "text-ink")}>Edit details</button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0, y: -8 }}
          onSubmit={(e) => {
            e.preventDefault();
            const f = e.currentTarget as HTMLFormElement;
            if (!f.reportValidity()) return;
            const d = new FormData(f);
            const lines = fields.map((x) => `${x.label}: ${d.get(x.name) || "—"}`);
            if (choices) lines.push(`${choices.label}: ${picked.join(", ") || "—"}`);
            setSummary(lines.join("\n"));
          }}
          className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2"
        >
          {fields.map((x) => (
            <label key={x.name} className={clsx("flex flex-col", x.wide && "md:col-span-2")}>
              <span className={clsx("label", dark ? "text-mute" : "text-mute")}>{x.label}{!x.required && " · optional"}</span>
              {x.options ? (
                <select name={x.name} required={x.required} defaultValue="" className={clsx(field, "appearance-none", dark && "[color-scheme:dark]")}>
                  <option value="" disabled>Choose…</option>
                  {x.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : x.type === "textarea" ? (
                <textarea name={x.name} required={x.required} rows={3} placeholder={x.placeholder} className={clsx(field, "resize-y")} />
              ) : (
                <input name={x.name} type={x.type ?? "text"} required={x.required} placeholder={x.placeholder} className={field} />
              )}
            </label>
          ))}
          {choices && (
            <fieldset className="md:col-span-2">
              <legend className={clsx("label mb-3", dark ? "text-mute" : "text-mute")}>{choices.label}</legend>
              <div className="flex flex-wrap gap-2">
                {choices.options.map((w) => {
                  const on = picked.includes(w);
                  return (
                    <button type="button" key={w} aria-pressed={on} onClick={() => setPicked((p) => (on ? p.filter((x) => x !== w) : [...p, w]))}
                      className={clsx("rounded-[6px] border px-4 py-2.5 text-[15px] transition-colors duration-200", on ? "border-red bg-red text-white" : dark ? "border-line-strong text-soft hover:border-white hover:text-white" : "border-[#CFCCC4] text-body hover:border-ink hover:text-ink")}>
                      {w}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
          <label className="flex items-start gap-3 md:col-span-2">
            <input type="checkbox" required className="mt-1 h-4 w-4 accent-[#E31E24]" />
            <span className={clsx("text-[15px] leading-6", dark ? "text-soft" : "text-body")}>{consent}</span>
          </label>
          <div className="flex flex-wrap items-center gap-4 md:col-span-2">
            <PrimaryButton submit>{submit}</PrimaryButton>
            {note && <span className={clsx("text-[13px]", dark ? "text-mute" : "text-mute")}>{note}</span>}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/** Policy/legal layout with a sticky table of contents and scroll-spy. */
export function DocLayout({ sections }: { sections: { h: string; p?: string[]; li?: string[] }[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); });
    }, { rootMargin: "-30% 0px -60% 0px" });
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className="flex flex-col lg:flex-row">
      <nav aria-label="On this page" className="border-b border-line px-5 py-6 md:px-10 lg:w-[320px] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-14 lg:py-16">
        <div className="lg:sticky lg:top-32">
          <span className="label text-mute">On this page · {sections.length} sections</span>
          <ol className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible">
            {sections.map((s, i) => (
              <li key={s.h} className="shrink-0">
                <a href={`#${slug(s.h)}`} className={clsx("flex items-center gap-3 rounded-full px-3 py-2 text-[15px] transition-colors duration-200 lg:rounded-none lg:px-0", active === i ? "bg-ink text-white lg:bg-transparent lg:text-ink" : "text-body hover:text-ink")}>
                  <span className={clsx("hidden h-px transition-all duration-300 lg:block", active === i ? "w-6 bg-red" : "w-3 bg-[#CFCCC4]")} />{s.h}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
      <div className="min-w-0 flex-1 bg-white">
        {sections.map((s, i) => (
          <article key={s.h} id={slug(s.h)} data-i={i} ref={(el) => { refs.current[i] = el; }} className="scroll-mt-32 border-b border-line px-5 py-12 last:border-b-0 md:px-10 lg:px-16 lg:py-14">
            <span className="font-mono text-[12px] text-red">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="mt-3 text-[28px] font-medium tracking-[-0.02em] md:text-[32px]">{s.h}</h2>
            <div className="mt-5 flex max-w-[720px] flex-col gap-4 text-[17px] leading-[28px] text-body">
              {s.p?.map((x) => <p key={x}>{x}</p>)}
              {s.li && <ul className="flex flex-col gap-3">{s.li.map((x) => <li key={x} className="flex gap-3"><span aria-hidden className="mt-[11px] h-1.5 w-1.5 shrink-0 bg-red" />{x}</li>)}</ul>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/** Closing call to action used on every inner page. */
export function EndCTA({ title, sub, primary, secondary }: { title: React.ReactNode; sub?: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  return (
    <section className="border-b border-line-dark bg-[#121212] text-white">
      <div className="flex">
        <Rail tone="dark" />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-10 bg-[radial-gradient(circle_at_85%_30%,#2A2A2A_0%,#161616_45%,#121212_100%)] px-5 py-20 md:px-10 lg:flex-row lg:items-end lg:px-14 lg:py-24">
          <div className="flex flex-col gap-5">
            <Reveal><h2 className="h-display text-[36px] leading-[1] tracking-[-0.05em] md:text-[48px]">{title}</h2></Reveal>
            {sub && <Reveal delay={0.05}><p className="max-w-[560px] text-[17px] text-soft">{sub}</p></Reveal>}
          </div>
          <Reveal delay={0.1} className="flex flex-wrap gap-3">
            <PrimaryButton size="lg" href={primary.href}>{primary.label}</PrimaryButton>
            {secondary && <SecondaryButton size="lg" tone="dark" href={secondary.href}>{secondary.label}</SecondaryButton>}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export { TextLink };
