"use client";

import { useActionState } from "react";
import { Icon } from "@/components/ui/icon";
import { signInAction, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = {};

export function LoginForm({
  configured,
  returnTo,
}: {
  configured: boolean;
  returnTo: string;
}) {
  const [state, action, pending] = useActionState(signInAction, initialState);

  return (
    <form action={action} aria-describedby="login-help login-error" className="mt-7">
      <input type="hidden" name="returnTo" value={returnTo} />
      <fieldset disabled={!configured || pending} className="space-y-5">
        <legend className="sr-only">Administrator credentials</legend>

        <div>
          <label htmlFor="admin-email" className="text-sm font-extrabold text-navy-900">
            Institutional email
          </label>
          <div className="relative mt-2">
            <Icon name="mail" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input id="admin-email" name="email" type="email" autoComplete="username" required aria-invalid={Boolean(state.fieldErrors?.email)} className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-navy-950 disabled:bg-slate-100" />
          </div>
          {state.fieldErrors?.email?.map((message) => <p key={message} className="mt-1.5 text-xs font-bold text-red-700">{message}</p>)}
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="admin-password" className="text-sm font-extrabold text-navy-900">Password</label>
            <span className="text-xs font-bold text-slate-500">Invitation-only access</span>
          </div>
          <div className="relative mt-2">
            <Icon name="shield" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input id="admin-password" name="password" type="password" autoComplete="current-password" required aria-invalid={Boolean(state.fieldErrors?.password)} className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-navy-950 disabled:bg-slate-100" />
          </div>
          {state.fieldErrors?.password?.map((message) => <p key={message} className="mt-1.5 text-xs font-bold text-red-700">{message}</p>)}
        </div>

        <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy-950 px-5 text-sm font-extrabold text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600">
          {pending ? "Signing in…" : configured ? "Sign in securely" : "Supabase setup required"}
          {!pending && <Icon name="arrow-right" className="size-4" />}
        </button>
      </fieldset>

      {state.error && <p id="login-error" role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-900">{state.error}</p>}
    </form>
  );
}
