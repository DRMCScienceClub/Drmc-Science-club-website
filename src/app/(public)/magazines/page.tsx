import type { Metadata } from "next";
import Image from "next/image";
import { MagazineCard } from "@/components/features/magazine-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { auroraArchive } from "@/data";
import { getFeaturedMagazineRecord, getMagazines } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import type { MagazineIssue } from "@/types/content";

export const metadata: Metadata = {
  title: "Annual Science Magazine",
  description:
    "Browse annual issues of Aurora, the DRMC Science Club magazine, with student research, explainers, interviews, science writing, and illustration.",
  alternates: { canonical: "/magazines" },
  openGraph: {
    title: "Aurora · The Annual Magazine of DRMC Science Club",
    description:
      "Read the latest issue and explore an archive of student-led science communication from DRMC.",
    url: "/magazines",
    type: "website",
  },
};

export default async function MagazinesPage() {
  const magazines = await getMagazines();
  const featuredIssue = getFeaturedMagazineRecord(magazines);
  const archive = magazines.filter(
    (issue) => issue.year !== featuredIssue?.year,
  );

  return (
    <main>
      <PageHero
        eyebrow="Annual publication"
        title="Science, written with clarity and curiosity."
        description="Aurora brings together student research, accessible explainers, interviews, field notes, original illustration, and science writing in Bangla and English."
        icon="book"
      >
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          {featuredIssue && (
            <ButtonLink
              href={`/magazines/${featuredIssue.year}`}
              variant="secondary"
              icon="book"
            >
              Read the latest issue
            </ButtonLink>
          )}
          <ButtonLink href="#archive" variant="light" icon="calendar">
            View annual archive
          </ButtonLink>
        </div>
      </PageHero>

      {featuredIssue ? (
        <FeaturedIssue issue={featuredIssue} />
      ) : (
        <section className="site-surface py-18 sm:py-24">
          <Container>
            <EmptyState
              title="The next magazine is in development"
              description="The annual issue will appear here after editorial review and publication approval."
              icon="book"
            />
          </Container>
        </section>
      )}

      <section
        id="archive"
        className="science-grid border-y border-slate-200 bg-slate-50 py-18 sm:py-24"
      >
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionHeading
              eyebrow="Annual archive"
              title="A shelf of student questions."
              description="Each volume captures what DRMC students were investigating, building, reading, and debating in that publication year."
            />
            <dl className="grid grid-cols-2 gap-3 sm:min-w-72">
              <div className="surface-card rounded-2xl border border-surface-border px-5 py-4 shadow-card">
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Published volumes
                </dt>
                <dd className="mt-1 font-display text-3xl font-black text-science-700">
                  {auroraArchive.totalVolumes}
                </dd>
              </div>
              <div className="surface-card rounded-2xl border border-surface-border px-5 py-4 shadow-card">
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Digitised here
                </dt>
                <dd className="mt-1 font-display text-3xl font-black text-teal-700">
                  {magazines.length}
                </dd>
              </div>
            </dl>
          </div>

          {archive.length > 0 ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {archive.map((issue) => (
                <MagazineCard key={issue.year} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState
                title="Earlier issues are being digitised"
                description="More annual volumes will appear here as archival copies are reviewed."
                icon="book"
              />
            </div>
          )}

          <div
            data-reveal="up"
            className="mt-8 flex flex-col gap-5 rounded-3xl border border-gold-200 bg-gold-50 p-6 sm:flex-row sm:items-start sm:p-8"
          >
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-gold-600 shadow-sm">
              <Icon name="book" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-gold-600">
                Full Aurora record · 15 volumes
              </p>
              <h3 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.025em] text-navy-950">
                Earlier volumes are being prepared for the digital shelf.
              </h3>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                {auroraArchive.digitisedRange} are represented in this Phase 1 prototype. {auroraArchive.awaitingDigitisationRange} will be added only after their publication years, cover artwork, and reading files are verified from the club archive.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="site-surface py-18 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Editorial practice"
            title="From a promising idea to a useful page."
            description="The magazine prototype is designed around a careful, faculty-guided editorial process."
            align="center"
          />
          <ol className="mt-10 grid gap-px overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-200 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Question & propose",
                description:
                  "Student contributors begin with a focused idea, source plan, and the reader they want to serve.",
                icon: "lightbulb" as const,
              },
              {
                number: "02",
                title: "Verify & revise",
                description:
                  "Editors and faculty reviewers check claims, strengthen explanations, and identify uncertainty clearly.",
                icon: "microscope" as const,
              },
              {
                number: "03",
                title: "Design & publish",
                description:
                  "Writing, diagrams, photography, and accessible layouts come together in the annual issue.",
                icon: "book" as const,
              },
            ].map((step) => (
              <li key={step.number} className="bg-slate-50 p-7 sm:p-9">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-science-50 text-science-700">
                    <Icon name={step.icon} />
                  </span>
                  <span className="font-display text-3xl font-black text-slate-200">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-extrabold text-navy-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="science-grid-dark bg-navy-950 py-16 text-white sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <span className="eyebrow !text-science-200 before:!bg-teal-300">
              Contribute thoughtfully
            </span>
            <h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
              Good science communication begins with respect for the reader.
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              Current DRMC students can learn about editorial sessions, writing
              calls, and illustration opportunities through the club.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/join" variant="secondary">
              Join the club
            </ButtonLink>
            <ButtonLink href="/contact" variant="light">
              Contact the editors
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}

function FeaturedIssue({ issue }: { issue: MagazineIssue }) {
  return (
    <section className="site-surface overflow-hidden py-18 sm:py-24">
      <Container>
        <div className="science-grid-dark relative grid overflow-hidden rounded-[2rem] bg-navy-950 text-white shadow-soft lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="relative flex min-h-[460px] items-center justify-center overflow-hidden px-8 py-14 sm:min-h-[560px]">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 aspect-square w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-science-300/10"
            />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 aspect-square w-[58%] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-full border border-teal-300/20"
            />
            <div className="relative aspect-[3/4] w-full max-w-[290px] -rotate-2 overflow-hidden rounded-2xl border border-white/10 bg-navy-900 shadow-2xl shadow-black/40 transition-transform duration-500 hover:rotate-0">
              <Image
                src={issue.coverImage.src}
                alt={issue.coverImage.alt}
                fill
                preload
                sizes="290px"
                className="object-cover"
              />
            </div>
            <span className="absolute bottom-8 right-8 rounded-xl bg-teal-400 px-4 py-3 text-xs font-black uppercase tracking-wider text-navy-950 shadow-xl">
              {issue.pages} pages
            </span>
          </div>

          <div className="border-t border-white/10 p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-14">
            <span className="eyebrow !text-science-200 before:!bg-teal-300">
              Latest issue
            </span>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.14em] text-teal-300">
              {issue.volume} · Published {formatDate(issue.publishedAt)}
            </p>
            <h2 className="mt-3 font-display text-4xl font-black tracking-[-0.045em] sm:text-5xl">
              {issue.title}
            </h2>
            <p className="mt-2 text-xl font-bold text-science-300">
              {issue.subtitle}
            </p>
            <p className="mt-6 max-w-2xl leading-8 text-slate-300">
              {issue.description}
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {issue.highlights.slice(0, 4).map((highlight) => (
                <li
                  key={highlight}
                  className="flex gap-3 text-sm leading-6 text-slate-200"
                >
                  <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-teal-300">
                    <Icon name="check" className="size-3" />
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href={`/magazines/${issue.year}`}
                variant="secondary"
                icon="book"
              >
                Open the issue
              </ButtonLink>
              <ButtonLink href="#archive" variant="light">
                Browse archive
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
