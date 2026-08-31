import Image from "next/image";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { CopyMediaUrlButton } from "@/app/admin/_components/copy-media-url-button";
import { MediaUploadForm } from "@/app/admin/_components/media-upload-form";
import { updateMediaStatusAction } from "@/app/admin/actions";
import { Icon } from "@/components/ui/icon";
import { requireAdmin } from "@/lib/auth";
import { listMediaAssets } from "@/lib/cms/admin-repository";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const identity = await requireAdmin("/admin/media");
  const media = await listMediaAssets();
  const canApprove = identity.role !== "contributor";

  return (
    <AdminShell identity={identity} active="media">
      <div className="mx-auto max-w-[1280px]">
        <AdminPageHeader
          eyebrow="Content assets"
          title="Media library"
          description="Upload sponsor logos, festival artwork, achievement photographs, magazine covers, and approved PDF documents."
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
            <h2 className="font-display text-2xl font-extrabold text-navy-950">Uploaded assets</h2>
            <p className="mt-1 text-sm text-slate-500">Published image URLs become available in the festival sponsor and partner editor.</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-600">{media.length} assets</span>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {media.map((asset) => (
            <article key={asset.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
              <div className="relative grid aspect-video place-items-center overflow-hidden bg-slate-100">
                {asset.preview_url && asset.mime_type.startsWith("image/") ? (
                  <Image src={asset.preview_url} alt={asset.alt_text} fill sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 100vw" className="object-contain p-4" />
                ) : (
                  <div className="text-center"><Icon name={asset.mime_type === "application/pdf" ? "book" : "download"} className="mx-auto size-9 text-slate-300" /><p className="mt-2 text-xs font-bold text-slate-400">Preview unavailable</p></div>
                )}
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.08em] ${asset.status === "published" ? "bg-teal-100 text-teal-800" : asset.status === "archived" ? "bg-slate-200 text-slate-700" : "bg-amber-100 text-amber-800"}`}>{asset.status}</span>
              </div>

              <div className="p-5">
                <p className="break-all font-extrabold text-navy-950">{asset.original_name}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{asset.mime_type} · {Math.ceil(Number(asset.byte_size) / 1024)} KB{asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ""}</p>
                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-700">{asset.alt_text || "Alternative text not supplied."}</p>
                {asset.credit && <p className="mt-2 text-xs font-semibold text-slate-500">Credit: {asset.credit}</p>}

                {asset.status === "published" && asset.public_url && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                    <CopyMediaUrlButton url={asset.public_url} />
                    <a href={asset.public_url} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-extrabold text-science-700 hover:bg-science-50">Open <Icon name="external" className="size-3.5" /></a>
                  </div>
                )}

                {canApprove && (
                  <form action={updateMediaStatusAction} className="mt-4 flex gap-2 border-t border-slate-200 pt-4">
                    <input type="hidden" name="id" value={asset.id} />
                    <select name="status" defaultValue={asset.status} className="min-h-10 min-w-0 flex-1 rounded-xl border border-slate-300 px-3 text-sm font-bold">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button className="rounded-xl bg-navy-950 px-4 text-sm font-extrabold text-white hover:bg-navy-800">Save</button>
                  </form>
                )}
              </div>
            </article>
          ))}

          {!media.length && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-card sm:col-span-2 xl:col-span-3">
              <Icon name="download" className="mx-auto size-10 text-slate-300" />
              <p className="mt-4 font-display text-lg font-extrabold text-navy-950">No uploaded media yet</p>
              <p className="mt-2 text-sm text-slate-500">Use the upload form above to add the first sponsor logo or festival image.</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
