"use client";

import { RefObject, useState } from "react";
import { toast } from "sonner";
import { useStore } from "../store/use-store";
import {
  captureCanvasFrames,
  captureStaticSnapshot,
} from "../utils/canvas-recorder";
import { renderFramesToMp4, renderFramesToGif } from "../utils/ffmpeg-service";

export function useExport(
  canvasRef: RefObject<HTMLDivElement | null>,
  setSelectedElementId: (id: string | null) => void,
) {
  const {
    aspectRatio,
    canvasBackground,
    meshConfig,
    exportFormat,
    exportQuality,
    exportDuration,
    exportFps,
  } = useStore();

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<string>("");

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownload = async () => {
    if (isExporting) return;
    if (!canvasRef.current) {
      toast.error("Canvas element not found.");
      return;
    }

    setSelectedElementId(null);
    setIsExporting(true);
    setExportProgress(0);

    try {
      if (exportFormat === "mp4" || exportFormat === "gif") {
        const qualityScale = Math.max(1, parseInt(exportQuality) || 2);
        const targetFps =
          exportFormat === "gif"
            ? Math.min(exportFps || 30, 30)
            : exportFps || 60;
        const isMesh =
          canvasBackground === "mesh" ||
          (!canvasBackground.startsWith("url(") &&
            !canvasBackground.startsWith("#") &&
            !canvasBackground.startsWith("rgb"));

        const safeDuration = Math.min(10, Math.max(3, exportDuration || 3));
        const safeFps = Math.min(60, Math.max(30, targetFps));
        const safeScale = Math.min(4, Math.max(1, qualityScale));

        setExportStatus("Exporting...");

        const captured = await captureCanvasFrames(canvasRef.current, {
          durationSeconds: safeDuration,
          fps: safeFps,
          scale: safeScale,
          meshConfig,
          isMeshBackground: isMesh,
          onProgress: (pct) => {
            setExportProgress(Math.round(pct * 0.45)); // 0 - 45%
          },
        });

        if (exportFormat === "mp4") {
          const mp4Blob = await renderFramesToMp4(
            captured.frames,
            captured.width,
            captured.height,
            captured.fps,
            (ffmpegPct) => {
              setExportProgress(45 + Math.round(ffmpegPct * 0.55));
            },
          );

          downloadBlob(mp4Blob, `fluidframe-video-${Date.now()}.mp4`);
          toast.success("Exported MP4 successfully!");
          return;
        }

        if (exportFormat === "gif") {
          const gifBlob = await renderFramesToGif(
            captured.frames,
            captured.width,
            captured.height,
            captured.fps,
            (ffmpegPct) => {
              setExportProgress(45 + Math.round(ffmpegPct * 0.55));
            },
          );

          downloadBlob(gifBlob, `fluidframe-animation-${Date.now()}.gif`);
          toast.success("Exported GIF successfully!");
          return;
        }
      } else {
        // Static image export (PNG, JPEG, SVG)
        const qualityScale = Math.max(1, parseInt(exportQuality) || 2);
        const isMesh =
          canvasBackground === "mesh" ||
          (!canvasBackground.startsWith("url(") &&
            !canvasBackground.startsWith("#") &&
            !canvasBackground.startsWith("rgb"));

        setExportStatus("Exporting...");

        const webglCanvasEl = canvasRef.current?.querySelector("canvas");
        const currentMeshTime =
          (webglCanvasEl as any)?.__meshRenderer?.getLastRenderTime?.() ?? 0;

        const imageBlob = await captureStaticSnapshot(canvasRef.current, {
          scale: qualityScale,
          format: exportFormat as "png" | "jpeg" | "svg",
          meshConfig,
          isMeshBackground: isMesh,
          canvasBackground,
          meshTime: currentMeshTime,
        });

        downloadBlob(
          imageBlob,
          `fluidframe-${exportFormat}-${Date.now()}.${exportFormat}`,
        );
        toast.success(`Exported ${exportFormat.toUpperCase()} successfully!`);
      }
    } catch (error: any) {
      console.error("Export failed:", error);
      toast.error(
        `Export failed: ${error?.message || "Unknown error occurred"}`,
      );
    } finally {
      setIsExporting(false);
      setExportProgress(0);
      setExportStatus("");
    }
  };

  const handleCopyToClipboard = async () => {
    if (isExporting) return;
    if (!canvasRef.current) {
      toast.error("Canvas element not found.");
      return;
    }

    setSelectedElementId(null);
    setIsExporting(true);
    setExportStatus("Copying image...");

    try {
      const qualityScale = Math.max(1, parseInt(exportQuality) || 2);
      const isMesh =
        canvasBackground === "mesh" ||
        (!canvasBackground.startsWith("url(") &&
          !canvasBackground.startsWith("#") &&
          !canvasBackground.startsWith("rgb"));

      const webglCanvasEl = canvasRef.current?.querySelector("canvas");
      const currentMeshTime =
        (webglCanvasEl as any)?.__meshRenderer?.getLastRenderTime?.() ?? 0;

      const imageBlob = await captureStaticSnapshot(canvasRef.current, {
        scale: qualityScale,
        format: "png",
        meshConfig,
        isMeshBackground: isMesh,
        canvasBackground,
        meshTime: currentMeshTime,
      });

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": imageBlob }),
        ]);
        toast.success("Image copied to clipboard");
      } else {
        downloadBlob(imageBlob, `fluidframe-snapshot-${Date.now()}.png`);
        toast.info("Clipboard write unavailable; downloaded PNG instead.");
      }
    } catch (error: any) {
      console.error("Clipboard copy failed:", error);
      toast.error(`Copy failed: ${error?.message || "Unknown error occurred"}`);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
      setExportStatus("");
    }
  };

  return {
    handleDownload,
    handleCopyToClipboard,
    isExporting,
    exportProgress,
    exportStatus,
  };
}
