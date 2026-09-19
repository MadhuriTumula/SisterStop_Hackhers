import type { PulsePoint, SupportTypeSlice } from "../types/api";

/** Deterministic fallback so the dashboard is never empty during judging. */
export const mockPulseData: PulsePoint[] = [
  { time: "8:00 PM", route: "Red Line", requests: 8, mood: 3.2 },
  { time: "8:30 PM", route: "Red Line", requests: 12, mood: 2.9 },
  { time: "9:00 PM", route: "Gold Line", requests: 9, mood: 3.3 },
  { time: "9:30 PM", route: "Blue Line", requests: 14, mood: 2.7 },
  { time: "10:00 PM", route: "Red Line", requests: 19, mood: 2.6 },
  { time: "10:30 PM", route: "Bus Route 40", requests: 11, mood: 3.0 },
  { time: "11:00 PM", route: "Gold Line", requests: 15, mood: 2.8 },
  { time: "11:30 PM", route: "Red Line", requests: 7, mood: 3.4 },
];

export const mockSupportSplit: SupportTypeSlice[] = [
  { supportType: "buddy_match", count: 42 },
  { supportType: "grounding", count: 27 },
  { supportType: "audio_support", count: 19 },
  { supportType: "arrival_checkin", count: 31 },
];
