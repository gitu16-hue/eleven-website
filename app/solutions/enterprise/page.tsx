import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { EnterpriseFleetConfigurator } from "@/components/v3/EnterpriseFleetConfigurator";
import { EnterpriseComplianceMatrix } from "@/components/v3/EnterpriseComplianceMatrix";
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
  GenesisStaggerGrid,
  GenesisSubpageHeroBackdrop,
} from "@/components/motion/GenesisMotionEngine";

export const metadata: Metadata = {
  title: "Enterprise Sovereign AI Fleet & Zero-Trust Governance | ELEVEN",
  description:
    "Deploy autonomous AI agents across corporate workstation fleets with zero cloud data leakage, centralized MDM policy enforcement, hardware FIDO2 attestation, and Merkle-chained audit ledgers.",
  alternates: {
    canonical: "/solutions/enterprise",
  },
  openGraph: {
    title: "Enterprise Sovereign AI Fleet & Zero-Trust Governance | ELEVEN",
    description:
      "Deploy frontier AI. Keep zero bytes in the cloud. Sovereign workstation fleet management for CISOs, IT directors, and engineering leaders.",
    url: "https://eleven-website-self.vercel.app/solutions/enterprise",
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
      name: "Solutions",
      item: "https://eleven-website-self.vercel.app/solutions",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Enterprise Fleet Governance",
      item: "https://eleven-website-self.vercel.app/solutions/enterprise",
    },
  ],
};

const techArticleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Enterprise Sovereign AI Fleet & Zero-Trust Governance",
  description:
    "Architecture overview, security model, and regulatory compliance mapping for deploying ELEVEN across managed enterprise workstation fleets.",
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
  url: "https://eleven-website-self.vercel.app/solutions/enterprise",
};

export default function EnterpriseSolutionPage() {
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
                  { label: "Solutions", href: "/solutions" },
                  { label: "Enterprise Fleet Governance", href: "/solutions/enterprise" },
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
                <CipherText text="Enterprise Fleet Governance · Zero-Trust Air-Gap Compliant" />
              </div>

              <h1 className="el-h1">
                <WordReveal text="Deploy frontier AI. Keep zero bytes in the cloud." />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="Empower your engineering, security, and knowledge teams with frontier AI capabilities running directly on company hardware. Proprietary source code, customer records, and strategic roadmaps never leave employee laptops."
                technical="Sovereign workstation fleet management for enterprises that cannot compromise on intellectual property, regulatory compliance, or kernel security. Ring-0 supervisory controls, centralized MDM policy manifests, and cryptographic Merkle audit trails guarantee zero external exfiltration."
              />

              {/* Status Badges */}
              <GenesisBubbleRow className="flex flex-wrap gap-2.5 pt-2 text-el-xs">
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  Zero cloud exfiltration
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  MDM / Jamf / Intune ready
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  FIDO2 hardware-bound
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  Merkle WORM audit trail
                </li>
              </GenesisBubbleRow>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton
                  tier="technical"
                  arrow
                  variant="primary"
                >
                  Schedule Architecture Consultation
                </WaitlistActionButton>

                <Button
                  href="/security"
                  variant="secondary"
                  arrow
                >
                  Inspect Threat Model
                </Button>

                <Button
                  href="/tools/vault-calculator"
                  variant="ghost"
                  arrow
                >
                  Estimate Storage Economics
                </Button>
              </div>
            </GenesisHeroIntro>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* 4 ENTERPRISE GOVERNANCE PILLARS */}
        <Section className="py-16 lg:py-24 bg-[#08090a]/60">
          <Container>
            <GenesisSectionIntro className="max-w-3xl space-y-4">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                <CipherText text="01 · Architectural Foundation" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="The 4 Enterprise Governance Pillars" />
              </h2>
              <p className="el-body">
                Traditional cloud AI assistants ask enterprise CISOs to surrender perimeter defense in exchange for model intelligence. ELEVEN reverses this paradigm: intelligence is shipped to the hardware boundary, where deterministic kernel controls govern every byte.
              </p>
            </GenesisSectionIntro>

            <GenesisStaggerGrid
              from="center"
              stagger={0.09}
              className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Pillar 01 */}
              <Tilt3DCard className="relative overflow-hidden p-6 lg:p-8 h-full">
                <div className="pointer-events-none absolute top-4 right-5 text-xs text-el-fg-faint font-mono">
                  01
                </div>
                <div className="flex items-center gap-2 text-xs text-el-accent font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#10bc83]" />
                  <span>Air-gapped fleet deployment</span>
                </div>
                <h3 className="mt-3 text-xl font-normal heading-gradient">
                  Centralized MDM &amp; 100% Offline Local Weights
                </h3>
                <DualCopy
                  className="mt-3 text-sm text-el-fg-muted leading-relaxed"
                  plain="Distribute ELEVEN like any other standard enterprise application through Jamf, Microsoft Intune, or Ansible. Models run entirely on employee laptops with zero internet dependency."
                  technical="Zero-runtime cloud dependence. Deploy pre-quantized Safetensors / GGUF model binaries via corporate package managers. Signed SHA-256 hashes prevent binary tampering; models execute on device Neural Engines and local GPUs."
                />
                <div className="mt-6 border-t border-white/[0.07] pt-4 text-xs text-el-fg-faint space-y-1.5">
                  <div className="flex justify-between">
                    <span>Package Delivery:</span>
                    <span className="text-el-fg"><code>Jamf Pro, Intune, Puppet, Ansible</code></span>
                  </div>
                  <div className="flex justify-between">
                    <span>Offline Capability:</span>
                    <span className="text-[#10bc83]">100% operational offline</span>
                  </div>
                </div>
              </Tilt3DCard>

              {/* Pillar 02 */}
              <Tilt3DCard className="relative overflow-hidden p-6 lg:p-8 h-full">
                <div className="pointer-events-none absolute top-4 right-5 text-xs text-el-fg-faint font-mono">
                  02
                </div>
                <div className="flex items-center gap-2 text-xs text-el-accent font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#10bc83]" />
                  <span>Hardware-bound identity &amp; SAML</span>
                </div>
                <h3 className="mt-3 text-xl font-normal heading-gradient">
                  FIDO2 Touch Attestation &amp; Corporate SSO
                </h3>
                <DualCopy
                  className="mt-3 text-sm text-el-fg-muted leading-relaxed"
                  plain="Connect with your existing corporate login (Okta, Microsoft Entra ID). High-risk actions require physical hardware touch (YubiKey or Touch ID) so AI can never act without human confirmation."
                  technical="Federated SAML 2.0 / OIDC authentication bound to hardware security tokens. Tier 2 and Tier 3 ActionProposals require WebAuthn FIDO2 presence assertion or Secure Enclave biometric attestation, mathematically preventing autonomous privilege escalation."
                />
                <div className="mt-6 border-t border-white/[0.07] pt-4 text-xs text-el-fg-faint space-y-1.5">
                  <div className="flex justify-between">
                    <span>SSO Federation:</span>
                    <span className="text-el-fg"><code>Okta, Microsoft Entra ID, PingFederate</code></span>
                  </div>
                  <div className="flex justify-between">
                    <span>Human Approval Gate:</span>
                    <span className="text-[#10bc83]">YubiKey 5 FIDO2 / Apple Touch ID</span>
                  </div>
                </div>
              </Tilt3DCard>

              {/* Pillar 03 */}
              <Tilt3DCard className="relative overflow-hidden p-6 lg:p-8 h-full">
                <div className="pointer-events-none absolute top-4 right-5 text-xs text-el-fg-faint font-mono">
                  03
                </div>
                <div className="flex items-center gap-2 text-xs text-el-accent font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#10bc83]" />
                  <span>Continuous auditing &amp; Merkle ledgers</span>
                </div>
                <h3 className="mt-3 text-xl font-normal heading-gradient">
                  Tamper-Evident RFC 6962 Receipts for SIEM
                </h3>
                <DualCopy
                  className="mt-3 text-sm text-el-fg-muted leading-relaxed"
                  plain="Every decision, recommendation, and action generates a verifiable audit certificate. Your compliance team gets ironclad proof for auditors without ever exposing raw confidential text."
                  technical="Cryptographically chained Merkle trees recording every reasoning node, ActionProposal hash, and policy clearance. Endpoints export signed Merkle root proofs to corporate SIEMs (Splunk, Datadog, Sentinel) satisfying SOC 2 Type II and SEC Rule 17a-4."
                />
                <div className="mt-6 border-t border-white/[0.07] pt-4 text-xs text-el-fg-faint space-y-1.5">
                  <div className="flex justify-between">
                    <span>SIEM Export Format:</span>
                    <span className="text-el-fg"><code>RFC-5424 Syslog / JSON Merkle Roots</code></span>
                  </div>
                  <div className="flex justify-between">
                    <span>Record Immutability:</span>
                    <span className="text-[#10bc83]">SEC Rule 17a-4(f) WORM Compliant</span>
                  </div>
                </div>
              </Tilt3DCard>

              {/* Pillar 04 */}
              <Tilt3DCard className="relative overflow-hidden p-6 lg:p-8 h-full">
                <div className="pointer-events-none absolute top-4 right-5 text-xs text-el-fg-faint font-mono">
                  04
                </div>
                <div className="flex items-center gap-2 text-xs text-el-accent font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#10bc83]" />
                  <span>Default-deny network isolation</span>
                </div>
                <h3 className="mt-3 text-xl font-normal heading-gradient">
                  Ring-0 Kernel Watchdog &amp; &lt;50ms Killswitch
                </h3>
                <DualCopy
                  className="mt-3 text-sm text-el-fg-muted leading-relaxed"
                  plain="If an agent attempts to open an unauthorized internet connection or access restricted directories, the system instantly halts the process in under 50 milliseconds."
                  technical="Ring-0 supervisory daemon enforces eBPF socket filtering and macOS EndpointSecurity invariants. Any socket creation outside localhost IPC triggers an immediate SIGKILL (<42ms), neutralizing prompt injection escapes at the kernel boundary."
                />
                <div className="mt-6 border-t border-white/[0.07] pt-4 text-xs text-el-fg-faint space-y-1.5">
                  <div className="flex justify-between">
                    <span>Enforcement Mechanism:</span>
                    <span className="text-el-fg"><code>Ring-0 Supervisor (eBPF / EndpointSec)</code></span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency Stop Latency:</span>
                    <span className="text-[#10bc83]">&lt;50ms deterministic halting</span>
                  </div>
                </div>
              </Tilt3DCard>
            </GenesisStaggerGrid>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* INTERACTIVE ENTERPRISE FLEET CONFIGURATOR */}
        <Section className="py-16 lg:py-24">
          <Container>
            <GenesisSectionIntro className="max-w-3xl space-y-4">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                <CipherText text="02 · Interactive Fleet Simulator" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="Simulate Fleet Governance & Telemetry" />
              </h2>
              <p className="el-body">
                Model enterprise workstation deployments from 25-seat pilot programs to 2,500-seat global rollouts. Calculate avoided cloud data exposure, annual licensing savings, and inspect generated MDM configuration manifests.
              </p>
            </GenesisSectionIntro>

            <GenesisShowcaseFrame className="mt-10 p-4 sm:p-6">
              <EnterpriseFleetConfigurator />
            </GenesisShowcaseFrame>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* INTERACTIVE REGULATORY COMPLIANCE MATRIX */}
        <Section className="py-16 lg:py-24 bg-[#08090a]/60">
          <Container>
            <GenesisSectionIntro className="max-w-3xl space-y-4">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                <CipherText text="03 · Regulatory Cross-Walk" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="Enterprise Regulatory Compliance Matrix" />
              </h2>
              <p className="el-body">
                Compare traditional cloud SaaS assistants against ELEVEN’s sovereign local architecture across critical data privacy, security, and governance standards.
              </p>
            </GenesisSectionIntro>

            <GenesisShowcaseFrame className="mt-10 p-4 sm:p-6">
              <EnterpriseComplianceMatrix />
            </GenesisShowcaseFrame>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* ENTERPRISE ARCHITECTURE TOPOLOGY BLUEPRINT */}
        <Section className="py-16 lg:py-24">
          <Container>
            <GenesisSectionIntro className="max-w-3xl space-y-4">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                <CipherText text="04 · Zero-Trust System Topology" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="Endpoint Hardware vs Corporate Control Plane" />
              </h2>
              <p className="el-body">
                ELEVEN enforces an unbreachable separation between private employee workstation execution and centralized corporate compliance monitoring.
              </p>
            </GenesisSectionIntro>

            {/* Architecture Diagram Grid */}
            <GenesisStaggerGrid
              from="center"
              stagger={0.1}
              className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs"
            >
              {/* Layer 1: Managed Endpoint */}
              <Tilt3DCard className="relative p-6 space-y-4 h-full">
                <div className="flex items-center justify-between text-el-accent">
                  <span className="font-medium">Layer 1: Workstation Endpoint</span>
                  <span className="text-[10px] text-el-fg-faint">100% private</span>
                </div>
                <div className="space-y-3 text-xs text-el-fg-muted">
                  <div className="rounded-[0.75rem] border border-white/[0.08] bg-[#08090a] p-3 space-y-1">
                    <p className="text-el-fg font-medium">Local Model Inference</p>
                    <p className="text-el-fg-faint">System 1 (16kHz Voice) + System 2 (DAG Plan)</p>
                  </div>
                  <div className="rounded-[0.75rem] border border-white/[0.08] bg-[#08090a] p-3 space-y-1">
                    <p className="text-el-fg font-medium">4-Drawer Private Vault</p>
                    <p className="text-el-fg-faint">AES-256-GCM encrypted SQLite + HNSW index</p>
                  </div>
                  <div className="rounded-[0.75rem] border border-white/[0.08] bg-[#08090a] p-3 space-y-1">
                    <p className="text-el-fg font-medium">Quarantined Git Worktrees</p>
                    <p className="text-el-fg-faint">AST security audits &amp; diff sign-off gates</p>
                  </div>
                </div>
                <div className="border-t border-white/[0.07] pt-3 text-[11px] text-[#10bc83]">
                  Zero prompts or code ever leave this boundary
                </div>
              </Tilt3DCard>

              {/* Layer 2: Ring-0 Supervisor */}
              <Tilt3DCard className="relative p-6 space-y-4 h-full">
                <div className="flex items-center justify-between text-[#10bc83]">
                  <span className="font-medium">Layer 2: Kernel Supervisor</span>
                  <span className="text-[10px] text-el-fg-faint">Hard boundary</span>
                </div>
                <div className="space-y-3 text-xs text-el-fg-muted">
                  <div className="rounded-[0.75rem] border border-white/[0.08] bg-[#08090a] p-3 space-y-1">
                    <p className="text-el-fg font-medium">eBPF Socket Firewall</p>
                    <p className="text-el-fg-faint">Drops unexpected outbound SYN packets</p>
                  </div>
                  <div className="rounded-[0.75rem] border border-white/[0.08] bg-[#08090a] p-3 space-y-1">
                    <p className="text-el-fg font-medium">FIDO2 WebAuthn Gate</p>
                    <p className="text-el-fg-faint">Hardware token touch verified on OS mutations</p>
                  </div>
                  <div className="rounded-[0.75rem] border border-white/[0.08] bg-[#08090a] p-3 space-y-1">
                    <p className="text-el-fg font-medium">Watchdog Killswitch (&lt;50ms)</p>
                    <p className="text-el-fg-faint">SIGKILL dispatched on policy non-conformance</p>
                  </div>
                </div>
                <div className="border-t border-white/[0.07] pt-3 text-[11px] text-[#10bc83]">
                  Deterministic fail-closed kernel enforcement
                </div>
              </Tilt3DCard>

              {/* Layer 3: Centralized SIEM / MDM */}
              <Tilt3DCard className="relative p-6 space-y-4 h-full">
                <div className="flex items-center justify-between text-el-accent">
                  <span className="font-medium">Layer 3: SIEM &amp; MDM Sync</span>
                  <span className="text-[10px] text-el-fg-faint">Audit only</span>
                </div>
                <div className="space-y-3 text-xs text-el-fg-muted">
                  <div className="rounded-[0.75rem] border border-white/[0.08] bg-[#08090a] p-3 space-y-1">
                    <p className="text-el-fg font-medium">Centralized Policy Fleet Distribution</p>
                    <p className="text-el-fg-faint">Jamf / Intune pushes signed YAML manifests</p>
                  </div>
                  <div className="rounded-[0.75rem] border border-white/[0.08] bg-[#08090a] p-3 space-y-1">
                    <p className="text-el-fg font-medium">Zero-Knowledge Merkle Sync</p>
                    <p className="text-el-fg-faint">Splunk / Datadog receives SHA-256 root hashes</p>
                  </div>
                  <div className="rounded-[0.75rem] border border-white/[0.08] bg-[#08090a] p-3 space-y-1">
                    <p className="text-el-fg font-medium">External Auditor Verification</p>
                    <p className="text-el-fg-faint">SOC 2 / ISO 27001 proof without data exposure</p>
                  </div>
                </div>
                <div className="border-t border-white/[0.07] pt-3 text-[11px] text-el-fg-muted">
                  Zero-knowledge proofs with verifiable visibility
                </div>
              </Tilt3DCard>
            </GenesisStaggerGrid>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* ENTERPRISE SECURITY EVALUATION FAQ */}
        <Section className="py-16 lg:py-24 bg-[#08090a]/60">
          <Container>
            <GenesisSectionIntro className="max-w-3xl space-y-4">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                <CipherText text="05 · CISO & IT Evaluation FAQ" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="Frequently Addressed Security Questions" />
              </h2>
              <p className="el-body">
                Technical answers for security review committees, compliance officers, and IT infrastructure leads.
              </p>
            </GenesisSectionIntro>

            <GenesisStaggerGrid
              stagger={0.08}
              className="mt-10 max-w-4xl space-y-4"
            >
              {[
                {
                  q: "How does ELEVEN distribute to 1,000+ developer laptops without manual configuration?",
                  a: "ELEVEN packages as signed enterprise binaries (.pkg for macOS, .msi for Windows 11). System administrators deploy configuration via existing MDM tooling (Jamf Pro, Microsoft Intune, or Ansible) with a central eleven-fleet-policy.yaml manifest. Zero employee configuration is required.",
                },
                {
                  q: "Can ELEVEN operate in 100% air-gapped SCIF environments with no WAN access?",
                  a: "Yes. Unlike cloud-dependent assistants that fail without constant outbound connectivity, ELEVEN is designed from day one to operate fully disconnected. Model weights, vector stores, and execution runtimes reside on the endpoint SSD. Fleet updates are cryptographically pre-signed and transferred via secure internal repositories.",
                },
                {
                  q: "How does ELEVEN satisfy SOC 2 Type II audit requirements if no data is stored in the cloud?",
                  a: "ELEVEN replaces opaque cloud SaaS logs with deterministic, tamper-evident Merkle tree audit logs. Every user prompt, reasoning node, ActionProposal, and approval receipt is hashed on-device. Workstations periodically stream lightweight Ed25519-signed Merkle roots to your corporate SIEM, providing non-repudiable audit trails for SOC 2 Trust Criteria CC6.1 and CC6.6 without exposing raw source code.",
                },
                {
                  q: "What hardware specifications are required for local model execution?",
                  a: "For macOS, Apple Silicon (M1 Pro/Max/Ultra, M2, M3, M4) with 16GB+ Unified Memory is recommended (32GB+ for large 70B parameter reasoning models). For Windows, modern x86-64 processors with AVX2/AVX-512 or Qualcomm Snapdragon X Elite with 16GB+ RAM and DirectX 12 / Vulkan GPU acceleration are supported.",
                },
                {
                  q: "How does the emergency stop killswitch operate during prompt injection attacks?",
                  a: "The Ring-0 supervisory daemon monitors all system calls and network sockets at the kernel level. Because model reasoning is strictly separated from tool execution, an untrusted LLM can only emit a structured JSON ActionProposal. If the proposal violates invariant rules or attempts unauthorized socket access, the Ring-0 watchdog executes a deterministic process SIGKILL in under 50 milliseconds.",
                },
              ].map((faq, i) => (
                <Tilt3DCard key={i} className="p-5 space-y-2">
                  <h3 className="text-sm font-normal heading-gradient">
                    Q: {faq.q}
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
              badge="Enterprise Pilot Program · 25 to 2,500 Seats"
              title="Ready to deploy sovereign AI across your fleet?"
              description="Contact GISHH Labs to schedule an architecture consultation, pilot deployment, and security review for your organization."
              actions={
                <>
                  <WaitlistActionButton
                    tier="technical"
                    arrow
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    Schedule Architecture Consultation
                  </WaitlistActionButton>

                  <Button
                    href="/security"
                    variant="secondary"
                    arrow
                    className="w-full sm:w-auto"
                  >
                    Security Architecture &amp; Threat Model
                  </Button>
                </>
              }
            >
              {/* Cross Links to Other Deep Architecture Pages */}
              <div className="flex flex-wrap items-center gap-6 pt-6 text-xs text-el-fg-faint">
                <Link href="/solutions/developers" className="hover:text-[#38ffbd] transition-colors">
                  For Software Engineers
                </Link>
                <Link href="/tools/vault-calculator" className="hover:text-[#38ffbd] transition-colors">
                  Vault Storage Estimator
                </Link>
                <Link href="/compare/cloud-vs-local" className="hover:text-[#38ffbd] transition-colors">
                  Cloud vs Local Audit
                </Link>
                <Link href="/docs" className="hover:text-[#38ffbd] transition-colors">
                  Developer Documentation Hub
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
