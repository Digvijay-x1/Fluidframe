"use client";

import { useStore } from "../../store/use-store";
import {
  EyeIcon,
  EyeSlashIcon,
  LockSimpleIcon,
  LockSimpleOpenIcon,
  TrashIcon,
  ImageIcon,
  CodeIcon,
  DotsSixVerticalIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform } from "motion/react";
import { CanvasElement, ImageElement, TextElement, CodeElement } from "../../types";
import { CODE_THEMES } from "../../values";
import React, { useEffect, useState, useRef, useCallback, memo } from "react";

interface ReorderContextProps {
  registerItem: (value: CanvasElement, measured: any) => void;
  unregisterItem: (id: string) => void;
  updateOrder: (value: CanvasElement, offset: number, velocity: number) => void;
  groupRef: React.RefObject<HTMLUListElement | null>;
}

const ReorderContext = React.createContext<ReorderContextProps | null>(null);

function SmoothReorderGroup({
  children,
  values,
  onReorder,
  className,
  onClick,
}: {
  children: React.ReactNode;
  values: CanvasElement[];
  onReorder: (newOrder: CanvasElement[]) => void;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const orderRef = useRef<Array<{ value: CanvasElement; layout: { min: number; max: number } }>>([]);
  const isReordering = useRef(false);
  const groupRef = useRef<HTMLUListElement | null>(null);

  // Keep orderRef synchronized with incoming values while preserving measured layouts
  useEffect(() => {
    const layoutMap = new Map(orderRef.current.map((item) => [item.value.id, item.layout]));
    orderRef.current = values.map((val) => ({
      value: val,
      layout: layoutMap.get(val.id) || { min: 0, max: 0 },
    }));
  }, [values]);

  const registerItem = useCallback((value: CanvasElement, measured: any) => {
    const layout = measured?.y;
    if (!layout) return;
    const entry = orderRef.current.find((item) => item.value.id === value.id);
    if (entry) {
      entry.layout = layout;
      entry.value = value;
    } else {
      orderRef.current.push({ value, layout });
    }
  }, []);

  const unregisterItem = useCallback((id: string) => {
    orderRef.current = orderRef.current.filter((entry) => entry.value.id !== id);
  }, []);

  const updateOrder = useCallback(
    (item: CanvasElement, offset: number, velocity: number) => {
      if (isReordering.current) return;
      if (Math.abs(velocity) < 0.2) return;

      const order = orderRef.current;
      const index = order.findIndex((entry) => entry.value.id === item.id);
      if (index === -1) return;

      const nextOffset = velocity > 0 ? 1 : -1;
      const nextEntry = order[index + nextOffset];
      if (!nextEntry) return;

      const currentEntry = order[index];
      if (!currentEntry.layout || !nextEntry.layout) return;

      const currentCenter = (currentEntry.layout.min + currentEntry.layout.max) / 2 + offset;
      const nextCenter = (nextEntry.layout.min + nextEntry.layout.max) / 2;

      // 8px hysteresis deadband completely eliminates midpoint jitter & rapid swap thrashing
      const buffer = 8;
      const shouldSwap =
        nextOffset === 1
          ? currentCenter > nextCenter + buffer
          : currentCenter < nextCenter - buffer;

      if (shouldSwap) {
        isReordering.current = true;

        // Immediately swap their layout coordinates so consecutive swaps in a single fluid gesture use the new target positions
        const tempLayout = { ...currentEntry.layout };
        currentEntry.layout = { ...nextEntry.layout };
        nextEntry.layout = tempLayout;

        const newOrderItems = [...order];
        newOrderItems[index] = nextEntry;
        newOrderItems[index + nextOffset] = currentEntry;
        orderRef.current = newOrderItems;

        const newValues = newOrderItems.map((entry) => entry.value);
        onReorder(newValues);

        // Unlock on next animation frame for instantaneous chained reorders
        requestAnimationFrame(() => {
          isReordering.current = false;
        });
      }
    },
    [onReorder]
  );

  useEffect(() => {
    isReordering.current = false;
  });

  return (
    <ReorderContext.Provider value={{ registerItem, unregisterItem, updateOrder, groupRef }}>
      <motion.ul
        ref={groupRef}
        className={className}
        onClick={onClick}
        style={{ overflowAnchor: "none" }}
      >
        {children}
      </motion.ul>
    </ReorderContext.Provider>
  );
}

function SmoothReorderItem({
  children,
  value,
  className,
  onClick,
  onDragStart,
  onDragEnd,
  whileDrag,
}: {
  children: React.ReactNode;
  value: CanvasElement;
  className?: string;
  onClick?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  whileDrag?: any;
}) {
  const context = React.useContext(ReorderContext);
  const y = useMotionValue(0);
  const zIndex = useTransform(y, (latestY) => (latestY !== 0 ? 50 : "unset"));

  useEffect(() => {
    return () => {
      context?.unregisterItem(value.id);
    };
  }, [value.id, context]);

  return (
    <motion.li
      layout="position"
      transition={{
        layout: {
          type: "spring",
          stiffness: 450,
          damping: 32,
          mass: 0.8,
        },
      }}
      drag="y"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.06}
      dragSnapToOrigin
      style={{ y, zIndex }}
      whileDrag={whileDrag}
      className={className}
      onClick={onClick}
      onDragStart={onDragStart}
      onDrag={(_event, info) => {
        if (!context) return;
        const offset = y.get();
        context.updateOrder(value, offset, info.velocity.y);

        // Controlled auto-scroll: only scrolls if list actually overflows the container
        const group = context.groupRef.current;
        const scrollContainer = group?.closest("[data-slot=scroll-area-viewport]") as HTMLElement | null;
        if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight + 20) {
          const rect = scrollContainer.getBoundingClientRect();
          const distTop = info.point.y - rect.top;
          const distBottom = rect.bottom - info.point.y;
          if (distTop < 40 && distTop > 0) {
            scrollContainer.scrollBy({ top: -8 });
          } else if (distBottom < 40 && distBottom > 0) {
            scrollContainer.scrollBy({ top: 8 });
          }
        }
      }}
      onDragEnd={(_event, _info) => {
        onDragEnd?.();
      }}
      onLayoutMeasure={(measured) => {
        context?.registerItem(value, measured);
      }}
    >
      {children}
    </motion.li>
  );
}

export function LayerPanel() {
  const { elements, setElements, selectElement } = useStore();

  const [displayElements, setDisplayElements] = useState<CanvasElement[]>([]);

  const isDraggingRef = useRef(false);
  const latestDisplayElements = useRef<CanvasElement[]>([]);

  useEffect(() => {
    if (!isDraggingRef.current) {
      const reversed = [...elements].reverse();
      setDisplayElements(reversed);
      latestDisplayElements.current = reversed;
    }
  }, [elements]);

  const handleReorder = useCallback((newOrder: CanvasElement[]) => {
    latestDisplayElements.current = newOrder;
    setDisplayElements(newOrder);
  }, []);

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    const finalElements = [...latestDisplayElements.current].reverse();
    setElements(finalElements);
  }, [setElements]);

  return (
    <div className="flex flex-col h-full w-full min-w-0 max-w-full overflow-hidden">
      <div className="p-4 pb-3 border-b dark:border-neutral-800 flex items-center justify-between shrink-0">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Layers
        </h3>
        <span className="text-[10px] font-semibold font-manrope text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/50">
          {elements.length} {elements.length === 1 ? "layer" : "layers"}
        </span>
      </div>

      <ScrollArea className="flex-1 w-full min-w-0 overflow-x-hidden [&_[data-slot=scroll-area-viewport]>div]:!min-h-full [&_[data-slot=scroll-area-viewport]>div]:!flex [&_[data-slot=scroll-area-viewport]>div]:!flex-col">
        <div className="p-2 flex-1 flex flex-col gap-2 w-full min-w-0 max-w-full min-h-full box-border">
          {displayElements.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 text-muted-foreground text-xs space-y-1">
              <p className="font-medium">No layers added yet</p>
              <p className="text-[11px] opacity-70">
                Add images or text layers from the sidebar to organize them here.
              </p>
            </div>
          ) : (
            <SmoothReorderGroup
              values={displayElements}
              onReorder={handleReorder}
              className="flex flex-col gap-2 w-full min-w-0 max-w-full flex-1 min-h-full"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  selectElement(null);
                }
              }}
            >
              {displayElements.map((element) => (
                <SortableLayer
                  key={element.id}
                  element={element}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </SmoothReorderGroup>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

const SortableLayer = memo(function SortableLayer({
  element,
  onDragStart,
  onDragEnd,
}: {
  element: CanvasElement;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const {
    selectedElementId,
    selectElement,
    toggleVisibility,
    toggleLock,
    removeElement,
  } = useStore();

  const isSelected = selectedElementId === element.id;

  // Metadata Extraction
  const isText = element.type === "text";
  const isCode = element.type === "code";
  const textEl = isText ? (element as TextElement) : null;
  const codeEl = isCode ? (element as CodeElement) : null;
  const imgEl = !isText && !isCode ? (element as ImageElement) : null;

  const codeTheme = isCode
    ? CODE_THEMES.find((t) => t.id === codeEl?.style?.theme) || CODE_THEMES[0]
    : null;

  const has3D = isText
    ? Boolean(textEl?.style.rotate || textEl?.style.rotateX || textEl?.style.rotateY)
    : isCode
    ? Boolean(codeEl?.style.rotate || codeEl?.style.rotateX || codeEl?.style.rotateY)
    : Boolean(imgEl?.style.rotate || imgEl?.style.rotateX || imgEl?.style.rotateY);

  const rawText = textEl?.content?.trim() || "Text Layer";
  const rawCode = codeEl?.style?.windowTitle || codeEl?.name || "Code Snippet";
  const rawImageName = imgEl?.placeholderLabel || imgEl?.name || "Image Layer";

  const title = isText
    ? rawText.length > 14
      ? `${rawText.slice(0, 14)}...`
      : rawText
    : isCode
    ? rawCode.length > 14
      ? `${rawCode.slice(0, 14)}...`
      : rawCode
    : rawImageName.length > 14
      ? `${rawImageName.slice(0, 14)}...`
      : rawImageName;

  const subtitle = isText
    ? `${textEl?.style.fontFamily || "Inter"} • ${textEl?.style.fontSize}px`
    : isCode
    ? `${codeEl?.language === "python" ? "Python" : "TypeScript"} • ${codeEl?.style?.fontSize || 14}px`
    : `Scale ${imgEl?.style.scale}% • ${imgEl?.style.opacity}%`;

  return (
    <SmoothReorderItem
      value={element}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileDrag={{
        scale: 1.02,
        zIndex: 50,
        boxShadow: "0 14px 32px -4px rgba(0,0,0,0.38)",
      }}
      className={cn(
        "group flex flex-col p-2 rounded-lg border relative bg-card select-none touch-none w-full min-w-0 max-w-full box-border cursor-grab active:cursor-grabbing",
        isSelected
          ? "border-primary dark:border-primary/60 bg-primary/5 shadow-xs ring-1 ring-primary/20"
          : "border-neutral-300 dark:border-neutral-700/80 hover:bg-muted/40 hover:border-neutral-400 dark:hover:border-neutral-600 shadow-2xs",
        !element.isVisible && "opacity-50",
      )}
      onClick={() => selectElement(element.id)}
    >
      {/* Top Row: Thumbnail, Name/Specs, and Quick Actions */}
      <div className="flex items-center gap-2 w-full min-w-0">
        {/* Layer Thumbnail */}
        <div className="size-8 rounded-md overflow-hidden bg-muted/80 border border-neutral-300 dark:border-neutral-700 shrink-0 flex items-center justify-center relative shadow-2xs">
          {isText ? (
            <div
              className="size-full flex items-center justify-center font-bold text-xs"
              style={{
                background: textEl?.style.showBackground
                  ? textEl.style.backgroundType === "solid"
                    ? textEl.style.backgroundColor
                    : textEl.style.backgroundColorVia
                    ? `linear-gradient(${textEl.style.backgroundDirection || "to bottom"}, ${textEl.style.backgroundColor || "#18181b"}, ${textEl.style.backgroundColorVia || "#111113"}, ${textEl.style.backgroundColorEnd || "#09090b"})`
                    : `linear-gradient(${textEl.style.backgroundDirection || "to bottom"}, ${textEl.style.backgroundColor || "#18181b"}, ${textEl.style.backgroundColorEnd || "#09090b"})`
                  : undefined,
              }}
            >
              <span
                style={{
                  color: textEl?.style.color || "#ffffff",
                  fontFamily: textEl?.style.fontFamily,
                  fontWeight: textEl?.style.fontWeight,
                }}
                className="text-xl"
              >
                T
              </span>
            </div>
          ) : isCode ? (
            <div
              className="size-full flex items-center justify-center rounded-sm transition-colors border border-white/10 shadow-2xs"
              style={{
                backgroundColor: codeEl?.style?.glassmorphism
                  ? "rgba(24, 24, 27, 0.75)"
                  : (codeTheme?.bg || "#18181b"),
              }}
            >
              <CodeIcon
                size={14}
                weight="bold"
                style={{
                  color: codeTheme?.keyword || "#7aa2f7",
                }}
              />
            </div>
          ) : imgEl?.src ? (
            <img
              src={imgEl.src}
              alt=""
              className="size-full object-cover"
              draggable={false}
            />
          ) : (
            <ImageIcon size={14} className="text-muted-foreground" />
          )}
        </div>

        {/* Title and Specs */}
        <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden pr-0.5">
          <span
            className="text-xs font-semibold truncate text-foreground leading-tight block max-w-full"
            title={isText ? textEl?.content || "Text Layer" : isCode ? codeEl?.style?.windowTitle || "Code Snippet" : imgEl?.name || "Image Layer"}
          >
            {title}
          </span>
          <span className="text-[10px] text-muted-foreground truncate font-medium font-manrope leading-tight mt-0.5 block max-w-full">
            {subtitle}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Lock Button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={element.isLocked ? "Unlock layer" : "Lock layer"}
            className={cn(
              "size-6 rounded-md cursor-pointer p-0 shrink-0",
              element.isLocked
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25"
                : "text-muted-foreground hover:text-foreground opacity-70 group-hover:opacity-100",
            )}
            title={element.isLocked ? "Unlock Layer" : "Lock Layer"}
            onClick={(e) => {
              e.stopPropagation();
              toggleLock(element.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {element.isLocked ? <LockSimpleIcon size={13} /> : <LockSimpleOpenIcon size={13} />}
          </Button>

          {/* Visibility Button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={element.isVisible ? "Hide layer" : "Show layer"}
            className={cn(
              "size-6 rounded-md cursor-pointer p-0 shrink-0",
              !element.isVisible
                ? "text-muted-foreground bg-muted hover:bg-muted/80"
                : "text-muted-foreground hover:text-foreground opacity-70 group-hover:opacity-100",
            )}
            title={element.isVisible ? "Hide Layer" : "Show Layer"}
            onClick={(e) => {
              e.stopPropagation();
              toggleVisibility(element.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {element.isVisible ? <EyeIcon size={13} /> : <EyeSlashIcon size={13} />}
          </Button>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete layer"
            className="size-6 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer p-0 shrink-0 opacity-70 group-hover:opacity-100"
            title="Delete Layer"
            onClick={(e) => {
              e.stopPropagation();
              removeElement(element.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <TrashIcon size={13} />
          </Button>

          {/* Drag Handle Indicator */}
          <div
            className="p-1 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted/70 transition-colors shrink-0 cursor-grab active:cursor-grabbing touch-none"
            title="Drag to reorder layer"
          >
            <DotsSixVerticalIcon size={15} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Metadata Badges & Coordinates */}
      <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-border/40 text-[9px] text-muted-foreground font-manrope min-w-0 max-w-full overflow-hidden flex-nowrap">
        {/* Coordinates */}
        <span className="text-[9px] bg-muted/70 dark:bg-muted/50 px-1.5 py-0.2 rounded-xs border border-border/50 shrink-0 truncate">
          X:{Math.round(element.position.x)} &nbsp; Y:{Math.round(element.position.y)}
        </span>

        {/* Feature Badges */}
        {has3D && (
          <span className="px-1 py-0.2 rounded-xs text-[9px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
            3D
          </span>
        )}

        {isText && textEl?.style.showBackground && (
          <span className="px-1 py-0.2 rounded-xs text-[9px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
            BG
          </span>
        )}

        {((isText && textEl?.style.glassmorphism) ||
          (isCode && codeEl?.style?.glassmorphism) ||
          (!isText && !isCode && imgEl?.style.glassmorphism)) && (
            <span className="px-1 py-0.2 rounded-xs text-[9px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              Glass
            </span>
          )}

        {!isText && !isCode && imgEl?.dither?.enabled && (
          <span className="px-1 py-0.2 rounded-xs text-[9px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
            Dither
          </span>
        )}

        {/* Status Indicators */}
        {element.isLocked && (
          <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded-xs text-[9px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
            <LockSimpleIcon size={9} /> Locked
          </span>
        )}

        {!element.isVisible && (
          <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded-xs text-[9px] font-semibold bg-muted text-muted-foreground border border-border/60 shrink-0">
            <EyeSlashIcon size={9} /> Hidden
          </span>
        )}
      </div>
    </SmoothReorderItem>
  );
});

