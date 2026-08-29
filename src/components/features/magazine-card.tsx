import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { MagazineIssue } from "@/types/content";

export function MagazineCard({ issue }: { issue: MagazineIssue }) {
  return (
    <article data-reveal="up" className="surface-card group grid grid-cols-[8rem_1fr] gap-5 rounded-3xl border border-surface-border p-4 shadow-card sm:grid-cols-[10rem_1fr] sm:gap-6">
      <Link href={`/magazines/${issue.year}`} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-navy-900 shadow-lg">
        <Image src={issue.coverImage.src} alt={issue.coverImage.alt} fill sizes="160px" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
      </Link>
      <div className="flex min-w-0 flex-col justify-center py-2">
        <span className="text-xs font-extrabold uppercase tracking-[0.13em] text-science-700">{issue.volume} · {issue.year}</span>
        <h3 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.03em] text-navy-950">
          <Link href={`/magazines/${issue.year}`} className="rounded-sm hover:text-science-700">{issue.title}</Link>
        </h3>
        <p className="mt-1 font-semibold text-teal-700">{issue.subtitle}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{issue.description}</p>
        <Link href={`/magazines/${issue.year}`} className="mt-4 inline-flex items-center gap-2 self-start rounded-sm text-sm font-extrabold text-science-700 hover:text-science-600">View issue <Icon name="arrow-right" className="size-4" /></Link>
      </div>
    </article>
  );
}
