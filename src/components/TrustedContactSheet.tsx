import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ShieldCheck, X } from "lucide-react";
import { mockTrustedContacts } from "../data/mockTrustedContacts";
import type { TripRequest } from "../types/buddy";
import { cn } from "../lib/utils";

interface TrustedContactSheetProps {
  open: boolean;
  trip: TripRequest;
  onClose: () => void;
  onSend: (contactAlias: string) => void;
}

/**
 * Trip check-in. The prototype composes the message but does not send it —
 * the rider sees exactly what would be shared, and it is deliberately coarse:
 * route, station area, and an arrival window. Never a live location.
 */
const TrustedContactSheet = ({ open, trip, onClose, onSend }: TrustedContactSheetProps) => {
  const [selectedId, setSelectedId] = useState(mockTrustedContacts[0].id);

  if (!open) return null;

  const selected =
    mockTrustedContacts.find((contact) => contact.id === selectedId) ?? mockTrustedContacts[0];

  const preview = `Heads up — I'm on the ${trip.route} from the ${trip.originStation} area, leaving ${trip.departureWindow}, heading toward ${trip.destinationZone}. I'll check in when I'm home.`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trusted-contact-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="card-elevated w-full max-w-lg rounded-b-none p-6 sm:rounded-card"
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 id="trusted-contact-title" className="text-lg font-semibold">
            Share a trip check-in
          </h2>
          <button
            type="button"
            className="btn-ghost h-8 w-8 p-0"
            onClick={onClose}
            aria-label="Close check-in sheet"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <fieldset>
          <legend className="mb-2 text-xs uppercase tracking-wide text-muted">
            Trusted contact
          </legend>
          <div className="grid gap-2">
            {mockTrustedContacts.map((contact) => (
              <label
                key={contact.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm",
                  selectedId === contact.id
                    ? "border-brand/60 bg-brand/5"
                    : "border-hairline bg-elevated/50",
                )}
              >
                <input
                  type="radio"
                  name="trusted-contact"
                  value={contact.id}
                  checked={selectedId === contact.id}
                  onChange={() => setSelectedId(contact.id)}
                  className="h-4 w-4 accent-brand"
                />
                <span className="min-w-0 flex-1">
                  <span className="font-medium">{contact.alias}</span>
                  <span className="block text-xs text-muted">
                    {contact.relationship} · {contact.maskedHandle}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-muted">They will see</p>
          <p className="rounded-xl bg-elevated/70 p-3 text-sm leading-relaxed">{preview}</p>
        </div>

        <p className="mt-3 flex items-start gap-2 text-xs text-muted">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-calm" aria-hidden="true" />
          No live location, no exact address, and no phone number leaves your device. In this
          prototype the message is composed but not delivered.
        </p>

        <button
          type="button"
          className="btn-primary mt-5 w-full"
          onClick={() => onSend(selected.alias)}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Share check-in with {selected.alias}
        </button>
      </motion.div>
    </div>
  );
};

export default TrustedContactSheet;
