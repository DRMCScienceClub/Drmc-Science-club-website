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
  getCurrentOrUpcomingFestival,
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
  const festival = getCurrentOrUpcomingFestival();
  const magazine = getFeaturedMagazine();

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

      <section aria-label="Our purpose" className="bg-white py-16 sm:py-20 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-start lg:gap-16">
          <SectionHeading
            eyebrow="Our purpose"
            title="Curiosity is the beginning, not the finish line."
            description="The club creates room for students to move from an interesting question to a method, an observation, and a result they can communicate clearly."
          />
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 shadow-soft sm:p-9">
            <LogoMark className="size-14" />
            <blockquote className="mt-6 text-balance font-display text-2xl font-extrabold leading-snug tracking-[-0.025em] text-navy-950 sm:text-3xl">
              “Questioning carefully, building responsibly and sharing what we discover.”
            </blockquote>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              This Phase 1 prototype uses that purpose to connect club programmes, annual festivals, student publications, and executive teams in one public archive.
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
              description={`The club record in this prototype begins with its ${siteConfig.established} establishment year and continues through recurring programmes, festival editions, and annual student publishing.`}
              inverse
            />
            <dl className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
              <div className="bg-navy-900 p-5">
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Established</dt>
                <dd className="mt-2 text-2xl font-extrabold text-teal-300">{siteConfig.established}</dd>
              </div>
              <div className="bg-navy-900 p-5">
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Current festival</dt>
                <dd className="mt-2 text-2xl font-extrabold text-science-300">{festival?.edition ?? "To be announced"}</dd>
              </div>
              <div className="bg-navy-900 p-5">
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Latest magazine</dt>
                <dd className="mt-2 text-2xl font-extrabold text-science-300">{magazine?.volume ?? "Archive pending"}</dd>
              </div>
            </dl>
            <p className="mt-5 text-xs leading-5 text-slate-400">
              Prototype facts shown above come from the shared mock content and can be replaced with verified club records in a later phase.
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
                  className="object-cover"
                />
              </div>
              <figcaption className="border-t border-white/10 px-6 py-5 text-sm leading-6 text-slate-300">
                {festival.shortTitle} is the newest festival record represented in this prototype.
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
              <article key={pillar.title} className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-card sm:p-8">
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

      <section aria-label="How the club works" className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="How the club works"
                title="Student teams, connected by one programme."
                description={panel?.summary ?? "The executive structure will appear here when the current panel is published."}
              />
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href="/executives" variant="outline">Meet the executive panel</ButtonLink>
                <ButtonLink href="/activities" variant="ghost">See the work</ButtonLink>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {panel?.departments.map((department, index) => (
                <article
                  key={department.name}
                  className={`rounded-2xl border border-slate-200 p-6 ${index === 0 ? "bg-navy-900 text-white sm:col-span-2" : "bg-slate-50"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className={`font-display text-lg font-extrabold ${index === 0 ? "text-white" : "text-navy-950"}`}>
                      {department.name}
                    </h2>
                    <span className={`rounded-full px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider ${index === 0 ? "bg-white/10 text-teal-300" : "bg-science-100 text-science-700"}`}>
                      {department.members.length} members
                    </span>
                  </div>
                  <p className={`mt-3 text-sm leading-6 ${index === 0 ? "text-slate-300" : "text-slate-600"}`}>{department.description}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="institutional-home" className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
        <Container>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-soft sm:p-10 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-9">
            <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-navy-950">
              <Icon name="shield" className="size-8 text-teal-300" />
            </span>
            <div className="mt-6 lg:mt-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-science-700">Institutional home</p>
              <h2 id="institutional-home" className="mt-2 font-display text-2xl font-extrabold tracking-[-0.025em] text-navy-950 sm:text-3xl">
                {siteConfig.institution}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                The shared prototype data presents DRMC Science Club as the institution&apos;s student science community, with a faculty moderator and advisers supporting student-led departments.
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
