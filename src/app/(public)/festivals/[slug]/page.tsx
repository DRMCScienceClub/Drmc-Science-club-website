import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FestivalCard } from "@/components/features/festival-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { getFestival, getFestivals } from "@/lib/content";
import type {
  Festival,
  FestivalOrganization,
  RegistrationStatus,
} from "@/types/content";

type FestivalPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return (await getFestivals()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: FestivalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const festival = await getFestival(slug);

  if (!festival) {
    return {
      title: "Festival not found",
      description: "The requested DRMC Science Club festival could not be found.",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: festival.shortTitle,
    description: festival.summary,
    keywords: [
      festival.title,
      "DRMC National Science Festival",
      "science festival Bangladesh",
      ...festival.segments.map((segment) => segment.title),
    ],
    alternates: { canonical: `/festivals/${festival.slug}` },
    openGraph: {
      title: festival.title,
      description: festival.summary,
      url: `/festivals/${festival.slug}`,
      type: "website",
      images: [
        {
          url: festival.coverImage.src,
          width: festival.coverImage.width,
          height: festival.coverImage.height,
          alt: festival.coverImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: festival.title,
      description: festival.summary,
      images: [festival.coverImage.src],
    },
  };
}

export default async function FestivalDetailPage({
  params,
}: FestivalPageProps) {
  const { slug } = await params;
  const festival = await getFestival(slug);

  if (!festival) {
    notFound();
  }

  const usesPublishedProgramme =
    festival.segmentSource === "published-programme";

  const otherEditions = (await getFestivals())
    .filter((edition) => edition.slug !== festival.slug)
    .toSorted(
      (a, b) =>
        Math.abs(a.year - festival.year) - Math.abs(b.year - festival.year) ||
        b.year - a.year,
    )
    .slice(0, 2);

  return (
    <main>
      <FestivalHero festival={festival} />
      <FestivalSectionNav />

      <section id="overview" className="site-surface py-18 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <article>
            <span className="eyebrow">About this edition</span>
            <h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-[-0.035em] text-navy-950 sm:text-4xl">
              {festival.recordStatus === "poster-verified"
                ? "A preserved record of this edition."
                : "One theme, many ways to investigate it."}
            </h2>
            <div className="rich-text mt-5">
              {festival.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-surface-border bg-slate-200 shadow-card sm:grid-cols-2">
              <div className="bg-slate-50 p-6">
                <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                  Festival theme
                </dt>
                <dd className="mt-2 font-semibold leading-6 text-navy-900">
                  {festival.theme}
                </dd>
              </div>
              <div className="bg-slate-50 p-6">
                <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                  Venue address
                </dt>
                <dd className="mt-2 font-semibold leading-6 text-navy-900">
                  {festival.venueAddress}
                </dd>
              </div>
            </dl>
          </article>

          <RegistrationPanel festival={festival} />
        </Container>
      </section>

      <section
        id="segments"
        className="science-grid border-y border-slate-200 bg-slate-50 py-18 sm:py-24"
      >
        <Container>
          <SectionHeading
            eyebrow="Festival segments"
            title={
              festival.recordStatus === "poster-verified"
                ? usesPublishedProgramme
                  ? "The complete published programme, preserved."
                  : "Programme categories preserved from the poster."
                : "Choose the format that fits your question."
            }
            description={
              festival.recordStatus === "poster-verified"
                ? usesPublishedProgramme
                  ? "All 44 programme names are transcribed from the contemporaneous event listing; detailed rules are intentionally kept separate from this concise archive."
                  : "Names are transcribed from the supplied artwork; detailed rules and eligibility have not yet been digitised."
                : "Each segment tests a different scientific habit—from sustained investigation to fast reasoning and collaborative engineering."
            }
          />
          {festival.segments.length > 0 ? (
            <ol className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {festival.segments.map((segment, index) => (
                <li
                  key={segment.slug}
                  className="surface-card group flex h-full flex-col rounded-3xl border border-surface-border p-6 shadow-card transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-science-400 hover:shadow-soft sm:p-7"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-science-50 font-display text-sm font-black text-science-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-right text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-teal-700">
                      {segment.category}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-extrabold tracking-[-0.025em] text-navy-950">
                    {segment.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                    {segment.summary ??
                      (usesPublishedProgramme
                        ? "Recorded in the published event programme."
                        : "Listed on the supplied archive poster.")}
                  </p>
                  {(segment.eligibility || segment.teamSize || segment.fee) && (
                    <dl className="mt-6 grid gap-3 border-t border-slate-200 pt-5 text-sm">
                      {segment.eligibility && (
                        <div>
                          <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Eligibility
                          </dt>
                          <dd className="mt-1 font-semibold leading-5 text-slate-700">
                            {segment.eligibility}
                          </dd>
                        </div>
                      )}
                      {(segment.teamSize || segment.fee) && (
                        <div className="grid grid-cols-2 gap-3">
                          {segment.teamSize && (
                            <div>
                              <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Entry
                              </dt>
                              <dd className="mt-1 font-semibold text-slate-700">
                                {segment.teamSize}
                              </dd>
                            </div>
                          )}
                          {segment.fee && (
                            <div>
                              <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Fee
                              </dt>
                              <dd className="mt-1 font-semibold text-slate-700">
                                {segment.fee}
                              </dd>
                            </div>
                          )}
                        </div>
                      )}
                    </dl>
                  )}
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-10">
              <EmptyState
                title={
                  festival.recordStatus === "poster-verified"
                    ? "Segment list not yet digitised"
                    : "Segment details are being finalised"
                }
                description={
                  festival.recordStatus === "poster-verified"
                    ? "The supplied artwork does not provide a readable programme list for this archive record."
                    : "Competition categories and eligibility will be published after approval."
                }
              />
            </div>
          )}
        </Container>
      </section>

      <section id="schedule" className="site-surface py-18 sm:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <SectionHeading
              eyebrow="Festival schedule"
              title={
                festival.recordStatus === "poster-verified"
                  ? "Detailed timetable not yet digitised."
                  : "A clear path through two full days."
              }
              description={
                festival.recordStatus === "poster-verified"
                  ? "The poster verifies the festival dates, but not a session-by-session schedule."
                  : "Published times are shown in Bangladesh Standard Time and remain subject to official confirmation."
              }
            />
            {festival.schedule.length > 0 ? (
              <div className="grid gap-6">
                {festival.schedule.map((day, dayIndex) => (
                  <article
                    key={day.date}
                    className="overflow-hidden rounded-3xl border border-surface-border bg-slate-50 shadow-card"
                  >
                    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-navy-950 px-6 py-5 text-white">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-teal-300">
                          Day {dayIndex + 1}
                        </p>
                        <h3 className="mt-1 font-display text-xl font-extrabold">
                          {day.label}
                        </h3>
                      </div>
                      <time
                        dateTime={day.date}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-science-100"
                      >
                        {day.date}
                      </time>
                    </header>
                    <ol className="divide-y divide-slate-200 px-6">
                      {day.items.map((item) => (
                        <li
                          key={`${item.time}-${item.title}`}
                          className="grid gap-3 py-5 sm:grid-cols-[5.5rem_1fr]"
                        >
                          <time
                            dateTime={`${day.date}T${item.time}:00+06:00`}
                            className="font-display text-lg font-black text-science-700"
                          >
                            {item.time}
                          </time>
                          <div>
                            <h4 className="font-bold text-navy-950">
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="mt-1 text-sm leading-6 text-slate-600">
                                {item.description}
                              </p>
                            )}
                            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                              <Icon name="location" className="size-3.5" />
                              {item.venue}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title={
                  festival.recordStatus === "poster-verified"
                    ? "Archive schedule unavailable"
                    : "Schedule publication pending"
                }
                description={
                  festival.recordStatus === "poster-verified"
                    ? "A verified day-by-day programme was not supplied with this poster."
                    : "The full programme will appear here when festival timings are confirmed."
                }
                icon="calendar"
              />
            )}
          </div>
        </Container>
      </section>

      <section
        id="results"
        className="border-y border-slate-200 bg-slate-50 py-18 sm:py-24"
      >
        <Container>
          <SectionHeading
            eyebrow="Results"
            title={
              festival.results.length > 0
                ? "Celebrating thoughtful work and strong execution."
                : festival.recordStatus === "poster-verified"
                  ? "Results not yet digitised."
                  : "Results will follow the final round."
            }
            description={festival.resultsNote}
          />
          {festival.results.length > 0 ? (
            <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {festival.results.map((result, index) => (
                <li
                  key={`${result.segment}-${result.position}-${result.recipient}`}
                  className="surface-card relative overflow-hidden rounded-3xl border border-surface-border p-6 shadow-card"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -right-3 -top-6 font-display text-8xl font-black text-science-50"
                  >
                    {index + 1}
                  </span>
                  <div className="relative">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <Icon name="trophy" />
                    </span>
                    <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.12em] text-teal-700">
                      {result.position}
                    </p>
                    <h3 className="mt-2 text-lg font-extrabold text-navy-950">
                      {result.recipient}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {result.institution}
                    </p>
                    <p className="mt-5 border-t border-slate-100 pt-4 text-xs font-bold uppercase tracking-wider text-science-700">
                      {result.segment}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="surface-card mt-10 overflow-hidden rounded-[2rem] border border-science-300 shadow-card">
              <div className="h-1.5 bg-gradient-to-r from-science-500 via-teal-400 to-science-300" />
              <div className="px-6 py-4 text-center sm:px-10 sm:py-6">
                <EmptyState
                  title={
                    festival.recordStatus === "poster-verified"
                      ? "Archive results unavailable"
                      : "Results pending"
                  }
                  description={festival.resultsNote}
                  icon="trophy"
                  action={
                    festival.recordStatus === "prototype"
                      ? { label: "Review the schedule", href: "#schedule" }
                      : undefined
                  }
                />
              </div>
            </div>
          )}
        </Container>
      </section>

      <section
        id="partners"
        className="science-grid relative overflow-hidden border-y border-slate-200 bg-slate-50 py-18 sm:py-24"
      >
        <div
          aria-hidden="true"
          className="absolute -right-24 top-16 size-80 rounded-full bg-teal-200/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -left-24 bottom-20 size-72 rounded-full bg-science-200/20 blur-3xl"
        />
        <Container className="relative">
          <SectionHeading
            eyebrow="Sponsors & partners"
            title="Made possible through shared investment in science."
            description={
              festival.recordStatus === "poster-verified"
                ? "These sponsor and partner acknowledgements are transcribed from the supplied event artwork."
                : "Approved sponsor and partner acknowledgements for this edition are listed below."
            }
          />
          <div className="mt-10">
            <OrganizationGroup
              title="Festival sponsors"
              eyebrow="Principal support"
              description="The organizations presented, powered, and supported this edition at its principal sponsorship tiers."
              organizations={festival.sponsors}
              featured
            />
          </div>
          <div className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-12">
            <OrganizationGroup
              title="Programme partners"
              eyebrow="Across the programme"
              description="Specialist, academic, media, hospitality, and production partners helped bring the wider carnival experience together."
              organizations={festival.partners}
            />
          </div>
        </Container>
      </section>

      <section
        id="gallery"
        className="science-grid-dark bg-navy-950 py-18 text-white sm:py-24"
      >
        <Container>
          <SectionHeading
            eyebrow="Festival gallery"
            title="A closer look at the work behind the programme."
            description={
              festival.recordStatus === "poster-verified"
                ? "The supplied poster anchors this archive entry while approved event photography is catalogued."
                : "Approved, consent-cleared festival photography is collected here."
            }
            inverse
          />
          {festival.gallery.length > 0 ? (
            <div className="mt-10 grid auto-rows-[210px] gap-4 sm:grid-cols-2 sm:auto-rows-[260px] lg:grid-cols-3">
              {festival.gallery.map((image, index) => (
                <figure
                  key={`${image.src}-${index}`}
                  className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-navy-900 ${index === 0 ? "sm:col-span-2 lg:row-span-2 lg:min-h-[536px]" : ""}`}
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes={
                      index === 0
                        ? "(min-width: 1024px) 66vw, 100vw"
                        : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    }
                    className={
                      festival.recordStatus === "poster-verified"
                        ? "object-contain"
                        : "object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    }
                  />
                  {festival.recordStatus === "poster-verified" ? (
                    <figcaption className="sr-only">{image.alt}</figcaption>
                  ) : (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 to-transparent px-5 pb-5 pt-16 text-xs font-semibold leading-5 text-slate-200">
                      {image.alt}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState
                title="Gallery coming soon"
                description="Approved festival photographs will be published here."
              />
            </div>
          )}
        </Container>
      </section>

      <section id="resources" className="site-surface py-18 sm:py-24">
        <Container>
          <div className="grid overflow-hidden rounded-[2rem] border border-surface-border bg-slate-50 shadow-soft lg:grid-cols-[0.92fr_1.08fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <span className="eyebrow">Festival resources</span>
              <h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-[-0.035em] text-navy-950 sm:text-4xl">
                Keep the rules close at hand.
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                {festival.recordStatus === "poster-verified"
                  ? "A verified brochure or rulebook was not supplied with this archive record. Approved historical files can be attached here later."
                  : "Official brochure and rulebook files for this edition are available below."}
              </p>
            </div>
            <div className="grid gap-4 border-t border-slate-200 bg-white p-7 sm:grid-cols-2 sm:p-10 lg:border-l lg:border-t-0">
              {festival.brochure && (
                <ResourceLink
                  href={festival.brochure.href}
                  label={festival.brochure.label}
                  type="Festival overview"
                />
              )}
              {festival.rulebook && (
                <ResourceLink
                  href={festival.rulebook.href}
                  label={festival.rulebook.label}
                  type="Rules & eligibility"
                />
              )}
              {!festival.brochure && !festival.rulebook && (
                <div className="sm:col-span-2">
                  <EmptyState
                    title={
                      festival.recordStatus === "poster-verified"
                        ? "Archive documents unavailable"
                        : "Resources are being prepared"
                    }
                    description={
                      festival.recordStatus === "poster-verified"
                        ? "No verified brochure or rulebook accompanied the supplied poster."
                        : "Approved festival documents will be published here."
                    }
                    icon="book"
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {otherEditions.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-18 sm:py-24">
          <Container>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Continue exploring"
                title="More festival editions"
                description="Compare themes, programmes, and outcomes across the archive."
              />
              <ButtonLink
                href="/festivals"
                variant="outline"
                className="self-start sm:shrink-0"
              >
                Full archive
              </ButtonLink>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {otherEditions.map((edition) => (
                <FestivalCard
                  key={edition.slug}
                  festival={edition}
                  compact
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}

function FestivalHero({ festival }: { festival: Festival }) {
  const isArchivePoster = festival.recordStatus === "poster-verified";

  return (
    <section className="science-grid-dark relative overflow-hidden bg-navy-950 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_82%_30%,rgba(35,135,242,0.19),transparent_33%),radial-gradient(circle_at_12%_85%,rgba(25,166,154,0.12),transparent_27%)]"
      />
      <Container className="relative py-12 sm:py-16 lg:py-20">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-slate-400"
        >
          <Link
            href="/"
            className="rounded-sm transition-colors hover:text-white"
          >
            Home
          </Link>
          <Icon name="chevron-right" className="size-3.5" />
          <Link
            href="/festivals"
            className="rounded-sm transition-colors hover:text-white"
          >
            Festivals
          </Link>
          <Icon name="chevron-right" className="size-3.5" />
          <span aria-current="page" className="text-science-200">
            {festival.year}
          </span>
        </nav>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone={festival.status === "upcoming" ? "teal" : "slate"}>
                {festival.status}
              </StatusBadge>
              <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-science-200">
                {festival.edition} · {festival.year}
              </span>
            </div>
            <h1 className="mt-6 text-balance font-display text-4xl font-black leading-[1.05] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              {festival.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-bold leading-7 text-teal-300">
              {festival.theme}
            </p>
            <p className="mt-5 max-w-2xl leading-8 text-slate-300">
              {festival.summary}
            </p>

            <dl className="mt-8 grid gap-4 border-y border-white/10 py-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Icon name="calendar" className="mt-0.5 text-science-300" />
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Festival dates
                  </dt>
                  <dd className="mt-1 font-semibold text-white">
                    {festival.dateLabel}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="location" className="mt-0.5 text-science-300" />
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

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#segments" variant="secondary">
                Explore segments
              </ButtonLink>
              {festival.schedule.length > 0 ? (
                <ButtonLink href="#schedule" variant="light" icon="calendar">
                  View schedule
                </ButtonLink>
              ) : (
                <ButtonLink href="#partners" variant="light">
                  Sponsors & partners
                </ButtonLink>
              )}
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-xl">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rotate-2 rounded-[2.25rem] border border-science-300/15 bg-white/[0.025]"
            />
            <div
              className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-navy-900 shadow-2xl shadow-black/30 ${isArchivePoster ? "" : "aspect-[4/3]"}`}
              style={
                isArchivePoster
                  ? {
                      aspectRatio: `${festival.coverImage.width} / ${festival.coverImage.height}`,
                    }
                  : undefined
              }
            >
              <Image
                src={festival.coverImage.src}
                alt={festival.coverImage.alt}
                fill
                preload
                sizes="(min-width: 1024px) 48vw, 100vw"
                className={isArchivePoster ? "object-contain" : "object-cover"}
              />
            </div>
            {isArchivePoster ? (
              <figcaption className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.12em] text-science-100">
                Supplied festival poster · poster-backed archive
              </figcaption>
            ) : (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 to-transparent p-6 pt-20 text-xs font-semibold uppercase tracking-[0.12em] text-science-100">
                Festival cover artwork
              </figcaption>
            )}
          </figure>
        </div>
      </Container>
    </section>
  );
}

function FestivalSectionNav() {
  const links = [
    ["Overview", "#overview"],
    ["Segments", "#segments"],
    ["Schedule", "#schedule"],
    ["Results", "#results"],
    ["Partners", "#partners"],
    ["Gallery", "#gallery"],
    ["Resources", "#resources"],
  ] as const;

  return (
    <div className="border-b border-slate-200 bg-white">
      <nav aria-label="Festival page sections">
        <Container>
          <ul className="flex snap-x gap-7 overflow-x-auto py-4 text-sm font-bold text-slate-600 [scrollbar-width:none]">
            {links.map(([label, href]) => (
              <li key={href} className="shrink-0 snap-start">
                <a
                  href={href}
                  className="rounded-sm transition-colors hover:text-science-700"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </div>
  );
}

function RegistrationPanel({ festival }: { festival: Festival }) {
  const registration = festival.registration;

  return (
    <aside
      id="register"
      className="h-fit overflow-hidden rounded-3xl border border-slate-200 bg-navy-950 text-white shadow-soft lg:sticky lg:top-28"
    >
      <div className="science-grid-dark p-7">
        <StatusBadge tone={getRegistrationTone(registration.status)}>
          {registration.label}
        </StatusBadge>
        <h2 className="mt-5 font-display text-2xl font-extrabold">
          Registration
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {registration.note}
        </p>
        {(registration.opensAt || registration.closesAt) && (
          <dl className="mt-6 grid gap-4 border-y border-white/10 py-5 text-sm">
            {registration.opensAt && (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Opens
                </dt>
                <dd className="mt-1 font-semibold text-white">
                  <time dateTime={registration.opensAt}>
                    {formatRegistrationDate(registration.opensAt)}
                  </time>
                </dd>
              </div>
            )}
            {registration.closesAt && (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Closes
                </dt>
                <dd className="mt-1 font-semibold text-white">
                  <time dateTime={registration.closesAt}>
                    {formatRegistrationDate(registration.closesAt)}
                  </time>
                </dd>
              </div>
            )}
          </dl>
        )}
        {registration.href && registration.status === "open" && (
          <ButtonLink
            href={registration.href}
            variant="secondary"
            className="mt-6 w-full"
            icon="external"
          >
            Open registration
          </ButtonLink>
        )}
      </div>
    </aside>
  );
}

function OrganizationGroup({
  title,
  eyebrow,
  description,
  organizations,
  featured = false,
}: {
  title: string;
  eyebrow: string;
  description: string;
  organizations: FestivalOrganization[];
  featured?: boolean;
}) {
  return (
    <section
      className={
        featured
          ? "science-grid-dark overflow-hidden rounded-[2rem] border border-navy-700 bg-navy-950 p-5 shadow-soft sm:p-7 lg:p-8"
          : undefined
      }
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p
            className={`text-[0.7rem] font-extrabold uppercase tracking-[0.14em] ${featured ? "text-teal-300" : "text-science-700"}`}
          >
            {eyebrow}
          </p>
          <h3
            className={`mt-2 font-display text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl ${featured ? "text-white" : "text-navy-950"}`}
          >
            {title}
          </h3>
          <p
            className={`mt-2 text-sm leading-6 ${featured ? "text-slate-300" : "text-slate-600"}`}
          >
            {description}
          </p>
        </div>
        <span
          className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.11em] ${featured ? "border border-white/10 bg-white/10 text-teal-300" : "border border-science-200 bg-science-50 text-science-700"}`}
        >
          {organizations.length} {organizations.length === 1 ? "organization" : "organizations"}
        </span>
      </div>

      {organizations.length > 0 ? (
        <ul
          className={`mt-6 grid gap-5 ${featured ? (organizations.length === 2 ? "mx-auto max-w-4xl md:grid-cols-2" : "md:grid-cols-3") : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}
        >
          {organizations.map((organization) => (
            <li
              key={`${organization.name}-${organization.role}`}
              className={`group overflow-hidden rounded-3xl border shadow-card ${featured ? "border-white/10 bg-navy-900" : "border-surface-border bg-white"}`}
            >
              <div
                className={`relative flex items-center justify-center overflow-hidden ${organization.logo ? "" : "aspect-[5/4]"} ${featured ? "bg-navy-900" : "bg-navy-950"}`}
                style={
                  organization.logo
                    ? {
                        aspectRatio: `${organization.logo.width} / ${organization.logo.height}`,
                      }
                    : undefined
                }
              >
                {organization.logo ? (
                  <Image
                    src={organization.logo.src}
                    alt={organization.logo.alt}
                    fill
                    sizes={
                      featured
                        ? "(min-width: 1024px) 30vw, (min-width: 768px) 32vw, 100vw"
                        : "(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                    }
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-navy-900 via-navy-950 to-navy-800">
                    <span className="font-display text-5xl font-black tracking-[-0.08em] text-teal-300">
                      {organization.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>
              <div className="p-4 sm:p-5">
                <p
                  className={`text-[0.65rem] font-extrabold uppercase tracking-[0.12em] ${featured ? "text-teal-300" : "text-science-700"}`}
                >
                  {organization.role}
                </p>
                <h4
                  className={`mt-1.5 font-display text-lg font-extrabold leading-6 tracking-[-0.02em] ${featured ? "text-white" : "text-navy-950"}`}
                >
                  {organization.name}
                </h4>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
          Acknowledgements will be added after confirmation.
        </p>
      )}
    </section>
  );
}

function ResourceLink({
  href,
  label,
  type,
}: {
  href: string;
  label: string;
  type: string;
}) {
  return (
    <a
      href={href}
      download
      className="group flex min-h-48 flex-col justify-between rounded-3xl border border-surface-border bg-slate-50 p-6 shadow-card transition-colors hover:border-science-400 hover:bg-science-50"
    >
      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white text-science-700 shadow-sm">
        <Icon name="download" />
      </span>
      <span className="mt-8">
        <span className="block text-xs font-extrabold uppercase tracking-[0.12em] text-teal-700">
          {type} · PDF
        </span>
        <span className="mt-2 block font-bold leading-6 text-navy-950 group-hover:text-science-700">
          {label}
        </span>
      </span>
    </a>
  );
}

function getRegistrationTone(
  status: RegistrationStatus,
): "teal" | "amber" | "slate" {
  if (status === "open") return "teal";
  if (status === "opening-soon") return "amber";
  return "slate";
}

function formatRegistrationDate(date: string) {
  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
    timeZoneName: "short",
  }).format(new Date(date));
}
