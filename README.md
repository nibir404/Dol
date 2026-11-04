# Daffodil Online — Website

Marketing site for **Daffodil Online (DOL)**, a Bangladesh ISP since 2002: home and corporate fibre internet, BDIX web hosting and VPS, domains, Tier III colocation and GPU infrastructure.

Built with **Next.js 14 (App Router)**, **React 18**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **GSAP**, **Lenis** and **three.js**. Light and dark themes, WCAG AA contrast, and SEO/AEO metadata are built in.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build && npm start   # production build
```

Requires Node.js 18.17 or newer.

## Project structure

```
app/                 Routes (App Router). One folder per page, plus sitemap.ts and robots.ts
  layout.tsx         Root layout: fonts, theme bootstrap (no flash), loader, smooth scroll, JSON-LD
  globals.css        Design tokens, light/dark theme overrides, component and animation styles
components/          UI and sections
  Nav.tsx            Navbar with segmented menu and mega menu; mobile full-screen menu
  Hero.tsx           Home hero with the 3D Bangladesh network map (HeroMap.tsx, three.js)
  IsoDiagram.tsx     Code-drawn isometric diagrams (solid at rest, glass + red core on hover)
  TiltImage.tsx      Wrapper that maps an illustration name to its IsoDiagram scene
  InfraTour.tsx      Scroll-driven walkthrough of the Hi-Tech Park campus
  GpuGrid.tsx        "Capacity comes online" GPU card wall
  StackCore.tsx      Exploded network-stack visual in the closing CTA
  Button.tsx         Primary / secondary / text-link buttons (40px, 6px radius)
  kit.tsx            Shared page building blocks (hero, sections, cards, plans, FAQ, docs)
  Loader.tsx         Page-load loader
  ThemeToggle.tsx    Light/dark switch (stored in localStorage, broadcasts `dol:theme`)
lib/
  content.ts         Single source of truth for copy, prices, contacts, POPs, team, nav
  seo.ts             Page titles/descriptions, canonical URLs, Organization JSON-LD
public/
  bd.json            Bangladesh outline (topojson) for the hero map
  img/               Logos, client logos, team photos, illustrations
```

## Editing content

- **Copy, prices, packages, contacts, navigation:** `lib/content.ts`
- **Page titles and descriptions for search:** `lib/seo.ts` (`PAGES`). Set the live domain in `SITE`.
- **FAQs** render `FAQPage` structured data automatically through the `Faq` component.

## Theming

`<html data-theme="light|dark">` is set before first paint from the saved choice or the system setting. Colours come from CSS variables in `app/globals.css` (`--theme-bg`, `--theme-fg`, `--iso-*`, `--nav-*`). Brand colours are DOL red `#E31E24`, black and white.

## Accessibility

- Text meets WCAG 2.2 AA contrast in both themes
- Visible keyboard focus, skip link, semantic landmarks, `aria` on interactive widgets
- All motion respects `prefers-reduced-motion`

## SEO and AEO

- Per-page `title`, `description`, canonical, Open Graph and Twitter tags (`lib/seo.ts`)
- `Organization` + `LocalBusiness` + `WebSite` JSON-LD in the root layout
- `FAQPage` JSON-LD on every FAQ block
- `/sitemap.xml` and `/robots.txt` generated from `app/sitemap.ts` and `app/robots.ts`

## Notes

- Forms open a pre-filled email or WhatsApp message; no data is sent to a server.
- Images are served unoptimised (`images.unoptimized`) as pre-sized WebP files.
