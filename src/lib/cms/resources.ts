import type { IconName } from "@/components/ui/icon";

export const publicationStatuses = ["draft", "published", "archived"] as const;
export type PublicationStatus = (typeof publicationStatuses)[number];

export type CmsTable =
  | "festivals"
  | "activities"
  | "achievements"
  | "magazines"
  | "executive_panels"
  | "notifications";

export type CmsResourceKey =
  | "festivals"
  | "activities"
  | "achievements"
  | "magazines"
  | "executives"
  | "notifications";

export type CmsField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "datetime-local" | "url" | "select" | "checkbox" | "json";
  required?: boolean;
  help?: string;
  options?: ReadonlyArray<{ label: string; value: string }>;
  placeholder?: string;
  fullWidth?: boolean;
};

export type CmsResource = {
  key: CmsResourceKey;
  table: CmsTable;
  label: string;
  singular: string;
  description: string;
  icon: IconName;
  publicBasePath?: string;
  fields: readonly CmsField[];
};

const commonFields: readonly CmsField[] = [
  { name: "title", label: "Title", type: "text", required: true, fullWidth: true },
  {
    name: "slug",
    label: "URL slug",
    type: "text",
    help: "Leave blank to generate it from the title.",
  },
  {
    name: "cover_image_url",
    label: "Cover image URL",
    type: "url",
    help: "Choose a published media URL or use an existing approved asset path.",
  },
  {
    name: "summary",
    label: "Summary",
    type: "textarea",
    required: true,
    fullWidth: true,
    help: "A concise public introduction. Plain text only.",
  },
];

const advancedDataField: CmsField = {
  name: "data_json",
  label: "Structured page data",
  type: "json",
  fullWidth: true,
  help: "Advanced: edit the complete page model as JSON. This includes galleries, descriptions, links, and other presentation details.",
};

export const cmsResources: readonly CmsResource[] = [
  {
    key: "festivals",
    table: "festivals",
    label: "Festivals",
    singular: "festival",
    description: "Edit editions, segments, schedules, results, sponsors, and partners.",
    icon: "atom",
    publicBasePath: "/festivals",
    fields: [
      ...commonFields,
      { name: "edition", label: "Edition", type: "text", required: true },
      { name: "festival_year", label: "Year", type: "number", required: true },
      { name: "starts_at", label: "Starts", type: "datetime-local" },
      { name: "ends_at", label: "Ends", type: "datetime-local" },
      { name: "venue", label: "Venue", type: "text" },
      {
        name: "registration_status",
        label: "Registration",
        type: "select",
        required: true,
        options: [
          { label: "Opening soon", value: "opening-soon" },
          { label: "Open", value: "open" },
          { label: "Closed", value: "closed" },
          { label: "Not required", value: "not-required" },
        ],
      },
      {
        name: "sponsors_json",
        label: "Sponsors",
        type: "json",
        fullWidth: true,
        help: "JSON list of sponsor objects: name, role, href, and optional logo { src, alt, width, height }.",
      },
      {
        name: "partners_json",
        label: "Partners",
        type: "json",
        fullWidth: true,
        help: "JSON list of partner objects. Exact public role labels are preserved.",
      },
      {
        name: "segments_json",
        label: "Segments",
        type: "json",
        fullWidth: true,
        help: "JSON list of festival segments.",
      },
      {
        name: "schedule_json",
        label: "Schedule",
        type: "json",
        fullWidth: true,
        help: "JSON list of schedule days and their items.",
      },
      {
        name: "results_json",
        label: "Results",
        type: "json",
        fullWidth: true,
        help: "JSON list of result entries.",
      },
      advancedDataField,
    ],
  },
  {
    key: "activities",
    table: "activities",
    label: "Activities",
    singular: "activity",
    description: "Publish workshops, observations, competitions, outreach, and seminars.",
    icon: "flask",
    publicBasePath: "/activities",
    fields: [
      ...commonFields,
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: ["Workshop", "Observation", "Competition", "Outreach", "Seminar"].map((value) => ({ label: value, value })),
      },
      {
        name: "event_status",
        label: "Event state",
        type: "select",
        required: true,
        options: [
          { label: "Upcoming", value: "upcoming" },
          { label: "Completed", value: "completed" },
        ],
      },
      { name: "starts_at", label: "Starts", type: "datetime-local" },
      { name: "ends_at", label: "Ends", type: "datetime-local" },
      { name: "location", label: "Location", type: "text" },
      advancedDataField,
    ],
  },
  {
    key: "achievements",
    table: "achievements",
    label: "Achievements",
    singular: "achievement",
    description: "Record awards, recipients, competitions, and approved photographs.",
    icon: "trophy",
    publicBasePath: "/achievements",
    fields: [
      ...commonFields,
      {
        name: "recipients",
        label: "Recipients",
        type: "text",
        help: "Separate multiple names with commas.",
      },
      { name: "competition", label: "Competition", type: "text", required: true },
      { name: "achievement_year", label: "Year", type: "number" },
      advancedDataField,
    ],
  },
  {
    key: "magazines",
    table: "magazines",
    label: "Magazines",
    singular: "magazine issue",
    description: "Manage Aurora covers, reader links, and approved PDF editions.",
    icon: "book",
    publicBasePath: "/magazines",
    fields: [
      ...commonFields,
      { name: "publication_year", label: "Publication year", type: "number", required: true },
      { name: "volume", label: "Volume", type: "text" },
      { name: "reader_url", label: "Online reader URL", type: "url" },
      { name: "pdf_url", label: "PDF URL", type: "url" },
      advancedDataField,
    ],
  },
  {
    key: "executives",
    table: "executive_panels",
    label: "Executive panels",
    singular: "executive panel",
    description: "Maintain sessions, exact designations, departments, and approved portraits.",
    icon: "users",
    publicBasePath: "/executives",
    fields: [
      ...commonFields,
      { name: "session_label", label: "Session", type: "text", required: true },
      { name: "starts_year", label: "Starts year", type: "number", required: true },
      { name: "ends_year", label: "Ends year", type: "number", required: true },
      { name: "is_current", label: "Current panel", type: "checkbox" },
      advancedDataField,
    ],
  },
  {
    key: "notifications",
    table: "notifications",
    label: "Notifications",
    singular: "notification",
    description: "Control scheduled public notices and urgent announcement bars.",
    icon: "globe",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, fullWidth: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "message", label: "Message", type: "textarea", required: true, fullWidth: true },
      {
        name: "tone",
        label: "Tone",
        type: "select",
        required: true,
        options: [
          { label: "Information", value: "info" },
          { label: "Announcement", value: "announcement" },
          { label: "Urgent", value: "urgent" },
        ],
      },
      { name: "starts_at", label: "Starts", type: "datetime-local", required: true },
      { name: "ends_at", label: "Ends", type: "datetime-local" },
      { name: "link_label", label: "Link label", type: "text" },
      { name: "link_url", label: "Link URL", type: "url" },
    ],
  },
] as const;

export function getCmsResource(value: string) {
  return cmsResources.find((resource) => resource.key === value) ?? null;
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}
