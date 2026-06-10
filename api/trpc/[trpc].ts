import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../../server/routers.js";
import { createContext } from "../../server/_core/context.js";
import { initCityCache } from "../../server/lib/cityCache.js";
import { getDb } from "../../server/db.js";

let cacheInitialized = false;

async function ensureCacheInitialized() {
  if (cacheInitialized) return;
  
  try {
    const db = await getDb();
    if (!db) {
      console.error("[API] Database connection failed");
      return;
    }
    
    await initCityCache();
    cacheInitialized = true;
  } catch (error) {
    console.error("[API] Cache initialization failed:", error);
  }
}

export default async (req: any, res: any) => {
  try {
    await ensureCacheInitialized();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    const trpcMiddleware = createExpressMiddleware({
      router: appRouter,
      createContext: createContext,
    });

    return new Promise<void>((resolve, reject) => {
      trpcMiddleware(req, res, (err: any) => {
        if (err) {
          console.error("[tRPC] Error:", err);
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
