# CMS handover checklist

This checklist is for the outgoing and incoming authorised DRMC Science Club
website administrators. It does not replace college approval or the Supabase
security documentation.

## People and access

- Record the college-approved system owner and emergency recovery contact.
- Review every active `profiles` row and remove access that is no longer needed.
- Keep at least two accountable recovery contacts; avoid shared accounts.
- Give contributors the least privilege needed. Reserve `super_admin` for
  administrator management and recovery.
- Revoke sessions for departing administrators and rotate any secret they could
  access.
- Never enable public registration or reuse the initial bootstrap mechanism.

## Content

- Verify current executive names and exact official designations from the
  approved notice.
- Never publish phone numbers, college numbers, shifts, signatures, or inferred
  face-to-name mappings from committee notices.
- Review scheduled, draft, and archived records and identify their new owners.
- Preserve exact sponsor/partner role labels printed in supplied artwork.
- Check registrations, brochures, rulebooks, magazine files, and external links.
- Keep prototype or unverified records visibly marked until an authority
  approves them.

## Media and privacy

- Confirm consent and usage rights for student photographs, achievement artwork,
  sponsor logos, PDFs, and certificates.
- Keep unreviewed uploads in `cms-staging`; only approved assets belong in
  `cms-public`.
- Require useful alternative text for meaningful images and empty alt text only
  for decorative images.
- Remove orphaned staging uploads according to the approved retention policy.
- Treat contact and join submissions as private student data. Export or delete
  them only under the college's written retention policy.

## Operational verification

- Confirm the production domain, Supabase project, deployment project, and
  backup owner are institutionally controlled.
- Test a database restore and record the date and result.
- Test anonymous, contributor, editor, and super-admin permissions.
- Review audit logs for unexpected role, publication, deletion, or submission
  access changes.
- Verify Auth redirect URLs, email delivery, recovery, and—when adopted—MFA.
- Run lint, type checking, build, migration lint, broken-link, accessibility,
  and smoke tests before handing over production access.

The outgoing team should sign off the account list, unresolved content issues,
last successful backup/restore test, current deployment version, and named
incident contact. Passwords and service-role keys must be transferred only via
the institution's approved secret manager, never in this document.
