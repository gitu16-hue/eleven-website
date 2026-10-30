"use client";

import React, { useState, useId } from "react";
import { motion } from "framer-motion";

type ContextTier = "standard" | "heavy" | "deep";

export function LocalVsCloudCalculator() {
  const [users, setUsers] = useState<number>(3);
  const [dailyTasks, setDailyTasks] = useState<number>(35);
  const [contextTier, setContextTier] = useState<ContextTier>("heavy");
  const [timeHorizon, setTimeHorizon] = useState<"1yr" | "3yr">("1yr");
  const usersSliderId = useId();
  const tasksSliderId = useId();

  // Multiplier for tokens per task based on tier
  const tokensPerTask = {
    standard: 8000,
    heavy: 32000,
    deep: 100000,
  }[contextTier];

  // Cloud pricing formula:
  // Base subscription: $30/user/month ($360/user/year)
  // Cloud tokens: blended $6.00 per million tokens
  const multiplierYears = timeHorizon === "1yr" ? 1 : 3;

  const totalTokensPerDay = users * dailyTasks * tokensPerTask;
  const annualTokenCost = (totalTokensPerDay / 1_000_000) * 6.0 * 365;
  const annualSeatCost = users * 360;
  const totalCloudCost = Math.round((annualSeatCost + annualTokenCost) * multiplierYears);

  // ELEVEN local execution cost (amortized hardware electricity + local model inference)
  // Local model token cost is $0. Amortized electricity / edge routing ~$80/seat/year
  const totalElevenCost = Math.round(users * 80 * multiplierYears);
  const totalSavings = Math.max(0, totalCloudCost - totalElevenCost);

  // Data leakage metric (MB transmitted to 3rd party clouds per year)
  // ~4 bytes per token
  const annualMegabytesExposed = Math.round(
    ((totalTokensPerDay * 4) / (1024 * 1024)) * 365 * multiplierYears
  );

  return (
    <div className="w-full overflow-hidden rounded-sm border border-el-border bg-[#05080E] font-mono shadow-el-lg">
      {/* Top Cyber Console Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-el-border/80 bg-el-bg-raised/80 px-4 py-3 text-[11px]">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-el-accent animate-pulse" />
          <span className="text-el-fg font-semibold tracking-wider">
            TCO_SIMULATOR // CLOUD_VS_SOVEREIGN_LOCAL
          </span>
          <span className="hidden rounded-xs border border-el-accent/30 bg-el-accent/10 px-1.5 py-0.2 text-[9.5px] text-el-accent sm:inline">
            ZERO_TOKEN_METERING
          </span>
        </div>

        {/* Time Horizon Toggle */}
        <div className="flex items-center gap-1 rounded-xs border border-el-border bg-el-bg p-0.5">
          <button
            type="button"
            onClick={() => setTimeHorizon("1yr")}
            className={`cursor-pointer rounded-xs px-2.5 py-0.5 text-[10px] transition-all ${
              timeHorizon === "1yr"
                ? "bg-el-accent text-[#04060A] font-semibold"
                : "text-el-fg-faint hover:text-el-fg"
            }`}
          >
            1 Year TCO
          </button>
          <button
            type="button"
            onClick={() => setTimeHorizon("3yr")}
            className={`cursor-pointer rounded-xs px-2.5 py-0.5 text-[10px] transition-all ${
              timeHorizon === "3yr"
                ? "bg-el-accent text-[#04060A] font-semibold"
                : "text-el-fg-faint hover:text-el-fg"
            }`}
          >
            3 Year TCO
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-12 lg:p-8">
        {/* Left Inputs Panel */}
        <div className="space-y-6 lg:col-span-6">
          {/* Slider 1: Team Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-el-xs">
              <label htmlFor={usersSliderId} className="text-el-fg">Active Devices / Developers:</label>
              <span className="font-semibold text-el-accent">
                {users} {users === 1 ? "seat" : "seats"}
              </span>
            </div>
            <input
              id={usersSliderId}
              type="range"
              min={1}
              max={25}
              value={users}
              onChange={(e) => setUsers(Number(e.target.value))}
              aria-label="Active Devices or Developers"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-sm bg-el-border accent-el-accent"
            />
            <div className="flex justify-between text-[10px] text-el-fg-faint">
              <span>1 Solo Operator</span>
              <span>10 Engineering Squad</span>
              <span>25 Studio</span>
            </div>
          </div>

          {/* Slider 2: Daily Agent Tasks */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-el-xs">
              <label htmlFor={tasksSliderId} className="text-el-fg">Autonomous Tasks per Seat / Day:</label>
              <span className="font-semibold text-el-signal-lime">
                {dailyTasks} tasks / day
              </span>
            </div>
            <input
              id={tasksSliderId}
              type="range"
              min={5}
              max={150}
              step={5}
              value={dailyTasks}
              onChange={(e) => setDailyTasks(Number(e.target.value))}
              aria-label="Autonomous Tasks per Seat per Day"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-sm bg-el-border accent-el-signal-lime"
            />
            <div className="flex justify-between text-[10px] text-el-fg-faint">
              <span>5 Light Review</span>
              <span>50 Full Refactors</span>
              <span>150 Continuous Swarm</span>
            </div>
          </div>

          {/* Context Size Selector */}
          <div className="space-y-2">
            <label className="text-el-xs text-el-fg">Average Task Context Window:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setContextTier("standard")}
                className={`cursor-pointer rounded-xs border p-2.5 text-center text-[10.5px] transition-all ${
                  contextTier === "standard"
                    ? "border-el-accent bg-el-accent/10 text-el-accent font-semibold"
                    : "border-el-border bg-el-bg-raised/50 text-el-fg-muted hover:border-el-border-strong"
                }`}
              >
                <div className="font-semibold">Standard</div>
                <div className="text-[9.5px] opacity-75">8k Tokens</div>
              </button>
              <button
                type="button"
                onClick={() => setContextTier("heavy")}
                className={`cursor-pointer rounded-xs border p-2.5 text-center text-[10.5px] transition-all ${
                  contextTier === "heavy"
                    ? "border-el-accent bg-el-accent/10 text-el-accent font-semibold"
                    : "border-el-border bg-el-bg-raised/50 text-el-fg-muted hover:border-el-border-strong"
                }`}
              >
                <div className="font-semibold">Heavy Code</div>
                <div className="text-[9.5px] opacity-75">32k Tokens</div>
              </button>
              <button
                type="button"
                onClick={() => setContextTier("deep")}
                className={`cursor-pointer rounded-xs border p-2.5 text-center text-[10.5px] transition-all ${
                  contextTier === "deep"
                    ? "border-el-accent bg-el-accent/10 text-el-accent font-semibold"
                    : "border-el-border bg-el-bg-raised/50 text-el-fg-muted hover:border-el-border-strong"
                }`}
              >
                <div className="font-semibold">Deep Monorepo</div>
                <div className="text-[9.5px] opacity-75">100k Tokens</div>
              </button>
            </div>
          </div>

          {/* Simulation Metadata strip */}
          <div className="rounded-xs border border-el-border/60 bg-el-bg-raised/30 p-3 text-[10.5px] text-el-fg-faint leading-relaxed">
            <span className="text-el-fg font-medium">Model Assumptions:</span> Cloud calculation assumes Tier-1 frontier models with standard input/output token pricing plus enterprise SaaS seat license. ELEVEN calculates local inference on Apple Silicon / RTX hardware with zero token overage.
          </div>
        </div>

        {/* Right Output Dashboard */}
        <div className="flex flex-col justify-between rounded-sm border border-el-border bg-el-bg-raised/60 p-6 lg:col-span-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-el-border pb-3">
              <span className="text-[11px] uppercase tracking-wider text-el-fg-faint">
                {timeHorizon === "1yr" ? "1-Year Projection" : "3-Year Projection"}
              </span>
              <span className="rounded-xs border border-el-signal-lime/40 bg-el-signal-lime/10 px-2 py-0.5 text-[10px] font-semibold text-el-signal-lime">
                SOVEREIGN ADVANTAGE
              </span>
            </div>

            {/* Savings Hero Metric */}
            <div>
              <p className="text-[11px] text-el-fg-faint uppercase">Estimated Expenditure Saved</p>
              <motion.div
                key={totalSavings}
                initial={{ scale: 0.96, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-el-signal-lime tabular-nums"
              >
                ${totalSavings.toLocaleString()}
              </motion.div>
              <p className="mt-1 text-[11px] text-el-fg-muted">
                Kept in your engineering budget instead of paid to cloud API providers.
              </p>
            </div>

            {/* Comparison Cost Bars */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-el-xs">
                  <span className="text-red-400">Commercial Cloud Chat &amp; APIs:</span>
                  <span className="font-semibold text-red-400 tabular-nums">
                    ${totalCloudCost.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-xs bg-el-border">
                  <div className="h-full w-full bg-red-400/80" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-el-xs">
                  <span className="text-el-accent">ELEVEN Sovereign Local Runtime:</span>
                  <span className="font-semibold text-el-accent tabular-nums">
                    ${totalElevenCost.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-xs bg-el-border">
                  <div
                    className="h-full bg-el-accent transition-all duration-300"
                    style={{
                      width: `${Math.max(4, Math.min(100, (totalElevenCost / totalCloudCost) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Data Confinement Metric */}
            <div className="rounded-xs border border-yellow-500/30 bg-yellow-500/5 p-3.5 text-el-xs">
              <div className="flex items-center justify-between text-yellow-400 font-semibold">
                <span>DATA EXPOSURE RISK:</span>
                <span className="tabular-nums">
                  {annualMegabytesExposed > 1024
                    ? `${(annualMegabytesExposed / 1024).toFixed(1)} GB`
                    : `${annualMegabytesExposed} MB`} EXPOSED
                </span>
              </div>
              <p className="mt-1 text-[10.5px] text-el-fg-muted leading-relaxed">
                With cloud assistants, this volume of proprietary code, credentials, and context is transmitted to external data centers. With ELEVEN, <strong>0.00 KB</strong> ever leaves your PC disk.
              </p>
            </div>
          </div>

          {/* Bottom Invariant Status */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-el-border/80 pt-4 text-[10.5px] text-el-fg-faint">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-el-signal-lime" />
              <span>STORAGE: 100% LOCAL AES-256</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-el-accent" />
              <span>KILLSWITCH: &lt;0.05s RING-0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
