import { Moon, MonitorSmartphone, Sun } from "lucide-react";
import { useTheme, type ThemePreference } from "../hooks/useTheme";
import { cn } from "../lib/utils";

const OPTIONS: {
  id: ThemePreference;
  label: string;
  icon: typeof Sun;
}[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "system", label: "System", icon: MonitorSmartphone },
  { id: "dark", label: "Dark", icon: Moon },
];

/**
 * Three explicit states rather than a two-way switch: "system" has to stay
 * reachable, otherwise a rider who taps once can never get back to following
 * their phone's night setting.
 */
const ThemeToggle = ({ className }: { className?: string }) => {
  const { preference, setPreference } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-hairline bg-elevated/70 p-0.5",
        className,
      )}
    >
      {OPTIONS.map(({ id, label, icon: Icon }) => {
        const active = preference === id;

        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            onClick={() => setPreference(id)}
            className={cn(
              "grid h-8 w-8 place-items-center rounded-full transition-colors",
              active
                ? "bg-brand/15 text-brand-soft ring-1 ring-inset ring-brand/40"
                : "text-muted hover:text-paper",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
