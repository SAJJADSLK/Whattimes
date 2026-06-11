import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { appRouter } from "../../server/routers.js";
import { createContext } from "../../server/_core/context.js";
import { initCityCache } from "../../server/lib/cityCache.js";

export const config = {
  runtime: "nodejs",
  maxDuration: 60,
};

let cacheInitialized = false;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Initialize city cache on first request
    if (!cacheInitialized) {
      console.log("[TRPC] Initializing city cache...");
      await initCityCache();
      cacheInitialized = true;
    }

    console.log("[TRPC] Incoming request:", {
  method: req.method,
  url: req.url,
});

    const middleware = createExpressMiddleware({
      router: appRouter,
      createContext,
    });

    await new Promise<void>((resolve, reject) => {
      middleware(
        req as any,
        res as any,
        (err?: unknown) => {
          if (err) {
            console.error("[TRPC MIDDLEWARE ERROR]", err);
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  } catch (error) {
    console.error("[TRPC ERROR]", error);
    console.error("[TRPC ERROR STACK]", error instanceof Error ? error.stack : "No stack");

    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
