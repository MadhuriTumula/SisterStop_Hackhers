export type CalmFeeling = "uneasy" | "stressed" | "overwhelmed" | "okay";

export type CalmAction =
  | "start_breathing"
  | "play_audio"
  | "open_safety_hub"
  | "request_checkin";

export interface CalmCoachRequest {
  stationZone: string;
  route: string;
  delayContext: string;
  feeling: CalmFeeling;
  preference: "quiet_company" | "audio_support" | "check_in" | "conversation";
  note?: string;
}

export interface CalmCoachResponse {
  supportMessage: string;
  groundingPrompt: string;
  suggestedAction: CalmAction;
  urgency: "routine" | "urgent";
  safetyNotice: string;
  source?: "gemini" | "fallback" | "safety-rule";
  model?: string;
}

export type AudioType = "friendly_checkin" | "comfort_call" | "grounding_guide";

export interface PulsePoint {
  time: string;
  route: string;
  requests: number;
  mood: number;
}

export interface SupportTypeSlice {
  supportType: string;
  count: number;
}

export interface CommunityPulseResponse {
  data: PulsePoint[];
  bySupportType: SupportTypeSlice[];
  source: "tiger-data" | "fallback";
}

export interface HealthResponse {
  ok: boolean;
  integrations: {
    gemini: boolean;
    elevenlabs: boolean;
    tigerData: boolean;
  };
}
