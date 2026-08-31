"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { PublishedMediaChoice } from "@/lib/cms/admin-repository";

type OrganizationLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type OrganizationValue = {
  name: string;
  role: string;
  href?: string;
  logo?: OrganizationLogo;
};

function initialOrganizations(value: string): OrganizationValue[] {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => {
      const record = item && typeof item === "object" ? item as Record<string, unknown> : {};
      const sourceLogo = record.logo && typeof record.logo === "object"
        ? record.logo as Record<string, unknown>
        : null;
      const src = typeof sourceLogo?.src === "string" ? sourceLogo.src : "";
      return {
        name: typeof record.name === "string" ? record.name : "",
        role: typeof record.role === "string" ? record.role : "",
        href: typeof record.href === "string" ? record.href : "",
        logo: src ? {
          src,
          alt: typeof sourceLogo?.alt === "string" ? sourceLogo.alt : "",
          width: typeof sourceLogo?.width === "number" ? sourceLogo.width : 1600,
          height: typeof sourceLogo?.height === "number" ? sourceLogo.height : 900,
        } : undefined,
      };
    });
  } catch {
    return [];
  }
}

function blankOrganization(kind: "Sponsors" | "Partners"): OrganizationValue {
  return { name: "", role: kind === "Sponsors" ? "Sponsor" : "Programme partner", href: "" };
}

export function FestivalOrganizationsField({
  name,
  label,
  initialValue,
  media,
  errors,
}: {
  name: "sponsors_json" | "partners_json";
  label: "Sponsors" | "Partners";
  initialValue: string;
  media: PublishedMediaChoice[];
  errors?: string[];
}) {
  const [organizations, setOrganizations] = useState(() => initialOrganizations(initialValue));

  function update(index: number, changes: Partial<OrganizationValue>) {
    setOrganizations((current) => current.map((organization, itemIndex) => itemIndex === index
      ? { ...organization, ...changes }
      : organization));
  }

  function updateLogo(index: number, changes: Partial<OrganizationLogo>) {
    setOrganizations((current) => current.map((organization, itemIndex) => {
      if (itemIndex !== index) return organization;
      const logo = organization.logo ?? {
        src: "",
        alt: organization.name ? `${organization.name} logo` : "Organization logo",
        width: 1600,
        height: 900,
      };
      return { ...organization, logo: { ...logo, ...changes } };
    }));
  }

  function chooseMedia(index: number, id: string) {
    const asset = media.find((item) => item.id === id);
    if (!asset?.public_url) return;
    const organization = organizations[index];
    update(index, {
      logo: {
        src: asset.public_url,
        alt: asset.alt_text || `${organization.name || "Organization"} logo`,
        width: asset.width ?? 1600,
        height: asset.height ?? 900,
      },
    });
  }

  const serialized = JSON.stringify(organizations.map((organization) => ({
    name: organization.name.trim(),
    role: organization.role.trim(),
    ...(organization.href?.trim() ? { href: organization.href.trim() } : {}),
    ...(organization.logo?.src.trim() ? { logo: {
      ...organization.logo,
      src: organization.logo.src.trim(),
      alt: organization.logo.alt.trim() || `${organization.name.trim()} logo`,
    } } : {}),
  })), null, 2);

  return (
    <section className="md:col-span-2 rounded-2xl border border-science-200 bg-science-50/60 p-4 sm:p-5">
      <textarea name={name} value={serialized} readOnly hidden />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-extrabold text-navy-950">{label}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-600">Add organizations visually and select logos from published media.</p>
        </div>
        <Link href="/admin/media" target="_blank" className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-science-300 bg-white px-3 text-xs font-extrabold text-science-800 hover:bg-science-100">
          Upload media <Icon name="external" className="size-3.5" />
        </Link>
      </div>

      <div className="mt-4 space-y-4">
        {organizations.map((organization, index) => (
          <article key={`${label}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-science-700">{label.slice(0, -1)} {index + 1}</p>
              <button type="button" onClick={() => setOrganizations((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-extrabold text-red-700 hover:bg-red-50"><Icon name="close" className="size-3.5" /> Remove</button>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[8rem_minmax(0,1fr)]">
              <div className="relative grid aspect-square place-items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {organization.logo?.src ? (
                  <Image src={organization.logo.src} alt={organization.logo.alt || ""} fill sizes="128px" className="object-contain p-2" />
                ) : <Icon name="globe" className="size-8 text-slate-300" />}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-extrabold text-navy-900">Organization name
                  <input value={organization.name} onChange={(event) => update(index, { name: event.target.value })} required className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-semibold" />
                </label>
                <label className="text-xs font-extrabold text-navy-900">Public role
                  <input value={organization.role} onChange={(event) => update(index, { role: event.target.value })} required className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-semibold" />
                </label>
                <label className="text-xs font-extrabold text-navy-900 sm:col-span-2">Website URL
                  <input type="url" value={organization.href ?? ""} onChange={(event) => update(index, { href: event.target.value })} placeholder="https://…" className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-semibold" />
                </label>
                <label className="text-xs font-extrabold text-navy-900 sm:col-span-2">Choose published logo
                  <select value="" onChange={(event) => chooseMedia(index, event.target.value)} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold">
                    <option value="">Select from media library…</option>
                    {media.map((asset) => <option key={asset.id} value={asset.id}>{asset.original_name} — {asset.alt_text}</option>)}
                  </select>
                </label>
                <label className="text-xs font-extrabold text-navy-900 sm:col-span-2">Logo URL
                  <input value={organization.logo?.src ?? ""} onChange={(event) => updateLogo(index, { src: event.target.value })} placeholder="Select media above or enter an approved path" className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 px-3 font-mono text-xs font-semibold" />
                </label>
                <label className="text-xs font-extrabold text-navy-900 sm:col-span-2">Logo alternative text
                  <input value={organization.logo?.alt ?? ""} onChange={(event) => updateLogo(index, { alt: event.target.value })} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-semibold" />
                </label>
              </div>
            </div>
          </article>
        ))}

        {!organizations.length && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm font-semibold text-slate-500">No {label.toLowerCase()} added yet.</div>
        )}
      </div>

      <button type="button" onClick={() => setOrganizations((current) => [...current, blankOrganization(label)])} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-science-700 px-4 text-sm font-extrabold text-white hover:bg-science-800">
        <span className="text-lg leading-none">+</span> Add {label.slice(0, -1).toLowerCase()}
      </button>
      {!media.length && <p className="mt-3 text-xs font-semibold text-amber-800">No published images are available yet. Upload one in Media Library, publish it, then refresh this editor.</p>}
      {errors?.map((message) => <p key={message} className="mt-2 text-xs font-bold text-red-700">{message}</p>)}
    </section>
  );
}
