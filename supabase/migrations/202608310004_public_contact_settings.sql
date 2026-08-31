-- Publicly readable contact configuration managed by editors.
-- Only the `public_contact` key is exposed to anonymous visitors.

insert into public.site_settings (key, value, description)
values (
  'public_contact',
  jsonb_build_object(
    'institution', 'Dhaka Residential Model College',
    'clubName', 'DRMC Science Club',
    'addressLines', jsonb_build_array(
      'Academic Building 3, Dhaka Residential Model College',
      'Mirpur Road, Mohammadpur',
      'Dhaka 1207, Bangladesh'
    ),
    'email', 'scienceclub@drmc.edu.bd',
    'phone', '+880 2 5815 3780',
    'officeHours', 'Sunday–Thursday, 10:00–16:00 (during college terms)',
    'mapUrl', 'https://maps.google.com/?q=Dhaka+Residential+Model+College',
    'facebookUrl', 'https://www.facebook.com/DRMCScienceClub',
    'facebookHandle', '@DRMCScienceClub',
    'instagramUrl', 'https://www.instagram.com/drmcscienceclub/',
    'instagramHandle', '@drmcscienceclub'
  ),
  'Public contact, location, office hours, map, and social links.'
)
on conflict (key) do nothing;

grant select on public.site_settings to anon;

drop policy if exists "settings_public_contact_read" on public.site_settings;
create policy "settings_public_contact_read"
on public.site_settings
for select
to anon
using (key = 'public_contact');
