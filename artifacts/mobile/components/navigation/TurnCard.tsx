import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../constants/colors";
import type { TurnInstruction } from "@workspace/api-zod";

interface TurnCardProps {
  turn: TurnInstruction;
  distanceToNext?: number;
}

function ManeuverIcon({ maneuver, bearing }: { maneuver: TurnInstruction["maneuver"]; bearing: number }) {
  const rotate = bearing;
  const arrowPath = "M12 2 L12 16 M6 10 L12 16 L18 10";
  return (
    <Svg width={40} height={40} viewBox="0 0 24 24" style={{ transform: [{ rotate: `${rotate}deg` }] }}>
      <Path d={arrowPath} stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

export function TurnCard({ turn, distanceToNext }: TurnCardProps) {
  return (
    <View style={styles.card}>
      <ManeuverIcon maneuver={turn.maneuver} bearing={turn.bearing} />
      <View style={styles.content}>
        <Text style={styles.instruction} numberOfLines={2}>{turn.instruction}</Text>
        {distanceToNext != null && (
          <Text style={styles.distance}>{formatDistance(distanceToNext)}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: { flex: 1 },
  instruction: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  distance: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
