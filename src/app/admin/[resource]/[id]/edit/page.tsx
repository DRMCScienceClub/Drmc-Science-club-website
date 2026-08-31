import { notFound } from "next/navigation";
import { z } from "zod";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { CmsEditorForm } from "@/app/admin/_components/cms-editor-form";
import { NotAuthorized } from "@/app/admin/_components/not-authorized";
import { requireAdmin } from "@/lib/auth";
import { getCmsRecord, listPublishedMediaChoices } from "@/lib/cms/admin-repository";
import { getCmsResource } from "@/lib/cms/resources";

export const dynamic = "force-dynamic";

export default async function EditCmsRecordPage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource: resourceKey, id } = await params;
  const resource = getCmsResource(resourceKey);
  if (!resource || !z.uuid().safeParse(id).success) notFound();
  const identity = await requireAdmin(`/admin/${resource.key}/${id}/edit`);
  const [record, media] = await Promise.all([
    getCmsRecord(resource, id),
    listPublishedMediaChoices(),
  ]);
  if (!record) notFound();

  if (identity.role === "contributor" && record.status !== "draft") {
    return <AdminShell identity={identity} active={resource.key}><NotAuthorized title="Published records are read-only for contributors." description="You can preview this record, but an editor or super administrator must unpublish it before further editorial changes." /></AdminShell>;
  }

  return (
    <AdminShell identity={identity} active={resource.key}>
      <div className="mx-auto max-w-[1380px]">
        <AdminPageHeader eyebrow={resource.label} title={`Edit ${resource.singular}`} description={`Update “${record.title}”. Existing structured data is preserved unless you deliberately edit its advanced JSON fields.`} />
        <CmsEditorForm resource={resource} record={record} role={identity.role} media={media} />
      </div>
    </AdminShell>
  );
}
