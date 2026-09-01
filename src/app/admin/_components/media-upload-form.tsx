"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";

type UploadState = {
  kind: "idle" | "uploading" | "success" | "error";
  message: string;
};

type QueuedFile = {
  id: string;
  file: File;
  previewUrl: string | null;
  altText: string;
  status: "queued" | "uploading" | "success" | "error";
  message: string;
};

const initialState: UploadState = { kind: "idle", message: "" };
const maximumBatchSize = 20;

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

function uploadMedia(data: FormData, onProgress: (progress: number) => void) {
  return new Promise<{ ok: boolean; message: string }>((resolve) => {
    const request = new XMLHttpRequest();
    request.open("POST", "/api/admin/media");
    request.responseType = "json";
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    request.onload = () => {
      resolve({
        ok: request.status >= 200 && request.status < 300,
        message: request.response?.message ?? "The upload could not be completed.",
      });
    };
    request.onerror = () => resolve({ ok: false, message: "Network error while uploading." });
    request.send(data);
  });
}

function fileSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.ceil(bytes / 1024))} KB`;
}

export function MediaUploadForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrls = useRef(new Set<string>());
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [state, setState] = useState<UploadState>(initialState);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const urls = previewUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  function releasePreview(item: QueuedFile) {
    if (!item.previewUrl) return;
    URL.revokeObjectURL(item.previewUrl);
    previewUrls.current.delete(item.previewUrl);
  }

  function selectFiles(selected: FileList | null) {
    files.forEach(releasePreview);
    setState(initialState);
    setProgress(0);

    const nextFiles = Array.from(selected ?? []).slice(0, maximumBatchSize).map((file, index) => {
      const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
      if (previewUrl) previewUrls.current.add(previewUrl);
      return {
        id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
        file,
        previewUrl,
        altText: "",
        status: "queued" as const,
        message: "",
      };
    });

    setFiles(nextFiles);
    if ((selected?.length ?? 0) > maximumBatchSize) {
      setState({ kind: "error", message: `Only the first ${maximumBatchSize} files were added.` });
    }
  }

  function updateFile(id: string, changes: Partial<QueuedFile>) {
    setFiles((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item));
  }

  function removeFile(id: string) {
    setFiles((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed) releasePreview(removed);
      return current.filter((item) => item.id !== id);
    });
    setState(initialState);
    setProgress(0);
  }

  function clearFiles() {
    files.forEach(releasePreview);
    setFiles([]);
    setState(initialState);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const pendingFiles = files.filter((item) => item.status !== "success");
    if (!pendingFiles.length) {
      setState({ kind: "error", message: "Choose one or more images or PDFs first." });
      return;
    }

    const missingAltText = pendingFiles.find(
      (item) => item.file.type.startsWith("image/") && item.altText.trim().length < 3,
    );
    if (missingAltText) {
      setState({ kind: "error", message: `Add useful alternative text for ${missingAltText.file.name}.` });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const caption = String(formData.get("caption") ?? "");
    const credit = String(formData.get("credit") ?? "");
    let completed = 0;
    let failed = 0;

    setState({ kind: "uploading", message: `Preparing ${pendingFiles.length} files…` });
    setProgress(0);

    for (const [index, item] of pendingFiles.entries()) {
      updateFile(item.id, { status: "uploading", message: "Uploading…" });
      setState({
        kind: "uploading",
        message: `Uploading ${index + 1} of ${pendingFiles.length}: ${item.file.name}`,
      });

      const data = new FormData();
      data.set("file", item.file);
      data.set("alt_text", item.altText.trim());
      data.set("caption", caption);
      data.set("credit", credit);

      const dimensions = await imageDimensions(item.file);
      if (dimensions) {
        data.set("width", String(dimensions.width));
        data.set("height", String(dimensions.height));
      }

      const result = await uploadMedia(data, (fileProgress) => {
        setProgress(Math.round(((index + fileProgress) / pendingFiles.length) * 100));
      });

      if (result.ok) completed += 1;
      else failed += 1;
      updateFile(item.id, {
        status: result.ok ? "success" : "error",
        message: result.ok ? "Uploaded to staging." : result.message,
      });
      setProgress(Math.round(((index + 1) / pendingFiles.length) * 100));
    }

    router.refresh();
    if (failed) {
      setState({
        kind: "error",
        message: `${completed} uploaded successfully; ${failed} failed. Correct the errors and retry the failed files.`,
      });
    } else {
      setState({
        kind: "success",
        message: `${completed} ${completed === 1 ? "file" : "files"} uploaded to secure staging.`,
      });
    }
  }

  const pendingCount = files.filter((item) => item.status !== "success").length;

  return (
    <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="grid gap-5">
        <div>
          <label htmlFor="media-file" className="text-sm font-extrabold text-navy-900">Files</label>
          <input
            ref={fileInputRef}
            id="media-file"
            name="files"
            type="file"
            multiple
            required={!files.length}
            accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
            onChange={(event) => selectFiles(event.target.files)}
            disabled={state.kind === "uploading"}
            className="mt-2 block min-h-12 w-full cursor-pointer rounded-xl border border-dashed border-science-300 bg-science-50 px-3 py-2 text-sm font-semibold text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-navy-950 file:px-4 file:py-2 file:text-xs file:font-extrabold file:text-white disabled:cursor-wait disabled:opacity-60"
          />
          <p className="mt-1.5 text-xs leading-5 text-slate-500">Select up to {maximumBatchSize} JPEG, PNG, WebP, AVIF, or PDF files. Maximum 25 MB per file. SVG and HTML are blocked.</p>
        </div>

        {files.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-600">{files.length} selected</p>
              <button type="button" onClick={clearFiles} disabled={state.kind === "uploading"} className="text-xs font-extrabold text-red-700 hover:text-red-900 disabled:opacity-50">Clear selection</button>
            </div>
            <div className="divide-y divide-slate-200">
              {files.map((item) => (
                <div key={item.id} className="grid gap-3 p-4 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-start">
                  <div
                    className="grid aspect-square place-items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 bg-contain bg-center bg-no-repeat"
                    style={item.previewUrl ? { backgroundImage: `url(${JSON.stringify(item.previewUrl)})` } : undefined}
                  >
                    {!item.previewUrl && <Icon name="book" className="size-6 text-slate-300" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="truncate text-sm font-extrabold text-navy-950">{item.file.name}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[0.62rem] font-extrabold uppercase tracking-[0.08em] ${item.status === "success" ? "bg-teal-100 text-teal-800" : item.status === "error" ? "bg-red-100 text-red-800" : item.status === "uploading" ? "bg-science-100 text-science-800" : "bg-slate-100 text-slate-600"}`}>{item.status}</span>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{fileSize(item.file.size)} · {item.file.type || "Unknown file type"}</p>
                    <label htmlFor={`media-alt-${item.id}`} className="mt-3 block text-xs font-extrabold text-navy-900">
                      {item.file.type.startsWith("image/") ? "Alternative text *" : "Document description"}
                    </label>
                    <input
                      id={`media-alt-${item.id}`}
                      value={item.altText}
                      onChange={(event) => updateFile(item.id, { altText: event.target.value })}
                      required={item.file.type.startsWith("image/")}
                      maxLength={240}
                      disabled={state.kind === "uploading" || item.status === "success"}
                      placeholder={item.file.type.startsWith("image/") ? "Describe what this image shows" : "Optional description of this document"}
                      className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-semibold shadow-sm disabled:bg-slate-100"
                    />
                    {item.message && <p className={`mt-2 text-xs font-bold ${item.status === "error" ? "text-red-700" : item.status === "success" ? "text-teal-700" : "text-slate-500"}`}>{item.message}</p>}
                  </div>
                  <button type="button" onClick={() => removeFile(item.id)} disabled={state.kind === "uploading" || item.status === "success"} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40">Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="media-caption" className="text-sm font-extrabold text-navy-900">Shared caption</label>
            <input id="media-caption" name="caption" maxLength={500} disabled={state.kind === "uploading"} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3.5 text-sm font-semibold shadow-sm disabled:bg-slate-100" />
            <p className="mt-1.5 text-xs text-slate-500">Optional; applied to every file in this batch.</p>
          </div>
          <div>
            <label htmlFor="media-credit" className="text-sm font-extrabold text-navy-900">Shared credit/source</label>
            <input id="media-credit" name="credit" maxLength={240} disabled={state.kind === "uploading"} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3.5 text-sm font-semibold shadow-sm disabled:bg-slate-100" />
            <p className="mt-1.5 text-xs text-slate-500">Optional; applied to every file in this batch.</p>
          </div>
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:sticky lg:top-24">
        <div className="grid aspect-video place-items-center rounded-xl border border-slate-200 bg-white text-center">
          <div>
            <Icon name="download" className="mx-auto size-8 text-slate-300" />
            <p className="mt-2 text-sm font-extrabold text-navy-950">{files.length ? `${files.length} files ready` : "Choose your media"}</p>
            <p className="mt-1 text-xs text-slate-500">Uploads run one file at a time.</p>
          </div>
        </div>
        {state.kind === "uploading" && (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-science-600 transition-[width]" style={{ width: `${progress}%` }} /></div>
        )}
        {state.message && <p role={state.kind === "error" ? "alert" : "status"} className={`mt-3 text-xs font-bold leading-5 ${state.kind === "error" ? "text-red-700" : state.kind === "success" ? "text-teal-700" : "text-slate-600"}`}>{state.message}</p>}
        <button disabled={state.kind === "uploading" || !pendingCount} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-navy-950 px-4 text-sm font-extrabold text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-slate-400">
          <Icon name="download" className="size-4 rotate-180" />
          {state.kind === "uploading" ? `${progress}% uploaded` : pendingCount > 1 ? `Upload ${pendingCount} files` : "Upload to staging"}
        </button>
      </aside>
    </form>
  );
}
