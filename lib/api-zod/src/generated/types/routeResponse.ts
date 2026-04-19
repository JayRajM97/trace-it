import { z } from "zod";
import { LatLngSchema } from "./common.js";

export const TurnInstructionSchema = z.object({
  stepIndex: z.number(),
  instruction: z.string(),
  distance: z.number(),
  duration: z.number(),
  bearing: z.number(),
  maneuver: z.enum([
    "depart",
    "turn-left",
    "turn-right",
    "continue",
    "arrive",
    "roundabout",
  ]),
});

export const RouteResponseSchema = z.object({
  routeId: z.string().uuid(),
  shapeId: z.string(),
  centerLat: z.number(),
  centerLng: z.number(),
  diameterMeters: z.number(),
  polyline: z.array(LatLngSchema),
  waypoints: z.array(LatLngSchema),
  turns: z.array(TurnInstructionSchema),
  totalDistanceMeters: z.number(),
  estimatedDurationSeconds: z.number(),
  fidelityScore: z.number().min(0).max(1).nullable(),
});

export type TurnInstruction = z.infer<typeof TurnInstructionSchema>;
export type RouteResponse = z.infer<typeof RouteResponseSchema>;
