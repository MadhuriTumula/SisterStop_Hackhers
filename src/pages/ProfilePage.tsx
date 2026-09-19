import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { BadgeCheck, KeyRound, Lock, ShieldCheck } from "lucide-react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { useSession } from "../hooks/useSession";
import { useTripSession } from "../hooks/useTripSession";
import { SUPPORT_LABEL } from "../lib/formatters";
import { routeIds } from "../data/mockRoutes";
import type { SupportPreference } from "../types/buddy";
import { cn } from "../lib/utils";

const PREFS_KEY = "martamate.preferences";

interface Preferences {
  alias: string;
  preferredRoute: string;
  supportPreference: SupportPreference;
  audioFirst: boolean;
}

const readPreferences = (fallbackAlias: string): Preferences => {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw) as Preferences;
  } catch {
    // Ignore malformed local state and start fresh.
  }
  return {
    alias: fallbackAlias,
    preferredRoute: "Red Line",
    supportPreference: "quiet_company",
    audioFirst: false,
  };
};

const ProfilePage = () => {
  const { isAuthenticated, isLoading, user, signIn, mode } = useSession();
  const { trip } = useTripSession();
  const [prefs, setPrefs] = useState<Preferences>(() => readPreferences("Rider"));

  useEffect(() => {
    if (user?.alias) {
      setPrefs((current) => ({ ...current, alias: current.alias || user.alias }));
    }
  }, [user?.alias]);

  if (isLoading) {
    return <div className="card h-40 animate-pulse bg-elevated/40" aria-busy="true" />;
  }

  if (!isAuthenticated) {
    return (
      <EmptyState
        icon={KeyRound}
        title="Sign in to open your profile"
        description="Your profile holds saved preferences and check-in history, so it stays behind authentication. Every other screen in MARTA MATE works without an account."
      >
        <button type="button" className="btn-primary" onClick={signIn}>
          {mode === "auth0" ? "Continue securely with Auth0" : "Use local demo sign-in"}
        </button>
        <Link to="/plan" className="btn-secondary">
          Keep previewing
        </Link>
      </EmptyState>
    );
  }

  const save = () => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    toast.success("Preferences saved", {
      description: "Stored on this device for the prototype.",
    });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Profile"
        title="Your account and preferences"
        description="Your account identity and the alias other riders see are deliberately separate."
      />

      <section className="card p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <ShieldCheck className="h-5 w-5 text-calm" aria-hidden="true" />
          Account
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-elevated/60 p-4">
            <dt className="text-xs uppercase tracking-wide text-muted">Signed in with</dt>
            <dd className="mt-1 text-sm">
              {mode === "auth0" ? "Auth0 Universal Login" : "Local demo session"}
            </dd>
          </div>
          <div className="rounded-xl bg-elevated/60 p-4">
            <dt className="text-xs uppercase tracking-wide text-muted">Account email</dt>
            <dd className="mt-1 text-sm">
              {user?.email
                ? `${user.email.slice(0, 2)}•••@${user.email.split("@")[1] ?? ""}`
                : "Not shared with MARTA MATE"}
            </dd>
          </div>
          <div className="rounded-xl bg-elevated/60 p-4">
            <dt className="text-xs uppercase tracking-wide text-muted">Public alias</dt>
            <dd className="mt-1 text-sm">{prefs.alias || user?.alias}</dd>
          </div>
          <div className="rounded-xl bg-elevated/60 p-4">
            <dt className="text-xs uppercase tracking-wide text-muted">Verification</dt>
            <dd className="mt-1 flex items-center gap-2 text-sm">
              <BadgeCheck className="h-4 w-4 text-calm" aria-hidden="true" />
              Verified rider (demo badge)
            </dd>
          </div>
        </dl>
        <p className="mt-4 flex items-start gap-2 text-xs text-muted">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-calm" aria-hidden="true" />
          Other riders only ever see your alias, route, station area, and departure window.
          Tokens are never displayed, logged, or shared.
        </p>
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-semibold">Commute preferences</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="alias">
              Public alias
            </label>
            <input
              id="alias"
              className="field"
              value={prefs.alias}
              maxLength={24}
              onChange={(event) => setPrefs({ ...prefs, alias: event.target.value })}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="preferred-route">
              Usual route
            </label>
            <select
              id="preferred-route"
              className="field"
              value={prefs.preferredRoute}
              onChange={(event) => setPrefs({ ...prefs, preferredRoute: event.target.value })}
            >
              {routeIds.map((route) => (
                <option key={route} value={route}>
                  {route}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="mt-4">
          <legend className="field-label">Preferred support style</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(SUPPORT_LABEL) as SupportPreference[]).map((preference) => (
              <button
                key={preference}
                type="button"
                aria-pressed={prefs.supportPreference === preference}
                onClick={() => setPrefs({ ...prefs, supportPreference: preference })}
                className={cn(
                  "chip min-h-9 px-3",
                  prefs.supportPreference === preference
                    ? "bg-brand/15 text-paper ring-brand/50"
                    : "bg-elevated text-muted ring-hairline hover:text-paper",
                )}
              >
                {SUPPORT_LABEL[preference]}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-4 flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-hairline bg-ink accent-brand"
            checked={prefs.audioFirst}
            onChange={(event) => setPrefs({ ...prefs, audioFirst: event.target.checked })}
          />
          Open Calm Mode with comfort audio ready
        </label>

        <button type="button" className="btn-primary mt-5" onClick={save}>
          Save preferences
        </button>
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-semibold">Current trip</h2>
        <p className="mt-2 text-sm text-muted">
          {trip.route} · {trip.originStation} · {trip.departureWindow} · toward{" "}
          {trip.destinationZone}
        </p>
        <Link to="/plan" className="btn-secondary mt-4">
          Edit trip
        </Link>
      </section>
    </div>
  );
};

export default ProfilePage;
