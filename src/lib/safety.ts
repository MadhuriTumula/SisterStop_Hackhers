/**
 * Deterministic safety layer.
 *
 * The model is never the thing that decides whether a situation is urgent.
 * These keyword checks run before and after any AI call, so an urgent phrase
 * always produces the call-911 escalation state even if the API is down.
 */

const URGENT_PATTERNS: RegExp[] = [
  /\bfollow(ed|ing)?\b/i,
  /\bstalk(ed|ing|er)?\b/i,
  /\bthreat(en|ened|ening)?\b/i,
  /\battack(ed|ing)?\b/i,
  /\bassault(ed)?\b/i,
  /\bgrabb?(ed|ing)\b/i,
  /\bweapon\b|\bgun\b|\bknife\b/i,
  /\bhurt\b|\bbleeding\b|\binjur(y|ed)\b/i,
  /\bemergency\b/i,
  /\bunsafe\b|\bin danger\b|\bdanger(ous)?\b/i,
  /\bharass(ed|ing|ment)?\b/i,
  /\bhelp me\b|\bcall (the )?police\b|\b911\b/i,
  /\bpassing out\b|\bcan'?t breathe\b/i,
  /\bhurt myself\b|\bself[- ]harm\b/i,
];

export const detectsUrgentLanguage = (input: string | undefined | null): boolean => {
  if (!input) return false;
  return URGENT_PATTERNS.some((pattern) => pattern.test(input));
};

export const URGENT_SAFETY_NOTICE =
  "If you are in immediate danger, call 911 now. MARTA Police can be reached at 404-848-4911 or by texting 404-334-5355. MARTA MATE cannot contact anyone for you.";

export const ROUTINE_SAFETY_NOTICE =
  "MARTA MATE is a support companion, not emergency response. If anything feels urgent, call 911 or use the Safety Hub.";

export const PROTOTYPE_DISCLAIMER =
  "MARTA MATE is a hackathon prototype for peer support and well-being. It does not replace 911, MARTA Police, or official transit safety services.";
