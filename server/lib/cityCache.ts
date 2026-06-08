import { cities } from '../../drizzle/schema';
import { getDb } from '../db';

interface City {
  id: number;
  name: string;
  country: string;
  timezone: string;
  latitude: string;
  longitude: string;
  region: string;
  population: number | null;
}

let cityCache: City[] = [];
let isInitialized = false;

export async function initCityCache() {
  if (isInitialized) return;
  
  const db = await getDb();
  if (!db) {
    console.warn("[CityCache] Database not available for cache initialization");
    return;
  }

  try {
    console.log("[CityCache] Pre-loading cities into memory...");
    const results = await db.select().from(cities);
    cityCache = results.map(c => ({
      ...c,
      population: c.population ? parseInt(c.population.toString()) : null
    }));
    isInitialized = true;
    console.log(`[CityCache] Successfully cached ${cityCache.length} cities`);
  } catch (error) {
    console.error("[CityCache] Failed to initialize cache:", error);
  }
}

export function searchCitiesInCache(query: string, limit: number = 20) {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  return cityCache
    .filter(city => 
      city.name.toLowerCase().startsWith(normalizedQuery) ||
      city.name.toLowerCase().includes(' ' + normalizedQuery) ||
      city.country.toLowerCase().startsWith(normalizedQuery)
    )
    .sort((a, b) => (b.population || 0) - (a.population || 0))
    .slice(0, limit);
}

export function getAllCitiesFromCache() {
  return cityCache;
}

export function getCitiesByRegionFromCache(region: string, limit: number = 50) {
  return cityCache
    .filter(city => city.region === region)
    .slice(0, limit);
}
