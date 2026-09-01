"use client";

import { useActionState } from "react";
import {
  setInvitedAdministratorPasswordAction,
  type SetPasswordFormState,
} from "@/app/auth/set-password/actions";

const initialState: SetPasswordFormState = {};
const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-navy-950 shadow-sm focus:border-science-500 focus:outline-none focus:ring-4 focus:ring-science-100 disabled:bg-slate-100";

export function SetPasswordForm() {
  const [state, action, pending] = useActionState(setInvitedAdministratorPasswordAction, initialState);

  return (
    <form action={action} className="mt-7 space-y-5">
      <label className="block text-sm font-extrabold text-navy-900">
        Create password
        <input name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" className={inputClass} disabled={pending} />
        <span className="mt-1.5 block text-xs font-normal leading-5 text-slate-500">Use at least 12 characters and a password you do not use elsewhere.</span>
        {state.fieldErrors?.password?.map((error) => <span key={error} className="mt-1.5 block text-xs text-red-700">{error}</span>)}
      </label>
      <label className="block text-sm font-extrabold text-navy-900">
        Confirm password
        <input name="confirm_password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" className={inputClass} disabled={pending} />
        {state.fieldErrors?.confirm_password?.map((error) => <span key={error} className="mt-1.5 block text-xs text-red-700">{error}</span>)}
      </label>
      {state.message && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-900">{state.message}</p>}
      <button disabled={pending} className="min-h-12 w-full rounded-xl bg-navy-950 px-5 text-sm font-extrabold text-white transition hover:bg-navy-800 disabled:cursor-wait disabled:bg-slate-400">
        {pending ? "Saving password…" : "Save password and continue"}
      </button>
    </form>
  );
}
