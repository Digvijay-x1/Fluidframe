"use client";

import React, { useId, useState, useEffect } from "react";

export type StudioTextureType =
  | "none"
  | "grain"
  | "paper"
  | "scratches"
  | "canvas"
  | "dust"
  | "halftone";

export interface StudioTextureProps {
  type: StudioTextureType;
  opacity: number; // 0 to 100
  blendMode?: "overlay" | "soft-light" | "screen" | "multiply" | "normal";
  idPrefix?: string;
}

export const TEXTURE_LIST: { id: StudioTextureType; name: string }[] = [
  { id: "none", name: "None" },
  { id: "grain", name: "Film Grain" },
  { id: "paper", name: "Crushed Paper" },
  { id: "scratches", name: "Studio Scratches" },
  { id: "canvas", name: "Woven Canvas" },
  { id: "halftone", name: "Print Halftone" },
];

// Generate procedural noise data URL once
function generateFilmGrainDataUrl(): string {
  if (typeof window === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const imgData = ctx.createImageData(256, 256);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const val = Math.floor(Math.random() * 255);
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = 45; // subtle alpha
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/png");
}

export const StudioTexture: React.FC<StudioTextureProps> = ({
  type,
  opacity,
  blendMode = "overlay",
  idPrefix,
}) => {
  const reactId = useId().replace(/:/g, "_");
  const prefix = idPrefix || `tex_${reactId}`;
  const [grainDataUrl, setGrainDataUrl] = useState<string>("");

  useEffect(() => {
    if (type === "grain") {
      setGrainDataUrl(generateFilmGrainDataUrl());
    }
  }, [type]);

  if (type === "none" || opacity <= 0) return null;

  const alpha = opacity / 100;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-15 select-none"
      style={{
        opacity: alpha,
        mixBlendMode: blendMode,
      }}
    >
      {type === "grain" && (
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("${grainDataUrl}")`,
            backgroundRepeat: "repeat",
            backgroundSize: "180px 180px",
          }}
        />
      )}

      {type === "paper" && (
        <svg
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id={`${prefix}-paper-filter`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="5"
              result="noise"
            />
            <feDiffuseLighting
              in="noise"
              lightingColor="#fff"
              surfaceScale="2"
              result="light"
            >
              <feDistantLight azimuth="45" elevation="60" />
            </feDiffuseLighting>
            <feBlend mode="multiply" in="SourceGraphic" in2="light" />
          </filter>
          <rect
            width="100%"
            height="100%"
            fill="#eae6df"
            filter={`url(#${prefix}-paper-filter)`}
          />
        </svg>
      )}

      {type === "scratches" && (
        <div
          className="w-full h-full opacity-60"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.06) 15px, rgba(255,255,255,0.06) 16px),
              repeating-linear-gradient(-35deg, transparent, transparent 28px, rgba(0,0,0,0.08) 28px, rgba(0,0,0,0.08) 29px)
            `,
          }}
        />
      )}

      {type === "canvas" && (
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 4px),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 4px)
            `,
            backgroundSize: "4px 4px",
          }}
        />
      )}

      {type === "dust" && (
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id={`${prefix}-dust-filter`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 8 -4"
            />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter={`url(#${prefix}-dust-filter)`}
            opacity="0.5"
          />
        </svg>
      )}

      {type === "halftone" && (
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id={`${prefix}-halftone-pat`}
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="5" cy="5" r="2.2" fill="#ffffff" opacity="0.6" />
              <circle cx="0" cy="0" r="1" fill="#ffffff" opacity="0.4" />
              <circle cx="10" cy="0" r="1" fill="#ffffff" opacity="0.4" />
              <circle cx="0" cy="10" r="1" fill="#ffffff" opacity="0.4" />
              <circle cx="10" cy="10" r="1" fill="#ffffff" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${prefix}-halftone-pat)`} />
        </svg>
      )}
    </div>
  );
};
