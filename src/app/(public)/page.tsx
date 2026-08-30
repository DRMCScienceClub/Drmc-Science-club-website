import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { AchievementCard } from "@/components/features/achievement-card";
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
  getExecutiveMemberCount,
  getFeaturedFestival,
  getFestivalArchive,
  getFeaturedMagazine,
  getLatestActivities,
  getLatestAchievements,
  siteConfig,
  siteStats,
} from "@/data";

export const metadata: Metadata = {
  title: { absolute: "DRMC Science Club | Curiosity into Discovery" },
  description:
    "Explore verified DRMC Science Club activities, achievements, National Science Carnival records, the annual magazine, and executive panels.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const festival = getFeaturedFestival();
  const activities = getLatestActivities(3);
  const achievements = getLatestAchievements(3);
  const archive = getFestivalArchive().slice(0, 2);
  const magazine = getFeaturedMagazine();
  const panel = getCurrentExecutivePanel();
  const panelMembers = panel?.departments.flatMap((department) => department.members).slice(0, 3) ?? [];
  const panelMemberCount = panel ? getExecutiveMemberCount(panel) : 0;

  return (
    <main>
      <section className="home-hero-motion dark-canvas relative overflow-hidden">
        <HeroBackdrop />
        <Container className="relative grid min-h-[720px] items-center gap-12 py-20 sm:py-24 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,.92fr)] lg:gap-14 lg:py-28 xl:gap-20">
          <div className="relative z-10 text-left">
            <div data-reveal="from-top" data-reveal-delay="1" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-gold-100 backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-gold-300 shadow-[0_0_14px_rgba(229,191,98,.65)]" />
              The science community of DRMC
            </div>
            <h1 className="hero-title-stage mt-7 max-w-3xl text-balance font-display text-5xl font-black leading-[1.01] tracking-[-0.06em] text-white sm:text-6xl lg:text-[4.25rem] xl:text-[4.9rem]">
              <span className="block overflow-hidden pb-2">
                <span data-reveal="hero-title" data-reveal-delay="2" className="block">Ask better questions.</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span data-reveal="hero-title" data-reveal-delay="3" className="accent-text block">Build what&apos;s next.</span>
              </span>
            </h1>
            <p data-reveal="up" data-reveal-delay="4" className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              We bring young scientists together to experiment, engineer, observe, and share ideas that matter—from our campus to communities across Bangladesh.
            </p>
            <div data-reveal="scale" data-reveal-delay="5" className="mt-9 flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
              <ButtonLink href="/join" variant="secondary">Join the Club</ButtonLink>
              <ButtonLink href="/activities" variant="light">Explore our work</ButtonLink>
            </div>
            <dl data-reveal="up" data-reveal-delay="6" className="glass-panel mt-11 grid w-full max-w-3xl overflow-hidden rounded-2xl text-left sm:grid-cols-3">
              <div className="border-b border-white/10 px-6 py-5 sm:border-b-0 sm:border-r"><dt className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-slate-400">Established</dt><dd className="mt-1 font-display text-2xl font-black text-white">{siteConfig.established}</dd></div>
              <div className="border-b border-white/10 px-6 py-5 sm:border-b-0 sm:border-r"><dt className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-slate-400">Festival edition</dt><dd className="mt-1 font-display text-2xl font-black text-teal-200">{festival?.edition.split(" ")[0] ?? "—"}</dd></div>
              <div className="px-6 py-5"><dt className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-slate-400">Aurora volume</dt><dd className="mt-1 font-display text-2xl font-black text-gold-200">{magazine?.volume.replace("Volume ", "") ?? "—"}</dd></div>
            </dl>
          </div>

          <div data-reveal="scale" data-reveal-delay="3" className="relative mx-auto w-full max-w-[31rem] lg:mx-0 lg:max-w-[36rem] lg:justify-self-end">
            <div aria-hidden="true" className="absolute -inset-5 rounded-[3rem] border border-dashed border-teal-300/15 sm:-inset-7" />
            <div className="glass-panel relative overflow-hidden rounded-[2.5rem] p-4 shadow-2xl shadow-black/25 sm:p-7 lg:p-8">
              <span aria-hidden="true" className="absolute -right-16 -top-20 size-56 rounded-full bg-science-400/10 blur-3xl" />
              <span aria-hidden="true" className="absolute -bottom-20 -left-16 size-52 rounded-full bg-teal-300/10 blur-3xl" />
              <LogoMark hero className="relative" />
            </div>
          </div>
        </Container>
        <div className="border-t border-white/10 bg-black/15 backdrop-blur-sm">
          <Container className="flex flex-wrap items-center justify-center gap-x-9 gap-y-3 py-4 text-[0.68rem] font-extrabold uppercase tracking-[0.15em] text-slate-400 sm:justify-between">
            <span className="inline-flex items-center gap-2"><Icon name="microscope" className="size-4 text-teal-300" />Research</span>
            <span className="inline-flex items-center gap-2"><Icon name="rocket" className="size-4 text-gold-300" />Engineering</span>
            <span className="inline-flex items-center gap-2"><Icon name="globe" className="size-4 text-violet-300" />Earth science</span>
            <span className="inline-flex items-center gap-2"><Icon name="lightbulb" className="size-4 text-science-300" />Innovation</span>
            <span className="inline-flex items-center gap-2"><Icon name="book" className="size-4 text-rose-300" />Science communication</span>
          </Container>
        </div>
      </section>

      <section className="bg-paper-50 py-20 sm:py-24">
        <Container>
          <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Latest verified carnival" title="The 17th edition, preserved from the official artwork." description="Explore the January 2026 carnival's 44 listed segments and its poster-backed sponsor and partner record." />
            <ButtonLink href="/festivals" variant="ghost" className="self-start sm:shrink-0">Festival archive</ButtonLink>
          </div>
          {festival ? <FeaturedFestival festival={festival} /> : <EmptyState title="Festival record being catalogued" description="The latest verified edition will appear here after its source artwork is reviewed." action={{ label: "Browse the archive", href: "/festivals" }} />}
        </Container>
      </section>

      <section className="site-surface science-grid border-y border-paper-200 py-20 sm:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Latest activities" title="Science is something we do." description="Poster-backed competitions, workshops, and seminars designed for active learning." />
            <ButtonLink href="/activities" variant="outline" className="self-start sm:shrink-0">View all activities</ButtonLink>
          </div>
          {activities.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => <ActivityCard key={activity.slug} activity={activity} />)}
            </div>
          ) : <div className="mt-10"><EmptyState /></div>}
        </Container>
      </section>

      <section className="bg-paper-50 py-20 sm:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Latest achievements"
              title="Student work recognized beyond the classroom."
              description="Poster-backed distinctions in invention, olympiads, robotics, quizzing, and science communication, ordered by the supplied publication sequence."
            />
            <ButtonLink href="/achievements" variant="outline" className="self-start sm:shrink-0">
              View all achievements
            </ButtonLink>
          </div>
          {achievements.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState title="Achievement archive being prepared" />
            </div>
          )}
        </Container>
      </section>

      <section className="bg-paper-100 py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <SectionHeading eyebrow="Festival archive" title="A record of ideas, teams, and shared discovery." description="Revisit the supplied posters, themes, programme categories, sponsors, and partners from earlier editions." />
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ButtonLink href="/festivals" variant="outline">Explore all editions</ButtonLink>
              <ButtonLink href={festival ? `/festivals/${festival.slug}` : "/festivals"}>Latest verified edition</ButtonLink>
            </div>
          </div>
          {archive.length > 0 ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-2">{archive.map((item) => <FestivalCard key={item.slug} festival={item} compact />)}</div>
          ) : <div className="mt-10"><EmptyState title="The archive is being prepared" /></div>}
        </Container>
      </section>

      {magazine && (
        <section className="dark-canvas relative overflow-hidden py-20 text-white sm:py-24">
          <Container className="grid items-center gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
            <div data-reveal="from-left" className="relative mx-auto w-full max-w-[340px]">
              <div aria-hidden="true" className="absolute -inset-5 rotate-3 rounded-[2rem] border border-gold-300/25 bg-gold-300/5" />
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl shadow-black/30">
                <Image src={magazine.coverImage.src} alt={magazine.coverImage.alt} fill sizes="(min-width: 1024px) 340px, 80vw" className="object-cover" />
              </div>
              <span className="absolute -bottom-4 -right-4 rounded-xl bg-gold-300 px-4 py-3 text-xs font-black uppercase tracking-wider text-navy-950 shadow-xl">{magazine.pages} pages</span>
            </div>
            <div data-reveal="from-right" data-reveal-delay="1">
              <span className="eyebrow !text-teal-200 before:!bg-gold-300">Annual science magazine</span>
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-teal-300">{magazine.volume} · {magazine.year}</p>
              <h2 className="mt-2 text-balance font-display text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">{magazine.title}: <span className="accent-text">{magazine.subtitle}</span></h2>
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
        <section className="bg-paper-50 py-20 sm:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[.86fr_1.14fr] lg:items-center">
              <div>
                <SectionHeading eyebrow="Current executive panel" title="Student-led, faculty-guided." description={panel.summary} />
                <div className="mt-7 flex items-center gap-3">
                  <span className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-extrabold text-white">Session {panel.session}</span>
                  <span className="text-sm font-semibold text-slate-500">{panelMemberCount} student officers</span>
                </div>
                <ButtonLink href="/executives" variant="outline" className="mt-7">Meet the full panel</ButtonLink>
              </div>
              <div data-reveal="from-right" className="surface-card rounded-3xl border border-surface-border p-5 shadow-soft sm:p-7">
                <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.13em] text-slate-500">Club moderator</p>
                <ExecutiveCard member={panel.moderator} prominent />
                <p className="mb-4 mt-7 text-xs font-extrabold uppercase tracking-[0.13em] text-slate-500">Student leadership</p>
                <div className="grid gap-3 sm:grid-cols-2">{panelMembers.map((member) => <ExecutiveCard key={member.id} member={member} />)}</div>
              </div>
            </div>
          </Container>
        </section>
      )}

      <section className="dark-canvas border-y border-white/10 py-16 text-white sm:py-20">
        <Container>
          <SectionHeading eyebrow="Documented archive" title="Official artwork, carefully catalogued." align="center" inverse />
          <dl className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {siteStats.map((stat, index) => (
              <div data-reveal="scale" key={stat.label} className="glass-panel relative overflow-hidden rounded-2xl p-7 text-center sm:p-8">
                <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-0.5 ${["bg-teal-300", "bg-gold-300", "bg-violet-300", "bg-science-300"][index % 4]}`} />
                <dt className="text-xs font-extrabold uppercase tracking-[0.13em] text-slate-400">{stat.label}</dt>
                <dd>
                  <span className="mt-3 block font-display text-4xl font-black tracking-tight text-white">{stat.value}</span>
                  <span className="mt-3 block text-sm leading-6 text-slate-300">{stat.description}</span>
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

function HeroBackdrop() {
  return (
    <div aria-hidden="true" data-parallax="0.08" className="absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-[42%] aspect-square w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.055]" />
      <div className="absolute left-1/2 top-[42%] aspect-square w-[38rem] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-full border border-dashed border-teal-300/10" />
      <div className="absolute left-1/2 top-[42%] aspect-square w-[25rem] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-full border border-gold-300/10" />
      <span className="absolute left-[12%] top-[30%] hidden size-3 rounded-full bg-teal-300/80 shadow-[0_0_26px_rgba(112,222,207,.5)] sm:block" />
      <span className="absolute right-[14%] top-[38%] hidden size-2.5 rounded-full bg-gold-300/80 shadow-[0_0_24px_rgba(229,191,98,.45)] sm:block" />
      <span className="absolute bottom-[20%] right-[26%] hidden size-2 rounded-full bg-violet-300/70 sm:block" />
      <span className="absolute left-[8%] top-[54%] hidden rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.16em] text-teal-200 backdrop-blur-sm lg:block">Observe</span>
      <span className="absolute right-[7%] top-[57%] hidden rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.16em] text-gold-200 backdrop-blur-sm lg:block">Experiment</span>
    </div>
  );
}

function FeaturedFestival({ festival }: { festival: NonNullable<ReturnType<typeof getFeaturedFestival>> }) {
  return (
    <article data-reveal="scale" className="group grid overflow-hidden rounded-[2rem] border border-paper-200 bg-navy-950 shadow-soft lg:grid-cols-[1.08fr_.92fr]">
      <Link href={`/festivals/${festival.slug}`} className="relative min-h-[320px] overflow-hidden lg:min-h-[510px]">
        <Image src={festival.coverImage.src} alt={festival.coverImage.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-contain transition-transform duration-700 group-hover:scale-[1.02]" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent" />
        <span className="absolute bottom-6 left-6 rounded-full border border-white/20 bg-navy-950/65 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.13em] text-white backdrop-blur-md">{festival.edition}</span>
      </Link>
      <div className="science-grid-dark flex flex-col justify-center p-7 sm:p-10 lg:p-12">
        <StatusBadge tone={festival.registration.status === "open" ? "teal" : "slate"}>{festival.registration.label}</StatusBadge>
        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.14em] text-gold-300">{festival.theme}</p>
        <h3 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl">{festival.title}</h3>
        <p className="mt-5 text-sm leading-7 text-slate-300">{festival.summary}</p>
        <dl className="mt-7 grid gap-4 border-y border-white/10 py-6 text-sm">
          <div className="flex items-start gap-3"><Icon name="calendar" className="mt-0.5 size-5 text-teal-300" /><div><dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Dates</dt><dd className="mt-1 font-semibold text-white">{festival.dateLabel}</dd></div></div>
          <div className="flex items-start gap-3"><Icon name="location" className="mt-0.5 size-5 text-gold-300" /><div><dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Venue</dt><dd className="mt-1 font-semibold text-white">{festival.venue}</dd></div></div>
        </dl>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`/festivals/${festival.slug}`} variant="secondary">Festival details</ButtonLink>
          <ButtonLink href={`/festivals/${festival.slug}#segments`} variant="light">Explore segments</ButtonLink>
        </div>
      </div>
    </article>
  );
}
