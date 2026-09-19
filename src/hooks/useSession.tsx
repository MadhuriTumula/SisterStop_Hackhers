import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";

/**
 * One session surface for the whole app.
 *
 * Auth0 is the real implementation. When Auth0 env vars are absent (a fresh
 * clone, an offline demo), a clearly labelled local fallback keeps every screen
 * reachable — judges never hit a dead end, and the app never pretends the
 * fallback is real authentication.
 */

export type SessionMode = "auth0" | "demo";

export interface SessionUser {
  alias: string;
  email?: string;
  picture?: string;
}

export interface SessionValue {
  mode: SessionMode;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: SessionUser | null;
  /** True when real Auth0 credentials are configured. */
  auth0Configured: boolean;
  /** Judges browsing without an account. */
  isPreview: boolean;
  signIn: () => void;
  signUp: () => void;
  signOut: () => void;
  startPreview: () => void;
  endPreview: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);

const PREVIEW_KEY = "sisterstop.preview";
const DEMO_USER_KEY = "sisterstop.demoUser";

const usePreviewFlag = () => {
  const [isPreview, setIsPreview] = useState<boolean>(
    () => localStorage.getItem(PREVIEW_KEY) === "true",
  );

  const startPreview = useCallback(() => {
    localStorage.setItem(PREVIEW_KEY, "true");
    setIsPreview(true);
  }, []);

  const endPreview = useCallback(() => {
    localStorage.removeItem(PREVIEW_KEY);
    setIsPreview(false);
  }, []);

  return { isPreview, startPreview, endPreview };
};

/**
 * Auth0 refuses to be framed, so from inside the phone-preview iframe the login
 * page must open in the top window rather than the frame.
 */
const openLoginUrl = (url: string) => {
  if (window.top && window.top !== window.self) {
    window.top.location.assign(url);
    return;
  }
  window.location.assign(url);
};

const Auth0SessionProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  const { isPreview, startPreview, endPreview } = usePreviewFlag();

  const value = useMemo<SessionValue>(
    () => ({
      mode: "auth0",
      isAuthenticated,
      isLoading,
      auth0Configured: true,
      isPreview,
      user: isAuthenticated
        ? {
            // Alias first: the public identity is never the account email.
            alias:
              user?.nickname ||
              user?.given_name ||
              user?.name?.split(" ")[0] ||
              "Rider",
            email: user?.email,
            picture: user?.picture,
          }
        : null,
      signIn: () => {
        endPreview();
        void loginWithRedirect({ openUrl: openLoginUrl });
      },
      signUp: () => {
        endPreview();
        void loginWithRedirect({
          authorizationParams: { screen_hint: "signup" },
          openUrl: openLoginUrl,
        });
      },
      signOut: () => {
        endPreview();
        void logout({ logoutParams: { returnTo: window.location.origin } });
      },
      startPreview,
      endPreview,
    }),
    [isAuthenticated, isLoading, isPreview, user, loginWithRedirect, logout, startPreview, endPreview],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

const DemoSessionProvider = ({ children }: { children: ReactNode }) => {
  const [alias, setAlias] = useState<string | null>(() =>
    localStorage.getItem(DEMO_USER_KEY),
  );
  const { isPreview, startPreview, endPreview } = usePreviewFlag();

  const value = useMemo<SessionValue>(
    () => ({
      mode: "demo",
      isAuthenticated: Boolean(alias),
      isLoading: false,
      auth0Configured: false,
      isPreview,
      user: alias ? { alias } : null,
      signIn: () => {
        endPreview();
        localStorage.setItem(DEMO_USER_KEY, "Demo Rider");
        setAlias("Demo Rider");
      },
      // No account to create without Auth0 — reuse the local demo session.
      signUp: () => {
        endPreview();
        localStorage.setItem(DEMO_USER_KEY, "Demo Rider");
        setAlias("Demo Rider");
      },
      signOut: () => {
        localStorage.removeItem(DEMO_USER_KEY);
        setAlias(null);
      },
      startPreview,
      endPreview,
    }),
    [alias, isPreview, startPreview, endPreview],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const SessionProvider = ({
  auth0Configured,
  children,
}: {
  auth0Configured: boolean;
  children: ReactNode;
}) =>
  auth0Configured ? (
    <Auth0SessionProvider>{children}</Auth0SessionProvider>
  ) : (
    <DemoSessionProvider>{children}</DemoSessionProvider>
  );

export const useSession = (): SessionValue => {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within a SessionProvider");
  return context;
};

/** Title-cases the first word of an alias for greetings. */
export const useGreetingName = (): string => {
  const { user } = useSession();
  return user?.alias ?? "rider";
};

export const useSyncPreviewOnAuth = () => {
  const { isAuthenticated, isPreview, endPreview } = useSession();
  useEffect(() => {
    if (isAuthenticated && isPreview) endPreview();
  }, [isAuthenticated, isPreview, endPreview]);
};
