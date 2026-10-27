"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClarityMode } from "@/components/motion/PremiumMotion";

interface TierSpec {
  tier: string;
  plainLevel: string;
  labelPlain: string;
  labelTech: string;
  modePlain: string;
  modeTech: string;
  examplesPlain: string;
  plainActionTitle: string;
  toolName: string;
  plainWhatHappens: string;
  canonicalArgs: string;
  argsHash: string;
  blastRadiusPlain: string;
  blastRadiusTech: string;
  cautionNotePlain: string;
  taintStatusTech: string;
  requiresColdRoom: boolean;
}

const TIERS: TierSpec[] = [
  {
    tier: "TIER 0",
    plainLevel: "LEVEL 0",
    labelPlain: "Just Reading & Looking",
    labelTech: "Read-Only Observation",
    modePlain: "Happens Automatically · Zero Interruptions",
    modeTech: "Autonomous · Zero Friction",
    examplesPlain: "Reading your notes, checking calendar dates, searching project files",
    plainActionTitle: "Read file: Architecture_Notes.md",
    toolName: "workspace.read_file",
    plainWhatHappens:
      "Opens your document to read it. Cannot change, delete, or send anything online.",
    canonicalArgs: '{"path":"docs/Architecture_Notes.md","mode":"read_only"}',
    argsHash: "sha256:4d918b0c77e12a98b3c19f08a1d77c89",
    blastRadiusPlain: "Changes 0 files · Sends 0 bytes to the internet",
    blastRadiusTech: "0 files mutated · 0 bytes network egress · Local loopback only",
    cautionNotePlain: "100% Safe — Direct request from you",
    taintStatusTech: "CLEAN (Trusted Workspace Root)",
    requiresColdRoom: false,
  },
  {
    tier: "TIER 1",
    plainLevel: "LEVEL 1",
    labelPlain: "Safe Reversible Drafts",
    labelTech: "Reversible Local Mutation",
    modePlain: "Happens Smoothly + Easy Undo Saved",
    modeTech: "Autonomous + Differential Audit",
    examplesPlain: "Writing a draft note, editing code in a scratch folder, running local tests",
    plainActionTitle: "Save draft changes to speech_pipeline.py",
    toolName: "workspace.apply_patch",
    plainWhatHappens:
      "Updates 14 lines in your project file—with an automatic backup so you can undo in one click.",
    canonicalArgs: '{"path":"src/eleven/voice/speech_pipeline.py","lines_changed":14}',
    argsHash: "sha256:9f03c4e21a6d58b09c3a71e2554f18d2",
    blastRadiusPlain: "Edits 1 project file · Instant undo available",
    blastRadiusTech: "1 tracked workspace file · Reversible via git worktree snapshot",
    cautionNotePlain: "Checked by ELEVEN’s built-in code inspector",
    taintStatusTech: "CLEAN · Protocol B AST Differential Audit Passed",
    requiresColdRoom: false,
  },
  {
    tier: "TIER 2",
    plainLevel: "LEVEL 2",
    labelPlain: "Important Real-World Actions",
    labelTech: "Destructive, External, or Costly",
    modePlain: "Pauses First · Needs Your 1-Click Approval",
    modeTech: "Explicit DEC-008 Nonce Required (30s TTL)",
    examplesPlain: "Deleting files, sending an email, publishing code online, spending money",
    plainActionTitle: "Publish branch 'release/v3.1' to GitHub",
    toolName: "git.push_remote_branch",
    plainWhatHappens:
      "Uploads your new code update to GitHub so your team can see it.",
    canonicalArgs: '{"remote":"origin","branch":"release/v3.1","force":false}',
    argsHash: "sha256:e83a91c04f29b17d662e8a05c31b4900",
    blastRadiusPlain: "Connects to github.com · Updates shared team branch",
    blastRadiusTech: "Outbound HTTPS egress to github.com · Updates shared remote ref",
    cautionNotePlain: "Heads-up: Triggered while reading an external webpage comment",
    taintStatusTech: "TAINT_WARN — Context includes external PR comment (#412)",
    requiresColdRoom: true,
  },
  {
    tier: "TIER 3",
    plainLevel: "LEVEL 3",
    labelPlain: "Master Security & Vault Settings",
    labelTech: "System / Security / Sovereign Vault",
    modePlain: "Extra Safety Pause + PIN / Biometric Check",
    modeTech: "High-Assurance Auth + Cooling-Off Delay",
    examplesPlain: "Exporting your private memory backup, changing safety rules, system settings",
    plainActionTitle: "Export encrypted personal memory backup to USB drive",
    toolName: "vault.export_sovereign_snapshot",
    plainWhatHappens:
      "Copies your encrypted memory vault onto an external backup drive.",
    canonicalArgs: '{"target":"/External_Drive/eleven_vault.enc","cipher":"AES-256-GCM"}',
    argsHash: "sha256:71b04e99c2a8f310d445c8b219f0e6a3",
    blastRadiusPlain: "Copies encrypted memory archive outside this computer",
    blastRadiusTech: "Exports encrypted 4-tier personal memory graph outside loopback host",
    cautionNotePlain: "Requires 5-second safety pause + your direct confirmation",
    taintStatusTech: "CRITICAL GATE — 5s cooling-off lock + DEC-008 nonce + PIN",
    requiresColdRoom: true,
  },
];

type DecisionState =
  | "AWAITING_DECISION"
  | "NONCE_ISSUED"
  | "QUARANTINED"
  | "AMBIGUOUS_VOICE_REJECTED"
  | "KILLSWITCH_HALTED";

export function ColdRoomApprovalDemo() {
  const { mode } = useClarityMode();
  const isPlain = mode === "plain";

  const [selectedTierIdx, setSelectedTierIdx] = useState<number>(2);
  const [decision, setDecision] = useState<DecisionState>("AWAITING_DECISION");

  const activeTier = TIERS[selectedTierIdx];

  const handleSelectTier = (idx: number) => {
    setSelectedTierIdx(idx);
    setDecision(TIERS[idx].requiresColdRoom ? "AWAITING_DECISION" : "NONCE_ISSUED");
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left 5 columns: 4 Everyday Trust Levels */}
      <div className="space-y-3 lg:col-span-5">
        <div className="mb-4">
          <p className="font-mono text-el-xs uppercase tracking-[0.1em] text-el-accent">
            {isPlain ? "4 SIMPLE TRUST LEVELS" : "DEC-003 PERMISSION MATRIX"}
          </p>
          <h3 className="mt-1 text-el-xl font-medium tracking-[-0.02em] text-el-fg">
            {isPlain
              ? "Fast When Safe. Careful When It Matters."
              : "Graduated Authority Tiers"}
          </h3>
          <p className="mt-2 text-el-xs leading-[1.6] text-el-fg-muted">
            {isPlain
              ? "Click any level below to see when ELEVEN works on its own—and when it pauses to show you an honest receipt first."
              : "Select an authority tier to inspect how PolicyGate and Protocol D Cold-Room verification govern execution."}
          </p>
        </div>

        {TIERS.map((t, idx) => {
          const isSelected = idx === selectedTierIdx;
          return (
            <button
              key={t.tier}
              type="button"
              onClick={() => handleSelectTier(idx)}
              className={`relative w-full cursor-pointer rounded-sm border p-4 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-el-accent ${
                isSelected
                  ? "border-el-accent bg-el-bg-raised shadow-el-sm"
                  : "border-el-border bg-el-bg hover:border-el-border-strong hover:bg-el-bg-raised/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-el-xs font-semibold text-el-accent">
                  {isPlain ? t.plainLevel : t.tier} ·{" "}
                  {isPlain ? t.labelPlain : t.labelTech}
                </span>
                <span
                  className={`rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase ${
                    t.requiresColdRoom
                      ? "bg-[var(--el-status-warn-soft)] text-[var(--el-status-warn)]"
                      : "bg-el-accent-soft text-el-accent"
                  }`}
                >
                  {t.requiresColdRoom
                    ? isPlain
                      ? "Asks You First"
                      : "Cold-Room Gate"
                    : isPlain
                    ? "Automatic"
                    : "Autonomous"}
                </span>
              </div>
              <p className="mt-1.5 text-el-xs font-medium text-el-fg">
                {isPlain ? t.modePlain : t.modeTech}
              </p>
              <p className="mt-1 text-el-xs leading-[1.5] text-el-fg-faint">
                {t.examplesPlain}
              </p>
            </button>
          );
        })}
      </div>

      {/* Right 7 columns: Interactive Honest Approval Receipt */}
      <div className="lg:col-span-7">
        <div className="rounded-sm border border-el-border-strong bg-el-bg-raised p-6 shadow-el-md lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-el-border pb-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-el-accent">
                {isPlain
                  ? "HONEST SAFETY RECEIPT (TRY CLICKING THE BUTTONS BELOW)"
                  : "PROTOCOL D · COLD-ROOM VERIFICATION SURFACE (DEC-008)"}
              </p>
              <h4 className="mt-1 text-el-lg font-medium text-el-fg">
                {isPlain ? activeTier.plainActionTitle : activeTier.toolName}
              </h4>
            </div>
            <span className="rounded-sm border border-el-accent/30 bg-el-accent-soft px-2.5 py-1 font-mono text-[11px] text-el-accent">
              {isPlain ? "AI SALES-TALK HIDDEN" : "LLM PROSE QUARANTINED"}
            </span>
          </div>

          {/* Beginner Explanation Banner */}
          <div className="mt-4 rounded-sm border border-el-border bg-el-bg px-4 py-3 text-el-xs leading-relaxed text-el-fg-muted">
            {isPlain ? (
              <>
                <strong className="font-medium text-el-fg">
                  Why this card looks like a bank receipt:
                </strong>{" "}
                If an AI makes a mistake, it might try to sound confident so you click &ldquo;OK.&rdquo; ELEVEN hides the AI&rsquo;s smooth-talking explanation and shows you the{" "}
                <strong className="text-el-fg">exact facts verified by your own computer</strong>.
              </>
            ) : (
              <>
                <strong className="font-medium text-el-fg">
                  Cold-Room Guarantee:
                </strong>{" "}
                Model explanations and persuasive phrasing are stripped. Only host-computed canonical parameters, SHA-256 digests, and static taint provenance are rendered.
              </>
            )}
          </div>

          {/* Receipt Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTier.tier}-${mode}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="mt-5 space-y-3"
            >
              <div className="rounded-sm border border-el-border bg-el-bg p-3.5">
                <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-el-fg-faint">
                  {isPlain ? "What Will Actually Happen" : "Canonical Arguments"}
                </span>
                <p className="mt-1 text-el-sm font-medium text-el-fg">
                  {isPlain ? activeTier.plainWhatHappens : activeTier.canonicalArgs}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-sm border border-el-border bg-el-bg p-3.5">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-el-fg-faint">
                    {isPlain ? "Real-World Impact" : "Verified Blast Radius"}
                  </span>
                  <span className="mt-1 block text-el-xs text-el-fg">
                    {isPlain
                      ? activeTier.blastRadiusPlain
                      : activeTier.blastRadiusTech}
                  </span>
                </div>

                <div className="rounded-sm border border-el-border bg-el-bg p-3.5">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-el-fg-faint">
                    {isPlain ? "Safety Source Check" : "Protocol A Taint Provenance"}
                  </span>
                  <span
                    className={`mt-1 block text-el-xs font-medium ${
                      activeTier.taintStatusTech.includes("WARN")
                        ? "text-[var(--el-status-warn)]"
                        : "text-el-accent"
                    }`}
                  >
                    {isPlain
                      ? activeTier.cautionNotePlain
                      : activeTier.taintStatusTech}
                  </span>
                </div>
              </div>

              <div className="rounded-sm border border-el-border bg-el-bg p-3.5 font-mono text-el-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-[0.08em] text-el-fg-faint">
                    {isPlain
                      ? "Tamper-Proof Pass (Valid 30s, Works Once)"
                      : "Single-Use DEC-008 Cryptographic Nonce"}
                  </span>
                  <span className="text-el-accent">{activeTier.argsHash}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Interactive Operator Action Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-el-border pt-5">
            <button
              type="button"
              onClick={() => setDecision("NONCE_ISSUED")}
              className="cursor-pointer rounded-sm bg-el-fg px-4 py-2 font-mono text-el-xs text-el-bg transition-colors hover:bg-el-accent"
            >
              {activeTier.requiresColdRoom
                ? "✓ Approve Exact Action"
                : "✓ Run Automatically"}
            </button>
            <button
              type="button"
              onClick={() => setDecision("AMBIGUOUS_VOICE_REJECTED")}
              className="cursor-pointer rounded-sm border border-el-border-strong bg-el-bg px-3.5 py-2 font-mono text-el-xs text-el-fg transition-colors hover:border-el-fg"
            >
              🎤 Try Saying Casual &ldquo;Yes&rdquo;
            </button>
            <button
              type="button"
              onClick={() => setDecision("QUARANTINED")}
              className="cursor-pointer rounded-sm border border-el-border-strong bg-el-bg px-3.5 py-2 font-mono text-el-xs text-el-fg-muted transition-colors hover:text-el-fg"
            >
              ✕ Block It
            </button>
            <button
              type="button"
              onClick={() => setDecision("KILLSWITCH_HALTED")}
              className="cursor-pointer rounded-sm border border-[var(--el-status-danger)]/40 bg-[var(--el-status-danger-soft)] px-3.5 py-2 font-mono text-el-xs text-[var(--el-status-danger)] transition-opacity hover:opacity-90"
            >
              ■ Emergency Stop
            </button>
          </div>

          {/* Live Feedback Banner */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTier.tier}-${decision}-${mode}`}
              initial={{ opacity: 0, scale: 0.985, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.985, y: -4 }}
              transition={{ duration: 0.18 }}
              className="mt-4 rounded-sm border border-el-border bg-el-bg px-4 py-3 text-el-xs leading-relaxed"
            >
              {decision === "AWAITING_DECISION" && (
                <p className="text-[var(--el-status-warn)]">
                  <strong>⏸ Waiting safely for you:</strong> Nothing has happened yet! Until you click Approve within 30 seconds, the AI cannot push or change anything.
                </p>
              )}
              {decision === "NONCE_ISSUED" && (
                <p className="text-el-accent">
                  <strong>✓ Completed safely:</strong> Your one-time pass unlocked this exact action (and expired immediately so it can never be reused). A permanent receipt was saved to your activity log.
                </p>
              )}
              {decision === "AMBIGUOUS_VOICE_REJECTED" && (
                <p className="text-[var(--el-status-warn)]">
                  <strong>🛡 Casual &ldquo;Yes&rdquo; blocked for your safety:</strong> What if two tasks asked at the same time, and you approved the wrong one by accident? For important actions, ELEVEN requires naming the specific task or clicking Approve on screen.
                </p>
              )}
              {decision === "QUARANTINED" && (
                <p className="text-el-fg-muted">
                  <strong>✕ Blocked cleanly:</strong> Request thrown away with zero changes to your files.
                </p>
              )}
              {decision === "KILLSWITCH_HALTED" && (
                <p className="text-[var(--el-status-danger)]">
                  <strong>■ Instant Emergency Stop (0.05s):</strong> Voice silenced immediately, pending passes cancelled, and all background helpers stopped!
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
