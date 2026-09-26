import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DitherCursor } from "@/components/landing/dither-cursor";
import { FooterPattern } from "@/components/patterns";
import {
  ShieldCheckIcon,
  LockSimpleIcon,
  EyeSlashIcon,
  HardDriveIcon,
  ChartBarIcon,
  GlobeIcon,
  SparkleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  FileTextIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn about Fluidframe's commitment to zero-knowledge privacy. 100% client-side WebGL visual mockup studio where your files, images, and creations never leave your browser.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Fluidframe",
    description:
      "Fluidframe is built with a zero-knowledge architecture. All mockup rendering, shader computations, and media exports happen 100% client-side in your browser.",
    url: "https://fluidframe.vercel.app/privacy",
    siteName: "Fluidframe",
    type: "website",
    images: [
      {
        url: "https://fluidframe.vercel.app/landing.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Fluidframe - Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DIGVIJAY__RAWAT",
    creator: "@DIGVIJAY__RAWAT",
    title: "Privacy Policy | Fluidframe",
    description:
      "Fluidframe is built with a zero-knowledge architecture. All mockup rendering, shader computations, and media exports happen 100% client-side in your browser.",
    images: [
      {
        url: "https://fluidframe.vercel.app/landing.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Fluidframe - Privacy Policy",
      },
    ],
  },
};

const PRIVACY_SECTIONS = [
  { id: "zero-knowledge", title: "1. Zero-Knowledge Architecture" },
  { id: "information-not-collected", title: "2. Information We Never Collect" },
  { id: "local-storage", title: "3. Local Browser Storage & Presets" },
  { id: "analytics", title: "4. Telemetry & Analytics" },
  { id: "third-party", title: "5. Third-Party Integrations & APIs" },
  { id: "data-security", title: "6. Security & GPU Processing" },
  { id: "user-rights", title: "7. Your Rights (GDPR & CCPA)" },
  { id: "children", title: "8. Children's Privacy" },
  { id: "policy-changes", title: "9. Updates to this Policy" },
  { id: "contact", title: "10. Contact Information" },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col relative overflow-hidden">
      <DitherCursor />
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-14 md:pt-40 md:pb-20 border-b border-border/50">
        <FooterPattern />
        <div className="w-[92%] max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs font-manrope text-muted-foreground mb-4">
            <Link
              href="/"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeftIcon className="size-3" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4 font-geist">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-manrope max-w-3xl leading-relaxed">
            Fluidframe is engineered with a strict <strong className="text-foreground">client-first, zero-knowledge architecture</strong>.
            Your uploads, textures, mockup designs, and video exports are processed entirely in your browser memory and never leave your machine.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-manrope text-muted-foreground">
            <span>Last Updated: August 2026</span>
            <span>•</span>
            <a
              href="https://github.com/Digvijay-x1/fluidframe/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline flex items-center gap-1"
            >
              <FileTextIcon className="size-3.5" />
              <span>Apache License 2.0</span>
            </a>
            <span>•</span>
            <span className="text-emerald-500 font-medium flex items-center gap-1">
              <CheckCircleIcon className="size-3.5" weight="fill" /> No Server Database Tracking
            </span>
          </div>
        </div>
      </section>

      {/* Key Guarantees Grid */}
      <section className="py-12 border-b border-border/40 bg-muted/20">
        <div className="w-[92%] max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md">
              <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                <LockSimpleIcon className="size-4" weight="duotone" />
              </div>
              <h2 className="text-sm font-bold text-foreground mb-1">
                Zero Cloud Uploads
              </h2>
              <p className="text-xs text-muted-foreground font-manrope leading-relaxed">
                Images, screenshots, and visual assets are decoded in memory using Canvas/WebGL APIs.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md">
              <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <EyeSlashIcon className="size-4" weight="duotone" />
              </div>
              <h2 className="text-sm font-bold text-foreground mb-1">
                No User Profiling
              </h2>
              <p className="text-xs text-muted-foreground font-manrope leading-relaxed">
                We never build behavioral profiles, sell user data, or run third-party advertising trackers.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md">
              <div className="size-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
                <HardDriveIcon className="size-4" weight="duotone" />
              </div>
              <h2 className="text-sm font-bold text-foreground mb-1">
                Local Device Storage
              </h2>
              <p className="text-xs text-muted-foreground font-manrope leading-relaxed">
                Drafts and settings persist exclusively in your browser’s IndexedDB and LocalStorage.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md">
              <div className="size-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
                <ChartBarIcon className="size-4" weight="duotone" />
              </div>
              <h2 className="text-sm font-bold text-foreground mb-1">
                Privacy-First Analytics
              </h2>
              <p className="text-xs text-muted-foreground font-manrope leading-relaxed">
                Anonymized, aggregate performance data via Vercel Web Analytics without personal identifiers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Table of Contents */}
      <section className="py-16 md:py-24">
        <div className="w-[92%] max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sticky Table of Contents on Desktop */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 font-geist flex items-center gap-2">
                <FileTextIcon className="size-3.5 text-primary" />
                <span>On This Page</span>
              </h3>
              <nav className="space-y-1 text-xs font-manrope">
                {PRIVACY_SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block py-1.5 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
              <div className="mt-6 pt-4 border-t border-border/50">
                <Link
                  href="/terms"
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1 font-manrope"
                >
                  <span>Read Terms of Service</span>
                  <ArrowRightIcon className="size-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Legal Clauses & Details */}
          <div className="lg:col-span-8 space-y-12 text-sm text-muted-foreground font-manrope leading-relaxed">
            
            {/* Section 1 */}
            <div id="zero-knowledge" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                1. Zero-Knowledge Architecture
              </h2>
              <p>
                Fluidframe (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the platform&rdquo;) is built from the ground up as a decentralized, browser-native visual editing tool. Our architectural philosophy centers on absolute data isolation: <strong>your artwork is exclusively yours</strong>.
              </p>
              <p>
                When you load 3D device frames, apply Bayer dithering shaders, adjust WebGL fluid gradients, or render high-resolution 4K images and 60 FPS MP4 video animations, all calculations are executed directly on your client hardware via your Graphics Processing Unit (GPU) and HTML5 Canvas APIs.
              </p>
              <div className="p-4 rounded-xl border border-border/60 bg-muted/30 text-xs">
                <p className="font-semibold text-foreground mb-1">
                  Key Takeaway:
                </p>
                <p>
                  At no point during the editing, styling, rendering, or downloading workflow are your source images or rendered outputs transmitted across the network to our servers.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div id="information-not-collected" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                2. Information We Never Collect
              </h2>
              <p>
                To provide complete transparency, we explicitly define the categories of sensitive information that Fluidframe does not collect, record, or intercept:
              </p>
              <ul className="space-y-2 list-disc list-inside pl-1 text-foreground/90">
                <li><strong>Uploaded Images & Assets:</strong> Screenshots, photos, branding logos, and mockup inputs stay in RAM.</li>
                <li><strong>Exported Media Files:</strong> PNGs, JPEGs, MP4 video streams, and WebM exports are synthesized in-browser.</li>
                <li><strong>Canvas Compositions:</strong> Coordinates, layer positions, text contents, and custom color palettes.</li>
                <li><strong>Personal Identity Records:</strong> Names, home addresses, phone numbers, or government identifiers.</li>
                <li><strong>Biometric or Private Hardware Signatures:</strong> We do not fingerprint your hardware for tracking purposes.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="local-storage" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                3. Local Browser Storage & Presets
              </h2>
              <p>
                Fluidframe uses standard web browser storage mechanisms to save your working state and streamline your user experience without requiring an external user account:
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-lg border border-border/50 bg-background/50">
                  <p className="font-semibold text-foreground text-xs">LocalStorage</p>
                  <p className="text-xs mt-0.5">
                    Used to remember your theme preference (Dark / Light / System) and UI layout preferences.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-border/50 bg-background/50">
                  <p className="font-semibold text-foreground text-xs">IndexedDB & Session Memory</p>
                  <p className="text-xs mt-0.5">
                    Used for temporary draft canvas caching so your project does not reset if you accidentally reload the tab.
                  </p>
                </div>
              </div>
              <p className="text-xs">
                You have complete control over this data. You can erase all local presets at any time by clearing your browser cookies and site data for <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[11px]">fluidframe.vercel.app</code>.
              </p>
            </div>

            {/* Section 4 */}
            <div id="analytics" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                4. Telemetry & Analytics
              </h2>
              <p>
                We use <strong className="text-foreground">Vercel Web Analytics</strong> to monitor overall system stability, platform health, and page visit volumes.
              </p>
              <p>
                Vercel Web Analytics is privacy-friendly by design:
              </p>
              <ul className="space-y-1.5 list-disc list-inside pl-1">
                <li>It does not use third-party cookies or persistent tracking IDs.</li>
                <li>IP addresses are immediately anonymized and discarded.</li>
                <li>Metrics gathered include aggregate page load speed, referrers, device categories (mobile vs. desktop), and country-level geographic aggregates.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div id="third-party" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                5. Third-Party Integrations & APIs
              </h2>
              <p>
                Fluidframe connects to certain public resources to enhance functionality:
              </p>
              <ul className="space-y-2 list-disc list-inside pl-1">
                <li>
                  <strong className="text-foreground">Google Fonts:</strong> Typography font faces are served via Google Fonts to render typography in the canvas.
                </li>
                <li>
                  <strong className="text-foreground">Unsplash:</strong> If you select sample stock imagery or background wallpapers, preview images are fetched from Unsplash subject to their API terms.
                </li>
                <li>
                  <strong className="text-foreground">GitHub & Social Links:</strong> Outbound links to our GitHub repository and social channels are governed by their respective privacy policies.
                </li>
              </ul>
            </div>

            {/* Section 6 */}
            <div id="data-security" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                6. Security & GPU Processing
              </h2>
              <p>
                All communications between your browser and Fluidframe are secured using modern Transport Layer Security (TLS 1.3 / HTTPS encryption). WebGL shaders, FFmpeg WebAssembly modules, and canvas rasterizers operate in isolated browser sandbox environments provided by your web browser.
              </p>
            </div>

            {/* Section 7 */}
            <div id="user-rights" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                7. Your Rights (GDPR & CCPA)
              </h2>
              <p>
                Because Fluidframe does not collect personal records, user identities, or canvas artwork on servers, there is no remote database from which your personal information could be extracted, sold, or shared.
              </p>
              <p>
                Under European GDPR and California CCPA guidelines:
              </p>
              <ul className="space-y-1.5 list-disc list-inside pl-1">
                <li><strong>Right of Access & Portability:</strong> All created assets are stored directly on your machine and can be exported at any time.</li>
                <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> You can wipe all local storage data directly in your browser preferences.</li>
                <li><strong>No Sale of Personal Data:</strong> We do not sell, rent, or trade your information to third parties.</li>
              </ul>
            </div>

            {/* Section 8 */}
            <div id="children" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                8. Children&apos;s Privacy
              </h2>
              <p>
                Fluidframe is a general audience creative studio. We do not knowingly collect or solicit any personal information from children under the age of 13 (or under 16 in certain jurisdictions).
              </p>
            </div>

            {/* Section 9 */}
            <div id="policy-changes" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                9. Updates to this Policy
              </h2>
              <p>
                We may periodically update this Privacy Policy to reflect improvements to our platform or changes in regulatory standards. Any revisions will be posted on this page with an updated revision date.
              </p>
            </div>

            {/* Section 10 */}
            <div id="contact" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                10. Contact Information
              </h2>
              <p>
                If you have questions, feedback, or privacy-related inquiries regarding Fluidframe, please connect with us through our public repository or developer contact channels:
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://github.com/Digvijay-x1/fluidframe/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-all"
                >
                  <GlobeIcon className="size-3.5 text-primary" weight="duotone" />
                  <span>GitHub Issues & Discussions</span>
                </a>
                <a
                  href="https://x.com/DIGVIJAY__RAWAT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-all"
                >
                  <EnvelopeSimpleIcon className="size-3.5 text-emerald-500" weight="duotone" />
                  <span>Contact the Developer</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-24 bg-card/30">
        <div className="w-[92%] max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-geist">
            Ready to design private, high-impact mockups?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-manrope max-w-lg mx-auto">
            Experience zero-latency WebGL shaders and device mockups running entirely on your machine.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-md transition-all cursor-pointer"
            >
              <span>Open Editor</span>
            </Link>
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/80 bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
            >
              <span>View Terms of Service</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
