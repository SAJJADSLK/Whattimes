import { systemRouter } from "./_core/systemRouter.js";
import { router } from "./_core/trpc.js";
import { timeRouter } from "./routers/time.js";
import { citiesRouter } from "./routers/cities.js";

export const appRouter = router({
  system: systemRouter,
  time: timeRouter,
  cities: citiesRouter,
});

export type AppRouter = typeof appRouter;
