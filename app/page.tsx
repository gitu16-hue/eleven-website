import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import dynamic from "next/dynamic";
import { IntelligenceInMotion } from "@/components/v3/IntelligenceInMotion";
import { Gyro3DEmbed } from "@/components/v3/Gyro3DEmbed";
import { PortalActionButton } from "@/components/v3/PortalActionButton";
import { WaitlistActionButton } from "@/components/v3/WaitlistActionButton";
import {
  CipherText,
  ClarityTogglePill,
  DualCopy,
  SignalBeamDivider,
  WordReveal,
} from "@/components/motion/PremiumMotion";
import {
  GenesisBubbleRow,
  GenesisCtaStage,
  GenesisSectionIntro,
  GenesisShowcaseFrame,
  GenesisSplitReveal,
  GenesisStaggerGrid,
  GenesisTimelineList,
} from "@/components/motion/GenesisMotionEngine";
import { GenesisHeroStage } from "@/components/motion/GenesisHeroStage";
import { HeroAiPromptBox } from "@/components/v3/HeroAiPromptBox";

const ArchitectureVisualization = dynamic(
  () =>
    import("@/components/v3/ArchitectureVisualization").then(
      (mod) => mod.ArchitectureVisualization
    ),
  {
    loading: () => (
      <div className="h-[480px] w-full animate-pulse motion-reduce:animate-none rounded-2xl border border-white/[0.08] bg-[#0c1311]/40" />
    ),
  }
);

const AutonomyControlSection = dynamic(
  () =>
    import("@/components/v3/AutonomyControlSection").then(
      (mod) => mod.AutonomyControlSection
    ),
  {
    loading: () => (
      <div className="h-[420px] w-full animate-pulse motion-reduce:animate-none rounded-2xl border border-white/[0.08] bg-[#0c1311]/40" />
    ),
  }
);

const NeuralTraceSimulator = dynamic(
  () =>
    import("@/components/v3/NeuralTraceSimulator").then(
      (mod) => mod.NeuralTraceSimulator
    ),
  {
    loading: () => (
      <div className="h-[360px] w-full animate-pulse rounded-2xl border border-white/[0.08] bg-[#0c1311]/40" />
    ),
  }
);

const ElevenControlShowcase = dynamic(
  () =>
    import("@/components/v3/ElevenControlShowcase").then(
      (mod) => mod.ElevenControlShowcase
    ),
  {
    loading: () => (
      <div className="h-[620px] w-full animate-pulse rounded-2xl border border-[#00b38c]/20 bg-[#0c1311]/40" />
    ),
  }
);

export const metadata: Metadata = {
  title: "ELEVEN v3 — Brilliant AI. Always Under Your Control.",
  description:
    "Talk naturally, get deep work done in the background, keep your memories private on your own computer, and approve important actions before they happen.",
  alternates: {
    canonical: "./",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://eleven-website-self.vercel.app/#software",
  name: "ELEVEN v3",
  applicationCategory: "DesktopApplication",
  operatingSystem: "Windows 11, macOS, Linux",
  description:
    "Autonomous local-first desktop personal AI system featuring private memory, dual-mind processing, and deterministic human-in-the-loop safety checkpoints.",
  disambiguatingDescription:
    "Autonomous desktop personal AI agent and control plane developed by GISHH Labs. Not affiliated with or related to ElevenLabs voice synthesis APIs.",
  publisher: {
    "@id": "https://eleven-website-self.vercel.app/#organization",
  },
  url: "https://eleven-website-self.vercel.app",
};

const GATEWAY_PILLARS = [
  {
    code: "01",
    title: "Real-Time 16kHz Voice",
    desc: "Natural full-duplex speech perception that responds in <0.5s and flushes instantly on interruption.",
    tint: "rgba(0, 179, 140, 0.36)",
  },
  {
    code: "02",
    title: "Dual-Mind DAG Planner",
    desc: "Fast conversational voice separated cleanly from background deep-planning task graphs.",
    tint: "rgba(56, 255, 189, 0.28)",
  },
  {
    code: "03",
    title: "Sovereign Local Memory",
    desc: "Four encrypted local persistence drawers stored exclusively on your own machine—zero cloud lock-in.",
    tint: "rgba(16, 188, 131, 0.34)",
  },
  {
    code: "04",
    title: "5-Gate Host Control",
    desc: "Models emit untrusted ActionProposals verified against 15 strict invariants before execution.",
    tint: "rgba(130, 96, 207, 0.36)",
  },
];

const SAFETY_RING_FEATURES = [
  {
    tag: "Fail-Closed · Sub-50ms Halt",
    title: "Ring 0 Watchdog",
    desc: "Hardware-level emergency stop interrupts any in-flight reasoning or execution stream in <0.05s.",
  },
  {
    tag: "5 Guards · 15 Strict Invariants",
    title: "Rings 1 to 4 Policy Verification",
    desc: "Every candidate ActionProposal traverses isolated POSIX boundaries, path confinement, and semantic policy checks.",
  },
  {
    tag: "Cryptographic · 30.0s TTL",
    title: "One-Time Approval Nonce",
    desc: "Sensitive actions require an explicit, time-bounded Ed25519 approval token signed directly by you.",
  },
];

const ARCHITECTURE_BUBBLES = [
  { label: "4 Isolated Domains", tint: "16, 188, 131" },
  { label: "AES-256-GCM Local Vault", tint: "0, 179, 140" },
  { label: "Ed25519 Signed Receipts", tint: "130, 96, 207" },
  { label: "Zero Cloud Lock-In", tint: "56, 255, 189" },
];

const RUNTIME_DECK_TELEMETRY = [
  {
    label: "16kHz Voice Duplex Loop",
    value: "0.42s median · <50ms halt",
  },
  {
    label: "Untrusted Quarantine Gate",
    value: "INV-01 Path Confined · Zero Shell",
  },
  {
    label: "Host Verification Quorum",
    value: "5 Checkpoints · 15 Strict Invariants",
  },
  {
    label: "Cold-Room Cryptographic Pass",
    value: "Ed25519 Nonce · 30.0s Auto-Expire",
  },
];

export default function HomePage() {
  return (
    <>
      <Nav />

      <main
        id="main-content"
        className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#10bc83]"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        {/* ── 01. GENESISFX 3-PHASE BEGINNING ANIMATION STAGE (.globe-stage + #hero-section + #stats-section + #gateway-section) ── */}
        <GenesisHeroStage />

        <SignalBeamDivider />

        {/* ── 02. INTELLIGENCE IN MOTION ── */}
        <Section id="intelligence-in-motion" className="relative">
          {/* Anchor compatibility for /#solutions and /#how-it-works */}
          <div id="solutions" className="absolute -top-24 left-0 pointer-events-none" aria-hidden="true" />
          <div id="how-it-works" className="absolute -top-24 left-0 pointer-events-none" aria-hidden="true" />

          {/* Paired Command Deck fixing orphaned prompt box & echoing #hero-section spatial luminance */}
          <GenesisShowcaseFrame className="mb-14" innerClassName="relative p-5 sm:p-7 lg:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 right-0 h-[280px] w-[360px] rounded-full opacity-40 blur-[90px]"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(16, 188, 131, 0.35), rgba(130, 96, 207, 0.14) 55%, transparent)",
              }}
            />
            <GenesisSplitReveal
              className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12"
              leftClassName="lg:col-span-7"
              rightClassName="lg:col-span-5"
              offset={56}
              left={
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="gfx-badge">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd] motion-safe:animate-pulse" />
                      Interactive Command Simulation
                    </span>
                    <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.12em] text-[#686868]">
                      Host Policy · Fail-Closed
                    </span>
                  </div>
                  <HeroAiPromptBox />
                </div>
              }
              right={
                <div className="rounded-xl border border-white/[0.08] bg-[#080d0b]/85 p-5 sm:p-6">
                  <div className="flex items-center justify-between border-b border-white/[0.07] pb-3.5">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#10bc83]">
                        CONTROL PLANE GUARDRAILS
                      </p>
                      <h3 className="mt-1 text-lg font-normal tracking-[-0.02em] heading-gradient">
                        Every prompt enters quarantine first.
                      </h3>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-full border border-[#00b38c]/35 bg-[#021b13] px-2.5 py-1 font-mono text-[10px] text-[#38ffbd]">
                      RING 0–4
                    </span>
                  </div>

                  <ul className="mt-4 space-y-3.5">
                    {RUNTIME_DECK_TELEMETRY.map((item) => (
                      <li key={item.label} className="gfx-feature-item is-active flex items-start gap-3">
                        <span className="gfx-feature-bar" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-[#e8ecf5]">
                            {item.label}
                          </p>
                          <p className="font-mono text-[11px] text-[#8a9490]">
                            {item.value}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            />
          </GenesisShowcaseFrame>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <GenesisSectionIntro className="max-w-[700px]">
              <div>
                <span className="gfx-badge">
                  <CipherText text="01 · Autonomous execution pipeline" />
                </span>
              </div>
              <WordReveal
                as="h2"
                text="Intelligence in motion."
                mutedText="Understand, plan, execute, verify."
                className="mt-5 el-h2"
              />
              <DualCopy
                className="mt-4 el-body"
                plain="Watch how ELEVEN handles everyday requests: it listens without stuttering, plans out the job, works safely in a locked room on your computer, and checks every detail before making changes."
                technical="Unidirectional execution pipeline decoupling real-time perception (16kHz PCM), deterministic task planning (GovernedTaskEngine DAG), process containment (4 isolated domains), and cryptographic policy verification."
              />
            </GenesisSectionIntro>

            <div className="flex flex-col items-start gap-2 lg:items-end shrink-0">
              <span className="font-sans text-xs text-[#686868]">
                Switch explanation depth anytime
              </span>
              <ClarityTogglePill />
            </div>
          </div>

          {/* GenesisFX Chamfered Glass Gateway Cards */}
          <div id="gateway-pillars">
            <GenesisStaggerGrid
              from="center"
              stagger={0.11}
              className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {GATEWAY_PILLARS.map((pillar) => (
                <article key={pillar.code} className="gfx-card p-6 flex flex-col justify-between">
                  <span className="gfx-card__border" aria-hidden="true" />
                  <span className="border-shadow" aria-hidden="true">
                    <span className="border-shadow__glow" />
                  </span>
                  <span
                    className="gfx-card__bloom"
                    style={{ background: pillar.tint }}
                    aria-hidden="true"
                  />
                  <div className="relative z-10">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-[#021b13]/80 font-mono text-[11px] text-[#10bc83]">
                      {pillar.code}
                    </span>
                    <h3 className="mt-5 text-[1.25rem] font-normal tracking-[-0.02em] heading-gradient">
                      {pillar.title}
                    </h3>
                    <p className="mt-2.5 text-[14px] leading-[1.55] text-[#a0a0a0]">
                      {pillar.desc}
                    </p>
                  </div>
                </article>
              ))}
            </GenesisStaggerGrid>
          </div>

          <div className="mt-12">
            <IntelligenceInMotion />
          </div>

          <div className="mt-12">
            <GenesisShowcaseFrame innerClassName="p-4 sm:p-6">
              <NeuralTraceSimulator />
            </GenesisShowcaseFrame>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── 03. #broker-section: LIVE CONTROL PLANE SHOWCASE ── */}
        <Section id="live-control-showcase" className="relative">
          {/* Anchor compatibility for /#tools */}
          <div id="tools" className="absolute -top-24 left-0 pointer-events-none" aria-hidden="true" />
          <div id="broker-section" className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <GenesisSectionIntro className="max-w-[700px]">
              <div>
                <span className="gfx-badge">
                  <CipherText text="02 · Interactive control plane" />
                </span>
              </div>
              <WordReveal
                as="h2"
                text="Watch missions traverse the L5 gate."
                mutedText="Real-time triage, swarm, and verification."
                className="mt-5 el-h2"
              />
              <DualCopy
                className="mt-4 el-body"
                plain="Explore the live ELEVEN v3 Control Plane below. Click any tab, mission card, or station along the curved route to inspect how tasks move from instant perception into high-contrast human verification."
                technical="Interactive 3-view showcase cycling Overview telemetry, 5-stage Hive Pipeline Kanban, and Cold-Room L5 Governance with GSAP tangent-banked cubic-bezier SVG route physics."
              />
            </GenesisSectionIntro>

            <div className="shrink-0">
              <Button href="/dashboard" variant="secondary" arrow>
                Full Control Plane Lab
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <GenesisShowcaseFrame innerClassName="p-2 sm:p-4">
              <ElevenControlShowcase />
            </GenesisShowcaseFrame>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── 04. #genesis-social-section: CONCENTRIC SAFETY RINGS & GYROSCOPE ── */}
        <section
          id="control-plane-preview"
          className="relative overflow-hidden py-16 lg:py-[var(--el-space-section)]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-grid-graphite opacity-30 [mask-image:radial-gradient(70%_60%_at_70%_50%,black,transparent)]"
          />

          <div
            id="genesis-social-section"
            className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10"
          >
            <GenesisSplitReveal
              className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14"
              leftClassName="lg:col-span-6"
              rightClassName="lg:col-span-6"
              offset={84}
              left={
                <div>
                  <GenesisSectionIntro>
                    <div>
                      <span className="gfx-badge">
                        <span className="h-2 w-2 rounded-full bg-[#10bc83] motion-safe:animate-pulse" />
                        <CipherText text="03 · Concentric safety rings" />
                      </span>
                    </div>

                    <WordReveal
                      as="h2"
                      text="Five concentric safety rings."
                      mutedText="Deterministic host policy."
                      className="mt-5 el-h2"
                    />

                    <DualCopy
                      className="mt-4 el-body"
                      plain="Most AI agents run loose on your computer with complete control over your files and terminal. ELEVEN encloses models within 5 protective concentric rings: every proposed action must be inspected, verified against strict safety rules, and approved before anything executes."
                      technical="DEC-008 unidirectional Control Plane topology. Models operate strictly inside untrusted reasoning quarantine; candidate ActionProposals flow inward across 5 deterministic PolicyGate checkpoints; emergency hardware stop interrupts execution in <0.05s."
                    />
                  </GenesisSectionIntro>

                  {/* Signature GenesisFX Glowing Vertical Feature Bars with Scrub Illumination */}
                  <GenesisTimelineList
                    mode="feature-bars"
                    className="mt-10 space-y-6 border-t border-white/[0.07] pt-8"
                  >
                    {SAFETY_RING_FEATURES.map((feat) => (
                      <li key={feat.title} className="gfx-feature-item flex items-start gap-4">
                        <span className="gfx-feature-bar" aria-hidden="true" />
                        <div>
                          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#10bc83]">
                            {feat.tag}
                          </span>
                          <h3 className="mt-1 text-[1.25rem] font-normal tracking-[-0.02em] heading-gradient">
                            {feat.title}
                          </h3>
                          <p className="mt-1.5 text-[14.5px] leading-[1.55] text-[#a0a0a0]">
                            {feat.desc}
                          </p>
                        </div>
                      </li>
                    ))}
                  </GenesisTimelineList>

                  <div className="mt-9 flex flex-wrap items-center gap-3.5">
                    <Button href="/architecture" variant="primary" arrow>
                      Inspect Complete Architecture
                    </Button>
                    <Button href="/security" variant="secondary">
                      Review Security Proofs
                    </Button>
                  </div>
                </div>
              }
              right={
                <div>
                  <div className="mb-3 flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83] motion-safe:animate-pulse" />
                      <span className="font-sans text-xs text-[#686868]">
                        Topology simulator · Specification v3.1
                      </span>
                    </div>
                    <span className="font-sans text-xs text-[#686868]">
                      Drag to rotate 3D view
                    </span>
                  </div>

                  <GenesisShowcaseFrame>
                    <Gyro3DEmbed theme="dark" />
                  </GenesisShowcaseFrame>
                </div>
              }
            />
          </div>
        </section>

        <SignalBeamDivider />

        {/* ── 05. #ai-coach-section: VIOLET/EMERALD SVG HALO + FLOATING BUBBLES + ARCHITECTURE ── */}
        <section
          id="architecture-visualization"
          className="relative overflow-hidden py-16 lg:py-[var(--el-space-section)]"
        >
          {/* GenesisFX Organic Curved AI Coach SVG Aura */}
          <svg
            className="ai-coach-svg-aura"
            viewBox="306.829 -219 935.5 437.5"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="el-ai-aura-grad" x1="306.8" y1="-219" x2="1242.3" y2="218.5" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8260cf" />
                <stop offset="52%" stopColor="#00b38c" />
                <stop offset="100%" stopColor="#38ffbd" />
              </linearGradient>
            </defs>
            <path d="M419.829 -112C292.229 -110.4 291.329 -182.667 306.829 -219H1242.33C1253.13 -143.4 1173.83 -116.167 1132.83 -112C961.829 -112 991.829 10.5 991.829 47.5C991.829 84.5 970.329 218.5 781.829 218.5C631.029 218.5 576.329 104.5 567.829 47.5C571.663 -6.33333 547.429 -113.6 419.829 -112Z" />
          </svg>

          <div
            id="ai-coach-section"
            className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10"
          >
            <GenesisSectionIntro className="mx-auto max-w-[760px] text-center flex flex-col items-center">
              <div>
                <span className="gfx-badge">
                  <CipherText text="04 · Verified system architecture" />
                </span>
              </div>

              <WordReveal
                as="h2"
                text="Built like an operating system."
                mutedText="Not a fragile chatbot wrapper."
                className="mt-5 el-h2"
              />

              <DualCopy
                className="mt-4 max-w-[640px] el-body text-center"
                plain="Most AI tools give one model total access to everything. ELEVEN divides your computer into four separate rooms, stores your notes in four encrypted drawers, and guards every doorway with five automatic checkpoints."
                technical="Subsystem architecture enforcing process isolation (POSIX domain sockets), DEC-004 quad-tier loopback memory persistence (AES-256-GCM), and DEC-008 cryptographic ActionProposal verification."
              />

              {/* Floating Frosted .gfx-bubble Telemetry Pills */}
              <GenesisBubbleRow className="mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                {ARCHITECTURE_BUBBLES.map((b) => (
                  <li
                    key={b.label}
                    className="gfx-bubble"
                    style={{ ["--tint" as string]: b.tint }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white/90" aria-hidden="true" />
                    <span>{b.label}</span>
                  </li>
                ))}
              </GenesisBubbleRow>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Button href="/architecture#exploded-layer-stack" variant="secondary">
                  Read System Spec
                </Button>
                <Button href="/security#flagship-security-showcase" variant="ghost" arrow>
                  Review Security Simulation
                </Button>
              </div>
            </GenesisSectionIntro>

            <div className="mt-12">
              <GenesisShowcaseFrame innerClassName="p-4 sm:p-6">
                <ArchitectureVisualization />
              </GenesisShowcaseFrame>
            </div>
          </div>
        </section>

        <SignalBeamDivider />

        {/* ── 06. #verified-section / AUTONOMY & USER CONTROL ── */}
        <Section id="autonomy-control" className="relative">
          <div id="verified-section" className="max-w-[720px]">
            <GenesisSectionIntro>
              <div>
                <span className="gfx-badge">
                  <CipherText text="05 · Autonomy with hard boundaries" />
                </span>
              </div>
              <WordReveal
                as="h2"
                text="You decide how much autonomy ELEVEN gets."
                className="mt-5 el-h2"
              />
              <DualCopy
                className="mt-4 el-body"
                plain="Choose between four clear control levels—from advice only to overnight autonomous jobs. Whenever ELEVEN wants to change a file or send a message, it shows you a 30-second receipt first."
                technical="Four distinct autonomy tiers (T0 Advisory through T3 Delegated). Enforced by host kernel boundary, Ed25519 tamper-evident audit receipts, and hardware-level Emergency Stop interrupt."
              />
            </GenesisSectionIntro>
          </div>

          <div className="mt-12">
            <AutonomyControlSection />
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── 07. #cta-instance-section: OBSIDIAN + EMERALD CLOSING CTA BOX ── */}
        <Section id="early-access">
          <GenesisCtaStage
            id="cta-instance-section"
            badge="Early Access Invitation"
            title="Ready for personal AI that stays on your computer?"
            description="Join the early access program to experience fast voice conversation, background project planning, private encrypted memory, and deterministic safety checkpoints—running entirely under your control."
            actions={
              <>
                <WaitlistActionButton variant="primary" arrow tier="general" className="w-full sm:w-auto">
                  Join Early Access
                </WaitlistActionButton>
                <WaitlistActionButton variant="secondary" tier="technical" className="w-full sm:w-auto">
                  Request Technical Access
                </WaitlistActionButton>
                <PortalActionButton variant="ghost" className="w-full sm:w-auto">
                  Open Live 3D Orb
                </PortalActionButton>
              </>
            }
          >
            <div className="mt-7 flex flex-wrap items-center gap-5 font-sans text-xs text-[#a0a0a0]">
              <span className="flex items-center gap-1.5">
                <span className="text-[#10bc83] font-semibold">✓</span> Local-First Architecture
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#10bc83] font-semibold">✓</span> Zero Cloud Memory Lock-In
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#10bc83] font-semibold">✓</span> 5-Checkpoint Safety Policy
              </span>
            </div>
          </GenesisCtaStage>
        </Section>
      </main>

      <Footer />
    </>
  );
}
