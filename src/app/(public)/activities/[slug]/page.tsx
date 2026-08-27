import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityCard } from "@/components/features/activity-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  activities,
  activitySlugs,
  getActivityBySlug,
  getFestivalBySlug,
} from "@/data";

type ActivityPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return activitySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ActivityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);

  if (!activity) {
    notFound();
  }

  return {
    title: activity.title,
    description: activity.excerpt,
    keywords: activity.tags,
    alternates: { canonical: `/activities/${activity.slug}` },
    openGraph: {
      type: "article",
      locale: "en_BD",
      siteName: "DRMC Science Club",
      title: activity.title,
      description: activity.excerpt,
      url: `/activities/${activity.slug}`,
      images: [
        {
          url: activity.image.src,
          width: activity.image.width,
          height: activity.image.height,
          alt: activity.image.alt,
        },
      ],
    },
  };
}

export default async function ActivityDetailPage({ params }: ActivityPageProps) {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);

  if (!activity) {
    notFound();
  }

  const relatedFestival = activity.relatedFestivalSlug
    ? getFestivalBySlug(activity.relatedFestivalSlug)
    : undefined;
  const relatedActivities = activities
    .filter((item) => item.slug !== activity.slug)
    .toSorted((a, b) => {
      if (a.category === activity.category && b.category !== activity.category) return -1;
      if (a.category !== activity.category && b.category === activity.category) return 1;
      return b.date.localeCompare(a.date);
    })
    .slice(0, 3);

  return (
    <main>
      <article>
        <header className="science-grid-dark relative overflow-hidden bg-navy-950 py-12 sm:py-16 lg:py-20">
          <div aria-hidden="true" className="absolute -right-24 -top-24 size-80 rounded-full border border-science-300/15" />
          <div aria-hidden="true" className="absolute right-16 top-12 size-52 rounded-full border border-teal-300/10" />
          <Container className="relative">
            <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <Link href="/" className="rounded-sm transition-colors hover:text-white">Home</Link>
              <Icon name="chevron-right" className="size-3.5" />
              <Link href="/activities" className="rounded-sm transition-colors hover:text-white">Activities</Link>
              <Icon name="chevron-right" className="size-3.5" />
              <span aria-current="page" className="max-w-52 truncate text-science-200 sm:max-w-md">{activity.title}</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1fr_.82fr] lg:items-center lg:gap-14">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge tone={activity.status === "upcoming" ? "teal" : "slate"}>{activity.status}</StatusBadge>
                  <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-science-200">{activity.category}</span>
                </div>
                <h1 className="mt-6 text-balance font-display text-4xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                  {activity.title}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{activity.excerpt}</p>

                <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Icon name="calendar" className="mt-0.5 size-5 text-teal-300" />
                    <div>
                      <dt className="text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-slate-500">Date</dt>
                      <dd className="mt-1 text-sm font-semibold text-white"><time dateTime={activity.date}>{activity.dateLabel}</time></dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Icon name="location" className="mt-0.5 size-5 text-teal-300" />
                    <div>
                      <dt className="text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-slate-500">Venue</dt>
                      <dd className="mt-1 text-sm font-semibold text-white">{activity.location}</dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {activity.status === "upcoming" && activity.registration && (
                    <ButtonLink
                      href={activity.registration.href}
                      external={activity.registration.external}
                      variant="secondary"
                      icon="arrow-right"
                    >
                      {activity.registration.label}
                    </ButtonLink>
                  )}
                  <ButtonLink href="/activities" variant="light" icon="arrow-left" iconPosition="left">
                    All activities
                  </ButtonLink>
                </div>
              </div>

              <figure className="overflow-hidden rounded-[2rem] border border-white/10 bg-navy-900 shadow-2xl shadow-black/25">
                <div className="relative aspect-[3/2]">
                  <Image
                    src={activity.image.src}
                    alt={activity.image.alt}
                    fill
                    preload
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="border-t border-white/10 px-5 py-4 text-xs leading-5 text-slate-400">
                  Illustrative Phase 1 activity visual; final event photography can replace it later.
                </figcaption>
              </figure>
            </div>
          </Container>
        </header>

        <section aria-labelledby="activity-overview" className="bg-white py-16 sm:py-20 lg:py-24">
          <Container className="grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
            <div>
              <p className="eyebrow">Activity brief</p>
              <h2 id="activity-overview" className="mt-4 font-display text-3xl font-extrabold tracking-[-0.035em] text-navy-950 sm:text-4xl">
                What participants can expect
              </h2>
              <div className="rich-text">
                {activity.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10 rounded-3xl border border-teal-200 bg-teal-50 p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                    <Icon name={activity.status === "upcoming" ? "target" : "check"} className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-teal-700">
                      {activity.status === "upcoming" ? "Learning goals" : "Recorded outcomes"}
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold text-navy-950">Programme highlights</h2>
                  </div>
                </div>
                <ul className="mt-6 grid gap-3">
                  {activity.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-sm leading-6 text-slate-700">
                      <Icon name="check" className="mt-0.5 size-5 text-teal-600" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside aria-label="Activity details" className="space-y-5">
              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-sm font-extrabold uppercase tracking-[0.12em] text-navy-950">Organized by</h2>
                <ul className="mt-4 space-y-3">
                  {activity.organizers.map((organizer) => (
                    <li key={organizer} className="flex gap-3 text-sm leading-6 text-slate-600">
                      <Icon name="users" className="mt-0.5 size-4 text-science-600" />
                      <span>{organizer}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
                <h2 className="text-sm font-extrabold uppercase tracking-[0.12em] text-navy-950">Topics</h2>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Activity tags">
                  {activity.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-science-200 bg-science-50 px-3 py-1.5 text-xs font-bold text-science-700">
                      {tag}
                    </li>
                  ))}
                </ul>
              </section>

              {relatedFestival && (
                <section className="science-grid-dark rounded-3xl bg-navy-900 p-6 text-white">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-teal-300">Related festival</p>
                  <h2 className="mt-3 font-display text-xl font-extrabold">{relatedFestival.shortTitle}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{relatedFestival.theme}</p>
                  <Link
                    href={`/festivals/${relatedFestival.slug}`}
                    className="mt-5 inline-flex items-center gap-2 rounded-sm text-sm font-bold text-science-200 transition-colors hover:text-white"
                  >
                    View festival <Icon name="arrow-right" className="size-4" />
                  </Link>
                </section>
              )}
            </aside>
          </Container>
        </section>

        {activity.status === "upcoming" && activity.registration && (
          <section id="register" aria-labelledby="registration-heading" className="border-y border-slate-200 bg-slate-50 py-12 sm:py-16">
            <Container>
              <div className="grid gap-6 rounded-[2rem] border border-science-200 bg-white p-7 shadow-soft sm:p-9 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-8">
                <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-science-50 text-science-700">
                  <Icon name="calendar" className="size-7" />
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-science-700">Phase 1 prototype</p>
                  <h2 id="registration-heading" className="mt-2 font-display text-2xl font-extrabold tracking-[-0.025em] text-navy-950">
                    {activity.registration.label}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Registration is shown for interface preview only. No form is connected and no participant data is collected in this phase.
                  </p>
                </div>
                <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-500" aria-disabled="true">
                  Form coming later <Icon name="clock" className="size-4" />
                </span>
              </div>
            </Container>
          </section>
        )}

        {activity.gallery.length > 0 && (
          <section aria-label="Activity gallery" className="science-grid bg-slate-50 py-16 sm:py-20 lg:py-24">
            <Container>
              <SectionHeading
                eyebrow="Activity gallery"
                title="A closer look at the programme."
                description="Illustrative placeholders establish the gallery layout until approved event photographs are available."
              />
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {activity.gallery.map((image, index) => (
                  <figure key={`${image.src}-${index}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
                    <div className="relative aspect-[3/2] overflow-hidden bg-navy-900">
                      <Image
                        src={image.src}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                    <figcaption className="px-5 py-4 text-sm leading-6 text-slate-600">{image.alt}</figcaption>
                  </figure>
                ))}
              </div>
            </Container>
          </section>
        )}
      </article>

      <section aria-label="More activities" className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Keep exploring" title="More club activities" />
            <ButtonLink href="/activities" variant="ghost" className="self-start sm:shrink-0">View the full archive</ButtonLink>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedActivities.map((item) => (
              <ActivityCard key={item.slug} activity={item} />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
