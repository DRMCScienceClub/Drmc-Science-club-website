import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";

export default function PublicNotFound() {
  return (
    <main className="science-grid flex min-h-[68vh] items-center bg-slate-50 py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl border border-science-200 bg-white text-science-700 shadow-card"><Icon name="atom" className="size-8" /></span>
          <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.16em] text-teal-700">Error 404</p>
          <h1 className="mt-3 text-balance font-display text-4xl font-extrabold tracking-[-0.04em] text-navy-950 sm:text-5xl">We couldn&apos;t find that record.</h1>
          <p className="mx-auto mt-5 max-w-lg leading-7 text-slate-600">The activity, festival, magazine, or page may have moved. Use one of the paths below to continue exploring.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/" icon="arrow-left" iconPosition="left">Back to home</ButtonLink>
            <ButtonLink href="/activities" variant="outline">Browse activities</ButtonLink>
          </div>
        </div>
      </Container>
    </main>
  );
}
