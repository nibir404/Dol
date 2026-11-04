import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import VpsSizer from "@/components/VpsSizer";
import { PageHero, Section, Grid, Card, Faq, EndCTA } from "@/components/kit";
import { PrimaryButton } from "@/components/Button";
import { CONTACT, VPS_INCLUDES } from "@/lib/content";

export const metadata: Metadata = seo("/vps");

export default function VpsPage() {
  return (
    <Shell>
      <PageHero code="VP" tone="dark" eyebrow="VPS" title={<>A server of your own, <span className="text-red">on BDIX.</span></>}
        sub="Your own vCPU, RAM and NVMe storage on BDIX servers in Bangladesh, with a 1 Gbps port. Six monthly plans, from testing to heavy workloads."
        img="/img/ai-server.webp" imgAlt="Wireframe server chassis"
        actions={<PrimaryButton href="#size">Size my server</PrimaryButton>}
        stats={[{ k: "BDIX port", v: "1 Gbps" }, { k: "RAM", v: "Up to 32 GB" }, { k: "Billing", v: "Monthly" }, { k: "Access", v: "Full root" }]} />
      <Section id="size" n="01" tone="white" tag="Pricing plans" title="Choose your server." sub="Drag to the resources your project needs, or pick a plan directly.">
        <VpsSizer />
        <div className="flex flex-wrap gap-2 border-t border-line bg-paper px-5 py-6 md:px-10 lg:px-14">
          <span className="label mr-2 self-center text-mute">Every plan includes</span>
          {VPS_INCLUDES.map((x) => <span key={x} className="rounded-full border border-[#CFCCC4] bg-white px-3.5 py-1.5 text-[14px]">{x}</span>)}
        </div>
      </Section>
      <Section n="02" tone="dark" tag="Why DOL VPS" title={<>Built for projects<br /><span className="text-mute">that need more.</span></>}>
        <Grid cols={3} tone="dark">
          {[["Resources that are yours", "Your vCPU, RAM and storage are set aside for your server, so other users can't slow it down."], ["Local, low latency", "A 1 Gbps BDIX port keeps traffic inside Bangladesh."], ["Room to grow", `Need more CPU, RAM or storage? Call ${CONTACT.sales} for a custom plan.`]].map(([t, b]) => (
            <Card key={t} tone="dark"><span className="text-[22px] font-medium">{t}</span><span className="text-[15px] leading-6 text-soft">{b}</span></Card>
          ))}
        </Grid>
      </Section>
      <Section n="03" tag="Questions" title="Before you deploy.">
        <Faq items={[["Linux or Windows?", "Either — choose the OS when you order."], ["Do I get root access?", "Yes, full root access on every plan."], ["Can I resize later?", "Yes. Ask Support to move you to a larger plan."], ["Is it billed monthly?", "Yes, every VPS plan is billed monthly."]]} />
      </Section>
      <EndCTA title="Need a custom size?" primary={{ label: "Call Sales", href: `tel:${CONTACT.salesTel}` }} secondary={{ label: "WhatsApp", href: CONTACT.whatsapp }} />
    </Shell>
  );
}
