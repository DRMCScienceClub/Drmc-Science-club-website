import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { ConfirmSubmitButton } from "@/app/admin/_components/confirm-submit-button";
import { NotAuthorized } from "@/app/admin/_components/not-authorized";
import { deleteSubmissionAction, updateSubmissionStatusAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { listSubmissions } from "@/lib/cms/admin-repository";
import { AdminSelect } from "@/app/admin/_components/admin-select";

export const dynamic = "force-dynamic";

type SubmissionPageProps = {
  searchParams: Promise<{ status?: string }>;
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
  const kind = "contact";
  const records = await listSubmissions(kind, query.status);

  return (
    <AdminShell identity={identity} active="submissions">
      <div className="mx-auto max-w-[1280px]">
        <AdminPageHeader title="Private submissions" description="Review contact messages and manage private follow-up notes. Review club applications separately under Membership Applications." />
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-extrabold text-navy-950">Contact messages</h2>
          <form className="ml-auto flex gap-2"><AdminSelect name="status" label="Filter by submission status" defaultValue={query.status ?? ""} options={[{ value: "", label: "All states" }, ...states.map((state) => ({ value: state, label: state === "in_review" ? "In review" : state.charAt(0).toUpperCase() + state.slice(1) }))]} /><button className="rounded-xl border border-slate-300 bg-white px-4 text-sm font-extrabold text-slate-700">Filter</button></form>
        </div>

        <div
          className="mt-6 grid max-h-[92rem] gap-4 overflow-y-auto overscroll-contain pr-1"
          aria-label="Contact submissions"
          tabIndex={records.length > 5 ? 0 : undefined}
        >
          {records.map((record) => (
            <article key={text(record.id)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div><p className="font-display text-lg font-extrabold text-navy-950">{text(record.name)}</p><a href={`mailto:${text(record.email)}`} className="mt-1 inline-block text-sm font-bold text-science-700">{text(record.email)}</a><p className="mt-2 text-xs font-semibold text-slate-500">Received {text(record.created_at) ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(text(record.created_at))) : "—"}</p></div>
                <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-extrabold capitalize text-slate-700">{text(record.status).replace("_", " ")}</span>
              </div>
              <h2 className="mt-5 text-sm font-extrabold text-navy-950">{text(record.subject)}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">{text(record.message)}</p>
              <form action={updateSubmissionStatusAction} className="mt-5 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-[12rem_minmax(0,1fr)_auto]">
                <input type="hidden" name="kind" value={kind} /><input type="hidden" name="id" value={text(record.id)} />
                <AdminSelect name="status" label="Submission status" defaultValue={text(record.status)} options={states.map((state) => ({ value: state, label: state === "in_review" ? "In review" : state.charAt(0).toUpperCase() + state.slice(1) }))} />
                <label className="sr-only" htmlFor={`notes-${record.id}`}>Private notes</label><input id={`notes-${record.id}`} name="admin_notes" defaultValue={text(record.admin_notes)} placeholder="Private follow-up note…" className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-navy-950" />
                <button className="min-h-11 rounded-xl bg-navy-950 px-5 text-sm font-extrabold text-white">Save</button>
              </form>
              {identity.role === "super_admin" && (
                <form action={deleteSubmissionAction} className="mt-3 flex justify-end">
                  <input type="hidden" name="kind" value={kind} />
                  <input type="hidden" name="id" value={text(record.id)} />
                  <ConfirmSubmitButton
                    message="Permanently remove this contact message? This cannot be undone."
                    className="min-h-10 rounded-xl border border-red-200 px-4 text-sm font-extrabold text-red-700 transition hover:bg-red-50"
                  >
                    Remove submission
                  </ConfirmSubmitButton>
                </form>
              )}
            </article>
          ))}
          {!records.length && <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-card"><p className="font-display text-lg font-extrabold text-navy-950">No submissions found</p><p className="mt-2 text-sm text-slate-500">There are no records matching this view.</p></div>}
        </div>
      </div>
    </AdminShell>
  );
}
