import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import { PageHero, Section, Steps, EndCTA } from "@/components/kit";
import { PrimaryButton } from "@/components/Button";
import CoverageExplorer from "@/components/CoverageExplorer";
import { CONTACT, POP_COUNT, POPS } from "@/lib/content";

export const metadata: Metadata = seo("/coverage");

export default function CoveragePage() {
  return (
    <Shell>
      <PageHero
        code="CV"
        eyebrow="Internet coverage"
        title={<>See where <span className="text-red">DOL connects.</span></>}
        sub="Home and business internet across Bangladesh, with service anywhere in core Dhaka. Search your area or explore the network by district."
        img="/img/pg-coverage.webp" imgAlt="Isometric telecom tower and equipment cabinets"
        actions={<PrimaryButton href="#explore">Explore the network</PrimaryButton>}
        stats={[{ k: "Network points", v: String(POP_COUNT) }, { k: "Districts", v: String(Object.keys(POPS).length) }, { k: "Core Dhaka", v: "Anywhere" }, { k: "Licence", v: "64 districts" }]}
      />
      <Section id="explore" n="01" tone="white" tag="Our network" title={<>DOL across<br />Bangladesh.</>} sub="Search an area or pick a district to see its network points. Our team confirms the connection at your exact address.">
        <CoverageExplorer />
      </Section>
      <Section n="02" tag="How it works" title="From your area to a working connection.">
        <Steps steps={[{ t: "Tell us where", b: "Search your area, or pick it from the list." }, { t: "We check the route", b: "Our team checks the network path and what your building needs." }, { t: "We connect you", b: "We install, test and hand over a working connection." }]} />
      </Section>
      <EndCTA title={<>Not on the list?<br /><span className="text-mute">Ask anyway.</span></>} sub="Grey areas aren't a no — DOL reviews new areas as demand grows." primary={{ label: "WhatsApp your area", href: CONTACT.whatsapp }} secondary={{ label: "Call Sales", href: `tel:${CONTACT.salesTel}` }} />
    </Shell>
  );
}
