"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import {
  CpuIcon,
  StackIcon,
  VideoCameraIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";

export const Hero = () => {
  return (
    <section className="relative w-full pt-28 pb-16 sm:pt-36 sm:pb-20 md:pt-40 md:pb-24 overflow-hidden flex flex-col items-center">
      <div className="w-[92%] max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-border/70 bg-background/80 backdrop-blur-xl text-[11px] sm:text-xs font-medium font-manrope text-muted-foreground mb-5 sm:mb-6 shadow-xs hover:border-primary/40 transition-colors"
        >
          <span className="font-manrope">Next-Gen Visual Studio</span>
          <span className="text-border">|</span>
          <span className="text-foreground font-semibold">
            100% Free & Open Source
          </span>
        </motion.div>

        {/* Main Centered Artistic Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter max-w-4xl text-balance"
        >
          Everyone will be a{" "}
          <span className="font-instrument tracking-tight font-normal text-primary">
            creator
          </span>{" "}
          with Fluidframe
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground text-wrap max-w-2xl font-manrope font-normal leading-relaxed"
        >
          The all-in-one visual studio for modern creators. Design device
          mockups, real-time WebGL mesh gradients, retro dither shaders, and
          export studio-quality images and animations in seconds.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
        >
          <Link href="/editor" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-fit sm:w-auto h-11 sm:h-12 px-5 sm:px-6 rounded-lg text-sm font-semibold font-manrope bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 cursor-pointer gap-2"
            >
              <span className="flex justify-center items-center gap-2">
                Start creating
              </span>
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-[94%] max-w-6xl mx-auto mt-10 sm:mt-14 md:mt-20 relative z-20"
      >
        <div className="absolute -inset-1.5 bg-linear-to-b from-primary/30 via-primary/5 to-transparent rounded-[20px] sm:rounded-[28px] md:rounded-[36px] blur-xl opacity-60 dark:opacity-40 -z-10" />

        <div className="w-full rounded-2xl p-1.5 sm:p-2 border border-border/80 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 backdrop-blur-2xl shadow-2xl overflow-hidden group">
          <div className="relative rounded-xl w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">
            <Image
              src="/editor-dark.png"
              alt="Fluidframe Visual Studio Workspace Interface (Dark Mode)"
              width={1919}
              height={999}
              priority
              className="hidden dark:block w-full h-auto object-cover rounded-xl transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              sizes="(max-width: 1280px) 95vw, 1200px"
            />
            <Image
              src="/editor-light.png"
              alt="Fluidframe Visual Studio Workspace Interface (Light Mode)"
              width={1919}
              height={992}
              priority
              className="block dark:hidden w-full h-auto object-cover rounded-xl transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              sizes="(max-width: 1280px) 95vw, 1200px"
            />
          </div>
        </div>
      </motion.div>

      {/* Feature Capabilities Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="w-[92%] max-w-4xl mx-auto mt-10 sm:mt-12 md:mt-16 flex flex-col items-center text-center"
      >
        <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground font-manrope font-semibold mb-4 sm:mb-5">
          Empowering creators with modern browser-native technology
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 text-[11px] sm:text-xs font-manrope font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-border/50 dark:border-neutral-800 bg-card/40">
            <CpuIcon
              className="size-3 sm:size-3.5 text-primary"
              weight="duotone"
            />
            <span>WebGL 2.0 GPU Engine</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-border/50 dark:border-neutral-800 bg-card/40">
            <StackIcon
              className="size-3 sm:size-3.5 text-primary"
              weight="duotone"
            />
            <span>Bayer Matrix Dithering</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-border/50 dark:border-neutral-800 bg-card/40">
            <VideoCameraIcon
              className="size-3 sm:size-3.5 text-primary"
              weight="duotone"
            />
            <span>Client-Side FFmpeg WASM</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-border/50 dark:border-neutral-800 bg-card/40">
            <DownloadSimpleIcon
              className="size-3 sm:size-3.5 text-primary"
              weight="bold"
            />
            <span>Lossless Snapshots</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
