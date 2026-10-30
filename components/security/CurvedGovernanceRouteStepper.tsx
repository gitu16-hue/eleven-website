"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import {
  Compass,
  GitBranch,
  KeyRound,
  Cpu,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useClarityMode } from "@/components/motion/PremiumMotion";
import { usePrefersReducedMotion } from "@/components/security/useSecurityEnv";
import {
  SecurityTextReveal,
  SecurityNumberCounter,
  SecuritySparkline,
} from "./SecurityMotionPrimitives";

export type TaskTierProfileId = "tier0" | "tier1" | "tier23";

interface TaskTierProfile {
  id: TaskTierProfileId;
  badge: string;
  label: string;
  exampleTask: string;
  authorizeModeLabel: string;
  requiresHumanPrompt: boolean;
  plainFlowNote: string;
  techFlowNote: string;
}

const TASK_PROFILES: TaskTierProfile[] = [
  {
    id: "tier0",
    badge: "TIER 0",
    label: "Read-Only Local Lookup",
    exampleTask: '“Summarize my Q3 design notes in /Notes/Product”',
    authorizeModeLabel: "Auto-Cleared · 0 Prompts",
    requiresHumanPrompt: false,
    plainFlowNote:
      "Everyday questions and local searches pass straight through Authorize automatically—you are never interrupted for safe read-only work.",
    techFlowNote:
      "DEC-003 Tier 0: TaskCompiler strips mutating tool schemas up front; PolicyGate clears read-only local execution with zero prompt friction.",
  },
  {
    id: "tier1",
    badge: "TIER 1",
    label: "Reversible Workspace Draft",
    exampleTask: '“Create a draft unit test inside my sandboxed git worktree”',
    authorizeModeLabel: "Auto-Cleared + Rollback Snapshot",
    requiresHumanPrompt: false,
    plainFlowNote:
      "Reversible local drafts also run without approval popups, while saving a clean before-and-after snapshot you can undo anytime.",
    techFlowNote:
      "DEC-003 Tier 1: Scoped worktree write auto-clears PolicyGate after pre-execution snapshot registration; zero outbound network allowed.",
  },
  {
    id: "tier23",
    badge: "TIER 2 / 3",
    label: "External or Destructive Action",
    exampleTask: '“Send client invoice email or delete archived build folder”',
    authorizeModeLabel: "Cold-Room 30s Nonce Required",
    requiresHumanPrompt: true,
    plainFlowNote:
      "Actions that leave your computer or permanently delete files pause at Authorize and present a plain-fact 30-second receipt for your approval.",
    techFlowNote:
      "DEC-003 Tier 2/3 + DEC-008: PolicyGate holds execution until a single-use 128-bit human approval nonce (30s TTL) signs the SHA-256 parameter digest.",
  },
];

interface GovernanceStep {
  id: string;
  stepNum: string;
  name: "Understand" | "Plan" | "Authorize" | "Execute" | "Verify";
  subsystem: string;
  desktopStation: { x: number; y: number };
  mobileStation: { x: number; y: number };
  plainHeadline: string;
  techHeadline: string;
  plainDescription: Record<TaskTierProfileId, string>;
  techDescription: Record<TaskTierProfileId, string>;
  artifacts: Record<TaskTierProfileId, string[]>;
}

// Deterministic C1-smooth cubic-bezier paths passing strictly through all 5 station coordinates
const DESKTOP_PATH_D =
  "M 90 118 C 175 118, 210 52, 295 52 C 380 52, 415 126, 500 126 C 585 126, 620 54, 705 54 C 790 54, 825 112, 910 112";

const MOBILE_PATH_D =
  "M 28 44 C 28 88, 42 98, 42 142 C 42 186, 14 196, 14 240 C 14 284, 42 294, 42 338 C 42 382, 28 392, 28 436";

const GOVERNANCE_STEPS: GovernanceStep[] = [
  {
    id: "understand",
    stepNum: "01",
    name: "Understand",
    subsystem: "TaskCompiler · Intent & Ceiling",
    desktopStation: { x: 90, y: 118 },
    mobileStation: { x: 28, y: 44 },
    plainHeadline: "Lock in clear folder and permission boundaries first",
    techHeadline: "Compile utterance into an immutable TaskSpec ceiling",
    plainDescription: {
      tier0:
        "ELEVEN identifies a pure read-only note lookup and locks folder access to /Notes/Product with editing and internet tools turned off.",
      tier1:
        "ELEVEN scopes the request to a reversible sandboxed draft inside your project worktree and disables external network access.",
      tier23:
        "ELEVEN detects an external or destructive request and flags the task ceiling as Tier 2/3 so nothing can run before your explicit review.",
    },
    techDescription: {
      tier0:
        "TaskCompiler binds max_tier=T0 and allowed_roots=['/Notes/Product']; mutating tool descriptors are omitted from model context.",
      tier1:
        "TaskCompiler binds max_tier=T1, canonical worktree root, and 0-byte external egress quota prior to model routing.",
      tier23:
        "TaskCompiler stamps max_tier=T2/T3 with correlation_id and mandatory Cold-Room DEC-008 authorization gate flag.",
    },
    artifacts: {
      tier0: ["max_tier: T0 (Read-Only)", "write_tools: OMITTED", "origin: TRUSTED_USER"],
      tier1: ["max_tier: T1 (Reversible)", "scope: .worktrees/draft", "egress_quota: 0 B"],
      tier23: ["max_tier: T2/T3 (Gated)", "gate: REQUIRE_DEC008", "correlation_id: BOUND"],
    },
  },
  {
    id: "plan",
    stepNum: "02",
    name: "Plan",
    subsystem: "DataMinimizer → ModelRouter",
    desktopStation: { x: 295, y: 52 },
    mobileStation: { x: 42, y: 142 },
    plainHeadline: "Scrub private secrets, then generate an untrusted action slip",
    techHeadline: "Sanitize context and isolate untrusted candidate ActionProposal",
    plainDescription: {
      tier0:
        "Your local search index prepares a clean retrieval plan without exposing unrelated folders or credentials.",
      tier1:
        "Passwords or API keys in nearby config files are masked before the AI proposes a draft unit test diff.",
      tier23:
        "Private tokens are redacted first; the model emits a structured candidate ActionProposal with zero direct OS handles.",
    },
    techDescription: {
      tier0:
        "DataMinimizer enforces scoped retrieval slice; local query planner emits structured read descriptor.",
      tier1:
        "DataMinimizer scrubs high-entropy secrets (INV-04); ModelRouter outputs candidate patch diff with zero write handles.",
      tier23:
        "ModelRouter emits Untrusted<ActionProposal>; conversational rationale is quarantined away from the approval template.",
    },
    artifacts: {
      tier0: ["secrets_exposed: 0", "taint_status: CLEAN", "proposal: memory.search"],
      tier1: ["redaction: INV-04 ACTIVE", "handle_access: NONE", "proposal: worktree.write"],
      tier23: ["prose_quarantine: ACTIVE", "handle_access: NONE", "proposal: external.dispatch"],
    },
  },
  {
    id: "authorize",
    stepNum: "03",
    name: "Authorize",
    subsystem: "PolicyGate · Graduated Authority",
    desktopStation: { x: 500, y: 126 },
    mobileStation: { x: 14, y: 240 },
    plainHeadline: "Graduated check: instant pass for safe work, human receipt for big actions",
    techHeadline: "Evaluate DEC-003 tier rules, path confinement, and DEC-008 nonces",
    plainDescription: {
      tier0:
        "Auto-Cleared by Host Policy: safe read-only queries never interrupt you with confirmation dialogs.",
      tier1:
        "Auto-Cleared with Undo Snapshot: local draft writes pass automatically once a clean rollback checkpoint is stored.",
      tier23:
        "Paused at Cold-Room Receipt: ELEVEN shows only exact target parameters and waits for your one-time 30-second pass.",
    },
    techDescription: {
      tier0:
        "PolicyVerdict: ALLOW_AUTONOMOUS (Tier 0). Canonical path verified; human nonce stage bypassed by design.",
      tier1:
        "PolicyVerdict: ALLOW_WITH_SNAPSHOT (Tier 1). Pre-image hash recorded; zero manual prompt required.",
      tier23:
        "PolicyVerdict: REQUIRE_DEC008_NONCE. 128-bit single-use token (30s TTL) bound to SHA-256 arguments_hash.",
    },
    artifacts: {
      tier0: ["verdict: ALLOW_AUTONOMOUS", "user_prompts: 0", "latency_overhead: <2ms"],
      tier1: ["verdict: ALLOW_SNAPSHOT", "user_prompts: 0", "rollback_ref: READY"],
      tier23: ["verdict: HOLD_FOR_NONCE", "nonce_ttl: 30.0s", "ui_mode: COLD_ROOM_DIFF"],
    },
  },
  {
    id: "execute",
    stepNum: "04",
    name: "Execute",
    subsystem: "ExecutionController · Sandbox",
    desktopStation: { x: 705, y: 54 },
    mobileStation: { x: 42, y: 338 },
    plainHeadline: "Run inside a confined workspace with instant stop protection",
    techHeadline: "Dispatch inside jailed fault domain under supervisor watchdog",
    plainDescription: {
      tier0:
        "Reads matching notes directly from your local encrypted 127.0.0.1 vault with zero internet traffic.",
      tier1:
        "Writes the new test file inside the isolated worktree while keeping your main branch and home folders untouched.",
      tier23:
        "Consumes the single-use 30-second nonce, performs only the exact approved action, and immediately re-locks the gate.",
    },
    techDescription: {
      tier0:
        "Executes read-only loopback query against 127.0.0.1 index; outbound sockets remain closed.",
      tier1:
        "Commits draft inside confined worktree mount under supervisor watchdog supervision.",
      tier23:
        "Verifies un-expired nonce == arguments_hash, marks nonce USED, and executes scoped operation.",
    },
    artifacts: {
      tier0: ["mount: RO_SNAPSHOT", "socket: 127.0.0.1 ONLY", "watchdog: ARMED"],
      tier1: ["mount: WORKTREE_JAIL", "socket: DEFAULT_DENY", "watchdog: ARMED"],
      tier23: ["nonce_state: CONSUMED", "socket: SCOPED_SINGLE_OP", "watchdog: <50ms HALT"],
    },
  },
  {
    id: "verify",
    stepNum: "05",
    name: "Verify",
    subsystem: "Differential Auditor & Ledger",
    desktopStation: { x: 910, y: 112 },
    mobileStation: { x: 28, y: 436 },
    plainHeadline: "Confirm actual results and record a permanent local receipt",
    techHeadline: "Validate post-condition diff and append hash-chained audit entry",
    plainDescription: {
      tier0:
        "Confirms zero files were modified and logs a lightweight read entry in your private local history.",
      tier1:
        "Compares the resulting file diff against the plan and saves a one-click rollback receipt.",
      tier23:
        "Verifies exact parameter & diff integrity and seals a signed receipt into the tamper-evident audit chain.",
    },
    techDescription: {
      tier0:
        "Verifies post-state immutability and appends SHA-256 chained read receipt.",
      tier1:
        "Protocol B differential check validates AST/file delta and records reversible snapshot hash.",
      tier23:
        "Appends canonical execution receipt (prev_hash -> entry_hash) with Ed25519 signature metadata.",
    },
    artifacts: {
      tier0: ["post_diff: 0 MUTATIONS", "ledger: HASH_CHAINED", "status: VERIFIED"],
      tier1: ["post_diff: AST_VALIDATED", "ledger: SNAPSHOT_LINKED", "status: VERIFIED"],
      tier23: ["signature: ED25519_SPEC", "ledger: MERKLE_APPENDED", "status: VERIFIED"],
    },
  },
];

function findLengthAtStationX(
  pathEl: SVGPathElement,
  targetX: number,
  totalLen: number
): number {
  let lo = 0;
  let hi = totalLen;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) * 0.5;
    const pt = pathEl.getPointAtLength(mid);
    if (pt.x < targetX) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) * 0.5;
}

function findLengthAtStationY(
  pathEl: SVGPathElement,
  targetY: number,
  totalLen: number
): number {
  let lo = 0;
  let hi = totalLen;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) * 0.5;
    const pt = pathEl.getPointAtLength(mid);
    if (pt.y < targetY) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) * 0.5;
}

export function CurvedGovernanceRouteStepper() {
  const { mode } = useClarityMode();
  const isPlain = mode === "plain";
  const reducedMotion = usePrefersReducedMotion();

  const [tierProfileId, setTierProfileId] = useState<TaskTierProfileId>("tier23");
  const [activeStepIndex, setActiveStepIndex] = useState<number>(2);
  const [scrollDriven, setScrollDriven] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const desktopBasePathRef = useRef<SVGPathElement | null>(null);
  const desktopDonePathRef = useRef<SVGPathElement | null>(null);
  const desktopTravelerRef = useRef<SVGGElement | null>(null);

  const mobileBasePathRef = useRef<SVGPathElement | null>(null);
  const mobileDonePathRef = useRef<SVGPathElement | null>(null);
  const mobileTravelerRef = useRef<SVGGElement | null>(null);

  const desktopTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const mobileTabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const desktopLengthsRef = useRef<{ total: number; stops: number[] }>({
    total: 1,
    stops: [0, 0.25, 0.5, 0.75, 1],
  });
  const mobileLengthsRef = useRef<{ total: number; stops: number[] }>({
    total: 1,
    stops: [0, 0.25, 0.5, 0.75, 1],
  });

  const deskProxyRef = useRef<{ len: number }>({ len: 0 });
  const mobProxyRef = useRef<{ len: number }>({ len: 0 });
  const deskTweenRef = useRef<gsap.core.Tween | null>(null);
  const mobTweenRef = useRef<gsap.core.Tween | null>(null);

  const activeProfile =
    TASK_PROFILES.find((p) => p.id === tierProfileId) ?? TASK_PROFILES[2];
  const activeStep = GOVERNANCE_STEPS[activeStepIndex] ?? GOVERNANCE_STEPS[0];

  const applyDesktopLength = useCallback((len: number) => {
    const base = desktopBasePathRef.current;
    const done = desktopDonePathRef.current;
    const traveler = desktopTravelerRef.current;
    if (!base || !done || !traveler) return;

    const total = desktopLengthsRef.current.total || 1;
    const clamped = Math.max(0, Math.min(total, len));
    const p = base.getPointAtLength(clamped);
    const q = base.getPointAtLength(Math.min(total, clamped + 2.5));
    const angleDeg = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;

    done.setAttribute("stroke-dasharray", `${clamped} ${total}`);
    traveler.setAttribute(
      "transform",
      `translate(${p.x.toFixed(2)}, ${p.y.toFixed(2)}) rotate(${(
        angleDeg * 0.45
      ).toFixed(2)})`
    );
  }, []);

  const applyMobileLength = useCallback((len: number) => {
    const base = mobileBasePathRef.current;
    const done = mobileDonePathRef.current;
    const traveler = mobileTravelerRef.current;
    if (!base || !done || !traveler) return;

    const total = mobileLengthsRef.current.total || 1;
    const clamped = Math.max(0, Math.min(total, len));
    const p = base.getPointAtLength(clamped);

    done.setAttribute("stroke-dasharray", `${clamped} ${total}`);
    traveler.setAttribute(
      "transform",
      `translate(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`
    );
  }, []);

  // Measure exact SVG arc lengths once on mount & resize
  useEffect(() => {
    const measurePaths = () => {
      if (desktopBasePathRef.current) {
        const total = desktopBasePathRef.current.getTotalLength();
        const stops = GOVERNANCE_STEPS.map((st, idx) =>
          idx === 0
            ? 0
            : idx === GOVERNANCE_STEPS.length - 1
            ? total
            : findLengthAtStationX(
                desktopBasePathRef.current!,
                st.desktopStation.x,
                total
              )
        );
        desktopLengthsRef.current = { total, stops };
      }

      if (mobileBasePathRef.current) {
        const total = mobileBasePathRef.current.getTotalLength();
        const stops = GOVERNANCE_STEPS.map((st, idx) =>
          idx === 0
            ? 0
            : idx === GOVERNANCE_STEPS.length - 1
            ? total
            : findLengthAtStationY(
                mobileBasePathRef.current!,
                st.mobileStation.y,
                total
              )
        );
        mobileLengthsRef.current = { total, stops };
      }
    };

    measurePaths();
    const dTarget = desktopLengthsRef.current.stops[activeStepIndex] ?? 0;
    const mTarget = mobileLengthsRef.current.stops[activeStepIndex] ?? 0;
    deskProxyRef.current.len = dTarget;
    mobProxyRef.current.len = mTarget;
    applyDesktopLength(dTarget);
    applyMobileLength(mTarget);

    window.addEventListener("resize", measurePaths, { passive: true });
    return () => {
      window.removeEventListener("resize", measurePaths);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate or snap curved SVG route whenever activeStepIndex changes
  useEffect(() => {
    const dTarget = desktopLengthsRef.current.stops[activeStepIndex] ?? 0;
    const mTarget = mobileLengthsRef.current.stops[activeStepIndex] ?? 0;

    deskTweenRef.current?.kill();
    mobTweenRef.current?.kill();

    if (reducedMotion) {
      deskProxyRef.current.len = dTarget;
      mobProxyRef.current.len = mTarget;
      applyDesktopLength(dTarget);
      applyMobileLength(mTarget);
      return;
    }

    deskTweenRef.current = gsap.to(deskProxyRef.current, {
      len: dTarget,
      duration: 0.65,
      ease: "power3.out",
      onUpdate: () => applyDesktopLength(deskProxyRef.current.len),
    });

    mobTweenRef.current = gsap.to(mobProxyRef.current, {
      len: mTarget,
      duration: 0.65,
      ease: "power3.out",
      onUpdate: () => applyMobileLength(mobProxyRef.current.len),
    });

    return () => {
      deskTweenRef.current?.kill();
      mobTweenRef.current?.kill();
    };
  }, [activeStepIndex, reducedMotion, applyDesktopLength, applyMobileLength]);

  // Scroll-position step progression when scrollDriven is enabled (disabled under reducedMotion)
  useEffect(() => {
    if (!scrollDriven || reducedMotion) return;

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Progress from 0 when top enters 75% viewport height to 1 when top reaches 15% viewport height
      const startY = vh * 0.78;
      const endY = vh * 0.12;
      const ratio = (startY - rect.top) / Math.max(1, startY - endY);
      const clamped = Math.max(0, Math.min(1, ratio));
      const idx = Math.min(
        GOVERNANCE_STEPS.length - 1,
        Math.floor(clamped * GOVERNANCE_STEPS.length)
      );
      setActiveStepIndex((prev) => (prev === idx ? prev : idx));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDriven, reducedMotion]);

  const selectStepManually = useCallback((idx: number) => {
    setScrollDriven(false);
    setActiveStepIndex(idx);
  }, []);

  const handleStepKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLButtonElement>,
      idx: number,
      orientation: "desktop" | "mobile"
    ) => {
      let nextIdx: number | null = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextIdx = (idx + 1) % GOVERNANCE_STEPS.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        nextIdx = (idx - 1 + GOVERNANCE_STEPS.length) % GOVERNANCE_STEPS.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIdx = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIdx = GOVERNANCE_STEPS.length - 1;
      }

      if (nextIdx !== null) {
        selectStepManually(nextIdx);
        const refs =
          orientation === "desktop" ? desktopTabRefs.current : mobileTabRefs.current;
        refs[nextIdx]?.focus();
      }
    },
    [selectStepManually]
  );

  const stepIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Compass className="h-4 w-4" aria-hidden="true" />;
      case 1:
        return <GitBranch className="h-4 w-4" aria-hidden="true" />;
      case 2:
        return <KeyRound className="h-4 w-4" aria-hidden="true" />;
      case 3:
        return <Cpu className="h-4 w-4" aria-hidden="true" />;
      default:
        return <ShieldCheck className="h-4 w-4" aria-hidden="true" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-sm border border-el-sec-sage/45 bg-el-sec-graphite text-el-sec-porcelain shadow-el-lg"
      data-component="curved-governance-route-stepper"
    >
      {/* Header & Task Tier Autonomy Selector */}
      <div className="border-b border-el-sec-sage/35 bg-el-sec-graphite-deep px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-el-sec-lime">
                GRADUATED GOVERNANCE ROUTE
              </span>
              <span className="font-mono text-[10.5px] text-el-sec-sage-light">
                Understand → Plan → Authorize → Execute → Verify
              </span>
            </div>
            <p className="mt-1 text-xs text-el-sec-sage-light">
              Select a task autonomy profile below—approval behavior adapts to task risk rather than forcing identical prompts on every action.
            </p>
          </div>

          {!scrollDriven && !reducedMotion && (
            <button
              type="button"
              onClick={() => setScrollDriven(true)}
              className="inline-flex self-start items-center gap-1.5 rounded-xs border border-el-sec-lime/50 bg-el-sec-graphite-raised px-3 py-1.5 font-mono text-[11px] text-el-sec-lime transition-colors hover:bg-el-sec-lime hover:text-el-sec-graphite lg:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Resume Scroll Sync
            </button>
          )}
        </div>

        {/* Task Tier Switcher */}
        <div
          role="radiogroup"
          aria-label="Task risk and autonomy tier profile"
          className="mt-4 grid grid-cols-1 gap-2.5 md:grid-cols-3"
        >
          {TASK_PROFILES.map((profile) => {
            const selected = profile.id === tierProfileId;
            return (
              <button
                key={profile.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setTierProfileId(profile.id)}
                className={`flex flex-col justify-between rounded-xs border p-3 text-left transition-colors ${
                  selected
                    ? "border-el-sec-lime bg-el-sec-graphite-raised text-el-sec-porcelain"
                    : "border-el-sec-sage/35 bg-el-sec-graphite text-el-sec-porcelain/80 hover:border-el-sec-sage/75 hover:text-el-sec-porcelain"
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2 font-mono text-[10.5px]">
                  <span
                    className={
                      selected ? "font-bold text-el-sec-lime" : "text-el-sec-sage-light"
                    }
                  >
                    {profile.badge} · {profile.label}
                  </span>
                  <span
                    className={`rounded-xs px-1.5 py-0.5 text-[9.5px] ${
                      profile.requiresHumanPrompt
                        ? "bg-el-sec-porcelain text-el-sec-graphite font-semibold"
                        : "bg-el-sec-lime/15 text-el-sec-lime"
                    }`}
                  >
                    {profile.requiresHumanPrompt ? "Human Nonce" : "0 Prompts"}
                  </span>
                </div>
                <p className="mt-1.5 font-mono text-[11px] text-el-sec-sage-light">
                  {profile.exampleTask}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* DESKTOP HORIZONTAL CURVED SVG STEPPER (>= md) */}
      <div className="hidden px-6 pt-6 pb-4 md:block" data-layout="horizontal-curve">
        <div className="relative rounded-sm border border-el-sec-sage/30 bg-el-sec-graphite-deep px-4 pt-5 pb-4">
          {/* Journey Progress & Autonomy Risk Graph Bar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-el-sec-sage/25 pb-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-el-sec-sage-light">
                Stage 0{activeStepIndex + 1} of 05
              </span>
              <span className="font-mono text-xs font-bold text-el-sec-lime">
                <SecurityNumberCounter
                  value={Math.round(((activeStepIndex + 1) / 5) * 100)}
                  suffix="% Journey Progress"
                />
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10.5px] text-el-sec-sage-light">
                  Autonomy Risk Profile:
                </span>
                <SecuritySparkline
                  points={[8, 18, activeProfile.requiresHumanPrompt ? 85 : 12, 28, 14]}
                  width={72}
                  height={18}
                  color={activeProfile.requiresHumanPrompt ? "#F5F5F0" : "#B8F36B"}
                />
              </div>
              <span
                className={`rounded-xs px-2 py-0.5 font-mono text-[10px] font-semibold ${
                  activeProfile.requiresHumanPrompt
                    ? "bg-el-sec-porcelain text-el-sec-graphite"
                    : "bg-el-sec-lime/15 text-el-sec-lime"
                }`}
              >
                <SecurityNumberCounter
                  value={activeProfile.requiresHumanPrompt ? 1 : 0}
                  suffix={activeProfile.requiresHumanPrompt ? " Nonce Required" : " Prompts"}
                />
              </span>
            </div>
          </div>

          <svg
            viewBox="0 0 1000 175"
            className="h-auto w-full overflow-visible select-none"
            aria-hidden="true"
          >
            {/* Subtle horizontal datum reference line */}
            <line
              x1="60"
              y1="88"
              x2="940"
              y2="88"
              stroke="#647A6A"
              strokeWidth="1"
              strokeDasharray="3 6"
              opacity="0.3"
            />

            {/* Unvisited Muted Sage Base Route */}
            <path
              ref={desktopBasePathRef}
              d={DESKTOP_PATH_D}
              fill="none"
              stroke="#647A6A"
              strokeOpacity="0.5"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Visited Signal Lime Foreground Route */}
            <path
              ref={desktopDonePathRef}
              d={DESKTOP_PATH_D}
              fill="none"
              stroke="#B8F36B"
              strokeWidth="3.75"
              strokeLinecap="round"
              strokeDasharray="0 2000"
            />

            {/* Station Nodes along Curve */}
            {GOVERNANCE_STEPS.map((st, idx) => {
              const isVisited = idx <= activeStepIndex;
              const isCurrent = idx === activeStepIndex;
              const isAuthorizeHold =
                st.id === "authorize" && activeProfile.requiresHumanPrompt;

              return (
                <g
                  key={st.id}
                  transform={`translate(${st.desktopStation.x}, ${st.desktopStation.y})`}
                  onClick={() => selectStepManually(idx)}
                  className="cursor-pointer"
                >
                  {isCurrent && (
                    <circle
                      r="20"
                      fill="none"
                      stroke={isAuthorizeHold ? "#F5F5F0" : "#B8F36B"}
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      opacity="0.85"
                    />
                  )}
                  <circle
                    r={isCurrent ? 12 : 9}
                    fill={
                      isCurrent
                        ? isAuthorizeHold
                          ? "#F5F5F0"
                          : "#B8F36B"
                        : isVisited
                        ? "#1F2421"
                        : "#171A18"
                    }
                    stroke={
                      isVisited
                        ? isAuthorizeHold && isCurrent
                          ? "#F5F5F0"
                          : "#B8F36B"
                        : "#647A6A"
                    }
                    strokeWidth="2.2"
                  />
                  <text
                    y="3.5"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="700"
                    fill={
                      isCurrent ? "#171A18" : isVisited ? "#B8F36B" : "#B2C3B7"
                    }
                  >
                    {st.stepNum}
                  </text>
                </g>
              );
            })}

            {/* Tangent-Banked Geometric Route Marker */}
            <g ref={desktopTravelerRef} className="pointer-events-none">
              <polygon
                points="11,0 -7,-6.5 -3.5,0 -7,6.5"
                fill="#F5F5F0"
                stroke="#171A18"
                strokeWidth="1.4"
              />
            </g>
          </svg>

          {/* Accessible Keyboard-Navigable Step Tab Bar Aligned Under the 5 Stations */}
          <div
            role="tablist"
            aria-label="Governance route steps"
            className="mt-2 grid grid-cols-5 gap-2.5"
          >
            {GOVERNANCE_STEPS.map((st, idx) => {
              const isCurrent = idx === activeStepIndex;
              const isVisited = idx <= activeStepIndex;
              const isAuthorize = st.id === "authorize";

              return (
                <button
                  key={st.id}
                  ref={(el) => {
                    desktopTabRefs.current[idx] = el;
                  }}
                  id={`gov-route-tab-desk-${st.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isCurrent}
                  aria-controls={`gov-route-panel-${st.id}`}
                  tabIndex={isCurrent ? 0 : -1}
                  onClick={() => selectStepManually(idx)}
                  onKeyDown={(e) => handleStepKeyDown(e, idx, "desktop")}
                  className={`rounded-xs border p-2.5 text-left transition-[border-color] ${
                    isCurrent
                      ? isAuthorize && activeProfile.requiresHumanPrompt
                        ? "border-el-sec-porcelain bg-el-sec-porcelain text-el-sec-graphite"
                        : "border-el-sec-lime bg-el-sec-graphite-raised text-el-sec-porcelain"
                      : isVisited
                      ? "border-el-sec-lime/35 bg-el-sec-graphite text-el-sec-porcelain/90 hover:border-el-sec-lime/70"
                      : "border-el-sec-sage/30 bg-el-sec-graphite text-el-sec-sage-light hover:border-el-sec-sage/65 hover:text-el-sec-porcelain"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 font-mono text-[10px]">
                    <span
                      className={
                        isCurrent && isAuthorize && activeProfile.requiresHumanPrompt
                          ? "font-bold text-el-sec-graphite"
                          : isVisited
                          ? "font-semibold text-el-sec-lime"
                          : "text-el-sec-sage-light"
                      }
                    >
                      STEP {st.stepNum}
                    </span>
                    {isAuthorize && (
                      <span
                        className={`rounded-xs px-1 py-0.2 text-[9px] font-semibold ${
                          isCurrent && activeProfile.requiresHumanPrompt
                            ? "bg-el-sec-graphite text-el-sec-lime"
                            : activeProfile.requiresHumanPrompt
                            ? "bg-amber-400/15 text-amber-300"
                            : "bg-el-sec-lime/15 text-el-sec-lime"
                        }`}
                      >
                        {activeProfile.requiresHumanPrompt ? "NONCE" : "AUTO"}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-semibold tracking-tight">
                    {st.name}
                  </p>
                  <p
                    className={`mt-0.5 truncate font-mono text-[10px] ${
                      isCurrent && isAuthorize && activeProfile.requiresHumanPrompt
                        ? "text-el-sec-graphite/75"
                        : "text-el-sec-sage-light"
                    }`}
                  >
                    {st.subsystem}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE / NARROW VERTICAL CURVED S-ROUTE (< md) */}
      <div className="px-4 pt-5 pb-3 md:hidden" data-layout="vertical-curve">
        <div className="grid grid-cols-[52px_1fr] gap-2.5 rounded-sm border border-el-sec-sage/30 bg-el-sec-graphite-deep p-3">
          {/* Vertical Curved S-Wave SVG Rail */}
          <div className="relative flex justify-center">
            <svg
              viewBox="0 0 56 480"
              className="h-[460px] w-[52px] overflow-visible select-none"
              aria-hidden="true"
            >
              <path
                ref={mobileBasePathRef}
                d={MOBILE_PATH_D}
                fill="none"
                stroke="#647A6A"
                strokeOpacity="0.5"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                ref={mobileDonePathRef}
                d={MOBILE_PATH_D}
                fill="none"
                stroke="#B8F36B"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="0 1200"
              />
              {GOVERNANCE_STEPS.map((st, idx) => {
                const isVisited = idx <= activeStepIndex;
                const isCurrent = idx === activeStepIndex;
                return (
                  <g
                    key={st.id}
                    transform={`translate(${st.mobileStation.x}, ${st.mobileStation.y})`}
                  >
                    <circle
                      r={isCurrent ? 10 : 7.5}
                      fill={isCurrent ? "#B8F36B" : "#171A18"}
                      stroke={isVisited ? "#B8F36B" : "#647A6A"}
                      strokeWidth="2"
                    />
                    <text
                      y="3"
                      textAnchor="middle"
                      fontSize="8.5"
                      fontFamily="monospace"
                      fontWeight="700"
                      fill={isCurrent ? "#171A18" : "#F5F5F0"}
                    >
                      {st.stepNum}
                    </text>
                  </g>
                );
              })}
              <g ref={mobileTravelerRef} className="pointer-events-none">
                <circle r="5" fill="#F5F5F0" stroke="#171A18" strokeWidth="1.5" />
              </g>
            </svg>
          </div>

          {/* Stacked Accessible Mobile Step Buttons */}
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Governance route steps"
            className="flex h-[460px] flex-col justify-between gap-2"
          >
            {GOVERNANCE_STEPS.map((st, idx) => {
              const isCurrent = idx === activeStepIndex;
              const isAuthorize = st.id === "authorize";
              return (
                <button
                  key={st.id}
                  ref={(el) => {
                    mobileTabRefs.current[idx] = el;
                  }}
                  id={`gov-route-tab-mob-${st.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isCurrent}
                  aria-controls={`gov-route-panel-${st.id}`}
                  tabIndex={isCurrent ? 0 : -1}
                  onClick={() => selectStepManually(idx)}
                  onKeyDown={(e) => handleStepKeyDown(e, idx, "mobile")}
                  className={`flex flex-col justify-center rounded-xs border px-3 py-2 text-left transition-colors ${
                    isCurrent
                      ? isAuthorize && activeProfile.requiresHumanPrompt
                        ? "border-el-sec-porcelain bg-el-sec-porcelain text-el-sec-graphite"
                        : "border-el-sec-lime bg-el-sec-graphite-raised text-el-sec-porcelain"
                      : "border-el-sec-sage/30 bg-el-sec-graphite text-el-sec-porcelain/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">
                      {st.stepNum} · {st.name}
                    </span>
                    {isAuthorize && (
                      <span className="font-mono text-[9.5px] font-semibold uppercase">
                        {activeProfile.requiresHumanPrompt ? "30s Nonce" : "Auto-Pass"}
                      </span>
                    )}
                  </div>
                  <span
                    className={`mt-0.5 truncate font-mono text-[10px] ${
                      isCurrent && isAuthorize && activeProfile.requiresHumanPrompt
                        ? "text-el-sec-graphite/75"
                        : "text-el-sec-sage-light"
                    }`}
                  >
                    {st.subsystem}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Step Inspection Panel */}
      <div
        id={`gov-route-panel-${activeStep.id}`}
        role="tabpanel"
        aria-label={`${activeStep.name} stage details`}
        className="px-4 pt-2 pb-6 sm:px-6"
      >
        <div
          className={`rounded-sm border p-5 ${
            activeStep.id === "authorize" && activeProfile.requiresHumanPrompt
              ? "border-el-sec-porcelain bg-el-sec-porcelain text-el-sec-graphite"
              : "border-el-sec-sage/40 bg-el-sec-graphite-raised text-el-sec-porcelain"
          }`}
        >
          <div className="flex flex-col justify-between gap-3 border-b border-current/15 pb-3.5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-xs ${
                  activeStep.id === "authorize" && activeProfile.requiresHumanPrompt
                    ? "bg-el-sec-graphite text-el-sec-lime"
                    : "bg-el-sec-lime/15 text-el-sec-lime"
                }`}
              >
                {stepIcon(activeStepIndex)}
              </span>
              <div>
                <div className="font-mono text-[10.5px] uppercase tracking-wider opacity-80">
                  STAGE {activeStep.stepNum} OF 05 · {activeStep.subsystem}
                </div>
                <SecurityTextReveal
                  key={activeStep.id + "-headline"}
                  text={`${activeStep.name} — ${isPlain ? activeStep.plainHeadline : activeStep.techHeadline}`}
                  as="h3"
                  className="text-base font-semibold tracking-tight sm:text-lg"
                />
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 self-start rounded-xs px-2.5 py-1 font-mono text-[10.5px] font-semibold sm:self-auto ${
                activeStep.id === "authorize" && activeProfile.requiresHumanPrompt
                  ? "bg-el-sec-graphite text-el-sec-lime"
                  : activeProfile.requiresHumanPrompt
                  ? "border border-amber-400/45 bg-amber-400/12 text-amber-300"
                  : "border border-el-sec-lime/45 bg-el-sec-lime/12 text-el-sec-lime"
              }`}
            >
              {activeProfile.requiresHumanPrompt ? (
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {activeProfile.authorizeModeLabel}
            </span>
          </div>

          <SecurityTextReveal
            key={activeStep.id + tierProfileId + (isPlain ? "-pdesc" : "-tdesc")}
            text={
              isPlain
                ? activeStep.plainDescription[tierProfileId]
                : activeStep.techDescription[tierProfileId]
            }
            as="p"
            className="mt-3.5 text-xs leading-relaxed opacity-90 sm:text-sm"
          />

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {activeStep.artifacts[tierProfileId].map((fact) => (
              <div
                key={fact}
                className={`rounded-xs border px-3 py-2 font-mono text-[11px] ${
                  activeStep.id === "authorize" && activeProfile.requiresHumanPrompt
                    ? "border-el-sec-graphite/20 bg-el-sec-porcelain-muted text-el-sec-graphite"
                    : "border-el-sec-sage/35 bg-el-sec-graphite-deep text-el-sec-porcelain"
                }`}
              >
                {fact}
              </div>
            ))}
          </div>

          <SecurityTextReveal
            key={activeStep.id + tierProfileId + "-fn"}
            text={isPlain ? activeProfile.plainFlowNote : activeProfile.techFlowNote}
            as="p"
            className="mt-3.5 border-t border-current/15 pt-3 font-mono text-[11px] opacity-80"
          />
        </div>
      </div>
    </div>
  );
}
