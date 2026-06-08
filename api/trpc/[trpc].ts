import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/trpc/router"; // adjust path
import { createContext } from "../../server/trpc/context"; // adjust path

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: req as any,
    router: appRouter,
    createContext,
  });
}
