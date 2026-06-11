import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { meetingInvites } from "../../drizzle/schema.js";
import { eq, desc, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";

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
      
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        const meetings = await db
          .select()
          .from(meetingInvites)
          .where(eq(meetingInvites.userId, userId))
          .orderBy(desc(meetingInvites.createdAt))
          .limit(input.limit)
          .offset(input.offset);

        return meetings || [];
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
        meetingTimeUtc: z.coerce.date(),
        expiresAt: z.coerce.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        const inviteCode = nanoid(12);

        const valuesToInsert = {
          userId,
          inviteCode,
          title: input.title,
          description: input.description || null,
          cityIds: input.cityIds,
          meetingTimeUtc: input.meetingTimeUtc,
          expiresAt: input.expiresAt || null,
        };

        await db.insert(meetingInvites).values(valuesToInsert);

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
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      try {
        const meeting = await db
          .select()
          .from(meetingInvites)
          .where(eq(meetingInvites.inviteCode, input.code))
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
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        await db
          .delete(meetingInvites)
          .where(
            and(
              eq(meetingInvites.id, input.id),
              eq(meetingInvites.userId, userId)
            )
          );

        return { success: true };
      } catch (error) {
        console.error("[Meetings] Failed to delete meeting:", error);
        throw error;
      }
    }),
});
