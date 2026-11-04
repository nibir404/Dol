import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import { PageHero, Section, Grid, Card, InterestForm } from "@/components/kit";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { COURSES } from "@/lib/content";

export const metadata: Metadata = seo("/academy");

export default function AcademyPage() {
  return (
    <Shell>
      <PageHero code="AC" eyebrow="DOL Academy · Practical technology learning" title={<>Learn the system. <span className="text-red">Not only the steps.</span></>}
        sub="Two focused programmes built around the knowledge that makes networks and Linux systems understandable, operable and useful."
        img="/img/pg-academy.webp" imgAlt="Isometric training bench with router, ONU and laptop terminal"
        actions={<><PrimaryButton href="#interest">Book your interest</PrimaryButton><SecondaryButton href="#courses">See the courses</SecondaryButton></>} />
      <Section id="courses" n="01" tone="white" tag="Two flagship courses" title={<>Choose the foundation<br />you want to strengthen.</>} sub="Outlines, duration, fees, delivery format, instructors and next-batch dates will be added after DOL Academy confirms them.">
        <Grid cols={2}>
          {COURSES.map((c) => (
            <Card key={c.id} className="gap-6 md:p-12">
              <span className="label text-red">{c.tag}</span>
              <span className="text-[28px] font-medium leading-tight tracking-[-0.02em] md:text-[32px]">{c.t}</span>
              <span className="text-[16px] leading-7 text-body">{c.b}</span>
              <ul className="grid grid-cols-1 gap-2.5 border-t border-line pt-5 text-[15px] sm:grid-cols-2">{c.topics.map((x) => <li key={x} className="flex gap-2.5"><span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-red" />{x}</li>)}</ul>
              <div className="grid grid-cols-3 gap-px bg-line text-[13px]">
                {[["Outline", "After review"], ["Schedule", "To be announced"], ["Delivery", "Pending"]].map(([k, v]) => <div key={k} className="flex flex-col gap-1 bg-paper px-4 py-3"><span className="label text-mute">{k}</span><span>{v}</span></div>)}
              </div>
              <span className="text-[14px] text-body"><b className="font-medium text-ink">Who it&apos;s for · </b>{c.who}</span>
            </Card>
          ))}
        </Grid>
      </Section>
      <Section id="interest" n="02" tone="dark" tag="Next step" title={<>Reserve interest —<br /><span className="text-mute">or talk to the course team.</span></>} sub="No payment or confirmed seat is created at this stage.">
        <div className="px-5 py-12 md:px-10 lg:px-14">
          <InterestForm subject="DOL Academy course interest"
            fields={[
              { name: "course", label: "Course", required: true, options: COURSES.map((c) => c.t), wide: true },
              { name: "name", label: "Your name", required: true },
              { name: "phone", label: "Mobile number", type: "tel", required: true },
              { name: "email", label: "Email", type: "email" },
              { name: "bg", label: "Your current background", options: ["Student", "Support engineer", "Network / system admin", "Developer", "Other"] },
            ]}
            choices={{ label: "I'd like to", options: ["Book interest for the next batch", "Talk to the course team"] }}
            consent="I agree that DOL Academy may contact me about this course interest." submit="Prepare academy request" note="Prepares a summary you send by email." />
        </div>
      </Section>
    </Shell>
  );
}
