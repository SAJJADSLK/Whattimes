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
      try {
        return searchCitiesInCache(input.query, input.limit) || [];
      } catch (e) {
        console.error("Cache error in search:", e);
        return [];
      }
    }),

  /**
   * Get cities by region (Ultra-fast In-Memory)
   */
  getByRegion: publicProcedure
    .input(z.object({ region: z.string(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      if (!input.region) return [];
      try {
        return getCitiesByRegionFromCache(input.region, input.limit) || [];
      } catch (e) {
        console.error("Cache error in getByRegion:", e);
        return [];
      }
    }),

  /**
   * Get available regions
   */
  getRegions: publicProcedure.query(async () => {
    try {
      const allCities = getAllCitiesFromCache() || [];
      const regions = [...new Set(allCities.map(c => c.region))].sort();
      return regions;
    } catch (e) {
      console.error("Cache error in getRegions:", e);
      return [];
    }
  }),

  /**
   * Get city by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const allCities = getAllCitiesFromCache() || [];
        return allCities.find(c => c.id === input.id) || null;
      } catch (e) {
        console.error("Cache error in getById:", e);
        return null;
      }
    }),

  /**
   * Get multiple cities by IDs
   */
  getByIds: publicProcedure
    .input(z.object({ ids: z.array(z.number()) }))
    .query(async ({ input }) => {
      try {
        const allCities = getAllCitiesFromCache() || [];
        const idSet = new Set(input.ids);
        return allCities.filter(c => idSet.has(c.id));
      } catch (e) {
        console.error("Cache error in getByIds:", e);
        return [];
      }
    }),

  /**
   * Get popular cities
   */
  getPopular: publicProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input }) => {
      try {
        const allCities = getAllCitiesFromCache() || [];
        return [...allCities]
          .sort((a, b) => (b.population || 0) - (a.population || 0))
          .slice(0, input.limit);
      } catch (e) {
        console.error("Cache error in getPopular:", e);
        return [];
      }
    }),

  /**
   * Get all cities (Ultra-fast In-Memory)
   */
  getAll: publicProcedure
    .input(
      z.object({ 
        limit: z.number().default(200).nullable().optional() 
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const targetLimit = input?.limit ?? 200;
        const allCities = getAllCitiesFromCache();
        
        // 💡 CRITICAL FIX: Fallback to an empty array if cache returns undefined/null
        if (!allCities || !Array.isArray(allCities)) {
          console.warn("getAllCitiesFromCache returned an empty dataset or failed to resolve.");
          return []; 
        }
        
        return allCities.slice(0, targetLimit);
      } catch (error) {
        console.error("Fatal exception in cities.getAll router:", error);
        return []; // Prevents the 500 server crash by returning a safe default
      }
    }),

  /**
   * Get ALL cities without limit (for SEO sitemap generation)
   */
  getAllForSitemap: publicProcedure.query(async () => {
    try {
      const allCities = getAllCitiesFromCache() || [];
      return allCities.sort((a, b) => a.name.localeCompare(b.name));
    } catch (e) {
      console.error("Cache error in getAllForSitemap:", e);
      return [];
    }
  }),

  /**
   * Get all unique countries
   */
  getAllCountries: publicProcedure.query(async () => {
    try {
      const allCities = getAllCitiesFromCache() || [];
      return [...new Set(allCities.map(c => c.country))].sort();
    } catch (e) {
      console.error("Cache error in getAllCountries:", e);
      return [];
    }
  }),

  /**
   * Get cities by country (for country detail pages)
   */
  getByCountry: publicProcedure
    .input(z.object({ country: z.string() }))
    .query(async ({ input }) => {
      try {
        const allCities = getAllCitiesFromCache() || [];
        return allCities
          .filter(c => c.country === input.country)
          .sort((a, b) => a.name.localeCompare(b.name));
      } catch (e) {
        console.error("Cache error in getByCountry:", e);
        return [];
      }
    }),

  /**
   * Get city by name (for city detail pages)
   */
  getByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      try {
        const allCities = getAllCitiesFromCache() || [];
        const normalizedName = input.name.toLowerCase();
        return allCities.find(c => c.name.toLowerCase() === normalizedName) || null;
      } catch (e) {
        console.error("Cache error in getByName:", e);
        return null;
      }
    }),
});
