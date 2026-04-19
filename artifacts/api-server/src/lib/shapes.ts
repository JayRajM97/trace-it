export interface NormalizedPoint {
  x: number;
  y: number;
}

export interface ShapeDefinition {
  id: string;
  name: string;
  closedLoop: boolean;
  waypoints: NormalizedPoint[];
}

export const SHAPES: ShapeDefinition[] = [
  {
    id: "letter_a",
    name: "Letter A",
    closedLoop: false,
    waypoints: [
      { x: 0.5, y: 0.0 },
      { x: 0.0, y: 1.0 },
      { x: 0.25, y: 0.55 },
      { x: 0.75, y: 0.55 },
      { x: 1.0, y: 1.0 },
      { x: 0.5, y: 0.0 },
    ],
  },
  {
    id: "letter_b",
    name: "Letter B",
    closedLoop: false,
    waypoints: [
      { x: 0.1, y: 0.0 },
      { x: 0.1, y: 1.0 },
      { x: 0.1, y: 0.5 },
      { x: 0.7, y: 0.5 },
      { x: 0.9, y: 0.65 },
      { x: 0.9, y: 0.85 },
      { x: 0.7, y: 1.0 },
      { x: 0.1, y: 1.0 },
      { x: 0.7, y: 0.5 },
      { x: 0.9, y: 0.25 },
      { x: 0.9, y: 0.15 },
      { x: 0.7, y: 0.0 },
      { x: 0.1, y: 0.0 },
    ],
  },
  {
    id: "letter_s",
    name: "Letter S",
    closedLoop: false,
    waypoints: [
      { x: 0.9, y: 0.1 },
      { x: 0.5, y: 0.0 },
      { x: 0.1, y: 0.1 },
      { x: 0.1, y: 0.4 },
      { x: 0.5, y: 0.5 },
      { x: 0.9, y: 0.6 },
      { x: 0.9, y: 0.9 },
      { x: 0.5, y: 1.0 },
      { x: 0.1, y: 0.9 },
    ],
  },
  {
    id: "heart",
    name: "Heart",
    closedLoop: true,
    waypoints: [
      { x: 0.5, y: 1.0 },
      { x: 0.0, y: 0.45 },
      { x: 0.0, y: 0.2 },
      { x: 0.25, y: 0.0 },
      { x: 0.5, y: 0.3 },
      { x: 0.75, y: 0.0 },
      { x: 1.0, y: 0.2 },
      { x: 1.0, y: 0.45 },
      { x: 0.5, y: 1.0 },
    ],
  },
  {
    id: "star",
    name: "Star",
    closedLoop: true,
    waypoints: [
      { x: 0.5, y: 0.0 },
      { x: 0.38, y: 0.38 },
      { x: 0.0, y: 0.38 },
      { x: 0.31, y: 0.61 },
      { x: 0.19, y: 1.0 },
      { x: 0.5, y: 0.76 },
      { x: 0.81, y: 1.0 },
      { x: 0.69, y: 0.61 },
      { x: 1.0, y: 0.38 },
      { x: 0.62, y: 0.38 },
      { x: 0.5, y: 0.0 },
    ],
  },
  {
    id: "arrow",
    name: "Arrow",
    closedLoop: false,
    waypoints: [
      { x: 0.0, y: 0.5 },
      { x: 0.6, y: 0.5 },
      { x: 0.6, y: 0.2 },
      { x: 1.0, y: 0.5 },
      { x: 0.6, y: 0.8 },
      { x: 0.6, y: 0.5 },
    ],
  },
  {
    id: "triangle",
    name: "Triangle",
    closedLoop: true,
    waypoints: [
      { x: 0.5, y: 0.0 },
      { x: 1.0, y: 1.0 },
      { x: 0.0, y: 1.0 },
      { x: 0.5, y: 0.0 },
    ],
  },
  {
    id: "circle",
    name: "Circle",
    closedLoop: true,
    waypoints: [
      { x: 0.5, y: 0.0 },
      { x: 0.85, y: 0.07 },
      { x: 1.0, y: 0.5 },
      { x: 0.85, y: 0.93 },
      { x: 0.5, y: 1.0 },
      { x: 0.15, y: 0.93 },
      { x: 0.0, y: 0.5 },
      { x: 0.15, y: 0.07 },
      { x: 0.5, y: 0.0 },
    ],
  },
  {
    id: "fish",
    name: "Fish",
    closedLoop: false,
    waypoints: [
      { x: 0.0, y: 0.3 },
      { x: 0.2, y: 0.0 },
      { x: 0.2, y: 0.7 },
      { x: 0.0, y: 1.0 },
      { x: 0.3, y: 0.5 },
      { x: 0.7, y: 0.35 },
      { x: 1.0, y: 0.5 },
      { x: 0.7, y: 0.65 },
      { x: 0.3, y: 0.5 },
    ],
  },
  {
    id: "house",
    name: "House",
    closedLoop: false,
    waypoints: [
      { x: 0.0, y: 0.5 },
      { x: 0.5, y: 0.0 },
      { x: 1.0, y: 0.5 },
      { x: 1.0, y: 1.0 },
      { x: 0.0, y: 1.0 },
      { x: 0.0, y: 0.5 },
      { x: 1.0, y: 0.5 },
    ],
  },
];

export function findShape(id: string): ShapeDefinition | undefined {
  return SHAPES.find((s) => s.id === id);
}
