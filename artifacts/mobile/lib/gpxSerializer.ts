import type { LatLng } from "./geo";

export interface WalkedPoint extends LatLng {
  timestamp: number;
}

export function serializeToGpx(
  shapeId: string,
  walkedPoints: WalkedPoint[]
): string {
  const trackPoints = walkedPoints
    .map(
      (p) =>
        `    <trkpt lat="${p.lat.toFixed(7)}" lon="${p.lng.toFixed(7)}">\n` +
        `      <time>${new Date(p.timestamp).toISOString()}</time>\n` +
        `    </trkpt>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="TraceIt"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>TraceIt - ${shapeId}</name>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>${shapeId}</name>
    <trkseg>
${trackPoints}
    </trkseg>
  </trk>
</gpx>`;
}
