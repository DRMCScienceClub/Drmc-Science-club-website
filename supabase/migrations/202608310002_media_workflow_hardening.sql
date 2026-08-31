-- Harden the browser media workflow after the baseline CMS migration.

drop policy if exists "media_admin_insert" on public.media_assets;
create policy "media_admin_insert" on public.media_assets for insert to authenticated
  with check (
    uploaded_by = (select auth.uid())
    and (
      public.current_admin_role() in ('super_admin', 'editor')
      or (
        public.current_admin_role() = 'contributor'
        and bucket = 'cms-staging'
        and status = 'draft'
        and public_url is null
      )
    )
  );

drop policy if exists "media_admin_update" on public.media_assets;
create policy "media_admin_update" on public.media_assets for update to authenticated
  using (
    public.current_admin_role() in ('super_admin', 'editor')
    or (
      public.current_admin_role() = 'contributor'
      and uploaded_by = (select auth.uid())
      and bucket = 'cms-staging'
      and status = 'draft'
    )
  )
  with check (
    public.current_admin_role() in ('super_admin', 'editor')
    or (
      public.current_admin_role() = 'contributor'
      and uploaded_by = (select auth.uid())
      and bucket = 'cms-staging'
      and status = 'draft'
      and public_url is null
    )
  );

drop policy if exists "admins_delete_staging_cms" on storage.objects;
create policy "admins_delete_staging_cms" on storage.objects for delete to authenticated
  using (
    bucket_id = 'cms-staging'
    and public.is_active_admin()
    and (
      owner_id = (select auth.uid()::text)
      or public.current_admin_role() in ('super_admin', 'editor')
    )
  );
