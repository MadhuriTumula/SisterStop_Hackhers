export type SafetyResourceKind = "emergency" | "transit" | "support" | "in_app";

export interface SafetyResource {
  id: string;
  kind: SafetyResourceKind;
  label: string;
  description: string;
  /** tel:, sms:, or https: — always an official destination. */
  href?: string;
  actionLabel: string;
}

export interface TrustedContact {
  id: string;
  /** Alias chosen by the rider, not a stored phone book entry. */
  alias: string;
  relationship: string;
  /** Masked on purpose — the prototype never stores real contact details. */
  maskedHandle: string;
  preferredChannel: "text" | "call" | "app";
}
