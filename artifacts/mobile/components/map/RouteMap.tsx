import React, { useRef } from "react";
import MapView, { Polyline, Marker, type Region } from "react-native-maps";
import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";
import type { LatLng } from "../../lib/geo";

interface RouteMapProps {
  routePolyline: LatLng[];
  walkedPolyline?: LatLng[];
  userCoords?: LatLng;
  waypoints?: LatLng[];
  style?: object;
  followUser?: boolean;
}

function boundsForPolyline(pts: LatLng[]): Region | null {
  if (pts.length === 0) return null;
  const lats = pts.map((p) => p.lat);
  const lngs = pts.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const padding = 0.3;
  const latDelta = (maxLat - minLat) * (1 + padding) || 0.01;
  const lngDelta = (maxLng - minLng) * (1 + padding) || 0.01;
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
}

export function RouteMap({
  routePolyline,
  walkedPolyline,
  userCoords,
  waypoints,
  style,
}: RouteMapProps) {
  const mapRef = useRef<MapView>(null);
  const region = boundsForPolyline(routePolyline);

  return (
    <MapView
      ref={mapRef}
      style={[styles.map, style]}
      initialRegion={region ?? undefined}
      mapType="standard"
      showsUserLocation={false}
      showsCompass
    >
      <Polyline
        coordinates={routePolyline.map((p) => ({ latitude: p.lat, longitude: p.lng }))}
        strokeColor={Colors.routeLine}
        strokeWidth={3}
        lineDashPattern={walkedPolyline?.length ? [8, 4] : undefined}
      />
      {walkedPolyline && walkedPolyline.length > 0 && (
        <Polyline
          coordinates={walkedPolyline.map((p) => ({ latitude: p.lat, longitude: p.lng }))}
          strokeColor={Colors.walkedLine}
          strokeWidth={4}
        />
      )}
      {waypoints?.map((wp, i) => (
        <Marker
          key={i}
          coordinate={{ latitude: wp.lat, longitude: wp.lng }}
          pinColor={Colors.waypointDot}
          anchor={{ x: 0.5, y: 0.5 }}
        />
      ))}
      {userCoords && (
        <Marker
          coordinate={{ latitude: userCoords.lat, longitude: userCoords.lng }}
          anchor={{ x: 0.5, y: 0.5 }}
          pinColor={Colors.primary}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
