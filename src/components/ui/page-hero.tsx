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
    <section className="dark-canvas relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="absolute -right-24 -top-24 size-80 rounded-full border border-gold-300/20" />
      <div aria-hidden="true" className="absolute -right-6 top-2 size-52 rounded-full border border-teal-300/20" />
      <div aria-hidden="true" className="absolute bottom-8 right-[34%] size-20 rounded-full border border-violet-300/15" />
      <Container className="relative">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="rounded-sm transition-colors hover:text-white">Home</Link>
          <Icon name="chevron-right" className="size-3.5" />
          <span aria-current="page" className="text-gold-200">{eyebrow}</span>
        </nav>
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-teal-200">
              <Icon name={icon} className="size-4" />
              {eyebrow}
            </span>
            <h1 className="mt-5 text-balance font-display text-4xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{description}</p>
          </div>
          {children}
        </div>
      </Container>
    </section>
  );
}
