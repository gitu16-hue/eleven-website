"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMountedReducedMotion } from "@/components/motion/PremiumMotion";

interface PromptPreset {
  id: string;
  label: string;
  prompt: string;
  intent: string;
  response: string;
  badge: string;
}

const PRESETS: PromptPreset[] = [
  {
    id: "plan",
    label: "Plan a task",
    prompt: "Scan my research directory, compile literature notes, and generate an executive summary in quarantine.",
    intent: "INTENT: GOVERNED_TASK_DAG",
    response: "Task parsed. Spawning 3 DAG nodes inside Quarantine Sanctum. Network egress blocked by Ring 1 Firewall.",
    badge: "DAG REASONING",
  },
  {
    id: "voice",
    label: "Voice barge-in",
    prompt: "Talk with me about quantum computing while keeping our conversation under 50ms latency.",
    intent: "INTENT: SPEECH_STREAM_16KHZ",
    response: "Voice channel active. 16kHz PCM ring buffer ready. Interrupt anytime—speech flushes in <0.05s.",
    badge: "SUB-50MS HALT",
  },
  {
    id: "safety",
    label: "Policy guard",
    prompt: "Simulate a model attempting an unauthorized file overwrite on host configuration.",
    intent: "INTENT: POLICY_INVARIANT_TEST",
    response: "Candidate ActionProposal rejected by Ring 2 Semantic Validator. Invariant INV-01: PATH_CONFINED triggered.",
    badge: "FAIL-CLOSED",
  },
  {
    id: "memory",
    label: "Private memory",
    prompt: "Search my encrypted local episodic drawer for notes from last Tuesday's team standup.",
    intent: "INTENT: AES_256_VAULT_QUERY",
    response: "Decrypted local SQLite database via host key. Found 4 standup action items. Zero cloud transmission.",
    badge: "LOCAL SOVEREIGNTY",
  },
];

export function HeroAiPromptBox() {
  const [activePreset, setActivePreset] = useState<PromptPreset>(PRESETS[0]);
  const [inputValue, setInputValue] = useState(PRESETS[0].prompt);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [streamSeq, setStreamSeq] = useState(0);
  const timerRef = useRef<number | null>(null);
  const reduced = useMountedReducedMotion();

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleSelectPreset = (p: PromptPreset) => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    setActivePreset(p);
    setInputValue(p.prompt);
    setIsProcessing(true);
    setFeedback(null);

    timerRef.current = window.setTimeout(() => {
      setIsProcessing(false);
      setStreamSeq((s) => s + 1);
      setFeedback(p.response);
    }, 420);
  };

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    setIsProcessing(true);
    setFeedback(null);

    timerRef.current = window.setTimeout(() => {
      setIsProcessing(false);
      setStreamSeq((s) => s + 1);
      setFeedback(
        `Simulated: ELEVEN would turn this into a candidate ActionProposal, check it against policy, and ask for your approval before acting.`
      );
    }, 560);
  };

  const feedbackWords = feedback ? feedback.trim().split(/\s+/) : [];

  return (
    <div className="w-full max-w-[520px]">
      {/* Outer Tactical HUD & Spatial Glass Enclosure */}
      <div className="el-orbit-border ai-native-prompt-container rounded-md p-3.5 sm:p-4 font-mono">
        {/* Top Header Tag */}
        <div className="flex items-center justify-between text-[9.5px] text-el-fg-faint uppercase tracking-wider border-b border-el-border/60 pb-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-el-accent animate-pulse" />
            <span className="text-el-accent font-semibold">
              INTERACTIVE PREVIEW · SIMULATED RESPONSES
            </span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={activePreset.badge}
              initial={{ opacity: 0, y: -4, filter: "blur(3px)" }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transitionEnd: { filter: "none" },
              }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: reduced ? 0 : 0.22 }}
              className="text-el-fg-muted"
            >
              {activePreset.badge}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Input Form */}
        <form onSubmit={handleExecute} className="mt-2.5 flex items-center gap-2">
          <span className="text-el-accent text-sm font-semibold select-none">❯</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setFeedback(null);
            }}
            placeholder="Give an instruction to your personal AI OS..."
            className="w-full bg-transparent font-sans text-base sm:text-el-sm text-el-fg placeholder:text-el-fg-faint focus:outline-none"
          />
          <button
            type="submit"
            className="cursor-pointer shrink-0 rounded-xs bg-el-accent px-3 py-1.5 sm:px-2.5 sm:py-1 font-mono text-[11px] sm:text-[10px] font-semibold text-[#04060A] hover:bg-el-signal-lime transition-colors active:scale-95 shadow-xs"
          >
            {isProcessing ? "Simulating…" : "Simulate"}
          </button>
        </form>

        {/* Preset Action Chips with Spring-Gliding Pill */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[9px] uppercase tracking-wider text-el-fg-faint mr-1">
            Presets:
          </span>
          {PRESETS.map((p) => {
            const isSelected = p.id === activePreset.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`relative cursor-pointer rounded-xs px-2 py-0.5 text-[9.5px] transition-colors ${
                  isSelected
                    ? "text-el-accent font-medium"
                    : "border border-el-border/80 bg-el-bg/50 text-el-fg-muted hover:border-el-border-strong hover:text-el-fg"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="heroPromptPresetActive"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="pointer-events-none absolute inset-0 rounded-xs border border-el-accent/55 bg-el-accent/20 shadow-xs"
                  />
                )}
                <span className="relative z-10">{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Generative Feedback Stream */}
        <AnimatePresence mode="wait">
          {(isProcessing || feedback) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduced ? 0 : 0.22 }}
              className="relative mt-3 overflow-hidden border-t border-el-border/50 pt-2.5"
            >
              {/* Scanning Laser Hairline during processing */}
              {isProcessing && !reduced && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-0 h-[1.5px] w-28 bg-gradient-to-r from-transparent via-el-accent to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "520px" }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}

              <div className="flex items-center gap-2 text-[9.5px]">
                <span className="text-el-fg-faint">{activePreset.intent}</span>
                <span className="text-el-border-strong">|</span>
                <span className="text-el-signal-lime">SIMULATION</span>
              </div>

              {isProcessing ? (
                <p className="mt-1 ai-shimmer-text text-[11px] font-mono">
                  Synthesizing candidate ActionProposal & evaluating safety invariants…
                </p>
              ) : (
                <p
                  key={streamSeq}
                  className="mt-1 text-[11px] font-mono text-el-fg-muted leading-relaxed"
                >
                  {feedbackWords.map((word, idx) => (
                    <React.Fragment key={`${streamSeq}-${idx}-${word}`}>
                      <motion.span
                        className="inline-block"
                        initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                          transitionEnd: { filter: "none" },
                        }}
                        transition={{
                          duration: reduced ? 0 : 0.34,
                          delay: reduced ? 0 : idx * 0.022,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        {word}
                      </motion.span>
                      {idx < feedbackWords.length - 1 ? " " : ""}
                    </React.Fragment>
                  ))}
                  <span
                    aria-hidden="true"
                    className="ml-1 inline-block text-el-accent animate-pulse"
                  >
                    ▍
                  </span>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
