import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { DeveloperDiffReviewConsole } from "@/components/v3/DeveloperDiffReviewConsole";
import { WaitlistActionButton } from "@/components/v3/WaitlistActionButton";
import {
  ClarityTogglePill,
  DualCopy,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";

export const metadata: Metadata = {
  title: "ELEVEN for Software Engineers & AI Developers | Local Control Plane",
  description:
    "Supervise autonomous agents against your codebase with deterministic diff approvals, quarantined git worktrees, static AST security audits, and zero cloud IP exposure.",
  alternates: {
    canonical: "/solutions/developers",
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
      name: "Solutions",
      item: "https://eleven-website-self.vercel.app/#solutions",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "For Developers",
      item: "https://eleven-website-self.vercel.app/solutions/developers",
    },
  ],
};

const techArticleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "ELEVEN for Software Engineers & AI Developers",
  description:
    "Developer reference and runtime specification for the ELEVEN local-first control plane, covering quarantined git worktrees, AST audit gates, and Ed25519 diff signing.",
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
  url: "https://eleven-website-self.vercel.app/solutions/developers",
};

export default function DevelopersSolutionPage() {
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
                  { label: "Solutions", href: "/#solutions" },
                  { label: "For Developers", href: "/solutions/developers" },
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
                <span>ENGINEERING RUNTIME // LOCAL CONTROL PLANE</span>
              </div>

              <h1 className="el-h1">
                <WordReveal text="Your terminal, supervised. Your code, quarantined." />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="Run smart AI coding agents on your machine without worrying about broken repositories, runaway terminal commands, or secret leaks. You inspect and approve every change before it ever touches your real code."
                technical="Run autonomous agents against your codebase with deterministic diff approvals, jailed git worktrees, low-integrity OS tokens, static AST safety audits, and zero cloud IP exposure."
              />

              <div className="flex flex-wrap gap-2 pt-2 font-mono text-[11px]">
                <span className="rounded-xs border border-el-mint/40 bg-el-mint/10 px-2.5 py-1 text-el-mint">
                  ✓ GIT WORKTREE JAILS (INV-09)
                </span>
                <span className="rounded-xs border border-el-cyan/40 bg-el-cyan/10 px-2.5 py-1 text-el-cyan">
                  ✓ DEFAULT-DENY EGRESS (INV-12)
                </span>
                <span className="rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  ✓ ED25519 30S TTL (DEC-008)
                </span>
                <span className="rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  ✓ RING-0 WATCHDOG (&lt;0.05S)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton tier="technical" arrow variant="primary">
                  Request Technical Access
                </WaitlistActionButton>
                <Button variant="secondary" href="/docs">
                  Read Architecture Specs →
                </Button>
                <Button variant="ghost" href="/tools/dag-visualizer">
                  Explore DAG Visualizer
                </Button>
              </div>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── THREE DEVELOPER SUPERPOWERS ── */}
        <Section className="py-16 lg:py-24">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="el-eyebrow">
              <span>{"// 01 DEVELOPER SUPERPOWERS"}</span>
            </div>
            <h2 className="el-h2">
              Full agent autonomy, zero host risk.
            </h2>
            <DualCopy
              className="el-body"
              plain="Here is how ELEVEN gives software engineers superpowers while ensuring your files and git branches are never modified without your direct consent."
              technical="Engineered with three uncompromising runtime guarantees separating model reasoning from operating system mutation."
            />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Superpower 1 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-all hover:border-el-accent/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-accent font-semibold tracking-wider">
                    01 // DAG COMPILER
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-el-fg-faint">
                    TOPOLOGY
                  </span>
                </div>
                <h3 className="text-el-lg font-medium tracking-tight text-el-fg">
                  Governed TaskCompiler DAG
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="Multi-step coding jobs are automatically split into clear, ordered steps. ELEVEN checks dependencies first so changes never overwrite each other or get stuck in infinite loops."
                  technical="Complex refactor requests decompose into a directed acyclic graph (DAG) with static dependency ordering. Tasks serialize safely with deadlock detection and cycle elimination before invocation."
                />
              </div>

              <div className="mt-6 border-t border-el-border/60 pt-4 font-mono text-[10.5px] text-el-fg-faint">
                <span className="text-el-accent">Engine:</span> petgraph / async-task-scheduler
              </div>
            </Tilt3DCard>

            {/* Superpower 2 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-all hover:border-el-accent/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-accent font-semibold tracking-wider">
                    02 // QUARANTINE
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-el-signal-lime">
                    ISOLATED
                  </span>
                </div>
                <h3 className="text-el-lg font-medium tracking-tight text-el-fg">
                  Quarantined Test Runner
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="When the AI writes or runs tests, it executes them inside a temporary sandbox. It cannot touch your real SSH keys, .env secrets, or network connections."
                  technical="Executes test suites and AST linters inside isolated OS namespaces with read-only root mounts. Low-integrity tokens block outbound socket binding and privilege escalation."
                />
              </div>

              <div className="mt-6 border-t border-el-border/60 pt-4 font-mono text-[10.5px] text-el-fg-faint">
                <span className="text-el-signal-lime">Boundary:</span> Linux cgroup v2 / Windows AppContainer
              </div>
            </Tilt3DCard>

            {/* Superpower 3 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-all hover:border-el-accent/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-accent font-semibold tracking-wider">
                    03 // CRYPTO AUDIT
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-purple-400">
                    ED25519
                  </span>
                </div>
                <h3 className="text-el-lg font-medium tracking-tight text-el-fg">
                  Ed25519 ActionProposal Diff Review
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="No surprise commits or unauthorized pushes. Every file change is presented as a clean diff that you verify with a single keystroke before anything touches git."
                  technical="ActionProposals package unified diffs with immutable SHA-256 hashes. Applying changes to the host working tree requires an operator Ed25519 signature within a 30s TTL window."
                />
              </div>

              <div className="mt-6 border-t border-el-border/60 pt-4 font-mono text-[10.5px] text-el-fg-faint">
                <span className="text-purple-400">Receipt:</span> Ed25519 / Nonce SHA-256
              </div>
            </Tilt3DCard>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── INTERACTIVE DIFF REVIEW CONSOLE ── */}
        <Section className="py-16 lg:py-24 bg-[#030508]">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="el-eyebrow">
                <span>{"// 02 LIVE TERMINAL SIMULATOR"}</span>
              </div>
              <div className="rounded-xs border border-el-border bg-[#020408] px-2.5 py-1 font-mono text-[11px] text-el-fg-faint">
                STATUS: <span className="text-el-mint font-semibold">ONLINE (INTERACTIVE)</span>
              </div>
            </div>
            <h2 className="el-h2">
              Zero surprise commits. Cryptographic sign-off on every diff.
            </h2>
            <DualCopy
              className="el-body"
              plain="Try the live simulation below. Inspect the code change proposed by the AI agent, view the automated 5-point policy check, and sign the change into the real repository."
              technical="Interactive simulation of the Quarantine Sanctum ActionProposal pipeline. Toggle between the unified git diff, the 5-layer policy audit gate, and the Ed25519 cryptographic receipt."
            />
          </div>

          <div className="mt-10">
            <DeveloperDiffReviewConsole />
          </div>

          {/* Under-Console Architecture Details */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 font-mono text-xs">
            <div className="rounded-sm border border-el-border/60 bg-el-bg-raised/40 p-4">
              <span className="text-el-cyan font-semibold">AST Confinement:</span>
              <p className="mt-1 text-el-fg-muted text-[11px] leading-relaxed">
                Static syntax analysis blocks arbitrary execution, eval calls, and directory traversal beyond targeted workspace boundaries.
              </p>
            </div>
            <div className="rounded-sm border border-el-border/60 bg-el-bg-raised/40 p-4">
              <span className="text-el-mint font-semibold">Isolated Git Trees:</span>
              <p className="mt-1 text-el-fg-muted text-[11px] leading-relaxed">
                Agents operate in transient memory-backed worktrees (`git worktree add`). Untrusted code is never checkout-linked to your main working tree.
              </p>
            </div>
            <div className="rounded-sm border border-el-border/60 bg-el-bg-raised/40 p-4">
              <span className="text-purple-400 font-semibold">Ring-0 E-Stop:</span>
              <p className="mt-1 text-el-fg-muted text-[11px] leading-relaxed">
                If an agent triggers unexpected CPU spikes or network egress attempts, the hardware supervisor terminates the process in under 50ms.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="ghost" href="/tools/inspector">
              Open Full JSON-RPC ActionProposal Inspector &amp; Policy Playground →
            </Button>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── DEVELOPER CLI WORKFLOW & ERGONOMICS ── */}
        <Section className="py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="el-eyebrow">
                <span>{"// 03 ERGONOMICS &amp; WORKFLOW"}</span>
              </div>
              <h2 className="el-h2">
                Fits inside your terminal. Never alters your muscle memory.
              </h2>
              <DualCopy
                className="el-body"
                plain="You do not need to learn an entirely new editor. ELEVEN integrates directly with your existing terminal, favorite shell, and IDE via standard protocols like LSP and MCP."
                technical="ELEVEN interfaces seamlessly via the `eleven-cli` binary and standard Model Context Protocol (MCP) server sockets. Works out-of-the-box with Neovim, VS Code, tmux, and custom CI pipelines."
              />

              <ul className="space-y-3 font-mono text-el-xs text-el-fg-muted">
                <li className="flex items-start gap-2.5">
                  <span className="text-el-accent">▸</span>
                  <span><strong className="text-el-fg">Local AST Semantic Search:</strong> Vector embeddings are indexed locally with SQLite &amp; fast HNSW without sending code to third-party endpoints.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-el-accent">▸</span>
                  <span><strong className="text-el-fg">Custom Policy Whitelists:</strong> Define allowed write paths, prohibited packages, and required linting rules in `.eleven/policy.yaml`.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-el-accent">▸</span>
                  <span><strong className="text-el-fg">Multi-Branch Parallelism:</strong> Spawn up to 8 isolated worktrees simultaneously to explore parallel refactoring strategies.</span>
                </li>
              </ul>
            </div>

            {/* CLI Code Snippet Box */}
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-sm border border-el-border bg-[#05080E] font-mono text-[11.5px] shadow-el-md">
                <div className="flex items-center justify-between border-b border-el-border/80 bg-el-bg-raised/70 px-4 py-2.5 text-el-xs">
                  <span className="text-el-fg-faint">terminal // zsh</span>
                  <span className="text-el-accent text-[10px]">eleven-cli v3.1</span>
                </div>
                <div className="p-5 space-y-3 leading-relaxed">
                  <p className="text-el-fg-faint">
                    <span className="text-el-accent">$</span> eleven run \
                  </p>
                  <p className="pl-4 text-el-fg">
                    --task &quot;Migrate auth handlers to async WebCrypto&quot; \
                  </p>
                  <p className="pl-4 text-el-fg">
                    --sandbox git:branch-quarantine-auth \
                  </p>
                  <p className="pl-4 text-el-fg">
                    --gates path-confinement,ast-audit,unit-tests \
                  </p>
                  <p className="pl-4 text-el-signal-lime">
                    --egress deny-all
                  </p>
                  <div className="border-t border-el-border/60 pt-3 text-[11px] text-el-fg-faint">
                    <p className="text-el-accent">✔ Created ephemeral worktree: /tmp/eleven_tree_0492</p>
                    <p className="text-el-fg-muted">✔ Dispatched 3 DAG sub-tasks across 2 local worker threads</p>
                    <p className="text-el-signal-lime">✔ 38 unit tests passed in quarantine sandbox (0 regressions)</p>
                    <p className="text-purple-400 font-semibold">➜ ActionProposal #0492 staged. Awaiting operator signature.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── LOCAL SANCTUM VS CLOUD AGENTS COMPARISON ── */}
        <Section className="py-16">
          <div className="max-w-[700px]">
            <p className="el-eyebrow">
              04 · ARCHITECTURAL COMPARISON
            </p>
            <h2 className="mt-2 el-h2">
              Why engineers choose local sovereign control.
            </h2>
            <DualCopy
              className="mt-3 el-body"
              plain="Compare running agents inside a secure local sandbox against uploading your entire repository to cloud-hosted agent services."
              technical="Direct comparison between ELEVEN's local-first supervisor runtime and conventional cloud-hosted agent architectures."
            />
          </div>

          <div className="mt-10 overflow-x-auto rounded-sm border border-el-border bg-el-bg-raised/40">
            <table className="w-full text-left font-mono text-el-xs">
              <thead>
                <tr className="border-b border-el-border bg-el-bg-raised/80 text-el-fg-faint">
                  <th className="py-3.5 px-4 font-medium uppercase tracking-wider">Engineering Dimension</th>
                  <th className="py-3.5 px-4 font-medium uppercase tracking-wider text-el-accent">ELEVEN Local Control Plane</th>
                  <th className="py-3.5 px-4 font-medium uppercase tracking-wider text-el-fg-faint">Cloud Agent Platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-el-border/60 text-el-fg-muted">
                <tr>
                  <td className="py-3 px-4 font-semibold text-el-fg">Source Code Privacy</td>
                  <td className="py-3 px-4 text-el-signal-lime font-medium">100% Local (Never leaves PC disk)</td>
                  <td className="py-3 px-4 text-red-400/90">Uploaded to third-party cloud servers</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-el-fg">Git Write Safety</td>
                  <td className="py-3 px-4 text-el-signal-lime font-medium">Isolated worktree + Ed25519 approval</td>
                  <td className="py-3 px-4 text-yellow-400/90">Direct unstaged writes to repo</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-el-fg">Process Sandboxing</td>
                  <td className="py-3 px-4 text-el-signal-lime font-medium">cgroups v2 / AppContainer low-integrity</td>
                  <td className="py-3 px-4 text-yellow-400/90">Remote Docker VM or un-jailed terminal</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-el-fg">Emergency Intervention</td>
                  <td className="py-3 px-4 text-el-signal-lime font-medium">Ring-0 Hardware Watchdog (&lt;0.05s)</td>
                  <td className="py-3 px-4 text-red-400/90">HTTP cancel request (seconds of latency)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-el-fg">Audit Trail</td>
                  <td className="py-3 px-4 text-el-signal-lime font-medium">Cryptographic Ed25519 Nonce receipts</td>
                  <td className="py-3 px-4 text-el-fg-faint">Ephemeral cloud log files</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="ghost" href="/compare/cloud-vs-local">
              View Full 6-Dimensional Local vs Cloud Matrix &amp; TCO Calculator →
            </Button>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── PRE-QUALIFIED TECHNICAL WAITLIST CTA ── */}
        <Section className="py-20">
          <div className="relative overflow-hidden rounded-sm border border-el-border bg-gradient-to-b from-el-bg-raised/90 to-el-bg p-8 sm:p-12 text-center shadow-el-lg">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-30"
            />
            <div className="relative mx-auto max-w-[640px] space-y-4">
              <span className="el-eyebrow">
                TECHNICAL ALPHA PROGRAM // RING 1 ACCESS
              </span>
              <h2 className="el-h2">
                Ready to build with supervised autonomy?
              </h2>
              <DualCopy
                className="el-body"
                plain="Join the early access program for developers. Get direct access to the CLI binaries, sandbox runtimes, and local model bindings."
                technical="Request access to the ELEVEN Developer Preview. Includes `eleven-cli`, Quarantine Sanctum container runtimes, and native MCP protocol bridges."
              />

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <WaitlistActionButton tier="technical" arrow>
                  Request Technical Access (Developer Ring)
                </WaitlistActionButton>
                <Button variant="secondary" href="/architecture">
                  Explore Execution Rooms →
                </Button>
                <Button variant="ghost" href="/solutions/enterprise">
                  Enterprise Fleet Governance →
                </Button>
              </div>

              <p className="pt-2 font-mono text-[10.5px] text-el-fg-faint">
                Supports macOS (Apple Silicon), Windows 11 (WSL2/Hyper-V), and Ubuntu 22.04+ LTS.
              </p>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
