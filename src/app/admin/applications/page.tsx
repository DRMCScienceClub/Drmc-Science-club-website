import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { requireAdmin } from "@/lib/auth";
import { NotAuthorized } from "@/app/admin/_components/not-authorized";
import { listApplications } from "@/lib/membership/repository";
import { ApplicationsList } from "./application-list";

export const dynamic = "force-dynamic";
export default async function ApplicationsPage() {
  const identity = await requireAdmin("/admin/applications");
  if (identity.role === "contributor") return <AdminShell identity={identity} active="applications"><NotAuthorized /></AdminShell>;
  const result = await listApplications();
  return <AdminShell identity={identity} active="applications"><div className="mx-auto max-w-[1280px]"><AdminPageHeader title="Membership Applications" description="Private DRMC Science Club applications. Review student interests, update statuses, and keep follow-up notes." /><ApplicationsList initial={result} /></div></AdminShell>;
}
