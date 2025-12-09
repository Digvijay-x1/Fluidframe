"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface StudioSliderProps {
  label: React.ReactNode;
  icon?: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  unit?: string;
  formatDisplay?: (val: number) => string;
  formatValue?: (val: number) => string;
  disabled?: boolean;
  compact?: boolean;
  showTooltip?: boolean;
  className?: string;
  showReset?: boolean;
}

export function StudioSlider({
  label,
  icon,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  unit = "",
  formatDisplay,
  formatValue,
  disabled = false,
  compact = false,
  showTooltip = true,
  className,
}: StudioSliderProps) {
  const formatter = formatDisplay || formatValue;
  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(String(value));
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Sync input value when not editing
  React.useEffect(() => {
    if (!isEditing) {
      setInputValue(String(value));
    }
  }, [value, isEditing]);

  const commitValue = React.useCallback(
    (raw: string) => {
      const parsed = parseFloat(raw);
      if (!isNaN(parsed)) {
        const clamped = Math.min(max, Math.max(min, parsed));
        // Round to nearest step if applicable
        const precision = step < 1 ? String(step).split(".")[1]?.length || 1 : 0;
        const rounded = Number(
          (Math.round((clamped - min) / step) * step + min).toFixed(precision)
        );
        onChange(rounded);
      }
      setIsEditing(false);
    },
    [min, max, step, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitValue(inputValue);
    } else if (e.key === "Escape") {
      setInputValue(String(value));
      setIsEditing(false);
    }
  };

  // Horizontal Scrubbing logic on Label / Value Pill
  const startScrubbing = (e: React.MouseEvent) => {
    if (disabled || isEditing) return;
    if (e.button !== 0) return; // Only primary mouse button

    e.preventDefault();
    const startX = e.clientX;
    const startVal = value;
    const range = max - min;
    // Pixels per unit: full drag of ~300px traverses full range, or step-based
    const sensitivity = Math.max(0.1, range / 300);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      // Modifier keys: Shift for 5x speed, Alt for precision (0.2x)
      const multiplier = moveEvent.shiftKey ? 5 : moveEvent.altKey ? 0.2 : 1;
      const stepDelta = deltaX * sensitivity * multiplier;
      let nextVal = startVal + stepDelta;

      // Snap to step
      nextVal = Math.min(max, Math.max(min, nextVal));
      const precision = step < 1 ? String(step).split(".")[1]?.length || 1 : 0;
      const rounded = Number(
        (Math.round((nextVal - min) / step) * step + min).toFixed(precision)
      );
      onChange(rounded);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleReset = React.useCallback(() => {
    if (defaultValue !== undefined && !disabled) {
      onChange(defaultValue);
    }
  }, [defaultValue, disabled, onChange]);

  const displayString = formatter
    ? formatter(value)
    : `${value}${unit}`;

  return (
    <div
      className={cn(
        "group/slider select-none transition-colors",
        compact ? "space-y-1.5" : "space-y-2.5",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* Header Row: Label & Value Pill */}
      <div className="flex items-center justify-between gap-2">
        <div
          onMouseDown={startScrubbing}
          onDoubleClick={handleReset}
          title={
            defaultValue !== undefined
              ? `Drag to scrub • Double-click to reset to ${defaultValue}${unit}`
              : "Drag to scrub"
          }
          className="flex items-center gap-1.5 cursor-ew-resize hover:text-foreground text-muted-foreground transition-colors group/label"
        >
          {icon && (
            <span className="shrink-0 text-muted-foreground group-hover/label:text-foreground transition-colors">
              {icon}
            </span>
          )}
          <span className="text-xs font-medium tracking-tight truncate">
            {label}
          </span>
        </div>

        {/* Value Display / Inline Input */}
        <div className="flex items-center gap-1 shrink-0">
          {isEditing ? (
            <input
              ref={inputRef}
              type="number"
              min={min}
              max={max}
              step={step}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={() => commitValue(inputValue)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-14 h-5 px-1.5 text-right text-xs font-manrope font-semibold bg-background border border-primary/50 rounded focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              onMouseDown={startScrubbing}
              onDoubleClick={handleReset}
              title="Click to type exact number • Drag to scrub"
              className="px-1.5 py-0.5 min-w-8 text-right rounded text-[11px] font-semibold font-manrope text-muted-foreground hover:text-foreground hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-all border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700/60 cursor-ew-resize active:scale-95"
            >
              {displayString}
            </button>
          )}
        </div>
      </div>

      {/* Slider Bar */}
      <div onDoubleClick={handleReset}>
        <Slider
          value={[value]}
          onValueChange={([val]) => onChange(val)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          showTooltip={showTooltip}
          formatValue={(val) => (formatDisplay ? formatDisplay(val) : `${val}${unit}`)}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
