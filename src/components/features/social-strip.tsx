import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/lib/site";

export function SocialStrip() {
  const socials = [
    { name: "Facebook", handle: "DRMC Science Club", href: siteConfig.social.facebook, icon: "facebook" as const, color: "bg-[#1877F2]" },
    { name: "Instagram", handle: "@drmcscienceclub", href: siteConfig.social.instagram, icon: "instagram" as const, color: "bg-gradient-to-br from-[#6a4cff] via-[#d83c8d] to-[#f3a12e]" },
  ];
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-10">
      <Container className="grid gap-4 lg:grid-cols-[1fr_1.5fr] lg:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-science-700">Stay in the loop</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-navy-950">Follow the experiment, as it happens.</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {socials.map((social) => (
            <a key={social.name} href={social.href} target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition-transform hover:-translate-y-0.5">
              <span className={`inline-flex size-11 items-center justify-center rounded-xl text-white ${social.color}`}><Icon name={social.icon} /></span>
              <span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-wider text-slate-500">{social.name}</span><span className="mt-0.5 block truncate font-extrabold text-navy-950">{social.handle}</span></span>
              <Icon name="external" className="ml-auto size-4 text-slate-400 group-hover:text-science-600" />
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
