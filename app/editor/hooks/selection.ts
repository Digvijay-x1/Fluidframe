import { useState, useCallback, useEffect, RefObject } from "react";
import { CanvasElement } from "../types";

export interface SnapGuides {
  x: number | null;
  y: number | null;
}

export function useSelection(
  canvasRef: RefObject<HTMLDivElement | null>,
  currentAspectRatio: { width: number; height: number },
  elements: CanvasElement[],
  updateElement: (id: string, updates: Partial<CanvasElement>) => void,
  setSelectedElementId: (id: string | null) => void,
  snappingEnabled: boolean = true,
) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [centerOffset, setCenterOffset] = useState({ x: 0, y: 0 });
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [snapGuides, setSnapGuides] = useState<SnapGuides>({
    x: null,
    y: null,
  });

  // Instantly cancel any ongoing drag if the layer becomes locked or is removed
  useEffect(() => {
    if (dragTarget) {
      const targetEl = elements.find((el) => el.id === dragTarget);
      if (!targetEl || targetEl.isLocked) {
        setDragTarget(null);
        setIsDragging(false);
        setSnapGuides({ x: null, y: null });
      }
    }
  }, [elements, dragTarget]);

  const getCanvasScale = useCallback(() => {
    if (!canvasRef.current) return 1;
    const rect = canvasRef.current.getBoundingClientRect();
    return rect.width / currentAspectRatio.width;
  }, [canvasRef, currentAspectRatio.width]);

  const handleElementPointerDown = useCallback(
    (e: React.PointerEvent, elementId: string) => {
      e.preventDefault();
      e.stopPropagation();

      const scale = getCanvasScale();
      const element = elements.find((el) => el.id === elementId);

      if (!element || !canvasRef.current || element.isLocked) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();

      const clientX = e.clientX;
      const clientY = e.clientY;

      const mouseXInCanvas = (clientX - canvasRect.left) / scale;
      const mouseYInCanvas = (clientY - canvasRect.top) / scale;

      const targetEl = (e.currentTarget as HTMLElement) || (e.target as HTMLElement);
      const targetRect = targetEl ? targetEl.getBoundingClientRect() : { left: clientX, top: clientY, width: 100, height: 100 };
      
      // Calculate screen offset from pointer to the visual center of the layer
      const centerOffsetX = (targetRect.left + targetRect.width / 2) - clientX;
      const centerOffsetY = (targetRect.top + targetRect.height / 2) - clientY;

      setCenterOffset({
        x: centerOffsetX,
        y: centerOffsetY,
      });

      setDragOffset({
        x: mouseXInCanvas - element.position.x,
        y: mouseYInCanvas - element.position.y,
      });

      setDragTarget(elementId);
      setSelectedElementId(elementId);
      setIsDragging(true);
      setSnapGuides({ x: null, y: null });

      (e.target as Element).setPointerCapture(e.pointerId);
    },
    [getCanvasScale, elements, canvasRef, setSelectedElementId],
  );

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!dragTarget || !canvasRef.current) return;
    const targetEl = elements.find((el) => el.id === dragTarget);
    if (!targetEl || targetEl.isLocked) {
      setDragTarget(null);
      setIsDragging(false);
      setSnapGuides({ x: null, y: null });
      return;
    }
    e.preventDefault();

    const scale = getCanvasScale();
    const canvasRect = canvasRef.current.getBoundingClientRect();

    const clientX = e.clientX;
    const clientY = e.clientY;

    const mouseXInCanvas = (clientX - canvasRect.left) / scale;
    const mouseYInCanvas = (clientY - canvasRect.top) / scale;

    const canvasWidth = currentAspectRatio.width;
    const canvasHeight = currentAspectRatio.height;

    const rawX = mouseXInCanvas - dragOffset.x;
    const rawY = mouseYInCanvas - dragOffset.y;

    // True visual center of the element in canvas coordinate space
    const currentCenterX = ((clientX + centerOffset.x) - canvasRect.left) / scale;
    const currentCenterY = ((clientY + centerOffset.y) - canvasRect.top) / scale;

    const canvasCenterX = canvasWidth * 0.5;
    const canvasCenterY = canvasHeight * 0.5;

    let newX = rawX;
    let newY = rawY;
    let activeSnapX: number | null = null;
    let activeSnapY: number | null = null;

    const isSnapActive = snappingEnabled && !e.altKey && !e.ctrlKey;

    if (isSnapActive) {
      const minRegionX = canvasWidth * 0.48;
      const maxRegionX = canvasWidth * 0.52;
      if (currentCenterX >= minRegionX && currentCenterX <= maxRegionX) {
        newX = rawX + (canvasCenterX - currentCenterX);
        activeSnapX = canvasCenterX;
      }

      const minRegionY = canvasHeight * 0.48;
      const maxRegionY = canvasHeight * 0.52;
      if (currentCenterY >= minRegionY && currentCenterY <= maxRegionY) {
        newY = rawY + (canvasCenterY - currentCenterY);
        activeSnapY = canvasCenterY;
      }
    }

    setSnapGuides({ x: activeSnapX, y: activeSnapY });
    updateElement(dragTarget, {
      position: { x: Math.round(newX), y: Math.round(newY) },
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDragTarget(null);
    setIsDragging(false);
    setSnapGuides({ x: null, y: null });
    if (e.target instanceof Element && e.target.hasPointerCapture(e.pointerId)) {
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  return {
    isDragging,
    snapGuides,
    handleElementPointerDown,
    handleCanvasPointerMove,
    handlePointerUp,
  };
}
