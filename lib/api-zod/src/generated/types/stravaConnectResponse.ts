import { z } from "zod";

export const StravaConnectResponseSchema = z.object({
  authUrl: z.string().url(),
});

export const StravaPushResponseSchema = z.object({
  stravaActivityId: z.string(),
  activityUrl: z.string().url(),
});

export type StravaConnectResponse = z.infer<typeof StravaConnectResponseSchema>;
export type StravaPushResponse = z.infer<typeof StravaPushResponseSchema>;
