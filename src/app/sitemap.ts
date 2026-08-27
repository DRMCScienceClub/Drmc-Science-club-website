import type { MetadataRoute } from "next";
import { activities, festivals, magazines, siteConfig } from "@/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: new Date("2026-08-27"), changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/about`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/activities`, lastModified: new Date("2026-08-27"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/festivals`, lastModified: new Date("2026-08-27"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/magazines`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/executives`, lastModified: new Date("2026-08-27"), changeFrequency: "yearly", priority: 0.7 },
    { url: `${siteConfig.url}/contact`, lastModified: new Date("2026-08-27"), changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteConfig.url}/join`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.8 },
  ];

  const activityPages: MetadataRoute.Sitemap = activities.map((activity) => ({
    url: `${siteConfig.url}/activities/${activity.slug}`,
    lastModified: new Date(activity.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const festivalPages: MetadataRoute.Sitemap = festivals.map((festival) => ({
    url: `${siteConfig.url}/festivals/${festival.slug}`,
    lastModified: new Date(festival.endDate),
    changeFrequency: festival.status === "completed" ? "yearly" : "weekly",
    priority: festival.status === "completed" ? 0.7 : 0.9,
  }));

  const magazinePages: MetadataRoute.Sitemap = magazines.map((issue) => ({
    url: `${siteConfig.url}/magazines/${issue.year}`,
    lastModified: new Date(issue.publishedAt),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticPages, ...activityPages, ...festivalPages, ...magazinePages];
}
