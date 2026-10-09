"use client";

import { Children, isValidElement, useEffect, useId, useRef, useState, type ReactNode, type SelectHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string; disabled: boolean };

function readOptions(children: ReactNode): Option[] {
  return Children.toArray(children).flatMap((child): Option[] => {
    if (!isValidElement<{ value?: string | number; children?: ReactNode; disabled?: boolean }>(child)) return [];
    if (child.type !== "option") return readOptions(child.props.children);
    const label = Children.toArray(child.props.children).join("");
    return [{ value: String(child.props.value ?? label), label, disabled: Boolean(child.props.disabled) }];
  });
}

/** Native form values and validation, with one theme-aware menu everywhere. */
export function Select({ children, className, id, onChange, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  const generatedId = useId();
  const menuId = `${generatedId}-menu`;
  const native = useRef<HTMLSelectElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLUListElement>(null);
  const options = readOptions(children);
  const [localValue, setLocalValue] = useState(String(props.defaultValue ?? options[0]?.value ?? ""));
  const value = props.value === undefined ? localValue : String(props.value);
  const [position, setPosition] = useState<{ left: number; top: number; width: number; maxHeight: number } | null>(null);
  const [active, setActive] = useState(0);
  const open = position !== null;

  function show() {
    if (props.disabled || trigger.current?.matches(":disabled")) return;
    const rect = trigger.current!.getBoundingClientRect();
    const height = Math.min(256, options.length * 42 + 14);
    const below = window.innerHeight - rect.bottom - 16;
    const above = below < Math.min(height, 160) && rect.top > below;
    const maxHeight = Math.max(80, Math.min(height, above ? rect.top - 16 : below));
    setPosition({ left: Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)), top: above ? rect.top - maxHeight - 6 : rect.bottom + 6, width: rect.width, maxHeight });
    setActive(Math.max(0, options.findIndex((option) => option.value === value && !option.disabled)));
  }

  function choose(index: number) {
    if (!native.current || !options[index] || options[index].disabled) return;
    native.current.value = options[index].value;
    native.current.dispatchEvent(new Event("change", { bubbles: true }));
    setPosition(null);
    trigger.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    const close = () => setPosition(null);
    const outside = (event: PointerEvent) => {
      if (!trigger.current?.contains(event.target as Node) && !menu.current?.contains(event.target as Node)) close();
    };
    const scroll = (event: Event) => { if (!menu.current?.contains(event.target as Node)) close(); };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", close);
    document.addEventListener("scroll", scroll, true);
    return () => { document.removeEventListener("pointerdown", outside); window.removeEventListener("resize", close); document.removeEventListener("scroll", scroll, true); };
  }, [open]);

  useEffect(() => {
    menu.current?.querySelectorAll<HTMLElement>("[role=option]")[active]?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  useEffect(() => {
    const form = native.current?.form;
    const reset = () => queueMicrotask(() => { if (native.current) setLocalValue(native.current.value); });
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, []);

  return <>
    <button ref={trigger} id={id} type="button" role="combobox" aria-label={props["aria-label"] ?? (id ? undefined : props.name?.replaceAll("_", " "))} aria-labelledby={props["aria-labelledby"]} aria-describedby={props["aria-describedby"]} aria-invalid={props["aria-invalid"]} aria-required={props.required} aria-expanded={open} aria-controls={menuId} aria-haspopup="listbox" aria-activedescendant={open ? `${menuId}-${active}` : undefined} disabled={props.disabled}
      className={cn("select-trigger flex min-h-11 w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-left text-sm font-semibold text-navy-950 disabled:cursor-not-allowed disabled:opacity-50", className)}
      onClick={() => open ? setPosition(null) : show()} onBlur={() => setPosition(null)}
      onKeyDown={(event) => {
        if (event.key === "Escape" || event.key === "Tab") { if (event.key === "Escape") event.preventDefault(); setPosition(null); }
        else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          if (!open) { show(); return; }
          const enabled = options.flatMap((option, index) => option.disabled ? [] : [index]);
          if (!enabled.length) return;
          const current = enabled.indexOf(active);
          setActive(event.key === "Home" ? enabled[0] : event.key === "End" ? enabled.at(-1)! : enabled[(current + (event.key === "ArrowDown" ? 1 : -1) + enabled.length) % enabled.length]);
        } else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); if (open) choose(active); else show(); }
        else if (event.key.length === 1) {
          const index = options.findIndex((option) => !option.disabled && option.label.toLowerCase().startsWith(event.key.toLowerCase()));
          if (index >= 0) { event.preventDefault(); if (!open) show(); setActive(index); }
        }
      }}>
      <span className="min-w-0 truncate">{options.find((option) => option.value === value)?.label ?? options[0]?.label}</span><Icon name="chevron-down" className="size-4 shrink-0 text-slate-500" />
    </button>
    <select {...props} ref={native} tabIndex={-1} aria-hidden="true" className="select-native-value" onChange={(event) => { setLocalValue(event.target.value); onChange?.(event); }} onInvalid={(event) => { event.preventDefault(); trigger.current?.focus(); show(); }}>{children}</select>
    {position && createPortal(<ul ref={menu} id={menuId} role="listbox" aria-label={props["aria-label"] ?? "Choose an option"} style={position} className="select-menu fixed z-[1000] overflow-y-auto overscroll-contain rounded-xl border p-1.5 shadow-soft">
      {options.map((option, index) => <li key={`${option.value}-${index}`} id={`${menuId}-${index}`} role="option" aria-selected={value === option.value} aria-disabled={option.disabled} onMouseDown={(event) => event.preventDefault()} onPointerMove={() => { if (!option.disabled) setActive(index); }} onClick={() => choose(index)} className={cn("select-option flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-semibold", active === index && "select-option-active", option.disabled && "cursor-not-allowed opacity-40")}>
        <span>{option.label}</span>{value === option.value && <Icon name="check" className="size-4 shrink-0" />}
      </li>)}
    </ul>, document.body)}
  </>;
}
