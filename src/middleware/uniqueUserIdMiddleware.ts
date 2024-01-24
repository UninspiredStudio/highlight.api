import type { NextFunction, Request, Response } from "express";
import { getAnonymousUserId } from "anonymous-user-id";

const SALT = "TEST_SALT_1234";

export async function uniqueUserIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ip =
      req.headers["X-Real-IP"]?.toString() ||
      req.headers["X-Forwarded-For"]?.toString() ||
      req.socket.remoteAddress ||
      "127.0.0.1";
    const userAgent = req.headers["user-agent"];
    const page = req.params.slug;
    console.log({ ip, userAgent, page });
    if (!ip || !userAgent || !page) {
      return res.status(400).json({ message: "Bad Request" });
    }
    const requestDetails = {
      domain: page,
      ip,
      userAgent,
    };
    const uid = getAnonymousUserId(SALT, requestDetails);
    res.locals.uid = uid;
    console.log({ uid });
    return next();
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
