import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import { Suspense } from "react";
import Shell from "@/components/Shell";
import KnowledgeBase from "@/components/KnowledgeBase";
import { PageHero, Section, EndCTA } from "@/components/kit";
import { CONTACT, KB } from "@/lib/content";

export const metadata: Metadata = seo("/support/knowledge-base");

export default function KbPage() {
  return (
    <Shell>
      <PageHero code="KB" eyebrow="Support / Knowledge Base" title={<>Find answers. <span className="text-red">Solve things faster.</span></>}
        sub="Search practical help for DOL internet, billing, hosting, servers, data center services and account security."
        img="/img/pg-kb.webp" imgAlt="Isometric shelf of manuals with an open binder" />
      <Section n="01" tone="white" tag={`${KB.length} articles`} title="Browse by need.">
        <Suspense><KnowledgeBase /></Suspense>
      </Section>
      <EndCTA title="Didn't find it?" primary={{ label: "Guided support", href: "/support#guide" }} secondary={{ label: `Call ${CONTACT.office}`, href: `tel:${CONTACT.officeTel}` }} />
    </Shell>
  );
}
