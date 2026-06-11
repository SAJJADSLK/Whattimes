import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../server/routers.js";
import { createContext } from "../server/_core/context.js";

export const config = {
  runtime: "nodejs",
};

export default function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async ({ req, res }) => {
      return createContext({
        req: req as any,
        res: res as any,
      });
    },
  });
}
