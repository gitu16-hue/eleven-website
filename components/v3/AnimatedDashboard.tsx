"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  TrendingUp,
  Shield,
  Clock,
  Sparkles,
  Layers,
  BarChart3,
  GitBranch,
  ArrowUpRight,
  Sliders,
  DollarSign,
  FileCheck2,
  AlertTriangle,
  UserCheck,
  CheckCircle,
} from "lucide-react";
import { VoyageStepper, VoyageStage, DEFAULT_STAGES } from "./VoyageStepper";

type DashboardView = "overview" | "pipeline" | "detail";

interface DealEntity {
  id: string;
  name: string;
  industry: string;
  stageIndex: number;
  indicatedValue: string;
  slaTime: string;
  riskScore: number;
  sparklineData: number[];
}

const SAMPLE_DEALS: DealEntity[] = [
  {
    id: "DEAL-01",
    name: "Apollo Aerospace Holdings",
    industry: "Orbital Launch & Aviation",
    stageIndex: 2,
    indicatedValue: "$2.4M",
    slaTime: "2h 15m",
    riskScore: 94,
    sparklineData: [40, 55, 48, 62, 75, 88, 94],
  },
  {
    id: "DEAL-02",
    name: "Helios Deep Marine Robotics",
    industry: "Subsea Autonomous Survey",
    stageIndex: 3,
    indicatedValue: "$4.8M",
    slaTime: "45m",
    riskScore: 89,
    sparklineData: [50, 45, 60, 58, 70, 82, 89],
  },
  {
    id: "DEAL-03",
    name: "Vanguard Micro-Foundry",
    industry: "Semiconductor Cleanroom",
    stageIndex: 1,
    indicatedValue: "$8.2M",
    slaTime: "1h 05m",
    riskScore: 92,
    sparklineData: [60, 65, 70, 72, 80, 88, 92],
  },
  {
    id: "DEAL-04",
    name: "Orion Quantum Compute Corp",
    industry: "Cryogenic Systems",
    stageIndex: 4,
    indicatedValue: "$12.5M",
    slaTime: "Complete",
    riskScore: 98,
    sparklineData: [70, 75, 82, 85, 90, 95, 98],
  },
];

export function AnimatedDashboard() {
  const [activeView, setActiveView] = useState<DashboardView>("detail");
  const [selectedDeal, setSelectedDeal] = useState<DealEntity>(SAMPLE_DEALS[0]);
  const [activeStageIdx, setActiveStageIdx] = useState<number>(selectedDeal.stageIndex);

  // Sync selected deal changes
  const handleSelectDeal = (deal: DealEntity) => {
    setSelectedDeal(deal);
    setActiveStageIdx(deal.stageIndex);
    setActiveView("detail");
  };

  // -------------------------------------------------------------
  // Live Parameter Calculator State & GSAP Smooth Number Tweening
  // -------------------------------------------------------------
  const [limitMillions, setLimitMillions] = useState<number>(5); // $5M limit
  const [deductibleThousands, setDeductibleThousands] = useState<number>(50); // $50k deductible
  const [riskMultiplier, setRiskMultiplier] = useState<number>(1.0); // 1.0x

  const displayedPremiumRef = useRef<{ value: number }>({ value: 42500 });
  const [animatedPremium, setAnimatedPremium] = useState<number>(42500);

  // Calculate target indicated premium
  const targetPremium = Math.round(
    (limitMillions * 9200 - deductibleThousands * 45) * riskMultiplier
  );

  useEffect(() => {
    // GSAP tween for fluid number rolling on range slider drag
    const tween = gsap.to(displayedPremiumRef.current, {
      value: targetPremium,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => {
        setAnimatedPremium(Math.round(displayedPremiumRef.current.value));
      },
    });

    return () => {
      tween.kill();
    };
  }, [targetPremium]);

  return (
    <div className="relative w-full overflow-hidden rounded-sm border border-el-border bg-[#030508] font-sans shadow-2xl">
      {/* ------------------------------------------------------------- */}
      {/* 1. Ambient Aurora / Wave Header Backdrop                     */}
      {/* ------------------------------------------------------------- */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[380px] w-full max-w-[1200px] overflow-hidden opacity-75">
        <motion.div
          animate={{
            scale: [1, 1.15, 0.95, 1],
            x: ["-5%", "5%", "-3%", "-5%"],
            y: ["0%", "8%", "-4%", "0%"],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-full w-full rounded-full blur-[60px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(20, 184, 166, 0.28) 0%, rgba(13, 59, 56, 0.45) 35%, rgba(0, 240, 255, 0.15) 60%, transparent 80%)",
          }}
        />
      </div>

      {/* Top Header & View Switcher Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-el-border/80 bg-el-bg-raised/80 px-6 py-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SOVEREIGN VOYAGE DASHBOARD // ACTUARIAL ORCHESTRATION</span>
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-el-fg">
            Underwriting &amp; Capital Allocation Engine
          </h2>
        </div>

        {/* 4. Choreographed View Switcher Tabs */}
        <div className="flex items-center rounded-xs border border-el-border bg-[#020408] p-1 font-mono text-xs overflow-x-auto max-w-full no-scrollbar">
          {[
            { id: "overview", label: "[A] Overview & Spline", shortLabel: "[A] Overview", icon: BarChart3 },
            { id: "pipeline", label: "[B] Pipeline Matrix", shortLabel: "[B] Pipeline", icon: Layers },
            { id: "detail", label: "[C] Voyage Stepper", shortLabel: "[C] Stepper", icon: GitBranch },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveView(tab.id as DashboardView)}
                className={`relative flex items-center shrink-0 gap-1.5 sm:gap-2 rounded-xs px-2.5 sm:px-3.5 py-1.5 font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-el-fg-muted hover:text-el-fg hover:bg-el-bg-raised/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* View Content Canvas */}
      <div className="relative z-10 p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {/* ========================================================= */}
          {/* VIEW A: OVERVIEW & ANIMATED SPLINE AREA CHART            */}
          {/* ========================================================= */}
          {activeView === "overview" && (
            <motion.div
              key="view-overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Top 4 KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "PORTFOLIO BOUND VALUE",
                    val: "$48.6M",
                    sub: "+24.8% vs last cycle",
                    icon: DollarSign,
                    color: "text-emerald-400",
                    badge: "HIGH VELOCITY",
                  },
                  {
                    label: "AVG ROUTE LATENCY",
                    val: "3.4 hrs",
                    sub: "-42% time reduction",
                    icon: Clock,
                    color: "text-cyan-400",
                    badge: "SUB-SLA",
                  },
                  {
                    label: "INVARIANT AUDIT PASS",
                    val: "100.0%",
                    sub: "Zero policy breaches",
                    icon: Shield,
                    color: "text-emerald-400",
                    badge: "FAIL-CLOSED",
                  },
                  {
                    label: "COMBINED LOSS RATIO",
                    val: "38.2%",
                    sub: "Benchmark target < 55%",
                    icon: TrendingUp,
                    color: "text-purple-400",
                    badge: "OPTIMAL",
                  },
                ].map((kpi, i) => {
                  const Icon = kpi.icon;
                  return (
                    <div
                      key={i}
                      className="relative overflow-hidden rounded-xs border border-el-border bg-el-bg-raised/40 p-4 transition-all hover:border-emerald-500/40"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] text-el-fg-faint">
                        <span>{kpi.label}</span>
                        <span className="rounded-xs border border-el-border px-1.5 py-0.2">
                          {kpi.badge}
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className={`font-mono text-2xl font-bold tracking-tight ${kpi.color}`}>
                          {kpi.val}
                        </span>
                        <Icon className="h-5 w-5 text-el-fg-faint opacity-50" />
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-el-fg-muted">{kpi.sub}</p>
                      <div className="pointer-events-none absolute top-1 right-1 font-mono text-[9px] text-el-border">
                        ⌜ ⌟
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Animated Spline Area Chart Component */}
              <div className="rounded-xs border border-el-border bg-[#020408] p-6 shadow-el-md">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-el-border/60 pb-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-emerald-400">
                      ACTUARIAL SIMULATION // CUBIC-BEZIER SPLINE
                    </span>
                    <h3 className="text-base font-bold text-el-fg">
                      Monthly Risk-Adjusted Capital Velocity
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="rounded-xs border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-400 font-semibold">
                      CURRENT GROWTH: +122%
                    </span>
                    <span className="text-el-fg-faint text-[11px]">
                      (ESTIMATED VS STATIC QUOTE)
                    </span>
                  </div>
                </div>

                {/* Spline Area Chart Canvas */}
                <SplineAreaChart />
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* VIEW B: MULTI-LANE PIPELINE GRID                          */}
          {/* ========================================================= */}
          {activeView === "pipeline" && (
            <motion.div
              key="view-pipeline"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase text-emerald-400">
                    STAGE LANES // PARALLEL SUBMISSION TRACKER
                  </span>
                  <h3 className="text-lg font-bold text-el-fg">
                    Active Capital Commitments by Milestone
                  </h3>
                </div>
                <span className="font-mono text-xs text-el-fg-faint">
                  SELECT ANY DEAL TO LAUNCH VOYAGE STEPPER
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {SAMPLE_DEALS.map((deal) => {
                  const stage = DEFAULT_STAGES[deal.stageIndex];
                  return (
                    <div
                      key={deal.id}
                      onClick={() => handleSelectDeal(deal)}
                      className="group cursor-pointer rounded-xs border border-el-border bg-el-bg-raised/40 p-4 transition-all hover:border-emerald-400/60 hover:bg-el-bg-raised hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-el-cyan font-semibold">{deal.id}</span>
                        <span className="rounded-xs border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                          {stage.name}
                        </span>
                      </div>

                      <h4 className="mt-2 text-sm font-bold text-el-fg group-hover:text-emerald-300 transition-colors">
                        {deal.name}
                      </h4>
                      <p className="text-[11px] text-el-fg-faint">{deal.industry}</p>

                      {/* Mini Sparkline Curve */}
                      <div className="my-3 py-1 border-y border-el-border/40">
                        <MiniSparkline data={deal.sparklineData} />
                      </div>

                      <div className="flex items-center justify-between font-mono text-xs pt-1">
                        <div>
                          <span className="text-[10px] text-el-fg-faint block">VALUE:</span>
                          <span className="font-bold text-el-fg">{deal.indicatedValue}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-el-fg-faint block">SLA:</span>
                          <span className="text-emerald-400">{deal.slaTime}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-el-border/60 pt-2 font-mono text-[10px] text-el-fg-faint group-hover:text-emerald-400">
                        <span>INSPECT VOYAGE</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* VIEW C: ENTITY DETAIL + VOYAGE STEPPER + PARAM CALCULATOR */}
          {/* ========================================================= */}
          {activeView === "detail" && (
            <motion.div
              key="view-detail"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Selected Entity Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xs border border-el-border bg-el-bg-raised/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xs border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-el-fg">
                        {selectedDeal.name}
                      </h3>
                      <span className="rounded-xs border border-el-border bg-[#020408] px-2 py-0.5 font-mono text-[10px] text-el-cyan">
                        {selectedDeal.id}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-el-fg-muted">
                      {selectedDeal.industry} · Primary Underwriter: Sarah Chen (Senior Actuary)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-el-fg-faint">STAGE:</span>
                  <span className="rounded-xs border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-emerald-300 font-semibold">
                    {DEFAULT_STAGES[activeStageIdx].name}
                  </span>
                </div>
              </div>

              {/* 1. Curved SVG Route Stepper Component */}
              <VoyageStepper
                activeStageIndex={activeStageIdx}
                onStageChange={(idx) => setActiveStageIdx(idx)}
              />

              {/* 3. Interactive Parameter Cards & Sliders (2-Column Layout) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Summary Metadata Card (5 Cols) */}
                <div className="rounded-xs border border-el-border bg-[#020408] p-6 space-y-4 lg:col-span-5 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-el-border/80 pb-3">
                    <span className="font-semibold text-el-fg uppercase">
                      UNDERWRITING INVARIANTS
                    </span>
                    <span className="text-emerald-400 text-[10px]">
                      STATUS: NOMINAL
                    </span>
                  </div>

                  <div className="space-y-3 font-sans text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-el-fg-muted">Submission Channel:</span>
                      <span className="font-mono text-el-fg font-medium">Broker API (mTLS Quorum)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-el-fg-muted">Actuarial Loss Composite:</span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        {selectedDeal.riskScore} / 100 (Class A+)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-el-fg-muted">Sovereign Data Storage:</span>
                      <span className="font-mono text-el-fg">Local AES-256-GCM Vault</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-el-fg-muted">Regulatory Invariants:</span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        INV-01 to INV-15 Verified
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-el-fg-muted">Merkle Root Hash:</span>
                      <span className="font-mono text-purple-400 text-[11px]">
                        0x4a91...c123 (WORM Archive)
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xs border border-emerald-500/30 bg-emerald-500/5 p-3 text-[11px] leading-relaxed text-el-fg-muted">
                    <p className="font-semibold text-emerald-400">
                      ✓ Zero Cloud Exposure Guaranteed
                    </p>
                    <p className="mt-0.5">
                      Actuarial models execute on-premise without exposing client loss runs or balance sheets to public LLMs.
                    </p>
                  </div>
                </div>

                {/* Right Column: Live Indicated Premium Calculator (7 Cols) */}
                <div className="rounded-xs border border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-[#04060A] p-6 space-y-6 lg:col-span-7 shadow-el-sm">
                  <div className="flex items-center justify-between border-b border-el-border/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-emerald-400" />
                      <span className="font-mono text-xs font-semibold text-el-fg">
                        INDICATED PREMIUM &amp; CAPITAL CALCULATOR
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 animate-pulse">
                      LIVE TWEENING ACTIVE
                    </span>
                  </div>

                  {/* Sliders Container */}
                  <div className="space-y-5">
                    {/* Slider 1: Coverage Limit */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-el-fg-muted">1. COVERAGE LIMIT (POLICY CEILING):</span>
                        <span className="text-emerald-400 font-bold">
                          ${limitMillions}M USD
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={25}
                        step={1}
                        value={limitMillions}
                        onChange={(e) => setLimitMillions(Number(e.target.value))}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-el-border-strong accent-emerald-400"
                      />
                      <div className="flex justify-between font-mono text-[9px] text-el-fg-faint">
                        <span>$1M (Baseline)</span>
                        <span>$10M (Standard)</span>
                        <span>$25M (Excess Umbrella)</span>
                      </div>
                    </div>

                    {/* Slider 2: Deductible / Retention */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-el-fg-muted">2. SELF-INSURED RETENTION (DEDUCTIBLE):</span>
                        <span className="text-cyan-400 font-bold">
                          ${deductibleThousands}k USD
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={250}
                        step={10}
                        value={deductibleThousands}
                        onChange={(e) => setDeductibleThousands(Number(e.target.value))}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-el-border-strong accent-cyan-400"
                      />
                      <div className="flex justify-between font-mono text-[9px] text-el-fg-faint">
                        <span>$10k (Low Friction)</span>
                        <span>$100k (Mid Market)</span>
                        <span>$250k (Institutional)</span>
                      </div>
                    </div>

                    {/* Slider 3: Risk Modifier */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-el-fg-muted">3. ACTUARIAL RISK COEFFICIENT:</span>
                        <span className="text-purple-400 font-bold">
                          {riskMultiplier.toFixed(2)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.7}
                        max={1.5}
                        step={0.05}
                        value={riskMultiplier}
                        onChange={(e) => setRiskMultiplier(Number(e.target.value))}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-el-border-strong accent-purple-400"
                      />
                      <div className="flex justify-between font-mono text-[9px] text-el-fg-faint">
                        <span>0.70x (Immaculate Controls)</span>
                        <span>1.00x (Industry Par)</span>
                        <span>1.50x (Elevated Loss Surface)</span>
                      </div>
                    </div>
                  </div>

                  {/* Calculated Result Display with Smooth GSAP Number Tween */}
                  <div className="rounded-xs border border-emerald-500/40 bg-[#020408] p-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="font-mono text-[10px] text-el-fg-faint uppercase">
                        INDICATED ANNUAL SOVEREIGN PREMIUM:
                      </span>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">
                          ${animatedPremium.toLocaleString()}
                        </span>
                        <span className="font-mono text-xs text-el-fg-muted">USD / year</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveStageIdx(3)} // Jump to Offer
                      className="rounded-xs border border-emerald-400 bg-emerald-500/20 px-4 py-2 font-mono text-xs font-semibold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:bg-emerald-500/30 transition-all"
                    >
                      ADVANCE TO OFFER →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Animated Spline Area Chart Component (SVG Cubic Bezier Area)
// -------------------------------------------------------------
function SplineAreaChart() {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(4); // Default hover near peak
  const pathRef = useRef<SVGPathElement | null>(null);

  // Month data points
  const points = [
    { month: "Jan", val: 32, label: "$3.2M", growth: "+14%" },
    { month: "Feb", val: 45, label: "$4.5M", growth: "+28%" },
    { month: "Mar", val: 40, label: "$4.0M", growth: "+25%" },
    { month: "Apr", val: 68, label: "$6.8M", growth: "+62%" },
    { month: "May", val: 85, label: "$8.5M", growth: "+98%" },
    { month: "Jun", val: 122, label: "$12.2M", growth: "+122%" },
  ];

  // SVG dimensions: 800 x 240
  // Map points to SVG coordinates
  const coords = [
    { x: 50, y: 190 },
    { x: 200, y: 160 },
    { x: 350, y: 170 },
    { x: 500, y: 110 },
    { x: 650, y: 80 },
    { x: 750, y: 35 },
  ];

  // Smooth cubic-bezier spline curve passing through all points
  const splineD =
    "M 50 190 C 130 180, 160 165, 200 160 C 260 155, 300 175, 350 170 C 410 165, 450 120, 500 110 C 560 100, 600 85, 650 80 C 690 75, 710 45, 750 35";

  // Closed area path for linear gradient fill
  const areaD = `${splineD} L 750 220 L 50 220 Z`;

  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = `${len}`;
    pathRef.current.style.strokeDashoffset = `${len}`;

    const tween = gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 1.4,
      ease: "power2.out",
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div className="relative mt-4 w-full">
      <svg
        viewBox="0 -20 800 270"
        className="w-full h-auto overflow-hidden select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Vertical teal to transparent linear gradient for area fill */}
          <linearGradient id="spline-fill-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.38" />
            <stop offset="60%" stopColor="#0d3b38" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#030508" stopOpacity="0" />
          </linearGradient>

          {/* Line stroke gradient */}
          <linearGradient id="spline-stroke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="60%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#00FF9D" />
          </linearGradient>
        </defs>

        {/* Horizontal Guide Lines */}
        {[50, 100, 150, 200].map((y) => (
          <line
            key={y}
            x1="40"
            y1={y}
            x2="760"
            y2={y}
            stroke="#162033"
            strokeDasharray="4 6"
            strokeWidth="1"
          />
        ))}

        {/* 1. Filled Area */}
        <path d={areaD} fill="url(#spline-fill-grad)" />

        {/* 2. Animated Stroke Draw-in Path */}
        <path
          ref={pathRef}
          d={splineD}
          fill="none"
          stroke="url(#spline-stroke-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* 3. Interactive Data Points & Hover Targets */}
        {coords.map((pt, i) => {
          const isHovered = hoveredPoint === i;
          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint(i)}
            >
              <circle r="18" cx={pt.x} cy={pt.y} fill="transparent" />

              {/* Pulsing Outer Halo on Active */}
              {isHovered && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="12"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  className="animate-ping"
                  opacity="0.5"
                />
              )}

              {/* Data Point Node Circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? "6" : "4.5"}
                fill="#030508"
                stroke={isHovered ? "#00FF9D" : "#10b981"}
                strokeWidth={isHovered ? "2.5" : "2"}
                className="transition-all duration-200"
              />

              {/* Month label on bottom */}
              <text
                x={pt.x}
                y="235"
                textAnchor="middle"
                className="font-mono text-[10px] select-none"
                fill={isHovered ? "#00F0FF" : "#64748b"}
              >
                {points[i].month}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Badge on Active Data Point */}
      {hoveredPoint !== null && (
        <div
          className="pointer-events-none absolute z-20 flex flex-col items-center transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${(coords[hoveredPoint].x / 800) * 100}%`,
            top: `${(coords[hoveredPoint].y / 240) * 100 - 4}%`,
          }}
        >
          <div className="rounded-xs border border-emerald-400 bg-[#060a0f]/95 px-2.5 py-1 font-mono text-[11px] shadow-[0_0_12px_rgba(16,185,129,0.3)] backdrop-blur-md">
            <span className="font-bold text-emerald-400">
              {points[hoveredPoint].growth}
            </span>
            <span className="text-el-fg-faint ml-1.5">
              ({points[hoveredPoint].label})
            </span>
          </div>
          <div className="h-1.5 w-1.5 rotate-45 border-r border-b border-emerald-400 bg-[#060a0f] -mt-1" />
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Mini Sparkline SVG Curve Component
// -------------------------------------------------------------
function MiniSparkline({ data }: { data: number[] }) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const width = 140;
  const height = 28;

  // Compute normalized coordinates
  const pts = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return { x, y };
  });

  // Construct SVG cubic-bezier path
  let path = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const midX = (p0.x + p1.x) / 2;
    path += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-7 overflow-visible select-none"
    >
      <defs>
        <linearGradient id="spark-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      <path
        d={path}
        fill="none"
        stroke="url(#spark-grad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx={pts[pts.length - 1].x}
        cy={pts[pts.length - 1].y}
        r="3"
        fill="#10b981"
      />
    </svg>
  );
}