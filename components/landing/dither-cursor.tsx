"use client";

import React, { useEffect, useRef } from "react";

// 8x8 Bayer threshold matrix for smooth dithering
const BAYER_8X8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

interface TrailPoint {
  x: number;
  y: number;
  radius: number;
  life: number; // 1.0 down to 0.0
  decay: number;
}

export function DitherCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    // Responsive pixel scaling for retro dither grain (3px grain)
    const PIXEL_SCALE = 3;
    let cols = 0;
    let rows = 0;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.ceil(width / PIXEL_SCALE);
      canvas.height = Math.ceil(height / PIXEL_SCALE);
      cols = canvas.width;
      rows = canvas.height;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const trail: TrailPoint[] = [];
    let lastX: number | null = null;
    let lastY: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX / PIXEL_SCALE;
      const currentY = e.clientY / PIXEL_SCALE;

      if (lastX !== null && lastY !== null) {
        const dx = currentX - lastX;
        const dy = currentY - lastY;
        const dist = Math.hypot(dx, dy);

        // Calculate speed-based size
        const baseRadius = Math.min(26, 10 + dist * 0.4);
        // Interpolate points between movements so fast mouse flicks don't create gaps
        const steps = Math.max(1, Math.min(10, Math.floor(dist / 3)));

        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          trail.push({
            x: lastX + dx * t,
            y: lastY + dy * t,
            radius: baseRadius,
            life: 1.0,
            decay: 0.055 + Math.random() * 0.02, // Fades out in ~300-400ms
          });
        }
      } else {
        trail.push({
          x: currentX,
          y: currentY,
          radius: 12,
          life: 1.0,
          decay: 0.06,
        });
      }

      lastX = currentX;
      lastY = currentY;

      // Limit max active particles
      if (trail.length > 50) {
        trail.splice(0, trail.length - 50);
      }
    };

    const handleMouseLeave = () => {
      lastX = null;
      lastY = null;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // Main 60fps render loop
    const render = () => {
      ctx.clearRect(0, 0, cols, rows);

      if (trail.length > 0) {
        const isDark = document.documentElement.classList.contains("dark");
        ctx.fillStyle = isDark
          ? "rgba(255, 255, 255, 0.75)"
          : "rgba(0, 0, 0, 0.55)";

        // Update and draw each particle
        for (let i = trail.length - 1; i >= 0; i--) {
          const p = trail[i];
          p.life -= p.decay;

          if (p.life <= 0) {
            trail.splice(i, 1);
            continue;
          }

          const currentRadius = p.radius * p.life;
          const currentRadiusSq = currentRadius * currentRadius;
          const minX = Math.max(0, Math.floor(p.x - currentRadius));
          const maxX = Math.min(cols, Math.ceil(p.x + currentRadius));
          const minY = Math.max(0, Math.floor(p.y - currentRadius));
          const maxY = Math.min(rows, Math.ceil(p.y + currentRadius));

          for (let y = minY; y < maxY; y++) {
            const dy = y - p.y;
            const dy2 = dy * dy;
            const bayerRow = BAYER_8X8[y % 8];

            for (let x = minX; x < maxX; x++) {
              const dx = x - p.x;
              const distSq = dx * dx + dy2;

              if (distSq < currentRadiusSq) {
                const normDist = Math.sqrt(distSq) / currentRadius;
                // Soft comet intensity falloff
                const intensity = p.life * Math.pow(1 - normDist, 1.5);
                const threshold = bayerRow[x % 8] / 64;

                if (intensity > threshold) {
                  ctx.fillRect(x, y, 1, 1);
                }
              }
            }
          }
        }
      } else {
        // Reset last pos when completely dead so next move starts clean
        lastX = null;
        lastY = null;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-10 w-full h-full opacity-65 dark:opacity-80 transition-opacity duration-300"
      style={{
        imageRendering: "pixelated",
      }}
    />
  );
}
