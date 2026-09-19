import { SlidersHorizontal } from "lucide-react";
import type { MatchType, SupportPreference, TripRequest } from "../types/buddy";
import { MATCH_TYPE_SHORT, SUPPORT_LABEL } from "../lib/formatters";
import { cn } from "../lib/utils";

interface BuddyFiltersProps {
  trip: TripRequest;
  onChange: (patch: Partial<TripRequest>) => void;
  verifiedOnly: boolean;
  onVerifiedOnlyChange: (value: boolean) => void;
}

const matchTypes: MatchType[] = ["same_car", "walk_to_station", "arrival_checkin"];
const supports: SupportPreference[] = [
  "quiet_company",
  "audio_support",
  "check_in",
  "conversation",
];

const BuddyFilters = ({
  trip,
  onChange,
  verifiedOnly,
  onVerifiedOnlyChange,
}: BuddyFiltersProps) => (
  <section className="card p-4" aria-label="Filter matches">
    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
      <SlidersHorizontal className="h-4 w-4 text-brand-soft" aria-hidden="true" />
      Adjust what you are looking for
    </h2>

    <fieldset className="mb-3">
      <legend className="mb-2 text-xs uppercase tracking-wide text-muted">
        Companion type
      </legend>
      <div className="flex flex-wrap gap-2">
        {matchTypes.map((type) => (
          <button
            key={type}
            type="button"
            aria-pressed={trip.matchType === type}
            onClick={() => onChange({ matchType: type })}
            className={cn(
              "chip min-h-9 px-3",
              trip.matchType === type
                ? "bg-brand/15 text-paper ring-brand/50"
                : "bg-elevated text-muted ring-hairline hover:text-paper",
            )}
          >
            {MATCH_TYPE_SHORT[type]}
          </button>
        ))}
      </div>
    </fieldset>

    <fieldset className="mb-3">
      <legend className="mb-2 text-xs uppercase tracking-wide text-muted">
        Support style
      </legend>
      <div className="flex flex-wrap gap-2">
        {supports.map((preference) => (
          <button
            key={preference}
            type="button"
            aria-pressed={trip.comfortPreference === preference}
            onClick={() => onChange({ comfortPreference: preference })}
            className={cn(
              "chip min-h-9 px-3",
              trip.comfortPreference === preference
                ? "bg-calm/15 text-paper ring-calm/50"
                : "bg-elevated text-muted ring-hairline hover:text-paper",
            )}
          >
            {SUPPORT_LABEL[preference]}
          </button>
        ))}
      </div>
    </fieldset>

    <label className="flex items-center gap-2 text-sm text-muted">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-hairline bg-ink accent-brand"
        checked={verifiedOnly}
        onChange={(event) => onVerifiedOnlyChange(event.target.checked)}
      />
      Show verified riders only
    </label>
  </section>
);

export default BuddyFilters;
