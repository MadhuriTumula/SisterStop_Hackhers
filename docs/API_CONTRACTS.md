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

Request:
```json
{ "audioType": "friendly_checkin | comfort_call | grounding_guide" }
```

Response A (key configured): `Content-Type: audio/mpeg` binary body.
Response B (no key / error):
```json
{ "source": "fallback", "audioUrl": "/audio/friendly-checkin.mp3", "text": "script text" }
```

The client plays the blob, then the local MP3, then browser speech synthesis —
so a voice is always available during judging.

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
