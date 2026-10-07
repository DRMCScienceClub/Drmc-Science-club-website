-- Apply after migrations 001–005. No existing submissions are changed.
begin;
create table public.science_club_applications (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique default ('SC-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16))),
  submission_key text not null unique check (submission_key ~ '^[a-f0-9]{64}$'),
  full_name text not null check (char_length(full_name) between 2 and 120),
  college_id text not null check (char_length(college_id) between 1 and 40),
  academic_class text not null check (academic_class in ('1','2','3','4','5','6','7','8','9','10','11','12')),
  section text not null check (char_length(section) between 1 and 20),
  shift text not null check (shift in ('Morning','Day')),
  email text not null default '' check (char_length(email) <= 254 and (email = '' or email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')),
  phone text not null default '' check (char_length(phone) <= 30 and (phone = '' or (phone ~ '^\+?[0-9 ()-]+$' and char_length(regexp_replace(phone, '[^0-9]', '', 'g')) between 7 and 15))),
  areas_of_interest text[] not null check (cardinality(areas_of_interest) between 1 and 10 and array_position(areas_of_interest, null) is null and areas_of_interest <@ array['General Science','Research','Robotics & Engineering','Programming & Technology','Mathematics & Problem Solving','Olympiads','Quizzing','Science Projects & Innovation','Event Organization','Other']),
  other_interest text not null default '' check (char_length(other_interest) <= 160),
  reason_for_joining text not null check (char_length(reason_for_joining) between 10 and 1000),
  previous_experience text not null default '' check (char_length(previous_experience) <= 1000),
  contribution_interest text not null default '' check (char_length(contribution_interest) <= 1000),
  acknowledgement boolean not null check (acknowledgement),
  status text not null default 'pending' check (status in ('pending','under_review','approved','rejected')),
  admin_notes text not null default '' check (char_length(admin_notes) <= 5000),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_by_name text,
  check (not ('Other' = any(areas_of_interest)) or char_length(trim(other_interest)) > 0)
);
create index science_club_applications_submitted_idx on public.science_club_applications (submitted_at desc, id);
create index science_club_applications_status_idx on public.science_club_applications (status, submitted_at desc);
alter table public.science_club_applications enable row level security;
revoke all on public.science_club_applications from anon, authenticated;
grant select on public.science_club_applications to authenticated;
grant update (status, admin_notes) on public.science_club_applications to authenticated;
grant all on public.science_club_applications to service_role;
create policy applications_reviewer_read on public.science_club_applications for select to authenticated
  using (public.current_admin_role() in ('super_admin','editor'));
create policy applications_reviewer_update on public.science_club_applications for update to authenticated
  using (public.current_admin_role() in ('super_admin','editor'))
  with check (public.current_admin_role() in ('super_admin','editor'));

-- Review attribution cannot be forged by browser clients or supplied in a form.
create function public.stamp_application_review() returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
  -- Preserve historical attribution when an administrator account is removed.
  if auth.uid() is null then return new; end if;
  new.reviewed_by := auth.uid();
  select display_name into new.reviewed_by_name from public.profiles where id = auth.uid();
  new.reviewed_at := now();
  return new;
end;
$$;
create trigger stamp_application_review before update on public.science_club_applications
  for each row execute function public.stamp_application_review();

-- Only the validated Next.js server action may call this entry point.
-- Anonymous and authenticated API clients cannot call it or insert rows directly.
create function public.submit_science_club_application(p_application jsonb, p_rate_key text, p_submission_key text)
returns text language plpgsql security definer set search_path = public, pg_temp as $$
declare
  reference text;
begin
  if p_application is null or jsonb_typeof(p_application) <> 'object'
    or p_submission_key is null or p_submission_key !~ '^[a-f0-9]{64}$'
    or p_rate_key is null or p_rate_key !~ '^[a-f0-9]{64}$'
    or (p_application->>'acknowledgement') is distinct from 'on' then
    raise exception 'invalid_submission_request';
  end if;
  -- Serialize identical submissions so double clicks/retries produce one row.
  perform pg_advisory_xact_lock(hashtextextended(p_submission_key, 0));
  select reference_number into reference from public.science_club_applications where submission_key = p_submission_key;
  if reference is not null then return reference; end if;
  perform public.consume_submission_rate_limit('join', p_rate_key);
  insert into public.science_club_applications (
    submission_key, full_name, college_id, academic_class, section, shift,
    email, phone, areas_of_interest, other_interest, reason_for_joining,
    previous_experience, contribution_interest, acknowledgement
  ) values (
    p_submission_key, trim(p_application->>'full_name'), trim(p_application->>'college_id'),
    p_application->>'academic_class', trim(p_application->>'section'), p_application->>'shift',
    trim(coalesce(p_application->>'email','')), trim(coalesce(p_application->>'phone','')),
    array(select jsonb_array_elements_text(p_application->'areas_of_interest')),
    trim(coalesce(p_application->>'other_interest','')), trim(p_application->>'reason_for_joining'),
    trim(coalesce(p_application->>'previous_experience','')), trim(coalesce(p_application->>'contribution_interest','')), true
  ) returning reference_number into reference;
  return reference;
end;
$$;
revoke all on function public.submit_science_club_application(jsonb,text,text) from public, anon, authenticated;
grant execute on function public.submit_science_club_application(jsonb,text,text) to service_role;
revoke all on function public.stamp_application_review() from public, anon, authenticated;
commit;
