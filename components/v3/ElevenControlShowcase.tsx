"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import {
  ShieldCheck,
  Layers,
  Activity,
  CheckCircle2,
  Lock,
  Sliders,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  Terminal,
  Check,
} from "lucide-react";

// ============================================================================
// ELEVEN v3 CONTROL SHOWCASE — TYPE DEFINITIONS & MISSION DATA
// ============================================================================

export type ShowcaseView = "overview" | "pipeline" | "detail";

export type MissionArchetype =
  | "FINANCIAL_AST"
  | "GROK_PULSE"
  | "DOCUMENT_EXTRACT"
  | "SYS_HARDENING"
  | "CODE_AUDITOR"
  | "ACTUARIAL_DAG"
  | "VAULT_DAEMON"
  | "CRYPTO_RECEIPT"
  | "VOICESTUDIO";

export interface MissionItem {
  id: string;
  title: string;
  archetype: MissionArchetype;
  stageIndex: number; // 0 to 4
  ttl: string;
  ece: string;
  summary: string;
  sparkline: number[];
  indicatedLatencyMs: number;
  tokenSavingsPct: number;
  merkleHash: string;
}

export interface CognitiveStation {
  id: string;
  name: string;
  shortLabel: string;
  sublabel: string;
  sla: string;
  description: string;
  statusText: string;
  targetX: number; // Harmonic waypoints along the cubic bezier path
  invariants: {
    code: string;
    label: string;
    passed: boolean;
    detail: string;
  }[];
}

// 5 Harmonic Stations along the Specified Cubic-Bezier Path
export const COGNITIVE_STATIONS: CognitiveStation[] = [
  {
    id: "jev_infer",
    name: "Jev Infer",
    shortLabel: "01. TRIAGE",
    sublabel: "Sub-65ms System 1 Perception",
    sla: "< 65ms",
    description:
      "Real-time acoustic & semantic feature extraction with calibrated Expected Calibration Error (ECE < 0.02) to route between instant reflex and System 2 deep planning.",
    statusText: "Nominal: Intent classified into zero-prompt local execution DAG.",
    targetX: 60,
    invariants: [
      { code: "INV-01", label: "Acoustic VAD Bounded", passed: true, detail: "16kHz PCM stream window < 80ms" },
      { code: "INV-02", label: "ECE Calibration Gate", passed: true, detail: "Model confidence score >= 0.982" },
      { code: "INV-03", label: "No Cloud Hop", passed: true, detail: "Triage completed on local NPU/GPU" },
    ],
  },
  {
    id: "cdm_taskspec",
    name: "CDM TaskSpec",
    shortLabel: "02. SPEC",
    sublabel: "ActionProposal Manifest Synthesis",
    sla: "< 120ms",
    description:
      "Synthesizes a strictly typed, immutable ActionProposal JSON manifest defining exact parameter boundaries, capability leases, and rollback checkpoints.",
    statusText: "Validated: ActionProposal manifest schema verified against DEC-008.",
    targetX: 310,
    invariants: [
      { code: "INV-04", label: "Strict Schema Typing", passed: true, detail: "Zod AST contract validation passed" },
      { code: "INV-05", label: "Capability Lease Bounded", passed: true, detail: "Lease TTL limited to 45 seconds" },
      { code: "INV-06", label: "Rollback Nonce Attached", passed: true, detail: "Snapshot state hash stored in WAL" },
    ],
  },
  {
    id: "hive_synthesis",
    name: "Hive Swarm",
    shortLabel: "03. SWARM",
    sublabel: "Ephemeral Isolated Workers",
    sla: "< 350ms",
    description:
      "Spawns ephemeral, jailed micro-agents with restricted POSIX namespaces, no network egress, and strict execution quotas to execute parallel analytical sub-tasks.",
    statusText: "Active: 4 isolated drones operating inside unprivileged jail.",
    targetX: 550,
    invariants: [
      { code: "INV-07", label: "Process Sandbox UID", passed: true, detail: "Sandboxed under UID 4096 (unprivileged)" },
      { code: "INV-08", label: "Zero Network Egress", passed: true, detail: "iptables loopback lockdown verified" },
      { code: "INV-09", label: "Memory Wall Enforcement", passed: true, detail: "Ephemeral worker RAM capped at 256MB" },
    ],
  },
  {
    id: "l5_policy_gate",
    name: "L5 Policy Gate",
    shortLabel: "04. GATE",
    sublabel: "Cold-Room Deterministic Invariants",
    sla: "< 45ms",
    description:
      "The host hypervisor audits the generated diffs, memory mutations, and system calls against 15 immutable invariants. Fail-closed architecture halts on any violation.",
    statusText: "Armed: Cold-room verification enclave passed all 4 critical gate invariants.",
    targetX: 790,
    invariants: [
      { code: "INV-10", label: "Cold-Room Enclave Pass", passed: true, detail: "Zero unverified host system calls" },
      { code: "INV-11", label: "Memory Integrity Check", passed: true, detail: "HMAC-SHA256 sovereign vault intact" },
      { code: "INV-12", label: "Dual Authority Token", passed: true, detail: "Ed25519 signature payload staged" },
    ],
  },
  {
    id: "dec_008_signed",
    name: "DEC-008 Signed",
    shortLabel: "05. BOUND",
    sublabel: "Immutable Merkle Receipt Issued",
    sla: "Instant",
    description:
      "Action is committed to the host OS, receipt is cryptographically stamped with Ed25519, and the transition hash is appended to the local append-only Merkle ledger.",
    statusText: "Complete: Merkle node stamped. Receipt verified on sovereign ledger.",
    targetX: 940,
    invariants: [
      { code: "INV-13", label: "Ed25519 Stamped", passed: true, detail: "Digital signature stamped to ledger" },
      { code: "INV-14", label: "Merkle Node Appended", passed: true, detail: "Root hash synchronized to disk" },
      { code: "INV-15", label: "Audit Receipt Emitted", passed: true, detail: "Receipt archived for inspection" },
    ],
  },
];

// 10 Compact Missions Distributed Across the 5 Pipeline Stages
export const INITIAL_MISSIONS: MissionItem[] = [
  {
    id: "MIS-401",
    title: "Dhan Ledger CSV Audit",
    archetype: "FINANCIAL_AST",
    stageIndex: 0,
    ttl: "12s",
    ece: "0.012",
    summary: "Reconcile duplicate transactions and compute capital gains tax bounds.",
    sparkline: [35, 42, 60, 52, 68, 74, 82],
    indicatedLatencyMs: 38,
    tokenSavingsPct: 88.4,
    merkleHash: "0x7f4b8c...3a1c",
  },
  {
    id: "MIS-402",
    title: "Grok Pulse Real-Time Feed",
    archetype: "GROK_PULSE",
    stageIndex: 0,
    ttl: "8s",
    ece: "0.009",
    summary: "Stream perception ingestion with sub-50ms acoustic token segmentation.",
    sparkline: [20, 38, 45, 62, 58, 80, 91],
    indicatedLatencyMs: 24,
    tokenSavingsPct: 94.2,
    merkleHash: "0x91da3e...44ff",
  },
  {
    id: "MIS-403",
    title: "Nashik Client Invoice #402",
    archetype: "DOCUMENT_EXTRACT",
    stageIndex: 1,
    ttl: "24s",
    ece: "0.015",
    summary: "Extract line items, verify GSTIN checksums, and emit ActionProposal.",
    sparkline: [40, 50, 48, 65, 70, 78, 85],
    indicatedLatencyMs: 44,
    tokenSavingsPct: 82.0,
    merkleHash: "0x33e8b1...78cc",
  },
  {
    id: "MIS-404",
    title: "Docker Compose Jail Sec",
    archetype: "SYS_HARDENING",
    stageIndex: 1,
    ttl: "30s",
    ece: "0.011",
    summary: "Audit network isolation namespaces and drop elevated root capabilities.",
    sparkline: [30, 42, 55, 60, 68, 82, 88],
    indicatedLatencyMs: 52,
    tokenSavingsPct: 79.5,
    merkleHash: "0x12fa90...bc21",
  },
  {
    id: "MIS-405",
    title: "AST Self-Index Refresh",
    archetype: "CODE_AUDITOR",
    stageIndex: 2,
    ttl: "42s",
    ece: "0.014",
    summary: "Deconstruct TypeScript symbols into local semantic memory index.",
    sparkline: [50, 58, 64, 72, 80, 89, 94],
    indicatedLatencyMs: 62,
    tokenSavingsPct: 76.8,
    merkleHash: "0x88cb43...10ab",
  },
  {
    id: "MIS-406",
    title: "Multi-Agent Loss Run Model",
    archetype: "ACTUARIAL_DAG",
    stageIndex: 2,
    ttl: "45s",
    ece: "0.016",
    summary: "5-year parametric catastrophe model simulation via 4 ephemeral workers.",
    sparkline: [45, 52, 68, 74, 82, 88, 93],
    indicatedLatencyMs: 78,
    tokenSavingsPct: 71.4,
    merkleHash: "0x54ee11...99ef",
  },
  {
    id: "MIS-407",
    title: "Sovereign Memory Re-Index",
    archetype: "VAULT_DAEMON",
    stageIndex: 3,
    ttl: "18s",
    ece: "0.008",
    summary: "Re-encrypt local SQLite vector embeddings with rotated AES-256-GCM key.",
    sparkline: [60, 68, 75, 82, 88, 92, 97],
    indicatedLatencyMs: 31,
    tokenSavingsPct: 91.0,
    merkleHash: "0x44bf67...23ea",
  },
  {
    id: "MIS-408",
    title: "Ed25519 Key Ceremony #19",
    archetype: "CRYPTO_RECEIPT",
    stageIndex: 3,
    ttl: "14s",
    ece: "0.005",
    summary: "Dual-underwriter cryptographic quorum sign-off for elevated disk write.",
    sparkline: [55, 62, 70, 78, 85, 90, 98],
    indicatedLatencyMs: 29,
    tokenSavingsPct: 96.2,
    merkleHash: "0x67fa22...ee43",
  },
  {
    id: "MIS-409",
    title: "Whisper Audio Stream 16kHz",
    archetype: "VOICESTUDIO",
    stageIndex: 4,
    ttl: "Done",
    ece: "0.004",
    summary: "Barge-in reflex executed in 142ms. Audio output buffer flushed to DAC.",
    sparkline: [70, 78, 82, 88, 92, 96, 99],
    indicatedLatencyMs: 18,
    tokenSavingsPct: 98.5,
    merkleHash: "0x21cc89...88a1",
  },
  {
    id: "MIS-410",
    title: "Postgres Migration Gate",
    archetype: "CODE_AUDITOR",
    stageIndex: 4,
    ttl: "Done",
    ece: "0.006",
    summary: "Zero-downtime column rename invariant verified and stamped to Merkle chain.",
    sparkline: [65, 72, 80, 85, 91, 95, 99],
    indicatedLatencyMs: 22,
    tokenSavingsPct: 95.0,
    merkleHash: "0x09da77...54de",
  },
];

// J.A.R.V.I.S. Subconscious Observations
export const SUBCONSCIOUS_FEED = [
  {
    id: "OBS-9021",
    missionId: "MIS-401",
    stageIndex: 0,
    code: "FIN_DETECT",
    title: "Duplicate Ledger Anomaly Identified",
    detail: "Detected 14 duplicate ledger rows in ~/Documents/Finance/2026_Q3.csv",
    time: "2m ago",
    reflex: "Auto-quarantine candidate row set",
  },
  {
    id: "OBS-9022",
    missionId: "MIS-409",
    stageIndex: 4,
    code: "VAD_REFLEX",
    title: "Human Speech In-Flight Interruption",
    detail: "Audio VAD threshold detected 840ms silence; synthesized fast-path reflex",
    time: "4m ago",
    reflex: "DAC stream switched to low-latency buffer",
  },
  {
    id: "OBS-9023",
    missionId: "MIS-405",
    stageIndex: 2,
    code: "DAG_PRUNE",
    title: "AST Semantic Cache Optimization",
    detail: "System 2 DAG pruned 3 extraneous LLM calls via cached AST index",
    time: "9m ago",
    reflex: "Saved ~14,200 tokens on local bus",
  },
  {
    id: "OBS-9024",
    missionId: "MIS-408",
    stageIndex: 3,
    code: "VAULT_SEAL",
    title: "Ed25519 Quorum Seal Re-verified",
    detail: "Local Ed25519 key verified for scheduled backup sync to cold storage",
    time: "14m ago",
    reflex: "Enclave unlocked for 10-second sync nonce",
  },
];

// ============================================================================
// MAIN COMPONENT: ElevenControlShowcase
// ============================================================================

export function ElevenControlShowcase({ className = "" }: { className?: string }) {
  const showcaseRef = useRef<HTMLDivElement>(null);
  const inView = useInView(showcaseRef, { margin: "120px" });
  const prefersReducedMotion = useReducedMotion();

  // Navigation & View State
  const [activeView, setActiveView] = useState<ShowcaseView>("overview");
  const [missions] = useState<MissionItem[]>(INITIAL_MISSIONS);
  const [selectedMission, setSelectedMission] = useState<MissionItem>(INITIAL_MISSIONS[0]);
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(selectedMission.stageIndex);

  // Auto-play State Machine (4.5s compositor-driven cycle loop — 0 React interval ticks)
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [cycleNonce, setCycleNonce] = useState<number>(0);

  // Pause auto-play when user manually interacts
  const handleUserInteract = useCallback(() => {
    setIsAutoPlay(false);
    setCycleNonce((n) => n + 1);
  }, []);

  // View transition helper
  const handleSelectView = (view: ShowcaseView) => {
    handleUserInteract();
    setActiveView(view);
  };

  // Mission click in View 2 -> transitions to View 3
  const handleSelectMission = (mission: MissionItem) => {
    handleUserInteract();
    setSelectedMission(mission);
    setSelectedStageIdx(mission.stageIndex);
    setActiveView("detail");
  };

  // Subconscious feed quick action -> View 3
  const handleFeedAction = (missionId: string, stageIdx: number) => {
    handleUserInteract();
    const target = missions.find((m) => m.id === missionId) || missions[0];
    setSelectedMission(target);
    setSelectedStageIdx(stageIdx);
    setActiveView("detail");
  };

  // Advance showcase cycle when GPU progress bar finishes its 4.5s sweep
  const advanceShowcaseView = useCallback(() => {
    if (!isAutoPlay) return;
    setActiveView((curr) => {
      if (curr === "overview") return "pipeline";
      if (curr === "pipeline") {
        setSelectedMission(INITIAL_MISSIONS[0]);
        setSelectedStageIdx(2);
        return "detail";
      }
      return "overview";
    });
    setCycleNonce((n) => n + 1);
  }, [isAutoPlay]);

  return (
    <div
      ref={showcaseRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full overflow-hidden rounded-sm border border-emerald-500/15 bg-[#060b0e] font-sans shadow-2xl text-slate-100 ${className}`}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. Ambient Aurora Wave Backdrop (blur 65px, gated by inView)  */}
      {/* ------------------------------------------------------------- */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-full max-w-[1300px] overflow-hidden opacity-70">
        <motion.div
          animate={
            inView && !prefersReducedMotion
              ? {
                  scale: activeView === "detail" ? [1.05, 0.95, 1.05] : [1, 1.15, 0.95, 1],
                  x: activeView === "pipeline" ? ["-8%", "6%", "-4%"] : ["-4%", "4%", "-4%"],
                  y: ["0%", "9%", "-5%", "0%"],
                }
              : { scale: 1, x: "0%", y: "0%" }
          }
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-full w-full rounded-full blur-[65px]"
          style={{
            willChange: "transform",
            background:
              "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.32) 0%, rgba(13, 59, 56, 0.5) 30%, rgba(6, 182, 212, 0.22) 58%, transparent 75%)",
          }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Top Cyber Console & OS Header Bar                             */}
      {/* ------------------------------------------------------------- */}
      <header className="relative z-10 border-b border-emerald-500/15 bg-[#0b141a]/85 px-4 sm:px-6 py-3.5 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Greeting & Live Status Pills */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                ELEVEN v3 // CONTROL PLANE
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 font-mono text-[10.5px]">
              <span className="rounded-xs border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                L5 HYPERVISOR: ARMED
              </span>
              <span className="rounded-xs border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-cyan-300 flex items-center gap-1">
                <Lock className="h-2.5 w-2.5" />
                <span>VAULT: AES-256-GCM LOCKED</span>
              </span>
            </div>
          </div>

          {/* Right: Auto-Play Showcase Toggle + Progress Meter */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAutoPlay((prev) => !prev);
                setCycleNonce((n) => n + 1);
              }}
              className={`cursor-pointer flex min-h-[32px] items-center gap-1.5 rounded-xs border px-2.5 py-1 font-mono text-[10px] font-medium transition-all ${
                isAutoPlay
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                  : "border-slate-700 bg-slate-900/80 text-slate-400 hover:text-slate-200"
              }`}
              title={isAutoPlay ? "Pause automated showcase cycling" : "Resume automated cycling (4.5s)"}
            >
              {isAutoPlay ? (
                <>
                  <Pause className="h-2.5 w-2.5" />
                  <span>CYCLE: ON</span>
                </>
              ) : (
                <>
                  <Play className="h-2.5 w-2.5" />
                  <span>CYCLE: PAUSED</span>
                </>
              )}
            </button>

            <span className="hidden sm:inline font-mono text-[10px] text-slate-500">
              GITANSHU // SOVEREIGN ADMIN
            </span>
          </div>
        </div>

        {/* Live Auto-Play Cycle Progress Bar (Compositor scaleX — 0 JS ticks) */}
        {isAutoPlay && inView && (
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-slate-800/60 overflow-hidden">
            <div
              key={`${activeView}-${cycleNonce}`}
              onAnimationEnd={advanceShowcaseView}
              className="h-full w-full origin-left bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300"
              style={{
                animation: "el-progress-fill 4500ms linear forwards",
                animationPlayState: isHovered || prefersReducedMotion ? "paused" : "running",
                willChange: "transform",
              }}
            />
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. Primary Navigation Tabs: Overview · Pipeline · Governance  */}
      {/* ------------------------------------------------------------- */}
      <nav className="relative z-10 border-b border-emerald-500/10 bg-[#070e13]/70 px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3 overflow-x-auto max-w-full no-scrollbar">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            {[
              { id: "overview", label: "[01] Overview", icon: Activity },
              { id: "pipeline", label: "[02] Hive Pipeline", icon: Layers },
              { id: "detail", label: "[03] L5 Governance", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectView(tab.id as ShowcaseView)}
                  className={`relative flex items-center shrink-0 gap-1.5 rounded-xs px-3 py-1.5 font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-xs"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Telemetry Labels */}
          <div className="hidden lg:flex items-center gap-3 font-mono text-[10.5px] text-slate-400">
            <span>[04] Sovereign Vault</span>
            <span className="text-slate-600">·</span>
            <span>[05] VoiceStudio 16kHz</span>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* 3. Choreographed View Content Canvas                          */}
      {/* ------------------------------------------------------------- */}
      <main className="relative z-10 p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {/* ========================================================= */}
          {/* VIEW 1: COGNITIVE RUNTIME OVERVIEW                       */}
          {/* ========================================================= */}
          {activeView === "overview" && (
            <motion.div
              key="view-overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Header Greeting */}
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span>Good morning, Gitanshu</span>
                    <span className="font-mono text-xs font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-xs">
                      NODE // LOCALHOST-01
                    </span>
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Zero-Prompt Cognitive Triad (Jev + CDM + F.R.I.D.A.Y.) and L5 Zero-Trust Hypervisor telemetry.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectView("pipeline")}
                  className="cursor-pointer flex items-center gap-1 font-mono text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Open Hive Pipeline (10 Active)</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {/* 4 KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {[
                  {
                    title: "JEV SYSTEM-1 TRIAGE",
                    val: "62 ms",
                    sub: "Calibrated ECE < 0.02",
                    badge: "FAST PATH REFLEX",
                    color: "text-emerald-400",
                    border: "border-emerald-500/25",
                  },
                  {
                    title: "ZERO-PROMPT FAST PATH",
                    val: "71.4%",
                    sub: "Bypassed Cloud LLM",
                    badge: "LOCAL INFERENCE",
                    color: "text-cyan-400",
                    border: "border-cyan-500/25",
                  },
                  {
                    title: "ACTIVE HIVE DRONES",
                    val: "4 Ephemeral",
                    sub: "Max TTL: 45s Sandbox",
                    badge: "CPU JAIL UID 4096",
                    color: "text-emerald-300",
                    border: "border-emerald-500/25",
                  },
                  {
                    title: "L5 TRIFECTA BLOCKS",
                    val: "14 Halted",
                    sub: "0% Unauthorized Egress",
                    badge: "FAIL-CLOSED GATE",
                    color: "text-teal-300",
                    border: "border-teal-500/25",
                  },
                ].map((kpi, idx) => (
                  <div
                    key={idx}
                    className={`rounded-sm border ${kpi.border} bg-[#0b141a]/90 p-4 font-mono shadow-xs transition-all hover:border-emerald-400/50`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{kpi.title}</span>
                      <span className="rounded-xs bg-slate-900 px-1.5 py-0.5 text-[9px] text-slate-300 border border-slate-800">
                        {kpi.badge}
                      </span>
                    </div>
                    <div className={`mt-2 text-2xl font-bold tracking-tight ${kpi.color}`}>
                      {kpi.val}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      {kpi.sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Split Row: SVG Area Chart (60%) + J.A.R.V.I.S. Feed (40%) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left (60%): Animated Cubic-Bezier Area Chart */}
                <div className="lg:col-span-7 rounded-sm border border-emerald-500/20 bg-[#091116] p-5 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Cognitive Latency &amp; Token Reduction</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Measured local execution latency vs cloud API hops across 24h
                      </p>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="rounded-xs border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                        68% Local Execution
                      </span>
                      <span className="rounded-xs border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-cyan-300">
                        142ms Audio Reflex
                      </span>
                    </div>
                  </div>

                  {/* Render Area Chart */}
                  <LatencyReductionChart />
                </div>

                {/* Right (40%): J.A.R.V.I.S. Subconscious Feed */}
                <div className="lg:col-span-5 rounded-sm border border-emerald-500/20 bg-[#091116] p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                      <span>J.A.R.V.I.S. Subconscious Feed</span>
                    </h3>
                    <span className="font-mono text-[9px] uppercase text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded-xs border border-emerald-800/50">
                      LIVE DAEMON
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {SUBCONSCIOUS_FEED.map((feed) => (
                      <div
                        key={feed.id}
                        className="rounded-xs border border-slate-800/90 bg-[#060c10] p-3 text-xs transition-colors hover:border-emerald-500/40"
                      >
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span className="text-emerald-400 font-semibold">{feed.title}</span>
                          <span className="text-slate-500">{feed.time}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-300 leading-snug">
                          {feed.detail}
                        </p>
                        <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-slate-800/60 font-mono text-[9.5px]">
                          <span className="text-slate-400 truncate max-w-[160px]">
                            {feed.reflex}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleFeedAction(feed.missionId, 1)}
                              className="cursor-pointer text-slate-400 hover:text-white px-1.5 py-0.5 rounded-xs bg-slate-800 hover:bg-slate-700"
                            >
                              [Stage Spec]
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFeedAction(feed.missionId, 4)}
                              className="cursor-pointer text-emerald-300 hover:text-emerald-200 px-1.5 py-0.5 rounded-xs bg-emerald-950/80 border border-emerald-800/50 hover:bg-emerald-900"
                            >
                              [DEC-008 Approve]
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: HIVE MIND PIPELINE MATRIX                        */}
          {/* ========================================================= */}
          {activeView === "pipeline" && (
            <motion.div
              key="view-pipeline"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Layers className="h-4 w-4 text-emerald-400" />
                    <span>Hive Mind Pipeline Matrix // 5-Stage Zero-Prompt Boundary</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    10 concurrent tasks orchestrated by Jev System-1, CDM TaskCompiler, and the L5 Hypervisor. Click any mission to inspect Cold-Room verification.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectView("detail")}
                  className="cursor-pointer font-mono text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>Inspect Selected Mission →</span>
                </button>
              </div>

              {/* 5-Column Kanban Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {COGNITIVE_STATIONS.map((col, colIdx) => {
                  const colMissions = missions.filter((m) => m.stageIndex === colIdx);

                  return (
                    <div
                      key={col.id}
                      className="rounded-sm border border-slate-800/90 bg-[#091116]/80 p-3 font-mono text-xs flex flex-col min-h-[420px]"
                    >
                      {/* Column Header */}
                      <div className="border-b border-slate-800/80 pb-2 mb-3">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-emerald-400">
                            {col.shortLabel}
                          </span>
                          <span className="rounded-xs bg-slate-900 border border-slate-800 px-1.5 py-0.2 text-[9px] text-slate-400">
                            {colMissions.length} TASKS
                          </span>
                        </div>
                        <h4 className="mt-0.5 font-sans font-bold text-slate-200 text-xs truncate">
                          {col.name}
                        </h4>
                        <span className="text-[9px] text-slate-500">
                          SLA {col.sla}
                        </span>
                      </div>

                      {/* Cards Stack */}
                      <div className="space-y-2.5 flex-1">
                        {colMissions.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => handleSelectMission(m)}
                            className="cursor-pointer rounded-xs border border-emerald-500/20 bg-[#060c10] p-2.5 text-xs transition-all hover:border-emerald-400 hover:shadow-[0_0_12px_rgba(16,185,129,0.18)] hover:-translate-y-0.5 group"
                          >
                            <div className="flex items-center justify-between font-mono text-[9.5px]">
                              <span className="text-emerald-400 group-hover:text-emerald-300 font-semibold">
                                {m.id}
                              </span>
                              <span className="text-slate-500">
                                TTL: {m.ttl}
                              </span>
                            </div>

                            <p className="mt-1 font-sans text-xs font-semibold text-slate-200 group-hover:text-white line-clamp-1">
                              {m.title}
                            </p>

                            <div className="mt-1.5 flex items-center justify-between font-mono text-[9px] text-slate-400">
                              <span className="rounded-xs bg-slate-900/90 border border-slate-800 px-1.5 py-0.5 text-slate-300">
                                {m.archetype}
                              </span>
                              <span>ECE: {m.ece}</span>
                            </div>

                            {/* Mini Sparkline Curve */}
                            <div className="mt-2 h-4 w-full pt-0.5">
                              <MiniSparkline data={m.sparkline} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* VIEW 3: MISSION DETAIL & CURVED SVG COGNITIVE ROUTE       */}
          {/* ========================================================= */}
          {activeView === "detail" && (
            <motion.div
              key="view-detail"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Mission Header & Back Link */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectView("pipeline")}
                    className="cursor-pointer rounded-xs border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back to Matrix</span>
                  </button>

                  <div>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400 uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>MISSION VOYAGE // {selectedMission.id}</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
                      {selectedMission.title}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="rounded-xs border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-300">
                    {selectedMission.archetype}
                  </span>
                  <span className="rounded-xs border border-slate-700 bg-slate-900 px-2.5 py-1 text-slate-300">
                    Merkle: {selectedMission.merkleHash}
                  </span>
                </div>
              </div>

              {/* CENTERPIECE ANIMATION: Curved SVG Route Stepper */}
              <CognitiveRouteStepper
                selectedSlot={selectedStageIdx}
                onSelectSlot={(idx) => {
                  handleUserInteract();
                  setSelectedStageIdx(idx);
                }}
              />

              {/* COLD-ROOM INSPECTION SURFACE: High-Contrast Alabaster/Slate Card */}
              <ColdRoomInspectionCard
                mission={selectedMission}
                station={COGNITIVE_STATIONS[selectedStageIdx]}
                onAdvanceMilestone={() => {
                  handleUserInteract();
                  setSelectedStageIdx((curr) => Math.min(curr + 1, COGNITIVE_STATIONS.length - 1));
                }}
                onSelectMatrix={() => handleSelectView("pipeline")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ============================================================================
// SUBCOMPONENT: CognitiveRouteStepper (Exact GSAP Curved Path Physics)
// ============================================================================

const SVG_PATH_D =
  "M 60 110 C 180 110, 200 45, 310 45 C 420 45, 440 115, 550 115 C 660 115, 680 50, 790 50 C 870 50, 900 95, 940 95";

function CognitiveRouteStepper({
  selectedSlot,
  onSelectSlot,
}: {
  selectedSlot: number;
  onSelectSlot: (idx: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const basePathRef = useRef<SVGPathElement | null>(null);
  const donePathRef = useRef<SVGPathElement | null>(null);
  const pulseNodeRef = useRef<SVGGElement | null>(null);

  const prog = useRef<{ l: number }>({ l: 0 });
  const animTween = useRef<gsap.core.Tween | null>(null);
  const rafId = useRef<number | null>(null);

  // Exact station arc-lengths and coordinate points
  const [stationPoints, setStationPoints] = useState<
    { x: number; y: number; len: number }[]
  >([]);

  // Kinematic placement along SVG path tangent
  const place = useCallback(() => {
    if (!basePathRef.current || !donePathRef.current || !pulseNodeRef.current) return;
    const total = basePathRef.current.getTotalLength();
    const l = prog.current.l;
    const p = basePathRef.current.getPointAtLength(l);
    const q = basePathRef.current.getPointAtLength(Math.min(l + 2, total));
    const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;

    gsap.set(pulseNodeRef.current, {
      x: p.x,
      y: p.y,
      rotation: ang * 0.4, // Buoyant tangent tilt along the wave
    });
    donePathRef.current.setAttribute("stroke-dasharray", `${l} ${total}`);
  }, []);

  // Compute exact station arc lengths corresponding to waypoints [60, 310, 550, 790, 940]
  useEffect(() => {
    const base = basePathRef.current;
    if (!base) return;

    const total = base.getTotalLength();
    const waypointsX = [60, 310, 550, 790, 940];

    // Binary search arc length for each target X coordinate
    const points = waypointsX.map((targetX) => {
      let low = 0;
      let high = total;
      for (let i = 0; i < 20; i++) {
        const mid = (low + high) / 2;
        const pt = base.getPointAtLength(mid);
        if (pt.x < targetX) {
          low = mid;
        } else {
          high = mid;
        }
      }
      const midLen = (low + high) / 2;
      const pt = base.getPointAtLength(midLen);
      return { x: pt.x, y: pt.y, len: midLen };
    });

    setStationPoints(points);

    // Initial traveler placement
    const targetLen = points[selectedSlot]?.len ?? 0;
    prog.current.l = targetLen;
    place();
  }, [place, selectedSlot]);

  // GSAP Kinematic tween when selected slot changes
  useEffect(() => {
    if (stationPoints.length === 0) return;

    if (animTween.current) animTween.current.kill();
    if (rafId.current) cancelAnimationFrame(rafId.current);

    const targetLength = stationPoints[selectedSlot]?.len ?? 0;

    animTween.current = gsap.to(prog.current, {
      l: targetLength,
      duration: 0.95,
      ease: "power2.inOut",
      onUpdate: () => {
        rafId.current = requestAnimationFrame(place);
      },
      onComplete: () => {
        place();
      },
    });

    return () => {
      if (animTween.current) animTween.current.kill();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [selectedSlot, stationPoints, place]);

  return (
    <div className="relative w-full rounded-sm border border-emerald-500/20 bg-[#050b0f] p-4 sm:p-6 shadow-xl overflow-hidden">
      {/* Background Cyber Console Line */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          <span className="font-semibold text-slate-200">
            COGNITIVE_ROUTE_STEPPER // TANGENT-ALIGNED BUOYANT BANKING
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>ACTIVE STATION:</span>
          <span className="rounded-xs border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 font-bold text-emerald-300">
            {COGNITIVE_STATIONS[selectedSlot]?.name} ({selectedSlot + 1}/5)
          </span>
        </div>
      </div>

      {/* Responsive SVG Route Canvas */}
      <div className="relative mt-4 w-full">
        <svg
          ref={svgRef}
          viewBox="0 -10 1000 180"
          className="w-full h-auto overflow-hidden select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Emerald/Cyan Gradient for illuminated path */}
            <linearGradient id="eleven-stepper-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#00ff9d" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="eleven-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Radial glow for traveler vessel */}
            <radialGradient id="vessel-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Base Muted Path (Full Track) */}
          <path
            ref={basePathRef}
            d={SVG_PATH_D}
            fill="none"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Subtle center guide dashed line */}
          <path
            d={SVG_PATH_D}
            fill="none"
            stroke="#334155"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* 2. Done Active Path (Illuminated route with stroke-dasharray reveal) */}
          <path
            ref={donePathRef}
            d={SVG_PATH_D}
            fill="none"
            stroke="url(#eleven-stepper-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#eleven-glow)"
          />

          {/* 3. Interactive Station Nodes at Wave Crests & Troughs */}
          {stationPoints.map((pt, idx) => {
            const isPast = idx < selectedSlot;
            const isCurrent = idx === selectedSlot;
            const station = COGNITIVE_STATIONS[idx];

            return (
              <g
                key={idx}
                transform={`translate(${pt.x}, ${pt.y})`}
                onClick={() => onSelectSlot(idx)}
                className="cursor-pointer group"
              >
                {/* Generous invisible hit target */}
                <circle r="26" fill="transparent" />

                {/* Pulsing Active Ring Halo */}
                {isCurrent && (
                  <circle
                    r="20"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    className="animate-ping"
                    opacity="0.45"
                  />
                )}

                {/* Node Outer Circle */}
                <circle
                  r={isCurrent ? "14" : "11"}
                  fill="#060b0e"
                  stroke={isCurrent ? "#10b981" : isPast ? "#059669" : "#334155"}
                  strokeWidth={isCurrent ? "2.5" : "2"}
                  className="transition-all duration-300 group-hover:scale-110"
                  style={{
                    filter: isCurrent ? "drop-shadow(0 0 8px rgba(16,185,129,0.7))" : undefined,
                  }}
                />

                {/* Inner Icon / Checkmark */}
                {isPast ? (
                  <path
                    d="M -3.5 -0.5 L -1 2 L 3.5 -2.5"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : isCurrent ? (
                  <circle r="4.5" fill="#10b981" className="animate-pulse" />
                ) : (
                  <circle r="3" fill="#475569" />
                )}

                {/* Station Labels (alternating top/bottom) */}
                <text
                  y={idx % 2 === 0 ? "-24" : "32"}
                  textAnchor="middle"
                  className="font-mono text-[11px] font-semibold select-none pointer-events-none"
                  fill={isCurrent ? "#00ff9d" : isPast ? "#10b981" : "#64748b"}
                >
                  {station?.name}
                </text>

                <text
                  y={idx % 2 === 0 ? "-36" : "44"}
                  textAnchor="middle"
                  className="font-mono text-[9px] uppercase tracking-wider select-none pointer-events-none"
                  fill={isCurrent ? "#94a3b8" : "#475569"}
                >
                  {station?.shortLabel}
                </text>
              </g>
            );
          })}

          {/* 4. Tangent-Aligned Traveler Icon (Quantum Vessel) */}
          <g ref={pulseNodeRef} className="pointer-events-none">
            {/* Glow Disc */}
            <circle r="24" fill="url(#vessel-glow)" opacity="0.6" />

            {/* Vessel Craft Frame */}
            <g transform="translate(-13, -13)">
              <rect
                x="2"
                y="2"
                width="22"
                height="22"
                rx="5"
                fill="#060b0e"
                stroke="#10b981"
                strokeWidth="2"
                style={{ filter: "drop-shadow(0 0 10px rgba(16,185,129,0.8))" }}
              />
              <path
                d="M 16 13 L 9 9.5 L 11.5 13 L 9 16.5 Z"
                fill="#10b981"
              />
            </g>

            {/* Glowing Core Dot */}
            <circle r="2.5" fill="#ffffff" />
          </g>
        </svg>
      </div>
    </div>
  );
}

// ============================================================================
// SUBCOMPONENT: ColdRoomInspectionCard (High-Contrast Alabaster/Slate Surface)
// ============================================================================

function ColdRoomInspectionCard({
  mission,
  station,
  onAdvanceMilestone,
  onSelectMatrix,
}: {
  mission: MissionItem;
  station: CognitiveStation;
  onAdvanceMilestone: () => void;
  onSelectMatrix: () => void;
}) {
  // Live Parameter Sliders & Fluid Number Tweening
  const [confidenceGate, setConfidenceGate] = useState<number>(0.95);
  const [swarmTTL, setSwarmTTL] = useState<number>(45);
  const [strictnessLevel, setStrictnessLevel] = useState<number>(5);

  const displayedLatencyRef = useRef<{ val: number }>({ val: mission.indicatedLatencyMs });
  const [animatedLatency, setAnimatedLatency] = useState<number>(mission.indicatedLatencyMs);

  const displayedTokenRef = useRef<{ val: number }>({ val: mission.tokenSavingsPct });
  const [animatedToken, setAnimatedToken] = useState<number>(mission.tokenSavingsPct);

  // Dynamic calculation targets
  const targetLatency = Math.round(
    mission.indicatedLatencyMs * (1 + (confidenceGate - 0.95) * 0.4) + (5 - strictnessLevel) * 2
  );
  const targetToken = Math.min(
    99.2,
    Number((mission.tokenSavingsPct * (swarmTTL / 45) * (confidenceGate / 0.95)).toFixed(1))
  );

  useEffect(() => {
    const t1 = gsap.to(displayedLatencyRef.current, {
      val: targetLatency,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => setAnimatedLatency(Math.round(displayedLatencyRef.current.val)),
    });

    const t2 = gsap.to(displayedTokenRef.current, {
      val: targetToken,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => setAnimatedToken(Number(displayedTokenRef.current.val.toFixed(1))),
    });

    return () => {
      t1.kill();
      t2.kill();
    };
  }, [targetLatency, targetToken]);

  return (
    <div className="rounded-sm border border-slate-200/90 bg-[#f4f8f7] text-slate-900 shadow-2xl p-6 sm:p-8 space-y-6">
      {/* Top Colophon */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-300 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase font-bold tracking-wider text-teal-800">
            <span className="h-2 w-2 rounded-full bg-teal-600 animate-pulse" />
            <span>COLD-ROOM VERIFICATION ENCLAVE // DETERMINISTIC AST INVARIANTS</span>
          </div>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            {station.shortLabel} — {station.name} Gate Verification
          </h3>
          <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
            {station.description}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 font-mono text-xs">
          <span className="rounded-xs bg-teal-100 border border-teal-300 px-2.5 py-1 text-teal-900 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-teal-700" />
            <span>ENCLAVE ARMED · DEC-008</span>
          </span>
          <span className="text-[10px] text-slate-500">
            SLA TARGET: {station.sla}
          </span>
        </div>
      </div>

      {/* Middle Grid: Invariants Checklist (Left) & Parameter Sliders (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Invariant Gate Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-b border-slate-300 pb-1.5">
            <span className="font-semibold uppercase tracking-wider text-slate-700">
              Deterministic Gate Invariants
            </span>
            <span className="text-teal-700 font-bold">100% PASS (FAIL-CLOSED)</span>
          </div>

          <div className="space-y-2">
            {station.invariants.map((inv) => (
              <div
                key={inv.code}
                className="flex items-start gap-3 rounded-xs border border-slate-200 bg-white p-3 shadow-xs"
              >
                <div className="mt-0.5 rounded-full bg-teal-100 p-1 text-teal-700">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10.5px] font-bold text-slate-900">
                      {inv.code}: {inv.label}
                    </span>
                    <span className="font-mono text-[9.5px] text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded-xs border border-teal-200">
                      VERIFIED
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-600">
                    {inv.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xs border border-teal-300/80 bg-teal-50/80 p-3 font-mono text-xs text-teal-900">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4 text-teal-700 shrink-0" />
              <span>{station.statusText}</span>
            </div>
          </div>
        </div>

        {/* Right: Live Parameter Sliders & Tweens (5 cols) */}
        <div className="lg:col-span-5 rounded-xs border border-slate-300 bg-white p-4.5 space-y-4 shadow-sm font-mono">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-teal-700" />
              <span>LEVY PARAMETERS</span>
            </span>
            <span className="text-[10px] text-slate-500">LIVE TWEENING</span>
          </div>

          {/* Slider 1: Confidence Gate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">1. ECE Confidence Gate:</span>
              <span className="font-bold text-teal-700">{(confidenceGate * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0.80}
              max={0.99}
              step={0.01}
              value={confidenceGate}
              onChange={(e) => setConfidenceGate(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-600"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>80% (Lenient)</span>
              <span>95% (Nominal)</span>
              <span>99% (Air-Gapped)</span>
            </div>
          </div>

          {/* Slider 2: Ephemeral Swarm TTL */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">2. Swarm Drone TTL:</span>
              <span className="font-bold text-teal-700">{swarmTTL}s Max</span>
            </div>
            <input
              type="range"
              min={15}
              max={60}
              step={5}
              value={swarmTTL}
              onChange={(e) => setSwarmTTL(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-600"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>15s (Strict)</span>
              <span>45s (Standard)</span>
              <span>60s (Heavy DAG)</span>
            </div>
          </div>

          {/* Slider 3: Invariant Strictness */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">3. Invariant Strictness:</span>
              <span className="font-bold text-teal-700">Level {strictnessLevel}</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={strictnessLevel}
              onChange={(e) => setStrictnessLevel(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-600"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>L1 (Audit Only)</span>
              <span>L3 (Balanced)</span>
              <span>L5 (Zero Trust)</span>
            </div>
          </div>

          {/* GSAP Calculated Metrics Banner */}
          <div className="rounded-xs border border-teal-300 bg-teal-50/70 p-3 flex items-center justify-between">
            <div>
              <span className="text-[9.5px] text-slate-600 uppercase">
                MEASURED VERIFICATION LATENCY:
              </span>
              <div className="text-xl font-extrabold text-teal-800">
                {animatedLatency} ms
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9.5px] text-slate-600 uppercase">
                TOKEN REDUCTION:
              </span>
              <div className="text-xl font-extrabold text-teal-800">
                {animatedToken}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation & Advance Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-300 pt-4 font-mono text-xs">
        <button
          type="button"
          onClick={onSelectMatrix}
          className="cursor-pointer text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold"
        >
          <span>← Back to Hive Matrix</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAdvanceMilestone}
            className="cursor-pointer rounded-xs border border-teal-700 bg-teal-700 px-4 py-2 font-semibold text-white shadow-sm hover:bg-teal-800 transition-all flex items-center gap-1.5"
          >
            <span>Advance Next Milestone</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUBCOMPONENT: LatencyReductionChart (Animated Cubic-Bezier Area Chart)
// ============================================================================

const LATENCY_CHART_POINTS = [
  { x: 30, y: 155, cloudY: 175, time: "00:00", localLat: "42ms" },
  { x: 120, y: 130, cloudY: 180, time: "04:00", localLat: "48ms" },
  { x: 210, y: 80, cloudY: 185, time: "08:00", localLat: "65ms" },
  { x: 300, y: 60, cloudY: 195, time: "12:00", localLat: "78ms" },
  { x: 390, y: 95, cloudY: 180, time: "16:00", localLat: "54ms" },
  { x: 480, y: 45, cloudY: 200, time: "20:00", localLat: "82ms" },
  { x: 560, y: 70, cloudY: 190, time: "24:00", localLat: "62ms" },
];

function LatencyReductionChart() {
  const pathRef = useRef<SVGPathElement | null>(null);
  const points = LATENCY_CHART_POINTS;

  // Construct smooth cubic bezier path
  const splineD = useMemo(() => {
    let d = `M ${LATENCY_CHART_POINTS[0].x} ${LATENCY_CHART_POINTS[0].y}`;
    for (let i = 0; i < LATENCY_CHART_POINTS.length - 1; i++) {
      const p0 = LATENCY_CHART_POINTS[i];
      const p1 = LATENCY_CHART_POINTS[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, []);

  const areaD = `${splineD} L ${points[points.length - 1].x} 210 L ${points[0].x} 210 Z`;

  // Draw-in animation via GSAP
  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = `${len}`;
    pathRef.current.style.strokeDashoffset = `${len}`;

    const tween = gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 1.3,
      ease: "power2.out",
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <svg
        viewBox="0 0 600 230"
        className="w-full h-auto overflow-hidden select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="latency-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="65%" stopColor="#0d3b38" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#060b0e" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="latency-stroke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#00ff9d" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[60, 110, 160, 210].map((y) => (
          <line
            key={y}
            x1="20"
            y1={y}
            x2="580"
            y2={y}
            stroke="#1e293b"
            strokeDasharray="4 6"
            strokeWidth="1"
          />
        ))}

        {/* Filled Area */}
        <path d={areaD} fill="url(#latency-area-grad)" />

        {/* Animated Spline Path */}
        <path
          ref={pathRef}
          d={splineD}
          fill="none"
          stroke="url(#latency-stroke-grad)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Data points & axis labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#060b0e"
              stroke="#10b981"
              strokeWidth="2"
            />
            <text
              x={p.x}
              y="225"
              textAnchor="middle"
              className="font-mono text-[9px] fill-slate-500"
            >
              {p.time}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ============================================================================
// SUBCOMPONENT: MiniSparkline (Compact Matrix Card Sparkline)
// ============================================================================

function MiniSparkline({ data }: { data: number[] }) {
  const width = 120;
  const height = 18;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      <polyline
        fill="none"
        stroke="#10b981"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
