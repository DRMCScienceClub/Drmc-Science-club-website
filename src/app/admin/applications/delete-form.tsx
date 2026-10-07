"use client";

import { useActionState } from "react";
import { ConfirmSubmitButton } from "@/app/admin/_components/confirm-submit-button";
import { deleteApplication } from "./actions";

export function ApplicationDeleteForm({ id, reference }: { id: string; reference: string }) {
  const [state, action, pending] = useActionState(deleteApplication, {});
  return <form action={action} className="mt-8 border-t border-slate-200 pt-6">
    <input type="hidden" name="id" value={id} />
    <h3 className="text-sm font-extrabold text-red-800">Delete application</h3>
    <p className="mt-2 text-sm leading-6 text-slate-600">Permanently remove this application and its private student details. This cannot be undone.</p>
    {state.message && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{state.message}</p>}
    <ConfirmSubmitButton disabled={pending} message={`Permanently delete application ${reference}? This cannot be undone.`} className="mt-4 min-h-11 rounded-xl border border-red-300 bg-red-50 px-5 font-bold text-red-800 hover:bg-red-100 disabled:opacity-50">
      {pending ? "Deleting…" : "Delete application"}
    </ConfirmSubmitButton>
  </form>;
}
