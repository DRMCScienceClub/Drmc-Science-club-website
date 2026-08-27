"use client";

import { useState } from "react";
import { ExecutiveCard } from "@/components/features/executive-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import type { ExecutivePanel } from "@/types/content";
import { cn } from "@/lib/utils";

export function ExecutiveDirectory({ panels }: { panels: readonly ExecutivePanel[] }) {
  const [selectedSession, setSelectedSession] = useState(panels[0]?.session ?? "");
  const panel = panels.find((item) => item.session === selectedSession) ?? panels[0];

  if (!panel) {
    return <EmptyState title="Executive panel not published" description="The panel directory will appear here after the club confirms a session." icon="users" />;
  }

  return (
    <div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-science-700">Panel directory</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-navy-950">Choose a session</h2>
            <p className="mt-2 text-sm text-slate-600">The current panel is displayed first; select any archived session to explore its team.</p>
          </div>
          <div role="group" aria-label="Select executive panel session" className="flex flex-wrap gap-2">
            {panels.map((item) => (
              <button
                key={item.session}
                type="button"
                aria-pressed={panel.session === item.session}
                onClick={() => setSelectedSession(item.session)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-extrabold transition-colors",
                  panel.session === item.session
                    ? "border-science-600 bg-science-600 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-science-300 hover:bg-science-50",
                )}
              >
                {item.session}
                {item.isCurrent && <span className={cn("rounded-full px-2 py-0.5 text-[0.6rem] uppercase tracking-wider", panel.session === item.session ? "bg-white/15 text-white" : "bg-teal-100 text-teal-700")}>Current</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section aria-live="polite" aria-label={`${panel.title} members`} className="mt-10">
        <div className="science-grid-dark overflow-hidden rounded-3xl bg-navy-950 p-6 text-white sm:p-8 lg:p-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-extrabold uppercase tracking-[0.15em] text-teal-300">Session {panel.session}</span>
                {panel.isCurrent && <span className="rounded-full bg-teal-400 px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-wider text-navy-950">Current panel</span>}
              </div>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">{panel.title}</h2>
              <p className="mt-4 leading-7 text-slate-300">{panel.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center sm:flex">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3"><span className="block text-2xl font-extrabold text-science-300">{panel.departments.length}</span><span className="text-xs text-slate-400">Departments</span></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3"><span className="block text-2xl font-extrabold text-science-300">{panel.departments.reduce((total, department) => total + department.members.length, 0)}</span><span className="text-xs text-slate-400">Students</span></div>
            </div>
          </div>
        </div>

        <section aria-labelledby="faculty-leadership" className="mt-10">
          <div className="flex items-center gap-3"><span className="inline-flex size-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700"><Icon name="shield" /></span><div><p className="text-xs font-extrabold uppercase tracking-[0.13em] text-science-700">Guidance</p><h3 id="faculty-leadership" className="font-display text-2xl font-extrabold text-navy-950">Moderator & advisers</h3></div></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ExecutiveCard member={panel.moderator} prominent />
            {panel.advisers.map((adviser) => <ExecutiveCard key={adviser.id} member={adviser} prominent />)}
          </div>
        </section>

        <div className="mt-12 grid gap-10">
          {panel.departments.map((department, index) => (
            <section key={department.name} aria-labelledby={`department-${index}`} className="border-t border-slate-200 pt-9">
              <div className="grid gap-3 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
                <div><p className="text-xs font-extrabold uppercase tracking-[0.13em] text-science-700">Department {String(index + 1).padStart(2, "0")}</p><h3 id={`department-${index}`} className="mt-2 font-display text-2xl font-extrabold tracking-tight text-navy-950">{department.name}</h3></div>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 lg:justify-self-end">{department.description}</p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{department.members.map((member) => <ExecutiveCard key={member.id} member={member} prominent />)}</div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
