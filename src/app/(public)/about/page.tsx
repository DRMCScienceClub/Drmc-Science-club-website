import type { Metadata } from "next";
import Image from "next/image";
import { LogoMark } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  clubPillars,
  getCurrentExecutivePanel,
  getFeaturedFestival,
  getFeaturedMagazine,
  siteConfig,
} from "@/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the purpose, history, values, programme structure, and institutional relationship of DRMC Science Club.",
  alternates: { canonical: "/about" },
};

const pillarIcons: IconName[] = ["target", "flask", "users"];

export default function AboutPage() {
  const panel = getCurrentExecutivePanel();
  const festival = getFeaturedFestival();
  const magazine = getFeaturedMagazine();
  const committeeMembers =
    panel?.departments.flatMap((department) => department.members) ?? [];
  const committeePreview = committeeMembers.slice(0, 4);

  return (
    <main>
      <PageHero
        eyebrow="About"
        title="A place to practise scientific thinking."
        description={siteConfig.description}
        icon="atom"
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 sm:min-w-64">
          <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-slate-400">Established</p>
          <p className="mt-1 font-display text-4xl font-black tracking-tight text-teal-300">{siteConfig.established}</p>
          <p className="mt-2 text-sm text-slate-300">at {siteConfig.institution}</p>
        </div>
      </PageHero>

      <section aria-label="Our purpose" className="site-surface py-16 sm:py-20 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-start lg:gap-16">
          <SectionHeading
            eyebrow="Our purpose"
            title="Curiosity is the beginning, not the finish line."
            description="The club creates room for students to move from an interesting question to a method, an observation, and a result they can communicate clearly."
          />
          <div className="rounded-[2rem] border border-surface-border bg-slate-50 p-7 shadow-soft sm:p-9">
            <LogoMark className="size-14" />
            <blockquote className="mt-6 text-balance font-display text-2xl font-extrabold leading-snug tracking-[-0.025em] text-navy-950 sm:text-3xl">
              “Questioning carefully, building responsibly and sharing what we discover.”
            </blockquote>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              This public archive connects verified club programmes, annual festivals, student achievements, publications, and executive teams in one place.
            </p>
          </div>
        </Container>
      </section>

      <section aria-label="Club history" className="science-grid-dark overflow-hidden bg-navy-950 py-16 text-white sm:py-20 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.04fr_.96fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="History in progress"
              title="Built year by year, documented for what comes next."
              description={`The club record begins with its ${siteConfig.established} establishment year and continues through recurring programmes, festival editions, achievements, and annual student publishing.`}
              inverse
            />
            <dl className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
              <div className="bg-navy-900 p-5">
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Established</dt>
                <dd className="mt-2 text-2xl font-extrabold text-teal-300">{siteConfig.established}</dd>
              </div>
              <div className="bg-navy-900 p-5">
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Latest festival</dt>
                <dd className="mt-2 text-2xl font-extrabold text-science-300">{festival?.edition ?? "To be announced"}</dd>
              </div>
              <div className="bg-navy-900 p-5">
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Latest magazine</dt>
                <dd className="mt-2 text-2xl font-extrabold text-science-300">{magazine?.volume ?? "Archive pending"}</dd>
              </div>
            </dl>
            <p className="mt-5 text-xs leading-5 text-slate-400">
              The festival edition is taken from supplied official artwork; unverified historical details remain unpublished.
            </p>
          </div>

          {festival && (
            <figure className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-navy-900 shadow-2xl shadow-black/20">
              <div className="relative aspect-[16/11]">
                <Image
                  src={festival.coverImage.src}
                  alt={festival.coverImage.alt}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="border-t border-white/10 px-6 py-5 text-sm leading-6 text-slate-300">
                {festival.shortTitle} is the newest poster-verified festival record in the archive.
              </figcaption>
            </figure>
          )}
        </Container>
      </section>

      <section aria-label="Club values" className="science-grid border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Club pillars"
            title="Three habits behind every programme."
            description="These principles shape how an idea is investigated, built, reviewed, and shared with others."
            align="center"
          />
          <div className="mt-11 grid gap-5 lg:grid-cols-3">
            {clubPillars.map((pillar, index) => (
              <article key={pillar.title} className="surface-card relative overflow-hidden rounded-3xl border border-surface-border p-7 shadow-card sm:p-8">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-science-50 text-science-700">
                  <Icon name={pillarIcons[index]} className="size-6" />
                </span>
                <p className="absolute right-6 top-5 font-display text-5xl font-black text-slate-100" aria-hidden="true">
                  0{index + 1}
                </p>
                <h2 className="mt-6 font-display text-2xl font-extrabold tracking-[-0.025em] text-navy-950">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-label="How the club works" className="site-surface py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="How the club works"
                title="Student teams, connected by one programme."
                description={panel?.summary ?? "The executive structure will appear here when the current panel is published."}
              />
              {panel && (
                <dl className="mt-7 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-surface-border bg-slate-50 px-4 py-4 shadow-card">
                    <dt className="text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-slate-500">
                      Student officers
                    </dt>
                    <dd className="mt-1 font-display text-3xl font-black tracking-tight text-navy-950">
                      {committeeMembers.length}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-surface-border bg-slate-50 px-4 py-4 shadow-card">
                    <dt className="text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-slate-500">
                      Current session
                    </dt>
                    <dd className="mt-2 font-display text-xl font-extrabold tracking-tight text-teal-700">
                      {panel.session}
                    </dd>
                  </div>
                </dl>
              )}
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href="/executives" variant="outline">Meet the executive panel</ButtonLink>
                <ButtonLink href="/activities" variant="ghost">See the work</ButtonLink>
              </div>
            </div>

            {panel && (
              <article className="surface-card overflow-hidden rounded-[2rem] border border-surface-border shadow-soft">
                <div className="science-grid-dark relative aspect-[16/9] overflow-hidden bg-navy-950">
                  {panel.groupImage ? (
                    <Image
                      src={panel.groupImage.src}
                      alt={panel.groupImage.alt}
                      fill
                      sizes="(min-width: 1024px) 54vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Icon name="users" className="size-16 text-teal-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/15 to-transparent" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 sm:p-5">
                    <span className="rounded-full border border-white/15 bg-navy-950/75 px-3 py-1.5 text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-teal-300 backdrop-blur-md">
                      Current panel
                    </span>
                    <span className="rounded-full border border-white/15 bg-navy-950/75 px-3 py-1.5 text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                      Notice-verified
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-300">
                      Executive committee
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.03em] text-white sm:text-3xl">
                      The {panel.session} student leadership team
                    </h2>
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.13em] text-science-700">
                        Leadership preview
                      </p>
                      <h3 className="mt-1 font-display text-xl font-extrabold tracking-tight text-navy-950">
                        Meet the officers guiding the programme.
                      </h3>
                    </div>
                    <p className="text-xs font-semibold text-slate-500">
                      {committeeMembers.length} officers · Class XII
                    </p>
                  </div>

                  <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                    {committeePreview.map((member, index) => (
                      <li
                        key={member.id}
                        className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 p-3.5"
                      >
                        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-xs font-black text-teal-300">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-extrabold leading-5 text-navy-950">
                            {member.name}
                          </span>
                          <span className="mt-0.5 block text-xs font-semibold leading-5 text-slate-500">
                            {member.role}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-5 flex items-start gap-3 rounded-2xl bg-science-50 px-4 py-3.5 text-sm leading-6 text-slate-600">
                    <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-science-700 shadow-sm">
                      <Icon name="shield" className="size-4" />
                    </span>
                    <p>
                      Official designations follow the supplied committee notice; the full directory preserves its published order.
                    </p>
                  </div>
                </div>
              </article>
            )}
          </div>
        </Container>
      </section>

      <section aria-labelledby="institutional-home" className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
        <Container>
          <div className="surface-card rounded-[2rem] border border-surface-border p-7 shadow-soft sm:p-10 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-9">
            <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-navy-950">
              <Icon name="shield" className="size-8 text-teal-300" />
            </span>
            <div className="mt-6 lg:mt-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-science-700">Institutional home</p>
              <h2 id="institutional-home" className="mt-2 font-display text-2xl font-extrabold tracking-[-0.025em] text-navy-950 sm:text-3xl">
                {siteConfig.institution}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                DRMC Science Club is the institution&apos;s student science community, with faculty and college leadership guiding its student-led executive committee.
              </p>
            </div>
            <ButtonLink href="/contact" variant="outline" className="mt-7 lg:mt-0 lg:shrink-0">Contact the club</ButtonLink>
          </div>
        </Container>
      </section>

      <section className="science-grid-dark relative overflow-hidden bg-navy-950 py-16 sm:py-20">
        <div aria-hidden="true" className="absolute -right-20 -top-28 size-80 rounded-full border border-teal-300/15" />
        <Container className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-teal-300">Find your place</p>
            <h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-[-0.035em] text-white sm:text-4xl">
              Bring a question. Leave with a way to test it.
            </h2>
            <p className="mt-4 leading-7 text-slate-300">Membership information is public, and no visitor account is required.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <ButtonLink href="/join" variant="secondary">Join the Club</ButtonLink>
            <ButtonLink href="/activities" variant="light">Explore activities</ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
