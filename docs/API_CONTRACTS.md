# API Contracts

All sponsor secrets stay server-side in `api/`. Every endpoint returns HTTP 200
with a deterministic fallback when a key is missing, so the demo never breaks.

## POST /api/gemini
Calm Coach. Structured JSON response rendered directly by the UI.

Request:
```json
{
  "stationZone": "North Avenue Station",
  "route": "Red Line",
  "delayContext": "Train delayed by 15 minutes",
  "feeling": "uneasy",
  "preference": "quiet_company",
  "note": "optional short free-text from the rider"
}
```

Response:
```json
{
  "supportMessage": "string",
  "groundingPrompt": "string",
  "suggestedAction": "start_breathing | play_audio | open_safety_hub | request_checkin",
  "urgency": "routine | urgent",
  "safetyNotice": "string",
  "source": "gemini | fallback"
}
```

Rules:
- Validated with Zod on the client; invalid shapes degrade to the fallback copy.
- `urgency: "urgent"` always renders the call-911 escalation card.
- The model never executes an action; the app decides what the suggestion does.

## POST /api/elevenlabs
Comfort audio. Two response modes.

Request — either a reviewed script:
```json
{ "audioType": "friendly_checkin | comfort_call | grounding_guide" }
```

…or a line written elsewhere (today: `/api/companion-script`):
```json
{ "text": "Hey, I'm here. I'll stay on the line until you're inside." }
```

`text` is re-validated by `checkSpokenLine` here regardless of who sent it, so
the guarantee does not depend on the caller. A failing line returns **422** with
a `reason` and is never spoken.

Response A (key configured): `Content-Type: audio/mpeg` binary body.
Response B (no key / error):
```json
{ "source": "fallback", "audioUrl": "/audio/friendly-checkin.mp3", "text": "script text" }
```

The client plays the blob, then the local MP3, then browser speech synthesis —
so a voice is always available during judging.

## POST /api/companion-script
Gemini writes the spoken line for a live companion call.

Request:
```json
{
  "route": "Red Line",
  "stationZone": "North Avenue Station",
  "departureWindow": "10:15–10:30 PM",
  "feeling": "quiet_company"
}
```

Response:
```json
{ "text": "Hey, I see you just made it over to North Avenue Station…",
  "source": "gemini | reviewed-script", "model": "gemini-3.8-flash",
  "rejected": "impersonates emergency services" }
```

The model writes as a friend, never as an official. `checkSpokenLine` validates
the result; a rejected line is replaced by the reviewed `comfort_call` script
and the reason is returned for logging (never shown to the rider).

## POST /api/buddy-match
Server-side mirror of the matching logic, used to prove matching is not purely
cosmetic. Accepts a `TripRequest`, returns scored, privacy-safe buddy cards.

```json
{ "matches": [{ "buddy": { }, "score": 90, "reasons": ["Same route"] }], "source": "seed" }
```

## GET /api/community-pulse
Anonymous aggregate time-series for the Community Pulse dashboard.

```json
{
  "data": [{ "time": "10:00 PM", "route": "Red Line", "requests": 19, "mood": 2.6 }],
  "bySupportType": [{ "supportType": "buddy_match", "count": 42 }],
  "source": "tiger-data | fallback"
}
```

## GET /api/health
Reports which integrations are configured. Booleans only — never key values.

```json
{ "ok": true, "integrations": { "gemini": false, "elevenlabs": false, "tigerData": false } }
```
