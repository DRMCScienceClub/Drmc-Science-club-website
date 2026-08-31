import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { updateMediaStatusAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { listMediaAssets } from "@/lib/cms/admin-repository";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const identity = await requireAdmin("/admin/media");
  const media = await listMediaAssets();
  const canApprove = identity.role !== "contributor";
  return (
    <AdminShell identity={identity} active="media"><div className="mx-auto max-w-[1180px]"><AdminPageHeader title="Media library" description="Track uploaded images, posters, certificates, documents, and magazine PDFs. Staging files remain private until an editor approves and promotes them." /><aside className="mt-7 rounded-2xl border border-science-200 bg-science-50 p-5 text-sm leading-7 text-science-900"><strong>Upload safety is staged.</strong> The database and Storage policies are active, but the browser upload/finalisation endpoint is the next implementation task. Until then, upload through the Supabase dashboard and create the matching metadata record only after validating type, size, rights, and alternative text. Follow <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">SUPABASE_SETUP.md</code>.</aside><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{media.map((asset) => <article key={asset.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"><div className="flex items-start justify-between gap-3"><div><p className="break-all font-extrabold text-navy-950">{asset.original_name}</p><p className="mt-1 text-xs font-semibold text-slate-500">{asset.mime_type} · {Math.ceil(Number(asset.byte_size) / 1024)} KB</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-extrabold capitalize text-slate-700">{asset.status}</span></div><p className="mt-4 break-all font-mono text-xs leading-5 text-slate-500">{asset.bucket}/{asset.object_path}</p><p className="mt-3 text-sm leading-6 text-slate-700">{asset.alt_text || "Alternative text not supplied."}</p>{canApprove && <form action={updateMediaStatusAction} className="mt-4 flex gap-2 border-t border-slate-200 pt-4"><input type="hidden" name="id" value={asset.id} /><select name="status" defaultValue={asset.status} className="min-h-10 min-w-0 flex-1 rounded-xl border border-slate-300 px-3 text-sm font-bold"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select><button className="rounded-xl bg-navy-950 px-4 text-sm font-extrabold text-white">Save</button></form>}</article>)}{!media.length && <div className="sm:col-span-2 xl:col-span-3 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-card"><p className="font-display text-lg font-extrabold text-navy-950">No media metadata yet</p><p className="mt-2 text-sm text-slate-500">Approved upload handling will populate this library.</p></div>}</div></div></AdminShell>
  );
}
