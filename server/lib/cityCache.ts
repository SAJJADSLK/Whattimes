import { cities } from "../../drizzle/schema.js";
import { getDb } from "../db.js";

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

  try {
    const db = await getDb();  // ✅ await it — getDb() is async

    if (!db) {
      console.error("[CityCache] No database connection available. Check DATABASE_URL.");
      return;
    }

    const results = await db.select().from(cities);
    console.log("[CityCache] Results:", results?.length);

    cityCache = results.map((c) => ({
      ...c,
      population: c.population
        ? parseInt(c.population.toString())
        : null,
    }));

    isInitialized = true;
    console.log("[CityCache] Cached:", cityCache.length);
  } catch (error) {
    console.error("[CityCache] Failed to initialize cache:", error);
  }
}

export function getAllCitiesFromCache(): City[] {
  return cityCache;
}

export function searchCitiesInCache(query: string, limit: number = 20): City[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  return cityCache
    .filter(
      (city) =>
        city.name.toLowerCase().startsWith(normalizedQuery) ||
        city.name.toLowerCase().includes(" " + normalizedQuery) ||
        city.country.toLowerCase().startsWith(normalizedQuery)
    )
    .sort((a, b) => (b.population || 0) - (a.population || 0))
    .slice(0, limit);
}

export function getCitiesByRegionFromCache(region: string, limit: number = 50): City[] {
  return cityCache
    .filter((city) => city.region === region)
    .slice(0, limit);
}
