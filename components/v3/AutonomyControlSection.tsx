"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { DualCopy, Tilt3DCard } from "@/components/motion/PremiumMotion";

const TIERS = [
  {
    tier: "TIER 0 · ADVISORY",
    label: "Advice Only",
    badge: "ZERO PRIVILEGE",
    plain: "ELEVEN analyzes documents and gives advice, but cannot click buttons, modify files, or run scripts.",
    tech: "Read-only mode. PolicyGate enforces total network and filesystem write bans on all dispatched sub-tasks.",
  },
  {
    tier: "TIER 1 · SUPERVISED",
    label: "Always Asks First",
    badge: "RECOMMENDED DEFAULT",
    plain: "Drafts code, organizes notes, and tests ideas, but always asks your permission with an honest receipt before changing anything.",
    tech: "Interactive Cold-Room approval required for all state-changing operations. 30.0s cryptographic nonce token.",
  },
  {
    tier: "TIER 2 · CO-PILOT",
    label: "Bounded Working Folder",
    badge: "SCOPED DELEGATION",
    plain: "Executes routine workflows inside a specific folder you assign. If a task touches anything outside, it immediately stops and asks you.",
    tech: "Capability tokens bounded to an explicit filesystem chroot path. Any permission escalation trips an immediate supervisor halt.",
  },
  {
    tier: "TIER 3 · DELEGATED",
    label: "Autonomous with Hard Guardrails",
    badge: "STRICT CONTRACT",
    plain: "Completes long-running research or automated builds overnight within strict budget and time limits. Instant Emergency Stop halts everything.",
    tech: "Pre-signed cryptographic task contracts with hard token, time, and budget ceilings. Sub-50ms hardware interrupt halt.",
  },
];

function ReceiptSimulatorCard() {
  const simRef = useRef<HTMLDivElement>(null);
  const inView = useInView(simRef, { margin: "100px" });
  const [nonceTtl, setNonceTtl] = useState(30.0);
  const [simState, setSimState] = useState<"pending" | "approved" | "rejected">("pending");

  // Isolated 30s countdown simulation — only ticks when visible on screen
  useEffect(() => {
    if (simState !== "pending" || !inView) return;

    const interval = setInterval(() => {
      if (document.visibilityState === "hidden") return;
      setNonceTtl((prev) => {
        if (prev <= 0.2) {
          setSimState("rejected");
          return 30.0;
        }
        return Number((prev - 0.2).toFixed(1));
      });
    }, 200);

    return () => clearInterval(interval);
  }, [simState, inView]);

  return (
    <div
      ref={simRef}
      className="hud-frame rounded-sm border border-el-border-strong bg-el-bg-raised p-6 shadow-el-md sm:p-8 lg:p-10"
    >
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center border-b border-el-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-el-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-el-accent animate-pulse" />
            LIVE SIMULATION · COLD-ROOM APPROVAL RECEIPT
          </div>
          <h3 className="mt-2 text-el-2xl font-medium tracking-tight text-el-fg">
            Try Approving an Action Proposal
          </h3>
          <p className="mt-1.5 max-w-[560px] text-el-sm text-el-fg-muted">
            Watch how ELEVEN pauses when high-impact actions are proposed. You see exactly what is about to happen, have 30 seconds to confirm, and can halt in under 0.05 seconds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-el-xs text-el-fg-faint uppercase">Status:</span>
          <span
            className={`rounded-xs px-2.5 py-1 font-mono text-el-xs font-semibold tabular-nums ${
              simState === "pending"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                : simState === "approved"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
            }`}
          >
            {simState === "pending"
              ? `AWAITING APPROVAL (${nonceTtl.toFixed(1)}s)`
              : simState === "approved"
              ? "✓ ACTION CONFIRMED"
              : "✕ HALTED SAFELY"}
          </span>
        </div>
      </div>

      {/* Receipt Box */}
      <div className="mt-6 rounded-sm border border-el-border bg-el-bg p-5 font-mono text-el-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-el-border pb-3 text-el-fg-faint">
          <span>ACTION PROPOSAL RECEIPT #8841-B</span>
          <span>TOKEN: 0x9f4a...e12d</span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <span className="text-el-fg-faint">Proposed Target:</span>
            <p className="mt-1 font-medium text-el-fg">Deploy v3.1 Specification</p>
          </div>
          <div>
            <span className="text-el-fg-faint">Affected Path:</span>
            <p className="mt-1 font-medium text-el-fg">/workspace/release-manifest</p>
          </div>
          <div>
            <span className="text-el-fg-faint">Safety Checkpoints:</span>
            <p className="mt-1 font-medium text-emerald-400">5 of 5 Verified</p>
          </div>
        </div>

        {/* Interactive Action Triggers */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-el-border pt-4">
          {simState === "pending" ? (
            <>
              <button
                type="button"
                onClick={() => setSimState("approved")}
                className="min-h-[40px] cursor-pointer rounded-sm bg-el-fg px-4 py-2 font-mono text-el-xs font-semibold uppercase text-el-bg transition-opacity hover:opacity-90"
              >
                Approve Action Receipt
              </button>
              <button
                type="button"
                onClick={() => setSimState("rejected")}
                className="min-h-[40px] cursor-pointer rounded-sm border border-rose-500/40 bg-rose-500/10 px-4 py-2 font-mono text-el-xs font-semibold uppercase text-rose-400 transition-colors hover:bg-rose-500/20"
              >
                Emergency Stop (&lt;0.05s)
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setNonceTtl(30.0);
                setSimState("pending");
              }}
              className="min-h-[40px] cursor-pointer rounded-sm border border-el-border-strong bg-el-bg-raised px-4 py-2 font-mono text-el-xs uppercase text-el-fg hover:bg-el-bg"
            >
              Reset Simulation
            </button>
          )}
          <span className="text-[11px] text-el-fg-faint">
            {simState === "pending"
              ? "Simulated 30s token expiration window."
              : simState === "approved"
              ? "One-time nonce confirmed. Action carried out."
              : "Execution cancelled instantly. Zero files altered."}
          </span>
        </div>
      </div>
    </div>
  );
}

export function AutonomyControlSection() {
  return (
    <div className="mt-12 space-y-12">
      {/* 4 Autonomy Tiers Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((t) => (
          <Tilt3DCard key={t.tier}>
            <div className="flex h-full flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-el-fg-faint">
                  <span>{t.tier}</span>
                  <span className="rounded-xs bg-el-bg px-1.5 py-0.5 text-el-accent font-semibold">
                    {t.badge}
                  </span>
                </div>
                <h4 className="mt-3.5 text-el-base font-medium text-el-fg">
                  {t.label}
                </h4>
                <DualCopy
                  className="mt-2.5 text-el-xs leading-[1.65] text-el-fg-muted"
                  plain={t.plain}
                  technical={t.tech}
                />
              </div>
              <div className="mt-6 border-t border-el-border pt-3 font-mono text-[10px] text-el-fg-faint">
                DEC-008 HUMAN CONTROL
              </div>
            </div>
          </Tilt3DCard>
        ))}
      </div>

      {/* Isolated 30-Second Receipt Simulator (zero sibling re-renders) */}
      <ReceiptSimulatorCard />

      {/* Simple Comparison Table */}
      <div className="overflow-x-auto rounded-sm border border-el-border bg-el-bg-raised shadow-el-sm">
        <table className="w-full min-w-[720px] border-collapse text-left text-el-xs">
          <thead>
            <tr className="border-b border-el-border bg-el-bg font-mono text-[11px] uppercase tracking-[0.07em] text-el-fg-faint">
              <th className="p-4">What Matters to You</th>
              <th className="p-4">Smart Speakers</th>
              <th className="p-4">Chat Websites</th>
              <th className="p-4">Reckless Auto-Agents</th>
              <th className="p-4 text-el-accent font-semibold">ELEVEN v3</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-el-border text-el-fg-muted">
            <tr className="transition-colors hover:bg-el-bg/60">
              <td className="p-4 font-medium text-el-fg">Who holds the keys?</td>
              <td className="p-4">Preset commands only</td>
              <td className="p-4">Manual copy-paste</td>
              <td className="p-4">AI gets raw access (risky!)</td>
              <td className="p-4 font-medium text-el-fg">AI suggests · Your PC guards</td>
            </tr>
            <tr className="transition-colors hover:bg-el-bg/60">
              <td className="p-4 font-medium text-el-fg">Before deleting or sending</td>
              <td className="p-4">Easy to mishear &ldquo;Yes&rdquo;</td>
              <td className="p-4">AI explains itself</td>
              <td className="p-4">Acts without asking</td>
              <td className="p-4 font-medium text-el-fg">Shows an honest 30s safety receipt</td>
            </tr>
            <tr className="transition-colors hover:bg-el-bg/60">
              <td className="p-4 font-medium text-el-fg">Talking while working</td>
              <td className="p-4">Fast, but can&apos;t do deep work</td>
              <td className="p-4">Slow typing back &amp; forth</td>
              <td className="p-4">Freezes while running tools</td>
              <td className="p-4 font-medium text-el-fg">Instant voice + background planner</td>
            </tr>
            <tr className="transition-colors hover:bg-el-bg/60">
              <td className="p-4 font-medium text-el-fg">Where memories live</td>
              <td className="p-4">Big-tech cloud servers</td>
              <td className="p-4">Locked in one vendor&apos;s app</td>
              <td className="p-4">Messy text logs</td>
              <td className="p-4 font-medium text-el-fg">Encrypted on your own computer</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
