import { Client } from "pg";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { mockPulseData, mockSupportSplit } from "../src/data/mockPulseData";

/**
 * Community Pulse — anonymous, aggregate only. Every query buckets by time and
 * route; nothing here can be traced back to a rider, a destination, or a
 * precise location.
 */

const PULSE_QUERY = `
  SELECT
    TO_CHAR(time_bucket('30 minutes', created_at), 'HH12:MI AM') AS time,
    route,
    COUNT(*)::int AS requests,
    ROUND(AVG(mood_score)::numeric, 1)::float AS mood
  FROM community_checkins
  WHERE created_at >= NOW() - INTERVAL '12 hours'
  GROUP BY time_bucket('30 minutes', created_at), route
  ORDER BY time_bucket('30 minutes', created_at)
`;

const SPLIT_QUERY = `
  SELECT support_type AS "supportType", COUNT(*)::int AS count
  FROM community_checkins
  WHERE created_at >= NOW() - INTERVAL '7 days'
  GROUP BY support_type
  ORDER BY count DESC
`;

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const fallbackPayload = {
    data: mockPulseData,
    bySupportType: mockSupportSplit,
    source: "fallback" as const,
  };

  if (!process.env.DATABASE_URL) {
    return res.status(200).json(fallbackPayload);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const [pulse, split] = await Promise.all([
      client.query(PULSE_QUERY),
      client.query(SPLIT_QUERY),
    ]);

    if (pulse.rows.length === 0) {
      return res.status(200).json(fallbackPayload);
    }

    return res.status(200).json({
      data: pulse.rows,
      bySupportType: split.rows,
      source: "tiger-data",
    });
  } catch (error) {
    console.error("Community pulse error", error);
    return res.status(200).json(fallbackPayload);
  } finally {
    await client.end().catch(() => undefined);
  }
}
