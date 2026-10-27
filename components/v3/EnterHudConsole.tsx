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

const ElevenHolographicOrb3D = dynamic(
  () =>
    import("@/components/three/ElevenHolographicOrb3D").then(
      (mod) => mod.ElevenHolographicOrb3D
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[420px] w-full flex-col items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#202633] border-t-[#5fd0cf]" />
        <p className="mt-4 font-mono text-xs tracking-[0.18em] text-[#8b929e]">
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
      setNonceTtl(30.0);
      return;
    }
    setNonceTtl(30.0);
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
    <div className="mode-dark relative min-h-screen w-full overflow-x-hidden bg-[#080a0f] text-[#f2f3ee] selection:bg-[#5fd0cf]/25 selection:text-[#f2f3ee]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #202633 1px, transparent 1px), linear-gradient(to bottom, #202633 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Top HUD Command Bar */}
      <header className="relative z-20 border-b border-[#202633] bg-[#080a0f]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: activeConfig.hex,
                  boxShadow: `0 0 12px ${activeConfig.hex}`,
                }}
              />
              <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[#f2f3ee]">
                ELEVEN v3.1 · LIVE INTERACTIVE 3D CORE
              </span>
            </div>
            <span className="hidden rounded-sm border border-[#202633] bg-[#0e121a] px-2.5 py-0.5 font-mono text-[11px] text-[#5fd0cf] sm:inline-block">
              {activeFriendly?.friendlyLabel}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <span className="hidden text-[#8b929e] xl:inline">
              SHORTCUTS: [1–7] CHANGE STATE · [S] LAUNCH 4 HELPERS · [B] INTERRUPT VOICE
            </span>
            <button
              type="button"
              onClick={() => exitToInstitutionalMode("/")}
              className="cursor-pointer rounded-sm border border-[#2e3747] bg-[#0e121a] px-3.5 py-1.5 text-xs text-[#f2f3ee] transition-colors hover:border-[#5fd0cf] hover:text-[#5fd0cf]"
            >
              ← Back to Website
            </button>
          </div>
        </div>
      </header>

      {/* Main 3-Column Interactive Playground */}
      <main className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-5 py-6 lg:grid-cols-12 lg:px-8 lg:py-8">
        {/* Left Column: 7 Easy-to-Understand States + 2 Fun Live Demos */}
        <section className="flex flex-col justify-between gap-5 lg:col-span-3">
          <div className="rounded-sm border border-[#202633] bg-[#0e121a]/90 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-[#202633] pb-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#8b929e]">
                1. Click Any AI State
              </span>
              <span className="font-mono text-[10px] text-[#5fd0cf]">LIVE 3D</span>
            </div>

            <div className="mt-3 space-y-1.5">
              {STATE_ORDER.map((item) => {
                const active = orbState === item.id;
                const cfg = ORB_STATE_CONFIGS[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectState(item.id)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-sm border px-3 py-2 text-left transition-all ${
                      active
                        ? "border-[#5fd0cf]/70 bg-[#131b26] text-[#f2f3ee]"
                        : "border-transparent bg-[#080a0f]/60 text-[#8b929e] hover:border-[#202633] hover:text-[#f2f3ee]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor: cfg.hex,
                          opacity: active ? 1 : 0.45,
                        }}
                      />
                      <div>
                        <p className="text-xs font-medium leading-none">
                          {item.friendlyLabel}
                        </p>
                        <p className="mt-1 text-[10.5px] text-[#8b929e]">
                          {item.friendlySub}
                        </p>
                      </div>
                    </div>
                    <kbd className="rounded border border-[#202633] px-1.5 py-0.5 font-mono text-[10px] text-[#8b929e]">
                      {item.keyHint}
                    </kbd>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2 Fun Live Demos */}
          <div className="rounded-sm border border-[#202633] bg-[#0e121a]/90 p-4 backdrop-blur-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#8b929e]">
              2. Try Live Action Demos
            </p>
            <div className="mt-3 space-y-2.5">
              <button
                type="button"
                onClick={dispatchSwarmTournament}
                className="w-full cursor-pointer rounded-sm border border-[#5fd0cf]/50 bg-[#112024] px-3.5 py-2.5 text-left text-xs text-[#5fd0cf] transition-colors hover:bg-[#162c32]"
              >
                <span className="flex items-center justify-between font-mono font-semibold">
                  <span>▶ Launch 4 Helper Satellites</span>
                  <span>[S]</span>
                </span>
                <span className="mt-1 block text-[11px] text-[#b4c0cc]">
                  Watch 4 3D helpers orbit the Orb &amp; catch a hidden warning
                </span>
              </button>

              <button
                type="button"
                onClick={triggerBargeIn}
                className="w-full cursor-pointer rounded-sm border border-[#f59e0b]/45 bg-[#271e0d] px-3.5 py-2.5 text-left text-xs text-[#f59e0b] transition-opacity hover:opacity-90"
              >
                <span className="flex items-center justify-between font-mono font-semibold">
                  <span>⚡ Interrupt Mid-Sentence</span>
                  <span>[B]</span>
                </span>
                <span className="mt-1 block text-[11px] text-[#d6b883]">
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
                  className="w-full cursor-pointer rounded-sm border border-[#202633] bg-[#080a0f] px-3 py-1.5 font-mono text-[11px] text-[#8b929e] hover:text-[#f2f3ee]"
                >
                  Clear Orbiting Helpers ({satellites.length})
                </button>
              )}
            </div>
          </div>

          {/* Private Local Memory Status */}
          <div className="rounded-sm border border-[#202633] bg-[#0e121a]/90 p-4 text-[11.5px] backdrop-blur-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#8b929e]">
              Private Memory (On Your PC)
            </p>
            <div className="mt-3 space-y-2 text-[#8b929e]">
              <div className="flex justify-between">
                <span>Right-Now Memory</span>
                <span className="font-mono text-[#10b981]">READY (&lt;5ms)</span>
              </div>
              <div className="flex justify-between">
                <span>Past Conversations</span>
                <span className="font-mono text-[#10b981]">TIMELINE SAVED</span>
              </div>
              <div className="flex justify-between">
                <span>Smart File Search</span>
                <span className="font-mono text-[#5fd0cf]">EXACT + MEANING</span>
              </div>
              <div className="flex justify-between">
                <span>Encryption Lock</span>
                <span className="font-mono text-[#f2f3ee]">AES-256 LOCKED</span>
              </div>
            </div>
          </div>
        </section>

        {/* Center Column: Interactive 3D WebGL Holographic Orb */}
        <section className="relative flex min-h-[480px] flex-col justify-between overflow-hidden rounded-sm border border-[#202633] bg-[#04060a] lg:col-span-6 lg:min-h-[640px]">
          <div className="pointer-events-none relative z-10 flex items-start justify-between p-4 font-mono text-[11px]">
            <div>
              <p className="text-[#5fd0cf]">DRAG TO SPIN IN 3D · CLICK TO PULSE</p>
              <p className="mt-0.5 text-[10px] text-[#8b929e]">
                {activeFriendly?.friendlySub}
              </p>
            </div>
            <div className="text-right">
              <p style={{ color: activeConfig.hex }}>
                {activeFriendly?.friendlyLabel.toUpperCase()}
              </p>
              <p className="mt-0.5 text-[10px] text-[#8b929e]">
                {swarmActive
                  ? "4 HELPERS WORKING…"
                  : satellites.length > 0
                  ? "4 HELPERS FACT-CHECKED"
                  : "PROTECTED BY 5 SAFETY GATES"}
              </p>
            </div>
          </div>

          <div className="relative min-h-[400px] w-full flex-1">
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
                className="relative z-20 m-4 rounded-sm border border-[#ef4444]/60 bg-[#140b0e]/95 p-4 text-xs shadow-2xl backdrop-blur-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ef4444]/30 pb-2">
                  <span className="font-mono font-semibold text-[#ef4444]">
                    ⏸ HONEST SAFETY RECEIPT — NEEDS YOUR PERMISSION
                  </span>
                  <span className="rounded bg-[#291315] px-2 py-0.5 font-mono text-[11px] text-[#fca5a5]">
                    Auto-cancels in {nonceTtl.toFixed(1)}s
                  </span>
                </div>
                <p className="mt-2.5 text-sm font-medium text-[#f2f3ee]">
                  Publish code update &ldquo;release/v3.1&rdquo; to GitHub?
                </p>
                <p className="mt-1 text-[11.5px] text-[#9aa3b2]">
                  ELEVEN hid the AI&rsquo;s sales talk and checked the facts directly: this will upload your branch to github.com.
                </p>
                <div className="mt-3 flex flex-wrap gap-2.5 font-mono text-xs">
                  <button
                    type="button"
                    onClick={approveColdRoomNonce}
                    className="cursor-pointer rounded-sm bg-[#10b981] px-4 py-1.5 font-semibold text-[#04130d] transition-opacity hover:opacity-90"
                  >
                    ✓ Approve Once (30s Pass)
                  </button>
                  <button
                    type="button"
                    onClick={quarantineColdRoom}
                    className="cursor-pointer rounded-sm border border-[#2e3747] bg-[#0e121a] px-3.5 py-1.5 text-[#f2f3ee] hover:border-[#ef4444]"
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
                className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-[#202633] bg-[#080a0f]/80 px-4 py-2.5 font-mono text-[10px] text-[#8b929e]"
              >
                <span>VOICE REPLY GOAL: &lt;0.5 SECONDS</span>
                <span>PASSWORDS &amp; FILES: PROTECTED</span>
                <span>EMERGENCY STOP: 0.05 SECONDS</span>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Right Column: Orbiting Helpers Status + Plain-English Activity Feed */}
        <section className="flex flex-col justify-between gap-5 lg:col-span-3">
          <div className="rounded-sm border border-[#202633] bg-[#0e121a]/90 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-[#202633] pb-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#8b929e]">
                Orbiting AI Helpers
              </span>
              <span className="font-mono text-[10px] text-[#5fd0cf]">
                PROOF CHECK
              </span>
            </div>

            {satellites.length === 0 ? (
              <div className="py-5 text-center text-xs text-[#8b929e]">
                <p className="font-medium text-[#d5d9e2]">No helpers orbiting yet</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-[#8b929e]">
                  Click <strong className="text-[#5fd0cf]">&ldquo;Launch 4 Helper Satellites&rdquo;</strong> on the left to watch 4 3D spheres orbit the core and fact-check a job!
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-2 text-xs">
                {satellites.map((sat) => (
                  <div
                    key={sat.stepId}
                    className="rounded-sm border border-[#202633] bg-[#080a0f] p-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#f2f3ee]">
                        {sat.stepId}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                          sat.evidenceStatus === "ACCEPTED"
                            ? "bg-[#10b981]/15 text-[#10b981]"
                            : sat.evidenceStatus === "UNRESOLVED"
                            ? "bg-[#f59e0b]/20 text-[#f59e0b]"
                            : "bg-[#202633] text-[#8b929e]"
                        }`}
                      >
                        {sat.evidenceStatus === "ACCEPTED"
                          ? "✓ Verified"
                          : sat.evidenceStatus === "UNRESOLVED"
                          ? "⚠ Warning"
                          : "Working…"}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#8b929e]">{sat.toolName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Plain-English Activity Stream */}
          <div className="flex-1 rounded-sm border border-[#202633] bg-[#0e121a]/90 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-[#202633] pb-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#8b929e]">
                Live Activity Feed
              </span>
              <span className="font-mono text-[10px] text-[#10b981]">REAL-TIME</span>
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              {logs.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-sm border border-[#202633]/80 bg-[#080a0f]/80 p-2.5"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#565d6c]">
                    <span
                      className={
                        entry.tone === "danger"
                          ? "text-[#ef4444]"
                          : entry.tone === "warn"
                          ? "text-[#f59e0b]"
                          : entry.tone === "nominal"
                          ? "text-[#10b981]"
                          : "text-[#5fd0cf]"
                      }
                    >
                      {entry.module}
                    </span>
                    <span>{entry.ts}</span>
                  </div>
                  <p className="mt-1 leading-[1.5] text-[#d5d9e2]">{entry.msg}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
