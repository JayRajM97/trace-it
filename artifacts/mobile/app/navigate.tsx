import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Colors } from "../constants/colors";
import { RouteMap } from "../components/map/RouteMap";
import { TurnCard } from "../components/navigation/TurnCard";
import { ProgressBar } from "../components/navigation/ProgressBar";
import { Button } from "../components/ui/Button";
import { useRouteContext } from "../context/RouteContext";
import { useNavigationStep } from "../hooks/useNavigation";
import { useWatchLocation } from "../hooks/useLocation";
import type { LatLng } from "../lib/geo";

export default function NavigateScreen() {
  const { activeRoute, walkedPolyline, isWalking } = useRouteContext();
  const { handleLocationUpdate, currentTurn, nextWaypoint, progress } = useNavigationStep();
  const [userCoords, setUserCoords] = useState<LatLng | null>(null);

  const onLocation = useCallback(
    (coords: LatLng & { timestamp: number }) => {
      setUserCoords(coords);
      handleLocationUpdate(coords);
    },
    [handleLocationUpdate]
  );

  useWatchLocation(onLocation, isWalking);

  React.useEffect(() => {
    if (!isWalking && walkedPolyline.length > 0) {
      router.replace("/complete");
    }
  }, [isWalking, walkedPolyline.length]);

  if (!activeRoute) {
    router.replace("/home");
    return null;
  }

  const handleFinishEarly = () => {
    Alert.alert("Finish Walk?", "Your progress will be saved.", [
      { text: "Keep Walking", style: "cancel" },
      {
        text: "Finish",
        style: "destructive",
        onPress: () => {
          useRouteContext;
          router.replace("/complete");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <RouteMap
        routePolyline={activeRoute.polyline}
        walkedPolyline={walkedPolyline}
        userCoords={userCoords ?? undefined}
        style={styles.map}
      />
      <SafeAreaView style={styles.panel} edges={["bottom"]}>
        <ProgressBar progress={progress} />
        <Text style={styles.stepCount}>
          Step {Math.min((activeRoute.turns.indexOf(currentTurn!) + 1) || 1, activeRoute.turns.length)} of {activeRoute.turns.length}
        </Text>
        {currentTurn && (
          <TurnCard
            turn={currentTurn}
            distanceToNext={nextWaypoint && userCoords
              ? undefined
              : undefined}
          />
        )}
        <Button
          label="Finish Early"
          variant="ghost"
          onPress={handleFinishEarly}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  map: { flex: 3 },
  panel: {
    flex: 2,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  stepCount: { fontSize: 12, color: Colors.textSecondary, textAlign: "center" },
});
