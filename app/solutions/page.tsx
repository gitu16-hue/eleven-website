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
import {
  GenesisBubbleRow,
  GenesisCtaStage,
  GenesisHeroIntro,
  GenesisSectionIntro,
  GenesisSplitReveal,
  GenesisStaggerGrid,
  GenesisSubpageHeroBackdrop,
} from "@/components/motion/GenesisMotionEngine";

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
          <GenesisSubpageHeroBackdrop />
          <div className="relative z-10">
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

            <GenesisHeroIntro className="mt-10 max-w-4xl space-y-6">
              <div className="gfx-badge shadow-el-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83] shadow-[0_0_8px_#10bc83] animate-pulse motion-reduce:animate-none" />
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

              <GenesisBubbleRow className="flex flex-wrap gap-2.5 pt-2 text-el-xs">
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  Jailed git worktrees
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  Zero-trust fleet governance
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  Sub-50ms hardware watchdog
                </li>
              </GenesisBubbleRow>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton
                  tier="general"
                  arrow
                  variant="primary"
                >
                  Request Technical Access
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/solutions/developers"
                  arrow
                >
                  For Developers
                </Button>
                <Button
                  variant="ghost"
                  href="/solutions/enterprise"
                  arrow
                >
                  For Enterprise
                </Button>
              </div>
            </GenesisHeroIntro>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── TWO SPECIALIZED ARCHITECTURAL PATHS ── */}
        <Section className="py-16 lg:py-24">
          <GenesisSectionIntro className="max-w-3xl space-y-4 mb-10">
            <div className="gfx-badge">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              <CipherText text="01 · Specialized Control Planes" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Targeted architectures for developers and corporate fleets." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Select your operational environment to explore how ELEVEN enforces safety and keeps proprietary intelligence inside your boundaries."
              technical="Domain-specific deployment targets offering isolated process sandboxes for workstation engineers and centralized cryptographic compliance for enterprise fleets."
            />
          </GenesisSectionIntro>

          <GenesisSplitReveal
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
            leftClassName="h-full"
            rightClassName="h-full"
            offset={60}
            left={
              <Tilt3DCard className="relative flex flex-col justify-between p-7 h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-el-accent">
                      {SOVEREIGN_PATHS[0].badge}
                    </span>
                    <span className="rounded-full border border-white/[0.1] bg-[#08090a] px-2.5 py-0.5 text-[10px] text-el-fg-muted">
                      {SOVEREIGN_PATHS[0].metricLabel}: <strong className="text-[#10bc83]">{SOVEREIGN_PATHS[0].metricValue}</strong>
                    </span>
                  </div>

                  <h3 className="text-el-xl font-normal tracking-tight heading-gradient">
                    {SOVEREIGN_PATHS[0].title}
                  </h3>

                  <DualCopy
                    className="text-el-sm leading-relaxed text-el-fg-muted"
                    plain={SOVEREIGN_PATHS[0].descriptionPlain}
                    technical={SOVEREIGN_PATHS[0].descriptionTech}
                  />
                </div>

                <div className="mt-8 border-t border-white/[0.07] pt-5">
                  <Button
                    variant="secondary"
                    href={SOVEREIGN_PATHS[0].href}
                    arrow
                    className="w-full justify-center"
                  >
                    {SOVEREIGN_PATHS[0].cta}
                  </Button>
                </div>
              </Tilt3DCard>
            }
            right={
              <Tilt3DCard className="relative flex flex-col justify-between p-7 h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-el-accent">
                      {SOVEREIGN_PATHS[1].badge}
                    </span>
                    <span className="rounded-full border border-white/[0.1] bg-[#08090a] px-2.5 py-0.5 text-[10px] text-el-fg-muted">
                      {SOVEREIGN_PATHS[1].metricLabel}: <strong className="text-[#10bc83]">{SOVEREIGN_PATHS[1].metricValue}</strong>
                    </span>
                  </div>

                  <h3 className="text-el-xl font-normal tracking-tight heading-gradient">
                    {SOVEREIGN_PATHS[1].title}
                  </h3>

                  <DualCopy
                    className="text-el-sm leading-relaxed text-el-fg-muted"
                    plain={SOVEREIGN_PATHS[1].descriptionPlain}
                    technical={SOVEREIGN_PATHS[1].descriptionTech}
                  />
                </div>

                <div className="mt-8 border-t border-white/[0.07] pt-5">
                  <Button
                    variant="secondary"
                    href={SOVEREIGN_PATHS[1].href}
                    arrow
                    className="w-full justify-center"
                  >
                    {SOVEREIGN_PATHS[1].cta}
                  </Button>
                </div>
              </Tilt3DCard>
            }
          />
        </Section>

        <SignalBeamDivider />

        {/* ── THREE SYSTEMIC FAILURES AND ARCHITECTURAL ANSWERS ── */}
        <Section className="py-16 lg:py-24 bg-[#08090a]/60">
          <GenesisSectionIntro className="max-w-3xl space-y-4 mb-10">
            <div className="gfx-badge">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              <CipherText text="02 · Systemic Risk Remediation" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Three cloud vulnerabilities engineered out of personal AI." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Here is how sovereign architecture eliminates the security gaps and runaway bills of cloud AI platforms."
              technical="Addressing source code egress, un-sandboxed process escalation, and compounding per-token billing curves."
            />
          </GenesisSectionIntro>

          <GenesisStaggerGrid
            from="center"
            stagger={0.1}
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
          >
            {CORE_PROBLEMS_SOLUTIONS.map((item) => (
              <Tilt3DCard key={item.category} className="p-6 h-full">
                <span className="text-xs font-medium text-el-accent">
                  {item.category}
                </span>

                <div className="mt-4 space-y-4">
                  <div className="rounded-[0.75rem] border border-red-500/20 bg-red-500/5 p-3.5">
                    <span className="block text-[11px] font-medium text-red-400">
                      Cloud AI Vulnerability:
                    </span>
                    <DualCopy
                      className="mt-1 text-xs text-el-fg-muted leading-relaxed"
                      plain={item.problemPlain}
                      technical={item.problemTech}
                    />
                  </div>

                  <div className="rounded-[0.75rem] border border-[#10bc83]/30 bg-[#10bc83]/10 p-3.5">
                    <span className="block text-[11px] font-medium text-[#38ffbd]">
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
          </GenesisStaggerGrid>

          <div className="mt-8 flex justify-end">
            <Button
              href="/compare/cloud-vs-local"
              variant="ghost"
              arrow
            >
              Inspect 6-Dimensional Architectural Matrix
            </Button>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── CALL TO ACTION SECTION ── */}
        <Section className="py-20">
          <GenesisCtaStage
            badge="Sovereign Deployment Program · Ring 1"
            title="Deploy sovereign intelligence today."
            description="Join the early access program for developers and enterprise teams. Experience personal AI that executes locally and answers strictly to your rules."
            actions={
              <>
                <WaitlistActionButton
                  tier="general"
                  arrow
                  className="w-full sm:w-auto"
                >
                  Request Technical Access
                </WaitlistActionButton>
                <Button
                  variant="secondary"
                  href="/solutions/developers"
                  arrow
                  className="w-full sm:w-auto"
                >
                  Developer Architecture
                </Button>
                <Button
                  variant="ghost"
                  href="/solutions/enterprise"
                  arrow
                  className="w-full sm:w-auto"
                >
                  Enterprise Architecture
                </Button>
              </>
            }
          >
            <p className="pt-4 text-xs text-el-fg-faint">
              Supports macOS (Apple Silicon), Windows 11 (Hyper-V / WSL2), and Ubuntu 22.04+ LTS.
            </p>
          </GenesisCtaStage>
        </Section>
      </main>

      <Footer />
    </>
  );
}
