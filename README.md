# Personal Presentation

![CI](https://github.com/rasstamann/personal_presentation/actions/workflows/ci.yml/badge.svg)

A portfolio website built as a professional business card targeting recruiters and hiring managers. Content is minimal by design — the point is the architecture: a real full-stack MERN stack where opening DevTools shows actual API calls to a live backend, not hardcoded data.

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Bun |
| Backend | Express 5 + TypeScript |
| Database | MongoDB via Mongoose 9 |
| Frontend | React 19 + Vite 8 + TypeScript |
| Styling | TailwindCSS v4 |
| Testing | Bun test runner |

## Project structure

```
personal_presentation/
├── client/          # React SPA (port 5173 in dev)
└── server/          # Express API (port 3001)
```

In dev, Vite proxies `/api/*` to the Express server. In production, a reverse proxy handles this — only `MONGODB_URI` needs to change for MongoDB Atlas.

## Running locally

**Prerequisites:** [Bun](https://bun.sh), [Docker](https://www.docker.com/products/docker-desktop/)

```bash
# Start MongoDB
docker start mongo-dev
# First time: docker run -d -p 27017:27017 --name mongo-dev mongo:8

# Server (terminal 1)
cd server
cp .env.example .env   # fill in MONGODB_URI etc.
bun run seed           # seed placeholder profile
bun run dev            # → http://localhost:3001

# Client (terminal 2)
cd client
bun run dev            # → http://localhost:5173
```

## Tests

```bash
cd server && bun test
cd client && bun test
```

## API

`GET /api/me` — returns the profile document (no `_id` or `__v`).
