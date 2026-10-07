"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { applicationSchema, type ApplicationState } from "@/lib/membership/schema";

export async function submitApplication(_previous: ApplicationState, form: FormData): Promise<ApplicationState> {
  if (String(form.get("membership_website") ?? "").trim()) return { success: true };
  const values = Object.fromEntries([...form.entries()].filter(([key, value]) => key !== "areas_of_interest" && typeof value === "string")) as Record<string, string>;
  const parsed = applicationSchema.safeParse({ ...values, areas_of_interest: form.getAll("areas_of_interest") });
  if (!parsed.success) return { message: "Please correct the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors, values };
  try {
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!secret) return { message: "Online applications are temporarily unavailable. Please try again later or follow the offline instructions.", values };
    const requestHeaders = await headers();
    const address = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";
    const hash = (input: string) => createHmac("sha256", secret).update(input).digest("hex");
    const payload = { ...parsed.data, other_interest: parsed.data.areas_of_interest.includes("Other") ? parsed.data.other_interest : "" };
    const client = createSupabaseAdminClient();
    const { data, error } = await client.rpc("submit_science_club_application", {
      p_application: payload,
      p_rate_key: hash(`membership:${address}`),
      p_submission_key: hash(JSON.stringify(payload)),
    });
    if (error) return { message: error.message.includes("submission_rate_limit_exceeded") ? "Too many submissions from this connection. Please try again in one hour." : "Your application could not be saved. Please try again later.", values };
    if (typeof data !== "string" || !/^SC-[A-F0-9]{16}$/.test(data)) return { message: "We could not confirm submission. Please try again.", values };
    return { success: true, reference: data };
  } catch {
    return { message: "Your application could not be saved. Please try again later.", values };
  }
}
