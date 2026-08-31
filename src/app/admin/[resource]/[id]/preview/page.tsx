import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { Icon } from "@/components/ui/icon";
import { requireAdmin } from "@/lib/auth";
import { getCmsRecord } from "@/lib/cms/admin-repository";
import { getCmsResource } from "@/lib/cms/resources";

export const dynamic = "force-dynamic";

function imageFrom(record: Record<string, unknown>) {
  if (typeof record.cover_image_url === "string" && record.cover_image_url) return record.cover_image_url;
  const data = record.data && typeof record.data === "object" ? record.data as Record<string, unknown> : {};
  for (const key of ["coverImage", "image", "groupImage"]) {
    const image = data[key];
    if (image && typeof image === "object" && typeof (image as Record<string, unknown>).src === "string") return (image as Record<string, unknown>).src as string;
  }
  return null;
}

function OrganizationPreview({ data, title }: { data: Record<string, unknown>; title: string }) {
  const items = data[title.toLowerCase()];
  if (!Array.isArray(items) || !items.length) return null;
  return (
    <section className="mt-8">
      <h3 className="font-display text-xl font-extrabold text-navy-950">{title}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const organization = item && typeof item === "object" ? item as Record<string, unknown> : {};
          const logo = organization.logo && typeof organization.logo === "object" ? organization.logo as Record<string, unknown> : null;
          const src = typeof logo?.src === "string" ? logo.src : null;
          return (
            <article key={`${String(organization.name)}-${index}`} className="flex min-h-28 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-50">
                {src?.startsWith("/") ? <Image src={src} alt={String(logo?.alt ?? `${organization.name} logo`)} fill sizes="64px" className="object-contain p-2" /> : <Icon name="globe" className="text-slate-400" />}
              </div>
              <div className="min-w-0"><p className="font-extrabold text-navy-950">{String(organization.name ?? "Unnamed organization")}</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-science-700">{String(organization.role ?? title.slice(0, -1))}</p></div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default async function CmsPreviewPage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource: resourceKey, id } = await params;
  const resource = getCmsResource(resourceKey);
  if (!resource || !z.uuid().safeParse(id).success) notFound();
  const identity = await requireAdmin(`/admin/${resource.key}/${id}/preview`);
  const record = await getCmsRecord(resource, id);
  if (!record) notFound();
  const data = record.data && typeof record.data === "object" ? record.data : {};
  const image = imageFrom(record);

  return (
    <AdminShell identity={identity} active={resource.key}>
      <div className="mx-auto max-w-[1180px]">
        <AdminPageHeader eyebrow="Private preview" title={record.title} description="This preview is protected and may include draft content. It is not a public URL and does not bypass publication rules." />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/admin/${resource.key}/${record.id}/edit`} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-navy-950 px-4 text-sm font-extrabold text-white"><Icon name="arrow-left" className="size-4" /> Return to editor</Link>
          <span className="inline-flex min-h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-600">{record.status}</span>
        </div>

        <article className="mt-7 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[#f8fbfc] shadow-soft">
          {image && (
            <div className="relative min-h-64 overflow-hidden bg-navy-950 sm:min-h-96">
              {image.startsWith("/") ? <Image src={image} alt="" fill sizes="(max-width: 1180px) 100vw, 1180px" className="object-cover opacity-80" priority /> : <div className="grid min-h-96 place-items-center px-6 text-center text-sm font-bold text-slate-300">Remote media preview becomes available after its Supabase Storage host is configured.</div>}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal-300">{resource.singular}</p><h2 className="mt-3 max-w-4xl font-display text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">{record.title}</h2></div>
            </div>
          )}
          <div className="p-6 sm:p-9">
            <p className="max-w-4xl text-base leading-8 text-slate-700">{String(record.summary ?? (data as Record<string, unknown>).summary ?? "No summary has been added yet.")}</p>
            <OrganizationPreview data={data as Record<string, unknown>} title="Sponsors" />
            <OrganizationPreview data={data as Record<string, unknown>} title="Partners" />
            <details className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer text-sm font-extrabold text-navy-950">Inspect complete structured record</summary>
              <pre className="mt-4 max-h-[34rem] overflow-auto whitespace-pre-wrap rounded-xl bg-navy-950 p-4 text-xs leading-6 text-slate-200">{JSON.stringify(data, null, 2)}</pre>
            </details>
          </div>
        </article>
      </div>
    </AdminShell>
  );
}
