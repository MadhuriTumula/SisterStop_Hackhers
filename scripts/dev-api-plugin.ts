import fs from "node:fs";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { loadEnv, type Plugin } from "vite";

/**
 * Runs the Vercel-style handlers in api/ on the Vite dev server so that
 * `npm run dev` behaves exactly like the deployed app: same routes, same
 * fallbacks, same payloads. Production still uses Vercel's own runtime.
 */

const readJsonBody = (req: IncomingMessage): Promise<unknown> =>
  new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });

const decorateResponse = (res: ServerResponse) => {
  const decorated = res as ServerResponse & {
    status: (code: number) => typeof decorated;
    json: (data: unknown) => typeof decorated;
    send: (data: unknown) => typeof decorated;
  };

  decorated.status = (code: number) => {
    decorated.statusCode = code;
    return decorated;
  };

  decorated.json = (data: unknown) => {
    if (!decorated.headersSent) {
      decorated.setHeader("Content-Type", "application/json; charset=utf-8");
    }
    decorated.end(JSON.stringify(data));
    return decorated;
  };

  decorated.send = (data: unknown) => {
    if (Buffer.isBuffer(data)) {
      decorated.end(data);
    } else if (typeof data === "string") {
      decorated.end(data);
    } else {
      decorated.json(data);
    }
    return decorated;
  };

  return decorated;
};

export function devApiPlugin(): Plugin {
  return {
    name: "marta-mate-dev-api",

    config(_config, { mode }) {
      // Server-only secrets (GEMINI_API_KEY, ELEVENLABS_API_KEY, DATABASE_URL)
      // never reach the client bundle, so they must be pushed into process.env
      // for the dev handlers to read.
      const env = loadEnv(mode, process.cwd(), "");
      for (const [key, value] of Object.entries(env)) {
        if (!key.startsWith("VITE_") && process.env[key] === undefined) {
          process.env[key] = value;
        }
      }
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/")) return next();

        const url = new URL(req.url, "http://localhost");
        const route = url.pathname.replace(/^\/api\//, "").replace(/\/+$/, "");
        if (!/^[a-z0-9-]+$/.test(route)) return next();

        const handlerPath = path.resolve(process.cwd(), "api", `${route}.ts`);
        if (!fs.existsSync(handlerPath)) return next();

        try {
          const module = await server.ssrLoadModule(`/api/${route}.ts`);
          const handler = module.default as (
            request: unknown,
            response: unknown,
          ) => Promise<void> | void;

          const body = req.method === "POST" ? await readJsonBody(req) : {};
          const request = Object.assign(req, {
            body,
            query: Object.fromEntries(url.searchParams.entries()),
          });

          await handler(request, decorateResponse(res));
        } catch (error) {
          server.config.logger.error(`[dev-api] ${route} failed: ${String(error)}`);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
          }
          res.end(JSON.stringify({ error: "Dev API handler failed" }));
        }
      });
    },
  };
}
