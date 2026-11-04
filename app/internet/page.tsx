import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import { PageHero, Section, Grid, Card, PlanCard, Steps, Faq, EndCTA } from "@/components/kit";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { CONTACT, HOME_PACKAGES } from "@/lib/content";

export const metadata: Metadata = seo("/internet");

export default function InternetPage() {
  return (
    <Shell>
      <PageHero
        code="IN"
        eyebrow="Home Internet · Bangladesh"
        title={<>Home internet that keeps up with <span className="text-red">everyday life.</span></>}
        sub="Six monthly packages from ৳500. Pick a speed, send your area, and DOL Sales confirms installation at your address."
        img="/img/illo-home.webp"
        imgAlt="Isometric home fibre router"
        actions={<><PrimaryButton href="/coverage">Check my area</PrimaryButton><SecondaryButton href="#packages">See packages</SecondaryButton></>}
        stats={[{ k: "Speeds", v: "15–60 Mbps" }, { k: "From", v: "৳500/mo" }, { k: "Homes on DOL", v: "30,000+" }, { k: "Since", v: "2002" }]}
      />
      <Section id="packages" n="01" tag="Packages & prices" title={<>Six speeds.<br />Clear monthly prices.</>} sub="Pick the speed that fits how your home uses the internet. DOL confirms availability at your address before installation.">
        <Grid cols={3}>
          {HOME_PACKAGES.map((p) => (
            <PlanCard key={p.mbps} name={`${p.mbps} Mbps`} fit={p.fit} price={`৳${p.price.toLocaleString("en-US")}`} unit="/ month" popular={p.mbps === 30}
              features={["Unlimited home use", "Installed and tested by DOL engineers", "Support by phone and WhatsApp"]} cta="Choose this speed" />
          ))}
        </Grid>
        <p className="border-t border-line bg-paper px-5 py-5 text-[14px] text-body md:px-10 lg:px-14">Prices are monthly, in BDT. DOL confirms applicable taxes, the installation charge and availability for your address before you order.</p>
      </Section>
      <Section n="02" tone="dark" tag="Why DOL" title={<>Why homes<br /><span className="text-mute">choose DOL.</span></>}>
        <Grid cols={4} tone="dark">
          {[
            ["Clear monthly prices", "Six packages from ৳500 to ৳1,000 a month, shown side by side before you decide."],
            ["Core Dhaka and beyond", "DOL connects homes anywhere in core Dhaka, plus areas served by its listed POPs."],
            ["Confirmed before install", "DOL confirms your exact address, taxes and installation charge before anything is installed."],
            ["People you can reach", `Talk to DOL Sales by phone or WhatsApp, ${CONTACT.hours}.`],
          ].map(([t, b], i) => (
            <Card key={t} tone="dark"><span className="font-mono text-[12px] text-red">0{i + 1}</span><span className="text-[22px] font-medium tracking-[-0.015em]">{t}</span><span className="text-[15px] leading-6 text-soft">{b}</span></Card>
          ))}
        </Grid>
      </Section>
      <Section n="03" tag="How to get connected" title="From choosing a package to getting connected.">
        <Steps steps={[{ t: "Pick a speed", b: "Choose the package that fits your home." }, { t: "Send your area", b: "On WhatsApp or by phone. DOL checks the route." }, { t: "Get connected", b: "Engineers install, test and hand over a working line." }]} />
      </Section>
      <Section n="04" tag="Questions" title="Before you choose.">
        <Faq items={[
          ["Can DOL connect my home?", "Add your area and send it to DOL Sales on WhatsApp, or call. DOL connects homes across core Dhaka and near its listed POPs, and confirms your exact address first."],
          ["Can I choose a package before the check?", "Yes. Pick the speed you want and send it with your area. Choosing a package does not place an order."],
          ["Are taxes and installation included?", "These are DOL's published monthly Home packages. DOL confirms applicable taxes and the installation charge for your address before you order."],
          ["How do I order?", `Send your package and area on WhatsApp, or call DOL Sales at ${CONTACT.sales}, ${CONTACT.hours}.`],
          ["What about my business?", "Corporate Internet is planned around your site, with dedicated bandwidth, backup options and public IP."],
        ]} />
      </Section>
      <EndCTA title={<>Ready when<br />your home is.</>} sub="Send your area and package — DOL Sales confirms the rest." primary={{ label: "Check my area", href: "/coverage" }} secondary={{ label: "WhatsApp Sales", href: CONTACT.whatsapp }} />
    </Shell>
  );
}
