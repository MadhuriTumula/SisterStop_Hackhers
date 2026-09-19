import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HeartPulse, Info, PencilLine, UsersRound } from "lucide-react";
import PageHeader from "../components/PageHeader";
import BuddyCard from "../components/BuddyCard";
import BuddyFilters from "../components/BuddyFilters";
import MatchSuccessModal from "../components/MatchSuccessModal";
import SignInPromptModal from "../components/SignInPromptModal";
import EmptyState from "../components/EmptyState";
import { useTripSession } from "../hooks/useTripSession";
import { useBuddyMatching } from "../hooks/useBuddyMatching";
import { useSession } from "../hooks/useSession";
import { overlapSummary } from "../lib/matching";
import { MATCH_TYPE_SHORT } from "../lib/formatters";
import { routeAccent } from "../data/mockRoutes";
import type { MatchResult } from "../types/buddy";
import { cn } from "../lib/utils";

const VirtualBuddiesPage = () => {
  const { trip, updateTrip, blockedBuddyIds, blockBuddy, requestMatch } = useTripSession();
  const { isAuthenticated } = useSession();
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [pending, setPending] = useState<MatchResult | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [confirmed, setConfirmed] = useState<MatchResult | null>(null);
  const navigate = useNavigate();

  const { matches, status } = useBuddyMatching(trip, blockedBuddyIds);

  const visible = useMemo(
    () => (verifiedOnly ? matches.filter(({ buddy }) => buddy.verified) : matches),
    [matches, verifiedOnly],
  );

  const onRequest = (result: MatchResult) => {
    setPending(result);
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }
    completeMatch(result);
  };

  const completeMatch = (result: MatchResult) => {
    requestMatch(result.buddy);
    setConfirmed(result);
    setShowSignIn(false);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Step 2 of 3"
        title="Virtual Buddies"
        description="Riders whose route, station area, and departure window overlap with yours. Everything shown here is what they chose to share — nothing more."
        action={
          <Link to="/plan" className="btn-secondary">
            <PencilLine className="h-4 w-4" aria-hidden="true" />
            Edit trip
          </Link>
        }
      />

      <section className="card flex flex-wrap items-center gap-2 p-4 text-sm" aria-label="Your trip">
        <span className={cn("chip", routeAccent(trip.route))}>{trip.route}</span>
        <span className="text-muted">{trip.originStation}</span>
        <span className="text-muted" aria-hidden="true">·</span>
        <span className="text-muted">{trip.departureWindow}</span>
        <span className="text-muted" aria-hidden="true">·</span>
        <span className="text-muted">toward {trip.destinationZone}</span>
        <span className="chip ml-auto bg-elevated text-muted ring-hairline">
          {MATCH_TYPE_SHORT[trip.matchType]}
        </span>
      </section>

      <BuddyFilters
        trip={trip}
        onChange={updateTrip}
        verifiedOnly={verifiedOnly}
        onVerifiedOnlyChange={setVerifiedOnly}
      />

      <p className="flex items-start gap-2 rounded-xl bg-elevated/60 p-4 text-xs leading-relaxed text-muted">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-calm" aria-hidden="true" />
        How matching protects privacy: riders are compared on route, station area, and a
        15-minute window — never live GPS. You see an alias, and your own exact destination
        stays private. Matching is opt-in on both sides, and you can hide, leave, or report
        any match at any time.
      </p>

      {status === "loading" && matches.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2" aria-busy="true">
          {[0, 1].map((key) => (
            <div key={key} className="card h-56 animate-pulse bg-elevated/40" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="No overlapping riders right now"
          description="Late-night demand is thin on some routes. You can widen your departure window, or use the support tools on your own — they work without a buddy."
        >
          <Link to="/plan" className="btn-secondary">
            Adjust my trip
          </Link>
          <Link to="/calm" className="btn-primary">
            <HeartPulse className="h-4 w-4" aria-hidden="true" />
            Open Calm Mode
          </Link>
        </EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {visible.map((result, index) => (
            <li key={result.buddy.id}>
              <BuddyCard
                result={result}
                index={index}
                onRequest={onRequest}
                onBlock={(buddyId) => {
                  blockBuddy(buddyId);
                  toast("Hidden from your matches", {
                    description: "They are not told anything about this.",
                  });
                }}
              />
            </li>
          ))}
        </ul>
      )}

      <SignInPromptModal
        open={showSignIn}
        onClose={() => setShowSignIn(false)}
        onContinueAnyway={() => pending && completeMatch(pending)}
      />

      <MatchSuccessModal
        buddy={confirmed?.buddy ?? null}
        overlapSummary={confirmed ? overlapSummary(confirmed.buddy, trip) : ""}
        onClose={() => setConfirmed(null)}
        onContinue={() => {
          const id = confirmed?.buddy.id;
          setConfirmed(null);
          if (id) navigate(`/match/${id}`);
        }}
      />
    </div>
  );
};

export default VirtualBuddiesPage;
