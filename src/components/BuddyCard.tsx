import { BadgeCheck, Ban, Clock3, MapPin, Shield, Sparkles } from "lucide-react";
import type { MatchResult } from "../types/buddy";
import { MATCH_TYPE_SHORT, SUPPORT_LABEL } from "../lib/formatters";
import { routeAccent } from "../data/mockRoutes";
import { overlapPercent } from "../lib/matching";
import { cn } from "../lib/utils";

interface BuddyCardProps {
  result: MatchResult;
  onRequest: (result: MatchResult) => void;
  onBlock?: (buddyId: string) => void;
  index?: number;
}

const BuddyCard = ({ result, onRequest, onBlock, index = 0 }: BuddyCardProps) => {
  const { buddy, score, reasons } = result;

  return (
    <article
      className="card animate-fade-up flex flex-col gap-4 p-5"
      style={{ animationDelay: `${Math.min(index * 50, 200)}ms` }}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand/15 text-sm font-semibold text-brand-soft"
        >
          {buddy.avatarInitials}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-base font-semibold">{buddy.alias}</h3>
            <span className="text-xs text-muted">{buddy.pronouns}</span>
            {buddy.verified ? (
              <span className="chip bg-calm/10 text-calm ring-calm/30">
                <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                Verified rider
              </span>
            ) : (
              <span className="chip bg-elevated text-muted ring-hairline">
                <Shield className="h-3 w-3" aria-hidden="true" />
                Not yet verified
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-muted">
            {buddy.ridesTogether} completed check-ins · wants {MATCH_TYPE_SHORT[buddy.matchType].toLowerCase()}
          </p>
        </div>

        <span
          className="chip shrink-0 bg-brand/10 text-brand-soft ring-brand/30"
          title="How closely this rider's route and time window overlap with yours"
        >
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          {overlapPercent(score)}% overlap
        </span>
      </div>

      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <dt className="sr-only">Route</dt>
          <dd>
            <span className={cn("chip", routeAccent(buddy.route))}>{buddy.route}</span>
          </dd>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <Clock3 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Departure window</dt>
          <dd>{buddy.departureWindow}</dd>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Station area</dt>
          <dd className="truncate">{buddy.originStationZone}</dd>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <dt className="sr-only">Heading toward</dt>
          <dd className="truncate">Heading toward {buddy.destinationZone}</dd>
        </div>
      </dl>

      {reasons.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {reasons.slice(0, 3).map((reason) => (
            <li key={reason} className="chip bg-elevated text-muted ring-hairline">
              {reason}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="text-xs text-muted">
        Prefers {SUPPORT_LABEL[buddy.supportPreference].toLowerCase()} · Exact destination and
        contact details stay private until you both choose to share more.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-primary flex-1"
          onClick={() => onRequest(result)}
        >
          Request match
        </button>
        {onBlock ? (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => onBlock(buddy.id)}
            aria-label={`Hide ${buddy.alias} from my matches`}
          >
            <Ban className="h-4 w-4" aria-hidden="true" />
            Hide
          </button>
        ) : null}
      </div>
    </article>
  );
};

export default BuddyCard;
