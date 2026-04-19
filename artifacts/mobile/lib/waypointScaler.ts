import type { NormalizedPoint } from "../constants/shapes";
import type { LatLng } from "./geo";

const EARTH_RADIUS_M = 6_378_137;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function offsetLatLng(center: LatLng, dNorthM: number, dEastM: number): LatLng {
  const dLat = dNorthM / EARTH_RADIUS_M;
  const dLng = dEastM / (EARTH_RADIUS_M * Math.cos(toRad(center.lat)));
  return {
    lat: center.lat + (dLat * 180) / Math.PI,
    lng: center.lng + (dLng * 180) / Math.PI,
  };
}

export function scaleWaypoints(
  waypoints: NormalizedPoint[],
  center: LatLng,
  diameterMeters: number
): LatLng[] {
  return waypoints.map(({ x, y }) => {
    const dEast = (x - 0.5) * diameterMeters;
    const dNorth = (0.5 - y) * diameterMeters;
    return offsetLatLng(center, dNorth, dEast);
  });
}
