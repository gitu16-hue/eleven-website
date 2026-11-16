import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import dynamic from "next/dynamic";
import { WaitlistActionButton } from "@/components/v3/WaitlistActionButton";

const ActionProposalPlayground = dynamic(
  () =>
    import("@/components/v3/ActionProposalPlayground").then(
      (mod) => mod.ActionProposalPlayground
    ),
  {
    loading: () => (
      <div className="h-[580px] w-full animate-pulse motion-reduce:animate-none rounded-sm border border-el-border bg-el-bg-raised/40" />
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
  GenesisHeroIntro,
  GenesisSectionIntro,
  GenesisShowcaseFrame,
} from "@/components/motion/GenesisMotionEngine";

export const metadata: Metadata = {
  title: "Interactive ActionProposal & Policy Inspector | ELEVEN Tools",
  description:
    "Developer playground to simulate and test raw JSON-RPC ActionProposals against ELEVEN's 5 fail-closed policy gates, sandbox worktrees, and Ed25519 signing.",
  alternates: {
    canonical: "/tools/inspector",
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
      item: "https://eleven-website-self.vercel.app/tools/inspector",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "ActionProposal Inspector",
      item: "https://eleven-website-self.vercel.app/tools/inspector",
    },
  ],
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ELEVEN ActionProposal Protocol Inspector",
  operatingSystem: "macOS, Windows 11, Linux",
  applicationCategory: "DeveloperApplication",
  description:
    "Interactive development console for simulating agent tool calls, static AST boundary auditing, and Ed25519 cryptographic receipt signing.",
  author: {
    "@type": "Organization",
    name: "GISHH Labs",
    url: "https://eleven-website-self.vercel.app",
  },
  url: "https://eleven-website-self.vercel.app/tools/inspector",
};

export default function ActionProposalInspectorPage() {
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
            className="el-aurora pointer-events-none absolute inset-0 opacity-85"
          />
          <div
            aria-hidden="true"
            className="bg-grid-scifi pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(60%_50%_at_50%_0%,#000_75%,transparent_100%)]"
          />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-el-border/60">
              <Breadcrumbs
                items={[
                  { label: "Tools", href: "/tools/inspector" },
                  { label: "ActionProposal Inspector", href: "/tools/inspector" },
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
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83] shadow-[0_0_8px_#10bc83] animate-pulse motion-reduce:animate-none" />
                <CipherText text="Developer Tooling · Protocol Playground" />
              </div>

              <h1 className="el-h1">
                <WordReveal text="Inspect the protocol. Verify the sandbox." />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="Test how ELEVEN handles safe and dangerous AI actions. Pick a scenario below—like a safe refactor or a malicious hacking attempt—and watch the five security checkpoints catch and stop rogue behavior in real time."
                technical="Interactive simulator for the ELEVEN ActionProposal JSON-RPC protocol. Compose, inspect, and evaluate agent tool calls against static AST bounds, path containment, monotonic privilege barriers, and Ed25519 cryptographic receipts."
              />

              <div className="flex flex-wrap gap-2.5 pt-2 text-xs text-el-fg-muted">
                <span className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  JSON-RPC 2.0 Loopback
                </span>
                <span className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  5 Fail-Closed Gates
                </span>
                <span className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  <code>Ed25519</code> 30s TTL
                </span>
                <span className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  Ring-0 Preemption
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton
                  tier="technical"
                  arrow
                  variant="primary"
                >
                  Request CLI &amp; SDK Access
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/docs"
                  arrow
                >
                  Read JSON-RPC Specs
                </Button>
                <Button
                  variant="ghost"
                  href="/tools/dag-visualizer"
                >
                  Open DAG Visualizer
                </Button>
              </div>
            </GenesisHeroIntro>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── INTERACTIVE ACTION PROPOSAL PLAYGROUND ── */}
        <Section className="py-16 lg:py-24 bg-[#08090a]/60">
          <GenesisSectionIntro className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                <CipherText text="01 · Live Protocol Simulator" />
              </div>
              <div className="gfx-bubble !h-8 !px-3 !text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                Simulator engine: <code className="text-[#10bc83] font-semibold">HOST_SUPERVISOR_V3</code>
              </div>
            </div>
            <h2 className="el-h2">
              <WordReveal text="Adversarial and benign scenario simulator" />
            </h2>
            <DualCopy
              className="el-body"
              plain="Select a scenario to stage a live ActionProposal. The simulator sends the raw request into the 5-point verification pipeline, showing which gates pass and how security violations are halted."
              technical="Live JSON-RPC dispatch harness. Demonstrates deterministic policy evaluation across Gate 1 (Path Confinement), Gate 2 (AST Analysis), Gate 3 (Monotonic Autonomy Bound), Gate 4 (Egress Firewall), and Gate 5 (Ed25519 Operator Escrow)."
            />
          </GenesisSectionIntro>

          <GenesisShowcaseFrame className="mt-10 p-4 sm:p-6">
            <ActionProposalPlayground />
          </GenesisShowcaseFrame>
        </Section>

        <SignalBeamDivider />

        {/* ── THE 5 POLICY GATES SPECIFICATION ── */}
        <Section className="py-16 lg:py-24">
          <GenesisSectionIntro className="max-w-3xl space-y-4 mb-10">
            <div className="gfx-badge">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              <CipherText text="02 · Gate Architecture and Timing" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Zero-Trust pipeline at 12ms average latency." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Every single tool call from the AI executes in an isolated sandbox and must clear all five gates before changes reach your machine."
              technical="The five policy checkpoints execute sequentially with short-circuit preemption. If any gate fails, the pipeline terminates immediately with fail-closed semantics."
            />
          </GenesisSectionIntro>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Gate 1 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-[#10bc83] font-semibold tracking-wider">
                    GATE 01 // PATH
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-el-fg-faint">
                    &lt;1.2ms
                  </span>
                </div>
                <h3 className="text-el-lg font-normal tracking-tight heading-gradient">
                  Path Confinement
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="Ensures file changes remain strictly inside your project directory. Traversal attempts (../../) to personal documents, SSH keys, or passwords trigger an immediate stop."
                  technical="Canonical root boundary check resolves symlinks and relative path components. Blocks access outside assigned workspace chroot/namespace."
                />
              </div>
              <div className="mt-6 border-t border-white/[0.07] pt-4 text-xs text-el-fg-faint">
                <span className="text-[#10bc83]">Action on breach:</span> <code className="text-[10.5px]">DROP_PACKET + SEGV</code>
              </div>
            </Tilt3DCard>

            {/* Gate 2 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-[#10bc83] font-semibold tracking-wider">
                    GATE 02 // AST
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-el-fg-faint">
                    &lt;4.5ms
                  </span>
                </div>
                <h3 className="text-el-lg font-normal tracking-tight heading-gradient">
                  Static AST Security Audit
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="Analyzes the code structure before running it. Blocks hidden tricks like dynamic code execution, obfuscated binary strings, or unsafe system commands."
                  technical="Abstract Syntax Tree parser scans for blacklisted AST nodes (eval, Function, dynamic child_process, and unsafe crypto primitives)."
                />
              </div>
              <div className="mt-6 border-t border-white/[0.07] pt-4 text-xs text-el-fg-faint">
                <span className="text-[#10bc83]">Action on breach:</span> <code className="text-[10.5px]">QUARANTINE_DIFF</code>
              </div>
            </Tilt3DCard>

            {/* Gate 3 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-[#10bc83] font-semibold tracking-wider">
                    GATE 03 // AUTONOMY
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-el-fg-faint">
                    &lt;0.8ms
                  </span>
                </div>
                <h3 className="text-el-lg font-normal tracking-tight heading-gradient">
                  Monotonic Privilege Bound
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="Agents can never grant themselves extra powers mid-task. If a subagent was launched with read-only access, it cannot suddenly make changes or run root commands."
                  technical="State machine invariant ensures Tier(t_2) <= Tier(t_1). Token downgrade is permitted; privilege elevation causes process termination."
                />
              </div>
              <div className="mt-6 border-t border-white/[0.07] pt-4 text-xs text-el-fg-faint">
                <span className="text-[#10bc83]">Action on breach:</span> <code className="text-[10.5px]">THREAD_KILL + SIGKILL</code>
              </div>
            </Tilt3DCard>

            {/* Gate 4 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-[#10bc83] font-semibold tracking-wider">
                    GATE 04 // FIREWALL
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-el-fg-faint">
                    &lt;1.8ms
                  </span>
                </div>
                <h3 className="text-el-lg font-normal tracking-tight heading-gradient">
                  Egress Socket Firewall
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="All outbound internet connections are blocked by default. Agents can only talk to network services you specifically approved."
                  technical="Default-deny socket packet filter intercepts connect() system calls. Matches destination IP/port against cryptographic policy whitelist."
                />
              </div>
              <div className="mt-6 border-t border-white/[0.07] pt-4 text-xs text-el-fg-faint">
                <span className="text-[#10bc83]">Action on breach:</span> <code className="text-[10.5px]">DROP_SOCKET + ALERT</code>
              </div>
            </Tilt3DCard>

            {/* Gate 5 */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-[#10bc83] font-semibold tracking-wider">
                    GATE 05 // ESCROW
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#08090a] px-2 py-0.5 text-[9.5px] text-el-fg-muted">
                    ED25519
                  </span>
                </div>
                <h3 className="text-el-lg font-normal tracking-tight heading-gradient">
                  Ed25519 Operator Escrow
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="Major actions (like publishing code or sending emails) pause for your explicit confirmation. You get a clear diff and 30 seconds to sign off."
                  technical="ActionProposal hashes bind to an ephemeral 128-bit nonce. Executing mutations on the host requires an operator cryptographic signature."
                />
              </div>
              <div className="mt-6 border-t border-white/[0.07] pt-4 text-xs text-el-fg-faint">
                <span className="text-[#10bc83]">Action on breach:</span> <code className="text-[10.5px]">NONCE_EXPIRE (30s TTL)</code>
              </div>
            </Tilt3DCard>

            {/* Total Pipeline */}
            <Tilt3DCard className="relative flex flex-col justify-between p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-[#10bc83] font-semibold tracking-wider">
                    PIPELINE TOTAL
                  </span>
                  <span className="rounded-full border border-[#10bc83]/40 bg-[#10bc83]/10 px-2 py-0.5 text-[9.5px] text-[#10bc83]">
                    FAIL-CLOSED
                  </span>
                </div>
                <h3 className="text-el-lg font-normal tracking-tight heading-gradient">
                  Hardware Watchdog
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="If anything unexpected happens at any stage, the emergency killswitch can terminate all spawned tasks in under 0.05 seconds."
                  technical="Host Supervisor Ring-0 watchdog operates independently of userland model runtime. Kernel-level SIGKILL halts processes in under 50ms."
                />
              </div>
              <div className="mt-6 border-t border-white/[0.07] pt-4 text-xs text-[#10bc83]">
                <span className="text-[#10bc83]">Watchdog preemption:</span> <code className="text-[10.5px]">&lt;0.05s Target</code>
              </div>
            </Tilt3DCard>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── CLI & DEVELOPER INTEGRATION ── */}
        <Section className="py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <GenesisSectionIntro className="lg:col-span-6 space-y-5">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                <CipherText text="03 · CLI and Daemon Integration" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="Run the inspector locally on port 9099." />
              </h2>
              <DualCopy
                className="el-body"
                plain="You can run this exact inspector on your own PC to audit third-party AI agents, inspect tool payloads, and verify sandbox policies."
                technical="The `eleven-cli inspector` binary exposes an authenticated local JSON-RPC socket on 127.0.0.1:9099. Connect your MCP servers and watch live ActionProposal telemetry in your terminal."
              />

              <ul className="space-y-3 text-xs text-el-fg-muted">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#10bc83]">▸</span>
                  <span><strong className="text-el-fg">Interactive terminal TUI:</strong> Inspect live proposals with curses/ratatui terminal dashboards.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#10bc83]">▸</span>
                  <span><strong className="text-el-fg">Automated CI/CD verification:</strong> Run `eleven test --gates all` in your git pre-commit hooks to block unsafe AI code.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#10bc83]">▸</span>
                  <span><strong className="text-el-fg">Local JSON-RPC bridges:</strong> Compatible with Model Context Protocol (MCP) clients and standard LSP servers.</span>
                </li>
              </ul>
            </GenesisSectionIntro>

            {/* Terminal Preview */}
            <div className="lg:col-span-6">
              <GenesisShowcaseFrame className="overflow-hidden font-mono text-[11.5px]">
                <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#08090a] px-4 py-2.5 text-el-xs">
                  <span className="text-el-fg-faint">terminal // zsh</span>
                  <span className="text-[#10bc83] text-[10px]">eleven-cli v3.1</span>
                </div>
                <div className="p-5 space-y-3 leading-relaxed">
                  <p className="text-el-fg-faint">
                    <span className="text-[#10bc83]">$</span> eleven-cli inspector --listen 127.0.0.1:9099 --watch
                  </p>
                  <p className="text-[#10bc83]">
                    ✔ Host Supervisor bound to loopback socket: 127.0.0.1:9099
                  </p>
                  <p className="text-el-fg-muted">
                    ✔ 15 Invariant Rules loaded from ~/.eleven/invariants.yaml
                  </p>
                  <p className="text-el-fg-muted">
                    ✔ Operator Ed25519 Key verified [ed25519:operator_alpha]
                  </p>
                  <div className="border-t border-white/[0.07] pt-3 text-[11px] text-el-fg-faint">
                    <p className="text-[#38ffbd]">❯ Staging ActionProposal #0495 (git.push origin release/v3.2)...</p>
                    <p className="text-el-fg-muted">  [Gate 1] Path Confinement: PASS (worktree /tmp/tree_89)</p>
                    <p className="text-el-fg-muted">  [Gate 2] Static AST Check: PASS (0 eval, 0 exec)</p>
                    <p className="text-el-fg-muted">  [Gate 3] Monotonic Autonomy: PASS (Tier 2)</p>
                    <p className="text-el-fg-muted">  [Gate 4] Egress Firewall: PASS (github.com:22)</p>
                    <p className="text-[#10bc83] font-semibold">  [Gate 5] Nonce NONCE-9481 generated. Awaiting 30s signature.</p>
                  </div>
                </div>
              </GenesisShowcaseFrame>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── PRE-QUALIFIED TECHNICAL WAITLIST CTA ── */}
        <Section className="py-20">
          <div className="relative overflow-hidden rounded-[1.65rem] border border-white/[0.18] bg-[#05070d] p-8 sm:p-14 text-center shadow-el-lg">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-[34rem] rounded-full bg-[#00b38c]/20 blur-[90px]"
            />
            <GenesisSectionIntro className="relative mx-auto max-w-[640px] space-y-4">
              <div className="gfx-badge mx-auto">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83] shadow-[0_0_8px_#10bc83] animate-pulse motion-reduce:animate-none" />
                <CipherText text="04 · Developer Tooling and SDK" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="Integrate ELEVEN into your local workflow." />
              </h2>
              <DualCopy
                className="el-body"
                plain="Get early access to eleven-cli, local sandbox runtimes, and the complete JSON-RPC ActionProposal protocol SDK."
                technical="Request access to the developer preview. Includes `eleven-cli`, local MCP server bridges, and the Rust/TypeScript protocol SDK."
              />

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <WaitlistActionButton
                  tier="technical"
                  arrow
                >
                  Request CLI &amp; SDK Access
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/security"
                  arrow
                >
                  View Threat Model &amp; Invariants
                </Button>
                <Button
                  variant="ghost"
                  href="/tools/dag-visualizer"
                  arrow
                >
                  DAG Orchestrator
                </Button>
              </div>

              <p className="pt-2 text-xs text-el-fg-faint">
                Compatible with Neovim, VS Code, Zed, and custom terminal environments.
              </p>
            </GenesisSectionIntro>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
