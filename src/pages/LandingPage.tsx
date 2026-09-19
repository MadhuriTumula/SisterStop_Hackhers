import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  AudioLines,
  HeartPulse,
  Lock,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { useSession } from "../hooks/useSession";
import { APP_TAGLINE, PRIVACY_POINTS } from "../lib/constants";
import { PROTOTYPE_DISCLAIMER } from "../lib/safety";

const FEATURES = [
  {
    icon: Users,
    title: "Virtual Buddies",
    body: "Opt-in matches with riders on your route and departure window. Aliases only — no live map, no addresses.",
    to: "/buddies",
  },
  {
    icon: HeartPulse,
    title: "Calm Mode",
    body: "A breathing orb, a 5-4-3-2-1 exercise, and short AI support written for a delayed platform, not a therapy session.",
    to: "/calm",
  },
  {
    icon: ShieldAlert,
    title: "Safety Hub",
    body: "911, MARTA Police call and text, and official reporting — always one tap away from every screen.",
    to: "/safety",
  },
];

const STEPS = [
  "Plan your trip: station area, route, and a 15-minute departure window.",
  "See riders whose route and window overlap with yours, and request a match.",
  "If the wait gets long, open Calm Mode for grounding, comfort audio, or a check-in.",
  "Check in when you arrive — or leave the match at any point, no reason needed.",
];

const LandingPage = () => {
  const { isAuthenticated, signIn, startPreview, mode } = useSession();
  const navigate = useNavigate();

  const previewDemo = () => {
    startPreview();
    navigate("/plan");
  };

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[var(--radius-card)] border border-hairline/70 bg-surface/60 px-6 py-12 sm:px-10 sm:py-16">
        <div className="animate-fade-up relative max-w-2xl">
          <span className="chip bg-brand/10 text-brand-soft ring-brand/30">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Built for late shifts and early mornings
          </span>

          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            {APP_TAGLINE}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            MARTA MATE is a companion for riders whose schedules do not match the
            9-to-5: nurses, hospitality and retail staff, students, and caregivers.
            Find a buddy on your route, steady yourself during a delay, and keep
            official safety options one tap away.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isAuthenticated ? (
              <Link to="/plan" className="btn-primary px-6">
                Plan a safer-feeling commute
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : (
              <button type="button" className="btn-primary px-6" onClick={signIn}>
                {mode === "auth0" ? "Continue securely with Auth0" : "Start with a demo session"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <button type="button" className="btn-secondary px-6" onClick={previewDemo}>
              Preview demo without an account
            </button>
          </div>

          <p className="mt-4 text-xs text-muted">
            You control what you share. {PROTOTYPE_DISCLAIMER}
          </p>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-10 h-64 w-64 rounded-full bg-calm/15 blur-3xl"
        />
      </section>

      <section aria-labelledby="features-title">
        <h2 id="features-title" className="text-xl font-semibold">
          Three things it does well
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, to }) => (
            <Link
              key={title}
              to={to}
              className="card group flex flex-col gap-3 p-5 transition-colors hover:border-brand/50"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/15 text-brand-soft">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{body}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-soft">
                Open
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="how-title" id="how-it-works">
        <h2 id="how-title" className="text-xl font-semibold">
          How it works
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {STEPS.map((step, index) => (
            <li key={step} className="card flex gap-3 p-4">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-calm/15 text-sm font-semibold text-calm">
                {index + 1}
              </span>
              <p className="text-sm leading-relaxed text-muted">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="privacy-title" className="card p-6">
        <h2 id="privacy-title" className="flex items-center gap-2 text-xl font-semibold">
          <Lock className="h-5 w-5 text-calm" aria-hidden="true" />
          Our privacy promise
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {PRIVACY_POINTS.map((point) => (
            <li key={point} className="flex gap-2 text-sm text-muted">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-calm" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
        <p className="mt-5 flex items-start gap-2 rounded-xl bg-elevated/70 p-4 text-sm text-muted">
          <AudioLines className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" aria-hidden="true" />
          Comfort audio is clearly labelled as a comfort tool. MARTA MATE never imitates
          police, dispatch, transit staff, or a real person, and it cannot contact anyone
          on your behalf.
        </p>
      </section>
    </div>
  );
};

export default LandingPage;
