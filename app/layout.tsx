import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import React from "react";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { AmbientSpatialFieldEmbed } from "@/components/ui/AmbientSpatialFieldEmbed";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { PortalTransitionProvider } from "@/components/ui/PortalTransition";
import { ClarityProvider } from "@/components/motion/PremiumMotion";

export const metadata: Metadata = {
  metadataBase: new URL("https://eleven-website-self.vercel.app"),
  alternates: {
    canonical: "./",
  },
  title: "ELEVEN v3 — Personal AI You Can Trust | GISHH Labs",
  description:
    "ELEVEN is the personal AI system that listens naturally, thinks deeply in the background, keeps your memory private on your own computer, and always asks before taking important actions.",
  openGraph: {
    title: "ELEVEN v3 — Brilliant AI. Always Under Your Control.",
    description:
      "Natural voice conversation, background deep thinking, private local memory, and five automatic safety checkpoints before any real-world action.",
    url: "https://eleven-website-self.vercel.app",
    images: [
      {
        url: "/gishh-logo.png",
        width: 1200,
        height: 630,
        alt: "ELEVEN v3 by GISHH Labs",
      },
    ],
    type: "website",
    siteName: "ELEVEN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ELEVEN v3 — Personal AI You Can Trust",
    description:
      "A local-first AI system between you, frontier AI brains, your private files, and real-world actions. Built by GISHH Labs.",
    images: ["/gishh-logo.png"],
  },
  keywords: [
    "ELEVEN v3",
    "Personal AI",
    "Autonomous Desktop Agent",
    "AI Control Plane",
    "Safe AI Assistant",
    "Private Local AI",
    "GISHH Labs",
  ],
  icons: {
    icon: ["/gishh-logo-icon.png"],
    shortcut: "/gishh-logo-icon.png",
    apple: "/gishh-logo-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#06080D",
  colorScheme: "dark",
};

const rootJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://eleven-website-self.vercel.app/#organization",
      "name": "GISHH Labs",
      "url": "https://eleven-website-self.vercel.app",
      "logo": "https://eleven-website-self.vercel.app/gishh-logo.png",
      "description":
        "Research and engineering team building ELEVEN, an autonomous local-first desktop personal AI system.",
    },
    {
      "@type": "WebSite",
      "@id": "https://eleven-website-self.vercel.app/#website",
      "url": "https://eleven-website-self.vercel.app",
      "name": "ELEVEN v3",
      "description":
        "Personal AI system with private local memory and deterministic safety controls.",
      "publisher": {
        "@id": "https://eleven-website-self.vercel.app/#organization",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="el-grain min-h-full antialiased selection:bg-el-accent-soft relative">
        {/* Accessible Skip Link for Keyboard Navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xs focus:border focus:border-el-accent focus:bg-el-bg-raised focus:px-4 focus:py-2 focus:font-mono focus:text-el-xs focus:text-el-accent focus:shadow-el-md focus:outline-none"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(rootJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <ClarityProvider>
          <PortalTransitionProvider>
            <ScrollProgressBar />
            <AmbientSpatialFieldEmbed />
            <AmbientGlow />
            <div className="relative z-[3]">{children}</div>
          </PortalTransitionProvider>
        </ClarityProvider>
      </body>
    </html>
  );
}
