import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import TiltImage from "@/components/TiltImage";
import { PageHero, Section, Grid, PlanCard, EndCTA } from "@/components/kit";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { COLO_INCLUDES, COLO_PLANS, CONTACT, DC_SITES } from "@/lib/content";

export const metadata: Metadata = seo("/data-center");

export default function DataCenterPage() {
  return (
    <Shell>
      <PageHero code="DC" tone="dark" eyebrow="Colocation · Data Center" title={<>Colocation in Dhaka, <span className="text-red">from 1U to a full rack.</span></>}
        sub="Secure rack space for your servers, with connectivity included and monitoring around the clock."
        img="/img/dc-wireframe.webp" imgAlt="Wireframe of the two DOL data center sites"
        actions={<><PrimaryButton href="#plans">See rack plans</PrimaryButton><SecondaryButton tone="dark" href="/data-center/ai-infrastructure">AI infrastructure</SecondaryButton></>} />
      <Section n="01" tone="white" tag="Where your server can go" title="Two data centers in Dhaka." sub="New colocation goes to Ashulia while Dhanmondi is fully booked.">
        <Grid cols={2}>
          {DC_SITES.map((s) => (
            <div key={s.name} className="group flex flex-col bg-white">
              <div className="relative aspect-[16/9] border-b border-line"><TiltImage src={s.open ? "/img/ai-hall.webp" : "/img/illo-datacenter.webp"} alt="" sizes="(min-width:768px) 50vw, 100vw" dark={s.open} /></div>
              <div className="flex flex-col gap-4 p-8 md:p-10">
                <span className={`label flex items-center gap-2 ${s.open ? "text-green" : "text-mute"}`}><i className={`h-2 w-2 rounded-full ${s.open ? "bg-green" : "bg-[#8A8780]"}`} />{s.status}</span>
                <span className="text-[32px] font-medium tracking-[-0.02em]">{s.name} Data Center</span>
                <span className="text-[15px] text-body">{s.where}</span>
                <ul className="flex flex-col gap-2.5 border-t border-line pt-5 text-[15px]">{s.points.map((x) => <li key={x} className="flex gap-2.5"><span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-red" />{x}</li>)}</ul>
              </div>
            </div>
          ))}
        </Grid>
      </Section>
      <Section id="plans" n="02" tag="Pricing plans" title="Choose your rack space." sub="Monthly prices. Connectivity is included in every plan — and 65% off your first month.">
        <Grid cols={4}>
          {COLO_PLANS.map((p) => (
            <PlanCard key={p.name} name={p.name} fit={p.fit} price={`Tk ${p.price.toLocaleString("en-US")}`} unit="/ month" popular={p.popular} features={[p.ip, "1 Gbps BDIX port", p.global, "One power feed"]} cta="Reserve space" />
          ))}
        </Grid>
        <div className="flex flex-wrap gap-2 border-t border-line bg-white px-5 py-6 md:px-10 lg:px-14">
          <span className="label mr-2 self-center text-mute">Every plan includes</span>
          {COLO_INCLUDES.map((x) => <span key={x} className="rounded-full border border-[#CFCCC4] px-3.5 py-1.5 text-[14px]">{x}</span>)}
        </div>
      </Section>
      <Section n="03" tone="dark" tag="Need more?" title={<>Add to any plan.<br /><span className="text-mute">Sales quotes it for your setup.</span></>}>
        <Grid cols={3} tone="dark">
          {[["More global bandwidth", "Add international bandwidth by the Mbps."], ["More BDIX capacity", "Add a second 1 Gbps port or move to 10 Gbps."], ["Extra power", "No limit in your first year; after that, add power by the kW."]].map(([t, b]) => (
            <div key={t} className="flex flex-col gap-3 bg-panel p-8"><span className="text-[22px] font-medium">{t}</span><span className="text-[15px] text-soft">{b}</span></div>
          ))}
        </Grid>
      </Section>
      <EndCTA title={<>Your servers,<br /><span className="text-mute">inside Bangladesh.</span></>} primary={{ label: "Talk to Sales", href: `tel:${CONTACT.salesTel}` }} secondary={{ label: "Book a site visit", href: CONTACT.whatsapp }} />
    </Shell>
  );
}
