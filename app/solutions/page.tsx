import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
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
  title: "Sovereign AI Solutions: Developers & Enterprise Fleets | ELEVEN",
  description:
    "Outcome-oriented architectures for personal code supervision and corporate workstation fleets. Zero cloud IP exposure, deterministic policy gates, and local silicon control.",
  alternates: {
    canonical: "/solutions",
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
  ],
};

const CORE_PROBLEMS_SOLUTIONS = [
  {
    category: "01 · Data Confinement",
    problemPlain: "Cloud AI tools require uploading your private code and customer data to remote server clusters.",
    problemTech: "Third-party token ingress streams source code, credentials, and customer PII across network perimeters to multi-tenant inference nodes.",
    solutionPlain: "ELEVEN runs 100% on your computer. Private notes and repositories never touch external servers.",
    solutionTech: "Local vector indices (HNSW), loopback IPC (127.0.0.1), and default-deny egress firewalls isolate model reasoning inside local silicon.",
  },
  {
    category: "02 · Execution Safety",
    problemPlain: "Standard AI coding tools run dangerous terminal commands directly on your real files with no safety net.",
    problemTech: "Un-sandboxed model subshells execute arbitrary destructive shell commands, directory traversals, and unverified package installs.",
    solutionPlain: "ELEVEN runs tests and commands inside disposable sandboxes. You approve every file change before it saves.",
    solutionTech: "OS namespace confinement (cgroup v2 / AppContainer) and single-use Ed25519 diff approval receipts enforce strict write isolation.",
  },
  {
    category: "03 · Predictable Economics",
    problemPlain: "Monthly subscriptions and per-token fees quickly multiply as multi-agent tasks process long files.",
    problemTech: "Compounding API token costs, context-window rate limits, and concurrent seat licensing create unpredictable infrastructure overhead.",
    solutionPlain: "Zero token fees. Run billions of words on your own hardware without surprise bills or throttling.",
    solutionTech: "Fixed workstation license leveraging host GPU/NPU hardware acceleration with zero marginal consumption charges.",
  },
];

const SOVEREIGN_PATHS = [
  {
    badge: "For Software Engineers",
    title: "Supervised Developer Sandbox",
    descriptionPlain:
      "Write and refactor code with autonomous agents inside quarantined git worktrees. Review deterministic diffs and sign off before code merges.",
    descriptionTech:
      "TaskCompiler DAG orchestration, AST static vulnerability gates, ephemeral worktree jails, and cryptographic Ed25519 ActionProposal signing.",
    href: "/solutions/developers",
    cta: "Explore Developer Sandbox",
    metricLabel: "Barge-in latency",
    metricValue: "<50ms",
  },
  {
    badge: "For CISOs & IT Leaders",
    title: "Enterprise Fleet Governance",
    descriptionPlain:
      "Equip engineering fleets with sovereign personal AI. Enforce company security policies centrally while keeping all source code on employee laptops.",
    descriptionTech:
      "Centralized MDM configuration profiles, FIDO2 hardware attestation, zero-trust egress policies, and Merkle-tree tamper-proof audit ledgers.",
    href: "/solutions/enterprise",
    cta: "Explore Enterprise Fleet",
    metricLabel: "Cloud IP exposure",
    metricValue: "Zero bytes",
  },
];

export default function SolutionsOverviewPage() {
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
                  { label: "Solutions", href: "/solutions" },
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
                <CipherText text="Sovereign Control Planes · Outcome-Oriented Architecture" />
              </div>

              <h1 className="el-h1">
                <WordReveal text="Autonomous power without systemic liability." />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="Whether you are an individual engineer writing code in your terminal or an enterprise governing hundreds of workstations, ELEVEN separates AI reasoning from operating system execution so your data remains strictly sovereign."
                technical="Deterministic control plane decoupling model reasoning from host OS mutation. Eliminates data exfiltration vectors, prompt injection privilege escalation, and un-sandboxed terminal execution."
              />

              <div className="flex flex-wrap gap-2 pt-2 text-el-xs">
                <span className="rounded-xs border border-el-border/80 bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  Jailed git worktrees
                </span>
                <span className="rounded-xs border border-el-border/80 bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  Zero-trust fleet governance
                </span>
                <span className="rounded-xs border border-el-border/80 bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  Sub-50ms hardware watchdog
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton
                  tier="general"
                  arrow
                  variant="primary"
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  Request Technical Access
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/solutions/developers"
                  arrow
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  For Developers
                </Button>
                <Button
                  variant="ghost"
                  href="/solutions/enterprise"
                  arrow
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  For Enterprise
                </Button>
              </div>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── TWO SPECIALIZED ARCHITECTURAL PATHS ── */}
        <Section className="py-16 lg:py-24">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="el-eyebrow">
              <CipherText text="// 01 Specialized Control Planes" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Targeted architectures for developers and corporate fleets." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Select your operational environment to explore how ELEVEN enforces safety and keeps proprietary intelligence inside your boundaries."
              technical="Domain-specific deployment targets offering isolated process sandboxes for workstation engineers and centralized cryptographic compliance for enterprise fleets."
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {SOVEREIGN_PATHS.map((path) => (
              <Tilt3DCard
                key={path.title}
                className="relative flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/70 p-7 shadow-el-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-accent/40"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-el-accent">
                      {path.badge}
                    </span>
                    <span className="rounded-xs border border-el-border bg-el-bg px-2 py-0.5 text-[10px] text-el-fg-muted">
                      {path.metricLabel}: <strong className="text-el-fg">{path.metricValue}</strong>
                    </span>
                  </div>

                  <h3 className="text-el-xl font-medium tracking-tight text-el-fg">
                    {path.title}
                  </h3>

                  <DualCopy
                    className="text-el-sm leading-relaxed text-el-fg-muted"
                    plain={path.descriptionPlain}
                    technical={path.descriptionTech}
                  />
                </div>

                <div className="mt-8 border-t border-el-border/60 pt-5">
                  <Button
                    variant="secondary"
                    href={path.href}
                    arrow
                    className="w-full justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                  >
                    {path.cta}
                  </Button>
                </div>
              </Tilt3DCard>
            ))}
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── THREE SYSTEMIC FAILURES AND ARCHITECTURAL ANSWERS ── */}
        <Section className="py-16 lg:py-24 bg-el-bg-raised/45">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="el-eyebrow">
              <CipherText text="// 02 Systemic Risk Remediation" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Three cloud vulnerabilities engineered out of personal AI." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Here is how sovereign architecture eliminates the security gaps and runaway bills of cloud AI platforms."
              technical="Addressing source code egress, un-sandboxed process escalation, and compounding per-token billing curves."
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {CORE_PROBLEMS_SOLUTIONS.map((item) => (
              <Tilt3DCard key={item.category} className="p-6">
                <span className="text-xs font-medium text-el-accent">
                  {item.category}
                </span>

                <div className="mt-4 space-y-4">
                  <div className="rounded-xs border border-red-500/20 bg-red-500/5 p-3">
                    <span className="block text-[11px] font-medium text-red-400">
                      Cloud AI Vulnerability:
                    </span>
                    <DualCopy
                      className="mt-1 text-xs text-el-fg-muted leading-relaxed"
                      plain={item.problemPlain}
                      technical={item.problemTech}
                    />
                  </div>

                  <div className="rounded-xs border border-el-accent/30 bg-el-accent-soft p-3">
                    <span className="block text-[11px] font-medium text-el-accent">
                      ELEVEN Sovereign Solution:
                    </span>
                    <DualCopy
                      className="mt-1 text-xs text-el-fg-muted leading-relaxed"
                      plain={item.solutionPlain}
                      technical={item.solutionTech}
                    />
                  </div>
                </div>
              </Tilt3DCard>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              href="/compare/cloud-vs-local"
              variant="ghost"
              arrow
              className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
            >
              Inspect 6-Dimensional Architectural Matrix
            </Button>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── CALL TO ACTION SECTION ── */}
        <Section className="py-20">
          <div className="relative overflow-hidden rounded-sm border border-el-border bg-gradient-to-b from-el-bg-raised/90 to-el-bg p-8 sm:p-12 text-center shadow-el-lg">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-30"
            />
            <div className="relative mx-auto max-w-[640px] space-y-4">
              <div className="el-badge mx-auto shadow-el-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-el-accent animate-pulse motion-reduce:animate-none" />
                <CipherText text="Sovereign Deployment Program · Ring 1" />
              </div>

              <h2 className="el-h2">
                <WordReveal text="Deploy sovereign intelligence today." />
              </h2>

              <DualCopy
                className="el-body"
                plain="Join the early access program for developers and enterprise teams. Experience personal AI that executes locally and answers strictly to your rules."
                technical="Request provisioning access for local developer runtimes and enterprise fleet controllers. Guaranteed zero cloud data exposure and hardware-enforced policy gates."
              />

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <WaitlistActionButton
                  tier="general"
                  arrow
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  Request Technical Access
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/solutions/developers"
                  arrow
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  Developer Architecture
                </Button>
                <Button
                  variant="ghost"
                  href="/solutions/enterprise"
                  arrow
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  Enterprise Architecture
                </Button>
              </div>

              <p className="pt-2 text-xs text-el-fg-faint">
                Supports macOS (Apple Silicon M-series), Windows 11 (Hyper-V / WSL2), and Ubuntu 22.04+ LTS.
              </p>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
