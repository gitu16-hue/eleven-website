import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
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
      <div className="h-[520px] w-full animate-pulse motion-reduce:animate-none rounded-sm border border-el-border bg-el-bg-raised/40" />
    ),
  }
);
import {
  CipherText,
  ClarityTogglePill,
  DualCopy,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";
import {
  GenesisBubbleRow,
  GenesisCtaStage,
  GenesisHeroIntro,
  GenesisSectionIntro,
  GenesisShowcaseFrame,
  GenesisStaggerGrid,
  GenesisSubpageHeroBackdrop,
} from "@/components/motion/GenesisMotionEngine";

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
          <GenesisSubpageHeroBackdrop />
          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <GenesisHeroIntro className="max-w-[780px] space-y-4">
              <div className="mb-3.5">
                <Breadcrumbs items={[{ label: "Documentation", href: "/docs" }]} />
              </div>
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83] motion-safe:animate-pulse motion-reduce:animate-none shadow-[0_0_8px_#10bc83]" />
                <CipherText text="Technical Specifications & API Reference" />
              </div>
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
              <GenesisBubbleRow className="flex flex-wrap gap-2.5 pt-2 text-xs">
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  <span>Ring-0 Host Supervisor</span>
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  <span>Quarantine Sanctum Jails</span>
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00b38c]" />
                  <span>AES-256-GCM Loopback</span>
                </li>
              </GenesisBubbleRow>
            </GenesisHeroIntro>
            <ClarityTogglePill />
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── CORE SPECIFICATION VIEWER ── */}
        <Section>
          <GenesisSectionIntro className="max-w-[680px]">
            <div className="gfx-badge mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              <CipherText text="01 · Architectural Specifications" />
            </div>
            <WordReveal
              as="h2"
              text="Inside the four rings."
              mutedText="Explore each isolation domain."
              className="mt-3 el-h2"
            />
            <p className="mt-3 el-body">
              Select a subsystem below to inspect process privileges, invariant rules, and configuration payloads.
            </p>
          </GenesisSectionIntro>

          <div className="mt-8">
            <GenesisShowcaseFrame>
              <DocsInteractiveViewer />
            </GenesisShowcaseFrame>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── THREE REPRODUCIBLE GUARANTEES ── */}
        <Section>
          <GenesisSectionIntro className="max-w-[680px]">
            <div className="gfx-badge mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              <CipherText text="02 · Engineering Guarantees" />
            </div>
            <WordReveal
              as="h2"
              text="Verifiable boundaries."
              mutedText="Not promises. Deterministic math."
              className="mt-3 el-h2"
            />
          </GenesisSectionIntro>

          <GenesisStaggerGrid
            from="center"
            stagger={0.1}
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            <Tilt3DCard className="p-6 h-full">
              <span className="text-xs text-[#10bc83] font-medium">
                Guarantee 01
              </span>
              <h3 className="mt-2 text-el-lg font-normal heading-gradient">
                Default-Deny Egress
              </h3>
              <p className="mt-2 text-el-sm text-el-fg-muted leading-relaxed">
                Subprocess socket creation is intercepted at the OS packet filter. Untrusted model workers cannot make external telemetry pings without Ed25519-signed operator consent.
              </p>
            </Tilt3DCard>

            <Tilt3DCard className="p-6 h-full">
              <span className="text-xs text-[#10bc83] font-medium">
                Guarantee 02
              </span>
              <h3 className="mt-2 text-el-lg font-normal heading-gradient">
                Sub-50ms Killswitch
              </h3>
              <p className="mt-2 text-el-sm text-el-fg-muted leading-relaxed">
                The global emergency stop listener resides in the un-sandboxed host supervisor. It operates outside model control and guarantees hardware termination in under 0.05s.
              </p>
            </Tilt3DCard>

            <Tilt3DCard className="p-6 h-full">
              <span className="text-xs text-[#10bc83] font-medium">
                Guarantee 03
              </span>
              <h3 className="mt-2 text-el-lg font-normal heading-gradient">
                Loopback Encryption
              </h3>
              <p className="mt-2 text-el-sm text-el-fg-muted leading-relaxed">
                All memory drawers are bound to 127.0.0.1 and encrypted with AES-256-GCM. Master key material is generated on-device with Argon2id and never uploaded to remote servers.
              </p>
            </Tilt3DCard>
          </GenesisStaggerGrid>
        </Section>

        <SignalBeamDivider />

        {/* ── DEVELOPER ACCESS STAGE ── */}
        <Section className="py-20">
          <GenesisCtaStage
            badge="03 · Architecture & SDK Access"
            title="Inspect the full runtime specification."
            description="Request technical preview access for local Ring-0 host supervision, ActionProposal CLI harnesses, and sandboxed worktree tooling."
            actions={
              <>
                <WaitlistActionButton variant="primary" arrow tier="technical" className="w-full sm:w-auto">
                  Request Technical Access
                </WaitlistActionButton>
                <Button href="/solutions/developers" variant="secondary" arrow className="w-full sm:w-auto">
                  For Developers
                </Button>
                <Button href="/tools/inspector" variant="ghost" arrow className="w-full sm:w-auto">
                  Interactive Inspector
                </Button>
              </>
            }
          >
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button href="/architecture" variant="ghost" arrow>
                Execution Rooms
              </Button>
              <Button href="/autonomy" variant="ghost" arrow>
                5 Safety Gates
              </Button>
              <Button href="/research" variant="ghost" arrow>
                15 Invariant Rules
              </Button>
            </div>
          </GenesisCtaStage>
        </Section>
      </main>

      <Footer />
    </>
  );
}
