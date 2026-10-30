"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface InvariantRule {
  id: string;
  category: "Memory" | "Sandbox" | "Network" | "Governance";
  title: string;
  condition: string;
  enforcement: string;
  failAction: string;
  description: string;
}

export const INVARIANT_RULES: InvariantRule[] = [
  {
    id: "INV-01",
    category: "Sandbox",
    title: "Direct Capability Barrier",
    condition: "∀ model ∈ LLMs: Cap(model) ∩ {Raw_FD, Socket, Raw_Memory} = ∅",
    enforcement: "Process Token Low-Integrity Isolation",
    failAction: "DENY_ACCESS + SEGV_SIGNAL",
    description: "Reasoning models never receive raw OS file descriptors, network sockets, or raw memory pointers. All interactions must proceed via structured JSON-RPC ActionProposals.",
  },
  {
    id: "INV-02",
    category: "Governance",
    title: "Universal 5-Gate Validation",
    condition: "∀ action ∈ ProposedActions: ⋀_{i=1}^{5} Gate_i(action) == PASS",
    enforcement: "Host Supervisor Pipeline Coordinator",
    failAction: "REJECT_PROPOSAL + ESCALATE",
    description: "Every proposed mutation must systematically pass all 5 policy gates (Path Confinement, AST Security, Regression Suite, Egress Filter, and Human Authorization) before execution.",
  },
  {
    id: "INV-03",
    category: "Governance",
    title: "Monotonic Privilege Bound",
    condition: "∀ t_2 > t_1: Tier(Agent, t_2) ≤ Tier(Agent, t_1)",
    enforcement: "Autonomy State Machine Invariant Guard",
    failAction: "THREAD_KILL + ROLLBACK",
    description: "An autonomous agent cannot upgrade its own permission tier during execution. A subagent spawned at Tier 1 (Read-Only) is mathematically barred from elevating to Tier 2 or 3.",
  },
  {
    id: "INV-04",
    category: "Memory",
    title: "Pre-Serialization Secret Redaction",
    condition: "Entropy(Payload) > Threshold ∧ Regex(Keys, Payload) == MATCH ⇒ REDACT",
    enforcement: "Loopback Ingestion AST Scrubbing",
    failAction: "REDACT_STRING + LOG_ALERT",
    description: "High-entropy secrets, private API tokens, private keys, and SSH credentials are automatically detected and replaced with [REDACTED_SECRET] before serialization.",
  },
  {
    id: "INV-05",
    category: "Sandbox",
    title: "External Ingestion Taint Tracking",
    condition: "Origin(data) ∉ TrustedRoots ⇒ Taint(data) = UNTRUSTED_EXTERNAL",
    enforcement: "Parser Context Boundary Jail",
    failAction: "QUARANTINE_TEXT + DISABLE_TOOLS",
    description: "All incoming emails, web search results, and API payloads are tagged with an immutable taint flag. Untrusted data cannot be evaluated as system instructions or tool calls.",
  },
  {
    id: "INV-06",
    category: "Governance",
    title: "Single-Use 30s Nonce Window",
    condition: "Δt(Proposal, Signature) ≤ 30.00s ∧ Used(Nonce) == FALSE",
    enforcement: "Cryptographic Receipt Verifier",
    failAction: "INVALIDATE_NONCE + DISCARD",
    description: "Tier 2 and Tier 3 ActionProposals generate an ephemeral 128-bit nonce. Signatures received after 30.00 seconds or replayed twice are immediately rejected.",
  },
  {
    id: "INV-07",
    category: "Governance",
    title: "Anti-Persuasion Cold Review",
    condition: "DisplayPayload = CanonicalDiff(action) ∧ LLM_Prose(DisplayPayload) = ∅",
    enforcement: "Approval Surface Template Engine",
    failAction: "STRIP_PROSE_TO_DIFF",
    description: "Approval cards show only raw parameter hashes and unified diffs. Untrusted model explanations or conversational justifications are scrubbed to prevent social engineering.",
  },
  {
    id: "INV-08",
    category: "Governance",
    title: "Disambiguation Collision Barrier",
    condition: "|PendingQueue| > 1 ⇒ VoiceAffirmative('Yes') = REJECTED",
    enforcement: "Speech Intent Disambiguator",
    failAction: "HALT_INTENT + REQUEST_TOUCH",
    description: "If multiple actions are queued simultaneously, spoken confirmations ('Yes', 'Proceed') are blocked. The user must touch or click the specific proposal to avoid ambiguity.",
  },
  {
    id: "INV-09",
    category: "Network",
    title: "Non-Blocking Audio Bridge",
    condition: "Latency(IngestionLoop) ≤ 12ms ∧ SyncWait(ASR) == FALSE",
    enforcement: "PCM Circular Buffer Lockless Ring",
    failAction: "DROP_STALE_FRAME + WARN",
    description: "Microphone ingestion streams into an immutable lockless ring buffer. Transcription delays never cause audio buffer dropouts or stutter during conversation.",
  },
  {
    id: "INV-10",
    category: "Governance",
    title: "Sub-50ms Hardware Killswitch",
    condition: "Signal(BargeIn ∨ E_Stop) ⇒ TTS_Mute ≤ 0.05s ∧ Thread_Halt ≤ 0.05s",
    enforcement: "Host Supervisor Kernel Ring-0 Watchdog",
    failAction: "HARD_INTERRUPT + SIGSTOP",
    description: "Operator voice interruption or physical shortcut key triggers hardware audio muting and background thread suspension within 50 milliseconds.",
  },
  {
    id: "INV-11",
    category: "Memory",
    title: "Cryptographic Subagent Attestation",
    condition: "Verify(Ed25519_Sig, Digest) == VALID ∧ Age(Receipt) ≤ 300s",
    enforcement: "Dual-Mind Consensus Bus",
    failAction: "REJECT_WORKER_RESULT",
    description: "Helper subagents must sign task results with their worker Ed25519 keypair. Unsigned or expired reports are discarded without entering working memory.",
  },
  {
    id: "INV-12",
    category: "Governance",
    title: "Deterministic Dispute Adjudication",
    condition: "Evidence(A) ⊕ Evidence(B) ⇒ State = UNRESOLVED_DISPUTED",
    enforcement: "SwarmTournament Adjudication Engine",
    failAction: "HALT_SYNTHESIS + ESCALATE",
    description: "When subagents uncover conflicting verified data, ELEVEN refuses to take a majority vote or average the answers. It escalates the conflict directly to the operator.",
  },
  {
    id: "INV-13",
    category: "Memory",
    title: "Loopback Sovereign Confinement",
    condition: "Socket_Bind == 127.0.0.1 ∧ Storage_Cipher == AES_256_GCM",
    enforcement: "Host Network Namespace & CryptFS",
    failAction: "BLOCK_SOCKET_BIND + ALARM",
    description: "Memory graphs, vector indices, and SQLite drawers are strictly bound to localhost loopback (127.0.0.1). Master keys derive from on-device TPM 2.0 / Secure Enclave.",
  },
  {
    id: "INV-14",
    category: "Memory",
    title: "Tamper-Proof Merkle Audit Ledger",
    condition: "Hash_i = SHA256(Record_i ∥ Hash_{i-1})",
    enforcement: "Append-Only Local Audit Driver",
    failAction: "SEAL_DATABASE + CORRUPTION_ALERT",
    description: "Every action proposal, policy check result, and operator signature appends to a hash-chained Merkle ledger. Any retroactive tampering causes cryptographic verification failure.",
  },
  {
    id: "INV-15",
    category: "Sandbox",
    title: "Host Supervisor Watchdog Preemption",
    condition: "HostSupervisor.Ring = 0 ∧ ModelProcess.Ring = 3",
    enforcement: "Un-sandboxed Host Watchdog Daemon",
    failAction: "KILL_PID_TREE_FORCE",
    description: "The host supervisor runs outside model sandboxes with elevated watchdog authority. If memory limits, CPU spikes, or unauthorized disk touches occur, processes are instantly terminated.",
  },
];

export function InvariantRuleExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeRuleId, setActiveRuleId] = useState<string>("INV-01");

  const categories = ["All", "Memory", "Sandbox", "Network", "Governance"];

  const filteredRules = useMemo(() => {
    return INVARIANT_RULES.filter((rule) => {
      const matchesCategory =
        selectedCategory === "All" || rule.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        rule.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.condition.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeRule = useMemo(() => {
    return (
      INVARIANT_RULES.find((r) => r.id === activeRuleId) || INVARIANT_RULES[0]
    );
  }, [activeRuleId]);

  return (
    <div className="w-full overflow-hidden rounded-sm border border-el-border bg-[#05080E] font-mono shadow-el-lg">
      {/* Top Cyber Console Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-el-border/80 bg-el-bg-raised/80 px-4 py-3 text-[11px]">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-el-signal-lime animate-pulse" />
          <span className="text-el-fg font-semibold tracking-wider">
            INVARIANT_SPEC_REGISTRY · 15 TARGET INVARIANTS
          </span>
          <span className="hidden rounded-xs border border-el-signal-lime/40 bg-el-signal-lime/10 px-1.5 py-0.2 text-[9.5px] text-el-signal-lime sm:inline">
            ARCHITECTURE_SPEC_v3.1
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer rounded-xs px-2.5 py-1 text-[10.5px] transition-all ${
                selectedCategory === cat
                  ? "bg-el-accent text-[#04060A] font-semibold"
                  : "text-el-fg-faint hover:text-el-fg"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="border-b border-el-border/70 bg-el-bg/40 px-4 py-2.5">
        <div className="flex items-center gap-2 text-el-xs">
          <span className="text-el-accent">❯</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invariant rules by ID, condition, or keyword (e.g. Nonce, Killswitch, AES)..."
            className="w-full bg-transparent text-el-fg placeholder-el-fg-faint outline-none text-[11.5px]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-el-fg-faint hover:text-el-fg text-[11px]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Selector List, Right Detailed Rule Inspection Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Left Column: Rule Selector List */}
        <div className="border-r border-el-border/80 lg:col-span-5 max-h-[500px] overflow-y-auto divide-y divide-el-border/50">
          {filteredRules.length === 0 ? (
            <div className="p-8 text-center text-el-xs text-el-fg-faint">
              No matching invariant rules found for query &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filteredRules.map((rule) => {
              const isActive = rule.id === activeRuleId;
              return (
                <button
                  key={rule.id}
                  type="button"
                  onClick={() => setActiveRuleId(rule.id)}
                  className={`w-full text-left p-3.5 transition-colors cursor-pointer flex items-center justify-between ${
                    isActive
                      ? "bg-el-accent/10 border-l-2 border-el-accent"
                      : "hover:bg-el-bg-raised/40"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold ${isActive ? "text-el-accent" : "text-el-fg"}`}>
                        {rule.id}
                      </span>
                      <span className="text-[9.5px] rounded-xs border border-el-border px-1.5 py-0.2 text-el-fg-faint">
                        {rule.category}
                      </span>
                    </div>
                    <div className="text-[11.5px] text-el-fg-muted truncate max-w-[240px]">
                      {rule.title}
                    </div>
                  </div>
                  <span className="text-[10px] text-el-signal-lime">✓ Active</span>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Deep Rule Inspector */}
        <div className="p-6 lg:p-8 lg:col-span-7 flex flex-col justify-between bg-el-bg-raised/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRule.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="space-y-6"
            >
              {/* Header Title & ID */}
              <div className="space-y-2 border-b border-el-border pb-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-xs border border-el-accent/40 bg-el-accent/10 px-2 py-0.5 text-el-xs font-bold text-el-accent">
                    {activeRule.id} {"//"} FORMAL SPEC
                  </span>
                  <span className="rounded-xs border border-el-signal-lime/40 bg-el-signal-lime/10 px-2 py-0.5 text-[10px] font-semibold text-el-signal-lime">
                    FAIL-CLOSED
                  </span>
                </div>
                <h3 className="text-el-lg font-semibold text-el-fg">
                  {activeRule.title}
                </h3>
                <p className="text-el-sm text-el-fg-muted leading-relaxed">
                  {activeRule.description}
                </p>
              </div>

              {/* Mathematical Invariant Condition Box */}
              <div className="space-y-1.5">
                <span className="text-[10.5px] uppercase tracking-wider text-el-fg-faint">
                  Mathematical Invariant Condition:
                </span>
                <div className="rounded-xs border border-el-border/80 bg-[#020408] p-3 text-el-accent text-[12px] break-all select-all">
                  <code>{activeRule.condition}</code>
                </div>
              </div>

              {/* Enforcement Mechanism & Fail-Closed Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-el-xs">
                <div className="rounded-xs border border-el-border/60 bg-el-bg-raised/50 p-3 space-y-1">
                  <span className="text-el-fg-faint text-[10px] uppercase">Enforcement Boundary:</span>
                  <p className="text-el-fg font-medium">{activeRule.enforcement}</p>
                </div>
                <div className="rounded-xs border border-el-border/60 bg-el-bg-raised/50 p-3 space-y-1">
                  <span className="text-red-400 text-[10px] uppercase">Fail-Closed Action:</span>
                  <p className="text-red-400 font-semibold">{activeRule.failAction}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Telemetry Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-el-border/80 pt-4 text-[10.5px] text-el-fg-faint">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-el-accent" />
              <span>TEST HARNESS: 100% CI COVERAGE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              <span>SUPERVISOR: RING-0 BOUNDARY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
