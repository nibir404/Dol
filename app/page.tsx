import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import Hero from "@/components/Hero";
import { Services, Packages, Online, Solutions, DataCenter, Clients, Customers } from "@/components/Sections";
import { AIToday, AIWhy, AIResearch, AIWays } from "@/components/AISections";
import { CTA } from "@/components/CTAFooter";
import InfraTour from "@/components/InfraTour";
import GpuGrid from "@/components/GpuGrid";

export const metadata: Metadata = seo("/");

export default function Home() {
  return (
    <Shell>
        <Hero />
        <Services />
        <Packages />
        <Online />
        <Solutions />
        <DataCenter />
        <GpuGrid />
        <InfraTour />
        <AIToday />
        <AIWhy />
        <AIResearch />
        <AIWays />
        <Clients />
        <Customers />
        <CTA />
    </Shell>
  );
}
