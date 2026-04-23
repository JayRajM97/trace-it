import type { NormalizedPoint } from "./shapes";

const EARTH_R = 6_378_137;

function offsetLatLng(lat: number, lng: number, dNorthM: number, dEastM: number) {
  const dLat = dNorthM / EARTH_R;
  const dLng = dEastM / (EARTH_R * Math.cos((lat * Math.PI) / 180));
  return {
    lat: lat + (dLat * 180) / Math.PI,
    lng: lng + (dLng * 180) / Math.PI,
  };
}

export function scaleShape(
  waypoints: NormalizedPoint[],
  centerLat: number,
  centerLng: number,
  diameterMeters: number
): Array<{ lat: number; lng: number }> {
  return waypoints.map(({ x, y }) => {
    const dEast = (x - 0.5) * diameterMeters;
    const dNorth = (0.5 - y) * diameterMeters;
    return offsetLatLng(centerLat, centerLng, dNorth, dEast);
  });
}
