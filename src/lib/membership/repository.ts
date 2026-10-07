import "server-only";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ApplicationInput, applicationStatuses } from "./schema";

export type ClubApplication = Omit<ApplicationInput, "acknowledgement"> & {
  id: string; reference_number: string; status: typeof applicationStatuses[number]; admin_notes: string; submitted_at: string; reviewed_at: string | null; reviewed_by: string | null; reviewed_by_name: string | null;
};
export type ApplicationSummary = Pick<ClubApplication, "id" | "reference_number" | "full_name" | "college_id" | "academic_class" | "section" | "shift" | "areas_of_interest" | "status" | "submitted_at">;
export type ApplicationFilters = { search?: string; status?: string; academicClass?: string; shift?: string; interest?: string; page?: number };
export type ApplicationList = { records: ApplicationSummary[]; count: number; page: number; pages: number; message?: string };

export async function listApplications(filters: ApplicationFilters = {}): Promise<ApplicationList> {
  await requireRole(["super_admin", "editor"], "/admin/applications");
  const client = await createSupabaseServerClient();
  const page = Math.max(1, Math.min(100000, Math.floor(filters.page || 1)));
  let query = client.from("science_club_applications").select("id,reference_number,full_name,college_id,academic_class,section,shift,areas_of_interest,status,submitted_at", { count: "exact" });
  const search = (filters.search ?? "").replace(/[^\p{L}\p{N} -]/gu, " ").trim().slice(0, 120);
  if (search) query = query.or(`full_name.ilike.%${search}%,college_id.ilike.%${search}%`);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.academicClass) query = query.eq("academic_class", filters.academicClass);
  if (filters.shift) query = query.eq("shift", filters.shift);
  if (filters.interest) query = query.contains("areas_of_interest", [filters.interest]);
  const { data, error, count } = await query.order("submitted_at", { ascending: false }).order("id").range((page - 1) * 20, page * 20 - 1);
  if (error) return { records: [], count: 0, page: 1, pages: 1, message: "Applications could not be loaded. Check that the membership migration has been applied." };
  return { records: (data ?? []) as ApplicationSummary[], count: count ?? 0, page, pages: Math.max(1, Math.ceil((count ?? 0) / 20)) };
}

export async function getApplication(id: string) {
  await requireRole(["super_admin", "editor"], "/admin/applications");
  const client = await createSupabaseServerClient();
  const { data, error } = await client.from("science_club_applications").select("id,reference_number,full_name,college_id,academic_class,section,shift,email,phone,areas_of_interest,other_interest,reason_for_joining,previous_experience,contribution_interest,status,admin_notes,submitted_at,reviewed_at,reviewed_by,reviewed_by_name").eq("id", id).maybeSingle();
  if (error) throw new Error("Unable to load the application.");
  return data as ClubApplication | null;
}
