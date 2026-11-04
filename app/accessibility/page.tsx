import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import { PageHero, Section, DocLayout, ContactCards } from "@/components/kit";
import { LEGAL } from "@/lib/content";

const doc = LEGAL.accessibility;
export const metadata: Metadata = seo("/accessibility");

export default function Page() {
  return (
    <Shell>
      <PageHero code="LG" eyebrow={doc.eyebrow} title={doc.title} sub="Use the section index to find the topic you need." img="/img/pg-legal.webp" imgAlt="Isometric policy documents with a shield" />
      <Section n="01" tone="white"><DocLayout sections={doc.sections} /></Section>
      <Section n="02" tag="Need help?" title="Contact DOL."><ContactCards /></Section>
    </Shell>
  );
}
