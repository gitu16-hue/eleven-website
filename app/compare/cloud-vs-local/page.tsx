import type { Metadata } from "next";
import { Info } from "lucide-react";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { LocalVsCloudCalculator } from "@/components/v3/LocalVsCloudCalculator";
import { WaitlistActionButton } from "@/components/v3/WaitlistActionButton";
import {
  CipherText,
  ClarityTogglePill,
  DualCopy,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";

export const metadata: Metadata = {
  title: "Local Control Plane vs Cloud AI Assistants | ELEVEN Comparison",
  description:
    "Compare ELEVEN's sovereign local-first personal AI operating system with conventional cloud chat assistants. 100% data confinement, Ring-0 hardware killswitch, zero token subscriptions.",
  alternates: {
    canonical: "/compare/cloud-vs-local",
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
      name: "Compare",
      item: "https://eleven-website-self.vercel.app/compare/cloud-vs-local",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Cloud vs Local",
      item: "https://eleven-website-self.vercel.app/compare/cloud-vs-local",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does ELEVEN differ from cloud AI chat assistants like ChatGPT or Claude?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cloud AI chat assistants process all user prompts, documents, and code on remote server clusters, creating external data exposure and recurring subscription costs. ELEVEN is a local-first personal AI operating system created by GISHH Labs that runs on your PC, keeps 100% of memory drawers encrypted on local disk, and isolates untrusted model execution in quarantined sandboxes.",
      },
    },
    {
      "@type": "Question",
      name: "Is ELEVEN related to cloud voice synthesis or speech generation APIs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. ELEVEN by GISHH Labs is an autonomous desktop personal AI operating system with process supervision, private memory schemas, and local control planes. It is not an audio generation API or voice cloning service.",
      },
    },
    {
      "@type": "Question",
      name: "Can ELEVEN function completely offline without an internet connection?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. When paired with quantized local models (such as Llama 3, Mistral, or Qwen on Apple Silicon or NVIDIA RTX hardware), ELEVEN operates fully air-gapped with zero outbound network calls.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if an agent tries to execute a dangerous shell command?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ELEVEN enforces 5 fail-closed policy checkpoints. Destructive actions generate an Ed25519 ActionProposal that requires explicit human approval. Furthermore, the un-bypassable Ring-0 hardware watchdog terminates runaway processes in under 0.05 seconds.",
      },
    },
  ],
};

export default function CompareCloudVsLocalPage() {
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
            __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        {/* ── HERO SECTION ── */}
        <Section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent opacity-60"
          />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-el-border/60">
              <Breadcrumbs
                items={[
                  { label: "Compare", href: "/compare/cloud-vs-local" },
                  { label: "Cloud vs Local", href: "/compare/cloud-vs-local" },
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
                <CipherText text="Architectural Comparison · Sovereign Runtime" />
              </div>

              <h1 className="el-h1">
                <WordReveal text="Sovereignty is not a setting. It is an architecture." />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="Cloud AI tools promise privacy through checkboxes in their settings, but your data still travels across the internet to their servers. ELEVEN runs directly on your computer so your files, passwords, and deep work never leave your physical machine."
                technical="Why frontier reasoning models belong inside an un-bypassable local control plane on your hardware, not inside a black-box cloud. Complete separation of untrusted model reasoning from deterministic OS execution."
              />

              <div className="flex flex-wrap gap-2 pt-2 text-el-xs">
                <span className="rounded-xs border border-el-border/80 bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  100% local silicon confinement
                </span>
                <span className="rounded-xs border border-el-border/80 bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  Zero data residency risk
                </span>
                <span className="rounded-xs border border-el-border/80 bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  Fixed workstation economics
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton
                  tier="general"
                  arrow
                  variant="primary"
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  Claim Your Sovereignty
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/solutions/developers"
                  arrow
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  Explore Developer Sandbox
                </Button>
                <Button
                  variant="ghost"
                  href="/tools/vault-calculator"
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  Estimate Storage Specs
                </Button>
              </div>
            </div>
          </div>

          {/* ── PROMINENT DISAMBIGUATION NOTICE BANNER ── */}
          <div className="mt-12 rounded-sm border border-el-border/80 bg-el-bg-raised/60 p-4 sm:p-5 backdrop-blur-sm">
            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-xs bg-el-accent/10 text-el-accent">
                <Info className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <div className="space-y-1 text-xs leading-relaxed">
                <span className="text-el-accent font-medium">
                  Product Identity Notice:
                </span>
                <p className="text-el-fg-muted text-[11.5px]">
                  <strong>ELEVEN v3.1</strong> is an autonomous desktop personal AI operating system developed by <strong>GISHH Labs</strong>. It provides local process supervision, private memory drawers, and deterministic policy enforcement for your desktop workstation. It is not an audio generation API, voice synthesis service, or speech cloning SaaS.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── THE 6 CRITICAL VECTORS COMPARISON MATRIX ── */}
        <Section className="py-16 lg:py-24">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="el-eyebrow">
              <CipherText text="// 01 Six-Dimensional Audit" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Local workstation control vs. multi-tenant cloud subscriptions." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Compare how local personal AI stacks up against typical cloud assistants across privacy, speed, emergency safety, and lifetime cost."
              technical="Direct architectural comparison matrix across Memory Topology, Code Execution Jails, Interrupt Latency, Audio DSP, Marginal Cost, and Audit Chains."
            />
          </div>

          {/* Detailed Responsive Table */}
          <div className="mt-10 overflow-x-auto rounded-sm border border-el-border bg-el-bg-raised/40">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-el-border bg-el-bg-raised text-el-fg-muted">
                  <th className="py-4 px-4 font-medium text-el-fg w-[24%]">
                    Operational vector
                  </th>
                  <th className="py-4 px-4 font-medium text-el-accent w-[38%]">
                    ELEVEN sovereign local control plane
                  </th>
                  <th className="py-4 px-4 font-medium text-el-fg-faint w-[38%]">
                    Commercial cloud chat assistants
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-el-border/60 text-el-fg-muted">
                {/* Vector 1 */}
                <tr className="hover:bg-el-bg-raised/20 transition-colors">
                  <td className="py-4 px-4 font-semibold text-el-fg">
                    1. Data Ownership &amp; Storage
                  </td>
                  <td className="py-4 px-4 text-el-signal-lime">
                    <strong className="text-el-fg block mb-0.5">100% Local AES-256 Storage</strong>
                    Stored in private SQLite drawers on your physical disk. Zero cloud telemetry, zero model retraining on your private files.
                  </td>
                  <td className="py-4 px-4 text-red-400/90">
                    <strong className="text-el-fg block mb-0.5">Remote Cloud Multi-Tenant DBs</strong>
                    All queries, attachments, and audio samples stream to external cloud servers. Subject to provider data policies and legal subpoenas.
                  </td>
                </tr>

                {/* Vector 2 */}
                <tr className="hover:bg-el-bg-raised/20 transition-colors">
                  <td className="py-4 px-4 font-semibold text-el-fg">
                    2. Process Sandboxing &amp; Execution
                  </td>
                  <td className="py-4 px-4 text-el-signal-lime">
                    <strong className="text-el-fg block mb-0.5">Quarantined OS Namespaces</strong>
                    Code runs in low-integrity jailed worktrees with read-only root mounts. Ephemeral test environments isolated from personal files.
                  </td>
                  <td className="py-4 px-4 text-yellow-400/90">
                    <strong className="text-el-fg block mb-0.5">Un-Jailed or Remote VMs</strong>
                    Either cannot interact with your local files at all, or requires un-sandboxed terminal bridges that execute arbitrary commands.
                  </td>
                </tr>

                {/* Vector 3 */}
                <tr className="hover:bg-el-bg-raised/20 transition-colors">
                  <td className="py-4 px-4 font-semibold text-el-fg">
                    3. Emergency Killswitch
                  </td>
                  <td className="py-4 px-4 text-el-signal-lime">
                    <strong className="text-el-fg block mb-0.5">Ring-0 Hardware Watchdog (&lt;0.05s)</strong>
                    Dedicated hardware listener instantly terminates spawned threads and isolates sockets on physical gesture or hotkey.
                  </td>
                  <td className="py-4 px-4 text-red-400/90">
                    <strong className="text-el-fg block mb-0.5">HTTP Cancel (Unreliable)</strong>
                    Pressing &quot;Stop&quot; sends a network packet over the web. Actions already triggered on cloud nodes cannot be rolled back.
                  </td>
                </tr>

                {/* Vector 4 */}
                <tr className="hover:bg-el-bg-raised/20 transition-colors">
                  <td className="py-4 px-4 font-semibold text-el-fg">
                    4. Voice Perception &amp; Barge-In
                  </td>
                  <td className="py-4 px-4 text-el-signal-lime">
                    <strong className="text-el-fg block mb-0.5">16kHz Local Buffer (&lt;50ms Barge-In)</strong>
                    Real-time audio processing directly on local NPU/GPU. Zero network round-trip delay when interrupting or speaking naturally.
                  </td>
                  <td className="py-4 px-4 text-yellow-400/90">
                    <strong className="text-el-fg block mb-0.5">WebSocket Streaming (400 to 1200ms)</strong>
                    Subject to WiFi jitter, internet packet loss, and cloud queue backpressure. Awkward pauses and delayed barge-in detection.
                  </td>
                </tr>

                {/* Vector 5 */}
                <tr className="hover:bg-el-bg-raised/20 transition-colors">
                  <td className="py-4 px-4 font-semibold text-el-fg">
                    5. Economics &amp; Pricing Model
                  </td>
                  <td className="py-4 px-4 text-el-signal-lime">
                    <strong className="text-el-fg block mb-0.5">Fixed Workstation License ($0 per-token)</strong>
                    Run billions of tokens on your own silicon for zero marginal cost. Predictable budgeting with no sudden rate-limit throttling.
                  </td>
                  <td className="py-4 px-4 text-red-400/90">
                    <strong className="text-el-fg block mb-0.5">Monthly Seats + Metered Token API Bills</strong>
                    Expensive monthly subscriptions plus compounding token overages for long context monorepos or multi-agent swarms.
                  </td>
                </tr>

                {/* Vector 6 */}
                <tr className="hover:bg-el-bg-raised/20 transition-colors">
                  <td className="py-4 px-4 font-semibold text-el-fg">
                    6. Auditability &amp; Invariants
                  </td>
                  <td className="py-4 px-4 text-el-signal-lime">
                    <strong className="text-el-fg block mb-0.5">Cryptographic Ed25519 Receipts</strong>
                    Every action proposal creates an immutable SHA-256 hash receipt with a 30s TTL nonce for mathematical proof of execution.
                  </td>
                  <td className="py-4 px-4 text-el-fg-faint">
                    <strong className="text-el-fg block mb-0.5">Ephemeral Web Logs</strong>
                    Closed proprietary logs stored inside the vendor&apos;s cloud, unverified by cryptographic signatures and subject to deletion.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── INTERACTIVE TCO & PRIVACY CALCULATOR ── */}
        <Section className="py-16 lg:py-24 bg-el-bg">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="el-eyebrow">
                <CipherText text="// 02 Interactive TCO &amp; Privacy Simulator" />
              </div>
              <div className="rounded-xs border border-el-border bg-el-bg-raised px-2.5 py-1 text-xs text-el-fg-faint">
                Engine: <span className="text-el-mint font-medium">Local Workstation Silicon</span>
              </div>
            </div>
            <h2 className="el-h2">
              <WordReveal text="Calculate your sovereignty dividend." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Slide the controls below to see how much money your team saves and how many gigabytes of sensitive data you keep safe by moving from cloud subscriptions to ELEVEN."
              technical="Interactive model simulating enterprise SaaS seat subscriptions, token consumption curves, and outbound corporate IP exposure risk."
            />
          </div>

          <div className="mt-10">
            <LocalVsCloudCalculator />
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── THREE ARCHITECTURAL PILLARS OF SOVEREIGNTY ── */}
        <Section className="py-16 lg:py-24">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="el-eyebrow">
              <CipherText text="// 03 Hardware-Backed Sovereignty" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Architected to make trust verifiable." />
            </h2>
            <DualCopy
              className="el-body"
              plain="We do not ask you to trust our promises. We built ELEVEN so the software mathematically cannot leak your data or disobey your rules."
              technical="Security guarantees enforced through deterministic kernel primitives, hardware security enclaves, and cryptographic proofs."
            />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Pillar 1 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-accent/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-el-accent font-medium">
                    01 · Enclave
                  </span>
                  <span className="rounded-xs border border-el-border bg-el-bg px-1.5 py-0.5 text-[9.5px] text-el-fg-faint">
                    Hardware key
                  </span>
                </div>
                <h3 className="text-el-lg font-medium tracking-tight text-el-fg">
                  Hardware-Bound Keys
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="Your master encryption keys are generated right inside your computer's secure chip. GISHH Labs never possesses your keys and has no backdoor into your memories."
                  technical="Argon2id key derivation bound to Apple Secure Enclave or Windows TPM 2.0. Memory vaults cannot be decrypted even if an attacker gains full physical disk image access."
                />
              </div>

              <div className="mt-6 border-t border-el-border/60 pt-4 text-xs text-el-fg-faint">
                <span className="text-el-accent">Key Derivation:</span> <code>Argon2id / TPM 2.0 PCR</code>
              </div>
            </Tilt3DCard>

            {/* Pillar 2 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-accent/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-el-accent font-medium">
                    02 · Air-Gap
                  </span>
                  <span className="rounded-xs border border-el-border bg-el-bg px-1.5 py-0.5 text-[9.5px] text-el-signal-lime">
                    Offline 100%
                  </span>
                </div>
                <h3 className="text-el-lg font-medium tracking-tight text-el-fg">
                  Air-Gap Autonomy
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="Unplug your ethernet or turn off WiFi on an airplane: ELEVEN keeps working without a glitch. Your AI does not need the cloud to think, write, or plan."
                  technical="Zero external phone-home telemetry. Local vector indices (HNSW), embedded model inference, and SQLite drawers function seamlessly in zero-connectivity environments."
                />
              </div>

              <div className="mt-6 border-t border-el-border/60 pt-4 text-xs text-el-fg-faint">
                <span className="text-el-signal-lime">Network Status:</span> <code>Loopback Bind (127.0.0.1)</code>
              </div>
            </Tilt3DCard>

            {/* Pillar 3 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-accent/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-el-accent font-medium">
                    03 · Policy Gates
                  </span>
                  <span className="rounded-xs border border-el-border bg-el-bg px-1.5 py-0.5 text-[9.5px] text-el-fg-muted">
                    Fail-closed
                  </span>
                </div>
                <h3 className="text-el-lg font-medium tracking-tight text-el-fg">
                  5 Fail-Closed Checkpoints
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="The AI is never given full root control of your computer. Every dangerous command or file edit must pass five strict safety checkpoints before executing."
                  technical="Mandatory static policy verification: Path Confinement, AST Auditing, Unit Regressions, Egress Firewalling, and Cryptographic Human Escalation."
                />
              </div>

              <div className="mt-6 border-t border-el-border/60 pt-4 text-xs text-el-fg-faint">
                <span className="text-el-fg font-medium">Policy Gates:</span> <code>5 Checkpoints Active</code>
              </div>
            </Tilt3DCard>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── FREQUENTLY ASKED QUESTIONS (GEO & SEO CITABILITY) ── */}
        <Section className="py-16">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="el-eyebrow">
              <CipherText text="// 04 Frequently Asked Questions" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Clear answers on architecture &amp; sovereignty." />
            </h2>
            <p className="el-body">
              Understand how ELEVEN fits into your existing computing setup and hardware requirements.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-sm border border-el-border/80 bg-el-bg-raised/40 p-6 space-y-2.5">
              <h3 className="text-el-base font-semibold text-el-fg">
                What hardware is needed to run ELEVEN locally?
              </h3>
              <p className="text-el-sm text-el-fg-muted leading-relaxed">
                ELEVEN runs smoothly on Apple Silicon Macs (M1/M2/M3/M4 with 16GB+ RAM) and Windows or Linux workstations equipped with NVIDIA RTX GPUs (RTX 3060 12GB+, 4070, 4080, 4090). For lighter tasks, quantized 7B and 14B models execute directly on unified system RAM.
              </p>
            </div>

            <div className="rounded-sm border border-el-border/80 bg-el-bg-raised/40 p-6 space-y-2.5">
              <h3 className="text-el-base font-semibold text-el-fg">
                Can I still connect frontier cloud models if I want to?
              </h3>
              <p className="text-el-sm text-el-fg-muted leading-relaxed">
                Yes. ELEVEN supports a Hybrid Edge mode. You can route complex non-sensitive reasoning prompts to frontier models via encrypted egress, while your private memory drawers, personal files, and execution sandbox remain 100% confined to your local PC.
              </p>
            </div>

            <div className="rounded-sm border border-el-border/80 bg-el-bg-raised/40 p-6 space-y-2.5">
              <h3 className="text-el-base font-semibold text-el-fg">
                How does ELEVEN differ from cloud voice APIs?
              </h3>
              <p className="text-el-sm text-el-fg-muted leading-relaxed">
                ELEVEN by GISHH Labs is an autonomous desktop personal AI operating system with process supervision, quarantined git worktrees, and sovereign local memory. It is not an audio generator or voice cloning API service.
              </p>
            </div>

            <div className="rounded-sm border border-el-border/80 bg-el-bg-raised/40 p-6 space-y-2.5">
              <h3 className="text-el-base font-semibold text-el-fg">
                How does the Emergency Stop killswitch work?
              </h3>
              <p className="text-el-sm text-el-fg-muted leading-relaxed">
                The killswitch is implemented at the un-sandboxed host supervisor level (outside model control). Pressing the physical shortcut or double-tapping the desktop widget halts all spawned worker threads and tears down network sockets in under 0.05 seconds.
              </p>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── HIGH CONVERTING SOVEREIGN WAITLIST CTA ── */}
        <Section className="py-20">
          <div className="relative overflow-hidden rounded-sm border border-el-border bg-gradient-to-b from-el-bg-raised/90 to-el-bg p-8 sm:p-12 text-center shadow-el-lg">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-30"
            />
            <div className="relative mx-auto max-w-[640px] space-y-4">
              <div className="el-badge mx-auto shadow-el-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-el-accent animate-pulse motion-reduce:animate-none" />
                <CipherText text="Sovereign Alpha · Direct Workstation Access" />
              </div>

              <h2 className="el-h2">
                <WordReveal text="Take back your computing sovereignty." />
              </h2>

              <DualCopy
                className="el-body"
                plain="Stop renting your intelligence from cloud silos. Experience personal AI that lives on your hardware, respects your privacy, and answers only to you."
                technical="Deploy frontier reasoning inside a provably secure, local-first control plane. Zero telemetry, zero token subscriptions, mathematical invariant guarantees."
              />

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <WaitlistActionButton
                  tier="general"
                  arrow
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  Claim Your Sovereignty (Join Waitlist)
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/docs"
                  arrow
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  Read Technical Documentation
                </Button>
              </div>

              <p className="pt-2 text-xs text-el-fg-faint">
                Early access invitations are dispatched weekly in verified batches.
              </p>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
