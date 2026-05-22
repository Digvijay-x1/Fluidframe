"use client";

import { forwardRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { ImageIcon } from "@phosphor-icons/react";
import { ImageLayer } from "./image-layer";
import { TextLayer } from "./text-layer";
import { CodeLayer } from "./code-layer";
import { WebGLCanvas } from "./webgl-canvas";
import { VectorOverlay } from "./vector-overlay";
import { StudioTexture } from "./studio-texture";
import { EditorCanvasProps } from "../../types";

export const Canvas = forwardRef<HTMLDivElement, EditorCanvasProps>(
  (
    {
      width,
      height,
      canvasBackground,
      meshConfig,
      overlayConfig,
      elements,
      onEmptyClick,
      selectedElementId,
      onElementMouseDown,
      onMouseMove,
      onMouseUp,
      isDragging,
      isCropping,
      snapGuides,
      showGrid,
      onCropChange,
    },
    ref
  ) => {
    const handleEmptyClick = useCallback(() => {
      onEmptyClick();
    }, [onEmptyClick]);

    const isMeshBackground =
      canvasBackground === "mesh" ||
      (!canvasBackground.startsWith("url(") &&
        !canvasBackground.startsWith("#") &&
        !canvasBackground.startsWith("rgb"));

    const getBackgroundStyle = (
      bg: string,
      aspectWidth: number,
      aspectHeight: number
    ) => {
      if (bg.startsWith("url(")) {
        const isTallCanvas = aspectHeight >= aspectWidth;
        return {
          backgroundImage: bg,
          backgroundSize: isTallCanvas ? "cover" : "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };
      }
      if (isMeshBackground) {
        return {
          background: "#09090b",
        };
      }
      return {
        background: bg,
      };
    };

    const visibleElements = elements.filter((el) => el.isVisible);

    return (
      <Card className="p-0 bg-transparent border-none shadow-none overflow-visible relative group/canvas touch-none">
        <div
          ref={ref}
          data-canvas="true"
          id="fluidframe-master-canvas"
          className="relative overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center select-none touch-none rounded-lg"
          style={{
            width: width,
            height: height,
            ...getBackgroundStyle(canvasBackground, width, height),
            transformStyle: "preserve-3d",
            perspective: "2500px",
            perspectiveOrigin: "center center",
            contain: "layout style paint",
          }}
          onPointerDown={(e) => {
            const target = e.target as HTMLElement | SVGElement | null;
            if (
              e.target === e.currentTarget ||
              target?.getAttribute?.("data-canvas") === "true" ||
              target?.tagName === "CANVAS" ||
              Boolean(target?.closest?.("svg, [data-canvas='true']"))
            ) {
              handleEmptyClick();
            }
          }}
          onPointerMove={onMouseMove as any}
          onPointerUp={onMouseUp as any}
          onPointerLeave={onMouseUp as any}
        >
          {/* WebGL Fluid Mesh Gradient Background Layer */}
          {isMeshBackground && (
            <WebGLCanvas
              width={width}
              height={height}
              meshColors={meshConfig.colors}
              speed={meshConfig.speed}
              noiseIntensity={meshConfig.noiseIntensity}
              noiseScale={meshConfig.noiseScale}
              noiseGrain={meshConfig.noiseGrain}
              isAnimating={meshConfig.isAnimating}
              ditherEnabled={meshConfig.ditherEnabled}
              ditherType={meshConfig.ditherType}
              ditherPixelSize={meshConfig.ditherPixelSize}
              ditherColorSteps={meshConfig.ditherColorSteps}
              ditherStrength={meshConfig.ditherStrength ?? 100}
            />
          )}

          {/* SVG Vector Pattern Overlay */}
          <VectorOverlay
            type={overlayConfig.pattern}
            opacity={overlayConfig.patternOpacity}
            color={overlayConfig.patternColor}
          />

          {/* Studio Tactile Texture Overlay */}
          <StudioTexture
            type={overlayConfig.texture}
            opacity={overlayConfig.textureOpacity}
          />

          {showGrid && (
            <div
              data-export-exclude="true"
              className="absolute inset-0 pointer-events-none z-30 animate-in fade-in duration-200"
            >
              <div
                className="absolute top-0 bottom-0 border-l border-solid border-primary/35"
                style={{ left: "33.333%" }}
              />
              <div
                className="absolute top-0 bottom-0 border-l border-dashed border-primary/35"
                style={{ left: "50%" }}
              />
              <div
                className="absolute top-0 bottom-0 border-l border-solid border-primary/35"
                style={{ left: "66.667%" }}
              />
              <div
                className="absolute left-0 right-0 border-t border-solid border-primary/35"
                style={{ top: "33.333%" }}
              />
              <div
                className="absolute left-0 right-0 border-t border-dashed border-primary/35"
                style={{ top: "50%" }}
              />
              <div
                className="absolute left-0 right-0 border-t border-solid border-primary/35"
                style={{ top: "66.667%" }}
              />
            </div>
          )}

          {/* Show placeholder if no elements AND background is not an image */}
          {elements.length === 0 && !canvasBackground.includes("url(") && (
            <div
              onClick={handleEmptyClick}
              className="group w-56 h-36 border-2 border-dashed border-white/70 hover:border-white rounded-xl flex flex-col items-center justify-center cursor-pointer bg-black/20 backdrop-blur-sm hover:backdrop-blur-md transition-all z-20"
            >
              <ImageIcon className="size-8 mb-2 text-white/80 group-hover:text-white transition-colors" weight="duotone" />
              <span className="text-sm text-white/90 font-medium font-inter group-hover:text-white">
                Click to Upload Layer
              </span>
            </div>
          )}

          {visibleElements.map((el, index) => {
            const isSelected = selectedElementId === el.id;
            const zIndex = index + 20;
            const wrapperStyle = {
              zIndex,
            };

            if (el.type === "image") {
              return (
                <div key={el.id} style={wrapperStyle} data-element-id={el.id}>
                  <ImageLayer
                    img={el}
                    isSelected={isSelected}
                    isDragging={isDragging && isSelected}
                    onPointerDown={
                      el.isLocked ? undefined : (onElementMouseDown as any)
                    }
                    isCropping={isCropping && isSelected}
                    onCropChange={onCropChange}
                    isLocked={el.isLocked}
                  />
                </div>
              );
            } else if (el.type === "text") {
              return (
                <div key={el.id} style={wrapperStyle} data-element-id={el.id}>
                  <TextLayer
                    element={el}
                    isSelected={isSelected}
                    isDragging={isDragging && isSelected}
                    onPointerDown={
                      el.isLocked ? undefined : (onElementMouseDown as any)
                    }
                    isLocked={el.isLocked}
                  />
                </div>
              );
            } else if (el.type === "code") {
              return (
                <div key={el.id} style={wrapperStyle} data-element-id={el.id}>
                  <CodeLayer
                    element={el}
                    isSelected={isSelected}
                    isDragging={isDragging && isSelected}
                    onPointerDown={
                      el.isLocked ? undefined : (onElementMouseDown as any)
                    }
                    isLocked={el.isLocked}
                  />
                </div>
              );
            }
            return null;
          })}

          {snapGuides?.x != null && (
            <div
              className="absolute top-0 bottom-0 pointer-events-none z-50 border-l border-dashed border-primary animate-in fade-in duration-100"
              style={{ left: `${snapGuides.x}px` }}
            />
          )}

          {snapGuides?.y != null && (
            <div
              className="absolute left-0 right-0 pointer-events-none z-50 border-t border-dashed border-primary animate-in fade-in duration-100"
              style={{ top: `${snapGuides.y}px` }}
            />
          )}
        </div>
      </Card>
    );
  }
);

Canvas.displayName = "Canvas";
