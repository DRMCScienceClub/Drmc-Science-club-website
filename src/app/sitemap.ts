import type { MetadataRoute } from "next";
import { siteConfig } from "@/data";
import { getAchievements, getActivities, getFestivals, getMagazines } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [activities, achievements, festivals, magazines] = await Promise.all([
    getActivities(),
    getAchievements(),
    getFestivals(),
    getMagazines(),
  ]);
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: new Date("2026-08-30"), changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/about`, lastModified: new Date("2026-08-28"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/activities`, lastModified: new Date("2026-08-30"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/achievements`, lastModified: new Date("2026-08-30"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.url}/festivals`, lastModified: new Date("2026-08-30"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/magazines`, lastModified: new Date("2026-08-28"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/executives`, lastModified: new Date("2026-08-30"), changeFrequency: "yearly", priority: 0.7 },
    { url: `${siteConfig.url}/contact`, lastModified: new Date("2026-08-28"), changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteConfig.url}/join`, lastModified: new Date("2026-08-28"), changeFrequency: "monthly", priority: 0.8 },
  ];

  const activityPages: MetadataRoute.Sitemap = activities.map((activity) => ({
    url: `${siteConfig.url}/activities/${activity.slug}`,
    lastModified: new Date(activity.endDate ?? activity.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const festivalPages: MetadataRoute.Sitemap = festivals.map((festival) => ({
    url: `${siteConfig.url}/festivals/${festival.slug}`,
    lastModified: new Date(festival.endDate),
    changeFrequency: festival.status === "completed" ? "yearly" : "weekly",
    priority: festival.status === "completed" ? 0.7 : 0.9,
  }));

  const achievementPages: MetadataRoute.Sitemap = achievements.map((achievement) => ({
    url: `${siteConfig.url}/achievements/${achievement.slug}`,
    lastModified: achievement.updatedAt ? new Date(achievement.updatedAt) : undefined,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const magazinePages: MetadataRoute.Sitemap = magazines.map((issue) => ({
    url: `${siteConfig.url}/magazines/${issue.year}`,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticPages, ...activityPages, ...achievementPages, ...festivalPages, ...magazinePages];
}
