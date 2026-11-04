import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import Shell from "@/components/Shell";
import SupportGuide from "@/components/SupportGuide";
import { PageHero, Section, Grid, Card, ContactCards, EndCTA } from "@/components/kit";
import { PrimaryButton, SecondaryButton, TextLink } from "@/components/Button";
import { CONTACT, KB_CATEGORIES } from "@/lib/content";

export const metadata: Metadata = seo("/support");

export default function SupportPage() {
  return (
    <Shell>
      <PageHero code="SP" eyebrow="DOL Support · Context first" title={<>Get the right help <span className="text-red">without losing context.</span></>}
        sub="Start with the need and a guided checklist for safe first steps. Never share passwords, OTPs, private keys or full payment details."
        img="/img/pg-support.webp" imgAlt="Isometric support desk with headset"
        actions={<><PrimaryButton href="#guide">Start a guided check</PrimaryButton><SecondaryButton href="/status">Service status</SecondaryButton></>} />
      <Section id="guide" n="01" tone="white" tag="Guided support" title={<>Useful first guidance.<br />A human when it matters.</>} sub="Pick a service and symptom. The checklist runs in your browser and prepares a summary for DOL.">
        <SupportGuide />
      </Section>
      <Section n="02" tag="Self-service library" title="Search the Knowledge Base." aside={<TextLink href="/support/knowledge-base">All 14 articles</TextLink>}>
        <Grid cols={3}>
          {KB_CATEGORIES.map((c, i) => (
            <Link key={c} href={`/support/knowledge-base?c=${encodeURIComponent(c)}`} className="group flex items-center justify-between gap-4 bg-white px-7 py-7 transition-colors hover:bg-paper">
              <span className="flex flex-col gap-1.5"><span className="font-mono text-[12px] text-red">0{i + 1}</span><span className="text-[19px] font-medium">{c}</span></span>
              <span className="text-[20px] transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </Grid>
      </Section>
      <Section n="03" tone="dark" tag="Human support paths" title={<>Choose the right<br /><span className="text-mute">human contact path.</span></>}>
        <Grid cols={4} tone="dark">
          {[["Incident", "A live service is affected", "Bring the affected service, location, start time and business impact."], ["Accounts", "Billing or account support", "Bring the customer or invoice reference; keep credentials out."], ["Sales", "New service or a change", "Bring the location, outcome, constraint and decision context."], ["Data Center", "Colocation or facility need", "Bring the facility, rack requirement or service reference."]].map(([k, t, b]) => (
            <Card key={k} tone="dark"><span className="label text-red">{k}</span><span className="text-[21px] font-medium">{t}</span><span className="text-[15px] leading-6 text-soft">{b}</span></Card>
          ))}
        </Grid>
        <ContactCards tone="dark" noc />
      </Section>
      <EndCTA title={<>Something still<br /><span className="text-mute">not right?</span></>} sub="Raise a complaint and ask for a reference you can follow up." primary={{ label: "Complaints & appeals", href: "/complaints" }} secondary={{ label: `Call ${CONTACT.office}`, href: `tel:${CONTACT.officeTel}` }} />
    </Shell>
  );
}
