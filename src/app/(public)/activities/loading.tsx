import { Container } from "@/components/ui/container";

export default function ActivitiesLoading() {
  return (
    <main aria-busy="true" aria-label="Loading activities">
      <section className="science-grid-dark bg-navy-950 py-20 sm:py-24">
        <Container>
          <div className="h-4 w-28 animate-pulse rounded-full bg-teal-300/20" />
          <div className="mt-6 h-12 max-w-2xl animate-pulse rounded-2xl bg-white/10 sm:h-16" />
          <div className="mt-5 h-6 max-w-xl animate-pulse rounded-xl bg-white/5" />
        </Container>
      </section>
      <section className="bg-white py-16 sm:py-20">
        <Container>
          <span className="sr-only">Loading activity content…</span>
          <div className="h-9 w-72 max-w-full animate-pulse rounded-xl bg-slate-200" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="overflow-hidden rounded-3xl border border-slate-200">
                <div className="aspect-[16/10] animate-pulse bg-slate-200" />
                <div className="space-y-4 p-6">
                  <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                  <div className="h-7 w-4/5 animate-pulse rounded bg-slate-200" />
                  <div className="h-16 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
