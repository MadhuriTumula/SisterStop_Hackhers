import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useTripSession } from "../hooks/useTripSession";
import { routeIds } from "../data/mockRoutes";
import { departureWindows, destinationZones, stations } from "../data/mockStations";
import { MATCH_TYPE_LABEL, SUPPORT_LABEL } from "../lib/formatters";
import type { MartaRoute, MatchType, SupportPreference } from "../types/buddy";
import { cn } from "../lib/utils";

const matchTypes: MatchType[] = ["same_car", "walk_to_station", "arrival_checkin"];
const supportPreferences: SupportPreference[] = [
  "quiet_company",
  "audio_support",
  "check_in",
  "conversation",
];

const PlanTripPage = () => {
  const { trip, updateTrip } = useTripSession();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (!trip.originStation || !trip.route || !trip.departureWindow || !trip.destinationZone) {
      setError("Choose a starting station, route, departure window, and destination zone.");
      return;
    }

    setError(null);
    navigate("/buddies");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Step 1 of 3"
        title="Plan my commute"
        description="Share only what matching needs: a station area, a route, and a departure window. Nothing here is a live location, and your exact destination stays a broad zone."
      />

      <form onSubmit={submit} className="space-y-5" noValidate>
        <section className="card grid gap-4 p-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="origin">
              Starting station or stop area
            </label>
            <select
              id="origin"
              className="field"
              value={trip.originStation}
              onChange={(event) => updateTrip({ originStation: event.target.value })}
            >
              {stations.map((station) => (
                <option key={station} value={station}>
                  {station}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="route">
              Transit line
            </label>
            <select
              id="route"
              className="field"
              value={trip.route}
              onChange={(event) => updateTrip({ route: event.target.value as MartaRoute })}
            >
              {routeIds.map((route) => (
                <option key={route} value={route}>
                  {route}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="window">
              Departure window
            </label>
            <select
              id="window"
              className="field"
              value={trip.departureWindow}
              onChange={(event) => updateTrip({ departureWindow: event.target.value })}
            >
              {departureWindows.map((window) => (
                <option key={window} value={window}>
                  {window}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-muted">
              Windows, not exact times — so no one can infer your daily pattern.
            </p>
          </div>

          <div>
            <label className="field-label" htmlFor="destination">
              Destination zone
            </label>
            <select
              id="destination"
              className="field"
              value={trip.destinationZone}
              onChange={(event) => updateTrip({ destinationZone: event.target.value })}
            >
              {destinationZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-muted">
              A neighborhood area, never a street address.
            </p>
          </div>
        </section>

        <fieldset className="card p-5">
          <legend className="field-label">What are you looking for?</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {matchTypes.map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={trip.matchType === type}
                onClick={() => updateTrip({ matchType: type })}
                className={cn(
                  "min-h-14 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                  trip.matchType === type
                    ? "border-brand/60 bg-brand/10 text-paper"
                    : "border-hairline bg-elevated/50 text-muted hover:text-paper",
                )}
              >
                {MATCH_TYPE_LABEL[type]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="card p-5">
          <legend className="field-label">Comfort preference</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-4">
            {supportPreferences.map((preference) => (
              <button
                key={preference}
                type="button"
                aria-pressed={trip.comfortPreference === preference}
                onClick={() => updateTrip({ comfortPreference: preference })}
                className={cn(
                  "min-h-12 rounded-xl border px-4 py-3 text-sm transition-colors",
                  trip.comfortPreference === preference
                    ? "border-calm/60 bg-calm/10 text-paper"
                    : "border-hairline bg-elevated/50 text-muted hover:text-paper",
                )}
              >
                {SUPPORT_LABEL[preference]}
              </button>
            ))}
          </div>
        </fieldset>

        {error ? (
          <p role="alert" className="rounded-xl border border-alert/50 bg-alert/10 px-4 py-3 text-sm">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-xs text-muted sm:max-w-md">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-calm" aria-hidden="true" />
            Matching happens on route, station area, and time overlap only. MARTA MATE never
            requests or stores your live location.
          </p>
          <button type="submit" className="btn-primary px-6">
            Find my Virtual Buddies
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlanTripPage;
