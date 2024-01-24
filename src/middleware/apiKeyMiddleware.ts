import type { NextFunction, Request, Response } from "express";
import { getEnv } from "../util/getEnv";

const { PUBLIC_API_KEY } = getEnv();

export function apiKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const apiKey = req.headers.authorization.split(" ")[1];
  if (apiKey !== PUBLIC_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return next();
}
