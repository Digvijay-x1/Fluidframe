import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fluidframe - Visual Mockup & WebGL Studio",
    short_name: "Fluidframe",
    description:
      "Design stunning 3D device mockups, real-time WebGL fluid gradient shaders, retro Bayer dither art, and export broadcast-quality 60FPS MP4 videos.",
    start_url: "/editor",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
