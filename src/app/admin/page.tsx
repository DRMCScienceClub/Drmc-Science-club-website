import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { Icon, type IconName } from "@/components/ui/icon";
import { requireAdmin } from "@/lib/auth";
import { getCmsOverview } from "@/lib/cms/admin-repository";
import { cmsResources } from "@/lib/cms/resources";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Content Dashboard",
  description: "Secure content administration for the DRMC Science Club website.",
};

function resourcePath(table: string) {
  return table === "executive_panels" ? "executives" : table;
}

function statusClasses(status: string) {
  if (status === "published") return "bg-teal-50 text-teal-700 ring-teal-200";
  if (status === "archived") return "bg-slate-100 text-slate-600 ring-slate-200";
  return "bg-amber-50 text-amber-800 ring-amber-200";
}

function formatDate(value: unknown) {
  if (typeof value !== "string") return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  const identity = await requireAdmin("/admin");
  const overview = await getCmsOverview();
  const totalPublished = overview.counts.reduce((sum, item) => sum + item.published, 0);
  const totalDrafts = overview.counts.reduce((sum, item) => sum + item.drafts, 0);

  const kpis: ReadonlyArray<{
    label: string;
    value: number;
    detail: string;
    icon: IconName;
    tone: string;
  }> = [
    { label: "Published", value: totalPublished, detail: "Live public records", icon: "globe", tone: "bg-science-100 text-science-700" },
    { label: "Drafts", value: totalDrafts, detail: "Awaiting editorial work", icon: "book", tone: "bg-amber-100 text-amber-800" },
    { label: "Active notices", value: overview.activeNotifications, detail: "Visible in the current window", icon: "calendar", tone: "bg-teal-100 text-teal-700" },
    { label: "Unread submissions", value: overview.submissions, detail: "New contact and join requests", icon: "mail", tone: "bg-violet-100 text-violet-700" },
  ];

  return (
    <AdminShell identity={identity} active="overview">
      <div className="mx-auto max-w-[1380px]">
        <AdminPageHeader
          eyebrow="Secure administration"
          title={`Welcome back, ${identity.displayName?.split(" ")[0] || "administrator"}.`}
          description="Review publication health, continue editorial work, and keep the public website accurate. Every mutation is authorised server-side and recorded in the audit history."
        />

        <section aria-labelledby="dashboard-snapshot" className="mt-9">
          <h2 id="dashboard-snapshot" className="font-display text-xl font-extrabold tracking-[-0.02em] text-navy-950">Site snapshot</h2>
          <p className="mt-1 text-sm text-slate-500">Live counts from the protected Supabase workspace.</p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <dt className="text-sm font-bold text-slate-500">{kpi.label}</dt>
                    <dd>
                      <span className="mt-2 block font-display text-3xl font-extrabold tracking-[-0.04em] text-navy-950">{kpi.value}</span>
                      <span className="mt-3 block text-xs font-semibold leading-5 text-slate-500">{kpi.detail}</span>
                    </dd>
                  </div>
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${kpi.tone}`}><Icon name={kpi.icon} /></span>
                </div>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-8 grid items-start gap-6 2xl:grid-cols-[minmax(0,1.45fr)_minmax(21rem,0.8fr)]">
          <section aria-labelledby="recent-content" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <h2 id="recent-content" className="font-display text-xl font-extrabold tracking-[-0.02em] text-navy-950">Recently changed</h2>
              <p className="mt-1 text-sm text-slate-500">The latest edits across the content system.</p>
            </div>
            {overview.recent.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left">
                  <thead><tr className="border-b border-slate-200 bg-slate-50/80 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                    <th className="px-6 py-3.5">Content</th><th className="px-4 py-3.5">Type</th><th className="px-4 py-3.5">State</th><th className="px-6 py-3.5 text-right">Updated</th>
                  </tr></thead>
                  <tbody>
                    {overview.recent.map((record) => (
                      <tr key={`${record.table}-${record.id}`} className="border-b border-slate-100 last:border-0">
                        <td className="px-6 py-4">
                          <Link href={`/admin/${resourcePath(record.table)}/${record.id}/edit`} className="font-extrabold text-navy-950 hover:text-science-700">{record.title}</Link>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-slate-500">{record.type}</td>
                        <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold capitalize ring-1 ring-inset ${statusClasses(record.status)}`}>{record.status}</span></td>
                        <td className="px-6 py-4 text-right text-xs font-semibold text-slate-500">{formatDate(record.updated_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-sm font-semibold text-slate-500">No content has been created yet. Choose a collection to add the first record.</div>
            )}
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
            <h2 className="font-display text-xl font-extrabold text-navy-950">Collections</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">Open a focused editorial workspace.</p>
            <div className="mt-5 grid gap-3">
              {cmsResources.map((resource) => {
                const counts = overview.counts.find((item) => item.table === resource.table);
                return (
                  <Link key={resource.key} href={`/admin/${resource.key}`} className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition-colors hover:border-science-300 hover:bg-science-50">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-science-700 group-hover:bg-white"><Icon name={resource.icon} className="size-4" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-extrabold text-navy-950">{resource.label}</span><span className="mt-0.5 block text-xs font-semibold text-slate-500">{counts?.published ?? 0} published · {counts?.drafts ?? 0} drafts</span></span>
                    <Icon name="chevron-right" className="size-4 text-slate-400" />
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}
