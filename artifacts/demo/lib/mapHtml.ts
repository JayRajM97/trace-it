interface LatLng { lat: number; lng: number }

export function buildMapHtml(
  center: LatLng,
  shapePoints: LatLng[],
  shapeName: string
): string {
  const latlngs = JSON.stringify(shapePoints.map((p) => [p.lat, p.lng]));

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: #0f0f0f; }
    .shape-label {
      background: rgba(0,229,255,0.15);
      border: 1px solid #00E5FF;
      color: #00E5FF;
      padding: 4px 10px;
      border-radius: 20px;
      font-family: -apple-system, sans-serif;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const map = L.map('map', {
      zoomControl: true,
      attributionControl: false
    }).setView([${center.lat}, ${center.lng}], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: 'map-tiles'
    }).addTo(map);

    // Dark map filter via CSS
    const style = document.createElement('style');
    style.textContent = '.map-tiles { filter: invert(100%) hue-rotate(180deg) brightness(0.85) contrast(0.9); }';
    document.head.appendChild(style);

    const points = ${latlngs};

    // Shape polyline
    const polyline = L.polyline(points, {
      color: '#00E5FF',
      weight: 4,
      opacity: 0.95,
      lineJoin: 'round',
      lineCap: 'round'
    }).addTo(map);

    // Waypoint dots
    points.forEach((p, i) => {
      const isFirst = i === 0;
      const isLast = i === points.length - 1;
      if (isFirst || isLast) {
        L.circleMarker(p, {
          radius: isFirst ? 8 : 6,
          color: isFirst ? '#00E676' : '#FFD600',
          fillColor: isFirst ? '#00E676' : '#FFD600',
          fillOpacity: 1,
          weight: 2
        }).addTo(map);
      }
    });

    // User location dot
    L.circleMarker([${center.lat}, ${center.lng}], {
      radius: 10,
      color: '#fff',
      fillColor: '#00E5FF',
      fillOpacity: 1,
      weight: 3
    }).bindTooltip('You are here', { permanent: false }).addTo(map);

    // Label at center of shape
    const midPoint = points[Math.floor(points.length / 2)];
    L.marker(midPoint, {
      icon: L.divIcon({
        html: '<div class="shape-label">${shapeName}</div>',
        className: '',
        iconAnchor: [40, 10]
      })
    }).addTo(map);

    // Fit map to shape
    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
  </script>
</body>
</html>`;
}
