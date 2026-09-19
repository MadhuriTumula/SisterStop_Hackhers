import { useState } from "react";
import {
  AudioLines,
  Loader2,
  PhoneCall,
  Play,
  Sparkles,
  Square,
  TriangleAlert,
} from "lucide-react";
import { AUDIO_DISCLAIMER, AUDIO_TOOLS } from "../lib/constants";
import { useAudioTool } from "../hooks/useAudioTool";
import { useTripSession } from "../hooks/useTripSession";
import { cn } from "../lib/utils";

const SOURCE_LABEL: Record<string, string> = {
  elevenlabs: "ElevenLabs voice",
  file: "Pre-generated ElevenLabs clip",
  speech: "Device voice fallback",
};

const LIVE_CALL_ID = "live_companion_call";

/**
 * Comfort audio. Nothing plays without an explicit tap, and every mode is
 * labelled as a comfort tool — never as police, dispatch, or transit staff.
 */
const AudioToolCard = () => {
  const { activeId, status, source, play, playText, stop } = useAudioTool();
  const { trip } = useTripSession();
  const [transcript, setTranscript] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);

  const liveActive = activeId === LIVE_CALL_ID;

  /** Gemini writes the line for this trip; ElevenLabs then speaks it. */
  const startLiveCall = async () => {
    if (liveActive) {
      stop();
      return;
    }

    setWriting(true);
    setTranscript(null);

    try {
      const response = await fetch("/api/companion-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          route: trip.route,
          stationZone: trip.originStation,
          departureWindow: trip.departureWindow,
          feeling: trip.comfortPreference,
        }),
      });

      const payload = (await response.json()) as { text?: string };
      if (!payload.text) return;

      setTranscript(payload.text);
      await playText(LIVE_CALL_ID, payload.text);
    } catch {
      setTranscript(null);
    } finally {
      setWriting(false);
    }
  };

  return (
    <section className="card p-5" aria-label="Comfort audio">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <AudioLines className="h-5 w-5 text-calm" aria-hidden="true" />
            Comfort audio
          </h2>
          <p className="mt-1 text-sm text-muted">
            A voice for the moments when the platform feels too quiet.
          </p>
        </div>
        {source && status === "playing" ? (
          <span className="chip bg-calm/10 text-calm ring-calm/30">{SOURCE_LABEL[source]}</span>
        ) : null}
      </div>

      <article className="mb-4 rounded-xl border border-brand/40 bg-brand/5 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <PhoneCall className="h-4 w-4 text-brand-soft" aria-hidden="true" />
              Live companion call
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Gemini writes the words for tonight&apos;s trip — your route, station
              area, and departure window — and ElevenLabs speaks them back to you.
            </p>
          </div>
          <span className="chip bg-elevated text-muted ring-hairline">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Written live
          </span>
        </div>

        {transcript ? (
          <blockquote className="mt-3 rounded-lg bg-ink/50 p-3 text-sm italic leading-relaxed">
            &ldquo;{transcript}&rdquo;
          </blockquote>
        ) : null}

        <button
          type="button"
          className="btn-primary mt-3 w-full sm:w-auto"
          onClick={() => void startLiveCall()}
          disabled={writing || (liveActive && status === "loading")}
        >
          {writing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Writing your call…
            </>
          ) : liveActive && status === "playing" ? (
            <>
              <Square className="h-4 w-4" aria-hidden="true" />
              End call
            </>
          ) : (
            <>
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              Start a companion call
            </>
          )}
        </button>
      </article>

      <h3 className="mb-2 text-xs uppercase tracking-wide text-muted">
        Or play a ready-made clip
      </h3>

      <ul className="grid gap-3 sm:grid-cols-3">
        {AUDIO_TOOLS.map((tool) => {
          const isActive = activeId === tool.id;
          const isLoading = isActive && status === "loading";
          const isPlaying = isActive && status === "playing";

          return (
            <li key={tool.id}>
              <div
                className={cn(
                  "flex h-full flex-col gap-3 rounded-xl border p-4 transition-colors",
                  isPlaying
                    ? "border-calm/60 bg-calm/5"
                    : "border-hairline bg-elevated/50",
                )}
              >
                <div>
                  <h3 className="text-sm font-semibold">{tool.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{tool.purpose}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-muted">
                    {tool.durationHint}
                  </p>
                </div>

                <button
                  type="button"
                  className={cn("btn-secondary mt-auto w-full", isPlaying && "border-calm/60")}
                  onClick={() => (isPlaying ? stop() : void play(tool.id))}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Preparing
                    </>
                  ) : isPlaying ? (
                    <>
                      <Square className="h-4 w-4" aria-hidden="true" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" aria-hidden="true" />
                      Play
                    </>
                  )}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {status === "error" ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-safety" role="status">
          <TriangleAlert className="h-4 w-4" aria-hidden="true" />
          Audio could not play on this device. The grounding steps above work without sound.
        </p>
      ) : null}

      <p className="mt-4 rounded-xl bg-elevated/60 p-3 text-xs text-muted">{AUDIO_DISCLAIMER}</p>
    </section>
  );
};

export default AudioToolCard;
