"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DualCopy, Tilt3DCard } from "@/components/motion/PremiumMotion";

type ArchTab = "processes" | "memory" | "policy";

const FOUR_ROOMS = [
  {
    code: "ROOM 01 // SUPERVISOR",
    proc: "eleven_supervisor",
    ring: "RING 0",
    plainRole: "Building Watchdog Guard",
    techRole: "Host Hardware Watchdog & Nonce Engine",
    plainDesc:
      "Stands outside all AI thinking. Monitors system health, checks 30-second approvals, and halts execution instantly if you hit the Emergency Stop button.",
    techDesc:
      "Fail-closed supervisor process running isolated from model inference. Manages POSIX signals, verifies Ed25519 receipts, and forces sub-50ms process kills.",
  },
  {
    code: "ROOM 02 // VOICE",
    proc: "eleven_voice",
    ring: "RING 1",
    plainRole: "Conscious Voice Partner",
    techRole: "System-1 Real-Time Audio Subsystem",
    plainDesc:
      "Handles instant spoken conversation. Listens continuously and stops speaking the exact millisecond you speak up, so it feels like a real conversation.",
    techDesc:
      "Dedicated 16kHz PCM ring buffer with Silero VAD, streaming candidate ASR, and speculative audio bridge decoupling voice synthesis from tool dispatch.",
  },
  {
    code: "ROOM 03 // DEEP PLANNER",
    proc: "eleven_deep",
    ring: "RING 2",
    plainRole: "Deep Analytical Planner",
    techRole: "System-2 GovernedTaskEngine DAG",
    plainDesc:
      "Takes on hard multi-hour projects in the background. Researches files, coordinates helper workers, and checks facts without freezing your voice chat.",
    techDesc:
      "Executes GovernedTaskEngine DAGs across local and frontier models, verifying task dependencies and isolating worker scratchpads.",
  },
  {
    code: "ROOM 04 // USER HUD",
    proc: "eleven_ui",
    ring: "RING 3",
    plainRole: "Display Window",
    techRole: "Sandboxed Presentation Layer",
    plainDesc:
      "Shows what ELEVEN is doing in clear, simple language. Has zero permission to touch your database or private keys directly.",
    techDesc:
      "Zero-privilege UI process communicating via IPC. Emits user approvals into the supervisor without direct host filesystem access.",
  },
];

const FOUR_DRAWERS = [
  {
    code: "DRAWER 01 · RIGHT NOW",
    speed: "< 5 ms",
    plainTitle: "Short-Term Focus",
    techTitle: "Working Memory · Redis (:6379)",
    plainDesc:
      "Remembers what you're talking about right this second—so you can say 'change that to Friday' without repeating yourself.",
    techDesc:
      "Loopback Redis working state holding active TaskSpec scopes, turn tokens, and ephemeral session byte budgets.",
  },
  {
    code: "DRAWER 02 · TIMELINE",
    speed: "< 25 ms",
    plainTitle: "Life & Project History",
    techTitle: "Episodic Graph · Neo4j (:7687)",
    plainDesc:
      "Keeps a clean timeline of past decisions—knowing both what changed and when—so old facts are never silently overwritten.",
    techDesc:
      "Bi-temporal Neo4j graph tracking valid_time alongside transaction_time for tamper-evident chronological auditability.",
  },
  {
    code: "DRAWER 03 · SEARCH",
    speed: "< 20 ms",
    plainTitle: "Exact + Meaning Search",
    techTitle: "Semantic Vector · Qdrant RRF (:6333)",
    plainDesc:
      "Finds notes whether you remember the general idea OR an exact invoice number—combining meaning search with exact word matching.",
    techDesc:
      "Qdrant hybrid dense embeddings + sparse BM25 lexical search fused via Reciprocal Rank Fusion (k = 60).",
  },
  {
    code: "DRAWER 04 · SKILLS",
    speed: "< 10 ms",
    plainTitle: "Trusted Routines",
    techTitle: "Procedural Vault · Signed Registry",
    plainDesc:
      "Stores step-by-step routines you've approved and verified—locked with bank-grade encryption so random websites cannot alter them.",
    techDesc:
      "Cryptographically signed procedural playbooks protected inside the AES-256-GCM Sovereign Memory Vault.",
  },
];

const FIVE_GUARDS = [
  {
    guard: "GUARD 01",
    plainTitle: "Input Contract & Taint Tracking",
    techTitle: "Protocol A: Taint Sanitization",
    desc: "Scans all incoming web pages and prompts to quarantine hidden indirect prompt injection attacks before they reach tools.",
  },
  {
    guard: "GUARD 02",
    plainTitle: "Resource & Rate Caps",
    techTitle: "Token, RAM & Compute Budgets",
    desc: "Strictly enforces CPU, memory, token, and network quotas so an autonomous task never consumes unauthorized system resources.",
  },
  {
    guard: "GUARD 03",
    plainTitle: "Least-Privilege Capability Scoping",
    techTitle: "Ephemeral Task Capability Tokens",
    desc: "Grants worker models temporary, single-use access to only the specific files declared in the approved task blueprint.",
  },
  {
    guard: "GUARD 04",
    plainTitle: "30-Second Human Cryptographic Nonce",
    techTitle: "DEC-008 Nonce Approval Verification",
    desc: "Requires explicit user confirmation with a 30-second expiring cryptographic nonce for any state-changing action.",
  },
  {
    guard: "GUARD 05",
    plainTitle: "Immutable Audit Ledger",
    techTitle: "Ed25519 Signed Action Receipts",
    desc: "Saves a permanent, unalterable receipt on your computer recording exactly what was executed, when, and who approved it.",
  },
];

export function ArchitectureVisualization() {
  const [activeTab, setActiveTab] = useState<ArchTab>("processes");

  return (
    <div className="mt-10 w-full">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-el-border pb-4">
        <div className="flex items-center gap-2 font-mono text-el-xs overflow-x-auto max-w-full no-scrollbar py-1">
          <button
            type="button"
            onClick={() => setActiveTab("processes")}
            className={`cursor-pointer shrink-0 rounded-xs px-3.5 py-1.5 transition-colors ${
              activeTab === "processes"
                ? "bg-el-fg text-el-bg font-semibold shadow-el-sm"
                : "border border-el-border bg-el-bg-raised text-el-fg-muted hover:text-el-fg"
            }`}
          >
            01 · Four Process Rooms
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("memory")}
            className={`cursor-pointer shrink-0 rounded-xs px-3.5 py-1.5 transition-colors ${
              activeTab === "memory"
                ? "bg-el-fg text-el-bg font-semibold shadow-el-sm"
                : "border border-el-border bg-el-bg-raised text-el-fg-muted hover:text-el-fg"
            }`}
          >
            02 · Sovereign Memory Vault
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("policy")}
            className={`cursor-pointer shrink-0 rounded-xs px-3.5 py-1.5 transition-colors ${
              activeTab === "policy"
                ? "bg-el-fg text-el-bg font-semibold shadow-el-sm"
                : "border border-el-border bg-el-bg-raised text-el-fg-muted hover:text-el-fg"
            }`}
          >
            03 · Five Policy Guards
          </button>
        </div>

        <span className="font-mono text-[10.5px] uppercase tracking-wider text-el-fg-faint">
          DEC-001 TO DEC-008 SPECIFICATIONS
        </span>
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {/* Tab 1: Four Process Rooms */}
          {activeTab === "processes" && (
            <motion.div
              key="processes"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {FOUR_ROOMS.map((room) => (
                <Tilt3DCard key={room.proc} className="hud-frame">
                  <div className="flex h-full flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-el-fg-faint">
                        <span>{room.code}</span>
                        <span className="rounded-xs bg-el-bg px-1.5 py-0.5 text-el-accent font-semibold">
                          {room.ring}
                        </span>
                      </div>

                      <DualCopy
                        as="h4"
                        className="mt-3.5 text-el-base font-medium text-el-fg"
                        plain={room.plainRole}
                        technical={room.techRole}
                      />

                      <DualCopy
                        className="mt-2.5 text-el-xs leading-[1.65] text-el-fg-muted"
                        plain={room.plainDesc}
                        technical={room.techDesc}
                      />
                    </div>

                    <div className="mt-6 border-t border-el-border pt-3 font-mono text-[10px] text-el-fg-faint">
                      {room.proc}
                    </div>
                  </div>
                </Tilt3DCard>
              ))}
            </motion.div>
          )}

          {/* Tab 2: Sovereign Memory Vault */}
          {activeTab === "memory" && (
            <motion.div
              key="memory"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {FOUR_DRAWERS.map((drawer) => (
                <Tilt3DCard key={drawer.code} className="hud-frame">
                  <div className="flex h-full flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-el-accent font-semibold">{drawer.code}</span>
                        <span className="rounded-xs bg-el-bg px-1.5 py-0.5 text-el-fg-faint">
                          {drawer.speed}
                        </span>
                      </div>

                      <DualCopy
                        as="h4"
                        className="mt-3.5 text-el-base font-medium text-el-fg"
                        plain={drawer.plainTitle}
                        technical={drawer.techTitle}
                      />

                      <DualCopy
                        className="mt-2.5 text-el-xs leading-[1.65] text-el-fg-muted"
                        plain={drawer.plainDesc}
                        technical={drawer.techDesc}
                      />
                    </div>

                    <div className="mt-6 border-t border-el-border pt-3 font-mono text-[10px] text-el-fg-faint">
                      ENCRYPTED ON PC · NEVER SOLD
                    </div>
                  </div>
                </Tilt3DCard>
              ))}
            </motion.div>
          )}

          {/* Tab 3: Five Policy Guards */}
          {activeTab === "policy" && (
            <motion.div
              key="policy"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {FIVE_GUARDS.map((guard) => (
                <Tilt3DCard key={guard.guard}>
                  <div className="flex h-full flex-col justify-between p-6">
                    <div>
                      <span className="font-mono text-[10.5px] font-semibold text-el-accent">
                        {guard.guard}
                      </span>
                      <DualCopy
                        as="h4"
                        className="mt-2 text-el-base font-medium text-el-fg"
                        plain={guard.plainTitle}
                        technical={guard.techTitle}
                      />
                      <p className="mt-2 text-el-xs leading-[1.65] text-el-fg-muted">
                        {guard.desc}
                      </p>
                    </div>
                    <div className="mt-4 border-t border-el-border pt-2.5 font-mono text-[10px] text-el-fg-faint">
                      DETERMINISTIC · ZERO HALLUCINATION RISK
                    </div>
                  </div>
                </Tilt3DCard>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
