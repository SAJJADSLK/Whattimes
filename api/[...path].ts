import "dotenv/config";
import { createApp } from "../server/_core/app";
import { initCityCache } from "../server/lib/cityCache";

const app = createApp();

export default async function handler(req: unknown, res: unknown) {
  await initCityCache();
  return app(req as never, res as never);
}
