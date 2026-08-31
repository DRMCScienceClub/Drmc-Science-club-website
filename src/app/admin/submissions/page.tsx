import Link from "next/link";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { NotAuthorized } from "@/app/admin/_components/not-authorized";
import { updateSubmissionStatusAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { listSubmissions } from "@/lib/cms/admin-repository";

export const dynamic = "force-dynamic";

type SubmissionPageProps = {
  searchParams: Promise<{ kind?: string; status?: string }>;
};

const states = ["new", "in_review", "resolved", "spam", "archived"] as const;

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

export default async function SubmissionsPage({ searchParams }: SubmissionPageProps) {
  const identity = await requireAdmin("/admin/submissions");
  if (identity.role === "contributor") {
    return <AdminShell identity={identity} active="submissions"><NotAuthorized /></AdminShell>;
  }
  const query = await searchParams;
  const kind = query.kind === "join" ? "join" : "contact";
  const records = await listSubmissions(kind, query.status);

  return (
    <AdminShell identity={identity} active="submissions">
      <div className="mx-auto max-w-[1280px]">
        <AdminPageHeader title="Private submissions" description="Review contact messages and membership interest securely. These records are protected by Row Level Security and must never be copied into public content." />
        <div className="mt-7 flex flex-wrap gap-2" aria-label="Submission type">
          <Link href={`/admin/submissions?kind=contact${query.status ? `&status=${query.status}` : ""}`} className={`rounded-xl px-4 py-2.5 text-sm font-extrabold ${kind === "contact" ? "bg-navy-950 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>Contact messages</Link>
          <Link href={`/admin/submissions?kind=join${query.status ? `&status=${query.status}` : ""}`} className={`rounded-xl px-4 py-2.5 text-sm font-extrabold ${kind === "join" ? "bg-navy-950 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>Join requests</Link>
          <form className="ml-auto flex gap-2"><input type="hidden" name="kind" value={kind} /><select name="status" defaultValue={query.status ?? ""} className="min-h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700"><option value="">All states</option>{states.map((state) => <option key={state} value={state}>{state.replace("_", " ")}</option>)}</select><button className="rounded-xl border border-slate-300 bg-white px-4 text-sm font-extrabold text-slate-700">Filter</button></form>
        </div>

        <div className="mt-6 grid gap-4">
          {records.map((record) => (
            <article key={text(record.id)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div><p className="font-display text-lg font-extrabold text-navy-950">{text(record.name)}</p><a href={`mailto:${text(record.email)}`} className="mt-1 inline-block text-sm font-bold text-science-700">{text(record.email)}</a><p className="mt-2 text-xs font-semibold text-slate-500">Received {text(record.created_at) ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(text(record.created_at))) : "—"}</p></div>
                <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-extrabold capitalize text-slate-700">{text(record.status).replace("_", " ")}</span>
              </div>
              {kind === "contact" ? <><h2 className="mt-5 text-sm font-extrabold text-navy-950">{text(record.subject)}</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">{text(record.message)}</p></> : <><dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="font-extrabold text-slate-500">Academic class</dt><dd className="mt-1 font-semibold text-navy-950">{text(record.academic_class)}</dd></div><div><dt className="font-extrabold text-slate-500">Interests</dt><dd className="mt-1 font-semibold text-navy-950">{Array.isArray(record.interests) ? record.interests.join(", ") : "—"}</dd></div></dl><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{text(record.motivation)}</p></>}
              <form action={updateSubmissionStatusAction} className="mt-5 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-[12rem_minmax(0,1fr)_auto]">
                <input type="hidden" name="kind" value={kind} /><input type="hidden" name="id" value={text(record.id)} />
                <label className="sr-only" htmlFor={`status-${record.id}`}>Status</label><select id={`status-${record.id}`} name="status" defaultValue={text(record.status)} className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700">{states.map((state) => <option key={state} value={state}>{state.replace("_", " ")}</option>)}</select>
                <label className="sr-only" htmlFor={`notes-${record.id}`}>Private notes</label><input id={`notes-${record.id}`} name="admin_notes" defaultValue={text(record.admin_notes)} placeholder="Private follow-up note…" className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-navy-950" />
                <button className="min-h-11 rounded-xl bg-navy-950 px-5 text-sm font-extrabold text-white">Save</button>
              </form>
            </article>
          ))}
          {!records.length && <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-card"><p className="font-display text-lg font-extrabold text-navy-950">No submissions found</p><p className="mt-2 text-sm text-slate-500">There are no records matching this view.</p></div>}
        </div>
      </div>
    </AdminShell>
  );
}
