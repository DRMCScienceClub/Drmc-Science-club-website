import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
  return (
    <main className="science-grid-dark flex min-h-screen items-center justify-center bg-navy-950 px-5 py-16 text-white">
      <div className="w-full max-w-2xl text-center">
        <Logo inverse className="justify-center" />
        <div className="mx-auto mt-12 inline-flex size-20 items-center justify-center rounded-3xl border border-science-300/20 bg-white/5 text-science-300"><Icon name="atom" className="size-10" /></div>
        <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.18em] text-teal-300">Error 404</p>
        <h1 className="mt-3 text-balance font-display text-4xl font-extrabold tracking-tight sm:text-5xl">This experiment led somewhere unexpected.</h1>
        <p className="mx-auto mt-5 max-w-lg leading-7 text-slate-300">The page may have moved, or the address may be incorrect. Return to the homepage and continue exploring.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" variant="secondary" icon="arrow-left" iconPosition="left">Back to home</ButtonLink>
          <ButtonLink href="/contact" variant="light">Report a problem</ButtonLink>
        </div>
        <Link href="/activities" className="mt-8 inline-block rounded-sm text-sm font-bold text-science-200 underline underline-offset-4 hover:text-white">Or browse our latest activities</Link>
      </div>
    </main>
  );
}
