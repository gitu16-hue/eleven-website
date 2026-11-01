"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Zap,
  Activity,
  AlertTriangle,
  RotateCcw,
  Radio,
  Eye,
  EyeOff,
  KeyRound,
  FileCode,
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
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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
  const scrubberIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopScrubberScan = useCallback(() => {
    if (scrubberIntervalRef.current) {
      clearInterval(scrubberIntervalRef.current);
      scrubberIntervalRef.current = null;
    }
  }, []);

  const runScrubberScan = useCallback(() => {
    // Clear any previous interval to prevent overlapping timers
    stopScrubberScan();
    if (!isMountedRef.current) return;

    setIsScanning(true);
    let iterations = 0;

    scrubberIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) {
        stopScrubberScan();
        return;
      }

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
        stopScrubberScan();
        if (isMountedRef.current) {
          setIsScanning(false);
          setIsScrubbed(true);
          setScrambleKey("[VAULT_KEY_01]");
          setScrambleEntity("[ENTITY_A]");
          setScrambleVal("[VAL_REDACTED]");
        }
      }
    }, 45);
  }, [stopScrubberScan]);

  // Auto-sweep scanline every 4.5 seconds if nominal
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isScanning) {
        runScrubberScan();
      }
    }, 4500);

    return () => {
      clearInterval(timer);
      stopScrubberScan();
    };
  }, [runScrubberScan, isScanning, stopScrubberScan]);

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
  const rippleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loop = setInterval(() => {
      if (!isMountedRef.current) return;

      let triggeredBlock = false;

      // Pure state update without side-effects in reducer
      setEgressPackets((prev) =>
        prev.map((pkt) => {
          const nextProgress = pkt.progress + 0.04;
          if (pkt.type === "POST_BLOCKED" && nextProgress >= 0.52 && nextProgress < 0.6) {
            triggeredBlock = true;
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

      // Side-effects executed outside state updater callback
      if (triggeredBlock && isMountedRef.current) {
        setForcefieldRipple(true);
        setBlockedAlertVisible(true);
        if (rippleTimeoutRef.current) {
          clearTimeout(rippleTimeoutRef.current);
        }
        rippleTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setForcefieldRipple(false);
          }
        }, 450);
      }
    }, 70);

    return () => {
      clearInterval(loop);
      if (rippleTimeoutRef.current) {
        clearTimeout(rippleTimeoutRef.current);
      }
    };
  }, []);

  // -------------------------------------------------------------
  // CARD 4: Watchdog Kill Switch State
  // -------------------------------------------------------------
  const [isSevered, setIsSevered] = useState(false);
  const [shockwave, setShockwave] = useState(false);
  const [severDuration, setSeverDuration] = useState<number | null>(null);
  const shockwaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerKillswitch = useCallback(() => {
    const start = performance.now();
    setShockwave(true);
    setIsSevered(true);
    const end = performance.now();
    setSeverDuration(Math.max(12.4, Math.round((end - start + 11.8) * 10) / 10));

    if (shockwaveTimeoutRef.current) {
      clearTimeout(shockwaveTimeoutRef.current);
    }
    shockwaveTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setShockwave(false);
      }
    }, 600);
  }, []);

  const rearmWatchdog = useCallback(() => {
    setIsSevered(false);
    setSeverDuration(null);
  }, []);

  useEffect(() => {
    return () => {
      if (shockwaveTimeoutRef.current) {
        clearTimeout(shockwaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={gridRef}
      onMouseMove={handleMouseMove}
      className="relative rounded-2xl border border-white/10 bg-el-sec-graphite-deep p-5 sm:p-7 lg:p-9 shadow-lg overflow-hidden"
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
          background: `radial-gradient(650px circle at var(--mouse-x, 200px) var(--mouse-y, 200px), rgba(184, 243, 107, 0.05), transparent 70%)`,
        }}
      />

      {/* Top Banner with Architecture Context */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xs border border-el-sec-lime/30 bg-el-sec-lime/10 text-el-sec-lime">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-el-sec-lime">
                Eleven L5 Hypervisor Matrix
              </span>
              <span className="rounded-xs border border-white/10 bg-el-sec-graphite-raised px-1.5 py-0.5 text-[10px] text-el-sec-sage-light">
                Zero-Trust Runtime
              </span>
            </div>
            <p className="text-xs text-el-sec-sage-light mt-0.5">
              Live Threat Interception Bento · 4 Isolated Boundary Controllers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-el-sec-lime/30 bg-el-sec-lime/10 px-3 py-1 text-[11px] text-el-sec-lime">
            <span className="h-1.5 w-1.5 rounded-full bg-el-sec-lime animate-pulse motion-reduce:animate-none" />
            4 Enclaves Active
          </span>
          <span className="font-mono text-[10px] text-el-sec-sage hidden sm:inline">
            POLICY_VER: 3.1-DEC008
          </span>
        </div>
      </div>

      {/* 4-Card Dark Obsidian Bento Grid */}
      <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-12">
        {/* ========================================================= */}
        {/* CARD 1: Outbound Privacy Scrubber (Span 7 cols)          */}
        {/* ========================================================= */}
        <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-el-sec-graphite/90 p-5 lg:p-6 transition-colors duration-300 hover:border-el-sec-lime/40 xl:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-el-sec-lime">
                  Card 01: Outbound Privacy Scrubber
                </span>
                <span className="rounded-xs bg-el-sec-graphite-raised px-1.5 py-0.5 font-mono text-[9px] text-el-sec-sage-light">
                  SPEC INV-05
                </span>
              </div>
              <button
                type="button"
                onClick={runScrubberScan}
                disabled={isScanning}
                className="cursor-pointer flex items-center gap-1.5 rounded-xs border border-el-sec-lime/30 bg-el-sec-lime/10 px-2.5 py-1 text-[11px] text-el-sec-lime hover:bg-el-sec-lime/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime active:scale-[0.98] transition-colors disabled:opacity-50"
              >
                <Zap className="h-3 w-3" aria-hidden="true" />
                {isScanning ? "Scrubbing…" : "Force Scan"}
              </button>
            </div>

            <p className="text-xs text-el-sec-sage-light mb-3 leading-relaxed">
              Before prompt fragments leave the device, zero-knowledge regex sweeps redact keys,
              personal identities, and financial figures into reversible local tokens.
            </p>

            {/* Prompt Code Box with Animated Emerald Laser Scanline */}
            <div className="relative overflow-hidden rounded-md border border-white/10 bg-el-sec-graphite-deep p-4 font-mono text-xs text-el-sec-porcelain">
              {/* Animated Laser Bar */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    initial={{ top: "-10%" }}
                    animate={{ top: "110%" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="pointer-events-none absolute left-0 right-0 h-0.5 bg-el-sec-lime shadow-sm z-20 motion-reduce:opacity-0"
                  />
                )}
              </AnimatePresence>

              <div className="space-y-2 text-[11.5px] leading-relaxed">
                <p className="text-el-sec-sage-light">
                  <span className="text-el-sec-sage">USER_PROMPT &gt;</span> Analyze balance sheet for{" "}
                  <span
                    className={`inline-block font-semibold px-1.5 py-0.5 rounded-xs transition-colors duration-200 ${
                      isScrubbed
                        ? "bg-el-sec-lime/15 border border-el-sec-lime/40 text-el-sec-lime"
                        : "bg-amber-950/70 border border-amber-500/50 text-amber-200"
                    }`}
                  >
                    {isScrubbed ? scrambleEntity : "GreySquare LLP"}
                  </span>
                  , reconcile invoice value of{" "}
                  <span
                    className={`inline-block font-semibold px-1.5 py-0.5 rounded-xs transition-colors duration-200 ${
                      isScrubbed
                        ? "bg-el-sec-lime/15 border border-el-sec-lime/40 text-el-sec-lime"
                        : "bg-amber-950/70 border border-amber-500/50 text-amber-200"
                    }`}
                  >
                    {isScrubbed ? scrambleVal : "₹4,80,000"}
                  </span>
                  , and authenticate with secret{" "}
                  <span
                    className={`inline-block font-semibold px-1.5 py-0.5 rounded-xs transition-colors duration-200 ${
                      isScrubbed
                        ? "bg-el-sec-lime/15 border border-el-sec-lime/40 text-el-sec-lime"
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

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 font-mono text-[10px]">
            <div className="flex items-center gap-2 text-el-sec-sage-light">
              <KeyRound className="h-3 w-3 text-el-sec-lime" aria-hidden="true" />
              <span>Token Vault: sha256:7c9e…38b (Encrypted in DPAPI)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsScrubbed((v) => !v)}
              className="cursor-pointer text-el-sec-sage-light hover:text-el-sec-lime focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime active:scale-[0.98] transition-colors flex items-center gap-1 font-sans text-xs whitespace-nowrap"
            >
              {isScrubbed ? (
                <>
                  <Eye className="h-3 w-3" aria-hidden="true" />
                  <span className="whitespace-nowrap">Reveal Payload</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-3 w-3" aria-hidden="true" />
                  <span className="whitespace-nowrap">Redact Tokens</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 2: Default-Deny Network Egress Shield (Span 5 cols)  */}
        {/* ========================================================= */}
        <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-el-sec-graphite/90 p-5 lg:p-6 transition-colors duration-300 hover:border-white/20 xl:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-el-sec-porcelain">
                  Card 02: Default-Deny Egress Shield
                </span>
              </div>
              <span className="rounded-xs bg-el-sec-graphite-raised border border-white/10 px-1.5 py-0.5 font-mono text-[9px] text-el-sec-sage-light">
                INV-02 GATE
              </span>
            </div>

            <p className="text-xs text-el-sec-sage-light mb-3 leading-relaxed">
              Worker processes cannot touch external IP addresses. Green authorized GETs pass, while
              covert POST/DNS exfiltrations trigger an immediate L5 firewall ripple.
            </p>

            {/* SVG Bezier Stream Animation */}
            <div className="relative h-28 w-full rounded-md border border-white/10 bg-el-sec-graphite-deep p-2 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 300 90" aria-hidden="true" role="img">
                <defs>
                  <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#647A6A" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#B8F36B" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {/* Stream Paths */}
                <path
                  d="M 20 45 C 90 20, 120 45, 150 45 C 180 45, 210 20, 280 20"
                  fill="none"
                  stroke="#28302A"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 20 45 C 90 70, 120 45, 150 45 C 180 45, 210 70, 280 70"
                  fill="none"
                  stroke="#28302A"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Central L5 Hypervisor Node */}
                <g transform="translate(150, 45)">
                  <polygon
                    points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8"
                    fill="#1F2421"
                    stroke={forcefieldRipple ? "#ef4444" : "#B8F36B"}
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
                      className="animate-ping motion-reduce:animate-none opacity-75"
                    />
                  )}
                </g>

                {/* Left Origin & Right Destination Labels */}
                <text x="15" y="48" fill="#647A6A" fontSize="7" fontFamily="monospace">
                  PROCESS
                </text>
                <text x="250" y="23" fill="#B8F36B" fontSize="7" fontFamily="monospace">
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
                      fill={isSafe ? "#B8F36B" : "#ef4444"}
                      className="shadow-sm"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Morph 2 Trigger Badge */}
          <div className="mt-4 pt-3 border-t border-white/10">
            {!isDec008Open && blockedAlertVisible ? (
              <motion.button
                layoutId="dec008-morph-card"
                onClick={() => onOpenDec008Modal?.("#trace_8f2a")}
                className="w-full cursor-pointer flex items-center justify-between rounded-lg border border-rose-500/40 bg-rose-950/30 px-3.5 py-2.5 text-left transition-colors hover:border-rose-400 hover:bg-rose-950/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-400 active:scale-[0.98] shadow-sm group"
              >
                <div className="flex items-center gap-2.5">
                  <motion.div
                    layoutId="dec008-lock-icon"
                    className="flex h-5 w-5 items-center justify-center rounded-xs bg-rose-500/20 text-rose-300"
                  >
                    <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  </motion.div>
                  <motion.span
                    layout="position"
                    className="text-xs text-rose-200 font-medium"
                  >
                    Halted by L5: <span className="font-mono">#trace_8f2a</span>
                  </motion.span>
                </div>
                <motion.span
                  layout="position"
                  className="text-[11px] text-rose-400 group-hover:translate-x-0.5 transition-transform"
                >
                  Inspect Authority Gate
                </motion.span>
              </motion.button>
            ) : (
              <div className="text-[11px] text-el-sec-sage flex items-center justify-between py-1">
                <span>Egress Firewall Nominal</span>
                <span className="text-el-sec-lime font-medium">0 Leaks Detected</span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 3: Cold-Room DEC-008 Trigger & Hash Lock (Span 5 col)*/}
        {/* ========================================================= */}
        <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-el-sec-graphite/90 p-5 lg:p-6 transition-colors duration-300 hover:border-white/20 xl:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-el-sec-porcelain">
                  Card 03: Cold-Room DEC-008 Hash Gate
                </span>
              </div>
              <span className="rounded-xs bg-el-sec-graphite-raised border border-white/10 px-1.5 py-0.5 text-[10px] text-el-sec-sage-light">
                Tier 3 Escalation
              </span>
            </div>

            <p className="text-xs text-el-sec-sage-light mb-3 leading-relaxed">
              When an agent requests a system daemon change, execution pauses instantly. No script
              runs until verified by cryptographic hash on a physical bound device.
            </p>

            {/* Proposal Spec Box */}
            <div className="rounded-md border border-white/10 bg-el-sec-graphite-deep p-3 font-mono text-[11px] text-el-sec-porcelain space-y-1.5">
              <div className="flex items-center justify-between text-el-sec-sage text-[10px]">
                <span>ACTION_PROPOSAL_STAGED</span>
                <span className="text-amber-400">STATUS: AWAITING_NONCE</span>
              </div>
              <p className="text-el-sec-porcelain font-semibold">
                Target: /etc/systemd/system/agent.service
              </p>
              <p className="text-el-sec-sage-light text-[10px] break-all">
                args_sha256: 7e9a2b84f046200ab4376c991823d4310d7e5…
              </p>
              <div className="flex items-center gap-2 pt-1 text-[9.5px] text-el-sec-sage">
                <FileCode className="h-3 w-3 text-el-sec-sage-light" aria-hidden="true" />
                <span>Blast Radius: 1 system service (Local Host Daemon)</span>
              </div>
            </div>
          </div>

          {/* Morph 2 Trigger Button (Alternative Entry) */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => onOpenDec008Modal?.("#trace_8f2a")}
              className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-el-sec-graphite-raised px-3.5 py-2.5 text-xs text-el-sec-porcelain transition-colors hover:bg-white/10 hover:border-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime active:scale-[0.98] whitespace-nowrap"
            >
              <Lock className="h-3.5 w-3.5 text-el-sec-lime" aria-hidden="true" />
              <span className="whitespace-nowrap">Open Authorization Sheet</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 4: Out-of-Process Watchdog Kill Switch (Span 7 col) */}
        {/* ========================================================= */}
        <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-el-sec-graphite/90 p-5 lg:p-6 transition-colors duration-300 hover:border-rose-500/40 xl:col-span-7 flex flex-col justify-between">
          {/* Shockwave Radial Wave on Trigger */}
          {shockwave && (
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 m-auto h-40 w-40 rounded-full border-2 border-rose-500 bg-rose-500/20 z-30 motion-reduce:opacity-0"
            />
          )}

          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-rose-400">
                  Card 04: Out-of-Process Watchdog Kill Switch
                </span>
                <span className="rounded-xs bg-el-sec-graphite-raised px-1.5 py-0.5 font-mono text-[9px] text-el-sec-sage-light">
                  SPEC INV-12
                </span>
              </div>
              <span
                className={`rounded-xs px-2 py-0.5 font-mono text-[9.5px] font-semibold ${
                  isSevered
                    ? "bg-rose-950/80 border border-rose-500/50 text-rose-300"
                    : "bg-el-sec-lime/10 border border-el-sec-lime/30 text-el-sec-lime"
                }`}
              >
                {isSevered ? "SEVERED (SIGKILL)" : "WATCHDOG NOMINAL"}
              </span>
            </div>

            <p className="text-xs text-el-sec-sage-light mb-4 leading-relaxed">
              If an agent loop ever diverges or hangs, an out-of-process OS watchdog cuts socket IPC
              and sends SIGKILL directly through OS kernel primitives in &lt;25 milliseconds.
            </p>

            {/* Radar Ring with 3 Orbiting Hive Drones */}
            <div className="relative h-32 w-full rounded-md border border-white/10 bg-el-sec-graphite-deep flex items-center justify-center overflow-hidden">
              {/* Radar Rings */}
              <div className="absolute h-24 w-24 rounded-full border border-white/5" />
              <div className="absolute h-16 w-16 rounded-full border border-white/5" />

              {/* Central Watchdog Kernel */}
              <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-rose-500/40 bg-el-sec-graphite shadow-sm">
                <Radio
                  className={`h-4 w-4 ${isSevered ? "text-el-sec-sage" : "text-rose-400 animate-pulse motion-reduce:animate-none"}`}
                  aria-hidden="true"
                />
              </div>

              {/* 3 Orbiting Drone Nodes */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Drone 1: GROK_PULSE */}
                <div
                  className="absolute flex items-center gap-1.5 transition-transform duration-300"
                  style={{ transform: "translate(-85px, -24px)" }}
                >
                  <div
                    className={`h-2.5 w-2.5 rounded-full border transition-colors ${
                      isSevered
                        ? "bg-el-sec-graphite-raised border-white/10"
                        : "bg-el-sec-lime border-el-sec-lime/60 shadow-sm"
                    }`}
                  />
                  <span className="font-mono text-[9px] text-el-sec-sage-light">GROK_PULSE</span>
                </div>

                {/* Drone 2: VOICE_STUDIO */}
                <div
                  className="absolute flex items-center gap-1.5 transition-transform duration-300"
                  style={{ transform: "translate(75px, -28px)" }}
                >
                  <div
                    className={`h-2.5 w-2.5 rounded-full border transition-colors ${
                      isSevered
                        ? "bg-el-sec-graphite-raised border-white/10"
                        : "bg-amber-400 border-amber-300 shadow-sm"
                    }`}
                  />
                  <span className="font-mono text-[9px] text-el-sec-sage-light">VOICE_STUDIO</span>
                </div>

                {/* Drone 3: AST_AUDITOR */}
                <div
                  className="absolute flex items-center gap-1.5 transition-transform duration-300"
                  style={{ transform: "translate(0px, 42px)" }}
                >
                  <div
                    className={`h-2.5 w-2.5 rounded-full border transition-colors ${
                      isSevered
                        ? "bg-el-sec-graphite-raised border-white/10"
                        : "bg-el-sec-sage-light border-white/20 shadow-sm"
                    }`}
                  />
                  <span className="font-mono text-[9px] text-el-sec-sage-light">AST_AUDITOR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Trigger Controls */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 font-mono text-[10px]">
            {isSevered ? (
              <>
                <div className="flex items-center gap-2 text-rose-300">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-400" aria-hidden="true" />
                  <span>
                    ALL FILAMENTS SEVERED IN {severDuration ?? 14.2}ms (TARGET &lt;25ms)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={rearmWatchdog}
                  className="cursor-pointer flex items-center gap-1.5 rounded-xs border border-el-sec-lime/40 bg-el-sec-lime/10 px-3 py-1.5 text-el-sec-lime hover:bg-el-sec-lime/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime active:scale-[0.98] transition-colors"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  Re-arm Watchdog
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-el-sec-sage-light">
                  <Activity className="h-3 w-3 text-el-sec-lime" aria-hidden="true" />
                  <span>Kernel Hardware Timer: 50ms heartbeat nominal</span>
                </div>
                <button
                  type="button"
                  onClick={triggerKillswitch}
                  className="cursor-pointer flex items-center gap-1.5 rounded-xs border border-rose-500/50 bg-rose-950/40 px-3 py-1.5 font-semibold text-rose-200 hover:bg-rose-900/60 hover:border-rose-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-400 active:scale-[0.98] transition-colors shadow-sm"
                >
                  <AlertTriangle className="h-3 w-3 text-rose-400" aria-hidden="true" />
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
