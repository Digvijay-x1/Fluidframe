"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  showTooltip?: boolean;
  formatValue?: (val: number) => string;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  showTooltip = false,
  formatValue,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  const [isHovered, setIsHovered] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex w-full touch-none items-center select-none group cursor-pointer data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col py-1",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-neutral-200/80 dark:bg-neutral-800/90 group-hover:bg-neutral-300/80 dark:group-hover:bg-neutral-700/80 transition-colors relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5 shadow-inner",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-gradient-to-r from-primary/90 to-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full rounded-full transition-all",
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => {
        const val = _values[index];
        return (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="relative block size-3.5 shrink-0 rounded-full border-2 border-primary bg-background shadow-md ring-offset-background transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-125 hover:shadow-primary/25 active:scale-110 active:ring-2 active:ring-primary/50"
          >
            {showTooltip && (isDragging || isHovered) && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 text-[10px] font-semibold font-manrope bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 rounded shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-75 z-50">
                {formatValue ? formatValue(val) : val}
              </span>
            )}
          </SliderPrimitive.Thumb>
        );
      })}
    </SliderPrimitive.Root>
  );
}

export { Slider };
