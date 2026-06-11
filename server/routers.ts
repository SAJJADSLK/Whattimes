import { systemRouter } from "./_core/systemRouter.js";
import { publicProcedure, router } from "./_core/trpc.js";
import { timeRouter } from "./routers/time.js";
import { citiesRouter } from "./routers/cities.js";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(() => null),

    logout: publicProcedure.mutation(() => ({
      success: true,
    })),
  }),

  time: timeRouter,
  cities: citiesRouter,
});

export type AppRouter = typeof appRouter;
