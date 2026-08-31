"use client";

import { useActionState } from "react";
import {
  savePublicContactSettingsAction,
  type ContactSettingsFormResult,
} from "@/app/admin/actions";

const initialState: ContactSettingsFormResult = {};
const inputClass = "mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-semibold text-navy-950 shadow-sm focus:border-science-500 focus:outline-none focus:ring-4 focus:ring-science-100";

type Values = Record<string, string>;

function Field({ name, label, value, type = "text", errors, full = false, help }: {
  name: string;
  label: string;
  value: string;
  type?: "text" | "email" | "url" | "tel";
  errors?: string[];
  full?: boolean;
  help?: string;
}) {
  return (
    <label className={`text-sm font-extrabold text-navy-900 ${full ? "sm:col-span-2" : ""}`}>
      {label}<span className="text-red-600"> *</span>
      <input name={name} type={type} defaultValue={value} required aria-invalid={Boolean(errors?.length)} className={inputClass} />
      {help && <span className="mt-1.5 block text-xs font-normal leading-5 text-slate-500">{help}</span>}
      {errors?.map((error) => <span key={error} className="mt-1.5 block text-xs text-red-700">{error}</span>)}
    </label>
  );
}

export function ContactSettingsForm({ values }: { values: Values }) {
  const [state, action, pending] = useActionState(savePublicContactSettingsAction, initialState);
  return (
    <form action={action} className="mt-7 grid gap-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
        <div className="border-b border-slate-200 pb-4"><h2 className="font-display text-lg font-extrabold text-navy-950">Public identity and location</h2><p className="mt-1 text-xs leading-5 text-slate-500">Shown on the Contact page and in the site footer.</p></div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field name="clubName" label="Club name" value={values.clubName} errors={state.fieldErrors?.clubName} />
          <Field name="institution" label="Institution" value={values.institution} errors={state.fieldErrors?.institution} />
          <Field name="addressLine1" label="Address line 1" value={values.addressLine1} errors={state.fieldErrors?.addressLine1} full help="Use “Academic Building 3, Dhaka Residential Model College” for the club location." />
          <Field name="addressLine2" label="Address line 2" value={values.addressLine2} errors={state.fieldErrors?.addressLine2} />
          <Field name="addressLine3" label="Address line 3" value={values.addressLine3} errors={state.fieldErrors?.addressLine3} />
          <Field name="mapUrl" label="Google Maps URL" value={values.mapUrl} type="url" errors={state.fieldErrors?.mapUrl} full />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
        <div className="border-b border-slate-200 pb-4"><h2 className="font-display text-lg font-extrabold text-navy-950">Contact channels</h2><p className="mt-1 text-xs leading-5 text-slate-500">Keep these official, monitored, and suitable for public display.</p></div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field name="email" label="Contact email" value={values.email} type="email" errors={state.fieldErrors?.email} />
          <Field name="phone" label="Telephone" value={values.phone} type="tel" errors={state.fieldErrors?.phone} />
          <Field name="officeHours" label="Office hours" value={values.officeHours} errors={state.fieldErrors?.officeHours} full />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
        <div className="border-b border-slate-200 pb-4"><h2 className="font-display text-lg font-extrabold text-navy-950">Social channels</h2><p className="mt-1 text-xs leading-5 text-slate-500">Used by the homepage social strip, Contact page, and footer.</p></div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field name="facebookUrl" label="Facebook URL" value={values.facebookUrl} type="url" errors={state.fieldErrors?.facebookUrl} />
          <Field name="facebookHandle" label="Facebook handle" value={values.facebookHandle} errors={state.fieldErrors?.facebookHandle} />
          <Field name="instagramUrl" label="Instagram URL" value={values.instagramUrl} type="url" errors={state.fieldErrors?.instagramUrl} />
          <Field name="instagramHandle" label="Instagram handle" value={values.instagramHandle} errors={state.fieldErrors?.instagramHandle} />
        </div>
      </section>

      {state.message && <p role={state.ok ? "status" : "alert"} className={`rounded-xl border px-4 py-3 text-sm font-bold ${state.ok ? "border-teal-200 bg-teal-50 text-teal-900" : "border-red-200 bg-red-50 text-red-900"}`}>{state.message}</p>}
      <button disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-navy-950 px-6 text-sm font-extrabold text-white hover:bg-navy-800 disabled:cursor-wait disabled:bg-slate-400 sm:justify-self-start">{pending ? "Saving…" : "Save and publish contact settings"}</button>
    </form>
  );
}
