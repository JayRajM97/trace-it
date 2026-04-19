import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { ShapePreview } from "./ShapePreview";
import type { Shape } from "../../constants/shapes";
import { Colors } from "../../constants/colors";

interface ShapeCardProps {
  shape: Shape;
  selected?: boolean;
  onPress: (shape: Shape) => void;
}

export function ShapeCard({ shape, selected = false, onPress }: ShapeCardProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(shape)}
      style={[styles.card, selected && styles.selected]}
      activeOpacity={0.7}
    >
      <ShapePreview
        waypoints={shape.waypoints}
        size={56}
        color={selected ? Colors.primary : Colors.textSecondary}
      />
      <Text style={[styles.name, selected && styles.nameSelected]}>{shape.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 8,
  },
  selected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceElevated,
  },
  name: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  nameSelected: {
    color: Colors.primary,
  },
});
