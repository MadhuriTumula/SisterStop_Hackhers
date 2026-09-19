import type { VercelRequest, VercelResponse } from "@vercel/node";
import { mockBuddies } from "../src/data/mockBuddies";
import { rankBuddies } from "../src/lib/matching";
import type { TripRequest } from "../src/types/buddy";

/**
 * Server-side matching. The client can rank locally for instant feedback, but
 * this endpoint is the authoritative version and proves the matching is real
 * logic over route/station/time overlap rather than a static card list.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const trip = req.body as Partial<TripRequest> | undefined;

  if (!trip?.route || !trip.originStation || !trip.departureWindow) {
    return res.status(400).json({
      error: "route, originStation, and departureWindow are required",
    });
  }

  const excludeIds = Array.isArray((req.body as { excludeIds?: string[] })?.excludeIds)
    ? ((req.body as { excludeIds?: string[] }).excludeIds as string[])
    : [];

  const matches = rankBuddies(mockBuddies, trip as TripRequest, { excludeIds });

  return res.status(200).json({ matches, source: "seed", count: matches.length });
}
