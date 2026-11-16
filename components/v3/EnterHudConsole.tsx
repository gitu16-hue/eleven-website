"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import type {
  OrbRuntimeState,
  WorkerSatelliteSpec,
} from "@/components/three/ElevenHolographicOrb3D";
import { ORB_STATE_CONFIGS } from "@/components/three/ElevenHolographicOrb3D";
import { usePortalTransition } from "@/components/ui/PortalTransition";
import { WaitlistModal } from "@/components/v3/WaitlistModal";
import { Button } from "@/components/ui/Button";
import {
  GenesisHeroIntro,
  GenesisShowcaseFrame,
  GenesisSparkles,
} from "@/components/motion/GenesisMotionEngine";

const ElevenHolographicOrb3D = dynamic(
  () =>
    import("@/components/three/ElevenHolographicOrb3D").then(
      (mod) => mod.ElevenHolographicOrb3D
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[420px] w-full flex-col items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#062118] border-t-[#10bc83]" />
        <p className="mt-4 font-mono text-xs tracking-[0.18em] text-[#38ffbd]">
          PREPARING LIVE 3D HOLOGRAPHIC ORB…
        </p>
      </div>
    ),
  }
);

const STATE_ORDER: {
  id: OrbRuntimeState;
  keyHint: string;
  friendlyLabel: string;
  friendlySub: string;
}[] = [
  {
    id: "IDLE",
    keyHint: "1",
    friendlyLabel: "Resting Ready",
    friendlySub: "Calmly waiting for you on your computer",
  },
  {
    id: "LISTENING",
    keyHint: "2",
    friendlyLabel: "Listening to You",
    friendlySub: "Hearing your voice naturally in real time",
  },
  {
    id: "THINKING",
    keyHint: "3",
    friendlyLabel: "Deep Thinking",
    friendlySub: "Background mind planning a complex job",
  },
  {
    id: "SPEAKING",
    keyHint: "4",
    friendlyLabel: "Speaking Back",
    friendlySub: "Talking with you—interrupt anytime",
  },
  {
    id: "EXECUTING",
    keyHint: "5",
    friendlyLabel: "Doing the Task",
    friendlySub: "Working safely inside a locked workspace",
  },
  {
    id: "VERIFYING",
    keyHint: "6",
    friendlyLabel: "Fact-Checking Proof",
    friendlySub: "Making sure helper results actually match",
  },
  {
    id: "AUTHORITY_REQUIRED",
    keyHint: "7",
    friendlyLabel: "Waiting for Your OK",
    friendlySub: "Paused! Showing an honest approval card",
  },
];

interface AuditLogEntry {
  id: string;
  ts: string;
  module: string;
  msg: string;
  tone: "nominal" | "warn" | "danger" | "cyan";
}

function nowStamp(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export function EnterHudConsole() {
  const { exitToInstitutionalMode } = usePortalTransition();
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [waitlistTier, setWaitlistTier] = useState<"general" | "technical">("general");

  const [orbState, setOrbState] = useState<OrbRuntimeState>("IDLE");
  const [bargeInSignal, setBargeInSignal] = useState<number>(0);
  const [satellites, setSatellites] = useState<WorkerSatelliteSpec[]>([]);
  const [swarmActive, setSwarmActive] = useState<boolean>(false);
  const [nonceTtl, setNonceTtl] = useState<number>(30.0);

  const [logs, setLogs] = useState<AuditLogEntry[]>([
    {
      id: "init-1",
      ts: "READY",
      module: "WELCOME",
      msg: "Click any mood on the left (or drag the 3D Orb in the middle!) to see how ELEVEN reacts.",
      tone: "cyan",
    },
    {
      id: "init-2",
      ts: "SAFE",
      module: "SAFETY GUARD",
      msg: "5 automatic safety checkpoints are active. Important actions always ask your permission first.",
      tone: "nominal",
    },
    {
      id: "init-3",
      ts: "LOCAL",
      module: "MEMORY",
      msg: "All 4 memory drawers are encrypted and stored privately on your own machine.",
      tone: "nominal",
    },
  ]);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pushLog = useCallback(
    (module: string, msg: string, tone: AuditLogEntry["tone"] = "cyan") => {
      setLogs((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          ts: nowStamp(),
          module,
          msg,
          tone,
        },
        ...prev.slice(0, 6),
      ]);
    },
    []
  );

  const clearScheduledTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearScheduledTimers();
  }, [clearScheduledTimers]);

  useEffect(() => {
    if (orbState !== "AUTHORITY_REQUIRED") {
      return;
    }
    const interval = setInterval(() => {
      setNonceTtl((prev) => {
        if (prev <= 0.1) {
          setOrbState("IDLE");
          pushLog(
            "SAFETY TIMER",
            "30-second approval window expired—ELEVEN automatically cancelled the action to keep you safe.",
            "danger"
          );
          return 30.0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [orbState, pushLog]);

  const selectState = useCallback(
    (next: OrbRuntimeState) => {
      clearScheduledTimers();
      setSwarmActive(false);
      setOrbState(next);
      if (next === "AUTHORITY_REQUIRED") {
        setNonceTtl(30.0);
      }
      const found = STATE_ORDER.find((s) => s.id === next);
      pushLog(
        "ORB STATE",
        `Switched to "${found?.friendlyLabel ?? next}" — ${found?.friendlySub ?? ""}`,
        next === "AUTHORITY_REQUIRED" ? "danger" : "cyan"
      );
    },
    [clearScheduledTimers, pushLog]
  );

  const triggerBargeIn = useCallback(() => {
    clearScheduledTimers();
    setSwarmActive(false);
    setSatellites([]);
    setBargeInSignal((n) => n + 1);
    setOrbState("LISTENING");
    pushLog(
      "INSTANT INTERRUPT",
      "You spoke mid-sentence! ELEVEN stopped talking in 0.014 seconds (<0.05s) and started listening immediately.",
      "warn"
    );
  }, [clearScheduledTimers, pushLog]);

  const dispatchSwarmTournament = useCallback(() => {
    clearScheduledTimers();
    setSwarmActive(true);
    setOrbState("THINKING");
    pushLog(
      "DEEP PLANNER",
      "Launching 4 orbiting AI helper satellites to inspect code, privacy, memory, and tests…",
      "cyan"
    );

    setSatellites([
      {
        stepId: "Helper 1 · Code",
        toolName: "Checks code safety",
        lifecycleState: "QUEUED",
        evidenceStatus: "PENDING",
      },
      {
        stepId: "Helper 2 · Network",
        toolName: "Checks internet leaks",
        lifecycleState: "QUEUED",
        evidenceStatus: "PENDING",
      },
      {
        stepId: "Helper 3 · Memory",
        toolName: "Finds past notes",
        lifecycleState: "QUEUED",
        evidenceStatus: "PENDING",
      },
      {
        stepId: "Helper 4 · Tests",
        toolName: "Runs test suite",
        lifecycleState: "QUEUED",
        evidenceStatus: "PENDING",
      },
    ]);

    const t1 = setTimeout(() => {
      setOrbState("EXECUTING");
      setSatellites((prev) =>
        prev.map((s) => ({ ...s, lifecycleState: "RUNNING" }))
      );
      pushLog(
        "HELPERS ACTIVE",
        "Watch the 3D Orb: 4 glowing helper satellites are now orbiting and working inside locked sandboxes!",
        "nominal"
      );
    }, 900);

    const t2 = setTimeout(() => {
      setOrbState("VERIFYING");
      setSatellites([
        {
          stepId: "Helper 1 · Code",
          toolName: "Checks code safety",
          lifecycleState: "COMPLETED",
          evidenceStatus: "ACCEPTED",
        },
        {
          stepId: "Helper 2 · Network",
          toolName: "Spotted hidden connection!",
          lifecycleState: "COMPLETED",
          evidenceStatus: "UNRESOLVED",
        },
        {
          stepId: "Helper 3 · Memory",
          toolName: "Finds past notes",
          lifecycleState: "COMPLETED",
          evidenceStatus: "ACCEPTED",
        },
        {
          stepId: "Helper 4 · Tests",
          toolName: "Runs test suite",
          lifecycleState: "COMPLETED",
          evidenceStatus: "ACCEPTED",
        },
      ]);
      pushLog(
        "FACT CHECK",
        "3 helpers passed (Green), 1 spotted a hidden internet call (Amber). Instead of majority-voting, ELEVEN flagged the warning for you!",
        "warn"
      );
    }, 2600);

    const t3 = setTimeout(() => {
      setSwarmActive(false);
    }, 3600);

    timersRef.current.push(t1, t2, t3);
  }, [clearScheduledTimers, pushLog]);

  const approveColdRoomNonce = useCallback(() => {
    clearScheduledTimers();
    pushLog(
      "APPROVED",
      "One-time 30-second pass confirmed! Completing the approved GitHub publish safely.",
      "nominal"
    );
    setOrbState("EXECUTING");
    const t1 = setTimeout(() => {
      setOrbState("VERIFYING");
      pushLog(
        "RECEIPT SAVED",
        "Done! Permanent receipt added to your private local history.",
        "cyan"
      );
    }, 1100);
    const t2 = setTimeout(() => {
      setOrbState("IDLE");
    }, 2200);
    timersRef.current.push(t1, t2);
  }, [clearScheduledTimers, pushLog]);

  const quarantineColdRoom = useCallback(() => {
    clearScheduledTimers();
    setOrbState("IDLE");
    pushLog(
      "BLOCKED",
      "You cancelled the request. Zero files were changed or uploaded.",
      "warn"
    );
  }, [clearScheduledTimers, pushLog]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key >= "1" && e.key <= "7") {
        const item = STATE_ORDER[Number(e.key) - 1];
        if (item) selectState(item.id);
      } else if (e.key === "b" || e.key === "B") {
        triggerBargeIn();
      } else if (e.key === "s" || e.key === "S") {
        dispatchSwarmTournament();
      } else if (e.key === "Escape") {
        exitToInstitutionalMode("/");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    selectState,
    triggerBargeIn,
    dispatchSwarmTournament,
    exitToInstitutionalMode,
  ]);

  const activeConfig = ORB_STATE_CONFIGS[orbState];
  const activeFriendly = STATE_ORDER.find((s) => s.id === orbState);

  return (
    <div className="mode-dark relative min-h-screen w-full overflow-x-hidden bg-[#05070d] text-[#e8ecf5] selection:bg-[#10bc83]/30 selection:text-[#38ffbd] el-aurora bg-grid-scifi">
      {/* GenesisFX Top Dual Emerald HeroGlow Ellipses */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-44 left-1/2 -translate-x-1/2 z-0 h-[520px] w-[960px] rounded-full bg-[radial-gradient(closest-side,rgba(0,179,140,0.22),rgba(16,188,131,0.06)_55%,transparent_100%)] blur-[90px]"
      />

      {/* Top GenesisFX Floating Command Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#05070d]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#10bc83]/45 bg-[#062118]/85 font-mono text-[11px] text-[#38ffbd] shadow-[0_0_16px_rgba(16,188,131,0.3)]">
                G
              </span>
              <span className="font-mono text-xs font-normal tracking-[0.16em] text-white">
                ELEVEN v3.1 · LIVE INTERACTIVE 3D CORE
              </span>
            </div>
            <span className="gfx-badge !py-1 !px-3 !text-[11px]">
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: activeConfig.hex,
                  boxShadow: `0 0 10px ${activeConfig.hex}`,
                }}
              />
              <span>{activeFriendly?.friendlyLabel}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="hidden font-mono text-[11px] text-[#a0a0a0] xl:inline mr-2">
              SHORTCUTS: <span className="text-[#38ffbd]">[1–7]</span> STATE ·{" "}
              <span className="text-[#38ffbd]">[S]</span> 4 HELPERS ·{" "}
              <span className="text-[#38ffbd]">[B]</span> INTERRUPT
            </span>
            <Button
              variant="primary"
              arrow
              onClick={() => {
                setWaitlistTier("general");
                setIsWaitlistOpen(true);
              }}
            >
              Join Early Access
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setWaitlistTier("technical");
                setIsWaitlistOpen(true);
              }}
              className="hidden sm:inline-flex"
            >
              Request Technical Access
            </Button>
            <Button
              variant="ghost"
              onClick={() => exitToInstitutionalMode("/")}
            >
              ← Back to Website
            </Button>
          </div>
        </div>
      </header>

      {/* Main 3-Column GenesisFX Interactive Cockpit */}
      <GenesisHeroIntro className="relative z-10 mx-auto max-w-[1440px] px-5 py-6 lg:px-8 lg:py-8">
        {/* Top Cockpit Intro Banner */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-[1.35rem] border border-white/[0.08] bg-[#062118]/25 px-6 py-4 backdrop-blur-xl sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#38ffbd]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83] animate-pulse" />
              <span>COMPUTATIONAL CONTROL PLANE // GENESIS HOLOGRAPHIC STAGE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-normal heading-gradient">
              Inspect how ELEVEN thinks, listens, and enforces constitutional boundaries in real time.
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="gfx-bubble !py-1 !px-3 !text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              54K GPU Particles
            </span>
            <span className="gfx-bubble !py-1 !px-3 !text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              5-Stage ActionGate
            </span>
            <span className="gfx-bubble !py-1 !px-3 !text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              127.0.0.1 Loopback
            </span>
          </div>
        </div>

        <main className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: 7 Cognitive States + 2 Live Demos + Private Memory */}
          <section className="flex flex-col justify-between gap-4 lg:col-span-3">
            <div className="gfx-card p-4 sm:p-5">
              <span className="gfx-card__border" aria-hidden="true" />
              <div className="relative z-10 flex items-center justify-between border-b border-white/[0.07] pb-2.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#a0a0a0]">
                  01 · Click Any AI State
                </span>
                <span className="rounded-full border border-[#10bc83]/35 bg-[#062118]/75 px-2.5 py-0.5 font-mono text-[10px] text-[#38ffbd]">
                  LIVE 3D
                </span>
              </div>

              <div className="relative z-10 mt-3 space-y-1.5">
                {STATE_ORDER.map((item) => {
                  const active = orbState === item.id;
                  const cfg = ORB_STATE_CONFIGS[item.id];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectState(item.id)}
                      style={{
                        background: active
                          ? "radial-gradient(120% 90% at 50% 0%, rgba(16, 188, 131, 0.24), rgba(6, 33, 24, 0.78))"
                          : "rgba(5, 7, 13, 0.78)",
                        borderColor: active
                          ? "rgba(16, 188, 131, 0.65)"
                          : "rgba(255, 255, 255, 0.08)",
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-left transition-all duration-200 ${
                        active
                          ? "text-white shadow-[0_0_24px_rgba(16,188,131,0.16)]"
                          : "text-[#a0a0a0] hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor: cfg.hex,
                            boxShadow: active ? `0 0 10px ${cfg.hex}` : undefined,
                            opacity: active ? 1 : 0.65,
                          }}
                        />
                        <span className="block">
                          <span className="block text-xs font-normal text-white leading-none">
                            {item.friendlyLabel}
                          </span>
                          <span className="mt-1 block text-[10.5px] text-[#a0a0a0] leading-tight">
                            {item.friendlySub}
                          </span>
                        </span>
                      </span>
                      <kbd className="rounded-full border border-white/[0.12] bg-black/50 px-2 py-0.5 font-mono text-[10px] text-[#38ffbd]">
                        {item.keyHint}
                      </kbd>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2 Fun Live Demos */}
            <div className="gfx-card p-4 sm:p-5">
              <span className="gfx-card__border" aria-hidden="true" />
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-2.5">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#a0a0a0]">
                  02 · Try Live Action Demos
                </p>
                <span className="font-mono text-[10px] text-[#10bc83]">INTERACTIVE</span>
              </div>
              <div className="mt-3.5 space-y-2.5">
                <button
                  type="button"
                  onClick={dispatchSwarmTournament}
                  className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-[#10bc83]/45 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(16,188,131,0.22),rgba(6,33,24,0.85))] px-4 py-3 text-left text-xs text-[#38ffbd] transition-all hover:border-[#38ffbd] hover:shadow-[0_0_26px_rgba(16,188,131,0.24)]"
                >
                  <GenesisSparkles />
                  <span className="flex items-center justify-between font-mono font-normal text-white">
                    <span className="text-[#38ffbd]">▶ Launch 4 Helper Satellites</span>
                    <span className="rounded-full border border-[#10bc83]/40 bg-[#05070d]/70 px-2 py-0.5 text-[10px]">
                      [S]
                    </span>
                  </span>
                  <span className="mt-1.5 block text-[11px] text-[#a0a0a0]">
                    Watch 4 3D helpers orbit the Orb &amp; catch a hidden warning
                  </span>
                </button>

                <button
                  type="button"
                  onClick={triggerBargeIn}
                  className="w-full cursor-pointer rounded-xl border border-[#e29d58]/45 bg-[radial-gradient(120%_90%_at_50%_100%,rgba(226,157,88,0.2),rgba(20,14,6,0.88))] px-4 py-3 text-left text-xs text-[#e29d58] transition-all hover:border-[#e29d58]/80"
                >
                  <span className="flex items-center justify-between font-mono font-normal">
                    <span>⚡ Interrupt Mid-Sentence</span>
                    <span className="rounded-full border border-[#e29d58]/40 bg-[#05070d]/70 px-2 py-0.5 text-[10px]">
                      [B]
                    </span>
                  </span>
                  <span className="mt-1.5 block text-[11px] text-[#d6b883]">
                    See how ELEVEN stops talking in 0.05s the moment you speak
                  </span>
                </button>

                {satellites.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSatellites([]);
                      setSwarmActive(false);
                      pushLog("HELPERS", "Cleared orbiting helper satellites.", "cyan");
                    }}
                    className="w-full cursor-pointer rounded-full border border-white/[0.1] bg-[#05070d] px-3.5 py-2 font-mono text-[11px] text-[#a0a0a0] hover:border-[#10bc83]/40 hover:text-white"
                  >
                    Clear Orbiting Helpers ({satellites.length})
                  </button>
                )}
              </div>
            </div>

            {/* Private Local Memory Status */}
            <div className="gfx-card !p-5 text-[11.5px]">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#a0a0a0] border-b border-white/[0.07] pb-2.5">
                03 · Private Memory (On Your PC)
              </p>
              <div className="mt-3 space-y-2.5 text-[#a0a0a0]">
                <div className="flex justify-between">
                  <span>Right-Now Memory</span>
                  <span className="font-mono text-[#10bc83]">READY (&lt;5ms)</span>
                </div>
                <div className="flex justify-between">
                  <span>Past Conversations</span>
                  <span className="font-mono text-[#10bc83]">TIMELINE SAVED</span>
                </div>
                <div className="flex justify-between">
                  <span>Smart File Search</span>
                  <span className="font-mono text-[#38ffbd]">EXACT + MEANING</span>
                </div>
                <div className="flex justify-between">
                  <span>Encryption Lock</span>
                  <span className="font-mono text-white">AES-256 LOCKED</span>
                </div>
              </div>
            </div>
          </section>

          {/* Center Column: Interactive 3D WebGL Holographic Orb in GenesisShowcaseFrame */}
          <section className="lg:col-span-6 flex flex-col">
            <GenesisShowcaseFrame className="flex-1 flex flex-col">
              <div className="relative flex min-h-[520px] flex-1 flex-col justify-between overflow-hidden rounded-[1.05rem] bg-[#05070d] lg:min-h-[660px]">
                <div className="pointer-events-none relative z-10 flex items-start justify-between border-b border-white/[0.06] bg-[#05070d]/70 px-5 py-3.5 font-mono text-[11px] backdrop-blur-md">
                  <div>
                    <p className="flex items-center gap-2 text-[#38ffbd]">
                      <span className="h-2 w-2 rounded-full bg-[#10bc83] animate-pulse" />
                      <span>DRAG TO SPIN IN 3D · CLICK TO PULSE</span>
                    </p>
                    <p className="mt-1 text-[10.5px] text-[#a0a0a0]">
                      {activeFriendly?.friendlySub}
                    </p>
                  </div>
                  <div className="text-right">
                    <p style={{ color: activeConfig.hex }} className="font-normal">
                      {activeFriendly?.friendlyLabel.toUpperCase()}
                    </p>
                    <p className="mt-1 text-[10px] text-[#a0a0a0]">
                      {swarmActive
                        ? "4 HELPERS WORKING…"
                        : satellites.length > 0
                        ? "4 HELPERS FACT-CHECKED"
                        : "PROTECTED BY 5 SAFETY GATES"}
                    </p>
                  </div>
                </div>

                <div className="relative min-h-[420px] w-full flex-1">
                  <ElevenHolographicOrb3D
                    state={orbState}
                    bargeInSignal={bargeInSignal}
                    satellites={satellites}
                  />
                </div>

                {/* Friendly Approval Card Popup when State 7 ("Waiting for Your OK") is active */}
                <AnimatePresence mode="wait">
                  {orbState === "AUTHORITY_REQUIRED" ? (
                    <motion.div
                      key="approval-drawer"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      className="relative z-20 m-4 rounded-2xl border border-[#ef4444]/60 bg-[#140b0e]/95 p-5 text-xs shadow-2xl backdrop-blur-xl"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ef4444]/30 pb-2.5">
                        <span className="font-mono font-normal text-[#ef4444]">
                          ⏸ HONEST SAFETY RECEIPT — NEEDS YOUR PERMISSION
                        </span>
                        <span className="rounded-full bg-[#291315] px-3 py-0.5 font-mono text-[11px] text-[#fca5a5]">
                          Auto-cancels in {nonceTtl.toFixed(1)}s
                        </span>
                      </div>
                      <p className="mt-3 text-base font-normal heading-gradient">
                        Publish code update &ldquo;release/v3.1&rdquo; to GitHub?
                      </p>
                      <p className="mt-1 text-[11.5px] text-[#a0a0a0]">
                        ELEVEN hid the AI&rsquo;s sales talk and checked the facts directly: this will upload your branch to github.com.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3 font-mono text-xs">
                        <button
                          type="button"
                          onClick={approveColdRoomNonce}
                          className="glow-btn !py-2 !px-4 !text-xs"
                        >
                          <span>✓ Approve Once (30s Pass)</span>
                        </button>
                        <button
                          type="button"
                          onClick={quarantineColdRoom}
                          className="cursor-pointer rounded-full border border-white/[0.14] bg-[#05070d] px-4 py-2 text-[#e8ecf5] hover:border-[#ef4444]"
                        >
                          ✕ Cancel Safely
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="status-bar"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] bg-[#05070d]/90 px-5 py-3 font-mono text-[10px] text-[#a0a0a0]"
                    >
                      <span className="text-[#10bc83]">● VOICE REPLY GOAL: &lt;0.5 SECONDS</span>
                      <span>PASSWORDS &amp; FILES: PROTECTED</span>
                      <span className="text-[#38ffbd]">EMERGENCY STOP: 0.05 SECONDS</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GenesisShowcaseFrame>
          </section>

          {/* Right Column: Orbiting Helpers Status + Plain-English Activity Feed */}
          <section className="flex flex-col justify-between gap-5 lg:col-span-3">
            <div className="gfx-card !p-5">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#a0a0a0]">
                  Orbiting AI Helpers
                </span>
                <span className="rounded-full border border-[#10bc83]/35 bg-[#062118]/75 px-2.5 py-0.5 font-mono text-[10px] text-[#38ffbd]">
                  PROOF CHECK
                </span>
              </div>

              {satellites.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#a0a0a0]">
                  <p className="font-normal text-sm heading-gradient">No helpers orbiting yet</p>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-[#a0a0a0]">
                    Click <strong className="text-[#38ffbd] font-normal">&ldquo;Launch 4 Helper Satellites&rdquo;</strong> on the left to watch 4 3D spheres orbit the core and fact-check a job!
                  </p>
                </div>
              ) : (
                <div className="mt-3.5 space-y-2.5 text-xs">
                  {satellites.map((sat) => (
                    <div
                      key={sat.stepId}
                      className="rounded-xl border border-white/[0.07] bg-[#05070d]/85 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-normal text-white">
                          {sat.stepId}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                            sat.evidenceStatus === "ACCEPTED"
                              ? "border border-[#10bc83]/35 bg-[#062118] text-[#38ffbd]"
                              : sat.evidenceStatus === "UNRESOLVED"
                              ? "border border-[#e29d58]/40 bg-[#e29d58]/15 text-[#e29d58]"
                              : "border border-white/10 bg-white/5 text-[#a0a0a0]"
                          }`}
                        >
                          {sat.evidenceStatus === "ACCEPTED"
                            ? "✓ Verified"
                            : sat.evidenceStatus === "UNRESOLVED"
                            ? "⚠ Warning"
                            : "Working…"}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#a0a0a0]">{sat.toolName}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Plain-English Activity Stream */}
            <div className="gfx-card !p-5 flex-1">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#a0a0a0]">
                  Live Activity Feed
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#10bc83]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83] animate-pulse" />
                  REAL-TIME
                </span>
              </div>

              <div className="mt-3.5 space-y-2.5 text-xs">
                {logs.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl border border-white/[0.07] bg-[#05070d]/85 p-3"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#686868]">
                      <span
                        className={
                          entry.tone === "danger"
                            ? "text-[#ef4444]"
                            : entry.tone === "warn"
                            ? "text-[#e29d58]"
                            : entry.tone === "nominal"
                            ? "text-[#10bc83]"
                            : "text-[#38ffbd]"
                        }
                      >
                        {entry.module}
                      </span>
                      <span>{entry.ts}</span>
                    </div>
                    <p className="mt-1.5 leading-[1.5] text-[#e8ecf5]">{entry.msg}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </GenesisHeroIntro>
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        initialTier={waitlistTier}
      />
    </div>
  );
}
