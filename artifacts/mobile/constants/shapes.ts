export type ShapeCategory = "letter" | "animal" | "geometric" | "object";

export interface NormalizedPoint {
  x: number;
  y: number;
}

export interface Shape {
  id: string;
  name: string;
  category: ShapeCategory;
  closedLoop: boolean;
  waypoints: NormalizedPoint[];
}

export const SHAPES: Shape[] = [
  {
    id: "letter_a",
    name: "Letter A",
    category: "letter",
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
    category: "letter",
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
    category: "letter",
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
    category: "object",
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
    category: "geometric",
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
    category: "object",
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
    category: "geometric",
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
    category: "geometric",
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
    category: "animal",
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
    category: "object",
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

export function findShape(id: string): Shape | undefined {
  return SHAPES.find((s) => s.id === id);
}

export const SHAPE_CATEGORIES: ShapeCategory[] = ["letter", "animal", "geometric", "object"];
