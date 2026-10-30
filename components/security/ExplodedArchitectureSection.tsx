"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Layers,
  Shield,
  SlidersHorizontal,
  RotateCcw,
  Cpu,
  Lock,
  Terminal,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";
import { usePrefersReducedMotion } from "@/components/security/useSecurityEnv";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ExplodedLayerData {
  index: number;
  id: string;
  name: string;
  techTitle: string;
  accent: string;
  accentRgb: string;
  latencyTarget: string;
  securityInvariant: string;
  domain: string;
  description: string;
  contract: string;
  isHardBoundary?: boolean;
}

export const ARCHITECTURE_4_LAYERS: ExplodedLayerData[] = [
  {
    index: 0,
    id: "conscious-interface",
    name: "Conscious Interface",
    techTitle: "F.R.I.D.A.Y. + VoiceStudio <300ms Stream",
    accent: "#06b6d4",
    accentRgb: "6, 182, 212",
    latencyTarget: "<300ms Duplex Stream",
    securityInvariant: "INV-01 Duplex Acoustic Isolation",
    domain: "eleven_voice / 16kHz PCM Lockless Buffer",
    description:
      "Dedicated microphone and speaker worker running in an unprivileged, isolated process. Even if deep research stalls, voice never stutters.",
    contract: "Audio Fault Isolation · Non-Blocking Turn Interrupt · VAD Barge-in",
  },
  {
    index: 1,
    id: "cognitive-triad",
    name: "Cognitive Triad & Hive Spawner",
    techTitle: "Jev Triage + CDM TaskSpec Router",
    accent: "#8b5cf6",
    accentRgb: "139, 92, 246",
    latencyTarget: "<50ms Triage & Dispatch",
    securityInvariant: "INV-03 TaskSpec Provenance Binding",
    domain: "eleven_supervisor / IPC Bus",
    description:
      "Decomposes goals into immutable TaskSpecs. Spawns ephemeral worker subagents with strictly scoped capabilities and bounded TTLs.",
    contract: "Immutable JSON-RPC TaskSpec · Bounded Subagent Lifetime (TTL ≤ 300s)",
  },
  {
    index: 2,
    id: "l5-hypervisor",
    name: "L5 Deterministic Hypervisor",
    techTitle: "Default-Deny Egress + DEC-008 Gate",
    accent: "#10b981",
    accentRgb: "16, 185, 129",
    latencyTarget: "<0.05ms Kernel Intercept",
    securityInvariant: "INV-02 Default-Deny Network Egress",
    domain: "kernel_hypervisor / OS Sandbox",
    description:
      "The un-bypassable security boundary. Intercepts all file, network, and system API calls. Tier 3 privileged actions require explicit physical human nonces.",
    contract: "Monotonic Tier Ceiling · 30s Physical DEC-008 Nonce · Zero Network Egress",
    isHardBoundary: true,
  },
  {
    index: 3,
    id: "sovereign-vault",
    name: "Sovereign Engram Vault",
    techTitle: "AES-256-GCM + Windows DPAPI",
    accent: "#f59e0b",
    accentRgb: "245, 158, 11",
    latencyTarget: "<5ms Hardware Key Decrypt",
    securityInvariant: "INV-09 At-Rest DPAPI Enclave Encryption",
    domain: "eleven_vault / Encrypted SQLite",
    description:
      "Stores conversations, entity graphs, and credentials exclusively on local disk. Master encryption key never touches any cloud API.",
    contract: "Hardware-Backed Key Derivation · Zero Remote Sync Without Operator Opt-in",
  },
];

interface ExplodedArchitectureSectionProps {
  onSelectLayer?: (layer: ExplodedLayerData | null) => void;
  selectedLayer?: ExplodedLayerData | null;
}

export function ExplodedArchitectureSection({
  onSelectLayer,
  selectedLayer = null,
}: ExplodedArchitectureSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTriggerRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  const reducedMotion = usePrefersReducedMotion();
  const [separation, setSeparation] = useState<number>(reducedMotion ? 85 : 32);
  const [activeLayerIndex, setActiveLayerIndex] = useState<number | null>(null);

  // Synchronize internal active layer with external prop
  useEffect(() => {
    if (selectedLayer !== undefined) {
      setActiveLayerIndex(selectedLayer ? selectedLayer.index : null);
    }
  }, [selectedLayer]);

  // GSAP ScrollTrigger Setup
  useEffect(() => {
    if (reducedMotion || typeof window === "undefined" || !pinTriggerRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // Scrub separation from 18px to 115px over 1600px of scroll
      ScrollTrigger.create({
        trigger: pinTriggerRef.current,
        start: "top top",
        end: "+=1600",
        pin: true,
        scrub: 0.7,
        onUpdate: (self) => {
          const progress = self.progress;
          // Scale separation from 18px (stacked) to 115px (fully exploded)
          const computedSeparation = Math.round(18 + progress * (115 - 18));
          setSeparation(computedSeparation);

          // Animate central bioluminescent data pulse
          if (pulseRef.current) {
            pulseRef.current.style.transform = `translateY(${progress * 280}px)`;
            pulseRef.current.style.opacity = `${0.3 + Math.sin(progress * Math.PI) * 0.7}`;
          }
        },
      });
    }, pinTriggerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleLayerClick = (layer: ExplodedLayerData) => {
    if (activeLayerIndex === layer.index) {
      setActiveLayerIndex(null);
      onSelectLayer?.(null);
    } else {
      setActiveLayerIndex(layer.index);
      onSelectLayer?.(layer);
    }
  };

  const handleReset = () => {
    setSeparation(35);
    setActiveLayerIndex(null);
    onSelectLayer?.(null);
  };

  const activeSpec =
    activeLayerIndex !== null ? ARCHITECTURE_4_LAYERS[activeLayerIndex] : null;

  return (
    <div
      ref={pinTriggerRef}
      className="relative w-full rounded-2xl border border-[#17232d] bg-[#070d12] p-5 sm:p-7 lg:p-10 shadow-2xl overflow-hidden"
    >
      {/* Top Section Header with Live Separation Controls */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-[#17232d] pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-cyan-400 font-semibold">
              SCROLL-SCRUBBED 3D EXPLODED ARCHITECTURE
            </span>
            <span className="rounded-xs border border-[#1c2d3a] bg-[#0a141d] px-1.5 py-0.5 font-mono text-[9.5px] text-slate-400">
              1600PX PIN TRIGGER
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            4 Translucent Glass Planes · Scroll page down or drag the separation slider to pull
            layers apart
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Manual Scrub Slider */}
          <div className="flex items-center gap-2.5 rounded-md border border-[#1c2d3a] bg-[#0a141d] px-3 py-1.5 font-mono text-xs text-slate-300">
            <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[11px] text-slate-400">Gap:</span>
            <input
              type="range"
              min={18}
              max={115}
              value={separation}
              onChange={(e) => setSeparation(Number(e.target.value))}
              className="h-1 w-24 sm:w-32 cursor-pointer accent-cyan-400 bg-slate-800 rounded-lg"
              aria-label="Layer Separation Distance"
            />
            <span className="w-10 text-right font-semibold text-cyan-300">
              {separation}px
            </span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="cursor-pointer flex items-center gap-1.5 rounded-md border border-[#1c2d3a] bg-[#0a141d] px-3 py-1.5 font-mono text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 3D Stage (Left/Center) + Docked Spec Inspector (Morph 3, Right) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[520px]">
        {/* 3D Isometric Viewport Container */}
        <div
          ref={containerRef}
          className="relative lg:col-span-7 xl:col-span-8 flex items-center justify-center py-10 overflow-visible"
          style={{ perspective: "1400px" }}
        >
          {/* Central Bioluminescent Data Pulse Track (GSAP Scroll Scrubbed) */}
          <div className="pointer-events-none absolute h-[320px] w-0.5 bg-gradient-to-b from-cyan-500/20 via-emerald-500/30 to-amber-500/20 z-0">
            <div
              ref={pulseRef}
              className="h-10 w-2 -left-[3px] rounded-full bg-emerald-400 blur-[3px] opacity-70 transition-transform duration-75"
            />
          </div>

          {/* 3D Stack Transform Container */}
          <div
            ref={stackRef}
            className="relative w-[280px] sm:w-[360px] md:w-[420px] h-[220px] sm:h-[260px] transition-transform duration-300"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(58deg) rotateZ(-38deg)",
            }}
          >
            {ARCHITECTURE_4_LAYERS.map((layer) => {
              // Calculate vertical translateZ based on separation slider/scroll
              // Layer 0 is top (highest translateZ), Layer 3 is bottom (0 translateZ)
              const layerTranslateZ = (3 - layer.index) * separation;
              const isSelected = activeLayerIndex === layer.index;

              return (
                <div
                  key={layer.id}
                  onClick={() => handleLayerClick(layer)}
                  className={`absolute inset-0 cursor-pointer rounded-xl border backdrop-blur-md transition-all duration-300 group ${
                    isSelected
                      ? "ring-2 ring-white shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                      : "hover:border-white/60 hover:brightness-110"
                  }`}
                  style={{
                    transform: `translateZ(${layerTranslateZ}px)`,
                    backgroundColor: `rgba(${layer.accentRgb}, 0.12)`,
                    borderColor: layer.isHardBoundary
                      ? "#10b981"
                      : `rgba(${layer.accentRgb}, 0.45)`,
                    boxShadow: layer.isHardBoundary
                      ? "0 0 25px rgba(16, 185, 129, 0.25)"
                      : undefined,
                  }}
                >
                  {/* Glass Card Surface Details */}
                  <div className="p-4 sm:p-5 h-full flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full shadow-sm"
                          style={{ backgroundColor: layer.accent }}
                        />
                        <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-slate-100">
                          {layer.name}
                        </span>
                      </div>
                      {layer.isHardBoundary && (
                        <span className="rounded-xs border border-emerald-400/60 bg-emerald-950/80 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-300 shadow-sm animate-pulse">
                          HARD SECURITY BOUNDARY
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="font-mono text-[11px] sm:text-xs text-slate-300 font-medium">
                        {layer.techTitle}
                      </p>
                      <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
                        <span>Latency: {layer.latencyTarget}</span>
                        <span>·</span>
                        <span className="text-emerald-400">{layer.securityInvariant}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-2 font-mono text-[9px] text-slate-400">
                      <span>{layer.domain}</span>
                      <span className="text-cyan-300 group-hover:translate-x-1 transition-transform">
                        Click to Inspect Spec →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Morph 3: Docked Spec Inspector Card (Right Column) */}
        <div className="lg:col-span-5 xl:col-span-4 min-h-[420px] flex items-center">
          <AnimatePresence mode="wait">
            {activeSpec ? (
              <motion.div
                key={activeSpec.id}
                layoutId={`layer-spec-${activeSpec.index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="w-full rounded-xl border p-6 shadow-2xl relative bg-[#091118]/95 backdrop-blur-xl"
                style={{
                  borderColor: `rgba(${activeSpec.accentRgb}, 0.5)`,
                  boxShadow: `0 0 35px rgba(${activeSpec.accentRgb}, 0.15)`,
                }}
              >
                {/* Header with Close */}
                <div className="flex items-center justify-between border-b border-[#17232d] pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 rounded-full shadow-sm"
                      style={{ backgroundColor: activeSpec.accent }}
                    />
                    <div>
                      <motion.h4
                        layout="position"
                        className="font-mono text-sm font-semibold text-slate-100"
                      >
                        {activeSpec.name}
                      </motion.h4>
                      <motion.p
                        layout="position"
                        className="font-mono text-[10px] text-slate-400"
                      >
                        Layer 0{activeSpec.index + 1} of 04 · {activeSpec.domain}
                      </motion.p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveLayerIndex(null);
                      onSelectLayer?.(null);
                    }}
                    className="cursor-pointer rounded-xs border border-slate-700 bg-slate-900/60 p-1 text-slate-400 hover:text-white transition-colors"
                    aria-label="Close Specification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Body Specs */}
                <div className="space-y-4">
                  <motion.p
                    layout="position"
                    className="text-xs text-slate-300 leading-relaxed"
                  >
                    {activeSpec.description}
                  </motion.p>

                  <div className="space-y-2.5 rounded-md border border-[#17232d] bg-[#04080c] p-3.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>LATENCY TARGET:</span>
                      <span className="font-semibold text-cyan-300">
                        {activeSpec.latencyTarget}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <span>SECURITY INVARIANT:</span>
                      <span className="font-semibold text-emerald-400">
                        {activeSpec.securityInvariant}
                      </span>
                    </div>

                    <div className="border-t border-[#17232d] pt-2 text-slate-400">
                      <span className="block text-[10px] text-slate-500 mb-1">
                        BOUNDARY CONTRACT:
                      </span>
                      <span className="text-[10.5px] text-slate-200">
                        {activeSpec.contract}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Runtime Verified Invariant
                    </span>
                    <span className="text-slate-500">SPEC: DEC-008</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="w-full rounded-xl border border-dashed border-[#1c2d3a] bg-[#091118]/40 p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                <Layers className="h-8 w-8 text-cyan-400/60 animate-pulse" />
                <div>
                  <p className="font-mono text-xs font-medium text-slate-300">
                    Interactive Layer Inspector (Morph 3)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[24ch]">
                    Click any floating glass plane in the 3D stack to undock its real-time
                    technical contract.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
