"use client";

import { useEffect } from "react";
import { Logo } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icon";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="science-grid-dark flex min-h-screen items-center justify-center bg-navy-950 px-5 py-16 text-white">
      <div className="w-full max-w-xl text-center">
        <Logo inverse className="justify-center" />
        <span className="mx-auto mt-12 inline-flex size-16 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300"><Icon name="flask" className="size-8" /></span>
        <h1 className="mt-7 text-balance font-display text-4xl font-extrabold">Something interrupted the experiment.</h1>
        <p className="mt-4 leading-7 text-slate-300">This page could not be displayed. You can try loading it again; no information has been changed.</p>
        <button type="button" onClick={reset} className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-2.5 text-sm font-extrabold text-navy-950 transition-colors hover:bg-teal-300">
          Try again
          <Icon name="arrow-right" className="size-4" />
        </button>
      </div>
    </main>
  );
}
