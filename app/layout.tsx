import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import BackToTop from '@/components/BackToTop'
import FloatingChatWrapper from '@/components/FloatingChatWrapper'
import { getSiteFlags } from '@/lib/flags'
import FeedbackWidget from '@/components/FeedbackWidget'
import { loadSiteTheme, buildThemeStyleTag, buildGa4Snippet } from '@/lib/theme-loader'

import { MotionProvider } from "@infosiva/shared-ui/modern";
import { AnimatedBg } from '@/components/AnimatedBg'
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://rideflow.app"),
  title: "RideFlow — AI Route Optimizer for Drivers & Couriers",
  description: "AI route optimization built for independent drivers and couriers — plan 10-30 stops in seconds, cut drive time, save fuel. No fleet required.",
  keywords: ["route planner", "route optimizer", "multi-stop route", "delivery route planner", "courier route", "driver route planning"],
  openGraph: {
    title: "RideFlow — AI Route Optimizer for Drivers & Couriers",
    description: "AI route optimization for independent drivers — plan 10-30 stops in seconds.",
    type: "website",
    siteName: "RideFlow",
  },
  twitter: { card: "summary_large_image", title: "RideFlow — AI Route Optimizer", description: "Plan 10-30 stops in seconds. Built for independent drivers." },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const flags = await getSiteFlags('rideflow')
  const theme = await loadSiteTheme('rideflow')
  const themeCss = buildThemeStyleTag(theme, { background: '#0b1207', primary: '#c6f432' })
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <style id="hub-theme" dangerouslySetInnerHTML={{ __html: themeCss }} />
        <meta name="google-adsense-account" content="ca-pub-4237294630161176" />
        <Script
                  async
                  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4237294630161176"
                  crossOrigin="anonymous"
                  strategy="afterInteractive"
                />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "RideFlow",
              "description": "Free multi-stop route planner for independent drivers and couriers",
              "url": "https://rideflow.app",
              "applicationCategory": "TravelApplication",
              "operatingSystem": "Web",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
            })
          }}
        />
      {buildGa4Snippet(theme) && <script dangerouslySetInnerHTML={{ __html: buildGa4Snippet(theme) }} />}
      </head>
      <body>
        <AnimatedBg theme={theme} fallback="mesh" />
        <div className="aurora aurora-primary" aria-hidden />
        <div className="aurora aurora-secondary" aria-hidden />
        <div className="aurora aurora-third" aria-hidden />
        <div className="grain" aria-hidden />
        <MotionProvider>{children}</MotionProvider>
        <BackToTop accentColor="#c6f432" />
        {flags.chatbot && <FloatingChatWrapper />}
        <FeedbackWidget siteName="RideFlow" accentColor="#c6f432" accentColor2="#a3cf1f" position="left" />
        <Script defer data-site="rideflow.app" src="/t.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
