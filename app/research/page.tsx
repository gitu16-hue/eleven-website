import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PortalActionButton } from "@/components/v3/PortalActionButton";
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
  GenesisTimelineList,
} from "@/components/motion/GenesisMotionEngine";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";

export const metadata: Metadata = {
  title: "Our Promises & Research: 15 Safety Rules | ELEVEN v3",
  description:
    "How GISHH Labs tests ELEVEN before shipping: four research breakthroughs, 15 unbreakable safety rules, and honest promises without AI hype.",
  alternates: {
    canonical: "/research",
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
      name: "Research & Safety",
      item: "https://eleven-website-self.vercel.app/research",
    },
  ],
};

const RESEARCH_PILLARS = [
  {
    id: "01 · Smooth Listening",
    status: "Verified in lab tests",
    plainTitle: "Listening That Never Stutters While Transcribing",
    techTitle: "Non-Blocking Candidate ASR & Speculative Audio Bridge",
    plainBody:
      "We discovered that many voice assistants lag because transcribing words blocks the microphone stream. We moved word-checking into a separate background snapshot, so listening stays instant and never cuts off your last word.",
    techBody:
      "Eliminates synchronous recognizer contention from SpeechPipeline._ingestion_loop via immutable PCM snapshots, turn-epoch invalidation, and conservative 380ms VAD fallback.",
  },
  {
    id: "02 · Fact Verification",
    status: "Built into v3.1",
    plainTitle: "Why Four Guesses Never Beat One Proven Fact",
    techTitle: "SwarmTournament Adjudication Without Majority Voting",
    plainBody:
      "When AI helpers vote on an answer, they often share the same blind spot and vote wrong together. ELEVEN checks cryptographic proof instead, and if even one helper spots a real problem, it alerts you right away.",
    techBody:
      "Verifies Ed25519 worker signatures, SHA-256 digests, and <=300s freshness windows, quarantining contradictory claims as unverified rather than averaging.",
  },
  {
    id: "03 · Human Oversight",
    status: "Active protection",
    plainTitle: "Stopping AI From Talking You Into Bad Clicks",
    techTitle: "Untrusted Model Quarantine & Cold-Room Verification",
    plainBody:
      "Smart AI models are skilled writers, which makes it dangerous if they write their own permission popups. ELEVEN strips AI explanations out of approval cards so you only judge real, verified facts.",
    techBody:
      "Protocol D eliminates untrusted LLM prose from Tier 2/3 surfaces, binding 128-bit single-use nonces directly to canonical parameter SHA-256 digests.",
  },
  {
    id: "04 · Local Memory",
    status: "Local-first vault",
    plainTitle: "Memory That Remembers Both 'What' and 'When'",
    techTitle: "Bi-Temporal Knowledge Graphs & Hybrid RRF Search",
    plainBody:
      "Your life changes: you move cities, switch projects, update goals. Instead of overwriting old memories and getting confused, ELEVEN keeps a clear timeline privately on your computer.",
    techBody:
      "Loopback Neo4j valid_time vs transaction_time tracking paired with Qdrant dense + BM25 Reciprocal Rank Fusion (k = 60) inside an AES-256-GCM Vault.",
  },
];

const FIFTEEN_PROMISES = [
  "AI models never get direct keys to your files, internet, or memory.",
  "Every single action passes through 5 automatic safety checkpoints.",
  "An AI can never upgrade its own permission level mid-task.",
  "Passwords and private keys are automatically hidden before cloud calls.",
  "Untrusted emails and webpages get 'Caution' tags so they cannot sneak commands.",
  "Important actions pause for a one-time, 30-second approval pass.",
  "Approval receipts show real facts verified by your PC, never AI sales talk.",
  "A casual spoken 'Yes' is blocked whenever two important tasks could get mixed up.",
  "Live listening never freezes while words are being transcribed in the background.",
  "Interrupting mid-sentence silences ELEVEN in under 0.05 seconds.",
  "Background helper reports must carry a fresh security seal to be trusted.",
  "ELEVEN never takes a majority vote on facts: conflicts are shown to you honestly.",
  "Your personal memory drawers live encrypted on your own computer (127.0.0.1).",
  "Every action is recorded in a tamper-proof local diary you can inspect anytime.",
  "Your Emergency Stop shortcut halts speech, passes, and helpers immediately.",
];

const HONEST_TRUTHS = [
  {
    title: "Speed Targets Depend on Your Computer Hardware",
    plain:
      "Our half-second (<0.5s) voice reply and 0.05s stop speed are engineering targets tested on modern PCs. Older laptops or heavy background apps can take slightly longer, and we never enable experimental speed shortcuts until safety tests pass 100%.",
    tech:
      "<500ms turn and <50ms barge-in are empirical design goals dependent on host WASAPI scheduling and local ASR load; adaptive fast-VAD remains feature-flagged off by default.",
  },
  {
    title: "Stronger Safety Walls: Not Magic Invincibility",
    plain:
      "Locking AI inside sandboxes dramatically protects you from accidents and tricky websites, just like seatbelts and airbags; though no software on earth can promise magic immunity if a computer itself already has a virus.",
    tech:
      "Process confinement, canonical root checks, and default-deny egress drastically shrink blast radius without claiming mathematical immunity against host OS kernel zero-days.",
  },
  {
    title: "When Helpers Disagree, ELEVEN Asks You Instead of Guessing",
    plain:
      "Rather than pretending to know everything, ELEVEN prefers honesty: if two verified tools find conflicting facts, it pauses and shows you both sides clearly.",
    tech:
      "SwarmTournamentGate halts automatic synthesis upon signed evidence contradiction and escalates the exact discrepancy to the human operator.",
  },
];

export default function ResearchPage() {
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
          <GenesisSubpageHeroBackdrop />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-el-border/60">
              <Breadcrumbs
                items={[
                  { label: "Our Promises", href: "/research" },
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
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83] motion-safe:animate-pulse motion-reduce:animate-none shadow-[0_0_8px_#10bc83]" />
                <CipherText text="Scientific Rigor & Honest Architecture · Zero AI Hype" />
              </div>

              <h1 className="el-h1">
                <WordReveal text="Tested rigorously. Explained without AI hype." />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="The AI world is full of exaggerated buzzwords. At GISHH Labs, we test every feature in offline stress tests first, follow 15 unbreakable safety rules, and tell you plainly both what ELEVEN does and what its limits are."
                technical="Architectural changes at GISHH Labs earn rollout authorization only after passing offline causality audits, adversarial taint evaluations, and tail-latency benchmarks."
              />

              <GenesisBubbleRow className="flex flex-wrap gap-2.5 pt-2 text-xs">
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  <span>15 constitutional invariants</span>
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  <span>Formal threat matrix</span>
                </li>
                <li className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00b38c]" />
                  <span>Empirical benchmark disclosure</span>
                </li>
              </GenesisBubbleRow>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button href="/security" variant="primary" arrow>
                  Inspect Threat Model &amp; Invariants
                </Button>
                <Button href="/benchmarks/voice-latency" variant="secondary" arrow>
                  Voice Latency Targets (&lt;50ms)
                </Button>
              </div>
            </GenesisHeroIntro>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── 4 RESEARCH BREAKTHROUGHS ── */}
        <Section id="audit-trail" className="relative py-16 lg:py-24">
          <GenesisSectionIntro className="max-w-3xl space-y-4 mb-10">
            <div className="gfx-badge">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              <CipherText text="01 · Four Research Breakthroughs" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="Four real-world problems we engineered out of personal AI." />
            </h2>
            <DualCopy
              className="el-body"
              plain="From halting runaway commands to preventing forgotten memories, here are four engineering breakthroughs built into ELEVEN."
              technical="Addressing prompt injection taint, split-second acoustic barge-in, bi-temporal memory graph drift, and proof verification."
            />
          </GenesisSectionIntro>

          <GenesisStaggerGrid
            from="center"
            stagger={0.09}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {RESEARCH_PILLARS.map((t) => (
              <Tilt3DCard key={t.id} className="p-7 h-full">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-el-border pb-3">
                  <span className="text-xs font-medium text-[#10bc83]">
                    {t.id}
                  </span>
                  <span className="rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] text-el-fg-muted border border-el-border/60">
                    {t.status}
                  </span>
                </div>
                <DualCopy
                  as="div"
                  className="mt-4 text-lg font-normal heading-gradient"
                  plain={t.plainTitle}
                  technical={t.techTitle}
                />
                <DualCopy
                  className="mt-2 text-xs leading-relaxed text-el-fg-muted"
                  plain={t.plainBody}
                  technical={t.techBody}
                />
              </Tilt3DCard>
            ))}
          </GenesisStaggerGrid>
        </Section>

        <SignalBeamDivider />

        {/* ── 15 UNBREAKABLE PROMISES ── */}
        <Section id="rules" className="relative py-16 lg:py-24">
          <GenesisSectionIntro className="max-w-3xl space-y-4 mb-10">
            <div className="gfx-badge">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              <CipherText text="02 · Safety Constitution" />
            </div>
            <h2 className="el-h2">
              <WordReveal text="15 safety rules ELEVEN is never allowed to break." />
            </h2>
            <p className="text-base leading-relaxed text-el-fg-muted">
              Written in plain English: no speed shortcut or new feature may ever violate these fifteen promises.
            </p>
          </GenesisSectionIntro>

          <GenesisStaggerGrid
            from="start"
            stagger={0.04}
            className="grid grid-cols-1 gap-3.5 md:grid-cols-3"
          >
            {FIFTEEN_PROMISES.map((rule, i) => (
              <Tilt3DCard key={rule} className="p-5 h-full">
                <span className="text-xs font-medium text-[#10bc83]">
                  Rule {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-xs leading-relaxed text-el-fg">
                  {rule}
                </p>
              </Tilt3DCard>
            ))}
          </GenesisStaggerGrid>

          <div className="mt-8 flex justify-end">
            <Button href="/security" variant="ghost" arrow>
              Inspect Mathematical Invariant Conditions &amp; Threat Model
            </Button>
          </div>
        </Section>

        <SignalBeamDivider />

        {/* ── HONEST LIMITS (NO OVERCLAIMING) ── */}
        <Section className="py-16 lg:py-24">
          <GenesisSplitReveal
            className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start"
            leftClassName="lg:col-span-5"
            rightClassName="lg:col-span-7"
            offset={64}
            left={
              <GenesisSectionIntro className="space-y-4">
                <div className="gfx-badge">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  <CipherText text="03 · Engineering Boundaries" />
                </div>
                <h2 className="el-h2">
                  <WordReveal text="What we refuse to exaggerate." />
                </h2>
                <p className="text-base leading-relaxed text-el-fg-muted">
                  Real engineering means being upfront about boundaries, not pretending software is magic.
                </p>
                <div className="pt-4 flex flex-wrap gap-3">
                  <PortalActionButton variant="primary" arrow>
                    Explore Live 3D Orb
                  </PortalActionButton>
                  <Button href="/" variant="secondary">
                    Back to Home
                  </Button>
                </div>
              </GenesisSectionIntro>
            }
            right={
              <GenesisTimelineList mode="timeline" className="space-y-4">
                {HONEST_TRUTHS.map((nc) => (
                  <li key={nc.title} className="gfx-timeline__item">
                    <Tilt3DCard className="p-6">
                      <h3 className="text-el-lg font-normal heading-gradient">
                        {nc.title}
                      </h3>
                      <DualCopy
                        className="mt-2 text-el-xs leading-[1.65] text-el-fg-muted"
                        plain={nc.plain}
                        technical={nc.tech}
                      />
                    </Tilt3DCard>
                  </li>
                ))}
              </GenesisTimelineList>
            }
          />
        </Section>

        <SignalBeamDivider />

        {/* ── CLOSING OBSIDIAN CTA STAGE ── */}
        <Section className="py-20">
          <GenesisCtaStage
            badge="04 · Constitutional AI Verification"
            title="Verify the architecture before trusting the claims."
            description="Inspect our formal threat model, simulate ActionProposal isolation gates live, or benchmark voice barge-in latency on your own hardware."
            actions={
              <>
                <Button href="/security" variant="primary" arrow className="w-full sm:w-auto">
                  Explore Threat Model
                </Button>
                <Button href="/tools/inspector" variant="secondary" arrow className="w-full sm:w-auto">
                  Test Policy Sandbox
                </Button>
                <PortalActionButton variant="ghost" arrow className="w-full sm:w-auto">
                  Enter Live 3D Portal
                </PortalActionButton>
              </>
            }
          />
        </Section>
      </main>

      <Footer />
    </>
  );
}
