# Frontend rules (src/)

React 18 + TypeScript + Tailwind v4. Small composable components, named prop
interfaces, no default-exported god components.

## Implementation

- Icons from `lucide-react`; `aria-label` on every icon-only button.
- Tailwind utilities; shared component classes live in `src/index.css`
  (`.card`, `.btn-*`, `.chip`, `.field`). Tailwind v4 cannot `@apply` a custom
  class — comma-group selectors instead.
- **Color always comes from a token** — `bg-surface`, `text-muted`, `bg-elevated`,
  `text-brand-soft`, `bg-scrim`, `text-alert-ink`, and so on. A literal hex or a
  `bg-slate-800` will not follow the light/dark switch. Both palettes live in
  `src/index.css`; add a token there rather than a one-off color in a component.
- Read the active theme with `useTheme()` when a non-CSS surface needs it
  (canvas, charts, a third-party component's inline styles).
- Framer Motion only for modals and the breathing orb. **Content reveals use
  `.animate-fade-up`**, never a JS animation that starts at `opacity: 0`.
- Always ship loading, empty, and error states.
- Responsive from 390px through desktop; touch targets ≥ 44px (`min-h-11`).
- Never communicate status with color alone — pair it with text or an icon.
- Keep user-facing copy in `src/lib/constants.ts`, not inline in components.

## Safety constraints in the UI

- Calm, concise, non-alarmist. No "guaranteed safe", "we will protect you",
  "emergency response", "threat detection", or "we contacted police".
- Every peer-match screen shows leave, block, and report.
- Buddy cards show alias, route, station zone, and departure window — never an
  address, coordinate, phone number, or legal name.
- Urgent states say plainly: call 911. Never imply the app will intervene.
- The public alias and the Auth0 identity stay visually separate; never render a
  token or a raw profile field.

## State

`useTripSession` owns the trip, the active match, blocked riders, and check-in
count (sessionStorage). `useSession` wraps Auth0 or a clearly labelled local
fallback — components read `useSession()`, never `useAuth0()` directly.
