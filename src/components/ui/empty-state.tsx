import { ButtonLink } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";

export function EmptyState({
  title = "Nothing to show yet",
  description = "New content will appear here when it is published.",
  icon = "flask",
  action,
}: {
  title?: string;
  description?: string;
  icon?: IconName;
  action?: { label: string; href: string };
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-science-50 text-science-600"><Icon name={icon} /></span>
      <h2 className="mt-5 text-xl font-extrabold text-navy-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {action && <ButtonLink href={action.href} variant="outline" className="mt-6">{action.label}</ButtonLink>}
    </div>
  );
}
