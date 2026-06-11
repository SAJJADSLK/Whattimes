import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";

export type TrpcContext = {
  req: CreateHTTPContextOptions["req"];
  res: CreateHTTPContextOptions["res"];
  user: null;
};

export async function createContext(
  opts: CreateHTTPContextOptions
): Promise<TrpcContext> {
  return {
    req: opts.req,
    res: opts.res,
    user: null,
  };
}
