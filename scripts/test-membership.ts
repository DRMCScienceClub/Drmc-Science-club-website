import assert from "node:assert/strict";
import { applicationSchema, reviewSchema } from "../src/lib/membership/schema";

const valid = {
  full_name: "Test Student", college_id: "TEST-001", academic_class: "11", section: "A", shift: "Morning",
  email: "", phone: "", areas_of_interest: ["Research"], other_interest: "",
  reason_for_joining: "I would like to explore science with others.", previous_experience: "", contribution_interest: "", acknowledgement: "on",
};
assert.equal(applicationSchema.safeParse(valid).success, true, "optional contact and achievements may be blank");
for (const field of ["full_name", "college_id", "academic_class", "section", "shift", "reason_for_joining", "acknowledgement"]) {
  assert.equal(applicationSchema.safeParse({ ...valid, [field]: "" }).success, false, `required ${field}`);
}
for (const patch of [
  { email: "invalid" }, { phone: "abc1234567" }, { phone: "12" }, { areas_of_interest: [] },
  { areas_of_interest: ["Injected interest"] }, { areas_of_interest: ["Other"] },
  { reason_for_joining: "x".repeat(1001) }, { previous_experience: "x".repeat(1001) }, { contribution_interest: "x".repeat(1001) },
]) assert.equal(applicationSchema.safeParse({ ...valid, ...patch }).success, false);
assert.equal(applicationSchema.safeParse({ ...valid, areas_of_interest: ["Other"], other_interest: "Astronomy", email: "test@example.com", phone: "+880 1700-000000" }).success, true);
const stripped = applicationSchema.parse({ ...valid, status: "approved", admin_notes: "injected" });
assert.equal("status" in stripped, false);
assert.equal("admin_notes" in stripped, false);
assert.equal(reviewSchema.safeParse({ id: "00000000-0000-4000-8000-000000000001", status: "approved", admin_notes: "Reviewed" }).success, true);
assert.equal(reviewSchema.safeParse({ id: "not-an-id", status: "approved", admin_notes: "" }).success, false);
assert.equal(reviewSchema.safeParse({ id: "00000000-0000-4000-8000-000000000001", status: "invalid", admin_notes: "" }).success, false);
console.log("Membership validation tests passed.");
