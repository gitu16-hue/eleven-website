import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import dynamic from "next/dynamic";
import { HeroOrbEmbed } from "@/components/v3/HeroOrbEmbed";
import { IntelligenceInMotion } from "@/components/v3/IntelligenceInMotion";
import { Gyro3DEmbed } from "@/components/v3/Gyro3DEmbed";
import { PortalActionButton } from "@/components/v3/PortalActionButton";
import { WaitlistActionButton } from "@/components/v3/WaitlistActionButton";
import {
  AnimatedMetric,
  CipherText,
  ClarityTogglePill,
  DualCopy,
  ParagraphReveal,
  SignalBeamDivider,
  WordReveal,
} from "@/components/motion/PremiumMotion";
import { AnimeCircuitStream } from "@/components/motion/AnimeCircuitStream";
import { LiveTelemetryTicker } from "@/components/motion/LiveTelemetryTicker";
import { HeroAiPromptBox } from "@/components/v3/HeroAiPromptBox";

const ArchitectureVisualization = dynamic(
  () =>
    import("@/components/v3/ArchitectureVisualization").then(
      (mod) => mod.ArchitectureVisualization
    ),
  {
    loading: () => (
      <div className="h-[480px] w-full animate-pulse rounded-sm border border-el-border bg-el-bg-raised/40" />
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
      <div className="h-[420px] w-full animate-pulse rounded-sm border border-el-border bg-el-bg-raised/40" />
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
      <div className="h-[360px] w-full animate-pulse rounded-sm border border-el-border bg-el-bg-raised/40" />
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
      <div className="h-[620px] w-full animate-pulse rounded-sm border border-emerald-500/20 bg-el-bg-raised/40" />
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

export default function HomePage() {
  return (
    <>
      <Nav />
      <LiveTelemetryTicker />

      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        {/* ── 01. HERO + 3D COGNITIVE ORB CENTERPIECE ── */}
        <section className="relative overflow-hidden pt-6 pb-14 lg:pt-10 lg:pb-16">
          <div aria-hidden="true" className="el-aurora pointer-events-none absolute inset-0 el-breathe" />
          <div aria-hidden="true" className="bg-grid-scifi pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
          <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left 7 Columns */}
            <div className="lg:col-span-7">
              <ScrollReveal direction="up" duration={0.55}>
                <div className="inline-flex flex-wrap items-center gap-3">
                  <div className="spatial-glass inline-flex items-center gap-2.5 rounded-full px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-el-accent el-breathe" />
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-el-fg-muted">
                      <CipherText text="ELEVEN v3.1 · PERSONAL AI OPERATING SYSTEM" />
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              <WordReveal
                as="h1"
                text="Brilliant AI."
                mutedText="Always under your control."
                className="mt-4 sm:mt-5 el-h1"
              />

              <ScrollReveal delay={0.18}>
                <DualCopy
                  className="mt-3.5 max-w-[560px] text-el-base sm:text-el-lg leading-[1.58] text-el-fg-muted"
                  plain="Most AI tools ask you to hand over your files, passwords, and privacy—and just hope nothing goes wrong. ELEVEN puts a protective smart layer on your own computer: talk naturally, get deep work done, and approve important actions before they happen."
                  technical="ELEVEN is the local-first control plane between people, untrusted frontier models, sovereign memory, and real-world actions. Models emit candidate ActionProposals; deterministic host policy verifies; humans retain final authority."
                />
              </ScrollReveal>

              <ScrollReveal
                delay={0.28}
                className="mt-5 flex flex-wrap items-center gap-3"
              >
                <WaitlistActionButton variant="primary" arrow tier="general">
                  Join Early Access
                </WaitlistActionButton>
                <WaitlistActionButton variant="secondary" tier="technical">
                  Request Technical Access
                </WaitlistActionButton>
                <PortalActionButton variant="ghost">
                  Try the Live 3D Orb
                </PortalActionButton>
              </ScrollReveal>

              {/* AI-Native Interactive Prompt Console (design-it: ai-native-ui) */}
              <ScrollReveal delay={0.32} className="mt-4 sm:mt-4.5">
                <HeroAiPromptBox />
              </ScrollReveal>

              {/* Animated Metrics Bar */}
              <ScrollReveal
                delay={0.36}
                className="mt-7 grid grid-cols-2 gap-4 border-t border-el-border pt-4 sm:grid-cols-4"
              >
                <AnimatedMetric
                  prefix="<"
                  value={0.5}
                  decimals={1}
                  suffix="s"
                  label="Voice Reply Goal"
                  sublabel="Talk & interrupt naturally"
                />
                <AnimatedMetric
                  value={5}
                  label="Safety Checkpoints"
                  sublabel="Every action inspected first"
                />
                <AnimatedMetric
                  value={100}
                  suffix="%"
                  label="Private Local Memory"
                  sublabel="Stored on your own PC"
                />
                <AnimatedMetric
                  prefix="<"
                  value={0.05}
                  decimals={2}
                  suffix="s"
                  label="Emergency Stop"
                  sublabel="One button halts everything"
                />
              </ScrollReveal>
            </div>

            {/* Right 5 Columns: 3D Cognitive Orb Centerpiece */}
            <ScrollReveal
              direction="left"
              delay={0.15}
              className="lg:col-span-5"
            >
              <HeroOrbEmbed />
            </ScrollReveal>
          </div>
          </div>
        </section>

        <AnimeCircuitStream />
        <SignalBeamDivider />

        {/* ── 02. INTELLIGENCE IN MOTION: THE AUTONOMOUS EXECUTION SEQUENCE ── */}
        <Section id="intelligence-in-motion" className="relative">
          {/* Anchor compatibility for /#solutions */}
          <div id="solutions" className="absolute -top-24 left-0 pointer-events-none" aria-hidden="true" />
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-[680px]">
              <p className="el-eyebrow">
                <CipherText text="01 · THE AUTONOMOUS EXECUTION SEQUENCE" />
              </p>
              <WordReveal
                as="h2"
                text="Intelligence in motion."
                mutedText="Understand, plan, execute, verify."
                className="mt-3 el-h2"
              />
              <DualCopy
                className="mt-3 text-el-base leading-[1.65] text-el-fg-muted"
                plain="Watch how ELEVEN handles everyday requests: it listens without stuttering, plans out the job, works safely in a locked room on your computer, and checks every detail before making changes."
                technical="Unidirectional execution pipeline decoupling real-time perception (16kHz PCM), deterministic task planning (GovernedTaskEngine DAG), process containment (4 isolated domains), and cryptographic policy verification."
              />
            </div>

            <div className="flex flex-col items-start gap-1.5 lg:items-end">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-el-fg-faint">
                Switch explanation depth anytime
              </span>
              <ClarityTogglePill />
            </div>
          </div>

          <div className="mt-12">
            <IntelligenceInMotion />
          </div>

          <div className="mt-14">
            <NeuralTraceSimulator />
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── 02B. LIVE INTERACTIVE CONTROL PLANE SHOWCASE & CURVED STEPPER ── */}
        <Section id="live-control-showcase" className="relative">
          {/* Anchor compatibility for /#tools */}
          <div id="tools" className="absolute -top-24 left-0 pointer-events-none" aria-hidden="true" />
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-[700px]">
              <p className="el-eyebrow">
                <CipherText text="02 · INTERACTIVE ZERO-PROMPT CONTROL PLANE" />
              </p>
              <WordReveal
                as="h2"
                text="Watch missions traverse the L5 gate."
                mutedText="Real-time triage, swarm, and verification."
                className="mt-3 el-h2"
              />
              <DualCopy
                className="mt-3 text-el-base leading-[1.65] text-el-fg-muted"
                plain="Explore the live ELEVEN v3 Control Plane below. Click any tab, mission card, or station along the curved route to inspect how tasks move from instant perception into high-contrast human verification."
                technical="Interactive 3-view showcase cycling Overview telemetry, 5-stage Hive Pipeline Kanban, and Cold-Room L5 Governance with GSAP tangent-banked cubic-bezier SVG route physics."
              />
            </div>
            <Button href="/dashboard" variant="secondary" arrow>
              Full Control Plane Lab
            </Button>
          </div>

          <ScrollReveal delay={0.1} className="mt-10">
            <ElevenControlShowcase />
          </ScrollReveal>
        </Section>

        {/* ── 03. IMMERSIVE PRODUCT PREVIEW (GRAPHITE SECTION) ── */}
        <section id="control-plane-preview" className="section-graphite relative overflow-hidden bg-el-bg py-20 lg:py-28 text-el-fg border-y border-el-border">
          {/* Computational grid background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-grid-graphite opacity-40"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
              {/* Left 6 Columns */}
              <div className="lg:col-span-6">
                <ScrollReveal>
                  <div className="inline-flex items-center gap-2 rounded-full border border-el-border bg-el-bg-raised/70 px-3.5 py-1.5 backdrop-blur-sm">
                    <span className="h-2 w-2 rounded-full bg-el-signal-lime animate-pulse" />
                    <span className="font-mono text-el-xs uppercase tracking-[0.1em] text-el-fg-muted">
                      <CipherText text="02 · IMMERSIVE CONTROL PLANE PREVIEW" />
                    </span>
                  </div>

                  <WordReveal
                    as="h2"
                    text="Five concentric safety rings."
                    mutedText="Deterministic host policy."
                    className="mt-6 el-h2"
                  />

                  <DualCopy
                    className="mt-5 text-el-base leading-[1.65] text-el-fg-muted"
                    plain="Most AI agents run loose on your computer with complete control over your files and terminal. ELEVEN encloses models within 5 protective concentric rings: every proposed action must be inspected, verified against strict safety rules, and approved before anything executes."
                    technical="DEC-008 unidirectional Control Plane topology. Models operate strictly inside untrusted reasoning quarantine; candidate ActionProposals flow inward across 5 deterministic PolicyGate checkpoints; emergency hardware stop interrupts execution in <0.05s."
                  />

                  {/* Interactive Gyroscope Telemetry Badges */}
                  <div className="mt-8 grid grid-cols-2 gap-4 border-t border-el-border/60 pt-6 sm:grid-cols-3">
                    <div className="rounded-sm border border-el-border/70 bg-el-bg-raised/50 p-3.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-el-fg-faint">
                        RING 0 // WATCHDOG
                      </span>
                      <p className="mt-1 font-mono text-el-sm font-semibold text-el-signal-lime">
                        Fail-Closed
                      </p>
                      <span className="text-[11px] text-el-fg-faint">Sub-50ms halt</span>
                    </div>

                    <div className="rounded-sm border border-el-border/70 bg-el-bg-raised/50 p-3.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-el-fg-faint">
                        RINGS 1–4 // CHECKS
                      </span>
                      <p className="mt-1 font-mono text-el-sm font-semibold text-el-signal-lime">
                        5 Guards
                      </p>
                      <span className="text-[11px] text-el-fg-faint">15 strict invariants</span>
                    </div>

                    <div className="rounded-sm border border-el-border/70 bg-el-bg-raised/50 p-3.5 col-span-2 sm:col-span-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-el-fg-faint">
                        APPROVAL NONCE
                      </span>
                      <p className="mt-1 font-mono text-el-sm font-semibold text-el-signal-lime">
                        30.0s TTL
                      </p>
                      <span className="text-[11px] text-el-fg-faint">Cryptographic token</span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Button href="/architecture" variant="primary" arrow>
                      Inspect Complete Architecture
                    </Button>
                    <Button href="/security" variant="secondary">
                      Review Security Proofs
                    </Button>
                  </div>
                </ScrollReveal>
              </div>

              {/* Right 6 Columns: 3D Control Plane Gyroscope */}
              <div className="lg:col-span-6">
                <ScrollReveal direction="left" delay={0.15}>
                  <div className="relative">
                    {/* Simulation tag */}
                    <div className="mb-3 flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-el-signal-lime animate-pulse" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-el-fg-faint">
                          TOPOLOGY SIMULATOR · SPECIFICATION v3.1
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-el-fg-faint">
                        DRAG TO ROTATE 3D VIEW
                      </span>
                    </div>

                    <div className="relative overflow-hidden rounded-sm border border-el-border bg-el-bg-raised shadow-el-lg">
                      <Gyro3DEmbed theme="dark" />
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04. PROGRESSIVE ARCHITECTURE VISUALIZATION ── */}
        <Section id="architecture-visualization">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-[680px]">
              <p className="el-eyebrow">
                <CipherText text="03 · VERIFIED SYSTEM ARCHITECTURE" />
              </p>
              <WordReveal
                as="h2"
                text="Built like an operating system."
                mutedText="Not a fragile chatbot wrapper."
                className="mt-3 el-h2"
              />
              <DualCopy
                className="mt-3 text-el-base leading-[1.65] text-el-fg-muted"
                plain="Most AI tools give one model total access to everything. ELEVEN divides your computer into four separate rooms, stores your notes in four encrypted drawers, and guards every doorway with five automatic checkpoints."
                technical="Subsystem architecture enforcing process isolation (POSIX domain sockets), DEC-004 quad-tier loopback memory persistence (AES-256-GCM), and DEC-008 cryptographic ActionProposal verification."
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button href="/architecture#exploded-layer-stack" variant="secondary">
                Read System Spec
              </Button>
              <Button href="/security#flagship-security-showcase" variant="ghost">
                Security Simulation →
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <ArchitectureVisualization />
          </div>
        </Section>

        <AnimeCircuitStream />
        <SignalBeamDivider />

        {/* ── 05. AUTONOMY & USER CONTROL ── */}
        <Section id="autonomy-control" className="bg-el-bg-raised/40">
          <div className="max-w-[700px]">
            <p className="el-eyebrow">
              <CipherText text="04 · AUTONOMY WITH HARD BOUNDARIES" />
            </p>
            <WordReveal
              as="h2"
              text="You decide how much autonomy ELEVEN gets."
              className="mt-3 el-h2"
            />
            <DualCopy
              className="mt-3 text-el-base leading-[1.65] text-el-fg-muted"
              plain="Choose between four clear control levels—from advice only to overnight autonomous jobs. Whenever ELEVEN wants to change a file or send a message, it shows you a 30-second receipt first."
              technical="Four distinct autonomy tiers (T0 Advisory through T3 Delegated). Enforced by host kernel boundary, Ed25519 tamper-evident audit receipts, and hardware-level Emergency Stop interrupt."
            />
          </div>

          <div className="mt-12">
            <AutonomyControlSection />
          </div>
        </Section>

        <AnimeCircuitStream />
        <SignalBeamDivider />

        {/* ── 06. PREMIUM EARLY ACCESS CLOSING SECTION ── */}
        <Section id="early-access">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-sm border border-el-border-strong bg-el-bg-raised p-8 shadow-el-lg sm:p-12 lg:p-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-el-accent/5 blur-3xl"
              />
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-el-border bg-el-bg px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-el-accent animate-pulse" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-el-fg-muted">
                      <CipherText text="EARLY ACCESS INVITATION" />
                    </span>
                  </div>
                  <WordReveal
                    as="h2"
                    text="Ready for personal AI that stays on your computer?"
                    className="mt-4 el-h2"
                  />
                  <ParagraphReveal
                    className="mt-4 max-w-[600px] text-el-base leading-[1.65] text-el-fg-muted"
                    text="Join the early access program to experience fast voice conversation, background project planning, private encrypted memory, and deterministic safety checkpoints—running entirely under your control."
                  />
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-el-xs font-mono text-el-fg-faint">
                    <span className="flex items-center gap-1.5">
                      <span className="text-el-accent">✓</span> Local-First Architecture
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-el-accent">✓</span> Zero Cloud Memory Lock-In
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-el-accent">✓</span> 5-Checkpoint Safety Policy
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3.5 lg:col-span-4 lg:items-end">
                  <WaitlistActionButton variant="primary" arrow tier="general" className="w-full sm:w-auto">
                    Join Early Access
                  </WaitlistActionButton>
                  <WaitlistActionButton variant="secondary" tier="technical" className="w-full sm:w-auto">
                    Request Technical Access
                  </WaitlistActionButton>
                  <PortalActionButton variant="ghost" className="w-full sm:w-auto">
                    Open Live 3D Orb
                  </PortalActionButton>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Section>
      </main>

      <Footer />
    </>
  );
}
