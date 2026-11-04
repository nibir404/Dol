import type { Metadata } from "next";
import { CONTACT } from "./content";

export const SITE = "https://daffodilnet.com";
export const BRAND = "Daffodil Online (DOL)";

/** One place for every page's search title + description. Titles ≤ 60 chars, descriptions ≤ 155. */
const PAGES: Record<string, { t: string; d: string }> = {
  "/": { t: "Daffodil Online — Fibre Internet, Hosting & Data Center in Bangladesh", d: "Bangladesh ISP since 2002: home and corporate fibre internet from ৳500/month, BDIX web hosting, VPS and Tier III colocation in Dhaka." },
  "/internet": { t: "Home Internet Packages in Dhaka from ৳500/month", d: "Six home broadband packages, 15–60 Mbps, from ৳500 a month. Fibre installed and tested by DOL engineers. Check coverage at your address." },
  "/internet/corporate": { t: "Corporate Internet & Dedicated Bandwidth in Bangladesh", d: "Dedicated business internet with backup paths, public IPs and 24/7 NOC support. Priced for your site by DOL engineers." },
  "/coverage": { t: "Internet Coverage Map — 28 POPs in 15 Districts", d: "See where Daffodil Online fibre reaches: 28 network points in 15 districts and all of core Dhaka. Check your area in seconds." },
  "/cloud-hosting": { t: "Domains, Web Hosting & VPS on BDIX Servers", d: "Register a .bd or global domain, host your website and run a VPS on BDIX servers in Bangladesh, with local support." },
  "/domain": { t: "Domain Registration in Bangladesh — .com.bd, .com & more", d: "Search and register .com.bd, .bd, .com and other domains. Clear yearly prices, free DNS and easy transfers with DOL." },
  "/web-hosting": { t: "BDIX Web Hosting in Bangladesh from ৳2,299/year", d: "Fast BDIX web hosting with NVMe storage, free SSL and daily backups. Plans from ৳2,299 a year, supported locally." },
  "/vps": { t: "BDIX VPS Server in Bangladesh from ৳1,500/month", d: "Linux or Windows VPS with dedicated vCPU, NVMe and a 1 Gbps BDIX port. Full root access, from ৳1,500 a month." },
  "/data-center": { t: "Colocation in Dhaka — 1U to Full Rack, Tier III", d: "Tier III colocation in Bangladesh from 1U to a full cabinet, with redundant power, cooling, BDIX connectivity and 24/7 monitoring." },
  "/data-center/ai-infrastructure": { t: "AI Infrastructure & GPU Servers in Bangladesh", d: "Order GPU systems hosted in a Tier III data center in Bangladesh for AI training and inference, on BDIX with local engineers." },
  "/solutions": { t: "Network & Hosting Solutions for Businesses", d: "One accountable design for multi-site networks, hosting and colocation. DOL engineers discover, design, deliver and operate." },
  "/support": { t: "Support Center — Help with Internet, Billing & Hosting", d: "Get help fast: guided checks for slow internet, billing and hosting, plus 24/7 phone and WhatsApp support from DOL." },
  "/support/knowledge-base": { t: "Knowledge Base — Internet, Billing & Hosting Guides", d: "Short, practical guides for DOL internet, Wi-Fi, billing, hosting, VPS, colocation and account security." },
  "/my-dol": { t: "My DOL — Manage Your Internet, Hosting & Billing", d: "Sign in to manage your DOL internet, hosting and billing accounts." },
  "/status": { t: "Service Status — Network & Hosting Uptime", d: "Live status of the Daffodil Online network, hosting and data center. Check here before reporting a problem." },
  "/complaints": { t: "Complaints & Appeals", d: "Tell Daffodil Online when something is not right. How we log, investigate and answer complaints, and how to appeal." },
  "/about": { t: "About Daffodil Online — Connecting Bangladesh Since 2002", d: "Daffodil Online is a Bangladesh ISP founded in 2002, serving homes and businesses with internet, hosting and data centers." },
  "/academy": { t: "DOL Academy — ISP Engineering & Linux Courses", d: "Practical technology courses from working engineers: ISP network engineering and Linux foundations in Dhaka." },
  "/career": { t: "Careers at Daffodil Online", d: "Join DOL's engineers, support and sales teams building internet and data center services across Bangladesh." },
  "/privacy": { t: "Privacy Policy", d: "How Daffodil Online collects, uses and protects your personal information." },
  "/terms": { t: "Terms of Service", d: "The terms that apply when you use Daffodil Online internet, hosting and data center services." },
  "/accessibility": { t: "Accessibility Statement", d: "How Daffodil Online makes its website usable for everyone, and how to report an accessibility issue." },
};

export const ROUTES = Object.keys(PAGES);

export function seo(path: string): Metadata {
  const p = PAGES[path];
  return {
    title: path === "/" ? { absolute: p.t } : p.t,
    description: p.d,
    alternates: { canonical: path },
    openGraph: { title: p.t, description: p.d, url: path, siteName: BRAND, locale: "en_BD", type: "website" },
    twitter: { card: "summary_large_image", title: p.t, description: p.d },
  };
}

/** Organisation + local business graph, rendered once in the root layout. */
export const ORG_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": `${SITE}/#org`,
      name: "Daffodil Online Ltd.",
      alternateName: "DOL",
      url: SITE,
      logo: `${SITE}/img/logo-dark.png`,
      foundingDate: "2002",
      email: CONTACT.info,
      telephone: CONTACT.salesTel,
      address: { "@type": "PostalAddress", streetAddress: CONTACT.address, addressLocality: "Dhaka", addressCountry: "BD" },
      areaServed: { "@type": "Country", name: "Bangladesh" },
      contactPoint: [
        { "@type": "ContactPoint", contactType: "sales", telephone: CONTACT.salesTel, areaServed: "BD", availableLanguage: ["en", "bn"] },
        { "@type": "ContactPoint", contactType: "technical support", email: CONTACT.noc, areaServed: "BD", availableLanguage: ["en", "bn"] },
      ],
      makesOffer: ["Home internet", "Corporate internet", "Web hosting", "VPS", "Domain registration", "Colocation", "GPU servers"].map((n) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n } })),
    },
    { "@type": "WebSite", "@id": `${SITE}/#web`, url: SITE, name: BRAND, publisher: { "@id": `${SITE}/#org` }, inLanguage: "en-BD" },
  ],
};
