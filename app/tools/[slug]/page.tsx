import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  SparkleIcon,
  ShieldCheckIcon,
  LightningIcon,
  CpuIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

interface ToolConfig {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heading: string;
  subheading: string;
  templateId: string;
  features: string[];
  faqs: { question: string; answer: string }[];
}

const TOOLS: Record<string, ToolConfig> = {
  "screenshot-mockup-generator": {
    slug: "screenshot-mockup-generator",
    title: "3D Screenshot Mockup Generator",
    metaTitle: "Free 3D Screenshot Mockup Generator for Developers & Creators | Fluidframe",
    metaDescription:
      "Transform flat app screenshots into beautiful 3D isometric mockups with fluid WebGL gradients, shadow presets, and 4K exports. 100% free & client-side.",
    heading: "The Ultimate 3D Screenshot Mockup Generator",
    subheading:
      "Elevate your side-projects, app launches, and documentation. Paste any screenshot and generate perspective 3D mockups in seconds with zero design skills.",
    templateId: "saas-3d-perspective",
    features: [
      "Full 3-axis rotation (rotateX, rotateY, rotateZ) for isometric product showcases",
      "Instant Ctrl+V clipboard screenshot paste directly onto the canvas",
      "Realistic frosted glassmorphism backdrops and studio lighting shadows",
      "Export 4K Retina PNGs or 60 FPS MP4 video animations directly in-browser",
    ],
    faqs: [
      {
        question: "Is Fluidframe screenshot mockup generator really free?",
        answer:
          "Yes! Fluidframe is 100% free and open-source. All rendering and WebGL shaders run client-side on your device via WebAssembly.",
      },
      {
        question: "Can I paste screenshots directly from my clipboard?",
        answer:
          "Yes. Simply copy any screenshot to your clipboard (e.g. Win+Shift+S or Cmd+Shift+4) and press Ctrl+V inside Fluidframe to immediately insert it as a layer.",
      },
    ],
  },
  "code-snippet-mockup": {
    slug: "code-snippet-mockup",
    title: "Code Snippet & Terminal Beautifier",
    metaTitle: "Code Snippet Mockup & Terminal Beautifier (Ray.so Alternative) | Fluidframe",
    metaDescription:
      "Generate beautiful syntax-highlighted code images and macOS terminal mockups. Customize themes, line numbers, 3D tilt, and export 4K graphics.",
    heading: "Turn Code Snippets into Studio 3D Art",
    subheading:
      "Showcase your source code, CLI output, and GitHub algorithms with sleek syntax themes, macOS traffic light chrome, and floating fluid mesh gradients.",
    templateId: "terminal-cli-ray",
    features: [
      "Curated themes: Tokyo Night, One Dark Pro, Dracula, GitHub Dark, and Monokai",
      "macOS traffic light window controls and toggleable line numbers",
      "3D perspective rotation to give code blocks dimensional depth",
      "One-click 'Copy Image to Clipboard' for instant sharing to Twitter/X and Discord",
    ],
    faqs: [
      {
        question: "How does Fluidframe compare to Ray.so or Carbon?",
        answer:
          "Fluidframe supports full 3D perspective transforms, animated 60 FPS WebGL fluid gradients, and retro dither shaders that static snippet tools cannot match.",
      },
      {
        question: "Which programming languages are highlighted?",
        answer:
          "JavaScript, TypeScript, Python, Rust, Go, HTML, CSS, Bash, and all popular languages are automatically formatted with custom token highlights.",
      },
    ],
  },
  "github-readme-banner-maker": {
    slug: "github-readme-banner-maker",
    title: "GitHub Readme Banner Maker",
    metaTitle: "Free GitHub Readme Banner & Hero Generator for Developers | Fluidframe",
    metaDescription:
      "Design high-voltage GitHub Readme banners and open-source project hero cards. Add code previews, tech stack badges, and dark mesh gradients.",
    heading: "Design High-Impact GitHub Readme Banners",
    subheading:
      "Make your open-source projects stand out on GitHub. Generate 1280x640 repository banners with tech stack icons, code highlights, and cyber-precision aesthetics.",
    templateId: "github-hero",
    features: [
      "Exact 2:1 and GitHub Banner aspect ratios (1280x640) ready to drop into README.md",
      "Integrated tech stack icon rows with Next.js, React, Tailwind, Python, and PostgreSQL",
      "Dark obsidian and cyber mesh gradient backdrops with blueprint grids",
      "Direct markdown copy badge to boost repository credibility and backlinks",
    ],
    faqs: [
      {
        question: "What is the recommended size for a GitHub Readme header?",
        answer:
          "1280x640 pixels (2:1 aspect ratio) is the gold standard for crisp rendering on high-DPI Retina laptop screens and mobile devices.",
      },
      {
        question: "How do I embed my banner into GitHub README.md?",
        answer:
          "Export your banner from Fluidframe as a 4K PNG, place it in your repository's assets folder, and link it with ![Project Banner](assets/banner.png).",
      },
    ],
  },
  "3d-device-mockup": {
    slug: "3d-device-mockup",
    title: "3D Device Mockup Studio",
    metaTitle: "3D Device Mockup Studio - iPhone, MacBook & Browser Frames | Fluidframe",
    metaDescription:
      "Create 3D isometric device mockups for iPhone 16 Pro, MacBook Pro, and browser frames. Real-time shader lighting, glassmorphism, and zero cloud delay.",
    heading: "3D Device Mockups Without Blender or Figma",
    subheading:
      "Showcase mobile apps and web platforms inside realistic hardware frames and perspective angles. Perfect for Product Hunt, portfolio sites, and client decks.",
    templateId: "saas-3d-perspective",
    features: [
      "Instant clip-paths: Clean Browser Window, Mobile Screen, Pill, and Hexagon",
      "Realistic diffuse drop shadows and Apple-style studio elevation lighting",
      "Combine multiple device layers in one scene with independent 3D tilt",
      "Client-side WASM encoding renders 60 FPS animated walkthroughs in seconds",
    ],
    faqs: [
      {
        question: "Do I need to install Blender or 3D software?",
        answer:
          "No! Fluidframe runs hardware-accelerated 3D transforms directly in your browser using pure CSS 3D and WebGL.",
      },
      {
        question: "Can I use Fluidframe mockups for commercial products?",
        answer:
          "Yes. All graphics created on Fluidframe are 100% royalty-free for commercial and personal usage.",
      },
    ],
  },
  "bayer-dithering-generator": {
    slug: "bayer-dithering-generator",
    title: "Online Bayer Dithering & Retro Shader",
    metaTitle: "Online Bayer Dithering Generator & Retro Pixel Art Studio | Fluidframe",
    metaDescription:
      "Convert screenshots and photos into retro 90s Bayer dither graphics. Custom 2x2, 4x4, 8x8 matrices, dual-tone color mapping, and GLSL shaders.",
    heading: "Hardware-Accelerated Bayer Dithering Studio",
    subheading:
      "Give your digital art, app mockups, and wallpapers an authentic 90s cyberpunk aesthetic with hardware-accelerated ordered Bayer matrices.",
    templateId: "retro-bayer-dither",
    features: [
      "Multiple matrix modes: Ordered Bayer 2x2, 4x4, 8x8, and stochastic noise dithering",
      "Custom dual-tone foreground and background hex color mapping",
      "Pixel size, color quantization steps, and dithering strength sliders",
      "Tactile texture overlays: Scanlines, grain, dust, and diagonal hatch patterns",
    ],
    faqs: [
      {
        question: "What is Bayer dithering?",
        answer:
          "Bayer dithering is an ordered thresholding algorithm that approximates continuous tones using discrete color palettes and geometric cross-hatch matrices.",
      },
      {
        question: "Does the dithering effect export to video?",
        answer:
          "Yes! Fluidframe's WebGL shader pipeline renders the animated dither matrix into 60 FPS MP4 videos or optimized GIFs.",
      },
    ],
  },
  "webgl-gradient-generator": {
    slug: "webgl-gradient-generator",
    title: "Real-Time WebGL Fluid Mesh Gradient Maker",
    metaTitle: "WebGL Fluid Mesh Gradient Generator & Video Maker | Fluidframe",
    metaDescription:
      "Create hypnotic, flowing multi-color WebGL fluid mesh gradients. Customize wave frequency, noise intensity, and render 60 FPS MP4 video loops.",
    heading: "Real-Time WebGL Fluid Mesh Gradient Studio",
    subheading:
      "Synthesize liquid color harmonies with custom GLSL vertex and fragment shaders. Export high-res wallpapers or smooth looping background videos.",
    templateId: "product-hunt-launch",
    features: [
      "5-point fluid color synthesis running on dedicated GPU shaders",
      "Curated palettes: Chrome, Sunset Silk, Aurora, Velvet Noir, Vaporwave, and Deep Ocean",
      "Interactive shader speed, wave turbulence, and perlin noise controls",
      "Export as 4K desktop wallpapers or seamless 60 FPS H.264 MP4 videos",
    ],
    faqs: [
      {
        question: "Does this require a powerful GPU?",
        answer:
          "Fluidframe's GLSL shaders are highly optimized to run smoothly even on integrated laptop graphics and mobile browsers.",
      },
      {
        question: "Can I use these gradients as background videos?",
        answer:
          "Yes. Export directly as an MP4 video (3–10s loop) and use it as a hero background video on your website.",
      },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(TOOLS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLS[slug];
  if (!tool) return notFound();

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: `https://fluidframe.fun/tools/${tool.slug}`,
      images: [{ url: "https://fluidframe.fun/landing.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.metaTitle,
      description: tool.metaDescription,
      images: ["https://fluidframe.fun/landing.png"],
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = TOOLS[slug];
  if (!tool) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.title,
        applicationCategory: "DesignApplication",
        operatingSystem: "All",
        url: `https://fluidframe.fun/tools/${tool.slug}`,
        description: tool.metaDescription,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "128",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: tool.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <section className="pt-32 pb-16 px-4 md:pt-40 md:pb-24 max-w-5xl mx-auto w-full flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border/80 bg-muted/60 text-xs font-semibold text-primary mb-5 shadow-xs">
          <SparkleIcon className="size-3.5" />
          <span>Free Online Studio</span>
          <span>•</span>
          <span className="text-foreground">Zero Login Required</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tighter max-w-4xl text-balance">
          {tool.heading}
        </h1>

        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl font-manrope leading-relaxed">
          {tool.subheading}
        </p>

        {/* CTA Button */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
          <Link href={`/editor?template=${tool.templateId}`}>
            <Button
              size="lg"
              className="h-12 px-8 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 cursor-pointer gap-2"
            >
              <span>Launch Studio Free</span>
              <ArrowRightIcon className="size-4" />
            </Button>
          </Link>
          <Link href="/templates">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-6 rounded-lg text-sm font-semibold border-border/80 hover:bg-muted text-foreground cursor-pointer"
            >
              <span>Browse All Templates</span>
            </Button>
          </Link>
        </div>

        {/* Features Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-16 text-left">
          {tool.features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-xl border border-border/80 bg-card/50 backdrop-blur-md"
            >
              <CheckCircleIcon className="size-5 text-primary shrink-0 mt-0.5" weight="fill" />
              <span className="text-sm font-medium text-foreground leading-snug">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="w-full mt-20 text-left">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {tool.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-border/80 bg-card/60 space-y-2"
              >
                <h3 className="text-base font-semibold text-foreground">
                  {faq.question}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
