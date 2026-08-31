import type { Metadata } from "next";
import { AchievementCard } from "@/components/features/achievement-card";
import { JoinCta } from "@/components/features/join-cta";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAchievements } from "@/lib/content";

export const metadata: Metadata = {
  title: "Achievements",
  description:
    "Explore poster-verified awards and distinctions earned by DRMC Science Club students and teams.",
  alternates: { canonical: "/achievements" },
};

export default async function AchievementsPage() {
  const achievements = await getAchievements();
  const recordsWithPrintedYear = achievements.filter(
    (achievement) => achievement.year !== undefined,
  ).length;

  return (
    <main>
      <PageHero
        eyebrow="Achievements"
        title="Student work that reached the podium."
        description="An evidence-led archive of distinctions earned by DRMC Science Club students and teams across science, invention, robotics, quizzing, writing, and olympiads."
        icon="trophy"
      >
        <dl className="grid grid-cols-2 gap-3 text-center sm:min-w-72">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <dt className="text-xs text-slate-400">Verified posters</dt>
            <dd className="mt-1 text-2xl font-extrabold text-teal-300">
              {achievements.length}
            </dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <dt className="text-xs text-slate-400">Year shown</dt>
            <dd className="mt-1 text-2xl font-extrabold text-gold-300">
              {recordsWithPrintedYear}
            </dd>
          </div>
        </dl>
      </PageHero>

      <section aria-labelledby="achievement-archive-title" className="site-surface py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
            <SectionHeading
              eyebrow="Verified distinctions"
              title="The achievement archive"
              description="Every record below is transcribed from club-supplied congratulations artwork, with the original poster preserved alongside the summary."
            />
            <aside className="rounded-2xl border border-science-100 bg-science-50 p-5 text-sm leading-6 text-science-900">
              <p className="flex items-start gap-3">
                <Icon name="shield" className="mt-0.5 size-5 shrink-0 text-science-600" />
                <span>
                  Records are newest first by the supplied publication sequence. A year is shown only when it is printed on the source artwork; otherwise the card says “Date not printed.”
                </span>
              </p>
            </aside>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </Container>
      </section>

      <JoinCta />
    </main>
  );
}
