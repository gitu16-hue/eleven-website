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
            __html: JSON.stringify(softwareApplicationJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        {/* ── HERO SECTION ── */}
        <Section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-60"
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

            <div className="mt-10 max-w-4xl space-y-6">
              <div className="el-badge shadow-el-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-el-signal-lime motion-reduce:animate-none" />
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

              <div className="flex flex-wrap gap-2 pt-2 text-xs text-el-fg-muted">
                <span className="rounded-xs border border-el-signal-lime/40 bg-el-signal-lime/10 px-2.5 py-1 text-el-signal-lime text-[11px]">
                  JSON-RPC 2.0 Loopback
                </span>
                <span className="rounded-xs border border-el-signal-lime/30 bg-el-signal-lime/5 px-2.5 py-1 text-el-fg-muted text-[11px]">
                  5 Fail-Closed Gates
                </span>
                <span className="rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted text-[11px]">
                  <code>Ed25519</code> 30s TTL
                </span>
                <span className="rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted text-[11px]">
                  Ring-0 Preemption
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
                  Request CLI &amp; SDK Access
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/docs"
                  arrow
                  className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.98] disabled:opacity-50"
                >
                  Read JSON-RPC Specs
                </Button>
                <Button
                  variant="ghost"
                  href="/tools/dag-visualizer"
                  className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.98] disabled:opacity-50"
                >
                  Open DAG Visualizer
                </Button>
              </div>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── INTERACTIVE ACTION PROPOSAL PLAYGROUND ── */}
        <Section className="py-16 lg:py-24 bg-el-bg">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="el-eyebrow">
                <CipherText text="// 01 LIVE PROTOCOL SIMULATOR" />
              </div>
              <div className="rounded-xs border border-el-border bg-el-bg-raised/60 px-2.5 py-1 text-xs text-el-fg-faint">
                Simulator engine: <code className="text-el-signal-lime font-semibold">HOST_SUPERVISOR_V3</code>
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
          </div>

          <div className="mt-10">
            <ActionProposalPlayground />
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── THE 5 POLICY GATES SPECIFICATION ── */}
        <Section className="py-16 lg:py-24">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="el-eyebrow">
              <CipherText text="// 02 GATE ARCHITECTURE AND TIMING" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Zero-Trust pipeline at 12ms average latency." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Every single tool call from the AI executes in an isolated sandbox and must clear all five gates before changes reach your machine."
              technical="The five policy checkpoints execute sequentially with short-circuit preemption. If any gate fails, the pipeline terminates immediately with fail-closed semantics."
            />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Gate 1 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-signal-lime/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-signal-lime font-semibold tracking-wider">
                    GATE 01 // PATH
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-el-fg-faint">
                    &lt;1.2ms
                  </span>
                </div>
                <h3 className="text-el-lg font-medium tracking-tight text-el-fg">
                  Path Confinement
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="Ensures file changes remain strictly inside your project directory. Traversal attempts (../../) to personal documents, SSH keys, or passwords trigger an immediate stop."
                  technical="Canonical root boundary check resolves symlinks and relative path components. Blocks access outside assigned workspace chroot/namespace."
                />
              </div>
              <div className="mt-6 border-t border-el-border/60 pt-4 text-xs text-el-fg-faint">
                <span className="text-el-signal-lime">Action on breach:</span> <code className="text-[10.5px]">DROP_PACKET + SEGV</code>
              </div>
            </Tilt3DCard>

            {/* Gate 2 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-signal-lime/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-signal-lime font-semibold tracking-wider">
                    GATE 02 // AST
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-el-fg-faint">
                    &lt;4.5ms
                  </span>
                </div>
                <h3 className="text-el-lg font-medium tracking-tight text-el-fg">
                  Static AST Security Audit
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="Analyzes the code structure before running it. Blocks hidden tricks like dynamic code execution, obfuscated binary strings, or unsafe system commands."
                  technical="Abstract Syntax Tree parser scans for blacklisted AST nodes (eval, Function, dynamic child_process, and unsafe crypto primitives)."
                />
              </div>
              <div className="mt-6 border-t border-el-border/60 pt-4 text-xs text-el-fg-faint">
                <span className="text-el-signal-lime">Action on breach:</span> <code className="text-[10.5px]">QUARANTINE_DIFF</code>
              </div>
            </Tilt3DCard>

            {/* Gate 3 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-signal-lime/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-signal-lime font-semibold tracking-wider">
                    GATE 03 // AUTONOMY
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-el-fg-faint">
                    &lt;0.8ms
                  </span>
                </div>
                <h3 className="text-el-lg font-medium tracking-tight text-el-fg">
                  Monotonic Privilege Bound
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="Agents can never grant themselves extra powers mid-task. If a subagent was launched with read-only access, it cannot suddenly make changes or run root commands."
                  technical="State machine invariant ensures Tier(t_2) &le; Tier(t_1). Token downgrade is permitted; privilege elevation causes process termination."
                />
              </div>
              <div className="mt-6 border-t border-el-border/60 pt-4 text-xs text-el-fg-faint">
                <span className="text-el-signal-lime">Action on breach:</span> <code className="text-[10.5px]">THREAD_KILL + SIGKILL</code>
              </div>
            </Tilt3DCard>

            {/* Gate 4 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-signal-lime/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-signal-lime font-semibold tracking-wider">
                    GATE 04 // FIREWALL
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-el-fg-faint">
                    &lt;1.8ms
                  </span>
                </div>
                <h3 className="text-el-lg font-medium tracking-tight text-el-fg">
                  Egress Socket Firewall
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="All outbound internet connections are blocked by default. Agents can only talk to network services you specifically approved."
                  technical="Default-deny socket packet filter intercepts connect() system calls. Matches destination IP/port against cryptographic policy whitelist."
                />
              </div>
              <div className="mt-6 border-t border-el-border/60 pt-4 text-xs text-el-fg-faint">
                <span className="text-el-signal-lime">Action on breach:</span> <code className="text-[10.5px]">DROP_SOCKET + ALERT</code>
              </div>
            </Tilt3DCard>

            {/* Gate 5 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-signal-lime/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-signal-lime font-semibold tracking-wider">
                    GATE 05 // ESCROW
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[9.5px] text-el-fg-muted">
                    ED25519
                  </span>
                </div>
                <h3 className="text-el-lg font-medium tracking-tight text-el-fg">
                  Ed25519 Operator Escrow
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="Major actions (like publishing code or sending emails) pause for your explicit confirmation. You get a clear diff and 30 seconds to sign off."
                  technical="ActionProposal hashes bind to an ephemeral 128-bit nonce. Executing mutations on the host requires an operator cryptographic signature."
                />
              </div>
              <div className="mt-6 border-t border-el-border/60 pt-4 text-xs text-el-fg-faint">
                <span className="text-el-signal-lime">Action on breach:</span> <code className="text-[10.5px]">NONCE_EXPIRE (30s TTL)</code>
              </div>
            </Tilt3DCard>

            {/* Total Pipeline */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-6 shadow-el-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-signal-lime/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-el-xs">
                  <span className="text-el-signal-lime font-semibold tracking-wider">
                    PIPELINE TOTAL
                  </span>
                  <span className="rounded-xs border border-el-signal-lime/40 bg-el-signal-lime/10 px-1.5 py-0.5 text-[9.5px] text-el-signal-lime">
                    FAIL-CLOSED
                  </span>
                </div>
                <h3 className="text-el-lg font-medium tracking-tight text-el-fg">
                  Hardware Watchdog
                </h3>
                <DualCopy
                  className="text-el-sm leading-relaxed text-el-fg-muted"
                  plain="If anything unexpected happens at any stage, the emergency killswitch can terminate all spawned tasks in under 0.05 seconds."
                  technical="Host Supervisor Ring-0 watchdog operates independently of userland model runtime. Kernel-level SIGKILL halts processes in under 50ms."
                />
              </div>
              <div className="mt-6 border-t border-el-border/60 pt-4 text-xs text-el-signal-lime">
                <span className="text-el-signal-lime">Watchdog preemption:</span> <code className="text-[10.5px]">&lt;0.05s Target</code>
              </div>
            </Tilt3DCard>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── CLI & DEVELOPER INTEGRATION ── */}
        <Section className="py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="el-eyebrow">
                <CipherText text="// 03 CLI AND DAEMON INTEGRATION" />
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
                  <span className="text-el-signal-lime">▸</span>
                  <span><strong className="text-el-fg">Interactive terminal TUI:</strong> Inspect live proposals with curses/ratatui terminal dashboards.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-el-signal-lime">▸</span>
                  <span><strong className="text-el-fg">Automated CI/CD verification:</strong> Run `eleven test --gates all` in your git pre-commit hooks to block unsafe AI code.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-el-signal-lime">▸</span>
                  <span><strong className="text-el-fg">Local JSON-RPC bridges:</strong> Compatible with Model Context Protocol (MCP) clients and standard LSP servers.</span>
                </li>
              </ul>
            </div>

            {/* Terminal Preview */}
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-sm border border-el-border bg-el-bg font-mono text-[11.5px] shadow-el-md">
                <div className="flex items-center justify-between border-b border-el-border/80 bg-el-bg-raised/70 px-4 py-2.5 text-el-xs">
                  <span className="text-el-fg-faint">terminal // zsh</span>
                  <span className="text-el-signal-lime text-[10px]">eleven-cli v3.1</span>
                </div>
                <div className="p-5 space-y-3 leading-relaxed">
                  <p className="text-el-fg-faint">
                    <span className="text-el-signal-lime">$</span> eleven-cli inspector --listen 127.0.0.1:9099 --watch
                  </p>
                  <p className="text-el-signal-lime">
                    ✔ Host Supervisor bound to loopback socket: 127.0.0.1:9099
                  </p>
                  <p className="text-el-fg-muted">
                    ✔ 15 Invariant Rules loaded from ~/.eleven/invariants.yaml
                  </p>
                  <p className="text-el-fg-muted">
                    ✔ Operator Ed25519 Key verified [ed25519:operator_alpha]
                  </p>
                  <div className="border-t border-el-border/60 pt-3 text-[11px] text-el-fg-faint">
                    <p className="text-el-signal-lime">❯ Staging ActionProposal #0495 (git.push origin release/v3.2)...</p>
                    <p className="text-el-fg-muted">  [Gate 1] Path Confinement: PASS (worktree /tmp/tree_89)</p>
                    <p className="text-el-fg-muted">  [Gate 2] Static AST Check: PASS (0 eval, 0 exec)</p>
                    <p className="text-el-fg-muted">  [Gate 3] Monotonic Autonomy: PASS (Tier 2)</p>
                    <p className="text-el-fg-muted">  [Gate 4] Egress Firewall: PASS (github.com:22)</p>
                    <p className="text-el-signal-lime font-semibold">  [Gate 5] Nonce NONCE-9481 generated. Awaiting 30s signature.</p>
                  </div>
                </div>
              </div>
            </div>
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
              <div className="el-eyebrow">
                <CipherText text="// 04 DEVELOPER TOOLING AND SDK" />
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
                  className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.98] disabled:opacity-50"
                >
                  Request CLI &amp; SDK Access
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/security"
                  arrow
                  className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.98] disabled:opacity-50"
                >
                  View Threat Model &amp; Invariants
                </Button>
                <Button
                  variant="ghost"
                  href="/tools/dag-visualizer"
                  arrow
                  className="focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime active:scale-[0.98] disabled:opacity-50"
                >
                  DAG Orchestrator
                </Button>
              </div>

              <p className="pt-2 text-xs text-el-fg-faint">
                Compatible with Neovim, VS Code, Zed, and custom terminal environments.
              </p>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
