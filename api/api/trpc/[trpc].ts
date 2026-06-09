import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { appRouter } from "../../server/routers.js";
import { createContext } from "../../server/_core/context.js";
import { initCityCache } from "../../server/lib/cityCache.js";
import { getDb } from "../../server/db.js";

let cacheInitialized = false;
let cacheInitPromise: Promise<void> | null = null;

async function ensureCacheInitialized() {
  if (cacheInitialized) return;

  if (cacheInitPromise) {
    return cacheInitPromise;
  }

  cacheInitPromise = (async () => {
    try {
      console.log("[API] Starting cache initialization...");

      const db = await getDb();

      if (!db) {
        console.error("[API] Database connection failed");
        return;
      }

      console.log("[API] Database connected");

      await initCityCache();

      cacheInitialized = true;

      console.log("[API] Cache initialization complete");
    } catch (error) {
      console.error("[API] Cache initialization failed:", error);
      cacheInitialized = false;
    }
  })();

  return cacheInitPromise;
}

function setCorsHeaders(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
}

type ExtendedResponse = VercelResponse & {
  clearCookie?: (
    name: string,
    options?: {
      path?: string;
      domain?: string;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: string;
    }
  ) => void;
};

function addClearCookie(res: VercelResponse): ExtendedResponse {
  const response = res as ExtendedResponse;

  if (!response.clearCookie) {
    response.clearCookie = (
      name: string,
      options = {}
    ) => {
      const cookieParts = [
        `${name}=`,
        "Max-Age=0",
        "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
        `Path=${options.path || "/"}`
      ];

      if (options.domain) {
        cookieParts.push(`Domain=${options.domain}`);
      }

      if (options.httpOnly) {
        cookieParts.push("HttpOnly");
      }

      if (options.secure) {
        cookieParts.push("Secure");
      }

      if (options.sameSite) {
        cookieParts.push(`SameSite=${options.sameSite}`);
      }

      res.setHeader(
        "Set-Cookie",
        cookieParts.join("; ")
      );
    };
  }

  return response;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    await ensureCacheInitialized();

    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    const response = addClearCookie(res);

    const middleware = createExpressMiddleware({
      router: appRouter,
      createContext
    });

    await new Promise<void>((resolve, reject) => {
      middleware(
        req as any,
        response as any,
        (err?: unknown) => {
          if (err) {
            console.error(
              "[tRPC Middleware Error]",
              err
            );

            if (!response.headersSent) {
              response.status(500).json({
                error: "Internal server error"
              });
            }

            reject(err);
            return;
          }

          resolve();
        }
      );
    });
  } catch (error) {
    console.error(
      "[API Handler Error]",
      error
    );

    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error"
      });
    }
  }
}
