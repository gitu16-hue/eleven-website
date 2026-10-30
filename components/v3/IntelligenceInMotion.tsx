"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { DualCopy } from "@/components/motion/PremiumMotion";

interface StepSpec {
  id: string;
  number: string;
  badge: string;
  name: string;
  plainTitle: string;
  techTitle: string;
  plainDesc: string;
  techDesc: string;
  metricLabel: string;
  metricValue: string;
  tag: string;
}

const STEPS: StepSpec[] = [
  {
    id: "understand",
    number: "01",
    badge: "PERCEPTION // AUDIO & CONTEXT",
    name: "Understand",
    plainTitle: "Listens Naturally, Never Stutters",
    techTitle: "16kHz PCM VAD & Speculative Audio Bridge",
    plainDesc:
      "ELEVEN hears your voice naturally in real time. If you interrupt mid-sentence, it stops speaking in under 0.05 seconds (<50ms) and starts listening immediately without awkward delays.",
    techDesc:
      "Decoupled System-1 audio capture with 16kHz ring buffers, Silero adaptive VAD, and non-blocking candidate ASR snapshots streaming to the host control plane.",
    metricLabel: "Response Target",
    metricValue: "< 0.5 s",
    tag: "VOICE INTERACTION",
  },
  {
    id: "plan",
    number: "02",
    badge: "REASONING // TASK DECOMPOSITION",
    name: "Plan",
    plainTitle: "Breaks Hard Jobs into Safe Steps",
    techTitle: "GovernedTaskEngine & TaskCompiler DAG",
    plainDesc:
      "When you assign a complex goal—like researching 20 papers or refactoring a project—ELEVEN breaks it into small, verified steps and checks the plan before touching any file.",
    techDesc:
      "TaskCompiler transforms high-level user intents into deterministic directed acyclic graphs (DAGs), checking capability boundaries and state dependencies prior to dispatch.",
    metricLabel: "Planning Model",
    metricValue: "DAG Engine",
    tag: "DEEP PLANNER",
  },
  {
    id: "execute",
    number: "03",
    badge: "DISPATCH // ISOLATED PROCESSES",
    name: "Execute",
    plainTitle: "Works Inside a Locked Room on Your PC",
    techTitle: "Four Independent OS Process Domains",
    plainDesc:
      "Heavy work runs in a separate room on your machine. If a script crashes or an internet connection drops, your computer stays completely safe and your voice conversation never freezes.",
    techDesc:
      "Fail-closed isolation separates eleven_supervisor, eleven_voice, eleven_deep, and eleven_ui across local loopback domain sockets with ephemeral execution tokens.",
    metricLabel: "Process Domains",
    metricValue: "4 Rooms",
    tag: "HOST CONTAINMENT",
  },
  {
    id: "verify",
    number: "04",
    badge: "GOVERNANCE // DETERMINISTIC GATE",
    name: "Verify",
    plainTitle: "Five Guards Before Touching Files",
    techTitle: "DEC-008 Cryptographic Nonce & PolicyGate",
    plainDesc:
      "No AI proposal touches your files, sends emails, or changes system settings without passing 5 automatic security guards and showing you an honest 30-second approval card.",
    techDesc:
      "PolicyGate evaluates ActionProposals against 15 strict safety invariants, requiring explicit user nonces and signed Ed25519 tamper-evident receipts for state changes.",
    metricLabel: "Emergency Stop",
    metricValue: "< 0.05 s",
    tag: "HUMAN AUTHORITY",
  },
];

export function IntelligenceInMotion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "120px" });
  const prefersReducedMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cycleNonce, setCycleNonce] = useState(0);

  const activeStep = STEPS[activeIndex];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % STEPS.length);
    setCycleNonce((n) => n + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + STEPS.length) % STEPS.length);
    setCycleNonce((n) => n + 1);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
    setCycleNonce((n) => n + 1);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mt-12 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 4-Step Navigation Tabs */}
      <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {STEPS.map((step, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                setActiveIndex(idx);
                setCycleNonce((n) => n + 1);
              }}
              className={`group relative flex flex-col items-start justify-between rounded-sm border p-4 text-left transition-all cursor-pointer ${
                isCurrent
                  ? "border-el-accent bg-el-bg-raised shadow-el-sm"
                  : "border-el-border bg-el-bg hover:border-el-border-strong hover:bg-el-bg-raised/60"
              }`}
            >
              {/* Active top indicator line */}
              {isCurrent && (
                <motion.div
                  layoutId="step-indicator"
                  className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-el-cyan via-el-violet to-el-cyan"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}

              <div className="flex w-full items-center justify-between">
                <span
                  className={`font-mono text-el-xs font-semibold ${
                    isCurrent ? "text-el-accent" : "text-el-fg-faint"
                  }`}
                >
                  {step.number}
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isCurrent ? "bg-el-accent animate-pulse" : "bg-el-border-strong"
                  }`}
                />
              </div>

              <div className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-el-fg-faint">
                  {step.tag}
                </p>
                <p
                  className={`mt-1 text-el-base font-medium tracking-tight ${
                    isCurrent ? "text-el-fg" : "text-el-fg-muted group-hover:text-el-fg"
                  }`}
                >
                  {step.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Visual Connecting Signal Rail with Compositor-Driven Fill Progress (0 JS timers) */}
      <div className="my-6 hidden sm:block relative h-[2px] w-full bg-el-border overflow-hidden">
        <div
          className="absolute top-0 bottom-0 w-1/4 transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        >
          {isPlaying && inView ? (
            <div
              key={`${activeIndex}-${cycleNonce}`}
              onAnimationEnd={handleNext}
              className="h-full w-full origin-left bg-gradient-to-r from-el-cyan to-el-violet"
              style={{
                animation: "el-progress-fill 5500ms linear forwards",
                animationPlayState: isHovered ? "paused" : "running",
                willChange: "transform",
              }}
            />
          ) : (
            <div className="h-full w-full bg-el-accent" />
          )}
        </div>
      </div>

      {/* Presentation Toolbar */}
      <div className="mt-4 mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-el-accent uppercase tracking-wider">
            {`PHASE 0${activeIndex + 1} // 04`}
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-el-fg-faint">
            {STEPS[activeIndex].name.toUpperCase()} ENGINE
          </span>
        </div>

        {/* Slide Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex min-h-[36px] items-center gap-1.5 rounded-xs border border-el-border bg-el-bg-raised px-2.5 py-1 font-mono text-[10.5px] uppercase text-el-fg-muted hover:border-el-accent hover:text-el-fg cursor-pointer transition-colors"
            title={isPlaying ? "Pause auto-sequence" : "Play auto-sequence"}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isPlaying ? "bg-el-accent animate-pulse" : "bg-el-fg-faint"
              }`}
            />
            {isPlaying ? "Pause" : "Auto Play"}
          </button>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous phase"
            className="min-h-[36px] min-w-[36px] rounded-xs border border-el-border bg-el-bg-raised px-2 py-1 font-mono text-[11px] text-el-fg-muted hover:text-el-fg hover:border-el-border-strong cursor-pointer transition-colors"
          >
            ←
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next phase"
            className="min-h-[36px] min-w-[36px] rounded-xs border border-el-border bg-el-bg-raised px-2 py-1 font-mono text-[11px] text-el-fg-muted hover:text-el-fg hover:border-el-border-strong cursor-pointer transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Active Phase Deep Dive Card */}
      <div className="mt-3 rounded-sm border border-el-border-strong bg-el-bg-raised p-6 shadow-el-md sm:p-8 lg:p-10 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeStep.id}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: 18, scale: 0.99 }
            }
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: -18, scale: 0.99 }
            }
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center"
          >
            {/* Left 8 Cols: Content & Dual Copy */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-xs border border-el-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-el-accent bg-el-bg">
                <span className="h-1.5 w-1.5 rounded-full bg-el-accent animate-pulse" />
                {activeStep.badge}
              </div>

              <DualCopy
                as="h3"
                className="mt-4 text-el-2xl font-medium tracking-[-0.02em] text-el-fg"
                plain={activeStep.plainTitle}
                technical={activeStep.techTitle}
              />

              <DualCopy
                className="mt-3.5 max-w-[640px] text-el-base leading-[1.65] text-el-fg-muted"
                plain={activeStep.plainDesc}
                technical={activeStep.techDesc}
              />

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-xs border border-el-border bg-el-bg px-2.5 py-1 font-mono text-[10.5px] text-el-fg-faint">
                  LOCAL BOUNDARY · NEVER TRANSMITTED
                </span>
                <span className="rounded-xs border border-el-border bg-el-bg px-2.5 py-1 font-mono text-[10.5px] text-el-fg-faint">
                  HUMAN VERIFIABLE
                </span>
              </div>
            </div>

            {/* Right 4 Cols: Performance & Architecture Stat Card */}
            <div className="lg:col-span-4 lg:border-l lg:border-el-border lg:pl-8">
              <div className="rounded-sm border border-el-border bg-el-bg p-5 font-mono">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-el-fg-faint">
                    {activeStep.metricLabel}
                  </p>
                  <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-el-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-el-accent animate-ping" />
                    PREVIEW
                  </span>
                </div>

                <p className="mt-2 text-el-3xl font-semibold text-el-fg tracking-tight">
                  {activeStep.metricValue}
                </p>

                {/* Next-Gen Interactive Phase Visualizers (GPU-composited scaleY) */}
                <div className="mt-4 rounded-xs border border-el-border/70 bg-el-bg-raised/60 p-3">
                  {activeStep.id === "understand" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[9px] text-el-fg-faint">
                        <span>16kHz PCM PERCEPTION</span>
                        <span className="text-el-signal-lime font-semibold">ILLUSTRATIVE</span>
                      </div>
                      <div className="flex items-end gap-1 h-5 pt-1">
                        {[0.3, 0.8, 0.5, 1.0, 0.7, 0.9, 0.4, 0.6, 0.85, 0.5].map((h, i) => (
                          <motion.span
                            key={i}
                            className="h-full w-1.5 origin-bottom rounded-xs bg-el-accent"
                            style={{ willChange: "transform" }}
                            animate={
                              inView && !prefersReducedMotion
                                ? { scaleY: [0.25, h, 0.25] }
                                : { scaleY: h * 0.65 }
                            }
                            transition={{
                              duration: 0.6 + (i % 3) * 0.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.06,
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-[9.5px] text-el-fg-faint leading-tight">
                        Zero cloud audio streaming. Instant &lt;50ms interruption flush.
                      </p>
                    </div>
                  )}

                  {activeStep.id === "plan" && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[9px] text-el-fg-faint">
                        <span>TASKCOMPILER DAG GRAPH</span>
                        <span className="text-el-violet font-semibold">COMPILED</span>
                      </div>
                      <div className="space-y-1 text-[10px]">
                        <div className="flex items-center gap-2 text-el-fg-muted">
                          <span className="text-el-accent">●</span> User Intent
                        </div>
                        <div className="flex items-center gap-2 pl-3 text-el-fg-muted border-l border-el-border">
                          <span className="text-el-violet">↳</span> DAG-01: Research Context
                        </div>
                        <div className="flex items-center gap-2 pl-6 text-el-fg-muted border-l border-el-border">
                          <span className="text-el-signal-lime">↳</span> DAG-02: Decompose Tasks
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep.id === "execute" && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[9px] text-el-fg-faint">
                        <span>QUARANTINE PROCESS SOCKETS</span>
                        <span className="text-el-signal-lime font-semibold">ISOLATED</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[9.5px]">
                        <div className="rounded-xs border border-el-border bg-el-bg p-1.5 text-center">
                          <p className="text-el-fg-faint">VOICE</p>
                          <p className="text-el-accent font-semibold">eleven_voice</p>
                        </div>
                        <div className="rounded-xs border border-el-border bg-el-bg p-1.5 text-center">
                          <p className="text-el-fg-faint">DEEP</p>
                          <p className="text-el-violet font-semibold">eleven_deep</p>
                        </div>
                      </div>
                      <p className="text-[9px] text-el-fg-faint text-center">
                        Loopback IPC · Memory Sandboxed
                      </p>
                    </div>
                  )}

                  {activeStep.id === "verify" && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[9px] text-el-fg-faint">
                        <span>POLICYGATE CHECKPOINT</span>
                        <span className="text-el-signal-lime font-semibold">15 INVARIANTS</span>
                      </div>
                      <div className="rounded-xs bg-el-bg p-1.5 text-[9.5px] border border-el-border text-el-fg-muted">
                        <span className="text-el-accent">Ed25519:</span> 0x9f2a...81c4
                      </div>
                      <p className="text-[9px] text-el-signal-lime">
                        ✓ Tamper-evident receipt sealed before write
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 border-t border-el-border pt-3 text-[10.5px] leading-[1.5] text-el-fg-muted">
                  Phase {activeStep.number} of 04 execution pipeline.
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
