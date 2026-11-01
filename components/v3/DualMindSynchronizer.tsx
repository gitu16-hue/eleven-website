"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClarityMode } from "@/components/motion/PremiumMotion";

const VOICE_LATENCY_STAGES = [
  {
    plainLabel: "1. Notices You Stopped Speaking",
    techLabel: "Hybrid Silero VAD + Endpointing",
    budgetMs: 200,
    pct: 40,
    plainDetail: "Listens smoothly without cutting off your last word.",
    techDetail: "16kHz PCM 2s ring buffer + >30dB AEC + adaptive VAD policy.",
  },
  {
    plainLabel: "2. Turns Voice Into Words",
    techLabel: "Streaming / Candidate ASR",
    budgetMs: 100,
    pct: 20,
    plainDetail: "Transcribes in the background so listening never lags.",
    techDetail: "Non-blocking background worker snapshot; zero capture stall.",
  },
  {
    plainLabel: "3. Picks Quick or Deep Brain",
    techLabel: "Intent & Fast-Path Routing",
    budgetMs: 80,
    pct: 16,
    plainDetail: "Answers simple things fast; sends big jobs to the Planner.",
    techDetail: "System 1 immediate turn vs TaskHandoffEvent to J.A.R.V.I.S.",
  },
  {
    plainLabel: "4. Prepares Natural Voice",
    techLabel: "Neural TTS First-Frame",
    budgetMs: 90,
    pct: 18,
    plainDetail: "Starts generating speech right away, sentence by sentence.",
    techDetail: "Streaming sentence-chunked synthesis + Speculative Audio Bridge.",
  },
  {
    plainLabel: "5. Plays Through Speakers",
    techLabel: "WASAPI Audio Buffer Output",
    budgetMs: 30,
    pct: 6,
    plainDetail: "Instant sound, and stops in 0.05s if you interrupt.",
    techDetail: "Direct DAC output; <50ms waveOutReset barge-in flush.",
  },
];

interface SwarmCase {
  id: string;
  tabLabel: string;
  plainTitle: string;
  techTitle: string;
  verdict: "PROVEN SAFE" | "CONFLICT FLAGGED" | "FAKE BLOCKED";
  techVerdict: "ACCEPTED" | "UNRESOLVED [DISPUTED]" | "REJECTED";
  workers: {
    id: string;
    plainRole: string;
    plainClaim: string;
    techClaim: string;
    badge: string;
    tone: "good" | "warn" | "bad";
  }[];
  plainOutcome: string;
  techOutcome: string;
}

const SWARM_CASES: SwarmCase[] = [
  {
    id: "verified",
    tabLabel: "All Helpers Prove It",
    plainTitle: "Case 1: Independent Helpers Agree With Real Proof",
    techTitle: "Scenario A: Cryptographically Verified Convergence",
    verdict: "PROVEN SAFE",
    techVerdict: "ACCEPTED",
    workers: [
      {
        id: "Helper #1 (Code Checker)",
        plainRole: "worker-ast-01",
        plainClaim: "Checked every line: voice loop never freezes while transcribing.",
        techClaim: "speech_pipeline.py: 0 blocking transcribe() calls · Ed25519 VALID",
        badge: "Signed Proof",
        tone: "good",
      },
      {
        id: "Helper #2 (Test Runner)",
        plainRole: "worker-test-02",
        plainClaim: "Ran all 28 automated tests; every single test passed.",
        techClaim: "pytest suite: 28/28 passed · SHA-256:3f90…11e4 (TTL 22s)",
        badge: "Signed Proof",
        tone: "good",
      },
    ],
    plainOutcome:
      "Both helpers showed signed proof and agreed cleanly, so ELEVEN trusts the result and saves it.",
    techOutcome:
      "SwarmTournamentGate verifies Ed25519 signatures, SHA-256 digests, and <300s freshness TTL before memory promotion.",
  },
  {
    id: "disputed",
    tabLabel: "1 Helper Spots Danger",
    plainTitle: "Case 2: Three Say 'Fine,' One Finds a Problem (Why We Never Vote)",
    techTitle: "Scenario B: Conflicting Worker Claims (Zero Majority Voting)",
    verdict: "CONFLICT FLAGGED",
    techVerdict: "UNRESOLVED [DISPUTED]",
    workers: [
      {
        id: "Helpers #1, #2 & #3",
        plainRole: "3x Quick Scanners",
        plainClaim: "“Looks totally safe to us. No internet calls spotted.”",
        techClaim: "Static scan: 0 obvious outbound sockets · Ed25519 VALID",
        badge: "3 Say Safe",
        tone: "good",
      },
      {
        id: "Helper #4 (Network Monitor)",
        plainRole: "worker-sec-02",
        plainClaim: "“Hold on. When I ran it in a test box, it secretly pinged an external server.”",
        techClaim: "Sandbox trace: hidden DNS lookup on init · SHA-256:90d2…77c1",
        badge: "1 Spots Leak",
        tone: "warn",
      },
    ],
    plainOutcome:
      "If ELEVEN took a majority vote (3 vs 1), it would make a dangerous mistake. Instead, ELEVEN never votes on truth: it pauses and shows you the exact warning.",
    techOutcome:
      "Zero Majority Voting invariant: contradictory signed EvidencePackets are quarantined as UNRESOLVED [DISPUTED] and escalated.",
  },
  {
    id: "tampered",
    tabLabel: "Unverified Claim Blocked",
    plainTitle: "Case 3: An Unverified or Expired Report Tries to Sneak In",
    techTitle: "Scenario C: Stale or Forged Worker Artifact",
    verdict: "FAKE BLOCKED",
    techVerdict: "REJECTED",
    workers: [
      {
        id: "Unknown Helper #9",
        plainRole: "worker-ext-04",
        plainClaim: "“Trust me, everything passed 10 minutes ago.” (Missing security seal)",
        techClaim: "Ed25519:MISMATCH · TTL 412s > 300s freshness limit",
        badge: "Invalid Seal",
        tone: "bad",
      },
    ],
    plainOutcome:
      "Automatically dropped. Every helper report must carry a fresh cryptographic seal from the last 5 minutes, otherwise ELEVEN ignores it.",
    techOutcome:
      "Fail-closed deterministic rejection. Unsigned, digest-mismatched, or expired (>300s) packets are dropped immediately.",
  },
];

export function DualMindSynchronizer() {
  const { mode } = useClarityMode();
  const isPlain = mode === "plain";
  const [activeSwarmIdx, setActiveSwarmIdx] = useState<number>(1);
  const swarm = SWARM_CASES[activeSwarmIdx];

  return (
    <div className="space-y-10">
      {/* Part 1: Half-a-Second Natural Voice Speed Breakdown */}
      <div className="rounded-sm border border-el-border bg-el-bg-raised p-6 shadow-el-md lg:p-8">
        <div className="flex flex-col justify-between gap-3 border-b border-el-border pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-el-xs font-medium text-el-accent">
              {isPlain
                ? "Why talking to ELEVEN feels natural"
                : "System 1: Acoustic engineering target"}
            </p>
            <h3 className="mt-1 text-el-xl font-medium tracking-[-0.02em] text-el-fg">
              {isPlain
                ? "How ELEVEN Answers in Half a Second (Target: 0.5s)"
                : "<500ms Conversational Turn Budget & <50ms Hardware Barge-In"}
            </h3>
          </div>
          <span className="text-el-xs font-medium text-el-fg-faint">
            {isPlain
              ? "Blink of an eye: ~400ms"
              : "Design goal: 500ms total · 16kHz PCM"}
          </span>
        </div>

        {/* Animated Segmented Bar */}
        <div className="mt-6 flex h-3.5 w-full overflow-hidden rounded-full border border-el-border bg-el-bg">
          {VOICE_LATENCY_STAGES.map((st, idx) => (
            <motion.div
              key={st.techLabel}
              initial={{ width: 0 }}
              whileInView={{ width: `${st.pct}%` }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ opacity: 1 - idx * 0.13 }}
              className="border-r border-el-bg-raised bg-el-accent last:border-r-0"
              title={`${st.plainLabel}: ${st.budgetMs}ms`}
            />
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {VOICE_LATENCY_STAGES.map((st) => (
            <div
              key={st.techLabel}
              className="rounded-sm border border-el-border bg-el-bg p-4 transition-colors duration-200 hover:border-el-border-strong"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-el-sm font-semibold text-el-accent">
                  {st.budgetMs}ms
                </span>
                <span className="font-mono text-[10px] text-el-fg-faint">
                  {st.pct}%
                </span>
              </div>
              <p className="mt-1.5 text-el-xs font-medium leading-snug text-el-fg">
                {isPlain ? st.plainLabel : st.techLabel}
              </p>
              <p className="mt-1.5 text-[11.5px] leading-[1.5] text-el-fg-muted">
                {isPlain ? st.plainDetail : st.techDetail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: Proof Over Popularity Interactive Simulator */}
      <div className="rounded-sm border border-el-border bg-el-bg-raised p-6 shadow-el-md lg:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-el-border pb-5 md:flex-row md:items-end">
          <div>
            <p className="text-el-xs font-medium text-el-accent">
              {isPlain
                ? "How multiple AI helpers fact-check work"
                : "System 2: SwarmTournament evidence gate"}
            </p>
            <h3 className="mt-1 text-el-xl font-medium tracking-[-0.02em] text-el-fg">
              {isPlain
                ? "Proof Beats Popularity: Why ELEVEN Never Takes a Majority Vote"
                : "Cryptographic Evidence Adjudication: Zero Majority Voting"}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {SWARM_CASES.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveSwarmIdx(idx)}
                className={`cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-accent active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                  idx === activeSwarmIdx
                    ? "border-el-accent bg-el-accent text-el-bg shadow-el-sm"
                    : "border-el-border bg-el-bg text-el-fg-muted hover:border-el-border-strong hover:text-el-fg"
                }`}
              >
                {c.tabLabel}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${swarm.id}-${mode}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12"
          >
            <div className="space-y-3 lg:col-span-7">
              <p className="text-el-sm font-medium text-el-fg">
                {isPlain ? swarm.plainTitle : swarm.techTitle}
              </p>
              {swarm.workers.map((w) => (
                <div
                  key={w.id}
                  className="rounded-sm border border-el-border bg-el-bg p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-el-border pb-2">
                    <span className="text-el-xs font-semibold text-el-fg">
                      {isPlain ? w.id : w.plainRole}
                    </span>
                    <span
                      className={`rounded-sm px-2 py-0.5 text-[11px] font-medium ${
                        w.tone === "good"
                          ? "bg-el-accent-soft text-el-accent"
                          : w.tone === "warn"
                          ? "bg-[var(--el-status-warn-soft)] text-[var(--el-status-warn)]"
                          : "bg-[var(--el-status-danger-soft)] text-[var(--el-status-danger)]"
                      }`}
                    >
                      {w.badge}
                    </span>
                  </div>
                  <p className="mt-2.5 text-el-xs leading-relaxed text-el-fg">
                    {isPlain ? w.plainClaim : w.techClaim}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col justify-between rounded-sm border border-el-border-strong bg-el-bg p-5 lg:col-span-5">
              <div>
                <p className="text-el-xs font-medium text-el-fg-faint">
                  {isPlain ? "What ELEVEN decides" : "SwarmTournamentGate verdict"}
                </p>
                <p
                  className={`mt-2 inline-block rounded-sm px-3 py-1 text-el-xs font-medium ${
                    swarm.techVerdict === "ACCEPTED"
                      ? "bg-el-accent-soft text-el-accent"
                      : swarm.techVerdict.startsWith("UNRESOLVED")
                      ? "bg-[var(--el-status-warn-soft)] text-[var(--el-status-warn)]"
                      : "bg-[var(--el-status-danger-soft)] text-[var(--el-status-danger)]"
                  }`}
                >
                  {isPlain ? swarm.verdict : swarm.techVerdict}
                </p>
                <p className="mt-4 text-el-sm leading-[1.65] text-el-fg-muted">
                  {isPlain ? swarm.plainOutcome : swarm.techOutcome}
                </p>
              </div>

              <div className="mt-6 border-t border-el-border pt-3 text-[11px] font-medium text-el-fg-faint">
                {isPlain
                  ? "Rule: 4 guesses never beat 1 proven fact."
                  : "Invariant: Ed25519 + SHA-256 + 300s TTL · Zero Majority Vote"}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
