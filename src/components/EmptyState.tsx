import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
}

const EmptyState = ({ icon: Icon, title, description, children }: EmptyStateProps) => (
  <div className="card flex flex-col items-center gap-3 px-6 py-10 text-center">
    <span className="rounded-full bg-elevated p-3 text-brand-soft">
      <Icon className="h-6 w-6" aria-hidden="true" />
    </span>
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="max-w-md text-sm text-muted">{description}</p>
    {children ? <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div> : null}
  </div>
);

export default EmptyState;
