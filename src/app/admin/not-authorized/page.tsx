import { AdminShell } from "@/app/admin/_components/admin-shell";
import { NotAuthorized } from "@/app/admin/_components/not-authorized";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NotAuthorizedPage() {
  const identity = await requireAdmin("/admin/not-authorized");
  return <AdminShell identity={identity}><NotAuthorized /></AdminShell>;
}
