import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ScrollReveal, RevealItem } from "@/components/ui/ScrollReveal";
import { IntelligenceLoop } from "@/components/homepage/IntelligenceLoop";
import { Gyro3DEmbed } from "@/components/v3/Gyro3DEmbed";
import { ControlPlaneInteractive } from "@/components/v3/ControlPlaneInteractive";
import { AnimatedCapabilityShowcase } from "@/components/v3/AnimatedCapabilityShowcase";
import { PortalActionButton } from "@/components/v3/PortalActionButton";
import {
  AnimatedMetric,
  ClarityTogglePill,
  DualCopy,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";

export const metadata: Metadata = {
  title: "ELEVEN v3 — Brilliant AI. Always Under Your Control.",
  description:
    "Talk naturally, get deep work done in the background, keep your memories private on your own computer, and approve important actions before they happen.",
};

const MEMORY_DRAWERS = [
  {
    badge: "DRAWER 01 · RIGHT NOW",
    plainTitle: "Short-Term Focus",
    techTitle: "Working Memory · Redis (:6379)",
    speed: "<5ms",
    plainDesc:
      "Remembers what you’re talking about right this second—so you can say 'change that to Friday' without repeating yourself.",
    techDesc:
      "Loopback Redis working state holding active TaskSpec scopes, turn tokens, and session byte budgets.",
  },
  {
    badge: "DRAWER 02 · TIMELINE",
    plainTitle: "Life & Project History",
    techTitle: "Episodic Graph · Neo4j (:7687)",
    speed: "<25ms",
    plainDesc:
      "Keeps a clean timeline of past decisions—knowing both what changed and when—so old facts are never silently overwritten.",
    techDesc:
      "Bi-temporal Neo4j graph tracking valid_time alongside transaction_time for tamper-evident history.",
  },
  {
    badge: "DRAWER 03 · SMART SEARCH",
    plainTitle: "Exact + Meaning Search",
    techTitle: "Semantic Vector · Qdrant RRF (:6333)",
    speed: "<20ms",
    plainDesc:
      "Finds notes whether you remember the general idea OR an exact invoice number—combining meaning search with exact word matching.",
    techDesc:
      "Qdrant hybrid dense embeddings + sparse BM25 lexical search fused via Reciprocal Rank Fusion (k = 60).",
  },
  {
    badge: "DRAWER 04 · SKILLS",
    plainTitle: "Trusted Workflows",
    techTitle: "Procedural Vault · Signed Registry",
    speed: "<10ms",
    plainDesc:
      "Stores step-by-step routines you’ve approved and verified—locked with bank-grade encryption so random websites can’t alter them.",
    techDesc:
      "Cryptographically signed procedural playbooks protected inside the AES-256-GCM Sovereign Memory Vault.",
  },
];

export default function HomePage() {
  return (
    <>
      <Nav />

      <main>
        {/* ── 01. HERO + INTERACTIVE 3D MODEL ── */}
        <Section className="pt-10 pb-20 lg:pt-16 lg:pb-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Left 7 Columns */}
            <div className="lg:col-span-7">
              <ScrollReveal direction="up" duration={0.55}>
                <div className="inline-flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-el-border bg-el-bg-raised px-3.5 py-1.5 shadow-el-sm">
                    <span className="h-2 w-2 rounded-full bg-el-accent animate-pulse" />
                    <span className="font-mono text-el-xs uppercase tracking-[0.09em] text-el-fg-muted">
                      ELEVEN v3.1 · PERSONAL AI OPERATING SYSTEM
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              <WordReveal
                as="h1"
                text="Brilliant AI."
                mutedText="Always under your control."
                className="mt-7 text-el-5xl font-medium leading-[1.04] tracking-[-0.035em] text-el-fg"
              />

              <ScrollReveal delay={0.18}>
                <DualCopy
                  className="mt-6 max-w-[600px] text-el-lg leading-[1.62] text-el-fg-muted"
                  plain="Most AI tools ask you to hand over your files, passwords, and privacy—and just hope nothing goes wrong. ELEVEN puts a protective smart layer on your own computer: talk naturally, get deep work done, and approve important actions before they happen."
                  technical="ELEVEN is the local-first control plane between people, untrusted frontier models, sovereign memory, and real-world actions. Models emit candidate ActionProposals; deterministic host policy verifies; humans retain final authority."
                />
              </ScrollReveal>

              <ScrollReveal
                delay={0.28}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <PortalActionButton variant="primary" arrow>
                  Try the Live 3D Orb
                </PortalActionButton>
                <Button href="/eleven" variant="secondary">
                  See How It Thinks
                </Button>
              </ScrollReveal>

              {/* Animated Metrics Bar */}
              <ScrollReveal
                delay={0.36}
                className="mt-12 grid grid-cols-2 gap-6 border-t border-el-border pt-7 sm:grid-cols-4"
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

            {/* Right 5 Columns: Interactive 3D Gyroscope */}
            <ScrollReveal
              direction="left"
              delay={0.15}
              className="lg:col-span-5"
            >
              <Gyro3DEmbed />
            </ScrollReveal>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── 02. SIMPLE CORE IDEA + 8 ANIMATED CAPABILITIES ── */}
        <Section>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-[660px]">
              <p className="font-mono text-el-xs uppercase tracking-[0.1em] text-el-accent">
                01 · EVERYTHING ELEVEN CAN DO
              </p>
              <WordReveal
                as="h2"
                text="Superhuman help, explained simply."
                className="mt-3 text-el-3xl font-medium leading-[1.12] tracking-[-0.025em] text-el-fg"
              />
              <DualCopy
                className="mt-3 text-el-base leading-[1.65] text-el-fg-muted"
                plain="Think of ELEVEN like hiring the world’s smartest assistant—while keeping the keys to your house, bank, and folders safely in your own pocket. Hover over any card below."
                technical="Conventional wrappers pass shell handles and credentials directly to LLMs. ELEVEN quarantines models inside an untrusted reasoning boundary backed by 8 core subsystems."
              />
            </div>

            <div className="flex flex-col items-start gap-1.5 lg:items-end">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-el-fg-faint">
                Switch explanation depth anytime
              </span>
              <ClarityTogglePill />
            </div>
          </div>

          <AnimatedCapabilityShowcase />
        </Section>

        <SignalBeamDivider />

        {/* ── 03. TWO MINDS WORKING TOGETHER ── */}
        <Section className="bg-el-bg-raised/50">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-el-xs uppercase tracking-[0.1em] text-el-accent">
                02 · TWO BRAINS ARE BETTER THAN ONE
              </p>
              <WordReveal
                as="h2"
                text="One brain chats right away. The second solves hard problems."
                className="mt-3 text-el-3xl font-medium leading-[1.12] tracking-[-0.025em] text-el-fg"
              />
              <DualCopy
                className="mt-4 max-w-[600px] text-el-base leading-[1.65] text-el-fg-muted"
                plain="Ever ask a voice assistant a hard question and stare at a spinning wheel for 20 seconds? ELEVEN never leaves you hanging—because talking and heavy thinking run in two separate lanes."
                technical="Single-loop voice agents block capture and synthesis whenever tool execution starts. ELEVEN decouples System 1 (eleven_voice) from System 2 (eleven_deep) across an asynchronous event bus."
              />

              <ScrollReveal
                stagger={0.1}
                className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <RevealItem>
                  <Tilt3DCard className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-el-xs font-semibold text-el-accent">
                        MIND 1 · QUICK VOICE
                      </span>
                      <span className="font-mono text-[10px] text-el-fg-faint">
                        F.R.I.D.A.Y.
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-el-base font-medium text-el-fg">
                      Always Ready to Talk
                    </h3>
                    <DualCopy
                      className="mt-2 text-el-xs leading-[1.6] text-el-fg-muted"
                      plain="Answers everyday questions in under half a second, lets you interrupt mid-sentence, and keeps you updated while bigger jobs finish."
                      technical="16kHz PCM ring buffer, >30dB AEC, non-blocking candidate ASR snapshots, Speculative Audio Bridge, and <50ms waveOutReset barge-in."
                    />
                  </Tilt3DCard>
                </RevealItem>

                <RevealItem>
                  <Tilt3DCard className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-el-xs font-semibold text-el-accent">
                        MIND 2 · DEEP PLANNER
                      </span>
                      <span className="font-mono text-[10px] text-el-fg-faint">
                        J.A.R.V.I.S.
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-el-base font-medium text-el-fg">
                      Heavy Lifting in the Background
                    </h3>
                    <DualCopy
                      className="mt-2 text-el-xs leading-[1.6] text-el-fg-muted"
                      plain="Breaks big goals—like researching 20 articles or fixing code—into smaller steps, checks the facts, and reports back when ready."
                      technical="Executes GovernedTaskEngine DAGs across Claude/GPT/DeepSeek/local models, verifying worker outputs through SwarmTournament Ed25519 gates."
                    />
                  </Tilt3DCard>
                </RevealItem>
              </ScrollReveal>

              <div className="mt-7">
                <Button href="/eleven" variant="secondary" arrow>
                  See How the Two Minds Work
                </Button>
              </div>
            </div>

            <ScrollReveal
              direction="left"
              delay={0.15}
              className="flex justify-center lg:col-span-5 lg:justify-end"
            >
              <IntelligenceLoop />
            </ScrollReveal>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── 04. INTERACTIVE 5 SAFETY CHECKPOINTS WALKTHROUGH ── */}
        <Section>
          <div className="mb-10 max-w-[680px]">
            <p className="font-mono text-el-xs uppercase tracking-[0.1em] text-el-accent">
              03 · FIVE AUTOMATIC SAFETY CHECKPOINTS
            </p>
            <WordReveal
              as="h2"
              text="No AI touches your files without passing 5 guards."
              className="mt-3 text-el-3xl font-medium leading-[1.12] tracking-[-0.025em] text-el-fg"
            />
            <DualCopy
              className="mt-3 text-el-base leading-[1.65] text-el-fg-muted"
              plain="Watch the automatic tour below—or click any step—to see how a simple request gets checked, cleaned of private passwords, and safely carried out."
              technical="Inspect any stage of the unidirectional Control Plane to review input contracts, emitted artifacts, and trust-boundary enforcement."
            />
          </div>

          <ScrollReveal>
            <ControlPlaneInteractive />
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── 05. 4-DRAWER PRIVATE MEMORY ON YOUR COMPUTER ── */}
        <Section>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-[640px]">
              <p className="font-mono text-el-xs uppercase tracking-[0.1em] text-el-accent">
                04 · YOUR MEMORY BELONGS TO YOU
              </p>
              <WordReveal
                as="h2"
                text="Four organized memory drawers—kept safely on your computer."
                className="mt-3 text-el-3xl font-medium leading-[1.12] tracking-[-0.025em] text-el-fg"
              />
              <DualCopy
                className="mt-3 text-el-base leading-[1.65] text-el-fg-muted"
                plain="Chatbots trap your life’s notes inside their own cloud servers. ELEVEN stores your memory privately on your machine—so you can switch AI models anytime and never start from scratch."
                technical="DEC-004 binds all four persistent memory tiers strictly to 127.0.0.1 loopback with AES-256-GCM encryption and automatic local fallback."
              />
            </div>
            <Button href="/architecture" variant="secondary">
              Explore System Design
            </Button>
          </div>

          <ScrollReveal
            stagger={0.08}
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {MEMORY_DRAWERS.map((m) => (
              <RevealItem key={m.badge} className="h-full">
                <Tilt3DCard className="p-6">
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10.5px] font-semibold text-el-accent">
                          {m.badge}
                        </span>
                        <span className="rounded-sm bg-el-bg px-2 py-0.5 font-mono text-[10px] text-el-fg-faint">
                          {m.speed}
                        </span>
                      </div>
                      <DualCopy
                        as="div"
                        className="mt-3 text-el-base font-medium text-el-fg"
                        plain={m.plainTitle}
                        technical={m.techTitle}
                      />
                      <DualCopy
                        className="mt-2.5 text-el-xs leading-[1.65] text-el-fg-muted"
                        plain={m.plainDesc}
                        technical={m.techDesc}
                      />
                    </div>
                    <div className="mt-5 border-t border-el-border pt-3 font-mono text-[10px] text-el-fg-faint">
                      ENCRYPTED ON YOUR PC · NEVER SOLD
                    </div>
                  </div>
                </Tilt3DCard>
              </RevealItem>
            ))}
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── 06. SIMPLE COMPARISON TABLE ── */}
        <Section>
          <div className="max-w-[660px]">
            <p className="font-mono text-el-xs uppercase tracking-[0.1em] text-el-accent">
              05 · HOW ELEVEN COMPARES
            </p>
            <WordReveal
              as="h2"
              text="Why ELEVEN feels completely different from ordinary AI."
              className="mt-3 text-el-3xl font-medium leading-[1.12] tracking-[-0.025em] text-el-fg"
            />
          </div>

          <ScrollReveal className="mt-10 overflow-x-auto rounded-sm border border-el-border bg-el-bg-raised shadow-el-sm">
            <table className="w-full min-w-[720px] border-collapse text-left text-el-xs">
              <thead>
                <tr className="border-b border-el-border bg-el-bg font-mono text-[11px] uppercase tracking-[0.07em] text-el-fg-faint">
                  <th className="p-4">What Matters to You</th>
                  <th className="p-4">Smart Speakers</th>
                  <th className="p-4">Chat Websites</th>
                  <th className="p-4">Reckless Auto-Agents</th>
                  <th className="p-4 text-el-accent">ELEVEN v3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-el-border text-el-fg-muted">
                <tr className="transition-colors hover:bg-el-bg/60">
                  <td className="p-4 font-medium text-el-fg">Who holds the keys?</td>
                  <td className="p-4">Preset commands only</td>
                  <td className="p-4">Manual copy-paste</td>
                  <td className="p-4">AI gets raw access (risky!)</td>
                  <td className="p-4 font-medium text-el-fg">
                    AI suggests · Your PC guards
                  </td>
                </tr>
                <tr className="transition-colors hover:bg-el-bg/60">
                  <td className="p-4 font-medium text-el-fg">Before deleting or sending</td>
                  <td className="p-4">Easy to mishear &ldquo;Yes&rdquo;</td>
                  <td className="p-4">AI explains itself</td>
                  <td className="p-4">Acts without asking</td>
                  <td className="p-4 font-medium text-el-fg">
                    Shows an honest 30s safety receipt
                  </td>
                </tr>
                <tr className="transition-colors hover:bg-el-bg/60">
                  <td className="p-4 font-medium text-el-fg">Talking while working</td>
                  <td className="p-4">Fast, but can’t do deep work</td>
                  <td className="p-4">Slow typing back &amp; forth</td>
                  <td className="p-4">Freezes while running tools</td>
                  <td className="p-4 font-medium text-el-fg">
                    Instant voice + background planner
                  </td>
                </tr>
                <tr className="transition-colors hover:bg-el-bg/60">
                  <td className="p-4 font-medium text-el-fg">Where memories live</td>
                  <td className="p-4">Big-tech cloud servers</td>
                  <td className="p-4">Locked in one vendor’s app</td>
                  <td className="p-4">Messy text logs</td>
                  <td className="p-4 font-medium text-el-fg">
                    Encrypted on your own computer
                  </td>
                </tr>
              </tbody>
            </table>
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── 07. CLOSING PORTAL CTA ── */}
        <Section>
          <ScrollReveal>
            <div className="rounded-sm border border-el-border-strong bg-el-bg-raised p-8 shadow-el-lg sm:p-12 lg:p-16">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <p className="font-mono text-el-xs uppercase tracking-[0.12em] text-el-accent">
                    INTERACTIVE 3D PLAYGROUND
                  </p>
                  <h2 className="mt-3 text-el-3xl font-medium leading-[1.12] tracking-[-0.025em] text-el-fg">
                    See ELEVEN come alive in 3D.
                  </h2>
                  <p className="mt-4 max-w-[580px] text-el-base leading-[1.65] text-el-fg-muted">
                    Step inside our live 3D Holographic Orb: click through all 7 states, launch 4 orbiting helper satellites, test a mid-sentence voice interruption, and try approving a safety receipt yourself.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 lg:col-span-4 lg:justify-end">
                  <PortalActionButton variant="primary" arrow>
                    Open Live 3D Orb
                  </PortalActionButton>
                  <Button href="/autonomy" variant="secondary">
                    See Safety Controls
                  </Button>
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
