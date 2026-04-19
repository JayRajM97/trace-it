import express from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";
import { clerkMiddleware } from "./middlewares/requireAuth.js";
import { apiRouter } from "./routes/index.js";
import { logger } from "./lib/logger.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env["CORS_ORIGIN"] ?? "*" }));
  app.use(pinoHttp({ logger }));
  app.use(express.json());
  app.use(clerkMiddleware());
  app.use("/api", apiRouter);

  return app;
}
