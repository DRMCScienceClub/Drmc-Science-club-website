import { z } from "zod";
import { publicationStatuses, slugify, type CmsResource } from "@/lib/cms/resources";

const optionalUrl = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) => !value || value.startsWith("/") || /^https?:\/\//i.test(value),
    "Use an https:// URL or a site-relative /path.",
  );

const optionalDate = z
  .string()
  .trim()
  .refine((value) => !value || !Number.isNaN(Date.parse(value)), "Enter a valid date and time.");

const jsonText = z.string().trim().max(500_000).refine((value) => {
  if (!value) return true;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}, "Enter valid JSON.");

export type CmsFormResult = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export function validateCmsForm(resource: CmsResource, formData: FormData) {
  const shape: Record<string, z.ZodType> = {
    id: z.string().uuid().optional().or(z.literal("")),
    title: z.string().trim().min(2, "Enter at least 2 characters.").max(180),
    slug: z.string().trim().max(120).optional(),
    status: z.enum(publicationStatuses),
    is_featured: z.boolean(),
  };

  for (const field of resource.fields) {
    if (field.name in shape) continue;

    let schema: z.ZodType;
    switch (field.type) {
      case "number":
        schema = z.string().trim().refine((value) => !value || /^\d+$/.test(value), "Enter a whole number.");
        break;
      case "url":
        schema = optionalUrl;
        break;
      case "date":
      case "datetime-local":
        schema = optionalDate;
        break;
      case "json":
        schema = jsonText;
        break;
      case "checkbox":
        schema = z.boolean();
        break;
      default:
        schema = z.string().trim().max(field.type === "textarea" ? 20_000 : 500);
    }

    if (field.required && field.type !== "checkbox") {
      schema = schema.refine((value) => typeof value === "string" && value.length > 0, `${field.label} is required.`);
    }
    shape[field.name] = schema;
  }

  const input: Record<string, unknown> = {
    id: String(formData.get("id") ?? ""),
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    status: String(formData.get("status") ?? "draft"),
    is_featured: formData.get("is_featured") === "on",
  };

  for (const field of resource.fields) {
    if (field.name in input) continue;
    input[field.name] = field.type === "checkbox"
      ? formData.get(field.name) === "on"
      : String(formData.get(field.name) ?? "");
  }

  const parsed = z.object(shape).safeParse(input);
  if (!parsed.success) return parsed;

  const data = parsed.data as Record<string, unknown>;
  data.slug = slugify(String(data.slug || data.title));
  if (!data.slug) {
    return {
      success: false as const,
      error: new z.ZodError([{ code: "custom", path: ["slug"], message: "A valid slug could not be generated." }]),
    };
  }
  return { success: true as const, data };
}

export function parseJsonField(value: unknown, fallback: unknown) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  return JSON.parse(value) as unknown;
}
