import { initTRPC } from "@trpc/server";
import { z } from "zod";
import type { Context } from "./context.js";

// Initialize tRPC with our custom context
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// This is your main backend API definition
export const appRouter = router({
  time: router({
    getOffset: publicProcedure
      .input(z.object({ timezone: z.string().nullable().optional() }).optional())
      .query(({ input }) => {
        if (!input?.timezone) {
          return { offset: 0, message: "No timezone provided" };
        }
        // Your logic for time offset goes here
        return { offset: 0, timezone: input.timezone };
      }),
  }),
  
  cities: router({
    getAll: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(({ input }) => {
        const limit = input?.limit ?? 200;
        // Your logic to fetch cities from a database or array goes here
        return { message: `Returning up to ${limit} cities`, cities: [] };
      }),
  }),
});

export type AppRouter = typeof appRouter;
