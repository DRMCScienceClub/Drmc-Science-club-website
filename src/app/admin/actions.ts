"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin, requireRole, type AdminRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCmsResource, slugify, type CmsResource, type PublicationStatus } from "@/lib/cms/resources";
import { parseJsonField, validateCmsForm, type CmsFormResult } from "@/lib/cms/validation";
import { safeOriginalName, validateMediaBytes } from "@/lib/media/validation";

export type { CmsFormResult } from "@/lib/cms/validation";

const statusSchema = z.enum(["draft", "published", "archived"]);
const submissionStatusSchema = z.enum(["new", "in_review", "resolved", "spam", "archived"]);
const roleSchema = z.enum(["super_admin", "editor", "contributor"]);
const mediaMetadataSchema = z.object({
  id: z.uuid(),
  original_name: z.string().trim().min(1).max(180),
  alt_text: z.string().trim().max(240),
  caption: z.string().trim().max(500),
  credit: z.string().trim().max(240),
});
const publicContactSchema = z.object({
  institution: z.string().trim().min(2).max(160),
  clubName: z.string().trim().min(2).max(160),
  addressLine1: z.string().trim().min(2).max(180),
  addressLine2: z.string().trim().max(180),
  addressLine3: z.string().trim().max(180),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(3).max(40),
  officeHours: z.string().trim().min(2).max(180),
  mapUrl: z.url().max(1000),
  facebookUrl: z.url().max(1000),
  facebookHandle: z.string().trim().min(1).max(100),
  instagramUrl: z.url().max(1000),
  instagramHandle: z.string().trim().min(1).max(100),
});

export type ContactSettingsFormResult = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export type InviteAdministratorFormState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

const inviteAdministratorSchema = z.object({
  display_name: z.string().trim().min(2, "Enter the administrator's name.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(254),
  role: roleSchema,
});

function nullable(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function numberOrNull(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isoOrNull(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function imageValue(current: unknown, url: unknown, title: string) {
  const existing = current && typeof current === "object" ? current as Record<string, unknown> : {};
  return {
    ...existing,
    src: nullable(url) ?? existing.src ?? "/images/brand/drmc-science-club-logo.png",
    alt: existing.alt ?? title,
    width: existing.width ?? 1600,
    height: existing.height ?? 900,
  };
}

function publicLink(label: string, url: unknown, options: { external?: boolean; download?: boolean } = {}) {
  const href = nullable(url);
  return href ? { label, href, ...options } : undefined;
}

function publicDataFor(
  resource: CmsResource,
  values: Record<string, unknown>,
  existingData: Record<string, unknown>,
  recordId?: string,
) {
  const suppliedData = parseJsonField(values.data_json, existingData);
  const data = suppliedData && typeof suppliedData === "object" && !Array.isArray(suppliedData)
    ? { ...(suppliedData as Record<string, unknown>) }
    : { ...existingData };
  const title = String(values.title);
  const slug = String(values.slug);
  const summary = String(values.summary ?? "");
  const coverUrl = values.cover_image_url;

  switch (resource.key) {
    case "festivals": {
      const startsAt = isoOrNull(values.starts_at);
      const endsAt = isoOrNull(values.ends_at);
      const year = numberOrNull(values.festival_year) ?? new Date().getFullYear();
      return {
        ...data,
        slug,
        title,
        shortTitle: data.shortTitle ?? title,
        year,
        edition: String(values.edition ?? ""),
        theme: data.theme ?? "Science, discovery, and innovation",
        summary,
        description: Array.isArray(data.description) ? data.description : [summary],
        startDate: startsAt?.slice(0, 10) ?? data.startDate ?? `${year}-01-01`,
        endDate: endsAt?.slice(0, 10) ?? startsAt?.slice(0, 10) ?? data.endDate ?? `${year}-01-01`,
        dateLabel: data.dateLabel ?? String(year),
        venue: String(values.venue ?? ""),
        venueAddress: data.venueAddress ?? String(values.venue ?? ""),
        status: data.status ?? "completed",
        recordStatus: data.recordStatus ?? "prototype",
        featured: Boolean(values.is_featured),
        coverImage: imageValue(data.coverImage, coverUrl, title),
        registration: {
          ...(data.registration && typeof data.registration === "object" ? data.registration as object : {}),
          status: String(values.registration_status ?? "not-required"),
          label: (data.registration as Record<string, unknown> | undefined)?.label ?? "Registration",
          note: (data.registration as Record<string, unknown> | undefined)?.note ?? "Check the official club channels for updates.",
        },
        segments: parseJsonField(values.segments_json, data.segments ?? []),
        schedule: parseJsonField(values.schedule_json, data.schedule ?? []),
        results: parseJsonField(values.results_json, data.results ?? []),
        resultsNote: data.resultsNote ?? "Results will be published after official verification.",
        sponsors: parseJsonField(values.sponsors_json, data.sponsors ?? []),
        partners: parseJsonField(values.partners_json, data.partners ?? []),
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
        brochure: publicLink("Download brochure", values.brochure_url, { download: true }),
        rulebook: publicLink("Download rulebook", values.rulebook_url, { download: true }),
      };
    }
    case "activities": {
      const startsAt = isoOrNull(values.starts_at);
      return {
        ...data,
        slug,
        title,
        category: String(values.category ?? "Workshop"),
        status: String(values.event_status ?? "completed"),
        recordStatus: data.recordStatus ?? "prototype",
        featured: Boolean(values.is_featured),
        date: startsAt?.slice(0, 10) ?? data.date ?? new Date().toISOString().slice(0, 10),
        endDate: isoOrNull(values.ends_at)?.slice(0, 10) ?? data.endDate,
        dateLabel: data.dateLabel ?? startsAt?.slice(0, 10) ?? "Date to be announced",
        location: String(values.location ?? ""),
        excerpt: summary,
        body: Array.isArray(data.body) ? data.body : [summary],
        image: imageValue(data.image, coverUrl, title),
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        organizers: Array.isArray(data.organizers) ? data.organizers : ["DRMC Science Club"],
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        registration: publicLink(String(values.registration_label || "Register now"), values.registration_url, { external: true }),
        externalLinks: Array.isArray(data.externalLinks) ? data.externalLinks : [],
        organizerContacts: Array.isArray(data.organizerContacts) ? data.organizerContacts : [],
      };
    }
    case "achievements":
      return {
        ...data,
        id: recordId ?? data.id ?? slug,
        recipients: String(values.recipients ?? "").split(",").map((name) => name.trim()).filter(Boolean),
        award: title,
        competition: String(values.competition ?? ""),
        year: numberOrNull(values.achievement_year) ?? undefined,
        details: Array.isArray(data.details) ? data.details : [summary],
        image: imageValue(data.image, coverUrl, title),
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
        certificate: publicLink("View certificate or evidence", values.certificate_url, { download: true }),
        externalNews: publicLink("Read related coverage", values.external_news_url, { external: true }),
        externalVideo: publicLink("Watch related video", values.external_video_url, { external: true }),
        sourceOrder: typeof data.sourceOrder === "number" ? data.sourceOrder : Date.now(),
      };
    case "magazines": {
      const year = numberOrNull(values.publication_year) ?? new Date().getFullYear();
      return {
        ...data,
        year,
        slug,
        title,
        subtitle: data.subtitle ?? "DRMC Science Club annual magazine",
        volume: String(values.volume ?? ""),
        publishedAt: data.publishedAt ?? `${year}-01-01`,
        pages: typeof data.pages === "number" ? data.pages : 0,
        description: summary,
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        coverImage: imageValue(data.coverImage, coverUrl, title),
        featured: Boolean(values.is_featured),
        readOnline: {
          label: "Read online",
          href: nullable(values.reader_url) ?? (data.readOnline as Record<string, unknown> | undefined)?.href ?? "#",
          external: true,
        },
        downloadPdf: {
          label: "Download PDF",
          href: nullable(values.pdf_url) ?? (data.downloadPdf as Record<string, unknown> | undefined)?.href ?? "#",
          download: true,
        },
      };
    }
    case "executives": {
      const startsYear = numberOrNull(values.starts_year) ?? new Date().getFullYear();
      const endsYear = numberOrNull(values.ends_year) ?? startsYear + 1;
      return {
        ...data,
        session: String(values.session_label ?? `${startsYear}–${endsYear}`),
        startYear: startsYear,
        endYear: endsYear,
        isCurrent: Boolean(values.is_current),
        recordStatus: data.recordStatus ?? "official-document",
        title,
        summary,
        groupImage: imageValue(data.groupImage, coverUrl, title),
      };
    }
    default:
      return data;
  }
}

function baseRow(
  resource: CmsResource,
  values: Record<string, unknown>,
  data: Record<string, unknown>,
  userId: string,
  existing: boolean,
  existingPublishedAt: string | null,
) {
  const status = values.status as PublicationStatus;
  const row: Record<string, unknown> = {
    title: values.title,
    slug: values.slug,
    status,
    is_featured: Boolean(values.is_featured),
    updated_by: userId,
    published_at: status === "published" ? existingPublishedAt ?? new Date().toISOString() : null,
    archived_at: status === "archived" ? new Date().toISOString() : null,
  };
  if (!existing) row.created_by = userId;

  if (resource.key !== "notifications") {
    row.summary = values.summary;
    row.cover_image_url = nullable(values.cover_image_url);
    row.data = data;
  }

  switch (resource.key) {
    case "festivals":
      Object.assign(row, {
        edition: values.edition,
        festival_year: numberOrNull(values.festival_year),
        starts_at: isoOrNull(values.starts_at),
        ends_at: isoOrNull(values.ends_at),
        venue: values.venue,
        registration_status: values.registration_status,
      });
      break;
    case "activities":
      Object.assign(row, {
        category: values.category,
        event_status: values.event_status,
        starts_at: isoOrNull(values.starts_at),
        ends_at: isoOrNull(values.ends_at),
        location: values.location,
      });
      break;
    case "achievements":
      Object.assign(row, {
        recipients: String(values.recipients ?? "").split(",").map((name) => name.trim()).filter(Boolean),
        competition: values.competition,
        achievement_year: numberOrNull(values.achievement_year),
      });
      break;
    case "magazines":
      Object.assign(row, {
        publication_year: numberOrNull(values.publication_year),
        volume: values.volume,
        pdf_url: nullable(values.pdf_url),
        reader_url: nullable(values.reader_url),
      });
      break;
    case "executives":
      Object.assign(row, {
        session_label: values.session_label,
        starts_year: numberOrNull(values.starts_year),
        ends_year: numberOrNull(values.ends_year),
        is_current: Boolean(values.is_current),
      });
      break;
    case "notifications":
      Object.assign(row, {
        message: values.message,
        tone: values.tone,
        starts_at: isoOrNull(values.starts_at) ?? new Date().toISOString(),
        ends_at: isoOrNull(values.ends_at),
        link_label: nullable(values.link_label),
        link_url: nullable(values.link_url),
      });
      break;
  }
  return row;
}

async function syncFestivalRelations(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  festivalId: string,
  values: Record<string, unknown>,
  role: AdminRole,
) {
  if (role === "contributor") return;

  const segments = parseJsonField(values.segments_json, []) as Array<Record<string, unknown>>;
  const schedule = parseJsonField(values.schedule_json, []) as Array<Record<string, unknown>>;
  const results = parseJsonField(values.results_json, []) as Array<Record<string, unknown>>;
  const sponsors = parseJsonField(values.sponsors_json, []) as Array<Record<string, unknown>>;
  const partners = parseJsonField(values.partners_json, []) as Array<Record<string, unknown>>;

  await Promise.all([
    supabase.from("festival_schedule_items").delete().eq("festival_id", festivalId),
    supabase.from("festival_results").delete().eq("festival_id", festivalId),
    supabase.from("festival_organizations").delete().eq("festival_id", festivalId),
  ]);
  await supabase.from("festival_segments").delete().eq("festival_id", festivalId);

  if (Array.isArray(segments) && segments.length) {
    const { error } = await supabase.from("festival_segments").insert(
      segments.map((segment, index) => ({
        festival_id: festivalId,
        slug: slugify(String(segment.slug ?? segment.title ?? `segment-${index + 1}`)),
        title: String(segment.title ?? `Segment ${index + 1}`),
        category: String(segment.category ?? ""),
        summary: String(segment.summary ?? ""),
        eligibility: String(segment.eligibility ?? ""),
        team_size: String(segment.teamSize ?? ""),
        fee: String(segment.fee ?? ""),
        sort_order: index,
      })),
    );
    if (error) throw new Error(`Festival segments could not be synchronized: ${error.message}`);
  }

  const scheduleRows = Array.isArray(schedule)
    ? schedule.flatMap((day, dayIndex) => {
        const items = Array.isArray(day.items) ? day.items as Array<Record<string, unknown>> : [];
        return items.map((item, itemIndex) => ({
          festival_id: festivalId,
          schedule_date: String(day.date ?? new Date().toISOString().slice(0, 10)),
          time_label: String(item.time ?? "TBA"),
          title: String(item.title ?? "Programme item"),
          description: String(item.description ?? ""),
          venue: String(item.venue ?? ""),
          sort_order: dayIndex * 100 + itemIndex,
        }));
      })
    : [];
  if (scheduleRows.length) {
    const { error } = await supabase.from("festival_schedule_items").insert(scheduleRows);
    if (error) throw new Error(`Festival schedule could not be synchronized: ${error.message}`);
  }

  if (Array.isArray(results) && results.length) {
    const { error } = await supabase.from("festival_results").insert(
      results.map((result, index) => ({
        festival_id: festivalId,
        position: String(result.position ?? "Special Mention"),
        recipient: String(result.recipient ?? "To be announced"),
        institution: String(result.institution ?? ""),
        sort_order: index,
      })),
    );
    if (error) throw new Error(`Festival results could not be synchronized: ${error.message}`);
  }

  for (const [kind, organizations] of [["sponsor", sponsors], ["partner", partners]] as const) {
    if (!Array.isArray(organizations)) continue;
    for (const [index, organization] of organizations.entries()) {
      const name = String(organization.name ?? "").trim();
      if (!name) continue;
      const logo = organization.logo && typeof organization.logo === "object"
        ? organization.logo as Record<string, unknown>
        : null;
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .upsert({
          name,
          slug: slugify(name),
          website_url: nullable(organization.href),
          logo_url: nullable(logo?.src),
          logo_alt: String(logo?.alt ?? `${name} logo`),
        }, { onConflict: "slug" })
        .select("id")
        .single();
      if (orgError) throw new Error(`Organization ${name} could not be saved: ${orgError.message}`);
      const { error: joinError } = await supabase.from("festival_organizations").insert({
        festival_id: festivalId,
        organization_id: org.id,
        kind,
        role_label: String(organization.role ?? (kind === "sponsor" ? "Sponsor" : "Partner")),
        sort_order: index,
      });
      if (joinError) throw new Error(`Organization ${name} could not be linked: ${joinError.message}`);
    }
  }
}

function invalidateResource(resource: CmsResource, slug?: string) {
  revalidateTag(`content:${resource.table}`, "max");
  revalidatePath(`/admin/${resource.key}`);
  revalidatePath("/admin");
  revalidatePath("/");
  if (resource.publicBasePath) {
    revalidatePath(resource.publicBasePath);
    if (slug) revalidatePath(`${resource.publicBasePath}/${slug}`);
  }
}

export async function saveCmsRecordAction(
  _previousState: CmsFormResult,
  formData: FormData,
): Promise<CmsFormResult> {
  const resource = getCmsResource(String(formData.get("resource") ?? ""));
  if (!resource) return { ok: false, message: "Unknown content type." };

  const identity = await requireAdmin(`/admin/${resource.key}`);
  const validation = validateCmsForm(resource, formData);
  if (!validation.success) {
    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(validation.error).fieldErrors as Record<string, string[]>,
    };
  }

  const values = validation.data;
  const requestedStatus = values.status as PublicationStatus;
  if (identity.role === "contributor" && requestedStatus !== "draft") {
    return { ok: false, message: "Contributors can save drafts but cannot publish or archive records." };
  }

  const supabase = await createSupabaseServerClient();
  const id = typeof values.id === "string" && values.id ? values.id : null;
  let existingData: Record<string, unknown> = {};
  let existingPublishedAt: string | null = null;
  if (id && resource.key !== "notifications") {
    const { data: existing, error } = await supabase
      .from(resource.table)
      .select("data,published_at")
      .eq("id", id)
      .maybeSingle();
    if (error) return { ok: false, message: `The record could not be loaded: ${error.message}` };
    if (existing?.data && typeof existing.data === "object") existingData = existing.data as Record<string, unknown>;
    if (typeof existing?.published_at === "string") existingPublishedAt = existing.published_at;
  } else if (id) {
    const { data: existing, error } = await supabase
      .from(resource.table)
      .select("published_at")
      .eq("id", id)
      .maybeSingle();
    if (error) return { ok: false, message: `The record could not be loaded: ${error.message}` };
    if (typeof existing?.published_at === "string") existingPublishedAt = existing.published_at;
  }

  const publicData = publicDataFor(resource, values, existingData, id ?? undefined);
  const row = baseRow(resource, values, publicData, identity.id, Boolean(id), existingPublishedAt);

  let savedId = id;
  if (id) {
    const { error } = await supabase.from(resource.table).update(row).eq("id", id);
    if (error) return { ok: false, message: `The ${resource.singular} could not be saved: ${error.message}` };
  } else {
    const { data, error } = await supabase.from(resource.table).insert(row).select("id").single();
    if (error) return { ok: false, message: `The ${resource.singular} could not be created: ${error.message}` };
    savedId = data.id;
  }

  if (resource.key === "festivals" && savedId) {
    try {
      await syncFestivalRelations(supabase, savedId, values, identity.role);
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "Festival relationships could not be synchronized." };
    }
  }

  invalidateResource(resource, String(values.slug));
  redirect(`/admin/${resource.key}?saved=1`);
}

export async function changePublicationStatusAction(formData: FormData) {
  const resource = getCmsResource(String(formData.get("resource") ?? ""));
  const id = String(formData.get("id") ?? "");
  const status = statusSchema.safeParse(formData.get("status"));
  if (!resource || !z.uuid().safeParse(id).success || !status.success) throw new Error("Invalid publication request.");

  const identity = await requireAdmin(`/admin/${resource.key}`);
  if (identity.role === "contributor" && status.data !== "draft") throw new Error("Contributors cannot publish or archive records.");
  const supabase = await createSupabaseServerClient();
  const { data: current } = await supabase.from(resource.table).select("slug").eq("id", id).single();
  const { error } = await supabase.from(resource.table).update({
    status: status.data,
    published_at: status.data === "published" ? new Date().toISOString() : null,
    archived_at: status.data === "archived" ? new Date().toISOString() : null,
    updated_by: identity.id,
  }).eq("id", id);
  if (error) throw new Error(`Publication status could not be changed: ${error.message}`);
  invalidateResource(resource, current?.slug);
}

export async function deleteCmsRecordAction(formData: FormData) {
  const resource = getCmsResource(String(formData.get("resource") ?? ""));
  const id = String(formData.get("id") ?? "");
  if (!resource || !z.uuid().safeParse(id).success) throw new Error("Invalid delete request.");
  await requireRole(["super_admin"], `/admin/${resource.key}`);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from(resource.table).delete().eq("id", id);
  if (error) throw new Error(`The ${resource.singular} could not be deleted: ${error.message}`);
  invalidateResource(resource);
}

export async function updateSubmissionStatusAction(formData: FormData) {
  await requireRole(["super_admin", "editor"], "/admin/submissions");
  const kind = formData.get("kind") === "join" ? "join" : "contact";
  const table = kind === "join" ? "join_submissions" : "contact_submissions";
  const id = String(formData.get("id") ?? "");
  const status = submissionStatusSchema.safeParse(formData.get("status"));
  const notes = String(formData.get("admin_notes") ?? "").trim().slice(0, 5000);
  if (!z.uuid().safeParse(id).success || !status.success) throw new Error("Invalid submission update.");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from(table).update({ status: status.data, admin_notes: notes }).eq("id", id);
  if (error) throw new Error(`Submission could not be updated: ${error.message}`);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}

export async function deleteSubmissionAction(formData: FormData) {
  await requireRole(["super_admin"], "/admin/submissions");
  const kindValue = String(formData.get("kind") ?? "");
  const id = String(formData.get("id") ?? "");
  if ((kindValue !== "contact" && kindValue !== "join") || !z.uuid().safeParse(id).success) {
    throw new Error("Invalid submission delete request.");
  }

  const table = kindValue === "join" ? "join_submissions" : "contact_submissions";
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(`Submission could not be deleted: ${error.message}`);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}

export async function updateAdminProfileAction(formData: FormData) {
  const current = await requireRole(["super_admin"], "/admin/users");
  const id = String(formData.get("id") ?? "");
  const role = roleSchema.safeParse(formData.get("role"));
  const isActive = formData.get("is_active") === "on";
  const displayName = String(formData.get("display_name") ?? "").trim().slice(0, 120);
  if (!z.uuid().safeParse(id).success || !role.success) throw new Error("Invalid administrator profile update.");
  if (id === current.id && (!isActive || role.data !== "super_admin")) {
    throw new Error("You cannot remove your own active super-administrator access.");
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("profiles").update({
    display_name: displayName,
    role: role.data,
    is_active: isActive,
  }).eq("id", id);
  if (error) throw new Error(`Administrator profile could not be updated: ${error.message}`);
  revalidatePath("/admin/users");
}

export async function removeAdministratorAction(formData: FormData) {
  const current = await requireRole(["super_admin"], "/admin/users");
  const id = String(formData.get("id") ?? "");
  if (!z.uuid().safeParse(id).success) {
    throw new Error("Invalid administrator removal request.");
  }
  if (id === current.id) {
    throw new Error("You cannot remove your own super-administrator access.");
  }

  const supabase = await createSupabaseServerClient();
  const { data: target, error: targetError } = await supabase
    .from("profiles")
    .select("id,email,display_name,role,is_active")
    .eq("id", id)
    .maybeSingle();
  if (targetError) {
    throw new Error(`Administrator profile could not be loaded: ${targetError.message}`);
  }
  if (!target) {
    throw new Error("Administrator profile not found.");
  }

  let adminClient;
  try {
    adminClient = createSupabaseAdminClient();
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "The administrator removal service is not configured.",
    );
  }

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(id);
  if (deleteError) {
    throw new Error(`Administrator account could not be removed: ${deleteError.message}`);
  }

  const { error: auditError } = await adminClient.from("audit_logs").insert({
    actor_id: current.id,
    actor_email: current.email,
    action: "remove_administrator",
    entity_type: "profiles",
    entity_id: id,
    before_data: target,
    after_data: null,
  });
  if (auditError) {
    console.error(`Administrator was removed, but the audit entry failed: ${auditError.message}`);
  }

  revalidatePath("/admin/users");
}

export async function inviteAdministratorAction(
  _previous: InviteAdministratorFormState,
  formData: FormData,
): Promise<InviteAdministratorFormState> {
  await requireRole(["super_admin"], "/admin/users");
  const parsed = inviteAdministratorSchema.safeParse({
    display_name: formData.get("display_name"),
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return {
      message: "Please correct the invitation details.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  let confirmationUrl: string;
  try {
    if (!siteUrl) throw new Error();
    confirmationUrl = new URL("/auth/invite", siteUrl).toString();
  } catch {
    return { message: "Set NEXT_PUBLIC_SITE_URL to the exact local or production website origin before sending invitations." };
  }

  let adminClient;
  try {
    adminClient = createSupabaseAdminClient();
  } catch (error) {
    return { message: error instanceof Error ? error.message : "The invitation service is not configured." };
  }

  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(parsed.data.email, {
    data: { full_name: parsed.data.display_name },
    redirectTo: confirmationUrl,
  });
  if (error || !data.user) {
    const detail = error?.message.toLowerCase().includes("already")
      ? "That email already has a Supabase Auth account. Update it in the administrator list instead."
      : `The invitation could not be sent${error?.message ? `: ${error.message}` : "."}`;
    return { message: detail };
  }

  const supabase = await createSupabaseServerClient();
  const { error: profileError } = await supabase.from("profiles").update({
    display_name: parsed.data.display_name,
    role: parsed.data.role,
    is_active: true,
  }).eq("id", data.user.id);
  if (profileError) {
    return { message: `The invitation was sent, but the profile could not be activated: ${profileError.message}. Update the new account in the list below.` };
  }

  revalidatePath("/admin/users");
  return { ok: true, message: `Invitation sent to ${parsed.data.email}. The link expires according to the Supabase email OTP setting.` };
}

export async function savePublicContactSettingsAction(
  _previous: ContactSettingsFormResult,
  formData: FormData,
): Promise<ContactSettingsFormResult> {
  const identity = await requireRole(["super_admin", "editor"], "/admin/settings/contact");
  const raw = Object.fromEntries([
    "institution", "clubName", "addressLine1", "addressLine2", "addressLine3",
    "email", "phone", "officeHours", "mapUrl", "facebookUrl",
    "facebookHandle", "instagramUrl", "instagramHandle",
  ].map((key) => [key, formData.get(key)]));
  const parsed = publicContactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      message: "Please correct the highlighted contact details.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    };
  }

  const { addressLine1, addressLine2, addressLine3, ...settings } = parsed.data;
  const value = {
    ...settings,
    addressLines: [addressLine1, addressLine2, addressLine3].filter(Boolean),
  };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("site_settings").upsert({
    key: "public_contact",
    value,
    description: "Public contact, location, office hours, map, and social links.",
    updated_by: identity.id,
  }, { onConflict: "key" });
  if (error) return { message: `Contact settings could not be saved: ${error.message}` };

  revalidateTag("settings:public_contact", "max");
  revalidatePath("/contact");
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings/contact");
  return { ok: true, message: "Contact settings saved and published." };
}

export async function updateMediaStatusAction(formData: FormData) {
  const identity = await requireRole(["super_admin", "editor"], "/admin/media");
  const id = String(formData.get("id") ?? "");
  const status = statusSchema.safeParse(formData.get("status"));
  if (!z.uuid().safeParse(id).success || !status.success) throw new Error("Invalid media update.");
  const supabase = await createSupabaseServerClient();
  const { data: asset, error: readError } = await supabase
    .from("media_assets")
    .select("id,bucket,object_path,original_name,mime_type")
    .eq("id", id)
    .single();
  if (readError) throw new Error(`Media could not be loaded: ${readError.message}`);

  let changes: Record<string, unknown> = {
    status: status.data,
    updated_by: identity.id,
  };

  if (status.data === "published" && asset.bucket === "cms-staging") {
    const { data: stagedFile, error: downloadError } = await supabase.storage
      .from("cms-staging")
      .download(asset.object_path);
    if (downloadError || !stagedFile) {
      throw new Error(`The staged file could not be validated: ${downloadError?.message ?? "File missing."}`);
    }

    const bytes = new Uint8Array(await stagedFile.arrayBuffer());
    const validated = validateMediaBytes(bytes, asset.mime_type);
    const publicPath = `media/${crypto.randomUUID()}.${validated.extension}`;
    const { error: publicUploadError } = await supabase.storage
      .from("cms-public")
      .upload(publicPath, bytes, {
        cacheControl: "31536000",
        contentType: validated.mimeType,
        upsert: false,
      });
    if (publicUploadError) {
      throw new Error(`The validated file could not be published: ${publicUploadError.message}`);
    }

    const publicUrl = supabase.storage.from("cms-public").getPublicUrl(publicPath).data.publicUrl;
    changes = {
      ...changes,
      bucket: "cms-public",
      object_path: publicPath,
      public_url: publicUrl,
    };
  }

  const { error } = await supabase.from("media_assets").update(changes).eq("id", id);
  if (error) throw new Error(`Media status could not be updated: ${error.message}`);

  if (status.data === "published" && asset.bucket === "cms-staging") {
    // Cleanup is best-effort because older installations may not yet have a
    // staging delete policy. The published object and metadata are immutable.
    await supabase.storage.from("cms-staging").remove([asset.object_path]);
  }
  revalidatePath("/admin/media");
}

export async function updateMediaMetadataAction(formData: FormData) {
  const identity = await requireAdmin("/admin/media");
  const parsed = mediaMetadataSchema.safeParse({
    id: formData.get("id"),
    original_name: formData.get("original_name"),
    alt_text: formData.get("alt_text"),
    caption: formData.get("caption"),
    credit: formData.get("credit"),
  });
  if (!parsed.success) throw new Error("Enter valid media details within the stated limits.");

  const supabase = await createSupabaseServerClient();
  const { data: asset, error: readError } = await supabase
    .from("media_assets")
    .select("id,bucket,status,mime_type,uploaded_by")
    .eq("id", parsed.data.id)
    .single();
  if (readError) throw new Error(`Media could not be loaded: ${readError.message}`);

  const contributorCanEdit = asset.uploaded_by === identity.id
    && asset.bucket === "cms-staging"
    && asset.status === "draft";
  if (identity.role === "contributor" && !contributorCanEdit) {
    throw new Error("Contributors can edit only their own unpublished staging uploads.");
  }
  if (asset.mime_type.startsWith("image/") && parsed.data.alt_text.length < 3) {
    throw new Error("Add useful alternative text for this image.");
  }

  const { error } = await supabase.from("media_assets").update({
    original_name: safeOriginalName(parsed.data.original_name),
    alt_text: parsed.data.alt_text,
    caption: parsed.data.caption,
    credit: parsed.data.credit,
    updated_by: identity.id,
  }).eq("id", parsed.data.id);
  if (error) throw new Error(`Media details could not be saved: ${error.message}`);

  revalidatePath("/admin/media");
}
