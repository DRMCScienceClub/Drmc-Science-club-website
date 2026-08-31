import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const adminRoles = ["super_admin", "editor", "contributor"] as const;
export type AdminRole = (typeof adminRoles)[number];

export type AdminIdentity = {
  id: string;
  email: string | null;
  displayName: string | null;
  role: AdminRole;
};

function isAdminRole(value: unknown): value is AdminRole {
  return adminRoles.includes(value as AdminRole);
}

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || typeof userId !== "string") {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name, role, is_active")
    .eq("id", userId)
    .eq("is_active", true)
    .maybeSingle();

  if (profileError || !profile || !isAdminRole(profile.role)) {
    return null;
  }

  return {
    id: userId,
    email:
      typeof claimsData?.claims.email === "string"
        ? claimsData.claims.email
        : null,
    displayName:
      typeof profile.display_name === "string" ? profile.display_name : null,
    role: profile.role,
  };
}

export async function requireAdmin(returnTo = "/admin") {
  if (!isSupabaseConfigured()) {
    redirect(`/admin/login?setup=required&returnTo=${encodeURIComponent(returnTo)}`);
  }

  const identity = await getAdminIdentity();
  if (!identity) {
    redirect(`/admin/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  return identity;
}

export async function requireRole(
  allowedRoles: readonly AdminRole[],
  returnTo = "/admin",
) {
  const identity = await requireAdmin(returnTo);

  if (!allowedRoles.includes(identity.role)) {
    throw new Error("You do not have permission to perform this action.");
  }

  return identity;
}
