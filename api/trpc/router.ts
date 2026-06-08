import type { VercelRequest, VercelResponse } from "@vercel/node";

export interface CreateContextOptions {
  req: VercelRequest;
  res: VercelResponse;
}

export const createContext = async (opts: CreateContextOptions) => {
  return {
    req: opts.req,
    res: opts.res,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
