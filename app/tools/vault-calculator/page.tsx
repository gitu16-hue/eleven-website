import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section, Container } from "@/components/ui/Section";
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
      <div className="h-[460px] w-full animate-pulse rounded-sm border border-el-border bg-el-bg-raised/40" />
    ),
  }
);
import {
  ClarityTogglePill,
  DualCopy,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";

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
        <Section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-el-cyan/10 via-transparent to-transparent opacity-60"
          />

          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-el-border/60">
              <Breadcrumbs
                items={[
                  { label: "Tools", href: "/#tools" },
                  { label: "Vault Storage Estimator", href: "/tools/vault-calculator" },
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
                <span>STORAGE CALCULATOR // ENCRYPTED LOCAL MEMORY</span>
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
              <div className="flex flex-wrap gap-2 pt-2 font-mono text-[11px]">
                <span className="rounded-xs border border-el-mint/40 bg-el-mint/10 px-2.5 py-1 text-el-mint">
                  ✓ AES-256-GCM / ARGON2ID
                </span>
                <span className="rounded-xs border border-el-cyan/40 bg-el-cyan/10 px-2.5 py-1 text-el-cyan">
                  ✓ DENSE HNSW (M=16, EF=64)
                </span>
                <span className="rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  ✓ SQLITE 3 WAL MODE
                </span>
                <span className="rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  ✓ 127.0.0.1 LOOPBACK ONLY
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton tier="technical" arrow variant="primary">
                  Download Sovereign Vault SDK
                </WaitlistActionButton>
                <Button variant="secondary" href="/docs">
                  Read Storage Engine Specs →
                </Button>
                <Button variant="ghost" href="/hardware">
                  Verify Hardware Sizing →
                </Button>
              </div>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── INTERACTIVE CALCULATOR HARNESS ── */}
        <Section className="py-16 lg:py-24 bg-[#030508]">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="el-eyebrow">
                <span>{"// 01 CAPACITY &amp; PERFORMANCE SIMULATOR"}</span>
              </div>
              <div className="rounded-xs border border-el-border bg-[#020408] px-2.5 py-1 font-mono text-[11px] text-el-fg-faint">
                STORAGE FORMAT: <span className="text-el-mint font-semibold">ENCRYPTED SQLITE 3</span>
              </div>
            </div>
            <h2 className="el-h2">
              Estimate your memory drawer footprint.
            </h2>
            <DualCopy
              className="el-body"
              plain="Adjust the number of conversations, task complexity, and vector search quality to see how compact and fast your local database will be."
              technical="Interactive simulation modeling SQLite 3 WAL index growth, dense vector graph RAM consumption, and cryptographic unlock benchmarks across varying conversation timeframes."
            />
          </div>

          <div className="mt-10">
            <SovereignVaultCalculator />
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── THE 4 PRIVATE MEMORY DRAWERS SPECIFICATION ── */}
        <Section className="py-16 lg:py-24">
          <div className="max-w-3xl space-y-4">
            <div className="el-eyebrow">
              <span>{"// 02 MEMORY DRAWER TAXONOMY"}</span>
            </div>
            <h2 className="el-h2">
              Separated by role. United by encryption.
            </h2>
            <DualCopy
              className="el-body"
              plain="ELEVEN organizes what it knows about you into four distinct compartments so your personal rules never get confused with temporary task notes."
              technical="Four independent storage partitions bound to localhost loopback with distinct lifecycle, index topology, and caching semantics."
            />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Drawer 1 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-all hover:border-el-accent/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-accent font-semibold tracking-wider">
                    DRAWER 01 // PREFS
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-el-fg-faint">
                    &lt;5 MB
                  </span>
                </div>
                <h3 className="text-el-base font-semibold text-el-fg">
                  Core Preferences &amp; Rules
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="Your tone preferences, operating rules, allowed paths, and trusted contacts. Always active and never forgotten."
                  technical="Structured relational table (prefs.db) holding deterministic policy whitelists, operator identities, and style configurations."
                />
              </div>
              <div className="mt-6 border-t border-el-border/60 pt-3 font-mono text-[10px] text-el-fg-faint">
                <span className="text-el-accent">File:</span> /vault/prefs.db
              </div>
            </Tilt3DCard>

            {/* Drawer 2 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-all hover:border-el-accent/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-accent font-semibold tracking-wider">
                    DRAWER 02 // SCRATCH
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-el-signal-lime">
                    RAM MMAP
                  </span>
                </div>
                <h3 className="text-el-base font-semibold text-el-fg">
                  Ephemeral Working Scratchpad
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="Temporary workspace for active tasks, draft emails, and code steps. Purged automatically when the task finishes."
                  technical="Zero-disk memory-mapped ring buffer. Holds subagent scratchpad state during DAG execution, self-zeroizing on session close."
                />
              </div>
              <div className="mt-6 border-t border-el-border/60 pt-3 font-mono text-[10px] text-el-fg-faint">
                <span className="text-el-signal-lime">Storage:</span> RAM (/dev/shm)
              </div>
            </Tilt3DCard>

            {/* Drawer 3 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-all hover:border-el-accent/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-accent font-semibold tracking-wider">
                    DRAWER 03 // EPISODES
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-purple-400">
                    BI-TEMPORAL
                  </span>
                </div>
                <h3 className="text-el-base font-semibold text-el-fg">
                  Episodic Interaction History
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="Chronological log of what you worked on, complete with timestamps so ELEVEN understands when facts change over time."
                  technical="Bi-temporal interaction ledger (valid_time vs transaction_time) indexed by turn session, making temporal queries exact."
                />
              </div>
              <div className="mt-6 border-t border-el-border/60 pt-3 font-mono text-[10px] text-el-fg-faint">
                <span className="text-purple-400">File:</span> /vault/episodes.db
              </div>
            </Tilt3DCard>

            {/* Drawer 4 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-all hover:border-el-accent/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-accent font-semibold tracking-wider">
                    DRAWER 04 // VECTORS
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-el-accent">
                    HNSW + BM25
                  </span>
                </div>
                <h3 className="text-el-base font-semibold text-el-fg">
                  Semantic Knowledge Graph
                </h3>
                <DualCopy
                  className="text-el-xs leading-relaxed text-el-fg-muted"
                  plain="Understands the meaning behind your notes and code, connecting related concepts across months of work with instant search."
                  technical="Hybrid Reciprocal Rank Fusion (RRF k=60) combining dense HNSW vector search with sparse BM25 keyword rankings."
                />
              </div>
              <div className="mt-6 border-t border-el-border/60 pt-3 font-mono text-[10px] text-el-fg-faint">
                <span className="text-el-accent">Index:</span> /vault/knowledge.qdrant
              </div>
            </Tilt3DCard>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── CRYPTOGRAPHIC SPEED & KEY DERIVATION ── */}
        <Section className="py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="el-eyebrow">
                <span>{"// 03 CRYPTOGRAPHIC THROUGHPUT"}</span>
              </div>
              <h2 className="el-h2">
                Faster than your NVMe SSD.
              </h2>
              <DualCopy
                className="el-body"
                plain="Security does not slow you down. Because ELEVEN uses your processor's built-in cryptographic hardware, reading your private vault is as fast as opening any ordinary file."
                technical="Hardware-accelerated AES-256-GCM utilizes Intel AES-NI, AMD-V, and Apple Crypto Engine instructions, delivering over 3.8 GB/second decryption throughput."
              />

              <ul className="space-y-3 pt-2 font-mono text-xs text-el-fg-muted">
                <li className="flex items-start gap-2.5">
                  <span className="text-el-cyan font-bold">▸</span>
                  <span><strong className="text-el-fg">Hardware Enclave Binding:</strong> Keys reside in Apple Secure Enclave or Windows TPM 2.0; master keys never exist in plaintext on disk.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-el-cyan font-bold">▸</span>
                  <span><strong className="text-el-fg">Argon2id Memory Hardening:</strong> Protects against brute-force password cracking using 64MB RAM and 4 parallel hashing lanes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-el-cyan font-bold">▸</span>
                  <span><strong className="text-el-fg">Zero Cloud Keys:</strong> GISHH Labs has no escrow keys, no recovery servers, and no backdoor into your memory drawers.</span>
                </li>
              </ul>
            </div>

            {/* Benchmark Code Box */}
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-sm border border-el-border bg-[#04060A] font-mono text-[11.5px] shadow-el-md">
                <div className="flex items-center justify-between border-b border-el-border/80 bg-el-bg-raised/70 px-4 py-2.5 text-xs">
                  <span className="text-el-fg-faint">terminal // bench</span>
                  <span className="text-el-cyan text-[10px]">eleven-cli v3.1</span>
                </div>
                <div className="p-5 space-y-3 leading-relaxed">
                  <p className="text-el-fg-faint">
                    <span className="text-el-cyan">$</span> eleven-cli vault bench --iterations 50000
                  </p>
                  <p className="text-el-mint">
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
                  <div className="border-t border-el-border/60 pt-3 text-[11px] text-el-fg-faint">
                    <p className="text-purple-400 font-semibold">➜ 50,000 turn database query (RRF top-k=10): 4.2ms</p>
                    <p className="text-el-mint">➜ External Network Sockets: 0 (127.0.0.1 Loopback Verified)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── ACCESS FUNNEL & WAITLIST CTA ── */}
        <Section className="py-20 lg:py-28">
          <div className="relative overflow-hidden rounded-sm border border-el-border bg-gradient-to-b from-el-bg-raised/90 to-el-bg p-8 sm:p-12 text-center shadow-el-lg">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-30"
            />
            <div className="relative mx-auto max-w-[640px] space-y-4">
              <div className="el-eyebrow">
                <span>{"// SOVEREIGN STORAGE // SDK PREVIEW"}</span>
              </div>
              <h2 className="el-h2">
                Keep your intelligence on your own hardware.
              </h2>
              <DualCopy
                className="el-body"
                plain="Join the early access program to deploy sovereign memory drawers on your desktop or laptop."
                technical="Request access to the ELEVEN Sovereign Vault SDK. Includes local SQLite schemas, Qdrant/HNSW vector indices, and TPM 2.0 key derivation modules."
              />

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <WaitlistActionButton tier="technical" arrow>
                  Download Sovereign Vault SDK
                </WaitlistActionButton>
                <Button variant="secondary" href="/benchmarks/voice-latency">
                  Inspect Voice Pipeline Benchmarks →
                </Button>
                <Button variant="ghost" href="/hardware">
                  Verify Hardware Sizing →
                </Button>
              </div>

              <p className="pt-2 font-mono text-[10.5px] text-el-fg-faint">
                Requires minimum 16GB RAM for local 768-d embedding index operations.
              </p>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
