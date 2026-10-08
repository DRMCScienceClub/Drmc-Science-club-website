"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type ThemePreference = "light" | "dark" | "system";

const choices: ReadonlyArray<{ value: ThemePreference; label: string; icon: IconName }> = [
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "system", label: "System", icon: "monitor" },
];

function applyTheme(preference: ThemePreference) {
  const dark = preference === "dark" || (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const root = document.documentElement;
  root.dataset.theme = preference;
  root.classList.toggle("theme-dark", dark);
  root.classList.toggle("theme-light", !dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

export function ThemeSwitcher({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") return "system";
    const stored = localStorage.getItem("drmc-theme");
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  });
  const preferenceRef = useRef(preference);

  useEffect(() => {
    applyTheme(preferenceRef.current);
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => { if (document.documentElement.dataset.theme === "system") applyTheme("system"); };
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  function selectTheme(next: ThemePreference) {
    localStorage.setItem("drmc-theme", next);
    preferenceRef.current = next;
    setPreference(next);
    applyTheme(next);
  }

  return <fieldset className={cn("theme-switcher inline-flex", className)} aria-label="Colour theme">
    <legend className="sr-only">Colour theme</legend>
    {choices.map((choice) => <button key={choice.value} type="button" aria-label={`Use ${choice.label} theme`} aria-pressed={preference === choice.value} onClick={() => selectTheme(choice.value)} className="theme-switcher-button">
      <Icon name={choice.icon} className="size-3.5" />
      <span className={compact ? "sr-only" : undefined}>{choice.label}</span>
    </button>)}
  </fieldset>;
}
