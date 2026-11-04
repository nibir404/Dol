import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import { PageHero, Section, Grid, Card, Steps, InterestForm } from "@/components/kit";
import { PrimaryButton } from "@/components/Button";
import { CAREER_FIELDS } from "@/lib/content";

export const metadata: Metadata = seo("/career");

export default function CareerPage() {
  return (
    <Shell>
      <PageHero code="CR" eyebrow="Careers at Daffodil Online" title={<>Find the work where you can make <span className="text-red">a real connection.</span></>}
        sub="Choose the part of DOL that matches your ability and ambition. Tell us what you want to contribute; the right team reviews your interest when an opportunity opens."
        img="/img/pg-career.webp" imgAlt="Five isometric team workstations on one platform"
        actions={<PrimaryButton href="#interest">Share your interest</PrimaryButton>} />
      <Section n="01" tag="How it works" title="Start with a team. Then shape the role.">
        <Steps steps={[{ t: "Choose a field", b: "Start from the work — not a long vacancy list." }, { t: "Share your interest", b: "Name, contact and a short explanation." }, { t: "Team review", b: "DOL routes it to the relevant owner." }]} />
      </Section>
      <Section n="02" tone="white" tag="Where could you contribute?" title="Five operating teams." sub="These follow DOL's departments. They are career-interest areas, not a claim that every position is currently vacant.">
        <Grid cols={5}>
          {CAREER_FIELDS.map((f, i) => (
            <Card key={f.t}><span className="font-mono text-[12px] text-red">0{i + 1}</span><span className="text-[21px] font-medium leading-7">{f.t}</span><span className="text-[15px] leading-6 text-body">{f.b}</span><a href="#interest" className="mt-auto pt-3 text-[15px] font-medium underline underline-offset-[5px]">Choose this field →</a></Card>
          ))}
        </Grid>
      </Section>
      <Section id="interest" n="03" tone="dark" tag="Expression of interest" title={<>Tell us what<br /><span className="text-mute">you want to build.</span></>} sub="A simple first conversation, not a full application. A CV can be requested later if the team wants to continue.">
        <div className="px-5 py-12 md:px-10 lg:px-14">
          <InterestForm subject="Career interest"
            fields={[
              { name: "field", label: "Preferred field", required: true, options: CAREER_FIELDS.map((f) => f.t) },
              { name: "level", label: "Current level", options: ["Student / fresher", "1–3 years", "3–7 years", "7+ years"] },
              { name: "name", label: "Your name", required: true },
              { name: "phone", label: "Mobile number", type: "tel", required: true },
              { name: "email", label: "Email", type: "email", wide: true },
              { name: "why", label: "What kind of responsibility interests you?", type: "textarea", wide: true, required: true },
            ]}
            consent="I agree that DOL may contact me about this career interest. I won't include passwords, IDs or other sensitive documents." submit="Prepare career interest" note="Prepares a summary you send by email." />
        </div>
      </Section>
    </Shell>
  );
}
