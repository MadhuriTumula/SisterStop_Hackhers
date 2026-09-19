import { motion } from "framer-motion";
import { KeyRound, X } from "lucide-react";
import { useSession } from "../hooks/useSession";

interface SignInPromptModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  onContinueAnyway?: () => void;
}

/**
 * Shown when an unauthenticated rider tries to save something. Judges can
 * always continue without an account, so the demo never dead-ends at a login.
 */
const SignInPromptModal = ({
  open,
  title = "Sign in to save this match",
  description = "Secure sign-in keeps your saved matches, check-ins, and preferences tied to you — and keeps your account identity separate from the alias other riders see.",
  onClose,
  onContinueAnyway,
}: SignInPromptModalProps) => {
  const { signIn, mode } = useSession();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-prompt-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="card-elevated w-full max-w-md p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <span className="rounded-full bg-brand/15 p-2 text-brand-soft">
            <KeyRound className="h-5 w-5" aria-hidden="true" />
          </span>
          <button
            type="button"
            className="btn-ghost h-8 w-8 p-0"
            onClick={onClose}
            aria-label="Close sign-in prompt"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <h2 id="signin-prompt-title" className="text-lg font-semibold">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button type="button" className="btn-primary flex-1" onClick={signIn}>
            {mode === "auth0" ? "Continue securely with Auth0" : "Use local demo sign-in"}
          </button>
          {onContinueAnyway ? (
            <button type="button" className="btn-secondary flex-1" onClick={onContinueAnyway}>
              Continue in preview
            </button>
          ) : null}
        </div>

        {mode === "demo" ? (
          <p className="mt-4 text-xs text-muted">
            Auth0 credentials are not configured in this environment, so a clearly
            labelled local session stands in for real authentication.
          </p>
        ) : null}
      </motion.div>
    </div>
  );
};

export default SignInPromptModal;
