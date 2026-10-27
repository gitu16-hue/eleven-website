import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
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
    icon: ["/gishh-logo.png"],
    shortcut: "/gishh-logo.png",
    apple: "/gishh-logo.png",
  },
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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full antialiased selection:bg-el-accent-soft relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(rootJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <ClarityProvider>
          <PortalTransitionProvider>
            <ScrollProgressBar />
            <AmbientGlow />
            {children}
          </PortalTransitionProvider>
        </ClarityProvider>
      </body>
    </html>
  );
}
