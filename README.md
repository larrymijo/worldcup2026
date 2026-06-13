# World Cup 2026 · Match Center ⚽

A polished web app that shows the **complete FIFA World Cup 2026 schedule** (all
104 matches across the USA, Canada & Mexico) with every kick-off **automatically
converted to the visitor's local timezone**, plus a dedicated **Ecuador 🇪🇨**
tracker with a live countdown to the next match.

## Features

- **All matches** (`/`) — full fixture list grouped by day in *your* local time,
  with search (team / city / stadium) and filters by stage and group.
- **Ecuador** (`/ecuador`) — La Tri's Group E fixtures, a live countdown to the
  next match, and the group at a glance.
- **Local time everywhere** — times are stored in UTC and converted client-side
  with the `Intl` API, so they're correct for every visitor automatically.
- **Live status** — matches show `Upcoming` / `Live` / `Full time` based on the
  current time.
- Responsive, dark, glassmorphic UI with country flags.

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- Data served from a **Route Handler** at `/api/matches`
- Flags via [flagcdn.com](https://flagcdn.com); fonts via `next/font`

Chosen for a zero-config, first-class deployment on **Vercel**.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm start        # run the production build
```

## Deploy to Vercel

This is a stock Next.js app, so deployment needs no extra configuration:

1. Push this folder to a Git repository (GitHub/GitLab/Bitbucket).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Next.js — just click **Deploy**.

No environment variables are required.

## Project structure

```
app/
  layout.tsx            # shell: fonts, metadata, navbar, footer
  page.tsx              # home (hero + match explorer)
  ecuador/page.tsx      # Ecuador page
  api/matches/route.ts  # fixtures endpoint (GET /api/matches)
components/             # UI (MatchCard, Countdown, explorer, etc.)
lib/
  matches.ts            # the 104-match dataset (UTC kick-offs)
  teams.ts              # team -> flag mapping
  time.ts               # timezone / status / grouping helpers
  types.ts
```

### Updating the data / going live

`app/api/matches/route.ts` currently returns the curated dataset in
`lib/matches.ts`. To wire in a live data feed (scores, knockout teams), replace
the body of `GET` with a `fetch` to your sports-data provider and map it onto the
`Match` type — the rest of the app keeps working unchanged.

> Unofficial fan project. Schedule reflects the FIFA World Cup 2026 fixtures.
