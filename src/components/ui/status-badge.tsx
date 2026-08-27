import { cn } from "@/lib/utils";

export function StatusBadge({
  children,
  tone = "blue",
  dot = true,
}: {
  children: React.ReactNode;
  tone?: "blue" | "teal" | "amber" | "slate";
  dot?: boolean;
}) {
  const tones = {
    blue: "border-science-200 bg-science-50 text-science-700",
    teal: "border-teal-200 bg-teal-50 text-teal-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
  };
  const dots = {
    blue: "bg-science-500",
    teal: "bg-teal-500",
    amber: "bg-amber-500",
    slate: "bg-slate-400",
  };
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-[0.09em]", tones[tone])}>
      {dot && <span className={cn("size-1.5 rounded-full", dots[tone])} />}
      {children}
    </span>
  );
}
