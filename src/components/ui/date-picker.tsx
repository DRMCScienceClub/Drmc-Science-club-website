"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Props = {
  id?: string; name?: string; value?: string; defaultValue?: string;
  required?: boolean; disabled?: boolean; className?: string;
  type?: "date" | "datetime-local"; onValueChange?: (value: string) => void;
};
const pad = (value: number) => String(value).padStart(2, "0");
const isoDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** A shared calendar with local ISO values: no timezone conversion when editing. */
export function DatePicker({ id, name, value, defaultValue = "", required, disabled, className, type = "date", onValueChange }: Props) {
  const [local, setLocal] = useState(defaultValue);
  const current = value ?? local;
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const heading = useId();
  const [month, setMonth] = useState(() => new Date(`${(current || isoDate(new Date())).slice(0, 10)}T12:00:00`));
  const [open, setOpen] = useState(false);
  const withTime = type === "datetime-local";
  function update(next: string) { setLocal(next); onValueChange?.(next); }
  function close() { dialog.current?.close(); setOpen(false); }
  useEffect(() => {
    const date = current.slice(0, 10);
    const parsed = new Date(`${date}T12:00:00`);
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(parsed.getTime()) && isoDate(parsed) === date;
    const validTime = !withTime || /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/.test(current);
    input.current?.setCustomValidity(current && (!validDate || !validTime) ? "Enter a valid date using the displayed format." : "");
  }, [current, withTime]);
  useEffect(() => {
    const form = input.current?.form;
    const reset = () => { setLocal(defaultValue); close(); };
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [defaultValue]);
  useEffect(() => { if (open) dialog.current?.showModal(); }, [open]);
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const selected = current.slice(0, 10);
  const today = isoDate(new Date());
  function selectDate(date: string) { update(withTime ? `${date}T${current.split("T")[1] || "00:00"}` : date); if (!withTime) close(); }
  return <div className={cn("relative", className?.includes("mt-") && "mt-2")}>
    <input ref={input} id={id} name={name} value={current} disabled={disabled} required={required} type="text" inputMode="text" autoComplete="off"
      placeholder={withTime ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD"}
      pattern={withTime ? "[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}" : "[0-9]{4}-[0-9]{2}-[0-9]{2}"}
      title={withTime ? "Date and time: YYYY-MM-DDTHH:mm" : "Date: YYYY-MM-DD"}
      onChange={(event) => update(event.target.value)} className={cn("min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold", className, "pr-12")} />
    <button type="button" disabled={disabled} aria-label="Open calendar" aria-haspopup="dialog" aria-expanded={open} onClick={() => {
      const parsed = new Date(`${selected}T12:00:00`);
      setMonth(Number.isNaN(parsed.getTime()) ? new Date() : parsed); setOpen(true);
    }} className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-science-700 hover:bg-science-50 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 11h18m-12 4h.01M12 15h.01M16 15h.01" /></svg>
    </button>
{open && createPortal(<dialog ref={dialog} aria-labelledby={heading} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) close(); }} className="date-calendar fixed inset-0 m-auto w-[min(23rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between"><h2 id={heading} className="text-base font-extrabold">{withTime ? "Choose date & time" : "Choose a date"}</h2><button type="button" aria-label="Close calendar" onClick={close} className="date-calendar-action size-9 rounded-lg">✕</button></div>
      <div className="mb-4 grid grid-cols-[2.5rem_1fr_5.5rem_2.5rem] items-center gap-2">
        <button type="button" aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="date-calendar-action h-10 rounded-lg">‹</button>
        <Select aria-label="Month" value={String(month.getMonth())} onChange={(event) => setMonth(new Date(month.getFullYear(), Number(event.target.value), 1))}>{Array.from({ length: 12 }, (_, index) => <option key={index} value={index}>{new Date(2026, index, 1).toLocaleDateString("en", { month: "long" })}</option>)}</Select>
        <input aria-label="Year" type="number" min="1" max="9999" value={month.getFullYear()} onChange={(event) => { const year = Number(event.target.value); if (year > 99 && year <= 9999) setMonth(new Date(year, month.getMonth(), 1)); }} className="h-11 min-w-0 rounded-lg border border-slate-300 px-2 text-sm" />
        <button type="button" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="date-calendar-action h-10 rounded-lg">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day} className="py-2 text-xs font-bold text-slate-500">{day}</span>)}
        {Array.from({ length: first.getDay() }, (_, index) => <span key={`empty-${index}`} />)}
        {Array.from({ length: days }, (_, index) => {
          const date = isoDate(new Date(month.getFullYear(), month.getMonth(), index + 1));
          return <button key={date} type="button" aria-label={date} aria-pressed={selected === date} aria-current={today === date ? "date" : undefined} onClick={() => selectDate(date)} className="date-calendar-day aspect-square rounded-lg text-sm font-semibold">{index + 1}</button>;
        })}
      </div>
      {withTime && <label className="mt-4 grid gap-2 text-sm font-bold">Time (24-hour)<input aria-label="Time in 24-hour format" type="text" inputMode="numeric" placeholder="HH:mm" value={current.split("T")[1] || ""} maxLength={5} onChange={(event) => update(`${selected || today}T${event.target.value}`)} className="min-h-11 rounded-xl border border-slate-300 px-3" /></label>}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-200 pt-4"><button type="button" onClick={() => { update(""); close(); }} className="date-calendar-action rounded-lg px-3 py-2 text-sm font-bold">Clear</button><button type="button" onClick={() => { setMonth(new Date()); selectDate(today); }} className="date-calendar-action rounded-lg px-3 py-2 text-sm font-bold">Today</button><button type="button" onClick={close} className="date-calendar-confirm rounded-lg px-4 py-2 text-sm font-bold">Done</button></div>
    </dialog>, document.body)}
  </div>;
}
