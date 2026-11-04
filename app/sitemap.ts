import type { MetadataRoute } from "next";
import { ROUTES, SITE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({ url: `${SITE}${r === "/" ? "" : r}`, lastModified: now, changeFrequency: r === "/" || r === "/status" ? "daily" : "monthly", priority: r === "/" ? 1 : r.split("/").length > 2 ? 0.6 : 0.8 }));
}
