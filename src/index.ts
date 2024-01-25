import { getEnv } from "./util/getEnv";
import express from "express";
import { apiKeyMiddleware } from "./middleware/apiKeyMiddleware";
import http from "node:http";
import bodyParser from "body-parser";
import { HighlightController } from "./controllers/highlightController";
import Redis from "ioredis";
import cors from "cors";
import { redisCacheMiddleware } from "./middleware/redisCacheMiddleware";
import { PrismaClient } from "@prisma/client";
import { uniqueUserIdMiddleware } from "./middleware/uniqueUserIdMiddleware";

const {
  HOSTNAME,
  PORT,
  PUBLIC_API_KEY,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
} = getEnv();

const isUsingRedis = REDIS_HOST && REDIS_PORT && REDIS_PASSWORD;

/**
 * Base middleware
 */
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.set("trust proxy", true);
PUBLIC_API_KEY && app.use(apiKeyMiddleware);

const prisma = new PrismaClient();
const redis = isUsingRedis
  ? new Redis({
      port: REDIS_PORT,
      host: REDIS_HOST,
      password: REDIS_PASSWORD,
    })
  : null;

app.options("*", cors());

/**
 * Highlight Routes
 */
const highlightController = new HighlightController({
  prismaClient: prisma,
  redisClient: redis,
});
const highlightRouter = express.Router();

highlightRouter
  .route("/:slug")
  .get(
    (req, res, next) => redisCacheMiddleware(req, res, next, redis),
    highlightController.getHighlightsBySlug
  )
  .put(uniqueUserIdMiddleware, highlightController.addHighlightsBySlug);

isUsingRedis && app.use("/highlights", highlightRouter);

app.use("/highlights", highlightRouter);

/**
 * Main function
 */
async function main() {
  http.createServer(app).listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
  });
}

/**
 * Run main function
 */
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
