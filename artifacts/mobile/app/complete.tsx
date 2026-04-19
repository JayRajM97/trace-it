import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { v4 as uuidv4 } from "uuid";
import { Colors } from "../constants/colors";
import { Button } from "../components/ui/Button";
import { RouteMap } from "../components/map/RouteMap";
import { useRouteContext } from "../context/RouteContext";
import { computeFidelityScore } from "../lib/fidelityScore";
import { serializeToGpx } from "../lib/gpxSerializer";
import { useSaveRoute, useShareRoute, useStravaPush, useStravaConnect } from "../hooks/useRoute";
import type { LatLng } from "../lib/geo";
import * as WebBrowser from "expo-web-browser";

function FidelityRing({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const label = pct >= 90 ? "Perfect!" : pct >= 70 ? "Great trace" : pct >= 50 ? "Good effort" : "Keep practicing";
  return (
    <View style={styles.ringContainer}>
      <Text style={styles.ringPct}>{pct}%</Text>
      <Text style={styles.ringLabel}>{label}</Text>
      <Text style={styles.ringCaption}>Fidelity score</Text>
    </View>
  );
}

export default function CompleteScreen() {
  const { activeRoute, walkedPolyline, diameterMeters, reset } = useRouteContext();
  const saveRoute = useSaveRoute();
  const savedRouteId = useRef<string | null>(null);
  const shareRoute = useShareRoute(savedRouteId.current ?? "");
  const stravaPush = useStravaPush();
  const stravaConnect = useStravaConnect();
  const [fidelity, setFidelity] = useState<number>(0);
  const [gpxContent, setGpxContent] = useState<string>("");

  useEffect(() => {
    if (!activeRoute) return;

    const intendedPolyline: LatLng[] = activeRoute.polyline;
    const score = computeFidelityScore(intendedPolyline, walkedPolyline, diameterMeters);
    const gpx = serializeToGpx(activeRoute.shapeId, walkedPolyline);
    setFidelity(score);
    setGpxContent(gpx);

    const routeId = uuidv4();
    savedRouteId.current = routeId;

    saveRoute.mutate({
      routeId,
      shapeId: activeRoute.shapeId,
      centerLat: activeRoute.centerLat,
      centerLng: activeRoute.centerLng,
      diameterMeters: activeRoute.diameterMeters,
      polylineJson: JSON.stringify(activeRoute.polyline),
      turnsJson: JSON.stringify(activeRoute.turns),
      gpxContent: gpx,
      totalDistanceMeters: activeRoute.totalDistanceMeters,
      fidelityScore: score,
      title: `${activeRoute.shapeId.replace("_", " ")}`,
    });
  }, []);

  const handleStravaShare = async () => {
    if (!savedRouteId.current) return;
    try {
      const connectResult = await stravaConnect.mutateAsync();
      await WebBrowser.openAuthSessionAsync(connectResult.authUrl, "traceit://strava-connected");
      await stravaPush.mutateAsync(savedRouteId.current);
      Alert.alert("Success", "Route pushed to Strava!");
    } catch {
      Alert.alert("Error", "Could not push to Strava.");
    }
  };

  const handleSocialShare = async () => {
    if (!savedRouteId.current) return;
    try {
      const result = await shareRoute.mutateAsync();
      await Share.share({ url: result.shareUrl, message: `Check out my GPS art! ${result.shareUrl}` });
    } catch {
      Alert.alert("Error", "Could not generate share card.");
    }
  };

  const handleDone = () => {
    reset();
    router.replace("/home");
  };

  if (!activeRoute) {
    router.replace("/home");
    return null;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Walk Complete!</Text>
        <RouteMap
          routePolyline={activeRoute.polyline}
          walkedPolyline={walkedPolyline}
          style={styles.mapThumb}
        />
        <FidelityRing score={fidelity} />
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statVal}>
              {(activeRoute.totalDistanceMeters / 1000).toFixed(2)} km
            </Text>
            <Text style={styles.statLbl}>Distance</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statVal}>{activeRoute.turns.length}</Text>
            <Text style={styles.statLbl}>Turns</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Button
            label="Share Card"
            onPress={handleSocialShare}
            loading={shareRoute.isPending}
            variant="secondary"
          />
          <Button
            label="Push to Strava"
            onPress={handleStravaShare}
            loading={stravaPush.isPending || stravaConnect.isPending}
            variant="secondary"
          />
          <Button label="Done" onPress={handleDone} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, gap: 20 },
  title: { fontSize: 28, fontWeight: "700", color: Colors.textPrimary, textAlign: "center" },
  mapThumb: { height: 220, borderRadius: 16, overflow: "hidden" },
  ringContainer: { alignItems: "center", gap: 4 },
  ringPct: { fontSize: 56, fontWeight: "700", color: Colors.primary },
  ringLabel: { fontSize: 18, fontWeight: "600", color: Colors.textPrimary },
  ringCaption: { fontSize: 12, color: Colors.textSecondary },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  stat: { alignItems: "center", gap: 4 },
  statVal: { fontSize: 22, fontWeight: "700", color: Colors.textPrimary },
  statLbl: { fontSize: 12, color: Colors.textSecondary },
  actions: { gap: 12 },
});
