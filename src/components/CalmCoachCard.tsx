import {
  HeartPulse,
  Loader2,
  PhoneCall,
  RefreshCw,
  Sparkles,
  Wind,
} from "lucide-react";
import type { CalmAction, CalmCoachResponse } from "../types/api";
import type { CalmCoachStatus } from "../hooks/useCalmCoach";
import { cn } from "../lib/utils";

interface CalmCoachCardProps {
  status: CalmCoachStatus;
  response: CalmCoachResponse | null;
  onAction: (action: CalmAction) => void;
  onRetry: () => void;
}

const ACTION_LABEL: Record<CalmAction, string> = {
  start_breathing: "Start the breathing exercise",
  play_audio: "Play comfort audio",
  open_safety_hub: "Open the Safety Hub",
  request_checkin: "Start a buddy check-in",
};

const CalmCoachCard = ({ status, response, onAction, onRetry }: CalmCoachCardProps) => {
  if (status === "idle") {
    return (
      <section className="card p-5" aria-label="Calm Coach">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="h-5 w-5 text-brand-soft" aria-hidden="true" />
          Calm Coach
        </h2>
        <p className="mt-2 text-sm text-muted">
          Tell Calm Coach how the wait is going. It replies with one short support message,
          one grounding step, and one suggested action — nothing more.
        </p>
      </section>
    );
  }

  if (status === "loading") {
    return (
      <section className="card p-5" aria-label="Calm Coach" aria-busy="true">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Thinking through what might help right now…
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-elevated" />
          <div className="h-4 w-full animate-pulse rounded bg-elevated" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-elevated" />
        </div>
      </section>
    );
  }

  if (!response) return null;

  const isUrgent = response.urgency === "urgent";

  return (
    <section
      className={cn("card animate-fade-up p-5", isUrgent && "border-alert/60 bg-alert/5")}
      aria-label="Calm Coach response"
      aria-live="polite"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles
            className={cn("h-5 w-5", isUrgent ? "text-alert" : "text-brand-soft")}
            aria-hidden="true"
          />
          Calm Coach
        </h2>
        <button type="button" className="btn-ghost h-8 px-3 text-xs" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          New response
        </button>
      </div>

      <p className="text-[15px] leading-relaxed">{response.supportMessage}</p>

      <div className="mt-4 flex items-start gap-3 rounded-xl bg-elevated/70 p-4">
        <Wind className="mt-0.5 h-4 w-4 shrink-0 text-calm" aria-hidden="true" />
        <p className="text-sm leading-relaxed">{response.groundingPrompt}</p>
      </div>

      {isUrgent ? (
        <div className="mt-4 rounded-xl border border-alert/60 bg-alert/10 p-4">
          <p className="flex items-start gap-2 text-sm font-medium">
            <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-alert" aria-hidden="true" />
            <span>{response.safetyNotice}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a className="btn-safety" href="tel:911">
              Call 911
            </a>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onAction("open_safety_hub")}
            >
              Open Safety Hub
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            className="btn-primary mt-4 w-full sm:w-auto"
            onClick={() => onAction(response.suggestedAction)}
          >
            <HeartPulse className="h-4 w-4" aria-hidden="true" />
            {ACTION_LABEL[response.suggestedAction]}
          </button>
          <p className="mt-4 text-xs leading-relaxed text-muted">{response.safetyNotice}</p>
        </>
      )}

      <p className="mt-3 text-[11px] text-muted">
        {response.source === "gemini"
          ? "Structured response from Google Gemini. Suggestions only — the app never takes an action on your behalf."
          : response.source === "safety-rule"
            ? "Shown by SisterStop's own safety rule, not by the AI model."
            : "Showing SisterStop's built-in support copy while the AI service is unavailable."}
      </p>
    </section>
  );
};

export default CalmCoachCard;
