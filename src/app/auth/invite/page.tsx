import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { InviteSession } from "@/app/auth/invite/invite-session";

export const metadata: Metadata = {
  title: "Verifying administrator invitation",
  description: "Securely verify a DRMC Science Club administrator invitation.",
};

export default function InvitePage() {
  return (
    <main className="science-grid grid min-h-screen place-items-center bg-[#f3f7fa] px-4 py-8 sm:px-6">
      <section className="w-full max-w-lg rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft sm:p-10">
        <Logo />
        <p className="eyebrow mt-9">Administrator invitation</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.035em] text-navy-950">Confirming your invitation</h1>
        <p className="mb-6 mt-3 text-sm leading-7 text-slate-600">Please keep this page open while the one-time invitation is verified.</p>
        <InviteSession />
      </section>
    </main>
  );
}
