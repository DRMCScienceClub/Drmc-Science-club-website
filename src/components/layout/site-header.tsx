"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icon";
import { primaryNavigation } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

const standardNavigation = primaryNavigation.filter((item) => !item.highlighted);
const highlightedNavigation = primaryNavigation.find((item) => item.highlighted);

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header-enter sticky top-0 z-50 border-b border-paper-200/90 bg-paper-50/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1320px] items-center justify-between gap-5 px-5 sm:px-7 lg:px-10">
        <Logo />

        <nav aria-label="Primary navigation" className="hidden items-center gap-0.5 xl:flex">
          {standardNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-bold transition-colors",
                isActive(pathname, item.href)
                  ? "bg-navy-950 text-white"
                  : "text-slate-600 hover:bg-paper-100 hover:text-navy-950",
              )}
            >
              {item.label}
            </Link>
          ))}
          {highlightedNavigation && (
            <Link href={highlightedNavigation.href} className="ml-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-teal-700/15 transition-colors hover:bg-navy-950">
              {highlightedNavigation.label}
              <Icon name="arrow-right" className="size-4" />
            </Link>
          )}
          <ThemeSwitcher className="ml-3" />
        </nav>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-xl border border-paper-200 bg-paper-50 text-navy-900 transition-colors hover:bg-paper-100 xl:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>

      <div id="mobile-navigation" hidden={!open} className="mobile-menu-enter max-sm:max-h-[calc(100dvh-4.75rem)] max-sm:overflow-y-auto max-sm:overscroll-contain border-t border-paper-200 bg-paper-50 xl:hidden">
        <nav aria-label="Mobile navigation" className="mx-auto grid max-w-[1240px] gap-1 px-5 py-3 sm:px-7 sm:py-5 lg:px-10">
          {standardNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center justify-between rounded-xl px-4 py-2.5 text-base font-bold",
                isActive(pathname, item.href) ? "bg-navy-950 text-white" : "text-slate-700 hover:bg-paper-100",
              )}
            >
              {item.label}
              <Icon name="chevron-right" className="size-4" />
            </Link>
          ))}
          {highlightedNavigation && (
            <Link href={highlightedNavigation.href} onClick={() => setOpen(false)} className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-base font-extrabold text-white">
              {highlightedNavigation.label}
              <Icon name="arrow-right" className="size-4" />
            </Link>
          )}
          <div className="mt-3 border-t border-paper-200 pt-4"><p className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">Appearance</p><ThemeSwitcher /></div>
        </nav>
      </div>
    </header>
  );
}
