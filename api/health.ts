import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Booleans only. Used by the in-app integration status strip so a judge can
 * see which sponsor APIs are live without exposing any key material.
 */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    ok: true,
    app: "SisterStop",
    integrations: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      elevenlabs: Boolean(
        process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID,
      ),
      tigerData: Boolean(process.env.DATABASE_URL),
    },
  });
}
