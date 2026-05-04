"use client";

import React, { memo, useRef, useMemo, useEffect, useState } from "react";
import { PlusIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useStore } from "../../store/use-store";
import { ImageElement } from "../../types";
import { applyDitherToCanvas } from "../../utils/dither-engine";

type CropPosition =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const CropHandle = ({
  position,
  onPointerDown,
}: {
  position: CropPosition;
  onPointerDown: (e: React.PointerEvent) => void;
}) => {
  let cursorClass = "";
  let positionClass = "";
  let indicator = null;

  const baseClass =
    "absolute z-50 flex items-center justify-center pointer-events-auto touch-none";

  if (position === "top") {
    cursorClass = "cursor-ns-resize";
    positionClass = "top-0 left-0 right-0 h-4 -translate-y-1/2";
    indicator = (
      <div className="w-6 h-1 rounded-full bg-primary border border-white/80 shadow-xs pointer-events-none" />
    );
  } else if (position === "bottom") {
    cursorClass = "cursor-ns-resize";
    positionClass = "bottom-0 left-0 right-0 h-4 translate-y-1/2";
    indicator = (
      <div className="w-6 h-1 rounded-full bg-primary border border-white/80 shadow-xs pointer-events-none" />
    );
  } else if (position === "left") {
    cursorClass = "cursor-ew-resize";
    positionClass = "left-0 top-0 bottom-0 w-4 -translate-x-1/2";
    indicator = (
      <div className="w-1 h-6 rounded-full bg-primary border border-white/80 shadow-xs pointer-events-none" />
    );
  } else if (position === "right") {
    cursorClass = "cursor-ew-resize";
    positionClass = "right-0 top-0 bottom-0 w-4 translate-x-1/2";
    indicator = (
      <div className="w-1 h-6 rounded-full bg-primary border border-white/80 shadow-xs pointer-events-none" />
    );
  } else if (position === "top-left") {
    cursorClass = "cursor-nwse-resize";
    positionClass = "top-0 left-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2";
    indicator = (
      <div className="w-2.5 h-2.5 rounded-xs border-2 border-primary bg-background shadow-xs pointer-events-none" />
    );
  } else if (position === "top-right") {
    cursorClass = "cursor-nesw-resize";
    positionClass = "top-0 right-0 w-6 h-6 translate-x-1/2 -translate-y-1/2";
    indicator = (
      <div className="w-2.5 h-2.5 rounded-xs border-2 border-primary bg-background shadow-xs pointer-events-none" />
    );
  } else if (position === "bottom-left") {
    cursorClass = "cursor-nesw-resize";
    positionClass = "bottom-0 left-0 w-6 h-6 -translate-x-1/2 translate-y-1/2";
    indicator = (
      <div className="w-2.5 h-2.5 rounded-xs border-2 border-primary bg-background shadow-xs pointer-events-none" />
    );
  } else if (position === "bottom-right") {
    cursorClass = "cursor-nwse-resize";
    positionClass = "bottom-0 right-0 w-6 h-6 translate-x-1/2 translate-y-1/2";
    indicator = (
      <div className="w-2.5 h-2.5 rounded-xs border-2 border-primary bg-background shadow-xs pointer-events-none" />
    );
  }

  return (
    <div
      onPointerDown={(e) => {
        e.stopPropagation();
        onPointerDown(e);
      }}
      className={`${baseClass} ${positionClass} ${cursorClass}`}
    >
      {indicator}
    </div>
  );
};

function hexToRgbNormalized(hex: string): [number, number, number] {
  const num = parseInt(hex.replace("#", ""), 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

export const ImageLayer = memo(
  ({
    img,
    isSelected,
    isDragging,
    isCropping,
    onPointerDown,
    onCropChange,
    isLocked,
  }: {
    img: ImageElement;
    isSelected: boolean;
    isDragging: boolean;
    isCropping: boolean;
    onPointerDown?: (e: React.PointerEvent, id: string) => void;
    onCropChange: (
      id: string,
      newCrop: { top: number; right: number; bottom: number; left: number }
    ) => void;
    isLocked: boolean;
  }) => {
    const { updateElement } = useStore();
    const layerRef = useRef<HTMLDivElement>(null);
    const ghostRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const triggerFileInput = (e?: React.MouseEvent | React.PointerEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      fileInputRef.current?.click();
    };

    const handleFileUpload = (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        updateElement(img.id, {
          src: dataUrl,
          isPlaceholder: false,
          name: file.name.replace(/\.[^/.]+$/, ""),
        });
        toast.success(`Image added to ${img.placeholderLabel || img.name || "card"}`);
      };
      reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
      e.target.value = "";
    };

    useEffect(() => {
      if (!img.src || !img.dither?.enabled) {
        setProcessedImage(null);
        return;
      }

      const ditherConfig = {
        ditherType: img.dither.ditherType ?? 1,
        pixelSize: img.dither.pixelSize ?? 4,
        colorSteps: img.dither.colorSteps ?? 4,
        strength: img.dither.strength ?? 100,
        colorFront: img.dither.colorFront || "#ffffff",
        colorBack: img.dither.colorBack || "#000000",
      };

      let isMounted = true;

      const processImage = async () => {
        const originalImage = new Image();
        originalImage.crossOrigin = "anonymous";
        originalImage.src = img.src;

        originalImage.onload = () => {
          if (!isMounted) return;
          try {
            const scaleFactor = Math.max(0.05, (img.style?.scale || 100) / 100);
            const effectivePxSize = Math.max(
              1,
              Math.round((ditherConfig.pixelSize || 4) / scaleFactor)
            );

            const processedCanvas = applyDitherToCanvas(originalImage, {
              ditherType: ditherConfig.ditherType,
              pixelSize: effectivePxSize,
              colorSteps: ditherConfig.colorSteps,
              strength: ditherConfig.strength,
              colorFront: hexToRgbNormalized(ditherConfig.colorFront),
              colorBack: hexToRgbNormalized(ditherConfig.colorBack),
            });
            if (isMounted) {
              setProcessedImage(processedCanvas.toDataURL("image/png"));
            }
          } catch (error) {
            console.error("Dither processing failed:", error);
            if (isMounted) setProcessedImage(null);
          }
        };

        originalImage.onerror = () => {
          if (!isMounted) return;
          console.error("Failed to load image for dithering");
          setProcessedImage(null);
        };
      };

      processImage();

      return () => {
        isMounted = false;
      };
    }, [
      img.src,
      img.dither?.enabled,
      img.dither?.ditherType,
      img.dither?.pixelSize,
      img.dither?.colorSteps,
      img.dither?.strength,
      img.dither?.colorFront,
      img.dither?.colorBack,
      img.style?.scale,
    ]);

    const handleCropStart = (e: React.PointerEvent, side: CropPosition) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as Element).setPointerCapture(e.pointerId);

      const startX = e.clientX;
      const startY = e.clientY;
      const startCrop = { ...img.style.crop };

      const rect = ghostRef.current?.getBoundingClientRect();
      if (!rect) return;

      const handleMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        const deltaPctX = (deltaX / rect.width) * 100;
        const deltaPctY = (deltaY / rect.height) * 100;

        const newCrop = { ...startCrop };

        if (side.includes("left")) {
          newCrop.left = Math.min(
            Math.max(0, startCrop.left + deltaPctX),
            100 - newCrop.right - 5
          );
        }
        if (side.includes("right")) {
          newCrop.right = Math.min(
            Math.max(0, startCrop.right - deltaPctX),
            100 - newCrop.left - 5
          );
        }
        if (side.includes("top")) {
          newCrop.top = Math.min(
            Math.max(0, startCrop.top + deltaPctY),
            100 - newCrop.bottom - 5
          );
        }
        if (side.includes("bottom")) {
          newCrop.bottom = Math.min(
            Math.max(0, startCrop.bottom - deltaPctY),
            100 - newCrop.top - 5
          );
        }

        onCropChange(img.id, newCrop);
      };

      const handleUp = (upEvent: PointerEvent) => {
        (upEvent.target as Element).releasePointerCapture(upEvent.pointerId);
        document.removeEventListener("pointermove", handleMove);
        document.removeEventListener("pointerup", handleUp);
      };

      document.addEventListener("pointermove", handleMove);
      document.addEventListener("pointerup", handleUp);
    };

    const isPlaceholder = img.isPlaceholder || !img.src;
    const cardWidth = img.width || 300;
    const cardHeight = img.height || 420;

    const has3DRotation = img.style.rotateX !== 0 || img.style.rotateY !== 0;
    const hasShapeClip = img.style.clipPath && img.style.clipPath !== "none";
    const clipStyle = hasShapeClip ? img.style.clipPath : undefined;
    const { top, right, bottom, left } = img.style.crop;
    const widthFactor = 100 / Math.max(1, 100 - left - right);
    const heightFactor = 100 / Math.max(1, 100 - top - bottom);

    return (
      <div
        ref={layerRef}
        className={`absolute transition-transform ${isDragging ? "duration-0" : "duration-100"
          } ease-out touch-none`}
        style={{
          left: img.position.x,
          top: img.position.y,
          width: img.width ? `${img.width}px` : undefined,
          height: img.height ? `${img.height}px` : undefined,
          willChange: isSelected || isDragging ? "transform" : undefined,
          transformStyle: "preserve-3d",
          transform: `
            perspective(${has3DRotation ? 2000 : 1500}px) 
            rotateX(${img.style.rotateX}deg) 
            rotateY(${img.style.rotateY}deg) 
            rotateZ(${img.style.rotate}deg) 
            scale3d(${img.style.scale / 100}, ${img.style.scale / 100}, 1)
            scaleX(${img.style.flipX ? -1 : 1})
            scaleY(${img.style.flipY ? -1 : 1})
            translateZ(${isSelected ? 20 : 0}px)
          `,
          pointerEvents: "none",
        }}
      >
        {/* Unified hidden file input triggered directly via ref */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />

        {isPlaceholder ? (
          /* Subtle Framed Image Placeholder with '+' sign */
          <div
            className={`w-full h-full relative pointer-events-auto touch-none group flex flex-col items-center justify-center transition-all ${isLocked ? "cursor-default" : "cursor-pointer"
              } ${isSelected
                ? "ring-2 ring-primary ring-offset-2 ring-offset-transparent shadow-2xl"
                : "hover:border-primary/80"
              }`}
            onPointerDown={(e) => {
              if (isLocked) return;
              pointerStartRef.current = { x: e.clientX, y: e.clientY };
              onPointerDown?.(e, img.id);
            }}
            onPointerUp={(e) => {
              if (pointerStartRef.current) {
                const dx = Math.abs(e.clientX - pointerStartRef.current.x);
                const dy = Math.abs(e.clientY - pointerStartRef.current.y);
                pointerStartRef.current = null;
                // If it was a simple click (not a drag gesture), open file picker immediately
                if (dx < 6 && dy < 6) {
                  triggerFileInput(e);
                }
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFileUpload(file);
            }}
            style={{
              width: `${cardWidth}px`,
              height: `${cardHeight}px`,
              borderRadius: `${img.style.borderRadius || 16}px`,
              boxShadow:
                img.style.shadow === "none"
                  ? "0 25px 50px -12px rgba(0,0,0,0.5)"
                  : img.style.shadow,
              background: isDragOver
                ? "rgba(99, 102, 241, 0.18)"
                : img.style.glassmorphism
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(255, 255, 255, 0.04)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: isDragOver
                ? "2px dashed #6366f1"
                : "1.5px dashed rgba(255, 255, 255, 0.35)",
              opacity: img.style.opacity / 100,
              backfaceVisibility: has3DRotation ? "visible" : "hidden",
            }}
          >
            {/* Centered plus sign and upload button */}
            <div className="flex flex-col items-center justify-center p-6 text-center select-none pointer-events-auto transition-transform group-hover:scale-105 duration-200">
              <button
                type="button"
                onClick={(e) => triggerFileInput(e)}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                className="size-16 rounded-full bg-white/10 group-hover:bg-primary border-2 border-white/30 hover:border-primary flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer hover:scale-110 active:scale-95 text-primary group-hover:text-white mb-3"
                title="Click to upload image"
              >
                <PlusIcon size={32} weight="bold" />
              </button>

              <button
                type="button"
                onClick={(e) => triggerFileInput(e)}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                className="cursor-pointer text-center group"
              >
                <p className="text-xs font-semibold text-white/90 group-hover:text-white tracking-wide font-manrope transition-colors">
                  {img.placeholderLabel || img.name || "Add Image"}
                </p>
                <p className="text-[10px] text-white/70 group-hover:text-white/90 mt-1 font-inter">
                  Click to upload image
                </p>
              </button>
            </div>
          </div>
        ) : (
          /* Actual Image Frame */
          <>
            {!img.width && (
              <img
                ref={ghostRef}
                src={img.src}
                alt=""
                className="opacity-0 pointer-events-none block"
                style={{ maxWidth: "none" }}
                draggable={false}
              />
            )}

            <div
              className={`pointer-events-auto touch-none group relative
                ${isLocked ? "cursor-default" : "cursor-move"
                } ${isSelected ? "ring-2 ring-primary" : ""
                }
              `}
              onPointerDown={(e) => !isLocked && onPointerDown?.(e, img.id)}
              style={{
                pointerEvents: isLocked ? "none" : "auto",
                width: img.width ? `${img.width}px` : undefined,
                height: img.height ? `${img.height}px` : undefined,
                position: img.width ? "relative" : "absolute",
                inset: img.width ? undefined : `${top}% ${right}% ${bottom}% ${left}%`,
                borderRadius: `${img.style.borderRadius}px`,
                boxShadow: img.style.glassmorphism
                  ? "0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
                  : img.style.shadow === "none"
                    ? "none"
                    : img.style.shadow,
                border: img.style.glassmorphism
                  ? "1px solid rgba(255, 255, 255, 0.35)"
                  : undefined,
                backdropFilter: img.style.glassmorphism
                  ? `blur(${img.style.glassBlur || 16}px) saturate(180%)`
                  : undefined,
                WebkitBackdropFilter: img.style.glassmorphism
                  ? `blur(${img.style.glassBlur || 16}px) saturate(180%)`
                  : undefined,
                opacity: img.style.opacity / 100,
                filter: `blur(${img.style.blur || 0}px) brightness(${(img.style.brightness ?? 100) / 100
                  }) contrast(${(img.style.contrast ?? 100) / 100}) saturate(${(img.style.saturate ?? 100) / 100
                  })`,
                backfaceVisibility: has3DRotation ? "visible" : "hidden",
              }}
            >
              <div
                className="absolute inset-0 overflow-hidden rounded-[inherit]"
                style={{ clipPath: clipStyle }}
              >
                <img
                  src={processedImage || img.src}
                  alt={img.name || "Layer"}
                  draggable={false}
                  className={`block pointer-events-none ${img.width
                    ? "w-full h-full object-cover absolute inset-0"
                    : "object-contain absolute max-w-none max-h-none"
                    }`}
                  style={{
                    width: img.width ? "100%" : `${widthFactor * 100}%`,
                    height: img.height ? "100%" : `${heightFactor * 100}%`,
                    left: img.width ? 0 : `${-left * widthFactor}%`,
                    top: img.width ? 0 : `${-top * heightFactor}%`,
                    imageRendering: img.dither?.enabled ? "pixelated" : "auto",
                  }}
                />
              </div>

              {/* Replace Image Floating Action */}
              <button
                type="button"
                onClick={(e) => triggerFileInput(e)}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                className="absolute top-2.5 right-2.5 z-30 px-2 py-1 rounded-md bg-black/75 hover:bg-primary/95 text-white text-[10px] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg border border-white/20"
                title="Replace image in this slot"
              >
                <UploadSimpleIcon size={12} weight="bold" />
                <span>Replace</span>
              </button>

              {isSelected && !isLocked && !img.width && (
                <>
                  <div className="absolute inset-0 border border-dashed border-primary/80 pointer-events-none rounded-[inherit]" />
                  <CropHandle
                    position="top"
                    onPointerDown={(e) => handleCropStart(e, "top")}
                  />
                  <CropHandle
                    position="bottom"
                    onPointerDown={(e) => handleCropStart(e, "bottom")}
                  />
                  <CropHandle
                    position="left"
                    onPointerDown={(e) => handleCropStart(e, "left")}
                  />
                  <CropHandle
                    position="right"
                    onPointerDown={(e) => handleCropStart(e, "right")}
                  />
                  <CropHandle
                    position="top-left"
                    onPointerDown={(e) => handleCropStart(e, "top-left")}
                  />
                  <CropHandle
                    position="top-right"
                    onPointerDown={(e) => handleCropStart(e, "top-right")}
                  />
                  <CropHandle
                    position="bottom-left"
                    onPointerDown={(e) => handleCropStart(e, "bottom-left")}
                  />
                  <CropHandle
                    position="bottom-right"
                    onPointerDown={(e) => handleCropStart(e, "bottom-right")}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.img.id === next.img.id &&
      prev.img.src === next.img.src &&
      prev.img.isPlaceholder === next.img.isPlaceholder &&
      prev.img.width === next.img.width &&
      prev.img.height === next.img.height &&
      prev.img.placeholderLabel === next.img.placeholderLabel &&
      prev.img.position.x === next.img.position.x &&
      prev.img.position.y === next.img.position.y &&
      prev.img.style === next.img.style &&
      JSON.stringify(prev.img.dither) === JSON.stringify(next.img.dither) &&
      prev.isSelected === next.isSelected &&
      prev.isDragging === next.isDragging &&
      prev.isLocked === next.isLocked
    );
  }
);
ImageLayer.displayName = "ImageLayer";
