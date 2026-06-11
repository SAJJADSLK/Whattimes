import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";

import { appRouter } from "../../server/routers.js";
import { createContext } from "../../server/_core/context.js";
import { initCityCache } from "../../server/lib/cityCache.js";

export const config = {
  runtime: "nodejs",
  maxDuration: 60,
};

let cacheInitialized = false;

const handler = createHTTPHandler({
  router: appRouter,
  createContext: async ({ req, res }) => {
    // TEMPORARY: Disable city cache initialization for testing
    if (!cacheInitialized) {
      console.log("[TRPC] Skipping city cache initialization");
      cacheInitialized = true;

      // Original code:
      // await initCityCache();
    }

    return createContext({
      req: req,
      res: res,
    });
  },
});

export default async function (
  req: VercelRequest,
  res: VercelResponse
) {
  console.log("[TRPC] Incoming request:", {
    method: req.method,
    url: req.url,
  });

  // Fix path issue on Vercel
  if (req.url?.startsWith("/api/trpc/")) {
    req.url = req.url.replace("/api/trpc/", "/");
  }

  console.log("[TRPC] Rewritten URL:", req.url);

  return handler(req as any, res as any);
}
