-- Run ONLY on an isolated local/test database after migrations 001–008.
-- psql -v ON_ERROR_STOP=1 -f supabase/tests/data_api_permissions.sql LOCAL_DB_URL
-- All fixtures and mutations are rolled back, even on assertion failure.
begin;

-- ACL matrix covers every application table, including negative operations.
do $$
declare
  item record;
  privilege text;
  expected boolean;
  actual boolean;
begin
  for item in select * from (values
    ('profiles', '', 'SU', 'SIU'),
    ('festivals', 'S', 'SIUD', 'SIU'),
    ('festival_segments', 'S', 'SIUD', ''),
    ('festival_schedule_items', 'S', 'SIUD', ''),
    ('festival_results', 'S', 'SIUD', ''),
    ('organizations', 'S', 'SIUD', ''),
    ('festival_organizations', 'S', 'SIUD', ''),
    ('activities', 'S', 'SIUD', 'SIU'),
    ('achievements', 'S', 'SIUD', 'SIU'),
    ('magazines', 'S', 'SIUD', 'SIU'),
    ('executive_panels', 'S', 'SIUD', 'SIU'),
    ('executive_members', 'S', 'SIUD', ''),
    ('notifications', 'S', 'SIUD', ''),
    ('media_assets', 'S', 'SIUD', ''),
    ('contact_submissions', '', 'SUD', ''),
    ('join_submissions', '', 'SUD', ''),
    ('site_settings', 'S', 'SIUD', ''),
    ('audit_logs', '', 'S', 'I'),
    ('submission_rate_limits', '', '', ''),
    ('science_club_applications', '', 'SUD', '')
  ) as matrix(table_name, anon_ops, authenticated_ops, service_ops) loop
    if not (select relrowsecurity from pg_class where oid = ('public.' || item.table_name)::regclass) then
      raise exception 'RLS disabled: %', item.table_name;
    end if;
    foreach privilege in array array['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'] loop
      expected := strpos(item.anon_ops, left(privilege, 1)) > 0 and privilege in ('SELECT','INSERT','UPDATE','DELETE');
      actual := has_table_privilege('anon', 'public.' || item.table_name, privilege);
      if privilege in ('SELECT','INSERT','UPDATE','REFERENCES') then
        actual := actual or has_any_column_privilege('anon', 'public.' || item.table_name, privilege);
      end if;
      if actual <> expected then raise exception 'anon % mismatch: %', privilege, item.table_name; end if;
      expected := strpos(item.authenticated_ops, left(privilege, 1)) > 0 and privilege in ('SELECT','INSERT','UPDATE','DELETE');
      actual := has_table_privilege('authenticated', 'public.' || item.table_name, privilege);
      if privilege in ('SELECT','INSERT','UPDATE','REFERENCES') then
        actual := actual or has_any_column_privilege('authenticated', 'public.' || item.table_name, privilege);
      end if;
      if actual <> expected then raise exception 'authenticated % mismatch: %', privilege, item.table_name; end if;
      expected := strpos(item.service_ops, left(privilege, 1)) > 0 and privilege in ('SELECT','INSERT','UPDATE','DELETE');
      actual := has_table_privilege('service_role', 'public.' || item.table_name, privilege);
      if actual <> expected then raise exception 'service_role % mismatch: %', privilege, item.table_name; end if;
    end loop;
  end loop;
  if has_column_privilege('authenticated', 'public.profiles', 'email', 'UPDATE')
    or has_column_privilege('authenticated', 'public.contact_submissions', 'message', 'UPDATE')
    or has_column_privilege('authenticated', 'public.science_club_applications', 'reviewed_by', 'UPDATE') then
    raise exception 'Protected column is writable';
  end if;
  if has_sequence_privilege('anon', 'public.audit_logs_id_seq', 'USAGE')
    or has_sequence_privilege('authenticated', 'public.audit_logs_id_seq', 'USAGE')
    or not has_sequence_privilege('service_role', 'public.audit_logs_id_seq', 'USAGE') then
    raise exception 'Unexpected identity sequence access';
  end if;
  if not has_function_privilege('anon', 'public.submit_public_contact(text,text,text,text,text)', 'EXECUTE')
    or not has_function_privilege('authenticated', 'public.submit_public_join(text,text,text,text,text[],text,text)', 'EXECUTE')
    or has_function_privilege('anon', 'public.consume_submission_rate_limit(text,text)', 'EXECUTE')
    or has_function_privilege('authenticated', 'public.submit_science_club_application(jsonb,text,text)', 'EXECUTE')
    or not has_function_privilege('service_role', 'public.submit_science_club_application(jsonb,text,text)', 'EXECUTE') then
    raise exception 'Unexpected submission RPC access';
  end if;
end $$;

-- Fixtures are test-only Auth users, not real administrator accounts.
insert into auth.users (id, email) values
  ('00000000-0000-4000-8000-000000000001', 'contributor@permissions.test'),
  ('00000000-0000-4000-8000-000000000002', 'editor@permissions.test'),
  ('00000000-0000-4000-8000-000000000003', 'super@permissions.test');
update public.profiles set is_active = true, role = case email
  when 'contributor@permissions.test' then 'contributor'::public.app_role
  when 'editor@permissions.test' then 'editor'::public.app_role
  else 'super_admin'::public.app_role end
where email like '%@permissions.test';

insert into public.festivals (id,title,slug,status,published_at) values
  ('00000000-0000-4000-8000-000000000011','Permission published','permission-published','published',now()-interval '1 day'),
  ('00000000-0000-4000-8000-000000000012','Permission draft','permission-draft','draft',null),
  ('00000000-0000-4000-8000-000000000013','Permission future','permission-future','published',now()+interval '1 day');
insert into public.festival_segments (festival_id,slug,title)
  select id,'permission-segment','Permission segment' from public.festivals where slug like 'permission-%';
insert into public.site_settings (key,value) values ('permission_private','{}');

set local role anon;
do $$ begin
  if (select count(*) from public.festivals where slug like 'permission-%') <> 1
    or (select count(*) from public.festival_segments where slug='permission-segment') <> 1
    or exists(select 1 from public.site_settings where key='permission_private') then
    raise exception 'Unpublished/private data leaked';
  end if;
  perform public.submit_public_contact('Test Sender','sender@permissions.test','Test subject','A sufficiently long test message', repeat('a',64));
  perform public.submit_public_join('Test Applicant','applicant@permissions.test','','Class 10',array['Science'],'A sufficiently long motivation',repeat('b',64));
  begin
    perform * from public.contact_submissions;
    raise exception 'Anonymous submission read allowed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001';
set local role authenticated;
do $$ declare affected integer; begin
  insert into public.festivals(title,slug) values ('Contributor draft','permission-contributor');
  begin
    insert into public.festivals(title,slug,status,published_at) values ('Bad publish','permission-bad','published',now());
    raise exception 'Contributor published a row';
  exception when insufficient_privilege then null; end;
  update public.festivals set summary='not allowed' where slug='permission-published';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Contributor edited published content'; end if;
  delete from public.festivals where slug='permission-contributor';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Contributor deleted content'; end if;
  begin
    insert into public.festival_segments(festival_id,slug,title) values ('00000000-0000-4000-8000-000000000011','bad-child','Bad child');
    raise exception 'Contributor wrote normalized child';
  exception when insufficient_privilege then null; end;
  if exists(select 1 from public.contact_submissions) or exists(select 1 from public.audit_logs) then
    raise exception 'Contributor read private submissions/audit';
  end if;
  update public.profiles set role='super_admin' where id=auth.uid();
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Contributor escalated role'; end if;
end $$;
reset role;

set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000002';
set local role authenticated;
do $$ declare affected integer; begin
  update public.festivals set status='published',published_at=now() where slug='permission-contributor';
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Editor publication failed'; end if;
  update public.contact_submissions set status='in_review',admin_notes='Reviewed' where email='sender@permissions.test';
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Editor review failed'; end if;
  delete from public.festivals where slug='permission-contributor';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Editor deleted root content'; end if;
  update public.profiles set is_active=false where id='00000000-0000-4000-8000-000000000003';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Editor changed administrator'; end if;
  if not exists(select 1 from public.audit_logs where entity_type='festivals') then raise exception 'Audit trigger/read failed'; end if;
end $$;
reset role;

set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000003';
set local role authenticated;
do $$ declare affected integer; begin
  delete from public.festivals where slug='permission-contributor';
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Super admin deletion failed'; end if;
  update public.profiles set display_name='Renamed' where id='00000000-0000-4000-8000-000000000002';
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Super admin profile update failed'; end if;
end $$;
reset role;

-- Service role needs RPC EXECUTE, not direct membership/rate-limit table access.
set local role service_role;
-- The seed importer needs INSERT/UPDATE and SELECT for upsert(...).select(...).
insert into public.festivals(title,slug) values ('Service seed','permission-service-seed')
  on conflict (slug) do update set title=excluded.title;
select id,slug from public.festivals where slug='permission-service-seed';
-- Bootstrap checks and upserts the Auth-created profile; it never deletes it.
insert into public.profiles(id,email,display_name,role,is_active)
  values ('00000000-0000-4000-8000-000000000003','super@permissions.test','Bootstrap test','super_admin',true)
  on conflict (id) do update set display_name=excluded.display_name;
select public.submit_science_club_application(
  '{"full_name":"Test Applicant","college_id":"TEST-1","academic_class":"10","section":"A","shift":"Day","areas_of_interest":["General Science"],"reason_for_joining":"A sufficiently long motivation","acknowledgement":"on"}'::jsonb,
  repeat('c',64),repeat('d',64)
);
insert into public.audit_logs(action,entity_type) values ('permission_test','profiles');
reset role;
rollback;
