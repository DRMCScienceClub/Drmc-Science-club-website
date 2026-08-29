import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { socialLinks } from "@/data";

export function SocialStrip() {
  return (
    <section className="border-y border-paper-200 bg-paper-50 py-10">
      <Container className="grid gap-4 lg:grid-cols-[1fr_1.5fr] lg:items-center">
        <div data-reveal="from-left">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-700">Stay in the loop</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-navy-950">Follow the experiment, as it happens.</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {socialLinks.map((social) => (
            <div data-reveal="from-right" key={social.platform}>
              <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} className="surface-card group flex h-full items-center gap-4 rounded-2xl border border-surface-border p-4 shadow-card transition-transform hover:-translate-y-0.5">
                <span className={`inline-flex size-11 items-center justify-center rounded-xl text-white ${social.platform === "Facebook" ? "bg-[#1877F2]" : "bg-gradient-to-br from-[#6a4cff] via-[#d83c8d] to-[#f3a12e]"}`}><Icon name={social.platform === "Facebook" ? "facebook" : "instagram"} /></span>
                <span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-wider text-slate-500">{social.platform}</span><span className="mt-0.5 block truncate font-extrabold text-navy-950">{social.handle}</span></span>
                <Icon name="external" className="ml-auto size-4 text-slate-400 group-hover:text-gold-500" />
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
