import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import { PageHero, Section, Steps, EndCTA, ContactCards } from "@/components/kit";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = seo("/status");

export default function StatusPage() {
  return (
    <Shell>
      <PageHero code="ST" tone="dark" eyebrow="Service status" title={<>Check, then report <span className="text-red">a service problem.</span></>}
        sub="No live status feed is connected yet, so this page can't show whether the network is working in your area right now."
        img="/img/pg-status.webp" imgAlt="Isometric network operations console"
        actions={<><PrimaryButton href={`mailto:${CONTACT.noc}`}>Email the NOC</PrimaryButton><SecondaryButton tone="dark" href={`tel:${CONTACT.officeTel}`}>Call {CONTACT.office}</SecondaryButton></>} />
      <Section n="01" tone="white" tag="Live status" title="Feed not connected yet." sub="When a live status service is approved, outages and planned maintenance will be shown here.">
        <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-3">
          {["Home internet", "Corporate links", "Hosting & data center"].map((s) => (
            <div key={s} className="flex items-center justify-between bg-white px-7 py-7">
              <span className="text-[18px] font-medium">{s}</span>
              <span className="label flex items-center gap-2 text-mute"><i className="h-2 w-2 rounded-full border border-[#8A8780]" />No feed</span>
            </div>
          ))}
        </div>
      </Section>
      <Section n="02" tag="Before you report" title="Three quick checks.">
        <Steps steps={[{ t: "Restart", b: "Restart your router and check its lights and cables." }, { t: "Compare", b: "Check whether other devices on the same connection are affected." }, { t: "Look it up", b: "See the Knowledge Base for step-by-step checks." }]} />
      </Section>
      <Section n="03" tone="dark" tag="Report a service problem" title={<>Include the details<br /><span className="text-mute">that save time.</span></>} sub="Your customer ID if you have one, your area, when the problem started and what you've already tried. Don't send passwords or OTPs.">
        <ContactCards tone="dark" noc />
      </Section>
      <EndCTA title="Not resolved?" sub="You can raise a complaint and ask for a reference." primary={{ label: "Complaints & appeals", href: "/complaints" }} secondary={{ label: "Knowledge Base", href: "/support/knowledge-base" }} />
    </Shell>
  );
}
