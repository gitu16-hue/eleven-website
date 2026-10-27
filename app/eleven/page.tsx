import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ScrollReveal, RevealItem } from "@/components/ui/ScrollReveal";
import { DualMindSynchronizer } from "@/components/v3/DualMindSynchronizer";
import { PortalActionButton } from "@/components/v3/PortalActionButton";
import {
  ClarityTogglePill,
  DualCopy,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";

export const metadata: Metadata = {
  title: "How It Thinks — Two Brains & Natural Voice | ELEVEN v3",
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
      "Doesn’t rudely jump in just because you took a quick breath or said 'um' mid-thought.",
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
      "Say 'Wait—actually…' and ELEVEN goes quiet in a twentieth of a second, throwing out outdated replies.",
    techDesc:
      "Flushes hardware DAC buffers in <50ms, increments turn epoch tokens, and invalidates stale ASR results.",
  },
];

const AI_LANES = [
  {
    lane: "OPTION 1 · 100% OFFLINE ON YOUR PC",
    providers: "Ollama · Local Voice & Vision Models",
    plainRole:
      "Works even on an airplane with Wi-Fi turned off—ideal for ultra-private notes and everyday commands.",
    techRole:
      "Zero-egress offline execution, privacy-critical intent classification, and disconnected resilience.",
  },
  {
    lane: "OPTION 2 · LIGHTNING-FAST SPEED",
    providers: "NVIDIA NIM · Groq · Streaming Voice",
    plainRole:
      "Delivers blink-of-an-eye answers when you’re brainstorming fast—after hiding any private passwords first.",
    techRole:
      "Sub-second conversational synthesis and rapid TaskSpec decomposition under DataMinimizer redaction.",
  },
  {
    lane: "OPTION 3 · WORLD’S SMARTEST CLOUD BRAINS",
    providers: "Claude · GPT · DeepSeek · Gemini",
    plainRole:
      "Brings in heavyweight reasoning for big coding, legal, or research tasks—still safely locked inside ELEVEN’s guardrails.",
    techRole:
      "Multi-file architecture synthesis and adversarial verification inside untrusted proposal sandboxes.",
  },
];

export default function ElevenIntelligencePage() {
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
        {/* ── HERO ── */}
        <Section className="pt-12 pb-20">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-[780px]">
              <p className="font-mono text-el-xs uppercase tracking-[0.12em] text-el-accent">
                HOW ELEVEN THINKS &amp; LISTENS
              </p>
              <WordReveal
                as="h1"
                text="Talks at the speed of conversation."
                mutedText="Thinks deeply without freezing."
                className="mt-4 text-el-4xl font-medium leading-[1.06] tracking-[-0.03em] text-el-fg"
              />
              <DualCopy
                className="mt-6 max-w-[650px] text-el-lg leading-[1.6] text-el-fg-muted"
                plain="Imagine talking to a friend while they cook dinner: they can answer you right away without burning the food. ELEVEN works the exact same way by splitting conversation and heavy work into two separate brains."
                technical="ELEVEN v3 bifurcates runtime cognition into two OS processes—System 1 (eleven_voice) and System 2 (eleven_deep)—synchronized across a non-blocking Async Mind Event Bus."
              />
            </div>
            <ClarityTogglePill />
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── TWO MINDS SIDE BY SIDE ── */}
        <Section>
          <ScrollReveal
            stagger={0.12}
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            <RevealItem className="h-full">
              <Tilt3DCard className="p-7 lg:p-9">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-el-border pb-4">
                      <span className="font-mono text-el-xs font-semibold text-el-accent">
                        BRAIN 1 · QUICK VOICE (F.R.I.D.A.Y.)
                      </span>
                      <span className="rounded-sm bg-el-bg px-2.5 py-1 font-mono text-[11px] text-el-fg-muted">
                        Fast &amp; Conversational
                      </span>
                    </div>

                    <h2 className="mt-5 text-el-2xl font-medium tracking-[-0.02em] text-el-fg">
                      Your Friendly Front-Desk Partner
                    </h2>
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

                  <div className="mt-7 border-t border-el-border pt-4 font-mono text-[11px] text-el-fg-faint">
                    ROLE: INSTANT LISTENING &amp; NATURAL SPEECH
                  </div>
                </div>
              </Tilt3DCard>
            </RevealItem>

            <RevealItem className="h-full">
              <Tilt3DCard className="p-7 lg:p-9">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-el-border pb-4">
                      <span className="font-mono text-el-xs font-semibold text-el-accent">
                        BRAIN 2 · DEEP PLANNER (J.A.R.V.I.S.)
                      </span>
                      <span className="rounded-sm bg-el-bg px-2.5 py-1 font-mono text-[11px] text-el-fg-muted">
                        Thorough &amp; Careful
                      </span>
                    </div>

                    <h2 className="mt-5 text-el-2xl font-medium tracking-[-0.02em] text-el-fg">
                      Your Quiet Research &amp; Engineering Team
                    </h2>
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
                        <span>Verifies proof from helpers—never guesses by majority vote.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-el-accent" />
                        <span>Pauses politely whenever an action needs your approval.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-7 border-t border-el-border pt-4 font-mono text-[11px] text-el-fg-faint">
                    ROLE: DEEP RESEARCH, CODING &amp; VERIFIED TASKS
                  </div>
                </div>
              </Tilt3DCard>
            </RevealItem>
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── 6 STEPS OF NATURAL VOICE ── */}
        <Section className="bg-el-bg-raised/45">
          <div className="max-w-[680px]">
            <p className="font-mono text-el-xs uppercase tracking-[0.1em] text-el-accent">
              NATURAL CONVERSATION STEP BY STEP
            </p>
            <WordReveal
              as="h2"
              text="Six reasons talking to ELEVEN feels effortless."
              className="mt-3 text-el-3xl font-medium leading-[1.12] tracking-[-0.025em] text-el-fg"
            />
          </div>

          <ScrollReveal
            stagger={0.07}
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {VOICE_STEPS.map((item) => (
              <RevealItem key={item.step} className="h-full">
                <Tilt3DCard className="p-6">
                  <span className="font-mono text-el-xs font-semibold text-el-accent">
                    STEP {item.step}
                  </span>
                  <DualCopy
                    as="div"
                    className="mt-2.5 text-el-base font-medium text-el-fg"
                    plain={item.plainTitle}
                    technical={item.techTitle}
                  />
                  <DualCopy
                    className="mt-2 text-el-xs leading-[1.65] text-el-fg-muted"
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
        <Section>
          <ScrollReveal>
            <DualMindSynchronizer />
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── FREEDOM TO SWITCH AI BRAINS ── */}
        <Section>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-mono text-el-xs uppercase tracking-[0.1em] text-el-accent">
                NEVER LOCKED TO ONE COMPANY
              </p>
              <WordReveal
                as="h2"
                text="Swap AI brains anytime. Keep all your memories."
                className="mt-3 text-el-3xl font-medium leading-[1.12] tracking-[-0.025em] text-el-fg"
              />
              <DualCopy
                className="mt-4 text-el-sm leading-[1.65] text-el-fg-muted"
                plain="If a smarter AI comes out next month—or if your internet goes down—you don’t lose a thing. ELEVEN can use offline AI on your computer or top cloud models interchangeably."
                technical="Because memory, policy, and tool authority reside in the local Control Plane, ModelRouter switches seamlessly across Ollama, NIM, Claude, GPT, and DeepSeek."
              />
              <div className="mt-7 flex flex-wrap gap-3">
                <PortalActionButton variant="primary" arrow>
                  Try Live 3D Orb
                </PortalActionButton>
                <Button href="/architecture" variant="secondary">
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
                      <span className="font-mono text-el-xs font-semibold text-el-accent">
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
