import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Colors } from "../constants/colors";
import { RouteMap } from "../components/map/RouteMap";
import { Button } from "../components/ui/Button";
import { useRouteContext } from "../context/RouteContext";

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `~${mins} min`;
  return `~${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
  return `${Math.round(meters)} m`;
}

export default function RoutePreviewScreen() {
  const { activeRoute, startWalking } = useRouteContext();

  if (!activeRoute) {
    router.replace("/home");
    return null;
  }

  const handleStart = () => {
    const confirm = () => {
      startWalking();
      router.push("/navigate");
    };
    Alert.alert(
      "Start Walk",
      "Follow the turn-by-turn directions to trace your shape. Ready?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Start", onPress: confirm },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <RouteMap
        routePolyline={activeRoute.polyline}
        waypoints={activeRoute.waypoints}
        style={styles.map}
      />
      <SafeAreaView style={styles.sheet} edges={["bottom"]}>
        <Text style={styles.shapeTitle}>{activeRoute.shapeId.replace("_", " ").toUpperCase()}</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatDistance(activeRoute.totalDistanceMeters)}</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatDuration(activeRoute.estimatedDurationSeconds)}</Text>
            <Text style={styles.statLabel}>Est. Time</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{activeRoute.turns.length}</Text>
            <Text style={styles.statLabel}>Turns</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Button
            label="Try Different Shape"
            variant="secondary"
            onPress={() => router.push("/shape-picker")}
            style={{ flex: 1 }}
          />
          <Button
            label="Start Walk"
            onPress={handleStart}
            style={{ flex: 1 }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  map: { flex: 1 },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  shapeTitle: { fontSize: 20, fontWeight: "700", color: Colors.textPrimary, textAlign: "center" },
  stats: { flexDirection: "row", justifyContent: "space-around" },
  stat: { alignItems: "center", gap: 4 },
  statValue: { fontSize: 22, fontWeight: "700", color: Colors.primary },
  statLabel: { fontSize: 12, color: Colors.textSecondary },
  actions: { flexDirection: "row", gap: 12 },
});
