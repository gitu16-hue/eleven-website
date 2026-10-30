"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Terminal,
  Zap,
  Activity,
  AlertTriangle,
  RotateCcw,
  Radio,
  Eye,
  EyeOff,
  Cpu,
  KeyRound,
  FileCode,
  CheckCircle2,
} from "lucide-react";

interface SecurityBentoGridProps {
  onOpenDec008Modal?: (traceId: string) => void;
  isDec008Open?: boolean;
}

const CIPHER_CHARS = "ABCDEF0123456789!@#$%&*<>/~=";

export function SecurityBentoGrid({
  onOpenDec008Modal,
  isDec008Open = false,
}: SecurityBentoGridProps) {
  // Cursor tracking for radial spotlight across obsidian grid
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  // -------------------------------------------------------------
  // CARD 1: Outbound Privacy Scrubber State & Logic
  // -------------------------------------------------------------
  const [isScrubbed, setIsScrubbed] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scrambleKey, setScrambleKey] = useState("sk-live-98a72cf1904b");
  const [scrambleEntity, setScrambleEntity] = useState("GreySquare LLP");
  const [scrambleVal, setScrambleVal] = useState("₹4,80,000");

  const runScrubberScan = useCallback(() => {
    setIsScanning(true);
    let iterations = 0;
    const interval = setInterval(() => {
      iterations++;
      setScrambleKey(
        Array.from({ length: 16 }, () =>
          CIPHER_CHARS.charAt(Math.floor(Math.random() * CIPHER_CHARS.length))
        ).join("")
      );
      setScrambleEntity(
        Array.from({ length: 13 }, () =>
          CIPHER_CHARS.charAt(Math.floor(Math.random() * CIPHER_CHARS.length))
        ).join("")
      );
      setScrambleVal(
        Array.from({ length: 9 }, () =>
          CIPHER_CHARS.charAt(Math.floor(Math.random() * CIPHER_CHARS.length))
        ).join("")
      );

      if (iterations >= 8) {
        clearInterval(interval);
        setIsScanning(false);
        setIsScrubbed(true);
        setScrambleKey("[VAULT_KEY_01]");
        setScrambleEntity("[ENTITY_A]");
        setScrambleVal("[VAL_REDACTED]");
      }
    }, 45);
  }, []);

  // Auto-sweep scanline every 4 seconds if nominal
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isScanning) {
        runScrubberScan();
      }
    }, 4500);
    return () => clearInterval(timer);
  }, [runScrubberScan, isScanning]);

  // -------------------------------------------------------------
  // CARD 2: Default-Deny Egress Shield State
  // -------------------------------------------------------------
  const [egressPackets, setEgressPackets] = useState<
    Array<{ id: number; type: "GET_SAFE" | "POST_BLOCKED"; progress: number }>
  >([
    { id: 1, type: "GET_SAFE", progress: 0.1 },
    { id: 2, type: "POST_BLOCKED", progress: 0.5 },
  ]);
  const [forcefieldRipple, setForcefieldRipple] = useState(false);
  const [blockedAlertVisible, setBlockedAlertVisible] = useState(true);

  useEffect(() => {
    const loop = setInterval(() => {
      setEgressPackets((prev) =>
        prev.map((pkt) => {
          let nextProgress = pkt.progress + 0.04;
          if (pkt.type === "POST_BLOCKED" && nextProgress >= 0.52 && nextProgress < 0.6) {
            setForcefieldRipple(true);
            setBlockedAlertVisible(true);
            setTimeout(() => setForcefieldRipple(false), 450);
          }
          if (nextProgress > 1) {
            return {
              id: Date.now() + Math.random(),
              type: Math.random() > 0.45 ? "POST_BLOCKED" : "GET_SAFE",
              progress: 0,
            };
          }
          return { ...pkt, progress: nextProgress };
        })
      );
    }, 70);

    return () => clearInterval(loop);
  }, []);

  // -------------------------------------------------------------
  // CARD 4: Watchdog Kill Switch State
  // -------------------------------------------------------------
  const [isSevered, setIsSevered] = useState(false);
  const [shockwave, setShockwave] = useState(false);
  const [severDuration, setSeverDuration] = useState<number | null>(null);

  const triggerKillswitch = () => {
    const start = performance.now();
    setShockwave(true);
    setIsSevered(true);
    const end = performance.now();
    setSeverDuration(Math.max(12.4, Math.round((end - start + 11.8) * 10) / 10));
    setTimeout(() => setShockwave(false), 600);
  };

  const rearmWatchdog = () => {
    setIsSevered(false);
    setSeverDuration(null);
  };

  return (
    <div
      ref={gridRef}
      onMouseMove={handleMouseMove}
      className="relative rounded-2xl border border-[#17232d] bg-[#070d12] p-5 sm:p-7 lg:p-9 shadow-2xl overflow-hidden"
      style={
        {
          "--mouse-x": `${mousePos.x}px`,
          "--mouse-y": `${mousePos.y}px`,
        } as React.CSSProperties
      }
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at var(--mouse-x, 200px) var(--mouse-y, 200px), rgba(16, 185, 129, 0.07), transparent 70%)`,
        }}
      />

      {/* Top Banner with Architecture Context */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#17232d] pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xs border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-400 font-semibold">
                ELEVEN L5 HYPERVISOR MATRIX
              </span>
              <span className="rounded-xs border border-[#1c2d3a] bg-[#0a141d] px-1.5 py-0.5 font-mono text-[9.5px] text-slate-400">
                ZERO-TRUST RUNTIME
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live Threat Interception Bento · 4 Isolated Boundary Controllers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/30 px-3 py-1 font-mono text-[10px] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            4 ENCLAVES ACTIVE
          </span>
          <span className="font-mono text-[10px] text-slate-500 hidden sm:inline">
            POLICY_VER: 3.1-DEC008
          </span>
        </div>
      </div>

      {/* 4-Card Dark Obsidian Bento Grid */}
      <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-12">
        {/* ========================================================= */}
        {/* CARD 1: Outbound Privacy Scrubber (Span 7 cols)          */}
        {/* ========================================================= */}
        <div className="group relative overflow-hidden rounded-xl border border-[#17232d] bg-[#091118]/80 p-5 lg:p-6 transition-all duration-300 hover:border-emerald-500/40 xl:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#17232d]/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-400">
                  CARD 01 · OUTBOUND PRIVACY SCRUBBER
                </span>
                <span className="rounded-xs bg-[#0f1d27] px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                  SPEC INV-05
                </span>
              </div>
              <button
                type="button"
                onClick={runScrubberScan}
                disabled={isScanning}
                className="cursor-pointer flex items-center gap-1.5 rounded-xs border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1 font-mono text-[10px] text-emerald-300 hover:bg-emerald-900/50 transition-colors disabled:opacity-50"
              >
                <Zap className="h-3 w-3" />
                {isScanning ? "Scrubbing..." : "Force Scan"}
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Before prompt fragments leave the device, zero-knowledge regex sweeps redact keys,
              personal identities, and financial figures into reversible local tokens.
            </p>

            {/* Prompt Code Box with Animated Emerald Laser Scanline */}
            <div className="relative overflow-hidden rounded-md border border-[#17232d] bg-[#04080c] p-4 font-mono text-xs text-slate-300">
              {/* Animated Laser Bar */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    initial={{ top: "-10%" }}
                    animate={{ top: "110%" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="pointer-events-none absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] z-20"
                  />
                )}
              </AnimatePresence>

              <div className="space-y-2 text-[11.5px] leading-relaxed">
                <p className="text-slate-400">
                  <span className="text-slate-500">USER_PROMPT &gt;</span> Analyze balance sheet for{" "}
                  <span
                    className={`inline-block font-semibold px-1.5 py-0.5 rounded-xs transition-colors duration-200 ${
                      isScrubbed
                        ? "bg-emerald-950/70 border border-emerald-500/50 text-emerald-300"
                        : "bg-amber-950/70 border border-amber-500/50 text-amber-200"
                    }`}
                  >
                    {isScrubbed ? scrambleEntity : "GreySquare LLP"}
                  </span>
                  , reconcile invoice value of{" "}
                  <span
                    className={`inline-block font-semibold px-1.5 py-0.5 rounded-xs transition-colors duration-200 ${
                      isScrubbed
                        ? "bg-emerald-950/70 border border-emerald-500/50 text-emerald-300"
                        : "bg-amber-950/70 border border-amber-500/50 text-amber-200"
                    }`}
                  >
                    {isScrubbed ? scrambleVal : "₹4,80,000"}
                  </span>
                  , and authenticate with secret{" "}
                  <span
                    className={`inline-block font-semibold px-1.5 py-0.5 rounded-xs transition-colors duration-200 ${
                      isScrubbed
                        ? "bg-emerald-950/70 border border-emerald-500/50 text-emerald-300"
                        : "bg-rose-950/70 border border-rose-500/50 text-rose-200"
                    }`}
                  >
                    {isScrubbed ? scrambleKey : "sk-live-98a72cf1904b"}
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#17232d]/60 font-mono text-[10px]">
            <div className="flex items-center gap-2 text-slate-400">
              <KeyRound className="h-3 w-3 text-emerald-400" />
              <span>Token Vault: sha256:7c9e...38b (Encrypted in DPAPI)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsScrubbed((v) => !v)}
              className="cursor-pointer text-slate-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              {isScrubbed ? (
                <>
                  <Eye className="h-3 w-3" /> Reveal Raw Payload
                </>
              ) : (
                <>
                  <EyeOff className="h-3 w-3" /> Redact with Local Tokens
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 2: Default-Deny Network Egress Shield (Span 5 cols)  */}
        {/* ========================================================= */}
        <div className="group relative overflow-hidden rounded-xl border border-[#17232d] bg-[#091118]/80 p-5 lg:p-6 transition-all duration-300 hover:border-cyan-500/40 xl:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#17232d]/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-400">
                  CARD 02 · DEFAULT-DENY EGRESS SHIELD
                </span>
              </div>
              <span className="rounded-xs bg-cyan-950/50 border border-cyan-500/30 px-1.5 py-0.5 font-mono text-[9px] text-cyan-300">
                INV-02 GATE
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Worker processes cannot touch external IP addresses. Green authorized GETs pass, while
              covert POST/DNS exfiltrations trigger an immediate L5 firewall ripple.
            </p>

            {/* SVG Bezier Stream Animation */}
            <div className="relative h-28 w-full rounded-md border border-[#17232d] bg-[#04080c] p-2 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 300 90">
                <defs>
                  <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Stream Paths */}
                <path
                  d="M 20 45 C 90 20, 120 45, 150 45 C 180 45, 210 20, 280 20"
                  fill="none"
                  stroke="#17232d"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 20 45 C 90 70, 120 45, 150 45 C 180 45, 210 70, 280 70"
                  fill="none"
                  stroke="#17232d"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Central L5 Hypervisor Node */}
                <g transform="translate(150, 45)">
                  <polygon
                    points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8"
                    fill="#0a141d"
                    stroke={forcefieldRipple ? "#ef4444" : "#10b981"}
                    strokeWidth="2"
                    className="transition-colors duration-200"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#F5F5F0"
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    L5
                  </text>

                  {/* Forcefield Hex Ripple on Blocked Packet */}
                  {forcefieldRipple && (
                    <circle
                      r="26"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      className="animate-ping opacity-75"
                    />
                  )}
                </g>

                {/* Left Origin & Right Destination Labels */}
                <text x="15" y="48" fill="#647A6A" fontSize="7" fontFamily="monospace">
                  PROCESS
                </text>
                <text x="250" y="23" fill="#10b981" fontSize="7" fontFamily="monospace">
                  ALLOWED GET
                </text>
                <text x="245" y="73" fill="#ef4444" fontSize="7" fontFamily="monospace">
                  BLOCKED POST
                </text>

                {/* Dynamic Packets */}
                {egressPackets.map((pkt) => {
                  const isSafe = pkt.type === "GET_SAFE";
                  const cx = 20 + pkt.progress * 260;
                  const cy = isSafe
                    ? 45 - Math.sin(pkt.progress * Math.PI) * 25
                    : 45 + Math.sin(pkt.progress * Math.PI) * 25;

                  return (
                    <circle
                      key={pkt.id}
                      cx={cx}
                      cy={cy}
                      r={isSafe ? 3.5 : 4}
                      fill={isSafe ? "#10b981" : "#ef4444"}
                      className="shadow-sm"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Morph 2 Trigger Badge */}
          <div className="mt-4 pt-3 border-t border-[#17232d]/60">
            {!isDec008Open && blockedAlertVisible ? (
              <motion.button
                layoutId="dec008-morph-card"
                onClick={() => onOpenDec008Modal?.("#trace_8f2a")}
                className="w-full cursor-pointer flex items-center justify-between rounded-lg border border-rose-500/40 bg-rose-950/30 px-3.5 py-2.5 text-left transition-all hover:border-rose-400 hover:bg-rose-950/50 shadow-md group"
              >
                <div className="flex items-center gap-2.5">
                  <motion.div
                    layoutId="dec008-lock-icon"
                    className="flex h-5 w-5 items-center justify-center rounded-xs bg-rose-500/20 text-rose-300"
                  >
                    <Lock className="h-3.5 w-3.5" />
                  </motion.div>
                  <motion.span
                    layout="position"
                    className="font-mono text-xs text-rose-200 font-medium"
                  >
                    🔒 Halted by L5: #trace_8f2a
                  </motion.span>
                </div>
                <motion.span
                  layout="position"
                  className="font-mono text-[10px] text-rose-400 group-hover:translate-x-0.5 transition-transform"
                >
                  Inspect Authority Gate →
                </motion.span>
              </motion.button>
            ) : (
              <div className="font-mono text-[10px] text-slate-500 flex items-center justify-between py-1">
                <span>Egress Firewall Nominal</span>
                <span className="text-emerald-400">0 Leaks Detected</span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 3: Cold-Room DEC-008 Trigger & Hash Lock (Span 5 col)*/}
        {/* ========================================================= */}
        <div className="group relative overflow-hidden rounded-xl border border-[#17232d] bg-[#091118]/80 p-5 lg:p-6 transition-all duration-300 hover:border-violet-500/40 xl:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#17232d]/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-400">
                  CARD 03 · COLD-ROOM DEC-008 HASH GATE
                </span>
              </div>
              <span className="rounded-xs bg-violet-950/50 border border-violet-500/30 px-1.5 py-0.5 font-mono text-[9px] text-violet-300">
                TIER 3 ESCALATION
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              When an agent requests a system daemon change, execution pauses instantly. No script
              runs until verified by cryptographic hash on a physical bound device.
            </p>

            {/* Proposal Spec Box */}
            <div className="rounded-md border border-[#17232d] bg-[#04080c] p-3 font-mono text-[11px] text-slate-300 space-y-1.5">
              <div className="flex items-center justify-between text-slate-500 text-[10px]">
                <span>ACTION_PROPOSAL_STAGED</span>
                <span className="text-amber-400">STATUS: AWAITING_NONCE</span>
              </div>
              <p className="text-slate-200 font-semibold">
                Target: /etc/systemd/system/agent.service
              </p>
              <p className="text-slate-400 text-[10px] break-all">
                args_sha256: 7e9a2b84f046200ab4376c991823d4310d7e5...
              </p>
              <div className="flex items-center gap-2 pt-1 text-[9.5px] text-slate-500">
                <FileCode className="h-3 w-3 text-violet-400" />
                <span>Blast Radius: 1 system service (Local Host Daemon)</span>
              </div>
            </div>
          </div>

          {/* Morph 2 Trigger Button (Alternative Entry) */}
          <div className="mt-4 pt-3 border-t border-[#17232d]/60">
            <button
              type="button"
              onClick={() => onOpenDec008Modal?.("#trace_8f2a")}
              className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-violet-500/30 bg-violet-950/30 px-3.5 py-2.5 font-mono text-xs text-violet-200 transition-all hover:bg-violet-900/40 hover:border-violet-400"
            >
              <Lock className="h-3.5 w-3.5 text-violet-400" />
              <span>Click to Open Cold-Room Authorization Sheet</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 4: Out-of-Process Watchdog Kill Switch (Span 7 col) */}
        {/* ========================================================= */}
        <div className="group relative overflow-hidden rounded-xl border border-[#17232d] bg-[#091118]/80 p-5 lg:p-6 transition-all duration-300 hover:border-rose-500/40 xl:col-span-7 flex flex-col justify-between">
          {/* Shockwave Radial Wave on Trigger */}
          {shockwave && (
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 m-auto h-40 w-40 rounded-full border-2 border-rose-500 bg-rose-500/20 z-30"
            />
          )}

          <div>
            <div className="flex items-center justify-between border-b border-[#17232d]/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-rose-400">
                  CARD 04 · OUT-OF-PROCESS WATCHDOG KILL SWITCH
                </span>
                <span className="rounded-xs bg-[#0f1d27] px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                  SPEC INV-12
                </span>
              </div>
              <span
                className={`rounded-xs px-2 py-0.5 font-mono text-[9.5px] font-semibold ${
                  isSevered
                    ? "bg-rose-950 border border-rose-500 text-rose-300"
                    : "bg-emerald-950 border border-emerald-500/40 text-emerald-300"
                }`}
              >
                {isSevered ? "SEVERED (SIGKILL)" : "WATCHDOG NOMINAL"}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              If an agent loop ever diverges or hangs, an out-of-process OS watchdog cuts socket IPC
              and sends SIGKILL directly through OS kernel primitives in &lt;25 milliseconds.
            </p>

            {/* Radar Ring with 3 Orbiting Hive Drones */}
            <div className="relative h-32 w-full rounded-md border border-[#17232d] bg-[#04080c] flex items-center justify-center overflow-hidden">
              {/* Radar Rings */}
              <div className="absolute h-24 w-24 rounded-full border border-slate-800/80" />
              <div className="absolute h-16 w-16 rounded-full border border-slate-800/60" />

              {/* Central Watchdog Kernel */}
              <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-rose-500/50 bg-[#0a141d] shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                <Radio
                  className={`h-4 w-4 ${isSevered ? "text-slate-600" : "text-rose-400 animate-pulse"}`}
                />
              </div>

              {/* 3 Orbiting Drone Nodes */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Drone 1: GROK_PULSE (Cyan) */}
                <div
                  className="absolute flex items-center gap-1.5 transition-all duration-300"
                  style={{ transform: "translate(-85px, -24px)" }}
                >
                  <div
                    className={`h-3 w-3 rounded-full border transition-colors ${
                      isSevered
                        ? "bg-slate-800 border-slate-700"
                        : "bg-cyan-400 border-cyan-200 shadow-[0_0_8px_#06b6d4]"
                    }`}
                  />
                  <span className="font-mono text-[9px] text-slate-400">GROK_PULSE</span>
                </div>

                {/* Drone 2: VOICESTUDIO_AGENT (Amber) */}
                <div
                  className="absolute flex items-center gap-1.5 transition-all duration-300"
                  style={{ transform: "translate(75px, -28px)" }}
                >
                  <div
                    className={`h-3 w-3 rounded-full border transition-colors ${
                      isSevered
                        ? "bg-slate-800 border-slate-700"
                        : "bg-amber-400 border-amber-200 shadow-[0_0_8px_#f59e0b]"
                    }`}
                  />
                  <span className="font-mono text-[9px] text-slate-400">VOICE_STUDIO</span>
                </div>

                {/* Drone 3: AST_AUDITOR (Emerald) */}
                <div
                  className="absolute flex items-center gap-1.5 transition-all duration-300"
                  style={{ transform: "translate(0px, 42px)" }}
                >
                  <div
                    className={`h-3 w-3 rounded-full border transition-colors ${
                      isSevered
                        ? "bg-slate-800 border-slate-700"
                        : "bg-emerald-400 border-emerald-200 shadow-[0_0_8px_#10b981]"
                    }`}
                  />
                  <span className="font-mono text-[9px] text-slate-400">AST_AUDITOR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Trigger Controls */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#17232d]/60 font-mono text-[10px]">
            {isSevered ? (
              <>
                <div className="flex items-center gap-2 text-rose-300">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                  <span>
                    ALL FILAMENTS SEVERED IN {severDuration ?? 14.2}ms (TARGET &lt;25ms)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={rearmWatchdog}
                  className="cursor-pointer flex items-center gap-1.5 rounded-xs border border-emerald-500/40 bg-emerald-950/40 px-3 py-1.5 text-emerald-300 hover:bg-emerald-900/50 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Re-arm Watchdog
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-slate-400">
                  <Activity className="h-3 w-3 text-emerald-400" />
                  <span>Kernel Hardware Timer: 50ms heartbeat nominal</span>
                </div>
                <button
                  type="button"
                  onClick={triggerKillswitch}
                  className="cursor-pointer flex items-center gap-1.5 rounded-xs border border-rose-500/60 bg-rose-950/50 px-3 py-1.5 font-semibold text-rose-200 hover:bg-rose-900/70 hover:border-rose-400 transition-all shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                >
                  <AlertTriangle className="h-3 w-3 text-rose-400" />
                  Trigger Emergency Stop
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
