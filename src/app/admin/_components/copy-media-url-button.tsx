"use client";

import { useState } from "react";

export function CopyMediaUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
      className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
    >
      {copied ? "Copied" : "Copy public URL"}
    </button>
  );
}
