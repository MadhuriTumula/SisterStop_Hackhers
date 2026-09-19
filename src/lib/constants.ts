import type { SafetyResource } from "../types/safety";
import type { AudioType, CalmFeeling } from "../types/api";
import type { TripRequest } from "../types/buddy";

export const APP_NAME = "MARTA MATE";
export const APP_TAGLINE = "Your calm, connected ride home.";

/** The demo opens on Maya's scenario so a 90-second run needs no typing. */
export const DEFAULT_TRIP: TripRequest = {
  originStation: "North Avenue Station",
  route: "Red Line",
  departureWindow: "10:15–10:30 PM",
  destinationZone: "Downtown Atlanta",
  matchType: "same_car",
  comfortPreference: "quiet_company",
};

export const DELAY_CONTEXTS = [
  "Train delayed by 15 minutes",
  "Waiting on a quiet platform",
  "Bus is running late",
  "Just missed my connection",
  "Walking to the station",
  "On board, almost home",
] as const;

export const FEELINGS: { id: CalmFeeling; label: string; hint: string }[] = [
  { id: "uneasy", label: "Uneasy", hint: "Something feels off" },
  { id: "stressed", label: "Stressed", hint: "Tense and rushed" },
  { id: "overwhelmed", label: "Overwhelmed", hint: "It is a lot right now" },
  { id: "okay", label: "Okay", hint: "Just want company" },
];

export interface AudioTool {
  id: AudioType;
  title: string;
  purpose: string;
  /** Spoken script — also used by the speech-synthesis fallback. */
  script: string;
  durationHint: string;
}

export const AUDIO_TOOLS: AudioTool[] = [
  {
    id: "friendly_checkin",
    title: "Friendly check-in",
    purpose: "A warm voice reminding you that someone is expecting you home.",
    script:
      "Hey, I'm checking in because I care about you getting home. Take your time, stay aware of your surroundings, and let me know when you are safely inside.",
    durationHint: "~12 seconds",
  },
  {
    id: "comfort_call",
    title: "Comfort call",
    purpose:
      "Call-style audio for moments when you would rather look like you are on the phone.",
    script:
      "Hey, I'm here. I know your train is delayed, but you are not doing this alone. I'll stay with you while you wait, and you can check in when you are on your way.",
    durationHint: "~15 seconds",
  },
  {
    id: "grounding_guide",
    title: "Guided grounding",
    purpose: "A short breathing and noticing exercise for an anxious wait.",
    script:
      "Take a slow breath in for four. Hold for four. Let it out for six. Notice one thing you can see, one thing you can hear, and one thing that helps you feel steady right now.",
    durationHint: "~18 seconds",
  },
];

export const AUDIO_DISCLAIMER =
  "Comfort tools only — not emergency, law-enforcement, or official transit communication.";

/**
 * Official destinations only. MARTA publishes these on its Safety & Security
 * page; re-verify before a live demo in case MARTA updates them.
 */
export const SAFETY_RESOURCES: SafetyResource[] = [
  {
    id: "call-911",
    kind: "emergency",
    label: "Call 911",
    description:
      "For immediate danger, violence, or a medical emergency. This is always the fastest path to help.",
    href: "tel:911",
    actionLabel: "Call now",
  },
  {
    id: "marta-police-call",
    kind: "transit",
    label: "Call MARTA Police",
    description: "Transit-specific concerns while you are in the system: 404-848-4911.",
    href: "tel:+14048484911",
    actionLabel: "Call MARTA Police",
  },
  {
    id: "marta-police-text",
    kind: "transit",
    label: "Text MARTA Police (See & Say)",
    description:
      "Discreetly report a concern by text: 404-334-5355. Useful when speaking out loud is not comfortable.",
    href: "sms:+14043345355",
    actionLabel: "Open text message",
  },
  {
    id: "marta-app",
    kind: "transit",
    label: "MARTA See & Say app",
    description:
      "MARTA's official app supports incident reporting and location sharing with transit police.",
    href: "https://www.itsmarta.com/the-marta-app.aspx",
    actionLabel: "Open MARTA app page",
  },
  {
    id: "marta-safety",
    kind: "transit",
    label: "MARTA safety & security information",
    description: "Official guidance on reporting, station safety, and rider resources.",
    href: "https://www.itsmarta.com/ride/customer-service/safety-and-security",
    actionLabel: "View MARTA safety page",
  },
  {
    id: "988",
    kind: "support",
    label: "988 Suicide & Crisis Lifeline",
    description:
      "Free, confidential support 24/7 if you are in emotional distress. Call or text 988.",
    href: "tel:988",
    actionLabel: "Call or text 988",
  },
  {
    id: "trusted-contact",
    kind: "in_app",
    label: "Share a trip check-in",
    description:
      "Send a trusted contact your route, station area, and expected arrival window. Never your exact location.",
    actionLabel: "Choose a contact",
  },
  {
    id: "leave-match",
    kind: "in_app",
    label: "Leave or block a match",
    description:
      "End a buddy match instantly. Leaving is always one tap away and never notifies the other rider of a reason.",
    actionLabel: "Manage match",
  },
];

export const PRIVACY_POINTS = [
  "Matching uses route, station area, and a 15-minute window — never live GPS.",
  "Riders see aliases, not legal names, phone numbers, or addresses.",
  "Your destination stays a broad zone until you choose otherwise.",
  "Leave, block, and report are visible on every match screen.",
];
