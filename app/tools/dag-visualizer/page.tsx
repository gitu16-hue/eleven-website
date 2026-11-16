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
          <GenesisSubpageHeroBackdrop />

          <Container className="relative z-10">
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

            <GenesisHeroIntro className="mt-10 max-w-4xl space-y-6">
              <div className="gfx-badge shadow-el-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83] shadow-[0_0_8px_#10bc83] motion-safe:animate-pulse motion-reduce:animate-none" />
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
              <GenesisBubbleRow className="flex flex-wrap gap-2.5 pt-2 text-xs text-el-fg-muted">
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  <span>Isolated Git Worktrees (<code>INV-09</code>)</span>
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  <span>Static AST Audit Gates (<code>INV-10</code>)</span>
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  <span>Human Sovereign Veto (<code>INV-02</code>)</span>
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  <span>Atomic Merkle Rollback (<code>INV-05</code>)</span>
                </li>
              </GenesisBubbleRow>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton
                  tier="technical"
                  arrow
                  variant="primary"
                >
                  Request DAG Orchestrator Preview
                </WaitlistActionButton>

                <Button
                  href="/solutions/developers"
                  variant="secondary"
                  arrow
                >
                  Explore Developer Solutions
                </Button>

                <Button
                  href="/tools/inspector"
                  variant="ghost"
                  arrow
                >
                  Inspect ActionProposals
                </Button>
              </div>
            </GenesisHeroIntro>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* INTERACTIVE DAG ORCHESTRATOR COMPONENT */}
        <Section className="py-16 lg:py-24 bg-[#08090a]/60">
          <Container>
            <GenesisSectionIntro className="max-w-3xl space-y-4">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                <CipherText text="01 · Interactive Execution Graph Playground" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="Simulate Asynchronous Multi-Agent Planning" />
              </h2>
              <p className="el-body">
                Inspect how complex software engineering objectives are decomposed into topological dependency graphs. Click any node to view isolated sandbox worktrees, tool arguments, AST safety checks, and Ed25519 diff hashes.
              </p>
            </GenesisSectionIntro>

            <GenesisShowcaseFrame className="mt-10 p-4 sm:p-6">
              <System2DagVisualizer />
            </GenesisShowcaseFrame>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* THE 4 DAG ISOLATION INVARIANTS */}
        <Section className="py-16 lg:py-24">
          <Container>
            <GenesisSectionIntro className="max-w-3xl space-y-4">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                <CipherText text="02 · Confinement Architecture" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="The 4 DAG Isolation Invariants" />
              </h2>
              <p className="el-body">
                Autonomous code agents can introduce regression, syntax damage, or accidental deletions if allowed to mutate your working copy unchecked. ELEVEN enforces 4 non-negotiable architectural invariants across every DAG.
              </p>
            </GenesisSectionIntro>

            <GenesisStaggerGrid
              from="center"
              stagger={0.09}
              className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Invariant 1 */}
              <Tilt3DCard className="relative overflow-hidden p-6 lg:p-8 space-y-4 h-full">
                <div className="pointer-events-none absolute top-4 right-5">
                  <code className="text-[#10bc83]/60 font-mono text-xs">INV-09</code>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#10bc83] font-semibold">
                  <span className="h-2 w-2 rounded-full bg-[#10bc83]" />
                  <span>Worktree isolation invariant</span>
                </div>
                <h3 className="text-xl font-normal heading-gradient">
                  Quarantined Git Worktree Sandboxes
                </h3>
                <DualCopy
                  className="text-xs text-el-fg-muted leading-relaxed"
                  plain="Agents never touch your primary git branch or uncommitted work. Each worker receives an isolated temporary branch in a quarantined folder. Your current code remains completely untouched."
                  technical="The supervisor spawns ephemeral git worktrees using git worktree add --detach in an isolated ramdisk or temporary directory. Subagents perform file edits, compilation, and unit tests inside this sandbox boundary, guaranteeing zero contamination of refs/heads/main."
                />
                <div className="border-t border-white/[0.07] pt-3 text-xs text-el-fg-faint flex justify-between">
                  <span>Enforcement:</span>
                  <code className="text-[#10bc83] text-[11px]">Filesystem Isolation Sandbox</code>
                </div>
              </Tilt3DCard>

              {/* Invariant 2 */}
              <Tilt3DCard className="relative overflow-hidden p-6 lg:p-8 space-y-4 h-full">
                <div className="pointer-events-none absolute top-4 right-5">
                  <code className="text-[#10bc83]/60 font-mono text-xs">INV-10</code>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#10bc83] font-semibold">
                  <span className="h-2 w-2 rounded-full bg-[#10bc83]" />
                  <span>AST safety gate invariant</span>
                </div>
                <h3 className="text-xl font-normal heading-gradient">
                  Static AST Pre-Verification
                </h3>
                <DualCopy
                  className="text-xs text-el-fg-muted leading-relaxed"
                  plain="Before any generated code is compiled, an automated inspector analyzes the code structure to ensure no destructive shell commands, hidden network calls, or dangerous scripts were inserted."
                  technical="Abstract Syntax Tree (AST) analyzers scan all mutated files against formal security policies. Code containing arbitrary dynamic code evaluation (eval, Function), unverified child process spawns, or hardcoded API keys is rejected immediately before reaching the build stage."
                />
                <div className="border-t border-white/[0.07] pt-3 text-xs text-el-fg-faint flex justify-between">
                  <span>Enforcement:</span>
                  <code className="text-[#10bc83] text-[11px]">Tree-sitter / Babel AST Gate</code>
                </div>
              </Tilt3DCard>

              {/* Invariant 3 */}
              <Tilt3DCard className="relative overflow-hidden p-6 lg:p-8 space-y-4 h-full">
                <div className="pointer-events-none absolute top-4 right-5">
                  <code className="text-[#10bc83]/60 font-mono text-xs">INV-02</code>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#10bc83] font-semibold">
                  <span className="h-2 w-2 rounded-full bg-[#10bc83]" />
                  <span>Human sovereign veto invariant</span>
                </div>
                <h3 className="text-xl font-normal heading-gradient">
                  Deterministic Human Approval Gate
                </h3>
                <DualCopy
                  className="text-xs text-el-fg-muted leading-relaxed"
                  plain="When an agent finishes working on a solution, it stops and presents a clear summary of all proposed changes. You review the diff and sign off before any commit is merged."
                  technical="The DAG traversal halts deterministically at Rank 3. The supervisor compiles an ActionProposal containing a unified diff and SHA-256 tree hash. Execution cannot proceed to Rank 4 without an Ed25519 signature from the authorized user or physical FIDO2 biometric assertion."
                />
                <div className="border-t border-white/[0.07] pt-3 text-xs text-el-fg-faint flex justify-between">
                  <span>Enforcement:</span>
                  <code className="text-[#10bc83] text-[11px]">Cryptographic Non-Repudiation</code>
                </div>
              </Tilt3DCard>

              {/* Invariant 4 */}
              <Tilt3DCard className="relative overflow-hidden p-6 lg:p-8 space-y-4 h-full">
                <div className="pointer-events-none absolute top-4 right-5">
                  <code className="text-[#10bc83]/60 font-mono text-xs">INV-05</code>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#10bc83] font-semibold">
                  <span className="h-2 w-2 rounded-full bg-[#10bc83]" />
                  <span>Merkle rollback invariant</span>
                </div>
                <h3 className="text-xl font-normal heading-gradient">
                  Atomic Commit &amp; Instant Rollback
                </h3>
                <DualCopy
                  className="text-xs text-el-fg-muted leading-relaxed"
                  plain="If any test fails or you decline a proposed change, the entire execution tree is wiped clean in milliseconds, leaving your code exactly as it was."
                  technical="State transitions are recorded into an immutable local Merkle chain. If any node fails AST validation or unit test assertions, the supervisor invokes an atomic git reset and destroys the ephemeral worktree in <50ms, eliminating partial or corrupted states."
                />
                <div className="border-t border-white/[0.07] pt-3 text-xs text-el-fg-faint flex justify-between">
                  <span>Enforcement:</span>
                  <code className="text-[#10bc83] text-[11px]">Atomic Transaction Ledger</code>
                </div>
              </Tilt3DCard>
            </GenesisStaggerGrid>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* DUAL-MIND SYMBIOSIS */}
        <Section className="py-16 lg:py-24 bg-[#08090a]/60">
          <Container>
            <GenesisSectionIntro className="max-w-3xl space-y-4">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                <CipherText text="03 · Dual-Mind Symbiosis" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="System 1 Voice + System 2 DAG: Working in Parallel" />
              </h2>
              <DualCopy
                className="el-body"
                plain="Traditional AI chatbots force you to wait in silence while they generate code. ELEVEN's dual-mind system lets you continue talking naturally via voice while complex coding jobs run smoothly in the background."
                technical="ELEVEN decouples conversational interaction from computational reasoning. System 1 executes on dedicated audio threads (Whisper Large v3 Turbo + Kokoro TTS), maintaining continuous sub-50ms conversational barge-in responsiveness while System 2 worker agents process asynchronous DAG pipelines across quarantined worktrees."
              />
            </GenesisSectionIntro>

            <GenesisStaggerGrid
              from="center"
              stagger={0.1}
              className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs"
            >
              <Tilt3DCard className="p-6 space-y-3 h-full">
                <div className="flex items-center justify-between text-[#10bc83] border-b border-white/[0.07] pb-2">
                  <span className="font-normal text-sm heading-gradient">System 1 (Instant Voice)</span>
                  <span className="text-[10px]">Sub-50ms barge-in</span>
                </div>
                <ul className="text-xs text-el-fg-muted space-y-2 leading-relaxed">
                  <li>• Continuous 16kHz circular PCM audio loop with immediate hardware VAD interruption.</li>
                  <li>• Interprets user intent, issues quick clarifications, and presents approvals.</li>
                  <li>• Never blocked by slow disk I/O, heavy AST parsing, or compiler output.</li>
                </ul>
              </Tilt3DCard>

              <Tilt3DCard className="p-6 space-y-3 h-full">
                <div className="flex items-center justify-between text-[#10bc83] border-b border-white/[0.07] pb-2">
                  <span className="font-normal text-sm heading-gradient">System 2 (Async DAG Planner)</span>
                  <span className="text-[10px]">Parallel execution</span>
                </div>
                <ul className="text-xs text-el-fg-muted space-y-2 leading-relaxed">
                  <li>• Decomposes high-level prompts into topological task nodes with strict dependency trees.</li>
                  <li>• Spawns quarantined git worktrees for isolated parallel code authoring.</li>
                  <li>• Reports live milestone progress back to System 1 for conversational speech updates.</li>
                </ul>
              </Tilt3DCard>
            </GenesisStaggerGrid>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* TECHNICAL FAQ */}
        <Section className="py-16 lg:py-24">
          <Container>
            <GenesisSectionIntro className="max-w-3xl space-y-4">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                <CipherText text="04 · Technical FAQ" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="Frequently Asked Architectural Questions" />
              </h2>
              <p className="el-body">
                Implementation details for software architects and senior engineers evaluating ELEVEN’s execution engine.
              </p>
            </GenesisSectionIntro>

            <GenesisStaggerGrid
              stagger={0.08}
              className="mt-10 max-w-4xl space-y-4"
            >
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
                <Tilt3DCard key={i} className="p-5 space-y-2">
                  <h3 className="text-sm font-normal heading-gradient">
                    {faq.q}
                  </h3>
                  <p className="text-xs text-el-fg-muted leading-relaxed">
                    {faq.a}
                  </p>
                </Tilt3DCard>
              ))}
            </GenesisStaggerGrid>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* BOTTOM CTA ACCESS FUNNEL */}
        <Section className="py-20">
          <Container>
            <GenesisCtaStage
              badge="05 · Asynchronous System 2 Engine"
              title="Ready to build with supervised multi-agent graphs?"
              description="Join the early access program to test ELEVEN's DAG execution engine and worktree sandboxing on your local repositories."
              actions={
                <>
                  <WaitlistActionButton
                    tier="technical"
                    arrow
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    Request DAG Orchestrator Preview
                  </WaitlistActionButton>

                  <Button
                    href="/solutions/developers"
                    variant="secondary"
                    arrow
                    className="w-full sm:w-auto"
                  >
                    Developer Diff Review Console
                  </Button>
                </>
              }
            >
              {/* Cross Links to Other Deep Architecture Pages */}
              <div className="flex flex-wrap items-center gap-6 pt-6 text-xs text-el-fg-faint">
                <Link href="/tools/inspector" className="hover:text-[#38ffbd] transition-colors">
                  ActionProposal Inspector
                </Link>
                <Link href="/hardware" className="hover:text-[#38ffbd] transition-colors">
                  Hardware Compatibility
                </Link>
                <Link href="/security" className="hover:text-[#38ffbd] transition-colors">
                  Security Architecture
                </Link>
                <Link href="/solutions/enterprise" className="hover:text-[#38ffbd] transition-colors">
                  Enterprise Fleet Governance
                </Link>
              </div>
            </GenesisCtaStage>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}