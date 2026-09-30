"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas } from "./components/canvas";
import { LeftPanel } from "./components/panels/left-panel";
import { RightPanel } from "./components/panels/right-panel";
import {
  ArrowLeftIcon,
  ArrowCounterClockwiseIcon,
  ArrowClockwiseIcon,
  ArrowArcLeftIcon,
  TrashIcon,
  XLogoIcon,
  SlidersIcon,
  XIcon,
  CircleNotchIcon,
  DownloadSimpleIcon,
  FilmStripIcon,
  CaretDownIcon,
  MagnetIcon,
  GridFourIcon,
  AlignCenterHorizontalIcon,
  AlignCenterVerticalIcon,
  CopyIcon,
  StackIcon,
  ClipboardTextIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNotice } from "@/components/mobile-notice";
import { useStore } from "./store/use-store";
import { useSelection } from "./hooks/selection";
import { useExport } from "./hooks/export";
import {
  DEFAULT_IMAGE_STYLE,
  ImageElement,
  CanvasElement,
  ExportFormat,
} from "./types";
import { ASPECT_RATIOS } from "./values";
import { useDraftRecovery } from "./hooks/use-draft-recovery";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { StudioSlider } from "@/components/ui/studio-slider";

export default function EditorPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);
  const [snappingEnabled, setSnappingEnabled] = useState(true);
  const [showGrid, setShowGrid] = useState(false);

  const {
    aspectRatio,
    setAspectRatio,
    canvasBackground,
    meshConfig,
    overlayConfig,
    elements,
    selectedElementId,
    selectElement,
    updateElement,
    addElement,
    removeElement,
    isCropping,
    setCropping,
    undo,
    redo,
    historyIndex,
    history,
    exportFormat,
    exportQuality,
    exportDuration,
    exportFps,
    setExportFormat,
    setExportQuality,
    setExportDuration,
    setExportFps,
  } = useStore();

  const recovery = useDraftRecovery();
  const [savedStatusDismissed, setSavedStatusDismissed] = useState(false);

  useEffect(() => {
    setSavedStatusDismissed(false);
    if (recovery.status !== "saved") return;
    const timer = setTimeout(() => setSavedStatusDismissed(true), 2000);
    return () => clearTimeout(timer);
  }, [recovery.status]);

  const isVideoFormat = ["mp4", "gif"].includes(exportFormat);

  const {
    isDragging,
    snapGuides,
    handleElementPointerDown,
    handleCanvasPointerMove,
    handlePointerUp,
  } = useSelection(
    canvasRef,
    aspectRatio,
    elements,
    updateElement,
    selectElement,
    snappingEnabled,
  );

  const {
    handleDownload,
    handleCopyToClipboard,
    isExporting,
    exportProgress,
    exportStatus,
  } = useExport(canvasRef, selectElement);

  const handleImageUpload = useCallback(
    (file: File) => {
      const generation = useStore.getState().documentGeneration;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (useStore.getState().documentGeneration !== generation) return;
        const result = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          if (useStore.getState().documentGeneration !== generation) return;
          const id = `img_${Date.now()}`;
          const canvasW = aspectRatio.width;
          const canvasH = aspectRatio.height;
          const imgW = img.naturalWidth;
          const imgH = img.naturalHeight;
          const scaleX = canvasW / imgW;
          const scaleY = canvasH / imgH;
          const scale = Math.min(scaleX, scaleY, 1) * 90;
          const x = (canvasW - imgW) / 2;
          const y = (canvasH - imgH) / 2;

          const newImage: ImageElement = {
            id,
            type: "image",
            name: file.name || "Image Layer",
            src: result,
            position: { x, y },
            style: { ...DEFAULT_IMAGE_STYLE, scale: Math.round(scale) },
            isVisible: true,
            isLocked: false,
          };
          addElement(newImage);
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    },
    [aspectRatio.width, aspectRatio.height, addElement],
  );

  // Global Clipboard Paste Listener (Ctrl + V to paste screenshots directly)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!recovery.ready || recovery.pendingTemplate) return;
      const target = e.target as HTMLElement;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageUpload(file);
            toast.success("Pasted screenshot from clipboard! 🚀");
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleImageUpload, recovery.ready, recovery.pendingTemplate]);

  const handleCropChange = (id: string, newCrop: any) => {
    updateElement(id, { crop: newCrop });
  };

  const centerSelectedElement = (axis: "both" | "horizontal" | "vertical") => {
    if (!selectedElementId || !canvasRef.current) return;
    const el = elements.find((item) => item.id === selectedElementId);
    if (!el || el.isLocked) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const scale = canvasRect.width / aspectRatio.width;

    const wrapper = canvasRef.current.querySelector(
      `[data-element-id="${selectedElementId}"]`,
    );
    const targetDomEl = (wrapper?.querySelector(".pointer-events-auto") ||
      wrapper?.firstElementChild ||
      wrapper) as HTMLElement | null;

    if (!targetDomEl) return;

    const elRect = targetDomEl.getBoundingClientRect();
    const currentCenterX =
      (elRect.left + elRect.width / 2 - canvasRect.left) / scale;
    const currentCenterY =
      (elRect.top + elRect.height / 2 - canvasRect.top) / scale;

    const targetCenterX = aspectRatio.width / 2;
    const targetCenterY = aspectRatio.height / 2;

    const deltaX = targetCenterX - currentCenterX;
    const deltaY = targetCenterY - currentCenterY;

    const newPos = { ...el.position };
    if (axis === "horizontal" || axis === "both") {
      newPos.x = Math.round(el.position.x + deltaX);
    }
    if (axis === "vertical" || axis === "both") {
      newPos.y = Math.round(el.position.y + deltaY);
    }

    updateElement(selectedElementId, { position: newPos });
  };

  const handleDuplicateElement = useCallback(() => {
    if (!selectedElementId) return;
    const selected = elements.find((el) => el.id === selectedElementId);
    if (!selected) return;

    const newId = `${selected.type}_${Date.now()}`;
    const duplicated: CanvasElement = {
      ...selected,
      id: newId,
      name: `${selected.name} (Copy)`,
      position: {
        x: selected.position.x + 20,
        y: selected.position.y + 20,
      },
      style: {
        ...selected.style,
        ...(selected.type === "image" && selected.style?.crop
          ? { crop: { ...selected.style.crop } }
          : {}),
      },
      ...(selected.type === "image" && selected.dither
        ? { dither: { ...selected.dither } }
        : {}),
    } as CanvasElement;
    addElement(duplicated);
    selectElement(newId);
  }, [selectedElementId, elements, addElement, selectElement]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!recovery.ready || recovery.pendingTemplate) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.closest?.("[role='combobox']") ||
          target.closest?.("[data-radix-popper-content-wrapper]"))
      ) {
        return;
      }

      // Undo: Ctrl+Z / Cmd+Z (without Shift)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "z" &&
        !e.shiftKey
      ) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Shift+Z / Cmd+Shift+Z or Ctrl+Y
      if (
        ((e.ctrlKey || e.metaKey) &&
          e.key.toLowerCase() === "z" &&
          e.shiftKey) ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y")
      ) {
        e.preventDefault();
        redo();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        if (selectedElementId) {
          e.preventDefault();
          handleDuplicateElement();
        }
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedElementId) {
          e.preventDefault();
          const selected = elements.find((el) => el.id === selectedElementId);
          if (selected && !selected.isLocked) {
            removeElement(selectedElementId);
          }
        }
        return;
      }

      if (
        selectedElementId &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
        const selected = elements.find((el) => el.id === selectedElementId);
        if (!selected || selected.isLocked) return;

        const delta = e.shiftKey ? 10 : 1;
        let dx = 0;
        let dy = 0;

        if (e.key === "ArrowUp") dy = -delta;
        if (e.key === "ArrowDown") dy = delta;
        if (e.key === "ArrowLeft") dx = -delta;
        if (e.key === "ArrowRight") dx = delta;

        updateElement(selectedElementId, {
          position: {
            x: selected.position.x + dx,
            y: selected.position.y + dy,
          },
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedElementId,
    elements,
    undo,
    redo,
    removeElement,
    updateElement,
    handleDuplicateElement,
    recovery.ready,
    recovery.pendingTemplate,
  ]);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const isMobile = window.innerWidth < 768;
      // Safe clearance so the canvas never overlaps top controls or bottom toolbar
      const paddingX = isMobile ? 24 : 48;
      const paddingY = isMobile ? 80 : 96;

      const availableWidth = Math.max(100, containerWidth - paddingX);
      const availableHeight = Math.max(100, containerHeight - paddingY);

      const scaleX = availableWidth / aspectRatio.width;
      const scaleY = availableHeight / aspectRatio.height;

      // Allow the canvas to scale up/down to comfortably fill the available workspace
      const newScale = Math.min(scaleX, scaleY);
      setCanvasScale(newScale);
    };
    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [aspectRatio]);

  const renderExportContent = () => (
    <>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-foreground">
          <FilmStripIcon className="size-3.5 text-primary" weight="duotone" />{" "}
          Export Media
        </Label>
        <span className="text-[10px] font-bold text-primary uppercase tracking-wide bg-primary/10 px-1.5 py-0.5 rounded">
          {isVideoFormat ? "Video" : "Image"}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1 bg-muted/60 p-1 rounded-lg">
        {(["mp4", "gif", "png", "jpeg", "svg"] as ExportFormat[]).map((fmt) => (
          <button
            key={fmt}
            onClick={() => setExportFormat(fmt)}
            className={`py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
              exportFormat === fmt
                ? "bg-primary text-primary-foreground shadow-xs scale-102"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>

      {isVideoFormat ? (
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <StudioSlider
                label="Duration"
                value={Math.min(10, Math.max(3, exportDuration || 3))}
                onChange={(val) => setExportDuration(val)}
                min={3}
                max={10}
                step={1}
                defaultValue={3}
                unit="s"
                compact
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground block px-1">
                Framerate
              </Label>
              <div className="grid grid-cols-2 gap-1 bg-muted/60 rounded-lg h-6">
                {[
                  { value: 30, label: "30 FPS", disabled: false },
                  {
                    value: 60,
                    label: "60 FPS",
                    disabled: exportFormat === "gif",
                  },
                ].map(({ value, label, disabled }) => (
                  <button
                    key={value}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && setExportFps(value)}
                    title={
                      disabled ? "60 FPS is not available for GIF" : undefined
                    }
                    className={`rounded text-xs font-semibold transition-all flex items-center justify-center ${
                      disabled
                        ? "opacity-35 cursor-not-allowed text-muted-foreground"
                        : exportFps === value
                          ? "bg-primary text-primary-foreground shadow-xs font-bold cursor-pointer"
                          : "text-muted-foreground hover:text-foreground cursor-pointer"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <Label className="text-xs text-muted-foreground">
              Resolution Scale
            </Label>
            <div className="flex gap-1.5">
              {[
                { q: "1", label: "1x Standard" },
                { q: "2", label: "2x 1080p HD" },
                { q: "4", label: "4x 4K Ultra" },
              ].map(({ q, label }) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setExportQuality(q)}
                  className={`px-2.5 py-0.5 rounded text-xs font-semibold border cursor-pointer ${
                    exportQuality === q
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                  title={label}
                >
                  {q}x
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-1">
          <Label className="text-xs text-muted-foreground">
            Resolution Scale
          </Label>
          <div className="flex gap-1.5">
            {["1", "2", "4"].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setExportQuality(q)}
                className={`px-2.5 py-0.5 rounded text-xs font-semibold border cursor-pointer ${
                  exportQuality === q
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border text-muted-foreground"
                }`}
              >
                {q}x
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 ">
        <Button
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full h-9 font-bold text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-md cursor-pointer flex items-center justify-center gap-2 rounded-lg"
        >
          {isExporting ? (
            <span>{"Exporting..."}</span>
          ) : (
            <>
              <DownloadSimpleIcon className="size-3.5" weight="bold" />
              <span className="text-xs">
                Export {exportFormat.toUpperCase()}
              </span>
            </>
          )}
        </Button>

        <Button
          type="button"
          onClick={handleCopyToClipboard}
          disabled={isExporting}
          variant="outline"
          className="w-full h-9 text-xs font-semibold border-border/80 hover:bg-muted cursor-pointer shadow-md flex items-center justify-center gap-2 rounded-lg"
        >
          <ClipboardTextIcon className="size-3.5 text-primary" weight="bold" />
          <span className="text-xs">Copy Image</span>
        </Button>
      </div>
    </>
  );

  if (!recovery.ready)
    return (
      <div className="flex h-screen items-center justify-center" role="status">
        Opening canvas…
      </div>
    );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden flex-col md:flex-row">
      <MobileNotice />
      {(recovery.status !== "saved" || !savedStatusDismissed) && (
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 z-[100] rounded-md border bg-background px-3 py-1.5 text-xs shadow"
          role="status"
          aria-live="polite"
        >
          {recovery.status === "idle"
            ? "Local recovery ready"
            : recovery.status === "pending"
              ? "Changes not saved"
              : recovery.status === "saving"
                ? "Saving locally…"
                : recovery.status === "saved"
                  ? "Saved locally"
                  : recovery.status === "conflict"
                    ? "Draft changed in another tab"
                    : recovery.status === "unavailable"
                      ? "Local recovery unavailable"
                      : recovery.problem === "unsupported"
                        ? "This draft needs a different version of Fluidframe."
                        : recovery.problem
                          ? "This local draft couldn’t be opened"
                          : "Couldn’t save locally"}
          {(recovery.status === "error" ||
            recovery.status === "unavailable" ||
            (recovery.status === "invalid" && !recovery.problem)) && (
            <button className="ml-2 underline" onClick={recovery.retry}>
              Retry
            </button>
          )}
          {recovery.status === "conflict" && (
            <>
              <button className="ml-2 underline" onClick={recovery.loadSaved}>
                Load saved draft
              </button>
              <button
                className="ml-2 underline"
                onClick={recovery.useThisCanvas}
              >
                Use this canvas
              </button>
            </>
          )}
          {recovery.problem && (
            <button className="ml-2 underline" onClick={recovery.discard}>
              Discard saved draft
            </button>
          )}
          {recovery.error?.message && recovery.status === "error" && (
            <span className="ml-2">
              {recovery.error.name === "DraftQuotaError"
                ? "Browser storage is full. Recent changes aren’t saved. Remove large images or free site storage, then retry."
                : recovery.error.message}
            </span>
          )}
        </div>
      )}
      <span className="sr-only">
        Local drafts can disappear if site data is cleared or a private browsing
        session ends.
      </span>
      {recovery.busy && (
        <div
          className="absolute inset-0 z-[120] bg-background/70 flex items-center justify-center"
          role="status"
        >
          Saving canvas…
        </div>
      )}
      {recovery.pendingTemplate && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute inset-0 z-[110] flex items-center justify-center bg-background/80"
        >
          <div className="rounded-lg border bg-background p-6 shadow-xl">
            <p>Open this template and replace your local recovery draft?</p>
            <div className="mt-4 flex gap-3">
              <Button onClick={recovery.applyTemplate}>Open template</Button>
              <Button variant="outline" onClick={recovery.cancelTemplate}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="md:hidden h-12 border-b dark:border-neutral-800 bg-card/95 backdrop-blur-md flex items-center justify-between px-2.5 shrink-0 z-30 relative">
        <div className="flex items-center gap-1">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeftIcon size={18} />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 gap-1.5 text-xs font-semibold text-foreground hover:bg-muted"
            onClick={() => setShowLeftPanel(true)}
          >
            <StackIcon size={15} weight="duotone" className="text-primary" />
            <span>Layers</span>
          </Button>
        </div>

        {/* Compact Aspect Ratio in Mobile Header */}
        <div className="flex items-center">
          <Select value={aspectRatio.name} onValueChange={setAspectRatio}>
            <SelectTrigger className="h-8 px-2 gap-1.5 bg-background border border-border/80 rounded-lg text-xs font-manrope font-semibold">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-3 h-2.5 bg-muted border border-foreground/30 rounded-2xs ${aspectRatio.previewClass}`}
                />
                <span className="font-bold text-xs text-foreground">
                  {aspectRatio.name}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="w-72 font-manrope max-h-96 shadow-2xl border-border/80 backdrop-blur-xl bg-background/95 p-1 z-50">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Aspect Ratio
              </div>
              {(
                [
                  "Developer & Launch",
                  "Video & Display",
                  "Social Media",
                  "Design & Standard",
                ] as const
              ).map((category) => {
                const items = ASPECT_RATIOS.filter(
                  (r) => r.category === category,
                );
                if (items.length === 0) return null;
                return (
                  <SelectGroup key={category}>
                    <SelectLabel className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-1 bg-muted/40 rounded-sm my-0.5">
                      {category}
                    </SelectLabel>
                    {items.map((ratio) => (
                      <SelectItem
                        key={ratio.name}
                        value={ratio.name}
                        className="py-1.5 px-2 rounded-md cursor-pointer focus:bg-accent/80 transition-colors"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div
                            className={`w-6.5 shrink-0 bg-muted border border-foreground/20 rounded-xs ${ratio.previewClass}`}
                          />
                          <div className="flex items-center justify-between gap-1 flex-1 min-w-0">
                            <span className="font-semibold text-xs text-foreground">
                              {ratio.name}
                            </span>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                              {ratio.label}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 gap-1 text-xs font-semibold text-foreground hover:bg-muted"
            onClick={() => setShowRightPanel(true)}
          >
            <SlidersIcon size={15} weight="duotone" className="text-primary" />
            <span className="text-xs">Studio</span>
          </Button>

          {/* Mobile Export Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                disabled={isExporting}
                size="sm"
                className="h-8 px-2.5 gap-1 font-bold text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs rounded-lg cursor-pointer transition-all flex items-center"
              >
                {isExporting ? (
                  <CircleNotchIcon className="size-3.5 animate-spin" />
                ) : (
                  <DownloadSimpleIcon className="size-3.5" weight="bold" />
                )}
                <span className="hidden sm:inline">Export</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-72 p-4 font-manrope bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-xl space-y-3 z-50 mr-1"
            >
              {renderExportContent()}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Mobile Left Drawer */}
      {showLeftPanel && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col md:hidden animate-in slide-in-from-left duration-200">
          <div className="h-14 border-b dark:border-neutral-800 flex items-center justify-between px-4 shrink-0">
            <span className="font-semibold text-md uppercase tracking-wider">
              Layer Tools
            </span>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLeftPanel(false)}
              >
                <XIcon size={20} weight="bold" />
              </Button>
            </div>
          </div>
          <div className="flex-1 min-h-0 relative">
            <LeftPanel
              onLoadTemplateOrPreset={recovery.loadTemplateOrPreset}
              onImageUpload={handleImageUpload}
              isCropping={isCropping}
              onToggleCropping={() => setCropping(!isCropping)}
            />
          </div>
        </div>
      )}

      {/* Mobile Right Drawer */}
      {showRightPanel && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col md:hidden animate-in slide-in-from-right duration-200">
          <div className="h-14 border-b dark:border-neutral-800 flex items-center justify-between px-4 shrink-0">
            <span className="font-semibold text-md uppercase tracking-wider">
              Studio & Export
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowRightPanel(false)}
            >
              <XIcon size={20} weight="bold" />
            </Button>
          </div>
          <div className="flex-1 min-h-0 relative">
            <RightPanel onDownload={handleDownload} />
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <div className="hidden md:flex w-72 shrink-0 border-r-2 dark:border-neutral-800 bg-card flex-col z-20 h-full">
        <div className="h-12 border-b-2 dark:border-neutral-800 flex items-center justify-between px-3 shrink-0">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground rounded-md"
            >
              <ArrowLeftIcon size={20} />
            </Button>
          </Link>
          <span className="text-sm uppercase font-bold pt-0.5 tracking-wider font-display">
            Fluidframe Studio
          </span>
          <div className="flex items-center gap-1">
            <Link
              href="https://x.com/DIGVIJAY__RAWAT"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <XLogoIcon className="size-4" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <div className="flex-1 min-h-0 w-full relative">
          <LeftPanel
            onLoadTemplateOrPreset={recovery.loadTemplateOrPreset}
            onImageUpload={handleImageUpload}
            isCropping={isCropping}
            onToggleCropping={() => setCropping(!isCropping)}
          />
        </div>
      </div>

      <input
        ref={hiddenInputRef}
        type="file"
        accept="image/*"
        onChange={(e) =>
          e.target.files?.[0] && handleImageUpload(e.target.files[0])
        }
        className="hidden"
      />

      {/* Main Workspace Area */}
      <div className="flex-1 relative bg-muted/20 flex flex-col min-w-0 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#ababab_2px,transparent_1px)] bg-size-[20px_20px]" />

        {/* Floating Canvas Resolution Dropdown (Desktop Top-Left) */}
        <div className="hidden md:block absolute top-3 left-3 z-40 animate-in fade-in slide-in-from-top-2 duration-300">
          <Select value={aspectRatio.name} onValueChange={setAspectRatio}>
            <SelectTrigger className="h-8 px-2.5 gap-2 bg-background/85 dark:bg-card/90 backdrop-blur-md border border-border/80 shadow-md hover:border-primary/60 hover:bg-background/95 rounded-lg text-xs font-manrope font-semibold transition-all">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3.5 h-3 bg-muted border border-foreground/30 rounded-2xs ${aspectRatio.previewClass}`}
                />
                <span className="font-bold text-xs text-foreground">
                  {aspectRatio.name}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground truncate max-w-28">
                  {aspectRatio.label}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="w-72 font-manrope max-h-96 shadow-2xl border-border/80 backdrop-blur-xl bg-background/95 p-1">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Aspect Ratio
              </div>
              {(
                [
                  "Developer & Launch",
                  "Video & Display",
                  "Social Media",
                  "Design & Standard",
                ] as const
              ).map((category) => {
                const items = ASPECT_RATIOS.filter(
                  (r) => r.category === category,
                );
                if (items.length === 0) return null;
                return (
                  <SelectGroup key={category}>
                    <SelectLabel className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-1 bg-muted/40 rounded-sm my-0.5">
                      {category}
                    </SelectLabel>
                    {items.map((ratio) => (
                      <SelectItem
                        key={ratio.name}
                        value={ratio.name}
                        className="py-1.5 px-2 rounded-md cursor-pointer focus:bg-accent/80 transition-colors"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div
                            className={`w-6.5 shrink-0 bg-muted border border-foreground/20 rounded-xs ${ratio.previewClass}`}
                          />
                          <div className="flex items-center justify-between gap-1 flex-1 min-w-0">
                            <span className="font-semibold text-xs text-foreground">
                              {ratio.name}
                            </span>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                              {ratio.label}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                );
              })}
              {aspectRatio.name === "Custom" && (
                <SelectItem value="Custom" className="hidden">
                  Custom
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Floating Export & Copy Control (Desktop Top-Right) */}
        <div className="hidden md:flex items-center gap-2 absolute top-3 right-3 z-40 animate-in fade-in slide-in-from-top-2 duration-300">
          <Button
            type="button"
            disabled={isExporting}
            variant="outline"
            onClick={handleCopyToClipboard}
            size="sm"
            className="h-8 px-2.5 gap-1.5 font-semibold text-xs border-border/80 bg-card/90 backdrop-blur-md hover:bg-muted text-foreground shadow-xs rounded-lg cursor-pointer transition-all"
            title="Copy 4K Image to Clipboard"
          >
            <ClipboardTextIcon
              className="size-3.5 text-primary"
              weight="bold"
            />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                disabled={isExporting}
                className="h-8 px-3 gap-1.5 font-bold text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg rounded-lg cursor-pointer transition-all flex items-center"
              >
                {isExporting ? (
                  <>
                    <CircleNotchIcon className="size-3.5 animate-spin" />
                    <span>
                      {exportProgress > 0
                        ? `${exportProgress}%`
                        : "Exporting..."}
                    </span>
                  </>
                ) : (
                  <>
                    <DownloadSimpleIcon className="size-3.5" weight="bold" />
                    <span>Export</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-primary-foreground/20 rounded uppercase font-manrope font-extrabold">
                      {exportFormat}
                    </span>
                    <CaretDownIcon
                      className="size-3 opacity-70"
                      weight="bold"
                    />
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-72 p-4 font-manrope bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-xl space-y-3 z-50"
            >
              {renderExportContent()}
            </PopoverContent>
          </Popover>
        </div>

        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-3 overflow-hidden z-10 w-full h-full relative"
        >
          <div
            style={{
              transform: `scale(${canvasScale})`,
              width: aspectRatio.width,
              height: aspectRatio.height,
              transition: "transform 0.1s ease-out",
              touchAction: "none",
            }}
            className="origin-center shadow-2xl relative rounded-lg overflow-visible"
          >
            <Canvas
              ref={canvasRef}
              width={aspectRatio.width}
              height={aspectRatio.height}
              canvasBackground={canvasBackground}
              meshConfig={meshConfig}
              overlayConfig={overlayConfig}
              elements={elements}
              onEmptyClick={() => {
                if (elements.length === 0) {
                  hiddenInputRef.current?.click();
                } else {
                  const codeEl = elements.find((e) => e.type === "code");
                  const hasOtherElements = elements.some(
                    (e) => e.type !== "code",
                  );
                  if (codeEl && !hasOtherElements) {
                    selectElement(codeEl.id);
                  } else {
                    selectElement(null);
                  }
                }
              }}
              selectedElementId={selectedElementId}
              onElementMouseDown={handleElementPointerDown}
              onMouseMove={handleCanvasPointerMove}
              onMouseUp={handlePointerUp}
              isDragging={isDragging}
              isCropping={isCropping}
              snapGuides={snapGuides}
              showGrid={showGrid}
              onCropChange={handleCropChange}
            />
          </div>
        </div>

        {/* Floating Quick Action Toolbar - Desktop */}
        {!showLeftPanel && !showRightPanel && (
          <div className="hidden md:flex absolute bottom-3 left-3 items-center gap-2 z-50 animate-in fade-in zoom-in duration-300">
            <div className="bg-background/90 backdrop-blur-md border-2 border-border rounded-lg p-0.5 shadow-xl flex items-center gap-1">
              {/* Undo / Redo */}
              <Button
                onClick={undo}
                disabled={historyIndex <= 0}
                variant="ghost"
                size="icon"
                title="Undo (Ctrl+Z)"
                className="rounded-full w-8 h-8 hover:bg-muted"
              >
                <ArrowCounterClockwiseIcon size={16} weight="bold" />
              </Button>
              <Button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                variant="ghost"
                size="icon"
                title="Redo (Ctrl+Shift+Z)"
                className="rounded-full w-8 h-8 hover:bg-muted"
              >
                <ArrowClockwiseIcon size={16} weight="bold" />
              </Button>

              <div className="w-px h-5 bg-border mx-1" />

              <Button
                onClick={() => setSnappingEnabled(!snappingEnabled)}
                variant="ghost"
                size="icon"
                title={
                  snappingEnabled
                    ? "Snapping Guides Enabled (Hold Alt to bypass)"
                    : "Snapping Guides Disabled"
                }
                className={`rounded-full w-8 h-8 transition-colors hover:bg-muted ${
                  snappingEnabled ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <MagnetIcon
                  className={`size-4 ${!snappingEnabled ? "opacity-40 line-through" : ""}`}
                  weight="duotone"
                />
              </Button>

              <Button
                onClick={() => setShowGrid(!showGrid)}
                variant="ghost"
                size="icon"
                title={showGrid ? "Hide Precision Grid" : "Show Precision Grid"}
                className={`rounded-full w-8 h-8 transition-colors hover:bg-muted ${
                  showGrid ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <GridFourIcon className="size-4" weight="bold" />
              </Button>

              <div className="w-px h-5 bg-border mx-1" />

              <Button
                onClick={() => centerSelectedElement("horizontal")}
                disabled={!selectedElementId}
                variant="ghost"
                size="icon"
                title="Center Horizontally"
                className="rounded-full w-8 h-8 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-35 disabled:pointer-events-none"
              >
                <AlignCenterHorizontalIcon className="size-4" weight="bold" />
              </Button>

              <Button
                onClick={() => centerSelectedElement("vertical")}
                disabled={!selectedElementId}
                variant="ghost"
                size="icon"
                title="Center Vertically"
                className="rounded-full w-8 h-8 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-35 disabled:pointer-events-none"
              >
                <AlignCenterVerticalIcon className="size-4" weight="bold" />
              </Button>

              <Button
                onClick={handleDuplicateElement}
                disabled={!selectedElementId}
                variant="ghost"
                size="icon"
                title="Duplicate Layer (Ctrl+D)"
                className="rounded-full w-8 h-8 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-35 disabled:pointer-events-none"
              >
                <CopyIcon className="size-4" weight="bold" />
              </Button>

              <Button
                onClick={() =>
                  selectedElementId && removeElement(selectedElementId)
                }
                disabled={!selectedElementId}
                variant="ghost"
                size="icon"
                title="Delete Layer (Delete / Backspace)"
                className="rounded-full w-8 h-8 hover:bg-muted text-muted-foreground hover:text-destructive disabled:opacity-35 disabled:pointer-events-none"
              >
                <TrashIcon size={16} weight="bold" />
              </Button>
            </div>
          </div>
        )}

        {/* Floating Reset Button - Desktop */}
        {!showLeftPanel && !showRightPanel && (
          <div className="hidden md:flex absolute bottom-3 right-3 items-center z-50 animate-in fade-in zoom-in duration-300">
            <div className="bg-background/90 backdrop-blur-md border-2 border-border rounded-lg p-0.5 shadow-xl flex items-center">
              <Button
                onClick={recovery.newCanvas}
                variant="ghost"
                size="icon"
                title="New canvas"
                className="rounded-full w-8 h-8 hover:bg-muted text-destructive hover:text-red-500"
              >
                <ArrowArcLeftIcon size={16} weight="bold" />
              </Button>
            </div>
          </div>
        )}

        {/* Unified Floating Action Dock - Mobile */}
        {!showLeftPanel && !showRightPanel && (
          <div className="flex md:hidden absolute bottom-3 inset-x-0 mx-auto w-fit max-w-[96vw] items-center justify-center z-40 animate-in fade-in zoom-in duration-300">
            <div className="bg-background/95 backdrop-blur-xl border border-border/90 rounded-xl p-1 shadow-2xl flex items-center gap-0.5 overflow-x-auto">
              <Button
                onClick={undo}
                disabled={historyIndex <= 0}
                variant="ghost"
                size="icon"
                className="rounded-lg size-7 hover:bg-muted"
                title="Undo"
              >
                <ArrowCounterClockwiseIcon size={14} weight="bold" />
              </Button>
              <Button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                variant="ghost"
                size="icon"
                className="rounded-lg size-7 hover:bg-muted"
                title="Redo"
              >
                <ArrowClockwiseIcon size={14} weight="bold" />
              </Button>

              <div className="w-px h-4 bg-border mx-0.5" />

              <Button
                onClick={() => setSnappingEnabled(!snappingEnabled)}
                variant="ghost"
                size="icon"
                className={`rounded-lg size-7 transition-colors hover:bg-muted ${
                  snappingEnabled ? "text-primary" : "text-muted-foreground"
                }`}
                title="Snapping"
              >
                <MagnetIcon
                  className={`size-3.5 ${!snappingEnabled ? "opacity-40 line-through" : ""}`}
                  weight="duotone"
                />
              </Button>

              <Button
                onClick={() => setShowGrid(!showGrid)}
                variant="ghost"
                size="icon"
                className={`rounded-lg size-7 transition-colors hover:bg-muted ${
                  showGrid ? "text-primary" : "text-muted-foreground"
                }`}
                title="Grid"
              >
                <GridFourIcon className="size-3.5" weight="bold" />
              </Button>

              <div className="w-px h-4 bg-border mx-0.5" />

              <Button
                onClick={() => centerSelectedElement("horizontal")}
                disabled={!selectedElementId}
                variant="ghost"
                size="icon"
                className="rounded-lg size-7 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                title="Center Horizontally"
              >
                <AlignCenterHorizontalIcon className="size-3.5" weight="bold" />
              </Button>

              <Button
                onClick={() => centerSelectedElement("vertical")}
                disabled={!selectedElementId}
                variant="ghost"
                size="icon"
                className="rounded-lg size-7 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                title="Center Vertically"
              >
                <AlignCenterVerticalIcon className="size-3.5" weight="bold" />
              </Button>

              <Button
                onClick={handleDuplicateElement}
                disabled={!selectedElementId}
                variant="ghost"
                size="icon"
                className="rounded-lg size-7 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                title="Duplicate"
              >
                <CopyIcon className="size-3.5" weight="bold" />
              </Button>

              <Button
                onClick={() =>
                  selectedElementId && removeElement(selectedElementId)
                }
                disabled={!selectedElementId}
                variant="ghost"
                size="icon"
                className="rounded-lg size-7 hover:bg-muted text-muted-foreground hover:text-destructive disabled:opacity-30 disabled:pointer-events-none"
                title="Delete"
              >
                <TrashIcon size={14} weight="bold" />
              </Button>

              <div className="w-px h-4 bg-border mx-0.5" />

              <Button
                onClick={recovery.newCanvas}
                variant="ghost"
                size="icon"
                className="rounded-lg size-7 hover:bg-muted text-destructive hover:text-red-500"
                title="New canvas"
              >
                <ArrowArcLeftIcon size={14} weight="bold" />
              </Button>
            </div>
          </div>
        )}

        {isExporting && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-card border-2 border-border shadow-2xl rounded-2xl p-6 max-w-xs w-full space-y-3 text-center animate-in zoom-in-95 duration-200">
              <h3 className="font-bold text-sm uppercase tracking-wide">
                Exporting {exportFormat.toUpperCase()}
              </h3>

              {exportProgress > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-200"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                  <div className="text-center text-[10px] font-manrope font-semibold text-muted-foreground">
                    {exportProgress}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="hidden md:flex w-76 shrink-0 border-l-2 dark:border-neutral-800 bg-card flex-col z-20 h-full">
        <div className="flex-1 min-h-0 w-full relative">
          <RightPanel onDownload={handleDownload} />
        </div>
      </div>
    </div>
  );
}
