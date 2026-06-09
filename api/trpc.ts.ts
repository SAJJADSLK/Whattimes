import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "../server/routers.js";
import { createContext } from "../server/_core/context.js";

export const config = {
  runtime: "nodejs",
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: new Request(
        `https://${req.headers.host}${req.url}`,
        {
          method: req.method,
          headers: req.headers as HeadersInit,
          body:
            req.method !== "GET" &&
            req.method !== "HEAD"
              ? JSON.stringify(req.body)
              : undefined,
        }
      ),
      router: appRouter,
      createContext,
    });

    res.status(response.status);

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const data = await response.text();

    res.send(data);
  } catch (error) {
    console.error("[TRPC ERROR]", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
}