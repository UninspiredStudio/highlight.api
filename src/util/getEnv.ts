export function getEnv(): CustomEnv {
  if (!process.env.HOSTNAME) {
    console.warn("HOSTNAME is not defined, using default hostname localhost");
  }
  if (!process.env.PORT) {
    console.warn("PORT is not defined, using default port 3000");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  if (!process.env.REDIS_HOST) {
    console.warn("REDIS_URL is not defined, not using redis...");
  }
  if (!process.env.REDIS_PORT) {
    console.warn("REDIS_PASS is not defined, not using redis...");
  }
  if (!process.env.REDIS_PASSWORD) {
    console.warn("REDIS_PASS is not defined, not using redis...");
  }
  if (!process.env.PUBLIC_API_KEY) {
    console.warn("No API-Key specified, running without authentication...");
  }

  return {
    HOSTNAME: process.env.HOSTNAME || "localhost",
    PORT: Number(process.env.PORT) || 3000,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: Number(process.env.REDIS_PORT),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    PUBLIC_API_KEY: process.env.PUBLIC_API_KEY,
  };
}
