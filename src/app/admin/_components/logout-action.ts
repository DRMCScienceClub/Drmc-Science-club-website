"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminIdentity } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    await getAdminIdentity();
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}
