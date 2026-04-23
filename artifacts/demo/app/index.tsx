import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { SHAPES, type Shape } from "../lib/shapes";
import { scaleShape } from "../lib/scaleShape";
import { buildMapHtml } from "../lib/mapHtml";

// Lazy-load WebView only on native to avoid web crash
const WebView = Platform.OS !== "web"
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ? (require("react-native-webview").WebView as React.ComponentType<{ source: { html: string }; style: object; scrollEnabled: boolean; originWhitelist: string[] }>)
  : null;

const DIAMETERS = [500, 1000, 2000, 5000];

export default function DemoScreen() {
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedShape, setSelectedShape] = useState<Shape>(SHAPES[0]!);
  const [diameter, setDiameter] = useState(1000);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // Set a fallback after 4s so map shows even if location is slow
    const fallbackTimer = setTimeout(() => {
      setCenter((prev) => prev ?? { lat: 19.076, lng: 72.8777 });
      setLocationError((prev) => prev ?? "Location slow — showing Mumbai");
    }, 4000);

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setCenter({ lat: 19.076, lng: 72.8777 });
          setLocationError("Location denied — showing Mumbai");
          clearTimeout(fallbackTimer);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        clearTimeout(fallbackTimer);
        setCenter({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        setLocationError(null);
      } catch {
        clearTimeout(fallbackTimer);
        setCenter({ lat: 19.076, lng: 72.8777 });
        setLocationError("Location unavailable — showing Mumbai");
      }
    })();

    return () => clearTimeout(fallbackTimer);
  }, []);

  const mapHtml = center
    ? buildMapHtml(
        center,
        scaleShape(selectedShape.waypoints, center.lat, center.lng, diameter),
        selectedShape.name
      )
    : null;

  return (
    <View style={styles.root}>
      {/* Map */}
      <View style={styles.mapContainer}>
        {mapHtml ? (
          Platform.OS === "web" ? (
            // @ts-expect-error iframe is valid on web
            <iframe
              srcDoc={mapHtml}
              style={{ flex: 1, border: "none", width: "100%", height: "100%" }}
            />
          ) : WebView ? (
            <WebView
              source={{ html: mapHtml }}
              style={styles.map}
              scrollEnabled={false}
              originWhitelist={["*"]}
            />
          ) : null
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>
              {locationError ?? "Getting location…"}
            </Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <SafeAreaView style={styles.panel} edges={["bottom"]}>
        {locationError && (
          <Text style={styles.errorBanner}>{locationError}</Text>
        )}

        {/* Diameter picker */}
        <View style={styles.row}>
          <Text style={styles.sectionLabel}>SIZE</Text>
          <View style={styles.chipRow}>
            {DIAMETERS.map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => setDiameter(d)}
                style={[styles.chip, diameter === d && styles.chipActive]}
              >
                <Text style={[styles.chipText, diameter === d && styles.chipTextActive]}>
                  {d >= 1000 ? `${d / 1000} km` : `${d} m`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Shape picker */}
        <Text style={styles.sectionLabel}>SHAPE</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shapeScroll}
        >
          {SHAPES.map((shape) => (
            <TouchableOpacity
              key={shape.id}
              onPress={() => setSelectedShape(shape)}
              style={[
                styles.shapeBtn,
                selectedShape.id === shape.id && styles.shapeBtnActive,
              ]}
            >
              <Text style={styles.shapeEmoji}>{shape.emoji}</Text>
              <Text
                style={[
                  styles.shapeName,
                  selectedShape.id === shape.id && styles.shapeNameActive,
                ]}
              >
                {shape.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const C = {
  bg: "#0f0f0f",
  surface: "#1a1a1a",
  border: "#2a2a2a",
  primary: "#00E5FF",
  text: "#ffffff",
  textDim: "#888888",
  error: "#FF6B6B",
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  mapPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mapPlaceholderText: { color: C.textDim, fontSize: 16 },
  panel: {
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    gap: 10,
  },
  errorBanner: {
    color: C.error,
    fontSize: 12,
    textAlign: "center",
  },
  row: { gap: 8 },
  sectionLabel: {
    fontSize: 11,
    color: C.textDim,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 2,
  },
  chipRow: { flexDirection: "row", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
  },
  chipActive: { backgroundColor: C.primary, borderColor: C.primary },
  chipText: { fontSize: 13, color: C.textDim, fontWeight: "500" },
  chipTextActive: { color: C.bg, fontWeight: "700" },
  shapeScroll: { paddingVertical: 4, gap: 8 },
  shapeBtn: {
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    gap: 4,
    minWidth: 72,
  },
  shapeBtnActive: { borderColor: C.primary, backgroundColor: "#0a1a1e" },
  shapeEmoji: { fontSize: 24 },
  shapeName: { fontSize: 11, color: C.textDim, fontWeight: "500" },
  shapeNameActive: { color: C.primary, fontWeight: "600" },
});
