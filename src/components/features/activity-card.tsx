import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Activity } from "@/types/content";
import { cn } from "@/lib/utils";

export function ActivityCard({ activity, featured = false }: { activity: Activity; featured?: boolean }) {
  const isPosterRecord = activity.recordStatus === "poster-verified";

  return (
    <article data-reveal="up" className={cn("surface-card group overflow-hidden rounded-3xl border border-surface-border shadow-card", featured && "lg:grid lg:grid-cols-[1.15fr_1fr]")}>
      <Link href={`/activities/${activity.slug}`} className={cn("relative block overflow-hidden bg-navy-900", featured ? "min-h-64 lg:min-h-full" : "aspect-[16/10]")} aria-label={`View ${activity.title}`}>
        <Image
          src={activity.image.src}
          alt={activity.image.alt}
          fill
          sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className={cn(
            "transition-transform duration-500",
            isPosterRecord
              ? "object-contain p-2"
              : "object-cover group-hover:scale-[1.025]",
          )}
        />
        <div className="absolute left-4 top-4"><StatusBadge tone={activity.status === "upcoming" ? "teal" : "slate"}>{activity.status}</StatusBadge></div>
      </Link>
      <div className={cn("flex flex-col p-5 sm:p-6", featured && "justify-center sm:p-8")}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-slate-500">
          <span className="text-science-700">{activity.category}</span>
          <span className="inline-flex items-center gap-1.5"><Icon name="calendar" className="size-3.5" />{activity.dateLabel}</span>
        </div>
        <h3 className={cn("mt-3 font-display font-extrabold tracking-[-0.025em] text-navy-950", featured ? "text-2xl sm:text-3xl" : "text-xl")}>
          <Link href={`/activities/${activity.slug}`} className="rounded-sm transition-colors hover:text-science-700">{activity.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{activity.excerpt}</p>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
          <span className="inline-flex min-w-0 items-center gap-2 truncate text-slate-500"><Icon name="location" className="size-4 text-teal-600" /><span className="truncate">{activity.location}</span></span>
          <Link href={`/activities/${activity.slug}`} aria-label={`Read more about ${activity.title}`} className="ml-3 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-science-50 text-science-700 transition-colors group-hover:bg-science-600 group-hover:text-white"><Icon name="arrow-right" className="size-4" /></Link>
        </div>
      </div>
    </article>
  );
}
