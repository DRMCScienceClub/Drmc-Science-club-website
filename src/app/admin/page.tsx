import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { PrototypeBanner } from "@/app/admin/_components/prototype-banner";
import { Icon, type IconName } from "@/components/ui/icon";
import { activities } from "@/data/activities";
import { festivals } from "@/data/festivals";
import { magazines } from "@/data/magazines";

export const metadata: Metadata = {
  title: "Admin Dashboard Prototype",
  description:
    "Phase 1 mock administration dashboard for previewing the future DRMC Science Club publishing workflow.",
};

const upcomingProgrammes =
  activities.filter((activity) => activity.status === "upcoming").length +
  festivals.filter(
    (festival) => festival.status === "upcoming" || festival.status === "ongoing",
  ).length;

const kpis: ReadonlyArray<{
  label: string;
  value: string;
  detail: string;
  icon: IconName;
  tone: string;
}> = [
  {
    label: "Mock records",
    value: String(activities.length + festivals.length + magazines.length),
    detail: "Across three public collections",
    icon: "globe",
    tone: "bg-science-100 text-science-700",
  },
  {
    label: "Upcoming",
    value: String(upcomingProgrammes),
    detail: "Festivals and activities",
    icon: "calendar",
    tone: "bg-teal-100 text-teal-700",
  },
  {
    label: "Open registration",
    value: String(
      festivals.filter((festival) => festival.registration.status === "open")
        .length,
    ),
    detail: "Prototype registration states",
    icon: "users",
    tone: "bg-amber-100 text-amber-800",
  },
  {
    label: "Magazine issues",
    value: String(magazines.length),
    detail: "Annual archive entries",
    icon: "book",
    tone: "bg-violet-100 text-violet-700",
  },
];

const recentContent = [
  {
    title: festivals[0]?.shortTitle ?? "Current science festival",
    type: "Festival",
    state: "Scheduled",
    stateClass: "bg-science-50 text-science-700 ring-science-200",
    changed: "Today, 09:40",
  },
  {
    title: activities[0]?.title ?? "Latest club activity",
    type: "Activity",
    state: "Review",
    stateClass: "bg-amber-50 text-amber-800 ring-amber-200",
    changed: "Yesterday, 16:15",
  },
  {
    title: magazines[0]?.title ?? "Annual magazine",
    type: "Magazine",
    state: "Published",
    stateClass: "bg-teal-50 text-teal-700 ring-teal-200",
    changed: "25 Aug, 12:30",
  },
  {
    title: activities[1]?.title ?? "Club programme",
    type: "Activity",
    state: "Draft",
    stateClass: "bg-slate-100 text-slate-700 ring-slate-200",
    changed: "24 Aug, 10:05",
  },
] as const;

const quickActions: ReadonlyArray<{
  title: string;
  description: string;
  icon: IconName;
}> = [
  {
    title: "Create festival",
    description: "Add programme, segments, schedules, and results.",
    icon: "atom",
  },
  {
    title: "Add activity",
    description: "Prepare a story, gallery, and public event details.",
    icon: "flask",
  },
  {
    title: "Upload magazine",
    description: "Publish a cover, reader link, and approved PDF.",
    icon: "book",
  },
];

const readiness = [
  { label: "Festival profile", value: 88 },
  { label: "Activity archive", value: 76 },
  { label: "Executive directory", value: 64 },
] as const;

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="eyebrow">Administration preview</p>
            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.035em] text-navy-950 sm:text-4xl">
              Content overview
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              A proposed editorial workspace for keeping the public website
              accurate, timely, and institutionally reviewed.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-600 shadow-sm">
              <span className="size-2 rounded-full bg-amber-500" aria-hidden="true" />
              Mock data only
            </span>
            <Link
              href="/"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-navy-950 px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-navy-800"
            >
              View website
              <Icon name="external" className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-7">
          <PrototypeBanner />
        </div>

        <section aria-labelledby="dashboard-snapshot" className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2
                id="dashboard-snapshot"
                className="font-display text-xl font-extrabold tracking-[-0.02em] text-navy-950"
              >
                Site snapshot
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Calculated from the local prototype collections.
              </p>
            </div>
            <span className="hidden items-center gap-2 text-xs font-bold text-slate-500 sm:inline-flex">
              <Icon name="clock" className="size-4" />
              Previewed 27 August 2026
            </span>
          </div>

          <dl className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <dt className="text-sm font-bold text-slate-500">
                      {kpi.label}
                    </dt>
                    <dd>
                      <span className="mt-2 block font-display text-3xl font-extrabold tracking-[-0.04em] text-navy-950">{kpi.value}</span>
                      <span className="mt-3 block text-xs font-semibold leading-5 text-slate-500">{kpi.detail}</span>
                    </dd>
                  </div>
                  <span
                    className={`grid size-11 shrink-0 place-items-center rounded-xl ${kpi.tone}`}
                  >
                    <Icon name={kpi.icon} />
                  </span>
                </div>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-8 grid items-start gap-6 2xl:grid-cols-[minmax(0,1.55fr)_minmax(19rem,0.75fr)]">
          <section
            aria-labelledby="recent-content"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
          >
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2
                  id="recent-content"
                  className="font-display text-xl font-extrabold tracking-[-0.02em] text-navy-950"
                >
                  Recent content
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Sample editorial states for interface review.
                </p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                Read-only preview
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <caption className="sr-only">
                  Mock recent content and editorial status
                </caption>
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                    <th className="px-6 py-3.5" scope="col">
                      Content
                    </th>
                    <th className="px-4 py-3.5" scope="col">
                      Type
                    </th>
                    <th className="px-4 py-3.5" scope="col">
                      Editorial state
                    </th>
                    <th className="px-6 py-3.5 text-right" scope="col">
                      Mock update
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentContent.map((item) => (
                    <tr key={item.title} className="text-sm">
                      <th
                        scope="row"
                        className="max-w-xs px-6 py-4 font-bold text-navy-950"
                      >
                        {item.title}
                      </th>
                      <td className="px-4 py-4 font-semibold text-slate-600">
                        {item.type}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold ring-1 ring-inset ${item.stateClass}`}
                        >
                          {item.state}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-xs font-semibold text-slate-500">
                        {item.changed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            aria-labelledby="content-readiness"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="content-readiness"
                  className="font-display text-xl font-extrabold tracking-[-0.02em] text-navy-950"
                >
                  Content readiness
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Illustrative progress—not a live audit.
                </p>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-700">
                <Icon name="target" className="size-5" />
              </span>
            </div>

            <div className="mt-6 space-y-5">
              {readiness.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-bold text-navy-900">{item.label}</span>
                    <span className="font-extrabold text-slate-500">
                      {item.value}%
                    </span>
                  </div>
                  <div
                    aria-label={`${item.label}: ${item.value}% complete`}
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={item.value}
                    className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-science-600 to-teal-500"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                Before launch
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                Club authorities must verify names, dates, statistics, documents,
                and media permissions.
              </p>
            </div>
          </section>
        </div>

        <section aria-labelledby="quick-actions" className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2
                id="quick-actions"
                className="font-display text-xl font-extrabold tracking-[-0.02em] text-navy-950"
              >
                Quick actions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Planned publishing tools, disabled during Phase 1.
              </p>
            </div>
            <span className="hidden text-xs font-bold text-slate-500 sm:block">
              Supabase + role access planned
            </span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => (
              <button
                key={action.title}
                type="button"
                disabled
                className="group flex min-h-36 cursor-not-allowed items-start gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-left opacity-80 shadow-sm"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-science-50 text-science-700">
                  <Icon name={action.icon} />
                </span>
                <span>
                  <span className="block font-display text-base font-extrabold text-navy-950">
                    {action.title}
                  </span>
                  <span className="mt-2 block text-sm font-medium leading-6 text-slate-500">
                    {action.description}
                  </span>
                  <span className="mt-3 inline-flex text-[0.68rem] font-extrabold uppercase tracking-[0.13em] text-science-700">
                    Available in a future phase
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
