"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type PublicFormState = {
  success?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

const name = z.string().trim().min(2, "Enter your full name.").max(120);
const email = z.string().trim().email("Enter a valid email address.").max(254);

const contactSchema = z.object({
  name,
  email,
  subject: z.string().trim().min(2, "Enter a subject.").max(180),
  message: z.string().trim().min(10, "Please provide at least 10 characters.").max(5000),
});

const joinSchema = z.object({
  name,
  email,
  phone: z.string().trim().max(40),
  academicClass: z.string().trim().min(1, "Select your current class.").max(40),
  interests: z.array(z.string().trim().min(1).max(80)).min(1, "Select at least one interest."),
  motivation: z.string().trim().min(10, "Please provide at least 10 characters.").max(5000),
  consent: z.literal("on", { error: "Consent is required before submitting." }),
});

async function rateKey(kind: "contact" | "join") {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || requestHeaders.get("x-real-ip") || "unknown";
  const agent = requestHeaders.get("user-agent") || "unknown";
  return createHash("sha256").update(`${kind}:${address}:${agent}`).digest("hex");
}

function failure(error: { message?: string } | null): PublicFormState {
  if (error?.message?.includes("submission_rate_limit_exceeded")) {
    return { message: "Too many submissions were sent from this connection. Please try again in one hour." };
  }
  return { message: "We could not securely save your submission. Please try again later." };
}

export async function submitContactAction(
  _previous: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  if (String(formData.get("website") ?? "").trim()) {
    return { success: true, message: "Thank you. Your message has been received." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  if (!isSupabaseConfigured()) return { message: "The submission service is not configured yet." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("submit_public_contact", {
    p_name: parsed.data.name,
    p_email: parsed.data.email,
    p_subject: parsed.data.subject,
    p_message: parsed.data.message,
    p_rate_key: await rateKey("contact"),
  });
  if (error) return failure(error);
  return { success: true, message: "Thank you. Your message has been received." };
}

export async function submitJoinAction(
  _previous: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  if (String(formData.get("website") ?? "").trim()) {
    return { success: true, message: "Thank you. Your membership interest has been received." };
  }

  const parsed = joinSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    academicClass: formData.get("academic_class"),
    interests: formData.getAll("interests"),
    motivation: formData.get("motivation"),
    consent: formData.get("consent"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  if (!isSupabaseConfigured()) return { message: "The submission service is not configured yet." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("submit_public_join", {
    p_name: parsed.data.name,
    p_email: parsed.data.email,
    p_phone: parsed.data.phone,
    p_academic_class: parsed.data.academicClass,
    p_interests: parsed.data.interests,
    p_motivation: parsed.data.motivation,
    p_rate_key: await rateKey("join"),
  });
  if (error) return failure(error);
  return { success: true, message: "Thank you. Your membership interest has been received." };
}
