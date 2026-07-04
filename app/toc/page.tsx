import type { Metadata } from "next";
import TermsPage from "@/app/terms/page";

export const metadata: Metadata = {
  title: "Terms and Conditions (TOC)",
  description:
    "Terms of Service & Conditions for Fluidframe. Enjoy full commercial rights, 100% creator ownership over your designs, and zero-latency client-side WebGL studio tooling.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms and Conditions (TOC) | Fluidframe",
    description:
      "Review the Terms and Conditions for Fluidframe. Full commercial ownership of all exported designs, zero-knowledge browser execution, and open creative freedom.",
    url: "https://fluidframe.fun/terms",
    siteName: "Fluidframe",
    type: "website",
    images: [
      {
        url: "https://fluidframe.fun/landing.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Fluidframe - Terms and Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DIGVIJAY__RAWAT",
    creator: "@DIGVIJAY__RAWAT",
    title: "Terms and Conditions (TOC) | Fluidframe",
    description:
      "Review the Terms and Conditions for Fluidframe. Full commercial ownership of all exported designs, zero-knowledge browser execution, and open creative freedom.",
    images: [
      {
        url: "https://fluidframe.fun/landing.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Fluidframe - Terms and Conditions",
      },
    ],
  },
};

export default function TOCPage() {
  return <TermsPage />;
}
