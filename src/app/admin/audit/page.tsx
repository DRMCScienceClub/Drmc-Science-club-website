import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { NotAuthorized } from "@/app/admin/_components/not-authorized";
import { requireAdmin } from "@/lib/auth";
import { listAuditLogs } from "@/lib/cms/admin-repository";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const identity = await requireAdmin("/admin/audit");
  if (identity.role === "contributor") return <AdminShell identity={identity} active="audit"><NotAuthorized /></AdminShell>;
  const logs = await listAuditLogs();
  return (
    <AdminShell identity={identity} active="audit"><div className="mx-auto max-w-[1180px]"><AdminPageHeader title="Audit history" description="A read-only record of important content, media, submission, and settings changes. Database triggers write these entries independently of the browser UI." /><div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left"><thead><tr className="border-b border-slate-200 bg-slate-50 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-slate-500"><th className="px-6 py-3.5">When</th><th className="px-4 py-3.5">Administrator</th><th className="px-4 py-3.5">Action</th><th className="px-6 py-3.5">Record</th></tr></thead><tbody>{logs.map((log) => <tr key={log.id} className="border-b border-slate-100 last:border-0"><td className="px-6 py-4 text-xs font-semibold text-slate-500">{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(log.created_at))}</td><td className="px-4 py-4 text-sm font-bold text-navy-950">{log.actor_email || "System"}</td><td className="px-4 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-extrabold uppercase text-slate-700">{log.action}</span></td><td className="px-6 py-4 text-sm font-semibold text-slate-600">{log.entity_type} <span className="block font-mono text-xs text-slate-400">{log.entity_id}</span></td></tr>)}</tbody></table></div>{!logs.length && <p className="px-6 py-14 text-center text-sm font-semibold text-slate-500">No audit events have been recorded yet.</p>}</div></div></AdminShell>
  );
}
