import { Link } from "react-router-dom";
import { PhoneCall, ShieldAlert } from "lucide-react";
import { cn } from "../lib/utils";

interface SafetyBannerProps {
  className?: string;
  /** Urgent variant is used when the Calm Coach escalates. */
  tone?: "standard" | "urgent";
  message?: string;
}

const SafetyBanner = ({
  className,
  tone = "standard",
  message = "MARTA MATE is a support companion, not emergency response.",
}: SafetyBannerProps) => (
  <aside
    className={cn(
      "flex flex-col gap-3 rounded-[var(--radius-card)] border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
      tone === "urgent"
        ? "border-alert/60 bg-alert/10"
        : "border-safety/30 bg-safety/5",
      className,
    )}
    aria-live={tone === "urgent" ? "assertive" : "off"}
  >
    <p className="flex items-start gap-2 text-sm">
      <ShieldAlert
        className={cn(
          "mt-0.5 h-4 w-4 shrink-0",
          tone === "urgent" ? "text-alert" : "text-safety",
        )}
        aria-hidden="true"
      />
      <span className={tone === "urgent" ? "text-paper" : "text-muted"}>
        {message}{" "}
        <span className="font-medium text-paper">
          If you are in immediate danger, call 911.
        </span>
      </span>
    </p>
    <div className="flex shrink-0 gap-2">
      <a className="btn-safety" href="tel:911">
        <PhoneCall className="h-4 w-4" aria-hidden="true" />
        Call 911
      </a>
      <Link className="btn-secondary" to="/safety">
        Safety Hub
      </Link>
    </div>
  </aside>
);

export default SafetyBanner;
