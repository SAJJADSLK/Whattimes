import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userFavoriteCities, cities } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

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

      return favorites;
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
        // Get the highest order number
        const existing = await db
          .select({ maxOrder: userFavoriteCities.order })
          .from(userFavoriteCities)
          .where(eq(userFavoriteCities.userId, ctx.user.id));

        const maxOrder = existing.length > 0 ? Math.max(...existing.map(e => e.maxOrder || 0)) : 0;

        await db.insert(userFavoriteCities).values({
          userId: ctx.user.id,
          cityId: input.cityId,
          order: maxOrder + 1,
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
        // Update order for each favorite
        for (let i = 0; i < input.favoriteIds.length; i++) {
          await db
            .update(userFavoriteCities)
            .set({ order: i })
            .where(
              and(
                eq(userFavoriteCities.id, input.favoriteIds[i]),
                eq(userFavoriteCities.userId, ctx.user.id)
              )
            );
        }

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
          .select()
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
