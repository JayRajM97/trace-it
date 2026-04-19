import { useState, useEffect, useCallback } from "react";
import * as Location from "expo-location";
import type { LatLng } from "../lib/geo";

export interface LocationState {
  coords: LatLng | null;
  error: string | null;
  isLoading: boolean;
}

export function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>({
    coords: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;
      if (status !== "granted") {
        setState({ coords: null, error: "Location permission denied", isLoading: false });
        return;
      }
      const initial = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (cancelled) return;
      setState({
        coords: { lat: initial.coords.latitude, lng: initial.coords.longitude },
        error: null,
        isLoading: false,
      });
    })().catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  return state;
}

export function useWatchLocation(
  onUpdate: (coords: LatLng & { timestamp: number }) => void,
  active: boolean
) {
  const stableOnUpdate = useCallback(onUpdate, [onUpdate]);

  useEffect(() => {
    if (!active) return;
    const subRef: { sub: { remove: () => void } | null } = { sub: null };

    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status !== "granted") return;
      return Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (loc) => {
          stableOnUpdate({
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            timestamp: loc.timestamp,
          });
        }
      ).then((s) => { subRef.sub = s; });
    }).catch(() => undefined);

    return () => { subRef.sub?.remove(); };
  }, [active, stableOnUpdate]);
}
