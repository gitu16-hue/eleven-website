import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import dynamic from "next/dynamic";
import { WaitlistActionButton } from "@/components/v3/WaitlistActionButton";

const System2DagVisualizer = dynamic(
  () =>
    import("@/components/v3/System2DagVisualizer").then(
      (mod) => mod.System2DagVisualizer
    ),
  {
    loading: () => (
      <div className="h-[560px] w-full animate-pulse motion-reduce:animate-none rounded-sm border border-el-border bg-el-bg-raised/40" />
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

export const metadata: Metadata = {
  title: "Sovereign Multi-Agent DAG Orchestrator & Worktree Visualizer | ELEVEN",
  description:
    "Simulate how ELEVEN's asynchronous System 2 engine decomposes complex engineering objectives into Directed Acyclic Graphs (DAGs) executed across parallel quarantined git worktrees with static AST security gates.",
  alternates: {
    canonical: "/tools/dag-visualizer",
  },
  openGraph: {
    title: "Sovereign Multi-Agent DAG Orchestrator & Worktree Visualizer | ELEVEN",
    description:
      "Inspect deep reasoning. Supervise autonomous execution graphs. Real-time DAG visualizer simulating parallel git worktrees, AST audit gates, and human approval checkpoints.",
    url: "https://eleven-website-self.vercel.app/tools/dag-visualizer",
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
      name: "Tools",
      item: "https://eleven-website-self.vercel.app/tools/dag-visualizer",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "DAG Plan Orchestrator",
      item: "https://eleven-website-self.vercel.app/tools/dag-visualizer",
    },
  ],
};

const techArticleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Sovereign Multi-Agent DAG Orchestrator & Worktree Visualizer",
  description:
    "Technical specification for ELEVEN's System 2 asynchronous execution engine, featuring topological DAG decomposition, isolated git worktree sandboxing, static AST security audits, and Ed25519 human approval gates.",
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
  url: "https://eleven-website-self.vercel.app/tools/dag-visualizer",
};

export default function DagVisualizerPage() {
  return (
    <>
      <Nav />

      <main
        id="main-content"
        className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
      >
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
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-60"
          />

          <Container className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-el-border/60">
              <Breadcrumbs
                items={[
                  { label: "Tools", href: "/tools/dag-visualizer" },
                  { label: "DAG Plan Orchestrator", href: "/tools/dag-visualizer" },
                ]}
              />

              <div className="flex items-center gap-3">
                <span className="text-xs text-el-fg-faint">
                  Terminology depth:
                </span>
                <ClarityTogglePill />
              </div>
            </div>

            <div className="mt-10 max-w-4xl space-y-6">
              <div className="el-badge shadow-el-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-el-signal-lime motion-reduce:animate-none" />
                <CipherText text="System 2 Async Reasoning · Quarantined Git Worktrees" />
              </div>

              <h1 className="el-h1">
                <WordReveal text="Inspect deep reasoning. Supervise autonomous execution graphs." />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="See how ELEVEN breaks large, multi-hour coding tasks into safe, parallel steps. Each agent works in an isolated copy of your code, tests everything, and pauses for your approval before anything touches your real files."
                technical="Interactive Directed Acyclic Graph (DAG) visualizer simulating multi-agent plan decomposition, parallel git worktree isolation, static AST safety gates, and deterministic human-in-the-loop cryptographic signing checkpoints."
              />

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 pt-2 text-xs text-el-fg-muted">
                <span className="rounded-xs border border-el-signal-lime/40 bg-el-signal-lime/10 px-2.5 py-1 text-el-signal-lime">
                  Isolated Git Worktrees (<code>INV-09</code>)
                </span>
                <span className="rounded-xs border border-el-signal-lime/30 bg-el-signal-lime/5 px-2.5 py-1 text-el-fg-muted">
                  Static AST Audit Gates (<code>INV-10</code>)
                </span>
                <span className="rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  Human Sovereign Veto (<code>INV-02</code>)
                </span>
                <span className="rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  Atomic Merkle Rollback (<code>INV-05</code>)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton
                  tier="technical"
                  arrow
                  variant="primary"
                  className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.98] disabled:opacity-50"
                >
                  Request DAG Orchestrator Preview
                </WaitlistActionButton>

                <Button
                  href="/solutions/developers"
                  variant="secondary"
                  arrow
                  className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.98] disabled:opacity-50"
                >
                  Explore Developer Solutions
                </Button>

                <Button
                  href="/tools/inspector"
                  variant="ghost"
                  arrow
                  className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.98] disabled:opacity-50"
                >
                  Inspect ActionProposals
                </Button>
              </div>
            </div>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* INTERACTIVE DAG ORCHESTRATOR COMPONENT */}
        <Section className="py-16 lg:py-24 bg-el-bg">
          <Container>
            <div className="max-w-3xl space-y-4">
              <div className="el-eyebrow">
                <CipherText text="// 01 INTERACTIVE EXECUTION GRAPH PLAYGROUND" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="Simulate Asynchronous Multi-Agent Planning" />
              </h2>
              <p className="el-body">
                Inspect how complex software engineering objectives are decomposed into topological dependency graphs. Click any node to view isolated sandbox worktrees, tool arguments, AST safety checks, and Ed25519 diff hashes.
              </p>
            </div>

            <div className="mt-10">
              <System2DagVisualizer />
            </div>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* THE 4 DAG ISOLATION INVARIANTS */}
        <Section className="py-16 lg:py-24">
          <Container>
            <div className="max-w-3xl space-y-4">
              <div className="el-eyebrow">
                <CipherText text="// 02 CONFINEMENT ARCHITECTURE" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="The 4 DAG Isolation Invariants" />
              </h2>
              <p className="el-body">
                Autonomous code agents can introduce regression, syntax damage, or accidental deletions if allowed to mutate your working copy unchecked. ELEVEN enforces 4 non-negotiable architectural invariants across every DAG.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Invariant 1 */}
              <Tilt3DCard className="relative overflow-hidden rounded-sm border border-el-border bg-el-bg-raised/30 p-6 lg:p-8 space-y-4 transition-colors duration-200 hover:border-el-signal-lime/40">
                <div className="pointer-events-none absolute top-3 right-3">
                  <code className="text-el-signal-lime/50 font-mono text-xs">INV-09</code>
                </div>
                <div className="flex items-center gap-2 text-xs text-el-signal-lime font-semibold">
                  <span className="h-2 w-2 rounded-full bg-el-signal-lime" />
                  <span>Worktree isolation invariant</span>
                </div>
                <h3 className="text-xl font-bold text-el-fg">
                  Quarantined Git Worktree Sandboxes
                </h3>
                <DualCopy
                  className="text-xs text-el-fg-muted leading-relaxed"
                  plain="Agents never touch your primary git branch or uncommitted work. Each worker receives an isolated temporary branch in a quarantined folder. Your current code remains completely untouched."
                  technical="The supervisor spawns ephemeral git worktrees using git worktree add --detach in an isolated ramdisk or temporary directory. Subagents perform file edits, compilation, and unit tests inside this sandbox boundary, guaranteeing zero contamination of refs/heads/main."
                />
                <div className="border-t border-el-border/60 pt-3 text-xs text-el-fg-faint flex justify-between">
                  <span>Enforcement:</span>
                  <code className="text-el-signal-lime text-[11px]">Filesystem Isolation Sandbox</code>
                </div>
              </Tilt3DCard>

              {/* Invariant 2 */}
              <Tilt3DCard className="relative overflow-hidden rounded-sm border border-el-border bg-el-bg-raised/30 p-6 lg:p-8 space-y-4 transition-colors duration-200 hover:border-el-signal-lime/40">
                <div className="pointer-events-none absolute top-3 right-3">
                  <code className="text-el-signal-lime/50 font-mono text-xs">INV-10</code>
                </div>
                <div className="flex items-center gap-2 text-xs text-el-signal-lime font-semibold">
                  <span className="h-2 w-2 rounded-full bg-el-signal-lime" />
                  <span>AST safety gate invariant</span>
                </div>
                <h3 className="text-xl font-bold text-el-fg">
                  Static AST Pre-Verification
                </h3>
                <DualCopy
                  className="text-xs text-el-fg-muted leading-relaxed"
                  plain="Before any generated code is compiled, an automated inspector analyzes the code structure to ensure no destructive shell commands, hidden network calls, or dangerous scripts were inserted."
                  technical="Abstract Syntax Tree (AST) analyzers scan all mutated files against formal security policies. Code containing arbitrary dynamic code evaluation (eval, Function), unverified child process spawns, or hardcoded API keys is rejected immediately before reaching the build stage."
                />
                <div className="border-t border-el-border/60 pt-3 text-xs text-el-fg-faint flex justify-between">
                  <span>Enforcement:</span>
                  <code className="text-el-signal-lime text-[11px]">Tree-sitter / Babel AST Gate</code>
                </div>
              </Tilt3DCard>

              {/* Invariant 3 */}
              <Tilt3DCard className="relative overflow-hidden rounded-sm border border-el-border bg-el-bg-raised/30 p-6 lg:p-8 space-y-4 transition-colors duration-200 hover:border-el-signal-lime/40">
                <div className="pointer-events-none absolute top-3 right-3">
                  <code className="text-el-signal-lime/50 font-mono text-xs">INV-02</code>
                </div>
                <div className="flex items-center gap-2 text-xs text-el-signal-lime font-semibold">
                  <span className="h-2 w-2 rounded-full bg-el-signal-lime" />
                  <span>Human sovereign veto invariant</span>
                </div>
                <h3 className="text-xl font-bold text-el-fg">
                  Deterministic Human Approval Gate
                </h3>
                <DualCopy
                  className="text-xs text-el-fg-muted leading-relaxed"
                  plain="When an agent finishes working on a solution, it stops and presents a clear summary of all proposed changes. You review the diff and sign off before any commit is merged."
                  technical="The DAG traversal halts deterministically at Rank 3. The supervisor compiles an ActionProposal containing a unified diff and SHA-256 tree hash. Execution cannot proceed to Rank 4 without an Ed25519 signature from the authorized user or physical FIDO2 biometric assertion."
                />
                <div className="border-t border-el-border/60 pt-3 text-xs text-el-fg-faint flex justify-between">
                  <span>Enforcement:</span>
                  <code className="text-el-signal-lime text-[11px]">Cryptographic Non-Repudiation</code>
                </div>
              </Tilt3DCard>

              {/* Invariant 4 */}
              <Tilt3DCard className="relative overflow-hidden rounded-sm border border-el-border bg-el-bg-raised/30 p-6 lg:p-8 space-y-4 transition-colors duration-200 hover:border-el-signal-lime/40">
                <div className="pointer-events-none absolute top-3 right-3">
                  <code className="text-el-signal-lime/50 font-mono text-xs">INV-05</code>
                </div>
                <div className="flex items-center gap-2 text-xs text-el-signal-lime font-semibold">
                  <span className="h-2 w-2 rounded-full bg-el-signal-lime" />
                  <span>Merkle rollback invariant</span>
                </div>
                <h3 className="text-xl font-bold text-el-fg">
                  Atomic Commit &amp; Instant Rollback
                </h3>
                <DualCopy
                  className="text-xs text-el-fg-muted leading-relaxed"
                  plain="If any test fails or you decline a proposed change, the entire execution tree is wiped clean in milliseconds, leaving your code exactly as it was."
                  technical="State transitions are recorded into an immutable local Merkle chain. If any node fails AST validation or unit test assertions, the supervisor invokes an atomic git reset and destroys the ephemeral worktree in &lt;50ms, eliminating partial or corrupted states."
                />
                <div className="border-t border-el-border/60 pt-3 text-xs text-el-fg-faint flex justify-between">
                  <span>Enforcement:</span>
                  <code className="text-el-signal-lime text-[11px]">Atomic Transaction Ledger</code>
                </div>
              </Tilt3DCard>
            </div>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* DUAL-MIND SYMBIOSIS */}
        <Section className="py-16 lg:py-24 bg-el-bg">
          <Container>
            <div className="max-w-3xl space-y-4">
              <div className="el-eyebrow">
                <CipherText text="// 03 DUAL-MIND SYMBIOSIS" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="System 1 Voice + System 2 DAG: Working in Parallel" />
              </h2>
              <DualCopy
                className="el-body"
                plain="Traditional AI chatbots force you to wait in silence while they generate code. ELEVEN's dual-mind system lets you continue talking naturally via voice while complex coding jobs run smoothly in the background."
                technical="ELEVEN decouples conversational interaction from computational reasoning. System 1 executes on dedicated audio threads (Whisper Large v3 Turbo + Kokoro TTS), maintaining continuous sub-50ms conversational barge-in responsiveness while System 2 worker agents process asynchronous DAG pipelines across quarantined worktrees."
              />
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="rounded-xs border border-el-signal-lime/40 bg-el-bg-raised/40 p-6 space-y-3">
                <div className="flex items-center justify-between text-el-signal-lime border-b border-el-border pb-2">
                  <span className="font-semibold text-sm">System 1 (Instant Voice)</span>
                  <span className="text-[10px]">Sub-50ms barge-in</span>
                </div>
                <ul className="text-xs text-el-fg-muted space-y-2 leading-relaxed">
                  <li>• Continuous 16kHz circular PCM audio loop with immediate hardware VAD interruption.</li>
                  <li>• Interprets user intent, issues quick clarifications, and presents approvals.</li>
                  <li>• Never blocked by slow disk I/O, heavy AST parsing, or compiler output.</li>
                </ul>
              </div>

              <div className="rounded-xs border border-el-signal-lime/40 bg-el-bg-raised/40 p-6 space-y-3">
                <div className="flex items-center justify-between text-el-signal-lime border-b border-el-border pb-2">
                  <span className="font-semibold text-sm">System 2 (Async DAG Planner)</span>
                  <span className="text-[10px]">Parallel execution</span>
                </div>
                <ul className="text-xs text-el-fg-muted space-y-2 leading-relaxed">
                  <li>• Decomposes high-level prompts into topological task nodes with strict dependency trees.</li>
                  <li>• Spawns quarantined git worktrees for isolated parallel code authoring.</li>
                  <li>• Reports live milestone progress back to System 1 for conversational speech updates.</li>
                </ul>
              </div>
            </div>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* TECHNICAL FAQ */}
        <Section className="py-16 lg:py-24">
          <Container>
            <div className="max-w-3xl space-y-4">
              <div className="el-eyebrow">
                <CipherText text="// 04 TECHNICAL FAQ" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="Frequently Asked Architectural Questions" />
              </h2>
              <p className="el-body">
                Implementation details for software architects and senior engineers evaluating ELEVEN’s execution engine.
              </p>
            </div>

            <div className="mt-10 max-w-4xl space-y-4">
              {[
                {
                  q: "How does ELEVEN prevent git merge conflicts between parallel worktrees?",
                  a: "During the initial plan decomposition (Rank 0), the System 2 master agent parses the project's dependency graph and assigns non-overlapping file scopes to parallel worktrees (e.g. database migration vs client UI hooks). In cases where shared files must be touched, nodes are sequenced with explicit dependencies to guarantee sequential, conflict-free merges.",
                },
                {
                  q: "What happens if a background worker enters an infinite loop or stalls?",
                  a: "Each DAG node runs with a strict execution budget (default: 180 seconds or 10,000 tool operations). The Ring-0 host supervisor monitors CPU and process timeouts. If an agent exceeds its budget or produces repetitive looping outputs, the node is terminated, the ephemeral worktree is pruned, and System 1 prompts the user with diagnostics.",
                },
                {
                  q: "Can I inspect the full git diff before approving a DAG commit?",
                  a: "Yes. When the graph reaches the Human Sovereign Gate (Rank 3), you can view a unified visual diff, inspect AST audit reports, and run test suites locally. You can approve individual worktrees or request targeted revisions conversationally through System 1 voice.",
                },
                {
                  q: "Does the DAG orchestrator require Docker or container virtualization?",
                  a: "No. While container runtimes are supported for enterprise fleets, ELEVEN's default sandbox uses native git worktrees paired with process-level isolation (macOS sandbox-exec / Windows Restricted Tokens). This enables instant (<100ms) worktree provisioning with zero Docker daemon overhead.",
                },
              ].map((faq, i) => (
                <div key={i} className="rounded-xs border border-el-border bg-el-bg-raised/40 p-5 space-y-2">
                  <h3 className="text-sm font-semibold text-el-fg">
                    {faq.q}
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
        <Section className="py-16 lg:py-24 border-t border-el-border bg-gradient-to-b from-el-bg-raised/90 to-el-bg">
          <Container>
            <div className="mx-auto max-w-3xl text-center space-y-6">
              <div className="el-eyebrow">
                <CipherText text="// 05 ASYNCHRONOUS SYSTEM 2 ENGINE" />
              </div>

              <h2 className="el-h2">
                <WordReveal text="Ready to build with supervised multi-agent graphs?" />
              </h2>

              <DualCopy
                className="mx-auto max-w-2xl el-body"
                plain="Join the early access program to test ELEVEN's DAG execution engine and worktree sandboxing on your local repositories."
                technical="Request access to the ELEVEN Developer Preview. Includes eleven-cli, System 2 DAG orchestrator binaries, and native git worktree bridges."
              />

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <WaitlistActionButton
                  tier="technical"
                  arrow
                  variant="primary"
                  className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.98] disabled:opacity-50"
                >
                  Request DAG Orchestrator Preview
                </WaitlistActionButton>

                <Button
                  href="/solutions/developers"
                  variant="secondary"
                  arrow
                  className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.98] disabled:opacity-50"
                >
                  Developer Diff Review Console
                </Button>
              </div>

              {/* Cross Links to Other Deep Architecture Pages */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-xs text-el-fg-faint">
                <Link href="/tools/inspector" className="hover:text-el-signal-lime hover:underline">
                  ActionProposal Inspector
                </Link>
                <Link href="/hardware" className="hover:text-el-signal-lime hover:underline">
                  Hardware Compatibility
                </Link>
                <Link href="/security" className="hover:text-el-signal-lime hover:underline">
                  Security Architecture
                </Link>
                <Link href="/solutions/enterprise" className="hover:text-el-signal-lime hover:underline">
                  Enterprise Fleet Governance
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