import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Icon, type IconName } from "@/components/ui/icon";

const adminNav: ReadonlyArray<{
  label: string;
  icon: IconName;
  current?: boolean;
}> = [
  { label: "Overview", icon: "globe", current: true },
  { label: "Festivals", icon: "atom" },
  { label: "Activities", icon: "flask" },
  { label: "Magazines", icon: "book" },
  { label: "Executives", icon: "users" },
];

function AdminNavigation({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav aria-label={mobile ? "Admin sections" : "Administration"}>
      <ul
        className={
          mobile
            ? "flex min-w-max gap-2 px-4 pb-4"
            : "mt-8 grid gap-1.5"
        }
      >
        {adminNav.map((item) => (
          <li key={item.label}>
            {item.current ? (
              <Link
                href="/admin"
                aria-current="page"
                className={
                  mobile
                    ? "inline-flex min-h-11 items-center gap-2 rounded-xl bg-science-100 px-4 text-sm font-bold text-science-700"
                    : "flex min-h-11 items-center gap-3 rounded-xl bg-white/10 px-3.5 text-sm font-bold text-white"
                }
              >
                <Icon name={item.icon} className="size-4" />
                {item.label}
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className={
                  mobile
                    ? "inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-500"
                    : "flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold text-slate-300"
                }
                title="Available after the content management system is connected"
              >
                <Icon name={item.icon} className="size-4" />
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f6f9] text-navy-950">
      <a className="skip-link" href="#admin-main">
        Skip to dashboard content
      </a>

      <header className="border-b border-slate-200 bg-white lg:hidden">
        <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6">
          <Logo compact />
          <div className="text-right">
            <span className="block text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-science-700">
              Admin workspace
            </span>
            <span className="mt-0.5 block text-xs font-semibold text-slate-500">
              Mock dashboard
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <AdminNavigation mobile />
        </div>
      </header>

      <div className="mx-auto grid min-h-screen max-w-[1680px] lg:grid-cols-[17.5rem_minmax(0,1fr)]">
        <aside className="science-grid-dark sticky top-0 hidden h-screen flex-col overflow-y-auto bg-navy-950 px-5 py-7 text-white lg:flex">
          <Logo inverse />

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="px-3.5 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-science-300">
              Content workspace
            </p>
            <AdminNavigation />
          </div>

          <div className="mt-auto space-y-4 pt-8">
            <div className="rounded-2xl border border-amber-300/20 bg-amber-200/10 p-4">
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.15em] text-amber-200">
                Prototype mode
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-amber-50">
                Read-only mock content. Nothing can be published or deleted.
              </p>
            </div>
            <Link
              href="/"
              className="flex min-h-11 items-center justify-between rounded-xl border border-white/15 px-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              Public website
              <Icon name="external" className="size-4 text-science-300" />
            </Link>
          </div>
        </aside>

        <main id="admin-main" className="min-w-0 px-4 py-7 sm:px-6 sm:py-9 xl:px-10 xl:py-11">
          {children}
        </main>
      </div>
    </div>
  );
}
