import { Router } from "express";
import { getDb, routesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { renderShareCard } from "../lib/satori.js";
import { logger } from "../lib/logger.js";
import type { LatLng } from "@workspace/api-zod";

export const shareRouter = Router();

shareRouter.get("/share/:token", async (req, res) => {
  const db = getDb();
  const token = req.params["token"] as string;
  const route = await db.query.routesTable.findFirst({
    where: eq(routesTable.shareToken, token),
  });
  if (!route) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(route);
});

shareRouter.get("/share/:token/image", async (req, res) => {
  const db = getDb();
  const token = req.params["token"] as string;
  const route = await db.query.routesTable.findFirst({
    where: eq(routesTable.shareToken, token),
  });
  if (!route) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  try {
    const polyline = JSON.parse(route.polylineJson) as LatLng[];
    const png = await renderShareCard({
      shapeId: route.shapeId,
      title: route.title,
      polyline,
      totalDistanceMeters: route.totalDistanceMeters,
      fidelityScore: route.fidelityScore,
    });
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(png);
  } catch (err) {
    logger.error({ err }, "Share card render failed");
    res.status(500).json({ error: "Render failed" });
  }
});
