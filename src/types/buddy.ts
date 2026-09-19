export type MartaRoute =
  | "Red Line"
  | "Gold Line"
  | "Blue Line"
  | "Green Line"
  | "Bus Route 40"
  | "Bus Route 12";

export type MatchType = "same_car" | "walk_to_station" | "arrival_checkin";

export type SupportPreference =
  | "quiet_company"
  | "audio_support"
  | "check_in"
  | "conversation";

export interface BuddyProfile {
  id: string;
  /** Public alias only — never a legal name. */
  alias: string;
  pronouns: string;
  verified: boolean;
  avatarInitials: string;
  route: MartaRoute;
  /** Broad station area, never a precise coordinate. */
  originStationZone: string;
  /** Broad destination zone, never a home address. */
  destinationZone: string;
  departureWindow: string;
  matchType: MatchType;
  interests: string[];
  supportPreference: SupportPreference;
  status: "available" | "matched";
  /** Demo-only social proof, e.g. "12 completed check-ins". */
  ridesTogether: number;
}

export interface TripRequest {
  originStation: string;
  route: MartaRoute;
  departureWindow: string;
  destinationZone: string;
  matchType: MatchType;
  comfortPreference: SupportPreference;
}

export interface MatchResult {
  buddy: BuddyProfile;
  score: number;
  reasons: string[];
}
