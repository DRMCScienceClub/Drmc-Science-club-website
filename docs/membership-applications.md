# Membership applications

The Contact page and `/join` offer separate online and offline application methods. Existing contact messages and legacy join submissions are retained.

## Supabase setup

1. Apply existing migrations 001–005 if not already applied. Do not rerun the foundation migration or reset the database.
2. In Supabase SQL Editor, open a **new query**, paste the complete contents of `supabase/migrations/202610070006_science_club_applications.sql`, and run it once. The file runs inside a transaction.
3. Ensure Vercel has the existing `NEXT_PUBLIC_SUPABASE_URL`, public Supabase key, and **server-only** `SUPABASE_SERVICE_ROLE_KEY`. Never prefix the service key with `NEXT_PUBLIC_`.
4. Deploy the code. If environment variables changed, redeploy after saving them.
5. Submit one clearly identified test application at `/contact#apply-online`. Verify the reference appears and the application appears at `/admin/applications`. Change its status and private notes, and confirm the reviewer and review time update.

This migration adds `science_club_applications`, its indexes, two reviewer RLS policies, a review-attribution trigger, and a service-role-only submission function. It does not change or delete existing student data.

## Privacy and permissions

- Public visitors submit through a validated Next.js Server Action. They cannot invoke the database submission function directly, or read, insert, update, or delete application rows.
- Active editors and super admins can list/read applications and update only `status` and `admin_notes`. This matches existing private-submission permissions.
- Contributors, inactive admins, and users without admin profiles cannot read or review applications. Both server authorization and database RLS enforce this.
- Review author and time are set by the database. Review names are retained if an administrator is later removed.
- Public responses contain a random `SC-` reference, not database IDs or private notes.
- A server-keyed hash deduplicates identical submissions, including network retries. A keyed IP hash uses the existing one-hour rate limiter. Raw IPs and application contents are not logged by this feature.
- Admin search uses POST actions so student names and college IDs are not placed in URLs.
- Admin pages are dynamic; no application data is generated into public static pages.

## Routes and components

- `/contact#join-the-club`, `#apply-online`, and `#apply-offline`: the new Contact section.
- `/join`: reuses the same online/offline flow so existing navigation continues to work.
- `/admin/applications`: private search/filter list, 20 results per page.
- `/admin/applications/[id]`: private application detail and review form.
- `src/components/features/join-club-section.tsx`: public options and offline instructions.
- `src/app/(public)/_components/membership-form.tsx`: student, interests, questions, and acknowledgement fields.
- `src/lib/membership/schema.ts`: shared limits and server validation.

The blank official membership form is not yet supplied. After the club supplies an approved clean blank scan, upload/publish it in Media Library and replace `officialMembershipFormUrl` in `join-club-section.tsx` with its public URL. Do not use filled-out forms or handwritten student information.

## Checks

Run `node --import tsx scripts/test-membership.ts`, `npm run lint -- --max-warnings=0`, `npm run typecheck`, and `npm run build`.

Before production use, apply the migration and verify a real submission and admin review in the deployed environment. Development checks do not apply the migration to your live Supabase project.

Implementation verification (7 October 2026): the migration was executed against disposable PostgreSQL (PGlite), including submission/reference generation, deduplication, validation, rate limiting, role-based read/update denial, reviewer attribution, and protected-column checks. Browser tests covered desktop and 390px/320px Contact layouts, online/offline links, required-field errors, the Other field, and the unauthenticated dashboard redirect. A separate local integration test used synthetic Auth sessions and a disposable database to exercise successful submission, the editor dashboard, status/note persistence, reviewer attribution, contributor denial, and public note privacy. These checks do not replace a final test against your deployed Supabase project after migration.

## Changed files

Created:

- `src/components/features/join-club-section.tsx`
- `src/app/(public)/_components/membership-form.tsx`
- `src/app/(public)/membership-actions.ts`
- `src/lib/membership/schema.ts`
- `src/lib/membership/repository.ts`
- `src/app/admin/applications/page.tsx`
- `src/app/admin/applications/application-list.tsx`
- `src/app/admin/applications/actions.ts`
- `src/app/admin/applications/review-form.tsx`
- `src/app/admin/applications/[id]/page.tsx`
- `supabase/migrations/202610070006_science_club_applications.sql`
- `scripts/test-membership.ts`
- `docs/membership-applications.md`

Modified:

- `src/app/(public)/contact/page.tsx` — adds membership section and fixes narrow-screen contact-card overflow.
- `src/app/(public)/join/page.tsx` — reuses the new application flow.
- `src/app/admin/_components/admin-shell.tsx` — adds the reviewer-only menu entry.
- `README.md` — links setup instructions.
