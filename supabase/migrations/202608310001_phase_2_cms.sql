-- DRMC Science Club — Phase 2 CMS foundation
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL editor.

create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('super_admin', 'editor', 'contributor');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.publication_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.submission_status as enum ('new', 'in_review', 'resolved', 'spam', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.notification_tone as enum ('info', 'announcement', 'urgent');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.festival_organization_kind as enum ('sponsor', 'partner');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default '',
  role public.app_role not null default 'contributor',
  is_active boolean not null default false,
  avatar_url text,
  last_signed_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_email_lower_idx on public.profiles (lower(email));

create table if not exists public.festivals (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  summary text not null default '',
  edition text not null default '',
  festival_year integer check (festival_year between 1950 and 2200),
  starts_at timestamptz,
  ends_at timestamptz,
  venue text not null default '',
  registration_status text not null default 'not-required',
  status public.publication_status not null default 'draft',
  is_featured boolean not null default false,
  cover_image_url text,
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint festivals_dates_valid check (ends_at is null or starts_at is null or ends_at >= starts_at),
  constraint festivals_publication_valid check (status <> 'published' or published_at is not null)
);

create table if not exists public.festival_segments (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  slug text not null,
  title text not null,
  category text not null default '',
  summary text not null default '',
  eligibility text not null default '',
  team_size text not null default '',
  fee text not null default '',
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (festival_id, slug)
);

create table if not exists public.festival_schedule_items (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  segment_id uuid references public.festival_segments(id) on delete set null,
  schedule_date date not null,
  time_label text not null,
  title text not null,
  description text not null default '',
  venue text not null default '',
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.festival_results (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  segment_id uuid references public.festival_segments(id) on delete set null,
  position text not null,
  recipient text not null,
  institution text not null default '',
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  website_url text,
  logo_url text,
  logo_alt text not null default '',
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.festival_organizations (
  festival_id uuid not null references public.festivals(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  kind public.festival_organization_kind not null,
  role_label text not null,
  sort_order integer not null default 0 check (sort_order >= 0),
  source_note text,
  created_at timestamptz not null default now(),
  primary key (festival_id, organization_id, kind)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  summary text not null default '',
  category text not null default 'Workshop',
  event_status text not null default 'completed',
  starts_at timestamptz,
  ends_at timestamptz,
  location text not null default '',
  status public.publication_status not null default 'draft',
  is_featured boolean not null default false,
  cover_image_url text,
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activities_dates_valid check (ends_at is null or starts_at is null or ends_at >= starts_at),
  constraint activities_publication_valid check (status <> 'published' or published_at is not null)
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  summary text not null default '',
  recipients text[] not null default '{}',
  competition text not null default '',
  achievement_year integer check (achievement_year between 1950 and 2200),
  status public.publication_status not null default 'draft',
  is_featured boolean not null default false,
  cover_image_url text,
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint achievements_publication_valid check (status <> 'published' or published_at is not null)
);

create table if not exists public.magazines (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  summary text not null default '',
  publication_year integer not null unique check (publication_year between 1950 and 2200),
  volume text not null default '',
  pdf_url text,
  reader_url text,
  status public.publication_status not null default 'draft',
  is_featured boolean not null default false,
  cover_image_url text,
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint magazines_publication_valid check (status <> 'published' or published_at is not null)
);

create table if not exists public.executive_panels (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  summary text not null default '',
  session_label text not null,
  starts_year integer not null check (starts_year between 1950 and 2200),
  ends_year integer not null check (ends_year between starts_year and 2200),
  is_current boolean not null default false,
  status public.publication_status not null default 'draft',
  is_featured boolean not null default false,
  cover_image_url text,
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint executive_panels_publication_valid check (status <> 'published' or published_at is not null)
);

create unique index if not exists executive_panels_current_idx
  on public.executive_panels (is_current) where is_current = true and status <> 'archived';

create table if not exists public.executive_members (
  id uuid primary key default gen_random_uuid(),
  panel_id uuid not null references public.executive_panels(id) on delete cascade,
  name text not null,
  designation text not null,
  department text not null default '',
  academic_class text,
  image_url text,
  image_alt text not null default '',
  member_group text not null default 'department',
  sort_order integer not null default 0 check (sort_order >= 0),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  message text not null,
  tone public.notification_tone not null default 'info',
  link_label text,
  link_url text,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  status public.publication_status not null default 'draft',
  is_featured boolean not null default false,
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notifications_dates_valid check (ends_at is null or ends_at >= starts_at),
  constraint notifications_publication_valid check (status <> 'published' or published_at is not null)
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null check (bucket in ('cms-staging', 'cms-public')),
  object_path text not null,
  original_name text not null,
  mime_type text not null,
  byte_size bigint not null check (byte_size > 0 and byte_size <= 26214400),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  alt_text text not null default '',
  caption text not null default '',
  credit text not null default '',
  status public.publication_status not null default 'draft',
  public_url text,
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, object_path)
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 3 and 254),
  subject text not null check (char_length(subject) between 2 and 180),
  message text not null check (char_length(message) between 10 and 5000),
  status public.submission_status not null default 'new',
  admin_notes text not null default '',
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.join_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null default '',
  academic_class text not null,
  interests text[] not null default '{}',
  motivation text not null check (char_length(motivation) between 10 and 5000),
  consent boolean not null check (consent = true),
  status public.submission_status not null default 'new',
  admin_notes text not null default '',
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  description text not null default '',
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  action text not null,
  entity_type text not null,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.current_admin_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles
  where id = (select auth.uid()) and is_active = true
  limit 1
$$;

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.current_admin_role() is not null
$$;

create or replace function public.write_audit_log()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  actor_email_value text;
  row_data jsonb;
begin
  select email into actor_email_value from auth.users where id = (select auth.uid());
  row_data := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  insert into public.audit_logs (actor_id, actor_email, action, entity_type, entity_id, before_data, after_data)
  values (
    (select auth.uid()), actor_email_value, lower(tg_op), tg_table_name,
    coalesce(row_data ->> 'id', row_data ->> 'key'),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
  );
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','festivals','festival_segments','festival_schedule_items','festival_results',
    'organizations','activities','achievements','magazines','executive_panels',
    'executive_members','notifications','media_assets','contact_submissions',
    'join_submissions','site_settings'
  ] loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute procedure public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

do $$
declare table_name text;
begin
  foreach table_name in array array['festivals','activities','achievements','magazines','executive_panels','notifications','media_assets','contact_submissions','join_submissions','site_settings'] loop
    execute format('drop trigger if exists audit_%I_changes on public.%I', table_name, table_name);
    execute format('create trigger audit_%I_changes after insert or update or delete on public.%I for each row execute procedure public.write_audit_log()', table_name, table_name);
  end loop;
end $$;

-- Row Level Security is mandatory for every exposed table.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','festivals','festival_segments','festival_schedule_items','festival_results',
    'organizations','festival_organizations','activities','achievements','magazines',
    'executive_panels','executive_members','notifications','media_assets',
    'contact_submissions','join_submissions','site_settings','audit_logs'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;

revoke all on all tables in schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.festivals, public.festival_segments, public.festival_schedule_items,
  public.festival_results, public.organizations, public.festival_organizations,
  public.activities, public.achievements, public.magazines, public.executive_panels,
  public.executive_members, public.notifications, public.media_assets to anon, authenticated;
grant insert on public.contact_submissions, public.join_submissions to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- Profiles: users can see themselves; super administrators manage the team.
create policy "profiles_select_self_or_admin" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.current_admin_role() = 'super_admin');
create policy "profiles_update_super_admin" on public.profiles for update to authenticated
  using (public.current_admin_role() = 'super_admin')
  with check (public.current_admin_role() = 'super_admin');

-- Root content policies. Contributors are draft-only; editors and super admins publish.
do $$
declare table_name text;
begin
  foreach table_name in array array['festivals','activities','achievements','magazines','executive_panels','notifications'] loop
    execute format('create policy %I on public.%I for select to anon using (status = ''published'' and published_at <= now())', table_name || '_public_read', table_name);
    execute format('create policy %I on public.%I for select to authenticated using (public.is_active_admin() or (status = ''published'' and published_at <= now()))', table_name || '_admin_read', table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_active_admin() and (public.current_admin_role() <> ''contributor'' or status = ''draft''))', table_name || '_admin_insert', table_name);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_active_admin() and (public.current_admin_role() <> ''contributor'' or status = ''draft'')) with check (public.is_active_admin() and (public.current_admin_role() <> ''contributor'' or status = ''draft''))', table_name || '_admin_update', table_name);
    execute format('create policy %I on public.%I for delete to authenticated using (public.current_admin_role() = ''super_admin'')', table_name || '_super_admin_delete', table_name);
  end loop;
end $$;

-- Child rows are public only when their owning festival/panel is public.
create policy "festival_segments_public_read" on public.festival_segments for select to anon using (
  exists (select 1 from public.festivals f where f.id = festival_id and f.status = 'published' and f.published_at <= now())
);
create policy "festival_schedule_public_read" on public.festival_schedule_items for select to anon using (
  exists (select 1 from public.festivals f where f.id = festival_id and f.status = 'published' and f.published_at <= now())
);
create policy "festival_results_public_read" on public.festival_results for select to anon using (
  exists (select 1 from public.festivals f where f.id = festival_id and f.status = 'published' and f.published_at <= now())
);
create policy "festival_orgs_public_read" on public.festival_organizations for select to anon using (
  exists (select 1 from public.festivals f where f.id = festival_id and f.status = 'published' and f.published_at <= now())
);
create policy "organizations_public_read" on public.organizations for select to anon using (
  exists (select 1 from public.festival_organizations fo join public.festivals f on f.id = fo.festival_id
    where fo.organization_id = organizations.id and f.status = 'published' and f.published_at <= now())
);
create policy "executive_members_public_read" on public.executive_members for select to anon using (
  exists (select 1 from public.executive_panels p where p.id = panel_id and p.status = 'published' and p.published_at <= now())
);

do $$
declare table_name text;
begin
  foreach table_name in array array['festival_segments','festival_schedule_items','festival_results','organizations','festival_organizations','executive_members'] loop
    execute format('create policy %I on public.%I for select to authenticated using (public.is_active_admin())', table_name || '_admin_read', table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.current_admin_role() in (''super_admin'', ''editor''))', table_name || '_admin_insert', table_name);
    execute format('create policy %I on public.%I for update to authenticated using (public.current_admin_role() in (''super_admin'', ''editor'')) with check (public.current_admin_role() in (''super_admin'', ''editor''))', table_name || '_admin_update', table_name);
    execute format('create policy %I on public.%I for delete to authenticated using (public.current_admin_role() in (''super_admin'', ''editor''))', table_name || '_admin_delete', table_name);
  end loop;
end $$;

create policy "media_public_metadata" on public.media_assets for select to anon
  using (status = 'published' and bucket = 'cms-public');
create policy "media_admin_read" on public.media_assets for select to authenticated using (public.is_active_admin());
create policy "media_admin_insert" on public.media_assets for insert to authenticated
  with check (public.is_active_admin() and uploaded_by = (select auth.uid()));
create policy "media_admin_update" on public.media_assets for update to authenticated
  using (public.is_active_admin()) with check (public.is_active_admin());
create policy "media_super_admin_delete" on public.media_assets for delete to authenticated
  using (public.current_admin_role() = 'super_admin');

create policy "contact_public_insert" on public.contact_submissions for insert to anon, authenticated
  with check (status = 'new' and admin_notes = '');
create policy "join_public_insert" on public.join_submissions for insert to anon, authenticated
  with check (status = 'new' and admin_notes = '' and consent = true);

do $$
declare table_name text;
begin
  foreach table_name in array array['contact_submissions','join_submissions'] loop
    execute format('create policy %I on public.%I for select to authenticated using (public.current_admin_role() in (''super_admin'', ''editor''))', table_name || '_admin_read', table_name);
    execute format('create policy %I on public.%I for update to authenticated using (public.current_admin_role() in (''super_admin'', ''editor'')) with check (public.current_admin_role() in (''super_admin'', ''editor''))', table_name || '_admin_update', table_name);
    execute format('create policy %I on public.%I for delete to authenticated using (public.current_admin_role() = ''super_admin'')', table_name || '_super_admin_delete', table_name);
  end loop;
end $$;

create policy "settings_admin_read" on public.site_settings for select to authenticated using (public.is_active_admin());
create policy "settings_editor_write" on public.site_settings for all to authenticated
  using (public.current_admin_role() in ('super_admin', 'editor'))
  with check (public.current_admin_role() in ('super_admin', 'editor'));
create policy "audit_admin_read" on public.audit_logs for select to authenticated
  using (public.current_admin_role() in ('super_admin', 'editor'));

-- Storage: private staging and publicly readable approved assets. Bucket limits are
-- enforced by Storage before object policies are evaluated.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('cms-staging', 'cms-staging', false, 26214400, array['image/jpeg','image/png','image/webp','image/avif','application/pdf']),
  ('cms-public', 'cms-public', true, 26214400, array['image/jpeg','image/png','image/webp','image/avif','application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "admins_read_staging" on storage.objects for select to authenticated
  using (bucket_id = 'cms-staging' and public.is_active_admin());
create policy "admins_upload_staging" on storage.objects for insert to authenticated
  with check (bucket_id = 'cms-staging' and public.is_active_admin() and owner_id = (select auth.uid()::text));
create policy "publishers_upload_public" on storage.objects for insert to authenticated
  with check (bucket_id = 'cms-public' and public.current_admin_role() in ('super_admin','editor') and owner_id = (select auth.uid()::text));
create policy "admins_update_own_cms" on storage.objects for update to authenticated
  using (bucket_id = 'cms-staging' and public.is_active_admin() and owner_id = (select auth.uid()::text))
  with check (bucket_id = 'cms-staging' and public.is_active_admin() and owner_id = (select auth.uid()::text));
create policy "super_admin_delete_cms" on storage.objects for delete to authenticated
  using (bucket_id in ('cms-staging','cms-public') and public.current_admin_role() = 'super_admin');

comment on table public.profiles is 'Supabase Auth profile and CMS authorization role. New users are inactive until approved.';
comment on column public.festivals.data is 'Complete public Festival view model used to preserve the Phase 1 presentation.';
comment on column public.activities.data is 'Complete public Activity view model used to preserve the Phase 1 presentation.';
comment on column public.achievements.data is 'Complete public Achievement view model used to preserve the Phase 1 presentation.';
comment on column public.magazines.data is 'Complete public MagazineIssue view model used to preserve the Phase 1 presentation.';
comment on column public.executive_panels.data is 'Complete public ExecutivePanel view model used to preserve the Phase 1 presentation.';
