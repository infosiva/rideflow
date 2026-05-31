import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import BackToTop from '@/components/BackToTop'
import FloatingChatWrapper from '@/components/FloatingChatWrapper'

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://rideflow.app"),
  title: "RideFlow — AI Route Optimizer for Drivers & Couriers",
  description: "AI route optimization built for independent drivers and couriers — plan 10-30 stops in seconds, cut drive time, save fuel. No fleet required.",
  keywords: ["taxi booking", "ride booking", "cab booking", "book a taxi", "local taxi", "airport transfer", "outstation cab"],
  openGraph: {
    title: "RideFlow — AI Route Optimizer for Drivers & Couriers",
    description: "AI route optimization for independent drivers — plan 10-30 stops in seconds.",
    type: "website",
    siteName: "RideFlow",
  },
  twitter: { card: "summary_large_image", title: "RideFlow — AI Route Optimizer", description: "Plan 10-30 stops in seconds. Built for independent drivers." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "RideFlow",
              "description": "Fast, affordable taxi and ride booking service",
              "url": "https://rideflow.app",
              "serviceType": "Taxi Service"
            })
          }}
        />
      </head>
      <body style={{ background: "#080f1a", color: "#f1f5f9", fontFamily: "var(--font-body, system-ui)", margin: 0, minHeight: "100vh", overflowX: "hidden" }}>
        <div className="aurora aurora-primary" aria-hidden />
        <div className="aurora aurora-secondary" aria-hidden />
        <div className="aurora aurora-third" aria-hidden />
        <div className="grain" aria-hidden />
        {children}
        <BackToTop accentColor="#0ea5e9" />
        <FloatingChatWrapper />
        <Script defer data-site="rideflow.app" src="http://31.97.56.148:3098/t.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
