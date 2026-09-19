import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { devApiPlugin } from "./scripts/dev-api-plugin";

// The api/ folder holds Vercel serverless functions. `vite dev` does not run
// them, so devApiPlugin mounts the same handlers on the dev server. That keeps
// the demo identical locally and in production.
export default defineConfig({
  plugins: [react(), tailwindcss(), devApiPlugin()],
  server: {
    // Must match the Auth0 application's Allowed Callback/Logout/Web Origin
    // URLs exactly. strictPort makes a busy port fail loudly instead of
    // silently moving to 5175 and breaking the login redirect.
    port: 5174,
    strictPort: true,
  },
});
