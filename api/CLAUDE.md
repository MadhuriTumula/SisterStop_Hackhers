# API rules (api/)

Vercel serverless handlers. `scripts/dev-api-plugin.ts` runs these same files on
the Vite dev server, so anything added here must work in both.

## Every handler

1. Validates its inputs and rejects unknown shapes.
2. Has a typed request/response contract documented in `docs/API_CONTRACTS.md`.
3. **Returns HTTP 200 with deterministic fallback data when its key is absent.**
   A missing key is a normal state, not an error state.
4. Logs failures server-side and returns user-safe copy — never a stack trace,
   provider error body, or key fragment.

## Secrets

Server-only: `GEMINI_API_KEY`, `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`,
`DATABASE_URL`. **Never** prefix any of them with `VITE_` — that ships the
secret to every visitor. `api/health.ts` reports booleans only.

## Per integration

**Gemini** (`gemini.ts`) — structured JSON via `responseSchema`, re-validated
with Zod on the client. Models are tried in order (`GEMINI_MODEL` override
first) because names get retired and busy models return 503. Keep
`thinkingLevel: LOW` and a generous `maxOutputTokens`: 3.x models spend output
budget on thought, and a truncated reply fails `JSON.parse` and silently
degrades to fallback copy. Keep outputs short and UI-ready. The model suggests an
action; the app executes it. `detectsUrgentLanguage` from `src/lib/safety.ts`
runs *before* the call (short-circuits to the urgent response) and *after* it
(escalates the model's reply). Do not let a prompt own that decision, and do not
send more rider context than the feature needs.

**ElevenLabs** (`elevenlabs.ts`) — only the three reviewed scripts in
`AUDIO_SCRIPTS`; never synthesize arbitrary user text. Falls back to a local MP3
path. Never frame audio as police, dispatch, or official transit communication.

**Tiger Data** (`community-pulse.ts`) — anonymous events only, always bucketed
by `time_bucket()`. No query may return anything that identifies a rider, a
destination, or a precise location.

**buddy-match** — imports `rankBuddies` from `src/lib/matching.ts` so client and
server rank identically. Keep it a pure function of route, station zone,
departure-window overlap, and stated preferences.
