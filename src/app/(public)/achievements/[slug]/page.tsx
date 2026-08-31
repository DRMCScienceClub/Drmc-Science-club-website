import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AchievementCard } from "@/components/features/achievement-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAchievement, getAchievements } from "@/lib/content";

type AchievementPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return (await getAchievements()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: AchievementPageProps): Promise<Metadata> {
  const achievement = await getAchievement((await params).slug);
  if (!achievement) {
    return {
      title: "Achievement not found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: achievement.title,
    description: achievement.summary,
    alternates: { canonical: `/achievements/${achievement.slug}` },
    openGraph: {
      type: "article",
      title: achievement.title,
      description: achievement.summary,
      url: `/achievements/${achievement.slug}`,
      images: [{
        url: achievement.image.src,
        width: achievement.image.width,
        height: achievement.image.height,
        alt: achievement.image.alt,
      }],
    },
  };
}

export default async function AchievementDetailPage({
  params,
}: AchievementPageProps) {
  const achievement = await getAchievement((await params).slug);
  if (!achievement) notFound();

  const related = (await getAchievements())
    .filter((item) => item.slug !== achievement.slug)
    .slice(0, 3);

  return (
    <main>
      <article>
        <header className="science-grid-dark overflow-hidden bg-navy-950 py-12 text-white sm:py-16 lg:py-20">
          <Container>
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <Link href="/" className="rounded-sm hover:text-white">Home</Link>
              <Icon name="chevron-right" className="size-3.5" />
              <Link href="/achievements" className="rounded-sm hover:text-white">Achievements</Link>
              <Icon name="chevron-right" className="size-3.5" />
              <span aria-current="page" className="max-w-64 truncate text-science-200">{achievement.award}</span>
            </nav>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_.72fr] lg:items-center lg:gap-16">
              <div>
                <StatusBadge tone={achievement.year ? "blue" : "slate"}>
                  {achievement.year ?? "Date not printed"}
                </StatusBadge>
                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.14em] text-teal-300">{achievement.award}</p>
                <h1 className="mt-3 text-balance font-display text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  {achievement.recipients.join(" & ")}
                </h1>
                <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-science-200">{achievement.competition}</p>
                <p className="mt-4 max-w-2xl leading-7 text-slate-300">{achievement.summary}</p>
              </div>
              <figure className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 shadow-2xl">
                <Image src={achievement.image.src} alt={achievement.image.alt} fill priority sizes="(min-width: 1024px) 34vw, 100vw" className="object-contain" />
              </figure>
            </div>
          </Container>
        </header>

        <section className="site-surface py-16 sm:py-20">
          <Container className="grid gap-10 lg:grid-cols-[1fr_20rem]">
            <div>
              <span className="eyebrow">Verified distinction</span>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-950">Achievement record</h2>
              {achievement.details.length ? (
                <ul className="mt-7 grid gap-4">
                  {achievement.details.map((detail) => (
                    <li key={detail} className="flex gap-3 rounded-2xl border border-surface-border bg-slate-50 p-5 text-slate-700 shadow-card">
                      <Icon name="trophy" className="mt-0.5 size-5 shrink-0 text-gold-600" />
                      <span className="leading-7">{detail}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-5 leading-7 text-slate-600">The supplied artwork confirms the award and competition; no additional result detail is printed.</p>}
            </div>
            <dl className="h-fit space-y-5 rounded-3xl border border-surface-border bg-slate-50 p-6 shadow-card">
              {achievement.organizer && <div><dt className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Organizer</dt><dd className="mt-2 font-semibold text-navy-950">{achievement.organizer}</dd></div>}
              {achievement.location && <div><dt className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Location</dt><dd className="mt-2 font-semibold text-navy-950">{achievement.location}</dd></div>}
              <ButtonLink href="/achievements" variant="outline" icon="arrow-left" iconPosition="left">All achievements</ButtonLink>
            </dl>
          </Container>
        </section>
      </article>

      {related.length > 0 && (
        <section className="science-grid border-t border-slate-200 bg-slate-50 py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Keep exploring" title="More student achievements" />
            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => <AchievementCard key={item.id} achievement={item} />)}
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}

