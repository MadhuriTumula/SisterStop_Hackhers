# Comfort audio files

Drop three MP3s here to give the app a stable, offline-safe voice:

```
friendly-checkin.mp3
comfort-call.mp3
grounding-guide.mp3
```

Two ways to create them:

1. `node scripts/generate-audio.mjs` with `ELEVENLABS_API_KEY` and
   `ELEVENLABS_VOICE_ID` set in `.env.local`.
2. Generate them by hand in the ElevenLabs playground using the scripts in
   `src/lib/constants.ts` and save them with the exact filenames above.

If neither exists, nothing breaks: `/api/elevenlabs` returns the script text and
the app reads it aloud with the browser's built-in speech synthesis. The audio
ladder is ElevenLabs API → local MP3 → device voice.

These clips are comfort tools. Do not record or generate anything that imitates
police, emergency dispatch, MARTA staff, an employer, or a real person.
