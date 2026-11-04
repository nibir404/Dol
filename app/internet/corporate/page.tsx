import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import Shell from "@/components/Shell";
import { PageHero, Section, Grid, Card, Steps, InterestForm, EndCTA } from "@/components/kit";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = seo("/internet/corporate");

const LOGOS = ["amin-mohammad", "al-noor", "sheltech", "kib", "dms", "union", "nandini", "karupannya", "diu", "dis", "dic", "diit", "dipti", "newtec", "scube", "skilljobs"];

export default function CorporatePage() {
  return (
    <Shell>
      <PageHero
        code="CI" tone="dark"
        eyebrow="Corporate internet"
        title={<>Connectivity that keeps <span className="text-red">business moving.</span></>}
        sub="Dedicated bandwidth, backup paths, public IP and 24/7 support. Every proposal is priced for your site and requirement."
        img="/img/ai-colo.webp" imgAlt="Wireframe network cabinet"
        actions={<><PrimaryButton href="#requirement">Share your requirement</PrimaryButton><SecondaryButton tone="dark" href={`tel:${CONTACT.salesTel}`}>Call Sales</SecondaryButton></>}
      />
      <Section n="01" tag="What you get" title={<>Designed around the<br />risk of downtime.</>} sub="Corporate connectivity is planned around how your business runs, not sold as a home package.">
        <Grid cols={4}>
          {[
            ["Dedicated bandwidth", "Committed capacity sized to your users, applications and growth, confirmed in your proposal."],
            ["Primary + backup path", "A second route over different access or upstream options where the site allows it."],
            ["Public IP", "Public IPs for servers, VPN and remote access, allocated to your requirement."],
            ["24/7 support access", "A round-the-clock incident contact; targets belong in the approved SLA."],
          ].map(([t, b], i) => (
            <Card key={t}><span className="font-mono text-[12px] text-red">0{i + 1}</span><span className="text-[22px] font-medium tracking-[-0.015em]">{t}</span><span className="text-[15px] leading-6 text-body">{b}</span></Card>
          ))}
        </Grid>
      </Section>
      <Section n="02" tag="Trusted by" title={<>Businesses, hospitals and<br />institutions already run on DOL.</>}>
        <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4 lg:grid-cols-8">
          {LOGOS.map((l) => (
            <div key={l} className="flex h-[96px] items-center justify-center bg-white px-5 transition-colors duration-300 hover:bg-paper">
              <Image src={`/img/clients/${l}.webp`} alt={l.replace(/-/g, " ")} width={160} height={60} className="max-h-[48px] w-auto object-contain grayscale transition duration-300 hover:grayscale-0" />
            </div>
          ))}
        </div>
      </Section>
      <Section n="03" tone="dark" tag="Office networking" title={<>From service handoff to a<br /><span className="text-mute">working business network.</span></>} sub="If you want it, DOL also surveys the office, recommends the router, firewall, switches and Wi-Fi, links everything up and hands over monitoring and escalation.">
        <Steps tone="dark" steps={[
          { t: "Site visit", b: "Installation-readiness assessment." },
          { t: "Equipment guidance", b: "Router, firewall, switch and Wi-Fi." },
          { t: "Link-up", b: "Structured cabling and acceptance checks." },
          { t: "Handover", b: "Contacts, monitoring and escalation." },
        ]} />
      </Section>
      <Section id="requirement" n="04" tone="dark" tag="Your requirement" title="Tell DOL what your operation needs." sub={`A few choices are enough to start. DOL Sales replies with next steps, ${CONTACT.hours}.`}>
        <div className="px-5 py-12 md:px-10 lg:px-14">
          <InterestForm
            subject="Corporate internet requirement"
            fields={[
              { name: "org", label: "Organisation", required: true },
              { name: "name", label: "Contact person", required: true },
              { name: "phone", label: "Phone", type: "tel", required: true },
              { name: "email", label: "Email", type: "email" },
              { name: "location", label: "Site location", required: true, wide: true, placeholder: "Area, building, floor" },
              { name: "bw", label: "Bandwidth needed", options: ["Under 50 Mbps", "50–100 Mbps", "100–500 Mbps", "500 Mbps+", "Not sure"] },
              { name: "ip", label: "Public IPs", options: ["None", "1", "/29 block", "Larger block", "Not sure"] },
            ]}
            choices={{ label: "Also interested in", options: ["Backup link", "Office networking", "Colocation", "Hosting / VPS"] }}
            consent="I agree that DOL Sales may contact me about this requirement."
            submit="Prepare requirement"
            note="This prepares a summary you can send by email."
          />
        </div>
      </Section>
      <EndCTA title={<>A written proposal,<br />priced for your site.</>} primary={{ label: "Call Sales", href: `tel:${CONTACT.salesTel}` }} secondary={{ label: "WhatsApp", href: CONTACT.whatsapp }} />
    </Shell>
  );
}
