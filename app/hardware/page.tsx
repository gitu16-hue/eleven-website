import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { HardwareCompatibilityMatrix } from "@/components/v3/HardwareCompatibilityMatrix";
import { WaitlistActionButton } from "@/components/v3/WaitlistActionButton";
import {
  ClarityTogglePill,
  DualCopy,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";

export const metadata: Metadata = {
  title: "Hardware Compatibility & Local Model Benchmark Matrix | ELEVEN",
  description:
    "Verify your workstation hardware specifications for running ELEVEN's dual-mind AI system locally. Check token generation speed, RAM headroom, and voice latency across Apple Silicon, NVIDIA RTX, and Snapdragon X Elite.",
  alternates: {
    canonical: "/hardware",
  },
  openGraph: {
    title: "Hardware Compatibility & Local Model Benchmark Matrix | ELEVEN",
    description:
      "Verify your workstation. Run frontier intelligence locally with zero cloud data leakage. Benchmark token throughput and memory bandwidth for Apple Silicon, NVIDIA, and Snapdragon.",
    url: "https://eleven-website-self.vercel.app/hardware",
    siteName: "ELEVEN OS",
    type: "website",
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
      name: "Hardware Compatibility",
      item: "https://eleven-website-self.vercel.app/hardware",
    },
  ],
};

const techArticleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Hardware Compatibility & Local Model Benchmark Matrix",
  description:
    "Engineering benchmark guide and memory bandwidth analysis for running local AI models (Llama 3.3 70B, DeepSeek-R1 32B, Whisper Large v3 Turbo) on Apple Silicon, NVIDIA RTX, and Snapdragon workstations.",
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
  url: "https://eleven-website-self.vercel.app/hardware",
};

export default function HardwarePage() {
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

        {/* HERO SECTION */}
        <Section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-el-cyan/10 via-transparent to-transparent opacity-60" />

          <Container className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-el-border/60">
              <Breadcrumbs
                items={[
                  { label: "Hardware Compatibility", href: "/hardware" },
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
                <span>HARDWARE BENCHMARK &amp; LOCAL INFERENCE COMPATIBILITY</span>
              </div>

              <h1 className="el-h1">
                <WordReveal text="Verify your workstation. Run frontier intelligence locally." />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="Can your laptop run ELEVEN? Find out which AI models fit into your computer's memory, how fast they respond, and why you don't need a supercomputer to talk with AI in real time."
                technical="Empirical hardware sizing and memory bandwidth benchmarks across Apple Silicon M-Series, NVIDIA RTX architectures, and Snapdragon X Elite. Determine token generation velocities, VRAM budget allocation, and sub-50ms voice barge-in viability."
              />

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 pt-2 font-mono text-[11px]">
                <span className="rounded-xs border border-el-mint/40 bg-el-mint/10 px-2.5 py-1 text-el-mint">
                  ✓ SUB-50MS VOICE READY (16GB+ RAM)
                </span>
                <span className="rounded-xs border border-el-cyan/40 bg-el-cyan/10 px-2.5 py-1 text-el-cyan">
                  ✓ METAL · CUDA · ONNX NATIVE
                </span>
                <span className="rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  ✓ 100% AIR-GAPPABLE RUNTIME
                </span>
                <span className="rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  ✓ ZERO GPU CLOUD RENTAL
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton tier="technical" arrow variant="primary">
                  Request Hardware Testing Access
                </WaitlistActionButton>

                <Button href="/benchmarks/voice-latency" variant="secondary">
                  Voice Latency Benchmarks (&lt;50ms)
                </Button>

                <Button href="/tools/vault-calculator" variant="ghost">
                  Estimate Storage Economics →
                </Button>
              </div>
            </div>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* INTERACTIVE HARDWARE COMPATIBILITY MATRIX */}
        <Section className="py-16 lg:py-24 bg-[#030508]">
          <Container>
            <div className="max-w-3xl space-y-4">
              <div className="el-eyebrow">
                <span>{"// 01 INTERACTIVE HARDWARE BENCHMARK CALCULATOR"}</span>
              </div>
              <h2 className="el-h2">
                Workstation Sizing &amp; Model Throughput
              </h2>
              <p className="el-body">
                Select your computer’s chip and memory configuration below to inspect real-world token generation rates, voice barge-in latency, and supported model architectures.
              </p>
            </div>

            <div className="mt-10">
              <HardwareCompatibilityMatrix />
            </div>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* 3 HARDWARE TIERS TAXONOMY */}
        <Section className="py-16 lg:py-24">
          <Container>
            <div className="max-w-3xl space-y-4">
              <div className="el-eyebrow">
                <span>{"// 02 HARDWARE TIER TAXONOMY"}</span>
              </div>
              <h2 className="el-h2">
                Recommended Hardware Profiles
              </h2>
              <p className="el-body">
                Whether deploying on a single personal laptop or outfitting an enterprise engineering organization, ELEVEN scales across three distinct compute envelopes.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tier 1 */}
              <Tilt3DCard className="relative overflow-hidden rounded-sm border border-el-border bg-el-bg-raised/30 p-6 space-y-4">
                <div className="pointer-events-none absolute top-3 right-3 font-mono text-xs text-el-cyan/40">
                  ⌜ TIER 01 ⌟
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-el-cyan">
                  <span className="h-2 w-2 rounded-full bg-el-cyan" />
                  <span>MINIMUM VIABLE SOVEREIGN</span>
                </div>
                <h3 className="text-xl font-bold text-el-fg">
                  16GB Unified Memory / 8GB VRAM
                </h3>
                <p className="text-xs text-el-fg-muted leading-relaxed">
                  Entry-level specification for daily knowledge work, instant voice conversations, and rapid task delegation.
                </p>

                <div className="rounded-xs border border-el-border bg-[#020408] p-3 font-mono text-xs space-y-2">
                  <div className="text-el-fg font-semibold border-b border-el-border/60 pb-1">
                    RUNNABLE WORKLOADS:
                  </div>
                  <div className="flex justify-between text-el-fg-faint">
                    <span>System 1 Voice:</span>
                    <span className="text-el-mint">Whisper Turbo + Kokoro</span>
                  </div>
                  <div className="flex justify-between text-el-fg-faint">
                    <span>System 2 Planner:</span>
                    <span className="text-el-fg">Llama 3.1 8B (Q4)</span>
                  </div>
                  <div className="flex justify-between text-el-fg-faint">
                    <span>Token Throughput:</span>
                    <span className="text-el-cyan">55–75 tok/sec</span>
                  </div>
                  <div className="flex justify-between text-el-fg-faint">
                    <span>Typical Hardware:</span>
                    <span className="text-el-fg">MacBook Air M2/M3/M4</span>
                  </div>
                </div>
              </Tilt3DCard>

              {/* Tier 2 */}
              <Tilt3DCard className="relative overflow-hidden rounded-sm border border-el-cyan/50 bg-el-bg-raised/40 p-6 space-y-4 shadow-el-sm">
                <div className="pointer-events-none absolute top-3 right-3 font-mono text-xs text-el-cyan">
                  ⌜ TIER 02 ⌟
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-el-mint">
                  <span className="h-2 w-2 rounded-full bg-el-mint" />
                  <span>RECOMMENDED PROFESSIONAL</span>
                </div>
                <h3 className="text-xl font-bold text-el-fg">
                  32GB–36GB Unified Memory / 16GB VRAM
                </h3>
                <p className="text-xs text-el-fg-muted leading-relaxed">
                  The ideal daily driver for software engineers, security researchers, and technical power users running local code synthesis.
                </p>

                <div className="rounded-xs border border-el-cyan/30 bg-[#020408] p-3 font-mono text-xs space-y-2">
                  <div className="text-el-cyan font-semibold border-b border-el-border/60 pb-1">
                    RUNNABLE WORKLOADS:
                  </div>
                  <div className="flex justify-between text-el-fg-faint">
                    <span>System 1 Voice:</span>
                    <span className="text-el-mint">Full 16kHz Sub-40ms</span>
                  </div>
                  <div className="flex justify-between text-el-fg-faint">
                    <span>System 2 Coding:</span>
                    <span className="text-el-fg">Qwen 2.5 Coder 32B (Q4)</span>
                  </div>
                  <div className="flex justify-between text-el-fg-faint">
                    <span>Deep Reasoning:</span>
                    <span className="text-el-fg">DeepSeek-R1 Distill 14B</span>
                  </div>
                  <div className="flex justify-between text-el-fg-faint">
                    <span>Token Throughput:</span>
                    <span className="text-el-cyan">18–35 tok/sec</span>
                  </div>
                  <div className="flex justify-between text-el-fg-faint">
                    <span>Typical Hardware:</span>
                    <span className="text-el-fg">MacBook Pro M3/M4 Pro</span>
                  </div>
                </div>
              </Tilt3DCard>

              {/* Tier 3 */}
              <Tilt3DCard className="relative overflow-hidden rounded-sm border border-purple-400/40 bg-el-bg-raised/30 p-6 space-y-4">
                <div className="pointer-events-none absolute top-3 right-3 font-mono text-xs text-purple-400/50">
                  ⌜ TIER 03 ⌟
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-purple-400">
                  <span className="h-2 w-2 rounded-full bg-purple-400" />
                  <span>EXTREME MULTI-AGENT LAB</span>
                </div>
                <h3 className="text-xl font-bold text-el-fg">
                  64GB–192GB Unified Memory / Dual GPU
                </h3>
                <p className="text-xs text-el-fg-muted leading-relaxed">
                  Frontier workstation for autonomous multi-agent simulation, monorepo AST analysis, and running 70B+ frontier models with zero quantization compromise.
                </p>

                <div className="rounded-xs border border-el-border bg-[#020408] p-3 font-mono text-xs space-y-2">
                  <div className="text-purple-300 font-semibold border-b border-el-border/60 pb-1">
                    RUNNABLE WORKLOADS:
                  </div>
                  <div className="flex justify-between text-el-fg-faint">
                    <span>Frontier Reasoning:</span>
                    <span className="text-el-mint">Llama 3.3 70B Instruct</span>
                  </div>
                  <div className="flex justify-between text-el-fg-faint">
                    <span>Context Window:</span>
                    <span className="text-el-fg">64k–128k Tokens KV Cache</span>
                  </div>
                  <div className="flex justify-between text-el-fg-faint">
                    <span>Token Throughput:</span>
                    <span className="text-el-cyan">18–30 tok/sec</span>
                  </div>
                  <div className="flex justify-between text-el-fg-faint">
                    <span>Typical Hardware:</span>
                    <span className="text-el-fg">M4 Max / Mac Studio Ultra</span>
                  </div>
                </div>
              </Tilt3DCard>
            </div>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* THE PHYSICS OF LOCAL AI: MEMORY BANDWIDTH VS COMPUTE */}
        <Section className="py-16 lg:py-24 bg-[#030508]">
          <Container>
            <div className="max-w-3xl space-y-4">
              <div className="el-eyebrow">
                <span>{"// 03 HARDWARE ARCHITECTURE DEEP DIVE"}</span>
              </div>
              <h2 className="el-h2">
                The Memory Wall: Why Bandwidth Beats Teraflops
              </h2>
              <DualCopy
                className="el-body"
                plain="In local AI, memory speed matters far more than raw processor speed. When generating text word-by-word, the computer must read every single parameter from memory for every word produced."
                technical="During autoregressive token generation, arithmetic intensity is near zero: computing one token requires transferring the entire model weight matrix through the memory bus. Therefore, Token Generation Speed (tok/s) ≈ Memory Bandwidth (GB/s) ÷ Model Footprint (GB)."
              />
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
              {/* Feature 1 */}
              <div className="rounded-xs border border-el-border bg-el-bg-raised/40 p-6 space-y-3">
                <div className="flex items-center gap-2 text-el-cyan">
                  <span className="h-2 w-2 rounded-full bg-el-cyan" />
                  <span className="font-semibold text-sm">Unified Memory Architecture (UMA) Advantage</span>
                </div>
                <p className="font-sans text-xs text-el-fg-muted leading-relaxed">
                  On conventional PCs, weights must be transferred across a PCIe bus (typically 32 to 64 GB/s) from system RAM to GPU VRAM. On Apple Silicon, CPU, GPU, and the Neural Engine share a unified pool of LPDDR5 memory with up to 800 GB/s bandwidth. This eliminates PCIe bottlenecks completely.
                </p>
                <div className="border-t border-el-border/60 pt-3 text-[11px] text-el-fg-faint">
                  BENEFIT: Zero-copy tensor sharing between voice ASR, audio playback, and LLM reasoning.
                </div>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xs border border-el-border bg-el-bg-raised/40 p-6 space-y-3">
                <div className="flex items-center gap-2 text-el-mint">
                  <span className="h-2 w-2 rounded-full bg-el-mint" />
                  <span className="font-semibold text-sm">Optimal Quantization: Q4_K_M vs Q8_0</span>
                </div>
                <p className="font-sans text-xs text-el-fg-muted leading-relaxed">
                  ELEVEN defaults to 4-bit Medium K-quants (Q4_K_M), preserving 99.2% of full 16-bit float perplexity while slashing memory consumption by 72%. A 32B model shrinks from 65 GB to 19.4 GB, allowing it to run smoothly on standard 32GB developer laptops.
                </p>
                <div className="border-t border-el-border/60 pt-3 text-[11px] text-el-fg-faint">
                  BENEFIT: 3.5x token generation speedup due to proportional reduction in memory bytes read per token.
                </div>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xs border border-el-border bg-el-bg-raised/40 p-6 space-y-3">
                <div className="flex items-center gap-2 text-el-amber">
                  <span className="h-2 w-2 rounded-full bg-el-amber" />
                  <span className="font-semibold text-sm">KV Cache Context Scaling Mathematics</span>
                </div>
                <p className="font-sans text-xs text-el-fg-muted leading-relaxed">
                  Each conversational turn expands the Key-Value (KV) cache. At 32k context, FP16 KV cache for a 32B model consumes approximately 4.2 GB of RAM. ELEVEN utilizes FlashAttention-2 and Q8 KV-cache quantization to compress memory footprint by 50%, enabling deep code analysis on modest hardware.
                </p>
                <div className="border-t border-el-border/60 pt-3 text-[11px] text-el-fg-faint">
                  BENEFIT: Eliminates out-of-memory crashes during multi-thousand-line monorepo audits.
                </div>
              </div>

              {/* Feature 4 */}
              <div className="rounded-xs border border-el-border bg-el-bg-raised/40 p-6 space-y-3">
                <div className="flex items-center gap-2 text-purple-400">
                  <span className="h-2 w-2 rounded-full bg-purple-400" />
                  <span className="font-semibold text-sm">Sub-50ms Voice Pipeline Dedicated Pinning</span>
                </div>
                <p className="font-sans text-xs text-el-fg-muted leading-relaxed">
                  The System 1 voice pipeline (Whisper Large v3 Turbo + Kokoro 82M TTS) requires only ~1.8 GB of memory. By pinning this pipeline into high-priority memory and binding audio processing to dedicated Neural Engine / Tensor Core threads, speech is never blocked by heavy background DAG reasoning.
                </p>
                <div className="border-t border-el-border/60 pt-3 text-[11px] text-el-fg-faint">
                  BENEFIT: Zero voice stutter or frame dropping even under 100% CPU/GPU loads.
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* HARDWARE BENCHMARK FAQ */}
        <Section className="py-16 lg:py-24">
          <Container>
            <div className="max-w-3xl space-y-4">
              <div className="el-eyebrow">
                <span>{"// 04 HARDWARE EVALUATION FAQ"}</span>
              </div>
              <h2 className="el-h2">
                Frequently Asked Hardware Questions
              </h2>
              <p className="el-body">
                Clear guidance on upgrading, GPU configurations, and laptop purchasing decisions for local AI.
              </p>
            </div>

            <div className="mt-10 max-w-4xl space-y-4">
              {[
                {
                  q: "Can I run ELEVEN on a base 16GB MacBook Air?",
                  a: "Yes. With 16GB of Unified Memory, ELEVEN allocates ~2GB for the 16kHz voice pipeline, ~5GB for the Llama 3.1 8B task planner, and leaves ~9GB for macOS and your daily applications (browsers, IDEs). Conversational voice responses and quick tool approvals operate with zero latency.",
                },
                {
                  q: "What laptop should I buy if I am purchasing a new machine for local AI development?",
                  a: "If purchasing a Mac, an M3 or M4 MacBook Pro with 36GB or 48GB of Unified Memory represents the price-to-performance sweet spot. It comfortably hosts 32B models (like Qwen 2.5 Coder 32B) at 20+ tokens/second while handling large codebases. For Windows, look for laptops with an NVIDIA RTX 4080 (16GB VRAM) or Snapdragon X Elite with 32GB RAM.",
                },
                {
                  q: "Can ELEVEN offload computation across multiple GPUs or machines?",
                  a: "Yes. ELEVEN's local control plane supports hybrid delegation: System 1 voice runs locally on your workstation for zero latency, while deep System 2 reasoning tasks can optionally delegate to an internal private GPU workstation (over authenticated mTLS) in your home lab or corporate intranet, without touching the public cloud.",
                },
                {
                  q: "How does battery life hold up during continuous voice conversation?",
                  a: "Because the System 1 voice pipeline utilizes quantized weights accelerated by the Apple Neural Engine / Qualcomm NPU rather than spinning up power-hungry GPU cores continuously, power draw averages only 4 to 8 watts during active conversation, delivering all-day battery life on modern laptops.",
                },
              ].map((faq, i) => (
                <div key={i} className="rounded-xs border border-el-border bg-el-bg-raised/40 p-5 space-y-2">
                  <h3 className="font-mono text-sm font-semibold text-el-fg">
                    Q: {faq.q}
                  </h3>
                  <p className="text-xs text-el-fg-muted leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* BOTTOM CTA ACCESS FUNNEL */}
        <Section className="py-16 lg:py-24 border-t border-el-border bg-gradient-to-b from-[#030508] to-[#010204]">
          <Container>
            <div className="mx-auto max-w-3xl text-center space-y-6">
              <div className="el-badge">
                <span>{"// RUNTIME SIZING VERIFIED · ZERO CLOUD EXFILTRATION"}</span>
              </div>

              <h2 className="el-h2">
                Ready to experience sovereign intelligence on your hardware?
              </h2>

              <DualCopy
                className="mx-auto max-w-2xl el-body"
                plain="Join the early access program to receive the ELEVEN installer binary and test local execution on your machine."
                technical="Request access to the ELEVEN Technical Preview. Includes hardware benchmarking utilities, quantized model packs, and Ring-0 supervisory daemon."
              />

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <WaitlistActionButton tier="technical" arrow variant="primary">
                  Request Hardware Testing Access
                </WaitlistActionButton>

                <Button href="/solutions/developers" variant="secondary">
                  Explore Developer Solutions →
                </Button>
              </div>

              {/* Cross Links to Other Deep Architecture Pages */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-8 font-mono text-xs text-el-fg-faint">
                <Link href="/benchmarks/voice-latency" className="hover:text-el-cyan hover:underline">
                  → Voice Latency Benchmark
                </Link>
                <Link href="/tools/vault-calculator" className="hover:text-el-cyan hover:underline">
                  → Vault Storage Estimator
                </Link>
                <Link href="/solutions/enterprise" className="hover:text-el-cyan hover:underline">
                  → Enterprise Fleet Governance
                </Link>
                <Link href="/compare/cloud-vs-local" className="hover:text-el-cyan hover:underline">
                  → Local vs Cloud Audit
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}