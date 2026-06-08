import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../../server/index.js"; // 👈 FIX: Points to where your appRouter code actually is (e.g., server/index.ts)
import { createContext } from "../../server/context.js"; // 👈 FIX: Points to your server context file

// Create the tRPC Express middleware handler
const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext: ({ req, res }) => {
    // If your context factory function expects an object or raw req/res, pass it here
    return typeof createContext === "function" ? createContext({ req, res }) : {};
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Setup required CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  // 2. Polyfill Express-like response methods used by your auth router if missing on Vercel
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

  // 3. Run the tRPC request
  return new Promise<void>((resolve, reject) => {
    trpcMiddleware(req as any, res as any, (err: any) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
