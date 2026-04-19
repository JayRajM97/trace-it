import { haversineMeters, resamplePolyline } from "./geo";
import type { LatLng } from "./geo";

export function computeFidelityScore(
  intendedPolyline: LatLng[],
  walkedPolyline: LatLng[],
  diameterMeters: number
): number {
  if (walkedPolyline.length < 2 || intendedPolyline.length < 2) return 0;

  const N = 100;
  const intended = resamplePolyline(intendedPolyline, N);
  const walked = resamplePolyline(walkedPolyline, N);

  const minDists = intended.map((ip) =>
    Math.min(...walked.map((wp) => haversineMeters(ip, wp)))
  );
  const meanDev = minDists.reduce((a, b) => a + b, 0) / minDists.length;
  const tolerance = diameterMeters * 0.15;
  return Math.max(0, Math.min(1, 1 - meanDev / tolerance));
}
