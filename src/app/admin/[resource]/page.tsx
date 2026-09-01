import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { ConfirmSubmitButton } from "@/app/admin/_components/confirm-submit-button";
import { changePublicationStatusAction, deleteCmsRecordAction, moveExecutivePanelAction } from "@/app/admin/actions";
import { Icon } from "@/components/ui/icon";
import { requireAdmin } from "@/lib/auth";
import { listCmsRecords, listExecutivePanelOrder } from "@/lib/cms/admin-repository";
import { getCmsResource } from "@/lib/cms/resources";

export const dynamic = "force-dynamic";

type ResourceListPageProps = {
  params: Promise<{ resource: string }>;
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
    sort?: string;
    direction?: string;
    saved?: string;
  }>;
};

function statusClasses(status: string) {
  if (status === "published") return "bg-teal-50 text-teal-700 ring-teal-200";
  if (status === "archived") return "bg-slate-100 text-slate-600 ring-slate-200";
  return "bg-amber-50 text-amber-800 ring-amber-200";
}

function pageHref(resource: string, query: Awaited<ResourceListPageProps["searchParams"]>, page: number) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.status) params.set("status", query.status);
  if (query.sort) params.set("sort", query.sort);
  if (query.direction) params.set("direction", query.direction);
  params.set("page", String(page));
  return `/admin/${resource}?${params}`;
}

function publicPreviewHref(resource: string, slug: string) {
  if (resource === "executives") return "/executives";
  if (resource === "magazines") return `/magazines/${slug.replace(/^aurora-/, "")}`;
  if (resource === "notifications") return "/";
  return `/${resource}/${slug}`;
}

export default async function ResourceListPage({ params, searchParams }: ResourceListPageProps) {
  const { resource: resourceKey } = await params;
  const resource = getCmsResource(resourceKey);
  if (!resource) notFound();
  const identity = await requireAdmin(`/admin/${resource.key}`);
  const query = await searchParams;
  const page = Number.parseInt(query.page ?? "1", 10);
  const [result, panelOrder] = await Promise.all([
    listCmsRecords(resource, {
      page: Number.isFinite(page) ? page : 1,
      search: query.q,
      status: query.status,
      sort: query.sort,
      direction: query.direction,
    }),
    resource.key === "executives" ? listExecutivePanelOrder() : Promise.resolve([]),
  ]);
  const canPublish = identity.role !== "contributor";
  const canDelete = identity.role === "super_admin";

  return (
    <AdminShell identity={identity} active={resource.key}>
      <div className="mx-auto max-w-[1380px]">
        <AdminPageHeader
          title={resource.label}
          description={resource.description}
          action={{ href: `/admin/${resource.key}/new`, label: `Create ${resource.singular}` }}
        />

        {query.saved === "1" && (
          <div role="status" className="mt-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800">Changes saved successfully.</div>
        )}

        {resource.key === "executives" && panelOrder.length > 0 && (
          <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6" aria-labelledby="panel-order-heading">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 id="panel-order-heading" className="font-display text-xl font-extrabold text-navy-950">Panel session order</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">The current panel is pinned first. Use the arrows to arrange the remaining sessions on the public Executives page and homepage archive.</p>
              </div>
              <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.1em] text-teal-700">Current first</span>
            </div>
            <ol className="mt-4 grid gap-2">
              {panelOrder.map((panel, index) => {
                const firstMovableIndex = panelOrder[0]?.is_current ? 1 : 0;
                return (
                  <li key={panel.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-xs font-black text-slate-500 ring-1 ring-slate-200">{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-navy-950">{panel.session_label}</p>
                      <p className="mt-0.5 text-xs font-semibold capitalize text-slate-500">{panel.status}{panel.is_current ? " · Current panel" : ""}</p>
                    </div>
                    {canPublish && !panel.is_current && (
                      <div className="flex gap-1.5" aria-label={`Move ${panel.session_label}`}>
                        <form action={moveExecutivePanelAction}>
                          <input type="hidden" name="id" value={panel.id} />
                          <input type="hidden" name="direction" value="up" />
                          <button disabled={index <= firstMovableIndex} aria-label={`Move ${panel.session_label} up`} title="Move up" className="grid size-9 place-items-center rounded-lg border border-slate-300 bg-white text-base font-black text-navy-900 hover:border-science-300 hover:bg-science-50 disabled:cursor-not-allowed disabled:opacity-30">↑</button>
                        </form>
                        <form action={moveExecutivePanelAction}>
                          <input type="hidden" name="id" value={panel.id} />
                          <input type="hidden" name="direction" value="down" />
                          <button disabled={index === panelOrder.length - 1} aria-label={`Move ${panel.session_label} down`} title="Move down" className="grid size-9 place-items-center rounded-lg border border-slate-300 bg-white text-base font-black text-navy-900 hover:border-science-300 hover:bg-science-50 disabled:cursor-not-allowed disabled:opacity-30">↓</button>
                        </form>
                      </div>
                    )}
                    {panel.is_current && <span className="rounded-full bg-teal-100 px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-teal-800">Pinned</span>}
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        <section aria-label={`${resource.label} filters`} className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
          <form className="grid gap-3 md:grid-cols-[minmax(14rem,1fr)_12rem_12rem_10rem_auto]">
            <label className="sr-only" htmlFor="content-search">Search {resource.label}</label>
            <input id="content-search" name="q" defaultValue={query.q} placeholder={`Search ${resource.label.toLowerCase()}…`} className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-navy-950" />
            <label className="sr-only" htmlFor="status-filter">Publication state</label>
            <select id="status-filter" name="status" defaultValue={query.status ?? ""} className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700">
              <option value="">All states</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
            </select>
            <label className="sr-only" htmlFor="sort-filter">Sort by</label>
            <select id="sort-filter" name="sort" defaultValue={query.sort ?? "updated_at"} className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700">
              <option value="updated_at">Last updated</option><option value="created_at">Created date</option><option value="published_at">Published date</option><option value="title">Title</option>
            </select>
            <label className="sr-only" htmlFor="direction-filter">Direction</label>
            <select id="direction-filter" name="direction" defaultValue={query.direction ?? "desc"} className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700">
              <option value="desc">Newest first</option><option value="asc">Oldest first</option>
            </select>
            <button className="inline-flex min-h-11 items-center justify-center rounded-xl bg-navy-950 px-5 text-sm font-extrabold text-white hover:bg-navy-800">Apply</button>
          </form>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card" aria-label={`${resource.label} records`}>
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
            <p className="text-sm font-extrabold text-navy-950">{result.count} {result.count === 1 ? resource.singular : resource.label.toLowerCase()}</p>
            <p className="text-xs font-bold text-slate-500">Page {result.page} of {result.totalPages}</p>
          </div>
          {result.records.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left">
                <thead><tr className="border-b border-slate-200 bg-slate-50/80 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-6 py-3.5">Title</th><th className="px-4 py-3.5">State</th><th className="px-4 py-3.5">Featured</th><th className="px-4 py-3.5">Updated</th><th className="px-6 py-3.5 text-right">Actions</th>
                </tr></thead>
                <tbody>
                  {result.records.map((record) => (
                    <tr key={record.id} className="border-b border-slate-100 align-top last:border-0">
                      <td className="px-6 py-4"><p className="font-extrabold text-navy-950">{record.title}</p><p className="mt-1 font-mono text-xs text-slate-500">/{record.slug}</p></td>
                      <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold capitalize ring-1 ring-inset ${statusClasses(record.status)}`}>{record.status}</span></td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-600">{record.is_featured ? "Yes" : "No"}</td>
                      <td className="px-4 py-4 text-xs font-semibold text-slate-500">{record.updated_at ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(record.updated_at)) : "—"}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          {(identity.role !== "contributor" || record.status === "draft") && <Link href={`/admin/${resource.key}/${record.id}/edit`} className="inline-flex min-h-9 items-center rounded-lg border border-slate-200 px-3 text-xs font-extrabold text-navy-900 hover:bg-slate-50">Edit</Link>}
                          <Link href={`/admin/${resource.key}/${record.id}/preview`} className="inline-flex min-h-9 items-center rounded-lg border border-slate-200 px-3 text-xs font-extrabold text-slate-600 hover:bg-slate-50">Preview</Link>
                          {record.status === "published" && resource.publicBasePath && (
                            <Link href={publicPreviewHref(resource.key, record.slug)} target="_blank" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-science-200 px-3 text-xs font-extrabold text-science-700 hover:bg-science-50">Public <Icon name="external" className="size-3" /></Link>
                          )}
                          {canPublish && record.status !== "published" && (
                            <form action={changePublicationStatusAction}><input type="hidden" name="resource" value={resource.key} /><input type="hidden" name="id" value={record.id} /><input type="hidden" name="status" value="published" /><button className="min-h-9 rounded-lg bg-teal-600 px-3 text-xs font-extrabold text-white hover:bg-teal-700">Publish</button></form>
                          )}
                          {canPublish && record.status === "published" && (
                            <form action={changePublicationStatusAction}><input type="hidden" name="resource" value={resource.key} /><input type="hidden" name="id" value={record.id} /><input type="hidden" name="status" value="draft" /><ConfirmSubmitButton message="Unpublish this record and return it to draft?" className="min-h-9 rounded-lg border border-amber-300 px-3 text-xs font-extrabold text-amber-800 hover:bg-amber-50">Unpublish</ConfirmSubmitButton></form>
                          )}
                          {canPublish && record.status !== "archived" && (
                            <form action={changePublicationStatusAction}><input type="hidden" name="resource" value={resource.key} /><input type="hidden" name="id" value={record.id} /><input type="hidden" name="status" value="archived" /><ConfirmSubmitButton message="Archive this record? It will no longer be public." className="min-h-9 rounded-lg border border-slate-300 px-3 text-xs font-extrabold text-slate-600 hover:bg-slate-50">Archive</ConfirmSubmitButton></form>
                          )}
                          {canDelete && (
                            <form action={deleteCmsRecordAction}><input type="hidden" name="resource" value={resource.key} /><input type="hidden" name="id" value={record.id} /><ConfirmSubmitButton message={`Permanently delete “${record.title}”? This cannot be undone.`} className="min-h-9 rounded-lg border border-red-200 px-3 text-xs font-extrabold text-red-700 hover:bg-red-50">Delete</ConfirmSubmitButton></form>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-16 text-center"><p className="font-display text-lg font-extrabold text-navy-950">No matching records</p><p className="mt-2 text-sm text-slate-500">Adjust the filters or create the first {resource.singular}.</p></div>
          )}
        </section>

        {result.totalPages > 1 && (
          <nav aria-label="Content pagination" className="mt-5 flex items-center justify-between gap-4">
            {result.page > 1 ? <Link href={pageHref(resource.key, query, result.page - 1)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700"><Icon name="arrow-left" className="size-4" /> Previous</Link> : <span />}
            {result.page < result.totalPages ? <Link href={pageHref(resource.key, query, result.page + 1)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700">Next <Icon name="arrow-right" className="size-4" /></Link> : <span />}
          </nav>
        )}
      </div>
    </AdminShell>
  );
}
