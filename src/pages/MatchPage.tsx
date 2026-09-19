import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  BadgeCheck,
  Ban,
  CheckCircle2,
  Clock3,
  Flag,
  HeartPulse,
  LogOut,
  MapPin,
  Send,
  ShieldAlert,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import SafetyBanner from "../components/SafetyBanner";
import EmptyState from "../components/EmptyState";
import TrustedContactSheet from "../components/TrustedContactSheet";
import { mockBuddies } from "../data/mockBuddies";
import { useTripSession } from "../hooks/useTripSession";
import { MATCH_TYPE_LABEL, SUPPORT_LABEL } from "../lib/formatters";
import { overlapSummary } from "../lib/matching";
import { routeAccent } from "../data/mockRoutes";
import { cn } from "../lib/utils";

const MatchPage = () => {
  const { buddyId } = useParams<{ buddyId: string }>();
  const navigate = useNavigate();
  const { trip, stage, checkInsSent, leaveMatch, blockBuddy, recordCheckIn, markArrived } =
    useTripSession();
  const [sheetOpen, setSheetOpen] = useState(false);

  const buddy = mockBuddies.find((candidate) => candidate.id === buddyId);

  if (!buddy) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="That match is no longer available"
        description="The rider may have left or completed their trip. You can look for another buddy or continue with the support tools."
      >
        <Link to="/buddies" className="btn-primary">
          Back to matches
        </Link>
      </EmptyState>
    );
  }

  const arrived = stage === "arrived";

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Step 3 of 3"
        title={arrived ? `Trip complete — thanks, ${buddy.alias}` : `You and ${buddy.alias} are matched`}
        description={
          arrived
            ? "Your match has ended and nothing about this trip stays visible to the other rider."
            : "Here is exactly what the two of you share. Everything else stays private."
        }
      />

      <section className="card p-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand/15 text-sm font-semibold text-brand-soft"
          >
            {buddy.avatarInitials}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="flex flex-wrap items-center gap-2 text-lg font-semibold">
              {buddy.alias}
              <span className="text-xs font-normal text-muted">{buddy.pronouns}</span>
              {buddy.verified ? (
                <span className="chip bg-calm/10 text-calm ring-calm/30">
                  <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                  Verified rider
                </span>
              ) : null}
            </h2>
            <p className="mt-1 text-sm text-muted">{overlapSummary(buddy, trip)}</p>
          </div>
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-elevated/60 p-4">
            <dt className="text-xs uppercase tracking-wide text-muted">Shared route</dt>
            <dd className="mt-1.5">
              <span className={cn("chip", routeAccent(buddy.route))}>{buddy.route}</span>
            </dd>
          </div>
          <div className="rounded-xl bg-elevated/60 p-4">
            <dt className="text-xs uppercase tracking-wide text-muted">Shared window</dt>
            <dd className="mt-1.5 flex items-center gap-2 text-sm">
              <Clock3 className="h-4 w-4 text-calm" aria-hidden="true" />
              {buddy.departureWindow}
            </dd>
          </div>
          <div className="rounded-xl bg-elevated/60 p-4">
            <dt className="text-xs uppercase tracking-wide text-muted">Meeting area</dt>
            <dd className="mt-1.5 flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-calm" aria-hidden="true" />
              {buddy.originStationZone} — main entrance
            </dd>
          </div>
          <div className="rounded-xl bg-elevated/60 p-4">
            <dt className="text-xs uppercase tracking-wide text-muted">Companion type</dt>
            <dd className="mt-1.5 text-sm">
              {MATCH_TYPE_LABEL[buddy.matchType]} · prefers{" "}
              {SUPPORT_LABEL[buddy.supportPreference].toLowerCase()}
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Privacy: your exact destination, contact details, and legal name are not shared.
          SisterStop does not track either of you and does not tell {buddy.alias} if you
          leave.
        </p>
      </section>

      {arrived ? (
        <section className="card border-calm/40 bg-calm/5 p-5 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-calm" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold">You marked yourself home safe</h2>
          <p className="mt-1 text-sm text-muted">
            {checkInsSent > 0
              ? `${checkInsSent} check-in${checkInsSent === 1 ? "" : "s"} were shared during this trip.`
              : "No check-ins were shared during this trip."}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to="/pulse" className="btn-secondary">
              See community impact
            </Link>
            <Link to="/plan" className="btn-primary">
              Plan another trip
            </Link>
          </div>
        </section>
      ) : (
        <section className="grid gap-3 sm:grid-cols-2">
          <button type="button" className="btn-primary min-h-12" onClick={() => setSheetOpen(true)}>
            <Send className="h-4 w-4" aria-hidden="true" />
            Start a check-in
          </button>
          <Link to="/calm" className="btn-secondary min-h-12">
            <HeartPulse className="h-4 w-4" aria-hidden="true" />
            Open Calm Mode
          </Link>
          <Link to="/safety" className="btn-secondary min-h-12">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
            Open Safety Hub
          </Link>
          <button
            type="button"
            className="btn-secondary min-h-12"
            onClick={() => {
              markArrived();
              toast.success("Glad you made it", {
                description: "Your match has ended and the trip is closed out.",
              });
            }}
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            I arrived safely
          </button>
        </section>
      )}

      <SafetyBanner />

      <section className="card p-5">
        <h2 className="text-sm font-semibold">You are in control of this match</h2>
        <p className="mt-1 text-xs text-muted">
          Leaving is always available and never requires a reason. Reports go to a human
          moderation queue — in this prototype they are recorded locally only.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              leaveMatch();
              toast("You left the match", { description: "No reason was shared." });
              navigate("/buddies");
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Leave match
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              blockBuddy(buddy.id);
              toast("Blocked", { description: `${buddy.alias} will not appear in your matches.` });
              navigate("/buddies");
            }}
          >
            <Ban className="h-4 w-4" aria-hidden="true" />
            Block rider
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              toast("Report started", {
                description:
                  "A moderator would review this. For anything urgent, call 911 or MARTA Police.",
              })
            }
          >
            <Flag className="h-4 w-4" aria-hidden="true" />
            Report a concern
          </button>
        </div>
      </section>

      <TrustedContactSheet
        open={sheetOpen}
        trip={trip}
        onClose={() => setSheetOpen(false)}
        onSend={(contactAlias) => {
          recordCheckIn();
          setSheetOpen(false);
          toast.success(`Check-in prepared for ${contactAlias}`, {
            description: "Route, station area, and arrival window only — no live location.",
          });
        }}
      />
    </div>
  );
};

export default MatchPage;
