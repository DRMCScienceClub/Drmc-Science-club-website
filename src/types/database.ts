/**
 * Checked-in Phase 2 database contract.
 *
 * Regenerate a fully expanded version from the linked project after applying
 * migrations with:
 *   npx supabase gen types typescript --linked > src/types/database.generated.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AdminRole = "super_admin" | "editor" | "contributor";
export type PublicationStatus = "draft" | "published" | "archived";
export type SubmissionStatus = "new" | "in_review" | "resolved" | "spam" | "archived";

type Table<Row, Insert = Partial<Row>, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type ProfileRow = {
  id: string;
  email: string;
  display_name: string;
  role: AdminRole;
  is_active: boolean;
  avatar_url: string | null;
  last_signed_in_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentRow = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: PublicationStatus;
  is_featured: boolean;
  cover_image_url: string | null;
  data: Json;
  published_at: string | null;
  archived_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type FestivalRow = ContentRow & {
  edition: string;
  festival_year: number | null;
  starts_at: string | null;
  ends_at: string | null;
  venue: string;
  registration_status: string;
};

export type ActivityRow = ContentRow & {
  category: string;
  event_status: string;
  starts_at: string | null;
  ends_at: string | null;
  location: string;
};

export type AchievementRow = ContentRow & {
  recipients: string[];
  competition: string;
  achievement_year: number | null;
};

export type MagazineRow = ContentRow & {
  publication_year: number;
  volume: string;
  pdf_url: string | null;
  reader_url: string | null;
};

export type ExecutivePanelRow = ContentRow & {
  session_label: string;
  starts_year: number;
  ends_year: number;
  is_current: boolean;
};

export type NotificationRow = Omit<ContentRow, "summary" | "cover_image_url" | "data"> & {
  message: string;
  tone: "info" | "announcement" | "urgent";
  link_label: string | null;
  link_url: string | null;
  starts_at: string;
  ends_at: string | null;
};

export type MediaAssetRow = {
  id: string;
  bucket: "cms-staging" | "cms-public";
  object_path: string;
  original_name: string;
  mime_type: string;
  byte_size: number;
  width: number | null;
  height: number | null;
  alt_text: string;
  caption: string;
  credit: string;
  status: PublicationStatus;
  public_url: string | null;
  uploaded_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactSubmissionRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: SubmissionStatus;
  admin_notes: string;
  source: string;
  created_at: string;
  updated_at: string;
};

export type JoinSubmissionRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  academic_class: string;
  interests: string[];
  motivation: string;
  consent: boolean;
  status: SubmissionStatus;
  admin_notes: string;
  source: string;
  created_at: string;
  updated_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: Table<ProfileRow>;
      festivals: Table<FestivalRow>;
      festival_segments: Table<Record<string, Json>>;
      festival_schedule_items: Table<Record<string, Json>>;
      festival_results: Table<Record<string, Json>>;
      organizations: Table<Record<string, Json>>;
      festival_organizations: Table<Record<string, Json>>;
      activities: Table<ActivityRow>;
      achievements: Table<AchievementRow>;
      magazines: Table<MagazineRow>;
      executive_panels: Table<ExecutivePanelRow>;
      executive_members: Table<Record<string, Json>>;
      notifications: Table<NotificationRow>;
      media_assets: Table<MediaAssetRow>;
      contact_submissions: Table<ContactSubmissionRow>;
      join_submissions: Table<JoinSubmissionRow>;
      site_settings: Table<{ key: string; value: Json; description: string; updated_by: string | null; updated_at: string }>;
      audit_logs: Table<Record<string, Json>>;
    };
    Views: Record<string, never>;
    Functions: {
      current_admin_role: { Args: Record<PropertyKey, never>; Returns: AdminRole | null };
      is_active_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: {
      app_role: AdminRole;
      publication_status: PublicationStatus;
      submission_status: SubmissionStatus;
      notification_tone: "info" | "announcement" | "urgent";
      festival_organization_kind: "sponsor" | "partner";
    };
    CompositeTypes: Record<string, never>;
  };
}
