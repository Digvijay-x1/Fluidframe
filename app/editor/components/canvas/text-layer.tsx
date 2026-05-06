"use client";

import React, { memo } from "react";
import { TextElement } from "../../types";
import { WRITING_MODES } from "../../values";

export const TextLayer = memo(
  ({
    element,
    isSelected,
    isDragging,
    onPointerDown,
    isLocked,
  }: {
    element: TextElement;
    isSelected: boolean;
    isDragging: boolean;
    onPointerDown?: (e: React.PointerEvent, id: string) => void;
    isLocked: boolean;
  }) => {
    const effects = element.style.textEffect || [];
    const isOutline = effects.includes("outline");

    const getEffectStyles = (): React.CSSProperties => {
      const styles: React.CSSProperties = {};

      const decorations = [];
      if (effects.includes("underline")) decorations.push("underline");
      if (effects.includes("line-through")) decorations.push("line-through");

      if (decorations.length > 0) {
        styles.textDecoration = decorations.join(" ");
      }

      if (effects.includes("italic")) {
        styles.fontStyle = "italic";
      }

      if (effects.includes("uppercase")) {
        styles.textTransform = "uppercase";
      }

      if (effects.includes("small-caps")) {
        styles.fontVariant = "small-caps";
      }

      if (effects.includes("blur")) {
        styles.filter = "blur(2px)";
      }

      return styles;
    };

    // Text Color / Gradient Computation
    const colorType = element.style.colorType || "gradient";
    const colorDirection = element.style.colorDirection || "to bottom";
    const startColor = element.style.color || "#ffffff";
    const viaColor = element.style.colorVia || "#cbd5e1";
    const endColor = element.style.colorEnd || "#64748b";

    const textGradient = element.style.colorVia
      ? `linear-gradient(${colorDirection}, ${startColor}, ${viaColor}, ${endColor})`
      : `linear-gradient(${colorDirection}, ${startColor}, ${endColor})`;

    const textGradientStyle: React.CSSProperties = isOutline
      ? {
          color: "transparent",
          WebkitTextStroke: `1.5px ${startColor}`,
          backgroundImage: "none",
          WebkitBackgroundClip: "border-box",
          WebkitTextFillColor: "transparent",
        }
      : colorType === "solid"
      ? {
          color: startColor,
          backgroundImage: "none",
          WebkitBackgroundClip: "border-box",
          WebkitTextFillColor: startColor,
        }
      : {
          backgroundImage: textGradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        };

    // Text Background Computation
    const bgType = element.style.backgroundType || "gradient";
    const bgDirection = element.style.backgroundDirection || "to bottom";
    const bgStartColor = element.style.backgroundColor || "#18181b";
    const bgViaColor = element.style.backgroundColorVia || "#111113";
    const bgEndColor = element.style.backgroundColorEnd || "#09090b";

    const bgGradient = element.style.backgroundColorVia
      ? `linear-gradient(${bgDirection}, ${bgStartColor}, ${bgViaColor}, ${bgEndColor})`
      : `linear-gradient(${bgDirection}, ${bgStartColor}, ${bgEndColor})`;

    const backgroundStyle = element.style.showBackground
      ? bgType === "solid"
        ? bgStartColor
        : bgGradient
      : "transparent";

    const isBgEnabled = Boolean(element.style.showBackground);
    const isGlass = Boolean(element.style.glassmorphism);

    const hasBorder = (isBgEnabled || isGlass) && (element.style.borderWidth ?? 0) > 0;
    const borderGradient = element.style.colorVia
      ? `linear-gradient(${colorDirection}, ${startColor}, ${viaColor}, ${endColor})`
      : `linear-gradient(${colorDirection}, ${startColor}, ${endColor})`;

    const baseBackground = isGlass
      ? isBgEnabled
        ? backgroundStyle
        : "rgba(255, 255, 255, 0.15)"
      : isBgEnabled
      ? backgroundStyle
      : "transparent";

    const backgroundCss = hasBorder
      ? colorType === "solid"
        ? baseBackground
        : `${
            baseBackground.startsWith("linear-gradient")
              ? baseBackground
              : `linear-gradient(${baseBackground}, ${baseBackground})`
          } padding-box, ${borderGradient} border-box`
      : baseBackground;

    const borderCss = hasBorder
      ? colorType === "solid"
        ? `${element.style.borderWidth}px solid ${startColor}`
        : `${element.style.borderWidth}px solid transparent`
      : isGlass
      ? "1px solid rgba(255, 255, 255, 0.3)"
      : undefined;

    // Writing Mode Computation
    const selectedMode =
      WRITING_MODES.find((m) => m.id === element.style.writingMode) ||
      WRITING_MODES[0];
    const isUpright = element.style.writingMode === "vertical-upright";
    const writingModeStyle: React.CSSProperties = {
      writingMode: selectedMode.css as any,
      textOrientation: selectedMode.orientation as any,
    };

    return (
      <div
        className={`absolute select-none touch-none ${
          isLocked ? "cursor-default" : "cursor-move"
        } ${
          isSelected ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-white/40"
        }`}
        onPointerDown={(e) => {
          if (!isLocked && onPointerDown) {
            onPointerDown(e, element.id);
          }
        }}
        style={{
          pointerEvents: isLocked ? "none" : "auto",
          left: element.position.x,
          top: element.position.y,
          willChange:
            isSelected || isDragging ? "transform, left, top" : undefined,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          transform: `
            perspective(2000px)
            rotateX(${element.style.rotateX || 0}deg)
            rotateY(${element.style.rotateY || 0}deg)
            rotateZ(${element.style.rotate || 0}deg)
          `,
          ...writingModeStyle,
          textAlign: isUpright ? "center" : undefined,
          background: backgroundCss,
          backdropFilter: isGlass
            ? `blur(${element.style.glassBlur || 16}px) saturate(180%)`
            : undefined,
          WebkitBackdropFilter: isGlass
            ? `blur(${element.style.glassBlur || 16}px) saturate(180%)`
            : undefined,
          border: borderCss,
          boxShadow: isGlass
            ? "0 8px 32px 0 rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.35)"
            : isBgEnabled
            ? element.style.backgroundShadow
            : "none",
          borderRadius: isBgEnabled || isGlass ? `${element.style.borderRadius}px` : "0px",
          padding: isBgEnabled || isGlass ? `${element.style.padding}px` : "0px",
          lineHeight: isUpright ? 1.35 : 1.2,
          backfaceVisibility: "visible",
          filter: isSelected ? "brightness(1.03)" : "none",
        }}
      >
        <span
          className="block whitespace-pre-wrap select-none pointer-events-none"
          style={{
            fontSize: element.style.fontSize,
            fontFamily: element.style.fontFamily,
            fontWeight: element.style.fontWeight,
            letterSpacing: `${element.style.letterSpacing ?? 0}px`,
            textShadow: element.style.textShadow,
            textAlign: isUpright ? "center" : undefined,
            lineHeight: isUpright ? 1.35 : 1.2,
            ...writingModeStyle,
            ...textGradientStyle,
            ...getEffectStyles(),
          }}
        >
          {element.content}
        </span>
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.element.id === next.element.id &&
      prev.element.position.x === next.element.position.x &&
      prev.element.position.y === next.element.position.y &&
      JSON.stringify(prev.element.style) === JSON.stringify(next.element.style) &&
      prev.element.content === next.element.content &&
      prev.isSelected === next.isSelected &&
      prev.isDragging === next.isDragging &&
      prev.isLocked === next.isLocked
    );
  }
);
TextLayer.displayName = "TextLayer";
