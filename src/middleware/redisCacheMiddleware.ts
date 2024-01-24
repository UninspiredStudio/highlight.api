import type { NextFunction, Request, Response } from "express";
import type { Redis } from "ioredis";

export async function redisCacheMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
  redisClient: Redis | null
) {
  try {
    if (!redisClient) return next();
    const value = await redisClient.get(req.originalUrl);
    if (value) {
      return res
        .header("X-Cache", "HIT")
        .header("Content-Type", "application/json")
        .status(200)
        .send(value);
    }
    return next();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
