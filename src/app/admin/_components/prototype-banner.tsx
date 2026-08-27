import { Icon } from "@/components/ui/icon";

type PrototypeBannerProps = {
  compact?: boolean;
};

export function PrototypeBanner({ compact = false }: PrototypeBannerProps) {
  return (
    <aside
      aria-label="Phase 1 prototype notice"
      className="rounded-2xl border border-amber-300/70 bg-amber-50 px-4 py-3.5 text-amber-950 shadow-sm sm:px-5"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-amber-200/70 text-amber-800">
          <Icon name="shield" className="size-4" />
        </span>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-800">
            Phase 1 · visual prototype
          </p>
          <p className="mt-1 text-sm font-semibold leading-6">
            {compact
              ? "This screen is not connected to authentication or a database."
              : "This dashboard uses local mock content. Authentication, publishing, uploads, and database changes are not connected."}
          </p>
        </div>
      </div>
    </aside>
  );
}
