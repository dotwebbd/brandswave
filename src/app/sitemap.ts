import type { MetadataRoute } from "next";
import { getAllModelSlugs } from "@/lib/data/models";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllModelSlugs();

  const modelRoutes = slugs.map((s) => ({
    url: `${siteConfig.url}/models/${s.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: siteConfig.url, lastModified: new Date().toISOString(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/videos`, lastModified: new Date().toISOString(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/models`, lastModified: new Date().toISOString(), changeFrequency: "weekly", priority: 0.9 },
    ...modelRoutes,
    { url: `${siteConfig.url}/services`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/about`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/contact`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
  ];
}