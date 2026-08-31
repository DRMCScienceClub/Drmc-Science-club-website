# Supabase setup and operations

This guide provisions the Phase 2 CMS foundation for local development, staging,
and production. Use a different Supabase project for each environment. Never
copy production content, administrator accounts, or service-role keys into a
developer project.

## 1. Create the project

1. Sign in to [Supabase](https://supabase.com/dashboard) with the club-owned
   account, not a student's personal account.
2. Create a project in the nearest suitable region and save the database
   password in the club's approved password manager.
3. In **Project Settings → API**, copy the project URL and publishable/anonymous
   key. Reveal the service-role key only when a trusted server-side operation
   needs it.
4. Keep separate development, staging, and production projects. Link each
   deployment only to its matching project.

Install the repository and Supabase CLI dependencies:

```bash
npm ci
npx supabase --version
```

For a hosted project, authenticate and link the repository:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

If `supabase/config.toml` has not been created yet, run `npx supabase init` once
and review the generated configuration before committing it.

## 2. Configure local environment variables

Copy the example file and fill it locally:

```bash
cp .env.example .env.local
```

Required browser values:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_OR_PUBLISHABLE_KEY
```

Trusted server scripts additionally need:

```dotenv
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

The service-role key bypasses Row Level Security. It must remain server-only,
must never receive a `NEXT_PUBLIC_` prefix, and must not be logged, committed,
or exposed to a browser bundle. Use the deployment platform's encrypted secret
store outside local development.

## 3. Apply migrations

Review pending migrations before applying them:

```bash
npx supabase migration list
npx supabase db lint
npx supabase db push --dry-run
npx supabase db push
```

For the local Supabase stack:

```bash
npx supabase start
npx supabase db reset
```

The baseline migration is
`supabase/migrations/202608310001_phase_2_cms.sql`. It creates the content
tables, administrator profiles and roles, audit records, Row Level Security,
and Storage buckets.

The follow-up migration
`supabase/migrations/202608310002_media_workflow_hardening.sql` enables safe
staging cleanup and prevents contributors from publishing media metadata. Apply
both migrations in filename order before using the browser Media Library.

The public-form migration
`supabase/migrations/202608310003_secure_public_submissions.sql` replaces
direct anonymous submission-table inserts with validated Contact and Join RPCs
and a pseudonymous five-submissions-per-hour rate limit. Apply it before
enabling the public forms.

The contact-settings migration
`supabase/migrations/202608310004_public_contact_settings.sql` creates the
editable public contact record and permits anonymous visitors to read only that
single setting. Apply it before using `/admin/settings/contact`.

Applied migrations are immutable. Correct a deployed schema with a new
forward-only migration; do not edit an already applied file.

### Verify the migration

In the SQL editor, confirm that every exposed table has RLS enabled:

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```

Then test through the REST API with the anonymous key, not through the SQL
editor, because the SQL editor and service-role client bypass RLS. Anonymous
requests must see only rows whose `status` is `published` and whose
`published_at` is not in the future. They must never read profiles, audit logs,
drafts, or form submissions.

## 4. Storage buckets

The migration creates both buckets automatically:

| Bucket | Visibility | Purpose | Limit |
| --- | --- | --- | --- |
| `cms-staging` | Private | Unreviewed administrator uploads | 25 MiB |
| `cms-public` | Public | Approved public images and PDFs | 25 MiB |

Allowed MIME types are JPEG, PNG, WebP, AVIF, and PDF. Do not add SVG or HTML
uploads without a sanitization pipeline.

The public bucket is intentionally suitable only for already approved assets:
anyone who knows an object URL can fetch it regardless of the corresponding
`media_assets.status`. Upload to `cms-staging`, validate the actual file
signature, dimensions, size, malware/document safety, rights, and alternative
text, then promote an immutable UUID-named object to `cms-public` during the
publish operation. Do not overwrite a published path.

The admin Media Library now performs file-signature validation, uploads to the
private staging bucket, and lets an editor or super administrator promote an
immutable UUID-named copy to `cms-public`. Before production, verify that
contributors cannot upload directly to `cms-public` or publish media metadata.

## 5. Import the Phase 1 content

The TypeScript importer reads the current arrays in `src/data`, builds the root
rows expected by the migration, and preserves each complete public view model
inside the `data` JSON column. It deliberately reconstructs executive records
from public fields only and refuses committee phone, college-number, shift, or
signature keys.

Preview the deterministic plan without credentials or writes:

```bash
npx tsx scripts/seed-supabase.ts
```

Apply it to local Supabase:

```bash
node --env-file=.env.local --import tsx scripts/seed-supabase.ts --apply
```

A hosted project requires a second explicit acknowledgement:

```bash
node --env-file=.env.local --import tsx scripts/seed-supabase.ts --apply --confirm-remote
```

The importer upserts by slug, so an interrupted initial import can be rerun.
After editors begin changing content in the CMS, do not rerun it against that
environment: an upsert intentionally refreshes matching rows from `src/data`
and can overwrite editorial changes. Take a backup and verify media consent,
prototype provenance, links, and contact details before a production import.

## 6. Create the first authorised administrator

Public registration must remain disabled. In **Authentication → Providers →
Email**, disable open sign-up. Future administrators should be invited or
created by authorised club leadership and then activated by a super admin.

For the first account only, set temporary local values:

```dotenv
INITIAL_ADMIN_EMAIL=authorised-address@example.com
INITIAL_ADMIN_PASSWORD=TEMPORARY-STRONG-PASSWORD
INITIAL_ADMIN_NAME=Authorised Administrator
ALLOW_INITIAL_ADMIN_BOOTSTRAP=true
```

Run the guarded one-time bootstrap:

```bash
node --env-file=.env.local --import tsx scripts/bootstrap-admin.ts
```

The script:

- refuses to run unless `ALLOW_INITIAL_ADMIN_BOOTSTRAP` is exactly `true`;
- refuses to run if an active super admin already exists;
- creates and confirms the Auth user if necessary;
- activates its profile with the `super_admin` role; and
- does not change the password of a pre-existing Auth user.

Immediately after success:

1. Remove `INITIAL_ADMIN_PASSWORD` from `.env.local` and every secret store.
2. Set or remove `ALLOW_INITIAL_ADMIN_BOOTSTRAP` so it is no longer `true`.
3. Remove the remaining `INITIAL_ADMIN_*` values.
4. Restart local processes and redeploy hosted environments.
5. Sign in, change the temporary password, and verify the audit entry.

Never paste a real password into SQL, source code, an issue, or a chat message.

## 7. Roles and account lifecycle

| Role | Intended access |
| --- | --- |
| `super_admin` | Administrators, all content, publication, deletion, audit, and recovery |
| `editor` | Create/edit/publish content and review submissions; no administrator management |
| `contributor` | Create and edit permitted drafts; no publish, unpublish, or delete |

Deactivate a departing administrator in `profiles.is_active` before revoking
sessions. Do not delete the audit history. Review active accounts and roles at
each executive handover.

The baseline policies prevent contributors from changing published root rows,
editing normalized festival/panel relationships, or uploading directly into
the public bucket. Re-test those negative cases with a real contributor session
after every policy migration; do not rely on the dashboard hiding controls.

## 8. Redirect URLs and MFA

In **Authentication → URL Configuration** set:

- local site URL: `http://localhost:3000`;
- local redirect: `http://localhost:3000/auth/callback`;
- production site URL: the canonical HTTPS domain; and
- production redirect: `https://YOUR_DOMAIN/auth/callback`.

Add staging separately. Never use a wildcard broader than the deployment
provider requires.

Supabase MFA can be enabled later without bypassing Auth. First add enrolment,
challenge, recovery, and lost-device procedures; then require Authentication
Assurance Level 2 for sensitive server mutations and super-admin actions. Test
recovery with two authorised adults before enforcing it in production.

## 9. Deployment sequence

1. Back up the target database and record the current migration version.
2. Apply and test migrations in development, then staging.
3. Run anonymous, contributor, editor, and super-admin authorization tests.
4. Run the seed only for the initial controlled import.
5. Verify every supplied asset's permission and every prototype record.
6. Configure encrypted deployment secrets and exact Auth redirect URLs.
7. Deploy the application, run smoke tests, then enable editorial access.
8. Promote the same reviewed migrations to production; never point a preview
   deployment at the production database.

Application rollback and database rollback are separate. A backwards-compatible
schema lets the prior application release be redeployed safely. If a migration
changes data destructively, restore the pre-deploy backup or ship a reviewed
forward repair migration; do not improvise a production `DROP` script. Seeding
has no automatic production rollback because it upserts content—restore the
backup or archive the specifically reviewed seeded rows.

## 10. Known pre-production checks

- Prove contributors cannot unpublish content through a direct REST update.
- Prove contributors cannot mutate normalized festival or executive child rows.
- Prove only editors/super admins can promote objects to `cms-public`.
- Confirm `site_settings` changes create an audit entry keyed by `key`.
- Verify the public Contact and Join rate limit from the deployed environment,
  and add a managed CAPTCHA if traffic or abuse levels require stronger bot
  resistance.
- Confirm backup/restore, admin recovery, media consent, and data-retention
  owners in writing.

See [docs/CMS_HANDOVER.md](docs/CMS_HANDOVER.md) for the operational handover
checklist.
