import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkSpokenLine } from "../src/lib/audioGuard";

/**
 * Comfort audio. Two ways in:
 *
 * 1. `audioType` — one of the three fixed, reviewed scripts below.
 * 2. `text` — a line written elsewhere (today: Gemini, via
 *    /api/companion-script). Every such line is re-checked here by
 *    checkSpokenLine before it is spoken, so the guarantee holds no matter who
 *    called this endpoint or what they sent.
 *
 * Either way the audio never impersonates police, dispatch, MARTA, an
 * employer, or a real person.
 */

export const AUDIO_SCRIPTS: Record<string, string> = {
  friendly_checkin:
    "Hey, I'm checking in because I care about you getting home. Take your time, stay aware of your surroundings, and let me know when you are safely inside.",
  comfort_call:
    "Hey, I'm here. I know your train is delayed, but you are not doing this alone. I'll stay with you while you wait, and you can check in when you are on your way.",
  grounding_guide:
    "Take a slow breath in for four. Hold for four. Let it out for six. Notice one thing you can see, one thing you can hear, and one thing that helps you feel steady right now.",
};

const FALLBACK_FILES: Record<string, string> = {
  friendly_checkin: "/audio/friendly-checkin.mp3",
  comfort_call: "/audio/comfort-call.mp3",
  grounding_guide: "/audio/grounding-guide.mp3",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = (req.body as { audioType?: string; text?: string }) ?? {};
  const audioType = body.audioType ?? "";

  // A caller-supplied line is only spoken if it passes the guardrail.
  let text: string | undefined;
  if (body.text) {
    const verdict = checkSpokenLine(body.text);
    if (!verdict.ok) {
      console.warn(`elevenlabs refused a line (${verdict.reason})`);
      return res.status(422).json({ error: "Line rejected", reason: verdict.reason });
    }
    text = body.text.trim();
  } else {
    text = AUDIO_SCRIPTS[audioType];
  }

  if (!text) {
    return res.status(400).json({ error: "Provide a valid audioType or text" });
  }

  const fallback = {
    source: "fallback" as const,
    // Generated lines have no pre-rendered file; the client speaks the text.
    audioUrl: FALLBACK_FILES[audioType],
    text,
  };

  if (!process.env.ELEVENLABS_API_KEY || !process.env.ELEVENLABS_VOICE_ID) {
    return res.status(200).json(fallback);
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
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
      throw new Error(`ElevenLabs generation failed: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Audio-Source", "elevenlabs");
    return res.status(200).send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error("ElevenLabs error", error);
    return res.status(200).json(fallback);
  }
}
