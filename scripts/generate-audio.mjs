/**
 * Pre-generates the three comfort-audio clips with ElevenLabs into
 * public/audio/. Run it once before demo day so the app has stable local
 * files even if the API, quota, or network misbehaves during judging.
 *
 *   node scripts/generate-audio.mjs
 *
 * Requires ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID in .env.local.
 */
import fs from "node:fs";
import path from "node:path";

const SCRIPTS = {
  "friendly-checkin":
    "Hey, I'm checking in because I care about you getting home. Take your time, stay aware of your surroundings, and let me know when you are safely inside.",
  "comfort-call":
    "Hey, I'm here. I know your train is delayed, but you are not doing this alone. I'll stay with you while you wait, and you can check in when you are on your way.",
  "grounding-guide":
    "Take a slow breath in for four. Hold for four. Let it out for six. Notice one thing you can see, one thing you can hear, and one thing that helps you feel steady right now.",
};

const loadEnvFile = (file) => {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
};

loadEnvFile(path.resolve(process.cwd(), ".env.local"));
loadEnvFile(path.resolve(process.cwd(), ".env"));

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID;

if (!apiKey || !voiceId) {
  console.error(
    "Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID.\n" +
      "Add them to .env.local, or skip this step — the app falls back to the\n" +
      "browser's own speech synthesis so the demo still has a voice.",
  );
  process.exit(1);
}

const outDir = path.resolve(process.cwd(), "public/audio");
fs.mkdirSync(outDir, { recursive: true });

for (const [name, text] of Object.entries(SCRIPTS)) {
  process.stdout.write(`Generating ${name}.mp3 … `);

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.75,
          style: 0.25,
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!response.ok) {
    console.error(`failed (${response.status} ${await response.text()})`);
    process.exit(1);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(path.join(outDir, `${name}.mp3`), buffer);
  console.log(`${(buffer.length / 1024).toFixed(0)} KB`);
}

console.log("\nDone. The app will now serve these files when the API is unavailable.");
