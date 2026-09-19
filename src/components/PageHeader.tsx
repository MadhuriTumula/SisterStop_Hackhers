import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

const PageHeader = ({ eyebrow, title, description, action }: PageHeaderProps) => (
  <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow ? (
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-calm">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
      ) : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </header>
);

export default PageHeader;
