# MARTA MATE — Claude Code project guide

Privacy-conscious safety and well-being companion for riders commuting during
late-night and nontraditional hours in Atlanta. Hackathon MVP (DevelopHER track
plus Gemini, ElevenLabs, Auth0, Tiger Data, .Tech).

**Read `AGENTS.md` first** — it holds the product definition, the users, the
non-negotiable safety principles, and the approved UI vocabulary. This file adds
what Claude needs to *work in the repo*; it does not repeat AGENTS.md.

Directory-scoped guides load automatically when you touch those files:
`src/CLAUDE.md` (frontend) · `api/CLAUDE.md` (integrations & secrets).

## Commands

```bash
npm run dev             # Vite + the api/ handlers (see "Dev API bridge" below)
npm run build           # tsc -b && vite build — run after any significant change
npx tsc -b              # type-check only, faster feedback loop
npm run generate:audio  # pre-render the three ElevenLabs MP3s into public/audio
```

## Architecture

```
api/        Vercel serverless handlers. Every one returns HTTP 200 with seeded
            fallback data when its key is missing — the demo must never break.
src/pages/  One file per route: / /plan /buddies /match/:buddyId /calm /safety
            /pulse /profile
src/hooks/  useTripSession (trip + match state), useSession (Auth0 or labelled
            local fallback), useBuddyMatching, useCalmCoach, useAudioTool
src/lib/    matching.ts (scoring), safety.ts (escalation rule), gemini.ts (Zod
            contract), audio.ts (playback ladder), constants.ts (all UI copy)
src/index.css  Theme tokens for both modes + the shared component classes
src/data/   Seeded riders, routes, stations, contacts, pulse series
sql/        Tiger Data hypertable, seed, continuous aggregate
docs/       Product, safety, sponsor, demo, and submission context
```

**Theming.** `--mm-*` custom properties are declared per theme in
`src/index.css` and re-exported through `@theme inline` so Tailwind utilities
emit `var(--mm-*)` and repaint on a theme swap. `useTheme` owns the preference
(system by default, persisted once set); the inline script in `index.html`
applies it before first paint. **Never hardcode a hex in a component** — it will
not follow the theme. Light is a selected palette with re-stepped accents, not
an inversion.

**Dev API bridge.** `vite dev` does not run Vercel functions, so
`scripts/dev-api-plugin.ts` mounts the same handlers on the dev server and
pushes non-`VITE_` env vars into `process.env`. Local and deployed behaviour
match; test endpoints with `curl localhost:5174/api/<name>`.

## The rules that matter most here

1. **Emergency escalation is never a model decision.** `detectsUrgentLanguage`
   in `src/lib/safety.ts` runs before and after every Gemini call and forces the
   call-911 state on its own. Do not move that logic into a prompt.
2. **Every integration degrades.** No key → seeded data, still a complete
   journey. Audio ladders ElevenLabs → local MP3 → browser speech synthesis.
3. **Never expose live location, addresses, phone numbers, or legal names**
   between riders. Matching is route + station zone + departure window only.
4. **Leave, block, and report stay visible** on every peer-match screen.
5. **Comfort audio is comfort audio.** Never police, dispatch, MARTA staff, an
   employer, or a real person — in code, copy, or filenames.

Before changing safety features or copy, read `docs/SAFETY_POLICY.md`.

## Delivery rules (hackathon mode)

Every change should answer: is it visible in a 90-second demo, does it
strengthen a sponsor track, can it fail safely, and does it risk the working
MVP? Preserve working screens, run `npm run build` after significant changes,
and keep `README.md` and `docs/SUBMISSION_CHECKLIST.md` honest — never claim an
integration the code does not have.

## Gotchas found the hard way

- **Do not gate content on a JS animation.** Framer Motion `initial={{opacity:0}}`
  left buddy cards invisible when rAF was throttled. Content reveals use the
  `.animate-fade-up` CSS class (ends visible even with animations disabled);
  reserve Framer Motion for modals and the breathing orb.
- **Recharts needs `isAnimationActive={false}`** for series that must render in
  a screenshot, and its `position="right"` label did not draw — the bar values
  use a custom `content` renderer instead.
- **Tailwind v4:** `@apply` cannot reference a custom class. Comma-group the
  selectors in `src/index.css` instead of `@apply btn`.
- **Tailwind v4 `@theme inline`** is required when a token's value is another
  custom property; a plain `@theme` would freeze the value at build time. Note
  that `inline` tokens are not emitted at `:root`, so arbitrary values like
  `rounded-[var(--radius-card)]` need a non-inline `@theme` block (or the
  generated `rounded-card` utility).
- **Recharts clones label elements with the series' own props**, so a `fill`
  prop on a custom `LabelList` content component gets overwritten by the bar
  color. Pass it under a different name (`labelFill`) — values must wear text
  tokens, never the series color.
- **Headless Chrome clamps window width** to roughly 500px, so a `--window-size=390`
  screenshot looks clipped when the layout is fine. Verify mobile at 500px
  (still below the `sm` breakpoint).

## Screenshots

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=old --disable-gpu --hide-scrollbars --window-size=1280,1500 \
  --virtual-time-budget=6000 --screenshot=docs/screenshots/01-landing.png \
  http://localhost:5174/
```

Headless Chrome reports a light OS preference, so that captures light mode. Add
`--blink-settings=preferredColorScheme=0` for dark.
