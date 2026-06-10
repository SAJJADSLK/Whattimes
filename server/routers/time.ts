import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc.js';
import { getServerTimeOffset, getTimeInTimezone, getUtcOffsetMinutes, isDstActive, calculateOverlapHours, getSunTimes } from '../time.js';

export const timeRouter = router({
  /**
   * Get server time offset for client-side clock synchronization
   * Client receives this on page load to calculate accurate local time
   */
  getOffset: publicProcedure
    // 💡 FIX: Accept void, null, or optional inputs gracefully to prevent 500 validation crashes
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
   * Get current time for multiple timezones (for world clock grid)
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

  /**
   * Calculate working hours overlap between timezones
   * Used for team dashboard to show green/yellow/red coding
   */
  calculateOverlap: publicProcedure
    .input(z.object({ timezones: z.array(z.string()) }))
    .query(({ input }) => {
      return calculateOverlapHours(input.timezones);
    }),

  /**
   * Get sunrise and sunset times for a location
   */
  getSunTimes: publicProcedure
    .input(z.object({ latitude: z.number(), longitude: z.number(), timezone: z.string() }))
    .query(({ input }) => {
      return getSunTimes(input.latitude, input.longitude, input.timezone);
    }),

  /**
   * Get UTC offset in minutes for a timezone
   */
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
