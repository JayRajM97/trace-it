export interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_M = 6_378_137;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineMeters(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

export function bearing(a: LatLng, b: LatLng): number {
  const y = Math.sin(toRad(b.lng - a.lng)) * Math.cos(toRad(b.lat));
  const x =
    Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
    Math.sin(toRad(a.lat)) *
      Math.cos(toRad(b.lat)) *
      Math.cos(toRad(b.lng - a.lng));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function polylineArcLength(pts: LatLng[]): number {
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    total += haversineMeters(pts[i - 1]!, pts[i]!);
  }
  return total;
}

export function resamplePolyline(pts: LatLng[], n: number): LatLng[] {
  if (pts.length === 0) return [];
  if (pts.length === 1) return Array(n).fill(pts[0]);

  const totalLen = polylineArcLength(pts);
  const step = totalLen / (n - 1);
  const result: LatLng[] = [pts[0]!];
  let accumulated = 0;
  let segStart = 0;

  for (let i = 1; i < n - 1; i++) {
    const targetDist = i * step;
    while (
      segStart < pts.length - 2 &&
      accumulated + haversineMeters(pts[segStart]!, pts[segStart + 1]!) < targetDist
    ) {
      accumulated += haversineMeters(pts[segStart]!, pts[segStart + 1]!);
      segStart++;
    }
    const segLen = haversineMeters(pts[segStart]!, pts[segStart + 1]!);
    const t = segLen > 0 ? (targetDist - accumulated) / segLen : 0;
    result.push({
      lat: pts[segStart]!.lat + t * (pts[segStart + 1]!.lat - pts[segStart]!.lat),
      lng: pts[segStart]!.lng + t * (pts[segStart + 1]!.lng - pts[segStart]!.lng),
    });
  }
  result.push(pts[pts.length - 1]!);
  return result;
}
