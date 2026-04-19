import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { LatLng } from "@workspace/api-zod";

const __dirname = dirname(fileURLToPath(import.meta.url));

let _fontBuffer: Buffer | null = null;

function getFontBuffer(): Buffer {
  if (_fontBuffer) return _fontBuffer;
  try {
    _fontBuffer = readFileSync(
      join(__dirname, "../assets/fonts/Inter-Regular.ttf")
    );
  } catch {
    _fontBuffer = Buffer.alloc(0);
  }
  return _fontBuffer;
}

function polylineToSvgPath(pts: LatLng[], w: number, h: number): string {
  if (pts.length === 0) return "";
  const lats = pts.map((p) => p.lat);
  const lngs = pts.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const rangeW = maxLng - minLng || 1;
  const rangeH = maxLat - minLat || 1;
  const toX = (lng: number) => ((lng - minLng) / rangeW) * w;
  const toY = (lat: number) => (1 - (lat - minLat) / rangeH) * h;
  return pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.lng).toFixed(1)},${toY(p.lat).toFixed(1)}`)
    .join(" ");
}

interface ShareCardInput {
  shapeId: string;
  title: string;
  polyline: LatLng[];
  totalDistanceMeters: number | null;
  fidelityScore: number | null;
}

export async function renderShareCard(input: ShareCardInput): Promise<Buffer> {
  const svgPath = polylineToSvgPath(input.polyline, 540, 560);
  const distanceKm = input.totalDistanceMeters
    ? (input.totalDistanceMeters / 1000).toFixed(2)
    : "—";
  const fidelityPct = input.fidelityScore != null
    ? `${Math.round(input.fidelityScore * 100)}%`
    : "—";

  const font = getFontBuffer();

  const node = {
      type: "div",
      props: {
        style: {
          display: "flex",
          width: "1200px",
          height: "630px",
          backgroundColor: "#0f0f0f",
          color: "#ffffff",
          fontFamily: "Inter",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
              },
              children: [
                {
                  type: "svg",
                  props: {
                    width: "540",
                    height: "560",
                    viewBox: "0 0 540 560",
                    children: [
                      {
                        type: "path",
                        props: {
                          d: svgPath,
                          stroke: "#00E5FF",
                          strokeWidth: "4",
                          fill: "none",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                width: "400px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "60px 40px",
                borderLeft: "1px solid #222",
              },
              children: [
                {
                  type: "p",
                  props: {
                    style: { fontSize: "14px", color: "#888", margin: "0 0 8px" },
                    children: "TraceIt GPS Art",
                  },
                },
                {
                  type: "h1",
                  props: {
                    style: { fontSize: "36px", margin: "0 0 32px", lineHeight: 1.2 },
                    children: input.title || input.shapeId,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { marginBottom: "16px" },
                    children: [
                      { type: "p", props: { style: { fontSize: "12px", color: "#888", margin: "0" }, children: "Distance" } },
                      { type: "p", props: { style: { fontSize: "24px", margin: "4px 0 0" }, children: `${distanceKm} km` } },
                    ],
                  },
                },
                {
                  type: "div",
                  props: {
                    children: [
                      { type: "p", props: { style: { fontSize: "12px", color: "#888", margin: "0" }, children: "Fidelity" } },
                      { type: "p", props: { style: { fontSize: "24px", margin: "4px 0 0", color: "#00E5FF" }, children: fidelityPct } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svg = await satori(node as any, {
      width: 1200,
      height: 630,
      fonts: font.length > 0
        ? [{ name: "Inter", data: font, weight: 400 as const, style: "normal" as const }]
        : [],
    });

  const resvg = new Resvg(svg);
  return Buffer.from(resvg.render().asPng());
}
