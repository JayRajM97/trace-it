import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { Colors } from "../../constants/colors";
import type { LatLng } from "../../lib/geo";

interface UserDotProps {
  coords: LatLng;
}

export function UserDot({ coords }: UserDotProps) {
  const pulse = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.6, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  return (
    <Marker coordinate={{ latitude: coords.lat, longitude: coords.lng }} anchor={{ x: 0.5, y: 0.5 }}>
      <View style={styles.wrapper}>
        <Animated.View style={[styles.ring, { opacity: pulse, transform: [{ scale: pulse }] }]} />
        <View style={styles.dot} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  ring: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
});
