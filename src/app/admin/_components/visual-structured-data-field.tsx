"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { MediaChoicePicker } from "@/app/admin/_components/media-choice-picker";
import type { PublishedMediaChoice } from "@/lib/cms/admin-repository";
import type { CmsResourceKey } from "@/lib/cms/resources";

type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;
type JsonObject = { [key: string]: JsonValue };
type Path = Array<string | number>;

const defaults: Partial<Record<CmsResourceKey, JsonObject>> = {
  festivals: {
    shortTitle: "",
    theme: "",
    description: [""],
    dateLabel: "",
    venueAddress: "",
    status: "completed",
    recordStatus: "prototype",
    registration: { status: "not-required", label: "Registration", note: "" },
    segmentSource: "supplied-artwork",
    resultsNote: "",
    gallery: [],
  },
  activities: {
    recordStatus: "prototype",
    dateLabel: "",
    body: [""],
    gallery: [],
    tags: [],
    organizers: ["DRMC Science Club"],
    highlights: [],
    organizerContacts: [],
    externalLinks: [],
    relatedFestivalSlug: "",
  },
  achievements: {
    organizer: "",
    location: "",
    details: [""],
    gallery: [],
  },
  magazines: {
    subtitle: "",
    publishedAt: "",
    pages: 0,
    highlights: [],
  },
  executives: {
    recordStatus: "prototype",
    moderator: {
      id: "moderator",
      name: "",
      role: "Moderator · DRMC Science Club",
      department: "Faculty Guidance",
      academicClass: "",
      image: { src: "/images/people/avatar-navy.svg", alt: "Portrait placeholder", width: 480, height: 480 },
    },
    advisers: [],
    institutionalLeadership: [],
    departments: [],
  },
};

const visibleKeys: Partial<Record<CmsResourceKey, string[]>> = {
  festivals: ["shortTitle", "theme", "description", "dateLabel", "venueAddress", "status", "recordStatus", "registration", "segmentSource", "resultsNote", "gallery", "brochure", "rulebook"],
  activities: ["recordStatus", "dateLabel", "body", "gallery", "tags", "organizers", "highlights", "organizerContacts", "externalLinks", "relatedFestivalSlug"],
  achievements: ["organizer", "location", "details", "gallery"],
  magazines: ["subtitle", "publishedAt", "pages", "highlights"],
  executives: ["recordStatus", "moderator", "advisers", "institutionalLeadership", "departments"],
};

function isObject(value: JsonValue): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseObject(value: string): JsonObject {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as JsonObject : {};
  } catch {
    return {};
  }
}

function mergeObjects(base: JsonObject, supplied: JsonObject): JsonObject {
  const merged: JsonObject = { ...base, ...supplied };
  for (const [key, value] of Object.entries(base)) {
    if (isObject(value) && isObject(supplied[key])) merged[key] = mergeObjects(value, supplied[key] as JsonObject);
  }
  return merged;
}

function replaceAt(root: JsonValue, path: Path, next: JsonValue): JsonValue {
  if (!path.length) return next;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const clone = [...root];
    clone[Number(head)] = replaceAt(clone[Number(head)] ?? null, rest, next);
    return clone;
  }
  const clone: JsonObject = isObject(root) ? { ...root } : {};
  clone[String(head)] = replaceAt(clone[String(head)] ?? null, rest, next);
  return clone;
}

function humanize(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ").replace(/^./, (letter) => letter.toUpperCase());
}

function normalizedPath(path: Path) {
  return path.map((part) => typeof part === "number" ? "*" : part).join(".");
}

function itemTemplate(path: Path): JsonValue {
  const normalized = normalizedPath(path);
  if (normalized.endsWith("gallery")) return { src: "", alt: "", width: 1600, height: 900 };
  if (normalized.endsWith("organizerContacts")) return { name: "", role: "", email: "", phone: "" };
  if (normalized.endsWith("externalLinks")) return { label: "", href: "", external: true };
  if (normalized.endsWith("departments")) return { name: "", description: "", members: [] };
  if (normalized.endsWith("members") || normalized.endsWith("advisers") || normalized.endsWith("institutionalLeadership")) {
    return {
      id: crypto.randomUUID(),
      name: "",
      role: "",
      department: "",
      academicClass: "",
      image: { src: "/images/people/avatar-slate.svg", alt: "Portrait placeholder", width: 480, height: 480 },
    };
  }
  return "";
}

function enumOptions(key: string): string[] | null {
  if (key === "recordStatus") return ["prototype", "poster-verified", "official-document"];
  if (key === "status") return ["upcoming", "ongoing", "completed"];
  if (key === "segmentSource") return ["supplied-artwork", "published-programme"];
  return null;
}

function ImageEditor({ value, path, update, media }: { value: JsonObject; path: Path; update: (path: Path, value: JsonValue) => void; media: PublishedMediaChoice[] }) {
  const src = String(value.src ?? "");
  const previewable = src.startsWith("/") || /^https?:\/\//.test(src);
  return (
    <div className="grid gap-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
      <div className="relative grid aspect-square place-items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        {previewable ? <Image src={src} alt={String(value.alt ?? "")} fill sizes="112px" className="object-contain p-2" /> : <Icon name="download" className="size-8 text-slate-300" />}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-extrabold text-navy-900 sm:col-span-2">Image URL<input value={src} onChange={(event) => update([...path, "src"], event.target.value)} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 px-3 font-mono text-xs font-semibold" /></label>
        <div className="sm:col-span-2">
          <p className="text-xs font-extrabold text-navy-900">Choose published media</p>
          <div className="mt-1.5">
            <MediaChoicePicker
              choices={media.filter((asset) => asset.mime_type.startsWith("image/"))}
              selectedUrl={src}
              placeholder="Select image…"
              onSelect={(asset) => { if (asset.public_url) update(path, { ...value, src: asset.public_url, alt: asset.alt_text, width: asset.width ?? 1600, height: asset.height ?? 900 }); }}
            />
          </div>
        </div>
        <label className="text-xs font-extrabold text-navy-900 sm:col-span-2">Alternative text<input value={String(value.alt ?? "")} onChange={(event) => update([...path, "alt"], event.target.value)} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-semibold" /></label>
        <label className="text-xs font-extrabold text-navy-900">Width<input type="number" min="1" value={Number(value.width ?? 1600)} onChange={(event) => update([...path, "width"], Number(event.target.value))} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-semibold" /></label>
        <label className="text-xs font-extrabold text-navy-900">Height<input type="number" min="1" value={Number(value.height ?? 900)} onChange={(event) => update([...path, "height"], Number(event.target.value))} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-semibold" /></label>
      </div>
    </div>
  );
}

function ValueEditor({ value, path, label, resource, update, media }: {
  value: JsonValue;
  path: Path;
  label: string;
  resource: CmsResourceKey;
  update: (path: Path, value: JsonValue) => void;
  media: PublishedMediaChoice[];
}) {
  const key = String(path.at(-1) ?? "");

  if (Array.isArray(value)) {
    const objectItems = value.some((item) => isObject(item)) || isObject(itemTemplate(path));
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h4 className="text-sm font-extrabold text-navy-950">{label}</h4><p className="mt-0.5 text-xs text-slate-500">{value.length} {value.length === 1 ? "item" : "items"}</p></div><button type="button" onClick={() => update(path, [...value, itemTemplate(path)])} className="inline-flex min-h-9 items-center rounded-lg bg-science-700 px-3 text-xs font-extrabold text-white">+ Add item</button></div>
        <div className="mt-3 space-y-3">
          {value.map((item, index) => objectItems && isObject(item) ? (
            <details key={index} open={value.length <= 3} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <summary className="cursor-pointer text-xs font-extrabold uppercase tracking-[0.08em] text-science-700">{humanize(key).replace(/s$/, "")} {index + 1}</summary>
              <div className="mt-3 space-y-3"><ValueEditor value={item} path={[...path, index]} label={`${label} ${index + 1}`} resource={resource} update={update} media={media} /></div>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-200 pt-3"><button type="button" disabled={index === 0} onClick={() => { const copy = [...value]; [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]]; update(path, copy); }} className="rounded-lg px-2.5 py-1.5 text-xs font-extrabold text-slate-600 disabled:opacity-30">Move up</button><button type="button" disabled={index === value.length - 1} onClick={() => { const copy = [...value]; [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]]; update(path, copy); }} className="rounded-lg px-2.5 py-1.5 text-xs font-extrabold text-slate-600 disabled:opacity-30">Move down</button><button type="button" onClick={() => update(path, value.filter((_, itemIndex) => itemIndex !== index))} className="ml-auto rounded-lg px-2.5 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-50">Remove</button></div>
            </details>
          ) : (
            <div key={index} className="flex gap-2"><textarea value={String(item ?? "")} onChange={(event) => update([...path, index], event.target.value)} rows={key === "description" || key === "body" || key === "details" ? 3 : 1} className="min-h-10 flex-1 resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold leading-6" /><button type="button" title="Remove item" onClick={() => update(path, value.filter((_, itemIndex) => itemIndex !== index))} className="grid size-10 shrink-0 place-items-center rounded-lg text-red-700 hover:bg-red-50"><Icon name="close" className="size-4" /></button></div>
          ))}
          {!value.length && <p className="rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-xs font-semibold text-slate-500">No items added.</p>}
        </div>
      </section>
    );
  }

  if (isObject(value)) {
    const isImage = "src" in value && ("alt" in value || "width" in value || "height" in value);
    if (isImage) return <ImageEditor value={value} path={path} update={update} media={media} />;
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-extrabold text-navy-950">{label}</h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {Object.entries(value).filter(([childKey]) => !(resource === "festivals" && normalizedPath([...path, childKey]).endsWith("registration.status"))).map(([childKey, child]) => (
            <div key={childKey} className={Array.isArray(child) || isObject(child) || String(child).length > 80 ? "sm:col-span-2" : undefined}>
              <ValueEditor value={child} path={[...path, childKey]} label={humanize(childKey)} resource={resource} update={update} media={media} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (typeof value === "boolean") {
    return <label className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-extrabold text-navy-900"><input type="checkbox" checked={value} onChange={(event) => update(path, event.target.checked)} className="size-4 accent-science-600" />{label}</label>;
  }

  const options = enumOptions(key);
  const long = key === "note" || key === "description" || String(value ?? "").length > 100;
  return (
    <label className="block text-xs font-extrabold text-navy-900">{label}
      {options ? (
        <select value={String(value ?? "")} onChange={(event) => update(path, event.target.value)} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold">{options.map((option) => <option key={option} value={option}>{humanize(option)}</option>)}</select>
      ) : typeof value === "number" ? (
        <input type="number" value={value} onChange={(event) => update(path, Number(event.target.value))} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-semibold" />
      ) : long ? (
        <textarea value={String(value ?? "")} onChange={(event) => update(path, event.target.value)} rows={3} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold leading-6" />
      ) : (
        <input type={key.toLowerCase().includes("date") ? "date" : "text"} value={String(value ?? "")} onChange={(event) => update(path, event.target.value)} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-semibold" />
      )}
    </label>
  );
}

export function VisualStructuredDataField({ resource, initialValue, media, errors }: {
  resource: CmsResourceKey;
  initialValue: string;
  media: PublishedMediaChoice[];
  errors?: string[];
}) {
  const [data, setData] = useState<JsonObject>(() => mergeObjects(defaults[resource] ?? {}, parseObject(initialValue)));
  const keys = visibleKeys[resource] ?? [];
  const update = (path: Path, value: JsonValue) => setData((current) => replaceAt(current, path, value) as JsonObject);

  return (
    <section className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <textarea name="data_json" value={JSON.stringify(data, null, 2)} readOnly hidden />
      <div className="border-b border-slate-200 pb-4"><h3 className="font-display text-lg font-extrabold text-navy-950">Additional page details</h3><p className="mt-1 text-xs leading-5 text-slate-600">These visual fields update the structured public page data. Existing unlisted metadata is preserved automatically.</p></div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {keys.filter((key) => key in data).map((key) => (
          <div key={key} className={Array.isArray(data[key]) || isObject(data[key]) || String(data[key]).length > 80 ? "sm:col-span-2" : undefined}>
            <ValueEditor value={data[key]} path={[key]} label={humanize(key)} resource={resource} update={update} media={media} />
          </div>
        ))}
      </div>
      {errors?.map((message) => <p key={message} className="mt-3 text-xs font-bold text-red-700">{message}</p>)}
    </section>
  );
}
