"use client";

import React, { useState, useEffect, useId } from "react";
import { motion } from "framer-motion";

const INITIAL_WAVE_HEIGHTS = Array.from(
  { length: 32 },
  (_, i) => 10 + ((i * 17 + 7) % 24)
);

export function VoiceLatencyBenchmarkSimulator() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [interrupted, setInterrupted] = useState<boolean>(false);
  const [interrupting, setInterrupting] = useState<boolean>(false);
  const [cloudOverrun, setCloudOverrun] = useState<boolean>(false);
  const [cloudOverrunTimer, setCloudOverrunTimer] = useState<number>(0);
  const [networkJitter, setNetworkJitter] = useState<number>(140);
  const jitterSliderId = useId();

  // Local barge-in fixed empirical benchmark
  const localVAD = 14; // ms
  const localTransport = 0; // ms (loopback ring buffer)
  const localModelIngest = 12; // ms
  const localBufferMute = 6; // ms
  const localTotal = localVAD + localTransport + localModelIngest + localBufferMute; // 32ms

  // Cloud barge-in dynamic benchmark based on network jitter
  const cloudVAD = 160; // ms (cloud VAD endpoint)
  const cloudTransport = networkJitter * 2; // ms (round-trip WebSocket)
  const cloudModelIngest = 240; // ms (queue latency)
  const cloudBufferDrain = 180; // ms (client audio buffer playback flush)
  const cloudTotal = cloudVAD + cloudTransport + cloudModelIngest + cloudBufferDrain;

  // Audio wave heights (32 bars) — deterministic initial values for pure SSR hydration
  const [waveHeights, setWaveHeights] = useState<number[]>(INITIAL_WAVE_HEIGHTS);

  useEffect(() => {
    let animId: NodeJS.Timeout;
    if (isPlaying && !interrupted) {
      animId = setInterval(() => {
        setWaveHeights(
          Array.from({ length: 32 }, () => Math.floor(Math.random() * 32) + 6)
        );
      }, 90);
    }
    return () => clearInterval(animId);
  }, [isPlaying, interrupted]);

  // Handle Interrupt Action
  const handleInterrupt = () => {
    if (interrupted) return;
    setInterrupting(true);

    // Local halts immediately (32ms simulation)
    setTimeout(() => {
      setInterrupted(true);
      setInterrupting(false);
      setCloudOverrun(true);
      setCloudOverrunTimer(cloudTotal);
    }, localTotal);

    // Cloud overruns until cloudTotal finishes
    const startTime = Date.now();
    const interval = setInterval(() => {
      const remaining = Math.max(0, cloudTotal - (Date.now() - startTime));
      setCloudOverrunTimer(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setCloudOverrun(false);
      }
    }, 40);
  };

  const handleReset = () => {
    setInterrupted(false);
    setCloudOverrun(false);
    setIsPlaying(true);
    setCloudOverrunTimer(0);
  };

  return (
    <div className="w-full overflow-hidden rounded-sm border border-el-border bg-[#05080E] font-mono shadow-el-lg">
      {/* Top Cyber Title Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-el-border/80 bg-el-bg-raised/80 px-4 py-3 text-[11px]">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-el-signal-lime animate-pulse" />
          <span className="text-el-fg font-semibold tracking-wider">
            SPEECH_PIPELINE_BENCHMARK // BARGE_IN_COLLISION_TEST
          </span>
          <span className="hidden rounded-xs border border-el-signal-lime/40 bg-el-signal-lime/10 px-1.5 py-0.2 text-[9.5px] text-el-signal-lime sm:inline">
            16KHZ_LOCKLESS_RING
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10.5px]">
          <span className="text-el-fg-faint">HOST WASAPI:</span>
          <span className="text-el-accent font-semibold">EXCLUSIVE_MODE_0.05s</span>
        </div>
      </div>

      {/* Network Jitter Slider Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-el-border/70 bg-el-bg/40 px-6 py-3 text-el-xs">
        <div className="flex items-center gap-3">
          <label htmlFor={jitterSliderId} className="text-el-fg">Simulated Cloud Network RTT:</label>
          <span className="font-semibold text-yellow-400">
            {networkJitter * 2}ms Round-Trip
          </span>
        </div>
        <div className="flex items-center gap-3 max-w-[280px] w-full">
          <span className="text-[10px] text-el-fg-faint">Fast (80ms)</span>
          <input
            id={jitterSliderId}
            type="range"
            min={40}
            max={250}
            step={10}
            value={networkJitter}
            onChange={(e) => setNetworkJitter(Number(e.target.value))}
            aria-label="Simulated Cloud Network Round-Trip Time"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-sm bg-el-border accent-yellow-400"
          />
          <span className="text-[10px] text-el-fg-faint">Jittery (500ms)</span>
        </div>
      </div>

      {/* Waveform Comparison Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-el-border/80">
        {/* Track 1: ELEVEN Local 16kHz PCM Buffer */}
        <div className="p-6 sm:p-8 space-y-5 bg-el-bg/20">
          <div className="flex items-center justify-between border-b border-el-border/60 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-el-accent font-semibold">
                SYSTEM 1 · LOCAL DESKTOP PIPELINE
              </span>
              <h3 className="text-el-base font-semibold text-el-fg">
                ELEVEN 16kHz Lockless Ring Buffer
              </h3>
            </div>
            <span className="rounded-xs border border-el-signal-lime/40 bg-el-signal-lime/10 px-2 py-0.5 text-[10px] font-semibold text-el-signal-lime">
              {interrupted ? "INTERRUPTED IN 32ms" : "AI SPEAKING (16kHz PCM)"}
            </span>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="flex h-20 items-center justify-between gap-1 rounded-xs border border-el-border/80 bg-[#020408] px-4 py-2">
            {waveHeights.map((h, i) => (
              <motion.div
                key={i}
                animate={{
                  height: interrupted ? 2 : `${h}px`,
                  backgroundColor: interrupted ? "#22c55e" : "#00F0FF",
                  opacity: interrupted ? 0.35 : 0.85,
                }}
                transition={{ duration: 0.08 }}
                className="w-1.5 rounded-full"
              />
            ))}
          </div>

          {/* Local Latency Breakdown */}
          <div className="space-y-2 text-[11px] text-el-fg-muted">
            <div className="flex justify-between">
              <span>Local VAD Voice Ingestion:</span>
              <span className="font-mono text-el-fg font-semibold">{localVAD}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Network / Socket Jitter:</span>
              <span className="font-mono text-el-signal-lime font-semibold">0ms (Loopback Ring)</span>
            </div>
            <div className="flex justify-between">
              <span>Speculative Turn Invalidation:</span>
              <span className="font-mono text-el-fg font-semibold">{localModelIngest}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Direct DAC Buffer Truncation:</span>
              <span className="font-mono text-el-fg font-semibold">{localBufferMute}ms</span>
            </div>
            <div className="flex justify-between border-t border-el-border/60 pt-2 text-el-xs font-semibold text-el-signal-lime">
              <span>TOTAL BARGE-IN RESPONSE:</span>
              <span>{localTotal}ms (&lt;0.05s)</span>
            </div>
          </div>
        </div>

        {/* Track 2: Commercial Cloud WebSocket Assistant */}
        <div className="p-6 sm:p-8 space-y-5 bg-el-bg-raised/20">
          <div className="flex items-center justify-between border-b border-el-border/60 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-red-400 font-semibold">
                COMMERCIAL CLOUD WEBSOCKET API
              </span>
              <h3 className="text-el-base font-semibold text-el-fg">
                Remote Audio Stream (Opus / HTTP2)
              </h3>
            </div>
            <span className={`rounded-xs border px-2 py-0.5 text-[10px] font-semibold ${
              cloudOverrun
                ? "border-red-500/50 bg-red-500/10 text-red-400 animate-pulse"
                : interrupted
                ? "border-el-border bg-el-bg text-el-fg-faint"
                : "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
            }`}>
              {cloudOverrun
                ? `OVERRUN TALKING (${(cloudOverrunTimer / 1000).toFixed(2)}s)`
                : interrupted
                ? "FINALLY STOPPED"
                : "AI STREAMING FROM CLOUD"}
            </span>
          </div>

          {/* Cloud Animated Waveform Visualizer */}
          <div className="flex h-20 items-center justify-between gap-1 rounded-xs border border-el-border/80 bg-[#020408] px-4 py-2">
            {waveHeights.map((h, i) => (
              <motion.div
                key={i}
                animate={{
                  height: !cloudOverrun && interrupted ? 2 : `${h}px`,
                  backgroundColor: cloudOverrun ? "#ef4444" : "#f59e0b",
                  opacity: !cloudOverrun && interrupted ? 0.25 : 0.85,
                }}
                transition={{ duration: 0.12 }}
                className="w-1.5 rounded-full"
              />
            ))}
          </div>

          {/* Cloud Latency Breakdown */}
          <div className="space-y-2 text-[11px] text-el-fg-muted">
            <div className="flex justify-between">
              <span>Cloud Server VAD Trigger:</span>
              <span className="font-mono text-el-fg font-semibold">{cloudVAD}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Internet WebSocket RTT:</span>
              <span className="font-mono text-red-400 font-semibold">{cloudTransport}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Remote Queue Invalidation:</span>
              <span className="font-mono text-el-fg font-semibold">{cloudModelIngest}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Client Audio Buffer Drain:</span>
              <span className="font-mono text-el-fg font-semibold">{cloudBufferDrain}ms</span>
            </div>
            <div className="flex justify-between border-t border-el-border/60 pt-2 text-el-xs font-semibold text-red-400">
              <span>TOTAL BARGE-IN RESPONSE:</span>
              <span>{cloudTotal}ms (~{(cloudTotal / 1000).toFixed(2)}s)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Trigger Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-el-border/80 bg-el-bg-raised/90 p-5 sm:p-6 text-el-xs">
        <div className="space-y-1">
          <p className="text-el-fg font-semibold">
            {interrupted
              ? "Barge-in collision executed."
              : "AI is currently speaking. Click the button to interrupt mid-sentence."}
          </p>
          <p className="text-[11px] text-el-fg-faint">
            Notice how ELEVEN mutes in 32ms while cloud models suffer awkward conversational overrun.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {interrupted ? (
            <button
              type="button"
              onClick={handleReset}
              className="cursor-pointer rounded-xs border border-el-border bg-el-bg px-4 py-2 font-mono text-[11.5px] text-el-fg hover:text-el-accent hover:border-el-accent transition-colors"
            >
              Reset Audio Test ↺
            </button>
          ) : (
            <button
              type="button"
              onClick={handleInterrupt}
              disabled={interrupting}
              className="cursor-pointer rounded-xs bg-red-500 hover:bg-red-400 px-5 py-2 font-mono text-[11.5px] font-semibold text-white shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              {interrupting ? "Detecting Voice…" : "Speak / Interrupt AI (Barge-In) 🎙️"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
