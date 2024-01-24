interface CustomEnv {
  HOSTNAME?: string;
  PORT: number;
  DATABASE_URL: string;
  REDIS_HOST?: string;
  REDIS_PORT?: number;
  REDIS_PASSWORD?: string;
  PUBLIC_API_KEY?: string;
}

declare module "bun" {
  interface Env extends CustomEnv {}
}
