import { useEffect, useState } from "react";
import { mockBuddies } from "../data/mockBuddies";
import { rankBuddies } from "../lib/matching";
import type { MatchResult, TripRequest } from "../types/buddy";

type Status = "loading" | "ready" | "local";

/**
 * Asks the server to rank buddies, and ranks locally with identical logic if
 * the endpoint is unavailable — the list is never empty for infrastructure
 * reasons alone.
 */
export const useBuddyMatching = (
  trip: TripRequest,
  excludeIds: string[] = [],
): { matches: MatchResult[]; status: Status } => {
  const [matches, setMatches] = useState<MatchResult[]>(() =>
    rankBuddies(mockBuddies, trip, { excludeIds }),
  );
  const [status, setStatus] = useState<Status>("loading");
  const excludeKey = excludeIds.join(",");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setStatus("loading");

    const load = async () => {
      const localMatches = rankBuddies(mockBuddies, trip, { excludeIds });

      try {
        const response = await fetch("/api/buddy-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...trip, excludeIds }),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("matching unavailable");
        const payload = (await response.json()) as { matches?: MatchResult[] };
        if (!active) return;

        setMatches(payload.matches ?? localMatches);
        setStatus("ready");
      } catch {
        if (!active) return;
        setMatches(localMatches);
        setStatus("local");
      }
    };

    void load();

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    trip.route,
    trip.originStation,
    trip.departureWindow,
    trip.destinationZone,
    trip.matchType,
    trip.comfortPreference,
    excludeKey,
  ]);

  return { matches, status };
};
