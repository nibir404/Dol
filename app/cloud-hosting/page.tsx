import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import Shell from "@/components/Shell";
import TiltImage from "@/components/TiltImage";
import { PageHero, Section, Grid, Card, Steps, Faq, EndCTA } from "@/components/kit";
import { PrimaryButton, SecondaryButton, TextLink } from "@/components/Button";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = seo("/cloud-hosting");

const SERVICES = [
  { t: "Domain registration", b: "Find your name, register it, or move an existing domain to DOL.", price: "Register or transfer", href: "/domain", img: "/img/pg-domain.webp" },
  { t: "Web hosting", b: "NVMe storage, free SSL and daily backups. Four yearly plans.", price: "From Tk 2,299/year", href: "/web-hosting", img: "/img/illo-hosting.webp" },
  { t: "VPS", b: "Your own server in Bangladesh with NVMe storage and a 1 Gbps BDIX port.", price: "From Tk 1,500/month", href: "/vps", img: "/img/pg-vps.webp" },
];

export default function CloudPage() {
  return (
    <Shell>
      <PageHero code="CH" eyebrow="Cloud & Hosting" title={<>A better foundation for <span className="text-red">what you run online.</span></>}
        sub="Register your domain, host your website and run your own server — all with DOL, on BDIX servers in Bangladesh."
        img="/img/illo-hosting.webp" imgAlt="Isometric server stack"
        actions={<><PrimaryButton href="/web-hosting">Compare hosting</PrimaryButton><SecondaryButton href="/vps">See VPS plans</SecondaryButton></>} />
      <Section n="01" tone="white" tag="Our services" title="Choose what you need." sub="Each service has its own page with full plans and what is included.">
        <Grid cols={3}>
          {SERVICES.map((s) => (
            <Link key={s.t} href={s.href} className="group flex flex-col bg-white">
              <div className="relative aspect-[4/3] border-b border-line bg-paper"><TiltImage src={s.img} alt="" sizes="(min-width:1280px) 33vw, 100vw" /></div>
              <div className="flex flex-1 flex-col gap-3 p-8">
                <span className="label text-red">{s.price}</span>
                <span className="text-[26px] font-medium tracking-[-0.02em]">{s.t}</span>
                <span className="text-[15px] leading-6 text-body">{s.b}</span>
                <span className="mt-auto pt-3"><TextLink>Open {s.t.split(" ")[0]}</TextLink></span>
              </div>
            </Link>
          ))}
        </Grid>
      </Section>
      <Section n="02" tag="Not sure where to start?" title="Getting online, step by step." sub="Most businesses start with a domain and web hosting, then move to a VPS as they grow.">
        <Steps steps={[{ t: "Get your domain", b: "Your address online, registered in your name." }, { t: "Host your website", b: "Fast BDIX hosting with SSL and backups." }, { t: "Grow onto a VPS", b: "Your own server when apps need more." }]} />
      </Section>
      <Section n="03" tone="dark" tag="Why DOL" title={<>Why run it<br /><span className="text-mute">with DOL.</span></>}>
        <Grid cols={3} tone="dark">
          {[["Servers in Bangladesh", "Hosting and VPS run on BDIX, so pages load fast for visitors on Bangladeshi networks."], ["Clear prices", "Every plan and price on the page, in BDT, before you decide."], ["A local team", `Live help and DOL Sales by phone, ${CONTACT.hours}.`]].map(([t, b], i) => (
            <Card key={t} tone="dark"><span className="font-mono text-[12px] text-red">0{i + 1}</span><span className="text-[22px] font-medium">{t}</span><span className="text-[15px] leading-6 text-soft">{b}</span></Card>
          ))}
        </Grid>
      </Section>
      <Section n="04" tag="Questions" title="Before you start.">
        <Faq items={[
          ["Do I need a domain?", "Yes. Your domain is your website's address. Register one with DOL, or use a domain you already own."],
          ["Hosting or VPS?", "Web hosting suits most websites and is managed from a control panel. A VPS gives you your own server for apps and custom software."],
          ["Can I move my site?", "Yes. Site migration is free on every hosting plan, and you can transfer a domain with its transfer code."],
          ["Where are the servers?", "Web hosting and VPS run on BDIX servers in Bangladesh."],
          ["Can DOL build the site?", "DUDOS, our AI website and app builder, creates it with an admin panel, and DOL hosts it."],
        ]} />
      </Section>
      <EndCTA title={<>Start with a name.<br /><span className="text-mute">Grow from there.</span></>} primary={{ label: "Search a domain", href: "/domain" }} secondary={{ label: "Talk to Sales", href: `tel:${CONTACT.salesTel}` }} />
    </Shell>
  );
}
