"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icon";
import { primaryNavigation } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-lg">
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1320px] items-center justify-between gap-5 px-5 sm:px-7 lg:px-10">
        <Logo />

        <nav aria-label="Primary navigation" className="hidden items-center gap-0.5 xl:flex">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-bold transition-colors",
                isActive(pathname, item.href)
                  ? "bg-science-50 text-science-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-navy-950",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/join" className="ml-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-science-600 px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-science-700/15 transition-colors hover:bg-science-700">
            Join the club
            <Icon name="arrow-right" className="size-4" />
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-navy-900 transition-colors hover:bg-slate-50 xl:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>

      <div id="mobile-navigation" hidden={!open} className="border-t border-slate-200 bg-white xl:hidden">
        <nav aria-label="Mobile navigation" className="mx-auto grid max-w-[1240px] gap-1 px-5 py-5 sm:px-7 lg:px-10">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center justify-between rounded-xl px-4 py-2.5 text-base font-bold",
                isActive(pathname, item.href) ? "bg-science-50 text-science-700" : "text-slate-700 hover:bg-slate-50",
              )}
            >
              {item.label}
              <Icon name="chevron-right" className="size-4" />
            </Link>
          ))}
          <Link href="/join" onClick={() => setOpen(false)} className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-science-600 px-5 py-3 text-base font-extrabold text-white">
            Join the Club
            <Icon name="arrow-right" className="size-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
