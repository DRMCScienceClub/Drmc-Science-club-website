import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function NotAuthorized({
  title = "You do not have permission for this action.",
  description = "Your administrator role does not include access to this area. Ask a super administrator if your responsibilities have changed.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-white p-7 text-center shadow-card sm:p-10">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-amber-100 text-amber-800"><Icon name="shield" /></span>
      <h1 className="mt-5 font-display text-2xl font-extrabold tracking-[-0.03em] text-navy-950">{title}</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      <Link href="/admin" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-navy-950 px-5 text-sm font-extrabold text-white hover:bg-navy-800"><Icon name="arrow-left" className="size-4" /> Back to dashboard</Link>
    </section>
  );
}
