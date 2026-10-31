"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { LayoutGroup, motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Cpu,
  X,
  Fingerprint,
} from "lucide-react";
import { SecurityBentoGrid } from "./SecurityBentoGrid";
import {
  ExplodedArchitectureSection,
  ExplodedLayerData,
} from "./ExplodedArchitectureSection";

const SPRING_TRANSITION = { type: "spring" as const, stiffness: 320, damping: 28 };

export function FlagshipSecurityExperience() {
  // ------------------------------------------------------------------
  // Morph 1 State: Hero Status Pill <-> Live Hive Swarm Inspection Matrix
  // ------------------------------------------------------------------
  const [isHiveExpanded, setIsHiveExpanded] = useState(false);
  const [hiveTtls, setHiveTtls] = useState({
    grokPulse: 240,
    voiceStudio: 180,
    astAuditor: 120,
  });

  // Live countdown for ephemeral drone TTLs
  useEffect(() => {
    if (!isHiveExpanded) return;
    const interval = setInterval(() => {
      setHiveTtls((prev) => ({
        grokPulse: prev.grokPulse > 1 ? prev.grokPulse - 1 : 240,
        voiceStudio: prev.voiceStudio > 1 ? prev.voiceStudio - 1 : 180,
        astAuditor: prev.astAuditor > 1 ? prev.astAuditor - 1 : 120,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isHiveExpanded]);

  // ------------------------------------------------------------------
  // Morph 2 State: Bento Threat Pill <-> Cold-Room DEC-008 Modal
  // ------------------------------------------------------------------
  const [isDec008Open, setIsDec008Open] = useState(false);
  const [activeTraceId, setActiveTraceId] = useState<string>("#trace_8f2a");
  const [coolingSeconds, setCoolingSeconds] = useState(5.0);
  const [isApproved, setIsApproved] = useState(false);
  const [isDenied, setIsDenied] = useState(false);

  // 5-second Cooling-Off Ring Timer
  useEffect(() => {
    if (!isDec008Open || isApproved || isDenied) {
      return;
    }

    const interval = setInterval(() => {
      setCoolingSeconds((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          return 0;
        }
        return Math.round((prev - 0.1) * 10) / 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isDec008Open, isApproved, isDenied]);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenDec008 = (traceId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveTraceId(traceId);
    setIsApproved(false);
    setIsDenied(false);
    setCoolingSeconds(5.0);
    setIsDec008Open(true);
  };

  const handleCloseDec008 = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsDec008Open(false);
    setCoolingSeconds(5.0);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
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
                className="group cursor-pointer relative flex items-center gap-3.5 rounded-full border border-cyan-500/30 bg-[#091118]/90 px-5 py-2.5 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-colors backdrop-blur-xl"
              >
                {/* 3 Physical Status Dots with Layout IDs */}
                <div className="flex items-center gap-2">
                  <motion.span
                    layoutId="drone-node-1"
                    transition={SPRING_TRANSITION}
                    className="h-2.5 w-2.5 rounded-full bg-[#06b6d4] shadow-[0_0_6px_#06b6d4]"
                  />
                  <motion.span
                    layoutId="drone-node-2"
                    transition={SPRING_TRANSITION}
                    className="h-2.5 w-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_6px_#f59e0b]"
                  />
                  <motion.span
                    layoutId="drone-node-3"
                    transition={SPRING_TRANSITION}
                    className="h-2.5 w-2.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]"
                  />
                </div>

                <motion.span
                  layout="position"
                  className="font-mono text-xs font-medium text-slate-200"
                >
                  Active Hive: 3 Ephemeral Drones
                </motion.span>

                <span className="font-mono text-xs text-slate-600">|</span>

                <motion.span
                  layout="position"
                  className="font-mono text-xs text-emerald-400 font-semibold"
                >
                  L5 Armed
                </motion.span>

                <span className="font-mono text-[10px] text-cyan-300 group-hover:translate-x-0.5 transition-transform ml-1">
                  Inspect Swarm ↗
                </span>
              </motion.button>
            ) : (
              // Expanded Glassmorphic 3-Column Hive Swarm Inspection Matrix
              <motion.div
                key="hive-matrix"
                layoutId="hive-morph-shell"
                transition={SPRING_TRANSITION}
                className="w-full max-w-4xl rounded-2xl border border-cyan-500/40 bg-[#070d12]/95 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-2xl relative overflow-hidden"
              >
                {/* Top Matrix Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#17232d] pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <motion.h3
                        layout="position"
                        className="font-mono text-sm font-semibold tracking-wider text-slate-100 uppercase"
                      >
                        Live Hive Swarm Inspection Matrix
                      </motion.h3>
                      <motion.p
                        layout="position"
                        className="font-mono text-[11px] text-slate-400"
                      >
                        SPEC INV-03: Ephemeral Worker Triad · Isolated Capability Tokens
                      </motion.p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsHiveExpanded(false)}
                    className="cursor-pointer flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 font-mono text-xs text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                  >
                    <span>Collapse to Pill</span>
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* 3 Drone Cards with Transferred Status Dots */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Drone 1: GROK_PULSE (Cyan) */}
                  <div className="rounded-xl border border-cyan-500/30 bg-[#091118] p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between border-b border-[#17232d] pb-2.5 mb-2.5">
                        <div className="flex items-center gap-2">
                          <motion.span
                            layoutId="drone-node-1"
                            transition={SPRING_TRANSITION}
                            className="h-3 w-3 rounded-full bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]"
                          />
                          <span className="font-mono text-xs font-bold text-cyan-300">
                            GROK_PULSE
                          </span>
                        </div>
                        <span className="rounded-xs bg-cyan-950 px-1.5 py-0.5 font-mono text-[9px] text-cyan-400">
                          PID 4192
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Continuous 16kHz acoustic triage, voice activity detection, and instant turn
                        preemption.
                      </p>
                    </div>

                    <div className="space-y-1.5 rounded-md bg-[#04080c] p-2.5 font-mono text-[10px]">
                      <div className="flex justify-between text-slate-400">
                        <span>LIVE TTL:</span>
                        <span className="text-cyan-400 font-semibold">
                          {hiveTtls.grokPulse}s remaining
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>CAP TOKEN:</span>
                        <span className="text-slate-200">CAP_NET_READ_VAD</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>MEMORY:</span>
                        <span className="text-emerald-400">42MB / 128MB</span>
                      </div>
                    </div>
                  </div>

                  {/* Drone 2: VOICESTUDIO_AGENT (Amber) */}
                  <div className="rounded-xl border border-amber-500/30 bg-[#091118] p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between border-b border-[#17232d] pb-2.5 mb-2.5">
                        <div className="flex items-center gap-2">
                          <motion.span
                            layoutId="drone-node-2"
                            transition={SPRING_TRANSITION}
                            className="h-3 w-3 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]"
                          />
                          <span className="font-mono text-xs font-bold text-amber-300">
                            VOICESTUDIO_AGENT
                          </span>
                        </div>
                        <span className="rounded-xs bg-amber-950 px-1.5 py-0.5 font-mono text-[9px] text-amber-400">
                          PID 8412
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Speculative dual-mind audio synthesizer streaming phoneme chunks with &lt;300ms
                        latency.
                      </p>
                    </div>

                    <div className="space-y-1.5 rounded-md bg-[#04080c] p-2.5 font-mono text-[10px]">
                      <div className="flex justify-between text-slate-400">
                        <span>LIVE TTL:</span>
                        <span className="text-amber-400 font-semibold">
                          {hiveTtls.voiceStudio}s remaining
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>CAP TOKEN:</span>
                        <span className="text-slate-200">CAP_AUDIO_STREAM_PCM</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>BUFFER:</span>
                        <span className="text-emerald-400">Lockless Ring Nominal</span>
                      </div>
                    </div>
                  </div>

                  {/* Drone 3: AST_AUDITOR (Emerald) */}
                  <div className="rounded-xl border border-emerald-500/30 bg-[#091118] p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between border-b border-[#17232d] pb-2.5 mb-2.5">
                        <div className="flex items-center gap-2">
                          <motion.span
                            layoutId="drone-node-3"
                            transition={SPRING_TRANSITION}
                            className="h-3 w-3 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]"
                          />
                          <span className="font-mono text-xs font-bold text-emerald-300">
                            AST_AUDITOR
                          </span>
                        </div>
                        <span className="rounded-xs bg-emerald-950 px-1.5 py-0.5 font-mono text-[9px] text-emerald-400">
                          PID 9024
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Deterministic code AST validator checking write operations against the 15
                        invariant rules.
                      </p>
                    </div>

                    <div className="space-y-1.5 rounded-md bg-[#04080c] p-2.5 font-mono text-[10px]">
                      <div className="flex justify-between text-slate-400">
                        <span>LIVE TTL:</span>
                        <span className="text-emerald-400 font-semibold">
                          {hiveTtls.astAuditor}s remaining
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>CAP TOKEN:</span>
                        <span className="text-slate-200">CAP_AST_STATIC_VERIFY</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>EGRESS:</span>
                        <span className="text-emerald-400">Zero Socket Allowed</span>
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
            >
              <motion.div
                layoutId="dec008-morph-card"
                transition={SPRING_TRANSITION}
                className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[#f4f8f7] text-slate-900 shadow-2xl p-6 sm:p-8"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-slate-300/80 pb-5 mb-5">
                  <div className="flex items-center gap-3">
                    <motion.div
                      layoutId="dec008-lock-icon"
                      transition={SPRING_TRANSITION}
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-[#f4f8f7]"
                    >
                      <Lock className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <motion.h3
                        layout="position"
                        className="font-mono text-base font-bold uppercase tracking-wider text-slate-900"
                      >
                        Cold-Room Protocol D (DEC-008)
                      </motion.h3>
                      <motion.p
                        layout="position"
                        className="font-mono text-xs text-slate-600"
                      >
                        Hardware-Bound Nonce Gate · Trace ID: {activeTraceId}
                      </motion.p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseDec008}
                    className="cursor-pointer rounded-md p-1.5 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Diff & Immutable Digest */}
                <div className="space-y-4">
                  <div className="rounded-md border border-slate-300 bg-white p-4 font-mono text-xs space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-500 border-b border-slate-100 pb-1.5">
                      <span>CANONICAL_PROPOSAL_DIFF</span>
                      <span className="font-semibold text-rose-600">TIER 3 ESCALATION</span>
                    </div>

                    <p className="font-bold text-slate-800">
                      Target: /etc/systemd/system/agent.service
                    </p>

                    <div className="bg-slate-50 rounded p-2 text-[11px] space-y-1 font-mono">
                      <p className="text-emerald-700">
                        + ExecStart=/usr/local/bin/eleven --isolated-egress
                      </p>
                      <p className="text-rose-700">
                        - ExecStart=/usr/bin/python3 -m untrusted_agent
                      </p>
                      <p className="text-slate-600 pt-1">
                        Blast Radius: 1 daemon · Egress: 0 sockets allowed
                      </p>
                    </div>

                    <p className="text-[10px] text-slate-500 break-all pt-1 border-t border-slate-100">
                      <span className="font-semibold text-slate-700">args_sha256: </span>
                      7e9a2b84f046200ab4376c991823d4310d7e52a94f1c1fdb119a081a
                    </p>
                  </div>

                  {/* 5-Second SVG Radial Cooling-Off Ring */}
                  <div className="flex items-center gap-4 rounded-lg bg-amber-50 border border-amber-200 p-4">
                    <div className="relative h-12 w-12 shrink-0">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
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
                          className="transition-all duration-100"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold text-orange-800">
                        {coolingSeconds > 0 ? `${coolingSeconds}s` : "0s"}
                      </span>
                    </div>

                    <div>
                      <p className="font-mono text-xs font-semibold text-orange-950">
                        Deliberate Human Contemplation Window (5.0s Ring)
                      </p>
                      <p className="text-[11.5px] text-orange-800 mt-0.5">
                        {coolingSeconds > 0
                          ? `Cooling-off active: Confirmation buttons unlock in ${coolingSeconds}s to prevent muscle-memory clicks.`
                          : "Cooling period elapsed. Cryptographic approval tokens unlocked."}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-300">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDenied(true);
                        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                        closeTimeoutRef.current = setTimeout(handleCloseDec008, 600);
                      }}
                      className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-mono text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      {isDenied ? "Quarantined & Killed" : "Deny & Terminate Process"}
                    </button>

                    <button
                      type="button"
                      disabled={coolingSeconds > 0}
                      onClick={() => {
                        setIsApproved(true);
                        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                        closeTimeoutRef.current = setTimeout(handleCloseDec008, 700);
                      }}
                      className="cursor-pointer flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 font-mono text-xs font-semibold text-white hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                    >
                      <Fingerprint className="h-4 w-4 text-emerald-400" />
                      <span>
                        {isApproved
                          ? "Nonce Cryptographically Verified"
                          : coolingSeconds > 0
                          ? `Wait ${coolingSeconds}s...`
                          : "Approve with Bound Mobile"}
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
