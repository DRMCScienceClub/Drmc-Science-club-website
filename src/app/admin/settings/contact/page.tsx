import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { ContactSettingsForm } from "@/app/admin/_components/contact-settings-form";
import { NotAuthorized } from "@/app/admin/_components/not-authorized";
import { contactDetails, socialLinks } from "@/data";
import { requireAdmin } from "@/lib/auth";
import { getPublicContactSetting } from "@/lib/cms/admin-repository";

export const dynamic = "force-dynamic";

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export default async function ContactSettingsPage() {
  const identity = await requireAdmin("/admin/settings/contact");
  if (identity.role === "contributor") return <AdminShell identity={identity} active="settings"><NotAuthorized /></AdminShell>;
  const setting = await getPublicContactSetting();
  const lines = Array.isArray(setting.addressLines) ? setting.addressLines : contactDetails.addressLines;
  const facebook = socialLinks.find((item) => item.platform === "Facebook")!;
  const instagram = socialLinks.find((item) => item.platform === "Instagram")!;
  const values = {
    institution: text(setting.institution, contactDetails.institution),
    clubName: text(setting.clubName, contactDetails.clubName),
    addressLine1: text(lines[0], contactDetails.addressLines[0]),
    addressLine2: text(lines[1], contactDetails.addressLines[1]),
    addressLine3: text(lines[2], contactDetails.addressLines[2]),
    email: text(setting.email, contactDetails.email),
    phone: text(setting.phone, contactDetails.phone),
    officeHours: text(setting.officeHours, contactDetails.officeHours),
    mapUrl: text(setting.mapUrl, contactDetails.mapUrl),
    facebookUrl: text(setting.facebookUrl, facebook.href),
    facebookHandle: text(setting.facebookHandle, facebook.handle),
    instagramUrl: text(setting.instagramUrl, instagram.href),
    instagramHandle: text(setting.instagramHandle, instagram.handle),
  };

  return (
    <AdminShell identity={identity} active="settings">
      <div className="mx-auto max-w-[1080px]">
        <AdminPageHeader title="Contact settings" description="Edit the public club location, contact channels, office hours, map link, and official social profiles." />
        <ContactSettingsForm values={values} />
      </div>
    </AdminShell>
  );
}
