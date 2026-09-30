import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio Editor",
  description:
    "Design high-resolution mockups, interactive 3D device angles, fluid WebGL mesh gradient shaders, retro Bayer dither art, and export 60FPS MP4 videos and 4K graphics.",
  keywords: [
    "Fluidframe Editor",
    "WebGL Canvas Studio",
    "3D Mockup Generator",
    "Fluid Gradient Animation",
    "MP4 Video Export",
    "Bayer Dither Generator",
    "Design Studio",
  ],
  alternates: {
    canonical: "/editor",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fluidframe.vercel.app/editor",
    title: "Fluidframe Studio Editor - Visual Mockups & WebGL Shaders",
    description:
      "Design high-resolution mockups, interactive 3D device angles, fluid WebGL mesh gradient shaders, retro Bayer dither art, and export 60FPS MP4 videos.",
    siteName: "Fluidframe",
    images: [
      {
        url: "/editor.png",
        width: 1200,
        height: 630,
        alt: "Fluidframe Studio Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fluidframe Studio Editor - Visual Mockups & WebGL Shaders",
    description:
      "Design high-resolution mockups, interactive 3D device angles, fluid WebGL mesh gradient shaders, retro Bayer dither art, and export 60FPS MP4 videos.",
    creator: "@DIGVIJAY__RAWAT",
    images: ["/editor.png"],
  },
};

import { Suspense } from "react";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-background" />}>
      {children}
    </Suspense>
  );
}
