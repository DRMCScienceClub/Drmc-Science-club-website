import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icon";
import { PrototypeBanner } from "@/app/admin/_components/prototype-banner";

export const metadata: Metadata = {
  title: "Administrator Sign-in Prototype",
  description:
    "Static Phase 1 preview of the future DRMC Science Club administrator sign-in experience.",
};

const accessPrinciples = [
  "Administrator access only—there will be no public member login.",
  "Role checks will protect every content change, not only this screen.",
  "Credentials and sessions will be handled by a secure provider in a later phase.",
] as const;

export default function AdminLoginPage() {
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
              Future content operations
            </p>
            <p className="mt-5 max-w-lg font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] xl:text-5xl">
              Steward the club&apos;s public record with care.
            </p>
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-300">
              This proposed workspace will help authorised club administrators
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
            DRMC Science Club · Phase 1 visual prototype
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
              A static preview of the private access point planned for authorised
              club administrators.
            </p>

            <div className="mt-6">
              <PrototypeBanner compact />
            </div>

            <div
              role="note"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-900"
            >
              Do not enter any password or personal credential. All controls
              below are intentionally disabled.
            </div>

            <form
              aria-describedby="login-help"
              aria-label="Disabled administrator sign-in form"
              className="mt-7"
            >
              <fieldset disabled className="space-y-5">
                <legend className="sr-only">
                  Administrator credentials — unavailable in Phase 1
                </legend>

                <div>
                  <label
                    htmlFor="admin-email"
                    className="text-sm font-extrabold text-navy-900"
                  >
                    Institutional email
                  </label>
                  <div className="relative mt-2">
                    <Icon
                      name="mail"
                      className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="admin-email"
                      type="email"
                      placeholder="Authentication is not connected"
                      className="min-h-12 w-full rounded-xl border border-slate-300 bg-slate-100 py-3 pl-11 pr-4 text-sm font-semibold text-slate-500 opacity-100"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="admin-password"
                      className="text-sm font-extrabold text-navy-900"
                    >
                      Password
                    </label>
                    <span className="text-xs font-bold text-slate-500">
                      Recovery unavailable
                    </span>
                  </div>
                  <div className="relative mt-2">
                    <Icon
                      name="shield"
                      className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="admin-password"
                      type="password"
                      placeholder="Credentials are not accepted"
                      className="min-h-12 w-full rounded-xl border border-slate-300 bg-slate-100 py-3 pl-11 pr-4 text-sm font-semibold text-slate-500 opacity-100"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-300 px-5 text-sm font-extrabold text-slate-600 opacity-100"
                >
                  Sign-in unavailable in Phase 1
                  <Icon name="arrow-right" className="size-4" />
                </button>
              </fieldset>
            </form>

            <p id="login-help" className="mt-4 text-center text-xs font-semibold leading-5 text-slate-500">
              Real access will require an administrator invitation, secure
              authentication, and role-based authorisation.
            </p>

            <div className="mt-7 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-bold text-science-700 transition-colors hover:bg-science-50"
              >
                <Icon name="arrow-left" className="size-4" />
                Back to public website
              </Link>
              <Link
                href="/admin"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-navy-900"
              >
                Preview dashboard
                <Icon name="chevron-right" className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
