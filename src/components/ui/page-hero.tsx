import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";

export function PageHero({
  eyebrow,
  title,
  description,
  icon = "atom",
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon?: IconName;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-hero-motion dark-canvas relative overflow-hidden py-11 sm:py-20 lg:py-24">
      <div aria-hidden="true" data-parallax="0.05" className="absolute inset-0">
        <div className="absolute -right-24 -top-24 size-80 rounded-full border border-gold-300/20" />
        <div className="absolute -right-6 top-2 size-52 rounded-full border border-teal-300/20" />
        <div className="absolute bottom-8 right-[34%] size-20 rounded-full border border-violet-300/15" />
      </div>
      <Container className="relative">
        <nav data-reveal="from-top" aria-label="Breadcrumb" className="mb-6 flex min-w-0 items-center gap-2 text-sm text-slate-400 sm:mb-8">
          <Link href="/" className="rounded-sm transition-colors hover:text-white">Home</Link>
          <Icon name="chevron-right" className="size-3.5" />
          <span aria-current="page" className="min-w-0 truncate text-gold-200">{eyebrow}</span>
        </nav>
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div data-reveal="up" data-reveal-delay="1" className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-teal-200">
              <Icon name={icon} className="size-4" />
              {eyebrow}
            </span>
            <h1 className="mt-4 text-balance font-display text-[2.1rem] leading-[1.1] font-extrabold tracking-[-0.045em] text-white sm:mt-5 sm:text-5xl sm:leading-none lg:text-6xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:mt-5 sm:text-lg sm:leading-8">{description}</p>
          </div>
          {children && <div data-reveal="scale" data-reveal-delay="2">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
