import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ScrollReveal, RevealItem } from "@/components/ui/ScrollReveal";
import { ColdRoomApprovalDemo } from "@/components/v3/ColdRoomApprovalDemo";
import { PortalActionButton } from "@/components/v3/PortalActionButton";
import {
  ClarityTogglePill,
  DualCopy,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";

export const metadata: Metadata = {
  title: "Safety & Control — You Stay the Boss | ELEVEN v3",
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
    code: "SHIELD 01",
    plainTitle: "Caution Stickers on Untrusted Web Pages",
    techTitle: "Protocol A · Taint Tracking & Paraphrasing",
    plainBody:
      "Hidden traps inside random emails or websites can try to trick AI into running commands. ELEVEN slaps a 'Caution' sticker on outside content so it can never trigger risky actions behind your back.",
    techBody:
      "External documents carry immutable TAINTED provenance tags that cannot silently escalate into Tier 2/3 tool invocations or overwrite procedural skills.",
  },
  {
    code: "SHIELD 02",
    plainTitle: "Independent Before-and-After Check",
    techTitle: "Protocol B · Trusted Differential Auditing",
    plainBody:
      "ELEVEN never takes an AI’s word for 'I only fixed one typo.' A separate built-in inspector compares the exact before-and-after changes before anything is saved.",
    techBody:
      "An independent host-side AST and parameter differential analyzer inspects real file/argument diffs rather than trusting model-generated summaries.",
  },
  {
    code: "SHIELD 03",
    plainTitle: "Locked Doors to the Internet by Default",
    techTitle: "Protocol C · Default-Deny Egress & Byte Quotas",
    plainBody:
      "Background helpers work offline by default—so private files can’t be uploaded anywhere unless you’ve specifically approved that connection.",
    techBody:
      "Worker sandboxes run with default-deny outbound networking and strict per-session cumulative byte quotas to block covert exfiltration.",
  },
  {
    code: "SHIELD 04",
    plainTitle: "Honest Receipts Without Smooth-Talking",
    techTitle: "Protocol D · Cold-Room DEC-008 Verification",
    plainBody:
      "When asking your permission, ELEVEN hides the AI’s persuasive sales pitch and shows you a clean, plain-fact receipt—valid once for 30 seconds.",
    techBody:
      "Strips untrusted LLM prose from approval cards, binding a 128-bit CSPRNG single-use nonce (30s TTL) to SHA-256 arguments_hash.",
  },
];

export default function AutonomyPage() {
  return (
    <>
      <Nav />

      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {/* ── HERO ── */}
        <Section className="pt-12 pb-20">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-[780px]">
              <p className="font-mono text-el-xs uppercase tracking-[0.12em] text-el-accent">
                SAFETY &amp; HUMAN CONTROL
              </p>
              <WordReveal
                as="h1"
                text="Helpful on its own."
                mutedText="Asks before anything big."
                className="mt-4 text-el-4xl font-medium leading-[1.06] tracking-[-0.03em] text-el-fg"
              />
              <DualCopy
                className="mt-6 max-w-[650px] text-el-lg leading-[1.6] text-el-fg-muted"
                plain="Nobody wants an AI that interrupts you every 10 seconds to read a note—and nobody wants an AI that deletes files or sends emails without asking! ELEVEN gives you the sweet spot: effortless flow for safe tasks, and rock-solid permission checks when it counts."
                technical="Graduated DEC-003 4-tier authority enables zero-friction Tier 0/1 local workflows while enforcing cryptographic Cold-Room DEC-008 nonces on Tier 2/3 boundaries."
              />
            </div>
            <ClarityTogglePill />
          </div>

          {/* 3 Simple Rules */}
          <ScrollReveal
            stagger={0.1}
            className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <RevealItem className="h-full">
              <Tilt3DCard className="p-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.09em] text-el-accent">
                  RULE 01 · CLEAR LIMITS FIRST
                </span>
                <h2 className="mt-2.5 text-el-base font-medium text-el-fg">
                  AI Can Never Promote Itself
                </h2>
                <DualCopy
                  className="mt-2 text-el-xs leading-[1.6] text-el-fg-muted"
                  plain="If you ask ELEVEN to read a folder, deleting and emailing stay locked off from the start—the AI can’t change its own rules midway."
                  technical="TaskCompiler stamps immutable maximum authority tiers and canonical root scopes prior to model invocation."
                />
              </Tilt3DCard>
            </RevealItem>

            <RevealItem className="h-full">
              <Tilt3DCard className="p-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.09em] text-el-accent">
                  RULE 02 · ONE-TIME PASSES
                </span>
                <h2 className="mt-2.5 text-el-base font-medium text-el-fg">
                  30-Second Exact Permission
                </h2>
                <DualCopy
                  className="mt-2 text-el-xs leading-[1.6] text-el-fg-muted"
                  plain="Approving one action doesn’t give a blank check—your click unlocks that exact step once for 30 seconds, then locks right back up."
                  technical="Single-use 128-bit DEC-008 nonces bind cryptographically to SHA-256 arguments_hash and expire after 30s."
                />
              </Tilt3DCard>
            </RevealItem>

            <RevealItem className="h-full">
              <Tilt3DCard className="p-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.09em] text-el-accent">
                  RULE 03 · INSTANT BRAKES
                </span>
                <h2 className="mt-2.5 text-el-base font-medium text-el-fg">
                  0.05-Second Emergency Stop
                </h2>
                <DualCopy
                  className="mt-2 text-el-xs leading-[1.6] text-el-fg-muted"
                  plain="Press Ctrl+Alt+Shift+K (or say 'Eleven, stop everything') anytime to freeze speech and cancel tasks in the blink of an eye."
                  technical="Hardware-priority supervisor interrupt flushes DAC audio, revokes active nonces, and halts worker subprocess trees in <50ms."
                />
              </Tilt3DCard>
            </RevealItem>
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── INTERACTIVE 4 TRUST LEVELS + RECEIPT DEMO ── */}
        <Section>
          <ScrollReveal>
            <ColdRoomApprovalDemo />
          </ScrollReveal>
        </Section>

        <SignalBeamDivider />

        {/* ── 4 BUILT-IN PROTECTION SHIELDS ── */}
        <Section className="bg-el-bg-raised/45">
          <div className="max-w-[680px]">
            <p className="font-mono text-el-xs uppercase tracking-[0.1em] text-el-accent">
              FOUR BUILT-IN SAFETY SHIELDS
            </p>
            <WordReveal
              as="h2"
              text="Protected even if a tricky webpage tries to fool the AI."
              className="mt-3 text-el-3xl font-medium leading-[1.12] tracking-[-0.025em] text-el-fg"
            />
          </div>

          <ScrollReveal
            stagger={0.09}
            className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {FOUR_SHIELDS.map((p) => (
              <RevealItem key={p.code} className="h-full">
                <Tilt3DCard className="p-6 lg:p-7">
                  <span className="font-mono text-el-xs font-semibold text-el-accent">
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
                <p className="font-mono text-el-xs uppercase tracking-[0.1em] text-el-accent">
                  ACCIDENT PREVENTION
                </p>
                <h3 className="mt-2 text-el-xl font-medium text-el-fg">
                  Why blurting out &ldquo;Yes&rdquo; can never approve the wrong thing.
                </h3>
                <DualCopy
                  className="mt-3 text-el-xs leading-[1.65] text-el-fg-muted"
                  plain="Suppose two tasks finish at the same moment—one harmless, one deleting old files—and you say 'Yes!' out loud. Ordinary voice assistants might delete your files by mistake! Whenever there’s any ambiguity, ELEVEN asks you to name the specific action or click the clear button on screen."
                  technical="When concurrent Tier 2/3 approval gates or taint warnings exist, generic spoken affirmation is deterministically rejected in favor of explicit correlation-token binding or Cold-Room UI signature."
                />
              </Tilt3DCard>
            </RevealItem>

            <RevealItem className="lg:col-span-6">
              <Tilt3DCard className="p-7">
                <p className="font-mono text-el-xs uppercase tracking-[0.1em] text-el-accent">
                  COMPLETE TRANSPARENCY
                </p>
                <h3 className="mt-2 text-el-xl font-medium text-el-fg">
                  An uneditable activity log right on your computer.
                </h3>
                <DualCopy
                  className="mt-3 text-el-xs leading-[1.65] text-el-fg-muted"
                  plain="Every single step ELEVEN takes is written into a permanent local diary where entries are linked like chain links—nothing can ever be secretly erased or altered behind your back."
                  technical="Every TaskSpec, policy verdict, issued DEC-008 nonce, and execution receipt appends to a SHA-256 hash chain: entry_hash = SHA256(prev_hash || canonical_record)."
                />
                <div className="mt-6 flex flex-wrap gap-3">
                  <PortalActionButton variant="primary" arrow>
                    Test Approval Card in 3D Orb
                  </PortalActionButton>
                  <Button href="/research" variant="secondary">
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
