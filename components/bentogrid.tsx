"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  DeviceMobileIcon,
  DesktopIcon,
  SquareIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";

export const BentoGrid = () => {
  // Card 1: Color palette state
  const [selectedPalette, setSelectedPalette] = useState(0);
  const palettes = [
    { name: "Aurora", colors: ["#00dfd8", "#007cf0", "#7928ca", "#ff0080"] },
    { name: "Cyber", colors: ["#ff007a", "#7928ca", "#4f46e5", "#06b6d4"] },
    { name: "Sunset", colors: ["#ff4e50", "#f9d423", "#ff8a00", "#e52e71"] },
    { name: "Emerald", colors: ["#10b981", "#059669", "#047857", "#064e3b"] },
  ];

  // Card 2: Dither intensity state
  const [ditherType, setDitherType] = useState<"bayer" | "noise" | "halftone">("bayer");

  // Card 3: Device preview aspect ratio
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "1:1" | "9:16">("16:9");

  // Card 4: Font preview state
  const [selectedFont, setSelectedFont] = useState(0);
  const fontOptions = [
    {
      name: "Modern Sans",
      sample: "Create at the speed of thought",
      sub: "Inter Display • Medium 500",
      fontClass: "font-sans font-medium tracking-tight",
    },
    {
      name: "Editorial Serif",
      sample: "Create at the speed of thought",
      sub: "Instrument Serif • Italic",
      fontClass: "font-instrument italic font-normal text-xl sm:text-2xl",
    },
    {
      name: "Cyber Mono",
      sample: "CREATE.AT.THE.SPEED_OF_THOUGHT",
      sub: "JetBrains Mono • Semibold",
      fontClass: "font-mono font-semibold tracking-tighter text-xs sm:text-sm",
    },
  ];

  // Card 5: Export format state
  const [activeFormat, setActiveFormat] = useState<"PNG" | "MP4" | "GIF">("PNG");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportSim = (fmt: "PNG" | "MP4" | "GIF") => {
    setActiveFormat(fmt);
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 1200);
  };

  return (
    <section id="features" className="w-full py-24 relative scroll-mt-24">
      <div className="w-[92%] max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border/80 dark:border-neutral-800 bg-muted/40 text-xs font-medium font-manrope text-muted-foreground mb-4">
            <span>Features & Superpowers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground max-w-2xl text-balance">
            Everything you need to create viral visual content
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-muted-foreground max-w-xl font-manrope">
            Streamlined studio capabilities built for creators, marketers, founders, and designers. No complex timeline software.
          </p>
        </div>

        {/* High-Density 5-Item Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {/* Card 1: WebGL Mesh Gradients (Col 7 / Row 1) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 rounded-3xl border border-border dark:border-neutral-800 bg-card/60 backdrop-blur-xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-lg group hover:border-primary/40 transition-colors"
          >
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                Fluid WebGL Mesh Gradients
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Generate dynamic, animated fluid gradients and studio textures. Pick harmonious presets or customize your color points.
              </p>
            </div>

            {/* Interactive Preview Canvas */}
            <div className="mt-6 rounded-2xl border border-border/60 dark:border-neutral-800 overflow-hidden relative p-4 flex flex-col justify-between min-h-[200px] shadow-inner">
              {/* Dynamic Animated Gradient Background */}
              <motion.div
                key={selectedPalette}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 opacity-95"
                style={{
                  background: `radial-gradient(circle at 20% 30%, ${palettes[selectedPalette].colors[0]} 0%, transparent 60%),
                               radial-gradient(circle at 80% 40%, ${palettes[selectedPalette].colors[1]} 0%, transparent 60%),
                               radial-gradient(circle at 50% 80%, ${palettes[selectedPalette].colors[2]} 0%, transparent 60%),
                               radial-gradient(circle at 80% 90%, ${palettes[selectedPalette].colors[3]} 0%, transparent 50%),
                               #0a0a0c`,
                }}
              />

              <div className="relative z-10 flex flex-wrap items-center gap-2 mt-auto pt-4">
                {palettes.map((pal, idx) => (
                  <button
                    key={pal.name}
                    type="button"
                    onClick={() => setSelectedPalette(idx)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${selectedPalette === idx
                      ? "bg-white text-black font-bold shadow-lg scale-[1.03]"
                      : "bg-black/60 text-white/80 hover:bg-black/80 hover:text-white border border-white/10"
                      }`}
                  >
                    <div className="flex size-3.5 rounded-full overflow-hidden shrink-0 border border-white/30">
                      <div className="w-1/2 h-full" style={{ backgroundColor: pal.colors[0] }} />
                      <div className="w-1/2 h-full" style={{ backgroundColor: pal.colors[1] }} />
                    </div>
                    <span>{pal.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2: Retro Dither Shaders (Col 5 / Row 1) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-5 rounded-3xl border border-border/80 dark:border-neutral-800 bg-card/60 backdrop-blur-xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-lg group hover:border-primary/40 transition-colors"
          >
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                Vintage Dither Shaders
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Transform any image into authentic Bayer matrix dither art, retro grain, and 16-bit cyber aesthetics.
              </p>
            </div>

            {/* Dither Mode Preview */}
            <div className="mt-6 rounded-2xl border border-border/60 dark:border-neutral-800 bg-muted/20 p-4 flex flex-col justify-between min-h-[200px] relative overflow-hidden">
              {/* Pattern Mockup Box */}
              <div className="flex-1 rounded-xl bg-neutral-950 border border-neutral-800 p-4 flex flex-col items-center justify-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-40 transition-opacity duration-300 pointer-events-none"
                  style={{
                    backgroundImage:
                      ditherType === "bayer"
                        ? "radial-gradient(circle, #fff 1.5px, transparent 1.5px)"
                        : ditherType === "noise"
                          ? "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 4px)"
                          : "radial-gradient(circle, #fff 2.5px, transparent 2.5px)",
                    backgroundSize: ditherType === "halftone" ? "12px 12px" : "6px 6px",
                  }}
                />
                <span className="relative z-10 text-xs font-bold text-white uppercase tracking-widest bg-black/80 px-3.5 py-1.5 rounded-lg border border-white/20 shadow-md">
                  {ditherType.toUpperCase()} MATRIX
                </span>
              </div>

              {/* Dither Switcher */}
              <div className="grid grid-cols-3 gap-1.5 mt-3">
                {(["bayer", "noise", "halftone"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDitherType(type)}
                    className={`py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${ditherType === type
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "bg-background/80 text-muted-foreground hover:text-foreground border border-border/60 dark:border-neutral-800"
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 3: 3D Device Frames & Multi-Aspect Ratio (Col 4 / Row 2) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="md:col-span-4 rounded-3xl border border-border/80 dark:border-neutral-800 bg-card/60 backdrop-blur-xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-lg group hover:border-primary/40 transition-colors"
          >
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                3D Device Mockups
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Wrap your visuals in device mockups with perspective tilt and ratios for all feeds.
              </p>
            </div>

            {/* Device Canvas Frame */}
            <div className="mt-6 rounded-2xl border border-border/60 dark:border-neutral-800 bg-muted/20 p-3.5 flex flex-col items-center justify-between h-[200px] overflow-hidden">
              {/* Animated Mockup Box */}
              <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className={`rounded-xl border-2 border-border/80 dark:border-neutral-700 bg-background shadow-md flex flex-col items-center justify-between p-1.5 overflow-hidden transition-all ${
                    aspectRatio === "16:9"
                      ? "w-36 h-20"
                      : aspectRatio === "1:1"
                      ? "w-20 h-20"
                      : "w-14 h-24"
                  }`}
                >
                  <div className="w-full flex-1 rounded bg-primary/10 border border-primary/20 flex items-center justify-center my-0.5 min-h-0">
                    <span className="text-[10px] font-inter font-bold text-primary">
                      {aspectRatio}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Aspect Ratio Buttons */}
              <div className="w-full flex items-center justify-between gap-1 bg-background/80 p-1 rounded-xl border border-border/60 dark:border-neutral-800 mt-2 shrink-0">
                {[
                  { id: "16:9", label: "16:9", icon: <DesktopIcon className="size-3" weight="bold" /> },
                  { id: "1:1", label: "1:1", icon: <SquareIcon className="size-3" weight="bold" /> },
                  { id: "9:16", label: "9:16", icon: <DeviceMobileIcon className="size-3" weight="bold" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAspectRatio(item.id as "16:9" | "1:1" | "9:16")}
                    className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      aspectRatio === item.id
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 4: Typography & Smart Badges (Col 4 / Row 2) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-4 rounded-3xl border border-border/80 dark:border-neutral-800 bg-card/60 backdrop-blur-xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-lg group hover:border-primary/40 transition-colors"
          >
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                Expressive Typography
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Pair modern curated Google fonts, adjustable text badge fills, and corner roundness.
              </p>
            </div>

            {/* Font Interactive Preview */}
            <div className="mt-6 rounded-2xl border border-border/60 dark:border-neutral-800 bg-muted/20 p-3.5 flex flex-col justify-between h-[200px] overflow-hidden">
              <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedFont}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex flex-col items-center"
                  >
                    <p className={`text-sm sm:text-base text-foreground ${fontOptions[selectedFont].fontClass}`}>
                      &ldquo;{fontOptions[selectedFont].sample}&rdquo;
                    </p>
                    <span className="text-[10px] text-muted-foreground font-inter mt-1.5">
                      {fontOptions[selectedFont].sub}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Font Selector Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-background/80 p-1 rounded-xl border border-border/60 dark:border-neutral-800 mt-2 shrink-0">
                {fontOptions.map((font, idx) => (
                  <button
                    key={font.name}
                    type="button"
                    onClick={() => setSelectedFont(idx)}
                    className={`py-1 rounded-lg text-[11px] transition-all truncate px-1 cursor-pointer font-medium ${
                      selectedFont === idx
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {font.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="md:col-span-4 rounded-3xl border border-border/80 dark:border-neutral-800 bg-card/60 backdrop-blur-xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-lg group hover:border-primary/40 transition-colors"
          >
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                Image and Video Export
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Export high quality images and broadcast 60 FPS MP4 video loops directly from GPU.
              </p>
            </div>

            {/* Export Simulation Container */}
            <div className="mt-6 rounded-2xl border border-border/60 dark:border-neutral-800 bg-muted/20 p-3.5 flex flex-col justify-between h-[200px] overflow-hidden">
              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-inter font-bold text-foreground">
                    {activeFormat}
                  </span>
                  {isExporting ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-500 font-inter font-semibold animate-pulse">
                      Rendering...
                    </span>
                  ) : (
                    <CheckCircleIcon className="size-3.5 text-emerald-500" weight="fill" />
                  )}
                </div>

                {/* Progress bar simulation */}
                <div className="w-full max-w-[160px] h-1.5 bg-muted rounded-full overflow-hidden border border-border/50">
                  <motion.div
                    key={isExporting ? "active" : "idle"}
                    initial={{ width: "0%" }}
                    animate={{ width: isExporting ? "100%" : "100%" }}
                    transition={{ duration: isExporting ? 1.1 : 0.2 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>

                <span className="text-[10px] text-muted-foreground font-inter">
                  Zero-Knowledge Privacy • 100% Client-Side
                </span>
              </div>

              {/* Format Switcher Pills */}
              <div className="grid grid-cols-3 gap-1.5 mt-3">
                {(["PNG", "MP4", "GIF"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => handleExportSim(fmt)}
                    className={`py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      activeFormat === fmt
                        ? "bg-primary text-primary-foreground shadow-xs font-bold"
                        : "bg-background/80 text-muted-foreground hover:text-foreground border border-border/60 dark:border-neutral-800"
                    }`}
                  >
                    {isExporting && activeFormat === fmt ? (
                      <span className="animate-spin size-3 border-2 border-primary-foreground border-t-transparent rounded-full" />
                    ) : (
                      <span>{fmt}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
