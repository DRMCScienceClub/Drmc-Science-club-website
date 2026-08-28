import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { ActivityCard } from "@/components/features/activity-card";
import { ExecutiveCard } from "@/components/features/executive-card";
import { FestivalCard } from "@/components/features/festival-card";
import { JoinCta } from "@/components/features/join-cta";
import { SocialStrip } from "@/components/features/social-strip";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getCurrentExecutivePanel,
  getCurrentOrUpcomingFestival,
  getFestivalArchive,
  getFeaturedMagazine,
  getLatestActivities,
  siteConfig,
  siteStats,
} from "@/data";

export const metadata: Metadata = {
  title: { absolute: "DRMC Science Club | Curiosity into Discovery" },
  description:
    "Explore DRMC Science Club activities, the National Science Festival, annual magazine, executive panel, and opportunities for DRMC students.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const festival = getCurrentOrUpcomingFestival();
  const activities = getLatestActivities(3);
  const archive = getFestivalArchive().slice(0, 2);
  const magazine = getFeaturedMagazine();
  const panel = getCurrentExecutivePanel();
  const panelMembers = panel?.departments.flatMap((department) => department.members).slice(0, 3) ?? [];

  return (
    <main>
      <section className="science-grid-dark relative overflow-hidden bg-navy-950">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(35,135,242,0.2),transparent_34%),radial-gradient(circle_at_15%_85%,rgba(25,166,154,0.12),transparent_30%)]" />
        <Container className="relative grid min-h-[670px] items-center gap-14 py-20 lg:grid-cols-[1.08fr_.92fr] lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-science-300/20 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-science-200">
              <Icon name="sparkles" className="size-4 text-teal-300" />
              The science community of DRMC
            </div>
            <h1 className="mt-7 text-balance font-display text-5xl font-black leading-[1.02] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              Ask better questions. <span className="text-science-300">Build what&apos;s next.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              We bring young scientists together to experiment, engineer, observe, and share ideas that matter—from our campus to communities across Bangladesh.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/join" variant="secondary">Join the Club</ButtonLink>
              <ButtonLink href="/activities" variant="light">Explore our work</ButtonLink>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-7 text-sm text-slate-300">
              <span><strong className="mr-2 text-xl font-extrabold text-white">{siteConfig.established}</strong>Established</span>
              <span><strong className="mr-2 text-xl font-extrabold text-white">{festival?.edition.split(" ")[0] ?? "—"}</strong>Festival edition</span>
              <span><strong className="mr-2 text-xl font-extrabold text-white">{magazine?.volume.replace("Volume ", "") ?? "—"}</strong>Magazine volume</span>
            </div>
          </div>

          <HeroOrbit />
        </Container>
        <div className="border-t border-white/10 bg-white/[0.035]">
          <Container className="flex flex-wrap items-center justify-center gap-x-9 gap-y-3 py-4 text-[0.68rem] font-extrabold uppercase tracking-[0.15em] text-slate-400 sm:justify-between">
            <span className="inline-flex items-center gap-2"><Icon name="microscope" className="size-4 text-teal-300" />Research</span>
            <span className="inline-flex items-center gap-2"><Icon name="rocket" className="size-4 text-teal-300" />Engineering</span>
            <span className="inline-flex items-center gap-2"><Icon name="globe" className="size-4 text-teal-300" />Earth science</span>
            <span className="inline-flex items-center gap-2"><Icon name="lightbulb" className="size-4 text-teal-300" />Innovation</span>
            <span className="inline-flex items-center gap-2"><Icon name="book" className="size-4 text-teal-300" />Science communication</span>
          </Container>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Flagship programme" title="The next big question starts here." description="Our national festival brings student science out of notebooks and into conversation." />
            <ButtonLink href="/festivals" variant="ghost" className="self-start sm:shrink-0">Festival archive</ButtonLink>
          </div>
          {festival ? <FeaturedFestival festival={festival} /> : <EmptyState title="Festival announcement coming soon" description="The next edition will appear here once its programme is confirmed." action={{ label: "Browse the archive", href: "/festivals" }} />}
        </Container>
      </section>

      <section className="science-grid border-y border-slate-200 bg-slate-50 py-20 sm:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Latest activities" title="Science is something we do." description="Workshops, observations, challenges, and conversations designed for active learning." />
            <ButtonLink href="/activities" variant="outline" className="self-start sm:shrink-0">View all activities</ButtonLink>
          </div>
          {activities.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => <ActivityCard key={activity.slug} activity={activity} />)}
            </div>
          ) : <div className="mt-10"><EmptyState /></div>}
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <SectionHeading eyebrow="Festival archive" title="A record of ideas, teams, and shared discovery." description="Every edition leaves a useful trail—winning work, photographs, schedules, and the people who made it possible." />
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ButtonLink href="/festivals" variant="outline">Explore all editions</ButtonLink>
              <ButtonLink href={festival ? `/festivals/${festival.slug}` : "/festivals"}>Current festival</ButtonLink>
            </div>
          </div>
          {archive.length > 0 ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-2">{archive.map((item) => <FestivalCard key={item.slug} festival={item} compact />)}</div>
          ) : <div className="mt-10"><EmptyState title="The archive is being prepared" /></div>}
        </Container>
      </section>

      {magazine && (
        <section className="science-grid-dark overflow-hidden bg-navy-950 py-20 text-white sm:py-24">
          <Container className="grid items-center gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
            <div className="relative mx-auto w-full max-w-[340px]">
              <div aria-hidden="true" className="absolute -inset-5 rotate-3 rounded-[2rem] border border-science-300/20 bg-science-500/5" />
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl shadow-black/30">
                <Image src={magazine.coverImage.src} alt={magazine.coverImage.alt} fill sizes="(min-width: 1024px) 340px, 80vw" className="object-cover" />
              </div>
              <span className="absolute -bottom-4 -right-4 rounded-xl bg-teal-400 px-4 py-3 text-xs font-black uppercase tracking-wider text-navy-950 shadow-xl">{magazine.pages} pages</span>
            </div>
            <div>
              <span className="eyebrow !text-science-200 before:!bg-teal-300">Annual science magazine</span>
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-teal-300">{magazine.volume} · {magazine.year}</p>
              <h2 className="mt-2 text-balance font-display text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">{magazine.title}: <span className="text-science-300">{magazine.subtitle}</span></h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">{magazine.description}</p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {magazine.highlights.slice(0, 4).map((highlight) => <li key={highlight} className="flex gap-3 text-sm leading-6 text-slate-200"><span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-teal-300"><Icon name="check" className="size-3" /></span>{highlight}</li>)}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/magazines/${magazine.year}`} variant="secondary" icon="book">Read the issue</ButtonLink>
                <ButtonLink href="/magazines" variant="light">Magazine archive</ButtonLink>
              </div>
            </div>
          </Container>
        </section>
      )}

      {panel && (
        <section className="bg-slate-50 py-20 sm:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[.86fr_1.14fr] lg:items-center">
              <div>
                <SectionHeading eyebrow="Current executive panel" title="Student-led, faculty-guided." description={panel.summary} />
                <div className="mt-7 flex items-center gap-3">
                  <span className="rounded-xl bg-science-600 px-4 py-2 text-sm font-extrabold text-white">Session {panel.session}</span>
                  <span className="text-sm font-semibold text-slate-500">{panel.departments.length} working departments</span>
                </div>
                <ButtonLink href="/executives" variant="outline" className="mt-7">Meet the full panel</ButtonLink>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
                <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.13em] text-slate-500">Faculty leadership</p>
                <ExecutiveCard member={panel.moderator} prominent />
                <p className="mb-4 mt-7 text-xs font-extrabold uppercase tracking-[0.13em] text-slate-500">Student leadership</p>
                <div className="grid gap-3 sm:grid-cols-2">{panelMembers.map((member) => <ExecutiveCard key={member.id} member={member} />)}</div>
              </div>
            </div>
          </Container>
        </section>
      )}

      <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Measured impact" title="Small experiments. Lasting momentum." align="center" />
          <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            {siteStats.map((stat) => (
              <div key={stat.label} className="bg-white p-7 text-center sm:p-8">
                <dt className="text-xs font-extrabold uppercase tracking-[0.13em] text-slate-500">{stat.label}</dt>
                <dd>
                  <span className="mt-3 block font-display text-4xl font-black tracking-tight text-science-700">{stat.value}</span>
                  <span className="mt-3 block text-sm leading-6 text-slate-600">{stat.description}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <JoinCta />
      <SocialStrip />
    </main>
  );
}

function HeroOrbit() {
  return (
    <div aria-hidden="true" className="relative mx-auto hidden aspect-square w-full max-w-[500px] lg:block">
      <div className="absolute inset-[6%] rounded-full border border-science-300/15" />
      <div className="absolute inset-[17%] rotate-[20deg] rounded-[50%] border border-teal-300/25" />
      <div className="absolute inset-[25%] -rotate-[30deg] rounded-[50%] border border-science-300/30" />
      <div className="absolute inset-[32%] rounded-full bg-science-500/10 blur-2xl" />
      <div className="absolute inset-0 rotate-12 rounded-full border border-dashed border-white/10" />
      <div className="absolute left-1/2 top-1/2 flex size-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/[0.07] shadow-2xl backdrop-blur-sm"><LogoMark className="size-28" /></div>
      <span className="absolute left-[6%] top-[32%] size-4 rounded-full bg-teal-300 shadow-[0_0_28px_rgba(112,222,207,.65)]" />
      <span className="absolute bottom-[14%] right-[25%] size-3 rounded-full bg-science-300 shadow-[0_0_24px_rgba(132,200,255,.65)]" />
      <span className="absolute right-[3%] top-[37%] rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.16em] text-science-200 backdrop-blur-sm">Observe</span>
      <span className="absolute bottom-[22%] left-[3%] rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.16em] text-teal-200 backdrop-blur-sm">Experiment</span>
    </div>
  );
}

function FeaturedFestival({ festival }: { festival: NonNullable<ReturnType<typeof getCurrentOrUpcomingFestival>> }) {
  return (
    <article className="group grid overflow-hidden rounded-[2rem] border border-slate-200 bg-navy-950 shadow-soft lg:grid-cols-[1.08fr_.92fr]">
      <Link href={`/festivals/${festival.slug}`} className="relative min-h-[320px] overflow-hidden lg:min-h-[510px]">
        <Image src={festival.coverImage.src} alt={festival.coverImage.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent" />
        <span className="absolute bottom-6 left-6 rounded-full border border-white/20 bg-navy-950/65 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.13em] text-white backdrop-blur-md">{festival.edition}</span>
      </Link>
      <div className="science-grid-dark flex flex-col justify-center p-7 sm:p-10 lg:p-12">
        <StatusBadge tone={festival.registration.status === "open" ? "teal" : "amber"}>{festival.registration.label}</StatusBadge>
        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.14em] text-teal-300">{festival.theme}</p>
        <h3 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl">{festival.title}</h3>
        <p className="mt-5 text-sm leading-7 text-slate-300">{festival.summary}</p>
        <dl className="mt-7 grid gap-4 border-y border-white/10 py-6 text-sm">
          <div className="flex items-start gap-3"><Icon name="calendar" className="mt-0.5 size-5 text-science-300" /><div><dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Dates</dt><dd className="mt-1 font-semibold text-white">{festival.dateLabel}</dd></div></div>
          <div className="flex items-start gap-3"><Icon name="location" className="mt-0.5 size-5 text-science-300" /><div><dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Venue</dt><dd className="mt-1 font-semibold text-white">{festival.venue}</dd></div></div>
        </dl>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`/festivals/${festival.slug}`} variant="secondary">Festival details</ButtonLink>
          <ButtonLink href={`/festivals/${festival.slug}#segments`} variant="light">Explore segments</ButtonLink>
        </div>
      </div>
    </article>
  );
}
