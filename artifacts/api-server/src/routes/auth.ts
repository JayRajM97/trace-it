import { Router } from "express";
import { Webhook } from "svix";
import { getDb, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../lib/logger.js";

export const authRouter = Router();

authRouter.post("/auth/sync-user", async (req, res) => {
  const secret = process.env["CLERK_WEBHOOK_SECRET"];
  if (!secret) {
    res.status(500).json({ error: "Webhook secret not configured" });
    return;
  }

  const wh = new Webhook(secret);
  let evt: {
    type: string;
    data: { id: string; email_addresses: { email_address: string }[]; first_name?: string; last_name?: string };
  };

  try {
    evt = wh.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"] as string,
      "svix-timestamp": req.headers["svix-timestamp"] as string,
      "svix-signature": req.headers["svix-signature"] as string,
    }) as typeof evt;
  } catch (err) {
    logger.warn({ err }, "Webhook verification failed");
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const db = getDb();
    const email = evt.data.email_addresses[0]?.email_address ?? "";
    const name = [evt.data.first_name, evt.data.last_name].filter(Boolean).join(" ") || null;

    await db
      .insert(usersTable)
      .values({ id: uuidv4(), clerkId: evt.data.id, email, name })
      .onConflictDoUpdate({
        target: usersTable.clerkId,
        set: { email, name, updatedAt: new Date() },
      });
  }

  res.json({ received: true });
});
