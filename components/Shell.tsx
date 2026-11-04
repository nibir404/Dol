import Nav from "./Nav";
import ScrollLines from "./ScrollLines";
import TabBar from "./TabBar";
import { Footer } from "./CTAFooter";

/** Shared page chrome: skip link, nav, main landmark, footer. */
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="keep-white sr-only z-[60] rounded-full bg-red px-4 py-2 text-white focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4">Skip to main content</a>
      <ScrollLines />
      <Nav />
      <main id="main" className="relative z-[1]">{children}</main>
      <Footer />
      <TabBar />
    </>
  );
}
