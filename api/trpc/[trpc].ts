import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
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
  createContext: async (opts: CreateHTTPContextOptions) => {
    if (!cacheInitialized) {
      console.log("[TRPC] Initializing city cache...");
      await initCityCache();
      cacheInitialized = true;
    }
    return createContext({
      req: opts.req as any,
      res: opts.res as any,
      info: opts.info,   // ✅ pass info through
    });
  },
});

export default async function (req: VercelRequest, res: VercelResponse) {
  console.log("[TRPC] Incoming request:", {
    method: req.method,
    url: req.url,
  });

  if (req.url?.startsWith("/api/trpc/")) {
    req.url = req.url.replace("/api/trpc/", "/");
  }

  return handler(req as any, res as any);
}
