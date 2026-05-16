import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["600", "700"] });

export const metadata: Metadata = {
  title: "RideFlow — Book a Ride Instantly",
  description: "Fast, affordable taxi and ride booking. Location-aware pricing. No app needed — book online in seconds.",
  keywords: ["taxi booking", "ride booking", "cab booking", "book a taxi", "local taxi", "airport transfer", "outstation cab"],
  metadataBase: new URL("https://rideflow.app"),
  openGraph: {
    title: "RideFlow — Book a Ride Instantly",
    description: "Fast, affordable ride booking. No app needed.",
    type: "website",
    siteName: "RideFlow",
  },
  twitter: { card: "summary_large_image", title: "RideFlow", description: "Book a ride instantly. No app needed." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body style={{ background: "#080f1a", color: "#f1f5f9", fontFamily: "var(--font-body, system-ui)", margin: 0, minHeight: "100vh", overflowX: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
