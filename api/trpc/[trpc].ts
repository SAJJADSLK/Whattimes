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
    if (!cacheInitialized) {
      console.log("[TRPC] Initializing city cache...");
      await initCityCache();
      cacheInitialized = true;
    }

    return createContext({
      req: req as any,
      res: res as any,
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

  // Keep this fix - it solved the tRPC routing issue
  if (req.url?.startsWith("/api/trpc/")) {
    req.url = req.url.replace("/api/trpc/", "/");
  }

  return handler(req as any, res as any);
}
