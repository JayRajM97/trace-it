import React from "react";
import Svg, { Polyline } from "react-native-svg";
import type { NormalizedPoint } from "../../constants/shapes";
import { Colors } from "../../constants/colors";

interface ShapePreviewProps {
  waypoints: NormalizedPoint[];
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function ShapePreview({
  waypoints,
  size = 60,
  color = Colors.primary,
  strokeWidth = 2,
}: ShapePreviewProps) {
  const padding = strokeWidth * 2;
  const inner = size - padding * 2;
  const points = waypoints
    .map((p) => `${(p.x * inner + padding).toFixed(1)},${(p.y * inner + padding).toFixed(1)}`)
    .join(" ");

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Polyline
        points={points}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
