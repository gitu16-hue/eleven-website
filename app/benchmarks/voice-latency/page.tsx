import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { VoiceLatencyBenchmarkSimulator } from "@/components/v3/VoiceLatencyBenchmarkSimulator";
import { WaitlistActionButton } from "@/components/v3/WaitlistActionButton";
import {
  ClarityTogglePill,
  DualCopy,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";

export const metadata: Metadata = {
  title: "16kHz Voice Pipeline & Barge-In Latency Benchmark | ELEVEN",
  description:
    "Empirical benchmarks comparing ELEVEN's local 16kHz lockless PCM audio ring (<50ms barge-in) with commercial cloud WebSocket voice streaming APIs.",
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
  headline: "16kHz Voice Pipeline & Sub-50ms Barge-In Latency Benchmark",
  description:
    "Empirical test results and architecture specification for the ELEVEN low-latency SpeechPipeline, covering 16kHz lockless circular buffers, turn-epoch invalidation, and WASAPI exclusive mode bindings.",
  author: {
    "@type": "Organization",
    name: "GISHH Labs Audio Research",
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
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-el-cyan/10 via-transparent to-transparent opacity-60"
          />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-el-border/60">
              <Breadcrumbs
                items={[
                  { label: "Benchmarks", href: "/benchmarks/voice-latency" },
                  { label: "Voice Latency", href: "/benchmarks/voice-latency" },
                ]}
              />
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-el-fg-faint">
                  TERMINOLOGY DEPTH:
                </span>
                <ClarityTogglePill />
              </div>
            </div>

            <div className="mt-10 max-w-4xl space-y-6">
              <div className="el-badge shadow-el-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-el-cyan animate-pulse" />
                <span>EMPIRICAL BENCHMARKS // 16KHZ AUDIO RUNTIME</span>
              </div>

              <h1 className="el-h1">
                <WordReveal text="Conversations don't have loading spinners. Sub-50ms natural interruption." />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="Human speech relies on instant interruptions. When you interrupt a cloud AI, it keeps talking over you for a full second due to internet lag. ELEVEN runs directly on your computer's audio chip, cutting speech off in under 0.05 seconds just like talking to a real person."
                technical="How ELEVEN achieves sub-50ms speech barge-in and <500ms conversational turns using a 16kHz lockless local PCM ring, turn-epoch invalidation, and direct WASAPI/CoreAudio low-latency host bindings."
              />

              <div className="flex flex-wrap gap-2 pt-2 font-mono text-[11px]">
                <span className="rounded-xs border border-el-mint/40 bg-el-mint/10 px-2.5 py-1 text-el-mint">
                  ✓ SUB-50MS BARGE-IN TARGET
                </span>
                <span className="rounded-xs border border-el-cyan/40 bg-el-cyan/10 px-2.5 py-1 text-el-cyan">
                  ✓ 16KHZ LOCKLESS RING BUFFER
                </span>
                <span className="rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  ✓ WASAPI / COREAUDIO EXCLUSIVE
                </span>
                <span className="rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  ✓ ZERO CLOUD AUDIO STREAMS
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton tier="technical" arrow variant="primary">
                  Test Local Voice Pipeline
                </WaitlistActionButton>
                <Button variant="secondary" href="/eleven">
                  Explore Dual-Mind Architecture →
                </Button>
                <Button variant="ghost" href="/hardware">
                  Verify Hardware Requirements
                </Button>
              </div>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── INTERACTIVE AUDIO SIMULATOR ── */}
        <Section className="py-16 lg:py-24 bg-[#030508]">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="el-eyebrow">
                <span>{"// 01 INTERACTIVE BENCHMARK HARNESS"}</span>
              </div>
              <div className="rounded-xs border border-el-border bg-[#020408] px-2.5 py-1 font-mono text-[11px] text-el-fg-faint">
                AUDIO BUS: <span className="text-el-mint font-semibold">16KHZ LOCKLESS ACTIVE</span>
              </div>
            </div>
            <h2 className="el-h2">
              Experience the 30x barge-in difference.
            </h2>
            <DualCopy
              className="el-body"
              plain="Test what happens when you speak while the AI is talking. ELEVEN silences its speaker within 32ms, while cloud assistants continue rambling over your voice."
              technical="Live collision simulator measuring total conversational barge-in response. Compares local WASAPI lockless ring buffer truncation against WebSocket round-trip cloud queues."
            />
          </div>

          <div className="mt-10">
            <VoiceLatencyBenchmarkSimulator />
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── SPEECH PIPELINE 4-STAGE ARCHITECTURE ── */}
        <Section className="py-16 lg:py-24">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="el-eyebrow">
              <span>{"// 02 SPEECH PIPELINE ARCHITECTURE"}</span>
            </div>
            <h2 className="el-h2">
              Four breakthroughs that eliminate audio lag.
            </h2>
            <DualCopy
              className="el-body"
              plain="We re-engineered how computers listen and speak from scratch, replacing slow web connections with direct hardware audio rings."
              technical="Low-latency audio streaming architecture decoupling microphone capture from asynchronous model transcription and speech synthesis."
            />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Stage 1 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-all hover:border-el-accent/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-accent font-semibold tracking-wider">
                    STAGE 01 // RING
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-el-fg-faint">
                    0ms JITTER
                  </span>
                </div>
                <h3 className="text-el-base font-semibold text-el-fg">
                  Lockless Circular PCM Buffer
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="Microphone audio is written directly into memory without any locks or pauses, so your words are never cut off."
                  technical="Eliminates mutex contention in SpeechPipeline._ingestion_loop via atomic read/write pointers and pre-allocated circular ring buffers."
                />
              </div>
              <div className="mt-6 border-t border-el-border/60 pt-3 font-mono text-[10px] text-el-fg-faint">
                <span className="text-el-accent">Buffer:</span> 16000Hz 16-bit Mono
              </div>
            </Tilt3DCard>

            {/* Stage 2 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-all hover:border-el-accent/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-accent font-semibold tracking-wider">
                    STAGE 02 // VAD
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-el-signal-lime">
                    14ms VAD
                  </span>
                </div>
                <h3 className="text-el-base font-semibold text-el-fg">
                  Conservative 380ms VAD
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="Voice Activity Detection listens accurately so it doesn't interrupt you when you take a breath or pause to think."
                  technical="Silero VAD / WebRTC VAD tuned to 380ms silence threshold paired with a 120ms speculative audio lookback buffer."
                />
              </div>
              <div className="mt-6 border-t border-el-border/60 pt-3 font-mono text-[10px] text-el-fg-faint">
                <span className="text-el-signal-lime">Detection:</span> 14ms Latency
              </div>
            </Tilt3DCard>

            {/* Stage 3 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-all hover:border-el-accent/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-accent font-semibold tracking-wider">
                    STAGE 03 // EPOCH
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-purple-400">
                    ATOMIC UINT64
                  </span>
                </div>
                <h3 className="text-el-base font-semibold text-el-fg">
                  Turn-Epoch Invalidation
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="When you interrupt, ELEVEN immediately drops the old sentence without wasting a single millisecond."
                  technical="Atomic turn_epoch counter increments on barge-in. Downstream audio packets with stale epoch tags are discarded in O(1) time."
                />
              </div>
              <div className="mt-6 border-t border-el-border/60 pt-3 font-mono text-[10px] text-el-fg-faint">
                <span className="text-purple-400">Overhead:</span> 0.00ms Drop Time
              </div>
            </Tilt3DCard>

            {/* Stage 4 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-all hover:border-el-accent/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-accent font-semibold tracking-wider">
                    STAGE 04 // HARDWARE
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-el-signal-lime">
                    6ms MUTE
                  </span>
                </div>
                <h3 className="text-el-base font-semibold text-el-fg">
                  Host DAC Buffer Flushing
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="Direct hardware audio access silences your speaker immediately without waiting for operating system sound mixers."
                  technical="Direct WASAPI Exclusive Mode (Windows) and CoreAudio HAL (macOS) binding flush output ring buffers directly at the hardware DAC."
                />
              </div>
              <div className="mt-6 border-t border-el-border/60 pt-3 font-mono text-[10px] text-el-fg-faint">
                <span className="text-el-signal-lime">Mute Delay:</span> 6ms Direct DAC
              </div>
            </Tilt3DCard>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── EMPIRICAL BENCHMARK HARDWARE DATA GRID ── */}
        <Section className="py-16">
          <div className="max-w-[700px]">
            <p className="el-eyebrow">
              03 · EMPIRICAL MEASUREMENTS
            </p>
            <h2 className="mt-2 el-h2">
              Tested across real developer workstations.
            </h2>
            <DualCopy
              className="mt-3 el-body"
              plain="Measured real-world latency across popular modern computers compared to cloud speech endpoints."
              technical="Laboratory turn latency benchmarks measured from audio VAD threshold trigger to first audio byte emitted."
            />
          </div>

          <div className="mt-10 overflow-x-auto rounded-sm border border-el-border bg-el-bg-raised/40">
            <table className="w-full text-left font-mono text-el-xs">
              <thead>
                <tr className="border-b border-el-border bg-el-bg-raised/90 text-el-fg-faint">
                  <th className="py-3.5 px-4 font-medium uppercase tracking-wider">Hardware / Architecture</th>
                  <th className="py-3.5 px-4 font-medium uppercase tracking-wider text-el-accent">Barge-In Interruption</th>
                  <th className="py-3.5 px-4 font-medium uppercase tracking-wider text-el-signal-lime">Turn Latency (ASR+LLM+TTS)</th>
                  <th className="py-3.5 px-4 font-medium uppercase tracking-wider text-el-fg-faint">Network Dependency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-el-border/60 text-el-fg-muted">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-el-fg">Apple Silicon M3/M4 Max (CoreAudio)</td>
                  <td className="py-3.5 px-4 text-el-signal-lime font-medium">28ms (&lt;0.03s)</td>
                  <td className="py-3.5 px-4 text-el-signal-lime font-medium">380ms (&lt;0.4s)</td>
                  <td className="py-3.5 px-4 text-el-signal-lime font-medium">100% Offline (0 bytes egress)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-el-fg">Windows 11 (WASAPI + RTX 4080)</td>
                  <td className="py-3.5 px-4 text-el-signal-lime font-medium">32ms (&lt;0.05s)</td>
                  <td className="py-3.5 px-4 text-el-signal-lime font-medium">420ms (&lt;0.5s)</td>
                  <td className="py-3.5 px-4 text-el-signal-lime font-medium">100% Offline (0 bytes egress)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-el-fg">Linux Workstation (ALSA + RTX 3080)</td>
                  <td className="py-3.5 px-4 text-el-signal-lime font-medium">34ms (&lt;0.05s)</td>
                  <td className="py-3.5 px-4 text-el-signal-lime font-medium">450ms (&lt;0.5s)</td>
                  <td className="py-3.5 px-4 text-el-signal-lime font-medium">100% Offline (0 bytes egress)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-red-400">Commercial Cloud Voice Assistant (WiFi)</td>
                  <td className="py-3.5 px-4 text-red-400 font-medium">920ms–1,280ms (~1.1s)</td>
                  <td className="py-3.5 px-4 text-red-400 font-medium">1,600ms–2,400ms (~2.0s)</td>
                  <td className="py-3.5 px-4 text-red-400 font-medium">High (Opus WebSockets to US-East)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── ACCESS FUNNEL & VOICE PREVIEW CTA ── */}
        <Section className="py-20">
          <div className="relative overflow-hidden rounded-sm border border-el-border bg-gradient-to-b from-el-bg-raised/90 to-el-bg p-8 sm:p-12 text-center shadow-el-lg">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-30"
            />
            <div className="relative mx-auto max-w-[640px] space-y-4">
              <span className="el-eyebrow">
                SYSTEM 1 AUDIO // DIRECT PREVIEW
              </span>
              <h2 className="el-h2">
                Ready for conversation that feels human?
              </h2>
              <DualCopy
                className="el-body"
                plain="Join the early access program to test the 16kHz local audio engine directly on your laptop or workstation."
                technical="Request access to the ELEVEN System 1 SpeechPipeline runtime binaries. Includes WASAPI/CoreAudio direct HAL drivers and local quantized ASR models."
              />

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <WaitlistActionButton tier="technical" arrow>
                  Test Local Voice Pipeline (Join Waitlist)
                </WaitlistActionButton>
                <Button variant="secondary" href="/tools/inspector">
                  Inspect Policy Sandbox →
                </Button>
                <Button variant="ghost" href="/hardware">
                  Verify Hardware Sizing →
                </Button>
              </div>

              <p className="pt-2 font-mono text-[10.5px] text-el-fg-faint">
                Supports standard USB microphones, laptop mic arrays, and Bluetooth headset profiles.
              </p>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
