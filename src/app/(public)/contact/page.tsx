import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { contactDetails, socialLinks } from "@/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact DRMC Science Club at Dhaka Residential Model College for programmes, festival participation, publications, and official enquiries.",
  alternates: { canonical: "/contact" },
};

const contactMethods: Array<{ label: string; value: string; href: string; icon: IconName; note: string }> = [
  { label: "Email", value: contactDetails.email, href: `mailto:${contactDetails.email}`, icon: "mail", note: "Best for official and programme enquiries" },
  { label: "Telephone", value: contactDetails.phone, href: `tel:${contactDetails.phone.replace(/\s/g, "")}`, icon: "phone", note: "Call during published college hours" },
  { label: "Office hours", value: contactDetails.officeHours, href: "#visit", icon: "clock", note: "Hours may vary during holidays and examinations" },
];

export default function ContactPage() {
  return (
    <main>
      <PageHero eyebrow="Contact" title="Let’s talk science." description="Reach the club for festival coordination, institutional invitations, publication questions, or information about student programmes." icon="mail" />

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            {contactMethods.map((method) => (
              <a key={method.label} href={method.href} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition-transform hover:-translate-y-0.5">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-science-50 text-science-700"><Icon name={method.icon} /></span>
                <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.13em] text-slate-500">{method.label}</p>
                <p className="mt-2 break-words font-display text-lg font-extrabold text-navy-950 group-hover:text-science-700">{method.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{method.note}</p>
              </a>
            ))}
          </div>
        </Container>
      </section>

      <section id="visit" className="science-grid border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] bg-navy-950 p-7 text-white shadow-soft sm:p-10">
            <div aria-hidden="true" className="absolute inset-0 science-grid-dark opacity-70" />
            <div aria-hidden="true" className="absolute -right-20 -top-20 size-72 rounded-full border border-science-300/15" />
            <div aria-hidden="true" className="absolute bottom-16 right-16 size-4 rounded-full bg-teal-300 shadow-[0_0_32px_rgba(112,222,207,.8)]" />
            <div aria-hidden="true" className="absolute bottom-12 right-12 h-px w-48 -rotate-12 bg-gradient-to-r from-transparent via-science-300/50 to-transparent" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-teal-400 text-navy-950"><Icon name="location" /></span>
                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.14em] text-teal-300">Visit the club</p>
                <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight">{contactDetails.clubName}</h2>
              </div>
              <address className="mt-10 max-w-md not-italic text-base leading-8 text-slate-300">
                {contactDetails.addressLines.map((line) => <span key={line} className="block">{line}</span>)}
              </address>
              <ButtonLink href={contactDetails.mapUrl} external variant="light" icon="external" className="mt-7 self-start">Open in Google Maps</ButtonLink>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-card sm:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-science-700">Before you write</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy-950">Help us route your enquiry.</h2>
            <p className="mt-4 leading-7 text-slate-600">For a faster response, include the event or programme name, your institution, a contact person, and any relevant deadline in the subject line.</p>
            <ul className="mt-7 grid gap-4">
              {["Festival participation and segment queries", "Institutional invitations and partnerships", "Magazine, archive, and media requests", "DRMC student membership information"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-semibold text-slate-700"><span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700"><Icon name="check" className="size-3" /></span>{item}</li>
              ))}
            </ul>
            <ButtonLink href={`mailto:${contactDetails.email}?subject=DRMC%20Science%20Club%20enquiry`} icon="mail" className="mt-8">Compose an email</ButtonLink>
            <p className="mt-4 text-xs leading-5 text-slate-500">This Phase 1 prototype does not collect or store messages through a web form.</p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14">
        <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-science-700">Social channels</p><h2 className="mt-2 text-2xl font-extrabold text-navy-950">Updates, photographs, and announcements.</h2></div>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((social) => <ButtonLink key={social.platform} href={social.href} external variant="outline" icon={social.platform === "Facebook" ? "facebook" : "instagram"} iconPosition="left">{social.platform}</ButtonLink>)}
          </div>
        </Container>
      </section>
    </main>
  );
}
