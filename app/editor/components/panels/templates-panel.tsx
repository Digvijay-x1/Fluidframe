"use client";

import { useState, useRef, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  DownloadSimpleIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "../../store/use-store";
import { BUILTIN_TEMPLATES } from "../../templates/presets-data";
import { TemplateItem } from "../../templates/types";
import { ImageElement } from "../../types";

function TemplateAccuratePreview({ template }: { template: TemplateItem }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasW = template.aspectRatio?.width || 960;
  const canvasH = template.aspectRatio?.height || 540;
  const [scale, setScale] = useState(0.24);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateScale = () => {
      const w = el.clientWidth;
      if (w > 0) {
        setScale(w / canvasW);
      }
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [canvasW]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-md overflow-hidden bg-neutral-950/90 border border-white/10 shadow-inner flex items-center justify-center select-none"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:10px_10px] opacity-70 pointer-events-none" />

      <div
        className="absolute top-0 left-0 pointer-events-none origin-top-left"
        style={{
          width: canvasW,
          height: canvasH,
          transform: `scale(${scale})`,
        }}
      >
        {template.elements.map((el, idx) => {
          if (el.type !== "image") return null;
          const img = el as ImageElement;
          const cardW = img.width || 260;
          const cardH = img.height || 380;
          const zIndex = idx + 20;
          const has3DRotation = img.style.rotateX !== 0 || img.style.rotateY !== 0;

          const isShortCard = cardH < 280;

          return (
            <div
              key={img.id || idx}
              className="absolute flex flex-col items-center justify-center"
              style={{
                left: `${img.position.x}px`,
                top: `${img.position.y}px`,
                width: `${cardW}px`,
                height: `${cardH}px`,
                transform: `
                  perspective(${has3DRotation ? 2000 : 1500}px)
                  rotateX(${img.style.rotateX}deg)
                  rotateY(${img.style.rotateY}deg)
                  rotateZ(${img.style.rotate}deg)
                  scale3d(${((img.style.scale || 100) / 100)}, ${((img.style.scale || 100) / 100)}, 1)
                  scaleX(${img.style.flipX ? -1 : 1})
                  scaleY(${img.style.flipY ? -1 : 1})
                `,
                borderRadius: `${img.style.borderRadius || 16}px`,
                background: img.style.glassmorphism
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow:
                  img.style.shadow === "none"
                    ? "0 25px 50px -12px rgba(0,0,0,0.5)"
                    : img.style.shadow || "0 25px 50px -12px rgba(0,0,0,0.65)",
                opacity: (img.style.opacity ?? 100) / 100,
                zIndex,
              }}
            >
              <div
                className={`flex flex-col items-center justify-center text-center select-none ${
                  isShortCard ? "p-3" : "p-6"
                }`}
              >
                <div
                  className={`${
                    isShortCard ? "size-11 mb-2" : "size-16 mb-3"
                  } rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-primary shadow-xl`}
                >
                  <PlusIcon size={isShortCard ? 22 : 32} weight="bold" />
                </div>
                <p className="text-xs font-semibold text-white/90 tracking-wide font-manrope">
                  {img.placeholderLabel || img.name || "Add Image"}
                </p>
                {!isShortCard && (
                  <p className="text-[10px] text-white/70 mt-1 font-inter">
                    Click to upload image
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TemplatesPanel() {
  const {
    userPresets,
    saveCustomPreset,
    deleteCustomPreset,
    loadTemplateOrPreset,
    exportPresetsAsJson,
    importPresetsFromJson,
    loadUserPresets,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    loadUserPresets();
  }, [loadUserPresets]);

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) {
      toast.error("Enter a preset name");
      return;
    }
    saveCustomPreset(newPresetName.trim());
    toast.success(`Saved "${newPresetName.trim()}"`);
    setNewPresetName("");
    setIsSavingPreset(false);
  };

  const handleExportPresets = () => {
    if (userPresets.length === 0) {
      toast.error("No saved presets to export");
      return;
    }
    const jsonStr = exportPresetsAsJson();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fluidframe-presets-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported presets");
  };

  const handleImportPresets = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importPresetsFromJson(content);
      if (success) {
        toast.success("Imported presets");
      } else {
        toast.error("Invalid preset file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold uppercase tracking-wider">
          Templates
        </Label>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSavingPreset(!isSavingPreset)}
            className="size-7 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
            title={isSavingPreset ? "Cancel" : "Save Scene"}
          >
            <PlusIcon size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="size-7 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
            title="Upload Presets"
          >
            <UploadSimpleIcon size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExportPresets}
            className="size-7 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
            title="Export Presets"
          >
            <DownloadSimpleIcon size={14} />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportPresets}
            className="hidden"
          />
        </div>
      </div>

      {/* Save Preset Input */}
      {isSavingPreset && (
        <form onSubmit={handleSavePreset} className="space-y-1.5 pt-0.5">
          <Input
            placeholder="Preset name..."
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            className="h-8 text-xs bg-background"
            autoFocus
          />
          <Button type="submit" size="sm" className="w-full h-7 text-xs bg-primary rounded-md">
            Save Preset
          </Button>
        </form>
      )}

      <p className="px-3 text-xs text-muted-foreground">Presets are named copies. Your current canvas is recovered separately.</p>
      {/* User Saved Presets List */}
      {mounted && userPresets.length > 0 && (
        <div className="space-y-1.5">
          <span className=" flex items-center justify-between pr-1 text-[11px] font-medium text-muted-foreground">
            <span>
              Saved Preset{userPresets.length === 1 ? "" : "s"}
            </span>
            ({userPresets.length})
          </span>
          <div className="gap-1 flex flex-col max-h-40 overflow-y-auto pr-1">
            {userPresets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between p-2 rounded-md border border-border/70 hover:border-primary/50 hover:bg-muted/40 transition-colors group"
              >
                <button
                  type="button"
                  onClick={() => {
                    loadTemplateOrPreset(preset);
                    toast.success(`Loaded "${preset.name}"`);
                  }}
                  className="flex-1 text-left truncate cursor-pointer pr-2 flex items-center gap-2"
                >
                  <div
                    className="size-6 rounded-md shrink-0 shadow-xs"
                    style={{
                      background: `linear-gradient(135deg, ${preset.meshConfig?.colors?.[0] || "#6366f1"}, ${preset.meshConfig?.colors?.[1] || "#a855f7"})`,
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {preset.aspectRatio?.name || "16:9"} • {preset.elements?.length || 0} layers
                    </p>
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    deleteCustomPreset(preset.id);
                    toast.info(`Deleted "${preset.name}"`);
                  }}
                  className="size-6 text-muted-foreground rounded-lg dark:hover:bg-neutral-900 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon size={12} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Presentation Templates List */}
      <div className="grid grid-cols-1 gap-3 pt-0.5">
        {BUILTIN_TEMPLATES.map((template) => {
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => {
                loadTemplateOrPreset(template);
                toast.success(`Loaded "${template.title}"`);
              }}
              className="group w-full rounded-xl border border-border/70 bg-card/60 p-2 hover:border-primary/60 hover:bg-muted/30 transition-all text-left flex flex-col gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-2xs hover:shadow-xs"
            >
              {/* 100% Accurate Visual Presentation Layout Overview */}
              <div className="relative w-full rounded-md overflow-hidden group-hover:scale-[1.01] transition-transform">
                <TemplateAccuratePreview template={template} />

                {/* Aspect ratio / card count badge */}
                <div className="absolute top-1.5 right-1.5 z-20 px-1.5 py-0.5 rounded-xs bg-black/70 backdrop-blur-xs border border-white/15 text-[9px] font-manrope font-semibold text-white/90">
                  {template.elements.length} Cards
                </div>

                {/* Hover Apply Badge */}
                <div className="absolute bottom-1.5 right-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-primary-foreground font-sans font-medium text-[9px] bg-primary/95 px-1.5 py-0.5 rounded-xs shadow-sm">
                    Apply Layout
                  </span>
                </div>
              </div>

              {/* Template Meta Info */}
              <div className="flex items-center justify-between gap-2 px-0.5 pt-0.5">
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {template.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                    {template.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
