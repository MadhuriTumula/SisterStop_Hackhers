import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LogIn, LogOut, ShieldCheck, User } from "lucide-react";
import { useSession } from "../hooks/useSession";

/**
 * Sign-in surface. The account identity (Auth0) and the public alias shown to
 * other riders are deliberately kept separate everywhere in the UI.
 */
const UserMenu = () => {
  const { isAuthenticated, isLoading, user, signIn, signOut, mode } = useSession();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-elevated" aria-hidden="true" />;
  }

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        className="btn-primary h-9 shrink-0 whitespace-nowrap px-3 text-xs sm:px-4"
        onClick={signIn}
      >
        <LogIn className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">
          {mode === "auth0" ? "Continue securely" : "Demo sign-in"}
        </span>
        <span className="sm:hidden">Sign in</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="btn-secondary h-9 max-w-[9rem] shrink-0 px-3 text-xs"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-brand/20 text-[11px] font-semibold text-brand-soft">
          {user?.alias?.charAt(0).toUpperCase() ?? "R"}
        </span>
        <span className="truncate">{user?.alias}</span>
        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {open ? (
        <div
          role="menu"
          className="card-elevated absolute right-0 z-50 mt-2 w-60 p-2 text-sm"
          onMouseLeave={() => setOpen(false)}
        >
          <p className="flex items-center gap-2 px-3 py-2 text-xs text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-calm" aria-hidden="true" />
            {mode === "auth0"
              ? "Signed in with Auth0"
              : "Local demo session (Auth0 not configured)"}
          </p>
          <Link
            to="/profile"
            role="menuitem"
            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-elevated"
            onClick={() => setOpen(false)}
          >
            <User className="h-4 w-4" aria-hidden="true" />
            Profile & preferences
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-elevated"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default UserMenu;
