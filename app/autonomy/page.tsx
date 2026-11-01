import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ScrollReveal, RevealItem } from "@/components/ui/ScrollReveal";
import { ColdRoomApprovalDemo } from "@/components/v3/ColdRoomApprovalDemo";
import { PortalActionButton } from "@/components/v3/PortalActionButton";
import {
  CipherText,
  ClarityTogglePill,
  DualCopy,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";

export const metadata: Metadata = {
  title: "Safety & Control: You Stay in Command | ELEVEN v3",
  description:
    "See how ELEVEN keeps you in charge: four simple trust levels, honest 30-second approval receipts, automatic password protection, and a 0.05-second Emergency Stop.",
  alternates: {
    canonical: "/autonomy",
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
      name: "Safety & Control",
      item: "https://eleven-website-self.vercel.app/autonomy",
    },
  ],
};

const FOUR_SHIELDS = [
  {
    code: "Shield 01",
    plainTitle: "Caution Stickers on Untrusted Web Pages",
    techTitle: "Protocol A: Taint Tracking & Paraphrasing",
    plainBody:
      "Hidden traps inside random emails or websites can try to trick AI into running commands. ELEVEN marks external content with caution provenance so it can never trigger risky actions behind your back.",
    techBody:
      "External documents carry immutable TAINTED provenance tags that cannot silently escalate into Tier 2/3 tool invocations or overwrite procedural skills.",
  },
  {
    code: "Shield 02",
    plainTitle: "Independent Before-and-After Check",
    techTitle: "Protocol B: Trusted Differential Auditing",
    plainBody:
      "ELEVEN never takes an AI's word for 'I only fixed one typo.' A separate built-in inspector compares the exact before-and-after changes before anything is saved.",
    techBody:
      "An independent host-side AST and parameter differential analyzer inspects real file and argument diffs rather than trusting model-generated summaries.",
  },
  {
    code: "Shield 03",
    plainTitle: "Locked Doors to the Internet by Default",
    techTitle: "Protocol C: Default-Deny Egress & Byte Quotas",
    plainBody:
      "Background helpers work offline by default, so private files cannot be uploaded anywhere unless you have specifically approved that connection.",
    techBody:
      "Worker sandboxes run with default-deny outbound networking and strict per-session cumulative byte quotas to block covert exfiltration.",
  },
  {
    code: "Shield 04",
    plainTitle: "Honest Receipts Without Smooth-Talking",
    techTitle: "Protocol D: Cold-Room DEC-008 Verification",
    plainBody:
      "When asking your permission, ELEVEN strips the AI's persuasive prose and shows you a clean, plain-fact receipt valid once for 30 seconds.",
    techBody:
      "Strips untrusted LLM prose from approval cards, binding a 128-bit CSPRNG single-use nonce (30s TTL) to SHA-256 arguments_hash.",
  },
];

export default function AutonomyPage() {
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
        {/* ── HERO ── */}
        <Section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent opacity-60"
          />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-el-border/60">
              <Breadcrumbs
                items={[
                  { label: "Safety & Control", href: "/autonomy" },
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
                <CipherText text="Deterministic Permission Control · 4-Tier Governance" />
              </div>

              <h1 className="el-h1">
                <WordReveal text="Helpful on its own. Asks before anything big." />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="Nobody wants an AI that interrupts you every 10 seconds to read a note, and nobody wants an AI that deletes files or sends emails without asking. ELEVEN gives you the sweet spot: effortless flow for safe tasks, and rock-solid permission checks when it counts."
                technical="Graduated DEC-003 4-tier authority enables zero-friction Tier 0/1 local workflows while enforcing cryptographic Cold-Room DEC-008 nonces on Tier 2/3 boundaries."
              />

              <ScrollReveal
                stagger={0.08}
                className="flex flex-wrap gap-2 pt-2 text-[11px] font-medium"
              >
                <RevealItem>
                  <span className="inline-block rounded-xs border border-el-accent/30 bg-el-accent-soft px-2.5 py-1 text-el-accent">
                    4-Tier Authority (DEC-003)
                  </span>
                </RevealItem>
                <RevealItem>
                  <span className="inline-block rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg">
                    30s Cryptographic Nonce (DEC-008)
                  </span>
                </RevealItem>
                <RevealItem>
                  <span className="inline-block rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                    Hardware Emergency Stop (&lt;50ms)
                  </span>
                </RevealItem>
              </ScrollReveal>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button
                  href="/security"
                  variant="primary"
                  arrow
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  Inspect Zero-Trust Architecture
                </Button>
                <Button
                  href="/tools/inspector"
                  variant="secondary"
                  arrow
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                >
                  Launch ActionProposal Playground
                </Button>
              </div>
            </div>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── 3 INVARIANT LAWS ── */}
        <Section id="killswitch" className="relative py-16 lg:py-24">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="el-eyebrow">
              <CipherText text="// 01 Three Invariant Laws" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="The three golden rules of safe AI autonomy." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Clear boundaries, time-limited cryptographic tokens, and instant hardware brakes prevent unexpected actions."
              technical="TaskCompiler immutable tier bounds, 30s single-use DEC-008 nonces, and <50ms Ring-0 supervisor interrupts."
            />
          </div>

          {/* 3 Simple Rules */}
          <ScrollReveal
            stagger={0.1}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <RevealItem className="h-full">
              <Tilt3DCard className="p-6">
                <span className="text-xs font-semibold text-el-accent">
                  Rule 01: Clear limits first
                </span>
                <h3 className="mt-2.5 text-base font-semibold text-el-fg">
                  AI Can Never Promote Itself
                </h3>
                <DualCopy
                  className="mt-2 text-xs leading-relaxed text-el-fg-muted"
                  plain="If you ask ELEVEN to read a folder, deleting and emailing stay locked off from the start: the AI cannot change its own rules midway."
                  technical="TaskCompiler stamps immutable maximum authority tiers and canonical root scopes prior to model invocation."
                />
              </Tilt3DCard>
            </RevealItem>

            <RevealItem className="h-full">
              <Tilt3DCard className="p-6">
                <span className="text-xs font-semibold text-el-accent">
                  Rule 02: Single-use passes
                </span>
                <h3 className="mt-2.5 text-base font-semibold text-el-fg">
                  30-Second Exact Permission
                </h3>
                <DualCopy
                  className="mt-2 text-xs leading-relaxed text-el-fg-muted"
                  plain="Approving one action does not give a blank check: your confirmation unlocks that exact step once for 30 seconds, then locks right back up."
                  technical="Single-use 128-bit DEC-008 nonces bind cryptographically to SHA-256 arguments_hash and expire after 30s."
                />
              </Tilt3DCard>
            </RevealItem>

            <RevealItem className="h-full">
              <Tilt3DCard className="p-6">
                <span className="text-xs font-semibold text-el-accent">
                  Rule 03: Instant brakes
                </span>
                <h3 className="mt-2.5 text-base font-semibold text-el-fg">
                  0.05-Second Emergency Stop
                </h3>
                <DualCopy
                  className="mt-2 text-xs leading-relaxed text-el-fg-muted"
                  plain="Press Ctrl+Alt+Shift+K (or say 'Eleven, stop everything') anytime to freeze speech and cancel tasks in the blink of an eye."
                  technical="Hardware-priority supervisor interrupt flushes DAC audio, revokes active nonces, and halts worker subprocess trees in <50ms."
                />
              </Tilt3DCard>
            </RevealItem>
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── INTERACTIVE 4 TRUST LEVELS + RECEIPT DEMO ── */}
        <Section id="policy-gates" className="relative py-16 lg:py-24">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="el-eyebrow">
              <CipherText text="// 02 Cold-Room Approval Demo" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Experience the 4 graduated trust tiers firsthand." />
            </h2>
            <DualCopy
              className="el-body"
              plain="From zero-friction quiet actions to strict cryptographic approvals: test how ELEVEN handles different sensitivity levels."
              technical="Simulates DEC-003 Tier 0 through Tier 3 execution boundaries with simulated 128-bit CSPRNG nonces."
            />
          </div>
          <ScrollReveal>
            <ColdRoomApprovalDemo />
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── 4 BUILT-IN PROTECTION SHIELDS ── */}
        <Section className="py-16 lg:py-24 bg-el-bg-raised/45">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="el-eyebrow">
              <CipherText text="// 03 Adversarial Defense" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Protected even if a tricky webpage tries to fool the AI." />
            </h2>
            <DualCopy
              className="el-body"
              plain="Four deep security barriers that catch prompt injections, tainted downloads, runaway loops, and unauthorized data leaks."
              technical="Dynamic taint propagation, canonical root confinement, monotonic privilege checks, and default-deny socket boundaries."
            />
          </div>

          <ScrollReveal
            stagger={0.09}
            className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {FOUR_SHIELDS.map((p) => (
              <RevealItem key={p.code} className="h-full">
                <Tilt3DCard className="p-6 lg:p-7">
                  <span className="text-el-xs font-semibold text-el-accent">
                    {p.code}
                  </span>
                  <DualCopy
                    as="div"
                    className="mt-2.5 text-el-lg font-medium tracking-[-0.015em] text-el-fg"
                    plain={p.plainTitle}
                    technical={p.techTitle}
                  />
                  <DualCopy
                    className="mt-2.5 text-el-xs leading-[1.65] text-el-fg-muted"
                    plain={p.plainBody}
                    technical={p.techBody}
                  />
                </Tilt3DCard>
              </RevealItem>
            ))}
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── WHY CASUAL "YES" IS PROTECTED + UNEDITABLE LOGS ── */}
        <Section>
          <ScrollReveal
            stagger={0.1}
            className="grid grid-cols-1 gap-6 lg:grid-cols-12"
          >
            <RevealItem className="lg:col-span-6">
              <Tilt3DCard className="p-7">
                <p className="text-el-xs font-medium text-el-accent">
                  Accident prevention
                </p>
                <h3 className="mt-2 text-el-xl font-medium text-el-fg">
                  Why blurting out &ldquo;Yes&rdquo; can never approve the wrong thing.
                </h3>
                <DualCopy
                  className="mt-3 text-el-xs leading-[1.65] text-el-fg-muted"
                  plain="Suppose two tasks finish at the same moment (one harmless, one deleting old files) and you say 'Yes' out loud. Ordinary voice assistants might delete your files by mistake. Whenever there is any ambiguity, ELEVEN asks you to name the specific action or click the clear button on screen."
                  technical="When concurrent Tier 2/3 approval gates or taint warnings exist, generic spoken affirmation is deterministically rejected in favor of explicit correlation-token binding or Cold-Room UI signature."
                />
              </Tilt3DCard>
            </RevealItem>

            <RevealItem className="lg:col-span-6">
              <Tilt3DCard className="p-7">
                <p className="text-el-xs font-medium text-el-accent">
                  Complete transparency
                </p>
                <h3 className="mt-2 text-el-xl font-medium text-el-fg">
                  An uneditable activity log right on your computer.
                </h3>
                <DualCopy
                  className="mt-3 text-el-xs leading-[1.65] text-el-fg-muted"
                  plain="Every single step ELEVEN takes is written into a permanent local diary where entries are linked like chain links: nothing can ever be secretly erased or altered behind your back."
                  technical="Every TaskSpec, policy verdict, issued DEC-008 nonce, and execution receipt appends to a SHA-256 hash chain: entry_hash = SHA256(prev_hash || canonical_record)."
                />
                <div className="mt-6 flex flex-wrap gap-3">
                  <PortalActionButton variant="primary" arrow>
                    Test Approval Card in 3D Orb
                  </PortalActionButton>
                  <Button
                    href="/research"
                    variant="secondary"
                    arrow
                    className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.99] disabled:opacity-50"
                  >
                    Read Our 15 Promises
                  </Button>
                </div>
              </Tilt3DCard>
            </RevealItem>
          </ScrollReveal>
        </Section>
      </main>

      <Footer />
    </>
  );
}
