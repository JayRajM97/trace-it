import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../custom-fetch.js";
import type {
  GenerateRouteBody,
  RouteResponse,
  SaveRouteBody,
  SavedRoute,
  ShareResponse,
  StravaConnectResponse,
  StravaPushResponse,
} from "@workspace/api-zod";

// ── Route generation (no auth required) ──────────────────────────────────────

export function useGenerateRoute() {
  return useMutation({
    mutationFn: (body: GenerateRouteBody) =>
      apiFetch<RouteResponse>("/api/routes/generate", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  });
}

// ── Saved routes ──────────────────────────────────────────────────────────────

export function useRoutes() {
  return useQuery({
    queryKey: ["routes"],
    queryFn: () => apiFetch<SavedRoute[]>("/api/routes"),
  });
}

export function useRoute(id: string) {
  return useQuery({
    queryKey: ["routes", id],
    queryFn: () => apiFetch<SavedRoute>(`/api/routes/${id}`),
    enabled: !!id,
  });
}

export function useSaveRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: SaveRouteBody) =>
      apiFetch<SavedRoute>("/api/routes", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}

// ── Share ──────────────────────────────────────────────────────────────────────

export function useShareRoute(routeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch<ShareResponse>(`/api/routes/${routeId}/share`, { method: "POST" }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["routes", routeId] });
    },
  });
}

// ── Strava ────────────────────────────────────────────────────────────────────

export function useStravaConnect() {
  return useMutation({
    mutationFn: () =>
      apiFetch<StravaConnectResponse>("/api/strava/connect", { method: "POST" }),
  });
}

export function useStravaPush() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (routeId: string) =>
      apiFetch<StravaPushResponse>("/api/strava/push", {
        method: "POST",
        body: JSON.stringify({ routeId }),
      }),
    onSuccess: (_data, routeId) => {
      void qc.invalidateQueries({ queryKey: ["routes", routeId] });
    },
  });
}
