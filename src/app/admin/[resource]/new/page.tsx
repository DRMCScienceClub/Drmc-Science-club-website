import { notFound } from "next/navigation";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { CmsEditorForm } from "@/app/admin/_components/cms-editor-form";
import { requireAdmin } from "@/lib/auth";
import { getCmsResource } from "@/lib/cms/resources";

export const dynamic = "force-dynamic";

export default async function NewCmsRecordPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource: resourceKey } = await params;
  const resource = getCmsResource(resourceKey);
  if (!resource) notFound();
  const identity = await requireAdmin(`/admin/${resource.key}/new`);

  return (
    <AdminShell identity={identity} active={resource.key}>
      <div className="mx-auto max-w-[1380px]">
        <AdminPageHeader eyebrow={resource.label} title={`Create ${resource.singular}`} description="Start with the verified essentials, keep unconfirmed details out, and save as a draft until the record is ready for publication." />
        <CmsEditorForm resource={resource} record={null} role={identity.role} />
      </div>
    </AdminShell>
  );
}
