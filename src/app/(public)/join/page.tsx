import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { membershipSteps } from "@/data";
import { JoinSubmissionForm } from "@/app/(public)/_components/public-submission-form";

export const metadata: Metadata = {
  title: "Join the Club",
  description: "Learn how current DRMC students can take part in DRMC Science Club activities and future membership intake.",
  alternates: { canonical: "/join" },
};

const interestAreas: Array<{ title: string; description: string; icon: IconName }> = [
  { title: "Academic & research", description: "Olympiads, evidence, investigation, and peer learning.", icon: "microscope" },
  { title: "Innovation & robotics", description: "Electronics, making, coding, and practical engineering.", icon: "rocket" },
  { title: "Events & outreach", description: "Welcoming teams and delivering useful public programmes.", icon: "users" },
  { title: "Writing & design", description: "Magazine editing, documentation, and clear science communication.", icon: "book" },
];

export default function JoinPage() {
  return (
    <main>
      <PageHero eyebrow="Join the Club" title="Bring your questions. We’ll build from there." description="Membership is for currently enrolled DRMC students who want to learn with others, contribute consistently, and make science more accessible." icon="sparkles">
        <div className="rounded-2xl border border-teal-300/20 bg-teal-300/10 p-5 lg:max-w-xs"><p className="text-xs font-extrabold uppercase tracking-[0.13em] text-teal-300">Intake status</p><p className="mt-2 font-extrabold text-white">Next orientation to be announced</p><p className="mt-2 text-xs leading-5 text-slate-300">Watch official club notices for the confirmed date.</p></div>
      </PageHero>

      <section className="site-surface py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <span className="eyebrow">Who can join</span>
              <h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-[-0.035em] text-navy-950 sm:text-4xl">You do not need to arrive as an expert.</h2>
              <p className="mt-5 leading-7 text-slate-600">Curiosity, reliability, and willingness to learn matter more than prior competition experience. Membership details are confirmed through the college and club authority during each intake.</p>
              <div className="mt-7 rounded-2xl border border-science-200 bg-science-50 p-5"><p className="flex items-center gap-2 font-extrabold text-navy-950"><Icon name="shield" className="text-science-700" />No public account required</p><p className="mt-2 text-sm leading-6 text-slate-600">Visitors and prospective members never need a website login. Future sign-in will remain limited to authorized administrators.</p></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {interestAreas.map((area) => (
                <article key={area.title} className="rounded-3xl border border-surface-border bg-slate-50 p-6 shadow-card">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white text-science-700 shadow-sm"><Icon name={area.icon} /></span>
                  <h3 className="mt-5 text-lg font-extrabold text-navy-950">{area.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{area.description}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="science-grid border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center"><span className="eyebrow">Membership pathway</span><h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">Three simple steps to begin.</h2><p className="mt-4 leading-7 text-slate-600">The final process and dates will be published after approval by the club authority.</p></div>
          <ol className="relative mt-10 grid gap-5 lg:grid-cols-3">
            {membershipSteps.map((item) => (
              <li key={item.step} className="surface-card relative rounded-3xl border border-surface-border p-7 shadow-card">
                <span className="font-display text-4xl font-black text-science-200">{item.step}</span>
                <h3 className="mt-5 text-xl font-extrabold text-navy-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="site-surface py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <span className="eyebrow">Membership interest</span>
            <h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">Tell us where your curiosity leads.</h2>
            <p className="mt-5 leading-7 text-slate-600">Current DRMC students can register their interest here. This helps the club plan orientation and understand which programmes students want to explore.</p>
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5"><p className="font-extrabold text-navy-950">Interest form, not automatic admission</p><p className="mt-2 text-sm leading-6 text-slate-600">Membership remains subject to the approved intake process and confirmation by club authorities.</p></div>
          </div>
          <div className="surface-card rounded-[2rem] border border-surface-border p-6 shadow-card sm:p-8">
            <JoinSubmissionForm />
          </div>
        </Container>
      </section>

      <section className="science-grid border-t border-slate-200 bg-slate-50 py-16 sm:py-20">
        <Container>
          <div className="science-grid-dark relative overflow-hidden rounded-[2rem] bg-navy-950 p-7 text-white sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:p-14">
            <div className="max-w-2xl"><span className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-300">Stay ready</span><h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Want to know when intake opens?</h2><p className="mt-4 leading-7 text-slate-300">Follow the official channels for the next orientation notice, or email the club with a concise membership question.</p></div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0"><ButtonLink href="/contact" variant="secondary" icon="mail">Contact the club</ButtonLink><ButtonLink href="/activities" variant="light">See club activities</ButtonLink></div>
          </div>
        </Container>
      </section>
    </main>
  );
}
