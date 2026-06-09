import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";
import { initCityCache } from "../../server/lib/cityCache";

let cacheInitialized = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!cacheInitialized) {
    await initCityCache();
    cacheInitialized = true;
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  if (!res.clearCookie) {
    res.clearCookie = (name: string, options?: any) => {
      const serialize = (n: string, v: string, opts: any = {}) => {
        let pairs = [`${n}=${v}`];
        if (opts.maxAge) pairs.push(`Max-Age=${opts.maxAge}`);
        if (opts.domain) pairs.push(`Domain=${opts.domain}`);
        if (opts.path) pairs.push(`Path=${opts.path}`);
        if (opts.expires) pairs.push(`Expires=${opts.expires.toUTCString()}`);
        if (opts.httpOnly ) pairs.push("HttpOnly");
        if (opts.secure) pairs.push("Secure");
        if (opts.sameSite) pairs.push(`SameSite=${opts.sameSite}`);
        return pairs.join("; ");
      };
      res.setHeader("Set-Cookie", serialize(name, "", { ...options, maxAge: -1, expires: new Date(0) }));
      return res;
    };
  }

  const trpcMiddleware = createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  });

  return new Promise<void>((resolve, reject) => {
    trpcMiddleware(req as any, res as any, (err: any) => {
      if (err) {
        console.error("[tRPC] Error:", err);
        return reject(err);
      }
      resolve();
    });
  });
}
