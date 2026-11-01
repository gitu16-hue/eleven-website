import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ScrollReveal, RevealItem } from "@/components/ui/ScrollReveal";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { InvariantRuleExplorer } from "@/components/v3/InvariantRuleExplorer";
import { WaitlistActionButton } from "@/components/v3/WaitlistActionButton";
import { FlagshipSecurityExperience } from "@/components/security/FlagshipSecurityExperience";
import { CurvedGovernanceRouteStepper } from "@/components/security/CurvedGovernanceRouteStepper";
import {
  ClarityTogglePill,
  DualCopy,
  ParagraphReveal,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";

export const metadata: Metadata = {
  title: "Security Architecture, Threat Model & Invariant Rules | ELEVEN",
  description:
    "Authoritative security architecture and formal threat model for the ELEVEN personal AI operating system. 5 adversarial vector mitigations, 15 fail-closed invariants, and cryptographic disclosure.",
  alternates: {
    canonical: "/security",
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
      name: "Security",
      item: "https://eleven-website-self.vercel.app/security",
    },
  ],
};

const techArticleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "ELEVEN Security Architecture & Formal Threat Model",
  description:
    "Comprehensive specification of zero-trust process isolation, 15 fail-closed invariant rules, memory encryption schemas, and Ed25519 cryptographic receipts in ELEVEN v3.1.",
  author: {
    "@type": "Organization",
    name: "GISHH Labs Security Team",
    url: "https://eleven-website-self.vercel.app",
  },
  publisher: {
    "@type": "Organization",
    name: "GISHH Labs",
    logo: "https://eleven-website-self.vercel.app/gishh-logo.png",
  },
  url: "https://eleven-website-self.vercel.app/security",
};

export default function SecurityCenterPage() {
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
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent opacity-60"
          />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-el-border">
              <Breadcrumbs
                items={[
                  { label: "Security", href: "/security" },
                ]}
              />
              <div className="flex items-center gap-3">
                <span className="text-xs text-el-fg-faint font-sans">
                  Terminology depth:
                </span>
                <ClarityTogglePill />
              </div>
            </div>

            <div className="mt-10 max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-el-border bg-el-sec-graphite-deep px-3.5 py-1 text-xs font-medium text-el-sec-porcelain">
                <span className="h-1.5 w-1.5 rounded-full bg-el-sec-lime motion-safe:animate-pulse motion-reduce:animate-none" />
                <span>Zero-Trust Operating System · Formal Threat Model</span>
              </div>

              <h1 className="el-h1">
                <WordReveal text="Zero-Trust at the silicon boundary. Models are untrusted. Invariants are absolute." />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="We design ELEVEN under the assumption that AI models can be tricked, hacked, or hallucinate. The host operating system never trusts the AI: every file access, network connection, and command is strictly governed by fail-closed security gates."
                technical="A formal threat model and verification architecture that assumes models are untrusted and operating systems must remain fail-closed. Ring-0 process boundaries, memory loopback encryption, and Ed25519 cryptographic receipts."
              />

              {/* Status Badges */}
              <ScrollReveal
                stagger={0.07}
                className="flex flex-wrap gap-2 pt-2 text-xs"
              >
                <RevealItem>
                  <span className="inline-block rounded-sm border border-el-sec-lime/30 bg-el-sec-lime/10 px-2.5 py-1 text-el-sec-lime font-medium">
                    Web layer: CSP + HSTS + rate-limited API verified
                  </span>
                </RevealItem>
                <RevealItem>
                  <span className="inline-block rounded-sm border border-el-border bg-el-sec-graphite-deep px-2.5 py-1 text-el-fg-muted">
                    OS specification: AES-256-GCM loopback vault
                  </span>
                </RevealItem>
                <RevealItem>
                  <span className="inline-block rounded-sm border border-el-border bg-el-sec-graphite-deep px-2.5 py-1 text-el-fg-muted">
                    OS specification: SHA-256 Merkle receipts
                  </span>
                </RevealItem>
                <RevealItem>
                  <span className="inline-block rounded-sm border border-el-border bg-el-sec-graphite-deep px-2.5 py-1 text-el-fg-muted">
                    OS specification: Default-deny worker sockets
                  </span>
                </RevealItem>
              </ScrollReveal>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton tier="technical" arrow variant="primary">
                  Request Security Briefing
                </WaitlistActionButton>
                <Button variant="secondary" href="/docs" arrow className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime active:scale-[0.99] disabled:opacity-50">
                  Explore Architecture Specs
                </Button>
                <Button variant="ghost" href="/tools/inspector" arrow className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime active:scale-[0.99] disabled:opacity-50">
                  Test ActionProposals
                </Button>
              </div>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── FIVE ADVERSARIAL THREAT VECTORS ── */}
        <Section className="py-16 lg:py-24">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="text-xs font-medium text-el-sec-lime">
              01 · Threat model & attack vectors
            </div>
            <h2 className="el-h2">
              <WordReveal text="How ELEVEN neutralizes frontier AI threats." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Modern AI systems face distinct attack vectors that traditional antivirus cannot catch. Here is how our architecture intercepts and stops each one."
              technical="Formal threat matrix detailing adversarial vectors, attacker objectives, and deterministic kernel mitigations enforced by the Host Supervisor."
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Vector 1 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-md border border-el-border bg-el-sec-graphite/80 p-6 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-border-strong">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-400 font-medium">
                    Vector 01 · Injection
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[10px] text-el-fg-faint">
                    Taint track
                  </span>
                </div>
                <h3 className="text-lg font-medium tracking-tight text-el-sec-porcelain">
                  Indirect Prompt Injection
                </h3>
                <DualCopy
                  className="text-xs leading-relaxed text-el-fg-muted"
                  plain="Tricky websites or phishing emails that hide secret text trying to command the AI to delete your files or read passwords are tagged with a Caution label and blocked from running tools."
                  technical="Incoming payloads from external origins (IMAP, HTTP, Webhook) receive an immutable UNTRUSTED_TAINT flag. Strict AST grammar bounds prevent untrusted data tokens from entering tool call dispatchers."
                />
              </div>
              <div className="mt-6 border-t border-el-border pt-4 text-xs text-el-sec-lime">
                Mitigation: Parser Taint Boundary <span className="font-mono text-[11px] text-el-fg-faint">(INV-05)</span>
              </div>
            </Tilt3DCard>

            {/* Vector 2 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-md border border-el-border bg-el-sec-graphite/80 p-6 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-border-strong">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-400 font-medium">
                    Vector 02 · Escalation
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[10px] text-el-sec-lime">
                    Monotonic
                  </span>
                </div>
                <h3 className="text-lg font-medium tracking-tight text-el-sec-porcelain">
                  Unauthorized Privilege Escalation
                </h3>
                <DualCopy
                  className="text-xs leading-relaxed text-el-fg-muted"
                  plain="A background AI agent can never grant itself higher privileges or run admin commands. It remains strictly confined to the exact task boundaries you authorized."
                  technical="Subagent tokens are cryptographically locked to their initial Tier (T0 to T3). Monotonic privilege bounds (INV-03) cause instant process termination if a task attempts role promotion."
                />
              </div>
              <div className="mt-6 border-t border-el-border pt-4 text-xs text-el-sec-lime">
                Mitigation: Ring-0 Host Supervisor <span className="font-mono text-[11px] text-el-fg-faint">(INV-03)</span>
              </div>
            </Tilt3DCard>

            {/* Vector 3 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-md border border-el-border bg-el-sec-graphite/80 p-6 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-border-strong">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-400 font-medium">
                    Vector 03 · Exfiltration
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[10px] text-el-fg-muted">
                    AES-256-GCM
                  </span>
                </div>
                <h3 className="text-lg font-medium tracking-tight text-el-sec-porcelain">
                  Memory Vault Exfiltration
                </h3>
                <DualCopy
                  className="text-xs leading-relaxed text-el-fg-muted"
                  plain="Your private memories, notes, and preferences are encrypted right on your PC. No third party or cloud service can read your local vault without your hardware key."
                  technical="Private memory drawers bind exclusively to local loopback (127.0.0.1) and are encrypted with AES-256-GCM. Keys derive from on-device TPM 2.0 / Apple Secure Enclave via Argon2id."
                />
              </div>
              <div className="mt-6 border-t border-el-border pt-4 text-xs text-el-sec-lime">
                Mitigation: Loopback Bound CryptFS <span className="font-mono text-[11px] text-el-fg-faint">(INV-13)</span>
              </div>
            </Tilt3DCard>

            {/* Vector 4 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-md border border-el-border bg-el-sec-graphite/80 p-6 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-border-strong">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-400 font-medium">
                    Vector 04 · Malicious Code
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[10px] text-el-fg-faint">
                    Jailed tree
                  </span>
                </div>
                <h3 className="text-lg font-medium tracking-tight text-el-sec-porcelain">
                  Quarantine Sanctum Escape
                </h3>
                <DualCopy
                  className="text-xs leading-relaxed text-el-fg-muted"
                  plain="When agents test or modify code, they work inside a sealed sandbox. They cannot write to your real git branches or access ~/.ssh or ~/.env files."
                  technical="Code modifications execute in transient memory-backed worktrees with read-only root mounts. Low-integrity cgroup v2 / AppContainer tokens block breakout and directory traversal."
                />
              </div>
              <div className="mt-6 border-t border-el-border pt-4 text-xs text-el-sec-lime">
                Mitigation: Worktree Jails & AST Audit <span className="font-mono text-[11px] text-el-fg-faint">(INV-01)</span>
              </div>
            </Tilt3DCard>

            {/* Vector 5 */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-md border border-el-border bg-el-sec-graphite/80 p-6 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-border-strong">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-400 font-medium">
                    Vector 05 · Covert Egress
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[10px] text-el-fg-faint">
                    Firewall
                  </span>
                </div>
                <h3 className="text-lg font-medium tracking-tight text-el-sec-porcelain">
                  Covert C2 Telemetry Exfiltration
                </h3>
                <DualCopy
                  className="text-xs leading-relaxed text-el-fg-muted"
                  plain="The software cannot secretly phone home to foreign servers or transmit your proprietary data behind your back. Every outgoing connection is denied by default."
                  technical="Host Supervisor enforces a strict default-deny socket firewall. Unauthorized outbound UDP/TCP connection attempts trigger instant process SIGKILL and an immutable security alert."
                />
              </div>
              <div className="mt-6 border-t border-el-border pt-4 text-xs text-el-sec-lime">
                Mitigation: Default-Deny Packet Filter <span className="font-mono text-[11px] text-el-fg-faint">(INV-02)</span>
              </div>
            </Tilt3DCard>

            {/* Vector 6 / Guarantee */}
            <Tilt3DCard className="relative flex flex-col justify-between rounded-md border border-el-border bg-el-sec-graphite/80 p-6 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-el-border-strong">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-el-sec-lime font-medium">
                    Safety Guarantee
                  </span>
                  <span className="rounded-xs border border-el-border px-1.5 py-0.5 text-[10px] text-el-sec-lime">
                    &lt;0.05s halt
                  </span>
                </div>
                <h3 className="text-lg font-medium tracking-tight text-el-sec-porcelain">
                  Hardware Watchdog Killswitch
                </h3>
                <DualCopy
                  className="text-xs leading-relaxed text-el-fg-muted"
                  plain="No matter what an AI is doing, hitting your emergency shortcut or closing your laptop kills all activity in under 0.05 seconds. The AI cannot prevent this."
                  technical="Watchdog daemon resides outside userland model processes. Kernel-level thread preemption terminates spawned worker process trees in under 50ms without waiting for LLM turn completion."
                />
              </div>
              <div className="mt-6 border-t border-el-border pt-4 text-xs text-el-sec-lime">
                Mitigation: Host Supervisor Watchdog Spec <span className="font-mono text-[11px] text-el-fg-faint">(INV-10/15)</span>
              </div>
            </Tilt3DCard>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── FLAGSHIP WEBSITE ANIMATIONS SHOWCASE: 3D EXPLODED STACK + THREAT BENTO + FLIP MORPHING ── */}
        <Section id="flagship-security-showcase" className="relative py-16 lg:py-24">
          {/* Legacy anchor compatibility for /security#threat-simulation */}
          <div id="threat-simulation" className="absolute -top-24 left-0 pointer-events-none" aria-hidden="true" />
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="text-xs font-medium text-el-sec-lime">
              01B · Flagship security visualization experience
            </div>
            <h2 className="el-h2">
              <WordReveal text="Shared-layout FLIP morphing, 3D exploded layers & live threat interception." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Explore ELEVEN's zero-trust security architecture. Click the top telemetry pill to expand the live 3-drone swarm, scrub the 3D isometric stack to explode internal planes, and test real-time threat interception in the obsidian bento grid."
              technical="Framer Motion LayoutGroup morphing coupled with GSAP ScrollTrigger 1600px isometric stage scrubbing. Models live token scrubbers, default-deny egress barriers, and Cold-Room DEC-008 hardware nonces."
            />
          </div>

          <FlagshipSecurityExperience />
        </Section>

        <SignalBeamDivider />

        {/* ── COMPONENT C: CURVED GOVERNANCE ROUTE STEPPER ── */}
        <Section id="governance-route" className="py-16 lg:py-24">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="text-xs font-medium text-el-sec-lime">
              01D · Execution & authorization route
            </div>
            <h2 className="el-h2">
              <WordReveal text="One deterministic route. Graduated to task risk." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Every request travels through Understand, Plan, Authorize, Execute, and Verify—but safe local lookups glide right past manual popups, while external or destructive actions pause for your 30-second receipt."
              technical="Responsive cubic-bezier SVG route stepper mapping DEC-003 graduated autonomy (Tier 0 read-only, Tier 1 reversible snapshot, Tier 2/3 Cold-Room human nonce) across the five lifecycle stages."
            />
          </div>

          <CurvedGovernanceRouteStepper />
        </Section>

        <SignalBeamDivider />

        {/* ── INTERACTIVE 15 INVARIANT RULES EXPLORER ── */}
        <Section className="py-16 lg:py-24 bg-el-sec-graphite-deep">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-medium text-el-sec-lime">
                02 · Invariant specification viewer
              </div>
              <div className="rounded-sm border border-el-border bg-el-sec-graphite px-2.5 py-1 text-xs text-el-fg-faint">
                Specification: <span className="text-el-sec-lime font-medium">15 target invariants</span>
              </div>
            </div>
            <h2 className="el-h2">
              <WordReveal text="The 15 Mathematical Invariants." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Click through our complete safety registry below. Every rule has a strict mathematical condition and an automatic action that kicks in if anything ever goes wrong."
              technical="Interactive specification viewer for all 15 system safety invariants (INV-01 through INV-15) enforced across Memory, Sandboxing, Network, and Governance boundaries."
            />
          </div>

          <div className="mt-10">
            <InvariantRuleExplorer />
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── CRYPTOGRAPHIC RECEIPTS & MERKLE AUDIT LEDGER ── */}
        <Section className="py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-medium text-el-sec-lime">
                03 · Cryptographic verification
              </div>
              <h2 className="el-h2">
                <WordReveal text="Every action is signed. Every decision is provable." />
              </h2>
              <DualCopy
                className="el-body"
                plain="ELEVEN never makes changes in secret. Whenever an action is approved, your computer generates a cryptographic receipt that proves exactly what was changed, when it happened, and who authorized it."
                technical="All ActionProposals bind canonical parameter hashes to single-use Ed25519 digital signatures. Receipts append to a local Merkle-chained SQLite ledger that makes unauthorized retroactive edits mathematically impossible."
              />

              <ul className="space-y-3 text-xs leading-relaxed text-el-fg-muted">
                <li className="flex items-start gap-2.5">
                  <span className="text-el-sec-lime">▸</span>
                  <span><strong className="text-el-sec-porcelain">SHA-256 parameter digests:</strong> Prevents time-of-check to time-of-use (TOCTOU) race condition vulnerabilities.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-el-sec-lime">▸</span>
                  <span><strong className="text-el-sec-porcelain">Ephemeral 30s nonce TTL:</strong> Approvals expire automatically if not signed within 30 seconds; expired nonces cannot be replayed.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-el-sec-lime">▸</span>
                  <span><strong className="text-el-sec-porcelain">Cold-Room diff presentation:</strong> Approval UI strips all conversational prose; you review only raw parameter structures and code diffs.</span>
                </li>
              </ul>
            </div>

            {/* Cryptographic Receipt Box */}
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-md border border-el-border bg-el-sec-graphite-deep shadow-md">
                <div className="flex items-center justify-between border-b border-el-border bg-el-sec-graphite px-4 py-2.5 text-xs">
                  <span className="text-el-fg-faint font-medium">Receipt schema · Audit ledger</span>
                  <span className="text-el-sec-lime font-medium">Ed25519 verified</span>
                </div>
                <pre className="p-5 overflow-x-auto text-xs leading-relaxed font-mono text-el-fg-muted">
                  <code>{`{
  "receipt_nonce": "NONCE-2026-8f2c019-9481",
  "action_type": "GIT_WORKTREE_MERGE",
  "payload_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "invariant_gates_passed": ["INV-01", "INV-02", "INV-03", "INV-05", "INV-06"],
  "operator_signature": "ed25519:7b3a98f12c...890abf1",
  "merkle_root_chained": "0x4a912e7b89f0c123"
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── RESPONSIBLE DISCLOSURE & PGP KEYS ── */}
        <Section className="py-16">
          <div className="max-w-[700px]">
            <p className="text-xs font-medium text-el-sec-lime">
              04 · Responsible disclosure & security contact
            </p>
            <h2 className="mt-2 el-h2">
              <WordReveal text="Vulnerability reporting & PGP keys." />
            </h2>
            <ParagraphReveal
              className="mt-3 el-body"
              text="We treat security with rigorous scientific discipline. If you discover a vulnerability or policy bypass in ELEVEN, we encourage responsible disclosure through our dedicated team channel."
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 text-xs">
            {/* GPG Key Information */}
            <div className="rounded-md border border-el-border bg-el-sec-graphite/80 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-el-border pb-3">
                <span className="text-el-sec-porcelain font-semibold">GPG Public Key</span>
                <span className="text-el-fg-faint text-[11px]">RSA 4096-bit</span>
              </div>
              <div className="space-y-1 text-xs text-el-fg-muted">
                <p className="text-el-fg-faint">Primary fingerprint:</p>
                <p className="font-mono text-xs font-medium text-el-sec-lime break-all select-all">
                  4A91 2E7B 89F0 C123 E804 D55A 7731 0B9F 281A 90CD
                </p>
              </div>
              <div className="text-xs text-el-fg-muted space-y-1">
                <p><span className="text-el-sec-porcelain">Email:</span> security@gishh.com</p>
                <p><span className="text-el-sec-porcelain">Standard:</span> RFC 9116 / security.txt</p>
                <p><span className="text-el-sec-porcelain">Response window:</span> Under 24 hours</p>
              </div>
            </div>

            {/* Safe Harbor Policy */}
            <div className="rounded-md border border-el-border bg-el-sec-graphite/80 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-el-border pb-3">
                <span className="text-el-sec-porcelain font-semibold">Safe Harbor Policy</span>
                <span className="text-el-sec-lime text-[11px] font-medium">Researcher friendly</span>
              </div>
              <p className="text-xs text-el-fg-muted leading-relaxed">
                GISHH Labs pledges not to initiate legal action against researchers who discover and report potential vulnerabilities in good faith according to responsible disclosure standards.
              </p>
              <ul className="space-y-1.5 text-xs text-el-fg-faint">
                <li>✓ Do not violate the privacy of other users.</li>
                <li>✓ Do not destroy data or execute denial of service attacks.</li>
                <li>✓ Provide sufficient technical details to reproduce findings.</li>
              </ul>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── ACCESS FUNNEL & SECURITY BRIEFING CTA ── */}
        <Section className="py-20">
          <div className="relative overflow-hidden rounded-md border border-el-border bg-gradient-to-b from-el-sec-graphite to-el-sec-graphite-deep p-8 sm:p-12 text-center shadow-lg">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-20"
            />
            <div className="relative mx-auto max-w-[640px] space-y-4">
              <span className="text-xs font-medium text-el-sec-lime">
                Enterprise & research briefings
              </span>
              <h2 className="el-h2">
                <WordReveal text="Ready to review our formal threat model?" />
              </h2>
              <DualCopy
                className="el-body"
                plain="Request a technical security walkthrough with our engineering team, or join the developer alpha to inspect the sandbox yourself."
                technical="Schedule an institutional security architecture briefing with the GISHH Labs engineering team, or join the Technical Preview ring."
              />

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <WaitlistActionButton tier="technical" arrow>
                  Request Security Briefing (Technical Ring)
                </WaitlistActionButton>
                <Button variant="secondary" href="/solutions/developers" arrow className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime">
                  Explore Developer Solution
                </Button>
                <Button variant="ghost" href="/solutions/enterprise" arrow className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime">
                  Enterprise Fleet Governance
                </Button>
              </div>

              <p className="pt-2 text-xs text-el-fg-faint font-sans">
                Verification whitepapers and architecture threat matrices provided under NDA.
              </p>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
