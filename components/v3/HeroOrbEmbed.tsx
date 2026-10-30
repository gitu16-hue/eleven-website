"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useInView } from "framer-motion";
import type { OrbRuntimeState } from "@/components/three/ElevenHolographicOrb3D";

// Dynamically import the 3D WebGL Holographic Orb with graceful fallback
const ElevenHolographicOrb3D = dynamic(
  () =>
    import("@/components/three/ElevenHolographicOrb3D").then(
      (mod) => mod.ElevenHolographicOrb3D
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[380px] sm:min-h-[460px] w-full flex-col items-center justify-center rounded-sm border border-el-border bg-el-bg-raised/70 p-8 backdrop-blur-xs">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-el-border-strong border-t-el-accent" />
        <span className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-el-fg-faint">
          INITIALIZING COGNITIVE CORE…
        </span>
      </div>
    ),
  }
);

const ORB_HERO_STATES: {
  id: OrbRuntimeState;
  label: string;
  tag: string;
  desc: string;
  color: string;
}[] = [
  {
    id: "IDLE",
    label: "Resting",
    tag: "IDLE // READY",
    desc: "Waiting quietly on your computer with sovereign local memory",
    color: "#647A6A",
  },
  {
    id: "LISTENING",
    label: "Listening",
    tag: "16kHz PCM STREAM",
    desc: "Real-time speech perception without latency lag or cloud leak",
    color: "#00F0FF",
  },
  {
    id: "THINKING",
    label: "Planning",
    tag: "DAG REASONING",
    desc: "Background multi-step DAG action proposal decomposition",
    color: "#8B5CF6",
  },
  {
    id: "VERIFYING",
    label: "Verifying",
    tag: "RING-0 AUDIT",
    desc: "Deterministic policy checking before any action executes",
    color: "#00FF9D",
  },
];

const CYCLE_INTERVAL_MS = 5000;

export function HeroOrbEmbed() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: false, margin: "100px" });
  const [activeState, setActiveState] = useState<OrbRuntimeState>("IDLE");
  const [isAutoCycle, setIsAutoCycle] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const activelyCycling = isAutoCycle && inView && tabVisible;

  // Zero-re-render auto-cycle: 1 timeout per 5s instead of 20 setState/sec
  useEffect(() => {
    if (!activelyCycling) return;

    const timer = setTimeout(() => {
      setActiveState((current) => {
        const currentIndex = ORB_HERO_STATES.findIndex((s) => s.id === current);
        const nextIndex = (currentIndex + 1) % ORB_HERO_STATES.length;
        return ORB_HERO_STATES[nextIndex].id;
      });
    }, CYCLE_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [activelyCycling, activeState]);

  const handleStateClick = (id: OrbRuntimeState) => {
    setActiveState(id);
    setIsAutoCycle(false);
  };

  const handleToggleAuto = () => {
    setIsAutoCycle((prev) => !prev);
  };

  const activeMeta =
    ORB_HERO_STATES.find((s) => s.id === activeState) || ORB_HERO_STATES[0];

  return (
    <div ref={rootRef} className="relative flex flex-col items-center">
      {/* 3D Orb Canvas Container */}
      <div className="relative aspect-square w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] overflow-hidden rounded-sm border border-el-border-strong/60 bg-radial-[at_50%_50%] from-el-bg-raised to-el-bg shadow-el-lg">
        {/* Subtle grid backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-scifi opacity-60"
        />

        {/* 3D Visualizer */}
        <div className="relative h-full w-full">
          <ElevenHolographicOrb3D state={activeState} />
        </div>

        {/* Corner registration markers */}
        <span className="absolute top-2 left-2.5 font-mono text-[9px] text-el-fg-faint opacity-50">+</span>
        <span className="absolute top-2 right-2.5 font-mono text-[9px] text-el-fg-faint opacity-50">+</span>
        <span className="absolute bottom-2 left-2.5 font-mono text-[9px] text-el-fg-faint opacity-50">+</span>
        <span className="absolute bottom-2 right-2.5 font-mono text-[9px] text-el-fg-faint opacity-50">+</span>

        {/* Top telemetry tag */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 rounded-full border border-el-border bg-el-bg-raised/80 px-2.5 py-0.5 backdrop-blur-sm shadow-xs">
          <div className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: activeMeta.color }}
            />
            <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-el-fg-muted">
              SIMULATOR · {activeMeta.tag}
            </span>
          </div>
        </div>

        {/* GPU Compositor Auto-Cycle Progress Bar (scaleX, 0 React re-renders) */}
        {activelyCycling && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-el-border/40 overflow-hidden">
            <div
              key={activeState}
              className="h-full w-full origin-left bg-el-accent"
              style={{
                animation: `el-progress-fill ${CYCLE_INTERVAL_MS}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>

      {/* Interactive Mode Controls + Auto Cycle Toggle */}
      <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 rounded-sm border border-el-border bg-el-bg-raised p-1 font-mono text-[10.5px] shadow-el-sm">
        <button
          type="button"
          onClick={handleToggleAuto}
          className={`cursor-pointer rounded-xs px-2.5 py-1.5 min-h-[34px] text-[9.5px] font-semibold transition-all ${
            isAutoCycle
              ? "bg-el-accent/20 text-el-accent border border-el-accent/40"
              : "text-el-fg-faint hover:text-el-fg"
          }`}
          title={isAutoCycle ? "Pause auto sequence" : "Resume auto sequence"}
        >
          {isAutoCycle ? "⏸ AUTO" : "▶ PLAY"}
        </button>

        <span className="text-el-border-strong text-[9.5px]">|</span>

        {ORB_HERO_STATES.map((s) => {
          const isActive = activeState === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleStateClick(s.id)}
              className={`relative cursor-pointer rounded-xs px-2.5 py-1.5 min-h-[34px] text-[10px] transition-all ${
                isActive
                  ? "bg-el-accent text-[#04060A] shadow-xs font-semibold"
                  : "text-el-fg-muted hover:text-el-fg hover:bg-el-bg"
              }`}
              title={s.desc}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Living State Description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={activeState}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.2 }}
          className="mt-1 text-center font-mono text-[10.5px] text-el-fg-faint"
        >
          {activeMeta.desc}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
