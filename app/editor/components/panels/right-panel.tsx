"use client";

import { useRef, useCallback, useState } from "react";
import {
  ImageIcon,
  CircleNotchIcon,
  SmileyIcon,
  StackIcon,
  LightningIcon,
  ProhibitIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { StudioSlider } from "@/components/ui/studio-slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RightPanelProps } from "../../types";
import {
  MESH_PALETTES,
  DEFAULT_MESH_CONFIG,
} from "../../values";
import { Wallpapers } from "../../hooks/wallpaper";
import { Memes } from "../../hooks/memes";
import { generateRandomMeshColors } from "../../utils/gradient-gen";
import { useStore } from "../../store/use-store";
import {
  VectorOverlay,
  VectorPatternType,
  PATTERN_LIST,
} from "../canvas/vector-overlay";
import {
  StudioTexture,
  StudioTextureType,
  TEXTURE_LIST,
} from "../canvas/studio-texture";

export function RightPanel({ onDownload }: RightPanelProps) {
  const {
    canvasBackground,
    meshConfig,
    overlayConfig,
    setBackground,
    setCustomSize,
    setMeshConfig,
    setOverlayConfig,
  } = useStore();

  const {
    wallpapers,
    loading: wallpapersLoading,
    hasMore: wallpapersHasMore,
    loadMore: loadMoreWallpapers,
  } = Wallpapers({ limit: 20 });

  const {
    memes,
    loading: memesLoading,
    hasMore: memesHasMore,
    loadMore: loadMoreMemes,
  } = Memes({ limit: 20 });

  const [pictureSubTab, setPictureSubTab] = useState<"wallpapers" | "memes">(
    "wallpapers"
  );
  const [colorMode, setColorMode] = useState<"gradient" | "solid">("gradient");
  const [solidColor, setSolidColor] = useState<string>(
    () => meshConfig.colors[0] || "#18181b"
  );
  const [prevGradientColors, setPrevGradientColors] = useState<string[]>(
    () => meshConfig.colors
  );

  const wallpaperScrollRef = useRef<HTMLDivElement>(null);
  const memeScrollRef = useRef<HTMLDivElement>(null);

  const handleRandomMesh = () => {
    const randomColors = generateRandomMeshColors();
    setPrevGradientColors(randomColors);
    setColorMode("gradient");
    setBackground("mesh");
    setMeshConfig({ colors: randomColors });
  };

  const handleColorChange = (index: number, newColor: string) => {
    const updatedColors = [...meshConfig.colors];
    updatedColors[index] = newColor;
    setPrevGradientColors(updatedColors);
    setBackground("mesh");
    setMeshConfig({ colors: updatedColors });
  };

  const handleModeChange = (mode: "gradient" | "solid") => {
    setColorMode(mode);
    if (mode === "solid") {
      const isAlreadySolid = meshConfig.colors.every(
        (c) => c.toLowerCase() === meshConfig.colors[0].toLowerCase()
      );
      if (!isAlreadySolid) {
        setPrevGradientColors(meshConfig.colors);
      }
      const targetColor = solidColor || meshConfig.colors[0] || "#18181b";
      setBackground("mesh");
      setMeshConfig({
        colors: [targetColor, targetColor, targetColor, targetColor, targetColor],
      });
    } else {
      const colorsToRestore =
        prevGradientColors.length === 5 &&
        prevGradientColors.some(
          (c) => c.toLowerCase() !== prevGradientColors[0].toLowerCase()
        )
          ? prevGradientColors
          : DEFAULT_MESH_CONFIG.colors;
      setBackground("mesh");
      setMeshConfig({ colors: [...colorsToRestore] });
    }
  };

  const handleSolidColorChange = (newColor: string) => {
    setSolidColor(newColor);
    setBackground("mesh");
    setMeshConfig({
      colors: [newColor, newColor, newColor, newColor, newColor],
    });
  };

  const handleWallpaperScroll = useCallback(() => {
    const scrollArea = wallpaperScrollRef.current;
    if (!scrollArea || wallpapersLoading || !wallpapersHasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollArea;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMoreWallpapers();
    }
  }, [wallpapersLoading, wallpapersHasMore, loadMoreWallpapers]);

  const handleMemeScroll = useCallback(() => {
    const scrollArea = memeScrollRef.current;
    if (!scrollArea || memesLoading || !memesHasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollArea;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMoreMemes();
    }
  }, [memesLoading, memesHasMore, loadMoreMemes]);

  return (
    <div className="flex flex-col h-full w-full bg-card">
      <Tabs defaultValue="shaders" className="w-full flex-1 flex flex-col h-full">
        <div className="px-3 pt-3 pb-1 shrink-0">
          <TabsList className="w-full grid grid-cols-3 dark:bg-neutral-800">
            <TabsTrigger value="shaders" className="gap-1.5 font-semibold text-xs cursor-pointer">
              <LightningIcon className="size-3.5 text-primary" weight="duotone" />
              Shaders
            </TabsTrigger>
            <TabsTrigger value="overlays" className="gap-1.5 font-semibold text-xs cursor-pointer">
              <StackIcon className="size-3.5 text-primary" weight="duotone" />
              Texture
            </TabsTrigger>
            <TabsTrigger value="pictures" className="gap-1.5 font-semibold text-xs cursor-pointer">
              <ImageIcon className="size-3.5 text-primary" weight="duotone" />
              Pictures
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 relative">
          {/* TAB 1: WebGL Mesh Gradient & Shaders */}
          <TabsContent
            value="shaders"
            className="absolute inset-0 data-[state=inactive]:hidden focus-visible:outline-none mt-0"
          >
            <ScrollArea className="h-full w-full">
              <div className="p-4 flex flex-col gap-6 pb-6">
                {/* Section 1: Color Palettes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold uppercase tracking-wider">
                      Palette Combinations
                    </Label>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="relative group rounded-lg p-[1.5px] transition-transform hover:scale-[1.03] active:scale-[0.98]">
                      <div className="absolute -inset-0.75 rounded-xl google-rainbow-glow opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <button
                        type="button"
                        onClick={handleRandomMesh}
                        className="relative z-10 w-full h-full rounded-[6.5px] p-1.5 transition-all text-center bg-card dark:bg-neutral-900 hover:bg-card/90 dark:hover:bg-neutral-900/90 cursor-pointer overflow-hidden flex flex-col justify-between"
                        title="Generate random mesh colors"
                      >
                        <div className="flex h-5 w-full rounded overflow-hidden mb-1 shadow-xs relative">
                          <div className="flex-1 h-full animate-circulate-1" />
                          <div className="flex-1 h-full animate-circulate-2" />
                          <div className="flex-1 h-full animate-circulate-3" />
                          <div className="flex-1 h-full animate-circulate-4" />
                          <div className="flex-1 h-full animate-circulate-5" />
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-palette-shimmer" />
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-[10px] font-medium text-foreground truncate block text-center">
                            Randomize
                          </span>
                        </div>
                      </button>
                    </div>

                    {MESH_PALETTES.map((pal) => {
                      const isSelected =
                        canvasBackground === "mesh" &&
                        meshConfig.colors.length === pal.colors.length &&
                        meshConfig.colors.every(
                          (c, i) =>
                            c.toLowerCase() === pal.colors[i].toLowerCase()
                        );

                      return (
                        <button
                          key={pal.name}
                          type="button"
                          onClick={() => {
                            setBackground("mesh");
                            setPrevGradientColors([...pal.colors]);
                            setColorMode("gradient");
                            setMeshConfig({ colors: [...pal.colors] });
                          }}
                          className={`group relative rounded-lg p-1.5 border transition-all text-center bg-background/50 hover:scale-[1.03] hover:z-10 hover:shadow-md cursor-pointer ${isSelected
                            ? "border-primary ring-1 ring-primary/60 bg-primary/5 shadow-xs font-semibold"
                            : "border-neutral-300 dark:border-neutral-700 hover:border-primary/80 hover:ring-1 hover:ring-primary/50"
                            }`}
                        >
                          <div className="flex h-5 w-full rounded overflow-hidden mb-1 shadow-xs">
                            {pal.colors.map((c, i) => (
                              <div
                                key={i}
                                className="flex-1 h-full"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-medium text-foreground truncate block text-center">
                            {pal.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Section 2: Custom Mesh Nodes / Single Color Palette */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold uppercase tracking-wider">
                      Color Palette
                    </Label>
                    <div className="flex items-center bg-muted/60 p-0.5 rounded-lg shrink-0">
                      <button
                        type="button"
                        onClick={() => handleModeChange("gradient")}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium font-manrope transition-all cursor-pointer ${
                          colorMode === "gradient"
                            ? "bg-background text-foreground shadow-xs font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Gradient
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModeChange("solid")}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium font-manrope transition-all cursor-pointer ${
                          colorMode === "solid"
                            ? "bg-background text-foreground shadow-xs font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Solid
                      </button>
                    </div>
                  </div>

                  {colorMode === "gradient" ? (
                    <div className="flex items-center justify-between gap-1 pl-1 pr-2">
                      {meshConfig.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center gap-1"
                        >
                          <div className="relative size-8 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-700 shadow-xs hover:scale-105 transition-transform">
                            <div
                              className="absolute inset-0"
                              style={{ backgroundColor: color }}
                            />
                            <input
                              type="color"
                              value={color}
                              onChange={(e) =>
                                handleColorChange(idx, e.target.value)
                              }
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                            />
                          </div>
                          <span className="text-[10px] font-manrope text-muted-foreground">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-1 pl-1 pr-2">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`relative size-8 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-700 shadow-xs hover:scale-105 transition-transform ${
                            ![ "#64748b","#fed7aa", "#bae6fd", "#f8fafc"].includes(
                              solidColor.toLowerCase()
                            )
                              ? "border-primary ring-2 ring-primary/80"
                              : ""
                          }`}
                        >
                          <div
                            className="absolute inset-0"
                            style={{ backgroundColor: solidColor }}
                          />
                          <input
                            type="color"
                            value={solidColor}
                            onChange={(e) =>
                              handleSolidColorChange(e.target.value)
                            }
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                          />
                        </div>
                        <span className="text-[10px] font-manrope text-muted-foreground">
                          Custom
                        </span>
                      </div>

                      {[
                        { name: "Steel", color: "#64748b" },
                        { name: "Peach", color: "#fed7aa" },
                        { name: "Ice", color: "#bae6fd" },
                        { name: "Snow", color: "#f8fafc" },
                      ].map((item) => {
                        const isSelected =
                          solidColor.toLowerCase() === item.color.toLowerCase();
                        return (
                          <button
                            key={item.color}
                            type="button"
                            onClick={() => handleSolidColorChange(item.color)}
                            className="flex flex-col items-center gap-1 cursor-pointer group"
                          >
                            <div
                              className={`size-8 rounded-lg overflow-hidden border shadow-xs transition-transform group-hover:scale-105 ${
                                isSelected
                                  ? "border-primary ring-2 ring-primary/80"
                                  : "border-border/80"
                              }`}
                              style={{ backgroundColor: item.color }}
                            />
                            <span
                              className={`text-[10px] font-manrope transition-colors ${
                                isSelected
                                  ? "text-primary font-semibold"
                                  : "text-muted-foreground group-hover:text-foreground"
                              }`}
                            >
                              {item.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Section 3: Fluid Motion */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      Fluid Motion
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {meshConfig.isAnimating ? "Animated" : "Static"}
                      </span>
                      <Switch
                        checked={meshConfig.isAnimating}
                        onCheckedChange={(checked) =>
                          setMeshConfig({ isAnimating: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-semibold font-manrope *:pr-1">
                    <StudioSlider
                      label="Flow Speed"
                      value={Number(meshConfig.speed.toFixed(1))}
                      onChange={(val) => setMeshConfig({ speed: val })}
                      min={0.1}
                      max={3.0}
                      step={0.1}
                      defaultValue={1.0}
                      unit="x"
                      disabled={!meshConfig.isAnimating}
                      compact
                    />

                    <StudioSlider
                      label="Distortion"
                      value={meshConfig.noiseIntensity}
                      onChange={(val) => setMeshConfig({ noiseIntensity: val })}
                      min={0}
                      max={100}
                      step={1}
                      defaultValue={50}
                      unit="%"
                      compact
                    />

                    <StudioSlider
                      label="Mesh Scale"
                      value={Number(meshConfig.noiseScale.toFixed(1))}
                      onChange={(val) => setMeshConfig({ noiseScale: val })}
                      min={0.5}
                      max={4.0}
                      step={0.1}
                      defaultValue={1.0}
                      unit="x"
                      compact
                    />

                    <StudioSlider
                      label="Noise Grain"
                      value={meshConfig.noiseGrain || 0}
                      onChange={(val) => setMeshConfig({ noiseGrain: val })}
                      min={0}
                      max={100}
                      step={1}
                      defaultValue={0}
                      unit="%"
                      compact
                    />
                  </div>
                </div>

                <Separator />

                {/* Section 4: Real-time Dithering Module */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold uppercase tracking-wider">
                      Background Dither
                    </Label>
                    <Switch
                      checked={meshConfig.ditherEnabled}
                      onCheckedChange={(checked) =>
                        setMeshConfig({ ditherEnabled: checked })
                      }
                    />
                  </div>

                  {meshConfig.ditherEnabled && (
                    <div className="space-y-4 font-manrope animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-2 gap-4 pr-2">
                        <div className="space-y-2 min-w-0">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Matrix&nbsp; Pattern
                          </Label>
                          <Select
                            value={String(meshConfig.ditherType)}
                            onValueChange={(v) =>
                              setMeshConfig({ ditherType: parseInt(v) })
                            }
                          >
                            <SelectTrigger className="h-8 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Bayer 2x2</SelectItem>
                              <SelectItem value="1">Bayer 4x4</SelectItem>
                              <SelectItem value="2">Bayer 8x8</SelectItem>
                              <SelectItem value="3">Random</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 min-w-0">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Color Levels
                          </Label>
                          <Select
                            value={String(meshConfig.ditherColorSteps)}
                            onValueChange={(v) =>
                              setMeshConfig({ ditherColorSteps: parseInt(v) })
                            }
                          >
                            <SelectTrigger className="h-8 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2 (1-Bit)</SelectItem>
                              <SelectItem value="4">4 Levels</SelectItem>
                              <SelectItem value="6">6 Levels</SelectItem>
                              <SelectItem value="8">8 Levels</SelectItem>
                              <SelectItem value="16">16 Levels</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Row 2: Pixel Size & Dither Strength Sliders */}
                      <div className="grid grid-cols-2 gap-3 *:pr-1">
                        <StudioSlider
                          label="Pixel Size"
                          value={meshConfig.ditherPixelSize}
                          onChange={(val) => setMeshConfig({ ditherPixelSize: val })}
                          min={1}
                          max={16}
                          step={1}
                          defaultValue={1}
                          unit="px"
                          compact
                        />

                        <StudioSlider
                          label="Strength"
                          value={meshConfig.ditherStrength ?? 100}
                          onChange={(val) => setMeshConfig({ ditherStrength: val })}
                          min={0}
                          max={100}
                          step={1}
                          defaultValue={100}
                          unit="%"
                          compact
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* TAB 2: Textures & Vector Patterns */}
          <TabsContent
            value="overlays"
            className="absolute inset-0 data-[state=inactive]:hidden focus-visible:outline-none mt-0"
          >
            <ScrollArea className="h-full w-full">
              <div className="p-4 flex flex-col gap-6 pb-6">
                {/* Vector Patterns */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2.5 items-center font-manrope">
                    <StudioSlider
                      label="Pattern Opacity"
                      value={overlayConfig.patternOpacity}
                      onChange={(val) => setOverlayConfig({ patternOpacity: val })}
                      min={5}
                      max={100}
                      step={1}
                      defaultValue={50}
                      unit="%"
                      disabled={overlayConfig.pattern === "none"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 font-manrope">
                    {PATTERN_LIST.map((p) => {
                      const isSelected = overlayConfig.pattern === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setOverlayConfig({ pattern: p.id })}
                          className={`group relative aspect-video rounded-lg overflow-hidden border transition-all duration-200 hover:scale-[1.03] hover:z-20 hover:shadow-xl cursor-pointer bg-muted/30 ${isSelected
                              ? "border-primary ring-2 ring-primary/80 shadow-lg"
                              : "border-neutral-300 dark:border-neutral-700 hover:border-primary hover:ring-2 hover:ring-primary/60"
                            }`}
                        >
                          <div className="absolute inset-0 w-full h-full">
                            {p.id === "none" ? (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/90 text-neutral-500 group-hover:text-neutral-300 transition-colors pb-3">
                                <ProhibitIcon className="size-5 mb-0.5 opacity-60 group-hover:opacity-100" weight="bold" />
                                <span className="text-[9px] uppercase tracking-wider font-semibold opacity-60">
                                  Off
                                </span>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden">
                                <VectorOverlay
                                  type={p.id}
                                  opacity={85}
                                  color="#ffffff"
                                  blendMode="normal"
                                  idPrefix={`preview_${p.id}`}
                                />
                              </div>
                            )}
                          </div>
                          <div className="absolute z-50 bottom-0 inset-x-0 bg-black/75 text-white text-[10px] py-1 px-1.5 truncate text-center backdrop-blur-xs font-manrope font-medium transition-colors group-hover:bg-black/90 group-hover:text-primary">
                            {p.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Studio Textures */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2.5 items-center font-manrope">
                    <StudioSlider
                      label="Texture Opacity"
                      value={overlayConfig.textureOpacity}
                      onChange={(val) => setOverlayConfig({ textureOpacity: val })}
                      min={5}
                      max={100}
                      step={1}
                      defaultValue={50}
                      unit="%"
                      disabled={overlayConfig.texture === "none"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 font-manrope">
                    {TEXTURE_LIST.map((t) => {
                      const isSelected = overlayConfig.texture === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setOverlayConfig({ texture: t.id })}
                          className={`group relative aspect-video rounded-lg overflow-hidden border transition-all duration-200 hover:scale-[1.03] hover:z-20 hover:shadow-xl cursor-pointer bg-muted/30 ${isSelected
                              ? "border-primary ring-2 ring-primary/80 shadow-lg"
                              : "border-neutral-300 dark:border-neutral-700 hover:border-primary hover:ring-2 hover:ring-primary/60"
                            }`}
                        >
                          <div className="absolute inset-0 w-full h-full">
                            {t.id === "none" ? (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/90 text-neutral-500 group-hover:text-neutral-300 transition-colors pb-3">
                                <ProhibitIcon className="size-5 mb-0.5 opacity-60 group-hover:opacity-100" weight="bold" />
                                <span className="text-[9px] uppercase tracking-wider font-semibold opacity-60">
                                  Off
                                </span>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden">
                                <StudioTexture
                                  type={t.id}
                                  opacity={85}
                                  blendMode="normal"
                                  idPrefix={`preview_tex_${t.id}`}
                                />
                              </div>
                            )}
                          </div>
                          <div className="absolute z-50 bottom-0 inset-x-0 bg-black/75 text-white text-[10px] py-1 px-1.5 truncate text-center backdrop-blur-xs font-manrope font-medium transition-colors group-hover:bg-black/90 group-hover:text-primary">
                            {t.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* TAB 3: Pictures (Wallpapers & Memes) */}
          <TabsContent
            value="pictures"
            className="absolute inset-0 data-[state=inactive]:hidden focus-visible:outline-none mt-0 flex flex-col"
          >
            <div className="p-4 flex flex-col h-full min-h-0 gap-3">
              {/* Sub-tab Pill Switcher */}
              <div className="grid grid-cols-2 gap-1 bg-muted/60 p-1 rounded-lg shrink-0">
                <button
                  onClick={() => setPictureSubTab("wallpapers")}
                  className={`py-1.5 rounded text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${pictureSubTab === "wallpapers"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <ImageIcon className="size-3.5" weight="duotone" /> Wallpapers
                </button>
                <button
                  onClick={() => setPictureSubTab("memes")}
                  className={`py-1.5 rounded text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${pictureSubTab === "memes"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <SmileyIcon className="size-3.5" weight="duotone" /> Memes
                </button>
              </div>

              <div className="flex-1 min-h-0 relative">
                {pictureSubTab === "wallpapers" ? (
                  <ScrollArea
                    className="h-full w-full"
                    onScroll={handleWallpaperScroll}
                  >
                    <div className="p-1 pb-4 grid grid-cols-2 gap-2.5">
                      {wallpapers.map((w) => (
                        <button
                          key={w.fileId}
                          onClick={() => setBackground(`url(${w.url})`)}
                          className="group relative aspect-video rounded-lg overflow-hidden border border-border/70 hover:border-primary hover:ring-2 hover:ring-primary/60 transition-all duration-200 hover:scale-[1.03] hover:z-20 hover:shadow-xl cursor-pointer bg-muted/30"
                        >
                          <img
                            src={w.thumbnailUrl}
                            alt={w.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[10px] py-1 px-1.5 truncate text-center backdrop-blur-xs font-manrope font-medium transition-colors group-hover:bg-black/90 group-hover:text-primary">
                            {w.name}
                          </div>
                        </button>
                      ))}
                      {wallpapersLoading && (
                        <div className="col-span-2 py-4 flex justify-center">
                          <CircleNotchIcon className="size-5 animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                ) : (
                  <ScrollArea
                    className="h-full w-full"
                    onScroll={handleMemeScroll}
                  >
                    <div className="p-1 pb-4 grid grid-cols-2 gap-2.5">
                      {memes.map((meme) => (
                        <button
                          key={meme.fileId}
                          onClick={() => {
                            const img = new Image();
                            img.src = meme.url;
                            img.onload = () => {
                              setCustomSize(img.naturalWidth, img.naturalHeight);
                              setBackground(`url(${meme.url})`);
                            };
                            img.onerror = () => {
                              toast.error("Failed to load meme template image.");
                            };
                          }}
                          className="group relative aspect-video rounded-lg overflow-hidden border border-border/70 hover:border-primary hover:ring-2 hover:ring-primary/60 transition-all duration-200 hover:scale-[1.03] hover:z-20 hover:shadow-xl cursor-pointer bg-muted/30"
                        >
                          <img
                            src={meme.thumbnailUrl}
                            alt={meme.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[10px] py-1 px-1.5 truncate text-center backdrop-blur-xs font-manrope font-medium transition-colors group-hover:bg-black/90 group-hover:text-primary">
                            {meme.name}
                          </div>
                        </button>
                      ))}
                      {memesLoading && (
                        <div className="col-span-2 py-4 flex justify-center">
                          <CircleNotchIcon className="size-5 animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
