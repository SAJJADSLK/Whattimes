import { cities } from "../../drizzle/schema.js";
import { getDb } from "../db.js";

export interface City {
  id: number;
  name: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
  region: string;
  population: number | null;
}

// Built-in fallback database of major world cities to guarantee the site NEVER 404s
// even during database cold-starts or connection dropouts.
const DEFAULT_FALLBACK_CITIES: City[] = [
  // North America
  { id: 1, name: 'New York', country: 'United States', timezone: 'America/New_York', latitude: 40.7128, longitude: -74.006, region: 'North America', population: 8336817 },
  { id: 2, name: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', latitude: 34.0522, longitude: -118.2437, region: 'North America', population: 3979576 },
  { id: 3, name: 'Chicago', country: 'United States', timezone: 'America/Chicago', latitude: 41.8781, longitude: -87.6298, region: 'North America', population: 2693976 },
  { id: 4, name: 'Houston', country: 'United States', timezone: 'America/Chicago', latitude: 29.7604, longitude: -95.3698, region: 'North America', population: 2320268 },
  { id: 5, name: 'Phoenix', country: 'United States', timezone: 'America/Phoenix', latitude: 33.4484, longitude: -112.0742, region: 'North America', population: 1680992 },
  { id: 6, name: 'San Francisco', country: 'United States', timezone: 'America/Los_Angeles', latitude: 37.7749, longitude: -122.4194, region: 'North America', population: 873965 },
  { id: 7, name: 'Seattle', country: 'United States', timezone: 'America/Los_Angeles', latitude: 47.6062, longitude: -122.3321, region: 'North America', population: 753675 },
  { id: 8, name: 'Miami', country: 'United States', timezone: 'America/New_York', latitude: 25.7617, longitude: -80.1918, region: 'North America', population: 467963 },
  { id: 9, name: 'Denver', country: 'United States', timezone: 'America/Denver', latitude: 39.7392, longitude: -104.9903, region: 'North America', population: 715522 },
  { id: 10, name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', latitude: 43.6532, longitude: -79.3832, region: 'North America', population: 2930000 },
  { id: 11, name: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver', latitude: 49.2827, longitude: -123.1207, region: 'North America', population: 675570 },
  { id: 12, name: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', latitude: 19.4326, longitude: -99.1332, region: 'North America', population: 9209944 },

  // Europe
  { id: 13, name: 'London', country: 'United Kingdom', timezone: 'Europe/London', latitude: 51.5074, longitude: -0.1278, region: 'Europe', population: 9002488 },
  { id: 14, name: 'Paris', country: 'France', timezone: 'Europe/Paris', latitude: 48.8566, longitude: 2.3522, region: 'Europe', population: 2161000 },
  { id: 15, name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', latitude: 52.52, longitude: 13.405, region: 'Europe', population: 3645000 },
  { id: 16, name: 'Frankfurt', country: 'Germany', timezone: 'Europe/Berlin', latitude: 50.1109, longitude: 8.6821, region: 'Europe', population: 753056 },
  { id: 17, name: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', latitude: 40.4168, longitude: -3.7038, region: 'Europe', population: 3223000 },
  { id: 18, name: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid', latitude: 41.3851, longitude: 2.1734, region: 'Europe', population: 1620343 },
  { id: 19, name: 'Rome', country: 'Italy', timezone: 'Europe/Rome', latitude: 41.9028, longitude: 12.4964, region: 'Europe', population: 2761477 },
  { id: 20, name: 'Milan', country: 'Italy', timezone: 'Europe/Rome', latitude: 45.4642, longitude: 9.19, region: 'Europe', population: 1352000 },
  { id: 21, name: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', latitude: 52.3676, longitude: 4.9041, region: 'Europe', population: 873555 },
  { id: 22, name: 'Brussels', country: 'Belgium', timezone: 'Europe/Brussels', latitude: 50.8503, longitude: 4.3517, region: 'Europe', population: 1210000 },
  { id: 23, name: 'Vienna', country: 'Austria', timezone: 'Europe/Vienna', latitude: 48.2082, longitude: 16.3738, region: 'Europe', population: 1920000 },
  { id: 24, name: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', latitude: 47.3769, longitude: 8.5472, region: 'Europe', population: 415367 },
  { id: 25, name: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin', latitude: 53.3498, longitude: -6.2603, region: 'Europe', population: 1256057 },
  { id: 26, name: 'Stockholm', country: 'Sweden', timezone: 'Europe/Stockholm', latitude: 59.3293, longitude: 18.0686, region: 'Europe', population: 975551 },
  { id: 27, name: 'Oslo', country: 'Norway', timezone: 'Europe/Oslo', latitude: 59.9139, longitude: 10.7522, region: 'Europe', population: 702050 },
  { id: 28, name: 'Warsaw', country: 'Poland', timezone: 'Europe/Warsaw', latitude: 52.2297, longitude: 21.0122, region: 'Europe', population: 1863000 },
  { id: 29, name: 'Prague', country: 'Czech Republic', timezone: 'Europe/Prague', latitude: 50.0755, longitude: 14.4378, region: 'Europe', population: 1320000 },
  { id: 30, name: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', latitude: 41.0082, longitude: 28.9784, region: 'Europe', population: 15029231 },

  // Asia & Middle East
  { id: 31, name: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', latitude: 25.2048, longitude: 55.2708, region: 'Middle East', population: 3331420 },
  { id: 32, name: 'Abu Dhabi', country: 'United Arab Emirates', timezone: 'Asia/Dubai', latitude: 24.4539, longitude: 54.3773, region: 'Middle East', population: 1450000 },
  { id: 33, name: 'Riyadh', country: 'Saudi Arabia', timezone: 'Asia/Riyadh', latitude: 24.7136, longitude: 46.6753, region: 'Middle East', population: 7676654 },
  { id: 34, name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', latitude: 35.6762, longitude: 139.6503, region: 'Asia', population: 37400068 },
  { id: 35, name: 'Osaka', country: 'Japan', timezone: 'Asia/Tokyo', latitude: 34.6937, longitude: 135.5023, region: 'Asia', population: 2725006 },
  { id: 36, name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', latitude: 1.3521, longitude: 103.8198, region: 'Asia', population: 5917600 },
  { id: 37, name: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong', latitude: 22.3193, longitude: 114.1694, region: 'Asia', population: 7496981 },
  { id: 38, name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', latitude: 37.5665, longitude: 126.978, region: 'Asia', population: 9776000 },
  { id: 39, name: 'Beijing', country: 'China', timezone: 'Asia/Shanghai', latitude: 39.9042, longitude: 116.4074, region: 'Asia', population: 21540000 },
  { id: 40, name: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', latitude: 31.2304, longitude: 121.4737, region: 'Asia', population: 27058000 },
  { id: 41, name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', latitude: 13.7563, longitude: 100.5018, region: 'Asia', population: 10156000 },
  { id: 42, name: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', latitude: 3.139, longitude: 101.6869, region: 'Asia', population: 1982112 },
  { id: 43, name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', latitude: 19.076, longitude: 72.8777, region: 'Asia', population: 20961472 },
  { id: 44, name: 'New Delhi', country: 'India', timezone: 'Asia/Kolkata', latitude: 28.7041, longitude: 77.1025, region: 'Asia', population: 32941000 },
  { id: 45, name: 'Bangalore', country: 'India', timezone: 'Asia/Kolkata', latitude: 12.9716, longitude: 77.5946, region: 'Asia', population: 8436675 },
  { id: 46, name: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta', latitude: -6.2088, longitude: 106.8456, region: 'Asia', population: 10770487 },
  { id: 47, name: 'Manila', country: 'Philippines', timezone: 'Asia/Manila', latitude: 14.5995, longitude: 120.9842, region: 'Asia', population: 13484462 },
  { id: 48, name: 'Taipei', country: 'Taiwan', timezone: 'Asia/Taipei', latitude: 25.033, longitude: 121.5654, region: 'Asia', population: 2704810 },

  // Oceania
  { id: 49, name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', latitude: -33.8688, longitude: 151.2093, region: 'Oceania', population: 5312163 },
  { id: 50, name: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne', latitude: -37.8136, longitude: 144.9631, region: 'Oceania', population: 5159211 },
  { id: 51, name: 'Brisbane', country: 'Australia', timezone: 'Australia/Brisbane', latitude: -27.4698, longitude: 153.0251, region: 'Oceania', population: 2464143 },
  { id: 52, name: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', latitude: -37.0082, longitude: 174.785, region: 'Oceania', population: 1614300 },

  // South America & Africa
  { id: 53, name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', latitude: -23.5505, longitude: -46.6333, region: 'South America', population: 12396372 },
  { id: 54, name: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', latitude: -34.6037, longitude: -58.3816, region: 'South America', population: 15369919 },
  { id: 55, name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', latitude: 30.0444, longitude: 31.2357, region: 'Africa', population: 20076000 },
  { id: 56, name: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', latitude: -26.2023, longitude: 28.0436, region: 'Africa', population: 5635127 },
  { id: 57, name: 'Cape Town', country: 'South Africa', timezone: 'Africa/Johannesburg', latitude: -33.9249, longitude: 18.4241, region: 'Africa', population: 4618461 },
  { id: 58, name: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos', latitude: 6.5244, longitude: 3.3792, region: 'Africa', population: 15387639 },
  { id: 59, name: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi', latitude: -1.2921, longitude: 36.8219, region: 'Africa', population: 4386000 },
];

let cityCache: City[] = [...DEFAULT_FALLBACK_CITIES];
let isInitialized = false;

export async function initCityCache() {
  if (isInitialized) return;

  try {
    const db = await getDb();

    if (!db) {
      console.warn("[CityCache] Using default fallback cities until DB connects.");
      return;
    }

    const results = await db.select().from(cities);
    if (results && results.length > 0) {
      cityCache = results.map((c) => ({
        ...c,
        latitude: parseFloat(c.latitude.toString()),
        longitude: parseFloat(c.longitude.toString()),
        population: c.population ? parseInt(c.population.toString()) : null,
      }));
      isInitialized = true;
      console.log("[CityCache] Initialized from DB with", cityCache.length, "cities");
    }
  } catch (error) {
    console.warn("[CityCache] DB init warning, falling back to built-in cache:", error);
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
        city.country.toLowerCase().startsWith(normalizedQuery) ||
        city.timezone.toLowerCase().includes(normalizedQuery)
    )
    .sort((a, b) => (b.population || 0) - (a.population || 0))
    .slice(0, limit);
}

export function getCitiesByRegionFromCache(region: string, limit: number = 50): City[] {
  return cityCache
    .filter((city) => city.region.toLowerCase() === region.toLowerCase())
    .slice(0, limit);
}
