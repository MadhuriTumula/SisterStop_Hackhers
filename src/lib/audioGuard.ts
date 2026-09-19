/**
 * Guardrail for anything SisterStop speaks aloud.
 *
 * The reviewed scripts in constants.ts were written by hand. Once a model can
 * write a line instead, the safety boundary cannot live in the prompt alone —
 * a prompt is a request, not a constraint. Every line is checked here, on the
 * server, immediately before it reaches text-to-speech. A line that fails is
 * not "fixed"; it is discarded and the reviewed script is spoken instead.
 */

/** A spoken comfort line is a few sentences. Anything longer is suspect. */
export const MAX_SPOKEN_CHARS = 420;

const FORBIDDEN: { pattern: RegExp; reason: string }[] = [
  {
    pattern: /\b(police|officer|911|dispatch|sheriff|deputy|ambulance|paramedics?|fire department)\b/i,
    reason: "impersonates emergency services",
  },
  {
    pattern: /\bemergency (services|responders|dispatch)\b/i,
    reason: "impersonates emergency services",
  },
  {
    pattern: /\bmarta\b/i,
    reason: "impersonates transit staff",
  },
  {
    pattern: /\bsecurity (guard|team|desk|officer)\b/i,
    reason: "impersonates security personnel",
  },
  {
    pattern: /\b(i|we)('ve| have)? ?(just )?(called|contacted|notified|alerted|reported)\b/i,
    reason: "claims someone was contacted",
  },
  {
    pattern: /\bhelp is (on the way|coming)\b/i,
    reason: "promises a response the app cannot deliver",
  },
  {
    pattern: /\b(you are|you're|i'll keep you) safe\b/i,
    reason: "guarantees safety",
  },
];

export interface GuardResult {
  ok: boolean;
  reason?: string;
}

export const checkSpokenLine = (text: string | undefined | null): GuardResult => {
  const line = (text ?? "").trim();

  if (!line) return { ok: false, reason: "empty" };
  if (line.length > MAX_SPOKEN_CHARS) return { ok: false, reason: "too long" };

  for (const { pattern, reason } of FORBIDDEN) {
    if (pattern.test(line)) return { ok: false, reason };
  }

  return { ok: true };
};
