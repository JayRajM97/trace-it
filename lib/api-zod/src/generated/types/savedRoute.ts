import { z } from "zod";

export const SaveRouteBodySchema = z.object({
  routeId: z.string().uuid(),
  shapeId: z.string(),
  centerLat: z.number(),
  centerLng: z.number(),
  diameterMeters: z.number(),
  polylineJson: z.string(),
  turnsJson: z.string(),
  gpxContent: z.string(),
  totalDistanceMeters: z.number(),
  fidelityScore: z.number().min(0).max(1),
  title: z.string().default(""),
});

export const SavedRouteSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  shapeId: z.string(),
  title: z.string(),
  centerLat: z.number(),
  centerLng: z.number(),
  diameterMeters: z.number(),
  polylineJson: z.string(),
  turnsJson: z.string(),
  gpxContent: z.string().nullable(),
  totalDistanceMeters: z.number().nullable(),
  fidelityScore: z.number().nullable(),
  stravaActivityId: z.string().nullable(),
  shareToken: z.string().nullable(),
  completedAt: z.number().nullable(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type SaveRouteBody = z.infer<typeof SaveRouteBodySchema>;
export type SavedRoute = z.infer<typeof SavedRouteSchema>;
