import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { MembershipForm } from "@/app/(public)/_components/membership-form";

// Replace null with the approved blank scanned form's public URL when supplied.
const officialMembershipFormUrl: string | null = null;

function OfflineApplication() {
  return <section id="apply-offline" className="surface-card scroll-mt-28 rounded-3xl border border-surface-border p-6 shadow-card sm:p-8">
    <span className="eyebrow">Apply Offline</span><h3 className="mt-3 text-2xl font-extrabold text-navy-950">How to apply offline</h3>
    <p className="mt-4 leading-7 text-slate-600">Students may also apply through the official Dhaka Residential Model College Club Membership Form.</p>
    <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-7 text-slate-700">{[
      "Obtain the official Club Membership Form.", "Complete the required student and guardian information.", "Select your preferred club(s) according to college rules.", "Select Science Club as one of your preferred clubs if you wish to join DRMC Science Club.", "Complete the required signatures.", "Submit the completed form according to the college’s official instructions.",
    ].map((step) => <li key={step}>{step}</li>)}</ol>
    <blockquote className="mt-6 rounded-xl border border-science-200 bg-science-50 p-4 text-sm leading-7 text-slate-700">It is mandatory for a student to be a member of at least one club. A student can choose maximum three clubs. Any club activities must be attended after or before class time and during activities a club member must be attired in college or club-specific uniform(s).</blockquote>
    {officialMembershipFormUrl ? <ButtonLink href={officialMembershipFormUrl} external icon="download" className="mt-6">Download Official Membership Form</ButtonLink> : <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-600">Official membership form download coming soon.</p>}
  </section>;
}

export function JoinClubSection({ showOnlineForm = true }: { showOnlineForm?: boolean }) {
  return <section id="join-the-club" className="science-grid scroll-mt-28 border-y border-slate-200 bg-slate-50 py-12 sm:py-20"><Container>
    <div className="max-w-3xl"><span className="eyebrow">Explore · Experiment · Excel</span><h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-navy-950">Join the Club</h2><p className="mt-5 leading-8 text-slate-600">Interested in science, innovation, research, robotics, technology, problem-solving, or quizzing? Join DRMC Science Club and become part of a community of students exploring science beyond the classroom.</p></div>
    <div className="mt-8 grid gap-5 md:grid-cols-2">{[{ title: "Apply Online", text: "Send your application directly to DRMC Science Club through our website.", href: showOnlineForm ? "#apply-online" : "/join#apply-online", button: "Apply Online", icon: "globe" as const }, { title: "Apply Offline", text: "Apply through the official Dhaka Residential Model College Club Membership Form.", href: "#apply-offline", button: "View Instructions", icon: "book" as const }].map((option) => <article key={option.title} className="surface-card rounded-3xl border border-surface-border p-7 shadow-card"><Icon name={option.icon} className="size-8 text-teal-700" /><h3 className="mt-4 text-2xl font-extrabold text-navy-950">{option.title}</h3><p className="mt-3 leading-7 text-slate-600">{option.text}</p><ButtonLink href={option.href} className="mt-6">{option.button}</ButtonLink></article>)}</div>
    <div className={`mt-10 grid items-start gap-7 ${showOnlineForm ? "xl:grid-cols-[1.4fr_1fr]" : "mx-auto max-w-4xl"}`}>
      {showOnlineForm && <section id="apply-online" className="surface-card min-w-0 scroll-mt-28 rounded-3xl border border-surface-border p-6 shadow-card sm:p-8"><h3 className="mb-2 text-2xl font-extrabold text-navy-950">Apply Online</h3><p className="mb-7 text-sm leading-6 text-slate-600">A short application for DRMC Science Club. Fields marked * are required.</p><MembershipForm /></section>}
      <OfflineApplication />
    </div>
  </Container></section>;
}
