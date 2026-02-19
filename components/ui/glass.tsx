import React from "react";
import { cn } from "@/lib/utils";

export interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: number; // px blur
  opacity?: number; // 0 to 100
  borderOpacity?: number; // 0 to 100
  intensity?: "subtle" | "medium" | "heavy";
  specular?: boolean;
}

export const Glass = React.forwardRef<HTMLDivElement, GlassProps>(
  (
    {
      className,
      blur = 16,
      opacity = 20,
      borderOpacity = 25,
      intensity = "medium",
      specular = true,
      children,
      style,
      ...props
    },
    ref
  ) => {
    let baseBg = `rgba(255, 255, 255, ${opacity / 100})`;
    if (intensity === "heavy") {
      baseBg = `rgba(255, 255, 255, ${Math.min(0.4, (opacity * 1.5) / 100)})`;
    } else if (intensity === "subtle") {
      baseBg = `rgba(255, 255, 255, ${Math.max(0.05, (opacity * 0.6) / 100)})`;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl transition-all duration-300",
          specular &&
            "before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none",
          className
        )}
        style={{
          backgroundColor: baseBg,
          backdropFilter: `blur(${blur}px) saturate(180%)`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
          border: `1px solid rgba(255, 255, 255, ${borderOpacity / 100})`,
          boxShadow: `
            0 8px 32px 0 rgba(0, 0, 0, 0.12),
            inset 0 1px 0 0 rgba(255, 255, 255, ${borderOpacity / 80})
          `,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Glass.displayName = "Glass";
