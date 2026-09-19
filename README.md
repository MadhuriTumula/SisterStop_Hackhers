# MARTA MATE

> Your calm, connected ride home.

MARTA MATE is a privacy-conscious safety and well-being companion for riders
commuting during late-night and nontraditional work hours in Atlanta — nurses
leaving a late shift, hospitality and retail staff, students, gig workers, and
caregivers.

It does not claim to make transit safe. It gives riders a support layer around a
commute: an opt-in peer companion, bounded in-the-moment support, a voice when
the platform is too quiet, and official safety channels one tap from every
screen.

## What it does

- **Virtual Buddies** — opt-in matching on route, station area, and departure
  window overlap. Aliases only; no live location, no rider map, no chat.
- **Calm Mode** — a breathing orb (inhale 4 / hold 4 / exhale 6), a 5-4-3-2-1
  grounding exercise, and a Gemini-powered Calm Coach that returns one support
  message, one grounding step, and one suggested in-app action.
- **Comfort audio** — three clearly labelled ElevenLabs clips: a friendly
  check-in, a call-style comfort clip, and a guided grounding exercise.
- **Safety Hub** — 911, MARTA Police call and text, MARTA's own reporting app,
  988, and a trip check-in for a trusted contact.
- **Community Pulse** — anonymous, aggregate, time-bucketed check-ins stored in
  Tiger Data, so partners can see *when* riders need support without seeing
  *who*.

## Built with

React · TypeScript · Vite · Tailwind CSS v4 · Auth0 · Google Gemini ·
ElevenLabs · Tiger Data / PostgreSQL · Recharts · Framer Motion · Vercel

## Local setup

```bash
npm install
cp .env.example .env.local   # optional — the app runs without any keys
npm run dev
```

Open http://localhost:5173. `npm run dev` also serves the `api/` handlers, so
the Gemini, ElevenLabs, matching, and pulse endpoints behave exactly as they do
on Vercel.

```bash
npm run build          # type-check + production build
npm run generate:audio # optional: pre-render the ElevenLabs MP3s
```

## Environment variables

See `.env.example`. Only `VITE_`-prefixed values reach the browser:

| Variable | Scope | Purpose |
| --- | --- | --- |
| `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID` | client | Auth0 Universal Login |
| `GEMINI_API_KEY` | **server only** | Calm Coach |
| `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID` | **server only** | Comfort audio |
| `DATABASE_URL` | **server only** | Tiger Data / Postgres |

Never create `VITE_GEMINI_API_KEY` or `VITE_ELEVENLABS_API_KEY` — that would
ship the secret to every visitor.

## It runs with zero keys

Every integration degrades instead of failing, which is why the demo is safe to
give live:

| Integration | With a key | Without a key |
| --- | --- | --- |
| Auth0 | Universal Login, protected profile | Clearly labelled local demo session |
| Gemini | Schema-constrained JSON response | Built-in bounded support copy |
| ElevenLabs | Generated speech | Local MP3, then browser speech synthesis |
| Tiger Data | Live 30-minute aggregates | Deterministic demo series of the same shape |

The header shows a `live` / `demo` chip per integration, so nothing is
overstated during judging.

## Sponsor integrations

### Google Gemini — `api/gemini.ts`
Calm Coach sends a privacy-conscious context (station area, route, what is
happening, selected feeling) and requests a JSON schema back:
`supportMessage`, `groundingPrompt`, `suggestedAction`, `urgency`,
`safetyNotice`. The client re-validates with Zod before rendering. **The model
never takes an action, and it never decides what counts as an emergency**: a
deterministic keyword rule in `src/lib/safety.ts` runs before and after the
call, and escalates to the call-911 state on its own.

### ElevenLabs — `api/elevenlabs.ts`
Three fixed, reviewed scripts — the endpoint never speaks arbitrary user text.
Audio is labelled comfort audio throughout and never imitates police, dispatch,
transit staff, an employer, or a real person. Nothing autoplays.

### Auth0 — `src/main.tsx`, `src/hooks/useSession.tsx`
Universal Login with a protected profile route. The authenticated identity and
the public alias other riders see are deliberately separate, and the app never
renders a raw token. A "Preview demo" path lets a judge explore without
creating an account.

### Tiger Data — `sql/`, `api/community-pulse.ts`
`community_checkins` is a hypertable of anonymous events (route, station zone,
support type, 1–5 mood, timestamp). A continuous aggregate pre-computes
30-minute buckets for the dashboard.

```bash
psql "$DATABASE_URL" -f sql/001_schema.sql
psql "$DATABASE_URL" -f sql/002_seed.sql
psql "$DATABASE_URL" -f sql/003_tiger_timeseries.sql
```

## Deployment (Vercel)

1. Push to GitHub and import the repo in Vercel (framework preset: **Vite**).
2. Add the environment variables above in Project Settings.
3. Deploy, then add the production URL to Auth0's Allowed Callback URLs,
   Allowed Logout URLs, and Allowed Web Origins.
4. Redeploy after changing environment variables.

Live demo: _add your Vercel or .tech URL here_

## Safety disclaimer

MARTA MATE is a hackathon prototype for peer support and well-being. It does not
replace 911, MARTA Police, or official transit safety services. It does not
guarantee safety, and it cannot contact emergency services on anyone's behalf.

The MARTA Police phone and text numbers in `src/lib/constants.ts` come from
MARTA's published safety page — re-verify them before any live demo.

## Privacy approach

- Matching uses route, station zone, and a 15-minute window — never live GPS.
- Aliases only; no legal names, phone numbers, or addresses between riders.
- Destination stays a broad zone.
- Leave, block, and report are visible on every match screen.
- Trip check-ins share route, station area, and an arrival window — nothing more.
- The Community Pulse dashboard is aggregate-only by construction.

## Project structure

```
api/        Vercel serverless handlers (Gemini, ElevenLabs, matching, pulse, health)
docs/       Product, safety, sponsor, demo, and submission context
sql/        Tiger Data schema, seed, and continuous aggregate
scripts/    Dev-server API bridge + ElevenLabs audio generator
src/        React app — components, pages, hooks, lib, seed data, types
```

Start with `AGENTS.md` and `docs/SAFETY_POLICY.md` before changing anything that
touches safety language or matching privacy.
