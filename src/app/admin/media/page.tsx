import Image from "next/image";
import Link from "next/link";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { CopyMediaUrlButton } from "@/app/admin/_components/copy-media-url-button";
import { MediaUploadForm } from "@/app/admin/_components/media-upload-form";
import { updateMediaMetadataAction, updateMediaStatusAction } from "@/app/admin/actions";
import { Icon } from "@/components/ui/icon";
import { requireAdmin } from "@/lib/auth";
import { listMediaAssets } from "@/lib/cms/admin-repository";

export const dynamic = "force-dynamic";

type MediaPageQuery = {
  q?: string;
  status?: string;
  kind?: string;
  page?: string;
};

function mediaPageHref(query: MediaPageQuery, page: number) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.status) params.set("status", query.status);
  if (query.kind) params.set("kind", query.kind);
  params.set("page", String(page));
  return `/admin/media?${params.toString()}`;
}

function statusClass(status: string) {
  if (status === "published") return "bg-teal-100 text-teal-800";
  if (status === "archived") return "bg-slate-200 text-slate-700";
  return "bg-amber-100 text-amber-800";
}

export default async function MediaPage({ searchParams }: { searchParams: Promise<MediaPageQuery> }) {
  const identity = await requireAdmin("/admin/media");
  const query = await searchParams;
  const parsedPage = Number.parseInt(query.page ?? "1", 10);
  const media = await listMediaAssets({
    page: Number.isFinite(parsedPage) ? parsedPage : 1,
    pageSize: 25,
    search: query.q,
    status: query.status,
    kind: query.kind,
  });
  const canApprove = identity.role !== "contributor";
  const firstRecord = media.count ? (media.page - 1) * media.pageSize + 1 : 0;
  const lastRecord = Math.min(media.page * media.pageSize, media.count);

  return (
    <AdminShell identity={identity} active="media">
      <div className="mx-auto max-w-[1280px]">
        <AdminPageHeader
          eyebrow="Content assets"
          title="Media library"
          description="Upload, find, review, and publish the club’s approved images and documents."
        />

        <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-7" aria-labelledby="media-upload-heading">
          <div className="mb-6 border-b border-slate-200 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="media-upload-heading" className="font-display text-xl font-extrabold text-navy-950">Add new media</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">Files are signature-checked and uploaded privately. Publish only after checking rights, accuracy, and alternative text.</p>
              </div>
              <span className="rounded-full bg-science-50 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.1em] text-science-700">Secure staging</span>
            </div>
          </div>
          <MediaUploadForm />
        </section>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-navy-950">Asset archive</h2>
            <p className="mt-1 text-sm text-slate-500">Search the complete library. Only the current page is loaded, so the archive stays fast as it grows.</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-600">{media.count} total assets</span>
        </div>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5" aria-label="Media filters">
          <form className="grid gap-3 lg:grid-cols-[minmax(14rem,1fr)_11rem_11rem_auto_auto]">
            <label className="sr-only" htmlFor="media-search">Search media</label>
            <input id="media-search" name="q" defaultValue={query.q} placeholder="Search filename, description, caption, or credit…" className="min-h-11 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-navy-950" />
            <AdminSelect name="status" label="Publication state" defaultValue={query.status ?? ""} options={[{ value: "", label: "All states" }, { value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }]} />
            <AdminSelect name="kind" label="File type" defaultValue={query.kind ?? ""} options={[{ value: "", label: "All file types" }, { value: "images", label: "Images" }, { value: "documents", label: "PDF documents" }]} />
            <button className="min-h-11 rounded-xl bg-navy-950 px-5 text-sm font-extrabold text-white hover:bg-navy-800">Apply filters</button>
            <Link href="/admin/media" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-extrabold text-slate-600 hover:bg-slate-50">Clear</Link>
          </form>
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card" aria-label="Uploaded media assets">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-5 py-3.5">
            <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-600">Showing {firstRecord}–{lastRecord} of {media.count}</p>
            <p className="text-xs font-bold text-slate-500">Page {media.page} of {media.totalPages}</p>
          </div>

          {media.records.length ? (
            <div className="max-h-[54rem] divide-y divide-slate-200 overflow-y-auto overscroll-contain" tabIndex={media.records.length > 5 ? 0 : undefined}>
              {media.records.map((asset) => {
                const editable = identity.role !== "contributor" || (asset.uploaded_by === identity.id && asset.bucket === "cms-staging" && asset.status === "draft");
                return (
                  <article key={asset.id} className="p-4 transition hover:bg-slate-50/60 sm:p-5">
                    <div className="grid items-start gap-4 sm:grid-cols-[6rem_minmax(0,1fr)] lg:grid-cols-[6rem_minmax(0,1fr)_auto]">
                      <a href={asset.preview_url ?? undefined} target="_blank" rel="noreferrer" className={`relative grid aspect-square place-items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ${asset.preview_url ? "cursor-zoom-in" : "pointer-events-none"}`}>
                        {asset.preview_url && asset.mime_type.startsWith("image/") ? (
                          <Image src={asset.preview_url} alt={asset.alt_text} fill sizes="96px" className="object-contain p-2" />
                        ) : (
                          <Icon name={asset.mime_type === "application/pdf" ? "book" : "download"} className="size-8 text-slate-300" />
                        )}
                      </a>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="break-all text-sm font-extrabold text-navy-950">{asset.original_name}</h3>
                          <span className={`rounded-full px-2.5 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.08em] ${statusClass(asset.status)}`}>{asset.status}</span>
                        </div>
                        <p className="mt-1 text-xs font-semibold text-slate-500">{asset.mime_type} · {Math.ceil(Number(asset.byte_size) / 1024)} KB{asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ""} · Added {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(asset.created_at))}</p>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">{asset.alt_text || "Alternative text not supplied."}</p>
                        {asset.credit && <p className="mt-1 text-xs font-semibold text-slate-500">Credit: {asset.credit}</p>}
                      </div>

                      <div className="flex flex-wrap gap-2 sm:col-start-2 lg:col-start-3 lg:row-start-1 lg:max-w-56 lg:justify-end">
                        {asset.status === "published" && asset.public_url && <CopyMediaUrlButton url={asset.public_url} />}
                        {asset.public_url && <a href={asset.public_url} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-extrabold text-science-700 hover:bg-science-50">Open <Icon name="external" className="size-3.5" /></a>}
                        {canApprove && (
                          <form action={updateMediaStatusAction} className="flex gap-2">
                            <input type="hidden" name="id" value={asset.id} />
                            <select name="status" defaultValue={asset.status} aria-label={`Status for ${asset.original_name}`} className="min-h-9 rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold">
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                              <option value="archived">Archived</option>
                            </select>
                            <button className="min-h-9 rounded-lg bg-navy-950 px-3 text-xs font-extrabold text-white hover:bg-navy-800">Save</button>
                          </form>
                        )}
                      </div>
                    </div>

                    {editable && (
                      <details className="group mt-4 overflow-hidden rounded-xl border border-slate-200 sm:ml-[7rem]">
                        <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 bg-white px-3.5 text-xs font-extrabold text-navy-900 transition hover:bg-slate-100">
                          Edit asset details
                          <span aria-hidden className="text-base text-science-600 transition-transform group-open:rotate-45">+</span>
                        </summary>
                        <form action={updateMediaMetadataAction} className="grid gap-3 border-t border-slate-200 bg-white p-4 md:grid-cols-2">
                          <input type="hidden" name="id" value={asset.id} />
                          <label className="grid gap-1.5 text-xs font-extrabold text-navy-900">Display filename<input name="original_name" required maxLength={180} defaultValue={asset.original_name} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm font-semibold" /></label>
                          <label className="grid gap-1.5 text-xs font-extrabold text-navy-900">Credit/source<input name="credit" maxLength={240} defaultValue={asset.credit} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm font-semibold" /></label>
                          <label className="grid gap-1.5 text-xs font-extrabold text-navy-900">{asset.mime_type.startsWith("image/") ? "Alternative text" : "Document description"}<textarea name="alt_text" required={asset.mime_type.startsWith("image/")} maxLength={240} rows={3} defaultValue={asset.alt_text} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold leading-5" /></label>
                          <label className="grid gap-1.5 text-xs font-extrabold text-navy-900">Caption<textarea name="caption" maxLength={500} rows={3} defaultValue={asset.caption} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold leading-5" /></label>
                          <button className="min-h-10 rounded-lg bg-science-700 px-4 text-xs font-extrabold text-white transition hover:bg-science-800 md:col-span-2">Save asset details</button>
                        </form>
                      </details>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <Icon name="download" className="mx-auto size-10 text-slate-300" />
              <p className="mt-4 font-display text-lg font-extrabold text-navy-950">No matching media</p>
              <p className="mt-2 text-sm text-slate-500">Clear the filters or upload a new asset.</p>
            </div>
          )}
        </section>

        {media.totalPages > 1 && (
          <nav aria-label="Media pagination" className="mt-5 flex items-center justify-between gap-4">
            {media.page > 1 ? <Link href={mediaPageHref(query, media.page - 1)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"><Icon name="arrow-left" className="size-4" /> Previous</Link> : <span />}
            <span className="text-xs font-bold text-slate-500">25 assets per page</span>
            {media.page < media.totalPages ? <Link href={mediaPageHref(query, media.page + 1)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">Next <Icon name="arrow-right" className="size-4" /></Link> : <span />}
          </nav>
        )}
      </div>
    </AdminShell>
  );
}
import { AdminSelect } from "@/app/admin/_components/admin-select";
