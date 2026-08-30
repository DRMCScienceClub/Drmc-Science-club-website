# DRMC Science Club Website

Phase 1 of the official public website for **Dhaka Residential Model College Science Club (DRMCSC)**. This release is a responsive visual prototype: it establishes the information architecture, design system, reusable page patterns, and realistic sample content before a database or private administration workflow is introduced.

Public visitors do not need an account. The `/admin` area is deliberately presented as a mock interface, and `/admin/login` does not authenticate against a real service yet.

## Technology

- Next.js 16 with the App Router
- React 19 and TypeScript in strict mode
- Tailwind CSS 4
- ESLint with the Next.js configuration
- `next/image` for stable, responsive visual assets and a system-font stack for offline-safe builds
- Centralized, typed mock data

## Current Phase 1 implementation

Phase 1 is complete as a public visual prototype. The current baseline provides the full route architecture, centralized typed content, supplied archival media, responsive and accessible layouts, honest missing-data states, and a clearly labelled non-functional administration preview. Supabase, persistent forms, and real authentication remain future work.

- Complete responsive public route set for the home page, club information, activities, festivals, Aurora magazine archive, executive panels, contact, and membership guidance.
- Account-free public access with a clearly labelled, non-functional administrator login and dashboard preview.
- A teal-led institutional visual system with dark navy feature areas, restrained science-blue and gold accents, subtle scientific grids, clearer card borders, and softly graduated light surfaces.
- Reusable, provenance-aware festival, magazine, activity, and executive components backed by centralized TypeScript records.
- Supplied DRMC Science Club branding across the shared header/footer logo, browser favicon, Apple touch icon, and installable application icons.
- Progressive route, hero, menu, reveal, and parallax motion with keyboard, reduced-motion, and hydration-safety protections.
- Poster-backed festival history for the 8th–16th editions, a 15-volume Aurora archive model, and a notice-verified current executive-panel record.

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
| `/festivals` | Science festival archive and current registration state |
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
├── data/                  # Single source of truth for Phase 1 mock content
└── types/                 # Shared domain and component types
public/                    # Supplied archive artwork and prototype visual assets
```

Page files should compose shared components and read from `src/data`; they should not carry duplicated festival, magazine, activity, or executive content. This makes the later move from in-memory data to a repository or CMS layer straightforward.

## Visual system and motion

The light interface is built around a pale teal page canvas rather than flat white. Teal-tinted paper and slate tokens carry that treatment through headers, grid sections, cards, and calls to action, while dark navy sections provide institutional contrast. Gold remains a small editorial accent. Shared `surface-card` and `surface-border` treatments keep white and near-white information panels distinct from scientific-grid backgrounds without making every divider heavy.

Public routes are wrapped by a shared transition boundary and progressive motion controller. Hero entrances, scroll reveals, subtle parallax, and the responsive menu use CSS animation or the Web Animations API without changing React-owned server markup before hydration. Content therefore remains visible without JavaScript, keyboard focus settles animated content immediately, detached animations are cleaned up, and `prefers-reduced-motion` removes non-essential movement.

## Supplied and verified content assets

The shared `LogoMark` uses the supplied transparent DRMC Science Club artwork at `public/images/brand/drmc-science-club-logo.png`. The browser favicon, application icon, Apple touch icon, and 192/512-pixel manifest icons are derived from the same supplied club mark. The real logo remains isolated behind reusable brand components so a later approved variant can be adopted without changing page layouts.

Nine supplied carnival posters are normalized under `public/images/festivals/archive/` and power poster-backed records for the 8th through 16th editions (2015–2025, with no invented entries for years absent from the supplied set). Festival records carry a provenance state. Poster-backed entries publish only details visible in the supplied artwork—edition, title, dates, theme, selected listed segments, and the displayed title sponsor—while unavailable schedules, results, rules, venue records, and resources use explicit empty states. The 2026 record remains visibly labelled as Phase 1 prototype content.

The supplied 2025–26 executive-panel photograph is stored at `public/images/executives/executive-panel-2025-26.jpg` and is rendered uncropped at the top of the selected batch. The executive model gives every session the same top photograph slot; archived batches without an approved image show an explicit archive placeholder. Names, official designations, the moderator, and institutional leadership are transcribed from the supplied committee-formation notice. The notice-verified 2025–26 roster contains 13 student officers and is the current published directory record; the 2024–25 archive remains clearly labelled prototype content.

The committee notice itself is intentionally not copied into the public site because it contains student college numbers and staff signatures. College numbers and shifts are not published, the Chief Club Co-Ordinator and Principal are not relabelled as advisers, and no left-to-right identity mapping or individual portrait crop is inferred from the group photograph. Individual member cards retain clearly described portrait placeholders until approved portraits and identity mappings are supplied.

Aurora is recorded as a 15-volume publication. Phase 1 includes detailed prototype records for Volumes 13–15; Volumes 1–12 are clearly marked as awaiting archival verification instead of assigning invented covers, dates, or files.

## Prototype boundaries

- Festival registration, contact, membership, download, and online-reading actions are demonstrations unless explicitly linked to a public resource.
- No Supabase project, database schema, storage bucket, server action, email delivery, or persistent form submission is connected.
- No real authentication, session, authorization, or administrator credentials exist. There is intentionally no public member-login flow.
- Except for facts transcribed from the supplied archive posters and the supplied 2025–26 committee notice, names, dates, statistics, results, partner marks, documents, and visual assets are sample content and must be reviewed by the club before launch.
- Confirm publication consent for the supplied 2025–26 group photograph before production launch; individual student portraits remain placeholders until approved images are provided.
- The supplied club mark is isolated behind a reusable logo component. Confirm ownership, official status, clear-space guidance, and permitted variants before production use.

## Accessibility and responsive behavior

The interface is mobile-first and uses semantic landmarks, logical heading order, descriptive labels, visible keyboard focus, accessible color contrast, touch-friendly controls, and stronger boundaries between pale cards and backgrounds. A progressive-enhancement motion controller adds staggered hero entrances, scroll reveals, subtle parallax, mobile-menu motion, and route transitions while leaving content visible without JavaScript and avoiding server/client hydration mismatches. Decorative artwork is separated from meaningful content, and motion is removed when the visitor enables `prefers-reduced-motion`.

When extending the prototype, preserve keyboard access, useful alternative text, non-color status cues, and the current focus treatment. New forms must include associated labels, actionable error messages, and a clear submitted state.

## SEO and content quality

The root layout provides shared metadata while each route supplies a meaningful title and description. Dynamic detail routes derive metadata from their matching mock record and return a true not-found state for unknown identifiers. Phase 1 also includes generated `robots.txt`, `sitemap.xml`, a club-logo favicon, Apple touch icon, and manifest-ready application icons. Before production launch, verify the canonical domain, add approved Open Graph imagery and organization/event structured data, and confirm whether bilingual content is required.

## Environment and secrets

Only variables prefixed with `NEXT_PUBLIC_` may be exposed to browser code. `SUPABASE_SERVICE_ROLE_KEY` is reserved for future server-only administration and must never be imported by a client component. Keep local values in `.env.local` and production values in the deployment provider's encrypted environment settings.

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for the route architecture, Phase 1 deliverables, and the staged path to a data-backed production website.
