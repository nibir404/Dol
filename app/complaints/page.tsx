import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import { PageHero, Section, Grid, Card, Steps, EndCTA } from "@/components/kit";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = seo("/complaints");

export default function ComplaintsPage() {
  return (
    <Shell>
      <PageHero code="CA" eyebrow="Complaints & appeals" title={<>Tell DOL when something <span className="text-red">is not right.</span></>}
        sub="Use the channel that matches your concern, and ask for a reference so you can follow up."
        img="/img/pg-complaints.webp" imgAlt="Isometric letterbox and service desk"
        actions={<><PrimaryButton href={`mailto:${CONTACT.info}?subject=Complaint`}>Email a complaint</PrimaryButton><SecondaryButton href={`tel:${CONTACT.officeTel}`}>Call {CONTACT.office}</SecondaryButton></>} />
      <Section n="01" tone="white" tag="How to raise a complaint" title="Pick the right channel.">
        <Grid cols={4}>
          {[
            ["Service incident", "Outage, slow service or other incident", CONTACT.noc, `mailto:${CONTACT.noc}`],
            ["Billing or other", "Billing, account or any other concern", CONTACT.info, `mailto:${CONTACT.info}`],
            ["By phone", "Talk to the office team", CONTACT.office, `tel:${CONTACT.officeTel}`],
            ["In writing / in person", CONTACT.address, "Visit or write", "https://maps.google.com/?q=102/1+Shukrabad+Mirpur+Road+Dhanmondi+Dhaka"],
          ].map(([k, b, v, h]) => (
            <a key={k} href={h} className="group flex flex-col gap-3 bg-white p-8 transition-colors hover:bg-paper">
              <span className="label text-red">{k}</span><span className="text-[15px] leading-6 text-body">{b}</span>
              <span className="mt-auto flex items-center justify-between pt-3 text-[17px] font-medium">{v}<span className="transition-transform group-hover:translate-x-1">→</span></span>
            </a>
          ))}
        </Grid>
      </Section>
      <Section n="02" tag="What to include" title="Help us act on it first time.">
        <Grid cols={4}>
          {["Your name and a phone number or email for the reply.", "Your customer ID or service reference, if you have one.", "The service and location concerned.", "What happened, when, and what you'd like DOL to do."].map((x, i) => (
            <Card key={x}><span className="font-mono text-[12px] text-red">0{i + 1}</span><span className="text-[17px] leading-7">{x}</span></Card>
          ))}
        </Grid>
        <p className="border-t border-line bg-paper px-5 py-5 text-[15px] text-body md:px-10 lg:px-14">Do not send passwords, OTPs or payment card details.</p>
      </Section>
      <Section n="03" tone="dark" tag="What happens next" title={<>Reviewed by the team<br /><span className="text-mute">responsible for the service.</span></>}>
        <Steps tone="dark" steps={[{ t: "Review", b: "DOL reviews the complaint with the responsible team." }, { t: "Reference", b: "Ask for a reference when you contact DOL so you can follow up." }, { t: "Ask for review", b: "Not satisfied? Write to DOL with your earlier reference and ask for it to be reviewed again." }]} />
        <p className="border-t border-line-dark px-5 py-5 text-[14px] text-soft md:px-10 lg:px-14">This website doesn&apos;t yet create complaint references or show progress, and doesn&apos;t publish a response time. A formal appeal process will be published once approved.</p>
      </Section>
      <EndCTA title="Maybe it's a quick fix?" primary={{ label: "Guided support", href: "/support#guide" }} secondary={{ label: "Service status", href: "/status" }} />
    </Shell>
  );
}
