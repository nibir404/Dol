import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import { AIHero, AIToday, AIWhy, AIResearch, AIWays } from "@/components/AISections";
import { AIInfraSection, AIReference, AIUses, AILabs, AIRequest, AIKnowledge, AIGovernance, AIPathway } from "@/components/AIBlueprints";
import { AIHow, AISpecs, AIWho, AIEarly, AIFaq, AIEnquiry } from "@/components/AIMore";

export const metadata: Metadata = seo("/data-center/ai-infrastructure");

export default function AIInfrastructure() {
  return (
    <Shell>
      <div className="pt-[72px] md:pt-[116px]">
        <AIHero />
        <AIToday />
        <AIWhy />
        <AIResearch />
        <AIWays />
        <AIInfraSection />
        <AIReference />
        <AIUses />
        <AILabs />
        <AIRequest />
        <AIKnowledge />
        <AIGovernance />
        <AIPathway />
        <AIHow />
        <AISpecs />
        <AIWho />
        <AIEarly />
        <AIFaq />
        <AIEnquiry />
      </div>
    </Shell>
  );
}
