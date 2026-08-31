# DRMC Science Club Website

The official website for **Dhaka Residential Model College Science Club (DRMCSC)**. The approved Phase 1 public experience combines the club's supplied artwork and official records with a responsive information architecture and reusable design system. Phase 2 adds the Supabase CMS foundation, protected administration workflow, content import tooling, and operational documentation without replacing that public design.

Public visitors never need an account. Administrator access is invitation-only; there is no public registration flow.

## Technology

- Next.js 16 with the App Router
- React 19 and TypeScript in strict mode
- Tailwind CSS 4
- Supabase Auth, PostgreSQL, Storage, and Row Level Security
- `@supabase/ssr` and `@supabase/supabase-js`
- ESLint with the Next.js configuration
- `next/image` for stable, responsive visual assets and a system-font stack for offline-safe builds
- Centralized, typed content records

## Phase 1 public baseline

The public baseline provides the full route architecture, centralized typed content, supplied archival media, responsive and accessible layouts, and honest missing-data states. Phase 2 migrates these view-facing contracts gradually rather than redesigning working pages.

- Complete responsive public route set for the home page, club information, activities, achievements, festivals, Aurora magazine archive, executive panels, contact, and membership guidance.
- Account-free public access and a private administrator surface.
- A teal-led institutional visual system with dark navy feature areas, restrained science-blue and gold accents, subtle scientific grids, clearer card borders, and softly graduated light surfaces.
- Reusable, provenance-aware festival, magazine, activity, achievement, and executive components backed by centralized TypeScript records.
- High-resolution supplied DRMC Science Club branding across the shared header/footer logo, home hero, browser favicon, Apple touch icon, and installable application icons.
- Progressive route, hero, menu, reveal, and parallax motion with keyboard, reduced-motion, and hydration-safety protections.
- Poster-backed festival history for the 8th–17th editions, six supplied activity programmes, 14 achievement announcements, a 15-volume Aurora archive model, and notice-verified 2024–25 and 2025–26 executive panels.

## Phase 2 CMS foundation

Phase 2 introduces a versioned Supabase schema for administrator profiles,
festivals, activities, achievements, magazines, executive panels,
notifications, media, private contact/join submissions, settings, and audit
records. Every exposed table has Row Level Security. Anonymous database clients
may read only published content; private submissions and administrator data are
restricted to authorised roles.

Public Contact and Join forms submit through server actions into dedicated
private tables. A honeypot, Zod and database validation, removal of direct
anonymous table inserts, and a pseudonymous database rate limit provide basic
abuse protection. Authorised editors and super administrators review the
records from `/admin/submissions`.

The migration also creates private `cms-staging` and public `cms-public`
Storage buckets. Unreviewed files belong in staging; only validated and approved
assets may be promoted to the public bucket. The admin Media Library validates
file signatures, records accessible descriptions and credits, shows upload
progress, and exposes published images to the festival sponsor/partner editor.

Operational entry points:

```bash
# Inspect the deterministic import without writing
npx tsx scripts/seed-supabase.ts

# Apply to local Supabase after configuring .env.local
node --env-file=.env.local --import tsx scripts/seed-supabase.ts --apply

# One-time only, with ALLOW_INITIAL_ADMIN_BOOTSTRAP=true
node --env-file=.env.local --import tsx scripts/bootstrap-admin.ts
```

Read [SUPABASE_SETUP.md](SUPABASE_SETUP.md) before applying a migration or
creating an administrator. Future executive teams should also follow
[the CMS handover checklist](docs/CMS_HANDOVER.md).

## Run locally

### Prerequisites

- Node.js 20.9 or newer
- npm (the repository includes `package-lock.json`)

### Setup

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Static fallback content can still render without Supabase values. Database-backed and administrator features require the project URL and anonymous key; trusted maintenance scripts additionally require the server-only service-role key. Never commit real keys or credentials.

### Quality checks

```bash
npm run lint -- --max-warnings=0
npx next typegen
npx tsc --noEmit --incremental false
npm run build
git diff --check
npm start
```

Run lint, route type generation, the standalone strict TypeScript check, the production build, and `git diff --check` before opening a pull request. Also run `npx supabase db lint` and migration/RLS tests whenever database files change. `npm start` serves the production build after `npm run build` succeeds.

## Public routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page with announcement, festival, activity, magazine, executive, achievement, social, and membership previews |
| `/about` | Club story, mission, values, and institutional context |
| `/activities` | Activity archive |
| `/activities/[slug]` | Individual activity details |
| `/achievements` | Poster-backed student and team distinctions in supplied publication order |
| `/festivals` | Latest verified science carnival and chronological festival archive |
| `/festivals/[slug]` | Festival overview, segments, schedule, results, partners, gallery, and documents |
| `/magazines` | Annual magazine archive |
| `/magazines/[year]` | Issue details with online-reading and PDF actions |
| `/executives` | Current and archived panels with per-session batch photography, role groups, moderator, advisers, and institutional leadership |
| `/contact` | Club contact information, location, and direct enquiry channels |
| `/join` | Public membership information and future intake pathway |
| `/admin/login` | Invitation-only administrator sign-in |
| `/admin` | Protected, role-aware content dashboard |

Unknown activity, festival, and magazine identifiers resolve to the site-wide 404 experience. Route-level loading and empty-state patterns keep asynchronous and content-free states intentional.

## Project structure

```text
src/
├── app/
│   ├── (public)/          # Public pages and dynamic detail routes
│   │   └── template.tsx   # Public route-transition boundary
│   ├── admin/             # Protected login, dashboard, and CMS routes
│   ├── globals.css        # Design tokens, base styles, and motion preferences
│   ├── layout.tsx         # Root metadata and document shell
│   └── not-found.tsx      # Site-wide 404 state
├── components/
│   ├── brand/             # Replaceable club mark and brand treatments
│   ├── features/          # Domain sections and cards
│   ├── layout/            # Header, navigation, announcement bar, and footer
│   └── ui/                # Reusable interface primitives
├── data/                  # Single source of truth for typed public content
└── types/                 # Shared domain and component types
public/                    # Supplied archive artwork and supporting visual assets
scripts/                   # Controlled content import and first-admin bootstrap
supabase/migrations/       # Versioned PostgreSQL, RLS, audit, and Storage setup
docs/                      # Operational handover material
```

Page files compose shared components and read through `src/lib/content`. That
repository queries published Supabase records when configured and uses
`src/data` only as an environment-safe local fallback; page files should not
carry duplicated festival, magazine, activity, achievement, or executive data.

## Visual system and motion

The light interface is built around a pale teal page canvas rather than flat white. Teal-tinted paper and slate tokens carry that treatment through headers, grid sections, cards, and calls to action, while dark navy sections provide institutional contrast. Gold remains a small editorial accent. Shared `surface-card` and `surface-border` treatments keep white and near-white information panels distinct from scientific-grid backgrounds without making every divider heavy.

Public routes are wrapped by a shared transition boundary and progressive motion controller. Hero entrances, scroll reveals, subtle parallax, and the responsive menu use CSS animation or the Web Animations API without changing React-owned server markup before hydration. Content therefore remains visible without JavaScript, keyboard focus settles animated content immediately, detached animations are cleaned up, and `prefers-reduced-motion` removes non-essential movement.

## Supplied and verified content assets

The shared `LogoMark` uses the newly supplied 4320-pixel transparent DRMC Science Club artwork, normalized without resizing or altering its visible pixels at `public/images/brand/drmc-science-club-logo.png`. It is statically imported so Next.js gives each revision a content-hashed URL, then delivered at the explicitly enabled 100-quality setting to avoid stale or visibly compressed brand artwork. The multi-size browser favicon and `/icon.png` are generated directly from that transparent source and retain a transparent canvas. The corresponding original high-resolution light-background source is retained byte-for-byte at `public/images/brand/drmc-science-club-logo.jpeg` and supplies the Apple touch icon and 192/512-pixel installable-app icons. The home hero uses a responsive editorial split—message and actions first on the left, prominent club mark on the right at desktop widths, and text before artwork on smaller screens. The real logo remains isolated behind reusable brand components so a later approved variant can be adopted without changing page layouts.

Ten supplied carnival posters are normalized under `public/images/festivals/archive/` and power poster-backed records for the 8th through 17th editions (2015–2026, with no invented entries for years absent from the supplied set). Festival records carry a provenance state. Poster-backed entries publish only details visible in the supplied artwork—edition, title, dates, theme, listed segments, and displayed sponsor or partner roles—while unavailable schedules, results, rules, venue records, and resources use explicit empty states. The 17th carnival is the latest verified edition and is archived as completed on 21–23 January 2026.

The supplied 2024–25 and 2025–26 executive-panel photographs are stored under `public/images/executives/` and rendered uncropped at the top of each selected batch. Names, official designations, moderators, and institutional leadership are transcribed from the supplied committee-formation notices. The notice-verified 2025–26 roster contains 13 student officers and is the current directory record; the 2024–25 archive contains 15 student officers.

The committee notices themselves are intentionally not copied into the public site because they contain student or staff administrative details, phone numbers, college numbers, and signatures. Those private fields and shifts are not published, the Chief Club Co-Ordinator and Principal are not relabelled as advisers, and no left-to-right identity mapping or individual portrait crop is inferred from the group photographs. Individual member cards retain clearly described portrait placeholders until approved portraits and identity mappings are supplied.

Six activity records use the supplied programme posters for events from August 2025 through August 2026. They are ordered from verified ISO dates rather than their declaration order. The achievement archive contains 14 supplied congratulations posters. Because most achievement artwork prints only a year, records are ordered newest-first by the supplied publication sequence; a year appears only when it is printed on the artwork, and undated sources are labelled accordingly.

Aurora is recorded as a 15-volume publication. Phase 1 includes detailed prototype records for Volumes 13–15; Volumes 1–12 are clearly marked as awaiting archival verification instead of assigning invented covers, dates, or files.

## Prototype boundaries

- Festival registration, contact, membership, download, and online-reading actions are demonstrations unless explicitly linked to a public resource.
- The migration and application support Supabase, but every local, staging, and production environment still requires its own project, secrets, migration run, Auth configuration, and authorization tests.
- There is intentionally no public member-login or registration flow. Administrator accounts are provisioned manually and remain inactive until an authorised role is assigned.
- Facts in the festival, activity, achievement, and executive archives are limited to the supplied posters and committee notices. Existing magazine prototypes and other unverified fields remain explicitly labelled or use missing-data states.
- Confirm publication consent for both supplied executive group photographs and the achievement artwork before production launch; individual student portraits remain placeholders until approved images are provided.
- The supplied club mark is isolated behind a reusable logo component. Confirm ownership, official status, clear-space guidance, and permitted variants before production use.

## Accessibility and responsive behavior

The interface is mobile-first and uses semantic landmarks, logical heading order, descriptive labels, visible keyboard focus, accessible color contrast, touch-friendly controls, and stronger boundaries between pale cards and backgrounds. A progressive-enhancement motion controller adds staggered hero entrances, scroll reveals, subtle parallax, mobile-menu motion, and route transitions while leaving content visible without JavaScript and avoiding server/client hydration mismatches. Decorative artwork is separated from meaningful content, and motion is removed when the visitor enables `prefers-reduced-motion`.

When extending the prototype, preserve keyboard access, useful alternative text, non-color status cues, and the current focus treatment. New forms must include associated labels, actionable error messages, and a clear submitted state.

## SEO and content quality

The root layout provides shared metadata while each route supplies a meaningful title and description. Dynamic detail routes derive metadata from their matching content record and return a true not-found state for unknown identifiers. Phase 1 also includes generated `robots.txt`, `sitemap.xml`, a club-logo favicon, Apple touch icon, and manifest-ready application icons. Before production launch, verify the canonical domain, add approved Open Graph imagery and organization/event structured data, and confirm whether bilingual content is required.

## Environment and secrets

Only variables prefixed with `NEXT_PUBLIC_` may be exposed to browser code. `SUPABASE_SERVICE_ROLE_KEY` is reserved for future server-only administration and must never be imported by a client component. Keep local values in `.env.local` and production values in the deployment provider's encrypted environment settings.

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for database operations and [PROJECT_PLAN.md](./PROJECT_PLAN.md) for the route architecture and staged production plan.
