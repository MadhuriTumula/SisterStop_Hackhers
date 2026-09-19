import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Sparkles } from "lucide-react";
import PageHeader from "../components/PageHeader";
import CalmCoachCard from "../components/CalmCoachCard";
import GroundingCanvas from "../components/GroundingCanvas";
import AudioToolCard from "../components/AudioToolCard";
import SafetyBanner from "../components/SafetyBanner";
import { useCalmCoach } from "../hooks/useCalmCoach";
import { useTripSession } from "../hooks/useTripSession";
import { DELAY_CONTEXTS, FEELINGS } from "../lib/constants";
import { detectsUrgentLanguage } from "../lib/safety";
import type { CalmAction, CalmFeeling } from "../types/api";
import { cn } from "../lib/utils";

const CalmModePage = () => {
  const { trip, recordCheckIn } = useTripSession();
  const { status, response, ask, reset } = useCalmCoach();
  const [feeling, setFeeling] = useState<CalmFeeling>("uneasy");
  const [delayContext, setDelayContext] = useState<string>(DELAY_CONTEXTS[0]);
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const audioRef = useRef<HTMLDivElement | null>(null);
  const breathingRef = useRef<HTMLDivElement | null>(null);

  const noteIsUrgent = detectsUrgentLanguage(note);

  const submit = () => {
    void ask({
      stationZone: trip.originStation,
      route: trip.route,
      delayContext,
      feeling,
      preference: trip.comfortPreference,
      note: note.trim() || undefined,
    });
  };

  const handleAction = (action: CalmAction) => {
    if (action === "open_safety_hub") {
      navigate("/safety");
      return;
    }
    if (action === "play_audio") {
      audioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (action === "start_breathing") {
      breathingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    recordCheckIn();
    navigate("/safety");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Calm Mode"
        title="Steady yourself while you wait"
        description="Short, bounded support for a delayed platform: one message, one grounding step, one suggested action. Nothing here is medical advice."
      />

      <section className="card p-5" aria-label="Describe how the wait is going">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="h-5 w-5 text-brand-soft" aria-hidden="true" />
          How is this wait going?
        </h2>

        <fieldset className="mt-4">
          <legend className="text-xs uppercase tracking-wide text-muted">Right now I feel</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {FEELINGS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={feeling === item.id}
                onClick={() => setFeeling(item.id)}
                className={cn(
                  "min-h-11 rounded-xl border px-4 py-2 text-left text-sm transition-colors",
                  feeling === item.id
                    ? "border-brand/60 bg-brand/10 text-paper"
                    : "border-hairline bg-elevated/50 text-muted hover:text-paper",
                )}
              >
                <span className="block font-medium">{item.label}</span>
                <span className="block text-xs text-muted">{item.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="delay-context">
              What is happening
            </label>
            <select
              id="delay-context"
              className="field"
              value={delayContext}
              onChange={(event) => setDelayContext(event.target.value)}
            >
              {DELAY_CONTEXTS.map((context) => (
                <option key={context} value={context}>
                  {context}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="note">
              Anything you want to add <span className="font-normal text-muted">(optional)</span>
            </label>
            <input
              id="note"
              className="field"
              value={note}
              maxLength={160}
              placeholder="The platform is emptier than usual"
              onChange={(event) => setNote(event.target.value)}
            />
            <p className="mt-1.5 text-xs text-muted">
              Please leave out addresses, phone numbers, and names.
            </p>
          </div>
        </div>

        {noteIsUrgent ? (
          <SafetyBanner
            className="mt-4"
            tone="urgent"
            message="What you wrote sounds urgent, so SisterStop is showing this before anything else."
          />
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" className="btn-primary" onClick={submit} disabled={status === "loading"}>
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {status === "idle" ? "Get support" : "Ask again"}
          </button>
          <p className="text-xs text-muted">
            Sent to the Calm Coach: station area, route, what is happening, and how you feel.
          </p>
        </div>
      </section>

      <CalmCoachCard status={status} response={response} onAction={handleAction} onRetry={() => {
        reset();
        submit();
      }} />

      <div ref={breathingRef}>
        <GroundingCanvas />
      </div>

      <div ref={audioRef}>
        <AudioToolCard />
      </div>

      <SafetyBanner />
    </div>
  );
};

export default CalmModePage;
