import { z } from "zod";

export const GenerateRouteBodySchema = z.object({
  shapeId: z.string().min(1),
  centerLat: z.number().min(-90).max(90),
  centerLng: z.number().min(-180).max(180),
  diameterMeters: z.number().min(500).max(10000),
});

export type GenerateRouteBody = z.infer<typeof GenerateRouteBodySchema>;
