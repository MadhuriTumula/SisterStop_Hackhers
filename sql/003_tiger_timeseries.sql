-- Continuous aggregate: pre-computed 30-minute buckets for a lag-free chart.
-- If your Tiger Data plan rejects the policy below, drop that statement; the
-- API falls back to a plain time_bucket() aggregate query and still qualifies.

CREATE MATERIALIZED VIEW IF NOT EXISTS community_pulse_30m
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('30 minutes', created_at) AS bucket,
  route,
  support_type,
  COUNT(*) AS request_count,
  ROUND(AVG(mood_score), 2) AS average_mood_score
FROM community_checkins
GROUP BY bucket, route, support_type
WITH NO DATA;

SELECT add_continuous_aggregate_policy(
  'community_pulse_30m',
  start_offset => INTERVAL '7 days',
  end_offset => INTERVAL '15 minutes',
  schedule_interval => INTERVAL '15 minutes'
);

-- Compression keeps months of check-ins inside a free-tier instance.
ALTER TABLE community_checkins SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'route'
);

SELECT add_compression_policy('community_checkins', INTERVAL '7 days');
