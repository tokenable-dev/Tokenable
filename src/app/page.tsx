import type { Metadata, Viewport } from "next";
import { LandingShell } from "@/components/landing/LandingShell";
import "./landing.css";

export const metadata: Metadata = {
  title: "Tokenable",
  description:
    "Authenticated, vaulted collectibles you can own in whole or in part. Tokenize and trade art, sports, and memorabilia on a compliant marketplace.",
  keywords: [
    "tokenized collectibles",
    "fractional ownership",
    "vaulted assets",
    "sports cards",
    "art investing",
  ],
  openGraph: {
    title: "Tokenable",
    description:
      "Authenticated, vaulted collectibles. Join the waitlist for early access.",
    type: "website",
    siteName: "Tokenable",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tokenable",
    description: "Own a piece of the world's greatest collectibles.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0b",
};

export default function HomePage() {
  return (
    <>
      <h1 className="landing-seo-title">
        Own a piece of the world&apos;s greatest collectibles
      </h1>
      <p className="landing-seo-title">
        Tokenized, authenticated, and vaulted collectibles for collectors and investors.
      </p>
      <LandingShell />
    </>
  );
}
