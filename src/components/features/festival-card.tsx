import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Festival } from "@/types/content";
import { cn } from "@/lib/utils";

export function FestivalCard({
  festival,
  compact = false,
}: {
  festival: Festival;
  compact?: boolean;
}) {
  const isArchivePoster = festival.recordStatus === "poster-verified";

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
      <Link
        href={`/festivals/${festival.slug}`}
        className={cn(
          "relative block overflow-hidden bg-navy-900",
          compact ? "aspect-[16/9]" : "aspect-[16/10]",
        )}
      >
        <Image
          src={festival.coverImage.src}
          alt={festival.coverImage.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            isArchivePoster
              ? "object-contain"
              : "object-cover transition-transform duration-500 group-hover:scale-[1.025]",
          )}
        />
        {!isArchivePoster && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-950/75 to-transparent" />
            <div className="absolute left-4 top-4">
              <StatusBadge
                tone={festival.status === "upcoming" ? "teal" : "slate"}
              >
                {festival.status}
              </StatusBadge>
            </div>
            <p className="absolute bottom-4 left-5 text-xs font-extrabold uppercase tracking-[0.14em] text-science-100">
              {festival.edition} · {festival.year}
            </p>
          </>
        )}
      </Link>
      <div className="p-6">
        {isArchivePoster && (
          <StatusBadge tone="slate">Poster archive</StatusBadge>
        )}
        <p
          className={cn(
            "text-xs font-bold uppercase tracking-[0.12em] text-teal-700",
            isArchivePoster && "mt-4",
          )}
        >
          {festival.theme}
        </p>
        <h3 className="mt-3 font-display text-2xl font-extrabold tracking-[-0.03em] text-navy-950">
          <Link href={`/festivals/${festival.slug}`} className="rounded-sm transition-colors hover:text-science-700">{festival.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{festival.summary}</p>
        <div className="mt-5 grid gap-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500 sm:grid-cols-2">
          <span className="inline-flex items-center gap-2"><Icon name="calendar" className="size-4 text-science-600" />{festival.dateLabel}</span>
          <span className="inline-flex items-center gap-2"><Icon name="location" className="size-4 text-science-600" />{festival.venue}</span>
        </div>
      </div>
    </article>
  );
}
