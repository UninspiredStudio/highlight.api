import type { PrismaClient } from "@prisma/client";
import type { Redis } from "ioredis";

export interface ControllerProps {
  prismaClient: PrismaClient;
  redisClient: Redis | null;
}
