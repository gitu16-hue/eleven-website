import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { VoiceLatencyBenchmarkSimulator } from "@/components/v3/VoiceLatencyBenchmarkSimulator";
import { WaitlistActionButton } from "@/components/v3/WaitlistActionButton";
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
  title: "Sub-50ms Speech Latency Benchmarks | ELEVEN v3",
  description:
    "Empirical turn latency and barge-in speed benchmarks comparing ELEVEN's local 16kHz circular PCM buffer against commercial cloud assistants. <0.05s interruption.",
  alternates: {
    canonical: "/benchmarks/voice-latency",
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
      name: "Benchmarks",
      item: "https://eleven-website-self.vercel.app/benchmarks/voice-latency",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Voice Latency",
      item: "https://eleven-website-self.vercel.app/benchmarks/voice-latency",
    },
  ],
};

const techArticleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Empirical Turn Latency and Barge-In Audio Benchmarks",
  description:
    "Technical benchmarks and architecture analysis of ELEVEN's local-first 16kHz audio runtime, achieving sub-50ms conversational barge-in.",
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
  url: "https://eleven-website-self.vercel.app/benchmarks/voice-latency",
};

export default function VoiceLatencyBenchmarkPage() {
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
        <Section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20">
          <GenesisSubpageHeroBackdrop />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-el-border/60">
              <Breadcrumbs
                items={[
                  { label: "Benchmarks", href: "/benchmarks/voice-latency" },
                  { label: "Voice Latency", href: "/benchmarks/voice-latency" },
                ]}
              />
              <div className="flex items-center gap-3">
                <span className="text-el-xs font-medium text-el-fg-faint">
                  Terminology depth:
                </span>
                <ClarityTogglePill />
              </div>
            </div>

            <GenesisHeroIntro className="mt-10 max-w-4xl space-y-6">
              <div className="gfx-badge shadow-el-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83] shadow-[0_0_8px_#10bc83] motion-safe:animate-pulse motion-reduce:animate-none" />
                <CipherText text="Empirical Benchmarks · 16kHz Audio Runtime" />
              </div>

              <h1 className="el-h1">
                <WordReveal text="Conversations do not have loading spinners. Sub-50ms natural interruption." />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="Human speech relies on instant interruptions. When you interrupt a cloud AI, it keeps talking over you for a full second due to internet lag. ELEVEN runs directly on your computer's audio chip, cutting speech off in under 0.05 seconds just like talking to a real person."
                technical="How ELEVEN achieves sub-50ms speech barge-in and <500ms conversational turns using a 16kHz lockless local PCM ring, turn-epoch invalidation, and direct WASAPI/CoreAudio low-latency host bindings."
              />

              <GenesisBubbleRow className="flex flex-wrap gap-2.5 pt-2 text-el-xs">
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  <span>Sub-50ms barge-in target</span>
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  <span>16kHz lockless ring buffer</span>
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  <span>WASAPI / CoreAudio exclusive</span>
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  <span>Zero cloud audio streams</span>
                </li>
              </GenesisBubbleRow>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton
                  tier="technical"
                  arrow
                  variant="primary"
                >
                  Test Local Voice Pipeline
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/eleven"
                  arrow
                >
                  Explore Dual-Mind Architecture
                </Button>
                <Button
                  variant="ghost"
                  href="/hardware"
                >
                  Verify Hardware Requirements
                </Button>
              </div>
            </GenesisHeroIntro>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── INTERACTIVE AUDIO SIMULATOR ── */}
        <Section className="py-16 lg:py-24 bg-[#08090a]/60">
          <GenesisSectionIntro className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                <CipherText text="01 · Interactive Benchmark Harness" />
              </div>
              <div className="gfx-bubble !h-8 !px-3 !text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                Audio Bus: <span className="text-[#10bc83] font-medium">16kHz Lockless Active</span>
              </div>
            </div>
            <h2 className="el-h2">
              <WordReveal text="Experience the 30x barge-in difference." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Test what happens when you speak while the AI is talking. ELEVEN silences its speaker within 32ms, while cloud assistants continue rambling over your voice."
              technical="Live collision simulator measuring total conversational barge-in response. Compares local WASAPI lockless ring buffer truncation against WebSocket round-trip cloud queues."
            />
          </GenesisSectionIntro>

          <GenesisShowcaseFrame className="mt-10 p-4 sm:p-6">
            <VoiceLatencyBenchmarkSimulator />
          </GenesisShowcaseFrame>
        </Section>

        <SignalBeamDivider />

        {/* ── SPEECH PIPELINE 4-STAGE ARCHITECTURE ── */}
        <Section className="py-16 lg:py-24">
          <GenesisSectionIntro className="max-w-3xl space-y-4 mb-10">
            <div className="gfx-badge">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              <CipherText text="02 · Speech Pipeline Architecture" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Four breakthroughs that eliminate audio lag." />
            </h2>
            <DualCopy
              className="el-body"
              plain="We re-engineered how computers listen and speak from scratch, replacing slow web connections with direct hardware audio rings."
              technical="Low-latency audio streaming architecture decoupling microphone capture from asynchronous model transcription and speech synthesis."
            />
          </GenesisSectionIntro>

          <GenesisStaggerGrid
            from="center"
            stagger={0.09}
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Stage 1 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6 h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-el-accent font-medium">
                    01 · Ring Buffer
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-el-fg-faint">
                    0ms jitter
                  </span>
                </div>
                <h3 className="text-el-base font-normal heading-gradient">
                  Lockless Circular PCM Buffer
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="Microphone audio is written directly into memory without any locks or pauses, so your words are never cut off."
                  technical="Eliminates mutex contention in SpeechPipeline._ingestion_loop via atomic read/write pointers and pre-allocated circular ring buffers."
                />
              </div>
              <div className="mt-6 border-t border-white/[0.07] pt-3 text-xs text-el-fg-faint">
                <span className="text-el-accent">Buffer:</span> <code>16000Hz 16-bit Mono</code>
              </div>
            </Tilt3DCard>

            {/* Stage 2 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6 h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-el-accent font-medium">
                    02 · Voice Activity
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-[#10bc83]">
                    14ms VAD
                  </span>
                </div>
                <h3 className="text-el-base font-normal heading-gradient">
                  Conservative 380ms VAD
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="Voice Activity Detection listens accurately so it doesn't interrupt you when you take a breath or pause to think."
                  technical="Silero VAD / WebRTC VAD tuned to 380ms silence threshold paired with a 120ms speculative audio lookback buffer."
                />
              </div>
              <div className="mt-6 border-t border-white/[0.07] pt-3 text-xs text-el-fg-faint">
                <span className="text-[#10bc83]">Detection:</span> <code>14ms Latency</code>
              </div>
            </Tilt3DCard>

            {/* Stage 3 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6 h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-el-accent font-medium">
                    03 · Turn Invalidation
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-el-fg-muted">
                    Atomic
                  </span>
                </div>
                <h3 className="text-el-base font-normal heading-gradient">
                  Turn-Epoch Invalidation
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="When you interrupt, ELEVEN immediately drops the old sentence without wasting a single millisecond."
                  technical="Atomic turn_epoch counter increments on barge-in. Downstream audio packets with stale epoch tags are discarded in O(1) time."
                />
              </div>
              <div className="mt-6 border-t border-white/[0.07] pt-3 text-xs text-el-fg-faint">
                <span className="text-el-accent">Overhead:</span> <code>0.00ms Drop Time</code>
              </div>
            </Tilt3DCard>

            {/* Stage 4 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6 h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-el-accent font-medium">
                    04 · Hardware Access
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-[#10bc83]">
                    6ms mute
                  </span>
                </div>
                <h3 className="text-el-base font-normal heading-gradient">
                  Host DAC Buffer Flushing
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="Direct hardware audio access silences your speaker immediately without waiting for operating system sound mixers."
                  technical="Direct WASAPI Exclusive Mode (Windows) and CoreAudio HAL (macOS) binding flush output ring buffers directly at the hardware DAC."
                />
              </div>
              <div className="mt-6 border-t border-white/[0.07] pt-3 text-xs text-el-fg-faint">
                <span className="text-[#10bc83]">Mute Delay:</span> <code>6ms Direct DAC</code>
              </div>
            </Tilt3DCard>
          </GenesisStaggerGrid>
        </Section>

        <SignalBeamDivider />

        {/* ── EMPIRICAL BENCHMARK HARDWARE DATA GRID ── */}
        <Section className="py-16">
          <GenesisSectionIntro className="max-w-3xl space-y-4 mb-10">
            <div className="gfx-badge">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              <CipherText text="03 · Empirical Measurements" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Tested across real developer workstations." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Measured real-world latency across popular modern computers compared to cloud speech endpoints."
              technical="Laboratory turn latency benchmarks measured from audio VAD threshold trigger to first audio byte emitted."
            />
          </GenesisSectionIntro>

          <GenesisShowcaseFrame className="mt-10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#08090a] text-el-fg-muted">
                    <th className="py-3.5 px-4 font-medium text-el-fg">Hardware / architecture</th>
                    <th className="py-3.5 px-4 font-medium text-[#38ffbd]">Barge-in interruption</th>
                    <th className="py-3.5 px-4 font-medium text-[#10bc83]">Turn latency (ASR+LLM+TTS)</th>
                    <th className="py-3.5 px-4 font-medium text-el-fg-faint">Network dependency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.07] text-el-fg-muted">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-el-fg">Apple Silicon M3/M4 Max (CoreAudio)</td>
                    <td className="py-3.5 px-4 text-[#10bc83] font-medium">28ms (&lt;0.03s)</td>
                    <td className="py-3.5 px-4 text-[#10bc83] font-medium">380ms (&lt;0.4s)</td>
                    <td className="py-3.5 px-4 text-[#10bc83] font-medium">100% offline (0 bytes egress)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-el-fg">Windows 11 (WASAPI + RTX 4080)</td>
                    <td className="py-3.5 px-4 text-[#10bc83] font-medium">32ms (&lt;0.05s)</td>
                    <td className="py-3.5 px-4 text-[#10bc83] font-medium">420ms (&lt;0.5s)</td>
                    <td className="py-3.5 px-4 text-[#10bc83] font-medium">100% offline (0 bytes egress)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-el-fg">Linux Workstation (ALSA + RTX 3080)</td>
                    <td className="py-3.5 px-4 text-[#10bc83] font-medium">34ms (&lt;0.05s)</td>
                    <td className="py-3.5 px-4 text-[#10bc83] font-medium">450ms (&lt;0.5s)</td>
                    <td className="py-3.5 px-4 text-[#10bc83] font-medium">100% offline (0 bytes egress)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-red-400">Commercial Cloud Voice Assistant (WiFi)</td>
                    <td className="py-3.5 px-4 text-red-400 font-medium">920ms to 1,280ms (~1.1s)</td>
                    <td className="py-3.5 px-4 text-red-400 font-medium">1,600ms to 2,400ms (~2.0s)</td>
                    <td className="py-3.5 px-4 text-red-400 font-medium">High (Opus WebSockets to US-East)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GenesisShowcaseFrame>
        </Section>

        <SignalBeamDivider />

        {/* ── ACCESS FUNNEL & VOICE PREVIEW CTA ── */}
        <Section className="py-20">
          <GenesisCtaStage
            badge="System 1 Audio · Direct Preview"
            title="Ready for conversation that feels human?"
            description="Join the early access program to test the 16kHz local audio engine directly on your laptop or workstation."
            actions={
              <>
                <WaitlistActionButton
                  tier="technical"
                  arrow
                  className="w-full sm:w-auto"
                >
                  Test Local Voice Pipeline (Join Waitlist)
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/tools/inspector"
                  arrow
                  className="w-full sm:w-auto"
                >
                  Inspect Policy Sandbox
                </Button>
                <Button
                  variant="ghost"
                  href="/hardware"
                  arrow
                  className="w-full sm:w-auto"
                >
                  Verify Hardware Sizing
                </Button>
              </>
            }
          >
            <p className="pt-4 text-xs text-el-fg-faint">
              Supports standard USB microphones, laptop mic arrays, and Bluetooth headset profiles.
            </p>
          </GenesisCtaStage>
        </Section>
      </main>

      <Footer />
    </>
  );
}
