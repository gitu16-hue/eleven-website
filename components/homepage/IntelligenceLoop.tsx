"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClarityMode } from "@/components/motion/PremiumMotion";

const stages = [
  {
    num: "01",
    name: "Listen",
    techName: "Perceive",
    subPlain: "Hears you right away",
    subTech: "16kHz PCM + VAD",
    descPlain:
      "Hears your voice clearly—even if ELEVEN is already talking—and immediately pays attention.",
    descTech:
      "Captures 16kHz acoustic frames with >30dB echo cancellation and non-blocking candidate ASR snapshots.",
  },
  {
    num: "02",
    name: "Protect",
    techName: "Compile",
    subPlain: "Hides private info",
    subTech: "TaskSpec + Redaction",
    descPlain:
      "Sets clear rules on what’s allowed and scrubs out passwords or personal secrets before asking any AI.",
    descTech:
      "TaskCompiler stamps max authority tiers while DataMinimizer strips secrets and tags tainted external inputs.",
  },
  {
    num: "03",
    name: "Think",
    techName: "Reason",
    subPlain: "Drafts a smart plan",
    subTech: "Untrusted Proposal",
    descPlain:
      "Picks the best AI brain (on your PC or in the cloud) to suggest the next step—without touching your files yet.",
    descTech:
      "System 2 J.A.R.V.I.S. routes across local or frontier models to synthesize candidate ActionProposals with zero direct authority.",
  },
  {
    num: "04",
    name: "Verify",
    techName: "Gate",
    subPlain: "Checks safety rules",
    subTech: "Policy & DEC-008",
    descPlain:
      "Double-checks that the action is safe. If it’s important (like deleting or sending), it pauses and asks you.",
    descTech:
      "PolicyGate verifies path scopes, taint rules, and pauses Tier 2/3 actions for single-use SHA-256 bound Cold-Room nonces.",
  },
  {
    num: "05",
    name: "Do It",
    techName: "Execute",
    subPlain: "Runs in a safe room",
    subTech: "Sandboxed Worker",
    descPlain:
      "Carries out the approved task inside a locked workspace while keeping an instant Stop button ready.",
    descTech:
      "ExecutionController runs verified actions inside isolated worker sandboxes under <50ms hardware killswitch supervision.",
  },
  {
    num: "06",
    name: "Remember",
    techName: "Distill",
    subPlain: "Saves on your PC",
    subTech: "Sovereign Memory",
    descPlain:
      "Saves verified lessons privately on your own computer so ELEVEN gets smarter for you next time.",
    descTech:
      "SwarmTournamentGate verifies Ed25519 receipts before writing into loopback Redis, bi-temporal Neo4j, and Qdrant RRF.",
  },
];

export function IntelligenceLoop() {
  const { mode } = useClarityMode();
  const isPlain = mode === "plain";
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % stages.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [paused]);

  const currentStage = stages[active];

  return (
    <div
      className="relative w-full max-w-[450px] overflow-hidden rounded-sm border border-el-border bg-el-bg-raised p-5 shadow-el-md transition-shadow duration-300 hover:shadow-el-lg sm:p-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Header ── */}
      <div className="mb-4 flex items-center justify-between border-b border-el-border pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-el-accent animate-pulse" />
          <p className="font-mono text-el-xs uppercase tracking-[0.08em] text-el-fg-faint">
            {isPlain ? "How Every Request Flows" : "Governed Cognitive Cycle"}
          </p>
        </div>
        <span className="font-mono text-[11px] text-el-accent">
          STEP {currentStage.num} / 06
        </span>
      </div>

      {/* ── 01 - 06 Steps List ── */}
      <div className="relative flex flex-col gap-1">
        <div className="absolute top-4 bottom-4 left-[13px] w-[1px] bg-el-border" />

        <motion.div
          className="absolute left-[13px] w-[1px] bg-el-accent"
          style={{ height: "42px" }}
          animate={{ top: ["0%", "84%", "0%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {stages.map((stage, i) => {
          const isActive = i === active;
          const isCompleted = i < active;

          return (
            <button
              key={stage.num}
              type="button"
              onClick={() => setActive(i)}
              className="group relative flex w-full cursor-pointer items-center justify-between rounded px-2 py-2 text-left transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-el-accent focus-visible:outline-none"
            >
              {isActive && (
                <motion.span
                  layoutId="intelligenceLoopHighlight"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded bg-el-accent-soft/65"
                />
              )}

              <div className="relative z-10 flex items-center gap-3">
                <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                  {isActive && (
                    <motion.span
                      className="absolute h-5 w-5 rounded-full bg-el-accent/25 animate-ping"
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  )}
                  <span
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "scale-125 bg-el-accent"
                        : isCompleted
                        ? "bg-el-accent/60"
                        : "bg-el-border-strong"
                    }`}
                  />
                </div>

                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-el-sm transition-colors duration-200 ${
                      isActive
                        ? "font-medium text-el-fg"
                        : "text-el-fg-muted group-hover:text-el-fg"
                    }`}
                  >
                    {isPlain ? stage.name : stage.techName}
                  </span>
                  <span className="font-mono text-[11px] text-el-fg-faint">
                    {isPlain ? stage.subPlain : stage.subTech}
                  </span>
                </div>
              </div>

              <span
                className={`relative z-10 font-mono text-[11px] transition-colors duration-200 ${
                  isActive ? "font-medium text-el-accent" : "text-el-fg-faint/60"
                }`}
              >
                {stage.num}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Active Step Description Drawer ── */}
      <div className="mt-3 rounded border border-el-border bg-el-bg p-3.5 font-mono text-[11px]">
        <div className="flex items-center justify-between border-b border-el-border/50 pb-1.5 text-el-fg-faint">
          <span>STEP {currentStage.num}</span>
          <span className="uppercase text-el-accent">
            {isPlain ? currentStage.name : currentStage.techName}
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={`${currentStage.num}-${mode}`}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2 }}
            className="mt-2 font-sans text-el-xs leading-relaxed text-el-fg-muted"
          >
            {isPlain ? currentStage.descPlain : currentStage.descTech}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Loop Footer ── */}
      <div className="mt-3 flex items-center justify-between border-t border-el-border pt-2.5">
        <span className="font-mono text-[11px] text-el-fg-faint">
          {paused ? "Paused — move mouse away to resume" : "Click any step to inspect"}
        </span>
        <span className="font-mono text-[10px] uppercase text-el-accent">
          {isPlain ? "Safe & Automatic" : "SHA-256 Audited"}
        </span>
      </div>
    </div>
  );
}
