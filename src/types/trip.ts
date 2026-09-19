import type { BuddyProfile, TripRequest } from "./buddy";

export type TripStage = "planning" | "matched" | "in_transit" | "arrived";

export interface Match {
  id: string;
  buddyId: string;
  overlapSummary: string;
  meetingArea: string;
  status: "pending" | "active" | "left" | "completed";
  createdAt: string;
}

export interface TripSessionState {
  trip: TripRequest;
  stage: TripStage;
  match: Match | null;
  matchedBuddy: BuddyProfile | null;
  blockedBuddyIds: string[];
  checkInsSent: number;
}

export type { TripRequest };
