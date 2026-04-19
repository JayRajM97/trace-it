import { Router } from "express";
import { getAuth } from "@clerk/express";
import { getDb, usersTable, routesTable } from "@workspace/db";
import { GenerateRouteBodySchema, SaveRouteBodySchema } from "@workspace/api-zod";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "../middlewares/requireAuth.js";
import { findShape } from "../lib/shapes.js";
import { scaleWaypoints } from "../lib/waypointScaler.js";
import { planRoute } from "../lib/osrm.js";
import { logger } from "../lib/logger.js";

export const routesRouter = Router();

routesRouter.post("/routes/generate", async (req, res) => {
  const parsed = GenerateRouteBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { shapeId, centerLat, centerLng, diameterMeters } = parsed.data;
  const shape = findShape(shapeId);
  if (!shape) {
    res.status(404).json({ error: `Shape '${shapeId}' not found` });
    return;
  }

  const center = { lat: centerLat, lng: centerLng };
  const scaled = scaleWaypoints(shape.waypoints, center, diameterMeters);

  try {
    const result = await planRoute(scaled, shape.closedLoop);
    res.json({
      routeId: uuidv4(),
      shapeId,
      centerLat,
      centerLng,
      diameterMeters,
      polyline: result.polyline,
      waypoints: result.waypoints,
      turns: result.turns,
      totalDistanceMeters: result.totalDistanceMeters,
      estimatedDurationSeconds: result.estimatedDurationSeconds,
      fidelityScore: null,
    });
  } catch (err) {
    logger.error({ err }, "OSRM route generation failed");
    res.status(502).json({ error: "Route generation failed" });
  }
});

routesRouter.get("/routes", requireAuth, async (req, res) => {
  const auth = getAuth(req);
  const db = getDb();
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, auth.userId!),
  });
  if (!user) {
    res.json([]);
    return;
  }
  const routes = await db.query.routesTable.findMany({
    where: eq(routesTable.userId, user.id),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
  res.json(routes);
});

routesRouter.get("/routes/:id", requireAuth, async (req, res) => {
  const auth = getAuth(req);
  const routeId = req.params["id"] as string;
  const db = getDb();
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, auth.userId!),
  });
  if (!user) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const route = await db.query.routesTable.findFirst({
    where: and(eq(routesTable.id, routeId), eq(routesTable.userId, user.id)),
  });
  if (!route) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(route);
});

routesRouter.post("/routes", requireAuth, async (req, res) => {
  const parsed = SaveRouteBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const auth = getAuth(req);
  const db = getDb();
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, auth.userId!),
  });
  if (!user) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const { routeId, shapeId, centerLat, centerLng, diameterMeters, polylineJson, turnsJson, gpxContent, totalDistanceMeters, fidelityScore, title } = parsed.data;
  const now = new Date();

  const inserted = await db
    .insert(routesTable)
    .values({
      id: routeId,
      userId: user.id,
      shapeId,
      title,
      centerLat,
      centerLng,
      diameterMeters,
      polylineJson,
      turnsJson,
      gpxContent,
      totalDistanceMeters,
      fidelityScore,
      completedAt: now,
    })
    .onConflictDoUpdate({
      target: routesTable.id,
      set: { gpxContent, fidelityScore, totalDistanceMeters, completedAt: now, updatedAt: now },
    })
    .returning();

  res.status(201).json(inserted[0]);
});

routesRouter.post("/routes/:id/share", requireAuth, async (req, res) => {
  const auth = getAuth(req);
  const routeId = req.params["id"] as string;
  const db = getDb();
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, auth.userId!),
  });
  if (!user) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const route = await db.query.routesTable.findFirst({
    where: and(eq(routesTable.id, routeId), eq(routesTable.userId, user.id)),
  });
  if (!route) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const shareToken = route.shareToken ?? uuidv4();
  await db
    .update(routesTable)
    .set({ shareToken, updatedAt: new Date() })
    .where(eq(routesTable.id, route.id));

  const webBase = process.env["WEB_BASE_URL"] ?? "";
  res.json({
    shareUrl: `${webBase}/share/${shareToken}`,
    imageUrl: `${webBase}/api/share/${shareToken}/image`,
  });
});
