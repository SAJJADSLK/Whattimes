import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as trpcExpress from "@trpc/server/adapters/express";

import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "*"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  return trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })(
    req as any,
    res as any,
    () => {}
  );
}
