import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { MagazineIssue } from "@/types/content";

export function MagazineCard({ issue }: { issue: MagazineIssue }) {
  return (
    <article data-reveal="up" className="surface-card group grid grid-cols-[5.75rem_minmax(0,1fr)] gap-3 rounded-2xl border border-surface-border p-3 shadow-card sm:grid-cols-[10rem_1fr] sm:gap-6 sm:rounded-3xl sm:p-4">
      <Link href={`/magazines/${issue.year}`} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-navy-900 shadow-lg">
        <Image src={issue.coverImage.src} alt={issue.coverImage.alt} fill sizes="160px" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
      </Link>
      <div className="flex min-w-0 flex-col justify-center py-2">
        <span className="text-xs font-extrabold uppercase tracking-[0.13em] text-science-700">{issue.volume} · {issue.year}</span>
        <h3 className="mt-2 font-display text-lg font-extrabold tracking-[-0.03em] text-navy-950 sm:text-2xl">
          <Link href={`/magazines/${issue.year}`} className="rounded-sm hover:text-science-700">{issue.title}</Link>
        </h3>
        <p className="mt-1 font-semibold text-teal-700">{issue.subtitle}</p>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 sm:mt-3 sm:line-clamp-3 sm:text-sm sm:leading-6">{issue.description}</p>
        <Link href={`/magazines/${issue.year}`} className="mt-4 inline-flex items-center gap-2 self-start rounded-sm text-sm font-extrabold text-science-700 hover:text-science-600">View issue <Icon name="arrow-right" className="size-4" /></Link>
      </div>
    </article>
  );
}
