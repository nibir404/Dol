import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import SolutionPicker from "@/components/SolutionPicker";
import { PageHero, Section, Grid, Card, Steps, EndCTA } from "@/components/kit";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = seo("/solutions");

export default function SolutionsPage() {
  return (
    <Shell>
      <PageHero code="SO" eyebrow="DOL Solutions · Outcome-led" title={<>Complex requirements need <span className="text-red">one accountable design.</span></>}
        sub="When a retail package can't solve the problem, DOL starts with the operating outcome — then connects architecture, delivery, evidence and support."
        img="/img/pg-solutions.webp" imgAlt="Isometric drafting table with a network blueprint"
        actions={<><PrimaryButton href="#outcome">Choose the problem</PrimaryButton><SecondaryButton href={`tel:${CONTACT.salesTel}`}>Discuss a requirement</SecondaryButton></>} />
      <Section id="outcome" n="01" tone="white" tag="Choose the operating problem" title={<>Start with the outcome —<br />not a product stack.</>}>
        <SolutionPicker />
      </Section>
      <Section n="02" tone="dark" tag="Accountable delivery loop" title={<>From discovery to<br /><span className="text-mute">day-to-day operation.</span></>} sub="Each stage has an owner, a decision boundary and evidence for the next stage.">
        <Steps tone="dark" steps={[
          { t: "Discover", b: "Understand the outcome, present operation, constraints, risks and decision owner." },
          { t: "Design", b: "Define architecture, responsibility, evidence, security and service boundaries together." },
          { t: "Deliver", b: "Coordinate implementation, acceptance, handover and third-party dependencies." },
          { t: "Operate", b: "Run monitoring, support, change and improvement against the agreed model." },
        ]} />
      </Section>
      <Section n="03" tag="Proof before promise" title="Clarity must survive the handoff.">
        <Grid cols={4}>
          {[["Scope evidence", "The requirement, exclusions and dependencies remain visible before commitment."], ["Acceptance evidence", "Go-live follows agreed checks and an accountable acceptance owner."], ["Change ownership", "Operational changes follow an approved path with context and rollback."], ["Support boundary", "Contacts, escalation and response expectations are defined — not implied."]].map(([t, b], i) => (
            <Card key={t}><span className="font-mono text-[12px] text-red">0{i + 1}</span><span className="text-[22px] font-medium">{t}</span><span className="text-[15px] leading-6 text-body">{b}</span></Card>
          ))}
        </Grid>
      </Section>
      <Section n="04" tone="dark" tag="AI with authority boundaries" title={<>Assist the team.<br /><span className="text-mute">Never fabricate the commitment.</span></>} sub="AI can reduce retrieval and triage effort, but public promises, access, price, SLA and service activation remain with accountable people." />
      <EndCTA title="Tell DOL what must work better." primary={{ label: "Discuss a requirement", href: `tel:${CONTACT.salesTel}` }} secondary={{ label: "Learning? See Academy", href: "/academy" }} />
    </Shell>
  );
}
