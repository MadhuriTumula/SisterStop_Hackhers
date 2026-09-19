import type { TrustedContact } from "../types/safety";

/**
 * Prototype contacts. Handles are masked on purpose — SisterStop does not
 * store real phone numbers or send real messages in this build.
 */
export const mockTrustedContacts: TrustedContact[] = [
  {
    id: "contact-sister",
    alias: "Dee",
    relationship: "Sister",
    maskedHandle: "+1 (•••) •••-4127",
    preferredChannel: "text",
  },
  {
    id: "contact-roommate",
    alias: "Bri",
    relationship: "Roommate",
    maskedHandle: "+1 (•••) •••-8890",
    preferredChannel: "call",
  },
  {
    id: "contact-charge-nurse",
    alias: "Night charge nurse",
    relationship: "Work",
    maskedHandle: "unit line •••-2210",
    preferredChannel: "app",
  },
];
