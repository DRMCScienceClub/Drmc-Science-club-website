import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { footerNavigation, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="science-grid-dark bg-navy-950 text-white">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_.7fr_.7fr_1fr]">
          <div className="max-w-sm">
            <Logo inverse />
            <p className="mt-5 text-sm leading-7 text-slate-300">{siteConfig.description}</p>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-300">Established {siteConfig.established}</p>
          </div>

          <FooterColumn title="Explore" links={footerNavigation.explore} />
          <FooterColumn title="The club" links={footerNavigation.club} />

          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-[0.13em] text-science-200">Find us</h2>
            <address className="mt-5 not-italic">
              <ul className="grid gap-4 text-sm leading-6 text-slate-300">
                <li className="flex gap-3"><Icon name="location" className="mt-0.5 size-4 text-teal-300" /><span>{siteConfig.address}</span></li>
                <li className="flex gap-3"><Icon name="mail" className="mt-0.5 size-4 text-teal-300" /><a href={`mailto:${siteConfig.email}`} className="rounded-sm hover:text-white">{siteConfig.email}</a></li>
                <li className="flex gap-3"><Icon name="clock" className="mt-0.5 size-4 text-teal-300" /><span>{siteConfig.officeHours}</span></li>
              </ul>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-7 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DRMC Science Club. A student organization of {siteConfig.college}.</p>
          <div className="flex items-center gap-3">
            <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" aria-label="DRMC Science Club on Facebook" className="inline-flex size-9 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition-colors hover:border-science-300/50 hover:text-white"><Icon name="facebook" className="size-4" /></a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" aria-label="DRMC Science Club on Instagram" className="inline-flex size-9 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition-colors hover:border-science-300/50 hover:text-white"><Icon name="instagram" className="size-4" /></a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<{ label: string; href: string }> }) {
  return (
    <div>
      <h2 className="text-sm font-extrabold uppercase tracking-[0.13em] text-science-200">{title}</h2>
      <ul className="mt-5 grid gap-3 text-sm text-slate-300">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="rounded-sm transition-colors hover:text-white">{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
