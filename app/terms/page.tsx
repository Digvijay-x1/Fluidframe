import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DitherCursor } from "@/components/landing/dither-cursor";
import { FooterPattern } from "@/components/patterns";
import {
  FileTextIcon,
  SparkleIcon,
  ShieldCheckIcon,
  ScalesIcon,
  CpuIcon,
  StackIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  GlobeIcon,
  EnvelopeSimpleIcon,
  CodeIcon,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Terms of Service & Conditions (TOC)",
  description:
    "Terms of Service & Conditions for Fluidframe. Released as open-source software under the Apache License 2.0 with full commercial rights and 100% creator ownership over your designs.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service & Conditions (TOC) | Fluidframe",
    description:
      "Review the Terms of Service & Conditions for Fluidframe. Apache 2.0 open-source license, full commercial ownership of all exported designs, and zero-knowledge browser execution.",
    url: "https://fluidframe.vercel.app/terms",
    siteName: "Fluidframe",
    type: "website",
    images: [
      {
        url: "https://fluidframe.vercel.app/landing.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Fluidframe - Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DIGVIJAY__RAWAT",
    creator: "@DIGVIJAY__RAWAT",
    title: "Terms of Service & Conditions (TOC) | Fluidframe",
    description:
      "Review the Terms of Service & Conditions for Fluidframe. Apache 2.0 open-source license, full commercial ownership of all exported designs, and zero-knowledge browser execution.",
    images: [
      {
        url: "https://fluidframe.vercel.app/landing.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Fluidframe - Terms of Service",
      },
    ],
  },
};

const TOC_SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "creator-ownership", title: "2. Creator Ownership & Commercial Rights" },
  { id: "apache-license", title: "3. Apache 2.0 Open Source Licensing" },
  { id: "client-execution", title: "4. Client-Side Execution & Hardware" },
  { id: "permissive-license", title: "5. Permitted Use & Studio Access" },
  { id: "prohibited-activities", title: "6. Prohibited Conduct & Content" },
  { id: "intellectual-property", title: "7. Trademarks & Brand Assets" },
  { id: "third-party-materials", title: "8. Third-Party Libraries & Assets" },
  { id: "disclaimer", title: "9. Disclaimer of Warranties" },
  { id: "liability", title: "10. Limitation of Liability" },
  { id: "indemnification", title: "11. Indemnification" },
  { id: "modifications", title: "12. Modifications to Terms" },
  { id: "contact-governing", title: "13. Governing Law & Contact" },
];

export default function TermsPage() {
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
            <span className="text-foreground font-medium">Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4 font-geist">
            Terms of Service & Conditions
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-manrope max-w-3xl leading-relaxed">
            Fluidframe is an open-source visual studio distributed under the <strong className="text-foreground">Apache License 2.0</strong>. You retain <strong className="text-foreground">100% intellectual property and unrestricted commercial rights</strong> over every mockup, shader artwork, image, and video animation you create.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-manrope text-muted-foreground">
            <span>Effective Date: August 2026</span>
            <span>•</span>
            <span className="text-primary font-medium flex items-center gap-1">
              <CodeIcon className="size-3.5" weight="bold" /> Apache License 2.0
            </span>
            <span>•</span>
            <span className="text-emerald-500 font-medium flex items-center gap-1">
              <CheckCircleIcon className="size-3.5" weight="fill" /> 100% Commercial Freedom
            </span>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-12 border-b border-border/40 bg-muted/20">
        <div className="w-[92%] max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md">
              <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <StackIcon className="size-4" weight="duotone" />
              </div>
              <h2 className="text-sm font-bold text-foreground mb-1">
                You Own Everything
              </h2>
              <p className="text-xs text-muted-foreground font-manrope leading-relaxed">
                Full copyright and ownership of all exported designs, mockups, shaders, and video loops.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md">
              <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                <CheckCircleIcon className="size-4" weight="duotone" />
              </div>
              <h2 className="text-sm font-bold text-foreground mb-1">
                Commercial Rights
              </h2>
              <p className="text-xs text-muted-foreground font-manrope leading-relaxed">
                Free for client work, commercial campaigns, social media, portfolios, and SaaS marketing.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md">
              <div className="size-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
                <CodeIcon className="size-4" weight="duotone" />
              </div>
              <h2 className="text-sm font-bold text-foreground mb-1">
                Apache 2.0 License
              </h2>
              <p className="text-xs text-muted-foreground font-manrope leading-relaxed">
                Open-source software distributed under the permissive Apache License, Version 2.0.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md">
              <div className="size-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                <ShieldCheckIcon className="size-4" weight="duotone" />
              </div>
              <h2 className="text-sm font-bold text-foreground mb-1">
                Zero Royalties
              </h2>
              <p className="text-xs text-muted-foreground font-manrope leading-relaxed">
                No subscription fees, paywalls, or export watermarks attached to your final outputs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Table of Contents */}
      <section className="py-16 md:py-24">
        <div className="w-[92%] max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sticky Quick-Nav Sidebar */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 font-geist flex items-center gap-2">
                <FileTextIcon className="size-3.5 text-primary" />
                <span>Table of Contents</span>
              </h3>
              <nav className="space-y-1 text-xs font-manrope">
                {TOC_SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block py-1.5 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
              <div className="mt-6 pt-4 border-t border-border/50 space-y-2">
                <a
                  href="https://github.com/Digvijay-x1/fluidframe/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1 font-manrope"
                >
                  <CodeIcon className="size-3" weight="bold" />
                  <span>View Apache 2.0 LICENSE</span>
                </a>
                <Link
                  href="/privacy"
                  className="text-xs text-muted-foreground hover:text-foreground font-medium hover:underline flex items-center gap-1 font-manrope"
                >
                  <span>Read Privacy Policy</span>
                  <ArrowRightIcon className="size-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Legal Clauses */}
          <div className="lg:col-span-8 space-y-12 text-sm text-muted-foreground font-manrope leading-relaxed">
            
            {/* Section 1 */}
            <div id="acceptance" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing, using, or interacting with <strong className="text-foreground">Fluidframe</strong> (&ldquo;fluidframe.vercel.app&rdquo;, &ldquo;the Service&rdquo;, &ldquo;the Project&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), you agree to be bound by these Terms of Service and Conditions (&ldquo;Terms&rdquo; or &ldquo;TOC&rdquo;), as well as our <Link href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link> and the applicable provisions of the <strong className="text-foreground">Apache License 2.0</strong>.
              </p>
              <p>
                If you do not agree with any provision of these Terms, you must discontinue your use of the application immediately.
              </p>
            </div>

            {/* Section 2 */}
            <div id="creator-ownership" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                2. Creator Ownership & Full Commercial Rights
              </h2>
              <p>
                We believe in total creator sovereignty. For original content and designs created by you inside Fluidframe:
              </p>
              <ul className="space-y-2 list-disc list-inside pl-1 text-foreground/90">
                <li>
                  <strong>100% Intellectual Property Ownership:</strong> You retain complete and exclusive ownership, copyright, and title to all original graphic works, device mockups, compositions, and exported media generated by you using the Service.
                </li>
                <li>
                  <strong>Full Commercial Grant:</strong> You are granted an unconditional, perpetual, worldwide, royalty-free right to use, monetize, sell, distribute, publish, and display all images, 4K snapshots, MP4 videos, GIFs, and WebM animations exported from Fluidframe for any commercial, client, educational, or personal endeavor.
                </li>
                <li>
                  <strong>Third-Party Assets Exclusion:</strong> This ownership grant applies exclusively to your original creations. Third-party content provided for demonstration or reference (such as external ImageKit-hosted sample wallpapers, Unsplash stock photos, and meme templates) remains subject to the licenses and terms of their respective copyright holders.
                </li>
                <li>
                  <strong>No Attribution Required on Exports:</strong> You are never required to provide attribution or attach Fluidframe branding to your exported creative works.
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="apache-license" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                3. Apache 2.0 Open Source Licensing
              </h2>
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <CodeIcon className="size-4" weight="bold" />
                  <span>APACHE LICENSE, VERSION 2.0</span>
                </div>
                <p className="leading-relaxed">
                  The Fluidframe application codebase is open-source software licensed under the <strong>Apache License, Version 2.0</strong> (&ldquo;the License&rdquo;).
                </p>
              </div>
              <p>
                Subject to the terms and conditions of the Apache 2.0 License:
              </p>
              <ul className="space-y-2 list-disc list-inside pl-1">
                <li>
                  <strong>Grant of Copyright License:</strong> Each contributor grants you a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare derivative works of, publicly display, publicly perform, sublicense, and distribute the Work and such derivative works in Source or Object form.
                </li>
                <li>
                  <strong>Grant of Patent License:</strong> Each contributor grants you a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work.
                </li>
                <li>
                  <strong>Redistribution Requirements:</strong> Any reproduction or distribution of the Work or derivative works must retain the copyright notice, a copy of the Apache 2.0 License, and prominent notices stating that files were changed, in compliance with Section 4 of the License.
                </li>
              </ul>
              <p className="text-xs">
                To review the full license text, please inspect the <a href="https://github.com/Digvijay-x1/fluidframe/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">LICENSE file</a> in the official GitHub repository.
              </p>
            </div>

            {/* Section 4 */}
            <div id="client-execution" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                4. Client-Side Execution & Hardware Requirements
              </h2>
              <p>
                Fluidframe is a browser-native studio utilizing WebGL 2.0, WebAssembly (FFmpeg), and Canvas rasterization technologies.
              </p>
              <p>
                Because all rendering happens locally on your machine, performance (such as export speed, frame rates, and maximum video resolution) depends on your device&apos;s hardware specifications, GPU acceleration, and web browser capabilities. We are not responsible for performance limitations caused by incompatible hardware or disabled WebGL settings.
              </p>
            </div>

            {/* Section 5 */}
            <div id="permissive-license" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                5. Permitted Use & Studio Access
              </h2>
              <p>
                You may freely access and use Fluidframe for lawful creative and design purposes. You may run the web app on any compatible browser without creating an account or paying subscription fees.
              </p>
            </div>

            {/* Section 6 */}
            <div id="prohibited-activities" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                6. Prohibited Conduct & Content
              </h2>
              <p>
                You agree not to use Fluidframe for any of the following restricted activities:
              </p>
              <ul className="space-y-1.5 list-disc list-inside pl-1">
                <li>Creating, rendering, or distributing content that is illegal, defamatory, harassing, hateful, or infringing upon another party&apos;s copyright or trademark.</li>
                <li>Attempting to disrupt, compromise, or perform denial-of-service attacks against our hosting infrastructure or CDN edge nodes.</li>
                <li>Using automated scraping tools to overburden public API endpoints or third-party integrations.</li>
                <li>Misrepresenting yourself as the creator or owner of the Fluidframe trademark or project identity.</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div id="intellectual-property" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                7. Trademarks & Brand Assets
              </h2>
              <p>
                The Apache 2.0 License does not grant permission to use the trade names, trademarks, service marks, or product names of Fluidframe or its maintainers (<strong className="text-foreground">Digvijay Rawat</strong>), except as required for reasonable and customary use in describing the origin of the Work.
              </p>
            </div>

            {/* Section 8 */}
            <div id="third-party-materials" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                8. Third-Party Libraries & Assets
              </h2>
              <p>
                Fluidframe integrates open-source libraries, including WebGL utilities, Lucide and Phosphor icons, Google Fonts, and optional Unsplash stock previews. Third-party content and libraries are subject to their respective licenses and terms of service.
              </p>
            </div>

            {/* Section 9 */}
            <div id="disclaimer" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                9. Disclaimer of Warranties
              </h2>
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
                  <WarningCircleIcon className="size-4" weight="bold" />
                  <span>&ldquo;AS IS&rdquo; & &ldquo;AS AVAILABLE&rdquo; PROVISION (SECTION 7 OF APACHE 2.0)</span>
                </div>
                <p>
                  Unless required by applicable law or agreed to in writing, the software is provided on an &ldquo;AS IS&rdquo; BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the Work.
                </p>
              </div>
            </div>

            {/* Section 10 */}
            <div id="liability" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                10. Limitation of Liability
              </h2>
              <p>
                In no event and under no legal theory, whether in tort (including negligence), contract, or otherwise, shall any contributor or maintainer be liable to you for damages, including any direct, indirect, special, incidental, or consequential damages of any character arising as a result of this License or out of the use or inability to use the Work (including loss of goodwill, work stoppage, computer failure, or loss of data).
              </p>
            </div>

            {/* Section 11 */}
            <div id="indemnification" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                11. Indemnification
              </h2>
              <p>
                You agree to defend, indemnify, and hold harmless Fluidframe, its maintainers, and community contributors from and against any claims, liabilities, damages, losses, and expenses arising from your misuse of the Service, your uploaded materials, or your violation of these Terms.
              </p>
            </div>

            {/* Section 12 */}
            <div id="modifications" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                12. Modifications to Terms
              </h2>
              <p>
                We reserve the right to revise or modify these Terms of Service at any time. When updates occur, the &ldquo;Effective Date&rdquo; at the top of this document will be updated. Your continued use of Fluidframe following any modifications constitutes acceptance of the amended terms.
              </p>
            </div>

            {/* Section 13 */}
            <div id="contact-governing" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-geist">
                13. Governing Law & Contact
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with applicable general principles of contract and intellectual property law. If you have any inquiries or proposals regarding these Terms, please reach out via our community channels:
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://github.com/Digvijay-x1/fluidframe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-all"
                >
                  <GlobeIcon className="size-3.5 text-primary" weight="duotone" />
                  <span>GitHub Repository</span>
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
            Create with total freedom and ownership.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-manrope max-w-lg mx-auto">
            Design your next 3D device mockup, WebGL shader animation, or retro dither post in seconds.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-md transition-all cursor-pointer"
            >
              <span>Open Editor</span>
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/80 bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
            >
              <span>View Privacy Policy</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
