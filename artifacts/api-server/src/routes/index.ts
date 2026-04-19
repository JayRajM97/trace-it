import { Router } from "express";
import { healthRouter } from "./health.js";
import { authRouter } from "./auth.js";
import { routesRouter } from "./routes.js";
import { shareRouter } from "./share.js";
import { stravaRouter } from "./strava.js";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(authRouter);
apiRouter.use(routesRouter);
apiRouter.use(shareRouter);
apiRouter.use(stravaRouter);
