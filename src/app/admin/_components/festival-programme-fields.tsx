"use client";

import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { slugify } from "@/lib/cms/resources";

type Segment = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  eligibility: string;
  teamSize: string;
  fee: string;
};

type ScheduleItem = {
  time: string;
  title: string;
  description: string;
  venue: string;
  segmentSlug: string;
};

type ScheduleDay = {
  date: string;
  label: string;
  items: ScheduleItem[];
};

type Result = {
  segment: string;
  position: string;
  recipient: string;
  institution: string;
};

function arrayFrom(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function TextInput({ value, onChange, label, type = "text", placeholder, className = "" }: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  type?: "text" | "date";
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block text-xs font-extrabold text-navy-900 ${className}`}>{label}
      {type === "date" ? <DatePicker value={value} onValueChange={onChange} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold" /> : <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold" />}
    </label>
  );
}

function EmptyRows({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm font-semibold text-slate-500">{children}</div>;
}

function FieldShell({ title, description, count, children, addLabel, onAdd, errors }: {
  title: string;
  description: string;
  count: number;
  children: React.ReactNode;
  addLabel: string;
  onAdd: () => void;
  errors?: string[];
}) {
  return (
    <section className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h3 className="font-display text-lg font-extrabold text-navy-950">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-600">{description}</p></div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-600 shadow-sm">{count} {count === 1 ? "entry" : "entries"}</span>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
      <button type="button" onClick={onAdd} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-science-700 px-4 text-sm font-extrabold text-white hover:bg-science-800"><span className="text-lg leading-none">+</span>{addLabel}</button>
      {errors?.map((message) => <p key={message} className="mt-2 text-xs font-bold text-red-700">{message}</p>)}
    </section>
  );
}

export function FestivalSegmentsField({ initialValue, errors }: { initialValue: string; errors?: string[] }) {
  const [segments, setSegments] = useState<Segment[]>(() => arrayFrom(initialValue).map((item) => {
    const value = item as Record<string, unknown>;
    return {
      slug: String(value.slug ?? ""), title: String(value.title ?? ""), category: String(value.category ?? ""),
      summary: String(value.summary ?? ""), eligibility: String(value.eligibility ?? ""),
      teamSize: String(value.teamSize ?? ""), fee: String(value.fee ?? ""),
    };
  }));
  const update = (index: number, changes: Partial<Segment>) => setSegments((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item));
  const serialized = JSON.stringify(segments.map((segment, index) => ({ ...segment, slug: segment.slug || `${slugify(segment.title)}-${index + 1}` })), null, 2);

  return (
    <FieldShell title="Festival segments" description="Add competitions, olympiads, exhibitions, workshops, and other programme segments." count={segments.length} addLabel="Add segment" onAdd={() => setSegments((current) => [...current, { slug: "", title: "", category: "", summary: "", eligibility: "", teamSize: "", fee: "" }])} errors={errors}>
      <textarea name="segments_json" value={serialized} readOnly hidden />
      {segments.map((segment, index) => (
        <article key={index} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3"><p className="text-xs font-extrabold uppercase tracking-[0.12em] text-science-700">Segment {index + 1}</p><button type="button" onClick={() => setSegments((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="inline-flex min-h-8 items-center gap-1 rounded-lg px-2 text-xs font-extrabold text-red-700 hover:bg-red-50"><Icon name="close" className="size-3.5" /> Remove</button></div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <TextInput label="Title" value={segment.title} onChange={(value) => update(index, { title: value, slug: segment.slug || slugify(value) })} className="lg:col-span-2" />
            <TextInput label="Category" value={segment.category} onChange={(value) => update(index, { category: value })} />
            <TextInput label="Eligibility" value={segment.eligibility} onChange={(value) => update(index, { eligibility: value })} />
            <TextInput label="Team size" value={segment.teamSize} onChange={(value) => update(index, { teamSize: value })} />
            <TextInput label="Fee" value={segment.fee} onChange={(value) => update(index, { fee: value })} />
            <label className="block text-xs font-extrabold text-navy-900 sm:col-span-2 lg:col-span-3">Summary<textarea value={segment.summary} onChange={(event) => update(index, { summary: event.target.value })} rows={2} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold leading-6" /></label>
          </div>
        </article>
      ))}
      {!segments.length && <EmptyRows>No festival segments added yet.</EmptyRows>}
    </FieldShell>
  );
}

export function FestivalScheduleField({ initialValue, errors }: { initialValue: string; errors?: string[] }) {
  const [days, setDays] = useState<ScheduleDay[]>(() => arrayFrom(initialValue).map((item) => {
    const value = item as Record<string, unknown>;
    return {
      date: String(value.date ?? ""),
      label: String(value.label ?? ""),
      items: Array.isArray(value.items) ? value.items.map((entry) => {
        const row = entry as Record<string, unknown>;
        return { time: String(row.time ?? ""), title: String(row.title ?? ""), description: String(row.description ?? ""), venue: String(row.venue ?? ""), segmentSlug: String(row.segmentSlug ?? "") };
      }) : [],
    };
  }));
  const updateDay = (dayIndex: number, changes: Partial<ScheduleDay>) => setDays((current) => current.map((day, index) => index === dayIndex ? { ...day, ...changes } : day));
  const updateItem = (dayIndex: number, itemIndex: number, changes: Partial<ScheduleItem>) => setDays((current) => current.map((day, index) => index === dayIndex ? { ...day, items: day.items.map((item, rowIndex) => rowIndex === itemIndex ? { ...item, ...changes } : item) } : day));
  const serialized = JSON.stringify(days, null, 2);

  return (
    <FieldShell title="Schedule builder" description="Create one or more programme days, then edit their timetable in table rows." count={days.reduce((total, day) => total + day.items.length, 0)} addLabel="Add schedule day" onAdd={() => setDays((current) => [...current, { date: "", label: `Day ${current.length + 1}`, items: [] }])} errors={errors}>
      <textarea name="schedule_json" value={serialized} readOnly hidden />
      {days.map((day, dayIndex) => (
        <article key={dayIndex} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 bg-slate-50 p-4">
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <TextInput label="Date" type="date" value={day.date} onChange={(value) => updateDay(dayIndex, { date: value })} />
              <TextInput label="Day label" value={day.label} onChange={(value) => updateDay(dayIndex, { label: value })} placeholder={`Day ${dayIndex + 1}`} />
            </div>
            <button type="button" onClick={() => setDays((current) => current.filter((_, index) => index !== dayIndex))} className="inline-flex min-h-9 items-center gap-1 rounded-lg px-3 text-xs font-extrabold text-red-700 hover:bg-red-50"><Icon name="close" className="size-3.5" /> Remove day</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[940px] w-full border-collapse text-left">
              <thead><tr className="border-b border-slate-200 bg-white text-[0.65rem] uppercase tracking-[0.1em] text-slate-500"><th className="px-3 py-3">Time</th><th className="px-3 py-3">Programme item</th><th className="px-3 py-3">Venue</th><th className="px-3 py-3">Segment slug</th><th className="px-3 py-3">Description</th><th className="w-12 px-2"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>{day.items.map((item, itemIndex) => (
                <tr key={itemIndex} className="border-b border-slate-100 align-top last:border-0">
                  {(["time", "title", "venue", "segmentSlug", "description"] as const).map((key) => <td key={key} className="p-2"><input value={item[key]} onChange={(event) => updateItem(dayIndex, itemIndex, { [key]: event.target.value })} className={`min-h-10 w-full rounded-lg border border-slate-300 px-2.5 text-sm font-semibold ${key === "description" ? "min-w-56" : "min-w-32"}`} /></td>)}
                  <td className="p-2"><button type="button" title="Remove schedule row" onClick={() => updateDay(dayIndex, { items: day.items.filter((_, index) => index !== itemIndex) })} className="grid size-10 place-items-center rounded-lg text-red-700 hover:bg-red-50"><Icon name="close" className="size-4" /></button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          {!day.items.length && <div className="px-4 py-6 text-center text-sm font-semibold text-slate-500">No rows in this day yet.</div>}
          <div className="border-t border-slate-200 p-3"><button type="button" onClick={() => updateDay(dayIndex, { items: [...day.items, { time: "", title: "", description: "", venue: "", segmentSlug: "" }] })} className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-navy-950 px-3 text-xs font-extrabold text-white">+ Add timetable row</button></div>
        </article>
      ))}
      {!days.length && <EmptyRows>No schedule days added yet. Add a day to create the timetable.</EmptyRows>}
    </FieldShell>
  );
}

export function FestivalResultsField({ initialValue, errors }: { initialValue: string; errors?: string[] }) {
  const [results, setResults] = useState<Result[]>(() => arrayFrom(initialValue).map((item) => {
    const value = item as Record<string, unknown>;
    return { segment: String(value.segment ?? ""), position: String(value.position ?? "Champion"), recipient: String(value.recipient ?? ""), institution: String(value.institution ?? "") };
  }));
  const update = (index: number, changes: Partial<Result>) => setResults((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item));

  return (
    <FieldShell title="Results table" description="Record verified placements, recipients, and institutions. Keep unverified results unpublished." count={results.length} addLabel="Add result row" onAdd={() => setResults((current) => [...current, { segment: "", position: "Champion", recipient: "", institution: "" }])} errors={errors}>
      <textarea name="results_json" value={JSON.stringify(results, null, 2)} readOnly hidden />
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-[780px] w-full border-collapse text-left">
          <thead><tr className="border-b border-slate-200 bg-slate-50 text-[0.65rem] uppercase tracking-[0.1em] text-slate-500"><th className="px-3 py-3">Segment</th><th className="px-3 py-3">Position</th><th className="px-3 py-3">Recipient</th><th className="px-3 py-3">Institution</th><th className="w-12"><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>{results.map((result, index) => (
            <tr key={index} className="border-b border-slate-100 last:border-0">
              <td className="p-2"><input value={result.segment} onChange={(event) => update(index, { segment: event.target.value })} className="min-h-10 w-full min-w-36 rounded-lg border border-slate-300 px-3 text-sm font-semibold" /></td>
              <td className="p-2"><Select value={result.position} onChange={(event) => update(index, { position: event.target.value })} className="min-h-10 w-full min-w-40 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold">{["Champion", "1st Runner-up", "2nd Runner-up", "Special Mention"].map((position) => <option key={position}>{position}</option>)}</Select></td>
              <td className="p-2"><input value={result.recipient} onChange={(event) => update(index, { recipient: event.target.value })} className="min-h-10 w-full min-w-40 rounded-lg border border-slate-300 px-3 text-sm font-semibold" /></td>
              <td className="p-2"><input value={result.institution} onChange={(event) => update(index, { institution: event.target.value })} className="min-h-10 w-full min-w-40 rounded-lg border border-slate-300 px-3 text-sm font-semibold" /></td>
              <td className="p-2"><button type="button" title="Remove result row" onClick={() => setResults((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="grid size-10 place-items-center rounded-lg text-red-700 hover:bg-red-50"><Icon name="close" className="size-4" /></button></td>
            </tr>
          ))}</tbody>
        </table>
        {!results.length && <div className="px-4 py-8 text-center text-sm font-semibold text-slate-500">No verified results added yet.</div>}
      </div>
    </FieldShell>
  );
}
