import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { DeveloperDiffReviewConsole } from "@/components/v3/DeveloperDiffReviewConsole";
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
  GenesisSplitReveal,
  GenesisStaggerGrid,
  GenesisSubpageHeroBackdrop,
  GenesisTimelineList,
} from "@/components/motion/GenesisMotionEngine";

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
      item: "https://eleven-website-self.vercel.app/solutions",
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
          <GenesisSubpageHeroBackdrop />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-el-border/60">
              <Breadcrumbs
                items={[
                  { label: "Solutions", href: "/solutions" },
                  { label: "For Developers", href: "/solutions/developers" },
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
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83] shadow-[0_0_8px_#10bc83] animate-pulse motion-reduce:animate-none" />
                <CipherText text="Engineering Runtime · Local Control Plane" />
              </div>

              <h1 className="el-h1">
                <WordReveal text="Your terminal, supervised. Your code, quarantined." />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="Run smart AI coding agents on your machine without worrying about broken repositories, runaway terminal commands, or secret leaks. You inspect and approve every change before it ever touches your real code."
                technical="Run autonomous agents against your codebase with deterministic diff approvals, jailed git worktrees, low-integrity OS tokens, static AST safety audits, and zero cloud IP exposure."
              />

              <GenesisBubbleRow className="flex flex-wrap gap-2.5 pt-2 text-el-xs">
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  Git worktree isolation (INV-09)
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  Default-deny egress (INV-12)
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  Ed25519 30s TTL (DEC-008)
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  Ring-0 watchdog (&lt;0.05s)
                </li>
              </GenesisBubbleRow>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton
                  tier="technical"
                  arrow
                  variant="primary"
                >
                  Request Technical Access
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/docs"
                  arrow
                >
                  Read Architecture Specs
                </Button>
                <Button
                  variant="ghost"
                  href="/tools/dag-visualizer"
                >
                  Explore DAG Visualizer
                </Button>
              </div>
            </GenesisHeroIntro>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── THREE DEVELOPER SUPERPOWERS ── */}
        <Section className="py-16 lg:py-24">
          <GenesisSectionIntro className="max-w-3xl space-y-4 mb-10">
            <div className="gfx-badge">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              <CipherText text="01 · Developer Superpowers" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Full agent autonomy, zero host risk." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Here is how ELEVEN gives software engineers superpowers while ensuring your files and git branches are never modified without your direct consent."
              technical="Engineered with three uncompromising runtime guarantees separating model reasoning from operating system mutation."
            />
          </GenesisSectionIntro>

          <GenesisStaggerGrid
            from="center"
            stagger={0.1}
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {/* Superpower 1 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6 h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-el-accent font-medium">
                    01 · DAG Compiler
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-el-fg-faint">
                    Topology
                  </span>
                </div>
                <h3 className="text-el-lg font-normal tracking-tight heading-gradient">
                  Governed TaskCompiler DAG
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="Multi-step coding jobs are automatically split into clear, ordered steps. ELEVEN checks dependencies first so changes never overwrite each other or get stuck in infinite loops."
                  technical="Complex refactor requests decompose into a directed acyclic graph (DAG) with static dependency ordering. Tasks serialize safely with deadlock detection and cycle elimination before invocation."
                />
              </div>

              <div className="mt-6 border-t border-white/[0.07] pt-4 text-xs text-el-fg-faint">
                <span className="text-el-accent">Engine:</span> <code>petgraph / async-task-scheduler</code>
              </div>
            </Tilt3DCard>

            {/* Superpower 2 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6 h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-el-accent font-medium">
                    02 · Quarantine
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-el-signal-lime">
                    Isolated
                  </span>
                </div>
                <h3 className="text-el-lg font-normal tracking-tight heading-gradient">
                  Quarantined Test Runner
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="When the AI writes or runs tests, it executes them inside a temporary sandbox. It cannot touch your real SSH keys, .env secrets, or network connections."
                  technical="Executes test suites and AST linters inside isolated OS namespaces with read-only root mounts. Low-integrity tokens block outbound socket binding and privilege escalation."
                />
              </div>

              <div className="mt-6 border-t border-white/[0.07] pt-4 text-xs text-el-fg-faint">
                <span className="text-el-signal-lime">Boundary:</span> <code>Linux cgroup v2 / Windows AppContainer</code>
              </div>
            </Tilt3DCard>

            {/* Superpower 3 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6 h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-el-accent font-medium">
                    03 · Cryptographic Audit
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-el-fg-muted">
                    Ed25519
                  </span>
                </div>
                <h3 className="text-el-lg font-normal tracking-tight heading-gradient">
                  Ed25519 ActionProposal Diff Review
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="No surprise commits or unauthorized pushes. Every file change is presented as a clean diff that you verify with a single keystroke before anything touches git."
                  technical="ActionProposals package unified diffs with immutable SHA-256 hashes. Applying changes to the host working tree requires an operator Ed25519 signature within a 30s TTL window."
                />
              </div>

              <div className="mt-6 border-t border-white/[0.07] pt-4 text-xs text-el-fg-faint">
                <span className="text-el-accent">Receipt:</span> <code>Ed25519 / Nonce SHA-256</code>
              </div>
            </Tilt3DCard>
          </GenesisStaggerGrid>
        </Section>

        <SignalBeamDivider />

        {/* ── INTERACTIVE DIFF REVIEW CONSOLE ── */}
        <Section className="py-16 lg:py-24 bg-[#08090a]/60">
          <GenesisSectionIntro className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                <CipherText text="02 · Live Terminal Simulator" />
              </div>
              <div className="gfx-bubble !h-8 !px-3 !text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                Status: <span className="text-[#10bc83] font-medium">Online (Interactive)</span>
              </div>
            </div>
            <h2 className="el-h2">
              <WordReveal text="Zero surprise commits. Cryptographic sign-off on every diff." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Try the live simulation below. Inspect the code change proposed by the AI agent, view the automated 5-point policy check, and sign the change into the real repository."
              technical="Interactive simulation of the Quarantine Sanctum ActionProposal pipeline. Toggle between the unified git diff, the 5-layer policy audit gate, and the Ed25519 cryptographic receipt."
            />
          </GenesisSectionIntro>

          <GenesisShowcaseFrame className="mt-10 p-4 sm:p-6">
            <DeveloperDiffReviewConsole />
          </GenesisShowcaseFrame>

          {/* Under-Console Architecture Details */}
          <GenesisStaggerGrid
            from="center"
            stagger={0.09}
            className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 text-xs"
          >
            <Tilt3DCard className="p-5 h-full">
              <span className="text-el-accent font-medium">AST Confinement:</span>
              <p className="mt-1.5 text-el-fg-muted text-[11px] leading-relaxed">
                Static syntax analysis blocks arbitrary execution, eval calls, and directory traversal beyond targeted workspace boundaries.
              </p>
            </Tilt3DCard>
            <Tilt3DCard className="p-5 h-full">
              <span className="text-[#10bc83] font-medium">Isolated Git Trees:</span>
              <p className="mt-1.5 text-el-fg-muted text-[11px] leading-relaxed">
                Agents operate in transient memory-backed worktrees (<code>git worktree add</code>). Untrusted code is never checkout-linked to your main working tree.
              </p>
            </Tilt3DCard>
            <Tilt3DCard className="p-5 h-full">
              <span className="text-el-fg font-medium">Ring-0 E-Stop:</span>
              <p className="mt-1.5 text-el-fg-muted text-[11px] leading-relaxed">
                If an agent triggers unexpected CPU spikes or network egress attempts, the hardware supervisor terminates the process in under 50ms.
              </p>
            </Tilt3DCard>
          </GenesisStaggerGrid>

          <div className="mt-6 flex justify-end">
            <Button
              variant="ghost"
              href="/tools/inspector"
              arrow
            >
              Open Full JSON-RPC ActionProposal Inspector &amp; Policy Playground
            </Button>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── DEVELOPER CLI WORKFLOW & ERGONOMICS ── */}
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
                    <CipherText text="03 · Ergonomics & Workflow" />
                  </div>
                  <h2 className="el-h2">
                    <WordReveal text="Fits inside your terminal. Never alters your muscle memory." />
                  </h2>
                  <DualCopy
                    className="el-body"
                    plain="You do not need to learn an entirely new editor. ELEVEN integrates directly with your existing terminal, favorite shell, and IDE via standard protocols like LSP and MCP."
                    technical="ELEVEN interfaces seamlessly via the eleven-cli binary and standard Model Context Protocol (MCP) server sockets. Works out-of-the-box with Neovim, VS Code, tmux, and custom CI pipelines."
                  />
                </GenesisSectionIntro>

                <GenesisTimelineList mode="feature-bars" className="mt-6 space-y-4 text-xs text-el-fg-muted">
                  <li className="gfx-feature-item flex items-start gap-3">
                    <span className="gfx-feature-bar" aria-hidden="true" />
                    <span><strong className="text-el-fg">Local AST Semantic Search:</strong> Vector embeddings are indexed locally with SQLite &amp; fast HNSW without sending code to third-party endpoints.</span>
                  </li>
                  <li className="gfx-feature-item flex items-start gap-3">
                    <span className="gfx-feature-bar" aria-hidden="true" />
                    <span><strong className="text-el-fg">Custom Policy Whitelists:</strong> Define allowed write paths, prohibited packages, and required linting rules in <code>.eleven/policy.yaml</code>.</span>
                  </li>
                  <li className="gfx-feature-item flex items-start gap-3">
                    <span className="gfx-feature-bar" aria-hidden="true" />
                    <span><strong className="text-el-fg">Multi-Branch Parallelism:</strong> Spawn up to 8 isolated worktrees simultaneously to explore parallel refactoring strategies.</span>
                  </li>
                </GenesisTimelineList>
              </div>
            }
            right={
              <GenesisShowcaseFrame className="overflow-hidden font-mono text-[11.5px]">
                <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#08090a] px-4 py-2.5 text-el-xs">
                  <span className="text-el-fg-faint">terminal // zsh</span>
                  <span className="text-[#10bc83] text-[10px]">eleven-cli v3.1</span>
                </div>
                <div className="p-5 space-y-3 leading-relaxed">
                  <p className="text-el-fg-faint">
                    <span className="text-[#10bc83]">$</span> eleven run \
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
                  <p className="pl-4 text-[#10bc83]">
                    --egress deny-all
                  </p>
                  <div className="border-t border-white/[0.07] pt-3 text-[11px] text-el-fg-faint">
                    <p className="text-[#38ffbd]">✔ Created ephemeral worktree: /tmp/eleven_tree_0492</p>
                    <p className="text-el-fg-muted">✔ Dispatched 3 DAG sub-tasks across 2 local worker threads</p>
                    <p className="text-[#10bc83]">✔ 38 unit tests passed in quarantine sandbox (0 regressions)</p>
                    <p className="text-el-fg font-semibold">➜ ActionProposal #0492 staged. Awaiting operator signature.</p>
                  </div>
                </div>
              </GenesisShowcaseFrame>
            }
          />
        </Section>

        <SignalBeamDivider />

        {/* ── LOCAL SANCTUM VS CLOUD AGENTS COMPARISON ── */}
        <Section className="py-16">
          <GenesisSectionIntro className="max-w-3xl space-y-4 mb-10">
            <div className="gfx-badge">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              <CipherText text="04 · Architectural Comparison" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Why engineers choose local sovereign control." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Compare running agents inside a secure local sandbox against uploading your entire repository to cloud-hosted agent services."
              technical="Direct comparison between ELEVEN's local-first supervisor runtime and conventional cloud-hosted agent architectures."
            />
          </GenesisSectionIntro>

          <GenesisShowcaseFrame className="mt-10 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#08090a] text-el-fg-muted">
                  <th className="py-3.5 px-4 font-medium text-el-fg">Engineering dimension</th>
                  <th className="py-3.5 px-4 font-medium text-[#10bc83]">ELEVEN local control plane</th>
                  <th className="py-3.5 px-4 font-medium text-el-fg-faint">Cloud agent platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.07] text-el-fg-muted">
                <tr>
                  <td className="py-3 px-4 font-semibold text-el-fg">Source code privacy</td>
                  <td className="py-3 px-4 text-[#10bc83] font-medium">100% local (Never leaves PC disk)</td>
                  <td className="py-3 px-4 text-red-400/90">Uploaded to third-party cloud servers</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-el-fg">Git write safety</td>
                  <td className="py-3 px-4 text-[#10bc83] font-medium">Isolated worktree + Ed25519 approval</td>
                  <td className="py-3 px-4 text-yellow-400/90">Direct unstaged writes to repo</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-el-fg">Process sandboxing</td>
                  <td className="py-3 px-4 text-[#10bc83] font-medium">cgroups v2 / AppContainer low-integrity</td>
                  <td className="py-3 px-4 text-yellow-400/90">Remote Docker VM or un-jailed terminal</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-el-fg">Emergency intervention</td>
                  <td className="py-3 px-4 text-[#10bc83] font-medium">Ring-0 hardware watchdog (&lt;0.05s)</td>
                  <td className="py-3 px-4 text-red-400/90">HTTP cancel request (seconds of latency)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-el-fg">Audit trail</td>
                  <td className="py-3 px-4 text-[#10bc83] font-medium">Cryptographic Ed25519 nonce receipts</td>
                  <td className="py-3 px-4 text-el-fg-faint">Ephemeral cloud log files</td>
                </tr>
              </tbody>
            </table>
          </GenesisShowcaseFrame>

          <div className="mt-6 flex justify-end">
            <Button
              variant="ghost"
              href="/compare/cloud-vs-local"
              arrow
            >
              View Full 6-Dimensional Local vs Cloud Matrix &amp; TCO Calculator
            </Button>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── PRE-QUALIFIED TECHNICAL WAITLIST CTA ── */}
        <Section className="py-20">
          <GenesisCtaStage
            badge="Technical Alpha Program · Ring 1 Access"
            title="Ready to build with supervised autonomy?"
            description="Join the early access program for developers. Get direct access to the CLI binaries, sandbox runtimes, and local model bindings."
            actions={
              <>
                <WaitlistActionButton
                  tier="technical"
                  arrow
                  className="w-full sm:w-auto"
                >
                  Request Technical Access (Developer Ring)
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/architecture"
                  arrow
                  className="w-full sm:w-auto"
                >
                  Explore Execution Rooms
                </Button>
                <Button
                  variant="ghost"
                  href="/solutions/enterprise"
                  arrow
                  className="w-full sm:w-auto"
                >
                  Enterprise Fleet Governance
                </Button>
              </>
            }
          >
            <p className="pt-4 text-xs text-el-fg-faint">
              Supports macOS (Apple Silicon), Windows 11 (WSL2/Hyper-V), and Ubuntu 22.04+ LTS.
            </p>
          </GenesisCtaStage>
        </Section>
      </main>

      <Footer />
    </>
  );
}
