import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  ROUTINE_SAFETY_NOTICE,
  URGENT_SAFETY_NOTICE,
  detectsUrgentLanguage,
} from "../src/lib/safety";

/**
 * Calm Coach — Gemini with a JSON schema so the model returns UI-ready fields
 * instead of prose. The model suggests; the app decides what an action does.
 */

/**
 * Tried in order. Model availability shifts (2.5-flash was retired for new API
 * keys mid-build) and a busy model returns 503, so one stale name should not
 * drop the whole feature to fallback copy.
 */
const MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-3.8-flash",
  "gemini-3.6-flash",
].filter((model): model is string => Boolean(model));

/**
 * Gemini 3.x spends output tokens on thinking before it writes. A short,
 * schema-shaped support message needs none of it: at the previous 500-token
 * cap the model burned 476 on thought and emitted truncated JSON. Low thinking
 * plus real headroom keeps replies complete and the demo responsive.
 */
const MAX_OUTPUT_TOKENS = 2048;

interface CalmCoachPayload {
  supportMessage: string;
  groundingPrompt: string;
  suggestedAction:
    | "start_breathing"
    | "play_audio"
    | "open_safety_hub"
    | "request_checkin";
  urgency: "routine" | "urgent";
  safetyNotice: string;
}

const fallbackResponse: CalmCoachPayload = {
  supportMessage:
    "It makes sense to want a little more support during a delay. You do not have to handle this moment all at once.",
  groundingPrompt:
    "Try one slow breath: inhale for four, hold for four, then exhale for six.",
  suggestedAction: "start_breathing",
  urgency: "routine",
  safetyNotice: ROUTINE_SAFETY_NOTICE,
};

const urgentResponse: CalmCoachPayload = {
  supportMessage:
    "What you described sounds serious. Please get help from people who can reach you right now.",
  groundingPrompt:
    "If you can, move toward a lit, staffed area such as a station attendant booth or the front rail car.",
  suggestedAction: "open_safety_hub",
  urgency: "urgent",
  safetyNotice: URGENT_SAFETY_NOTICE,
};

const responseSchema = {
  type: "object",
  properties: {
    supportMessage: { type: "string" },
    groundingPrompt: { type: "string" },
    suggestedAction: {
      type: "string",
      enum: ["start_breathing", "play_audio", "open_safety_hub", "request_checkin"],
    },
    urgency: { type: "string", enum: ["routine", "urgent"] },
    safetyNotice: { type: "string" },
  },
  required: [
    "supportMessage",
    "groundingPrompt",
    "suggestedAction",
    "urgency",
    "safetyNotice",
  ],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { stationZone, route, delayContext, feeling, preference, note } =
    (req.body as Record<string, string | undefined>) ?? {};

  // Deterministic escalation runs first and cannot be overridden by the model.
  const urgentInput = detectsUrgentLanguage(`${note ?? ""} ${delayContext ?? ""}`);
  if (urgentInput) {
    return res.status(200).json({ ...urgentResponse, source: "safety-rule" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({ ...fallbackResponse, source: "fallback" });
  }

  const prompt = `
You are SisterStop, a short-form, supportive commute companion for an adult transit rider.

Rider context:
- Station area: ${stationZone || "not shared"}
- Transit route: ${route || "not shared"}
- Delay context: ${delayContext || "not shared"}
- Rider feeling: ${feeling || "not shared"}
- Preferred support: ${preference || "not shared"}
- Rider note: ${note || "not shared"}

Safety policy:
- Do not guarantee safety.
- Do not diagnose mental health conditions.
- Do not claim to contact MARTA Police, emergency services, or anyone else.
- Do not ask for a home address, exact location, phone number, or identifying details.
- If the rider describes immediate danger, being followed, violence, or a medical emergency, set urgency to "urgent" and make safetyNotice tell them to call 911 and open the Safety Hub.
- supportMessage: at most 2 short sentences, warm and specific to the context.
- groundingPrompt: one concrete sensory or breathing instruction.
- suggestedAction: pick the single in-app action that fits best.
- Return only valid JSON matching the schema.
`;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.7,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      // A truncated response parses as invalid JSON and falls through to the
      // next model rather than rendering half a sentence.
      const parsed = JSON.parse(response.text ?? "") as CalmCoachPayload;

      // Second pass: if the model's own wording signals urgency, escalate.
      const escalate =
        parsed.urgency === "urgent" || detectsUrgentLanguage(parsed.supportMessage);

      return res.status(200).json({
        ...parsed,
        urgency: escalate ? "urgent" : "routine",
        safetyNotice: escalate ? URGENT_SAFETY_NOTICE : parsed.safetyNotice,
        source: "gemini",
        model,
      });
    } catch (error) {
      console.error(`Gemini error (${model})`, error);
    }
  }

  return res.status(200).json({ ...fallbackResponse, source: "fallback" });
}
