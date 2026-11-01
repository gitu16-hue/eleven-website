"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Layers,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
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
    techTitle: "VoiceStudio <300ms stream",
    accent: "var(--el-sec-lime)",
    accentRgb: "184, 243, 107",
    latencyTarget: "<300ms duplex stream",
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
    techTitle: "Triage & CDM TaskSpec Router",
    accent: "var(--el-sec-sage-light)",
    accentRgb: "178, 195, 183",
    latencyTarget: "<50ms triage & dispatch",
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
    accent: "var(--el-sec-lime)",
    accentRgb: "184, 243, 107",
    latencyTarget: "<0.05ms kernel intercept",
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
    accent: "var(--el-sec-porcelain)",
    accentRgb: "245, 245, 240",
    latencyTarget: "<5ms hardware key decrypt",
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
  selectedLayer,
}: ExplodedArchitectureSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTriggerRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  const prefersReduced = usePrefersReducedMotion();

  // Controlled layer expansion distance (in pixels between planes)
  // Default resting: 32px, Maximum exploded scrub: 110px
  const [separation, setSeparation] = useState<number>(36);
  const [activeLayerIndex, setActiveLayerIndex] = useState<number | null>(
    selectedLayer ? selectedLayer.index : null
  );
  const [prevSelectedLayer, setPrevSelectedLayer] = useState(selectedLayer);

  // Adjust state during render when selectedLayer prop changes (idiomatic React pattern)
  if (selectedLayer !== prevSelectedLayer) {
    setPrevSelectedLayer(selectedLayer);
    setActiveLayerIndex(selectedLayer ? selectedLayer.index : null);
  }

  // GSAP ScrollTrigger Scroll-Scrub binding
  useEffect(() => {
    if (prefersReduced || !pinTriggerRef.current || !stackRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Scrub the CSS variable --layer-gap from 32px to 105px over 1600px of scrolling
      ScrollTrigger.create({
        trigger: pinTriggerRef.current,
        start: "top center",
        end: "+=1600",
        scrub: 1.2,
        onUpdate: (self) => {
          // Linear interpolation between 32px and 105px
          const targetGap = 32 + self.progress * 73;
          setSeparation(Math.round(targetGap));

          // Also scrub 3D rotation slightly for dynamic parallax
          if (stackRef.current) {
            const rotX = 58 - self.progress * 8; // 58deg -> 50deg
            const rotZ = -38 + self.progress * 12; // -38deg -> -26deg
            stackRef.current.style.transform = `rotateX(${rotX}deg) rotateZ(${rotZ}deg)`;
          }

          // Move the bioluminescent data packet up and down the spine
          if (pulseRef.current) {
            const pulseY = self.progress * 280;
            pulseRef.current.style.transform = `translateY(${pulseY}px)`;
          }
        },
      });
    }, pinTriggerRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  const handleSliderChange = (newVal: number) => {
    setSeparation(newVal);
  };

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
    setSeparation(36);
    setActiveLayerIndex(null);
    onSelectLayer?.(null);
  };

  const activeSpec =
    activeLayerIndex !== null ? ARCHITECTURE_4_LAYERS[activeLayerIndex] : null;

  return (
    <div
      ref={pinTriggerRef}
      className="relative w-full rounded-md border border-el-border bg-el-sec-graphite p-5 sm:p-7 lg:p-10 shadow-sm overflow-hidden"
    >
      {/* Top Section Header with Live Separation Controls */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-el-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-el-sec-lime">
              Scroll-scrubbed 3D exploded architecture
            </span>
            <span className="rounded-xs border border-el-border bg-el-sec-graphite-deep px-1.5 py-0.5 text-[11px] text-el-fg-faint">
              1600px pin trigger
            </span>
          </div>
          <p className="text-xs text-el-fg-muted mt-1">
            4 translucent glass planes · Scroll page or drag slider to pull layers apart
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Manual Scrub Slider */}
          <div className="flex items-center gap-2.5 rounded-sm border border-el-border bg-el-sec-graphite-deep px-3 py-1.5 text-xs text-el-fg-muted">
            <SlidersHorizontal className="h-3.5 w-3.5 text-el-sec-lime" />
            <span className="text-xs text-el-fg-faint">Gap:</span>
            <input
              type="range"
              min={18}
              max={115}
              value={separation}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="h-1 w-24 sm:w-32 cursor-pointer accent-el-sec-lime bg-el-sec-graphite rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime"
              aria-label="Layer Separation Distance"
            />
            <span className="w-10 text-right font-medium text-el-sec-lime text-xs">
              {separation}px
            </span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="cursor-pointer flex items-center gap-1.5 rounded-sm border border-el-border bg-el-sec-graphite-deep px-3 py-1.5 text-xs text-el-fg-muted hover:text-el-sec-porcelain hover:border-el-border-strong transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime active:scale-[0.99] disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 3D Stage (Left/Center) + Docked Spec Inspector (Right) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[520px]">
        {/* 3D Isometric Viewport Container */}
        <div
          ref={containerRef}
          className="relative lg:col-span-7 xl:col-span-8 flex items-center justify-center py-10 overflow-visible"
          style={{ perspective: "1400px" }}
        >
          {/* Central Bioluminescent Data Pulse Track (GSAP Scroll Scrubbed) */}
          <div className="pointer-events-none absolute h-[320px] w-0.5 bg-gradient-to-b from-el-sec-lime/20 via-el-sec-sage/30 to-el-sec-lime/20 z-0">
            <div
              ref={pulseRef}
              className="h-10 w-2 -left-[3px] rounded-full bg-el-sec-lime blur-[3px] opacity-70 transition-transform duration-75 motion-reduce:transition-none"
            />
          </div>

          {/* 3D Stack Transform Container */}
          <div
            ref={stackRef}
            className="relative w-[280px] sm:w-[360px] md:w-[420px] h-[220px] sm:h-[260px] transition-transform duration-300 motion-reduce:transition-none"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(58deg) rotateZ(-38deg)",
              "--layer-gap": `${separation}px`,
            } as React.CSSProperties}
          >
            {ARCHITECTURE_4_LAYERS.map((layer) => {
              const isSelected = activeLayerIndex === layer.index;

              return (
                <div
                  key={layer.id}
                  onClick={() => handleLayerClick(layer)}
                  className={`absolute inset-0 cursor-pointer rounded-md border backdrop-blur-md transition-colors duration-200 group ${
                    isSelected
                      ? "ring-1 ring-el-sec-lime border-el-sec-lime"
                      : "hover:border-el-border-strong"
                  }`}
                  style={{
                    transform: `translateZ(calc((3 - ${layer.index}) * var(--layer-gap, ${separation}px)))`,
                    backgroundColor: `rgba(${layer.accentRgb}, 0.08)`,
                    borderColor: isSelected
                      ? undefined
                      : `rgba(${layer.accentRgb}, 0.25)`,
                  }}
                >
                  {/* Glass Card Surface Details */}
                  <div className="p-4 sm:p-5 h-full flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: layer.accent }}
                        />
                        <span className="text-xs sm:text-sm font-medium tracking-tight text-el-sec-porcelain">
                          {layer.name}
                        </span>
                      </div>
                      {layer.isHardBoundary && (
                        <span className="rounded-xs border border-el-sec-lime/40 bg-el-sec-lime/10 px-2 py-0.5 text-[10px] font-medium text-el-sec-lime">
                          Hard security boundary
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-el-fg-muted font-medium">
                        {layer.techTitle}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-el-fg-faint">
                        <span>Latency: <code className="font-mono text-el-fg-muted">{layer.latencyTarget}</code></span>
                        <span>·</span>
                        <span className="text-el-sec-lime font-mono text-[10px]">{layer.securityInvariant}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-el-fg-faint">
                      <span>{layer.domain}</span>
                      <span className="text-el-sec-lime group-hover:translate-x-1 transition-transform motion-reduce:transition-none">
                        Inspect specification →
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
                className="w-full rounded-md border border-el-border p-6 shadow-md relative bg-el-sec-graphite-deep/95 backdrop-blur-xl"
              >
                {/* Header with Close */}
                <div className="flex items-center justify-between border-b border-el-border pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: activeSpec.accent }}
                    />
                    <div>
                      <motion.h4
                        layout="position"
                        className="text-sm font-semibold text-el-sec-porcelain"
                      >
                        {activeSpec.name}
                      </motion.h4>
                      <motion.p
                        layout="position"
                        className="text-xs text-el-fg-faint"
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
                    className="cursor-pointer rounded-xs border border-el-border bg-el-sec-graphite p-1 text-el-fg-faint hover:text-el-sec-porcelain transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-el-sec-lime active:scale-[0.99] disabled:opacity-50"
                    aria-label="Close Specification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Body Specs */}
                <div className="space-y-4">
                  <motion.p
                    layout="position"
                    className="text-xs text-el-fg-muted leading-relaxed"
                  >
                    {activeSpec.description}
                  </motion.p>

                  <div className="space-y-2.5 rounded-sm border border-el-border bg-el-sec-graphite p-3.5 text-xs">
                    <div className="flex items-center justify-between text-el-fg-faint">
                      <span>Latency target:</span>
                      <span className="font-medium text-el-sec-lime font-mono text-[11px]">
                        {activeSpec.latencyTarget}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-el-fg-faint">
                      <span>Security invariant:</span>
                      <span className="font-medium text-el-sec-lime font-mono text-[11px]">
                        {activeSpec.securityInvariant}
                      </span>
                    </div>

                    <div className="border-t border-el-border pt-2 text-el-fg-faint">
                      <span className="block text-[11px] mb-1">
                        Boundary contract:
                      </span>
                      <span className="text-xs text-el-fg-muted">
                        {activeSpec.contract}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs text-el-fg-faint">
                    <span className="flex items-center gap-1.5 text-el-sec-lime font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Runtime verified invariant
                    </span>
                    <span>Spec: DEC-008</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="w-full rounded-md border border-dashed border-el-border bg-el-sec-graphite-deep/40 p-8 text-center text-el-fg-faint flex flex-col items-center justify-center gap-3">
                <Layers className="h-8 w-8 text-el-sec-lime/60 motion-safe:animate-pulse motion-reduce:animate-none" />
                <div>
                  <p className="text-xs font-medium text-el-sec-porcelain">
                    Interactive Layer Inspector
                  </p>
                  <p className="text-xs text-el-fg-faint mt-1 max-w-[28ch]">
                    Click any floating glass plane in the 3D stack to inspect its technical contract.
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
