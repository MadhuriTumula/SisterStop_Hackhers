import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PhoneCall } from "lucide-react";
import PageHeader from "../components/PageHeader";
import OfficialSafetyCard from "../components/OfficialSafetyCard";
import TrustedContactSheet from "../components/TrustedContactSheet";
import { SAFETY_RESOURCES } from "../lib/constants";
import { PROTOTYPE_DISCLAIMER } from "../lib/safety";
import { useTripSession } from "../hooks/useTripSession";
import type { SafetyResource } from "../types/safety";

const GROUPS: { kind: SafetyResource["kind"]; title: string; blurb: string }[] = [
  {
    kind: "emergency",
    title: "Immediate danger",
    blurb: "The fastest path to help. MARTA MATE cannot make this call for you.",
  },
  {
    kind: "transit",
    title: "MARTA official channels",
    blurb: "Transit police and MARTA's own reporting tools, linked directly.",
  },
  {
    kind: "support",
    title: "Emotional support",
    blurb: "Free, confidential help if the night is heavier than the commute.",
  },
  {
    kind: "in_app",
    title: "In MARTA MATE",
    blurb: "What this app can actually do for you right now.",
  },
];

const SafetyHubPage = () => {
  const { trip, recordCheckIn, leaveMatch, matchedBuddy } = useTripSession();
  const [sheetOpen, setSheetOpen] = useState(false);
  const navigate = useNavigate();

  const handleInAppAction = (resource: SafetyResource) => {
    if (resource.id === "trusted-contact") {
      setSheetOpen(true);
      return;
    }
    if (resource.id === "leave-match") {
      if (!matchedBuddy) {
        toast("No active match", { description: "You are not matched with anyone right now." });
        return;
      }
      leaveMatch();
      toast("You left the match", { description: "No reason was shared." });
      navigate("/buddies");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Safety Hub"
        title="Need help right now?"
        description="MARTA MATE is a support companion, not emergency response. These are the official channels, unchanged and one tap away."
        action={
          <a className="btn-safety px-6" href="tel:911">
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            Call 911
          </a>
        }
      />

      {GROUPS.map((group) => {
        const resources = SAFETY_RESOURCES.filter((resource) => resource.kind === group.kind);
        if (resources.length === 0) return null;

        return (
          <section key={group.kind} aria-labelledby={`safety-${group.kind}`}>
            <h2 id={`safety-${group.kind}`} className="text-sm font-semibold uppercase tracking-wide text-muted">
              {group.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{group.blurb}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {resources.map((resource) => (
                <OfficialSafetyCard
                  key={resource.id}
                  resource={resource}
                  onAction={handleInAppAction}
                />
              ))}
            </div>
          </section>
        );
      })}

      <section className="card p-5">
        <h2 className="text-sm font-semibold">What MARTA MATE will never do</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2">
          <li>Contact 911, MARTA Police, or anyone else on your behalf.</li>
          <li>Decide for you whether a situation is an emergency.</li>
          <li>Imitate police, dispatch, transit staff, or a real person.</li>
          <li>Share your live location, address, or phone number with a match.</li>
        </ul>
        <p className="mt-4 text-xs text-muted">{PROTOTYPE_DISCLAIMER}</p>
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

export default SafetyHubPage;
