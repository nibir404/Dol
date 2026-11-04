import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import { PageHero, Section, Grid, Card, ContactCards } from "@/components/kit";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = seo("/my-dol");

export default function MyDolPage() {
  return (
    <Shell>
      <PageHero code="MY" eyebrow="Account access" title={<>Choose the DOL service <span className="text-red">you want to manage.</span></>}
        sub="Internet billing and digital services use different systems. Choose your account type — when a portal link isn't approved yet, DOL Support is the right path."
        img="/img/pg-mydol.webp" imgAlt="Two isometric account dashboards with a key" />
      <Section n="01" tone="white" tag="Select your account type" title="Two accounts, one DOL.">
        <Grid cols={2}>
          {[
            { t: "Internet & ISP billing", b: "For internet subscriber accounts, invoices, payments, package details and connection support.", li: ["Internet account and billing", "Invoice or payment follow-up", "Package and connection support"], mail: CONTACT.info },
            { t: "Domain, hosting & VPS", b: "For digital-service accounts, domains, hosting, VPS, renewals and service requests.", li: ["Domain and DNS management", "Hosting and VPS services", "Renewals and digital-service support"], mail: CONTACT.info },
          ].map((a, i) => (
            <Card key={a.t} className="gap-5 md:p-12">
              <span className="font-mono text-[12px] text-red">0{i + 1}</span>
              <span className="text-[30px] font-medium tracking-[-0.02em]">{a.t}</span>
              <span className="text-[16px] leading-7 text-body">{a.b}</span>
              <ul className="flex flex-col gap-2.5 border-t border-line pt-5 text-[15px]">{a.li.map((x) => <li key={x} className="flex gap-2.5"><span aria-hidden className="mt-[7px] h-1.5 w-1.5 bg-red" />{x}</li>)}</ul>
              <div className="flex flex-wrap gap-3 pt-3">
                <PrimaryButton size="sm" href={`mailto:${a.mail}?subject=${encodeURIComponent(`My DOL — ${a.t}`)}`}>Request access</PrimaryButton>
                <SecondaryButton size="sm" href={`tel:${CONTACT.officeTel}`}>Call support</SecondaryButton>
              </div>
            </Card>
          ))}
        </Grid>
      </Section>
      <Section n="02" tag="Prefer to talk?" title="Reach the account team.">
        <ContactCards />
      </Section>
    </Shell>
  );
}
