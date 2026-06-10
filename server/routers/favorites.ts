import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { userFavoriteCities, cities } from "../../drizzle/schema.js";
import { eq, and, sql } from "drizzle-orm";

export const favoritesRouter = router({
  /**
   * Get all favorite cities for the current user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    try {
      const favorites = await db
        .select({
          id: userFavoriteCities.id,
          cityId: userFavoriteCities.cityId,
          order: userFavoriteCities.order,
          city: {
            id: cities.id,
            name: cities.name,
            country: cities.country,
            timezone: cities.timezone,
            region: cities.region,
            utcOffsetMinutes: cities.utcOffsetMinutes,
          },
        })
        .from(userFavoriteCities)
        .innerJoin(cities, eq(userFavoriteCities.cityId, cities.id))
        .where(eq(userFavoriteCities.userId, ctx.user.id))
        .orderBy(userFavoriteCities.order);

      return favorites || [];
    } catch (error) {
      console.error("[Favorites] Failed to list favorites:", error);
      return [];
    }
  }),

  /**
   * Add a city to user's favorites
   */
  add: protectedProcedure
    .input(z.object({ cityId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // 💡 FIX: Let the database calculate the MAX order value natively (Much faster!)
        const [result] = await db
          .select({ maxOrder: sql<number>`COALESCE(MAX(${userFavoriteCities.order}), 0)` })
          .from(userFavoriteCities)
          .where(eq(userFavoriteCities.userId, ctx.user.id));

        const nextOrder = (result?.maxOrder ?? 0) + 1;

        await db.insert(userFavoriteCities).values({
          userId: ctx.user.id,
          cityId: input.cityId,
          order: nextOrder,
        });

        return { success: true };
      } catch (error) {
        console.error("[Favorites] Failed to add favorite:", error);
        throw error;
      }
    }),

  /**
   * Remove a city from user's favorites
   */
  remove: protectedProcedure
    .input(z.object({ cityId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .delete(userFavoriteCities)
          .where(
            and(
              eq(userFavoriteCities.cityId, input.cityId),
              eq(userFavoriteCities.userId, ctx.user.id)
            )
          );

        return { success: true };
      } catch (error) {
        console.error("[Favorites] Failed to remove favorite:", error);
        throw error;
      }
    }),

  /**
   * Reorder favorites
   */
  reorder: protectedProcedure
    .input(z.object({ favoriteIds: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // 💡 FIX: Run operations in parallel using Promise.all() to prevent sequential N+1 network blockages
        await Promise.all(
          input.favoriteIds.map((id, index) =>
            db
              .update(userFavoriteCities)
              .set({ order: index })
              .where(
                and(
                  eq(userFavoriteCities.id, id),
                  eq(userFavoriteCities.userId, ctx.user.id)
                )
              )
          )
        );

        return { success: true };
      } catch (error) {
        console.error("[Favorites] Failed to reorder favorites:", error);
        throw error;
      }
    }),

  /**
   * Check if a city is in favorites
   */
  isFavorite: protectedProcedure
    .input(z.object({ cityId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return false;

      try {
        const result = await db
          .select({ id: userFavoriteCities.id }) // Select only the ID field instead of the entire row to save bandwidth
          .from(userFavoriteCities)
          .where(
            and(
              eq(userFavoriteCities.userId, ctx.user.id),
              eq(userFavoriteCities.cityId, input.cityId)
            )
          )
          .limit(1);

        return result.length > 0;
      } catch (error) {
        console.error("[Favorites] Failed to check favorite:", error);
        return false;
      }
    }),
});
