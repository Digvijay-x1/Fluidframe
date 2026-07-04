import { Metadata } from "next";
import Link from "next/link";
import { BUILTIN_TEMPLATES } from "../editor/templates/presets-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Free 3D Mockup & Showcase Templates for Developers & Creators",
  description:
    "Browse ready-to-use 3D mockup templates for GitHub Readmes, Product Hunt launches, code screenshots, mobile apps, and social posts. Free and 100% editable in your browser.",
  alternates: {
    canonical: "/templates",
  },
  openGraph: {
    title: "Free 3D Mockup & Showcase Templates - Fluidframe",
    description:
      "Instant 3D mockup templates for GitHub Readme banners, Product Hunt launches, terminal CLI shots, and SaaS marketing heroes.",
    url: "https://fluidframe.fun/templates",
    images: [{ url: "https://fluidframe.fun/landing.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free 3D Mockup Templates - Fluidframe",
    description:
      "Instant 3D mockup templates for GitHub Readme banners, Product Hunt launches, and code snippets.",
    images: ["https://fluidframe.fun/landing.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Fluidframe Design & Mockup Templates Library",
  description:
    "Curated collection of 3D screenshot mockup templates, GitHub Readme heroes, Product Hunt launch graphics, and terminal code showcase presets.",
  url: "https://fluidframe.fun/templates",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: BUILTIN_TEMPLATES.map((tpl, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tpl.title,
      description: tpl.description,
      url: `https://fluidframe.fun/editor?template=${tpl.id}`,
    })),
  },
};

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <section className="pt-32 pb-16 px-4 md:pt-40 md:pb-24 max-w-6xl mx-auto w-full flex flex-col items-center text-center">

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tighter max-w-4xl text-balance">
          Studio-Grade Templates for{" "}
          <span className="text-primary font-instrument font-normal">
            Developers & Creators
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl font-manrope leading-relaxed">
          Skip the blank canvas. Pick a pre-configured template tailored for GitHub Readme banners, Product Hunt launch galleries, code snippets, and social changelogs.
        </p>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-14 text-left">
          {BUILTIN_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="group rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-5 hover:border-primary/60 transition-all shadow-xs hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs uppercase font-mono px-2.5 py-1 rounded-md bg-muted text-foreground font-semibold">
                    {template.category}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {template.elements.length} Cards • {template.aspectRatio?.name || "16:9"}
                  </span>
                </div>

                {/* 100% Accurate Visual Formation Preview */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-950/90 border border-border/80 mb-4 shadow-inner group-hover:border-primary/50 transition-colors flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:10px_10px] opacity-70 pointer-events-none" />
                  <div
                    className="absolute top-0 left-0 pointer-events-none origin-top-left"
                    style={{
                      width: 960,
                      height: 540,
                      transform: "scale(0.34)",
                      transformStyle: "preserve-3d",
                      perspective: "2000px",
                    }}
                  >
                    {template.elements.map((el, idx) => {
                      if (el.type !== "image") return null;
                      const img = el as any;
                      const cardW = img.width || 260;
                      const cardH = img.height || 380;
                      return (
                        <div
                          key={img.id || idx}
                          className="absolute flex flex-col items-center justify-center"
                          style={{
                            left: `${img.position.x}px`,
                            top: `${img.position.y}px`,
                            width: `${cardW}px`,
                            height: `${cardH}px`,
                            transformStyle: "preserve-3d",
                            transform: `
                              rotateX(${img.style.rotateX}deg)
                              rotateY(${img.style.rotateY}deg)
                              rotateZ(${img.style.rotate}deg)
                              scale(${img.style.scale / 100})
                            `,
                            borderRadius: `${img.style.borderRadius || 16}px`,
                            background:
                              "linear-gradient(145deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.04))",
                            backdropFilter: "blur(12px)",
                            border: "2px dashed rgba(255, 255, 255, 0.4)",
                            boxShadow:
                              img.style.shadow || "0 25px 50px -12px rgba(0,0,0,0.65)",
                            opacity: (img.style.opacity || 100) / 100,
                            zIndex: idx + 1,
                          }}
                        >
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="size-16 rounded-full bg-white/15 border-2 border-white/40 flex items-center justify-center text-white mb-2 shadow-xl">
                              <PlusIcon size={32} weight="bold" />
                            </div>
                            <span className="text-sm font-bold text-white/90 font-manrope">
                              {img.placeholderLabel || img.name || "Slot"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors mb-2">
                  {template.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {template.description}
                </p>

                {template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded-sm bg-muted/70 text-muted-foreground font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {template.elements.length} customizable layers
                </span>
                <Link href={`/editor?template=${template.id}`}>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4 rounded-lg cursor-pointer shadow-sm"
                  >
                    Edit in Studio →
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
