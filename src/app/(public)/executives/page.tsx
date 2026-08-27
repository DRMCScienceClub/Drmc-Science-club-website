import type { Metadata } from "next";
import { ExecutiveDirectory } from "@/components/features/executive-directory";
import { JoinCta } from "@/components/features/join-cta";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { executivePanels, getCurrentExecutivePanel, getExecutiveMemberCount } from "@/data";

export const metadata: Metadata = {
  title: "Executive Panels",
  description: "Meet the current DRMC Science Club executive panel, moderator and advisers, and explore archived panels by session.",
  alternates: { canonical: "/executives" },
};

export default function ExecutivesPage() {
  const current = getCurrentExecutivePanel();

  return (
    <main>
      <PageHero eyebrow="Executives" title="The people who keep ideas moving." description="Student leaders organize the club's academic, technical, publication, and outreach work under the guidance of DRMC faculty." icon="users">
        {current && (
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"><strong className="block text-2xl text-science-300">{current.session}</strong><span className="text-xs text-slate-400">Current session</span></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"><strong className="block text-2xl text-science-300">{getExecutiveMemberCount(current)}</strong><span className="text-xs text-slate-400">Panel members</span></div>
          </div>
        )}
      </PageHero>
      <section className="science-grid bg-slate-50 py-16 sm:py-20">
        <Container>
          <ExecutiveDirectory panels={executivePanels} />
        </Container>
      </section>
      <JoinCta />
    </main>
  );
}
