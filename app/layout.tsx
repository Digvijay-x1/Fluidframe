import type { Metadata } from "next";
import {
  Space_Grotesk as Space,
  Inter,
  Manrope,
  Roboto,
  Instrument_Serif,
  Poppins,
  Playfair_Display as Playfair,
  Oswald,
  Montserrat,
  Geist,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { Provider } from "@/components/provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const space = Space({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
});

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const playfair = Playfair({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fluidframe.vercel.app"),
  title: {
    default: "Fluidframe - 3D Screenshot Mockups & WebGL Studio for Developers",
    template: "%s | Fluidframe",
  },
  description:
    "The premier visual studio for developers and creators. Create 3D isometric screenshot mockups, real-time WebGL fluid mesh gradients, terminal code highlights, and retro Bayer dither art.",
  keywords: [
    "screenshot mockup generator",
    "3D device mockup",
    "github readme banner generator",
    "code snippet mockup",
    "terminal beautifier",
    "ray so alternative",
    "bayer dithering generator",
    "webgl mesh gradient",
    "product hunt launch mockup",
    "dither art generator",
    "MP4 animation creator",
    "developer portfolio mockup",
  ],
  authors: [
    { name: "Digvijay Rawat" },
    { name: "Fluidframe", url: "https://fluidframe.vercel.app" },
  ],
  creator: "Fluidframe",
  publisher: "Fluidframe",
  category: "Design & Developer Tools",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fluidframe.vercel.app/",
    title: "Fluidframe - 3D Screenshot Mockups & WebGL Studio for Developers",
    description:
      "The premier visual studio for developers and creators. Create 3D isometric screenshot mockups, real-time WebGL fluid mesh gradients, and retro Bayer dither art.",
    siteName: "Fluidframe",
    images: [
      {
        url: "https://fluidframe.vercel.app/landing.png",
        secureUrl: "https://fluidframe.vercel.app/landing.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Fluidframe - 3D Screenshot Mockups & WebGL Studio for Developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DIGVIJAY__RAWAT",
    creator: "@DIGVIJAY__RAWAT",
    title: "Fluidframe - 3D Screenshot Mockups & WebGL Studio for Developers",
    description:
      "The premier visual studio for developers and creators. Create 3D isometric screenshot mockups, real-time WebGL fluid mesh gradients, and retro Bayer dither art.",
    images: [
      {
        url: "https://fluidframe.vercel.app/landing.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Fluidframe - 3D Screenshot Mockups & WebGL Studio for Developers",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "twitter:card": "summary_large_image",
    "twitter:site": "@DIGVIJAY__RAWAT",
    "twitter:creator": "@DIGVIJAY__RAWAT",
    "twitter:url": "https://fluidframe.vercel.app/",
    "twitter:image": "https://fluidframe.vercel.app/landing.png",
    "twitter:image:alt":
      "Fluidframe - 3D Screenshot Mockups & WebGL Studio for Developers",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://fluidframe.vercel.app/#webapp",
      name: "Fluidframe",
      url: "https://fluidframe.vercel.app",
      applicationCategory: "DesignApplication",
      operatingSystem: "All",
      description:
        "The premier visual studio for developers and creators. Create 3D isometric screenshot mockups, real-time WebGL fluid mesh gradients, terminal code highlights, and retro Bayer dither art.",
      browserRequirements: "Requires WebGL support",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "142",
      },
      featureList: [
        "3D Device Mockup Generation",
        "Syntax Highlighted Code & Terminal Layers",
        "Real-Time WebGL Fluid Mesh Shaders",
        "Retro Bayer Matrix Dithering",
        "Client-Side WASM 60 FPS MP4 & GIF Rendering",
        "Curated Ready-to-Use Templates",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://fluidframe.vercel.app/#organization",
      name: "Fluidframe",
      url: "https://fluidframe.vercel.app",
      logo: "https://fluidframe.vercel.app/landing.png",
      sameAs: [
        "https://x.com/DIGVIJAY__RAWAT",
        "https://github.com/Digvijay-x1/fluidframe",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth" lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`
          ${inter.variable} 
          ${geist.variable}
          ${manrope.variable} 
          ${space.variable} 
          ${roboto.variable}
          ${instrument.variable}
          ${poppins.variable}
          ${playfair.variable}
          ${oswald.variable}
          ${montserrat.variable}
          antialiased
        `}
      >
        <Provider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="bg-background text-foreground font-geist">
            {children}
          </main>
          <Toaster position="top-center" swipeDirections={["right"]} />
          <Analytics />
        </Provider>
      </body>
    </html>
  );
}
