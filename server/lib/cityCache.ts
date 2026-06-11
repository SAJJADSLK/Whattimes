export async function initCityCache() {
  if (isInitialized) return;

  console.log("[CityCache] Starting");

  const db = await getDb();

  console.log("[CityCache] DB exists:", !!db);

  if (!db) {
    console.error("[CityCache] DB NOT AVAILABLE");
    return;
  }

  try {
    const results = await db.select().from(cities);

    console.log("[CityCache] Results:", results?.length);

    cityCache = results.map(c => ({
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
