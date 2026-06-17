import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { BentoGrid } from "@/components/bentogrid";
import { FAQ } from "@/components/faq";
import { Support } from "@/components/support";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { DitherCursor } from "@/components/landing/dither-cursor";

export const metadata: Metadata = {
  title: "Fluidframe - 3D Screenshot Mockups & Visual Studio for Developers",
  description:
    "Turn code snippets, screenshots, and side-projects into studio-grade 3D device mockups, real-time WebGL mesh gradients, and retro Bayer dither art in seconds. 100% free & client-side.",
  alternates: {
    canonical: "https://fluidframe.fun",
  },
};

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground transition-colors duration-300 flex flex-col relative overflow-hidden">
      <DitherCursor />
      <Navbar />
      <Hero />

      <BentoGrid />
      <FAQ />
      <Support />

      <Footer />
    </main>
  );
}

export default App;
