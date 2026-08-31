import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Icon, type IconName } from "@/components/ui/icon";
import type { AdminIdentity } from "@/lib/auth";
import { logoutAction } from "@/app/admin/_components/logout-action";

const adminNav: ReadonlyArray<{
  label: string;
  href: string;
  key: string;
  icon: IconName;
  minimumRole?: "editor" | "super_admin";
}> = [
  { label: "Overview", href: "/admin", key: "overview", icon: "globe" },
  { label: "Festivals", href: "/admin/festivals", key: "festivals", icon: "atom" },
  { label: "Activities", href: "/admin/activities", key: "activities", icon: "flask" },
  { label: "Achievements", href: "/admin/achievements", key: "achievements", icon: "trophy" },
  { label: "Magazines", href: "/admin/magazines", key: "magazines", icon: "book" },
  { label: "Executives", href: "/admin/executives", key: "executives", icon: "users" },
  { label: "Notifications", href: "/admin/notifications", key: "notifications", icon: "calendar" },
  { label: "Media library", href: "/admin/media", key: "media", icon: "download" },
  { label: "Submissions", href: "/admin/submissions", key: "submissions", icon: "mail", minimumRole: "editor" },
  { label: "Administrators", href: "/admin/users", key: "users", icon: "shield", minimumRole: "super_admin" },
  { label: "Audit history", href: "/admin/audit", key: "audit", icon: "clock", minimumRole: "editor" },
];

function canSee(item: (typeof adminNav)[number], role: AdminIdentity["role"]) {
  if (!item.minimumRole) return true;
  if (item.minimumRole === "super_admin") return role === "super_admin";
  return role === "super_admin" || role === "editor";
}

function AdminNavigation({
  active,
  identity,
  mobile = false,
}: {
  active: string;
  identity: AdminIdentity;
  mobile?: boolean;
}) {
  return (
    <nav aria-label={mobile ? "Admin sections" : "Administration"}>
      <ul className={mobile ? "flex min-w-max gap-2 px-4 pb-4" : "mt-5 grid gap-1.5"}>
        {adminNav.filter((item) => canSee(item, identity.role)).map((item) => {
          const current = item.key === active;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={mobile
                  ? `inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors ${current ? "bg-science-100 text-science-700" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`
                  : `flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-bold transition-colors ${current ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
              >
                <Icon name={item.icon} className="size-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function AdminShell({
  children,
  identity,
  active = "overview",
}: {
  children: React.ReactNode;
  identity: AdminIdentity;
  active?: string;
}) {
  const displayName = identity.displayName || identity.email || "Administrator";
  const roleLabel = identity.role.replace("_", " ");

  return (
    <div className="min-h-screen bg-[#f3f6f9] text-navy-950">
      <a className="skip-link" href="#admin-main">Skip to dashboard content</a>

      <header className="border-b border-slate-200 bg-white lg:hidden">
        <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6">
          <Logo compact />
          <div className="text-right">
            <span className="block text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-science-700">Admin workspace</span>
            <span className="mt-0.5 block max-w-48 truncate text-xs font-semibold text-slate-500">{displayName}</span>
          </div>
        </div>
        <div className="overflow-x-auto"><AdminNavigation active={active} identity={identity} mobile /></div>
      </header>

      <div className="mx-auto grid min-h-screen max-w-[1780px] lg:grid-cols-[18.5rem_minmax(0,1fr)]">
        <aside className="science-grid-dark sticky top-0 hidden h-screen flex-col overflow-y-auto bg-navy-950 px-5 py-7 text-white lg:flex">
          <Logo inverse />

          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
            <p className="truncate text-sm font-extrabold text-white">{displayName}</p>
            <p className="mt-1 text-[0.65rem] font-extrabold uppercase tracking-[0.15em] text-teal-300">{roleLabel}</p>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="px-3.5 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-science-300">Content workspace</p>
            <AdminNavigation active={active} identity={identity} />
          </div>

          <div className="mt-auto space-y-3 pt-8">
            <Link href="/" className="flex min-h-11 items-center justify-between rounded-xl border border-white/15 px-4 text-sm font-bold text-white transition-colors hover:bg-white/10">
              Public website
              <Icon name="external" className="size-4 text-science-300" />
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="flex min-h-11 w-full items-center justify-between rounded-xl px-4 text-sm font-bold text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
                Sign out
                <Icon name="arrow-right" className="size-4" />
              </button>
            </form>
          </div>
        </aside>

        <main id="admin-main" className="min-w-0 px-4 py-7 sm:px-6 sm:py-9 xl:px-10 xl:py-11">
          {children}
        </main>
      </div>
    </div>
  );
}
