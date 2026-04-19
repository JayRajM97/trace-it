import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import { Colors } from "../constants/colors";
import { Button } from "../components/ui/Button";
import { ShapePreview } from "../components/shapes/ShapePreview";
import { useLocation } from "../hooks/useLocation";
import { useRouteContext } from "../context/RouteContext";
import { useGenerateRoute } from "../hooks/useRoute";
import { findShape } from "../constants/shapes";

export default function HomeScreen() {
  const { coords, isLoading: locationLoading } = useLocation();
  const { center, diameterMeters, selectedShapeId, setCenter, setDiameter, setActiveRoute } =
    useRouteContext();
  const generateRoute = useGenerateRoute();
  const selectedShape = selectedShapeId ? findShape(selectedShapeId) : null;

  const effectiveCenter = center ?? coords;

  const handleGenerate = useCallback(async () => {
    if (!effectiveCenter) {
      Alert.alert("Location needed", "Wait for location or set a center pin.");
      return;
    }
    if (!selectedShapeId) {
      Alert.alert("Pick a shape", "Select a shape first.");
      return;
    }
    if (effectiveCenter) {
      setCenter(effectiveCenter);
    }
    try {
      const route = await generateRoute.mutateAsync({
        shapeId: selectedShapeId,
        centerLat: effectiveCenter.lat,
        centerLng: effectiveCenter.lng,
        diameterMeters,
      });
      setActiveRoute(route);
      router.push("/route-preview");
    } catch {
      Alert.alert("Error", "Could not generate route. Try a different location or size.");
    }
  }, [effectiveCenter, selectedShapeId, diameterMeters, generateRoute, setCenter, setActiveRoute]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>TraceIt</Text>
        <Text style={styles.subtitle}>Turn your walk into GPS art</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Diameter</Text>
          <Text style={styles.value}>{(diameterMeters / 1000).toFixed(1)} km</Text>
          <Slider
            style={styles.slider}
            minimumValue={500}
            maximumValue={10000}
            step={100}
            value={diameterMeters}
            onValueChange={setDiameter}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.border}
            thumbTintColor={Colors.primary}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderHint}>500 m</Text>
            <Text style={styles.sliderHint}>10 km</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          {locationLoading ? (
            <Text style={styles.hint}>Getting location...</Text>
          ) : coords ? (
            <Text style={styles.hint}>
              {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </Text>
          ) : (
            <Text style={[styles.hint, { color: Colors.error }]}>Location unavailable</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Shape</Text>
          {selectedShape ? (
            <View style={styles.shapeRow}>
              <ShapePreview waypoints={selectedShape.waypoints} size={48} />
              <Text style={styles.shapeName}>{selectedShape.name}</Text>
            </View>
          ) : (
            <Text style={styles.hint}>No shape selected</Text>
          )}
          <Button
            label="Pick Shape"
            variant="secondary"
            onPress={() => router.push("/shape-picker")}
            style={styles.pickBtn}
          />
        </View>

        <Button
          label="Generate Route"
          onPress={handleGenerate}
          loading={generateRoute.isPending}
          disabled={!selectedShapeId || !effectiveCenter}
          style={styles.generateBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, gap: 8 },
  title: { fontSize: 32, fontWeight: "700", color: Colors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: 24 },
  section: { marginBottom: 24 },
  label: { fontSize: 12, color: Colors.textSecondary, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 },
  value: { fontSize: 28, fontWeight: "700", color: Colors.primary, marginBottom: 8 },
  slider: { width: "100%", height: 40 },
  sliderLabels: { flexDirection: "row", justifyContent: "space-between" },
  sliderHint: { fontSize: 11, color: Colors.textSecondary },
  hint: { fontSize: 14, color: Colors.textSecondary },
  shapeRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  shapeName: { fontSize: 16, color: Colors.textPrimary, fontWeight: "600" },
  pickBtn: { marginTop: 8 },
  generateBtn: { marginTop: 8 },
});
