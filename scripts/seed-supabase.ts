import { createClient } from "@supabase/supabase-js";
import { achievements } from "../src/data/achievements";
import { activities } from "../src/data/activities";
import { executivePanels } from "../src/data/executives";
import { festivals } from "../src/data/festivals";
import { magazines } from "../src/data/magazines";
import type {
  ExecutiveMember,
  ExecutivePanel,
} from "../src/types/content";

type Json =
  | boolean
  | number
  | string
  | null
  | Json[]
  | { [key: string]: Json };

type SeedSet = {
  table:
    | "festivals"
    | "activities"
    | "achievements"
    | "magazines"
    | "executive_panels";
  rows: Array<Record<string, Json | undefined>>;
};

const args = new Set(process.argv.slice(2));
const shouldApply = args.has("--apply");
const remoteConfirmed = args.has("--confirm-remote");
const seedPublishedAt = "2026-08-31T00:00:00+06:00";

function asJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}

function startOfDhakaDay(value: string | undefined): string | null {
  return value ? `${value}T00:00:00+06:00` : null;
}

function endOfDhakaDay(value: string | undefined): string | null {
  return value ? `${value}T23:59:59+06:00` : null;
}

function truncate(value: string, maximumLength: number): string {
  return value.length <= maximumLength
    ? value
    : `${value.slice(0, maximumLength - 1).trimEnd()}…`;
}

function withSeedMetadata(
  value: Record<string, unknown>,
  provenance: "official-document" | "poster-verified" | "prototype",
): Json {
  return asJson({
    ...value,
    recordStatus: value.recordStatus ?? provenance,
    _seed: {
      schemaVersion: 1,
      source: "src/data",
      provenance,
      importedAt: seedPublishedAt,
    },
  });
}

function publicExecutiveMember(member: ExecutiveMember) {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    department: member.department,
    academicClass: member.academicClass,
    image: member.image,
  };
}

/**
 * Select fields deliberately instead of spreading the source object. This keeps
 * future notice-only phone, college-number, shift, or signature fields out of
 * the database even if they are later added to an internal source type.
 */
function publicExecutivePanel(panel: ExecutivePanel) {
  return {
    session: panel.session,
    startYear: panel.startYear,
    endYear: panel.endYear,
    isCurrent: panel.isCurrent,
    recordStatus: panel.recordStatus,
    title: panel.title,
    summary: panel.summary,
    groupImage: panel.groupImage,
    moderator: publicExecutiveMember(panel.moderator),
    advisers: panel.advisers.map(publicExecutiveMember),
    institutionalLeadership: panel.institutionalLeadership?.map(
      publicExecutiveMember,
    ),
    departments: panel.departments.map((department) => ({
      name: department.name,
      description: department.description,
      members: department.members.map(publicExecutiveMember),
    })),
  };
}

function assertNoPrivateCommitteeFields(value: unknown, path = "data"): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      assertNoPrivateCommitteeFields(item, `${path}[${index}]`),
    );
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    if (/phone|college.?number|shift|signature/i.test(key)) {
      throw new Error(`Refusing to seed private committee field: ${path}.${key}`);
    }
    assertNoPrivateCommitteeFields(child, `${path}.${key}`);
  }
}

const festivalRows = festivals.map((festival) => ({
  title: festival.title,
  slug: festival.slug,
  summary: festival.summary,
  edition: festival.edition,
  festival_year: festival.year,
  starts_at: startOfDhakaDay(festival.startDate),
  ends_at: endOfDhakaDay(festival.endDate),
  venue: festival.venue,
  registration_status: festival.registration.status,
  status: "published",
  is_featured: festival.featured,
  cover_image_url: festival.coverImage.src,
  data: withSeedMetadata(
    festival as unknown as Record<string, unknown>,
    festival.recordStatus,
  ),
  published_at: seedPublishedAt,
}));

const activityRows = activities.map((activity) => ({
  title: activity.title,
  slug: activity.slug,
  summary: activity.excerpt,
  category: activity.category,
  event_status: activity.status,
  starts_at: startOfDhakaDay(activity.date),
  ends_at: endOfDhakaDay(activity.endDate),
  location: activity.location,
  status: "published",
  is_featured: activity.featured,
  cover_image_url: activity.image.src,
  data: withSeedMetadata(
    activity as unknown as Record<string, unknown>,
    activity.recordStatus,
  ),
  published_at: seedPublishedAt,
}));

const achievementRows = achievements.map((achievement) => ({
  title: truncate(
    `${achievement.award} — ${achievement.recipients.join(", ")}`,
    180,
  ),
  slug: achievement.id,
  summary:
    achievement.details[0] ??
    `${achievement.recipients.join(", ")} received ${achievement.award} at ${achievement.competition}.`,
  recipients: achievement.recipients,
  competition: achievement.competition,
  achievement_year: achievement.year,
  status: "published",
  is_featured: false,
  cover_image_url: achievement.image.src,
  data: withSeedMetadata(
    achievement as unknown as Record<string, unknown>,
    "poster-verified",
  ),
  published_at: seedPublishedAt,
}));

const magazineRows = magazines.map((magazine) => ({
  title: magazine.title,
  slug: magazine.slug,
  summary: magazine.description,
  publication_year: magazine.year,
  volume: magazine.volume,
  pdf_url: magazine.downloadPdf.href,
  reader_url: magazine.readOnline.href,
  status: "draft",
  is_featured: magazine.featured,
  cover_image_url: magazine.coverImage.src,
  data: withSeedMetadata(
    magazine as unknown as Record<string, unknown>,
    "prototype",
  ),
  published_at: null,
}));

const executivePanelRows = executivePanels.map((panel) => {
  const publicPanel = publicExecutivePanel(panel);
  assertNoPrivateCommitteeFields(publicPanel);

  return {
    title: panel.title,
    slug: `executive-panel-${panel.startYear}-${panel.endYear}`,
    summary: panel.summary,
    session_label: panel.session,
    starts_year: panel.startYear,
    ends_year: panel.endYear,
    is_current: panel.isCurrent,
    status: "published",
    is_featured: panel.isCurrent,
    cover_image_url: panel.groupImage?.src,
    data: withSeedMetadata(publicPanel, panel.recordStatus),
    published_at: seedPublishedAt,
  };
});

const seedSets: SeedSet[] = [
  { table: "festivals", rows: festivalRows },
  { table: "activities", rows: activityRows },
  { table: "achievements", rows: achievementRows },
  { table: "magazines", rows: magazineRows },
  { table: "executive_panels", rows: executivePanelRows },
];

function printPlan(): void {
  console.log("Phase 2 content seed plan");
  for (const set of seedSets) {
    const published = set.rows.filter((row) => row.status === "published").length;
    const drafts = set.rows.length - published;
    console.log(`- ${set.table}: ${set.rows.length} root rows (${published} published, ${drafts} draft)`);
  }
  console.log(
    "Each root row contains the complete Phase 1 public view model in data JSON.",
  );
}

function requireEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function isLocalSupabase(url: string): boolean {
  const hostname = new URL(url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

async function main(): Promise<void> {
  printPlan();

  if (!shouldApply) {
    console.log(
      "Dry run only. Add --apply to write; remote projects also require --confirm-remote.",
    );
    return;
  }

  const supabaseUrl = requireEnvironment("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnvironment("SUPABASE_SERVICE_ROLE_KEY");

  if (!isLocalSupabase(supabaseUrl) && !remoteConfirmed) {
    throw new Error(
      "Refusing to seed a remote Supabase project without --confirm-remote.",
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  for (const set of seedSets) {
    const { data, error } = await supabase
      .from(set.table)
      .upsert(set.rows, { onConflict: "slug" })
      .select("id, slug");

    if (error) {
      throw new Error(`Failed to seed ${set.table}: ${error.message}`);
    }

    console.log(`Seeded ${data.length} ${set.table} rows.`);
  }

  console.log(
    "Seed complete. Review prototype provenance and media consent before treating this import as production-approved content.",
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Unknown seed failure");
  process.exitCode = 1;
});
