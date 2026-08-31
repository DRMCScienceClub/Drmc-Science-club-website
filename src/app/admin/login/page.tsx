import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icon";
import { LoginForm } from "@/app/admin/login/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Administrator Sign-in",
  description:
    "Secure administrator access for the DRMC Science Club content workspace.",
};

const accessPrinciples = [
  "Administrator access only—there will be no public member login.",
  "Role checks will protect every content change, not only this screen.",
  "Credentials and sessions are handled by Supabase Auth.",
] as const;

type LoginPageProps = {
  searchParams: Promise<{ returnTo?: string; setup?: string }>;
};

function safeReturnPath(value: string | undefined) {
  return value?.startsWith("/admin") &&
    value !== "/admin/login" &&
    !value.startsWith("//")
    ? value
    : "/admin";
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const configured = isSupabaseConfigured();
  const returnTo = safeReturnPath(query.returnTo);

  return (
    <main className="science-grid min-h-screen bg-[#f3f7fa] px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <a className="skip-link" href="#login-panel">
        Skip to administrator sign-in preview
      </a>

      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-6xl overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft sm:min-h-[calc(100vh-4rem)] lg:grid-cols-[minmax(0,0.92fr)_minmax(28rem,1.08fr)]">
        <section className="science-grid-dark relative hidden overflow-hidden bg-navy-950 p-10 text-white lg:flex lg:flex-col xl:p-14">
          <div
            aria-hidden="true"
            className="absolute -right-24 top-24 size-72 rounded-full border border-science-300/20"
          />
          <div
            aria-hidden="true"
            className="absolute -right-8 top-40 size-40 rounded-full border border-teal-300/20"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-20 left-10 size-2 rounded-full bg-teal-300 shadow-[60px_-24px_0_0_#84c8ff,135px_28px_0_0_#35c4b5,210px_-48px_0_0_#49a7ff]"
          />

          <div className="relative z-10">
            <Logo inverse />
          </div>

          <div className="relative z-10 my-auto py-16">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal-300">
              Content operations
            </p>
            <p className="mt-5 max-w-lg font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] xl:text-5xl">
              Steward the club&apos;s public record with care.
            </p>
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-300">
              This private workspace helps authorised club administrators
              review festival details, publish activity stories, maintain annual
              magazines, and archive executive panels.
            </p>

            <ul className="mt-9 grid gap-4" aria-label="Access principles">
              {accessPrinciples.map((principle) => (
                <li
                  key={principle}
                  className="flex items-start gap-3 text-sm font-semibold leading-6 text-slate-200"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-teal-300/15 text-teal-300">
                    <Icon name="check" className="size-3.5" strokeWidth={2.4} />
                  </span>
                  {principle}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative z-10 text-xs font-semibold text-slate-400">
            DRMC Science Club · Authorised access only
          </p>
        </section>

        <section
          id="login-panel"
          aria-labelledby="login-heading"
          className="flex flex-col justify-center px-5 py-7 sm:px-10 sm:py-10 xl:px-16"
        >
          <div className="mb-9 flex items-center justify-between gap-4 lg:hidden">
            <Logo compact />
            <Link
              href="/"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-extrabold text-science-700 transition-colors hover:bg-science-50"
            >
              Public site
              <Icon name="external" className="size-3.5" />
            </Link>
          </div>

          <div className="mx-auto w-full max-w-md">
            <p className="eyebrow">Restricted area</p>
            <h1
              id="login-heading"
              className="mt-3 font-display text-3xl font-extrabold tracking-[-0.035em] text-navy-950 sm:text-4xl"
            >
              Administrator sign-in
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Use an invited administrator account to enter the private content
              workspace.
            </p>

            {!configured && (
              <div role="status" className="mt-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-950">
                Supabase is not configured in this environment. Add the public
                project URL and publishable (or anon) key to enable sign-in.
              </div>
            )}

            <LoginForm configured={configured} returnTo={returnTo} />

            <p id="login-help" className="mt-4 text-center text-xs font-semibold leading-5 text-slate-500">
              Access requires an administrator invitation and an active assigned
              role. There is no public sign-up.
            </p>

            <div className="mt-7 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-bold text-science-700 transition-colors hover:bg-science-50"
              >
                <Icon name="arrow-left" className="size-4" />
                Back to public website
              </Link>
              <span className="text-xs font-bold text-slate-500">
                Invitation-only administrator access
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
