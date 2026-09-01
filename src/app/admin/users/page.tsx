import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { AdminInviteForm } from "@/app/admin/_components/admin-invite-form";
import { ConfirmSubmitButton } from "@/app/admin/_components/confirm-submit-button";
import { NotAuthorized } from "@/app/admin/_components/not-authorized";
import {
  removeAdministratorAction,
  updateAdminProfileAction,
} from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { listAdminProfiles } from "@/lib/cms/admin-repository";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const identity = await requireAdmin("/admin/users");
  if (identity.role !== "super_admin") return <AdminShell identity={identity} active="users"><NotAuthorized /></AdminShell>;
  const profiles = await listAdminProfiles();
  const adminServiceConfigured = isSupabaseAdminConfigured();

  return (
    <AdminShell identity={identity} active="users">
      <div className="mx-auto max-w-[1180px]">
        <AdminPageHeader title="Administrators" description="Activate invited Supabase Auth accounts and assign the least privilege required. New accounts are inactive contributors until a super administrator approves them." />
        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <h2 className="font-display text-lg font-extrabold text-navy-950">Invite an administrator</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">The recipient receives a one-time email link, creates their own password, and signs in with the role selected here.</p>
          {!adminServiceConfigured && <p role="alert" className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950">Add the server-only SUPABASE_SERVICE_ROLE_KEY environment variable to enable invitations and account removal.</p>}
          <AdminInviteForm configured={adminServiceConfigured} />
        </section>
        <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="overflow-x-auto"><table className="w-full min-w-[840px] border-collapse text-left">
            <thead><tr className="border-b border-slate-200 bg-slate-50/80 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-slate-500"><th className="px-6 py-3.5">Account</th><th className="px-4 py-3.5">Display name</th><th className="px-4 py-3.5">Role</th><th className="px-4 py-3.5">Active</th><th className="px-6 py-3.5 text-right">Save</th><th className="px-6 py-3.5 text-right">Remove</th></tr></thead>
            <tbody>{profiles.map((profile) => (
              <tr key={profile.id} className="border-b border-slate-100 last:border-0"><td className="px-6 py-4"><p className="text-sm font-extrabold text-navy-950">{profile.email}</p><p className="mt-1 text-xs font-semibold text-slate-500">Created {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(profile.created_at))}</p></td><td colSpan={4} className="p-0"><form action={updateAdminProfileAction} className="grid grid-cols-[minmax(10rem,1fr)_11rem_6rem_7rem] items-center gap-3 px-4 py-4"><input type="hidden" name="id" value={profile.id} /><input name="display_name" defaultValue={profile.display_name} className="min-h-10 rounded-xl border border-slate-300 px-3 text-sm font-semibold" /><select name="role" defaultValue={profile.role} className="min-h-10 rounded-xl border border-slate-300 px-3 text-sm font-bold"><option value="contributor">Contributor</option><option value="editor">Editor</option><option value="super_admin">Super admin</option></select><label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input name="is_active" type="checkbox" defaultChecked={profile.is_active} className="size-4 accent-science-600" /> Active</label><button className="min-h-10 rounded-xl bg-navy-950 px-4 text-sm font-extrabold text-white">Save</button></form></td><td className="px-6 py-4 text-right">{profile.id === identity.id ? <span className="text-xs font-bold text-slate-400">Current account</span> : <form action={removeAdministratorAction}><input type="hidden" name="id" value={profile.id} /><ConfirmSubmitButton message={`Permanently remove ${profile.email} as an administrator? Their sign-in account and profile will be deleted, while their uploaded media and published content will be preserved.`} className="min-h-10 whitespace-nowrap rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-extrabold text-red-800 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50">Remove user</ConfirmSubmitButton></form>}</td></tr>
            ))}</tbody>
          </table></div>
        </div>
      </div>
    </AdminShell>
  );
}
