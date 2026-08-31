"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { adminRoles, type AdminRole } from "@/lib/auth";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must contain at least 8 characters."),
  returnTo: z.string().optional(),
});

export type LoginState = {
  error?: string;
  fieldErrors?: { email?: string[]; password?: string[] };
};

function safeReturnPath(value: string | undefined) {
  return value?.startsWith("/admin") &&
    value !== "/admin/login" &&
    !value.startsWith("//")
    ? value
    : "/admin";
}

function isAdminRole(value: unknown): value is AdminRole {
  return adminRoles.includes(value as AdminRole);
}

export async function signInAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return { error: "Administrator access is not configured for this environment." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    returnTo: formData.get("returnTo") || undefined,
  });

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;
    return {
      error: "Please correct the highlighted fields.",
      fieldErrors: { email: errors.email, password: errors.password },
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (signInError) {
    return { error: "The email or password is incorrect." };
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  const { data: profile, error: profileError } = userId
    ? await supabase
        .from("profiles")
        .select("role, is_active")
        .eq("id", userId)
        .eq("is_active", true)
        .maybeSingle()
    : { data: null, error: userError };

  if (userError || profileError || !profile || !isAdminRole(profile.role)) {
    await supabase.auth.signOut();
    return { error: "This account does not have active administrator access." };
  }

  redirect(safeReturnPath(parsed.data.returnTo));
}
