import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ScrollReveal, RevealItem } from "@/components/ui/ScrollReveal";
import { Gyro3DEmbed } from "@/components/v3/Gyro3DEmbed";
import { ControlPlaneInteractive } from "@/components/v3/ControlPlaneInteractive";
import { PortalActionButton } from "@/components/v3/PortalActionButton";
import {
  ClarityTogglePill,
  DualCopy,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";

export const metadata: Metadata = {
  title: "How It Works — Inside the Safety Layers | ELEVEN v3",
  description:
    "A clear visual guide to how ELEVEN is built: four separate rooms so nothing freezes, five safety checkpoints, and private encrypted memory on your computer.",
  alternates: {
    canonical: "/architecture",
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
      name: "Architecture",
      item: "https://eleven-website-self.vercel.app/architecture",
    },
  ],
};

const FOUR_ROOMS = [
  {
    room: "ROOM 1 · SAFETY WATCHDOG",
    proc: "eleven_supervisor",
    plainRole: "The Building Security Guard",
    plainDesc:
      "Watches over everything, keeps an uneditable activity log, and powers your 0.05-second Emergency Stop button.",
    techDesc:
      "Privileged host coordinator managing child lifecycles, global Ctrl+Alt+Shift+K hardware interrupts (<50ms), and SHA-256 hash-chained audit logs.",
  },
  {
    room: "ROOM 2 · VOICE STUDIO",
    proc: "eleven_voice",
    plainRole: "Dedicated Soundproof Microphone Room",
    plainDesc:
      "Only handles listening and speaking—so even if a huge file job is running elsewhere, your voice conversation never stutters.",
    techDesc:
      "Dedicated 16kHz PCM ring buffer, >30dB echo cancellation, Silero VAD, bounded candidate ASR worker, and low-jitter WASAPI output.",
  },
  {
    room: "ROOM 3 · PLANNING WORKSHOP",
    proc: "eleven_deep",
    plainRole: "The Locked Research & Tool Room",
    plainDesc:
      "Where AI suggestions are checked against the 5 safety gates and carried out inside restricted sandboxes.",
    techDesc:
      "Hosts TaskCompiler, DataMinimizer, ModelRouter, PolicyGate, GovernedTaskEngine DAG scheduler, and SwarmTournamentGate.",
  },
  {
    room: "ROOM 4 · YOUR CONTROL SCREEN",
    proc: "eleven_hud",
    plainRole: "Your Honest Dashboard & 3D Orb",
    plainDesc:
      "Shows you what ELEVEN is doing in real time and displays tamper-proof approval receipts that AI models cannot fake.",
    techDesc:
      "Renders the Three.js GLSL Holographic Visualizer and deterministic Protocol D DEC-008 approval surfaces isolated from LLM prose.",
  },
];

const SEVEN_LAYERS = [
  {
    num: "07",
    plainName: "Your Screen & Honest Receipts",
    techName: "Operator Surface & Cold-Room HUD",
    plainSpec: "Shows live 3D status and clean approval cards without AI smooth-talking.",
    techSpec: "Three.js WebGL Orb · Protocol D DEC-008 Viewport · Killswitch Hotkey",
  },
  {
    num: "06",
    plainName: "Natural Listening & Voice",
    techName: "Duplex Acoustic & Speculative Voice",
    plainSpec: "Hears you clearly and stops talking immediately when you interrupt.",
    techSpec: "16kHz Ring Buffer · >30dB AEC · Hybrid Silero VAD · Async Candidate ASR",
  },
  {
    num: "05",
    plainName: "Fast Bridge Between Both Brains",
    techName: "Dual-Mind Synchronization Bus",
    plainSpec: "Lets Quick Voice chat with you while Deep Planner works in the back.",
    techSpec: "Typed Async Mind Event Bus · Epoch Turn Tokens · TaskHandoff Streams",
  },
  {
    num: "04",
    plainName: "Five Safety Checkpoints",
    techName: "5-Stage AI Control Plane",
    plainSpec: "Hides passwords, checks folder limits, and blocks risky surprises.",
    techSpec: "TaskCompiler → DataMinimizer → ModelRouter → PolicyGate → ExecutionController",
  },
  {
    num: "03",
    plainName: "Helper Fact-Checker",
    techName: "SwarmTournament Evidence Gate",
    plainSpec: "Requires real proof from AI helpers—never guesses by majority vote.",
    techSpec: "Ed25519 Signatures · SHA-256 Digest · 300s TTL · Zero Majority Vote",
  },
  {
    num: "02",
    plainName: "Locked Tool Sandbox",
    techName: "Sandboxed Worker Runtime",
    plainSpec: "Runs approved tasks inside strict folder and internet boundaries.",
    techSpec: "Canonical Root Confinement · Default-Deny Egress · Subprocess Watchdogs",
  },
  {
    num: "01",
    plainName: "Encrypted Local Memory Vault",
    techName: "Loopback Sovereign Memory Vault",
    plainSpec: "Stores all your notes, history, and skills privately on your own PC.",
    techSpec: "127.0.0.1 Redis + Bi-Temporal Neo4j + Qdrant Hybrid RRF + AES-256-GCM",
  },
];

export default function ArchitecturePage() {
  return (
    <>
      <Nav />

      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {/* ── HERO + COMPACT 3D MODEL ── */}
        <Section className="pt-12 pb-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-el-xs uppercase tracking-[0.12em] text-el-accent">
                  HOW ELEVEN IS BUILT
                </p>
                <ClarityTogglePill />
              </div>

              <WordReveal
                as="h1"
                text="Built like a vault."
                mutedText="Effortless like a conversation."
                className="mt-4 text-el-4xl font-medium leading-[1.06] tracking-[-0.03em] text-el-fg"
              />
              <DualCopy
                className="mt-6 max-w-[620px] text-el-lg leading-[1.6] text-el-fg-muted"
                plain="Most AI apps are just a chat box connected directly to your data—if the AI gets confused, everything is at risk. ELEVEN separates voice, thinking, safety checks, and memory into independent protected rooms on your computer."
                technical="ELEVEN v3 isolates acoustic capture, untrusted model reasoning, deterministic policy verification, and loopback memory into separate OS fault domains with fail-closed contracts."
              />

              <div className="mt-8 flex flex-wrap gap-4">
                <PortalActionButton variant="primary" arrow>
                  Explore Live 3D Orb
                </PortalActionButton>
                <Button href="/autonomy" variant="secondary">
                  See Approval Controls
                </Button>
              </div>
            </div>

            <ScrollReveal direction="left" delay={0.15} className="lg:col-span-5">
              <Gyro3DEmbed compact />
            </ScrollReveal>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── FOUR SEPARATE ROOMS (PROCESS ISOLATION) ── */}
        <Section className="bg-el-bg-raised/45">
          <div className="max-w-[680px]">
            <p className="font-mono text-el-xs uppercase tracking-[0.1em] text-el-accent">
              01 · FOUR SEPARATE ROOMS
            </p>
            <WordReveal
              as="h2"
              text="Why one busy task can never freeze or hijack ELEVEN."
              className="mt-3 text-el-3xl font-medium leading-[1.12] tracking-[-0.025em] text-el-fg"
            />
            <DualCopy
              className="mt-3 text-el-base leading-[1.65] text-el-fg-muted"
              plain="Think of ELEVEN as four separate rooms in a secure building. Even if the Workshop room is busy crunching a massive folder, the Voice Studio and Security Guard stay 100% responsive."
              technical="A runaway model stream or tool timeout in eleven_deep can never starve acoustic barge-in in eleven_voice or block supervisor hardware interrupts."
            />
          </div>

          <ScrollReveal
            stagger={0.08}
            className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {FOUR_ROOMS.map((p) => (
              <RevealItem key={p.proc} className="h-full">
                <Tilt3DCard className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-el-border pb-3">
                    <span className="font-mono text-el-xs font-semibold text-el-accent">
                      {p.room}
                    </span>
                    <code className="font-mono text-[11px] text-el-fg-faint">
                      {p.proc}
                    </code>
                  </div>
                  <h3 className="mt-3.5 text-el-base font-medium text-el-fg">
                    {p.plainRole}
                  </h3>
                  <DualCopy
                    className="mt-2 text-el-xs leading-[1.65] text-el-fg-muted"
                    plain={p.plainDesc}
                    technical={p.techDesc}
                  />
                </Tilt3DCard>
              </RevealItem>
            ))}
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── INTERACTIVE 5 SAFETY CHECKPOINTS ── */}
        <Section>
          <ScrollReveal>
            <ControlPlaneInteractive />
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── 7 CLEAR LAYERS STACK ── */}
        <Section>
          <div className="max-w-[680px]">
            <p className="font-mono text-el-xs uppercase tracking-[0.1em] text-el-accent">
              02 · TOP-TO-BOTTOM STACK
            </p>
            <WordReveal
              as="h2"
              text="Seven layers from your microphone down to your private vault."
              className="mt-3 text-el-3xl font-medium leading-[1.12] tracking-[-0.025em] text-el-fg"
            />
          </div>

          <ScrollReveal className="mt-10 divide-y divide-el-border rounded-sm border border-el-border bg-el-bg-raised shadow-el-sm">
            {SEVEN_LAYERS.map((layer) => (
              <div
                key={layer.num}
                className="grid grid-cols-1 items-baseline gap-2 p-5 transition-colors hover:bg-el-bg/60 sm:grid-cols-12 lg:px-7"
              >
                <span className="font-mono text-el-xs font-semibold text-el-accent sm:col-span-1">
                  L{layer.num}
                </span>
                <DualCopy
                  as="div"
                  className="text-el-base font-medium text-el-fg sm:col-span-4"
                  plain={layer.plainName}
                  technical={layer.techName}
                />
                <DualCopy
                  className="text-el-xs text-el-fg-muted sm:col-span-7"
                  plain={layer.plainSpec}
                  technical={layer.techSpec}
                />
              </div>
            ))}
          </ScrollReveal>
        </Section>
      </main>

      <Footer />
    </>
  );
}
