import { protectedProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { favorites } from "../../drizzle/schema.js";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const favoritesRouter = router({
  add: protectedProcedure
    .input((val: any) => {
      if (typeof val?.cityId !== "string") throw new Error("Invalid cityId");
      return val;
    })
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const existing = await db
        .select()
        .from(favorites)
        .where(
          and(
            eq(favorites.userId, userId),
            eq(favorites.cityId, input.cityId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Already favorited",
        });
      }

      await db.insert(favorites).values({
        userId,
        cityId: input.cityId,
      });

      return { success: true };
    }),

  remove: protectedProcedure
    .input((val: any) => {
      if (typeof val?.cityId !== "string") throw new Error("Invalid cityId");
      return val;
    })
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(favorites)
        .where(
          and(
            eq(favorites.userId, userId),
            eq(favorites.cityId, input.cityId)
          )
        );

      return { success: true };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const userFavorites = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId));

    return userFavorites;
  }),

  isFavorite: protectedProcedure
    .input((val: any) => {
      if (typeof val?.cityId !== "string") throw new Error("Invalid cityId");
      return val;
    })
    .query(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const favorite = await db
        .select()
        .from(favorites)
        .where(
          and(
            eq(favorites.userId, userId),
            eq(favorites.cityId, input.cityId)
          )
        )
        .limit(1);

      return favorite.length > 0;
    }),
});
