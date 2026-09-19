import { motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";
import type { BuddyProfile } from "../types/buddy";

interface MatchSuccessModalProps {
  buddy: BuddyProfile | null;
  overlapSummary: string;
  onContinue: () => void;
  onClose: () => void;
}

const MatchSuccessModal = ({
  buddy,
  overlapSummary,
  onContinue,
  onClose,
}: MatchSuccessModalProps) => {
  if (!buddy) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-success-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="card-elevated w-full max-w-md p-6 text-center"
      >
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-calm/15 text-calm"
        >
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </motion.span>

        <h2 id="match-success-title" className="text-xl font-semibold">
          You and {buddy.alias} are matched
        </h2>
        <p className="mt-2 text-sm text-muted">{overlapSummary}</p>

        <p className="mt-4 flex items-start gap-2 rounded-xl bg-elevated/70 p-3 text-left text-xs text-muted">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-calm" aria-hidden="true" />
          Your exact destination, contact details, and legal name stay private. Either of
          you can leave this match at any time without giving a reason.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button type="button" className="btn-primary flex-1" onClick={onContinue}>
            Open match details
          </button>
          <button type="button" className="btn-secondary flex-1" onClick={onClose}>
            Keep browsing
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MatchSuccessModal;
