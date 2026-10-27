"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal, RevealItem } from "@/components/ui/ScrollReveal";
import { Tilt3DCard, useClarityMode } from "@/components/motion/PremiumMotion";

function MicroVisual({ index }: { index: number }) {
  const reduced = useReducedMotion();

  // 0: Natural Duplex Voice Waveform
  if (index === 0) {
    return (
      <div className="flex h-12 items-center justify-between rounded-sm border border-el-border bg-el-bg px-3.5">
        <div className="flex items-center gap-1">
          {[0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.35].map((h, i) => (
            <motion.span
              key={i}
              className="w-1 rounded-full bg-el-accent"
              style={{ height: `${h * 22}px` }}
              animate={
                reduced
                  ? undefined
                  : {
                      scaleY: [0.45, 1, 0.35, 0.85, 0.45],
                    }
              }
              transition={{
                duration: 1.6,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <span className="font-mono text-[10px] text-el-accent">
          LIVE VOICE · &lt;0.05s YIELD
        </span>
      </div>
    );
  }

  // 1: Two Minds Working Together
  if (index === 1) {
    return (
      <div className="flex h-12 items-center justify-between rounded-sm border border-el-border bg-el-bg px-3.5">
        <div className="flex items-center gap-2">
          <motion.span
            className="h-3 w-3 rounded-full bg-el-accent"
            animate={reduced ? undefined : { scale: [1, 1.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="font-mono text-[10px] text-el-fg">Voice</span>
        </div>
        <div className="relative mx-2 h-[1px] flex-1 overflow-hidden bg-el-border-strong">
          {!reduced && (
            <motion.span
              className="absolute top-0 h-full w-8 bg-el-accent"
              animate={{ left: ["-20%", "110%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <motion.span
            className="h-3.5 w-3.5 rounded-sm border border-el-accent bg-el-accent-soft"
            animate={reduced ? undefined : { rotate: [0, 90, 180] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <span className="font-mono text-[10px] text-el-fg">Planner</span>
        </div>
      </div>
    );
  }

  // 2: AI in a Safe Quarantine Box
  if (index === 2) {
    return (
      <div className="flex h-12 items-center justify-between rounded-sm border border-el-border bg-el-bg px-3.5">
        <span className="rounded border border-dashed border-[var(--el-status-warn)] px-2 py-0.5 font-mono text-[10px] text-[var(--el-status-warn)]">
          AI BOX
        </span>
        <div className="relative mx-2 flex flex-1 items-center justify-center">
          <motion.span
            className="rounded-sm bg-el-accent-soft px-1.5 py-0.5 font-mono text-[9px] text-el-accent"
            animate={reduced ? undefined : { x: [-12, 12, -12] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            Request Slip
          </motion.span>
        </div>
        <span className="rounded bg-el-accent px-2 py-0.5 font-mono text-[10px] text-el-bg">
          GUARD
        </span>
      </div>
    );
  }

  // 3: 5 Automatic Safety Checkpoints
  if (index === 3) {
    return (
      <div className="flex h-12 items-center justify-between rounded-sm border border-el-border bg-el-bg px-3.5">
        {[1, 2, 3, 4, 5].map((step) => (
          <React.Fragment key={step}>
            <motion.span
              className="flex h-5 w-5 items-center justify-center rounded-full border border-el-accent/40 font-mono text-[10px] text-el-accent"
              animate={
                reduced
                  ? undefined
                  : {
                      backgroundColor: [
                        "rgba(43,77,71,0.06)",
                        "rgba(43,77,71,0.24)",
                        "rgba(43,77,71,0.06)",
                      ],
                    }
              }
              transition={{
                duration: 2.5,
                delay: step * 0.35,
                repeat: Infinity,
              }}
            >
              {step}
            </motion.span>
            {step < 5 && <span className="h-[1px] flex-1 bg-el-border-strong" />}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // 4: Honest Approval Receipt
  if (index === 4) {
    return (
      <div className="flex h-12 items-center justify-between rounded-sm border border-el-border bg-el-bg px-3.5">
        <span className="font-mono text-[10px] text-el-fg-muted">
          EXACT RECEIPT
        </span>
        <motion.span
          className="rounded-sm border border-el-accent/40 bg-el-accent-soft px-2.5 py-0.5 font-mono text-[10px] font-medium text-el-accent"
          animate={reduced ? undefined : { scale: [1, 1.05, 1] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          ✓ 30s ONE-TIME KEY
        </motion.span>
      </div>
    );
  }

  // 5: Proof Beats Guessing (Zero Majority Vote)
  if (index === 5) {
    return (
      <div className="flex h-12 items-center justify-between rounded-sm border border-el-border bg-el-bg px-3.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-el-accent" />
          <span className="h-2.5 w-2.5 rounded-full bg-el-accent" />
          <span className="h-2.5 w-2.5 rounded-full bg-el-accent" />
          <motion.span
            className="h-2.5 w-2.5 rounded-full bg-[var(--el-status-warn)]"
            animate={reduced ? undefined : { opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          />
        </div>
        <span className="font-mono text-[10px] text-[var(--el-status-warn)]">
          CONFLICT FLAGGED
        </span>
      </div>
    );
  }

  // 6: 4-Drawer Private Local Memory
  if (index === 6) {
    return (
      <div className="flex h-12 items-center justify-between rounded-sm border border-el-border bg-el-bg px-3.5">
        <div className="flex gap-1">
          {["Now", "Past", "Facts", "Skills"].map((lbl, i) => (
            <motion.span
              key={lbl}
              className="rounded-sm border border-el-border-strong bg-el-bg-raised px-1.5 py-0.5 font-mono text-[9px] text-el-fg"
              animate={reduced ? undefined : { y: [0, -2, 0] }}
              transition={{
                duration: 2.4,
                delay: i * 0.25,
                repeat: Infinity,
              }}
            >
              {lbl}
            </motion.span>
          ))}
        </div>
        <span className="font-mono text-[10px] text-el-accent">ON YOUR PC</span>
      </div>
    );
  }

  // 7: Instant Emergency Stop
  return (
    <div className="flex h-12 items-center justify-between rounded-sm border border-el-border bg-el-bg px-3.5">
      <span className="font-mono text-[10px] text-el-fg-muted">
        HOTKEY OR VOICE
      </span>
      <motion.span
        className="rounded-sm border border-[var(--el-status-danger)]/40 bg-[var(--el-status-danger-soft)] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[var(--el-status-danger)]"
        animate={reduced ? undefined : { opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        ■ STOPS IN 0.05s
      </motion.span>
    </div>
  );
}

const CAPABILITIES = [
  {
    code: "01 · NATURAL VOICE",
    plainTitle: "Talk Naturally — Interrupt Anytime",
    techTitle: "16kHz Full-Duplex Voice & <50ms Barge-In",
    plainBody:
      "Speak to ELEVEN just like a person sitting across the desk. If you interrupt mid-sentence or change your mind, it stops talking immediately and listens—no awkward waiting.",
    techBody:
      "2.0s 16kHz PCM ring buffer with >30dB echo cancellation, non-blocking background candidate ASR, and hardware waveOutReset (<50ms) flush.",
    example: "Example: Say “Wait, check Tuesday instead” while it’s talking.",
  },
  {
    code: "02 · TWO MINDS",
    plainTitle: "Two Brains — Never Freezes",
    techTitle: "Decoupled F.R.I.D.A.Y. (S1) & J.A.R.V.I.S. (S2)",
    plainBody:
      "Normal AI assistants go silent and freeze while doing big tasks. ELEVEN has a Quick Voice mind to keep chatting with you while its Deep Thinking mind works quietly in the background.",
    techBody:
      "eleven_voice handles sub-500ms conversational turns while eleven_deep executes asynchronous GovernedTaskEngine DAGs over the Mind Event Bus.",
    example: "Example: Keep asking quick questions while it audits a 50-file folder.",
  },
  {
    code: "03 · SAFE AI BOX",
    plainTitle: "AI Suggests. Your Computer Decides.",
    techTitle: "Untrusted Model Containment Boundary",
    plainBody:
      "ELEVEN never hands your passwords, folders, or terminal directly to an AI model. The AI can only write a polite suggestion—and ELEVEN’s built-in guard checks if it’s safe.",
    techBody:
      "Frontier and local LLMs possess zero OS sockets, zero file handles, and zero direct write authority—emitting untrusted ActionProposals only.",
    example: "Example: A tricked AI cannot secretly delete or upload your files.",
  },
  {
    code: "04 · FIVE CHECKPOINTS",
    plainTitle: "Five Automatic Safety Checks",
    techTitle: "Unidirectional 5-Stage AI Control Plane",
    plainBody:
      "Every single request passes through five automatic security gates: setting limits, hiding your passwords, asking the AI, checking folder rules, and logging what happened.",
    techBody:
      "Every action traverses TaskCompiler → DataMinimizer → ModelRouter → PolicyGate → ExecutionController before host execution.",
    example: "Example: API keys & personal details are scrubbed before cloud calls.",
  },
  {
    code: "05 · HONEST RECEIPTS",
    plainTitle: "Clear Approval Cards — No Smooth-Talking",
    techTitle: "Protocol D Cold-Room DEC-008 Nonces",
    plainBody:
      "Before deleting files, pushing code, or spending money, ELEVEN pauses and shows a plain, honest receipt of what will actually happen—stripping away persuasive AI sales talk.",
    techBody:
      "Renders deterministic host blast-radius metadata and binds a single-use 128-bit CSPRNG nonce (30s TTL) to SHA-256 arguments_hash.",
    example: "Example: You approve the exact file & destination, valid for 30s only.",
  },
  {
    code: "06 · PROOF OVER VOTES",
    plainTitle: "Facts Beat Majority Guessing",
    techTitle: "SwarmTournament Gate · Zero Majority Vote",
    plainBody:
      "When multiple AI helpers check a tough problem and disagree, ELEVEN never takes a popularity vote. Even if three helpers guess 'Safe' and one spots danger, ELEVEN alerts you.",
    techBody:
      "Requires Ed25519 worker signatures, SHA-256 digests, and <=300s freshness TTL; contradictions quarantine as UNRESOLVED [DISPUTED].",
    example: "Example: Catches subtle bugs that consensus-voting agents miss.",
  },
  {
    code: "07 · PRIVATE MEMORY",
    plainTitle: "Memory Lives on Your Computer",
    techTitle: "DEC-004 4-Tier Loopback Sovereign Vault",
    plainBody:
      "Your preferences, past projects, and learned workflows are stored encrypted right on your own machine—never locked inside a cloud company’s servers.",
    techBody:
      "127.0.0.1 isolated Redis (<5ms), bi-temporal Neo4j (<25ms), Qdrant hybrid RRF k=60 (<20ms), and AES-256-GCM Sovereign Memory Vault.",
    example: "Example: Switch between Claude, GPT, or offline AI without losing memory.",
  },
  {
    code: "08 · INSTANT STOP",
    plainTitle: "One-Button Emergency Stop",
    techTitle: "Hardware-Priority Global Killswitch",
    plainBody:
      "You are always the boss. Press one keyboard shortcut or say 'Eleven, stop everything' to instantly silence audio, cancel approvals, and halt all tasks.",
    techBody:
      "Supervisor interrupt (Ctrl+Alt+Shift+K) flushes audio buffers, revokes active DEC-008 nonces, and terminates worker trees within <50ms.",
    example: "Example: Instant peace of mind whenever you want everything paused.",
  },
];

export function AnimatedCapabilityShowcase() {
  const { mode } = useClarityMode();
  const isPlain = mode === "plain";

  return (
    <ScrollReveal
      stagger={0.07}
      threshold={0.08}
      className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {CAPABILITIES.map((cap, idx) => (
        <RevealItem key={cap.code} className="h-full">
          <Tilt3DCard className="p-6">
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-el-accent">
                  {cap.code}
                </p>

                <div className="mt-3.5">
                  <MicroVisual index={idx} />
                </div>

                <h3 className="mt-4 text-el-base font-medium leading-snug tracking-[-0.015em] text-el-fg">
                  {isPlain ? cap.plainTitle : cap.techTitle}
                </h3>

                <p className="mt-2.5 text-el-xs leading-[1.65] text-el-fg-muted">
                  {isPlain ? cap.plainBody : cap.techBody}
                </p>
              </div>

              <div className="mt-4 border-t border-el-border pt-3 text-[11.5px] leading-snug text-el-fg-faint">
                {cap.example}
              </div>
            </div>
          </Tilt3DCard>
        </RevealItem>
      ))}
    </ScrollReveal>
  );
}
