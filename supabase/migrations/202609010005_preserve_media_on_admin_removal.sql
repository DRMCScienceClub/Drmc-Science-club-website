-- Preserve CMS media metadata and Storage objects when an administrator's
-- Supabase Auth account is removed. Historical uploader attribution becomes
-- null while the asset, public URL, and editorial metadata remain intact.

alter table public.media_assets
  drop constraint if exists media_assets_uploaded_by_fkey;

alter table public.media_assets
  alter column uploaded_by drop not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'media_assets_uploaded_by_fkey'
      and conrelid = 'public.media_assets'::regclass
  ) then
    alter table public.media_assets
      add constraint media_assets_uploaded_by_fkey
      foreign key (uploaded_by)
      references auth.users(id)
      on delete set null;
  end if;
end
$$;

comment on column public.media_assets.uploaded_by is
  'Original uploader when the Auth account still exists; null after account removal so approved media is preserved.';
