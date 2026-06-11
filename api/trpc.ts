import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../server/routers.js";
import { createContext } from "../server/_core/context.js";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      return createContext({
        req,
        res,
      });
    },
  });
}
