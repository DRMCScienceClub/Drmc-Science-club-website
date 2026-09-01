import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { SetPasswordForm } from "@/app/auth/set-password/set-password-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Accept administrator invitation",
  description: "Create a password for an invited DRMC Science Club administrator account.",
};

export default async function SetPasswordPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/admin/login?invite=invalid");

  return (
    <main className="science-grid grid min-h-screen place-items-center bg-[#f3f7fa] px-4 py-8 sm:px-6">
      <section className="w-full max-w-lg rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft sm:p-10">
        <Logo />
        <p className="eyebrow mt-9">Administrator invitation</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.035em] text-navy-950">Create your secure password</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">This password will be used with <strong>{data.user.email}</strong> at the private administrator sign-in page.</p>
        <SetPasswordForm />
      </section>
    </main>
  );
}
