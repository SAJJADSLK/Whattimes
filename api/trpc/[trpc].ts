import type { VercelRequest, VercelResponse } from "@vercel/node";
import { nodeHTTPRequestHandler } from "@trpc/server/adapters/node-http";
import { appRouter } from "../../server/trpc/router.js"; 
import { createContext } from "../../server/trpc/context.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS if your frontend needs to make cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Handle preflight OPTIONS requests gracefully
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  // Handle the actual tRPC request using the native Node HTTP adapter
  return nodeHTTPRequestHandler({
    endpoint: "/api/trpc",
    req,
    res,
    router: appRouter,
    createContext: () => createContext({ req, res }),
  });
}
