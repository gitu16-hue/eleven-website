"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { CheckCircle2, Clock, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export interface VoyageStage {
  id: string;
  name: string;
  shortLabel: string;
  sublabel: string;
  sla: string;
  description: string;
  statusText: string;
  requirements: string[];
}

export const DEFAULT_STAGES: VoyageStage[] = [
  {
    id: "first_look",
    name: "1st Look",
    shortLabel: "01. INTAKE",
    sublabel: "Initial Submission Triage",
    sla: "< 15 mins",
    description: "Automated entity resolution, sanction screening, and baseline appetite gating against risk invariants.",
    statusText: "Cleared: Entity identified with zero OFAC or PEP hits.",
    requirements: [
      "Entity KYC / KYB verified",
      "Appetite boundary validation (INV-01)",
      "Source verification via signed webhook",
    ],
  },
  {
    id: "clearance",
    name: "Clearance",
    shortLabel: "02. CLEAR",
    sublabel: "Broker & Market Conflicts",
    sla: "< 2 hours",
    description: "Jurisdiction validation, duplicate submission reconciliation, and broker agency clearance check.",
    statusText: "Cleared: Broker of Record confirmed. No competing wholesale market blocks.",
    requirements: [
      "BOR (Broker of Record) letter verified",
      "Territorial sovereignty confirmed",
      "D&B / Creditsafe rating: Class 1",
    ],
  },
  {
    id: "risk_review",
    name: "Risk Review",
    shortLabel: "03. AUDIT",
    sublabel: "Deterministic Actuarial AST",
    sla: "< 4 hours",
    description: "Multi-agent loss run modeling, cat-hazard score synthesis, and AST invariant enforcement.",
    statusText: "In Progress: Actuarial loss modeling completed. Risk composite score 94.2/100.",
    requirements: [
      "5-year historical loss run parsed",
      "Catastrophe exposure overlay (RMS / AIR)",
      "Zero-compromise invariant audit passed",
    ],
  },
  {
    id: "offer",
    name: "Offer",
    shortLabel: "04. QUOTE",
    sublabel: "ActionProposal Generation",
    sla: "< 30 mins",
    description: "Generates formal pricing proposal, coverage terms, and Ed25519 cryptographic signature request.",
    statusText: "Ready: Formal quote manifest generated. Awaiting human underwriter sign-off.",
    requirements: [
      "Indicated premium modeled with margin bounds",
      "Terms & conditions ledger generated",
      "Dual-underwriter authorization token ready",
    ],
  },
  {
    id: "bound",
    name: "Bound",
    shortLabel: "05. BOUND",
    sublabel: "Immutable Merkle Policy Issue",
    sla: "Instant",
    description: "Executes final binding transaction, issues policy number, and hashes receipt to local Merkle chain.",
    statusText: "Complete: Policy bound. Ed25519 signature receipt verified on ledger.",
    requirements: [
      "Signed binder agreement archived",
      "Down-payment escrow confirmed",
      "Policy certificate stamped to WORM ledger",
    ],
  },
];

interface VoyageStepperProps {
  stages?: VoyageStage[];
  activeStageIndex?: number;
  onStageChange?: (index: number, stage: VoyageStage) => void;
  className?: string;
  themeColor?: "emerald" | "cyan" | "mint";
}

export function VoyageStepper({
  stages = DEFAULT_STAGES,
  activeStageIndex: controlledIndex,
  onStageChange,
  className = "",
  themeColor = "emerald",
}: VoyageStepperProps) {
  const [internalIndex, setInternalIndex] = useState<number>(controlledIndex ?? 2);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const basePathRef = useRef<SVGPathElement | null>(null);
  const donePathRef = useRef<SVGPathElement | null>(null);
  const travelerRef = useRef<SVGGElement | null>(null);

  // GSAP animation proxy
  const progRef = useRef<{ l: number }>({ l: 0 });
  const animRef = useRef<gsap.core.Tween | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Station positions along the curve
  const [stationPoints, setStationPoints] = useState<{ x: number; y: number; len: number }[]>([]);
  const totalLengthRef = useRef<number>(0);

  // Cubic Bezier SVG Path across 1000 x 220 coordinate space
  // Smooth flowing wavy path with peaks and valleys
  const pathD =
    "M 70 115 C 170 35, 230 185, 350 145 C 430 120, 480 50, 560 75 C 650 100, 690 180, 780 150 C 850 125, 880 70, 930 95";

  // Accent styling based on theme
  const accentClasses = {
    emerald: {
      doneStroke: "#10b981",
      glowColor: "rgba(16, 185, 129, 0.4)",
      nodeRing: "border-emerald-500 bg-emerald-500/20 text-emerald-400",
      activeText: "text-emerald-400",
      glowBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
    cyan: {
      doneStroke: "#00F0FF",
      glowColor: "rgba(0, 240, 255, 0.4)",
      nodeRing: "border-cyan-400 bg-cyan-400/20 text-cyan-300",
      activeText: "text-cyan-400",
      glowBadge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    },
    mint: {
      doneStroke: "#00FF9D",
      glowColor: "rgba(0, 255, 157, 0.4)",
      nodeRing: "border-emerald-400 bg-emerald-400/20 text-emerald-300",
      activeText: "text-el-mint",
      glowBadge: "bg-emerald-500/10 text-el-mint border-emerald-500/30",
    },
  }[themeColor];

  // Position traveler along the curve and reveal stroke
  const place = useCallback(() => {
    if (!basePathRef.current || !donePathRef.current || !travelerRef.current) return;
    const l = progRef.current.l;
    const total = totalLengthRef.current || 1;

    // Get current coordinate and tangent target coordinate (2px forward)
    const p = basePathRef.current.getPointAtLength(l);
    const q = basePathRef.current.getPointAtLength(Math.min(l + 2, total));

    // Calculate tangent angle with damping factor 0.4 for smooth, non-jittery banking
    const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;

    // Apply GSAP coordinate and rotation transform to the traveler group
    gsap.set(travelerRef.current, {
      x: p.x,
      y: p.y,
      rotation: ang * 0.4,
      transformOrigin: "center center",
    });

    // Dynamically reveal the stroke along the exact arc length
    donePathRef.current.setAttribute("stroke-dasharray", `${l} ${total}`);
  }, []);

  // Initialize Station Coordinates on Mount or Resize
  const calculateStationCoordinates = useCallback(() => {
    if (!basePathRef.current || !donePathRef.current) return;

    const total = basePathRef.current.getTotalLength();
    totalLengthRef.current = total;

    // Calculate exact points at fractional intervals along the bezier curve
    const count = stages.length;
    const points: { x: number; y: number; len: number }[] = [];

    for (let i = 0; i < count; i++) {
      const frac = count > 1 ? i / (count - 1) : 0;
      const targetLen = frac * total;
      const pt = basePathRef.current.getPointAtLength(targetLen);
      points.push({ x: pt.x, y: pt.y, len: targetLen });
    }

    setStationPoints(points);

    // Initial positioning to active index
    const initialLen = points[activeIndex]?.len ?? 0;
    progRef.current.l = initialLen;
    donePathRef.current.setAttribute("stroke-dasharray", `${initialLen} ${total}`);
    place();
  }, [stages.length, activeIndex, place]);

  useEffect(() => {
    calculateStationCoordinates();

    const handleResize = () => {
      calculateStationCoordinates();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateStationCoordinates]);

  // Smoothly Animate Traveler & Done Stroke when activeIndex changes
  useEffect(() => {
    if (!stationPoints.length || !basePathRef.current) return;

    const targetLength = stationPoints[activeIndex]?.len ?? 0;

    // Cancel existing tween and animation frame
    if (animRef.current) animRef.current.kill();
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

    // GSAP tween animating the progress proxy with smooth power2.inOut curve
    animRef.current = gsap.to(progRef.current, {
      l: targetLength,
      duration: 0.95,
      ease: "power2.inOut",
      onUpdate: () => {
        rafIdRef.current = requestAnimationFrame(place);
      },
      onComplete: () => {
        place();
      },
    });

    return () => {
      if (animRef.current) animRef.current.kill();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [activeIndex, stationPoints, place]);

  // Handle station click
  const handleSelectStage = (idx: number) => {
    if (controlledIndex === undefined) {
      setInternalIndex(idx);
    }
    if (onStageChange && stages[idx]) {
      onStageChange(idx, stages[idx]);
    }
  };

  const currentStage = stages[activeIndex] || stages[0];

  return (
    <div className={`w-full overflow-hidden rounded-sm border border-el-border bg-[#04060A] font-sans shadow-el-lg ${className}`}>
      {/* Top Cyber Console Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-el-border/80 bg-el-bg-raised/80 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-el-border" />
          </div>
          <span className="font-mono text-xs font-semibold tracking-wider text-el-fg">
            VOYAGE_PIPELINE_TRACKER // CURVED SVG ROUTE STEPPER
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase text-el-fg-faint">
            CURRENT MILESTONE:
          </span>
          <span className={`rounded-xs border px-2.5 py-0.5 font-mono text-xs font-semibold uppercase ${accentClasses.glowBadge}`}>
            {currentStage.name} ({activeIndex + 1}/{stages.length})
          </span>
        </div>
      </div>

      {/* Main Curved Route SVG Canvas */}
      <div className="relative w-full px-4 pt-6 pb-2 sm:px-8">
        {/* Soft Background Ambient Grid Line */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto max-w-[960px]">
          <svg
            ref={svgRef}
            viewBox="0 -35 1000 270"
            className="w-full h-auto overflow-hidden select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Dynamic Glow Filter for Highlight Path */}
              <filter id="voyage-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Linear Gradient for Done Path */}
              <linearGradient id="voyage-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#00FF9D" />
              </linearGradient>

              {/* Radial Glow for Traveler */}
              <radialGradient id="traveler-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* 1. Base Muted Path (Full Track) */}
            <path
              ref={basePathRef}
              d={pathD}
              fill="none"
              stroke="#162033"
              strokeWidth="5"
              strokeLinecap="round"
              className="transition-colors duration-300"
            />

            {/* Subtle Dashed Center Guide */}
            <path
              d={pathD}
              fill="none"
              stroke="#22334e"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* 2. Done Path (Teal/Emerald Highlighted Foreground Path) */}
            <path
              ref={donePathRef}
              d={pathD}
              fill="none"
              stroke="url(#voyage-gradient)"
              strokeWidth="5"
              strokeLinecap="round"
              filter="url(#voyage-glow)"
              style={{
                strokeDashoffset: 0,
              }}
            />

            {/* 3. Station Milestone Nodes (Rendered directly in SVG coordinate space) */}
            {stationPoints.map((pt, idx) => {
              const isPast = idx < activeIndex;
              const isCurrent = idx === activeIndex;
              const isFuture = idx > activeIndex;

              return (
                <g
                  key={idx}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  className="cursor-pointer group"
                  onClick={() => handleSelectStage(idx)}
                >
                  {/* Invisible enlarged hit target for effortless clicking */}
                  <circle r="28" fill="transparent" />

                  {/* Pulsing Active Ring Halo */}
                  {isCurrent && (
                    <circle
                      r="22"
                      fill="none"
                      stroke={accentClasses.doneStroke}
                      strokeWidth="1.5"
                      opacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  {/* External Reticle / Glow Ring */}
                  <circle
                    r={isCurrent ? "16" : "13"}
                    fill="#06080D"
                    stroke={
                      isCurrent
                        ? accentClasses.doneStroke
                        : isPast
                        ? "#10b981"
                        : "#22334e"
                    }
                    strokeWidth={isCurrent ? "3" : "2"}
                    className="transition-all duration-300 group-hover:scale-110"
                    style={{
                      filter: isCurrent ? `drop-shadow(0 0 8px ${accentClasses.glowColor})` : undefined,
                    }}
                  />

                  {/* Inner Status Indicator */}
                  {isPast ? (
                    <path
                      d="M -4 -0.5 L -1 2.5 L 4 -2.5"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : isCurrent ? (
                    <circle r="5" fill={accentClasses.doneStroke} className="animate-pulse" />
                  ) : (
                    <circle r="3.5" fill="#334155" />
                  )}

                  {/* Station Label & Short Number in SVG */}
                  <text
                    y={idx % 2 === 0 ? "-26" : "34"}
                    textAnchor="middle"
                    className="font-mono text-[11px] font-semibold transition-all duration-200 select-none pointer-events-none"
                    fill={isCurrent ? "#00F0FF" : isPast ? "#10b981" : "#64748b"}
                  >
                    {stages[idx]?.name}
                  </text>

                  <text
                    y={idx % 2 === 0 ? "-40" : "48"}
                    textAnchor="middle"
                    className="font-mono text-[9px] uppercase tracking-wider select-none pointer-events-none"
                    fill={isCurrent ? "#94a3b8" : "#475569"}
                  >
                    {stages[idx]?.shortLabel}
                  </text>
                </g>
              );
            })}

            {/* 4. Tangent-Aligned Traveler Icon (Quantum Vessel / Glider) */}
            <g ref={travelerRef} className="pointer-events-none">
              {/* Outer Glow Disc */}
              <circle r="26" fill="url(#traveler-glow)" opacity="0.6" />

              {/* Modern Cybernetic Vessel Craft */}
              <g transform="translate(-14, -14)">
                {/* Traveler Shield Base */}
                <rect
                  x="2"
                  y="2"
                  width="24"
                  height="24"
                  rx="6"
                  fill="#06080D"
                  stroke={accentClasses.doneStroke}
                  strokeWidth="2"
                  style={{
                    filter: `drop-shadow(0 0 10px ${accentClasses.glowColor})`,
                  }}
                />

                {/* Inner Compass / Directional Arrow */}
                <path
                  d="M 18 14 L 10 10 L 13 14 L 10 18 Z"
                  fill={accentClasses.doneStroke}
                />
              </g>

              {/* Pulsing Core Light */}
              <circle r="2.5" fill="#ffffff" />
            </g>
          </svg>
        </div>
      </div>

      {/* Selected Stage Detail Drawer & Invariant Card */}
      <div className="border-t border-el-border bg-[#020306] p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Metadata & Stage Description (7 Cols) */}
          <div className="space-y-3 md:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase text-el-fg-faint">
                STAGE SPECIFICATION //
              </span>
              <span className="font-mono text-xs font-bold text-el-fg">
                {currentStage.shortLabel}: {currentStage.name}
              </span>
              <span className="rounded-xs border border-el-border bg-el-bg px-2 py-0.5 font-mono text-[10px] text-el-fg-muted">
                SLA: {currentStage.sla}
              </span>
            </div>

            <p className="text-sm text-el-fg leading-relaxed">
              {currentStage.description}
            </p>

            <div className="rounded-xs border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>{currentStage.statusText}</span>
              </div>
            </div>
          </div>

          {/* Right Verification Checklist (5 Cols) */}
          <div className="rounded-xs border border-el-border bg-[#04060A] p-4 md:col-span-5 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-el-border/60 pb-1.5 text-[10px] text-el-fg-faint">
              <span>MANDATORY GATE INVARIANTS</span>
              <span className="text-emerald-400">AUTOMATED PASS</span>
            </div>

            <div className="space-y-1.5 pt-1">
              {currentStage.requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-el-fg-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="truncate">{req}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-el-border/40 pt-2 flex items-center justify-between text-[10px] text-el-fg-faint">
              <span>STEP {activeIndex + 1} OF {stages.length}</span>
              <button
                type="button"
                onClick={() => handleSelectStage(Math.min(activeIndex + 1, stages.length - 1))}
                disabled={activeIndex === stages.length - 1}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 disabled:opacity-30 disabled:pointer-events-none"
              >
                <span>NEXT MILESTONE</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}