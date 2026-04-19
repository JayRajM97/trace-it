import { useCallback, useRef } from "react";
import * as Haptics from "expo-haptics";
import { haversineMeters } from "../lib/geo";
import { useRouteContext } from "../context/RouteContext";
import type { LatLng } from "../lib/geo";

const ARRIVAL_THRESHOLD_M = 20;

export function useNavigationStep() {
  const {
    activeRoute,
    currentStepIndex,
    isWalking,
    advanceStep,
    appendWalkedPoint,
    finishWalking,
  } = useRouteContext();

  const didFinish = useRef(false);

  const handleLocationUpdate = useCallback(
    (coords: LatLng & { timestamp: number }) => {
      if (!isWalking || !activeRoute || didFinish.current) return;

      appendWalkedPoint(coords);

      const currentTurn = activeRoute.turns[currentStepIndex];
      if (!currentTurn) return;

      const targetWaypoint = activeRoute.waypoints[currentTurn.stepIndex];
      if (!targetWaypoint) return;

      const dist = haversineMeters(coords, targetWaypoint);
      if (dist < ARRIVAL_THRESHOLD_M) {
        const isLast = currentStepIndex >= activeRoute.turns.length - 1;
        if (isLast) {
          didFinish.current = true;
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          finishWalking();
        } else {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          advanceStep();
        }
      }
    },
    [isWalking, activeRoute, currentStepIndex, advanceStep, appendWalkedPoint, finishWalking]
  );

  const currentTurn = activeRoute?.turns[currentStepIndex] ?? null;
  const nextWaypoint = currentTurn
    ? (activeRoute?.waypoints[currentTurn.stepIndex] ?? null)
    : null;
  const progress = activeRoute
    ? currentStepIndex / Math.max(1, activeRoute.turns.length - 1)
    : 0;

  return { handleLocationUpdate, currentTurn, nextWaypoint, progress };
}
