-- Forward repair for already deployed databases; does not recreate/change policies.
-- Baseline ACLs are also explicit for fresh installations after October 30, 2026.
begin;
-- Explicit Data API ACLs: table privileges permit operations; RLS restricts rows.
-- Scope revocations to this application's tables, never unrelated public tables.
revoke all on public.profiles, public.festivals, public.festival_segments, public.festival_schedule_items, public.festival_results, public.organizations, public.festival_organizations, public.activities, public.achievements, public.magazines, public.executive_panels, public.executive_members, public.notifications, public.media_assets, public.contact_submissions, public.join_submissions, public.site_settings, public.audit_logs from public, anon, authenticated, service_role;
grant usage on schema public to anon, authenticated, service_role;

-- Public content and normalized children remain filtered by publication policies.
grant select on public.festivals, public.activities, public.achievements, public.magazines, public.executive_panels, public.notifications, public.festival_segments, public.festival_schedule_items, public.festival_results, public.organizations, public.festival_organizations, public.executive_members, public.media_assets to anon;
grant select, insert, update, delete on public.festivals, public.activities, public.achievements, public.magazines, public.executive_panels, public.notifications, public.festival_segments, public.festival_schedule_items, public.festival_results, public.organizations, public.festival_organizations, public.executive_members, public.media_assets to authenticated;

-- Profiles are created by the Auth trigger; only super admins may edit these fields.
grant select on public.profiles to authenticated;
grant update (display_name, role, is_active) on public.profiles to authenticated;
-- Reviewers can read and triage; only super admins can delete (enforced by RLS).
grant select, delete on public.contact_submissions, public.join_submissions to authenticated;
grant update (status, admin_notes) on public.contact_submissions, public.join_submissions to authenticated;
grant select, insert, update, delete on public.site_settings to authenticated;
-- Audit entries are append-only to API clients and written by trusted code/triggers.
grant select on public.audit_logs to authenticated;

-- Trusted bootstrap/profile upsert, initial content importer and removal audit entry.
-- Normal CMS CRUD uses the signed-in user's authenticated JWT, not service_role.
grant select, insert, update on public.profiles to service_role;
grant select, insert, update on public.festivals, public.activities, public.achievements, public.magazines, public.executive_panels to service_role;
grant insert on public.audit_logs to service_role;
-- The only identity/serial sequence in the project. Trigger inserts run as owner;
-- authenticated/anon never insert audit rows and require no sequence access.
revoke all on sequence public.audit_logs_id_seq from public, anon, authenticated, service_role;
grant usage on sequence public.audit_logs_id_seq to service_role;

-- Added after the baseline: only public_contact is visible under migration 004 RLS.
grant select on public.site_settings to anon;
-- Public forms use RPCs; never reopen direct INSERT or private submission reads.
revoke all on public.submission_rate_limits, public.science_club_applications
  from public, anon, authenticated, service_role;
grant select, delete on public.science_club_applications to authenticated;
grant update (status, admin_notes) on public.science_club_applications to authenticated;
-- All existing function EXECUTE grants and RLS policies are deliberately unchanged.
-- Contact/join RPCs: anon + authenticated. Membership RPC: service_role only.
commit;
