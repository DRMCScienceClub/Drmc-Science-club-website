import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FestivalCard } from "@/components/features/festival-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  festivals,
  getCurrentOrUpcomingFestival,
  getFestivalArchive,
} from "@/data";

export const metadata: Metadata = {
  title: "Science Festivals",
  description:
    "Explore the current DRMC National Science Festival, competition segments, schedules, results, galleries, and past festival editions.",
  alternates: { canonical: "/festivals" },
  openGraph: {
    title: "DRMC National Science Festivals",
    description:
      "Student projects, olympiads, engineering challenges, and a growing archive of shared discovery at DRMC.",
    url: "/festivals",
    type: "website",
  },
};

export default function FestivalsPage() {
  const currentFestival = getCurrentOrUpcomingFestival();
  const archive = getFestivalArchive();

  return (
    <main>
      <PageHero
        eyebrow="National science festivals & carnivals"
        title="Ideas become experiments—and experiments become shared progress."
        description="Our flagship programme welcomes student scientists from across Bangladesh for project displays, olympiads, engineering challenges, and conversations grounded in evidence."
        icon="rocket"
      >
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          {currentFestival && (
            <ButtonLink
              href={`/festivals/${currentFestival.slug}`}
              variant="secondary"
            >
              Current edition
            </ButtonLink>
          )}
          <ButtonLink href="#archive" variant="light" icon="calendar">
            Browse the archive
          </ButtonLink>
        </div>
      </PageHero>

      <section className="bg-white py-18 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <SectionHeading
              eyebrow="Featured edition"
              title="The next horizon is already in view."
              description="Find dates, eligibility, registration guidance, and the complete programme for our current festival."
            />
            <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-200 pt-6 text-sm font-semibold text-slate-600 lg:justify-end">
              <span className="inline-flex items-center gap-2">
                <Icon name="users" className="size-4 text-science-600" />
                School & college divisions
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="trophy" className="size-4 text-science-600" />
                Multi-segment programme
              </span>
            </div>
          </div>

          {currentFestival ? (
            <FeaturedEdition festival={currentFestival} />
          ) : (
            <div className="mt-10">
              <EmptyState
                title="The next festival is being prepared"
                description="Dates and registration guidance will appear here after the programme is approved."
                action={{ label: "Explore past editions", href: "#archive" }}
              />
            </div>
          )}
        </Container>
      </section>

      <section
        id="archive"
        className="science-grid border-y border-slate-200 bg-slate-50 py-18 sm:py-24"
      >
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionHeading
              eyebrow="Festival archive"
              title="Every edition leaves a useful record."
              description="Revisit poster-backed themes, programme categories, available records, and visual highlights from past years."
            />
            <dl className="grid grid-cols-2 gap-3 sm:min-w-72">
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Editions shown
                </dt>
                <dd className="mt-1 font-display text-3xl font-black text-science-700">
                  {festivals.length}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Archive years
                </dt>
                <dd className="mt-1 font-display text-3xl font-black text-teal-700">
                  {archive.length}
                </dd>
              </div>
            </dl>
          </div>

          {archive.length > 0 ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {archive.map((festival) => (
                <FestivalCard
                  key={festival.slug}
                  festival={festival}
                  compact
                />
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState
                title="The festival archive is being catalogued"
                description="Past editions will appear here as their records are reviewed."
              />
            </div>
          )}
        </Container>
      </section>

      <section className="bg-navy-950 py-16 text-white sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <span className="eyebrow !text-science-200 before:!bg-teal-300">
              Build with us
            </span>
            <h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
              A festival is more than a competition.
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              It is a meeting place for careful questions, generous feedback,
              and student work that keeps improving after the awards are over.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/activities" variant="light">
              Explore club activities
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Contact the team
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}

function FeaturedEdition({
  festival,
}: {
  festival: NonNullable<ReturnType<typeof getCurrentOrUpcomingFestival>>;
}) {
  const registrationTone =
    festival.registration.status === "open" ? "teal" : "amber";

  return (
    <article className="mt-10 grid overflow-hidden rounded-[2rem] border border-slate-200 bg-navy-950 shadow-soft lg:grid-cols-[1.08fr_0.92fr]">
      <Link
        href={`/festivals/${festival.slug}`}
        className="group relative min-h-80 overflow-hidden lg:min-h-[540px]"
      >
        <Image
          src={festival.coverImage.src}
          alt={festival.coverImage.alt}
          fill
          preload
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-transparent to-transparent" />
        <p className="absolute bottom-6 left-6 rounded-full border border-white/20 bg-navy-950/70 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.13em] text-white backdrop-blur-md">
          {festival.edition} · {festival.year}
        </p>
      </Link>

      <div className="science-grid-dark flex flex-col justify-center p-7 sm:p-10 lg:p-12">
        <StatusBadge tone={registrationTone}>
          {festival.registration.label}
        </StatusBadge>
        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.14em] text-teal-300">
          {festival.theme}
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl">
          {festival.title}
        </h2>
        <p className="mt-5 text-sm leading-7 text-slate-300">
          {festival.summary}
        </p>
        <dl className="mt-7 grid gap-5 border-y border-white/10 py-6 text-sm sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="flex items-start gap-3">
            <Icon
              name="calendar"
              className="mt-0.5 size-5 text-science-300"
            />
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Dates
              </dt>
              <dd className="mt-1 font-semibold text-white">
                {festival.dateLabel}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon
              name="location"
              className="mt-0.5 size-5 text-science-300"
            />
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Venue
              </dt>
              <dd className="mt-1 font-semibold text-white">
                {festival.venue}
              </dd>
            </div>
          </div>
        </dl>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={`/festivals/${festival.slug}`}
            variant="secondary"
          >
            Explore the edition
          </ButtonLink>
          <ButtonLink
            href={`/festivals/${festival.slug}#segments`}
            variant="light"
          >
            View segments
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
