import { LogoMark } from "@/components/brand/logo";

export default function AdminLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="science-grid grid min-h-screen place-items-center bg-[#f3f7fa] px-4"
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-card">
        <LogoMark className="mx-auto" />
        <p className="mt-5 font-display text-lg font-extrabold text-navy-950">
          Loading mock admin workspace…
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Phase 1 prototype · no live account or data connection
        </p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-science-600 to-teal-400" />
        </div>
      </div>
    </main>
  );
}
