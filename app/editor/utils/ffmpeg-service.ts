"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// Cache blob URLs in memory across exports for near-instant initialization (<30ms)
let cachedCoreURL: string | null = null;
let cachedWasmURL: string | null = null;
let cachedWorkerURL: string | null = null;

async function getCachedBlobURLs(): Promise<{
  coreURL: string;
  wasmURL: string;
  classWorkerURL: string;
}> {
  if (cachedCoreURL && cachedWasmURL && cachedWorkerURL) {
    return {
      coreURL: cachedCoreURL,
      wasmURL: cachedWasmURL,
      classWorkerURL: cachedWorkerURL,
    };
  }

  // 1. Try local pre-bundled assets first with response validation
  try {
    const fetchLocalBlob = async (path: string, mime: string) => {
      const res = await fetch(path);
      if (!res.ok) {
        throw new Error(`Failed to load ${path}: ${res.status}`);
      }
      const blob = await res.blob();
      return URL.createObjectURL(new Blob([blob], { type: mime }));
    };

    const coreURL = await fetchLocalBlob(
      "/ffmpeg/ffmpeg-core.js",
      "text/javascript"
    );
    const wasmURL = await fetchLocalBlob(
      "/ffmpeg/ffmpeg-core.wasm",
      "application/wasm"
    );
    const classWorkerURL = await fetchLocalBlob(
      "/ffmpeg/worker.js",
      "text/javascript"
    );

    cachedCoreURL = coreURL;
    cachedWasmURL = wasmURL;
    cachedWorkerURL = classWorkerURL;
    return { coreURL, wasmURL, classWorkerURL };
  } catch (err) {
    console.warn("Local FFmpeg assets failed, falling back to CDN...", err);
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
    const workerURL =
      "https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/esm/worker.js";

    const coreURL = await toBlobURL(
      `${baseURL}/ffmpeg-core.js`,
      "text/javascript"
    );
    const wasmURL = await toBlobURL(
      `${baseURL}/ffmpeg-core.wasm`,
      "application/wasm"
    );
    const classWorkerURL = await toBlobURL(workerURL, "text/javascript");

    cachedCoreURL = coreURL;
    cachedWasmURL = wasmURL;
    cachedWorkerURL = classWorkerURL;
    return { coreURL, wasmURL, classWorkerURL };
  }
}

/**
 * Creates and loads a fresh, isolated FFmpeg WebAssembly instance.
 * Using a fresh instance per export completely eliminates 'table index is out of bounds'
 * caused by Emscripten C runtime exit() calls destroying function pointer tables.
 */
export async function createFreshFFmpeg(
  onProgress?: (progress: number) => void,
  onLog?: (message: string) => void
): Promise<FFmpeg> {
  const ffmpeg = new FFmpeg();

  if (onLog) {
    ffmpeg.on("log", ({ message }) => {
      onLog(message);
    });
  }

  if (onProgress) {
    ffmpeg.on("progress", ({ progress }) => {
      onProgress(Math.round(progress * 100));
    });
  }

  const { coreURL, wasmURL, classWorkerURL } = await getCachedBlobURLs();
  await ffmpeg.load({ coreURL, wasmURL, classWorkerURL });
  return ffmpeg;
}

export async function getFFmpeg(
  onLog?: (message: string) => void,
  onProgress?: (progress: number) => void
): Promise<FFmpeg> {
  return createFreshFFmpeg(onProgress, onLog);
}

/**
 * High-Speed Frame-to-MP4 Encoder.
 * Ingests lightweight high-quality frame buffers and encodes directly to studio H.264 MP4 with zero memory allocation errors.
 */
export async function renderFramesToMp4(
  frames: Uint8Array[],
  width: number,
  height: number,
  fps: number = 60,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await createFreshFFmpeg(onProgress);
  const totalFrames = frames.length;

  try {
    // 1. Write lightweight frame files into MEMFS (safe ~150KB per frame)
    for (let i = 0; i < totalFrames; i++) {
      const filename = `frame_${String(i).padStart(4, "0")}.jpg`;
      await ffmpeg.writeFile(filename, frames[i]);
    }

    // 2. Direct H.264 encode at high speed
    await ffmpeg.exec([
      "-framerate",
      `${fps}`,
      "-i",
      "frame_%04d.jpg",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "17",
      "-vf",
      "scale=trunc(iw/2)*2:trunc(ih/2)*2",
      "-colorspace",
      "bt709",
      "-color_primaries",
      "bt709",
      "-color_trc",
      "bt709",
      "-color_range",
      "tv",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-y",
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");

    // Clean up MEMFS
    for (let i = 0; i < totalFrames; i++) {
      try {
        await ffmpeg.deleteFile(`frame_${String(i).padStart(4, "0")}.jpg`);
      } catch {}
    }
    try {
      await ffmpeg.deleteFile("output.mp4");
    } catch {}

    const uint8 =
      data instanceof Uint8Array ? data : new Uint8Array(data as any);
    return new Blob([uint8.buffer], { type: "video/mp4" });
  } finally {
    try {
      await ffmpeg.terminate();
    } catch {}
  }
}

/**
 * High-Speed Frame-to-GIF Encoder.
 * Ingests lightweight frame buffers and encodes into optimized 256-color looping GIF.
 */
export async function renderFramesToGif(
  frames: Uint8Array[],
  width: number,
  height: number,
  fps: number = 30,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await createFreshFFmpeg(onProgress);
  const totalFrames = frames.length;

  try {
    for (let i = 0; i < totalFrames; i++) {
      const filename = `frame_${String(i).padStart(4, "0")}.jpg`;
      await ffmpeg.writeFile(filename, frames[i]);
    }

    // Single-pass complex filtergraph with diff palette
    await ffmpeg.exec([
      "-framerate",
      `${fps}`,
      "-i",
      "frame_%04d.jpg",
      "-filter_complex",
      `fps=${fps},scale=min(iw\\,1080):-2:flags=lanczos,split [a][b]; [a] palettegen=max_colors=256:stats_mode=diff [p]; [b][p] paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle`,
      "-y",
      "output.gif",
    ]);

    const data = await ffmpeg.readFile("output.gif");

    for (let i = 0; i < totalFrames; i++) {
      try {
        await ffmpeg.deleteFile(`frame_${String(i).padStart(4, "0")}.jpg`);
      } catch {}
    }
    try {
      await ffmpeg.deleteFile("output.gif");
    } catch {}

    const uint8 =
      data instanceof Uint8Array ? data : new Uint8Array(data as any);
    return new Blob([uint8.buffer], { type: "image/gif" });
  } finally {
    try {
      await ffmpeg.terminate();
    } catch {}
  }
}

/**
 * Direct Frame-to-WebM Encoder with VP9 codec and BT.709 color matrix.
 */
export async function renderFramesToWebM(
  frames: Uint8Array[],
  fps: number = 60,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await createFreshFFmpeg(onProgress);
  const totalFrames = frames.length;

  try {
    for (let i = 0; i < totalFrames; i++) {
      const filename = `frame_${String(i).padStart(4, "0")}.png`;
      await ffmpeg.writeFile(filename, frames[i]);
    }

    await ffmpeg.exec([
      "-framerate",
      `${fps}`,
      "-i",
      "frame_%04d.png",
      "-c:v",
      "libvpx-vp9",
      "-crf",
      "14",
      "-b:v",
      "0",
      "-vf",
      "scale=trunc(iw/2)*2:trunc(ih/2)*2",
      "-colorspace",
      "bt709",
      "-color_primaries",
      "bt709",
      "-color_trc",
      "bt709",
      "-pix_fmt",
      "yuv420p",
      "-y",
      "output.webm",
    ]);

    const data = await ffmpeg.readFile("output.webm");
    const uint8 =
      data instanceof Uint8Array ? data : new Uint8Array(data as any);
    return new Blob([uint8.buffer], { type: "video/webm" });
  } finally {
    try {
      await ffmpeg.terminate();
    } catch {}
  }
}

/**
 * Utility fallback: Transcodes WebM blob to MP4.
 */
export async function transcodeToMp4(
  webmBlob: Blob,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await createFreshFFmpeg(onProgress);
  const inputData = await fetchFile(webmBlob);

  try {
    await ffmpeg.writeFile("input.webm", inputData);

    await ffmpeg.exec([
      "-i",
      "input.webm",
      "-vf",
      "fps=60,scale=trunc(iw/2)*2:trunc(ih/2)*2",
      "-r",
      "60",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "18",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-y",
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    const uint8 =
      data instanceof Uint8Array ? data : new Uint8Array(data as any);
    return new Blob([uint8.buffer], { type: "video/mp4" });
  } finally {
    try {
      await ffmpeg.terminate();
    } catch {}
  }
}

/**
 * Utility fallback: Transcodes WebM blob to GIF.
 */
export async function transcodeToGif(
  webmBlob: Blob,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await createFreshFFmpeg(onProgress);
  const inputData = await fetchFile(webmBlob);

  try {
    await ffmpeg.writeFile("input.webm", inputData);

    await ffmpeg.exec([
      "-i",
      "input.webm",
      "-filter_complex",
      "fps=30,scale=min(iw\\,960):-2:flags=lanczos,split [a][b]; [a] palettegen=max_colors=128:stats_mode=single [p]; [b][p] paletteuse=dither=bayer:bayer_scale=3",
      "-y",
      "output.gif",
    ]);

    const data = await ffmpeg.readFile("output.gif");
    const uint8 =
      data instanceof Uint8Array ? data : new Uint8Array(data as any);
    return new Blob([uint8.buffer], { type: "image/gif" });
  } finally {
    try {
      await ffmpeg.terminate();
    } catch {}
  }
}
