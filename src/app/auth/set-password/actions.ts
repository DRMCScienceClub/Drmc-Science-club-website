"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const passwordSchema = z.object({
  password: z.string().min(12, "Use at least 12 characters.").max(128),
  confirm_password: z.string(),
}).refine((value) => value.password === value.confirm_password, {
  message: "The passwords do not match.",
  path: ["confirm_password"],
});

export type SetPasswordFormState = {
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function setInvitedAdministratorPasswordAction(
  _previous: SetPasswordFormState,
  formData: FormData,
): Promise<SetPasswordFormState> {
  const parsed = passwordSchema.safeParse({
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  });
  if (!parsed.success) {
    return {
      message: "Please correct the password fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error: userError } = await supabase.auth.getUser();
  if (userError || !data.user) {
    return { message: "This invitation session has expired. Ask a super administrator to send a new invitation." };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { message: `The password could not be saved: ${error.message}` };

  await supabase.auth.signOut();
  redirect("/admin/login?invite=accepted");
}
