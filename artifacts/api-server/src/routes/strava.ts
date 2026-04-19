import { Router } from "express";
import { getAuth } from "@clerk/express";
import { getDb, usersTable, stravaTokensTable, routesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth.js";
import { logger } from "../lib/logger.js";

export const stravaRouter = Router();

const STRAVA_CLIENT_ID = process.env["STRAVA_CLIENT_ID"]!;
const STRAVA_CLIENT_SECRET = process.env["STRAVA_CLIENT_SECRET"]!;
const STRAVA_REDIRECT_URI = process.env["STRAVA_REDIRECT_URI"]!;

stravaRouter.post("/strava/connect", requireAuth, (_req, res) => {
  const params = new URLSearchParams({
    client_id: STRAVA_CLIENT_ID,
    redirect_uri: STRAVA_REDIRECT_URI,
    response_type: "code",
    approval_prompt: "auto",
    scope: "activity:write,read",
  });
  res.json({ authUrl: `https://www.strava.com/oauth/authorize?${params}` });
});

stravaRouter.get("/strava/callback", async (req, res) => {
  const code = req.query["code"] as string | undefined;
  const error = req.query["error"] as string | undefined;

  if (error || !code) {
    res.redirect(`traceit://strava-error?reason=${error ?? "no_code"}`);
    return;
  }

  const tokenRes = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    logger.error({ status: tokenRes.status }, "Strava token exchange failed");
    res.redirect("traceit://strava-error?reason=token_exchange");
    return;
  }

  const token = (await tokenRes.json()) as {
    athlete: { id: number };
    access_token: string;
    refresh_token: string;
    expires_at: number;
    scope: string;
  };

  // We can't tie this to a Clerk user without a state param — in production
  // pass userId in state through OAuth flow. For MVP, store by athleteId lookup.
  // The mobile app should include userId in state param, retrieved here.
  const stateUserId = req.query["state"] as string | undefined;
  if (stateUserId) {
    const db = getDb();
    await db
      .insert(stravaTokensTable)
      .values({
        userId: stateUserId,
        athleteId: token.athlete.id,
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        expiresAt: token.expires_at,
        scope: token.scope,
      })
      .onConflictDoUpdate({
        target: stravaTokensTable.userId,
        set: {
          athleteId: token.athlete.id,
          accessToken: token.access_token,
          refreshToken: token.refresh_token,
          expiresAt: token.expires_at,
          scope: token.scope,
          updatedAt: new Date(),
        },
      });
  }

  res.redirect("traceit://strava-connected");
});

async function getValidStravaToken(userId: string) {
  const db = getDb();
  const record = await db.query.stravaTokensTable.findFirst({
    where: eq(stravaTokensTable.userId, userId),
  });
  if (!record) throw new Error("Strava not connected");

  if (record.expiresAt - Date.now() / 1000 < 300) {
    const refreshRes = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        refresh_token: record.refreshToken,
        grant_type: "refresh_token",
      }),
    });
    if (!refreshRes.ok) throw new Error("Strava token refresh failed");
    const fresh = (await refreshRes.json()) as {
      access_token: string;
      refresh_token: string;
      expires_at: number;
    };
    await db
      .update(stravaTokensTable)
      .set({
        accessToken: fresh.access_token,
        refreshToken: fresh.refresh_token,
        expiresAt: fresh.expires_at,
        updatedAt: new Date(),
      })
      .where(eq(stravaTokensTable.userId, userId));
    return fresh.access_token;
  }
  return record.accessToken;
}

stravaRouter.post("/strava/push", requireAuth, async (req, res) => {
  const auth = getAuth(req);
  const db = getDb();
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, auth.userId!),
  });
  if (!user) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const routeId = req.body?.routeId as string | undefined;
  if (!routeId) {
    res.status(400).json({ error: "routeId required" });
    return;
  }

  const route = await db.query.routesTable.findFirst({
    where: and(eq(routesTable.id, routeId), eq(routesTable.userId, user.id)),
  });
  if (!route?.gpxContent) {
    res.status(404).json({ error: "Route or GPX not found" });
    return;
  }

  try {
    const accessToken = await getValidStravaToken(user.id);
    const form = new FormData();
    form.append(
      "file",
      new Blob([route.gpxContent], { type: "application/gpx+xml" }),
      `traceit-${route.id}.gpx`
    );
    form.append("data_type", "gpx");
    form.append("name", `TraceIt: ${route.shapeId}`);
    form.append("sport_type", "Walk");
    form.append(
      "description",
      `GPS Art made with TraceIt. Fidelity: ${route.fidelityScore != null ? Math.round(route.fidelityScore * 100) : "?"}%`
    );

    const uploadRes = await fetch("https://www.strava.com/api/v3/uploads", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    });
    if (!uploadRes.ok) throw new Error(`Strava upload failed: ${uploadRes.status}`);

    const upload = (await uploadRes.json()) as { activity_id: number };
    const stravaActivityId = String(upload.activity_id);

    await db
      .update(routesTable)
      .set({ stravaActivityId, updatedAt: new Date() })
      .where(eq(routesTable.id, route.id));

    res.json({
      stravaActivityId,
      activityUrl: `https://www.strava.com/activities/${stravaActivityId}`,
    });
  } catch (err) {
    logger.error({ err }, "Strava push failed");
    res.status(502).json({ error: "Strava push failed" });
  }
});
