import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MagazineCard } from "@/components/features/magazine-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMagazine, getMagazines } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import type { MagazineIssue } from "@/types/content";

type MagazinePageProps = {
  params: Promise<{ year: string }>;
};

export async function generateStaticParams() {
  return (await getMagazines()).map(({ year }) => ({ year: String(year) }));
}

export async function generateMetadata({
  params,
}: MagazinePageProps): Promise<Metadata> {
  const { year } = await params;
  const issue = await getMagazine(year);

  if (!issue) {
    return {
      title: "Magazine issue not found",
      description: "The requested DRMC Science Club magazine issue was not found.",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${issue.title} · ${issue.subtitle}`,
    description: issue.description,
    keywords: [
      issue.title,
      "Aurora magazine",
      "DRMC Science Club magazine",
      "student science writing Bangladesh",
    ],
    alternates: { canonical: `/magazines/${issue.year}` },
    openGraph: {
      title: `${issue.title}: ${issue.subtitle}`,
      description: issue.description,
      url: `/magazines/${issue.year}`,
      type: "article",
      publishedTime: issue.publishedAt,
      images: [
        {
          url: issue.coverImage.src,
          width: issue.coverImage.width,
          height: issue.coverImage.height,
          alt: issue.coverImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${issue.title}: ${issue.subtitle}`,
      description: issue.description,
      images: [issue.coverImage.src],
    },
  };
}

export default async function MagazineDetailPage({
  params,
}: MagazinePageProps) {
  const { year } = await params;
  const issue = await getMagazine(year);

  if (!issue) {
    notFound();
  }

  const otherIssues = (await getMagazines())
    .filter((magazine) => magazine.year !== issue.year)
    .slice(0, 2);

  return (
    <main>
      <MagazineHero issue={issue} />

      <section className="site-surface py-18 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_21rem] lg:gap-16">
          <article>
            <span className="eyebrow">About the issue</span>
            <h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-[-0.035em] text-navy-950 sm:text-4xl">
              A yearly record of what made us look twice.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {issue.description}
            </p>

            <div className="mt-10">
              <h3 className="text-sm font-extrabold uppercase tracking-[0.13em] text-teal-700">
                Inside this issue
              </h3>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {issue.highlights.map((highlight, index) => (
                  <li
                    key={highlight}
                    className="flex gap-4 rounded-2xl border border-surface-border bg-slate-50 p-5 shadow-card"
                  >
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-science-100 font-display text-xs font-black text-science-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-slate-700">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 rounded-3xl border border-science-200 bg-science-50 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-science-700 shadow-sm">
                  <Icon name="shield" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-extrabold text-navy-950">
                    Publication note
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Covers, reader links, and PDF files are published only after
                    editorial and institutional approval.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <aside className="h-fit rounded-3xl border border-surface-border bg-slate-50 p-7 shadow-card lg:sticky lg:top-28">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-science-100 text-science-700">
              <Icon name="book" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-extrabold text-navy-950">
              Publication details
            </h2>
            <dl className="mt-6 divide-y divide-slate-200 text-sm">
              <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
                <dt className="font-semibold text-slate-500">Year</dt>
                <dd className="font-extrabold text-navy-950">{issue.year}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="font-semibold text-slate-500">Edition</dt>
                <dd className="font-extrabold text-navy-950">
                  {issue.volume}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="font-semibold text-slate-500">Published</dt>
                <dd className="text-right font-extrabold text-navy-950">
                  <time dateTime={issue.publishedAt}>
                    {formatDate(issue.publishedAt)}
                  </time>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3 last:pb-0">
                <dt className="font-semibold text-slate-500">Length</dt>
                <dd className="font-extrabold text-navy-950">
                  {issue.pages} pages
                </dd>
              </div>
            </dl>
            <div className="mt-7 grid gap-3">
              <ButtonLink
                href={issue.readOnline.href}
                variant="primary"
                icon="book"
              >
                {issue.readOnline.label}
              </ButtonLink>
              <a
                href={issue.downloadPdf.href}
                download
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-navy-900 transition-colors hover:border-science-300 hover:bg-science-50"
              >
                <Icon name="download" className="size-4" />
                {issue.downloadPdf.label}
              </a>
            </div>
          </aside>
        </Container>
      </section>

      <section
        id="reader"
        className="science-grid border-y border-slate-200 bg-slate-50 py-18 sm:py-24"
      >
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Online reading"
              title="Explore the issue."
              description="Preview the issue’s contents below. Full reading resources will be available once the approved digital edition is published."
            />
            <span className="inline-flex self-start rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.11em] text-amber-800">
              Contents preview
            </span>
          </div>

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-navy-950 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 text-white sm:px-7">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-white/5 text-science-300">
                  <Icon name="book" className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-bold">{issue.title}</p>
                  <p className="text-xs text-slate-400">{issue.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <button
                  type="button"
                  disabled
                  className="rounded-lg border border-white/10 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  Previous
                </button>
                <span className="px-2">01 / {issue.pages}</span>
                <button
                  type="button"
                  disabled
                  className="rounded-lg border border-white/10 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="grid min-h-[520px] place-items-center bg-[radial-gradient(circle_at_50%_30%,rgba(35,135,242,0.12),transparent_34%)] p-5 sm:p-10">
              <article className="relative w-full max-w-3xl overflow-hidden rounded-sm bg-white px-7 py-10 shadow-2xl sm:px-14 sm:py-16">
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 h-1.5 w-1/3 bg-gradient-to-l from-teal-400 to-science-500"
                />
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-science-700">
                  Reader preview · Contents
                </p>
                <h2 className="mt-4 font-display text-3xl font-black tracking-[-0.035em] text-navy-950 sm:text-4xl">
                  {issue.subtitle}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Browse selected highlights from this issue. The full magazine
                  is not available in this contents preview.
                </p>
                <ol className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
                  {issue.highlights.slice(0, 3).map((highlight, index) => (
                    <li
                      key={highlight}
                      className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 py-4 text-sm"
                    >
                      <span className="font-display font-black text-science-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-semibold text-navy-900">
                        {highlight}
                      </span>
                      <span className="text-xs font-bold text-slate-400">—</span>
                    </li>
                  ))}
                </ol>
              </article>
            </div>
          </div>
        </Container>
      </section>

      {otherIssues.length > 0 && (
        <section className="site-surface py-18 sm:py-24">
          <Container>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Magazine archive"
                title="Continue through the annual issues."
                description="Every volume approaches science from a different editorial theme."
              />
              <ButtonLink
                href="/magazines"
                variant="outline"
                className="self-start sm:shrink-0"
              >
                View all issues
              </ButtonLink>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {otherIssues.map((magazine) => (
                <MagazineCard key={magazine.year} issue={magazine} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}

function MagazineHero({ issue }: { issue: MagazineIssue }) {
  return (
    <section className="science-grid-dark relative overflow-hidden bg-navy-950 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_76%_42%,rgba(35,135,242,0.2),transparent_34%),radial-gradient(circle_at_15%_80%,rgba(25,166,154,0.12),transparent_28%)]"
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
            href="/magazines"
            className="rounded-sm transition-colors hover:text-white"
          >
            Magazines
          </Link>
          <Icon name="chevron-right" className="size-3.5" />
          <span aria-current="page" className="text-science-200">
            {issue.year}
          </span>
        </nav>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:gap-20">
          <figure className="relative mx-auto w-full max-w-[340px] lg:mx-0">
            <div
              aria-hidden="true"
              className="absolute -inset-5 rotate-3 rounded-[2rem] border border-science-300/15 bg-science-500/5"
            />
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-navy-900 shadow-2xl shadow-black/40">
              <Image
                src={issue.coverImage.src}
                alt={issue.coverImage.alt}
                fill
                preload
                sizes="(min-width: 1024px) 340px, 78vw"
                className="object-cover"
              />
            </div>
            <figcaption className="absolute -bottom-4 -right-3 rounded-xl bg-teal-400 px-4 py-3 text-xs font-black uppercase tracking-wider text-navy-950 shadow-xl sm:-right-5">
              {issue.pages} pages
            </figcaption>
          </figure>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-science-300/20 bg-white/5 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.13em] text-science-200">
                Annual issue · {issue.year}
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                {issue.volume}
              </span>
            </div>
            <h1 className="mt-6 text-balance font-display text-5xl font-black tracking-[-0.055em] sm:text-6xl">
              {issue.title}
            </h1>
            <p className="mt-3 text-2xl font-bold text-teal-300 sm:text-3xl">
              {issue.subtitle}
            </p>
            <p className="mt-6 max-w-2xl leading-8 text-slate-300">
              {issue.description}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400">
              <Icon name="calendar" className="size-4 text-science-300" />
              Published {formatDate(issue.publishedAt)}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href={issue.readOnline.href}
                variant="secondary"
                icon="book"
              >
                Read online
              </ButtonLink>
              <a
                href={issue.downloadPdf.href}
                download
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-navy-950 shadow-lg shadow-black/10 transition-colors hover:bg-science-50"
              >
                <Icon name="download" className="size-4" />
                PDF · Preview
              </a>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Preview resources only; the final issue file is not yet available.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
