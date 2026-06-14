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
- **Predict the bracket** (`/predict`) — an interactive prediction game: pick
  the top 2 of every group, choose 8 wildcard third-place teams, then click
  through every knockout round to crown a champion. Picks save in the browser.
- **Local time everywhere** — times are stored in UTC and converted client-side
  with the `Intl` API, so they're correct for every visitor automatically.
- **Live scores (real)** — `/api/matches` pulls real World Cup scores from
  ESPN's public feed (keyless, no signup), enriching every fixture with the
  score, status (`Upcoming` / `Live` / `Full time`) and live minute. The client
  polls every ~25s so scorelines and the minute update on their own, and a
  badge shows whether scores are **Live** or **Demo**.
- **Bilingual (Español / English)** — the UI auto-detects the visitor's browser
  language; **Spanish is the default** for non-English browsers. A manual
  **ES / EN** toggle lives in the navbar, the choice is remembered, and dates
  localize too. You can also deep-link a language with `?lang=es` / `?lang=en`.
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
  predict/page.tsx      # bracket prediction game
  api/matches/route.ts  # fixtures endpoint (GET /api/matches)
components/             # UI (MatchCard, Countdown, explorer, etc.)
lib/
  matches.ts            # the 104-match dataset (UTC kick-offs)
  teams.ts              # team -> flag mapping
  time.ts               # timezone / status / grouping helpers
  types.ts
```

### Live scores configuration

`app/api/matches/route.ts` merges live scores onto the schedule on every request.
The source is controlled by the optional `SCORES_MODE` env var:

- **(default, unset) — real scores from ESPN.** Fetches the FIFA World Cup
  scoreboard from ESPN's public API (`site.api.espn.com`, keyless, no signup),
  matches each game to the schedule by team pairing, and shows the real score,
  status and live minute. Falls back to the built-in engine if the feed errors.
- **`SCORES_MODE=simulate`** — built-in deterministic, time-based engine (demo).
- **`SCORES_MODE=off`** — schedule only, no scores.

The feed response is cached ~30s, and the matches page badge shows **Live** vs
**Demo** so simulated scores are never mistaken for real ones. To use a
different provider, implement a fetch in `lib/live.ts` returning the same
`{ status, score, minute }` shape — the rest of the app is unchanged.

## Sponsor

Proudly **powered by [Organisk LM](https://organisklm.com)**. Clickable sponsor
placements (all linking to organisklm.com) appear in the **navbar** (next to the
title), the **footer**, the **predictor title + champion banner**, and a
dedicated **"Organisk LM supports Ecuador"** banner on the Ecuador page. The logo
lives at `public/organisk-lm.svg` (an SVG recreation); drop in an official asset
there to swap it everywhere.

> Unofficial fan project. Schedule reflects the FIFA World Cup 2026 fixtures.
