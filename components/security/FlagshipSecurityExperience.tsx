"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Cpu,
  Fingerprint,
  Lock,
  X,
} from "lucide-react";
import {
  ExplodedArchitectureSection,
  ExplodedLayerData,
} from "./ExplodedArchitectureSection";
import { SecurityBentoGrid } from "./SecurityBentoGrid";

const SPRING_TRANSITION = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
};

export function FlagshipSecurityExperience() {
  // ------------------------------------------------------------------
  // Morph 1 State: Hero Telemetry Pill <-> Live Hive Swarm Matrix
  // ------------------------------------------------------------------
  const [isHiveExpanded, setIsHiveExpanded] = useState(false);
  const [hiveTtls, setHiveTtls] = useState({
    grokPulse: 42,
    voiceStudio: 28,
    astAuditor: 15,
  });

  // Countdown timer for simulated ephemeral subagents
  useEffect(() => {
    const timer = setInterval(() => {
      setHiveTtls((prev) => ({
        grokPulse: prev.grokPulse <= 1 ? 45 : prev.grokPulse - 1,
        voiceStudio: prev.voiceStudio <= 1 ? 30 : prev.voiceStudio - 1,
        astAuditor: prev.astAuditor <= 1 ? 20 : prev.astAuditor - 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ------------------------------------------------------------------
  // Morph 2 State: Bento "Test Mitigation" <-> DEC-008 Cold-Room Sheet
  // ------------------------------------------------------------------
  const [isDec008Open, setIsDec008Open] = useState(false);
  const [activeTraceId, setActiveTraceId] = useState<string>("TR-8941");
  const [coolingSeconds, setCoolingSeconds] = useState<number>(5);
  const [isApproved, setIsApproved] = useState(false);
  const [isDenied, setIsDenied] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenDec008 = (traceId: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveTraceId(traceId);
    setCoolingSeconds(5);
    setIsApproved(false);
    setIsDenied(false);
    setIsDec008Open(true);
  };

  const handleCloseDec008 = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsDec008Open(false);
  };

  // 5-second deliberate human contemplation countdown (DEC-008 Spec)
  useEffect(() => {
    if (!isDec008Open) return;
    const interval = setInterval(() => {
      setCoolingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isDec008Open]);

  // Clean up any pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // ------------------------------------------------------------------
  // Morph 3 State: 3D Isometric Layer <-> Front-Facing Spec Inspector
  // ------------------------------------------------------------------
  const [selectedLayer, setSelectedLayer] = useState<ExplodedLayerData | null>(null);

  return (
    <LayoutGroup id="eleven-flagship-showcase">
      <div className="relative w-full space-y-12">
        {/* ========================================================= */}
        {/* MORPH 1: Hero Telemetry Pill -> Live Hive Swarm Matrix    */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!isHiveExpanded ? (
              // Compact Floating Status Pill
              <motion.button
                key="hive-pill"
                layoutId="hive-morph-shell"
                transition={SPRING_TRANSITION}
                onClick={() => setIsHiveExpanded(true)}
                className="group cursor-pointer relative flex items-center gap-3.5 rounded-full border border-el-border bg-el-sec-graphite px-4 py-2 shadow-sm hover:border-el-border-strong transition-colors duration-200 backdrop-blur-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime active:scale-[0.99] disabled:opacity-50"
              >
                {/* 3 Physical Status Dots with Layout IDs */}
                <div className="flex items-center gap-1.5">
                  <motion.span
                    layoutId="drone-node-1"
                    transition={SPRING_TRANSITION}
                    className="h-2 w-2 rounded-full bg-cyan-400"
                  />
                  <motion.span
                    layoutId="drone-node-2"
                    transition={SPRING_TRANSITION}
                    className="h-2 w-2 rounded-full bg-amber-400"
                  />
                  <motion.span
                    layoutId="drone-node-3"
                    transition={SPRING_TRANSITION}
                    className="h-2 w-2 rounded-full bg-el-sec-lime"
                  />
                </div>

                <motion.span
                  layout="position"
                  className="text-xs font-medium text-el-sec-porcelain"
                >
                  Active hive: 3 ephemeral drones
                </motion.span>

                <span className="text-xs text-el-fg-faint">·</span>

                <motion.span
                  layout="position"
                  className="text-xs text-el-sec-lime font-medium"
                >
                  L5 armed
                </motion.span>

                <span className="text-xs text-el-fg-faint group-hover:text-el-sec-porcelain transition-colors ml-1">
                  Inspect swarm
                </span>
              </motion.button>
            ) : (
              // Expanded Glassmorphic 3-Column Hive Swarm Inspection Matrix
              <motion.div
                key="hive-matrix"
                layoutId="hive-morph-shell"
                transition={SPRING_TRANSITION}
                className="w-full max-w-4xl rounded-md border border-el-border bg-el-sec-graphite-deep p-6 sm:p-8 shadow-md backdrop-blur-2xl relative overflow-hidden"
              >
                {/* Top Matrix Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-el-border pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-el-sec-graphite border border-el-border text-el-sec-lime">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <motion.h3
                        layout="position"
                        className="text-sm font-semibold text-el-sec-porcelain"
                      >
                        Live Hive Swarm Inspection Matrix
                      </motion.h3>
                      <motion.p
                        layout="position"
                        className="text-xs text-el-fg-faint"
                      >
                        SPEC INV-03: Ephemeral worker triad · Isolated capability tokens
                      </motion.p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsHiveExpanded(false)}
                    className="cursor-pointer flex items-center gap-1.5 rounded-sm border border-el-border bg-el-sec-graphite px-3 py-1.5 text-xs text-el-fg-muted hover:text-el-sec-porcelain hover:border-el-border-strong transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime active:scale-[0.99] disabled:opacity-50"
                  >
                    <span>Collapse to pill</span>
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* 3 Drone Cards with Transferred Status Dots */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Drone 1: GROK_PULSE */}
                  <div className="rounded-md border border-el-border bg-el-sec-graphite p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between border-b border-el-border pb-2.5 mb-2.5">
                        <div className="flex items-center gap-2">
                          <motion.span
                            layoutId="drone-node-1"
                            transition={SPRING_TRANSITION}
                            className="h-2.5 w-2.5 rounded-full bg-cyan-400"
                          />
                          <span className="text-xs font-semibold text-el-sec-porcelain">
                            GROK_PULSE
                          </span>
                        </div>
                        <span className="rounded-xs bg-el-sec-graphite-deep px-1.5 py-0.5 font-mono text-[10px] text-el-fg-faint">
                          PID 4192
                        </span>
                      </div>
                      <p className="text-xs text-el-fg-muted leading-relaxed">
                        Continuous 16kHz acoustic triage, voice activity detection, and instant turn
                        preemption.
                      </p>
                    </div>

                    <div className="space-y-1.5 rounded-sm bg-el-sec-graphite-deep p-2.5 text-xs">
                      <div className="flex justify-between text-el-fg-faint">
                        <span>Live TTL:</span>
                        <span className="text-el-sec-lime text-xs">
                          <code className="font-mono text-[11px]">{hiveTtls.grokPulse}s</code> remaining
                        </span>
                      </div>
                      <div className="flex justify-between text-el-fg-faint">
                        <span>Cap token:</span>
                        <code className="text-el-fg-muted font-mono text-[10px]">CAP_NET_READ_VAD</code>
                      </div>
                      <div className="flex justify-between text-el-fg-faint">
                        <span>Memory:</span>
                        <span className="text-el-sec-lime text-xs">42MB / 128MB</span>
                      </div>
                    </div>
                  </div>

                  {/* Drone 2: VOICESTUDIO_AGENT */}
                  <div className="rounded-md border border-el-border bg-el-sec-graphite p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between border-b border-el-border pb-2.5 mb-2.5">
                        <div className="flex items-center gap-2">
                          <motion.span
                            layoutId="drone-node-2"
                            transition={SPRING_TRANSITION}
                            className="h-2.5 w-2.5 rounded-full bg-amber-400"
                          />
                          <span className="text-xs font-semibold text-el-sec-porcelain">
                            VOICESTUDIO_AGENT
                          </span>
                        </div>
                        <span className="rounded-xs bg-el-sec-graphite-deep px-1.5 py-0.5 font-mono text-[10px] text-el-fg-faint">
                          PID 8412
                        </span>
                      </div>
                      <p className="text-xs text-el-fg-muted leading-relaxed">
                        Speculative dual-mind audio synthesizer streaming phoneme chunks with &lt;300ms
                        latency.
                      </p>
                    </div>

                    <div className="space-y-1.5 rounded-sm bg-el-sec-graphite-deep p-2.5 text-xs">
                      <div className="flex justify-between text-el-fg-faint">
                        <span>Live TTL:</span>
                        <span className="text-el-sec-lime text-xs">
                          <code className="font-mono text-[11px]">{hiveTtls.voiceStudio}s</code> remaining
                        </span>
                      </div>
                      <div className="flex justify-between text-el-fg-faint">
                        <span>Cap token:</span>
                        <code className="text-el-fg-muted font-mono text-[10px]">CAP_AUDIO_STREAM_PCM</code>
                      </div>
                      <div className="flex justify-between text-el-fg-faint">
                        <span>Buffer:</span>
                        <span className="text-el-sec-lime text-xs">Lockless ring nominal</span>
                      </div>
                    </div>
                  </div>

                  {/* Drone 3: AST_AUDITOR */}
                  <div className="rounded-md border border-el-border bg-el-sec-graphite p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between border-b border-el-border pb-2.5 mb-2.5">
                        <div className="flex items-center gap-2">
                          <motion.span
                            layoutId="drone-node-3"
                            transition={SPRING_TRANSITION}
                            className="h-2.5 w-2.5 rounded-full bg-el-sec-lime"
                          />
                          <span className="text-xs font-semibold text-el-sec-porcelain">
                            AST_AUDITOR
                          </span>
                        </div>
                        <span className="rounded-xs bg-el-sec-graphite-deep px-1.5 py-0.5 font-mono text-[10px] text-el-fg-faint">
                          PID 9024
                        </span>
                      </div>
                      <p className="text-xs text-el-fg-muted leading-relaxed">
                        Deterministic code AST validator checking write operations against the 15
                        invariant rules.
                      </p>
                    </div>

                    <div className="space-y-1.5 rounded-sm bg-el-sec-graphite-deep p-2.5 text-xs">
                      <div className="flex justify-between text-el-fg-faint">
                        <span>Live TTL:</span>
                        <span className="text-el-sec-lime text-xs">
                          <code className="font-mono text-[11px]">{hiveTtls.astAuditor}s</code> remaining
                        </span>
                      </div>
                      <div className="flex justify-between text-el-fg-faint">
                        <span>Cap token:</span>
                        <code className="text-el-fg-muted font-mono text-[10px]">CAP_AST_STATIC_VERIFY</code>
                      </div>
                      <div className="flex justify-between text-el-fg-faint">
                        <span>Egress:</span>
                        <span className="text-el-sec-lime text-xs">Zero socket allowed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================= */}
        {/* SECTION A: Scroll-Scrubbed 3D Exploded Architecture Stack */}
        {/* ========================================================= */}
        <ExplodedArchitectureSection
          selectedLayer={selectedLayer}
          onSelectLayer={setSelectedLayer}
        />

        {/* ========================================================= */}
        {/* SECTION B: Interactive Live Threat Interception Bento     */}
        {/* ========================================================= */}
        <SecurityBentoGrid
          isDec008Open={isDec008Open}
          onOpenDec008Modal={handleOpenDec008}
        />

        {/* ========================================================= */}
        {/* MORPH 2: Cold-Room DEC-008 Hardware Sheet Modal           */}
        {/* ========================================================= */}
        <AnimatePresence>
          {isDec008Open && (
            <motion.div
              key="dec008-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85"
            >
              <motion.div
                layoutId="dec008-morph-card"
                transition={SPRING_TRANSITION}
                className="relative w-full max-w-2xl overflow-hidden rounded-md bg-el-sec-porcelain text-el-sec-graphite shadow-2xl p-6 sm:p-8"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-el-border pb-5 mb-5">
                  <div className="flex items-center gap-3">
                    <motion.div
                      layoutId="dec008-lock-icon"
                      transition={SPRING_TRANSITION}
                      className="flex h-9 w-9 items-center justify-center rounded-sm bg-el-sec-graphite text-el-sec-porcelain"
                    >
                      <Lock className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <motion.h3
                        layout="position"
                        className="text-base font-semibold tracking-tight text-el-sec-graphite"
                      >
                        Cold-Room Protocol D (DEC-008)
                      </motion.h3>
                      <motion.p
                        layout="position"
                        className="text-xs text-el-sec-graphite/70"
                      >
                        Hardware-Bound Nonce Gate · Trace ID: <span className="font-mono">{activeTraceId}</span>
                      </motion.p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseDec008}
                    className="cursor-pointer rounded-xs p-1.5 text-el-sec-graphite/60 hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-graphite active:scale-[0.99] disabled:opacity-50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Diff & Immutable Digest */}
                <div className="space-y-4">
                  <div className="rounded-sm border border-el-border bg-white p-4 text-xs space-y-2">
                    <div className="flex justify-between text-[11px] text-el-sec-graphite/60 border-b border-el-border pb-1.5">
                      <span>Canonical proposal diff</span>
                      <span className="font-semibold text-rose-600">Tier 3 escalation</span>
                    </div>

                    <p className="font-semibold text-el-sec-graphite">
                      Target: <code className="font-mono text-xs">/etc/systemd/system/agent.service</code>
                    </p>

                    <div className="bg-el-sec-porcelain/60 rounded p-2 text-[11px] space-y-1 font-mono">
                      <p className="text-emerald-700">
                        + ExecStart=/usr/local/bin/eleven --isolated-egress
                      </p>
                      <p className="text-rose-700">
                        - ExecStart=/usr/bin/python3 -m untrusted_agent
                      </p>
                      <p className="text-el-sec-graphite/70 pt-1 font-sans text-xs">
                        Blast Radius: 1 daemon · Egress: 0 sockets allowed
                      </p>
                    </div>

                    <p className="text-[10px] text-el-sec-graphite/60 break-all pt-1 border-t border-el-border font-mono">
                      <span className="font-semibold text-el-sec-graphite">args_sha256: </span>
                      7e9a2b84f046200ab4376c991823d4310d7e52a94f1c1fdb119a081a
                    </p>
                  </div>

                  {/* 5-Second SVG Radial Cooling-Off Ring */}
                  <div className="flex items-center gap-4 rounded-sm bg-amber-50 border border-amber-200 p-4">
                    <div className="relative h-12 w-12 shrink-0">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="#fed7aa"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="#ea580c"
                          strokeWidth="3"
                          strokeDasharray="94.2"
                          strokeDashoffset={94.2 * (coolingSeconds / 5.0)}
                          strokeLinecap="round"
                          className="transition-[stroke-dashoffset] duration-100"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-orange-800">
                        {coolingSeconds > 0 ? `${coolingSeconds}s` : "0s"}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-orange-950">
                        Deliberate Human Contemplation Window (5.0s Ring)
                      </p>
                      <p className="text-xs text-orange-800 mt-0.5">
                        {coolingSeconds > 0
                          ? `Cooling-off active: Confirmation buttons unlock in ${coolingSeconds}s to prevent muscle-memory clicks.`
                          : "Cooling period elapsed. Cryptographic approval tokens unlocked."}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-el-border">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDenied(true);
                        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                        closeTimeoutRef.current = setTimeout(handleCloseDec008, 600);
                      }}
                      className="cursor-pointer rounded-sm border border-el-border bg-white px-4 py-2 text-xs font-medium text-el-sec-graphite hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-graphite active:scale-[0.99] disabled:opacity-50"
                    >
                      {isDenied ? "Quarantined & killed" : "Deny & terminate process"}
                    </button>

                    <button
                      type="button"
                      disabled={coolingSeconds > 0}
                      onClick={() => {
                        setIsApproved(true);
                        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                        closeTimeoutRef.current = setTimeout(handleCloseDec008, 700);
                      }}
                      className="cursor-pointer flex items-center gap-2 rounded-sm bg-el-sec-graphite px-5 py-2 text-xs font-medium text-el-sec-porcelain hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime active:scale-[0.99]"
                    >
                      <Fingerprint className="h-4 w-4 text-el-sec-lime" />
                      <span>
                        {isApproved
                          ? "Nonce cryptographically verified"
                          : coolingSeconds > 0
                          ? `Wait ${coolingSeconds}s...`
                          : "Approve with bound mobile"}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
