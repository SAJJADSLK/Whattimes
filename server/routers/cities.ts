import { publicProcedure, router } from '../_core/trpc';
import { cities } from '../../drizzle/schema';
import { getDb } from '../db';
import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import { searchCitiesInCache, getCitiesByRegionFromCache, getAllCitiesFromCache } from '../lib/cityCache';

export const citiesRouter = router({
  /**
   * Search cities by name or timezone (Ultra-fast In-Memory)
   */
  search: publicProcedure
    .input(z.object({ query: z.string(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      return searchCitiesInCache(input.query, input.limit);
    }),

  /**
   * Get cities by region (Ultra-fast In-Memory)
   */
  getByRegion: publicProcedure
    .input(z.object({ region: z.string(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      if (!input.region) return [];
      return getCitiesByRegionFromCache(input.region, input.limit);
    }),

  /**
   * Get available regions
   */
  getRegions: publicProcedure.query(async () => {
    const allCities = getAllCitiesFromCache();
    const regions = [...new Set(allCities.map(c => c.region))].sort();
    return regions;
  }),

  /**
   * Get city by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const allCities = getAllCitiesFromCache();
      return allCities.find(c => c.id === input.id) || null;
    }),

  /**
   * Get multiple cities by IDs
   */
  getByIds: publicProcedure
    .input(z.object({ ids: z.array(z.number()) }))
    .query(async ({ input }) => {
      const allCities = getAllCitiesFromCache();
      const idSet = new Set(input.ids);
      return allCities.filter(c => idSet.has(c.id));
    }),

  /**
   * Get popular cities
   */
  getPopular: publicProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const allCities = getAllCitiesFromCache();
      return [...allCities]
        .sort((a, b) => (b.population || 0) - (a.population || 0))
        .slice(0, input.limit);
    }),

  /**
   * Get all cities (Ultra-fast In-Memory)
   */
  getAll: publicProcedure
    .input(z.object({ limit: z.number().default(200) }))
    .query(async ({ input }) => {
      return getAllCitiesFromCache().slice(0, input.limit);
    }),

  /**
   * Get ALL cities without limit (for SEO sitemap generation)
   */
  getAllForSitemap: publicProcedure.query(async () => {
    return getAllCitiesFromCache().sort((a, b) => a.name.localeCompare(b.name));
  }),

  /**
   * Get all unique countries
   */
  getAllCountries: publicProcedure.query(async () => {
    const allCities = getAllCitiesFromCache();
    return [...new Set(allCities.map(c => c.country))].sort();
  }),

  /**
   * Get cities by country (for country detail pages)
   */
  getByCountry: publicProcedure
    .input(z.object({ country: z.string() }))
    .query(async ({ input }) => {
      const allCities = getAllCitiesFromCache();
      return allCities
        .filter(c => c.country === input.country)
        .sort((a, b) => a.name.localeCompare(b.name));
    }),

  /**
   * Get city by name (for city detail pages)
   */
  getByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const allCities = getAllCitiesFromCache();
      const normalizedName = input.name.toLowerCase();
      return allCities.find(c => c.name.toLowerCase() === normalizedName) || null;
    }),
});
