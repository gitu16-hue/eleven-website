"use client";

import React, { useState } from "react";

type NodeStatus = "queued" | "running" | "gated_on_human" | "verified" | "committed";

interface DagNode {
  id: string;
  name: string;
  rank: number; // 0: Plan, 1: Worktree Worker, 2: AST Gate, 3: Human Gate, 4: Merge
  worker: string;
  worktreePath: string;
  status: NodeStatus;
  dependsOn: string[];
  summary: string;
  toolCall: string;
  diffSummary: string;
  astChecks: { name: string; passed: boolean }[];
  cryptoHash: string;
}

interface DagPreset {
  id: string;
  title: string;
  badge: string;
  description: string;
  nodes: DagNode[];
}

const presets: DagPreset[] = [
  {
    id: "fido2_migration",
    title: "Full-Stack Auth Migration: JWT → WebAuthn FIDO2",
    badge: "ENTERPRISE REFACTOR",
    description: "Decomposes complete auth overhaul into 3 parallel isolated worktrees with database migration, backend RP handler, and client biometric hooks.",
    nodes: [
      {
        id: "NODE-00",
        name: "Plan Decomposition & Worktree Provisioning",
        rank: 0,
        worker: "System 2 DAG Master",
        worktreePath: "/tmp/eleven-master-plan",
        status: "committed",
        dependsOn: [],
        summary: "Analyzes codebase AST, extracts auth dependencies, and provisions 3 quarantined git worktrees.",
        toolCall: 'git.worktree.provision({ branches: ["feat/db-webauthn", "feat/rp-server", "feat/client-fido2"] })',
        diffSummary: "+ .eleven/dag-plan-001.json (topological plan: 7 nodes, 3 parallel lanes)",
        astChecks: [
          { name: "Schema Dependency Graph Valid", passed: true },
          { name: "Zero Circular Dependencies", passed: true },
        ],
        cryptoHash: "0x8f2a...c491",
      },
      {
        id: "NODE-01",
        name: "Worktree Alpha: SQLite Credentials Schema",
        rank: 1,
        worker: "Worker Agent Alpha",
        worktreePath: "/tmp/eleven-worktree-alpha",
        status: "verified",
        dependsOn: ["NODE-00"],
        summary: "Migrates user table to support WebAuthn public keys, counter, and transports in local SQLite.",
        toolCall: 'db.migration.create({ table: "authenticators", key: "credential_id_blob", counter: "int64" })',
        diffSummary: "+ migrations/20261029_webauthn_credentials.sql (42 lines added, 0 dropped)",
        astChecks: [
          { name: "No DROP TABLE / Destructive Syscalls", passed: true },
          { name: "Index on user_id (B-Tree Verified)", passed: true },
          { name: "Rollback Migration Test Passed", passed: true },
        ],
        cryptoHash: "0x3e11...982f",
      },
      {
        id: "NODE-02",
        name: "Worktree Beta: FIDO2 Server RP Handler",
        rank: 1,
        worker: "Worker Agent Beta",
        worktreePath: "/tmp/eleven-worktree-beta",
        status: "verified",
        dependsOn: ["NODE-00"],
        summary: "Implements registration/authentication options generation and attestation signature verification.",
        toolCall: 'fs.writeFile({ path: "lib/auth/webauthn-rp.ts", imports: ["@simplewebauthn/server"] })',
        diffSummary: "+ lib/auth/webauthn-rp.ts (186 lines added, type-checked TS 5.6)",
        astChecks: [
          { name: "Challenge Nonce Cryptographically Random", passed: true },
          { name: "Origin Domain Validation Enforced", passed: true },
          { name: "Zero External Cloud Network Egress", passed: true },
        ],
        cryptoHash: "0x7b44...a902",
      },
      {
        id: "NODE-03",
        name: "Worktree Gamma: Client Biometric Hooks",
        rank: 1,
        worker: "Worker Agent Gamma",
        worktreePath: "/tmp/eleven-worktree-gamma",
        status: "verified",
        dependsOn: ["NODE-00"],
        summary: "Creates React 19 hook binding to browser navigator.credentials.create and get APIs.",
        toolCall: 'fs.writeFile({ path: "hooks/useWebAuthn.ts", clientAPI: "navigator.credentials" })',
        diffSummary: "+ hooks/useWebAuthn.ts (112 lines, Touch ID & YubiKey tested)",
        astChecks: [
          { name: "Fallback for Unsupported Browsers Included", passed: true },
          { name: "No Plaintext Password Inputs", passed: true },
        ],
        cryptoHash: "0x5c89...d114",
      },
      {
        id: "NODE-04",
        name: "Quarantine Sanctum: Cross-Worktree AST Audit",
        rank: 2,
        worker: "Supervisor AST Gate",
        worktreePath: "/tmp/eleven-sanctum-audit",
        status: "verified",
        dependsOn: ["NODE-01", "NODE-02", "NODE-03"],
        summary: "Runs static AST security rules (INV-10), checks zero external network leakage, and runs test suites.",
        toolCall: "ast.audit.crossWorktree({ targetBranches: 3, securityLevel: 'strict' })",
        diffSummary: "✔ 18 Unit Tests Passed · 0 Security Invariant Breaches · 0 Network Egress Sockets",
        astChecks: [
          { name: "INV-01 (Zero Cloud Exfiltration)", passed: true },
          { name: "INV-08 (Quarantined Execution Sanctum)", passed: true },
          { name: "INV-10 (AST Invariant Verification)", passed: true },
        ],
        cryptoHash: "0x91d3...bb77",
      },
      {
        id: "NODE-05",
        name: "Human Sovereign Gate: Diff Review & Sign-Off",
        rank: 3,
        worker: "Human-in-the-Loop Gate",
        worktreePath: "/dev/tty",
        status: "gated_on_human",
        dependsOn: ["NODE-04"],
        summary: "Halts execution awaiting user Ed25519 or Touch ID cryptographic signing of compiled diff.",
        toolCall: "supervisor.humanGate.requestApproval({ proposalId: 'PROP-FIDO2-098', changes: '+340 / -18' })",
        diffSummary: "Consolidated Diff: +340 lines, -18 lines across 3 files. Deterministic review ready.",
        astChecks: [
          { name: "Human Veto Gate Active (INV-02)", passed: true },
          { name: "Ed25519 Signature Required", passed: true },
        ],
        cryptoHash: "0xPENDING_HUMAN_SIGNATURE",
      },
      {
        id: "NODE-06",
        name: "Atomic Merkle Commit & Worktree Clean",
        rank: 4,
        worker: "Git Transaction Engine",
        worktreePath: "refs/heads/main",
        status: "queued",
        dependsOn: ["NODE-05"],
        summary: "Fast-forwards main branch, writes signed receipt to SQLite ledger, and destroys worktrees.",
        toolCall: "git.merge.atomicCommit({ fastForward: true, signReceipt: true })",
        diffSummary: "Branch 'feat/fido2-migration' ready for zero-downtime fast-forward to main.",
        astChecks: [
          { name: "INV-05 (Immutable State Transitions)", passed: true },
          { name: "Worktree Clean & Pruned", passed: true },
        ],
        cryptoHash: "0xQUEUED_FOR_MERGE",
      },
    ],
  },
  {
    id: "cve_patch",
    title: "Critical CVE-2026-4412 Remediation across 4 Microservices",
    badge: "ZERO-REGRESSION SECURITY",
    description: "Isolates a high-severity buffer overflow in a common parser across 4 distinct repo services with fuzzing test harnesses.",
    nodes: [
      {
        id: "CVE-00",
        name: "Vulnerability Scope & Worktree Allocation",
        rank: 0,
        worker: "Security Analyzer",
        worktreePath: "/tmp/cve-scan-root",
        status: "committed",
        dependsOn: [],
        summary: "Identifies vulnerable symbol references across API Gateway, Auth Worker, and Event Ingest.",
        toolCall: "sec.cve.inspect({ cve: 'CVE-2026-4412', symbol: 'parseUncheckedChunk' })",
        diffSummary: "Found 4 call-sites across 3 services requiring boundary-checked bounds.",
        astChecks: [{ name: "Call Graph Traversal Clean", passed: true }],
        cryptoHash: "0x11ab...ff32",
      },
      {
        id: "CVE-01",
        name: "Worktree Alpha: Core Parser Boundary Check",
        rank: 1,
        worker: "Patch Worker 01",
        worktreePath: "/tmp/worktree-cve-parser",
        status: "verified",
        dependsOn: ["CVE-00"],
        summary: "Replaces raw pointer arithmetic with safe Rust-style checked slicing.",
        toolCall: "fs.patchChunk({ file: 'src/parser/chunk.ts', replace: 'safeSliceBounds' })",
        diffSummary: "+ src/parser/chunk.ts (Bounds checks added: max_chunk_len = 65536)",
        astChecks: [{ name: "No Memory Unsafe Casts", passed: true }],
        cryptoHash: "0x22bc...ee43",
      },
      {
        id: "CVE-02",
        name: "Worktree Beta: Fuzzing Regression Suite",
        rank: 1,
        worker: "Test Synthesis Agent",
        worktreePath: "/tmp/worktree-cve-fuzz",
        status: "verified",
        dependsOn: ["CVE-00"],
        summary: "Generates 10,000 malformed input payloads to verify parser resilience.",
        toolCall: "test.fuzz.run({ iterations: 10000, maxPayloadBytes: 131072 })",
        diffSummary: "10,000 / 10,000 fuzz iterations handled gracefully with 0 crashes.",
        astChecks: [{ name: "Zero Panic / Zero SIGSEGV", passed: true }],
        cryptoHash: "0x33cd...dd54",
      },
      {
        id: "CVE-03",
        name: "Human Sovereign Approval Gate",
        rank: 2,
        worker: "Human Security Lead",
        worktreePath: "/dev/tty",
        status: "gated_on_human",
        dependsOn: ["CVE-01", "CVE-02"],
        summary: "Security Officer approves patch diff and verifies fuzz test results.",
        toolCall: "supervisor.requestHumanApproval({ threatSeverity: 'HIGH', safePatch: true })",
        diffSummary: "Patch size: +24 lines, -8 lines. All regression suites pass.",
        astChecks: [{ name: "Sign-Off Invariant INV-02", passed: true }],
        cryptoHash: "0xPENDING_SECURITY_SIGN",
      },
      {
        id: "CVE-04",
        name: "Atomic Hot-Reload & Deploy",
        rank: 3,
        worker: "Deploy Daemon",
        worktreePath: "refs/tags/v3.1.9-hotfix",
        status: "queued",
        dependsOn: ["CVE-03"],
        summary: "Creates signed tag and re-executes container tests.",
        toolCall: "git.tag.create({ tag: 'v3.1.9-hotfix', signed: true })",
        diffSummary: "Automated rollback snapshot prepared.",
        astChecks: [{ name: "INV-05 Signed Commit", passed: true }],
        cryptoHash: "0xQUEUED",
      },
    ],
  },
];

export function System2DagVisualizer() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("fido2_migration");
  const [activePreset, setActivePreset] = useState<DagPreset>(() =>
    JSON.parse(JSON.stringify(presets[0]))
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string>("NODE-05");

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = presets.find((p) => p.id === presetId);
    if (found) {
      setActivePreset(JSON.parse(JSON.stringify(found)));
      setSelectedNodeId(found.nodes[Math.min(4, found.nodes.length - 1)].id);
    }
  };

  const selectedNode =
    activePreset.nodes.find((n) => n.id === selectedNodeId) || activePreset.nodes[0];

  // Group nodes by topological rank
  const maxRank = Math.max(...activePreset.nodes.map((n) => n.rank));
  const ranks = Array.from({ length: maxRank + 1 }, (_, i) => i);

  // Playback handlers
  const handleApproveGate = () => {
    setActivePreset((prev) => {
      const updatedNodes = prev.nodes.map((n) => {
        if (n.status === "gated_on_human") {
          return {
            ...n,
            status: "verified" as NodeStatus,
            cryptoHash: "0xED25519_HUMAN_APPROVED_8f39b1",
          };
        }
        if (n.rank === 4 && n.status === "queued") {
          return {
            ...n,
            status: "committed" as NodeStatus,
            cryptoHash: "0xMERGED_ATOMIC_6a20c3",
          };
        }
        return n;
      });
      return { ...prev, nodes: updatedNodes };
    });
  };

  const handleReset = () => {
    const found = presets.find((p) => p.id === selectedPresetId);
    if (found) {
      setActivePreset(JSON.parse(JSON.stringify(found)));
      setSelectedNodeId(found.nodes[Math.min(4, found.nodes.length - 1)].id);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-sm border border-el-border bg-[#04060A] shadow-el-lg">
      {/* Top Console Title Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-el-border/80 bg-el-bg-raised/80 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-el-cyan shadow-[0_0_8px_#00F0FF]" />
            <span className="h-2.5 w-2.5 rounded-full bg-el-mint/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-el-border" />
          </div>
          <span className="font-mono text-xs font-semibold tracking-wider text-el-fg">
            SYSTEM_2_ASYNC_DAG_ORCHESTRATOR // QUARANTINED GIT WORKTREES
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase text-el-fg-faint">
            SUPERVISOR STATUS:
          </span>
          <span className="rounded-xs border border-el-mint/40 bg-el-mint/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-el-mint">
            FAIL-CLOSED ACTIVE
          </span>
        </div>
      </div>

      {/* Preset Selector & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-el-border bg-[#020408] px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-el-fg-faint mr-1">WORKFLOW PRESET:</span>
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectPreset(p.id)}
              className={`rounded-xs px-3 py-1 font-mono text-xs transition-all cursor-pointer ${
                selectedPresetId === p.id
                  ? "border border-el-cyan bg-el-cyan/15 text-el-cyan font-semibold"
                  : "border border-el-border bg-el-bg-raised/40 text-el-fg-muted hover:border-el-border-strong hover:text-el-fg"
              }`}
            >
              {p.title.split(":")[0]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {activePreset.nodes.some((n) => n.status === "gated_on_human") && (
            <button
              type="button"
              onClick={handleApproveGate}
              className="flex items-center gap-1.5 rounded-xs border border-el-mint bg-el-mint/15 px-3 py-1 font-mono text-xs font-semibold text-el-mint shadow-[0_0_12px_rgba(0,255,157,0.2)] hover:bg-el-mint/25"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              SIGN WITH ED25519 (APPROVE)
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="rounded-xs border border-el-border bg-el-bg-raised px-2.5 py-1 font-mono text-xs text-el-fg-muted hover:text-el-fg"
          >
            RESET DAG
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive DAG Canvas (8 Cols) vs Node Inspector (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Topological DAG Graph Canvas (8 Cols) */}
        <div className="border-b border-el-border p-5 lg:col-span-8 lg:border-b-0 lg:border-r lg:p-6 overflow-x-auto">
          <div className="min-w-[560px] space-y-6">
            <div className="flex items-center justify-between border-b border-el-border/60 pb-2">
              <span className="font-mono text-xs font-medium text-el-fg">
                TOPOLOGICAL EXECUTION LANES (RANK 0 → RANK {maxRank})
              </span>
              <span className="font-mono text-[10px] text-el-fg-faint">
                CLICK ANY NODE TO INSPECT QUARANTINED PAYLOAD
              </span>
            </div>

            {/* Render Lanes by Rank */}
            <div className="space-y-6">
              {ranks.map((rank) => {
                const nodesInRank = activePreset.nodes.filter((n) => n.rank === rank);
                const rankLabel =
                  rank === 0
                    ? "RANK 0: PLAN DECOMPOSITION"
                    : rank === 1
                    ? "RANK 1: PARALLEL JAILED WORKTREES"
                    : rank === 2
                    ? "RANK 2: AST SECURITY SANCTUM"
                    : rank === 3
                    ? "RANK 3: HUMAN SOVEREIGN VETO GATE"
                    : "RANK 4: ATOMIC MERKLE COMMIT";

                return (
                  <div key={rank} className="space-y-2">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-el-fg-faint">
                      <span className="h-1.5 w-1.5 rounded-full bg-el-cyan" />
                      <span>{rankLabel}</span>
                    </div>

                    <div className={`grid gap-3 ${nodesInRank.length > 1 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1"}`}>
                      {nodesInRank.map((node) => {
                        const isSelected = selectedNodeId === node.id;

                        return (
                          <div
                            key={node.id}
                            onClick={() => setSelectedNodeId(node.id)}
                            className={`group relative cursor-pointer rounded-xs border p-3.5 transition-all ${
                              isSelected
                                ? "border-el-cyan bg-el-cyan/10 shadow-[0_0_14px_rgba(0,240,255,0.15)] ring-1 ring-el-cyan/30"
                                : node.status === "gated_on_human"
                                ? "border-el-amber/50 bg-[#080602] hover:border-el-amber"
                                : node.status === "verified" || node.status === "committed"
                                ? "border-el-mint/40 bg-el-bg-raised/30 hover:border-el-mint/70"
                                : "border-el-border bg-el-bg-raised/20 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <div className="pointer-events-none absolute top-1 right-1 font-mono text-[9px] text-el-fg-faint">
                              ⌜ ⌟
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] font-semibold text-el-cyan">
                                {node.id}
                              </span>
                              <span
                                className={`rounded-xs px-1.5 py-0.2 font-mono text-[9px] font-semibold uppercase ${
                                  node.status === "committed"
                                    ? "bg-el-mint/15 text-el-mint"
                                    : node.status === "verified"
                                    ? "bg-el-mint/10 text-el-mint"
                                    : node.status === "gated_on_human"
                                    ? "bg-el-amber/20 text-el-amber animate-pulse"
                                    : "bg-el-border text-el-fg-faint"
                                }`}
                              >
                                {node.status === "gated_on_human" ? "⚠ HUMAN VETO" : node.status}
                              </span>
                            </div>

                            <p className="mt-1.5 text-xs font-bold text-el-fg leading-snug">
                              {node.name}
                            </p>

                            <div className="mt-2.5 flex items-center justify-between border-t border-el-border/40 pt-1.5 font-mono text-[9px] text-el-fg-faint">
                              <span className="truncate max-w-[120px]">{node.worker}</span>
                              <span className="text-el-fg-muted">{node.worktreePath.split("/").pop()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Selected Node Detail & Audit Receipt Inspector (4 Cols) */}
        <div className="flex flex-col justify-between bg-[#020306] p-5 lg:col-span-4 lg:p-6 space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-el-border/80 pb-2">
              <span className="font-mono text-xs font-semibold text-el-cyan">
                NODE INSPECTOR // {selectedNode.id}
              </span>
              <span className="rounded-xs border border-el-border bg-el-bg px-2 py-0.5 font-mono text-[9px] text-el-fg-faint">
                RANK {selectedNode.rank}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-el-fg">{selectedNode.name}</h4>
              <p className="text-xs text-el-fg-muted leading-relaxed">
                {selectedNode.summary}
              </p>
            </div>

            {/* Sandbox Path Box */}
            <div className="rounded-xs border border-el-border bg-[#04060A] p-2.5 font-mono text-[10px] space-y-1">
              <div className="text-el-fg-faint uppercase">QUARANTINED WORKTREE PATH:</div>
              <div className="text-el-mint break-all select-all font-semibold">
                {selectedNode.worktreePath}
              </div>
            </div>

            {/* Tool Proposal Payload Box */}
            <div className="rounded-xs border border-el-border bg-[#04060A] p-2.5 font-mono text-[10px] space-y-1">
              <div className="text-el-fg-faint uppercase">ACTIONPROPOSAL TOOL CALL:</div>
              <pre className="text-el-cyan whitespace-pre-wrap break-all select-all leading-tight">
                {selectedNode.toolCall}
              </pre>
            </div>

            {/* Quarantined Diff Preview */}
            <div className="rounded-xs border border-el-border bg-[#04060A] p-2.5 font-mono text-[10px] space-y-1">
              <div className="text-el-fg-faint uppercase">DIFF INSPECTION:</div>
              <p className="text-el-fg leading-relaxed">{selectedNode.diffSummary}</p>
            </div>

            {/* AST Security Gates */}
            <div className="rounded-xs border border-el-border bg-[#04060A] p-2.5 font-mono text-[10px] space-y-1.5">
              <div className="text-el-fg-faint uppercase">AST SAFETY GATES (INV-10):</div>
              <div className="space-y-1">
                {selectedNode.astChecks.map((chk, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-el-fg-muted">{chk.name}</span>
                    <span className="text-el-mint font-semibold">✓ PASS</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cryptographic Hash */}
            <div className="rounded-xs border border-el-border bg-[#04060A] p-2.5 font-mono text-[10px] space-y-1">
              <div className="text-el-fg-faint uppercase">ED25519 RECEIPT CHECKSUM:</div>
              <div className="text-purple-400 break-all select-all">
                {selectedNode.cryptoHash}
              </div>
            </div>
          </div>

          {/* Footer of Inspector */}
          <div className="border-t border-el-border/60 pt-3 font-mono text-[10px] text-el-fg-faint flex justify-between items-center">
            <span>FAIL-CLOSED CONFINEMENT</span>
            <span className="text-el-mint">INV-09 ENFORCED</span>
          </div>
        </div>
      </div>
    </div>
  );
}