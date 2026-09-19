import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Vibrate } from "lucide-react";
import { cn, prefersReducedMotion, vibrate } from "../lib/utils";

type Phase = { id: "inhale" | "hold" | "exhale"; label: string; seconds: number };

const PHASES: Phase[] = [
  { id: "inhale", label: "Breathe in", seconds: 4 },
  { id: "hold", label: "Hold", seconds: 4 },
  { id: "exhale", label: "Breathe out", seconds: 6 },
];

const SENSES = [
  { count: 5, sense: "things you can see", hint: "A light, a sign, your own hands." },
  { count: 4, sense: "things you can feel", hint: "Your bag strap, the bench, your coat." },
  { count: 3, sense: "things you can hear", hint: "An announcement, traffic, your breath." },
  { count: 2, sense: "things you can smell", hint: "Rain, coffee, night air." },
  { count: 1, sense: "thing that steadies you", hint: "A person, a plan, a song." },
];

/**
 * Breathing orb + 5-4-3-2-1. Motion is decorative only: with reduced motion
 * the same timing is conveyed by the phase label and the countdown.
 */
const GroundingCanvas = () => {
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [remaining, setRemaining] = useState(PHASES[0].seconds);
  const [cycles, setCycles] = useState(0);
  const [hapticsOn, setHapticsOn] = useState(false);
  const timerRef = useRef<number | null>(null);
  const reduceMotion = useMemo(prefersReducedMotion, []);

  const phase = PHASES[phaseIndex];

  useEffect(() => {
    if (!running) return;

    timerRef.current = window.setInterval(() => {
      setRemaining((value) => {
        if (value > 1) return value - 1;

        setPhaseIndex((index) => {
          const next = (index + 1) % PHASES.length;
          if (next === 0) setCycles((count) => count + 1);
          if (hapticsOn) vibrate(next === 2 ? [90, 40, 90] : 60);
          return next;
        });

        return PHASES[(phaseIndex + 1) % PHASES.length].seconds;
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [running, phaseIndex, hapticsOn]);

  const toggle = () => {
    setRunning((value) => {
      const next = !value;
      if (next && hapticsOn) vibrate(40);
      return next;
    });
  };

  const scale = phase.id === "inhale" ? 1.18 : phase.id === "hold" ? 1.12 : 0.86;

  return (
    <section className="card p-6" aria-label="Breathing and grounding exercise">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        <div className="relative grid h-48 w-48 shrink-0 place-items-center">
          <motion.div
            className="absolute inset-4 rounded-full bg-brand/20 blur-xl"
            animate={reduceMotion ? undefined : { scale: running ? scale : 1 }}
            transition={{ duration: running ? phase.seconds : 0.4, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-6 rounded-full border border-calm/40 bg-gradient-to-br from-brand/40 to-calm/30"
            animate={reduceMotion ? undefined : { scale: running ? scale : 1 }}
            transition={{ duration: running ? phase.seconds : 0.4, ease: "easeInOut" }}
          />
          <div className="relative text-center">
            <p className="text-sm font-medium text-paper" aria-live="polite">
              {running ? phase.label : "Ready when you are"}
            </p>
            <p className="text-3xl font-semibold tabular-nums text-calm">
              {running ? remaining : PHASES[0].seconds}
            </p>
            <p className="text-xs text-muted">
              {cycles} {cycles === 1 ? "round" : "rounds"}
            </p>
          </div>
        </div>

        <div className="w-full">
          <h3 className="text-lg font-semibold">Inhale 4 · Hold 4 · Exhale 6</h3>
          <p className="mt-1 text-sm text-muted">
            A longer exhale than inhale is a simple way to settle your body while you wait.
            Stop any time — there is no streak to keep.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={toggle}>
              {running ? (
                <>
                  <Pause className="h-4 w-4" aria-hidden="true" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" aria-hidden="true" /> Start breathing
                </>
              )}
            </button>
            <button
              type="button"
              className={cn("btn-secondary", hapticsOn && "border-calm/60 text-calm")}
              aria-pressed={hapticsOn}
              onClick={() => {
                const next = !hapticsOn;
                setHapticsOn(next);
                if (next) vibrate(50);
              }}
            >
              <Vibrate className="h-4 w-4" aria-hidden="true" />
              {hapticsOn ? "Haptics on" : "Haptic pulse"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-hairline/70 pt-5">
        <h3 className="text-sm font-semibold">Notice your surroundings: 5-4-3-2-1</h3>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {SENSES.map(({ count, sense, hint }) => (
            <li key={sense} className="flex items-start gap-3 rounded-xl bg-elevated/60 p-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-calm/15 text-sm font-semibold text-calm">
                {count}
              </span>
              <span className="text-sm">
                <span className="text-paper">{sense}</span>
                <span className="block text-xs text-muted">{hint}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default GroundingCanvas;
