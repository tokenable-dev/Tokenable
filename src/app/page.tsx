import type { Metadata, Viewport } from "next";
import { LandingShell } from "@/components/landing/LandingShell";
import "./landing.css";

const siteUrl = "https://tokenable.io";
const ogImage = "/og.jpg";

export const metadata: Metadata = {
  title: "Tokenable",
  description:
    "Own a piece of the world's rarest collectibles. Authenticated, vaulted assets you can own in whole or in part.",
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
      "Own a piece of the world's rarest collectibles. Join the waitlist for early access.",
    type: "website",
    url: siteUrl,
    siteName: "Tokenable",
    locale: "en_US",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Tokenable — vaulted collectibles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tokenable",
    description: "Own a piece of the world's rarest collectibles",
    images: [ogImage],
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
        Own a piece of the world&apos;s rarest collectibles.
      </h1>
      <p className="landing-seo-title">
        Tokenized, authenticated, and vaulted collectibles for collectors and investors.
      </p>
      <LandingShell />
    </>
  );
}
