"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { PublishedMediaChoice } from "@/lib/cms/admin-repository";

export function MediaChoicePicker({
  choices,
  onSelect,
  placeholder = "Select from Media Library…",
  selectedUrl,
}: {
  choices: PublishedMediaChoice[];
  onSelect: (asset: PublishedMediaChoice) => void;
  placeholder?: string;
  selectedUrl?: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const selected = choices.find((asset) => asset.public_url === selectedUrl);
  const preview = choices.find((asset) => asset.id === previewId) ?? selected ?? choices[0];

  function choose(asset: PublishedMediaChoice) {
    onSelect(asset);
    setPreviewId(asset.id);
    detailsRef.current?.removeAttribute("open");
  }

  return (
    <details ref={detailsRef} className="group relative">
      <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-science-300 hover:bg-science-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-science-600">
        <span className="truncate">{selected?.original_name ?? placeholder}</span>
        <span aria-hidden className="shrink-0 text-science-700 transition-transform group-open:rotate-180">⌄</span>
      </summary>

      <div className="absolute left-0 right-0 z-40 mt-2 grid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:min-w-[30rem] sm:grid-cols-[minmax(0,1fr)_10rem]">
        <div className="max-h-72 overflow-y-auto overscroll-contain p-2" role="listbox" aria-label="Published media">
          {choices.map((asset) => {
            const isImage = asset.mime_type.startsWith("image/") && Boolean(asset.public_url);
            return (
              <button
                key={asset.id}
                type="button"
                role="option"
                aria-selected={asset.public_url === selectedUrl}
                onPointerEnter={() => setPreviewId(asset.id)}
                onFocus={() => setPreviewId(asset.id)}
                onClick={() => choose(asset)}
                className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-science-50 focus:bg-science-50 focus:outline-none"
              >
                <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                  {isImage ? (
                    <Image src={asset.public_url!} alt="" fill sizes="44px" className="object-contain p-1" />
                  ) : (
                    <Icon name="book" className="size-5 text-slate-400" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-extrabold text-navy-950">{asset.original_name}</span>
                  <span className="mt-0.5 block truncate text-[0.7rem] font-semibold text-slate-500">{asset.alt_text || asset.mime_type}</span>
                </span>
              </button>
            );
          })}
          {!choices.length && <p className="px-3 py-8 text-center text-xs font-semibold text-slate-500">No matching published media.</p>}
        </div>

        <div className="hidden border-l border-slate-200 bg-slate-50 p-3 sm:block">
          <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-slate-500">Preview</p>
          <div className="relative mt-2 grid aspect-square place-items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
            {preview?.mime_type.startsWith("image/") && preview.public_url ? (
              <Image src={preview.public_url} alt={preview.alt_text || "Media preview"} fill sizes="136px" className="object-contain p-2" />
            ) : (
              <Icon name="book" className="size-8 text-slate-300" />
            )}
          </div>
          <p className="mt-2 line-clamp-2 break-words text-[0.68rem] font-bold leading-4 text-navy-950">{preview?.original_name ?? "Hover over a file"}</p>
        </div>
      </div>
    </details>
  );
}
