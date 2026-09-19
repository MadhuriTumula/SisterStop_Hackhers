# SisterStop

> Your calm, connected ride home.

A privacy-conscious safety and well-being companion for riders commuting during
late-night and nontraditional hours in Atlanta — nurses leaving a late shift,
hospitality and retail staff, students, gig workers, and caregivers.

It does not claim to make transit safe. It gives riders a support layer around a
commute: an opt-in peer companion, bounded in-the-moment support, a voice when
the platform is too quiet, and official safety channels one tap from every
screen.

---

## 1. Run it

You need **Node 20 or newer** (`node -v` to check).

From this folder (the one containing `package.json`):

```bash
npm install            # ~15 seconds
npm run dev
```

Open **http://localhost:5174**.

That is the whole setup. **No API keys are required to run the app** — every
integration falls back to seeded data, so the full journey works offline on a
fresh clone. Add keys later when you want the real services (section 3).

### Try the demo path

```
/         → "Preview demo without an account"
/plan     → keep the seeded defaults → "Find my Virtual Buddies"
/buddies  → "Request match" on Maya
/match/…  → "Start a check-in" → "Open Calm Mode"
/calm     → pick "Uneasy" → "Get support" → play "Guided grounding"
/safety   → official options
/pulse    → Community Pulse dashboard
```

### Dark and light

The app ships both. It follows your OS setting by default — dark is the natural
default for a 10 PM platform — and the toggle in the header (sun / system /
moon) overrides that and persists. The light palette is selected, not inverted:
accents are re-stepped so they still clear contrast on white, and the charts
carry a separately validated palette per mode.

### Other commands

```bash
npm run build           # type-check + production build (run before deploying)
npm run preview         # serve the production build locally
npx tsc -b              # type-check only — fastest feedback while editing
npm run generate:audio  # pre-render the ElevenLabs MP3s (needs keys, see 3.3)
```

> **Note:** `npm run dev` also runs the `api/` serverless handlers, via
> `scripts/dev-api-plugin.ts`. You do **not** need `vercel dev`. Test an
> endpoint directly with `curl localhost:5174/api/health`.

---

## 2. Where the API keys go

**One file: `.env.local`, in this folder (the same folder as `package.json`).**

```bash
cp .env.example .env.local
```

Then open `.env.local` and paste your values after the `=` signs — no quotes, no
spaces:

```bash
GEMINI_API_KEY=AIzaSyC...your-actual-key
```

Three rules that matter:

1. **Restart `npm run dev` after every edit to `.env.local`.** Environment
   variables are read once at startup; the running server will not pick them up.
2. **`VITE_`-prefixed values are public.** They are compiled into the JavaScript
   every visitor downloads. That is fine for the Auth0 domain and client ID,
   which are designed to be public. **Never** add a `VITE_` prefix to a Gemini,
   ElevenLabs, or database value.
3. **`.env.local` is gitignored** and must stay that way. Never commit it.

### Check that a key took effect

The header of the running app shows one chip per integration reading **live** or
**demo**:

```
Auth0 · demo   Gemini · live   ElevenLabs · demo   Tiger Data · demo
```

Or from the terminal:

```bash
curl localhost:5174/api/health
# {"ok":true,"app":"SisterStop","integrations":{"gemini":true,...}}
```

Booleans only — the endpoint never returns key material.

---

## 3. Getting each key

All four are optional and independent. Add them in whatever order you like.

### 3.1 Auth0 — sign-in

**Already configured in this repo.** `.env.local` holds the tenant
`dev-ochnr05vkamnxj8r.us.auth0.com` and its SPA client ID, and the dev server is
pinned to `http://localhost:5174` to match that application's allowed URLs.
Sign-in should work as soon as you `npm run dev`. `.env.local` is gitignored, so
a teammate cloning the repo needs their own copy — the two Auth0 values are safe
to share directly (a SPA client ID is public by design).

To point the app at a **different** Auth0 tenant:

1. Create a free account at [auth0.com](https://auth0.com).
2. **Applications → Create Application** → name it `SisterStop` → choose
   **Single Page Web Application** → Create.
3. Open the **Settings** tab and copy **Domain** and **Client ID**.
4. Still in Settings, scroll to **Application URIs** and add
   `http://localhost:5174` to all three of these fields, then **Save Changes**
   (the port must match `server.port` in `vite.config.ts`):
   - Allowed Callback URLs
   - Allowed Logout URLs
   - Allowed Web Origins
5. In `.env.local`:

   ```bash
   VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
   VITE_AUTH0_CLIENT_ID=abc123...
   ```

   Leave `VITE_AUTH0_AUDIENCE` blank unless you have created an Auth0 API.

6. Restart the dev server. The button reads "Continue securely" and opens Auth0
   Universal Login; the sign-in prompt also offers "Create an account", which
   opens Universal Login on its signup screen.

**Without it:** a clearly labelled local demo session stands in, so `/profile`
and the save-a-match flow are still demonstrable.

### 3.2 Google Gemini — Calm Coach and call scripts

**Already configured in this repo** — `.env.local` holds a working key, and
`/calm` returns live replies. To use your own:

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey) and
   sign in with a Google account.
2. **Create API key**, then copy it.
3. In `.env.local`:

   ```bash
   GEMINI_API_KEY=AIzaSy...
   ```

4. Restart, open `/calm`, pick a feeling, press **Get support**.

Verify it is really calling Gemini — the response footer says "Structured
response from Google Gemini", and:

```bash
curl -s -X POST localhost:5174/api/gemini \
  -H 'content-type: application/json' \
  -d '{"stationZone":"North Avenue Station","route":"Red Line",
       "delayContext":"Train delayed by 15 minutes","feeling":"uneasy",
       "preference":"quiet_company"}' | grep source
# "source":"gemini"   ← was "fallback" before the key
```

**Without it:** built-in bounded support copy renders in the same layout.

### 3.3 ElevenLabs — comfort audio

**Already configured in this repo** — `.env.local` holds a working key and the
voice `EXAVITQu4vr4xnSDxMaL` (Sarah, a soft female voice). Press play on `/calm`
and you will hear it.

Two things that cost time if you swap in your own account:

- **Free plans cannot use library voices via the API.** Rachel
  (`21m00Tcm4TlvDq8ikWAM`) returns `402 paid_plan_required`; Sarah works. If
  audio silently falls back to the device voice, check for a 402 first.
- A key can be valid but scoped. This one has text-to-speech but not
  `voices_read`, so listing voices from the API returns 401 while speaking works
  fine.

To use your own account:

1. Create an account at [elevenlabs.io](https://elevenlabs.io).
2. **API key:** profile menu (bottom left) → **API Keys** → create → copy.
3. **Voice ID:** go to **Voices**, pick any voice, open it, and copy the voice
   ID (a string like `21m00Tcm4TlvDq8ikWAM`). A calm, warm voice suits the
   comfort scripts best.
4. In `.env.local`:

   ```bash
   ELEVENLABS_API_KEY=sk_...
   ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
   ```

5. Restart, open `/calm`, and press **Play** on any audio card.

**Recommended before a live demo** — pre-render the three clips so judging never
depends on the API, your quota, or the venue wifi:

```bash
npm run generate:audio
```

That writes `friendly-checkin.mp3`, `comfort-call.mp3`, and
`grounding-guide.mp3` into `public/audio/`.

**Without it:** the app serves the local MP3s if present, and otherwise reads
the same reviewed scripts aloud with the browser's built-in speech synthesis —
there is always a voice.

### 3.4 Tiger Data — Community Pulse

1. Create a service at [tigerdata.com](https://www.tigerdata.com/) (TimescaleDB,
   PostgreSQL-compatible).
2. Copy the **service URL / connection string**.
3. In `.env.local`:

   ```bash
   DATABASE_URL=postgres://tsdbadmin:password@host.tsdb.cloud.timescale.com:33333/tsdb?sslmode=require
   ```

4. Create the table, seed it, and add the continuous aggregate:

   ```bash
   psql "$DATABASE_URL" -f sql/001_schema.sql
   psql "$DATABASE_URL" -f sql/002_seed.sql
   psql "$DATABASE_URL" -f sql/003_tiger_timeseries.sql
   ```

   If `003` errors on your plan, skip it — `/api/community-pulse` uses a plain
   `time_bucket()` aggregate and the dashboard works either way.

5. Restart and open `/pulse`. The chip reads "Live from Tiger Data".

**Without it:** a deterministic demo series with the same shape as the live
query.

---

## 4. What it does

- **Virtual Buddies** — opt-in matching on route, station area, and departure
  window overlap. Aliases only; no live location, no rider map, no chat.
- **Calm Mode** — a breathing orb (inhale 4 / hold 4 / exhale 6), a 5-4-3-2-1
  grounding exercise, and a Gemini-powered Calm Coach returning one support
  message, one grounding step, and one suggested in-app action.
- **Comfort audio** — a live companion call whose words Gemini writes for your
  trip and ElevenLabs speaks, plus three hand-written clips: a friendly
  check-in, a call-style comfort clip, and a guided grounding exercise.
- **Safety Hub** — 911, MARTA Police call and text, MARTA's own reporting app,
  988, and a trip check-in for a trusted contact.
- **Community Pulse** — anonymous, aggregate, time-bucketed check-ins in Tiger
  Data, so partners can see *when* riders need support without seeing *who*.
- **Dark and light themes** — system-following by default, with a persistent
  override in the header.

### What Gemini and ElevenLabs actually do

They are not two separate demos. Gemini writes; ElevenLabs speaks.

```
Your trip (route, station area, departure window, how you feel)
        │
        ▼
  Gemini  ──────────────┬──────────────────────────────┐
        │               │                              │
  Calm Coach card   Companion call line          (structured JSON)
  — text you read   — words for this trip
        │               │
        ▼               ▼
   "Read aloud"    Guardrail check  ──► rejected ──► reviewed script
        │               │
        └───────┬───────┘
                ▼
          ElevenLabs — speaks it back to you
                │
       no key / offline ──► pre-rendered MP3 ──► device voice
```

**Gemini** does two jobs:

1. **Calm Coach** (`/calm`) — you say how the wait is going; it returns
   schema-constrained JSON the UI renders as a support message, one grounding
   step, one suggested action, and a safety notice.
2. **Companion call script** — it writes the actual words for a comfort call,
   using tonight's route, station area, and departure window, so the call sounds
   like a friend who knows where you are.

**ElevenLabs** gives all of that a voice:

- **Live companion call** — speaks the line Gemini just wrote, with the
  transcript shown on screen.
- **Read aloud** — speaks the Calm Coach reply, for when reading is too much.
- **Three ready-made clips** — a friendly check-in, a comfort call, and a guided
  grounding exercise, hand-written and always available.

**The guardrail between them is the point.** A model is writing words that get
spoken aloud to someone who may be frightened, so the boundary cannot live in
the prompt — a prompt is a request, not a constraint. Every generated line is
re-checked on the server by `src/lib/audioGuard.ts` immediately before
text-to-speech, and a failing line is never repaired, only discarded in favour
of a reviewed script:

| Line | Result |
| --- | --- |
| "This is Officer Daniels with MARTA Police…" | rejected — impersonates emergency services |
| "I already called 911, help is on the way." | rejected — impersonates emergency services |
| "I'm here with you, you are safe now." | rejected — guarantees safety |
| "Hey, I'm here. I'll stay on the line until you're inside." | spoken |

**Built with:** React · TypeScript · Vite · Tailwind CSS v4 · Auth0 ·
Google Gemini · ElevenLabs · Tiger Data / PostgreSQL · Recharts · Vercel

### How the integrations degrade

| Integration | With a key | Without a key |
| --- | --- | --- |
| Auth0 | Universal Login, protected profile | Labelled local demo session |
| Gemini | Schema-constrained JSON response | Built-in bounded support copy |
| ElevenLabs | Generated speech | Local MP3, then browser speech synthesis |
| Tiger Data | Live 30-minute aggregates | Deterministic demo series |

**Emergency escalation is never the model's decision.** A deterministic keyword
rule in `src/lib/safety.ts` runs before and after every Gemini call and forces
the call-911 state on its own, with or without an API key.

---

## 5. Troubleshooting

| Symptom | Fix |
| --- | --- |
| Chip still says "demo" after adding a key | Restart `npm run dev`. Env vars load at startup. |
| `Callback URL mismatch` from Auth0 | Add `http://localhost:5174` (no trailing slash) to Allowed Callback URLs, Logout URLs, **and** Web Origins, then Save. |
| Port 5174 already in use | Free it — `lsof -ti:5174 \| xargs kill`. The port is pinned (`strictPort`) because Auth0 only accepts `http://localhost:5174`. |
| Audio is silent | Press Play again — browsers block audio before a click. If you have no ElevenLabs key and no MP3s, the fallback uses your OS speech voices. |
| Gemini returns `"source":"fallback"` | Key is missing, misspelled, or the dev server was not restarted. Check for a stray `VITE_` prefix. |
| `/pulse` shows "Demo data" | `DATABASE_URL` unset or unreachable, or `sql/001` + `002` not run yet. |
| Build fails after editing styles | Tailwind v4 cannot `@apply` a custom class — comma-group selectors in `src/index.css` instead. |
| Companion call speaks a generic line | Gemini returned something the guardrail rejected, so the reviewed script was spoken instead. The reason is logged server-side. |
| ElevenLabs falls back to the device voice | Check the server log for `402 paid_plan_required` (library voice on a free plan) or a missing `ELEVENLABS_VOICE_ID`. |
| A color ignores the theme switch | It is a hardcoded hex. Use a token (`bg-surface`, `text-muted`, …) defined in `src/index.css`. |

---

## 6. Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Or import the GitHub repo at [vercel.com/new](https://vercel.com/new) (framework
preset: **Vite** — it is detected automatically).

Then:

1. **Project Settings → Environment Variables**: add the same names as
   `.env.local`, one at a time. Do **not** upload the file, and do not rename
   anything — `GEMINI_API_KEY` stays `GEMINI_API_KEY`.
2. **Redeploy** after adding variables. Vercel does not apply them to an
   existing build.
3. Add your production URL (`https://your-app.vercel.app`) to the same three
   Auth0 fields as in step 3.1, alongside the localhost entries.
4. If you win a `.tech` domain, add it in Vercel → Domains, then add it to Auth0
   as well.

Live demo: _add your URL here_

---

## 7. Project structure

```
CLAUDE.md   Agent guide: commands, architecture, safety rules, repo gotchas
AGENTS.md   Product definition, users, safety principles, UI vocabulary
api/        Serverless handlers (Gemini, ElevenLabs, matching, pulse, health)
docs/       Product, safety, sponsor, demo, and submission context
  screenshots/  Captured from the running app, for the deck and Devpost
sql/        Tiger Data schema, seed, and continuous aggregate
scripts/    Dev-server API bridge + ElevenLabs audio generator
src/        React app — components, pages, hooks, lib, seed data, types
```

Agent instructions live in Markdown: `AGENTS.md`, `CLAUDE.md`, and
directory-scoped `src/CLAUDE.md` and `api/CLAUDE.md`. The `.cursor/rules/*.mdc`
files point at the same documents so Cursor and Claude Code stay in sync.

---

## 8. Safety disclaimer

SisterStop is a hackathon prototype for peer support and well-being. It does not
replace 911, MARTA Police, or official transit safety services. It does not
guarantee safety, and it cannot contact emergency services on anyone's behalf.

The MARTA Police phone and text numbers in `src/lib/constants.ts` come from
MARTA's published safety page — re-verify them before any live demo.

**Privacy approach:** matching uses route, station zone, and a 15-minute window
— never live GPS. Aliases only, destination stays a broad zone, leave/block/
report on every match screen, and the Community Pulse dashboard is
aggregate-only by construction.
