"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitApplication } from "@/app/(public)/membership-actions";
import { applicationClasses, applicationInterests, applicationShifts, type ApplicationState } from "@/lib/membership/schema";

const inputClass = "mt-2 min-h-12 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-navy-950 focus:outline-none focus:ring-4 focus:ring-science-100 focus:border-science-500";

function ApplicationField({ name, label, state, required = false, maxLength = 120, type = "text", options, multiline = false, autoComplete }: {
  name: string; label: string; state: ApplicationState; required?: boolean; maxLength?: number; type?: string; options?: readonly string[]; multiline?: boolean; autoComplete?: string;
}) {
  const error = state.fieldErrors?.[name];
  const props = { id: `application-${name}`, name, required, "aria-invalid": Boolean(error), "aria-describedby": error ? `application-${name}-error` : undefined, className: inputClass, defaultValue: state.values?.[name] ?? "" };
  return <div className="min-w-0"><label htmlFor={props.id} className="text-sm font-bold text-navy-950">{label}{required && " *"}</label>
    {options ? <select {...props}><option value="">Select…</option>{options.map((option) => <option key={option}>{option}</option>)}</select> : multiline ? <textarea {...props} rows={4} maxLength={maxLength} /> : <input {...props} type={type} maxLength={maxLength} autoComplete={autoComplete} />}
    {multiline && <p className="mt-1 text-xs text-slate-500">Maximum {maxLength} characters.</p>}
    {error && <p id={`application-${name}-error`} className="mt-2 text-sm text-red-700">{error.join(" ")}</p>}
  </div>;
}

export function MembershipForm() {
  const [state, action, pending] = useActionState(submitApplication, {});
  const [interests, setInterests] = useState<string[]>([]);
  const statusRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (state.message || state.success) statusRef.current?.focus(); }, [state]);
  if (state.success) return <div ref={statusRef} tabIndex={-1} role="status" className="rounded-2xl border border-teal-200 bg-teal-50 p-6 text-teal-950"><h3 className="text-xl font-extrabold">Application submitted successfully!</h3><p className="mt-3 leading-7">Thank you for your interest in DRMC Science Club. Your application has been received and may be reviewed by the club team.</p>{state.reference && <p className="mt-4 font-bold">Application reference: {state.reference}</p>}</div>;
  return <form action={action} noValidate className="relative space-y-6 sm:space-y-8" aria-busy={pending}>
    <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label>Website<input name="membership_website" tabIndex={-1} autoComplete="off" /></label></div>
    <fieldset disabled={pending} className="min-w-0"><legend className="mb-4 text-xl font-extrabold text-navy-950 sm:mb-5">Student information</legend><div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
      <ApplicationField name="full_name" label="Full name" required state={state} autoComplete="name" />
      <ApplicationField name="college_id" label="College ID / College roll" required maxLength={40} state={state} />
      <ApplicationField name="academic_class" label="Class" required options={applicationClasses} state={state} />
      <ApplicationField name="section" label="Section" required maxLength={20} state={state} />
      <ApplicationField name="shift" label="Shift" required options={applicationShifts} state={state} />
      <ApplicationField name="email" label="Email (optional)" type="email" maxLength={254} state={state} autoComplete="email" />
      <ApplicationField name="phone" label="Phone number (optional)" type="tel" maxLength={30} state={state} autoComplete="tel" />
    </div></fieldset>
    <fieldset disabled={pending} aria-describedby="application-interests-error" className="min-w-0 border-t border-slate-200 pt-5 sm:pt-6"><legend className="text-xl font-extrabold text-navy-950">Areas of interest *</legend><div className="grid gap-2 sm:grid-cols-2 sm:gap-3">{applicationInterests.map((interest) => <label key={interest} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-semibold sm:p-3"><input type="checkbox" name="areas_of_interest" value={interest} checked={interests.includes(interest)} onChange={(event) => setInterests(event.target.checked ? [...interests, interest] : interests.filter((item) => item !== interest))} className="size-4 shrink-0 accent-teal-700" />{interest}</label>)}</div><p id="application-interests-error" className="mt-2 text-sm text-red-700">{state.fieldErrors?.areas_of_interest?.join(" ")}</p>
      {interests.includes("Other") ? <ApplicationField name="other_interest" label="Other area of interest" required maxLength={160} state={state} /> : <input type="hidden" name="other_interest" value="" />}
    </fieldset>
    <fieldset disabled={pending} className="min-w-0 space-y-4 border-t border-slate-200 pt-5 sm:space-y-5 sm:pt-6"><legend className="text-xl font-extrabold text-navy-950">Your interest in the club</legend>
      <ApplicationField name="reason_for_joining" label="Why do you want to join DRMC Science Club?" required multiline maxLength={1000} state={state} />
      <p className="text-sm leading-6 text-slate-600">Previous achievements are not required. If you wish, tell us about competitions, projects, research, programming, quizzing, volunteering, or event organization.</p>
      <ApplicationField name="previous_experience" label="Previous experience or achievements (optional)" multiline maxLength={1000} state={state} />
      <ApplicationField name="contribution_interest" label="How would you like to contribute to DRMC Science Club? (optional)" multiline maxLength={1000} state={state} />
    </fieldset>
    <div className="rounded-xl border border-science-200 bg-science-50 p-4"><label className="flex items-start gap-3 text-sm font-semibold leading-6"><input name="acknowledgement" type="checkbox" required disabled={pending} aria-invalid={Boolean(state.fieldErrors?.acknowledgement)} aria-describedby="application-ack-error" className="mt-1 size-4 shrink-0 accent-teal-700" /><span>I confirm that the information provided in this application is accurate.</span></label><p id="application-ack-error" className="mt-2 text-sm text-red-700">{state.fieldErrors?.acknowledgement?.join(" ")}</p><p className="mt-3 text-sm leading-6 text-slate-600">Submitting this form does not automatically confirm membership. Applications may be reviewed by DRMC Science Club before further instructions are provided.</p></div>
    {state.message && <div ref={statusRef} tabIndex={-1} role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">{state.message}</div>}
    <button disabled={pending} className="min-h-12 rounded-xl bg-navy-950 px-6 text-sm font-extrabold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:opacity-60">{pending ? "Submitting application…" : "Submit Application"}</button>
    <p className="text-xs leading-5 text-slate-500">Your application is private and accessible only to authorised club reviewers.</p>
  </form>;
}
