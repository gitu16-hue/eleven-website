import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import dynamic from "next/dynamic";
import { WaitlistActionButton } from "@/components/v3/WaitlistActionButton";

const SovereignVaultCalculator = dynamic(
  () =>
    import("@/components/v3/SovereignVaultCalculator").then(
      (mod) => mod.SovereignVaultCalculator
    ),
  {
    loading: () => (
      <div className="h-[460px] w-full animate-pulse motion-reduce:animate-none rounded-sm border border-el-border bg-el-bg-raised/40" />
    ),
  }
);
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
  GenesisSplitReveal,
  GenesisStaggerGrid,
  GenesisSubpageHeroBackdrop,
  GenesisTimelineList,
} from "@/components/motion/GenesisMotionEngine";

export const metadata: Metadata = {
  title: "Sovereign Vault Storage & Encryption Estimator | ELEVEN Tools",
  description:
    "Calculate local disk footprint, HNSW vector index memory consumption, and AES-256-GCM encryption performance for up to 1,000,000 personal AI conversational turns.",
  alternates: {
    canonical: "/tools/vault-calculator",
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
      name: "Tools",
      item: "https://eleven-website-self.vercel.app/tools/vault-calculator",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Vault Storage Estimator",
      item: "https://eleven-website-self.vercel.app/tools/vault-calculator",
    },
  ],
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ELEVEN Sovereign Vault Storage Estimator",
  operatingSystem: "macOS, Windows 11, Linux",
  applicationCategory: "UtilitiesApplication",
  description:
    "Interactive capacity and encryption performance simulator for local-first encrypted memory drawers, SQLite tables, and HNSW vector indices.",
  author: {
    "@type": "Organization",
    name: "GISHH Labs",
    url: "https://eleven-website-self.vercel.app",
  },
  url: "https://eleven-website-self.vercel.app/tools/vault-calculator",
};

export default function VaultCalculatorPage() {
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
            __html: JSON.stringify(softwareApplicationJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        {/* ── HERO SECTION ── */}
        <Section className="relative overflow-hidden pt-5 pb-12 sm:pt-8 sm:pb-16 lg:pt-12 lg:pb-20">
          <GenesisSubpageHeroBackdrop />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-8 border-b border-el-border/60">
              <Breadcrumbs
                items={[
                  { label: "Tools", href: "/tools/vault-calculator" },
                  { label: "Vault Storage Estimator", href: "/tools/vault-calculator" },
                ]}
              />

              <div className="flex items-center gap-3">
                <span className="text-xs text-el-fg-faint">
                  Terminology depth:
                </span>
                <ClarityTogglePill />
              </div>
            </div>

            <GenesisHeroIntro className="mt-6 sm:mt-10 max-w-4xl space-y-4 sm:space-y-6">
              <div className="gfx-badge shadow-el-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83] shadow-[0_0_8px_#10bc83] motion-safe:animate-pulse motion-reduce:animate-none" />
                <CipherText text="Storage Calculator · Encrypted Local Memory" />
              </div>

              <h1 className="el-h1">
                <WordReveal text="Ten years of memory. Zero cloud bytes." />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="How much space does a lifetime of AI memories actually take up on your computer? Slide the controls below: even after hundreds of thousands of conversations and deep research notes, your private memory vault fits comfortably on an ordinary laptop SSD."
                technical="Empirical storage footprint and cryptographic performance estimator for ELEVEN's four memory drawers. Models raw SQLite page packing, HNSW vector graph indexing overhead, and hardware AES-256-GCM encryption throughput."
              />

              {/* Status Badges */}
              <GenesisBubbleRow className="flex flex-wrap gap-2.5 pt-2 text-xs text-el-fg-muted">
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  <span><code>AES-256-GCM</code> / <code>Argon2id</code></span>
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  <span>Dense HNSW (M=16, EF=64)</span>
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  <span>SQLite 3 WAL Mode</span>
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  <span>127.0.0.1 Loopback Only</span>
                </li>
              </GenesisBubbleRow>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton
                  tier="technical"
                  arrow
                  variant="primary"
                >
                  Download Sovereign Vault SDK
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/docs"
                  arrow
                >
                  Read Storage Engine Specs
                </Button>
                <Button
                  variant="ghost"
                  href="/hardware"
                  arrow
                >
                  Verify Hardware Sizing
                </Button>
              </div>
            </GenesisHeroIntro>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── INTERACTIVE CALCULATOR HARNESS ── */}
        <Section className="py-16 lg:py-24 bg-[#08090a]/60">
          <GenesisSectionIntro className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                <CipherText text="01 · Capacity and Performance Simulator" />
              </div>
              <div className="gfx-bubble !h-8 !px-3 !text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                Storage format: <code className="text-[#10bc83] font-semibold">Encrypted SQLite 3</code>
              </div>
            </div>
            <h2 className="el-h2">
              <WordReveal text="Estimate your memory drawer footprint." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Adjust the number of conversations, task complexity, and vector search quality to see how compact and fast your local database will be."
              technical="Interactive simulation modeling SQLite 3 WAL index growth, dense vector graph RAM consumption, and cryptographic unlock benchmarks across varying conversation timeframes."
            />
          </GenesisSectionIntro>

          <GenesisShowcaseFrame className="mt-10 p-4 sm:p-6">
            <SovereignVaultCalculator />
          </GenesisShowcaseFrame>
        </Section>

        <SignalBeamDivider />

        {/* ── THE 4 PRIVATE MEMORY DRAWERS SPECIFICATION ── */}
        <Section className="py-16 lg:py-24">
          <GenesisSectionIntro className="max-w-3xl space-y-4">
            <div className="gfx-badge">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              <CipherText text="02 · Memory Drawer Taxonomy" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Separated by role. United by encryption." />
            </h2>
            <DualCopy
              className="el-body"
              plain="ELEVEN organizes what it knows about you into four distinct compartments so your personal rules never get confused with temporary task notes."
              technical="Four independent storage partitions bound to localhost loopback with distinct lifecycle, index topology, and caching semantics."
            />
          </GenesisSectionIntro>

          <GenesisStaggerGrid
            from="center"
            stagger={0.09}
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Drawer 1 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6 h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-[#10bc83] font-semibold tracking-wider">
                    DRAWER 01 // PREFS
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-el-fg-faint">
                    &lt;5 MB
                  </span>
                </div>
                <h3 className="text-el-base font-normal heading-gradient">
                  Core Preferences &amp; Rules
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="Your tone preferences, operating rules, allowed paths, and trusted contacts. Always active and never forgotten."
                  technical="Structured relational table (prefs.db) holding deterministic policy whitelists, operator identities, and style configurations."
                />
              </div>
              <div className="mt-6 border-t border-white/[0.07] pt-3 text-xs text-el-fg-faint">
                <span className="text-[#10bc83]">File:</span> <code className="text-[10px]">/vault/prefs.db</code>
              </div>
            </Tilt3DCard>

            {/* Drawer 2 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6 h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-[#10bc83] font-semibold tracking-wider">
                    DRAWER 02 // SCRATCH
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-[#10bc83]">
                    RAM MMAP
                  </span>
                </div>
                <h3 className="text-el-base font-normal heading-gradient">
                  Ephemeral Working Scratchpad
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="Temporary workspace for active tasks, draft emails, and code steps. Purged automatically when the task finishes."
                  technical="Zero-disk memory-mapped ring buffer. Holds subagent scratchpad state during DAG execution, self-zeroizing on session close."
                />
              </div>
              <div className="mt-6 border-t border-white/[0.07] pt-3 text-xs text-el-fg-faint">
                <span className="text-[#10bc83]">Storage:</span> <code className="text-[10px]">RAM (/dev/shm)</code>
              </div>
            </Tilt3DCard>

            {/* Drawer 3 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6 h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-[#10bc83] font-semibold tracking-wider">
                    DRAWER 03 // EPISODES
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-[#10bc83]">
                    BI-TEMPORAL
                  </span>
                </div>
                <h3 className="text-el-base font-normal heading-gradient">
                  Episodic Interaction History
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="Chronological log of what you worked on, complete with timestamps so ELEVEN understands when facts change over time."
                  technical="Bi-temporal interaction ledger (valid_time vs transaction_time) indexed by turn session, making temporal queries exact."
                />
              </div>
              <div className="mt-6 border-t border-white/[0.07] pt-3 text-xs text-el-fg-faint">
                <span className="text-[#10bc83]">File:</span> <code className="text-[10px]">/vault/episodes.db</code>
              </div>
            </Tilt3DCard>

            {/* Drawer 4 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6 h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-[#10bc83] font-semibold tracking-wider">
                    DRAWER 04 // VECTORS
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-[#10bc83]">
                    HNSW + BM25
                  </span>
                </div>
                <h3 className="text-el-base font-normal heading-gradient">
                  Semantic Knowledge Graph
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="Understands the meaning behind your notes and code, connecting related concepts across months of work with instant search."
                  technical="Hybrid Reciprocal Rank Fusion (RRF k=60) combining dense HNSW vector search with sparse BM25 keyword rankings."
                />
              </div>
              <div className="mt-6 border-t border-white/[0.07] pt-3 text-xs text-el-fg-faint">
                <span className="text-[#10bc83]">Index:</span> <code className="text-[10px]">/vault/knowledge.qdrant</code>
              </div>
            </Tilt3DCard>
          </GenesisStaggerGrid>
        </Section>

        <SignalBeamDivider />

        {/* ── CRYPTOGRAPHIC SPEED & KEY DERIVATION ── */}
        <Section className="py-16 lg:py-24">
          <GenesisSplitReveal
            className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center"
            leftClassName="lg:col-span-6 space-y-4"
            rightClassName="lg:col-span-6"
            offset={64}
            left={
              <div>
                <GenesisSectionIntro className="space-y-4">
                  <div className="gfx-badge">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                    <CipherText text="03 · Cryptographic Throughput" />
                  </div>
                  <h2 className="el-h2">
                    <WordReveal text="Faster than your NVMe SSD." />
                  </h2>
                  <DualCopy
                    className="el-body"
                    plain="Security does not slow you down. Because ELEVEN uses your processor's built-in cryptographic hardware, reading your private vault is as fast as opening any ordinary file."
                    technical="Hardware-accelerated AES-256-GCM utilizes Intel AES-NI, AMD-V, and Apple Crypto Engine instructions, delivering over 3.8 GB/second decryption throughput."
                  />
                </GenesisSectionIntro>

                <GenesisTimelineList mode="feature-bars" className="mt-6 space-y-4 text-xs text-el-fg-muted">
                  <li className="gfx-feature-item flex items-start gap-3">
                    <span className="gfx-feature-bar" aria-hidden="true" />
                    <span><strong className="text-el-fg">Hardware enclave binding:</strong> Keys reside in Apple Secure Enclave or Windows TPM 2.0; master keys never exist in plaintext on disk.</span>
                  </li>
                  <li className="gfx-feature-item flex items-start gap-3">
                    <span className="gfx-feature-bar" aria-hidden="true" />
                    <span><strong className="text-el-fg">Argon2id memory hardening:</strong> Protects against brute-force password cracking using 64MB RAM and 4 parallel hashing lanes.</span>
                  </li>
                  <li className="gfx-feature-item flex items-start gap-3">
                    <span className="gfx-feature-bar" aria-hidden="true" />
                    <span><strong className="text-el-fg">Zero cloud keys:</strong> GISHH Labs has no escrow keys, no recovery servers, and no backdoor into your memory drawers.</span>
                  </li>
                </GenesisTimelineList>
              </div>
            }
            right={
              <GenesisShowcaseFrame className="overflow-hidden font-mono text-[11.5px]">
                <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#08090a] px-4 py-2.5 text-xs">
                  <span className="text-el-fg-faint">terminal // bench</span>
                  <span className="text-[#10bc83] text-[10px]">eleven-cli v3.1</span>
                </div>
                <div className="p-5 space-y-3 leading-relaxed">
                  <p className="text-el-fg-faint">
                    <span className="text-[#10bc83]">$</span> eleven-cli vault bench --iterations 50000
                  </p>
                  <p className="text-[#10bc83]">
                    ✔ Hardware Crypto: Apple Crypto Engine (M-Series Hardware AES-GCM)
                  </p>
                  <p className="text-el-fg-muted">
                    ✔ Key Derivation: Argon2id (m=65536, t=1, p=4) → 178.4ms
                  </p>
                  <p className="text-el-fg-muted">
                    ✔ AES-256-GCM Encrypt: 4,120 MB/s (128 KB block size)
                  </p>
                  <p className="text-el-fg-muted">
                    ✔ AES-256-GCM Decrypt: 4,380 MB/s (Authenticated AEAD)
                  </p>
                  <div className="border-t border-white/[0.07] pt-3 text-[11px] text-el-fg-faint">
                    <p className="text-[#10bc83] font-semibold">➜ 50,000 turn database query (RRF top-k=10): 4.2ms</p>
                    <p className="text-el-fg-muted">➜ External Network Sockets: 0 (127.0.0.1 Loopback Verified)</p>
                  </div>
                </div>
              </GenesisShowcaseFrame>
            }
          />
        </Section>

        <SignalBeamDivider />

        {/* ── ACCESS FUNNEL & WAITLIST CTA ── */}
        <Section className="py-20 lg:py-28">
          <GenesisCtaStage
            badge="04 · Sovereign Storage and SDK Preview"
            title="Keep your intelligence on your own hardware."
            description="Join the early access program to deploy sovereign memory drawers on your desktop or laptop."
            actions={
              <>
                <WaitlistActionButton
                  tier="technical"
                  arrow
                  className="w-full sm:w-auto"
                >
                  Download Sovereign Vault SDK
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/benchmarks/voice-latency"
                  arrow
                  className="w-full sm:w-auto"
                >
                  Inspect Voice Pipeline Benchmarks
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
              Requires minimum 16GB RAM for local 768-d embedding index operations.
            </p>
          </GenesisCtaStage>
        </Section>
      </main>

      <Footer />
    </>
  );
}
