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
npm run lint
npm run build
npm start
```

Run `npm run lint` and `npm run build` before opening a pull request. `npm start` serves the production build after `npm run build` succeeds.

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
| `/executives` | Current and archived panels, grouped by department and role |
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
public/                    # Static placeholder and brand-ready assets
```

Page files should compose shared components and read from `src/data`; they should not carry duplicated festival, magazine, activity, or executive content. This makes the later move from in-memory data to a repository or CMS layer straightforward.

## Prototype boundaries

- Festival registration, contact, membership, download, and online-reading actions are demonstrations unless explicitly linked to a public resource.
- No Supabase project, database schema, storage bucket, server action, email delivery, or persistent form submission is connected.
- No real authentication, session, authorization, or administrator credentials exist. There is intentionally no public member-login flow.
- Names, dates, statistics, results, partner marks, documents, and visual assets are sample content and must be reviewed by the club before launch.
- The placeholder logo component is designed to be replaced once an approved official logo file and usage guidance are available.

## Accessibility and responsive behavior

The interface is mobile-first and uses semantic landmarks, logical heading order, descriptive labels, visible keyboard focus, accessible color contrast, and touch-friendly controls. Decorative artwork is separated from meaningful content, and motion is reduced when the visitor enables `prefers-reduced-motion`.

When extending the prototype, preserve keyboard access, useful alternative text, non-color status cues, and the current focus treatment. New forms must include associated labels, actionable error messages, and a clear submitted state.

## SEO and content quality

The root layout provides shared metadata while each route supplies a meaningful title and description. Dynamic detail routes derive metadata from their matching mock record and return a true not-found state for unknown identifiers. Phase 1 also includes generated `robots.txt`, `sitemap.xml`, and a brand-ready application icon. Before production launch, verify the canonical domain, add approved Open Graph imagery and organization/event structured data, and confirm whether bilingual content is required.

## Environment and secrets

Only variables prefixed with `NEXT_PUBLIC_` may be exposed to browser code. `SUPABASE_SERVICE_ROLE_KEY` is reserved for future server-only administration and must never be imported by a client component. Keep local values in `.env.local` and production values in the deployment provider's encrypted environment settings.

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for the route architecture, Phase 1 deliverables, and the staged path to a data-backed production website.
