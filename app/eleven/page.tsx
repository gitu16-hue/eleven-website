import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ScrollReveal, RevealItem } from "@/components/ui/ScrollReveal";
import { DualMindSynchronizer } from "@/components/v3/DualMindSynchronizer";
import { PortalActionButton } from "@/components/v3/PortalActionButton";
import {
  CipherText,
  ClarityTogglePill,
  DualCopy,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";

export const metadata: Metadata = {
  title: "How It Thinks: Two Brains & Natural Voice | ELEVEN v3",
  description:
    "Discover how ELEVEN talks naturally without freezing: a Quick Voice mind for instant conversation and a Deep Planner mind for heavy background work.",
  alternates: {
    canonical: "/eleven",
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
      name: "How It Thinks",
      item: "https://eleven-website-self.vercel.app/eleven",
    },
  ],
};

const VOICE_STEPS = [
  {
    step: "01",
    plainTitle: "Catches Every Word (Even the Start)",
    techTitle: "2.0s 16kHz PCM Ring Buffer",
    plainDesc:
      "Keeps a rolling 2-second memory of sound so the very first syllable you speak is never clipped off.",
    techDesc:
      "Lock-free 16kHz mono ring buffer preserving pre-roll speech onset frames without heap churn.",
  },
  {
    step: "02",
    plainTitle: "Filters Out Its Own Speaker Sound",
    techTitle: ">30dB Acoustic Echo Cancellation",
    plainDesc:
      "Knows the difference between its own voice playing from your speakers and YOUR voice interrupting.",
    techDesc:
      "Subtracts active neural TTS reference playback (>30dB suppression) for clean full-duplex barge-in.",
  },
  {
    step: "03",
    plainTitle: "Waits Politely When You Pause to Think",
    techTitle: "Hybrid Silero VAD + Safe 380ms Fallback",
    plainDesc:
      "Doesn't rudely jump in just because you took a quick breath or paused mid-thought.",
    techDesc:
      "Tracks speech onset and trailing-word safety with deterministic fallback to 380ms whenever uncertain.",
  },
  {
    step: "04",
    plainTitle: "Transcribes Without Slowing Down",
    techTitle: "Non-Blocking Async Candidate ASR",
    plainDesc:
      "Turns speech into text in a separate background lane so live listening stays silky smooth.",
    techDesc:
      "Runs speculative recognition on immutable audio snapshots in a bounded worker thread.",
  },
  {
    step: "05",
    plainTitle: "Acknowledges You Right Away",
    techTitle: "Turn-Validated Speculative Audio Bridge",
    plainDesc:
      "Lets you know it heard you immediately while handing bigger research or coding jobs to the Deep Planner.",
    techDesc:
      "Bridges immediate System 1 acknowledgment while System 2 compiles and runs GovernedTaskEngine DAGs.",
  },
  {
    step: "06",
    plainTitle: "Stops Talking the Instant You Speak",
    techTitle: "<50ms Hardware waveOutReset Flush",
    plainDesc:
      "Say 'Wait, actually' and ELEVEN goes quiet in a twentieth of a second, throwing out outdated replies.",
    techDesc:
      "Flushes hardware DAC buffers in <50ms, increments turn epoch tokens, and invalidates stale ASR results.",
  },
];

const AI_LANES = [
  {
    lane: "Option 1: 100% Offline On Your Computer",
    providers: "Ollama · Local Voice & Vision Models",
    plainRole:
      "Works even on an airplane with Wi-Fi turned off: ideal for private notes and local commands.",
    techRole:
      "Zero-egress offline execution, privacy-critical intent classification, and disconnected resilience.",
  },
  {
    lane: "Option 2: High-Speed Sub-Second Voice",
    providers: "NVIDIA NIM · Groq · Streaming Voice",
    plainRole:
      "Delivers fast answers when you are brainstorming, after stripping any private tokens or passwords first.",
    techRole:
      "Sub-second conversational synthesis and rapid TaskSpec decomposition under DataMinimizer redaction.",
  },
  {
    lane: "Option 3: Advanced Cloud Reasoning",
    providers: "Claude · GPT · DeepSeek · Gemini",
    plainRole:
      "Brings in heavyweight reasoning for complex engineering or research, safely enclosed within ELEVEN's policy gates.",
    techRole:
      "Multi-file architecture synthesis and adversarial verification inside untrusted proposal sandboxes.",
  },
];

export default function ElevenIntelligencePage() {
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
        {/* ── HERO ── */}
        <Section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent opacity-60"
          />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-el-border/60">
              <Breadcrumbs
                items={[
                  { label: "How It Thinks", href: "/eleven" },
                ]}
              />
              <div className="flex items-center gap-3">
                <span className="text-el-xs font-medium text-el-fg-faint">
                  Terminology depth:
                </span>
                <ClarityTogglePill />
              </div>
            </div>

            <div className="mt-10 max-w-4xl space-y-6">
              <div className="el-badge shadow-el-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-el-accent animate-pulse motion-reduce:animate-none" />
                <CipherText text="Dual-Mind Cognition · Real-Time Conversation & Async Reasoning" />
              </div>

              <h1 className="el-h1">
                <WordReveal text="Talks at the speed of conversation. Thinks deeply without freezing." />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="Imagine talking to a friend while they cook dinner: they can answer you right away without burning the food. ELEVEN works the exact same way by splitting conversation and heavy work into two separate brains."
                technical="ELEVEN v3 bifurcates runtime cognition into two OS processes: System 1 (eleven_voice) and System 2 (eleven_deep), synchronized across a non-blocking Async Mind Event Bus."
              />

              <ScrollReveal
                stagger={0.08}
                className="flex flex-wrap gap-2 pt-2 text-[11px] font-medium"
              >
                <RevealItem>
                  <span className="inline-block rounded-xs border border-el-accent/30 bg-el-accent-soft px-2.5 py-1 text-el-accent">
                    Dual-Mind Architecture (INV-01)
                  </span>
                </RevealItem>
                <RevealItem>
                  <span className="inline-block rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg">
                    Sub-50ms Barge-In Target
                  </span>
                </RevealItem>
                <RevealItem>
                  <span className="inline-block rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                    Zero Model Vendor Lock-In
                  </span>
                </RevealItem>
              </ScrollReveal>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button
                  href="/benchmarks/voice-latency"
                  variant="primary"
                  arrow
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  View &lt;50ms Barge-In Benchmark
                </Button>
                <Button
                  href="/architecture"
                  variant="secondary"
                  arrow
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  Explore System Architecture
                </Button>
              </div>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── TWO MINDS SIDE BY SIDE ── */}
        <Section className="py-16 lg:py-24">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="el-eyebrow">
              <CipherText text="// 01 Dual-Mind Architecture" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Two minds side by side: Instant speech meets thorough planning." />
            </h2>
            <DualCopy
              className="el-body"
              plain="ELEVEN splits conversation and heavy problem solving so your voice interactions never lag or lock up."
              technical="Dual OS-level fault domains decouple real-time 16kHz audio sampling loops from deep DAG execution trees."
            />
          </div>
          <ScrollReveal
            stagger={0.12}
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            <RevealItem className="h-full">
              <Tilt3DCard className="p-7 lg:p-9">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-el-border pb-4">
                      <span className="text-el-xs font-semibold text-el-accent">
                        Brain 1: Quick Voice (F.R.I.D.A.Y.)
                      </span>
                      <span className="rounded-sm bg-el-bg px-2.5 py-1 text-[11px] font-medium text-el-fg-muted">
                        Fast &amp; Conversational
                      </span>
                    </div>

                    <h3 className="mt-5 text-el-2xl font-semibold text-el-fg">
                      Your Friendly Front-Desk Partner
                    </h3>
                    <DualCopy
                      className="mt-3 text-el-sm leading-[1.65] text-el-fg-muted"
                      plain="Focuses 100% on listening to you, replying warmly in about half a second, and letting you interrupt whenever you change your mind. It never gets bogged down doing heavy paperwork."
                      technical="Engineered for continuous 16kHz acoustic responsiveness, turn-token freshness, and <50ms hardware barge-in. Never executes blocking tool calls on the capture loop."
                    />

                    <ul className="mt-6 space-y-2.5 border-t border-el-border pt-5 text-el-xs text-el-fg">
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-el-accent" />
                        <span>Replies in ~0.5 seconds for everyday questions.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-el-accent" />
                        <span>Stops speaking in 0.05s the moment you jump in.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-el-accent" />
                        <span>Hands big projects off to Brain 2 automatically.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-7 flex flex-wrap items-center justify-between gap-2 border-t border-el-border pt-4 text-[11px] text-el-fg-faint">
                    <span>Role: Instant listening and natural speech</span>
                    <Button
                      variant="ghost"
                      href="/benchmarks/voice-latency"
                      className="text-[10.5px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                      arrow
                    >
                      View &lt;50ms Barge-In Benchmark
                    </Button>
                  </div>
                </div>
              </Tilt3DCard>
            </RevealItem>

            <RevealItem className="h-full">
              <Tilt3DCard className="p-7 lg:p-9">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-el-border pb-4">
                      <span className="text-el-xs font-semibold text-el-accent">
                        Brain 2: Deep Planner (J.A.R.V.I.S.)
                      </span>
                      <span className="rounded-sm bg-el-bg px-2.5 py-1 text-[11px] font-medium text-el-fg-muted">
                        Thorough &amp; Careful
                      </span>
                    </div>

                    <h3 className="mt-5 text-el-2xl font-semibold text-el-fg">
                      Your Quiet Research &amp; Engineering Team
                    </h3>
                    <DualCopy
                      className="mt-3 text-el-sm leading-[1.65] text-el-fg-muted"
                      plain="Works calmly behind the scenes on multi-step jobs: comparing documents, writing and testing code, double-checking facts across multiple AI helpers, and sending short progress updates."
                      technical="Executes structured GovernedTaskEngine DAGs across isolated worker sandboxes, multi-model routers, and Ed25519 SwarmTournament evidence gates."
                    />

                    <ul className="mt-6 space-y-2.5 border-t border-el-border pt-5 text-el-xs text-el-fg">
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-el-accent" />
                        <span>Breaks big goals into organized step-by-step checklists.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-el-accent" />
                        <span>Verifies proof from helpers; never guesses by majority vote.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-el-accent" />
                        <span>Pauses politely whenever an action needs your approval.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-7 border-t border-el-border pt-4 text-[11px] text-el-fg-faint">
                    Role: Deep research, coding and verified tasks
                  </div>
                </div>
              </Tilt3DCard>
            </RevealItem>
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── 6 STEPS OF NATURAL VOICE ── */}
        <Section className="py-16 lg:py-24 bg-el-bg-raised/45">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="el-eyebrow">
              <CipherText text="// 02 Natural Conversation Pipeline" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Six reasons talking to ELEVEN feels effortless." />
            </h2>
            <DualCopy
              className="el-body"
              plain="From acoustic noise cancellation to instant interruption, how human-like conversational turns are achieved."
              technical="Empirical audio pipeline steps including WASAPI exclusive buffers, Silero VAD gating, and turn-token epoch invalidation."
            />
          </div>

          <ScrollReveal
            stagger={0.07}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {VOICE_STEPS.map((item) => (
              <RevealItem key={item.step} className="h-full">
                <Tilt3DCard className="p-6">
                  <span className="text-xs font-semibold text-el-accent">
                    Step {item.step}
                  </span>
                  <DualCopy
                    as="div"
                    className="mt-2.5 text-base font-semibold text-el-fg"
                    plain={item.plainTitle}
                    technical={item.techTitle}
                  />
                  <DualCopy
                    className="mt-2 text-xs leading-relaxed text-el-fg-muted"
                    plain={item.plainDesc}
                    technical={item.techDesc}
                  />
                </Tilt3DCard>
              </RevealItem>
            ))}
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── INTERACTIVE VOICE SPEED + PROOF OVER VOTING DEMO ── */}
        <Section className="py-16 lg:py-24">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="el-eyebrow">
              <CipherText text="// 03 Synchronization Benchmark" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Simulate Dual-Mind Voice & Evidence Execution" />
            </h2>
            <DualCopy
              className="el-body"
              plain="Test how quickly ELEVEN stops talking when interrupted, and watch how it verifies evidence instead of blindly trusting helpers."
              technical="Interactive sandbox benchmarking hardware waveOutReset audio flush times and Ed25519 cryptographic evidence verification."
            />
          </div>
          <ScrollReveal>
            <DualMindSynchronizer />
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── FREEDOM TO SWITCH AI BRAINS ── */}
        <Section id="memory-drawers" className="relative py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="el-eyebrow">
                <CipherText text="// 04 Model Agnostic Routing" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="Swap AI brains anytime. Keep all your memories." />
              </h2>
              <DualCopy
                className="el-body"
                plain="If a smarter AI comes out next month, or if your internet goes down, you don’t lose a thing. ELEVEN can use offline AI on your computer or top cloud models interchangeably."
                technical="Because memory, policy, and tool authority reside in the local Control Plane, ModelRouter switches dynamically across Ollama, NIM, Claude, GPT, and DeepSeek without session loss."
              />
              <div className="pt-4 flex flex-wrap gap-3">
                <PortalActionButton variant="primary" arrow>
                  Try Live 3D Orb
                </PortalActionButton>
                <Button
                  href="/tools/vault-calculator"
                  variant="secondary"
                  arrow
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  Estimate Memory Storage
                </Button>
                <Button
                  href="/architecture"
                  variant="ghost"
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  See How It’s Built
                </Button>
              </div>
            </div>

            <ScrollReveal
              stagger={0.09}
              className="space-y-4 lg:col-span-7"
            >
              {AI_LANES.map((tier) => (
                <RevealItem key={tier.lane}>
                  <Tilt3DCard className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-el-xs font-semibold text-el-accent">
                        {tier.lane}
                      </span>
                      <span className="font-mono text-el-xs text-el-fg">
                        {tier.providers}
                      </span>
                    </div>
                    <DualCopy
                      className="mt-2.5 text-el-xs leading-[1.65] text-el-fg-muted"
                      plain={tier.plainRole}
                      technical={tier.techRole}
                    />
                  </Tilt3DCard>
                </RevealItem>
              ))}
            </ScrollReveal>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
