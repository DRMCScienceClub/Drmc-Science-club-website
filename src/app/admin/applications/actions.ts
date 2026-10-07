"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listApplications, type ApplicationList } from "@/lib/membership/repository";
import { reviewSchema } from "@/lib/membership/schema";

export async function searchApplications(_state: ApplicationList, form: FormData) {
  return listApplications({ search: String(form.get("search") ?? ""), status: String(form.get("status") ?? ""), academicClass: String(form.get("academicClass") ?? ""), shift: String(form.get("shift") ?? ""), interest: String(form.get("interest") ?? ""), page: Number(form.get("page") ?? 1) });
}

export async function reviewApplication(_state: { message?: string; success?: boolean }, form: FormData): Promise<{ message?: string; success?: boolean }> {
  await requireRole(["super_admin", "editor"], "/admin/applications");
  const parsed = reviewSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { message: "Select a valid status and keep notes within 5,000 characters." };
  const client = await createSupabaseServerClient();
  const { data, error } = await client.from("science_club_applications").update({ status: parsed.data.status, admin_notes: parsed.data.admin_notes }).eq("id", parsed.data.id).select("id").maybeSingle();
  if (error || !data) return { message: "The review could not be saved. Please try again." };
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${parsed.data.id}`);
  return { success: true, message: "Application review saved." };
}

export async function deleteApplication(_state: { message?: string }, form: FormData): Promise<{ message?: string }> {
  await requireRole(["super_admin"], "/admin/applications");
  const id = z.uuid().safeParse(form.get("id"));
  if (!id.success) return { message: "Invalid application. Refresh the page and try again." };

  const client = await createSupabaseServerClient();
  const { data, error } = await client.from("science_club_applications")
    .delete()
    .eq("id", id.data)
    .select("id")
    .maybeSingle();
  if (error) return { message: "The application could not be deleted. Check that the application deletion migration has been applied." };
  if (!data) return { message: "This application no longer exists." };

  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id.data}`);
  redirect("/admin/applications?deleted=1");
}
