import { COOKIE_NAME } from "@shared/const";

import { getSessionCookieOptions } from "./_core/cookies.js";
import { systemRouter } from "./_core/systemRouter.js";
import { publicProcedure, router } from "./_core/trpc.js";

import { timeRouter } from "./routers/time.js";
import { citiesRouter } from "./routers/cities.js";
import { favoritesRouter } from "./routers/favorites.js";
import { preferencesRouter } from "./routers/preferences.js";
import { meetingsRouter } from "./routers/meetings.js";
import { countdownsRouter } from "./routers/countdowns.js";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts
  // all api should start with '/api/' so that the gateway can route correctly

  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);

      ctx.res.clearCookie(COOKIE_NAME, {
        ...cookieOptions,
        maxAge: -1,
      });

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
