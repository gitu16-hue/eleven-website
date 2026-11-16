"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type {
  OrbRuntimeState,
  WorkerSatelliteSpec,
} from "@/components/three/ElevenHolographicOrb3D";
import { ORB_STATE_CONFIGS } from "@/components/three/ElevenHolographicOrb3D";
import { usePortalTransition } from "@/components/ui/PortalTransition";
import { WaitlistModal } from "@/components/v3/WaitlistModal";
import { Button } from "@/components/ui/Button";
import { GenesisSparkles } from "@/components/motion/GenesisMotionEngine";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EnterAmbientBackdrop = dynamic(
  () =>
    import("@/components/three/EnterAmbientBackdrop").then(
      (mod) => mod.EnterAmbientBackdrop
    ),
  { ssr: false }
);

const ElevenHolographicOrb3D = dynamic(
  () =>
    import("@/components/three/ElevenHolographicOrb3D").then(
      (mod) => mod.ElevenHolographicOrb3D
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[430px] sm:min-h-[520px] w-full flex-col items-center justify-center">
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
  energy: number;
  waveSpeed: number;
}[] = [
  {
    id: "IDLE",
    keyHint: "1",
    friendlyLabel: "Resting Ready",
    friendlySub: "Calmly waiting for you on your computer",
    energy: 0.25,
    waveSpeed: 1.8,
  },
  {
    id: "LISTENING",
    keyHint: "2",
    friendlyLabel: "Listening to You",
    friendlySub: "Hearing your voice naturally in real time",
    energy: 0.58,
    waveSpeed: 0.72,
  },
  {
    id: "THINKING",
    keyHint: "3",
    friendlyLabel: "Deep Thinking",
    friendlySub: "Background mind planning a complex job",
    energy: 0.68,
    waveSpeed: 0.62,
  },
  {
    id: "SPEAKING",
    keyHint: "4",
    friendlyLabel: "Speaking Back",
    friendlySub: "Talking with you—interrupt anytime",
    energy: 0.78,
    waveSpeed: 0.48,
  },
  {
    id: "EXECUTING",
    keyHint: "5",
    friendlyLabel: "Doing the Task",
    friendlySub: "Working safely inside a locked workspace",
    energy: 0.82,
    waveSpeed: 0.52,
  },
  {
    id: "VERIFYING",
    keyHint: "6",
    friendlyLabel: "Fact-Checking Proof",
    friendlySub: "Making sure helper results actually match",
    energy: 0.52,
    waveSpeed: 0.85,
  },
  {
    id: "AUTHORITY_REQUIRED",
    keyHint: "7",
    friendlyLabel: "Waiting for Your OK",
    friendlySub: "Paused! Showing an honest approval card",
    energy: 0.9,
    waveSpeed: 1.4,
  },
];

const OS_PROCESS_ROOMS = [
  {
    id: "ROOM 01 · VOICE & INTENT",
    name: "F.R.I.D.A.Y. System 1",
    detail: "Full-duplex 16kHz PCM perception & <50ms barge-in hardware interrupt.",
    metric: "0.42s p50",
    tone: "emerald",
  },
  {
    id: "ROOM 02 · DAG COMPILER",
    name: "J.A.R.V.I.S. System 2",
    detail: "Compiles complex coding and research into parallel, budget-capped execution graphs.",
    metric: "Async DAG",
    tone: "emerald",
  },
  {
    id: "ROOM 03 · ACTIONGATE",
    name: "L5 Constitutional Guard",
    detail: "5-stage pre-execution policy verification + 30s Ed25519 human consent leases.",
    metric: "INV-04",
    tone: "amber",
  },
  {
    id: "ROOM 04 · LOCAL VAULT",
    name: "127.0.0.1 Memory Vault",
    detail: "Qdrant semantic vectors + SQLite WAL timeline bound strictly to local loopback.",
    metric: "AES-256",
    tone: "blue",
  },
];

const ACTION_GATE_STAGES = [
  { step: "01", title: "Intent Parse", desc: "Classify privilege & blast radius" },
  { step: "02", title: "Workspace Scope", desc: "Pin to isolated git worktree" },
  { step: "03", title: "Policy Firewall", desc: "Verify 12 constitutional invariants" },
  { step: "04", title: "Human Lease", desc: "Ed25519 30-second one-time pass" },
  { step: "05", title: "WAL Receipt", desc: "Immutable rollback log on PC" },
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
  const rootRef = useRef<HTMLDivElement>(null);

  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [waitlistTier, setWaitlistTier] = useState<"general" | "technical">("general");

  const [orbState, setOrbState] = useState<OrbRuntimeState>("IDLE");
  const [bargeInSignal, setBargeInSignal] = useState<number>(0);
  const [satellites, setSatellites] = useState<WorkerSatelliteSpec[]>([]);
  const [swarmActive, setSwarmActive] = useState<boolean>(false);
  const [nonceTtl, setNonceTtl] = useState<number>(30.0);
  const [transientFlash, setTransientFlash] = useState<string | null>(null);

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
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerTransientFlash = useCallback((label: string) => {
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setTransientFlash(label);
    flashTimerRef.current = setTimeout(() => {
      setTransientFlash(null);
    }, 1850);
  }, []);

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
    return () => {
      clearScheduledTimers();
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, [clearScheduledTimers]);

  // Orchestrated GenesisFX Entrance & ScrollTrigger Choreography (homepage parity on both desktop & mobile)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const glowImgs = gsap.utils.toArray<HTMLElement>(".enter-glow-img", root);
        const header = root.querySelector<HTMLElement>(".enter-header");
        const banner = root.querySelector<HTMLElement>(".enter-banner");
        const centerStage = root.querySelector<HTMLElement>(".enter-center-stage");
        const topBeam = root.querySelector<HTMLElement>(".enter-top-beam");
        const leftCards = gsap.utils.toArray<HTMLElement>(".enter-left-card", root);
        const rightCards = gsap.utils.toArray<HTMLElement>(".enter-right-card", root);

        const introTl = gsap.timeline({ delay: 0.14 });

        if (glowImgs.length) {
          introTl.fromTo(
            glowImgs,
            { opacity: 0, scale: 0.78 },
            { opacity: 1, scale: 1, duration: 1.05, ease: "power2.out" },
            0
          );
        }

        if (header) {
          introTl.fromTo(
            header,
            { opacity: 0, y: -24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power3.out",
              clearProps: "transform",
            },
            0.04
          );
        }

        if (banner) {
          introTl.fromTo(
            banner,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              clearProps: "transform",
            },
            0.12
          );
        }

        if (centerStage) {
          introTl.fromTo(
            centerStage,
            { opacity: 0, y: 44, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              ease: "power3.out",
              clearProps: "transform",
            },
            0.18
          );
        }

        if (topBeam) {
          introTl.fromTo(
            topBeam,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.85, ease: "power2.out" },
            0.34
          );
        }

        if (leftCards.length) {
          introTl.fromTo(
            leftCards,
            { opacity: 0, x: -42 },
            {
              opacity: 1,
              x: 0,
              duration: 0.72,
              stagger: 0.09,
              ease: "power3.out",
              clearProps: "transform",
            },
            0.22
          );
        }

        if (rightCards.length) {
          introTl.fromTo(
            rightCards,
            { opacity: 0, x: 42 },
            {
              opacity: 1,
              x: 0,
              duration: 0.72,
              stagger: 0.09,
              ease: "power3.out",
              clearProps: "transform",
            },
            0.24
          );
        }

        // ScrollTrigger reveals for L5 Constitutional Architecture band below cockpit
        const archIntro = root.querySelector<HTMLElement>(".enter-arch-intro");
        if (archIntro) {
          gsap.fromTo(
            archIntro.children,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.08,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: archIntro,
                start: "top 88%",
                once: true,
              },
            }
          );
        }

        const roomCards = gsap.utils.toArray<HTMLElement>(".enter-room-card", root);
        if (roomCards.length) {
          gsap.fromTo(
            roomCards,
            { opacity: 0, y: 34, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.72,
              stagger: 0.08,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: roomCards[0],
                start: "top 88%",
                once: true,
              },
            }
          );
        }

        const gateSteps = gsap.utils.toArray<HTMLElement>(".enter-gate-step", root);
        if (gateSteps.length) {
          gsap.fromTo(
            gateSteps,
            { opacity: 0, x: -24 },
            {
              opacity: 1,
              x: 0,
              duration: 0.65,
              stagger: 0.07,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: gateSteps[0],
                start: "top 90%",
                once: true,
              },
            }
          );
        }
      }, root);

      return () => ctx.revert();
    });

    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const glowImgs = gsap.utils.toArray<HTMLElement>(".enter-glow-img", root);
        const header = root.querySelector<HTMLElement>(".enter-header");
        const banner = root.querySelector<HTMLElement>(".enter-banner");
        const centerStage = root.querySelector<HTMLElement>(".enter-center-stage");
        const topBeam = root.querySelector<HTMLElement>(".enter-top-beam");
        const leftCards = gsap.utils.toArray<HTMLElement>(".enter-left-card", root);
        const rightCards = gsap.utils.toArray<HTMLElement>(".enter-right-card", root);

        const introTl = gsap.timeline({ delay: 0.12 });
        if (glowImgs.length) {
          introTl.fromTo(
            glowImgs,
            { opacity: 0, scale: 0.78 },
            { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" },
            0
          );
        }
        if (header) {
          introTl.fromTo(
            header,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", clearProps: "transform" },
            0.04
          );
        }
        if (banner) {
          introTl.fromTo(
            banner,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.65, ease: "power3.out", clearProps: "transform" },
            0.1
          );
        }
        if (centerStage) {
          introTl.fromTo(
            centerStage,
            { opacity: 0, y: 36, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", clearProps: "transform" },
            0.16
          );
        }
        if (topBeam) {
          introTl.fromTo(
            topBeam,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.out" },
            0.3
          );
        }

        leftCards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, x: -30, y: 24 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.72,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        rightCards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, x: 30, y: 24 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.72,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        const archIntro = root.querySelector<HTMLElement>(".enter-arch-intro");
        if (archIntro) {
          gsap.fromTo(
            archIntro.children,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.08,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: archIntro,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        const roomCards = gsap.utils.toArray<HTMLElement>(".enter-room-card", root);
        if (roomCards.length) {
          gsap.fromTo(
            roomCards,
            { opacity: 0, y: 32, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: roomCards[0],
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        const gateSteps = gsap.utils.toArray<HTMLElement>(".enter-gate-step", root);
        if (gateSteps.length) {
          gsap.fromTo(
            gateSteps,
            { opacity: 0, x: -24 },
            {
              opacity: 1,
              x: 0,
              duration: 0.65,
              stagger: 0.07,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: gateSteps[0],
                start: "top 92%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }, root);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

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
      triggerTransientFlash(`STATE LOCKED // ${found?.friendlyLabel.toUpperCase() ?? next}`);
      pushLog(
        "ORB STATE",
        `Switched to "${found?.friendlyLabel ?? next}" — ${found?.friendlySub ?? ""}`,
        next === "AUTHORITY_REQUIRED" ? "danger" : "cyan"
      );
    },
    [clearScheduledTimers, pushLog, triggerTransientFlash]
  );

  const triggerBargeIn = useCallback(() => {
    clearScheduledTimers();
    setSwarmActive(false);
    setSatellites([]);
    setBargeInSignal((n) => n + 1);
    setOrbState("LISTENING");
    triggerTransientFlash("⚡ BARGE-IN EXECUTED · 0.014s (<50ms)");
    pushLog(
      "INSTANT INTERRUPT",
      "You spoke mid-sentence! ELEVEN stopped talking in 0.014 seconds (<0.05s) and started listening immediately.",
      "warn"
    );
  }, [clearScheduledTimers, pushLog, triggerTransientFlash]);

  const dispatchSwarmTournament = useCallback(() => {
    clearScheduledTimers();
    setSwarmActive(true);
    setOrbState("THINKING");
    triggerTransientFlash("▶ 4 ORBITING HELPERS DISPATCHED");
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
      triggerTransientFlash("⚠ ADJUDICATION: 3 VERIFIED · 1 WARNING");
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
  }, [clearScheduledTimers, pushLog, triggerTransientFlash]);

  const approveColdRoomNonce = useCallback(() => {
    clearScheduledTimers();
    triggerTransientFlash("✓ ED25519 ONE-TIME LEASE VERIFIED");
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
  }, [clearScheduledTimers, pushLog, triggerTransientFlash]);

  const quarantineColdRoom = useCallback(() => {
    clearScheduledTimers();
    setOrbState("IDLE");
    triggerTransientFlash("✕ ACTION QUARANTINED SAFELY");
    pushLog(
      "BLOCKED",
      "You cancelled the request. Zero files were changed or uploaded.",
      "warn"
    );
  }, [clearScheduledTimers, pushLog, triggerTransientFlash]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
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
  const activeFriendly =
    STATE_ORDER.find((s) => s.id === orbState) ?? STATE_ORDER[0];

  return (
    <div
      ref={rootRef}
      className="mode-dark relative min-h-screen w-full overflow-x-hidden bg-[#05070d] text-[#e8ecf5] selection:bg-[#10bc83]/30 selection:text-[#38ffbd]"
    >
      {/* Full-Viewport GenesisFX WebGL Ambient Horizon + 4 Vertical Frosted Bars */}
      <EnterAmbientBackdrop
        accentHex={activeConfig.hex}
        energy={activeFriendly.energy}
      />

      {/* Dual Radial Emerald HeroGlow Ellipses (Matching Homepage Phase 1) */}
      <div className="hero-glow" aria-hidden="true">
        <div className="hero-glow__img enter-glow-img" />
        <div className="hero-glow__img hero-glow__img--lg enter-glow-img" />
      </div>

      {/* Top GenesisFX Floating Command Header */}
      <header className="enter-header sticky top-0 z-30 border-b border-white/[0.07] bg-[#05070d]/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 sm:gap-3 px-3.5 py-2 sm:px-5 sm:py-2.5 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#10bc83]/45 bg-[#062118]/85 font-mono text-[11px] text-[#38ffbd] shadow-[0_0_16px_rgba(16,188,131,0.3)]">
                G
              </span>
              <span className="font-mono text-[11px] sm:text-xs font-normal tracking-[0.12em] sm:tracking-[0.16em] text-white whitespace-nowrap">
                ELEVEN v3.1
                <span className="hidden sm:inline"> · LIVE INTERACTIVE 3D CORE</span>
              </span>
            </div>
            <span className="hidden md:inline-flex">
              <span className="gfx-badge !py-1 !px-3 !text-[11px] whitespace-nowrap">
                <span
                  className="h-2 w-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor: activeConfig.hex,
                    boxShadow: `0 0 10px ${activeConfig.hex}`,
                  }}
                />
                <span>{activeFriendly.friendlyLabel}</span>
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <span className="hidden font-mono text-[11px] text-[#a0a0a0] 2xl:inline mr-2">
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
              <span className="sm:hidden">Early Access</span>
              <span className="hidden sm:inline">Join Early Access</span>
            </Button>
            <span className="hidden sm:inline-flex">
              <Button
                variant="secondary"
                onClick={() => {
                  setWaitlistTier("technical");
                  setIsWaitlistOpen(true);
                }}
              >
                Request Technical Access
              </Button>
            </span>
            <Button
              variant="ghost"
              onClick={() => exitToInstitutionalMode("/")}
            >
              <span className="sm:hidden">← Exit</span>
              <span className="hidden sm:inline">← Back to Website</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main 3-Column GenesisFX Interactive Cockpit */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-3.5 py-3 sm:px-5 sm:py-4 lg:px-8 lg:py-5">
        {/* Top Cockpit Intro Banner */}
        <div className="enter-banner mb-3.5 sm:mb-4 flex flex-col justify-between gap-2.5 sm:gap-3 rounded-[1.15rem] sm:rounded-[1.35rem] border border-white/[0.08] bg-[#062118]/25 px-4 py-2.5 sm:px-5 sm:py-3 backdrop-blur-xl sm:flex-row sm:items-center">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-[#38ffbd]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#10bc83] animate-pulse" />
              <span>COMPUTATIONAL CONTROL PLANE // GENESIS HOLOGRAPHIC STAGE</span>
            </div>
            <h1 className="text-base sm:text-xl lg:text-2xl font-normal heading-gradient">
              Inspect how ELEVEN thinks, listens, and enforces constitutional boundaries in real time.
            </h1>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 shrink-0">
            <span className="gfx-bubble !h-8 !py-1 !px-3 !text-[11px] whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              54K GPU Particles
            </span>
            <span className="gfx-bubble !h-8 !py-1 !px-3 !text-[11px] whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
              5-Stage ActionGate
            </span>
            <span className="hidden xl:inline-flex">
              <span className="gfx-bubble !h-8 !py-1 !px-3 !text-[11px] whitespace-nowrap">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                127.0.0.1 Loopback
              </span>
            </span>
          </div>
        </div>

        <main className="grid grid-cols-1 gap-4 sm:gap-5 overflow-x-clip lg:grid-cols-12 lg:overflow-visible">
          {/* Left Column: 7 Cognitive States + 2 Live Demos + Private Memory */}
          <section className="order-2 lg:order-1 flex flex-col justify-between gap-4 lg:col-span-3">
            <div className="enter-left-card gfx-card p-4">
              <span className="gfx-card__border" aria-hidden="true" />
              <div className="relative z-10 flex items-center justify-between gap-2 border-b border-white/[0.07] pb-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#a0a0a0]">
                  01 · Click Any AI State
                </span>
                <span className="shrink-0 whitespace-nowrap rounded-full border border-[#10bc83]/35 bg-[#062118]/75 px-2.5 py-0.5 font-mono text-[10px] text-[#38ffbd]">
                  LIVE 3D
                </span>
              </div>

              <div className="relative z-10 mt-2.5 space-y-1.5">
                {STATE_ORDER.map((item) => {
                  const active = orbState === item.id;
                  const cfg = ORB_STATE_CONFIGS[item.id];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectState(item.id)}
                      className={`relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-xl border px-3 py-1.5 text-left transition-colors duration-200 ${
                        active
                          ? "border-[#10bc83]/60 text-white shadow-[0_0_24px_rgba(16,188,131,0.16)]"
                          : "border-white/[0.08] bg-[#05070d]/78 text-[#a0a0a0] hover:border-[#10bc83]/35 hover:text-white"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="enter-active-state-beam"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(16,188,131,0.24),rgba(6,33,24,0.82))]"
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-200"
                          style={{
                            backgroundColor: cfg.hex,
                            boxShadow: active ? `0 0 10px ${cfg.hex}` : undefined,
                            opacity: active ? 1 : 0.65,
                            transform: active ? "scale(1.15)" : "scale(1)",
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
                      <kbd className="relative z-10 rounded-full border border-white/[0.12] bg-black/50 px-2 py-0.5 font-mono text-[10px] text-[#38ffbd]">
                        {item.keyHint}
                      </kbd>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2 Fun Live Demos */}
            <div className="enter-left-card gfx-card p-4">
              <span className="gfx-card__border" aria-hidden="true" />
              <div className="relative z-10 flex items-center justify-between gap-2 border-b border-white/[0.07] pb-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#a0a0a0]">
                  02 · Try Live Action Demos
                </p>
                <span className="shrink-0 whitespace-nowrap font-mono text-[10px] text-[#10bc83]">
                  INTERACTIVE
                </span>
              </div>
              <div className="relative z-10 mt-3 space-y-2.5">
                <button
                  type="button"
                  onClick={dispatchSwarmTournament}
                  className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-[#10bc83]/45 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(16,188,131,0.22),rgba(6,33,24,0.85))] px-3.5 py-2.5 text-left text-xs text-[#38ffbd] transition-all hover:border-[#38ffbd] hover:shadow-[0_0_26px_rgba(16,188,131,0.24)]"
                >
                  <GenesisSparkles />
                  <span className="relative z-10 flex items-center justify-between font-mono font-normal text-white">
                    <span className="text-[#38ffbd]">▶ Launch 4 Helper Satellites</span>
                    <span className="rounded-full border border-[#10bc83]/40 bg-[#05070d]/70 px-2 py-0.5 text-[10px]">
                      [S]
                    </span>
                  </span>
                  <span className="relative z-10 mt-1 block text-[11px] text-[#a0a0a0]">
                    Watch 4 3D helpers orbit the Orb &amp; catch a hidden warning
                  </span>
                </button>

                <button
                  type="button"
                  onClick={triggerBargeIn}
                  className="w-full cursor-pointer rounded-xl border border-[#e29d58]/45 bg-[radial-gradient(120%_90%_at_50%_100%,rgba(226,157,88,0.2),rgba(20,14,6,0.88))] px-3.5 py-2.5 text-left text-xs text-[#e29d58] transition-all hover:border-[#e29d58]/80 hover:shadow-[0_0_24px_rgba(226,157,88,0.2)]"
                >
                  <span className="flex items-center justify-between font-mono font-normal">
                    <span>⚡ Interrupt Mid-Sentence</span>
                    <span className="rounded-full border border-[#e29d58]/40 bg-[#05070d]/70 px-2 py-0.5 text-[10px]">
                      [B]
                    </span>
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
                    className="w-full cursor-pointer rounded-full border border-white/[0.1] bg-[#05070d] px-3.5 py-2 font-mono text-[11px] text-[#a0a0a0] hover:border-[#10bc83]/40 hover:text-white"
                  >
                    Clear Orbiting Helpers ({satellites.length})
                  </button>
                )}
              </div>
            </div>

            {/* Private Local Memory Status */}
            <div className="enter-left-card gfx-card p-4 text-[11.5px]">
              <span className="gfx-card__border" aria-hidden="true" />
              <div className="relative z-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#a0a0a0] border-b border-white/[0.07] pb-2">
                  03 · Private Memory (On Your PC)
                </p>
                <div className="mt-2.5 space-y-2 text-[#a0a0a0]">
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
            </div>
          </section>

          {/* Center Column: Interactive 3D WebGL Holographic Orb in GenesisShowcaseFrame */}
          <section className="order-1 lg:order-2 enter-center-stage lg:col-span-6 flex flex-col">
            <div className="gfx-frame flex-1 flex flex-col">
              <div className="gfx-frame__highlight" aria-hidden="true">
                <div className="gfx-frame__highlight-glow" />
              </div>
              <span className="gfx-frame__top-beam enter-top-beam origin-center" aria-hidden="true" />

              <div className="relative z-[1] flex min-h-[380px] sm:min-h-[500px] flex-1 flex-col justify-between overflow-hidden rounded-[1.45rem] border border-white/10 bg-[#05070d]/92">
                <div className="pointer-events-none relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 border-b border-white/[0.06] bg-[#05070d]/75 px-3.5 py-2.5 sm:px-5 sm:py-3 font-mono text-[10.5px] sm:text-[11px] backdrop-blur-md">
                  <div>
                    <p className="flex items-center gap-2 text-[#38ffbd]">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#10bc83] animate-pulse" />
                      <span>DRAG TO SPIN IN 3D · CLICK TO PULSE</span>
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-[#a0a0a0]">
                      {activeFriendly.friendlySub}
                    </p>
                  </div>

                  {/* Live State-Coupled Acoustic / Cognitive Waveform Bars */}
                  <div className="flex items-center gap-4">
                    <div
                      aria-hidden="true"
                      className="hidden sm:flex h-6 items-end gap-1 rounded-full border border-white/[0.07] bg-black/40 px-2.5 py-1.5"
                    >
                      {[0.1, 0.35, 0.18, 0.45, 0.25, 0.52, 0.14].map((delay, idx) => (
                        <span
                          key={idx}
                          className="enter-wave-bar w-[2.5px] h-full rounded-full"
                          style={
                            {
                              backgroundColor: activeConfig.hex,
                              "--wave-dur": `${activeFriendly.waveSpeed + idx * 0.08}s`,
                              "--wave-delay": `${delay}s`,
                            } as React.CSSProperties
                          }
                        />
                      ))}
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <p style={{ color: activeConfig.hex }} className="font-normal">
                        {activeFriendly.friendlyLabel.toUpperCase()}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#a0a0a0]">
                        {swarmActive
                          ? "4 HELPERS WORKING…"
                          : satellites.length > 0
                          ? "4 HELPERS FACT-CHECKED"
                          : "PROTECTED BY 5 SAFETY GATES"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live 3D WebGL Holographic Orb Viewport (fullHeight edge-to-edge fill) */}
                <div className="relative min-h-[300px] sm:min-h-[540px] w-full flex-1 flex bg-[radial-gradient(circle_at_50%_46%,rgba(16,188,131,0.08),transparent_68%)]">
                  <ElevenHolographicOrb3D
                    state={orbState}
                    bargeInSignal={bargeInSignal}
                    satellites={satellites}
                    fullHeight
                  />

                  {/* Transient State / Barge-In Telemetry Flash Pill */}
                  <AnimatePresence>
                    {transientFlash && (
                      <motion.div
                        key={transientFlash}
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="pointer-events-none absolute top-3.5 left-4 z-20 rounded-full border border-[#38ffbd]/40 bg-[#062118]/85 px-3.5 py-1 font-mono text-[10px] tracking-[0.12em] text-[#38ffbd] backdrop-blur-md shadow-[0_0_20px_rgba(16,188,131,0.28)]"
                      >
                        {transientFlash}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Friendly Approval Card Popup when State 7 ("Waiting for Your OK") is active */}
                <AnimatePresence mode="wait">
                  {orbState === "AUTHORITY_REQUIRED" ? (
                    <motion.div
                      key="approval-drawer"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      className="relative z-20 m-3.5 sm:m-4 rounded-2xl border border-[#ef4444]/60 bg-[#140b0e]/95 p-4 sm:p-5 text-xs shadow-2xl backdrop-blur-xl"
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
                      className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] bg-[#05070d]/90 px-3.5 py-2 sm:px-5 sm:py-2.5 font-mono text-[9.5px] sm:text-[10px] text-[#a0a0a0]"
                    >
                      <span className="text-[#10bc83]">● VOICE REPLY GOAL: &lt;0.5 SECONDS</span>
                      <span>PASSWORDS &amp; FILES: PROTECTED</span>
                      <span className="text-[#38ffbd]">EMERGENCY STOP: 0.05 SECONDS</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

          {/* Right Column: Orbiting Helpers Status + Plain-English Activity Feed */}
          <section className="order-3 lg:order-3 flex flex-col justify-between gap-4 lg:col-span-3">
            <div className="enter-right-card gfx-card p-4">
              <span className="gfx-card__border" aria-hidden="true" />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 border-b border-white/[0.07] pb-2.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#a0a0a0]">
                    Orbiting AI Helpers
                  </span>
                  <span className="shrink-0 whitespace-nowrap rounded-full border border-[#10bc83]/35 bg-[#062118]/75 px-2.5 py-0.5 font-mono text-[10px] text-[#38ffbd]">
                    PROOF CHECK
                  </span>
                </div>

                {satellites.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#a0a0a0]">
                    <p className="font-normal text-sm heading-gradient">No helpers orbiting yet</p>
                    <p className="mt-2 text-[11.5px] leading-relaxed text-[#a0a0a0]">
                      Click{" "}
                      <strong className="text-[#38ffbd] font-normal">
                        &ldquo;Launch 4 Helper Satellites&rdquo;
                      </strong>{" "}
                      on the left to watch 4 3D spheres orbit the core and fact-check a job!
                    </p>
                  </div>
                ) : (
                  <div className="mt-3.5 space-y-2.5 text-xs">
                    {satellites.map((sat) => (
                      <motion.div
                        key={sat.stepId}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-white/[0.07] bg-[#05070d]/85 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-normal text-white">{sat.stepId}</span>
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
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Live Plain-English Activity Stream */}
            <div className="enter-right-card gfx-card p-4 lg:p-5 flex-1">
              <span className="gfx-card__border" aria-hidden="true" />
              <div className="relative z-10">
                <div className="flex items-center justify-between border-b border-white/[0.07] pb-2.5 lg:pb-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#a0a0a0]">
                    Live Activity Feed
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#10bc83]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83] animate-pulse" />
                    REAL-TIME
                  </span>
                </div>

                <div className="mt-3 lg:mt-3.5 space-y-2.5 text-xs">
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
            </div>
          </section>
        </main>

        {/* Scroll-Triggered Below-the-Fold L5 Constitutional Architecture Telemetry Band */}
        <section
          id="enter-telemetry-band"
          className="mt-8 border-t border-white/[0.07] pt-8 pb-6 lg:mt-12 lg:pt-12 lg:pb-8"
        >
          <div className="enter-arch-intro flex flex-col justify-between gap-5 lg:gap-6 md:flex-row md:items-end mb-6 lg:mb-8">
            <div className="space-y-3 max-w-2xl">
              <span className="gfx-badge">
                <span className="h-2 w-2 rounded-full bg-[#10bc83] animate-pulse" />
                <span>UNDER THE HOLOGRAPHIC SHELL · INV-01 &amp; INV-04</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal leading-tight heading-gradient">
                Four isolated OS process rooms behind one real-time 3D membrane.
              </h2>
              <p className="text-sm text-[#a0a0a0] leading-relaxed">
                Every orb transition above mirrors real runtime state transitions across isolated local processes—never shared cloud memory.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/architecture" variant="secondary" arrow>
                Explore Architecture
              </Button>
              <Button href="/autonomy" variant="ghost">
                Inspect Autonomy Spec
              </Button>
            </div>
          </div>

          {/* 4 Isolated Process Room Cards */}
          <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OS_PROCESS_ROOMS.map((room) => (
              <div
                key={room.id}
                className="enter-room-card gfx-card p-4 lg:p-5 flex flex-col justify-between gap-3.5 lg:gap-4"
              >
                <span className="gfx-card__border" aria-hidden="true" />
                <div className="relative z-10 flex items-start gap-3">
                  <span className="gfx-feature-bar" aria-hidden="true" />
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.12em] text-[#38ffbd]">
                      {room.id}
                    </p>
                    <h3 className="mt-1 text-base font-normal text-white">
                      {room.name}
                    </h3>
                  </div>
                </div>
                <p className="relative z-10 text-xs text-[#a0a0a0] leading-relaxed">
                  {room.detail}
                </p>
                <div className="relative z-10 flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[10.5px]">
                  <span className="text-[#686868]">ENFORCEMENT</span>
                  <span className="text-[#10bc83]">{room.metric}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 5-Stage ActionGate Verification Pipeline */}
          <div className="mt-6 lg:mt-8 gfx-card p-4 sm:p-6">
            <span className="gfx-card__border" aria-hidden="true" />
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] pb-3.5 mb-4 lg:mb-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#38ffbd]">
                5-STAGE PRE-EXECUTION ACTIONGATE PIPELINE (INV-04)
              </span>
              <span className="font-mono text-[10.5px] text-[#a0a0a0]">
                MANDATORY BEFORE EVERY FILE WRITE OR SHELL EXECUTION
              </span>
            </div>
            <div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {ACTION_GATE_STAGES.map((stage) => (
                <div
                  key={stage.step}
                  className="enter-gate-step rounded-xl border border-white/[0.07] bg-[#05070d]/85 p-3.5"
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-[#10bc83]">GATE {stage.step}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  </div>
                  <p className="mt-1.5 text-sm font-normal text-white">{stage.title}</p>
                  <p className="mt-1 text-[11px] text-[#a0a0a0] leading-snug">
                    {stage.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        initialTier={waitlistTier}
      />
    </div>
  );
}
