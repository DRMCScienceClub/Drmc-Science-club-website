"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";

type UploadState = {
  kind: "idle" | "uploading" | "success" | "error";
  message: string;
};

const initialState: UploadState = { kind: "idle", message: "" };

function imageDimensions(file: File) {
  return new Promise<{ width: number; height: number } | null>((resolve) => {
    if (!file.type.startsWith("image/")) return resolve(null);
    const url = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    image.src = url;
  });
}

export function MediaUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<UploadState>(initialState);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function selectFile(file: File | null) {
    setState(initialState);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file?.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("file");
    if (!(file instanceof File) || !file.size) {
      setState({ kind: "error", message: "Choose an image or PDF first." });
      return;
    }

    const dimensions = await imageDimensions(file);
    if (dimensions) {
      data.set("width", String(dimensions.width));
      data.set("height", String(dimensions.height));
    }

    setState({ kind: "uploading", message: "Uploading securely…" });
    setProgress(0);

    const request = new XMLHttpRequest();
    request.open("POST", "/api/admin/media");
    request.responseType = "json";
    request.upload.onprogress = (uploadEvent) => {
      if (uploadEvent.lengthComputable) {
        setProgress(Math.round((uploadEvent.loaded / uploadEvent.total) * 100));
      }
    };
    request.onload = () => {
      const message = request.response?.message ?? "The upload could not be completed.";
      if (request.status >= 200 && request.status < 300) {
        setProgress(100);
        setState({ kind: "success", message });
        formRef.current?.reset();
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        window.setTimeout(() => window.location.reload(), 650);
      } else {
        setState({ kind: "error", message });
      }
    };
    request.onerror = () => setState({ kind: "error", message: "Network error while uploading." });
    request.send(data);
  }

  return (
    <form ref={formRef} onSubmit={submit} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="media-file" className="text-sm font-extrabold text-navy-900">File</label>
          <input
            id="media-file"
            name="file"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
            onChange={(event) => selectFile(event.target.files?.[0] ?? null)}
            className="mt-2 block min-h-12 w-full cursor-pointer rounded-xl border border-dashed border-science-300 bg-science-50 px-3 py-2 text-sm font-semibold text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-navy-950 file:px-4 file:py-2 file:text-xs file:font-extrabold file:text-white"
          />
          <p className="mt-1.5 text-xs leading-5 text-slate-500">JPEG, PNG, WebP, AVIF, or PDF. Maximum 25 MB. SVG and HTML are blocked.</p>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="media-alt" className="text-sm font-extrabold text-navy-900">Alternative text <span className="text-red-600">*</span></label>
          <input id="media-alt" name="alt_text" required maxLength={240} placeholder="Example: United Healthcare title sponsor logo" className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3.5 text-sm font-semibold shadow-sm" />
        </div>
        <div>
          <label htmlFor="media-caption" className="text-sm font-extrabold text-navy-900">Caption</label>
          <input id="media-caption" name="caption" maxLength={500} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3.5 text-sm font-semibold shadow-sm" />
        </div>
        <div>
          <label htmlFor="media-credit" className="text-sm font-extrabold text-navy-900">Credit/source</label>
          <input id="media-credit" name="credit" maxLength={240} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3.5 text-sm font-semibold shadow-sm" />
        </div>
      </div>

      <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div
          className="grid aspect-video place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white bg-contain bg-center bg-no-repeat"
          style={preview ? { backgroundImage: `url(${JSON.stringify(preview)})` } : undefined}
        >
          {!preview && <Icon name="download" className="size-8 text-slate-300" />}
        </div>
        {state.kind === "uploading" && (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-science-600 transition-[width]" style={{ width: `${progress}%` }} /></div>
        )}
        {state.message && <p role={state.kind === "error" ? "alert" : "status"} className={`mt-3 text-xs font-bold leading-5 ${state.kind === "error" ? "text-red-700" : state.kind === "success" ? "text-teal-700" : "text-slate-600"}`}>{state.message}</p>}
        <button disabled={state.kind === "uploading"} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-navy-950 px-4 text-sm font-extrabold text-white hover:bg-navy-800 disabled:cursor-wait disabled:bg-slate-400">
          <Icon name="download" className="size-4 rotate-180" />
          {state.kind === "uploading" ? `${progress}% uploaded` : "Upload to staging"}
        </button>
      </aside>
    </form>
  );
}
