import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ScrollReveal, RevealItem } from "@/components/ui/ScrollReveal";
import { Gyro3DEmbed } from "@/components/v3/Gyro3DEmbed";
import { ControlPlaneInteractive } from "@/components/v3/ControlPlaneInteractive";
import { PortalActionButton } from "@/components/v3/PortalActionButton";
import { ExplodedLayerStack3D } from "@/components/security/ExplodedLayerStack3D";
import {
  ClarityTogglePill,
  DualCopy,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";

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
    room: "Room 01 · Safety Watchdog",
    proc: "eleven_supervisor",
    plainRole: "The Building Security Guard",
    plainDesc:
      "Watches over everything, keeps an uneditable activity log, and powers your 0.05-second Emergency Stop button.",
    techDesc:
      "Privileged host coordinator managing child lifecycles, global Ctrl+Alt+Shift+K hardware interrupts (<50ms), and SHA-256 hash-chained audit logs.",
  },
  {
    room: "Room 02 · Voice Studio",
    proc: "eleven_voice",
    plainRole: "Dedicated Soundproof Microphone Room",
    plainDesc:
      "Only handles listening and speaking—so even if a huge file job is running elsewhere, your voice conversation never stutters.",
    techDesc:
      "Dedicated 16kHz PCM ring buffer, >30dB echo cancellation, Silero VAD, bounded candidate ASR worker, and low-jitter WASAPI output.",
  },
  {
    room: "Room 03 · Planning Workshop",
    proc: "eleven_deep",
    plainRole: "The Locked Research & Tool Room",
    plainDesc:
      "Where AI suggestions are checked against the 5 safety gates and carried out inside restricted sandboxes.",
    techDesc:
      "Hosts TaskCompiler, DataMinimizer, ModelRouter, PolicyGate, GovernedTaskEngine DAG scheduler, and SwarmTournamentGate.",
  },
  {
    room: "Room 04 · Your Control Screen",
    proc: "eleven_hud",
    plainRole: "Your Honest Dashboard & 3D Orb",
    plainDesc:
      "Shows you what ELEVEN is doing in real time and displays tamper-proof approval receipts that AI models cannot fake.",
    techDesc:
      "Renders the Three.js GLSL Holographic Visualizer and deterministic Protocol D DEC-008 approval surfaces isolated from LLM prose.",
  },
];

export default function ArchitecturePage() {
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
        {/* ── HERO + COMPACT 3D MODEL ── */}
        <Section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent opacity-60"
          />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-el-border">
              <Breadcrumbs
                items={[
                  { label: "How It Works", href: "/architecture" },
                ]}
              />
              <div className="flex items-center gap-3">
                <span className="text-xs text-el-fg-faint font-sans">
                  Terminology depth:
                </span>
                <ClarityTogglePill />
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-el-border bg-el-sec-graphite-deep px-3.5 py-1 text-xs font-medium text-el-sec-porcelain">
                  <span className="h-1.5 w-1.5 rounded-full bg-el-sec-lime motion-safe:animate-pulse motion-reduce:animate-none" />
                  <span>Fault-Isolated Architecture · 4 OS Process Domains</span>
                </div>

                <h1 className="el-h1">
                  <WordReveal text="Built like a vault. Effortless like a conversation." />
                </h1>

                <DualCopy
                  className="el-lead max-w-3xl"
                  plain="Most AI apps are just a chat box connected directly to your data—if the AI gets confused, everything is at risk. ELEVEN separates voice, thinking, safety checks, and memory into independent protected rooms on your computer."
                  technical="ELEVEN v3 isolates acoustic capture, untrusted model reasoning, deterministic policy verification, and loopback memory into separate OS fault domains with fail-closed contracts."
                />

                <ScrollReveal
                  stagger={0.08}
                  className="flex flex-wrap gap-2 pt-2 text-xs"
                >
                  <RevealItem>
                    <span className="inline-block rounded-sm border border-el-sec-lime/30 bg-el-sec-lime/10 px-2.5 py-1 text-el-sec-lime font-medium">
                      4 OS process rooms (INV-01)
                    </span>
                  </RevealItem>
                  <RevealItem>
                    <span className="inline-block rounded-sm border border-el-border bg-el-sec-graphite-deep px-2.5 py-1 text-el-fg-muted">
                      5 safety checkpoints (INV-04)
                    </span>
                  </RevealItem>
                  <RevealItem>
                    <span className="inline-block rounded-sm border border-el-border bg-el-sec-graphite-deep px-2.5 py-1 text-el-fg-muted">
                      Loopback-only memory (127.0.0.1)
                    </span>
                  </RevealItem>
                </ScrollReveal>

                <div className="pt-2 flex flex-wrap gap-4">
                  <PortalActionButton variant="primary" arrow>
                    Explore Live 3D Orb
                  </PortalActionButton>
                  <Button href="/autonomy" variant="secondary" arrow className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime active:scale-[0.99] disabled:opacity-50">
                    See Approval Controls
                  </Button>
                </div>
              </div>

              <ScrollReveal direction="left" delay={0.15} className="lg:col-span-5">
                <Gyro3DEmbed compact />
              </ScrollReveal>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── FOUR SEPARATE ROOMS (PROCESS ISOLATION) ── */}
        <Section id="rooms" className="relative py-16 lg:py-24 bg-el-sec-graphite-deep/60">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="text-xs font-medium text-el-sec-lime">
              01 · Process isolation & memory zoning
            </div>
            <h2 className="el-h2">
              <WordReveal text="Why one busy task can never freeze or hijack ELEVEN." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Think of ELEVEN as four separate rooms in a secure building. Even if the Workshop room is busy crunching a massive folder, the Voice Studio and Security Guard stay 100% responsive."
              technical="A runaway model stream or tool timeout in eleven_deep can never starve acoustic barge-in in eleven_voice or block supervisor hardware interrupts."
            />
          </div>

          <ScrollReveal
            stagger={0.08}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {FOUR_ROOMS.map((p) => (
              <RevealItem key={p.proc} className="h-full">
                <Tilt3DCard className="p-6 rounded-md border border-el-border bg-el-sec-graphite/80 shadow-sm transition-colors duration-200 hover:border-el-border-strong">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-el-border pb-3">
                    <span className="text-xs font-medium text-el-sec-lime">
                      {p.room}
                    </span>
                    <code className="font-mono text-xs text-el-fg-faint">
                      {p.proc}
                    </code>
                  </div>
                  <h3 className="mt-3.5 text-base font-semibold text-el-sec-porcelain">
                    {p.plainRole}
                  </h3>
                  <DualCopy
                    className="mt-2 text-xs leading-relaxed text-el-fg-muted"
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
        <Section className="py-16 lg:py-24">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="text-xs font-medium text-el-sec-lime">
              02 · Five-stage control plane
            </div>
            <h2 className="el-h2">
              <WordReveal text="Five deterministic gates between AI ideas and your computer." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Explore how ELEVEN filters, rewrites, checks, and executes requests through five un-bypassable checkpoints before touching your files."
              technical="Interactive simulation of TaskCompiler, DataMinimizer, ModelRouter, PolicyGate, and ExecutionController state machines."
            />
          </div>
          <ScrollReveal>
            <ControlPlaneInteractive />
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── 7 CLEAR LAYERS STACK (SCROLL-SCRUBBED 3D EXPLODED STACK) ── */}
        <Section id="exploded-layer-stack" className="py-16 lg:py-24">
          <div className="flex flex-col justify-between gap-6 mb-10 lg:flex-row lg:items-end">
            <div className="max-w-3xl space-y-4">
              <div className="text-xs font-medium text-el-sec-lime">
                03 · Top-to-bottom stack
              </div>
              <h2 className="el-h2">
                <WordReveal text="Seven layers from your microphone down to your private vault." />
              </h2>
              <DualCopy
                className="el-body"
                plain="Scroll through our exploded 3D stack—or select any layer—to see how voice capture, thinking, safety checks, and encrypted memory separate and reconnect."
                technical="Scroll-scrubbed 3D vertical taxonomy from Operator HUD (L07) down to 127.0.0.1 Loopback Vault (L01), rendered on-demand with static reduced-motion and WebGL fallbacks."
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/security#flagship-security-showcase" variant="secondary" arrow className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime">
                Interactive Security Simulation
              </Button>
            </div>
          </div>

          <ExplodedLayerStack3D />
        </Section>
      </main>

      <Footer />
    </>
  );
}
