# DRMC Science Club Website — Project Plan

## Product goal

Create a trustworthy, accessible, and maintainable official web presence for DRMC Science Club. Visitors should be able to understand the club, follow activities and science festivals, read annual magazines, explore current and past executive panels, and find clear ways to join or make contact without creating an account.

Only approved administrators will eventually sign in. Public member accounts are outside the product scope.

## Experience principles

- Present a professional institutional identity using dark navy, science blue, and teal rather than entertainment-style neon effects.
- Make current information easy to find while preserving useful archives.
- Keep content readable on small screens first, then take advantage of wider layouts.
- Treat accessibility, performance, metadata, and security as core requirements.
- Keep content models independent from page components so mock records can later be replaced by Supabase or another CMS.
- Keep the supplied brand mark behind a replaceable logo component so approved variants or usage guidance can be adopted without changing page layouts.

## Route map

| Route | Access | Phase 1 responsibility | Future data source |
| --- | --- | --- | --- |
| `/` | Public | Full home composition, current highlights, archives, statistics, social links, and calls to action | Published site settings and featured records |
| `/about` | Public | History, mission, values, objectives, and college relationship | Managed pages/site settings |
| `/activities` | Public | Searchable/browsable-looking activity archive with empty-state support | Published activities |
| `/activities/[slug]` | Public | Activity story, metadata, images, related context, and invalid-slug 404 | One published activity by slug |
| `/festivals` | Public | Current festival highlight and annual archive | Published festivals |
| `/festivals/[slug]` | Public | Theme, dates, venue, segments, schedule, registration status, results, sponsors, gallery, brochure, and rulebook | Festival and related records/files |
| `/magazines` | Public | Annual issue archive and current issue preview | Published magazine issues |
| `/magazines/[year]` | Public | Cover, publication year, description, online-reading action, PDF action, and invalid-year 404 | One published issue by year |
| `/executives` | Public | Current panel first, session selector, archived panels, departments, roles, moderator, and advisers | Executive sessions and members |
| `/contact` | Public | Contact channels, location, social links, and direct email handoff | Site settings and future form endpoint |
| `/join` | Public | Eligibility, process, benefits, expectations, and future-intake guidance | Managed content and future form endpoint |
| `/admin/login` | Administrator | Mock sign-in screen with explicit prototype notice | Supabase Auth |
| `/admin` | Administrator | Mock dashboard and content-management preview | Authorized CMS queries and mutations |
| unmatched route | Public | Helpful 404 with recovery links | Not applicable |

`loading.tsx`, empty-state components, and `notFound()` paths are part of the route contract, not afterthoughts. Public pages remain readable without JavaScript wherever server rendering permits.

## Phase 1 — Responsive visual prototype

### Shared foundation

- Next.js App Router, strict TypeScript, Tailwind CSS, ESLint, `src` layout, and npm lockfile.
- Site-wide design tokens for color, spacing, type, radius, elevation, borders, focus, and reduced motion.
- Scheduled notification bar, responsive header/navigation, footer, content container, section heading, badges, buttons, cards, and intentional empty/error treatments.
- Subtle scientific grid, orbital, and circuit-inspired decoration that does not compete with content.
- Supplied club mark isolated in a shared brand component for a controlled future asset swap.
- Poster-backed carnival archive for the 8th–16th editions, with provenance-aware copy and honest empty states for records not supplied.
- Shared default metadata plus route-specific titles and descriptions.

### Home page

1. Scheduled notification bar.
2. Header and keyboard-accessible responsive navigation.
3. Logo-led hero with institutional positioning.
4. Current or upcoming science festival.
5. Latest activities.
6. Festival archive preview.
7. Annual magazine preview.
8. Current executive-panel preview.
9. Achievements and statistics.
10. Join-the-club call to action.
11. Facebook and Instagram links.
12. Footer with DRMC and club information.

### Content routes

- Festival index and detail templates supporting all required program, registration, result, partner, gallery, and document fields.
- Magazine index and year detail templates with cover artwork and reading/download actions.
- Activity index and slug detail templates.
- Executive directory with the current session prioritized, a session/year selector, department and role grouping, archived panels, moderator, and adviser sections.
- About, contact, and join pages that reuse the same visual system and public information architecture.
- Clearly labelled mock administrator login and dashboard; no credentials and no implied working security boundary.

### Phase 1 acceptance criteria

- Every planned route renders at mobile and desktop widths.
- Central mock records power summaries and detail pages without duplicated page-level data.
- Dynamic routes generate meaningful metadata and reject unknown identifiers with a 404.
- Meaningful images use `next/image`; decorative visuals are hidden from assistive technology.
- Navigation and interactive controls work by keyboard and show an obvious focus state.
- Reduced-motion preferences are respected.
- There is no public login, persisted form, real credential, or accidental backend dependency.
- `npm run lint` and `npm run build` complete successfully.

## Component architecture

```text
src/
├── app/
│   ├── (public)/
│   │   ├── about/
│   │   ├── activities/[slug]/
│   │   ├── contact/
│   │   ├── executives/
│   │   ├── festivals/[slug]/
│   │   ├── join/
│   │   └── magazines/[year]/
│   ├── admin/
│   │   └── login/
│   ├── globals.css
│   ├── layout.tsx
│   └── not-found.tsx
├── components/
│   ├── brand/             # Replaceable club mark and identity visuals
│   ├── features/          # Festival, magazine, activity, executive, and home sections
│   ├── layout/            # Announcement bar, header, navigation, shell, and footer
│   └── ui/                # Buttons, cards, badges, headings, states, and primitives
├── data/                  # Typed mock content and site configuration
└── types/                 # Domain contracts shared across data and UI
```

Server components are the default. Client components should be limited to interactions that require browser state, such as the mobile menu or executive-session selector. Domain components receive typed records rather than importing route-specific values.

## Data architecture

Phase 1 uses read-only TypeScript collections under `src/data`. Stable `id`, `slug`, `year`, or `session` identifiers connect preview cards to detail routes.

### Festival

- Identity: title, slug, year, theme, summary, hero image.
- Provenance: prototype or poster-backed archive record, used to control labels, image fitting, and missing-data copy.
- Logistics: dates, venue, status, registration state/deadline/link.
- Program: segments and ordered schedule entries.
- Outcomes: result groups and winners.
- Relationships: sponsors, partners, and related activity references.
- Media: gallery items, brochure link, and rulebook link.

### Magazine

- Publication identity: **Aurora**, the annual science magazine of DRMC Science Club.
- Year/issue identity, title, description, cover image, publication date.
- Online-reader and PDF links with availability states.

### Activity

- Slug, title, category, date, location, summary, full description, cover/gallery media, and optional related festival.

### Executive session

- Session label, year range, current/archive status.
- Moderator and adviser groups.
- Departments containing ordered members with role, name, portrait, and optional biography/contact fields.

### Site configuration

- Announcement window and priority.
- College/club contact details, social links, navigation, statistics, and footer content.
- Featured-record identifiers so homepage curation does not depend on array position.

The future data layer should preserve these view-facing contracts. Components should not need to know whether a record came from a TypeScript collection, Supabase query, or preview CMS response.

## Accessibility, SEO, and performance plan

- Use semantic landmarks, one clear page heading, logical section headings, lists for collections, and tables only for truly tabular schedules/results.
- Maintain visible `:focus-visible` treatment, keyboard-operable disclosure/menu patterns, labelled forms, adequate target sizes, and status text that does not rely on color alone.
- Provide purposeful alternative text for editorial images and empty alternative text for purely decorative assets.
- Honor `prefers-reduced-motion` and avoid autoplay media or motion-essential interactions.
- Generate page metadata from content records; add canonical URLs, Open Graph/Twitter imagery, `robots.txt`, `sitemap.xml`, and Event/Organization/Article structured data once the domain and approved content are available.
- Prefer server rendering, optimized images, restrained client JavaScript, and explicit image dimensions to protect Core Web Vitals.

## Future development stages

### Phase 2 — Supabase foundation and content migration

- Design normalized tables for festivals, segments, schedules, results, partners, gallery media, activities, magazines, executive sessions/members, announcements, and site settings.
- Create versioned SQL migrations, generated TypeScript database types, seed tooling, and documented development/staging/production projects.
- Configure Supabase Storage buckets for covers, galleries, portraits, PDFs, and brand assets with file-size/type policies.
- Apply Row Level Security to every exposed table and storage bucket. Public clients receive read access only to published content.
- Add a server-side repository layer, caching/revalidation rules, preview-safe error handling, and a controlled migration from mock records.

### Phase 3 — Private administrator authentication and CMS

- Connect `/admin/login` to Supabase Auth with administrator-only invitation/provisioning; do not add public sign-up.
- Protect server routes, mutations, and storage operations independently of the visual route guard.
- Add least-privilege roles, session expiry, recovery policy, optional MFA, and an audit trail for sensitive changes.
- Build validated CRUD workflows for each content type, including drafts, scheduled publication, archive/unpublish, ordering, featured selection, media metadata, and link checks.
- Provide safe rich-text handling, slug collision checks, optimistic concurrency/version awareness, and destructive-action confirmation.

### Phase 4 — Forms, communications, and editorial integrations

- Implement contact and join forms with server-side schema validation, rate limits, bot protection, privacy/consent copy, and accessible success/failure states.
- Define who receives submissions, retention/deletion rules, export needs, and whether a submission becomes an internal membership record.
- Add transactional email only after sender-domain verification; keep provider secrets server-only.
- Connect approved social, magazine reader, registration, map, and analytics services with graceful fallback when unavailable.

### Phase 5 — Quality, security, and content readiness

- Add unit tests for selectors/formatters, component tests for interactive UI, and end-to-end coverage for public navigation, dynamic 404s, forms, authentication, and admin publishing.
- Automate accessibility checks and perform manual keyboard, screen-reader, zoom, reduced-motion, and contrast reviews.
- Run dependency/security scanning, authorization tests, content sanitization checks, image/document validation, and a secrets audit.
- Add responsive visual regression, Lighthouse/Core Web Vitals budgets, broken-link checking, and cross-browser/device coverage.
- Replace all sample facts and assets with reviewed club content; verify photo consent, sponsor/logo permission, downloadable documents, dates, names, and bilingual requirements.

### Phase 6 — Deployment and operations

- Create preview, staging, and production environments with separate Supabase projects and least-privilege secrets.
- Add continuous integration for lint, type/build, tests, migrations, and preview deployments before production promotion.
- Configure the official domain, HTTPS, redirects, security headers, canonical host, analytics consent, uptime/error monitoring, and incident contacts.
- Document database and storage backup/restore drills, admin offboarding, content ownership, publication workflow, and periodic dependency/access reviews.
- Launch only after stakeholder, accessibility, security, content, and rollback checklists are signed off.

## Decisions required before Phase 2

- Confirm the official club name treatment, supplied-logo status, colors, typography, and asset usage rules.
- Confirm the production domain and the authoritative DRMC/club address, phone, email, and social accounts.
- Approve the festival, magazine, activity, and executive taxonomies and archival policy.
- Identify administrator roles, approvers, account provisioning owner, and emergency recovery contact.
- Decide submission retention, consent language, media permissions, analytics policy, and whether Bengali content is required at launch.
