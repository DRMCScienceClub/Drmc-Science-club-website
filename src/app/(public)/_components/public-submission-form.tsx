"use client";

import { useActionState, useEffect, useRef } from "react";
import { Icon } from "@/components/ui/icon";
import {
  submitContactAction,
  submitJoinAction,
  type PublicFormState,
} from "@/app/(public)/submission-actions";

const initialState: PublicFormState = {};
const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-navy-950 shadow-sm focus:border-science-500 focus:outline-none focus:ring-4 focus:ring-science-100";

function ErrorList({ errors }: { errors?: string[] }) {
  return errors?.map((error) => <p key={error} className="mt-1.5 text-xs font-bold text-red-700">{error}</p>);
}

function FormStatus({ state }: { state: PublicFormState }) {
  if (!state.message) return null;
  return <p role={state.success ? "status" : "alert"} className={`rounded-xl border px-4 py-3 text-sm font-bold leading-6 ${state.success ? "border-teal-200 bg-teal-50 text-teal-900" : "border-red-200 bg-red-50 text-red-900"}`}>{state.message}</p>;
}

function Honeypot() {
  return <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>;
}

export function ContactSubmissionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(submitContactAction, initialState);
  useEffect(() => { if (state.success) formRef.current?.reset(); }, [state.success]);

  return (
    <form ref={formRef} action={action} className="relative grid gap-5" noValidate>
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-extrabold text-navy-900">Full name<span className="text-red-600"> *</span><input name="name" autoComplete="name" required maxLength={120} aria-invalid={Boolean(state.fieldErrors?.name)} className={inputClass} /><ErrorList errors={state.fieldErrors?.name} /></label>
        <label className="text-sm font-extrabold text-navy-900">Email address<span className="text-red-600"> *</span><input name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={Boolean(state.fieldErrors?.email)} className={inputClass} /><ErrorList errors={state.fieldErrors?.email} /></label>
      </div>
      <label className="text-sm font-extrabold text-navy-900">Subject<span className="text-red-600"> *</span><input name="subject" required maxLength={180} aria-invalid={Boolean(state.fieldErrors?.subject)} className={inputClass} /><ErrorList errors={state.fieldErrors?.subject} /></label>
      <label className="text-sm font-extrabold text-navy-900">Message<span className="text-red-600"> *</span><textarea name="message" required minLength={10} maxLength={5000} rows={6} aria-invalid={Boolean(state.fieldErrors?.message)} className={`${inputClass} py-3`} /><ErrorList errors={state.fieldErrors?.message} /></label>
      <FormStatus state={state} />
      <button disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-navy-950 px-6 text-sm font-extrabold text-white hover:bg-navy-800 disabled:cursor-wait disabled:bg-slate-400 sm:justify-self-start">{pending ? "Sending securely…" : "Send message"}<Icon name="arrow-right" className="size-4" /></button>
      <p className="text-xs leading-5 text-slate-500">Your message is stored privately and is visible only to authorised club administrators.</p>
    </form>
  );
}

const interests = ["Academic & research", "Innovation & robotics", "Events & outreach", "Writing & design"];

export function JoinSubmissionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(submitJoinAction, initialState);
  useEffect(() => { if (state.success) formRef.current?.reset(); }, [state.success]);

  return (
    <form ref={formRef} action={action} className="relative grid gap-5" noValidate>
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-extrabold text-navy-900">Full name<span className="text-red-600"> *</span><input name="name" autoComplete="name" required maxLength={120} aria-invalid={Boolean(state.fieldErrors?.name)} className={inputClass} /><ErrorList errors={state.fieldErrors?.name} /></label>
        <label className="text-sm font-extrabold text-navy-900">Email address<span className="text-red-600"> *</span><input name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={Boolean(state.fieldErrors?.email)} className={inputClass} /><ErrorList errors={state.fieldErrors?.email} /></label>
        <label className="text-sm font-extrabold text-navy-900">Phone number<input name="phone" type="tel" autoComplete="tel" maxLength={40} className={inputClass} /></label>
        <label className="text-sm font-extrabold text-navy-900">Current class<span className="text-red-600"> *</span><select name="academic_class" required defaultValue="" aria-invalid={Boolean(state.fieldErrors?.academicClass)} className={inputClass}><option value="" disabled>Select class</option>{Array.from({ length: 12 }, (_, index) => index + 1).map((value) => <option key={value} value={`Class ${value}`}>Class {value}</option>)}</select><ErrorList errors={state.fieldErrors?.academicClass} /></label>
      </div>
      <fieldset><legend className="text-sm font-extrabold text-navy-900">Areas of interest<span className="text-red-600"> *</span></legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{interests.map((interest) => <label key={interest} className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700"><input name="interests" type="checkbox" value={interest} className="size-4 accent-science-600" />{interest}</label>)}</div><ErrorList errors={state.fieldErrors?.interests} /></fieldset>
      <label className="text-sm font-extrabold text-navy-900">Why would you like to join?<span className="text-red-600"> *</span><textarea name="motivation" required minLength={10} maxLength={5000} rows={6} aria-invalid={Boolean(state.fieldErrors?.motivation)} className={`${inputClass} py-3`} /><ErrorList errors={state.fieldErrors?.motivation} /></label>
      <label className="flex items-start gap-3 rounded-xl border border-science-200 bg-science-50 p-4 text-sm font-semibold leading-6 text-slate-700"><input name="consent" type="checkbox" required className="mt-1 size-4 shrink-0 accent-science-600" /><span>I consent to DRMC Science Club storing these details to review and respond to my membership interest.</span></label><ErrorList errors={state.fieldErrors?.consent} />
      <FormStatus state={state} />
      <button disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-navy-950 px-6 text-sm font-extrabold text-white hover:bg-navy-800 disabled:cursor-wait disabled:bg-slate-400 sm:justify-self-start">{pending ? "Submitting securely…" : "Submit interest"}<Icon name="arrow-right" className="size-4" /></button>
      <p className="text-xs leading-5 text-slate-500">Submitting this form does not guarantee membership. Club authorities will review applications during an approved intake.</p>
    </form>
  );
}
