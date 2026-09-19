import type { MartaRoute } from "../types/buddy";

export interface RouteInfo {
  id: MartaRoute;
  kind: "rail" | "bus";
  /** Tailwind-friendly accent used for the route chip. */
  accent: string;
  blurb: string;
}

export const routes: RouteInfo[] = [
  {
    id: "Red Line",
    kind: "rail",
    accent: "text-rose-300 bg-rose-500/10 ring-rose-400/30",
    blurb: "North Springs ↔ Airport",
  },
  {
    id: "Gold Line",
    kind: "rail",
    accent: "text-amber-300 bg-amber-500/10 ring-amber-400/30",
    blurb: "Doraville ↔ Airport",
  },
  {
    id: "Blue Line",
    kind: "rail",
    accent: "text-sky-300 bg-sky-500/10 ring-sky-400/30",
    blurb: "Hamilton E. Holmes ↔ Indian Creek",
  },
  {
    id: "Green Line",
    kind: "rail",
    accent: "text-emerald-300 bg-emerald-500/10 ring-emerald-400/30",
    blurb: "Bankhead ↔ Edgewood/Candler Park",
  },
  {
    id: "Bus Route 40",
    kind: "bus",
    accent: "text-violet-300 bg-violet-500/10 ring-violet-400/30",
    blurb: "Downtown ↔ West End",
  },
  {
    id: "Bus Route 12",
    kind: "bus",
    accent: "text-teal-300 bg-teal-500/10 ring-teal-400/30",
    blurb: "Howell Mill ↔ Midtown",
  },
];

export const routeIds = routes.map((route) => route.id);

export const routeAccent = (route: string): string =>
  routes.find((item) => item.id === route)?.accent ??
  "text-slate-300 bg-slate-500/10 ring-slate-400/30";
