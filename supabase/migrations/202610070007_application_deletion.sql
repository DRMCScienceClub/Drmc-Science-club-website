-- Apply after 202610070006_science_club_applications.sql.
-- Only active super administrators may delete membership applications.
begin;

grant delete on public.science_club_applications to authenticated;
create policy applications_super_admin_delete on public.science_club_applications
  for delete to authenticated
  using (public.current_admin_role() = 'super_admin');

commit;
