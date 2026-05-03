"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import {
  WebGLMeshRenderer,
  MeshShaderUniforms,
  buildMeshUniforms,
} from "../../utils/webgl-shader-engine";

export interface WebGLCanvasProps {
  width: number;
  height: number;
  meshColors: string[];
  speed: number;
  noiseIntensity: number;
  noiseScale: number;
  noiseGrain?: number;
  isAnimating?: boolean;
  ditherEnabled: boolean;
  ditherType: number;
  ditherPixelSize: number;
  ditherColorSteps: number;
  ditherStrength?: number;
  className?: string;
}

export interface WebGLCanvasHandle {
  getCanvas: () => HTMLCanvasElement | null;
  getRenderTime: () => number;
}

export const WebGLCanvas = forwardRef<WebGLCanvasHandle, WebGLCanvasProps>(
  (
    {
      width,
      height,
      meshColors,
      speed,
      noiseIntensity,
      noiseScale,
      noiseGrain = 0,
      isAnimating = true,
      ditherEnabled,
      ditherType,
      ditherPixelSize,
      ditherColorSteps,
      ditherStrength = 100,
      className,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<WebGLMeshRenderer | null>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      getRenderTime: () => rendererRef.current?.getLastRenderTime() ?? 0,
    }));

    const buildUniforms = (): MeshShaderUniforms => {
      return buildMeshUniforms({
        colors: meshColors,
        speed,
        noiseIntensity,
        noiseScale,
        noiseGrain,
        isAnimating,
        ditherEnabled,
        ditherType,
        ditherPixelSize,
        ditherColorSteps,
        ditherStrength,
      });
    };

    // Initialize renderer
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;

      const renderer = new WebGLMeshRenderer(canvas, buildUniforms());
      (canvas as any).__meshRenderer = renderer;
      renderer.start();
      rendererRef.current = renderer;

      return () => {
        (canvas as any).__meshRenderer = null;
        renderer.destroy();
        rendererRef.current = null;
      };
    }, [width, height]);

    // Update uniforms when props change
    useEffect(() => {
      if (!rendererRef.current) return;
      rendererRef.current.updateUniforms(buildUniforms());
    }, [
      meshColors,
      speed,
      noiseIntensity,
      noiseScale,
      noiseGrain,
      isAnimating,
      ditherEnabled,
      ditherType,
      ditherPixelSize,
      ditherColorSteps,
      ditherStrength,
    ]);

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={className ?? "absolute inset-0 w-full h-full pointer-events-none"}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          imageRendering: ditherEnabled ? "pixelated" : "auto",
        }}
      />
    );
  }
);

WebGLCanvas.displayName = "WebGLCanvas";
