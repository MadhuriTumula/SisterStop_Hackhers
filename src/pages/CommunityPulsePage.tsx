import { useEffect, useMemo, useState } from "react";
import { Database, Loader2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import CommunityPulseChart from "../components/CommunityPulseChart";
import { mockPulseData, mockSupportSplit } from "../data/mockPulseData";
import type { CommunityPulseResponse } from "../types/api";

const CommunityPulsePage = () => {
  const [payload, setPayload] = useState<CommunityPulseResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/community-pulse")
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data: CommunityPulseResponse) => {
        if (active) setPayload(data);
      })
      .catch(() => {
        if (active) {
          setPayload({
            data: mockPulseData,
            bySupportType: mockSupportSplit,
            source: "fallback",
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const rows = payload?.data ?? [];
    if (rows.length === 0) return null;

    const total = rows.reduce((sum, row) => sum + row.requests, 0);
    const peak = rows.reduce((best, row) => (row.requests > best.requests ? row : best), rows[0]);
    const weightedMood =
      rows.reduce((sum, row) => sum + row.mood * row.requests, 0) / (total || 1);

    return { total, peak, mood: weightedMood };
  }, [payload]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Community Pulse"
        title="When riders need support most"
        description="Anonymous, aggregate check-ins only. No rider, destination, or precise location appears here — the point is to show community organizations and transit partners which windows need staffing and outreach."
        action={
          <span className="chip bg-elevated text-muted ring-hairline">
            <Database className="h-3 w-3" aria-hidden="true" />
            {payload?.source === "tiger-data" ? "Live from Tiger Data" : "Demo data"}
          </span>
        }
      />

      {loading ? (
        <div className="card flex items-center gap-2 p-8 text-sm text-muted" aria-busy="true">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading aggregate check-ins…
        </div>
      ) : (
        <>
          {stats ? (
            <section className="grid gap-3 sm:grid-cols-3" aria-label="Summary">
              <div className="card p-5">
                <p className="text-xs uppercase tracking-wide text-muted">Check-ins (12h)</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums">{stats.total}</p>
              </div>
              <div className="card p-5">
                <p className="text-xs uppercase tracking-wide text-muted">Busiest window</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums">{stats.peak.time}</p>
                <p className="text-xs text-muted">{stats.peak.requests} requests</p>
              </div>
              <div className="card p-5">
                <p className="text-xs uppercase tracking-wide text-muted">Average mood (1–5)</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums">{stats.mood.toFixed(1)}</p>
                <p className="text-xs text-muted">Self-reported, weighted by check-ins</p>
              </div>
            </section>
          ) : null}

          <CommunityPulseChart
            data={payload?.data ?? mockPulseData}
            bySupportType={payload?.bySupportType ?? mockSupportSplit}
          />

          <section className="card p-5">
            <h2 className="text-sm font-semibold">Why time-series, and why anonymous</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Every check-in is stored as a timestamped row with a route, a station zone, a
              support type, and a 1–5 mood score — nothing that identifies a rider. Tiger Data
              buckets those rows into 30-minute windows, so a partner can see that demand on
              the Red Line peaks around 10:00 PM without ever seeing a single person's trip.
              That is the difference between a staffing decision and surveillance.
            </p>
            <p className="mt-3 text-xs text-muted">
              {payload?.source === "tiger-data"
                ? "This dashboard is reading live aggregates from Tiger Data."
                : "No database is configured in this environment, so the chart is showing deterministic demo data with the same shape as the live query."}
            </p>
          </section>
        </>
      )}
    </div>
  );
};

export default CommunityPulsePage;
