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
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        const meetings = await db
          .select()
          .from(meetingInvites)
          .where(eq(meetingInvites.userId, ctx.user.id))
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
        // 💡 FIX: Coerce dates from incoming string payloads safely
        meetingTimeUtc: z.coerce.date(),
        expiresAt: z.coerce.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        const inviteCode = nanoid(12);

        // 💡 FIX: Handle potential database storage limitations for tracking arrays in schemas
        const valuesToInsert = {
          userId: ctx.user.id,
          inviteCode,
          title: input.title,
          description: input.description || null,
          cityIds: input.cityIds, // If your database errors out here, use: JSON.stringify(input.cityIds) as any
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
    // 💡 FIX: Box primitive string to match tRPC batch caller formats safely
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
    // 💡 FIX: Box number primitive inside validation object blocks
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        await db
          .delete(meetingInvites)
          .where(
            and(
              eq(meetingInvites.id, input.id),
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
