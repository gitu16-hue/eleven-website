"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tilt3DCard } from "@/components/motion/PremiumMotion";

interface SpecModule {
  id: string;
  tag: string;
  title: string;
  badge: string;
  role: string;
  desc: string;
  invariants: string[];
  cliCommand: string;
  codeSnippet: string;
}

const SPEC_MODULES: SpecModule[] = [
  {
    id: "supervisor",
    tag: "RING-0 · HOST SUPERVISOR",
    title: "eleven_supervisor Process Coordinator",
    badge: "RING-0 PRIVILEGE",
    role: "The single host process with OS-level authority. Manages subprocess lifecycles, traps the global emergency killswitch, and holds root key material.",
    desc: "The Host Supervisor executes in Ring-0 isolation, supervising child processes via non-inheritable stdin/stdout pipes. It listens for the global Ctrl+Alt+Shift+K hardware hotkey and forces immediate SIGKILL termination across all spawned workers in <50ms.",
    invariants: [
      "INV-01: Child workers run under low-integrity OS tokens without administrator privileges.",
      "INV-02: Hardware interrupt listener operates independently of GUI event loops.",
      "INV-03: Zero IPC socket exposure to public localhost network interfaces.",
    ],
    cliCommand: "eleven supervisor --daemon --strict-isolation",
    codeSnippet: `{
  "supervisor": {
    "bind_address": "127.0.0.1",
    "ipc_transport": "named_pipe",
    "watchdog_timeout_ms": 50,
    "killswitch_hotkey": "Ctrl+Alt+Shift+K",
    "audit_log_path": "~/.eleven/ledger.bin"
  }
}`,
  },
  {
    id: "quarantine",
    tag: "RING-1 · QUARANTINE SANCTUM",
    title: "eleven_deep Sandboxed Worker Runtime",
    badge: "DEFAULT-DENY EGRESS",
    role: "Restricted worker container where untrusted frontier models and local tools execute. Confined to strictly approved directories with blocked cloud network access.",
    desc: "Quarantine Sanctum executes all file modifications, compiler passes, and python sub-agents inside a jailed chroot/sandbox. Outbound TCP/UDP sockets are dropped at the packet filter level unless explicitly signed by an Ed25519 ActionProposal pass.",
    invariants: [
      "INV-04: Network egress is default-deny; models cannot ping external telemetry servers.",
      "INV-05: Path traversal outside workspace root triggers immediate invariant violation.",
      "INV-06: File modifications staged in copy-on-write memory until operator approves.",
    ],
    cliCommand: "eleven sandbox run --quarantine --deny-net --workspace ./repo",
    codeSnippet: `{
  "quarantine": {
    "network_egress": "BLOCK_ALL",
    "max_heap_mb": 4096,
    "max_execution_sec": 300,
    "path_jail": ["/workspace", "/tmp/eleven_quarantine"],
    "enforce_ed25519_signatures": true
  }
}`,
  },
  {
    id: "eventbus",
    tag: "RING-2 · DUAL-MIND EVENT BUS",
    title: "Async Mind Synchronization Bus",
    badge: "ZERO-JITTER STREAM",
    role: "High-frequency typed event stream bridging System 1 (Voice & Speech perception) with System 2 (GovernedTaskEngine DAG reasoning).",
    desc: "Enables sub-500ms voice conversational interaction while multi-step tasks run in the background. System 1 emits TaskHandoff events to System 2, allowing natural barge-in interruptions to pause or abort background execution immediately.",
    invariants: [
      "INV-07: Voice ring buffer isolated from planner thread; audio frame jitter <2ms.",
      "INV-08: Speech interruption emits IMMEDIATE_HALT broadcast across all DAG workers.",
      "INV-09: Inter-mind communications strictly typed with monotonic sequence nonces.",
    ],
    cliCommand: "eleven bus trace --stream --format jsonl",
    codeSnippet: `{
  "event_bus": {
    "ring_buffer_khz": 16,
    "frame_size_samples": 480,
    "max_turn_latency_ms": 500,
    "barge_in_suppression_db": 32,
    "dag_concurrency_limit": 8
  }
}`,
  },
  {
    id: "memory",
    tag: "RING-3 · SOVEREIGN MEMORY VAULT",
    title: "Encrypted Local Memory Drawer Architecture",
    badge: "AES-256-GCM LOCAL",
    role: "Four-tier private memory persistence stored exclusively on the user's computer with zero cloud telemetry or third-party embeddings sync.",
    desc: "Combines 127.0.0.1 Redis scratchpad, local SQLite episodic journals, bi-temporal Neo4j relationship graphs, and on-device Qdrant vector embeddings. All data at rest is encrypted with AES-256-GCM using hardware-derived keys.",
    invariants: [
      "INV-10: Memory drawers never synchronized to remote vendor cloud databases.",
      "INV-11: Vector embeddings generated locally via CPU/GPU quantized sentence models.",
      "INV-12: Full database wipe executed instantaneously on master key purge.",
    ],
    cliCommand: "eleven memory inspect --drawer episodic --stats",
    codeSnippet: `{
  "memory_vault": {
    "encryption": "AES_256_GCM",
    "key_derivation": "Argon2id",
    "scratchpad": "redis://127.0.0.1:6379/0",
    "episodic_journal": "sqlite://~/.eleven/episodic.db",
    "semantic_vector": "qdrant://127.0.0.1:6334/knowledge"
  }
}`,
  },
];

export function DocsInteractiveViewer() {
  const [activeTab, setActiveTab] = useState<string>(SPEC_MODULES[0].id);
  const [copied, setCopied] = useState<boolean>(false);

  const activeModule =
    SPEC_MODULES.find((m) => m.id === activeTab) || SPEC_MODULES[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      {/* Tab Selector Bar */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SPEC_MODULES.map((mod) => {
          const isSelected = mod.id === activeTab;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => setActiveTab(mod.id)}
              className={`group relative cursor-pointer overflow-hidden rounded-sm border p-3.5 text-left transition-all duration-200 ${
                isSelected
                  ? "border-el-accent bg-el-bg-raised/90 shadow-el-md"
                  : "border-el-border bg-el-bg-raised/40 hover:border-el-border-strong hover:bg-el-bg-raised/60"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeDocIndicator"
                  className="pointer-events-none absolute top-0 right-0 left-0 h-[2px] bg-el-accent"
                />
              )}
              <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-el-fg-faint">
                {mod.tag.split(" · ")[0]}
              </span>
              <p
                className={`mt-1 font-mono text-el-xs font-semibold tracking-tight transition-colors ${
                  isSelected ? "text-el-accent" : "text-el-fg group-hover:text-el-accent"
                }`}
              >
                {mod.title.split(" ")[0]}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Active Module Display Pane */}
      <div className="mt-6 rounded-sm border border-el-border bg-el-bg-raised/60 p-6 shadow-el-lg sm:p-8 backdrop-blur-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-el-border pb-4">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-el-accent animate-pulse" />
                <span className="font-mono text-el-xs uppercase tracking-[0.14em] text-el-accent">
                  {activeModule.tag}
                </span>
              </div>
              <span className="rounded-xs border border-el-accent/40 bg-el-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-el-accent">
                {activeModule.badge}
              </span>
            </div>

            {/* Spec Title & Deep Description */}
            <h3 className="mt-4 text-el-2xl font-semibold tracking-tight text-el-fg">
              {activeModule.title}
            </h3>
            <p className="mt-2 text-el-base leading-relaxed text-el-fg-muted">
              {activeModule.desc}
            </p>

            {/* Invariant Rules Checklist */}
            <div className="mt-6 rounded-xs border border-el-border-strong/40 bg-el-bg/70 p-4 font-mono text-el-xs">
              <p className="text-[10px] uppercase tracking-[0.14em] text-el-fg-faint mb-2.5">
                VERIFIED ARCHITECTURAL INVARIANTS:
              </p>
              <ul className="space-y-2">
                {activeModule.invariants.map((inv, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-el-fg-muted">
                    <span className="text-el-signal-lime">✓</span>
                    <span>{inv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code / Configuration Snippet Box */}
            <div className="mt-6 overflow-hidden rounded-xs border border-el-border bg-[#04060A] font-mono shadow-inner">
              <div className="flex items-center justify-between border-b border-el-border/80 bg-el-bg-raised/70 px-4 py-2 text-[11px]">
                <div className="flex items-center gap-2 text-el-fg-faint">
                  <span className="h-1.5 w-1.5 rounded-full bg-el-accent" />
                  <span>eleven.config.json · {activeModule.id}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(activeModule.codeSnippet)}
                  className="cursor-pointer rounded-xs px-2 py-0.5 text-[10px] text-el-fg-faint transition-colors hover:bg-el-bg hover:text-el-fg"
                >
                  {copied ? "COPIED ✓" : "COPY CODE"}
                </button>
              </div>
              <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed text-[#94A3B8]">
                <code>{activeModule.codeSnippet}</code>
              </pre>
            </div>

            {/* CLI Reference */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-el-fg-faint">
              <div className="flex items-center gap-2">
                <span className="text-el-accent">CLI:</span>
                <code className="text-el-fg">{activeModule.cliCommand}</code>
              </div>
              <span className="text-el-border-strong">POSIX & WIN32 CONFORMANT</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
