import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { countdownTimers } from "../../drizzle/schema.js";
import { eq, desc, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export const countdownsRouter = router({
  /**
   * Get user's countdown history
   */
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        const countdowns = await db
          .select()
          .from(countdownTimers)
          .where(eq(countdownTimers.userId, ctx.user.id))
          .orderBy(desc(countdownTimers.createdAt))
          .limit(input.limit)
          .offset(input.offset);

        return countdowns || [];
      } catch (error) {
        console.error("[Countdowns] Failed to list countdowns:", error);
        return [];
      }
    }),

  /**
   * Create a new countdown timer
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        // 💡 FIX: Use z.coerce.date() so stringified ISO dates from the frontend are parsed correctly
        targetTimeUtc: z.coerce.date(),
        timezone: z.string(),
        isPublic: z.boolean().default(true),
        expiresAt: z.coerce.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const countdownCode = nanoid(12);

        await db.insert(countdownTimers).values({
          userId: ctx.user.id,
          countdownCode,
          title: input.title,
          targetTimeUtc: input.targetTimeUtc,
          timezone: input.timezone,
          isPublic: input.isPublic,
          expiresAt: input.expiresAt,
        });

        return {
          success: true,
          countdownCode,
          shareUrl: `/countdown/${countdownCode}`,
        };
      } catch (error) {
        console.error("[Countdowns] Failed to create countdown:", error);
        throw error;
      }
    }),

  /**
   * Get countdown by code (public)
   */
  getByCode: publicProcedure
    // 💡 FIX: Safe wrapping of primitives inside objects for unified tRPC client network calls
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      try {
        const countdown = await db
          .select()
          .from(countdownTimers)
          .where(
            and(
              eq(countdownTimers.countdownCode, input.code),
              eq(countdownTimers.isPublic, true)
            )
          )
          .limit(1);

        return countdown[0] || null;
      } catch (error) {
        console.error("[Countdowns] Failed to get countdown:", error);
        return null;
      }
    }),

  /**
   * Delete a countdown
   */
  delete: protectedProcedure
    // 💡 FIX: Safe wrapper object matching tRPC call schema rules
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .delete(countdownTimers)
          .where(
            and(
              eq(countdownTimers.id, input.id),
              eq(countdownTimers.userId, ctx.user.id)
            )
          );

        return { success: true };
      } catch (error) {
        console.error("[Countdowns] Failed to delete countdown:", error);
        throw error;
      }
    }),

  /**
   * Update countdown visibility
   */
  updateVisibility: protectedProcedure
    .input(z.object({ id: z.number(), isPublic: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .update(countdownTimers)
          .set({ isPublic: input.isPublic })
          .where(
            and(
              eq(countdownTimers.id, input.id),
              eq(countdownTimers.userId, ctx.user.id)
            )
          );

        return { success: true };
      } catch (error) {
        console.error("[Countdowns] Failed to update visibility:", error);
        throw error;
      }
    }),
});
