import { z } from "zod";
import type { CalmCoachRequest, CalmCoachResponse } from "../types/api";
import { ROUTINE_SAFETY_NOTICE } from "./safety";

/**
 * Client side of the Calm Coach. The schema is the contract: anything the
 * endpoint returns that does not match it degrades to bounded fallback copy
 * rather than rendering unvalidated model output.
 */
export const calmCoachSchema = z.object({
  supportMessage: z.string().min(1).max(600),
  groundingPrompt: z.string().min(1).max(400),
  suggestedAction: z.enum([
    "start_breathing",
    "play_audio",
    "open_safety_hub",
    "request_checkin",
  ]),
  urgency: z.enum(["routine", "urgent"]),
  safetyNotice: z.string().min(1).max(600),
  source: z.enum(["gemini", "fallback", "safety-rule"]).optional(),
  model: z.string().optional(),
});

export const LOCAL_FALLBACK: CalmCoachResponse = {
  supportMessage:
    "Waiting longer than you planned is draining, especially this late. You are doing a reasonable thing by checking in with yourself.",
  groundingPrompt:
    "Try one slow breath: inhale for four, hold for four, then exhale for six.",
  suggestedAction: "start_breathing",
  urgency: "routine",
  safetyNotice: ROUTINE_SAFETY_NOTICE,
  source: "fallback",
};

export const requestCalmCoach = async (
  input: CalmCoachRequest,
  signal?: AbortSignal,
): Promise<CalmCoachResponse> => {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok) throw new Error(`Calm Coach request failed (${response.status})`);

  const parsed = calmCoachSchema.safeParse(await response.json());
  return parsed.success ? parsed.data : LOCAL_FALLBACK;
};
