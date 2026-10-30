"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";

interface SimulationScenario {
  id: string;
  name: string;
  badge: string;
  prompt: string;
  system1Response: string;
  system2Dag: { id: string; label: string; room: string; time: string }[];
  policyChecks: { ring: string; name: string; status: "PASS" | "QUARANTINE" | "VERIFIED" }[];
  receiptHash: string;
  latencyMs: number;
}

const SCENARIOS: SimulationScenario[] = [
  {
    id: "offline_voice",
    name: "Voice Meeting Intelligence",
    badge: "16kHz PCM · REAL-TIME",
    prompt: "Summarize 45m offline engineering standup and extract action items into my local journal.",
    system1Response: "Standup audio parsed. I'm extracting 6 action items in the background while keeping our voice channel open.",
    system2Dag: [
      { id: "DAG-01", label: "Stream 16kHz Audio to Offline Whisper Engine", room: "Sensorium", time: "120ms" },
      { id: "DAG-02", label: "Perform Speaker Diarization across 4 Voices", room: "Mind Vault", time: "340ms" },
      { id: "DAG-03", label: "Decompose Commitments into GovernedTask DAG", room: "Planner Nexus", time: "180ms" },
      { id: "DAG-04", label: "Encrypt & Append to Episodic Drawer (AES-256)", room: "Mind Vault", time: "65ms" },
    ],
    policyChecks: [
      { ring: "Ring 0", name: "Hardware Watchdog Latency Guard", status: "PASS" },
      { ring: "Ring 1", name: "Network Scope Firewall (Zero Outbound Egress)", status: "VERIFIED" },
      { ring: "Ring 2", name: "File Path Confinement (/mem/episodic/)", status: "PASS" },
      { ring: "Ring 3", name: "Ed25519 Cryptographic Receipt Generation", status: "VERIFIED" },
      { ring: "Ring 4", name: "Tier 1 Approval Nonce Verification", status: "PASS" },
    ],
    receiptHash: "0x8f2c...7b41 (Ed25519-Signed)",
    latencyMs: 38,
  },
  {
    id: "code_sandbox",
    name: "Quarantined Code Refactor",
    badge: "SANDBOX · ZERO-TRUST",
    prompt: "Audit this Python script for memory leaks, apply optimizations, and verify all tests in quarantine.",
    system1Response: "Source file loaded into quarantine. Running memory leak profiling and test suite in an isolated room.",
    system2Dag: [
      { id: "DAG-01", label: "Mount Ephemeral Copy into Quarantine Sandbox", room: "Quarantine Sanctum", time: "45ms" },
      { id: "DAG-02", label: "Static Analysis & Valgrind Heap Profiling", room: "Quarantine Sanctum", time: "410ms" },
      { id: "DAG-03", label: "Generate Minimal Patch (Diff-Only Candidate)", room: "Planner Nexus", time: "220ms" },
      { id: "DAG-04", label: "Run PyTest Suite (14 Tests Passed)", room: "Quarantine Sanctum", time: "190ms" },
    ],
    policyChecks: [
      { ring: "Ring 0", name: "Emergency Stop Interrupt Available", status: "PASS" },
      { ring: "Ring 1", name: "Process Domain Isolation (eleven_deep confined)", status: "VERIFIED" },
      { ring: "Ring 2", name: "Prohibit Network Sockets in Test Runner", status: "PASS" },
      { ring: "Ring 3", name: "Audit Log Hash Chain Stamped", status: "VERIFIED" },
      { ring: "Ring 4", name: "Present 30s Visual Diff Card to User", status: "PASS" },
    ],
    receiptHash: "0x4a11...99e3 (Ed25519-Signed)",
    latencyMs: 44,
  },
  {
    id: "memory_vault",
    name: "Sovereign Knowledge Index",
    badge: "LOCAL-FIRST · AES-256",
    prompt: "Search my last 6 months of private medical PDFs for blood test iron levels without cloud sync.",
    system1Response: "Scanning your offline Semantic Vault. Found 3 matching lab reports. Your files never left this machine.",
    system2Dag: [
      { id: "DAG-01", label: "Read SQLite Embeddings from Semantic Vault", room: "Mind Vault", time: "18ms" },
      { id: "DAG-02", label: "Vector Cosine Search (dim: 1536, threshold > 0.88)", room: "Planner Nexus", time: "42ms" },
      { id: "DAG-03", label: "Decrypt Target PDF Chunks via Host Master Key", room: "Mind Vault", time: "30ms" },
      { id: "DAG-04", label: "Synthesize Chronological Iron Trend Matrix", room: "Sensorium", time: "85ms" },
    ],
    policyChecks: [
      { ring: "Ring 0", name: "Memory Leak Canary Monitor", status: "PASS" },
      { ring: "Ring 1", name: "Local Loopback Binding Only (127.0.0.1)", status: "VERIFIED" },
      { ring: "Ring 2", name: "Decryption Key Never Exported to LLM Context", status: "PASS" },
      { ring: "Ring 3", name: "Audit Trail Entry Appended", status: "VERIFIED" },
      { ring: "Ring 4", name: "Sovereign Consent Gate Passed", status: "PASS" },
    ],
    receiptHash: "0x1d7e...bf28 (Ed25519-Signed)",
    latencyMs: 22,
  },
];

export function NeuralTraceSimulator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "100px" });
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>(SCENARIOS[0]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const reduced = useReducedMotion();
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance through simulation steps only when visible
  useEffect(() => {
    if (!isSimulating || !inView || reduced) return;

    stepTimerRef.current = setTimeout(() => {
      setActiveStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 2400);

    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, [activeStep, isSimulating, selectedScenario, inView, reduced]);

  const handleScenarioChange = (scenario: SimulationScenario) => {
    setSelectedScenario(scenario);
    setActiveStep(0);
    setIsSimulating(true);
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-sm border border-el-border-strong bg-el-bg-raised p-6 shadow-el-lg sm:p-8 lg:p-10">
      {/* Sci-Fi Ambient Glow Reticles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-el-accent/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-el-violet/5 blur-3xl"
      />

      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-el-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-el-border bg-el-bg px-3 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-el-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-el-accent animate-ping" />
            <span>INTERACTIVE SIMULATION · ILLUSTRATIVE DUAL-MIND TRACE</span>
          </div>
          <h3 className="mt-2 text-el-xl sm:text-el-2xl font-semibold tracking-tight text-el-fg">
            See how a task would flow through ELEVEN
          </h3>
          <p className="mt-1 text-el-xs sm:text-el-sm text-el-fg-muted">
            Observe System 1 voice perception, asynchronous System 2 DAG decomposition, and 5-checkpoint safety policy execution.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setIsSimulating((prev) => !prev)}
            className={`cursor-pointer rounded-xs border px-3 py-1 font-mono text-[10.5px] uppercase tracking-wider transition-all ${
              isSimulating
                ? "border-el-accent/40 bg-el-accent/15 text-el-accent font-semibold"
                : "border-el-border bg-el-bg text-el-fg-muted hover:text-el-fg"
            }`}
          >
            {isSimulating ? "Pause simulation" : "Resume simulation"}
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(0)}
            className="cursor-pointer rounded-xs border border-el-border bg-el-bg px-2.5 py-1 font-mono text-[10.5px] uppercase text-el-fg-muted hover:text-el-fg"
            title="Reset simulation step"
          >
            ↺ RESET
          </button>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        {SCENARIOS.map((sc) => {
          const isSelected = sc.id === selectedScenario.id;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleScenarioChange(sc)}
              className={`group relative cursor-pointer rounded-sm border px-3.5 py-2 text-left font-mono transition-all ${
                isSelected
                  ? "border-el-accent bg-el-bg shadow-[0_0_16px_rgba(0,240,255,0.14)]"
                  : "border-el-border bg-el-bg/50 hover:border-el-border-strong hover:bg-el-bg"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSelected ? "bg-el-accent animate-pulse" : "bg-el-fg-faint"
                  }`}
                />
                <span
                  className={`text-[11px] font-semibold ${
                    isSelected ? "text-el-accent" : "text-el-fg-muted group-hover:text-el-fg"
                  }`}
                >
                  {sc.name}
                </span>
              </div>
              <span className="mt-1 block text-[9.5px] text-el-fg-faint tracking-wider uppercase">
                {sc.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Execution Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 6 Columns: Interactive Prompt & Dual-Mind Perception */}
        <div className="flex flex-col gap-4 lg:col-span-6">
          {/* User Prompt Box */}
          <div className="rounded-sm border border-el-border/80 bg-el-bg p-4 font-mono">
            <div className="flex items-center justify-between text-[10px] text-el-fg-faint uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-el-signal-lime" />
                Sovereign Voice Input // 16kHz PCM
              </span>
              <span>DESIGN TARGET: &lt;50ms</span>
            </div>
            <p className="mt-2.5 font-sans text-el-sm text-el-fg font-medium">
              &ldquo;{selectedScenario.prompt}&rdquo;
            </p>
          </div>

          {/* System 1 Fast Reflex Stream */}
          <div className="rounded-sm border border-el-cyan/30 bg-el-bg/70 p-4 font-mono relative overflow-hidden">
            <div className="flex items-center justify-between text-[10px] text-el-cyan uppercase tracking-wider font-semibold">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-el-cyan opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-el-cyan" />
                </span>
                System 1 Reflex // Audio Synthesizer
              </span>
              <span className="text-el-fg-faint">RESPONSE: &lt;0.5s</span>
            </div>

            <p className="mt-2 text-el-xs text-el-fg-muted leading-relaxed">
              {selectedScenario.system1Response}
            </p>

            {/* Live Audio Equalizer Waveform */}
            <div className="mt-3 flex items-end gap-1 h-3">
              {[0.5, 0.9, 0.4, 1.0, 0.7, 0.3, 0.8, 0.5, 0.9, 0.6, 0.4].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-1 rounded-xs bg-el-cyan"
                  animate={{ height: ["20%", `${h * 100}%`, "20%"] }}
                  transition={{
                    duration: 0.6 + (i % 4) * 0.15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.05,
                  }}
                />
              ))}
              <span className="ml-2 text-[9px] text-el-cyan/80">SPEECH ACTIVE · BARGE-IN READY</span>
            </div>
          </div>

          {/* Policy Invariant Safety Rings */}
          <div className="rounded-sm border border-el-border/80 bg-el-bg p-4 font-mono">
            <div className="flex items-center justify-between text-[10px] text-el-fg-faint uppercase tracking-wider mb-2.5">
              <span>5-Checkpoint PolicyGate Evaluation</span>
              <span className="text-el-signal-lime">FAIL-CLOSED // SAFE</span>
            </div>

            <div className="space-y-1.5">
              {selectedScenario.policyChecks.map((check, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-[10.5px] rounded-xs bg-el-bg-raised/60 px-2 py-1 border border-el-border/50"
                >
                  <span className="text-el-fg-muted font-medium">
                    <span className="text-el-fg-faint mr-1.5">{check.ring}:</span>
                    {check.name}
                  </span>
                  <span
                    className={`font-semibold text-[9.5px] px-1.5 py-0.5 rounded-xs ${
                      check.status === "VERIFIED"
                        ? "bg-el-accent/15 text-el-accent border border-el-accent/30"
                        : "bg-el-signal-lime/15 text-el-signal-lime border border-el-signal-lime/30"
                    }`}
                  >
                    ✓ {check.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 6 Columns: System 2 Background DAG Decomposition */}
        <div className="flex flex-col gap-4 lg:col-span-6">
          <div className="rounded-sm border border-el-violet/30 bg-el-bg/80 p-4 font-mono h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[10px] text-el-violet uppercase tracking-wider font-semibold border-b border-el-border/60 pb-2.5">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-el-violet opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-el-violet" />
                  </span>
                  System 2 Deep Planner // GovernedTaskEngine DAG
                </span>
                <span className="text-el-fg-faint">ASYNCHRONOUS DECOMPOSITION</span>
              </div>

              {/* DAG Execution Pipeline Nodes */}
              <div className="mt-3.5 space-y-2.5">
                {selectedScenario.system2Dag.map((node, idx) => {
                  const isCurrentNode = idx === activeStep;
                  const isPassedNode = idx < activeStep;

                  return (
                    <motion.div
                      key={node.id}
                      className={`relative rounded-sm border p-3 transition-all ${
                        isCurrentNode
                          ? "border-el-accent bg-el-accent/10 shadow-[0_0_14px_rgba(0,240,255,0.12)]"
                          : isPassedNode
                          ? "border-el-signal-lime/40 bg-el-bg-raised/40 opacity-80"
                          : "border-el-border/60 bg-el-bg/30 opacity-50"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-el-fg">
                          {node.id} · {node.room.toUpperCase()}
                        </span>
                        <span className="font-mono text-el-fg-faint">EST: {node.time}</span>
                      </div>

                      <p className="mt-1 text-el-xs text-el-fg font-sans">
                        {node.label}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[9.5px]">
                        <span
                          className={`uppercase tracking-wider ${
                            isCurrentNode
                              ? "text-el-accent font-semibold animate-pulse"
                              : isPassedNode
                              ? "text-el-signal-lime"
                              : "text-el-fg-faint"
                          }`}
                        >
                          {isCurrentNode
                            ? "▶ EXECUTING IN QUARANTINE"
                            : isPassedNode
                            ? "✓ INVARIANT VERIFIED"
                            : "QUEUED DAG NODE"}
                        </span>
                        <span className="text-el-fg-faint font-mono">
                          ROOM: {node.room}
                        </span>
                      </div>

                      {/* Animated Execution Progress Beam */}
                      {isCurrentNode && !reduced && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-el-accent"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2.4, ease: "linear" }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Cryptographic Stamped Receipt Footer */}
            <div className="mt-4 border-t border-el-border/60 pt-3">
              <div className="flex items-center justify-between text-[10px] text-el-fg-faint">
                <span>AUDIT RECEIPT NONCE:</span>
                <span className="text-el-accent font-mono font-semibold">
                  {selectedScenario.receiptHash}
                </span>
              </div>
              <p className="mt-1 text-[9.5px] text-el-fg-faint leading-normal">
                Illustrative example of the signed receipt ELEVEN is designed to produce. Values shown are placeholders, not output from a running system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
