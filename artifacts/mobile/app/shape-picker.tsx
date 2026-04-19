import React, { useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Colors } from "../constants/colors";
import { ShapeCard } from "../components/shapes/ShapeCard";
import { SHAPES, SHAPE_CATEGORIES, type ShapeCategory, type Shape } from "../constants/shapes";
import { useRouteContext } from "../context/RouteContext";

export default function ShapePickerScreen() {
  const [activeCategory, setActiveCategory] = useState<ShapeCategory | "all">("all");
  const { selectedShapeId, selectShape } = useRouteContext();

  const filtered = activeCategory === "all"
    ? SHAPES
    : SHAPES.filter((s) => s.category === activeCategory);

  const handleSelect = (shape: Shape) => {
    selectShape(shape.id);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.filters}>
        {(["all", ...SHAPE_CATEGORIES] as const).map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[styles.chip, activeCategory === cat && styles.chipActive]}
          >
            <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
              {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ShapeCard
            shape={item}
            selected={item.id === selectedShapeId}
            onPress={handleSelect}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  filters: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 12, flexWrap: "wrap" },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: "500" },
  chipTextActive: { color: Colors.background, fontWeight: "600" },
  list: { paddingHorizontal: 10, paddingBottom: 24 },
});
