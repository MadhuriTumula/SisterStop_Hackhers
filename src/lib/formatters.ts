import type { MatchType, SupportPreference } from "../types/buddy";

export const MATCH_TYPE_LABEL: Record<MatchType, string> = {
  same_car: "Same train car or bus",
  walk_to_station: "Walk to the stop together",
  arrival_checkin: "Arrival check-in",
};

export const MATCH_TYPE_SHORT: Record<MatchType, string> = {
  same_car: "Same-car buddy",
  walk_to_station: "Walk-to-stop buddy",
  arrival_checkin: "Arrival check-in",
};

export const SUPPORT_LABEL: Record<SupportPreference, string> = {
  quiet_company: "Quiet company",
  audio_support: "Audio support",
  check_in: "Check-in only",
  conversation: "Light conversation",
};

export const SUPPORT_TYPE_LABEL: Record<string, string> = {
  buddy_match: "Buddy match",
  grounding: "Grounding",
  audio_support: "Comfort audio",
  arrival_checkin: "Arrival check-in",
};

/** "10:15–10:30 PM" -> { start: 615, end: 630 } in minutes past midnight. */
export const parseWindow = (
  window: string,
): { start: number; end: number } | null => {
  const match = window.match(
    /^(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
  );
  if (!match) return null;

  const [, startHour, startMin, endHour, endMin, meridiem] = match;
  const isPm = meridiem.toUpperCase() === "PM";

  const toMinutes = (hour: string, minute: string): number => {
    let hours = Number(hour) % 12;
    if (isPm) hours += 12;
    return hours * 60 + Number(minute);
  };

  let start = toMinutes(startHour, startMin);
  const end = toMinutes(endHour, endMin);

  // Handles windows that cross the meridiem, e.g. "11:45–12:15 AM".
  if (start > end) start -= 12 * 60;

  return { start, end };
};

/** Minutes of overlap between two departure windows. 0 means no overlap. */
export const windowOverlapMinutes = (a: string, b: string): number => {
  const first = parseWindow(a);
  const second = parseWindow(b);
  if (!first || !second) return 0;
  return Math.max(0, Math.min(first.end, second.end) - Math.max(first.start, second.start));
};

export const formatOverlap = (a: string, b: string): string => {
  const overlap = windowOverlapMinutes(a, b);
  if (overlap <= 0) return "Nearby departure times";
  return `${overlap} minutes of shared departure window`;
};

export const initialsFromName = (value: string): string =>
  value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "MM";
