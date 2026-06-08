import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const preferencesRouter = router({
  /**
   * Get user preferences
   */
  get: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

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
    .input(z.enum(["light", "dark", "auto"]))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .update(users)
          .set({ theme: input })
          .where(eq(users.id, ctx.user.id));

        return { success: true, theme: input };
      } catch (error) {
        console.error("[Preferences] Failed to update theme:", error);
        throw error;
      }
    }),

  /**
   * Update default timezone
   */
  updateDefaultTimezone: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .update(users)
          .set({ defaultTimezone: input })
          .where(eq(users.id, ctx.user.id));

        return { success: true, timezone: input };
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
        name: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const updateData: Record<string, any> = {};
        if (input.name) updateData.name = input.name;
        if (input.email) updateData.email = input.email;

        await db
          .update(users)
          .set(updateData)
          .where(eq(users.id, ctx.user.id));

        return { success: true };
      } catch (error) {
        console.error("[Preferences] Failed to update profile:", error);
        throw error;
      }
    }),
});
