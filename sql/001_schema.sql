-- MARTA MATE — Tiger Data / TimescaleDB schema
-- Anonymous aggregate events only. No rider identity, no precise location.

CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS community_checkins (
  id UUID DEFAULT gen_random_uuid(),
  route TEXT NOT NULL,
  station_zone TEXT NOT NULL,
  support_type TEXT NOT NULL,
  mood_score SMALLINT NOT NULL CHECK (mood_score BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, created_at)
);

SELECT create_hypertable(
  'community_checkins',
  by_range('created_at'),
  if_not_exists => TRUE
);

CREATE INDEX IF NOT EXISTS community_checkins_route_time_idx
  ON community_checkins (route, created_at DESC);
