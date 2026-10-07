"use client";
import { useActionState } from "react";
import { reviewApplication } from "./actions";
import { applicationStatuses, statusLabels } from "@/lib/membership/schema";

export function ApplicationReviewForm({ id, status, notes }: { id: string; status: string; notes: string }) {
  const [state, action, pending] = useActionState(reviewApplication, {});
  return <form action={action} className="mt-6 grid gap-5"><input type="hidden" name="id" value={id} /><label className="grid gap-2 text-sm font-bold">Application status<select name="status" defaultValue={status} className="min-h-11 rounded-xl border border-slate-300 bg-white px-3">{applicationStatuses.map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select></label><label className="grid gap-2 text-sm font-bold">Private admin notes<textarea name="admin_notes" defaultValue={notes} maxLength={5000} rows={6} className="rounded-xl border border-slate-300 p-3" /><span className="text-xs font-normal text-slate-500">Only authorised reviewers can see these notes. Maximum 5,000 characters.</span></label>{state.message && <p role={state.success ? "status" : "alert"}>{state.message}</p>}<button disabled={pending} className="min-h-11 rounded-xl bg-navy-950 px-5 font-bold text-white disabled:opacity-50">{pending ? "Saving…" : "Save review"}</button></form>;
}
