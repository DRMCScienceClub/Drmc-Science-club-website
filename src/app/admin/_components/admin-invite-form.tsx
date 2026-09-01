"use client";

import { useActionState } from "react";
import {
  inviteAdministratorAction,
  type InviteAdministratorFormState,
} from "@/app/admin/actions";

const initialState: InviteAdministratorFormState = {};
const inputClass = "mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-semibold text-navy-950 shadow-sm focus:border-science-500 focus:outline-none focus:ring-4 focus:ring-science-100 disabled:bg-slate-100";

export function AdminInviteForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(inviteAdministratorAction, initialState);

  return (
    <form action={action} className="mt-5 grid gap-4 lg:grid-cols-[minmax(12rem,1fr)_minmax(14rem,1.2fr)_11rem_auto] lg:items-end">
      <label className="text-sm font-extrabold text-navy-900">
        Display name
        <input name="display_name" required minLength={2} maxLength={120} autoComplete="name" className={inputClass} disabled={!configured || pending} />
        {state.fieldErrors?.display_name?.map((error) => <span key={error} className="mt-1.5 block text-xs text-red-700">{error}</span>)}
      </label>
      <label className="text-sm font-extrabold text-navy-900">
        Email address
        <input name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} disabled={!configured || pending} />
        {state.fieldErrors?.email?.map((error) => <span key={error} className="mt-1.5 block text-xs text-red-700">{error}</span>)}
      </label>
      <label className="text-sm font-extrabold text-navy-900">
        Initial role
        <select name="role" defaultValue="contributor" className={inputClass} disabled={!configured || pending}>
          <option value="contributor">Contributor</option>
          <option value="editor">Editor</option>
          <option value="super_admin">Super admin</option>
        </select>
      </label>
      <button disabled={!configured || pending} className="min-h-11 rounded-xl bg-navy-950 px-5 text-sm font-extrabold text-white transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600">
        {pending ? "Sending…" : "Send invitation"}
      </button>
      {state.message && (
        <p role={state.ok ? "status" : "alert"} className={`rounded-xl border px-4 py-3 text-sm font-bold lg:col-span-4 ${state.ok ? "border-teal-200 bg-teal-50 text-teal-900" : "border-red-200 bg-red-50 text-red-900"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
