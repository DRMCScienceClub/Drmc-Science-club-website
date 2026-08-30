import type { Metadata } from "next";
import { ActivityCard } from "@/components/features/activity-card";
import { JoinCta } from "@/components/features/join-cta";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon, type IconName } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  activities,
  getCompletedActivities,
  getUpcomingActivities,
} from "@/data";
import type { ActivityCategory } from "@/types/content";

export const metadata: Metadata = {
  title: "Activities",
  description:
    "Explore upcoming and completed DRMC Science Club workshops, observations, competitions, seminars, and student learning programmes.",
  alternates: { canonical: "/activities" },
};

const categoryIcons: Record<ActivityCategory, IconName> = {
  Workshop: "flask",
  Observation: "globe",
  Competition: "trophy",
  Outreach: "users",
  Seminar: "lightbulb",
};

export default function ActivitiesPage() {
  const upcoming = getUpcomingActivities();
  const completed = getCompletedActivities();
  const categoryCounts = activities.reduce<Partial<Record<ActivityCategory, number>>>((counts, activity) => {
    counts[activity.category] = (counts[activity.category] ?? 0) + 1;
    return counts;
  }, {});

  return (
    <main>
      <PageHero
        eyebrow="Activities"
        title="A verified record of club programmes."
        description="Explore DRMC Science Club competitions, olympiads, workshops, and seminars transcribed from the supplied official event artwork."
        icon="flask"
      >
        <dl className="grid grid-cols-2 gap-3 text-center sm:min-w-72">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <dt className="text-xs text-slate-400">Coming up</dt>
            <dd className="mt-1 text-2xl font-extrabold text-teal-300">{upcoming.length}</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <dt className="text-xs text-slate-400">In this archive</dt>
            <dd className="mt-1 text-2xl font-extrabold text-science-300">{activities.length}</dd>
          </div>
        </dl>
      </PageHero>

      <section aria-label="Upcoming activities" className="site-surface py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Next on campus"
              title="Upcoming programmes"
              description="Future programmes will appear here after their date and venue are published in official club materials."
            />
            <ButtonLink href="/join" variant="outline" className="self-start sm:shrink-0">
              Membership information
            </ButtonLink>
          </div>

          {upcoming.length > 0 ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {upcoming.map((activity) => (
                <ActivityCard key={activity.slug} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState
                title="The next activity is being prepared"
                description="The supplied programme set contains completed events only. New workshops and sessions will appear here after their details are confirmed."
                action={{ label: "Browse completed activities", href: "#activity-archive" }}
              />
            </div>
          )}
        </Container>
      </section>

      <section aria-label="Activity programme mix" className="science-grid border-y border-slate-200 bg-slate-50 py-14 sm:py-16">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Programme mix"
              title="Different ways to investigate."
              description="This archive groups each poster-backed programme by its primary published format."
            />
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Counts reflect the official artwork currently available to the archive and will grow as more verified programmes are added.
            </p>
          </div>
          <dl className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(Object.entries(categoryCounts) as [ActivityCategory, number][]).map(([category, count]) => (
              <div key={category} className="surface-card rounded-2xl border border-surface-border p-5 shadow-card">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-science-50 text-science-700">
                  <Icon name={categoryIcons[category]} className="size-5" />
                </span>
                <dt className="mt-4 text-sm font-extrabold text-navy-950">{category}</dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                  {count} {count === 1 ? "programme" : "programmes"}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section id="activity-archive" aria-label="Completed activities" className="site-surface py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Field notes"
            title="Completed activities"
            description="Programmes are ordered newest first by their published event date. Each detail page distinguishes printed facts from context inferred from the supplied artwork."
          />
          {completed.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completed.map((activity) => (
                <ActivityCard key={activity.slug} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState title="No completed activities yet" description="Programme recaps will appear here after they are published." />
            </div>
          )}
        </Container>
      </section>

      <JoinCta />
    </main>
  );
}
