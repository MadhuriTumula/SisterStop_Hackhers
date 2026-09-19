import type { BuddyProfile, MatchResult, TripRequest } from "../types/buddy";
import { MATCH_TYPE_SHORT, SUPPORT_LABEL, windowOverlapMinutes } from "./formatters";

/**
 * Matching runs on route + station zone + departure window + support style.
 * It never uses live coordinates, and it never needs to: sharing a rail
 * segment and a 15-minute window is what makes two riders useful to each
 * other, and it is the least sensitive thing a rider can disclose.
 */

export const MINIMUM_SCORE = 30;

/** Every point a buddy can earn below: used to show overlap as a percentage. */
export const MAX_SCORE = 45 + 25 + 20 + 15 + 10 + 8 + 5;

export const overlapPercent = (score: number): number =>
  Math.min(99, Math.round((score / MAX_SCORE) * 100));

export const scoreBuddy = (
  buddy: BuddyProfile,
  request: TripRequest,
): { score: number; reasons: string[] } => {
  let score = 0;
  const reasons: string[] = [];

  if (buddy.route === request.route) {
    score += 45;
    reasons.push(`Same route · ${buddy.route}`);
  }

  if (buddy.originStationZone === request.originStation) {
    score += 25;
    reasons.push(`Starting from ${buddy.originStationZone}`);
  }

  const overlap = windowOverlapMinutes(buddy.departureWindow, request.departureWindow);
  if (overlap >= 15) {
    score += 20;
    reasons.push(`${overlap} min of shared departure window`);
  } else if (overlap > 0) {
    score += 12;
    reasons.push(`${overlap} min of shared departure window`);
  }

  if (buddy.matchType === request.matchType) {
    score += 15;
    reasons.push(`Both want a ${MATCH_TYPE_SHORT[buddy.matchType].toLowerCase()}`);
  }

  if (buddy.supportPreference === request.comfortPreference) {
    score += 10;
    reasons.push(`Both prefer ${SUPPORT_LABEL[buddy.supportPreference].toLowerCase()}`);
  }

  if (buddy.destinationZone === request.destinationZone) {
    score += 8;
    reasons.push("Heading toward the same general area");
  }

  if (buddy.verified) score += 5;

  return { score, reasons };
};

export const rankBuddies = (
  buddies: BuddyProfile[],
  request: TripRequest,
  options: { excludeIds?: string[]; minimumScore?: number } = {},
): MatchResult[] => {
  const { excludeIds = [], minimumScore = MINIMUM_SCORE } = options;

  return buddies
    .filter((buddy) => buddy.status === "available")
    .filter((buddy) => !excludeIds.includes(buddy.id))
    .map((buddy) => ({ buddy, ...scoreBuddy(buddy, request) }))
    .filter(({ score }) => score >= minimumScore)
    .sort((a, b) => b.score - a.score || a.buddy.alias.localeCompare(b.buddy.alias));
};

/** Convenience wrapper used by screens that only need the profiles. */
export const findCompatibleBuddies = (
  buddies: BuddyProfile[],
  request: TripRequest,
): BuddyProfile[] => rankBuddies(buddies, request).map(({ buddy }) => buddy);

export const overlapSummary = (
  buddy: BuddyProfile,
  request: TripRequest,
): string => {
  const overlap = windowOverlapMinutes(buddy.departureWindow, request.departureWindow);
  const window = overlap > 0 ? buddy.departureWindow : request.departureWindow;
  return `${buddy.route} · ${request.originStation} area · ${window}`;
};
