import { z } from "zod";

export const ShareResponseSchema = z.object({
  shareUrl: z.string().url(),
  imageUrl: z.string().url(),
});

export type ShareResponse = z.infer<typeof ShareResponseSchema>;
