# DRMC Science Club Website

Phase 1 of the official public website for **Dhaka Residential Model College Science Club (DRMCSC)**. The public experience combines the club's supplied artwork and official records with a responsive information architecture and reusable design system. A database and private administration workflow remain future work.

Public visitors do not need an account. The `/admin` area is deliberately presented as a mock interface, and `/admin/login` does not authenticate against a real service yet.

## Technology

- Next.js 16 with the App Router
- React 19 and TypeScript in strict mode
- Tailwind CSS 4
- ESLint with the Next.js configuration
- `next/image` for stable, responsive visual assets and a system-font stack for offline-safe builds
- Centralized, typed content records

## Current Phase 1 implementation

The current baseline provides the full public route architecture, centralized typed content, supplied archival media, responsive and accessible layouts, honest missing-data states, and a clearly labelled non-functional administration preview. Supabase, persistent forms, and real authentication remain future work.

- Complete responsive public route set for the home page, club information, activities, achievements, festivals, Aurora magazine archive, executive panels, contact, and membership guidance.
- Account-free public access with a clearly labelled, non-functional administrator login and dashboard preview.
- A teal-led institutional visual system with dark navy feature areas, restrained science-blue and gold accents, subtle scientific grids, clearer card borders, and softly graduated light surfaces.
- Reusable, provenance-aware festival, magazine, activity, achievement, and executive components backed by centralized TypeScript records.
- High-resolution supplied DRMC Science Club branding across the shared header/footer logo, home hero, browser favicon, Apple touch icon, and installable application icons.
- Progressive route, hero, menu, reveal, and parallax motion with keyboard, reduced-motion, and hydration-safety protections.
- Poster-backed festival history for the 8th–17th editions, six supplied activity programmes, 14 achievement announcements, a 15-volume Aurora archive model, and notice-verified 2024–25 and 2025–26 executive panels.

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

The Phase 1 prototype does not require environment values, so an empty `.env.local` is valid. The names in `.env.example` reserve the configuration surface for later integration work; never commit real keys or credentials.

### Quality checks

```bash
npm run lint -- --max-warnings=0
npx next typegen
npx tsc --noEmit --incremental false
npm run build
git diff --check
npm start
```

Run lint, route type generation, the standalone strict TypeScript check, the production build, and `git diff --check` before opening a pull request. `npm start` serves the production build after `npm run build` succeeds. The current Phase 1 baseline passes lint with zero warnings, route type generation, a clean TypeScript check, and the production build.

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
| `/admin/login` | Clearly labelled mock administrator sign-in |
| `/admin` | Clearly labelled mock content dashboard |

Unknown activity, festival, and magazine identifiers resolve to the site-wide 404 experience. Route-level loading and empty-state patterns keep asynchronous and content-free states intentional.

## Project structure

```text
src/
├── app/
│   ├── (public)/          # Public pages and dynamic detail routes
│   │   └── template.tsx   # Public route-transition boundary
│   ├── admin/             # Mock admin login and dashboard
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
```

Page files should compose shared components and read from `src/data`; they should not carry duplicated festival, magazine, activity, or executive content. This makes the later move from in-memory data to a repository or CMS layer straightforward.

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
- No Supabase project, database schema, storage bucket, server action, email delivery, or persistent form submission is connected.
- No real authentication, session, authorization, or administrator credentials exist. There is intentionally no public member-login flow.
- Facts in the festival, activity, achievement, and executive archives are limited to the supplied posters and committee notices. Existing magazine prototypes and other unverified fields remain explicitly labelled or use missing-data states.
- Confirm publication consent for both supplied executive group photographs and the achievement artwork before production launch; individual student portraits remain placeholders until approved images are provided.
- The supplied club mark is isolated behind a reusable logo component. Confirm ownership, official status, clear-space guidance, and permitted variants before production use.

## Accessibility and responsive behavior

The interface is mobile-first and uses semantic landmarks, logical heading order, descriptive labels, visible keyboard focus, accessible color contrast, touch-friendly controls, and stronger boundaries between pale cards and backgrounds. A progressive-enhancement motion controller adds staggered hero entrances, scroll reveals, subtle parallax, mobile-menu motion, and route transitions while leaving content visible without JavaScript and avoiding server/client hydration mismatches. Decorative artwork is separated from meaningful content, and motion is removed when the visitor enables `prefers-reduced-motion`.

When extending the prototype, preserve keyboard access, useful alternative text, non-color status cues, and the current focus treatment. New forms must include associated labels, actionable error messages, and a clear submitted state.

## SEO and content quality

The root layout provides shared metadata while each route supplies a meaningful title and description. Dynamic detail routes derive metadata from their matching mock record and return a true not-found state for unknown identifiers. Phase 1 also includes generated `robots.txt`, `sitemap.xml`, a club-logo favicon, Apple touch icon, and manifest-ready application icons. Before production launch, verify the canonical domain, add approved Open Graph imagery and organization/event structured data, and confirm whether bilingual content is required.

## Environment and secrets

Only variables prefixed with `NEXT_PUBLIC_` may be exposed to browser code. `SUPABASE_SERVICE_ROLE_KEY` is reserved for future server-only administration and must never be imported by a client component. Keep local values in `.env.local` and production values in the deployment provider's encrypted environment settings.

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for the route architecture, Phase 1 deliverables, and the staged path to a data-backed production website.
