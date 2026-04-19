import React from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useRoutes } from "../hooks/useRoute";
import type { SavedRoute } from "@workspace/api-zod";

function RouteCard({ route }: { route: SavedRoute }) {
  const date = new Date(route.createdAt).toLocaleDateString();
  const distKm = route.totalDistanceMeters
    ? (route.totalDistanceMeters / 1000).toFixed(2)
    : "—";
  const fidelityPct = route.fidelityScore != null
    ? `${Math.round(route.fidelityScore * 100)}%`
    : "—";

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{route.title || route.shapeId}</Text>
        <Text style={[styles.fidelityBadge, { color: route.fidelityScore && route.fidelityScore >= 0.7 ? Colors.success : Colors.warning }]}>
          {fidelityPct}
        </Text>
      </View>
      <View style={styles.cardStats}>
        <Text style={styles.stat}>{distKm} km</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.stat}>{date}</Text>
        {route.stravaActivityId && (
          <>
            <Text style={styles.dot}>·</Text>
            <Text style={[styles.stat, { color: Colors.primary }]}>On Strava</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function HistoryScreen() {
  const { data: routes, isLoading, refetch, isFetching } = useRoutes();

  if (isLoading) return <LoadingSpinner />;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <RouteCard route={item} />}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => void refetch()}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No routes yet.</Text>
            <Text style={styles.emptyHint}>Walk a shape to see it here.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 8,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary, flex: 1 },
  fidelityBadge: { fontSize: 16, fontWeight: "700" },
  cardStats: { flexDirection: "row", alignItems: "center", gap: 6 },
  stat: { fontSize: 13, color: Colors.textSecondary },
  dot: { color: Colors.textDisabled },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 8 },
  emptyText: { fontSize: 18, fontWeight: "600", color: Colors.textPrimary },
  emptyHint: { fontSize: 14, color: Colors.textSecondary },
});
