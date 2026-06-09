import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";
import { initCityCache } from "../../server/lib/cityCache";
import { getDb } from "../../server/db";

let cacheInitialized = false;
let cacheInitPromise: Promise<void> | null = null;

async function ensureCacheInitialized() {
  // If already initialized, return immediately
  if (cacheInitialized) return;
  
  // If initialization is in progress, wait for it
  if (cacheInitPromise) return cacheInitPromise;
  
  // Start initialization
  cacheInitPromise = (async () => {
    try {
      console.log("[API] Starting cache initialization...");
      
      // Ensure database connection is ready
      const db = await getDb();
      if (!db) {
        console.error("[API] Database connection failed - cannot initialize cache");
        return;
      }
      
      console.log("[API] Database connected, initializing city cache...");
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Ensure cache is initialized on first request
    await ensureCacheInitialized();

    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      return res.end();
    }

    // Polyfill Express-like response methods for Vercel
    if (!res.clearCookie) {
      res.clearCookie = (name: string, options?: any) => {
        const serialize = (n: string, v: string, opts: any = {}) => {
          let pairs = [`${n}=${v}`];
          if (opts.maxAge) pairs.push(`Max-Age=${opts.maxAge}`);
          if (opts.domain) pairs.push(`Domain=${opts.domain}`);
          if (opts.path) pairs.push(`Path=${opts.path}`);
          if (opts.expires) pairs.push(`Expires=${opts.expires.toUTCString()}`);
          if (opts.httpOnly) pairs.push("HttpOnly");
          if (opts.secure) pairs.push("Secure");
          if (opts.sameSite) pairs.push(`SameSite=${opts.sameSite}`);
          return pairs.join("; ");
        };
        res.setHeader("Set-Cookie", serialize(name, "", { ...options, maxAge: -1, expires: new Date(0) }));
        return res;
      };
    }

    // Create and run tRPC middleware
    const trpcMiddleware = createExpressMiddleware({
      router: appRouter,
      createContext: createContext,
    });

    return new Promise<void>((resolve, reject) => {
      trpcMiddleware(req as any, res as any, (err: any) => {
        if (err) {
          console.error("[tRPC] Middleware error:", err);
          if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
          }
          return reject(err);
        }
        resolve();
      });
    });
  } catch (error) {
    console.error("[API] Handler error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
