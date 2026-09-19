import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldAlert, Smartphone } from "lucide-react";
import BottomNav from "./BottomNav";
import UserMenu from "./UserMenu";
import IntegrationStatus from "./IntegrationStatus";
import ThemeToggle from "./ThemeToggle";
import PhonePreviewFrame from "./PhonePreviewFrame";
import { cn } from "../lib/utils";
import { APP_NAME } from "../lib/constants";
import { PROTOTYPE_DISCLAIMER } from "../lib/safety";
import { useSession, useSyncPreviewOnAuth } from "../hooks/useSession";

const AppShell = ({ children }: { children: ReactNode }) => {
  const { isPreview, isAuthenticated, signIn } = useSession();
  const { pathname, search } = useLocation();
  // `?preview=phone` opens straight into the frame, so the mobile view can be
  // linked to directly — handy for a demo video or a message to a teammate.
  const [phonePreview, setPhonePreview] = useState(
    () => new URLSearchParams(window.location.search).get("preview") === "phone",
  );
  useSyncPreviewOnAuth();

  // The instance rendered inside the preview iframe must not offer a preview
  // of its own, and does not need the desktop chrome around it.
  const isFramed = new URLSearchParams(search).has("phone");

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-elevated focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-hairline/70 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${APP_NAME} home`}>
            <img src="/sisterstop-mark.svg" alt="" className="h-8 w-8" aria-hidden="true" />
            <span className="whitespace-nowrap text-sm font-semibold tracking-tight sm:text-base">
              Sister<span className="text-brand-soft">Stop</span>
            </span>
          </Link>

          <IntegrationStatus className="ml-2 hidden min-w-0 xl:flex" />

          <div className="ml-auto flex shrink-0 items-center gap-2">
            {pathname !== "/safety" ? (
              <Link
                to="/safety"
                className="chip whitespace-nowrap bg-safety/10 text-safety ring-safety/30 hover:bg-safety/20"
              >
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Need help now?</span>
                <span className="sm:hidden">Help</span>
              </Link>
            ) : null}
            {!isFramed ? (
              <button
                type="button"
                aria-pressed={phonePreview}
                title="Preview the mobile layout"
                onClick={() => setPhonePreview((value) => !value)}
                className={cn(
                  "chip hidden min-h-8 whitespace-nowrap lg:inline-flex",
                  phonePreview
                    ? "bg-brand/15 text-brand-soft ring-brand/40"
                    : "bg-elevated text-muted ring-hairline hover:text-paper",
                )}
              >
                <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
                Phone preview
              </button>
            ) : null}
            <ThemeToggle className="hidden sm:flex" />
            <UserMenu />
          </div>
        </div>

        {isPreview && !isAuthenticated ? (
          <p className="border-t border-hairline/60 bg-elevated/70 px-4 py-2 text-center text-xs text-muted">
            Preview mode — matches and check-ins are not saved.{" "}
            <button type="button" className="font-semibold text-brand-soft underline" onClick={signIn}>
              Sign in to save them
            </button>
          </p>
        ) : null}
      </header>

      <main
        id="main"
        className={cn(
          "mx-auto w-full max-w-5xl flex-1 px-4 pt-6",
          phonePreview && !isFramed ? "pb-8" : "pb-28",
        )}
      >
        {phonePreview && !isFramed ? <PhonePreviewFrame /> : children}
      </main>

      <footer
        className={cn(
          "mx-auto w-full max-w-5xl px-4",
          phonePreview && !isFramed ? "pb-8" : "pb-24",
        )}
      >
        <IntegrationStatus className="mb-3 xl:hidden" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-2xl text-xs leading-relaxed text-muted">
            {PROTOTYPE_DISCLAIMER}
          </p>
          <ThemeToggle className="sm:hidden" />
        </div>
      </footer>

      {phonePreview && !isFramed ? null : <BottomNav />}
    </div>
  );
};

export default AppShell;
