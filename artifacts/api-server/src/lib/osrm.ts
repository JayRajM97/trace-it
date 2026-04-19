import type { TurnInstruction, LatLng } from "@workspace/api-zod";

const OSRM_BASE =
  process.env["OSRM_BASE_URL"] ?? "https://router.project-osrm.org";

interface OsrmStep {
  name: string;
  distance: number;
  duration: number;
  geometry: string;
  maneuver: {
    type: string;
    bearing_after?: number;
  };
}

interface OsrmLeg {
  steps: OsrmStep[];
}

interface OsrmTrip {
  geometry: string;
  legs: OsrmLeg[];
  distance: number;
  duration: number;
}

interface OsrmWaypoint {
  location: [number, number];
}

interface OsrmApiResponse {
  code: string;
  trips: OsrmTrip[];
  waypoints: OsrmWaypoint[];
}

export interface OsrmResult {
  waypoints: LatLng[];
  polyline: LatLng[];
  turns: TurnInstruction[];
  totalDistanceMeters: number;
  estimatedDurationSeconds: number;
}

function decodePolyline(encoded: string): LatLng[] {
  const points: LatLng[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

function mapManeuver(osrmType: string): TurnInstruction["maneuver"] {
  if (osrmType.includes("left")) return "turn-left";
  if (osrmType.includes("right")) return "turn-right";
  if (osrmType === "depart") return "depart";
  if (osrmType === "arrive") return "arrive";
  if (osrmType.includes("roundabout")) return "roundabout";
  return "continue";
}

export async function planRoute(
  waypoints: LatLng[],
  roundtrip: boolean
): Promise<OsrmResult> {
  const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(";");
  const params = new URLSearchParams({
    steps: "true",
    geometries: "polyline",
    overview: "full",
    annotations: "false",
    source: "first",
    destination: "last",
    roundtrip: String(roundtrip),
  });
  const url = `${OSRM_BASE}/trip/v1/foot/${coords}?${params}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM error: ${res.status} for ${url}`);
  const data = (await res.json()) as OsrmApiResponse;

  if (data.code !== "Ok" || !data.trips[0]) {
    throw new Error(`OSRM returned code: ${data.code}`);
  }

  const trip = data.trips[0];
  const polyline = decodePolyline(trip.geometry);
  const snappedWaypoints: LatLng[] = data.waypoints.map((w) => ({
    lat: w.location[1]!,
    lng: w.location[0]!,
  }));

  const turns: TurnInstruction[] = [];
  let stepIndex = 0;

  for (const leg of trip.legs) {
    for (const step of leg.steps) {
      turns.push({
        stepIndex,
        instruction: step.name || "Continue",
        distance: step.distance,
        duration: step.duration,
        bearing: step.maneuver.bearing_after ?? 0,
        maneuver: mapManeuver(step.maneuver.type),
      });
      stepIndex += decodePolyline(step.geometry).length;
    }
  }

  return {
    waypoints: snappedWaypoints,
    polyline,
    turns,
    totalDistanceMeters: trip.distance,
    estimatedDurationSeconds: trip.duration,
  };
}
