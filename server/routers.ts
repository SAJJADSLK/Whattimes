import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { timeRouter } from "./routers/time";
import { citiesRouter } from "./routers/cities";
import { favoritesRouter } from "./routers/favorites";
import { preferencesRouter } from "./routers/preferences";
import { meetingsRouter } from "./routers/meetings";
import { countdownsRouter } from "./routers/countdowns";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  time: timeRouter,
  cities: citiesRouter,
  favorites: favoritesRouter,
  preferences: preferencesRouter,
  meetings: meetingsRouter,
  countdowns: countdownsRouter,
});

export type AppRouter = typeof appRouter;
