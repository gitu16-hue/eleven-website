import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ScrollReveal, RevealItem } from "@/components/ui/ScrollReveal";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import dynamic from "next/dynamic";
import { WaitlistActionButton } from "@/components/v3/WaitlistActionButton";

const DocsInteractiveViewer = dynamic(
  () =>
    import("@/components/v3/DocsInteractiveViewer").then(
      (mod) => mod.DocsInteractiveViewer
    ),
  {
    loading: () => (
      <div className="h-[520px] w-full animate-pulse rounded-sm border border-el-border bg-el-bg-raised/40" />
    ),
  }
);
import {
  ClarityTogglePill,
  DualCopy,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";

export const metadata: Metadata = {
  title: "Developer Documentation & Technical Reference | ELEVEN v3",
  description:
    "Complete developer reference for ELEVEN: process supervisor isolation, Quarantine Sanctum sandboxing, Dual-Mind event bus, and sovereign local memory schema.",
  alternates: {
    canonical: "/docs",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://eleven-website-self.vercel.app/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Documentation",
      item: "https://eleven-website-self.vercel.app/docs",
    },
  ],
};

const techArticleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "ELEVEN v3 Architecture & Sandboxing Specification",
  description:
    "Technical reference covering process isolation, default-deny egress policies, and sovereign local storage schemas in the ELEVEN personal AI operating system.",
  author: {
    "@type": "Organization",
    name: "GISHH Labs",
    url: "https://eleven-website-self.vercel.app",
  },
  publisher: {
    "@type": "Organization",
    name: "GISHH Labs",
    logo: "https://eleven-website-self.vercel.app/gishh-logo.png",
  },
  url: "https://eleven-website-self.vercel.app/docs",
};

export default function DocsPage() {
  return (
    <>
      <Nav />

      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(techArticleJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        {/* ── HERO SECTION ── */}
        <Section className="relative overflow-hidden pt-10 pb-16">
          <div
            aria-hidden="true"
            className="bg-grid-scifi pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(70%_70%_at_50%_35%,#000,transparent)]"
          />
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-[780px]">
              <div className="mb-3.5">
                <Breadcrumbs items={[{ label: "Documentation" }]} />
              </div>
              <p className="el-eyebrow">
                TECHNICAL SPECIFICATIONS &amp; API REFERENCE
              </p>
              <WordReveal
                as="h1"
                text="Engineered for total control."
                mutedText="Built with zero cloud leakage."
                className="mt-4 el-h1"
              />
              <DualCopy
                className="mt-5 max-w-[650px] el-lead"
                plain="Explore the technical blueprints of ELEVEN: how it runs on your PC, keeps untrusted code jailed in locked sandboxes, and guarantees your personal files never leave your computer."
                technical="Complete architectural reference covering Host Supervisor Ring-0 isolation, Quarantine Sanctum low-integrity process boundaries, the Dual-Mind Async Event Bus, and AES-256 encrypted storage schemas."
              />
            </div>
            <ClarityTogglePill />
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── CORE SPECIFICATION VIEWER ── */}
        <Section>
          <div className="max-w-[680px]">
            <p className="el-eyebrow">
              01 · ARCHITECTURAL SPECIFICATIONS
            </p>
            <WordReveal
              as="h2"
              text="Inside the four rings."
              mutedText="Explore each isolation domain."
              className="mt-3 el-h2"
            />
            <p className="mt-3 el-body">
              Select a subsystem below to inspect process privileges, invariant rules, and configuration payloads.
            </p>
          </div>

          <div className="mt-8">
            <DocsInteractiveViewer />
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── THREE REPRODUCIBLE GUARANTEES ── */}
        <Section className="bg-el-bg-raised/40">
          <div className="max-w-[680px]">
            <p className="el-eyebrow">
              02 · ENGINEERING GUARANTEES
            </p>
            <WordReveal
              as="h2"
              text="Verifiable boundaries."
              mutedText="Not promises. Deterministic math."
              className="mt-3 el-h2"
            />
          </div>

          <ScrollReveal
            stagger={0.1}
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            <RevealItem className="h-full">
              <Tilt3DCard className="p-6">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-el-accent">
                  GUARANTEE 01
                </span>
                <h3 className="mt-2 text-el-lg font-semibold text-el-fg">
                  Default-Deny Egress
                </h3>
                <p className="mt-2 text-el-sm text-el-fg-muted leading-relaxed">
                  Subprocess socket creation is intercepted at the OS packet filter. Untrusted model workers cannot make external telemetry pings without Ed25519-signed operator consent.
                </p>
              </Tilt3DCard>
            </RevealItem>

            <RevealItem className="h-full">
              <Tilt3DCard className="p-6">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-el-accent">
                  GUARANTEE 02
                </span>
                <h3 className="mt-2 text-el-lg font-semibold text-el-fg">
                  Sub-50ms Killswitch
                </h3>
                <p className="mt-2 text-el-sm text-el-fg-muted leading-relaxed">
                  The global emergency stop listener resides in the un-sandboxed host supervisor. It operates outside model control and guarantees hardware termination in under 0.05s.
                </p>
              </Tilt3DCard>
            </RevealItem>

            <RevealItem className="h-full">
              <Tilt3DCard className="p-6">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-el-accent">
                  GUARANTEE 03
                </span>
                <h3 className="mt-2 text-el-lg font-semibold text-el-fg">
                  Loopback Encryption
                </h3>
                <p className="mt-2 text-el-sm text-el-fg-muted leading-relaxed">
                  All memory drawers are bound to 127.0.0.1 and encrypted with AES-256-GCM. Master key material is generated on-device with Argon2id and never uploaded to remote servers.
                </p>
              </Tilt3DCard>
            </RevealItem>
          </ScrollReveal>

          {/* Cross-Link Actions */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-el-border pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-el-xs text-el-fg-faint uppercase tracking-wider">
                Explore Architecture:
              </span>
              <Button href="/solutions/developers" variant="ghost">
                For Developers →
              </Button>
              <Button href="/architecture" variant="ghost">
                Execution Rooms →
              </Button>
              <Button href="/autonomy" variant="ghost">
                5 Safety Gates →
              </Button>
              <Button href="/research" variant="ghost">
                15 Invariant Rules →
              </Button>
            </div>

            <WaitlistActionButton variant="primary" arrow tier="technical">
              Request Technical Access
            </WaitlistActionButton>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
