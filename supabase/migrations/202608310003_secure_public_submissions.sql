-- Secure public Contact and Join submission entry points.
-- Direct anonymous table inserts are replaced by validated, rate-limited RPCs.

create table if not exists public.submission_rate_limits (
  submission_kind text not null check (submission_kind in ('contact', 'join')),
  rate_key text not null check (char_length(rate_key) = 64),
  window_started_at timestamptz not null default now(),
  request_count integer not null default 1 check (request_count > 0),
  primary key (submission_kind, rate_key)
);

alter table public.submission_rate_limits enable row level security;
revoke all on public.submission_rate_limits from anon, authenticated;

drop policy if exists "contact_public_insert" on public.contact_submissions;
drop policy if exists "join_public_insert" on public.join_submissions;
revoke insert on public.contact_submissions, public.join_submissions from anon, authenticated;

create or replace function public.consume_submission_rate_limit(
  p_kind text,
  p_rate_key text
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_count integer;
begin
  if p_kind not in ('contact', 'join') or p_rate_key !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid_submission_request';
  end if;

  insert into public.submission_rate_limits (
    submission_kind,
    rate_key,
    window_started_at,
    request_count
  ) values (p_kind, p_rate_key, clock_timestamp(), 1)
  on conflict (submission_kind, rate_key) do update
  set
    window_started_at = case
      when public.submission_rate_limits.window_started_at < clock_timestamp() - interval '1 hour'
        then clock_timestamp()
      else public.submission_rate_limits.window_started_at
    end,
    request_count = case
      when public.submission_rate_limits.window_started_at < clock_timestamp() - interval '1 hour'
        then 1
      else public.submission_rate_limits.request_count + 1
    end
  returning request_count into current_count;

  if current_count > 5 then
    raise exception 'submission_rate_limit_exceeded';
  end if;
end;
$$;

create or replace function public.submit_public_contact(
  p_name text,
  p_email text,
  p_subject text,
  p_message text,
  p_rate_key text
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  new_id uuid;
begin
  if char_length(trim(p_name)) not between 2 and 120
    or char_length(trim(p_email)) not between 3 and 254
    or position('@' in p_email) < 2
    or char_length(trim(p_subject)) not between 2 and 180
    or char_length(trim(p_message)) not between 10 and 5000 then
    raise exception 'invalid_submission_request';
  end if;

  perform public.consume_submission_rate_limit('contact', p_rate_key);

  insert into public.contact_submissions (name, email, subject, message, source)
  values (trim(p_name), lower(trim(p_email)), trim(p_subject), trim(p_message), 'website-form')
  returning id into new_id;
  return new_id;
end;
$$;

create or replace function public.submit_public_join(
  p_name text,
  p_email text,
  p_phone text,
  p_academic_class text,
  p_interests text[],
  p_motivation text,
  p_rate_key text
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  new_id uuid;
begin
  if char_length(trim(p_name)) not between 2 and 120
    or char_length(trim(p_email)) not between 3 and 254
    or position('@' in p_email) < 2
    or char_length(trim(coalesce(p_phone, ''))) > 40
    or char_length(trim(p_academic_class)) not between 1 and 40
    or coalesce(cardinality(p_interests), 0) not between 1 and 10
    or char_length(trim(p_motivation)) not between 10 and 5000 then
    raise exception 'invalid_submission_request';
  end if;

  perform public.consume_submission_rate_limit('join', p_rate_key);

  insert into public.join_submissions (
    name, email, phone, academic_class, interests, motivation, consent, source
  ) values (
    trim(p_name), lower(trim(p_email)), trim(coalesce(p_phone, '')),
    trim(p_academic_class), p_interests, trim(p_motivation), true, 'website-form'
  )
  returning id into new_id;
  return new_id;
end;
$$;

revoke all on function public.consume_submission_rate_limit(text, text) from public, anon, authenticated;
revoke all on function public.submit_public_contact(text, text, text, text, text) from public;
revoke all on function public.submit_public_join(text, text, text, text, text[], text, text) from public;
grant execute on function public.submit_public_contact(text, text, text, text, text) to anon, authenticated;
grant execute on function public.submit_public_join(text, text, text, text, text[], text, text) to anon, authenticated;

comment on table public.submission_rate_limits is
  'Stores pseudonymous one-hour counters for public form abuse protection; never stores raw IP addresses.';
