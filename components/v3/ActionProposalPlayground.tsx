"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface PresetScenario {
  id: string;
  name: string;
  typeBadge: "BENIGN" | "ATTACK" | "ESCALATION" | "CRITICAL";
  badgeColor: string;
  summary: string;
  payload: {
    jsonrpc: "2.0";
    id: string;
    method: string;
    params: {
      action_id: string;
      agent_id: string;
      current_tier: string;
      target_resource: string;
      ast_hash: string;
      network_requested: string;
      command?: string;
      diff_stat?: string;
    };
  };
  gateResults: {
    gate1: { pass: boolean; message: string };
    gate2: { pass: boolean; message: string };
    gate3: { pass: boolean; message: string };
    gate4: { pass: boolean; message: string };
    gate5: { pass: boolean; requiresSign: boolean; message: string };
  };
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "benign-refactor",
    name: "01 · Benign Unit Test Refactor",
    typeBadge: "BENIGN",
    badgeColor: "text-el-signal-lime border-el-signal-lime/40 bg-el-signal-lime/10",
    summary: "Standard code refactor inside /tests/auth. Passes all 5 gates and auto-executes in isolated git worktree.",
    payload: {
      jsonrpc: "2.0",
      id: "req-0491-alpha",
      method: "quarantine.stage_diff",
      params: {
        action_id: "ACT-8F2C-01",
        agent_id: "agent_dev_worker_1",
        current_tier: "T1_WORKSPACE_ISOLATED",
        target_resource: "/workspace/tests/auth/token_test.ts",
        ast_hash: "sha256:4a912e7b89f0c123e804d55a77310b9f",
        network_requested: "NONE (127.0.0.1 Loopback Only)",
        command: "pnpm test:unit --filter=auth",
        diff_stat: "2 files changed, 28 insertions(+), 4 deletions(-)",
      },
    },
    gateResults: {
      gate1: { pass: true, message: "Target is confined strictly within /workspace. No directory traversal." },
      gate2: { pass: true, message: "AST static analysis clean: 0 dynamic eval, 0 child_process calls." },
      gate3: { pass: true, message: "Execution tier remains at T1 (no privilege escalation requested)." },
      gate4: { pass: true, message: "Egress firewall validated: 0 outbound external sockets requested." },
      gate5: { pass: true, requiresSign: false, message: "Tier 1 workspace action: automatically verified and applied to worktree." },
    },
  },
  {
    id: "attack-traversal",
    name: "02 · Directory Traversal Attack",
    typeBadge: "ATTACK",
    badgeColor: "text-red-400 border-red-500/40 bg-red-500/10",
    summary: "Agent attempts to read ~/.ssh/id_rsa via relative path traversal (../../). Blocked at Gate 1 with SIGSEGV.",
    payload: {
      jsonrpc: "2.0",
      id: "req-0492-exploit",
      method: "fs.read_file",
      params: {
        action_id: "ACT-991A-BAD",
        agent_id: "untrusted_rag_subagent",
        current_tier: "T1_WORKSPACE_ISOLATED",
        target_resource: "../../../../../home/operator/.ssh/id_rsa",
        ast_hash: "sha256:e3b0c44298fc1c149afbf4c8996fb924",
        network_requested: "NONE",
        command: "cat ../../../.ssh/id_rsa",
        diff_stat: "N/A (Read attempt on prohibited host credential)",
      },
    },
    gateResults: {
      gate1: { pass: false, message: "VIOLATION: Path escapes workspace root. Target resolves to protected ~/.ssh directory." },
      gate2: { pass: false, message: "ABORTED: Gate 1 failure preempted AST inspection." },
      gate3: { pass: false, message: "ABORTED: Process flagged for immediate sandbox isolation." },
      gate4: { pass: false, message: "ABORTED: Sockets closed." },
      gate5: { pass: false, requiresSign: false, message: "SECURITY ALARM: Action Proposal dropped with SIGSEGV. Nonce voided." },
    },
  },
  {
    id: "malicious-ast",
    name: "03 · Dynamic eval() Code Injection",
    typeBadge: "ATTACK",
    badgeColor: "text-red-400 border-red-500/40 bg-red-500/10",
    summary: "Incoming code diff contains obfuscated eval(Buffer.from(...)). Caught by Gate 2 static AST scanner.",
    payload: {
      jsonrpc: "2.0",
      id: "req-0493-injection",
      method: "quarantine.stage_diff",
      params: {
        action_id: "ACT-662B-INJ",
        agent_id: "external_code_scraper",
        current_tier: "T1_WORKSPACE_ISOLATED",
        target_resource: "/workspace/src/utils/loader.ts",
        ast_hash: "sha256:77f129a0c89b145d2e41295b901a88c2",
        network_requested: "NONE",
        command: "eval(Buffer.from(atob(remotePayload)))",
        diff_stat: "1 file changed, 14 insertions(+), 0 deletions(-)",
      },
    },
    gateResults: {
      gate1: { pass: true, message: "Path within /workspace boundary." },
      gate2: { pass: false, message: "VIOLATION: Forbidden AST nodes detected [Identifier: eval, DynamicBufferExecution]." },
      gate3: { pass: false, message: "ABORTED: Security boundary breach detected." },
      gate4: { pass: false, message: "ABORTED: Network sockets held closed." },
      gate5: { pass: false, requiresSign: false, message: "SECURITY ALARM: AST signature quarantined. Invariant INV-01 enforced." },
    },
  },
  {
    id: "escalation-sudo",
    name: "04 · Privilege Escalation Attempt",
    typeBadge: "ESCALATION",
    badgeColor: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
    summary: "Subagent attempts to execute 'sudo systemctl' or modify OS hosts. Blocked by Gate 3 Monotonic Bound.",
    payload: {
      jsonrpc: "2.0",
      id: "req-0494-privesc",
      method: "process.spawn",
      params: {
        action_id: "ACT-771C-SUDO",
        agent_id: "worker_task_scheduler",
        current_tier: "T1_WORKSPACE_ISOLATED",
        target_resource: "/etc/hosts",
        ast_hash: "sha256:889104bf7c91209941a80c98f921a88b",
        network_requested: "NONE",
        command: "sudo cp /tmp/malicious_hosts /etc/hosts",
        diff_stat: "Attempting Tier 3 Root Escalation from Tier 1 Process",
      },
    },
    gateResults: {
      gate1: { pass: false, message: "VIOLATION: /etc/hosts is outside assigned /workspace namespace mount." },
      gate2: { pass: false, message: "VIOLATION: Command invokes un-whitelisted privilege binary [sudo]." },
      gate3: { pass: false, message: "CRITICAL VIOLATION: Agent requested tier promotion (T1 -> T3). Monotonic bound violated." },
      gate4: { pass: false, message: "ABORTED: Sockets disabled." },
      gate5: { pass: false, requiresSign: false, message: "KERNEL PREEMPTION: Host supervisor issued SIGKILL to worker PID tree." },
    },
  },
  {
    id: "critical-prod-git",
    name: "05 · Production Git Push to Main",
    typeBadge: "CRITICAL",
    badgeColor: "text-purple-400 border-purple-500/40 bg-purple-500/10",
    summary: "Agent requests git push origin main. Clean code, passes Gates 1-4, pauses for 30s Operator Ed25519 signature.",
    payload: {
      jsonrpc: "2.0",
      id: "req-0495-gitpush",
      method: "git.push",
      params: {
        action_id: "ACT-9901-PROD",
        agent_id: "senior_dev_assistant",
        current_tier: "T2_SUPERVISED_EXECUTION",
        target_resource: "git@github.com:company/production-core.git",
        ast_hash: "sha256:0192a884fc7612b98401aa88bbf94421",
        network_requested: "WHITELIST: github.com:22 (SSH Key Signed)",
        command: "git push origin release/v3.2",
        diff_stat: "14 files changed, 340 insertions(+), 88 deletions(-)",
      },
    },
    gateResults: {
      gate1: { pass: true, message: "Git staging confined to verified local branch worktree." },
      gate2: { pass: true, message: "All 14 modified files pass static AST audit and security linting." },
      gate3: { pass: true, message: "Agent operates within pre-authorized Tier 2 Supervised Execution bounds." },
      gate4: { pass: true, message: "Egress destination matches cryptographic operator whitelist (github.com)." },
      gate5: { pass: true, requiresSign: true, message: "AWAITING OPERATOR: Tier 2 ActionProposal requires one-time Ed25519 signature." },
    },
  },
];

export function ActionProposalPlayground() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>("benign-refactor");
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [completedGates, setCompletedGates] = useState<number>(5);
  const [signed, setSigned] = useState<boolean>(false);
  const [signing, setSigning] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(30);

  const scenario = PRESET_SCENARIOS.find((s) => s.id === activeScenarioId) || PRESET_SCENARIOS[0];

  const handleSelectScenario = (id: string) => {
    setActiveScenarioId(id);
    setSigned(false);
    setIsAuditing(true);
    setCompletedGates(0);
    setCountdown(30);

    // Animate gate step evaluation
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setCompletedGates(step);
      if (step >= 5) {
        clearInterval(interval);
        setIsAuditing(false);
      }
    }, 120);
  };

  // 30s countdown for signed scenario
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (scenario.gateResults.gate5.requiresSign && !signed && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [scenario.gateResults.gate5.requiresSign, signed, countdown]);

  const handleSignProposal = () => {
    setSigning(true);
    setTimeout(() => {
      setSigning(false);
      setSigned(true);
    }, 500);
  };

  return (
    <div className="w-full overflow-hidden rounded-sm border border-el-border bg-[#05080E] font-mono shadow-el-lg">
      {/* Top Cyber Console Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-el-border/80 bg-el-bg-raised/80 px-4 py-3 text-[11px]">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-el-accent animate-pulse" />
          <span className="text-el-fg font-semibold tracking-wider">
            ACTION_PROPOSAL_PLAYGROUND // RPC_PORT_9099
          </span>
          <span className="hidden rounded-xs border border-el-accent/30 bg-el-accent/10 px-1.5 py-0.2 text-[9.5px] text-el-accent sm:inline">
            POLICY_VERIFIER_ONLINE
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10.5px] text-el-fg-faint">
          <span>SPEC:</span>
          <span className="text-el-accent font-semibold">JSON-RPC 2.0 CANONICAL</span>
        </div>
      </div>

      {/* Preset Scenario Selector Buttons */}
      <div className="border-b border-el-border/70 bg-el-bg/50 p-3 sm:p-4">
        <p className="text-[10px] uppercase tracking-wider text-el-fg-faint mb-2">
          Select Adversarial or Benign Test Scenario:
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {PRESET_SCENARIOS.map((sc) => {
            const isSelected = sc.id === activeScenarioId;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleSelectScenario(sc.id)}
                className={`cursor-pointer rounded-xs border p-2.5 text-left transition-all ${
                  isSelected
                    ? "border-el-accent bg-el-accent/10 text-el-fg shadow-xs"
                    : "border-el-border bg-el-bg-raised/40 text-el-fg-muted hover:border-el-border-strong"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] font-bold rounded-xs border px-1 py-0.2 ${sc.badgeColor}`}>
                    {sc.typeBadge}
                  </span>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-el-accent" />}
                </div>
                <div className="text-[11px] font-semibold text-el-fg truncate">
                  {sc.name.split("·")[1]?.trim() || sc.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Grid: Left JSON-RPC Payload, Right 5-Gate Step Execution */}
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-12 lg:p-8">
        {/* Left Column: Raw JSON-RPC ActionProposal Payload */}
        <div className="space-y-4 lg:col-span-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-el-xs border-b border-el-border/60 pb-2">
              <span className="text-el-fg font-semibold">Staged JSON-RPC ActionProposal</span>
              <span className="text-el-fg-faint text-[10px]">
                ID: {scenario.payload.params.action_id}
              </span>
            </div>
            <p className="text-[11.5px] text-el-fg-muted leading-relaxed">
              {scenario.summary}
            </p>

            {/* Formatted Code Block */}
            <div className="relative overflow-x-auto rounded-xs border border-el-border/80 bg-[#020408] p-4 text-[11px] leading-relaxed select-all max-h-[360px] overflow-y-auto">
              <pre className="text-el-fg">
                <code>{JSON.stringify(scenario.payload, null, 2)}</code>
              </pre>
            </div>
          </div>

          {/* Telemetry info */}
          <div className="rounded-xs border border-el-border/60 bg-el-bg-raised/40 p-3 text-[10.5px] text-el-fg-faint space-y-1">
            <div><strong className="text-el-fg">Method:</strong> <span className="text-el-accent">{scenario.payload.method}</span></div>
            <div><strong className="text-el-fg">Target:</strong> <span className="text-el-fg-muted break-all">{scenario.payload.params.target_resource}</span></div>
            <div><strong className="text-el-fg">Digest:</strong> <span className="text-purple-400 break-all">{scenario.payload.params.ast_hash}</span></div>
          </div>
        </div>

        {/* Right Column: 5 Invariant Gates Stepped Audit */}
        <div className="space-y-4 lg:col-span-6 flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/40 p-5 sm:p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-el-border pb-3 text-el-xs">
              <span className="text-el-fg font-semibold uppercase tracking-wider">
                INVARIANT AUDIT PIPELINE
              </span>
              <span className="text-el-fg-faint text-[10.5px]">
                {isAuditing ? "EVALUATING GATES…" : "EVALUATION COMPLETE"}
              </span>
            </div>

            {/* 5 Gate Rows */}
            <div className="space-y-2.5 text-[11px]">
              {/* Gate 1 */}
              <div className={`rounded-xs border p-2.5 transition-all ${
                completedGates < 1
                  ? "border-el-border/40 bg-el-bg/30 text-el-fg-faint opacity-50"
                  : scenario.gateResults.gate1.pass
                  ? "border-el-signal-lime/40 bg-el-signal-lime/5 text-el-fg"
                  : "border-red-500/40 bg-red-500/10 text-red-400"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-el-accent">GATE 1 · PATH CONFINEMENT</span>
                  <span className={completedGates >= 1 ? (scenario.gateResults.gate1.pass ? "text-el-signal-lime" : "text-red-400 font-bold") : "text-el-fg-faint"}>
                    {completedGates >= 1 ? (scenario.gateResults.gate1.pass ? "PASS ✓" : "FAIL ✕") : "PENDING"}
                  </span>
                </div>
                {completedGates >= 1 && (
                  <p className="mt-1 text-[10.5px] text-el-fg-muted">{scenario.gateResults.gate1.message}</p>
                )}
              </div>

              {/* Gate 2 */}
              <div className={`rounded-xs border p-2.5 transition-all ${
                completedGates < 2
                  ? "border-el-border/40 bg-el-bg/30 text-el-fg-faint opacity-50"
                  : scenario.gateResults.gate2.pass
                  ? "border-el-signal-lime/40 bg-el-signal-lime/5 text-el-fg"
                  : "border-red-500/40 bg-red-500/10 text-red-400"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-el-accent">GATE 2 · STATIC AST SAFETY</span>
                  <span className={completedGates >= 2 ? (scenario.gateResults.gate2.pass ? "text-el-signal-lime" : "text-red-400 font-bold") : "text-el-fg-faint"}>
                    {completedGates >= 2 ? (scenario.gateResults.gate2.pass ? "PASS ✓" : "FAIL ✕") : "PENDING"}
                  </span>
                </div>
                {completedGates >= 2 && (
                  <p className="mt-1 text-[10.5px] text-el-fg-muted">{scenario.gateResults.gate2.message}</p>
                )}
              </div>

              {/* Gate 3 */}
              <div className={`rounded-xs border p-2.5 transition-all ${
                completedGates < 3
                  ? "border-el-border/40 bg-el-bg/30 text-el-fg-faint opacity-50"
                  : scenario.gateResults.gate3.pass
                  ? "border-el-signal-lime/40 bg-el-signal-lime/5 text-el-fg"
                  : "border-red-500/40 bg-red-500/10 text-red-400"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-el-accent">GATE 3 · MONOTONIC AUTONOMY BOUND</span>
                  <span className={completedGates >= 3 ? (scenario.gateResults.gate3.pass ? "text-el-signal-lime" : "text-red-400 font-bold") : "text-el-fg-faint"}>
                    {completedGates >= 3 ? (scenario.gateResults.gate3.pass ? "PASS ✓" : "FAIL ✕") : "PENDING"}
                  </span>
                </div>
                {completedGates >= 3 && (
                  <p className="mt-1 text-[10.5px] text-el-fg-muted">{scenario.gateResults.gate3.message}</p>
                )}
              </div>

              {/* Gate 4 */}
              <div className={`rounded-xs border p-2.5 transition-all ${
                completedGates < 4
                  ? "border-el-border/40 bg-el-bg/30 text-el-fg-faint opacity-50"
                  : scenario.gateResults.gate4.pass
                  ? "border-el-signal-lime/40 bg-el-signal-lime/5 text-el-fg"
                  : "border-red-500/40 bg-red-500/10 text-red-400"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-el-accent">GATE 4 · EGRESS SOCKET FIREWALL</span>
                  <span className={completedGates >= 4 ? (scenario.gateResults.gate4.pass ? "text-el-signal-lime" : "text-red-400 font-bold") : "text-el-fg-faint"}>
                    {completedGates >= 4 ? (scenario.gateResults.gate4.pass ? "PASS ✓" : "FAIL ✕") : "PENDING"}
                  </span>
                </div>
                {completedGates >= 4 && (
                  <p className="mt-1 text-[10.5px] text-el-fg-muted">{scenario.gateResults.gate4.message}</p>
                )}
              </div>

              {/* Gate 5 */}
              <div className={`rounded-xs border p-2.5 transition-all ${
                completedGates < 5
                  ? "border-el-border/40 bg-el-bg/30 text-el-fg-faint opacity-50"
                  : scenario.gateResults.gate5.requiresSign
                  ? signed
                    ? "border-el-signal-lime/40 bg-el-signal-lime/10 text-el-signal-lime"
                    : "border-purple-400/50 bg-purple-500/10 text-purple-300"
                  : scenario.gateResults.gate5.pass
                  ? "border-el-signal-lime/40 bg-el-signal-lime/5 text-el-fg"
                  : "border-red-500/40 bg-red-500/10 text-red-400"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-el-accent">GATE 5 · ED25519 OPERATOR ESCROW</span>
                  <span className={
                    completedGates >= 5
                      ? scenario.gateResults.gate5.requiresSign
                        ? signed ? "SIGNED ✓" : `AWAITING (${countdown}s)`
                        : scenario.gateResults.gate5.pass ? "AUTO-PASS ✓" : "BLOCKED ✕"
                      : "PENDING"
                  }>
                    {completedGates >= 5
                      ? scenario.gateResults.gate5.requiresSign
                        ? signed ? "SIGNED ✓" : `SIGNATURE REQUIRED (${countdown}s)`
                        : scenario.gateResults.gate5.pass ? "PASS ✓" : "REJECTED ✕"
                      : "PENDING"}
                  </span>
                </div>
                {completedGates >= 5 && (
                  <p className="mt-1 text-[10.5px] text-el-fg-muted">
                    {signed
                      ? "Cryptographic Ed25519 signature verified. Applied to upstream git branch."
                      : scenario.gateResults.gate5.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Interactive Operator Action Panel */}
          <div className="border-t border-el-border/80 pt-4">
            {scenario.gateResults.gate5.requiresSign ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-el-xs">
                  <span className="text-purple-400 font-semibold">
                    ONE-TIME NONCE ESCROW ACTIVE
                  </span>
                  <span className="font-mono text-el-accent">
                    TTL: {countdown.toFixed(1)}s
                  </span>
                </div>
                {signed ? (
                  <div className="rounded-xs border border-el-signal-lime/50 bg-el-signal-lime/10 p-3 text-[11px] text-el-signal-lime">
                    ✓ Nonce signed by Key [ed25519:operator_alpha]. Action dispatched to host git origin. Merkle entry #0495 appended.
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSignProposal}
                    disabled={signing || countdown === 0}
                    className="w-full cursor-pointer rounded-xs bg-el-accent py-2 text-center text-el-xs font-semibold text-[#04060A] shadow-xs hover:bg-el-signal-lime transition-all active:scale-[0.98] disabled:opacity-40"
                  >
                    {signing ? "Signing Nonce Digest…" : "Sign & Land ActionProposal (Ed25519) →"}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between text-el-xs">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${
                    scenario.gateResults.gate1.pass && scenario.gateResults.gate2.pass
                      ? "bg-el-signal-lime"
                      : "bg-red-500"
                  }`} />
                  <span className="text-el-fg-muted">
                    {scenario.gateResults.gate1.pass && scenario.gateResults.gate2.pass
                      ? "STATUS: CONFINED & VERIFIED"
                      : "STATUS: FAIL-CLOSED BLOCKED"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectScenario(activeScenarioId)}
                  className="cursor-pointer rounded-xs border border-el-border px-3 py-1 text-[10.5px] text-el-fg-faint hover:text-el-fg transition-colors"
                >
                  Re-evaluate Invariants
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
