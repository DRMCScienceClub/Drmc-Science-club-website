import "server-only";

import { contactDetails, socialLinks } from "@/data";
import type { ContactDetails, SocialLink } from "@/types/content";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export type PublicContactSettings = ContactDetails & {
  socialLinks: readonly SocialLink[];
};

type SettingsRow = { value?: Record<string, unknown> };

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function addressLines(value: unknown) {
  if (!Array.isArray(value)) return contactDetails.addressLines;
  const lines = value.filter((line): line is string => typeof line === "string" && Boolean(line.trim())).map((line) => line.trim()).slice(0, 5);
  return lines.length ? lines : contactDetails.addressLines;
}

export async function getPublicContactSettings(): Promise<PublicContactSettings> {
  const config = getSupabasePublicConfig();
  let value: Record<string, unknown> = {};

  if (config) {
    const search = new URLSearchParams({ select: "value", key: "eq.public_contact", limit: "1" });
    const response = await fetch(`${config.url.replace(/\/$/, "")}/rest/v1/site_settings?${search}`, {
      headers: { apikey: config.publishableKey, Authorization: `Bearer ${config.publishableKey}`, Accept: "application/json" },
      next: { revalidate: 300, tags: ["settings:public_contact"] },
    });
    if (!response.ok) throw new Error(`Unable to load public contact settings (${response.status}).`);
    const rows = await response.json() as SettingsRow[];
    value = rows[0]?.value ?? {};
  }

  const fallbackFacebook = socialLinks.find((item) => item.platform === "Facebook")!;
  const fallbackInstagram = socialLinks.find((item) => item.platform === "Instagram")!;
  const facebook: SocialLink = {
    ...fallbackFacebook,
    href: text(value.facebookUrl, fallbackFacebook.href),
    handle: text(value.facebookHandle, fallbackFacebook.handle),
  };
  const instagram: SocialLink = {
    ...fallbackInstagram,
    href: text(value.instagramUrl, fallbackInstagram.href),
    handle: text(value.instagramHandle, fallbackInstagram.handle),
  };

  return {
    institution: text(value.institution, contactDetails.institution),
    clubName: text(value.clubName, contactDetails.clubName),
    addressLines: addressLines(value.addressLines),
    email: text(value.email, contactDetails.email),
    phone: text(value.phone, contactDetails.phone),
    officeHours: text(value.officeHours, contactDetails.officeHours),
    mapUrl: text(value.mapUrl, contactDetails.mapUrl),
    socialLinks: [facebook, instagram],
  };
}
