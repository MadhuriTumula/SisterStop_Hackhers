import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import { SessionProvider } from "./hooks/useSession";
import "./index.css";

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined;

const auth0Configured = Boolean(domain && clientId);

const tree = auth0Configured ? (
  <Auth0Provider
    domain={domain as string}
    clientId={clientId as string}
    authorizationParams={{
      redirect_uri: window.location.origin,
      ...(audience ? { audience } : {}),
    }}
    cacheLocation="localstorage"
  >
    <SessionProvider auth0Configured>
      <App />
    </SessionProvider>
  </Auth0Provider>
) : (
  <SessionProvider auth0Configured={false}>
    <App />
  </SessionProvider>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{tree}</React.StrictMode>,
);
