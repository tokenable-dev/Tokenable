import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  title: "Tokenable",
  description:
    "We tokenize and create markets for investments in high value and scarce assets that people have passion for.",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} h-full scroll-smooth antialiased`}>
      <body className="flex min-h-[100dvh] flex-col bg-black font-sans text-[17px] text-white sm:text-[17px] md:text-[18px]">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
