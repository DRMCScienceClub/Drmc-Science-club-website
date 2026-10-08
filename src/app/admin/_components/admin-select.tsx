"use client";

import { useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";

type Option = { value: string; label: string };

export function AdminSelect({ name, label, defaultValue = "", options }: {
  name: string;
  label: string;
  defaultValue?: string;
  options: readonly Option[];
}) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(Math.max(0, options.findIndex((option) => option.value === defaultValue)));

  function choose(index: number) {
    setValue(options[index].value);
    setOpen(false);
    trigger.current?.focus();
  }

  return <div className="admin-select relative min-w-40" onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <input type="hidden" name={name} value={value} />
    <button ref={trigger} type="button" role="combobox" aria-label={label} aria-expanded={open} aria-controls={id} aria-haspopup="listbox" aria-activedescendant={open ? `${id}-${active}` : undefined}
      className="flex min-h-11 w-full items-center justify-between gap-5 rounded-xl border border-slate-300 bg-white px-4 text-left text-sm font-bold text-slate-700"
      onClick={() => { setActive(Math.max(0, options.findIndex((option) => option.value === value))); setOpen(!open); }}
      onKeyDown={(event) => {
        if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
        else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          setOpen(true);
          if (open) setActive((index) => (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
        } else if (open && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); choose(active); }
        else if (open && (event.key === "Home" || event.key === "End")) { event.preventDefault(); setActive(event.key === "Home" ? 0 : options.length - 1); }
        else if (event.key === "Tab") setOpen(false);
        else if (event.key.length === 1 && event.key !== " ") {
          const index = options.findIndex((option) => option.label.toLowerCase().startsWith(event.key.toLowerCase()));
          if (index >= 0) { setOpen(true); setActive(index); }
        }
      }}>
      <span>{options.find((option) => option.value === value)?.label ?? options[0]?.label}</span>
      <Icon name="chevron-down" className="size-4 text-slate-500" />
    </button>
    {open && <ul id={id} role="listbox" aria-label={label} className="admin-select-menu absolute left-0 top-full z-50 mt-2 max-h-64 w-full min-w-44 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-soft">
      {options.map((option, index) => <li key={option.value} id={`${id}-${index}`} role="option" aria-selected={value === option.value}
        onMouseDown={(event) => event.preventDefault()} onMouseEnter={() => setActive(index)} onClick={() => choose(index)}
        className={`flex min-h-10 cursor-pointer items-center justify-between gap-4 rounded-lg px-3 text-sm font-semibold ${active === index ? "bg-science-50 text-science-700" : "text-slate-700"}`}>
        {option.label}{value === option.value && <Icon name="check" className="size-4" />}
      </li>)}
    </ul>}
  </div>;
}
