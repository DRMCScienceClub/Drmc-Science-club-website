import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Achievement } from "@/types/content";

function recipientLabel(recipients: string[]) {
  return recipients.join(" & ");
}

export function AchievementCard({ achievement }: { achievement: Achievement & { slug?: string } }) {
  const recipients = recipientLabel(achievement.recipients);

  return (
    <article
      id={achievement.id}
      data-reveal="up"
      className="surface-card group flex h-full scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-surface-border shadow-card"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-navy-950">
        <Image
          src={achievement.image.src}
          alt={achievement.image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain transition-transform duration-500 group-hover:scale-[1.015]"
        />
        <div className="absolute left-4 top-4">
          <StatusBadge tone={achievement.year ? "blue" : "slate"}>
            {achievement.year ?? "Date not printed"}
          </StatusBadge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-teal-700">
          {achievement.award}
        </p>
        <h2 className="mt-3 text-balance font-display text-xl font-extrabold tracking-[-0.025em] text-navy-950">
          {achievement.slug ? (
            <Link href={`/achievements/${achievement.slug}`} className="rounded-sm transition-colors hover:text-science-700">
              {recipients}
            </Link>
          ) : recipients}
        </h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-science-800">
          {achievement.competition}
        </p>

        {achievement.details.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
            {achievement.details.map((detail) => (
              <li key={detail} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-400" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}

        {(achievement.organizer || achievement.location) && (
          <dl className="mt-auto space-y-2 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-500">
            {achievement.organizer && (
              <div className="flex items-start gap-2">
                <Icon name="users" className="mt-0.5 size-4 shrink-0 text-teal-600" />
                <div>
                  <dt className="sr-only">Organizer</dt>
                  <dd>{achievement.organizer}</dd>
                </div>
              </div>
            )}
            {achievement.location && (
              <div className="flex items-start gap-2">
                <Icon name="location" className="mt-0.5 size-4 shrink-0 text-teal-600" />
                <div>
                  <dt className="sr-only">Location</dt>
                  <dd>{achievement.location}</dd>
                </div>
              </div>
            )}
          </dl>
        )}
      </div>
    </article>
  );
}
