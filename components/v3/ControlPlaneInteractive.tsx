"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClarityMode } from "@/components/motion/PremiumMotion";

interface StageSpec {
  num: string;
  id: string;
  plainTitle: string;
  moduleName: string;
  trustZone: "TRUSTED" | "AI_BOX";
  plainSummary: string;
  techSummary: string;
  realExampleBefore: string;
  realExampleAfter: string;
  inputSchema: string;
  outputSchema: string;
  plainPoints: string[];
  techPoints: string[];
}

const CONTROL_PLANE_STAGES: StageSpec[] = [
  {
    num: "01",
    id: "task-compiler",
    plainTitle: "Set the Ground Rules",
    moduleName: "TaskCompiler",
    trustZone: "TRUSTED",
    plainSummary:
      "When you ask ELEVEN for help, your computer first locks in clear rules: which folders it may open, how much it may do on its own, and where it must stop and ask you.",
    techSummary:
      "Compiles raw voice or text intent into an immutable TaskSpec, stamps maximum authority tier ceilings, and binds an explicit budget before any model sees the request.",
    realExampleBefore: "You say: “Summarize my Q3 taxes folder.”",
    realExampleAfter:
      "Rule stamped: Read-only inside /Documents/Taxes. Deleting or emailing is locked OFF.",
    inputSchema: "UserUtterance | TextIntent + ActiveSessionScope",
    outputSchema: "Immutable<TaskSpec> { task_id, max_tier, egress_budget, allowed_roots }",
    plainPoints: [
      "The AI can never give itself extra permissions later on.",
      "Read-only questions don’t even unlock editing or deleting tools.",
      "Every separate task gets its own ID tag so nothing gets mixed up.",
    ],
    techPoints: [
      "Authority ceiling is fixed at compile time and cannot be escalated by model output.",
      "Concurrent active tasks receive distinct correlation IDs to prevent ambiguous confirmation.",
      "Read-only queries compile directly to Tier 0 without exposing write-capable tool schemas.",
    ],
  },
  {
    num: "02",
    id: "data-minimizer",
    plainTitle: "Hide Private Secrets",
    moduleName: "DataMinimizer",
    trustZone: "TRUSTED",
    plainSummary:
      "Before sending a question to an AI brain, ELEVEN automatically blacks out passwords, API keys, bank numbers, and private details—just like redacting a classified document.",
    techSummary:
      "Strips secrets, redacts PII, applies Protocol A taint labels to external documents, and enforces Protocol C outbound session egress budgets prior to model dispatch.",
    realExampleBefore: "Draft contains: sk-live-9942… and your home address.",
    realExampleAfter:
      "Scrubbed cleanly to [REDACTED_KEY] before any cloud AI ever sees it.",
    inputSchema: "TaskSpec + RawWorkspaceSlices + SovereignMemoryHits",
    outputSchema: "SanitizedContext { redacted_payload, taint_map, byte_count <= quota }",
    plainPoints: [
      "Passwords, secret tokens, and private keys are stripped automatically.",
      "Untrusted emails or web pages get flagged with a 'Caution' sticker.",
      "Strict data limits stop anyone from sneaking large files out.",
    ],
    techPoints: [
      "Environment credentials, bearer tokens, and vault keys are deterministically scrubbed.",
      "Untrusted external files or web payloads carry immutable TAINTED provenance tags.",
      "Cumulative outbound payload bytes are metered against hard per-session egress caps.",
    ],
  },
  {
    num: "03",
    id: "model-router",
    plainTitle: "Ask the AI (Inside a Safe Box)",
    moduleName: "ModelRouter",
    trustZone: "AI_BOX",
    plainSummary:
      "Now the AI brain (Claude, GPT, DeepSeek, or a private AI on your own computer) thinks hard and writes a suggested plan. Crucially, the AI sits in a locked glass room—it cannot touch a single file directly.",
    techSummary:
      "Routes sanitized context across local models (Ollama/NIM) or frontier cloud providers. Models emit candidate ActionProposals with zero execution handles.",
    realExampleBefore: "AI thinks through the problem…",
    realExampleAfter:
      "AI hands over a written Request Slip: “Create summary.md in /Documents/Taxes.”",
    inputSchema: "SanitizedContext + ConstrainedToolDescriptors",
    outputSchema: "Untrusted<ActionProposal> { tool_id, raw_args, rationale_untrusted }",
    plainPoints: [
      "AI models have zero direct access to your hard drive, internet, or terminal.",
      "You can swap between Claude, GPT, or offline local models anytime.",
      "Even if a malicious website tricks the AI, the AI still can’t act on its own.",
    ],
    techPoints: [
      "Frontier and local LLMs possess zero OS sockets, zero filesystem handles, and zero memory-write keys.",
      "Model prose is quarantined as untrusted rationale and never rendered inside Cold-Room approval cards.",
      "Provider failover preserves identical TaskSpec authority ceilings across local and cloud backends.",
    ],
  },
  {
    num: "04",
    id: "policy-gate",
    plainTitle: "Safety Inspector Checks the Slip",
    moduleName: "PolicyGate",
    trustZone: "TRUSTED",
    plainSummary:
      "ELEVEN’s built-in deterministic inspector examines the AI’s request slip line by line. Safe everyday work passes right through; risky actions (like deleting files or sending emails) are paused for your OK.",
    techSummary:
      "Deterministic host verifier inspecting candidate ActionProposals against DEC-003 4-Tier permissions, canonicalized path scopes, taint propagation rules, and Protocol B differential checks.",
    realExampleBefore: "Inspector checks: Is /Documents/Taxes/summary.md safe?",
    realExampleAfter:
      "Safe new draft → Approved! (If it tried deleting files → Paused to ask you first.)",
    inputSchema: "Untrusted<ActionProposal> + Immutable<TaskSpec> + TaintMap",
    outputSchema: "PolicyVerdict { ALLOW_AUTONOMOUS | REQUIRE_DEC008_NONCE | DENY_CLOSED }",
    plainPoints: [
      "Blocks sneaky attempts to reach folders outside your project.",
      "Stops untrusted web links from triggering dangerous commands.",
      "Creates a tamper-proof fingerprint of the exact action for your review.",
    ],
    techPoints: [
      "Tainted context attempting Tier 2/3 side effects triggers mandatory escalation or deterministic block.",
      "Path traversal, symlink escapes, and unapproved network destinations fail closed.",
      "Computes canonical SHA-256 arguments_hash over normalized tool parameters.",
    ],
  },
  {
    num: "05",
    id: "execution-controller",
    plainTitle: "Run Safely & Keep a Receipt",
    moduleName: "ExecutionController",
    trustZone: "TRUSTED",
    plainSummary:
      "Once cleared (or approved by you with a one-time 30-second pass), ELEVEN completes the task inside a protected workspace and writes a permanent receipt in your private activity log.",
    techSummary:
      "Verifies single-use 128-bit DEC-008 cryptographic nonces (30s TTL) bound to arguments_hash, dispatches inside isolated worker sandboxes, and appends SHA-256 hash-chained audit records.",
    realExampleBefore: "One-time pass verified ✓",
    realExampleAfter:
      "Task completed cleanly + permanent receipt saved in your local history.",
    inputSchema: "VerifiedActionRequest + Optional<DEC008ApprovalToken>",
    outputSchema: "Signed<ExecutionReceipt> + HashChainedAuditEntry",
    plainPoints: [
      "Approvals work once for 30 seconds and can never be reused secretly.",
      "Your Instant Emergency Stop button can halt any running job in 0.05 seconds.",
      "Every single action leaves a clear, uneditable receipt you can check anytime.",
    ],
    techPoints: [
      "Single-use nonce replay or 1-bit parameter mutation after approval invalidates execution immediately.",
      "Watchdog timers and Global Killswitch (Ctrl+Alt+Shift+K) terminate subprocess trees within <50ms.",
      "Every outcome writes a tamper-evident prev_hash -> entry_hash record before memory distillation.",
    ],
  },
];

export function ControlPlaneInteractive() {
  const { mode } = useClarityMode();
  const isPlain = mode === "plain";
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  useEffect(() => {
    if (!autoPlay) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = setInterval(() => {
      setSelectedIdx((prev) => (prev + 1) % CONTROL_PLANE_STAGES.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const activeStage = CONTROL_PLANE_STAGES[selectedIdx];
  const progressPct = ((selectedIdx + 1) / CONTROL_PLANE_STAGES.length) * 100;

  return (
    <div
      className="rounded-sm border border-el-border bg-el-bg-raised p-6 shadow-el-md lg:p-10"
      onMouseEnter={() => setAutoPlay(false)}
    >
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-el-border pb-6 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-el-xs uppercase tracking-[0.1em] text-el-accent">
            {isPlain
              ? "STEP-BY-STEP VISUAL WALKTHROUGH"
              : "UNIDIRECTIONAL CONTAINMENT PIPELINE · PRD v3.1"}
          </p>
          <h3 className="mt-2 text-el-xl font-medium tracking-[-0.02em] text-el-fg">
            {isPlain
              ? "Watch How a Request Travels Through 5 Safety Checkpoints"
              : "The 5-Stage AI Control Plane"}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAutoPlay((p) => !p)}
            className="cursor-pointer rounded-full border border-el-border-strong bg-el-bg px-3.5 py-1.5 font-mono text-[11px] text-el-fg transition-colors hover:border-el-accent hover:text-el-accent"
          >
            {autoPlay ? "⏸ Auto-Tour Playing" : "▶ Play Auto-Tour"}
          </button>
        </div>
      </div>

      {/* Animated Progress Rail */}
      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-el-bg">
        <motion.div
          className="h-full rounded-full bg-el-accent"
          animate={{ width: `${progressPct}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        />
      </div>

      {/* Interactive 5-Stage Pipeline Selector */}
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-5">
        {CONTROL_PLANE_STAGES.map((stage, idx) => {
          const isSelected = idx === selectedIdx;
          const isAiBox = stage.trustZone === "AI_BOX";

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => {
                setAutoPlay(false);
                setSelectedIdx(idx);
              }}
              className={`group relative flex cursor-pointer flex-col justify-between rounded-sm border p-4 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-el-accent ${
                isSelected
                  ? isAiBox
                    ? "border-[var(--el-status-warn)] bg-[var(--el-status-warn-soft)]/70 shadow-el-sm"
                    : "border-el-accent bg-el-accent-soft/50 shadow-el-sm"
                  : "border-el-border bg-el-bg hover:border-el-border-strong hover:bg-el-bg-raised"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`font-mono text-el-xs ${
                    isSelected
                      ? isAiBox
                        ? "font-semibold text-[var(--el-status-warn)]"
                        : "font-semibold text-el-accent"
                      : "text-el-fg-faint"
                  }`}
                >
                  STEP {stage.num}
                </span>
                {idx < 4 && (
                  <span
                    aria-hidden="true"
                    className="hidden font-mono text-el-xs text-el-fg-faint md:inline"
                  >
                    →
                  </span>
                )}
              </div>

              <div className="mt-3.5">
                <p className="text-el-sm font-medium tracking-[-0.01em] text-el-fg">
                  {isPlain ? stage.plainTitle : stage.moduleName}
                </p>
                <p
                  className={`mt-1 font-mono text-[10px] uppercase tracking-[0.07em] ${
                    isAiBox ? "text-[var(--el-status-warn)]" : "text-el-fg-faint"
                  }`}
                >
                  {isAiBox
                    ? isPlain
                      ? "AI Suggests Only"
                      : "Zero Authority"
                    : isPlain
                    ? "Your Computer Guards"
                    : "Deterministic Host"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Deep Inspector */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeStage.id}-${mode}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 grid grid-cols-1 gap-6 rounded-sm border border-el-border bg-el-bg p-6 lg:grid-cols-12"
        >
          {/* Left 7 columns: Friendly Story + Key Guarantees */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-el-xs font-semibold text-el-accent">
                STEP {activeStage.num} ·{" "}
                {isPlain ? activeStage.plainTitle : activeStage.moduleName}
              </span>
              <span
                className={`rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] ${
                  activeStage.trustZone === "AI_BOX"
                    ? "border border-[var(--el-status-warn)]/30 bg-[var(--el-status-warn-soft)] text-[var(--el-status-warn)]"
                    : "border border-el-accent/20 bg-el-accent-soft text-el-accent"
                }`}
              >
                {activeStage.trustZone === "AI_BOX"
                  ? isPlain
                    ? "INSIDE LOCKED AI ROOM"
                    : "UNTRUSTED MODEL BOUNDARY"
                  : isPlain
                  ? "PROTECTED BY YOUR COMPUTER"
                  : "TRUSTED HOST"}
              </span>
            </div>

            <p className="mt-3.5 text-el-base leading-[1.65] text-el-fg-muted">
              {isPlain ? activeStage.plainSummary : activeStage.techSummary}
            </p>

            <div className="mt-5 space-y-2.5 border-t border-el-border pt-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-el-fg-faint">
                {isPlain ? "Why This Protects You" : "Enforced Stage Invariants"}
              </p>
              {(isPlain ? activeStage.plainPoints : activeStage.techPoints).map(
                (pt) => (
                  <div
                    key={pt}
                    className="flex items-start gap-2.5 text-el-xs text-el-fg"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-el-accent" />
                    <span className="leading-[1.55]">{pt}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right 5 columns: Real-Life Example (Plain) or Typed Schemas (Technical) */}
          <div className="flex flex-col justify-between gap-4 border-t border-el-border pt-4 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            {isPlain ? (
              <div className="space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-el-accent">
                  REAL-LIFE EXAMPLE AT THIS STEP
                </p>
                <div className="rounded-sm border border-el-border bg-el-bg-raised p-3.5">
                  <span className="font-mono text-[10px] uppercase text-el-fg-faint">
                    What Comes In
                  </span>
                  <p className="mt-1 text-el-xs font-medium text-el-fg">
                    {activeStage.realExampleBefore}
                  </p>
                </div>
                <div className="rounded-sm border border-el-accent/35 bg-el-accent-soft/45 p-3.5">
                  <span className="font-mono text-[10px] uppercase text-el-accent">
                    What Comes Out Safely
                  </span>
                  <p className="mt-1 text-el-xs font-medium text-el-fg">
                    {activeStage.realExampleAfter}
                  </p>
                </div>
                <p className="text-[11.5px] leading-relaxed text-el-fg-faint">
                  Engineered module:{" "}
                  <code className="font-mono text-el-fg">
                    {activeStage.moduleName}
                  </code>{" "}
                  (Switch to &ldquo;Engineer Spec&rdquo; in the top bar for schemas.)
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-el-fg-faint">
                    Input Contract
                  </p>
                  <p className="mt-1 rounded-sm border border-el-border bg-el-bg-raised px-3 py-2 font-mono text-el-xs text-el-fg">
                    {activeStage.inputSchema}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-el-fg-faint">
                    Emitted Artifact
                  </p>
                  <p className="mt-1 rounded-sm border border-el-border bg-el-bg-raised px-3 py-2 font-mono text-el-xs text-el-accent">
                    {activeStage.outputSchema}
                  </p>
                </div>

                <div className="rounded-sm border border-el-border-strong bg-el-bg-raised p-3.5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-el-fg-faint">
                    Example Trace
                  </p>
                  <p className="mt-1 text-el-xs text-el-fg-muted">
                    {activeStage.realExampleAfter}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
