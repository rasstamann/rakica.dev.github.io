# CLAUDE.md

We're building the app described in @SPEC.MD. Read that file for architecture decisions, the data model, API contracts, and component structure.

Keep replies concise — key information only, no fluff. Caveman mode is active by default in this project — terse, fragment-style responses are preferred. Use `/caveman lite|full|ultra` to adjust intensity, or `stop caveman` to disable.

Whenever working with any third-party library, look up the official documentation to ensure you're using up-to-date APIs. Use the `mcp__context7__resolve-library-id` and `mcp__context7__query-docs` tools for documentation lookup.

This site is built to demonstrate full-stack and agentic engineering skills to recruiters. Code quality, architecture clarity, and real backend behaviour matter — not just working UI.

## Project Structure

```
personal_presentation/
├── CLAUDE.md
├── SPEC.MD
├── docs/ideas/personal-website.md
├── client/          # React + Vite + TypeScript
└── server/          # Express + Bun + TypeScript + Mongoose
```

## Commands

**Server** (`cd server`):
- **Dev:** `bun run dev` (port 3001, hot reload via `--watch`)
- **Seed DB:** `bun run seed`
- **Install dep:** `bun add <package>` / `bun add -d <package>`

**Client** (`cd client`):
- **Dev:** `bun run dev` (port 5173)
- **Build:** `bun run build`
- **Preview:** `bun run preview`
- **Install dep:** `bun add <package>` / `bun add -d <package>`

## Key Conventions

- TypeScript throughout — no `any`
- Vite proxy forwards `/api/*` to `http://localhost:3001` in dev
- TailwindCSS v4 via PostCSS
- Mongoose `.select('-_id -__v')` on all API responses
- Environment variables in `server/.env` (copy from `server/.env.example`)
- Required vars: `MONGODB_URI`, `PORT` (default 3001), `ALLOWED_ORIGIN` (default `http://localhost:5173`)

## Agent Skills & Subagents

This project uses [agent-skills](https://github.com/addyosmani/agent-skills) — a set of production-grade engineering workflows mapped to the development lifecycle. **Subagent and skill use is strongly encouraged throughout this project.**

Use the appropriate slash command before starting any non-trivial work:

| Command | When to use |
|---------|-------------|
| `/spec` | Before building anything new — define what and why |
| `/plan` | Break work into small, verifiable tasks |
| `/build` | Implement incrementally, one slice at a time |
| `/test` | Prove behaviour works — failing test first |
| `/review` | Before any commit — five-axis quality check |
| `/code-simplify` | After implementation — reduce complexity |
| `/ship` | Before deploying to production |

Skills also activate automatically based on context — designing an API engages `api-and-interface-design`, building UI triggers `frontend-ui-engineering`, etc.

**Specialist subagents** — launch these via the `Agent` tool for targeted reviews:
- `code-reviewer` — staff-engineer-level review across correctness, readability, architecture, security, performance
- `test-engineer` — test strategy, coverage analysis, TDD guidance
- `security-auditor` — OWASP assessment, input validation, threat modelling

Prefer launching subagents in parallel when tasks are independent. Use the `Explore` subagent for open-ended codebase research rather than manual grepping.

## User-Authored Content — DO NOT MODIFY OR PARAPHRASE IN CAVEMAN SPEAK

When displaying, quoting, or discussing user-authored content, always reproduce it verbatim in standard prose — never rephrase it in caveman style. Caveman mode applies only to Claude's own commentary, not to content authored by the user.

When writing to or editing `SPEC.MD`, always use standard professional prose — never caveman style. The spec is a shared technical document, not a conversation.

## User-Authored Content — DO NOT MODIFY

The following fields in `seed.ts` and in the MongoDB `profiles` collection are personal content written by the user. **Never change, reword, replace, or invent values for them without explicit instruction:**

- `tagline` (en + de)
- `summary` (en + de)
- `experience[].role`, `experience[].bullets` (en + de)
- `education[].degree`, `education[].field` (en + de)
- `name`, `links`, `skills`

This applies equally to the seed file and to any direct database operation. When a structural change is needed (e.g. adding a new locale), preserve all existing text exactly and ask the user to supply the missing translation — do not invent one.

## Workflow

- Run `bun run build` (client) and check for TypeScript errors after changes
- Run `bun test` in both `client/` and `server/` before every push to main — all tests must pass
- Do not auto-commit; propose to the user first
- Work on `main`; no feature branches unless requested
- Use the spec as the single source of truth for data shapes and API contracts

## Plans and Tasks

- Save all plans and task breakdowns to `tasks/` (e.g. `tasks/plan.md`, `tasks/todo.md`)
- Never commit anything in `tasks/` unless explicitly told to do so

## Environment

Copy `server/.env.example` to `server/.env` and fill in:
- `MONGODB_URI` — local: `mongodb://localhost:27017/personal_presentation`
- `PORT` — `3001`
- `ALLOWED_ORIGIN` — `http://localhost:5173`
