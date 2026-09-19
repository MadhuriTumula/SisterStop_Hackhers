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
    port: 5173,
  },
});
