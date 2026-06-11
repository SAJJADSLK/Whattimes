import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { users } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const preferencesRouter = router({
  /**
   * Get user preferences
   */
  get: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });

    try {
      const user = await db
        .select({
          theme: users.theme,
          defaultTimezone: users.defaultTimezone,
        })
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      return user[0] || null;
    } catch (error) {
      console.error("[Preferences] Failed to get preferences:", error);
      return null;
    }
  }),

  /**
   * Update user theme preference
   */
  updateTheme: protectedProcedure
    // 💡 FIX: Wrapped naked enum into an object wrapper for consistent batch parameter parsing
    .input(z.object({ theme: z.enum(["light", "dark", "auto"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        await db
          .update(users)
          .set({ theme: input.theme })
          .where(eq(users.id, ctx.user.id));

        return { success: true, theme: input.theme };
      } catch (error) {
        console.error("[Preferences] Failed to update theme:", error);
        throw error;
      }
    }),

  /**
   * Update default timezone
   */
  updateDefaultTimezone: protectedProcedure
    // 💡 FIX: Wrapped raw string into an object input block 
    .input(z.object({ timezone: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        await db
          .update(users)
          .set({ defaultTimezone: input.timezone })
          .where(eq(users.id, ctx.user.id));

        return { success: true, timezone: input.timezone };
      } catch (error) {
        console.error("[Preferences] Failed to update timezone:", error);
        throw error;
      }
    }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(1).optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      // 💡 FIX: Prevent empty update payloads from causing fatal database SQL errors
      if (Object.keys(input).length === 0) {
        return { success: true, message: "No adjustments provided." };
      }

      try {
        await db
          .update(users)
          .set(input) // Pass input directly—Zod strips out fields that aren't provided
          .where(eq(users.id, ctx.user.id));

        return { success: true };
      } catch (error) {
        console.error("[Preferences] Failed to update profile:", error);
        throw error;
      }
    }),
});
