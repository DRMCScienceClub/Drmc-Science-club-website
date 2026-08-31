import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CmsResource, PublicationStatus } from "@/lib/cms/resources";

export type CmsRecord = Record<string, unknown> & {
  id: string;
  title: string;
  slug: string;
  status: PublicationStatus;
  is_featured?: boolean;
  summary?: string;
  data?: Record<string, unknown> | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CmsListOptions = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sort?: string;
  direction?: string;
};

export type AdminMediaAsset = {
  id: string;
  bucket: "cms-staging" | "cms-public";
  object_path: string;
  original_name: string;
  mime_type: string;
  byte_size: number;
  width: number | null;
  height: number | null;
  alt_text: string;
  caption: string;
  credit: string;
  status: PublicationStatus;
  public_url: string | null;
  preview_url: string | null;
  uploaded_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PublishedMediaChoice = Pick<
  AdminMediaAsset,
  "id" | "original_name" | "mime_type" | "width" | "height" | "alt_text" | "public_url"
>;

function cleanSearch(value: string) {
  return value.replace(/[%_,()]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
}

export async function listCmsRecords(
  resource: CmsResource,
  options: CmsListOptions = {},
) {
  const supabase = await createSupabaseServerClient();
  const pageSize = Math.min(Math.max(options.pageSize ?? 12, 1), 50);
  const page = Math.max(options.page ?? 1, 1);
  const start = (page - 1) * pageSize;
  const allowedSorts = new Set(["updated_at", "created_at", "title", "published_at"]);
  const sort = allowedSorts.has(options.sort ?? "") ? options.sort! : "updated_at";

  let query = supabase
    .from(resource.table)
    .select("*", { count: "exact" });

  const search = cleanSearch(options.search ?? "");
  if (search) query = query.ilike("title", `%${search}%`);
  if (options.status && ["draft", "published", "archived"].includes(options.status)) {
    query = query.eq("status", options.status);
  }

  const { data, count, error } = await query
    .order(sort, { ascending: options.direction === "asc", nullsFirst: false })
    .range(start, start + pageSize - 1);

  if (error) throw new Error(`Unable to load ${resource.label.toLowerCase()}: ${error.message}`);

  return {
    records: (data ?? []) as CmsRecord[],
    count: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}

export async function getCmsRecord(resource: CmsResource, id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(resource.table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Unable to load this ${resource.singular}: ${error.message}`);
  return data as CmsRecord | null;
}

export async function getCmsOverview() {
  const supabase = await createSupabaseServerClient();
  const resources = [
    ["festivals", "Festivals"],
    ["activities", "Activities"],
    ["achievements", "Achievements"],
    ["magazines", "Magazines"],
    ["executive_panels", "Executive panels"],
    ["notifications", "Notifications"],
  ] as const;

  const counts = await Promise.all(
    resources.map(async ([table, label]) => {
      const [allResult, publishedResult, draftResult] = await Promise.all([
        supabase.from(table).select("id", { count: "exact", head: true }),
        supabase.from(table).select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from(table).select("id", { count: "exact", head: true }).eq("status", "draft"),
      ]);
      const error = allResult.error ?? publishedResult.error ?? draftResult.error;
      if (error) throw new Error(`Unable to calculate ${label}: ${error.message}`);
      return {
        table,
        label,
        total: allResult.count ?? 0,
        published: publishedResult.count ?? 0,
        drafts: draftResult.count ?? 0,
      };
    }),
  );

  const recentBatches = await Promise.all(
    resources.map(async ([table, label]) => {
      const { data, error } = await supabase
        .from(table)
        .select("id,title,slug,status,updated_at")
        .order("updated_at", { ascending: false })
        .limit(4);
      if (error) throw new Error(`Unable to load recent ${label.toLowerCase()}: ${error.message}`);
      return (data ?? []).map((record) => ({ ...record, table, type: label }));
    }),
  );

  const recent = recentBatches
    .flat()
    .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))
    .slice(0, 8);

  const now = new Date().toISOString();
  const [{ count: newContactCount }, { count: newJoinCount }, { count: activeNotificationCount }] = await Promise.all([
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("join_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .lte("starts_at", now)
      .or(`ends_at.is.null,ends_at.gte.${now}`),
  ]);

  return {
    counts,
    recent,
    submissions: (newContactCount ?? 0) + (newJoinCount ?? 0),
    activeNotifications: activeNotificationCount ?? 0,
  };
}

export async function listSubmissions(kind: "contact" | "join", status?: string) {
  const supabase = await createSupabaseServerClient();
  const table = kind === "contact" ? "contact_submissions" : "join_submissions";
  let query = supabase.from(table).select("*").order("created_at", { ascending: false }).limit(100);
  if (status && ["new", "in_review", "resolved", "spam", "archived"].includes(status)) {
    query = query.eq("status", status);
  }
  const { data, error } = await query;
  if (error) throw new Error(`Unable to load ${kind} submissions: ${error.message}`);
  return (data ?? []) as Array<Record<string, unknown>>;
}

export async function listAdminProfiles() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,display_name,role,is_active,last_signed_in_at,created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Unable to load administrator profiles: ${error.message}`);
  return data ?? [];
}

export async function listAuditLogs() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id,actor_email,action,entity_type,entity_id,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(`Unable to load audit history: ${error.message}`);
  return data ?? [];
}

export async function listMediaAssets() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(`Unable to load media: ${error.message}`);
  const assets = (data ?? []) as Omit<AdminMediaAsset, "preview_url">[];
  return Promise.all(assets.map(async (asset): Promise<AdminMediaAsset> => {
    if (asset.bucket === "cms-public") {
      const publicUrl = asset.public_url || supabase.storage
        .from("cms-public")
        .getPublicUrl(asset.object_path).data.publicUrl;
      return { ...asset, public_url: publicUrl, preview_url: publicUrl };
    }

    const { data: signed } = await supabase.storage
      .from("cms-staging")
      .createSignedUrl(asset.object_path, 60 * 60);
    return { ...asset, preview_url: signed?.signedUrl ?? null };
  }));
}

export async function listPublishedMediaChoices(): Promise<PublishedMediaChoice[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("id,original_name,mime_type,width,height,alt_text,public_url")
    .eq("bucket", "cms-public")
    .eq("status", "published")
    .like("mime_type", "image/%")
    .not("public_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(`Unable to load published media choices: ${error.message}`);
  return (data ?? []) as PublishedMediaChoice[];
}
