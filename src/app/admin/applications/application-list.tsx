"use client";

import Link from "next/link";
import { useActionState } from "react";
import { searchApplications } from "./actions";
import type { ApplicationList } from "@/lib/membership/repository";
import { applicationClasses, applicationInterests, applicationShifts, applicationStatuses, statusLabels } from "@/lib/membership/schema";

const control = "min-h-11 min-w-0 rounded-xl border border-slate-300 bg-white px-3 text-sm text-navy-950 focus-visible:outline-science-600";
export function ApplicationsList({ initial }: { initial: ApplicationList }) {
  const [result, action, pending] = useActionState(searchApplications, initial);
  return <form action={action} className="mt-7 space-y-5" aria-busy={pending}>
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 xl:grid-cols-3">
      <label className="grid gap-2 text-xs font-bold">Name or College ID<input name="search" maxLength={120} placeholder="Search applications…" className={control} /></label>
      {[{ name: "status", label: "Status", options: applicationStatuses.map((value) => ({ value, label: statusLabels[value] })) }, { name: "academicClass", label: "Class", options: applicationClasses.map((value) => ({ value, label: value })) }, { name: "shift", label: "Shift", options: applicationShifts.map((value) => ({ value, label: value })) }, { name: "interest", label: "Area of interest", options: applicationInterests.map((value) => ({ value, label: value })) }].map((filter) => <label key={filter.name} className="grid gap-2 text-xs font-bold">{filter.label}<select name={filter.name} className={control}><option value="">All</option>{filter.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>)}
      <button name="page" value="1" disabled={pending} className="self-end rounded-xl bg-navy-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Loading…" : "Search / apply filters"}</button>
    </div>
    {result.message && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{result.message}</p>}
    <p role="status" className="text-sm text-slate-600">{result.count} applications · Page {result.page} of {result.pages}</p>
    <div className="max-h-[40rem] overflow-auto rounded-2xl border border-slate-200 bg-white">
      <table className="block w-full text-left text-sm md:table"><thead className="sticky top-0 hidden bg-slate-50 md:table-header-group"><tr>{["Applicant", "Student information", "Interests", "Status / submitted"].map((heading) => <th key={heading} className="p-3 text-xs uppercase text-slate-500">{heading}</th>)}</tr></thead><tbody className="block md:table-row-group">
        {result.records.map((record) => <tr key={record.id} className="grid grid-cols-2 border-t border-slate-200 align-top md:table-row"><td className="block min-w-0 break-words p-3 md:table-cell"><Link href={`/admin/applications/${record.id}`} className="font-bold text-science-700 underline">{record.full_name}</Link><p className="mt-1 break-all text-xs text-slate-500">{record.reference_number}</p></td><td className="block min-w-0 break-words p-3 md:table-cell"><span className="mb-1 block text-xs font-bold text-slate-500 md:hidden">College ID · Class</span>{record.college_id}<p className="mt-1 text-xs">Class {record.academic_class} · {record.section} · {record.shift}</p></td><td className="block min-w-0 break-words p-3 text-xs leading-6 md:table-cell"><span className="block font-bold text-slate-500 md:hidden">Interests</span>{record.areas_of_interest.join(", ")}</td><td className="block min-w-0 break-words p-3 md:table-cell"><span className="font-bold">{statusLabels[record.status]}</span><p className="mt-1 text-xs">{new Date(record.submitted_at).toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka" })}</p></td></tr>)}
      </tbody></table>{!result.records.length && <p className="p-8 text-center text-slate-500">No applications found.</p>}
    </div>
    <div className="flex justify-between gap-3"><button name="page" value={result.page - 1} disabled={pending || result.page <= 1} className={`${control} disabled:opacity-40`}>Previous</button><button name="page" value={result.page + 1} disabled={pending || result.page >= result.pages} className={`${control} disabled:opacity-40`}>Next</button></div>
  </form>;
}
