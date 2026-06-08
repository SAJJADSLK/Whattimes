import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { meetingInvites, cities } from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export const meetingsRouter = router({
  /**
   * Get user's meeting history
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
        const meetings = await db
          .select()
          .from(meetingInvites)
          .where(eq(meetingInvites.userId, ctx.user.id))
          .orderBy(desc(meetingInvites.createdAt))
          .limit(input.limit)
          .offset(input.offset);

        return meetings;
      } catch (error) {
        console.error("[Meetings] Failed to list meetings:", error);
        return [];
      }
    }),

  /**
   * Create a new meeting invite
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        cityIds: z.array(z.number()),
        meetingTimeUtc: z.date(),
        expiresAt: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const inviteCode = nanoid(12);

        const result = await db.insert(meetingInvites).values({
          userId: ctx.user.id,
          inviteCode,
          title: input.title,
          description: input.description,
          cityIds: input.cityIds,
          meetingTimeUtc: input.meetingTimeUtc,
          expiresAt: input.expiresAt,
        });

        return {
          success: true,
          inviteCode,
          shareUrl: `/invite/${inviteCode}`,
        };
      } catch (error) {
        console.error("[Meetings] Failed to create meeting:", error);
        throw error;
      }
    }),

  /**
   * Get meeting details by invite code
   */
  getByCode: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      try {
        const meeting = await db
          .select()
          .from(meetingInvites)
          .where(eq(meetingInvites.inviteCode, input))
          .limit(1);

        return meeting[0] || null;
      } catch (error) {
        console.error("[Meetings] Failed to get meeting:", error);
        return null;
      }
    }),

  /**
   * Delete a meeting invite
   */
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .delete(meetingInvites)
          .where(
            and(
              eq(meetingInvites.id, input),
              eq(meetingInvites.userId, ctx.user.id)
            )
          );

        return { success: true };
      } catch (error) {
        console.error("[Meetings] Failed to delete meeting:", error);
        throw error;
      }
    }),
});
