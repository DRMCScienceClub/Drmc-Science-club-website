"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveCmsRecordAction, type CmsFormResult } from "@/app/admin/actions";
import { Icon } from "@/components/ui/icon";
import type { AdminRole } from "@/lib/auth";
import type { CmsRecord } from "@/lib/cms/admin-repository";
import { slugify, type CmsField, type CmsResource } from "@/lib/cms/resources";

const initialState: CmsFormResult = { ok: false, message: "" };

function nestedData(record: CmsRecord | null, key: string) {
  const data = record?.data;
  return data && typeof data === "object" ? data[key] : undefined;
}

function valueFor(field: CmsField, record: CmsRecord | null) {
  if (!record) {
    if (field.type === "json") return field.name.endsWith("_json") && field.name !== "data_json" ? "[]" : "{}";
    if (field.type === "datetime-local" && field.name === "starts_at") return "";
    return "";
  }

  if (field.name === "data_json") return JSON.stringify(record.data ?? {}, null, 2);
  const nestedKey: Record<string, string> = {
    sponsors_json: "sponsors",
    partners_json: "partners",
    segments_json: "segments",
    schedule_json: "schedule",
    results_json: "results",
  };
  if (nestedKey[field.name]) return JSON.stringify(nestedData(record, nestedKey[field.name]) ?? [], null, 2);
  if (field.name === "recipients" && Array.isArray(record.recipients)) return record.recipients.join(", ");
  const value = record[field.name];
  if (field.type === "datetime-local" && typeof value === "string") return value.slice(0, 16);
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <>{messages.map((message) => <p key={message} className="mt-1.5 text-xs font-bold text-red-700">{message}</p>)}</>;
}

function EditorField({ field, record, errors }: { field: CmsField; record: CmsRecord | null; errors?: string[] }) {
  if (field.type === "checkbox") {
    return (
      <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
        <input name={field.name} type="checkbox" defaultChecked={Boolean(record?.[field.name])} className="size-4 accent-science-600" />
        <span><span className="block text-sm font-extrabold text-navy-900">{field.label}</span>{field.help && <span className="mt-0.5 block text-xs leading-5 text-slate-500">{field.help}</span>}</span>
      </label>
    );
  }

  const className = "min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-navy-950 shadow-sm placeholder:text-slate-400";
  const id = `cms-${field.name}`;
  return (
    <div className={field.fullWidth ? "md:col-span-2" : undefined}>
      <label htmlFor={id} className="text-sm font-extrabold text-navy-900">{field.label}{field.required && <span className="ml-1 text-red-600" aria-hidden="true">*</span>}</label>
      {field.type === "select" ? (
        <select id={id} name={field.name} required={field.required} defaultValue={valueFor(field, record)} className={`mt-2 ${className}`}>
          {!field.required && <option value="">Select…</option>}
          {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      ) : field.type === "textarea" || field.type === "json" ? (
        <textarea id={id} name={field.name} required={field.required} defaultValue={valueFor(field, record)} rows={field.type === "json" ? 10 : 4} spellCheck={field.type !== "json"} className={`mt-2 resize-y ${className} ${field.type === "json" ? "font-mono text-xs leading-5" : "leading-6"}`} />
      ) : (
        <input id={id} name={field.name} type={field.type} required={field.required} defaultValue={valueFor(field, record)} placeholder={field.placeholder} className={`mt-2 ${className}`} />
      )}
      {field.help && <p className="mt-1.5 text-xs leading-5 text-slate-500">{field.help}</p>}
      <FieldError messages={errors} />
    </div>
  );
}

export function CmsEditorForm({
  resource,
  record,
  role,
}: {
  resource: CmsResource;
  record: CmsRecord | null;
  role: AdminRole;
}) {
  const [state, action, pending] = useActionState(saveCmsRecordAction, initialState);
  const initialTitle = record?.title ?? "";
  const initialSlug = record?.slug ?? "";
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [slugEdited, setSlugEdited] = useState(Boolean(initialSlug));
  const canPublish = role !== "contributor";

  return (
    <form action={action} className="mt-7 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
      <input type="hidden" name="resource" value={resource.key} />
      <input type="hidden" name="id" value={record?.id ?? ""} />

      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6" aria-labelledby="editor-content-heading">
          <div className="border-b border-slate-200 pb-4">
            <h2 id="editor-content-heading" className="font-display text-xl font-extrabold text-navy-950">Public content</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">The title, URL, summary, and presentation fields visible on the public website.</p>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {resource.fields.map((field) => field.name === "title" ? (
              <div key={field.name} className="md:col-span-2">
                <label htmlFor="cms-title" className="text-sm font-extrabold text-navy-900">Title <span className="text-red-600" aria-hidden="true">*</span></label>
                <input id="cms-title" name="title" required value={title} onChange={(event) => { const next = event.target.value; setTitle(next); if (!slugEdited) setSlug(slugify(next)); }} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-navy-950 shadow-sm" />
                <FieldError messages={state.fieldErrors?.title} />
              </div>
            ) : field.name === "slug" ? (
              <div key={field.name}>
                <label htmlFor="cms-slug" className="text-sm font-extrabold text-navy-900">URL slug</label>
                <input id="cms-slug" name="slug" value={slug} onChange={(event) => { setSlugEdited(true); setSlug(slugify(event.target.value)); }} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-mono text-sm font-semibold text-navy-950 shadow-sm" />
                <p className="mt-1.5 text-xs leading-5 text-slate-500">Generated from the title; you can edit it before saving.</p>
                <FieldError messages={state.fieldErrors?.slug} />
              </div>
            ) : <EditorField key={field.name} field={field} record={record} errors={state.fieldErrors?.[field.name]} />)}
          </div>
        </section>

        {state.message && (
          <div role={state.ok ? "status" : "alert"} className={`rounded-xl border px-4 py-3 text-sm font-bold ${state.ok ? "border-teal-200 bg-teal-50 text-teal-800" : "border-red-200 bg-red-50 text-red-900"}`}>{state.message}</div>
        )}
      </div>

      <aside className="space-y-5 xl:sticky xl:top-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="font-display text-lg font-extrabold text-navy-950">Publication</h2>
          <label htmlFor="cms-status" className="mt-4 block text-sm font-extrabold text-navy-900">State</label>
          <select id="cms-status" name="status" defaultValue={record?.status ?? "draft"} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700">
            <option value="draft">Draft</option>
            {canPublish && <option value="published">Published</option>}
            {canPublish && <option value="archived">Archived</option>}
          </select>
          {!canPublish && <p className="mt-2 text-xs leading-5 text-slate-500">Contributors can prepare drafts. An editor must publish or archive them.</p>}
          <label className="mt-4 flex items-start gap-3 rounded-xl bg-science-50 p-3.5">
            <input name="is_featured" type="checkbox" defaultChecked={Boolean(record?.is_featured)} className="mt-0.5 size-4 accent-science-600" />
            <span><span className="block text-sm font-extrabold text-navy-900">Feature on homepage</span><span className="mt-0.5 block text-xs leading-5 text-slate-500">Subject to the collection&apos;s homepage placement.</span></span>
          </label>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <button disabled={pending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-navy-950 px-5 text-sm font-extrabold text-white transition-colors hover:bg-navy-800 disabled:cursor-wait disabled:bg-slate-400">
            {pending ? "Saving…" : record ? "Save changes" : "Create draft"}
            {!pending && <Icon name="check" className="size-4" />}
          </button>
          <Link href={`/admin/${resource.key}`} className="mt-2 inline-flex min-h-10 w-full items-center justify-center rounded-xl px-4 text-sm font-bold text-slate-600 hover:bg-slate-100">Cancel</Link>
        </section>
      </aside>
    </form>
  );
}
