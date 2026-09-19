import { NavLink } from "react-router-dom";
import { Activity, HeartPulse, MapPin, ShieldAlert, Users } from "lucide-react";
import { cn } from "../lib/utils";

const items = [
  { to: "/plan", label: "Plan", icon: MapPin },
  { to: "/buddies", label: "Buddies", icon: Users },
  { to: "/calm", label: "Calm", icon: HeartPulse },
  { to: "/pulse", label: "Pulse", icon: Activity },
  { to: "/safety", label: "Safety", icon: ShieldAlert },
];

const BottomNav = () => (
  <nav
    aria-label="Primary"
    className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
  >
    <ul className="mx-auto flex max-w-3xl">
      {items.map(({ to, label, icon: Icon }) => (
        <li key={to} className="flex-1">
          <NavLink
            to={to}
            className={({ isActive }) =>
              cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                isActive ? "text-paper" : "text-muted hover:text-paper",
                label === "Safety" && "text-safety hover:text-safety",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]")}
                  aria-hidden="true"
                />
                <span>{label}</span>
                <span
                  className={cn(
                    "h-0.5 w-6 rounded-full",
                    isActive ? "bg-brand" : "bg-transparent",
                  )}
                />
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

export default BottomNav;
