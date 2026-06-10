import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { appRouter } from "../../server/routers.ts";
import { createContext } from "../../server/_core/context.ts";

export const config = {
  runtime: "nodejs",
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
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
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  } catch (error) {
    console.error("[TRPC ERROR]", error);

    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}
