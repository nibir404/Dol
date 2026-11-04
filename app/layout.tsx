import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/jetbrains-mono";
import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import "./globals.css";
import { ORG_LD, SITE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Daffodil Online — Fibre Internet, Hosting & Data Center in Bangladesh", template: "%s | Daffodil Online" },
  description: "Bangladesh ISP since 2002: home and corporate fibre internet, BDIX hosting, VPS and Tier III colocation.",
  applicationName: "Daffodil Online",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0B" },
    { media: "(prefers-color-scheme: light)", color: "#F4F3EF" },
  ],
};

// Runs before first paint: stored choice, else system preference. Prevents a theme flash.
const themeScript = `(()=>{try{var t=localStorage.getItem("dol-theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme="dark"}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-BD" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD) }} />
      </head>
      <body suppressHydrationWarning>
        <Loader />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
