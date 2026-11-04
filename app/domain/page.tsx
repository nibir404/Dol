import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import DomainSearch from "@/components/DomainSearch";
import { PageHero, Section, Grid, Card, Steps, Faq, EndCTA } from "@/components/kit";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = seo("/domain");

export default function DomainPage() {
  return (
    <Shell>
      <PageHero code="DM" eyebrow="Domain registration" title={<>Find the name your <span className="text-red">online presence</span> can grow with.</>}
        sub="Search a name, compare endings and see how registration and transfer work. Online ordering opens soon."
        img="/img/pg-domain.webp" imgAlt="Isometric globe and browser window" />
      <Section n="01" tone="white" tag="Domain search" title="Search for your domain." sub="Type the name you want — no www needed. Nothing you type is sent or reserved.">
        <DomainSearch />
      </Section>
      <Section n="02" tag="How it works" title="From search to your own domain.">
        <Steps steps={[
          { t: "Search", b: "Find your name and the ending that fits." }, { t: "Review", b: "See the price, renewal included." },
          { t: "Your details", b: "Add the owner details for your domain." }, { t: "Pay", b: "Pay securely in BDT." },
          { t: "Go live", b: "Registered in your name." }, { t: "Manage", b: "Renew, change DNS or transfer in My DOL." },
        ]} />
      </Section>
      <Section n="03" tone="dark" tag="Why DOL" title={<>Local help from<br /><span className="text-mute">search to renewal.</span></>}>
        <Grid cols={3} tone="dark">
          {[["Bangladesh endings", ".com.bd and .bd alongside .com, .net and .org."], ["One account", "Domains, hosting and VPS together in My DOL."], ["People you can reach", `Call DOL Sales ${CONTACT.hours}.`]].map(([t, b]) => (
            <Card key={t} tone="dark"><span className="text-[22px] font-medium">{t}</span><span className="text-[15px] leading-6 text-soft">{b}</span></Card>
          ))}
        </Grid>
      </Section>
      <Section n="04" tag="Questions" title="Before you choose a name.">
        <Faq items={[
          ["Are renewal and registration prices different?", "They can be. Both are shown before you pay."],
          ["Who owns the domain?", "You do. It is registered in your name, with full control panel access."],
          ["Can I transfer a domain to DOL?", "Yes. Choose Transfer and keep the transfer code (EPP) from your current provider ready."],
          ["When can I order online?", "Online ordering opens soon. Until then, call DOL Sales to register a domain."],
        ]} />
      </Section>
      <EndCTA title="Register by phone today." primary={{ label: "Call Sales", href: `tel:${CONTACT.salesTel}` }} secondary={{ label: "WhatsApp", href: CONTACT.whatsapp }} />
    </Shell>
  );
}
