import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import { PageHero, Section, Grid, PlanCard, Faq, EndCTA } from "@/components/kit";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { CONTACT, HOSTING_INCLUDES, HOSTING_PLANS } from "@/lib/content";

export const metadata: Metadata = seo("/web-hosting");

export default function HostingPage() {
  return (
    <Shell>
      <PageHero code="WH" eyebrow="Web hosting" title={<>Fast hosting for the <span className="text-red">website you run.</span></>}
        sub="NVMe storage, free SSL and daily backups on BDIX servers in Bangladesh. Four yearly plans, ready when you are."
        img="/img/illo-hosting.webp" imgAlt="Isometric server stack with globe"
        actions={<><PrimaryButton href="#plans">Choose a plan</PrimaryButton><SecondaryButton href={`tel:${CONTACT.salesTel}`}>Ask about migration</SecondaryButton></>}
        stats={[{ k: "Storage", v: "NVMe SSD" }, { k: "SSL", v: "Free" }, { k: "Backups", v: "Daily" }, { k: "Servers", v: "BDIX" }]} />
      <Section id="plans" n="01" tone="white" tag="Pricing plans" title="Choose the right plan." sub="Yearly prices. Every plan comes with the essentials below.">
        <Grid cols={4}>
          {HOSTING_PLANS.map((p) => (
            <PlanCard key={p.name} name={p.name} fit={p.fit} price={`Tk ${p.price.toLocaleString("en-US")}`} unit="/ year" popular={p.popular}
              features={[`${p.storage} NVMe SSD storage`, `${p.bandwidth} bandwidth`, `${p.sites} website${p.sites === "1" ? "" : "s"}`, `${p.email} email accounts`, `${p.ram} RAM · ${p.cpu}`]} cta="Get this plan" />
          ))}
        </Grid>
        <div className="flex flex-wrap gap-2 border-t border-line bg-paper px-5 py-6 md:px-10 lg:px-14">
          <span className="label mr-2 self-center text-mute">Every plan includes</span>
          {HOSTING_INCLUDES.map((x) => <span key={x} className="rounded-full border border-[#CFCCC4] bg-white px-3.5 py-1.5 text-[14px]">{x}</span>)}
        </div>
      </Section>
      <Section n="02" tag="Questions" title="Before you pick a plan.">
        <Faq items={[
          ["Is migration really free?", "Yes. Site migration is free on every hosting plan."],
          ["Can I upgrade later?", "Yes. Move up a plan as your site grows; DOL Sales confirms any price difference."],
          ["Is there a money-back guarantee?", "Yes, every plan has a 30-day money-back guarantee."],
          ["Where are the servers?", "On BDIX servers in Bangladesh, so pages load fast for local visitors."],
        ]} />
      </Section>
      <EndCTA title={<>Move your site.<br /><span className="text-mute">We&apos;ll do the lifting.</span></>} primary={{ label: "Talk to Sales", href: `tel:${CONTACT.salesTel}` }} secondary={{ label: "See VPS", href: "/vps" }} />
    </Shell>
  );
}
