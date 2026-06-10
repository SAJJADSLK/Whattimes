import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc.js";
import {
  getServerTimeOffset,
  getTimeInTimezone,
  getUtcOffsetMinutes,
  isDstActive,
  calculateOverlapHours,
  getSunTimes,
} from "../time.js";

export const timeRouter = router({
  /**
   * Get server time offset for client-side clock synchronization
   * Client receives this on page load to calculate accurate local time
   */
  getOffset: publicProcedure
    .input(z.any().optional())
    .query(() => {
      return getServerTimeOffset();
    }),

  /**
   * Get current time in a specific timezone
   */
  getTimeInTimezone: publicProcedure
    .input(z.object({ timezone: z.string() }))
    .query(({ input }) => {
      const dt = getTimeInTimezone(input.timezone);
      return {
        timezone: input.timezone,
        time: dt.toISO(),
        hour: dt.hour,
        minute: dt.minute,
        second: dt.second,
        offset: getUtcOffsetMinutes(input.timezone),
        isDst: isDstActive(input.timezone),
      };
    }),

  /**
   * Get current time for multiple timezones
   */
  getMultipleTimezones: publicProcedure
    .input(z.object({ timezones: z.array(z.string()) }))
    .query(({ input }) => {
      return input.timezones.map((tz) => {
        const dt = getTimeInTimezone(tz);
        return {
          timezone: tz,
          time: dt.toISO(),
          hour: dt.hour,
          minute: dt.minute,
          second: dt.second,
          offset: getUtcOffsetMinutes(tz),
          isDst: isDstActive(tz),
        };
      });
    }),

  calculateOverlap: publicProcedure
    .input(z.object({ timezones: z.array(z.string()) }))
    .query(({ input }) => {
      return calculateOverlapHours(input.timezones);
    }),

  getSunTimes: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        timezone: z.string(),
      })
    )
    .query(({ input }) => {
      return getSunTimes(
        input.latitude,
        input.longitude,
        input.timezone
      );
    }),

  getUtcOffset: publicProcedure
    .input(z.object({ timezone: z.string() }))
    .query(({ input }) => {
      return {
        timezone: input.timezone,
        offsetMinutes: getUtcOffsetMinutes(input.timezone),
        offsetHours: getUtcOffsetMinutes(input.timezone) / 60,
      };
    }),
});
