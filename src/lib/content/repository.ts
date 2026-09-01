import "server-only";

import {
  achievements as fallbackAchievements,
  activities as fallbackActivities,
  executivePanels as fallbackExecutivePanels,
  festivals as fallbackFestivals,
  magazines as fallbackMagazines,
} from "@/data";
import type {
  Achievement,
  Activity,
  ContentImage,
  ExecutivePanel,
  Festival,
  MagazineIssue,
  Notice,
} from "@/types/content";

type ContentTable =
  | "festivals"
  | "activities"
  | "achievements"
  | "magazines"
  | "executive_panels"
  | "notifications";

type ContentRow = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: "published";
  is_featured: boolean;
  cover_image_url: string | null;
  data: Record<string, unknown> | null;
  published_at: string;
  updated_at: string;
  [key: string]: unknown;
};

export type PublicAchievement = Achievement & {
  slug: string;
  title: string;
  summary: string;
  publishedAt?: string;
  updatedAt?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isPublicContentDatabaseConfigured = Boolean(
  supabaseUrl && supabaseKey,
);

function imageWithSource(
  image: ContentImage | undefined,
  src: string | null,
  title: string,
): ContentImage | undefined {
  if (!src) return image;
  return {
    src,
    alt: image?.alt ?? title,
    width: image?.width ?? 1600,
    height: image?.height ?? 900,
  };
}

async function queryRows(
  table: ContentTable,
  filters: Record<string, string> = {},
): Promise<ContentRow[]> {
  if (!supabaseUrl || !supabaseKey) return [];

  const search = new URLSearchParams({
    select: "*",
    status: "eq.published",
    published_at: `lte.${new Date().toISOString()}`,
    order: "published_at.desc",
    ...filters,
  });
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${search}`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Accept: "application/json",
    },
    next: { revalidate: 300, tags: [`content:${table}`] },
  });

  if (!response.ok) {
    throw new Error(`Unable to load published ${table} (${response.status}).`);
  }

  return (await response.json()) as ContentRow[];
}

function festivalFromRow(row: ContentRow): Festival {
  const data = (row.data ?? {}) as unknown as Festival;
  return {
    ...data,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    featured: row.is_featured,
    coverImage:
      imageWithSource(data.coverImage, row.cover_image_url, row.title) ??
      data.coverImage,
  };
}

function activityFromRow(row: ContentRow): Activity {
  const data = (row.data ?? {}) as unknown as Activity;
  return {
    ...data,
    slug: row.slug,
    title: row.title,
    excerpt: row.summary,
    featured: row.is_featured,
    image:
      imageWithSource(data.image, row.cover_image_url, row.title) ?? data.image,
  };
}

function achievementFromRow(row: ContentRow): PublicAchievement {
  const data = (row.data ?? {}) as unknown as Achievement;
  return {
    ...data,
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    image:
      imageWithSource(data.image, row.cover_image_url, row.title) ?? data.image,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

function magazineFromRow(row: ContentRow): MagazineIssue {
  const data = (row.data ?? {}) as unknown as MagazineIssue;
  return {
    ...data,
    slug: row.slug,
    title: row.title,
    description: row.summary,
    featured: row.is_featured,
    publishedAt: row.published_at,
    coverImage:
      imageWithSource(data.coverImage, row.cover_image_url, row.title) ??
      data.coverImage,
  };
}

function executivePanelFromRow(row: ContentRow): ExecutivePanel {
  const data = (row.data ?? {}) as unknown as ExecutivePanel;
  return {
    ...data,
    title: row.title,
    summary: row.summary,
    groupImage:
      imageWithSource(data.groupImage, row.cover_image_url, row.title) ??
      data.groupImage,
  };
}

function orderExecutivePanels(panels: ExecutivePanel[]) {
  return panels.toSorted((first, second) => {
    if (first.isCurrent !== second.isCurrent) return first.isCurrent ? -1 : 1;
    const firstOrder = typeof first.displayOrder === "number"
      ? first.displayOrder
      : Number.MAX_SAFE_INTEGER;
    const secondOrder = typeof second.displayOrder === "number"
      ? second.displayOrder
      : Number.MAX_SAFE_INTEGER;
    return firstOrder - secondOrder
      || second.endYear - first.endYear
      || second.startYear - first.startYear;
  });
}

function notificationFromRow(row: ContentRow): Notice {
  const tone = row.tone;
  const linkUrl = typeof row.link_url === "string" ? row.link_url : "";
  const linkLabel =
    typeof row.link_label === "string" && row.link_label.trim()
      ? row.link_label
      : "Learn more";

  return {
    id: row.id,
    title: row.title,
    message: typeof row.message === "string" ? row.message : "",
    startsAt:
      typeof row.starts_at === "string" ? row.starts_at : row.published_at,
    endsAt:
      typeof row.ends_at === "string"
        ? row.ends_at
        : "9999-12-31T23:59:59.999Z",
    tone:
      tone === "announcement" || tone === "urgent" ? tone : "info",
    ...(linkUrl
      ? {
          link: {
            label: linkLabel,
            href: linkUrl,
            external: /^https?:\/\//i.test(linkUrl),
          },
        }
      : {}),
  };
}

function fallbackAchievement(record: Achievement): PublicAchievement {
  return {
    ...record,
    slug: record.id,
    title: `${record.award} · ${record.recipients.join(", ")}`,
    summary:
      record.details[0] ??
      `${record.recipients.join(", ")} at ${record.competition}.`,
  };
}

export async function getFestivals(): Promise<Festival[]> {
  if (!isPublicContentDatabaseConfigured) return [...fallbackFestivals];
  return (await queryRows("festivals")).map(festivalFromRow);
}

export async function getFestival(slug: string): Promise<Festival | undefined> {
  if (!isPublicContentDatabaseConfigured) {
    return fallbackFestivals.find((record) => record.slug === slug);
  }
  return (await queryRows("festivals", { slug: `eq.${slug}`, limit: "1" }))
    .map(festivalFromRow)
    .at(0);
}

export async function getActivities(): Promise<Activity[]> {
  if (!isPublicContentDatabaseConfigured) return [...fallbackActivities];
  return (await queryRows("activities")).map(activityFromRow);
}

export async function getActivity(slug: string): Promise<Activity | undefined> {
  if (!isPublicContentDatabaseConfigured) {
    return fallbackActivities.find((record) => record.slug === slug);
  }
  return (await queryRows("activities", { slug: `eq.${slug}`, limit: "1" }))
    .map(activityFromRow)
    .at(0);
}

export async function getAchievements(): Promise<PublicAchievement[]> {
  if (!isPublicContentDatabaseConfigured) {
    return fallbackAchievements.map(fallbackAchievement);
  }
  return (await queryRows("achievements")).map(achievementFromRow);
}

export async function getAchievement(
  slug: string,
): Promise<PublicAchievement | undefined> {
  if (!isPublicContentDatabaseConfigured) {
    return fallbackAchievements
      .map(fallbackAchievement)
      .find((record) => record.slug === slug);
  }
  return (await queryRows("achievements", { slug: `eq.${slug}`, limit: "1" }))
    .map(achievementFromRow)
    .at(0);
}

export async function getMagazines(): Promise<MagazineIssue[]> {
  if (!isPublicContentDatabaseConfigured) return [...fallbackMagazines];
  return (await queryRows("magazines")).map(magazineFromRow);
}

export async function getMagazine(
  identifier: string | number,
): Promise<MagazineIssue | undefined> {
  if (!isPublicContentDatabaseConfigured) {
    return fallbackMagazines.find(
      (record) =>
        record.slug === String(identifier) || record.year === Number(identifier),
    );
  }
  const records = await queryRows("magazines");
  return records
    .map(magazineFromRow)
    .find(
      (record) =>
        record.slug === String(identifier) || record.year === Number(identifier),
    );
}

export async function getExecutivePanels(): Promise<ExecutivePanel[]> {
  if (!isPublicContentDatabaseConfigured) return orderExecutivePanels([...fallbackExecutivePanels]);
  return orderExecutivePanels((await queryRows("executive_panels")).map(executivePanelFromRow));
}

export async function getNotifications(): Promise<Notice[]> {
  if (!isPublicContentDatabaseConfigured) return [];
  return (await queryRows("notifications")).map(notificationFromRow);
}

export function getActiveNotification(
  notices: readonly Notice[],
  referenceDate: Date = new Date(),
) {
  const timestamp = referenceDate.getTime();
  return notices.find((notice) => {
    const startsAt = new Date(notice.startsAt).getTime();
    const endsAt = new Date(notice.endsAt).getTime();
    return timestamp >= startsAt && timestamp <= endsAt;
  });
}

export function getCurrentPanel(panels: readonly ExecutivePanel[]) {
  return panels.find((panel) => panel.isCurrent) ?? panels[0];
}

export function getFeaturedFestivalRecord(festivals: readonly Festival[]) {
  return festivals.find((festival) => festival.featured) ?? festivals[0];
}

export function getFeaturedMagazineRecord(magazines: readonly MagazineIssue[]) {
  return magazines.find((magazine) => magazine.featured) ?? magazines[0];
}
