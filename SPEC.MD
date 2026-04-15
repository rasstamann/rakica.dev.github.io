# Technical Specification – Personal Presentation Website

## 1. Objective

A personal portfolio website that functions as a professional business card targeting **recruiters and technical hiring managers**. The goal is to generate interview invitations.

Content is deliberately minimal, but the site is backed by a real full-stack MERN architecture. A technical interviewer who opens DevTools should see actual API calls to a live backend — not hardcoded JSON. The site itself is the proof of full-stack competence.

**This is v0.1 — the first major vertical slice.** It establishes the full-stack foundation (React → Express → MongoDB) and proves the architecture works end-to-end. Future vertical slices will layer on additional pages and features without reworking the core. See §14 for the planned roadmap.

**Success criteria (MVP is done when all pass):**
- [ ] `GET /api/me` returns a valid JSON profile (200)
- [ ] Landing page mounts, fetches from the API, and renders name / tagline / links / skills
- [ ] Layout is usable on mobile (responsive)
- [ ] `bun run build` in `client/` exits with zero TypeScript errors
- [ ] `bun run seed` in `server/` upserts the placeholder profile and exits cleanly

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Bun |
| Backend | Express.js + TypeScript |
| Database | MongoDB via Mongoose |
| Frontend | React + Vite + TypeScript |
| Styling | TailwindCSS v4 (PostCSS) |
| Linting | ESLint (strict) |
| Formatting | Prettier |
| Testing | Bun test runner (`bun test`) |

---

## 3. Architecture

### 3.1 High-Level

Two independent packages under `personal_presentation/`:

```
Browser → React SPA (client/) → /api/* → Express (server/) → MongoDB
```

- **`client/`** — Vite + React SPA. In dev, Vite proxies `/api/*` to `http://localhost:3001`. In production, a reverse proxy (e.g. Nginx or Vercel rewrite) handles this.
- **`server/`** — Express app running on Bun. Exposes REST API. Connects to MongoDB via Mongoose.

### 3.2 Application Layers

**Presentation** — React components, TailwindCSS  
**API** — Express route handlers (`/api/me`)  
**Data access** — Mongoose models + repository functions  

---

## 4. Project Structure

```
personal_presentation/
├── CLAUDE.md
├── SPEC.MD
├── docs/
│   └── ideas/
│       └── personal-website.md
│
├── client/                          # React + Vite + TypeScript
│   ├── index.html
│   ├── vite.config.ts               # Proxy /api/* → localhost:3001
│   ├── tailwind.config.ts
│   ├── postcss.config.ts
│   ├── tsconfig.json
│   ├── eslint.config.js
│   ├── .prettierrc
│   ├── package.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx                  # Router root; owns profile state for /
│       ├── types.ts                 # Shared Profile + Project types
│       ├── pages/
│       │   ├── HomePage.tsx         # Landing page: Hero + Links only
│       │   ├── AboutPage.tsx        # CV page: Summary, Skills, Experience, Education
│       │   └── ProjectsPage.tsx     # Fetches /api/projects, maps to ProjectCard
│       └── components/
│           ├── Hero.tsx             # Name + tagline
│           ├── Links.tsx            # GitHub, LinkedIn, email
│           ├── Skills.tsx           # Tech stack tags
│           └── ProjectCard.tsx      # Single project entry (title, description, links)
│
└── server/                          # Express + Bun + TypeScript
    ├── package.json
    ├── tsconfig.json
    ├── eslint.config.js
    ├── .prettierrc
    ├── .env.example
    ├── .env                         # Git-ignored
    └── src/
        ├── index.ts                 # Entry: connect DB, register middleware, start server
        ├── lib/
        │   ├── db.ts                # Mongoose connect helper
        │   └── middleware.ts        # requireDb — returns 503 when DB unavailable
        ├── models/
        │   ├── Profile.ts           # Mongoose model + TypeScript type
        │   └── Project.ts           # Mongoose model + TypeScript type
        ├── routes/
        │   ├── me.ts                # GET /api/me
        │   └── projects.ts          # GET /api/projects
        └── scripts/
            └── seed.ts              # Upserts profile + projects
```

---

## 5. Functional Requirements

### 5.1 Landing Page (`/`)

Displays only:
1. Name + avatar (heading)
2. Tagline (subheading)
3. Social/contact links — GitHub, LinkedIn, email

All content is fetched from `GET /api/me?lang=<locale>` on mount. On fetch failure, hardcoded fallback data is shown (name, tagline, links). The page never shows an error message.

### 5.2 API

#### `GET /api/me`

Returns the singleton profile document from MongoDB, with translatable fields flattened to the requested locale.

**Query parameters:**

| Param | Values | Default | Description |
|-------|--------|---------|-------------|
| `lang` | `en`, `de` | `en` | Locale for translatable fields. Invalid values fall back to `en`. |

**Response 200:**
```json
{
  "name": "Aleksandar Rakić",
  "tagline": "C++ developer, lego enjoyer, cook, husband, dad and sometimes asleep",
  "summary": "Experienced software engineer with 3 years of experience in C++, Qt, and Embedded Linux...",
  "links": {
    "github": "https://github.com/rasstamann",
    "linkedin": "https://linkedin.com/in/placeholder",
    "email": "aleksandar.rakic.88@gmail.com"
  },
  "skills": ["C++", "Qt", "Embedded Linux", "OpenCV"],
  "experience": [
    {
      "company": "grapho-metronic gmbh",
      "role": "Software Engineer",
      "startDate": "2023-01",
      "endDate": null,
      "bullets": [
        "Contributed to several C++/Qt projects in the field of inline image processing..."
      ]
    }
  ],
  "education": [
    {
      "institution": "School of Electrical Engineering, University of Belgrade",
      "degree": "BSc. in Electrical Engineering and Computer Science",
      "field": "Computer Science",
      "startDate": "2006-10",
      "endDate": "2025-09"
    }
  ]
}
```

**Response 404:**
```json
{ "error": "Profile not found" }
```

Internal DB fields (`_id`, `__v`) are never exposed. Locale-keyed sub-documents are resolved server-side — the client always receives plain strings.

### 5.3 Projects Page (`/projects`)

Displays a list of project cards fetched from `GET /api/projects?lang=<locale>`. Uses the same locale detection as the landing page. Locale is passed as a prop from the router root.

Shows:
- **Loading state** while in-flight
- **Error state** → shows hardcoded fallback project card (personal-presentation) instead of an error message
- **Card list** once resolved — one `<ProjectCard>` per project

Each card renders:
1. Title
2. Description
3. Tech stack tags (same visual style as Skills)
4. GitHub link (if present)
5. Live URL (if present)
6. Screenshot (if present — `<img>` with alt text)
7. Status badge (if present — e.g. "Active", "Archived")

Navigation between `/` and `/projects` via sticky header links (existing `StickyHeader` component updated to include "Projects" link).

### 5.4 About Page (`/about`)

Displays CV content:
1. Summary / "About me" paragraph
2. Skills — grouped by category
3. Experience — timeline with bullets
4. Education — degrees and courses

Fetched from `GET /api/me?lang=<locale>`. On failure, shows hardcoded fallback: current job (grapho-metronic) and BSc (University of Belgrade) only. Summary and skills are hidden when falling back.

### 5.5 Seed Script (`bun run seed`)

Connects to MongoDB, upserts the placeholder profile document and all project documents (creates if absent, updates if present), logs the result, and exits with code 0.

---

## 6. Non-Functional Requirements

**Performance**
- API response under 100ms (local MongoDB)
- Frontend initial render under 1s (local dev)

**Security**
- CORS restricted to `ALLOWED_ORIGIN` env var
- No internal DB fields in API responses
- All secrets in environment variables — never committed

**Reliability**
- Graceful error handling: server starts regardless of DB state. If MongoDB is unavailable at startup, a warning is logged. API routes return 503 immediately (via `requireDb` middleware) rather than hanging. DB connection is retried by Mongoose in the background.

**UX (resilience)**
- All pages show meaningful fallback content when the API is unavailable — no blank screens or raw error messages visible to end users.

**Maintainability**
- TypeScript everywhere — `strict: true`, no `any`
- ESLint + Prettier enforced — `bun run lint` must pass before committing

**UX**
- Responsive layout — single column on mobile, centred on desktop
- No external UI component libraries — plain HTML + Tailwind

---

## 7. Data Model

### MongoDB Collection: `profiles`

```typescript
// server/src/models/Profile.ts

/** A string that exists in all supported locales. */
type LocaleString = {
  en: string;
  de: string;
};

type ProfileLinks = {
  github?: string;
  linkedin?: string;
  email?: string;
};

type ExperienceEntry = {
  company: string;        // not localised (proper noun)
  role: LocaleString;
  startDate: string;      // "YYYY-MM"
  endDate: string | null; // null = present
  bullets: LocaleString[];
};

type EducationEntry = {
  institution: string;    // not localised (proper noun)
  degree: LocaleString;
  field?: LocaleString;
  startDate: string;      // "YYYY-MM"
  endDate: string | null;
};

type IProfile = {
  name: string;           // not localised
  tagline: LocaleString;  // was: string
  summary: LocaleString;  // new — "About me" paragraph
  links: ProfileLinks;
  skills: string[];       // not localised
  experience: ExperienceEntry[];
  education: EducationEntry[];
};
```

**Locale flattening** — `GET /api/me?lang=<locale>` resolves all `LocaleString` fields to plain strings before sending the response. The client never sees locale keys.

Supported locales: `en` (default), `de`. Unknown `lang` values fall back to `en`.

**Schema notes:**
- Single document (singleton). `GET /api/me` returns `Profile.findOne()`.
- No `timestamps` option needed.
- `_id` and `__v` stripped via `.select('-_id -__v')` on every query.

### MongoDB Collection: `projects`

```typescript
// server/src/models/Project.ts

type IProject = {
  slug: string;              // URL-safe identifier, unique
  title: string;             // not localised
  description: LocaleString; // "About this project" paragraph
  techStack: string[];       // not localised
  githubUrl?: string;
  liveUrl?: string;
  screenshotUrl?: string;
  status?: string;           // e.g. "Active", "Archived" — not localised
  order: number;             // ascending sort order
};
```

**Schema notes:**
- Multiple documents. `GET /api/projects` returns `Project.find().sort({ order: 1 })`.
- `_id` and `__v` stripped via `.select('-_id -__v')` on every query.
- `slug` has a unique index.

**Seed entry — this site:**

```typescript
{
  slug: "personal-presentation",
  title: "Personal Presentation Website",
  description: {
    en: "Full-stack personal portfolio built with React, Express, Bun, and MongoDB. Real API calls are visible in DevTools — the architecture is the demo. Features EN/DE i18n, a GitHub Actions CI pipeline, and sticky navigation. Built with Claude.",
    de: "Full-Stack-Portfolio mit React, Express, Bun und MongoDB. Echte API-Aufrufe sind im DevTools sichtbar — die Architektur ist das Demo. Mit EN/DE-Lokalisierung, GitHub Actions CI und Sticky-Navigation. Mit Claude gebaut.",
  },
  techStack: ["React", "TypeScript", "Express", "Bun", "MongoDB", "TailwindCSS", "GitHub Actions"],
  githubUrl: "https://github.com/rasstamann/personal_presentation",
  liveUrl: undefined,
  screenshotUrl: undefined,
  status: "Active",
  order: 0,
}
```

---

## 8. API Design

### Base URL

- Dev: `http://localhost:3001` (accessed via Vite proxy from `http://localhost:5173`)
- Production: configured via reverse proxy

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/me` | None | Returns profile document. Accepts `?lang=en\|de` (default: `en`). |
| GET | `/api/projects` | None | Returns array of project documents. Accepts `?lang=en\|de` (default: `en`). |

#### `GET /api/projects`

Returns all project documents sorted by `order` ascending, with `LocaleString` fields flattened to the requested locale.

**Response 200:**
```json
[
  {
    "slug": "personal-presentation",
    "title": "Personal Presentation Website",
    "description": "Full-stack personal portfolio built with React, Express, Bun, and MongoDB...",
    "techStack": ["React", "TypeScript", "Express", "Bun", "MongoDB", "TailwindCSS", "GitHub Actions"],
    "githubUrl": "https://github.com/rasstamann/personal_presentation",
    "status": "Active",
    "order": 0
  }
]
```

Optional fields (`liveUrl`, `screenshotUrl`) are omitted when not set.

### Headers

All responses include:
```
Content-Type: application/json
```

CORS headers set by `cors` middleware using `ALLOWED_ORIGIN` env var.

---

## 9. Frontend Components

### `App.tsx`
- Detects locale from `navigator.language` (`de-*` → `de`, all others → `en`); lifted to `useState`
- Sidebars: two decorative gradient bars (`w-[3%]`, always visible) — green left, violet right
- `StickyHeader` always rendered; `heroInView` boolean passed as prop to control avatar fade-in animation
- Routes: `/`, `/about`, `/projects`
- `basename` set from `import.meta.env.BASE_URL` for correct routing on GitHub Pages

### `pages/HomePage.tsx`
- Fetches `/api/me?lang=<locale>` on mount via AbortController
- Renders `<Hero>` and `<Links>` only
- On fetch failure: shows hardcoded fallback (name, taglines EN/DE, links) — never shows error state
- Fires `onHeroVisibilityChange` via IntersectionObserver on Hero element

### `pages/AboutPage.tsx`
- Fetches `/api/me?lang=<locale>` on mount
- Renders `<Summary>`, `<Skills>`, `<Experience>`, `<Education>` when data loads
- On failure: shows hardcoded fallback experience (current job) and education (BSc); summary and skills hidden
- No Hero, no Links

### `pages/ProjectsPage.tsx`
- Receives `locale` prop
- Fetches `/api/projects?lang=<locale>` on mount via AbortController; re-fetches when `locale` changes
- Manages `projects`, `loading` state
- On failure: shows hardcoded fallback project card (personal-presentation) — no error message rendered
- Maps projects to `<ProjectCard>` components

### `components/StickyHeader.tsx`
- Always visible (no full-bar slide animation)
- Positioned between sidebars: `left-[3%] right-[3%]`
- Left: avatar (fades in when `heroInView=false`, links to `/`) + nav links (Home, About, Projects — always visible)
- Right: `<LocaleSwitcher>` (always visible)
- Props: `heroInView: boolean`, `locale`, `setLocale`

### `components/Hero.tsx`
```typescript
type HeroProps = { name: string; tagline: string };
```
Renders `<h1>` name and `<p>` tagline.

### `components/Summary.tsx`
```typescript
type SummaryProps = { summary: string };
```
Renders the "About me" paragraph.

### `components/Links.tsx`
```typescript
type LinksProps = { links: { github?: string; linkedin?: string; email?: string } };
```
Renders only the links present. Email uses `mailto:` prefix.

### `components/Skills.tsx`
```typescript
type SkillsProps = { skills: string[] };
```
Renders each skill as a `<span>` tag/badge.

### `components/Experience.tsx`
```typescript
type ExperienceProps = { experience: ExperienceEntry[] };
```
Renders a timeline of work history. Each entry shows company, role, date range, and bullet points.

### `components/Education.tsx`
```typescript
type EducationProps = { education: EducationEntry[] };
```
Renders education entries with institution, degree, field, and date range.

### `types.ts`
Single shared `Profile` type (post-locale-flattening shape) — imported by `App.tsx` and all components to avoid drift.

```typescript
export type ExperienceEntry = {
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  bullets: string[];
};

export type EducationEntry = {
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate: string | null;
};

export type Profile = {
  name: string;
  tagline: string;
  summary: string;
  links: { github?: string; linkedin?: string; email?: string };
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
};
```

---

## 10. Code Style

**ESLint + Prettier — strict. `bun run lint` must pass before any commit.**

**ESLint rules:**
- `@typescript-eslint/no-explicit-any`: error
- `@typescript-eslint/explicit-function-return-type`: warn (server), off (client JSX)
- `no-console`: warn (server routes), off (scripts)
- React: `react/prop-types` off (TypeScript handles this)

**Prettier config (`.prettierrc`):**
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

**Import order:** external packages → internal `@/` aliases → relative paths. Blank line between groups.

---

## 11. Testing Strategy

**Full TDD: write a failing test first, then implement.**

Test runner: `bun test` (built-in Bun test runner).

### Server tests (`server/src/**/*.test.ts`)

- **`routes/me.test.ts`** — Unit test the route handler:
  - Returns 200 with correct profile shape when `Profile.findOne()` resolves
  - Returns 404 when `Profile.findOne()` returns null
  - Strips `_id` and `__v` from response
- **`routes/projects.test.ts`** — Unit test the route handler:
  - Returns 200 with array when `Project.find()` resolves
  - Returns empty array `[]` (not 404) when no projects exist
  - Strips `_id` and `__v` from each entry
  - Flattens `description` to the requested locale
- **`lib/db.test.ts`** — Verify connection helper exports expected interface
- **`lib/middleware.test.ts`** — `requireDb` middleware:
  - Returns 503 when `readyState !== 1`
  - Calls `next()` when `readyState === 1`

Use `mock()` from `bun:test` to stub Mongoose model methods — no real DB calls in unit tests.

### Client tests (`client/src/**/*.test.tsx`)

- **`App.test.tsx`** — Render with mocked `fetch`:
  - Shows loading state initially
  - Fetch failure shows fallback profile (name + links) — not an error message
- **`components/Links.test.tsx`** — Only renders links that have values
- **`components/Skills.test.tsx`** — Renders one tag per skill
- **`components/ProjectCard.test.tsx`**:
  - Renders title, description, tech stack tags
  - Renders GitHub link only when `githubUrl` present
  - Renders live URL only when `liveUrl` present
  - Renders screenshot only when `screenshotUrl` present
  - Renders status badge only when `status` present
- **`pages/AboutPage.test.tsx`** — Render with mocked `fetch`:
  - Renders summary, skills, experience, education on successful fetch
  - Shows fallback experience and education on fetch failure; summary and skills hidden
- **`pages/ProjectsPage.test.tsx`** — Render with mocked `fetch`:
  - Shows loading state initially
  - Renders one `ProjectCard` per project on success
  - Shows fallback project card on failed fetch (not an error message)

Use `@testing-library/react` + `happy-dom` (Bun-compatible).

### What is NOT tested

- Visual/layout correctness — manual browser check
- Mobile responsiveness — manual check via DevTools
- Seed script — run manually; no unit test needed

---

## 12. Environment Variables

**File: `server/.env`** (copy from `server/.env.example`)

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URI` | `mongodb://localhost:27017/personal_presentation` | MongoDB connection string |
| `PORT` | `3001` | Express server port |
| `ALLOWED_ORIGIN` | `http://localhost:5173` | CORS allowed origin |

---

## 13. Boundaries (Requires Explicit Approval)

**Always ask before:**
- Modifying the Mongoose `Profile` model (schema changes affect seed data and API contract)
- Installing any new package (`bun add`) — propose the package and reason first
- Changing the `GET /api/me` response shape — downstream client code must be updated together
- Committing or pushing to git — propose the commit message and diff summary first

**Never do:**
- Commit `.env` or any file containing secrets
- Use `any` in TypeScript
- Skip `bun run lint` before proposing a commit
- Add features not in this spec without a spec update first
- Modify user-authored content fields without explicit approval (see below)

### User-Authored Content

The database is the source of truth for profile content. The following fields are personal prose written by the user and must never be changed, reworded, or have translations invented without explicit instruction:

| Field | Notes |
|-------|-------|
| `name` | |
| `tagline` (en + de) | |
| `summary` (en + de) | |
| `experience[].role` (en + de) | |
| `experience[].bullets[]` (en + de) | |
| `education[].degree` (en + de) | |
| `education[].field` (en + de) | |
| `links` | github, linkedin, email |
| `skills[]` | |

This applies to `seed.ts` and to any direct MongoDB operation. When a structural change requires a new locale key that doesn't exist yet, preserve all existing text and **ask the user** for the translation — never supply one.

---

## 14. Roadmap

### Completed — v0.2
- Inline CV section: Summary, Experience, Education components
- i18n foundation: `LocaleString` model fields, `?lang=` API param, locale detection on client

### Completed — v0.3
- Locale switcher UI: EN/DE toggle (fixed top-right), `localStorage` persistence, reactive re-fetch
- `locale` lifted to `useState` in `App.tsx`; `Experience` and `Education` receive locale for date formatting and translated headings
- Full EN/DE seed data reviewed and corrected (spelling, grammar, translation fidelity)

### Completed — v0.4
- Visual redesign: avatar in Hero, sticky header with IntersectionObserver, grouped Skills layout, SectionDivider gradients
- Components: `StickyHeader`, `SectionDivider`, `DateRange` extracted
- 57 tests across 9 files

### Completed — v0.5
- GitHub Actions CI pipeline: two parallel jobs (`client-ci`, `server-ci`)
- Each job: typecheck → lint → test (client also builds)
- Path-filtered triggers; `workflow_dispatch` for manual runs
- CI status badge in README

### Completed — v0.6
- Projects page (`/projects`) with `ProjectCard` list
- `GET /api/projects` endpoint + `Project` Mongoose model
- React Router v6 — `/`, `/about`, `/projects` routes
- `StickyHeader` with Home/About/Projects nav links
- Seed entry: this website as first project
- Full EN/DE localisation for `description` field

### Completed — v0.7
- Site restructure: landing page simplified to Hero + Links; CV content moved to `/about`
- `StickyHeader` rework: always visible, avatar fades in on scroll, positioned between sidebars
- Sidebars: `w-[3%]` always visible (was fixed 33px, mobile-hidden)
- Fallback content on all pages for GitHub Pages (no backend)
- GitHub Pages CI deploy job; Vite `VITE_BASE` env var; `BrowserRouter` basename
- Server starts without MongoDB; `requireDb` middleware returns 503 immediately
- Dynamic `BASE_URL` for avatar and font assets
- 72 client tests, 31 server tests

### Future Phases
- Contact form with email delivery and rate limiting
- Project detail page (`/projects/:slug`)
- Dark mode
- Admin panel for editing profile/projects without touching `seed.ts`
- Analytics / visitor tracking
- SEO — meta tags, Open Graph, sitemap
- Error monitoring (Sentry)
- Lighthouse audit — performance/accessibility score
