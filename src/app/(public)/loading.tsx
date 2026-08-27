import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading page" className="min-h-[70vh] bg-slate-50">
      <div className="science-grid-dark bg-navy-950 py-20">
        <Container>
          <div className="h-4 w-28 animate-pulse rounded-full bg-teal-300/30" />
          <div className="mt-6 h-12 max-w-xl animate-pulse rounded-xl bg-white/10" />
          <div className="mt-4 h-5 max-w-2xl animate-pulse rounded-lg bg-white/10" />
        </Container>
      </div>
      <Container className="grid gap-6 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="aspect-[16/10] animate-pulse bg-slate-200" />
            <div className="space-y-4 p-6"><div className="h-4 w-24 animate-pulse rounded bg-slate-200" /><div className="h-7 w-4/5 animate-pulse rounded bg-slate-200" /><div className="h-4 w-full animate-pulse rounded bg-slate-100" /></div>
          </div>
        ))}
      </Container>
    </main>
  );
}
