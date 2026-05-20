"use client";

import React, { useId } from "react";

export type VectorPatternType =
  | "none"
  | "topographic"
  | "isometric"
  | "dotmatrix"
  | "circuit"
  | "waves"
  | "honeycomb"
  | "blueprint"
  | "crosshair"
  | "japanese-wave"
  | "constellation"
  | "diagonal-stripes"
  | "moroccan"
  | "matrix-rain"
  | "plus-grid"
  | "radar"
  | "scales"
  | "triangles";

export interface VectorOverlayProps {
  type: VectorPatternType;
  opacity: number; // 0 to 100
  color?: string;
  blendMode?: "overlay" | "soft-light" | "screen" | "multiply" | "normal";
  idPrefix?: string;
}

export const PATTERN_LIST: { id: VectorPatternType; name: string }[] = [
  { id: "none", name: "None" },
  { id: "topographic", name: "Topographic" },
  { id: "isometric", name: "Isometric" },
  { id: "dotmatrix", name: "Dot Matrix" },
  { id: "circuit", name: "Cyber Circuit" },
  { id: "waves", name: "Sound Waves" },
  { id: "honeycomb", name: "Honeycomb" },
  { id: "blueprint", name: "Blueprint" },
  { id: "crosshair", name: "Crosshairs" },
  { id: "japanese-wave", name: "Seigaiha Wave" },
  { id: "constellation", name: "Constellation" },
  { id: "diagonal-stripes", name: "Tech Stripes" },
  { id: "moroccan", name: "Sacred Star" },
  { id: "matrix-rain", name: "Digital Rain" },
  { id: "plus-grid", name: "Plus Grid" },
  { id: "radar", name: "Radar Target" },
  { id: "scales", name: "Art Deco" },
  { id: "triangles", name: "Delta Mesh" },
];

export const VectorOverlay: React.FC<VectorOverlayProps> = ({
  type,
  opacity,
  color = "#ffffff",
  blendMode = "overlay",
  idPrefix,
}) => {
  const reactId = useId().replace(/:/g, "_");
  const prefix = idPrefix || `overlay_${reactId}`;

  if (type === "none" || opacity <= 0) return null;

  const alpha = opacity / 100;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
      style={{
        opacity: alpha,
        mixBlendMode: blendMode,
      }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {type === "topographic" && (
            <pattern
              id={`${prefix}-topographic`}
              width="300"
              height="300"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0,40 Q75,0 150,40 T300,40 M0,80 Q75,40 150,80 T300,80 M0,120 Q75,90 150,120 T300,120 M0,160 Q75,140 150,160 T300,160 M0,200 Q75,180 150,200 T300,200 M0,240 Q75,220 150,240 T300,240 M0,280 Q75,260 150,280 T300,280"
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeOpacity="0.75"
              />
              <path
                d="M40,0 Q0,80 40,150 T40,300 M90,0 Q60,80 90,150 T90,300 M170,0 Q140,80 170,150 T170,300 M240,0 Q210,80 240,150 T240,300"
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeDasharray="4 6"
                strokeOpacity="0.4"
              />
              <circle
                cx="150"
                cy="150"
                r="30"
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <circle
                cx="150"
                cy="150"
                r="60"
                fill="none"
                stroke={color}
                strokeWidth="1.2"
                strokeOpacity="0.5"
              />
              <circle
                cx="150"
                cy="150"
                r="100"
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.4"
              />
            </pattern>
          )}

          {type === "isometric" && (
            <pattern
              id={`${prefix}-isometric`}
              width="60"
              height="103.923"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30,0 L60,17.32 L60,51.96 L30,69.28 L0,51.96 L0,17.32 Z M30,103.92 L60,86.6 L60,51.96 L30,69.28 L0,51.96 L0,86.6 Z"
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.65"
              />
              <line
                x1="30"
                y1="0"
                x2="30"
                y2="69.28"
                stroke={color}
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
              <line
                x1="0"
                y1="51.96"
                x2="60"
                y2="51.96"
                stroke={color}
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
            </pattern>
          )}

          {type === "dotmatrix" && (
            <pattern
              id={`${prefix}-dotmatrix`}
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="1.5" fill={color} fillOpacity="0.85" />
            </pattern>
          )}

          {type === "circuit" && (
            <pattern
              id={`${prefix}-circuit`}
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 20 H30 L45 35 H80 M20 80 V50 L35 35 M55 0 V25 L45 35 M80 65 H50 L35 50"
                fill="none"
                stroke={color}
                strokeWidth="1.2"
                strokeOpacity="0.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="30"
                cy="20"
                r="2.5"
                fill="none"
                stroke={color}
                strokeWidth="1.2"
                strokeOpacity="0.9"
              />
              <circle cx="50" cy="65" r="2" fill={color} fillOpacity="0.8" />
              <circle cx="20" cy="50" r="2" fill={color} fillOpacity="0.8" />
              <circle
                cx="55"
                cy="25"
                r="2.5"
                fill="none"
                stroke={color}
                strokeWidth="1.2"
                strokeOpacity="0.9"
              />
              <circle cx="45" cy="35" r="2" fill={color} fillOpacity="0.9" />
            </pattern>
          )}

          {type === "waves" && (
            <pattern
              id={`${prefix}-waves`}
              width="80"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 20 Q 20 0, 40 20 T 80 20"
                fill="none"
                stroke={color}
                strokeWidth="1.2"
                strokeOpacity="0.8"
              />
              <path
                d="M0 30 Q 20 10, 40 30 T 80 30"
                fill="none"
                stroke={color}
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
              <path
                d="M0 10 Q 20 -10, 40 10 T 80 10"
                fill="none"
                stroke={color}
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
            </pattern>
          )}

          {type === "honeycomb" && (
            <pattern
              id={`${prefix}-honeycomb`}
              width="56"
              height="96.99"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M28 0 L56 16.165 V48.497 L28 64.662 L0 48.497 V16.165 Z M28 96.99 L56 80.825 V48.497 L28 64.662 L0 48.497 V80.825 Z"
                fill="none"
                stroke={color}
                strokeWidth="1.1"
                strokeOpacity="0.65"
              />
            </pattern>
          )}

          {type === "blueprint" && (
            <>
              <pattern
                id={`${prefix}-blueprint-small`}
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 16 0 L 0 0 0 16"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.6"
                  strokeOpacity="0.35"
                />
              </pattern>
              <pattern
                id={`${prefix}-blueprint`}
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  width="80"
                  height="80"
                  fill={`url(#${prefix}-blueprint-small)`}
                />
                <path
                  d="M 80 0 L 0 0 0 80"
                  fill="none"
                  stroke={color}
                  strokeWidth="1.2"
                  strokeOpacity="0.75"
                />
              </pattern>
            </>
          )}

          {type === "crosshair" && (
            <pattern
              id={`${prefix}-crosshair`}
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M24,14 L24,34 M14,24 L34,24"
                stroke={color}
                strokeWidth="1.2"
                strokeOpacity="0.8"
                strokeLinecap="round"
              />
              <circle cx="24" cy="24" r="1.5" fill={color} fillOpacity="0.9" />
              <circle
                cx="24"
                cy="24"
                r="9"
                fill="none"
                stroke={color}
                strokeWidth="0.75"
                strokeDasharray="3 3"
                strokeOpacity="0.45"
              />
            </pattern>
          )}

          {type === "japanese-wave" && (
            <pattern
              id={`${prefix}-japanese-wave`}
              width="60"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 30 A 30 30 0 0 1 60 30 M 5 30 A 25 25 0 0 1 55 30 M 10 30 A 20 20 0 0 1 50 30 M 15 30 A 15 15 0 0 1 45 30 M 20 30 A 10 10 0 0 1 40 30 M -30 15 A 30 30 0 0 1 30 15 M 30 15 A 30 30 0 0 1 90 15 M -25 15 A 25 25 0 0 1 25 15 M 35 15 A 25 25 0 0 1 85 15"
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.7"
              />
            </pattern>
          )}

          {type === "constellation" && (
            <pattern
              id={`${prefix}-constellation`}
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="15"
                y1="25"
                x2="50"
                y2="15"
                stroke={color}
                strokeWidth="0.8"
                strokeOpacity="0.5"
              />
              <line
                x1="50"
                y1="15"
                x2="85"
                y2="40"
                stroke={color}
                strokeWidth="0.8"
                strokeOpacity="0.5"
              />
              <line
                x1="85"
                y1="40"
                x2="70"
                y2="80"
                stroke={color}
                strokeWidth="0.8"
                strokeOpacity="0.5"
              />
              <line
                x1="70"
                y1="80"
                x2="30"
                y2="70"
                stroke={color}
                strokeWidth="0.8"
                strokeOpacity="0.5"
              />
              <line
                x1="30"
                y1="70"
                x2="15"
                y2="25"
                stroke={color}
                strokeWidth="0.8"
                strokeOpacity="0.5"
              />
              <line
                x1="50"
                y1="15"
                x2="30"
                y2="70"
                stroke={color}
                strokeWidth="0.6"
                strokeDasharray="3 3"
                strokeOpacity="0.35"
              />
              <circle cx="15" cy="25" r="2" fill={color} fillOpacity="0.9" />
              <circle cx="50" cy="15" r="2.5" fill={color} fillOpacity="1" />
              <circle cx="85" cy="40" r="2" fill={color} fillOpacity="0.8" />
              <circle cx="70" cy="80" r="2.5" fill={color} fillOpacity="0.9" />
              <circle cx="30" cy="70" r="2" fill={color} fillOpacity="0.8" />
              <circle cx="58" cy="50" r="1.5" fill={color} fillOpacity="0.6" />
            </pattern>
          )}

          {type === "diagonal-stripes" && (
            <pattern
              id={`${prefix}-diagonal-stripes`}
              width="24"
              height="24"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="24"
                stroke={color}
                strokeWidth="4"
                strokeOpacity="0.8"
              />
              <line
                x1="12"
                y1="0"
                x2="12"
                y2="24"
                stroke={color}
                strokeWidth="1.5"
                strokeOpacity="0.4"
              />
            </pattern>
          )}

          {type === "moroccan" && (
            <pattern
              id={`${prefix}-moroccan`}
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30 0 L40 20 L60 30 L40 40 L30 60 L20 40 L0 30 L20 20 Z"
                fill="none"
                stroke={color}
                strokeWidth="1.2"
                strokeOpacity="0.75"
              />
              <circle
                cx="30"
                cy="30"
                r="6"
                fill="none"
                stroke={color}
                strokeWidth="0.8"
                strokeOpacity="0.5"
              />
              <path
                d="M0 0 L12 12 M60 0 L48 12 M60 60 L48 48 M0 60 L12 48"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.4"
              />
            </pattern>
          )}

          {type === "matrix-rain" && (
            <pattern
              id={`${prefix}-matrix-rain`}
              width="40"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="10"
                y1="5"
                x2="10"
                y2="25"
                stroke={color}
                strokeWidth="1.5"
                strokeOpacity="0.8"
                strokeLinecap="round"
              />
              <line
                x1="10"
                y1="35"
                x2="10"
                y2="45"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.4"
                strokeLinecap="round"
              />
              <line
                x1="30"
                y1="15"
                x2="30"
                y2="40"
                stroke={color}
                strokeWidth="1.5"
                strokeOpacity="0.7"
                strokeLinecap="round"
              />
              <line
                x1="30"
                y1="50"
                x2="30"
                y2="70"
                stroke={color}
                strokeWidth="1.2"
                strokeOpacity="0.9"
                strokeLinecap="round"
              />
              <circle cx="10" cy="65" r="1.5" fill={color} fillOpacity="0.8" />
              <circle cx="30" cy="5" r="1.5" fill={color} fillOpacity="0.6" />
            </pattern>
          )}

          {type === "plus-grid" && (
            <pattern
              id={`${prefix}-plus-grid`}
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M16 10 V22 M10 16 H22"
                stroke={color}
                strokeWidth="1.5"
                strokeOpacity="0.75"
                strokeLinecap="square"
              />
            </pattern>
          )}

          {type === "radar" && (
            <pattern
              id={`${prefix}-radar`}
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="40"
                cy="40"
                r="12"
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.7"
              />
              <circle
                cx="40"
                cy="40"
                r="24"
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.5"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke={color}
                strokeWidth="0.8"
                strokeDasharray="3 3"
                strokeOpacity="0.4"
              />
              <line
                x1="40"
                y1="0"
                x2="40"
                y2="80"
                stroke={color}
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
              <line
                x1="0"
                y1="40"
                x2="80"
                y2="40"
                stroke={color}
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
            </pattern>
          )}

          {type === "scales" && (
            <pattern
              id={`${prefix}-scales`}
              width="40"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 20 A 20 20 0 0 1 40 20 M-20 10 A 20 20 0 0 1 20 10 M20 10 A 20 20 0 0 1 60 10"
                fill="none"
                stroke={color}
                strokeWidth="1.2"
                strokeOpacity="0.7"
              />
            </pattern>
          )}

          {type === "triangles" && (
            <pattern
              id={`${prefix}-triangles`}
              width="40"
              height="69.28"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 0 L 40 0 L 20 34.64 Z M 20 34.64 L 40 69.28 L 0 69.28 Z M 0 0 L 20 34.64 L 0 69.28 Z M 40 0 L 20 34.64 L 40 69.28 Z"
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.6"
              />
            </pattern>
          )}
        </defs>
        <rect width="100%" height="100%" fill={`url(#${prefix}-${type})`} />
      </svg>
    </div>
  );
};
