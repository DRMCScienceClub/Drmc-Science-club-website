import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function AdminPageHeader({
  eyebrow = "Content management",
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.035em] text-navy-950 sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
      </div>
      {action && (
        <Link href={action.href} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-navy-950 px-5 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-navy-800">
          {action.label}
          <Icon name="arrow-right" className="size-4" />
        </Link>
      )}
    </div>
  );
}
