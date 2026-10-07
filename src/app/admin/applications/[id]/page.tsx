import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { requireAdmin } from "@/lib/auth";
import { NotAuthorized } from "@/app/admin/_components/not-authorized";
import { getApplication } from "@/lib/membership/repository";
import { statusLabels } from "@/lib/membership/schema";
import { ApplicationReviewForm } from "../review-form";
import { ApplicationDeleteForm } from "../delete-form";

export const dynamic = "force-dynamic";
export default async function ApplicationDetails({ params }: { params: Promise<{ id: string }> }) {
  const identity = await requireAdmin("/admin/applications");
  if (identity.role === "contributor") return <AdminShell identity={identity} active="applications"><NotAuthorized /></AdminShell>;
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const application = await getApplication(id);
  if (!application) notFound();
  const date = (value: string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" }).format(new Date(value));
  return <AdminShell identity={identity} active="applications"><div className="mx-auto max-w-[1100px]"><Link href="/admin/applications" className="font-bold text-science-700">← All applications</Link><div className="mt-5"><AdminPageHeader title={application.full_name} description={`Application ${application.reference_number}`} /></div>
    <div className="mt-7 grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-extrabold">Student information</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2">{[["Name", application.full_name], ["College ID / Roll", application.college_id], ["Class", application.academic_class], ["Section", application.section], ["Shift", application.shift], ["Email", application.email || "Not provided"], ["Phone", application.phone || "Not provided"]].map(([label, value]) => <div key={label}><dt className="text-xs font-bold text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm">{value}</dd></div>)}</dl>
        <h2 className="mt-8 text-xl font-extrabold">Application</h2>{[["Areas of interest", application.areas_of_interest.join(", ") + (application.other_interest ? ` — ${application.other_interest}` : "")], ["Why they want to join", application.reason_for_joining], ["Previous experience / achievements", application.previous_experience || "Not provided"], ["How they would like to contribute", application.contribution_interest || "Not provided"]].map(([label, value]) => <div key={label} className="mt-5"><h3 className="text-sm font-bold">{label}</h3><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">{value}</p></div>)}
      </section>
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-extrabold">Administrative information</h2><dl className="mt-5 space-y-3 text-sm"><div><dt className="font-bold">Status</dt><dd>{statusLabels[application.status]}</dd></div><div><dt className="font-bold">Submitted (Dhaka time)</dt><dd>{date(application.submitted_at)}</dd></div><div><dt className="font-bold">Reviewed by</dt><dd className="break-all">{application.reviewed_by_name || (application.reviewed_by === identity.id ? "You" : application.reviewed_at ? "Former administrator" : "Not yet reviewed")}</dd></div><div><dt className="font-bold">Last reviewed</dt><dd>{application.reviewed_at ? date(application.reviewed_at) : "Not yet reviewed"}</dd></div></dl><ApplicationReviewForm id={id} status={application.status} notes={application.admin_notes} />{identity.role === "super_admin" && <ApplicationDeleteForm id={id} reference={application.reference_number} />}</section>
    </div></div></AdminShell>;
}
