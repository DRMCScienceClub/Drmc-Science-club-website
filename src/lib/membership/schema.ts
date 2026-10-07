import { z } from "zod";

export const applicationInterests = ["General Science", "Research", "Robotics & Engineering", "Programming & Technology", "Mathematics & Problem Solving", "Olympiads", "Quizzing", "Science Projects & Innovation", "Event Organization", "Other"] as const;
export const applicationClasses = Array.from({ length: 12 }, (_, index) => String(index + 1));
export const applicationShifts = ["Morning", "Day"] as const;
export const applicationStatuses = ["pending", "under_review", "approved", "rejected"] as const;
export const statusLabels = { pending: "Pending", under_review: "Under Review", approved: "Approved", rejected: "Rejected" };

export const applicationSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name.").max(120),
  college_id: z.string().trim().min(1, "Enter your college ID or roll.").max(40).regex(/^[\p{L}\p{N} /-]+$/u, "Use letters, numbers, spaces, / or - only."),
  academic_class: z.string().refine((value) => applicationClasses.includes(value), "Select your class."),
  section: z.string().trim().min(1, "Enter your section.").max(20),
  shift: z.enum(applicationShifts, { error: "Select your shift." }),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address.").max(254)]),
  phone: z.string().trim().max(30).refine((value) => !value || (/^\+?[\d\s()-]+$/.test(value) && value.replace(/\D/g, "").length >= 7 && value.replace(/\D/g, "").length <= 15), "Enter a valid phone number (7–15 digits)."),
  areas_of_interest: z.array(z.enum(applicationInterests)).min(1, "Select at least one interest.").max(10).transform((items) => [...new Set(items)]),
  other_interest: z.string().trim().max(160),
  reason_for_joining: z.string().trim().min(10, "Write at least 10 characters.").max(1000),
  previous_experience: z.string().trim().max(1000),
  contribution_interest: z.string().trim().max(1000),
  acknowledgement: z.literal("on", { error: "Please confirm that your information is accurate." }),
}).superRefine((data, context) => {
  if (data.areas_of_interest.includes("Other") && !data.other_interest) context.addIssue({ code: "custom", path: ["other_interest"], message: "Tell us your other area of interest." });
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type ApplicationState = { success?: boolean; message?: string; reference?: string; fieldErrors?: Record<string, string[]>; values?: Record<string, string> };
export const reviewSchema = z.object({ id: z.uuid(), status: z.enum(applicationStatuses), admin_notes: z.string().trim().max(5000) });
