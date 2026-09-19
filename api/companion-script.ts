import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkSpokenLine, MAX_SPOKEN_CHARS } from "../src/lib/audioGuard";
import { AUDIO_SCRIPTS } from "./elevenlabs";

/**
 * Writes the words for a live companion call: Gemini composes a short line for
 * this specific trip, which ElevenLabs then speaks.
 *
 * The model writes as a friend who knows the rider is travelling — never as
 * police, dispatch, transit staff, or anyone who can send help. That boundary
 * is enforced after generation by checkSpokenLine, not by the prompt.
 */

const MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-3.8-flash",
  "gemini-3.6-flash",
].filter((model): model is string => Boolean(model));

const responseSchema = {
  type: "object",
  properties: { line: { type: "string" } },
  required: ["line"],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { route, stationZone, departureWindow, feeling } =
    (req.body as Record<string, string | undefined>) ?? {};

  const reviewedFallback = {
    text: AUDIO_SCRIPTS.comfort_call,
    source: "reviewed-script" as const,
  };

  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json(reviewedFallback);
  }

  const prompt = `
Write one short spoken line for a comfort call in a transit companion app.

You are a warm, familiar friend who knows this person is on their way home and
is staying on the line with them. Speak directly to them, out loud.

Their trip:
- Route: ${route || "not shared"}
- Station area: ${stationZone || "not shared"}
- Departure window: ${departureWindow || "not shared"}
- How they feel: ${feeling || "not shared"}

Hard rules:
- You are a friend. Never a police officer, dispatcher, security guard, transit
  employee, or any official. Never mention police, 911, MARTA, or security.
- Never say you have called, contacted, or alerted anyone.
- Never promise safety or say help is coming.
- Do not use their name, and do not invent one.
- Two or three sentences, under ${MAX_SPOKEN_CHARS} characters, plain spoken
  language with no stage directions or emoji.
- Mention the route or station naturally, the way a friend tracking the trip
  would, so it sounds like a real ongoing call.

Return JSON: { "line": "..." }
`;

  for (const model of MODELS) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.9,
          maxOutputTokens: 2048,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const { line } = JSON.parse(response.text ?? "") as { line: string };
      const verdict = checkSpokenLine(line);

      if (!verdict.ok) {
        // Do not repair the line — speak the reviewed script instead.
        console.warn(`companion-script rejected (${verdict.reason})`);
        return res.status(200).json({ ...reviewedFallback, rejected: verdict.reason });
      }

      return res.status(200).json({ text: line.trim(), source: "gemini", model });
    } catch (error) {
      console.error(`companion-script error (${model})`, error);
    }
  }

  return res.status(200).json(reviewedFallback);
}
