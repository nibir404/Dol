import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import Timeline from "@/components/Timeline";
import TeamGrid from "@/components/TeamGrid";
import { PageHero, Section, Grid, Card, EndCTA } from "@/components/kit";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { PRINCIPLES, POP_COUNT } from "@/lib/content";

export const metadata: Metadata = seo("/about");

export default function AboutPage() {
  return (
    <Shell>
      <PageHero code="AB" eyebrow="About Daffodil Online · Since 2002" title={<>Connecting Bangladesh. <span className="text-red">Building what comes next.</span></>}
        sub="Daffodil Online Limited is a concern of Daffodil Group and a Bangladesh-based nationwide internet service provider and digital-infrastructure company."
        img="/img/pg-about.webp" imgAlt="Isometric Dhaka office with a fibre line crossing a map"
        actions={<><PrimaryButton href="#story">Our story</PrimaryButton><SecondaryButton href="/career">Join the team</SecondaryButton></>}
        stats={[{ k: "Established", v: "21 Jul 2002" }, { k: "Network points", v: String(POP_COUNT) }, { k: "Data centers", v: "2" }, { k: "North star", v: "2035" }]} />
      <Section n="01" tone="white" tag="Who is DOL" title={<>More than an<br />internet connection.</>} sub="DOL connects the network people use with the infrastructure organisations depend on — and the teams that keep both working.">
        <Grid cols={3}>
          {[["One operating model", "Serving a home and designing an enterprise requirement are the same responsibility: understand the need, qualify the reality, deliver clearly."], ["Every corner of Bangladesh", "Reach all 8 divisions and all 64 districts — then keep moving beyond major cities toward communities where access creates opportunity."], ["AI-enabled infrastructure", "Internet, cloud, data centers, billing, logs, support, automation and solutions — working as one system."]].map(([t, b], i) => (
            <Card key={t}><span className="font-mono text-[12px] text-red">0{i + 1}</span><span className="text-[24px] font-medium tracking-[-0.02em]">{t}</span><span className="text-[15px] leading-6 text-body">{b}</span></Card>
          ))}
        </Grid>
      </Section>
      <Section id="story" n="02" tone="dark" tag="Built in chapters" title={<>Built in chapters.<br /><span className="text-mute">Still being written.</span></>}>
        <Timeline />
      </Section>
      <Section n="03" tone="white" tag="The people behind the system" title="Accountability, from direction to delivery." sub="The structure follows accountability from strategic direction to management and then to the operating teams that deliver the work.">
        <TeamGrid />
      </Section>
      <Section n="04" tag="Four principles" title="For the next chapter.">
        <Grid cols={4}>
          {PRINCIPLES.map((p, i) => <Card key={p.t}><span className="font-mono text-[12px] text-red">0{i + 1}</span><span className="text-[22px] font-medium">{p.t}</span><span className="text-[15px] leading-6 text-body">{p.b}</span></Card>)}
        </Grid>
      </Section>
      <EndCTA title={<>Connect more places.<br /><span className="text-mute">Stay accountable.</span></>} sub="Want to help build the next chapter?" primary={{ label: "Explore careers", href: "/career" }} secondary={{ label: "DOL Academy", href: "/academy" }} />
    </Shell>
  );
}
