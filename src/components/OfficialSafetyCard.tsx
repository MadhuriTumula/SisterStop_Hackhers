import { ArrowUpRight, MessageSquare, PhoneCall, ShieldCheck, Users } from "lucide-react";
import type { SafetyResource } from "../types/safety";
import { cn } from "../lib/utils";

const KIND_STYLES: Record<SafetyResource["kind"], string> = {
  emergency: "border-alert/60 bg-alert/10",
  transit: "border-hairline bg-elevated/60",
  support: "border-hairline bg-elevated/60",
  in_app: "border-brand/40 bg-brand/5",
};

const iconFor = (resource: SafetyResource) => {
  if (resource.href?.startsWith("tel:")) return PhoneCall;
  if (resource.href?.startsWith("sms:")) return MessageSquare;
  if (resource.kind === "in_app") return Users;
  return ShieldCheck;
};

interface OfficialSafetyCardProps {
  resource: SafetyResource;
  onAction?: (resource: SafetyResource) => void;
}

const OfficialSafetyCard = ({ resource, onAction }: OfficialSafetyCardProps) => {
  const Icon = iconFor(resource);
  const isExternal = resource.href?.startsWith("http");

  return (
    <article className={cn("flex gap-3 rounded-card border p-4", KIND_STYLES[resource.kind])}>
      <span
        className={cn(
          "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full",
          resource.kind === "emergency" ? "bg-alert/20 text-alert" : "bg-ink/60 text-calm",
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold">{resource.label}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{resource.description}</p>

        {resource.href ? (
          <a
            href={resource.href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer noopener" : undefined}
            className={cn(
              "mt-3 inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold",
              resource.kind === "emergency" ? "text-alert" : "text-brand-soft",
            )}
          >
            {resource.actionLabel}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : (
          <button
            type="button"
            className="mt-3 inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-brand-soft"
            onClick={() => onAction?.(resource)}
          >
            {resource.actionLabel}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  );
};

export default OfficialSafetyCard;
